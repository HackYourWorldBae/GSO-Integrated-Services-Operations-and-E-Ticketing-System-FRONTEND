<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 pointer-events-auto overflow-y-auto">
        <div class="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity" @click="$emit('close')"></div>

        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-5 sm:p-7 relative z-10 animate-modal-pop border border-slate-100 max-h-[calc(100dvh-2rem)] sm:max-h-[90vh] overflow-y-auto custom-scrollbar my-auto">
          <!-- Header -->
          <div class="flex items-start justify-between gap-4 pb-3.5 border-b border-slate-100">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100 shadow-xs">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-black text-slate-900 tracking-tight">Set for Ocular Inspection</h3>
                <p class="text-[11px] font-medium text-slate-500">
                  Assign inspector &amp; schedule on-site site assessment.
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
            <!-- Context Pill Strip -->
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
              </div>
            </div>

            <!-- Assigned Inspector -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Assigned Inspector / Staff
              </label>
              <input
                type="text"
                v-model="inspectorName"
                placeholder="e.g., Engr. Santos / Unit Lead Evaluator"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>

            <!-- Scheduled Inspection Date -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Scheduled Inspection Date <span class="text-rose-500">*</span>
              </label>
              <input
                type="date"
                v-model="scheduledDate"
                :min="minDate"
                required
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white transition-all"
              />
            </div>

            <!-- Inspection Instructions / Scope -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Inspection Scope / Instructions <span class="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                v-model="inspectionNotes"
                rows="3"
                placeholder="Add special instructions or specific site scope to inspect..."
                class="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-normal focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white transition-all placeholder:text-slate-400 leading-relaxed"
              ></textarea>
            </div>

            <!-- Live Notice Preview Accordion -->
            <div class="border border-slate-200/80 rounded-2xl overflow-hidden bg-slate-50/50">
              <button
                type="button"
                @click="showPreview = !showPreview"
                class="w-full px-4 py-2 flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-colors cursor-pointer"
              >
                <div class="flex items-center gap-2">
                  <svg class="h-3.5 w-3.5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{{ showPreview ? 'Hide Notice Preview' : 'Preview Live Message Sent to Requestor' }}</span>
                </div>
                <svg :class="['h-3.5 w-3.5 transition-transform duration-200 text-slate-400', showPreview ? 'rotate-180' : '']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div v-if="showPreview" class="p-3 bg-white border-t border-slate-200/80 text-[11px] font-mono text-slate-700 whitespace-pre-wrap leading-relaxed">
                {{ formattedNoticeText }}
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
                :disabled="isSubmitting || !scheduledDate"
                class="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-sky-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                <svg v-if="isSubmitting" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>{{ isSubmitting ? 'Setting Inspection...' : 'Set for Inspection' }}</span>
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
import { toast } from 'vue3-toastify';
import apiClient from '@/api/client';
import { setTicketForInspection } from '@/api/tickets';
import { useAuthStore } from '@/stores/auth';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  ticket: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'confirmed']);

const authStore = useAuthStore();

const inspectorName = ref('');
const scheduledDate = ref('');
const inspectionNotes = ref('');
const isSubmitting = ref(false);
const errorMessage = ref('');
const showPreview = ref(false);

// Default min date is today
const todayIso = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
const minDate = ref(todayIso());

// Auto-fill defaults on modal open
watch(() => props.isOpen, (open) => {
  if (open) {
    errorMessage.value = '';
    showPreview.value = false;
    scheduledDate.value = todayIso();
    const currentUser = authStore.user;
    const defaultName = currentUser?.first_name 
      ? `${currentUser.first_name} ${currentUser.last_name || ''}`.trim()
      : 'GSO Inspection Team';
    inspectorName.value = defaultName;
    inspectionNotes.value = '';
  }
});

const formattedNoticeText = computed(() => {
  const dateFormatted = scheduledDate.value 
    ? new Date(scheduledDate.value + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Pending Schedule';
  const inspector = inspectorName.value.trim() || 'GSO Inspection Team';
  const notes = inspectionNotes.value.trim();

  let text = `[OCULAR INSPECTION SCHEDULED - ${dateFormatted}]\nScheduled Date: ${dateFormatted}\nAssigned Inspector: ${inspector}`;
  if (notes) {
    text += `\nInstructions: ${notes}`;
  }
  return text;
});

const handleSubmit = async () => {
  const ticketId = props.ticket?.ticketId || props.ticket?.id;
  if (!ticketId) {
    errorMessage.value = 'Ticket ID is missing.';
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';

  const payload = {
    inspector: inspectorName.value.trim(),
    inspector_name: inspectorName.value.trim(),
    scheduled_date: scheduledDate.value,
    notes: inspectionNotes.value.trim(),
    instructions: inspectionNotes.value.trim(),
  };

  const notation = formattedNoticeText.value;

  try {
    // Try the dedicated endpoint first
    try {
      await setTicketForInspection(ticketId, payload);
    } catch (endpointErr) {
      console.warn('Dedicated set-inspection endpoint returned error, falling back to notation update:', endpointErr);
      // Fallback: update staff notation
      await apiClient.patch(`/tickets/${ticketId}/notation`, {
        notation,
        staff_notation: notation,
      });
    }

    toast.success(`Ticket #${ticketId} has been set for ocular inspection.`);
    emit('confirmed', {
      ticketId,
      scheduledDate: scheduledDate.value,
      inspector: inspectorName.value.trim(),
      notation,
    });
    emit('close');
  } catch (err) {
    console.error('Failed to set ticket for inspection:', err);
    errorMessage.value = err.response?.data?.message || err.response?.data?.messages?.error || 'Failed to set ticket for inspection. Please try again.';
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
