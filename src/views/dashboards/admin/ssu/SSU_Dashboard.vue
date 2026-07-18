<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/admin/ssu" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span class="text">SSU Home</span>
      </router-link>

      <router-link to="/admin/ssu/queues/incidents" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span class="text">Incident Ticket Queues</span>
      </router-link>

      <router-link to="/admin/ssu/queues/stickers" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
        <span class="text">Sticker Ticket Queues</span>
      </router-link>

      <router-link to="/admin/ssu/queues/stickers/verified" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text">Verified Vehicle Pass Tickets</span>
      </router-link>
      <div class="mt-8 mb-4 px-4">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Archived Tickets</p>
      </div>
      <router-link to="/admin/ssu/archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span class="text">Archives</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">SSU Dashboard</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Security Services Unit Control</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in pb-12">
        
        <!-- Key Metrics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-rose-50 text-rose-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full uppercase tracking-tighter">Emergency Calls</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">04</h3>
            <div class="mt-2 flex items-center gap-1">
              <span class="text-xs font-bold text-rose-600">Active</span>
              <span class="text-[10px] text-slate-400 font-medium italic">Priority 1 alerts</span>
            </div>
          </div>

          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-slate-900 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-full uppercase tracking-tighter">Pass Stickers</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">1.2k</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Vehicle Passes Issued</p>
          </div>

          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-amber-50 text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <span class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full uppercase tracking-tighter">Reports Today</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">12</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Total Incidents Logged</p>
          </div>

          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-tighter">Guard Coverage</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">100%</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">All Posts Active</p>
          </div>
        </div>

        <!-- Security Intelligence Summary -->
        <div class="p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl relative overflow-hidden">
          <div class="absolute top-0 right-0 p-8 opacity-10">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="max-w-xl">
              <h3 class="text-2xl font-black tracking-tight mb-2">Security Intelligence Briefing</h3>
              <p class="text-slate-300 text-sm font-medium leading-relaxed italic">"Road Accidents" and "Unauthorized Entry" incidents have increased in Zone B. Currently, 24 vehicle pass stickers are awaiting BSU ID verification. Recommend increasing guard patrols near the West Gate between 5 PM and 8 PM.</p>
            </div>
            <div class="flex gap-3">
              <div class="px-6 py-4 rounded-2xl bg-rose-500/20 backdrop-blur-md border border-rose-500/20 flex flex-col items-center">
                <span class="text-rose-400 font-black text-xl italic">+12%</span>
                <span class="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">Incident Trend</span>
              </div>
              <div class="px-6 py-3 rounded-2xl bg-white text-slate-900 shadow-lg flex flex-col items-center justify-center">
                <span class="text-xs font-black uppercase tracking-widest leading-none mb-1">Passes</span>
                <span class="text-[8px] font-bold opacity-80 italic uppercase text-slate-500">68 Pending</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <!-- Incident Distribution -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col min-h-[350px] lg:h-[400px]">
            <h4 class="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 italic">
              <div class="w-2 h-6 bg-rose-500 rounded-full"></div>
              Incident Heatmap (By Category)
            </h4>
            <div class="flex-1 relative">
              <canvas id="incidentDoughnut"></canvas>
            </div>
          </div>

          <!-- Vehicle Pass Pipeline -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col h-[400px]">
            <h4 class="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 italic">
              <div class="w-2 h-6 bg-slate-900 rounded-full"></div>
              Vehicle Pass Issuance Pipeline
            </h4>
            <div class="flex-1 relative">
              <canvas id="passPipelineChart"></canvas>
            </div>
          </div>

          <!-- Report Sources -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col h-[350px]">
            <h4 class="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 italic">
              <div class="w-2 h-6 bg-emerald-500 rounded-full"></div>
              Reporter Demographics
            </h4>
            <div class="flex-1 relative">
              <canvas id="reporterSourcesChart"></canvas>
            </div>
          </div>

          <!-- System Overview Radar -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col min-h-[350px] lg:h-[400px]">
            <h4 class="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 italic">
              <div class="w-2 h-6 bg-amber-500 rounded-full"></div>
              Operations Standard (SLAs)
            </h4>
            <div class="flex-1 relative">
              <canvas id="securitySlaRadar"></canvas>
            </div>
          </div>

          <!-- Service Request Frequency -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col lg:col-span-2">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-8">
              <h4 class="text-lg font-black text-slate-900 flex items-center gap-2 italic">
                <div class="w-2 h-6 bg-rose-500 rounded-full"></div>
                Service Request Frequency
              </h4>
              <div class="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                <button
                  v-for="filter in ssuPeriodFilters"
                  :key="filter.key"
                  @click="setSsuPeriod(filter.key)"
                  :class="[
                    'px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all',
                    ssuActivePeriod === filter.key
                      ? 'bg-white text-rose-600 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  ]"
                >
                  {{ filter.label }}
                </button>
              </div>
            </div>
            <div class="relative h-64">
              <canvas id="ssuServiceFreqChart"></canvas>
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

const ssuActivePeriod = ref('Month');

const ssuPeriodFilters = [
  { key: 'Day',   label: 'This Day' },
  { key: 'Week',  label: 'This Week' },
  { key: 'Month', label: 'This Month' },
  { key: 'Year',  label: 'This Year' }
];

// Total service request counts per period for SSU services
const ssuServiceFreqData = {
  Day: {
    labels: ['Vehicle Pass Application', 'Incident Report Filing', 'Gate Access Request', 'Guard Escort Request', 'Lost & Found', 'CCTV Footage Request'],
    data:   [12, 5, 8, 2, 3, 1]
  },
  Week: {
    labels: ['Vehicle Pass Application', 'Incident Report Filing', 'Gate Access Request', 'Guard Escort Request', 'Lost & Found', 'CCTV Footage Request'],
    data:   [72, 28, 48, 11, 16, 5]
  },
  Month: {
    labels: ['Vehicle Pass Application', 'Incident Report Filing', 'Gate Access Request', 'Guard Escort Request', 'Lost & Found', 'CCTV Footage Request'],
    data:   [210, 88, 145, 34, 52, 18]
  },
  Year: {
    labels: ['Vehicle Pass Application', 'Incident Report Filing', 'Gate Access Request', 'Guard Escort Request', 'Lost & Found', 'CCTV Footage Request'],
    data:   [2480, 1050, 1720, 390, 610, 205]
  }
};

let ssuServiceFreqChart = null;

function setSsuPeriod(period) {
  ssuActivePeriod.value = period;
  const { labels, data } = ssuServiceFreqData[period];
  ssuServiceFreqChart.data.labels = labels;
  ssuServiceFreqChart.data.datasets[0].data = data;
  ssuServiceFreqChart.update();
}

onMounted(() => {
  // 1. Incident Doughnut Chart
  const incidentCtx = document.getElementById('incidentDoughnut');
  new Chart(incidentCtx, {
    type: 'doughnut',
    data: {
      labels: ['Theft/Burglary', 'Road Accident', 'Unauthorized Entry', 'Vandalism', 'Fire Incident', 'Other'],
      datasets: [{
        data: [15, 30, 20, 10, 5, 20],
        backgroundColor: ['#f43f5e', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444', '#94a3b8'],
        hoverOffset: 15,
        borderRadius: 10,
        borderWidth: 4,
        borderColor: '#ffffff'
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom', labels: { font: { weight: '700', size: 10 }, padding: 15 } }
      },
      cutout: '65%',
      responsive: true,
      maintainAspectRatio: false
    }
  });

  // 2. Vehicle Pass Pipeline
  const passCtx = document.getElementById('passPipelineChart');
  new Chart(passCtx, {
    type: 'bar',
    data: {
      labels: ['Total Applications', 'Verifying IDs', 'Approved/Issued'],
      datasets: [{
        label: 'Employee Passes',
        data: [450, 120, 330],
        backgroundColor: '#0f172a',
        borderRadius: 8
      }, {
        label: 'Student Passes',
        data: [820, 240, 580],
        backgroundColor: '#10b981',
        borderRadius: 8
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom', labels: { font: { weight: '700' } } }
      },
      scales: {
        x: { grid: { display: false } },
        y: { ticks: { font: { weight: '700' } } }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });

  // 3. Reporter Horizontal Bar
  const repCtx = document.getElementById('reporterSourcesChart');
  new Chart(repCtx, {
    type: 'bar',
    data: {
      labels: ['Students', 'Employees', 'Agency Guards', 'Watchman', 'Visitors'],
      datasets: [{
        label: 'Incident Reports Filed',
        data: [45, 15, 30, 12, 8],
        backgroundColor: '#10b981',
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

  // 4. Security Radar
  const radarCtx = document.getElementById('securitySlaRadar');
  new Chart(radarCtx, {
    type: 'radar',
    data: {
      labels: ['Response Time', 'CCTV Coverage', 'Guard Presence', 'Fire Readiness', 'System Uptime'],
      datasets: [{
        label: 'Current Status',
        data: [85, 92, 100, 78, 98],
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        borderColor: '#f59e0b',
        pointBackgroundColor: '#f59e0b',
        borderWidth: 3
      }, {
        label: 'Target SLAs',
        data: [100, 100, 100, 100, 100],
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
          max: 100,
          ticks: { stepSize: 20, display: false },
          pointLabels: {
            font: { family: 'Inter', weight: '900', size: 10 },
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

  // 5. Service Request Frequency Chart
  const freqCtx = document.getElementById('ssuServiceFreqChart');
  const initFreq = ssuServiceFreqData[ssuActivePeriod.value];
  ssuServiceFreqChart = new Chart(freqCtx, {
    type: 'bar',
    data: {
      labels: initFreq.labels,
      datasets: [{
        label: 'Requests',
        data: initFreq.data,
        backgroundColor: [
          '#f43f5e', '#fb7185', '#fda4af',
          '#fecdd3', '#e11d48', '#be123c'
        ],
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { weight: '700', size: 9 } } },
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

