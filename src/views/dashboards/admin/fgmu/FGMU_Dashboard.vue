<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/admin/fgmu" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <span class="text">FGMU Home</span>
      </router-link>
      <router-link to="/admin/fgmu/queues" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span class="text">Ticket Queues</span>
      </router-link>
      <router-link to="/admin/fgmu/personnel" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span class="text">Personnel Management</span>
      </router-link>
      <div class="mt-8 mb-4 px-4">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Archived Tickets</p>
      </div>
      <router-link to="/admin/fgmu/archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span class="text">Archives</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">FGMU Dashboard</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Facilities & Ground Management</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in pb-12">
        
        <!-- Key Metrics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-tighter">On-Time Rate</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">84%</h3>
            <div class="mt-2 flex items-center gap-1">
              <span class="text-xs font-bold text-emerald-600">+2.4%</span>
              <span class="text-[10px] text-slate-400 font-medium italic">vs last month</span>
            </div>
          </div>

          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-amber-50 text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full uppercase tracking-tighter">Avg Delay</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">2.4</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Days Per Job</p>
          </div>

          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-rose-50 text-rose-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full uppercase tracking-tighter">Resource Gap</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">12</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Pending Materials</p>
          </div>

          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-slate-900 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-full uppercase tracking-tighter">Efficiency</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">4.2/5</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Evaluation Score</p>
          </div>
        </div>

        <!-- Improvement focus summary -->
        <div class="p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl relative overflow-hidden">
          <div class="absolute top-0 right-0 p-8 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          </div>
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="max-w-xl">
              <h3 class="text-2xl font-black tracking-tight mb-2">Service Improvement Insights</h3>
              <p class="text-slate-300 text-sm font-medium leading-relaxed italic">"Lack of Materials" and "Additional Work Requests" are currently the primary drivers for completion delays. Next month's focus should prioritize inventory stocking and more rigorous initial site assessments.</p>
            </div>
            <div class="flex gap-3">
              <div class="px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex flex-col items-center">
                <span class="text-rose-400 font-black text-xl italic">#1</span>
                <span class="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">Bottleneck</span>
              </div>
              <div class="px-6 py-3 rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 flex flex-col items-center justify-center">
                <span class="text-xs font-black uppercase tracking-widest leading-none mb-1">Stock Up</span>
                <span class="text-[8px] font-bold opacity-80 italic uppercase">Material Priority</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <!-- Performance Radar -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col min-h-[350px] lg:h-[400px]">
            <h4 class="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 italic">
              <div class="w-2 h-6 bg-emerald-500 rounded-full"></div>
              Evaluation Averages
            </h4>
            <div class="flex-1 relative">
              <canvas id="performanceRadar"></canvas>
            </div>
          </div>

          <!-- Completion Status -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col min-h-[350px] lg:h-[400px]">
            <h4 class="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 italic">
              <div class="w-2 h-6 bg-slate-400 rounded-full"></div>
              Job Completion Health
            </h4>
            <div class="flex-1 relative">
              <canvas id="completionDoughnut"></canvas>
            </div>
          </div>

          <!-- Delay Analysis -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col lg:col-span-2">
            <div class="flex items-center justify-between mb-8">
              <h4 class="text-lg font-black text-slate-900 flex items-center gap-2 italic">
                <div class="w-2 h-6 bg-amber-500 rounded-full"></div>
                Root Cause Analysis (Why Delays Happen)
              </h4>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic leading-none">Improvement Focus</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div class="space-y-6">
                <p class="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Completed Beyond Time (Reasons)</p>
                <div class="relative h-48">
                  <canvas id="delayReasonsChart"></canvas>
                </div>
              </div>
              <div class="space-y-6">
                <p class="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Not Completed/Performed (Barriers)</p>
                <div class="relative h-48">
                  <canvas id="nonCompletionChart"></canvas>
                </div>
              </div>
            </div>
          </div>

          <!-- Service Request Frequency -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col lg:col-span-2">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-8">
              <h4 class="text-lg font-black text-slate-900 flex items-center gap-2 italic">
                <div class="w-2 h-6 bg-emerald-500 rounded-full"></div>
                Service Request Frequency
              </h4>
              <div class="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                <button
                  v-for="filter in fgmuPeriodFilters"
                  :key="filter.key"
                  @click="setFgmuPeriod(filter.key)"
                  :class="[
                    'px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all',
                    fgmuActivePeriod === filter.key
                      ? 'bg-white text-emerald-600 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  ]"
                >
                  {{ filter.label }}
                </button>
              </div>
            </div>
            <div class="relative h-64">
              <canvas id="fgmuServiceFreqChart"></canvas>
            </div>
          </div>

        </div>

      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import Chart from 'chart.js/auto';

const fgmuActivePeriod = ref('Month');

const fgmuPeriodFilters = [
  { key: 'Day',   label: 'This Day' },
  { key: 'Week',  label: 'This Week' },
  { key: 'Month', label: 'This Month' },
  { key: 'Year',  label: 'This Year' }
];

const fgmuServiceLabels = [
  'Concrete Works',
  'Masonry Works',
  'Welding & Tinsmith Works',
  'Carpentry & Joinery',
  'Glass & Glazing Works',
  'Painting Works',
  'Electrical Work',
  'Plumbing & Sanitary Works',
  'Electronics & Communication Works',
  'Mechanical Works'
];

// Total service request counts per period for FGMU services based on selection page
const fgmuServiceFreqData = {
  Day: {
    labels: fgmuServiceLabels,
    data:   [5, 3, 4, 6, 2, 8, 9, 7, 3, 5]
  },
  Week: {
    labels: fgmuServiceLabels,
    data:   [28, 18, 22, 35, 14, 45, 52, 40, 19, 31]
  },
  Month: {
    labels: fgmuServiceLabels,
    data:   [95, 64, 78, 120, 48, 145, 168, 132, 65, 102]
  },
  Year: {
    labels: fgmuServiceLabels,
    data:   [1050, 720, 890, 1380, 540, 1650, 1890, 1480, 740, 1150]
  }
};

let fgmuServiceFreqChart = null;

function setFgmuPeriod(period) {
  fgmuActivePeriod.value = period;
  const { labels, data } = fgmuServiceFreqData[period];
  fgmuServiceFreqChart.data.labels = labels;
  fgmuServiceFreqChart.data.datasets[0].data = data;
  fgmuServiceFreqChart.update();
}

onMounted(() => {
  // 1. Performance Radar Chart
  const radarCtx = document.getElementById('performanceRadar');
  new Chart(radarCtx, {
    type: 'radar',
    data: {
      labels: ['Quality', 'Efficiency', 'Timeliness'],
      datasets: [{
        label: 'Current Avg (1-5)',
        data: [4.2, 3.8, 3.5],
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: '#10b981',
        pointBackgroundColor: '#10b981',
        borderWidth: 3
      }, {
        label: 'Target Score',
        data: [4.5, 4.5, 4.5],
        backgroundColor: 'rgba(226, 232, 240, 0.1)',
        borderColor: '#94a3b8',
        borderDash: [5, 5],
        borderWidth: 1,
        pointRadius: 0
      }]
    },
    options: {
      scales: {
        r: {
          min: 0,
          max: 5,
          ticks: { stepSize: 1, display: false },
          pointLabels: {
            font: { family: 'Inter', weight: '900', size: 12 },
            color: '#1e293b'
          }
        }
      },
      plugins: {
        legend: { position: 'bottom', labels: { font: { weight: '700' } } }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });

  // 2. Completion Health Doughnut
  const completionCtx = document.getElementById('completionDoughnut');
  new Chart(completionCtx, {
    type: 'doughnut',
    data: {
      labels: ['On-time', 'Beyond Time', 'Not Completed'],
      datasets: [{
        data: [65, 25, 10],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        hoverOffset: 15,
        borderRadius: 10,
        borderWidth: 4,
        borderColor: '#ffffff'
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom', labels: { font: { weight: '800', size: 11 }, padding: 20 } }
      },
      cutout: '70%',
      responsive: true,
      maintainAspectRatio: false
    }
  });

  // 3. Delay Reasons (Horizontal Bar)
  const delayCtx = document.getElementById('delayReasonsChart');
  new Chart(delayCtx, {
    type: 'bar',
    data: {
      labels: ['Absenteeism', 'Extra Work', 'Extended Break'],
      datasets: [{
        label: 'Occurrences',
        data: [12, 18, 5],
        backgroundColor: '#f59e0b',
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { ticks: { font: { weight: '700', size: 10 } } }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });

  // 4. Non-Completion (Horizontal Bar)
  const nonCompCtx = document.getElementById('nonCompletionChart');
  new Chart(nonCompCtx, {
    type: 'bar',
    data: {
      labels: ['Lack Materials', 'Lack Tools', 'Lack Skills'],
      datasets: [{
        label: 'Occurrences',
        data: [15, 6, 8],
        backgroundColor: '#ef4444',
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { ticks: { font: { weight: '700', size: 10 } } }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });

  // 5. Service Request Frequency Chart
  const freqCtx = document.getElementById('fgmuServiceFreqChart');
  const initFreq = fgmuServiceFreqData[fgmuActivePeriod.value];
  fgmuServiceFreqChart = new Chart(freqCtx, {
    type: 'bar',
    data: {
      labels: initFreq.labels,
      datasets: [{
        label: 'Requests',
        data: initFreq.data,
        backgroundColor: [
          '#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0',
          '#0f766e', '#0d9488', '#14b8a6', '#2dd4bf', '#5eead4'
        ],
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { weight: '700', size: 10 } } },
        y: {
          grid: { borderDash: [4, 4], color: '#f1f5f9' },
          ticks: { font: { weight: '700' } }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });
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

