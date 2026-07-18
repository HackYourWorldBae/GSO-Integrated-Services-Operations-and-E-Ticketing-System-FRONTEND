<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/admin/leau" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <span class="text">LEAU Home</span>
      </router-link>
      <router-link to="/admin/leau/queues" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span class="text">Ticket Queues</span>
      </router-link>
      <router-link to="/admin/leau/personnel" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span class="text">Personnel Management</span>
      </router-link>
      <div class="mt-8 mb-4 px-4">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Archived Tickets</p>
      </div>
      <router-link to="/admin/leau/archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span class="text">Archives</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">LEAU Dashboard</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Landscaping & Environmental Aesthetics</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in pb-12">
        
        <!-- Key Metrics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-tighter">Campus Coverage</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">98.2%</h3>
            <div class="mt-2 flex items-center gap-1">
              <span class="text-xs font-bold text-emerald-600">Optimal</span>
              <span class="text-[10px] text-slate-400 font-medium italic">Landscape health</span>
            </div>
          </div>

          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-teal-50 text-teal-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-full uppercase tracking-tighter">Aesthetic Rating</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">100%</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Excellent Standard</p>
          </div>

          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-amber-50 text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
              </div>
              <span class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full uppercase tracking-tighter">Borrowed Items</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">42</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Plants & Tools</p>
          </div>

          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-slate-900 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-full uppercase tracking-tighter">Manpower</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">18</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Landscape Artists</p>
          </div>
        </div>

        <!-- Aesthetic focus summary -->
        <div class="p-8 rounded-[2.5rem] bg-gradient-to-br from-teal-900 to-emerald-900 text-white shadow-2xl relative overflow-hidden">
          <div class="absolute top-0 right-0 p-8 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
          </div>
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="max-w-xl">
              <h3 class="text-2xl font-black tracking-tight mb-2">Aesthetic Improvement Insights</h3>
              <p class="text-emerald-100 text-sm font-medium leading-relaxed italic">"Stage & Hall Decoration" requests have spiked this month. While "Quality" remains at a perfect 5.0, "Timeliness" is affected by manpower absenteeism. Improving the rotation for borrowed tool maintenance is recommended for next month.</p>
            </div>
            <div class="flex gap-3">
              <div class="px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex flex-col items-center">
                <span class="text-amber-400 font-black text-xl italic">82%</span>
                <span class="text-[10px] uppercase font-bold tracking-widest text-emerald-300 mt-1">Return Rate</span>
              </div>
              <div class="px-6 py-3 rounded-2xl bg-white text-emerald-900 shadow-lg flex flex-col items-center justify-center">
                <span class="text-xs font-black uppercase tracking-widest leading-none mb-1">Mowing</span>
                <span class="text-[8px] font-bold opacity-80 italic uppercase text-emerald-600">Top Service</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <!-- Performance Radar -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col min-h-[350px] lg:h-[400px]">
            <h4 class="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 italic">
              <div class="w-2 h-6 bg-teal-500 rounded-full"></div>
              Aesthetic Standards
            </h4>
            <div class="flex-1 relative">
              <canvas id="leauPerformanceRadar"></canvas>
            </div>
          </div>

          <!-- Inventory Borrowing Return Analysis -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col min-h-[350px] lg:h-[400px]">
            <h4 class="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 italic">
              <div class="w-2 h-6 bg-amber-500 rounded-full"></div>
              Inventory Return Analysis
            </h4>
            <div class="flex-1 relative">
              <canvas id="inventoryReturnChart"></canvas>
            </div>
          </div>

          <!-- Completion Status -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col lg:col-span-1 min-h-[350px] lg:h-[400px]">
            <h4 class="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 italic">
              <div class="w-2 h-6 bg-slate-400 rounded-full"></div>
              Job Completion Health
            </h4>
            <div class="flex-1 relative">
              <canvas id="leauCompletionDoughnut"></canvas>
            </div>
          </div>

          <!-- Workload Distribution -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col lg:col-span-1 min-h-[350px] lg:h-[400px]">
            <h4 class="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 italic">
              <div class="w-2 h-6 bg-emerald-500 rounded-full"></div>
              Scope Distribution
            </h4>
            <div class="flex-1 relative">
              <canvas id="scopeDistributionChart"></canvas>
            </div>
          </div>

          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col lg:col-span-2">
            <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 mb-10">
              <h4 class="text-lg font-black text-slate-900 flex items-center gap-3 italic">
                <div class="w-2 h-6 bg-rose-500 rounded-full shrink-0"></div>
                Root Cause Analysis (Improvement Drivers)
              </h4>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic leading-none bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">Operational Barriers</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div class="space-y-6">
                <p class="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Reasons for Delay</p>
                <div class="relative h-48">
                  <canvas id="leauDelayReasonsChart"></canvas>
                </div>
              </div>
              <div class="space-y-6">
                <p class="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Reasons for Non-Completion</p>
                <div class="relative h-48">
                  <canvas id="leauNonCompletionChart"></canvas>
                </div>
              </div>
            </div>
          </div>

          <!-- Service Request Frequency -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col lg:col-span-2">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-8">
              <h4 class="text-lg font-black text-slate-900 flex items-center gap-2 italic">
                <div class="w-2 h-6 bg-teal-500 rounded-full"></div>
                Service Request Frequency
              </h4>
              <div class="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                <button
                  v-for="filter in leauPeriodFilters"
                  :key="filter.key"
                  @click="setLeauPeriod(filter.key)"
                  :class="[
                    'px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all',
                    leauActivePeriod === filter.key
                      ? 'bg-white text-teal-600 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  ]"
                >
                  {{ filter.label }}
                </button>
              </div>
            </div>
            <div class="relative h-64">
              <canvas id="leauServiceFreqChart"></canvas>
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

const leauActivePeriod = ref('Month');

const leauPeriodFilters = [
  { key: 'Day',   label: 'This Day' },
  { key: 'Week',  label: 'This Week' },
  { key: 'Month', label: 'This Month' },
  { key: 'Year',  label: 'This Year' }
];

const leauServiceLabels = [
  'Disinfection',
  'Cleaning/ Grubbing',
  'Hauling',
  'Mowing/ Weeding',
  'Planting/ Landscaping',
  'Pruning/ Cutting',
  'Borrowing of plants',
  'Stage & Hall Decoration',
  'Borrowing of tools/ equipment',
  'Others'
];

// Total service request counts per period for LEAU services based on selection page
const leauServiceFreqData = {
  Day: {
    labels: leauServiceLabels,
    data:   [4, 5, 3, 6, 4, 2, 3, 2, 5, 3]
  },
  Week: {
    labels: leauServiceLabels,
    data:   [22, 28, 19, 38, 24, 12, 18, 15, 30, 16]
  },
  Month: {
    labels: leauServiceLabels,
    data:   [85, 105, 70, 140, 95, 45, 65, 55, 110, 60]
  },
  Year: {
    labels: leauServiceLabels,
    data:   [980, 1200, 850, 1550, 1080, 510, 780, 650, 1300, 720]
  }
};

let leauServiceFreqChart = null;

function setLeauPeriod(period) {
  leauActivePeriod.value = period;
  const { labels, data } = leauServiceFreqData[period];
  leauServiceFreqChart.data.labels = labels;
  leauServiceFreqChart.data.datasets[0].data = data;
  leauServiceFreqChart.update();
}

onMounted(() => {
  // 1. Performance Radar Chart
  const radarCtx = document.getElementById('leauPerformanceRadar');
  new Chart(radarCtx, {
    type: 'radar',
    data: {
      labels: ['Quality', 'Efficiency', 'Timeliness'],
      datasets: [{
        label: 'Current Avg (1-5)',
        data: [4.9, 4.4, 3.2],
        backgroundColor: 'rgba(20, 184, 166, 0.2)',
        borderColor: '#14b8a6',
        pointBackgroundColor: '#14b8a6',
        borderWidth: 3
      }, {
        label: 'Target Standard',
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

  // 2. Inventory Return Analysis
  const inventoryCtx = document.getElementById('inventoryReturnChart');
  new Chart(inventoryCtx, {
    type: 'bar',
    data: {
      labels: ['Plants', 'Tools', 'Equipment'],
      datasets: [{
        label: 'Returned',
        data: [35, 12, 8],
        backgroundColor: '#10b981',
        borderRadius: 6
      }, {
        label: 'Outstanding',
        data: [8, 4, 2],
        backgroundColor: '#ef4444',
        borderRadius: 6
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom', labels: { font: { weight: '700' } } }
      },
      scales: {
        x: { stacked: true, grid: { display: false } },
        y: { stacked: true, grid: { borderDash: [5, 5] } }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });

  // 3. Completion Health Doughnut
  const completionCtx = document.getElementById('leauCompletionDoughnut');
  new Chart(completionCtx, {
    type: 'doughnut',
    data: {
      labels: ['On-time', 'Beyond Time', 'Not Completed'],
      datasets: [{
        data: [72, 18, 10],
        backgroundColor: ['#14b8a6', '#f59e0b', '#ef4444'],
        hoverOffset: 15,
        borderRadius: 10,
        borderWidth: 4,
        borderColor: '#ffffff'
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom', labels: { font: { weight: '800' }, padding: 20 } }
      },
      cutout: '70%',
      responsive: true,
      maintainAspectRatio: false
    }
  });

  // 4. Scope Distribution
  const scopeCtx = document.getElementById('scopeDistributionChart');
  new Chart(scopeCtx, {
    type: 'polarArea',
    data: {
      labels: ['Planting', 'Mowing', 'Decoration', 'Pruning'],
      datasets: [{
        data: [45, 25, 35, 15],
        backgroundColor: [
          'rgba(16, 185, 129, 0.7)',
          'rgba(20, 184, 166, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(148, 163, 184, 0.7)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom', labels: { font: { weight: '700' } } }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });

  // 5. Delay Reasons
  const delayCtx = document.getElementById('leauDelayReasonsChart');
  new Chart(delayCtx, {
    type: 'bar',
    data: {
      labels: ['Absenteeism', 'Extra Work', 'Extended Break'],
      datasets: [{
        label: 'Occurrences',
        data: [15, 8, 4],
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

  // 6. Non-Completion Barriers
  const nonCompCtx = document.getElementById('leauNonCompletionChart');
  new Chart(nonCompCtx, {
    type: 'bar',
    data: {
      labels: ['Lack Materials', 'Lack Tools', 'Lack Skills'],
      datasets: [{
        label: 'Occurrences',
        data: [10, 5, 3],
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

  // 7. Service Request Frequency Chart
  const freqCtx = document.getElementById('leauServiceFreqChart');
  const initFreq = leauServiceFreqData[leauActivePeriod.value];
  leauServiceFreqChart = new Chart(freqCtx, {
    type: 'bar',
    data: {
      labels: initFreq.labels,
      datasets: [{
        label: 'Requests',
        data: initFreq.data,
        backgroundColor: [
          '#14b8a6', '#2dd4bf', '#5eead4',
          '#99f6e4', '#0d9488', '#0f766e',
          '#115e59', '#134e4a', '#042f2e', '#022c2b'
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

