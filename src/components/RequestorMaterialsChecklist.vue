<template>
  <div
    v-if="hasRequiredMaterials"
    :class="[
      'rounded-2xl border transition-all duration-150',
      isConfirmedReady
        ? 'bg-emerald-50/75 border-emerald-200 p-4'
        : 'bg-amber-50/80 border-amber-200 p-4',
      compact ? 'mt-3' : 'mb-5'
    ]"
  >
    <!-- Header Row -->
    <div class="flex items-start justify-between gap-3 flex-wrap">
      <div class="flex items-start gap-2.5 min-w-0">
        <div
          :class="[
            'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
            isConfirmedReady
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
          ]"
        >
          <svg
            v-if="isConfirmedReady"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M5 13l4 4L19 7" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <h4
              :class="[
                'text-xs sm:text-sm font-black uppercase tracking-wider',
                isConfirmedReady ? 'text-emerald-900' : 'text-amber-950'
              ]"
            >
              {{ isConfirmedReady ? 'Materials Confirmed On-Hand' : 'Materials Needed for Your Request' }}
            </h4>
            <span
              :class="[
                'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border',
                isConfirmedReady
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : 'bg-amber-200/80 text-amber-900 border-amber-300'
              ]"
            >
              {{
                isConfirmedReady
                  ? 'Ready for Approval'
                  : `${checkedCount}/${materials.length} Checked`
              }}
            </span>
          </div>
          <p
            :class="[
              'text-xs font-medium mt-0.5 leading-relaxed',
              isConfirmedReady ? 'text-emerald-800' : 'text-amber-900'
            ]"
          >
            {{
              isConfirmedReady
                ? 'You confirmed all needed materials are available. Your request has been returned to the approval queue.'
                : 'Following ocular inspection, GSO inventory is short or empty for these items. Check off each item once you already have it to continue approval.'
            }}
          </p>
        </div>
      </div>

      <!-- Select All Toggle (only while awaiting requestor on pending ticket) -->
      <button
        v-if="canConfirm && materials.length > 1"
        type="button"
        @click="toggleSelectAll"
        class="min-h-[36px] px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100/70 text-amber-900 border border-amber-300 text-xs font-bold transition-colors cursor-pointer shrink-0"
      >
        {{ allChecked ? 'Uncheck All' : 'Check All Materials' }}
      </button>
    </div>

    <!-- Inspector Notes Banner -->
    <div
      v-if="ticket.required_materials_notes"
      class="mt-3 p-2.5 rounded-xl bg-white/90 border border-slate-200/80 text-xs text-slate-700 leading-relaxed"
    >
      <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
        GSO Assessment Note
      </span>
      {{ ticket.required_materials_notes }}
    </div>

    <!-- Materials Checklist Items -->
    <div class="mt-3 space-y-2">
      <label
        v-for="item in materials"
        :key="item.id || item.material_name"
        :class="[
          'flex items-start gap-3 p-3 rounded-xl border min-h-[44px] transition-all duration-150 select-none',
          isConfirmedReady
            ? 'bg-white/95 border-emerald-200'
            : canConfirm
              ? isChecked(item.id)
                ? 'bg-emerald-50/90 border-emerald-300 cursor-pointer'
                : 'bg-white border-amber-200/90 hover:border-amber-400 cursor-pointer'
              : 'bg-white border-slate-200'
        ]"
      >
        <!-- Checkbox (Actionable) or Static Check Icon (Confirmed) -->
        <div class="pt-0.5 shrink-0">
          <div
            v-if="isConfirmedReady"
            class="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <input
            v-else-if="canConfirm"
            type="checkbox"
            :checked="isChecked(item.id)"
            @change="toggleItem(item.id)"
            class="w-5 h-5 rounded border-amber-400 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
          />
          <div
            v-else
            class="w-5 h-5 rounded-md border border-slate-300 bg-slate-100"
          ></div>
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <span
              :class="[
                'text-xs sm:text-sm font-bold',
                isConfirmedReady || isChecked(item.id) ? 'text-slate-900' : 'text-slate-800'
              ]"
            >
              {{ item.material_name }}
            </span>
            <div class="flex items-center gap-1.5 flex-wrap shrink-0">
              <span class="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-black tabular-nums">
                {{ formatQuantity(item.quantity) }} {{ item.unit_measurement || 'pcs' }}
              </span>
              <span
                :class="[
                  'px-2 py-0.5 rounded-md text-[10px] font-bold',
                  statusReasonBadgeClass(item.inventory_status)
                ]"
              >
                {{ formatInventoryStatus(item) }}
              </span>
            </div>
          </div>
          <p v-if="item.remarks" class="text-[11px] text-slate-600 mt-1">
            Note: {{ item.remarks }}
          </p>
        </div>
      </label>
    </div>

    <!-- Confirmed Summary Footer -->
    <div
      v-if="isConfirmedReady"
      class="mt-3 pt-2.5 border-t border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-900"
    >
      <span v-if="ticket.requestor_materials_note" class="italic font-medium">
        Your Note: "{{ ticket.requestor_materials_note }}"
      </span>
      <span v-else class="font-semibold">All listed materials marked available on-hand.</span>
      <span v-if="ticket.required_materials_confirmed_at" class="text-[11px] text-emerald-700 font-semibold shrink-0">
        Confirmed {{ formatTimestamp(ticket.required_materials_confirmed_at) }}
      </span>
    </div>

    <!-- Action Controls when Requestor Must Confirm -->
    <div v-else-if="canConfirm" class="mt-3.5 pt-3 border-t border-amber-200/80 space-y-2.5">
      <input
        v-model="requestorNote"
        type="text"
        maxlength="1000"
        placeholder="Optional note (e.g., Materials are already prepared at our office)..."
        class="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-amber-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
      />

      <div
        v-if="errorMessage"
        class="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold"
      >
        {{ errorMessage }}
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span class="text-[11px] font-semibold text-amber-900">
          {{
            allChecked
              ? 'All items checked! Submit below to continue your ticket approval.'
              : `Check off all ${remainingCount} remaining item${remainingCount === 1 ? '' : 's'} once you have them.`
          }}
        </span>

        <button
          type="button"
          @click="handleConfirmMaterials"
          :disabled="!allChecked || isSubmitting"
          class="min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-black uppercase tracking-wider transition-all duration-150 active:scale-[0.98] shadow-sm cursor-pointer flex items-center justify-center gap-2 shrink-0"
        >
          <svg
            v-if="isSubmitting"
            class="animate-spin h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span>{{ isSubmitting ? 'Updating Approval Status...' : 'I Already Have All Materials — Continue Approval' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { toast } from 'vue3-toastify';
import { confirmRequestorMaterials } from '@/api/tickets';
import {
  buildRequiredMaterialsSignature,
  areAllMaterialsChecked,
  formatRequiredInventoryStatus,
} from '@/utils/requiredMaterials';

const props = defineProps({
  ticket: { type: Object, required: true },
  compact: { type: Boolean, default: false },
});

const emit = defineEmits(['confirmed']);

const checkedIds = ref([]);
const requestorNote = ref('');
const isSubmitting = ref(false);
const errorMessage = ref('');
const lastServerSignature = ref('');

const materials = computed(() =>
  Array.isArray(props.ticket?.required_materials) ? props.ticket.required_materials : []
);

const hasRequiredMaterials = computed(() => materials.value.length > 0);

const requiredMaterialsStatus = computed(() =>
  String(props.ticket?.required_materials_status || 'awaiting_requestor').toLowerCase()
);

const isConfirmedReady = computed(() => requiredMaterialsStatus.value === 'requestor_ready');

const canConfirm = computed(
  () => !isConfirmedReady.value && String(props.ticket?.status || '').toLowerCase() === 'pending'
);

const serverSignature = computed(() => buildRequiredMaterialsSignature(props.ticket));

watch(
  serverSignature,
  (nextSig) => {
    if (!nextSig) return;
    if (isConfirmedReady.value) {
      checkedIds.value = materials.value.map((m) => Number(m.id)).filter(Boolean);
      lastServerSignature.value = nextSig;
      return;
    }
    if (lastServerSignature.value !== nextSig) {
      checkedIds.value = materials.value
        .filter((m) => Number(m.is_requestor_provided) === 1)
        .map((m) => Number(m.id));
      requestorNote.value = props.ticket?.requestor_materials_note || '';
      errorMessage.value = '';
      lastServerSignature.value = nextSig;
    }
  },
  { immediate: true }
);

const isChecked = (id) => checkedIds.value.includes(Number(id));

const toggleItem = (id) => {
  const numId = Number(id);
  errorMessage.value = '';
  if (checkedIds.value.includes(numId)) {
    checkedIds.value = checkedIds.value.filter((item) => item !== numId);
  } else {
    checkedIds.value = [...checkedIds.value, numId];
  }
};

const checkedCount = computed(() =>
  materials.value.filter((m) => checkedIds.value.includes(Number(m.id))).length
);

const allChecked = computed(() => areAllMaterialsChecked(materials.value, checkedIds.value));

const remainingCount = computed(() => Math.max(0, materials.value.length - checkedCount.value));

const toggleSelectAll = () => {
  errorMessage.value = '';
  if (allChecked.value) {
    checkedIds.value = [];
  } else {
    checkedIds.value = materials.value.map((m) => Number(m.id));
  }
};

const formatQuantity = (qty) => {
  const num = Number(qty ?? 1);
  if (!Number.isFinite(num)) return '1';
  return Number.isInteger(num) ? String(num) : String(Number(num.toFixed(2)));
};

const statusReasonBadgeClass = (status) => {
  switch (String(status || '').toLowerCase()) {
    case 'empty':
      return 'bg-rose-500/10 text-rose-600';
    case 'short':
      return 'bg-amber-500/10 text-amber-700';
    default:
      return 'bg-slate-100 text-slate-600';
  }
};

const formatInventoryStatus = (item) => formatRequiredInventoryStatus(item);

const formatTimestamp = (val) => {
  if (!val) return '';
  const parsed = new Date(String(val).replace(' ', 'T'));
  if (isNaN(parsed.getTime())) return val;
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const handleConfirmMaterials = async () => {
  if (!allChecked.value || isSubmitting.value) return;
  const targetId = props.ticket?.ticketId || props.ticket?.id;
  if (!targetId) return;

  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    const response = await confirmRequestorMaterials(targetId, {
      material_ids: checkedIds.value,
      note: requestorNote.value.trim(),
    });
    const data = response.data?.data || {};
    toast.success(`Materials confirmed! Ticket #${targetId} returned to the approval queue.`);
    emit('confirmed', {
      ticketId: targetId,
      is_approval_delayed: 0,
      status_label: data.status_label || 'Pending Approval',
      required_materials_status: 'requestor_ready',
      required_materials_confirmed_at:
        data.required_materials_confirmed_at || new Date().toISOString(),
      requestor_materials_note: data.requestor_materials_note ?? (requestorNote.value.trim() || null),
      required_materials: data.required_materials || materials.value,
    });
  } catch (err) {
    const msg =
      err.response?.data?.message ||
      'Failed to confirm materials readiness. Please try again.';
    errorMessage.value = msg;
    toast.error(msg);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
