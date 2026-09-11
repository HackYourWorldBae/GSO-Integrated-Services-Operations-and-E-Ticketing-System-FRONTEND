<template>
  <MainLayout>
    <template #header-title>
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <router-link to="/admin/fgmu" class="p-1 -ml-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="Back to FGMU Home">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </router-link>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none">FGMU Active Tickets</h2>
          <span class="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider border border-emerald-200">
            Work in Progress
          </span>
        </div>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase mt-1">
          Facilities &amp; Grounds Management Unit
        </p>
      </div>
    </template>

    <template #main-content>
      <ActiveTicketsWorkspace
        unit-code="FGMU"
        unit-title="Facilities &amp; Grounds Management Unit"
      />
    </template>
  </MainLayout>
</template>

<script setup>
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import ActiveTicketsWorkspace from '@/components/dispatch/ActiveTicketsWorkspace.vue';
</script>
