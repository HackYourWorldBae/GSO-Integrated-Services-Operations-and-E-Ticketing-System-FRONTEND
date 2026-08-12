<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/user/dashboard" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <span class="text">Dashboard</span>
      </router-link>
      <router-link to="/user/tickets" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
        <span class="text">My Tickets</span>
      </router-link>
      <div class="mt-8 mb-4 px-4">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Archived Tickets</p>
      </div>
      <router-link to="/user/completed-tickets" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span class="text">Completed Tickets</span>
      </router-link>

      <div class="my-4 border-t border-white/5 mx-2"></div>

      <router-link to="/user/edit-profile" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span class="text">Account Settings</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">Requestor Dashboard</h2>
        <p class="text-xs font-medium text-slate-500 hidden sm:block">Welcome back, {{ userName }}</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-6 animate-fade-in">

        <!-- Hero CTA Banner -->
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 p-8 shadow-xl">
          <!-- Background decorations -->
          <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute -top-12 -right-12 w-56 h-56 bg-white/5 rounded-full blur-2xl"></div>
            <div class="absolute -bottom-8 -left-8 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
            <div class="absolute top-1/2 right-24 w-32 h-32 bg-emerald-400/10 rounded-full blur-xl"></div>
          </div>

          <div class="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p class="text-emerald-200 text-xs font-bold uppercase tracking-widest mb-1">Quick Action</p>
              <h3 class="text-white text-2xl font-black leading-tight">Need campus assistance?</h3>
              <p class="text-emerald-200/80 text-sm mt-1">Submit a new service request to the GSO in seconds.</p>
            </div>
            <button
              @click="$router.push('/services')"
              class="group flex items-center gap-2.5 bg-white hover:bg-emerald-50 text-emerald-700 font-black px-6 py-3.5 rounded-xl shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
              </svg>
              New Service Request
            </button>
          </div>
        </div>

        <!-- Metric Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="metric in metrics"
            :key="metric.label"
            @click="metric.onClick"
            class="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-transparent hover:shadow-lg cursor-pointer transition-all duration-300"
            :class="metric.hoverShadow"
          >
            <!-- Top accent bar on hover -->
            <div class="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" :class="metric.accentBar"></div>

            <div class="flex items-start justify-between mb-4">
              <div class="p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110" :class="metric.iconBg">
                <component :is="metric.icon" class="h-5 w-5" :class="metric.iconColor" />
              </div>
              <span class="text-[10px] font-black uppercase tracking-widest mt-0.5" :class="metric.labelColor">{{ metric.tag }}</span>
            </div>
            <div>
              <p class="text-3xl font-black text-slate-900 tabular-nums leading-none mb-1">{{ metric.value }}</p>
              <p class="text-xs font-semibold text-slate-500">{{ metric.label }}</p>
            </div>
          </div>
        </div>

        <!-- Recent Activity — Ticket Status Updates -->
        <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <!-- Section header -->
          <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-1 h-5 rounded-full bg-emerald-500"></div>
              <h3 class="text-base font-black text-slate-900">Ticket Status Updates</h3>
            </div>
            <router-link to="/user/tickets" class="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1">
              View All
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
          </div>

          <!-- Empty state -->
          <div v-if="recentUpdates.length === 0" class="py-16 flex flex-col items-center text-center px-6">
            <div class="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p class="text-sm font-bold text-slate-600 mb-1">No recent activity</p>
            <p class="text-xs text-slate-400">Your ticket updates will appear here.</p>
          </div>

          <!-- Ticket list -->
          <div v-else class="divide-y divide-slate-50">
            <div
              v-for="update in recentUpdates"
              :key="update.ticketId"
              @click="navigateToTicket(update.ticketId)"
              class="group flex items-center gap-4 px-6 py-4 hover:bg-slate-50/70 transition-colors cursor-pointer"
            >
              <!-- Status indicator -->
              <div class="flex-shrink-0">
                <div class="relative w-10 h-10 rounded-xl flex items-center justify-center" :class="getUpdateIconBg(update.status)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="getUpdateIconColor(update.status)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <!-- Pulse ring for active tickets -->
                  <span v-if="update.status === 'processing'" class="absolute inset-0 rounded-xl ring-2 ring-blue-300 animate-ping opacity-60"></span>
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <p class="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors truncate">
                    {{ update.service }}
                  </p>
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide border" :class="getStatusBadge(update.status)">
                    <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDot(update.status)"></span>
                    {{ update.statusLabel || update.status }}
                  </span>
                </div>
                <p class="text-xs text-slate-400 mt-0.5 truncate">Ticket <span class="font-bold text-slate-500">{{ update.ticketId }}</span></p>
                <div v-if="update.status === 'resolved' && (update.unit === 'FGMU' || update.unit === 'LEAU')" class="mt-1.5 flex items-center gap-1.5 text-amber-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                  <p class="text-[10px] font-bold">Action Required: Click here to rate and close</p>
                </div>
              </div>

              <!-- Date & arrow -->
              <div class="flex-shrink-0 flex items-center gap-3">
                <p class="text-[11px] text-slate-400 font-medium hidden sm:block">{{ update.time }}</p>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed, h } from 'vue';
import { useRouter } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/api/client';

const router     = useRouter();
const authStore  = useAuthStore();
const userName   = ref('');

const userTickets      = ref([]);
const completedTickets = ref([]);

const openTicketsCount    = computed(() => userTickets.value.filter(t => t.status === 'processing' || t.status === 'in_progress').length);
const pendingTicketsCount = computed(() => userTickets.value.filter(t => t.status === 'pending').length);
const resolvedTicketsCount = computed(() => completedTickets.value.length);
const totalRequestsCount  = computed(() => userTickets.value.length + completedTickets.value.length);

// SVG icon components inline for metric cards
const TicketIcon = { render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' })]) };
const ClockIcon  = { render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' })]) };
const CheckIcon  = { render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })]) };
const ChartIcon  = { render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })]) };

const metrics = computed(() => [
  {
    label: 'Open Tickets',
    value: openTicketsCount.value,
    tag: 'Ongoing',
    icon: TicketIcon,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    labelColor: 'text-blue-400',
    accentBar: 'bg-gradient-to-r from-blue-400 to-blue-600',
    hoverShadow: 'hover:shadow-blue-500/10',
    onClick: () => router.push({ path: '/user/tickets', query: { status: 'processing' } }),
  },
  {
    label: 'Pending Tickets',
    value: pendingTicketsCount.value,
    tag: 'Reviewing',
    icon: ClockIcon,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    labelColor: 'text-amber-400',
    accentBar: 'bg-gradient-to-r from-amber-400 to-amber-500',
    hoverShadow: 'hover:shadow-amber-500/10',
    onClick: () => router.push({ path: '/user/tickets', query: { status: 'pending' } }),
  },
  {
    label: 'Resolved Tickets',
    value: resolvedTicketsCount.value,
    tag: 'Finished',
    icon: CheckIcon,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    labelColor: 'text-emerald-400',
    accentBar: 'bg-gradient-to-r from-emerald-400 to-emerald-600',
    hoverShadow: 'hover:shadow-emerald-500/10',
    onClick: () => router.push('/user/completed-tickets'),
  },
  {
    label: 'Total Requests',
    value: totalRequestsCount.value,
    tag: 'History',
    icon: ChartIcon,
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    labelColor: 'text-slate-400',
    accentBar: 'bg-gradient-to-r from-slate-400 to-slate-600',
    hoverShadow: 'hover:shadow-slate-500/10',
    onClick: () => router.push('/user/tickets'),
  },
]);

const recentUpdates = computed(() => {
  const all = [...userTickets.value];
  return all.slice(-6).reverse().map(t => ({
    ticketId: t.ticketId,
    service: t.service,
    unit: t.unit,
    description: `Status is ${t.statusLabel || t.status}`,
    time: t.date,
    status: t.status,
    statusLabel: t.statusLabel,
  }));
});

const navigateToTicket = (ticketId) => {
  router.push({ path: '/user/tickets', query: { highlight: ticketId } });
};

// Status styling helpers for activity feed
const getUpdateIconBg = (status) => {
  const map = {
    pending:       'bg-amber-50',
    processing:    'bg-blue-50',
    'in-progress': 'bg-blue-50',
    approved:      'bg-blue-50',
    scheduled:     'bg-blue-50',
    completed:     'bg-emerald-50',
    resolved:      'bg-emerald-50',
    closed:        'bg-slate-100',
    declined:      'bg-rose-50',
    rejected:      'bg-rose-50',
  };
  return map[status] || 'bg-slate-100';
};

const getUpdateIconColor = (status) => {
  const map = {
    pending:       'text-amber-500',
    processing:    'text-blue-500',
    'in-progress': 'text-blue-500',
    approved:      'text-blue-500',
    scheduled:     'text-blue-500',
    completed:     'text-emerald-600',
    resolved:      'text-emerald-600',
    closed:        'text-slate-500',
    declined:      'text-rose-500',
    rejected:      'text-rose-500',
  };
  return map[status] || 'text-slate-500';
};

const getStatusBadge = (status) => {
  const map = {
    pending:       'bg-amber-50 text-amber-600 border-amber-200',
    processing:    'bg-blue-50 text-blue-600 border-blue-200',
    'in-progress': 'bg-blue-50 text-blue-600 border-blue-200',
    approved:      'bg-blue-50 text-blue-600 border-blue-200',
    scheduled:     'bg-blue-50 text-blue-600 border-blue-200',
    completed:     'bg-emerald-50 text-emerald-600 border-emerald-200',
    resolved:      'bg-emerald-50 text-emerald-600 border-emerald-200',
    closed:        'bg-slate-100 text-slate-500 border-slate-200',
    declined:      'bg-rose-50 text-rose-600 border-rose-200',
    rejected:      'bg-rose-50 text-rose-600 border-rose-200',
  };
  return map[status] || 'bg-slate-50 text-slate-500 border-slate-200';
};

const getStatusDot = (status) => {
  const map = {
    pending:       'bg-amber-500',
    processing:    'bg-blue-500',
    'in-progress': 'bg-blue-500',
    approved:      'bg-blue-500',
    scheduled:     'bg-blue-500',
    completed:     'bg-emerald-500',
    resolved:      'bg-emerald-500',
    closed:        'bg-slate-400',
    declined:      'bg-rose-500',
    rejected:      'bg-rose-500',
  };
  return map[status] || 'bg-slate-400';
};

const fetchDashboardData = async () => {
  try {
    const [activeRes, completedRes] = await Promise.all([
      api.get('tickets/my-requests'),
      api.get('tickets/completed'),
    ]);

    if (activeRes.data?.data?.tickets) {
      userTickets.value = activeRes.data.data.tickets.map(t => ({
        ticketId: t.id,
        service: t.service_type,
        status: t.status,
        statusLabel: t.status_label,
        date: new Date(t.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        unit: t.unit_code
      }));
    }

    if (completedRes.data?.data?.tickets) {
      completedTickets.value = completedRes.data.data.tickets.map(t => ({
        ticketId: t.id,
        service: t.service_type,
        status: t.status,
        statusLabel: t.status_label,
        date: new Date(t.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        unit: t.unit_code
      }));
    }
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
  }
};

onMounted(() => {
  userName.value = authStore.user?.first_name || authStore.fullName || 'User';
  fetchDashboardData();
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
