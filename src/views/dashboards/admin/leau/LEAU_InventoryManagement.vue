<template>
  <MainLayout>
    <template #header-title>
      <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
        LEAU Inventory Management
      </h2>
    </template>

    <template #main-content>
      <Admin_InventoryWorkspace unit-code="LEAU" />
    </template>
  </MainLayout>
</template>

<script setup>
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import Admin_InventoryWorkspace from '../Admin_InventoryWorkspace.vue';
</script>
