<template>
  <MainLayout>
    <template #header-title>
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <router-link to="/admin/leau" class="p-1 -ml-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="Back to LEAU Home">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </router-link>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none">LEAU Scheduled Tickets</h2>
          <span class="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider border border-amber-200">
            Awaiting Implementation
          </span>
        </div>
        <p class="text-[10px] text-amber-700 font-extrabold tracking-[0.2em] uppercase mt-1">
          Landscaping &amp; Environmental Aesthetics Unit
        </p>
      </div>
    </template>

    <template #main-content>
      <div class="px-3 sm:px-8 pt-4 max-w-[1600px] mx-auto">
        <div class="flex items-center gap-1.5 flex-wrap bg-white rounded-2xl border border-slate-200 p-1.5 shadow-xs w-fit">
          <button
            type="button"
            @click="activeTab = 'jobs'"
            :class="['px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer', activeTab === 'jobs' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100']"
          >
            Job Schedules
          </button>
          <button
            type="button"
            @click="activeTab = 'borrowing'"
            :class="['px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer', activeTab === 'borrowing' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100']"
          >
            Borrowing Requests (Awaiting Pickup Date)
          </button>
        </div>
      </div>
      <div v-if="activeTab === 'jobs'">
        <ScheduledTicketsWorkspace
          unit-code="LEAU"
          unit-title="Landscaping &amp; Environmental Aesthetics Unit"
        />
      </div>
      <div v-else class="px-3 sm:px-8 py-4 max-w-[1600px] mx-auto">
        <BorrowingWorkspace initial-tab="awaiting" />
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import ScheduledTicketsWorkspace from '@/components/dispatch/ScheduledTicketsWorkspace.vue';
import BorrowingWorkspace from '@/components/dispatch/BorrowingWorkspace.vue';

const route = useRoute();
const activeTab = ref(route.query.tab === 'borrowing' ? 'borrowing' : 'jobs');

watch(() => route.query.tab, (v) => {
  if (v === 'borrowing') activeTab.value = 'borrowing';
});

onMounted(() => {
  if (route.query.tab === 'borrowing') activeTab.value = 'borrowing';
});
</script>
