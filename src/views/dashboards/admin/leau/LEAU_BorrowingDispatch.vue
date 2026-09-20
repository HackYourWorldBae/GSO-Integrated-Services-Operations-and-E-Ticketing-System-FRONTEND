<template>
  <MainLayout>
    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">LEAU Borrowing Dispatch</h2>
        <p class="text-xs text-amber-600 font-black tracking-wider uppercase">Assign Inventory &amp; Set Ready for Pickup</p>
      </div>
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
