<template>
  <div class="w-full p-5 sm:p-6 lg:p-7 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-5 transition-all">
    <!-- Header with Unit Info, Rating & View Mode Toggle -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
      <div class="flex items-center gap-2.5">
        <span
          class="px-2.5 py-1 rounded-lg text-xs font-black uppercase border"
          :class="unitCode === 'FGMU' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'"
        >
          {{ unitCode }}
        </span>
        <div>
          <h5 class="text-sm sm:text-base font-black text-slate-900">{{ unitTitle }}</h5>
          <span class="text-[11px] font-medium text-slate-500">{{ unitSubtitle }}</span>
        </div>
      </div>

      <div class="flex items-center gap-3 self-start sm:self-auto flex-wrap justify-between sm:justify-end w-full sm:w-auto">
        <!-- Segmented Toggle -->
        <div class="inline-flex p-1 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <button
            type="button"
            @click="currentView = 'numbers'"
            class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 min-h-[30px]"
            :class="currentView === 'numbers' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
            title="Display numbers and score cards"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Numbers</span>
          </button>
          <button
            type="button"
            @click="currentView = 'graph'"
            class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 min-h-[30px]"
            :class="currentView === 'graph' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
            title="Display visual charts with point descriptions"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            <span>Graph</span>
          </button>
        </div>

        <div class="text-left sm:text-right">
          <div class="flex items-baseline sm:justify-end gap-1">
            <span class="text-xs font-bold text-slate-500 uppercase">Rating:</span>
            <span class="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
              {{ overallAvgRating }}
            </span>
            <span class="text-xs font-semibold text-slate-400">/ 5.00</span>
          </div>
          <span class="text-[11px] font-medium text-slate-500 block">
            {{ totalReviews }} client review{{ totalReviews !== 1 ? 's' : '' }}
          </span>
        </div>
      </div>
    </div>

    <!-- VIEW 1: Words of Numbers Breakdown (Original Cards) -->
    <div v-show="currentView === 'numbers'" class="space-y-5 animate-fade-in">
      <!-- Completion Timeliness -->
      <div class="space-y-2">
        <span class="text-xs font-black text-slate-600 uppercase tracking-wider block">Completion Timeliness</span>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="p-3.5 sm:p-4 bg-sky-50/90 rounded-xl border border-sky-200/70 text-center">
            <span class="text-xl sm:text-2xl font-black text-sky-900 tabular-nums block">{{ healthStats.early_finished }}</span>
            <span class="text-xs font-black text-sky-700 block">{{ healthStats.early_finished_percent }}%</span>
            <span class="text-[11px] font-bold text-sky-800 uppercase tracking-wider block mt-0.5">Early</span>
          </div>
          <div class="p-3.5 sm:p-4 bg-emerald-50/90 rounded-xl border border-emerald-200/70 text-center">
            <span class="text-xl sm:text-2xl font-black text-emerald-900 tabular-nums block">{{ healthStats.on_time }}</span>
            <span class="text-xs font-black text-emerald-700 block">{{ healthStats.on_time_percent }}%</span>
            <span class="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mt-0.5">On-Time</span>
          </div>
          <div class="p-3.5 sm:p-4 bg-amber-50/90 rounded-xl border border-amber-200/70 text-center">
            <span class="text-xl sm:text-2xl font-black text-amber-900 tabular-nums block">{{ healthStats.beyond_time }}</span>
            <span class="text-xs font-black text-amber-700 block">{{ healthStats.beyond_time_percent }}%</span>
            <span class="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mt-0.5">Overdue</span>
          </div>
          <div class="p-3.5 sm:p-4 bg-slate-100 rounded-xl border border-slate-200 text-center">
            <span class="text-xl sm:text-2xl font-black text-slate-900 tabular-nums block">{{ healthStats.not_completed }}</span>
            <span class="text-xs font-black text-slate-600 block">{{ healthStats.not_completed_percent }}%</span>
            <span class="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mt-0.5">Incomplete</span>
          </div>
        </div>
      </div>

      <!-- Service Dimensions -->
      <div class="space-y-2 pt-2 border-t border-slate-200/60">
        <span class="text-xs font-black text-slate-600 uppercase tracking-wider block">Service Dimensions</span>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/80 flex flex-col gap-1">
            <span class="text-xs font-bold text-slate-500 uppercase">Quality</span>
            <div class="flex items-baseline gap-1">
              <span class="text-lg sm:text-xl font-black text-slate-900 tabular-nums">{{ ratings.avg_quality }}</span>
              <span class="text-xs font-semibold text-slate-400">/ 5.0</span>
            </div>
            <p class="text-[11px] text-slate-500">Workmanship &amp; repair accuracy</p>
          </div>
          <div class="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/80 flex flex-col gap-1">
            <span class="text-xs font-bold text-slate-500 uppercase">Efficiency</span>
            <div class="flex items-baseline gap-1">
              <span class="text-lg sm:text-xl font-black text-slate-900 tabular-nums">{{ ratings.avg_efficiency }}</span>
              <span class="text-xs font-semibold text-slate-400">/ 5.0</span>
            </div>
            <p class="text-[11px] text-slate-500">Resource speed &amp; minimal disruption</p>
          </div>
          <div class="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/80 flex flex-col gap-1">
            <span class="text-xs font-bold text-slate-500 uppercase">Timeliness</span>
            <div class="flex items-baseline gap-1">
              <span class="text-lg sm:text-xl font-black text-slate-900 tabular-nums">{{ ratings.avg_timeliness }}</span>
              <span class="text-xs font-semibold text-slate-400">/ 5.0</span>
            </div>
            <p class="text-[11px] text-slate-500">Punctuality vs scheduled milestone</p>
          </div>
        </div>
      </div>
    </div>

    <!-- VIEW 2: Visual Graph with Words Explaining Each Point -->
    <div v-show="currentView === 'graph'" class="space-y-6 animate-fade-in">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <!-- Timeliness Doughnut -->
        <div class="p-4 rounded-xl bg-white border border-slate-200/80 flex flex-col items-center">
          <span class="text-xs font-black text-slate-700 uppercase tracking-wider mb-2 self-start">Timeliness Distribution</span>
          <div class="relative w-full h-48 sm:h-52">
            <canvas ref="timelinessCanvas"></canvas>
          </div>
        </div>

        <!-- Dimension Ratings Bars -->
        <div class="p-4 rounded-xl bg-white border border-slate-200/80 flex flex-col">
          <span class="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Service Dimensions (0 - 5.0)</span>
          <div class="relative w-full h-48 sm:h-52">
            <canvas ref="dimensionsCanvas"></canvas>
          </div>
        </div>
      </div>

      <!-- Descriptive Point Guide (Words Explaining Every Point) -->
      <div class="p-3.5 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-600 space-y-2">
        <h6 class="font-black text-slate-800 uppercase tracking-wider">Point Interpretation Guide</h6>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          <div>🔵 <strong>Early Finished ({{ healthStats.early_finished }} jobs):</strong> Completed ahead of target milestone.</div>
          <div>🟢 <strong>On-Time ({{ healthStats.on_time }} jobs):</strong> Completed strictly within assigned turnaround time.</div>
          <div>🟠 <strong>Overdue ({{ healthStats.beyond_time }} jobs):</strong> Finished with authorized schedule extension.</div>
          <div>⚪ <strong>Incomplete ({{ healthStats.not_completed }} jobs):</strong> Paused due to structural, material, or access limits.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  unitCode: {
    type: String,
    required: true
  },
  unitTitle: {
    type: String,
    default: ''
  },
  unitSubtitle: {
    type: String,
    default: ''
  },
  healthStats: {
    type: Object,
    default: () => ({
      early_finished: 0,
      early_finished_percent: 0,
      on_time: 0,
      on_time_percent: 0,
      beyond_time: 0,
      beyond_time_percent: 0,
      not_completed: 0,
      not_completed_percent: 0
    })
  },
  ratings: {
    type: Object,
    default: () => ({
      avg_quality: '5.00',
      avg_efficiency: '5.00',
      avg_timeliness: '5.00',
      overall_avg: '5.00',
      total_feedbacks: 0
    })
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
const timelinessCanvas = ref(null);
const dimensionsCanvas = ref(null);
let timelinessChart = null;
let dimensionsChart = null;

watch(() => props.globalView, (newMode) => {
  if (newMode === 'numbers' || newMode === 'graph') {
    currentView.value = newMode;
  }
});

const overallAvgRating = computed(() => {
  return props.ratings?.overall_avg ? parseFloat(props.ratings.overall_avg).toFixed(2) : '5.00';
});

const totalReviews = computed(() => {
  return props.ratings?.total_feedbacks ?? 0;
});

const renderCharts = () => {
  // 1. Timeliness Doughnut
  if (timelinessCanvas.value) {
    if (timelinessChart) {
      timelinessChart.destroy();
      timelinessChart = null;
    }
    const h = props.healthStats;
    timelinessChart = new Chart(timelinessCanvas.value, {
      type: 'doughnut',
      data: {
        labels: ['Early', 'On-Time', 'Overdue', 'Incomplete'],
        datasets: [{
          data: [
            Number(h.early_finished) || 0,
            Number(h.on_time) || 0,
            Number(h.beyond_time) || 0,
            Number(h.not_completed) || 0
          ],
          backgroundColor: ['#0ea5e9', '#10b981', '#f59e0b', '#94a3b8'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10, weight: 'bold' } } }
        }
      }
    });
  }

  // 2. Dimensions Bar Chart
  if (dimensionsCanvas.value) {
    if (dimensionsChart) {
      dimensionsChart.destroy();
      dimensionsChart = null;
    }
    const r = props.ratings;
    dimensionsChart = new Chart(dimensionsCanvas.value, {
      type: 'bar',
      data: {
        labels: ['Quality', 'Efficiency', 'Timeliness'],
        datasets: [{
          label: 'Rating',
          data: [
            parseFloat(r.avg_quality) || 5.0,
            parseFloat(r.avg_efficiency) || 5.0,
            parseFloat(r.avg_timeliness) || 5.0
          ],
          backgroundColor: ['#f59e0b', '#10b981', '#0ea5e9'],
          borderRadius: 6,
          barPercentage: 0.6
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { min: 0, max: 5, ticks: { stepSize: 1, font: { size: 10, weight: 'bold' } } },
          y: { ticks: { font: { size: 10, weight: 'bold' } }, grid: { display: false } }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }
};

watch(() => currentView.value, (newVal) => {
  if (newVal === 'graph') {
    nextTick(() => {
      renderCharts();
    });
  }
});

watch(() => [props.healthStats, props.ratings], () => {
  if (currentView.value === 'graph') {
    nextTick(() => {
      renderCharts();
    });
  }
}, { deep: true });

onMounted(() => {
  if (currentView.value === 'graph') {
    nextTick(() => {
      renderCharts();
    });
  }
});

onBeforeUnmount(() => {
  if (timelinessChart) timelinessChart.destroy();
  if (dimensionsChart) dimensionsChart.destroy();
  timelinessChart = null;
  dimensionsChart = null;
});
</script>

