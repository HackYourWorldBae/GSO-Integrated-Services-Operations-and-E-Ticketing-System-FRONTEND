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

          <div class="relative z-10 flex flex-wrap gap-3">
            <router-link 
              to="/director/organizational-chart" 
              class="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 flex items-center gap-2 backdrop-blur-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Org Chart</span>
            </router-link>
          </div>
        </div>

        <!-- Sub-Unit Individual Portals Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- FGMU Portal Card -->
          <div class="group p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden border-b-4 border-b-blue-500">
            <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>

            <div>
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3.5">
                  <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl shadow-xs">
                    F
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
              <div class="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                <div class="text-center">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Pending</span>
                  <span class="text-base font-black text-amber-600 tabular-nums">{{ unitStats.fgmu.pending || 0 }}</span>
                </div>
                <div class="text-center border-x border-slate-200/60">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Active</span>
                  <span class="text-base font-black text-blue-600 tabular-nums">{{ unitStats.fgmu.active_working || 0 }}</span>
                </div>
                <div class="text-center">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Completed</span>
                  <span class="text-base font-black text-emerald-600 tabular-nums">{{ unitStats.fgmu.resolved || 0 }}</span>
                </div>
              </div>
            </div>

            <router-link 
              to="/director/fgmu" 
              class="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm group-hover:shadow-md"
            >
              <span>View FGMU Analytics</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </router-link>
          </div>

          <!-- LEAU Portal Card -->
          <div class="group p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden border-b-4 border-b-emerald-500">
            <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>

            <div>
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3.5">
                  <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xl shadow-xs">
                    L
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
              <div class="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                <div class="text-center">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Pending</span>
                  <span class="text-base font-black text-amber-600 tabular-nums">{{ unitStats.leau.pending || 0 }}</span>
                </div>
                <div class="text-center border-x border-slate-200/60">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Active</span>
                  <span class="text-base font-black text-emerald-600 tabular-nums">{{ unitStats.leau.active_working || 0 }}</span>
                </div>
                <div class="text-center">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Completed</span>
                  <span class="text-base font-black text-emerald-700 tabular-nums">{{ unitStats.leau.resolved || 0 }}</span>
                </div>
              </div>
            </div>

            <router-link 
              to="/director/leau" 
              class="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm group-hover:shadow-md"
            >
              <span>View LEAU Analytics</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </router-link>
          </div>

          <!-- SSU Portal Card -->
          <div class="group p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden border-b-4 border-b-rose-500">
            <div class="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>

            <div>
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3.5">
                  <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black text-xl shadow-xs">
                    S
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
                Handles security incident reporting, investigations, verification, and university vehicle gate pass / sticker issuance.
              </p>

              <!-- Quick Mini Metrics -->
              <div class="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                <div class="text-center">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Pending</span>
                  <span class="text-base font-black text-amber-600 tabular-nums">{{ unitStats.ssu.pending || 0 }}</span>
                </div>
                <div class="text-center border-x border-slate-200/60">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Processing</span>
                  <span class="text-base font-black text-blue-600 tabular-nums">{{ unitStats.ssu.processing || 0 }}</span>
                </div>
                <div class="text-center">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Completed</span>
                  <span class="text-base font-black text-emerald-600 tabular-nums">{{ unitStats.ssu.resolved || 0 }}</span>
                </div>
              </div>
            </div>

            <router-link 
              to="/director/ssu" 
              class="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-rose-600 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm group-hover:shadow-md"
            >
              <span>View SSU Analytics</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </router-link>
          </div>

          <!-- TASU Portal Card -->
          <div class="group p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden border-b-4 border-b-amber-500">
            <div class="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>

            <div>
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3.5">
                  <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xl shadow-xs">
                    T
                  </div>
                  <div>
                    <h4 class="text-lg font-black text-slate-900 leading-tight">Transportation & Automotive</h4>
                    <p class="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest">TASU Unit</p>
                  </div>
                </div>
                <span class="px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-black rounded-lg uppercase tracking-wider">
                  Fleet & Trips
                </span>
              </div>

              <p class="text-xs text-slate-500 font-medium mb-6 leading-relaxed">
                Manages university fleet vehicles, official trip travel orders (TO), driver assignments, and vehicle dispatch board.
              </p>

              <!-- Quick Mini Metrics -->
              <div class="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                <div class="text-center">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Pending</span>
                  <span class="text-base font-black text-amber-600 tabular-nums">{{ unitStats.tasu.pending || 0 }}</span>
                </div>
                <div class="text-center border-x border-slate-200/60">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Active Trips</span>
                  <span class="text-base font-black text-blue-600 tabular-nums">{{ unitStats.tasu.processing || 0 }}</span>
                </div>
                <div class="text-center">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Completed</span>
                  <span class="text-base font-black text-emerald-600 tabular-nums">{{ unitStats.tasu.resolved || 0 }}</span>
                </div>
              </div>
            </div>

            <router-link 
              to="/director/tasu" 
              class="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-amber-600 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm group-hover:shadow-md"
            >
              <span>View TASU Analytics</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </router-link>
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
  ssu: {},
  tasu: {}
});

const fetchStats = async () => {
  try {
    const [fgmuRes, leauRes, ssuRes, tasuRes] = await Promise.allSettled([
      api.get('tickets/stats/FGMU'),
      api.get('tickets/stats/LEAU'),
      api.get('tickets/stats/SSU'),
      api.get('tickets/stats/TASU')
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
    if (tasuRes.status === 'fulfilled' && tasuRes.value.data?.data?.stats) {
      unitStats.value.tasu = tasuRes.value.data.data.stats;
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
