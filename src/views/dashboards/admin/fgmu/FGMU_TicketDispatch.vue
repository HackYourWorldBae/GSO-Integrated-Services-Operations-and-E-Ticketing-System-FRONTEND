<template>
  <MainLayout>
    <template #header-title>
      <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
        FGMU Operations
      </h2>
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
