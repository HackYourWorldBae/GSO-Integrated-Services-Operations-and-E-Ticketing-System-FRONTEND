<template>
  <div :data-tour="dataTour" class="p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] bg-white border border-slate-200/80 shadow-md flex flex-col justify-between transition-all">
    <!-- Header with Title & View Mode Toggle -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
      <div class="flex items-center gap-2">
        <div class="w-2.5 h-6 bg-emerald-500 rounded-full shrink-0"></div>
        <div>
          <h4 class="text-lg sm:text-xl font-black text-slate-900 italic tracking-tight">
            {{ title }}
          </h4>
          <p class="text-xs text-slate-500 font-medium">Verified client satisfaction scores (scale 1.0 - 5.0)</p>
        </div>
      </div>

      <div class="flex items-center gap-2 self-start sm:self-auto flex-wrap">
        <!-- Segmented Toggle -->
        <div class="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 shadow-inner">
          <button
            type="button"
            @click="currentView = 'numbers'"
            class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 min-h-[32px]"
            :class="currentView === 'numbers' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            title="Display progress bars and star ratings"
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
            title="Display comparative bar graph with dimension descriptions"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Graph</span>
          </button>
        </div>

        <span class="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black rounded-full uppercase tracking-wider shrink-0 whitespace-nowrap">
          ★ {{ overallAvg.toFixed(2) }} Avg
        </span>
      </div>
    </div>

    <!-- VIEW 1: Words of Numbers Breakdown (Original progress bars & stars) -->
    <div v-show="currentView === 'numbers'" class="flex-1 flex flex-col justify-center space-y-6 animate-fade-in my-2">
      <div
        v-for="(metric, idx) in metricList"
        :key="idx"
        class="flex flex-col gap-2"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider">{{ metric.label }}</span>
          <span class="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">{{ metric.val.toFixed(1) }} <span class="text-xs text-slate-400 font-semibold">/ 5.0</span></span>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex-1 h-3.5 bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-amber-400 rounded-full transition-all duration-500" :style="{ width: ((metric.val / 5) * 100) + '%' }"></div>
          </div>
          <div class="flex gap-1 text-amber-400 shrink-0">
            <svg
              v-for="i in 5"
              :key="i"
              class="w-4 h-4 sm:w-5 sm:h-5"
              :class="i <= Math.round(metric.val) ? 'fill-current' : 'text-slate-200 fill-current'"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </div>
        </div>
        <p class="text-[11px] text-slate-500 font-medium">{{ metric.desc }}</p>
      </div>
    </div>

    <!-- VIEW 2: Visual Graph with Words Explaining Each Point -->
    <div v-show="currentView === 'graph'" class="space-y-6 animate-fade-in">
      <!-- Horizontal Bar Canvas -->
      <div class="relative w-full h-52 sm:h-60">
        <canvas ref="chartCanvas"></canvas>
      </div>

      <!-- Descriptive Point Guide (Words Explaining Every Dimension Point) -->
      <div class="space-y-2.5 pt-2 border-t border-slate-100">
        <h5 class="text-xs font-black uppercase tracking-wider text-slate-700">Evaluation Dimension Glossary</h5>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <!-- Point 1: Quality -->
          <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between gap-1 mb-1">
                <span class="text-xs font-black text-slate-900">Quality</span>
                <span class="text-xs font-black text-amber-600 tabular-nums">★ {{ qualityVal.toFixed(1) }}</span>
              </div>
              <p class="text-[11px] text-slate-600 leading-snug">
                Client rating on workmanship standards, technical accuracy, and durability.
              </p>
            </div>
          </div>

          <!-- Point 2: Efficiency -->
          <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between gap-1 mb-1">
                <span class="text-xs font-black text-slate-900">Efficiency</span>
                <span class="text-xs font-black text-amber-600 tabular-nums">★ {{ efficiencyVal.toFixed(1) }}</span>
              </div>
              <p class="text-[11px] text-slate-600 leading-snug">
                Client rating on team coordination, work pace, and minimal site disruption.
              </p>
            </div>
          </div>

          <!-- Point 3: Timeliness -->
          <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between gap-1 mb-1">
                <span class="text-xs font-black text-slate-900">Timeliness</span>
                <span class="text-xs font-black text-amber-600 tabular-nums">★ {{ timelinessVal.toFixed(1) }}</span>
              </div>
              <p class="text-[11px] text-slate-600 leading-snug">
                Client rating on punctual arrival and fulfillment within promised delivery windows.
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
  feedbackAverages: {
    type: Object,
    default: () => ({})
  },
  title: {
    type: String,
    default: 'Evaluation Averages'
  },
  dataTour: {
    type: String,
    default: 'admin-eval-averages'
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

const safeVal = (val) => parseFloat(val) || 0;

const qualityVal = computed(() => safeVal(props.feedbackAverages?.avg_quality));
const efficiencyVal = computed(() => safeVal(props.feedbackAverages?.avg_efficiency));
const timelinessVal = computed(() => safeVal(props.feedbackAverages?.avg_timeliness));

const overallAvg = computed(() => {
  const vals = [qualityVal.value, efficiencyVal.value, timelinessVal.value].filter(v => v > 0);
  if (!vals.length) return 5.0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
});

const metricList = computed(() => [
  { label: 'Quality', val: qualityVal.value, desc: 'Workmanship standards, precision, and durability' },
  { label: 'Efficiency', val: efficiencyVal.value, desc: 'Team coordination, work pace, and minimal disruption' },
  { label: 'Timeliness', val: timelinessVal.value, desc: 'Punctuality and adherence to agreed turnaround times' }
]);

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

  chartInstance = new Chart(chartCanvas.value, {
    type: 'bar',
    data: {
      labels: ['Quality', 'Efficiency', 'Timeliness'],
      datasets: [{
        label: 'Client Rating (out of 5.0)',
        data: [qualityVal.value, efficiencyVal.value, timelinessVal.value],
        backgroundColor: [
          'rgba(245, 158, 11, 0.85)',
          'rgba(16, 185, 129, 0.85)',
          'rgba(14, 165, 233, 0.85)'
        ],
        borderColor: ['#d97706', '#059669', '#0284c7'],
        borderWidth: 1.5,
        borderRadius: 8,
        barPercentage: 0.6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          min: 0,
          max: 5,
          ticks: {
            stepSize: 1,
            font: { family: 'Inter, sans-serif', size: 11, weight: 'bold' }
          },
          grid: { color: 'rgba(226, 232, 240, 0.8)' }
        },
        y: {
          ticks: {
            font: { family: 'Inter, sans-serif', size: 12, weight: 'bold' }
          },
          grid: { display: false }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a',
          titleFont: { size: 13, weight: 'bold' },
          bodyFont: { size: 12 },
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (ctx) => ` Rating: ${ctx.parsed.x.toFixed(1)} / 5.0`
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

watch(() => props.feedbackAverages, () => {
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

