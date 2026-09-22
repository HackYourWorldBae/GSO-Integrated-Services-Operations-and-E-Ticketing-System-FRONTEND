<script setup>
import { computed } from 'vue';
import { borrowingStatusLabel, isBorrowingService } from '@/utils/borrowing';

// Renders the borrowing request particulars (item, purpose, schedule,
// borrower) inside ticket full-info modals. The `borrowing` row is attached
// by the backend ticket enrichment (borrowing_requests via ticket_id).
const props = defineProps({
  ticket: {
    type: Object,
    required: true,
  },
});

const resolvedBorrowing = computed(() => {
  const t = props.ticket;
  if (!t) return null;

  // 1. Direct borrowing object
  if (t.borrowing && typeof t.borrowing === 'object' && Object.keys(t.borrowing).length > 0) {
    return {
      ...t.borrowing,
      item_name_requested: t.borrowing.item_name_requested || t.item_name_requested || t.title || 'Unspecified item',
      item_model_requested: t.borrowing.item_model_requested || t.item_model_requested || null,
      quantity_needed: t.borrowing.quantity_needed ?? t.quantity_needed ?? t.quantity ?? 1,
      assigned_quantity: t.borrowing.assigned_quantity ?? t.assigned_quantity ?? null,
      purpose_project: t.borrowing.purpose_project || t.purpose_project || t.description || t.title || 'No purpose stated.',
      date_needed: t.borrowing.date_needed || t.date_needed || t.submitted_at || null,
      expected_return_date: t.borrowing.expected_return_date || t.expected_return_date || null,
      borrower_name: t.borrowing.borrower_name || t.requestedBy || t.requester || 'End User',
      borrower_type: t.borrower_type || t.borrowing.borrower_type || t.requester_role || '',
      borrower_id_number: t.borrower_id_number || t.borrowing.borrower_id_number || t.student_id_number || '',
      borrower_contact: t.borrower_contact || t.borrowing.borrower_contact || t.contact || t.contact_number || '',
      status: t.borrowing.status || t.borrowing_status || t.status || 'pending',
    };
  }

  // 2. Unit details object (if borrowing record was stored under details)
  if (t.details && typeof t.details === 'object' && (t.details.item_name_requested || t.details.purpose_project || t.details.date_needed || t.details.expected_return_date || isBorrowingService(t))) {
    return {
      ...t.details,
      item_name_requested: t.details.item_name_requested || t.item_name_requested || t.title || 'Unspecified item',
      item_model_requested: t.details.item_model_requested || t.item_model_requested || null,
      quantity_needed: t.details.quantity_needed ?? t.quantity_needed ?? t.quantity ?? 1,
      assigned_quantity: t.details.assigned_quantity ?? t.assigned_quantity ?? null,
      purpose_project: t.details.purpose_project || t.purpose_project || t.description || t.title || 'No purpose stated.',
      date_needed: t.details.date_needed || t.date_needed || t.submitted_at || null,
      expected_return_date: t.details.expected_return_date || t.expected_return_date || null,
      borrower_name: t.details.borrower_name || t.requestedBy || t.requester || 'End User',
      borrower_type: t.details.borrower_type || t.requester_role || '',
      borrower_id_number: t.details.borrower_id_number || t.student_id_number || '',
      borrower_contact: t.details.borrower_contact || t.contact || t.contact_number || '',
      status: t.details.status || t.borrowing_status || t.status || 'pending',
    };
  }

  // 3. Fallback from flattened ticket properties or borrowing service
  if (isBorrowingService(t) || t.item_name_requested || t.quantity_needed || t.expected_return_date || t.date_needed) {
    return {
      item_name_requested: t.item_name_requested || t.title || 'Unspecified item',
      item_model_requested: t.item_model_requested || null,
      quantity_needed: t.quantity_needed ?? t.quantity ?? 1,
      assigned_quantity: t.assigned_quantity ?? null,
      purpose_project: t.purpose_project || t.description || t.title || 'No purpose stated.',
      date_needed: t.date_needed || t.submitted_at || null,
      expected_return_date: t.expected_return_date || null,
      borrower_name: t.borrower_name || t.requestedBy || t.requester || 'End User',
      borrower_type: t.borrower_type || t.requester_role || '',
      borrower_id_number: t.borrower_id_number || t.student_id_number || '',
      borrower_contact: t.borrower_contact || t.contact || t.contact_number || '',
      status: t.borrowing_status || t.status || 'pending',
      returned_at: t.returned_at || null,
      return_condition: t.return_condition || null,
      return_notes: t.return_notes || null,
    };
  }

  return null;
});

const borrowing = computed(() => resolvedBorrowing.value);

const statusBadgeClass = computed(() => {
  const s = String(borrowing.value?.status || '');
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
  <div v-if="borrowing" class="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div class="flex items-center gap-2">
        <span class="text-[10px] font-black uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Borrowing Request Particulars
        </span>
        <span v-if="ticket.service || ticket.service_type" class="px-2 py-0.5 rounded-md bg-amber-200/70 text-amber-900 text-[10px] font-black uppercase tracking-wider">
          {{ ticket.service || ticket.service_type }}
        </span>
      </div>
      <span
        v-if="borrowing.status"
        :class="['px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border', statusBadgeClass]"
      >
        {{ borrowingStatusLabel(borrowing.status) }}
      </span>
    </div>

    <!-- Item + Borrower -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div class="p-3.5 rounded-xl bg-white border border-amber-200/60 space-y-1">
        <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Item Requested</span>
        <p class="text-sm font-black text-slate-900 leading-tight">
          {{ borrowing.item_name_requested || ticket.title || 'Unspecified item' }}
          <span v-if="borrowing.item_model_requested" class="font-semibold text-slate-500">({{ borrowing.item_model_requested }})</span>
        </p>
        <p class="text-[11px] text-slate-500 font-semibold">
          Qty: {{ borrowing.assigned_quantity || borrowing.quantity_needed || ticket.quantity || 1 }}
        </p>
      </div>
      <div class="p-3.5 rounded-xl bg-white border border-amber-200/60 space-y-1">
        <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Borrower</span>
        <p class="text-sm font-black text-slate-900 leading-tight">{{ borrowing.borrower_name || ticket.requestedBy || ticket.requester || 'End User' }}</p>
        <p class="text-[11px] text-slate-500 font-semibold">
          {{ borrowing.borrower_type || ticket.requester_role || '' }}{{ (borrowing.borrower_id_number || ticket.student_id_number) ? ` • ${borrowing.borrower_id_number || ticket.student_id_number}` : '' }}
        </p>
        <a
          v-if="borrowing.borrower_contact || ticket.contact || ticket.contact_number"
          :href="`tel:${borrowing.borrower_contact || ticket.contact || ticket.contact_number}`"
          class="inline-block text-[11px] font-black font-mono text-emerald-800 hover:underline mt-0.5"
        >
          {{ borrowing.borrower_contact || ticket.contact || ticket.contact_number }}
        </a>
      </div>
    </div>

    <!-- Purpose in Detail -->
    <div class="p-3.5 rounded-xl bg-white border border-amber-200/60 space-y-1.5">
      <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">State the Purpose in Detail</span>
      <p class="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed whitespace-pre-wrap">
        {{ borrowing.purpose_project || ticket.description || ticket.title || 'No purpose stated.' }}
      </p>
    </div>

    <!-- Schedule -->
    <div class="grid grid-cols-2 gap-3">
      <div class="p-3 rounded-xl bg-white border border-amber-200/60">
        <span class="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Pickup Date</span>
        <span class="text-xs sm:text-sm font-black text-slate-900">{{ formatDate(borrowing.date_needed || ticket.date_needed) }}</span>
      </div>
      <div class="p-3 rounded-xl bg-white border border-amber-200/60">
        <span class="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Expected Return</span>
        <span class="text-xs sm:text-sm font-black text-slate-900">{{ formatDate(borrowing.expected_return_date || ticket.expected_return_date) }}</span>
      </div>
    </div>

    <!-- Return Inspection (if recorded) -->
    <div v-if="borrowing.returned_at || borrowing.return_condition" class="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
      <div class="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
        <span>Return Inspection</span>
        <span v-if="borrowing.returned_at" class="text-slate-500">{{ formatDate(borrowing.returned_at) }}</span>
      </div>
      <p v-if="borrowing.return_condition" class="text-xs font-bold text-slate-800">
        Condition: <span class="capitalize">{{ borrowing.return_condition }}</span>
      </p>
      <p v-if="borrowing.return_notes" class="text-xs text-slate-600 italic">
        "{{ borrowing.return_notes }}"
      </p>
    </div>
  </div>
</template>
