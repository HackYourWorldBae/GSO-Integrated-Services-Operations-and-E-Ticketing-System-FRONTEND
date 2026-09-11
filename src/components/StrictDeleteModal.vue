<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  user: {
    type: Object,
    default: null,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['close', 'deactivate-instead', 'confirm-delete']);

const currentStep = ref(1);
const verificationInput = ref('');
const selectedReason = ref('Graduated or separated from university');
const customReason = ref('');
const acknowledgePermanent = ref(false);
const acknowledgeClearance = ref(false);

const targetIdentifier = computed(() => {
  if (!props.user) return '';
  return props.user.email || props.user.student_id_number || 'DELETE';
});

const isVerificationValid = computed(() => {
  if (!targetIdentifier.value) return false;
  const input = verificationInput.value.trim().toLowerCase();
  const expected = targetIdentifier.value.trim().toLowerCase();
  return input === expected || input === 'delete';
});

const finalReason = computed(() => {
  if (selectedReason.value === 'Other') {
    return customReason.value.trim() || 'Other administrative reason';
  }
  return selectedReason.value;
});

const canProceedToFinal = computed(() => {
  if (!isVerificationValid.value) return false;
  if (selectedReason.value === 'Other' && !customReason.value.trim()) return false;
  return true;
});

const canExecuteDelete = computed(() => {
  return (
    acknowledgePermanent.value &&
    acknowledgeClearance.value &&
    !props.isLoading
  );
});

// Reset state when modal opens or user changes
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      currentStep.value = 1;
      verificationInput.value = '';
      selectedReason.value = 'Graduated or separated from university';
      customReason.value = '';
      acknowledgePermanent.value = false;
      acknowledgeClearance.value = false;
    }
  }
);

const handleDeactivateInstead = () => {
  emit('deactivate-instead', props.user);
};

const handleFinalDelete = () => {
  if (!canExecuteDelete.value) return;
  emit('confirm-delete', {
    user: props.user,
    reason: finalReason.value,
  });
};
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-auto overflow-y-auto"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        @click="!isLoading && emit('close')"
      ></div>

      <!-- Modal Card -->
      <div
        class="relative z-10 bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl p-6 sm:p-8 my-8 text-left animate-scale-up"
        @click.stop
      >
        <!-- Modal Top Bar -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h3 class="text-base sm:text-lg font-black text-slate-900 leading-tight">
                Strict Account Deletion
              </h3>
              <p class="text-xs text-slate-500 font-semibold">
                Multistep Security & Governance Protocol
              </p>
            </div>
          </div>

          <button
            type="button"
            :disabled="isLoading"
            @click="emit('close')"
            class="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Progress Indicator -->
        <div class="mb-6">
          <div class="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-2">
            <span :class="{ 'text-purple-700 font-black': currentStep === 1 }">1. Impact & Options</span>
            <span :class="{ 'text-purple-700 font-black': currentStep === 2 }">2. Verification Challenge</span>
            <span :class="{ 'text-rose-700 font-black': currentStep === 3 }">3. Final Authorization</span>
          </div>
          <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
            <div
              class="transition-all duration-300 rounded-full"
              :class="currentStep === 3 ? 'bg-rose-600' : 'bg-purple-600'"
              :style="{ width: `${(currentStep / 3) * 100}%` }"
            ></div>
          </div>
        </div>

        <!-- Target User Summary Capsule -->
        <div v-if="user" class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6 flex items-center justify-between gap-4">
          <div class="min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-black text-slate-900 truncate">
                {{ user.first_name }} {{ user.last_name }}
              </span>
              <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-200 text-slate-700">
                {{ user.role }}
              </span>
            </div>
            <p class="text-xs text-slate-600 truncate">{{ user.email || 'No email registered' }}</p>
            <p v-if="user.student_id_number" class="text-[11px] font-bold text-purple-700 mt-0.5">
              ID No: {{ user.student_id_number }}
            </p>
          </div>
          <div class="shrink-0 text-right">
            <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border"
              :class="user.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                     user.status === 'Deactivated' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                     user.status === 'Suspended' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                     'bg-slate-100 text-slate-600 border-slate-200'">
              {{ user.status }}
            </span>
          </div>
        </div>

        <!-- ──────────────── STEP 1: IMPACT & RECOMMENDATION ──────────────── -->
        <div v-if="currentStep === 1" class="space-y-4">
          <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed space-y-2">
            <div class="flex items-center gap-2 font-bold text-amber-950">
              <svg class="h-4 w-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Recommended: Deactivate Instead of Deleting</span>
            </div>
            <p>
              Deleting a user permanently destroys their authentication record and personal profile. In institutional administration, <strong>Deactivating</strong> is strongly recommended because it blocks the user from requesting services while safely maintaining historic tickets, dispatch audits, and accountability records.
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <p class="font-bold text-slate-800 uppercase text-[10px] tracking-wider">Consequences of Deletion:</p>
            <ul class="list-disc pl-4 space-y-1 text-slate-600">
              <li>Cannot delete if user has active/ongoing service tickets (system safety lock).</li>
              <li>Terminates all active login sessions immediately across all devices.</li>
              <li>Irreversible: The account credentials cannot be recovered or un-deleted.</li>
            </ul>
          </div>

          <!-- Step 1 Actions -->
          <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              @click="handleDeactivateInstead"
              class="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <span>Deactivate Instead (Safer)</span>
            </button>

            <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                @click="emit('close')"
                class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                @click="currentStep = 2"
                class="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Continue to Step 2</span>
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- ──────────────── STEP 2: VERIFICATION CHALLENGE & REASON ──────────────── -->
        <div v-else-if="currentStep === 2" class="space-y-4">
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-700">
              Type <span class="px-2 py-0.5 rounded bg-slate-100 font-mono text-rose-600 font-bold select-all">{{ targetIdentifier }}</span> or <span class="px-2 py-0.5 rounded bg-slate-100 font-mono text-rose-600 font-bold">DELETE</span> to confirm identity:
            </label>
            <input
              v-model="verificationInput"
              type="text"
              autocomplete="off"
              :placeholder="`Enter ${targetIdentifier} or DELETE`"
              class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-700">
              Mandatory Deletion Reason:
            </label>
            <select
              v-model="selectedReason"
              class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors cursor-pointer"
            >
              <option value="Graduated or separated from university">Graduated or separated from university</option>
              <option value="Duplicate or erroneous account registration">Duplicate or erroneous account registration</option>
              <option value="Data privacy / Right to be forgotten request">Data privacy / Right to be forgotten request</option>
              <option value="Institutional disciplinary policy violation">Institutional disciplinary policy violation</option>
              <option value="Other">Other (Specify below)</option>
            </select>
          </div>

          <div v-if="selectedReason === 'Other'" class="space-y-1">
            <label class="block text-[11px] font-bold text-slate-500">Specify reason details:</label>
            <textarea
              v-model="customReason"
              rows="2"
              placeholder="Provide context for account erasure..."
              class="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
            ></textarea>
          </div>

          <!-- Step 2 Actions -->
          <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              @click="currentStep = 1"
              class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors flex items-center gap-1"
            >
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>

            <button
              type="button"
              :disabled="!canProceedToFinal"
              @click="currentStep = 3"
              class="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
            >
              <span>Proceed to Final Step</span>
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- ──────────────── STEP 3: FINAL IRREVERSIBLE ACKNOWLEDGMENT ──────────────── -->
        <div v-else-if="currentStep === 3" class="space-y-4">
          <div class="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs leading-relaxed space-y-2">
            <div class="flex items-center gap-2 font-black text-rose-950 uppercase tracking-wider text-[11px]">
              <svg class="h-4 w-4 text-rose-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Irreversible Action Warning</span>
            </div>
            <p>
              Once executed, this action is permanent and immediate. All authentication data will be purged. You will not be able to undo this operation.
            </p>
          </div>

          <!-- Error from backend (e.g. 409 active tickets) -->
          <div v-if="errorMessage" class="p-3.5 rounded-xl bg-rose-100 border border-rose-300 text-rose-900 text-xs font-semibold space-y-2 animate-fade-in">
            <div class="flex items-start gap-2">
              <svg class="h-4 w-4 text-rose-700 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>{{ errorMessage }}</span>
            </div>
            <div class="pt-1">
              <button
                type="button"
                @click="handleDeactivateInstead"
                class="px-3 py-1.5 rounded-lg bg-white border border-rose-300 text-rose-700 text-[11px] font-bold hover:bg-rose-50 transition-colors"
              >
                Deactivate Account Instead
              </button>
            </div>
          </div>

          <!-- Acknowledgment Checkboxes -->
          <div class="space-y-3 pt-2">
            <label class="flex items-start gap-3 cursor-pointer select-none">
              <input
                v-model="acknowledgePermanent"
                type="checkbox"
                class="mt-1 h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
              />
              <span class="text-xs font-semibold text-slate-700 leading-snug">
                I understand that this user account will be permanently deleted and cannot be restored under any circumstances.
              </span>
            </label>

            <label class="flex items-start gap-3 cursor-pointer select-none">
              <input
                v-model="acknowledgeClearance"
                type="checkbox"
                class="mt-1 h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
              />
              <span class="text-xs font-semibold text-slate-700 leading-snug">
                I verify that this deletion request complies with institutional data retention and audit guidelines.
              </span>
            </label>
          </div>

          <!-- Step 3 Actions -->
          <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              :disabled="isLoading"
              @click="currentStep = 2"
              class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>

            <button
              type="button"
              :disabled="!canExecuteDelete"
              @click="handleFinalDelete"
              class="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              <svg v-if="isLoading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>{{ isLoading ? 'Permanently Deleting...' : 'Permanently Delete Account' }}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  </Transition>
</template>
