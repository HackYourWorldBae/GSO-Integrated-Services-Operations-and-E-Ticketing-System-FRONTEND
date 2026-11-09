<template>
  <div :data-tour="dataTour" class="p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] bg-white border border-slate-200/80 shadow-md flex flex-col justify-between transition-all">
    <!-- Header with Title & View Mode Toggle -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
      <div class="flex items-center gap-2">
        <div class="w-2.5 h-6 bg-rose-500 rounded-full shrink-0"></div>
        <div>
          <h4 class="text-lg sm:text-xl font-black text-slate-900 italic tracking-tight">
            {{ title }}
          </h4>
          <p class="text-xs text-slate-500 font-medium">Reported safety incidents and investigation classification</p>
        </div>
      </div>

      <div class="flex items-center gap-2 self-start sm:self-auto flex-wrap">
        <!-- Segmented Toggle -->
        <div class="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 shadow-inner">
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
            <span>Visual Graph</span>
          </button>
          <button
            type="button"
            @click="currentView = 'numbers'"
            class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 min-h-[32px]"
            :class="currentView === 'numbers' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            title="Display detailed numbers and ranked cards"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Words &amp; Numbers</span>
          </button>
        </div>

        <span class="px-3 py-1 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-black rounded-full uppercase tracking-wider shrink-0 whitespace-nowrap">
          {{ totalIncidents }} Total Incidents
        </span>
      </div>
    </div>

    <!-- VIEW 1: Visual Graph with Words Explaining Each Point -->
    <div v-show="currentView === 'graph'" class="space-y-6 animate-fade-in">
      <div class="relative w-full h-56 sm:h-64 flex items-center justify-center">
        <canvas ref="chartCanvas"></canvas>
        <div v-if="!categoryItems.length" class="absolute inset-0 flex items-center justify-center bg-white/80">
          <p class="text-xs font-bold text-slate-400">No incident records reported for this timeframe</p>
        </div>
      </div>

      <!-- Descriptive Point Guide (Words Explaining Every Graph Point) -->
      <div v-if="categoryItems.length" class="space-y-2.5 pt-2 border-t border-slate-100">
        <h5 class="text-xs font-black uppercase tracking-wider text-slate-700">Category Point Guide &amp; Descriptions</h5>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          <div
            v-for="(item, idx) in categoryItems"
            :key="item.category + idx"
            class="p-3 rounded-xl border border-slate-200/70 bg-slate-50/60 flex flex-col justify-between"
          >
            <div>
              <div class="flex items-center justify-between gap-1 mb-1">
                <span class="text-xs font-black text-slate-900 flex items-center gap-1.5 truncate">
                  <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: palette[idx % palette.length] }"></span>
                  {{ item.category }}
                </span>
                <span class="text-xs font-black text-slate-700 tabular-nums shrink-0">
                  {{ item.count }} ({{ item.percent }}%)
                </span>
              </div>
              <p class="text-[11px] text-slate-600 leading-snug">
                {{ getCategoryExplanation(item.category) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- VIEW 2: Words of Numbers Breakdown (Ranked cards with progress bars) -->
    <div v-show="currentView === 'numbers'" class="space-y-3.5 animate-fade-in">
      <div v-if="!categoryItems.length" class="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
        <p class="text-sm font-bold text-slate-500">No incident reports recorded for this timeframe.</p>
      </div>

      <div
        v-for="(item, idx) in categoryItems"
        :key="item.category + idx"
        class="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col gap-2 hover:bg-slate-50 transition-colors"
      >
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2.5 min-w-0">
            <span class="w-6 h-6 rounded-full bg-rose-100 text-rose-800 text-xs font-black flex items-center justify-center shrink-0">
              {{ idx + 1 }}
            </span>
            <span class="text-xs sm:text-sm font-black text-slate-800 break-words">{{ item.category }}</span>
          </div>
          <div class="flex items-baseline gap-1.5 shrink-0">
            <span class="text-base font-black text-rose-700 tabular-nums">{{ item.count }}</span>
            <span class="text-xs font-bold text-slate-500">({{ item.percent }}%)</span>
          </div>
        </div>

        <div class="w-full h-2.5 bg-slate-200/60 rounded-full overflow-hidden">
          <div class="h-full bg-rose-500 rounded-full transition-all duration-500" :style="{ width: item.percent + '%' }"></div>
        </div>
        <p class="text-[11px] text-slate-600 font-medium">{{ getCategoryExplanation(item.category) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  incidentHeatmap: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: 'Incident Heatmap (By Category)'
  },
  dataTour: {
    type: String,
    default: 'ssu-incident-heatmap'
  },
  initialView: {
    type: String,
    default: 'graph'
  },
  globalView: {
    type: String,
    default: ''
  }
});

const currentView = ref(props.initialView);
const chartCanvas = ref(null);
let chartInstance = null;

const palette = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b'];

watch(() => props.globalView, (newMode) => {
  if (newMode === 'numbers') {
    currentView.value = 'numbers';
  } else if (newMode === 'graph') {
    currentView.value = 'graph';
  }
});

const totalIncidents = computed(() => {
  return (props.incidentHeatmap || []).reduce((acc, d) => acc + (Number(d.count) || 0), 0);
});

const categoryItems = computed(() => {
  const tot = totalIncidents.value;
  return (props.incidentHeatmap || []).map(d => {
    const cnt = Number(d.count) || 0;
    return {
      category: d.category || 'General Incident',
      count: cnt,
      percent: tot > 0 ? Math.round((cnt / tot) * 100) : 0
    };
  }).sort((a, b) => b.count - a.count);
});

const getCategoryExplanation = (cat) => {
  const lower = (cat || '').toLowerCase();
  if (lower.includes('theft') || lower.includes('property') || lower.includes('lost')) {
    return 'Missing personal or campus belongings reported for security tracing.';
  }
  if (lower.includes('hazard') || lower.includes('safety') || lower.includes('fire')) {
    return 'Physical or structural safety risks requiring perimeter control.';
  }
  if (lower.includes('disturbance') || lower.includes('altercation') || lower.includes('noise')) {
    return 'Campus order disruption or behavioral incident requiring officer mediation.';
  }
  if (lower.includes('damage') || lower.includes('vandalism')) {
    return 'Damage to university facilities, grounds, or equipment.';
  }
  if (lower.includes('trespass') || lower.includes('entry') || lower.includes('unauthorized')) {
    return 'Unauthorized perimeter access or checkpoint breaches.';
  }
  return 'Security log report filed for investigation and supervisory action.';
};

const renderChart = () => {
  if (!chartCanvas.value) return;

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  const items = categoryItems.value;
  if (!items.length) return;

  chartInstance = new Chart(chartCanvas.value, {
    type: 'doughnut',
    data: {
      labels: items.map(d => d.category),
      datasets: [{
        data: items.map(d => d.count),
        backgroundColor: palette.slice(0, items.length),
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverOffset: 12
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { family: 'Inter, sans-serif', size: 11, weight: 'bold' }, padding: 12 }
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
              const tot = totalIncidents.value;
              const pct = tot > 0 ? Math.round((val / tot) * 100) : 0;
              return ` ${ctx.label}: ${val} incident${val !== 1 ? 's' : ''} (${pct}%)`;
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

watch(() => props.incidentHeatmap, () => {
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

