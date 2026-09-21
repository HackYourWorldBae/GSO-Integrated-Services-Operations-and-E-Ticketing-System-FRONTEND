<template>
  <div class="space-y-4 animate-fade-in relative pb-12">

    <!-- ═══ Unified Compact Toolbar: Stage Tab + Search + Filters + Refresh ═══ -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs">
      
      <!-- Top Row: Stage Tabs (In Progress & Awaiting Rating) + Urgency Filter Pills -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-1.5 border-b border-slate-100">
        <!-- Stage Tabs -->
        <div class="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
          <!-- Tab 1: In Progress -->
          <button
            type="button"
            @click="switchTab('in_progress')"
            :class="[
              'flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs active:scale-95',
              activeTab === 'in_progress'
                ? [themeAccentBg, themeAccentShadow, 'text-white shadow-md']
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
            ]"
          >
            <span v-if="activeTab === 'in_progress'" class="w-2 h-2 rounded-full bg-white animate-ping"></span>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>In Progress</span>
            <span
              :class="[
                'ml-1 px-2 py-0.5 rounded-full text-[10px] font-black leading-none',
                activeTab === 'in_progress' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              ]"
            >
              {{ inProgressTickets.length }}
            </span>
          </button>

          <!-- Tab 2 (LEAU only): Borrowed Requests — picked up + overdue items -->
          <button
            v-if="isLEAU"
            type="button"
            @click="switchTab('borrowed')"
            :class="[
              'flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs active:scale-95',
              activeTab === 'borrowed'
                ? [themeAccentBg, themeAccentShadow, 'text-white shadow-md']
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
            ]"
          >
            <svg v-if="activeTab === 'borrowed'" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>Borrowed Requests</span>
            <span
              :class="[
                'ml-1 px-2 py-0.5 rounded-full text-[10px] font-black leading-none',
                activeTab === 'borrowed' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              ]"
            >
              {{ borrowedCount }}
            </span>
          </button>

          <!-- Tab: Collab Active (joint execution, requesting unit completes) -->
          <button
            type="button"
            @click="switchTab('collab')"
            :class="[
              'flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs active:scale-95',
              activeTab === 'collab'
                ? 'bg-indigo-600 shadow-indigo-600/20 text-white shadow-md'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" :class="activeTab === 'collab' ? 'text-white' : 'text-indigo-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Collab Active</span>
            <span
              :class="[
                'ml-1 px-2 py-0.5 rounded-full text-[10px] font-black leading-none',
                activeTab === 'collab' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-900'
              ]"
            >
              {{ collabActiveCount }}
            </span>
          </button>

          <!-- Tab 3: Awaiting Requestor Rating -->
          <button
            type="button"
            @click="switchTab('awaiting_rating')"
            :class="[
              'flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs active:scale-95',
              activeTab === 'awaiting_rating'
                ? [themeRatingTabBg, themeRatingTabShadow, 'text-white shadow-md']
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" :class="activeTab === 'awaiting_rating' ? 'text-white' : 'text-amber-500'" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>Awaiting Requestor Rating</span>
            <span
              :class="[
                'ml-1 px-2 py-0.5 rounded-full text-[10px] font-black leading-none',
                activeTab === 'awaiting_rating' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900'
              ]"
            >
              {{ awaitingRatingTickets.length }}
            </span>
          </button>
        </div>

        <!-- Urgency Filters (job tabs only; borrowing/collab have their own search) -->
        <div v-if="!isLeauBorrowed && !isCollabActiveTab" class="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/60 text-xs font-bold self-start sm:self-auto flex-wrap sm:flex-nowrap gap-1">
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
            All ({{ activeTabTickets.length }})
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

      <!-- Bottom Row: Search + Service Category Filter + Refresh (job tabs only) -->
      <div v-if="!isLeauBorrowed && !isCollabActiveTab" class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2">
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

        <!-- Service Filter Dropdown -->
        <select
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
          @click="refreshActiveAll"
          :disabled="loading"
          class="p-2.5 min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all flex items-center justify-center disabled:opacity-50 shrink-0 cursor-pointer active:scale-95 touch-manipulation"
          title="Refresh active tickets list"
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

      <!-- Bottom Row: Shared Search + Refresh (collab tab; toolbar owns it director-style) -->
      <div v-if="isCollabActiveTab" class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2">
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
            placeholder="Search collab ticket #, title, service, requester, unit..."
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
        <button
          type="button"
          @click="refreshActiveAll"
          :disabled="loading"
          class="p-2.5 min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all flex items-center justify-center disabled:opacity-50 shrink-0 cursor-pointer active:scale-95 touch-manipulation"
          title="Refresh active tickets list"
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

    <!-- ═══ Borrowed Requests Pane (LEAU only: picked up + overdue) ═══ -->
    <div v-if="isLeauBorrowed">
      <BorrowingWorkspace initial-tab="borrowed" :show-tabs="false" :status-filter="['picked_up', 'overdue']" :key="'active-borrowed-' + borrowedRefreshKey" />
    </div>

    <!-- ═══ Collab Active Pane (shares the toolbar search + action handlers above) ═══ -->
    <div v-if="isCollabActiveTab">
      <CollabTicketsWorkspace
        :unit-code="props.unitCode"
        mode="active"
        direction="all"
        :show-dispatch-action="false"
        :hide-toolbar="true"
        :search-text="searchQuery"
        :emit-actions="true"
        :key="'active-collab-' + collabActiveRefreshKey"
        @updated="onCollabActiveUpdated"
        @collab-action="handleCollabAction"
      />
    </div>

    <!-- ═══ Desktop Tabular View (Matching Approved Tickets Layout) ═══ -->
    <div v-if="!isLeauBorrowed && !isCollabActiveTab" class="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th class="px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Ticket Ref</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Requester</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Location</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                {{ activeTab === 'in_progress' ? 'Elapsed Duration' : 'Completion & Status' }}
              </th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                {{ activeTab === 'in_progress' ? 'Target Duration' : 'Liquidation & Cost' }}
              </th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs">
            
            <!-- Loading State -->
            <tr v-if="loading && activeTabTickets.length === 0">
              <td colspan="6" class="py-16 text-center">
                <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-xs font-semibold">
                  <svg class="animate-spin h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading {{ activeTab === 'awaiting_rating' ? 'completed tickets' : 'active tickets' }}...
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-else-if="paginatedTickets.length === 0">
              <td colspan="6" class="py-16 text-center">
                <div class="max-w-md mx-auto flex flex-col items-center">
                  <div
                    :class="[
                      'h-12 w-12 rounded-2xl flex items-center justify-center mb-3',
                      activeTab === 'awaiting_rating' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                    ]"
                  >
                    <svg v-if="activeTab === 'awaiting_rating'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p class="text-sm font-bold text-slate-800">
                    {{ activeTab === 'awaiting_rating' ? 'No Tickets Awaiting Requestor Rating' : 'No Active Dispatches Currently In Progress' }}
                  </p>
                  <p class="text-xs text-slate-500 mt-1">
                    {{ activeTab === 'awaiting_rating' ? 'When an admin marks a job completed, it remains here until the requestor rates and closes it from their dashboard.' : 'There are no ongoing tickets matching your current filter criteria.' }}
                  </p>
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
                isTicketHighlighted(ticket) ? 'bg-emerald-50/80 ring-2 ring-emerald-500' : ''
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
                  <span
                    v-if="ticket.is_labor_only"
                    class="px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 text-[9px] font-black uppercase tracking-wider border border-sky-200"
                    title="Designated as Labor Only Service"
                  >
                    Labor Only
                  </span>
                  <span
                    v-else-if="ticket.materials && ticket.materials.length > 0"
                    class="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[9px] font-bold border border-emerald-200"
                    :title="`${ticket.materials.length} material(s) assessed / logged`"
                  >
                    {{ ticket.materials.length }} part{{ ticket.materials.length !== 1 ? 's' : '' }}
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

              <!-- Elapsed Duration / Completion & Status -->
              <td class="px-3 py-2.5 whitespace-nowrap">
                <template v-if="activeTab === 'in_progress'">
                  <span :class="['text-xs font-bold px-2 py-0.5 rounded-lg border inline-flex items-center gap-1.5 w-fit', themeElapsedBadge]">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ liveDurations[ticket.id] || computeLiveDuration(ticket.assignment, ticket.overtime_hours) || 'Calculating...' }}</span>
                  </span>
                  <span class="block text-[9px] font-black uppercase tracking-wider text-emerald-700 mt-0.5">
                    ● In Progress
                  </span>
                </template>
                <template v-else>
                  <div class="text-xs font-bold text-slate-800">
                    {{ formatCompletedDate(ticket.completed_at || ticket.updated_at) }}
                  </div>
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80 text-[9px] font-black uppercase tracking-wider mt-0.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    Awaiting Rating
                  </span>
                </template>
              </td>

              <!-- Target Duration / Liquidation & Cost -->
              <td class="px-3 py-2.5 whitespace-nowrap">
                <template v-if="activeTab === 'in_progress'">
                  <div class="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ ticket.working_days || ticket.assignment?.working_days || 1 }} {{ (ticket.working_days || ticket.assignment?.working_days || 1) === 1 ? 'Day' : 'Days' }}</span>
                    <span v-if="ticket.extension_days > 0" class="ml-1.5 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-black border border-amber-200" title="Extension Days">
                      +{{ ticket.extension_days }}d
                    </span>
                  </div>
                </template>
                <template v-else>
                  <div class="text-xs font-bold text-slate-800">
                    ₱{{ formatNumber(ticket.total_material_cost || ticket.actual_material_cost || 0) }}
                  </div>
                  <div class="text-[10px] text-slate-500">
                    {{ (ticket.materials && ticket.materials.length > 0) ? `${ticket.materials.length} item(s) logged` : (ticket.is_labor_only ? 'Labor Only' : 'No items') }}
                  </div>
                </template>
              </td>

              <!-- Actions -->
              <td class="px-3 py-3 whitespace-nowrap text-right" @click.stop>
                <div class="flex items-center justify-end gap-1.5">
                  <!-- Job Order Print / Preview Action Button -->
                  <button
                    type="button"
                    @click="openJobOrderDocument(ticket)"
                    class="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold transition-all shadow-2xs active:scale-95 flex items-center gap-1 cursor-pointer border border-slate-200"
                    title="Print / View Job Order (Official Job Request Form)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    <span>Job Order</span>
                  </button>

                  <template v-if="activeTab === 'in_progress'">
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

                    <!-- Extend Button -->
                    <button
                      type="button"
                      @click="openExtensionModal(ticket)"
                      class="px-2.5 py-1.5 rounded-xl border border-amber-200/80 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95"
                      title="Grant timeline extension with reason"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Extend</span>
                    </button>

                    <!-- Adjust Materials Button -->
                    <button
                      type="button"
                      @click="openAdjustModal(ticket)"
                      class="px-2.5 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95"
                      title="Adjust ongoing materials and supplies"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Materials</span>
                    </button>

                    <!-- Cross-Unit Collaboration Button -->
                    <button
                      type="button"
                      @click="openCollabModal(ticket)"
                      class="px-2.5 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95"
                      title="Cross-Unit Collaboration (Invite other units or manage shared personnel)"
                    >
                      <svg class="h-3.5 w-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Collab</span>
                    </button>

                    <!-- Complete Job Button -->
                    <button
                      type="button"
                      @click="openMaterialCompletionModal(ticket)"
                      :class="[
                        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-black transition-all shadow-xs active:scale-95 cursor-pointer',
                        themeAccentBg
                      ]"
                      title="Complete Job and log materials used"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Complete</span>
                    </button>
                  </template>

                  <template v-else>
                    <!-- Material Receipt Slip Button -->
                    <button
                      type="button"
                      @click="openReceiptModal(ticket)"
                      class="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all shadow-2xs active:scale-95 flex items-center gap-1 cursor-pointer"
                      title="View / Print Official Material Receipt Slip"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Receipt Slip</span>
                    </button>

                    <!-- Details Button -->
                    <button
                      type="button"
                      @click="openDetailsModal(ticket)"
                      class="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-2xs active:scale-95 flex items-center gap-1 cursor-pointer"
                      title="View Full Ticket Details"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>Details</span>
                    </button>
                  </template>
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
    <div v-if="!isLeauBorrowed && !isCollabActiveTab" class="md:hidden space-y-3">
      <!-- Loading State -->
      <div v-if="loading && activeTabTickets.length === 0" class="py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
        <div class="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
          <svg class="animate-spin h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading {{ activeTab === 'awaiting_rating' ? 'completed tickets' : 'active tickets' }}...
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="paginatedTickets.length === 0" class="py-12 text-center bg-white rounded-2xl border border-slate-200 p-6">
        <div
          :class="[
            'h-10 w-10 rounded-xl flex items-center justify-center mx-auto mb-2',
            activeTab === 'awaiting_rating' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'
          ]"
        >
          <svg v-if="activeTab === 'awaiting_rating'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-xs font-bold text-slate-700">
          {{ activeTab === 'awaiting_rating' ? 'No Tickets Awaiting Requestor Rating' : 'No Active Dispatches Found' }}
        </p>
        <p class="text-[10px] text-slate-400 mt-0.5">
          {{ activeTab === 'awaiting_rating' ? 'Completed tickets will appear here until rated by requestors.' : 'No ongoing tickets matching current filters.' }}
        </p>
      </div>

      <!-- Mobile Ticket Cards -->
      <div
        v-for="ticket in paginatedTickets"
        :key="ticket.id"
        :id="'mob-ticket-' + ticket.id"
        :class="[
          'bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-3 cursor-pointer transition-all',
          isTicketHighlighted(ticket) ? 'ring-2 ring-emerald-500 bg-emerald-50/40' : ''
        ]"
        @click="openDetailsModal(ticket)"
      >
        <!-- Top Row: Ref & Elapsed / Status Badge -->
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span :class="['font-mono text-sm font-bold px-2.5 py-0.5 rounded-lg border transition-colors shrink-0 shadow-2xs', themeMonoBadge]">
              #{{ ticket.id }}
            </span>
            <span v-if="ticket.is_emergency" class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[9px] font-black uppercase tracking-wider border border-rose-200">
              Emergency
            </span>
          </div>

          <template v-if="activeTab === 'in_progress'">
            <span :class="['text-[11px] font-bold px-2 py-0.5 rounded-lg border inline-flex items-center gap-1', themeElapsedBadge]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ liveDurations[ticket.id] || computeLiveDuration(ticket.assignment, ticket.overtime_hours) || 'In Progress' }}
            </span>
          </template>
          <template v-else>
            <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              Awaiting Rating
            </span>
          </template>
        </div>

        <!-- Location & Requester -->
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

        <!-- In-Progress: Target Duration Meta -->
        <div v-if="activeTab === 'in_progress'" class="flex items-center justify-between text-xs text-slate-500 pt-0.5">
          <span class="text-[11px] font-medium text-slate-500">Target Duration:</span>
          <span class="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700">
            {{ ticket.working_days || ticket.assignment?.working_days || 1 }} Target {{ (ticket.working_days || ticket.assignment?.working_days || 1) === 1 ? 'Day' : 'Days' }}
            <span v-if="ticket.extension_days > 0" class="text-amber-600 ml-0.5 font-black">+{{ ticket.extension_days }}d</span>
          </span>
        </div>
        <!-- Awaiting-Rating: Completed Date Meta -->
        <div v-else class="flex items-center justify-between text-xs text-slate-500 pt-0.5">
          <span class="text-[11px] font-medium text-slate-500">Completed At:</span>
          <span class="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700">
            {{ formatCompletedDate(ticket.completed_at || ticket.updated_at) }}
          </span>
        </div>

        <!-- Materials Meta / Liquidation total -->
        <div class="flex items-center justify-between text-xs text-slate-500 pt-0.5">
          <span class="text-[11px] font-medium text-slate-500">
            {{ activeTab === 'in_progress' ? 'Materials:' : 'Liquidated Cost:' }}
          </span>
          <span v-if="ticket.is_labor_only" class="px-2 py-0.5 rounded bg-sky-50 border border-sky-200 text-[10px] font-black text-sky-700">
            Labor Only
          </span>
          <span v-else-if="ticket.materials && ticket.materials.length > 0" class="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-800">
            {{ ticket.materials.length }} part(s) • ₱{{ formatNumber(ticket.total_material_cost || ticket.actual_material_cost || 0) }}
          </span>
          <span v-else class="text-[10px] text-slate-400 italic">
            None recorded
          </span>
        </div>

        <!-- Card Actions -->
        <div class="flex items-center gap-2 pt-1 border-t border-slate-100 flex-wrap sm:flex-nowrap" @click.stop>
          <button
            type="button"
            @click="openJobOrderDocument(ticket)"
            class="py-2.5 px-2.5 min-h-[38px] rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold text-center transition-all flex items-center justify-center gap-1 cursor-pointer touch-manipulation active:scale-95"
            title="Print / View Job Order"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Job Order</span>
          </button>

          <template v-if="activeTab === 'in_progress'">
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
              @click="openExtensionModal(ticket)"
              class="flex-1 py-2.5 px-3 min-h-[38px] rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-black text-center transition-colors cursor-pointer touch-manipulation active:scale-95 flex items-center justify-center"
            >
              Extend
            </button>
            <button
              type="button"
              @click="openAdjustModal(ticket)"
              class="flex-1 py-2.5 px-2.5 min-h-[38px] rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-black text-center transition-colors cursor-pointer touch-manipulation active:scale-95 flex items-center justify-center gap-1"
              title="Adjust ongoing materials and supplies"
            >
              <span>Materials</span>
            </button>
            <button
              type="button"
              @click.stop="openCollabModal(ticket)"
              class="py-2.5 px-2.5 min-h-[38px] rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black text-center transition-colors cursor-pointer touch-manipulation active:scale-95 flex items-center justify-center gap-1"
              title="Cross-Unit Collaboration"
            >
              <span>Collab</span>
            </button>
            <button
              type="button"
              @click="openMaterialCompletionModal(ticket)"
              :class="[
                'flex-1 py-2.5 px-3 min-h-[38px] rounded-xl text-white text-xs font-black text-center transition-all shadow-xs active:scale-95 cursor-pointer touch-manipulation flex items-center justify-center',
                themeAccentBg
              ]"
            >
              Complete Job
            </button>
          </template>

          <template v-else>
            <button
              type="button"
              @click="openReceiptModal(ticket)"
              class="flex-1 py-2.5 px-3 min-h-[38px] rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-black text-center transition-colors cursor-pointer touch-manipulation active:scale-95 flex items-center justify-center gap-1"
              title="View Material Receipt Slip"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Receipt Slip</span>
            </button>
            <button
              type="button"
              @click="openDetailsModal(ticket)"
              class="py-2.5 px-3 min-h-[38px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold text-center transition-colors cursor-pointer touch-manipulation active:scale-95 flex items-center justify-center"
            >
              Details
            </button>
          </template>
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
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-fade-in pointer-events-auto"
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
                  Started on {{ formatDate(getTicketStartTime(selectedTicketForModal)) }}
                </span>
                <span
                  v-if="selectedTicketForModal.current_step == 6 || selectedTicketForModal.status === 'resolved'"
                  class="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider border border-amber-200"
                >
                  ★ Awaiting Requestor Rating
                </span>
                <span
                  v-else
                  class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider border border-emerald-200"
                >
                  Active Dispatch
                </span>
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {{ (selectedTicketForModal.current_step == 6 || selectedTicketForModal.status === 'resolved') ? 'Completed Ticket Details' : 'Active Work Details' }}
              </h3>
              <p class="text-xs text-slate-500 font-medium mt-0.5">
                {{ (selectedTicketForModal.current_step == 6 || selectedTicketForModal.status === 'resolved') ? 'Job marked completed by dispatch admin. Awaiting client rating and closure from their dashboard.' : 'Real-time assignment parameters, elapsed work tracking, and requester particulars' }}
              </p>
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
            
            <!-- Assigned Personnel & Live Timeline Card -->
            <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Field Personnel</span>
                  <span v-if="getAssignedWorkers(selectedTicketForModal).length > 0" class="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 text-[10px] font-black">
                    {{ getAssignedWorkers(selectedTicketForModal).length }} {{ getAssignedWorkers(selectedTicketForModal).length === 1 ? 'Worker' : 'Workers' }}
                  </span>
                </div>
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                  {{ liveDurations[selectedTicketForModal.id] || computeLiveDuration(selectedTicketForModal.assignment, selectedTicketForModal.overtime_hours) || 'Working' }}
                </span>
              </div>

              <!-- Workers Grid -->
              <div v-if="getAssignedWorkers(selectedTicketForModal).length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
              <div v-else class="text-xs text-slate-400 italic">
                No personnel assigned.
              </div>

              <div class="pt-2 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-300">
                <div>
                  <span class="text-[9px] text-slate-400 uppercase font-black block">Start Date</span>
                  <span class="font-bold text-white">{{ formatDate(getTicketStartTime(selectedTicketForModal)) }}</span>
                </div>
                <div>
                  <span class="text-[9px] text-slate-400 uppercase font-black block">Target Duration</span>
                  <span class="font-bold text-white">{{ selectedTicketForModal.working_days || selectedTicketForModal.assignment?.working_days || 1 }} Day(s)</span>
                </div>
                <div>
                  <span class="text-[9px] text-slate-400 uppercase font-black block">Overtime</span>
                  <span class="font-bold text-amber-300">{{ selectedTicketForModal.overtime_hours ? `${selectedTicketForModal.overtime_hours} hrs` : 'None' }}</span>
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
                      Official job request document filled with requester information, location, designated personnel, and scheduled dates.
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

            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
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

              <template v-if="selectedTicketForModal.current_step == 6 || selectedTicketForModal.status === 'resolved'">
                <button
                  type="button"
                  @click="(() => { const t = selectedTicketForModal; selectedTicketForModal = null; openReceiptModal(t); })()"
                  class="px-5 py-2.5 min-h-[40px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-xs active:scale-95 cursor-pointer touch-manipulation flex items-center justify-center gap-1.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>View Material Receipt</span>
                </button>
              </template>

              <template v-else>
                <button
                  type="button"
                  @click="(() => { const t = selectedTicketForModal; selectedTicketForModal = null; openExtensionModal(t); })()"
                  class="px-4 py-2.5 min-h-[40px] rounded-xl bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 text-xs font-black transition-colors cursor-pointer touch-manipulation flex items-center justify-center"
                >
                  Grant Extension
                </button>
                <button
                  type="button"
                  @click="(() => { const t = selectedTicketForModal; openCollabModal(t); })()"
                  class="px-4 py-2.5 min-h-[40px] rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-black transition-colors cursor-pointer touch-manipulation flex items-center justify-center gap-1.5"
                >
                  <svg class="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Unit Collaboration</span>
                </button>
                <button
                  type="button"
                  @click="(() => { const t = selectedTicketForModal; selectedTicketForModal = null; openAdjustModal(t); })()"
                  class="px-4 py-2.5 min-h-[40px] rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 text-xs font-black transition-colors cursor-pointer touch-manipulation flex items-center justify-center gap-1.5"
                >
                  <span>Adjust Materials</span>
                </button>
                <button
                  type="button"
                  @click="(() => { const t = selectedTicketForModal; selectedTicketForModal = null; openMaterialCompletionModal(t); })()"
                  :class="[
                    'px-5 py-2.5 min-h-[40px] rounded-xl text-white text-xs font-black transition-all shadow-xs active:scale-95 cursor-pointer touch-manipulation flex items-center justify-center',
                    themeAccentBg
                  ]"
                >
                  Complete Job
                </button>
              </template>
            </div>
          </div>

        </div>
      </div>
    </Teleport>

    <!-- ═══ Operational Action Modals ═══ -->
    <!-- Ticket Extension Modal -->
    <TicketExtensionModal
      :is-open="showExtensionModal"
      :ticket="ticketToExtend"
      :unit-code="unitCode"
      @close="showExtensionModal = false"
      @extended="handleTicketExtended"
    />

    <!-- Material Completion Modal -->
    <CompleteJobMaterialModal
      :is-open="showMaterialModal"
      :ticket="selectedTicketForCompletion"
      @close="showMaterialModal = false"
      @completed="handleJobCompleted"
    />

    <!-- Adjust Ongoing Materials Modal -->
    <AdjustOngoingMaterialsModal
      :is-open="showAdjustModal"
      :ticket="selectedTicketForAdjust"
      :unit-code="unitCode"
      @close="showAdjustModal = false"
      @updated="handleMaterialsAdjusted"
    />

    <!-- Material Receipt Modal -->
    <MaterialReceiptModal
      :is-open="showReceiptModal"
      :ticket="receiptTicket"
      :unit-code="unitCode"
      @close="showReceiptModal = false"
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

    <!-- Cross-Unit Collaboration Modal -->
    <CrossUnitCollaborationModal
      :is-open="showCollabModal"
      :ticket="selectedTicketForCollab"
      @close="showCollabModal = false"
      @updated="handleCollabUpdated"
    />

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/client';
import { toast } from 'vue3-toastify';
import CompleteJobMaterialModal from '@/components/CompleteJobMaterialModal.vue';
import AdjustOngoingMaterialsModal from '@/components/AdjustOngoingMaterialsModal.vue';
import MaterialReceiptModal from '@/components/MaterialReceiptModal.vue';
import TicketExtensionModal from '@/components/TicketExtensionModal.vue';
import DocumentViewerModal from '@/components/DocumentViewerModal.vue';
import CrossUnitCollaborationModal from './CrossUnitCollaborationModal.vue';
import BorrowingWorkspace from '@/components/dispatch/BorrowingWorkspace.vue';
import CollabTicketsWorkspace from '@/components/dispatch/CollabTicketsWorkspace.vue';
import { fetchCollabTickets } from '@/api/collaborations';
import { getBorrowingQueue } from '@/api/borrowing';
import { generateFgmuJobRequestFormDocxBlob } from '@/utils/fgmuDocxGenerator';
import { calculateWorkingHoursElapsed, parseDateLocal } from '@/utils/workCalendar';
import { getAssignedWorkers, getWorkerInitials } from '@/utils/ticketPersonnelHelper';

const route = useRoute();
const router = useRouter();

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

// State
const rawTickets = ref([]);
const loading = ref(false);
const activeTab = ref('in_progress'); // 'in_progress' | 'borrowed' (LEAU) | 'awaiting_rating'
const searchQuery = ref('');
const urgencyFilter = ref('all');
const selectedServiceFilter = ref('');
const currentPage = ref(1);
const pageSize = ref(10);

// LEAU borrowed-items tab (picked up + overdue), embedded between In Progress
// and Awaiting Requestor Rating. FGMU has no borrowing workflow.
const borrowedCount = ref(0);
const borrowedRefreshKey = ref(0);
const isLeauBorrowed = computed(() => String(props.unitCode || '').toUpperCase() === 'LEAU' && activeTab.value === 'borrowed');

// Collab Active tab — joint execution between FGMU and LEAU.
// Only the requesting unit can complete; counterpart dispatch is read-only here.
const collabActiveCount = ref(0);
// Live-collab ticket ids — these live ONLY in the Collab tab, never in job tabs.
const collabActiveIds = ref(new Set());
const collabActiveRefreshKey = ref(0);
const isCollabActiveTab = computed(() => activeTab.value === 'collab');

const switchTab = (tab) => {
  const next = String(tab || '');
  if (next === 'borrowed' && String(props.unitCode || '').toUpperCase() !== 'LEAU') return;
  activeTab.value = next === 'borrowed' ? 'borrowed' : next === 'collab' ? 'collab' : (next === 'awaiting_rating' ? 'awaiting_rating' : 'in_progress');
  currentPage.value = 1;
  urgencyFilter.value = 'all';
  selectedServiceFilter.value = '';
  const nextQuery = { ...route.query };
  if (activeTab.value === 'borrowed' || activeTab.value === 'collab') {
    nextQuery.tab = activeTab.value;
  } else if (['borrowed', 'overdue', 'collab'].includes(String(nextQuery.tab || ''))) {
    delete nextQuery.tab;
  }
  router.replace({ path: route.path, query: nextQuery }).catch(() => {});
  if (activeTab.value === 'borrowed') {
    borrowedRefreshKey.value += 1;
    fetchBorrowingCount();
  }
  if (activeTab.value === 'collab') {
    collabActiveRefreshKey.value += 1;
    fetchCollabActiveCount();
  }
};

const fetchCollabActiveCount = async () => {
  try {
    const res = await fetchCollabTickets({ direction: 'all', stage: 'active' });
    const list = res.data?.data?.tickets || [];
    collabActiveCount.value = res.data?.data?.count ?? list.length;
    collabActiveIds.value = new Set(
      list
        .filter(t => ['pending', 'accepted'].includes(String(t.collaboration_status || '')))
        .map(t => String(t.id))
    );
  } catch {
    collabActiveCount.value = 0;
    collabActiveIds.value = new Set();
  }
};

const onCollabActiveUpdated = async () => {
  collabActiveRefreshKey.value += 1;
  await fetchCollabActiveCount();
  await fetchActiveTickets();
};

const refreshActiveAll = async () => {
  collabActiveRefreshKey.value += 1;
  await Promise.all([fetchActiveTickets(), fetchCollabActiveCount()]);
};

const fetchBorrowingCount = async () => {
  if (String(props.unitCode || '').toUpperCase() !== 'LEAU') return;
  try {
    const res = await getBorrowingQueue({ per_page: 500 });
    const list = res.data?.data?.borrowing_requests || [];
    borrowedCount.value = list.filter(r => ['picked_up', 'overdue'].includes(String(r.status))).length;
  } catch {
    borrowedCount.value = 0;
  }
};

// Modal state
const selectedTicketForModal = ref(null);
const showExtensionModal = ref(false);
const ticketToExtend = ref(null);
const showMaterialModal = ref(false);
const selectedTicketForCompletion = ref(null);
const showAdjustModal = ref(false);
const selectedTicketForAdjust = ref(null);
const showReceiptModal = ref(false);
const receiptTicket = ref(null);
const showCollabModal = ref(false);
const selectedTicketForCollab = ref(null);

const openCollabModal = (ticket) => {
  selectedTicketForCollab.value = ticket;
  showCollabModal.value = true;
};

const handleCollabUpdated = () => {
  fetchActiveTickets();
  fetchCollabActiveCount();
};

// Collab-tab action buttons reuse this workspace's own handlers (extension,
// materials, completion, job order, collab center) so both tabs share one
// behavior. The collab row is resolved to its full ticket record first.
const resolveCollabFullTicket = async (collabTicket) => {
  const target = String(collabTicket?.id || '').toLowerCase().trim();
  const local = rawTickets.value.find(t =>
    String(t.id || t.ticketId || '').toLowerCase().trim() === target
  );
  if (local) return local;
  const res = await api.get(`tickets/${collabTicket.id}`);
  const raw = res.data?.data?.ticket || res.data?.data;
  return raw ? mapTicket(raw) : null;
};

const handleCollabAction = async ({ action, ticket } = {}) => {
  if (!ticket) return;
  let full = null;
  try {
    full = await resolveCollabFullTicket(ticket);
  } catch (err) {
    console.error('Failed to resolve collab ticket:', err);
  }
  if (!full) {
    toast.error('Failed to load ticket details.');
    return;
  }
  if (action === 'job-order') openJobOrderDocument(full);
  else if (action === 'regen') handleDirectRegenerate(full);
  else if (action === 'extend') openExtensionModal(full);
  else if (action === 'materials') openAdjustModal(full);
  else if (action === 'collab') openCollabModal(full);
  else if (action === 'complete') openMaterialCompletionModal(full);
  else if (action === 'details') openDetailsModal(full);
};

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

// Live durations tick
const liveDurations = reactive({});
let durationRefreshTimer = null;

// Unit Theme Computeds
const isLEAU = computed(() => props.unitCode?.toUpperCase() === 'LEAU');

const themeAccentBg = computed(() => {
  return isLEAU.value ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700';
});

const themeAccentShadow = computed(() => {
  return isLEAU.value ? 'shadow-amber-600/25' : 'shadow-emerald-600/25';
});

const themeRatingTabBg = computed(() => {
  return isLEAU.value ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-700 hover:bg-emerald-800';
});

const themeRatingTabShadow = computed(() => {
  return isLEAU.value ? 'shadow-amber-600/25' : 'shadow-emerald-700/25';
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

const themeElapsedBadge = computed(() => {
  return isLEAU.value
    ? 'bg-amber-50 text-amber-800 border-amber-200'
    : 'bg-emerald-50 text-emerald-800 border-emerald-200';
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

// In Progress tickets: actually started (step 5), not resolved, not closed, not archived.
// Awaiting-start tickets (step 4) live on the Scheduled page — including its
// collab tab — even though the API returns them with status 'processing'.
// Live collab tickets live ONLY in the Collab tab.
const inProgressTickets = computed(() => {
  return rawTickets.value.filter(t => {
    const isArchived = t.is_archived == 1 || t.is_archived === true || t.is_archived === '1';
    if (isArchived) return false;
    const isResolved = t.current_step == 6 || t.status === 'resolved' || t.status === 'closed';
    if (isResolved) return false;
    if (t.current_step == 4) return false;
    if (collabActiveIds.value.has(String(t.id))) return false;
    return t.current_step == 5 || t.status === 'processing';
  });
});

// Awaiting Requestor Rating tickets: step 6 / status === 'resolved', not archived
const awaitingRatingTickets = computed(() => {
  return rawTickets.value.filter(t => {
    const isArchived = t.is_archived == 1 || t.is_archived === true || t.is_archived === '1';
    if (isArchived) return false;
    return t.current_step == 6 || t.status === 'resolved' || (t.status_label || '').toLowerCase().includes('rating');
  });
});

// Active tab tickets pointer
const activeTabTickets = computed(() => {
  return activeTab.value === 'awaiting_rating' ? awaitingRatingTickets.value : inProgressTickets.value;
});

// Backward-compatibility alias
const activeTickets = computed(() => activeTabTickets.value);

const emergencyCount = computed(() => {
  return activeTabTickets.value.filter(t => !!t.is_emergency).length;
});

const uniqueServices = computed(() => {
  const set = new Set();
  activeTabTickets.value.forEach(t => {
    const s = t.service || t.type;
    if (s) set.add(s);
  });
  return Array.from(set).sort();
});

const filteredTickets = computed(() => {
  let list = activeTabTickets.value;

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

const formatNumber = (val) => {
  return Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatCompletedDate = (dateStr) => {
  if (!dateStr) return 'Recently';
  return formatDate(dateStr);
};

const openReceiptModal = (ticket) => {
  receiptTicket.value = ticket;
  showReceiptModal.value = true;
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

const getTicketStartTime = (ticket) => {
  if (!ticket) return null;
  return ticket.assignment?.dispatched_at || ticket.project_actual_start || ticket.assignment?.implementation_date || ticket.assignment?.assigned_at;
};

const computeLiveDuration = (assignment, overtimeHours = 0) => {
  if (!assignment) return null;
  const startRaw = assignment.dispatched_at || assignment.implementation_date || assignment.assigned_at;
  if (!startRaw) return null;
  const dur = calculateWorkingHoursElapsed(startRaw, new Date(), overtimeHours);
  return dur.formatted;
};

const refreshDurations = () => {
  for (const ticket of inProgressTickets.value) {
    const dur = computeLiveDuration(ticket.assignment, ticket.overtime_hours);
    if (dur) {
      liveDurations[ticket.id] = dur;
    }
  }
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
    materials: Array.isArray(t.materials) ? t.materials : [],
    total_material_cost: Number(t.total_material_cost || 0),
    is_labor_only: !!(t.is_labor_only == 1 || t.is_labor_only === true || t.is_labor_only === '1'),
    materials_stage: t.materials_stage || 'none',
  };
};

const fetchActiveTickets = async () => {
  loading.value = true;
  try {
    const res = await api.get(`/tickets/active/${props.unitCode}`);
    const rawData = res.data?.data?.tickets || res.data?.data || [];
    rawTickets.value = Array.isArray(rawData) ? rawData.map(mapTicket) : [];
    refreshDurations();
  } catch (err) {
    console.error(`Failed to load ${props.unitCode} active tickets:`, err);
    toast.error('Failed to load active tickets.');
  } finally {
    loading.value = false;
  }
};

const openDetailsModal = (ticket) => {
  selectedTicketForModal.value = ticket;
};

const openExtensionModal = (ticket) => {
  ticketToExtend.value = ticket;
  showExtensionModal.value = true;
};

const handleTicketExtended = () => {
  toast.success(`Extension granted for ticket #${ticketToExtend.value?.id}`);
  fetchActiveTickets();
};

const openMaterialCompletionModal = (ticket) => {
  selectedTicketForCompletion.value = ticket;
  showMaterialModal.value = true;
};

const openAdjustModal = (ticket) => {
  selectedTicketForAdjust.value = ticket;
  showAdjustModal.value = true;
};

const handleMaterialsAdjusted = () => {
  toast.success('Materials successfully updated for ticket #' + (selectedTicketForAdjust.value?.id || ''));
  fetchActiveTickets();
};

const handleJobCompleted = (result) => {
  const completedTicket = selectedTicketForCompletion.value;
  receiptTicket.value = {
    ...completedTicket,
    materials: result.materials || [],
    total_material_cost: result.totalCost || 0,
    completed_at: new Date().toISOString(),
    current_step: 6,
    status: 'resolved',
  };

  // Switch to Awaiting Requestor Rating tab so completed ticket is immediately visible.
  // Refresh collab ids too so the finished ticket drops out of the Collab tab.
  activeTab.value = 'awaiting_rating';
  fetchActiveTickets();
  fetchCollabActiveCount();
  showReceiptModal.value = true;
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
    fetchActiveTickets().catch(() => {});

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
  const match = rawTickets.value.find(t => {
    const idStr = String(t.id || '').toLowerCase().trim().replace(/^#/, '');
    const ticketIdStr = String(t.ticketId || '').toLowerCase().trim().replace(/^#/, '');
    return idStr === targetStr || ticketIdStr === targetStr;
  });

  if (match) {
    if (match.current_step == 6 || match.status === 'resolved' || (match.status_label || '').toLowerCase().includes('rating')) {
      activeTab.value = 'awaiting_rating';
    } else {
      activeTab.value = 'in_progress';
    }
    selectedTicketForModal.value = match;
    const idx = filteredTickets.value.findIndex(t => String(t.id) === String(match.id));
    if (idx !== -1) {
      currentPage.value = Math.floor(idx / pageSize.value) + 1;
    }
    setTimeout(() => {
      const el = document.getElementById('ticket-' + match.id) || document.getElementById('mob-ticket-' + match.id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 250);
  }
};

watch(() => [route.query.ticketId, route.query.highlight, route.query._t], () => {
  checkRouteQueryTicket();
});

watch(() => route.query.tab, (v) => {
  const t = String(v || '').toLowerCase();
  const isLeau = String(props.unitCode || '').toUpperCase() === 'LEAU';
  const next = ((t === 'borrowed' || t === 'overdue') && isLeau) ? 'borrowed' : t === 'collab' ? 'collab' : null;
  if (next && next !== activeTab.value) {
    activeTab.value = next;
    currentPage.value = 1;
    if (next === 'borrowed') {
      borrowedRefreshKey.value += 1;
      fetchBorrowingCount();
    }
    if (next === 'collab') {
      collabActiveRefreshKey.value += 1;
      fetchCollabActiveCount();
    }
  } else if (!next && (activeTab.value === 'borrowed' || activeTab.value === 'collab')) {
    activeTab.value = 'in_progress';
    currentPage.value = 1;
  }
});

onMounted(async () => {
  const q = String(route.query.tab || '').toLowerCase();
  if (String(props.unitCode || '').toUpperCase() === 'LEAU' && (q === 'borrowed' || q === 'overdue')) {
    activeTab.value = 'borrowed';
  } else if (q === 'collab') {
    activeTab.value = 'collab';
  }
  await Promise.all([fetchActiveTickets(), fetchBorrowingCount(), fetchCollabActiveCount()]);
  checkRouteQueryTicket();
  durationRefreshTimer = setInterval(refreshDurations, 60 * 1000);
});

onUnmounted(() => {
  if (durationRefreshTimer) {
    clearInterval(durationRefreshTimer);
  }
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
