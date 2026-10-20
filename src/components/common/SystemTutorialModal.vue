<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isTutorialModalOpen"
        class="fixed inset-0 z-[160] flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto"
        @click.self="closeTutorialModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="page-guide-modal-title"
      >
        <div
          class="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200/90 my-auto flex flex-col overflow-hidden animate-scale-up relative p-6 sm:p-7"
        >
          <!-- Page Name as Guide Title -->
          <h2
            id="page-guide-modal-title"
            class="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug"
          >
            {{ guideTitle }}
          </h2>

          <!-- Simple Page Message -->
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mt-3">
            {{ activePageData?.summary || 'Take a quick interactive walkthrough to learn the key actions and features available on this page.' }}
          </p>

          <!-- Action Buttons: Cancel or Start Guide -->
          <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              @click="closeTutorialModal"
              class="px-4 sm:px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer min-h-[40px] active:scale-95 text-center"
            >
              Cancel
            </button>

            <button
              type="button"
              @click="handleStartTour"
              class="px-5 sm:px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer min-h-[40px] text-center"
            >
              Start Guide
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { useTutorial } from '@/composables/useTutorial';

const {
  isTutorialModalOpen,
  activePageData,
  closeTutorialModal,
  startPageTour
} = useTutorial();

// Format as "[Page Name] Guide"
const guideTitle = computed(() => {
  const name = activePageData.value?.name?.trim();
  if (!name) return 'Page Guide';
  if (/guide$/i.test(name)) return name;
  return `${name} Guide`;
});

const handleStartTour = () => {
  const pageId = activePageData.value?.id;
  closeTutorialModal();
  setTimeout(() => {
    startPageTour(pageId);
  }, 120);
};

// Keyboard shortcuts: Escape to cancel, Enter to start guide
const handleKeyDown = (e) => {
  if (!isTutorialModalOpen.value) return;
  if (e.key === 'Escape') {
    closeTutorialModal();
  } else if (e.key === 'Enter' && !['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) {
    handleStartTour();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.animate-scale-up {
  animation: modalScaleUp 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes modalScaleUp {
  from {
    opacity: 0;
    transform: scale(0.97) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
