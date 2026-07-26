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
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">TASU Dispatcher</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Transportation Logistics Control</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in pb-16">
        
        <!-- Dispatcher Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div class="p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <div class="p-3 rounded-xl bg-amber-50 text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" /></svg>
              </div>
              <span class="text-[10px] font-black text-amber-500/40 uppercase tracking-widest">Queue</span>
            </div>
            <h3 class="text-4xl font-black text-slate-900 tabular-nums">{{ mockTrips.length }}</h3>
            <p class="text-sm text-slate-500 font-bold uppercase tracking-wider">Pending Trips</p>
          </div>

          <div class="p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <div class="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <span class="text-[10px] font-black text-emerald-500/40 uppercase tracking-widest">Active</span>
            </div>
            <h3 class="text-4xl font-black text-slate-900 tabular-nums">12</h3>
            <p class="text-sm text-slate-500 font-bold uppercase tracking-wider">Vehicles Dispatched</p>
          </div>

          <div class="p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <div class="p-3 rounded-xl bg-blue-50 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span class="text-[10px] font-black text-blue-400/40 uppercase tracking-widest">Complete</span>
            </div>
            <h3 class="text-4xl font-black text-slate-900 tabular-nums">19</h3>
            <p class="text-sm text-slate-500 font-bold uppercase tracking-wider">Trips Finished</p>
          </div>
        </div>

        <!-- Banner explaining pre-booked vehicles and driver assignment tab -->
        <div class="p-5 bg-emerald-50 border border-emerald-200 rounded-[2rem] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div class="flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-sm">🚗</div>
            <div>
              <h4 class="text-xs font-black text-emerald-900 uppercase tracking-wider">Vehicle Units Pre-Selected by Requestors</h4>
              <p class="text-xs font-bold text-emerald-700 mt-0.5">Requestors choose their desired vehicle unit on the Services page. Assign drivers directly via the <strong class="underline">Assign Drivers</strong> tab.</p>
            </div>
          </div>
          <button @click="router.push('/dispatcher/tasu/drivers')" class="px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 font-black text-xs uppercase tracking-widest transition-all shadow-sm shrink-0 active:scale-95">
            Open Assign Drivers Tab ➔
          </button>
        </div>

        <!-- Trip Request Table -->
        <div class="rounded-[2.5rem] bg-white border border-slate-200 p-10 overflow-hidden shadow-sm">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-2xl font-black text-slate-900 tracking-tight text-emerald-600">Trip Request Queue</h3>
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">All active requested dispatches</span>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left min-w-[750px]">
              <thead>
                <tr class="border-b border-slate-100">
                  <th class="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 font-bold">Trip ID</th>
                  <th class="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 font-bold">Destination</th>
                  <th class="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 font-bold">Date & Time</th>
                  <th class="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 font-bold">Requested Vehicle (Pre-Booked)</th>
                  <th class="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 font-bold">Assigned Driver</th>
                  <th class="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 font-bold text-right pt-2 pb-2">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr v-for="trip in mockTrips" :key="trip.id" class="group hover:bg-slate-50/50 transition-colors">
                  <td class="py-6 px-4">
                    <span class="text-sm font-black text-slate-900">#{{ trip.id }}</span>
                  </td>
                  <td class="py-6 px-4">
                    <span class="text-sm font-bold text-slate-900 block">{{ trip.destination }}</span>
                    <span class="text-[10px] text-slate-400 font-bold block mt-0.5">{{ trip.requester }} • {{ trip.office }}</span>
                  </td>
                  <td class="py-6 px-4">
                    <div class="flex flex-col">
                      <span class="text-sm font-bold text-slate-700">{{ trip.date }}</span>
                      <span class="text-[10px] text-slate-400 font-medium">{{ trip.time }} - {{ trip.return_time }}</span>
                    </div>
                  </td>
                  <td class="py-6 px-4">
                    <div class="flex items-center gap-2">
                      <span class="text-lg">🚐</span>
                      <div>
                        <span class="text-xs font-black text-emerald-800 block leading-tight">{{ trip.requestedVehicle }}</span>
                        <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-1.5 py-0.5 rounded">Fixed / Pre-Booked</span>
                      </div>
                    </div>
                  </td>
                  <td class="py-6 px-4">
                    <div v-if="trip.assignedDriver" class="flex items-center gap-2">
                       <span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center">🧑</span>
                       <span class="text-xs font-black text-slate-800">{{ trip.assignedDriver }}</span>
                    </div>
                    <span v-else class="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-200 inline-flex items-center gap-1">
                      <span>⚠️ Unassigned</span>
                    </span>
                  </td>
                  <td class="py-6 px-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button @click="openTicketModal(trip)" class="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors inline-block active:scale-95">
                        Review Ticket
                      </button>
                      
                      <!-- Direct Button to Assign Drivers Tab -->
                      <button v-if="!trip.assignedDriver" @click="goToAssignDriversTab(trip)" class="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 shadow-md shadow-emerald-500/20 transition-all inline-flex items-center gap-1.5 active:scale-95">
                        <span>Assign Driver</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </button>
                      <button v-else @click="confirmDispatch(trip)" class="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 shadow-md shadow-blue-500/20 transition-all inline-block italic active:scale-95">
                        Confirm Dispatch
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </template>

    <template #modal-overlay>
      <!-- Ticket Detail Modal Overlay -->
      <div v-if="showTicketModal" class="absolute inset-0 z-[60] overflow-y-auto custom-scrollbar pointer-events-auto bg-slate-900/60 backdrop-blur-sm animate-fade-in">
        <div class="flex min-h-[100dvh] items-center justify-center p-4 md:p-8" @click.self="showTicketModal = false">
        
        <!-- Modal Content -->
        <div class="bg-[#F8FAFC] w-full max-w-4xl h-fit rounded-[3rem] shadow-2xl overflow-hidden relative z-10 animate-scale-up border border-slate-200">
          <!-- Modal Header -->
          <div class="bg-slate-900 p-8 text-white flex justify-between items-end border-b-4 border-emerald-500">
            <div>
              <span class="px-3 py-1 bg-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-3 inline-block">Trip Request</span>
              <h3 class="text-3xl font-black tracking-tighter">{{ modalTicket?.destination }} <span class="text-emerald-500">({{ modalTicket?.id }})</span></h3>
              <p class="text-slate-400 mt-1 font-bold">Planned Date: {{ modalTicket?.date }} | Time: {{ modalTicket?.time }}</p>
            </div>
            <button @click="showTicketModal = false" class="absolute top-6 right-8 text-slate-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-10 space-y-10">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Requester Name</label>
                <p class="text-sm font-bold text-slate-900 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">{{ modalTicket?.requester }}</p>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Requesting Office</label>
                <p class="text-sm font-bold text-slate-900 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">{{ modalTicket?.office }}</p>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">No. of Passengers</label>
                <p class="text-sm font-bold text-slate-900 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">{{ modalTicket?.passengers }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-3">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Places to be visited</label>
                <div class="w-full px-6 py-5 rounded-2xl bg-white border border-slate-100 shadow-sm text-sm font-bold text-slate-700 leading-relaxed min-h-[80px]">
                  {{ modalTicket?.places_to_visit }}
                </div>
              </div>
              <div class="space-y-3">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Purpose of travel</label>
                <div class="w-full px-6 py-5 rounded-2xl bg-white border border-slate-100 shadow-sm text-sm font-bold text-slate-700 leading-relaxed min-h-[80px]">
                  {{ modalTicket?.purpose }}
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date of Trip</label>
                <p class="text-sm font-bold text-slate-900 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">{{ modalTicket?.date }}</p>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Time of Departure</label>
                <p class="text-sm font-bold text-slate-900 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">{{ modalTicket?.time }}</p>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Expected Time of Return</label>
                <p class="text-sm font-bold text-slate-900 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">{{ modalTicket?.return_time }}</p>
              </div>
            </div>
            
            <div v-if="modalTicket?.attachments && modalTicket?.attachments.length > 0" class="space-y-4">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Attached Documents</label>
              <div class="flex flex-wrap gap-3">
                <div v-for="file in modalTicket?.attachments" :key="typeof file === 'string' ? file : file.id" @click="downloadAttachment(file)" class="px-5 py-3 bg-white border border-slate-100 rounded-2xl flex items-center gap-4 shadow-sm hover:border-emerald-500 transition-colors group cursor-pointer">
                  <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <span class="text-xs font-black text-slate-800">{{ typeof file === 'string' ? file : (file.file_name || 'Attachment') }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
            <button @click="showTicketModal = false" class="px-8 py-3 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-600/20 active:scale-95">
              Close Detail View
            </button>
          </div>
        </div>
        </div>
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import { toast } from 'vue3-toastify';
import api from '@/api/client';

const downloadAttachment = async (att) => {
  // att can be a plain filename string (mock data) or a full attachment object from the API
  if (typeof att === 'string') return;
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

const router = useRouter();
const showTicketModal = ref(false);
const modalTicket = ref(null);

const mockTrips = ref([
  { id: 'TASU-TIC-11', destination: 'City Campus', date: 'Oct 28, 2026', time: '08:00 AM', return_time: '12:00 PM', requester: 'OVP-Academic', office: 'Office of VP for Academics', passengers: 4, places_to_visit: 'City Campus Main Building, College of Nursing', purpose: 'Accreditation Visit Evaluation', attachments: ['Travel_Order.pdf'], requestedVehicle: 'Toyota HiAce Commuter (SBA-1234)', assignedDriver: null, showDigitalForm: false },
  { id: 'TASU-TIC-12', destination: 'South Field', date: 'Oct 28, 2026', time: '10:30 AM', return_time: '04:00 PM', requester: 'COA Auditor', office: 'Commission on Audit', passengers: 2, places_to_visit: 'South Field Extension, Agronomy Dept', purpose: 'On-site facilities inventory check', attachments: ['COA_Memo.pdf'], requestedVehicle: 'Nissan Urvan Shuttle (SAC-1399)', assignedDriver: null, showDigitalForm: false },
  { id: 'TASU-TIC-13', destination: 'Regional Office', date: 'Oct 29, 2026', time: '07:00 AM', return_time: '06:00 PM', requester: 'University President', office: 'Office of the President', passengers: 3, places_to_visit: 'CHED Regional Office', purpose: 'Annual Planning Conference', attachments: ['Invitation_CHED.pdf'], requestedVehicle: 'Mitsubishi Coaster Bus (TRANS-01)', assignedDriver: null, showDigitalForm: false },
]);

const openTicketModal = (trip) => {
  modalTicket.value = trip;
  showTicketModal.value = true;
};

// Directly navigate to Assign Drivers tab passing the trip ID query parameter without opening any pop-up modal
const goToAssignDriversTab = (trip) => {
  router.push({ path: '/dispatcher/tasu/drivers', query: { trip: trip.id } });
};

const confirmDispatch = (trip) => {
  toast.success(`Trip ${trip.id} dispatched! Digital Trip Ticket issued.`);
  mockTrips.value = mockTrips.value.filter(t => t.id !== trip.id);
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #CBD5E1;
}

@keyframes scale-up {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.animate-scale-up {
  animation: scale-up 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
