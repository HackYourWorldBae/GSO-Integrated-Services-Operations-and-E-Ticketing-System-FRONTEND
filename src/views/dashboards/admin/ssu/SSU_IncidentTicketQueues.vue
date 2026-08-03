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
        <p class="text-[10px] text-rose-600 font-extrabold tracking-[0.2em] uppercase">SSU Priority Investigations & Security Dispatches</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in relative pb-16">

        <!-- Analytics Summary: Incident Reports -->
        <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          <div class="p-5 rounded-[1.75rem] bg-white border border-rose-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
            <div class="p-3 rounded-2xl bg-amber-50 text-amber-500 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Pending Review</p>
              <p class="text-3xl font-black text-slate-900 tabular-nums leading-none">{{ pendingCount }}</p>
              <p class="text-[10px] font-semibold text-rose-500 mt-0.5">Awaiting acknowledgement</p>
            </div>
          </div>

          <div class="p-5 rounded-[1.75rem] bg-white border border-rose-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
            <div class="p-3 rounded-2xl bg-rose-50 text-rose-600 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Under Investigation</p>
              <p class="text-3xl font-black text-slate-900 tabular-nums leading-none">{{ activeCount }}</p>
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

        <!-- Tickets List: Incident Reports -->
        <div class="grid grid-cols-1 gap-4">
          <div v-for="ticket in tickets" :key="ticket.id" class="group relative overflow-hidden bg-white border border-rose-100/80 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all">
            <div class="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
              <div class="flex items-start gap-5 flex-1">
                <div class="p-4 rounded-2xl shrink-0 bg-rose-50 text-rose-600 transition-transform group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div class="space-y-3 w-full">
                  <div class="flex flex-wrap items-center justify-between gap-2 w-full">
                    <div class="flex items-center gap-3">
                      <h4 class="text-lg font-black text-slate-900">{{ ticket.service }}</h4>
                      <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-rose-50 text-rose-600 border-rose-200">
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
                  
                  <div class="grid grid-cols-2 gap-4 bg-slate-50/80 p-4 rounded-xl border border-slate-100">
                    <div>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ticket ID</p>
                      <p class="text-sm font-black text-rose-600">{{ ticket.ticketId }}</p>
                    </div>
                    <div>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reported By</p>
                      <p class="text-sm font-semibold text-slate-700">{{ ticket.requestedBy }}</p>
                    </div>

                    <div class="col-span-2">
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Particulars / Incident Summary</p>
                      <p class="text-sm text-slate-600 font-medium leading-relaxed">{{ ticket.description }}</p>
                    </div>
                    
                    <div class="col-span-2 mt-1" v-if="ticket.attachments && ticket.attachments.length > 0">
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Evidence / Attachments</p>
                      <div class="flex flex-wrap gap-2">
                        <div v-for="(file, index) in ticket.attachments" :key="index" @click="downloadAttachment(file)" class="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:border-rose-400 hover:text-rose-600 cursor-pointer transition-colors shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <button @click="toggleAcknowledgeMode(ticket)" :class="['w-full px-6 py-3.5 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95', ticket.isAcknowledging ? 'bg-slate-700 hover:bg-slate-800 shadow-slate-700/20' : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20']">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {{ ticket.isAcknowledging ? 'Cancel Acknowledge' : 'Acknowledge & Action' }}
                </button>
                
                <button @click="toggleDeclineMode(ticket)" :class="['w-full px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95', ticket.isDeclining ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-white text-rose-600 border border-rose-200 hover:bg-rose-50']">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {{ ticket.isDeclining ? 'Cancel' : 'Dismiss Report' }}
                </button>
              </div>
            </div>

            <!-- Acknowledge Note Editor -->
            <div v-if="ticket.isAcknowledging" class="mt-6 p-6 bg-emerald-50/80 border border-emerald-100 rounded-[2rem] animate-fade-in">
               <div class="flex flex-col gap-4">
                 <div>
                   <label class="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 block">Acknowledgement Notes / Recommendations (Required)</label>
                   <textarea v-model="ticket.acknowledgeNotes" rows="3" class="w-full p-4 rounded-2xl border border-emerald-200 bg-white text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none resize-none" placeholder="Enter actions taken, recommendations, or instructions for the reporter..."></textarea>
                 </div>
                 <div class="flex justify-end gap-3">
                   <button @click="ticket.isAcknowledging = false" class="px-5 py-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
                   <button :disabled="!ticket.acknowledgeNotes || !ticket.acknowledgeNotes.trim()" @click="initiateApproval(ticket)" class="px-8 py-3 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">Proceed to Confirmation</button>
                 </div>
               </div>
            </div>

            <!-- Decline Note Editor -->
            <div v-if="ticket.isDeclining" class="mt-6 p-6 bg-rose-50/80 border border-rose-100 rounded-[2rem] animate-fade-in">
               <div class="flex flex-col gap-4">
                 <div>
                   <label class="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2 block">Reason for Dismissal (Required)</label>
                   <textarea v-model="ticket.declineReason" rows="3" class="w-full p-4 rounded-2xl border border-rose-200 bg-white text-sm font-medium text-slate-700 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none resize-none" placeholder="Explain why this incident report is being dismissed..."></textarea>
                 </div>
                 <div class="flex justify-end gap-3">
                   <button @click="ticket.isDeclining = false" class="px-5 py-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Dismiss</button>
                   <button :disabled="!ticket.declineReason" @click="rejectTicket(ticket)" class="px-8 py-3 bg-rose-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-rose-600/20 hover:bg-rose-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">Confirm Dismissal</button>
                 </div>
               </div>
            </div>
          </div>

          <div v-if="tickets.length === 0" class="p-12 text-center bg-white border border-rose-100 rounded-[2rem]">
            <div class="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 class="text-lg font-black text-slate-900 mb-1">No Pending Incident Reports</h4>
            <p class="text-sm text-slate-500 font-medium">All logged security incidents have been acknowledged and processed.</p>
          </div>
        </div>

      </div>

      <!-- Custom Confirm Modal -->
      <div v-if="showConfirmModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl transform transition-all border border-slate-100">
          <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-2xl font-black text-slate-900 text-center mb-2">Confirm Acknowledgement</h3>
          <p class="text-slate-500 text-center font-medium mb-6">Are you sure you want to acknowledge and action incident <strong class="text-slate-800">{{ ticketToApprove?.ticketId }}</strong>?</p>
          
          <div v-if="ticketToApprove?.acknowledgeNotes" class="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-8 text-left">
            <p class="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1.5">Notes / Recommendations to Reporter:</p>
            <p class="text-xs text-slate-700 font-semibold leading-relaxed italic">"{{ ticketToApprove.acknowledgeNotes }}"</p>
          </div>

          <div class="flex gap-4">
            <button @click="closeConfirmModal" class="w-full px-6 py-4 bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-200 transition-all active:scale-95">
              Cancel
            </button>
            <button @click="confirmApproval" class="w-full px-6 py-4 bg-emerald-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all active:scale-95">
              Confirm & Submit
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
const activeCount = ref(0);
const completedCount = ref(0);

const fetchQueue = async () => {
  try {
    const response = await api.get('tickets/queue/SSU');
    if (response.data?.data?.tickets) {
      const allSsu = response.data.data.tickets.filter(t => t.service_type === 'Incident Report');
      tickets.value = allSsu.map(t => ({
        id: t.id,
        ticketId: t.id,
        service: t.service_type,
        description: t.description,
        date: new Date(t.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        requestedBy: 'End User', // Ideally fetched from user relation
        location: t.location || 'N/A',
        attachments: t.attachments || [],
        isAcknowledging: false,
        acknowledgeNotes: '',
        isDeclining: false,
        declineReason: ''
      }));
      pendingCount.value = response.data.data.count || tickets.value.length;
    }
  } catch (error) {
    console.error('Failed to fetch SSU Incident queue:', error);
  }
};

let pollingInterval = null;

onMounted(() => {
  fetchQueue();
  pollingInterval = setInterval(() => {
    const isInteracting = tickets.value.some(t => t.isDeclining || t.isAcknowledging);
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

const toggleAcknowledgeMode = (ticket) => {
  ticket.isAcknowledging = !ticket.isAcknowledging;
  if (ticket.isAcknowledging) {
    ticket.isDeclining = false;
    if (!ticket.acknowledgeNotes) ticket.acknowledgeNotes = '';
  }
};

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
      toast.success(`Acknowledged incident ${ticketToApprove.value.ticketId} and logged recommendations.`);
      closeConfirmModal();
      fetchQueue();
    } catch (error) {
      toast.error('Failed to approve ticket');
    }
  }
};

const toggleDeclineMode = (ticket) => {
  ticket.isDeclining = !ticket.isDeclining;
  if (ticket.isDeclining) {
    ticket.isAcknowledging = false;
    ticket.declineReason = '';
  }
};

const rejectTicket = async (ticket) => {
  if (ticket.declineReason) {
    try {
      await api.patch(`tickets/${ticket.id}/decline`, { decline_reason: ticket.declineReason });
      toast.error(`Rejected incident ${ticket.ticketId}`);
      fetchQueue();
    } catch (error) {
      toast.error('Failed to reject ticket');
    }
  }
};
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
