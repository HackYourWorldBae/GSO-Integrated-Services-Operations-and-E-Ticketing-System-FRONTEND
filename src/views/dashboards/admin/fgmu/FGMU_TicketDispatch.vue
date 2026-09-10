<template>
  <MainLayout>
    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">FGMU Operations</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Ticket Dispatch &amp; Work Scheduling</p>
      </div>
    </template>

    <template #main-content>
      <TicketDispatchWorkspace
        unit-code="FGMU"
        unit-title="Facilities &amp; Grounds Management Unit"
        :store="fgmuStore"
      />
    </template>
  </MainLayout>
</template>

<script setup>
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import TicketDispatchWorkspace from '@/components/dispatch/TicketDispatchWorkspace.vue';
import { useFgmuPersonnelStore } from '@/stores/fgmuPersonnel';

const fgmuStore = useFgmuPersonnelStore();
</script>
