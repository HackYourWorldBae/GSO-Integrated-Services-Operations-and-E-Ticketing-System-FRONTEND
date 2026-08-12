<template>
  <div class="projects-page min-h-screen bg-[#f8fafc] flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
    
    <!-- ===================== NAVBAR ===================== -->
    <nav class="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200/60 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300" :class="{ 'py-2': isScrolled, 'py-4': !isScrolled }">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center transition-all duration-300" :class="isScrolled ? 'h-14' : 'h-16'">
          <!-- Logo & Branding -->
          <div class="flex items-center gap-4 group cursor-pointer" @click="$router.push('/')">
            <div class="relative">
              <div class="absolute inset-0 bg-emerald-500 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
              <img src="/bsu-logo.png" alt="BSU Logo" class="h-10 w-10 sm:h-12 sm:w-12 relative z-10 drop-shadow-sm transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div class="flex flex-col">
              <span class="text-sm sm:text-lg font-black text-slate-900 leading-none tracking-tight">Benguet State University</span>
              <span class="text-[10px] sm:text-xs font-bold text-emerald-600 tracking-[0.15em] uppercase mt-1">General Services Office</span>
            </div>
          </div>

          <!-- Desktop Nav Links -->
          <div class="hidden md:flex items-center gap-1">
            <router-link to="/" class="px-5 py-2.5 rounded-full text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all">Home</router-link>
            <router-link to="/projects" class="px-5 py-2.5 rounded-full text-sm font-bold bg-emerald-50 text-emerald-700 transition-all">Active Projects</router-link>
            <router-link to="/projects/archives" class="px-5 py-2.5 rounded-full text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all">Archives</router-link>
            
            <div class="w-px h-6 bg-slate-200 mx-3"></div>

            <button @click="goToLogin" class="group relative px-6 py-2.5 bg-slate-900 text-white rounded-full font-bold text-sm shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span class="relative z-10 flex items-center gap-2">
                Portal Login
                <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </span>
            </button>
          </div>

          <!-- Mobile Hamburger -->
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors focus:outline-none">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <transition name="slide-down">
        <div v-if="isMobileMenuOpen" class="md:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-2xl">
          <div class="px-4 py-6 space-y-3">
            <router-link to="/" @click="isMobileMenuOpen = false" class="block px-4 py-3.5 text-base font-bold text-slate-600 hover:bg-slate-50 rounded-2xl transition-colors">Home</router-link>
            <router-link to="/projects" @click="isMobileMenuOpen = false" class="block px-4 py-3.5 text-base font-bold text-emerald-700 bg-emerald-50 rounded-2xl transition-colors">Active Projects</router-link>
            <router-link to="/projects/archives" @click="isMobileMenuOpen = false" class="block px-4 py-3.5 text-base font-bold text-slate-600 hover:bg-slate-50 rounded-2xl transition-colors">Archives</router-link>
            <button @click="goToLogin" class="w-full mt-4 bg-slate-900 text-white px-4 py-4 rounded-2xl font-bold text-center shadow-lg active:scale-95 transition-all">Login to Portal</button>
          </div>
        </div>
      </transition>
    </nav>

    <!-- ===================== HERO SECTION ===================== -->
    <header class="relative pt-24 pb-32 overflow-hidden shrink-0 bg-slate-900 isolate">
      <!-- Premium Background Effects -->
      <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 -z-10"></div>
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay -z-10"></div>
      
      <!-- Abstract Orbs -->
      <div class="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-emerald-500/20 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
      <div class="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-teal-500/20 rounded-full blur-[100px] -z-10"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent -z-10"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8 animate-fade-in-up">
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span class="text-xs font-bold text-emerald-50 tracking-wider uppercase">Live Updates</span>
        </div>

        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight mb-6 leading-[1.1] animate-fade-in-up" style="animation-delay: 100ms;">
          Campus <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Projects</span>
        </h1>
        <p class="max-w-2xl text-lg sm:text-xl text-slate-300 mx-auto font-medium leading-relaxed animate-fade-in-up" style="animation-delay: 200ms;">
          Stay informed about ongoing facility upgrades, maintenance schedules, and groundskeeping operations actively reshaping our university.
        </p>
      </div>

      <!-- Wave Separator -->
      <div class="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0 rotate-180 text-[#f8fafc]">
        <svg class="relative block w-full h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
        </svg>
      </div>
    </header>

    <!-- ===================== MAIN CONTENT ===================== -->
    <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 w-full pb-24">
      
      <!-- Sleek Filter Controls -->
      <div class="flex flex-col md:flex-row justify-between items-center bg-white p-3 rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 mb-12 gap-4 animate-fade-in-up" style="animation-delay: 300ms;">
        <h2 class="text-xl font-black text-slate-800 px-4">Active Directory</h2>
        
        <div class="flex p-1 bg-slate-100/80 rounded-xl w-full md:w-auto overflow-hidden">
          <button @click="filter = 'ALL'" class="flex-1 md:flex-none px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 relative" :class="filter === 'ALL' ? 'text-slate-900 shadow-sm bg-white' : 'text-slate-500 hover:text-slate-700'">
            All
          </button>
          <button @click="filter = 'FGMU'" class="flex-1 md:flex-none px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 relative" :class="filter === 'FGMU' ? 'text-emerald-700 shadow-sm bg-white' : 'text-slate-500 hover:text-slate-700'">
            Facilities (FGMU)
          </button>
          <button @click="filter = 'LEAU'" class="flex-1 md:flex-none px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 relative" :class="filter === 'LEAU' ? 'text-amber-600 shadow-sm bg-white' : 'text-slate-500 hover:text-slate-700'">
            Grounds (LEAU)
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-32 animate-pulse">
        <div class="relative w-16 h-16 mb-6">
          <div class="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p class="text-slate-400 font-bold tracking-widest uppercase text-sm">Retrieving Projects...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredProjects.length === 0" class="flex flex-col items-center justify-center py-24 px-4 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-slate-200/60 shadow-sm">
        <div class="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 border-8 border-white shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 class="text-2xl font-black text-slate-800 mb-2">No Active Projects</h3>
        <p class="text-slate-500 font-medium text-center max-w-md">There are currently no active announcements matching your filter criteria. Please check back later.</p>
      </div>

      <!-- Projects Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="(project, index) in filteredProjects" :key="project.id" 
             class="group bg-white rounded-[2rem] border border-slate-200/60 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 flex flex-col hover:-translate-y-2 relative"
             :style="{ animationDelay: `${index * 100}ms` }"
             class="animate-fade-in-up">
             
          <!-- Colored Top Accent Line -->
          <div class="absolute top-0 left-0 w-full h-1.5 transition-colors duration-300" :class="project.unit_id === 1 ? 'bg-emerald-500' : 'bg-amber-500'"></div>
          
          <div class="p-8 flex-1 flex flex-col relative z-10">
            <!-- Header elements -->
            <div class="flex justify-between items-start mb-6">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-lg border font-bold text-[10px] tracking-wider uppercase transition-colors"
                   :class="project.unit_id === 1 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'">
                {{ project.unit_id === 1 ? 'Facilities (FGMU)' : 'Grounds (LEAU)' }}
              </div>
              <span class="text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">#{{ project.id }}</span>
            </div>
            
            <!-- Title -->
            <h3 class="text-2xl font-black text-slate-900 leading-tight mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2" :title="project.project_title">
              {{ project.project_title }}
            </h3>
            
            <!-- Location -->
            <p class="text-sm text-slate-500 font-semibold mb-8 flex items-center gap-2">
              <span class="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
              </span>
              <span class="truncate">{{ project.location }}</span>
            </p>

            <!-- Metrics Grid -->
            <div class="grid grid-cols-2 gap-3 mb-6">
              <div class="bg-slate-50/80 rounded-2xl p-4 border border-slate-100/80 transition-colors group-hover:bg-slate-50 group-hover:border-slate-200">
                <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Date</span>
                <span class="block text-sm font-black text-slate-800">{{ formatDate(project.project_target_date) }}</span>
              </div>
              <div class="bg-slate-50/80 rounded-2xl p-4 border border-slate-100/80 transition-colors group-hover:bg-slate-50 group-hover:border-slate-200">
                <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Est. Duration</span>
                <span class="block text-sm font-black text-slate-800">{{ project.project_target_duration }}</span>
              </div>
            </div>

            <!-- Manpower if exists -->
            <div v-if="project.project_manpower" class="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
              <div>
                <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Manpower Requirement</span>
                <span class="text-sm font-semibold text-slate-700">{{ project.project_manpower }}</span>
              </div>
            </div>

            <!-- Remarks Accordion -->
            <div v-if="project.project_remarks" class="mt-auto pt-2">
              <details class="group/details relative">
                <summary class="text-sm font-bold text-emerald-600 cursor-pointer list-none flex items-center justify-between p-3 -mx-3 rounded-xl hover:bg-emerald-50 transition-colors select-none">
                  Scope of Work & Remarks
                  <span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center transition-transform duration-300 group-open/details:rotate-180">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
                  </span>
                </summary>
                <div class="mt-2 text-sm text-slate-600 bg-white p-5 rounded-2xl border border-slate-100 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] leading-relaxed animate-fade-in">
                  {{ project.project_remarks }}
                </div>
              </details>
            </div>
          </div>
          
          <!-- Card Footer -->
          <div class="px-8 py-5 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center relative overflow-hidden group-hover:bg-slate-50 transition-colors">
            <div class="flex items-center gap-2 relative z-10">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span class="text-xs font-black text-slate-900 uppercase tracking-wider">In Progress</span>
            </div>
            <span class="text-[11px] font-bold text-slate-400 relative z-10">Added {{ formatDate(project.submitted_at) }}</span>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-slate-200 py-10 text-center shrink-0">
      <div class="max-w-7xl mx-auto px-4 flex flex-col items-center">
        <img src="/bsu-logo.png" alt="BSU" class="h-8 w-8 mb-4 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
        <p class="text-slate-500 text-sm font-semibold tracking-wide">© {{ new Date().getFullYear() }} Benguet State University.</p>
        <p class="text-slate-400 text-xs font-medium mt-1">General Services Office • e-Ticketing System</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isMobileMenuOpen = ref(false);
const isScrolled = ref(false);
const filter = ref('ALL');
const projects = ref([]);
const loading = ref(true);

const goToLogin = () => {
  router.push({ name: 'login' });
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

const fetchProjects = async () => {
  loading.value = true;
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/projects`);
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
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  fetchProjects();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
.animate-pulse-slow {
  animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Transition for Mobile Menu */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease-out;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

details > summary::-webkit-details-marker {
  display: none;
}
</style>
