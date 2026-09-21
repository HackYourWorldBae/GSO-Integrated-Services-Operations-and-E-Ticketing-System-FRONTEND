<template>
  <div class="space-y-4 animate-fade-in relative pb-4">
    <!-- Tabs -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-1.5">
      <div class="flex items-center gap-1.5 flex-wrap">
        <template v-if="showTabs">
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
        </template>
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
    <div v-if="showOverdueNotice" class="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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

    <!-- ═══ Desktop Tabular View (matching other ticket lists) ═══ -->
    <div v-else-if="isTableLayout" class="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th class="px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Ticket Ref</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Borrower</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Item Requested</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Schedule</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Status</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs">
            <tr
              v-for="req in visibleRequests"
              :key="req.ticket_id || req.id"
              class="hover:bg-amber-50/50 transition-all duration-150 group relative"
            >
              <td class="px-4 py-2.5 whitespace-nowrap relative">
                <span class="absolute left-0 top-2 bottom-2 w-1 rounded-r-sm bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150"></span>
                <span class="font-mono text-sm font-bold px-3 py-1 rounded-lg border bg-amber-50 text-amber-800 border-amber-200 inline-flex items-center group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-600 transition-all duration-150 shadow-2xs">
                  #{{ req.ticket_id }}
                </span>
              </td>
              <td class="px-3 py-2.5">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {{ getInitials(req.borrower_name) }}
                  </div>
                  <div class="min-w-0">
                    <span class="text-xs font-semibold text-slate-800 truncate block max-w-[150px]">{{ req.borrower_name }}</span>
                    <span class="text-[10px] text-slate-400 block truncate max-w-[150px]">{{ req.borrower_type }}{{ req.borrower_id_number ? ` • ${req.borrower_id_number}` : '' }}</span>
                  </div>
                </div>
              </td>
              <td class="px-3 py-2.5">
                <div class="text-xs font-black text-slate-900 truncate max-w-[220px]">
                  {{ req.item_name_requested }}
                  <span v-if="req.item_model_requested" class="font-semibold text-slate-500">({{ req.item_model_requested }})</span>
                </div>
                <div class="text-[10px] text-slate-500">Qty: {{ req.assigned_quantity || req.quantity_needed }}{{ req.purpose_project ? ` • ${req.purpose_project}` : '' }}</div>
              </td>
              <td class="px-3 py-2.5 whitespace-nowrap">
                <div class="text-xs font-bold text-slate-800">{{ formatDate(req.date_needed) }}</div>
                <div class="text-[10px] font-bold" :class="isOverdue(req) ? 'text-rose-600' : 'text-slate-500'">→ {{ formatDate(req.expected_return_date) }}</div>
              </td>
              <td class="px-3 py-2.5 whitespace-nowrap">
                <span :class="['px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border', statusPillClass(req.status)]">
                  {{ formatStatus(req.status) }}
                </span>
              </td>
              <td class="px-3 py-2.5 whitespace-nowrap text-right" @click.stop>
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    v-if="req.status === 'ready_for_pickup'"
                    type="button"
                    @click="doPickup(req)"
                    :disabled="actionLoading"
                    class="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black transition-all cursor-pointer disabled:opacity-50"
                    title="Record early or on-time pickup"
                  >
                    Picked Up
                  </button>
                  <button
                    v-if="req.status === 'picked_up' || req.status === 'overdue'"
                    type="button"
                    @click="openReturnModal(req)"
                    :disabled="actionLoading"
                    class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all cursor-pointer disabled:opacity-50"
                    title="Record item return (auto-archives, no rating)"
                  >
                    Mark Returned
                  </button>
                  <router-link
                    :to="`/admin/leau/assign-workers?ticket=${req.ticket_id}`"
                    class="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold inline-flex items-center cursor-pointer"
                  >
                    Details
                  </router-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else :class="[isTableLayout ? 'md:hidden space-y-4' : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4']">
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
            :to="`/admin/leau/assign-workers?ticket=${req.ticket_id}`"
            class="px-4 py-2 min-h-[40px] rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold inline-flex items-center cursor-pointer"
          >
            Details
          </router-link>
        </div>
      </div>
    </div>

    <!-- Return modal -->
    <Teleport to="body">
      <div v-if="returnTarget" class="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto pointer-events-auto" @click.self="returnTarget = null">
        <div class="bg-white rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl border border-slate-100 my-auto">
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
  initialTab: { type: String, default: 'awaiting' },
  // When embedded inside another ticket-list layout (e.g. LEAU Scheduled / Active Tickets),
  // the host provides the tab switcher — hide this component's own tab row.
  showTabs: { type: Boolean, default: true },
  // Optional locked status set for embedded mode (e.g. ['ready_for_pickup'] on the
  // Scheduled page, ['picked_up', 'overdue'] on the Active page). When provided with
  // showTabs=false, the list shows these statuses combined instead of a single tab.
  statusFilter: { type: Array, default: null },
  // List layout: 'cards' (default grid) or 'table' (tabular, matching the other
  // ticket-list workspaces on desktop; mobile stays as cards).
  layout: { type: String, default: 'cards' }
});

const isTableLayout = computed(() => String(props.layout || 'cards').toLowerCase() === 'table');

const getInitials = (name) => {
  if (!name) return 'U';
  const parts = String(name).trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return String(name).substring(0, 2).toUpperCase();
};

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

const lockedStatuses = computed(() => {
  if (props.showTabs) return null;
  if (!Array.isArray(props.statusFilter) || props.statusFilter.length === 0) return null;
  return props.statusFilter.map(s => String(s));
});

// Overdue helper notice: shown on the overdue tab, or in embedded mode whenever the
// locked set covers borrowed/overdue items.
const showOverdueNotice = computed(() => {
  if (props.showTabs) return activeTab.value === 'overdue';
  const locked = lockedStatuses.value;
  return !!locked && locked.some(s => ['picked_up', 'overdue'].includes(s));
});

const baseList = computed(() => {
  const locked = lockedStatuses.value;
  if (locked) {
    const merged = [...requests.value];
    overdue.value.forEach(o => { if (!merged.some(m => String(m.ticket_id) === String(o.ticket_id))) merged.push(o); });
    const filtered = merged.filter(r => locked.includes(String(r.status)));
    // Surface overdue items first so past-due returns are actioned promptly.
    return [...filtered].sort((a, b) => (String(b.status) === 'overdue') - (String(a.status) === 'overdue'));
  }
  return activeTab.value === 'awaiting' ? awaitingList.value : activeTab.value === 'borrowed' ? borrowedList.value : overdueList.value;
});

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
const statusPillClass = (s) => s === 'overdue'
  ? 'bg-rose-50 text-rose-700 border-rose-200'
  : s === 'picked_up'
    ? 'bg-blue-50 text-blue-700 border-blue-200'
    : 'bg-emerald-50 text-emerald-700 border-emerald-200';
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
