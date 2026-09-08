<template>
  <MainLayout>
    <template #sidebar-links>
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
        <span class="text">Ticket Queues</span>
      </router-link>
      <router-link to="/admin/fgmu/personnel" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span class="text">Personnel Management</span>
      </router-link>
      <router-link to="/admin/fgmu/announcements" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
        <span class="text">Announcements</span>
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
      <router-link to="/admin/fgmu/project-archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span class="text">Archived Projects</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none">Ticket Queues</h2>
          <span class="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider border border-emerald-200">
            {{ activeTabCount }} {{ activeTabLabel }}
          </span>
        </div>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase mt-1">FGMU Unit Head Monitoring & Approval</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-6 animate-fade-in relative pb-12">

        <!-- Stage Navigation Tabs (Adviser Scenario: Unit Head monitoring all ticket stages) -->
        <div class="bg-white rounded-3xl border border-slate-200 p-2 shadow-xs">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <!-- Tab 1: Pending Approval -->
            <button
              @click="switchTab('pending')"
              :class="[
                'flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-200',
                activeTab === 'pending'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>1. Pending Approval</span>
              <span
                :class="[
                  'ml-1 px-2 py-0.5 rounded-full text-[10px] font-black leading-none',
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
                'flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-200',
                activeTab === 'approved'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>2. Approved (Awaiting Dispatch)</span>
              <span
                :class="[
                  'ml-1 px-2 py-0.5 rounded-full text-[10px] font-black leading-none',
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
                'flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-200',
                activeTab === 'active'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>3. Dispatched & In Progress</span>
              <span
                :class="[
                  'ml-1 px-2 py-0.5 rounded-full text-[10px] font-black leading-none',
                  activeTab === 'active' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                ]"
              >
                {{ queueCounts.active }}
              </span>
            </button>
          </div>
        </div>

        <!-- Controls: Search & Filters -->
        <div class="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <!-- Search input -->
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              @input="currentPage = 1"
              type="text"
              placeholder="Search by ticket ID, requester, service, or location..."
              class="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''; currentPage = 1"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Service Filter & Refresh -->
          <div class="flex items-center gap-2 shrink-0">
            <select
              v-model="selectedServiceFilter"
              @change="currentPage = 1"
              class="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none focus:border-emerald-500 transition-all"
            >
              <option value="">All Services</option>
              <option v-for="service in serviceCategories" :key="service" :value="service">
                {{ service }}
              </option>
            </select>

            <button
              @click="fetchAllQueues"
              :disabled="isLoading"
              class="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all flex items-center justify-center disabled:opacity-50"
              title="Refresh Queues"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{ 'animate-spin': isLoading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        <!-- ======================= DESKTOP TABULAR VIEW ======================= -->
        <div class="hidden md:block bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200">
                  <th class="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500">Ticket Reference</th>
                  <th v-if="activeTab !== 'active'" class="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500">Requester</th>
                  <th class="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500">Job Particular & Nature of Work</th>
                  
                  <!-- Dynamic Columns Based on Tab -->
                  <th v-if="activeTab === 'pending'" class="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500">Location / Room</th>
                  <th v-if="activeTab === 'pending'" class="px-4 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500 text-center">Files</th>
                  
                  <th v-if="activeTab === 'approved'" class="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500">Approved Date</th>
                  <th v-if="activeTab === 'approved'" class="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500 text-center">Dispatch Status</th>
                  
                  <th v-if="activeTab === 'active'" class="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500">Assigned Staff</th>
                  <th v-if="activeTab === 'active'" class="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500">Target Schedule</th>
                  <th v-if="activeTab === 'active'" class="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500">Working Time</th>

                  <th class="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500 text-right">Actions</th>
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
                      <p class="text-xs text-slate-400 mt-1">There are no records matching your current filter criteria.</p>
                    </div>
                  </td>
                </tr>

                <!-- Data Rows -->
                <tr
                  v-for="ticket in paginatedTickets"
                  :key="ticket.id"
                  class="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                  @click="openDetailsModal(ticket)"
                >
                  <!-- Ticket Reference -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 inline-block">
                      #{{ ticket.ticketId }}
                    </div>
                    <div class="text-[11px] font-medium text-slate-400 mt-1 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ ticket.date }}
                    </div>
                  </td>

                  <!-- Requester (For Pending & Approved) -->
                  <td v-if="activeTab !== 'active'" class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-2.5">
                      <div class="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {{ getInitials(ticket.requestedBy) }}
                      </div>
                      <div>
                        <div class="text-xs font-bold text-slate-800 leading-tight">
                          {{ ticket.requestedBy }}
                        </div>
                        <div class="text-[10px] text-slate-400 font-medium">
                          {{ ticket.email || (ticket.student_id_number ? `ID: ${ticket.student_id_number}` : 'Requester') }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Job Particular & Nature of Work -->
                  <td class="px-6 py-4">
                    <div class="text-xs font-bold text-slate-900 leading-snug line-clamp-1 max-w-xs" :title="ticket.description || ticket.title">
                      {{ ticket.description || ticket.title || 'No particulars specified' }}
                    </div>
                    <div class="text-[11px] text-slate-500 line-clamp-1 max-w-xs mt-0.5 font-normal">
                      {{ ticket.service || 'General Service' }}
                    </div>
                  </td>

                  <!-- Tab 1 Specific: Location & Room -->
                  <td v-if="activeTab === 'pending'" class="px-6 py-4 whitespace-nowrap">
                    <div class="text-xs font-bold text-slate-700">
                      {{ ticket.location || 'Main Campus' }}
                    </div>
                    <div class="text-[11px] text-slate-400 font-medium">
                      {{ ticket.office_room ? `Room: ${ticket.office_room}` : 'No room specified' }}
                    </div>
                  </td>

                  <!-- Tab 1 Specific: Files -->
                  <td v-if="activeTab === 'pending'" class="px-4 py-4 whitespace-nowrap text-center">
                    <span
                      v-if="ticket.attachments && ticket.attachments.length > 0"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      @click.stop="openDetailsModal(ticket)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      {{ ticket.attachments.length }}
                    </span>
                    <span v-else class="text-[10px] text-slate-300 font-medium">—</span>
                  </td>

                  <!-- Tab 2 Specific: Approved Date & Status -->
                  <td v-if="activeTab === 'approved'" class="px-6 py-4 whitespace-nowrap">
                    <div class="text-xs font-bold text-slate-700">{{ ticket.reviewed_at ? formatDate(ticket.reviewed_at) : ticket.date }}</div>
                    <div class="text-[10px] text-slate-400">Reviewed by Admin</div>
                  </td>
                  <td v-if="activeTab === 'approved'" class="px-6 py-4 whitespace-nowrap text-center">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider border border-blue-200">
                      <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                      Awaiting Dispatcher
                    </span>
                  </td>

                  <!-- Tab 3 Specific: Assigned Worker, Target Schedule, Working Hours -->
                  <td v-if="activeTab === 'active'" class="px-6 py-4 whitespace-nowrap">
                    <div class="text-xs font-bold text-slate-800">{{ ticket.assignment?.personnel_name || 'Assigned Worker' }}</div>
                    <div class="text-[10px] text-slate-400 font-medium">Technician</div>
                  </td>
                  <td v-if="activeTab === 'active'" class="px-6 py-4 whitespace-nowrap">
                    <div class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span>{{ formatDate(ticket.effective_target_date || ticket.assignment?.implementation_date) }}</span>
                      <span v-if="ticket.extension_days > 0" class="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[9px] font-black uppercase tracking-wider border border-amber-200">
                        +{{ ticket.extension_days }}d Ext
                      </span>
                    </div>
                    <div class="text-[10px] text-slate-400">
                      {{ ticket.working_days ? `${ticket.working_days} Target Working Day(s)` : 'Scheduled' }}
                    </div>
                  </td>
                  <td v-if="activeTab === 'active'" class="px-6 py-4 whitespace-nowrap">
                    <div class="text-xs font-black text-slate-900 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{{ liveWorkingDurations[ticket.id] || ticket.computed_working_duration || 'Counting...' }}</span>
                    </div>
                    <div class="text-[9px] font-bold text-emerald-700">Standard Work Hours Only</div>
                  </td>

                  <!-- Actions -->
                  <td class="px-6 py-4 whitespace-nowrap text-right" @click.stop>
                    <!-- Pending Tab Actions -->
                    <div v-if="activeTab === 'pending'" class="flex items-center justify-end gap-2">
                      <button
                        @click="openDeclineModal(ticket)"
                        class="p-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 transition-all"
                        title="Decline Request"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <button
                        @click="initiateApproval(ticket)"
                        class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-1"
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
                        class="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
                      >
                        View Details
                      </button>
                    </div>

                    <!-- Active Tab Actions: Details + Grant Extension -->
                    <div v-else-if="activeTab === 'active'" class="flex items-center justify-end gap-2">
                      <button
                        @click="openExtensionModal(ticket)"
                        class="px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1"
                        title="Grant timeline extension due to unforeseen circumstances"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Extend</span>
                      </button>
                      <button
                        @click="openDetailsModal(ticket)"
                        class="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all"
                        title="View Details"
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
        <div class="md:hidden space-y-3">
          <div v-if="isLoading && currentTabTickets.length === 0" class="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
            <svg class="animate-spin h-6 w-6 text-emerald-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-xs font-bold text-slate-500">Loading tickets...</p>
          </div>

          <div v-else-if="paginatedTickets.length === 0" class="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
            <p class="text-sm font-bold text-slate-700">No Tickets in {{ activeTabLabel }}</p>
            <p class="text-xs text-slate-400 mt-1">No matching tickets found.</p>
          </div>

          <div
            v-for="ticket in paginatedTickets"
            :key="ticket.id"
            class="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3"
            @click="openDetailsModal(ticket)"
          >
            <div class="flex items-center justify-between">
              <span class="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                #{{ ticket.ticketId }}
              </span>
              <span class="text-[10px] font-bold text-slate-400">{{ ticket.date }}</span>
            </div>

            <div>
              <p class="text-xs font-bold text-slate-900 leading-snug line-clamp-2">{{ ticket.description || ticket.title }}</p>
              <p class="text-[11px] text-emerald-600 font-bold mt-0.5">{{ ticket.service }}</p>
            </div>

            <div class="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
              <span class="font-medium">Requester:</span>
              <strong class="text-slate-800">{{ ticket.requestedBy }}</strong>
            </div>

            <div v-if="activeTab === 'active'" class="text-[11px] text-slate-600 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 space-y-1">
              <div class="flex items-center justify-between">
                <span>Worker:</span>
                <strong class="text-slate-800">{{ ticket.assignment?.personnel_name || 'Assigned' }}</strong>
              </div>
              <div class="flex items-center justify-between">
                <span>Working Hours:</span>
                <strong class="text-emerald-700">{{ liveWorkingDurations[ticket.id] || 'Counting...' }}</strong>
              </div>
            </div>

            <div class="pt-2 border-t border-slate-100 flex items-center justify-end gap-2" @click.stop>
              <button
                v-if="activeTab === 'pending'"
                @click="openDeclineModal(ticket)"
                class="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 text-xs font-bold"
              >
                Decline
              </button>
              <button
                v-if="activeTab === 'pending'"
                @click="initiateApproval(ticket)"
                class="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-wider"
              >
                Approve
              </button>
              <button
                v-if="activeTab === 'active'"
                @click="openExtensionModal(ticket)"
                class="px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-black uppercase tracking-wider"
              >
                Extend
              </button>
              <button
                @click="openDetailsModal(ticket)"
                class="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold"
              >
                Details
              </button>
            </div>
          </div>
        </div>

      </div>
    </template>
  </MainLayout>

  <!-- ======================= DETAILS MODAL ======================= -->
  <div v-if="selectedTicketForModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in" @click.self="closeDetailsModal">
    <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 animate-scale-up space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
      <div class="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <div class="flex items-center gap-2">
            <span class="font-mono text-sm font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              #{{ selectedTicketForModal.ticketId }}
            </span>
            <span class="text-xs font-bold text-slate-400">
              Submitted {{ selectedTicketForModal.date }}
            </span>
          </div>
          <h3 class="text-lg font-black text-slate-900 mt-1">Ticket Details</h3>
        </div>
        <button @click="closeDetailsModal" class="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Overview Info -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
          <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Requester</span>
          <p class="text-sm font-bold text-slate-900">{{ selectedTicketForModal.requestedBy }}</p>
          <p class="text-xs text-slate-500">{{ selectedTicketForModal.email || 'No email' }}</p>
          <p class="text-xs text-slate-500">Contact: {{ selectedTicketForModal.contact || 'N/A' }}</p>
        </div>
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
          <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Location</span>
          <p class="text-sm font-bold text-slate-900">{{ selectedTicketForModal.location || 'Main Campus' }}</p>
          <p class="text-xs text-slate-500">{{ selectedTicketForModal.office_room ? `Room ${selectedTicketForModal.office_room}` : 'No room specified' }}</p>
        </div>
      </div>

      <!-- Service & Particulars -->
      <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
        <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Job Particular & Nature of Work</span>
        <p class="text-xs font-black text-emerald-700 uppercase tracking-wide">{{ selectedTicketForModal.service }}</p>
        <p class="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{{ selectedTicketForModal.description || selectedTicketForModal.title || 'None' }}</p>
      </div>

      <!-- Attachments -->
      <div v-if="selectedTicketForModal.attachments && selectedTicketForModal.attachments.length > 0">
        <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">Attached Documents ({{ selectedTicketForModal.attachments.length }})</span>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div
            v-for="(file, idx) in selectedTicketForModal.attachments"
            :key="idx"
            @click="downloadAttachment(file)"
            class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 cursor-pointer transition-all group"
          >
            <span class="text-xs font-semibold text-slate-700 truncate group-hover:text-emerald-800">{{ file.file_name || 'Attachment' }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 group-hover:text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <button @click="closeDetailsModal" class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold">
          Close
        </button>
        <div v-if="activeTab === 'pending'" class="flex items-center gap-2">
          <button @click="openDeclineModal(selectedTicketForModal); closeDetailsModal()" class="px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100">
            Decline Request
          </button>
          <button @click="initiateApproval(selectedTicketForModal); closeDetailsModal()" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider">
            Approve Request
          </button>
        </div>
        <div v-else-if="activeTab === 'active'">
          <button @click="openExtensionModal(selectedTicketForModal); closeDetailsModal()" class="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Extend Timeline</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Approve Confirm Modal -->
  <div v-if="showConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
    <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 animate-scale-up space-y-6">
      <div class="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
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
      <div class="flex gap-3">
        <button @click="closeConfirmModal" class="w-full px-5 py-3 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200">
          Cancel
        </button>
        <button @click="confirmApproval" class="w-full px-5 py-3 bg-emerald-600 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-500">
          Confirm Approval
        </button>
      </div>
    </div>
  </div>

  <!-- Decline Modal -->
  <div v-if="ticketToDecline" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
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
        <button @click="ticketToDecline = null" class="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
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
        <button @click="ticketToDecline = null" class="w-full px-5 py-3 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200">
          Cancel
        </button>
        <button
          @click="confirmDecline"
          :disabled="!declineReasonInput.trim()"
          class="w-full px-5 py-3 bg-rose-600 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-rose-600/20 hover:bg-rose-500 disabled:opacity-50"
        >
          Confirm Decline
        </button>
      </div>
    </div>
  </div>

  <!-- Ticket Extension Modal (Unforeseen Circumstances & Working Hours) -->
  <TicketExtensionModal
    :is-open="showExtensionModal"
    :ticket="ticketToExtend"
    unit-code="FGMU"
    @close="showExtensionModal = false"
    @extended="handleTicketExtended"
  />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/client';
import { toast } from 'vue3-toastify';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import TicketExtensionModal from '@/components/TicketExtensionModal.vue';
import { FGMU_SERVICES } from '@/constants/services';
import { calculateWorkingHoursElapsed } from '@/utils/workCalendar';

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
  const set = new Set(FGMU_SERVICES);
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
  };
};

const fetchAllQueues = async () => {
  isLoading.value = true;
  try {
    const [pendingRes, dispatchRes, activeRes] = await Promise.allSettled([
      api.get('tickets/queue/FGMU'),
      api.get('tickets/dispatch/FGMU'),
      api.get('tickets/active/FGMU'),
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
    if (isInitialFetch) {
      checkRouteQueryTicket();
      isInitialFetch = false;
    }
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

const checkRouteQueryTicket = () => {
  const targetId = route.query.ticketId || route.query.highlight;
  if (!targetId || handledRouteQueryTicketId === String(targetId)) return;
  const allTickets = Object.values(queuesData.value).flat();
  if (allTickets.length === 0) return;

  const match = allTickets.find(t => 
    String(t.ticketId).toLowerCase() === String(targetId).toLowerCase() || 
    String(t.id).toLowerCase() === String(targetId).toLowerCase()
  );
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
  } else {
    handledRouteQueryTicketId = String(targetId);
    searchQuery.value = String(targetId);
    clearRouteQueryTicket();
  }
};

watch(() => [route.query.ticketId, route.query.highlight, route.query._t], ([newTicketId, newHighlight]) => {
  if (newTicketId || newHighlight) {
    handledRouteQueryTicketId = null;
    checkRouteQueryTicket();
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
  showConfirmModal.value = true;
};

const closeConfirmModal = () => {
  showConfirmModal.value = false;
  ticketToApprove.value = null;
};

const confirmApproval = async () => {
  if (ticketToApprove.value) {
    try {
      await api.patch(`tickets/${ticketToApprove.value.id}/approve`);
      toast.success(`Approved ticket #${ticketToApprove.value.ticketId}`);
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
