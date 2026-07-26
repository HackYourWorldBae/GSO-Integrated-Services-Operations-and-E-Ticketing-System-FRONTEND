<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/admin/tasu" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        <span class="text">TASU Home</span>
      </router-link>
      <router-link to="/admin/tasu/vehicles" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
        <span class="text">Vehicle Management</span>
      </router-link>
      <router-link to="/admin/tasu/queues" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span class="text">Ticket Queues</span>
      </router-link>
      <router-link to="/admin/tasu/personnel" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span class="text">Personnel Management</span>
      </router-link>
      <router-link to="/admin/tasu/dispatch" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="text">Dispatch Board</span>
      </router-link>
      <div class="mt-8 mb-4 px-4">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Archived Tickets</p>
      </div>
      <router-link to="/admin/tasu/archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span class="text">Archives</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">TASU Dashboard</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Transportation & Automotive Control</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in pb-12">
        
        <!-- Key Metrics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-slate-900 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-full uppercase tracking-tighter">Total Requests</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.total || 0 }}</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">All Time Requests</p>
          </div>

          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-amber-50 text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full uppercase tracking-tighter">Pending TO</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.pending || 0 }}</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Travel Orders Awaiting VP</p>
          </div>

          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-blue-50 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-tighter">Active Trips</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.processing || 0 }}</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Trip Tickets Issued & Scheduled</p>
          </div>

          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-tighter">Completed Trips</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.resolved || 0 }}</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Resolved Vehicle Requests</p>
          </div>
        </div>

        <!-- Fleet Logistics Insights -->
        <div class="p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl relative overflow-hidden">
          <div class="absolute top-0 right-0 p-8 opacity-10">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="max-w-xl">
              <h3 class="text-2xl font-black tracking-tight mb-2">Fleet Logistics Briefing</h3>
              <p class="text-slate-300 text-sm font-medium leading-relaxed italic">"Official Business" travel accounts for 75% of trips this week. "Van SAC 1399" has reached the recommended mileage for maintenance. Currently, 3 booking requests are awaiting VP approval before Travel Orders can be issued.</p>
            </div>
            <div class="flex gap-3">
              <div class="px-6 py-4 rounded-2xl bg-emerald-500/20 backdrop-blur-md border border-emerald-500/20 flex flex-col items-center">
                <span class="text-emerald-400 font-black text-xl italic">75%</span>
                <span class="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">Utilization</span>
              </div>
              <div class="px-6 py-3 rounded-2xl bg-white text-slate-900 shadow-lg flex flex-col items-center justify-center">
                <span class="text-xs font-black uppercase tracking-widest leading-none mb-1">Alert</span>
                <span class="text-[8px] font-bold opacity-80 italic uppercase text-rose-600">Maintenance</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <!-- Booking Pipeline -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col h-[400px]">
            <h4 class="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 italic">
              <div class="w-2 h-6 bg-amber-500 rounded-full"></div>
              Booking Lifecycle Pipeline
            </h4>
            <div class="flex-1 relative">
              <canvas id="bookingPipelineChart"></canvas>
            </div>
          </div>

          <!-- Travel Purpose Distribution -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col min-h-[350px] lg:h-[400px]">
            <h4 class="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 italic">
              <div class="w-2 h-6 bg-emerald-500 rounded-full"></div>
              Authorized Travel Intent
            </h4>
            <div class="flex-1 relative">
              <canvas id="travelPurposeDoughnut"></canvas>
            </div>
          </div>

          <!-- Fleet Usage Heatmap -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col h-[350px]">
            <h4 class="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 italic">
              <div class="w-2 h-6 bg-blue-500 rounded-full"></div>
              Fleet Activity (Trip Frequency)
            </h4>
            <div class="flex-1 relative">
              <canvas id="fleetActivityChart"></canvas>
            </div>
          </div>

          <!-- Fuel Consumption Trends -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col h-[350px]">
            <h4 class="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 italic">
              <div class="w-2 h-6 bg-slate-900 rounded-full"></div>
              Fuel Performance (Liters Used)
            </h4>
            <div class="flex-1 relative">
              <canvas id="fuelTrendChart"></canvas>
            </div>
          </div>

          <!-- Service Request Frequency -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col lg:col-span-2">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-8">
              <h4 class="text-lg font-black text-slate-900 flex items-center gap-2 italic">
                <div class="w-2 h-6 bg-blue-500 rounded-full"></div>
                Service Request Frequency
              </h4>
              <div class="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                <button
                  v-for="filter in tasuPeriodFilters"
                  :key="filter.key"
                  @click="setTasuPeriod(filter.key)"
                  :class="[
                    'px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all',
                    tasuActivePeriod === filter.key
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  ]"
                >
                  {{ filter.label }}
                </button>
              </div>
            </div>
            <div class="relative h-64">
              <canvas id="tasuServiceFreqChart"></canvas>
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

const tasuActivePeriod = ref('Month');
const tasuPeriodFilters = [
  { key: 'Day',   label: 'This Day' },
  { key: 'Week',  label: 'This Week' },
  { key: 'Month', label: 'This Month' },
  { key: 'Year',  label: 'This Year' }
];

let tasuServiceFreqChart = null;
let charts = [];

function setTasuPeriod(period) {
  tasuActivePeriod.value = period;
  if (tasuServiceFreqChart && stats.value.service_freq) {
    const data = stats.value.service_freq[period] || [];
    tasuServiceFreqChart.data.labels = data.map(d => d.service_type);
    tasuServiceFreqChart.data.datasets[0].data = data.map(d => parseInt(d.count));
    tasuServiceFreqChart.update();
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
  const freqCtx = document.getElementById('fgmuServiceFreqChart') || 
                  document.getElementById('leauServiceFreqChart') || 
                  document.getElementById('ssuServiceFreqChart') || 
                  document.getElementById('tasuServiceFreqChart');
  if (freqCtx && stats.value.service_freq) {
    const initData = stats.value.service_freq[tasuActivePeriod.value] || [];
    tasuServiceFreqChart = new Chart(freqCtx, {
      type: 'bar',
      data: {
        labels: initData.map(d => d.service_type),
        datasets: [{
          label: 'Requests',
          data: initData.map(d => parseInt(d.count)),
          backgroundColor: ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
          borderRadius: 8
        }]
      },
      options: { plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false }
    });
    charts.push(tasuServiceFreqChart);
  }
};

const fetchStats = async () => {
  try {
    const response = await api.get('tickets/stats/TASU');
    if (response.data?.data?.stats) {
      stats.value = response.data.data.stats;
      nextTick(() => {
        renderCharts();
      });
    }
  } catch (error) {
    console.error('Failed to fetch TASU stats:', error);
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

