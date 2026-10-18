<template>
  <MainLayout>
    <template #sidebar-links>
      <DirectorSidebar />
    </template>

    <template #header-title>
      <div class="flex items-center gap-2.5 min-w-0">
        <span class="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
          Executive Portal
        </span>
        <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
          Special Non-Working Holidays
        </h2>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-6 sm:space-y-8 animate-fade-in pb-16">
        <!-- Hero Banner Header -->
        <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-amber-950 text-white shadow-xl border border-amber-900/40 relative overflow-hidden">
          <!-- Background Ambient Glow -->
          <div class="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div class="space-y-2.5 max-w-2xl">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-widest border border-amber-400/30">
                  Institutional Calendar
                </span>
                <span class="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-wider border border-white/10">
                  Working Duration Calculation
                </span>
              </div>
              <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Special Non-Working Holidays Registry
              </h1>
              <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Calibrate official national holidays, regional Baguio/Benguet declarations, and Benguet State University executive suspensions. Dates registered here are automatically excluded from ticket working duration calculations.
              </p>
            </div>

            <!-- Stats Counters -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
              <div class="p-3.5 rounded-2xl bg-white/[0.07] border border-white/10 text-center backdrop-blur-xs">
                <span class="text-xl sm:text-2xl font-black text-white tabular-nums block">
                  {{ operationsStore.holidays.length }}
                </span>
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5 block">
                  Registered Dates
                </span>
              </div>

              <div class="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-400/20 text-center backdrop-blur-xs">
                <span class="text-xl sm:text-2xl font-black text-blue-300 tabular-nums block">
                  {{ recurringCount }}
                </span>
                <span class="text-[10px] font-bold uppercase tracking-wider text-blue-200/70 mt-0.5 block">
                  Annual Recurring
                </span>
              </div>

              <div class="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-center backdrop-blur-xs">
                <span class="text-xl sm:text-2xl font-black text-amber-300 tabular-nums block">
                  {{ oneTimeCount }}
                </span>
                <span class="text-[10px] font-bold uppercase tracking-wider text-amber-200/70 mt-0.5 block">
                  One-Time Dates
                </span>
              </div>

              <div class="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 text-center backdrop-blur-xs">
                <span class="text-xl sm:text-2xl font-black text-emerald-300 tabular-nums block">
                  {{ activeHolidaysCount }}
                </span>
                <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-200/70 mt-0.5 block">
                  Active in Calculations
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Working Duration Guidance Card -->
        <div class="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3.5">
          <div class="p-2.5 bg-amber-100 rounded-xl text-amber-800 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="space-y-1">
            <h4 class="text-xs sm:text-sm font-black text-amber-900 uppercase tracking-wider">
              Working Days &amp; Duration Calculation Guidelines
            </h4>
            <p class="text-xs text-amber-800 leading-relaxed font-medium">
              Registered non-working dates and standard weekend days are automatically discounted from ticket elapsed time. This ensures turnaround duration reflects purely actual operational working hours.
            </p>
          </div>
        </div>

        <!-- Action Bar: Search, Type Filters, and Add Button -->
        <div class="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <!-- Filters -->
          <div class="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-3">
            <!-- Search Keyword -->
            <div class="sm:col-span-7 relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search holiday name, proclamation, or notes..."
                class="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 min-h-[44px]"
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

            <!-- Type Filter -->
            <div class="sm:col-span-5 relative">
              <select
                v-model="selectedType"
                class="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer min-h-[44px]"
              >
                <option value="">All Classification Types</option>
                <option value="special_non_working">Special Non-Working Holiday</option>
                <option value="regular">Regular Statutory Holiday</option>
                <option value="local_suspension">Local / Executive Suspension</option>
                <option value="institutional">University / Institutional Holiday</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Add Button -->
          <div class="flex items-center gap-2.5 shrink-0">
            <button
              @click="openAddModal"
              class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer min-h-[44px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Special Holiday</span>
            </button>
          </div>
        </div>

        <!-- Holidays Table (Desktop) -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden hidden md:block">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <th class="py-3.5 px-4 w-12 text-center">#</th>
                  <th class="py-3.5 px-4 w-48">Holiday Date</th>
                  <th class="py-3.5 px-4">Holiday Name &amp; Executive Proclamation</th>
                  <th class="py-3.5 px-4 w-44 text-center">Classification</th>
                  <th class="py-3.5 px-4 w-36 text-center">Recurrence</th>
                  <th class="py-3.5 px-4 w-28 text-center">Calendar Status</th>
                  <th class="py-3.5 px-4 w-28 text-center">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-if="filteredHolidays.length === 0">
                  <td colspan="7" class="py-14 text-center text-slate-400">
                    <div class="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p class="font-bold text-sm text-slate-700">No holiday records match your criteria.</p>
                      <p class="text-xs text-slate-400">Add a new special holiday above or adjust your search term.</p>
                    </div>
                  </td>
                </tr>

                <tr
                  v-for="(h, idx) in paginatedHolidays"
                  :key="h.id || h.holiday_date"
                  class="hover:bg-slate-50/80 transition-colors group"
                >
                  <td class="py-3.5 px-4 text-center font-bold text-slate-400 tabular-nums">
                    {{ (currentPage - 1) * perPage + idx + 1 }}
                  </td>
                  <td class="py-3.5 px-4">
                    <div class="font-black text-slate-900 tabular-nums text-xs sm:text-sm">
                      {{ formatHolidayDate(h.holiday_date) }}
                    </div>
                    <div class="text-[11px] text-slate-400 font-medium">
                      {{ formatWeekday(h.holiday_date) }}
                    </div>
                  </td>
                  <td class="py-3.5 px-4">
                    <div class="font-black text-slate-900 text-xs sm:text-sm">
                      {{ h.name }}
                    </div>
                    <div v-if="h.notes" class="text-[11px] text-slate-500 mt-0.5 leading-snug font-medium">
                      {{ h.notes }}
                    </div>
                  </td>
                  <td class="py-3.5 px-4 text-center">
                    <span
                      class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-block border"
                      :class="getTypeBadgeClass(h.type)"
                    >
                      {{ formatHolidayType(h.type) }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-center">
                    <span
                      class="px-2.5 py-1 rounded-md text-[10px] font-bold inline-flex items-center gap-1.5"
                      :class="h.is_recurring ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-600'"
                    >
                      <svg v-if="h.is_recurring" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {{ h.is_recurring ? 'Annual Recurring' : 'One-time Date' }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-center">
                    <span
                      class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5"
                      :class="h.is_active !== 0 && h.is_active !== false
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-500'"
                    >
                      <span class="w-1.5 h-1.5 rounded-full" :class="h.is_active !== 0 && h.is_active !== false ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                      {{ h.is_active !== 0 && h.is_active !== false ? 'Active' : 'Disabled' }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-center">
                    <div class="flex items-center justify-center gap-1">
                      <button
                        @click="openEditModal(h)"
                        title="Edit Holiday"
                        class="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        @click="handleDeleteHoliday(h)"
                        title="Delete Holiday"
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

        <!-- Holidays Mobile Cards -->
        <div class="space-y-3 md:hidden">
          <div v-if="filteredHolidays.length === 0" class="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            <p class="font-bold text-sm text-slate-700">No holidays found.</p>
            <p class="text-xs text-slate-400 mt-1">Add a new special holiday above.</p>
          </div>

          <div
            v-for="(h, idx) in paginatedHolidays"
            :key="h.id || h.holiday_date"
            class="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                  #{{ (currentPage - 1) * perPage + idx + 1 }} • {{ formatHolidayDate(h.holiday_date) }} • {{ formatWeekday(h.holiday_date) }}
                </span>
                <h4 class="font-black text-sm text-slate-900 mt-0.5">
                  {{ h.name }}
                </h4>
                <p v-if="h.notes" class="text-xs text-slate-500 mt-1 font-medium">
                  {{ h.notes }}
                </p>
              </div>

              <span
                class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0"
                :class="h.is_active !== 0 && h.is_active !== false
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-500'"
              >
                {{ h.is_active !== 0 && h.is_active !== false ? 'Active' : 'Disabled' }}
              </span>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <div class="flex items-center gap-2">
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border"
                  :class="getTypeBadgeClass(h.type)"
                >
                  {{ formatHolidayType(h.type) }}
                </span>
                <span v-if="h.is_recurring" class="text-[10px] text-blue-600 font-bold">
                  Annual
                </span>
              </div>

              <div class="flex items-center gap-1">
                <button
                  @click="openEditModal(h)"
                  class="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 active:scale-95"
                >
                  Edit
                </button>
                <button
                  @click="handleDeleteHoliday(h)"
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
          v-if="filteredHolidays.length > 0"
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
              </select>
            </div>
            <span class="text-slate-600">
              Showing <strong class="text-slate-900">{{ ((currentPage - 1) * perPage) + 1 }}</strong> to
              <strong class="text-slate-900">{{ Math.min(currentPage * perPage, filteredHolidays.length) }}</strong> of
              <strong class="text-slate-900">{{ filteredHolidays.length }}</strong> registered dates
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
                    ? 'bg-amber-600 text-white shadow-xs'
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

        <!-- Interactive Duration Calculation Simulator -->
        <div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 class="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Live Working Duration Verification
                </h3>
              </div>
              <p class="text-xs text-slate-500 font-medium mt-0.5">
                Test how the current non-working holiday registry actively discounts hours between two dates.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div class="sm:col-span-5 space-y-1.5">
              <label class="block text-xs font-black text-slate-700 uppercase tracking-wider">
                Start Datetime (Ticket Filed)
              </label>
              <input
                v-model="simStart"
                type="datetime-local"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 min-h-[44px]"
              />
            </div>

            <div class="sm:col-span-5 space-y-1.5">
              <label class="block text-xs font-black text-slate-700 uppercase tracking-wider">
                End Datetime (Resolution / Current)
              </label>
              <input
                v-model="simEnd"
                type="datetime-local"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 min-h-[44px]"
              />
            </div>

            <div class="sm:col-span-2">
              <button
                @click="calculateSimResult"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider transition-all min-h-[44px] cursor-pointer"
              >
                Compute Duration
              </button>
            </div>
          </div>

          <!-- Safe Simulator Result Card -->
          <div v-if="simResult" class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="space-y-1">
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Computed Working Turnaround</span>
              <div class="flex items-baseline gap-2 flex-wrap">
                <span class="text-2xl sm:text-3xl font-black text-emerald-600 tabular-nums">
                  {{ simResult.formatted || (simResult.totalHours ? simResult.totalHours + ' hrs' : '0 hrs') }}
                </span>
                <span class="text-xs text-slate-500 font-bold">
                  (Total: {{ Number(simResult.totalHours || 0).toFixed(1) }} working hrs / ≈ {{ (Number(simResult.totalHours || 0) / 8.0).toFixed(2) }} business days)
                </span>
              </div>
              <div class="flex items-center gap-2 text-xs text-slate-500 font-medium pt-1">
                <span>Working Days: <strong class="text-slate-700">{{ simResult.days || 0 }}d</strong></span>
                <span>•</span>
                <span>Net Hours: <strong class="text-slate-700">{{ simResult.hours || 0 }}h {{ simResult.minutes || 0 }}m</strong></span>
                <span v-if="simResult.overtime">• Overtime: <strong class="text-amber-600">+{{ simResult.overtime }}h OT</strong></span>
              </div>
            </div>
            <span class="px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 w-fit shrink-0">
              ✓ Holidays &amp; Weekends Excluded
            </span>
          </div>
        </div>

        <!-- Add / Edit Holiday Modal -->
        <div
          v-if="showModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
        >
          <div class="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
            <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 class="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {{ editingHoliday ? 'Edit Special Holiday' : 'Add Special Non-Working Holiday' }}
                </h3>
                <p class="text-xs text-slate-500 font-medium">
                  Registered dates will be automatically excluded during ticket working duration calculations.
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
                  placeholder="e.g., Benguet Foundation Day, Baguio Charter Day, Typhoon Suspension"
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

              <!-- Notes / Proclamation Description -->
              <div class="space-y-1.5">
                <label class="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  Remarks / Proclamation Reference (Optional)
                </label>
                <textarea
                  v-model="holidayForm.notes"
                  rows="2"
                  placeholder="e.g., Presidential Proclamation No. 729 / Executive Memorandum No. 14"
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
                  <span class="text-xs font-bold text-slate-700">Active in working duration calculations</span>
                </label>
              </div>

              <!-- Actions -->
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
                  {{ operationsStore.isSaving ? 'Saving...' : (editingHoliday ? 'Update Holiday' : 'Save Holiday') }}
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
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import DirectorSidebar from './DirectorSidebar.vue';
import { useOperationsHubStore } from '@/stores/operationsHub';
import { calculateWorkingHoursElapsed, formatDateToYmd } from '@/utils/workCalendar';
import { toast } from 'vue3-toastify';
import Swal from 'sweetalert2';

const operationsStore = useOperationsHubStore();

// Summary Counters
const recurringCount = computed(() => {
  return (operationsStore.holidays || []).filter(h => !!h.is_recurring).length;
});

const oneTimeCount = computed(() => {
  return (operationsStore.holidays || []).filter(h => !h.is_recurring).length;
});

const activeHolidaysCount = computed(() => {
  return (operationsStore.holidays || []).filter(h => h.is_active !== 0 && h.is_active !== false).length;
});

// Search & Filtering
const searchQuery = ref('');
const selectedType = ref('');

const filteredHolidays = computed(() => {
  let list = operationsStore.holidays || [];

  if (selectedType.value) {
    list = list.filter(h => h.type === selectedType.value);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(h =>
      (h.name || '').toLowerCase().includes(q) ||
      (h.notes || '').toLowerCase().includes(q) ||
      (h.holiday_date || '').toLowerCase().includes(q)
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
  return Math.ceil(filteredHolidays.value.length / perPage.value) || 1;
});

const paginatedHolidays = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return filteredHolidays.value.slice(start, start + perPage.value);
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

watch(searchQuery, () => {
  currentPage.value = 1;
});

watch(selectedType, () => {
  currentPage.value = 1;
});

watch(totalPages, (newTotal) => {
  if (currentPage.value > newTotal) {
    currentPage.value = Math.max(1, newTotal);
  }
});

// Formatters
const formatHolidayDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatWeekday = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { weekday: 'long' });
};

const formatHolidayType = (type) => {
  switch (type) {
    case 'special_non_working': return 'Special Non-Working';
    case 'regular': return 'Regular Statutory';
    case 'local_suspension': return 'Executive Suspension';
    case 'institutional': return 'University Holiday';
    default: return type || 'Special Non-Working';
  }
};

const getTypeBadgeClass = (type) => {
  switch (type) {
    case 'special_non_working':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'regular':
      return 'bg-rose-50 text-rose-800 border-rose-200';
    case 'local_suspension':
      return 'bg-purple-50 text-purple-800 border-purple-200';
    case 'institutional':
      return 'bg-blue-50 text-blue-800 border-blue-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

// Modal State & Logic
const showModal = ref(false);
const editingHoliday = ref(null);
const holidayForm = ref({
  holiday_date: '',
  name: '',
  type: 'special_non_working',
  is_recurring: false,
  is_active: true,
  notes: '',
});

const openAddModal = () => {
  editingHoliday.value = null;
  holidayForm.value = {
    holiday_date: formatDateToYmd(new Date()),
    name: '',
    type: 'special_non_working',
    is_recurring: false,
    is_active: true,
    notes: '',
  };
  showModal.value = true;
};

const openEditModal = (h) => {
  editingHoliday.value = h;
  holidayForm.value = {
    holiday_date: h.holiday_date,
    name: h.name,
    type: h.type || 'special_non_working',
    is_recurring: !!h.is_recurring,
    is_active: h.is_active !== 0 && h.is_active !== false,
    notes: h.notes || '',
  };
  showModal.value = true;
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

  if (!payload.holiday_date) {
    toast.error('Holiday date is required.');
    return;
  }
  if (!payload.name) {
    toast.error('Holiday name is required.');
    return;
  }

  if (editingHoliday.value?.id) {
    const res = await operationsStore.updateHoliday(editingHoliday.value.id, payload);
    if (res.success) {
      toast.success(res.message || 'Holiday updated successfully.');
      showModal.value = false;
    } else {
      toast.error(res.message || 'Failed to update holiday.');
    }
  } else {
    const res = await operationsStore.saveHoliday(payload);
    if (res.success) {
      toast.success(res.message || 'Special holiday added to calendar.');
      showModal.value = false;
    } else {
      toast.error(res.message || 'Failed to add holiday.');
    }
  }
};

const handleDeleteHoliday = async (h) => {
  const result = await Swal.fire({
    title: 'Remove Special Holiday?',
    html: `Are you sure you want to remove <strong>${h.name}</strong> (${formatHolidayDate(h.holiday_date)}) from the calendar registry?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e11d48',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Yes, Remove',
    cancelButtonText: 'Cancel',
  });

  if (result.isConfirmed) {
    if (h.id) {
      const res = await operationsStore.deleteHoliday(h.id);
      if (res.success) {
        toast.success(res.message || 'Holiday removed.');
      } else {
        toast.error(res.message || 'Failed to remove holiday.');
      }
    } else {
      operationsStore.holidays = (operationsStore.holidays || []).filter(item => item.holiday_date !== h.holiday_date);
      toast.success(`Removed ${h.name}`);
    }
  }
};

// Simulation state
const simStart = ref('');
const simEnd = ref('');
const simResult = ref(null);

const calculateSimResult = () => {
  if (!simStart.value || !simEnd.value) {
    return;
  }
  try {
    const s = new Date(simStart.value);
    const e = new Date(simEnd.value);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return;
    if (e < s) {
      toast.error('End datetime cannot precede start datetime.');
      return;
    }
    simResult.value = calculateWorkingHoursElapsed(s, e);
  } catch (err) {
    console.warn('Simulation calculation failed:', err);
    simResult.value = null;
  }
};

onMounted(async () => {
  try {
    await operationsStore.initOperationsHub();
  } catch (err) {
    console.warn('Could not initialize operations hub:', err);
  }

  // Set default simulation datetimes: past 3 days to now
  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 72 * 60 * 60 * 1000);
  simStart.value = threeDaysAgo.toISOString().slice(0, 16);
  simEnd.value = now.toISOString().slice(0, 16);
  calculateSimResult();
});
</script>
