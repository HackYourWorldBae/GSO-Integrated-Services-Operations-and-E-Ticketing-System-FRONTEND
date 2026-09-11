<template>
  <MainLayout>
    <!-- Sidebar Navigation Slot -->
    <template #sidebar-links>
      <DirectorSidebar />
    </template>

    <!-- Main View Content -->
    <template #main-content>
      <div class="space-y-6 sm:space-y-8 animate-fade-in p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">

        <!-- Top Header & Breadcrumb -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              <router-link to="/director/dashboard" class="hover:text-slate-700 transition-colors">Executive Overview</router-link>
              <span>/</span>
              <span class="text-emerald-700">Materials Valuation</span>
            </div>
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Materials &amp; Supplies Used
            </h1>
            <p class="text-sm text-slate-500 font-medium mt-1">
              All materials and supplies used across maintenance and service jobs, with quantities and costs.
            </p>
          </div>

          <!-- Document Export Action -->
          <div class="flex items-center gap-3 shrink-0">
            <button
              @click="handleDownloadMaterialsReport"
              :disabled="isGeneratingMaterialsPdf || isLoading || !executiveAnalytics"
              class="px-5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2.5 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Generate and download official materials consumption PDF document"
            >
              <svg v-if="isGeneratingMaterialsPdf" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{{ isGeneratingMaterialsPdf ? 'Generating PDF...' : 'Export Materials PDF' }}</span>
            </button>
          </div>
        </div>

        <!-- Period Filter & Scope Toolbar -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <!-- Period Selector Tabs -->
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs sm:text-sm font-bold text-slate-600 mr-1">Report Period:</span>
            <div class="inline-flex p-1.5 rounded-xl bg-white border border-slate-200 shadow-xs gap-1">
              <button
                v-for="p in periodOptions"
                :key="p.key"
                @click="changePeriod(p.key)"
                class="px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer"
                :class="selectedPeriod === p.key ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
              >
                {{ p.label }}
              </button>
            </div>
          </div>

          <!-- Dynamic Selectors (Year, Month, Quarter) & Refresh -->
          <div class="flex flex-wrap items-center gap-3">
            <!-- Year Selector -->
            <div v-if="selectedPeriod !== 'all'" class="relative">
              <select
                v-model="selectedYear"
                @change="fetchExecutiveAnalytics"
                class="appearance-none pl-4 pr-9 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-xs cursor-pointer"
              >
                <option v-for="yr in availableYears" :key="yr" :value="yr">
                  Year {{ yr }}
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            <!-- Month Selector -->
            <div v-if="selectedPeriod === 'month'" class="relative">
              <select
                v-model="selectedMonth"
                @change="fetchExecutiveAnalytics"
                class="appearance-none pl-4 pr-9 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-xs cursor-pointer"
              >
                <option v-for="m in monthOptions" :key="m.value" :value="m.value">
                  {{ m.label }}
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            <!-- Quarter Selector -->
            <div v-if="selectedPeriod === 'quarter'" class="relative">
              <select
                v-model="selectedQuarter"
                @change="fetchExecutiveAnalytics"
                class="appearance-none pl-4 pr-9 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-xs cursor-pointer"
              >
                <option v-for="q in quarterOptions" :key="q.value" :value="q.value">
                  {{ q.label }}
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            <!-- Refresh Button -->
            <button
              @click="fetchExecutiveAnalytics"
              class="p-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl transition-all cursor-pointer shadow-xs"
              title="Refresh Valuation Data"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Materials Valuation KPI Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          <!-- 1. Total Worth of Materials -->
          <div class="p-6 rounded-2xl bg-slate-900 text-white shadow-sm flex flex-col justify-between min-h-[150px]">
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="text-xs font-black uppercase tracking-wider text-slate-400">Total Cost of Materials</span>
              <span class="px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 text-xs font-bold">All Units</span>
            </div>
            <div class="text-3xl sm:text-4xl font-black tracking-tight tabular-nums text-white mb-2">
              ₱{{ formatCurrency(materialsSummary?.total_worth) }}
            </div>
            </div>
          </div>

          <!-- 2. Items Consumed / Recorded -->
          <div class="p-6 rounded-2xl bg-white border border-slate-200/80 text-slate-900 shadow-sm flex flex-col justify-between min-h-[150px]">
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="text-xs font-black uppercase tracking-wider text-slate-600">Materials Recorded</span>
              <span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-black">
                Entries
              </span>
            </div>
            <div class="text-3xl sm:text-4xl font-black tracking-tight tabular-nums text-slate-900 mb-2">
              {{ materialsSummary?.total_records || 0 }}
              <span class="text-sm font-bold text-slate-400">items</span>
            </div>
            </div>
          </div>

          <!-- 3. Physical Units Dispensed -->
          <div class="p-6 rounded-2xl bg-white border border-slate-200/80 text-slate-900 shadow-sm flex flex-col justify-between min-h-[150px]">
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="text-xs font-black uppercase tracking-wider text-slate-600">Total Items Used</span>
              <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                Quantity
              </span>
            </div>
            <div class="text-3xl sm:text-4xl font-black tracking-tight tabular-nums text-slate-900 mb-2">
              {{ formatNumber(materialsSummary?.total_quantity) }}
              <span class="text-sm font-bold text-slate-400">units</span>
            </div>
            </div>
          </div>

          <!-- 4. FGMU Facilities Valuation -->
          <div class="p-6 rounded-2xl bg-white border border-slate-200/80 text-slate-900 shadow-sm flex flex-col justify-between min-h-[150px]">
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="text-xs font-black uppercase tracking-wider text-blue-700">FGMU — Facilities</span>
              <span class="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200/60 text-xs font-black">
                {{ materialsSummary?.by_unit?.FGMU?.count || 0 }} Items
              </span>
            </div>
            <div class="text-2xl sm:text-3xl font-black tracking-tight tabular-nums text-slate-900 mb-2">
              ₱{{ formatCurrency(materialsSummary?.by_unit?.FGMU?.total_worth) }}
            </div>
            </div>
          </div>

          <!-- 5. LEAU Landscaping Valuation -->
          <div class="p-6 rounded-2xl bg-white border border-slate-200/80 text-slate-900 shadow-sm flex flex-col justify-between min-h-[150px]">
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="text-xs font-black uppercase tracking-wider text-emerald-700">LEAU — Landscaping</span>
              <span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-black">
                {{ materialsSummary?.by_unit?.LEAU?.count || 0 }} Items
              </span>
            </div>
            <div class="text-2xl sm:text-3xl font-black tracking-tight tabular-nums text-slate-900 mb-2">
              ₱{{ formatCurrency(materialsSummary?.by_unit?.LEAU?.total_worth) }}
            </div>
            </div>
          </div>
        </div>

        <!-- Materials Interactive Data Table Section -->
        <div class="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
          <!-- Table Controls Toolbar -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <!-- Left: Sub-unit Filter Tabs -->
            <div class="flex items-center gap-2">
              <span class="text-xs font-black uppercase tracking-wider text-slate-400 mr-1">Filter by Unit:</span>
              <div class="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 gap-1">
                <button
                  v-for="scope in unitScopes"
                  :key="scope.key"
                  @click="activeUnitScope = scope.key"
                  class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer"
                  :class="activeUnitScope === scope.key ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
                >
                  {{ scope.label }}
                </button>
              </div>
            </div>

            <!-- Right: Search Input & Summary Count -->
            <div class="flex items-center gap-3">
              <div class="relative min-w-[240px] sm:min-w-[300px]">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search material, ticket ref, or unit..."
                  class="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all shadow-2xs"
                />
                <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span class="text-xs font-bold text-slate-400 whitespace-nowrap hidden sm:inline-block">
                Showing {{ filteredItems.length }} of {{ rawItems.length }}
              </span>
            </div>
          </div>

          <!-- Table Container -->
          <div class="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
            <table class="min-w-[850px] w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-100/90 text-slate-700 text-xs font-black uppercase tracking-wider border-b border-slate-200">
                  <th class="py-3.5 px-4 text-center w-12">#</th>
                  <th class="py-3.5 px-6">Material / Supply Name</th>
                  <th class="py-3.5 px-4 text-center">Measurement</th>
                  <th class="py-3.5 px-4 text-center">Qty Used</th>
                  <th class="py-3.5 px-4 text-right">Price per Unit</th>
                  <th class="py-3.5 px-4 text-right">Total Cost</th>
                  <th class="py-3.5 px-4 text-center">Unit</th>
                  <th class="py-3.5 px-6 text-center">Job Order #</th>
                  <th class="py-3.5 px-6 text-center">Date Used</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-sm">
                <!-- Loading State -->
                <tr v-if="isLoading">
                  <td colspan="9" class="py-12 text-center text-slate-400 font-medium">
                    <div class="inline-flex items-center gap-2">
                      <svg class="animate-spin h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Loading materials valuation records...</span>
                    </div>
                  </td>
                </tr>

                <!-- Empty State -->
                <tr v-else-if="filteredItems.length === 0">
                  <td colspan="9" class="py-12 text-center text-slate-400 font-medium">
                    <div class="flex flex-col items-center justify-center gap-2">
                      <svg class="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <p class="text-sm font-semibold text-slate-600">
                        {{ searchQuery ? 'No materials match your search filter.' : 'No materials recorded for the selected period.' }}
                      </p>
                      <p class="text-xs text-slate-400">Try changing the period filter or adjusting your search term.</p>
                    </div>
                  </td>
                </tr>

                <!-- Data Rows -->
                <tr
                  v-else
                  v-for="(item, idx) in filteredItems"
                  :key="item.id || idx"
                  class="hover:bg-slate-50/80 transition-colors"
                >
                  <td class="py-3.5 px-4 text-center text-xs font-bold text-slate-400 tabular-nums">
                    {{ idx + 1 }}
                  </td>
                  <td class="py-3.5 px-6">
                    <div class="font-bold text-slate-900 text-sm sm:text-base">{{ item.material_name }}</div>
                    <div v-if="item.ticket_title" class="text-xs text-slate-400 truncate max-w-sm mt-0.5">
                      {{ item.ticket_title }}
                    </div>
                  </td>
                  <td class="py-3.5 px-4 text-center text-xs font-semibold text-slate-600 uppercase">
                    {{ item.unit_measurement || 'pcs' }}
                  </td>
                  <td class="py-3.5 px-4 text-center font-black text-slate-900 tabular-nums text-sm">
                    {{ item.quantity }}
                  </td>
                  <td class="py-3.5 px-4 text-right font-medium text-slate-700 tabular-nums text-sm">
                    ₱{{ formatCurrency(item.unit_price) }}
                  </td>
                  <td class="py-3.5 px-4 text-right font-black text-slate-900 tabular-nums text-sm">
                    ₱{{ formatCurrency(item.total_price) }}
                  </td>
                  <td class="py-3.5 px-4 text-center">
                    <span
                      class="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider"
                      :class="item.unit_code === 'LEAU' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60' : 'bg-blue-50 text-blue-800 border border-blue-200/60'"
                    >
                      {{ item.unit_code }}
                    </span>
                  </td>
                  <td class="py-3.5 px-6 text-center text-xs font-mono font-bold text-slate-600">
                    {{ item.ticket_id || '—' }}
                  </td>
                  <td class="py-3.5 px-6 text-center text-xs text-slate-500 whitespace-nowrap">
                    {{ formatDate(item.created_at) }}
                  </td>
                </tr>

                <!-- Sticky Summary Grand Total Row -->
                <tr v-if="filteredItems.length > 0" class="bg-slate-50 font-black text-slate-900 border-t-2 border-slate-200">
                  <td colspan="3" class="py-4 px-6 text-right text-xs sm:text-sm font-black tracking-wider text-slate-800 uppercase">
                    Total ({{ filteredItems.length }} items):
                  </td>
                  <td class="py-4 px-4 text-center font-black tabular-nums text-slate-900">
                    {{ formatNumber(filteredTotalQuantity) }}
                  </td>
                  <td class="py-4 px-4 text-right text-xs font-bold text-slate-500 uppercase">
                    Total Cost:
                  </td>
                  <td class="py-4 px-4 text-right text-emerald-800 tabular-nums text-base font-black">
                    ₱{{ formatCurrency(filteredTotalWorth) }}
                  </td>
                  <td colspan="3"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import DirectorSidebar from './DirectorSidebar.vue';
import { downloadMaterialsReportPdf } from '@/utils/materialsReportPdfGenerator';
import { toast } from 'vue3-toastify';
import api from '@/api/client';

// State
const executiveAnalytics = ref(null);
const isLoading = ref(false);
const isGeneratingMaterialsPdf = ref(false);
const searchQuery = ref('');
const activeUnitScope = ref('ALL');

// Date / Period Controls
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const currentQuarter = Math.ceil(currentMonth / 3);

const selectedPeriod = ref('month');
const selectedYear = ref(currentYear);
const selectedMonth = ref(currentMonth);
const selectedQuarter = ref(currentQuarter);

const periodOptions = [
  { key: 'month',   label: 'Monthly Report' },
  { key: 'quarter', label: 'Quarterly Report' },
  { key: 'year',    label: 'Annual Report' },
  { key: 'all',     label: 'All-Time' },
];

const unitScopes = [
  { key: 'ALL',  label: 'All Sub-Units' },
  { key: 'FGMU', label: 'Facilities (FGMU)' },
  { key: 'LEAU', label: 'Environment (LEAU)' },
];

const quarterOptions = [
  { value: 1, label: 'Q1 (Jan - Mar)' },
  { value: 2, label: 'Q2 (Apr - Jun)' },
  { value: 3, label: 'Q3 (Jul - Sep)' },
  { value: 4, label: 'Q4 (Oct - Dec)' },
];

const monthOptions = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

const availableYears = computed(() => {
  const years = executiveAnalytics.value?.available_years;
  if (Array.isArray(years) && years.length > 0) {
    return years;
  }
  return [currentYear];
});

const materialsSummary = computed(() => {
  return executiveAnalytics.value?.materials_summary || null;
});

const rawItems = computed(() => {
  return materialsSummary.value?.items || [];
});

// Filtered items computed with unit scope and text search
const filteredItems = computed(() => {
  let list = rawItems.value;
  if (activeUnitScope.value !== 'ALL') {
    list = list.filter(item => (item.unit_code || '').toUpperCase() === activeUnitScope.value);
  }
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return list;
  return list.filter(item =>
    (item.material_name || '').toLowerCase().includes(q) ||
    (item.ticket_id || '').toLowerCase().includes(q) ||
    (item.ticket_title || '').toLowerCase().includes(q) ||
    (item.unit_measurement || '').toLowerCase().includes(q) ||
    (item.unit_code || '').toLowerCase().includes(q)
  );
});

const filteredTotalWorth = computed(() => {
  return filteredItems.value.reduce((sum, item) => sum + Number(item.total_price || 0), 0);
});

const filteredTotalQuantity = computed(() => {
  return filteredItems.value.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
});

// Formatters
const formatCurrency = (val) => {
  return Number(val || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatNumber = (val) => {
  return Number(val || 0).toLocaleString('en-US');
};

const formatDate = (val) => {
  if (!val) return '—';
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const changePeriod = (key) => {
  selectedPeriod.value = key;
  fetchExecutiveAnalytics();
};

const fetchExecutiveAnalytics = async () => {
  isLoading.value = true;
  try {
    const params = {
      period: selectedPeriod.value,
      year: selectedYear.value,
      unit: 'ALL',
    };
    if (selectedPeriod.value === 'month') {
      params.month = selectedMonth.value;
    } else if (selectedPeriod.value === 'quarter') {
      params.quarter = selectedQuarter.value;
    }

    const res = await api.get('director/analytics', { params });
    if (res.data?.data) {
      executiveAnalytics.value = res.data.data;
    }
  } catch (error) {
    console.error('Failed to load executive materials analytics:', error);
    toast.error('Failed to load materials valuation data.');
  } finally {
    isLoading.value = false;
  }
};

const handleDownloadMaterialsReport = async () => {
  if (!executiveAnalytics.value) {
    toast.error('Analytics summary data is still loading.');
    return;
  }
  isGeneratingMaterialsPdf.value = true;
  try {
    await downloadMaterialsReportPdf(executiveAnalytics.value);
    toast.success('Official Materials Report downloaded successfully.');
  } catch (error) {
    console.error('Failed to download materials report PDF:', error);
    toast.error('Failed to download official materials report PDF.');
  } finally {
    isGeneratingMaterialsPdf.value = false;
  }
};

onMounted(() => {
  fetchExecutiveAnalytics();
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
