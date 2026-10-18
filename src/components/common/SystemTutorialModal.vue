<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isTutorialModalOpen"
        class="fixed inset-0 z-[160] flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md overflow-y-auto"
        @click.self="closeTutorialModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-modal-title"
      >
        <div
          class="bg-white rounded-3xl w-full max-w-4xl p-5 sm:p-7 shadow-2xl border border-slate-200/90 my-auto max-h-[92vh] flex flex-col overflow-hidden animate-scale-up"
        >
          <!-- Header -->
          <div class="flex items-center justify-between pb-4 border-b border-slate-200/80 shrink-0 gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 shadow-2xs">
                <span class="text-xl sm:text-2xl">{{ activeRoleData.roleIcon }}</span>
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 id="tutorial-modal-title" class="text-lg sm:text-xl font-black text-slate-900 tracking-tight truncate">
                    Portal User Manual &amp; Guides
                  </h3>
                  <span class="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    {{ activeRoleData.roleLabel }}
                  </span>
                </div>
                <p class="text-xs text-slate-500 font-medium mt-0.5 truncate">
                  Page-by-page feature walkthrough, button actions, and interactive navigation.
                </p>
              </div>
            </div>

            <!-- Close Button -->
            <button
              type="button"
              @click="closeTutorialModal"
              class="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Close Manual"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Page Navigation Tabs (Horizontal Scrollable) -->
          <div class="pt-4 pb-3 border-b border-slate-100 shrink-0">
            <div class="flex items-center justify-between mb-2 px-1">
              <span class="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Select Page to Explore:
              </span>
              <span v-if="activePageData" class="text-[11px] font-bold text-slate-500">
                Page {{ currentPageIndex + 1 }} of {{ activeRoleData.pages.length }}
              </span>
            </div>

            <div class="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
              <button
                v-for="page in activeRoleData.pages"
                :key="page.id"
                type="button"
                @click="selectPage(page.id)"
                :class="[
                  'px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer touch-manipulation min-h-[40px]',
                  activePageData?.id === page.id
                    ? 'bg-slate-900 text-white shadow-xs font-black ring-2 ring-slate-900/10'
                    : 'bg-slate-100/90 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                ]"
              >
                <span>{{ page.icon }}</span>
                <span>{{ page.name }}</span>
                <span
                  v-if="isCurrentRoute(page.route)"
                  class="text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider flex items-center gap-1"
                  :class="activePageData?.id === page.id ? 'bg-emerald-400 text-slate-950' : 'bg-emerald-100 text-emerald-800'"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Active Page
                </span>
              </button>
            </div>
          </div>

          <!-- Active Page Content (Scrollable) -->
          <div v-if="activePageData" class="flex-1 overflow-y-auto custom-scrollbar py-5 space-y-6">

            <!-- Interactive Tour Hero Callout for the Selected Page -->
            <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm border border-emerald-800/60">
              <div class="space-y-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Interactive Page Walkthrough
                  </span>
                  <span
                    v-if="isCurrentRoute(activePageData.route)"
                    class="text-[10px] font-black uppercase tracking-wider bg-slate-800 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30"
                  >
                    You are on this page
                  </span>
                </div>
                <h4 class="text-base sm:text-lg font-black text-white">
                  {{ activePageData.name }} Feature Tour
                </h4>
                <p class="text-xs text-slate-300 max-w-xl leading-relaxed">
                  Spotlight every action button, search filter, and queue directly on your screen.
                </p>
              </div>

              <div class="flex items-center gap-2 shrink-0 flex-wrap">
                <!-- Go to this page button (if not currently looking at it) -->
                <button
                  v-if="!isCurrentRoute(activePageData.route)"
                  type="button"
                  @click="navigateToPage(activePageData.route)"
                  class="px-4 py-2.5 min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-wider border border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Navigate directly to this page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span>Go to Page</span>
                </button>

                <!-- Start Interactive Tour -->
                <button
                  type="button"
                  @click="startPageTour(activePageData.id)"
                  class="px-5 py-2.5 min-h-[44px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Start Tour on This Page</span>
                </button>
              </div>
            </div>

            <!-- Page Summary Card -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                Page Purpose &amp; Overview
              </h4>
              <p class="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {{ activePageData.summary }}
              </p>
            </div>

            <!-- Action Buttons & Features Directory -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span>Page Action Buttons &amp; Features</span>
                  <span class="text-[10px] text-slate-400 font-normal">({{ activePageData.features.length }} Elements)</span>
                </h4>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  v-for="(feat, idx) in activePageData.features"
                  :key="idx"
                  class="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-all space-y-2 flex flex-col justify-between"
                >
                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2 min-w-0">
                        <span class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-black flex items-center justify-center shrink-0 border border-emerald-200/60">
                          {{ feat.icon }}
                        </span>
                        <h5 class="text-xs font-black text-slate-900 truncate">{{ feat.name }}</h5>
                      </div>
                      <span class="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
                        {{ feat.location }}
                      </span>
                    </div>
                    <p class="text-xs text-slate-600 leading-relaxed font-medium">
                      {{ feat.desc }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3-Step Recommended Workflow on this Page -->
            <div v-if="activePageData.steps && activePageData.steps.length > 0" class="space-y-3">
              <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span>Recommended Page Workflow</span>
                <span class="text-[10px] text-slate-400 font-normal">({{ activePageData.steps.length }} Steps)</span>
              </h4>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div
                  v-for="(step, idx) in activePageData.steps"
                  :key="idx"
                  class="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-2"
                >
                  <div class="flex items-center gap-2">
                    <span class="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-black flex items-center justify-center shadow-xs">
                      {{ idx + 1 }}
                    </span>
                    <h5 class="text-xs font-black text-slate-900 truncate">{{ step.title }}</h5>
                  </div>
                  <p class="text-xs text-slate-600 leading-relaxed font-medium">
                    {{ step.desc }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Page Pro-Tips & Shortcuts -->
            <div v-if="activePageData.tips && activePageData.tips.length > 0" class="space-y-3">
              <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider">
                Pro-Tips for {{ activePageData.name }}
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  v-for="(tip, idx) in activePageData.tips"
                  :key="idx"
                  class="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/60 flex items-start gap-3"
                >
                  <div class="w-7 h-7 rounded-lg bg-white border border-emerald-200 text-emerald-800 flex items-center justify-center shrink-0 text-xs shadow-2xs">
                    {{ tip.icon }}
                  </div>
                  <div class="min-w-0">
                    <h6 class="text-xs font-bold text-emerald-950">{{ tip.title }}</h6>
                    <p class="text-xs text-slate-600 mt-0.5 leading-normal font-medium">{{ tip.desc }}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Modal Footer -->
          <div class="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <div class="flex items-center gap-2 text-xs text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Tip: You can press <kbd class="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px] font-mono font-bold text-slate-700">Esc</kbd> anytime to close this manual.</span>
            </div>

            <div class="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                @click="closeTutorialModal"
                class="px-5 py-2.5 min-h-[44px] rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close Manual
              </button>
            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue';
import { useTutorial } from '@/composables/useTutorial';

const {
  isTutorialModalOpen,
  activeRoleData,
  activePageData,
  isCurrentRoute,
  closeTutorialModal,
  selectPage,
  navigateToPage,
  startPageTour
} = useTutorial();

const currentPageIndex = computed(() => {
  const pages = activeRoleData.value?.pages || [];
  return pages.findIndex(p => p.id === activePageData.value?.id);
});
</script>

<style scoped>
.animate-scale-up {
  animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes scaleUp {
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
