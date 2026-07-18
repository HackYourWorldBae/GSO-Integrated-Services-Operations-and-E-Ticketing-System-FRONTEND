<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/admin/ssu" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span class="text">SSU Home</span>
      </router-link>

      <router-link to="/admin/ssu/queues/incidents" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span class="text">Incident Ticket Queues</span>
      </router-link>

      <router-link to="/admin/ssu/queues/stickers" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
        <span class="text">Sticker Ticket Queues</span>
      </router-link>
      <div class="mt-8 mb-4 px-4">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Archived Tickets</p>
      </div>
      <router-link to="/admin/ssu/archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span class="text">Archives</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">Incident Reports</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Security Operations Center</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-6 animate-fade-in">
        <div class="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-black text-slate-900">Total Incidents</h3>
              <p class="text-sm text-slate-500 font-bold uppercase tracking-wider">March 2026 Analytics</p>
            </div>
          </div>
          <button class="px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-slate-900/20">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            File New Report
          </button>
        </div>

        <div class="bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr class="bg-slate-50/50 border-b border-slate-100 uppercase text-[10px] font-black text-slate-400 tracking-widest">
                <th class="px-8 py-5">Incident ID</th>
                <th class="px-8 py-5">Type / Description</th>
                <th class="px-8 py-5">Severity</th>
                <th class="px-8 py-5">Status</th>
                <th class="px-8 py-5 text-right">Date Reported</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="report in reports" :key="report.id" class="hover:bg-slate-50/80 transition-colors group">
                <td class="px-8 py-6">
                  <span class="text-sm font-black text-slate-900">#{{ report.reportId }}</span>
                </td>
                <td class="px-8 py-6">
                  <div class="flex flex-col">
                    <span class="text-sm font-bold text-slate-800">{{ report.type }}</span>
                    <span class="text-xs text-slate-400 truncate max-w-xs">{{ report.description }}</span>
                  </div>
                </td>
                <td class="px-8 py-6">
                  <span :class="['px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border', getSeverityStyle(report.severity)]">
                    {{ report.severity }}
                  </span>
                </td>
                <td class="px-8 py-6">
                  <span :class="['flex items-center gap-2 text-xs font-bold', getStatusColor(report.status)]">
                    <span :class="['w-2 h-2 rounded-full', getStatusBg(report.status)]"></span>
                    {{ report.status }}
                  </span>
                </td>
                <td class="px-8 py-6 text-right">
                  <span class="text-xs font-bold text-slate-400">{{ report.date }}</span>
                </td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';

const reports = ref([
  {
    id: 1,
    reportId: 'INC-2026-001',
    type: 'Theft / Missing Property',
    description: 'Student reported missing laptop in the main library study area.',
    severity: 'high',
    status: 'Investigation',
    date: 'Mar 28, 2026'
  },
  {
    id: 2,
    reportId: 'INC-2026-002',
    type: 'Facility Vandalism',
    description: 'Minor graffiti found on the exterior wall of Building B.',
    severity: 'low',
    status: 'Resolved',
    date: 'Mar 27, 2026'
  },
  {
    id: 3,
    reportId: 'INC-2026-003',
    type: 'Security Breach',
    description: 'Unauthorized access detected in the laboratory after hours.',
    severity: 'critical',
    status: 'On-going',
    date: 'Mar 26, 2026'
  },
  {
    id: 4,
    reportId: 'INC-2026-004',
    type: 'Disturbance',
    description: 'Loud noise complaint originating from the student dormitory area.',
    severity: 'medium',
    status: 'Closed',
    date: 'Mar 25, 2026'
  }
]);

const getSeverityStyle = (severity) => {
  switch (severity) {
    case 'critical': return 'bg-red-50 text-red-600 border-red-200';
    case 'high': return 'bg-orange-50 text-orange-600 border-orange-200';
    case 'medium': return 'bg-amber-50 text-amber-600 border-amber-200';
    case 'low': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    default: return 'bg-slate-50 text-slate-600 border-slate-200';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Investigation': return 'text-orange-600';
    case 'On-going': return 'text-blue-600';
    case 'Resolved': return 'text-emerald-600';
    case 'Closed': return 'text-slate-500';
    default: return 'text-slate-600';
  }
};

const getStatusBg = (status) => {
  switch (status) {
    case 'Investigation': return 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]';
    case 'On-going': return 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]';
    case 'Resolved': return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]';
    case 'Closed': return 'bg-slate-400';
    default: return 'bg-slate-300';
  }
};
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
