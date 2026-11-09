<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 pointer-events-auto overflow-y-auto">
        <div class="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity" @click="$emit('close')"></div>

        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-6 sm:p-8 relative z-10 animate-modal-pop border border-slate-100 max-h-[calc(100dvh-2rem)] sm:max-h-[90vh] overflow-y-auto custom-scrollbar my-auto">
          <!-- Header -->
          <div class="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 shadow-xs border border-sky-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-black text-slate-900 tracking-tight">Ocular Inspection Result</h3>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  Update Requestor &bull; Ticket #{{ ticket?.ticketId || ticket?.id }}
                </p>
              </div>
            </div>
            <button
              type="button"
              @click="$emit('close')"
              class="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4 mt-5">
            <!-- Ticket Summary Card -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div class="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Service Request</span>
                  <span class="font-bold text-slate-900 text-sm">{{ ticket?.service || ticket?.service_type || 'Service Request' }}</span>
                </div>
                <div class="text-right">
                  <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Requestor</span>
                  <span class="font-bold text-slate-800">{{ ticket?.requestedBy || ticket?.requester || ticket?.user_name || 'Requestor' }}</span>
                </div>
              </div>

              <div class="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2 flex-wrap text-slate-600">
                <div class="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{{ ticket?.location || 'Main Campus' }}{{ ticket?.office_room ? ` • Rm ${ticket.office_room}` : '' }}</span>
                </div>
                <div class="inline-flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 font-semibold">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>{{ ticket?.approval_delay_reason || 'Pending Ocular Assessment / Inspection' }}</span>
                </div>
              </div>
            </div>

            <!-- Existing Notation Alert if present -->
            <div v-if="existingNotation" class="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-200/70 text-xs">
              <div class="flex items-center gap-1.5 font-bold text-sky-900 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-sky-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Current Active Notation on File:</span>
              </div>
              <p class="text-slate-700 italic pl-5 line-clamp-3">"{{ existingNotation }}"</p>
            </div>

            <!-- 1. Inspection Outcome / Finding Selection -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Inspection Assessment Status <span class="text-rose-500">*</span>
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  v-for="outcome in outcomeOptions"
                  :key="outcome.id"
                  @click="selectedOutcome = outcome.id"
                  :class="[
                    'p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-1 select-none',
                    selectedOutcome === outcome.id
                      ? outcome.activeClass
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  ]"
                >
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-xs font-black">{{ outcome.label }}</span>
                    <span v-if="selectedOutcome === outcome.id" class="text-xs font-bold">✓</span>
                  </div>
                  <span class="text-[11px] leading-snug opacity-80">{{ outcome.description }}</span>
                </button>
              </div>
            </div>

            <!-- 2. Inspector Details (Assessed By & Date) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Assessed / Inspected By <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model="inspectorName"
                  type="text"
                  required
                  placeholder="e.g. Engr. Juan Dela Cruz / GSO Inspector"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Inspection Date <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model="inspectionDate"
                  type="date"
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
              </div>
            </div>

            <!-- 3. Quick Recommendation Presets -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Quick Findings Presets
              </label>
              <div class="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  v-for="(preset, idx) in presets"
                  :key="idx"
                  @click="applyPreset(preset)"
                  class="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-800 border border-slate-200 hover:border-sky-200 transition-all cursor-pointer active:scale-95 text-left"
                >
                  {{ preset }}
                </button>
              </div>
            </div>

            <!-- 4. Detailed Findings & Instructions for Requestor -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Site Findings &amp; Instructions to Requestor <span class="text-rose-500">*</span>
                </label>
                <span class="text-[10px] font-bold text-slate-400">
                  {{ findingsText.length }}/600 chars
                </span>
              </div>
              <textarea
                v-model="findingsText"
                rows="4"
                maxlength="600"
                required
                placeholder="State the observed conditions on site, verified scope, and instructions or advice for the requestor..."
                class="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white transition-all placeholder:text-slate-400"
              ></textarea>
            </div>

            <!-- 5. Return to Active Queue Option -->
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-3 text-xs">
              <label class="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  v-model="resumeToPending"
                  type="checkbox"
                  class="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300 cursor-pointer"
                />
                <div>
                  <span class="font-bold text-slate-800 block">Return Ticket to Pending Approval Queue</span>
                  <span class="text-[11px] text-slate-500 block">Lift delayed status and make ticket immediately available for final approval</span>
                </div>
              </label>
            </div>

            <!-- Preview Card -->
            <div class="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200/80 text-xs text-sky-950 space-y-1">
              <div class="flex items-center gap-1.5 font-black uppercase tracking-wider text-sky-900 text-[10px]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>Live Requestor Dashboard Notice Preview</span>
              </div>
              <p class="text-slate-700 bg-white/90 p-2.5 rounded-xl border border-sky-100 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                {{ formattedResultText }}
              </p>
            </div>

            <!-- Error Banner -->
            <div v-if="errorMessage" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              {{ errorMessage }}
            </div>

            <!-- Actions -->
            <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                @click="$emit('close')"
                class="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSubmitting || !findingsText.trim() || !inspectorName.trim()"
                class="px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white bg-sky-600 hover:bg-sky-700 active:scale-95 disabled:opacity-50 transition-all shadow-md shadow-sky-600/20 flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
              >
                <svg v-if="isSubmitting" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isSubmitting ? 'Communicating Result...' : 'Send Inspection Result to Requestor' }}</span>
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
const isSubmitting = ref(false);
const errorMessage = ref('');

const outcomeOptions = [
  {
    id: 'ready_for_approval',
    label: 'Feasible — Ready for Approval',
    description: 'Scope verified on site; clear to proceed with regular work scheduling.',
    activeClass: 'border-emerald-500 bg-emerald-50/70 text-emerald-900',
  },
  {
    id: 'materials_needed',
    label: 'Materials Required for Work',
    description: 'Site checked; specific supplies or parts must be allocated first.',
    activeClass: 'border-amber-500 bg-amber-50/70 text-amber-900',
  },
  {
    id: 'scope_adjusted',
    label: 'Scope / Duration Adjusted',
    description: 'Inspection identified larger technical scope or preparation needs.',
    activeClass: 'border-blue-500 bg-blue-50/70 text-blue-900',
  },
  {
    id: 'deferred_infeasible',
    label: 'Outside Scope / Client Coordination',
    description: 'Requires facility occupant action or administrative endorsement.',
    activeClass: 'border-rose-500 bg-rose-50/70 text-rose-900',
  },
];

const presets = [
  'Ocular inspection completed. Scope of repair confirmed feasible; proceeding with work review.',
  'Ocular inspection completed. Site verified; specific parts checklist submitted for preparation.',
  'Ocular inspection completed. Work area must be cleared of occupant items before personnel can begin.',
  'Ocular inspection completed. Safety protocol verified; technical dispatch to be scheduled.',
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

const applyPreset = (preset) => {
  if (!findingsText.value) {
    findingsText.value = preset;
  } else {
    findingsText.value += (findingsText.value.endsWith('.') ? ' ' : '. ') + preset;
  }
};

watch(() => props.isOpen, (open) => {
  if (open) {
    inspectorName.value = defaultInspector.value;
    inspectionDate.value = new Date().toISOString().slice(0, 10);
    findingsText.value = '';
    selectedOutcome.value = 'ready_for_approval';
    resumeToPending.value = false;
    errorMessage.value = '';
  }
});

const handleSubmit = async () => {
  const ticketId = props.ticket?.ticketId || props.ticket?.id;
  if (!ticketId) return;

  if (!findingsText.value.trim()) {
    errorMessage.value = 'Please provide detailed findings and instructions for the requestor.';
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
</style>
