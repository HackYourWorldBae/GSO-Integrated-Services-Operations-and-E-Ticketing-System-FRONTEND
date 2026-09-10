<template>
  <MainLayout>
    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">LEAU Operations</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Landscaping Ticket Dispatch &amp; Work Scheduling</p>
      </div>
    </template>

    <template #main-content>
      <TicketDispatchWorkspace
        unit-code="LEAU"
        unit-title="Landscape &amp; Environment Aesthetics Unit"
        :store="leauStore"
      />
    </template>
  </MainLayout>
</template>

<script setup>
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import TicketDispatchWorkspace from '@/components/dispatch/TicketDispatchWorkspace.vue';
import { useLeauPersonnelStore } from '@/stores/leauPersonnel';

const leauStore = useLeauPersonnelStore();
</script>
