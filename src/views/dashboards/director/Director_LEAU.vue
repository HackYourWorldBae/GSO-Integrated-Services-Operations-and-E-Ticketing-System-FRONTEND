<template>
  <MainLayout>
    <template #sidebar-links>
      <DirectorSidebar />
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">LEAU Analytics</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Landscaping & Environmental Aesthetics Oversight</p>
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

        <!-- Active Scheduled Projects / Announcements Section (Read-Only) -->
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
                <p class="text-xs text-slate-500">No active campus landscaping projects currently posted.</p>
              </div>
            </div>
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

              <div v-if="project.project_remarks" class="text-[11px] text-slate-600 bg-amber-50/70 border border-amber-100 p-2 rounded-lg italic line-clamp-2">
                {{ project.project_remarks }}
              </div>
            </div>
          </div>
        </div>

        <!-- Evaluation Averages & Job Completion Health (Words & Numbers) -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <!-- Performance Evaluation Averages -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col min-h-[350px]">
            <h4 class="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 italic">
              <div class="w-2 h-6 bg-teal-500 rounded-full"></div>
              Evaluation Averages
            </h4>
            <div class="flex-1 flex flex-col justify-center space-y-6">
              <div v-for="(metric, idx) in [
                { label: 'Quality', val: safeVal(stats?.feedback_averages?.avg_quality) },
                { label: 'Efficiency', val: safeVal(stats?.feedback_averages?.avg_efficiency) },
                { label: 'Timeliness', val: safeVal(stats?.feedback_averages?.avg_timeliness) }
              ]" :key="idx" class="flex flex-col gap-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-black text-slate-700 uppercase tracking-widest">{{ metric.label }}</span>
                  <span class="text-xl font-black text-slate-900">{{ metric.val.toFixed(1) }}</span>
                </div>
                <div class="flex items-center gap-4">
                  <div class="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-amber-400 rounded-full" :style="{ width: (metric.val / 5 * 100) + '%' }"></div>
                  </div>
                  <div class="flex gap-0.5 text-amber-400">
                    <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= Math.round(metric.val) ? 'fill-current' : 'text-slate-200 fill-current'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Job Completion Health (Words & Numbers) -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-6">
                <h4 class="text-lg font-black text-slate-900 flex items-center gap-2 italic">
                  <div class="w-2 h-6 bg-slate-800 rounded-full"></div>
                  Job Completion Health
                </h4>
                <span class="px-3 py-1 bg-slate-100 text-slate-700 text-[10px] font-black rounded-full uppercase tracking-wider">
                  {{ completionStats.total }} Evaluated Jobs
                </span>
              </div>

              <!-- 3 Metric Cards Breakdown -->
              <div class="space-y-3.5">
                <!-- On-Time -->
                <div class="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex flex-col gap-2">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span class="text-xs font-black text-slate-800 uppercase tracking-wider">On-Time Completion</span>
                    </div>
                    <div class="flex items-baseline gap-1.5">
                      <span class="text-xl font-black text-emerald-700 tabular-nums">{{ completionStats.onTime }}</span>
                      <span class="text-xs font-bold text-emerald-600">({{ completionStats.onTimePercent }}%)</span>
                    </div>
                  </div>
                  <div class="w-full h-2 bg-emerald-200/50 rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-500 rounded-full transition-all duration-500" :style="{ width: completionStats.onTimePercent + '%' }"></div>
                  </div>
                  <p class="text-[11px] text-slate-500 font-medium">Jobs completed strictly within scheduled timeframe</p>
                </div>

                <!-- Beyond Time / Delayed -->
                <div class="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 flex flex-col gap-2">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span class="text-xs font-black text-slate-800 uppercase tracking-wider">Completed Beyond Time</span>
                    </div>
                    <div class="flex items-baseline gap-1.5">
                      <span class="text-xl font-black text-amber-700 tabular-nums">{{ completionStats.beyondTime }}</span>
                      <span class="text-xs font-bold text-amber-600">({{ completionStats.beyondTimePercent }}%)</span>
                    </div>
                  </div>
                  <div class="w-full h-2 bg-amber-200/50 rounded-full overflow-hidden">
                    <div class="h-full bg-amber-500 rounded-full transition-all duration-500" :style="{ width: completionStats.beyondTimePercent + '%' }"></div>
                  </div>
                  <p class="text-[11px] text-slate-500 font-medium">Finished with reported timeline extensions or delays</p>
                </div>

                <!-- Not Completed / Halted -->
                <div class="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 flex flex-col gap-2">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      <span class="text-xs font-black text-slate-800 uppercase tracking-wider">Not Completed / Halted</span>
                    </div>
                    <div class="flex items-baseline gap-1.5">
                      <span class="text-xl font-black text-rose-700 tabular-nums">{{ completionStats.notCompleted }}</span>
                      <span class="text-xs font-bold text-rose-600">({{ completionStats.notCompletedPercent }}%)</span>
                    </div>
                  </div>
                  <div class="w-full h-2 bg-rose-200/50 rounded-full overflow-hidden">
                    <div class="h-full bg-rose-500 rounded-full transition-all duration-500" :style="{ width: completionStats.notCompletedPercent + '%' }"></div>
                  </div>
                  <p class="text-[11px] text-slate-500 font-medium">Work stalled or unfulfilled due to site constraints</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Delay & Barrier Root Cause Analysis (Ranked Words & Numbers) -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col lg:col-span-2 space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h4 class="text-lg font-black text-slate-900 flex items-center gap-2 italic">
                  <div class="w-2 h-6 bg-amber-500 rounded-full"></div>
                  Root Cause Analysis (Why Delays & Barriers Happen)
                </h4>
                <p class="text-xs text-slate-500 font-medium mt-0.5">Top reported operational factors causing timeline extensions or work stoppages</p>
              </div>
              <span class="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-100">
                Improvement Focus
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <!-- Delay Reasons List -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <p class="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                    Completed Beyond Time (Delay Factors)
                  </p>
                  <span class="text-[11px] font-bold text-slate-400">{{ delayReasonsList.length }} Reasons</span>
                </div>

                <div v-if="delayReasonsList.length === 0" class="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <p class="text-xs font-bold text-slate-500">No Delay Reasons Reported</p>
                  <p class="text-[11px] text-slate-400 mt-1">All recorded jobs were finished on-time without reported delay factors.</p>
                </div>

                <div v-else class="space-y-3">
                  <div 
                    v-for="(item, idx) in delayReasonsList" 
                    :key="item.code"
                    class="p-4 rounded-2xl bg-amber-50/40 border border-amber-100/80 flex flex-col gap-2 hover:bg-amber-50 transition-colors"
                  >
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2.5">
                        <span class="w-5 h-5 rounded-full bg-amber-200/80 text-amber-800 text-[10px] font-black flex items-center justify-center">
                          {{ idx + 1 }}
                        </span>
                        <span class="text-xs font-black text-slate-800">{{ item.name }}</span>
                      </div>
                      <div class="flex items-baseline gap-1 shrink-0">
                        <span class="text-sm font-black text-amber-700 tabular-nums">{{ item.count }}</span>
                        <span class="text-[10px] font-bold text-slate-500">{{ item.count === 1 ? 'ticket' : 'tickets' }}</span>
                      </div>
                    </div>
                    <div class="w-full h-1.5 bg-amber-100 rounded-full overflow-hidden">
                      <div class="h-full bg-amber-500 rounded-full" :style="{ width: item.percent + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Non-Completion Barriers List -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <p class="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                    Not Completed / Performed (Barriers)
                  </p>
                  <span class="text-[11px] font-bold text-slate-400">{{ nonCompletionList.length }} Barriers</span>
                </div>

                <div v-if="nonCompletionList.length === 0" class="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <p class="text-xs font-bold text-slate-500">No Non-Completion Barriers Reported</p>
                  <p class="text-[11px] text-slate-400 mt-1">No tasks were left uncompleted or halted due to barriers.</p>
                </div>

                <div v-else class="space-y-3">
                  <div 
                    v-for="(item, idx) in nonCompletionList" 
                    :key="item.code"
                    class="p-4 rounded-2xl bg-rose-50/40 border border-rose-100/80 flex flex-col gap-2 hover:bg-rose-50 transition-colors"
                  >
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2.5">
                        <span class="w-5 h-5 rounded-full bg-rose-200/80 text-rose-800 text-[10px] font-black flex items-center justify-center">
                          {{ idx + 1 }}
                        </span>
                        <span class="text-xs font-black text-slate-800">{{ item.name }}</span>
                      </div>
                      <div class="flex items-baseline gap-1 shrink-0">
                        <span class="text-sm font-black text-rose-700 tabular-nums">{{ item.count }}</span>
                        <span class="text-[10px] font-bold text-slate-500">{{ item.count === 1 ? 'ticket' : 'tickets' }}</span>
                      </div>
                    </div>
                    <div class="w-full h-1.5 bg-rose-100 rounded-full overflow-hidden">
                      <div class="h-full bg-rose-500 rounded-full" :style="{ width: item.percent + '%' }"></div>
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
import { onMounted, ref, computed } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import DirectorSidebar from './DirectorSidebar.vue';
import api from '@/api/client';
import { formatProjectNumber } from '@/utils/projectFormatter';

const stats = ref({});
const activeProjects = ref([]);
const loadingProjects = ref(true);

const fetchActiveProjects = async () => {
  loadingProjects.value = true;
  try {
    const res = await api.get('projects');
    if (res.data?.data?.projects) {
      activeProjects.value = res.data.data.projects.filter(p => Number(p.unit_id) === 2);
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

const safeVal = (val) => parseFloat(val) || 0;

const formatReason = (code) => {
  if (!code) return 'None';
  const map = {
    personnelAbsent: "Personnel Absent",
    extendedBreak: "Extended Break Period",
    additionalWork: "Additional Work Requested",
    lackWorkingDays: "Lack of Working Days",
    lackMaterials: "Lack of Materials / Tools",
    lackSkills: "Lack of Skills / Expertise"
  };
  return map[code] || code.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

const completionStats = computed(() => {
  const health = stats.value?.completion_health || [];
  const onTime = parseInt(health.find(h => h.completion_status === 'on-time')?.count || 0);
  const beyondTime = parseInt(health.find(h => h.completion_status === 'beyond-time')?.count || 0);
  const notCompleted = parseInt(health.find(h => h.completion_status === 'not-completed')?.count || 0);
  const total = onTime + beyondTime + notCompleted;
  
  const getPercent = (count) => total > 0 ? Math.round((count / total) * 100) : 0;
  
  return {
    onTime,
    beyondTime,
    notCompleted,
    total,
    onTimePercent: getPercent(onTime),
    beyondTimePercent: getPercent(beyondTime),
    notCompletedPercent: getPercent(notCompleted)
  };
});

const delayReasonsList = computed(() => {
  const items = stats.value?.delay_reasons || [];
  const total = items.reduce((acc, r) => acc + parseInt(r.count || 0), 0);
  return items.map(r => ({
    code: r.reason_code,
    name: formatReason(r.reason_code),
    count: parseInt(r.count || 0),
    percent: total > 0 ? Math.round((parseInt(r.count || 0) / total) * 100) : 0
  })).sort((a, b) => b.count - a.count);
});

const nonCompletionList = computed(() => {
  const items = stats.value?.non_completion || [];
  const total = items.reduce((acc, r) => acc + parseInt(r.count || 0), 0);
  return items.map(r => ({
    code: r.reason_code,
    name: formatReason(r.reason_code),
    count: parseInt(r.count || 0),
    percent: total > 0 ? Math.round((parseInt(r.count || 0) / total) * 100) : 0
  })).sort((a, b) => b.count - a.count);
});

const fetchStats = async () => {
  try {
    const response = await api.get('tickets/stats/LEAU');
    if (response.data?.data?.stats) {
      stats.value = response.data.data.stats;
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
