<template>
  <div :data-tour="dataTour" class="p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] bg-white border border-slate-200/80 shadow-md flex flex-col space-y-6 transition-all">
    <!-- Header with Title & View Mode Toggle -->
    <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
      <div class="flex items-center gap-2">
        <div class="w-2.5 h-6 bg-amber-500 rounded-full shrink-0"></div>
        <div>
          <h4 class="text-lg sm:text-xl font-black text-slate-900 italic tracking-tight">
            {{ title }}
          </h4>
          <p class="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">Reported operational factors causing timeline extensions or work stoppages</p>
        </div>
      </div>

      <div class="flex items-center gap-2.5 flex-wrap">
        <!-- Segmented Toggle -->
        <div class="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 shadow-inner">
          <button
            type="button"
            @click="currentView = 'numbers'"
            class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 min-h-[32px]"
            :class="currentView === 'numbers' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            title="Display detailed list and percentage bars"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Numbers</span>
          </button>
          <button
            type="button"
            @click="currentView = 'graph'"
            class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 min-h-[32px]"
            :class="currentView === 'graph' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            title="Display ranked bar graph with point descriptions"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Graph</span>
          </button>
        </div>

        <!-- Optional Accordion Toggle for Numbers View -->
        <button
          v-if="currentView === 'numbers'"
          type="button"
          @click="showDetails = !showDetails"
          class="px-3.5 py-1.5 min-h-[32px] text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 select-none shadow-2xs"
          :aria-expanded="showDetails"
        >
          <span>{{ showDetails ? 'Hide Factors' : 'View Factors' }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-3.5 h-3.5 transition-transform duration-200"
            :class="{ 'rotate-180': showDetails }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- VIEW 1: Words of Numbers Breakdown (Original 3 Columns) -->
    <div v-show="currentView === 'numbers'">
      <div v-show="showDetails" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
        <!-- Delay Reasons List -->
        <div class="space-y-4">
          <div class="flex items-center justify-between gap-2">
            <p class="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
              Completed Beyond Time (Delay Factors)
            </p>
            <span class="text-xs font-bold text-slate-500 shrink-0">{{ delayReasonsList.length }} Reasons</span>
          </div>

          <div v-if="delayReasonsList.length === 0" class="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <p class="text-sm font-bold text-slate-600">No Delay Reasons Reported</p>
            <p class="text-xs text-slate-500 mt-1">All recorded jobs were finished on-time without reported delay factors.</p>
          </div>

          <div v-else class="space-y-3">
            <div 
              v-for="(item, idx) in delayReasonsList" 
              :key="item.code || idx"
              class="p-4 rounded-2xl bg-amber-50/40 border border-amber-100/80 flex flex-col gap-2 hover:bg-amber-50 transition-colors"
            >
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2.5 min-w-0">
                  <span class="w-6 h-6 rounded-full bg-amber-200/80 text-amber-800 text-xs font-black flex items-center justify-center shrink-0">
                    {{ idx + 1 }}
                  </span>
                  <span class="text-xs sm:text-sm font-black text-slate-800 break-words leading-tight">{{ item.name }}</span>
                </div>
                <div class="flex items-baseline gap-1.5 shrink-0">
                  <span class="text-base font-black text-amber-700 tabular-nums">{{ item.count }}</span>
                  <span class="text-xs font-bold text-slate-500">{{ item.count === 1 ? 'ticket' : 'tickets' }}</span>
                </div>
              </div>
              <div class="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
                <div class="h-full bg-amber-500 rounded-full" :style="{ width: item.percent + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Non-Completion Barriers List -->
        <div class="space-y-4">
          <div class="flex items-center justify-between gap-2">
            <p class="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
              Not Completed / Performed (Barriers)
            </p>
            <span class="text-xs font-bold text-slate-500 shrink-0">{{ nonCompletionList.length }} Barriers</span>
          </div>

          <div v-if="nonCompletionList.length === 0" class="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <p class="text-sm font-bold text-slate-600">No Non-Completion Barriers Reported</p>
            <p class="text-xs text-slate-500 mt-1">No tasks were left uncompleted or halted due to barriers.</p>
          </div>

          <div v-else class="space-y-3">
            <div 
              v-for="(item, idx) in nonCompletionList" 
              :key="item.code || idx"
              class="p-4 rounded-2xl bg-rose-50/40 border border-rose-100/80 flex flex-col gap-2 hover:bg-rose-50 transition-colors"
            >
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2.5 min-w-0">
                  <span class="w-6 h-6 rounded-full bg-rose-200/80 text-rose-800 text-xs font-black flex items-center justify-center shrink-0">
                    {{ idx + 1 }}
                  </span>
                  <span class="text-xs sm:text-sm font-black text-slate-800 break-words leading-tight">{{ item.name }}</span>
                </div>
                <div class="flex items-baseline gap-1.5 shrink-0">
                  <span class="text-base font-black text-rose-700 tabular-nums">{{ item.count }}</span>
                  <span class="text-xs font-bold text-slate-500">{{ item.count === 1 ? 'ticket' : 'tickets' }}</span>
                </div>
              </div>
              <div class="w-full h-2 bg-rose-100 rounded-full overflow-hidden">
                <div class="h-full bg-rose-500 rounded-full" :style="{ width: item.percent + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Approval Delay Reasons List -->
        <div class="space-y-4">
          <div class="flex items-center justify-between gap-2">
            <p class="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span>
              Approval Delay Reasons (Pre-Work)
            </p>
            <span class="text-xs font-bold text-slate-500 shrink-0">{{ approvalDelayList.length }} Reasons</span>
          </div>

          <div v-if="approvalDelayList.length === 0" class="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <p class="text-sm font-bold text-slate-600">No Approval Delays Reported</p>
            <p class="text-xs text-slate-500 mt-1">All tickets were approved directly without deferred holds.</p>
          </div>

          <div v-else class="space-y-3">
            <div 
              v-for="(item, idx) in approvalDelayList" 
              :key="item.name || idx"
              class="p-4 rounded-2xl bg-blue-50/40 border border-blue-100/80 flex flex-col gap-2 hover:bg-blue-50 transition-colors"
            >
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2.5 min-w-0">
                  <span class="w-6 h-6 rounded-full bg-blue-200/80 text-blue-800 text-xs font-black flex items-center justify-center shrink-0">
                    {{ idx + 1 }}
                  </span>
                  <span class="text-xs sm:text-sm font-black text-slate-800 break-words leading-tight">{{ item.name }}</span>
                </div>
                <div class="flex items-baseline gap-1.5 shrink-0">
                  <span class="text-base font-black text-blue-700 tabular-nums">{{ item.count }}</span>
                  <span class="text-xs font-bold text-slate-500">{{ item.count === 1 ? 'ticket' : 'tickets' }}</span>
                </div>
              </div>
              <div class="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                <div class="h-full bg-blue-500 rounded-full" :style="{ width: item.percent + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p v-show="!showDetails" class="text-xs text-slate-500 font-medium py-2">Click "View Factors" to expand the factor-by-factor list.</p>
    </div>

    <!-- VIEW 2: Visual Graph with Words Explaining Each Point -->
    <div v-show="currentView === 'graph'" class="space-y-6 animate-fade-in">
      <!-- Category Filter Tabs for Graph -->
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          @click="activeGraphTab = 'all'"
          class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer"
          :class="activeGraphTab === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'"
        >
          All Top Factors
        </button>
        <button
          type="button"
          @click="activeGraphTab = 'delays'"
          class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer"
          :class="activeGraphTab === 'delays' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'"
        >
          Delays ({{ delayReasonsList.length }})
        </button>
        <button
          type="button"
          @click="activeGraphTab = 'barriers'"
          class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer"
          :class="activeGraphTab === 'barriers' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'"
        >
          Barriers ({{ nonCompletionList.length }})
        </button>
        <button
          type="button"
          @click="activeGraphTab = 'approvals'"
          class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer"
          :class="activeGraphTab === 'approvals' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'"
        >
          Approval Holds ({{ approvalDelayList.length }})
        </button>
      </div>

      <!-- Horizontal Bar Chart -->
      <div class="relative w-full h-64 sm:h-72">
        <canvas ref="chartCanvas"></canvas>
        <div v-if="!currentItems.length" class="absolute inset-0 flex items-center justify-center bg-white/80">
          <p class="text-xs font-bold text-slate-400">No delay factors or barriers reported for this timeframe</p>
        </div>
      </div>

      <!-- Descriptive Point Guide (Words Explaining Every Graph Point) -->
      <div v-if="currentItems.length" class="space-y-2.5 pt-2 border-t border-slate-100">
        <h5 class="text-xs font-black uppercase tracking-wider text-slate-700">Root Cause Descriptions &amp; Impact</h5>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          <div
            v-for="(item, idx) in currentItems.slice(0, 6)"
            :key="item.name + idx"
            class="p-3 rounded-xl border flex flex-col justify-between"
            :class="item.category === 'barrier' ? 'bg-rose-50/50 border-rose-100' : item.category === 'approval' ? 'bg-blue-50/50 border-blue-100' : 'bg-amber-50/50 border-amber-100'"
          >
            <div>
              <div class="flex items-center justify-between gap-1 mb-1">
                <span class="text-xs font-black text-slate-900 truncate">{{ item.name }}</span>
                <span class="text-xs font-black tabular-nums shrink-0" :class="item.category === 'barrier' ? 'text-rose-700' : item.category === 'approval' ? 'text-blue-700' : 'text-amber-700'">
                  {{ item.count }} ticket{{ item.count !== 1 ? 's' : '' }}
                </span>
              </div>
              <p class="text-[11px] text-slate-600 leading-snug">
                {{ getFactorDescription(item.name) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  delayReasonsList: {
    type: Array,
    default: () => []
  },
  nonCompletionList: {
    type: Array,
    default: () => []
  },
  approvalDelayList: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: 'Why Delays & Barriers Happen (Root Cause Analysis)'
  },
  dataTour: {
    type: String,
    default: 'admin-root-cause'
  },
  initialView: {
    type: String,
    default: 'numbers'
  },
  globalView: {
    type: String,
    default: ''
  }
});

const currentView = ref(props.initialView);
const showDetails = ref(true);
const activeGraphTab = ref('all');
const chartCanvas = ref(null);
let chartInstance = null;

watch(() => props.globalView, (newMode) => {
  if (newMode === 'numbers' || newMode === 'graph') {
    currentView.value = newMode;
  }
});

const currentItems = computed(() => {
  const delays = (props.delayReasonsList || []).map(r => ({ ...r, category: 'delay' }));
  const barriers = (props.nonCompletionList || []).map(r => ({ ...r, category: 'barrier' }));
  const approvals = (props.approvalDelayList || []).map(r => ({ ...r, category: 'approval' }));

  if (activeGraphTab.value === 'delays') return delays;
  if (activeGraphTab.value === 'barriers') return barriers;
  if (activeGraphTab.value === 'approvals') return approvals;

  // 'all': combine and sort by count descending
  return [...delays, ...barriers, ...approvals].sort((a, b) => (b.count || 0) - (a.count || 0));
});

const getFactorDescription = (name) => {
  const lower = (name || '').toLowerCase();
  if (lower.includes('material') || lower.includes('tool')) {
    return 'Requisition delays or stockout of requested replacement components.';
  }
  if (lower.includes('absent') || lower.includes('personnel') || lower.includes('manpower')) {
    return 'Assigned technician unavailable due to official leave, illness, or dispatch priority.';
  }
  if (lower.includes('break') || lower.includes('schedule') || lower.includes('working day')) {
    return 'Insufficient working hours or mandatory break periods required during operation.';
  }
  if (lower.includes('skill') || lower.includes('expertise')) {
    return 'Required specialized technical certification or external contractor intervention.';
  }
  if (lower.includes('additional') || lower.includes('scope')) {
    return 'Requesting unit requested additional work beyond original submitted ticket scope.';
  }
  if (lower.includes('weather') || lower.includes('rain')) {
    return 'Adverse outdoor weather conditions prevented safe ground or electrical operation.';
  }
  if (lower.includes('access') || lower.includes('locked')) {
    return 'Site locked or unauthorized entrance prevented technician access.';
  }
  return 'Operational factor documented by dispatch personnel during ticket processing.';
};

const renderChart = () => {
  if (!chartCanvas.value) return;

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  const items = currentItems.value.slice(0, 10);
  if (!items.length) return;

  const labels = items.map(i => i.name.length > 25 ? i.name.slice(0, 23) + '...' : i.name);
  const data = items.map(i => i.count || 0);
  const colors = items.map(i => {
    if (i.category === 'barrier') return 'rgba(244, 63, 94, 0.85)';
    if (i.category === 'approval') return 'rgba(59, 130, 246, 0.85)';
    return 'rgba(245, 158, 11, 0.85)';
  });
  const borderColors = items.map(i => {
    if (i.category === 'barrier') return '#e11d48';
    if (i.category === 'approval') return '#2563eb';
    return '#d97706';
  });

  chartInstance = new Chart(chartCanvas.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Affected Tickets',
        data,
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 1.5,
        borderRadius: 6,
        barPercentage: 0.65
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            precision: 0,
            font: { family: 'Inter, sans-serif', size: 11, weight: 'bold' }
          },
          grid: { color: 'rgba(226, 232, 240, 0.8)' }
        },
        y: {
          ticks: {
            font: { family: 'Inter, sans-serif', size: 11, weight: 'bold' }
          },
          grid: { display: false }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a',
          titleFont: { size: 12, weight: 'bold' },
          bodyFont: { size: 12 },
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (ctx) => ` Impact: ${ctx.parsed.x} ticket${ctx.parsed.x !== 1 ? 's' : ''}`
          }
        }
      }
    }
  });
};

watch(() => [currentView.value, activeGraphTab.value], () => {
  if (currentView.value === 'graph') {
    nextTick(() => {
      renderChart();
    });
  }
});

watch(() => [props.delayReasonsList, props.nonCompletionList, props.approvalDelayList], () => {
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

