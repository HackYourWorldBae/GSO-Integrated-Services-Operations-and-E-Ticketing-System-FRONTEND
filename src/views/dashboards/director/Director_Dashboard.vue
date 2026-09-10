<template>
  <MainLayout>
    <template #sidebar-links>
      <DirectorSidebar />
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">Director Dashboard</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Executive Unit Oversight & Reports</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in pb-12">
        
        <!-- Welcome Executive Banner -->
        <div class="p-8 rounded-[2.5rem] bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div class="relative z-10 space-y-2 max-w-2xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-extrabold uppercase tracking-widest">
              Executive Command Center
            </div>
            <h3 class="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Sub-Unit Operational Portals
            </h3>
            <p class="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              Select an individual sub-unit below to inspect detailed analytics, performance evaluation ratings, workflow status, and issue root-cause reports.
            </p>
          </div>
        </div>

        <!-- Sub-Unit Individual Portals Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- FGMU Portal Card -->
          <div class="group p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden border-b-4 border-b-blue-500">
            <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>

            <div>
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3.5">
                  <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs border border-blue-100">
                    <!-- Tools / Facilities Maintenance Icon (FGMU) -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-lg font-black text-slate-900 leading-tight">Facilities Management</h4>
                    <p class="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest">FGMU Unit</p>
                  </div>
                </div>
                <span class="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-lg uppercase tracking-wider">
                  Infrastructure
                </span>
              </div>

              <p class="text-xs text-slate-500 font-medium mb-6 leading-relaxed">
                Manages campus electrical, carpentry, plumbing, air conditioning, welding, sound system, and scheduled building development.
              </p>

              <!-- Quick Mini Metrics -->
              <div class="grid grid-cols-4 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                <div class="text-center">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Pending</span>
                  <span class="text-base font-black text-amber-600 tabular-nums">{{ unitStats.fgmu.pending || 0 }}</span>
                </div>
                <div class="text-center border-l border-slate-200/60">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Active</span>
                  <span class="text-base font-black text-blue-600 tabular-nums">{{ unitStats.fgmu.active_working || 0 }}</span>
                </div>
                <div class="text-center border-l border-slate-200/60">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Completed</span>
                  <span class="text-base font-black text-emerald-600 tabular-nums">{{ unitStats.fgmu.resolved || 0 }}</span>
                </div>
                <div class="text-center border-l border-slate-200/60">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Declined</span>
                  <span class="text-base font-black text-rose-600 tabular-nums">{{ unitStats.fgmu.declined || 0 }}</span>
                </div>
              </div>
            </div>

            <!-- FGMU Dual Actions -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <router-link 
                to="/admin/fgmu/queues" 
                class="py-3 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20 hover:shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Ticket Queues</span>
              </router-link>
              <router-link 
                to="/director/fgmu" 
                class="py-3 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Analytics</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </router-link>
            </div>
          </div>

          <!-- LEAU Portal Card -->
          <div class="group p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden border-b-4 border-b-emerald-500">
            <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>

            <div>
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3.5">
                  <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs border border-emerald-100">
                    <!-- Leaf / Environment & Landscaping Icon (LEAU) -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-lg font-black text-slate-900 leading-tight">Landscaping & Environment</h4>
                    <p class="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest">LEAU Unit</p>
                  </div>
                </div>
                <span class="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg uppercase tracking-wider">
                  Ecology
                </span>
              </div>

              <p class="text-xs text-slate-500 font-medium mb-6 leading-relaxed">
                Oversees university grounds maintenance, campus landscaping, tree pruning, grass cutting, and environmental beautification.
              </p>

              <!-- Quick Mini Metrics -->
              <div class="grid grid-cols-4 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                <div class="text-center">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Pending</span>
                  <span class="text-base font-black text-amber-600 tabular-nums">{{ unitStats.leau.pending || 0 }}</span>
                </div>
                <div class="text-center border-l border-slate-200/60">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Active</span>
                  <span class="text-base font-black text-emerald-600 tabular-nums">{{ unitStats.leau.active_working || 0 }}</span>
                </div>
                <div class="text-center border-l border-slate-200/60">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Completed</span>
                  <span class="text-base font-black text-emerald-700 tabular-nums">{{ unitStats.leau.resolved || 0 }}</span>
                </div>
                <div class="text-center border-l border-slate-200/60">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Declined</span>
                  <span class="text-base font-black text-rose-600 tabular-nums">{{ unitStats.leau.declined || 0 }}</span>
                </div>
              </div>
            </div>

            <!-- LEAU Dual Actions -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <router-link 
                to="/admin/leau/queues" 
                class="py-3 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 hover:shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Ticket Queues</span>
              </router-link>
              <router-link 
                to="/director/leau" 
                class="py-3 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Analytics</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </router-link>
            </div>
          </div>

          <!-- SSU Portal Card -->
          <div class="group p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden border-b-4 border-b-rose-500">
            <div class="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>

            <div>
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3.5">
                  <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-xs border border-rose-100">
                    <!-- Shield / Security Services Icon (SSU) -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-lg font-black text-slate-900 leading-tight">Security Services</h4>
                    <p class="text-[10px] font-extrabold text-rose-600 uppercase tracking-widest">SSU Unit</p>
                  </div>
                </div>
                <span class="px-2.5 py-1 bg-rose-50 text-rose-700 text-[10px] font-black rounded-lg uppercase tracking-wider">
                  Campus Safety
                </span>
              </div>

              <p class="text-xs text-slate-500 font-medium mb-6 leading-relaxed">
                Handles security incident reporting, campus investigations, witness verification, and campus safety coordination.
              </p>

              <!-- Quick Mini Metrics -->
              <div class="grid grid-cols-4 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                <div class="text-center">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Pending</span>
                  <span class="text-base font-black text-amber-600 tabular-nums">{{ unitStats.ssu.pending || 0 }}</span>
                </div>
                <div class="text-center border-l border-slate-200/60">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Processing</span>
                  <span class="text-base font-black text-blue-600 tabular-nums">{{ unitStats.ssu.processing || 0 }}</span>
                </div>
                <div class="text-center border-l border-slate-200/60">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Completed</span>
                  <span class="text-base font-black text-emerald-600 tabular-nums">{{ unitStats.ssu.resolved || 0 }}</span>
                </div>
                <div class="text-center border-l border-slate-200/60">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Declined</span>
                  <span class="text-base font-black text-rose-600 tabular-nums">{{ unitStats.ssu.declined || 0 }}</span>
                </div>
              </div>
            </div>

            <!-- SSU Dual Actions -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <router-link 
                to="/admin/ssu/queues/incidents" 
                class="py-3 px-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-600/20 hover:shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Incident Queues</span>
              </router-link>
              <router-link 
                to="/director/ssu" 
                class="py-3 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Analytics</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </router-link>
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
import DirectorSidebar from './DirectorSidebar.vue';
import api from '@/api/client';

const unitStats = ref({
  fgmu: {},
  leau: {},
  ssu: {}
});

const fetchStats = async () => {
  try {
    const [fgmuRes, leauRes, ssuRes] = await Promise.allSettled([
      api.get('tickets/stats/FGMU'),
      api.get('tickets/stats/LEAU'),
      api.get('tickets/stats/SSU')
    ]);
    
    if (fgmuRes.status === 'fulfilled' && fgmuRes.value.data?.data?.stats) {
      unitStats.value.fgmu = fgmuRes.value.data.data.stats;
    }
    if (leauRes.status === 'fulfilled' && leauRes.value.data?.data?.stats) {
      unitStats.value.leau = leauRes.value.data.data.stats;
    }
    if (ssuRes.status === 'fulfilled' && ssuRes.value.data?.data?.stats) {
      unitStats.value.ssu = ssuRes.value.data.data.stats;
    }
  } catch (error) {
    console.error('Failed to fetch director unit stats:', error);
  }
};

onMounted(() => {
  fetchStats();
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
