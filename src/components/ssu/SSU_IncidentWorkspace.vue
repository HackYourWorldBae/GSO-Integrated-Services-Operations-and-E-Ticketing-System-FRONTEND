<template>
  <div class="space-y-4 animate-fade-in relative pb-16">

    <!-- ═══ Unified Compact Toolbar ═══ -->
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs">
      <!-- Top Row: Stage Indicator & Urgency Filter Pills -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 border-b border-slate-100">
        <!-- Stage Pill -->
        <div class="flex items-center gap-2">
          <div
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-xs transition-all duration-200',
              activeQueue === 'submitted' ? 'bg-gradient-to-r from-amber-600 to-amber-500' : 'bg-gradient-to-r from-violet-700 to-indigo-600'
            ]"
          >
            <span class="w-2 h-2 rounded-full bg-white" :class="{ 'animate-ping': activeQueue === 'investigating' }"></span>
            <span>{{ activeQueue === 'submitted' ? 'Submitted Incident Reports' : 'Under Investigation Cases' }}</span>
            <span class="ml-1 px-2 py-0.5 rounded-full text-[10px] font-black leading-none bg-white/20 text-white">
              {{ currentQueueTickets.length }}
            </span>
          </div>
          <span class="text-xs text-slate-400 font-medium hidden lg:inline">
            {{ activeQueue === 'submitted' ? 'Review new incident reports and initiate investigation.' : 'Manage open investigation cases, communicate recommendations, and resolve.' }}
          </span>
        </div>

        <!-- Urgency Filters -->
        <div class="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-bold self-start sm:self-auto flex-wrap sm:flex-nowrap gap-1">
          <button
            type="button"
            @click="urgencyFilter = 'all'; currentPage = 1"
            :class="[
              'px-3.5 py-1.5 min-h-[36px] rounded-lg transition-all cursor-pointer touch-manipulation',
              urgencyFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-800'
            ]"
          >
            All ({{ currentQueueTickets.length }})
          </button>
          <button
            type="button"
            @click="urgencyFilter = 'emergency'; currentPage = 1"
            :class="[
              'px-3.5 py-1.5 min-h-[36px] rounded-lg transition-all cursor-pointer touch-manipulation flex items-center gap-1.5',
              urgencyFilter === 'emergency'
                ? 'bg-rose-600 text-white shadow-xs font-black'
                : 'text-rose-600 hover:bg-rose-50'
            ]"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            Emergency ({{ emergencyCount }})
          </button>
          <button
            type="button"
            @click="urgencyFilter = 'standard'; currentPage = 1"
            :class="[
              'px-3.5 py-1.5 min-h-[36px] rounded-lg transition-all cursor-pointer touch-manipulation',
              urgencyFilter === 'standard'
                ? 'bg-white text-slate-900 shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-800'
            ]"
          >
            Standard
          </button>
        </div>
      </div>

      <!-- Bottom Row: Search + Refresh -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-3">
        <!-- Search Input -->
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="rawSearchQuery"
            type="text"
            placeholder="Search by ticket ID, reporter name, contact, location, or summary..."
            class="w-full pl-10 pr-9 py-2.5 min-h-[44px] rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-base sm:text-xs font-semibold placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all"
          />
          <button
            v-if="rawSearchQuery"
            @click="rawSearchQuery = ''; debouncedSearchQuery = ''; currentPage = 1"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer min-h-[44px] min-w-[44px] justify-center"
            title="Clear search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Refresh Button -->
        <button
          type="button"
          @click="fetchQueues"
          :disabled="loading"
          class="p-2.5 min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all flex items-center justify-center disabled:opacity-50 shrink-0 cursor-pointer active:scale-95 touch-manipulation"
          title="Refresh ticket queues"
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

    <!-- ═══ 4. Desktop Tabular View (Matches FGMU/LEAU Standard Layout) ═══ -->
    <div class="hidden md:block bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-400">
              <th class="px-4 py-3 w-44">Ticket Ref</th>
              <th class="px-3 py-3 min-w-[200px]">Reporter</th>
              <th v-if="activeQueue === 'investigating'" class="px-3 py-3 w-72">Recommendation / Notation</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs">
            <!-- Loading Skeletons -->
            <tr v-if="loading && paginatedTickets.length === 0">
              <td :colspan="activeQueue === 'investigating' ? 4 : 3" class="py-16 text-center">
                <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-xs font-semibold shadow-xs">
                  <svg class="animate-spin h-4 w-4 text-slate-800" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading incident reports...
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-else-if="paginatedTickets.length === 0">
              <td :colspan="activeQueue === 'investigating' ? 4 : 3" class="py-16 text-center">
                <div class="max-w-md mx-auto space-y-3">
                  <div
                    class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
                    :class="activeQueue === 'submitted' ? 'bg-amber-50 text-amber-500' : 'bg-violet-50 text-violet-500'"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 class="text-sm font-black text-slate-800">
                    {{ activeQueue === 'submitted' ? 'No Pending Submitted Reports' : 'No Active Cases Under Investigation' }}
                  </h4>
                  <p class="text-xs text-slate-400">
                    {{ activeQueue === 'submitted' ? 'All submitted incident reports have been reviewed and actioned.' : 'No incidents are currently flagged for ongoing security investigation.' }}
                  </p>
                </div>
              </td>
            </tr>

            <!-- Ticket Rows -->
            <tr
              v-for="ticket in paginatedTickets"
              :key="ticket.id"
              :id="'ticket-' + ticket.id"
              :class="[
                'group hover:bg-slate-50/70 transition-colors',
                highlightedTicketId === ticket.id ? 'bg-rose-50/60 ring-2 ring-rose-400/40' : ''
              ]"
            >
              <!-- 1. Ticket Ref -->
              <td class="px-4 py-3.5 align-middle w-44">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span
                    class="font-mono text-xs font-black px-2.5 py-1 rounded-lg border bg-slate-50 text-slate-800 border-slate-200 shadow-2xs group-hover:border-slate-300 transition-colors whitespace-nowrap"
                  >
                    {{ ticket.ticketId }}
                  </span>
                  <span
                    v-if="ticket.is_emergency"
                    class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[9px] font-black uppercase tracking-wider border border-rose-200 flex items-center gap-1"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                    Emergency
                  </span>
                </div>
              </td>

              <!-- 2. Reporter (fluid column — absorbs freed width) -->
              <td class="px-3 py-3.5 align-middle min-w-[200px]">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 uppercase">
                    {{ getInitials(ticket.requestedBy) }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-bold text-slate-900 truncate">{{ ticket.requestedBy }}</p>
                    <p class="text-[10px] text-slate-400 font-medium truncate">{{ ticket.requesterEmail || 'No Email' }}</p>
                    <p v-if="ticket.requesterContact" class="text-[10px] text-slate-500 font-mono mt-0.5">{{ ticket.requesterContact }}</p>
                  </div>
                </div>
              </td>

              <!-- 3. Recommendation / Notation Column (Under Investigation Only) -->
              <td v-if="activeQueue === 'investigating'" class="px-3 py-3.5 align-middle w-72">
                <div v-if="ticket.hasNotation" class="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200 space-y-1">
                  <div class="flex items-center gap-1 text-[10px] font-black text-blue-700 uppercase tracking-wider">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span>Communicated to Reporter</span>
                  </div>
                  <p class="text-xs text-blue-900 font-medium italic line-clamp-3 leading-relaxed">
                    "{{ ticket.notation }}"
                  </p>
                </div>
                <div v-else class="p-2.5 rounded-xl bg-amber-50/70 border border-dashed border-amber-200 text-center">
                  <span class="text-[10px] font-bold text-amber-700 block">No notation recorded</span>
                  <span class="text-[9px] text-amber-600 block mt-0.5">Required before resolving</span>
                </div>
              </td>

              <!-- 4. Actions Column (shrink-to-fit, right-packed) -->
              <td class="px-4 py-3.5 align-middle text-right whitespace-nowrap w-[1%]">
                <div class="flex items-center justify-end gap-1.5">

                  <!-- Action Set A: Submitted Tickets Queue -->
                  <template v-if="activeQueue === 'submitted'">
                    <!-- Set to Under Investigation -->
                    <button
                      type="button"
                      @click="openInvestigateModal(ticket)"
                      class="px-3 py-2 min-h-[38px] rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-black uppercase tracking-wider shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 touch-manipulation"
                      title="Flag as Under Investigation"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span>Investigate</span>
                    </button>

                    <!-- Add Notation (on submitted tickets) -->
                    <button
                      type="button"
                      @click="openNotationModal(ticket)"
                      class="px-3 py-2 min-h-[38px] rounded-xl bg-white hover:bg-blue-50 text-blue-700 border border-blue-300 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 touch-manipulation"
                      :title="ticket.hasNotation ? 'Update Notation' : 'Add Recommendation / Notation'"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>{{ ticket.hasNotation ? 'Edit Note' : 'Add Note' }}</span>
                    </button>

                    <!-- Dismiss / Decline -->
                    <button
                      type="button"
                      @click="openDismissModal(ticket)"
                      class="px-3 py-2 min-h-[38px] rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 touch-manipulation"
                      title="Dismiss Report"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Dismiss</span>
                    </button>
                  </template>

                  <!-- Action Set B: Under Investigation Queue (STRICT: Notation or Resolve ONLY) -->
                  <template v-else>
                    <!-- Add / Update Notation -->
                    <button
                      type="button"
                      @click="openNotationModal(ticket)"
                      class="px-3 py-2 min-h-[38px] rounded-xl bg-white hover:bg-blue-50 text-blue-700 border border-blue-300 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 touch-manipulation"
                      :title="ticket.hasNotation ? 'Update Notation' : 'Add Recommendation / Notation'"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>{{ ticket.hasNotation ? 'Update Notation' : 'Add Notation' }}</span>
                    </button>

                    <!-- Mark as Resolved -->
                    <button
                      type="button"
                      @click="initiateResolve(ticket)"
                      class="px-3.5 py-2 min-h-[38px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 touch-manipulation"
                      title="Mark as Resolved & Archive"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Resolve</span>
                    </button>
                  </template>

                  <!-- View Full Info Modal Trigger -->
                  <button
                    type="button"
                    @click="openDetailsModal(ticket)"
                    class="p-2 min-h-[38px] min-w-[38px] rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-all flex items-center justify-center cursor-pointer touch-manipulation"
                    title="View Full Case Details"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div v-if="filteredTickets.length > 0" class="px-6 py-4 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Showing <span class="font-bold text-slate-800">{{ paginationRange.start }}</span> to
          <span class="font-bold text-slate-800">{{ paginationRange.end }}</span> of
          <span class="font-bold text-slate-800">{{ filteredTickets.length }}</span> reports
        </div>
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold cursor-pointer transition-colors"
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
            class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold cursor-pointer transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- ═══ 5. Mobile Responsive Card Stack (< 768px) ═══ -->
    <div class="block md:hidden space-y-4">
      <div
        v-for="ticket in paginatedTickets"
        :key="'mob-' + ticket.id"
        :class="[
          'p-4 sm:p-5 rounded-2xl bg-white border shadow-xs space-y-3.5',
          highlightedTicketId === ticket.id ? 'border-rose-400 ring-2 ring-rose-400/30' : 'border-slate-200'
        ]"
      >
        <!-- Top Row: Ref & Urgency -->
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="font-mono text-xs font-black px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
              {{ ticket.ticketId }}
            </span>
            <span
              v-if="ticket.is_emergency"
              class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[9px] font-black uppercase tracking-wider border border-rose-200"
            >
              Emergency
            </span>
          </div>
          <span
            :class="[
              'px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border',
              activeQueue === 'submitted' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-violet-50 text-violet-700 border-violet-200'
            ]"
          >
            {{ ticket.statusLabel }}
          </span>
        </div>

        <!-- Reporter -->
        <div class="space-y-1">
          <p class="text-xs font-bold text-slate-900">{{ ticket.requestedBy }}</p>
        </div>

        <!-- Current Notation Card (If Investigating) -->
        <div v-if="activeQueue === 'investigating'" class="p-2.5 rounded-xl bg-blue-50/90 border border-blue-200 space-y-1">
          <p class="text-[10px] font-black text-blue-700 uppercase tracking-wider">Notation to Reporter</p>
          <p class="text-xs text-blue-900 font-medium italic">
            {{ ticket.hasNotation ? `"${ticket.notation}"` : 'No notation added yet (Required to resolve).' }}
          </p>
        </div>

        <!-- Actions -->
        <div class="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <!-- Submitted Queue Mobile Actions -->
          <template v-if="activeQueue === 'submitted'">
            <button
              type="button"
              @click="openInvestigateModal(ticket)"
              class="flex-1 px-3 py-2.5 min-h-[44px] rounded-xl bg-violet-600 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 touch-manipulation active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Investigate</span>
            </button>
            <button
              type="button"
              @click="openNotationModal(ticket)"
              class="px-3 py-2.5 min-h-[44px] rounded-xl bg-blue-50 text-blue-700 border border-blue-300 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 touch-manipulation active:scale-95"
            >
              <span>{{ ticket.hasNotation ? 'Edit Note' : 'Add Note' }}</span>
            </button>
            <button
              type="button"
              @click="openDismissModal(ticket)"
              class="px-3 py-2.5 min-h-[44px] rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 touch-manipulation active:scale-95"
            >
              <span>Dismiss</span>
            </button>
          </template>

          <!-- Under Investigation Mobile Actions -->
          <template v-else>
            <button
              type="button"
              @click="openNotationModal(ticket)"
              class="flex-1 px-3 py-2.5 min-h-[44px] rounded-xl bg-blue-50 text-blue-700 border border-blue-300 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 touch-manipulation active:scale-95"
            >
              <span>{{ ticket.hasNotation ? 'Edit Notation' : 'Add Notation' }}</span>
            </button>
            <button
              type="button"
              @click="initiateResolve(ticket)"
              class="flex-1 px-3 py-2.5 min-h-[44px] rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 touch-manipulation active:scale-95"
            >
              <span>Resolve</span>
            </button>
          </template>

          <button
            type="button"
            @click="openDetailsModal(ticket)"
            class="px-3 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-slate-600 text-xs font-bold touch-manipulation active:scale-95"
          >
            Details
          </button>
        </div>
      </div>

      <!-- Mobile Pagination Controls -->
      <div v-if="filteredTickets.length > 0" class="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-200 text-xs">
        <button
          type="button"
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold disabled:opacity-40 min-h-[44px] touch-manipulation"
        >
          Previous
        </button>
        <span class="font-bold text-slate-600">{{ currentPage }} / {{ totalPages }}</span>
        <button
          type="button"
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold disabled:opacity-40 min-h-[44px] touch-manipulation"
        >
          Next
        </button>
      </div>
    </div>

    <!-- ═══ MODAL 1: NOTATION / RECOMMENDATION EDITOR ═══ -->
    <Teleport to="body">
      <div
        v-if="notationModal.isOpen"
        class="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto pointer-events-auto"
        @click.self="closeNotationModal"
      >
        <div class="pointer-events-auto bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 my-auto animate-scale-up">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div class="min-w-0">
              <h3 class="text-base sm:text-lg font-black text-slate-900 leading-tight">Add / Update Recommendation</h3>
              <p class="text-[11px] text-slate-400 font-semibold truncate">
                Incident <span class="text-violet-600 font-mono font-bold">{{ notationModal.ticket?.ticketId }}</span>
              </p>
            </div>
          </div>

          <div class="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-100 mb-4">
            <p class="text-xs text-blue-800 leading-relaxed font-medium">
              <strong class="font-bold">Notice:</strong> This recommendation/notation is displayed directly to the reporter in their tracking timeline. Adding a notation prepares the incident for resolution.
            </p>
          </div>

          <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">
            Recommendation / Action Notation <span class="text-rose-500">*</span>
          </label>
          <textarea
            v-model="notationModal.text"
            rows="4"
            class="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none mb-5"
            placeholder="Specify actions taken, security findings, or instructions for the reporter..."
          ></textarea>

          <div class="flex items-center justify-end gap-3">
            <button
              type="button"
              @click="closeNotationModal"
              class="px-5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer touch-manipulation"
            >
              Cancel
            </button>
            <button
              type="button"
              :disabled="!notationModal.text.trim() || isSubmitting"
              @click="submitNotation"
              class="px-6 py-2.5 min-h-[44px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 cursor-pointer touch-manipulation flex items-center gap-1.5"
            >
              <span>{{ isSubmitting ? 'Saving…' : 'Save Recommendation' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ═══ MODAL 2: RESOLVE CONFIRMATION MODAL ═══ -->
    <Teleport to="body">
      <div
        v-if="resolveModal.isOpen"
        class="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto pointer-events-auto"
        @click.self="closeResolveModal"
      >
        <div class="pointer-events-auto bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 my-auto animate-scale-up text-center">
          <div class="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h3 class="text-lg font-black text-slate-900 mb-1">Mark Incident as Resolved?</h3>
          <p class="text-xs text-slate-500 mb-4">
            Incident <strong class="text-slate-800 font-mono">{{ resolveModal.ticket?.ticketId }}</strong> will be officially closed and moved to the SSU Archives.
          </p>

          <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left mb-6">
            <p class="text-[10px] font-black text-blue-700 uppercase tracking-wider mb-1">Recorded Recommendation / Notation:</p>
            <p class="text-xs text-slate-700 font-medium italic">"{{ resolveModal.ticket?.notation }}"</p>
          </div>

          <div class="flex items-center justify-center gap-3">
            <button
              type="button"
              @click="closeResolveModal"
              class="flex-1 px-5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer touch-manipulation"
            >
              Cancel
            </button>
            <button
              type="button"
              :disabled="isSubmitting"
              @click="confirmResolve"
              class="flex-1 px-5 py-2.5 min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 cursor-pointer touch-manipulation"
            >
              {{ isSubmitting ? 'Resolving…' : 'Confirm & Resolve' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ═══ MODAL 3: DISMISS INCIDENT MODAL (Submitted Queue Only) ═══ -->
    <Teleport to="body">
      <div
        v-if="dismissModal.isOpen"
        class="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto pointer-events-auto"
        @click.self="closeDismissModal"
      >
        <div class="pointer-events-auto bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 my-auto animate-scale-up">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 class="text-base sm:text-lg font-black text-slate-900 leading-tight">Dismiss Incident Report</h3>
              <p class="text-[11px] text-slate-400 font-semibold truncate">
                Ticket <span class="font-mono text-rose-600">{{ dismissModal.ticket?.ticketId }}</span>
              </p>
            </div>
          </div>

          <p class="text-xs text-slate-500 mb-3">
            Please specify why this report cannot be investigated or actioned. This justification will be sent to the reporter.
          </p>

          <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">
            Reason for Dismissal <span class="text-rose-500">*</span>
          </label>
          <textarea
            v-model="dismissModal.reason"
            rows="3"
            class="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none resize-none mb-5"
            placeholder="Explain why this incident report is being dismissed..."
          ></textarea>

          <div class="flex items-center justify-end gap-3">
            <button
              type="button"
              @click="closeDismissModal"
              class="px-5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer touch-manipulation"
            >
              Cancel
            </button>
            <button
              type="button"
              :disabled="!dismissModal.reason.trim() || isSubmitting"
              @click="submitDismiss"
              class="px-6 py-2.5 min-h-[44px] rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 cursor-pointer touch-manipulation flex items-center gap-1.5"
            >
              <span>{{ isSubmitting ? 'Dismissing…' : 'Confirm Dismissal' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ═══ MODAL 4: FULL INCIDENT REPORT DETAILS MODAL ═══ -->
    <Teleport to="body">
      <div
        v-if="detailsModal.isOpen"
        class="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto pointer-events-auto"
        @click.self="closeDetailsModal"
      >
        <div class="pointer-events-auto bg-white w-full sm:rounded-3xl sm:max-w-2xl shadow-2xl border border-slate-100 animate-scale-up max-h-screen sm:max-h-[88vh] flex flex-col my-auto">

          <!-- Modal Header -->
          <div class="flex items-start justify-between gap-4 p-5 sm:p-6 pb-4 border-b border-slate-100 shrink-0">
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap mb-1.5">
                <span class="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
                  {{ detailsModal.ticket?.ticketId }}
                </span>
                <span
                  v-if="detailsModal.ticket?.is_emergency"
                  class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[9px] font-black uppercase tracking-wider border border-rose-200 flex items-center gap-1"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                  Emergency
                </span>
                <span
                  :class="[
                    'px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border',
                    detailsModal.ticket?.isUnderInvestigation
                      ? 'bg-violet-50 text-violet-700 border-violet-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  ]"
                >
                  {{ detailsModal.ticket?.statusLabel }}
                </span>
              </div>
              <h3 class="text-base sm:text-lg font-black text-slate-900 leading-tight">Security Incident Report</h3>
              <p class="text-[11px] text-slate-400 font-semibold mt-0.5">Submitted {{ detailsModal.ticket?.date }}</p>
            </div>
            <button
              type="button"
              @click="closeDetailsModal"
              class="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer shrink-0 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Body (Scrollable) -->
          <div class="overflow-y-auto flex-1 p-5 sm:p-6 space-y-4">

            <!-- A. Reporter / Requester Card -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <p class="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-3">Reporter Information</p>
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 text-sm font-bold flex items-center justify-center shrink-0 uppercase">
                  {{ getInitials(detailsModal.ticket?.requestedBy) }}
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-black text-slate-900">{{ detailsModal.ticket?.requestedBy }}</p>
                  <p class="text-xs text-slate-500 font-medium mt-0.5">{{ detailsModal.ticket?.requesterEmail || 'No email on record' }}</p>
                  <!-- Enlarged Contact Number -->
                  <a
                    v-if="detailsModal.ticket?.requesterContact && detailsModal.ticket?.requesterContact !== 'N/A'"
                    :href="`tel:${detailsModal.ticket.requesterContact}`"
                    class="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span class="text-base sm:text-lg font-black font-mono tracking-wide text-emerald-800 group-hover:text-emerald-900">
                      {{ detailsModal.ticket.requesterContact }}
                    </span>
                  </a>
                  <p v-else class="text-xs text-slate-400 font-semibold flex items-center gap-2 mt-2">
                    <svg class="w-4 h-4 text-slate-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <span>No contact number on file</span>
                  </p>
                </div>
              </div>
              <!-- Student/Employee Details -->
              <div v-if="detailsModal.ticket?.studentId || detailsModal.ticket?.college" class="mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div v-if="detailsModal.ticket?.studentId">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block">ID Number</span>
                  <p class="text-xs font-bold text-slate-900 mt-0.5 font-mono">{{ detailsModal.ticket.studentId }}</p>
                </div>
                <div v-if="detailsModal.ticket?.studentType">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Type</span>
                  <p class="text-xs font-bold text-slate-900 mt-0.5">{{ detailsModal.ticket.studentType }}</p>
                </div>
                <div v-if="detailsModal.ticket?.college">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block">College / Org</span>
                  <p class="text-xs font-bold text-slate-900 mt-0.5">{{ detailsModal.ticket.college }}</p>
                </div>
              </div>
            </div>

            <!-- B. Incident Classification -->
            <div class="p-4 rounded-2xl bg-rose-50/60 border border-rose-200">
              <p class="text-[10px] font-black uppercase text-rose-700 tracking-wider mb-3">Incident Classification</p>
              <div class="space-y-2.5">
                <!-- Incident Types -->
                <div v-if="detailsModal.ticket?.incidentTypes?.length">
                  <span class="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">Type(s) of Incident</span>
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="inc in detailsModal.ticket.incidentTypes"
                      :key="inc"
                      class="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200"
                    >
                      {{ inc }}
                    </span>
                  </div>
                </div>
                <!-- Issues / Information -->
                <div v-if="detailsModal.ticket?.incidentIssues?.length">
                  <span class="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">Related Issues</span>
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="issue in detailsModal.ticket.incidentIssues"
                      :key="issue"
                      class="px-2.5 py-1 rounded-lg bg-orange-100 text-orange-800 text-xs font-bold border border-orange-200"
                    >
                      {{ issue }}
                    </span>
                  </div>
                </div>
                <!-- Reporter Roles -->
                <div v-if="detailsModal.ticket?.incidentRoles?.length">
                  <span class="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">Reporter Role(s)</span>
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="role in detailsModal.ticket.incidentRoles"
                      :key="role"
                      class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200"
                    >
                      {{ role }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- C. Incident Particulars (Who / Where / When) -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <p class="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-3">Incident Particulars</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div v-if="detailsModal.ticket?.who">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Person(s) Involved</span>
                  <p class="text-xs font-semibold text-slate-800 mt-1 leading-relaxed">{{ detailsModal.ticket.who }}</p>
                </div>
                <div v-if="detailsModal.ticket?.when">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Date &amp; Time of Incident</span>
                  <p class="text-xs font-semibold text-slate-800 mt-1 leading-relaxed">{{ detailsModal.ticket.when }}</p>
                </div>
                <div class="sm:col-span-2" v-if="detailsModal.ticket?.location || detailsModal.ticket?.college_building">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Location</span>
                  <p class="text-xs font-semibold text-slate-800 mt-1">
                    {{ detailsModal.ticket.location || detailsModal.ticket.college_building }}
                    <span v-if="detailsModal.ticket?.office_room" class="text-slate-500">&nbsp;— Room {{ detailsModal.ticket.office_room }}</span>
                  </p>
                </div>
              </div>
            </div>

            <!-- D. Narrative Statement -->
            <div>
              <p class="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Narrative Statement (How)</p>
              <div class="p-4 rounded-2xl bg-white border border-slate-200 text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-line min-h-[80px]">
                {{ detailsModal.ticket?.how || detailsModal.ticket?.description || 'No narrative provided.' }}
              </div>
            </div>

            <!-- E. Staff Notation / Recommendation -->
            <div v-if="detailsModal.ticket?.hasNotation" class="p-4 rounded-2xl bg-blue-50 border border-blue-200">
              <div class="flex items-center justify-between gap-2 mb-2">
                <p class="text-[10px] font-black uppercase text-blue-700 tracking-wider">Staff Recommendation / Notation</p>
                <button
                  type="button"
                  @click="openNotationModal(detailsModal.ticket); closeDetailsModal()"
                  class="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-wider px-2 py-1 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  Edit
                </button>
              </div>
              <p class="text-xs text-blue-950 font-medium italic leading-relaxed">"{{ detailsModal.ticket?.notation }}"</p>
            </div>
            <div v-else class="p-3.5 rounded-2xl bg-amber-50/80 border border-dashed border-amber-300 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p class="text-xs font-bold text-amber-800">No recommendation recorded yet</p>
                <p class="text-[11px] text-amber-700 mt-0.5">A notation is required before this incident can be resolved.</p>
              </div>
            </div>

            <!-- F. Evidence Attachments -->
            <div v-if="detailsModal.ticket?.attachments?.length > 0">
              <p class="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Evidence &amp; Attachments</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div
                  v-for="(att, idx) in detailsModal.ticket.attachments"
                  :key="idx"
                  @click="openAttachment(att)"
                  class="p-3 rounded-xl border border-slate-200 bg-white hover:border-rose-400 hover:bg-rose-50/40 transition-colors flex items-center justify-between gap-2 cursor-pointer group"
                >
                  <div class="flex items-center gap-2 min-w-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span class="truncate font-semibold text-slate-700 group-hover:text-rose-700 text-xs">{{ att.file_name || 'Evidence Attachment' }}</span>
                  </div>
                  <span class="text-[10px] font-bold text-slate-400 group-hover:text-rose-600 shrink-0">Open</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="p-5 sm:p-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
            <button
              v-if="!detailsModal.ticket?.hasNotation"
              type="button"
              @click="openNotationModal(detailsModal.ticket); closeDetailsModal()"
              class="px-4 py-2.5 min-h-[44px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer touch-manipulation flex items-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Add Notation
            </button>
            <div v-else></div>
            <button
              type="button"
              @click="closeDetailsModal"
              class="px-5 py-2.5 min-h-[44px] rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer touch-manipulation"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ═══ MODAL 5: INITIATE INVESTIGATION CONFIRMATION ═══ -->
    <Teleport to="body">
      <div
        v-if="confirmInvestigateModal.isOpen"
        class="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto pointer-events-auto"
        @click.self="closeInvestigateModal"
      >
        <div class="pointer-events-auto bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-scale-up text-center my-auto">
          <div class="w-14 h-14 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <h3 class="text-lg font-black text-slate-900 mb-1">Initiate Investigation?</h3>
          <p class="text-xs text-slate-500 mb-2">
            Ticket <strong class="text-slate-800 font-mono">{{ confirmInvestigateModal.ticket?.ticketId }}</strong>
          </p>
          <p class="text-xs text-slate-500 mb-6">
            This will move the incident report to the <strong class="text-violet-700">Under Investigation</strong> queue and notify the reporter that their case is actively being handled by SSU.
          </p>

          <div class="flex items-center gap-3">
            <button
              type="button"
              :disabled="confirmInvestigateModal.isLoading"
              @click="closeInvestigateModal"
              class="flex-1 px-5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer touch-manipulation disabled:opacity-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              :disabled="confirmInvestigateModal.isLoading"
              @click="confirmInvestigate"
              class="flex-1 px-5 py-2.5 min-h-[44px] rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all disabled:opacity-60 cursor-pointer touch-manipulation flex items-center justify-center gap-1.5"
            >
              <svg v-if="confirmInvestigateModal.isLoading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ confirmInvestigateModal.isLoading ? 'Processing…' : 'Start Investigation' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { toast } from 'vue3-toastify';
import api from '@/api/client';
import { debounce } from '@/utils/debounce';

const props = defineProps({
  activeQueue: {
    type: String,
    default: 'submitted', // 'submitted' | 'investigating'
  }
});

const router = useRouter();
const route  = useRoute();

// ── State ──────────────────────────────────────────────────────────────────
const loading            = ref(false);
const isSubmitting       = ref(false);
const allTickets         = ref([]);
const highlightedTicketId = ref(null);

const rawSearchQuery       = ref('');
const debouncedSearchQuery = ref('');
const urgencyFilter        = ref('all'); // 'all' | 'emergency' | 'standard'

const currentPage = ref(1);
const perPage     = ref(10);

const onSearchInput = debounce((val) => {
  debouncedSearchQuery.value = val;
  currentPage.value = 1;
}, 200);

watch(rawSearchQuery, (val) => onSearchInput(val));

// ── Ticket Mapping ─────────────────────────────────────────────────────────
const mapTicket = (t) => ({
  id:                   t.id,
  ticketId:             t.id,
  title:                t.title || 'Security Incident Report',
  service:              t.service_type || 'Incident Report',
  description:          t.description || '',
  date:                 new Date(t.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  submittedAt:          t.submitted_at || '',
  requestedBy:          t.first_name ? `${t.first_name} ${t.last_name || ''}`.trim() : (t.details?.reporter_name || 'Anonymous Reporter'),
  requesterEmail:       t.email || '',
  requesterRole:        t.requester_role || 'reporter',
  requesterContact:     t.requester_contact || t.contact_number || t.details?.contact_number || t.details?.contact_no || t.user?.contact_number || '',
  studentId:            t.student_id_number || '',
  studentType:          t.student_type || '',
  college:              t.college || t.organization_name || '',
  location:             t.location || '',
  college_building:     t.college_building || '',
  office_room:          t.office_room || '',
  attachments:          t.attachments || [],
  is_emergency:         Boolean(Number(t.is_emergency) === 1 || t.urgency === 'Emergency' || (t.priority && t.priority.toLowerCase() === 'high')),
  isUnderInvestigation: Number(t.is_under_investigation) === 1,
  hasNotation:          Boolean(t.ssu_notation && t.ssu_notation.trim().length > 0),
  notation:             t.ssu_notation || '',
  statusLabel:          t.status_label || (Number(t.is_under_investigation) === 1 ? 'Under Investigation' : 'Pending Review'),
  // ── SSU Incident Report Detail Fields ────────────────────────────────────
  incidentTypes:        t.details?.incidents    || [],
  incidentIssues:       t.details?.information  || [],
  incidentRoles:        t.details?.roles        || [],
  who:                  t.details?.who_involved || '',
  when:                 t.details?.when_occurred || '',
  how:                  t.details?.how_narrative || t.description || '',
  reportedBy:           t.details?.reportedBy   || { printedName: '', signature: '', roles: [] },
});

// ── Computed Lists ─────────────────────────────────────────────────────────
const submittedTickets = computed(() =>
  allTickets.value.filter(t => !t.isUnderInvestigation)
);

const investigatingTickets = computed(() =>
  allTickets.value.filter(t => t.isUnderInvestigation)
);

const currentQueueTickets = computed(() => {
  return props.activeQueue === 'submitted'
    ? submittedTickets.value
    : investigatingTickets.value;
});

const emergencyCount = computed(() =>
  currentQueueTickets.value.filter(t => t.is_emergency).length
);

const filteredTickets = computed(() => {
  let list = currentQueueTickets.value;

  // 1. Urgency
  if (urgencyFilter.value === 'emergency') {
    list = list.filter(t => t.is_emergency);
  } else if (urgencyFilter.value === 'standard') {
    list = list.filter(t => !t.is_emergency);
  }

  // 2. Search
  if (debouncedSearchQuery.value.trim()) {
    const q = debouncedSearchQuery.value.toLowerCase().trim();
    list = list.filter(t =>
      String(t.ticketId || '').toLowerCase().includes(q) ||
      String(t.requestedBy || '').toLowerCase().includes(q) ||
      String(t.location || t.college_building || '').toLowerCase().includes(q) ||
      String(t.office_room || '').toLowerCase().includes(q) ||
      String(t.description || '').toLowerCase().includes(q) ||
      String(t.notation || '').toLowerCase().includes(q) ||
      String(t.requesterEmail || '').toLowerCase().includes(q) ||
      String(t.requesterContact || '').toLowerCase().includes(q)
    );
  }

  return list;
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredTickets.value.length / perPage.value))
);

const paginatedTickets = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return filteredTickets.value.slice(start, start + perPage.value);
});

const paginationRange = computed(() => {
  const total = filteredTickets.value.length;
  if (total === 0) return { start: 0, end: 0 };
  const start = (currentPage.value - 1) * perPage.value + 1;
  const end   = Math.min(currentPage.value * perPage.value, total);
  return { start, end };
});

const changePage = (p) => {
  if (p >= 1 && p <= totalPages.value) {
    currentPage.value = p;
  }
};

const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// ── Modals State ───────────────────────────────────────────────────────────
const notationModal = reactive({
  isOpen: false,
  ticket: null,
  text: '',
});

const resolveModal = reactive({
  isOpen: false,
  ticket: null,
});

const dismissModal = reactive({
  isOpen: false,
  ticket: null,
  reason: '',
});

const detailsModal = reactive({
  isOpen: false,
  ticket: null,
});

const confirmInvestigateModal = reactive({
  isOpen:    false,
  ticket:    null,
  isLoading: false,
});

// ── Actions ────────────────────────────────────────────────────────────────
const openInvestigateModal = (ticket) => {
  confirmInvestigateModal.ticket    = ticket;
  confirmInvestigateModal.isLoading = false;
  confirmInvestigateModal.isOpen    = true;
};

const closeInvestigateModal = () => {
  confirmInvestigateModal.isOpen    = false;
  confirmInvestigateModal.ticket    = null;
  confirmInvestigateModal.isLoading = false;
};

const confirmInvestigate = async () => {
  if (!confirmInvestigateModal.ticket) return;
  confirmInvestigateModal.isLoading = true;
  try {
    await api.patch(`tickets/${confirmInvestigateModal.ticket.id}/investigate`);
    toast.success(`Incident ${confirmInvestigateModal.ticket.ticketId} is now Under Investigation.`);
    closeInvestigateModal();
    await fetchQueues();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to update investigation status.');
  } finally {
    confirmInvestigateModal.isLoading = false;
  }
};

const openNotationModal = (ticket) => {
  notationModal.ticket = ticket;
  notationModal.text   = ticket.notation || '';
  notationModal.isOpen = true;
};

const closeNotationModal = () => {
  notationModal.isOpen = false;
  notationModal.ticket = null;
  notationModal.text   = '';
};

const submitNotation = async () => {
  if (!notationModal.text.trim() || !notationModal.ticket) return;
  isSubmitting.value = true;
  try {
    await api.patch(`tickets/${notationModal.ticket.id}/notation`, { notation: notationModal.text.trim() });
    toast.success(`Recommendation recorded for ${notationModal.ticket.ticketId}.`);
    closeNotationModal();
    await fetchQueues();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to save notation.');
  } finally {
    isSubmitting.value = false;
  }
};

const initiateResolve = (ticket) => {
  if (!ticket.hasNotation) {
    toast.warning('A recommendation/notation is required before resolving.');
    openNotationModal(ticket);
    return;
  }
  resolveModal.ticket = ticket;
  resolveModal.isOpen = true;
};

const closeResolveModal = () => {
  resolveModal.isOpen = false;
  resolveModal.ticket = null;
};

const confirmResolve = async () => {
  if (!resolveModal.ticket) return;
  isSubmitting.value = true;
  try {
    await api.patch(`tickets/${resolveModal.ticket.id}/resolve`);
    toast.success(`Incident ${resolveModal.ticket.ticketId} resolved and archived.`);
    closeResolveModal();
    await fetchQueues();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to resolve incident.');
  } finally {
    isSubmitting.value = false;
  }
};

const openDismissModal = (ticket) => {
  dismissModal.ticket = ticket;
  dismissModal.reason = '';
  dismissModal.isOpen = true;
};

const closeDismissModal = () => {
  dismissModal.isOpen = false;
  dismissModal.ticket = null;
  dismissModal.reason = '';
};

const submitDismiss = async () => {
  if (!dismissModal.reason.trim() || !dismissModal.ticket) return;
  isSubmitting.value = true;
  try {
    await api.patch(`tickets/${dismissModal.ticket.id}/decline`, { decline_reason: dismissModal.reason.trim() });
    toast.info(`Incident report ${dismissModal.ticket.ticketId} dismissed.`);
    closeDismissModal();
    await fetchQueues();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to dismiss incident.');
  } finally {
    isSubmitting.value = false;
  }
};

const openDetailsModal = (ticket) => {
  detailsModal.ticket = ticket;
  detailsModal.isOpen = true;
};

const closeDetailsModal = () => {
  detailsModal.isOpen = false;
  detailsModal.ticket = null;
};

const openAttachment = async (att) => {
  try {
    const response = await api.get(`attachments/${att.id}`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: att.file_type || 'application/octet-stream' }));
    if (att.file_type && att.file_type.startsWith('image/')) {
      window.open(url, '_blank');
    } else {
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', att.file_name || 'attachment');
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  } catch (error) {
    console.error('Failed to download attachment', error);
    toast.error('Failed to download attachment.');
  }
};

// ── Data Fetching ──────────────────────────────────────────────────────────
const fetchQueues = async () => {
  loading.value = true;
  try {
    const [pendingRes, investigatingRes] = await Promise.all([
      api.get('tickets/queue/SSU'),
      api.get('tickets/investigating/SSU'),
    ]);

    const pendingRaw       = (pendingRes.data?.data?.tickets || []).filter(t => t.service_type === 'Incident Report');
    const investigatingRaw = (investigatingRes.data?.data?.tickets || []).filter(t => t.service_type === 'Incident Report');

    const investigatingIds = new Set(investigatingRaw.map(t => t.id));
    const merged = [
      ...investigatingRaw.map(mapTicket),
      ...pendingRaw.filter(t => !investigatingIds.has(t.id)).map(mapTicket),
    ];

    allTickets.value = merged;
    checkRouteHighlight();
  } catch (error) {
    console.error('Failed to fetch SSU queues:', error);
  } finally {
    loading.value = false;
  }
};

const checkRouteHighlight = () => {
  const targetId = route.query.ticketId || route.query.highlight;
  if (!targetId) return;

  const targetStr = String(targetId).toLowerCase().trim().replace(/^#/, '');
  const match = allTickets.value.find(t => {
    const idStr = String(t.id || '').toLowerCase().trim().replace(/^#/, '');
    const ticketIdStr = String(t.ticketId || '').toLowerCase().trim().replace(/^#/, '');
    return idStr === targetStr || ticketIdStr === targetStr;
  });

  if (match) {
    highlightedTicketId.value = match.id;
    setTimeout(() => {
      const el = document.getElementById('ticket-' + match.id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 250);
  }
};

// ── Polling & Lifecycle ────────────────────────────────────────────────────
let pollingTimer = null;

const handleFocus = () => {
  if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
    const isInteracting = notationModal.isOpen || resolveModal.isOpen || dismissModal.isOpen || detailsModal.isOpen || confirmInvestigateModal.isOpen;
    if (!isInteracting) {
      fetchQueues();
    }
  }
};

onMounted(() => {
  fetchQueues();

  pollingTimer = setInterval(() => {
    if (document.hidden) return;
    const isInteracting = notationModal.isOpen || resolveModal.isOpen || dismissModal.isOpen || detailsModal.isOpen || confirmInvestigateModal.isOpen;
    if (!isInteracting) {
      fetchQueues();
    }
  }, 35000);

  window.addEventListener('focus', handleFocus);
  document.addEventListener('visibilitychange', handleFocus);
});

onUnmounted(() => {
  if (pollingTimer) clearInterval(pollingTimer);
  window.removeEventListener('focus', handleFocus);
  document.removeEventListener('visibilitychange', handleFocus);
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

@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

.animate-scale-up {
  animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
