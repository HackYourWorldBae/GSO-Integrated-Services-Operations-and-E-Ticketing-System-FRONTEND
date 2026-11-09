<template>
  <div :data-tour="dataTour" class="p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-300 shadow-sm transition-all">
    <!-- Header with Title & View Mode Toggle -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-200 pb-3">
      <div class="flex items-center gap-2">
        <h4 class="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
          {{ title }}
        </h4>
      </div>

      <div class="flex items-center gap-2 self-start sm:self-auto flex-wrap">
        <!-- Segmented Toggle -->
        <div class="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 shadow-inner">
          <button
            type="button"
            @click="currentView = 'cards'"
            class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 min-h-[30px]"
            :class="currentView === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            title="Display daily day-by-day cards"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Daily Cards</span>
          </button>
          <button
            type="button"
            @click="currentView = 'graph'"
            class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 min-h-[30px]"
            :class="currentView === 'graph' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            title="Display 7-day trend chart with descriptive points"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <span>Trend Graph</span>
          </button>
        </div>

        <span class="text-[10px] font-black text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
          7-Day Overview
        </span>
      </div>
    </div>

    <!-- VIEW 1: Words of Numbers Breakdown (Original 7 Clickable Day Cards) -->
    <div v-show="currentView === 'cards'" class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 animate-fade-in">
      <button
        v-for="day in dailyBreakdown"
        :key="day.date"
        type="button"
        @click="$emit('select-day', day.date)"
        class="p-3 rounded-xl border transition-all text-left flex flex-col justify-between cursor-pointer"
        :class="selectedPeriod === 'day' && selectedDate === day.date
          ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900 ring-offset-2'
          : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/70 text-slate-800'"
      >
        <div>
          <div class="flex items-center justify-between gap-1 mb-1">
            <span 
              class="text-xs font-black uppercase tracking-wider"
              :class="selectedPeriod === 'day' && selectedDate === day.date ? 'text-emerald-400' : (day.is_today ? (accentColor === 'rose' ? 'text-rose-600' : 'text-emerald-600') : 'text-slate-500')"
            >
              {{ day.day_name }}
            </span>
            <span 
              v-if="day.is_today" 
              class="text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tight"
              :class="selectedPeriod === 'day' && selectedDate === day.date ? 'bg-emerald-400/20 text-emerald-300' : (accentColor === 'rose' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700')"
            >
              Today
            </span>
          </div>
          <p 
            class="text-xs font-bold"
            :class="selectedPeriod === 'day' && selectedDate === day.date ? 'text-slate-300' : 'text-slate-600'"
          >
            {{ day.label }}
          </p>
        </div>

        <div class="mt-3 pt-2.5 border-t" :class="selectedPeriod === 'day' && selectedDate === day.date ? 'border-slate-800' : 'border-slate-200/70'">
          <div class="flex items-center justify-between text-[11px] mb-0.5">
            <span :class="selectedPeriod === 'day' && selectedDate === day.date ? 'text-slate-300' : 'text-slate-500'">Requests</span>
            <span class="font-black tabular-nums" :class="selectedPeriod === 'day' && selectedDate === day.date ? 'text-white' : 'text-slate-800'">{{ day.total_requests }}</span>
          </div>
          <div class="flex items-center justify-between text-[11px]">
            <span :class="selectedPeriod === 'day' && selectedDate === day.date ? 'text-emerald-300' : (accentColor === 'rose' ? 'text-rose-600' : 'text-emerald-600')">Completed</span>
            <span class="font-black tabular-nums" :class="selectedPeriod === 'day' && selectedDate === day.date ? 'text-emerald-400' : (accentColor === 'rose' ? 'text-rose-700' : 'text-emerald-700')">{{ day.completed_jobs }}</span>
          </div>

          <!-- Mini completion bar -->
          <div class="w-full h-1.5 rounded-full overflow-hidden mt-1.5" :class="selectedPeriod === 'day' && selectedDate === day.date ? 'bg-slate-800' : 'bg-slate-200'">
            <div 
              class="h-full rounded-full transition-all duration-300"
              :class="accentColor === 'rose' ? 'bg-rose-500' : 'bg-emerald-500'"
              :style="{ width: (day.total_requests > 0 ? Math.min(100, Math.round((day.completed_jobs / day.total_requests) * 100)) : (day.completed_jobs > 0 ? 100 : 0)) + '%' }"
            ></div>
          </div>
        </div>
      </button>
    </div>

    <!-- VIEW 2: Visual Graph with Words Explaining Each Point -->
    <div v-show="currentView === 'graph'" class="space-y-4 animate-fade-in">
      <div class="relative w-full h-56 sm:h-64">
        <canvas ref="chartCanvas"></canvas>
      </div>

      <!-- Descriptive Point Guide -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
          <span class="text-xs font-black text-slate-800 flex items-center gap-1.5 mb-1">
            <span class="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
            Submitted Requests
          </span>
          <p class="text-[11px] text-slate-600 leading-snug">
            Work order volume initiated by faculty, staff, or students on that date.
          </p>
        </div>

        <div class="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
          <span class="text-xs font-black text-emerald-800 flex items-center gap-1.5 mb-1">
            <span class="w-2.5 h-2.5 rounded-full" :class="accentColor === 'rose' ? 'bg-rose-500' : 'bg-emerald-500'"></span>
            Completed Jobs
          </span>
          <p class="text-[11px] text-slate-600 leading-snug">
            Tickets inspected, repaired, or resolved by unit personnel on that date.
          </p>
        </div>

        <div class="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
          <span class="text-xs font-black text-blue-800 flex items-center gap-1.5 mb-1">
            <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            7-Day Fulfillment
          </span>
          <p class="text-[11px] text-slate-600 leading-snug">
            {{ totalCompletedWeek }} of {{ totalRequestsWeek }} tickets resolved ({{ fulfillmentRateWeek }}% weekly rate).
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  dailyBreakdown: {
    type: Array,
    default: () => []
  },
  selectedPeriod: {
    type: String,
    default: 'month'
  },
  selectedDate: {
    type: String,
    default: ''
  },
  accentColor: {
    type: String,
    default: 'emerald' // 'emerald' | 'rose'
  },
  title: {
    type: String,
    default: 'Daily Activity Tracker (Last 7 Days)'
  },
  dataTour: {
    type: String,
    default: 'admin-daily-tracker'
  },
  initialView: {
    type: String,
    default: 'cards'
  },
  globalView: {
    type: String,
    default: ''
  }
});

defineEmits(['select-day']);

const currentView = ref(props.initialView);
const chartCanvas = ref(null);
let chartInstance = null;

watch(() => props.globalView, (newMode) => {
  if (newMode === 'numbers' || newMode === 'cards') {
    currentView.value = 'cards';
  } else if (newMode === 'graph') {
    currentView.value = 'graph';
  }
});

const totalRequestsWeek = computed(() => {
  return (props.dailyBreakdown || []).reduce((acc, d) => acc + (Number(d.total_requests) || 0), 0);
});

const totalCompletedWeek = computed(() => {
  return (props.dailyBreakdown || []).reduce((acc, d) => acc + (Number(d.completed_jobs) || 0), 0);
});

const fulfillmentRateWeek = computed(() => {
  if (!totalRequestsWeek.value) return totalCompletedWeek.value > 0 ? 100 : 0;
  return Math.min(100, Math.round((totalCompletedWeek.value / totalRequestsWeek.value) * 100));
});

const renderChart = () => {
  if (!chartCanvas.value) return;

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  const items = props.dailyBreakdown || [];
  if (!items.length) return;

  const labels = items.map(d => `${d.day_name} (${d.label})`);
  const requestsData = items.map(d => Number(d.total_requests) || 0);
  const completedData = items.map(d => Number(d.completed_jobs) || 0);

  const completedColor = props.accentColor === 'rose' ? '#f43f5e' : '#10b981';
  const completedBg = props.accentColor === 'rose' ? 'rgba(244, 63, 94, 0.85)' : 'rgba(16, 185, 129, 0.85)';

  chartInstance = new Chart(chartCanvas.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Requests Submitted',
          data: requestsData,
          backgroundColor: 'rgba(30, 41, 59, 0.85)',
          borderColor: '#0f172a',
          borderWidth: 1.5,
          borderRadius: 6,
          barPercentage: 0.6
        },
        {
          label: 'Jobs Completed',
          data: completedData,
          backgroundColor: completedBg,
          borderColor: completedColor,
          borderWidth: 1.5,
          borderRadius: 6,
          barPercentage: 0.6
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
          ticks: {
            precision: 0,
            font: { family: 'Inter, sans-serif', size: 11, weight: 'bold' }
          },
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
          titleFont: { size: 12, weight: 'bold' },
          bodyFont: { size: 12 },
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            afterBody: (ctx) => {
              const idx = ctx[0]?.dataIndex;
              if (idx !== undefined && items[idx]) {
                const req = Number(items[idx].total_requests) || 0;
                const comp = Number(items[idx].completed_jobs) || 0;
                const pct = req > 0 ? Math.min(100, Math.round((comp / req) * 100)) : (comp > 0 ? 100 : 0);
                return `Fulfillment Efficiency: ${pct}%`;
              }
              return '';
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

watch(() => props.dailyBreakdown, () => {
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

