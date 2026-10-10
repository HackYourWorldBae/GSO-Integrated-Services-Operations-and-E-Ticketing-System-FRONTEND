<template>
  <MainLayout>
    <template #header-title>
      <h2 class="text-xl font-bold text-slate-900 tracking-tight truncate">
        FGMU Approved Tickets
      </h2>
    </template>

    <template #main-content>
      <ApprovedTicketsWorkspace
        unit-code="FGMU"
        unit-title="Facilities &amp; Grounds Management Unit"
        assign-route="/admin/fgmu/assign-workers"
        :store="fgmuStore"
      />
    </template>
  </MainLayout>
</template>

<script setup>
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import ApprovedTicketsWorkspace from '@/components/dispatch/ApprovedTicketsWorkspace.vue';
import { useFgmuPersonnelStore } from '@/stores/fgmuPersonnel';

const fgmuStore = useFgmuPersonnelStore();
</script>
