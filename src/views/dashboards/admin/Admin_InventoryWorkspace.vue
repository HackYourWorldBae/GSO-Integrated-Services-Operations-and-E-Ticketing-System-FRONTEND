<template>
  <MainLayout>
    <template #header-title>
      <h2 class="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
        {{ pageTitle }}
      </h2>
    </template>

    <template #main-content>
      <UnifiedInventoryManagement
        :unit-code="currentUnit"
        :embedded="false"
        :default-tab="defaultTab"
      />
    </template>
  </MainLayout>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import UnifiedInventoryManagement from '@/components/inventory/UnifiedInventoryManagement.vue';

const props = defineProps({
  unitCode: {
    type: String,
    default: '',
  },
  defaultTab: {
    type: String,
    default: 'tools',
  },
});

const route = useRoute();

const currentUnit = computed(() => {
  if (props.unitCode) return props.unitCode.toUpperCase();
  if (route.meta && route.meta.unit) return String(route.meta.unit).toUpperCase();
  return route.path.includes('/leau') ? 'LEAU' : 'FGMU';
});

const pageTitle = computed(() =>
  `${currentUnit.value} Inventory & Materials Management`
);
</script>
