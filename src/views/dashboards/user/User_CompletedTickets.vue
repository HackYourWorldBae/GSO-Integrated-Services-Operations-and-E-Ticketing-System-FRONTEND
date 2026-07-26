<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/user/dashboard" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <span class="text">Dashboard</span>
      </router-link>
      <router-link to="/user/tickets" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
        <span class="text">My Tickets</span>
      </router-link>
      <div class="mt-8 mb-4 px-4">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Archived Tickets</p>
      </div>
      <router-link to="/user/completed-tickets" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span class="text">Completed Tickets</span>
      </router-link>
      
      <div class="my-4 border-t border-white/5 mx-2"></div>
      
      <router-link to="/user/edit-profile" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span class="text">Account Settings</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">Completed Tickets</h2>
        <p class="text-xs font-medium text-slate-500">View your past and resolved requests</p>
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
            <input v-model="searchQuery" type="text" placeholder="Search Ticket ID (e.g. FGMU-TIC-42)" class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
          </div>
        </div>

        <!-- Tickets List -->
        <div class="grid grid-cols-1 gap-4">
          <div v-for="ticket in filteredTickets" :key="ticket.id" class="group relative overflow-hidden bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all">
            <div class="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
              <div class="flex items-start gap-5 flex-1">
                <div class="p-4 rounded-2xl shrink-0 bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="space-y-3 w-full">
                  <div class="flex items-center justify-between w-full">
                    <div class="flex items-center gap-3">
                      <h3 class="text-lg font-black text-slate-900">{{ ticket.service }}</h3>
                      <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-emerald-50 text-emerald-600 border-emerald-200">
                        {{ ticket.statusLabel }}
                      </span>
                    </div>
                    <div class="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Completed: {{ ticket.date }}
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ticket ID</p>
                      <p class="text-sm font-semibold text-slate-700">{{ ticket.ticketId }}</p>
                    </div>
                    <div>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Unit Assigned</p>
                      <p class="text-sm font-semibold text-slate-700">{{ ticket.unit }}</p>
                    </div>
                    
                    <div class="col-span-2 p-4 bg-white border border-slate-100 rounded-xl shadow-sm mt-1">
                      <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Description</p>
                      <p class="text-xs font-medium text-slate-600 leading-relaxed italic">"{{ ticket.description }}"</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="flex flex-col gap-3 shrink-0 pt-2 min-w-[200px] justify-center">
                <button @click="viewDetails(ticket)" class="px-8 py-3 bg-slate-100 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 border border-slate-200">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Details
                </button>
              </div>
            </div>
          </div>
          
          <div v-if="filteredTickets.length === 0" class="p-12 text-center bg-slate-50 border border-slate-200 rounded-[2rem]">
            <div class="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 class="text-lg font-black text-slate-900 mb-1">No Completed Tickets</h3>
            <p class="text-sm text-slate-500 font-medium">You don't have any completed or archived tickets yet.</p>
          </div>
        </div>
      </div>

      <!-- Read-Only Ticket Details Modal -->
      <div v-if="showDetailsModal && selectedTicket" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in" @click.self="closeDetailsModal">
        <div class="bg-white rounded-[2rem] p-8 max-w-2xl w-full shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-black text-slate-900">Completed Ticket Details</h3>
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
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Unit Assigned</p>
                <p class="text-base font-semibold text-slate-900">{{ selectedTicket.unit }}</p>
              </div>
              <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Service Type</p>
                <p class="text-base font-semibold text-slate-900">{{ selectedTicket.service }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</p>
                <div class="p-4 bg-white border border-slate-200 rounded-xl">
                  <p class="text-sm font-medium text-slate-700 leading-relaxed">{{ selectedTicket.description }}</p>
                </div>
              </div>
              <div v-if="selectedTicket.attachments && selectedTicket.attachments.length > 0" class="col-span-2">
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
               <p class="text-xs font-semibold">This ticket is completed and viewable in read-only mode for your records.</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/api/client';

const authStore = useAuthStore();

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

const userName = ref(authStore.user?.first_name || authStore.fullName || 'User');

const tickets = ref([]);
import { onMounted } from 'vue';

onMounted(async () => {
  try {
    const response = await api.get('tickets/completed');
    if (response.data?.data?.tickets) {
      tickets.value = response.data.data.tickets.map(t => ({
        id: t.id,
        ticketId: t.id,
        service: t.service_type,
        unit: t.unit_code,
        description: t.description,
        status: t.status,
        statusLabel: t.status_label,
        date: new Date(t.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        requestedBy: userName.value,
        location: t.location,
        office_room: t.office_room,
        attachments: t.attachments || [],
        isDeclining: false,
        declineReason: '',
        currentStep: parseInt(t.current_step) || 1,
        assignedWorker: t.assigned_worker,
        implementationDate: t.scheduled_date,
        isClosed: t.status === 'completed' || t.status === 'closed'
      }));
    }
  } catch (error) {
    console.error('Failed to fetch completed tickets:', error);
  }
});

const searchQuery = ref('');

const filteredTickets = computed(() => {
  if (!searchQuery.value) return tickets.value;
  return tickets.value.filter(ticket => 
    ticket.ticketId.toLowerCase().includes(searchQuery.value.trim().toLowerCase())
  );
});

const showDetailsModal = ref(false);
const selectedTicket = ref(null);

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
