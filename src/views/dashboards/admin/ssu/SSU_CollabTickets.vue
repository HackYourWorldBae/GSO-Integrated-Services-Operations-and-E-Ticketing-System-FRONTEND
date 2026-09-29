<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/admin/ssu" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span class="text">SSU Home</span>
      </router-link>

      <router-link to="/admin/ssu/submitted-tickets" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span class="text">Submitted Tickets</span>
      </router-link>

      <router-link to="/admin/ssu/investigating-tickets" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span class="text">Under Investigation</span>
      </router-link>

      <router-link to="/admin/ssu/collab-tickets" class="nav-item" exact-active-class="router-link-active" active-class="router-link-active">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span class="text">Collab Tickets</span>
      </router-link>

      <router-link to="/admin/ssu/assign-workers" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span class="text">Dispatch Personnel</span>
      </router-link>

      <router-link to="/admin/ssu/personnel" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span class="text">Security Personnel</span>
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
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <router-link to="/admin/ssu" class="p-1 -ml-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="Back to SSU Home">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </router-link>
            <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none">SSU Collab Tickets</h2>
            <span class="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase tracking-wider border border-indigo-200">
              Cross-Unit Operations
            </span>
          </div>
          <p class="text-[10px] text-rose-600 font-extrabold tracking-[0.2em] uppercase mt-1">
            Safety &amp; Security Services Unit
          </p>
        </div>

        <div class="flex items-center gap-2">
          <router-link
            to="/admin/ssu/assign-workers"
            class="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer"
            title="Open SSU Dispatch Panel"
          >
            <svg class="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Open Dispatch Panel</span>
          </router-link>
        </div>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-4 animate-fade-in pb-12">
        <!-- ═══ Collab Stage Tabs ═══ -->
        <div class="bg-white rounded-2xl border border-slate-200/90 p-2 shadow-xs">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 w-full sm:w-auto">
              <!-- Tab 1: Incoming / Awaiting Dispatch -->
              <button
                type="button"
                @click="setTab('approved')"
                :class="[
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer min-h-[40px] touch-manipulation flex-1 sm:flex-none justify-center',
                  activeTab === 'approved'
                    ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <span>Awaiting Dispatch</span>
                <span
                  :class="[
                    'ml-1 px-2 py-0.5 rounded-full text-[10px] font-black leading-none',
                    activeTab === 'approved' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-700'
                  ]"
                >
                  {{ approvedCount }}
                </span>
              </button>

              <!-- Tab 2: Dispatched / Scheduled -->
              <button
                type="button"
                @click="setTab('dispatched')"
                :class="[
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer min-h-[40px] touch-manipulation flex-1 sm:flex-none justify-center',
                  activeTab === 'dispatched'
                    ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Dispatched</span>
                <span
                  :class="[
                    'ml-1 px-2 py-0.5 rounded-full text-[10px] font-black leading-none',
                    activeTab === 'dispatched' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-700'
                  ]"
                >
                  {{ scheduledCount }}
                </span>
              </button>

              <!-- Tab 3: Active Collab (Live Tracking) -->
              <button
                type="button"
                @click="setTab('active')"
                :class="[
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer min-h-[40px] touch-manipulation flex-1 sm:flex-none justify-center',
                  activeTab === 'active'
                    ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                ]"
              >
                <span v-if="activeTab === 'active'" class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Active Collab</span>
                <span
                  :class="[
                    'ml-1 px-2 py-0.5 rounded-full text-[10px] font-black leading-none',
                    activeTab === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  ]"
                >
                  {{ activeCount }}
                </span>
              </button>
            </div>

            <!-- Tab Context Hint -->
            <div class="text-[11px] text-slate-500 font-semibold px-2">
              <span v-if="activeTab === 'approved'">Incoming collaboration requests awaiting SSU dispatch &amp; coordination</span>
              <span v-else-if="activeTab === 'dispatched'">Dispatched collaboration requests scheduled with assigned security officers</span>
              <span v-else-if="activeTab === 'active'">Live cross-unit execution tracking with turnaround duration monitoring</span>
            </div>
          </div>
        </div>

        <!-- ═══ Workspace Views ═══ -->
        <CollabTicketsWorkspace
          v-if="activeTab === 'approved'"
          key="ssu-collab-approved"
          unit-code="SSU"
          mode="approved"
          direction="incoming"
          assign-route="/admin/ssu/assign-workers"
          :show-dispatch-action="true"
          @updated="fetchCounts"
        />

        <CollabTicketsWorkspace
          v-else-if="activeTab === 'dispatched'"
          key="ssu-collab-dispatched"
          unit-code="SSU"
          mode="scheduled"
          direction="all"
          assign-route="/admin/ssu/assign-workers"
          :show-dispatch-action="true"
          @updated="fetchCounts"
        />

        <CollabTicketsWorkspace
          v-else-if="activeTab === 'active'"
          key="ssu-collab-active"
          unit-code="SSU"
          mode="active"
          direction="all"
          assign-route="/admin/ssu/assign-workers"
          :show-dispatch-action="false"
          @updated="fetchCounts"
        />
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import CollabTicketsWorkspace from '@/components/dispatch/CollabTicketsWorkspace.vue';
import { fetchCollabTickets } from '@/api/collaborations';

const route = useRoute();
const router = useRouter();

const resolveInitialTab = (tabQuery) => {
  if (tabQuery === 'dispatched' || tabQuery === 'scheduled') return 'dispatched';
  if (tabQuery === 'active') return 'active';
  return 'approved';
};

const activeTab = ref(resolveInitialTab(route.query.tab));

const approvedCount = ref(0);
const scheduledCount = ref(0);
const activeCount = ref(0);

const setTab = (tab) => {
  activeTab.value = tab;
  router.replace({
    query: {
      ...route.query,
      tab
    }
  });
};

watch(() => route.query.tab, (newTab) => {
  if (newTab) {
    activeTab.value = resolveInitialTab(newTab);
  }
});

const fetchCounts = async () => {
  try {
    const [appRes, schedRes, actRes] = await Promise.all([
      fetchCollabTickets({ stage: 'approved', direction: 'incoming' }),
      fetchCollabTickets({ stage: 'scheduled', direction: 'all' }),
      fetchCollabTickets({ stage: 'active', direction: 'all' })
    ]);
    approvedCount.value = (appRes.data?.data?.tickets || []).length;
    scheduledCount.value = (schedRes.data?.data?.tickets || []).length;
    activeCount.value = (actRes.data?.data?.tickets || []).length;
  } catch (err) {
    console.error('Failed to fetch SSU collab ticket counts:', err);
  }
};

onMounted(() => {
  fetchCounts();
});
</script>
