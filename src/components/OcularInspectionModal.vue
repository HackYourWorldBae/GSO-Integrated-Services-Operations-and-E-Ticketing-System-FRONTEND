<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 pointer-events-auto overflow-y-auto">
        <div class="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity" @click="$emit('close')"></div>

        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-5 sm:p-7 relative z-10 animate-modal-pop border border-slate-100 max-h-[calc(100dvh-2rem)] sm:max-h-[90vh] overflow-y-auto custom-scrollbar my-auto">
          <!-- Header -->
          <div class="flex items-start justify-between gap-4 pb-3.5 border-b border-slate-100">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100 shadow-xs">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-black text-slate-900 tracking-tight">Ocular Inspection Result</h3>
                <p class="text-[11px] font-medium text-slate-500">
                  Update the requestor on findings and verify readiness for work.
                </p>
              </div>
            </div>
            <button
              type="button"
              @click="$emit('close')"
              class="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4 mt-4">
            <!-- Compact Ticket Context Pill Strip -->
            <div class="px-3.5 py-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/70 flex items-center justify-between gap-3 text-xs flex-wrap">
              <div class="flex items-center gap-2 min-w-0">
                <span class="px-2 py-0.5 rounded-lg bg-sky-100 text-sky-800 font-bold text-[11px] shrink-0 border border-sky-200/60">
                  #{{ ticket?.ticketId || ticket?.id }}
                </span>
                <span class="font-bold text-slate-800 truncate">
                  {{ ticket?.service || ticket?.service_type || 'Service Request' }}
                </span>
                <span class="text-slate-300 hidden sm:inline">&bull;</span>
                <span class="text-slate-500 truncate hidden sm:inline">
                  {{ ticket?.requestedBy || ticket?.requester || ticket?.user_name || 'Requestor' }}
                </span>
              </div>
              <div class="flex items-center gap-2 text-slate-500 shrink-0 text-[11px]">
                <span class="font-medium text-slate-600">
                  {{ ticket?.location || 'Main Campus' }}{{ ticket?.office_room ? ` (${ticket.office_room})` : '' }}
                </span>
                <span v-if="ticket?.approval_delay_reason" class="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 font-medium">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span class="max-w-[150px] truncate" :title="ticket.approval_delay_reason">{{ ticket.approval_delay_reason }}</span>
                </span>
              </div>
            </div>

            <!-- Existing Notation Callout if present -->
            <div v-if="existingNotation" class="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs flex items-start gap-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="min-w-0 flex-1">
                <span class="text-[10px] font-bold uppercase tracking-wider text-amber-800">Previous Active Notation</span>
                <p class="text-slate-700 italic text-[11px] line-clamp-2 mt-0.5">"{{ existingNotation }}"</p>
              </div>
            </div>

            <!-- 1. Inspection Assessment Status (Scannable Cards) -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Assessment Outcome <span class="text-rose-500">*</span>
                </label>
                <span class="text-[11px] text-slate-400 font-medium">Select evaluated condition</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  v-for="outcome in outcomeOptions"
                  :key="outcome.id"
                  @click="selectedOutcome = outcome.id"
                  :class="[
                    'p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 select-none relative',
                    selectedOutcome === outcome.id
                      ? outcome.activeClass
                      : 'bg-white border-slate-200/90 text-slate-700 hover:border-slate-300 hover:bg-slate-50/80 shadow-xs'
                  ]"
                >
                  <div :class="['w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5', outcome.iconBg]">
                    <svg v-if="outcome.id === 'ready_for_approval'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else-if="outcome.id === 'materials_needed'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <svg v-else-if="outcome.id === 'scope_adjusted'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center justify-between gap-1">
                      <span class="text-xs font-bold text-slate-900 truncate">{{ outcome.shortLabel }}</span>
                      <span v-if="selectedOutcome === outcome.id" class="w-2 h-2 rounded-full bg-current shrink-0"></span>
                    </div>
                    <p class="text-[11px] text-slate-500 leading-tight mt-0.5 line-clamp-1">{{ outcome.description }}</p>
                  </div>
                </button>
              </div>
            </div>

            <!-- 2. Inspector Details (Assessed By & Date) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Assessed By <span class="text-rose-500">*</span>
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    v-model="inspectorName"
                    type="text"
                    required
                    placeholder="e.g. Engr. Juan Dela Cruz / GSO"
                    class="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Inspection Date <span class="text-rose-500">*</span>
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    v-model="inspectionDate"
                    type="date"
                    required
                    class="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            <!-- 3. Site Findings & Instructions with Quick Insert Chips -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Site Findings &amp; Instructions <span class="text-rose-500">*</span>
                </label>
                <span class="text-[10px] font-semibold text-slate-400">
                  {{ findingsText.length }}/600 chars
                </span>
              </div>

              <!-- Quick Insert Tags (compact pills instead of repetitive paragraphs) -->
              <div class="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1 no-scrollbar">
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">Quick Insert:</span>
                <button
                  type="button"
                  v-for="(preset, idx) in presets"
                  :key="idx"
                  @click="applyPreset(preset.text)"
                  class="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200/80 hover:border-sky-200 transition-all cursor-pointer whitespace-nowrap active:scale-95 shrink-0 flex items-center gap-1"
                  :title="preset.text"
                >
                  <span class="text-sky-500 font-bold text-xs">+</span>
                  <span>{{ preset.chip }}</span>
                </button>
              </div>

              <textarea
                v-model="findingsText"
                rows="3"
                maxlength="600"
                required
                placeholder="State the observed conditions on site, verified scope, and instructions or advice for the requestor..."
                class="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-normal focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white transition-all placeholder:text-slate-400 leading-relaxed"
              ></textarea>
            </div>

            <!-- 4. Return to Active Queue Option (Sleek Switch Card) -->
            <div class="px-4 py-3 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div>
                  <span class="text-xs font-bold text-slate-800 block">Return Ticket to Pending Approval Queue</span>
                  <span class="text-[11px] text-slate-500 block">Lift delayed status and clear ticket for administrative approval</span>
                </div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer shrink-0">
                <input type="checkbox" v-model="resumeToPending" class="sr-only peer" />
                <div class="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
              </label>
            </div>

            <!-- 5. Collapsible Notice Preview (Clean Accordion instead of permanent text block) -->
            <div class="border border-slate-200/80 rounded-2xl overflow-hidden bg-slate-50/50 transition-colors">
              <button
                type="button"
                @click="showPreview = !showPreview"
                class="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-colors cursor-pointer"
              >
                <div class="flex items-center gap-2">
                  <svg class="h-3.5 w-3.5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{{ showPreview ? 'Hide Notice Preview' : 'Preview Live Message Sent to Requestor' }}</span>
                </div>
                <div class="flex items-center gap-1.5 text-slate-400">
                  <span class="text-[10px] uppercase font-bold">{{ showPreview ? 'Close' : 'View' }}</span>
                  <svg :class="['h-4 w-4 transition-transform duration-200', showPreview ? 'rotate-180' : '']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div v-if="showPreview" class="p-3.5 bg-white border-t border-slate-200/80 text-[11px] font-mono text-slate-700 whitespace-pre-wrap leading-relaxed animate-fade-in">
                {{ formattedResultText }}
              </div>
            </div>

            <!-- Error Banner -->
            <div v-if="errorMessage" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <svg class="w-4 h-4 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ errorMessage }}</span>
            </div>

            <!-- Actions -->
            <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                @click="$emit('close')"
                class="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSubmitting || !findingsText.trim() || !inspectorName.trim()"
                class="px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide text-white bg-sky-600 hover:bg-sky-700 active:scale-95 disabled:opacity-50 transition-all shadow-md shadow-sky-600/20 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <svg v-if="isSubmitting" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>{{ isSubmitting ? 'Communicating Result...' : 'Send Result to Requestor' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'vue3-toastify';
import api from '@/api/client';

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  ticket: { type: Object, default: null },
  unitCode: { type: String, default: 'FGMU' },
});

const emit = defineEmits(['close', 'updated']);

const authStore = useAuthStore();

const inspectorName = ref('');
const inspectionDate = ref(new Date().toISOString().slice(0, 10));
const findingsText = ref('');
const selectedOutcome = ref('ready_for_approval');
const resumeToPending = ref(false);
const showPreview = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref('');

const outcomeOptions = [
  {
    id: 'ready_for_approval',
    label: 'Feasible — Ready for Approval',
    shortLabel: 'Feasible / Ready',
    description: 'Scope verified on site; clear to schedule work.',
    iconBg: 'bg-emerald-100 text-emerald-600',
    activeClass: 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs',
  },
  {
    id: 'materials_needed',
    label: 'Materials Required for Work',
    shortLabel: 'Materials Needed',
    description: 'Supplies or parts must be allocated first.',
    iconBg: 'bg-amber-100 text-amber-600',
    activeClass: 'border-amber-500 bg-amber-50/70 text-amber-950 ring-2 ring-amber-500/20 shadow-xs',
  },
  {
    id: 'scope_adjusted',
    label: 'Scope / Duration Adjusted',
    shortLabel: 'Scope Adjusted',
    description: 'Larger technical scope or prep duration needed.',
    iconBg: 'bg-blue-100 text-blue-600',
    activeClass: 'border-blue-500 bg-blue-50/70 text-blue-950 ring-2 ring-blue-500/20 shadow-xs',
  },
  {
    id: 'deferred_infeasible',
    label: 'Outside Scope / Client Coordination',
    shortLabel: 'Client Action',
    description: 'Requires occupant action or administrative endorsement.',
    iconBg: 'bg-rose-100 text-rose-600',
    activeClass: 'border-rose-500 bg-rose-50/70 text-rose-950 ring-2 ring-rose-500/20 shadow-xs',
  },
];

const presets = [
  {
    chip: 'Scope Feasible',
    text: 'Ocular inspection completed. Scope of repair confirmed feasible; proceeding with work review.',
  },
  {
    chip: 'Parts Needed',
    text: 'Ocular inspection completed. Site verified; specific parts checklist submitted for preparation.',
  },
  {
    chip: 'Clear Work Area',
    text: 'Ocular inspection completed. Work area must be cleared of occupant items before personnel can begin.',
  },
  {
    chip: 'Safety Clearance Passed',
    text: 'Ocular inspection completed. Safety protocol verified; technical dispatch to be scheduled.',
  },
];

const existingNotation = computed(() => {
  return props.ticket?.staff_notation || props.ticket?.ssu_notation || props.ticket?.notation || '';
});

const defaultInspector = computed(() => {
  const user = authStore.user;
  if (!user) return 'GSO Inspection Officer';
  const name = [user.first_name, user.last_name].filter(Boolean).join(' ');
  const title = user.designation || user.role || 'GSO Staff';
  return name ? `${name} (${title})` : 'GSO Inspection Officer';
});

const formattedResultText = computed(() => {
  const outcomeObj = outcomeOptions.find(o => o.id === selectedOutcome.value);
  const outcomeLabel = outcomeObj ? outcomeObj.label : 'Inspection Completed';
  const dateFormatted = new Date(inspectionDate.value || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return `[OCULAR INSPECTION RESULT - ${dateFormatted}]\nOutcome: ${outcomeLabel}\nInspected by: ${inspectorName.value || 'GSO Officer'}\nFindings & Advice:\n${findingsText.value.trim() || '(Pending findings description)'}`;
});

const applyPreset = (presetText) => {
  if (!findingsText.value) {
    findingsText.value = presetText;
  } else {
    findingsText.value += (findingsText.value.endsWith('.') ? ' ' : '. ') + presetText;
  }
};

watch(() => props.isOpen, (open) => {
  if (open) {
    inspectorName.value = defaultInspector.value;
    inspectionDate.value = new Date().toISOString().slice(0, 10);
    findingsText.value = '';
    selectedOutcome.value = 'ready_for_approval';
    resumeToPending.value = false;
    showPreview.value = false;
    errorMessage.value = '';
  }
});

const handleSubmit = async () => {
  const ticketId = props.ticket?.ticketId || props.ticket?.id;
  if (!ticketId) return;

  if (!findingsText.value.trim()) {
    errorMessage.value = 'Please provide findings and instructions for the requestor.';
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    const finalNotation = formattedResultText.value;
    
    // 1. Post notation to notify requestor (in-app alert + email)
    await api.patch(`tickets/${ticketId}/notation`, {
      notation: finalNotation,
      staff_notation: finalNotation,
    });

    // 2. If user chose to resume to pending queue, resume ticket
    if (resumeToPending.value) {
      try {
        await api.patch(`tickets/${ticketId}/resume-approval`);
      } catch (resumeErr) {
        console.warn('Could not automatically resume approval:', resumeErr);
      }
    }

    toast.success(`Ocular inspection result communicated to requestor for Ticket #${ticketId}.`);
    emit('updated', { ticketId, notation: finalNotation, resumed: resumeToPending.value });
    emit('close');
  } catch (err) {
    console.error('Failed to post ocular inspection result:', err);
    errorMessage.value = err.response?.data?.message || err.response?.data?.messages?.error || 'Failed to communicate inspection result. Please check connection and try again.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background-color: transparent;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
