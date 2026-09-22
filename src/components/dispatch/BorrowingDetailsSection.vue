<script setup>
import { computed } from 'vue';
import { borrowingStatusLabel } from '@/utils/borrowing';

// Renders the borrowing request particulars (item, purpose, schedule,
// borrower) inside ticket full-info modals. The `borrowing` row is attached
// by the backend ticket enrichment (borrowing_requests via ticket_id).
const props = defineProps({
  ticket: {
    type: Object,
    required: true,
  },
});

const borrowing = computed(() => props.ticket?.borrowing || null);

const statusBadgeClass = computed(() => {
  const s = String(borrowing.value?.status || '');
  if (s === 'overdue') return 'bg-rose-100 text-rose-800 border-rose-200';
  if (s === 'picked_up') return 'bg-blue-100 text-blue-800 border-blue-200';
  if (s === 'ready_for_pickup') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (s === 'returned') return 'bg-slate-200 text-slate-700 border-slate-300';
  return 'bg-amber-100 text-amber-800 border-amber-200';
});

const formatDate = (val) => {
  if (!val) return '—';
  const d = new Date(String(val).slice(0, 10) + 'T00:00:00');
  return isNaN(d.getTime()) ? String(val) : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
</script>

<template>
  <div v-if="borrowing" class="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
    <div class="flex items-center justify-between gap-3">
      <span class="text-[10px] font-black uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        Borrowing Request Particulars
      </span>
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
          {{ borrowing.item_name_requested || 'Unspecified item' }}
          <span v-if="borrowing.item_model_requested" class="font-semibold text-slate-500">({{ borrowing.item_model_requested }})</span>
        </p>
        <p class="text-[11px] text-slate-500 font-semibold">
          Qty: {{ borrowing.assigned_quantity || borrowing.quantity_needed || 1 }}
        </p>
      </div>
      <div class="p-3.5 rounded-xl bg-white border border-amber-200/60 space-y-1">
        <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Borrower</span>
        <p class="text-sm font-black text-slate-900 leading-tight">{{ borrowing.borrower_name || ticket.requester || 'End User' }}</p>
        <p class="text-[11px] text-slate-500 font-semibold">
          {{ borrowing.borrower_type || '' }}{{ borrowing.borrower_id_number ? ` • ${borrowing.borrower_id_number}` : '' }}
        </p>
        <a
          v-if="borrowing.borrower_contact"
          :href="`tel:${borrowing.borrower_contact}`"
          class="inline-block text-[11px] font-black font-mono text-emerald-800 hover:underline mt-0.5"
        >
          {{ borrowing.borrower_contact }}
        </a>
      </div>
    </div>

    <!-- Purpose in Detail -->
    <div class="p-3.5 rounded-xl bg-white border border-amber-200/60 space-y-1.5">
      <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">State the Purpose in Detail</span>
      <p class="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed whitespace-pre-wrap">
        {{ borrowing.purpose_project || 'No purpose stated.' }}
      </p>
    </div>

    <!-- Schedule -->
    <div class="grid grid-cols-2 gap-3">
      <div class="p-3 rounded-xl bg-white border border-amber-200/60">
        <span class="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Pickup Date</span>
        <span class="text-xs sm:text-sm font-black text-slate-900">{{ formatDate(borrowing.date_needed) }}</span>
      </div>
      <div class="p-3 rounded-xl bg-white border border-amber-200/60">
        <span class="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Expected Return</span>
        <span class="text-xs sm:text-sm font-black text-slate-900">{{ formatDate(borrowing.expected_return_date) }}</span>
      </div>
    </div>
  </div>
</template>
