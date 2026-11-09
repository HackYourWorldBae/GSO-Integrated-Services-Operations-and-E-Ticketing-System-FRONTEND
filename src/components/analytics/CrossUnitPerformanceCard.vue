<template>
  <div class="space-y-3 pt-2">
    <!-- Header with Title & View Mode Toggle -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <h4 :data-tour="dataTour" class="text-sm sm:text-base font-black text-slate-900 tracking-tight uppercase tracking-wider">
          Performance by Sub-Unit
        </h4>
      </div>

      <div class="flex items-center gap-2 self-start sm:self-auto flex-wrap">
        <!-- Segmented Toggle -->
        <div class="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 shadow-inner">
          <button
            type="button"
            @click="currentView = 'table'"
            class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 min-h-[30px]"
            :class="currentView === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            title="Display cross-unit performance table"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Table View</span>
          </button>
          <button
            type="button"
            @click="currentView = 'graph'"
            class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 min-h-[30px]"
            :class="currentView === 'graph' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            title="Display comparative bar graph with descriptive points"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Comparative Graph</span>
          </button>
        </div>

        <span class="text-xs sm:text-sm font-bold text-slate-500">{{ kpiPeriodLabel }}</span>
      </div>
    </div>

    <!-- VIEW 1: Table & Mobile Cards -->
    <div v-show="currentView === 'table'" class="animate-fade-in space-y-3">
      <!-- Desktop Performance Table -->
      <div class="hidden md:block overflow-x-auto rounded-2xl border border-slate-200/80 shadow-sm">
        <table class="min-w-[650px] w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-700 text-xs sm:text-sm font-black uppercase tracking-wider border-b border-slate-200">
              <th class="py-3 px-5">Sub-Unit</th>
              <th class="py-3 px-4 text-center">Unresolved</th>
              <th class="py-3 px-4 text-center">Resolved</th>
              <th class="py-3 px-4 text-center">Declined</th>
              <th class="py-3 px-5 text-center">Total Requests</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 border-b border-slate-200 text-sm">
            <!-- FGMU -->
            <tr class="hover:bg-slate-50/80 transition-colors border-l-2 border-l-transparent hover:border-l-blue-400">
              <td class="py-3.5 px-5">
                <div class="flex items-center gap-3">
                  <span class="px-2.5 py-1 rounded-lg text-xs font-black bg-blue-50 text-blue-700 border border-blue-200/60 uppercase shrink-0">FGMU</span>
                  <div>
                    <div class="font-bold text-slate-900 text-sm sm:text-base">Facilities Management</div>
                  </div>
                </div>
              </td>
              <td class="py-3.5 px-4 text-center font-black text-amber-700 tabular-nums text-sm sm:text-base">{{ getUnresolved(executiveAnalytics?.units?.FGMU) }}</td>
              <td class="py-3.5 px-4 text-center font-black text-emerald-700 tabular-nums text-sm sm:text-base">{{ executiveAnalytics?.units?.FGMU?.resolved ?? 0 }}</td>
              <td class="py-3.5 px-4 text-center font-bold text-slate-700 tabular-nums text-sm sm:text-base">{{ executiveAnalytics?.units?.FGMU?.declined ?? 0 }}</td>
              <td class="py-3.5 px-5 text-center font-black text-slate-900 tabular-nums text-sm sm:text-base">{{ executiveAnalytics?.units?.FGMU?.total ?? 0 }}</td>
            </tr>

            <!-- LEAU -->
            <tr class="hover:bg-slate-50/80 transition-colors border-l-2 border-l-transparent hover:border-l-emerald-400">
              <td class="py-3.5 px-5">
                <div class="flex items-center gap-3">
                  <span class="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase shrink-0">LEAU</span>
                  <div>
                    <div class="font-bold text-slate-900 text-sm sm:text-base">Landscaping &amp; Environment</div>
                  </div>
                </div>
              </td>
              <td class="py-3.5 px-4 text-center font-black text-amber-700 tabular-nums text-sm sm:text-base">{{ getUnresolved(executiveAnalytics?.units?.LEAU) }}</td>
              <td class="py-3.5 px-4 text-center font-black text-emerald-700 tabular-nums text-sm sm:text-base">{{ executiveAnalytics?.units?.LEAU?.resolved ?? 0 }}</td>
              <td class="py-3.5 px-4 text-center font-bold text-slate-700 tabular-nums text-sm sm:text-base">{{ executiveAnalytics?.units?.LEAU?.declined ?? 0 }}</td>
              <td class="py-3.5 px-5 text-center font-black text-slate-900 tabular-nums text-sm sm:text-base">{{ executiveAnalytics?.units?.LEAU?.total ?? 0 }}</td>
            </tr>

            <!-- SSU -->
            <tr class="hover:bg-slate-50/80 transition-colors border-l-2 border-l-transparent hover:border-l-rose-400">
              <td class="py-3.5 px-5">
                <div class="flex items-center gap-3">
                  <span class="px-2.5 py-1 rounded-lg text-xs font-black bg-rose-50 text-rose-700 border border-rose-200/60 uppercase shrink-0">SSU</span>
                  <div>
                    <div class="font-bold text-slate-900 text-sm sm:text-base">Security Services</div>
                  </div>
                </div>
              </td>
              <td class="py-3.5 px-4 text-center font-black text-amber-700 tabular-nums text-sm sm:text-base">{{ getUnresolved(executiveAnalytics?.units?.SSU) }}</td>
              <td class="py-3.5 px-4 text-center font-black text-emerald-700 tabular-nums text-sm sm:text-base">{{ executiveAnalytics?.units?.SSU?.resolved ?? 0 }}</td>
              <td class="py-3.5 px-4 text-center font-bold text-slate-700 tabular-nums text-sm sm:text-base">{{ executiveAnalytics?.units?.SSU?.declined ?? 0 }}</td>
              <td class="py-3.5 px-5 text-center font-black text-slate-900 tabular-nums text-sm sm:text-base">{{ executiveAnalytics?.units?.SSU?.total ?? 0 }}</td>
            </tr>

            <!-- Consolidated Total Row -->
            <tr class="bg-slate-50 font-black text-slate-900 border-t-2 border-slate-200">
              <td class="py-3.5 px-5 text-xs sm:text-sm font-black tracking-wider text-slate-700 uppercase">GSO Overall</td>
              <td class="py-3.5 px-4 text-center text-amber-700 tabular-nums text-sm sm:text-base font-black">{{ getOverallUnresolved() }}</td>
              <td class="py-3.5 px-4 text-center text-emerald-700 tabular-nums text-sm sm:text-base font-black">{{ executiveAnalytics?.summary?.total_resolved ?? 0 }}</td>
              <td class="py-3.5 px-4 text-center text-slate-700 tabular-nums text-sm sm:text-base font-black">{{ executiveAnalytics?.summary?.total_declined ?? 0 }}</td>
              <td class="py-3.5 px-5 text-center text-slate-900 tabular-nums text-sm sm:text-base font-black">{{ executiveAnalytics?.summary?.total_requests ?? 0 }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Sub-Unit Cards View -->
      <div class="md:hidden space-y-3">
        <!-- FGMU Mobile Card -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-1 rounded-lg text-xs font-black bg-blue-50 text-blue-700 border border-blue-200/60 uppercase shrink-0">FGMU</span>
              <span class="font-bold text-slate-900 text-sm sm:text-base">Facilities Management</span>
            </div>
            <span class="text-xs font-bold text-slate-500">{{ executiveAnalytics?.units?.FGMU?.completion_rate ?? 0 }}% completed</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/60 text-center">
            <div class="p-2.5 rounded-xl bg-white border border-slate-200/60">
              <span class="text-xs font-bold text-amber-700 uppercase tracking-wider block">Unresolved</span>
              <span class="text-base font-black text-amber-700 tabular-nums">{{ getUnresolved(executiveAnalytics?.units?.FGMU) }}</span>
            </div>
            <div class="p-2.5 rounded-xl bg-white border border-slate-200/60">
              <span class="text-xs font-bold text-slate-600 uppercase tracking-wider block">Resolved</span>
              <span class="text-base font-black text-emerald-700 tabular-nums">{{ executiveAnalytics?.units?.FGMU?.resolved ?? 0 }}</span>
            </div>
            <div class="p-2.5 rounded-xl bg-white border border-slate-200/60">
              <span class="text-xs font-bold text-slate-600 uppercase tracking-wider block">Declined</span>
              <span class="text-base font-black text-slate-700 tabular-nums">{{ executiveAnalytics?.units?.FGMU?.declined ?? 0 }}</span>
            </div>
            <div class="p-2.5 rounded-xl bg-white border border-slate-200/60">
              <span class="text-xs font-bold text-slate-900 uppercase tracking-wider block">Total</span>
              <span class="text-base font-black text-slate-900 tabular-nums">{{ executiveAnalytics?.units?.FGMU?.total ?? 0 }}</span>
            </div>
          </div>
        </div>

        <!-- LEAU Mobile Card -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase shrink-0">LEAU</span>
              <span class="font-bold text-slate-900 text-sm sm:text-base">Landscaping &amp; Environment</span>
            </div>
            <span class="text-xs font-bold text-slate-500">{{ executiveAnalytics?.units?.LEAU?.completion_rate ?? 0 }}% completed</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/60 text-center">
            <div class="p-2.5 rounded-xl bg-white border border-slate-200/60">
              <span class="text-xs font-bold text-amber-700 uppercase tracking-wider block">Unresolved</span>
              <span class="text-base font-black text-amber-700 tabular-nums">{{ getUnresolved(executiveAnalytics?.units?.LEAU) }}</span>
            </div>
            <div class="p-2.5 rounded-xl bg-white border border-slate-200/60">
              <span class="text-xs font-bold text-slate-600 uppercase tracking-wider block">Resolved</span>
              <span class="text-base font-black text-emerald-700 tabular-nums">{{ executiveAnalytics?.units?.LEAU?.resolved ?? 0 }}</span>
            </div>
            <div class="p-2.5 rounded-xl bg-white border border-slate-200/60">
              <span class="text-xs font-bold text-slate-600 uppercase tracking-wider block">Declined</span>
              <span class="text-base font-black text-slate-700 tabular-nums">{{ executiveAnalytics?.units?.LEAU?.declined ?? 0 }}</span>
            </div>
            <div class="p-2.5 rounded-xl bg-white border border-slate-200/60">
              <span class="text-xs font-bold text-slate-900 uppercase tracking-wider block">Total</span>
              <span class="text-base font-black text-slate-900 tabular-nums">{{ executiveAnalytics?.units?.LEAU?.total ?? 0 }}</span>
            </div>
          </div>
        </div>

        <!-- SSU Mobile Card -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-1 rounded-lg text-xs font-black bg-rose-50 text-rose-700 border border-rose-200/60 uppercase shrink-0">SSU</span>
              <span class="font-bold text-slate-900 text-sm sm:text-base">Security Services</span>
            </div>
            <span class="text-xs font-bold text-slate-500">{{ executiveAnalytics?.units?.SSU?.completion_rate ?? 0 }}% completed</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/60 text-center">
            <div class="p-2.5 rounded-xl bg-white border border-slate-200/60">
              <span class="text-xs font-bold text-amber-700 uppercase tracking-wider block">Unresolved</span>
              <span class="text-base font-black text-amber-700 tabular-nums">{{ getUnresolved(executiveAnalytics?.units?.SSU) }}</span>
            </div>
            <div class="p-2.5 rounded-xl bg-white border border-slate-200/60">
              <span class="text-xs font-bold text-slate-600 uppercase tracking-wider block">Resolved</span>
              <span class="text-base font-black text-emerald-700 tabular-nums">{{ executiveAnalytics?.units?.SSU?.resolved ?? 0 }}</span>
            </div>
            <div class="p-2.5 rounded-xl bg-white border border-slate-200/60">
              <span class="text-xs font-bold text-slate-600 uppercase tracking-wider block">Declined</span>
              <span class="text-base font-black text-slate-700 tabular-nums">{{ executiveAnalytics?.units?.SSU?.declined ?? 0 }}</span>
            </div>
            <div class="p-2.5 rounded-xl bg-white border border-slate-200/60">
              <span class="text-xs font-bold text-slate-900 uppercase tracking-wider block">Total</span>
              <span class="text-base font-black text-slate-900 tabular-nums">{{ executiveAnalytics?.units?.SSU?.total ?? 0 }}</span>
            </div>
          </div>
        </div>

        <!-- GSO Overall Summary Card -->
        <div class="p-4 rounded-2xl bg-slate-900 text-white space-y-3 shadow-sm">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-400">GSO Overall Total</span>
            <span class="text-xs font-bold text-emerald-400">{{ executiveAnalytics?.summary?.completion_rate ?? 0 }}% completed</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-center">
            <div class="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span class="text-xs font-bold text-amber-400 uppercase tracking-wider block">Unresolved</span>
              <span class="text-base font-black text-amber-400 tabular-nums">{{ getOverallUnresolved() }}</span>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Resolved</span>
              <span class="text-base font-black text-emerald-400 tabular-nums">{{ executiveAnalytics?.summary?.total_resolved ?? 0 }}</span>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Declined</span>
              <span class="text-base font-black text-slate-300 tabular-nums">{{ executiveAnalytics?.summary?.total_declined ?? 0 }}</span>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span class="text-xs font-bold text-white uppercase tracking-wider block">Total</span>
              <span class="text-base font-black text-white tabular-nums">{{ executiveAnalytics?.summary?.total_requests ?? 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- VIEW 2: Visual Comparative Graph with Words Explaining Each Point -->
    <div v-show="currentView === 'graph'" class="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 space-y-6 shadow-sm animate-fade-in">
      <div class="relative w-full h-72 sm:h-80">
        <canvas ref="chartCanvas"></canvas>
      </div>

      <!-- Descriptive Point Guide (Words Explaining Every Graph Point) -->
      <div class="space-y-3 pt-2 border-t border-slate-100">
        <h5 class="text-xs font-black uppercase tracking-wider text-slate-700">Sub-Unit Operational Analysis &amp; Point Guide</h5>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <!-- FGMU Point Card -->
          <div class="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between gap-1 mb-1">
                <span class="text-xs font-black text-blue-900 uppercase">FGMU Facilities</span>
                <span class="text-xs font-black text-blue-700">{{ executiveAnalytics?.units?.FGMU?.completion_rate ?? 0 }}% Completion</span>
              </div>
              <p class="text-[11px] text-slate-600 leading-snug">
                <strong>{{ executiveAnalytics?.units?.FGMU?.resolved ?? 0 }} resolved</strong> out of {{ executiveAnalytics?.units?.FGMU?.total ?? 0 }} total. {{ getUnresolved(executiveAnalytics?.units?.FGMU) }} pending/in-progress facilities repairs.
              </p>
            </div>
          </div>

          <!-- LEAU Point Card -->
          <div class="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between gap-1 mb-1">
                <span class="text-xs font-black text-emerald-900 uppercase">LEAU Landscaping</span>
                <span class="text-xs font-black text-emerald-700">{{ executiveAnalytics?.units?.LEAU?.completion_rate ?? 0 }}% Completion</span>
              </div>
              <p class="text-[11px] text-slate-600 leading-snug">
                <strong>{{ executiveAnalytics?.units?.LEAU?.resolved ?? 0 }} resolved</strong> out of {{ executiveAnalytics?.units?.LEAU?.total ?? 0 }} total. {{ getUnresolved(executiveAnalytics?.units?.LEAU) }} active landscaping or electrical work orders.
              </p>
            </div>
          </div>

          <!-- SSU Point Card -->
          <div class="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/80 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between gap-1 mb-1">
                <span class="text-xs font-black text-rose-900 uppercase">SSU Security</span>
                <span class="text-xs font-black text-rose-700">{{ executiveAnalytics?.units?.SSU?.completion_rate ?? 0 }}% Resolution</span>
              </div>
              <p class="text-[11px] text-slate-600 leading-snug">
                <strong>{{ executiveAnalytics?.units?.SSU?.resolved ?? 0 }} resolved</strong> out of {{ executiveAnalytics?.units?.SSU?.total ?? 0 }} total. {{ getUnresolved(executiveAnalytics?.units?.SSU) }} security incidents under investigation.
              </p>
            </div>
          </div>
        </div>

        <!-- Metric Point Glossary -->
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-wrap gap-x-6 gap-y-1">
          <span class="flex items-center gap-1.5"><strong class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></strong> <strong>Resolved:</strong> Completed tickets signed-off by clients.</span>
          <span class="flex items-center gap-1.5"><strong class="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></strong> <strong>Unresolved:</strong> Active requests in triage, dispatch, or work-in-progress.</span>
          <span class="flex items-center gap-1.5"><strong class="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></strong> <strong>Declined:</strong> Rejected, cancelled, or duplicate entries.</span>
          <span class="flex items-center gap-1.5"><strong class="w-2.5 h-2.5 rounded-full bg-slate-900 inline-block"></strong> <strong>Total:</strong> Overall volume handled by the sub-unit.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  executiveAnalytics: {
    type: Object,
    default: () => ({})
  },
  kpiPeriodLabel: {
    type: String,
    default: ''
  },
  dataTour: {
    type: String,
    default: 'director-matrix-table'
  },
  initialView: {
    type: String,
    default: 'table'
  },
  globalView: {
    type: String,
    default: ''
  }
});

const currentView = ref(props.initialView);
const chartCanvas = ref(null);
let chartInstance = null;

watch(() => props.globalView, (newMode) => {
  if (newMode === 'numbers' || newMode === 'table') {
    currentView.value = 'table';
  } else if (newMode === 'graph') {
    currentView.value = 'graph';
  }
});

const getUnresolved = (unit) => {
  if (!unit) return 0;
  if (unit.unresolved !== undefined && unit.unresolved !== null) return Number(unit.unresolved) || 0;
  const tot = Number(unit.total) || 0;
  const res = Number(unit.resolved) || 0;
  const dec = Number(unit.declined) || 0;
  return Math.max(0, tot - (res + dec));
};

const getOverallUnresolved = () => {
  const sum = props.executiveAnalytics?.summary;
  if (!sum) return 0;
  if (sum.total_unresolved !== undefined && sum.total_unresolved !== null) return Number(sum.total_unresolved) || 0;
  const tot = Number(sum.total_requests) || 0;
  const res = Number(sum.total_resolved) || 0;
  const dec = Number(sum.total_declined) || 0;
  return Math.max(0, tot - (res + dec));
};

const renderChart = () => {
  if (!chartCanvas.value) return;

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  const u = props.executiveAnalytics?.units || {};
  const sum = props.executiveAnalytics?.summary || {};

  const labels = ['FGMU (Facilities)', 'LEAU (Landscaping)', 'SSU (Security)', 'GSO Overall'];
  
  const resolvedData = [
    Number(u.FGMU?.resolved) || 0,
    Number(u.LEAU?.resolved) || 0,
    Number(u.SSU?.resolved) || 0,
    Number(sum.total_resolved) || 0
  ];

  const unresolvedData = [
    getUnresolved(u.FGMU),
    getUnresolved(u.LEAU),
    getUnresolved(u.SSU),
    getOverallUnresolved()
  ];

  const declinedData = [
    Number(u.FGMU?.declined) || 0,
    Number(u.LEAU?.declined) || 0,
    Number(u.SSU?.declined) || 0,
    Number(sum.total_declined) || 0
  ];

  const totalData = [
    Number(u.FGMU?.total) || 0,
    Number(u.LEAU?.total) || 0,
    Number(u.SSU?.total) || 0,
    Number(sum.total_requests) || 0
  ];

  chartInstance = new Chart(chartCanvas.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Resolved',
          data: resolvedData,
          backgroundColor: 'rgba(16, 185, 129, 0.85)',
          borderColor: '#059669',
          borderWidth: 1.5,
          borderRadius: 6
        },
        {
          label: 'Unresolved',
          data: unresolvedData,
          backgroundColor: 'rgba(245, 158, 11, 0.85)',
          borderColor: '#d97706',
          borderWidth: 1.5,
          borderRadius: 6
        },
        {
          label: 'Declined',
          data: declinedData,
          backgroundColor: 'rgba(244, 63, 94, 0.85)',
          borderColor: '#e11d48',
          borderWidth: 1.5,
          borderRadius: 6
        },
        {
          label: 'Total Requests',
          data: totalData,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          borderColor: '#0f172a',
          borderWidth: 1.5,
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Inter, sans-serif', size: 11, weight: 'bold' } }
        },
        y: {
          beginAtZero: true,
          ticks: { precision: 0, font: { family: 'Inter, sans-serif', size: 11, weight: 'bold' } },
          grid: { color: 'rgba(226, 232, 240, 0.8)' }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: { font: { family: 'Inter, sans-serif', size: 11, weight: 'bold' }, boxWidth: 12 }
        },
        tooltip: {
          backgroundColor: '#0f172a',
          titleFont: { size: 13, weight: 'bold' },
          bodyFont: { size: 12 },
          padding: 10,
          cornerRadius: 8
        }
      }
    }
  });
};

watch(() => currentView.value, (newVal) => {
  if (newVal === 'graph') {
    nextTick(() => {
      renderChart();
    });
  }
});

watch(() => props.executiveAnalytics, () => {
  if (currentView.value === 'graph') {
    nextTick(() => {
      renderChart();
    });
  }
}, { deep: true });

onMounted(() => {
  if (currentView.value === 'graph') {
    nextTick(() => {
      renderChart();
    });
  }
});

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
});
</script>

