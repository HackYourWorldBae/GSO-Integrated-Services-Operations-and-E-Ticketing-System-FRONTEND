<script setup>
import { computed } from 'vue';
import { useNetworkStatus } from '@/utils/networkMonitor';

const { isOnline, isChecking, checkHealth, wasOffline } = useNetworkStatus();

// Automatically show the green restored banner for the duration that wasOffline remains true after coming back online
const isRestored = computed(() => isOnline.value && wasOffline.value);
const shouldShowBanner = computed(() => !isOnline.value || isRestored.value);

const manualRetry = async () => {
  await checkHealth();
};
</script>

<template>
  <Teleport to="body">
    <Transition name="network-banner-slide">
      <div
        v-if="shouldShowBanner"
        id="global-network-fault-banner"
        class="fixed top-4 left-1/2 -translate-x-1/2 z-[99999] px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold transition-all backdrop-blur-md border pointer-events-auto select-none"
        :class="[
          !isOnline
            ? 'bg-rose-950/95 text-rose-100 border-rose-500/40 shadow-rose-950/50'
            : 'bg-emerald-950/95 text-emerald-100 border-emerald-500/40 shadow-emerald-950/50'
        ]"
      >
        <!-- Offline pulsating dot -->
        <span v-if="!isOnline" class="flex h-2.5 w-2.5 relative shrink-0">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
        </span>
        <!-- Restored steady dot -->
        <span v-else class="flex h-2.5 w-2.5 rounded-full bg-emerald-400 shrink-0"></span>

        <!-- Status message -->
        <span class="font-medium tracking-wide">
          {{ !isOnline ? 'Internet connection lost. Reconnecting...' : 'Connection restored! Synchronizing data...' }}
        </span>

        <!-- Manual Retry button when offline -->
        <button
          v-if="!isOnline"
          type="button"
          @click="manualRetry"
          :disabled="isChecking"
          class="ml-1.5 px-2.5 py-1 bg-white/10 hover:bg-white/20 active:scale-95 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
        >
          {{ isChecking ? 'Checking...' : 'Retry Now' }}
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.network-banner-slide-enter-active,
.network-banner-slide-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.network-banner-slide-enter-from,
.network-banner-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, -24px) scale(0.95);
}
</style>
