<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-[160] flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-fade-in overflow-y-auto pointer-events-auto"
      @click.self="emitClose"
    >
      <div
        class="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 animate-scale-up flex flex-col max-h-[calc(100dvh-2rem)] sm:max-h-[90vh] overflow-hidden my-auto"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 bg-white">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-1.5">
              <span class="font-mono text-sm sm:text-base font-black text-emerald-800 bg-emerald-50 px-3 py-0.5 rounded-xl border border-emerald-200">
                #{{ ticket?.ticketId || ticket?.id }}
              </span>
              <span class="px-2.5 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                Pending Approval
              </span>
              <span class="text-xs font-bold text-slate-400">
                {{ ticket?.requestedBy || 'Requester' }}
              </span>
            </div>
            <h3 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-sky-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Change Nature of Work</span>
            </h3>
            <p class="text-xs text-slate-500 font-medium mt-0.5">
              Reclassify this ticket to accurately categorize the job request if the requester's selection doesn't match their description.
            </p>
          </div>

          <button
            @click="emitClose"
            :disabled="isSubmitting"
            class="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            title="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Scrollable Modal Body -->
        <div class="p-5 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar text-xs flex-1">
          <!-- Requester's Submitted Context Card -->
          <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
            <div class="flex items-center justify-between gap-2 flex-wrap">
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Requester's Reported Problem</span>
              <span class="text-[11px] font-bold text-slate-500">
                Submitted by {{ ticket?.requestedBy || 'End User' }}
              </span>
            </div>
            <div class="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <p class="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium italic whitespace-pre-wrap">
                "{{ ticket?.description || ticket?.title || 'No detailed description provided by requester.' }}"
              </p>
            </div>
          </div>

          <!-- Current vs New Nature of Work -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <!-- Currently Selected -->
            <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
              <span class="text-[10px] font-black uppercase tracking-wider text-amber-800 block">Current Nature of Work</span>
              <p class="text-sm sm:text-base font-black text-amber-950 leading-tight">
                {{ currentServiceType }}
              </p>
              <p class="text-[11px] text-amber-800/80 font-medium">Selected by requester during ticket intake</p>
            </div>

            <!-- Target Selection Preview -->
            <div class="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-1.5">
              <span class="text-[10px] font-black uppercase tracking-wider text-sky-800 block">Proposed Nature of Work</span>
              <p class="text-sm sm:text-base font-black text-sky-950 leading-tight">
                {{ selectedService || 'Select a service below...' }}
              </p>
              <p class="text-[11px] text-sky-800/80 font-medium">
                {{ selectedService && selectedService !== currentServiceType ? 'Ready to apply update' : 'Must differ from current category' }}
              </p>
            </div>
          </div>

          <!-- Unit Selector Tabs (Allowing cross-unit reclassification if necessary) -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-500">Service Category / Operating Unit</label>
              <span class="text-[10px] font-bold text-slate-400">Unit: {{ activeUnitCode }}</span>
            </div>
            <div class="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                @click="activeUnitCode = 'FGMU'"
                :class="[
                  'flex-1 py-2 px-3 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5',
                  activeUnitCode === 'FGMU'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                ]"
              >
                <span>FGMU Facilities</span>
                <span class="text-[10px] px-1.5 py-0.2 rounded-full" :class="activeUnitCode === 'FGMU' ? 'bg-blue-100 text-blue-800 font-extrabold' : 'bg-slate-200 text-slate-600'">
                  Structure &amp; Utilities
                </span>
              </button>
              <button
                type="button"
                @click="activeUnitCode = 'LEAU'"
                :class="[
                  'flex-1 py-2 px-3 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5',
                  activeUnitCode === 'LEAU'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                ]"
              >
                <span>LEAU Environment</span>
                <span class="text-[10px] px-1.5 py-0.2 rounded-full" :class="activeUnitCode === 'LEAU' ? 'bg-emerald-100 text-emerald-800 font-extrabold' : 'bg-slate-200 text-slate-600'">
                  Janitorial &amp; Grounds
                </span>
              </button>
            </div>
          </div>

          <!-- Service Grid -->
          <div class="space-y-3">
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
              Pick the correct Nature of Work
            </label>

            <!-- FGMU Category Groups -->
            <div v-if="activeUnitCode === 'FGMU'" class="space-y-3.5">
              <!-- Structure & Finishes -->
              <div>
                <p class="text-[11px] font-extrabold text-slate-600 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Structure &amp; Surface Finishes
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    v-for="svc in fgmuStructureServices"
                    :key="svc"
                    type="button"
                    @click="selectService(svc)"
                    :class="[
                      'p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between gap-2 cursor-pointer',
                      selectedService === svc
                        ? 'border-sky-500 bg-sky-50 text-sky-900 ring-2 ring-sky-500/20 shadow-xs'
                        : svc === currentServiceType
                          ? 'border-amber-200 bg-amber-50/40 text-amber-900 opacity-60'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                    ]"
                  >
                    <span>{{ svc }}</span>
                    <span v-if="selectedService === svc" class="w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0">
                      <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                    </span>
                    <span v-else-if="svc === currentServiceType" class="text-[9px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      Current
                    </span>
                  </button>
                </div>
              </div>

              <!-- Utilities & Mechanical -->
              <div>
                <p class="text-[11px] font-extrabold text-slate-600 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Utilities &amp; Mechanical Systems
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    v-for="svc in fgmuUtilityServices"
                    :key="svc"
                    type="button"
                    @click="selectService(svc)"
                    :class="[
                      'p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between gap-2 cursor-pointer',
                      selectedService === svc
                        ? 'border-sky-500 bg-sky-50 text-sky-900 ring-2 ring-sky-500/20 shadow-xs'
                        : svc === currentServiceType
                          ? 'border-amber-200 bg-amber-50/40 text-amber-900 opacity-60'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                    ]"
                  >
                    <span>{{ svc }}</span>
                    <span v-if="selectedService === svc" class="w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0">
                      <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                    </span>
                    <span v-else-if="svc === currentServiceType" class="text-[9px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      Current
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <!-- LEAU Services -->
            <div v-else class="space-y-3.5">
              <div>
                <p class="text-[11px] font-extrabold text-slate-600 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Janitorial, Grounds &amp; Environmental Services
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    v-for="svc in leauServicesList"
                    :key="svc"
                    type="button"
                    @click="selectService(svc)"
                    :class="[
                      'p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between gap-2 cursor-pointer',
                      selectedService === svc
                        ? 'border-sky-500 bg-sky-50 text-sky-900 ring-2 ring-sky-500/20 shadow-xs'
                        : svc === currentServiceType
                          ? 'border-amber-200 bg-amber-50/40 text-amber-900 opacity-60'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                    ]"
                  >
                    <span>{{ svc }}</span>
                    <span v-if="selectedService === svc" class="w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0">
                      <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                    </span>
                    <span v-else-if="svc === currentServiceType" class="text-[9px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      Current
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Reason / Remarks -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-700">
                Reason for Recategorization <span class="text-slate-400 font-normal">(Sent to Requester)</span>
              </label>
              <span class="text-[10px] font-bold text-slate-400">Visible to requester</span>
            </div>

            <!-- Quick Suggestion Chips -->
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="chip in quickReasonChips"
                :key="chip"
                type="button"
                @click="reasonInput = chip"
                class="px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer"
                :class="reasonInput === chip ? 'bg-slate-900 text-white border-slate-900 shadow-2xs' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'"
              >
                {{ chip }}
              </button>
            </div>

            <textarea
              v-model="reasonInput"
              rows="3"
              placeholder="e.g., Description describes leaking plumbing fixtures rather than carpentry work. Recategorized to ensure correct technician assignment."
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-xs sm:text-sm text-slate-900 font-medium placeholder-slate-400 leading-relaxed outline-none transition-all"
            ></textarea>
          </div>

          <!-- Informational Notice Banner -->
          <div class="p-3.5 rounded-xl bg-sky-50/80 border border-sky-200/90 flex items-start gap-2.5 text-sky-900">
            <svg class="w-4 h-4 text-sky-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="text-[11px] leading-relaxed">
              <span class="font-bold">End-User Dashboard Notification:</span>
              Once confirmed, the ticket will be updated, an activity log entry will be created, and the requester will be notified immediately on their dashboard and via email with your explanation.
            </div>
          </div>
        </div>

        <!-- Fixed Modal Footer Actions -->
        <div class="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            @click="emitClose"
            :disabled="isSubmitting"
            class="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            @click="handleSubmit"
            :disabled="isSubmitting || !isFormValid"
            class="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-[0.98] text-white text-xs font-black uppercase tracking-wider shadow-md shadow-sky-600/20 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="isSubmitting" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span>{{ isSubmitting ? 'Updating...' : 'Save Recategorization' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { toast } from 'vue3-toastify';
import { recategorizeTicket } from '@/api/tickets';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  ticket: {
    type: Object,
    default: null,
  },
  currentUnit: {
    type: String,
    default: 'FGMU',
  },
});

const emit = defineEmits(['close', 'recategorized']);

const isSubmitting = ref(false);
const activeUnitCode = ref(props.currentUnit || 'FGMU');
const selectedService = ref('');
const reasonInput = ref('');

const fgmuStructureServices = [
  'Concrete Works',
  'Masonry Works',
  'Welding & Tinsmith Works',
  'Carpentry & Joinery',
  'Glass & Glazing Works',
  'Painting Works',
  'Others',
];

const fgmuUtilityServices = [
  'Electrical Work',
  'Plumbing & Sanitary Works',
  'Electronics & Communication Works',
  'Mechanical Works',
];

const leauServicesList = [
  'Disinfection',
  'Cleaning/ Grubbing',
  'Hauling',
  'Mowing/ Weeding',
  'Planting/ Landscaping',
  'Pruning/ Cutting',
  'Borrowing of plants',
  'Stage & Hall Decoration',
  'Borrowing of tools/ equipment',
  'Others',
];

const quickReasonChips = [
  'Problem specifies plumbing / pipe leaks',
  'Description indicates electrical issue',
  'Requires structural carpentry / masonry',
  'Janitorial cleaning / hauling needed',
  'Campus grounds / mowing maintenance',
  'Misclassified by requester intake',
];

const currentServiceType = computed(() => {
  return props.ticket?.service_type || props.ticket?.service || '';
});

const isFormValid = computed(() => {
  return (
    selectedService.value &&
    selectedService.value.trim().length > 0 &&
    selectedService.value.trim().toLowerCase() !== currentServiceType.value.trim().toLowerCase()
  );
});

// Sync initial values when modal opens or ticket changes
watch(
  () => props.ticket,
  (newTicket) => {
    if (newTicket) {
      const initialSvc = newTicket.service_type || newTicket.service || '';
      selectedService.value = initialSvc;
      reasonInput.value = '';

      const u = (newTicket.unit_code || newTicket.unit || props.currentUnit || 'FGMU').toUpperCase();
      activeUnitCode.value = u === 'LEAU' ? 'LEAU' : 'FGMU';
    }
  },
  { immediate: true }
);

watch(
  () => props.show,
  (isOpen) => {
    if (isOpen && props.ticket) {
      const initialSvc = props.ticket.service_type || props.ticket.service || '';
      selectedService.value = initialSvc;
      reasonInput.value = '';
      const u = (props.ticket.unit_code || props.ticket.unit || props.currentUnit || 'FGMU').toUpperCase();
      activeUnitCode.value = u === 'LEAU' ? 'LEAU' : 'FGMU';
    }
  }
);

const selectService = (serviceName) => {
  selectedService.value = serviceName;
};

const emitClose = () => {
  if (!isSubmitting.value) {
    emit('close');
  }
};

const handleSubmit = async () => {
  if (!props.ticket?.id && !props.ticket?.ticketId) {
    toast.error('Invalid ticket reference.');
    return;
  }

  if (!isFormValid.value) {
    toast.warning('Please select a different nature of work to recategorize.');
    return;
  }

  const ticketId = props.ticket.ticketId || props.ticket.id;
  const newService = selectedService.value.trim();
  const reason = reasonInput.value.trim();

  // Unit ID resolution: FGMU = 1, LEAU = 2
  const targetUnitId = activeUnitCode.value === 'LEAU' ? 2 : 1;

  isSubmitting.value = true;
  try {
    const res = await recategorizeTicket(ticketId, newService, reason, targetUnitId);
    toast.success(`Ticket #${ticketId} recategorized to "${newService}"`);
    emit('recategorized', {
      ticketId,
      oldService: currentServiceType.value,
      newService,
      reason,
      unitId: targetUnitId,
      unitCode: activeUnitCode.value,
      data: res.data?.data,
    });
    emit('close');
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Failed to recategorize ticket. Please try again.';
    toast.error(errorMsg);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
