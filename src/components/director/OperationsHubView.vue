<template>
  <div class="space-y-6 sm:space-y-8 animate-fade-in">
    <!-- Header Section -->
    <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 text-white shadow-xl border border-slate-700/60 relative overflow-hidden">
      <!-- Background Ambient Glow -->
      <div class="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div class="space-y-2">
          <div class="flex items-center gap-2.5 flex-wrap">
            <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
              Executive Director Controls
            </span>
            <span class="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-wider border border-white/10">
              Operations Master Hub
            </span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Central Operations &amp; Materials Hub
          </h1>
          <p class="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Centrally manage standardized material libraries for FGMU and LEAU, calibrate official non-working holidays for accurate duration counting, and configure university operating hours.
          </p>
        </div>

        <!-- Quick Summary Stats Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
          <div class="p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 text-center backdrop-blur-xs">
            <span class="text-xl sm:text-2xl font-black text-white tabular-nums block">
              {{ operationsStore.materials.length }}
            </span>
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5 block">
              Catalog Items
            </span>
          </div>

          <div class="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-400/20 text-center backdrop-blur-xs">
            <span class="text-xl sm:text-2xl font-black text-blue-300 tabular-nums block">
              {{ operationsStore.fgmuMaterials.length }}
            </span>
            <span class="text-[10px] font-bold uppercase tracking-wider text-blue-200/70 mt-0.5 block">
              FGMU Materials
            </span>
          </div>

          <div class="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 text-center backdrop-blur-xs col-span-2 sm:col-span-1">
            <span class="text-xl sm:text-2xl font-black text-emerald-300 tabular-nums block">
              {{ operationsStore.leauMaterials.length }}
            </span>
            <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-200/70 mt-0.5 block">
              LEAU Materials
            </span>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex items-center gap-2 mt-8 pt-6 border-t border-white/10 overflow-x-auto no-scrollbar">
        <button
          v-for="tab in navigationTabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap min-h-[44px]"
          :class="activeTab === tab.id
            ? 'bg-white text-slate-900 shadow-md font-black scale-100'
            : 'text-slate-300 hover:text-white hover:bg-white/10'"
        >
          <span v-html="tab.icon"></span>
          <span>{{ tab.label }}</span>
          <span
            v-if="tab.badge !== undefined"
            class="px-2 py-0.5 rounded-full text-[10px] font-black"
            :class="activeTab === tab.id ? 'bg-slate-900 text-white' : 'bg-white/15 text-white'"
          >
            {{ tab.badge }}
          </span>
        </button>
      </div>
    </div>

    <!-- ===================================================================== -->
    <!-- TAB 1: COMMONLY USED MATERIALS (SEPARATED BY FGMU & LEAU)             -->
    <!-- ===================================================================== -->
    <div v-if="activeTab === 'materials'" class="space-y-6">
      <!-- Toolbar & Unit Filters -->
      <div class="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <!-- Sub-Unit Segmentation Pills -->
        <div class="flex items-center gap-2 flex-wrap">
          <button
            @click="selectedUnit = 'ALL'"
            class="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer min-h-[40px] flex items-center gap-2"
            :class="selectedUnit === 'ALL'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            <span>All Units</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-full" :class="selectedUnit === 'ALL' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'">
              {{ operationsStore.materials.length }}
            </span>
          </button>

          <button
            @click="selectedUnit = 'FGMU'"
            class="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer min-h-[40px] flex items-center gap-2 border"
            :class="selectedUnit === 'FGMU'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-blue-50/70 text-blue-700 border-blue-200 hover:bg-blue-100/70'"
          >
            <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span>FGMU Facilities</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-full" :class="selectedUnit === 'FGMU' ? 'bg-white/20 text-white' : 'bg-blue-200 text-blue-800'">
              {{ operationsStore.fgmuMaterials.length }}
            </span>
          </button>

          <button
            @click="selectedUnit = 'LEAU'"
            class="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer min-h-[40px] flex items-center gap-2 border"
            :class="selectedUnit === 'LEAU'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-emerald-50/70 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70'"
          >
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>LEAU Landscaping</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-full" :class="selectedUnit === 'LEAU' ? 'bg-white/20 text-white' : 'bg-emerald-200 text-emerald-800'">
              {{ operationsStore.leauMaterials.length }}
            </span>
          </button>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-2.5">
          <button
            @click="openAddMaterialModal"
            class="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer min-h-[40px]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Material</span>
          </button>
        </div>
      </div>

      <!-- Filters & Search Bar -->
      <div class="relative">
        <input
          v-model="materialSearch"
          type="text"
          placeholder="Search material description..."
          class="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 shadow-xs transition-all"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          v-if="materialSearch"
          @click="materialSearch = ''"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Materials Data Table -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <th class="py-3.5 px-4 w-12 text-center">#</th>
                <th class="py-3.5 px-4">Material / Supply Name</th>
                <th class="py-3.5 px-4 w-28 text-center">Sub-Unit</th>
                <th class="py-3.5 px-4 w-24 text-center">Unit</th>
                <th class="py-3.5 px-4 w-32 text-right">Default Price</th>
                <th class="py-3.5 px-4 w-24 text-center">Status</th>
                <th class="py-3.5 px-4 w-24 text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="filteredMaterials.length === 0">
                <td colspan="7" class="py-12 text-center text-slate-400">
                  <div class="flex flex-col items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p class="font-bold text-sm text-slate-600">No materials match your filter criteria.</p>
                    <p class="text-xs text-slate-400">Try adjusting your search keyword.</p>
                  </div>
                </td>
              </tr>
              <tr
                v-for="(item, idx) in filteredMaterials"
                :key="item.id || item.name"
                class="hover:bg-slate-50/80 transition-colors group"
              >
                <td class="py-3 px-4 text-center font-bold text-slate-400 tabular-nums">
                  {{ idx + 1 }}
                </td>
                <td class="py-3 px-4">
                  <div class="font-black text-slate-900 text-xs sm:text-sm">
                    {{ item.name }}
                  </div>
                </td>
                <td class="py-3 px-4 text-center">
                  <span
                    class="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 border"
                    :class="item.unit_code === 'FGMU'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="item.unit_code === 'FGMU' ? 'bg-blue-500' : 'bg-emerald-500'"></span>
                    {{ item.unit_code }}
                  </span>
                </td>
                <td class="py-3 px-4 text-center font-bold text-slate-600">
                  {{ item.unit || 'pcs' }}
                </td>
                <td class="py-3 px-4 text-right font-black text-slate-800 tabular-nums">
                  ₱{{ Number(item.default_price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                </td>
                <td class="py-3 px-4 text-center">
                  <span
                    class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
                    :class="item.is_active !== 0
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-500'"
                  >
                    {{ item.is_active !== 0 ? 'Active' : 'Disabled' }}
                  </span>
                </td>
                <td class="py-3 px-4 text-center">
                  <div class="flex items-center justify-center gap-1">
                    <button
                      @click="openEditMaterialModal(item)"
                      title="Edit Material"
                      class="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      @click="handleDeleteMaterial(item)"
                      title="Delete Material"
                      class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    </div>

    <!-- ===================================================================== -->
    <!-- TAB 2: SPECIAL NON-WORKING HOLIDAY DATES                              -->
    <!-- ===================================================================== -->
    <div v-if="activeTab === 'holidays'" class="space-y-6">
      <!-- Info Callout Banner -->
      <div class="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3.5">
        <div class="p-2 bg-amber-100 rounded-xl text-amber-700 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div class="space-y-1">
          <h4 class="text-xs sm:text-sm font-black text-amber-900 uppercase tracking-wider">
            Institutional Calendar &amp; SLA Counting Impact
          </h4>
          <p class="text-xs text-amber-800 leading-relaxed font-medium">
            Dates listed here are officially recognized non-working days. The system automatically skips weekends and every registered holiday date when computing ticket working durations, EODB 3-7-20 completion timelines, and personnel leave days.
          </p>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 class="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Special Non-Working Holidays Registry
          </h3>
          <p class="text-xs text-slate-500 font-medium">
            {{ operationsStore.holidays.length }} registered holiday dates in effect
          </p>
        </div>

        <button
          @click="openAddHolidayModal"
          class="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer min-h-[40px]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Special Holiday</span>
        </button>
      </div>

      <!-- Holidays Table -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <th class="py-3.5 px-4 w-12 text-center">#</th>
                <th class="py-3.5 px-4 w-36">Holiday Date</th>
                <th class="py-3.5 px-4">Holiday Name &amp; Description</th>
                <th class="py-3.5 px-4 w-36 text-center">Type</th>
                <th class="py-3.5 px-4 w-28 text-center">Recurrence</th>
                <th class="py-3.5 px-4 w-24 text-center">Status</th>
                <th class="py-3.5 px-4 w-24 text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="operationsStore.holidays.length === 0">
                <td colspan="7" class="py-10 text-center text-slate-400 font-bold">
                  No special holidays currently registered. Standard national holidays will remain active.
                </td>
              </tr>
              <tr
                v-for="(h, idx) in operationsStore.holidays"
                :key="h.id || h.holiday_date"
                class="hover:bg-slate-50/80 transition-colors"
              >
                <td class="py-3 px-4 text-center font-bold text-slate-400 tabular-nums">
                  {{ idx + 1 }}
                </td>
                <td class="py-3 px-4 font-black text-slate-900 tabular-nums">
                  {{ formatHolidayDate(h.holiday_date) }}
                </td>
                <td class="py-3 px-4">
                  <div class="font-bold text-slate-900 text-xs sm:text-sm">
                    {{ h.name }}
                  </div>
                  <div v-if="h.notes" class="text-[11px] text-slate-500 mt-0.5">
                    {{ h.notes }}
                  </div>
                </td>
                <td class="py-3 px-4 text-center">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                    {{ formatHolidayType(h.type) }}
                  </span>
                </td>
                <td class="py-3 px-4 text-center">
                  <span
                    class="px-2 py-0.5 rounded-md text-[10px] font-bold"
                    :class="h.is_recurring ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'"
                  >
                    {{ h.is_recurring ? 'Annual (Recurring)' : 'One-time' }}
                  </span>
                </td>
                <td class="py-3 px-4 text-center">
                  <span
                    class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
                    :class="h.is_active !== 0
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-500'"
                  >
                    {{ h.is_active !== 0 ? 'Active' : 'Disabled' }}
                  </span>
                </td>
                <td class="py-3 px-4 text-center">
                  <div class="flex items-center justify-center gap-1">
                    <button
                      @click="openEditHolidayModal(h)"
                      title="Edit Holiday"
                      class="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      @click="handleDeleteHoliday(h)"
                      title="Delete Holiday"
                      class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    </div>

    <!-- ===================================================================== -->
    <!-- TAB 3: WORKING HOURS CONFIGURATION                                   -->
    <!-- ===================================================================== -->
    <div v-if="activeTab === 'hours'" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Settings Form Card -->
        <div class="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <div class="border-b border-slate-100 pb-4">
            <h3 class="text-lg font-black text-slate-900 tracking-tight">
              Operational Shift &amp; Working Hours Calibration
            </h3>
            <p class="text-xs text-slate-500 font-medium mt-0.5">
              Defines the daily operating hours during which tickets accumulate active turnaround duration.
            </p>
          </div>

          <form @submit.prevent="handleSaveWorkingHours" class="space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Start Time -->
              <div class="space-y-1.5">
                <label class="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  Work Start Time
                </label>
                <input
                  v-model="hoursForm.work_start_time"
                  type="time"
                  required
                  class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 min-h-[44px]"
                />
                <span class="text-[11px] text-slate-400 font-medium">Standard start: 08:00 AM</span>
              </div>

              <!-- End Time -->
              <div class="space-y-1.5">
                <label class="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  Work End Time
                </label>
                <input
                  v-model="hoursForm.work_end_time"
                  type="time"
                  required
                  class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 min-h-[44px]"
                />
                <span class="text-[11px] text-slate-400 font-medium">Standard dismissal: 05:00 PM (17:00)</span>
              </div>
            </div>

            <!-- Lunch Break Window -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div class="space-y-1.5">
                <label class="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  Lunch Break Starts
                </label>
                <input
                  v-model="hoursForm.lunch_start_time"
                  type="time"
                  required
                  class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 min-h-[44px]"
                />
                <span class="text-[11px] text-slate-400 font-medium">Default: 12:00 PM</span>
              </div>

              <div class="space-y-1.5">
                <label class="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  Lunch Break Ends
                </label>
                <input
                  v-model="hoursForm.lunch_end_time"
                  type="time"
                  required
                  class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 min-h-[44px]"
                />
                <span class="text-[11px] text-slate-400 font-medium">Default: 01:00 PM (13:00)</span>
              </div>
            </div>

            <!-- Standard Daily Hours -->
            <div class="pt-2 border-t border-slate-100 space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  Net Working Hours / Day
                </label>
                <span class="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Calculated: {{ computedNetDailyHours }} hrs/day
                </span>
              </div>
              <input
                v-model.number="hoursForm.standard_daily_hours"
                type="number"
                step="0.5"
                min="1"
                max="24"
                required
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 min-h-[44px]"
              />
              <span class="text-[11px] text-slate-400 font-medium">
                Civil Service Standard is 8.0 hours (8am-5pm with 1 hour lunch deducted).
              </span>
            </div>

            <!-- Save Button -->
            <div class="pt-4 flex items-center justify-end">
              <button
                type="submit"
                :disabled="operationsStore.isSaving"
                class="px-6 py-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50 min-h-[44px]"
              >
                <svg v-if="operationsStore.isSaving" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ operationsStore.isSaving ? 'Saving Parameters...' : 'Save Working Hours' }}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Live Turnaround Simulator Card -->
        <div class="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl sm:rounded-3xl border border-slate-700/80 shadow-md p-6 sm:p-8 text-white space-y-6">
          <div class="space-y-1">
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
              Live Duration Simulator
            </span>
            <h3 class="text-lg font-black tracking-tight text-white mt-2">
              SLA Turnaround Engine Preview
            </h3>
            <p class="text-xs text-slate-300 font-medium">
              Test how two timestamps evaluate under your operational hours and active holidays:
            </p>
          </div>

          <div class="space-y-4">
            <div class="space-y-1.5">
              <label class="block text-[11px] font-black uppercase tracking-wider text-slate-400">
                Sample Start Date &amp; Time
              </label>
              <input
                v-model="simStart"
                type="datetime-local"
                class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
            </div>

            <div class="space-y-1.5">
              <label class="block text-[11px] font-black uppercase tracking-wider text-slate-400">
                Sample End Date &amp; Time
              </label>
              <input
                v-model="simEnd"
                type="datetime-local"
                class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
            </div>

            <div class="p-4 rounded-2xl bg-white/[0.06] border border-white/15 space-y-2">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                Calculated Working Duration
              </span>
              <div class="text-2xl sm:text-3xl font-black text-emerald-300 tabular-nums">
                {{ simResult.formatted }}
              </div>
              <div class="flex items-center gap-2 text-xs text-slate-300 pt-1 border-t border-white/10">
                <span>Net Total: <strong>{{ simResult.totalHours }} hrs</strong></span>
                <span>•</span>
                <span>Days: <strong>{{ simResult.days }}d</strong></span>
                <span>•</span>
                <span>Hours: <strong>{{ simResult.hours }}h</strong></span>
              </div>
            </div>

            <p class="text-[11px] text-slate-400 leading-relaxed italic">
              ✓ Non-working weekend hours are excluded.<br />
              ✓ Registered special holidays and fixed holidays are excluded.<br />
              ✓ Daily lunch break window is automatically deducted.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ===================================================================== -->
    <!-- MATERIAL MODAL (ADD / EDIT)                                           -->
    <!-- ===================================================================== -->
    <div
      v-if="showMaterialModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
    >
      <div class="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 class="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {{ editingMaterial ? 'Edit Catalog Material' : 'Add New Material to Catalog' }}
            </h3>
            <p class="text-xs text-slate-500 font-medium">
              Configure standardized supply details and sub-unit assignment.
            </p>
          </div>
          <button
            @click="showMaterialModal = false"
            class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSaveMaterialSubmit" class="p-6 space-y-4">
          <!-- Sub-Unit Selection -->
          <div class="space-y-1.5">
            <label class="block text-xs font-black text-slate-800 uppercase tracking-wider">
              Responsible Sub-Unit
            </label>
            <div class="grid grid-cols-2 gap-3">
              <label
                class="p-3 rounded-xl border-2 flex items-center gap-2.5 cursor-pointer transition-all"
                :class="materialForm.unit_code === 'FGMU'
                  ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-black'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold'"
              >
                <input type="radio" v-model="materialForm.unit_code" value="FGMU" class="sr-only" />
                <span class="w-2.5 h-2.5 rounded-full" :class="materialForm.unit_code === 'FGMU' ? 'bg-blue-600' : 'bg-slate-300'"></span>
                <span>FGMU Facilities</span>
              </label>

              <label
                class="p-3 rounded-xl border-2 flex items-center gap-2.5 cursor-pointer transition-all"
                :class="materialForm.unit_code === 'LEAU'
                  ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-black'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold'"
              >
                <input type="radio" v-model="materialForm.unit_code" value="LEAU" class="sr-only" />
                <span class="w-2.5 h-2.5 rounded-full" :class="materialForm.unit_code === 'LEAU' ? 'bg-emerald-600' : 'bg-slate-300'"></span>
                <span>LEAU Landscaping</span>
              </label>
            </div>
          </div>


          <!-- Name -->
          <div class="space-y-1.5">
            <label class="block text-xs font-black text-slate-800 uppercase tracking-wider">
              Material / Item Description
            </label>
            <input
              v-model="materialForm.name"
              type="text"
              required
              placeholder="e.g., PVC Pipe 1/2 inch, LED Bulb 18W, Carabao Grass Sod"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 min-h-[44px]"
            />
          </div>

          <!-- Unit of Measurement & Default Price -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="block text-xs font-black text-slate-800 uppercase tracking-wider">
                Unit of Measure
              </label>
              <select
                v-model="materialForm.unit"
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
                Default Price (₱)
              </label>
              <input
                v-model.number="materialForm.default_price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 text-right focus:outline-none focus:ring-2 focus:ring-slate-900 min-h-[44px]"
              />
            </div>
          </div>

          <!-- Active Toggle -->
          <div class="flex items-center gap-3 pt-2">
            <input
              id="material-active"
              v-model="materialForm.is_active"
              type="checkbox"
              class="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500 cursor-pointer"
            />
            <label for="material-active" class="text-xs font-bold text-slate-700 cursor-pointer">
              Active in material pre-assessment &amp; update dropdowns
            </label>
          </div>

          <!-- Modal Actions -->
          <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              @click="showMaterialModal = false"
              class="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer min-h-[40px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="operationsStore.isSaving"
              class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50 min-h-[40px]"
            >
              {{ operationsStore.isSaving ? 'Saving...' : (editingMaterial ? 'Update Material' : 'Save Material') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ===================================================================== -->
    <!-- HOLIDAY MODAL (ADD / EDIT)                                            -->
    <!-- ===================================================================== -->
    <div
      v-if="showHolidayModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
    >
      <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 class="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {{ editingHoliday ? 'Edit Special Holiday' : 'Add Special Non-Working Holiday' }}
            </h3>
            <p class="text-xs text-slate-500 font-medium">
              Registered dates will be bypassed during ticket SLA &amp; duration calculations.
            </p>
          </div>
          <button
            @click="showHolidayModal = false"
            class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSaveHolidaySubmit" class="p-6 space-y-4">
          <!-- Holiday Date -->
          <div class="space-y-1.5">
            <label class="block text-xs font-black text-slate-800 uppercase tracking-wider">
              Holiday Date
            </label>
            <input
              v-model="holidayForm.holiday_date"
              type="date"
              required
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 min-h-[44px]"
            />
          </div>

          <!-- Name -->
          <div class="space-y-1.5">
            <label class="block text-xs font-black text-slate-800 uppercase tracking-wider">
              Holiday Name / Proclamation
            </label>
            <input
              v-model="holidayForm.name"
              type="text"
              required
              placeholder="e.g., All Souls' Day, University Charter Day, Typhoon Suspension"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 min-h-[44px]"
            />
          </div>

          <!-- Holiday Type -->
          <div class="space-y-1.5">
            <label class="block text-xs font-black text-slate-800 uppercase tracking-wider">
              Classification Type
            </label>
            <select
              v-model="holidayForm.type"
              required
              class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 min-h-[44px] cursor-pointer"
            >
              <option value="special_non_working">Special Non-Working Holiday</option>
              <option value="regular">Regular Statutory Holiday</option>
              <option value="local_suspension">Local / Executive Suspension</option>
              <option value="institutional">University / Institutional Holiday</option>
            </select>
          </div>

          <!-- Notes -->
          <div class="space-y-1.5">
            <label class="block text-xs font-black text-slate-800 uppercase tracking-wider">
              Remarks / Executive Notes (Optional)
            </label>
            <textarea
              v-model="holidayForm.notes"
              rows="2"
              placeholder="e.g., Malacañang Proclamation / Executive Memorandum"
              class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            ></textarea>
          </div>

          <!-- Recurrence & Active Checkboxes -->
          <div class="space-y-2 pt-1">
            <label class="flex items-center gap-2.5 cursor-pointer">
              <input
                v-model="holidayForm.is_recurring"
                type="checkbox"
                class="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500 cursor-pointer"
              />
              <span class="text-xs font-bold text-slate-700">Recurs annually on this month and day</span>
            </label>

            <label class="flex items-center gap-2.5 cursor-pointer">
              <input
                v-model="holidayForm.is_active"
                type="checkbox"
                class="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500 cursor-pointer"
              />
              <span class="text-xs font-bold text-slate-700">Active (applies to calendar calculations)</span>
            </label>
          </div>

          <!-- Actions -->
          <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              @click="showHolidayModal = false"
              class="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer min-h-[40px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="operationsStore.isSaving"
              class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50 min-h-[40px]"
            >
              {{ operationsStore.isSaving ? 'Saving...' : (editingHoliday ? 'Update Holiday' : 'Save Holiday') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useOperationsHubStore } from '@/stores/operationsHub';
import { calculateWorkingHoursElapsed, formatDateToYmd } from '@/utils/workCalendar';
import { toast } from 'vue3-toastify';
import Swal from 'sweetalert2';

const operationsStore = useOperationsHubStore();

// Navigation Tabs
const activeTab = ref('materials');
const navigationTabs = computed(() => [
  {
    id: 'materials',
    label: 'Common Materials Library',
    badge: operationsStore.materials.length,
    icon: `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>`,
  },
  {
    id: 'holidays',
    label: 'Special Non-Working Holidays',
    badge: operationsStore.holidays.length,
    icon: `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`,
  },
  {
    id: 'hours',
    label: 'Operating Working Hours & SLA',
    icon: `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
  },
]);

// -----------------------------------------------------------------------------
// Materials Tab State & Logic
// -----------------------------------------------------------------------------
const selectedUnit = ref('ALL');
const materialSearch = ref('');

const showMaterialModal = ref(false);
const editingMaterial = ref(null);
const materialForm = ref({
  unit_code: 'FGMU',
  category: 'General',
  name: '',
  unit: 'pcs',
  default_price: 0,
  is_active: true,
});

const filteredMaterials = computed(() => {
  let list = operationsStore.materialsByUnit(selectedUnit.value);

  if (materialSearch.value) {
    const q = materialSearch.value.toLowerCase().trim();
    list = list.filter(m =>
      (m.name || '').toLowerCase().includes(q)
    );
  }

  return list;
});

const openAddMaterialModal = () => {
  editingMaterial.value = null;
  materialForm.value = {
    unit_code: selectedUnit.value === 'LEAU' ? 'LEAU' : 'FGMU',
    category: 'General',
    name: '',
    unit: 'pcs',
    default_price: 0,
    is_active: true,
  };
  showMaterialModal.value = true;
};

const openEditMaterialModal = (item) => {
  editingMaterial.value = item;
  materialForm.value = {
    unit_code: item.unit_code || 'FGMU',
    category: item.category || 'General',
    name: item.name || '',
    unit: item.unit || 'pcs',
    default_price: item.default_price || 0,
    is_active: item.is_active !== 0,
  };
  showMaterialModal.value = true;
};

const handleSaveMaterialSubmit = async () => {
  const payload = {
    unit_code: materialForm.value.unit_code,
    category: materialForm.value.category?.trim() || 'General',
    name: materialForm.value.name.trim(),
    unit: materialForm.value.unit,
    default_price: Number(materialForm.value.default_price) || 0,
    is_active: materialForm.value.is_active ? 1 : 0,
  };

  if (!payload.name) {
    toast.error('Material name is required.');
    return;
  }

  if (editingMaterial.value?.id) {
    const res = await operationsStore.updateMaterial(editingMaterial.value.id, payload);
    if (res.success) {
      toast.success(res.message || 'Material updated successfully.');
      showMaterialModal.value = false;
    } else {
      toast.error(res.message || 'Failed to update material.');
    }
  } else {
    const res = await operationsStore.saveMaterial(payload);
    if (res.success) {
      toast.success(res.message || 'Material added to catalog.');
      showMaterialModal.value = false;
    } else {
      toast.error(res.message || 'Failed to save material.');
    }
  }
};

const handleDeleteMaterial = async (item) => {
  const result = await Swal.fire({
    title: 'Delete Material?',
    html: `Are you sure you want to remove <strong>${item.name}</strong> (${item.unit_code}) from the standard catalog?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0f172a',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Yes, remove',
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
      // Local removal if mock/baseline
      operationsStore.materials = operationsStore.materials.filter(m => m.name !== item.name);
      toast.success(`Removed ${item.name}`);
    }
  }
};

// -----------------------------------------------------------------------------
// Holidays Tab State & Logic
// -----------------------------------------------------------------------------
const showHolidayModal = ref(false);
const editingHoliday = ref(null);
const holidayForm = ref({
  holiday_date: '',
  name: '',
  type: 'special_non_working',
  is_recurring: false,
  is_active: true,
  notes: '',
});

const formatHolidayDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    weekday: 'short',
  });
};

const formatHolidayType = (type) => {
  switch (type) {
    case 'special_non_working': return 'Special Non-Working';
    case 'regular': return 'Regular Holiday';
    case 'local_suspension': return 'Executive Suspension';
    case 'institutional': return 'University Holiday';
    default: return type || 'Special Non-Working';
  }
};

const openAddHolidayModal = () => {
  editingHoliday.value = null;
  const today = formatDateToYmd(new Date());
  holidayForm.value = {
    holiday_date: today,
    name: '',
    type: 'special_non_working',
    is_recurring: false,
    is_active: true,
    notes: '',
  };
  showHolidayModal.value = true;
};

const openEditHolidayModal = (h) => {
  editingHoliday.value = h;
  holidayForm.value = {
    holiday_date: h.holiday_date,
    name: h.name,
    type: h.type || 'special_non_working',
    is_recurring: !!h.is_recurring,
    is_active: h.is_active !== 0,
    notes: h.notes || '',
  };
  showHolidayModal.value = true;
};

const handleSaveHolidaySubmit = async () => {
  const payload = {
    holiday_date: holidayForm.value.holiday_date,
    name: holidayForm.value.name.trim(),
    type: holidayForm.value.type,
    is_recurring: holidayForm.value.is_recurring ? 1 : 0,
    is_active: holidayForm.value.is_active ? 1 : 0,
    notes: holidayForm.value.notes.trim(),
  };

  if (!payload.holiday_date || !payload.name) {
    toast.error('Date and holiday name are required.');
    return;
  }

  if (editingHoliday.value?.id) {
    const res = await operationsStore.updateHoliday(editingHoliday.value.id, payload);
    if (res.success) {
      toast.success(res.message || 'Holiday updated successfully.');
      showHolidayModal.value = false;
    } else {
      toast.error(res.message || 'Failed to update holiday.');
    }
  } else {
    const res = await operationsStore.saveHoliday(payload);
    if (res.success) {
      toast.success(res.message || 'Special holiday registered.');
      showHolidayModal.value = false;
    } else {
      toast.error(res.message || 'Failed to register holiday.');
    }
  }
};

const handleDeleteHoliday = async (h) => {
  const result = await Swal.fire({
    title: 'Delete Holiday?',
    html: `Are you sure you want to remove <strong>${h.name}</strong> (${h.holiday_date}) from holiday duration exclusions?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0f172a',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Yes, delete',
    cancelButtonText: 'Cancel',
  });

  if (result.isConfirmed) {
    if (h.id) {
      const res = await operationsStore.deleteHoliday(h.id);
      if (res.success) {
        toast.success(res.message || 'Holiday deleted.');
      } else {
        toast.error(res.message || 'Failed to delete.');
      }
    } else {
      operationsStore.holidays = operationsStore.holidays.filter(item => item.holiday_date !== h.holiday_date);
      toast.success(`Removed holiday.`);
    }
  }
};

// -----------------------------------------------------------------------------
// Working Hours Tab State & Logic
// -----------------------------------------------------------------------------
const hoursForm = ref({
  work_start_time: '08:00',
  work_end_time: '17:00',
  lunch_start_time: '12:00',
  lunch_end_time: '13:00',
  standard_daily_hours: 8.0,
});

const computedNetDailyHours = computed(() => {
  try {
    const [sh, sm] = (hoursForm.value.work_start_time || '08:00').split(':').map(Number);
    const [eh, em] = (hoursForm.value.work_end_time || '17:00').split(':').map(Number);
    const [lsh, lsm] = (hoursForm.value.lunch_start_time || '12:00').split(':').map(Number);
    const [leh, lem] = (hoursForm.value.lunch_end_time || '13:00').split(':').map(Number);

    const totalWorkMinutes = (eh * 60 + em) - (sh * 60 + sm);
    const lunchMinutes = Math.max(0, (leh * 60 + lem) - (lsh * 60 + lsm));
    const netMinutes = Math.max(0, totalWorkMinutes - lunchMinutes);
    return Math.round((netMinutes / 60) * 10) / 10;
  } catch {
    return 8.0;
  }
});

const handleSaveWorkingHours = async () => {
  const payload = {
    work_start_time: hoursForm.value.work_start_time,
    work_end_time: hoursForm.value.work_end_time,
    lunch_start_time: hoursForm.value.lunch_start_time,
    lunch_end_time: hoursForm.value.lunch_end_time,
    standard_daily_hours: Number(hoursForm.value.standard_daily_hours) || 8.0,
  };

  const res = await operationsStore.saveWorkingHours(payload);
  if (res.success) {
    toast.success('Working hours and SLA calendar parameters successfully saved!');
  } else {
    toast.error(res.message || 'Failed to save working hours.');
  }
};

// -----------------------------------------------------------------------------
// Live Simulator State & Calculation
// -----------------------------------------------------------------------------
const now = new Date();
const simStart = ref(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0).toISOString().slice(0, 16));
const simEnd = ref(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 30).toISOString().slice(0, 16));

const simResult = computed(() => {
  if (!simStart.value || !simEnd.value) {
    return { formatted: '0 min', totalHours: 0, days: 0, hours: 0, minutes: 0 };
  }
  return calculateWorkingHoursElapsed(simStart.value, simEnd.value, 0);
});

onMounted(async () => {
  await operationsStore.initOperationsHub();
  hoursForm.value = { ...operationsStore.workingHours };
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
