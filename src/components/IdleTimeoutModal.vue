<template>
  <Teleport to="body">
    <Transition name="fade">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-md select-none pointer-events-auto"
      >
        <div 
          class="my-auto relative w-full max-w-md bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 transform transition-all animate-modal-pop text-center space-y-6 max-h-[calc(100dvh-2rem)] sm:max-h-[88vh] overflow-y-auto shadow-2xl pointer-events-auto"
        >
          <!-- Animated Warning Icon -->
          <div class="mx-auto w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm relative">
            <svg class="w-8 h-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span class="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
            </span>
          </div>

          <!-- Header and Explanatory Copy -->
          <div class="space-y-2">
            <h3 class="text-xl font-black text-slate-900 tracking-tight">
              Session Inactivity Warning
            </h3>
            <p class="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              You have been inactive for 14 minutes. For security and privacy, your session will automatically end in:
            </p>
          </div>

          <!-- Big Countdown Display -->
          <div class="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-amber-500/10 border border-amber-300 text-amber-700">
            <span class="text-3xl sm:text-4xl font-black tabular-nums tracking-tight">
              {{ remainingSeconds }}
            </span>
            <span class="text-xs font-bold uppercase tracking-wider ml-2 text-amber-600">
              seconds
            </span>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              @click="$emit('logout')"
              class="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer min-h-[44px]"
            >
              Log Out Now
            </button>
            <button
              type="button"
              @click="$emit('stay-logged-in')"
              class="w-full sm:flex-1 py-3 px-5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-md shadow-emerald-600/20 transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Stay Logged In</span>
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
    required: true
  },
  remainingSeconds: {
    type: Number,
    default: 60
  }
});

defineEmits(['stay-logged-in', 'logout']);
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
