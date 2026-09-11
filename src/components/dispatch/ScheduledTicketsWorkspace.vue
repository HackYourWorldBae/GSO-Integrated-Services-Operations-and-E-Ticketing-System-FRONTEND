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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Scheduled &amp; Dispatched Tickets</span>
            <span class="ml-1 px-2 py-0.5 rounded-full text-[10px] font-black leading-none bg-white/20 text-white">
              {{ scheduledTickets.length }}
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
            All ({{ scheduledTickets.length }})
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
            placeholder="Search ticket #, title, service, requester, worker, room..."
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
          @click="fetchScheduledTickets"
          :disabled="loading"
          class="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all flex items-center justify-center disabled:opacity-50 shrink-0 cursor-pointer active:scale-95"
          title="Refresh scheduled tickets list"
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

    <!-- ═══ Desktop Tabular View (Matching Approved Tickets Layout) ═══ -->
    <div class="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th class="px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Ticket Ref</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Requester</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Job / Service</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Location</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Assigned Worker</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Target Schedule</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs">
            
            <!-- Loading State -->
            <tr v-if="loading && scheduledTickets.length === 0">
              <td colspan="7" class="py-16 text-center">
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
              <td colspan="7" class="py-16 text-center">
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
                <div class="text-[10px] text-slate-400 mt-0.5">{{ formatDate(ticket.created_at || ticket.submitted_at) }}</div>
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

              <!-- Assigned Worker -->
              <td class="px-3 py-2.5 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-black flex items-center justify-center shrink-0">
                    {{ getInitials(ticket.assignment?.personnel_name || 'Worker') }}
                  </div>
                  <div class="min-w-0">
                    <span class="text-xs font-bold text-slate-800 truncate block max-w-[130px]">{{ ticket.assignment?.personnel_name || 'Assigned Tech' }}</span>
                    <span class="text-[10px] text-slate-400 block truncate">{{ ticket.assignment?.specialty || 'Technician' }}</span>
                  </div>
                </div>
              </td>

              <!-- Target Schedule -->
              <td class="px-3 py-2.5 whitespace-nowrap">
                <div class="text-xs font-bold text-slate-800">
                  {{ formatDate(ticket.assignment?.implementation_date) }}
                </div>
                <div class="text-[10px] font-bold text-amber-700 flex items-center gap-1 mt-0.5">
                  <span class="px-1.5 py-0.2 rounded bg-amber-50 border border-amber-200">
                    {{ (ticket.working_days || ticket.assignment?.working_days) ? `${ticket.working_days || ticket.assignment?.working_days} Day(s)` : '1 Day' }}
                  </span>
                  <span class="text-slate-400 font-medium">• Scheduled</span>
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
    <div class="md:hidden space-y-3">
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
        class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-3"
        @click="openDetailsModal(ticket)"
      >
        <!-- Top Row: Ref & Target Date Badge -->
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span :class="['font-mono text-xs font-black px-2 py-0.5 rounded-lg border', themeMonoBadge]">
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

        <!-- Ticket Body -->
        <div>
          <h4 class="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">{{ ticket.job_description || ticket.title || 'Scheduled Maintenance Task' }}</h4>
          <div class="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
            <span :class="['font-bold', themeText]">{{ ticket.service || ticket.type }}</span>
            <span>•</span>
            <span>{{ ticket.location || ticket.college_building || 'Campus' }} {{ ticket.office_room ? `(${ticket.office_room})` : '' }}</span>
          </div>
        </div>

        <!-- Technician & Requester Meta -->
        <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2 text-[11px]">
          <div>
            <span class="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Worker</span>
            <span class="font-bold text-slate-800 truncate block">{{ ticket.assignment?.personnel_name || 'Assigned Tech' }}</span>
          </div>
          <div class="text-right">
            <span class="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Requester</span>
            <span class="font-semibold text-slate-700 truncate block">{{ ticket.requester }}</span>
          </div>
        </div>

        <!-- Card Actions -->
        <div class="flex items-center gap-2 pt-1 border-t border-slate-100" @click.stop>
          <button
            type="button"
            @click="openJobOrderDocument(ticket)"
            class="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold text-center transition-all active:scale-95 cursor-pointer border border-slate-200 flex items-center justify-center gap-1.5"
            title="Print / View Job Order"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Job Order</span>
          </button>

          <button
            type="button"
            @click="initiateStartEarly(ticket)"
            class="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-black text-center transition-all shadow-xs active:scale-95 cursor-pointer"
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
          class="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 disabled:opacity-40 font-bold"
        >
          Prev
        </button>
        <span class="font-bold text-slate-700">{{ currentPage }} / {{ totalPages }}</span>
        <button
          type="button"
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 disabled:opacity-40 font-bold"
        >
          Next
        </button>
      </div>
    </div>

    <!-- ═══ Full Ticket Details Modal (Matching Approved Tickets Layout) ═══ -->
    <Teleport to="body">
      <div
        v-if="selectedTicketForModal"
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
        @click.self="selectedTicketForModal = null"
      >
        <div class="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 animate-scale-up flex flex-col max-h-[calc(100dvh-4rem)] sm:max-h-[calc(100dvh-5rem)] overflow-hidden">
          
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
                  Scheduled for {{ formatDate(selectedTicketForModal.assignment?.implementation_date) }}
                </span>
                <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider border border-amber-200">
                  Scheduled
                </span>
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Scheduled Ticket Particulars</h3>
              <p class="text-xs text-slate-500 font-medium mt-0.5">Assigned technician parameters, planned implementation schedule, and institutional particulars</p>
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
            
            <!-- Assigned Technician & Schedule Banner -->
            <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-950 to-slate-900 text-white space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-black uppercase tracking-widest text-amber-300">Designated Technician</span>
                <span class="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-500/30">
                  Awaiting Start
                </span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center font-black text-sm border border-white/20">
                  {{ getInitials(selectedTicketForModal.assignment?.personnel_name || 'Worker') }}
                </div>
                <div>
                  <h4 class="text-sm sm:text-base font-black text-white leading-tight">
                    {{ selectedTicketForModal.assignment?.personnel_name || 'Assigned Technician' }}
                  </h4>
                  <p class="text-xs text-amber-200/80 font-medium mt-0.5">
                    {{ selectedTicketForModal.assignment?.specialty || 'Lead Field Technician' }}
                  </p>
                </div>
              </div>
              <div class="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                <div>
                  <span class="text-[9px] text-slate-400 uppercase font-black block">Planned Start Date</span>
                  <span class="font-bold text-white">{{ formatDate(selectedTicketForModal.assignment?.implementation_date) }}</span>
                </div>
                <div>
                  <span class="text-[9px] text-slate-400 uppercase font-black block">Target Duration</span>
                  <span class="font-bold text-white">{{ selectedTicketForModal.working_days || selectedTicketForModal.assignment?.working_days || 1 }} Day(s)</span>
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
                <p class="text-xs text-slate-600 font-semibold flex items-center gap-2">
                  <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <span>Contact: {{ selectedTicketForModal.contact_number || 'N/A' }}</span>
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

            <!-- Service & Job Particulars -->
            <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
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
                {{ selectedTicketForModal.job_description || selectedTicketForModal.title || 'No detailed scope notes provided.' }}
              </p>
            </div>

            <!-- Official Job Order Document Section -->
            <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
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
                      Official job request document filled with requester information, location, designated technician, and scheduled dates to issue before starting the job.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  @click="openJobOrderDocument(selectedTicketForModal)"
                  class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider transition-all shadow-xs active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span>Print / View Job Order</span>
                </button>
              </div>
            </div>

            <!-- Attachments & Proof Documents -->
            <div class="space-y-2.5">
              <span class="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <span :class="['w-2 h-3 rounded-full', themeBarColor]"></span>
                Attached Documents &amp; Damage Proof ({{ (selectedTicketForModal.attachments || []).length }})
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
          <div class="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              @click="selectedTicketForModal = null"
              class="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              Close Full Info
            </button>

            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="openJobOrderDocument(selectedTicketForModal)"
                class="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-black uppercase tracking-wider transition-all shadow-2xs active:scale-95 cursor-pointer flex items-center gap-1.5"
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
                class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-black uppercase tracking-wider transition-all shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5"
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
      @close="viewerModal.isOpen = false"
    />

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/client';
import { toast } from 'vue3-toastify';
import ConfirmModal from '@/components/ConfirmModal.vue';
import DocumentViewerModal from '@/components/DocumentViewerModal.vue';
import { generateFgmuJobRequestFormBlob, generateFgmuJobRequestFormDocxBlob, printFgmuJobRequestForm } from '@/utils/fgmuPdfGenerator';
import { parseDateLocal } from '@/utils/workCalendar';

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
});

// Unit Theme Computeds
const isLEAU = computed(() => props.unitCode?.toUpperCase() === 'LEAU');

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

// Scheduled tickets: step 4
const scheduledTickets = computed(() => {
  return rawTickets.value.filter(t => t.current_step == 4);
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

const mapTicket = (t) => {
  const requesterName = t.requester 
    || t.details?.requesting_personnel
    || (t.user ? `${t.user.first_name || ''} ${t.user.last_name || ''}`.trim() : '')
    || (t.first_name || t.last_name ? `${t.first_name || ''} ${t.last_name || ''}`.trim() : '')
    || 'End User';

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
    office_room: t.details?.office_room || t.office_room,
    source_of_fund: t.details?.source_of_fund || t.source_of_fund || 'N/A',
    contact_number: t.contact_number || t.requester_contact || t.details?.contact_number || t.user?.contact_number || 'N/A',
    requester: requesterName,
    requestedBy: requesterName,
    email: t.email || t.user?.email || '',
    status: t.status,
    is_emergency: !!(t.is_emergency || t.urgency === 'High' || t.urgency === 'Emergency'),
    job_description: t.description || t.job_description || t.title || '',
    attachments: t.attachments || [],
    submitted_at: t.submitted_at || t.created_at,
    reviewed_at: t.reviewed_at || t.approved_at,
    assignment: t.assignment || (t.assignments && t.assignments[0]) || null,
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

const openDetailsModal = (ticket) => {
  selectedTicketForModal.value = ticket;
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
  try {
    const ticketId = ticket.ticketId || ticket.id;
    const unit = props.unitCode?.toUpperCase() || ticket.unit_code || 'FGMU';
    viewerModal.title = `${unit} Job Order (Job Request Form) - #${ticketId}`;
    viewerModal.fileName = `${unit}_Job_Order_#${ticketId}.pdf`;
    viewerModal.fileBlob = null;
    viewerModal.isOpen = true;

    const ticketData = {
      ...ticket,
      unit_code: unit,
      unit: unit,
      ticketRef: ticket.ticket_number || ticket.reference_number || `${unit}-TIC-${ticketId}`,
    };

    const blob = await generateFgmuJobRequestFormBlob(ticketData, ticket.feedback);
    viewerModal.fileBlob = blob;
  } catch (err) {
    console.warn('Job order PDF generation warning, falling back to docx preview:', err);
    try {
      const docxBlob = await generateFgmuJobRequestFormDocxBlob(ticket, ticket.feedback);
      viewerModal.fileName = `${props.unitCode?.toUpperCase() || 'FGMU'}_Job_Order_#${ticket.ticketId || ticket.id}.docx`;
      viewerModal.fileBlob = docxBlob;
    } catch (fallbackErr) {
      console.error('Failed to generate Job Order document:', fallbackErr);
      viewerModal.isOpen = false;
      toast.error('Failed to generate Job Order document.');
    }
  }
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

onMounted(async () => {
  await fetchScheduledTickets();
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
