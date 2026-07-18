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
    required: true
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
    default: 'danger' // 'danger' or 'warning'
  }
});

defineEmits(['confirm', 'cancel']);
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-auto">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="$emit('cancel')"></div>
      <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 relative z-10 transform transition-all animate-modal-pop">
        <div class="flex items-center gap-4 mb-6">
          <div :class="[
            'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0',
            type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'
          ]">
            <svg v-if="type === 'danger'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <h3 class="text-xl font-black text-slate-900 leading-tight">{{ title }}</h3>
          </div>
        </div>
        <p class="text-slate-500 font-medium mb-8 leading-relaxed">{{ message }}</p>
        <div class="flex items-center justify-end gap-3">
          <button type="button" @click="$emit('cancel')" class="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors">
            {{ cancelText }}
          </button>
          <button type="button" @click="$emit('confirm')" :class="[
            'px-6 py-3 rounded-xl font-bold text-white shadow-md transition-all active:scale-95',
            type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
          ]">
            {{ confirmText }}
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
