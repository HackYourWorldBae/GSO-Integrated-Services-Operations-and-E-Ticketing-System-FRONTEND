<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md select-none pointer-events-auto"
      >
        <div
          class="my-auto relative w-full max-w-md bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 transform transition-all animate-modal-pop text-center space-y-6 max-h-[calc(100dvh-2rem)] sm:max-h-[90vh] overflow-y-auto shadow-2xl pointer-events-auto"
        >
          <!-- Animated Maintenance Icon -->
          <div class="mx-auto w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-sm relative">
            <svg class="w-8 h-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span class="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
            </span>
          </div>

          <!-- Header & Message -->
          <div class="space-y-2">
            <h3 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              System Under Maintenance
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-sm mx-auto">
              {{ message || 'The system is undergoing scheduled maintenance. Your session will close shortly.' }}
            </p>
          </div>

          <!-- Countdown Display -->
          <div class="space-y-1.5">
            <p class="text-xs font-bold uppercase tracking-wider text-slate-400">
              Logging out in
            </p>
            <div class="inline-flex items-center justify-center px-6 py-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 shadow-xs">
              <span class="text-3xl sm:text-4xl font-black tabular-nums tracking-tight">
                {{ remainingSeconds }}
              </span>
              <span class="text-xs font-bold uppercase tracking-wider ml-2 text-rose-600">
                seconds
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="pt-1">
            <button
              type="button"
              @click="$emit('logout')"
              class="w-full py-3 px-5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-rose-600 hover:bg-rose-700 active:scale-95 shadow-md shadow-rose-600/20 transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Log Out Now</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  remainingSeconds: {
    type: Number,
    default: 30,
  },
  message: {
    type: String,
    default: '',
  },
});

defineEmits(['logout']);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes modalPop {
  0% {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-modal-pop {
  animation: modalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
