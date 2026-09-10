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
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">Completed Tickets Archives</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">SSU Archiving</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-6 animate-fade-in relative pb-12">
        <!-- Search and Filters -->
        <div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div class="flex-1 w-full relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input v-model="searchQuery" type="text" placeholder="Search Full Ticket Number (e.g. SSU-TIC-10-2026)" class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
          </div>
          <div class="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto">
            <select v-model="yearFilter" @change="applyFilter" class="w-full md:w-36 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer">
              <option value="all">All Years</option>
              <option v-for="yr in availableYears" :key="yr" :value="yr">
                Year {{ yr }}
              </option>
            </select>
            <select v-model="serviceFilter" @change="applyFilter" class="w-full md:w-48 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer">
              <option value="">All Services</option>
              <option value="Incident Report">Incident Report</option>
            </select>
            <button @click="applyFilter" class="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all text-sm whitespace-nowrap cursor-pointer active:scale-95">
              Filter
            </button>
            <button
              @click="showExportModal = true"
              type="button"
              class="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-all text-sm whitespace-nowrap flex items-center gap-2 cursor-pointer shrink-0"
              title="Export Yearly Archives (.ZIP)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export Archives (.ZIP)</span>
            </button>
          </div>
        </div>

        <!-- Tickets List (Data Table) -->
        <div class="rounded-[2.5rem] bg-white border border-slate-200 p-8 overflow-hidden shadow-sm mt-6">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-separate border-spacing-y-4 min-w-[800px]">
              <thead>
                <tr class="border-b border-slate-100">
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6">Ticket ID</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Service</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Requester</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Status</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Completed</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ticket in paginatedTickets" :key="ticket.id" class="group transition-all duration-200">
                  <td class="py-5 px-6 bg-slate-50/60 border-y border-l border-slate-200 rounded-l-2xl group-hover:bg-white group-hover:border-emerald-500 group-hover:shadow-md transition-all">
                    <span class="text-sm font-black text-slate-900">#{{ ticket.ticketId }}</span>
                  </td>
                  <td class="py-5 px-4 bg-slate-50/60 border-y border-slate-200 group-hover:bg-white group-hover:border-emerald-500 transition-all">
                    <div class="truncate max-w-[150px] sm:max-w-xs text-sm font-bold text-slate-900" :title="ticket.title || ticket.service">{{ ticket.title || ticket.service }}</div>
                  </td>
                  <td class="py-5 px-4 bg-slate-50/60 border-y border-slate-200 group-hover:bg-white group-hover:border-emerald-500 transition-all">
                    <span class="text-sm font-bold text-slate-700">{{ ticket.requestedBy }}</span>
                  </td>
                  <td class="py-5 px-4 bg-slate-50/60 border-y border-slate-200 group-hover:bg-white group-hover:border-emerald-500 transition-all">
                    <span :class="['px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border whitespace-nowrap', (ticket.status === 'declined' || ticket.status === 'rejected') ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200']">
                      {{ ticket.statusLabel }}
                    </span>
                  </td>
                  <td class="py-5 px-4 bg-slate-50/60 border-y border-slate-200 group-hover:bg-white group-hover:border-emerald-500 transition-all">
                    <span class="text-xs font-bold text-slate-500">{{ ticket.date }}</span>
                  </td>
                  <td class="py-5 px-6 bg-slate-50/60 border-y border-r border-slate-200 rounded-r-2xl group-hover:bg-white group-hover:border-emerald-500 group-hover:shadow-md transition-all text-right">
                    <button @click="viewDetails(ticket)" class="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-sm active:scale-95 inline-flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Details
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredTickets.length === 0">
                  <td colspan="6" class="p-12 text-center bg-slate-50 border border-slate-200 rounded-[2rem]">
                    <div class="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <h3 class="text-lg font-black text-slate-900 mb-1">No Archived Tickets Found</h3>
                    <p class="text-sm text-slate-500 font-medium">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Toolbar -->
          <div v-if="filteredTickets.length > 0" class="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3 text-xs text-slate-500">
              <span>Rows per page:</span>
              <select
                v-model="perPage"
                @change="currentPage = 1"
                class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold focus:outline-none focus:border-emerald-500"
              >
                <option :value="10">10</option>
                <option :value="15">15</option>
                <option :value="25">25</option>
                <option :value="50">50</option>
              </select>
              <span>
                Showing <strong class="text-slate-800">{{ ((currentPage - 1) * perPage) + 1 }}</strong> to
                <strong class="text-slate-800">{{ Math.min(currentPage * perPage, filteredTickets.length) }}</strong> of
                <strong class="text-slate-800">{{ filteredTickets.length }}</strong> tickets
              </span>
            </div>

            <!-- Page Buttons -->
            <div class="flex items-center gap-1.5">
              <button
                @click="currentPage = 1"
                :disabled="currentPage === 1"
                class="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-bold"
                title="First page"
              >
                «
              </button>
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-bold flex items-center gap-1"
              >
                ‹ Prev
              </button>

              <template v-for="(page, idx) in displayedPages" :key="idx">
                <span v-if="page === '...'" class="px-2 text-slate-400 font-bold text-xs">...</span>
                <button
                  v-else
                  @click="currentPage = page"
                  :class="[
                    'w-8 h-8 rounded-xl text-xs font-black transition-all',
                    currentPage === page
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                  ]"
                >
                  {{ page }}
                </button>
              </template>

              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-bold flex items-center gap-1"
              >
                Next ›
              </button>
              <button
                @click="currentPage = totalPages"
                :disabled="currentPage === totalPages"
                class="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-bold"
                title="Last page"
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #modal-overlay>
      <!-- Bulk Yearly Archives Export Modal -->
      <BulkArchiveExportModal
        v-model:isOpen="showExportModal"
        :tickets="tickets"
        unitCode="SSU"
        :initialYear="yearFilter"
      />
      <!-- Read-Only Ticket Details Modal -->
      <div v-if="showDetailsModal && selectedTicket" class="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in pointer-events-auto" @click.self="closeDetailsModal">
        <div class="bg-white rounded-[2rem] p-8 max-w-2xl w-full shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-black text-slate-900">Archived Ticket Details</h3>
            <button @click="closeDetailsModal" class="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full transition-colors active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="space-y-6">
            <div class="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <div>
                <p class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Status</p>
                <p class="text-lg font-black text-emerald-700">{{ selectedTicket.statusLabel }}</p>
              </div>
              <div class="text-right">
                <p class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Completed Date</p>
                <p class="text-sm font-bold text-emerald-700">{{ selectedTicket.date }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Ticket ID</p>
                <p class="text-base font-semibold text-slate-900">{{ selectedTicket.ticketId }}</p>
              </div>
              <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Requested By</p>
                <p class="text-base font-semibold text-slate-900">{{ selectedTicket.requestedBy }}</p>
              </div>
              <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Service Type</p>
                <p class="text-base font-semibold text-slate-900">{{ selectedTicket.title || selectedTicket.service }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description / Report</p>
                <div class="p-4 bg-white border border-slate-200 rounded-xl">
                  <p class="text-sm font-medium text-slate-700 leading-relaxed">{{ selectedTicket.description }}</p>
                </div>
              </div>
              
              <!-- Attachments / Photos -->
              <div v-if="selectedTicket.attachments && selectedTicket.attachments.length > 0" class="col-span-2 mt-2">
                 <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Attachments / Photos</p>
                 <div class="flex flex-col gap-2">
                   <a v-for="att in selectedTicket.attachments" :key="att.id" @click.prevent="downloadAttachment(att)" class="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-emerald-500 transition-colors shadow-sm cursor-pointer group">
                     <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                       </svg>
                     </div>
                     <div class="flex flex-col overflow-hidden">
                        <span class="text-xs font-bold text-slate-700 truncate group-hover:text-emerald-700 transition-colors">{{ att.file_name || 'Attachment' }}</span>
                        <span class="text-[10px] font-bold text-slate-400 uppercase">{{ att.file_size_bytes ? (att.file_size_bytes / 1024).toFixed(1) + ' KB' : 'Unknown Size' }}</span>
                     </div>
                   </a>
                 </div>
              </div>
            </div>

            <!-- Read Only Notice -->
            <div class="p-4 bg-slate-100 rounded-xl border border-slate-200 flex items-center gap-3 text-slate-500">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <p class="text-xs font-semibold">This ticket is archived and viewable in read-only mode for record-keeping purposes.</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Image Viewer Modal -->
      <div v-if="showImageModal" class="absolute inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in pointer-events-auto" @click.self="closeImageModal">
        <div class="relative bg-white rounded-2xl p-2 max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
          <button @click="closeImageModal" class="absolute -top-4 -right-4 bg-white text-slate-500 hover:text-slate-700 p-2 rounded-full shadow-lg transition-colors z-10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div class="overflow-auto rounded-xl flex items-center justify-center bg-slate-100 min-h-[200px] min-w-[200px]">
            <img :src="selectedImageUrl" alt="Attachment Preview" class="max-w-full max-h-[85vh] object-contain rounded-xl" />
          </div>
        </div>
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import BulkArchiveExportModal from '@/components/BulkArchiveExportModal.vue';
import { getTicketYear, getAvailableYearsFromTickets } from '@/utils/archiveBulkExporter';
import api from '@/api/client';

const route = useRoute();
const tickets = ref([]);
const showExportModal = ref(false);

const showImageModal = ref(false);
const selectedImageUrl = ref('');

const closeImageModal = () => {
  showImageModal.value = false;
  if (selectedImageUrl.value) {
    window.URL.revokeObjectURL(selectedImageUrl.value);
    selectedImageUrl.value = '';
  }
};

const downloadAttachment = async (att) => {
  try {
    const response = await api.get(`attachments/${att.id}`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: att.file_type || 'application/octet-stream' }));
    if (att.file_type && att.file_type.startsWith('image/')) {
        selectedImageUrl.value = url;
        showImageModal.value = true;
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
    alert(`Failed to download attachment: ${error.response?.data?.message || error.message}`);
  }
};

const fetchArchives = async () => {
  try {
    const response = await api.get('tickets/archives/SSU');
    if (response.data?.data?.tickets) {
      tickets.value = response.data.data.tickets.map(t => ({
        id: t.id,
        ticketId: t.id,
        title: t.title,
        service: t.service_type,
        service_type: t.service_type,
        description: t.description,
        date: new Date(t.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        submitted_at: t.submitted_at,
        completed_at: t.completed_at || t.updated_at,
        requestedBy: t.details?.reported_by || t.details?.end_user || t.requested_by || 'End User',
        status: t.status,
        statusLabel: t.status_label,
        declineReason: t.decline_reason || '',
        location: t.location || t.details?.location || 'N/A',
        office_room: t.office_room || t.details?.office_room || 'N/A',
        attachments: t.attachments || [],
        assignedWorker: t.assignments?.[0]?.assigned_to_name || t.assignedWorker || 'Unassigned',
        ssu_notation: t.ssu_notation || t.notation || t.details?.notation || '',
        details: t.details || null,
        materials: [] // SSU has no materials
      }));
      checkRouteQueryTicket();
    }
  } catch (error) {
    console.error('Failed to fetch SSU archives:', error);
  }
};

const checkRouteQueryTicket = () => {
  const targetId = route.query.ticketId || route.query.highlight;
  if (!targetId || tickets.value.length === 0) return;
  const match = tickets.value.find(t => String(t.id || t.ticketId).toLowerCase() === String(targetId).toLowerCase());
  if (match) {
    searchQuery.value = String(targetId);
    applyFilter();
    viewDetails(match);
  }
};

watch(() => route.query.ticketId, () => {
  checkRouteQueryTicket();
});

onMounted(() => {
  fetchArchives();
});

const searchQuery = ref('');
const serviceFilter = ref('');
const yearFilter = ref('all');
const activeSearchQuery = ref('');
const activeServiceFilter = ref('');
const activeYearFilter = ref('all');

// Pagination state
const currentPage = ref(1);
const perPage = ref(15);

const showDetailsModal = ref(false);
const selectedTicket = ref(null);

const availableYears = computed(() => {
  return getAvailableYearsFromTickets(tickets.value);
});

const applyFilter = () => {
  activeSearchQuery.value = searchQuery.value.trim().toLowerCase();
  activeServiceFilter.value = serviceFilter.value;
  activeYearFilter.value = yearFilter.value;
  currentPage.value = 1;
};

const filteredTickets = computed(() => {
  return tickets.value.filter(ticket => {
    let match = true;
    
    if (activeSearchQuery.value) {
      match = match && ticket.ticketId.toLowerCase().includes(activeSearchQuery.value);
    }
    
    if (activeServiceFilter.value) {
      match = match && ticket.service === activeServiceFilter.value;
    }

    if (activeYearFilter.value && activeYearFilter.value !== 'all') {
      const y = getTicketYear(ticket);
      match = match && (y === String(activeYearFilter.value));
    }
    
    return match;
  });
});

const totalPages = computed(() => Math.ceil(filteredTickets.value.length / perPage.value) || 1);

const paginatedTickets = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return filteredTickets.value.slice(start, start + perPage.value);
});

const displayedPages = computed(() => {
  const current = currentPage.value;
  const total = totalPages.value;
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = [];
  pages.push(1);
  if (current > 3) pages.push('...');
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
});

const viewDetails = (ticket) => {
  selectedTicket.value = ticket;
  showDetailsModal.value = true;
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedTicket.value = null;
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.2);
  border-radius: 10px;
}
</style>
