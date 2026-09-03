<template>
  <MainLayout>
    <template #sidebar-links>
      <DirectorSidebar />
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">Organizational Chart</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">GSO Command Structure</p>
      </div>
    </template>

    <template #main-content>
      <div class="min-h-[800px] w-full p-4 overflow-x-auto institutional-custom-scrollbar animate-fade-in">
        
        <!-- Organizational Chart Root -->
        <div class="flex flex-col items-center min-w-[1200px] mt-10">
          
          <!-- LEVEL 1: DIRECTOR -->
          <div class="relative flex flex-col items-center">
            <div class="p-8 rounded-[2.5rem] bg-white border-2 border-slate-100 shadow-2xl flex flex-col items-center gap-4 group hover:-translate-y-2 transition-all duration-500 z-10 relative">
              <div class="w-24 h-24 rounded-[1.8rem] bg-emerald-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition-transform">
                JD
              </div>
              <div class="text-center">
                <h3 class="text-xl font-black text-slate-900 tracking-tight">Dr. Juan Dela Cruz</h3>
                <p class="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">GSO Director</p>
              </div>
            </div>
            
            <!-- Descent to bridge -->
            <div class="w-[2px] h-12 bg-emerald-500/30 z-0"></div>
          </div>

          <!-- LEVEL 2 & 3: UNIT HEADS AND STAFF -->
          <div class="flex flex-row w-full justify-between items-start">
            
            <div v-for="(unit, index) in units" :key="unit.code" class="relative flex-1 flex flex-col items-center px-4">
              
              <!-- Bridge partials for top connection -->
              <div v-if="index !== 0" class="absolute top-0 left-0 w-1/2 h-[2px] bg-emerald-500/30"></div>
              <div v-if="index !== units.length - 1" class="absolute top-0 right-0 w-1/2 h-[2px] bg-emerald-500/30"></div>

              <!-- Vertical descent from bridge -->
              <div class="w-[2px] h-10 bg-emerald-500/30 flex-none"></div>

              <!-- UNIT BOX -->
              <div class="w-full p-6 rounded-[2rem] bg-slate-900 shadow-xl border-b-4 relative z-10" :class="unit.borderColor">
                <div class="flex items-center justify-between mb-4">
                  <span class="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/10 text-white rounded-full leading-none">{{ unit.code }}</span>
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ unit.name }}</p>
                </div>

                <!-- Unit Head Profile -->
                <div class="bg-white/5 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 border border-white/10 group hover:bg-white/10 transition-all cursor-default relative z-10">
                  <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xs font-black text-white">
                    UH
                  </div>
                  <div>
                    <p class="text-xs font-black text-white">{{ unit.head }}</p>
                    <p class="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Unit Head</p>
                  </div>
                </div>
              </div>
              
              <!-- Descent to Staff Bridge -->
              <div class="w-[2px] h-12 bg-emerald-500/20 flex-none"></div>

              <!-- LEVEL 4: STAFF (2 PER UNIT as example) -->
              <div class="flex flex-row w-full justify-between px-2">
                <div v-for="i in 2" :key="i" class="relative flex-1 flex flex-col items-center px-2">
                  
                  <!-- Bridge partials for Staff connection -->
                  <div v-if="i !== 1" class="absolute top-0 left-0 w-1/2 h-[2px] bg-emerald-500/20"></div>
                  <div v-if="i !== 2" class="absolute top-0 right-0 w-1/2 h-[2px] bg-emerald-500/20"></div>

                  <!-- Descent -->
                  <div class="w-[2px] h-8 bg-emerald-500/20 flex-none"></div>
                  
                  <div class="w-full p-4 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col items-center gap-2 group hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative z-10">
                    <div class="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-300 group-hover:text-emerald-400 group-hover:bg-emerald-50 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <div class="text-center">
                      <p class="text-[10px] font-black text-slate-700 leading-none">Line Staff</p>
                      <p class="text-[8px] text-slate-400 font-bold uppercase mt-1">Operations</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import DirectorSidebar from './DirectorSidebar.vue';

const units = [
  { 
    code: 'FGMU', 
    name: 'Facilities Management', 
    head: 'Engr. A. Ramos', 
    borderColor: 'border-b-blue-500' 
  },
  { 
    code: 'SSU', 
    name: 'Security Services', 
    head: 'Major L. Cruz', 
    borderColor: 'border-b-rose-500' 
  },
  { 
    code: 'LEAU', 
    name: 'Landscaping & Environment', 
    head: 'Dr. M. Bautista', 
    borderColor: 'border-b-emerald-500' 
  }
];
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
  height: 8px;
  width: 8px;
}

.institutional-custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.institutional-custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

.institutional-custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
