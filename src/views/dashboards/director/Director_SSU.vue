<template>
  <MainLayout>
    <template #sidebar-links>
      <DirectorSidebar />
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">SSU Analytics</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Security Services Unit Oversight</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in pb-12">
        
        <!-- Key Metrics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-blue-50 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-tighter">Processing</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.processing || 0 }}</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">In Progress</p>
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
          
          <!-- Incident Distribution -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col min-h-[350px] lg:h-[400px]">
            <h4 class="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 italic">
              <div class="w-2 h-6 bg-rose-500 rounded-full"></div>
              Incident Heatmap (By Category)
            </h4>
            <div class="flex-1 relative">
              <canvas id="directorSsuIncidentDoughnut"></canvas>
            </div>
          </div>

          <!-- Vehicle Pass Pipeline -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col h-[400px]">
            <h4 class="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 italic">
              <div class="w-2 h-6 bg-slate-900 rounded-full"></div>
              Vehicle Pass Issuance Pipeline
            </h4>
            <div class="flex-1 relative">
              <canvas id="directorSsuPassPipelineChart"></canvas>
            </div>
          </div>

        </div>

      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { onMounted, onUnmounted, ref, nextTick } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import DirectorSidebar from './DirectorSidebar.vue';
import Chart from 'chart.js/auto';
import api from '@/api/client';

const stats = ref({});
let charts = [];

const renderCharts = () => {
  charts.forEach(c => c.destroy());
  charts = [];

  // 1. Incident Heatmap Doughnut
  const incidentCtx = document.getElementById('directorSsuIncidentDoughnut');
  if (incidentCtx && stats.value.incident_heatmap) {
    const data = stats.value.incident_heatmap;
    charts.push(new Chart(incidentCtx, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.category),
        datasets: [{
          data: data.map(d => parseInt(d.count)),
          backgroundColor: ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'],
          hoverOffset: 15, borderRadius: 10, borderWidth: 4, borderColor: '#ffffff'
        }]
      },
      options: {
        plugins: { legend: { position: 'bottom' } },
        cutout: '65%', responsive: true, maintainAspectRatio: false
      }
    }));
  }

  // 2. Vehicle Pass Pipeline
  const passCtx = document.getElementById('directorSsuPassPipelineChart');
  if (passCtx && stats.value.pass_pipeline) {
    const data = stats.value.pass_pipeline;
    const statuses = ['pending', 'approved', 'resolved', 'cancelled'];
    const formatStatus = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    
    const counts = statuses.map(s => {
      const match = data.find(d => d.status === s);
      return match ? parseInt(match.count) : 0;
    });

    charts.push(new Chart(passCtx, {
      type: 'bar',
      data: {
        labels: statuses.map(formatStatus),
        datasets: [{
          label: 'Tickets',
          data: counts,
          backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'],
          borderRadius: 6
        }]
      },
      options: { 
        indexAxis: 'y', 
        plugins: { legend: { display: false } }, 
        responsive: true, maintainAspectRatio: false 
      }
    }));
  }
};

const fetchStats = async () => {
  try {
    const response = await api.get('tickets/stats/SSU');
    if (response.data?.data?.stats) {
      stats.value = response.data.data.stats;
      await nextTick();
      renderCharts();
    }
  } catch (error) {
    console.error('Failed to fetch SSU stats:', error);
  }
};

onMounted(() => {
  fetchStats();
});

onUnmounted(() => {
  charts.forEach(c => c.destroy());
  charts = [];
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
