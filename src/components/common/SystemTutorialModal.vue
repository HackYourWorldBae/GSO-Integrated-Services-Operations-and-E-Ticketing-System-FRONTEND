<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isTutorialModalOpen"
        class="fixed inset-0 z-[160] flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto"
        @click.self="closeTutorialModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-confirm-title"
      >
        <div
          class="bg-white rounded-3xl w-full max-w-sm sm:max-w-md p-5 sm:p-7 shadow-2xl border border-slate-200/90 my-auto flex flex-col overflow-hidden animate-scale-up relative"
        >
          <!-- Ambient Glow in Modal Header -->
          <div class="absolute -top-14 -right-14 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none"></div>

          <!-- Header / Icon Anchor -->
          <div class="flex items-start justify-between gap-3 relative z-10">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-xl sm:text-2xl shadow-xs shrink-0">
                <span>{{ activePageData?.icon || activeRoleData?.roleIcon || '🧭' }}</span>
              </div>
              <div class="min-w-0">
                <span class="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                  {{ activeRoleData?.roleBadge || 'Interactive Guide' }}
                </span>
                <h3 id="tutorial-confirm-title" class="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug mt-0.5 truncate">
                  Start {{ activePageData?.name || 'Page' }} Tutorial?
                </h3>
              </div>
            </div>

            <!-- Close 'X' Button -->
            <button
              type="button"
              @click="closeTutorialModal"
              class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body / Target Page Spotlight Card -->
          <div class="mt-4 space-y-3.5 relative z-10">
            <div class="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <div class="flex items-center justify-between gap-2">
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Current View:
                </span>
                <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200/60">
                  {{ activePageData?.name }}
                </span>
              </div>

              <p class="text-xs text-slate-600 leading-relaxed font-medium">
                {{ activePageData?.summary }}
              </p>

              <!-- Dynamic Checklist of what this tour covers -->
              <div class="pt-2 border-t border-slate-200/70 space-y-2 text-xs text-slate-700">
                <div
                  v-for="(section, idx) in previewSections"
                  :key="idx"
                  class="flex items-start gap-2"
                >
                  <svg class="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <div class="min-w-0">
                    <span class="font-bold text-slate-900">{{ section.title }}</span>
                    <span v-if="section.desc" class="text-slate-500 font-medium block text-[11px] leading-tight mt-0.5">
                      {{ section.desc }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions / CTA Buttons: Start or Cancel -->
          <div class="mt-5 pt-3.5 border-t border-slate-100 flex items-center gap-2.5 sm:gap-3 relative z-10">
            <button
              type="button"
              @click="closeTutorialModal"
              class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer min-h-[44px] text-center touch-manipulation"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="handleStartTour"
              class="flex-1 px-4 sm:px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer min-h-[44px] flex items-center justify-center gap-2 text-center touch-manipulation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Start Tutorial</span>
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
  activeRoleData,
  activePageData,
  closeTutorialModal,
  startPageTour
} = useTutorial();

const previewSections = computed(() => {
  if (activePageData.value?.sections?.length) {
    return activePageData.value.sections.slice(0, 3);
  }
  if (activePageData.value?.tourSteps?.length) {
    return activePageData.value.tourSteps.slice(0, 3).map(s => ({
      title: s.title,
      desc: s.desc
    }));
  }
  return [
    { title: 'Overview & Key Metrics', desc: 'Main indicators and operational status' },
    { title: 'Search & Action Toolbar', desc: 'Find records and execute page commands' },
    { title: 'Interactive Content & Cards', desc: 'Detailed view and management controls' }
  ];
});

const handleStartTour = () => {
  const pageId = activePageData.value?.id;
  closeTutorialModal();
  setTimeout(() => {
    startPageTour(pageId);
  }, 120);
};

// Keyboard shortcut (Escape to cancel, Enter to start tour)
const handleKeyDown = (e) => {
  if (!isTutorialModalOpen.value) return;
  if (e.key === 'Escape') {
    closeTutorialModal();
  } else if (e.key === 'Enter') {
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
    transform: scale(0.96) translateY(6px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
