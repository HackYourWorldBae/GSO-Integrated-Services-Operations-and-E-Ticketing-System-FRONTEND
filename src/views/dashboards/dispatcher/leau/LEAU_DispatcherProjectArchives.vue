<template>
  <MainLayout>
    <template #sidebar-links>

      <router-link to="/dispatcher/leau" class="nav-item active">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
        <span class="text">Ticket Queue</span>
      </router-link>
      <router-link to="/dispatcher/leau/workers" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span class="text">Assign Workers</span>
      </router-link>
      <router-link to="/dispatcher/leau/dispatched" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <span class="text">Dispatched Tickets</span>
      </router-link>
      <router-link to="/dispatcher/leau/archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span class="text">Archives</span>
      </router-link>
      <router-link to="/dispatcher/leau/project-archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span class="text">Project Archives</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">Archived Projects</h2>
        <p class="text-[10px] text-slate-500 font-extrabold tracking-[0.2em] uppercase">LEAU Dispatcher Projects</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-6 animate-fade-in relative pb-12 px-4 sm:px-8 py-8 max-w-[1600px] mx-auto min-h-screen">
        <div class="flex justify-between items-end mb-6">
          <div class="max-w-2xl">
            <h2 class="text-3xl font-black tracking-tight text-slate-900 mb-2">Completed Office Projects</h2>
            <p class="text-sm text-slate-500 font-medium">History of completed and archived landscaping, groundskeeping, or environmental projects.</p>
          </div>
        </div>

        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <p class="text-slate-500 font-medium">Loading projects...</p>
        </div>

        <div v-else-if="projects.length === 0" class="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 class="text-lg font-bold text-slate-900 mb-1">No Archived Projects</h3>
          <p class="text-slate-500 text-sm">There are no completed projects at the moment.</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="project in projects" :key="project.id"
               class="flex bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all group opacity-80 hover:opacity-100">

            <!-- Left: colored banner column -->
            <div class="relative flex-shrink-0 w-28 flex flex-col items-center justify-center gap-2 py-5 px-2 overflow-hidden text-center"
                 style="background: linear-gradient(175deg, #1e293b 0%, #334155 60%, #0f172a 100%)">
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
                  <span class="inline-flex items-center gap-1.5 text-[0.6rem] font-black uppercase tracking-widest text-slate-600 bg-slate-100 border border-slate-200/60 rounded-full px-2.5 py-0.5">
                    ARCHIVED
                  </span>
                  <span class="text-[0.65rem] font-medium text-slate-400">Completed {{ formatDate(project.completed_at) }}</span>
                </div>
              </div>
              <p class="text-[0.68rem] font-semibold text-slate-400 px-5 mt-0.5">Landscaping &amp; Environmental Affairs Unit (LEAU)</p>

              <h3 class="text-lg font-black text-slate-900 leading-tight tracking-tight px-5 mt-1.5">{{ project.project_title }}</h3>

              <p class="flex items-center gap-1 text-sm font-semibold text-slate-500 px-5 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                {{ project.location || 'BSU Main Campus' }}
              </p>

              <div class="mx-5 my-2.5 h-[2px] rounded-full bg-slate-200"></div>

              <p class="text-[0.85rem] text-slate-600 leading-relaxed px-5" style="font-family: Georgia, serif">
                {{ project.description || 'Scheduled groundskeeping and campus landscaping project.' }}
              </p>

              <div class="flex items-start gap-2.5 flex-wrap px-5 py-3">
                <div class="flex flex-col gap-0.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex-1 min-w-[120px]">
                  <span class="text-[0.58rem] font-black uppercase tracking-widest text-slate-500">Actual Start</span>
                  <span class="text-sm font-black text-slate-900">{{ formatDate(project.project_actual_start || project.assignment?.implementation_date || project.assignment?.dispatched_at || project.project_target_date) }}</span>
                </div>
                <div class="flex flex-col gap-0.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex-1 min-w-[120px]">
                  <span class="text-[0.58rem] font-black uppercase tracking-widest text-slate-500">Actual Completion</span>
                  <span class="text-sm font-black text-slate-900">{{ formatDate(project.project_actual_completion || project.completed_at || project.updated_at) }}</span>
                </div>
                <div v-if="project.project_remarks" class="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-r-xl px-3 py-2 flex-[2] min-w-[200px] italic leading-relaxed">
                  <span class="font-black not-italic">REMARKS: </span>{{ project.project_remarks }}
                </div>
              </div>

              <div class="flex items-center justify-between px-5 py-2 mt-auto text-[0.6rem] font-extrabold uppercase tracking-widest" style="background:#1e293b;color:rgba(255,255,255,0.7)">
                <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Completed Notice</span>
                <span style="color:rgba(255,255,255,0.4);font-weight:600">BSU — General Services Office</span>
                <span style="color:rgba(255,255,255,0.9)">Archived Record</span>
              </div>
            </div>
          </div>
        </div>
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
  name: 'LEAU_DispatcherProjectArchives',
  components: { MainLayout },
  setup() {
    const projects = ref([]);
    const loading = ref(true);

    const fetchProjects = async () => {
      loading.value = true;
      try {
        const token = sessionStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/projects/archives`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (res.ok) {
          // Filter out only LEAU projects
          projects.value = (data.data?.projects || []).filter(p => Number(p.unit_id) === 2); 
        }
      } catch (err) {
        toast.error('Failed to load project archives');
      } finally {
        loading.value = false;
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
      formatDate,
      formatDuration,
      formatProjectNumber
    };
  }
};
</script>
