<template>
  <MainLayout>
    <template #header-title>
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <router-link to="/admin/leau" class="p-1 -ml-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="Back to LEAU Home">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </router-link>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none">LEAU Borrowing Queue</h2>
          <span class="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider border border-amber-200">
            Pickup • Borrowed • Overdue
          </span>
        </div>
        <p class="text-[10px] text-amber-700 font-extrabold tracking-[0.2em] uppercase mt-1">
          Landscaping &amp; Environmental Aesthetics Unit
        </p>
      </div>
    </template>

    <template #main-content>
      <div class="px-3 sm:px-8 py-4 sm:py-6 max-w-[1600px] mx-auto">
        <BorrowingWorkspace :initial-tab="initialTab" />
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import BorrowingWorkspace from '@/components/dispatch/BorrowingWorkspace.vue';

const route = useRoute();
const initialTab = computed(() => {
  const t = String(route.query.tab || '').toLowerCase();
  return ['awaiting', 'borrowed', 'overdue'].includes(t) ? t : 'awaiting';
});
</script>
