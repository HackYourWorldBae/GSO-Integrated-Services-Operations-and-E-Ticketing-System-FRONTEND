<template>
  <MainLayout>
    <template #sidebar-links>
      <DirectorSidebar />
    </template>

    <template #header-title>
      <h2 class="text-xl font-bold text-slate-900 tracking-tight truncate">
        FGMU Analytics
      </h2>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in pb-12">
        
        <!-- Outcome & Throughput Overview (Top 3 Cards + Historical Drilldown Filter) -->
        <div class="space-y-4">
          <!-- Filter Controls (Historical Multi-Year + Period + Daily) -->
          <div class="flex flex-wrap items-center justify-end gap-2 px-1">
            <!-- Global Analytics View Toggle -->
            <div class="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 shadow-inner">
              <button
                type="button"
                @click="globalViewMode = 'numbers'"
                class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer min-h-[40px] flex items-center gap-1.5"
                :class="globalViewMode === 'numbers' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
                title="Display numbers and text breakdown"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                <span>Numbers</span>
              </button>
              <button
                type="button"
                @click="globalViewMode = 'graph'"
                class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer min-h-[40px] flex items-center gap-1.5"
                :class="globalViewMode === 'graph' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
                title="Display visual interactive graphs with point descriptions"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/></svg>
                <span>Graphs</span>
              </button>
            </div>

            <!-- Period Type Tabs -->
            <div class="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 shadow-inner w-full sm:w-auto">
                <button
                  v-for="p in periodOptions"
                  :key="p.key"
                  @click="changePeriod(p.key)"
                  class="flex-1 sm:flex-none px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer min-h-[40px] touch-manipulation flex items-center justify-center"
                  :class="selectedPeriod === p.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'"
                >
                  {{ p.label }}
                </button>
              </div>

              <!-- Day Date Picker (shown when selectedPeriod === 'day') -->
              <div v-if="selectedPeriod === 'day'" class="flex flex-wrap items-center gap-1.5 animate-fade-in">
                <input
                  type="date"
                  v-model="selectedDate"
                  :max="todayDateString"
                  @change="fetchStats"
                  class="px-3 py-2 min-h-[40px] bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm cursor-pointer"
                />
                <div class="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 shadow-inner">
                  <button
                    type="button"
                    @click="selectToday"
                    class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer"
                    :class="selectedDate === todayDateString ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    @click="selectYesterday"
                    class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer text-slate-600 hover:text-slate-900"
                  >
                    Yesterday
                  </button>
                </div>
              </div>

              <!-- Year Selector (visible when selectedPeriod !== 'all' && selectedPeriod !== 'day') -->
              <div v-if="selectedPeriod !== 'all' && selectedPeriod !== 'day'" class="relative flex-1 sm:flex-none">
                <select
                  v-model="selectedYear"
                  @change="fetchStats"
                  class="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-base sm:text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm cursor-pointer min-h-[44px]"
                >
                  <option v-for="yr in availableYears" :key="yr" :value="yr">
                    Year {{ yr }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              <!-- Month Selector (shown when selectedPeriod === 'month') -->
              <div v-if="selectedPeriod === 'month'" class="relative flex-1 sm:flex-none">
                <select
                  v-model="selectedMonth"
                  @change="fetchStats"
                  class="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-base sm:text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm cursor-pointer min-h-[44px]"
                >
                  <option v-for="m in monthOptions" :key="m.value" :value="m.value">
                    {{ m.label }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              <!-- Quarter Selector (shown when selectedPeriod === 'quarter') -->
              <div v-if="selectedPeriod === 'quarter'" class="relative flex-1 sm:flex-none">
                <select
                  v-model="selectedQuarter"
                  @change="fetchStats"
                  class="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-base sm:text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm cursor-pointer min-h-[44px]"
                >
                  <option v-for="q in quarterOptions" :key="q.value" :value="q.value">
                    {{ q.label }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
          </div>

          <!-- Top 4 Cards Grid: Unresolved, Resolved, Declined, Total (2x2) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <!-- 1. Unresolved Requests / Daily Unresolved Requests (Top Left) -->
            <div data-tour="fgmu-stats-cards" class="p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
              <div class="flex items-center mb-4">
                <span class="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full uppercase tracking-tight shrink-0 whitespace-nowrap">
                  {{ selectedPeriod === 'day' ? 'Daily Unresolved' : 'Unresolved' }}
                </span>
              </div>
              <div>
                <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ unresolvedCount }}</h3>
                <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                  {{ selectedPeriod === 'day' ? 'Daily Unresolved Requests' : timeframeLabel }}
                </p>
                <p v-if="selectedPeriod === 'day'" class="text-[10px] text-slate-400 font-medium mt-0.5">
                  {{ timeframeLabel }}
                </p>
              </div>
            </div>

            <!-- 2. Resolved Tickets / Daily Completed Jobs (Top Right) -->
            <div class="p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
              <div class="flex items-center mb-4">
                <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-tight shrink-0 whitespace-nowrap">
                  {{ selectedPeriod === 'day' ? 'Daily Completed' : 'Completed' }}
                </span>
              </div>
              <div>
                <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.resolved || 0 }}</h3>
                <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                  {{ selectedPeriod === 'day' ? 'Daily Completed Jobs' : timeframeLabel }}
                </p>
                <p v-if="selectedPeriod === 'day'" class="text-[10px] text-slate-400 font-medium mt-0.5">
                  {{ timeframeLabel }}
                </p>
              </div>
            </div>

            <!-- 3. Declined Requests / Daily Declined Requests (Bottom Left) -->
            <div class="p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
              <div class="flex items-center mb-4">
                <span class="text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full uppercase tracking-tight shrink-0 whitespace-nowrap">
                  {{ selectedPeriod === 'day' ? 'Daily Declined' : 'Declined' }}
                </span>
              </div>
              <div>
                <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.declined || 0 }}</h3>
                <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                  {{ selectedPeriod === 'day' ? 'Daily Declined Requests' : timeframeLabel }}
                </p>
                <p v-if="selectedPeriod === 'day'" class="text-[10px] text-slate-400 font-medium mt-0.5">
                  {{ timeframeLabel }}
                </p>
              </div>
            </div>

            <!-- 4. Total Requests / Daily Total Requests (Bottom Right) -->
            <div class="p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
              <div class="flex items-center mb-4">
                <span class="text-[10px] font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-tight shrink-0 whitespace-nowrap">
                  {{ selectedPeriod === 'day' ? 'Daily Requests' : 'Total Requests' }}
                </span>
              </div>
              <div>
                <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.total || 0 }}</h3>
                <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                  {{ selectedPeriod === 'day' ? 'Daily Total Requests' : timeframeLabel }}
                </p>
                <p v-if="selectedPeriod === 'day'" class="text-[10px] text-slate-400 font-medium mt-0.5">
                  {{ timeframeLabel }}
                </p>
              </div>
            </div>
          </div>

          <!-- 7-Day Recent Daily Performance Activity Breakdown -->
          <DailyActivityTrackerCard
            v-if="stats.daily_breakdown && stats.daily_breakdown.length > 0"
            :daily-breakdown="stats.daily_breakdown"
            :selected-period="selectedPeriod"
            :selected-date="selectedDate"
            accent-color="emerald"
            data-tour="fgmu-daily-tracker"
            :global-view="globalViewMode"
            @select-day="selectBreakdownDay"
          />
        </div>

        <!-- Live Workload & Operations Status (2x2 Grid) -->
        <div class="space-y-4">
          <div class="flex items-center justify-between px-1">
            <div>
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <span class="w-2 h-4 rounded-full bg-blue-600"></span>
                Live Workload &amp; Operations Status
              </h3>
            </div>
          </div>

          <!-- 2x2 Cards Grid: Pending, Approved, Dispatched, Active -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <!-- 1. Pending (Top Left) -->
            <div class="p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
              <div class="flex items-center mb-4">
                <span class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full uppercase tracking-tight shrink-0 whitespace-nowrap">Pending</span>
              </div>
              <div>
                <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.pending || 0 }}</h3>
                <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Awaiting Approval</p>
              </div>
            </div>

            <!-- 2. Approved (Top Right) -->
            <div class="p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
              <div class="flex items-center mb-4">
                <span class="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-tight shrink-0 whitespace-nowrap">Approved</span>
              </div>
              <div>
                <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.approved || 0 }}</h3>
                <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Approved Requests</p>
              </div>
            </div>

            <!-- 3. Dispatched & Scheduled (Bottom Left) -->
            <div class="p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
              <div class="flex items-center mb-4">
                <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-tight shrink-0 whitespace-nowrap">Dispatched</span>
              </div>
              <div>
                <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.scheduled || 0 }}</h3>
                <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Scheduled Jobs</p>
              </div>
            </div>

            <!-- 4. Active Dispatches (Bottom Right) -->
            <div class="p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
              <div class="flex items-center mb-4">
                <span class="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full uppercase tracking-tight shrink-0 whitespace-nowrap">Active</span>
              </div>
              <div>
                <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.active_working || 0 }}</h3>
                <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Work In Progress</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Evaluation Averages & Job Completion Health -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <!-- Performance Evaluation Averages -->
          <EvaluationAveragesCard
            :feedback-averages="stats?.feedback_averages"
            data-tour="fgmu-eval-averages"
            :global-view="globalViewMode"
          />

          <!-- Job Completion Health -->
          <JobCompletionHealthCard
            :stats="completionStats"
            data-tour="fgmu-completion-health"
            unit-code="FGMU"
            :global-view="globalViewMode"
          />

          <!-- Delay & Barrier Root Cause Analysis (Ranked Words & Numbers / Graph) -->
          <div class="lg:col-span-2">
            <RootCauseAnalysisCard
              :delay-reasons-list="delayReasonsList"
              :non-completion-list="nonCompletionList"
              :approval-delay-list="approvalDelayList"
              data-tour="fgmu-root-cause"
              :global-view="globalViewMode"
            />
          </div>

        </div>

      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import DirectorSidebar from './DirectorSidebar.vue';
import api from '@/api/client';
import DailyActivityTrackerCard from '@/components/analytics/DailyActivityTrackerCard.vue';
import EvaluationAveragesCard from '@/components/analytics/EvaluationAveragesCard.vue';
import JobCompletionHealthCard from '@/components/analytics/JobCompletionHealthCard.vue';
import RootCauseAnalysisCard from '@/components/analytics/RootCauseAnalysisCard.vue';

const globalViewMode = ref('numbers');
const stats = ref({});

const unresolvedCount = computed(() => {
  if (stats.value?.unresolved !== undefined && stats.value?.unresolved !== null) {
    return Number(stats.value.unresolved) || 0;
  }
  const total = Number(stats.value?.total || 0);
  const resolved = Number(stats.value?.resolved || 0);
  const declined = Number(stats.value?.declined || 0);
  return Math.max(0, total - (resolved + declined));
});

const safeVal = (val) => parseFloat(val) || 0;

const formatReason = (code) => {
  if (!code) return 'None';
  const map = {
    personnelAbsent: "Personnel Absent",
    extendedBreak: "Extended Break Period",
    additionalWork: "Additional Work Requested",
    lackWorkingDays: "Lack of Working Days",
    lackMaterials: "Lack of Materials / Tools",
    lackSkills: "Lack of Skills / Expertise"
  };
  return map[code] || code.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

const completionStats = computed(() => {
  const health = stats.value?.completion_health || [];
  const earlyFinished = parseInt(health.find(h => h.completion_status === 'early')?.count || 0);
  const onTime = parseInt(health.find(h => h.completion_status === 'on-time')?.count || 0);
  const beyondTime = parseInt(health.find(h => h.completion_status === 'beyond-time')?.count || 0);
  const notCompleted = parseInt(health.find(h => h.completion_status === 'not-completed')?.count || 0);
  const total = earlyFinished + onTime + beyondTime + notCompleted;
  
  const getPercent = (count) => total > 0 ? Math.round((count / total) * 100) : 0;
  
  return {
    earlyFinished,
    onTime,
    beyondTime,
    notCompleted,
    total,
    earlyFinishedPercent: getPercent(earlyFinished),
    onTimePercent: getPercent(onTime),
    beyondTimePercent: getPercent(beyondTime),
    notCompletedPercent: getPercent(notCompleted)
  };
});

const approvalDelayList = computed(() => {
  const items = stats.value?.approval_delay_reasons || [];
  const total = items.reduce((acc, r) => acc + parseInt(r.count || 0), 0);
  return items.map(r => ({
    name: r.reason_text || r.reason || 'General Delay',
    count: parseInt(r.count || 0),
    percent: total > 0 ? Math.round((parseInt(r.count || 0) / total) * 100) : 0
  })).sort((a, b) => b.count - a.count);
});

const delayReasonsList = computed(() => {
  const items = stats.value?.delay_reasons || [];
  const total = items.reduce((acc, r) => acc + parseInt(r.count || 0), 0);
  return items.map(r => ({
    code: r.reason_code,
    name: formatReason(r.reason_code),
    count: parseInt(r.count || 0),
    percent: total > 0 ? Math.round((parseInt(r.count || 0) / total) * 100) : 0
  })).sort((a, b) => b.count - a.count);
});

const nonCompletionList = computed(() => {
  const items = stats.value?.non_completion || [];
  const total = items.reduce((acc, r) => acc + parseInt(r.count || 0), 0);
  return items.map(r => ({
    code: r.reason_code,
    name: formatReason(r.reason_code),
    count: parseInt(r.count || 0),
    percent: total > 0 ? Math.round((parseInt(r.count || 0) / total) * 100) : 0
  })).sort((a, b) => b.count - a.count);
});

const formatDateToYMD = (date) => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

const currentYear = new Date().getFullYear();
const todayDateString = formatDateToYMD(new Date());

const selectedPeriod = ref('day');
const selectedYear = ref(currentYear);
const selectedMonth = ref(new Date().getMonth() + 1);
const selectedQuarter = ref(Math.ceil((new Date().getMonth() + 1) / 3));
const selectedDate = ref(todayDateString);

const periodOptions = [
  { key: 'day', label: 'Daily' },
  { key: 'month', label: 'Monthly' },
  { key: 'quarter', label: 'Quarterly' },
  { key: 'year', label: 'Annually' },
  { key: 'all', label: 'All Time' }
];

const availableYears = computed(() => {
  const years = stats.value?.available_years;
  if (Array.isArray(years) && years.length > 0) {
    return years;
  }
  return [currentYear];
});

const quarterOptions = [
  { value: 1, label: 'Q1 (Jan - Mar)' },
  { value: 2, label: 'Q2 (Apr - Jun)' },
  { value: 3, label: 'Q3 (Jul - Sep)' },
  { value: 4, label: 'Q4 (Oct - Dec)' }
];

const monthOptions = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
];

const timeframeLabel = computed(() => {
  if (selectedPeriod.value === 'day') {
    return stats.value?.filter?.label || (selectedDate.value === todayDateString ? `Today (${selectedDate.value})` : selectedDate.value);
  }
  if (selectedPeriod.value === 'all') return 'All-Time Historical';
  if (selectedPeriod.value === 'year') return `Full Year ${selectedYear.value}`;
  if (selectedPeriod.value === 'quarter') return `Q${selectedQuarter.value} ${selectedYear.value}`;
  if (selectedPeriod.value === 'month') {
    const m = monthOptions.find(opt => opt.value === selectedMonth.value);
    return `${m ? m.label : 'Month'} ${selectedYear.value}`;
  }
  return 'Filtered Period';
});

const changePeriod = (key) => {
  selectedPeriod.value = key;
  fetchStats();
};

const selectToday = () => {
  selectedPeriod.value = 'day';
  selectedDate.value = todayDateString;
  fetchStats();
};

const selectYesterday = () => {
  selectedPeriod.value = 'day';
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  selectedDate.value = formatDateToYMD(yesterday);
  fetchStats();
};

const selectBreakdownDay = (dayDate) => {
  selectedPeriod.value = 'day';
  selectedDate.value = dayDate;
  fetchStats();
};

const fetchStats = async () => {
  try {
    const params = {
      period: selectedPeriod.value
    };
    if (selectedPeriod.value !== 'all' && selectedPeriod.value !== 'day') {
      params.year = selectedYear.value;
    }
    if (selectedPeriod.value === 'quarter') {
      params.quarter = selectedQuarter.value;
    } else if (selectedPeriod.value === 'month') {
      params.month = selectedMonth.value;
    } else if (selectedPeriod.value === 'day') {
      params.date = selectedDate.value;
    }

    const response = await api.get('tickets/stats/FGMU', { params });
    if (response.data?.data?.stats) {
      stats.value = response.data.data.stats;
    }
  } catch (error) {
    console.error('Failed to fetch FGMU stats:', error);
  }
};

onMounted(() => {
  fetchStats();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
