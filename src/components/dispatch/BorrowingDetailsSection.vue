<script setup>
import { computed } from 'vue';
import { borrowingStatusLabel, isBorrowingService } from '@/utils/borrowing';

// Renders the borrowing request particulars (item, quantity, schedule, purpose,
// and return inspection) inside ticket full-info modals.
// Styled to match the exact aesthetic, cards rhythm, and palette of the Job Request modal.
const props = defineProps({
  ticket: {
    type: Object,
    required: true,
  },
});

const resolvedBorrowing = computed(() => {
  const t = props.ticket;
  if (!t || !isBorrowingService(t)) return null;

  // Helper to pluck typed item name without ever falling back to service name / title
  const extractItemName = (...candidates) => {
    for (const c of candidates) {
      if (typeof c === 'string') {
        const trimmed = c.trim();
        // Disallow generic service names (e.g. "Borrowing of Plants")
        if (trimmed && !isBorrowingService(trimmed)) {
          return trimmed;
        }
      }
    }
    return '';
  };

  const b = (t.borrowing && typeof t.borrowing === 'object') ? t.borrowing : null;
  const d = (t.details && typeof t.details === 'object') ? t.details : null;

  const itemName = extractItemName(
    b?.item_name_requested,
    d?.item_name_requested,
    t.item_name_requested,
    b?.item_name,
    d?.item_name,
    t.item_name,
  );

  const itemModel = b?.item_model_requested || d?.item_model_requested || t.item_model_requested || null;
  const qtyNeeded = b?.quantity_needed ?? d?.quantity_needed ?? t.quantity_needed ?? t.quantity ?? 1;
  const qtyAssigned = b?.assigned_quantity ?? d?.assigned_quantity ?? t.assigned_quantity ?? null;
  const dateNeeded = b?.date_needed || d?.date_needed || t.date_needed || null;
  const expectedReturn = b?.expected_return_date || d?.expected_return_date || t.expected_return_date || null;
  const purpose = b?.purpose_project || d?.purpose_project || t.purpose_project || t.description || '';
  const status = b?.status || d?.status || t.borrowing_status || t.status || 'pending';
  const returnedAt = b?.returned_at || d?.returned_at || t.returned_at || null;
  const returnCondition = b?.return_condition || d?.return_condition || t.return_condition || null;
  const returnNotes = b?.return_notes || d?.return_notes || t.return_notes || null;

  return {
    ...(b || {}),
    ...(d || {}),
    item_name_requested: itemName,
    item_model_requested: itemModel,
    quantity_needed: qtyNeeded,
    assigned_quantity: qtyAssigned,
    date_needed: dateNeeded,
    expected_return_date: expectedReturn,
    purpose_project: purpose,
    status,
    returned_at: returnedAt,
    return_condition: returnCondition,
    return_notes: returnNotes,
  };
});

const borrowing = computed(() => resolvedBorrowing.value);

const statusBadgeClass = computed(() => {
  const s = String(borrowing.value?.status || '').toLowerCase();
  if (s === 'overdue') return 'bg-rose-100 text-rose-800 border-rose-200';
  if (s === 'picked_up') return 'bg-blue-100 text-blue-800 border-blue-200';
  if (s === 'ready_for_pickup') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (s === 'returned') return 'bg-slate-200 text-slate-700 border-slate-300';
  return 'bg-amber-100 text-amber-800 border-amber-200';
});

const formatDate = (val) => {
  if (!val || val === 'N/A' || val === 'null' || val === 'undefined') return '—';
  const str = String(val).trim();
  if (str.length >= 10 && /^\d{4}-\d{2}-\d{2}/.test(str)) {
    const d = new Date(str.slice(0, 10) + 'T00:00:00');
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? str : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
</script>

<template>
  <div v-if="borrowing" class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
    <!-- Section Header matching Job Particulars header -->
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div class="flex items-center gap-2">
        <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Borrowing Request Particulars
        </span>
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <span class="px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider border border-amber-200">
          {{ ticket.service || ticket.service_type || 'Borrowing Request' }}
        </span>
        <span
          v-if="borrowing.status"
          :class="['px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border', statusBadgeClass]"
        >
          {{ borrowingStatusLabel(borrowing.status) }}
        </span>
      </div>
    </div>

    <!-- Row 1: Item & Quantity (2 columns) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <!-- Item/s Requested -->
      <div class="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/70 shadow-2xs space-y-1">
        <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Item/s Requested</span>
        <p class="text-sm sm:text-base font-black text-slate-900 leading-tight">
          {{ borrowing.item_name_requested || 'Unspecified Item' }}
          <span v-if="borrowing.item_model_requested" class="text-xs font-semibold text-slate-500 block sm:inline sm:ml-1">
            ({{ borrowing.item_model_requested }})
          </span>
        </p>
      </div>

      <!-- Quantity Requested / Assigned -->
      <div class="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/70 shadow-2xs space-y-1">
        <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Quantity</span>
        <p class="text-sm sm:text-base font-black text-slate-900 leading-tight">
          {{ borrowing.assigned_quantity || borrowing.quantity_needed || 1 }}
          <span class="text-xs font-semibold text-slate-500">
            {{ Number(borrowing.assigned_quantity || borrowing.quantity_needed || 1) === 1 ? 'unit' : 'units' }}
          </span>
          <span v-if="borrowing.assigned_quantity && borrowing.quantity_needed && borrowing.assigned_quantity !== borrowing.quantity_needed" class="text-xs font-bold text-amber-700 block mt-0.5">
            (Assigned: {{ borrowing.assigned_quantity }} / Needed: {{ borrowing.quantity_needed }})
          </span>
        </p>
      </div>
    </div>

    <!-- Row 2: Schedule (2 columns) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div class="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/70 shadow-2xs space-y-1">
        <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Pickup Date</span>
        <p class="text-sm sm:text-base font-black text-slate-900 leading-tight">
          {{ formatDate(borrowing.date_needed) }}
        </p>
      </div>
      <div class="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/70 shadow-2xs space-y-1">
        <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Expected Return Date</span>
        <p class="text-sm sm:text-base font-black text-slate-900 leading-tight">
          {{ formatDate(borrowing.expected_return_date) }}
        </p>
      </div>
    </div>

    <!-- Row 3: Purpose in Detail (Full width) -->
    <div class="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/70 shadow-2xs space-y-1">
      <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">State the Purpose in Detail</span>
      <p class="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">
        {{ borrowing.purpose_project || ticket.description || 'No detailed purpose provided.' }}
      </p>
    </div>

    <!-- Row 4: Return Inspection (if recorded) -->
    <div v-if="borrowing.returned_at || borrowing.return_condition" class="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/70 shadow-2xs space-y-2">
      <div class="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
        <span class="flex items-center gap-1.5 text-emerald-700 font-bold">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Return Inspection
        </span>
        <span v-if="borrowing.returned_at" class="text-slate-500 font-semibold">{{ formatDate(borrowing.returned_at) }}</span>
      </div>
      <div v-if="borrowing.return_condition" class="flex items-center gap-2">
        <span class="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
          Condition: {{ borrowing.return_condition }}
        </span>
      </div>
      <p v-if="borrowing.return_notes" class="text-xs text-slate-600 italic">
        "{{ borrowing.return_notes }}"
      </p>
    </div>
  </div>
</template>
