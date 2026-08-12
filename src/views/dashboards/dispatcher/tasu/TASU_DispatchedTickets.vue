<template>
  <MainLayout>
    <template #sidebar-links>

      <router-link to="/dispatcher/tasu" class="nav-item active">
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
      <router-link to="/dispatcher/tasu/dispatched" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <span class="text">Dispatched Trips</span>
      </router-link>
      <router-link to="/dispatcher/tasu/archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span class="text">Archives</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">TASU Dispatcher</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Scheduled & Active Trips</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in">

        <!-- ① Scheduled / Waiting for Departure -->
        <div class="rounded-[2.5rem] overflow-hidden shadow-lg border border-amber-200">
          <!-- Section Header -->
          <div class="relative bg-gradient-to-br from-amber-900 to-amber-800 px-6 sm:px-10 py-7 overflow-hidden">
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),_transparent_60%)]"></div>
            <div class="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                <div class="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-black text-white tracking-tight">Scheduled / Waiting for Departure</h3>
                  <p class="text-amber-200 text-[10px] font-bold uppercase tracking-widest mt-0.5">Trips awaiting departure time</p>
                </div>
              </div>
              <div class="flex items-center self-start sm:self-auto gap-2 px-4 py-2 bg-white/20 rounded-2xl border border-white/30 backdrop-blur-sm">
                <span class="w-2 h-2 rounded-full bg-amber-200 animate-pulse"></span>
                <span class="text-white font-black text-sm">{{ scheduledTickets.length }}</span>
                <span class="text-amber-200 text-[10px] font-bold uppercase tracking-widest">Pending</span>
              </div>
            </div>
          </div>

          <!-- Table Body -->
          <div class="bg-white px-4 sm:px-6 pb-6">
            <!-- Empty State -->
            <div v-if="scheduledTickets.length === 0" class="py-16 flex flex-col items-center justify-center gap-3">
              <div class="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p class="text-slate-400 font-bold text-sm">No scheduled trips</p>
              <p class="text-slate-300 text-xs">All dispatched trips have already departed.</p>
            </div>

            <!-- Ticket List -->
            <div v-else class="divide-y divide-slate-100">
              <div
                v-for="ticket in scheduledTickets"
                :key="ticket.id"
                class="group flex flex-col md:flex-row md:items-center gap-4 py-5 px-4 hover:bg-slate-50 border-b border-transparent hover:border-slate-100 rounded-2xl transition-all duration-200 cursor-default sm:-mx-4"
              >
                <!-- Mobile Header Row: ID & Status -->
                <div class="flex items-center justify-between w-full md:w-auto md:shrink-0">
                  <div class="flex items-center gap-4 min-w-0">
                    <div class="w-1 h-12 rounded-full bg-amber-500 group-hover:h-14 transition-all duration-300 shrink-0"></div>
                    <div class="h-12 px-3 min-w-[4.5rem] rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                      <span class="text-xs font-black text-amber-700 leading-none">#{{ ticket.id }}</span>
                    </div>
                  </div>
                  <!-- Mobile Status Chip -->
                  <div class="flex md:hidden items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl shrink-0">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <span class="text-[10px] font-black text-amber-700 uppercase tracking-widest">Awaiting</span>
                  </div>
                </div>

                <!-- Content Grid for Mobile, Flex for Desktop -->
                <div class="grid grid-cols-2 gap-4 w-full md:flex md:flex-1 md:items-center md:gap-5">
                  <div class="flex flex-col min-w-[130px]">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Departure</span>
                    <span class="text-sm font-bold text-slate-800">{{ ticket.assignment?.implementation_date || 'N/A' }}</span>
                  </div>
                  <div class="flex flex-col flex-1 min-w-0">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Driver & Vehicle</span>
                    <span class="text-sm font-bold text-slate-800">{{ ticket.assignment?.personnel_name || 'N/A' }}</span>
                    <span class="text-[10px] text-slate-400 font-medium uppercase tracking-wider truncate">{{ ticket.assignment?.vehicle_name || 'No vehicle assigned' }}</span>
                  </div>
                </div>

                <!-- Actions (Desktop & Mobile) -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-end gap-4 w-full md:w-auto mt-2 md:mt-0 md:shrink-0">
                  <!-- Desktop Status Chip -->
                  <div class="hidden md:flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl shrink-0">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <span class="text-[10px] font-black text-amber-700 uppercase tracking-widest">Awaiting</span>
                  </div>
                  <button
                    @click="initiateAction('depart', ticket.id)"
                    :disabled="loading"
                    class="w-full sm:w-auto shrink-0 px-5 py-3 md:py-2.5 rounded-xl bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 disabled:opacity-50"
                  >
                    Depart Early
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ② On Route / Active Trips -->
        <div class="rounded-[2.5rem] overflow-hidden shadow-lg border border-slate-200 shadow-xl shadow-slate-200/50">
          <!-- Section Header -->
          <div class="relative bg-gradient-to-br from-slate-900 to-slate-800 px-6 sm:px-10 py-7 overflow-hidden">
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.12),_transparent_60%)]"></div>
            <div class="absolute -bottom-8 -right-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl"></div>
            <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                <div class="w-11 h-11 rounded-2xl bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center border border-emerald-500/30">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-black text-white tracking-tight">On Route / Active Trips</h3>
                  <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Duration updates every hour</p>
                </div>
              </div>
              <div class="flex items-center self-start sm:self-auto gap-2 px-4 py-2 bg-emerald-500/15 rounded-2xl border border-emerald-500/25 backdrop-blur-sm">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span class="text-white font-black text-sm">{{ activeTickets.length }}</span>
                <span class="text-emerald-300 text-[10px] font-bold uppercase tracking-widest">Active</span>
              </div>
            </div>
          </div>

          <!-- Table Body -->
          <div class="bg-white px-4 sm:px-6 pb-6">
            <!-- Empty State -->
            <div v-if="activeTickets.length === 0" class="py-16 flex flex-col items-center justify-center gap-3">
              <div class="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p class="text-slate-400 font-bold text-sm">No active trips</p>
              <p class="text-slate-300 text-xs">No vehicles are currently on route.</p>
            </div>

            <!-- Ticket List -->
            <div v-else class="divide-y divide-slate-100">
              <div
                v-for="ticket in activeTickets"
                :key="ticket.id"
                class="group flex flex-col md:flex-row md:items-center gap-4 py-5 px-4 hover:bg-slate-50 border-b border-transparent hover:border-slate-100 rounded-2xl transition-all duration-200 cursor-default sm:-mx-4"
              >
                <!-- Mobile Header Row: ID & Status -->
                <div class="flex items-center justify-between w-full md:w-auto md:shrink-0">
                  <div class="flex items-center gap-4 min-w-0">
                    <div class="w-1 h-12 rounded-full bg-emerald-500 group-hover:h-14 transition-all duration-300 shrink-0"></div>
                    <div class="h-12 px-3 min-w-[4.5rem] rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                      <span class="text-xs font-black text-emerald-600 leading-none">#{{ ticket.id }}</span>
                    </div>
                  </div>
                  <!-- Mobile Status Chip -->
                  <div class="flex md:hidden items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl shrink-0">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span class="text-[10px] font-black text-emerald-700 uppercase tracking-widest">On Route</span>
                  </div>
                </div>

                <!-- Content Grid for Mobile, Flex for Desktop -->
                <div class="grid grid-cols-2 gap-4 w-full md:flex md:flex-1 md:items-center md:gap-5">
                  <div class="flex flex-col min-w-[130px]">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Departed</span>
                    <span class="text-sm font-bold text-slate-800">{{ ticket.assignment?.implementation_date || 'N/A' }}</span>
                  </div>
                  <div class="flex flex-col flex-1 min-w-0">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Driver & Vehicle</span>
                    <span class="text-sm font-bold text-slate-800">{{ ticket.assignment?.personnel_name || 'N/A' }}</span>
                    <span class="text-[10px] text-slate-400 font-medium uppercase tracking-wider truncate">{{ ticket.assignment?.vehicle_name || 'No vehicle assigned' }}</span>
                  </div>
                </div>

                <!-- Actions (Desktop & Mobile) -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-end gap-4 w-full md:w-auto mt-2 md:mt-0 md:shrink-0">
                  <div class="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                    <!-- Live Duration -->
                    <div class="flex flex-col md:items-center shrink-0 w-full sm:w-auto">
                      <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 hidden md:block">Elapsed</span>
                      <div class="flex items-center justify-center gap-1.5 px-3 py-2 md:py-1.5 bg-slate-900 rounded-xl w-full sm:w-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="text-xs font-black text-white tracking-wide">
                          {{ liveDurations[ticket.id] || '—' }} <span class="md:hidden ml-1 text-[10px] font-medium text-slate-400 uppercase">elapsed</span>
                        </span>
                      </div>
                    </div>
                    <!-- Desktop Status Chip -->
                    <div class="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl shrink-0">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span class="text-[10px] font-black text-emerald-700 uppercase tracking-widest">On Route</span>
                    </div>
                  </div>

                  <button
                    @click="initiateAction('finish', ticket.id)"
                    :disabled="loading"
                    class="w-full sm:w-auto shrink-0 px-5 py-3 md:py-2.5 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 disabled:opacity-50"
                  >
                    Job Finished
                  </button>
                </div>
              </div>
            </div>
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
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
        @click.self="closeConfirmModal"
      >
        <div class="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl">
          <!-- Icon -->
          <div
            class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            :class="pendingAction === 'finish' ? 'bg-emerald-100' : 'bg-amber-100'"
          >
            <svg v-if="pendingAction === 'finish'" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>

          <!-- Text -->
          <h3 class="text-2xl font-black text-slate-900 text-center mb-2">
            {{ pendingAction === 'finish' ? 'Mark Trip as Completed?' : 'Depart Early?' }}
          </h3>
          <p class="text-slate-500 text-center font-medium mb-8">
            {{ pendingAction === 'finish'
              ? 'This will complete the trip and free up the assigned driver and vehicle.'
              : 'This will move the trip to On Route regardless of the scheduled departure date.' }}
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
              {{ pendingAction === 'finish' ? 'Yes, Complete Trip' : 'Yes, Depart Now' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import api from '@/api/client';
import { toast } from 'vue3-toastify';

const tickets = ref([]);
const loading = ref(false);
const showConfirmModal = ref(false);
const pendingTicketId = ref(null);
const pendingAction = ref(null); // 'depart' | 'finish'

/** Keyed by ticket.id → human-friendly elapsed duration string. Updated every hour. */
const liveDurations = reactive({});

let durationRefreshTimer = null;

const scheduledTickets = computed(() => tickets.value.filter(t => t.current_step == 3));
const activeTickets    = computed(() => tickets.value.filter(t => t.current_step == 4));

const fetchTickets = async () => {
  try {
    const res = await api.get('/tickets/active/TASU');
    tickets.value = res.data.data.tickets;
    refreshDurations();
  } catch (error) {
    console.error('Failed to fetch active tickets', error);
  }
};

/**
 * Recomputes the elapsed duration for every active ticket and writes it into
 * the liveDurations map. Called once on mount, then every hour.
 */
const refreshDurations = () => {
  for (const ticket of activeTickets.value) {
    liveDurations[ticket.id] = computeDuration(ticket.assignment);
  }
};

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
  if (pendingAction.value === 'depart') {
    await performDepartEarly(pendingTicketId.value);
  } else if (pendingAction.value === 'finish') {
    await performJobFinished(pendingTicketId.value);
  }
  closeConfirmModal();
};

const performDepartEarly = async (ticketId) => {
  loading.value = true;
  try {
    await api.post('/dispatch/start', { ticket_id: ticketId });
    toast.success('Trip departed — now On Route.');
    await fetchTickets();
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || 'Failed to start trip early.');
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
    const message  = duration
      ? `Trip #${ticketId} completed in ${duration}.`
      : `Trip #${ticketId} has been marked as completed.`;

    toast.success(message);
    await fetchTickets();
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || 'Failed to complete trip.');
  } finally {
    loading.value = false;
  }
};

/**
 * Computes a human-friendly elapsed duration string.
 * Uses dispatched_at (early departure) if set, otherwise implementation_date.
 */
const computeDuration = (assignment) => {
  if (!assignment) return null;

  const startRaw = assignment.dispatched_at || assignment.implementation_date;
  if (!startRaw) return null;

  // Append 'Z' to treat the backend Y-m-d H:i:s string as UTC
  const startStr = startRaw.replace(' ', 'T'); // Parsed as local time
  const startDate = new Date(startStr);
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
  // Refresh displayed durations every hour without re-fetching from the server
  durationRefreshTimer = setInterval(refreshDurations, 60 * 1000);
});

onUnmounted(() => {
  clearInterval(durationRefreshTimer);
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
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(8px);
}
</style>
