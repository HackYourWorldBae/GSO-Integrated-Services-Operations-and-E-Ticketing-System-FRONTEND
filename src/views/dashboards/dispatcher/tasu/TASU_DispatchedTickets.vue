<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/dispatcher/tasu" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
        <span class="text">Trip Requests</span>
      </router-link>
      <router-link to="/dispatcher/tasu/drivers" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span class="text">Assign Drivers</span>
      </router-link>
      <router-link to="/dispatcher/tasu/dispatched" class="nav-item active">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <span class="text">Dispatched Trips</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">TASU Dispatcher</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Scheduled & Active Trips</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in relative">
        
        <!-- Scheduled/Dispatched Trips -->
        <div class="rounded-[2.5rem] bg-white border border-slate-200 p-10 overflow-hidden shadow-sm">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-2xl font-black text-slate-900 tracking-tight text-amber-600">Scheduled / Waiting for Departure</h3>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left border-separate border-spacing-y-4 min-w-[750px]">
              <thead>
                <tr class="border-b border-slate-100">
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 font-bold">Ticket ID</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 font-bold">Departure Date</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 font-bold">Driver & Vehicle</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="scheduledTickets.length === 0">
                  <td colspan="4" class="py-8 text-center text-slate-400 text-sm font-medium">No scheduled trips.</td>
                </tr>
                <tr v-for="ticket in scheduledTickets" :key="ticket.id" class="group transition-all duration-200">
                  <td class="py-6 px-6 bg-slate-50/60 border-y border-l border-slate-200 rounded-l-2xl group-hover:bg-white group-hover:border-amber-500 transition-all">
                    <span class="text-sm font-black text-slate-900">#{{ ticket.id }}</span>
                  </td>
                  <td class="py-6 px-4 bg-slate-50/60 border-y border-slate-200 group-hover:bg-white group-hover:border-amber-500 transition-all">
                    <span class="text-sm font-bold text-slate-900">{{ ticket.assignment?.implementation_date || 'N/A' }}</span>
                  </td>
                  <td class="py-6 px-4 bg-slate-50/60 border-y border-slate-200 group-hover:bg-white group-hover:border-amber-500 transition-all">
                    <div class="flex flex-col">
                      <span class="text-sm font-bold text-slate-700">{{ ticket.assignment?.personnel_name || 'N/A' }}</span>
                      <span class="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{{ ticket.assignment?.vehicle_name || 'No Vehicle' }}</span>
                    </div>
                  </td>
                  <td class="py-6 px-6 bg-slate-50/60 border-y border-r border-slate-200 rounded-r-2xl group-hover:bg-white group-hover:border-amber-500 transition-all text-right">
                    <button @click="startJobEarly(ticket.id)" class="px-4 py-2 rounded-xl bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-amber-700 transition-colors inline-block shadow-sm" :disabled="loading">
                      Depart Early
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Active / Performing Trips -->
        <div class="rounded-[2.5rem] bg-white border border-slate-200 p-10 overflow-hidden shadow-sm">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-2xl font-black text-slate-900 tracking-tight text-emerald-600">On Route / Active Trips</h3>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left border-separate border-spacing-y-4 min-w-[750px]">
              <thead>
                <tr class="border-b border-slate-100">
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 font-bold">Ticket ID</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 font-bold">Departure Date</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 font-bold">Driver & Vehicle</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="activeTickets.length === 0">
                  <td colspan="4" class="py-8 text-center text-slate-400 text-sm font-medium">No trips currently on route.</td>
                </tr>
                <tr v-for="ticket in activeTickets" :key="ticket.id" class="group transition-all duration-200">
                  <td class="py-6 px-6 bg-slate-50/60 border-y border-l border-slate-200 rounded-l-2xl group-hover:bg-white group-hover:border-emerald-500 transition-all">
                    <span class="text-sm font-black text-slate-900">#{{ ticket.id }}</span>
                  </td>
                  <td class="py-6 px-4 bg-slate-50/60 border-y border-slate-200 group-hover:bg-white group-hover:border-emerald-500 transition-all">
                    <span class="text-sm font-bold text-slate-900">{{ ticket.assignment?.implementation_date || 'N/A' }}</span>
                  </td>
                  <td class="py-6 px-4 bg-slate-50/60 border-y border-slate-200 group-hover:bg-white group-hover:border-emerald-500 transition-all">
                    <div class="flex flex-col">
                      <span class="text-sm font-bold text-slate-700">{{ ticket.assignment?.personnel_name || 'N/A' }}</span>
                      <span class="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{{ ticket.assignment?.vehicle_name || 'No Vehicle' }}</span>
                    </div>
                  </td>
                  <td class="py-6 px-6 bg-slate-50/60 border-y border-r border-slate-200 rounded-r-2xl group-hover:bg-white group-hover:border-emerald-500 transition-all text-right">
                    <span class="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-full">On Route</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import api from '@/api/client';
import Swal from 'sweetalert2';

const tickets = ref([]);
const loading = ref(false);

const scheduledTickets = computed(() => {
  return tickets.value.filter(t => t.current_step == 3);
});

const activeTickets = computed(() => {
  return tickets.value.filter(t => t.current_step == 4);
});

const fetchTickets = async () => {
  try {
    const res = await api.get('/tickets/active/TASU');
    tickets.value = res.data.data.tickets;
  } catch (error) {
    console.error('Failed to fetch active tickets', error);
  }
};

const startJobEarly = async (ticketId) => {
  const result = await Swal.fire({
    title: 'Depart Early?',
    text: 'This will move the trip to On Route regardless of the scheduled departure date.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#10B981',
    cancelButtonColor: '#64748B',
    confirmButtonText: 'Yes, Depart Now'
  });

  if (result.isConfirmed) {
    loading.value = true;
    try {
      await api.post('/dispatch/start', { ticket_id: ticketId });
      Swal.fire({
        title: 'Success!',
        text: 'The trip has been started.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
      await fetchTickets();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to start trip early.', 'error');
    } finally {
      loading.value = false;
    }
  }
};

onMounted(() => {
  fetchTickets();
});
</script>
