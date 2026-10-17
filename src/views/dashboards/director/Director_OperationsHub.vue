<template>
  <MainLayout>
    <template #sidebar-links>
      <DirectorSidebar />
    </template>

    <template #header-title>
      <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
        Central Operations Hub
      </h2>
    </template>

    <template #main-content>
      <div class="max-w-[1600px] mx-auto pb-12">
        <OperationsHubView />
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import DirectorSidebar from './DirectorSidebar.vue';
import OperationsHubView from '@/components/director/OperationsHubView.vue';
</script>
