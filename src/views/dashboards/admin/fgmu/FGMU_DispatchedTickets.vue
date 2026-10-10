<template>
  <MainLayout>
    <template #header-title>
      <h2 class="text-xl font-bold text-slate-900 tracking-tight truncate">
        FGMU Scheduled Tickets
      </h2>
    </template>

    <template #main-content>
      <ScheduledTicketsWorkspace
        unit-code="FGMU"
        unit-title="Facilities &amp; Grounds Management Unit"
      />
    </template>
  </MainLayout>
</template>

<script setup>
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import ScheduledTicketsWorkspace from '@/components/dispatch/ScheduledTicketsWorkspace.vue';
</script>
