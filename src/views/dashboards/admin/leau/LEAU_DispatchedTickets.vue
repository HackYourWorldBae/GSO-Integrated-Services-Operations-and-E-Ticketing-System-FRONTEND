<template>
  <MainLayout>
    <template #header-title>
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
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
      <ScheduledTicketsWorkspace
        unit-code="LEAU"
        unit-title="Landscaping &amp; Environmental Aesthetics Unit"
      />
    </template>
  </MainLayout>
</template>

<script setup>
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import ScheduledTicketsWorkspace from '@/components/dispatch/ScheduledTicketsWorkspace.vue';
</script>
