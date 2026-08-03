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
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-slate-900 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-full uppercase tracking-tighter">Total Requests</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.total || 0 }}</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">All Time</p>
          </div>

          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-amber-50 text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full uppercase tracking-tighter">Pending</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.pending || 0 }}</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Awaiting Approval</p>
          </div>

          <!-- Dispatched & Scheduled -->
          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-blue-50 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-tighter">Dispatched</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.scheduled || 0 }}</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Scheduled Jobs</p>
          </div>

          <!-- Active Dispatches -->
          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full uppercase tracking-tighter">Active</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.active_working || 0 }}</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Work In Progress</p>
          </div>

          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-tighter">Completed</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.resolved || 0 }}</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Resolved Tickets</p>
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
import { onMounted, ref, nextTick } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import Chart from 'chart.js/auto';
import api from '@/api/client';

const stats = ref({});

const fgmuActivePeriod = ref('Month');
const fgmuPeriodFilters = [
  { key: 'Day',   label: 'Last 24 Hours' },
  { key: 'Week',  label: 'Last 7 Days' },
  { key: 'Month', label: 'Last 30 Days' },
  { key: 'Year',  label: 'Last 12 Months' }
];

let fgmuServiceFreqChart = null;
let charts = [];

function setFgmuPeriod(period) {
  fgmuActivePeriod.value = period;
  if (fgmuServiceFreqChart && stats.value.service_freq) {
    const data = stats.value.service_freq[period] || [];
    if (data.length === 0) {
      fgmuServiceFreqChart.data.labels = ['No requests yet'];
      fgmuServiceFreqChart.data.datasets[0].data = [0];
    } else {
      fgmuServiceFreqChart.data.labels = data.map(d => d.service_type);
      fgmuServiceFreqChart.data.datasets[0].data = data.map(d => parseInt(d.count));
    }
    fgmuServiceFreqChart.update();
  }
}

const renderCharts = () => {
  // Destroy existing charts to prevent memory leaks if re-rendered
  charts.forEach(c => c.destroy());
  charts = [];

  const safeVal = (val) => parseFloat(val) || 0;

  // 1. Performance Radar Chart
  const radarCtx = document.getElementById('performanceRadar');
  if (radarCtx && stats.value.feedback_averages) {
    const avg = stats.value.feedback_averages;
    charts.push(new Chart(radarCtx, {
      type: 'radar',
      data: {
        labels: ['Quality', 'Efficiency', 'Timeliness'],
        datasets: [{
          label: 'Current Avg (1-5)',
          data: [safeVal(avg.avg_quality), safeVal(avg.avg_efficiency), safeVal(avg.avg_timeliness)],
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
        scales: { r: { min: 0, max: 5, ticks: { stepSize: 1, display: false } } },
        plugins: { legend: { position: 'bottom' } },
        responsive: true, maintainAspectRatio: false
      }
    }));
  }

  // 2. Completion Health Doughnut
  const completionCtx = document.getElementById('completionDoughnut');
  if (completionCtx && stats.value.completion_health) {
    const health = stats.value.completion_health;
    const onTime = health.find(h => h.completion_status === 'on-time')?.count || 0;
    const beyondTime = health.find(h => h.completion_status === 'beyond-time')?.count || 0;
    const notCompleted = health.find(h => h.completion_status === 'not-completed')?.count || 0;
    
    charts.push(new Chart(completionCtx, {
      type: 'doughnut',
      data: {
        labels: ['On-time', 'Beyond Time', 'Not Completed'],
        datasets: [{
          data: [onTime, beyondTime, notCompleted],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          hoverOffset: 15, borderRadius: 10, borderWidth: 4, borderColor: '#ffffff'
        }]
      },
      options: {
        plugins: { legend: { position: 'bottom' } },
        cutout: '70%', responsive: true, maintainAspectRatio: false
      }
    }));
  }

  // 3. Delay Reasons
  const delayCtx = document.getElementById('delayReasonsChart');
  if (delayCtx && stats.value.delay_reasons) {
    charts.push(new Chart(delayCtx, {
      type: 'bar',
      data: {
        labels: stats.value.delay_reasons.map(r => r.reason_code) || ['None'],
        datasets: [{
          label: 'Occurrences',
          data: stats.value.delay_reasons.map(r => parseInt(r.count)) || [0],
          backgroundColor: '#f59e0b', borderRadius: 6
        }]
      },
      options: { indexAxis: 'y', plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false }
    }));
  }

  // 4. Non-Completion
  const nonCompCtx = document.getElementById('nonCompletionChart');
  if (nonCompCtx && stats.value.non_completion) {
    charts.push(new Chart(nonCompCtx, {
      type: 'bar',
      data: {
        labels: stats.value.non_completion.map(r => r.reason_code) || ['None'],
        datasets: [{
          label: 'Occurrences',
          data: stats.value.non_completion.map(r => parseInt(r.count)) || [0],
          backgroundColor: '#ef4444', borderRadius: 6
        }]
      },
      options: { indexAxis: 'y', plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false }
    }));
  }

  // 5. Service Request Frequency
  const freqCtx = document.getElementById('fgmuServiceFreqChart');
  if (freqCtx && stats.value.service_freq) {
    const initData = stats.value.service_freq[fgmuActivePeriod.value] || [];
    
    let labels = ['No requests yet'];
    let dataCounts = [0];
    
    if (initData.length > 0) {
      labels = initData.map(d => d.service_type);
      dataCounts = initData.map(d => parseInt(d.count));
    }

    fgmuServiceFreqChart = new Chart(freqCtx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Requests',
          data: dataCounts,
          backgroundColor: ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
          borderRadius: 8
        }]
      },
      options: { 
        plugins: { legend: { display: false } }, 
        responsive: true, 
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
    });
    charts.push(fgmuServiceFreqChart);
  }
};

const fetchStats = async () => {
  try {
    const response = await api.get('tickets/stats/FGMU');
    if (response.data?.data?.stats) {
      stats.value = response.data.data.stats;
      nextTick(() => {
        renderCharts();
      });
    }
  } catch (error) {
    console.error('Failed to fetch FGMU stats:', error);
  }
};

onMounted(() => {
  fetchStats();
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

