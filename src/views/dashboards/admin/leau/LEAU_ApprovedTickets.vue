<template>
  <MainLayout>
    <template #header-title>
      <h2 class="text-xl font-bold text-slate-900 tracking-tight truncate">
        LEAU Approved Tickets
      </h2>
    </template>

    <template #main-content>
      <ApprovedTicketsWorkspace
        unit-code="LEAU"
        unit-title="Landscaping &amp; Environmental Aesthetics Unit"
        assign-route="/admin/leau/assign-workers"
        :store="leauStore"
      />
    </template>
  </MainLayout>
</template>

<script setup>
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import ApprovedTicketsWorkspace from '@/components/dispatch/ApprovedTicketsWorkspace.vue';
import { useLeauPersonnelStore } from '@/stores/leauPersonnel';

const leauStore = useLeauPersonnelStore();
</script>
