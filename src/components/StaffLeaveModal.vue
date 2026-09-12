<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-auto">
      <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" @click="$emit('close')"></div>

      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-8 relative z-10 animate-modal-pop border border-slate-100 max-h-[92vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 shadow-xs">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-black text-slate-900">Staff Leave & Active Job Handler</h3>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                {{ worker?.name }} • {{ worker?.role || 'Unit Staff' }}
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
          <!-- Active Job Notice Card -->
          <div class="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
            <div class="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="text-xs">
              <span class="text-[10px] font-black uppercase tracking-widest text-amber-800 block">Worker Has Active Assignment</span>
              <p class="font-bold text-slate-800 mt-0.5">
                Ticket #{{ worker?.assignedTicket || 'Active' }}: {{ worker?.ticketTask || 'Current In-Progress Task' }}
              </p>
              <p class="text-slate-600 text-[11px] mt-1">
                Scheduled: <strong class="text-slate-800">{{ worker?.implementationDate || 'Today' }}</strong>. Since the staff member is taking leave, choose whether to reassign the job or extend its schedule.
              </p>
            </div>
          </div>

          <!-- Leave Reason -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Reason for Leave <span class="text-rose-500">*</span>
            </label>
            <select
              v-model="leaveReasonCategory"
              required
              class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:bg-white transition-all mb-2"
            >
              <option value="Sick Leave / Medical Recovery">Sick Leave / Medical Recovery</option>
              <option value="Emergency Family Leave">Emergency Family Leave</option>
              <option value="Mandatory Training / University Seminar">Mandatory Training / University Seminar</option>
              <option value="Official Leave of Absence">Official Leave of Absence</option>
            </select>
            <input
              v-model="leaveDetails"
              type="text"
              placeholder="Additional notes (e.g. Doctor-ordered 3-day medical rest)..."
              class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:bg-white transition-all"
            />
          </div>

          <!-- Decision: Reassign vs Extend -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Action for Current Active Job <span class="text-rose-500">*</span>
            </label>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <!-- Reassign Option -->
              <label
                :class="[
                  'p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-2',
                  leaveAction === 'reassign'
                    ? (isLeau ? 'border-amber-500 bg-amber-50/30' : 'border-emerald-500 bg-emerald-50/30')
                    : 'border-slate-200 bg-white hover:border-slate-300'
                ]"
              >
                <div class="flex items-start gap-2.5">
                  <input
                    type="radio"
                    v-model="leaveAction"
                    value="reassign"
                    class="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span class="text-xs font-black text-slate-900 block leading-tight">Reassign Job</span>
                    <p class="text-[11px] text-slate-500 mt-1 leading-snug">
                      Transfer active ticket to another available personnel immediately.
                    </p>
                  </div>
                </div>
              </label>

              <!-- Extend Option -->
              <label
                :class="[
                  'p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-2',
                  leaveAction === 'extend'
                    ? (isLeau ? 'border-amber-500 bg-amber-50/30' : 'border-emerald-500 bg-emerald-50/30')
                    : 'border-slate-200 bg-white hover:border-slate-300'
                ]"
              >
                <div class="flex items-start gap-2.5">
                  <input
                    type="radio"
                    v-model="leaveAction"
                    value="extend"
                    class="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span class="text-xs font-black text-slate-900 block leading-tight">Extend Timeline</span>
                    <p class="text-[11px] text-slate-500 mt-1 leading-snug">
                      Keep staff member assigned and push completion date forward.
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <!-- Dynamic Panel A: Reassign Selection -->
          <div v-if="leaveAction === 'reassign'" class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Select Replacement Staff <span class="text-rose-500">*</span>
            </label>
            <div v-if="filteredReplacementWorkers.length === 0" class="text-xs text-rose-600 font-bold p-2 bg-rose-50 rounded-xl border border-rose-200">
              No other workers currently available. Please consider extending the timeline instead.
            </div>
            <select
              v-else
              v-model="reassignToWorkerId"
              required
              class="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            >
              <option value="" disabled>Select an available personnel</option>
              <option
                v-for="cand in filteredReplacementWorkers"
                :key="cand.id"
                :value="cand.id"
              >
                {{ cand.name }} ({{ cand.specialty || cand.role || 'Available' }})
              </option>
            </select>
          </div>

          <!-- Dynamic Panel B: Extend Days Input -->
          <div v-if="leaveAction === 'extend'" class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Extension Days for Recovery <span class="text-rose-500">*</span>
              </label>
              <div class="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  v-for="d in [1, 2, 3, 5]"
                  :key="d"
                  @click="extensionDays = d"
                  :class="[
                    'flex-1 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border transition-all',
                    extensionDays === d
                      ? (isLeau ? 'bg-amber-600 text-white border-amber-600 shadow-sm' : 'bg-emerald-600 text-white border-emerald-600 shadow-sm')
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  ]"
                >
                  +{{ d }} {{ d === 1 ? 'Day' : 'Days' }}
                </button>
              </div>
              <input
                v-model.number="extensionDays"
                type="number"
                min="1"
                max="30"
                required
                class="w-full px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
            <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-semibold">
              New Projected Date: <strong class="text-slate-900">{{ calculatedNewDateDisplay }}</strong>
              <div class="text-[10px] text-slate-500 font-normal mt-0.5">Calculated for working days only (skipping weekends & holidays).</div>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
            {{ errorMessage }}
          </div>

          <!-- Footer Actions -->
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
              :disabled="isSubmitting || (leaveAction === 'reassign' && !reassignToWorkerId)"
              class="px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-md bg-rose-600 hover:bg-rose-500 shadow-rose-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isSubmitting ? 'Processing...' : 'Confirm Leave & Update Job' }}</span>
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
  worker: { type: Object, default: null },
  availableWorkers: { type: Array, default: () => [] },
  unitCode: { type: String, default: 'FGMU' },
});

const emit = defineEmits(['close', 'updated']);

const isLeau = computed(() => (props.unitCode || '').toUpperCase() === 'LEAU');

const leaveAction = ref('reassign');
const leaveReasonCategory = ref('Sick Leave / Medical Recovery');
const leaveDetails = ref('');
const reassignToWorkerId = ref('');
const extensionDays = ref(2);
const isSubmitting = ref(false);
const errorMessage = ref('');

// Filter replacement candidates (exclude the current worker and those on leave)
const filteredReplacementWorkers = computed(() => {
  return props.availableWorkers.filter(w => 
    w.id !== props.worker?.id && 
    w.status !== 'On Leave' && 
    w.status !== 'on_leave'
  );
});

// Calculate new date for the extend option
const calculatedNewDate = computed(() => {
  const base = new Date();
  return addWorkingDays(base, extensionDays.value || 1);
});

const calculatedNewDateDisplay = computed(() => {
  return calculatedNewDate.value.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
});

watch(() => props.isOpen, (open) => {
  if (open) {
    leaveAction.value = filteredReplacementWorkers.value.length > 0 ? 'reassign' : 'extend';
    leaveReasonCategory.value = 'Sick Leave / Medical Recovery';
    leaveDetails.value = '';
    reassignToWorkerId.value = filteredReplacementWorkers.value[0]?.id || '';
    extensionDays.value = 2;
    errorMessage.value = '';
  }
});

const handleSubmit = async () => {
  if (!props.worker?.id) return;
  isSubmitting.value = true;
  errorMessage.value = '';

  const fullReason = leaveDetails.value.trim() 
    ? `${leaveReasonCategory.value}: ${leaveDetails.value.trim()}`
    : leaveReasonCategory.value;

  try {
    const payload = {
      status: 'on_leave',
      leave_action: leaveAction.value,
      leave_reason: fullReason,
    };

    if (leaveAction.value === 'reassign') {
      payload.reassign_to_personnel_id = reassignToWorkerId.value;
    } else if (leaveAction.value === 'extend') {
      payload.extension_days = Number(extensionDays.value);
      payload.extended_completion_date = formatDateToYmd(calculatedNewDate.value);
    }

    const res = await api.patch(`personnel/${props.worker.id}/status`, payload);
    emit('updated', res.data?.data || payload);
    emit('close');
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Failed to update staff leave status. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>
