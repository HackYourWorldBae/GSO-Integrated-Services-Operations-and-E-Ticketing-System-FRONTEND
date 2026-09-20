<template>
  <div class="space-y-4 animate-fade-in relative pb-4">
    <!-- Tabs -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-1.5">
      <div class="flex items-center gap-1.5 flex-wrap">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          @click="activeTab = tab.key; currentPage = 1"
          :class="[
            'flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-95',
            activeTab === tab.key ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
          ]"
        >
          <span>{{ tab.label }}</span>
          <span :class="['ml-1 px-2 py-0.5 rounded-full text-[10px] font-black leading-none', activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700']">
            {{ tabCounts[tab.key] ?? 0 }}
          </span>
        </button>
        <div class="flex-1"></div>
        <button
          type="button"
          @click="refreshAll"
          :disabled="loading"
          class="px-3 py-2.5 min-h-[44px] rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          title="Refresh borrowing queues"
        >
          {{ loading ? 'Refreshing...' : 'Refresh' }}
        </button>
      </div>
      <div class="px-2 pt-2">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search ticket #, borrower, item..."
            class="w-full pl-9 pr-4 py-2.5 min-h-[44px] rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-base sm:text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all"
          />
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Overdue auto-mark notice -->
    <div v-if="activeTab === 'overdue'" class="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <p class="text-xs text-rose-700 font-semibold">Items past their expected return date are flagged overdue. Use “Mark Overdue Now” to refresh flags before review.</p>
      <button
        type="button"
        @click="markOverdueNow"
        :disabled="loading"
        class="px-4 py-2 min-h-[40px] rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black cursor-pointer disabled:opacity-50 shrink-0"
      >
        Mark Overdue Now
      </button>
    </div>

    <!-- List -->
    <div v-if="loading && visibleRequests.length === 0" class="text-center py-10 bg-white rounded-2xl border border-slate-200">
      <p class="text-xs font-bold text-slate-400">Loading borrowing requests...</p>
    </div>
    <div v-else-if="visibleRequests.length === 0" class="text-center py-10 bg-white rounded-2xl border border-slate-200">
      <p class="text-sm font-bold text-slate-600">No borrowing requests in this tab</p>
      <p class="text-xs text-slate-400 mt-1">Requests move here automatically as their status changes.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="req in visibleRequests"
        :key="req.ticket_id || req.id"
        class="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3 hover:border-amber-300 transition-all"
      >
        <div class="flex items-center justify-between gap-2">
          <span class="font-mono text-sm font-bold px-2.5 py-0.5 rounded-lg border bg-amber-50 text-amber-800 border-amber-200">#{{ req.ticket_id }}</span>
          <span
            :class="[
              'px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border',
              req.status === 'overdue' ? 'bg-rose-50 text-rose-700 border-rose-200' :
              req.status === 'picked_up' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              'bg-emerald-50 text-emerald-700 border-emerald-200'
            ]"
          >
            {{ formatStatus(req.status) }}
          </span>
        </div>
        <div class="min-w-0">
          <p class="text-sm font-black text-slate-900 truncate">{{ req.item_name_requested }} <span v-if="req.item_model_requested" class="font-semibold text-slate-500">({{ req.item_model_requested }})</span></p>
          <p class="text-xs text-slate-600 font-semibold truncate">{{ req.borrower_name }} • {{ req.borrower_type }} • {{ req.borrower_id_number }}</p>
          <p class="text-[11px] text-slate-400 mt-0.5">Pickup: <strong class="text-slate-600">{{ formatDate(req.date_needed) }}</strong> • Return: <strong :class="isOverdue(req) ? 'text-rose-600' : 'text-slate-600'">{{ formatDate(req.expected_return_date) }}</strong> • Qty: {{ req.assigned_quantity || req.quantity_needed }}</p>
          <p v-if="req.purpose_project" class="text-[11px] text-slate-500 mt-1 line-clamp-2">{{ req.purpose_project }}</p>
        </div>
        <div class="pt-2 border-t border-slate-100 flex items-center justify-end gap-2" @click.stop>
          <button
            v-if="req.status === 'ready_for_pickup'"
            type="button"
            @click="doPickup(req)"
            :disabled="actionLoading"
            class="px-4 py-2 min-h-[40px] rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black cursor-pointer disabled:opacity-50"
            title="Record early or on-time pickup"
          >
            Picked Up
          </button>
          <button
            v-if="req.status === 'picked_up' || req.status === 'overdue'"
            type="button"
            @click="openReturnModal(req)"
            :disabled="actionLoading"
            class="px-4 py-2 min-h-[40px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer disabled:opacity-50"
            title="Record item return (auto-archives, no rating)"
          >
            Mark Returned
          </button>
          <router-link
            :to="`/admin/leau/borrowing-dispatch?ticket=${req.ticket_id}`"
            class="px-4 py-2 min-h-[40px] rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold inline-flex items-center cursor-pointer"
          >
            Details
          </router-link>
        </div>
      </div>
    </div>

    <!-- Return modal -->
    <Teleport to="body">
      <div v-if="returnTarget" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs" @click.self="returnTarget = null">
        <div class="bg-white rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl border border-slate-100">
          <h3 class="text-lg font-black text-slate-900">Mark Returned — #{{ returnTarget.ticket_id }}</h3>
          <p class="text-xs text-slate-500 mt-1">Returning auto-archives the ticket as completed. No rating form is shown to the end user.</p>
          <div class="space-y-3 mt-4">
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Return Condition *</label>
              <select v-model="returnForm.condition" class="w-full px-4 py-3 min-h-[44px] rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer bg-white">
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="damaged">Damaged</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Return Notes</label>
              <textarea v-model="returnForm.notes" rows="2" placeholder="Condition notes, damages, missing parts..." class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 mt-5">
            <button type="button" @click="returnTarget = null" class="px-5 py-3 min-h-[44px] rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 cursor-pointer">Cancel</button>
            <button type="button" @click="doReturn" :disabled="actionLoading" class="px-5 py-3 min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer disabled:opacity-50">
              {{ actionLoading ? 'Saving...' : 'Confirm Return' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  getBorrowingQueue,
  getOverdueBorrowings,
  markOverdueBorrowings,
  recordBorrowingPickup,
  recordBorrowingReturn,
} from '@/api/borrowing';
import { borrowingStatusLabel, isOverdueBorrowing } from '@/utils/borrowing';
import { toast } from 'vue3-toastify';

const props = defineProps({
  initialTab: { type: String, default: 'awaiting' }
});

const tabs = [
  { key: 'awaiting', label: 'Borrowing Requests (Awaiting Pickup Date)' },
  { key: 'borrowed', label: 'Borrowed Items' },
  { key: 'overdue', label: 'Overdue' }
];

const activeTab = ref(['awaiting', 'borrowed', 'overdue'].includes(props.initialTab) ? props.initialTab : 'awaiting');
const requests = ref([]);
const overdue = ref([]);
const loading = ref(false);
const actionLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const returnTarget = ref(null);
const returnForm = ref({ condition: 'good', notes: '' });

const awaitingList = computed(() => requests.value.filter(r => r.status === 'ready_for_pickup'));
const borrowedList = computed(() => requests.value.filter(r => r.status === 'picked_up'));
const overdueList = computed(() => {
  const fromQueue = requests.value.filter(r => r.status === 'overdue');
  const merged = [...fromQueue];
  overdue.value.forEach(o => { if (!merged.some(m => String(m.ticket_id) === String(o.ticket_id))) merged.push(o); });
  return merged;
});

const tabCounts = computed(() => ({ awaiting: awaitingList.value.length, borrowed: borrowedList.value.length, overdue: overdueList.value.length }));

const baseList = computed(() => activeTab.value === 'awaiting' ? awaitingList.value : activeTab.value === 'borrowed' ? borrowedList.value : overdueList.value);

const visibleRequests = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return baseList.value;
  return baseList.value.filter(r =>
    String(r.ticket_id || '').toLowerCase().includes(q) ||
    String(r.borrower_name || '').toLowerCase().includes(q) ||
    String(r.item_name_requested || '').toLowerCase().includes(q) ||
    String(r.borrower_id_number || '').toLowerCase().includes(q)
  );
});

const formatStatus = (s) => borrowingStatusLabel(s);
const formatDate = (v) => {
  if (!v) return '—';
  const d = new Date(v);
  return isNaN(d.getTime()) ? String(v) : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
const isOverdue = (r) => isOverdueBorrowing(r);

const fetchQueue = async () => {
  const res = await getBorrowingQueue({ per_page: 500 });
  requests.value = res.data?.data?.borrowing_requests || [];
};

const fetchOverdue = async () => {
  try {
    const res = await getOverdueBorrowings();
    overdue.value = res.data?.data?.overdue_requests || [];
  } catch { overdue.value = []; }
};

const refreshAll = async () => {
  loading.value = true;
  try { await Promise.all([fetchQueue(), fetchOverdue()]); }
  catch (e) { console.error(e); toast.error('Failed to load borrowing queues.'); }
  finally { loading.value = false; }
};

const markOverdueNow = async () => {
  loading.value = true;
  try {
    const res = await markOverdueBorrowings();
    toast.success(`Overdue flags refreshed (${res.data?.data?.updated_count ?? 0} updated).`);
    await refreshAll();
  } catch (e) { toast.error(e.response?.data?.message || 'Failed to mark overdue.'); }
  finally { loading.value = false; }
};

const doPickup = async (req) => {
  actionLoading.value = true;
  try {
    await recordBorrowingPickup(req.ticket_id, {});
    toast.success(`#${req.ticket_id} picked up — moved to Borrowed Items.`);
    await refreshAll();
  } catch (e) { toast.error(e.response?.data?.message || 'Failed to record pickup.'); }
  finally { actionLoading.value = false; }
};

const openReturnModal = (req) => {
  returnTarget.value = req;
  returnForm.value = { condition: 'good', notes: '' };
};

const doReturn = async () => {
  if (!returnTarget.value) return;
  actionLoading.value = true;
  try {
    await recordBorrowingReturn(returnTarget.value.ticket_id, {
      return_condition: returnForm.value.condition,
      return_notes: returnForm.value.notes
    });
    toast.success(`#${returnTarget.value.ticket_id} returned and archived (no rating required).`);
    returnTarget.value = null;
    await refreshAll();
  } catch (e) { toast.error(e.response?.data?.message || 'Failed to record return.'); }
  finally { actionLoading.value = false; }
};

onMounted(refreshAll);
</script>

<style scoped>
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
