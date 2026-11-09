<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/admin/fgmu" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <span class="text">FGMU Home</span>
      </router-link>
      <router-link to="/admin/fgmu/dispatched" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <span class="text">Dispatched Tickets</span>
      </router-link>
      <router-link to="/admin/fgmu/personnel" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span class="text">Personnel & Assignments</span>
      </router-link>
      <div class="mt-8 mb-4 px-4">
        <p class="text-xs font-black text-slate-500 uppercase tracking-wider">Archives</p>
      </div>
      <router-link to="/admin/fgmu/archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span class="text">Archived Tickets</span>
      </router-link>
    </template>

    <template #header-title>
      <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
        FGMU Dashboard
      </h2>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in pb-12">
        
        <!-- Outcome & Throughput Overview (Top 3 Cards + Timeframe Filter + Daily Breakdown) -->
        <div class="space-y-4">
          <!-- Filter Controls for Current Year & Daily -->
          <div class="flex flex-wrap items-center justify-end gap-2 px-1">
            <!-- Global Analytics View Toggle -->
            <div class="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 shadow-inner">
              <button
                type="button"
                @click="globalViewMode = 'numbers'"
                class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer min-h-[44px] flex items-center gap-1.5"
                :class="globalViewMode === 'numbers' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
                title="Display numbers and text breakdown"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                <span>Numbers</span>
              </button>
              <button
                type="button"
                @click="globalViewMode = 'graph'"
                class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer min-h-[44px] flex items-center gap-1.5"
                :class="globalViewMode === 'graph' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
                title="Display visual interactive graphs with point descriptions"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/></svg>
                <span>Graphs</span>
              </button>
            </div>

            <!-- Period Type Tabs -->
            <div data-tour="admin-timeframe-tabs" class="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 shadow-inner">
                <button
                  v-for="p in periodOptions"
                  :key="p.key"
                  @click="changePeriod(p.key)"
                  class="px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer min-h-[44px] touch-manipulation flex items-center justify-center"
                  :class="selectedPeriod === p.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
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
                  class="px-3.5 py-2 min-h-[44px] bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm cursor-pointer"
                />
                <div class="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 shadow-inner">
                  <button
                    type="button"
                    @click="selectToday"
                    class="px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer"
                    :class="selectedDate === todayDateString ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    @click="selectYesterday"
                    class="px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer text-slate-600 hover:text-slate-900"
                  >
                    Yesterday
                  </button>
                </div>
              </div>

              <!-- Month Selector (shown when selectedPeriod === 'month') -->
              <div v-if="selectedPeriod === 'month'" class="relative animate-fade-in">
                <select
                  v-model="selectedMonth"
                  @change="fetchStats"
                  class="appearance-none pl-3.5 pr-8 py-2 min-h-[44px] bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm cursor-pointer"
                >
                  <option v-for="m in monthOptions" :key="m.value" :value="m.value">
                    {{ m.label }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              <!-- Quarter Selector (shown when selectedPeriod === 'quarter') -->
              <div v-if="selectedPeriod === 'quarter'" class="relative animate-fade-in">
                <select
                  v-model="selectedQuarter"
                  @change="fetchStats"
                  class="appearance-none pl-3.5 pr-8 py-2 min-h-[44px] bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm cursor-pointer"
                >
                  <option v-for="q in quarterOptions" :key="q.value" :value="q.value">
                    {{ q.label }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
          </div>

          <!-- Top 4 Cards Grid (2x2) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <!-- 1. Unresolved Requests / Daily Unresolved Requests (Top Left) -->
            <div data-tour="admin-kpi-gauges" class="p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-300 shadow-sm flex flex-col justify-between">
              <div class="flex items-center mb-4">
                <span class="text-xs font-black text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full uppercase tracking-wider shrink-0 whitespace-nowrap shadow-2xs">
                  {{ selectedPeriod === 'day' ? 'Daily Unresolved' : 'Unresolved' }}
                </span>
              </div>
              <div>
                <h3 class="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums">{{ unresolvedCount }}</h3>
                <p class="text-xs sm:text-sm text-slate-600 font-bold uppercase tracking-wider mt-1">
                  {{ selectedPeriod === 'day' ? 'Daily Unresolved Requests' : 'Unresolved Requests' }}
                </p>
                <p v-if="selectedPeriod === 'day'" class="text-[11px] text-slate-400 font-medium mt-0.5">
                  Requests pending resolution on this day
                </p>
              </div>
            </div>

            <!-- 2. Resolved Tickets / Daily Completed Jobs (Top Right) -->
            <div class="p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-300 shadow-sm flex flex-col justify-between">
              <div class="flex items-center mb-4">
                <span class="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full uppercase tracking-wider shrink-0 whitespace-nowrap shadow-2xs">
                  {{ selectedPeriod === 'day' ? 'Daily Completed' : 'Completed' }}
                </span>
              </div>
              <div>
                <h3 class="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums">{{ stats.resolved || 0 }}</h3>
                <p class="text-xs sm:text-sm text-slate-600 font-bold uppercase tracking-wider mt-1">
                  {{ selectedPeriod === 'day' ? 'Daily Completed Jobs' : 'Resolved Tickets' }}
                </p>
                <p v-if="selectedPeriod === 'day'" class="text-[11px] text-slate-400 font-medium mt-0.5">
                  Jobs fulfilled &amp; resolved on this day
                </p>
              </div>
            </div>

            <!-- 3. Declined Requests / Daily Declined Requests (Bottom Left) -->
            <div 
              @click="router.push('/admin/fgmu/archives')" 
              class="p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-300 shadow-sm cursor-pointer hover:border-slate-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div class="flex items-center mb-4">
                <span class="text-xs font-black text-rose-800 bg-rose-100 border border-rose-300 px-3 py-1 rounded-full uppercase tracking-wider shrink-0 whitespace-nowrap shadow-2xs">
                  {{ selectedPeriod === 'day' ? 'Daily Declined' : 'Declined' }}
                </span>
              </div>
              <div>
                <h3 class="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums">{{ stats.declined || 0 }}</h3>
                <p class="text-xs sm:text-sm text-slate-600 font-bold uppercase tracking-wider mt-1">
                  {{ selectedPeriod === 'day' ? 'Daily Declined Requests' : 'Declined Requests' }}
                </p>
                <p v-if="selectedPeriod === 'day'" class="text-[11px] text-slate-400 font-medium mt-0.5">
                  Requests declined or archived on this day
                </p>
              </div>
            </div>

            <!-- 4. Total Requests / Daily Total Requests (Bottom Right) -->
            <div class="p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-300 shadow-sm flex flex-col justify-between">
              <div class="flex items-center mb-4">
                <span class="text-xs font-black text-slate-900 bg-slate-100 border border-slate-300 px-3 py-1 rounded-full uppercase tracking-wider shrink-0 whitespace-nowrap shadow-2xs">
                  {{ stats.filter?.label || (selectedPeriod === 'day' ? 'Daily' : 'All Time') }}
                </span>
              </div>
              <div>
                <h3 class="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums">{{ stats.total || 0 }}</h3>
                <p class="text-xs sm:text-sm text-slate-600 font-bold uppercase tracking-wider mt-1">
                  {{ selectedPeriod === 'day' ? 'Daily Total Requests' : 'Total Requests' }}
                </p>
                <p v-if="selectedPeriod === 'day'" class="text-[11px] text-slate-400 font-medium mt-0.5">
                  Requests submitted on this specific day
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
            data-tour="admin-daily-tracker"
            :global-view="globalViewMode"
            @select-day="selectBreakdownDay"
          />
        </div>

        <!-- Live Workload & Operations Status (2x2 Grid) -->
        <div class="space-y-4">
          <div class="flex items-center justify-between px-1">
            <div>
              <h3 data-tour="admin-workload-status" class="text-sm sm:text-base font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span class="w-2.5 h-5 rounded-full bg-emerald-600 shrink-0"></span>
                Live Workload &amp; Operations Status
              </h3>
            </div>
          </div>

          <!-- 2x2 Cards Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <!-- 1. Pending (Awaiting Approval) - Top Left -->
            <div 
              @click="router.push('/admin/fgmu/queues')"
              class="p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-200/80 shadow-md cursor-pointer hover:border-amber-300 transition-all flex flex-col justify-between"
            >
              <div class="flex items-center mb-4">
                <span class="text-xs font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider shrink-0 whitespace-nowrap">Pending</span>
              </div>
              <div>
                <h3 class="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums">{{ stats.pending || 0 }}</h3>
                <p class="text-xs sm:text-sm text-slate-600 font-bold uppercase tracking-wider mt-1">Awaiting Approval</p>
              </div>
            </div>

            <!-- 2. Approved (Awaiting Dispatch) - Top Right -->
            <div 
              @click="router.push('/admin/fgmu/approved-tickets')"
              class="p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-200/80 shadow-md cursor-pointer hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div class="flex items-center mb-4">
                <span class="text-xs font-black text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full uppercase tracking-wider shrink-0 whitespace-nowrap">Approved</span>
              </div>
              <div>
                <h3 class="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums">{{ stats.approved || 0 }}</h3>
                <p class="text-xs sm:text-sm text-slate-600 font-bold uppercase tracking-wider mt-1">Approved Requests</p>
              </div>
            </div>

            <!-- 3. Dispatched & Scheduled - Bottom Left -->
            <div 
              @click="router.push('/admin/fgmu/dispatched')"
              class="p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-200/80 shadow-md cursor-pointer hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div class="flex items-center mb-4">
                <span class="text-xs font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-wider shrink-0 whitespace-nowrap">Dispatched</span>
              </div>
              <div>
                <h3 class="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums">{{ stats.scheduled || 0 }}</h3>
                <p class="text-xs sm:text-sm text-slate-600 font-bold uppercase tracking-wider mt-1">Scheduled Jobs</p>
              </div>
            </div>

            <!-- 4. Active Dispatches (Work In Progress) - Bottom Right -->
            <div 
              @click="router.push('/admin/fgmu/active-tickets')"
              class="p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-200/80 shadow-md cursor-pointer hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div class="flex items-center mb-4">
                <span class="text-xs font-black text-emerald-800 bg-emerald-200/80 px-3 py-1 rounded-full uppercase tracking-wider shrink-0 whitespace-nowrap">Active</span>
              </div>
              <div>
                <h3 class="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums">{{ stats.active_working || 0 }}</h3>
                <p class="text-xs sm:text-sm text-slate-600 font-bold uppercase tracking-wider mt-1">Work In Progress</p>
              </div>
            </div>
          </div>
        </div>


        <!-- Main Analytics Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <!-- Performance Evaluation Averages -->
          <EvaluationAveragesCard
            :feedback-averages="stats?.feedback_averages"
            data-tour="admin-eval-averages"
            :global-view="globalViewMode"
          />

          <!-- Job Completion Health -->
          <JobCompletionHealthCard
            :stats="completionStats"
            data-tour="admin-completion-health"
            unit-code="FGMU"
            :global-view="globalViewMode"
          />

          <!-- Delay & Barrier Root Cause Analysis -->
          <div class="lg:col-span-2">
            <RootCauseAnalysisCard
              :delay-reasons-list="delayReasonsList"
              :non-completion-list="nonCompletionList"
              :approval-delay-list="approvalDelayList"
              data-tour="admin-root-cause"
              :global-view="globalViewMode"
            />
          </div>
        </div>

      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import DailyActivityTrackerCard from '@/components/analytics/DailyActivityTrackerCard.vue';
import EvaluationAveragesCard from '@/components/analytics/EvaluationAveragesCard.vue';
import JobCompletionHealthCard from '@/components/analytics/JobCompletionHealthCard.vue';
import RootCauseAnalysisCard from '@/components/analytics/RootCauseAnalysisCard.vue';
import api from '@/api/client';

const globalViewMode = ref('numbers');

const router = useRouter();
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

const showRootCauseDetails = ref(false);
let isAlive = true;
let statsRequestSeq = 0;
let statsAbort = null;

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
const selectedMonth = ref(new Date().getMonth() + 1);
const selectedQuarter = ref(Math.ceil((new Date().getMonth() + 1) / 3));
const selectedDate = ref(todayDateString);

const periodOptions = [
  { key: 'day', label: 'Daily' },
  { key: 'month', label: 'Monthly' },
  { key: 'quarter', label: 'Quarterly' },
  { key: 'year', label: `Annually (${currentYear})` },
  { key: 'all', label: 'All Time' }
];

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
  const requestId = ++statsRequestSeq;
  try {
    statsAbort?.abort('Superseded by newer FGMU stats fetch');
  } catch { /* noop */ }
  statsAbort = new AbortController();
  try {
    const params = {
      period: selectedPeriod.value,
      year: currentYear
    };
    if (selectedPeriod.value === 'quarter') {
      params.quarter = selectedQuarter.value;
    } else if (selectedPeriod.value === 'month') {
      params.month = selectedMonth.value;
    } else if (selectedPeriod.value === 'day') {
      params.date = selectedDate.value;
    }

    const response = await api.get('tickets/stats/FGMU', { params, signal: statsAbort.signal });
    if (requestId !== statsRequestSeq || !isAlive) return;
    if (response.data?.data?.stats) {
      stats.value = response.data.data.stats;
    }
  } catch (error) {
    if (error?.code === 'ERR_CANCELED' || error?.name === 'CanceledError' || error?.name === 'AbortError') return;
    console.error('Failed to fetch FGMU stats:', error);
  }
};
onMounted(() => {
  isAlive = true;
  fetchStats();
});

onUnmounted(() => {
  isAlive = false;
  statsRequestSeq++;
  try {
    statsAbort?.abort('FGMU dashboard unmounted');
  } catch { /* noop */ }
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

