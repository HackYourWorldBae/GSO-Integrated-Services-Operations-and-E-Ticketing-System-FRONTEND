<template>
  <MainLayout>
    <template #header-title>
      <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
        Common Materials Library
      </h2>
    </template>

    <template #main-content>
      <div class="space-y-6 sm:space-y-8 animate-fade-in pb-16">
        <!-- Hero Banner Section -->
        <div
          class="p-6 sm:p-8 rounded-3xl text-white shadow-xl border relative overflow-hidden"
          :class="isFgmu
            ? 'bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 border-blue-900/40'
            : 'bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 border-emerald-900/40'"
        >
          <!-- Ambient Glow Elements -->
          <div
            class="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl pointer-events-none"
            :class="isFgmu ? 'bg-blue-500/15' : 'bg-emerald-500/15'"
          ></div>
          <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div class="space-y-2.5 max-w-2xl">
              <div class="flex items-center gap-2 flex-wrap">
                <span
                  class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
                  :class="isFgmu
                    ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'"
                >
                  {{ effectiveUnit }} Unit Operations
                </span>
                <span class="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-wider border border-white/10">
                  Standardized Work Materials
                </span>
              </div>
              <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {{ effectiveUnit }} Common Materials Library
              </h1>
              <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Standardized supplies, consumable parts, and benchmark prices for {{ unitTitle }}. Personnel and dispatchers reference these catalog specifications during pre-assessments, ticket dispatches, and material replenishment.
              </p>
            </div>

            <!-- Quick Stats Summary Counters -->
            <div class="grid grid-cols-2 gap-3 shrink-0">
              <div class="p-3.5 rounded-2xl bg-white/[0.07] border border-white/10 text-center backdrop-blur-xs min-w-[100px]">
                <span class="text-xl sm:text-2xl font-black text-white tabular-nums block">
                  {{ unitMaterials.length }}
                </span>
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5 block">
                  Total Items
                </span>
              </div>

              <div class="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-center backdrop-blur-xs min-w-[100px]">
                <span class="text-xl sm:text-2xl font-black text-amber-300 tabular-nums block">
                  ₱{{ averagePrice.toFixed(0) }}
                </span>
                <span class="text-[10px] font-bold uppercase tracking-wider text-amber-200/70 mt-0.5 block">
                  Avg. Price
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Controls Toolbar: Search and Add Button -->
        <div class="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <!-- Search Field -->
          <div class="flex-1 relative">
            <input
              v-model="searchQuery"
              data-tour="materials-search-input"
              type="text"
              placeholder="Search material description or standard unit..."
              class="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 shadow-inner transition-all min-h-[44px]"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              title="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
            <button
              data-tour="materials-btn-add"
              @click="openAddModal"
              class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer min-h-[44px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Material</span>
            </button>

            <button
              data-tour="materials-btn-sync"
              @click="handleSeedDefaults"
              :disabled="operationsStore.isSaving"
              title="Ensure all standard baseline materials are present"
              class="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px] disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span class="hidden sm:inline">Sync Baseline</span>
            </button>
          </div>
        </div>

        <!-- Materials Table (Desktop) -->
        <div data-tour="materials-catalog-table" class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden hidden md:block">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <th class="py-3.5 px-4 w-12 text-center">#</th>
                  <th class="py-3.5 px-4">Material / Supply Name</th>
                  <th class="py-3.5 px-4 w-28 text-center">Standard Unit</th>
                  <th class="py-3.5 px-4 w-32 text-right">Default Benchmark Price</th>
                  <th class="py-3.5 px-4 w-28 text-center">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-if="filteredMaterials.length === 0">
                  <td colspan="5" class="py-14 text-center text-slate-400">
                    <div class="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <p class="font-bold text-sm text-slate-700">No materials match your search criteria.</p>
                      <p class="text-xs text-slate-400">Try adjusting your keyword.</p>
                    </div>
                  </td>
                </tr>

                <tr
                  v-for="(item, idx) in paginatedMaterials"
                  :key="item.id || item.name"
                  class="hover:bg-slate-50/80 transition-colors group"
                >
                  <td class="py-3.5 px-4 text-center font-bold text-slate-400 tabular-nums">
                    {{ (currentPage - 1) * perPage + idx + 1 }}
                  </td>
                  <td class="py-3.5 px-4">
                    <div class="font-black text-slate-900 text-xs sm:text-sm">
                      {{ item.name }}
                    </div>
                  </td>
                  <td class="py-3.5 px-4 text-center font-bold text-slate-600">
                    {{ item.unit || 'pcs' }}
                  </td>
                  <td class="py-3.5 px-4 text-right font-black text-slate-900 tabular-nums text-xs sm:text-sm">
                    ₱{{ Number(item.default_price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </td>
                  <td class="py-3.5 px-4 text-center">
                    <div class="flex items-center justify-center gap-1">
                      <button
                        @click="openEditModal(item)"
                        title="Edit Material"
                        class="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        @click="handleDeleteMaterial(item)"
                        title="Delete Material"
                        class="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Materials Cards (Mobile-friendly) -->
        <div class="space-y-3 md:hidden">
          <div v-if="filteredMaterials.length === 0" class="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            <p class="font-bold text-sm text-slate-700">No materials found.</p>
            <p class="text-xs text-slate-400 mt-1">Try another search keyword.</p>
          </div>

          <div
            v-for="(item, idx) in paginatedMaterials"
            :key="item.id || item.name"
            class="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">
                  #{{ (currentPage - 1) * perPage + idx + 1 }}
                </span>
                <h4 class="font-black text-sm text-slate-900 leading-snug">
                  {{ item.name }}
                </h4>
                <div class="flex items-center gap-2 mt-1 flex-wrap">
                  <span class="text-xs font-semibold text-slate-500">
                    Unit: <strong class="text-slate-700">{{ item.unit || 'pcs' }}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <div>
                <span class="text-[10px] uppercase font-bold text-slate-400 block">Default Price</span>
                <span class="font-black text-slate-900 text-sm tabular-nums">
                  ₱{{ Number(item.default_price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                </span>
              </div>

              <div class="flex items-center gap-1">
                <button
                  @click="openEditModal(item)"
                  class="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 active:scale-95"
                >
                  Edit
                </button>
                <button
                  @click="handleDeleteMaterial(item)"
                  class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 active:scale-95"
                  title="Delete"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination Controls Toolbar -->
        <div
          v-if="filteredMaterials.length > 0"
          class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div class="flex flex-col sm:flex-row items-center gap-3 text-xs text-slate-500 w-full sm:w-auto text-center sm:text-left">
            <div class="flex items-center gap-2">
              <span class="font-medium text-slate-600">Rows per page:</span>
              <select
                v-model.number="perPage"
                @change="currentPage = 1"
                class="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer min-h-[38px]"
              >
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select>
            </div>
            <span class="text-slate-600">
              Showing <strong class="text-slate-900">{{ ((currentPage - 1) * perPage) + 1 }}</strong> to
              <strong class="text-slate-900">{{ Math.min(currentPage * perPage, filteredMaterials.length) }}</strong> of
              <strong class="text-slate-900">{{ filteredMaterials.length }}</strong> items
            </span>
          </div>

          <!-- Page Navigation Buttons -->
          <div class="flex items-center gap-1.5 flex-wrap justify-center sm:justify-end w-full sm:w-auto">
            <button
              @click="currentPage = 1"
              :disabled="currentPage === 1"
              class="p-2 min-w-[38px] min-h-[38px] rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-bold cursor-pointer flex items-center justify-center active:scale-95"
              title="First page"
            >
              «
            </button>
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-1.5 min-h-[38px] rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95"
            >
              ‹ Prev
            </button>

            <template v-for="(page, idx) in displayedPages" :key="idx">
              <span v-if="page === '...'" class="px-2 text-slate-400 font-bold text-xs">...</span>
              <button
                v-else
                @click="currentPage = page"
                :class="[
                  'min-w-[38px] h-[38px] px-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center active:scale-95',
                  currentPage === page
                    ? (isFgmu ? 'bg-blue-600 text-white shadow-xs' : 'bg-emerald-600 text-white shadow-xs')
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
                ]"
              >
                {{ page }}
              </button>
            </template>

            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="px-3 py-1.5 min-h-[38px] rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95"
            >
              Next ›
            </button>
            <button
              @click="currentPage = totalPages"
              :disabled="currentPage === totalPages"
              class="p-2 min-w-[38px] min-h-[38px] rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-bold cursor-pointer flex items-center justify-center active:scale-95"
              title="Last page"
            >
              »
            </button>
          </div>
        </div>

        <!-- Add / Edit Material Modal -->
        <div
          v-if="showModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
        >
          <div class="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
            <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 class="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {{ editingItem ? 'Edit Material Item' : `Add New Material (${effectiveUnit})` }}
                </h3>
                <p class="text-xs text-slate-500 font-medium">
                  Standard supplies and benchmark pricing for {{ effectiveUnit }} operations.
                </p>
              </div>
              <button
                @click="showModal = false"
                class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form @submit.prevent="handleSaveMaterial" class="p-6 space-y-4">
              <!-- Material Name -->
              <div class="space-y-1.5">
                <label class="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  Material / Item Name
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  placeholder="e.g., PVC Pipe 1/2 inch, LED Bulb 18W, Carabao Grass Sod"
                  class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 min-h-[44px]"
                />
              </div>

              <!-- Unit of Measure & Default Price -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="block text-xs font-black text-slate-800 uppercase tracking-wider">
                    Unit of Measure
                  </label>
                  <select
                    v-model="form.unit"
                    required
                    class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 min-h-[44px] cursor-pointer"
                  >
                    <option value="pcs">pcs</option>
                    <option value="lengths">lengths</option>
                    <option value="meters">meters</option>
                    <option value="liters">liters</option>
                    <option value="kg">kg</option>
                    <option value="rolls">rolls</option>
                    <option value="sets">sets</option>
                    <option value="bags">bags</option>
                    <option value="cans">cans</option>
                    <option value="pairs">pairs</option>
                    <option value="boxes">boxes</option>
                    <option value="units">units</option>
                    <option value="sheets">sheets</option>
                    <option value="gallons">gallons</option>
                    <option value="sq.ft.">sq.ft.</option>
                    <option value="packs">packs</option>
                    <option value="tubes">tubes</option>
                  </select>
                </div>

                <div class="space-y-1.5">
                  <label class="block text-xs font-black text-slate-800 uppercase tracking-wider">
                    Default Benchmark Price (₱)
                  </label>
                  <input
                    v-model.number="form.default_price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 text-right focus:outline-none focus:ring-2 focus:ring-slate-900 min-h-[44px]"
                  />
                </div>
              </div>

              <!-- Modal Actions -->
              <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  @click="showModal = false"
                  class="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer min-h-[40px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="operationsStore.isSaving"
                  class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50 min-h-[40px]"
                >
                  {{ operationsStore.isSaving ? 'Saving...' : (editingItem ? 'Update Material' : 'Save Material') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import { useOperationsHubStore } from '@/stores/operationsHub';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'vue3-toastify';
import Swal from 'sweetalert2';

const props = defineProps({
  unitCode: {
    type: String,
    default: '',
  },
  unitName: {
    type: String,
    default: '',
  },
});

const route = useRoute();
const authStore = useAuthStore();
const operationsStore = useOperationsHubStore();

// Determine effective unit from props, route, or logged-in auth user
const effectiveUnit = computed(() => {
  if (props.unitCode) return props.unitCode.toUpperCase();
  const path = route.path.toLowerCase();
  if (path.includes('/leau')) return 'LEAU';
  if (path.includes('/fgmu')) return 'FGMU';

  const userUnit = authStore.user?.unit_code || '';
  if (userUnit) return userUnit.toUpperCase();
  return 'FGMU';
});

const isFgmu = computed(() => effectiveUnit.value === 'FGMU');

const unitTitle = computed(() => {
  if (props.unitName) return props.unitName;
  return isFgmu.value
    ? 'Facilities & Grounds Management Unit (FGMU)'
    : 'Landscaping & Environmental Action Unit (LEAU)';
});

// Unit-specific materials list from store
const unitMaterials = computed(() => {
  return operationsStore.materialsByUnit(effectiveUnit.value);
});

const averagePrice = computed(() => {
  const items = unitMaterials.value;
  if (!items.length) return 0;
  const sum = items.reduce((acc, curr) => acc + Number(curr.default_price || 0), 0);
  return sum / items.length;
});

// Filtering and Searching
const searchQuery = ref('');

const filteredMaterials = computed(() => {
  let list = unitMaterials.value;

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(m =>
      (m.name || '').toLowerCase().includes(q) ||
      (m.unit || '').toLowerCase().includes(q)
    );
  }

  return list;
});

// -----------------------------------------------------------------------------
// Pagination State & Logic
// -----------------------------------------------------------------------------
const currentPage = ref(1);
const perPage = ref(10);

const totalPages = computed(() => {
  return Math.ceil(filteredMaterials.value.length / perPage.value) || 1;
});

const paginatedMaterials = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return filteredMaterials.value.slice(start, start + perPage.value);
});

const displayedPages = computed(() => {
  const current = currentPage.value;
  const total = totalPages.value;
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = [];
  pages.push(1);
  if (current > 3) pages.push('...');
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
});

// Reset page upon search query or active unit changes
watch(searchQuery, () => {
  currentPage.value = 1;
});

watch(effectiveUnit, () => {
  currentPage.value = 1;
});

// Keep page index bounded if list shrinks
watch(totalPages, (newTotal) => {
  if (currentPage.value > newTotal) {
    currentPage.value = Math.max(1, newTotal);
  }
});

// Modal State & Handlers
const showModal = ref(false);
const editingItem = ref(null);
const form = ref({
  name: '',
  category: 'General',
  unit: 'pcs',
  default_price: 0,
  is_active: true,
});

const openAddModal = () => {
  editingItem.value = null;
  form.value = {
    name: '',
    category: 'General',
    unit: 'pcs',
    default_price: 0,
    is_active: true,
  };
  showModal.value = true;
};

const openEditModal = (item) => {
  editingItem.value = item;
  form.value = {
    name: item.name || '',
    category: item.category || 'General',
    unit: item.unit || 'pcs',
    default_price: Number(item.default_price || 0),
    is_active: 1,
  };
  showModal.value = true;
};

const handleSaveMaterial = async () => {
  const payload = {
    unit_code: effectiveUnit.value,
    category: form.value.category?.trim() || 'General',
    name: form.value.name.trim(),
    unit: form.value.unit,
    default_price: Number(form.value.default_price || 0),
    is_active: 1,
  };

  if (!payload.name) {
    toast.error('Material name is required.');
    return;
  }

  if (editingItem.value?.id) {
    const res = await operationsStore.updateMaterial(editingItem.value.id, payload);
    if (res.success) {
      toast.success(res.message || 'Material updated successfully.');
      showModal.value = false;
    } else {
      toast.error(res.message || 'Failed to update material.');
    }
  } else {
    const res = await operationsStore.saveMaterial(payload);
    if (res.success) {
      toast.success(res.message || 'Material added to library.');
      showModal.value = false;
    } else {
      toast.error(res.message || 'Failed to add material.');
    }
  }
};

const handleDeleteMaterial = async (item) => {
  const result = await Swal.fire({
    title: 'Delete Material?',
    html: `Are you sure you want to remove <strong>${item.name}</strong> from the ${effectiveUnit.value} catalog?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e11d48',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Yes, Delete',
    cancelButtonText: 'Cancel',
  });

  if (result.isConfirmed) {
    if (item.id) {
      const res = await operationsStore.deleteMaterial(item.id);
      if (res.success) {
        toast.success(res.message || 'Material deleted.');
      } else {
        toast.error(res.message || 'Failed to delete.');
      }
    } else {
      operationsStore.materials = operationsStore.materials.filter(m => m.name !== item.name);
      toast.success(`Removed ${item.name}`);
    }
  }
};

const handleSeedDefaults = async () => {
  try {
    await operationsStore.fetchMaterials(effectiveUnit.value);
    toast.info(`Synchronized ${effectiveUnit.value} materials catalog.`);
  } catch (err) {
    console.error('Failed to sync materials:', err);
  }
};

onMounted(async () => {
  await operationsStore.initOperationsHub();
  await operationsStore.fetchMaterials(effectiveUnit.value);
});
</script>
