<template>
  <MainLayout>
    <template #header-title>
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <router-link to="/admin/fgmu" class="p-1 -ml-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="Back to FGMU Home">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </router-link>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none">FGMU Scheduled &amp; Dispatched</h2>
          <span class="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider border border-amber-200">
            Awaiting Implementation
          </span>
        </div>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase mt-1">
          Facilities &amp; Grounds Management Unit
        </p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-6 animate-fade-in pb-12">

        <!-- Scheduled / Dispatched Tickets Section -->
        <div class="rounded-[2.5rem] overflow-hidden shadow-lg border border-amber-200">
          <!-- Section Header Banner -->
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
                  <h3 class="text-xl font-black text-white tracking-tight">Scheduled &amp; Dispatched Tickets</h3>
                  <p class="text-amber-200 text-[10px] font-bold uppercase tracking-widest mt-0.5">Tickets assigned &amp; awaiting target start date</p>
                </div>
              </div>
              <div class="flex items-center self-start sm:self-auto gap-3">
                <div class="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-2xl border border-white/30 backdrop-blur-sm">
                  <span class="w-2 h-2 rounded-full bg-amber-200 animate-pulse"></span>
                  <span class="text-white font-black text-sm">{{ scheduledTickets.length }}</span>
                  <span class="text-amber-200 text-[10px] font-bold uppercase tracking-widest">Scheduled</span>
                </div>
                <router-link
                  to="/admin/fgmu/active-tickets"
                  class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
                >
                  <span>View Active Dispatches</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </router-link>
              </div>
            </div>
          </div>

          <!-- Ticket List -->
          <div class="bg-white px-4 sm:px-6 pb-6">
            <div v-if="scheduledTickets.length === 0" class="py-16 flex flex-col items-center justify-center gap-3">
              <div class="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p class="text-slate-400 font-bold text-sm">No scheduled tickets awaiting start</p>
              <p class="text-slate-300 text-xs">All dispatched tickets have already been started, or new tickets need to be assigned.</p>
              <router-link
                to="/admin/fgmu/approved-tickets"
                class="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Browse Approved Tickets
              </router-link>
            </div>

            <div v-else class="divide-y divide-slate-100">
              <div
                v-for="ticket in scheduledTickets"
                :key="ticket.id"
                :id="'ticket-' + ticket.id"
                :class="['group flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4 px-4 sm:px-6 hover:bg-slate-50/80 border-b border-slate-100 last:border-b-0 rounded-2xl transition-all duration-200 cursor-default', highlightedTicketId === ticket.id ? 'ring-2 ring-emerald-500 bg-emerald-50/60 shadow-md' : '']"
              >
                <!-- Left Details: ID & Metadata Columns -->
                <div class="flex flex-col sm:flex-row sm:items-center gap-4 flex-1 min-w-0">
                  <div class="flex items-center gap-3 shrink-0">
                    <div class="w-1.5 h-10 rounded-full bg-amber-500 group-hover:h-12 transition-all duration-300 shrink-0"></div>
                    <div class="h-10 px-3.5 min-w-[5rem] rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                      <span class="text-xs font-black text-amber-700 leading-none">#{{ ticket.id }}</span>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5 flex-1 min-w-0 items-center">
                    <div class="flex flex-col min-w-0 sm:col-span-2 lg:col-span-1">
                      <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Ticket Title</span>
                      <span class="text-sm font-bold text-slate-800 truncate" :title="ticket.title || ticket.project_title || ticket.service_type || 'N/A'">
                        {{ ticket.title || ticket.project_title || ticket.service_type || 'N/A' }}
                      </span>
                    </div>
                    <div class="flex flex-col min-w-0">
                      <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Target Date</span>
                      <span class="text-sm font-semibold text-slate-700 truncate">{{ formatDate(ticket.assignment?.implementation_date) }}</span>
                    </div>
                    <div class="flex flex-col min-w-0">
                      <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Target Duration</span>
                      <span class="text-sm font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60 inline-flex items-center gap-1 w-fit truncate">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ (ticket.working_days || ticket.assignment?.working_days) ? `${ticket.working_days || ticket.assignment?.working_days} Day(s)` : 'N/A' }}
                      </span>
                    </div>
                    <div class="flex flex-col min-w-0">
                      <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Assigned Worker</span>
                      <span class="text-sm font-bold text-slate-800 truncate">{{ ticket.assignment?.personnel_name || 'N/A' }}</span>
                    </div>
                  </div>
                </div>

                <!-- Right Details: Status Pill & Action Buttons -->
                <div class="flex items-center gap-3 shrink-0 self-end lg:self-center border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 w-full lg:w-auto justify-end">
                  <span class="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
                    Scheduled
                  </span>
                  <button
                    @click="initiateAction('start', ticket.id)"
                    :disabled="loading"
                    class="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm shadow-amber-600/30 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                    Start Early
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </template>
  </MainLayout>

  <!-- Confirmation Modal -->
  <ConfirmModal
    :is-open="showConfirmModal"
    title="Start Job Early?"
    message="This will mark the ticket as officially started today, transitioning it into active progress. Continue?"
    confirm-text="Yes, Start Now"
    cancel-text="Cancel"
    type="warning"
    @confirm="executeConfirmedAction"
    @cancel="closeConfirmModal"
  />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';
import { parseDateLocal } from '@/utils/workCalendar';
import api from '@/api/client';
import { toast } from 'vue3-toastify';

const route = useRoute();
const router = useRouter();
const highlightedTicketId = ref(null);

const tickets = ref([]);
const loading = ref(false);
const showConfirmModal = ref(false);
const pendingTicketId = ref(null);
const pendingAction = ref(null); // 'start'

const scheduledTickets = computed(() => tickets.value.filter(t => t.current_step == 4));

const checkRouteQueryTicket = () => {
  const targetId = route.query.ticketId || route.query.highlight;
  if (!targetId) return;
  highlightedTicketId.value = targetId;
  setTimeout(() => {
    const el = document.getElementById('ticket-' + targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 250);
};

watch(() => route.query.ticketId, () => {
  checkRouteQueryTicket();
});

const fetchTickets = async () => {
  try {
    loading.value = true;
    const res = await api.get('/tickets/active/FGMU');
    tickets.value = res.data.data.tickets || [];
    checkRouteQueryTicket();
  } catch (error) {
    console.error('Failed to fetch scheduled tickets', error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const parsed = parseDateLocal(dateStr);
  if (!parsed || isNaN(parsed.getTime())) return dateStr;
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(dateStr).trim())) {
    return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  return parsed.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
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
  if (pendingAction.value === 'start') {
    await performStartEarly(pendingTicketId.value);
  }
  closeConfirmModal();
};

const performStartEarly = async (ticketId) => {
  loading.value = true;
  try {
    await api.post('/dispatch/start', { ticket_id: ticketId });
    toast.success('Job started! You can now track live progress in Active Tickets.');
    await fetchTickets();
    router.push('/admin/fgmu/active-tickets');
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || 'Failed to start job early.');
  } finally {
    loading.value = false;
  }
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
</style>
