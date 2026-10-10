<template>
  <MainLayout>
    <template #header-title>
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none">LEAU Approved Tickets</h2>
          <span class="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider border border-amber-200">
            Awaiting Dispatch
          </span>
        </div>
        <p class="text-[10px] text-amber-600 font-extrabold tracking-[0.2em] uppercase mt-1">
          Landscaping &amp; Environmental Aesthetics Unit
        </p>
      </div>
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
