<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/admin/leau" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <span class="text">LEAU Home</span>
      </router-link>
      <router-link to="/admin/leau/queues" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span class="text">Ticket Queues</span>
      </router-link>
      <router-link to="/admin/leau/personnel" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span class="text">Personnel Management</span>
      </router-link>
      <div class="mt-8 mb-4 px-4">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Archived Tickets</p>
      </div>
      <router-link to="/admin/leau/archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span class="text">Archives</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">LEAU Dashboard</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Landscaping & Environmental Aesthetics</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-6 animate-fade-in pb-12 px-4 sm:px-8 py-8 max-w-[1600px] mx-auto min-h-screen">
        <div class="mb-6 max-w-2xl">
          <h2 class="text-3xl font-black tracking-tight text-slate-900 mb-2">LEAU Roster</h2>
          <p class="text-sm text-slate-500 font-medium">Manage and track personnel status and current assignments.</p>
        </div>

        <div class="bg-white border border-slate-200 rounded-3xl sm:rounded-[2.5rem] p-4 sm:p-8 shadow-sm">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h3 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <span class="w-2 h-6 bg-emerald-500 rounded-full"></span>
                Staff Availability Control
              </h3>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Toggle personnel status between Available and On Leave</p>
            </div>
            <div class="flex gap-4">
              <span class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Available
              </span>
              <span class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span class="w-2 h-2 rounded-full bg-blue-500"></span> Assigned
              </span>
              <span class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span class="w-2 h-2 rounded-full bg-amber-500"></span> Working
              </span>
              <span class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span class="w-2 h-2 rounded-full bg-slate-300"></span> On Leave
              </span>
            </div>
          </div>

          <div class="space-y-8">
            <div v-if="Object.keys(groupedPersonnel).length === 0" class="flex flex-col items-center justify-center py-16 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
              <span class="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">No Personnel Found</span>
              <p class="text-sm text-slate-500 font-medium">The roster is currently empty or loading.</p>
            </div>
            <div v-else v-for="(workers, role) in groupedPersonnel" :key="role">
              <h4 class="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {{ role }}s
                <span class="text-[9px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{{ workers.length }}</span>
              </h4>
              <div class="flex flex-col space-y-4">
                <div 
                  v-for="worker in workers" 
                  :key="worker.id" 
                  class="p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm bg-slate-50/40 hover:bg-white hover:shadow-xl hover:border-slate-300 transition-all duration-300 group"
                >
                  <!-- Main Row Container -->
                  <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    <!-- Left column: Worker Info & Status -->
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between xl:justify-start gap-4 sm:gap-6 w-full xl:w-auto xl:min-w-[300px]">
                      <div class="flex items-start sm:items-center gap-3 sm:gap-4 w-full min-w-0">
                        <div class="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors shrink-0 shadow-sm font-black text-xl">
                          {{ worker.name ? worker.name.charAt(0) : 'U' }}
                        </div>
                        <div>
                          <h4 class="text-base font-black text-slate-900 leading-tight mb-1">{{ worker.name }}</h4>
                          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ worker.role }}</p>
                          <div class="mt-3 flex flex-col items-start gap-2.5 w-full">
                            <!-- Status Bar -->
                            <span 
                              @click="toggleWorkerStatus(worker)"
                              :class="[
                                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all',
                                !worker.assignedTicket && worker.status !== 'Working' ? 'cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-emerald-500 active:scale-95' : 'cursor-default',
                                worker.status === 'Working' ? 'bg-amber-50 text-amber-600 border border-amber-200/60' :
                                worker.assignedTicket ? 'bg-blue-50 text-blue-600 border border-blue-200/60' :
                                worker.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60' : 'bg-slate-200 text-slate-500 border border-slate-300'
                              ]">
                              <span :class="[
                                'w-1.5 h-1.5 rounded-full animate-pulse',
                                worker.status === 'Working' ? 'bg-amber-500' :
                                worker.assignedTicket ? 'bg-blue-500' :
                                worker.status === 'Available' ? 'bg-emerald-500' : 'bg-slate-400'
                              ]"></span>
                              {{ worker.status === 'Working' ? 'Working' : worker.assignedTicket ? `Assigned to #${worker.assignedTicket}` : (worker.status || 'Available') }}
                            </span>
                            <!-- Improved Change Status Button Below Status Bar -->
                            <button 
                              @click="toggleWorkerStatus(worker)"
                              :disabled="worker.status === 'Working' || !!worker.assignedTicket"
                              class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm border w-full sm:w-auto mt-1"
                              :class="worker.status === 'Working' || worker.assignedTicket 
                                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60' 
                                : worker.status === 'On Leave'
                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600 shadow-emerald-500/20 active:scale-95 cursor-pointer'
                                : 'bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border-slate-200 hover:border-rose-200 active:scale-95 cursor-pointer'"
                            >
                              <svg v-if="worker.status === 'On Leave'" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                              <svg v-else-if="!worker.assignedTicket && worker.status !== 'Working'" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              <span>{{ worker.assignedTicket || worker.status === 'Working' ? 'Locked (In Progress)' : worker.status === 'On Leave' ? 'Set to Available' : 'Set to On Leave' }}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Right column: Current Work & Next Assignment side-by-side -->
                    <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 xl:max-w-3xl items-stretch">
                      <!-- Current Work / Assignment Details -->
                      <div 
                        v-if="worker.status === 'Working' || worker.assignedTicket" 
                        @click="toggleTicketExtension(worker.id, worker.assignedTicket)"
                        class="h-full min-h-[140px] p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between bg-white shadow-xs hover:shadow-md"
                        :class="expandedTickets[worker.id] === worker.assignedTicket ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20' : worker.status === 'Working' ? 'border-amber-200 hover:border-amber-400 text-amber-900' : 'border-blue-200 hover:border-blue-400 text-blue-900'"
                        title="Click to expand brief ticket info"
                      >
                        <div>
                          <div class="flex items-center justify-between gap-2 mb-2">
                            <span class="text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5" :class="worker.status === 'Working' ? 'text-amber-700' : 'text-blue-700'">
                              <span class="w-2 h-2 rounded-full animate-pulse" :class="worker.status === 'Working' ? 'bg-amber-500' : 'bg-blue-500'"></span>
                              {{ worker.status === 'Working' ? 'Currently Working On' : 'Currently Assigned To' }}
                            </span>
                            <span class="text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm transition-transform group-hover:scale-105" :class="expandedTickets[worker.id] === worker.assignedTicket ? 'bg-emerald-600 text-white' : worker.status === 'Working' ? 'bg-amber-200/80 text-amber-900' : 'bg-blue-200/80 text-blue-900'">
                              #{{ worker.assignedTicket }}
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 transition-transform" :class="expandedTickets[worker.id] === worker.assignedTicket ? 'rotate-180 text-white' : 'opacity-60'" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                            </span>
                          </div>
                          <p class="text-sm font-bold leading-snug text-slate-800">{{ worker.ticketTask || 'Landscaping Maintenance Work' }}</p>
                        </div>
                        <div v-if="worker.implementationDate" class="mt-3 pt-2.5 border-t flex items-center justify-between text-[10px] font-semibold text-slate-600" :class="worker.status === 'Working' ? 'border-amber-200/60' : 'border-blue-200/60'">
                          <span class="flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Scheduled Date:
                          </span>
                          <strong class="font-bold text-slate-800">{{ worker.implementationDate }}</strong>
                        </div>
                      </div>
                      <div v-else class="h-full min-h-[140px] p-4 rounded-2xl bg-slate-100/50 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Active Assignment</span>
                        <p class="text-[11px] text-slate-400 mt-0.5">Worker is currently {{ worker.status ? worker.status.toLowerCase() : 'unavailable' }}.</p>
                      </div>

                      <!-- Next Assignment Details -->
                      <div 
                        v-if="worker.nextAssignmentId" 
                        @click="toggleTicketExtension(worker.id, worker.nextAssignmentId)"
                        class="h-full min-h-[140px] p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between bg-white shadow-xs hover:shadow-md"
                        :class="expandedTickets[worker.id] === worker.nextAssignmentId ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20' : 'border-purple-200 hover:border-purple-400 text-purple-900'"
                        title="Click to expand brief ticket info"
                      >
                        <div>
                          <div class="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                            <span class="flex items-center gap-1.5 text-purple-600">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                              Next Queued Job
                            </span>
                            <span class="font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm transition-transform group-hover:scale-105" :class="expandedTickets[worker.id] === worker.nextAssignmentId ? 'bg-emerald-600 text-white' : 'bg-purple-100 text-purple-800'">
                              #{{ worker.nextAssignmentId }}
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 transition-transform" :class="expandedTickets[worker.id] === worker.nextAssignmentId ? 'rotate-180 text-white' : 'opacity-60'" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                            </span>
                          </div>
                          <p class="text-sm font-bold text-slate-800">{{ worker.nextTicketTask || 'Landscaping Maintenance Work' }}</p>
                        </div>
                        <div class="mt-3 pt-2.5 border-t border-purple-100 flex items-center justify-between text-[10px] font-bold text-purple-700">
                          <span>Status:</span>
                          <span class="text-slate-800">Pending</span>
                        </div>
                      </div>
                      <div v-else class="h-full min-h-[140px] p-4 rounded-2xl bg-slate-100/50 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Next Job Queued</span>
                        <p class="text-[11px] text-slate-400 mt-0.5">No upcoming tickets assigned.</p>
                      </div>
                    </div>
                  </div>

                  <!-- Inline Brief Ticket Extension inside container -->
                  <div v-if="expandedTickets[worker.id]" class="mt-6 pt-6 border-t border-slate-200/80 animate-fade-in">
                    <div class="bg-slate-900 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
                      <div class="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800 relative z-10">
                        <div class="flex flex-wrap items-center gap-2.5">
                          <span class="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase tracking-widest rounded-full">
                            Ticket Extension
                          </span>
                          <span class="text-lg font-black tracking-tight text-white">#{{ expandedTickets[worker.id] }}</span>
                        </div>
                        <button @click="expandedTickets[worker.id] = null" class="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 text-slate-300 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-1.5">
                          Close Extension
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>

                      <div class="relative z-10">
                        <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Task Description</span>
                        <p class="text-xs font-medium text-slate-300 leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                          {{ expandedTickets[worker.id] === worker.assignedTicket ? (worker.ticketTask || 'No details provided.') : (worker.nextTicketTask || 'No details provided.') }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import { useLeauPersonnelStore } from '@/stores/leauPersonnel';

const store = useLeauPersonnelStore();
const groupedPersonnel = computed(() => store.groupedPersonnel);

const expandedTickets = ref({});

const toggleTicketExtension = (workerId, ticketId) => {
  if (!ticketId) return;
  if (expandedTickets.value[workerId] === ticketId) {
    expandedTickets.value[workerId] = null;
  } else {
    expandedTickets.value[workerId] = ticketId;
  }
};

const toggleWorkerStatus = (worker) => {
  if (worker.status === 'Working' || worker.assignedTicket) {
    alert(worker.assignedTicket
      ? `Cannot change status: ${worker.name} is assigned to ${worker.assignedTicket}.`
      : 'Cannot change status of a worker who is currently working on a ticket.');
    return;
  }
  store.toggleWorkerStatus(worker.id);
};

onMounted(() => {
  store.fetchPersonnel();
  
  // Real-time polling for personnel status (every 5 seconds)
  const interval = setInterval(() => {
    store.fetchPersonnel();
  }, 5000);
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
