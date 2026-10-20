<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isTutorialModalOpen"
        class="fixed inset-0 z-[160] flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto"
        @click.self="closeTutorialModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="page-guide-modal-title"
      >
        <div
          class="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200/90 my-auto flex flex-col overflow-hidden animate-scale-up relative"
        >
          <!-- Ambient Glow Background -->
          <div class="absolute -top-20 -right-20 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-20 -left-20 w-56 h-56 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <!-- ─── HEADER BAR ──────────────────────────────────────────────── -->
          <div class="p-5 sm:p-6 pb-4 border-b border-slate-100 bg-white/95 backdrop-blur-xs relative z-10 shrink-0">
            <div class="flex items-start justify-between gap-3">
              <!-- Page Title & Icon (SVG, No Emojis) -->
              <div class="flex items-center gap-3.5 min-w-0">
                <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shadow-xs shrink-0 select-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="inline-flex items-center text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {{ activePageData?.manualSection || activeRoleData?.roleBadge || 'Page Guide' }}
                    </span>
                    <span v-if="activePageData?.roleBadge" class="inline-flex items-center text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      {{ activePageData?.roleBadge }}
                    </span>
                  </div>
                  <h2 id="page-guide-modal-title" class="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug mt-1 truncate">
                    {{ activePageData?.name || 'Page Overview' }}
                  </h2>
                </div>
              </div>

              <!-- Top Right Controls: Optional Switcher & Close Button -->
              <div class="flex items-center gap-2 shrink-0">
                <!-- Page Switcher (Without Emojis) -->
                <div v-if="availablePages && availablePages.length > 1" class="relative hidden sm:block">
                  <label for="guide-page-select" class="sr-only">Switch Page</label>
                  <select
                    id="guide-page-select"
                    :value="activePageData?.id"
                    @change="onPageSelectChange"
                    class="appearance-none pl-2.5 pr-7 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer transition-all max-w-[140px] truncate"
                  >
                    <option
                      v-for="page in availablePages"
                      :key="page.id"
                      :value="page.id"
                    >
                      {{ page.name }}
                    </option>
                  </select>
                  <div class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <!-- Close 'X' Button -->
                <button
                  type="button"
                  @click="closeTutorialModal"
                  class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="Close (Esc)"
                  aria-label="Close Guide"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- ─── SIMPLE PAGE MESSAGE BODY ─────────────────────────────────── -->
          <div class="p-5 sm:p-6 space-y-4 bg-slate-50/50">
            <!-- Mobile Page Switcher (Without Emojis) -->
            <div v-if="availablePages && availablePages.length > 1" class="sm:hidden">
              <label for="guide-page-select-mobile" class="block text-xs font-bold text-slate-500 mb-1">Select Page</label>
              <div class="relative">
                <select
                  id="guide-page-select-mobile"
                  :value="activePageData?.id"
                  @change="onPageSelectChange"
                  class="w-full appearance-none pl-3 pr-8 py-2 rounded-xl bg-white text-slate-700 font-semibold text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
                >
                  <option
                    v-for="page in availablePages"
                    :key="page.id"
                    :value="page.id"
                  >
                    {{ page.name }}
                  </option>
                </select>
                <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Page Summary Message -->
            <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <p class="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {{ activePageData?.summary || 'Welcome to this page. You can start the interactive tutorial to learn how to navigate and use its features step-by-step.' }}
              </p>
            </div>

            <!-- Tour Overview Note -->
            <div v-if="activePageData?.tourSteps?.length" class="flex items-center gap-2 text-xs text-slate-500 font-medium px-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Includes a {{ activePageData.tourSteps.length }}-step interactive walkthrough of key features on this page.</span>
            </div>
          </div>

          <!-- ─── FOOTER ACTIONS: CANCEL & START TUTORIAL ───────────────────── -->
          <div class="p-4 sm:p-5 px-5 sm:px-6 border-t border-slate-100 bg-white/95 backdrop-blur-xs flex items-center justify-end gap-3 relative z-10 shrink-0">
            <button
              type="button"
              @click="closeTutorialModal"
              class="px-4 sm:px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer min-h-[40px] text-center active:scale-95"
            >
              Cancel
            </button>

            <button
              type="button"
              @click="handleStartTour"
              class="px-5 sm:px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer min-h-[40px] flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
import { onMounted, onUnmounted } from 'vue';
import { useTutorial } from '@/composables/useTutorial';

const {
  isTutorialModalOpen,
  activeRoleData,
  availablePages,
  activePageData,
  selectPage,
  closeTutorialModal,
  startPageTour
} = useTutorial();

// Switch active page guide from dropdown
const onPageSelectChange = (e) => {
  const pageId = e.target.value;
  selectPage(pageId);
};

const handleStartTour = () => {
  const pageId = activePageData.value?.id;
  closeTutorialModal();
  setTimeout(() => {
    startPageTour(pageId);
  }, 120);
};

// Keyboard shortcuts: Escape to cancel, Enter to start tutorial
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
