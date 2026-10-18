<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isTutorialModalOpen"
        class="fixed inset-0 z-[160] flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto"
        @click.self="closeTutorialModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-confirm-title"
      >
        <div
          class="bg-white rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-2xl border border-slate-200/90 my-auto flex flex-col overflow-hidden animate-scale-up relative"
        >
          <!-- Ambient Glow in Modal Header -->
          <div class="absolute -top-14 -right-14 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none"></div>

          <!-- Header / Icon Anchor -->
          <div class="flex items-start justify-between gap-3 relative z-10">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-2xl shadow-xs shrink-0">
                <span>{{ activePageData?.icon || activeRoleData?.roleIcon || '🧭' }}</span>
              </div>
              <div class="min-w-0">
                <span class="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                  {{ activeRoleData?.roleBadge || 'Interactive Guide' }}
                </span>
                <h3 id="tutorial-confirm-title" class="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug mt-1 truncate">
                  Start Page Tutorial?
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
          <div class="mt-4 space-y-4 relative z-10">
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <div class="flex items-center justify-between gap-2">
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Target Page:
                </span>
                <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200/60">
                  Current View
                </span>
              </div>

              <div class="flex items-center gap-2.5">
                <span class="text-xl shrink-0">{{ activePageData?.icon }}</span>
                <h4 class="font-black text-sm text-slate-900 tracking-tight">
                  {{ activePageData?.name }}
                </h4>
              </div>

              <p class="text-xs text-slate-600 leading-relaxed font-medium">
                {{ activePageData?.summary }}
              </p>

              <!-- Quick Checklist of what the interactive tour spotlights -->
              <div class="pt-2.5 border-t border-slate-200/70 space-y-2 text-xs text-slate-700">
                <div class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="font-semibold text-slate-700">Spotlight key action buttons &amp; controls</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="font-semibold text-slate-700">Guide queue management &amp; table filters</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="font-semibold text-slate-700">Real-time status updates &amp; alerts tips</span>
                </div>
              </div>
            </div>

            <!-- Optional Page Switcher -->
            <div class="space-y-1.5">
              <button
                type="button"
                @click="showPageSelector = !showPageSelector"
                class="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center justify-between w-full py-1 cursor-pointer transition-colors"
              >
                <span>Want to tour a different page?</span>
                <span class="text-emerald-600 text-xs font-bold flex items-center gap-1">
                  {{ showPageSelector ? 'Hide selection ▲' : 'Choose page ▼' }}
                </span>
              </button>

              <div v-if="showPageSelector" class="pt-1 animate-fade-in">
                <select
                  :value="activePageData?.id"
                  @change="selectPage($event.target.value)"
                  class="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer shadow-xs"
                >
                  <option v-for="p in activeRoleData.pages" :key="p.id" :value="p.id">
                    {{ p.icon }} {{ p.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Actions / CTA Buttons -->
          <div class="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3 relative z-10">
            <button
              type="button"
              @click="closeTutorialModal"
              class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer min-h-[44px] text-center"
            >
              Not Now
            </button>
            <button
              type="button"
              @click="handleStartTour"
              class="flex-1 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer min-h-[44px] flex items-center justify-center gap-2 text-center"
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
import { ref, onMounted, onUnmounted } from 'vue';
import { useTutorial } from '@/composables/useTutorial';

const {
  isTutorialModalOpen,
  activeRoleData,
  activePageData,
  closeTutorialModal,
  selectPage,
  startPageTour
} = useTutorial();

const showPageSelector = ref(false);

const handleStartTour = () => {
  const pageId = activePageData.value?.id;
  closeTutorialModal();
  showPageSelector.value = false;
  // Brief pause so confirmation modal fades before Driver.js highlights the page
  setTimeout(() => {
    startPageTour(pageId);
  }, 100);
};

// Keyboard shortcut (Escape to close, Enter to start tour)
const handleKeyDown = (e) => {
  if (!isTutorialModalOpen.value) return;
  if (e.key === 'Escape') {
    closeTutorialModal();
  } else if (e.key === 'Enter' && !showPageSelector.value) {
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
