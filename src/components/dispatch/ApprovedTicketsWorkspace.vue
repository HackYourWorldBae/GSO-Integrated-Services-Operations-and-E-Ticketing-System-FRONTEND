<template>
  <div class="space-y-6 pb-12 px-4 sm:px-6 lg:px-8 py-6 max-w-[1750px] mx-auto min-h-screen">
    
    <!-- ═══ Filter & Search Controls ═══ -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <!-- Search Input -->
        <div class="relative flex-1 max-w-lg">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search ticket #, title, service type, requester, location..."
            class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 bg-slate-50/60 transition-all placeholder:text-slate-400"
          />
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 absolute left-3 top-3 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded-md"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
          <!-- Urgency Filter Pills -->
          <div class="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/60 text-xs font-bold">
            <button
              type="button"
              @click="urgencyFilter = 'all'"
              :class="['px-3 py-1 rounded-lg transition-all cursor-pointer', urgencyFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-500 hover:text-slate-800']"
            >
              All ({{ tickets.length }})
            </button>
            <button
              type="button"
              @click="urgencyFilter = 'emergency'"
              :class="['px-3 py-1 rounded-lg transition-all cursor-pointer', urgencyFilter === 'emergency' ? 'bg-rose-600 text-white shadow-xs font-black' : 'text-rose-600 hover:bg-rose-50']"
            >
              Emergency ({{ emergencyCount }})
            </button>
            <button
              type="button"
              @click="urgencyFilter = 'standard'"
              :class="['px-3 py-1 rounded-lg transition-all cursor-pointer', urgencyFilter === 'standard' ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-500 hover:text-slate-800']"
            >
              Standard
            </button>
          </div>

          <!-- Refresh Button -->
          <button
            type="button"
            @click="fetchApprovedTickets"
            :disabled="loading"
            class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer active:scale-95 disabled:opacity-50"
            title="Refresh approved ticket list"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              :class="{ 'animate-spin': loading }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Service Category Pills (if multiple available) -->
      <div v-if="uniqueServices.length > 1" class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pt-1 text-xs">
        <button
          type="button"
          @click="serviceFilter = 'all'"
          :class="['px-3 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap', serviceFilter === 'all' ? 'bg-slate-800 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
        >
          All Services
        </button>
        <button
          v-for="svc in uniqueServices"
          :key="svc"
          type="button"
          @click="serviceFilter = svc"
          :class="['px-3 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap', serviceFilter === svc ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
        >
          {{ svc }}
        </button>
      </div>
    </div>

    <!-- ═══ 3. Approved Tickets Directory ═══ -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      
      <!-- Loading State -->
      <div v-if="loading" class="py-24 text-center text-slate-400 space-y-3">
        <div class="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p class="text-xs font-bold">Loading approved tickets...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredTickets.length === 0" class="py-24 px-4 text-center">
        <div class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h4 class="text-base font-bold text-slate-800">No Approved Tickets Pending Assignment</h4>
        <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          All approved service requests have been dispatched to technicians. Newly approved requests will appear here automatically.
        </p>
      </div>

      <!-- Desktop Table View -->
      <div v-else class="hidden lg:block overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-black uppercase tracking-wider text-slate-500">
              <th class="py-3.5 px-6">Ticket Reference</th>
              <th class="py-3.5 px-4">Service &amp; Job Description</th>
              <th class="py-3.5 px-4">Requester</th>
              <th class="py-3.5 px-4">Location</th>
              <th class="py-3.5 px-4">Submitted Date</th>
              <th class="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs">
            <tr
              v-for="ticket in filteredTickets"
              :key="ticket.id"
              class="hover:bg-slate-50/70 transition-colors group"
            >
              <!-- Ticket Reference & Urgency -->
              <td class="py-4 px-6 align-top">
                <div class="flex items-center gap-2">
                  <span class="font-black text-slate-900 tabular-nums">#{{ ticket.id }}</span>
                  <span
                    v-if="ticket.is_emergency"
                    class="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-wider"
                  >
                    Emergency
                  </span>
                </div>
                <span class="inline-block mt-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200/60">
                  Approved
                </span>
              </td>

              <!-- Service & Job Description -->
              <td class="py-4 px-4 align-top max-w-md">
                <div class="font-black text-slate-900 text-sm leading-tight">
                  {{ ticket.service || ticket.type }}
                </div>
                <p class="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                  {{ ticket.job_description || 'No detailed scope description provided.' }}
                </p>
                <div v-if="ticket.attachments && ticket.attachments.length > 0" class="flex items-center gap-1 mt-1.5 text-[11px] text-slate-400 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span>{{ ticket.attachments.length }} attachment{{ ticket.attachments.length > 1 ? 's' : '' }}</span>
                </div>
              </td>

              <!-- Requester -->
              <td class="py-4 px-4 align-top">
                <div class="font-bold text-slate-800">{{ ticket.requester }}</div>
                <div v-if="ticket.contact_number && ticket.contact_number !== 'N/A'" class="text-[11px] text-slate-400 mt-0.5">
                  {{ ticket.contact_number }}
                </div>
              </td>

              <!-- Location -->
              <td class="py-4 px-4 align-top">
                <div class="font-bold text-slate-800">{{ ticket.location || ticket.college_building }}</div>
                <div v-if="ticket.office_room" class="text-[11px] text-slate-400 mt-0.5">
                  Room: {{ ticket.office_room }}
                </div>
              </td>

              <!-- Date Submitted -->
              <td class="py-4 px-4 align-top text-slate-500 font-medium whitespace-nowrap">
                {{ ticket.submittedAt }}
              </td>

              <!-- Actions -->
              <td class="py-4 px-6 align-top text-right">
                <div class="flex items-center justify-end gap-2">
                  <!-- Review Scope Button -->
                  <button
                    type="button"
                    @click="openTicketScopeModal(ticket)"
                    class="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    View Scope
                  </button>

                  <!-- Assign Workers CTA -->
                  <router-link
                    :to="`${assignRoute}?ticket=${ticket.id}`"
                    class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Assign Workers</span>
                  </router-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile & Tablet Cards View -->
      <div class="lg:hidden divide-y divide-slate-100">
        <div
          v-for="ticket in filteredTickets"
          :key="'mob-' + ticket.id"
          class="p-4 sm:p-5 space-y-3"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/80">
                #{{ ticket.id }}
              </span>
              <span
                v-if="ticket.is_emergency"
                class="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-wider"
              >
                Emergency
              </span>
            </div>
            <span class="text-xs text-slate-400 font-medium">{{ ticket.submittedAt }}</span>
          </div>

          <div>
            <h4 class="text-sm font-black text-slate-900 leading-snug">
              {{ ticket.service || ticket.type }}
            </h4>
            <p class="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {{ ticket.job_description || 'No detailed scope description provided.' }}
            </p>
          </div>

          <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
            <div class="flex items-center justify-between text-slate-600">
              <span class="text-slate-400 font-bold text-[11px]">Requester:</span>
              <span class="font-bold text-slate-800">{{ ticket.requester }}</span>
            </div>
            <div class="flex items-center justify-between text-slate-600">
              <span class="text-slate-400 font-bold text-[11px]">Location:</span>
              <span class="font-bold text-slate-800">
                {{ ticket.location || ticket.college_building }}
                <span v-if="ticket.office_room">({{ ticket.office_room }})</span>
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2 pt-1">
            <button
              type="button"
              @click="openTicketScopeModal(ticket)"
              class="flex-1 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors text-center"
            >
              View Scope
            </button>
            <router-link
              :to="`${assignRoute}?ticket=${ticket.id}`"
              class="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-colors text-center shadow-xs inline-flex items-center justify-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Assign Workers</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ 4. Ticket Scope & Attachments Modal ═══ -->
    <div
      v-if="scopeModalTicket"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      @click.self="scopeModalTicket = null"
    >
      <div class="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        
        <!-- Modal Header -->
        <div class="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="h-10 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <span class="text-sm font-black text-emerald-700">#{{ scopeModalTicket.id }}</span>
            </div>
            <div>
              <h3 class="text-base sm:text-lg font-black text-slate-900">
                {{ scopeModalTicket.service || scopeModalTicket.type }}
              </h3>
              <p class="text-xs text-slate-400 font-medium">Service Scope &amp; Evidence Files</p>
            </div>
          </div>
          <button
            @click="scopeModalTicket = null"
            class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-5 sm:p-6 overflow-y-auto space-y-4 custom-scrollbar text-xs">
          <!-- Key Details Grid -->
          <div class="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <span class="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Requester</span>
              <span class="font-black text-slate-900">{{ scopeModalTicket.requester }}</span>
            </div>
            <div>
              <span class="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Contact</span>
              <span class="font-black text-slate-900">{{ scopeModalTicket.contact_number || 'N/A' }}</span>
            </div>
            <div>
              <span class="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Location / Building</span>
              <span class="font-black text-slate-900">{{ scopeModalTicket.location || scopeModalTicket.college_building }}</span>
            </div>
            <div>
              <span class="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Room / Area</span>
              <span class="font-black text-slate-900">{{ scopeModalTicket.office_room || 'N/A' }}</span>
            </div>
          </div>

          <!-- Description / Scope -->
          <div>
            <h4 class="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Job Description &amp; Scope</h4>
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-700 leading-relaxed whitespace-pre-wrap">
              {{ scopeModalTicket.job_description || 'No detailed scope notes provided by client.' }}
            </div>
          </div>

          <!-- Attachments -->
          <div>
            <h4 class="text-xs font-black text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Attached Proof &amp; Documentation</span>
              <span class="text-slate-400 font-bold">{{ (scopeModalTicket.attachments || []).length }} file(s)</span>
            </h4>

            <div v-if="!scopeModalTicket.attachments || scopeModalTicket.attachments.length === 0" class="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-slate-400">
              No files or images attached to this ticket.
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div
                v-for="att in scopeModalTicket.attachments"
                :key="att.id"
                class="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition-all flex items-center justify-between gap-2"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span class="font-bold text-slate-800 truncate text-xs">{{ att.file_name || 'Document' }}</span>
                </div>
                <button
                  type="button"
                  @click="downloadAttachment(att)"
                  class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold shrink-0 transition-colors"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            @click="scopeModalTicket = null"
            class="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 font-bold transition-colors"
          >
            Close
          </button>

          <router-link
            :to="`${assignRoute}?ticket=${scopeModalTicket.id}`"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black transition-all shadow-xs active:scale-95"
          >
            <span>Proceed to Assign Workers</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </router-link>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/api/client';
import { toast } from 'vue3-toastify';

const props = defineProps({
  unitCode: {
    type: String,
    required: true
  },
  assignRoute: {
    type: String,
    required: true
  },
  store: {
    type: Object,
    required: true
  }
});

const loading = ref(false);
const tickets = ref([]);
const searchQuery = ref('');
const urgencyFilter = ref('all');
const serviceFilter = ref('all');
const scopeModalTicket = ref(null);

const emergencyCount = computed(() => {
  return tickets.value.filter(t => t.is_emergency).length;
});

const availableWorkersCount = computed(() => {
  return (props.store?.personnel || []).filter(w => w.status === 'Available').length;
});

const uniqueServices = computed(() => {
  const set = new Set();
  tickets.value.forEach(t => {
    if (t.service) set.add(t.service);
    else if (t.type) set.add(t.type);
  });
  return Array.from(set);
});

const filteredTickets = computed(() => {
  let list = tickets.value;

  if (urgencyFilter.value === 'emergency') {
    list = list.filter(t => t.is_emergency);
  } else if (urgencyFilter.value === 'standard') {
    list = list.filter(t => !t.is_emergency);
  }

  if (serviceFilter.value !== 'all') {
    list = list.filter(t => (t.service || t.type) === serviceFilter.value);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(t =>
      String(t.id).includes(q) ||
      (t.title && t.title.toLowerCase().includes(q)) ||
      (t.service && t.service.toLowerCase().includes(q)) ||
      (t.type && t.type.toLowerCase().includes(q)) ||
      (t.requester && t.requester.toLowerCase().includes(q)) ||
      (t.location && t.location.toLowerCase().includes(q)) ||
      (t.college_building && t.college_building.toLowerCase().includes(q)) ||
      (t.office_room && t.office_room.toLowerCase().includes(q)) ||
      (t.job_description && t.job_description.toLowerCase().includes(q))
    );
  }

  return list;
});

const fetchApprovedTickets = async () => {
  loading.value = true;
  try {
    const res = await api.get(`tickets/dispatch/${props.unitCode}`);
    const rawData = res.data?.data?.tickets || res.data?.data || [];
    if (Array.isArray(rawData)) {
      tickets.value = rawData.map(t => ({
        id: t.id,
        title: t.title,
        service: t.service_type,
        type: t.title || t.project_title || t.service_type || t.type || 'Service Request',
        location: t.location || t.college_building || 'Campus Facility',
        college_building: t.details?.college_building || t.college_building || t.location,
        office_room: t.details?.office_room || t.office_room,
        source_of_fund: t.details?.source_of_fund || 'N/A',
        contact_number: t.details?.contact_number || 'N/A',
        requester: t.details?.requesting_personnel || t.requester || (t.user ? `${t.user.first_name} ${t.user.last_name}` : 'End User'),
        status: t.status,
        is_emergency: !!(t.is_emergency || t.urgency === 'High' || t.urgency === 'Emergency'),
        job_description: t.description || t.job_description || '',
        attachments: t.attachments || [],
        submitted_at: t.submitted_at || t.created_at,
        submittedAt: new Date(t.submitted_at || t.created_at).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        })
      }));
    }
  } catch (err) {
    console.error(`Failed to load ${props.unitCode} approved tickets:`, err);
    toast.error('Failed to load approved ticket list.');
  } finally {
    loading.value = false;
  }
};

const openTicketScopeModal = (ticket) => {
  scopeModalTicket.value = ticket;
};

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

onMounted(async () => {
  if (props.store?.fetchPersonnel) {
    await props.store.fetchPersonnel();
  }
  await fetchApprovedTickets();
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
</style>
