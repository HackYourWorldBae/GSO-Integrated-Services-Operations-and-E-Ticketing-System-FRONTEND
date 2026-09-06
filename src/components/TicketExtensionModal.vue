<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-auto">
      <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" @click="$emit('close')"></div>

      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-8 relative z-10 animate-modal-pop border border-slate-100 max-h-[92vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div :class="['w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs', isLeau ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600']">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-black text-slate-900">Extend Ticket / Project</h3>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                Ticket #{{ ticket?.id }} • {{ ticket?.title || ticket?.service_type || 'Active Service' }}
              </p>
            </div>
          </div>
          <button @click="$emit('close')" class="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5 mt-5">
          <!-- Current Schedule Info Card -->
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Current Target Date</span>
              <span class="font-bold text-slate-800">{{ currentFormattedDate || 'Not set' }}</span>
            </div>
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Previous Extensions</span>
              <span class="font-bold text-amber-600">{{ ticket?.extension_days ? `+${ticket.extension_days} Working Day(s)` : 'None' }}</span>
            </div>
          </div>

          <!-- Working Days to Add -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Working Days Extension <span class="text-rose-500">*</span>
            </label>
            <div class="flex items-center gap-2 mb-2.5">
              <button
                type="button"
                v-for="days in [1, 2, 3, 5]"
                :key="days"
                @click="extensionDays = days"
                :class="[
                  'flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all',
                  extensionDays === days
                    ? (isLeau ? 'bg-amber-600 text-white border-amber-600 shadow-sm' : 'bg-emerald-600 text-white border-emerald-600 shadow-sm')
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                ]"
              >
                +{{ days }} {{ days === 1 ? 'Day' : 'Days' }}
              </button>
            </div>
            <div class="relative">
              <input
                v-model.number="extensionDays"
                type="number"
                min="1"
                max="90"
                required
                placeholder="Or enter custom number of working days"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:bg-white transition-all"
                :class="isLeau ? 'focus:ring-amber-500/20 focus:border-amber-500' : 'focus:ring-emerald-500/20 focus:border-emerald-500'"
              />
            </div>
          </div>

          <!-- Calculated Target Date (No weekends/holidays) Preview -->
          <div class="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 flex items-start gap-3">
            <div class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <span class="text-[10px] font-black uppercase tracking-widest text-emerald-800 block">New Calculated Completion Date</span>
              <p class="text-sm font-black text-slate-900 mt-0.5">
                {{ calculatedDateDisplay }}
              </p>
              <p class="text-[11px] text-emerald-700/90 font-medium mt-1">
                ✓ Excludes weekends (Saturdays & Sundays) and official Philippine holidays.
              </p>
            </div>
          </div>

          <!-- Unforeseen Circumstance Reason -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Unforeseen Circumstance / Reason <span class="text-rose-500">*</span>
            </label>
            <select
              v-model="circumstanceCategory"
              required
              class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:bg-white transition-all mb-2"
              :class="isLeau ? 'focus:ring-amber-500/20 focus:border-amber-500' : 'focus:ring-emerald-500/20 focus:border-emerald-500'"
            >
              <option value="" disabled>Select Primary Circumstance</option>
              <option value="Adverse Weather / Typhoon / Heavy Rain">Adverse Weather / Typhoon / Heavy Rain</option>
              <option value="Delayed Material / Parts Delivery">Delayed Material / Parts Delivery</option>
              <option value="Unforeseen Site / Structural Complications">Unforeseen Site / Structural Complications</option>
              <option value="Power Outage / Facility Access Restriction">Power Outage / Facility Access Restriction</option>
              <option value="Assigned Staff Illness / Medical Emergency">Assigned Staff Illness / Medical Emergency</option>
              <option value="Priority Emergency Task Dispatched">Priority Emergency Task Dispatched</option>
              <option value="Other Unforeseen Circumstance">Other Unforeseen Circumstance</option>
            </select>

            <textarea
              v-model="reasonDetails"
              rows="3"
              required
              placeholder="Provide specific details (e.g. Roof repair paused due to continuous afternoon downpour)..."
              class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:bg-white transition-all"
              :class="isLeau ? 'focus:ring-amber-500/20 focus:border-amber-500' : 'focus:ring-emerald-500/20 focus:border-emerald-500'"
            ></textarea>
          </div>

          <!-- Overtime Hours Accounting -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Account Overtime Hours (Optional)
              </label>
              <span class="text-[10px] text-slate-400 font-semibold">Outside 8am–5pm shifts</span>
            </div>
            <div class="relative">
              <input
                v-model.number="overtimeHours"
                type="number"
                step="0.5"
                min="0"
                max="40"
                placeholder="0.0 hours"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:bg-white transition-all"
                :class="isLeau ? 'focus:ring-amber-500/20 focus:border-amber-500' : 'focus:ring-emerald-500/20 focus:border-emerald-500'"
              />
              <span class="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold text-slate-400 pointer-events-none">
                Hours
              </span>
            </div>
          </div>

          <!-- Error Alert -->
          <div v-if="errorMessage" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
            {{ errorMessage }}
          </div>

          <!-- Actions -->
          <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              @click="$emit('close')"
              class="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting || !extensionDays"
              :class="[
                'px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5',
                isLeau ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
              ]"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isSubmitting ? 'Extending...' : 'Grant Extension' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import api from '@/api/client';
import { addWorkingDays, formatDateToYmd } from '@/utils/workCalendar';

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  ticket: { type: Object, default: null },
  unitCode: { type: String, default: 'FGMU' },
});

const emit = defineEmits(['close', 'extended']);

const isLeau = computed(() => (props.unitCode || '').toUpperCase() === 'LEAU');

const extensionDays = ref(1);
const circumstanceCategory = ref('Adverse Weather / Typhoon / Heavy Rain');
const reasonDetails = ref('');
const overtimeHours = ref(0);
const isSubmitting = ref(false);
const errorMessage = ref('');

// Compute current baseline target date
const baseTargetDate = computed(() => {
  if (!props.ticket) return new Date();
  const raw = props.ticket.extended_completion_date 
    || props.ticket.effective_target_date 
    || props.ticket.assignment?.implementation_date 
    || props.ticket.project_target_date;
  if (!raw) return new Date();
  const d = new Date(String(raw).replace(' ', 'T'));
  return isNaN(d.getTime()) ? new Date() : d;
});

const currentFormattedDate = computed(() => {
  if (!props.ticket) return '';
  return baseTargetDate.value.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
});

// Calculate new target date using institutional work calendar
const calculatedNewDate = computed(() => {
  return addWorkingDays(baseTargetDate.value, extensionDays.value || 1);
});

const calculatedDateDisplay = computed(() => {
  return calculatedNewDate.value.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
});

watch(() => props.isOpen, (open) => {
  if (open) {
    extensionDays.value = 1;
    circumstanceCategory.value = 'Adverse Weather / Typhoon / Heavy Rain';
    reasonDetails.value = '';
    overtimeHours.value = 0;
    errorMessage.value = '';
  }
});

const handleSubmit = async () => {
  if (!props.ticket?.id) return;
  isSubmitting.value = true;
  errorMessage.value = '';

  const finalReason = `${circumstanceCategory.value}: ${reasonDetails.value.trim()}`;
  const extendedDateStr = formatDateToYmd(calculatedNewDate.value);

  try {
    const payload = {
      extension_days: Number(extensionDays.value),
      extended_date: extendedDateStr,
      extension_reason: finalReason,
      overtime_hours: Number(overtimeHours.value) || 0,
    };

    const res = await api.patch(`tickets/${props.ticket.id}/extend`, payload);
    emit('extended', res.data?.data || payload);
    emit('close');
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Failed to apply extension. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>
