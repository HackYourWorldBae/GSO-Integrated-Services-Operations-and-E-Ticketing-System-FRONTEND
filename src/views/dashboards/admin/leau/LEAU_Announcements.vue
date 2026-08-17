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
      <router-link to="/admin/leau/announcements" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
        <span class="text">Announcements</span>
      </router-link>
      <div class="mt-8 mb-4 px-4">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Archives</p>
      </div>
      <router-link to="/admin/leau/archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span class="text">Archived Tickets</span>
      </router-link>
      <router-link to="/admin/leau/project-archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span class="text">Archived Projects</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">Project Announcements</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">LEAU Admin Projects</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-6 animate-fade-in relative pb-12 px-4 sm:px-8 py-8 max-w-[1600px] mx-auto min-h-screen">
        <div class="flex justify-between items-end mb-6">
          <div class="max-w-2xl">
            <h2 class="text-3xl font-black tracking-tight text-slate-900 mb-2">Office Projects</h2>
            <p class="text-sm text-slate-500 font-medium">Manage and publish scheduled landscaping, groundskeeping, or environmental projects to the campus announcement board.</p>
          </div>
          <button @click="showAddModal = true" class="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            New Announcement
          </button>
        </div>

        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p class="text-slate-500 font-medium">Loading projects...</p>
        </div>

        <div v-else-if="projects.length === 0" class="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 class="text-lg font-bold text-slate-900 mb-1">No Active Projects</h3>
          <p class="text-slate-500 text-sm">There are no project announcements active at the moment.</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="project in projects" :key="project.id"
               class="flex bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all group">

            <!-- Left: colored banner column -->
            <div class="relative flex-shrink-0 w-28 flex flex-col items-center justify-center gap-2 py-5 px-2 overflow-hidden text-center"
                 style="background: linear-gradient(175deg, #78350f 0%, #b45309 60%, #92400e 100%)">
              <div class="absolute inset-0 pointer-events-none" style="background-image:repeating-linear-gradient(-45deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 1px,transparent 1px,transparent 10px)"></div>
              <div class="relative z-10 w-10 h-10 rounded-xl flex items-center justify-center" style="background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25)">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                </svg>
              </div>
              <span class="relative z-10 text-[0.65rem] font-black text-white bg-white/15 border border-white/20 rounded-lg px-1.5 py-0.5 tracking-wide">{{ formatProjectNumber(project.id) }}</span>
              <span class="relative z-10 text-[0.6rem] font-bold text-white/60 uppercase tracking-widest">LEAU</span>
            </div>

            <!-- Right: content -->
            <div class="flex-1 flex flex-col min-w-0">
              <div class="flex items-center justify-between gap-3 px-5 pt-3.5 pb-0 flex-wrap">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="inline-flex items-center gap-1.5 text-[0.6rem] font-black uppercase tracking-widest text-amber-900 bg-amber-50 border border-amber-200/60 rounded-full px-2.5 py-0.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    OFFICIAL ANNOUNCEMENT
                  </span>
                  <span class="text-[0.65rem] font-medium text-slate-400">Published {{ formatDate(project.submitted_at) }}</span>
                </div>
                <button @click="openUpdateModal(project)"
                        class="text-[0.7rem] font-bold text-slate-500 hover:text-amber-700 bg-slate-100 hover:bg-amber-50 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                  Update
                </button>
              </div>
              <p class="text-[0.68rem] font-semibold text-slate-400 px-5 mt-0.5">Landscaping &amp; Environmental Affairs Unit (LEAU)</p>

              <h3 class="text-lg font-black text-slate-900 leading-tight tracking-tight px-5 mt-1.5">{{ project.project_title }}</h3>

              <p class="flex items-center gap-1 text-sm font-semibold text-slate-500 px-5 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                {{ project.location || 'BSU Main Campus' }}
              </p>

              <div class="mx-5 my-2.5 h-[2px] rounded-full bg-amber-600/15"></div>

              <p class="text-[0.85rem] text-slate-600 leading-relaxed px-5" style="font-family: Georgia, serif">
                {{ project.description || 'Scheduled groundskeeping and campus landscaping project.' }}
              </p>

              <div class="flex items-start gap-2.5 flex-wrap px-5 py-3">
                <div class="flex flex-col gap-0.5 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 flex-1 min-w-[120px]">
                  <span class="text-[0.58rem] font-black uppercase tracking-widest text-amber-800">Target Date</span>
                  <span class="text-sm font-black text-slate-900">{{ formatDate(project.project_target_date) }}</span>
                </div>
                <div class="flex flex-col gap-0.5 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 flex-1 min-w-[120px]">
                  <span class="text-[0.58rem] font-black uppercase tracking-widest text-amber-800">Working Days</span>
                  <span class="text-sm font-black text-slate-900">{{ formatDuration(project.project_target_duration) }}</span>
                </div>
                <div v-if="project.project_remarks" class="text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 border-l-2 border-l-indigo-500 rounded-r-xl px-3 py-2 flex-[2] min-w-[200px] italic leading-relaxed">
                  <span class="font-black not-italic">SCOPE: </span>{{ project.project_remarks }}
                </div>
              </div>

              <div class="flex items-center justify-between px-5 py-2 mt-auto text-[0.6rem] font-extrabold uppercase tracking-widest" 
                   :style="(project.status === 'processing' && project.current_step >= 5) ? 'background:#78350f;color:rgba(255,255,255,0.7)' : (['resolved', 'closed', 'completed'].includes(project.status) ? 'background:#1e293b;color:rgba(255,255,255,0.7)' : 'background:#1e3a8a;color:rgba(255,255,255,0.7)')">
                <span class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full" 
                        :class="(project.status === 'processing' && project.current_step >= 5) ? 'bg-amber-400 shadow-[0_0_5px_#fbbf24] animate-pulse' : (['resolved', 'closed', 'completed'].includes(project.status) ? 'bg-slate-400' : 'bg-blue-400 shadow-[0_0_5px_#60a5fa] animate-pulse')"></span>
                  {{ (project.status === 'processing' && project.current_step >= 5) ? 'Active Notice' : (['resolved', 'closed', 'completed'].includes(project.status) ? 'Completed Notice' : 'Upcoming Notice') }}
                </span>
                <span style="color:rgba(255,255,255,0.4);font-weight:600">BSU — General Services Office</span>
                <span style="color:rgba(255,255,255,0.9)">Official Announcement</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Add Modal -->
        <Teleport to="body">
          <div v-if="showAddModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div class="px-6 py-5 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div>
                <h3 class="text-xl font-black text-slate-900 tracking-tight">New Project Announcement</h3>
                <p class="text-xs text-slate-500 font-medium">Post a scheduled grounds or landscaping notice for LEAU</p>
              </div>
              <button @click="showAddModal = false" class="text-slate-400 hover:text-slate-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div class="p-6 overflow-y-auto">
              <form @submit.prevent="submitProject" class="space-y-4">
                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-1.5">Project Title <span class="text-red-500">*</span></label>
                  <input v-model="form.title" type="text" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" placeholder="E.g., Lawn Mowing & Campus Tree Pruning">
                </div>
                
                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-1.5">Location <span class="text-red-500">*</span></label>
                  <input v-model="form.location" type="text" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" placeholder="E.g., University Oval / Main Quadrangle">
                </div>

                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-1.5">Project Description <span class="text-red-500">*</span></label>
                  <textarea v-model="form.description" rows="3" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" placeholder="Provide a brief summary and purpose of the project for campus awareness..."></textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1.5">Target Date <span class="text-red-500">*</span></label>
                    <input v-model="form.target_date" type="date" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all">
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1.5">Working Days</label>
                    <input v-model="form.duration" type="number" min="1" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" placeholder="E.g., 3">
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-1.5">Scope of Work / Remarks (Optional)</label>
                  <textarea v-model="form.remarks" rows="2" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" placeholder="Any specific advisories, affected paths, or work schedule..."></textarea>
                </div>
              </form>
            </div>
            
            <div class="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 shrink-0 bg-slate-50">
              <button @click="showAddModal = false" class="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors">Cancel</button>
              <button @click="submitProject" :disabled="submitting" class="px-5 py-2.5 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center gap-2">
                <span v-if="submitting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Publish Announcement
              </button>
            </div>
          </div>
        </div>

        <!-- Update Modal -->
        <div v-if="showUpdateModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div class="px-6 py-5 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h3 class="text-xl font-black text-slate-900 tracking-tight">Update Project</h3>
              <button @click="showUpdateModal = false" class="text-slate-400 hover:text-slate-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div class="p-6 overflow-y-auto">
              <form @submit.prevent="updateProject" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1.5">Actual Start Date</label>
                    <input v-model="updateForm.actual_start" type="date" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all">
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1.5">Actual Completion Date</label>
                    <input v-model="updateForm.actual_completion" type="date" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all">
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-1.5">Actual Working Days</label>
                  <input v-model="updateForm.actual_working_days" type="number" min="1" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all">
                </div>
                
                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-1.5">Update Remarks / Issues</label>
                  <textarea v-model="updateForm.remarks" rows="3" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"></textarea>
                </div>
              </form>
            </div>
            
            <div class="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 shrink-0 bg-slate-50">
              <button @click="showUpdateModal = false" class="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors">Cancel</button>
              <button @click="updateProject" :disabled="submitting" class="px-5 py-2.5 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center gap-2">
                <span v-if="submitting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Save Updates
              </button>
            </div>
          </div>
        </div>
        </Teleport>

      </div>
    </template>
  </MainLayout>
</template>

<script>
import { ref, onMounted } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { formatProjectNumber } from '@/utils/projectFormatter';

export default {
  name: 'LEAU_Announcements',
  components: { MainLayout },
  setup() {
    const projects = ref([]);
    const loading = ref(true);
    
    const showAddModal = ref(false);
    const showUpdateModal = ref(false);
    const submitting = ref(false);
    
    const form = ref({
      title: '',
      description: '',
      location: '',
      target_date: '',
      duration: '',
      remarks: ''
    });

    const currentProject = ref(null);
    const updateForm = ref({
      actual_start: '',
      actual_completion: '',
      actual_working_days: '',
      remarks: ''
    });

    const fetchProjects = async () => {
      loading.value = true;
      try {
        const token = sessionStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (res.ok) {
          // Filter out only LEAU projects
          projects.value = (data.data?.projects || []).filter(p => Number(p.unit_id) === 2); 
        }
      } catch (err) {
        toast.error('Failed to load projects');
      } finally {
        loading.value = false;
      }
    };

    const submitProject = async () => {
      if (!form.value.title || !form.value.location || !form.value.target_date || !form.value.description) {
        toast.error('Please fill in all required fields.');
        return;
      }

      submitting.value = true;
      try {
        const token = sessionStorage.getItem('token');
        
        const payload = {
          unit: 'LEAU',
          title: form.value.title,
          description: form.value.description,
          location: form.value.location,
          target_date: form.value.target_date,
          duration: form.value.duration ? form.value.duration + ' Working Days' : '',
          remarks: form.value.remarks
        };

        const res = await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok) {
          toast.success('Project announcement published!');
          showAddModal.value = false;
          form.value = { title: '', description: '', location: '', target_date: '', duration: '', remarks: '' };
          fetchProjects();
        } else {
          toast.error(data.message || 'Failed to create project.');
        }
      } catch (err) {
        toast.error('Network error.');
      } finally {
        submitting.value = false;
      }
    };

    const openUpdateModal = (project) => {
      currentProject.value = project;
      updateForm.value = {
        actual_start: project.project_actual_start || '',
        actual_completion: project.project_actual_completion || '',
        actual_working_days: project.project_working_days || '',
        remarks: project.project_remarks || ''
      };
      showUpdateModal.value = true;
    };

    const updateProject = async () => {
      submitting.value = true;
      try {
        const token = sessionStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/projects${currentProject.value ? '/' + currentProject.value.id : ''}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updateForm.value)
        });

        const data = await res.json();
        if (res.ok) {
          toast.success('Project updated!');
          showUpdateModal.value = false;
          fetchProjects();
        } else {
          toast.error(data.message || 'Failed to update project.');
        }
      } catch (err) {
        toast.error('Network error.');
      } finally {
        submitting.value = false;
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    };

    const formatDuration = (dur) => {
      if (!dur) return 'TBD';
      if (String(dur).toLowerCase().includes('day')) return dur;
      return `${dur} Working Days`;
    };

    onMounted(fetchProjects);

    return {
      projects,
      loading,
      showAddModal,
      showUpdateModal,
      submitting,
      form,
      updateForm,
      submitProject,
      openUpdateModal,
      updateProject,
      formatDate,
      formatDuration,
      formatProjectNumber
    };
  }
};
</script>
