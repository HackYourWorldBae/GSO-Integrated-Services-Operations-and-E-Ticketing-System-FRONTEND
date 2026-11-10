<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[155] flex items-center justify-center p-3 sm:p-6 pointer-events-auto overflow-y-auto"
      >
        <div
          class="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
          @click="$emit('close')"
        ></div>

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ocular-materials-title"
          class="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-5 sm:p-7 relative z-10 animate-modal-pop border border-slate-200/80 max-h-[calc(100dvh-2rem)] sm:max-h-[90vh] overflow-y-auto custom-scrollbar my-auto"
        >
          <!-- Header -->
          <div class="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/80 shadow-xs">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div class="min-w-0">
                <h3 id="ocular-materials-title" class="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Materials Needed After Ocular Inspection
                </h3>
                <p class="text-xs font-medium text-slate-500 mt-0.5">
                  List short or out-of-stock materials so the requestor can confirm once they already have them.
                </p>
              </div>
            </div>
            <button
              type="button"
              @click="$emit('close')"
              class="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all duration-150 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label="Close materials modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-5 mt-4">
            <!-- Ticket Context Strip -->
            <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 flex-wrap text-xs">
              <div class="flex items-center gap-2 min-w-0 flex-wrap">
                <span class="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-black text-xs border border-amber-200 tabular-nums shrink-0">
                  #{{ ticket?.ticketId || ticket?.id }}
                </span>
                <span class="font-bold text-slate-900 truncate">
                  {{ ticket?.service || ticket?.service_type || 'Service Request' }}
                </span>
                <span class="text-slate-300 hidden sm:inline">&bull;</span>
                <span class="text-slate-600 font-medium truncate">
                  {{ ticket?.requestedBy || ticket?.requester || 'Requestor' }}
                </span>
              </div>
              <div class="flex items-center gap-2 shrink-0 flex-wrap">
                <span class="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 font-semibold text-[11px]">
                  {{ effectiveUnit }} Inventory
                </span>
                <span
                  v-if="ticket?.required_materials_status === 'requestor_ready'"
                  class="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-200 font-bold text-[11px]"
                >
                  Requestor Confirmed Previous List
                </span>
                <span
                  v-else-if="ticket?.required_materials_status === 'awaiting_requestor'"
                  class="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-200 font-bold text-[11px]"
                >
                  Awaiting Requestor Confirmation
                </span>
              </div>
            </div>

            <!-- 1. GSO Consumables Inventory Picker -->
            <div class="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span class="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Pick from GSO Consumables Inventory
                  </span>
                  <span class="text-[11px] text-slate-500">
                    Quick-add items that are empty or low on stock for {{ effectiveUnit }}.
                  </span>
                </div>
                <div class="inline-flex p-1 rounded-xl bg-white border border-slate-200 shrink-0 self-start sm:self-auto">
                  <button
                    type="button"
                    @click="catalogFilter = 'short_empty'"
                    :class="[
                      'px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer',
                      catalogFilter === 'short_empty'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    ]"
                  >
                    Short / Empty ({{ shortOrEmptyCount }})
                  </button>
                  <button
                    type="button"
                    @click="catalogFilter = 'all'"
                    :class="[
                      'px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer',
                      catalogFilter === 'all'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    ]"
                  >
                    All Catalog ({{ unitCatalog.length }})
                  </button>
                </div>
              </div>

              <!-- Search Catalog -->
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  v-model="catalogSearch"
                  type="text"
                  placeholder="Search catalog by material name or category..."
                  class="w-full min-h-[44px] pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-400"
                />
              </div>

              <!-- Catalog Loading Skeleton -->
              <div v-if="isLoadingCatalog" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div v-for="n in 4" :key="n" class="h-14 rounded-xl bg-slate-200/70 animate-pulse"></div>
              </div>

              <!-- Empty Catalog Filter Result -->
              <div
                v-else-if="filteredCatalog.length === 0"
                class="p-4 rounded-xl bg-white border border-dashed border-slate-300 text-center space-y-2"
              >
                <p class="text-xs font-semibold text-slate-600">
                  {{
                    catalogFilter === 'short_empty' && !catalogSearch.trim()
                      ? 'No GSO catalog consumables are currently marked empty or low stock (≤5).'
                      : 'No catalog items match your current filter.'
                  }}
                </p>
                <div class="flex items-center justify-center gap-2 flex-wrap">
                  <button
                    v-if="catalogFilter === 'short_empty'"
                    type="button"
                    @click="catalogFilter = 'all'"
                    class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Browse All GSO Catalog
                  </button>
                </div>
              </div>

              <!-- Catalog Items Grid -->
              <div v-else class="max-h-48 overflow-y-auto custom-scrollbar pr-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div
                  v-for="item in filteredCatalog"
                  :key="item.id"
                  :class="[
                    'flex items-center justify-between gap-2 p-2.5 rounded-xl border bg-white transition-all duration-150',
                    isCatalogItemAdded(item.id)
                      ? 'border-amber-300 bg-amber-50/40'
                      : 'border-slate-200 hover:border-slate-300'
                  ]"
                >
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span class="text-xs font-bold text-slate-900 truncate" :title="item.name">{{ item.name }}</span>
                    </div>
                    <div class="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span class="text-[10px] font-medium text-slate-500">{{ item.category || 'General' }} &bull; {{ item.unit || 'pcs' }}</span>
                      <span :class="['px-1.5 py-0.5 rounded-md text-[10px] font-bold', getStockBadgeClass(item)]">
                        {{ getStockBadgeText(item) }}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="addCatalogItem(item)"
                    class="min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all duration-150 cursor-pointer active:scale-[0.98]"
                    :class="
                      isCatalogItemAdded(item.id)
                        ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    "
                  >
                    {{ isCatalogItemAdded(item.id) ? '+1 More' : '+ Add' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- 2. Custom / Unlisted Material Entry -->
            <div class="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-2xs">
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Add Custom / Unlisted Material
                </span>
                <span class="text-[11px] text-slate-400 font-medium">For items not in catalog</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                <div class="sm:col-span-5">
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">Material Name</label>
                  <input
                    v-model="customDraft.material_name"
                    type="text"
                    placeholder="e.g. THHN Stranded Wire #12"
                    class="w-full min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all"
                  />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">Qty Needed</label>
                  <input
                    v-model.number="customDraft.quantity"
                    type="number"
                    min="0.01"
                    step="any"
                    class="w-full min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-bold text-right focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all tabular-nums"
                  />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-[11px] font-semibold text-slate-500 mb-1">Unit</label>
                  <input
                    v-model="customDraft.unit_measurement"
                    type="text"
                    list="ocular-unit-options"
                    placeholder="pcs"
                    class="w-full min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all"
                  />
                </div>
                <div class="sm:col-span-3 flex items-end">
                  <button
                    type="button"
                    @click="addCustomDraft"
                    :disabled="!customDraft.material_name.trim() || !(Number(customDraft.quantity) > 0)"
                    class="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-all duration-150 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>+ Add Custom</span>
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                <div class="sm:col-span-4">
                  <select
                    v-model="customDraft.inventory_status"
                    class="w-full min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all"
                  >
                    <option value="empty">Out of Stock / Empty</option>
                    <option value="short">Short Stock in GSO</option>
                    <option value="not_in_catalog">Not in GSO Catalog</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
                <div class="sm:col-span-8">
                  <input
                    v-model="customDraft.remarks"
                    type="text"
                    maxlength="500"
                    placeholder="Optional specs / remarks for requestor (e.g., 20-ampere bolt-on breaker)"
                    class="w-full min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            <!-- 3. Selected Materials Checklist to Send -->
            <div class="space-y-2.5">
              <div class="flex items-center justify-between gap-2">
                <label class="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Materials List Sent to Requestor <span class="text-rose-500">*</span>
                </label>
                <span class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold tabular-nums">
                  {{ materialsList.length }} item{{ materialsList.length === 1 ? '' : 's' }}
                </span>
              </div>

              <div
                v-if="materialsList.length === 0"
                class="p-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 text-center text-xs text-slate-500 font-medium"
              >
                No materials added yet. Pick items from the GSO catalog above or add a custom item to build the requestor's checklist.
              </div>

              <div v-else class="space-y-2.5">
                <div
                  v-for="(row, idx) in materialsList"
                  :key="row._key"
                  class="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2.5"
                >
                  <div class="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                    <div class="sm:col-span-5">
                      <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Material #{{ idx + 1 }}
                      </label>
                      <input
                        v-model="row.material_name"
                        type="text"
                        required
                        class="w-full min-h-[40px] px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white"
                      />
                    </div>
                    <div class="sm:col-span-2">
                      <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Qty</label>
                      <input
                        v-model.number="row.quantity"
                        type="number"
                        min="0.01"
                        step="any"
                        required
                        class="w-full min-h-[40px] px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-bold text-right focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white tabular-nums"
                      />
                    </div>
                    <div class="sm:col-span-2">
                      <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Unit</label>
                      <input
                        v-model="row.unit_measurement"
                        type="text"
                        list="ocular-unit-options"
                        required
                        class="w-full min-h-[40px] px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white"
                      />
                    </div>
                    <div class="sm:col-span-3 flex items-center gap-1.5">
                      <select
                        v-model="row.inventory_status"
                        class="flex-1 min-h-[40px] px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white"
                      >
                        <option value="empty">Empty (0 stock)</option>
                        <option value="short">Short Stock</option>
                        <option value="not_in_catalog">Not in Catalog</option>
                        <option value="unavailable">Unavailable</option>
                      </select>
                      <button
                        type="button"
                        @click="removeRow(idx)"
                        class="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer shrink-0"
                        title="Remove material"
                        aria-label="Remove material"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span
                      v-if="row.gso_available_qty !== null && row.gso_available_qty !== undefined"
                      class="px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 w-fit"
                      :class="Number(row.gso_available_qty) <= 0 ? 'bg-rose-500/10 text-rose-600' : 'bg-amber-500/10 text-amber-700'"
                    >
                      GSO Available: {{ row.gso_available_qty }} {{ row.unit_measurement }}
                    </span>
                    <input
                      v-model="row.remarks"
                      type="text"
                      maxlength="500"
                      placeholder="Item notes / specifications (optional)..."
                      class="flex-1 min-h-[36px] px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- 4. Overall Notes for Requestor -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between gap-2">
                <label class="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Inspector Notes for Requestor (Optional)
                </label>
                <button
                  type="button"
                  @click="applyDefaultNote"
                  class="text-[11px] font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
                >
                  + Insert Standard Reminder
                </button>
              </div>
              <textarea
                v-model="notesInput"
                rows="2"
                maxlength="1000"
                placeholder="Explain which items are short/out-of-stock in GSO and instruct the requestor to confirm once ready..."
                class="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-normal focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all placeholder:text-slate-400"
              ></textarea>
            </div>

            <!-- Error Banner -->
            <div
              v-if="errorMessage"
              class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2"
            >
              <svg class="w-4 h-4 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ errorMessage }}</span>
            </div>

            <!-- Footer Actions -->
            <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                @click="$emit('close')"
                class="min-h-[44px] px-4 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSubmitting || materialsList.length === 0"
                class="min-h-[44px] px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide text-white bg-amber-600 hover:bg-amber-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 shadow-md shadow-amber-600/20 flex items-center gap-2 cursor-pointer"
              >
                <svg v-if="isSubmitting" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isSubmitting ? 'Sending Checklist...' : 'Send Materials List to Requestor' }}</span>
              </button>
            </div>
          </form>

          <datalist id="ocular-unit-options">
            <option value="pcs" />
            <option value="sets" />
            <option value="meters" />
            <option value="rolls" />
            <option value="boxes" />
            <option value="liters" />
            <option value="gallons" />
            <option value="bags" />
            <option value="lengths" />
            <option value="tubes" />
            <option value="packs" />
            <option value="sheets" />
          </datalist>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { toast } from 'vue3-toastify';
import { useOperationsHubStore } from '@/stores/operationsHub';
import { saveRequiredMaterials } from '@/api/tickets';
import {
  SHORT_STOCK_THRESHOLD,
  isCatalogMaterialShortOrEmpty,
  deriveCatalogInventoryStatus,
  validateRequiredMaterialsList,
} from '@/utils/requiredMaterials';

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  ticket: { type: Object, default: null },
  unitCode: { type: String, default: 'FGMU' },
});

const emit = defineEmits(['close', 'updated']);

const operationsHubStore = useOperationsHubStore();

const catalogItems = ref([]);
const isLoadingCatalog = ref(false);
const catalogFilter = ref('short_empty');
const catalogSearch = ref('');

const materialsList = ref([]);
const notesInput = ref('');
const isSubmitting = ref(false);
const errorMessage = ref('');
let rowSeq = 0;

const createEmptyCustomDraft = () => ({
  material_name: '',
  quantity: 1,
  unit_measurement: 'pcs',
  inventory_status: 'not_in_catalog',
  remarks: '',
});

const customDraft = ref(createEmptyCustomDraft());

const effectiveUnit = computed(() => {
  const raw = String(props.ticket?.unit_code || props.ticket?.unit || props.unitCode || 'FGMU')
    .toUpperCase()
    .trim();
  if (raw === 'FGMU' || raw === 'LEAU') {
    return raw;
  }
  return 'FGMU';
});

const unitCatalog = computed(() => {
  return (catalogItems.value || []).filter((item) => {
    const unit = String(item.unit_code || '').toUpperCase().trim();
    return !unit || unit === effectiveUnit.value;
  });
});

const isShortOrEmpty = (item) => isCatalogMaterialShortOrEmpty(item);

const shortOrEmptyCount = computed(() => unitCatalog.value.filter(isShortOrEmpty).length);

const filteredCatalog = computed(() => {
  let list = unitCatalog.value;
  if (catalogFilter.value === 'short_empty') {
    list = list.filter(isShortOrEmpty);
  }
  const term = catalogSearch.value.trim().toLowerCase();
  if (!term) return list;
  return list.filter(
    (item) =>
      String(item.name || '').toLowerCase().includes(term) ||
      String(item.category || '').toLowerCase().includes(term)
  );
});

const getStockBadgeClass = (item) => {
  const qty = Number(item?.quantity_available ?? 0);
  if (qty <= 0) return 'bg-rose-500/10 text-rose-600';
  if (qty <= SHORT_STOCK_THRESHOLD) return 'bg-amber-500/10 text-amber-700';
  return 'bg-emerald-500/10 text-emerald-700';
};

const getStockBadgeText = (item) => {
  const qty = Number(item?.quantity_available ?? 0);
  if (qty <= 0) return 'Empty (0 avail.)';
  if (qty <= SHORT_STOCK_THRESHOLD) return `Short (${qty} left)`;
  return `${qty} in stock`;
};

const isCatalogItemAdded = (catalogId) =>
  materialsList.value.some((row) => Number(row.catalog_material_id) === Number(catalogId));

const mapExistingMaterial = (item) => ({
  _key: `req-mat-${++rowSeq}`,
  catalog_material_id: item.catalog_material_id ? Number(item.catalog_material_id) : null,
  material_name: item.material_name || '',
  quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
  unit_measurement: item.unit_measurement || 'pcs',
  inventory_status: item.inventory_status || 'empty',
  gso_available_qty:
    item.gso_available_qty !== null && item.gso_available_qty !== undefined
      ? Number(item.gso_available_qty)
      : null,
  remarks: item.remarks || '',
});

const loadCatalog = async () => {
  isLoadingCatalog.value = true;
  try {
    const items = await operationsHubStore.fetchMaterials(effectiveUnit.value);
    catalogItems.value = Array.isArray(items) ? items : [];
  } catch {
    catalogItems.value = operationsHubStore.materialsByUnit(effectiveUnit.value) || [];
  } finally {
    isLoadingCatalog.value = false;
  }
};

watch(
  () => [props.isOpen, props.ticket?.id],
  ([open]) => {
    if (!open || !props.ticket) return;
    errorMessage.value = '';
    catalogSearch.value = '';
    customDraft.value = createEmptyCustomDraft();

    const existing = Array.isArray(props.ticket.required_materials)
      ? props.ticket.required_materials
      : [];
    materialsList.value = existing.map(mapExistingMaterial);
    notesInput.value = props.ticket.required_materials_notes || '';

    loadCatalog();
  },
  { immediate: true }
);

const addCatalogItem = (item) => {
  errorMessage.value = '';
  const existing = materialsList.value.find(
    (row) => Number(row.catalog_material_id) === Number(item.id)
  );
  if (existing) {
    existing.quantity = Number((Number(existing.quantity || 0) + 1).toFixed(2));
    return;
  }

  const avail = Math.max(0, Number(item.quantity_available ?? 0));
  materialsList.value.push({
    _key: `req-mat-${++rowSeq}`,
    catalog_material_id: Number(item.id),
    material_name: item.name || '',
    quantity: 1,
    unit_measurement: item.unit || 'pcs',
    inventory_status: deriveCatalogInventoryStatus(avail),
    gso_available_qty: avail,
    remarks: '',
  });
};

const addCustomDraft = () => {
  const name = customDraft.value.material_name.trim();
  const qty = Number(customDraft.value.quantity);
  if (!name || !(qty > 0)) {
    errorMessage.value = 'Enter a material name and a quantity greater than 0.';
    return;
  }

  errorMessage.value = '';
  materialsList.value.push({
    _key: `req-mat-${++rowSeq}`,
    catalog_material_id: null,
    material_name: name,
    quantity: Number(qty.toFixed(2)),
    unit_measurement: customDraft.value.unit_measurement.trim() || 'pcs',
    inventory_status: customDraft.value.inventory_status || 'not_in_catalog',
    gso_available_qty: null,
    remarks: customDraft.value.remarks.trim(),
  });
  customDraft.value = createEmptyCustomDraft();
};

const removeRow = (index) => {
  materialsList.value.splice(index, 1);
};

const applyDefaultNote = () => {
  notesInput.value =
    'GSO inventory for the listed materials is currently short/empty. Please check off all items once you already have them on-hand so approval can continue.';
};

const handleSubmit = async () => {
  const targetId = props.ticket?.ticketId || props.ticket?.id;
  if (!targetId) return;

  const validationError = validateRequiredMaterialsList(materialsList.value);
  if (validationError) {
    errorMessage.value = validationError;
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';

  const payload = {
    materials: materialsList.value.map((row) => ({
      catalog_material_id: row.catalog_material_id || null,
      material_name: String(row.material_name).trim(),
      quantity: Number(Number(row.quantity).toFixed(2)),
      unit_measurement: String(row.unit_measurement || 'pcs').trim() || 'pcs',
      inventory_status: row.inventory_status || 'empty',
      gso_available_qty:
        row.gso_available_qty !== null && row.gso_available_qty !== undefined
          ? Number(row.gso_available_qty)
          : null,
      remarks: String(row.remarks || '').trim() || null,
    })),
    notes: notesInput.value.trim(),
  };

  try {
    const response = await saveRequiredMaterials(targetId, payload);
    const data = response.data?.data || {};
    toast.success(`Materials checklist sent to requestor for #${targetId}`);
    emit('updated', {
      ticketId: targetId,
      required_materials_status: data.required_materials_status || 'awaiting_requestor',
      required_materials_notes: data.required_materials_notes ?? (notesInput.value.trim() || null),
      required_materials_requested_at: data.required_materials_requested_at || new Date().toISOString(),
      required_materials: data.required_materials || payload.materials,
    });
    emit('close');
  } catch (err) {
    const msg =
      err.response?.data?.message ||
      'Unable to save required materials list. Please try again.';
    errorMessage.value = msg;
    toast.error(msg);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.animate-modal-pop {
  animation: modalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes modalPop {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
</style>
