<template>
  <MainLayout>
    <template #header-title>
      <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
        FGMU Materials Library
      </h2>
    </template>

    <template #main-content>
      <Admin_MaterialsLibrary unit-code="FGMU" unit-name="Facilities &amp; Grounds Management Unit (FGMU)" />
    </template>
  </MainLayout>
</template>

<script setup>
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import Admin_MaterialsLibrary from '../Admin_MaterialsLibrary.vue';
</script>
