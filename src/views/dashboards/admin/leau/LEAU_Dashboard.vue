<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/admin/leau" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
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
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">LEAU Dashboard</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Landscaping & Environmental Aesthetics</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in pb-12">
        
        <!-- Key Metrics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-slate-900 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-full uppercase tracking-tighter">Total Requests</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.total || 0 }}</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">All Time</p>
          </div>

          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-amber-50 text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full uppercase tracking-tighter">Pending</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.pending || 0 }}</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Awaiting Approval</p>
          </div>

          <!-- Dispatched & Scheduled -->
          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-blue-50 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-tighter">Dispatched</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.scheduled || 0 }}</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Scheduled Jobs</p>
          </div>

          <!-- Active Dispatches -->
          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full uppercase tracking-tighter">Active</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.active_working || 0 }}</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Work In Progress</p>
          </div>

          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-tighter">Completed</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.resolved || 0 }}</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Resolved Tickets</p>
          </div>
        </div>

        <!-- Active Scheduled Projects / Announcements Section -->
        <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm space-y-6">
          <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <div class="w-2.5 h-6 bg-amber-600 rounded-full"></div>
                <h3 class="text-xl font-black text-slate-900 tracking-tight">Active Office Projects & Announcements</h3>
                <span v-if="activeProjects.length > 0" class="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-black">
                  {{ activeProjects.length }} Active
                </span>
              </div>
              <p class="text-xs text-slate-500 font-medium">Scheduled groundskeeping, landscaping, and environmental projects posted for LEAU.</p>
            </div>
            <router-link to="/admin/leau/announcements" class="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              Manage Announcements
            </router-link>
          </div>

          <div v-if="loadingProjects" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-2"></div>
            <p class="text-xs text-slate-400 font-medium">Loading active projects...</p>
          </div>

          <div v-else-if="activeProjects.length === 0" class="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-200/70">
            <div class="flex items-center gap-3.5">
              <div class="p-3 bg-white rounded-xl text-slate-400 border border-slate-200/80 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h4 class="text-sm font-bold text-slate-900">No Active Project Announcements</h4>
                <p class="text-xs text-slate-500">Publish scheduled campus landscaping projects to notify university stakeholders.</p>
              </div>
            </div>
            <router-link to="/admin/leau/announcements" class="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              New Announcement
            </router-link>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div v-for="project in activeProjects" :key="project.id" class="bg-gradient-to-b from-white to-slate-50 border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col relative overflow-hidden">
              <div class="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>

              <div class="flex justify-between items-center mb-3">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-wider rounded-md shadow-xs">
                    {{ formatProjectNumber(project.id) }}
                  </span>
                  <span class="px-2.5 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-extrabold rounded-full border border-amber-200 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    Active Notice
                  </span>
                </div>
                <span class="text-[11px] font-semibold text-slate-400">{{ formatDate(project.submitted_at) }}</span>
              </div>

              <h4 class="text-base font-black text-slate-900 mb-1 leading-snug">{{ project.project_title }}</h4>

              <div class="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>{{ project.location || 'BSU Campus' }}</span>
              </div>

              <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                {{ project.description || 'Scheduled groundskeeping and campus landscaping.' }}
              </p>

              <div class="grid grid-cols-2 gap-2 bg-white p-2.5 rounded-xl border border-slate-100 text-xs mb-3">
                <div>
                  <span class="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Target Date</span>
                  <span class="font-black text-slate-900 text-[11px]">{{ formatDate(project.project_target_date) }}</span>
                </div>
                <div>
                  <span class="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Working Days</span>
                  <span class="font-black text-slate-900 text-[11px]">{{ formatDuration(project.project_target_duration) }}</span>
                </div>
              </div>

              <div v-if="project.project_remarks" class="mb-3 text-[11px] text-slate-600 bg-amber-50/70 border border-amber-100 p-2 rounded-lg italic line-clamp-2">
                {{ project.project_remarks }}
              </div>

              <div class="mt-auto pt-2 border-t border-slate-100 flex justify-end">
                <router-link to="/admin/leau/announcements" class="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1">
                  View in Announcements
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <!-- Performance Radar -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col min-h-[350px] lg:h-[400px]">
            <h4 class="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 italic">
              <div class="w-2 h-6 bg-teal-500 rounded-full"></div>
              Evaluation Averages
            </h4>
            <div class="flex-1 relative">
              <canvas id="performanceRadar"></canvas>
            </div>
          </div>

          <!-- Completion Status -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col min-h-[350px] lg:h-[400px]">
            <h4 class="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 italic">
              <div class="w-2 h-6 bg-slate-400 rounded-full"></div>
              Job Completion Health
            </h4>
            <div class="flex-1 relative">
              <canvas id="leauCompletionDoughnut"></canvas>
            </div>
          </div>

          <!-- Delay Analysis -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col lg:col-span-2">
            <div class="flex items-center justify-between mb-8">
              <h4 class="text-lg font-black text-slate-900 flex items-center gap-2 italic">
                <div class="w-2 h-6 bg-amber-500 rounded-full"></div>
                Root Cause Analysis (Why Delays Happen)
              </h4>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic leading-none">Improvement Focus</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div class="space-y-6">
                <p class="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Completed Beyond Time (Reasons)</p>
                <div class="relative h-48">
                  <canvas id="leauDelayReasonsChart"></canvas>
                </div>
              </div>
              <div class="space-y-6">
                <p class="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Not Completed/Performed (Barriers)</p>
                <div class="relative h-48">
                  <canvas id="leauNonCompletionChart"></canvas>
                </div>
              </div>
            </div>
          </div>

          <!-- Service Request Frequency -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col lg:col-span-2">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-8">
              <h4 class="text-lg font-black text-slate-900 flex items-center gap-2 italic">
                <div class="w-2 h-6 bg-teal-500 rounded-full"></div>
                Service Request Frequency
              </h4>
              <div class="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                <button
                  v-for="filter in leauPeriodFilters"
                  :key="filter.key"
                  @click="setLeauPeriod(filter.key)"
                  :class="[
                    'px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all',
                    leauActivePeriod === filter.key
                      ? 'bg-white text-teal-600 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  ]"
                >
                  {{ filter.label }}
                </button>
              </div>
            </div>
            <div class="relative h-64">
              <canvas id="leauServiceFreqChart"></canvas>
            </div>
          </div>

        </div>

      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import Chart from 'chart.js/auto';
import api from '@/api/client';
import { formatProjectNumber } from '@/utils/projectFormatter';

const stats = ref({});
const activeProjects = ref([]);
const loadingProjects = ref(true);

const leauActivePeriod = ref('Month');
const leauPeriodFilters = [
  { key: 'Day',   label: 'Last 24 Hours' },
  { key: 'Week',  label: 'Last 7 Days' },
  { key: 'Month', label: 'Last 30 Days' },
  { key: 'Year',  label: 'Last 12 Months' }
];

let leauServiceFreqChart = null;
let charts = [];

const fetchActiveProjects = async () => {
  loadingProjects.value = true;
  try {
    const token = sessionStorage.getItem('token');
    const res = await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) {
      // Filter out only LEAU projects
      activeProjects.value = (data.data?.projects || []).filter(p => Number(p.unit_id) === 2);
    }
  } catch (err) {
    console.error('Failed to load active LEAU projects:', err);
  } finally {
    loadingProjects.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'TBD';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

const formatDuration = (dur) => {
  if (!dur) return 'TBD';
  if (String(dur).toLowerCase().includes('day')) return dur;
  return `${dur} Working Days`;
};

function setLeauPeriod(period) {
  leauActivePeriod.value = period;
  if (leauServiceFreqChart && stats.value.service_freq) {
    const data = stats.value.service_freq[period] || [];
    if (data.length === 0) {
      leauServiceFreqChart.data.labels = ['No requests yet'];
      leauServiceFreqChart.data.datasets[0].data = [0];
    } else {
      leauServiceFreqChart.data.labels = data.map(d => d.service_type);
      leauServiceFreqChart.data.datasets[0].data = data.map(d => parseInt(d.count));
    }
    leauServiceFreqChart.update();
  }
}

const renderCharts = () => {
  // Destroy existing charts to prevent memory leaks if re-rendered
  charts.forEach(c => c.destroy());
  charts = [];

  const safeVal = (val) => parseFloat(val) || 0;

  const formatReason = (code) => {
    if (!code) return 'None';
    const map = {
      personnelAbsent: "Personnel Absent",
      extendedBreak: "Extended Break Period",
      additionalWork: "Additional Work",
      lackWorkingDays: "Lack of Working Days",
      lackMaterials: "Lack of Materials / Tools",
      lackSkills: "Lack of Skills"
    };
    return map[code] || code.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  // 1. Performance Radar Chart
  const radarCtx = document.getElementById('performanceRadar');
  if (radarCtx && stats.value.feedback_averages) {
    const avg = stats.value.feedback_averages;
    charts.push(new Chart(radarCtx, {
      type: 'radar',
      data: {
        labels: ['Quality', 'Efficiency', 'Timeliness'],
        datasets: [{
          label: 'Current Avg (1-5)',
          data: [safeVal(avg.avg_quality), safeVal(avg.avg_efficiency), safeVal(avg.avg_timeliness)],
          backgroundColor: 'rgba(20, 184, 166, 0.2)', // teal-500 with opacity
          borderColor: '#14b8a6', // teal-500
          pointBackgroundColor: '#14b8a6',
          borderWidth: 3
        }, {
          label: 'Target Score',
          data: [4.5, 4.5, 4.5],
          backgroundColor: 'rgba(226, 232, 240, 0.1)',
          borderColor: '#94a3b8',
          borderDash: [5, 5],
          borderWidth: 1,
          pointRadius: 0
        }]
      },
      options: {
        scales: { r: { min: 0, max: 5, ticks: { stepSize: 1, display: false } } },
        plugins: { legend: { position: 'bottom' } },
        responsive: true, maintainAspectRatio: false
      }
    }));
  }

  // 2. Completion Health Doughnut
  const completionCtx = document.getElementById('leauCompletionDoughnut');
  if (completionCtx && stats.value.completion_health) {
    const health = stats.value.completion_health;
    const onTime = health.find(h => h.completion_status === 'on-time')?.count || 0;
    const beyondTime = health.find(h => h.completion_status === 'beyond-time')?.count || 0;
    const notCompleted = health.find(h => h.completion_status === 'not-completed')?.count || 0;
    
    charts.push(new Chart(completionCtx, {
      type: 'doughnut',
      data: {
        labels: ['On-time', 'Beyond Time', 'Not Completed'],
        datasets: [{
          data: [onTime, beyondTime, notCompleted],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          hoverOffset: 15, borderRadius: 10, borderWidth: 4, borderColor: '#ffffff'
        }]
      },
      options: {
        plugins: { legend: { position: 'bottom' } },
        cutout: '70%', responsive: true, maintainAspectRatio: false
      }
    }));
  }

  // 3. Delay Reasons
  const delayCtx = document.getElementById('leauDelayReasonsChart');
  if (delayCtx && stats.value.delay_reasons) {
    charts.push(new Chart(delayCtx, {
      type: 'bar',
      data: {
        labels: stats.value.delay_reasons.map(r => formatReason(r.reason_code)) || ['None'],
        datasets: [{
          label: 'Occurrences',
          data: stats.value.delay_reasons.map(r => parseInt(r.count)) || [0],
          backgroundColor: '#f59e0b', borderRadius: 6
        }]
      },
      options: { indexAxis: 'y', plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false }
    }));
  }

  // 4. Non-Completion
  const nonCompCtx = document.getElementById('leauNonCompletionChart');
  if (nonCompCtx && stats.value.non_completion) {
    charts.push(new Chart(nonCompCtx, {
      type: 'bar',
      data: {
        labels: stats.value.non_completion.map(r => formatReason(r.reason_code)) || ['None'],
        datasets: [{
          label: 'Occurrences',
          data: stats.value.non_completion.map(r => parseInt(r.count)) || [0],
          backgroundColor: '#ef4444', borderRadius: 6
        }]
      },
      options: { indexAxis: 'y', plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false }
    }));
  }

  // 5. Service Request Frequency
  const freqCtx = document.getElementById('fgmuServiceFreqChart') || 
                  document.getElementById('leauServiceFreqChart') || 
                  document.getElementById('ssuServiceFreqChart') || 
                  document.getElementById('tasuServiceFreqChart');
  if (freqCtx && stats.value.service_freq) {
    const initData = stats.value.service_freq[leauActivePeriod.value] || [];
    leauServiceFreqChart = new Chart(freqCtx, {
      type: 'bar',
      data: {
        labels: initData.map(d => d.service_type),
        datasets: [{
          label: 'Requests',
          data: initData.map(d => parseInt(d.count)),
          backgroundColor: ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
          borderRadius: 8
        }]
      },
      options: { plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false }
    });
    charts.push(leauServiceFreqChart);
  }
};

const fetchStats = async () => {
  try {
    const response = await api.get('tickets/stats/LEAU');
    if (response.data?.data?.stats) {
      stats.value = response.data.data.stats;
      nextTick(() => {
        renderCharts();
      });
    }
  } catch (error) {
    console.error('Failed to fetch LEAU stats:', error);
  }
};

onMounted(() => {
  fetchStats();
  fetchActiveProjects();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

</style>

