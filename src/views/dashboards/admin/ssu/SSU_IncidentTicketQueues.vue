<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/admin/ssu" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span class="text">SSU Home</span>
      </router-link>

      <router-link to="/admin/ssu/queues/incidents" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span class="text">Incident Ticket Queues</span>
      </router-link>

      <router-link to="/admin/ssu/queues/stickers" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
        <span class="text">Sticker Ticket Queues</span>
      </router-link>

      <router-link to="/admin/ssu/queues/stickers/verified" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text">Verified Vehicle Pass Tickets</span>
      </router-link>

      <div class="mt-8 mb-4 px-4">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Archived Tickets</p>
      </div>
      <router-link to="/admin/ssu/archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span class="text">Archives</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">Incident Report Ticket Queues</h2>
        <p class="text-[10px] text-rose-600 font-extrabold tracking-[0.2em] uppercase">SSU Priority Investigations &amp; Security Dispatches</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in relative pb-16">

        <!-- Analytics Summary -->
        <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          <div class="p-5 rounded-[1.75rem] bg-white border border-rose-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
            <div class="p-3 rounded-2xl bg-amber-50 text-amber-500 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Pending Review</p>
              <p class="text-3xl font-black text-slate-900 tabular-nums leading-none">{{ pendingTickets.length }}</p>
              <p class="text-[10px] font-semibold text-rose-500 mt-0.5">Awaiting action</p>
            </div>
          </div>

          <div class="p-5 rounded-[1.75rem] bg-white border border-rose-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
            <div class="p-3 rounded-2xl bg-violet-50 text-violet-600 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Under Investigation</p>
              <p class="text-3xl font-black text-slate-900 tabular-nums leading-none">{{ investigatingTickets.length }}</p>
              <p class="text-[10px] font-semibold text-slate-400 mt-0.5">Currently active</p>
            </div>
          </div>

          <div class="p-5 rounded-[1.75rem] bg-white border border-rose-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
            <div class="p-3 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Resolved Reports</p>
              <p class="text-3xl font-black text-slate-900 tabular-nums leading-none">{{ completedCount }}</p>
              <p class="text-[10px] font-semibold text-slate-400 mt-0.5">Cases closed</p>
            </div>
          </div>
        </div>

        <!-- ===================== SUBMITTED TICKETS ===================== -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-2 h-6 bg-amber-400 rounded-full"></div>
            <h3 class="text-base font-black text-slate-800 uppercase tracking-widest">Submitted Tickets</h3>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-700 border border-amber-200">{{ pendingTickets.length }}</span>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <IncidentTicketCard
              v-for="ticket in pendingTickets"
              :key="ticket.id"
              :ticket="ticket"
              @investigate="toggleInvestigate"
              @notation="openNotationEditor"
              @resolve="initiateResolve"
              @dismiss="toggleDeclineMode"
              @download-attachment="downloadAttachment"
            />

            <div v-if="pendingTickets.length === 0" class="p-10 text-center bg-white border border-amber-100 rounded-[2rem]">
              <div class="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3 text-amber-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 class="text-base font-black text-slate-700 mb-1">No Pending Incident Reports</h4>
              <p class="text-sm text-slate-400 font-medium">All submitted reports have been actioned.</p>
            </div>
          </div>
        </div>

        <!-- ===================== UNDER INVESTIGATION ===================== -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-2 h-6 bg-violet-500 rounded-full"></div>
            <h3 class="text-base font-black text-slate-800 uppercase tracking-widest">Under Investigation</h3>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-violet-100 text-violet-700 border border-violet-200">{{ investigatingTickets.length }}</span>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <IncidentTicketCard
              v-for="ticket in investigatingTickets"
              :key="ticket.id"
              :ticket="ticket"
              variant="investigating"
              @investigate="toggleInvestigate"
              @notation="openNotationEditor"
              @resolve="initiateResolve"
              @dismiss="toggleDeclineMode"
              @download-attachment="downloadAttachment"
            />

            <div v-if="investigatingTickets.length === 0" class="p-8 text-center bg-white border border-violet-100 rounded-[2rem]">
              <div class="w-12 h-12 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-3 text-violet-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p class="text-sm font-bold text-slate-400">No incidents under investigation.</p>
            </div>
          </div>
        </div>

      </div>

      <!-- ===== NOTATION EDITOR MODAL ===== -->
      <div v-if="notationTicket" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl border border-slate-100">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-black text-slate-900 leading-tight">Add Recommendation / Notation</h3>
              <p class="text-[11px] text-slate-400 font-semibold">Ticket <span class="text-rose-500">{{ notationTicket.ticketId }}</span> — visible to reporter</p>
            </div>
          </div>

          <div class="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-5">
            <p class="text-xs font-semibold text-blue-700 leading-relaxed">
              <strong class="font-black">Note:</strong> Adding a notation does <strong>not</strong> close the ticket. The notation will be displayed to the reporter in their dashboard. Once a notation is added, the ticket can then be marked as Resolved.
            </p>
          </div>

          <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Recommendation / Notation <span class="text-rose-500">*</span></label>
          <textarea
            v-model="notationText"
            rows="4"
            class="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
            placeholder="Enter recommendations, actions taken, or instructions for the reporter..."
          ></textarea>

          <div class="flex gap-3 mt-5">
            <button @click="closeNotationEditor" class="flex-1 px-5 py-3 bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-200 transition-all active:scale-95">
              Cancel
            </button>
            <button
              :disabled="!notationText.trim() || isSubmitting"
              @click="submitNotation"
              class="flex-1 px-5 py-3 bg-blue-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? 'Saving…' : 'Add Notation' }}
            </button>
          </div>
        </div>
      </div>

      <!-- ===== RESOLVE CONFIRM MODAL ===== -->
      <div v-if="resolveTicket" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl border border-slate-100">
          <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-2xl font-black text-slate-900 text-center mb-2">Mark as Resolved?</h3>
          <p class="text-slate-500 text-center font-medium mb-5">
            This will resolve and archive incident <strong class="text-slate-800">{{ resolveTicket.ticketId }}</strong>. This action cannot be undone.
          </p>

          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6">
            <p class="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1.5">Notation that was communicated to reporter:</p>
            <p class="text-xs text-slate-700 font-semibold leading-relaxed italic">"{{ resolveTicket.notation }}"</p>
          </div>

          <div class="flex gap-4">
            <button @click="resolveTicket = null" class="w-full px-6 py-4 bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-200 transition-all active:scale-95">
              Cancel
            </button>
            <button @click="confirmResolve" :disabled="isSubmitting" class="w-full px-6 py-4 bg-emerald-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all active:scale-95 disabled:opacity-50">
              {{ isSubmitting ? 'Resolving…' : 'Confirm &amp; Resolve' }}
            </button>
          </div>
        </div>
      </div>

      <!-- ===== DECLINE CONFIRM MODAL ===== -->
      <div v-if="declineTicket" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl border border-slate-100">
          <div class="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 class="text-2xl font-black text-slate-900 text-center mb-2">Dismiss Report</h3>
          <p class="text-slate-500 text-center font-medium mb-5">Provide a reason for dismissing <strong class="text-slate-800">{{ declineTicket.ticketId }}</strong>.</p>
          <label class="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2 block">Reason for Dismissal <span class="text-rose-500">*</span></label>
          <textarea
            v-model="declineReason"
            rows="3"
            class="w-full p-4 rounded-2xl border border-rose-200 bg-rose-50/50 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none resize-none mb-5"
            placeholder="Explain why this incident report is being dismissed..."
          ></textarea>
          <div class="flex gap-4">
            <button @click="declineTicket = null; declineReason = ''" class="w-full px-6 py-4 bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-200 transition-all active:scale-95">
              Cancel
            </button>
            <button :disabled="!declineReason.trim() || isSubmitting" @click="confirmDecline" class="w-full px-6 py-4 bg-rose-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-rose-600/20 hover:bg-rose-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isSubmitting ? 'Dismissing…' : 'Confirm Dismissal' }}
            </button>
          </div>
        </div>
      </div>

    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, defineComponent, h } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import { toast } from 'vue3-toastify';
import api from '@/api/client';

// ---- Attachment download ----
const downloadAttachment = async (att) => {
  try {
    const response = await api.get(`attachments/${att.id}`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: att.file_type || 'application/octet-stream' }));
    if (att.file_type && att.file_type.startsWith('image/')) {
      window.open(url, '_blank');
    } else {
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', att.file_name || 'attachment');
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  } catch (error) {
    console.error('Failed to download attachment', error);
    toast.error('Failed to download attachment.');
  }
};

// ---- State ----
const allTickets    = ref([]);
const completedCount = ref(0);
const isSubmitting  = ref(false);

/** Tickets that are still in the submitted/pending queue (not yet under investigation). */
const pendingTickets = computed(() =>
  allTickets.value.filter(t => !t.isUnderInvestigation)
);

/** Tickets currently flagged as Under Investigation. */
const investigatingTickets = computed(() =>
  allTickets.value.filter(t => t.isUnderInvestigation)
);

// ---- Modal state ----
const notationTicket = ref(null);
const notationText   = ref('');
const resolveTicket  = ref(null);
const declineTicket  = ref(null);
const declineReason  = ref('');

// ---- Data fetching ----
/**
 * Maps a raw API ticket object into the local shape used by the template.
 */
const mapTicket = (t) => ({
  id:                   t.id,
  ticketId:             t.id,
  service:              t.service_type,
  description:          t.description,
  date:                 new Date(t.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  requestedBy:          t.details?.reporter_name || 'Reporter',
  attachments:          t.attachments || [],
  isUnderInvestigation: Number(t.is_under_investigation) === 1,
  hasNotation:          !!t.ssu_notation,
  notation:             t.ssu_notation || '',
  statusLabel:          t.status_label || t.status,
});

const fetchQueue = async () => {
  try {
    const [pendingRes, activeRes] = await Promise.all([
      api.get('tickets/queue/SSU'),
      api.get('tickets/active/SSU'),
    ]);

    const pendingRaw = (pendingRes.data?.data?.tickets || []).filter(t => t.service_type === 'Incident Report');
    const activeRaw  = (activeRes.data?.data?.tickets || []).filter(t => t.service_type === 'Incident Report');

    // Merge into one deduplicated list — active queue takes precedence
    const activeIds = new Set(activeRaw.map(t => t.id));
    const merged = [
      ...activeRaw.map(mapTicket),
      ...pendingRaw.filter(t => !activeIds.has(t.id)).map(mapTicket),
    ];

    allTickets.value = merged;
  } catch (error) {
    console.error('Failed to fetch SSU Incident queue:', error);
  }
};

const fetchCompletedCount = async () => {
  try {
    const res = await api.get('tickets/stats/SSU');
    completedCount.value = res.data?.data?.stats?.resolved || 0;
  } catch (_) { /* silent */ }
};

let pollingInterval = null;

onMounted(() => {
  fetchQueue();
  fetchCompletedCount();
  pollingInterval = setInterval(() => {
    const isInteracting = !!notationTicket.value || !!resolveTicket.value || !!declineTicket.value;
    if (!isInteracting) {
      fetchQueue();
    }
  }, 5000);
});

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval);
});

// ---- Action: Toggle Under Investigation ----
const toggleInvestigate = async (ticket) => {
  const isCurrentlyInvestigating = ticket.isUnderInvestigation;
  try {
    if (isCurrentlyInvestigating) {
      await api.patch(`tickets/${ticket.id}/uninvestigate`);
      toast.info(`Incident ${ticket.ticketId} removed from investigation queue.`);
    } else {
      await api.patch(`tickets/${ticket.id}/investigate`);
      toast.success(`Incident ${ticket.ticketId} is now Under Investigation.`);
    }
    await fetchQueue();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to update investigation status.');
  }
};

// ---- Action: Add Notation ----
const openNotationEditor = (ticket) => {
  notationTicket.value = ticket;
  notationText.value   = ticket.notation || '';
};

const closeNotationEditor = () => {
  notationTicket.value = null;
  notationText.value   = '';
};

const submitNotation = async () => {
  if (!notationText.value.trim() || !notationTicket.value) return;
  isSubmitting.value = true;
  try {
    await api.patch(`tickets/${notationTicket.value.id}/notation`, { notation: notationText.value.trim() });
    toast.success(`Notation added to incident ${notationTicket.value.ticketId}.`);
    closeNotationEditor();
    await fetchQueue();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to add notation.');
  } finally {
    isSubmitting.value = false;
  }
};

// ---- Action: Mark as Resolved ----
const initiateResolve = (ticket) => {
  resolveTicket.value = ticket;
};

const confirmResolve = async () => {
  if (!resolveTicket.value) return;
  isSubmitting.value = true;
  try {
    await api.patch(`tickets/${resolveTicket.value.id}/resolve`);
    toast.success(`Incident ${resolveTicket.value.ticketId} resolved and archived.`);
    resolveTicket.value = null;
    await fetchQueue();
    await fetchCompletedCount();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to resolve ticket.');
  } finally {
    isSubmitting.value = false;
  }
};

// ---- Action: Dismiss Report ----
const toggleDeclineMode = (ticket) => {
  declineTicket.value = ticket;
  declineReason.value = '';
};

const confirmDecline = async () => {
  if (!declineReason.value.trim() || !declineTicket.value) return;
  isSubmitting.value = true;
  try {
    await api.patch(`tickets/${declineTicket.value.id}/decline`, { decline_reason: declineReason.value });
    toast.error(`Dismissed incident ${declineTicket.value.ticketId}.`);
    declineTicket.value = null;
    declineReason.value = '';
    await fetchQueue();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to dismiss ticket.');
  } finally {
    isSubmitting.value = false;
  }
};

// ---- Inline sub-component: Incident Ticket Card ----
/**
 * Renders a single incident ticket card with contextual action buttons.
 * Emitted events: investigate, notation, resolve, dismiss, download-attachment
 */
const IncidentTicketCard = defineComponent({
  name: 'IncidentTicketCard',
  props: {
    ticket:  { type: Object, required: true },
    variant: { type: String, default: 'pending' }, // 'pending' | 'investigating'
  },
  emits: ['investigate', 'notation', 'resolve', 'dismiss', 'download-attachment'],
  setup(props, { emit }) {
    const isInvestigating = computed(() => props.ticket.isUnderInvestigation);
    const hasNotation     = computed(() => props.ticket.hasNotation);

    const borderClass = computed(() =>
      isInvestigating.value
        ? 'border-violet-200/80 bg-violet-50/20'
        : 'border-rose-100/80 bg-white'
    );

    return () => h('div', {
      class: `group relative overflow-hidden border rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all ${borderClass.value}`,
    }, [
      // -- Main ticket layout --
      h('div', { class: 'flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10' }, [

        // Left: icon + details
        h('div', { class: 'flex flex-col sm:flex-row items-start gap-4 sm:gap-5 flex-1 w-full min-w-0' }, [
          h('div', {
            class: `p-4 rounded-2xl shrink-0 transition-transform group-hover:scale-110 ${isInvestigating.value ? 'bg-violet-50 text-violet-600' : 'bg-rose-50 text-rose-600'}`,
          }, [
            h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-7 w-7', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
              h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' }),
            ]),
          ]),

          h('div', { class: 'space-y-4 w-full min-w-0' }, [
            // Title row
            h('div', { class: 'flex flex-col xl:flex-row xl:items-center justify-between gap-3 w-full' }, [
              h('div', { class: 'flex flex-wrap items-center gap-2 sm:gap-3' }, [
                h('h4', { class: 'text-lg sm:text-xl font-black text-slate-900 break-words' }, props.ticket.service),
                // Status badge
                h('span', {
                  class: `px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border whitespace-nowrap ${isInvestigating.value ? 'bg-violet-50 text-violet-600 border-violet-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`,
                }, props.ticket.statusLabel),
                // Notation badge
                hasNotation.value && !(props.ticket.statusLabel || '').toLowerCase().includes('notation')
                  ? h('span', { class: 'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border whitespace-nowrap bg-blue-50 text-blue-600 border-blue-200' }, 'Notation Added')
                  : null,
              ]),
              h('div', { class: 'text-xs font-bold text-slate-400 flex items-center gap-1.5 shrink-0' }, [
                h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-4 w-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
                  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }),
                ]),
                `Submitted: ${props.ticket.date}`,
              ]),
            ]),

            // Info grid
            h('div', { class: 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 bg-slate-50/80 p-4 sm:p-5 rounded-xl border border-slate-100' }, [
              h('div', { class: 'min-w-0' }, [
                h('p', { class: 'text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1' }, 'Ticket ID'),
                h('p', { class: 'text-sm font-black text-rose-600 break-words' }, props.ticket.ticketId),
              ]),
              h('div', { class: 'min-w-0' }, [
                h('p', { class: 'text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1' }, 'Reported By'),
                h('p', { class: 'text-sm font-semibold text-slate-700 break-words' }, props.ticket.requestedBy),
              ]),
              h('div', { class: 'col-span-1 sm:col-span-2 min-w-0' }, [
                h('p', { class: 'text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1' }, 'Particulars / Incident Summary'),
                h('p', { class: 'text-sm text-slate-600 font-medium leading-relaxed break-words' }, props.ticket.description),
              ]),
              // Attachments
              ...(props.ticket.attachments?.length > 0 ? [
                h('div', { class: 'col-span-1 sm:col-span-2 mt-1 min-w-0' }, [
                  h('p', { class: 'text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2' }, 'Evidence / Attachments'),
                  h('div', { class: 'flex flex-wrap gap-2' }, props.ticket.attachments.map((file, idx) =>
                    h('div', {
                      key: idx,
                      onClick: () => emit('download-attachment', file),
                      class: 'flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:border-rose-400 hover:text-rose-600 cursor-pointer transition-colors shadow-sm max-w-full',
                    }, [
                      h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-4 w-4 text-rose-500 shrink-0', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
                        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13' }),
                      ]),
                      h('span', { class: 'truncate' }, file.file_name || 'Attachment'),
                    ])
                  )),
                ]),
              ] : []),

              // Existing notation display (if already has one)
              ...(hasNotation.value ? [
                h('div', { class: 'col-span-1 sm:col-span-2 mt-1 min-w-0' }, [
                  h('div', { class: 'p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2 sm:gap-3' }, [
                    h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-4 w-4 sm:h-5 sm:w-5 text-blue-500 shrink-0 mt-0.5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
                      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' }),
                    ]),
                    h('div', { class: 'min-w-0' }, [
                      h('p', { class: 'text-[10px] font-black text-blue-600 uppercase tracking-widest mb-0.5 break-words' }, 'Current Notation / Recommendation'),
                      h('p', { class: 'text-xs text-blue-800 font-medium leading-relaxed italic break-words' }, `"${props.ticket.notation}"`),
                    ]),
                  ]),
                ]),
              ] : []),
            ]),
          ]),
        ]),

        // Right: Action buttons
        h('div', { class: 'flex flex-col gap-2 shrink-0 pt-2 min-w-[220px]' }, [

          // 1. Set to Under Investigation (toggle)
          h('button', {
            onClick: () => emit('investigate', props.ticket),
            class: `w-full px-5 py-3 text-xs font-black uppercase tracking-[0.15em] rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 border ${
              isInvestigating.value
                ? 'bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-600/20 hover:bg-violet-700'
                : 'bg-white text-violet-700 border-violet-300 hover:bg-violet-50'
            }`,
          }, [
            h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-4 w-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
              h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 10V3L4 14h7v7l9-11h-7z' }),
            ]),
            isInvestigating.value ? 'Under Investigation ✓' : 'Set to Under Investigation',
          ]),

          // 2. Add / Update Notation
          h('button', {
            onClick: () => emit('notation', props.ticket),
            class: 'w-full px-5 py-3 text-xs font-black uppercase tracking-[0.15em] rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 border bg-white text-blue-700 border-blue-300 hover:bg-blue-50',
          }, [
            h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-4 w-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
              h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' }),
            ]),
            hasNotation.value ? 'Update Notation' : 'Add Recommendation / Notation',
          ]),

          // 3. Mark as Resolved — only available when notation exists
          hasNotation.value
            ? h('button', {
                onClick: () => emit('resolve', props.ticket),
                class: 'w-full px-5 py-3 text-xs font-black uppercase tracking-[0.15em] rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500',
              }, [
                h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-4 w-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
                  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }),
                ]),
                'Mark as Resolved',
              ])
            : h('div', {
                class: 'w-full px-5 py-3 text-xs font-bold text-slate-400 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50',
              }, 'Add notation to enable resolve'),

          // 4. Dismiss Report
          h('button', {
            onClick: () => emit('dismiss', props.ticket),
            class: 'w-full px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 bg-white text-rose-600 border border-rose-200 hover:bg-rose-50',
          }, [
            h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-4 w-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
              h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M6 18L18 6M6 6l12 12' }),
            ]),
            'Dismiss Report',
          ]),
        ]),
      ]),
    ]);
  },
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
