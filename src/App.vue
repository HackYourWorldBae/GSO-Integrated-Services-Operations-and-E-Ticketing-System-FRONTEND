<script setup>
import { onMounted, onUnmounted } from 'vue';
import { RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

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
</template>