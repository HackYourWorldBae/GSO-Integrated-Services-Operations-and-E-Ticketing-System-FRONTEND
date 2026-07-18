<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/user/dashboard" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <span class="text">Dashboard</span>
      </router-link>
      <router-link to="/user/tickets" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
        <span class="text">My Tickets</span>
      </router-link>
      <div class="mt-8 mb-4 px-4">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Archived Tickets</p>
      </div>
      <router-link to="/user/completed-tickets" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span class="text">Completed Tickets</span>
      </router-link>
      
      <div class="my-4 border-t border-white/5 mx-2"></div>
      
      <router-link to="/user/edit-profile" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span class="text">Account Settings</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">Requestor Dashboard</h2>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in">
        
        <!-- Simplified Welcome Banner -->
        <div class="relative overflow-hidden rounded-[2.5rem] bg-emerald-600 border border-emerald-500/10 p-10 md:p-14 shadow-2xl group flex justify-center items-center h-48">
          <div class="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-white/10 rounded-full blur-[100px]"></div>
          <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-black/5 rounded-full blur-[80px]"></div>
          
          <button @click="$router.push('/services')" class="group relative px-12 py-5 bg-white hover:bg-slate-50 text-emerald-600 font-black rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1.5 active:translate-y-0 overflow-hidden shrink-0 z-10 scale-110">
            <span class="relative z-10 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
              </svg>
              New Service Request
            </span>
          </button>
        </div>

        <!-- Metric Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Open Tickets -->
          <div class="group p-8 rounded-[2rem] bg-white border border-slate-200 hover:border-emerald-500 transition-all shadow-sm">
            <div class="flex items-center justify-between mb-8">
              <div class="p-4 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <span class="text-[10px] font-black text-emerald-500/40 uppercase tracking-widest">Ongoing</span>
            </div>
            <div class="space-y-1">
              <h3 class="text-4xl font-black text-slate-900 tabular-nums">03</h3>
              <p class="text-sm text-slate-500 font-bold uppercase tracking-wider">Open Tickets</p>
            </div>
          </div>

          <!-- Pending Approval -->
          <div class="group p-8 rounded-[2rem] bg-white border border-slate-200 hover:border-amber-500 transition-all shadow-sm">
            <div class="flex items-center justify-between mb-8">
              <div class="p-4 rounded-2xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span class="text-[10px] font-black text-amber-500/40 uppercase tracking-widest">Reviewing</span>
            </div>
            <div class="space-y-1">
              <h3 class="text-4xl font-black text-slate-900 tabular-nums">01</h3>
              <p class="text-sm text-slate-500 font-bold uppercase tracking-wider">Pending Tickets</p>
            </div>
          </div>

          <!-- Resolved -->
          <div class="group p-8 rounded-[2rem] bg-white border border-slate-200 hover:border-emerald-400 transition-all shadow-sm">
            <div class="flex items-center justify-between mb-8">
              <div class="p-4 rounded-2xl bg-emerald-50 text-emerald-500 group-hover:scale-110 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span class="text-[10px] font-black text-emerald-400/40 uppercase tracking-widest">Finished</span>
            </div>
            <div class="space-y-1">
              <h3 class="text-4xl font-black text-slate-900 tabular-nums">12</h3>
              <p class="text-sm text-slate-500 font-bold uppercase tracking-wider">Resolved Tickets</p>
            </div>
          </div>

          <!-- Total Requests -->
          <div class="group p-8 rounded-[2rem] bg-white border border-slate-200 hover:border-emerald-600 transition-all shadow-sm">
            <div class="flex items-center justify-between mb-8">
              <div class="p-4 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span class="text-[10px] font-black text-emerald-600/40 uppercase tracking-widest">History</span>
            </div>
            <div class="space-y-1">
              <h3 class="text-4xl font-black text-slate-900 tabular-nums">16</h3>
              <p class="text-sm text-slate-500 font-bold uppercase tracking-wider">Total Requests</p>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="rounded-[2.5rem] bg-white border border-slate-200 p-10 shadow-sm">
          <div class="flex items-center justify-between mb-10">
            <h3 class="text-2xl font-black text-slate-900 tracking-tight">Ticket Status Updates</h3>
          </div>
          
          <div class="space-y-5">
            <div v-for="update in recentUpdates" :key="update.ticketId" @click="navigateToTicket(update.ticketId)" class="flex items-center gap-6 p-5 rounded-[1.5rem] bg-slate-50 border border-transparent hover:border-emerald-500/10 transition-all cursor-pointer group">
              <div class="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:text-emerald-500 shrink-0 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="flex-1 overflow-hidden">
                <p class="text-base font-bold text-slate-900 truncate group-hover:text-emerald-600 transition-colors">Ticket <span class="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-lg border border-emerald-200">{{ update.ticketId }}</span> Status Change</p>
                <p class="text-sm text-slate-500 font-medium tracking-wide">Request for "{{ update.service }}" is now: {{ update.description }}</p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-xs text-slate-400 font-bold uppercase mb-2">{{ update.time }}</p>
                <div class="flex justify-end">
                   <span class="inline-block w-2.5 h-2.5 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.5)]" :class="update.status === 'resolved' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-amber-500'"></span>
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
import { useRouter } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';

const userName = ref('');
const router = useRouter();

const recentUpdates = ref([
  {
    ticketId: 'FGMU-TIC-42-2026',
    service: 'Equipment Maintenance',
    description: 'Status updated to Pending Approval.',
    time: '2h ago',
    status: 'pending'
  },
  {
    ticketId: 'LEAU-TIC-18-2026',
    service: 'Janitorial Service',
    description: 'Status updated to Job Started. Workers assigned.',
    time: '5h ago',
    status: 'processing'
  },
  {
    ticketId: 'FGMU-TIC-43-2026',
    service: 'Plumbing Repair',
    description: 'Ticket marked as Job Finished by GSO staff.',
    time: '1d ago',
    status: 'resolved'
  }
]);

const navigateToTicket = (ticketId) => {
  router.push({ path: '/user/tickets', query: { highlight: ticketId } });
};

onMounted(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    userName.value = user.first_name || user.name || 'User';
  }

  const ackMap = JSON.parse(localStorage.getItem('gso_ssu_acknowledged_incidents') || '{}');
  Object.values(ackMap).forEach(ack => {
    recentUpdates.value.unshift({
      ticketId: ack.ticketId,
      service: 'Incident Report',
      description: `SSU Action & Recommendations: "${ack.actionsTaken}"`,
      time: 'Just now',
      status: 'processing'
    });
  });
});
</script>

<style scoped>
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
</style>
