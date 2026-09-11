<template>
  <div class="space-y-4 animate-fade-in relative pb-12">

    <!-- ═══ Unified Compact Toolbar: Stage Tab + Search + Filters + Refresh ═══ -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs">
      
      <!-- Top Row: Stage Indicator & Urgency Filter Pills -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-1.5 border-b border-slate-100">
        <!-- Stage Pill -->
        <div class="flex items-center gap-1.5">
          <div
            :class="[
              'flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-md transition-all duration-200',
              themeAccentBg,
              themeAccentShadow
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Approved (Awaiting Dispatch)</span>
            <span class="ml-1 px-2 py-0.5 rounded-full text-[10px] font-black leading-none bg-white/20 text-white">
              {{ tickets.length }}
            </span>
          </div>
        </div>

        <!-- Urgency Filters -->
        <div class="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/60 text-xs font-bold self-start sm:self-auto">
          <button
            type="button"
            @click="setUrgencyFilter('all')"
            :class="[
              'px-3 py-1 rounded-lg transition-all cursor-pointer',
              urgencyFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-800'
            ]"
          >
            All ({{ tickets.length }})
          </button>
          <button
            type="button"
            @click="setUrgencyFilter('emergency')"
            :class="[
              'px-3 py-1 rounded-lg transition-all cursor-pointer',
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
              'px-3 py-1 rounded-lg transition-all cursor-pointer',
              urgencyFilter === 'standard'
                ? 'bg-white text-slate-900 shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-800'
            ]"
          >
            Standard
          </button>
        </div>
      </div>

      <!-- Bottom Row: Search + Service Category Filter + Refresh -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2">
        <!-- Search Input -->
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            @input="currentPage = 1"
            type="text"
            placeholder="Search ticket #, title, service, requester, location..."
            :class="[
              'w-full pl-8 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:bg-white transition-all',
              themeFocusRing
            ]"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''; currentPage = 1"
            class="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Service Filter Dropdown -->
        <select
          v-model="selectedServiceFilter"
          @change="currentPage = 1"
          :class="[
            'px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none transition-all shrink-0 cursor-pointer',
            themeFocusBorder
          ]"
        >
          <option value="">All Services</option>
          <option v-for="service in uniqueServices" :key="service" :value="service">{{ service }}</option>
        </select>

        <!-- Refresh Button -->
        <button
          type="button"
          @click="fetchApprovedTickets"
          :disabled="loading"
          class="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all flex items-center justify-center disabled:opacity-50 shrink-0 cursor-pointer active:scale-95"
          title="Refresh approved ticket list"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-3.5 w-3.5"
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

    <!-- ═══ Desktop Tabular View (Matching Director Ticket Queues) ═══ -->
    <div class="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th class="px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Ticket Ref</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Requester</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Job / Service</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Location</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Approved</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs">
            
            <!-- Loading State -->
            <tr v-if="loading && tickets.length === 0">
              <td colspan="6" class="py-16 text-center">
                <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-xs font-semibold">
                  <svg class="animate-spin h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading approved tickets...
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-else-if="paginatedTickets.length === 0">
              <td colspan="6" class="py-16 text-center">
                <div class="max-w-sm mx-auto flex flex-col items-center">
                  <div class="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p class="text-sm font-bold text-slate-700">No Approved Tickets Pending Assignment</p>
                  <p class="text-xs text-slate-400 mt-1">There are no records matching your current filter criteria.</p>
                </div>
              </td>
            </tr>

            <!-- Data Rows -->
            <tr
              v-for="ticket in paginatedTickets"
              :key="ticket.id"
              :class="[
                'transition-all duration-150 group cursor-pointer relative',
                themeHoverRow
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
                <div class="relative inline-flex items-center gap-1.5">
                  <div
                    :class="[
                      'font-mono text-xs font-bold px-2.5 py-1 rounded-lg border inline-flex items-center transition-all duration-150',
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
                <div class="text-[10px] text-slate-400 mt-0.5">{{ ticket.submittedAt }}</div>
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

              <!-- Job / Service -->
              <td class="px-3 py-2.5 max-w-[220px]">
                <div class="text-xs font-semibold text-slate-900 line-clamp-1" :title="ticket.job_description || ticket.title">
                  {{ ticket.job_description || ticket.title || '—' }}
                </div>
                <div :class="['text-[10px] font-bold mt-0.5 flex items-center gap-1.5', themeText]">
                  <span>{{ ticket.service || ticket.type || 'General' }}</span>
                  <span v-if="ticket.attachments && ticket.attachments.length > 0" class="inline-flex items-center gap-0.5 text-slate-400 font-normal">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    {{ ticket.attachments.length }}
                  </span>
                </div>
              </td>

              <!-- Location -->
              <td class="px-3 py-2.5 whitespace-nowrap">
                <div class="text-xs font-semibold text-slate-700">{{ ticket.location || ticket.college_building || 'Main Campus' }}</div>
                <div class="text-[10px] text-slate-400">{{ ticket.office_room ? `Rm ${ticket.office_room}` : '—' }}</div>
              </td>

              <!-- Approved Date -->
              <td class="px-3 py-2.5 whitespace-nowrap">
                <div class="text-xs font-semibold text-slate-700">{{ ticket.reviewed_at ? formatDate(ticket.reviewed_at) : ticket.submittedAt }}</div>
                <span
                  :class="[
                    'inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase border',
                    themeStatusBadge
                  ]"
                >
                  Approved
                </span>
              </td>

              <!-- Actions -->
              <td class="px-3 py-3 whitespace-nowrap text-right" @click.stop>
                <div class="flex items-center justify-end gap-2">
                  <!-- Full Info Modal Trigger -->
                  <button
                    type="button"
                    @click="openDetailsModal(ticket)"
                    :class="[
                      'px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer',
                      themeInfoButtonHover
                    ]"
                    title="View Full Ticket Information"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" :class="themeText" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>Full Info</span>
                  </button>

                  <!-- Assign Workers CTA -->
                  <router-link
                    :to="`${assignRoute}?ticket=${ticket.id}`"
                    :class="[
                      'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-white text-xs font-black transition-all shadow-xs active:scale-95 cursor-pointer',
                      themeAccentBg
                    ]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Assign Workers</span>
                  </router-link>
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

    <!-- ═══ Mobile Cards View (Matching Director Queues) ═══ -->
    <div class="md:hidden space-y-2">
      <!-- Loading State -->
      <div v-if="loading && tickets.length === 0" class="text-center py-10 bg-white rounded-2xl border border-slate-200">
        <svg class="animate-spin h-5 w-5 text-emerald-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-xs font-bold text-slate-400">Loading approved tickets...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="paginatedTickets.length === 0" class="text-center py-10 bg-white rounded-2xl border border-slate-200">
        <p class="text-sm font-bold text-slate-600">No Approved Tickets</p>
        <p class="text-xs text-slate-400 mt-1">No matching records found.</p>
      </div>

      <!-- Mobile Ticket Cards -->
      <div
        v-for="ticket in paginatedTickets"
        :key="'mob-' + ticket.id"
        :class="[
          'bg-white rounded-xl border border-slate-200 hover:shadow-sm transition-all cursor-pointer p-3.5 group active:scale-[0.99]',
          themeMobileBorderHover
        ]"
        @click="openDetailsModal(ticket)"
      >
        <!-- Top Row: ID + Requester + Date -->
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 min-w-0">
            <span
              :class="[
                'font-mono text-xs font-bold px-2 py-0.5 rounded border transition-colors shrink-0',
                themeMonoBadge
              ]"
            >
              #{{ ticket.id }}
            </span>
            <span
              v-if="ticket.is_emergency"
              class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[9px] font-black uppercase tracking-wider"
            >
              Emergency
            </span>
            <span class="text-xs font-semibold text-slate-700 truncate">{{ ticket.requester }}</span>
          </div>
          <span class="text-[10px] text-slate-400 shrink-0">{{ ticket.submittedAt }}</span>
        </div>

        <!-- Description + Service -->
        <div class="mt-2">
          <p class="text-xs font-semibold text-slate-800 line-clamp-1">{{ ticket.job_description || ticket.title }}</p>
          <div class="flex items-center justify-between mt-1 text-[11px]">
            <span :class="['font-bold', themeText]">{{ ticket.service || ticket.type }}</span>
            <span class="text-slate-400 truncate max-w-[150px]">{{ ticket.location || ticket.college_building }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-end gap-2" @click.stop>
          <button
            type="button"
            @click="openDetailsModal(ticket)"
            class="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
          >
            Full Info
          </button>
          <router-link
            :to="`${assignRoute}?ticket=${ticket.id}`"
            :class="[
              'px-3.5 py-1.5 rounded-lg text-white text-xs font-black uppercase tracking-wider inline-flex items-center gap-1 shadow-xs cursor-pointer',
              themeAccentBg
            ]"
          >
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Assign</span>
          </router-link>
        </div>
      </div>

      <!-- Mobile Pagination Footer -->
      <div v-if="filteredTickets.length > 0" class="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs text-slate-500">
        <div>
          Page <span class="font-bold text-slate-800">{{ currentPage }}</span> of <span class="font-bold text-slate-800">{{ totalPages }}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold cursor-pointer"
          >
            Prev
          </button>
          <button
            type="button"
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- ═══ Comprehensive Details Modal (Matching Director Queues) ═══ -->
    <div
      v-if="selectedTicketForModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
      @click.self="selectedTicketForModal = null"
    >
      <div class="bg-white rounded-3xl p-6 sm:p-10 max-w-3xl w-full shadow-2xl border border-slate-200 animate-scale-up space-y-6 sm:space-y-7 max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        <!-- Modal Header -->
        <div class="flex items-start justify-between pb-5 border-b border-slate-100 gap-4">
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
                Submitted on {{ selectedTicketForModal.submittedAt }}
              </span>
            </div>
            <h3 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Full Ticket Information</h3>
            <p class="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">Comprehensive institutional job particulars and requester verification</p>
          </div>
          <button
            type="button"
            @click="selectedTicketForModal = null"
            class="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Requester & Location Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <!-- Requester Profile -->
          <div class="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span class="text-xs font-black uppercase tracking-wider text-slate-400 block">Requester Profile</span>
            <p class="text-lg sm:text-xl font-black text-slate-900 leading-tight">{{ selectedTicketForModal.requester }}</p>
            <p class="text-sm text-slate-600 font-semibold flex items-center gap-2">
              <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <span class="truncate">{{ selectedTicketForModal.email || 'No institutional email' }}</span>
            </p>
            <p class="text-sm text-slate-600 font-semibold flex items-center gap-2">
              <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <span>Contact: {{ selectedTicketForModal.contact_number || 'N/A' }}</span>
            </p>
          </div>

          <!-- Designated Location -->
          <div class="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span class="text-xs font-black uppercase tracking-wider text-slate-400 block">Designated Location</span>
            <p class="text-lg sm:text-xl font-black text-slate-900 leading-tight">{{ selectedTicketForModal.location || selectedTicketForModal.college_building || 'Main Campus' }}</p>
            <p class="text-sm text-slate-600 font-semibold flex items-center gap-2">
              <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              <span>{{ selectedTicketForModal.office_room ? `Room / Office: ${selectedTicketForModal.office_room}` : 'No specific room designated' }}</span>
            </p>
          </div>
        </div>

        <!-- Service & Job Particulars -->
        <div class="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div class="flex items-center justify-between gap-3">
            <span class="text-xs font-black uppercase tracking-wider text-slate-400">Job Particular &amp; Nature of Work</span>
            <span
              :class="[
                'px-3.5 py-1 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider border',
                themeStatusBadge
              ]"
            >
              {{ selectedTicketForModal.service || selectedTicketForModal.type }}
            </span>
          </div>
          <p class="text-sm sm:text-base text-slate-800 leading-relaxed font-medium whitespace-pre-wrap bg-white p-4 sm:p-5 rounded-xl border border-slate-200/70 shadow-2xs">
            {{ selectedTicketForModal.job_description || 'No detailed scope notes provided by client.' }}
          </p>
        </div>

        <!-- Attachments & Proof Documents -->
        <div class="space-y-3">
          <span class="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <span :class="['w-2 h-3.5 rounded-full', themeBarColor]"></span>
            Attached Documents &amp; Damage Proof ({{ (selectedTicketForModal.attachments || []).length }})
          </span>

          <div v-if="!selectedTicketForModal.attachments || selectedTicketForModal.attachments.length === 0" class="p-5 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-slate-400 text-xs">
            No files or images attached to this ticket.
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="(file, idx) in selectedTicketForModal.attachments"
              :key="idx"
              @click="downloadAttachment(file)"
              :class="[
                'flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 cursor-pointer transition-all shadow-2xs group',
                themeAttachmentHover
              ]"
            >
              <div class="flex items-center gap-3 truncate">
                <div :class="['w-8 h-8 rounded-xl flex items-center justify-center shrink-0', themeAttachmentIconBg]">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                  </svg>
                </div>
                <span class="text-sm font-bold text-slate-800 truncate group-hover:text-slate-900">{{ file.file_name || 'Attachment' }}</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 group-hover:text-slate-700 shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Modal Footer Actions -->
        <div class="pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            @click="selectedTicketForModal = null"
            class="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
          >
            Close Full Info
          </button>

          <router-link
            :to="`${assignRoute}?ticket=${selectedTicketForModal.id}`"
            :class="[
              'inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-xs sm:text-sm font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer',
              themeAccentBg,
              themeAccentShadow
            ]"
          >
            <span>Proceed to Assign Workers</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </router-link>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/api/client';
import { toast } from 'vue3-toastify';

const props = defineProps({
  unitCode: {
    type: String,
    required: true
  },
  unitTitle: {
    type: String,
    default: ''
  },
  assignRoute: {
    type: String,
    required: true
  },
  store: {
    type: Object,
    required: true
  }
});

const isLeau = computed(() => props.unitCode?.toUpperCase() === 'LEAU');

// Dynamic theme classes matching Director dashboard conventions
const themeAccentBg = computed(() => isLeau.value ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700');
const themeAccentShadow = computed(() => isLeau.value ? 'shadow-amber-600/20' : 'shadow-emerald-600/20');
const themeFocusRing = computed(() => isLeau.value ? 'focus:ring-amber-500/20 focus:border-amber-500' : 'focus:ring-emerald-500/20 focus:border-emerald-500');
const themeFocusBorder = computed(() => isLeau.value ? 'focus:border-amber-500' : 'focus:border-emerald-500');
const themeHoverRow = computed(() => isLeau.value ? 'hover:bg-amber-50/50 hover:shadow-xs' : 'hover:bg-emerald-50/50 hover:shadow-xs');
const themeBarColor = computed(() => isLeau.value ? 'bg-amber-500' : 'bg-emerald-500');
const themeText = computed(() => isLeau.value ? 'text-amber-700' : 'text-emerald-700');
const themeStatusBadge = computed(() => isLeau.value ? 'bg-amber-50 text-amber-800 border-amber-200/60' : 'bg-emerald-50 text-emerald-800 border-emerald-200/60');
const themeMonoBadge = computed(() => isLeau.value
  ? 'text-amber-700 bg-amber-50 border-amber-100 group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-600'
  : 'text-emerald-700 bg-emerald-50 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600'
);
const themeInfoButtonHover = computed(() => isLeau.value ? 'hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800' : 'hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800');
const themeMobileBorderHover = computed(() => isLeau.value ? 'hover:border-amber-400' : 'hover:border-emerald-400');
const themeAttachmentHover = computed(() => isLeau.value ? 'hover:border-amber-500 hover:bg-amber-50/40' : 'hover:border-emerald-500 hover:bg-emerald-50/40');
const themeAttachmentIconBg = computed(() => isLeau.value ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700');

// State
const loading = ref(false);
const tickets = ref([]);
const searchQuery = ref('');
const urgencyFilter = ref('all');
const selectedServiceFilter = ref('');
const selectedTicketForModal = ref(null);

// Pagination State
const currentPage = ref(1);
const perPage = ref(15);

const emergencyCount = computed(() => {
  return tickets.value.filter(t => t.is_emergency).length;
});

const uniqueServices = computed(() => {
  const set = new Set();
  tickets.value.forEach(t => {
    const s = t.service || t.service_type || t.type;
    if (s && String(s).trim()) set.add(String(s).trim());
  });
  return Array.from(set);
});

const filteredTickets = computed(() => {
  let list = tickets.value;

  if (urgencyFilter.value === 'emergency') {
    list = list.filter(t => t.is_emergency);
  } else if (urgencyFilter.value === 'standard') {
    list = list.filter(t => !t.is_emergency);
  }

  if (selectedServiceFilter.value) {
    const target = selectedServiceFilter.value.trim().toLowerCase();
    list = list.filter(t => {
      const s = (t.service || t.service_type || t.type || '').trim().toLowerCase();
      return s === target;
    });
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(t =>
      String(t.id).toLowerCase().includes(q) ||
      (t.title && t.title.toLowerCase().includes(q)) ||
      (t.service && t.service.toLowerCase().includes(q)) ||
      (t.type && t.type.toLowerCase().includes(q)) ||
      (t.requester && t.requester.toLowerCase().includes(q)) ||
      (t.location && t.location.toLowerCase().includes(q)) ||
      (t.college_building && t.college_building.toLowerCase().includes(q)) ||
      (t.office_room && t.office_room.toLowerCase().includes(q)) ||
      (t.job_description && t.job_description.toLowerCase().includes(q))
    );
  }

  return list;
});

// Paginated subset
const totalPages = computed(() => Math.max(1, Math.ceil(filteredTickets.value.length / perPage.value)));

const paginatedTickets = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return filteredTickets.value.slice(start, start + perPage.value);
});

const paginationRange = computed(() => {
  if (filteredTickets.value.length === 0) return { start: 0, end: 0 };
  const start = (currentPage.value - 1) * perPage.value + 1;
  const end = Math.min(currentPage.value * perPage.value, filteredTickets.value.length);
  return { start, end };
});

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

const setUrgencyFilter = (filter) => {
  urgencyFilter.value = filter;
  currentPage.value = 1;
};

const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const formatDate = (val) => {
  if (!val) return 'N/A';
  const d = new Date(String(val).replace(' ', 'T'));
  return isNaN(d.getTime()) ? val : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const fetchApprovedTickets = async () => {
  loading.value = true;
  try {
    const res = await api.get(`tickets/dispatch/${props.unitCode}`);
    const rawData = res.data?.data?.tickets || res.data?.data || [];
    if (Array.isArray(rawData)) {
      tickets.value = rawData.map(t => {
        const requesterName = t.details?.requesting_personnel 
          || t.requester 
          || (t.user ? `${t.user.first_name || ''} ${t.user.last_name || ''}`.trim() : (t.first_name ? `${t.first_name || ''} ${t.last_name || ''}`.trim() : 'End User'));
        
        return {
          ...t,
          id: t.id,
          ticketId: t.id,
          title: t.title,
          service: t.service_type || t.service,
          service_type: t.service_type || t.service,
          type: t.title || t.project_title || t.service_type || t.type || 'Service Request',
          location: t.location || t.college_building || t.details?.college_building || 'Campus Facility',
          college_building: t.details?.college_building || t.college_building || t.location,
          office_room: t.details?.office_room || t.office_room,
          source_of_fund: t.details?.source_of_fund || 'N/A',
          contact_number: t.details?.contact_number || t.requester_contact || t.contact_number || 'N/A',
          requester: requesterName || 'End User',
          requestedBy: requesterName || 'End User',
          email: t.email || t.user?.email || '',
          status: t.status,
          is_emergency: !!(t.is_emergency || t.urgency === 'High' || t.urgency === 'Emergency'),
          job_description: t.description || t.job_description || '',
          attachments: t.attachments || [],
          submitted_at: t.submitted_at || t.created_at,
          submittedAt: t.submitted_at || t.created_at
            ? new Date(t.submitted_at || t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'N/A',
          reviewed_at: t.reviewed_at || t.approved_at
        };
      });
    }
  } catch (err) {
    console.error(`Failed to load ${props.unitCode} approved tickets:`, err);
    toast.error('Failed to load approved ticket list.');
  } finally {
    loading.value = false;
  }
};

const openDetailsModal = (ticket) => {
  selectedTicketForModal.value = ticket;
};

const downloadAttachment = async (att) => {
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

onMounted(async () => {
  if (props.store?.fetchPersonnel) {
    await props.store.fetchPersonnel();
  }
  await fetchApprovedTickets();
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
</style>
