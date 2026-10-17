<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 pointer-events-auto overflow-y-auto">
        <div class="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity" @click="$emit('close')"></div>

        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-8 relative z-10 animate-modal-pop border border-slate-100 max-h-[calc(100dvh-2rem)] sm:max-h-[88vh] overflow-y-auto custom-scrollbar my-auto">
          <!-- Header -->
          <div class="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div class="flex items-center gap-3">
              <div :class="['w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs', isLeau ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600']">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-black text-slate-900">Reschedule Ticket / Adjust Duration</h3>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  Ticket #{{ ticket?.id }} &bull; {{ ticket?.service || ticket?.service_type || 'Scheduled Service' }}
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
            <!-- Current Baseline Info Card -->
            <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Current Schedule</span>
                <span class="font-bold text-slate-800">{{ currentScheduleDisplay || 'Not set' }}</span>
              </div>
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Duration</span>
                <span class="font-bold text-slate-800">{{ currentWorkingDays }} {{ currentWorkingDays === 1 ? 'Working Day' : 'Working Days' }}</span>
              </div>
            </div>

            <!-- New Implementation Date Picker -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                New Implementation Date <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="implementationDate"
                type="date"
                required
                :min="minDate"
                :class="[
                  'w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:bg-white transition-all',
                  themeFocusBorder
                ]"
              />
              <p class="text-[10px] text-slate-400 mt-1">Select the target date when personnel will commence work on site.</p>
            </div>

            <!-- Working Days Duration / Extension -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Number of Working Days <span class="text-rose-500">*</span>
                </label>
                <span class="text-[10px] text-slate-400 font-bold">
                  {{ workingDays }} {{ workingDays === 1 ? 'Day' : 'Days' }} (excl. weekends/holidays)
                </span>
              </div>

              <!-- Quick Pills -->
              <div class="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  v-for="days in [1, 2, 3, 5, 10]"
                  :key="days"
                  @click="workingDays = days"
                  :class="[
                    'flex-1 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border transition-all cursor-pointer',
                    workingDays === days
                      ? (isLeau ? 'bg-amber-600 text-white border-amber-600 shadow-sm' : 'bg-emerald-600 text-white border-emerald-600 shadow-sm')
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  ]"
                >
                  {{ days }}d
                </button>
              </div>

              <input
                v-model.number="workingDays"
                type="number"
                min="1"
                max="90"
                required
                placeholder="Or enter custom number of working days"
                :class="[
                  'w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:bg-white transition-all',
                  themeFocusBorder
                ]"
              />
            </div>

            <!-- Calculated Target Completion Date Preview -->
            <div class="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-start gap-3">
              <div class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="min-w-0">
                <span class="text-[10px] font-black uppercase tracking-widest text-emerald-800 block">Calculated Target Completion Date</span>
                <p class="text-sm font-black text-slate-900 mt-0.5">
                  {{ calculatedDateDisplay }}
                </p>
                <p class="text-[11px] text-emerald-700/90 font-medium mt-0.5">
                  ✓ Automatically skips weekends and official non-working holidays.
                </p>
              </div>
            </div>

            <!-- Reason / Circumstance Dropdown -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Reason for Schedule Adjustment / Extension <span class="text-rose-500">*</span>
              </label>
              <select
                v-model="reasonCategory"
                required
                :class="[
                  'w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:bg-white transition-all cursor-pointer mb-2',
                  themeFocusBorder
                ]"
              >
                <option value="Schedule Re-aligned with Operational Availability">Schedule Re-aligned with Operational Availability</option>
                <option value="Adverse Weather / Typhoon / Heavy Rain">Adverse Weather / Typhoon / Heavy Rain</option>
                <option value="Delayed Material / Supplies Delivery">Delayed Material / Supplies Delivery</option>
                <option value="Facility Access Rescheduled by Requestor">Facility Access Rescheduled by Requestor</option>
                <option value="Priority Emergency Preemption">Priority Emergency Preemption</option>
                <option value="Technical Complications Discovered on Site">Technical Complications Discovered on Site</option>
                <option value="Other Operational Reason">Other Operational Reason</option>
              </select>

              <input
                v-if="reasonCategory === 'Other Operational Reason'"
                v-model="customReason"
                type="text"
                required
                placeholder="Specify reason for schedule change..."
                :class="[
                  'w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:bg-white transition-all',
                  themeFocusBorder
                ]"
              />
            </div>

            <!-- Optional Note for Requestor -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Update / Notation for Requestor (Optional)
              </label>
              <textarea
                v-model="notationNote"
                rows="2"
                maxlength="300"
                placeholder="Optional notation communicated directly to the requestor..."
                :class="[
                  'w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:bg-white transition-all',
                  themeFocusBorder
                ]"
              ></textarea>
            </div>

            <!-- Notify Requestor Checkbox -->
            <label class="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100/70 transition-colors">
              <input
                type="checkbox"
                v-model="notifyRequestor"
                class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <div class="text-xs">
                <span class="font-bold text-slate-800">Notify Requestor</span>
                <span class="text-slate-500 block text-[11px]">Dispatch in-app alert and update email to requestor</span>
              </div>
            </label>

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
                :disabled="isSubmitting || !implementationDate"
                :class="[
                  'px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer',
                  themeButtonBg
                ]"
              >
                <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isSubmitting ? 'Updating...' : 'Save Schedule' }}</span>
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
import { addWorkingDays, formatDateToYmd } from '@/utils/workCalendar';

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  ticket: { type: Object, default: null },
  unitCode: { type: String, default: 'FGMU' },
});

const emit = defineEmits(['close', 'rescheduled']);

const implementationDate = ref('');
const workingDays = ref(1);
const reasonCategory = ref('Schedule Re-aligned with Operational Availability');
const customReason = ref('');
const notationNote = ref('');
const notifyRequestor = ref(true);
const isSubmitting = ref(false);
const errorMessage = ref('');

const isLeau = computed(() => (props.unitCode || props.ticket?.unit || '').toUpperCase() === 'LEAU');

const themeFocusBorder = computed(() => {
  return isLeau.value ? 'focus:ring-amber-500/20 focus:border-amber-500' : 'focus:ring-emerald-500/20 focus:border-emerald-500';
});

const themeButtonBg = computed(() => {
  return isLeau.value ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20';
});

const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

const currentScheduleDisplay = computed(() => {
  if (!props.ticket) return '';
  const raw = props.ticket.assignment?.implementation_date 
    || props.ticket.implementation_date 
    || props.ticket.project_target_date;
  if (!raw) return 'Not scheduled';
  const d = new Date(String(raw).replace(' ', 'T'));
  return isNaN(d.getTime()) ? String(raw) : d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
});

const currentWorkingDays = computed(() => {
  return props.ticket?.working_days || props.ticket?.assignment?.working_days || props.ticket?.project_working_days || 1;
});

// Calculate future target completion date based on selected implementation date + working days
const calculatedNewDate = computed(() => {
  if (!implementationDate.value) return new Date();
  const d = new Date(implementationDate.value + 'T00:00:00');
  const days = Math.max(1, Number(workingDays.value) || 1);
  return addWorkingDays(d, days);
});

const calculatedDateDisplay = computed(() => {
  return calculatedNewDate.value.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
});

watch(() => props.isOpen, (open) => {
  if (open) {
    const raw = props.ticket?.assignment?.implementation_date 
      || props.ticket?.implementation_date 
      || '';
    if (raw) {
      implementationDate.value = String(raw).substring(0, 10);
    } else {
      implementationDate.value = minDate.value;
    }
    workingDays.value = currentWorkingDays.value;
    reasonCategory.value = 'Schedule Re-aligned with Operational Availability';
    customReason.value = '';
    notationNote.value = props.ticket?.staff_notation || props.ticket?.notation || '';
    notifyRequestor.value = true;
    errorMessage.value = '';
  }
});

const handleSubmit = async () => {
  if (!props.ticket?.id || !implementationDate.value) return;

  isSubmitting.value = true;
  errorMessage.value = '';

  const finalReason = reasonCategory.value === 'Other Operational Reason'
    ? (customReason.value.trim() || 'Schedule adjusted by operations')
    : reasonCategory.value;

  try {
    const payload = {
      implementation_date: implementationDate.value,
      working_days: Number(workingDays.value) || 1,
      reason: finalReason,
      notation: notationNote.value.trim(),
      notify_requestor: notifyRequestor.value,
    };

    const res = await api.patch(`tickets/${props.ticket.id}/reschedule`, payload);
    emit('rescheduled', res.data?.data || payload);
    emit('close');
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Failed to reschedule ticket. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>
