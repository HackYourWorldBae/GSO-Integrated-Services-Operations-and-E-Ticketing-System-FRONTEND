<template>
  <MainLayout>
    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">LEAU Operations</h2>
        <p class="text-xs text-emerald-600 font-black tracking-wider uppercase">Approved Tickets &amp; Service Queue</p>
      </div>
    </template>

    <template #main-content>
      <ApprovedTicketsWorkspace
        unit-code="LEAU"
        unit-title="Landscaping &amp; Environmental Affairs Unit"
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
