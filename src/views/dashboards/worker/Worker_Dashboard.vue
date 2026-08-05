<template>
  <MainLayout>
    <!-- Sidebar Links Slot -->
    <template #sidebar-links>
      <router-link to="/worker/dashboard" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <span class="text">My Tasks</span>
      </router-link>
      <router-link to="/worker/history" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text">Work History</span>
      </router-link>
    </template>

    <!-- Header Title Slot -->
    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">Personnel Dashboard</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Field Worker • View Your Assigned Tasks</p>
      </div>
    </template>

    <!-- Main Content Slot -->
    <template #main-content>
      <div class="space-y-10 animate-fade-in pb-20">
        
        <!-- Worker Status Card -->
        <div class="p-8 rounded-[2.5rem] bg-slate-900 shadow-2xl relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-1000"></div>
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div class="flex items-center gap-6">
              <div class="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-md">
                <span class="text-3xl font-black text-white">JD</span>
              </div>
              <div>
                <h3 class="text-2xl font-black text-white tracking-tight">Juan Dela Cruz</h3>
                <p class="text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px]">Senior Technician • FGMU</p>
              </div>
            </div>
            
            <div class="flex items-center gap-6 bg-white/5 px-8 py-4 rounded-3xl border border-white/10">
              <div class="flex flex-col">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Status</span>
                <div class="flex items-center gap-2">
                  <span :class="[
                    'w-3 h-3 rounded-full animate-pulse',
                    currentStatus === 'Available' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' :
                    currentStatus === 'Working'   ? 'bg-amber-500  shadow-[0_0_12px_rgba(245,158,11,0.5)]'  :
                                                    'bg-blue-500   shadow-[0_0_12px_rgba(59,130,246,0.5)]'
                  ]"></span>
                  <span class="text-xl font-black text-white uppercase tracking-tighter">{{ currentStatus }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Grid (from reference) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Stats Card: Assigned -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-500/20 transition-all">
            <div>
              <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Assigned to Me</p>
              <h3 class="text-4xl font-black text-slate-900">{{ assignedJobs.length }}</h3>
            </div>
            <div class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/5 group-hover:scale-110 transition-transform">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
          </div>

          <!-- Stats Card: In Progress -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex items-center justify-between group hover:border-amber-500/20 transition-all">
            <div>
              <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">In Progress</p>
              <h3 class="text-4xl font-black text-slate-900">{{ assignedJobs.filter(j => j.status === 'IN PROGRESS').length }}</h3>
            </div>
            <div class="w-14 h-14 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/5 group-hover:scale-110 transition-transform">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>

          <!-- Stats Card: Completed -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-500/20 transition-all">
            <div>
              <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Completed</p>
              <h3 class="text-4xl font-black text-slate-900">12</h3>
            </div>
            <div class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/5 group-hover:scale-110 transition-transform">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
        </div>

        <!-- Assignments Board -->
        <div class="space-y-6">
          <div class="flex items-center gap-3">
             <h3 class="text-2xl font-black text-slate-900 tracking-tight">My Assigned Jobs</h3>
             <div class="h-px bg-slate-200 flex-1"></div>
             <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Tasks assigned to you by the unit head</p>
          </div>
          
          <div class="grid grid-cols-1 gap-8">
            <!-- Assignment Card -->
            <div 
              v-for="job in assignedJobs" 
              :key="job.ticketId" 
              :class="[
                'relative bg-white border rounded-[2.5rem] shadow-xl p-10 group overflow-hidden transition-all duration-300 hover:shadow-2xl',
                job.status === 'IN PROGRESS' ? 'border-amber-200 shadow-amber-100/60' : 'border-blue-200 shadow-blue-100/60'
              ]"
            >
              <!-- Card Header -->
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
                <div class="flex items-center gap-4 flex-wrap">
                   <span class="text-xs font-black text-slate-400 uppercase tracking-widest border border-slate-100 px-3 py-1 rounded-lg bg-slate-50">{{ job.ticket_id }}</span>
                   <!-- Blue for PENDING (next assignment), Orange for IN PROGRESS (current) -->
                   <span 
                    class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest"
                    :class="job.status === 'IN PROGRESS' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'"
                    >
                    {{ job.status === 'IN PROGRESS' ? '🟠 In Progress' : '🔵 Assigned' }}
                   </span>
                   <span 
                    class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600"
                   >
                    {{ job.ticket_status }}
                   </span>
                </div>
                
                <button 
                  @click="toggleJobStatus(job)"
                  class="px-8 py-3 rounded-2xl font-black text-sm transition-all shadow-xl active:scale-95"
                  :class="job.status === 'IN PROGRESS' ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'"
                >
                  <span class="flex items-center gap-2">
                    <svg v-if="job.status === 'IN PROGRESS'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {{ job.status === 'IN PROGRESS' ? 'Mark Complete' : 'Start Job' }}
                  </span>
                </button>
              </div>

              <!-- Job Title & Description -->
              <div class="mb-10 relative z-10">
                <h4 class="text-3xl font-black text-slate-900 mb-3 tracking-tight">{{ job.service_type }} ({{ job.task_notes }})</h4>
                <p class="text-slate-500 font-medium leading-relaxed max-w-4xl">{{ job.description }}</p>
              </div>

              <!-- Metadata Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-10 relative z-10">
                 <!-- Location -->
                 <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <div>
                       <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Location</p>
                       <p class="text-sm font-bold text-slate-700">{{ job.location }}</p>
                    </div>
                 </div>

                 <!-- Due Date -->
                 <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                       <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Due Date</p>
                       <p class="text-sm font-bold text-slate-700">{{ job.implementation_date || 'N/A' }}</p>
                    </div>
                 </div>

                 <!-- Requested By -->
                 <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <div>
                       <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Worker Assigned</p>
                       <p class="text-sm font-bold text-slate-700">{{ job.worker_name || 'N/A' }}</p>
                    </div>
                 </div>

                 <!-- Assigned Date -->
                 <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                       <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Assigned Date</p>
                       <p class="text-sm font-bold text-slate-700">{{ new Date(job.assigned_at).toLocaleDateString() }}</p>
                    </div>
                 </div>
              </div>

              <!-- Materials Section -->
              <div class="bg-blue-50/50 rounded-3xl p-6 md:p-8 border border-blue-100 flex flex-col md:flex-row md:items-center gap-6 relative z-10 transition-all group-hover:bg-blue-50">
                 <div class="flex flex-col shrink-0">
                    <p class="text-[10px] text-blue-500 font-black uppercase tracking-tight mb-1">Materials/Tools Needed:</p>
                 </div>
                 <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="material in job.materials" 
                      :key="material"
                      class="px-4 py-2 rounded-xl bg-white border border-blue-100 text-blue-600 text-xs font-bold shadow-sm"
                    >
                      {{ material }}
                    </span>
                 </div>
              </div>

              <!-- Card Background Decoration -->
              <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-1000 pointer-events-none opacity-50"></div>
            </div>
          </div>
        </div>

      </div>
    </template>
    <!-- Modal Overlay Slot -->
    <template #modal-overlay>
      <ConfirmModal 
        :isOpen="confirmModalState.isOpen"
        :title="confirmModalState.title"
        :message="confirmModalState.message"
        :confirmText="confirmModalState.confirmText"
        :type="confirmModalState.type"
        @confirm="executeConfirm"
        @cancel="closeConfirmModal"
      />
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';
import api from '@/api/client';

const confirmModalState = reactive({
  isOpen: false,
  title: '',
  message: '',
  confirmText: 'Confirm',
  type: 'danger',
  onConfirm: null
});

const openConfirmModal = (options) => {
  confirmModalState.title = options.title;
  confirmModalState.message = options.message;
  confirmModalState.confirmText = options.confirmText || 'Confirm';
  confirmModalState.type = options.type || 'danger';
  confirmModalState.onConfirm = options.onConfirm;
  confirmModalState.isOpen = true;
};

const closeConfirmModal = () => {
  confirmModalState.isOpen = false;
};

const executeConfirm = () => {
  if (confirmModalState.onConfirm) {
    confirmModalState.onConfirm();
  }
  closeConfirmModal();
};

// --- REACTIVE JOBS ---
const assignedJobs = ref([]);

const fetchAssignments = async () => {
  try {
    const response = await api.get('dispatch/active/all');
    if (response.data?.data?.active_jobs) {
      assignedJobs.value = response.data.data.active_jobs.map(job => ({
        ...job,
        status: (job.worker_status === 'working' || job.worker_status === 'on_trip') ? 'IN PROGRESS' : 'PENDING'
      }));
      const hasInProgress = assignedJobs.value.some(j => j.status === 'IN PROGRESS');
      currentStatus.value = hasInProgress ? 'Working' : 'Available';
    } else {
      assignedJobs.value = [];
      currentStatus.value = 'Available';
    }
  } catch (error) {
    console.error('Failed to fetch assignments:', error);
    currentStatus.value = 'Available';
  }
};

onMounted(() => {
  fetchAssignments();
});

const currentStatus = ref('Available'); // Initial state

const toggleJobStatus = async (job) => {
  // If the job hasn't been started yet
  // We check if it hasn't been dispatched by the worker yet (e.g. status isn't marked as Job Started or worker status isn't working)
  // Actually, just let the button state dictate it. If they click "Start Job", we hit the API.
  if (job.status === 'PENDING' || job.status === 'approved' || job.status === 'processing') {
    openConfirmModal({
      title: 'Start Job',
      message: `Are you sure you want to start "${job.service_type || job.ticket_id}"?`,
      confirmText: 'Start',
      type: 'info',
      onConfirm: async () => {
        try {
          await api.post('dispatch/start', {
            ticket_id: job.ticket_id,
            personnel_id: job.personnel_id
          });
          job.status = 'IN PROGRESS';
          currentStatus.value = 'Working';
          // Optionally refetch assignments to ensure fresh data
          await fetchAssignments();
        } catch (error) {
          console.error('Failed to start job:', error);
        }
      }
    });
  } else {
    openConfirmModal({
      title: 'Complete Job',
      message: `Mark "${job.ticketTask || job.service_type}" as completed?`,
      confirmText: 'Complete',
      type: 'warning',
      onConfirm: async () => {
        try {
          await api.patch(`tickets/${job.ticket_id}/complete`);
          
          // If no more jobs are in progress, set status to Available
          const remainingInProgress = assignedJobs.value.filter(j => j.ticket_id !== job.ticket_id).some(j => j.status === 'IN PROGRESS');
          if (!remainingInProgress) {
            currentStatus.value = 'Available';
          }
          
          // Refetch assignments
          await fetchAssignments();
        } catch (error) {
          console.error('Failed to complete job:', error);
        }
      }
    });
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(15, 118, 110, 0.1);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(15, 118, 110, 0.2);
}
</style>
