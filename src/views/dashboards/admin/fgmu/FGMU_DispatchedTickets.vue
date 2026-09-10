<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/admin/fgmu" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <span class="text">FGMU Home</span>
      </router-link>
      <router-link to="/admin/fgmu/dispatched" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <span class="text">Dispatched Tickets</span>
      </router-link>
      <router-link to="/admin/fgmu/personnel" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span class="text">Personnel & Assignments</span>
      </router-link>
      <div class="mt-8 mb-4 px-4">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Archives</p>
      </div>
      <router-link to="/admin/fgmu/archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span class="text">Archived Tickets</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">FGMU Operations</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Dispatched & Active Tickets</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in">

        <!-- ① Scheduled / Dispatched Tickets -->
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
                  <h3 class="text-xl font-black text-white tracking-tight">Scheduled / Dispatched Tickets</h3>
                  <p class="text-amber-200 text-[10px] font-bold uppercase tracking-widest mt-0.5">Tickets awaiting implementation date</p>
                </div>
              </div>
              <div class="flex items-center self-start sm:self-auto gap-2 px-4 py-2 bg-white/20 rounded-2xl border border-white/30 backdrop-blur-sm">
                <span class="w-2 h-2 rounded-full bg-amber-200 animate-pulse"></span>
                <span class="text-white font-black text-sm">{{ scheduledTickets.length }}</span>
                <span class="text-amber-200 text-[10px] font-bold uppercase tracking-widest">Pending</span>
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
              <p class="text-slate-400 font-bold text-sm">No scheduled tickets</p>
              <p class="text-slate-300 text-xs">All dispatched tickets have already been started.</p>
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

        <!-- ② In-Progress / Ongoing Tickets -->
        <div class="rounded-[2.5rem] overflow-hidden shadow-lg border border-emerald-200">
          <!-- Section Header -->
          <div class="relative bg-gradient-to-br from-emerald-900 to-emerald-800 px-6 sm:px-10 py-7 overflow-hidden">
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),_transparent_60%)]"></div>
            <div class="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                <div class="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-black text-white tracking-tight">Active Dispatches</h3>
                  <p class="text-emerald-200 text-[10px] font-bold uppercase tracking-widest mt-0.5">Tickets actively being worked on</p>
                </div>
              </div>
              <div class="flex items-center self-start sm:self-auto gap-2 px-4 py-2 bg-white/20 rounded-2xl border border-white/30 backdrop-blur-sm">
                <span class="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
                <span class="text-white font-black text-sm">{{ activeTickets.length }}</span>
                <span class="text-emerald-200 text-[10px] font-bold uppercase tracking-widest">Active</span>
              </div>
            </div>
          </div>

          <!-- Ticket List -->
          <div class="bg-white px-4 sm:px-6 pb-6">
            <div v-if="activeTickets.length === 0" class="py-16 flex flex-col items-center justify-center gap-3">
              <div class="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p class="text-slate-400 font-bold text-sm">No active dispatches</p>
              <p class="text-slate-300 text-xs">Start a scheduled ticket above to begin tracking live work.</p>
            </div>

            <div v-else class="divide-y divide-slate-100">
              <div
                v-for="ticket in activeTickets"
                :key="ticket.id"
                :id="'ticket-' + ticket.id"
                :class="['group flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4 px-4 sm:px-6 hover:bg-slate-50/80 border-b border-slate-100 last:border-b-0 rounded-2xl transition-all duration-200 cursor-default', highlightedTicketId === ticket.id ? 'ring-2 ring-emerald-500 bg-emerald-50/60 shadow-md' : '']"
              >
                <!-- Left Details: ID & Metadata Columns -->
                <div class="flex flex-col sm:flex-row sm:items-center gap-4 flex-1 min-w-0">
                  <div class="flex items-center gap-3 shrink-0">
                    <div class="w-1.5 h-10 rounded-full bg-emerald-500 group-hover:h-12 transition-all duration-300 shrink-0"></div>
                    <div class="h-10 px-3.5 min-w-[5rem] rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                      <span class="text-xs font-black text-emerald-700 leading-none">#{{ ticket.id }}</span>
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
                      <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Start Date</span>
                      <span class="text-sm font-semibold text-slate-700 truncate">{{ formatDate(ticket.assignment?.dispatched_at || ticket.assignment?.implementation_date) }}</span>
                    </div>
                    <div class="flex flex-col min-w-0">
                      <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Elapsed Time</span>
                      <span class="text-sm font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/60 inline-flex items-center gap-1 w-fit truncate">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ liveDurations[ticket.id] ?? computeDuration(ticket.assignment, ticket.overtime_hours) ?? 'Calculating...' }}
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
                  <span class="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
                    In Progress
                  </span>

                  <!-- Request / Grant Extension -->
                  <button
                    @click="openExtensionModal(ticket)"
                    class="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/80 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 whitespace-nowrap cursor-pointer"
                    title="Grant timeline extension with reason and justification"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Extend
                  </button>

                  <!-- Complete Job (Opens Material Completion Modal) -->
                  <button
                    @click="openMaterialCompletionModal(ticket)"
                    :disabled="loading"
                    class="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm shadow-emerald-600/30 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    Complete Job
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

  <!-- Material Completion Modal -->
  <CompleteJobMaterialModal
    :is-open="showMaterialModal"
    :ticket="selectedTicketForCompletion"
    @close="showMaterialModal = false"
    @completed="handleJobCompleted"
  />

  <!-- Material Receipt Modal -->
  <MaterialReceiptModal
    :is-open="showReceiptModal"
    :ticket="receiptTicket"
    unit-code="FGMU"
    @close="showReceiptModal = false"
  />

  <!-- Ticket Extension Modal -->
  <TicketExtensionModal
    :is-open="showExtensionModal"
    :ticket="ticketToExtend"
    unit-code="FGMU"
    @close="showExtensionModal = false"
    @extended="handleTicketExtended"
  />

  <!-- Document / Accomplishment Viewer Modal -->
  <DocumentViewerModal
    :is-open="viewerModal.isOpen"
    :title="viewerModal.title"
    :file-name="viewerModal.fileName"
    :file-blob="viewerModal.fileBlob"
    :file-url="viewerModal.fileUrl"
    @close="viewerModal.isOpen = false"
  />
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';
import CompleteJobMaterialModal from '@/components/CompleteJobMaterialModal.vue';
import MaterialReceiptModal from '@/components/MaterialReceiptModal.vue';
import TicketExtensionModal from '@/components/TicketExtensionModal.vue';
import DocumentViewerModal from '@/components/DocumentViewerModal.vue';
import { calculateWorkingHoursElapsed, parseDateLocal } from '@/utils/workCalendar';
import api from '@/api/client';
import { toast } from 'vue3-toastify';

const route = useRoute();
const highlightedTicketId = ref(null);

const tickets = ref([]);
const loading = ref(false);
const showConfirmModal = ref(false);
const pendingTicketId = ref(null);
const pendingAction = ref(null); // 'start'

// Material completion & receipt modals
const showMaterialModal = ref(false);
const selectedTicketForCompletion = ref(null);
const showReceiptModal = ref(false);
const receiptTicket = ref(null);

// Extension Modal
const showExtensionModal = ref(false);
const ticketToExtend = ref(null);

// Document / Accomplishment Viewer Modal
const viewerModal = reactive({
  isOpen: false,
  title: '',
  fileName: '',
  fileBlob: null,
  fileUrl: '',
});

/** Keyed by ticket.id → human-friendly elapsed duration string. Updated every minute. */
const liveDurations = reactive({});

let durationRefreshTimer = null;

const scheduledTickets = computed(() => tickets.value.filter(t => t.current_step == 4));
const activeTickets = computed(() => tickets.value.filter(t => t.current_step == 5));

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
    const res = await api.get('/tickets/active/FGMU');
    tickets.value = res.data.data.tickets;
    refreshDurations();
    checkRouteQueryTicket();
  } catch (error) {
    console.error('Failed to fetch active tickets', error);
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

const refreshDurations = () => {
  for (const ticket of activeTickets.value) {
    const start = ticket.assignment?.dispatched_at || ticket.assignment?.assigned_at || ticket.assignment?.implementation_date;
    const dur = calculateWorkingHoursElapsed(start, new Date(), ticket.overtime_hours);
    liveDurations[ticket.id] = dur.formatted;
  }
};

const openExtensionModal = (ticket) => {
  ticketToExtend.value = ticket;
  showExtensionModal.value = true;
};

const handleTicketExtended = () => {
  toast.success(`Extension granted for ticket #${ticketToExtend.value?.id}`);
  fetchTickets();
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
    toast.success('Job started — now in progress.');
    await fetchTickets();
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || 'Failed to start job early.');
  } finally {
    loading.value = false;
  }
};

const openMaterialCompletionModal = (ticket) => {
  selectedTicketForCompletion.value = ticket;
  showMaterialModal.value = true;
};

const handleJobCompleted = (result) => {
  const completedTicket = selectedTicketForCompletion.value;
  receiptTicket.value = {
    ...completedTicket,
    materials: result.materials || [],
    total_material_cost: result.totalCost || 0,
    completed_at: new Date().toISOString(),
  };

  fetchTickets();

  // Show Material Receipt modal immediately after completion
  showReceiptModal.value = true;
};

const computeDuration = (assignment, overtimeHours = 0) => {
  if (!assignment) return null;
  const startRaw = assignment.dispatched_at || assignment.assigned_at || assignment.implementation_date;
  if (!startRaw) return null;
  const dur = calculateWorkingHoursElapsed(startRaw, new Date(), overtimeHours);
  return dur.formatted;
};

onMounted(() => {
  fetchTickets();
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
