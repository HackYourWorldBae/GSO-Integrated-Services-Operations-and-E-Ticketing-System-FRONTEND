<template>
  <MainLayout>
    <template #header-title>
      <h2 class="text-base sm:text-xl font-black text-slate-900 tracking-tight truncate">
        Completed Jobs History
      </h2>
    </template>

    <template #main-content>
      <div class="max-w-7xl mx-auto space-y-5 sm:space-y-6">

        <!-- History Hero Banner -->
        <div class="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 p-5 sm:p-7 text-white shadow-xl border border-slate-800">
          <div class="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-sky-500/10 blur-2xl pointer-events-none"></div>
          <div class="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-teal-500/10 blur-2xl pointer-events-none"></div>

          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div class="min-w-0">
              <h3 class="text-lg sm:text-2xl font-black text-white tracking-tight truncate">
                Job Completion Archive
              </h3>
            </div>

            <!-- Completed Counter Pill on Banner -->
            <div class="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 shrink-0 self-start md:self-auto shadow-xs">
              <div class="text-right">
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-300 block">Total Completed</span>
                <span class="text-base font-black text-white leading-none">
                  {{ store.completedCount }} {{ store.completedCount === 1 ? 'Record' : 'Records' }}
                </span>
              </div>
              <div class="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center font-black text-sm border border-sky-400/30">
                {{ store.completedCount }}
              </div>
            </div>
          </div>
        </div>

        <!-- Search and Filters (Matching Administrator Archives) -->
        <div class="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-300 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div class="flex-1 w-full relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              data-tour="history-search-input"
              v-model="searchQuery"
              type="text"
              placeholder="Search completed jobs by Ticket ID, service, location, or requester..."
              class="w-full pl-12 pr-4 py-3 min-h-[44px] bg-slate-50/80 border border-slate-300 rounded-2xl text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-semibold shadow-2xs"
            />
          </div>
          <div class="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto">
            <select
              data-tour="history-filter-year"
              v-model="yearFilter"
              class="w-full md:w-36 px-4 py-3 min-h-[44px] bg-slate-50/80 border border-slate-300 rounded-2xl text-base sm:text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all cursor-pointer shadow-2xs"
            >
              <option value="all">All Years</option>
              <option v-for="yr in availableYears" :key="yr" :value="yr">
                Year {{ yr }}
              </option>
            </select>
            <select
              data-tour="history-filter-unit"
              v-model="unitFilter"
              class="w-full md:w-40 px-4 py-3 min-h-[44px] bg-slate-50/80 border border-slate-300 rounded-2xl text-base sm:text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all cursor-pointer shadow-2xs"
            >
              <option value="all">All Units</option>
              <option value="FGMU">FGMU</option>
              <option value="LEAU">LEAU</option>
              <option value="SSU">SSU</option>
            </select>
            <select
              data-tour="history-filter-crew"
              v-model="crewTypeFilter"
              class="w-full md:w-40 px-4 py-3 min-h-[44px] bg-slate-50/80 border border-slate-300 rounded-2xl text-base sm:text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all cursor-pointer shadow-2xs"
            >
              <option value="all">All Crews</option>
              <option value="solo">Solo Only</option>
              <option value="team">Joint Crew</option>
            </select>
            <button
              data-tour="history-btn-refresh"
              type="button"
              @click="refreshData"
              :disabled="store.isLoading"
              class="w-full md:w-auto px-5 py-3 min-h-[44px] bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all text-sm whitespace-nowrap cursor-pointer active:scale-95 touch-manipulation flex items-center justify-center gap-2 border border-slate-950 shadow-sm"
              title="Refresh history"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-300" :class="{ 'animate-spin': store.isLoading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <!-- Loading State Skeleton -->
        <div v-if="store.isLoading" class="space-y-3.5">
          <div v-for="i in 4" :key="i" class="p-5 rounded-2xl bg-white border border-slate-200/80 animate-pulse space-y-3">
            <div class="flex items-center justify-between">
              <div class="h-4 bg-slate-200 rounded w-24"></div>
              <div class="h-4 bg-slate-200 rounded-full w-28"></div>
            </div>
            <div class="h-5 bg-slate-200 rounded w-1/2"></div>
            <div class="h-4 bg-slate-200 rounded w-3/4"></div>
            <div class="h-4 bg-slate-200 rounded w-1/3"></div>
          </div>
        </div>

        <!-- Error State Banner -->
        <div
          v-else-if="store.errorMessage"
          class="p-5 sm:p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-3xl mx-auto"
        >
          <div class="flex items-start gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h4 class="text-sm font-black text-rose-950">Unable to load completed jobs history</h4>
              <p class="text-xs text-rose-700 mt-1 leading-relaxed">{{ store.errorMessage }}</p>
            </div>
          </div>
          <button
            type="button"
            @click="refreshData"
            class="px-4 py-2 min-h-[40px] rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-black transition-all shadow-xs shrink-0 cursor-pointer"
          >
            Retry Loading
          </button>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="filteredCompletedJobs.length === 0"
          class="py-16 px-6 text-center bg-white rounded-3xl border border-dashed border-slate-200 max-w-2xl mx-auto shadow-xs"
        >
          <div class="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 class="text-base font-black text-slate-800">No Completed Jobs Found</h4>
          <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
            {{ searchQuery ? 'No completed jobs match your current search and filters. Try adjusting your search query.' : 'You have not completed any work orders yet. Once active tasks are marked completed, their full history records will appear here.' }}
          </p>
          <div class="mt-4 flex items-center justify-center gap-3">
            <button
              v-if="searchQuery"
              type="button"
              @click="searchQuery = ''; crewTypeFilter = 'all'; unitFilter = 'all'"
              class="px-4 py-2 rounded-xl text-xs font-black text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-all cursor-pointer min-h-[44px]"
            >
              Reset Filters
            </button>
            <router-link
              to="/personnel/dashboard"
              class="px-4 py-2 rounded-xl text-xs font-black text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer min-h-[44px] inline-flex items-center gap-1.5"
            >
              View Active Tasks
            </router-link>
          </div>
        </div>

        <!-- Tickets List (Data Table & Mobile Card Stack Matching Administrator Archives) -->
        <div data-tour="history-records-table" class="rounded-2xl sm:rounded-3xl bg-white border border-slate-300 overflow-hidden shadow-sm">
          <!-- Distinct Container Section Header -->
          <div class="bg-gradient-to-r from-slate-50 via-slate-100/60 to-slate-50 px-5 sm:px-6 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-800">
                Archived Work Orders Record
              </h3>
            </div>
            <div class="text-[11px] font-bold text-slate-500">
              Displaying <span class="text-slate-900 font-black">{{ paginationRange.start }} - {{ paginationRange.end }}</span> of <span class="text-slate-900 font-black">{{ filteredCompletedJobs.length }}</span> records
            </div>
          </div>

          <!-- Desktop Table (hidden md:block) -->
          <div class="hidden md:block overflow-x-auto p-4 sm:p-6">
            <table class="w-full text-left border-separate border-spacing-y-4 min-w-[800px]">
              <thead>
                <tr class="border-b border-slate-200">
                  <th class="pb-3 text-[11px] font-black text-slate-600 uppercase tracking-wider px-6">Ticket ID</th>
                  <th class="pb-3 text-[11px] font-black text-slate-600 uppercase tracking-wider px-4">Service</th>
                  <th class="pb-3 text-[11px] font-black text-slate-600 uppercase tracking-wider px-4">Requester</th>
                  <th class="pb-3 text-[11px] font-black text-slate-600 uppercase tracking-wider px-4">Location</th>
                  <th class="pb-3 text-[11px] font-black text-slate-600 uppercase tracking-wider px-4">Status</th>
                  <th class="pb-3 text-[11px] font-black text-slate-600 uppercase tracking-wider px-4">Completed</th>
                  <th class="pb-3 text-[11px] font-black text-slate-600 uppercase tracking-wider px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="ticket in paginatedCompletedJobs"
                  :key="ticket.assignment_id || ticket.ticket_id"
                  class="group transition-all duration-200 cursor-pointer"
                  @click="openTicketDetails(ticket)"
                >
                  <td class="py-5 px-6 bg-slate-50/80 border-y border-l border-slate-300 rounded-l-2xl group-hover:bg-white group-hover:border-sky-500 group-hover:shadow-md transition-all">
                    <span class="text-base font-black text-slate-900 bg-slate-100 border border-slate-300 px-2.5 py-0.5 rounded-lg inline-block tabular-nums shadow-2xs">#{{ ticket.ticket_id }}</span>
                    <div class="mt-1 flex items-center gap-1 flex-wrap">
                      <span v-if="ticket.is_emergency" class="px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 text-[9px] font-black uppercase">Urgent</span>
                      <span v-if="ticket.unit_code" class="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 text-[9px] font-black uppercase">{{ ticket.unit_code }}</span>
                    </div>
                  </td>
                  <td class="py-5 px-4 bg-slate-50/80 border-y border-slate-300 group-hover:bg-white group-hover:border-sky-500 transition-all">
                    <div class="truncate max-w-[150px] sm:max-w-xs text-sm font-bold text-slate-900" :title="ticket.service_type">{{ ticket.service_type }}</div>
                    <div class="text-[11px] text-slate-500 line-clamp-1 truncate max-w-xs">{{ ticket.description }}</div>
                  </td>
                  <td class="py-5 px-4 bg-slate-50/80 border-y border-slate-300 group-hover:bg-white group-hover:border-sky-500 transition-all">
                    <div class="flex items-center gap-2">
                      <div class="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {{ getMemberInitials(ticket.requestor_name) }}
                      </div>
                      <div class="min-w-0">
                        <span class="text-xs font-semibold text-slate-800 truncate block max-w-[130px]">{{ ticket.requestor_name }}</span>
                        <span v-if="ticket.requestor_contact" class="text-[10px] text-slate-500 block">{{ ticket.requestor_contact }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="py-5 px-4 bg-slate-50/80 border-y border-slate-300 group-hover:bg-white group-hover:border-sky-500 transition-all whitespace-nowrap">
                    <div class="text-xs font-semibold text-slate-800">{{ ticket.location }}</div>
                    <div class="text-[10px] text-slate-500">{{ ticket.office_room ? (ticket.office_room.startsWith('Rm') ? ticket.office_room : 'Rm ' + ticket.office_room) : 'General Area' }}</div>
                  </td>
                  <td class="py-5 px-4 bg-slate-50/80 border-y border-slate-300 group-hover:bg-white group-hover:border-sky-500 transition-all">
                    <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border whitespace-nowrap bg-sky-50 text-sky-700 border-sky-300 inline-flex items-center gap-1 shadow-2xs">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      Completed
                    </span>
                  </td>
                  <td class="py-5 px-4 bg-slate-50/80 border-y border-slate-300 group-hover:bg-white group-hover:border-sky-500 transition-all whitespace-nowrap">
                    <span class="text-xs font-bold text-slate-700">{{ formatDate(ticket.completed_at || ticket.implementation_date) }}</span>
                  </td>
                  <td class="py-5 px-6 bg-slate-50/80 border-y border-r border-slate-300 rounded-r-2xl group-hover:bg-white group-hover:border-sky-500 group-hover:shadow-md transition-all text-right" @click.stop>
                    <button
                      type="button"
                      @click="openTicketDetails(ticket)"
                      class="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:text-sky-700 hover:bg-sky-50 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-2xs active:scale-95 inline-flex items-center gap-2 cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Details
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredCompletedJobs.length === 0">
                  <td colspan="7" class="p-12 text-center bg-slate-50 border border-slate-300 rounded-2xl">
                    <div class="w-16 h-16 bg-white border border-slate-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <h3 class="text-lg font-black text-slate-900 mb-1">No Archived Tickets Found</h3>
                    <p class="text-sm text-slate-500 font-medium">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Card Stack (block md:hidden) -->
          <div class="block md:hidden p-4 space-y-3.5">
            <div
              v-for="ticket in paginatedCompletedJobs"
              :key="'m-' + (ticket.assignment_id || ticket.ticket_id)"
              @click="openTicketDetails(ticket)"
              class="p-4 rounded-2xl bg-white border border-slate-300 hover:border-sky-500 shadow-sm space-y-3 cursor-pointer transition-all active:scale-[0.99]"
            >
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="text-sm font-black text-slate-900 bg-slate-100 border border-slate-300 px-2.5 py-0.5 rounded-lg inline-block tabular-nums shadow-2xs">#{{ ticket.ticket_id }}</span>
                  <p class="text-xs font-bold text-slate-800 line-clamp-1 mt-1.5">
                    {{ ticket.service_type }}
                  </p>
                </div>
                <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border whitespace-nowrap shrink-0 bg-sky-50 text-sky-700 border-sky-300 shadow-2xs">
                  Completed
                </span>
              </div>

              <div class="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-200 text-slate-600">
                <div>
                  <span class="text-[10px] uppercase font-bold text-slate-400 block">Requester</span>
                  <span class="font-bold text-slate-800 truncate block">{{ ticket.requestor_name }}</span>
                </div>
                <div>
                  <span class="text-[10px] uppercase font-bold text-slate-400 block">Completed</span>
                  <span class="font-bold text-slate-800 block">{{ formatDate(ticket.completed_at || ticket.implementation_date) }}</span>
                </div>
              </div>

              <button
                type="button"
                @click.stop="openTicketDetails(ticket)"
                class="w-full min-h-[44px] py-2.5 bg-slate-50 hover:bg-sky-50 border border-slate-300 text-slate-800 hover:text-sky-800 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation active:scale-[0.99] shadow-2xs"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>View Details</span>
              </button>
            </div>

            <div v-if="filteredCompletedJobs.length === 0" class="p-8 text-center bg-slate-50 border border-slate-300 rounded-2xl">
              <div class="w-12 h-12 bg-white border border-slate-300 rounded-full flex items-center justify-center mx-auto mb-3 shadow-xs">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 class="text-base font-black text-slate-900 mb-0.5">No Archived Tickets Found</h3>
              <p class="text-xs text-slate-500 font-medium">Try adjusting your search or filters.</p>
            </div>
          </div>

          <!-- Pagination Toolbar -->
          <div v-if="filteredCompletedJobs.length > 0" class="px-5 sm:px-6 py-4 bg-gradient-to-r from-slate-50 via-slate-100/60 to-slate-50 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3 text-xs text-slate-600 font-semibold">
              <span class="text-slate-500 font-bold">Rows per page:</span>
              <select
                v-model.number="perPage"
                @change="currentPage = 1"
                class="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs font-bold focus:outline-none focus:border-sky-500 cursor-pointer shadow-2xs"
              >
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="15">15</option>
                <option :value="25">25</option>
                <option :value="50">50</option>
              </select>
              <span>
                Showing <strong class="text-slate-900">{{ paginationRange.start }}</strong> to
                <strong class="text-slate-900">{{ paginationRange.end }}</strong> of
                <strong class="text-slate-900">{{ filteredCompletedJobs.length }}</strong> tickets
              </span>
            </div>

            <div class="flex items-center gap-1.5 text-xs">
              <button
                type="button"
                @click="changePage(1)"
                :disabled="currentPage === 1"
                class="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed font-bold cursor-pointer transition-colors shadow-2xs"
                title="First Page"
              >
                «
              </button>
              <button
                type="button"
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed font-bold cursor-pointer transition-colors shadow-2xs"
              >
                ‹ Prev
              </button>

              <div class="flex items-center gap-1">
                <button
                  v-for="page in displayedPages"
                  :key="page"
                  type="button"
                  @click="changePage(page)"
                  class="px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  :class="currentPage === page ? 'bg-sky-600 border-sky-700 text-white shadow-xs font-black' : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800'"
                >
                  {{ page }}
                </button>
              </div>

              <button
                type="button"
                @click="changePage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed font-bold cursor-pointer transition-colors shadow-2xs"
              >
                Next ›
              </button>
              <button
                type="button"
                @click="changePage(totalPages)"
                :disabled="currentPage === totalPages"
                class="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed font-bold cursor-pointer transition-colors shadow-2xs"
                title="Last Page"
              >
                »
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- ======================================================== -->
      <!-- COMPLETED TICKET FULL INFO MODAL                         -->
      <!-- ======================================================== -->
      <Teleport to="body">
        <div
          v-if="selectedTicket"
          class="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto pointer-events-auto"
        >
          <div
            class="pointer-events-auto bg-white rounded-3xl w-full max-w-2xl p-5 sm:p-7 shadow-2xl border border-slate-300 animate-scale-up my-auto max-h-[92vh] overflow-y-auto custom-scrollbar space-y-5"
          >
            <!-- Modal Header -->
            <div class="flex items-start justify-between gap-3 pb-4 border-b-2 border-slate-200">
              <div class="min-w-0">
                <div class="flex items-center gap-2 mb-1 flex-wrap">
                  <span class="px-2.5 py-0.5 rounded-lg text-xs font-black font-mono bg-slate-100 text-slate-900 border border-slate-300 shadow-2xs">
                    #{{ selectedTicket.ticket_id }}
                  </span>
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200 inline-flex items-center gap-1 shadow-2xs">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Completed Job
                  </span>
                  <span v-if="selectedTicket.is_emergency" class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white">
                    Emergency
                  </span>
                </div>
                <h3 class="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                  {{ selectedTicket.service_type }}
                </h3>
              </div>

              <button
                type="button"
                @click="selectedTicket = null"
                class="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 border border-slate-300 flex items-center justify-center transition-colors cursor-pointer shrink-0 touch-manipulation shadow-2xs"
                title="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Job Recap Breakdown -->
            <div class="space-y-4">
              <!-- Description -->
              <div class="space-y-1">
                <label class="text-[10px] font-black uppercase tracking-wider text-slate-500">Request Description</label>
                <p class="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-300">
                  {{ selectedTicket.description }}
                </p>
              </div>

              <!-- Location & Completion Schedule Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-300 space-y-1 text-xs">
                  <span class="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Work Location</span>
                  <span class="font-bold text-slate-900 block text-sm">{{ selectedTicket.location }}</span>
                  <span class="text-slate-600">Room / Office: <strong class="text-slate-800">{{ selectedTicket.office_room }}</strong></span>
                </div>

                <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-300 space-y-1 text-xs">
                  <span class="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Completed On</span>
                  <span class="font-bold text-sky-700 block text-sm">
                    {{ formatDate(selectedTicket.completed_at || selectedTicket.implementation_date) }}
                  </span>
                  <span class="text-slate-600">Working Duration: <strong class="text-slate-800">{{ selectedTicket.working_days }} day(s)</strong></span>
                </div>
              </div>

              <!-- Requesting Client Details -->
              <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-300 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span class="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Requesting Client</span>
                  <span class="font-bold text-slate-900 text-sm">{{ selectedTicket.requestor_name }}</span>
                </div>
                <div v-if="selectedTicket.requestor_contact" class="text-right">
                  <span class="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Contact Number</span>
                  <a :href="'tel:' + selectedTicket.requestor_contact" class="font-bold text-emerald-700 hover:underline">
                    📞 {{ selectedTicket.requestor_contact }}
                  </a>
                </div>
              </div>

              <!-- Dispatcher Notes (if any) -->
              <div v-if="selectedTicket.dispatcher_notes || selectedTicket.task_notes" class="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300 text-xs text-amber-950 space-y-1">
                <span class="text-[10px] font-black uppercase tracking-wider text-amber-950 block">Dispatcher Instructions &amp; Task Notes:</span>
                <p class="font-semibold leading-relaxed">{{ selectedTicket.dispatcher_notes || selectedTicket.task_notes }}</p>
              </div>

              <!-- Assigned Crew / Team section -->
              <div class="space-y-2 pt-2">
                <div class="flex items-center justify-between">
                  <h4 class="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Responding Team Crew ({{ selectedTicket.team_count }} Staff)
                  </h4>
                  <span class="text-[11px] font-bold text-slate-500">Unit: {{ selectedTicket.unit_name }}</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div
                    v-for="member in selectedTicket.team"
                    :key="member.personnel_id || member.assignment_id"
                    :class="[
                      'p-3 rounded-2xl border flex items-start gap-3 transition-all',
                      member.is_you
                        ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-500/20 shadow-xs'
                        : 'bg-slate-50 border-slate-300 shadow-2xs'
                    ]"
                  >
                    <div
                      :class="[
                        'w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0',
                        member.is_you ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-200 border border-slate-300 text-slate-800'
                      ]"
                    >
                      {{ getMemberInitials(member.personnel_name) }}
                    </div>

                    <div class="min-w-0 flex-1 leading-tight text-xs space-y-0.5">
                      <div class="flex items-center justify-between gap-1">
                        <span class="font-black text-slate-900 truncate">
                          {{ member.personnel_name }}
                        </span>
                        <span v-if="member.is_you" class="px-1.5 py-0.2 rounded bg-sky-600 text-white text-[9px] font-black uppercase">
                          YOU
                        </span>
                      </div>
                      <span class="text-[11px] font-bold text-slate-500 block truncate">
                        {{ member.specialty || 'Responding Staff' }}
                      </span>
                      <span class="text-[10px] text-slate-400 block truncate">
                        {{ member.unit_code ? `Unit: ${member.unit_code}` : '' }}
                      </span>
                      <p v-if="member.task_notes" class="text-[10px] text-amber-700 font-semibold italic mt-1 pt-1 border-t border-slate-200">
                        Task: {{ member.task_notes }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="pt-4 border-t-2 border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                @click="selectedTicket = null"
                class="px-5 py-2.5 min-h-[44px] rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all shadow-xs cursor-pointer touch-manipulation"
              >
                Close History Details
              </button>
            </div>
          </div>
        </div>
      </Teleport>

    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import { usePersonnelDashboardStore } from '@/stores/personnelDashboard';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const store = usePersonnelDashboardStore();
const authStore = useAuthStore();

const searchQuery = ref('');
const unitFilter = ref('all');
const yearFilter = ref('all');
const crewTypeFilter = ref('all'); // 'all' | 'solo' | 'team'
const sortBy = ref('completed_desc'); // 'completed_desc' | 'completed_asc' | 'ticket_id'
const selectedTicket = ref(null);

// Pagination State
const currentPage = ref(1);
const perPage = ref(10);

const loadHistory = async () => {
  try {
    const qPid = route.query.personnel_id ? String(route.query.personnel_id).trim() : null;
    await store.fetchDashboard(qPid);
    checkRouteTicket();
  } catch (_) {
    // Handled by store.errorMessage
  }
};

const checkRouteTicket = () => {
  const target = route.query.ticketId || route.query.highlight;
  if (!target || !store.completedAssignments || store.completedAssignments.length === 0) return;
  const cleanTarget = String(target).trim().toLowerCase().replace(/^#/, '');
  const match = store.completedAssignments.find(a => {
    const tid = String(a.ticket_id || '').toLowerCase().trim().replace(/^#/, '');
    const aid = String(a.assignment_id || '').toLowerCase().trim().replace(/^#/, '');
    return tid === cleanTarget || aid === cleanTarget || tid.endsWith(`-${cleanTarget}`);
  });
  if (match) {
    openTicketDetails(match);
  }
};

watch(() => [route.query.ticketId, route.query.highlight, route.query._t], checkRouteTicket);

onMounted(async () => {
  await loadHistory();
});

const refreshData = async () => {
  await loadHistory();
};



// Available years from completed jobs
const availableYears = computed(() => {
  const years = new Set();
  store.completedAssignments.forEach(a => {
    const raw = a.completed_at || a.implementation_date;
    if (raw) {
      const yr = new Date(raw).getFullYear();
      if (!isNaN(yr)) years.add(yr);
    }
  });
  return Array.from(years).sort((a, b) => b - a);
});

const filteredCompletedJobs = computed(() => {
  let list = store.completedAssignments;

  // 1. Crew type filter
  if (crewTypeFilter.value === 'solo') {
    list = list.filter(a => (a.team_count || 1) <= 1);
  } else if (crewTypeFilter.value === 'team') {
    list = list.filter(a => (a.team_count || 1) > 1);
  }

  // 2. Unit filter
  if (unitFilter.value !== 'all') {
    list = list.filter(a => String(a.unit_code || '').toUpperCase() === unitFilter.value.toUpperCase());
  }

  // 3. Year filter
  if (yearFilter.value !== 'all') {
    const targetYr = Number(yearFilter.value);
    list = list.filter(a => {
      const raw = a.completed_at || a.implementation_date;
      if (!raw) return false;
      return new Date(raw).getFullYear() === targetYr;
    });
  }

  // 4. Search query filter
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(a => {
      const matchId = String(a.ticket_id || '').toLowerCase().includes(q);
      const matchService = String(a.service_type || '').toLowerCase().includes(q);
      const matchLoc = String(a.location || '').toLowerCase().includes(q) || String(a.office_room || '').toLowerCase().includes(q);
      const matchDesc = String(a.description || '').toLowerCase().includes(q);
      const matchReq = String(a.requestor_name || '').toLowerCase().includes(q);
      const matchTeam = Array.isArray(a.team) && a.team.some(m => String(m.personnel_name || '').toLowerCase().includes(q));
      return matchId || matchService || matchLoc || matchDesc || matchReq || matchTeam;
    });
  }

  // 5. Sorting
  return [...list].sort((a, b) => {
    if (sortBy.value === 'ticket_id') {
      return String(b.ticket_id || '').localeCompare(String(a.ticket_id || ''));
    }
    const dateA = a.completed_at || a.implementation_date || '';
    const dateB = b.completed_at || b.implementation_date || '';
    if (sortBy.value === 'completed_asc') {
      return dateA.localeCompare(dateB);
    }
    // Default: most recently completed
    return dateB.localeCompare(dateA);
  });
});

// Pagination Computeds
const totalPages = computed(() => {
  return Math.ceil(filteredCompletedJobs.value.length / perPage.value) || 1;
});

const paginatedCompletedJobs = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return filteredCompletedJobs.value.slice(start, start + perPage.value);
});

const paginationRange = computed(() => {
  const total = filteredCompletedJobs.value.length;
  if (total === 0) return { start: 0, end: 0 };
  const start = (currentPage.value - 1) * perPage.value + 1;
  const end = Math.min(currentPage.value * perPage.value, total);
  return { start, end };
});

const displayedPages = computed(() => {
  const pages = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage.value - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1);
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

watch([searchQuery, unitFilter, yearFilter, crewTypeFilter, sortBy], () => {
  currentPage.value = 1;
});

const getMemberInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'Completed';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

const openTicketDetails = (ticket) => {
  selectedTicket.value = ticket;
};
</script>
