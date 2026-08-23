<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/admin/tasu" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        <span class="text">TASU Home</span>
      </router-link>
      <router-link to="/admin/tasu/vehicles" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
        <span class="text">Vehicle Management</span>
      </router-link>
      <router-link to="/admin/tasu/queues" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span class="text">Ticket Queues</span>
      </router-link>
      <router-link to="/admin/tasu/personnel" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span class="text">Personnel Management</span>
      </router-link>
      <router-link to="/admin/tasu/dispatch" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="text">Dispatch Board</span>
      </router-link>
      <div class="mt-8 mb-4 px-4">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Archived Tickets</p>
      </div>
      <router-link to="/admin/tasu/archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span class="text">Archives</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">Ticket Queues</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">TASU Booking Approval Queue</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-6 animate-fade-in relative pb-12">

        <!-- Analytics Summary -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="p-5 rounded-[1.75rem] bg-white border border-slate-100 shadow-md hover:shadow-xl transition-all flex items-center gap-4">
            <div class="p-3 rounded-2xl bg-amber-50 text-amber-500 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Pending</p>
              <p class="text-3xl font-black text-slate-900 tabular-nums leading-none">{{ pendingCount }}</p>
              <p class="text-[10px] font-semibold text-slate-400 mt-0.5">Awaiting approval</p>
            </div>
          </div>

          <div class="p-5 rounded-[1.75rem] bg-white border border-slate-100 shadow-md hover:shadow-xl transition-all flex items-center gap-4">
            <div class="p-3 rounded-2xl bg-blue-50 text-blue-500 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Dispatched & Scheduled</p>
              <p class="text-3xl font-black text-slate-900 tabular-nums leading-none">{{ scheduledCount }}</p>
              <p class="text-[10px] font-semibold text-slate-400 mt-0.5">Approved & queued</p>
            </div>
          </div>

          <div class="p-5 rounded-[1.75rem] bg-white border border-slate-100 shadow-md hover:shadow-xl transition-all flex items-center gap-4">
            <div class="p-3 rounded-2xl bg-blue-50 text-blue-600 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active Dispatches</p>
              <p class="text-3xl font-black text-slate-900 tabular-nums leading-none">{{ activeCount }}</p>
              <p class="text-[10px] font-semibold text-slate-400 mt-0.5">Currently in progress</p>
            </div>
          </div>

          <div class="p-5 rounded-[1.75rem] bg-white border border-slate-100 shadow-md hover:shadow-xl transition-all flex items-center gap-4">
            <div class="p-3 rounded-2xl bg-slate-100 text-slate-500 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Completed</p>
              <p class="text-3xl font-black text-slate-900 tabular-nums leading-none">{{ completedCount }}</p>
              <p class="text-[10px] font-semibold text-slate-400 mt-0.5">Successfully resolved</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <div v-for="ticket in tickets" :key="ticket.id" class="group relative overflow-hidden bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all">
            <div class="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
              <div class="flex items-start gap-5 flex-1">
                <div class="p-4 rounded-2xl shrink-0 bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <div class="space-y-3 w-full">
                  <div class="flex items-center justify-between w-full">
                    <div class="flex items-center gap-3">
                      <h3 class="text-lg font-black text-slate-900 truncate max-w-[200px] sm:max-w-xs" :title="ticket.title || ticket.service">{{ ticket.title || ticket.service }}</h3>
                      <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-amber-50 text-amber-600 border-amber-200">
                        {{ ticket.statusLabel }}
                      </span>
                    </div>
                    <div class="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Submitted: {{ ticket.date }}
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ticket ID</p>
                      <p class="text-sm font-semibold text-slate-700">{{ ticket.ticketId }}</p>
                    </div>
                    <div>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Requested By</p>
                      <p class="text-sm font-semibold text-slate-700">{{ ticket.requestedBy }}</p>
                    </div>

                    <div>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Destination</p>
                      <p class="text-xs font-bold text-slate-700">{{ ticket.destination }}</p>
                    </div>
                    <div>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Passenger Count</p>
                      <p class="text-xs font-bold text-slate-700">{{ ticket.passengers }} Persons</p>
                    </div>

                    <div class="col-span-2">
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Travel Particulars</p>
                      <p class="text-sm text-slate-600 font-medium leading-relaxed">{{ ticket.description }}</p>
                    </div>
                    
                    <div class="col-span-2 mt-1" v-if="ticket.attachments && ticket.attachments.length > 0">
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Attachments (Approval Slips/Requests)</p>
                      <div class="flex flex-wrap gap-2">
                        <div v-for="(file, index) in ticket.attachments" :key="index" @click="downloadAttachment(file)" class="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:border-emerald-400 hover:text-emerald-600 cursor-pointer transition-colors shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          {{ file.file_name || 'Attachment' }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="flex flex-col items-center gap-3 shrink-0 pt-2 min-w-[200px]">
                <button @click="initiateApproval(ticket)" class="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Approve Booking
                </button>
                
                <button @click="toggleDeclineMode(ticket)" :class="['w-full px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95', ticket.isDeclining ? 'bg-rose-100 text-rose-600' : 'bg-rose-600 text-white hover:bg-rose-500']">
                  {{ ticket.isDeclining ? 'Cancel Decline' : 'Decline Request' }}
                </button>
              </div>
            </div>

            <!-- Decline Note Editor -->
            <div v-if="ticket.isDeclining" class="mt-6 p-6 bg-rose-50 border border-rose-100 rounded-[2rem] animate-fade-in">
               <div class="flex flex-col gap-4">
                 <div>
                   <label class="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2 block">Reason for Decline (Required)</label>
                   <textarea v-model="ticket.declineReason" rows="3" class="w-full p-4 rounded-2xl border border-rose-100 bg-white text-sm font-medium text-slate-700 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none resize-none" placeholder="Explain why this request is being declined..."></textarea>
                 </div>
                 <div class="flex justify-end gap-3">
                   <button @click="ticket.isDeclining = false" class="px-5 py-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Dismiss</button>
                   <button :disabled="!ticket.declineReason" @click="rejectTicket(ticket)" class="px-8 py-3 bg-rose-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-rose-600/20 hover:bg-rose-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">Confirm Rejection</button>
                 </div>
               </div>
            </div>
          </div>
          
          <div v-if="tickets.length === 0" class="p-12 text-center bg-slate-50 border border-slate-200 rounded-[2rem]">
            <div class="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-lg font-black text-slate-900 mb-1">No Pending Bookings</h3>
            <p class="text-sm text-slate-500 font-medium">All vehicle requests have been approved or processed.</p>
          </div>
        </div>
      </div>

      <!-- Custom Confirm Modal -->
      <div v-if="showConfirmModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl transform transition-all">
          <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-2xl font-black text-slate-900 text-center mb-2">Confirm Approval</h3>
          <p class="text-slate-500 text-center font-medium mb-8">Do you want to approve this request?</p>
          <div class="flex gap-4">
            <button @click="closeConfirmModal" class="w-full px-6 py-4 bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-200 transition-all active:scale-95">
              Cancel
            </button>
            <button @click="confirmApproval" class="w-full px-6 py-4 bg-emerald-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all active:scale-95">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import { toast } from 'vue3-toastify';
import api from '@/api/client';

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
    alert('Failed to download attachment.');
  }
};

const tickets = ref([]);

const pendingCount = ref(0);
const scheduledCount = ref(0);
const activeCount = ref(0);
const completedCount = ref(0);

const fetchQueue = async () => {
  try {
    const response = await api.get('tickets/queue/TASU');
    if (response.data?.data?.tickets) {
      tickets.value = response.data.data.tickets.map(t => ({
        id: t.id,
        ticketId: t.id,
        title: t.title,
        service: t.service_type,
        description: t.description,
        date: new Date(t.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        requestedBy: 'End User', // Ideally fetched from user relation
        location: t.location,
        office_room: t.office_room,
        attachments: t.attachments || [],
        isDeclining: false,
        declineReason: ''
      }));
    }
  } catch (error) {
    console.error('Failed to fetch TASU queue:', error);
  }

  try {
    const statsResponse = await api.get('tickets/stats/TASU');
    if (statsResponse.data?.data?.stats) {
      const stats = statsResponse.data.data.stats;
      pendingCount.value = parseInt(stats.pending || 0);
      scheduledCount.value = parseInt(stats.scheduled || 0);
      activeCount.value = parseInt(stats.active_working || 0);
      completedCount.value = parseInt(stats.resolved || 0);
    }
  } catch (error) {
    console.error('Failed to fetch TASU stats:', error);
  }
};

let pollingInterval = null;

onMounted(() => {
  fetchQueue();
  // Smart polling every 5 seconds
  pollingInterval = setInterval(() => {
    const isInteracting = tickets.value.some(t => t.isDeclining);
    if (!isInteracting) {
      fetchQueue();
    }
  }, 5000);
});

onUnmounted(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
});


const showConfirmModal = ref(false);
const ticketToApprove = ref(null);

const initiateApproval = (ticket) => {
  ticketToApprove.value = ticket;
  showConfirmModal.value = true;
};

const closeConfirmModal = () => {
  showConfirmModal.value = false;
  ticketToApprove.value = null;
};

const confirmApproval = async () => {
  if (ticketToApprove.value) {
    try {
      await api.patch(`tickets/${ticketToApprove.value.id}/approve`);
      toast.success(`Approved ticket ${ticketToApprove.value.ticketId}`);
      closeConfirmModal();
      fetchQueue(); // Refresh queue
    } catch (error) {
      toast.error('Failed to approve ticket');
    }
  }
};

const toggleDeclineMode = (ticket) => {
  ticket.isDeclining = !ticket.isDeclining;
  if (ticket.isDeclining) {
    ticket.declineReason = '';
  }
};

const rejectTicket = async (ticket) => {
  if (ticket.declineReason) {
    try {
      await api.patch(`tickets/${ticket.id}/decline`, { decline_reason: ticket.declineReason });
      toast.error(`Rejected ticket ${ticket.ticketId}`);
      fetchQueue(); // Refresh queue
    } catch (error) {
      toast.error('Failed to reject ticket');
    }
  }
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
</style>
