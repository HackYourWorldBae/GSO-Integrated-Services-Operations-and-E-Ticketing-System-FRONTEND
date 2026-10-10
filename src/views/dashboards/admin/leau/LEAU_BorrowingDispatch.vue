<template>
  <MainLayout>
    <template #header-title>
      <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
        LEAU Borrowing Dispatch
      </h2>
    </template>

    <template #main-content>
      <BorrowingDispatchWorkspace unit-code="LEAU" />
    </template>
  </MainLayout>
</template>

<script setup>
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import BorrowingDispatchWorkspace from '@/components/dispatch/BorrowingDispatchWorkspace.vue';
</script>
