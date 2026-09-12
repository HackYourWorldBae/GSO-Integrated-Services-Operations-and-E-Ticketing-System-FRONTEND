<template>
  <MainLayout>
    <template #sidebar-links>
      <DirectorSidebar v-if="authStore.role === 'director'" />
      <template v-else>
        <router-link to="/admin/leau" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span class="text">LEAU Home</span>
        </router-link>
        <router-link to="/director/leau/queues" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span class="text">Ticket Queues</span>
        </router-link>
        <router-link to="/admin/leau/personnel" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span class="text">Personnel Management</span>
        </router-link>
        <div class="mt-8 mb-4 px-4">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Archives</p>
        </div>
        <router-link to="/admin/leau/archives" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <span class="text">Archived Tickets</span>
        </router-link>
      </template>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <router-link v-if="authStore.role === 'director'" to="/director/dashboard" class="p-1 -ml-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="Back to Executive Overview">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </router-link>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none">LEAU Ticket Queues</h2>
          <span class="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider border border-emerald-200">
            {{ activeTabCount }} {{ activeTabLabel }}
          </span>
        </div>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase mt-1">
          {{ authStore.role === 'director' ? 'Director Executive Review & Operations' : 'LEAU Unit Head Monitoring & Approval' }}
        </p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-4 animate-fade-in relative pb-12">

        <!-- ═══ Unified Compact Toolbar: Tabs + Search + Filter ═══ -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs">
          <!-- Top row: Stage Tabs -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-1.5 p-1.5 border-b border-slate-100">
            <!-- Tab 1: Pending Approval -->
            <button
              @click="switchTab('pending')"
              :class="[
                'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer',
                activeTab === 'pending'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="truncate">1. Pending Approval</span>
              <span
                :class="[
                  'ml-1 px-2 py-0.5 rounded-full text-[10px] font-black leading-none shrink-0',
                  activeTab === 'pending' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                ]"
              >
                {{ queueCounts.pending }}
              </span>
            </button>

            <!-- Tab 2: Approved (Awaiting Dispatch) -->
            <button
              @click="switchTab('approved')"
              :class="[
                'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer',
                activeTab === 'approved'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="truncate">2. Approved (Awaiting Dispatch)</span>
              <span
                :class="[
                  'ml-1 px-2 py-0.5 rounded-full text-[10px] font-black leading-none shrink-0',
                  activeTab === 'approved' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
                ]"
              >
                {{ queueCounts.approved }}
              </span>
            </button>

            <!-- Tab 3: Dispatched & In Progress -->
            <button
              @click="switchTab('active')"
              :class="[
                'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer',
                activeTab === 'active'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span class="truncate">3. Dispatched & In Progress</span>
              <span
                :class="[
                  'ml-1 px-2 py-0.5 rounded-full text-[10px] font-black leading-none shrink-0',
                  activeTab === 'active' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                ]"
              >
                {{ queueCounts.active }}
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
                class="w-full pl-8 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all"
              />
              <button
                v-if="searchQuery"
                @click="searchQuery = ''; currentPage = 1"
                class="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
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
              class="px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-all shrink-0"
            >
              <option value="">All Services</option>
              <option v-for="service in serviceCategories" :key="service" :value="service">{{ service }}</option>
            </select>
            <!-- Refresh -->
            <button
              @click="fetchAllQueues"
              :disabled="isLoading"
              class="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all flex items-center justify-center disabled:opacity-50 shrink-0"
              title="Refresh queue"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" :class="{ 'animate-spin': isLoading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <tr class="bg-slate-50 border-b border-slate-200">
                  <th class="px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Ticket Ref</th>
                  <th v-if="activeTab !== 'active'" class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Requester</th>
                  <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Job / Service</th>
                  <th v-if="activeTab === 'pending'" class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Location</th>
                  <th v-if="activeTab === 'pending'" class="px-2 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">Files</th>
                  <th v-if="activeTab === 'approved'" class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Approved</th>
                  <th v-if="activeTab === 'active'" class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Staff / Schedule</th>
                  <th v-if="activeTab === 'active'" class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Working Time</th>
                  <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <!-- Loading State -->
                <tr v-if="isLoading && currentTabTickets.length === 0">
                  <td colspan="7" class="py-16 text-center">
                    <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-xs font-semibold">
                      <svg class="animate-spin h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24">
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
                      <p class="text-xs text-slate-400 mt-1">There are no records matching your current filter criteria.</p>
                    </div>
                  </td>
                </tr>

                <!-- Data Rows with Enhanced Hover Feedback & Click Instruction -->
                <tr
                  v-for="ticket in paginatedTickets"
                  :key="ticket.id"
                  :id="'ticket-' + ticket.id"
                  :class="[
                    'hover:bg-amber-50/50 hover:shadow-xs transition-all duration-150 group cursor-pointer relative',
                    isTicketHighlighted(ticket) ? 'bg-amber-50/80 ring-2 ring-amber-500' : ''
                  ]"
                  @click="openDetailsModal(ticket)"
                >
                  <!-- Ticket Reference -->
                  <td class="px-4 py-2.5 whitespace-nowrap relative">
                    <span class="absolute left-0 top-2 bottom-2 w-1 rounded-r-sm bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150"></span>
                    <div class="relative inline-flex items-center gap-1.5 flex-wrap">
                      <div class="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 inline-flex items-center group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-600 transition-all duration-150">
                        #{{ ticket.ticketId }}
                      </div>
                      <span
                        v-if="ticket.is_emergency"
                        class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[9px] font-black uppercase tracking-wider"
                      >
                        Urgent
                      </span>
                    </div>
                    <div class="text-[10px] text-slate-400 mt-0.5">{{ ticket.date }}</div>
                  </td>

                  <!-- Requester -->
                  <td v-if="activeTab !== 'active'" class="px-3 py-2.5">
                    <div class="flex items-center gap-2">
                      <div class="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {{ getInitials(ticket.requestedBy) }}
                      </div>
                      <span class="text-xs font-semibold text-slate-800 truncate max-w-[120px]">{{ ticket.requestedBy }}</span>
                    </div>
                  </td>

                  <!-- Job / Service -->
                  <td class="px-3 py-2.5 max-w-[200px]">
                    <div class="text-xs font-semibold text-slate-900 line-clamp-1" :title="ticket.description || ticket.title">{{ ticket.description || ticket.title || '—' }}</div>
                    <div class="text-[10px] text-amber-700 font-bold mt-0.5">{{ ticket.service || 'General' }}</div>
                  </td>

                  <!-- Pending: Location -->
                  <td v-if="activeTab === 'pending'" class="px-3 py-2.5 whitespace-nowrap">
                    <div class="text-xs font-semibold text-slate-700">{{ ticket.location || 'Main Campus' }}</div>
                    <div class="text-[10px] text-slate-400">{{ ticket.office_room ? `Rm ${ticket.office_room}` : '—' }}</div>
                  </td>

                  <!-- Pending: Files -->
                  <td v-if="activeTab === 'pending'" class="px-2 py-2.5 text-center">
                    <span
                      v-if="ticket.attachments && ticket.attachments.length > 0"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200 hover:bg-amber-50 hover:text-amber-700 transition-colors cursor-pointer"
                      @click.stop="openDetailsModal(ticket)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                      {{ ticket.attachments.length }}
                    </span>
                    <span v-else class="text-[10px] text-slate-300">—</span>
                  </td>

                  <!-- Approved: Date -->
                  <td v-if="activeTab === 'approved'" class="px-3 py-2.5 whitespace-nowrap">
                    <div class="text-xs font-semibold text-slate-700">{{ ticket.reviewed_at ? formatDate(ticket.reviewed_at) : ticket.date }}</div>
                  </td>

                  <!-- Active: Staff + Schedule (merged) -->
                  <td v-if="activeTab === 'active'" class="px-3 py-2.5 whitespace-nowrap">
                    <div class="text-xs font-semibold text-slate-800">{{ ticket.assignment?.personnel_name || '—' }}</div>
                    <div class="text-[10px] text-slate-400 flex items-center gap-1">
                      {{ formatDate(ticket.effective_target_date || ticket.assignment?.implementation_date) }}
                      <span v-if="ticket.extension_days > 0" class="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[9px] font-black">+{{ ticket.extension_days }}d</span>
                    </div>
                  </td>

                  <!-- Active: Working Time -->
                  <td v-if="activeTab === 'active'" class="px-3 py-2.5 whitespace-nowrap">
                    <div class="text-xs font-bold text-slate-900">{{ liveWorkingDurations[ticket.id] || ticket.computed_working_duration || 'Counting...' }}</div>
                    <div class="text-[9px] text-amber-600 font-semibold">Work hrs only</div>
                  </td>

                  <!-- Actions -->
                  <td class="px-3 py-3 whitespace-nowrap text-right" @click.stop>
                    <!-- Pending Tab Actions -->
                    <div v-if="activeTab === 'pending'" class="flex items-center justify-end gap-2">
                      <button
                        @click="openDetailsModal(ticket)"
                        class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50 text-slate-700 hover:text-amber-800 text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                        title="View Full Ticket Information"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>Full Info</span>
                      </button>
                      <button
                        @click="openDeclineModal(ticket)"
                        class="p-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 transition-all cursor-pointer"
                        title="Decline Request"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <button
                        @click="initiateApproval(ticket)"
                        class="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-1 cursor-pointer"
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
                        class="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50 text-slate-700 hover:text-amber-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                        class="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50 text-slate-700 hover:text-amber-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        title="View Full Details"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <svg class="animate-spin h-5 w-5 text-amber-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-xs font-bold text-slate-400">Loading...</p>
          </div>

          <div v-else-if="paginatedTickets.length === 0" class="text-center py-10 bg-white rounded-2xl border border-slate-200">
            <p class="text-sm font-bold text-slate-600">No Tickets in {{ activeTabLabel }}</p>
            <p class="text-xs text-slate-400 mt-1">No matching records found.</p>
          </div>

          <div
            v-for="ticket in paginatedTickets"
            :key="ticket.id"
            :id="'mob-ticket-' + ticket.id"
            :class="[
              'bg-white rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-sm transition-all cursor-pointer p-3.5 group active:scale-[0.99]',
              isTicketHighlighted(ticket) ? 'ring-2 ring-amber-500 bg-amber-50/40' : ''
            ]"
            @click="openDetailsModal(ticket)"
          >
            <!-- Header row: ID + requester + date -->
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2 min-w-0">
                <span class="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 group-hover:bg-amber-600 group-hover:text-white transition-colors shrink-0">
                  #{{ ticket.ticketId }}
                </span>
                <span class="text-xs font-semibold text-slate-700 truncate">{{ ticket.requestedBy }}</span>
              </div>
              <span class="text-[10px] text-slate-400 shrink-0">{{ ticket.date }}</span>
            </div>

            <!-- Description + service -->
            <div class="mt-2">
              <p class="text-xs font-semibold text-slate-800 line-clamp-1">{{ ticket.description || ticket.title }}</p>
              <p class="text-[11px] text-amber-600 font-bold mt-0.5">{{ ticket.service }}</p>
            </div>

            <!-- Active tab: worker + hours inline -->
            <div v-if="activeTab === 'active'" class="mt-2 flex items-center justify-between text-[11px] text-slate-600">
              <span>{{ ticket.assignment?.personnel_name || 'Unassigned' }}</span>
              <strong class="text-amber-700">{{ liveWorkingDurations[ticket.id] || 'Counting...' }}</strong>
            </div>

            <!-- Actions -->
            <div class="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-end gap-2" @click.stop>
              <button v-if="activeTab === 'pending'" @click="openDeclineModal(ticket)" class="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 text-xs font-bold">Decline</button>
              <button v-if="activeTab === 'pending'" @click="initiateApproval(ticket)" class="px-3.5 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-black uppercase tracking-wider">Approve</button>
              <button v-if="activeTab === 'active'" @click="openExtensionModal(ticket)" class="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-black uppercase tracking-wider">Extend</button>
              <button @click="openDetailsModal(ticket)" class="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold">Details</button>
            </div>
          </div>
        </div>

      </div>
    </template>
  </MainLayout>

  <!-- ======================= DETAILS MODAL ======================= -->
  <Teleport to="body">
    <div v-if="selectedTicketForModal" class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-fade-in" @click.self="closeDetailsModal">
      <div class="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 animate-scale-up flex flex-col max-h-[calc(100dvh-4rem)] sm:max-h-[calc(100dvh-5rem)] overflow-hidden">
        
        <!-- Modal Header -->
        <div class="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 bg-white">
          <div>
            <div class="flex flex-wrap items-center gap-2.5 mb-1.5">
              <span class="font-mono text-base sm:text-lg font-black text-amber-800 bg-amber-50 px-3.5 py-1 rounded-xl border border-amber-200">
                #{{ selectedTicketForModal.ticketId }}
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
            <p class="text-xs text-slate-500 font-medium mt-0.5">Comprehensive institutional job particulars and requester verification</p>
          </div>
          <button @click="closeDetailsModal" class="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer shrink-0" title="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Scrollable Modal Body -->
        <div class="p-5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 custom-scrollbar text-xs flex-1">
          <!-- Requester & Location Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Requester Profile</span>
              <p class="text-base sm:text-lg font-black text-slate-900 leading-tight">{{ selectedTicketForModal.requestedBy }}</p>
              <p class="text-xs text-slate-600 font-semibold flex items-center gap-2">
                <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <span class="truncate">{{ selectedTicketForModal.email || 'No institutional email' }}</span>
              </p>
              <p class="text-xs text-slate-600 font-semibold flex items-center gap-2">
                <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <span>Contact: {{ selectedTicketForModal.contact || 'N/A' }}</span>
              </p>
            </div>

            <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Designated Location</span>
              <p class="text-base sm:text-lg font-black text-slate-900 leading-tight">{{ selectedTicketForModal.location || 'Main Campus' }}</p>
              <p class="text-xs text-slate-600 font-semibold flex items-center gap-2">
                <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                <span>{{ selectedTicketForModal.office_room ? `Room / Office: ${selectedTicketForModal.office_room}` : 'No specific room designated' }}</span>
              </p>
            </div>
          </div>

          <!-- Service & Particulars -->
          <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div class="flex items-center justify-between gap-3">
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Job Particular &amp; Nature of Work</span>
              <span class="px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider border border-amber-200">
                {{ selectedTicketForModal.service }}
              </span>
            </div>
            <p class="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-wrap bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/70 shadow-2xs">
              {{ selectedTicketForModal.description || selectedTicketForModal.title || 'No additional job description provided.' }}
            </p>
          </div>

          <!-- Attachments / Proof Documents -->
          <div v-if="selectedTicketForModal.attachments && selectedTicketForModal.attachments.length > 0" class="space-y-2.5">
            <span class="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <span class="w-2 h-3 rounded-full bg-amber-600"></span>
              Attached Documents &amp; Damage Proof ({{ selectedTicketForModal.attachments.length }})
            </span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div
                v-for="(file, idx) in selectedTicketForModal.attachments"
                :key="idx"
                @click="downloadAttachment(file)"
                class="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-amber-500 hover:bg-amber-50/40 cursor-pointer transition-all shadow-2xs group"
              >
                <div class="flex items-center gap-2.5 truncate">
                  <div class="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                  </div>
                  <span class="text-xs font-bold text-slate-800 truncate group-hover:text-amber-900">{{ file.file_name || 'Attachment' }}</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 group-hover:text-amber-600 shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <div v-if="activeTab === 'pending'" class="flex items-center gap-2.5">
            <button @click="openDeclineModal(selectedTicketForModal); closeDetailsModal()" class="px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-all cursor-pointer">
              Decline Request
            </button>
            <button @click="initiateApproval(selectedTicketForModal); closeDetailsModal()" class="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-amber-600/20 transition-all cursor-pointer">
              Approve Request
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
    <div v-if="showConfirmModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 animate-scale-up space-y-6">
        <div class="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div class="text-center">
          <h3 class="text-xl font-black text-slate-900">Approve Service Request?</h3>
          <p class="text-xs text-slate-500 font-medium mt-1">
            Ticket <strong class="text-slate-800">#{{ ticketToApprove?.ticketId }}</strong> will be approved and queued for dispatcher assignment.
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
              id="leau-emergency-toggle"
              v-model="isEmergencyApproval"
              @click.stop
              class="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300 cursor-pointer"
            />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <label for="leau-emergency-toggle" class="text-xs font-black uppercase tracking-wider cursor-pointer" :class="isEmergencyApproval ? 'text-rose-900' : 'text-slate-800'">
                Mark as Emergency Request
              </label>
              <span v-if="isEmergencyApproval" class="px-2 py-0.5 rounded-md bg-rose-200 text-rose-800 text-[10px] font-black uppercase tracking-wider animate-pulse">
                Urgent
              </span>
            </div>
            <p class="text-[11px] font-medium leading-relaxed mt-1" :class="isEmergencyApproval ? 'text-rose-700' : 'text-slate-500'">
              Enables priority dispatch and task preemption for unit dispatchers when assigning personnel.
            </p>
          </div>
        </div>
        <div class="flex gap-3">
          <button @click="closeConfirmModal" class="w-full px-5 py-3 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 cursor-pointer">
            Cancel
          </button>
          <button @click="confirmApproval" class="w-full px-5 py-3 bg-amber-600 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-amber-600/20 hover:bg-amber-500 cursor-pointer">
            Confirm Approval
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Decline Modal -->
  <Teleport to="body">
    <div v-if="ticketToDecline" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 animate-scale-up space-y-5">
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

  <!-- Ticket Extension Modal (Unforeseen Circumstances & Working Hours) -->
  <TicketExtensionModal
    :is-open="showExtensionModal"
    :ticket="ticketToExtend"
    unit-code="LEAU"
    @close="showExtensionModal = false"
    @extended="handleTicketExtended"
  />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/api/client';
import { toast } from 'vue3-toastify';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import DirectorSidebar from '@/views/dashboards/director/DirectorSidebar.vue';
import TicketExtensionModal from '@/components/TicketExtensionModal.vue';
import { LEAU_SERVICES } from '@/constants/services';
import { calculateWorkingHoursElapsed } from '@/utils/workCalendar';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

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

// 3-Stage Tab Lifecycle
const activeTab = ref('pending'); // 'pending' | 'approved' | 'active'
const queueCounts = ref({ pending: 0, approved: 0, active: 0 });

// Queues data cache
const queuesData = ref({
  pending: [],
  approved: [],
  active: [],
});

const isLoading = ref(false);
const searchQuery = ref('');
const selectedServiceFilter = ref('');

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
    case 'pending': return 'Pending Approval';
    case 'approved': return 'Approved (Awaiting Dispatch)';
    case 'active': return 'Dispatched & In Progress';
    default: return 'Tickets';
  }
});

const currentTabTickets = computed(() => queuesData.value[activeTab.value] || []);

const serviceCategories = computed(() => {
  const set = new Set(LEAU_SERVICES);
  Object.values(queuesData.value).flat().forEach(t => {
    if (t.service && t.service.trim()) set.add(t.service.trim());
  });
  return Array.from(set);
});

// Filtered tickets based on search & category
const filteredTickets = computed(() => {
  let list = currentTabTickets.value;

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
  currentPage.value = 1;
  searchQuery.value = '';
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
    contact: t.requester_contact || '',
    student_id_number: t.student_id_number || '',
    location: t.location || t.college_building,
    office_room: t.office_room,
    attachments: t.attachments || [],
    extension_days: Number(t.extension_days) || 0,
    overtime_hours: Number(t.overtime_hours) || 0,
    is_emergency: Boolean(Number(t.is_emergency) === 1 || t.is_emergency === true || t.urgency === 'Emergency' || t.urgency === 'High'),
  };
};

const fetchAllQueues = async () => {
  isLoading.value = true;
  try {
    const [pendingRes, dispatchRes, activeRes] = await Promise.allSettled([
      api.get('tickets/queue/LEAU'),
      api.get('tickets/dispatch/LEAU'),
      api.get('tickets/active/LEAU'),
    ]);

    if (pendingRes.status === 'fulfilled' && pendingRes.value.data?.data?.tickets) {
      queuesData.value.pending = pendingRes.value.data.data.tickets.map(mapTicket);
      queueCounts.value.pending = queuesData.value.pending.length;
    }

    if (dispatchRes.status === 'fulfilled' && dispatchRes.value.data?.data?.tickets) {
      queuesData.value.approved = dispatchRes.value.data.data.tickets.map(mapTicket);
      queueCounts.value.approved = queuesData.value.approved.length;
    }

    if (activeRes.status === 'fulfilled' && activeRes.value.data?.data?.tickets) {
      queuesData.value.active = activeRes.value.data.data.tickets.map(mapTicket);
      queueCounts.value.active = queuesData.value.active.length;
    }

    updateLiveWorkingDurations();
    checkRouteQueryTicket();
    isInitialFetch = false;
  } catch (error) {
    console.error('Failed to fetch LEAU queues:', error);
  } finally {
    isLoading.value = false;
  }
};

// Institutional working hours calculation (Mon-Fri 8am-5pm, skips weekends and holidays)
const updateLiveWorkingDurations = () => {
  const result = {};
  const activeList = queuesData.value.active || [];
  activeList.forEach(t => {
    const start = t.assignment?.dispatched_at || t.assignment?.assigned_at || t.project_actual_start || t.assignment?.implementation_date;
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
      activeTab.value = 'active';
    } else if (queuesData.value.approved?.some(t => String(t.id) === String(match.id))) {
      activeTab.value = 'approved';
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
  ticketToApprove.value = ticket;
  isEmergencyApproval.value = Boolean(ticket?.is_emergency || ticket?.urgency === 'Emergency' || ticket?.urgency === 'High');
  showConfirmModal.value = true;
};

const closeConfirmModal = () => {
  showConfirmModal.value = false;
  ticketToApprove.value = null;
  isEmergencyApproval.value = false;
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

const openExtensionModal = (ticket) => {
  ticketToExtend.value = ticket;
  showExtensionModal.value = true;
};

const handleTicketExtended = () => {
  toast.success(`Extension granted for ticket #${ticketToExtend.value?.id}`);
  fetchAllQueues();
};

onMounted(() => {
  fetchAllQueues();
  pollingInterval = setInterval(() => {
    if (document.hidden) return;
    const isInteracting = !!(showConfirmModal.value || ticketToDecline.value || selectedTicketForModal.value || showExtensionModal.value);
    if (!isInteracting) {
      fetchAllQueues();
    }
  }, 10000);

  durationInterval = setInterval(updateLiveWorkingDurations, 60000);
});

onUnmounted(() => {
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
