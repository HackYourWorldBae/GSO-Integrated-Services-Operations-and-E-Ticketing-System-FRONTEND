<template>
  <MainLayout>
    <template #header-title>
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none">Personnel Works Board</h2>
          <span class="px-2.5 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider">
            {{ unitCode }} Bulletin
          </span>
        </div>
        <p class="text-[10px] text-slate-500 font-extrabold tracking-[0.2em] uppercase mt-1">
          {{ unitName }} &bull; Find your name to view assigned works
        </p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-4 animate-fade-in relative pb-12">

        <!-- ═══ Identity banner (once a name is picked) ═══ -->
        <div
          v-if="identity"
          class="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white shadow-xl relative overflow-hidden border border-white/10"
        >
          <div class="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-3.5 min-w-0">
              <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center font-black text-sm shrink-0">
                {{ getInitials(identity.name) }}
              </div>
              <div class="min-w-0">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Viewing works for</p>
                <h3 class="text-lg sm:text-xl font-black text-white leading-tight truncate">{{ identity.name }}</h3>
                <p class="text-xs text-slate-300 font-medium">{{ workerSpecialty }} &bull; {{ activeWorks.length }} active work{{ activeWorks.length !== 1 ? 's' : '' }}</p>
              </div>
            </div>
            <button
              type="button"
              @click="switchIdentity"
              class="px-4 py-2.5 min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-black transition-all cursor-pointer shrink-0 touch-manipulation"
            >
              Not you? Switch name
            </button>
          </div>
        </div>

        <!-- ═══ Step 1: roster name picker ═══ -->
        <div v-if="!identity" class="bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div class="p-1.5 border-b border-slate-100">
            <div class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-md bg-slate-900 w-fit">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Who are you? Pick your name</span>
              <span class="ml-1 px-2 py-0.5 rounded-full text-[10px] font-black leading-none bg-white/20 text-white">{{ roster.length }}</span>
            </div>
          </div>
          <div class="p-2">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                v-model="rosterSearch"
                type="text"
                placeholder="Search your name or specialty..."
                class="w-full pl-9 pr-4 py-2.5 min-h-[44px] rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-base sm:text-xs font-semibold placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        <div v-if="!identity && loadingRoster" class="py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
          <div class="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
            <svg class="animate-spin h-4 w-4 text-slate-700" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading {{ unitCode }} roster...
          </div>
        </div>

        <div v-else-if="!identity && filteredRoster.length === 0" class="py-12 text-center bg-white rounded-2xl border border-slate-200 p-6">
          <p class="text-sm font-bold text-slate-700">No personnel found</p>
          <p class="text-xs text-slate-400 mt-1">No registered {{ unitCode }} personnel match. Contact your unit head to be added to the roster.</p>
        </div>

        <div v-else-if="!identity" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          <button
            v-for="person in filteredRoster"
            :key="person.id"
            type="button"
            @click="selectPersonnel(person)"
            class="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-900 hover:shadow-md transition-all cursor-pointer text-left group active:scale-[0.99] touch-manipulation"
          >
            <div class="flex items-center gap-3">
              <div class="relative shrink-0">
                <div class="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center font-black text-sm group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all">
                  {{ getInitials(person.name) }}
                </div>
                <span
                  :class="[
                    'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white',
                    person.status === 'working' ? 'bg-emerald-500' : person.status === 'on_leave' ? 'bg-rose-500' : 'bg-slate-300'
                  ]"
                  :title="person.status"
                ></span>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-black text-slate-900 truncate leading-tight">{{ person.name }}</p>
                <p class="text-[11px] text-slate-500 font-semibold truncate">{{ person.specialty || 'General' }}</p>
              </div>
              <span
                :class="[
                  'px-2 py-1 rounded-lg text-[10px] font-black shrink-0 border',
                  person.assignment_count > 0 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'
                ]"
              >
                {{ person.assignment_count }} work{{ person.assignment_count !== 1 ? 's' : '' }}
              </span>
            </div>
          </button>
        </div>

        <!-- ═══ Step 2: works list ═══ -->
        <div v-if="identity">
          <div class="inline-flex p-1 rounded-xl bg-white border border-slate-200 shadow-xs text-xs font-bold mb-3">
            <button
              type="button"
              @click="worksTab = 'active'"
              :class="['px-4 py-2 min-h-[38px] rounded-lg transition-all cursor-pointer touch-manipulation', worksTab === 'active' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900']"
            >
              Active Works ({{ activeWorks.length }})
            </button>
            <button
              type="button"
              @click="worksTab = 'history'"
              :class="['px-4 py-2 min-h-[38px] rounded-lg transition-all cursor-pointer touch-manipulation', worksTab === 'history' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900']"
            >
              Done ({{ historyWorks.length }})
            </button>
            <button
              type="button"
              @click="refreshWorks"
              :disabled="loadingWorks"
              class="px-3 py-2 min-h-[38px] rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-50"
              title="Refresh works"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{ 'animate-spin': loadingWorks }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          <div v-if="loadingWorks && activeWorks.length === 0 && historyWorks.length === 0" class="py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            <p class="text-xs font-bold">Loading assigned works...</p>
          </div>

          <div v-else-if="worksTab === 'active' && activeWorks.length === 0" class="py-12 text-center bg-white rounded-2xl border border-slate-200 p-6">
            <p class="text-sm font-bold text-slate-700">No active works assigned</p>
            <p class="text-xs text-slate-400 mt-1">You currently have no dispatched tickets. New assignments from your unit head will appear here.</p>
          </div>

          <div v-else-if="worksTab === 'history' && historyWorks.length === 0" class="py-12 text-center bg-white rounded-2xl border border-slate-200 p-6">
            <p class="text-sm font-bold text-slate-700">No completed works yet</p>
            <p class="text-xs text-slate-400 mt-1">Finished assignments will be listed here.</p>
          </div>

          <!-- Active work cards -->
          <div v-else-if="worksTab === 'active'" class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              v-for="work in activeWorks"
              :key="work.assignment_id"
              @click="openWorkModal(work)"
              :class="[
                'bg-white rounded-2xl border p-4 space-y-3 cursor-pointer transition-all hover:shadow-md active:scale-[0.99]',
                work.is_emergency ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200 hover:border-slate-900'
              ]"
            >
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2 min-w-0">
                  <span class="font-mono text-sm font-bold px-2.5 py-0.5 rounded-lg border text-slate-800 bg-slate-50 border-slate-200 shrink-0">#{{ work.ticket_id }}</span>
                  <span v-if="work.is_emergency" class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[9px] font-black uppercase tracking-wider border border-rose-200 animate-pulse shrink-0">Emergency</span>
                </div>
                <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">{{ work.status_label || work.ticket_status || 'Active' }}</span>
              </div>

              <div class="min-w-0">
                <p class="text-sm font-black text-slate-900 leading-tight truncate">{{ work.title }}</p>
                <p class="text-[11px] text-slate-500 font-semibold">{{ work.service_type || 'General Service' }}</p>
              </div>

              <div class="flex items-center justify-between text-xs text-slate-600">
                <span class="inline-flex items-center gap-1.5 truncate">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="font-bold text-slate-800">{{ formatDate(work.implementation_date) }}</span>
                  <span class="text-slate-400">&bull; {{ work.working_days || 1 }} day{{ (work.working_days || 1) !== 1 ? 's' : '' }}</span>
                </span>
              </div>

              <!-- Team preview -->
              <div class="flex items-center justify-between pt-2 border-t border-slate-100">
                <div class="flex items-center">
                  <div
                    v-for="(mate, idx) in (work.teammates || []).slice(0, 4)"
                    :key="mate.personnel_id"
                    :class="['w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black', idx > 0 ? '-ml-2' : '', mate.is_self ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700']"
                    :title="mate.name + (mate.is_self ? ' (you)' : '')"
                  >
                    {{ getInitials(mate.name) }}
                  </div>
                  <span v-if="(work.teammates || []).length > 4" class="ml-1 text-[10px] font-black text-slate-500">+{{ (work.teammates || []).length - 4 }} more</span>
                  <span v-if="(work.teammates || []).length === 0" class="text-[11px] text-slate-400 italic">No team listed</span>
                </div>
                <span class="text-[11px] font-black text-slate-900 uppercase tracking-wider inline-flex items-center gap-1">
                  Full Info
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <!-- History rows -->
          <div v-else class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div class="divide-y divide-slate-100">
              <div v-for="h in historyWorks" :key="h.assignment_id" class="px-4 py-3 flex items-center justify-between gap-3">
                <div class="flex items-center gap-2.5 min-w-0">
                  <span class="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 shrink-0">#{{ h.ticket_id }}</span>
                  <div class="min-w-0">
                    <p class="text-xs font-bold text-slate-800 truncate">{{ h.title || h.service_type || 'Service Request' }}</p>
                    <p class="text-[10px] text-slate-400">{{ h.location || '' }}{{ h.completed_at ? ' &bull; Done ' + formatDate(h.completed_at) : '' }}</p>
                  </div>
                </div>
                <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 shrink-0">Done</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </template>
  </MainLayout>

  <!-- ═══ Full Info Modal ═══ -->
  <Teleport to="body">
    <div
      v-if="selectedWork"
      class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
      @click.self="selectedWork = null"
    >
      <div class="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[calc(100dvh-4rem)] overflow-hidden">
        <div class="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-1.5">
              <span class="font-mono text-base font-black px-3 py-1 rounded-xl border text-slate-800 bg-slate-50 border-slate-200">#{{ selectedWork.ticket_id }}</span>
              <span v-if="selectedWork.is_emergency" class="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-wider border border-rose-200">Emergency</span>
              <span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-wider border border-emerald-200">{{ selectedWork.status_label || selectedWork.ticket_status || 'Active' }}</span>
            </div>
            <h3 class="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight">{{ selectedWork.title }}</h3>
            <p class="text-xs text-slate-500 font-semibold mt-0.5">{{ selectedWork.service_type || 'General Service' }}</p>
          </div>
          <button type="button" @click="selectedWork = null" class="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 cursor-pointer shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1 custom-scrollbar">
          <!-- Schedule banner -->
          <div class="p-4 rounded-2xl bg-slate-900 text-white grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span class="text-[9px] text-slate-400 uppercase font-black block">Work Date</span>
              <span class="font-bold">{{ formatDate(selectedWork.implementation_date) }}</span>
            </div>
            <div>
              <span class="text-[9px] text-slate-400 uppercase font-black block">Duration</span>
              <span class="font-bold">{{ selectedWork.working_days || 1 }} day{{ (selectedWork.working_days || 1) !== 1 ? 's' : '' }}</span>
            </div>
            <div class="col-span-2">
              <span class="text-[9px] text-slate-400 uppercase font-black block">Location</span>
              <span class="font-bold truncate block">{{ selectedWork.location || 'Main Campus' }}{{ selectedWork.office_room ? ' (' + selectedWork.office_room + ')' : '' }}</span>
            </div>
          </div>

          <!-- Job scope -->
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Job Scope &amp; Instructions</span>
            <p class="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed whitespace-pre-wrap">{{ selectedWork.description || selectedWork.task_notes || 'No written scope — coordinate with your unit head.' }}</p>
            <p v-if="selectedWork.task_notes && selectedWork.description" class="text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
              <strong>Your task:</strong> {{ selectedWork.task_notes }}
            </p>
          </div>

          <!-- Requester -->
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Requested By</span>
            <p class="text-sm font-black text-slate-900">{{ selectedWork.requester }}</p>
            <a
              v-if="selectedWork.requester_contact && selectedWork.requester_contact !== 'N/A'"
              :href="`tel:${selectedWork.requester_contact}`"
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 font-mono font-black text-emerald-800"
            >
              {{ selectedWork.requester_contact }}
            </a>
          </div>

          <!-- Dispatched team -->
          <div class="space-y-2">
            <span class="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <span class="w-2 h-3 rounded-full bg-slate-900"></span>
              Dispatched Team ({{ (selectedWork.teammates || []).length }})
            </span>
            <div v-if="(selectedWork.teammates || []).length === 0" class="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-slate-400 text-xs">
              No team members listed for this ticket.
            </div>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div
                v-for="mate in selectedWork.teammates"
                :key="mate.personnel_id"
                :class="[
                  'p-3 rounded-2xl border flex items-center gap-2.5',
                  mate.is_self ? 'bg-emerald-50/60 border-emerald-300' : 'bg-white border-slate-200'
                ]"
              >
                <div :class="['w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 border', mate.is_self ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-100 text-slate-700 border-slate-200']">
                  {{ getInitials(mate.name) }}
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-xs font-black text-slate-900 truncate">
                    {{ mate.name }}
                    <span v-if="mate.is_self" class="ml-1 px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[9px] font-black uppercase">You</span>
                  </p>
                  <p class="text-[10px] text-slate-500 truncate">{{ mate.specialty || 'Worker' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <button type="button" @click="selectedWork = null" class="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer">Close</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import { useAuthStore } from '@/stores/auth';
import { fetchBoardRoster, fetchPersonnelWorks } from '@/api/personnelBoard';
import { toast } from 'vue3-toastify';

const IDENTITY_KEY = 'personnelIdentity';

const authStore = useAuthStore();

const UNIT_NAMES = { 1: 'Facilities & Grounds Management', 2: 'Landscaping & Environmental Aesthetics', 3: 'Security Services' };
const UNIT_CODES = { 1: 'FGMU', 2: 'LEAU', 3: 'SSU' };

const boardUnitId = computed(() => Number(authStore.user?.unit_id || 1));
const unitCode = computed(() => UNIT_CODES[boardUnitId.value] || 'FGMU');
const unitName = computed(() => UNIT_NAMES[boardUnitId.value] || 'Facilities & Grounds Management');

const loadingRoster = ref(false);
const loadingWorks = ref(false);
const roster = ref([]);
const rosterSearch = ref('');
const identity = ref(null);
const worksTab = ref('active');
const activeWorks = ref([]);
const historyWorks = ref([]);
const workerSpecialty = ref('');
const selectedWork = ref(null);

const filteredRoster = computed(() => {
  const q = rosterSearch.value.trim().toLowerCase();
  if (!q) return roster.value;
  return roster.value.filter(p =>
    (p.name || '').toLowerCase().includes(q) ||
    (p.specialty || '').toLowerCase().includes(q)
  );
});

const getInitials = (name) => {
  if (!name) return 'U';
  const parts = String(name).trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return String(name).substring(0, 2).toUpperCase();
};

const formatDate = (val) => {
  if (!val) return 'TBD';
  const s = String(val).slice(0, 10);
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return s;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const fetchRoster = async () => {
  loadingRoster.value = true;
  try {
    const res = await fetchBoardRoster(boardUnitId.value);
    roster.value = res.data?.data?.personnel || [];
  } catch (err) {
    console.error('Failed to load board roster:', err);
    toast.error('Failed to load personnel roster.');
  } finally {
    loadingRoster.value = false;
  }
};

const loadWorks = async (personnelId) => {
  loadingWorks.value = true;
  try {
    const res = await fetchPersonnelWorks(personnelId);
    const data = res.data?.data || {};
    activeWorks.value = data.active || [];
    historyWorks.value = data.history || [];
    workerSpecialty.value = data.worker?.specialty || '';
    worksTab.value = 'active';
  } catch (err) {
    console.error('Failed to load personnel works:', err);
    toast.error(err.response?.data?.message || 'Failed to load assigned works.');
  } finally {
    loadingWorks.value = false;
  }
};

const selectPersonnel = async (person) => {
  identity.value = { id: person.id, name: person.name, unit_id: boardUnitId.value };
  try {
    sessionStorage.setItem(IDENTITY_KEY, JSON.stringify(identity.value));
  } catch {}
  await loadWorks(person.id);
};

const switchIdentity = () => {
  identity.value = null;
  activeWorks.value = [];
  historyWorks.value = [];
  selectedWork.value = null;
  try {
    sessionStorage.removeItem(IDENTITY_KEY);
  } catch {}
};

const refreshWorks = async () => {
  if (identity.value) {
    await loadWorks(identity.value.id);
  } else {
    await fetchRoster();
  }
};

const openWorkModal = (work) => {
  selectedWork.value = work;
};

onMounted(async () => {
  await fetchRoster();
  // Resume previously picked name if still on the roster
  try {
    const raw = sessionStorage.getItem(IDENTITY_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      const match = roster.value.find(p => String(p.id) === String(saved?.id));
      if (match && Number(saved?.unit_id || 0) === boardUnitId.value) {
        identity.value = { id: match.id, name: match.name, unit_id: boardUnitId.value };
        await loadWorks(match.id);
      } else {
        sessionStorage.removeItem(IDENTITY_KEY);
      }
    }
  } catch {}
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
</style>
