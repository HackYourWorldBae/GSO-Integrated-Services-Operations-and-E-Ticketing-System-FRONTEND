<template>
  <div class="projects-page min-h-screen bg-slate-50 flex flex-col font-sans">
    
    <!-- ===================== NAVBAR ===================== -->
    <nav class="bg-white/80 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-100 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-20 items-center">
          <!-- Logo & Branding -->
          <div class="flex items-center gap-3">
            <img src="/bsu-logo.png" alt="BSU Logo" class="h-10 w-10 sm:h-12 sm:w-12" />
            <div class="flex flex-col">
              <span class="text-sm sm:text-base font-black text-slate-900 leading-tight">Benguet State University</span>
              <span class="text-[10px] sm:text-xs font-bold text-emerald-600 tracking-wider uppercase">General Services Office</span>
            </div>
          </div>

          <!-- Desktop Nav Links -->
          <div class="hidden md:flex items-center gap-8">
            <router-link to="/" class="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Home</router-link>
            <router-link to="/projects" class="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Projects</router-link>
            <router-link to="/projects/archives" class="text-sm font-bold text-emerald-600 border-b-2 border-emerald-600 pb-1">Archives</router-link>
            <button @click="goToLogin" class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-md hover:shadow-lg text-sm flex items-center gap-2">
              <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
              Login
            </button>
          </div>

          <!-- Mobile Hamburger -->
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="md:hidden p-2 text-slate-600 focus:outline-none">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-show="isMobileMenuOpen" class="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-xl animate-fade-in-down">
        <div class="px-4 pt-2 pb-6 space-y-2">
          <router-link to="/" @click="isMobileMenuOpen = false" class="block px-3 py-3 text-base font-bold text-slate-600 hover:bg-slate-50 rounded-xl">Home</router-link>
          <router-link to="/projects" @click="isMobileMenuOpen = false" class="block px-3 py-3 text-base font-bold text-slate-600 hover:bg-slate-50 rounded-xl">Projects</router-link>
          <router-link to="/projects/archives" @click="isMobileMenuOpen = false" class="block px-3 py-3 text-base font-bold text-emerald-600 bg-emerald-50 rounded-xl">Archives</router-link>
          <button @click="goToLogin" class="w-full mt-4 bg-emerald-600 text-white px-3 py-3 rounded-xl font-bold text-center">Login to Portal</button>
        </div>
      </div>
    </nav>

    <!-- ===================== HEADER ===================== -->
    <header class="bg-slate-900 py-16 sm:py-24 relative overflow-hidden shrink-0">
      <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 leading-tight">
          Completed <span class="text-emerald-400">Projects</span>
        </h1>
        <p class="mt-4 max-w-2xl text-lg sm:text-xl text-slate-300 mx-auto font-medium">
          A historical archive of successfully completed facility and groundskeeping projects at Benguet State University.
        </p>
      </div>
    </header>

    <!-- ===================== MAIN CONTENT ===================== -->
    <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      
      <!-- Filters -->
      <div class="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        <h2 class="text-2xl font-black text-slate-900">Project Archives</h2>
        <div class="flex p-1 bg-white rounded-xl shadow-sm border border-slate-200">
          <button @click="filter = 'ALL'" :class="['px-5 py-2 rounded-lg font-bold text-sm transition-all', filter === 'ALL' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50']">All</button>
          <button @click="filter = 'FGMU'" :class="['px-5 py-2 rounded-lg font-bold text-sm transition-all', filter === 'FGMU' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50']">FGMU</button>
          <button @click="filter = 'LEAU'" :class="['px-5 py-2 rounded-lg font-bold text-sm transition-all', filter === 'LEAU' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50']">LEAU</button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-600 mx-auto mb-4"></div>
        <p class="text-slate-500 font-bold tracking-wider uppercase text-sm">Loading Archives...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredProjects.length === 0" class="text-center py-24 bg-white rounded-[2rem] border border-slate-200 shadow-sm">
        <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 class="text-xl font-black text-slate-900 mb-2">No archived projects found</h3>
        <p class="text-slate-500 font-medium">There are currently no completed announcements matching this filter.</p>
      </div>

      <!-- Projects Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="project in filteredProjects" :key="project.id" class="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col hover:-translate-y-1">
          <!-- Card Header -->
          <div :class="['px-6 py-4 flex justify-between items-center', project.unit_id === 1 ? 'bg-emerald-700/80' : 'bg-amber-600/80']">
            <span class="text-xs font-black text-white tracking-widest uppercase">{{ project.unit_id === 1 ? 'FGMU' : 'LEAU' }}</span>
            <span class="text-xs font-bold text-white/80">ID: {{ project.id }}</span>
          </div>
          
          <!-- Card Body -->
          <div class="p-6 flex-1 flex flex-col opacity-90">
            <h3 class="text-xl font-black text-slate-900 leading-tight mb-2">{{ project.project_title }}</h3>
            <p class="text-sm text-slate-500 font-medium mb-5 flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0 mt-0.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              {{ project.location }}
            </p>

            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3 mb-6 flex-1">
              <div class="flex justify-between items-center text-sm">
                <span class="text-slate-500 font-medium">Actual Start</span>
                <span class="font-bold text-slate-900">{{ formatDate(project.project_actual_start) }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-slate-500 font-medium">Completed</span>
                <span class="font-bold text-emerald-600">{{ formatDate(project.project_actual_completion || project.completed_at) }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-slate-500 font-medium">Working Days</span>
                <span class="font-bold text-slate-900">{{ project.project_working_days || 'N/A' }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-slate-500 font-medium">Status</span>
                <span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded text-xs uppercase tracking-wider">Completed</span>
              </div>
            </div>

            <!-- Expandable Remarks -->
            <div class="mt-auto">
              <details class="group/details">
                <summary class="text-sm font-bold text-slate-500 cursor-pointer list-none flex items-center justify-between hover:text-slate-700 select-none">
                  View Remarks & Scope
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-open/details:-scale-y-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </summary>
                <div class="mt-3 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200 italic leading-relaxed">
                  {{ project.project_remarks || 'No remarks provided.' }}
                </div>
              </details>
            </div>
          </div>
          
          <!-- Card Footer -->
          <div class="px-6 py-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Announced</span>
            <span class="text-xs font-bold text-slate-500">{{ formatDate(project.submitted_at) }}</span>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-slate-900 py-8 border-t border-slate-800 text-center shrink-0">
      <p class="text-slate-400 text-sm font-medium">© {{ new Date().getFullYear() }} Benguet State University. General Services Office.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isMobileMenuOpen = ref(false);
const filter = ref('ALL');
const projects = ref([]);
const loading = ref(true);

const goToLogin = () => {
  router.push({ name: 'login' });
};

const fetchProjects = async () => {
  loading.value = true;
  try {
    // Note: Public route, no token required
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/projects/archives`);
    const data = await res.json();
    if (res.ok) {
      projects.value = data.data?.projects || [];
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
  } finally {
    loading.value = false;
  }
};

const filteredProjects = computed(() => {
  if (filter.value === 'ALL') return projects.value;
  if (filter.value === 'FGMU') return projects.value.filter(p => p.unit_id === 1);
  if (filter.value === 'LEAU') return projects.value.filter(p => p.unit_id === 2);
  return projects.value;
});

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

onMounted(() => {
  fetchProjects();
});
</script>

<style scoped>
.animate-fade-in-down {
  animation: fadeInDown 0.3s ease-out;
}
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
details > summary::-webkit-details-marker {
  display: none;
}
</style>
