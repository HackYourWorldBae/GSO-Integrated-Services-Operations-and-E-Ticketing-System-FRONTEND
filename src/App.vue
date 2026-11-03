<script setup>
import { onMounted, onUnmounted } from 'vue';
import { RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useOperationsHubStore } from '@/stores/operationsHub';
import { useIdleTimeout } from '@/composables/useIdleTimeout';
import IdleTimeoutModal from '@/components/IdleTimeoutModal.vue';
import MaintenanceEvictionModal from '@/components/MaintenanceEvictionModal.vue';
import GlobalNetworkBanner from '@/components/common/GlobalNetworkBanner.vue';

const authStore = useAuthStore();
const operationsStore = useOperationsHubStore();
const { isWarningVisible, remainingSeconds, stayLoggedIn, logoutNow } = useIdleTimeout();

onMounted(() => {
  // Initialize dynamic institutional working calendar & material catalogs
  operationsStore.initOperationsHub();

  // If user has an active session, start proactive session heartbeat immediately.
  const hasUser = !!(
    authStore.user ||
    (typeof localStorage !== 'undefined' && localStorage.getItem('auth')) ||
    (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('auth'))
  );

  if (hasUser) {
    authStore.startSessionHeartbeat();
  }
});

onUnmounted(() => {
  authStore.stopSessionHeartbeat();
});
</script>

<template>
  <GlobalNetworkBanner />
  <RouterView />
  <IdleTimeoutModal
    :is-open="isWarningVisible"
    :remaining-seconds="remainingSeconds"
    @stay-logged-in="stayLoggedIn"
    @logout="logoutNow"
  />
  <MaintenanceEvictionModal
    :is-open="authStore.showMaintenanceModal"
    :remaining-seconds="authStore.maintenanceCountdown"
    :message="authStore.maintenanceMessage"
    @logout="authStore.executeEvictionLogout"
  />
</template>