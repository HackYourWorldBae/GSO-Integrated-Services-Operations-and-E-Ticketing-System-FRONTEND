<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isTutorialModalOpen"
        class="fixed inset-0 z-[160] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
        @click.self="closeTutorialModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="page-guide-modal-title"
      >
        <div
          class="bg-white rounded-3xl w-full max-w-4xl lg:max-w-5xl max-h-[92vh] shadow-2xl border border-slate-200/90 my-auto flex flex-col overflow-hidden animate-scale-up relative"
        >
          <!-- Ambient Glow Background -->
          <div class="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-24 -left-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <!-- ─── HEADER BAR ──────────────────────────────────────────────── -->
          <div class="p-4 sm:p-6 pb-3 border-b border-slate-100 bg-white/95 backdrop-blur-xs relative z-10 shrink-0">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <!-- Page Title & Icon -->
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-2xl sm:text-3xl shadow-xs shrink-0 select-none">
                  <span>{{ activePageData?.icon || activeRoleData?.roleIcon || '🧭' }}</span>
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      {{ activePageData?.manualSection || activeRoleData?.roleBadge || 'Operational Guide' }}
                    </span>
                    <span v-if="activePageData?.roleBadge" class="inline-flex items-center text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      {{ activePageData?.roleBadge }}
                    </span>
                  </div>
                  <h2 id="page-guide-modal-title" class="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug mt-0.5 truncate">
                    {{ activePageData?.name || 'Page Operational Guide' }}
                  </h2>
                </div>
              </div>

              <!-- Top Right Controls: Page Switcher & Close -->
              <div class="flex items-center gap-2 self-end sm:self-center shrink-0">
                <!-- Page Switcher Dropdown -->
                <div class="relative">
                  <label for="guide-page-select" class="sr-only">Switch Page Guide</label>
                  <select
                    id="guide-page-select"
                    :value="activePageData?.id"
                    @change="onPageSelectChange"
                    class="appearance-none pl-3 pr-8 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer transition-all"
                  >
                    <option
                      v-for="page in availablePages"
                      :key="page.id"
                      :value="page.id"
                    >
                      {{ page.icon }} {{ page.name }}
                    </option>
                  </select>
                  <div class="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <!-- Close 'X' Button -->
                <button
                  type="button"
                  @click="closeTutorialModal"
                  class="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="Close Guide (Esc)"
                  aria-label="Close Guide"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Operational Summary Callout -->
            <div class="mt-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <p class="text-xs text-slate-600 font-medium leading-relaxed">
                {{ activePageData?.summary }}
              </p>
              <button
                type="button"
                @click="handleStartTour"
                class="self-start md:self-center px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer shrink-0 flex items-center gap-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Interactive Tour</span>
              </button>
            </div>

            <!-- Search / Filter Input & Guide Nav Tabs -->
            <div class="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <!-- Internal Guide Tabs -->
              <div class="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none" role="tablist">
                <button
                  type="button"
                  @click="activeTab = 'sections'"
                  :class="[
                    'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5',
                    activeTab === 'sections'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  ]"
                  role="tab"
                  :aria-selected="activeTab === 'sections'"
                >
                  <span>📑 Sections</span>
                  <span class="px-1.5 py-0.2 rounded-full text-[10px] font-black" :class="activeTab === 'sections' ? 'bg-slate-800 text-emerald-400' : 'bg-slate-200 text-slate-600'">
                    {{ activePageData?.sections?.length || 0 }}
                  </span>
                </button>

                <button
                  type="button"
                  @click="activeTab = 'tabs'"
                  :class="[
                    'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5',
                    activeTab === 'tabs'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  ]"
                  role="tab"
                  :aria-selected="activeTab === 'tabs'"
                >
                  <span>🗂️ Tabs & Queues</span>
                  <span class="px-1.5 py-0.2 rounded-full text-[10px] font-black" :class="activeTab === 'tabs' ? 'bg-slate-800 text-emerald-400' : 'bg-slate-200 text-slate-600'">
                    {{ activePageData?.tabs?.length || 0 }}
                  </span>
                </button>

                <button
                  type="button"
                  @click="activeTab = 'buttons'"
                  :class="[
                    'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5',
                    activeTab === 'buttons'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  ]"
                  role="tab"
                  :aria-selected="activeTab === 'buttons'"
                >
                  <span>🔘 Buttons & Actions</span>
                  <span class="px-1.5 py-0.2 rounded-full text-[10px] font-black" :class="activeTab === 'buttons' ? 'bg-slate-800 text-emerald-400' : 'bg-slate-200 text-slate-600'">
                    {{ activePageData?.buttons?.length || 0 }}
                  </span>
                </button>

                <button
                  type="button"
                  @click="activeTab = 'procedures'"
                  :class="[
                    'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5',
                    activeTab === 'procedures'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  ]"
                  role="tab"
                  :aria-selected="activeTab === 'procedures'"
                >
                  <span>📋 Procedures (SOP)</span>
                  <span class="px-1.5 py-0.2 rounded-full text-[10px] font-black" :class="activeTab === 'procedures' ? 'bg-slate-800 text-emerald-400' : 'bg-slate-200 text-slate-600'">
                    {{ activePageData?.procedures?.length || 0 }}
                  </span>
                </button>

                <button
                  type="button"
                  @click="activeTab = 'tour'"
                  :class="[
                    'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5',
                    activeTab === 'tour'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  ]"
                  role="tab"
                  :aria-selected="activeTab === 'tour'"
                >
                  <span>🧭 Tour Steps</span>
                  <span class="px-1.5 py-0.2 rounded-full text-[10px] font-black" :class="activeTab === 'tour' ? 'bg-slate-800 text-emerald-400' : 'bg-slate-200 text-slate-600'">
                    {{ activePageData?.tourSteps?.length || 0 }}
                  </span>
                </button>
              </div>

              <!-- Keyword Search Filter -->
              <div class="relative w-full sm:w-56 shrink-0">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Filter guide topics..."
                  class="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                />
                <svg class="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- ─── SCROLLABLE GUIDE CONTENT BODY ───────────────────────────── -->
          <div class="p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[58vh] bg-slate-50/50">

            <!-- TAB 1: SECTIONS -->
            <div v-if="activeTab === 'sections'" class="space-y-3">
              <div
                v-for="(section, idx) in filteredSections"
                :key="idx"
                class="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all space-y-1.5"
              >
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center text-xs font-black shrink-0">
                    {{ idx + 1 }}
                  </div>
                  <h4 class="text-sm font-black text-slate-900 tracking-tight">
                    {{ section.title }}
                  </h4>
                  <span v-if="section.desc" class="text-[11px] font-bold text-slate-400 ml-auto hidden sm:inline">
                    {{ section.desc }}
                  </span>
                </div>
                <p v-if="section.details" class="text-xs text-slate-600 leading-relaxed font-normal pl-8">
                  {{ section.details }}
                </p>
                <p v-else-if="section.desc" class="text-xs text-slate-600 leading-relaxed font-normal pl-8">
                  {{ section.desc }}
                </p>
              </div>

              <!-- Empty Filter State -->
              <div v-if="filteredSections.length === 0" class="text-center py-8 text-slate-400 text-xs font-medium">
                No page sections match your filter "{{ searchQuery }}".
              </div>
            </div>

            <!-- TAB 2: TABS & QUEUES -->
            <div v-if="activeTab === 'tabs'" class="space-y-3">
              <div
                v-for="(tabItem, idx) in filteredTabs"
                :key="idx"
                class="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all space-y-2"
              >
                <div class="flex items-center justify-between gap-2 flex-wrap">
                  <div class="flex items-center gap-2">
                    <span class="text-base">🗂️</span>
                    <h4 class="text-sm font-black text-slate-900 tracking-tight">
                      {{ tabItem.name }}
                    </h4>
                  </div>
                  <span v-if="tabItem.badge" class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                    {{ tabItem.badge }}
                  </span>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed font-medium">
                  {{ tabItem.desc }}
                </p>
                <div v-if="tabItem.criteria" class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-700 space-y-0.5">
                  <span class="font-bold text-slate-900 block">Stage Entry & Progression Criteria:</span>
                  <span>{{ tabItem.criteria }}</span>
                </div>
              </div>

              <!-- Fallback if no specific tabs defined -->
              <div v-if="filteredTabs.length === 0" class="text-center py-8 text-slate-400 text-xs font-medium">
                {{ searchQuery ? `No tabs match your filter "${searchQuery}".` : 'This page operates as a single unified operational workspace without sub-tabs.' }}
              </div>
            </div>

            <!-- TAB 3: BUTTONS & ACTIONS -->
            <div v-if="activeTab === 'buttons'" class="space-y-3">
              <div
                v-for="(btn, idx) in filteredButtons"
                :key="idx"
                class="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all space-y-2"
              >
                <div class="flex items-center justify-between gap-2 flex-wrap">
                  <div class="flex items-center gap-2">
                    <span
                      class="px-3 py-1 rounded-xl text-xs font-black shadow-xs inline-flex items-center gap-1.5"
                      :class="getButtonBadgeClass(btn.type)"
                    >
                      <span>{{ btn.label }}</span>
                    </span>
                  </div>
                  <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {{ btn.type || 'Action' }}
                  </span>
                </div>

                <p class="text-xs text-slate-700 leading-relaxed font-medium">
                  {{ btn.desc }}
                </p>

                <div v-if="btn.fields" class="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-[11px] text-amber-900 space-y-0.5">
                  <span class="font-bold text-amber-950 block">Modal Fields & Required Inputs:</span>
                  <span>{{ btn.fields }}</span>
                </div>

                <div v-if="btn.result" class="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-[11px] text-emerald-900 space-y-0.5">
                  <span class="font-bold text-emerald-950 block">Operational Outcome & Status Change:</span>
                  <span>{{ btn.result }}</span>
                </div>
              </div>

              <!-- Fallback -->
              <div v-if="filteredButtons.length === 0" class="text-center py-8 text-slate-400 text-xs font-medium">
                {{ searchQuery ? `No actions match your filter "${searchQuery}".` : 'No interactive button definitions configured for this page view.' }}
              </div>
            </div>

            <!-- TAB 4: PROCEDURES (SOP) -->
            <div v-if="activeTab === 'procedures'" class="space-y-3">
              <div
                v-for="(proc, idx) in filteredProcedures"
                :key="idx"
                class="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all space-y-2.5"
              >
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black shrink-0">
                    {{ idx + 1 }}
                  </div>
                  <h4 class="text-sm font-black text-slate-900 tracking-tight">
                    {{ proc.title }}
                  </h4>
                </div>

                <ol class="space-y-1.5 pl-4 sm:pl-8 text-xs text-slate-700 font-medium list-decimal">
                  <li v-for="(step, sIdx) in proc.steps" :key="sIdx" class="leading-relaxed pl-1">
                    {{ step }}
                  </li>
                </ol>
              </div>

              <!-- Fallback -->
              <div v-if="filteredProcedures.length === 0" class="text-center py-8 text-slate-400 text-xs font-medium">
                {{ searchQuery ? `No procedures match your filter "${searchQuery}".` : 'No specific step-by-step procedures defined for this page.' }}
              </div>
            </div>

            <!-- TAB 5: INTERACTIVE TOUR -->
            <div v-if="activeTab === 'tour'" class="space-y-3">
              <div class="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                <div class="flex items-center justify-between gap-2">
                  <div>
                    <h4 class="text-sm font-black text-slate-900 tracking-tight">
                      Interactive Walkthrough Tour
                    </h4>
                    <p class="text-xs text-slate-500 font-medium mt-0.5">
                      Highlights and guides you step-by-step across the actual live components of this page.
                    </p>
                  </div>
                  <button
                    type="button"
                    @click="handleStartTour"
                    class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer shrink-0 flex items-center gap-1.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Launch Tour</span>
                  </button>
                </div>

                <div class="pt-3 border-t border-slate-100 space-y-2">
                  <div
                    v-for="(step, sIdx) in activePageData?.tourSteps"
                    :key="sIdx"
                    class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-2.5"
                  >
                    <div class="w-5 h-5 rounded-md bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                      {{ sIdx + 1 }}
                    </div>
                    <div class="min-w-0">
                      <span class="text-xs font-bold text-slate-900 block">{{ step.title }}</span>
                      <span class="text-[11px] text-slate-600 font-medium block leading-relaxed">{{ step.desc }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- ─── FOOTER BAR ──────────────────────────────────────────────── -->
          <div class="p-3 sm:p-4 px-4 sm:px-6 border-t border-slate-100 bg-white/95 backdrop-blur-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 shrink-0">
            <!-- Metadata & Keyboard Hint -->
            <div class="flex items-center gap-2 flex-wrap text-slate-400 text-[11px] font-medium">
              <span class="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-[10px] text-slate-600">
                {{ activePageData?.route || '/dashboard' }}
              </span>
              <span>•</span>
              <span class="hidden md:inline">GSO E-Ticketing User Manual</span>
              <span class="hidden md:inline">•</span>
              <span class="text-slate-400 hidden sm:inline">Press <kbd class="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[10px] text-slate-600 border border-slate-200">Esc</kbd> to close</span>
            </div>

            <!-- Modal Action Buttons -->
            <div class="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                @click="closeTutorialModal"
                class="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer min-h-[40px] text-center"
              >
                Close Guide
              </button>

              <button
                type="button"
                @click="handleStartTour"
                class="px-4 sm:px-5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Start Interactive Tour</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
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

const activeTab = ref('sections'); // 'sections' | 'tabs' | 'buttons' | 'procedures' | 'tour'
const searchQuery = ref('');

// Switch active page guide from dropdown
const onPageSelectChange = (e) => {
  const pageId = e.target.value;
  selectPage(pageId);
  searchQuery.value = '';
};

// Filtered data based on search query
const filteredSections = computed(() => {
  const list = activePageData.value?.sections || [];
  if (!searchQuery.value.trim()) return list;
  const q = searchQuery.value.toLowerCase();
  return list.filter(s =>
    (s.title && s.title.toLowerCase().includes(q)) ||
    (s.desc && s.desc.toLowerCase().includes(q)) ||
    (s.details && s.details.toLowerCase().includes(q))
  );
});

const filteredTabs = computed(() => {
  const list = activePageData.value?.tabs || [];
  if (!searchQuery.value.trim()) return list;
  const q = searchQuery.value.toLowerCase();
  return list.filter(t =>
    (t.name && t.name.toLowerCase().includes(q)) ||
    (t.desc && t.desc.toLowerCase().includes(q)) ||
    (t.criteria && t.criteria.toLowerCase().includes(q)) ||
    (t.badge && t.badge.toLowerCase().includes(q))
  );
});

const filteredButtons = computed(() => {
  const list = activePageData.value?.buttons || [];
  if (!searchQuery.value.trim()) return list;
  const q = searchQuery.value.toLowerCase();
  return list.filter(b =>
    (b.label && b.label.toLowerCase().includes(q)) ||
    (b.desc && b.desc.toLowerCase().includes(q)) ||
    (b.fields && b.fields.toLowerCase().includes(q)) ||
    (b.result && b.result.toLowerCase().includes(q))
  );
});

const filteredProcedures = computed(() => {
  const list = activePageData.value?.procedures || [];
  if (!searchQuery.value.trim()) return list;
  const q = searchQuery.value.toLowerCase();
  return list.filter(p =>
    (p.title && p.title.toLowerCase().includes(q)) ||
    (p.steps && p.steps.some(s => s.toLowerCase().includes(q)))
  );
});

// Color utility for button category badges
const getButtonBadgeClass = (type = '') => {
  const t = String(type).toLowerCase();
  if (t === 'success') {
    return 'bg-emerald-600 text-white';
  }
  if (t === 'warning') {
    return 'bg-amber-500 text-white';
  }
  if (t === 'danger') {
    return 'bg-rose-600 text-white';
  }
  if (t === 'info') {
    return 'bg-sky-600 text-white';
  }
  if (t === 'secondary') {
    return 'bg-slate-700 text-white';
  }
  return 'bg-slate-900 text-white';
};

const handleStartTour = () => {
  const pageId = activePageData.value?.id;
  closeTutorialModal();
  setTimeout(() => {
    startPageTour(pageId);
  }, 120);
};

// Keyboard shortcuts: Escape to close, Enter to start tour
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

.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
