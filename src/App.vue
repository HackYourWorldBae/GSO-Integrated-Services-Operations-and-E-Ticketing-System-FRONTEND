<script setup>
import { onMounted, onUnmounted } from 'vue';
import { RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useIdleTimeout } from '@/composables/useIdleTimeout';
import IdleTimeoutModal from '@/components/IdleTimeoutModal.vue';

const authStore = useAuthStore();
const { isWarningVisible, remainingSeconds, stayLoggedIn, logoutNow } = useIdleTimeout();

onMounted(() => {
  // If user has an active session (e.g. restored from sessionStorage across refreshes),
  // start proactive session heartbeat immediately.
  const hasToken = !!(authStore.token || sessionStorage.getItem('token'));
  const hasUser  = !!(authStore.user  || sessionStorage.getItem('auth'));

  if (hasToken && hasUser) {
    authStore.startSessionHeartbeat();
  }
});

onUnmounted(() => {
  authStore.stopSessionHeartbeat();
});
</script>

<template>
  <RouterView />
  <IdleTimeoutModal
    :is-open="isWarningVisible"
    :remaining-seconds="remainingSeconds"
    @stay-logged-in="stayLoggedIn"
    @logout="logoutNow"
  />
</template>