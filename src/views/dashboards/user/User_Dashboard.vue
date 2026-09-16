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
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">Requestor Dashboard</h2>
        <p class="text-sm font-semibold text-slate-600 hidden sm:block">Welcome back, {{ userName }}</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-6 sm:space-y-8 animate-fade-in">

        <!-- Deactivated Account Notice Banner -->
        <div v-if="authStore.isDeactivated" class="rounded-2xl border border-orange-200/90 bg-gradient-to-r from-orange-50/90 via-amber-50/80 to-orange-50/90 p-5 sm:p-6 shadow-sm">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex items-start gap-3.5">
              <div class="p-3 rounded-xl bg-orange-100 text-orange-700 shrink-0 mt-0.5">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <div>
                <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                  <h4 class="text-base font-black text-orange-950">Account Deactivated</h4>
                  <span class="px-2.5 py-0.5 text-xs font-black rounded-full bg-orange-200 text-orange-900">Requests Disabled</span>
                </div>
                <p class="text-sm text-orange-900 font-medium max-w-2xl leading-relaxed">
                  Your account has been deactivated by the administrator. You can review your past tickets and profile, but you cannot submit new service requests. Please visit or contact the GSO office to reactivate your account.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Identity Verification Pending Notice -->
        <div v-else-if="!isUserVerified" class="rounded-2xl border border-amber-200/90 bg-gradient-to-r from-amber-50/90 via-orange-50/80 to-amber-50/90 p-5 sm:p-6 shadow-sm">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex items-start gap-3.5">
              <div class="p-3 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                  <h4 class="text-base font-black text-amber-950">Institutional ID Verification Under Review</h4>
                  <span class="px-2.5 py-0.5 text-xs font-black rounded-full bg-amber-200 text-amber-900">Pending Approval</span>
                </div>
                <p class="text-sm text-amber-950 font-medium max-w-2xl leading-relaxed">
                  Your registration is complete and your institutional ID card photo has been queued for Super Administrator verification. You can freely explore the portal; service request submission will be enabled once your identity is confirmed.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Hero CTA Banner -->
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 p-6 sm:p-8 shadow-xl">
          <!-- Background decorations -->
          <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute -top-12 -right-12 w-56 h-56 bg-white/5 rounded-full blur-2xl"></div>
            <div class="absolute -bottom-8 -left-8 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
            <div class="absolute top-1/2 right-24 w-32 h-32 bg-emerald-400/10 rounded-full blur-xl"></div>
          </div>

          <div class="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div class="max-w-xl">
              <p class="text-emerald-200 text-xs sm:text-sm font-black uppercase tracking-wider mb-1.5">Quick Action</p>
              <h3 class="text-white text-2xl sm:text-3xl font-black leading-tight">Need campus assistance?</h3>
              <p class="text-emerald-100 text-sm sm:text-base font-medium mt-1.5 leading-relaxed">Submit a new service request to the GSO in seconds.</p>
            </div>
            <button
              v-if="authStore.hasPermission('tickets.create') && isUserVerified && !authStore.isDeactivated"
              @click="$router.push('/services')"
              class="w-full sm:w-auto min-h-[48px] group flex items-center justify-center gap-2.5 bg-white hover:bg-emerald-50 text-emerald-800 font-black px-6 py-3.5 rounded-xl shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shrink-0 text-sm sm:text-base cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
              </svg>
              New Service Request
            </button>
            <div
              v-else-if="authStore.isDeactivated"
              class="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-950/50 text-orange-100 font-bold px-4 py-3 rounded-xl border border-orange-400/40 text-sm shadow-inner min-h-[44px]"
            >
              <svg class="h-4 w-4 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <span>Requests Disabled (Deactivated)</span>
            </div>
            <div
              v-else-if="!isUserVerified"
              class="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-900/50 text-emerald-100 font-bold px-4 py-3 rounded-xl border border-emerald-500/30 text-sm shadow-inner min-h-[44px]"
            >
              <svg class="h-4 w-4 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Submissions Locked (ID Pending)</span>
            </div>
          </div>
        </div>


        <!-- Recent Activity — Ticket Status Updates -->
        <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <!-- Section header -->
          <div class="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-1.5 h-6 rounded-full bg-emerald-500"></div>
              <h3 class="text-base sm:text-lg font-black text-slate-900">Ticket Status Updates</h3>
            </div>
            <router-link to="/user/tickets" class="text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1.5">
              View All
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
          </div>

          <!-- Empty state -->
          <div v-if="recentUpdates.length === 0" class="py-16 flex flex-col items-center text-center px-6">
            <div class="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p class="text-base font-black text-slate-700 mb-1">No recent activity</p>
            <p class="text-sm text-slate-500 font-medium">Your ticket updates will appear here.</p>
          </div>

          <!-- Ticket list -->
          <div v-else class="divide-y divide-slate-100">
            <div
              v-for="update in recentUpdates"
              :key="update.ticketId"
              @click="navigateToTicket(update.ticketId)"
              class="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 px-5 sm:px-6 py-4.5 hover:bg-slate-50/80 transition-colors cursor-pointer"
            >
              <div class="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                <!-- Status indicator -->
                <div class="flex-shrink-0 mt-0.5 sm:mt-0">
                  <div class="relative w-11 h-11 rounded-xl flex items-center justify-center" :class="getUpdateIconBg(update.status)">
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
                    <p class="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                      {{ update.service || update.title }}
                    </p>
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wide border" :class="getStatusBadge(update.status)">
                      <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDot(update.status)"></span>
                      {{ update.statusLabel || update.status }}
                    </span>
                  </div>
                  <p class="text-sm text-slate-500 mt-1 truncate">Ticket <span class="font-bold text-slate-700 font-mono">#{{ update.ticketId }}</span></p>

                  <div v-if="update.status === 'resolved' && (update.unit === 'FGMU' || update.unit === 'LEAU')" class="mt-2 flex items-center gap-1.5 text-amber-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                    </svg>
                    <p class="text-xs font-bold">Action Required: Click here to rate and close</p>
                  </div>
                </div>
              </div>

              <!-- Date & arrow -->
              <div class="flex-shrink-0 flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <p class="text-xs sm:text-sm text-slate-500 font-semibold">{{ update.time }}</p>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/api/client';
import { useNetworkStatus } from '@/utils/networkMonitor';

const router     = useRouter();
const authStore  = useAuthStore();
const userName   = ref('');
const isUserVerified = computed(() => {
  const v = authStore.user?.is_verified;
  return v === 1 || v === true || v === '1';
});
const { onReconnected } = useNetworkStatus();
let unregisterReconnected = null;

const userTickets      = ref([]);
const completedTickets = ref([]);

// Deduplicated unified ticket collection by unique ticket ID
const allTickets = computed(() => {
  const map = new Map();
  for (const t of completedTickets.value) {
    if (t.ticketId) map.set(t.ticketId, { ...t, isArchived: true });
  }
  for (const t of userTickets.value) {
    if (t.ticketId) map.set(t.ticketId, { ...t, isArchived: false });
  }
  return Array.from(map.values());
});

const recentUpdates = computed(() => {
  const sorted = [...allTickets.value].sort((a, b) => {
    const timeA = new Date(a.completed_at || a.submitted_at || 0).getTime();
    const timeB = new Date(b.completed_at || b.submitted_at || 0).getTime();
    return timeB - timeA;
  });

  return sorted.slice(0, 6).map(t => ({
    ticketId: t.ticketId,
    title: t.title,
    service: t.service,
    unit: t.unit,
    description: `Status is ${t.statusLabel || t.status}`,
    time: t.date,
    status: t.status,
    statusLabel: t.statusLabel,
    isArchived: t.isArchived,
  }));
});

const navigateToTicket = (ticketId) => {
  const ticket = allTickets.value.find(t => t.ticketId === ticketId);
  const isArchived = ticket?.isArchived || ['closed', 'completed', 'declined', 'rejected', 'cancelled'].includes(ticket?.status);

  if (isArchived) {
    router.push({ path: '/user/completed-tickets', query: { highlight: ticketId } });
  } else {
    router.push({ path: '/user/tickets', query: { highlight: ticketId } });
  }
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
    cancelled:     'bg-slate-100',
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
    cancelled:     'text-slate-400',
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
    cancelled:     'bg-slate-100 text-slate-600 border-slate-200',
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
    cancelled:     'bg-slate-400',
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
        title: t.title,
        service: t.service_type,
        status: t.status,
        statusLabel: t.status_label,
        date: new Date(t.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        submitted_at: t.submitted_at,
        completed_at: t.completed_at || t.updated_at,
        unit: t.unit_code
      }));
    }

    if (completedRes.data?.data?.tickets) {
      completedTickets.value = completedRes.data.data.tickets.map(t => ({
        ticketId: t.id,
        title: t.title,
        service: t.service_type,
        status: t.status,
        statusLabel: t.status_label,
        date: new Date(t.completed_at || t.updated_at || t.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        submitted_at: t.submitted_at,
        completed_at: t.completed_at || t.updated_at,
        unit: t.unit_code
      }));
    }
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
  }
};

let pollingInterval = null;

const handleFocusOrVisibility = () => {
  if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
    fetchDashboardData();
  }
};

onMounted(() => {
  userName.value = authStore.user?.first_name || authStore.fullName || 'User';
  fetchDashboardData();
  pollingInterval = setInterval(() => {
    if (document.hidden) return;
    fetchDashboardData();
  }, 35000);

  window.addEventListener('focus', handleFocusOrVisibility);
  document.addEventListener('visibilitychange', handleFocusOrVisibility);

  unregisterReconnected = onReconnected(() => {
    fetchDashboardData();
  });
});

onUnmounted(() => {
  window.removeEventListener('focus', handleFocusOrVisibility);
  document.removeEventListener('visibilitychange', handleFocusOrVisibility);
  if (unregisterReconnected) unregisterReconnected();
  if (pollingInterval) clearInterval(pollingInterval);
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
