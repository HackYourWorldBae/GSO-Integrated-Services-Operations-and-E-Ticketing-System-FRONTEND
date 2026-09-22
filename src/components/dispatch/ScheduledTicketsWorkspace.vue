<template>
  <div class="space-y-4 animate-fade-in relative pb-12">

    <!-- ═══ Unified Compact Toolbar: Stage Tabs + Search + Filters + Refresh ═══ -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs">

      <!-- Top Row: Stage Tabs (Jobs, Borrowing & Collab) + Urgency Filter Pills -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-1.5 border-b border-slate-100">
        <!-- Stage Tabs -->
        <div class="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
          <!-- Tab: Job Schedules -->
          <button
            type="button"
            @click="switchScheduledTab('jobs')"
            :class="[
              'flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs active:scale-95',
              scheduledTab === 'jobs'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" :class="scheduledTab === 'jobs' ? 'text-white' : 'text-slate-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Job Schedules</span>
            <span
              :class="[
                'ml-1 px-2 py-0.5 rounded-full text-[10px] font-black leading-none',
                scheduledTab === 'jobs' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
              ]"
            >
              {{ scheduledTickets.length }}
            </span>
          </button>

          <!-- Tab (LEAU only): Borrowing Requests -->
          <button
            v-if="isLEAU"
            type="button"
            @click="switchScheduledTab('borrowing')"
            :class="[
              'flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs active:scale-95',
              scheduledTab === 'borrowing'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" :class="scheduledTab === 'borrowing' ? 'text-white' : 'text-slate-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>Borrowing Requests</span>
            <span
              :class="[
                'ml-1 px-2 py-0.5 rounded-full text-[10px] font-black leading-none',
                scheduledTab === 'borrowing' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
              ]"
            >
              {{ borrowingAwaitingCount }}
            </span>
          </button>

          <!-- Tab: Collab Tickets -->
          <button
            type="button"
            @click="switchScheduledTab('collab')"
            :class="[
              'flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs active:scale-95',
              scheduledTab === 'collab'
                ? 'bg-indigo-600 shadow-indigo-600/20 text-white shadow-md'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" :class="scheduledTab === 'collab' ? 'text-white' : 'text-indigo-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Collab Tickets</span>
            <span
              :class="[
                'ml-1 px-2 py-0.5 rounded-full text-[10px] font-black leading-none',
                scheduledTab === 'collab' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-900'
              ]"
            >
              {{ collabScheduledCount }}
            </span>
          </button>
        </div>

        <!-- Urgency Filters (job schedules only) -->
        <div class="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/60 text-xs font-bold self-start sm:self-auto flex-wrap sm:flex-nowrap gap-1">
          <button
            type="button"
            @click="setUrgencyFilter('all')"
            :class="[
              'px-3 py-1.5 min-h-[36px] rounded-lg transition-all cursor-pointer touch-manipulation',
              urgencyFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-800'
            ]"
          >
            All ({{ scheduledTickets.length }})
          </button>
          <button
            type="button"
            @click="setUrgencyFilter('emergency')"
            :class="[
              'px-3 py-1.5 min-h-[36px] rounded-lg transition-all cursor-pointer touch-manipulation',
              urgencyFilter === 'emergency'
                ? 'bg-rose-600 text-white shadow-xs font-black'
                : 'text-rose-600 hover:bg-rose-50'
            ]"
          >
            Emergency ({{ emergencyCount }})
          </button>
          <button
            type="button"
            @click="setUrgencyFilter('standard')"
            :class="[
              'px-3 py-1.5 min-h-[36px] rounded-lg transition-all cursor-pointer touch-manipulation',
              urgencyFilter === 'standard'
                ? 'bg-white text-slate-900 shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-800'
            ]"
          >
            Standard
          </button>
        </div>
      </div>

      <!-- Bottom Row: Search + Service Category Filter + Refresh (shared by jobs + collab; borrowing has its own search) -->
      <div v-if="!isLeauBorrowing" class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2">
        <!-- Search Input -->
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            @input="currentPage = 1"
            type="text"
            placeholder="Search ticket #, title, service, requester, worker, room..."
            :class="[
              'w-full pl-9 pr-9 py-2.5 min-h-[44px] rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-base sm:text-xs font-semibold placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:bg-white transition-all',
              themeFocusRing
            ]"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''; currentPage = 1"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer min-h-[44px] min-w-[44px] justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Service Filter Dropdown (job schedules only) -->
        <select
          v-if="scheduledTab === 'jobs'"
          v-model="selectedServiceFilter"
          @change="currentPage = 1"
          :class="[
            'px-3 py-2.5 min-h-[44px] rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-base sm:text-xs font-semibold focus:outline-none transition-all shrink-0 cursor-pointer',
            themeFocusBorder
          ]"
        >
          <option value="">All Services</option>
          <option v-for="service in uniqueServices" :key="service" :value="service">{{ service }}</option>
        </select>

        <!-- Refresh Button -->
        <button
          type="button"
          @click="refreshScheduledAll"
          :disabled="loading"
          class="p-2.5 min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all flex items-center justify-center disabled:opacity-50 shrink-0 cursor-pointer active:scale-95 touch-manipulation"
          title="Refresh scheduled tickets list"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            :class="{ 'animate-spin': loading }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>

    <!-- ═══ Borrowing Requests Pane (LEAU only, awaiting pickup) ═══ -->
    <div v-if="isLeauBorrowing">
      <BorrowingWorkspace initial-tab="awaiting" :show-tabs="false" :status-filter="['ready_for_pickup']" layout="table" :key="'scheduled-borrowing-' + scheduledTabRefreshKey" />
    </div>

    <!-- ═══ Collab Tickets Pane (shares the toolbar search + details modal above) ═══ -->
    <div v-if="isScheduledCollab">
      <CollabTicketsWorkspace
        :unit-code="props.unitCode"
        mode="scheduled"
        direction="all"
        :assign-route="`/admin/${props.unitCode.toLowerCase()}/assign-workers`"
        :show-dispatch-action="true"
        :hide-toolbar="true"
        :search-text="searchQuery"
        :emit-details="true"
        :key="'scheduled-collab-' + scheduledTabRefreshKey"
        @updated="onCollabUpdated"
        @open-details="openCollabDetails"
      />
    </div>

    <!-- ═══ Desktop Tabular View (Matching Approved Tickets Layout) ═══ -->
    <div v-if="!isLeauBorrowing && !isScheduledCollab" class="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th class="px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Ticket Ref</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Requester</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Location</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Target Schedule</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs">
            
            <!-- Loading State -->
            <tr v-if="loading && scheduledTickets.length === 0">
              <td colspan="5" class="py-16 text-center">
                <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-xs font-semibold">
                  <svg class="animate-spin h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading scheduled tickets...
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-else-if="paginatedTickets.length === 0">
              <td colspan="5" class="py-16 text-center">
                <div class="max-w-sm mx-auto flex flex-col items-center">
                  <div class="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p class="text-sm font-bold text-slate-700">No Scheduled Tickets Awaiting Start</p>
                  <p class="text-xs text-slate-400 mt-1">All dispatched tickets have been started, or no tickets are currently pending start.</p>
                </div>
              </td>
            </tr>

            <!-- Data Rows -->
            <tr
              v-for="ticket in paginatedTickets"
              :key="ticket.id"
              :id="'ticket-' + ticket.id"
              :class="[
                'transition-all duration-150 group cursor-pointer relative',
                themeHoverRow,
                isTicketHighlighted(ticket) ? 'bg-amber-50/80 ring-2 ring-amber-500' : ''
              ]"
              @click="openDetailsModal(ticket)"
            >
              <!-- Ticket Reference & Urgency -->
              <td class="px-4 py-2.5 whitespace-nowrap relative">
                <!-- Left hover indicator accent line -->
                <span
                  :class="[
                    'absolute left-0 top-2 bottom-2 w-1 rounded-r-sm opacity-0 group-hover:opacity-100 transition-opacity duration-150',
                    themeBarColor
                  ]"
                ></span>
                <div class="relative inline-flex items-center gap-1.5 flex-wrap">
                  <div
                    :class="[
                      'font-mono text-sm font-bold px-3 py-1 rounded-lg border inline-flex items-center transition-all duration-150 shadow-2xs',
                      themeMonoBadge
                    ]"
                  >
                    #{{ ticket.id }}
                  </div>
                  <span
                    v-if="ticket.is_emergency"
                    class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[9px] font-black uppercase tracking-wider border border-rose-200"
                  >
                    Emergency
                  </span>
                </div>
              </td>

              <!-- Requester -->
              <td class="px-3 py-2.5">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {{ getInitials(ticket.requester) }}
                  </div>
                  <div class="min-w-0">
                    <span class="text-xs font-semibold text-slate-800 truncate block max-w-[130px]">{{ ticket.requester }}</span>
                    <span v-if="ticket.contact_number && ticket.contact_number !== 'N/A'" class="text-[10px] text-slate-400 block">{{ ticket.contact_number }}</span>
                  </div>
                </div>
              </td>

              <!-- Location -->
              <td class="px-3 py-2.5 whitespace-nowrap">
                <div class="text-xs font-semibold text-slate-700">{{ ticket.location || ticket.college_building || 'Main Campus' }}</div>
                <div class="text-[10px] text-slate-400">{{ ticket.office_room ? `Rm ${ticket.office_room}` : '—' }}</div>
              </td>

              <!-- Target Schedule (date only — durations appear on Active tickets only) -->
              <td class="px-3 py-2.5 whitespace-nowrap">
                <div class="text-xs font-bold text-slate-800">
                  {{ formatDate(ticket.assignment?.implementation_date) }}
                </div>
                <div class="text-[10px] text-slate-400 font-medium mt-0.5">
                  Scheduled
                </div>
              </td>

              <!-- Actions -->
              <td class="px-3 py-3 whitespace-nowrap text-right" @click.stop>
                <div class="flex items-center justify-end gap-1.5">
                  <!-- Job Order Print / Preview Action Button -->
                  <button
                    type="button"
                    @click="openJobOrderDocument(ticket)"
                    class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold transition-all shadow-2xs active:scale-95 flex items-center gap-1.5 cursor-pointer border border-slate-200"
                    title="Print / View Job Order (Job Request Form)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    <span>Job Order</span>
                  </button>

                  <!-- Re-generate Document Button -->
                  <button
                    type="button"
                    @click="handleDirectRegenerate(ticket)"
                    class="p-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-900 border border-amber-200 text-xs font-bold transition-all shadow-2xs active:scale-95 flex items-center justify-center cursor-pointer"
                    title="Re-inject ticket data and generate fresh Job Order document"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>

                  <!-- Start Early Action Button -->
                  <button
                    type="button"
                    @click="initiateStartEarly(ticket)"
                    class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-black uppercase tracking-wider transition-all shadow-xs active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    title="Start job ahead of schedule"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                    <span>Start Early</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div v-if="filteredTickets.length > 0" class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Showing <span class="font-bold text-slate-800">{{ paginationRange.start }}</span> to <span class="font-bold text-slate-800">{{ paginationRange.end }}</span> of <span class="font-bold text-slate-800">{{ filteredTickets.length }}</span> tickets
        </div>
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold cursor-pointer transition-colors"
          >
            Previous
          </button>
          <div class="px-3 py-1.5 font-bold text-slate-700">
            {{ currentPage }} / {{ totalPages }}
          </div>
          <button
            type="button"
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold cursor-pointer transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- ═══ Mobile View (Cards) ═══ -->
    <div v-if="!isLeauBorrowing && !isScheduledCollab" class="md:hidden space-y-3">
      <!-- Loading State -->
      <div v-if="loading && scheduledTickets.length === 0" class="py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
        <div class="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
          <svg class="animate-spin h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading scheduled tickets...
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="paginatedTickets.length === 0" class="py-12 text-center bg-white rounded-2xl border border-slate-200 p-6">
        <div class="h-10 w-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p class="text-xs font-bold text-slate-700">No Scheduled Tickets Found</p>
        <p class="text-[10px] text-slate-400 mt-0.5">No tickets matching current filters.</p>
      </div>

      <!-- Mobile Ticket Cards -->
      <div
        v-for="ticket in paginatedTickets"
        :key="ticket.id"
        :id="'mob-ticket-' + ticket.id"
        :class="[
          'bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-3 cursor-pointer transition-all',
          isTicketHighlighted(ticket) ? 'ring-2 ring-amber-500 bg-amber-50/40' : ''
        ]"
        @click="openDetailsModal(ticket)"
      >
        <!-- Top Row: Ref & Target Date Badge -->
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span :class="['font-mono text-sm font-bold px-2.5 py-0.5 rounded-lg border transition-colors shrink-0 shadow-2xs', themeMonoBadge]">
              #{{ ticket.id }}
            </span>
            <span v-if="ticket.is_emergency" class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[9px] font-black uppercase tracking-wider border border-rose-200">
              Emergency
            </span>
          </div>
          <span class="text-[11px] font-bold px-2 py-0.5 rounded-lg border bg-amber-50 text-amber-800 border-amber-200 inline-flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ formatDate(ticket.assignment?.implementation_date) }}
          </span>
        </div>

        <!-- Location & Requester (job/service and personnel removed) -->
        <div class="mt-2 flex items-center justify-between text-xs text-slate-600">
          <div class="flex items-center gap-1.5 truncate">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="truncate">{{ ticket.location || ticket.college_building || 'Main Campus' }}{{ ticket.office_room ? ` (Rm ${ticket.office_room})` : '' }}</span>
          </div>
          <span class="text-xs font-semibold text-slate-700 truncate max-w-[140px]">{{ ticket.requester }}</span>
        </div>

        <!-- Card Actions -->
        <div class="flex items-center gap-2 pt-1 border-t border-slate-100 flex-wrap sm:flex-nowrap" @click.stop>
          <button
            type="button"
            @click="openJobOrderDocument(ticket)"
            class="flex-1 py-2.5 px-2.5 min-h-[38px] rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold text-center transition-all active:scale-95 cursor-pointer border border-slate-200 flex items-center justify-center gap-1 touch-manipulation"
            title="Print / View Job Order"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Job Order</span>
          </button>

          <button
            type="button"
            @click="handleDirectRegenerate(ticket)"
            class="py-2.5 px-2.5 min-h-[38px] rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold text-center transition-all active:scale-95 cursor-pointer border border-amber-200 flex items-center justify-center gap-1 touch-manipulation"
            title="Re-inject data and re-generate Job Order"
          >
            <svg class="h-3.5 w-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Re-gen</span>
          </button>

          <button
            type="button"
            @click="initiateStartEarly(ticket)"
            class="flex-1 py-2.5 px-3 min-h-[38px] rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-black text-center transition-all shadow-xs active:scale-95 cursor-pointer touch-manipulation flex items-center justify-center"
          >
            Start Early
          </button>
        </div>
      </div>

      <!-- Mobile Pagination -->
      <div v-if="filteredTickets.length > 0" class="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
        <button
          type="button"
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3.5 py-2 min-h-[38px] rounded-xl border border-slate-200 bg-slate-50 text-slate-700 disabled:opacity-40 font-bold touch-manipulation flex items-center justify-center"
        >
          Prev
        </button>
        <span class="font-bold text-slate-700">{{ currentPage }} / {{ totalPages }}</span>
        <button
          type="button"
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3.5 py-2 min-h-[38px] rounded-xl border border-slate-200 bg-slate-50 text-slate-700 disabled:opacity-40 font-bold touch-manipulation flex items-center justify-center"
        >
          Next
        </button>
      </div>
    </div>

    <!-- ═══ Full Ticket Details Modal (Matching Approved Tickets Layout) ═══ -->
    <Teleport to="body">
      <div
        v-if="selectedTicketForModal"
        class="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto pointer-events-auto"
        @click.self="selectedTicketForModal = null"
      >
        <div class="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 animate-scale-up flex flex-col max-h-[calc(100dvh-2rem)] sm:max-h-[88vh] overflow-hidden my-auto">
          
          <!-- Fixed Modal Header -->
          <div class="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 bg-white">
            <div>
              <div class="flex flex-wrap items-center gap-2.5 mb-1.5">
                <span
                  :class="[
                    'font-mono text-base sm:text-lg font-black px-3.5 py-1 rounded-xl border',
                    themeMonoBadge
                  ]"
                >
                  #{{ selectedTicketForModal.id }}
                </span>
                <span class="text-xs sm:text-sm font-bold text-slate-400">
                  Scheduled for {{ formatDate(selectedTicketForModal.assignment?.implementation_date || selectedTicketForModal.implementation_date) }}
                </span>
                <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider border border-amber-200">
                  Scheduled
                </span>
                <span
                  v-if="isCollabTicket(selectedTicketForModal)"
                  class="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase tracking-wider border border-indigo-200 inline-flex items-center gap-1 shadow-2xs"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-indigo-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Cross-Unit Collaboration
                </span>
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Scheduled Ticket Particulars</h3>
              <p class="text-xs text-slate-500 font-medium mt-0.5">Assigned personnel parameters, planned implementation schedule, and institutional particulars</p>
            </div>
            <button
              type="button"
              @click="selectedTicketForModal = null"
              class="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              title="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Scrollable Modal Body -->
          <div class="p-5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 custom-scrollbar text-xs flex-1">
            
            <!-- Cross-Unit Collaboration Personnel Section (Separated Per Unit) -->
            <div v-if="isCollabTicket(selectedTicketForModal)" class="space-y-3.5">
              <!-- Header Bar -->
              <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xs space-y-3">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <div class="flex items-center gap-2.5">
                    <span class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </span>
                    <div>
                      <span class="text-[10px] font-black uppercase tracking-widest text-indigo-300 block">Cross-Unit Joint Roster</span>
                      <p class="text-sm sm:text-base font-black text-white leading-none mt-0.5">Multi-Unit Dispatched Personnel</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-[11px] font-black border border-indigo-500/30">
                      {{ getTotalCollabWorkers(selectedTicketForModal) }} {{ getTotalCollabWorkers(selectedTicketForModal) === 1 ? 'Worker' : 'Total Workers' }}
                    </span>
                    <span class="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-500/30">
                      Scheduled
                    </span>
                  </div>
                </div>

                <!-- Joint Schedule & Scope Details -->
                <div class="pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
                  <div>
                    <span class="text-[9px] text-slate-400 uppercase font-black block">Planned Joint Start Date</span>
                    <span class="font-bold text-white text-xs sm:text-sm">{{ formatDate(selectedTicketForModal.assignment?.implementation_date || selectedTicketForModal.implementation_date) }}</span>
                  </div>
                  <div v-if="selectedTicketForModal.scope_of_work" class="text-right max-w-xs">
                    <span class="text-[9px] text-indigo-300 uppercase font-black block">Collaboration Scope</span>
                    <span class="text-[11px] text-slate-300 line-clamp-1 italic" :title="selectedTicketForModal.scope_of_work">"{{ selectedTicketForModal.scope_of_work }}"</span>
                  </div>
                </div>
              </div>

              <!-- Dedicated Card Per Participating Unit -->
              <div class="space-y-3">
                <div
                  v-for="unitGroup in getCollabUnitsWithWorkers(selectedTicketForModal)"
                  :key="unitGroup.code"
                  :class="[
                    'rounded-2xl border p-4 sm:p-5 transition-all shadow-xs',
                    unitGroup.code === 'LEAU'
                      ? 'bg-emerald-50/40 border-emerald-200/90'
                      : unitGroup.code === 'SSU'
                        ? 'bg-indigo-50/40 border-indigo-200/90'
                        : 'bg-amber-50/40 border-amber-200/90'
                  ]"
                >
                  <!-- Unit Header -->
                  <div
                    class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b"
                    :class="unitGroup.code === 'LEAU' ? 'border-emerald-200/60' : unitGroup.code === 'SSU' ? 'border-indigo-200/60' : 'border-amber-200/60'"
                  >
                    <div class="flex items-center gap-2.5 min-w-0">
                      <span
                        :class="[
                          'font-mono text-xs sm:text-sm font-black px-2.5 py-1 rounded-lg border shrink-0',
                          unitGroup.code === 'LEAU'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : unitGroup.code === 'SSU'
                              ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                              : 'bg-amber-100 text-amber-900 border-amber-300'
                        ]"
                      >
                        {{ unitGroup.code }}
                      </span>
                      <div class="min-w-0">
                        <div class="flex items-center gap-1.5 flex-wrap">
                          <h4 class="text-xs sm:text-sm font-black text-slate-900 leading-tight">{{ unitGroup.name }}</h4>
                          <span
                            v-if="unitGroup.isMyUnit"
                            class="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-slate-900 text-white"
                          >
                            Your Unit
                          </span>
                        </div>
                        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          {{ unitGroup.roleLabel }}
                        </span>
                      </div>
                    </div>

                    <!-- Dispatch Count / Status Badge -->
                    <div class="flex items-center gap-2">
                      <span
                        v-if="unitGroup.hasDispatched"
                        :class="[
                          'px-2.5 py-1 rounded-full text-[11px] font-black border flex items-center gap-1.5 shadow-2xs',
                          unitGroup.code === 'LEAU'
                            ? 'bg-emerald-100/90 text-emerald-800 border-emerald-300'
                            : unitGroup.code === 'SSU'
                              ? 'bg-indigo-100/90 text-indigo-800 border-indigo-300'
                              : 'bg-amber-100/90 text-amber-800 border-amber-300'
                        ]"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        {{ unitGroup.count }} {{ unitGroup.count === 1 ? 'Worker Assigned' : 'Workers Assigned' }}
                      </span>
                      <span
                        v-else
                        class="px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1.5 shadow-2xs"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Awaiting Dispatch
                      </span>
                    </div>
                  </div>

                  <!-- Unit Workers Roster -->
                  <div class="pt-3">
                    <div v-if="unitGroup.workers.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div
                        v-for="(worker, wIdx) in unitGroup.workers"
                        :key="worker.id || wIdx"
                        class="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors"
                      >
                        <!-- Avatar -->
                        <div
                          :class="[
                            'w-9 h-9 rounded-lg flex items-center justify-center font-black text-xs shrink-0 border',
                            unitGroup.code === 'LEAU'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              : unitGroup.code === 'SSU'
                                ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                                : 'bg-amber-100 text-amber-800 border-amber-200'
                          ]"
                        >
                          {{ getWorkerInitials(worker.name) }}
                        </div>
                        <!-- Info -->
                        <div class="min-w-0 flex-1">
                          <p class="text-xs sm:text-sm font-black text-slate-900 leading-tight truncate">{{ worker.name }}</p>
                          <div class="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span
                              :class="[
                                'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border truncate',
                                unitGroup.code === 'LEAU'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : unitGroup.code === 'SSU'
                                    ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                                    : 'bg-amber-50 text-amber-800 border-amber-200'
                              ]"
                            >
                              {{ worker.profession }}
                            </span>
                            <span v-if="worker.contact" class="text-[10px] text-slate-500 font-semibold flex items-center gap-1 truncate">
                              <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {{ worker.contact }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Empty State for this Unit -->
                    <div
                      v-else
                      class="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-white/80 border border-dashed border-slate-300 text-slate-600 text-xs"
                    >
                      <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>No personnel dispatched yet by <strong>{{ unitGroup.code }}</strong> for this scheduled engagement.</span>
                      </div>
                      <button
                        v-if="unitGroup.isMyUnit"
                        type="button"
                        @click="goToDispatchWorkers(selectedTicketForModal)"
                        class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider transition-all shadow-2xs active:scale-95 cursor-pointer shrink-0 inline-flex items-center gap-1.5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        <span>Dispatch {{ unitGroup.code }} Workers</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Standard Non-Collab Designated Personnel Banner -->
            <div v-else class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-950 to-slate-900 text-white space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-black uppercase tracking-widest text-amber-300">Designated Personnel</span>
                  <span v-if="getAssignedWorkers(selectedTicketForModal).length > 0" class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black">
                    {{ getAssignedWorkers(selectedTicketForModal).length }} {{ getAssignedWorkers(selectedTicketForModal).length === 1 ? 'Worker' : 'Workers' }}
                  </span>
                </div>
                <span class="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-500/30">
                  Awaiting Start
                </span>
              </div>

              <!-- Workers Grid -->
              <div v-if="getAssignedWorkers(selectedTicketForModal).length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div
                  v-for="(worker, wIdx) in getAssignedWorkers(selectedTicketForModal)"
                  :key="worker.id || wIdx"
                  class="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-white/10"
                >
                  <div class="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-black text-xs shrink-0">
                    {{ getWorkerInitials(worker.name) }}
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-xs sm:text-sm font-black text-white leading-tight truncate">{{ worker.name }}</p>
                    <div class="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 text-[10px] font-bold border border-amber-500/25 truncate">
                        {{ worker.profession }}
                      </span>
                      <span v-if="worker.contact" class="text-[10px] text-slate-400 truncate">
                        {{ worker.contact }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-xs text-slate-400 italic">
                No personnel assigned yet.
              </div>

              <div class="pt-2 border-t border-white/10 text-[11px] text-slate-300">
                <div>
                  <span class="text-[9px] text-slate-400 uppercase font-black block">Planned Start Date</span>
                  <span class="font-bold text-white">{{ formatDate(selectedTicketForModal.assignment?.implementation_date || selectedTicketForModal.implementation_date) }}</span>
                </div>
              </div>
            </div>

            <!-- Requester & Location Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <!-- Requester Profile -->
              <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Requester Profile</span>
                <p class="text-base sm:text-lg font-black text-slate-900 leading-tight">{{ selectedTicketForModal.requester }}</p>
                <p class="text-xs text-slate-600 font-semibold flex items-center gap-2">
                  <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <span class="truncate">{{ selectedTicketForModal.email || 'No institutional email' }}</span>
                </p>
                <a
                  v-if="selectedTicketForModal.contact_number && selectedTicketForModal.contact_number !== 'N/A'"
                  :href="`tel:${selectedTicketForModal.contact_number}`"
                  class="inline-flex items-center gap-2 mt-1 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors group w-fit"
                >
                  <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <span class="text-base sm:text-lg font-black font-mono tracking-wide text-emerald-800 group-hover:text-emerald-900">{{ selectedTicketForModal.contact_number }}</span>
                </a>
                <p v-else class="text-xs text-slate-400 font-semibold flex items-center gap-2 mt-1">
                  <svg class="w-4 h-4 text-slate-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <span>No contact number on file</span>
                </p>
              </div>

              <!-- Designated Location -->
              <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Designated Location</span>
                <p class="text-base sm:text-lg font-black text-slate-900 leading-tight">{{ selectedTicketForModal.location || selectedTicketForModal.college_building || 'Main Campus' }}</p>
                <p class="text-xs text-slate-600 font-semibold flex items-center gap-2">
                  <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                  <span>{{ selectedTicketForModal.office_room ? `Room / Office: ${selectedTicketForModal.office_room}` : 'No specific room designated' }}</span>
                </p>
              </div>
            </div>

            <!-- Borrowing Request Particulars -->
            <BorrowingDetailsSection
              v-if="isBorrowingService(selectedTicketForModal) || selectedTicketForModal?.borrowing"
              :ticket="selectedTicketForModal"
            />

            <!-- Service & Job Particulars (Non-borrowing requests) -->
            <div v-else class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <div class="flex items-center justify-between gap-3">
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Job Particular &amp; Nature of Work</span>
                <span
                  :class="[
                    'px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border',
                    themeStatusBadge
                  ]"
                >
                  {{ selectedTicketForModal.service || selectedTicketForModal.type }}
                </span>
              </div>
              <p class="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-wrap bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/70 shadow-2xs">
                {{ selectedTicketForModal.job_description || selectedTicketForModal.description || selectedTicketForModal.title || 'No detailed scope notes provided.' }}
              </p>
            </div>

            <!-- Official Job Order Document Section (Non-borrowing requests) -->
            <div v-if="!isBorrowingService(selectedTicketForModal) && !selectedTicketForModal?.borrowing" class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div :class="['w-10 h-10 rounded-xl flex items-center justify-center font-bold border shrink-0', themeAttachmentIconBg]">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                      Official Job Order (QM-GSO-{{ unitCode }}-01)
                    </h4>
                    <p class="text-[11px] text-slate-500 font-medium mt-0.5">
                      Official job request document filled with requester information, location, designated personnel, and scheduled dates to issue before starting the job.
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                  <button
                    type="button"
                    @click="handleDirectRegenerate(selectedTicketForModal)"
                    class="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black uppercase tracking-wider transition-all shadow-xs active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Re-inject latest ticket data and generate fresh document"
                  >
                    <svg class="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Re-generate</span>
                  </button>

                  <button
                    type="button"
                    @click="openJobOrderDocument(selectedTicketForModal)"
                    class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider transition-all shadow-xs active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    <span>Print / View Job Order</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Attachments & Proof Documents -->
            <div class="space-y-2.5">
              <span class="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <span :class="['w-2 h-3 rounded-full', themeBarColor]"></span>
                Attached images and documents ({{ (selectedTicketForModal.attachments || []).length }})
              </span>

              <div v-if="!selectedTicketForModal.attachments || selectedTicketForModal.attachments.length === 0" class="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-slate-400 text-xs">
                No files or images attached to this ticket.
              </div>

              <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div
                  v-for="(file, idx) in selectedTicketForModal.attachments"
                  :key="idx"
                  @click="downloadAttachment(file)"
                  :class="[
                    'flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200 cursor-pointer transition-all shadow-2xs group',
                    themeAttachmentHover
                  ]"
                >
                  <div class="flex items-center gap-2.5 truncate">
                    <div :class="['w-8 h-8 rounded-xl flex items-center justify-center shrink-0', themeAttachmentIconBg]">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                      </svg>
                    </div>
                    <span class="text-xs font-bold text-slate-800 truncate group-hover:text-slate-900">{{ file.file_name || 'Attachment' }}</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 group-hover:text-slate-700 shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Fixed Modal Footer Actions -->
          <div class="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              @click="selectedTicketForModal = null"
              class="w-full sm:w-auto px-5 py-2.5 min-h-[40px] rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs touch-manipulation flex items-center justify-center"
            >
              Close Full Info
            </button>

            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <!-- Collaborating Unit Dispatch Worker Shortcut -->
              <button
                v-if="isCollabTicket(selectedTicketForModal) && canDispatchCollabWorkers(selectedTicketForModal)"
                type="button"
                @click="goToDispatchWorkers(selectedTicketForModal)"
                class="px-4 py-2.5 min-h-[40px] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider transition-all shadow-xs active:scale-95 cursor-pointer touch-manipulation flex items-center justify-center gap-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>Dispatch {{ props.unitCode }} Workers</span>
              </button>

              <button
                type="button"
                @click="openJobOrderDocument(selectedTicketForModal)"
                class="px-4 py-2.5 min-h-[40px] rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-black uppercase tracking-wider transition-all shadow-2xs active:scale-95 cursor-pointer touch-manipulation flex items-center justify-center gap-1.5"
                title="Print official Job Order document"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Print Job Order</span>
              </button>

              <button
                type="button"
                @click="handleModalStartEarly"
                class="px-5 py-2.5 min-h-[40px] rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-black uppercase tracking-wider transition-all shadow-xs active:scale-95 cursor-pointer touch-manipulation flex items-center justify-center gap-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
                <span>Start Job Early</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </Teleport>

    <!-- Confirm Modal for Start Early -->
    <ConfirmModal
      :is-open="showConfirmModal"
      title="Start Job Early?"
      message="This will mark the ticket as officially started today, transitioning it into active progress. Continue?"
      confirm-text="Yes, Start Now"
      cancel-text="Cancel"
      type="warning"
      @confirm="executeConfirmedAction"
      @cancel="closeConfirmModal"
    />

    <!-- Document Viewer Modal for Job Order & Attachments -->
    <DocumentViewerModal
      :is-open="viewerModal.isOpen"
      :title="viewerModal.title"
      :file-name="viewerModal.fileName"
      :file-blob="viewerModal.fileBlob"
      :allow-regenerate="viewerModal.allowRegenerate"
      :is-regenerating="viewerModal.isRegenerating"
      @regenerate="handleRegenerateJobOrder"
      @close="viewerModal.isOpen = false"
    />

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/api/client';
import { toast } from 'vue3-toastify';
import ConfirmModal from '@/components/ConfirmModal.vue';
import DocumentViewerModal from '@/components/DocumentViewerModal.vue';
import BorrowingWorkspace from '@/components/dispatch/BorrowingWorkspace.vue';
import BorrowingDetailsSection from '@/components/dispatch/BorrowingDetailsSection.vue';
import CollabTicketsWorkspace from '@/components/dispatch/CollabTicketsWorkspace.vue';
import { fetchCollabTickets, getTicketCollaborations } from '@/api/collaborations';
import { getBorrowingQueue } from '@/api/borrowing';
import { isBorrowingService } from '@/utils/borrowing';
import { generateFgmuJobRequestFormDocxBlob } from '@/utils/fgmuDocxGenerator';
import { parseDateLocal } from '@/utils/workCalendar';
import { getAssignedWorkers, getWorkerInitials } from '@/utils/ticketPersonnelHelper';

const props = defineProps({
  unitCode: {
    type: String,
    required: true
  },
  unitTitle: {
    type: String,
    default: ''
  }
});

const router = useRouter();
const route = useRoute();

// State
const rawTickets = ref([]);
const loading = ref(false);
const searchQuery = ref('');
const urgencyFilter = ref('all');
const selectedServiceFilter = ref('');
const currentPage = ref(1);
const pageSize = ref(10);

// Modal state
const selectedTicketForModal = ref(null);
const showConfirmModal = ref(false);
const pendingTicketId = ref(null);

// Document Viewer state
const viewerModal = reactive({
  isOpen: false,
  title: '',
  fileName: '',
  fileBlob: null,
  allowRegenerate: false,
  isRegenerating: false,
});

const activeJobOrderTicket = ref(null);

// Unit Theme Computeds
const isLEAU = computed(() => props.unitCode?.toUpperCase() === 'LEAU');

// Inner stage tabs (director-style): job schedules vs borrowing (LEAU) vs collab.
const scheduledTab = ref('jobs');
const borrowingAwaitingCount = ref(0);
const collabScheduledCount = ref(0);
// Live-collab ticket ids — these live ONLY in the Collab tab, never in Job Schedules.
const collabScheduledIds = ref(new Set());
const scheduledTabRefreshKey = ref(0);
const isLeauBorrowing = computed(() => isLEAU.value && scheduledTab.value === 'borrowing');
const isScheduledCollab = computed(() => scheduledTab.value === 'collab');

const clearRouteQueryTicket = () => {
  if (route.query.ticketId || route.query.highlight || route.query._t) {
    const nextQuery = { ...route.query };
    delete nextQuery.ticketId;
    delete nextQuery.highlight;
    delete nextQuery._t;
    router.replace({ path: route.path, query: nextQuery }).catch(() => {});
  }
};

const switchScheduledTab = (tab) => {
  scheduledTab.value = tab === 'borrowing' ? 'borrowing' : tab === 'collab' ? 'collab' : 'jobs';
  currentPage.value = 1;
  // Close any open ticket modal and drop consumed deep-link params so
  // switching tabs never re-triggers the details modal.
  selectedTicketForModal.value = null;
  const nextQuery = { ...route.query };
  delete nextQuery.ticketId;
  delete nextQuery.highlight;
  delete nextQuery._t;
  if (scheduledTab.value === 'borrowing' || scheduledTab.value === 'collab') {
    nextQuery.tab = scheduledTab.value;
  } else {
    delete nextQuery.tab;
  }
  router.replace({ path: route.path, query: nextQuery }).catch(() => {});
  if (scheduledTab.value === 'borrowing') {
    scheduledTabRefreshKey.value += 1;
    fetchBorrowingCount();
  }
  if (scheduledTab.value === 'collab') {
    scheduledTabRefreshKey.value += 1;
    fetchCollabScheduledCount();
  }
};

const fetchCollabScheduledCount = async () => {
  try {
    const res = await fetchCollabTickets({ direction: 'all', stage: 'scheduled' });
    const list = res.data?.data?.tickets || [];
    collabScheduledCount.value = res.data?.data?.count ?? list.length;
    collabScheduledIds.value = new Set(
      list
        .filter(t => ['pending', 'accepted'].includes(String(t.collaboration_status || '')))
        .map(t => String(t.id))
    );
  } catch {
    collabScheduledCount.value = 0;
    collabScheduledIds.value = new Set();
  }
};

const onCollabUpdated = async () => {
  scheduledTabRefreshKey.value += 1;
  await fetchCollabScheduledCount();
  await fetchScheduledTickets();
};

const refreshScheduledAll = async () => {
  scheduledTabRefreshKey.value += 1;
  await Promise.all([fetchScheduledTickets(), fetchCollabScheduledCount()]);
};

const fetchBorrowingCount = async () => {
  if (!isLEAU.value) return;
  try {
    const res = await getBorrowingQueue({ per_page: 500 });
    const list = res.data?.data?.borrowing_requests || [];
    borrowingAwaitingCount.value = list.filter(r => r.status === 'ready_for_pickup').length;
  } catch {
    borrowingAwaitingCount.value = 0;
  }
};

const themeAccentBg = computed(() => {
  return isLEAU.value ? 'bg-amber-600 hover:bg-amber-700' : 'bg-amber-600 hover:bg-amber-700';
});

const themeAccentShadow = computed(() => {
  return 'shadow-amber-600/25';
});

const themeBarColor = computed(() => {
  return isLEAU.value ? 'bg-amber-500' : 'bg-emerald-500';
});

const themeMonoBadge = computed(() => {
  return isLEAU.value
    ? 'bg-amber-50 text-amber-800 border-amber-200/80 group-hover:border-amber-400 group-hover:bg-amber-100/80'
    : 'bg-emerald-50 text-emerald-800 border-emerald-200/80 group-hover:border-emerald-400 group-hover:bg-emerald-100/80';
});

const themeStatusBadge = computed(() => {
  return isLEAU.value ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200';
});

const themeFocusRing = computed(() => {
  return isLEAU.value ? 'focus:ring-amber-500/30 focus:border-amber-500' : 'focus:ring-emerald-500/30 focus:border-emerald-500';
});

const themeFocusBorder = computed(() => {
  return isLEAU.value ? 'focus:border-amber-500' : 'focus:border-emerald-500';
});

const themeText = computed(() => {
  return isLEAU.value ? 'text-amber-700' : 'text-emerald-700';
});

const themeHoverRow = computed(() => {
  return isLEAU.value ? 'hover:bg-amber-50/20' : 'hover:bg-emerald-50/20';
});

const themeAttachmentHover = computed(() => {
  return isLEAU.value ? 'hover:border-amber-500 hover:bg-amber-50/40' : 'hover:border-emerald-500 hover:bg-emerald-50/40';
});

const themeAttachmentIconBg = computed(() => {
  return isLEAU.value ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700';
});

// Scheduled tickets: step 4, excluding live collab tickets —
// those live ONLY in the Collab tab (same ticket list, one home).
const scheduledTickets = computed(() => {
  return rawTickets.value.filter(t => t.current_step == 4 && !collabScheduledIds.value.has(String(t.id)));
});

const emergencyCount = computed(() => {
  return scheduledTickets.value.filter(t => !!t.is_emergency).length;
});

const uniqueServices = computed(() => {
  const set = new Set();
  scheduledTickets.value.forEach(t => {
    const s = t.service || t.type;
    if (s) set.add(s);
  });
  return Array.from(set).sort();
});

const filteredTickets = computed(() => {
  let list = scheduledTickets.value;

  // Urgency filter
  if (urgencyFilter.value === 'emergency') {
    list = list.filter(t => !!t.is_emergency);
  } else if (urgencyFilter.value === 'standard') {
    list = list.filter(t => !t.is_emergency);
  }

  // Service filter
  if (selectedServiceFilter.value) {
    list = list.filter(t => (t.service || t.type) === selectedServiceFilter.value);
  }

  // Search query
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(t => {
      const idMatch = String(t.id).includes(q);
      const reqMatch = (t.requester || '').toLowerCase().includes(q);
      const titleMatch = (t.title || t.job_description || '').toLowerCase().includes(q);
      const serviceMatch = (t.service || t.type || '').toLowerCase().includes(q);
      const workerMatch = (t.assignment?.personnel_name || '').toLowerCase().includes(q);
      const roomMatch = (t.office_room || t.location || '').toLowerCase().includes(q);
      return idMatch || reqMatch || titleMatch || serviceMatch || workerMatch || roomMatch;
    });
  }

  return list;
});

const totalPages = computed(() => {
  return Math.ceil(filteredTickets.value.length / pageSize.value) || 1;
});

const paginatedTickets = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredTickets.value.slice(start, start + pageSize.value);
});

const paginationRange = computed(() => {
  if (filteredTickets.value.length === 0) return { start: 0, end: 0 };
  const start = (currentPage.value - 1) * pageSize.value + 1;
  const end = Math.min(currentPage.value * pageSize.value, filteredTickets.value.length);
  return { start, end };
});

const setUrgencyFilter = (val) => {
  urgencyFilter.value = val;
  currentPage.value = 1;
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const getInitials = (name) => {
  if (!name || name === '??') return 'U';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const parsed = parseDateLocal(dateStr);
  if (!parsed || isNaN(parsed.getTime())) return dateStr;
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(dateStr).trim())) {
    return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  return parsed.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
};

const mapTicket = (input) => {
  const t = input?.ticket || input || {};
  const requesterName = t.requester 
    || t.requestedBy
    || t.requested_by
    || t.details?.requesting_personnel
    || t.details?.end_user
    || (t.user ? `${t.user.first_name || ''} ${t.user.last_name || ''}`.trim() : '')
    || (t.first_name || t.last_name ? `${t.first_name || ''} ${t.last_name || ''}`.trim() : '')
    || 'End User';

  const assignmentObj = t.assignment || (Array.isArray(t.assignments) && t.assignments[0]) || null;
  const assignmentsArr = Array.isArray(t.assignments) ? t.assignments : (assignmentObj ? [assignmentObj] : []);
  const workingDaysVal = t.working_days || t.project_working_days || assignmentObj?.working_days || t.workingDays || t.eodb_days || null;
  const implDate = assignmentObj?.implementation_date || t.implementation_date || t.implementationDate || t.project_target_date || null;

  return {
    ...t,
    id: t.id,
    ticketId: t.id,
    title: t.title || t.project_title || t.job_description || t.description || 'Service Request',
    service: t.service || t.service_type || t.type || 'General',
    service_type: t.service_type || t.service || 'General',
    type: t.service || t.service_type || t.title || t.type || 'Service Request',
    location: t.location || t.college_building || t.details?.college_building || 'Campus Facility',
    college_building: t.details?.college_building || t.college_building || t.location || 'Campus Facility',
    office_room: t.details?.office_room || t.office_room || 'N/A',
    source_of_fund: t.details?.source_of_fund || t.source_of_fund || 'N/A',
    contact_number: t.contact_number || t.requester_contact || t.details?.contact_number || t.details?.contact_no || t.user?.contact_number || 'N/A',
    requester: requesterName,
    requestedBy: requesterName,
    email: t.email || t.user?.email || '',
    status: t.status,
    is_emergency: !!(t.is_emergency || t.urgency === 'High' || t.urgency === 'Emergency'),
    job_description: t.description || t.job_description || t.title || '',
    attachments: t.attachments || [],
    submitted_at: t.submitted_at || t.created_at,
    reviewed_at: t.reviewed_at || t.approved_at,
    assignment: assignmentObj,
    assignments: assignmentsArr,
    assignedWorker: assignmentObj?.personnel_name || t.assignedWorker || null,
    assignedProfession: assignmentObj?.specialty || assignmentObj?.profession || t.assignedProfession || null,
    working_days: workingDaysVal,
    workingDays: workingDaysVal,
    implementation_date: implDate,
    implementationDate: implDate,
    feedback: t.feedback || null,
    details: t.details || null,
  };
};

const fetchScheduledTickets = async () => {
  loading.value = true;
  try {
    const res = await api.get(`/tickets/active/${props.unitCode}`);
    const rawData = res.data?.data?.tickets || res.data?.data || [];
    rawTickets.value = Array.isArray(rawData) ? rawData.map(mapTicket) : [];
  } catch (err) {
    console.error(`Failed to load ${props.unitCode} scheduled tickets:`, err);
    toast.error('Failed to load scheduled tickets.');
  } finally {
    loading.value = false;
  }
};

const isCollabTicket = (ticket) => {
  if (!ticket) return false;
  if (ticket.is_collab) return true;
  if (collabScheduledIds.value?.has(String(ticket.id))) return true;
  if (isScheduledCollab.value) return true;
  if (ticket.collaborating_unit_code || ticket.collaborating_unit_id) return true;
  if (Array.isArray(ticket.collaborations) && ticket.collaborations.length > 0) return true;
  return false;
};

const getUnitTheme = (unitCode) => {
  const code = String(unitCode || '').toUpperCase().trim();
  if (code === 'LEAU') {
    return {
      containerClass: 'bg-emerald-50/40 border-emerald-200/80',
      borderClass: 'border-emerald-100',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      avatarClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      specBadgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
  }
  if (code === 'SSU') {
    return {
      containerClass: 'bg-indigo-50/40 border-indigo-200/80',
      borderClass: 'border-indigo-100',
      badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-300',
      avatarClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      specBadgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    };
  }
  return {
    containerClass: 'bg-amber-50/40 border-amber-200/80',
    borderClass: 'border-amber-100',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
    avatarClass: 'bg-amber-50 text-amber-700 border-amber-200',
    specBadgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
  };
};

const getUnitFullName = (unitCode) => {
  const code = String(unitCode || '').toUpperCase().trim();
  if (code === 'LEAU') return 'Landscaping & Environmental Aesthetics Unit';
  if (code === 'SSU') return 'Security Services Unit';
  return 'Facilities & Grounds Management Unit';
};

const getCollabUnitsWithWorkers = (ticket) => {
  if (!ticket) return [];

  // 1. Determine primary / requesting unit
  const primaryCode = String(
    ticket.requesting_unit_code ||
    ticket.unit_code ||
    (ticket.unit_id === 2 ? 'LEAU' : ticket.unit_id === 3 ? 'SSU' : 'FGMU')
  ).toUpperCase();

  // 2. Determine collaborating unit(s)
  const collabCodes = new Set();
  if (ticket.collaborating_unit_code) {
    collabCodes.add(String(ticket.collaborating_unit_code).toUpperCase());
  }
  if (Array.isArray(ticket.collaborations)) {
    ticket.collaborations.forEach((c) => {
      const code = c.collaborating_unit_code || (c.collaborating_unit_id === 2 ? 'LEAU' : c.collaborating_unit_id === 3 ? 'SSU' : 'FGMU');
      if (code) collabCodes.add(String(code).toUpperCase());
    });
  }

  // If no collab unit was explicitly found yet, infer counterpart
  if (collabCodes.size === 0) {
    const myCode = String(props.unitCode || '').toUpperCase();
    if (myCode && myCode !== primaryCode) {
      collabCodes.add(myCode);
    } else {
      collabCodes.add(primaryCode === 'FGMU' ? 'LEAU' : 'FGMU');
    }
  }

  // 3. Gather all workers
  const allWorkers = [];

  // From nested collab.personnel
  if (Array.isArray(ticket.collaborations)) {
    ticket.collaborations.forEach((c) => {
      const cCode = String(c.collaborating_unit_code || (c.collaborating_unit_id === 2 ? 'LEAU' : c.collaborating_unit_id === 3 ? 'SSU' : 'FGMU')).toUpperCase();
      if (Array.isArray(c.personnel)) {
        c.personnel.forEach((p) => {
          allWorkers.push({
            id: p.personnel_id || p.id,
            name: p.name || p.worker_name,
            profession: p.specialty || p.profession || 'Personnel',
            contact: p.contact || p.contact_number || '',
            unit_code: String(p.unit_code || cCode).toUpperCase(),
          });
        });
      }
    });
  }

  // From my_unit_assignments
  if (Array.isArray(ticket.my_unit_assignments)) {
    const myCode = String(props.unitCode || '').toUpperCase();
    ticket.my_unit_assignments.forEach((a) => {
      allWorkers.push({
        id: a.personnel_id || a.id,
        name: a.worker_name || a.personnel_name || a.name,
        profession: a.worker_specialty || a.specialty || 'Personnel',
        contact: a.personnel_contact || a.contact || '',
        unit_code: String(a.worker_unit_code || myCode).toUpperCase(),
      });
    });
  }

  // From other_unit_assignments
  if (Array.isArray(ticket.other_unit_assignments)) {
    const firstCollabCode = Array.from(collabCodes)[0] || '';
    ticket.other_unit_assignments.forEach((a) => {
      allWorkers.push({
        id: a.personnel_id || a.id,
        name: a.worker_name || a.personnel_name || a.name,
        profession: a.worker_specialty || a.specialty || 'Personnel',
        contact: a.personnel_contact || a.contact || '',
        unit_code: String(a.worker_unit_code || firstCollabCode).toUpperCase(),
      });
    });
  }

  // From ticket.assignments or ticket.collab_assignments
  const rawAssigns = Array.isArray(ticket.collab_assignments) && ticket.collab_assignments.length > 0
    ? ticket.collab_assignments
    : Array.isArray(ticket.assignments) ? ticket.assignments : [];

  rawAssigns.forEach((a) => {
    const uCode = String(a.worker_unit_code || a.unit_code || '').toUpperCase();
    allWorkers.push({
      id: a.personnel_id || a.id,
      name: a.worker_name || a.personnel_name || a.name,
      profession: a.worker_specialty || a.specialty || a.profession || 'Personnel',
      contact: a.personnel_contact || a.contact || '',
      unit_code: uCode,
    });
  });

  // Also include standard extracted workers
  const standardWorkers = getAssignedWorkers(ticket);
  standardWorkers.forEach((w) => {
    allWorkers.push({
      id: w.id,
      name: w.name,
      profession: w.profession,
      contact: w.contact,
      unit_code: String(w.unit_code || '').toUpperCase(),
    });
  });

  // 4. Structure by units: Primary Unit first, then Collaborating Unit(s)
  const orderedCodes = [primaryCode, ...Array.from(collabCodes).filter(c => c !== primaryCode)];

  return orderedCodes.map((code) => {
    const isPrimary = code === primaryCode;
    const isMyUnit = String(props.unitCode || '').toUpperCase() === code;
    
    // Filter and deduplicate workers for this unit
    const seen = new Set();
    const unitWorkers = [];

    allWorkers.forEach((w) => {
      if (!w || !w.name) return;
      const cleanName = String(w.name).trim();
      const lowerKey = cleanName.toLowerCase();
      if (seen.has(lowerKey)) return;

      let belongs = false;
      if (w.unit_code) {
        belongs = (w.unit_code === code);
      } else if (isPrimary) {
        // Untagged workers default to primary requesting unit
        belongs = true;
      }

      if (belongs) {
        seen.add(lowerKey);
        unitWorkers.push({
          ...w,
          name: cleanName,
        });
      }
    });

    return {
      code,
      name: getUnitFullName(code),
      isPrimary,
      isMyUnit,
      roleLabel: isPrimary ? 'Primary Requesting Unit' : 'Collaborating Sub-Unit',
      theme: getUnitTheme(code),
      workers: unitWorkers,
      count: unitWorkers.length,
      hasDispatched: unitWorkers.length > 0,
    };
  });
};

const getTotalCollabWorkers = (ticket) => {
  const groups = getCollabUnitsWithWorkers(ticket);
  return groups.reduce((acc, g) => acc + g.workers.length, 0);
};

const canDispatchCollabWorkers = (ticket) => {
  if (!ticket) return false;
  const myCode = String(props.unitCode || '').toUpperCase();
  const groups = getCollabUnitsWithWorkers(ticket);
  const myGroup = groups.find(g => g.code === myCode);
  return myGroup && myGroup.workers.length === 0;
};

const goToDispatchWorkers = (ticket) => {
  if (!ticket) return;
  const tId = ticket.id;
  selectedTicketForModal.value = null;
  router.push(`/admin/${props.unitCode.toLowerCase()}/assign-workers?ticket=${tId}&collab=1`);
};

const openDetailsModal = async (ticket) => {
  if (!ticket) return;
  selectedTicketForModal.value = ticket;

  if (isBorrowingService(ticket) && (!ticket.borrowing || !ticket.borrowing.item_name_requested)) {
    try {
      const res = await api.get(`tickets/${ticket.id}`);
      const freshTicket = res.data?.data?.ticket || res.data?.data;
      if (freshTicket && selectedTicketForModal.value && String(selectedTicketForModal.value.id) === String(ticket.id)) {
        selectedTicketForModal.value = {
          ...selectedTicketForModal.value,
          ...freshTicket,
          borrowing: freshTicket.borrowing || freshTicket.details || selectedTicketForModal.value.borrowing,
        };
      }
    } catch (err) {
      console.warn('Could not refresh borrowing ticket details for modal:', err);
    }
  }

  if (isCollabTicket(ticket)) {
    try {
      const res = await getTicketCollaborations(ticket.id);
      const payload = res.data?.data;
      if (payload) {
        const rawList = Array.isArray(payload) ? payload : (payload.collaborations || []);
        const assigns = Array.isArray(payload.assignments) ? payload.assignments : [];
        if (selectedTicketForModal.value && String(selectedTicketForModal.value.id) === String(ticket.id)) {
          selectedTicketForModal.value = {
            ...selectedTicketForModal.value,
            is_collab: true,
            collaborations: rawList,
            collab_assignments: assigns,
          };
        }
      }
    } catch (err) {
      // Non-blocking
    }
  }
};

// Collab-tab rows reuse this workspace's rich details modal (personnel
// banner, job order docs, attachments) so both tabs share one design.
// Collab tickets stay in rawTickets — only the Job Schedules list excludes
// them — so resolve the full mapped row locally, refreshing from the server.
const openCollabDetails = async (collabTicket) => {
  const target = String(collabTicket?.id || '').toLowerCase().trim();
  const local = rawTickets.value.find(t =>
    String(t.id || t.ticketId || '').toLowerCase().trim() === target
  );
  
  const baseTicket = {
    ...(local || {}),
    ...(collabTicket || {}),
    is_collab: true,
  };
  selectedTicketForModal.value = baseTicket;

  try {
    const [ticketRes, collabRes] = await Promise.allSettled([
      api.get(`tickets/${collabTicket.id}`),
      getTicketCollaborations(collabTicket.id),
    ]);

    let mapped = baseTicket;
    if (ticketRes.status === 'fulfilled') {
      const raw = ticketRes.value.data?.data?.ticket || ticketRes.value.data?.data;
      if (raw) {
        mapped = { ...baseTicket, ...mapTicket(raw) };
      }
    }

    let collabRecords = collabTicket.collaborations || [];
    let collabAssignments = collabTicket.assignments || [];

    if (collabRes.status === 'fulfilled') {
      const payload = collabRes.value.data?.data;
      if (payload) {
        const rawList = Array.isArray(payload)
          ? payload
          : (payload.collaborations || payload.data || []);
        if (Array.isArray(rawList) && rawList.length > 0) {
          collabRecords = rawList;
        }
        if (Array.isArray(payload.assignments) && payload.assignments.length > 0) {
          collabAssignments = payload.assignments;
        }
      }
    }

    selectedTicketForModal.value = {
      ...baseTicket,
      ...mapped,
      is_collab: true,
      requesting_unit_code: collabTicket.requesting_unit_code || mapped.requesting_unit_code || mapped.unit_code,
      collaborating_unit_code: collabTicket.collaborating_unit_code || mapped.collaborating_unit_code,
      scope_of_work: collabTicket.scope_of_work || mapped.scope_of_work || collabTicket.collaboration_reason,
      collaborations: collabRecords,
      collab_assignments: collabAssignments,
      assignments: collabAssignments.length > 0 ? collabAssignments : (mapped.assignments || collabTicket.assignments || []),
      my_unit_assignments: collabTicket.my_unit_assignments || [],
      other_unit_assignments: collabTicket.other_unit_assignments || [],
    };
  } catch (err) {
    console.error('Failed to refresh collab ticket details:', err);
  }
};

const initiateStartEarly = (ticket) => {
  pendingTicketId.value = ticket.id;
  showConfirmModal.value = true;
};

const handleModalStartEarly = () => {
  if (!selectedTicketForModal.value) return;
  pendingTicketId.value = selectedTicketForModal.value.id;
  selectedTicketForModal.value = null;
  showConfirmModal.value = true;
};

const closeConfirmModal = () => {
  showConfirmModal.value = false;
  pendingTicketId.value = null;
};

const executeConfirmedAction = async () => {
  if (pendingTicketId.value) {
    await performStartEarly(pendingTicketId.value);
  }
  closeConfirmModal();
};

const performStartEarly = async (ticketId) => {
  loading.value = true;
  try {
    await api.post('/dispatch/start', { ticket_id: ticketId });
    toast.success('Job started! Redirecting to Active Tickets.');
    await fetchScheduledTickets();
    router.push(`/admin/${props.unitCode.toLowerCase()}/active-tickets`);
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || 'Failed to start job early.');
  } finally {
    loading.value = false;
  }
};

const openJobOrderDocument = async (ticket) => {
  if (!ticket) return;
  activeJobOrderTicket.value = ticket;
  try {
    const ticketId = ticket.ticketId || ticket.id;
    const unit = props.unitCode?.toUpperCase() || ticket.unit_code || 'FGMU';
    viewerModal.title = `${unit} Job Order (Job Request Form) - #${ticketId}`;
    viewerModal.fileName = `${unit}_Job_Order_#${ticketId}.docx`;
    viewerModal.fileBlob = null;
    viewerModal.allowRegenerate = true;
    viewerModal.isRegenerating = false;
    viewerModal.isOpen = true;

    // Fetch fresh ticket data from server to ensure latest assignments & details
    let freshTicket = ticket;
    try {
      const res = await api.get(`tickets/${ticketId}`);
      const raw = res.data?.data?.ticket || res.data?.data;
      if (raw) {
        freshTicket = mapTicket(raw);
        activeJobOrderTicket.value = freshTicket;
      }
    } catch (e) {
      console.warn('Using in-memory ticket data:', e);
    }

    const ticketData = {
      ...freshTicket,
      unit_code: unit,
      unit: unit,
      ticketRef: freshTicket.ticket_number || freshTicket.reference_number || `${unit}-TIC-${ticketId}`,
    };

    const docxBlob = await generateFgmuJobRequestFormDocxBlob(ticketData, freshTicket.feedback);
    viewerModal.fileBlob = docxBlob;
  } catch (err) {
    console.error('Failed to generate Job Order document:', err);
    viewerModal.isOpen = false;
    toast.error('Failed to generate Job Order document: ' + (err.message || 'Template error'));
  }
};

const handleRegenerateJobOrder = async () => {
  if (!activeJobOrderTicket.value) return;
  viewerModal.isRegenerating = true;
  // Clear fileBlob so viewer shows active generation rather than stale document
  viewerModal.fileBlob = null;

  try {
    toast.info('Re-injecting ticket data and generating new Job Order document...');
    const ticket = activeJobOrderTicket.value;
    const ticketId = ticket.ticketId || ticket.id;
    const unit = props.unitCode?.toUpperCase() || ticket.unit_code || 'FGMU';

    // 1. Fetch fresh ticket details directly from server to capture all recent modifications
    let freshTicket = ticket;
    try {
      const res = await api.get(`tickets/${ticketId}`);
      const raw = res.data?.data?.ticket || res.data?.data;
      if (raw) {
        freshTicket = mapTicket(raw);
        activeJobOrderTicket.value = freshTicket;
      }
    } catch (fetchErr) {
      console.warn('Could not fetch single ticket, falling back to cached list:', fetchErr);
      freshTicket = rawTickets.value.find(t => (t.id === ticketId || t.ticketId === ticketId)) || ticket;
    }

    const ticketData = {
      ...freshTicket,
      unit_code: unit,
      unit: unit,
      ticketRef: freshTicket.ticket_number || freshTicket.reference_number || `${unit}-TIC-${ticketId}`,
      regenerated_at: new Date().toISOString()
    };

    // 2. Generate brand-new document Blob with re-injected data
    const docxBlob = await generateFgmuJobRequestFormDocxBlob(ticketData, freshTicket.feedback);

    // 3. Upload new document as permanent ticket attachment on the server (replacing old versions)
    try {
      const formData = new FormData();
      formData.append('attachments[]', docxBlob, `${unit}_Job_Order_#${ticketId}.docx`);
      await api.post(`tickets/${ticketId}/attachments`, formData, {
        headers: { 'Content-Type': undefined }
      });

      // Re-fetch ticket to update attachments array and all synchronized fields
      const refreshRes = await api.get(`tickets/${ticketId}`);
      const refreshRaw = refreshRes.data?.data?.ticket || refreshRes.data?.data;
      if (refreshRaw) {
        freshTicket = mapTicket(refreshRaw);
        activeJobOrderTicket.value = freshTicket;
      }
    } catch (attachErr) {
      console.warn('Could not save regenerated attachment to backend:', attachErr);
    }

    // 4. Update modal state and workspace tickets list
    if (selectedTicketForModal.value && (selectedTicketForModal.value.id === ticketId || selectedTicketForModal.value.ticketId === ticketId)) {
      selectedTicketForModal.value = freshTicket;
    }

    // Update rawTickets list in background
    const foundIdx = rawTickets.value.findIndex(t => (t.id === ticketId || t.ticketId === ticketId));
    if (foundIdx !== -1) {
      rawTickets.value[foundIdx] = freshTicket;
    }
    fetchScheduledTickets().catch(() => {});

    // 5. Update viewer with new document
    viewerModal.fileBlob = docxBlob;
    toast.success('New Job Order document successfully re-generated with updated data!');
  } catch (err) {
    console.error('Failed to re-generate document:', err);
    toast.error('Failed to re-generate document: ' + (err.message || 'Unknown error'));
  } finally {
    viewerModal.isRegenerating = false;
  }
};

const handleDirectRegenerate = async (ticket) => {
  if (!ticket) return;
  const ticketId = ticket.ticketId || ticket.id;
  const unit = props.unitCode?.toUpperCase() || ticket.unit_code || 'FGMU';
  activeJobOrderTicket.value = ticket;
  viewerModal.title = `${unit} Job Order (Job Request Form) - #${ticketId}`;
  viewerModal.fileName = `${unit}_Job_Order_#${ticketId}.docx`;
  viewerModal.fileBlob = null;
  viewerModal.allowRegenerate = true;
  viewerModal.isRegenerating = true;
  viewerModal.isOpen = true;
  await handleRegenerateJobOrder();
};

const downloadAttachment = async (att) => {
  try {
    const response = await api.get(`attachments/${att.id}`, { responseType: 'blob' });
    const mimeType = att.file_type || response.headers?.['content-type'] || 'application/octet-stream';
    const blob = new Blob([response.data], { type: mimeType });

    const fileNameLower = (att.file_name || '').toLowerCase();
    if (fileNameLower.endsWith('.pdf') || mimeType === 'application/pdf' || mimeType.startsWith('image/')) {
      viewerModal.title = att.file_name || 'Attachment Preview';
      viewerModal.fileName = att.file_name || 'attachment.pdf';
      viewerModal.fileBlob = blob;
      viewerModal.allowRegenerate = false;
      viewerModal.isOpen = true;
    } else {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', att.file_name || 'attachment');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Failed to download attachment', error);
    toast.error('Failed to download attachment.');
  }
};

const isTicketHighlighted = (ticket) => {
  const target = route.query.ticketId || route.query.highlight;
  if (!target || !ticket) return false;
  const targetStr = String(target).toLowerCase().trim().replace(/^#/, '');
  const idStr = String(ticket.id || '').toLowerCase().trim().replace(/^#/, '');
  const ticketIdStr = String(ticket.ticketId || '').toLowerCase().trim().replace(/^#/, '');
  return targetStr === idStr || targetStr === ticketIdStr;
};

const checkRouteQueryTicket = () => {
  const targetId = route.query.ticketId || route.query.highlight;
  if (!targetId || rawTickets.value.length === 0) return;
  const targetStr = String(targetId).toLowerCase().trim().replace(/^#/, '');
  const match = scheduledTickets.value.find(t => {
    const idStr = String(t.id || '').toLowerCase().trim().replace(/^#/, '');
    const ticketIdStr = String(t.ticketId || '').toLowerCase().trim().replace(/^#/, '');
    return idStr === targetStr || ticketIdStr === targetStr;
  }) || rawTickets.value.find(t => {
    const idStr = String(t.id || '').toLowerCase().trim().replace(/^#/, '');
    const ticketIdStr = String(t.ticketId || '').toLowerCase().trim().replace(/^#/, '');
    return idStr === targetStr || ticketIdStr === targetStr;
  });

  if (match) {
    selectedTicketForModal.value = match;
    const idx = filteredTickets.value.findIndex(t => String(t.id) === String(match.id));
    if (idx !== -1) {
      currentPage.value = Math.floor(idx / pageSize.value) + 1;
    }
    // Consume the deep-link params so later navigations (e.g. tab
    // switches) don't re-trigger this modal.
    clearRouteQueryTicket();
    setTimeout(() => {
      const el = document.getElementById('ticket-' + match.id) || document.getElementById('mob-ticket-' + match.id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 250);
  }
};

// NOTE: array-of-getters (not a single getter returning an array) so this
// only fires when one of the deep-link values actually changes — a plain
// `?tab=` switch must never re-open the ticket modal.
watch([() => route.query.ticketId, () => route.query.highlight, () => route.query._t], () => {
  checkRouteQueryTicket();
});

watch(() => route.query.tab, (v) => {
  const next = v === 'borrowing' ? 'borrowing' : v === 'collab' ? 'collab' : 'jobs';
  if (next === 'borrowing' && !isLEAU.value) return;
  if (next !== scheduledTab.value) {
    scheduledTab.value = next;
    currentPage.value = 1;
    selectedTicketForModal.value = null;
    if (next === 'borrowing') {
      scheduledTabRefreshKey.value += 1;
      fetchBorrowingCount();
    }
    if (next === 'collab') {
      scheduledTabRefreshKey.value += 1;
      fetchCollabScheduledCount();
    }
  }
});

onMounted(async () => {
  if (route.query.tab === 'borrowing' && isLEAU.value) {
    scheduledTab.value = 'borrowing';
  } else if (route.query.tab === 'collab') {
    scheduledTab.value = 'collab';
  }
  await Promise.all([fetchScheduledTickets(), fetchBorrowingCount(), fetchCollabScheduledCount()]);
  checkRouteQueryTicket();
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }

.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
}

.animate-scale-up {
  animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
