<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/worker/dashboard" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <span class="text">My Tasks</span>
      </router-link>
      <router-link to="/worker/history" class="nav-item active">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text">Work History</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">Work History</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Field Worker • View Your Past Assignments</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-10 animate-fade-in pb-20">
        
        <div class="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
           <div class="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 class="text-xl font-black text-slate-900">Completed Jobs</h3>
              <span class="px-4 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-widest">Archive</span>
           </div>
           
           <div class="divide-y divide-slate-50">
              <div v-for="job in completedJobs" :key="job.ticketId" class="p-8 hover:bg-slate-50/50 transition-colors">
                 <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div class="space-y-2">
                       <div class="flex items-center gap-3">
                          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 px-2 py-0.5 rounded bg-slate-50">{{ job.ticketId }}</span>
                          <span class="text-xs font-black text-emerald-600 uppercase tracking-widest">Completed: {{ job.completedDate }}</span>
                       </div>
                       <h4 class="text-xl font-black text-slate-900">{{ job.title }}</h4>
                       <p class="text-sm text-slate-500 font-medium">{{ job.location }}</p>
                    </div>
                    <div class="flex items-center gap-4">
                       <div class="text-right hidden md:block">
                          <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Feedback Score</p>
                          <div class="flex items-center gap-1 justify-end">
                             <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="i <= (job.rating || 0) ? 'text-amber-400' : 'text-slate-200'" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                          </div>
                       </div>
                       <button class="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-emerald-600 transition-all uppercase tracking-widest cursor-not-allowed opacity-50" title="Details view coming soon">View details</button>
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
import { ref, onMounted } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import api from '@/api/client';

const completedJobs = ref([]);
const isLoading = ref(true);

const fetchHistory = async () => {
  isLoading.value = true;
  try {
    const [fgmuRes, leauRes] = await Promise.all([
      api.get('/tickets/archives/FGMU'),
      api.get('/tickets/archives/LEAU')
    ]);
    
    const fgmu = fgmuRes.data?.data?.tickets || [];
    const leau = leauRes.data?.data?.tickets || [];
    
    const all = [...fgmu, ...leau];
    
    // Sort by updated_at descending
    all.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    
    completedJobs.value = all.map(t => {
       let rating = 0;
       if (t.feedback) {
         const ratings = [
           t.feedback.courtesy_rating, 
           t.feedback.quality_rating, 
           t.feedback.efficiency_rating, 
           t.feedback.timeliness_rating, 
           t.feedback.cleanliness_rating
         ].filter(r => r !== undefined && r !== null).map(Number);
         
         if (ratings.length > 0) {
           rating = Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length);
         }
       }

       return {
         ticketId: t.id,
         title: t.service_type || 'Maintenance Task',
         completedDate: t.completed_at ? new Date(t.completed_at).toLocaleDateString() : (t.updated_at ? new Date(t.updated_at).toLocaleDateString() : 'N/A'),
         location: t.location || 'Unknown Location',
         rating: rating
       };
    });
  } catch (error) {
    console.error('Failed to fetch worker history', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchHistory();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
