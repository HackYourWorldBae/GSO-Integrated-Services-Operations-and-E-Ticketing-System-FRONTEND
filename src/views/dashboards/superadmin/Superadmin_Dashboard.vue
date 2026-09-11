<template>
  <MainLayout>
    <template #header-title>
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none">Super Administrator</h2>
          <span class="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-wider border border-purple-200">Master Governance</span>
        </div>
        <p class="text-xs font-medium text-slate-500 hidden sm:block mt-0.5">System Administration, User Lifecycle & Audit Oversight</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in relative pb-10">

        <!-- Top Vitals KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <!-- Total Users Card -->
          <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group hover:border-purple-300 transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span class="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
                {{ stats.users?.active_users || 0 }} Active
              </span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.users?.total_users || 0 }}</h3>
            <p class="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Total Registered Accounts</p>
          </div>

          <!-- Total Tickets Card -->
          <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span class="text-[10px] font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 uppercase tracking-wider">
                {{ stats.tickets?.pending || 0 }} Pending
              </span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.tickets?.total || 0 }}</h3>
            <p class="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Total System Tickets</p>
          </div>

          <!-- Completed Requests Card -->
          <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span class="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 uppercase tracking-wider">
                {{ stats.tickets?.ongoing || 0 }} Ongoing
              </span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.tickets?.completed || 0 }}</h3>
            <p class="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Resolved & Archived</p>
          </div>

          <!-- Declined Requests Card -->
          <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group hover:border-rose-300 transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span class="text-[10px] font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 uppercase tracking-wider">
                Declined
              </span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.tickets?.declined || 0 }}</h3>
            <p class="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Declined Requests</p>
          </div>

          <!-- Units Oversight Card -->
          <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span class="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200 uppercase tracking-wider">
                FGMU • LEAU • SSU
              </span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">3 Units</h3>
            <p class="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Active Sub-Units</p>
          </div>
        </div>

        <!-- Quick Administration Hub -->
        <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-xl relative overflow-hidden">
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span class="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase tracking-widest border border-purple-500/30 mb-3 inline-block">
                Master Governance Hub
              </span>
              <h3 class="text-2xl font-black tracking-tight">University Account & System Control</h3>
              <p class="text-sm text-slate-300 max-w-xl mt-1 leading-relaxed">
                Provision and manage user roles, audit operational trail events, and monitor real-time ticket execution across all university maintenance units.
              </p>
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <router-link
                to="/superadmin/users"
                class="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>Manage Users</span>
              </router-link>
              <router-link
                to="/superadmin/logs"
                class="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider transition-all border border-white/20 backdrop-blur-sm flex items-center gap-2 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Audit Logs</span>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Two Column Section: Role Breakdown & Unit Health -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Role Distribution Card -->
          <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-base sm:text-lg font-black text-slate-900 tracking-tight">Account Distribution by Role</h4>
                <p class="text-xs text-slate-500 font-medium">Breakdown of active system actors</p>
              </div>
              <router-link to="/superadmin/users" class="text-xs font-bold text-purple-600 hover:text-purple-700">View All →</router-link>
            </div>

            <div class="space-y-3.5">
              <div v-for="(count, rName) in stats.users?.by_role" :key="rName" class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xs font-black uppercase text-slate-700 shadow-xs">
                    {{ rName.charAt(0) }}
                  </div>
                  <span class="text-xs font-bold text-slate-700 capitalize">{{ rName }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-sm font-black text-slate-900 tabular-nums">{{ count }}</span>
                  <div class="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden hidden sm:block">
                    <div
                      class="bg-purple-600 h-full rounded-full"
                      :style="{ width: `${stats.users?.total_users ? (count / stats.users.total_users) * 100 : 0}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Unit Health Overview -->
          <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-base sm:text-lg font-black text-slate-900 tracking-tight">Unit Operational Throughput</h4>
                <p class="text-xs text-slate-500 font-medium">Ticket workload and resolution status</p>
              </div>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time</span>
            </div>

            <div class="space-y-4">
              <!-- FGMU -->
              <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-slate-700"></span>
                    <h5 class="text-sm font-black text-slate-900">Facilities & Grounds (FGMU)</h5>
                  </div>
                  <router-link to="/admin/fgmu" class="text-xs font-bold text-slate-600 hover:text-slate-900">Inspect Queue →</router-link>
                </div>
                <div class="grid grid-cols-4 gap-2 text-center">
                  <div class="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total</span>
                    <span class="text-base font-black text-slate-900 tabular-nums">{{ stats.tickets?.by_unit?.FGMU?.total || 0 }}</span>
                  </div>
                  <div class="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span class="text-[10px] text-amber-600 font-bold uppercase tracking-wider block">Active</span>
                    <span class="text-base font-black text-amber-700 tabular-nums">{{ stats.tickets?.by_unit?.FGMU?.active || 0 }}</span>
                  </div>
                  <div class="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span class="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">Completed</span>
                    <span class="text-base font-black text-emerald-700 tabular-nums">{{ stats.tickets?.by_unit?.FGMU?.completed || 0 }}</span>
                  </div>
                  <div class="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span class="text-[10px] text-rose-600 font-bold uppercase tracking-wider block">Declined</span>
                    <span class="text-base font-black text-rose-700 tabular-nums">{{ stats.tickets?.by_unit?.FGMU?.declined || 0 }}</span>
                  </div>
                </div>
              </div>

              <!-- LEAU -->
              <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-emerald-600"></span>
                    <h5 class="text-sm font-black text-slate-900">Landscaping & Aesthetics (LEAU)</h5>
                  </div>
                  <router-link to="/admin/leau" class="text-xs font-bold text-emerald-600 hover:text-emerald-700">Inspect Queue →</router-link>
                </div>
                <div class="grid grid-cols-4 gap-2 text-center">
                  <div class="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total</span>
                    <span class="text-base font-black text-slate-900 tabular-nums">{{ stats.tickets?.by_unit?.LEAU?.total || 0 }}</span>
                  </div>
                  <div class="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span class="text-[10px] text-amber-600 font-bold uppercase tracking-wider block">Active</span>
                    <span class="text-base font-black text-amber-700 tabular-nums">{{ stats.tickets?.by_unit?.LEAU?.active || 0 }}</span>
                  </div>
                  <div class="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span class="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">Completed</span>
                    <span class="text-base font-black text-emerald-700 tabular-nums">{{ stats.tickets?.by_unit?.LEAU?.completed || 0 }}</span>
                  </div>
                  <div class="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span class="text-[10px] text-rose-600 font-bold uppercase tracking-wider block">Declined</span>
                    <span class="text-base font-black text-rose-700 tabular-nums">{{ stats.tickets?.by_unit?.LEAU?.declined || 0 }}</span>
                  </div>
                </div>
              </div>

              <!-- SSU -->
              <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-stone-700"></span>
                    <h5 class="text-sm font-black text-slate-900">Security Services Unit (SSU)</h5>
                  </div>
                  <router-link to="/admin/ssu" class="text-xs font-bold text-stone-600 hover:text-stone-900">Inspect Queue →</router-link>
                </div>
                <div class="grid grid-cols-4 gap-2 text-center">
                  <div class="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total</span>
                    <span class="text-base font-black text-slate-900 tabular-nums">{{ stats.tickets?.by_unit?.SSU?.total || 0 }}</span>
                  </div>
                  <div class="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span class="text-[10px] text-amber-600 font-bold uppercase tracking-wider block">Active</span>
                    <span class="text-base font-black text-amber-700 tabular-nums">{{ stats.tickets?.by_unit?.SSU?.active || 0 }}</span>
                  </div>
                  <div class="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span class="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">Completed</span>
                    <span class="text-base font-black text-emerald-700 tabular-nums">{{ stats.tickets?.by_unit?.SSU?.completed || 0 }}</span>
                  </div>
                  <div class="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span class="text-[10px] text-rose-600 font-bold uppercase tracking-wider block">Declined</span>
                    <span class="text-base font-black text-rose-700 tabular-nums">{{ stats.tickets?.by_unit?.SSU?.declined || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent System Events Table -->
        <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-lg font-black text-slate-900 tracking-tight">Recent System Activity</h4>
              <p class="text-xs text-slate-500 font-medium">Real-time audit log of operational and security events</p>
            </div>
            <router-link to="/superadmin/logs" class="text-xs font-black text-purple-600 hover:text-purple-700 uppercase tracking-wider">
              Explore All Logs →
            </router-link>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th class="pb-3 px-3">Timestamp</th>
                  <th class="pb-3 px-3">Actor</th>
                  <th class="pb-3 px-3">Ticket ID</th>
                  <th class="pb-3 px-3">Action</th>
                  <th class="pb-3 px-3">Details</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50 text-xs">
                <tr v-for="log in recentLogs" :key="log.id" class="hover:bg-slate-50/60 transition-colors">
                  <td class="py-3 px-3 text-slate-500 font-medium whitespace-nowrap">
                    {{ new Date(log.created_at).toLocaleString() }}
                  </td>
                  <td class="py-3 px-3">
                    <div class="flex flex-col">
                      <span class="font-bold text-slate-800">{{ log.first_name ? `${log.first_name} ${log.last_name}` : 'System' }}</span>
                      <span class="text-[10px] text-slate-400">{{ log.email || 'Automated' }}</span>
                    </div>
                  </td>
                  <td class="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {{ log.ticket_id ? `#${log.ticket_id}` : '—' }}
                  </td>
                  <td class="py-3 px-3">
                    <span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                      {{ log.action }}
                    </span>
                  </td>
                  <td class="py-3 px-3 text-slate-600 truncate max-w-xs">
                    {{ log.details || '—' }}
                  </td>
                </tr>
                <tr v-if="recentLogs.length === 0">
                  <td colspan="5" class="py-8 text-center text-slate-400 font-bold">No recent audit log entries recorded.</td>
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
import { ref, onMounted } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import api from '@/api/client';

const stats = ref({
  users: {
    total_users: 0,
    active_users: 0,
    pending_users: 0,
    suspended_users: 0,
    by_role: {}
  },
  tickets: {
    total: 0,
    pending: 0,
    approved: 0,
    ongoing: 0,
    completed: 0,
    cancelled: 0,
    by_unit: {}
  }
});

const recentLogs = ref([]);

const getRoleBadgeClass = (role) => {
  const map = {
    superadmin: 'bg-purple-100 text-purple-700',
    admin: 'bg-slate-200 text-slate-800',
    dispatcher: 'bg-blue-100 text-blue-700',
    director: 'bg-indigo-100 text-indigo-700',
    worker: 'bg-amber-100 text-amber-700',
    employee: 'bg-emerald-100 text-emerald-700',
    student: 'bg-teal-100 text-teal-700'
  };
  return map[role] || 'bg-slate-100 text-slate-600';
};

const getRoleDescription = (role) => {
  const map = {
    superadmin: 'Full system & user administration',
    admin: 'Unit governance, approval & announcements',
    dispatcher: 'Work order dispatch & scheduling',
    director: 'University-wide executive analytics',
    worker: 'Field execution & material reporting',
    employee: 'Faculty/Staff service requester',
    student: 'Student service requester'
  };
  return map[role] || 'General portal user';
};

const fetchDashboardData = async () => {
  try {
    const statsRes = await api.get('/superadmin/stats');
    if (statsRes.data?.data) {
      stats.value = statsRes.data.data;
    }
  } catch (err) {
    console.error('Failed to load superadmin stats:', err);
  }

  try {
    const logsRes = await api.get('/superadmin/audit-logs?limit=6');
    const logsPayload = logsRes.data?.data || logsRes.data;
    if (logsPayload?.logs) {
      recentLogs.value = logsPayload.logs;
    }
  } catch (err) {
    console.error('Failed to load superadmin recent logs:', err);
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>
