<template>
  <div class="space-y-4 animate-fade-in relative pb-12">

    <!-- ═══ Compact Toolbar: Stage Pill + Search + Refresh ═══ -->
    <!-- Hidden when embedded under a parent tabbed toolbar (director-style): -->
    <!-- the parent toolbar owns the tabs + shared search input instead. -->
    <div v-if="!hideToolbar" class="bg-white rounded-2xl border border-slate-200 shadow-xs">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-1.5 border-b border-slate-100">
        <!-- If showStageTabs is false: show the single stage pill -->
        <div v-if="!showStageTabs" class="flex items-center gap-1.5">
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

        <!-- If showStageTabs is true: show tabs beside Collab Requests (Awaiting Dispatch) -->
        <div v-else class="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
          <!-- Tab 1: Collab Requests (Awaiting Dispatch) -->
          <button
            type="button"
            @click="switchStageTab('approved')"
            :class="[
              'flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs active:scale-95',
              currentStage === 'approved'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" :class="currentStage === 'approved' ? 'text-white' : 'text-indigo-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Collab Requests (Awaiting Dispatch)</span>
            <span
              :class="[
                'ml-1 px-2 py-0.5 rounded-full text-[10px] font-black leading-none',
                currentStage === 'approved' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              ]"
            >
              {{ stageCounts.approved }}
            </span>
          </button>

          <!-- Tab 2: Dispatched -->
          <button
            type="button"
            @click="switchStageTab('scheduled')"
            :class="[
              'flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs active:scale-95',
              currentStage === 'scheduled'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" :class="currentStage === 'scheduled' ? 'text-white' : 'text-slate-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Dispatched</span>
            <span
              :class="[
                'ml-1 px-2 py-0.5 rounded-full text-[10px] font-black leading-none',
                currentStage === 'scheduled' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              ]"
            >
              {{ stageCounts.scheduled }}
            </span>
          </button>

          <!-- Tab 3: Active Collab -->
          <button
            type="button"
            @click="switchStageTab('active')"
            :class="[
              'flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs active:scale-95',
              currentStage === 'active'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" :class="currentStage === 'active' ? 'text-white' : 'text-emerald-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Active Collab</span>
            <span
              :class="[
                'ml-1 px-2 py-0.5 rounded-full text-[10px] font-black leading-none',
                currentStage === 'active' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
              ]"
            >
              {{ stageCounts.active }}
            </span>
          </button>
        </div>

        <div class="text-[11px] text-slate-500 font-semibold px-2">
          <span v-if="effectiveMode === 'approved'">Incoming requests awaiting your unit's dispatch</span>
          <span v-else-if="effectiveMode === 'scheduled'">Dispatched collaboration requests scheduled with assigned personnel</span>
          <span v-else-if="effectiveMode === 'active'">Live cross-unit execution tracking with turnaround duration monitoring</span>
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
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Collab Flow</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Status</th>
              <th v-if="showDurations" class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Elapsed Duration</th>
              <th v-if="showDurations" class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Target Duration</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs">
            <tr v-if="loading && tickets.length === 0">
              <td :colspan="showDurations ? 6 : 4" class="py-16 text-center">
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
              <td :colspan="showDurations ? 6 : 4" class="py-16 text-center">
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
                <div v-if="effectiveMode !== 'approved'" class="text-[10px] font-bold mt-0.5" :class="ticket.my_unit_dispatched ? 'text-emerald-700' : 'text-amber-700'">
                  {{ ticket.my_unit_dispatched ? '✓ Your unit dispatched' : '○ Awaiting your dispatch' }}
                </div>
              </td>
              <!-- Elapsed Duration (from joint assignments, active collab only) -->
              <td v-if="showDurations" class="px-3 py-2.5 whitespace-nowrap">
                <span class="text-xs font-bold px-2 py-0.5 rounded-lg border inline-flex items-center gap-1.5 w-fit bg-indigo-50/60 border-indigo-200/70 text-indigo-900">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 shrink-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ elapsedFor(ticket) }}</span>
                </span>
                <span class="block text-[9px] font-black uppercase tracking-wider text-indigo-700 mt-0.5">
                  {{ hasStarted(ticket) ? '● In Progress' : '○ Awaiting Start' }}
                </span>
              </td>
              <!-- Target Duration (requesting unit's turnaround, active collab only) -->
              <td v-if="showDurations" class="px-3 py-2.5 whitespace-nowrap">
                <div class="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{{ targetDaysFor(ticket) }} {{ targetDaysFor(ticket) === 1 ? 'Day' : 'Days' }}</span>
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
                    v-if="showDispatchAction && assignRoute && !ticket.my_unit_dispatched && (effectiveMode === 'approved' ? !ticket.is_outgoing : true)"
                    :to="`${assignRoute}?ticket=${ticket.id}&collab=1`"
                    class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-white text-xs font-black transition-all shadow-xs bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Dispatch</span>
                  </router-link>
                  <button
                    v-if="effectiveMode === 'scheduled' && ticket.is_requesting_unit"
                    type="button"
                    @click="startEarly(ticket)"
                    :disabled="actionLoading"
                    class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                  >
                    Start Early
                  </button>
                  <!-- In Progress actions (active mode, handled by the parent workspace) -->
                  <template v-if="effectiveMode === 'active' && emitActions">
                    <button
                      type="button"
                      @click="emitAction('job-order', ticket)"
                      class="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold transition-all shadow-2xs active:scale-95 flex items-center gap-1 cursor-pointer border border-slate-200"
                      title="Print / View Job Order"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      <span>Job Order</span>
                    </button>
                    <button
                      type="button"
                      @click="emitAction('regen', ticket)"
                      class="p-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-900 border border-amber-200 text-xs font-bold transition-all shadow-2xs active:scale-95 flex items-center justify-center cursor-pointer"
                      title="Re-inject ticket data and generate fresh Job Order document"
                    >
                      <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                    <button
                      v-if="ticket.is_requesting_unit"
                      type="button"
                      @click="emitAction('extend', ticket)"
                      class="px-2.5 py-1.5 rounded-xl border border-amber-200/80 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95"
                      title="Grant timeline extension with reason"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Extend</span>
                    </button>
                    <button
                      v-if="ticket.is_requesting_unit"
                      type="button"
                      @click="emitAction('materials', ticket)"
                      class="px-2.5 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95"
                      title="Adjust ongoing materials and supplies"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Materials</span>
                    </button>
                    <button
                      v-if="ticket.is_requesting_unit"
                      type="button"
                      @click="emitAction('complete', ticket)"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-black transition-all shadow-xs active:scale-95 cursor-pointer bg-indigo-600 hover:bg-indigo-700"
                      title="Complete Job and log materials used"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Complete</span>
                    </button>
                  </template>
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
        <div v-if="showDurations" class="mt-2 flex items-center justify-between text-[11px] font-bold text-slate-600">
          <span class="inline-flex items-center gap-1 text-indigo-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ elapsedFor(ticket) }}
          </span>
          <span class="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] text-slate-700">
            {{ targetDaysFor(ticket) }} Target {{ targetDaysFor(ticket) === 1 ? 'Day' : 'Days' }}
          </span>
        </div>
        <div class="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-end gap-2 flex-wrap" @click.stop>
          <button type="button" @click="openDetailsModal(ticket)" class="px-3.5 py-2 min-h-[38px] rounded-xl border border-slate-200 text-slate-700 text-xs font-bold cursor-pointer">Full Info</button>
          <template v-if="canRespond(ticket)">
            <button type="button" @click="respond(ticket, 'accepted')" :disabled="actionLoading" class="px-3.5 py-2 min-h-[38px] rounded-xl bg-emerald-600 text-white text-xs font-black cursor-pointer disabled:opacity-50">Accept</button>
            <button type="button" @click="respond(ticket, 'declined')" :disabled="actionLoading" class="px-3.5 py-2 min-h-[38px] rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold cursor-pointer disabled:opacity-50">Decline</button>
          </template>
          <router-link
            v-if="showDispatchAction && assignRoute && !ticket.my_unit_dispatched && (effectiveMode === 'approved' ? !ticket.is_outgoing : true)"
            :to="`${assignRoute}?ticket=${ticket.id}&collab=1`"
            class="px-4 py-2 min-h-[38px] rounded-xl text-white text-xs font-black uppercase inline-flex items-center bg-indigo-600 cursor-pointer"
          >
            Dispatch
          </router-link>
          <button
            v-if="effectiveMode === 'scheduled' && ticket.is_requesting_unit"
            type="button"
            @click="startEarly(ticket)"
            :disabled="actionLoading"
            class="px-4 py-2 min-h-[38px] rounded-xl text-white text-xs font-black bg-amber-600 cursor-pointer disabled:opacity-50"
          >
            Start Early
          </button>
          <template v-if="effectiveMode === 'active' && emitActions">
            <button type="button" @click="emitAction('job-order', ticket)" class="py-2 px-2.5 min-h-[38px] rounded-xl border border-slate-200 bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer">Job Order</button>
            <button
              v-if="ticket.is_requesting_unit"
              type="button"
              @click="emitAction('extend', ticket)"
              class="py-2 px-3 min-h-[38px] rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-xs font-black cursor-pointer"
            >
              Extend
            </button>
            <button
              v-if="ticket.is_requesting_unit"
              type="button"
              @click="emitAction('materials', ticket)"
              class="py-2 px-2.5 min-h-[38px] rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-black cursor-pointer"
            >
              Materials
            </button>
            <button
              v-if="ticket.is_requesting_unit"
              type="button"
              @click="emitAction('complete', ticket)"
              class="py-2 px-3 min-h-[38px] rounded-xl text-white text-xs font-black bg-indigo-600 cursor-pointer"
            >
              Complete Job
            </button>
          </template>
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

    <!-- ═══ Full Comprehensive Collab Ticket Details Modal ═══ -->
    <Teleport to="body">
      <div
        v-if="selectedTicket"
        class="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto pointer-events-auto"
        @click.self="selectedTicket = null"
      >
        <div class="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 animate-scale-up flex flex-col max-h-[calc(100dvh-2rem)] sm:max-h-[88vh] overflow-hidden my-auto pointer-events-auto" @click.stop>
          
          <!-- Fixed Modal Header -->
          <div class="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 bg-white">
            <div>
              <div class="flex flex-wrap items-center gap-2.5 mb-1.5">
                <span class="font-mono text-base sm:text-lg font-black px-3.5 py-1 rounded-xl border text-indigo-700 bg-indigo-50 border-indigo-200">
                  #{{ selectedTicket.id }}
                </span>
                <span v-if="selectedTicket.implementation_date" class="text-xs sm:text-sm font-bold text-slate-400">
                  {{ effectiveMode === 'active' ? 'Started ' : 'Scheduled for ' }}{{ formatDate(selectedTicket.implementation_date) }}
                </span>
                <span :class="['px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border', collabBadge(selectedTicket).cls]">
                  {{ collabBadge(selectedTicket).label }}
                </span>
                <span class="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase tracking-wider border border-indigo-200 inline-flex items-center gap-1 shadow-2xs">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-indigo-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Cross-Unit Collaboration
                </span>
                <span :class="['px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border', selectedTicket.is_outgoing ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-indigo-50 text-indigo-800 border-indigo-200']">
                  {{ selectedTicket.is_outgoing ? 'Outgoing Request' : 'Incoming Request' }}
                </span>
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {{ selectedTicket.title || selectedTicket.job_description || 'Collaborative Ticket Particulars' }}
              </h3>
              <p class="text-xs text-slate-500 font-medium mt-0.5">
                {{ selectedTicket.requesting_unit_code || 'Unit' }} → {{ selectedTicket.collaborating_unit_code || 'Unit' }} • Requested by {{ selectedTicket.requester || 'Requester' }}
              </p>
            </div>
            <button
              type="button"
              @click="selectedTicket = null"
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
            <div class="space-y-3.5">
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
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-[11px] font-black border border-indigo-500/30">
                      {{ getTotalCollabWorkers(selectedTicket) }} {{ getTotalCollabWorkers(selectedTicket) === 1 ? 'Worker' : 'Total Workers' }}
                    </span>
                    <span
                      :class="[
                        'px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border',
                        effectiveMode === 'active'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : effectiveMode === 'scheduled'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      ]"
                    >
                      {{ effectiveMode === 'active' ? 'Active Execution' : effectiveMode === 'scheduled' ? 'Scheduled' : 'Awaiting Dispatch' }}
                    </span>
                  </div>
                </div>

                <!-- Joint Schedule & Scope Details -->
                <div class="pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                  <div class="flex items-center gap-4 flex-wrap">
                    <div v-if="selectedTicket.implementation_date">
                      <span class="text-[9px] text-slate-400 uppercase font-black block">Planned Joint Start Date</span>
                      <span class="font-bold text-white text-xs sm:text-sm">{{ formatDate(selectedTicket.implementation_date) }}</span>
                    </div>
                    <div>
                      <span class="text-[9px] text-slate-400 uppercase font-black block">Target Duration</span>
                      <span class="font-bold text-slate-200 text-xs sm:text-sm">{{ targetDaysFor(selectedTicket) }} {{ targetDaysFor(selectedTicket) === 1 ? 'Day' : 'Days' }}</span>
                    </div>
                    <div v-if="showDurations">
                      <span class="text-[9px] text-indigo-300 uppercase font-black block">Elapsed Working Time</span>
                      <span class="font-bold text-emerald-300 text-xs sm:text-sm flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        {{ elapsedFor(selectedTicket) }}
                      </span>
                    </div>
                  </div>
                  <div v-if="selectedTicket.scope_of_work || selectedTicket.collaboration_reason" class="text-right max-w-xs">
                    <span class="text-[9px] text-indigo-300 uppercase font-black block">Collaboration Scope</span>
                    <span class="text-[11px] text-slate-300 line-clamp-1 italic" :title="selectedTicket.scope_of_work || selectedTicket.collaboration_reason">
                      "{{ selectedTicket.scope_of_work || selectedTicket.collaboration_reason }}"
                    </span>
                  </div>
                </div>
              </div>

              <!-- Dedicated Card Per Participating Unit -->
              <div class="space-y-3">
                <div
                  v-for="unitGroup in getCollabUnitsWithWorkers(selectedTicket)"
                  :key="unitGroup.code"
                  :class="[
                    'rounded-2xl border p-4 sm:p-5 transition-all shadow-xs',
                    unitGroup.theme.containerClass
                  ]"
                >
                  <!-- Unit Header -->
                  <div
                    class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b"
                    :class="unitGroup.theme.headerBorder"
                  >
                    <div class="flex items-center gap-2.5 min-w-0">
                      <span
                        :class="[
                          'font-mono text-xs sm:text-sm font-black px-2.5 py-1 rounded-lg border shrink-0',
                          unitGroup.theme.badgeClass
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
                          unitGroup.theme.statusClass
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
                            unitGroup.theme.avatarClass
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
                                unitGroup.theme.pillClass
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
                        <span>No personnel dispatched yet by <strong>{{ unitGroup.code }}</strong> for this joint engagement.</span>
                      </div>
                      <button
                        v-if="unitGroup.isMyUnit && showDispatchAction && assignRoute"
                        type="button"
                        @click="goToDispatchWorkers(selectedTicket)"
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

            <!-- Requester & Location Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <!-- Requester Profile -->
              <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Requester Profile</span>
                <p class="text-base sm:text-lg font-black text-slate-900 leading-tight">{{ selectedTicket.requester || 'End User' }}</p>
                <p class="text-xs text-slate-600 font-semibold flex items-center gap-2">
                  <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <span class="truncate">{{ selectedTicket.email || 'No institutional email' }}</span>
                </p>
                <a
                  v-if="selectedTicket.contact_number && selectedTicket.contact_number !== 'N/A'"
                  :href="`tel:${selectedTicket.contact_number}`"
                  class="inline-flex items-center gap-2 mt-1 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors group w-fit"
                >
                  <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <span class="text-base sm:text-lg font-black font-mono tracking-wide text-emerald-800 group-hover:text-emerald-900">{{ selectedTicket.contact_number }}</span>
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
                <p class="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  {{ selectedTicket.location || selectedTicket.college_building || 'Main Campus' }}
                </p>
                <p class="text-xs text-slate-500 font-semibold flex items-center gap-2">
                  <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                  <span>Campus Facility / Building</span>
                </p>
                <div v-if="selectedTicket.office_room && selectedTicket.office_room !== 'N/A'" class="pt-0.5">
                  <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs text-slate-800">
                    <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 20V6a2 2 0 00-2-2H8a2 2 0 00-2 2v14 M2 20h20 M14 12v.01" />
                    </svg>
                    <span class="text-xs font-bold text-slate-500">Room / Office:</span>
                    <span class="text-sm sm:text-base font-black text-slate-900 tracking-tight">{{ selectedTicket.office_room }}</span>
                  </div>
                </div>
                <div v-if="selectedTicket.source_of_fund && selectedTicket.source_of_fund !== 'N/A'" class="pt-1">
                  <span class="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold inline-block">
                    Fund: {{ selectedTicket.source_of_fund }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Service & Job Particulars -->
            <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <div class="flex items-center justify-between gap-3">
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Job Particular &amp; Nature of Work</span>
                <span class="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border bg-indigo-50 text-indigo-700 border-indigo-200">
                  {{ selectedTicket.service || selectedTicket.service_type || 'General Service' }}
                </span>
              </div>
              <p class="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-wrap bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/70 shadow-2xs">
                {{ selectedTicket.job_description || selectedTicket.description || selectedTicket.title || 'No detailed scope notes provided.' }}
              </p>
            </div>

            <!-- Official Job Order Document Section -->
            <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold border shrink-0 bg-indigo-50 text-indigo-700 border-indigo-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                      Official Job Order (QM-GSO-{{ props.unitCode }}-01)
                    </h4>
                    <p class="text-[11px] text-slate-500 font-medium mt-0.5">
                      Official job request document filled with requester information, location, designated personnel, and scheduled dates.
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                  <button
                    type="button"
                    @click="openJobOrderDocument(selectedTicket)"
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
                <span class="w-2 h-3 rounded-full bg-indigo-500"></span>
                Attached images and documents ({{ (selectedTicket.attachments || []).length }})
              </span>

              <div v-if="!selectedTicket.attachments || selectedTicket.attachments.length === 0" class="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-slate-400 text-xs">
                No files or images attached to this ticket.
              </div>

              <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div
                  v-for="(file, idx) in selectedTicket.attachments"
                  :key="idx"
                  @click="downloadAttachment(file)"
                  class="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200 cursor-pointer transition-all shadow-2xs group hover:border-indigo-400 hover:bg-indigo-50/30"
                >
                  <div class="flex items-center gap-2.5 truncate">
                    <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-indigo-50 text-indigo-700">
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

            <div v-if="effectiveMode !== 'approved'" class="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-semibold leading-relaxed">
              Joint tickets auto-start on the implementation date. Only the requesting unit ({{ selectedTicket.requesting_unit_code }}) can start early or mark the ticket complete.
            </div>
          </div>

          <!-- Fixed Modal Footer Actions -->
          <div class="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <button type="button" @click="selectedTicket = null" class="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer">
              Close Full Info
            </button>
            <div class="flex items-center gap-2 flex-wrap">
              <template v-if="canRespond(selectedTicket)">
                <button type="button" @click="respond(selectedTicket, 'accepted')" :disabled="actionLoading" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer disabled:opacity-50">Accept &amp; Coordinate</button>
                <button type="button" @click="respond(selectedTicket, 'declined')" :disabled="actionLoading" class="px-4 py-2.5 rounded-xl bg-white border border-rose-200 text-rose-700 text-xs font-bold cursor-pointer disabled:opacity-50">Decline</button>
              </template>
              <button
                v-if="showDispatchAction && assignRoute && (!selectedTicket.my_unit_dispatched || canDispatchCollabWorkers(selectedTicket))"
                type="button"
                @click="goToDispatchWorkers(selectedTicket)"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-black uppercase bg-indigo-600 hover:bg-indigo-700 cursor-pointer shadow-xs active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>Dispatch {{ props.unitCode }} Workers</span>
              </button>
              <button
                type="button"
                @click="openJobOrderDocument(selectedTicket)"
                class="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-black uppercase tracking-wider transition-all shadow-2xs active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                title="Print official Job Order document"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Print Job Order</span>
              </button>
              <button
                v-if="effectiveMode === 'scheduled' && selectedTicket.is_requesting_unit"
                type="button"
                @click="startEarly(selectedTicket)"
                :disabled="actionLoading"
                class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-black uppercase cursor-pointer disabled:opacity-50 shadow-xs active:scale-95 flex items-center gap-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
                <span>Start Job Early</span>
              </button>
              <button
                v-if="effectiveMode === 'active' && selectedTicket.is_requesting_unit && emitActions"
                type="button"
                @click="emitAction('complete', selectedTicket); selectedTicket = null"
                class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>Complete Job</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ═══ Document Viewer Modal ═══ -->
    <DocumentViewerModal
      :is-open="viewerModal.isOpen"
      :title="viewerModal.title"
      :file-name="viewerModal.fileName"
      :file-blob="viewerModal.fileBlob"
      :allow-regenerate="viewerModal.allowRegenerate"
      :is-regenerating="viewerModal.isRegenerating"
      @close="viewerModal.isOpen = false"
      @regenerate="handleRegenerateJobOrder"
    />

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/client';
import { fetchCollabTickets, respondCollaboration, getTicketCollaborations } from '@/api/collaborations';
import { calculateWorkingHoursElapsed, parseDateLocal } from '@/utils/workCalendar';
import { toast } from 'vue3-toastify';
import { getWorkerInitials } from '@/utils/ticketPersonnelHelper';
import DocumentViewerModal from '@/components/DocumentViewerModal.vue';
import { generateFgmuJobRequestFormDocxBlob } from '@/utils/fgmuDocxGenerator';

const props = defineProps({
  unitCode: { type: String, required: true },
  mode: { type: String, default: 'approved' }, // approved | scheduled | active | all
  direction: { type: String, default: '' },
  assignRoute: { type: String, default: '' },
  showDispatchAction: { type: Boolean, default: true },
  // When embedded under a parent tabbed toolbar (director queue style),
  // hide this component's own toolbar and filter via the parent's search input.
  hideToolbar: { type: Boolean, default: false },
  // Standalone stage tabs rendered directly in the top toolbar row (beside Collab Requests)
  showStageTabs: { type: Boolean, default: false },
  searchText: { type: String, default: '' },
  // When true, row clicks / Full Info buttons emit 'open-details' with the raw
  // ticket instead of opening this component's own modal — lets the parent
  // reuse its richer details modal so both tabs share one design.
  emitDetails: { type: Boolean, default: false },
  // When true (active mode), rows expose the In Progress action set
  // (Job Order, Extend, Materials, Complete) via 'collab-action' events
  // handled by the parent workspace. Extend / Materials / Complete
  // are requesting-unit only.
  emitActions: { type: Boolean, default: false },
});

const emit = defineEmits(['updated', 'open-details', 'collab-action']);

const route = useRoute();
const router = useRouter();

const resolveInitialStage = (tabQuery) => {
  if (tabQuery === 'dispatched' || tabQuery === 'scheduled') return 'scheduled';
  if (tabQuery === 'active') return 'active';
  return 'approved';
};

const currentStage = ref(props.showStageTabs ? resolveInitialStage(route?.query?.tab) : (props.mode || 'approved'));
const effectiveMode = computed(() => (props.showStageTabs ? currentStage.value : props.mode));

const stageCounts = ref({ approved: 0, scheduled: 0, active: 0 });

const switchStageTab = (stage) => {
  if (currentStage.value === stage) return;
  currentStage.value = stage;
  if (router && route) {
    router.replace({
      query: {
        ...route.query,
        tab: stage === 'scheduled' ? 'dispatched' : stage
      }
    });
  }
  fetchTickets();
};

watch(() => route?.query?.tab, (newTab) => {
  if (props.showStageTabs && newTab) {
    const resolved = resolveInitialStage(newTab);
    if (currentStage.value !== resolved) {
      currentStage.value = resolved;
      fetchTickets();
    }
  }
});

const fetchStageCounts = async () => {
  if (!props.showStageTabs) return;
  try {
    const [appRes, schedRes, actRes] = await Promise.all([
      fetchCollabTickets({ stage: 'approved', direction: 'incoming' }),
      fetchCollabTickets({ stage: 'scheduled', direction: 'all' }),
      fetchCollabTickets({ stage: 'active', direction: 'all' }),
    ]);
    stageCounts.value = {
      approved: (appRes.data?.data?.tickets || []).length,
      scheduled: (schedRes.data?.data?.tickets || []).length,
      active: (actRes.data?.data?.tickets || []).length,
    };
  } catch (err) {
    console.warn('Failed to fetch collab stage counts:', err);
  }
};

const emitAction = (action, ticket) => {
  emit('collab-action', { action, ticket });
};

const loading = ref(false);
const actionLoading = ref(false);
const tickets = ref([]);
const searchQuery = ref('');
const currentPage = ref(1);
const perPage = ref(15);
const selectedTicket = ref(null);

const resolvedDirection = computed(() => {
  if (props.direction) return props.direction;
  if (effectiveMode.value === 'approved') return 'incoming';
  if (effectiveMode.value === 'all') return 'incoming';
  return 'all';
});

const resolvedStage = computed(() => {
  if (effectiveMode.value === 'approved') return 'approved';
  if (effectiveMode.value === 'scheduled') return 'scheduled';
  if (effectiveMode.value === 'active') return 'active';
  return 'all';
});

const stageLabel = computed(() => {
  if (effectiveMode.value === 'approved') return 'Collab Requests (Awaiting Dispatch)';
  if (effectiveMode.value === 'scheduled') return 'Collab — Scheduled';
  if (effectiveMode.value === 'active') return 'Collab — Active';
  return 'Collab Tickets';
});

// Elapsed / Target durations are meaningful only once joint work has started,
// so they are shown exclusively on the Active collab tab (both requesting and
// receiving units share the ActiveTicketsWorkspace with mode="active").
const showDurations = computed(() => effectiveMode.value === 'active');

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

// Joint assignments backing a collab row (backend returns ta.* + worker info).
const collabAssignments = (ticket) =>
  Array.isArray(ticket?.assignments) ? ticket.assignments : [];

// Elapsed working duration from the earliest started joint assignment.
const hasStarted = (ticket) =>
  collabAssignments(ticket).some(a => a.dispatched_at || a.implementation_date || a.assigned_at);

const elapsedFor = (ticket) => {
  const assigns = collabAssignments(ticket);
  const started = assigns.find(a => a.dispatched_at) || assigns[0];
  if (!started) return 'Awaiting start';
  const startRaw = started.dispatched_at || started.implementation_date || started.assigned_at;
  if (!startRaw) return 'Awaiting start';
  try {
    const dur = calculateWorkingHoursElapsed(startRaw, new Date(), ticket?.overtime_hours || 0);
    return dur.formatted;
  } catch {
    return 'In Progress';
  }
};

// Target turnaround in working days (set by the requesting unit).
const targetDaysFor = (ticket) => {
  const assigns = collabAssignments(ticket);
  const days = Number(assigns[0]?.working_days);
  return days >= 1 ? days : 1;
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
    if (props.showStageTabs) {
      stageCounts.value[currentStage.value] = tickets.value.length;
      fetchStageCounts();
    }
  } catch (err) {
    console.error('Failed to load collab tickets:', err);
    toast.error('Failed to load collab tickets.');
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'Not scheduled';
  try {
    const d = parseDateLocal(dateString);
    if (!d || isNaN(d.getTime())) return String(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return String(dateString);
  }
};

const getUnitFullName = (unitCode) => {
  const code = String(unitCode || '').toUpperCase().trim();
  if (code === 'LEAU') return 'Landscaping & Environmental Aesthetics Unit';
  if (code === 'SSU') return 'Security Services Unit';
  return 'Facilities & Grounds Management Unit';
};

const getUnitTheme = (unitCode) => {
  const code = String(unitCode || '').toUpperCase().trim();
  if (code === 'LEAU') {
    return {
      containerClass: 'bg-emerald-50/40 border-emerald-200/90',
      headerBorder: 'border-emerald-200/60',
      badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      avatarClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      pillClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      statusClass: 'bg-emerald-100/90 text-emerald-800 border-emerald-300',
    };
  }
  if (code === 'SSU') {
    return {
      containerClass: 'bg-indigo-50/40 border-indigo-200/90',
      headerBorder: 'border-indigo-200/60',
      badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      avatarClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      pillClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      statusClass: 'bg-indigo-100/90 text-indigo-800 border-indigo-300',
    };
  }
  return {
    containerClass: 'bg-amber-50/40 border-amber-200/90',
    headerBorder: 'border-amber-200/60',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    avatarClass: 'bg-amber-100 text-amber-800 border-amber-200',
    pillClass: 'bg-amber-50 text-amber-800 border-amber-200',
    statusClass: 'bg-amber-100/90 text-amber-800 border-amber-300',
  };
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
  selectedTicket.value = null;
  const targetRoute = props.assignRoute || `/admin/${props.unitCode.toLowerCase()}/assign-workers`;
  router.push(`${targetRoute}?ticket=${tId}&collab=1`);
};

// Document Viewer state
const activeJobOrderTicket = ref(null);
const viewerModal = reactive({
  isOpen: false,
  title: '',
  fileName: '',
  fileBlob: null,
  allowRegenerate: false,
  isRegenerating: false,
});

const openJobOrderDocument = async (ticket) => {
  if (!ticket) return;
  activeJobOrderTicket.value = ticket;
  try {
    const ticketId = ticket.id;
    const unit = props.unitCode?.toUpperCase() || ticket.unit_code || 'SSU';
    viewerModal.title = `${unit} Job Order (Job Request Form) - #${ticketId}`;
    viewerModal.fileName = `${unit}_Job_Order_#${ticketId}.docx`;
    viewerModal.fileBlob = null;
    viewerModal.allowRegenerate = true;
    viewerModal.isRegenerating = false;
    viewerModal.isOpen = true;

    let freshTicket = ticket;
    try {
      const res = await api.get(`tickets/${ticketId}`);
      const raw = res.data?.data?.ticket || res.data?.data;
      if (raw) {
        freshTicket = { ...ticket, ...raw };
      }
    } catch (e) {
      console.warn('Using in-memory ticket data for docx generation:', e);
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
  viewerModal.fileBlob = null;

  try {
    toast.info('Re-injecting ticket data and generating new Job Order document...');
    const ticket = activeJobOrderTicket.value;
    const ticketId = ticket.id;
    const unit = props.unitCode?.toUpperCase() || ticket.unit_code || 'SSU';

    let freshTicket = ticket;
    try {
      const res = await api.get(`tickets/${ticketId}`);
      const raw = res.data?.data?.ticket || res.data?.data;
      if (raw) {
        freshTicket = { ...ticket, ...raw };
      }
    } catch (fetchErr) {
      console.warn('Could not fetch single ticket:', fetchErr);
    }

    const ticketData = {
      ...freshTicket,
      unit_code: unit,
      unit: unit,
      ticketRef: freshTicket.ticket_number || freshTicket.reference_number || `${unit}-TIC-${ticketId}`,
      regenerated_at: new Date().toISOString()
    };

    const docxBlob = await generateFgmuJobRequestFormDocxBlob(ticketData, freshTicket.feedback);

    try {
      const formData = new FormData();
      formData.append('attachments[]', docxBlob, `${unit}_Job_Order_#${ticketId}.docx`);
      await api.post(`tickets/${ticketId}/attachments`, formData, {
        headers: { 'Content-Type': undefined }
      });
      const refreshRes = await api.get(`tickets/${ticketId}`);
      const refreshRaw = refreshRes.data?.data?.ticket || refreshRes.data?.data;
      if (refreshRaw) {
        freshTicket = { ...ticket, ...refreshRaw };
        if (selectedTicket.value && selectedTicket.value.id === ticketId) {
          selectedTicket.value = { ...selectedTicket.value, ...refreshRaw };
        }
      }
    } catch (attachErr) {
      console.warn('Could not save regenerated attachment:', attachErr);
    }

    viewerModal.fileBlob = docxBlob;
    toast.success('New Job Order document successfully re-generated with updated data!');
  } catch (err) {
    console.error('Failed to regenerate Job Order document:', err);
    toast.error('Failed to re-generate document: ' + (err.message || 'Error'));
  } finally {
    viewerModal.isRegenerating = false;
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

const openDetailsModal = async (ticket) => {
  if (props.emitDetails) {
    emit('open-details', ticket);
    return;
  }
  selectedTicket.value = { ...ticket };

  try {
    const [ticketRes, collabRes] = await Promise.allSettled([
      api.get(`tickets/${ticket.id}`),
      getTicketCollaborations(ticket.id),
    ]);

    let fresh = { ...ticket };

    if (ticketRes.status === 'fulfilled') {
      const raw = ticketRes.value.data?.data?.ticket || ticketRes.value.data?.data;
      if (raw) {
        const requesterName = raw.requester 
          || raw.requestedBy
          || raw.requested_by
          || raw.details?.requesting_personnel
          || raw.details?.end_user
          || (raw.user ? `${raw.user.first_name || ''} ${raw.user.last_name || ''}`.trim() : '')
          || (raw.first_name || raw.last_name ? `${raw.first_name || ''} ${raw.last_name || ''}`.trim() : '')
          || fresh.requester
          || 'End User';

        fresh = {
          ...fresh,
          ...raw,
          title: raw.title || fresh.title,
          service: raw.service || raw.service_type || fresh.service || 'General Service',
          service_type: raw.service_type || raw.service || fresh.service_type || 'General Service',
          requester: requesterName,
          requestedBy: requesterName,
          email: raw.email || raw.user?.email || fresh.email || '',
          contact_number: raw.contact_number || raw.requester_contact || raw.details?.contact_number || raw.details?.contact_no || raw.user?.contact_number || fresh.contact_number || 'N/A',
          location: raw.location || raw.college_building || raw.details?.college_building || fresh.location || 'Campus Facility',
          college_building: raw.details?.college_building || raw.college_building || raw.location || fresh.college_building || 'Campus Facility',
          office_room: raw.details?.office_room || raw.office_room || fresh.office_room || 'N/A',
          source_of_fund: raw.details?.source_of_fund || raw.source_of_fund || fresh.source_of_fund || null,
          job_description: raw.description || raw.job_description || fresh.job_description || fresh.description || '',
          attachments: raw.attachments || fresh.attachments || [],
          implementation_date: raw.assignment?.implementation_date || raw.implementation_date || fresh.implementation_date || null,
          working_days: raw.assignment?.working_days || raw.working_days || raw.project_working_days || fresh.working_days || null,
          feedback: raw.feedback || fresh.feedback || null,
          details: raw.details || fresh.details || null,
        };
      }
    }

    if (collabRes.status === 'fulfilled') {
      const payload = collabRes.value.data?.data;
      if (payload) {
        const rawList = Array.isArray(payload) ? payload : (payload.collaborations || payload.data || []);
        if (Array.isArray(rawList) && rawList.length > 0) {
          fresh.collaborations = rawList;
        }
        if (Array.isArray(payload.assignments) && payload.assignments.length > 0) {
          fresh.collab_assignments = payload.assignments;
          fresh.assignments = payload.assignments;
        }
      }
    }

    const myCode = String(props.unitCode || '').toUpperCase();
    const reqCode = String(fresh.requesting_unit_code || fresh.unit_code || '').toUpperCase();
    fresh.is_requesting_unit = fresh.is_requesting_unit ?? (reqCode ? reqCode === myCode : !fresh.is_outgoing);

    if (selectedTicket.value && String(selectedTicket.value.id) === String(ticket.id)) {
      selectedTicket.value = fresh;
    }
  } catch (err) {
    console.error('Failed to load full ticket details for modal:', err);
  }
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

const getCounterpartUnitCode = (ticket) => {
  if (!ticket) return 'Unit';
  return ticket.is_outgoing
    ? (ticket.collaborating_unit_code || 'Unit')
    : (ticket.requesting_unit_code || 'Unit');
};

watch(() => [props.mode, props.direction, props.unitCode], () => {
  currentPage.value = 1;
  fetchTickets();
});

// Parent-owned search (embedded mode): reset to first page as the user types.
watch(() => props.searchText, () => {
  currentPage.value = 1;
});

onMounted(() => {
  fetchTickets();
  if (props.showStageTabs) {
    fetchStageCounts();
  }
});

defineExpose({ refresh: fetchTickets });
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
</style>
