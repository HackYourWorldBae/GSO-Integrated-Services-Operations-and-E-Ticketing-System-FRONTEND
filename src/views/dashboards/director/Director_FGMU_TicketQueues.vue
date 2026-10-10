<template>
  <MainLayout>
    <template #sidebar-links>
      <DirectorSidebar v-if="authStore.role === 'director'" />
      <template v-else>
        <router-link to="/admin/fgmu" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span class="text">FGMU Home</span>
        </router-link>
        <router-link to="/admin/fgmu/queues" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span class="text">Pending Approvals</span>
        </router-link>
        <router-link to="/admin/fgmu/personnel" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span class="text">Personnel Management</span>
        </router-link>
        <div class="mt-8 mb-4 px-4">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Archives</p>
        </div>
        <router-link to="/admin/fgmu/archives" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <span class="text">Archived Tickets</span>
        </router-link>
      </template>
    </template>

    <template #header-title>
      <div class="flex flex-col min-w-0">
        <div class="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <h2 class="text-sm sm:text-xl font-bold text-slate-900 tracking-tight leading-none truncate">
            {{ isDirector ? 'FGMU Ticket Overview' : 'FGMU Pending Approvals' }}
          </h2>
          <span class="px-1.5 sm:px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider border border-emerald-200 shrink-0">
            <span class="hidden md:inline">{{ activeTabCount }} {{ activeTabLabel }}</span>
            <span class="md:hidden">{{ activeTabCount }}</span>
          </span>
        </div>
        <p class="text-xs text-emerald-700 font-bold uppercase tracking-wider mt-0.5 sm:mt-1 truncate hidden sm:block">
          {{ isDirector ? 'Director Executive Review • Facilities & Grounds Management (FGMU)' : 'Unit Head Operations & Approvals • Facilities & Grounds Management (FGMU)' }}
        </p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-4 animate-fade-in relative pb-12">

        <!-- ═══ Unified Compact Toolbar: Tabs + Search + Filter ═══ -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs">
          <!-- Top row: Stage Tabs -->
          <!-- Top row: Stage Tabs (Flat, Accessible, Single-Click for Senior Administrators) -->
          <div :class="['grid gap-1.5 p-1.5 border-b border-slate-100', isPendingOnlyMode ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5']">
            <!-- Tab 1: Pending / Escalated Approval -->
            <button
              @click="switchTab('pending')"
              :class="[
                'w-full flex items-center justify-center gap-2 px-3 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer min-h-[44px]',
                activeTab === 'pending'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-200'
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="truncate">{{ isPendingOnlyMode ? '1. Pending Approval' : (isDirector ? '1. Escalated Approvals' : '1. Pending Approval') }}</span>
              <span
                :class="[
                  'ml-1.5 px-2.5 py-0.5 rounded-lg text-xs sm:text-sm font-black leading-none shrink-0 min-w-[24px] text-center shadow-xs transition-all',
                  activeTab === 'pending' ? 'bg-white text-emerald-950 font-black' : 'bg-emerald-100 text-emerald-950'
                ]"
              >
                {{ queueCounts.pending }}
              </span>
            </button>

            <!-- Tab 2: Approval Delayed -->
            <button
              @click="switchTab('delayed')"
              :class="[
                'w-full flex items-center justify-center gap-2 px-3 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer min-h-[44px]',
                activeTab === 'delayed'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-200'
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="truncate">2. Approval Delayed</span>
              <span
                :class="[
                  'ml-1.5 px-2.5 py-0.5 rounded-lg text-xs sm:text-sm font-black leading-none shrink-0 min-w-[24px] text-center shadow-xs transition-all',
                  activeTab === 'delayed' ? 'bg-white text-amber-950 font-black' : 'bg-amber-100 text-amber-950'
                ]"
              >
                {{ queueCounts.delayed || 0 }}
              </span>
            </button>

            <!-- Tab 3: Approved (Awaiting Dispatch) -->
            <button
              v-if="!isPendingOnlyMode"
              @click="switchTab('approved')"
              :class="[
                'w-full flex items-center justify-center gap-2 px-3 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer min-h-[44px]',
                activeTab === 'approved'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-200'
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span class="truncate">3. Approved (Ready)</span>
              <span
                :class="[
                  'ml-1.5 px-2.5 py-0.5 rounded-lg text-xs sm:text-sm font-black leading-none shrink-0 min-w-[24px] text-center shadow-xs transition-all',
                  activeTab === 'approved' ? 'bg-white text-emerald-950 font-black' : 'bg-emerald-100 text-emerald-950'
                ]"
              >
                {{ queueCounts.approved || 0 }}
              </span>
            </button>

            <!-- Tab 4: Dispatched / Scheduled -->
            <button
              v-if="!isPendingOnlyMode"
              @click="switchTab('dispatched')"
              :class="[
                'w-full flex items-center justify-center gap-2 px-3 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer min-h-[44px]',
                activeTab === 'dispatched'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-200'
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="truncate">4. Scheduled</span>
              <span
                :class="[
                  'ml-1.5 px-2.5 py-0.5 rounded-lg text-xs sm:text-sm font-black leading-none shrink-0 min-w-[24px] text-center shadow-xs transition-all',
                  activeTab === 'dispatched' ? 'bg-white text-emerald-950 font-black' : 'bg-blue-100 text-blue-950'
                ]"
              >
                {{ queueCounts.dispatched || 0 }}
              </span>
            </button>

            <!-- Tab 5: Active Work Orders -->
            <button
              v-if="!isPendingOnlyMode"
              @click="switchTab('active')"
              :class="[
                'w-full flex items-center justify-center gap-2 px-3 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer min-h-[44px]',
                activeTab === 'active'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-200'
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span class="truncate">5. In Progress</span>
              <span
                :class="[
                  'ml-1.5 px-2.5 py-0.5 rounded-lg text-xs sm:text-sm font-black leading-none shrink-0 min-w-[24px] text-center shadow-xs transition-all',
                  activeTab === 'active' ? 'bg-white text-emerald-950 font-black' : 'bg-emerald-100 text-emerald-950'
                ]"
              >
                {{ queueCounts.active || 0 }}
              </span>
            </button>
          </div>

          <!-- Bottom row: Search + Filter + Refresh -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2">
            <!-- Search -->
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
                placeholder="Search tickets..."
                class="w-full pl-8 pr-8 py-2.5 sm:py-2 min-h-[44px] sm:min-h-0 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-base sm:text-xs font-semibold placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
              />
              <button
                v-if="searchQuery"
                @click="searchQuery = ''; currentPage = 1"
                class="absolute inset-y-0 right-0 w-11 flex items-center justify-center text-slate-400 hover:text-slate-600 touch-manipulation cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <!-- Service Filter -->
            <select
              v-model="selectedServiceFilter"
              @change="currentPage = 1"
              class="px-2.5 py-2.5 sm:py-2 min-h-[44px] sm:min-h-0 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-base sm:text-xs font-semibold focus:outline-none focus:border-emerald-500 transition-all shrink-0 touch-manipulation cursor-pointer"
            >
              <option value="">All Services</option>
              <option v-for="service in serviceCategories" :key="service" :value="service">{{ service }}</option>
            </select>
            <!-- Escalation Filter Pills (Pending tab only, for Unit Head) -->
            <div v-if="activeTab === 'pending' && !isDirector" class="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 shadow-inner shrink-0">
              <button
                type="button"
                @click="selectedEscalationFilter = 'all'; currentPage = 1"
                class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer"
                :class="selectedEscalationFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
              >
                All ({{ queueCounts.pending }})
              </button>
              <button
                type="button"
                @click="selectedEscalationFilter = 'escalated'; currentPage = 1"
                class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                :class="selectedEscalationFilter === 'escalated' ? 'bg-purple-600 text-white shadow-xs' : 'text-purple-700 hover:text-purple-900'"
              >
                <span>Escalated</span>
                <span class="px-1.5 py-0.2 rounded-full text-[10px] font-black" :class="selectedEscalationFilter === 'escalated' ? 'bg-purple-800 text-white' : 'bg-purple-200 text-purple-900'">
                  {{ escalatedPendingCount }}
                </span>
              </button>
              <button
                type="button"
                @click="selectedEscalationFilter = 'routine'; currentPage = 1"
                class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer"
                :class="selectedEscalationFilter === 'routine' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
              >
                Routine
              </button>
            </div>
            <!-- Executive Status Badge (Pending tab for Director) -->
            <div v-else-if="activeTab === 'pending' && isDirector" class="inline-flex items-center px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold shrink-0">
              <span>Escalated for Executive Approval</span>
            </div>
            <!-- Refresh -->
            <button
              @click="fetchAllQueues"
              :disabled="isLoading"
              class="p-2 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all flex items-center justify-center disabled:opacity-50 shrink-0 touch-manipulation cursor-pointer"
              title="Refresh queue"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{ 'animate-spin': isLoading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        <!-- ======================= DESKTOP TABULAR VIEW ======================= -->
        <div class="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs sm:text-sm font-black uppercase tracking-wider">
                  <th class="px-4 py-3 text-slate-700">Ticket Ref</th>
                  <th class="px-3 py-3 text-slate-700">Requester</th>
                  <th v-if="activeTab === 'pending' || activeTab === 'approved' || activeTab === 'delayed' || activeTab === 'dispatched'" class="px-3 py-3 text-slate-700">Location</th>
                  <th v-if="activeTab === 'delayed'" class="px-3 py-3 text-amber-800">Delay Reason</th>
                  <th v-if="activeTab === 'pending'" class="px-2 py-3 text-slate-700 text-center">Files</th>
                  <th v-if="activeTab === 'dispatched'" class="px-3 py-3 text-slate-700">Scheduled Date &amp; Staff</th>
                  <th v-if="activeTab === 'active'" class="px-3 py-3 text-slate-700">Elapsed Duration</th>
                  <th class="px-3 py-3 text-slate-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <!-- Loading State -->
                <tr v-if="isLoading && currentTabTickets.length === 0">
                  <td colspan="7" class="py-16 text-center">
                    <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-xs font-semibold">
                      <svg class="animate-spin h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading queue data...
                    </div>
                  </td>
                </tr>

                <!-- Empty State -->
                <tr v-else-if="paginatedTickets.length === 0">
                  <td colspan="7" class="py-16 text-center">
                    <div class="max-w-sm mx-auto flex flex-col items-center">
                      <div class="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p class="text-sm font-bold text-slate-700">No Tickets in {{ activeTabLabel }}</p>
                      <p class="text-xs text-slate-400 mt-1">
                        {{ isDirector && activeTab === 'pending' ? 'No tickets currently escalated for Director approval.' : 'There are no records matching your current filter criteria.' }}
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Data Rows with Enhanced Hover Feedback & Click Instruction -->
                <tr
                  v-for="ticket in paginatedTickets"
                  :key="ticket.id"
                  :id="'ticket-' + ticket.id"
                  :class="[
                    'hover:bg-emerald-50/50 hover:shadow-xs transition-all duration-150 group cursor-pointer relative',
                    isTicketHighlighted(ticket) ? 'bg-emerald-50/80 ring-2 ring-emerald-500' : ''
                  ]"
                  @click="openDetailsModal(ticket)"
                >
                  <!-- Ticket Reference -->
                  <td class="px-4 py-2.5 whitespace-nowrap relative">
                    <span class="absolute left-0 top-2 bottom-2 w-1 rounded-r-sm bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150"></span>
                    <div class="relative inline-flex items-center gap-1.5 flex-wrap">
                      <div class="font-mono text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 inline-flex items-center group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all duration-150 shadow-2xs">
                        #{{ ticket.ticketId }}
                      </div>
                      <span
                        v-if="ticket.is_emergency"
                        class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[9px] font-black uppercase tracking-wider"
                      >
                        Urgent
                      </span>
                      <span
                        v-if="ticket.is_escalated_to_director"
                        class="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200 text-[9px] font-black uppercase tracking-wider inline-flex items-center shadow-2xs"
                        :title="ticket.escalation_reason ? 'Escalated to Director: ' + ticket.escalation_reason : 'Escalated to Director for Approval'"
                      >
                        Director Review
                      </span>
                      <span
                        v-if="isCollabTicket(ticket)"
                        class="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200 text-[9px] font-black uppercase tracking-wider inline-flex items-center gap-1 shadow-2xs"
                        title="Cross-Unit Collaboration Ticket"
                      >
                        <svg class="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                        <span>Collab</span>
                      </span>
                    </div>
                  </td>

                  <!-- Requester -->
                  <td class="px-3 py-2.5">
                    <div class="flex items-center gap-2">
                      <div class="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {{ getInitials(ticket.requestedBy) }}
                      </div>
                      <span class="text-xs font-semibold text-slate-800 truncate max-w-[140px]">{{ ticket.requestedBy }}</span>
                    </div>
                  </td>

                  <!-- Location (Pending, Approved, Delayed & Dispatched) -->
                  <td v-if="activeTab === 'pending' || activeTab === 'approved' || activeTab === 'delayed' || activeTab === 'dispatched'" class="px-3 py-2.5 whitespace-nowrap">
                    <div class="text-xs font-semibold text-slate-700">{{ ticket.location || 'Main Campus' }}</div>
                    <div class="text-[10px] text-slate-400">{{ ticket.office_room ? `Rm ${ticket.office_room}` : '—' }}</div>
                  </td>

                  <!-- Delayed: Reason -->
                  <td v-if="activeTab === 'delayed'" class="px-3 py-2.5">
                    <div class="flex flex-col gap-0.5 max-w-xs">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold shadow-2xs">
                        <svg class="w-3.5 h-3.5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span class="truncate">{{ ticket.approval_delay_reason || 'Awaiting Procurement' }}</span>
                      </span>
                      <span v-if="ticket.delayed_by_first_name" class="text-[10px] text-slate-400 pl-0.5">
                        Flagged by {{ ticket.delayed_by_first_name }} {{ ticket.delayed_by_last_name }}
                      </span>
                    </div>
                  </td>

                  <!-- Pending: Files -->
                  <td v-if="activeTab === 'pending'" class="px-2 py-2.5 text-center">
                    <span
                      v-if="ticket.attachments && ticket.attachments.length > 0"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer"
                      @click.stop="openDetailsModal(ticket)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                      {{ ticket.attachments.length }}
                    </span>
                    <span v-else class="text-[10px] text-slate-300">—</span>
                  </td>

                  <!-- Dispatched: Scheduled Date & Personnel -->
                  <td v-if="activeTab === 'dispatched'" class="px-3 py-2.5 whitespace-nowrap">
                    <div class="text-xs font-bold text-slate-800">
                      {{ formatDate(ticket.assignment?.implementation_date || ticket.implementation_date) }}
                    </div>
                    <div class="text-[10px] text-slate-500 font-medium">
                      {{ getAssignedWorkers(ticket).length ? `${getAssignedWorkers(ticket).length} worker(s) assigned` : (ticket.assignment?.personnel_name || 'Dispatched') }}
                    </div>
                  </td>

                  <!-- Active: Elapsed Duration & Target Days -->
                  <td v-if="activeTab === 'active'" class="px-3 py-2.5 whitespace-nowrap">
                    <div class="flex items-center gap-2.5">
                      <div>
                        <div class="text-xs font-bold text-slate-900">{{ liveWorkingDurations[ticket.id] || ticket.computed_working_duration || 'Counting...' }}</div>
                        <div class="text-[9px] text-emerald-600 font-semibold">Work hrs only</div>
                      </div>
                      <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700 shrink-0" title="Target Duration">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {{ ticket.working_days || ticket.assignment?.working_days || 1 }} Target {{ (ticket.working_days || ticket.assignment?.working_days || 1) === 1 ? 'Day' : 'Days' }}
                        <span v-if="ticket.extension_days > 0" class="ml-1 text-amber-600 font-black">+{{ ticket.extension_days }}d</span>
                      </span>
                    </div>
                  </td>

                  <!-- Actions -->
                  <td class="px-3 py-3 whitespace-nowrap text-right" @click.stop>
                    <!-- Pending Tab Actions: Senior-Friendly Streamlined (Option A) -->
                    <div v-if="activeTab === 'pending'" class="flex items-center justify-end gap-2 flex-wrap">
                      <button
                        @click="openDetailsModal(ticket)"
                        class="px-3.5 py-2 min-h-[44px] rounded-xl border border-slate-300 bg-white hover:border-emerald-500 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer select-none"
                        title="View Full Ticket Details, Attachments & Secondary Actions"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>View Details</span>
                      </button>

                      <span
                        v-if="!isDirector && ticket.is_escalated_to_director"
                        class="px-3.5 py-2 min-h-[44px] rounded-xl border border-purple-200 bg-purple-50 text-purple-800 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-2xs select-none"
                        title="This ticket has been escalated and is awaiting the Director's executive approval."
                      >
                        <svg class="h-4 w-4 text-purple-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>With Director</span>
                      </span>

                      <button
                        v-else
                        @click="initiateApproval(ticket)"
                        class="px-4 py-2 min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                        :title="isDirector ? 'Executive Approve' : 'Direct Unit Head Approve'"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Approve</span>
                      </button>
                    </div>

                    <!-- Approval Delayed Tab Actions -->
                    <div v-else-if="activeTab === 'delayed'" class="flex items-center justify-end gap-1.5">
                      <button
                        @click="openDetailsModal(ticket)"
                        class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                        title="View Full Info"
                      >
                        <span>Full Info</span>
                      </button>
                      <button
                        @click="openDeclineModal(ticket)"
                        class="px-2.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                        title="Decline Request"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Decline</span>
                      </button>
                      <button
                        v-if="!isDirector && ticket.is_escalated_to_director"
                        disabled
                        class="px-3.5 py-1.5 rounded-xl border border-purple-200 bg-purple-50 text-purple-700 text-xs font-bold flex items-center gap-1.5 cursor-not-allowed opacity-80 select-none shadow-2xs"
                        title="This ticket has been escalated and is awaiting the Director's executive approval."
                      >
                        <svg class="h-3.5 w-3.5 text-purple-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Awaiting Director's Approval</span>
                      </button>
                      <button
                        v-else
                        @click="initiateApproval(ticket)"
                        class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                        title="Direct Approve"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Approve</span>
                      </button>
                    </div>

                    <!-- Approved Tab Actions -->
                    <div v-else-if="activeTab === 'approved'" class="flex items-center justify-end gap-2">
                      <button
                        @click="openDetailsModal(ticket)"
                        class="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>Full Info</span>
                      </button>
                    </div>

                    <!-- Dispatched Tab Actions -->
                    <div v-else-if="activeTab === 'dispatched'" class="flex items-center justify-end gap-2">
                      <button
                        @click="openDetailsModal(ticket)"
                        class="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>Full Info</span>
                      </button>
                    </div>

                    <!-- Active Tab Actions: Details + Grant Extension -->
                    <div v-else-if="activeTab === 'active'" class="flex items-center justify-end gap-2">
                      <button
                        @click="openExtensionModal(ticket)"
                        class="px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                        title="Grant timeline extension due to unforeseen circumstances"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Extend</span>
                      </button>
                      <button
                        @click="openDetailsModal(ticket)"
                        class="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        title="View Full Details"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>Full Info</span>
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
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold"
              >
                Previous
              </button>
              <div class="px-3 py-1.5 font-bold text-slate-700">
                {{ currentPage }} / {{ totalPages }}
              </div>
              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <!-- ======================= MOBILE CARDS VIEW ======================= -->
        <div class="md:hidden space-y-2">
          <div v-if="isLoading && currentTabTickets.length === 0" class="text-center py-10 bg-white rounded-2xl border border-slate-200">
            <svg class="animate-spin h-5 w-5 text-emerald-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-xs font-bold text-slate-400">Loading...</p>
          </div>

          <div v-else-if="paginatedTickets.length === 0" class="text-center py-10 bg-white rounded-2xl border border-slate-200">
            <p class="text-sm font-bold text-slate-600">No Tickets in {{ activeTabLabel }}</p>
            <p class="text-xs text-slate-400 mt-1">
              {{ isDirector && activeTab === 'pending' ? 'No tickets currently escalated for Director approval.' : 'No matching records found.' }}
            </p>
          </div>

          <div
            v-for="ticket in paginatedTickets"
            :key="ticket.id"
            :id="'mob-ticket-' + ticket.id"
            :class="[
              'bg-white rounded-xl border border-slate-200 hover:border-emerald-400 hover:shadow-sm transition-all cursor-pointer p-3.5 group active:scale-[0.99]',
              isTicketHighlighted(ticket) ? 'ring-2 ring-emerald-500 bg-emerald-50/40' : ''
            ]"
            @click="openDetailsModal(ticket)"
          >
            <!-- Header row: ID + requester -->
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2 min-w-0">
                <span class="font-mono text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0 shadow-2xs">
                  #{{ ticket.ticketId }}
                </span>
                <span class="text-xs font-semibold text-slate-800 truncate">{{ ticket.requestedBy }}</span>
              </div>
              <span
                v-if="ticket.is_emergency"
                class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[9px] font-black uppercase tracking-wider shrink-0"
              >
                Urgent
              </span>
              <span
                v-if="ticket.is_escalated_to_director"
                class="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200 text-[9px] font-black uppercase tracking-wider shrink-0 inline-flex items-center shadow-2xs"
              >
                Director Review
              </span>
              <span
                v-if="isCollabTicket(ticket)"
                class="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200 text-[9px] font-black uppercase tracking-wider shrink-0 inline-flex items-center gap-1 shadow-2xs"
                title="Cross-Unit Collaboration Ticket"
              >
                <svg class="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                <span>Collab</span>
              </span>
            </div>

            <!-- Location for Pending, Approved, Delayed, and Dispatched -->
            <div v-if="activeTab === 'pending' || activeTab === 'approved' || activeTab === 'delayed' || activeTab === 'dispatched'" class="mt-2 flex items-center justify-between text-xs text-slate-600">
              <div class="flex items-center gap-1.5 truncate">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="truncate">{{ ticket.location || 'Main Campus' }}{{ ticket.office_room ? ` (Rm ${ticket.office_room})` : '' }}</span>
              </div>
              <span v-if="ticket.attachments && ticket.attachments.length > 0" class="text-[10px] font-bold text-slate-400 shrink-0">
                {{ ticket.attachments.length }} files
              </span>
            </div>

            <!-- Dispatched row -->
            <div v-if="activeTab === 'dispatched'" class="mt-2 flex items-center justify-between text-xs">
              <span class="text-slate-600 font-medium">Scheduled: <strong class="text-slate-900 font-bold ml-1">{{ formatDate(ticket.assignment?.implementation_date || ticket.implementation_date) }}</strong></span>
              <span class="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700">
                {{ getAssignedWorkers(ticket).length ? `${getAssignedWorkers(ticket).length} worker(s)` : (ticket.assignment?.personnel_name || 'Dispatched') }}
              </span>
            </div>

            <!-- Delayed Notice for Delayed tab -->
            <div v-if="activeTab === 'delayed'" class="mt-2 p-2 rounded-xl bg-amber-50 border border-amber-200/80 text-xs">
              <div class="flex items-center gap-1.5 font-bold text-amber-900">
                <svg class="w-3.5 h-3.5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span class="truncate">{{ ticket.approval_delay_reason || 'Awaiting Procurement' }}</span>
              </div>
              <div v-if="ticket.delayed_by_first_name" class="text-[10px] text-amber-700 mt-0.5">
                by {{ ticket.delayed_by_first_name }} {{ ticket.delayed_by_last_name }} &bull; {{ formatDate(ticket.approval_delayed_at) }}
              </div>
            </div>

            <!-- Active tab: Elapsed Duration + Target Days (job/service and staff/schedule removed) -->
            <div v-if="activeTab === 'active'" class="mt-2 flex items-center justify-between text-xs">
              <span class="text-slate-600 font-medium">Elapsed: <strong class="text-emerald-700 font-bold ml-1">{{ liveWorkingDurations[ticket.id] || ticket.computed_working_duration || 'Counting...' }}</strong></span>
              <span class="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700">
                {{ ticket.working_days || ticket.assignment?.working_days || 1 }} Target {{ (ticket.working_days || ticket.assignment?.working_days || 1) === 1 ? 'Day' : 'Days' }}
                <span v-if="ticket.extension_days > 0" class="text-amber-600 ml-0.5">+{{ ticket.extension_days }}d</span>
              </span>
            </div>

            <!-- Actions -->
            <div class="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-end gap-1.5 flex-wrap" @click.stop>
              <!-- Pending Actions -->
              <template v-if="activeTab === 'pending'">
                <button v-if="isDirector && ticket.is_escalated_to_director" @click="openDeescalateModal(ticket)" class="px-2.5 py-1.5 min-h-[36px] rounded-lg border border-purple-300 bg-purple-50 text-purple-800 text-xs font-bold active:scale-95 transition-all touch-manipulation cursor-pointer">Return</button>
                <button v-if="!isDirector && !ticket.is_escalated_to_director" @click="openEscalateModal(ticket)" class="px-2.5 py-1.5 min-h-[36px] rounded-lg border border-purple-300 bg-purple-50 text-purple-800 text-xs font-bold active:scale-95 transition-all touch-manipulation cursor-pointer">Escalate</button>
                <button v-if="!isDirector && ticket.is_escalated_to_director" @click="openDeescalateModal(ticket)" class="px-2.5 py-1.5 min-h-[36px] rounded-lg border border-amber-300 bg-amber-50 text-amber-800 text-xs font-bold active:scale-95 transition-all touch-manipulation cursor-pointer">Recall</button>
                <button v-if="!isDirector" @click="openDelayModal(ticket)" class="px-2.5 py-1.5 min-h-[36px] rounded-lg border border-amber-300 bg-amber-50 text-amber-800 text-xs font-bold active:scale-95 transition-all touch-manipulation cursor-pointer">Delay</button>
                <button @click="openDeclineModal(ticket)" class="px-2.5 py-1.5 min-h-[36px] rounded-lg border border-rose-200 bg-rose-50/50 text-rose-600 text-xs font-bold active:scale-95 transition-all touch-manipulation cursor-pointer">Decline</button>
                <button
                  v-if="!isDirector && ticket.is_escalated_to_director"
                  disabled
                  class="px-3 py-1.5 min-h-[36px] rounded-lg border border-purple-200 bg-purple-50 text-purple-700 text-xs font-bold cursor-not-allowed opacity-80"
                >
                  Awaiting Director's Approval
                </button>
                <button
                  v-else
                  @click="initiateApproval(ticket)"
                  class="px-3.5 py-1.5 min-h-[36px] rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider active:scale-95 transition-all touch-manipulation cursor-pointer"
                >
                  Approve
                </button>
              </template>

              <!-- Delayed Actions -->
              <button v-if="activeTab === 'delayed'" @click="openDeclineModal(ticket)" class="px-3 py-1.5 min-h-[36px] rounded-lg border border-rose-200 bg-rose-50/50 text-rose-600 text-xs font-bold active:scale-95 transition-all touch-manipulation cursor-pointer">Decline</button>
              <button
                v-if="!isDirector && ticket.is_escalated_to_director"
                disabled
                class="px-3 py-1.5 min-h-[36px] rounded-lg border border-purple-200 bg-purple-50 text-purple-700 text-xs font-bold cursor-not-allowed opacity-80"
              >
                Awaiting Director's Approval
              </button>
              <button v-else-if="activeTab === 'delayed'" @click="initiateApproval(ticket)" class="px-3.5 py-1.5 min-h-[36px] rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider active:scale-95 transition-all touch-manipulation cursor-pointer">Approve</button>

              <!-- Active Actions -->
              <button v-if="activeTab === 'active'" @click="openExtensionModal(ticket)" class="px-3.5 py-1.5 min-h-[36px] rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-black uppercase tracking-wider active:scale-95 transition-all touch-manipulation cursor-pointer">Extend</button>

              <!-- Details (All Tabs) -->
              <button @click="openDetailsModal(ticket)" class="px-3.5 py-1.5 min-h-[36px] rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold active:scale-95 transition-all touch-manipulation cursor-pointer">Details</button>
            </div>
          </div>

          <!-- Mobile Pagination Footer -->
          <div v-if="filteredTickets.length > 0" class="p-3.5 bg-white rounded-xl border border-slate-200 flex flex-col gap-2.5 text-xs text-slate-500">
            <div class="text-center font-medium">
              Showing <span class="font-bold text-slate-800">{{ paginationRange.start }}</span> to <span class="font-bold text-slate-800">{{ paginationRange.end }}</span> of <span class="font-bold text-slate-800">{{ filteredTickets.length }}</span> tickets
            </div>
            <div class="flex items-center justify-center gap-2">
              <button
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="flex-1 py-2 min-h-[40px] rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold touch-manipulation flex items-center justify-center"
              >
                Previous
              </button>
              <div class="px-3 py-2 font-bold text-slate-700 min-w-[70px] text-center">
                {{ currentPage }} / {{ totalPages }}
              </div>
              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="flex-1 py-2 min-h-[40px] rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold touch-manipulation flex items-center justify-center"
              >
                Next
              </button>
            </div>
          </div>
        </div>

      </div>
    </template>
  </MainLayout>

  <!-- ======================= DETAILS MODAL ======================= -->
  <Teleport to="body">
    <div v-if="selectedTicketForModal" class="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto pointer-events-auto" @click.self="closeDetailsModal">
      <div class="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 animate-scale-up flex flex-col max-h-[calc(100dvh-2rem)] sm:max-h-[88vh] overflow-hidden my-auto">
        
        <!-- Modal Header -->
        <div class="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 bg-white">
          <div>
            <div class="flex flex-wrap items-center gap-2.5 mb-1.5">
              <span class="font-mono text-base sm:text-lg font-black text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-xl border border-emerald-200">
                #{{ selectedTicketForModal.ticketId }}
              </span>
              <span
                v-if="selectedTicketForModal.is_approval_delayed"
                class="px-2.5 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1"
              >
                <svg class="w-3 h-3 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Approval Delayed
              </span>
              <span
                v-if="selectedTicketForModal.is_escalated_to_director"
                class="px-2.5 py-0.5 rounded-md bg-purple-100 border border-purple-300 text-purple-800 text-[10px] font-black uppercase tracking-wider flex items-center shadow-2xs"
              >
                Escalated to Director
              </span>
              <span
                v-if="isCollabTicket(selectedTicketForModal)"
                class="px-2.5 py-0.5 rounded-md bg-indigo-100 border border-indigo-300 text-indigo-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-2xs"
                title="Cross-Unit Collaboration Ticket"
              >
                <svg class="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                <span>Cross-Unit Collab</span>
              </span>
              <span
                v-if="selectedTicketForModal.is_emergency"
                class="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-wider animate-pulse"
              >
                Emergency
              </span>
              <span class="text-xs sm:text-sm font-bold text-slate-400">
                Submitted on {{ selectedTicketForModal.date }}
              </span>
            </div>
            <h3 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Full Ticket Information</h3>
          </div>
          <button @click="closeDetailsModal" class="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer shrink-0" title="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Scrollable Modal Body -->
        <div class="p-5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 custom-scrollbar text-xs flex-1">
          <!-- Cross-Unit Collaboration Notice Banner -->
          <div v-if="isCollabTicket(selectedTicketForModal)" class="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 space-y-1.5">
            <div class="flex items-center gap-2 font-black text-sm sm:text-base tracking-wide text-indigo-900">
              <svg class="w-5 h-5 text-indigo-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
              <span>Cross-Unit Collaboration Request</span>
            </div>
            <p class="text-xs sm:text-sm text-indigo-800 font-medium leading-relaxed">
              This service ticket involves collaborative execution across multiple units ({{ selectedTicketForModal.collaborating_unit_code || 'FGMU & LEAU' }}). Dispatched personnel and tasks are coordinated jointly.
            </p>
          </div>

          <!-- Escalation Notice Banner -->
          <div v-if="selectedTicketForModal.is_escalated_to_director" class="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 space-y-1.5">
            <div class="flex items-center gap-2 font-black text-sm sm:text-base tracking-wide text-purple-900">
              <span>Escalated to Director for Executive Approval</span>
            </div>
            <p class="text-xs sm:text-sm text-purple-900 font-bold leading-relaxed">
              Justification: {{ selectedTicketForModal.escalation_reason || 'Executive review requested for heavy or important task.' }}
            </p>
            <p v-if="selectedTicketForModal.escalated_by_name" class="text-xs text-purple-700 font-medium">
              Escalated by {{ selectedTicketForModal.escalated_by_name }} on {{ formatDate(selectedTicketForModal.escalated_at) }}.
            </p>
          </div>

          <!-- Approval Delay Notice Banner -->
          <div v-if="selectedTicketForModal.is_approval_delayed" class="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1.5">
            <div class="flex items-center gap-2 font-black text-sm sm:text-base tracking-wide text-amber-900">
              <svg class="w-5 h-5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Delay Reason: {{ selectedTicketForModal.approval_delay_reason || 'Pending Materials / Procurement' }}</span>
            </div>
            <p v-if="selectedTicketForModal.delayed_by_first_name" class="text-xs sm:text-sm text-amber-700 font-medium leading-relaxed">
              Deferred by {{ selectedTicketForModal.delayed_by_first_name }} {{ selectedTicketForModal.delayed_by_last_name }} on {{ formatDate(selectedTicketForModal.approval_delayed_at) }}. Ticket is held outside general queue until directly approved once ready.
            </p>
          </div>

          <!-- Requester & Location Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Requester Profile</span>
              <p class="text-base sm:text-lg font-black text-slate-900 leading-tight">{{ selectedTicketForModal.requestedBy }}</p>
              <p class="text-xs text-slate-600 font-semibold flex items-center gap-2">
                <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <span class="truncate">{{ selectedTicketForModal.email || 'No institutional email' }}</span>
              </p>
              <a
                v-if="(selectedTicketForModal.contact || selectedTicketForModal.contact_number) && (selectedTicketForModal.contact || selectedTicketForModal.contact_number) !== 'N/A'"
                :href="`tel:${selectedTicketForModal.contact || selectedTicketForModal.contact_number}`"
                class="inline-flex items-center gap-2 mt-1 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors group w-fit"
              >
                <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span class="text-base sm:text-lg font-black font-mono tracking-wide text-emerald-800 group-hover:text-emerald-900">{{ selectedTicketForModal.contact || selectedTicketForModal.contact_number }}</span>
              </a>
              <p v-else class="text-xs text-slate-400 font-semibold flex items-center gap-2 mt-1">
                <svg class="w-4 h-4 text-slate-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span>No contact number on file</span>
              </p>
            </div>

            <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Designated Location</span>
              <p class="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {{ selectedTicketForModal.location || selectedTicketForModal.college_building || 'Main Campus' }}
              </p>
              <p class="text-xs text-slate-500 font-semibold flex items-center gap-2">
                <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                <span>Campus Facility / Building</span>
              </p>
              <!-- Emphasized Room Below Building -->
              <div v-if="selectedTicketForModal.office_room && selectedTicketForModal.office_room !== 'N/A'" class="pt-0.5">
                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs text-slate-800">
                  <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 20V6a2 2 0 00-2-2H8a2 2 0 00-2 2v14 M2 20h20 M14 12v.01" />
                  </svg>
                  <span class="text-xs font-bold text-slate-500">Room / Office:</span>
                  <span class="text-sm sm:text-base font-black text-slate-900 tracking-tight">{{ selectedTicketForModal.office_room }}</span>
                </div>
              </div>
              <p v-else class="text-xs text-slate-400 font-semibold flex items-center gap-2 mt-1">
                <svg class="w-4 h-4 text-slate-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                <span>No specific room designated</span>
              </p>
            </div>
          </div>

          <!-- Assigned Personnel Banner (if assigned) -->
          <div v-if="getAssignedWorkers(selectedTicketForModal).length > 0" class="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white space-y-3">
            <div class="flex items-center justify-between gap-3 flex-wrap">
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-black uppercase tracking-widest text-emerald-400">Assigned Personnel</span>
                <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black">
                  {{ getAssignedWorkers(selectedTicketForModal).length }} {{ getAssignedWorkers(selectedTicketForModal).length === 1 ? 'Worker' : 'Workers' }}
                </span>
              </div>
              <span v-if="selectedTicketForModal.assignment?.implementation_date" class="text-xs font-bold text-slate-300">
                Scheduled: {{ formatDate(selectedTicketForModal.assignment?.implementation_date) }}
              </span>
            </div>

            <!-- Structured Worker Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div
                v-for="(worker, wIdx) in getAssignedWorkers(selectedTicketForModal)"
                :key="worker.id || wIdx"
                class="flex items-center gap-3 p-3 rounded-xl bg-slate-800/90 border border-slate-700/70"
              >
                <div class="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-black text-xs shrink-0">
                  {{ getWorkerInitials(worker.name) }}
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-xs sm:text-sm font-black text-white leading-tight truncate">{{ worker.name }}</p>
                  <div class="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 text-[10px] font-bold border border-emerald-500/25 truncate">
                      {{ worker.profession }}
                    </span>
                    <span v-if="worker.contact" class="text-[10px] text-slate-400 truncate">
                      {{ worker.contact }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Service & Particulars -->
          <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div class="flex items-center justify-between gap-3 flex-wrap">
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Job Particular &amp; Nature of Work</span>
              <div class="flex items-center gap-2">
                <span class="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-wider border border-emerald-200">
                  {{ selectedTicketForModal.service }}
                </span>
                <button
                  v-if="activeTab === 'pending'"
                  type="button"
                  @click="openRecategorizeModal(selectedTicketForModal); closeDetailsModal()"
                  class="px-2.5 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-800 border border-sky-200 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                  title="Change nature of work to match description"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Change Nature of Work</span>
                </button>
              </div>
            </div>
            <p class="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-wrap bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/70 shadow-2xs">
              {{ selectedTicketForModal.description || selectedTicketForModal.title || 'No additional job description provided.' }}
            </p>
            <div v-if="selectedTicketForModal.is_recategorized" class="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-[11px] text-sky-900 flex items-start gap-2">
              <svg class="w-4 h-4 text-sky-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <div>
                <span class="font-bold">Recategorized from:</span> <del class="text-slate-500 font-semibold">{{ selectedTicketForModal.original_service_type }}</del>
                <span v-if="selectedTicketForModal.recategorization_reason" class="block text-sky-800 mt-0.5"><span class="font-bold">Reason:</span> {{ selectedTicketForModal.recategorization_reason }}</span>
              </div>
            </div>
          </div>

          <!-- Attachments / Proof Documents -->
          <div v-if="selectedTicketForModal.attachments && selectedTicketForModal.attachments.length > 0" class="space-y-2.5">
            <span class="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <span class="w-2 h-3 rounded-full bg-emerald-600"></span>
              Attached images and documents ({{ selectedTicketForModal.attachments.length }})
            </span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div
                v-for="(file, idx) in selectedTicketForModal.attachments"
                :key="idx"
                @click="downloadAttachment(file)"
                class="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 cursor-pointer transition-all shadow-2xs group"
              >
                <div class="flex items-center gap-2.5 truncate">
                  <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                  </div>
                  <span class="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-900">{{ file.file_name || 'Attachment' }}</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 group-hover:text-emerald-600 shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Fixed Modal Footer Actions -->
        <div class="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button @click="closeDetailsModal" class="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs">
            Close Full Info
          </button>
          <div v-if="activeTab === 'pending'" class="flex items-center gap-2 flex-wrap">
            <!-- Return to Unit Head (Director only for escalated tickets) -->
            <button
              v-if="isDirector && selectedTicketForModal.is_escalated_to_director"
              @click="openDeescalateModal(selectedTicketForModal); closeDetailsModal()"
              class="px-3.5 py-2.5 rounded-xl border border-purple-300 bg-purple-50 text-purple-800 text-xs font-bold hover:bg-purple-100 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <svg class="h-4 w-4 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
              <span>Return to Unit</span>
            </button>

            <!-- Request Director Approval (Unit Head only, for non-escalated tickets) -->
            <button
              v-if="!isDirector && !selectedTicketForModal.is_escalated_to_director"
              @click="openEscalateModal(selectedTicketForModal); closeDetailsModal()"
              class="px-3.5 py-2.5 rounded-xl border border-purple-300 bg-purple-50 text-purple-800 text-xs font-bold hover:bg-purple-100 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <svg class="h-4 w-4 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
              <span>Escalate to Director</span>
            </button>

            <!-- Recall Escalation (Unit Head only, for escalated tickets) -->
            <button
              v-if="!isDirector && selectedTicketForModal.is_escalated_to_director"
              @click="openDeescalateModal(selectedTicketForModal); closeDetailsModal()"
              class="px-3.5 py-2.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 text-xs font-bold hover:bg-amber-100 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <svg class="h-4 w-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
              <span>Recall Escalation</span>
            </button>

            <button
              v-if="!isDirector"
              @click="openRecategorizeModal(selectedTicketForModal); closeDetailsModal()"
              class="px-3.5 py-2.5 rounded-xl border border-sky-300 bg-sky-50 text-sky-800 text-xs font-bold hover:bg-sky-100 transition-all cursor-pointer flex items-center gap-1.5"
              title="Change Nature of Work / Recategorize Ticket"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Recategorize</span>
            </button>
            <button
              v-if="!isDirector"
              @click="openDelayModal(selectedTicketForModal); closeDetailsModal()"
              class="px-3.5 py-2.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 text-xs font-bold hover:bg-amber-100 transition-all cursor-pointer flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Delay</span>
            </button>
            <button @click="openDeclineModal(selectedTicketForModal); closeDetailsModal()" class="px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-all cursor-pointer">
              Decline Request
            </button>
            <button
              v-if="!isDirector && selectedTicketForModal.is_escalated_to_director"
              disabled
              class="px-5 py-2.5 rounded-xl border border-purple-200 bg-purple-50 text-purple-700 text-xs font-bold cursor-not-allowed opacity-80 flex items-center gap-1.5"
            >
              <svg class="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Awaiting Director's Approval</span>
            </button>
            <button
              v-else
              @click="initiateApproval(selectedTicketForModal); closeDetailsModal()"
              class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              Approve Request
            </button>
          </div>
          <div v-else-if="activeTab === 'delayed'" class="flex items-center gap-2">
            <button @click="openDeclineModal(selectedTicketForModal); closeDetailsModal()" class="px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-all cursor-pointer">
              Decline
            </button>
            <button
              v-if="!isDirector && selectedTicketForModal.is_escalated_to_director"
              disabled
              class="px-5 py-2.5 rounded-xl border border-purple-200 bg-purple-50 text-purple-700 text-xs font-bold cursor-not-allowed opacity-80 flex items-center gap-1.5"
            >
              <svg class="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Awaiting Director's Approval</span>
            </button>
            <button
              v-else
              @click="initiateApproval(selectedTicketForModal); closeDetailsModal()"
              class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              Approve
            </button>
          </div>
          <div v-else-if="activeTab === 'active'">
            <button @click="openExtensionModal(selectedTicketForModal); closeDetailsModal()" class="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-amber-600/20 transition-all cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Extend Timeline</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  </Teleport>

  <!-- Approve Confirm Modal -->
  <Teleport to="body">
    <div v-if="showConfirmModal" class="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto pointer-events-auto">
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 animate-scale-up space-y-6 my-auto">
        <div class="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div class="text-center">
          <h3 class="text-xl font-black text-slate-900">Approve Service Request?</h3>
          <p class="text-xs text-slate-500 font-medium mt-1">
            Ticket <strong class="text-slate-800">#{{ ticketToApprove?.ticketId }}</strong> will be approved and queued for admin assignment.
          </p>
        </div>

        <!-- Emergency Priority Decision (Decided by Director before approval) -->
        <div 
          @click="isEmergencyApproval = !isEmergencyApproval"
          :class="[
            'p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-3.5 text-left',
            isEmergencyApproval 
              ? 'bg-rose-50/90 border-rose-300 ring-2 ring-rose-500/20 shadow-xs' 
              : 'bg-slate-50 border-slate-200 hover:border-slate-300'
          ]"
        >
          <div class="pt-0.5">
            <input
              type="checkbox"
              id="fgmu-emergency-toggle"
              v-model="isEmergencyApproval"
              @click.stop
              class="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300 cursor-pointer"
            />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <label for="fgmu-emergency-toggle" class="text-xs font-black uppercase tracking-wider cursor-pointer" :class="isEmergencyApproval ? 'text-rose-900' : 'text-slate-800'">
                Mark as Emergency Request
              </label>
              <span v-if="isEmergencyApproval" class="px-2 py-0.5 rounded-md bg-rose-200 text-rose-800 text-[10px] font-black uppercase tracking-wider animate-pulse">
                Urgent
              </span>
            </div>
            <p class="text-[11px] font-medium leading-relaxed mt-1" :class="isEmergencyApproval ? 'text-rose-700' : 'text-slate-500'">
              Enables priority dispatch and task preemption for unit admins when assigning personnel.
            </p>
          </div>
        </div>
        <div class="flex gap-3">
          <button @click="closeConfirmModal" class="w-full px-5 py-3 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 cursor-pointer">
            Cancel
          </button>
          <button @click="confirmApproval" class="w-full px-5 py-3 bg-emerald-600 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 cursor-pointer">
            Confirm Approval
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Decline Modal -->
  <Teleport to="body">
    <div v-if="ticketToDecline" class="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto pointer-events-auto">
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 animate-scale-up space-y-5 my-auto">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <div class="p-2 rounded-xl bg-rose-50 text-rose-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 class="text-base font-black text-slate-900">Decline Request</h3>
          </div>
          <button @click="ticketToDecline = null" class="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Decline Reason <span class="text-rose-500">*</span>
          </label>
          <textarea
            v-model="declineReasonInput"
            rows="3"
            placeholder="State reason for declining..."
            class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          ></textarea>
        </div>

        <div class="flex gap-3 pt-2">
          <button @click="ticketToDecline = null" class="w-full px-5 py-3 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 cursor-pointer">
            Cancel
          </button>
          <button
            @click="confirmDecline"
            :disabled="!declineReasonInput.trim()"
            class="w-full px-5 py-3 bg-rose-600 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-rose-600/20 hover:bg-rose-500 disabled:opacity-50 cursor-pointer"
          >
            Confirm Decline
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Delay Approval Modal -->
  <Teleport to="body">
    <div v-if="ticketToDelay" class="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto pointer-events-auto" @click.self="closeDelayModal">
      <div class="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 animate-scale-up flex flex-col max-h-[calc(100dvh-2rem)] sm:max-h-[88vh] overflow-hidden my-auto">
        <!-- Header (Fixed) -->
        <div class="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-slate-100 shrink-0 bg-white">
          <div class="flex items-center gap-3">
            <div class="p-2.5 sm:p-3 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg sm:text-xl font-black text-slate-900 leading-tight">Delay Ticket Approval</h3>
              <p class="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">Ticket #{{ ticketToDelay?.ticketId }} will be moved to Delayed Queue</p>
            </div>
          </div>
          <button @click="closeDelayModal" class="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors shrink-0" title="Close">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Scrollable Modal Body -->
        <div class="p-5 sm:p-6 overflow-y-auto space-y-4 custom-scrollbar flex-1">
          <div>
            <label class="block text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider mb-2">
              Reason for Delay <span class="text-amber-600">*</span>
            </label>
            <div class="space-y-2">
              <label
                v-for="preset in delayPresets"
                :key="preset"
                class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-sm sm:text-[15px] transition-all select-none"
                :class="selectedDelayPreset === preset ? 'bg-amber-50/90 border-amber-300 text-amber-950 font-bold shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/70 font-medium'"
              >
                <input
                  type="radio"
                  name="fgmu-delay-reason"
                  :value="preset"
                  v-model="selectedDelayPreset"
                  class="h-4 w-4 text-amber-600 focus:ring-amber-500 border-slate-300 shrink-0"
                />
                <span>{{ preset }}</span>
              </label>

              <label
                class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-sm sm:text-[15px] transition-all select-none"
                :class="selectedDelayPreset === 'Other / Custom Reason' ? 'bg-amber-50/90 border-amber-300 text-amber-950 font-bold shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/70 font-medium'"
              >
                <input
                  type="radio"
                  name="fgmu-delay-reason"
                  value="Other / Custom Reason"
                  v-model="selectedDelayPreset"
                  class="h-4 w-4 text-amber-600 focus:ring-amber-500 border-slate-300 shrink-0"
                />
                <span>Other / Custom Reason</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
              {{ selectedDelayPreset === 'Other / Custom Reason' ? 'Specify Custom Reason' : 'Additional Notes (Optional)' }}
              <span v-if="selectedDelayPreset === 'Other / Custom Reason'" class="text-rose-500">*</span>
            </label>
            <textarea
              v-model="delayNotesInput"
              rows="2.5"
              :placeholder="selectedDelayPreset === 'Other / Custom Reason' ? 'Provide clear reason for delaying approval...' : 'e.g., Awaiting delivery of circuit breakers from supplier.'"
              class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm sm:text-[15px] font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 placeholder:text-slate-400"
            ></textarea>
          </div>

          <div class="p-3 sm:p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs sm:text-sm text-amber-900 flex items-start gap-2.5 leading-relaxed">
            <svg class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>This ticket will be excluded from the pending approval queue until directly approved once items arrive.</span>
          </div>
        </div>

        <!-- Footer Actions (Fixed) -->
        <div class="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex gap-3 shrink-0">
          <button @click="closeDelayModal" class="w-full px-4 py-2.5 sm:py-3 bg-white border border-slate-200 text-slate-700 text-sm sm:text-[15px] font-bold rounded-xl hover:bg-slate-100 cursor-pointer transition-colors shadow-xs">
            Cancel
          </button>
          <button
            @click="submitDelayApproval"
            :disabled="isSubmittingDelay || (!selectedDelayPreset || (selectedDelayPreset === 'Other / Custom Reason' && !delayNotesInput.trim()))"
            class="w-full px-4 py-2.5 sm:py-3 bg-amber-600 text-white text-sm sm:text-[15px] font-black uppercase tracking-wider rounded-xl shadow-lg shadow-amber-600/20 hover:bg-amber-500 disabled:opacity-50 cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <svg v-if="isSubmittingDelay" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
            <span>{{ isSubmittingDelay ? 'Saving...' : 'Confirm Delay' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Ticket Extension Modal (Unforeseen Circumstances & Working Hours) -->
  <TicketExtensionModal
    :is-open="showExtensionModal"
    :ticket="ticketToExtend"
    unit-code="FGMU"
    @close="showExtensionModal = false"
    @extended="handleTicketExtended"
  />

  <!-- Recategorize Nature of Work Modal -->
  <RecategorizeTicketModal
    v-if="showRecategorizeModal"
    :show="showRecategorizeModal"
    :ticket="ticketToRecategorize"
    current-unit="FGMU"
    @close="closeRecategorizeModal"
    @recategorized="handleTicketRecategorized"
  />

  <!-- ======================= ESCALATE TO DIRECTOR MODAL ======================= -->
  <Teleport to="body">
    <div v-if="showEscalateModal" class="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto pointer-events-auto" @click.self="closeEscalateModal">
      <div class="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 animate-scale-up flex flex-col my-auto overflow-hidden">
        <div class="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-3 bg-gradient-to-r from-purple-50/50 to-white">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
            </div>
            <div>
              <h3 class="text-lg sm:text-xl font-black text-slate-900 leading-tight">Request Director Approval</h3>
              <p class="text-sm sm:text-base text-slate-600 font-semibold mt-0.5">Ticket <strong class="text-slate-900 font-bold">#{{ ticketToEscalate?.ticketId }}</strong></p>
            </div>
          </div>
          <button @click="closeEscalateModal" class="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Close modal">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="p-5 sm:p-6 space-y-5">
          <!-- Reason Presets -->
          <div class="space-y-2">
            <label class="block text-sm sm:text-base font-extrabold uppercase tracking-wide text-slate-800">Select Justification Preset</label>
            <div class="grid grid-cols-1 gap-2">
              <button
                v-for="preset in escalationPresets"
                :key="preset"
                type="button"
                @click="selectedEscalationPreset = preset; if (preset !== 'Other / Custom Justification') escalateReasonInput = preset"
                class="px-4 py-3 sm:py-3.5 rounded-xl border text-left text-sm sm:text-base font-bold transition-all cursor-pointer min-h-[48px] flex items-center"
                :class="selectedEscalationPreset === preset ? 'bg-purple-600 text-white border-purple-600 shadow-sm' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'"
              >
                {{ preset }}
              </button>
            </div>
          </div>

          <!-- Custom Reason Textarea -->
          <div class="space-y-2">
            <label class="block text-sm sm:text-base font-extrabold uppercase tracking-wide text-slate-800">
              Detailed Justification / Notes <span class="text-rose-500">*</span>
            </label>
            <textarea
              v-model="escalateReasonInput"
              rows="3"
              placeholder="Explain why this request requires executive Director approval..."
              class="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm sm:text-base font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 placeholder:text-slate-400"
            ></textarea>
          </div>
        </div>

        <div class="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex gap-3 shrink-0">
          <button @click="closeEscalateModal" class="w-full px-5 py-3 sm:py-3.5 bg-white border border-slate-200 text-slate-700 text-sm sm:text-base font-bold rounded-xl hover:bg-slate-100 cursor-pointer min-h-[48px]">
            Cancel
          </button>
          <button
            @click="submitEscalation"
            :disabled="isSubmittingEscalate || !escalateReasonInput.trim()"
            class="w-full px-5 py-3 sm:py-3.5 bg-purple-600 text-white text-sm sm:text-base font-black uppercase tracking-wider rounded-xl shadow-lg shadow-purple-600/20 hover:bg-purple-500 disabled:opacity-50 cursor-pointer transition-all flex items-center justify-center gap-2 min-h-[48px]"
          >
            <svg v-if="isSubmittingEscalate" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
            <span>{{ isSubmittingEscalate ? 'Escalating...' : 'Submit to Director' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ======================= DE-ESCALATE / RETURN MODAL ======================= -->
  <Teleport to="body">
    <div v-if="showDeescalateModal" class="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto pointer-events-auto" @click.self="closeDeescalateModal">
      <div class="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 animate-scale-up flex flex-col my-auto overflow-hidden">
        <div class="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
            </div>
            <div>
              <h3 class="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {{ isDirector ? 'Return Request to Unit Head' : 'Recall Escalation' }}
              </h3>
              <p class="text-xs text-slate-500 font-medium">Ticket <strong class="text-slate-800">#{{ ticketToDeescalate?.ticketId }}</strong></p>
            </div>
          </div>
          <button @click="closeDeescalateModal" class="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
          <p class="text-slate-600 leading-relaxed font-medium">
            {{ isDirector
              ? 'This ticket will be returned to the Unit Head queue for direct administrative review and approval.'
              : 'Cancel executive escalation and return this ticket to the Unit Head approval queue for direct processing.'
            }}
          </p>

          <div class="space-y-1.5">
            <label class="block text-xs font-black uppercase tracking-wider text-slate-600">Notes / Instructions (Optional)</label>
            <textarea
              v-model="deescalateNotesInput"
              rows="3"
              :placeholder="isDirector ? 'e.g., Routine maintenance approved to proceed at unit level with current supplies.' : 'e.g., Reclaiming ticket to be handled with existing unit manpower.'"
              class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            ></textarea>
          </div>
        </div>

        <div class="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex gap-3 shrink-0">
          <button @click="closeDeescalateModal" class="w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100 cursor-pointer">
            Cancel
          </button>
          <button
            @click="submitDeescalation"
            :disabled="isSubmittingDeescalate"
            class="w-full px-4 py-2.5 bg-amber-600 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-amber-600/20 hover:bg-amber-500 disabled:opacity-50 cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <svg v-if="isSubmittingDeescalate" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
            <span>{{ isSubmittingDeescalate ? 'Processing...' : (isDirector ? 'Confirm Return to Unit' : 'Confirm Recall') }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/api/client';
import { escalateTicketToDirector, deescalateTicketFromDirector } from '@/api/tickets';
import { toast } from 'vue3-toastify';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import DirectorSidebar from '@/views/dashboards/director/DirectorSidebar.vue';
import TicketExtensionModal from '@/components/TicketExtensionModal.vue';
import RecategorizeTicketModal from '@/components/director/RecategorizeTicketModal.vue';
import { FGMU_SERVICES } from '@/constants/services';
import { calculateWorkingHoursElapsed } from '@/utils/workCalendar';
import { getAssignedWorkers, getWorkerInitials } from '@/utils/ticketPersonnelHelper';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const isDirector = computed(() => authStore.role === 'director' || route.path.startsWith('/director'));
const isPendingOnlyMode = computed(() => !isDirector.value || route.path.startsWith('/admin'));

watch(
  isPendingOnlyMode,
  (pendingOnly) => {
    if (pendingOnly && ['approved', 'dispatched', 'active'].includes(activeTab.value)) {
      activeTab.value = 'pending';
    }
  },
  { immediate: true }
);

let handledRouteQueryTicketId = null;
let isInitialFetch = true;

const clearRouteQueryTicket = () => {
  if (route.query.ticketId || route.query.highlight || route.query._t) {
    const nextQuery = { ...route.query };
    delete nextQuery.ticketId;
    delete nextQuery.highlight;
    delete nextQuery._t;
    router.replace({ query: nextQuery }).catch(() => {});
  }
};

const closeDetailsModal = () => {
  selectedTicketForModal.value = null;
  clearRouteQueryTicket();
};

// 3 Primary Stage Tabs: Pending -> Delayed -> Dropdown Ticket List (Approved / Dispatched / Active)
const activeTab = ref('pending'); // 'pending' | 'delayed' | 'approved' | 'dispatched' | 'active'
const queueCounts = ref({ pending: 0, delayed: 0, approved: 0, dispatched: 0, active: 0 });

// Dropdown Ticket List Selection
const selectedTicketListKey = ref('approved');
const isListsDropdownOpen = ref(false);
const dropdownContainerRef = ref(null);

const isDropdownTabActive = computed(() => {
  return ['approved', 'dispatched', 'active'].includes(activeTab.value);
});

const ticketListOptions = computed(() => [
  {
    key: 'approved',
    label: 'Approved (Awaiting Dispatch)',
    shortLabel: 'Approved (Dispatch)',
    description: 'Awaiting personnel assignment & dispatch',
    count: queueCounts.value.approved || 0,
  },
  {
    key: 'dispatched',
    label: 'Approved (Dispatched)',
    shortLabel: 'Approved (Dispatched)',
    description: 'Scheduled implementation awaiting work',
    count: queueCounts.value.dispatched || 0,
  },
  {
    key: 'active',
    label: 'Active Tickets',
    shortLabel: 'Active Tickets',
    description: 'Work ongoing / in-progress with live tracking',
    count: queueCounts.value.active || 0,
  },
]);

const currentDropdownItem = computed(() => {
  const currentKey = ['approved', 'dispatched', 'active'].includes(activeTab.value)
    ? activeTab.value
    : selectedTicketListKey.value;
  return ticketListOptions.value.find(opt => opt.key === currentKey) || ticketListOptions.value[0];
});

const currentDropdownCount = computed(() => currentDropdownItem.value?.count ?? 0);

const toggleTicketListDropdown = () => {
  if (!isDropdownTabActive.value) {
    activeTab.value = selectedTicketListKey.value || 'approved';
    isListsDropdownOpen.value = true;
  } else {
    isListsDropdownOpen.value = !isListsDropdownOpen.value;
  }
};

const selectTicketList = (key) => {
  selectedTicketListKey.value = key;
  activeTab.value = key;
  isListsDropdownOpen.value = false;
  currentPage.value = 1;
  searchQuery.value = '';
};

const handleDocumentClick = (e) => {
  if (dropdownContainerRef.value && !dropdownContainerRef.value.contains(e.target)) {
    isListsDropdownOpen.value = false;
  }
};

// Collaboration helper: checks if ticket is a cross-unit collaboration
const isCollabTicket = (ticket) => {
  if (!ticket) return false;
  if (ticket.is_collab || ticket.is_collaboration) return true;
  if (ticket.collaborating_unit_code || ticket.collaborating_unit_id) return true;
  if (Array.isArray(ticket.collaborations) && ticket.collaborations.length > 0) return true;
  if (ticket.collaboration_status) return true;
  if (Array.isArray(ticket.collab_assignments) && ticket.collab_assignments.length > 0) return true;
  if (Array.isArray(ticket.other_unit_assignments) && ticket.other_unit_assignments.length > 0) return true;
  const s = String(ticket.service || ticket.service_type || ticket.title || '').toLowerCase();
  return s.includes('collab') || s.includes('joint');
};

// Queues data cache
const queuesData = ref({
  pending: [],
  delayed: [],
  approved: [],
  dispatched: [],
  active: [],
});

const isLoading = ref(false);
const searchQuery = ref('');
const selectedServiceFilter = ref('');
const selectedEscalationFilter = ref('all'); // 'all' | 'escalated' | 'routine'
const escalatedPendingCount = computed(() => queuesData.value.pending.filter(t => t.is_escalated_to_director).length);

// Pagination state
const currentPage = ref(1);
const perPage = ref(15);

// Modals
const showConfirmModal = ref(false);
const isEmergencyApproval = ref(false);
const ticketToApprove = ref(null);
const ticketToDecline = ref(null);
const declineReasonInput = ref('');
const selectedTicketForModal = ref(null);

// Delay Approval Modal
const ticketToDelay = ref(null);
const selectedDelayPreset = ref('');
const delayNotesInput = ref('');
const isSubmittingDelay = ref(false);

const delayPresets = [
  'Awaiting Procurement of Materials',
  'Awaiting Budget Clearance',
  'Pending Ocular Assessment / Inspection',
  'Awaiting Additional Specifications from Requester',
  'Scheduled for Bulk Procurement Cycle',
];

// Extension Modal
const showExtensionModal = ref(false);
const ticketToExtend = ref(null);

// Live working durations for active tickets
const liveWorkingDurations = ref({});
let pollingInterval = null;
let durationInterval = null;

const activeTabCount = computed(() => queueCounts.value[activeTab.value] || 0);

const activeTabLabel = computed(() => {
  switch (activeTab.value) {
    case 'pending': return isDirector.value ? 'Escalated for Executive Approval' : 'Pending Approval';
    case 'delayed': return 'Approval Delayed';
    case 'approved': return 'Approved (Awaiting Dispatch)';
    case 'dispatched': return 'Approved (Dispatched)';
    case 'active': return 'Dispatched & In Progress';
    default: return 'Tickets';
  }
});

const currentTabTickets = computed(() => {
  const list = queuesData.value[activeTab.value] || [];
  if (isDirector.value && activeTab.value === 'pending') {
    return list.filter(t => t.is_escalated_to_director);
  }
  return list;
});

const serviceCategories = computed(() => {
  const set = new Set(FGMU_SERVICES);
  Object.values(queuesData.value).flat().forEach(t => {
    if (t.service && t.service.trim()) set.add(t.service.trim());
  });
  return Array.from(set);
});

// Filtered tickets based on search & category
const filteredTickets = computed(() => {
  let list = currentTabTickets.value;

  if (activeTab.value === 'pending') {
    if (isDirector.value) {
      list = list.filter(t => t.is_escalated_to_director);
    } else if (selectedEscalationFilter.value !== 'all') {
      if (selectedEscalationFilter.value === 'escalated') {
        list = list.filter(t => t.is_escalated_to_director);
      } else if (selectedEscalationFilter.value === 'routine') {
        list = list.filter(t => !t.is_escalated_to_director);
      }
    }
  }

  if (selectedServiceFilter.value) {
    const target = selectedServiceFilter.value.trim().toLowerCase();
    list = list.filter(t => {
      const s = (t.service || t.service_type || '').trim().toLowerCase();
      return s === target;
    });
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(t => 
      (t.ticketId && String(t.ticketId).toLowerCase().includes(q)) ||
      (t.requestedBy && t.requestedBy.toLowerCase().includes(q)) ||
      (t.service && t.service.toLowerCase().includes(q)) ||
      (t.title && t.title.toLowerCase().includes(q)) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      (t.location && t.location.toLowerCase().includes(q)) ||
      (t.office_room && t.office_room.toLowerCase().includes(q)) ||
      (t.escalation_reason && t.escalation_reason.toLowerCase().includes(q)) ||
      (t.assignment?.personnel_name && t.assignment.personnel_name.toLowerCase().includes(q))
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

const switchTab = (tab) => {
  activeTab.value = tab;
  isListsDropdownOpen.value = false;
  currentPage.value = 1;
  searchQuery.value = '';
  selectedEscalationFilter.value = 'all';
  clearRouteQueryTicket();
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

// Map ticket payload helper
const mapTicket = (t) => {
  const requesterName = t.first_name || t.last_name 
    ? `${t.first_name || ''} ${t.last_name || ''}`.trim() 
    : 'End User';
  return {
    ...t,
    ticketId: t.id,
    title: t.title,
    service: t.service_type,
    service_type: t.service_type,
    description: t.description,
    date: t.submitted_at 
      ? new Date(t.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'N/A',
    requestedBy: requesterName,
    email: t.email || '',
    contact: t.requester_contact || t.contact_number || t.contact_no || t.user?.contact_number || t.details?.contact_number || '',
    contact_number: t.contact_number || t.requester_contact || t.contact_no || t.user?.contact_number || t.details?.contact_number || '',
    student_id_number: t.student_id_number || '',
    location: t.location || t.college_building,
    office_room: t.office_room,
    attachments: t.attachments || [],
    working_days: Number(t.working_days || t.project_working_days || t.assignment?.working_days) || 1,
    extension_days: Number(t.extension_days) || 0,
    overtime_hours: Number(t.overtime_hours) || 0,
    is_emergency: Boolean(Number(t.is_emergency) === 1 || t.is_emergency === true || t.urgency === 'Emergency' || t.urgency === 'High'),
    is_recategorized: Boolean(Number(t.is_recategorized) === 1 || t.is_recategorized === true),
    original_service_type: t.original_service_type || null,
    recategorization_reason: t.recategorization_reason || '',
    recategorized_at: t.recategorized_at || null,
    is_approval_delayed: Boolean(Number(t.is_approval_delayed) === 1 || t.is_approval_delayed === true),
    approval_delay_reason: t.approval_delay_reason || '',
    approval_delayed_at: t.approval_delayed_at || null,
    approval_delayed_by: t.approval_delayed_by || null,
    delayed_by_first_name: t.delayed_by_first_name || '',
    delayed_by_last_name: t.delayed_by_last_name || '',
    is_escalated_to_director: Boolean(Number(t.is_escalated_to_director) === 1 || t.is_escalated_to_director === true),
    escalation_reason: t.escalation_reason || '',
    escalated_at: t.escalated_at || null,
    escalated_by: t.escalated_by || null,
    escalated_by_name: t.escalated_by_name || (t.escalated_by_first_name ? `${t.escalated_by_first_name} ${t.escalated_by_last_name || ''}`.trim() : ''),
    is_collab: Boolean(
      t.is_collab || t.is_collaboration ||
      t.collaborating_unit_code || t.collaborating_unit_id ||
      (Array.isArray(t.collaborations) && t.collaborations.length > 0) ||
      t.collaboration_status ||
      (Array.isArray(t.collab_assignments) && t.collab_assignments.length > 0) ||
      (Array.isArray(t.other_unit_assignments) && t.other_unit_assignments.length > 0) ||
      String(t.service_type || t.title || '').toLowerCase().includes('collab') ||
      String(t.service_type || t.title || '').toLowerCase().includes('joint')
    ),
  };
};

const fetchAllQueues = async () => {
  isLoading.value = true;
  try {
    const [pendingRes, delayedRes, dispatchRes, activeRes] = await Promise.allSettled([
      api.get('tickets/queue/FGMU'),
      api.get('tickets/delayed-approval/FGMU'),
      api.get('tickets/dispatch/FGMU'),
      api.get('tickets/active/FGMU'),
    ]);

    if (pendingRes.status === 'fulfilled' && pendingRes.value.data?.data?.tickets) {
      const allPending = pendingRes.value.data.data.tickets.map(mapTicket);
      queuesData.value.pending = isDirector.value
        ? allPending.filter(t => t.is_escalated_to_director)
        : allPending;
      queueCounts.value.pending = queuesData.value.pending.length;
    }

    if (delayedRes.status === 'fulfilled' && delayedRes.value.data?.data?.tickets) {
      queuesData.value.delayed = delayedRes.value.data.data.tickets.map(mapTicket);
      queueCounts.value.delayed = queuesData.value.delayed.length;
    }

    if (dispatchRes.status === 'fulfilled' && dispatchRes.value.data?.data?.tickets) {
      queuesData.value.approved = dispatchRes.value.data.data.tickets.map(mapTicket);
      queueCounts.value.approved = queuesData.value.approved.length;
    }

    if (activeRes.status === 'fulfilled' && activeRes.value.data?.data?.tickets) {
      const allActiveOrScheduled = activeRes.value.data.data.tickets.map(mapTicket);
      queuesData.value.dispatched = allActiveOrScheduled.filter(t => t.current_step == 4 || t.status === 'scheduled');
      queueCounts.value.dispatched = queuesData.value.dispatched.length;

      queuesData.value.active = allActiveOrScheduled.filter(t => t.current_step != 4 && t.status !== 'scheduled');
      queueCounts.value.active = queuesData.value.active.length;
    }

    updateLiveWorkingDurations();
    checkRouteQueryTicket();
    isInitialFetch = false;
  } catch (error) {
    console.error('Failed to fetch FGMU queues:', error);
  } finally {
    isLoading.value = false;
  }
};

// Institutional working hours calculation (Mon-Fri 8am-5pm, skips weekends and holidays)
const updateLiveWorkingDurations = () => {
  const result = {};
  const activeList = queuesData.value.active || [];
  activeList.forEach(t => {
    const start = t.assignment?.dispatched_at || t.project_actual_start || t.assignment?.implementation_date || t.assignment?.assigned_at;
    if (start) {
      const duration = calculateWorkingHoursElapsed(start, new Date(), t.overtime_hours);
      result[t.id] = duration.formatted;
    } else {
      result[t.id] = 'Scheduled';
    }
  });
  liveWorkingDurations.value = result;
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
  if (!targetId || handledRouteQueryTicketId === String(targetId)) return;
  const allTickets = Object.values(queuesData.value).flat();
  if (allTickets.length === 0) {
    if (!isLoading.value) {
      fetchAllQueues();
    }
    return;
  }

  const targetStr = String(targetId).toLowerCase().trim().replace(/^#/, '');
  const match = allTickets.find(t => {
    const idStr = String(t.id || '').toLowerCase().trim().replace(/^#/, '');
    const ticketIdStr = String(t.ticketId || '').toLowerCase().trim().replace(/^#/, '');
    return idStr === targetStr || ticketIdStr === targetStr;
  });

  if (match) {
    handledRouteQueryTicketId = String(targetId);
    selectedTicketForModal.value = match;

    if (queuesData.value.active?.some(t => String(t.id) === String(match.id))) {
      activeTab.value = isPendingOnlyMode.value ? 'pending' : 'active';
    } else if (queuesData.value.dispatched?.some(t => String(t.id) === String(match.id))) {
      activeTab.value = isPendingOnlyMode.value ? 'pending' : 'dispatched';
    } else if (queuesData.value.approved?.some(t => String(t.id) === String(match.id))) {
      activeTab.value = isPendingOnlyMode.value ? 'pending' : 'approved';
    } else if (queuesData.value.delayed?.some(t => String(t.id) === String(match.id))) {
      activeTab.value = 'delayed';
    } else if (queuesData.value.pending?.some(t => String(t.id) === String(match.id))) {
      activeTab.value = 'pending';
    }

    clearRouteQueryTicket();
    setTimeout(() => {
      const el = document.getElementById('ticket-' + match.id) || document.getElementById('mob-ticket-' + match.id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 250);
  } else {
    if (!isLoading.value && isInitialFetch) {
      fetchAllQueues();
    }
    searchQuery.value = String(targetId);
  }
};

watch(() => [route.query.ticketId, route.query.highlight, route.query._t], ([newTicketId, newHighlight]) => {
  if (newTicketId || newHighlight) {
    handledRouteQueryTicketId = null;
    const allTickets = Object.values(queuesData.value).flat();
    if (allTickets.length === 0) {
      fetchAllQueues();
    } else {
      checkRouteQueryTicket();
    }
  }
});

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

const openDetailsModal = (ticket) => {
  selectedTicketForModal.value = ticket;
};

const initiateApproval = (ticket) => {
  if (!isDirector.value && ticket?.is_escalated_to_director) {
    toast.warning("This ticket has been escalated and is awaiting the Director's executive approval.");
    return;
  }
  ticketToApprove.value = ticket;
  isEmergencyApproval.value = Boolean(ticket?.is_emergency || ticket?.urgency === 'Emergency' || ticket?.urgency === 'High');
  showConfirmModal.value = true;
};

const closeConfirmModal = () => {
  showConfirmModal.value = false;
  ticketToApprove.value = null;
  isEmergencyApproval.value = false;
};

// Recategorize Modal Handlers
const showRecategorizeModal = ref(false);
const ticketToRecategorize = ref(null);

const openRecategorizeModal = (ticket) => {
  ticketToRecategorize.value = ticket;
  showRecategorizeModal.value = true;
};

const closeRecategorizeModal = () => {
  showRecategorizeModal.value = false;
  ticketToRecategorize.value = null;
};

const handleTicketRecategorized = ({ ticketId, newService, reason, data }) => {
  // Update local pending queue item immediately
  const ticket = queuesData.value.pending.find((t) => String(t.id) === String(ticketId));
  if (ticket) {
    ticket.service = newService;
    ticket.service_type = newService;
    ticket.title = newService;
    ticket.is_recategorized = true;
    ticket.original_service_type = ticket.original_service_type || data?.original_service_type;
    ticket.recategorization_reason = reason;
  }
  if (selectedTicketForModal.value && String(selectedTicketForModal.value.id) === String(ticketId)) {
    selectedTicketForModal.value.service = newService;
    selectedTicketForModal.value.service_type = newService;
    selectedTicketForModal.value.title = newService;
    selectedTicketForModal.value.is_recategorized = true;
    selectedTicketForModal.value.original_service_type = selectedTicketForModal.value.original_service_type || data?.original_service_type;
    selectedTicketForModal.value.recategorization_reason = reason;
  }
  fetchAllQueues();
};

const confirmApproval = async () => {
  if (ticketToApprove.value) {
    try {
      await api.patch(`tickets/${ticketToApprove.value.id}/approve`, {
        is_emergency: isEmergencyApproval.value ? 1 : 0,
      });
      toast.success(`Approved ticket #${ticketToApprove.value.ticketId}${isEmergencyApproval.value ? ' (Emergency Priority)' : ''}`);
      closeConfirmModal();
      fetchAllQueues();
    } catch (error) {
      toast.error('Failed to approve ticket');
    }
  }
};

const openDeclineModal = (ticket) => {
  ticketToDecline.value = ticket;
  declineReasonInput.value = '';
};

const confirmDecline = async () => {
  if (ticketToDecline.value && declineReasonInput.value.trim()) {
    try {
      await api.patch(`tickets/${ticketToDecline.value.id}/decline`, { decline_reason: declineReasonInput.value.trim() });
      toast.error(`Declined ticket #${ticketToDecline.value.ticketId}`);
      ticketToDecline.value = null;
      fetchAllQueues();
    } catch (error) {
      toast.error('Failed to decline ticket');
    }
  }
};

const openDelayModal = (ticket) => {
  ticketToDelay.value = ticket;
  selectedDelayPreset.value = delayPresets[0];
  delayNotesInput.value = '';
};

const closeDelayModal = () => {
  ticketToDelay.value = null;
  selectedDelayPreset.value = '';
  delayNotesInput.value = '';
  isSubmittingDelay.value = false;
};

const submitDelayApproval = async () => {
  if (!ticketToDelay.value) return;
  const reason = selectedDelayPreset.value === 'Other / Custom Reason'
    ? delayNotesInput.value.trim()
    : (delayNotesInput.value.trim() ? `${selectedDelayPreset.value}: ${delayNotesInput.value.trim()}` : selectedDelayPreset.value);

  if (!reason) {
    toast.warning('Please select or specify a reason for the delay.');
    return;
  }

  isSubmittingDelay.value = true;
  try {
    await api.patch(`tickets/${ticketToDelay.value.id}/delay-approval`, {
      reason: reason,
      delay_reason: reason
    });
    toast.warning(`Ticket #${ticketToDelay.value.ticketId || ticketToDelay.value.id} marked as Approval Delayed.`);
    closeDelayModal();
    fetchAllQueues();
  } catch (error) {
    const msg = error.response?.data?.messages?.error || error.response?.data?.message || 'Failed to delay approval';
    toast.error(msg);
  } finally {
    isSubmittingDelay.value = false;
  }
};

// Escalation to Director Modal State
const showEscalateModal = ref(false);
const ticketToEscalate = ref(null);
const selectedEscalationPreset = ref('');
const escalateReasonInput = ref('');
const isSubmittingEscalate = ref(false);

const escalationPresets = [
  'Heavy structural repairs requiring executive budget',
  'High-cost procurement / specialized equipment',
  'Campus-wide disruption / safety hazard',
  'Important VIP / institutional event requirement',
  'Other / Custom Justification'
];

const openEscalateModal = (ticket) => {
  ticketToEscalate.value = ticket;
  selectedEscalationPreset.value = escalationPresets[0];
  escalateReasonInput.value = escalationPresets[0];
  showEscalateModal.value = true;
};

const closeEscalateModal = () => {
  showEscalateModal.value = false;
  ticketToEscalate.value = null;
  selectedEscalationPreset.value = '';
  escalateReasonInput.value = '';
  isSubmittingEscalate.value = false;
};

const submitEscalation = async () => {
  if (!ticketToEscalate.value || !escalateReasonInput.value.trim()) return;
  isSubmittingEscalate.value = true;
  try {
    await escalateTicketToDirector(ticketToEscalate.value.id, escalateReasonInput.value.trim());
    toast.success(`Ticket #${ticketToEscalate.value.ticketId || ticketToEscalate.value.id} escalated to Director.`);
    closeEscalateModal();
    if (selectedTicketForModal.value) closeDetailsModal();
    fetchAllQueues();
  } catch (error) {
    const msg = error.response?.data?.messages?.error || error.response?.data?.message || 'Failed to escalate ticket';
    toast.error(msg);
  } finally {
    isSubmittingEscalate.value = false;
  }
};

// De-escalate / Return to Unit Head Modal State
const showDeescalateModal = ref(false);
const ticketToDeescalate = ref(null);
const deescalateNotesInput = ref('');
const isSubmittingDeescalate = ref(false);

const openDeescalateModal = (ticket) => {
  ticketToDeescalate.value = ticket;
  deescalateNotesInput.value = '';
  showDeescalateModal.value = true;
};

const closeDeescalateModal = () => {
  showDeescalateModal.value = false;
  ticketToDeescalate.value = null;
  deescalateNotesInput.value = '';
  isSubmittingDeescalate.value = false;
};

const submitDeescalation = async () => {
  if (!ticketToDeescalate.value) return;
  isSubmittingDeescalate.value = true;
  try {
    await deescalateTicketFromDirector(ticketToDeescalate.value.id, deescalateNotesInput.value.trim());
    const actionName = isDirector.value ? 'returned to Unit Head' : 'recalled to Unit Head queue';
    toast.success(`Ticket #${ticketToDeescalate.value.ticketId || ticketToDeescalate.value.id} ${actionName}.`);
    closeDeescalateModal();
    if (selectedTicketForModal.value) closeDetailsModal();
    fetchAllQueues();
  } catch (error) {
    const msg = error.response?.data?.messages?.error || error.response?.data?.message || 'Failed to return ticket';
    toast.error(msg);
  } finally {
    isSubmittingDeescalate.value = false;
  }
};

const openExtensionModal = (ticket) => {
  ticketToExtend.value = ticket;
  showExtensionModal.value = true;
};

const handleTicketExtended = () => {
  toast.success(`Extension granted for ticket #${ticketToExtend.value?.id}`);
  fetchAllQueues();
};

const handleFocusOrVisibility = () => {
  if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
    const isInteracting = !!(showConfirmModal.value || ticketToDecline.value || ticketToDelay.value || selectedTicketForModal.value || showExtensionModal.value || showEscalateModal.value || showDeescalateModal.value);
    if (!isInteracting) {
      fetchAllQueues();
    }
  }
};

onMounted(() => {
  fetchAllQueues();
  pollingInterval = setInterval(() => {
    if (document.hidden) return;
    const isInteracting = !!(showConfirmModal.value || ticketToDecline.value || ticketToDelay.value || selectedTicketForModal.value || showExtensionModal.value || showEscalateModal.value || showDeescalateModal.value);
    if (!isInteracting) {
      fetchAllQueues();
    }
  }, 35000);

  durationInterval = setInterval(updateLiveWorkingDurations, 60000);
  window.addEventListener('focus', handleFocusOrVisibility);
  document.addEventListener('visibilitychange', handleFocusOrVisibility);
  document.addEventListener('click', handleDocumentClick);
});

onUnmounted(() => {
  window.removeEventListener('focus', handleFocusOrVisibility);
  document.removeEventListener('visibilitychange', handleFocusOrVisibility);
  document.removeEventListener('click', handleDocumentClick);
  if (pollingInterval) clearInterval(pollingInterval);
  if (durationInterval) clearInterval(durationInterval);
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
</style>
