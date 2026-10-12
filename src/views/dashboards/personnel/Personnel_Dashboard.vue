<template>
  <MainLayout>
    <template #header-title>
      <h2 class="text-base sm:text-xl font-black text-slate-900 tracking-tight truncate">
        My Assigned Jobs
      </h2>
    </template>

    <template #main-content>
      <div class="max-w-7xl mx-auto space-y-5 sm:space-y-6">

        <!-- Personnel Profile Banner -->
        <div class="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-5 sm:p-7 text-white shadow-xl border border-slate-800">
          <!-- Subtle decorative background rings -->
          <div class="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none"></div>
          <div class="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-teal-500/10 blur-2xl pointer-events-none"></div>

          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div class="flex items-start sm:items-center gap-4 min-w-0">
              <!-- Avatar Circle -->
              <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-black text-xl sm:text-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-900/40 border-2 border-white/20">
                {{ workerInitials }}
              </div>

              <div class="min-w-0">
                <div class="mb-1">
                  <h3 class="text-lg sm:text-2xl font-black text-white tracking-tight truncate">
                    {{ workerDisplayName }}
                  </h3>
                </div>

                <div class="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-300 font-semibold">
                  <span class="inline-flex items-center gap-1.5 text-emerald-300 font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {{ workerSpecialty }}
                  </span>
                  <span class="text-slate-500">•</span>
                  <span>{{ workerUnitName }}</span>
                </div>
              </div>
            </div>

            <!-- Header Quick Badge -->
            <div class="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 self-start md:self-auto shrink-0">
              <div class="text-right">
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-300 block">Current Workload</span>
                <span class="text-base font-black text-white leading-none">
                  {{ store.activeCount }} {{ store.activeCount === 1 ? 'Active Job' : 'Active Jobs' }}
                </span>
              </div>
              <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-black text-sm border border-emerald-400/30">
                {{ store.activeCount }}
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Summary Metric Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <!-- Active Jobs -->
          <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all">
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400">Active Jobs</span>
              <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div class="text-2xl sm:text-3xl font-black text-slate-900 leading-none">
              {{ store.activeCount }}
            </div>
            <p class="text-[11px] font-semibold text-slate-500 mt-1">Pending &amp; in-progress work</p>
          </div>

          <!-- Emergency / Urgent -->
          <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-rose-300 hover:shadow-md transition-all">
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400">Emergency</span>
              <div class="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div class="text-2xl sm:text-3xl font-black text-slate-900 leading-none" :class="{ 'text-rose-600': emergencyCount > 0 }">
              {{ emergencyCount }}
            </div>
            <p class="text-[11px] font-semibold text-slate-500 mt-1">Urgent immediate action tasks</p>
          </div>

          <!-- Team Collaborations -->
          <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all">
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400">Team Jobs</span>
              <div class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div class="text-2xl sm:text-3xl font-black text-slate-900 leading-none">
              {{ teamJobCount }}
            </div>
            <p class="text-[11px] font-semibold text-slate-500 mt-1">Multi-personnel crew tasks</p>
          </div>

          <!-- Completed History Card -->
          <router-link
            to="/personnel/history"
            class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition-all group cursor-pointer block"
          >
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400 group-hover:text-sky-600 transition-colors">Completed</span>
              <div class="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="text-2xl sm:text-3xl font-black text-slate-900 leading-none">
              {{ store.completedCount }}
            </div>
            <p class="text-[11px] font-semibold text-slate-500 mt-1 flex items-center justify-between">
              <span>Finished assignments</span>
              <span class="text-sky-600 font-bold group-hover:underline">View History &rarr;</span>
            </p>
          </router-link>
        </div>

        <!-- Filter Bar & Search Controls -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs space-y-3.5">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <!-- Search Input -->
            <div class="relative flex-1 min-w-0">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search jobs by Ticket ID, service, location, or crew member name..."
                class="w-full pl-10 pr-4 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/60 focus:bg-white transition-all"
              />
            </div>

            <!-- Refresh Button -->
            <div class="flex items-center shrink-0">
              <button
                type="button"
                @click="refreshData"
                :disabled="store.isLoading"
                class="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer active:scale-95 disabled:opacity-50 shrink-0"
                title="Refresh assignments"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-600 transition-transform" :class="{ 'animate-spin': store.isLoading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span class="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          <!-- Tab Pills -->
          <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs sm:text-sm">
            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                @click="activeTab = 'active'"
                :class="[
                  'px-4 py-2 min-h-[44px] rounded-xl font-black transition-all cursor-pointer flex items-center gap-2 touch-manipulation',
                  activeTab === 'active'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                ]"
              >
                <span>Active Jobs</span>
                <span
                  class="px-2.5 py-0.5 rounded-lg text-xs sm:text-sm font-black min-w-[24px] text-center shadow-xs transition-all"
                  :class="activeTab === 'active' ? 'bg-white text-emerald-950 font-black' : 'bg-slate-200 text-slate-800'"
                >
                  {{ store.activeCount }}
                </span>
              </button>

              <button
                type="button"
                @click="activeTab = 'emergency'"
                :class="[
                  'px-4 py-2 min-h-[44px] rounded-xl font-black transition-all cursor-pointer flex items-center gap-2 touch-manipulation',
                  activeTab === 'emergency'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                ]"
              >
                <span>Emergency / Urgent</span>
                <span
                  class="px-2.5 py-0.5 rounded-lg text-xs sm:text-sm font-black min-w-[24px] text-center shadow-xs transition-all"
                  :class="activeTab === 'emergency' ? 'bg-white text-rose-950 font-black' : 'bg-slate-200 text-slate-800'"
                >
                  {{ emergencyCount }}
                </span>
              </button>

              <button
                type="button"
                @click="activeTab = 'all'"
                :class="[
                  'px-4 py-2 min-h-[44px] rounded-xl font-black transition-all cursor-pointer flex items-center gap-2 touch-manipulation',
                  activeTab === 'all'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                ]"
              >
                <span>All Work Orders</span>
                <span
                  class="px-2.5 py-0.5 rounded-lg text-xs sm:text-sm font-black min-w-[24px] text-center shadow-xs transition-all"
                  :class="activeTab === 'all' ? 'bg-white text-slate-950 font-black' : 'bg-slate-200 text-slate-800'"
                >
                  {{ store.totalCount }}
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State Skeleton -->
        <div v-if="store.isLoading" class="space-y-3.5">
          <div v-for="i in 4" :key="i" class="p-5 rounded-2xl bg-white border border-slate-200/80 animate-pulse space-y-3">
            <div class="flex items-center justify-between">
              <div class="h-4 bg-slate-200 rounded w-28"></div>
              <div class="h-5 bg-slate-200 rounded-full w-20"></div>
            </div>
            <div class="h-5 bg-slate-200 rounded w-1/2"></div>
            <div class="h-4 bg-slate-200 rounded w-3/4"></div>
            <div class="h-4 bg-slate-200 rounded w-1/3"></div>
          </div>
        </div>

        <!-- Error State Banner -->
        <div
          v-else-if="store.errorMessage"
          class="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-rose-50 border border-rose-200 text-rose-900 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-3xl mx-auto"
        >
          <div class="flex items-start gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h4 class="text-sm font-black text-rose-950">Unable to load assigned jobs</h4>
              <p class="text-xs text-rose-700 mt-1 leading-relaxed">{{ store.errorMessage }}</p>
            </div>
          </div>
          <button
            type="button"
            @click="refreshData"
            class="px-4 py-2 min-h-[40px] rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-black transition-all shadow-xs shrink-0 cursor-pointer"
          >
            Retry Loading
          </button>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="filteredAssignments.length === 0"
          class="py-16 px-6 text-center bg-white rounded-3xl border border-dashed border-slate-200 max-w-2xl mx-auto shadow-xs"
        >
          <div class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 class="text-base font-black text-slate-800">No Assigned Jobs Found</h4>
          <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
            {{ searchQuery ? 'No jobs match your search filters. Try adjusting your search query.' : 'You currently have no tickets matching this status tab. New dispatches from the Unit Head will appear here automatically.' }}
          </p>
          <button
            v-if="searchQuery"
            type="button"
            @click="searchQuery = ''; currentPage = 1"
            class="mt-4 px-4 py-2 rounded-xl text-xs font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer min-h-[44px]"
          >
            Clear Search Filter
          </button>
        </div>

        <!-- Assigned Tasks Content (Administrative Layout & Pagination) -->
        <div v-else class="space-y-4">
          <!-- ═══ DESKTOP TABULAR VIEW (Matching Administrative Dashboards) ═══ -->
          <div class="hidden md:block bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50 border-b border-slate-200">
                    <th class="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Ticket Ref</th>
                    <th class="px-3 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Requester / Client</th>
                    <th class="px-3 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Location</th>
                    <th class="px-3 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Task / Service</th>
                    <th class="px-3 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Schedule &amp; Team</th>
                    <th class="px-3 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Status</th>
                    <th class="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 border-b border-slate-200 text-xs">
                  <tr
                    v-for="ticket in paginatedAssignments"
                    :key="ticket.assignment_id || ticket.ticket_id"
                    :id="'ticket-' + ticket.ticket_id"
                    class="hover:bg-emerald-50/50 hover:shadow-xs transition-all duration-150 group cursor-pointer relative"
                    @click="openTicketDetails(ticket)"
                  >
                    <!-- Ticket Reference with Left Accent Line -->
                    <td class="px-4 py-3 whitespace-nowrap relative">
                      <span class="absolute left-0 top-2 bottom-2 w-1 rounded-r-sm bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150"></span>
                      <div class="relative inline-flex items-center gap-1.5 flex-wrap">
                        <div class="text-sm font-black px-2.5 py-1 rounded-lg border bg-slate-100 text-slate-800 border-slate-200 group-hover:bg-slate-200/90 group-hover:border-slate-300 transition-all duration-150 shadow-2xs tabular-nums">
                          #{{ ticket.ticket_id }}
                        </div>
                        <span
                          v-if="ticket.is_emergency"
                          class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[9px] font-black uppercase tracking-wider border border-rose-200 flex items-center gap-0.5 shadow-2xs animate-pulse"
                        >
                          <span>🔥</span> Urgent
                        </span>
                        <span class="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[9px] font-black uppercase tracking-wider">
                          {{ ticket.unit_code }}
                        </span>
                        <span
                          v-if="ticket.is_project && ticket.project_title"
                          class="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-black uppercase tracking-wider truncate max-w-[120px]"
                          :title="ticket.project_title"
                        >
                          📁 {{ ticket.project_title }}
                        </span>
                      </div>
                    </td>

                    <!-- Requester / Client -->
                    <td class="px-3 py-3">
                      <div class="flex items-center gap-2">
                        <div class="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {{ getMemberInitials(ticket.requestor_name) }}
                        </div>
                        <div class="min-w-0">
                          <span class="text-xs font-semibold text-slate-800 truncate block max-w-[130px]">{{ ticket.requestor_name }}</span>
                          <span v-if="ticket.requestor_contact" class="text-[10px] text-slate-400 block">{{ ticket.requestor_contact }}</span>
                        </div>
                      </div>
                    </td>

                    <!-- Location -->
                    <td class="px-3 py-3 whitespace-nowrap">
                      <div class="text-xs font-semibold text-slate-700">{{ ticket.location }}</div>
                      <div class="text-[10px] text-slate-400">{{ ticket.office_room ? `Rm ${ticket.office_room}` : 'General Area' }}</div>
                    </td>

                    <!-- Task / Service -->
                    <td class="px-3 py-3">
                      <div class="min-w-0 max-w-xs space-y-0.5">
                        <div class="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                          {{ ticket.service_type }}
                        </div>
                        <div class="text-[11px] text-slate-500 line-clamp-1">
                          {{ ticket.description }}
                        </div>
                        <div v-if="ticket.dispatcher_notes || ticket.task_notes" class="inline-flex items-center gap-1 text-[10px] text-amber-800 font-medium bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 truncate max-w-full">
                          <span class="text-amber-600 font-bold shrink-0">📝</span>
                          <span class="truncate">{{ ticket.dispatcher_notes || ticket.task_notes }}</span>
                        </div>
                      </div>
                    </td>

                    <!-- Schedule & Team -->
                    <td class="px-3 py-3 whitespace-nowrap">
                      <div class="text-xs font-bold text-slate-800">
                        {{ formatDate(ticket.implementation_date || ticket.target_completion_date) }}
                      </div>
                      <div class="mt-0.5">
                        <span
                          :class="[
                            'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold',
                            ticket.team_count > 1 ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-100 text-slate-600'
                          ]"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {{ ticket.team_count > 1 ? `Joint Crew (${ticket.team_count})` : 'Solo' }}
                        </span>
                      </div>
                    </td>

                    <!-- Status -->
                    <td class="px-3 py-3 whitespace-nowrap">
                      <span
                        :class="[
                          'px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0',
                          ticket.completed_at
                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : ticket.ticket_status === 'in_progress'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        ]"
                      >
                        {{ ticket.completed_at ? 'Completed' : (ticket.status_label || ticket.ticket_status) }}
                      </span>
                    </td>

                    <!-- Actions Column with Full Info Button -->
                    <td class="px-4 py-3 whitespace-nowrap text-right" @click.stop>
                      <button
                        type="button"
                        @click="openTicketDetails(ticket)"
                        class="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                        title="View Full Task Information"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>Full Info</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Desktop Pagination Bar -->
            <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div class="flex items-center gap-3">
                <div>
                  Showing <strong class="text-slate-800">{{ paginationRange.start }}</strong> to <strong class="text-slate-800">{{ paginationRange.end }}</strong> of <strong class="text-slate-800">{{ filteredAssignments.length }}</strong> tasks
                </div>
                <div class="flex items-center gap-1.5 ml-2 border-l border-slate-200 pl-3">
                  <span class="text-slate-400">Per page:</span>
                  <select
                    v-model.number="perPage"
                    @change="currentPage = 1"
                    class="px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option :value="5">5</option>
                    <option :value="10">10</option>
                    <option :value="20">20</option>
                  </select>
                </div>
              </div>

              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  @click="changePage(1)"
                  :disabled="currentPage === 1"
                  class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold cursor-pointer transition-colors"
                  title="First Page"
                >
                  «
                </button>
                <button
                  type="button"
                  @click="changePage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold cursor-pointer transition-colors"
                >
                  ‹ Prev
                </button>

                <div class="flex items-center gap-1">
                  <button
                    v-for="page in displayedPages"
                    :key="page"
                    type="button"
                    @click="changePage(page)"
                    class="px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer"
                    :class="currentPage === page ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs font-black' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'"
                  >
                    {{ page }}
                  </button>
                </div>

                <button
                  type="button"
                  @click="changePage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold cursor-pointer transition-colors"
                >
                  Next ›
                </button>
                <button
                  type="button"
                  @click="changePage(totalPages)"
                  :disabled="currentPage === totalPages"
                  class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold cursor-pointer transition-colors"
                  title="Last Page"
                >
                  »
                </button>
              </div>
            </div>
          </div>

          <!-- ═══ MOBILE CARDS VIEW (Matching Administrative Dashboards) ═══ -->
          <div class="md:hidden space-y-3.5">
            <div
              v-for="ticket in paginatedAssignments"
              :key="'mob-' + (ticket.assignment_id || ticket.ticket_id)"
              :id="'mob-ticket-' + ticket.ticket_id"
              @click="openTicketDetails(ticket)"
              class="group relative bg-white border border-slate-200/90 hover:border-emerald-400 rounded-2xl p-4 transition-all duration-200 hover:shadow-md cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-emerald-500/30 touch-manipulation"
            >
              <!-- Accent bar -->
              <div
                class="absolute left-0 inset-y-0 w-1.5 rounded-l-2xl"
                :class="getTicketAccentClass(ticket)"
              ></div>

              <div class="pl-2 space-y-3">
                <!-- Top Row: ID, Badges, Status -->
                <div class="flex items-center justify-between gap-2 flex-wrap">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="px-2.5 py-1 rounded-lg text-xs font-black font-mono bg-slate-100 text-slate-800 border border-slate-200">
                      #{{ ticket.ticket_id }}
                    </span>
                    <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                      {{ ticket.unit_code }}
                    </span>
                    <span
                      v-if="ticket.is_emergency"
                      class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white flex items-center gap-1 shadow-xs animate-pulse"
                    >
                      <span>🔥</span> Urgent
                    </span>
                    <span
                      v-if="ticket.is_project && ticket.project_title"
                      class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 truncate max-w-[150px]"
                    >
                      📁 {{ ticket.project_title }}
                    </span>
                  </div>

                  <span
                    :class="[
                      'px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0',
                      ticket.completed_at
                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : ticket.ticket_status === 'in_progress'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    ]"
                  >
                    {{ ticket.completed_at ? 'Completed' : (ticket.status_label || ticket.ticket_status) }}
                  </span>
                </div>

                <!-- Service & Description -->
                <div class="space-y-1">
                  <h4 class="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {{ ticket.service_type }}
                  </h4>
                  <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {{ ticket.description }}
                  </p>
                </div>

                <!-- Dispatcher Note Indicator -->
                <div v-if="ticket.dispatcher_notes || ticket.task_notes" class="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
                  <span class="text-amber-500 font-bold shrink-0">📝</span>
                  <div class="min-w-0">
                    <span class="font-black text-amber-950 uppercase tracking-wider text-[10px] mr-1">Note:</span>
                    <span class="font-medium leading-relaxed">{{ ticket.dispatcher_notes || ticket.task_notes }}</span>
                  </div>
                </div>

                <!-- Meta Info Grid -->
                <div class="pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div>
                    <span class="text-[10px] font-bold text-slate-400 block uppercase">Location</span>
                    <span class="font-semibold text-slate-800 truncate block">{{ ticket.location }} ({{ ticket.office_room }})</span>
                  </div>
                  <div>
                    <span class="text-[10px] font-bold text-slate-400 block uppercase">Schedule</span>
                    <span class="font-semibold text-slate-800 truncate block">{{ formatDate(ticket.implementation_date || ticket.target_completion_date) }}</span>
                  </div>
                  <div>
                    <span class="text-[10px] font-bold text-slate-400 block uppercase">Client</span>
                    <span class="font-semibold text-slate-800 truncate block">{{ ticket.requestor_name }}</span>
                  </div>
                  <div>
                    <span class="text-[10px] font-bold text-slate-400 block uppercase">Crew</span>
                    <span class="font-semibold text-slate-800 truncate block">{{ ticket.team_count > 1 ? `Joint (${ticket.team_count})` : 'Solo' }}</span>
                  </div>
                </div>

                <!-- Action Row with Full Info Button -->
                <div class="pt-2 border-t border-slate-100 flex items-center justify-end" @click.stop>
                  <button
                    type="button"
                    @click="openTicketDetails(ticket)"
                    class="w-full px-4 py-2 min-h-[38px] rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-95 touch-manipulation"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>Full Info</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Mobile Pagination Bar -->
            <div class="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col gap-3 text-xs text-slate-500 shadow-xs">
              <div class="flex items-center justify-between font-medium">
                <div>
                  Showing <strong class="text-slate-800">{{ paginationRange.start }}</strong> to <strong class="text-slate-800">{{ paginationRange.end }}</strong> of <strong class="text-slate-800">{{ filteredAssignments.length }}</strong>
                </div>
                <div class="flex items-center gap-1">
                  <span class="text-slate-400">Rows:</span>
                  <select
                    v-model.number="perPage"
                    @change="currentPage = 1"
                    class="px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-bold"
                  >
                    <option :value="5">5</option>
                    <option :value="10">10</option>
                    <option :value="20">20</option>
                  </select>
                </div>
              </div>

              <div class="flex items-center justify-between gap-2">
                <button
                  type="button"
                  @click="changePage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="flex-1 py-2 min-h-[40px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold touch-manipulation flex items-center justify-center cursor-pointer"
                >
                  ‹ Prev
                </button>
                <span class="px-3 py-2 font-bold text-slate-700 min-w-[70px] text-center">
                  {{ currentPage }} / {{ totalPages }}
                </span>
                <button
                  type="button"
                  @click="changePage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="flex-1 py-2 min-h-[40px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold touch-manipulation flex items-center justify-center cursor-pointer"
                >
                  Next ›
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- ======================================================== -->
      <!-- TICKET & TEAM DETAILS MODAL                              -->
      <!-- ======================================================== -->
      <Teleport to="body">
        <div
          v-if="selectedTicket"
          class="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto pointer-events-auto"
          @click.self="selectedTicket = null"
        >
          <div
            class="pointer-events-auto bg-white rounded-3xl w-full max-w-2xl p-5 sm:p-7 shadow-2xl border border-slate-100 animate-scale-up my-auto max-h-[92vh] overflow-y-auto custom-scrollbar space-y-5"
          >
            <!-- Modal Header -->
            <div class="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2 mb-1.5">
                  <span class="px-2.5 py-0.5 rounded-lg text-xs font-black font-mono bg-slate-100 text-slate-800 border border-slate-200">
                    #{{ selectedTicket.ticket_id }}
                  </span>
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                    {{ selectedTicket.unit_code }}
                  </span>
                  <span
                    :class="[
                      'px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border',
                      selectedTicket.completed_at
                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : selectedTicket.ticket_status === 'in_progress'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    ]"
                  >
                    {{ selectedTicket.completed_at ? 'Completed' : (selectedTicket.status_label || selectedTicket.ticket_status) }}
                  </span>
                  <span v-if="selectedTicket.is_emergency" class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white flex items-center gap-1">
                    🔥 Urgent
                  </span>
                  <span v-if="selectedTicket.is_project && selectedTicket.project_title" class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 truncate max-w-[200px]">
                    📁 {{ selectedTicket.project_title }}
                  </span>
                </div>
                <h3 class="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                  {{ selectedTicket.service_type }}
                </h3>
              </div>

              <button
                type="button"
                @click="selectedTicket = null"
                class="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer shrink-0 touch-manipulation"
                title="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Job Information Breakdown -->
            <div class="space-y-4">
              <!-- Description -->
              <div class="space-y-1">
                <label class="text-[10px] font-black uppercase tracking-wider text-slate-400">Request Description</label>
                <p class="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  {{ selectedTicket.description }}
                </p>
              </div>

              <!-- Location & Schedule Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
                  <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Work Location</span>
                  <span class="font-bold text-slate-800 block text-sm">{{ selectedTicket.location }}</span>
                  <span class="text-slate-500">Room / Office: <strong>{{ selectedTicket.office_room }}</strong></span>
                </div>

                <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
                  <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Schedule &amp; Target</span>
                  <span class="font-bold text-slate-800 block text-sm">
                    {{ formatDate(selectedTicket.implementation_date || selectedTicket.target_completion_date) }}
                  </span>
                  <span class="text-slate-500">Estimated Duration: <strong>{{ selectedTicket.working_days }} working days</strong></span>
                </div>
              </div>

              <!-- Requestor Contact Info -->
              <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Requesting Client</span>
                  <span class="font-bold text-slate-800 text-sm">{{ selectedTicket.requestor_name }}</span>
                </div>
                <div v-if="selectedTicket.requestor_contact" class="text-right">
                  <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Contact Number</span>
                  <a :href="'tel:' + selectedTicket.requestor_contact" class="font-bold text-emerald-700 hover:underline">
                    📞 {{ selectedTicket.requestor_contact }}
                  </a>
                </div>
              </div>

              <!-- Dispatcher Direct Instructions -->
              <div v-if="selectedTicket.dispatcher_notes || selectedTicket.task_notes" class="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <span class="text-[10px] font-black uppercase tracking-wider text-amber-950 block">Dispatcher Instructions &amp; Task Notes:</span>
                <p class="font-medium leading-relaxed">{{ selectedTicket.dispatcher_notes || selectedTicket.task_notes }}</p>
              </div>

              <!-- ======================================================== -->
              <!-- FULL TEAM / CREW SECTION IN DETAIL MODAL                -->
              <!-- ======================================================== -->
              <div class="space-y-2 pt-2">
                <div class="flex items-center justify-between">
                  <h4 class="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Full Assigned Team for this Job ({{ selectedTicket.team_count }} Staff)
                  </h4>
                  <span class="text-[11px] font-bold text-slate-500">Unit: {{ selectedTicket.unit_name }}</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div
                    v-for="member in selectedTicket.team"
                    :key="member.personnel_id || member.assignment_id"
                    :class="[
                      'p-3 rounded-2xl border flex items-start gap-3 transition-all',
                      member.is_you
                        ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-white border-slate-200 shadow-2xs'
                    ]"
                  >
                    <!-- Initials circle -->
                    <div
                      :class="[
                        'w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0',
                        member.is_you ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                      ]"
                    >
                      {{ getMemberInitials(member.personnel_name) }}
                    </div>

                    <div class="min-w-0 flex-1 leading-tight text-xs space-y-0.5">
                      <div class="flex items-center justify-between gap-1">
                        <span class="font-black text-slate-900 truncate">
                          {{ member.personnel_name }}
                        </span>
                        <span v-if="member.is_you" class="px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[9px] font-black uppercase">
                          YOU
                        </span>
                      </div>
                      <span class="text-[11px] font-bold text-slate-500 block truncate">
                        {{ member.specialty || 'Responding Staff' }}
                      </span>
                      <span class="text-[10px] text-slate-400 block truncate">
                        {{ member.unit_code ? `Unit: ${member.unit_code}` : '' }}
                      </span>
                      <p v-if="member.task_notes" class="text-[10px] text-amber-700 font-semibold italic mt-1 pt-1 border-t border-slate-100">
                        Task: {{ member.task_notes }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                @click="selectedTicket = null"
                class="px-5 py-2.5 min-h-[44px] rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all shadow-xs cursor-pointer touch-manipulation"
              >
                Close Task Info
              </button>
            </div>
          </div>
        </div>
      </Teleport>

    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import { usePersonnelDashboardStore } from '@/stores/personnelDashboard';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const store = usePersonnelDashboardStore();
const authStore = useAuthStore();

const searchQuery = ref('');
const activeTab = ref('active'); // 'active' | 'emergency' | 'all'
const selectedTicket = ref(null);

// Pagination State
const currentPage = ref(1);
const perPage = ref(10);

const loadDashboard = async () => {
  try {
    const qPid = route.query.personnel_id ? String(route.query.personnel_id).trim() : null;
    await store.fetchDashboard(qPid);
  } catch (_) {
    // Handled by store.errorMessage
  }
};

onMounted(async () => {
  await loadDashboard();
});

const refreshData = async () => {
  await loadDashboard();
};

const workerDisplayName = computed(() => {
  if (store.personnel?.name) return store.personnel.name;
  return authStore.fullName || 'Responding Personnel';
});

const workerSpecialty = computed(() => {
  return store.personnel?.specialty || 'Field Operations Specialist';
});

const workerStatus = computed(() => {
  const s = store.personnel?.status || 'available';
  if (s === 'working') return 'Working';
  if (s === 'on_leave') return 'On Leave';
  return 'Available';
});

const workerUnitName = computed(() => {
  // 1. Explicit unit_name from store.personnel
  if (store.personnel?.unit_name) {
    const code = store.personnel.unit_code ? ` (${store.personnel.unit_code})` : '';
    return store.personnel.unit_name.includes('(') ? store.personnel.unit_name : `${store.personnel.unit_name}${code}`;
  }

  // 2. Explicit unit_code from store.personnel or authStore
  const code = String(store.personnel?.unit_code || authStore.user?.unit_code || '').toUpperCase().trim();
  if (code === 'FGMU') return 'Facilities & Grounds Management Unit (FGMU)';
  if (code === 'LEAU') return 'Landscaping & Environmental Aesthetics Unit (LEAU)';
  if (code === 'SSU') return 'Security Services Unit (SSU)';

  // 3. Numeric or string unit_id from personnel or authStore
  const rawId = store.personnel?.unit_id ?? authStore.unitId ?? authStore.user?.unit_id;
  const uId = rawId !== null && rawId !== undefined && rawId !== '' ? Number(rawId) : null;
  if (uId === 1) return 'Facilities & Grounds Management Unit (FGMU)';
  if (uId === 2) return 'Landscaping & Environmental Aesthetics Unit (LEAU)';
  if (uId === 3) return 'Security Services Unit (SSU)';

  // 4. Fallback to assigned tickets unit info
  if (store.assignments?.length > 0) {
    const firstTicket = store.assignments[0];
    if (firstTicket.unit_name) {
      const uCode = firstTicket.unit_code ? ` (${firstTicket.unit_code})` : '';
      return firstTicket.unit_name.includes('(') ? firstTicket.unit_name : `${firstTicket.unit_name}${uCode}`;
    }
    if (firstTicket.unit_code) {
      const tCode = String(firstTicket.unit_code).toUpperCase().trim();
      if (tCode === 'FGMU') return 'Facilities & Grounds Management Unit (FGMU)';
      if (tCode === 'LEAU') return 'Landscaping & Environmental Aesthetics Unit (LEAU)';
      if (tCode === 'SSU') return 'Security Services Unit (SSU)';
    }
  }

  // 5. Default sub-unit fallback (FGMU is the primary operational sub-unit)
  return 'Facilities & Grounds Management Unit (FGMU)';
});

const workerInitials = computed(() => {
  const name = workerDisplayName.value.trim();
  if (!name) return 'GP';
  const parts = name.split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
});

const isJobCompleted = (a) => {
  if (!a) return false;
  if (a.completed_at && typeof a.completed_at === 'string' && !a.completed_at.startsWith('0000-00-00') && a.completed_at.trim()) {
    return true;
  }
  const s = String(a.ticket_status || a.assignment_status || '').toLowerCase().trim();
  return ['completed', 'resolved', 'closed', 'cancelled'].includes(s);
};

const emergencyCount = computed(() => {
  return store.assignments.filter(a => !isJobCompleted(a) && a.is_emergency === 1).length;
});

const teamJobCount = computed(() => {
  return store.assignments.filter(a => !isJobCompleted(a) && a.team_count > 1).length;
});

const filteredAssignments = computed(() => {
  let list = store.assignments;

  // 1. Tab filter
  if (activeTab.value === 'active') {
    list = list.filter(a => !isJobCompleted(a));
  } else if (activeTab.value === 'emergency') {
    list = list.filter(a => a.is_emergency === 1 && !isJobCompleted(a));
  }

  // 2. Search query filter
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(a => {
      const matchId = String(a.ticket_id || '').toLowerCase().includes(q);
      const matchService = String(a.service_type || '').toLowerCase().includes(q);
      const matchLoc = String(a.location || '').toLowerCase().includes(q) || String(a.office_room || '').toLowerCase().includes(q);
      const matchDesc = String(a.description || '').toLowerCase().includes(q);
      const matchReq = String(a.requestor_name || '').toLowerCase().includes(q);
      const matchTeam = Array.isArray(a.team) && a.team.some(m => String(m.personnel_name || '').toLowerCase().includes(q));
      return matchId || matchService || matchLoc || matchDesc || matchReq || matchTeam;
    });
  }

  // 3. Automatic Sorting: Emergency on top, nearest implementation date from top to bottom
  return [...list].sort((a, b) => {
    // 1st Priority: Emergency priority on top
    const emergA = Number(a.is_emergency) ? 1 : 0;
    const emergB = Number(b.is_emergency) ? 1 : 0;
    if (emergB !== emergA) {
      return emergB - emergA;
    }

    // 2nd Priority: Nearest implementation date from top to bottom (ascending)
    const rawDateA = String(a.implementation_date || a.target_completion_date || '').trim();
    const rawDateB = String(b.implementation_date || b.target_completion_date || '').trim();

    if (rawDateA && rawDateB) {
      const timeA = new Date(rawDateA).getTime();
      const timeB = new Date(rawDateB).getTime();
      if (!isNaN(timeA) && !isNaN(timeB)) {
        if (timeA !== timeB) return timeA - timeB;
      } else {
        const cmp = rawDateA.localeCompare(rawDateB);
        if (cmp !== 0) return cmp;
      }
    } else if (rawDateA && !rawDateB) {
      return -1; // Scheduled dates appear before unscheduled
    } else if (!rawDateA && rawDateB) {
      return 1;
    }

    // 3rd Priority: Fallback to newest assignment ID
    const idA = Number(a.assignment_id || a.ticket_id || 0);
    const idB = Number(b.assignment_id || b.ticket_id || 0);
    return idB - idA;
  });
});

// Pagination Computeds
const totalPages = computed(() => {
  return Math.ceil(filteredAssignments.value.length / perPage.value) || 1;
});

const paginatedAssignments = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return filteredAssignments.value.slice(start, start + perPage.value);
});

const paginationRange = computed(() => {
  const total = filteredAssignments.value.length;
  if (total === 0) return { start: 0, end: 0 };
  const start = (currentPage.value - 1) * perPage.value + 1;
  const end = Math.min(currentPage.value * perPage.value, total);
  return { start, end };
});

const displayedPages = computed(() => {
  const pages = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage.value - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1);
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Reset page when filter inputs change
watch([searchQuery, activeTab], () => {
  currentPage.value = 1;
});

const getMemberInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'Pending Schedule';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

const openTicketDetails = (ticket) => {
  selectedTicket.value = ticket;
};

const getTicketAccentClass = (ticket) => {
  if (ticket.is_emergency) return 'bg-rose-500';
  if (ticket.completed_at) return 'bg-sky-500';
  if (ticket.ticket_status === 'in_progress') return 'bg-amber-500';
  return 'bg-emerald-500';
};
</script>
