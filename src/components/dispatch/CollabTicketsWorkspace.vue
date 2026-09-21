<template>
  <div class="space-y-4 animate-fade-in relative pb-12">

    <!-- ═══ Compact Toolbar: Stage Pill + Search + Refresh ═══ -->
    <!-- Hidden when embedded under a parent tabbed toolbar (director-style): -->
    <!-- the parent toolbar owns the tabs + shared search input instead. -->
    <div v-if="!hideToolbar" class="bg-white rounded-2xl border border-slate-200 shadow-xs">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-1.5 border-b border-slate-100">
        <div class="flex items-center gap-1.5">
          <div class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-md bg-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{{ stageLabel }}</span>
            <span class="ml-1 px-2 py-0.5 rounded-full text-[10px] font-black leading-none bg-white/20 text-white">
              {{ tickets.length }}
            </span>
          </div>
        </div>
        <div class="text-[11px] text-slate-500 font-semibold px-2">
          <span v-if="mode === 'approved'">Incoming requests awaiting your unit's dispatch</span>
          <span v-else-if="mode === 'scheduled'">Joint tickets awaiting schedule / counterpart dispatch</span>
          <span v-else-if="mode === 'active'">Joint tickets in execution (requesting unit completes)</span>
          <span v-else>Incoming collaboration requests for your unit</span>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2">
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
            placeholder="Search ticket #, title, service, requester, unit..."
            class="w-full pl-9 pr-9 py-2.5 min-h-[44px] rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-base sm:text-xs font-semibold placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
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
        <button
          type="button"
          @click="fetchTickets"
          :disabled="loading"
          class="p-2.5 min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all flex items-center justify-center disabled:opacity-50 shrink-0 cursor-pointer active:scale-95"
          title="Refresh collab ticket list"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{ 'animate-spin': loading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>

    <!-- ═══ Desktop Tabular View ═══ -->
    <div class="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th class="px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Ticket Ref</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Requester</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Collab Flow</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Status</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs">
            <tr v-if="loading && tickets.length === 0">
              <td colspan="5" class="py-16 text-center">
                <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-xs font-semibold">
                  <svg class="animate-spin h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading collab tickets...
                </div>
              </td>
            </tr>
            <tr v-else-if="paginatedTickets.length === 0">
              <td colspan="5" class="py-16 text-center">
                <div class="max-w-sm mx-auto flex flex-col items-center">
                  <div class="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-400 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p class="text-sm font-bold text-slate-700">No Collab Tickets Here</p>
                  <p class="text-xs text-slate-400 mt-1">No joint tickets match this stage right now.</p>
                </div>
              </td>
            </tr>
            <tr
              v-for="ticket in paginatedTickets"
              :key="ticket.id"
              class="transition-all duration-150 group cursor-pointer relative hover:bg-indigo-50/50"
              @click="openDetailsModal(ticket)"
            >
              <td class="px-4 py-2.5 whitespace-nowrap relative">
                <span class="absolute left-0 top-2 bottom-2 w-1 rounded-r-sm opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-indigo-500"></span>
                <div class="relative inline-flex items-center gap-1.5 flex-wrap">
                  <div class="font-mono text-sm font-bold px-3 py-1 rounded-lg border inline-flex items-center shadow-2xs text-indigo-700 bg-indigo-50 border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600">
                    #{{ ticket.id }}
                  </div>
                  <span v-if="ticket.is_emergency" class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[9px] font-black uppercase tracking-wider border border-rose-200">Emergency</span>
                </div>
              </td>
              <td class="px-3 py-2.5">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {{ getInitials(ticket.requester) }}
                  </div>
                  <div class="min-w-0">
                    <span class="text-xs font-semibold text-slate-800 truncate block max-w-[130px]">{{ ticket.requester }}</span>
                    <span class="text-[10px] text-slate-400 block">{{ ticket.location || 'Main Campus' }}</span>
                  </div>
                </div>
              </td>
              <td class="px-3 py-2.5 whitespace-nowrap">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span :class="['px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border', ticket.is_outgoing ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-indigo-50 text-indigo-800 border-indigo-200']">
                    {{ ticket.is_outgoing ? 'Outgoing' : 'Incoming' }}
                  </span>
                  <span class="text-[10px] font-bold text-slate-500">{{ ticket.is_outgoing ? (ticket.collaborating_unit_code || '') + ' assist' : (ticket.requesting_unit_code || '') + ' request' }}</span>
                </div>
                <div class="text-[10px] text-slate-400 mt-0.5 truncate max-w-[220px]">{{ ticket.scope_of_work || ticket.collaboration_reason || '' }}</div>
              </td>
              <td class="px-3 py-2.5 whitespace-nowrap">
                <span :class="['px-2 py-0.5 rounded-full text-[10px] font-black border', collabBadge(ticket).cls]">{{ collabBadge(ticket).label }}</span>
                <div v-if="mode !== 'approved'" class="text-[10px] font-bold mt-0.5" :class="ticket.my_unit_dispatched ? 'text-emerald-700' : 'text-amber-700'">
                  {{ ticket.my_unit_dispatched ? '✓ Your unit dispatched' : '○ Awaiting your dispatch' }}
                </div>
              </td>
              <td class="px-3 py-3 whitespace-nowrap text-right" @click.stop>
                <div class="flex items-center justify-end gap-1.5 flex-wrap">
                  <button
                    type="button"
                    @click="openDetailsModal(ticket)"
                    class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 text-xs font-bold transition-all cursor-pointer"
                  >
                    Full Info
                  </button>
                  <template v-if="canRespond(ticket)">
                    <button
                      type="button"
                      @click="respond(ticket, 'accepted')"
                      :disabled="actionLoading"
                      class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all cursor-pointer disabled:opacity-50"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      @click="respond(ticket, 'declined')"
                      :disabled="actionLoading"
                      class="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                    >
                      Decline
                    </button>
                  </template>
                  <router-link
                    v-if="showDispatchAction && assignRoute && !ticket.is_outgoing && !ticket.my_unit_dispatched && (mode === 'approved' || mode === 'all' || mode === 'scheduled')"
                    :to="`${assignRoute}?ticket=${ticket.id}&collab=1`"
                    class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-white text-xs font-black transition-all shadow-xs bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Dispatch</span>
                  </router-link>
                  <button
                    v-if="mode === 'scheduled' && ticket.is_requesting_unit"
                    type="button"
                    @click="startEarly(ticket)"
                    :disabled="actionLoading"
                    class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                  >
                    Start Early
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="filteredTickets.length > 0" class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Showing <span class="font-bold text-slate-800">{{ paginationRange.start }}</span> to <span class="font-bold text-slate-800">{{ paginationRange.end }}</span> of <span class="font-bold text-slate-800">{{ filteredTickets.length }}</span> tickets
        </div>
        <div class="flex items-center gap-1.5">
          <button type="button" @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 font-bold cursor-pointer">Previous</button>
          <div class="px-3 py-1.5 font-bold text-slate-700">{{ currentPage }} / {{ totalPages }}</div>
          <button type="button" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 font-bold cursor-pointer">Next</button>
        </div>
      </div>
    </div>

    <!-- ═══ Mobile Cards ═══ -->
    <div class="md:hidden space-y-2">
      <div v-if="loading && tickets.length === 0" class="text-center py-10 bg-white rounded-2xl border border-slate-200">
        <p class="text-xs font-bold text-slate-400">Loading collab tickets...</p>
      </div>
      <div v-else-if="paginatedTickets.length === 0" class="text-center py-10 bg-white rounded-2xl border border-slate-200">
        <p class="text-sm font-bold text-slate-600">No Collab Tickets</p>
        <p class="text-xs text-slate-400 mt-1">No matching records found.</p>
      </div>
      <div
        v-for="ticket in paginatedTickets"
        :key="'mob-' + ticket.id"
        class="bg-white rounded-xl border border-slate-200 p-3.5 cursor-pointer active:scale-[0.99] transition-all"
        @click="openDetailsModal(ticket)"
      >
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 min-w-0">
            <span class="font-mono text-sm font-bold px-2.5 py-0.5 rounded-lg border text-indigo-700 bg-indigo-50 border-indigo-100 shrink-0">#{{ ticket.id }}</span>
            <span :class="['px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border', ticket.is_outgoing ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-indigo-50 text-indigo-800 border-indigo-200']">
              {{ ticket.is_outgoing ? 'Outgoing' : 'Incoming' }}
            </span>
          </div>
          <span :class="['px-2 py-0.5 rounded-full text-[10px] font-black border shrink-0', collabBadge(ticket).cls]">{{ collabBadge(ticket).label }}</span>
        </div>
        <div class="mt-2 text-xs text-slate-600 truncate">{{ ticket.requester }} • {{ ticket.location || 'Main Campus' }}</div>
        <div class="mt-1 text-[11px] text-slate-500 truncate">{{ ticket.scope_of_work || '' }}</div>
        <div class="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-end gap-2" @click.stop>
          <button type="button" @click="openDetailsModal(ticket)" class="px-3.5 py-2 min-h-[38px] rounded-xl border border-slate-200 text-slate-700 text-xs font-bold cursor-pointer">Full Info</button>
          <template v-if="canRespond(ticket)">
            <button type="button" @click="respond(ticket, 'accepted')" :disabled="actionLoading" class="px-3.5 py-2 min-h-[38px] rounded-xl bg-emerald-600 text-white text-xs font-black cursor-pointer disabled:opacity-50">Accept</button>
            <button type="button" @click="respond(ticket, 'declined')" :disabled="actionLoading" class="px-3.5 py-2 min-h-[38px] rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold cursor-pointer disabled:opacity-50">Decline</button>
          </template>
          <router-link
            v-if="showDispatchAction && assignRoute && !ticket.is_outgoing && !ticket.my_unit_dispatched && (mode === 'approved' || mode === 'all' || mode === 'scheduled')"
            :to="`${assignRoute}?ticket=${ticket.id}&collab=1`"
            class="px-4 py-2 min-h-[38px] rounded-xl text-white text-xs font-black uppercase inline-flex items-center bg-indigo-600 cursor-pointer"
          >
            Dispatch
          </router-link>
          <button
            v-if="mode === 'scheduled' && ticket.is_requesting_unit"
            type="button"
            @click="startEarly(ticket)"
            :disabled="actionLoading"
            class="px-4 py-2 min-h-[38px] rounded-xl text-white text-xs font-black bg-amber-600 cursor-pointer disabled:opacity-50"
          >
            Start Early
          </button>
        </div>
      </div>
      <div v-if="filteredTickets.length > 0" class="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <div>Page <span class="font-bold text-slate-800">{{ currentPage }}</span> of <span class="font-bold text-slate-800">{{ totalPages }}</span></div>
        <div class="flex items-center gap-1.5">
          <button type="button" @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="px-3.5 py-2 min-h-[38px] rounded-xl border border-slate-200 font-bold disabled:opacity-40 cursor-pointer">Prev</button>
          <button type="button" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-3.5 py-2 min-h-[38px] rounded-xl border border-slate-200 font-bold disabled:opacity-40 cursor-pointer">Next</button>
        </div>
      </div>
    </div>

    <!-- ═══ Details Modal ═══ -->
    <Teleport to="body">
      <div
        v-if="selectedTicket"
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
        @click.self="selectedTicket = null"
      >
        <div class="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[calc(100dvh-4rem)] overflow-hidden">
          <div class="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0">
            <div>
              <div class="flex flex-wrap items-center gap-2.5 mb-1.5">
                <span class="font-mono text-base sm:text-lg font-black px-3.5 py-1 rounded-xl border text-indigo-700 bg-indigo-50 border-indigo-200">#{{ selectedTicket.id }}</span>
                <span :class="['px-2 py-0.5 rounded-full text-[10px] font-black border', collabBadge(selectedTicket).cls]">{{ collabBadge(selectedTicket).label }}</span>
                <span :class="['px-2 py-0.5 rounded text-[10px] font-black uppercase border', selectedTicket.is_outgoing ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-indigo-50 text-indigo-800 border-indigo-200']">
                  {{ selectedTicket.is_outgoing ? 'Outgoing request' : 'Incoming request' }}
                </span>
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{{ selectedTicket.title || 'Collab Ticket' }}</h3>
              <p class="text-xs text-slate-500 font-medium mt-0.5">{{ selectedTicket.requesting_unit_code || '' }} → {{ selectedTicket.collaborating_unit_code || '' }} • Requested by {{ selectedTicket.requester }}</p>
            </div>
            <button type="button" @click="selectedTicket = null" class="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 cursor-pointer shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div class="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1 custom-scrollbar">
            <div class="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-1.5">
              <span class="text-[10px] font-black uppercase tracking-wider text-indigo-500 block">Required Scope of Work</span>
              <p class="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed whitespace-pre-wrap">{{ selectedTicket.scope_of_work || selectedTicket.collaboration_reason || 'No scope details provided.' }}</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Your Unit's Dispatch</span>
                <p class="text-sm font-black mt-1" :class="selectedTicket.my_unit_dispatched ? 'text-emerald-700' : 'text-amber-700'">
                  {{ selectedTicket.my_unit_dispatched ? `✓ Dispatched (${(selectedTicket.my_unit_assignments || []).length} worker(s))` : '○ Not yet dispatched' }}
                </p>
                <div v-if="(selectedTicket.my_unit_assignments || []).length > 0" class="mt-2 space-y-1">
                  <div v-for="a in selectedTicket.my_unit_assignments" :key="a.id" class="text-[11px] font-semibold text-slate-700">• {{ a.worker_name }} <span class="text-slate-400">({{ a.worker_specialty || 'Worker' }} • {{ (a.implementation_date || '').toString().slice(0, 10) }})</span></div>
                </div>
              </div>
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Counterpart Dispatch</span>
                <p class="text-sm font-black mt-1" :class="(selectedTicket.other_unit_assignments || []).length > 0 ? 'text-emerald-700' : 'text-slate-500'">
                  {{ (selectedTicket.other_unit_assignments || []).length > 0 ? `✓ ${(selectedTicket.other_unit_assignments || []).length} worker(s) assigned` : '○ Awaiting counterpart' }}
                </p>
                <div v-if="(selectedTicket.other_unit_assignments || []).length > 0" class="mt-2 space-y-1">
                  <div v-for="a in selectedTicket.other_unit_assignments" :key="a.id" class="text-[11px] font-semibold text-slate-700">• {{ a.worker_name }} <span class="text-slate-400">({{ a.worker_unit_code || 'Unit' }})</span></div>
                </div>
              </div>
            </div>
            <div v-if="mode !== 'approved'" class="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-semibold leading-relaxed">
              Joint tickets auto-start on the implementation date. Only the requesting unit ({{ selectedTicket.requesting_unit_code }}) can start early or mark the ticket complete.
            </div>
          </div>
          <div class="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <button type="button" @click="selectedTicket = null" class="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer">Close</button>
            <div class="flex items-center gap-2 flex-wrap">
              <template v-if="canRespond(selectedTicket)">
                <button type="button" @click="respond(selectedTicket, 'accepted')" :disabled="actionLoading" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer disabled:opacity-50">Accept &amp; Coordinate</button>
                <button type="button" @click="respond(selectedTicket, 'declined')" :disabled="actionLoading" class="px-4 py-2.5 rounded-xl bg-white border border-rose-200 text-rose-700 text-xs font-bold cursor-pointer disabled:opacity-50">Decline</button>
              </template>
              <router-link
                v-if="showDispatchAction && assignRoute && !selectedTicket.is_outgoing && !selectedTicket.my_unit_dispatched"
                :to="`${assignRoute}?ticket=${selectedTicket.id}&collab=1`"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-black uppercase bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
              >
                Dispatch Workers
              </router-link>
              <button
                v-if="mode === 'scheduled' && selectedTicket.is_requesting_unit"
                type="button"
                @click="startEarly(selectedTicket)"
                :disabled="actionLoading"
                class="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black uppercase cursor-pointer disabled:opacity-50"
              >
                Start Job Early
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import api from '@/api/client';
import { fetchCollabTickets, respondCollaboration } from '@/api/collaborations';
import { toast } from 'vue3-toastify';

const props = defineProps({
  unitCode: { type: String, required: true },
  mode: { type: String, default: 'approved' }, // approved | scheduled | active | all
  direction: { type: String, default: '' },
  assignRoute: { type: String, default: '' },
  showDispatchAction: { type: Boolean, default: true },
  // When embedded under a parent tabbed toolbar (director queue style),
  // hide this component's own toolbar and filter via the parent's search input.
  hideToolbar: { type: Boolean, default: false },
  searchText: { type: String, default: '' },
  // When true, row clicks / Full Info buttons emit 'open-details' with the raw
  // ticket instead of opening this component's own modal — lets the parent
  // reuse its richer details modal so both tabs share one design.
  emitDetails: { type: Boolean, default: false },
});

const emit = defineEmits(['updated', 'open-details']);

const loading = ref(false);
const actionLoading = ref(false);
const tickets = ref([]);
const searchQuery = ref('');
const currentPage = ref(1);
const perPage = ref(15);
const selectedTicket = ref(null);

const resolvedDirection = computed(() => {
  if (props.direction) return props.direction;
  if (props.mode === 'approved') return 'incoming';
  if (props.mode === 'all') return 'incoming';
  return 'all';
});

const resolvedStage = computed(() => {
  if (props.mode === 'approved') return 'approved';
  if (props.mode === 'scheduled') return 'scheduled';
  if (props.mode === 'active') return 'active';
  return 'all';
});

const stageLabel = computed(() => {
  if (props.mode === 'approved') return 'Collab Requests (Incoming)';
  if (props.mode === 'scheduled') return 'Collab — Scheduled';
  if (props.mode === 'active') return 'Collab — Active';
  return 'Collab Tickets';
});

// Effective search: parent-owned input when embedded (hideToolbar),
// otherwise this component's own toolbar input.
const effectiveSearch = computed(() => (props.hideToolbar ? (props.searchText || '') : searchQuery.value));

const filteredTickets = computed(() => {
  let list = tickets.value;
  if (effectiveSearch.value.trim()) {
    const q = effectiveSearch.value.toLowerCase().trim();
    list = list.filter(t =>
      String(t.id).toLowerCase().includes(q) ||
      (t.title && t.title.toLowerCase().includes(q)) ||
      (t.service_type && String(t.service_type).toLowerCase().includes(q)) ||
      (t.requester && t.requester.toLowerCase().includes(q)) ||
      (t.location && String(t.location).toLowerCase().includes(q)) ||
      (t.scope_of_work && String(t.scope_of_work).toLowerCase().includes(q)) ||
      (t.requesting_unit_code && String(t.requesting_unit_code).toLowerCase().includes(q)) ||
      (t.collaborating_unit_code && String(t.collaborating_unit_code).toLowerCase().includes(q))
    );
  }
  return list;
});

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

const getInitials = (name) => {
  if (!name) return 'U';
  const parts = String(name).trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return String(name).substring(0, 2).toUpperCase();
};

const collabBadge = (t) => {
  switch (t.collaboration_status) {
    case 'pending': return { label: 'Awaiting Response', cls: 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' };
    case 'accepted': return { label: t.my_unit_dispatched ? 'Coordinated' : 'Accepted — Dispatch Now', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 'completed': return { label: 'Unit Done', cls: 'bg-blue-50 text-blue-700 border-blue-200' };
    case 'declined': return { label: 'Declined', cls: 'bg-rose-50 text-rose-700 border-rose-200' };
    default: return { label: t.collaboration_status || 'Collab', cls: 'bg-slate-100 text-slate-700 border-slate-200' };
  }
};

const canRespond = (t) => !t.is_outgoing && t.collaboration_status === 'pending';

const fetchTickets = async () => {
  loading.value = true;
  try {
    const res = await fetchCollabTickets({ direction: resolvedDirection.value, stage: resolvedStage.value });
    const list = res.data?.data?.tickets || [];
    tickets.value = Array.isArray(list) ? list : [];
  } catch (err) {
    console.error('Failed to load collab tickets:', err);
    toast.error('Failed to load collab tickets.');
  } finally {
    loading.value = false;
  }
};

const openDetailsModal = (ticket) => {
  if (props.emitDetails) {
    emit('open-details', ticket);
    return;
  }
  selectedTicket.value = ticket;
};

const respond = async (ticket, action) => {
  if (!ticket.collaboration_id) return;
  actionLoading.value = true;
  try {
    await respondCollaboration(ticket.collaboration_id, { action });
    toast.success(action === 'accepted' ? 'Collaboration accepted! Dispatch your workers.' : 'Collaboration declined.');
    await fetchTickets();
    if (selectedTicket.value && String(selectedTicket.value.id) === String(ticket.id)) {
      const fresh = tickets.value.find(t => String(t.id) === String(ticket.id));
      selectedTicket.value = fresh || null;
    }
    emit('updated');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to update collaboration.');
  } finally {
    actionLoading.value = false;
  }
};

const startEarly = async (ticket) => {
  if (!ticket.is_requesting_unit) {
    toast.error('Only the requesting unit may start a collaboration ticket early.');
    return;
  }
  actionLoading.value = true;
  try {
    await api.post('dispatch/start', { ticket_id: ticket.id });
    toast.success(`Joint ticket #${ticket.id} started early!`);
    await fetchTickets();
    selectedTicket.value = null;
    emit('updated');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to start ticket early.');
  } finally {
    actionLoading.value = false;
  }
};

watch(() => [props.mode, props.direction, props.unitCode], () => {
  currentPage.value = 1;
  fetchTickets();
});

// Parent-owned search (embedded mode): reset to first page as the user types.
watch(() => props.searchText, () => {
  currentPage.value = 1;
});

onMounted(fetchTickets);

defineExpose({ refresh: fetchTickets });
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
</style>
