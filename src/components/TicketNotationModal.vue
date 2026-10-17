<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 pointer-events-auto overflow-y-auto">
        <div class="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity" @click="$emit('close')"></div>

        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-8 relative z-10 animate-modal-pop border border-slate-100 max-h-[calc(100dvh-2rem)] sm:max-h-[88vh] overflow-y-auto custom-scrollbar my-auto">
          <!-- Header -->
          <div class="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div class="flex items-center gap-3">
              <div :class="['w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs', themeIconBg]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-black text-slate-900">Ticket Update &amp; Notation</h3>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  Ticket #{{ ticket?.id }} &bull; {{ ticket?.service || ticket?.service_type || 'GSO Request' }}
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
            <!-- Requester Context Card -->
            <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs">
              <div class="min-w-0">
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Requestor</span>
                <span class="font-bold text-slate-800 truncate block">{{ ticket?.requester || ticket?.user_name || 'Requester' }}</span>
              </div>
              <div class="text-right shrink-0">
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Current Status</span>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-200 text-slate-800 border border-slate-300">
                  {{ ticket?.status_label || ticket?.status || 'Scheduled' }}
                </span>
              </div>
            </div>

            <!-- Existing Notation Preview (if previously posted) -->
            <div v-if="currentNotation" class="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs">
              <div class="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Current Active Notation on File:</span>
              </div>
              <p class="text-slate-700 italic pl-5">"{{ currentNotation }}"</p>
            </div>

            <!-- Quick Template Chips -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Quick Template / Presets
              </label>
              <div class="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  v-for="(preset, idx) in presetTemplates"
                  :key="idx"
                  @click="applyPreset(preset)"
                  class="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer active:scale-95 text-left"
                >
                  {{ preset }}
                </button>
              </div>
            </div>

            <!-- Notation Textarea -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Update / Recommendation for Requestor <span class="text-rose-500">*</span>
                </label>
                <span class="text-[10px] font-bold text-slate-400">
                  {{ notationText.length }}/500 chars
                </span>
              </div>
              <textarea
                v-model="notationText"
                rows="4"
                maxlength="500"
                required
                placeholder="Enter updates, operational instructions, or recommendations that will be communicated to the requestor..."
                :class="[
                  'w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:bg-white transition-all',
                  themeFocusBorder
                ]"
              ></textarea>
            </div>

            <!-- Transparency / Notification Banner -->
            <div class="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-start gap-2.5 text-xs text-blue-900">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <div class="leading-relaxed">
                <strong class="font-bold text-blue-950">Immediate Requestor Notification:</strong>
                This note will display as an official extension card on the user's dashboard and dispatch an email update to their registered address.
              </div>
            </div>

            <!-- Error Banner -->
            <div v-if="errorMessage" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              {{ errorMessage }}
            </div>

            <!-- Modal Action Buttons -->
            <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                @click="$emit('close')"
                class="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSubmitting || !notationText.trim()"
                :class="[
                  'px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer',
                  themeButtonBg
                ]"
              >
                <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isSubmitting ? 'Posting Update...' : 'Post Update & Notify' }}</span>
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
import api from '@/api/client';

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  ticket: { type: Object, default: null },
  unitCode: { type: String, default: 'FGMU' },
});

const emit = defineEmits(['close', 'saved']);

const notationText = ref('');
const isSubmitting = ref(false);
const errorMessage = ref('');

const isLeau = computed(() => (props.unitCode || props.ticket?.unit || '').toUpperCase() === 'LEAU');
const isSsu = computed(() => (props.unitCode || props.ticket?.unit || '').toUpperCase() === 'SSU');

const themeIconBg = computed(() => {
  if (isSsu.value) return 'bg-blue-50 text-blue-600';
  if (isLeau.value) return 'bg-amber-50 text-amber-600';
  return 'bg-emerald-50 text-emerald-600';
});

const themeFocusBorder = computed(() => {
  if (isSsu.value) return 'focus:ring-blue-500/20 focus:border-blue-500';
  if (isLeau.value) return 'focus:ring-amber-500/20 focus:border-amber-500';
  return 'focus:ring-emerald-500/20 focus:border-emerald-500';
});

const themeButtonBg = computed(() => {
  if (isSsu.value) return 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20';
  if (isLeau.value) return 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20';
  return 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20';
});

const currentNotation = computed(() => {
  return props.ticket?.staff_notation || props.ticket?.ssu_notation || props.ticket?.notation || '';
});

const presetTemplates = [
  'Site pre-inspected; work will proceed according to schedule.',
  'Work is progressing smoothly. Personnel are currently on-site.',
  'Schedule adjusted due to adverse weather / heavy rain; staff on standby.',
  'Parts/materials delivery is in transit; installation will commence upon arrival.',
  'Temporary power shutdown or access restriction encountered; work will resume shortly.',
  'Coordination required with facility occupant before commencing technical work.',
];

const applyPreset = (preset) => {
  if (!notationText.value) {
    notationText.value = preset;
  } else {
    notationText.value += (notationText.value.endsWith('.') ? ' ' : '. ') + preset;
  }
};

watch(() => props.isOpen, (open) => {
  if (open) {
    notationText.value = currentNotation.value;
    errorMessage.value = '';
  }
});

const handleSubmit = async () => {
  if (!props.ticket?.id) return;
  if (!notationText.value.trim()) {
    errorMessage.value = 'Please enter notation text.';
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    const payload = { notation: notationText.value.trim() };
    const res = await api.patch(`tickets/${props.ticket.id}/notation`, payload);
    emit('saved', {
      ticketId: props.ticket.id,
      notation: notationText.value.trim(),
      data: res.data?.data,
    });
    emit('close');
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Failed to post ticket update. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>
