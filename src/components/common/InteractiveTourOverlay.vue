<template>
  <Teleport to="body">
    <div
      v-if="isTourActive && activeTourSteps.length > 0"
      class="gso-interactive-tour-container"
    >
      <VOnboardingWrapper
        ref="wrapperRef"
        :steps="activeTourSteps"
        :options="wrapperOptions"
        @finish="handleTourFinish"
        @exit="handleTourExit"
      >
        <template #default="{ step, next, previous, exit, isFirst, isLast, index }">
          <VOnboardingStep>
            <template #default>
              <div
                class="tour-card bg-slate-900/95 backdrop-blur-xl text-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-white/20 w-[92vw] sm:w-[420px] max-w-[440px] pointer-events-auto transition-all animate-scale-up"
              >
                <!-- Card Header -->
                <div class="flex items-center justify-between gap-2.5 pb-2.5 border-b border-white/10">
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                      Step {{ index + 1 }} of {{ activeTourSteps.length }}
                    </span>
                    <span v-if="activeTourPage?.name" class="text-xs text-slate-400 font-bold truncate">
                      {{ activeTourPage.name }}
                    </span>
                  </div>

                  <!-- Close Button -->
                  <button
                    type="button"
                    @click="handleTourSkip"
                    class="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
                    title="Exit Tour (Esc)"
                    aria-label="Exit Interactive Tour"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- Step Content (Clean SVG icon, No Emojis) -->
                <div class="py-3">
                  <h4 class="text-base sm:text-lg font-black text-white tracking-tight leading-snug flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{{ step?.content?.title || 'System Walkthrough' }}</span>
                  </h4>
                  <p class="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed mt-2 text-justify sm:text-left">
                    {{ step?.content?.description || '' }}
                  </p>
                </div>

                <!-- Progress Bar -->
                <div class="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div
                    class="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 h-full rounded-full transition-all duration-300"
                    :style="{ width: `${((index + 1) / activeTourSteps.length) * 100}%` }"
                  ></div>
                </div>

                <!-- Card Footer Controls -->
                <div class="flex items-center justify-between gap-2.5 mt-4 pt-3 border-t border-white/10">
                  <button
                    v-if="!isFirst"
                    type="button"
                    @click="handleStepPrevious(previous)"
                    class="px-3.5 py-1.5 min-h-[36px] rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-95 flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Back</span>
                  </button>
                  <div v-else></div>

                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      @click="handleTourSkip"
                      class="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 font-semibold transition-colors cursor-pointer"
                    >
                      Skip
                    </button>
                    <button
                      type="button"
                      @click="isLast ? handleTourFinishClick() : handleStepNext(next)"
                      class="px-4 py-1.5 min-h-[36px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{{ isLast ? 'Finish Tour' : 'Next' }}</span>
                      <svg v-if="!isLast" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </VOnboardingStep>
        </template>
      </VOnboardingWrapper>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { VOnboardingWrapper, VOnboardingStep, useVOnboarding } from 'v-onboarding';
import 'v-onboarding/dist/style.css';
import { useTutorial } from '@/composables/useTutorial';

const {
  isTourActive,
  activeTourSteps,
  activeTourPage,
  endTour,
  cleanupTourHighlights
} = useTutorial();

const wrapperRef = ref(null);
const { start, finish } = useVOnboarding(wrapperRef);

const wrapperOptions = {
  popper: {
    placement: 'bottom',
    modifiers: [
      { name: 'offset', options: { offset: [0, 14] } },
      { name: 'arrow', options: { padding: 12 } },
      { name: 'flip', options: { fallbackPlacements: ['top', 'bottom', 'right', 'left'], padding: 16 } },
      { name: 'preventOverflow', options: { boundary: 'viewport', padding: 16 } }
    ]
  },
  overlay: {
    enabled: true,
    padding: 6,
    borderRadius: 12,
    preventOverlayInteraction: false
  },
  scrollToStep: {
    enabled: true,
    options: {
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest'
    }
  },
  autoFinishByExit: true
};

const handleStepNext = (nextFn) => {
  cleanupTourHighlights();
  if (typeof nextFn === 'function') {
    nextFn();
  }
};

const handleStepPrevious = (prevFn) => {
  cleanupTourHighlights();
  if (typeof prevFn === 'function') {
    prevFn();
  }
};

const handleTourSkip = () => {
  cleanupTourHighlights();
  endTour();
};

const handleTourFinishClick = () => {
  cleanupTourHighlights();
  finish();
  endTour();
};

const handleTourFinish = () => {
  cleanupTourHighlights();
  endTour();
};

const handleTourExit = () => {
  cleanupTourHighlights();
  endTour();
};

// Keyboard listener: Escape to exit/skip tour
const handleKeyDown = (e) => {
  if (!isTourActive.value) return;
  if (e.key === 'Escape') {
    handleTourSkip();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  cleanupTourHighlights();
});

watch(
  isTourActive,
  async (active) => {
    if (active && activeTourSteps.value?.length > 0) {
      cleanupTourHighlights();
      await nextTick();
      // Brief pause to ensure target elements are mounted and layout settles
      setTimeout(() => {
        start();
      }, 150);
    } else {
      cleanupTourHighlights();
    }
  },
  { flush: 'post' }
);
</script>

<style>
/* Scoped & Global Customizations for v-onboarding Spotlight & Arrow */
:root {
  --v-onboarding-overlay-fill: #020617;
  --v-onboarding-overlay-opacity: 0.78;
  --v-onboarding-overlay-z: 9990;
  --v-onboarding-step-z: 9999;
  --v-onboarding-step-arrow-background: #0f172a;
  --v-onboarding-step-arrow-size: 12px;
}

/* Ensure the arrow appears seamless with our slate-900 card */
[data-v-onboarding-wrapper] [data-popper-arrow]:before {
  background: #0f172a !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
}

/* Targeted Button/Control Pinpoint Spotlight Pulsing Ring */
.tour-pinpoint-target {
  outline: 3px solid #10b981 !important;
  outline-offset: 4px !important;
  box-shadow: 0 0 0 6px rgba(16, 185, 129, 0.35), 0 0 25px rgba(16, 185, 129, 0.5) !important;
  animation: tourPinpointPulse 1.8s ease-in-out infinite alternate !important;
  z-index: 9995 !important;
  position: relative !important;
  transition: all 0.2s ease-in-out !important;
}

@keyframes tourPinpointPulse {
  0% {
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.4), 0 0 15px rgba(16, 185, 129, 0.3);
  }
  100% {
    box-shadow: 0 0 0 9px rgba(16, 185, 129, 0.75), 0 0 30px rgba(16, 185, 129, 0.6);
  }
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(4px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-scale-up {
  animation: scaleUp 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Ensure Popper Step Card is constrained to viewport on all screen sizes */
[data-v-onboarding-wrapper] {
  max-width: 100vw !important;
}

.tour-card {
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
}

/* On mobile viewports (≤ 640px), ensure the tour card docks nicely at the bottom
   or stays safely within the visible viewport so elders never have to hunt/scroll */
@media (max-width: 640px) {
  .tour-card {
    width: calc(100vw - 20px) !important;
    max-width: 420px !important;
    margin: 0 auto;
    font-size: 0.95rem;
    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.15) !important;
  }
}
</style>
