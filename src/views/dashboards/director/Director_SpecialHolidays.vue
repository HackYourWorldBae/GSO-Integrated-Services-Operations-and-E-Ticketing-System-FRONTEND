<template>
  <MainLayout>
    <template #sidebar-links>
      <DirectorSidebar />
    </template>

    <template #header-title>
      <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
        Operational Calendar &amp; Schedule
      </h2>
    </template>

    <template #main-content>
      <div class="space-y-6 sm:space-y-7 animate-fade-in pb-16">
        <!-- Hero Banner Header -->
        <div
          data-tour="admin-page-header"
          class="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-amber-950 text-white shadow-xl border border-amber-900/40 relative overflow-hidden"
        >
          <!-- Background Ambient Glow -->
          <div class="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative z-10 max-w-3xl space-y-2.5">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-widest border border-amber-400/30">
                Operations Hub
              </span>
              <span class="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-wider border border-white/10">
                Calendar &amp; Work Continuity
              </span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Calendar &amp; Operational Schedule
            </h1>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Configure non-working holiday declarations, automatic daily continuation of jobs, institutional breaks, and weekend exclusions.
            </p>
          </div>
        </div>

        <!-- Navigation Tab Switcher -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80">
          <div class="flex items-center gap-1.5 flex-1">
            <button
              type="button"
              @click="activeTab = 'holidays'"
              :class="[
                'flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer min-h-[44px]',
                activeTab === 'holidays'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Non-Working Days Registry</span>
              <span
                class="px-2 py-0.5 rounded-full text-[10px] font-black"
                :class="activeTab === 'holidays' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'"
              >
                {{ operationsStore.holidays.length }}
              </span>
            </button>

            <button
              type="button"
              @click="activeTab = 'schedule'"
              :class="[
                'flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer min-h-[44px]',
                activeTab === 'schedule'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Work Schedule &amp; Job Continuity</span>
            </button>
          </div>

          <!-- Quick status indicator in tabs bar -->
          <div class="hidden md:flex items-center gap-2 px-3 text-xs font-semibold text-slate-500">
            <span class="inline-block w-2 h-2 rounded-full" :class="scheduleForm.daily_continuation_enabled ? 'bg-emerald-500' : 'bg-slate-400'"></span>
            <span>Continuation: <strong class="text-slate-800">{{ scheduleForm.daily_continuation_enabled ? 'On' : 'Off' }}</strong></span>
            <span class="text-slate-300">•</span>
            <span>Weekends: <strong class="text-slate-800">{{ scheduleForm.exclude_weekends ? 'Excluded' : 'Included' }}</strong></span>
          </div>
        </div>

        <!-- ================================================================= -->
        <!-- TAB 1: NON-WORKING DAYS REGISTRY                                  -->
        <!-- ================================================================= -->
        <div v-if="activeTab === 'holidays'" class="space-y-6 sm:space-y-7 animate-fade-in">
          <!-- Action Bar: Search, Type Filters, and Add Button -->
          <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <!-- Filters -->
            <div class="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-3">
              <!-- Search Keyword -->
              <div class="sm:col-span-7 relative">
                <input
                  v-model="searchQuery"
                  data-tour="holidays-search-input"
                  type="text"
                  placeholder="Search non-working day name, notes, or date..."
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
                  data-tour="holidays-filter-type"
                  class="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer min-h-[44px]"
                >
                  <option value="">All Non-Working Days</option>
                  <option value="special_non_working">Special Non-Working Day</option>
                  <option value="institutional">University Non-Working Day</option>
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
                data-tour="holidays-btn-add"
                @click="openAddModal"
                class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer min-h-[44px]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Non-Working Day</span>
              </button>
            </div>
          </div>

          <!-- Holidays Table (Desktop) -->
          <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden hidden md:block">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr data-tour="holidays-table" class="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <th class="py-3.5 px-4 w-12 text-center">#</th>
                    <th class="py-3.5 px-4 w-48">Date</th>
                    <th class="py-3.5 px-4">Proclamation / Non-Working Day Name</th>
                    <th class="py-3.5 px-4 w-44 text-center">Classification</th>
                    <th class="py-3.5 px-4 w-36 text-center">Recurrence</th>
                    <th class="py-3.5 px-4 w-28 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-if="filteredHolidays.length === 0">
                    <td colspan="6" class="py-14 text-center text-slate-400">
                      <div class="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p class="font-bold text-sm text-slate-700">No non-working day records match your criteria.</p>
                        <p class="text-xs text-slate-400">Add a new non-working day above or adjust your search term.</p>
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
                      <div class="flex items-center justify-center gap-1">
                        <button
                          @click="openEditModal(h)"
                          title="Edit Non-Working Day"
                          class="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          @click="handleDeleteHoliday(h)"
                          title="Delete Non-Working Day"
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
              <p class="font-bold text-sm text-slate-700">No non-working days found.</p>
              <p class="text-xs text-slate-400 mt-1">Add a new non-working day above.</p>
            </div>

            <div
              v-for="(h, idx) in paginatedHolidays"
              :key="h.id || h.holiday_date"
              class="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="flex-1">
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
        </div>

        <!-- ================================================================= -->
        <!-- TAB 2: WORK SCHEDULE, CONTINUITY & BREAKS EDITOR                  -->
        <!-- ================================================================= -->
        <div v-else-if="activeTab === 'schedule'" class="space-y-6 sm:space-y-7 animate-fade-in">
          <!-- CARD 1: AUTOMATIC DAILY CONTINUATION & SHIFT WINDOW -->
          <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-7 space-y-5">
            <!-- Header -->
            <div class="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-base font-black text-slate-900 tracking-tight">
                    Automatic Daily Continuation
                  </h3>
                  <p class="text-xs text-slate-500 font-medium">
                    Carry forward ongoing multi-day jobs without manual re-dispatch.
                  </p>
                </div>
              </div>

              <span
                class="px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 border shrink-0"
                :class="scheduleForm.daily_continuation_enabled
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="scheduleForm.daily_continuation_enabled ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                {{ scheduleForm.daily_continuation_enabled ? 'Active' : 'Disabled' }}
              </span>
            </div>

            <!-- Master Toggle Switch: Daily Continuation -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
              <div>
                <div class="text-sm font-bold text-slate-900">
                  Enable Multi-Day Continuation
                </div>
                <div class="text-xs text-slate-500 font-medium mt-0.5">
                  Pauses active jobs at evening cutoff and resumes them next work morning.
                </div>
              </div>

              <!-- Centered Toggle Switch Button -->
              <button
                type="button"
                role="switch"
                :aria-checked="scheduleForm.daily_continuation_enabled"
                @click="scheduleForm.daily_continuation_enabled = !scheduleForm.daily_continuation_enabled"
                class="relative inline-flex items-center cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded-full p-1 -m-1"
              >
                <div
                  class="w-11 h-6 rounded-full transition-colors duration-200 ease-in-out relative shrink-0"
                  :class="scheduleForm.daily_continuation_enabled ? 'bg-emerald-600' : 'bg-slate-300'"
                >
                  <span
                    aria-hidden="true"
                    class="absolute top-[2px] left-[2px] inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out"
                    :class="scheduleForm.daily_continuation_enabled ? 'translate-x-5' : 'translate-x-0'"
                  />
                </div>
              </button>
            </div>

            <!-- Continuation & Working Hours Grid (No Text Clutter) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              <!-- Continuation Morning Resume Time -->
              <div class="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5">
                <label class="block text-xs font-bold text-slate-700">
                  Morning Resume Time
                </label>
                <input
                  v-model="scheduleForm.continuation_start_time"
                  type="time"
                  required
                  :disabled="!scheduleForm.daily_continuation_enabled"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-40 disabled:cursor-not-allowed min-h-[40px]"
                />
              </div>

              <!-- Continuation Evening Cutoff Time -->
              <div class="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5">
                <label class="block text-xs font-bold text-slate-700">
                  Evening Cutoff Time
                </label>
                <input
                  v-model="scheduleForm.continuation_cutoff_time"
                  type="time"
                  required
                  :disabled="!scheduleForm.daily_continuation_enabled"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-40 disabled:cursor-not-allowed min-h-[40px]"
                />
              </div>

              <!-- Core Shift Start Time -->
              <div class="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5">
                <label class="block text-xs font-bold text-slate-700">
                  Core Shift Start
                </label>
                <input
                  v-model="scheduleForm.work_start_time"
                  type="time"
                  required
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 min-h-[40px]"
                />
              </div>

              <!-- Core Shift End Time -->
              <div class="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5">
                <label class="block text-xs font-bold text-slate-700">
                  Core Shift End
                </label>
                <input
                  v-model="scheduleForm.work_end_time"
                  type="time"
                  required
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 min-h-[40px]"
                />
              </div>
            </div>

            <!-- Standard Net Daily Hours Field -->
            <div class="p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-between gap-4">
              <div>
                <div class="text-xs font-bold text-slate-800">
                  Standard Daily Shift Hours
                </div>
                <div class="text-xs text-slate-500 font-medium mt-0.5">
                  Net credited working hours per business shift.
                </div>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <input
                  v-model.number="scheduleForm.standard_daily_hours"
                  type="number"
                  step="0.5"
                  min="1"
                  max="24"
                  required
                  class="w-20 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-black text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-slate-900 min-h-[38px]"
                />
                <span class="text-xs font-bold text-slate-600">Hours</span>
              </div>
            </div>
          </div>

          <!-- CARD 2: INSTITUTIONAL TIME BREAKS (TURNAROUND DEDUCTIONS) -->
          <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-7 space-y-5">
            <!-- Header -->
            <div class="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-base font-black text-slate-900 tracking-tight">
                    Institutional Time Breaks
                  </h3>
                  <p class="text-xs text-slate-500 font-medium">
                    Breaks deducted from active ticket SLA and turnaround timers.
                  </p>
                </div>
              </div>

              <span class="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1 rounded-full border border-slate-200/70 shrink-0">
                Active Breaks: <strong class="text-amber-700">{{ activeBreakCount }}</strong>
              </span>
            </div>

            <!-- Breaks List (Lunch, Morning, Afternoon) -->
            <div class="space-y-3">
              <!-- 1. Lunch Break -->
              <div
                class="p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
                :class="scheduleForm.lunch_break_enabled
                  ? 'bg-amber-50/30 border-amber-200/70'
                  : 'bg-slate-50/60 border-slate-200 opacity-70'"
              >
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-bold text-slate-900">Mandatory Lunch Break</div>
                    <div class="text-xs text-slate-500 font-medium">Standard 1-hour midday pause</div>
                  </div>
                </div>

                <div class="flex items-center justify-between sm:justify-end gap-3">
                  <div class="flex items-center gap-2">
                    <input
                      v-model="scheduleForm.lunch_start_time"
                      type="time"
                      :disabled="!scheduleForm.lunch_break_enabled"
                      class="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-40 min-h-[38px]"
                    />
                    <span class="text-xs text-slate-400 font-bold">to</span>
                    <input
                      v-model="scheduleForm.lunch_end_time"
                      type="time"
                      :disabled="!scheduleForm.lunch_break_enabled"
                      class="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-40 min-h-[38px]"
                    />
                  </div>

                  <button
                    type="button"
                    role="switch"
                    :aria-checked="scheduleForm.lunch_break_enabled"
                    @click="scheduleForm.lunch_break_enabled = !scheduleForm.lunch_break_enabled"
                    class="relative inline-flex items-center cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 rounded-full p-1 -m-1"
                  >
                    <div
                      class="w-11 h-6 rounded-full transition-colors duration-200 ease-in-out relative shrink-0"
                      :class="scheduleForm.lunch_break_enabled ? 'bg-amber-600' : 'bg-slate-300'"
                    >
                      <span
                        aria-hidden="true"
                        class="absolute top-[2px] left-[2px] inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out"
                        :class="scheduleForm.lunch_break_enabled ? 'translate-x-5' : 'translate-x-0'"
                      />
                    </div>
                  </button>
                </div>
              </div>

              <!-- 2. Morning Rest Break -->
              <div
                class="p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
                :class="scheduleForm.morning_break_enabled
                  ? 'bg-amber-50/30 border-amber-200/70'
                  : 'bg-slate-50/60 border-slate-200 opacity-70'"
              >
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-bold text-slate-900">Morning Break (Optional)</div>
                    <div class="text-xs text-slate-500 font-medium">Optional 15-minute institutional pause</div>
                  </div>
                </div>

                <div class="flex items-center justify-between sm:justify-end gap-3">
                  <div class="flex items-center gap-2">
                    <input
                      v-model="scheduleForm.morning_break_start"
                      type="time"
                      :disabled="!scheduleForm.morning_break_enabled"
                      class="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-40 min-h-[38px]"
                    />
                    <span class="text-xs text-slate-400 font-bold">to</span>
                    <input
                      v-model="scheduleForm.morning_break_end"
                      type="time"
                      :disabled="!scheduleForm.morning_break_enabled"
                      class="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-40 min-h-[38px]"
                    />
                  </div>

                  <button
                    type="button"
                    role="switch"
                    :aria-checked="scheduleForm.morning_break_enabled"
                    @click="scheduleForm.morning_break_enabled = !scheduleForm.morning_break_enabled"
                    class="relative inline-flex items-center cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 rounded-full p-1 -m-1"
                  >
                    <div
                      class="w-11 h-6 rounded-full transition-colors duration-200 ease-in-out relative shrink-0"
                      :class="scheduleForm.morning_break_enabled ? 'bg-amber-600' : 'bg-slate-300'"
                    >
                      <span
                        aria-hidden="true"
                        class="absolute top-[2px] left-[2px] inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out"
                        :class="scheduleForm.morning_break_enabled ? 'translate-x-5' : 'translate-x-0'"
                      />
                    </div>
                  </button>
                </div>
              </div>

              <!-- 3. Afternoon Rest Break -->
              <div
                class="p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
                :class="scheduleForm.afternoon_break_enabled
                  ? 'bg-amber-50/30 border-amber-200/70'
                  : 'bg-slate-50/60 border-slate-200 opacity-70'"
              >
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-bold text-slate-900">Afternoon Break (Optional)</div>
                    <div class="text-xs text-slate-500 font-medium">Optional 15-minute institutional pause</div>
                  </div>
                </div>

                <div class="flex items-center justify-between sm:justify-end gap-3">
                  <div class="flex items-center gap-2">
                    <input
                      v-model="scheduleForm.afternoon_break_start"
                      type="time"
                      :disabled="!scheduleForm.afternoon_break_enabled"
                      class="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-40 min-h-[38px]"
                    />
                    <span class="text-xs text-slate-400 font-bold">to</span>
                    <input
                      v-model="scheduleForm.afternoon_break_end"
                      type="time"
                      :disabled="!scheduleForm.afternoon_break_enabled"
                      class="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-40 min-h-[38px]"
                    />
                  </div>

                  <button
                    type="button"
                    role="switch"
                    :aria-checked="scheduleForm.afternoon_break_enabled"
                    @click="scheduleForm.afternoon_break_enabled = !scheduleForm.afternoon_break_enabled"
                    class="relative inline-flex items-center cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 rounded-full p-1 -m-1"
                  >
                    <div
                      class="w-11 h-6 rounded-full transition-colors duration-200 ease-in-out relative shrink-0"
                      :class="scheduleForm.afternoon_break_enabled ? 'bg-amber-600' : 'bg-slate-300'"
                    >
                      <span
                        aria-hidden="true"
                        class="absolute top-[2px] left-[2px] inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out"
                        :class="scheduleForm.afternoon_break_enabled ? 'translate-x-5' : 'translate-x-0'"
                      />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- CARD 3: WEEKEND EXCLUSION POLICY & DAYS CONFIGURATION -->
          <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-7 space-y-5">
            <!-- Header -->
            <div class="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-base font-black text-slate-900 tracking-tight">
                    Weekend Exclusion Policy
                  </h3>
                  <p class="text-xs text-slate-500 font-medium">
                    Configure weekend pauses for ticket turnaround and deadlines.
                  </p>
                </div>
              </div>

              <!-- Policy Badge -->
              <span
                class="px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 border shrink-0"
                :class="scheduleForm.exclude_weekends
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="scheduleForm.exclude_weekends ? 'bg-indigo-500' : 'bg-emerald-500'"></span>
                {{ weekendPolicySummaryTitle }}
              </span>
            </div>

            <!-- Master Toggle: Exclude Weekends -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
              <div>
                <div class="text-sm font-bold text-slate-900">
                  Exclude Weekends from Deadlines &amp; Turnaround
                </div>
                <div class="text-xs text-slate-500 font-medium mt-0.5">
                  Weekend days will not count against SLA resolution times or promised delivery dates.
                </div>
              </div>

              <!-- Centered Toggle Switch Button -->
              <button
                type="button"
                role="switch"
                :aria-checked="scheduleForm.exclude_weekends"
                @click="scheduleForm.exclude_weekends = !scheduleForm.exclude_weekends"
                class="relative inline-flex items-center cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-full p-1 -m-1"
              >
                <div
                  class="w-11 h-6 rounded-full transition-colors duration-200 ease-in-out relative shrink-0"
                  :class="scheduleForm.exclude_weekends ? 'bg-indigo-600' : 'bg-slate-300'"
                >
                  <span
                    aria-hidden="true"
                    class="absolute top-[2px] left-[2px] inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out"
                    :class="scheduleForm.exclude_weekends ? 'translate-x-5' : 'translate-x-0'"
                  />
                </div>
              </button>
            </div>

            <!-- Granular Weekend Days Selection (Saturday / Sunday) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <!-- Saturday Toggle Card -->
              <div
                @click="scheduleForm.exclude_weekends && (scheduleForm.exclude_saturday = !scheduleForm.exclude_saturday)"
                :class="[
                  'p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 select-none min-h-[56px]',
                  !scheduleForm.exclude_weekends
                    ? 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                    : scheduleForm.exclude_saturday
                      ? 'bg-indigo-50/40 border-indigo-200 cursor-pointer shadow-2xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50 cursor-pointer'
                ]"
              >
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-bold text-slate-900">Exclude Saturdays</span>
                    <span
                      class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
                      :class="scheduleForm.exclude_weekends && scheduleForm.exclude_saturday ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-600'"
                    >
                      {{ scheduleForm.exclude_weekends && scheduleForm.exclude_saturday ? 'Non-Working' : 'Active' }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 font-medium mt-0.5">
                    Saturdays do not accumulate turnaround hours.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  :aria-checked="scheduleForm.exclude_saturday"
                  :disabled="!scheduleForm.exclude_weekends"
                  @click.stop="scheduleForm.exclude_saturday = !scheduleForm.exclude_saturday"
                  class="relative inline-flex items-center cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-full p-1 -m-1"
                  :class="!scheduleForm.exclude_weekends ? 'opacity-40 cursor-not-allowed' : ''"
                >
                  <div
                    class="w-11 h-6 rounded-full transition-colors duration-200 ease-in-out relative shrink-0"
                    :class="scheduleForm.exclude_weekends && scheduleForm.exclude_saturday ? 'bg-indigo-600' : 'bg-slate-300'"
                  >
                    <span
                      aria-hidden="true"
                      class="absolute top-[2px] left-[2px] inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out"
                      :class="scheduleForm.exclude_weekends && scheduleForm.exclude_saturday ? 'translate-x-5' : 'translate-x-0'"
                    />
                  </div>
                </button>
              </div>

              <!-- Sunday Toggle Card -->
              <div
                @click="scheduleForm.exclude_weekends && (scheduleForm.exclude_sunday = !scheduleForm.exclude_sunday)"
                :class="[
                  'p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 select-none min-h-[56px]',
                  !scheduleForm.exclude_weekends
                    ? 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                    : scheduleForm.exclude_sunday
                      ? 'bg-indigo-50/40 border-indigo-200 cursor-pointer shadow-2xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50 cursor-pointer'
                ]"
              >
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-bold text-slate-900">Exclude Sundays</span>
                    <span
                      class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
                      :class="scheduleForm.exclude_weekends && scheduleForm.exclude_sunday ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-600'"
                    >
                      {{ scheduleForm.exclude_weekends && scheduleForm.exclude_sunday ? 'Non-Working' : 'Active' }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 font-medium mt-0.5">
                    Sundays do not accumulate turnaround hours.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  :aria-checked="scheduleForm.exclude_sunday"
                  :disabled="!scheduleForm.exclude_weekends"
                  @click.stop="scheduleForm.exclude_sunday = !scheduleForm.exclude_sunday"
                  class="relative inline-flex items-center cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-full p-1 -m-1"
                  :class="!scheduleForm.exclude_weekends ? 'opacity-40 cursor-not-allowed' : ''"
                >
                  <div
                    class="w-11 h-6 rounded-full transition-colors duration-200 ease-in-out relative shrink-0"
                    :class="scheduleForm.exclude_weekends && scheduleForm.exclude_sunday ? 'bg-indigo-600' : 'bg-slate-300'"
                  >
                    <span
                      aria-hidden="true"
                      class="absolute top-[2px] left-[2px] inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out"
                      :class="scheduleForm.exclude_weekends && scheduleForm.exclude_sunday ? 'translate-x-5' : 'translate-x-0'"
                    />
                  </div>
                </button>
              </div>
            </div>

            <!-- Compact Policy Banner -->
            <div
              class="p-3.5 rounded-2xl border flex items-center gap-3 transition-colors"
              :class="scheduleForm.exclude_weekends
                ? 'bg-indigo-50/40 border-indigo-200/80 text-indigo-950'
                : 'bg-emerald-50/40 border-emerald-200/80 text-emerald-950'"
            >
              <div
                class="p-1.5 rounded-lg shrink-0"
                :class="scheduleForm.exclude_weekends ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <div class="text-xs font-semibold leading-relaxed">
                {{ weekendPolicyExplanation }}
              </div>
            </div>
          </div>

          <!-- CARD 4: SAVE & RESTORE ACTION BAR -->
          <div class="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                @click="handleRestoreStandardDefaults"
                class="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all active:scale-95 cursor-pointer min-h-[40px]"
              >
                Restore Defaults
              </button>
              <button
                type="button"
                @click="syncScheduleFormFromStore"
                class="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all active:scale-95 cursor-pointer min-h-[40px]"
              >
                Reset to Saved
              </button>
            </div>

            <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                @click="handleSaveSchedule"
                :disabled="operationsStore.isSaving"
                class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50 min-h-[42px]"
              >
                <svg v-if="operationsStore.isSaving" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{{ operationsStore.isSaving ? 'Saving...' : 'Save Schedule Settings' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Add / Edit Holiday Modal -->
        <Teleport to="body">
          <div
            v-if="showModal"
            class="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto pointer-events-auto"
            @click.self="showModal = false"
          >
            <div class="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all my-auto">
              <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 class="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    {{ editingHoliday ? 'Edit Non-Working Day' : 'Add Non-Working Day' }}
                  </h3>
                  <p class="text-xs text-slate-500 font-medium">
                    Service requests automatically pause on registered non-working dates.
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
                <!-- Date -->
                <div class="space-y-1.5">
                  <label class="block text-xs font-black text-slate-800 uppercase tracking-wider">
                    Date
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
                    Non-Working Day Name
                  </label>
                  <input
                    v-model="holidayForm.name"
                    type="text"
                    required
                    placeholder="e.g., Benguet Foundation Day, Baguio Charter Day, University Foundation Day"
                    class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 min-h-[44px]"
                  />
                </div>

                <!-- Classification Type -->
                <div class="space-y-1.5">
                  <label class="block text-xs font-black text-slate-800 uppercase tracking-wider">
                    Classification Type
                  </label>
                  <select
                    v-model="holidayForm.type"
                    required
                    class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 min-h-[44px] cursor-pointer"
                  >
                    <option value="special_non_working">Special Non-Working Day</option>
                    <option value="institutional">University Non-Working Day</option>
                  </select>
                </div>

                <!-- Recurrence Checkbox -->
                <div class="pt-1">
                  <label class="flex items-center gap-2.5 cursor-pointer">
                    <input
                      v-model="holidayForm.is_recurring"
                      type="checkbox"
                      class="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span class="text-xs font-bold text-slate-700">Recurs annually on this month and day</span>
                  </label>
                </div>

                <!-- Notes / Proclamation Reference (Optional) -->
                <div class="space-y-1.5">
                  <label class="block text-xs font-black text-slate-800 uppercase tracking-wider">
                    Notes / Proclamation Reference (Optional)
                  </label>
                  <input
                    v-model="holidayForm.notes"
                    type="text"
                    placeholder="e.g., Presidential Proclamation No. 729, Baguio Day"
                    class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 min-h-[44px]"
                  />
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
                    {{ operationsStore.isSaving ? 'Saving...' : (editingHoliday ? 'Update Non-Working Day' : 'Save Non-Working Day') }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Teleport>
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import DirectorSidebar from './DirectorSidebar.vue';
import { useOperationsHubStore } from '@/stores/operationsHub';
import { formatDateToYmd } from '@/utils/workCalendar';
import { toast } from 'vue3-toastify';
import Swal from 'sweetalert2';

const operationsStore = useOperationsHubStore();

// Tab Switcher ('holidays' | 'schedule')
const activeTab = ref('holidays');

// =============================================================================
// Operational Schedule & Job Continuity Form State
// =============================================================================
const scheduleForm = ref({
  work_start_time: '08:00',
  work_end_time: '17:00',
  lunch_start_time: '12:00',
  lunch_end_time: '13:00',
  standard_daily_hours: 8.0,
  daily_continuation_enabled: true,
  continuation_start_time: '08:00',
  continuation_cutoff_time: '17:00',
  lunch_break_enabled: true,
  morning_break_enabled: false,
  morning_break_start: '10:00',
  morning_break_end: '10:15',
  afternoon_break_enabled: false,
  afternoon_break_start: '15:00',
  afternoon_break_end: '15:15',
  exclude_weekends: true,
  exclude_saturday: true,
  exclude_sunday: true,
});

const syncScheduleFormFromStore = () => {
  if (operationsStore.workingHours) {
    scheduleForm.value = {
      work_start_time: operationsStore.workingHours.work_start_time || '08:00',
      work_end_time: operationsStore.workingHours.work_end_time || '17:00',
      lunch_start_time: operationsStore.workingHours.lunch_start_time || '12:00',
      lunch_end_time: operationsStore.workingHours.lunch_end_time || '13:00',
      standard_daily_hours: Number(operationsStore.workingHours.standard_daily_hours) || 8.0,
      daily_continuation_enabled: operationsStore.workingHours.daily_continuation_enabled !== false,
      continuation_start_time: operationsStore.workingHours.continuation_start_time || '08:00',
      continuation_cutoff_time: operationsStore.workingHours.continuation_cutoff_time || '17:00',
      lunch_break_enabled: operationsStore.workingHours.lunch_break_enabled !== false,
      morning_break_enabled: !!operationsStore.workingHours.morning_break_enabled,
      morning_break_start: operationsStore.workingHours.morning_break_start || '10:00',
      morning_break_end: operationsStore.workingHours.morning_break_end || '10:15',
      afternoon_break_enabled: !!operationsStore.workingHours.afternoon_break_enabled,
      afternoon_break_start: operationsStore.workingHours.afternoon_break_start || '15:00',
      afternoon_break_end: operationsStore.workingHours.afternoon_break_end || '15:15',
      exclude_weekends: operationsStore.workingHours.exclude_weekends !== false,
      exclude_saturday: operationsStore.workingHours.exclude_saturday !== false,
      exclude_sunday: operationsStore.workingHours.exclude_sunday !== false,
    };
  }
};

watch(
  () => operationsStore.workingHours,
  () => {
    syncScheduleFormFromStore();
  },
  { deep: true }
);

const activeBreakCount = computed(() => {
  let count = 0;
  if (scheduleForm.value.lunch_break_enabled) count++;
  if (scheduleForm.value.morning_break_enabled) count++;
  if (scheduleForm.value.afternoon_break_enabled) count++;
  return count;
});

const weekendPolicySummaryTitle = computed(() => {
  if (!scheduleForm.value.exclude_weekends) {
    return '7-Day Continuous';
  }
  if (scheduleForm.value.exclude_saturday && scheduleForm.value.exclude_sunday) {
    return 'Standard 5-Day';
  }
  if (scheduleForm.value.exclude_saturday) {
    return '6-Day (Sun Working)';
  }
  if (scheduleForm.value.exclude_sunday) {
    return '6-Day (Sat Working)';
  }
  return 'All Days Active';
});

const weekendPolicyExplanation = computed(() => {
  if (!scheduleForm.value.exclude_weekends) {
    return '7-Day Continuous Operations: Saturdays and Sundays are counted as active working days; SLA timers run without pause.';
  }
  if (scheduleForm.value.exclude_saturday && scheduleForm.value.exclude_sunday) {
    return 'Standard 5-Day Work Week: Both Saturday and Sunday are paused from turnaround and SLA deadline calculations.';
  }
  if (scheduleForm.value.exclude_saturday && !scheduleForm.value.exclude_sunday) {
    return '6-Day Work Week (Sundays Active): Saturdays are paused; Sundays count toward turnaround hours.';
  }
  if (!scheduleForm.value.exclude_saturday && scheduleForm.value.exclude_sunday) {
    return '6-Day Work Week (Saturdays Active): Sundays are paused; Saturdays count toward turnaround hours.';
  }
  return 'Weekend exclusion is enabled, but neither Saturday nor Sunday is selected.';
});

const handleSaveSchedule = async () => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!timeRegex.test(scheduleForm.value.work_start_time) || !timeRegex.test(scheduleForm.value.work_end_time)) {
    toast.error('Work start and end times must be valid 24-hour format (e.g. 08:00, 17:00).');
    return;
  }
  if (scheduleForm.value.work_start_time >= scheduleForm.value.work_end_time) {
    toast.error('Work start time must be earlier than work end time.');
    return;
  }

  if (scheduleForm.value.continuation_start_time >= scheduleForm.value.continuation_cutoff_time) {
    toast.error('Morning continuation resume time must be earlier than evening cutoff time.');
    return;
  }

  if (scheduleForm.value.lunch_break_enabled) {
    if (scheduleForm.value.lunch_start_time >= scheduleForm.value.lunch_end_time) {
      toast.error('Lunch start time must be earlier than lunch end time.');
      return;
    }
  }

  if (scheduleForm.value.morning_break_enabled) {
    if (scheduleForm.value.morning_break_start >= scheduleForm.value.morning_break_end) {
      toast.error('Morning break start must be earlier than morning break end time.');
      return;
    }
  }

  if (scheduleForm.value.afternoon_break_enabled) {
    if (scheduleForm.value.afternoon_break_start >= scheduleForm.value.afternoon_break_end) {
      toast.error('Afternoon break start must be earlier than afternoon break end time.');
      return;
    }
  }

  const payload = {
    ...scheduleForm.value,
    standard_daily_hours: Number(scheduleForm.value.standard_daily_hours) || 8.0,
    daily_continuation_enabled: scheduleForm.value.daily_continuation_enabled ? 1 : 0,
    lunch_break_enabled: scheduleForm.value.lunch_break_enabled ? 1 : 0,
    morning_break_enabled: scheduleForm.value.morning_break_enabled ? 1 : 0,
    afternoon_break_enabled: scheduleForm.value.afternoon_break_enabled ? 1 : 0,
    exclude_weekends: scheduleForm.value.exclude_weekends ? 1 : 0,
    exclude_saturday: scheduleForm.value.exclude_saturday ? 1 : 0,
    exclude_sunday: scheduleForm.value.exclude_sunday ? 1 : 0,
  };

  const res = await operationsStore.saveWorkingHours(payload);
  if (res.success) {
    toast.success(res.message || 'Operational schedule, job continuity, and weekend policies saved.');
  } else {
    toast.error(res.message || 'Failed to save operational schedule.');
  }
};

const handleRestoreStandardDefaults = () => {
  scheduleForm.value = {
    work_start_time: '08:00',
    work_end_time: '17:00',
    lunch_start_time: '12:00',
    lunch_end_time: '13:00',
    standard_daily_hours: 8.0,
    daily_continuation_enabled: true,
    continuation_start_time: '08:00',
    continuation_cutoff_time: '17:00',
    lunch_break_enabled: true,
    morning_break_enabled: false,
    morning_break_start: '10:00',
    morning_break_end: '10:15',
    afternoon_break_enabled: false,
    afternoon_break_start: '15:00',
    afternoon_break_end: '15:15',
    exclude_weekends: true,
    exclude_saturday: true,
    exclude_sunday: true,
  };
  toast.info('Restored standard GSO defaults in editor. Click "Save Schedule Settings" to apply.');
};

// =============================================================================
// Search & Filtering for Holidays
// =============================================================================
const searchQuery = ref('');
const selectedType = ref('');

const filteredHolidays = computed(() => {
  let list = (operationsStore.holidays || []).filter(h => h.type !== 'regular' && h.type !== 'local_suspension');

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

// Pagination State & Logic
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
    case 'special_non_working': return 'Special Non-Working Day';
    case 'institutional': return 'University Non-Working Day';
    default: return type === 'regular' || type === 'local_suspension' ? 'Special Non-Working Day' : (type || 'Special Non-Working Day');
  }
};

const getTypeBadgeClass = (type) => {
  switch (type) {
    case 'special_non_working':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'institutional':
      return 'bg-blue-50 text-blue-800 border-blue-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

// Modal State & Logic for Holidays
const showModal = ref(false);
const editingHoliday = ref(null);
const holidayForm = ref({
  holiday_date: '',
  name: '',
  type: 'special_non_working',
  is_recurring: false,
  notes: '',
});

const openAddModal = () => {
  editingHoliday.value = null;
  holidayForm.value = {
    holiday_date: formatDateToYmd(new Date()),
    name: '',
    type: 'special_non_working',
    is_recurring: false,
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
    notes: h.notes || '',
  };
  showModal.value = true;
};

const handleSaveHolidaySubmit = async () => {
  const payload = {
    holiday_date: holidayForm.value.holiday_date,
    name: (holidayForm.value.name || '').trim(),
    type: holidayForm.value.type || 'special_non_working',
    is_recurring: holidayForm.value.is_recurring ? 1 : 0,
    is_active: 1,
    notes: (holidayForm.value.notes || '').trim(),
  };

  if (!payload.holiday_date) {
    toast.error('Date is required.');
    return;
  }
  if (!payload.name) {
    toast.error('Non-working day name is required.');
    return;
  }

  if (editingHoliday.value?.id) {
    const res = await operationsStore.updateHoliday(editingHoliday.value.id, payload);
    if (res.success) {
      toast.success(res.message || 'Non-working day updated successfully.');
      showModal.value = false;
    } else {
      toast.error(res.message || 'Failed to update non-working day.');
    }
  } else {
    const res = await operationsStore.saveHoliday(payload);
    if (res.success) {
      toast.success(res.message || 'Non-working day added to calendar.');
      showModal.value = false;
    } else {
      toast.error(res.message || 'Failed to add non-working day.');
    }
  }
};

const handleDeleteHoliday = async (h) => {
  const result = await Swal.fire({
    title: 'Remove Non-Working Day?',
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
        toast.success(res.message || 'Non-working day removed.');
      } else {
        toast.error(res.message || 'Failed to remove non-working day.');
      }
    } else {
      operationsStore.holidays = (operationsStore.holidays || []).filter(item => item.holiday_date !== h.holiday_date);
      toast.success(`Removed ${h.name}`);
    }
  }
};

onMounted(async () => {
  try {
    await operationsStore.initOperationsHub();
    syncScheduleFormFromStore();
  } catch (err) {
    console.warn('Could not initialize operations hub:', err);
  }
});
</script>
