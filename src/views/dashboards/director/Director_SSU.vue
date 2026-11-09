<template>
  <MainLayout>
    <template #sidebar-links>
      <DirectorSidebar />
    </template>

    <template #header-title>
      <h2 class="text-xl font-bold text-slate-900 tracking-tight truncate">
        SSU Analytics
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
            <!-- 1. Unresolved Reports / Daily Unresolved Reports (Top Left) -->
            <div data-tour="ssu-stats-cards" class="p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-100 dark:border-slate-800 shadow-md flex flex-col justify-between">
              <div class="flex items-center mb-4">
                <span class="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full uppercase tracking-tight shrink-0 whitespace-nowrap">
                  {{ selectedPeriod === 'day' ? 'Daily Unresolved' : 'Unresolved' }}
                </span>
              </div>
              <div>
                <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ unresolvedCount }}</h3>
                <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                  {{ selectedPeriod === 'day' ? 'Daily Unresolved Reports' : timeframeLabel }}
                </p>
                <p v-if="selectedPeriod === 'day'" class="text-[10px] text-slate-400 font-medium mt-0.5">
                  {{ timeframeLabel }}
                </p>
              </div>
            </div>

            <!-- 2. Resolved Reports / Daily Completed (Top Right) -->
            <div class="p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-100 shadow-md flex flex-col justify-between">
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

            <!-- 3. Declined Reports / Daily Declined (Bottom Left) -->
            <div class="p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-100 shadow-md flex flex-col justify-between">
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
            <div class="p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-100 dark:border-slate-800 shadow-md flex flex-col justify-between">
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
            accent-color="rose"
            data-tour="ssu-daily-tracker"
            :global-view="globalViewMode"
            @select-day="selectBreakdownDay"
          />
        </div>

        <!-- Live Workload & Operations Status (Bottom Cards) -->
        <div class="space-y-4">
          <div class="flex items-center justify-between px-1">
            <div>
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <span class="w-2 h-4 rounded-full bg-rose-600"></span>
                Live Workload &amp; Operations Status
              </h3>
            </div>
          </div>


          <!-- Bottom 2 Cards Grid: Pending, Processing -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <!-- 1. Pending -->
            <div class="p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-100 shadow-md flex flex-col justify-between">
              <div class="flex items-center mb-4">
                <span class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full uppercase tracking-tight shrink-0 whitespace-nowrap">Pending</span>
              </div>
              <div>
                <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.pending || 0 }}</h3>
                <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Awaiting Review</p>
              </div>
            </div>

            <!-- 2. Processing (Under Investigation) -->
            <div class="p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-100 shadow-md flex flex-col justify-between">
              <div class="flex items-center mb-4">
                <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-tight shrink-0 whitespace-nowrap">Processing</span>
              </div>
              <div>
                <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.processing || 0 }}</h3>
                <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Under Investigation</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Charts Grid -->
        <div class="grid grid-cols-1 gap-8">
          <!-- Incident Heatmap & Point Guide -->
          <IncidentHeatmapCard
            :incident-heatmap="stats.incident_heatmap"
            data-tour="ssu-incident-heatmap"
            :global-view="globalViewMode"
          />
        </div>

      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed, nextTick } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import DirectorSidebar from './DirectorSidebar.vue';
import api from '@/api/client';
import DailyActivityTrackerCard from '@/components/analytics/DailyActivityTrackerCard.vue';
import IncidentHeatmapCard from '@/components/analytics/IncidentHeatmapCard.vue';

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

let isAlive = true;
let statsRequestSeq = 0;
let statsAbort = null;

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
  if (selectedPeriod.value === 'all') return 'All-Time Historical';
  if (selectedPeriod.value === 'year') return `Full Year ${selectedYear.value}`;
  if (selectedPeriod.value === 'quarter') return `Q${selectedQuarter.value} ${selectedYear.value}`;
  if (selectedPeriod.value === 'month') {
    const m = monthOptions.find(opt => opt.value === selectedMonth.value);
    return `${m ? m.label : 'Month'} ${selectedYear.value}`;
  }
  if (selectedPeriod.value === 'day') {
    return selectedDate.value === todayDateString ? 'Today' : selectedDate.value;
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

const renderCharts = () => {
  // Chart rendering is managed internally by IncidentHeatmapCard & DailyActivityTrackerCard
};

const fetchStats = async () => {
  const requestId = ++statsRequestSeq;
  try {
    statsAbort?.abort('Superseded by newer Director SSU stats fetch');
  } catch { /* noop */ }
  statsAbort = new AbortController();
  try {
    const params = {
      period: selectedPeriod.value
    };
    if (selectedPeriod.value === 'day') {
      params.date = selectedDate.value;
    } else if (selectedPeriod.value !== 'all') {
      params.year = selectedYear.value;
    }
    if (selectedPeriod.value === 'quarter') {
      params.quarter = selectedQuarter.value;
    } else if (selectedPeriod.value === 'month') {
      params.month = selectedMonth.value;
    }

    const response = await api.get('tickets/stats/SSU', { params, signal: statsAbort.signal });
    if (requestId !== statsRequestSeq || !isAlive) return;
    if (response.data?.data?.stats) {
      stats.value = response.data.data.stats;
      await nextTick();
      if (isAlive && requestId === statsRequestSeq) renderCharts();
    }
  } catch (error) {
    if (error?.code === 'ERR_CANCELED' || error?.name === 'CanceledError' || error?.name === 'AbortError') return;
    console.error('Failed to fetch SSU stats:', error);
  }
};

onMounted(() => {
  fetchStats();
});

onUnmounted(() => {
  isAlive = false;
  statsRequestSeq++;
  try {
    statsAbort?.abort('Director SSU unmounted');
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
