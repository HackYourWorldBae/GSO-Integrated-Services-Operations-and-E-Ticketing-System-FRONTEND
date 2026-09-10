<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      @click.self="handleBackdropClick"
    >
      <div
        class="bg-white rounded-[2.5rem] border border-slate-200/80 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden transform transition-all"
      >
        <!-- Modal Header -->
        <div class="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-black text-slate-900 tracking-tight leading-tight">Yearly Archives Export</h3>
              <p class="text-xs font-bold text-emerald-700 uppercase tracking-widest">{{ unitCode }} Document Bundler</p>
            </div>
          </div>
          <button
            v-if="!isProcessing"
            @click="closeModal"
            class="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all active:scale-95 cursor-pointer"
            title="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Body (Scrollable) -->
        <div class="p-6 sm:p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          
          <!-- ── State 1: Active Progress Screen ────────────────────────────── -->
          <div v-if="isProcessing" class="py-8 px-4 flex flex-col items-center text-center space-y-6 animate-fade-in">
            <!-- Animated Spinner / Progress Badge -->
            <div class="relative w-24 h-24 flex items-center justify-center">
              <div class="absolute inset-0 rounded-full border-4 border-slate-100"></div>
              <div
                class="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"
              ></div>
              <span class="text-xl font-black text-slate-800">{{ progress.percent }}%</span>
            </div>

            <div class="space-y-2 max-w-md">
              <h4 class="text-lg font-black text-slate-900">Packaging Archive Bundle</h4>
              <p class="text-xs font-semibold text-slate-500 min-h-[36px] flex items-center justify-center">
                {{ progress.statusText || 'Preparing documents and data records...' }}
              </p>
            </div>

            <!-- Progress Bar -->
            <div class="w-full max-w-md bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                class="bg-gradient-to-r from-emerald-600 to-teal-500 h-full rounded-full transition-all duration-300 ease-out shadow-xs"
                :style="{ width: `${progress.percent}%` }"
              ></div>
            </div>

            <!-- Cancel Button -->
            <div class="pt-4">
              <button
                @click="cancelExport"
                type="button"
                class="px-5 py-2.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all cursor-pointer active:scale-95"
              >
                Cancel Export
              </button>
            </div>
          </div>

          <!-- ── State 2: Success Screen ───────────────────────────────────── -->
          <div v-else-if="completedResult" class="py-8 px-4 flex flex-col items-center text-center space-y-5 animate-fade-in">
            <div class="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div class="space-y-1">
              <h4 class="text-xl font-black text-slate-900">Export Complete!</h4>
              <p class="text-xs font-medium text-slate-500">
                Your archive ZIP bundle has been generated and your browser download has initiated.
              </p>
            </div>

            <!-- Summary File Card -->
            <div class="w-full max-w-md p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-left">
              <div class="flex items-center gap-3 overflow-hidden">
                <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <div class="overflow-hidden">
                  <p class="text-xs font-bold text-slate-900 truncate">{{ completedResult.filename }}</p>
                  <p class="text-[10px] font-semibold text-emerald-700">
                    {{ completedResult.count }} documents included + Dedicated CSV Summary
                  </p>
                </div>
              </div>
              <button
                @click="reDownload"
                class="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all shrink-0 cursor-pointer"
              >
                Re-download
              </button>
            </div>

            <div class="flex gap-3 pt-2">
              <button
                @click="completedResult = null"
                type="button"
                class="px-6 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer active:scale-95"
              >
                Export Another Archive
              </button>
              <button
                @click="closeModal"
                type="button"
                class="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer active:scale-95"
              >
                Done
              </button>
            </div>
          </div>

          <!-- ── State 3: Selection & Configuration Screen ─────────────────── -->
          <div v-else class="space-y-6 animate-fade-in">
            <!-- Year Selector Bar -->
            <div class="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <label class="text-xs font-black text-slate-800 uppercase tracking-wider">Select Archive Year</label>
                <p class="text-[11px] font-medium text-slate-500 mt-0.5">Filter records by calendar year or download all archives.</p>
              </div>
              <div class="w-full sm:w-auto min-w-[180px]">
                <select
                  v-model="selectedYear"
                  class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer transition-all shadow-xs"
                >
                  <option value="all">All Years (Complete History)</option>
                  <option v-for="yr in availableYears" :key="yr" :value="yr">
                    Year {{ yr }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Scope Metrics Bar -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
              <div class="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <p class="text-2xl font-black text-slate-900">{{ currentYearTickets.length }}</p>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Total Tickets</p>
              </div>
              <div v-if="unitCode !== 'SSU'" class="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <p class="text-2xl font-black text-emerald-700">{{ currentMaterialTickets.length }}</p>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">With Materials</p>
              </div>
              <div :class="unitCode === 'SSU' ? 'col-span-1 sm:col-span-2' : ''" class="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <p class="text-2xl font-black text-slate-800">
                  {{ unitCode === 'SSU' ? currentYearTickets.length : `₱${formatPrice(totalCurrentMaterialCost)}` }}
                </p>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  {{ unitCode === 'SSU' ? 'Official Reports' : 'Materials Value' }}
                </p>
              </div>
            </div>

            <!-- ── Export Action Cards for FGMU & LEAU ─────────────────────── -->
            <div v-if="unitCode === 'FGMU' || unitCode === 'LEAU'" class="space-y-4">
              <p class="text-[11px] font-black text-slate-400 uppercase tracking-wider">Available Dedicated Archives</p>

              <!-- Option 1: Official Job Request Forms -->
              <div
                class="p-6 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-md transition-all group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
              >
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                        Job Request Forms (.ZIP)
                      </h4>
                      <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-black rounded-full uppercase">
                        {{ currentYearTickets.length }} Forms
                      </span>
                    </div>
                    <p class="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                      Packages all official Job Request Form PDFs and a dedicated CSV index summary for {{ selectedYear === 'all' ? 'all recorded years' : 'year ' + selectedYear }}.
                    </p>
                  </div>
                </div>
                <button
                  @click="triggerExport('forms')"
                  :disabled="currentYearTickets.length === 0"
                  type="button"
                  class="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download Forms (.ZIP)</span>
                </button>
              </div>

              <!-- Option 2: Material Issuance Slips -->
              <div
                class="p-6 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-md transition-all group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
              >
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="text-sm font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                        Material Issuance Slips (.ZIP)
                      </h4>
                      <span class="px-2 py-0.5 bg-teal-100 text-teal-800 text-[9px] font-black rounded-full uppercase">
                        {{ currentMaterialTickets.length }} Slips
                      </span>
                    </div>
                    <p class="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                      Packages official Material Receipt Slips for tickets with consumed materials and a dedicated itemized Materials CSV summary.
                    </p>
                  </div>
                </div>
                <button
                  @click="triggerExport('materials')"
                  :disabled="currentMaterialTickets.length === 0"
                  type="button"
                  class="w-full sm:w-auto px-5 py-3 bg-teal-700 hover:bg-teal-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download Slips (.ZIP)</span>
                </button>
              </div>
            </div>

            <!-- ── Export Action Cards for SSU ─────────────────────────────── -->
            <div v-else-if="unitCode === 'SSU'" class="space-y-4">
              <p class="text-[11px] font-black text-slate-400 uppercase tracking-wider">Available Dedicated Archives</p>

              <div
                class="p-6 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-md transition-all group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
              >
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                        SSU Incident Reports (.ZIP)
                      </h4>
                      <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-black rounded-full uppercase">
                        {{ currentYearTickets.length }} Reports
                      </span>
                    </div>
                    <p class="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                      Packages official SSU Incident Report PDFs with safety notations and a dedicated Incident Summary CSV catalog.
                    </p>
                  </div>
                </div>
                <button
                  @click="triggerExport('ssu')"
                  :disabled="currentYearTickets.length === 0"
                  type="button"
                  class="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download Reports (.ZIP)</span>
                </button>
              </div>
            </div>

            <!-- Informational Note -->
            <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-xs text-slate-500 leading-relaxed">
                Raw photo attachments are excluded from bulk exports to ensure fast, lightweight, and official audit-ready documentation. To inspect individual proof photos, please use the ticket details viewer.
              </p>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span class="text-[11px] font-bold text-slate-400">
            Benguet State University • General Services Office
          </span>
          <button
            v-if="!isProcessing"
            @click="closeModal"
            type="button"
            class="px-5 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { toast } from 'vue3-toastify';
import { saveAs } from 'file-saver';
import {
  getAvailableYearsFromTickets,
  filterTicketsByYear,
  exportJobRequestFormsZip,
  exportMaterialSlipsZip,
  exportSsuIncidentReportsZip,
} from '@/utils/archiveBulkExporter';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  tickets: {
    type: Array,
    default: () => [],
  },
  unitCode: {
    type: String,
    default: 'FGMU',
  },
  initialYear: {
    type: String,
    default: 'all',
  },
});

const emit = defineEmits(['update:isOpen']);

// Selection state
const selectedYear = ref(props.initialYear || 'all');

watch(() => props.initialYear, (newVal) => {
  if (newVal) selectedYear.value = newVal;
});

// Available years list
const availableYears = computed(() => {
  return getAvailableYearsFromTickets(props.tickets);
});

// Tickets matching selected year
const currentYearTickets = computed(() => {
  return filterTicketsByYear(props.tickets, selectedYear.value);
});

// Tickets with materials
const currentMaterialTickets = computed(() => {
  return currentYearTickets.value.filter(t => Array.isArray(t.materials) && t.materials.length > 0);
});

// Total material cost for selected year
const totalCurrentMaterialCost = computed(() => {
  return currentMaterialTickets.value.reduce((sum, t) => {
    return sum + Number(t.total_material_cost || 0);
  }, 0);
});

const formatPrice = (val) => {
  return Number(val || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Processing & Progress state
const isProcessing = ref(false);
const progress = ref({
  current: 0,
  total: 0,
  percent: 0,
  statusText: '',
  currentTicketId: '',
});
const completedResult = ref(null);
let currentAbortController = null;

const closeModal = () => {
  if (isProcessing.value) return;
  emit('update:isOpen', false);
  // Reset state after transition
  setTimeout(() => {
    completedResult.value = null;
  }, 300);
};

const handleBackdropClick = () => {
  if (!isProcessing.value) {
    closeModal();
  }
};

const cancelExport = () => {
  if (currentAbortController) {
    currentAbortController.abort();
    currentAbortController = null;
  }
  isProcessing.value = false;
  toast.info('Export cancelled.');
};

const triggerExport = async (type) => {
  isProcessing.value = true;
  completedResult.value = null;
  currentAbortController = new AbortController();

  progress.value = {
    current: 0,
    total: currentYearTickets.value.length,
    percent: 0,
    statusText: 'Starting export...',
    currentTicketId: '',
  };

  try {
    let result = null;

    if (type === 'forms') {
      result = await exportJobRequestFormsZip({
        tickets: props.tickets,
        unitCode: props.unitCode,
        year: selectedYear.value,
        signal: currentAbortController.signal,
        onProgress: (p) => {
          progress.value = p;
        },
      });
    } else if (type === 'materials') {
      result = await exportMaterialSlipsZip({
        tickets: props.tickets,
        unitCode: props.unitCode,
        year: selectedYear.value,
        signal: currentAbortController.signal,
        onProgress: (p) => {
          progress.value = p;
        },
      });
    } else if (type === 'ssu') {
      result = await exportSsuIncidentReportsZip({
        tickets: props.tickets,
        year: selectedYear.value,
        signal: currentAbortController.signal,
        onProgress: (p) => {
          progress.value = p;
        },
      });
    }

    if (result && result.success) {
      completedResult.value = result;
      toast.success(`Successfully downloaded ${result.filename}!`);
    }
  } catch (err) {
    if (err.message && err.message.includes('cancelled')) {
      // Handled in cancelExport
      return;
    }
    console.error('Export error:', err);
    toast.error(err.message || 'Failed to generate archive ZIP bundle.');
  } finally {
    isProcessing.value = false;
    currentAbortController = null;
  }
};

const reDownload = () => {
  if (completedResult.value?.blob && completedResult.value?.filename) {
    saveAs(completedResult.value.blob, completedResult.value.filename);
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.2);
  border-radius: 10px;
}
</style>
