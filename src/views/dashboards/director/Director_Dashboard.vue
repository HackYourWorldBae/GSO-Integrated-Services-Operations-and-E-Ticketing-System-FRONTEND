<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/director/dashboard" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span class="text">Executive Summary</span>
      </router-link>
      <router-link to="/director/organizational-chart" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span class="text">Organizational Chart</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">Director Dashboard</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Superadmin Executive Oversight</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-10 animate-fade-in pb-12">
        
        <!-- Institutional KPI Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl border-b-4 border-b-emerald-500">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Requests</p>
            <div class="flex items-end justify-between">
              <h3 class="text-4xl font-black text-slate-900 tabular-nums leading-none">
                {{ ((stats.pending || 0) + (stats.approved || 0) + (stats.processing || 0)) || 0 }}
              </h3>
            </div>
            <div class="mt-4 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full bg-emerald-500 rounded-full" style="width: 100%"></div>
            </div>
          </div>

          <div class="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl border-b-4 border-b-blue-500">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Completed Actions</p>
            <div class="flex items-end justify-between">
              <h3 class="text-4xl font-black text-slate-900 tabular-nums leading-none">{{ stats.resolved || 0 }}</h3>
              <span class="text-[10px] text-blue-500 font-bold uppercase italic tracking-tighter">Optimal</span>
            </div>
            <p class="mt-4 text-[11px] text-slate-500 font-medium italic">Across all units</p>
          </div>

        </div>



        <!-- Institutional Oversight Analytics -->
        <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          <!-- Radar Institutional Comparison -->
          <div class="xl:col-span-12 p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl flex flex-col md:flex-row gap-12 items-center">
            <div class="flex-1 w-full h-[500px] relative">
              <h4 class="text-xl font-black text-slate-900 mb-2 italic">Institutional Service Health Radar</h4>
              <p class="text-xs text-slate-400 font-bold mb-8 uppercase tracking-widest">Comparative multi-unit performance monitoring</p>
              <div class="h-[400px]">
                <canvas id="institutionalHealthRadar"></canvas>
              </div>
            </div>
            <div class="w-full md:w-72 space-y-6">
               <div class="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                  <h5 class="text-[10px] font-black text-emerald-600 uppercase mb-3">Institutional Star</h5>
                  <p class="text-lg font-black text-slate-900 leading-tight">FGMU (Facilities)</p>
                  <p class="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tight">Highest delivery score</p>
               </div>
               <div class="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                  <h5 class="text-[10px] font-black text-amber-600 uppercase mb-3">Needs Attention</h5>
                  <p class="text-lg font-black text-slate-900 leading-tight">LEAU (Landscaping)</p>
                  <p class="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tight">Material replenishment delay</p>
               </div>
            </div>
          </div>

          <!-- Unit Specific Analytics (Expanded and Detailed) -->
          <div class="xl:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <!-- FGMU Detailed Analytics -->
            <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl flex flex-col group hover:-translate-y-1 transition-transform relative overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
              <div class="flex items-center justify-between mb-8 relative z-10">
                <div class="flex items-center gap-4">
                   <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl">F</div>
                   <div>
                     <h3 class="text-xl font-black text-slate-900 leading-tight">Facilities Management</h3>
                     <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest">FGMU Operations</span>
                   </div>
                </div>
                <div class="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black italic shadow-sm">+92% Health</div>
              </div>
              
              <div class="grid grid-cols-2 gap-4 mb-8 relative z-10">
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Job Orders</p>
                   <p class="text-2xl font-black text-slate-900">45</p>
                </div>
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Response</p>
                   <p class="text-2xl font-black text-slate-900">1.2<span class="text-xs text-slate-500 ml-1">hrs</span></p>
                </div>
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Preventive Maint.</p>
                   <p class="text-2xl font-black text-blue-600">88%</p>
                </div>
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Critical Issues</p>
                   <p class="text-2xl font-black text-rose-500 animate-pulse">2</p>
                </div>
              </div>

              <div class="h-[150px] relative mt-auto">
                <canvas id="fgmuSummaryChart"></canvas>
              </div>
            </div>

            <!-- LEAU Detailed Analytics -->
            <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl flex flex-col group hover:-translate-y-1 transition-transform relative overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
              <div class="flex items-center justify-between mb-8 relative z-10">
                <div class="flex items-center gap-4">
                   <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xl">L</div>
                   <div>
                     <h3 class="text-xl font-black text-slate-900 leading-tight">Landscaping & Environment</h3>
                     <span class="text-[10px] font-black text-emerald-600 uppercase tracking-widest">LEAU Operations</span>
                   </div>
                </div>
                <div class="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black italic shadow-sm">Attention</div>
              </div>
              
              <div class="grid grid-cols-2 gap-4 mb-8 relative z-10">
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Acreage Maintained</p>
                   <p class="text-2xl font-black text-slate-900">12.5<span class="text-xs text-slate-500 ml-1">ha</span></p>
                </div>
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Aesthetic Rating</p>
                   <p class="text-2xl font-black text-slate-900">4.8<span class="text-xs text-slate-500 ml-1">/5</span></p>
                </div>
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Equip. Readiness</p>
                   <p class="text-2xl font-black text-emerald-600">95%</p>
                </div>
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <p class="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Material Supply</p>
                   <p class="text-2xl font-black text-amber-500">Low</p>
                </div>
              </div>

              <div class="h-[150px] relative mt-auto">
                <canvas id="leauSummaryChart"></canvas>
              </div>
            </div>

            <!-- SSU Detailed Analytics -->
            <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl flex flex-col group hover:-translate-y-1 transition-transform relative overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
              <div class="flex items-center justify-between mb-8 relative z-10">
                <div class="flex items-center gap-4">
                   <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black text-xl">S</div>
                   <div>
                     <h3 class="text-xl font-black text-slate-900 leading-tight">Security Services</h3>
                     <span class="text-[10px] font-black text-rose-600 uppercase tracking-widest">SSU Operations</span>
                   </div>
                </div>
                <div class="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black italic shadow-sm">+12% Incidents</div>
              </div>
              
              <div class="grid grid-cols-2 gap-4 mb-8 relative z-10">
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Patrols</p>
                   <p class="text-2xl font-black text-slate-900">14</p>
                </div>
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Vehicle Passes</p>
                   <p class="text-2xl font-black text-slate-900">842</p>
                </div>
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Logged Incidents</p>
                   <p class="text-2xl font-black text-rose-600">8</p>
                </div>
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">CCTV Uptime</p>
                   <p class="text-2xl font-black text-emerald-500">99.8%</p>
                </div>
              </div>

              <div class="h-[150px] relative mt-auto">
                <canvas id="ssuSummaryChart"></canvas>
              </div>
            </div>

            <!-- TASU Detailed Analytics -->
            <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl flex flex-col group hover:-translate-y-1 transition-transform relative overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
              <div class="flex items-center justify-between mb-8 relative z-10">
                <div class="flex items-center gap-4">
                   <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xl">T</div>
                   <div>
                     <h3 class="text-xl font-black text-slate-900 leading-tight">Transportation & Assets</h3>
                     <span class="text-[10px] font-black text-amber-600 uppercase tracking-widest">TASU Operations</span>
                   </div>
                </div>
                <div class="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black italic shadow-sm">Optimal</div>
              </div>
              
              <div class="grid grid-cols-2 gap-4 mb-8 relative z-10">
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fleet Availability</p>
                   <p class="text-2xl font-black text-emerald-600">78%</p>
                </div>
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Trips</p>
                   <p class="text-2xl font-black text-slate-900">12</p>
                </div>
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fuel Efficiency</p>
                   <p class="text-2xl font-black text-slate-900">9.4<span class="text-xs text-slate-500 ml-1">km/l</span></p>
                </div>
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dispatched</p>
                   <p class="text-2xl font-black text-amber-600">8</p>
                </div>
              </div>

              <div class="h-[150px] relative mt-auto">
                <canvas id="tasuSummaryChart"></canvas>
              </div>
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
import api from '@/api/client';

const stats = ref({});

const fetchStats = async () => {
  try {
    const response = await api.get('tickets/stats/ALL');
    if (response.data?.data?.stats) {
      stats.value = response.data.data.stats;
    }
  } catch (error) {
    console.error('Failed to fetch global stats:', error);
  }
};

onMounted(() => {
  fetchStats();

  // Institutional Health Radar
  const radarCtx = document.getElementById('institutionalHealthRadar');
  new Chart(radarCtx, {
    type: 'radar',
    data: {
      labels: ['Service Quality', 'Efficiency', 'Timeliness', 'Resource Health', 'Operational Readiness'],
      datasets: [
        { label: 'FGMU', data: [95, 88, 92, 85, 98], borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderWidth: 3 },
        { label: 'LEAU', data: [85, 82, 90, 65, 88], borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderWidth: 3 },
        { label: 'SSU', data: [92, 95, 88, 98, 95], borderColor: '#f43f5e', backgroundColor: 'rgba(244, 63, 94, 0.1)', borderWidth: 3 },
        { label: 'TASU', data: [88, 90, 85, 92, 94], borderColor: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderWidth: 3 }
      ]
    },
    options: {
      scales: {
        r: {
          min: 0, max: 100, ticks: { display: false },
          pointLabels: { font: { family: 'Inter', weight: '900', size: 12 }, color: '#1e293b' }
        }
      },
      plugins: {
        legend: { position: 'right', labels: { font: { weight: '800' }, padding: 20 } }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });

  // Small Summary Charts (Executive Quadrants)
  ['fgmu', 'leau', 'ssu', 'tasu'].forEach(unit => {
    const ctx = document.getElementById(`${unit}SummaryChart`);
    const colorMap = { fgmu: '#3b82f6', leau: '#10b981', ssu: '#f43f5e', tasu: '#f59e0b' };
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['W1', 'W2', 'W3', 'W4'],
        datasets: [{
          data: [65, unit === 'leau' ? 45 : 78, 85, unit === 'fgmu' ? 92 : 88],
          borderColor: colorMap[unit],
          tension: 0.5,
          borderWidth: 4,
          pointRadius: 0,
          fill: false
        }]
      },
      options: {
        scales: { x: { display: false }, y: { display: false, min: 0, max: 100 } },
        plugins: { legend: { display: false } },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  });
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.institutional-custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.institutional-custom-scrollbar::-webkit-scrollbar-track {
  background: #f8fafc;
}

.institutional-custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
  border: 4px solid #f8fafc;
}

.institutional-custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>

