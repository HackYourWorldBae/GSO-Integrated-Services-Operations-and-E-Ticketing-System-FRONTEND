<template>
  <MainLayout>
    <template #sidebar-links>
      <DirectorSidebar />
    </template>

    <template #header-title>
      <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
        Director's Dashboard
      </h2>
    </template>

    <template #main-content>
      <div class="space-y-6 sm:space-y-8 animate-fade-in pb-12 max-w-[1600px] mx-auto">

        <!-- ================================================================= -->
        <!-- EXECUTIVE ANALYTICS SUMMARY & OFFICIAL REPORTS SECTION           -->
        <!-- ================================================================= -->
        <div class="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-6 sm:space-y-8">
          
          <!-- Section Header & Export Toolbar -->
          <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6 pb-6 border-b border-slate-100">
            <div class="space-y-1">
              <h3 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Performance Overview &amp; Reports
              </h3>
            </div>

            <!-- Action Toolbar: PDF Export -->
            <div class="flex flex-wrap items-center gap-3 shrink-0 w-full xl:w-auto">

              <button
                data-tour="director-btn-report"
                @click="handleDownloadReport"
                :disabled="isGeneratingPdf || !executiveAnalytics"
                class="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-emerald-800 text-white text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-h-[44px] touch-manipulation whitespace-nowrap"
                title="Generate and download official PDF report"
              >
                <svg v-if="isGeneratingPdf" class="animate-spin h-4 w-4 text-emerald-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>{{ isGeneratingPdf ? 'Generating PDF...' : `Generate & Download ${activeTimeFilterLabel} Report` }}</span>
              </button>
            </div>
          </div>

          <!-- Interactive Period & Timeframe Selector Bar -->
          <div data-tour="director-timeframe-selector" class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <!-- Period Tabs (Segmented Control) -->
            <div class="flex flex-wrap items-center gap-2">
              <div class="inline-flex p-1 rounded-xl bg-slate-200/60 border border-slate-200/80 gap-1 w-full sm:w-auto">
                <button
                  v-for="p in periodOptions"
                  :key="p.key"
                  @click="changePeriod(p.key)"
                  class="flex-1 sm:flex-none px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer min-h-[44px] touch-manipulation flex items-center justify-center"
                  :class="selectedPeriod === p.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
                >
                  {{ p.label }}
                </button>
              </div>
            </div>

            <!-- Dynamic Selectors (Year, Month, Quarter), View Mode Toggle & Refresh -->
            <div class="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <!-- Global Analytics View Toggle -->
              <div class="inline-flex p-1 rounded-xl bg-slate-200/60 border border-slate-200/80 gap-1">
                <button
                  type="button"
                  @click="globalViewMode = 'numbers'"
                  class="px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer min-h-[44px] flex items-center gap-1.5"
                  :class="globalViewMode === 'numbers' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
                  title="Display numbers, tables, and metric cards"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  <span>Numbers</span>
                </button>
                <button
                  type="button"
                  @click="globalViewMode = 'graph'"
                  class="px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer min-h-[44px] flex items-center gap-1.5"
                  :class="globalViewMode === 'graph' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
                  title="Display visual interactive graphs with point descriptions"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/></svg>
                  <span>Graphs</span>
                </button>
              </div>

              <!-- Year Selector -->
              <div v-if="selectedPeriod !== 'all'" class="relative flex-1 sm:flex-none">
                <select
                  v-model="selectedYear"
                  @change="fetchExecutiveAnalytics"
                  class="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm cursor-pointer hover:border-slate-300 transition-colors min-h-[44px]"
                >
                  <option v-for="yr in availableYears" :key="yr" :value="yr">
                    Year {{ yr }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              <!-- Month Selector -->
              <div v-if="selectedPeriod === 'month'" class="relative flex-1 sm:flex-none">
                <select
                  v-model="selectedMonth"
                  @change="fetchExecutiveAnalytics"
                  class="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm cursor-pointer hover:border-slate-300 transition-colors min-h-[44px]"
                >
                  <option v-for="m in monthOptions" :key="m.value" :value="m.value">
                    {{ m.label }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              <!-- Quarter Selector -->
              <div v-if="selectedPeriod === 'quarter'" class="relative flex-1 sm:flex-none">
                <select
                  v-model="selectedQuarter"
                  @change="fetchExecutiveAnalytics"
                  class="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm cursor-pointer hover:border-slate-300 transition-colors min-h-[44px]"
                >
                  <option v-for="q in quarterOptions" :key="q.value" :value="q.value">
                    {{ q.label }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              <!-- Refresh Button -->
              <button
                @click="handleManualRefresh"
                :disabled="isRefreshing"
                class="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-600 rounded-xl transition-all cursor-pointer shadow-sm group touch-manipulation shrink-0 active:scale-95 disabled:opacity-50"
                title="Refresh Report Data"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 transition-transform"
                  :class="{ 'animate-spin text-purple-600': isRefreshing }"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Cross-Unit Performance Matrix -->
          <CrossUnitPerformanceCard
            :executive-analytics="executiveAnalytics"
            :kpi-period-label="kpiPeriodLabel"
            :global-view="globalViewMode"
          />
        </div>

        <!-- Operational Insights (Service Distribution & SLA Health) -->
        <div class="space-y-6 pt-2">
          <!-- Service Workload Share by Sub-Unit -->
          <ServicesBreakdownCard
            :displayed-service-groups="displayedServiceGroups"
            :service-breakdown="executiveAnalytics?.service_breakdown"
            :service-tabs="serviceTabs"
            :active-service-tab="activeServiceTab"
            :global-view="globalViewMode"
            @update:active-service-tab="activeServiceTab = $event"
          />

          <!-- Service Completion Rate & Ratings -->
          <div class="p-5 sm:p-6 lg:p-8 rounded-2xl bg-white border border-slate-200/80 space-y-6 shadow-sm">
            <div class="pb-4 border-b border-slate-100 flex items-center justify-between">
              <h4 class="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wider">Service Completion Rate &amp; Ratings</h4>
            </div>

            <!-- Two Distinct Sub-Unit Cards: FGMU & LEAU -->
            <div class="flex flex-col gap-6 w-full">
              <!-- FGMU Card -->
              <UnitRatingsSummaryCard
                unit-code="FGMU"
                unit-title="Facilities Management"
                unit-subtitle="Facilities &amp; Grounds Management Unit"
                :health-stats="getUnitCompletionHealth('FGMU')"
                :ratings="executiveAnalytics?.units?.FGMU?.avg_ratings"
                :global-view="globalViewMode"
              />

              <!-- LEAU Card -->
              <UnitRatingsSummaryCard
                unit-code="LEAU"
                unit-title="Landscaping &amp; Environment"
                unit-subtitle="Landscaping &amp; Environmental Aesthetics Unit"
                :health-stats="getUnitCompletionHealth('LEAU')"
                :ratings="executiveAnalytics?.units?.LEAU?.avg_ratings"
                :global-view="globalViewMode"
              />
            </div>
          </div>
        </div>

      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import DirectorSidebar from './DirectorSidebar.vue';
import CrossUnitPerformanceCard from '@/components/analytics/CrossUnitPerformanceCard.vue';
import ServicesBreakdownCard from '@/components/analytics/ServicesBreakdownCard.vue';
import UnitRatingsSummaryCard from '@/components/analytics/UnitRatingsSummaryCard.vue';
import { toast } from 'vue3-toastify';
import api from '@/api/client';

// View Mode (numbers vs graph)
const globalViewMode = ref('numbers');

// Executive Analytics State
const executiveAnalytics = ref(null);
const isGeneratingPdf = ref(false);
const isRefreshing = ref(false);
let isAlive = true;
let analyticsRequestSeq = 0;
let analyticsAbort = null;



// Date / Period Controls
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const currentQuarter = Math.ceil(currentMonth / 3);

const selectedPeriod = ref('month');
const selectedYear = ref(currentYear);
const selectedMonth = ref(currentMonth);
const selectedQuarter = ref(currentQuarter);
const selectedUnitScope = ref('ALL');

const activeServiceTab = ref('ALL');

const serviceTabs = [
  { key: 'ALL',  label: 'All Units' },
  { key: 'FGMU', label: 'FGMU' },
  { key: 'LEAU', label: 'LEAU' },
  { key: 'SSU',  label: 'SSU' },
];

const displayedServiceGroups = computed(() => {
  const byUnit = executiveAnalytics.value?.service_breakdown_by_unit;
  if (!byUnit) {
    return [];
  }

  if (activeServiceTab.value === 'ALL') {
    return [
      { code: 'FGMU', name: byUnit.FGMU?.unit_name || 'Facilities & Grounds Management Unit', total: byUnit.FGMU?.total || 0, services: byUnit.FGMU?.services || [], color: 'blue' },
      { code: 'LEAU', name: byUnit.LEAU?.unit_name || 'Landscaping & Environmental Aesthetics Unit', total: byUnit.LEAU?.total || 0, services: byUnit.LEAU?.services || [], color: 'emerald' },
      { code: 'SSU',  name: byUnit.SSU?.unit_name || 'Safety & Security Services Unit', total: byUnit.SSU?.total || 0, services: byUnit.SSU?.services || [], color: 'amber' },
    ].filter(g => g.services.length > 0);
  }

  const selected = byUnit[activeServiceTab.value];
  if (!selected) return [];
  const colorMap = { FGMU: 'blue', LEAU: 'emerald', SSU: 'amber' };
  return [
    {
      code: activeServiceTab.value,
      name: selected.unit_name,
      total: selected.total || 0,
      services: selected.services || [],
      color: colorMap[activeServiceTab.value] || 'emerald',
    }
  ];
});

const periodOptions = [
  { key: 'month',   label: 'Monthly' },
  { key: 'quarter', label: 'Quarterly' },
  { key: 'year',    label: 'Annual' },
  { key: 'all',     label: 'All-Time' },
];

const availableYears = computed(() => {
  const years = executiveAnalytics.value?.available_years;
  if (Array.isArray(years) && years.length > 0) {
    return years;
  }
  return [currentYear];
});

const quarterOptions = [
  { value: 1, label: 'Q1 (Jan - Mar)' },
  { value: 2, label: 'Q2 (Apr - Jun)' },
  { value: 3, label: 'Q3 (Jul - Sep)' },
  { value: 4, label: 'Q4 (Oct - Dec)' },
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
  { value: 12, label: 'December' },
];

const kpiPeriodLabel = computed(() => {
  const rawLabel = executiveAnalytics.value?.filter?.label;
  if (!rawLabel || selectedPeriod.value === 'all' || /all[- ]?time/i.test(rawLabel)) {
    return 'All-Time';
  }
  if (selectedPeriod.value === 'quarter' && selectedQuarter.value) {
    return `Q${selectedQuarter.value} ${selectedYear.value}`;
  }
  if (selectedPeriod.value === 'year') {
    return `Year ${selectedYear.value}`;
  }
  if (selectedPeriod.value === 'month') {
    const m = monthOptions.find((opt) => opt.value === Number(selectedMonth.value));
    return m ? `${m.label.slice(0, 3)} ${selectedYear.value}` : rawLabel;
  }
  return rawLabel;
});

const activeTimeFilterLabel = computed(() => {
  const p = periodOptions.find((opt) => opt.key === selectedPeriod.value);
  return p ? p.label : 'Operations';
});

const changePeriod = (key) => {
  selectedPeriod.value = key;
  fetchExecutiveAnalytics();
};

const getUnresolvedCount = (unit) => {
  if (!unit) return 0;
  if (unit.unresolved !== undefined && unit.unresolved !== null) return unit.unresolved;
  const total = Number(unit.total ?? 0);
  const resolved = Number(unit.resolved ?? 0);
  const declined = Number(unit.declined ?? 0);
  return Math.max(0, total - (resolved + declined));
};

const getOverallUnresolvedCount = () => {
  const summary = executiveAnalytics.value?.summary;
  if (!summary) return 0;
  if (summary.total_unresolved !== undefined && summary.total_unresolved !== null) return summary.total_unresolved;
  const total = Number(summary.total_requests ?? 0);
  const resolved = Number(summary.total_resolved ?? 0);
  const declined = Number(summary.total_declined ?? 0);
  return Math.max(0, total - (resolved + declined));
};

const getUnitCompletionHealth = (unitCode) => {
  const byUnit = executiveAnalytics.value?.units?.[unitCode]?.completion_health 
              || executiveAnalytics.value?.completion_health_by_unit?.[unitCode];
  const unitTotal = byUnit 
    ? (Number(byUnit.total ?? 0) || (Number(byUnit.early_finished ?? 0) + Number(byUnit.on_time ?? 0) + Number(byUnit.beyond_time ?? 0) + Number(byUnit.not_completed ?? 0)))
    : 0;

  if (byUnit && unitTotal > 0) {
    return byUnit;
  }

  // Graceful fallback: If this unit is FGMU and LEAU has 0 records while system completion_health has data, fallback to system health
  if (unitCode === 'FGMU') {
    const leauHealth = executiveAnalytics.value?.units?.LEAU?.completion_health 
                    || executiveAnalytics.value?.completion_health_by_unit?.LEAU;
    const leauTotal = leauHealth 
      ? (Number(leauHealth.total ?? 0) || (Number(leauHealth.early_finished ?? 0) + Number(leauHealth.on_time ?? 0) + Number(leauHealth.beyond_time ?? 0) + Number(leauHealth.not_completed ?? 0)))
      : 0;
    const globalHealth = executiveAnalytics.value?.completion_health;
    const globalTotal = globalHealth 
      ? (Number(globalHealth.total ?? 0) || (Number(globalHealth.early_finished ?? 0) + Number(globalHealth.on_time ?? 0) + Number(globalHealth.beyond_time ?? 0) + Number(globalHealth.not_completed ?? 0)))
      : 0;

    if (leauTotal === 0 && globalTotal > 0) {
      return globalHealth;
    }
  }

  return byUnit || {
    early_finished: 0,
    on_time: 0,
    beyond_time: 0,
    not_completed: 0,
    early_finished_percent: 0,
    on_time_percent: 0,
    beyond_time_percent: 0,
    not_completed_percent: 0,
    total: 0,
  };
};

const handleManualRefresh = async () => {
  if (isRefreshing.value) return;
  isRefreshing.value = true;
  const start = Date.now();
  try {
    await fetchExecutiveAnalytics();
  } finally {
    const elapsed = Date.now() - start;
    if (elapsed < 600) {
      await new Promise(r => setTimeout(r, 600 - elapsed));
    }
    isRefreshing.value = false;
    toast.success('Page refreshed');
  }
};

const fetchExecutiveAnalytics = async () => {
  const requestId = ++analyticsRequestSeq;
  try {
    analyticsAbort?.abort('Superseded by newer executive analytics fetch');
  } catch { /* noop */ }
  analyticsAbort = new AbortController();
  try {
    const params = {
      period: selectedPeriod.value,
      year: selectedYear.value,
      unit: selectedUnitScope.value,
    };
    if (selectedPeriod.value === 'month') {
      params.month = selectedMonth.value;
    } else if (selectedPeriod.value === 'quarter') {
      params.quarter = selectedQuarter.value;
    }

    const res = await api.get('director/analytics', { params, signal: analyticsAbort.signal });
    if (requestId !== analyticsRequestSeq || !isAlive) return;
    if (res.data?.data) {
      executiveAnalytics.value = res.data.data;
    }
  } catch (error) {
    if (error?.code === 'ERR_CANCELED' || error?.name === 'CanceledError' || error?.name === 'AbortError') return;
    console.error('Failed to load executive analytics:', error);
  }
};

const handleDownloadReport = async () => {
  if (!executiveAnalytics.value) {
    toast.error('Analytics summary data is still loading.');
    return;
  }
  isGeneratingPdf.value = true;
  try {
    const { downloadDirectorReportPdf } = await import('@/utils/directorReportPdfGenerator');
    await downloadDirectorReportPdf(executiveAnalytics.value);
    toast.success('Official BSU Report downloaded successfully.');
  } catch (error) {
    console.error('Failed to download report PDF:', error);
    toast.error('Failed to download official report PDF.');
  } finally {
    isGeneratingPdf.value = false;
  }
};

onMounted(() => {
  isAlive = true;
  fetchExecutiveAnalytics();
});

onUnmounted(() => {
  isAlive = false;
  analyticsRequestSeq++;
  try {
    analyticsAbort?.abort('Director dashboard unmounted');
  } catch { /* noop */ }
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
