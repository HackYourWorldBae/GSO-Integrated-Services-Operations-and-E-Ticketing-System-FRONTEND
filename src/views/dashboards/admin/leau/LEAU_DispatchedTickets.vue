<template>
  <MainLayout>
    <template #header-title>
      <h2 class="text-xl font-bold text-slate-900 tracking-tight truncate">
        LEAU Scheduled Tickets
      </h2>
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
