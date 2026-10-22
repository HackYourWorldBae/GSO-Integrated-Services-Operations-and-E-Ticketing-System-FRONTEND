<template>
  <MainLayout>
    <template #header-title>
      <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
        FGMU Personnel Management
      </h2>
    </template>

    <template #main-content>
      <Admin_PersonnelWorkspace unit-code="FGMU" />
    </template>
  </MainLayout>
</template>

<script setup>
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import Admin_PersonnelWorkspace from '../Admin_PersonnelWorkspace.vue';
</script>
