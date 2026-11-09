<template>
  <div :data-tour="dataTour" class="p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] bg-white border border-slate-200/80 shadow-md flex flex-col justify-between transition-all">
    <!-- Header with Title & View Mode Toggle -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
      <div class="flex items-center gap-2">
        <div class="w-2.5 h-6 bg-slate-800 rounded-full shrink-0"></div>
        <div>
          <h4 class="text-lg sm:text-xl font-black text-slate-900 italic tracking-tight">
            {{ title }}
          </h4>
          <p class="text-xs text-slate-500 font-medium">Work order turnaround vs target timeframe</p>
        </div>
      </div>

      <div class="flex items-center gap-2 self-start sm:self-auto flex-wrap">
        <!-- Segmented Toggle: Numbers vs Graph -->
        <div class="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 shadow-inner">
          <button
            type="button"
            @click="currentView = 'numbers'"
            class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 min-h-[32px]"
            :class="currentView === 'numbers' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            title="Display detailed words and numbers"
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
            title="Display visual doughnut graph with point descriptions"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            <span>Graph</span>
          </button>
        </div>

        <span class="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-black rounded-full uppercase tracking-wider shrink-0 whitespace-nowrap">
          {{ stats?.total || 0 }} Evaluated
        </span>
      </div>
    </div>

    <!-- VIEW 1: Words of Numbers Breakdown (Original detailed metric cards) -->
    <div v-show="currentView === 'numbers'" class="space-y-3.5 animate-fade-in">
      <!-- Early / Ahead of Schedule -->
      <div class="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 flex flex-col gap-2">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0"></span>
            <span class="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider">Early / Ahead of Schedule</span>
          </div>
          <div class="flex items-baseline gap-1.5 shrink-0">
            <span class="text-xl sm:text-2xl font-black text-sky-700 tabular-nums">{{ stats?.earlyFinished || 0 }}</span>
            <span class="text-xs sm:text-sm font-bold text-sky-700">({{ stats?.earlyFinishedPercent || 0 }}%)</span>
          </div>
        </div>
        <div class="w-full h-2.5 bg-sky-200/50 rounded-full overflow-hidden">
          <div class="h-full bg-sky-500 rounded-full transition-all duration-500" :style="{ width: (stats?.earlyFinishedPercent || 0) + '%' }"></div>
        </div>
        <p class="text-xs sm:text-sm text-slate-600 font-medium">Jobs completed ahead of designated target schedule</p>
      </div>

      <!-- On-Time -->
      <div class="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col gap-2">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
            <span class="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider">On-Time Completion</span>
          </div>
          <div class="flex items-baseline gap-1.5 shrink-0">
            <span class="text-xl sm:text-2xl font-black text-emerald-700 tabular-nums">{{ stats?.onTime || 0 }}</span>
            <span class="text-xs sm:text-sm font-bold text-emerald-700">({{ stats?.onTimePercent || 0 }}%)</span>
          </div>
        </div>
        <div class="w-full h-2.5 bg-emerald-200/50 rounded-full overflow-hidden">
          <div class="h-full bg-emerald-500 rounded-full transition-all duration-500" :style="{ width: (stats?.onTimePercent || 0) + '%' }"></div>
        </div>
        <p class="text-xs sm:text-sm text-slate-600 font-medium">Jobs completed strictly within scheduled timeframe</p>
      </div>

      <!-- Beyond Time / Delayed -->
      <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col gap-2">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
            <span class="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider">Completed Beyond Time</span>
          </div>
          <div class="flex items-baseline gap-1.5 shrink-0">
            <span class="text-xl sm:text-2xl font-black text-amber-700 tabular-nums">{{ stats?.beyondTime || 0 }}</span>
            <span class="text-xs sm:text-sm font-bold text-amber-700">({{ stats?.beyondTimePercent || 0 }}%)</span>
          </div>
        </div>
        <div class="w-full h-2.5 bg-amber-200/50 rounded-full overflow-hidden">
          <div class="h-full bg-amber-500 rounded-full transition-all duration-500" :style="{ width: (stats?.beyondTimePercent || 0) + '%' }"></div>
        </div>
        <p class="text-xs sm:text-sm text-slate-600 font-medium">Finished with reported timeline extensions or delays</p>
      </div>

      <!-- Not Completed / Halted -->
      <div class="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex flex-col gap-2">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
            <span class="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider">Not Completed / Halted</span>
          </div>
          <div class="flex items-baseline gap-1.5 shrink-0">
            <span class="text-xl sm:text-2xl font-black text-rose-700 tabular-nums">{{ stats?.notCompleted || 0 }}</span>
            <span class="text-xs sm:text-sm font-bold text-rose-700">({{ stats?.notCompletedPercent || 0 }}%)</span>
          </div>
        </div>
        <div class="w-full h-2.5 bg-rose-200/50 rounded-full overflow-hidden">
          <div class="h-full bg-rose-500 rounded-full transition-all duration-500" :style="{ width: (stats?.notCompletedPercent || 0) + '%' }"></div>
        </div>
        <p class="text-xs sm:text-sm text-slate-600 font-medium">Work stalled or unfulfilled due to site constraints</p>
      </div>
    </div>

    <!-- VIEW 2: Visual Graph with Words Explaining Each Point -->
    <div v-show="currentView === 'graph'" class="space-y-6 animate-fade-in">
      <!-- Visual Doughnut Canvas -->
      <div class="relative w-full h-56 sm:h-64 flex items-center justify-center">
        <canvas ref="chartCanvas"></canvas>
        <div v-if="!stats?.total" class="absolute inset-0 flex items-center justify-center bg-white/80">
          <p class="text-xs font-bold text-slate-400">No evaluated jobs recorded for this timeframe</p>
        </div>
      </div>

      <!-- Descriptive Point Guide (Words Explaining Every Graph Point) -->
      <div class="space-y-2.5 pt-2 border-t border-slate-100">
        <h5 class="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <span>Point Breakdown &amp; Definitions</span>
        </h5>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <!-- Point 1: Early -->
          <div class="p-3 rounded-xl bg-sky-50/70 border border-sky-100 flex flex-col justify-between">
            <div class="flex items-center justify-between gap-1 mb-1">
              <span class="text-xs font-black text-sky-800 flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0"></span>
                Early Finished
              </span>
              <span class="text-xs font-black text-sky-700 tabular-nums">{{ stats?.earlyFinished || 0 }} ({{ stats?.earlyFinishedPercent || 0 }}%)</span>
            </div>
            <p class="text-[11px] text-slate-600 font-medium leading-relaxed">
              <strong>Ahead of schedule:</strong> Resolved before the target date without quality compromises.
            </p>
          </div>

          <!-- Point 2: On-Time -->
          <div class="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex flex-col justify-between">
            <div class="flex items-center justify-between gap-1 mb-1">
              <span class="text-xs font-black text-emerald-800 flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                On-Time Completion
              </span>
              <span class="text-xs font-black text-emerald-700 tabular-nums">{{ stats?.onTime || 0 }} ({{ stats?.onTimePercent || 0 }}%)</span>
            </div>
            <p class="text-[11px] text-slate-600 font-medium leading-relaxed">
              <strong>Strictly on-time:</strong> Satisfied within the standard target dispatch window.
            </p>
          </div>

          <!-- Point 3: Beyond Time -->
          <div class="p-3 rounded-xl bg-amber-50/70 border border-amber-100 flex flex-col justify-between">
            <div class="flex items-center justify-between gap-1 mb-1">
              <span class="text-xs font-black text-amber-800 flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                Beyond Time (Overdue)
              </span>
              <span class="text-xs font-black text-amber-700 tabular-nums">{{ stats?.beyondTime || 0 }} ({{ stats?.beyondTimePercent || 0 }}%)</span>
            </div>
            <p class="text-[11px] text-slate-600 font-medium leading-relaxed">
              <strong>Timeline extended:</strong> Completed after schedule extension due to scope or supply issues.
            </p>
          </div>

          <!-- Point 4: Not Completed -->
          <div class="p-3 rounded-xl bg-rose-50/70 border border-rose-100 flex flex-col justify-between">
            <div class="flex items-center justify-between gap-1 mb-1">
              <span class="text-xs font-black text-rose-800 flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
                Not Completed (Halted)
              </span>
              <span class="text-xs font-black text-rose-700 tabular-nums">{{ stats?.notCompleted || 0 }} ({{ stats?.notCompletedPercent || 0 }}%)</span>
            </div>
            <p class="text-[11px] text-slate-600 font-medium leading-relaxed">
              <strong>Halted or stalled:</strong> Work interrupted by severe site, weather, or security constraints.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  stats: {
    type: Object,
    default: () => ({})
  },
  title: {
    type: String,
    default: 'Job Completion Health'
  },
  dataTour: {
    type: String,
    default: 'admin-completion-health'
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
const chartCanvas = ref(null);
let chartInstance = null;

// Synchronize with external global toggle if passed
watch(() => props.globalView, (newMode) => {
  if (newMode === 'numbers' || newMode === 'graph') {
    currentView.value = newMode;
  }
});

const renderChart = () => {
  if (!chartCanvas.value) return;

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  const s = props.stats || {};
  const dataValues = [
    Number(s.earlyFinished) || 0,
    Number(s.onTime) || 0,
    Number(s.beyondTime) || 0,
    Number(s.notCompleted) || 0
  ];

  const total = dataValues.reduce((a, b) => a + b, 0);

  chartInstance = new Chart(chartCanvas.value, {
    type: 'doughnut',
    data: {
      labels: [
        'Early / Ahead of Schedule',
        'On-Time Completion',
        'Completed Beyond Time',
        'Not Completed / Halted'
      ],
      datasets: [{
        data: total > 0 ? dataValues : [0, 0, 0, 0],
        backgroundColor: ['#0ea5e9', '#10b981', '#f59e0b', '#f43f5e'],
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverOffset: 12
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { family: 'Inter, sans-serif', size: 11, weight: 'bold' },
            boxWidth: 12,
            padding: 12
          }
        },
        tooltip: {
          backgroundColor: '#0f172a',
          titleFont: { size: 13, weight: 'bold' },
          bodyFont: { size: 12 },
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (ctx) => {
              const val = ctx.parsed || 0;
              const pct = total > 0 ? Math.round((val / total) * 100) : 0;
              return ` ${ctx.label}: ${val} jobs (${pct}%)`;
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

watch(() => props.stats, () => {
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

