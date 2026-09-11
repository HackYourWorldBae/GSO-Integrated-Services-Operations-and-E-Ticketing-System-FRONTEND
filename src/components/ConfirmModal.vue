<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  type: {
    type: String,
    default: 'danger' // 'danger', 'warning', 'success', 'purple'
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

defineEmits(['confirm', 'cancel']);
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-auto">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="!isLoading && $emit('cancel')"></div>
      <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-6 sm:p-8 relative z-10 transform transition-all animate-modal-pop border border-slate-100">
        <div class="flex items-center gap-4 mb-4">
          <div :class="[
            'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border',
            type === 'danger' ? 'bg-rose-50 text-rose-600 border-rose-100' :
            type === 'warning' ? 'bg-amber-50 text-amber-600 border-amber-100' :
            type === 'purple' ? 'bg-purple-50 text-purple-600 border-purple-100' :
            'bg-emerald-50 text-emerald-600 border-emerald-100'
          ]">
            <!-- Danger icon -->
            <svg v-if="type === 'danger'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <!-- Warning icon -->
            <svg v-else-if="type === 'warning'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <!-- Purple / Info icon -->
            <svg v-else-if="type === 'purple'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <!-- Success icon -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 class="text-xl font-black text-slate-900 leading-tight">{{ title }}</h3>
          </div>
        </div>

        <p v-if="message" class="text-slate-600 text-sm font-medium mb-4 leading-relaxed whitespace-pre-line">{{ message }}</p>

        <!-- Slot for custom contents like reason input or user badge -->
        <div v-if="$slots.default" class="mb-6">
          <slot></slot>
        </div>

        <div class="flex items-center justify-end gap-3 pt-2">
          <button 
            type="button" 
            :disabled="isLoading"
            @click="$emit('cancel')" 
            class="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {{ cancelText }}
          </button>
          <button 
            type="button" 
            :disabled="isLoading"
            @click="$emit('confirm')" 
            :class="[
              'px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer',
              type === 'danger' ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20' :
              type === 'warning' ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20' :
              type === 'purple' ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20' :
              'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
            ]"
          >
            <svg v-if="isLoading" class="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ confirmText }}</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes modal-pop {
  0% { opacity: 0; transform: scale(0.95) translateY(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-modal-pop {
  animation: modal-pop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
