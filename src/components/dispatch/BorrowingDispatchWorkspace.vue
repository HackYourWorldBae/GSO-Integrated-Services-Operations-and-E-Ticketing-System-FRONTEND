<template>
  <div class="space-y-6 pb-12 px-4 sm:px-6 lg:px-8 py-6 max-w-[1750px] mx-auto min-h-screen">

    <!-- ═══ Selected Borrowing Target Banner ═══ -->
    <div
      v-if="selectedTicket"
      class="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white shadow-xl relative overflow-hidden border border-amber-500/30 animate-scale-up space-y-6"
    >
      <div class="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div class="flex items-center gap-3 mb-2 flex-wrap">
            <span class="px-3 py-1 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-xs">
              Borrowing Dispatch Target
            </span>
            <span class="text-sm font-black text-amber-400 bg-white/10 px-3 py-1 rounded-full border border-white/10">
              #{{ selectedTicket.id }}
            </span>
            <span
              v-if="borrowing?.status"
              class="px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-white/10"
            >
              {{ formatBorrowingStatus(borrowing.status) }}
            </span>
            <span v-if="borrowing?.borrower_name" class="text-xs text-slate-300 font-medium">
              Borrower <strong class="text-white">{{ borrowing.borrower_name }}</strong>
            </span>
          </div>
          <h3 class="text-2xl font-black text-white tracking-tight">
            {{ selectedTicket.service_type || selectedTicket.title || 'Borrowing Request' }}
          </h3>
          <p class="text-slate-300 font-medium text-xs sm:text-sm mt-1">
            Requested item: <strong class="text-amber-300">{{ borrowing?.item_name_requested || '—' }}</strong>
            <span v-if="borrowing?.item_model_requested">({{ borrowing.item_model_requested }})</span>
            <span v-if="borrowing?.quantity_needed"> × {{ borrowing.quantity_needed }}</span>
          </p>
        </div>

        <div class="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            @click="clearSelectedTicket"
            class="p-2.5 min-h-[44px] min-w-[44px] bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-white rounded-xl transition-colors border border-rose-500/30 cursor-pointer touch-manipulation flex items-center justify-center"
            title="Deselect ticket"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      <!-- Schedule from form (read-only, no setup needed) -->
      <div class="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div class="bg-white/5 p-4 rounded-2xl border border-white/10">
          <span class="text-[10px] font-black text-slate-300 uppercase tracking-widest block">Pickup Date (from form)</span>
          <p class="text-base sm:text-lg font-black text-white mt-1">{{ formatDate(borrowing?.date_needed) }}</p>
        </div>
        <div class="bg-white/5 p-4 rounded-2xl border border-white/10">
          <span class="text-[10px] font-black text-slate-300 uppercase tracking-widest block">Expected Return (from form)</span>
          <p class="text-base sm:text-lg font-black text-white mt-1">{{ formatDate(borrowing?.expected_return_date) }}</p>
        </div>
        <div class="bg-white/5 p-4 rounded-2xl border border-white/10">
          <span class="text-[10px] font-black text-slate-300 uppercase tracking-widest block">Purpose / Project</span>
          <p class="text-xs sm:text-sm font-semibold text-slate-200 mt-1 line-clamp-3">{{ borrowing?.purpose_project || '—' }}</p>
        </div>
      </div>

      <!-- Borrower + assigned inventory summary -->
      <div class="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/10">
        <div class="bg-white/5 rounded-2xl border border-white/10 p-4 space-y-1.5 text-xs">
          <span class="text-[10px] font-black text-slate-300 uppercase tracking-widest block">Borrower Information</span>
          <p class="text-slate-200"><strong class="text-white">{{ borrowing?.borrower_name }}</strong> • {{ borrowing?.borrower_type }} • {{ borrowing?.borrower_id_number }}</p>
          <p class="text-slate-300">{{ borrowing?.department_major }} • {{ borrowing?.borrower_email }} • {{ borrowing?.borrower_contact }}</p>
        </div>
        <div class="bg-white/5 rounded-2xl border border-white/10 p-4 space-y-1.5 text-xs">
          <span class="text-[10px] font-black text-slate-300 uppercase tracking-widest block">Assigned Inventory</span>
          <p v-if="borrowing?.assigned_inventory_id" class="text-slate-200">
            <strong class="text-amber-300">{{ assignedInventoryName }}</strong>
            <span v-if="borrowing?.assigned_quantity"> × {{ borrowing.assigned_quantity }}</span>
          </p>
          <p v-else class="text-slate-400">No inventory assigned yet — select an item below.</p>
          <div v-if="borrowing?.status === 'inventory_assigned'" class="pt-2">
            <button
              type="button"
              @click="markReadyForPickup"
              :disabled="actionLoading"
              class="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <span>{{ actionLoading ? 'Updating...' : 'Set Ready for Pickup' }}</span>
            </button>
          </div>
          <div v-else-if="borrowing?.status === 'ready_for_pickup'" class="pt-1">
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black">
              Ready for pickup — see Scheduled Tickets › Borrowing Requests
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="p-8 sm:p-12 rounded-3xl border-2 border-dashed border-slate-200 bg-white text-center flex flex-col items-center justify-center space-y-4 shadow-xs"
    >
      <h3 class="text-xl font-black text-slate-900 tracking-tight">No Borrowing Target Selected</h3>
      <p class="text-xs sm:text-sm text-slate-500 mt-1 max-w-md">
        Pick a director-approved borrowing request from the queue to assign inventory. Pickup and return dates come from the request form.
      </p>
      <router-link
        to="/admin/leau/approved-tickets"
        class="px-5 py-3 min-h-[44px] rounded-xl text-white text-xs font-black transition-all shadow-xs active:scale-95 cursor-pointer inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700"
      >
        <span>Select from Approved Tickets ({{ dispatchQueue.length }})</span>
      </router-link>
    </div>

    <!-- ═══ Available Inventory (replaces Available Personnel) ═══ -->
    <div v-if="selectedTicket" class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 class="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2.5">
            <span class="w-2.5 h-6 bg-amber-500 rounded-full"></span>
            Available Inventory
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">
            Match the requested item below. Only in-stock items can be assigned.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="refreshData"
            :disabled="loadingInventory"
            class="px-3 py-2 min-h-[38px] rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
          >
            <span>Refresh Inventory</span>
          </button>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative max-w-md flex-1">
          <input
            v-model="inventorySearch"
            type="text"
            placeholder="Search inventory by name, model, or serial..."
            class="w-full pl-9 pr-4 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-base sm:text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/40 bg-slate-50/60 transition-all placeholder:text-slate-400"
          />
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select
          v-model="inventoryCategoryFilter"
          class="px-3 py-2.5 min-h-[44px] rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-base sm:text-xs font-semibold focus:outline-none cursor-pointer shrink-0"
        >
          <option value="all">All Categories</option>
          <option value="tools">Tools</option>
          <option value="equipment">Equipment</option>
          <option value="plants">Plants</option>
          <option value="materials">Materials</option>
          <option value="others">Others</option>
        </select>
      </div>

      <div v-if="filteredInventory.length === 0" class="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <p class="text-sm font-semibold">No inventory matches the current filters.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div
          v-for="item in filteredInventory"
          :key="item.id"
          class="p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3.5 bg-white shadow-xs"
          :class="isItemAssigned(item.id) ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/10' : 'border-slate-200/90 hover:border-slate-300'"
        >
          <div class="flex items-start justify-between gap-2.5">
            <div class="min-w-0">
              <h4 class="text-xs font-black text-slate-900 truncate leading-tight">{{ item.name }}</h4>
              <span class="text-[11px] font-bold text-slate-500 truncate block mt-0.5">
                {{ item.model || item.category }} • Available: {{ item.quantity_available }}/{{ item.quantity_total }}
              </span>
            </div>
            <span
              :class="[
                'px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0 border',
                item.quantity_available > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
              ]"
            >
              {{ item.quantity_available > 0 ? 'In Stock' : 'Out of Stock' }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <input
              v-model.number="assignQty[item.id]"
              type="number"
              :min="1"
              :max="Math.min(item.quantity_available, borrowing?.quantity_needed || item.quantity_available)"
              class="w-20 px-2 py-2 rounded-xl border border-slate-200 text-xs font-bold text-center focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              title="Quantity to assign"
            />
            <button
              v-if="selectedTicket && !isItemAssigned(item.id) && item.quantity_available > 0 && canAssign"
              type="button"
              @click="assignInventory(item)"
              :disabled="actionLoading"
              class="flex-1 py-2.5 px-3 min-h-[40px] rounded-xl text-xs font-black transition-all shadow-xs active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50"
            >
              <span>{{ actionLoading ? 'Assigning...' : 'Assign to Request' }}</span>
            </button>
            <div
              v-else-if="isItemAssigned(item.id)"
              class="flex-1 py-2.5 px-3 min-h-[40px] rounded-xl bg-amber-100 text-amber-800 text-xs font-black border border-amber-300 flex items-center justify-center gap-1.5"
            >
              <span>Assigned</span>
            </div>
            <div
              v-else
              class="flex-1 py-2.5 px-3 min-h-[40px] rounded-xl bg-slate-100 text-slate-400 text-xs font-bold text-center flex items-center justify-center border border-slate-200"
            >
              {{ !canAssign ? 'Already Assigned' : 'Unavailable' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/client';
import {
  getBorrowingByTicket,
  assignInventoryToBorrowing,
  markBorrowingReadyForPickup,
} from '@/api/borrowing';
import { listInventory } from '@/api/inventory';
import {
  isBorrowingService,
  canAssignInventory,
  borrowingStatusLabel,
} from '@/utils/borrowing';
import { toast } from 'vue3-toastify';

const props = defineProps({
  unitCode: { type: String, default: 'LEAU' }
});

const route = useRoute();
const router = useRouter();

const dispatchQueue = ref([]);
const selectedTicket = ref(null);
const borrowing = ref(null);
const inventory = ref([]);
const assignQty = ref({});
const inventorySearch = ref('');
const inventoryCategoryFilter = ref('all');
const loadingInventory = ref(false);
const actionLoading = ref(false);

const isBorrowingTicket = (t) => isBorrowingService(t);

const canAssign = computed(() => borrowing.value && canAssignInventory(borrowing.value.status));

const assignedInventoryName = computed(() => {
  if (!borrowing.value?.assigned_inventory_id) return '';
  const found = inventory.value.find(i => String(i.id) === String(borrowing.value.assigned_inventory_id));
  return found ? found.name : `#${borrowing.value.assigned_inventory_id}`;
});

const filteredInventory = computed(() => {
  let list = inventory.value.filter(i => i.is_active !== 0 && i.is_active !== false);
  if (inventoryCategoryFilter.value !== 'all') {
    list = list.filter(i => String(i.category || '').toLowerCase() === inventoryCategoryFilter.value);
  }
  const q = inventorySearch.value.trim().toLowerCase();
  if (q) {
    list = list.filter(i =>
      String(i.name || '').toLowerCase().includes(q) ||
      String(i.model || '').toLowerCase().includes(q) ||
      String(i.serial_number || '').toLowerCase().includes(q)
    );
  }
  // Prioritize items matching the requested name
  const req = String(borrowing.value?.item_name_requested || '').toLowerCase();
  if (req) {
    list = [...list].sort((a, b) => {
      const am = String(a.name || '').toLowerCase().includes(req) ? 0 : 1;
      const bm = String(b.name || '').toLowerCase().includes(req) ? 0 : 1;
      return am - bm;
    });
  }
  return list;
});

const isItemAssigned = (id) => String(borrowing.value?.assigned_inventory_id || '') === String(id);

const formatDate = (val) => {
  if (!val) return '—';
  const d = new Date(val);
  if (isNaN(d.getTime())) return String(val);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatBorrowingStatus = (s) => borrowingStatusLabel(s);

const fetchDispatchQueue = async () => {
  try {
    const res = await api.get('tickets/dispatch/LEAU');
    const raw = res.data?.data?.tickets || res.data?.data || [];
    dispatchQueue.value = Array.isArray(raw) ? raw : [];
  } catch (e) {
    console.error('Failed to fetch LEAU dispatch queue:', e);
  }
};

const fetchInventory = async () => {
  loadingInventory.value = true;
  try {
    const res = await listInventory({ per_page: 500 });
    inventory.value = res.data?.data?.items || [];
    inventory.value.forEach(i => {
      if (assignQty.value[i.id] === undefined) {
        assignQty.value[i.id] = Math.min(i.quantity_available || 1, borrowing.value?.quantity_needed || 1);
      }
    });
  } catch (e) {
    console.error('Failed to fetch inventory:', e);
    toast.error('Failed to load inventory.');
  } finally {
    loadingInventory.value = false;
  }
};

const fetchBorrowing = async (ticketId) => {
  try {
    const res = await getBorrowingByTicket(ticketId);
    borrowing.value = res.data?.data?.borrowing || null;
  } catch (e) {
    console.error('Failed to fetch borrowing details:', e);
    borrowing.value = null;
  }
};

const selectTicketById = async (ticketId) => {
  if (!ticketId) {
    selectedTicket.value = null;
    borrowing.value = null;
    return;
  }
  let found = dispatchQueue.value.find(t => String(t.id) === String(ticketId));
  if (!found) {
    await fetchDispatchQueue();
    found = dispatchQueue.value.find(t => String(t.id) === String(ticketId));
  }
  if (!found) {
    toast.error(`Ticket #${ticketId} not found in the LEAU dispatch queue. It may need director approval first.`);
    return;
  }
  if (!isBorrowingTicket(found)) {
    toast.info(`Ticket #${ticketId} is a regular job request. Opening worker dispatch instead.`);
    router.push(`/admin/leau/assign-workers?ticket=${ticketId}`);
    return;
  }
  selectedTicket.value = found;
  await fetchBorrowing(ticketId);
  // Default assign qty to requested quantity
  inventory.value.forEach(i => {
    assignQty.value[i.id] = Math.min(Math.max(1, i.quantity_available || 1), borrowing.value?.quantity_needed || 1);
  });
};

const clearSelectedTicket = () => {
  selectedTicket.value = null;
  borrowing.value = null;
  router.replace({ path: '/admin/leau/assign-workers', query: {} });
};

const refreshData = async () => {
  await Promise.all([fetchDispatchQueue(), fetchInventory()]);
  if (selectedTicket.value) await fetchBorrowing(selectedTicket.value.id);
};

const assignInventory = async (item) => {
  if (!selectedTicket.value || !borrowing.value) return;
  const qty = Math.max(1, Number(assignQty.value[item.id] || 1));
  if (qty > item.quantity_available) {
    toast.error(`Only ${item.quantity_available} unit(s) available.`);
    return;
  }
  actionLoading.value = true;
  try {
    await assignInventoryToBorrowing(selectedTicket.value.id, {
      inventory_id: item.id,
      assigned_quantity: qty
    });
    toast.success(`Assigned ${qty} × ${item.name}. Now set ready for pickup.`);
    await Promise.all([fetchBorrowing(selectedTicket.value.id), fetchInventory()]);
  } catch (e) {
    console.error('Assign inventory failed:', e);
    toast.error(e.response?.data?.message || 'Failed to assign inventory.');
  } finally {
    actionLoading.value = false;
  }
};

const markReadyForPickup = async () => {
  if (!selectedTicket.value) return;
  actionLoading.value = true;
  try {
    await markBorrowingReadyForPickup(selectedTicket.value.id);
    toast.success('Marked ready for pickup. See Scheduled Tickets › Borrowing Requests.');
    await fetchBorrowing(selectedTicket.value.id);
    router.push('/admin/leau/dispatched?tab=borrowing');
  } catch (e) {
    console.error('Ready for pickup failed:', e);
    toast.error(e.response?.data?.message || 'Failed to mark ready for pickup.');
  } finally {
    actionLoading.value = false;
  }
};

watch(() => route.query.ticket, (v) => { selectTicketById(v); });

onMounted(async () => {
  await Promise.all([fetchDispatchQueue(), fetchInventory()]);
  if (route.query.ticket) await selectTicketById(route.query.ticket);
});
</script>

<style scoped>
.animate-scale-up { animation: scaleUp 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes scaleUp { from { opacity: 0; transform: scale(0.97) translateY(6px); } to { opacity: 1; transform: scale(1) translateY(0); } }
.line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
</style>
