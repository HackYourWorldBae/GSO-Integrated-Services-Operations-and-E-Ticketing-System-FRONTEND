<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/dispatcher/leau" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
        <span class="text">Ticket Queue</span>
      </router-link>
      <router-link to="/dispatcher/leau/workers" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span class="text">Assign Workers</span>
      </router-link>
      <router-link to="/dispatcher/leau/dispatched" class="nav-item active">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <span class="text">Dispatched Tickets</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">LEAU Dispatcher</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Dispatched & Active Tickets</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in relative">
        
        <!-- Scheduled/Dispatched Tickets -->
        <div class="rounded-[2.5rem] bg-white border border-slate-200 p-10 overflow-hidden shadow-sm">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-2xl font-black text-slate-900 tracking-tight text-amber-600">Scheduled / Dispatched Tickets</h3>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left border-separate border-spacing-y-4 min-w-[750px]">
              <thead>
                <tr class="border-b border-slate-100">
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 font-bold">Ticket ID</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 font-bold">Implement Date</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 font-bold">Worker</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="scheduledTickets.length === 0">
                  <td colspan="4" class="py-8 text-center text-slate-400 text-sm font-medium">No scheduled tickets.</td>
                </tr>
                <tr v-for="ticket in scheduledTickets" :key="ticket.id" class="group transition-all duration-200">
                  <td class="py-6 px-6 bg-slate-50/60 border-y border-l border-slate-200 rounded-l-2xl group-hover:bg-white group-hover:border-amber-500 transition-all">
                    <span class="text-sm font-black text-slate-900">#{{ ticket.id }}</span>
                  </td>
                  <td class="py-6 px-4 bg-slate-50/60 border-y border-slate-200 group-hover:bg-white group-hover:border-amber-500 transition-all">
                    <span class="text-sm font-bold text-slate-900">{{ ticket.assignment?.implementation_date || 'N/A' }}</span>
                  </td>
                  <td class="py-6 px-4 bg-slate-50/60 border-y border-slate-200 group-hover:bg-white group-hover:border-amber-500 transition-all">
                    <span class="text-sm font-bold text-slate-700">{{ ticket.assignment?.personnel_name || 'N/A' }}</span>
                  </td>
                  <td class="py-6 px-6 bg-slate-50/60 border-y border-r border-slate-200 rounded-r-2xl group-hover:bg-white group-hover:border-amber-500 transition-all text-right">
                    <button
                      @click="initiateAction('start', ticket.id)"
                      class="px-4 py-2 rounded-xl bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-amber-700 transition-colors inline-block shadow-sm"
                      :disabled="loading"
                    >
                      Start Job Early
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Active / Performing Tickets -->
        <div class="rounded-[2.5rem] bg-white border border-slate-200 p-10 overflow-hidden shadow-sm">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-2xl font-black text-slate-900 tracking-tight text-emerald-600">Actively Performed Tickets</h3>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left border-separate border-spacing-y-4 min-w-[750px]">
              <thead>
                <tr class="border-b border-slate-100">
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 font-bold">Ticket ID</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 font-bold">Implement Date</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 font-bold">Worker</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="activeTickets.length === 0">
                  <td colspan="4" class="py-8 text-center text-slate-400 text-sm font-medium">No tickets currently being performed.</td>
                </tr>
                <tr v-for="ticket in activeTickets" :key="ticket.id" class="group transition-all duration-200">
                  <td class="py-6 px-6 bg-slate-50/60 border-y border-l border-slate-200 rounded-l-2xl group-hover:bg-white group-hover:border-emerald-500 transition-all">
                    <span class="text-sm font-black text-slate-900">#{{ ticket.id }}</span>
                  </td>
                  <td class="py-6 px-4 bg-slate-50/60 border-y border-slate-200 group-hover:bg-white group-hover:border-emerald-500 transition-all">
                    <span class="text-sm font-bold text-slate-900">{{ ticket.assignment?.implementation_date || 'N/A' }}</span>
                  </td>
                  <td class="py-6 px-4 bg-slate-50/60 border-y border-slate-200 group-hover:bg-white group-hover:border-emerald-500 transition-all">
                    <span class="text-sm font-bold text-slate-700">{{ ticket.assignment?.personnel_name || 'N/A' }}</span>
                  </td>
                  <td class="py-6 px-6 bg-slate-50/60 border-y border-r border-slate-200 rounded-r-2xl group-hover:bg-white group-hover:border-emerald-500 transition-all text-right">
                    <button
                      @click="initiateAction('finish', ticket.id)"
                      class="px-4 py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors inline-block shadow-sm"
                      :disabled="loading"
                    >
                      Job Finished
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </template>
  </MainLayout>

  <!-- Custom Confirm Modal -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="showConfirmModal"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
        @click.self="closeConfirmModal"
      >
        <div class="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl transform transition-all">
          <!-- Icon -->
          <div
            class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            :class="pendingAction === 'finish' ? 'bg-emerald-100' : 'bg-amber-100'"
          >
            <svg v-if="pendingAction === 'finish'" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <!-- Text -->
          <h3 class="text-2xl font-black text-slate-900 text-center mb-2">
            {{ pendingAction === 'finish' ? 'Mark Job as Completed?' : 'Start Job Early?' }}
          </h3>
          <p class="text-slate-500 text-center font-medium mb-8">
            {{ pendingAction === 'finish'
              ? 'This will complete the job and free up the assigned worker.'
              : 'This will move the ticket to Actively Performed regardless of the implementation date.' }}
          </p>

          <!-- Actions -->
          <div class="flex gap-4">
            <button
              @click="closeConfirmModal"
              class="w-full px-6 py-4 bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-200 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              @click="executeConfirmedAction"
              :disabled="loading"
              class="w-full px-6 py-4 text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-60"
              :class="pendingAction === 'finish'
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                : 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20'"
            >
              {{ pendingAction === 'finish' ? 'Yes, Complete Job' : 'Yes, Start Now' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import api from '@/api/client';
import { toast } from 'vue3-toastify';

const tickets = ref([]);
const loading = ref(false);
const showConfirmModal = ref(false);
const pendingTicketId = ref(null);
const pendingAction = ref(null); // 'start' | 'finish'

const scheduledTickets = computed(() => {
  return tickets.value.filter(t => t.current_step == 4);
});

const activeTickets = computed(() => {
  return tickets.value.filter(t => t.current_step == 5);
});

const fetchTickets = async () => {
  try {
    const res = await api.get('/tickets/active/LEAU');
    tickets.value = res.data.data.tickets;
  } catch (error) {
    console.error('Failed to fetch active tickets', error);
  }
};

/**
 * Opens the confirmation modal for either 'start' (start early) or 'finish' (complete) actions.
 */
const initiateAction = (action, ticketId) => {
  pendingAction.value = action;
  pendingTicketId.value = ticketId;
  showConfirmModal.value = true;
};

const closeConfirmModal = () => {
  showConfirmModal.value = false;
  pendingAction.value = null;
  pendingTicketId.value = null;
};

const executeConfirmedAction = async () => {
  if (pendingAction.value === 'start') {
    await performStartEarly(pendingTicketId.value);
  } else if (pendingAction.value === 'finish') {
    await performJobFinished(pendingTicketId.value);
  }
  closeConfirmModal();
};

const performStartEarly = async (ticketId) => {
  loading.value = true;
  try {
    await api.post('/dispatch/start', { ticket_id: ticketId });
    toast.success('Job started — now in progress.');
    await fetchTickets();
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || 'Failed to start job early.');
  } finally {
    loading.value = false;
  }
};

const performJobFinished = async (ticketId) => {
  loading.value = true;
  try {
    const ticket = tickets.value.find(t => t.id === ticketId);
    await api.patch(`/tickets/${ticketId}/complete`);

    const duration = computeDuration(ticket?.assignment);
    const message = duration
      ? `Ticket #${ticketId} completed in ${duration}.`
      : `Ticket #${ticketId} has been marked as completed.`;

    toast.success(message);
    await fetchTickets();
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || 'Failed to complete ticket.');
  } finally {
    loading.value = false;
  }
};

/**
 * Computes a human-friendly duration string from the job start time to now.
 *
 * Priority: dispatched_at (early start timestamp) → implementation_date (scheduled date at midnight).
 * Returns null if neither reference date is available.
 */
const computeDuration = (assignment) => {
  if (!assignment) return null;

  const startRaw = assignment.dispatched_at || assignment.implementation_date;
  if (!startRaw) return null;

  const startDate = new Date(startRaw);
  if (isNaN(startDate.getTime())) return null;

  const totalMs = Date.now() - startDate.getTime();
  if (totalMs <= 0) return null;

  const totalMinutes = Math.floor(totalMs / 60000);
  const totalHours   = Math.floor(totalMinutes / 60);
  const days         = Math.floor(totalHours / 24);
  const hours        = totalHours % 24;
  const minutes      = totalMinutes % 60;

  if (days > 0) {
    return hours > 0 ? `${days}d ${hours}h` : `${days} day${days !== 1 ? 's' : ''}`;
  }
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  return `${minutes} min${minutes !== 1 ? 's' : ''}`;
};

onMounted(() => {
  fetchTickets();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
