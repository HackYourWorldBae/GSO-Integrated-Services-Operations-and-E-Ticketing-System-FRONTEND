<template>
  <div class="p-5 sm:p-6 lg:p-8 rounded-2xl bg-white border border-slate-200/80 space-y-4 shadow-sm flex flex-col transition-all">
    <!-- Header with Title, Tabs & View Mode Toggle -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
      <div class="flex items-center gap-2">
        <h4 :data-tour="dataTour" class="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wider">
          Top Service Categories
        </h4>
      </div>

      <div class="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
        <!-- Sub-unit Filter Tabs -->
        <div class="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/70 gap-1 flex-wrap">
          <button
            v-for="tab in serviceTabs"
            :key="tab.key"
            type="button"
            @click="$emit('update:activeServiceTab', tab.key)"
            class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer min-h-[30px] touch-manipulation flex items-center gap-1.5"
            :class="activeServiceTab === tab.key ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
          >
            <span>{{ tab.label }}</span>
          </button>
        </div>

        <!-- Segmented Toggle -->
        <div class="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 shadow-inner">
          <button
            type="button"
            @click="currentView = 'list'"
            class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 min-h-[30px]"
            :class="currentView === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            title="Display detailed progress bar list"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span>List</span>
          </button>
          <button
            type="button"
            @click="currentView = 'graph'"
            class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 min-h-[30px]"
            :class="currentView === 'graph' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            title="Display horizontal bar graph with descriptive point guide"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Graph</span>
          </button>
        </div>
      </div>
    </div>

    <!-- VIEW 1: Words of Numbers Breakdown List -->
    <div v-show="currentView === 'list'" class="animate-fade-in space-y-4">
      <div v-if="displayedServiceGroups.length" class="space-y-4">
        <div
          v-for="group in displayedServiceGroups"
          :key="group.code"
          class="p-4 sm:p-5 rounded-xl border space-y-3"
          :class="group.code === 'FGMU' ? 'bg-blue-50/40 border-blue-100' : group.code === 'LEAU' ? 'bg-emerald-50/40 border-emerald-100' : 'bg-amber-50/40 border-amber-100'"
        >
          <!-- Unit Header Bar -->
          <div class="flex items-center justify-between pb-2.5 border-b" :class="group.code === 'FGMU' ? 'border-blue-200/60' : group.code === 'LEAU' ? 'border-emerald-200/60' : 'border-amber-200/60'">
            <div class="flex items-center gap-2">
              <span
                class="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider"
                :class="group.code === 'FGMU' ? 'bg-blue-600 text-white' : group.code === 'LEAU' ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'"
              >
                {{ group.code }}
              </span>
              <span class="text-xs sm:text-sm font-black text-slate-800">{{ group.name }}</span>
            </div>
            <span class="text-xs sm:text-sm font-bold text-slate-600 tabular-nums">
              {{ group.total }} request{{ group.total !== 1 ? 's' : '' }}
            </span>
          </div>

          <!-- Services List -->
          <div class="space-y-3">
            <div v-for="item in group.services" :key="item.name" class="space-y-1">
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs sm:text-sm font-semibold text-slate-800 truncate">{{ item.name }}</span>
                <span class="tabular-nums text-slate-700 font-bold text-xs sm:text-sm shrink-0">
                  {{ item.count }} <span class="text-slate-500 font-normal">({{ item.percent }}%)</span>
                </span>
              </div>
              <div class="w-full h-2 bg-white/80 rounded-full overflow-hidden border border-slate-200/60">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="group.code === 'FGMU' ? 'bg-blue-500' : group.code === 'LEAU' ? 'bg-emerald-500' : 'bg-amber-500'"
                  :style="{ width: `${item.percent}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Fallback Flat List -->
      <div v-else-if="serviceBreakdown?.length" class="space-y-3">
        <div v-for="(item, idx) in serviceBreakdown" :key="item.name" class="space-y-1.5">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-1.5 truncate">
              <span v-if="item.unit_code" class="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                {{ item.unit_code }}
              </span>
              <span class="text-xs sm:text-sm font-bold text-slate-800 truncate">{{ item.name }}</span>
            </div>
            <span class="tabular-nums text-slate-600 font-black text-xs sm:text-sm ml-2 shrink-0">{{ item.count }} <span class="text-slate-500 font-semibold">({{ item.percent }}%)</span></span>
          </div>
          <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="idx % 3 === 0 ? 'bg-blue-500' : idx % 3 === 1 ? 'bg-emerald-500' : 'bg-rose-400'"
              :style="{ width: `${item.percent}%` }"
            ></div>
          </div>
        </div>
      </div>
      <p v-else class="text-xs sm:text-sm text-slate-500 font-medium py-6 text-center">No categories recorded for this period.</p>
    </div>

    <!-- VIEW 2: Visual Graph with Words Explaining Each Point -->
    <div v-show="currentView === 'graph'" class="space-y-6 animate-fade-in">
      <div class="relative w-full h-72 sm:h-80">
        <canvas ref="chartCanvas"></canvas>
        <div v-if="!flatServiceList.length" class="absolute inset-0 flex items-center justify-center bg-white/80">
          <p class="text-xs font-bold text-slate-400">No category data recorded for this period</p>
        </div>
      </div>

      <!-- Descriptive Point Guide (Words Explaining Every Graph Point) -->
      <div v-if="flatServiceList.length" class="space-y-2.5 pt-2 border-t border-slate-100">
        <h5 class="text-xs font-black uppercase tracking-wider text-slate-700">Top Service Workload Share &amp; Point Guide</h5>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          <div
            v-for="item in flatServiceList.slice(0, 6)"
            :key="item.name + (item.unitCode || '')"
            class="p-3 rounded-xl border border-slate-200/70 bg-slate-50/60 flex flex-col justify-between"
          >
            <div>
              <div class="flex items-center justify-between gap-1 mb-1">
                <span class="text-xs font-black text-slate-900 truncate flex items-center gap-1.5">
                  <span v-if="item.unitCode" class="px-1.5 py-0.2 rounded text-[9px] font-black uppercase" :class="item.unitCode === 'FGMU' ? 'bg-blue-100 text-blue-800' : item.unitCode === 'LEAU' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'">
                    {{ item.unitCode }}
                  </span>
                  {{ item.name }}
                </span>
                <span class="text-xs font-black text-slate-700 tabular-nums shrink-0">
                  {{ item.count }} ({{ item.percent }}%)
                </span>
              </div>
              <p class="text-[11px] text-slate-600 leading-snug">
                Represents {{ item.percent }}% of total request demand within this timeframe.
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
  displayedServiceGroups: {
    type: Array,
    default: () => []
  },
  serviceBreakdown: {
    type: Array,
    default: () => []
  },
  serviceTabs: {
    type: Array,
    default: () => []
  },
  activeServiceTab: {
    type: String,
    default: 'ALL'
  },
  dataTour: {
    type: String,
    default: 'director-services-breakdown'
  },
  initialView: {
    type: String,
    default: 'list'
  },
  globalView: {
    type: String,
    default: ''
  }
});

defineEmits(['update:activeServiceTab']);

const currentView = ref(props.initialView);
const chartCanvas = ref(null);
let chartInstance = null;

watch(() => props.globalView, (newMode) => {
  if (newMode === 'numbers' || newMode === 'list') {
    currentView.value = 'list';
  } else if (newMode === 'graph') {
    currentView.value = 'graph';
  }
});

const flatServiceList = computed(() => {
  const groups = props.displayedServiceGroups || [];
  if (groups.length) {
    const list = [];
    groups.forEach(g => {
      (g.services || []).forEach(s => {
        list.push({ ...s, unitCode: g.code });
      });
    });
    return list.sort((a, b) => (b.count || 0) - (a.count || 0));
  }
  return props.serviceBreakdown || [];
});

const renderChart = () => {
  if (!chartCanvas.value) return;

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  const items = flatServiceList.value.slice(0, 10);
  if (!items.length) return;

  const labels = items.map(i => {
    const u = i.unitCode ? `[${i.unitCode}] ` : '';
    const n = i.name.length > 25 ? i.name.slice(0, 23) + '...' : i.name;
    return u + n;
  });

  const data = items.map(i => i.count || 0);

  const colors = items.map(i => {
    if (i.unitCode === 'FGMU') return 'rgba(59, 130, 246, 0.85)';
    if (i.unitCode === 'LEAU') return 'rgba(16, 185, 129, 0.85)';
    if (i.unitCode === 'SSU') return 'rgba(245, 158, 11, 0.85)';
    return 'rgba(15, 23, 42, 0.85)';
  });

  const borderColors = items.map(i => {
    if (i.unitCode === 'FGMU') return '#2563eb';
    if (i.unitCode === 'LEAU') return '#059669';
    if (i.unitCode === 'SSU') return '#d97706';
    return '#0f172a';
  });

  chartInstance = new Chart(chartCanvas.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Requests',
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
          ticks: { precision: 0, font: { family: 'Inter, sans-serif', size: 11, weight: 'bold' } },
          grid: { color: 'rgba(226, 232, 240, 0.8)' }
        },
        y: {
          ticks: { font: { family: 'Inter, sans-serif', size: 11, weight: 'bold' } },
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
            label: (ctx) => {
              const val = ctx.parsed.x || 0;
              const item = items[ctx.dataIndex];
              const pct = item?.percent ? ` (${item.percent}%)` : '';
              return ` ${val} request${val !== 1 ? 's' : ''}${pct}`;
            }
          }
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

watch(() => [props.displayedServiceGroups, props.serviceBreakdown, props.activeServiceTab], () => {
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

