<template>
  <MainLayout>
    <template #header-title>
      <h2 class="text-base sm:text-xl font-black text-slate-900 tracking-tight truncate">
        My Assigned Jobs
      </h2>
    </template>

    <template #header-actions>
      <button
        type="button"
        @click="refreshData"
        :disabled="store.isLoading"
        class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-all cursor-pointer min-h-[44px] active:scale-95 disabled:opacity-50"
        title="Refresh assignments"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 text-slate-600 transition-transform"
          :class="{ 'animate-spin': store.isLoading }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span class="hidden sm:inline">Refresh</span>
      </button>
    </template>

    <template #default>
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
                <div class="flex flex-wrap items-center gap-2 mb-1">
                  <h3 class="text-lg sm:text-2xl font-black text-white tracking-tight truncate">
                    {{ workerDisplayName }}
                  </h3>
                  <!-- Status Pill -->
                  <span
                    :class="[
                      'px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-xs',
                      workerStatus === 'Available'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                        : workerStatus === 'Working'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-400/40'
                    ]"
                  >
                    {{ workerStatus }}
                  </span>
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
                  <span class="text-slate-500 hidden sm:inline">•</span>
                  <span class="inline-flex items-center gap-1 text-[11px] text-teal-300/90 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Mobile Device Access
                  </span>
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

          <!-- Completed History -->
          <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition-all">
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400">Completed</span>
              <div class="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="text-2xl sm:text-3xl font-black text-slate-900 leading-none">
              {{ store.completedCount }}
            </div>
            <p class="text-[11px] font-semibold text-slate-500 mt-1">Finished assignments log</p>
          </div>
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

            <!-- Sort By Dropdown -->
            <div class="flex items-center gap-2 shrink-0">
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 shrink-0">Sort By:</label>
              <select
                v-model="sortBy"
                class="px-3 py-2 min-h-[44px] rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="newest">Recently Assigned</option>
                <option value="date">Implementation Date</option>
                <option value="emergency">Emergency Priority First</option>
              </select>
            </div>
          </div>

          <!-- Tab Pills -->
          <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <button
              type="button"
              @click="activeTab = 'active'"
              :class="[
                'px-4 py-2 min-h-[38px] rounded-xl font-black transition-all cursor-pointer flex items-center gap-1.5 touch-manipulation',
                activeTab === 'active'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              ]"
            >
              <span>Active Jobs</span>
              <span class="px-1.5 py-0.2 rounded-full text-[10px]" :class="activeTab === 'active' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'">
                {{ store.activeCount }}
              </span>
            </button>

            <button
              type="button"
              @click="activeTab = 'emergency'"
              :class="[
                'px-4 py-2 min-h-[38px] rounded-xl font-black transition-all cursor-pointer flex items-center gap-1.5 touch-manipulation',
                activeTab === 'emergency'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              ]"
            >
              <span>Emergency / Urgent</span>
              <span class="px-1.5 py-0.2 rounded-full text-[10px]" :class="activeTab === 'emergency' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'">
                {{ emergencyCount }}
              </span>
            </button>

            <button
              type="button"
              @click="activeTab = 'completed'"
              :class="[
                'px-4 py-2 min-h-[38px] rounded-xl font-black transition-all cursor-pointer flex items-center gap-1.5 touch-manipulation',
                activeTab === 'completed'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              ]"
            >
              <span>Completed History</span>
              <span class="px-1.5 py-0.2 rounded-full text-[10px]" :class="activeTab === 'completed' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'">
                {{ store.completedCount }}
              </span>
            </button>

            <button
              type="button"
              @click="activeTab = 'all'"
              :class="[
                'px-4 py-2 min-h-[38px] rounded-xl font-black transition-all cursor-pointer flex items-center gap-1.5 touch-manipulation',
                activeTab === 'all'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              ]"
            >
              <span>All Work Orders</span>
              <span class="px-1.5 py-0.2 rounded-full text-[10px]" :class="activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'">
                {{ store.totalCount }}
              </span>
            </button>
          </div>
        </div>

        <!-- Loading State Skeleton -->
        <div v-if="store.isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <div v-for="i in 4" :key="i" class="p-6 rounded-3xl bg-white border border-slate-200/80 animate-pulse space-y-4">
            <div class="flex items-center justify-between">
              <div class="h-4 bg-slate-200 rounded w-28"></div>
              <div class="h-5 bg-slate-200 rounded-full w-20"></div>
            </div>
            <div class="h-5 bg-slate-200 rounded w-3/4"></div>
            <div class="h-4 bg-slate-200 rounded w-1/2"></div>
            <div class="h-20 bg-slate-100 rounded-2xl"></div>
          </div>
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
            @click="searchQuery = ''"
            class="mt-4 px-4 py-2 rounded-xl text-xs font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer min-h-[44px]"
          >
            Clear Search Filter
          </button>
        </div>

        <!-- Assigned Tickets Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div
            v-for="ticket in filteredAssignments"
            :key="ticket.assignment_id || ticket.ticket_id"
            class="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between gap-4 group relative"
          >
            <!-- Card Header: ID, Badges, Status -->
            <div class="space-y-3">
              <div class="flex items-start justify-between gap-2 flex-wrap">
                <div class="flex items-center gap-2">
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
                    <span>🔥</span> EMERGENCY
                  </span>
                </div>

                <!-- Status Badge -->
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
              </div>

              <!-- Service Type / Title -->
              <div>
                <h4 class="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                  {{ ticket.service_type }}
                </h4>
                <p v-if="ticket.is_project && ticket.project_title" class="text-xs font-bold text-amber-600 mt-0.5">
                  📁 {{ ticket.project_title }}
                </p>
              </div>

              <!-- Request Details Preview -->
              <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
                {{ ticket.description }}
              </p>

              <!-- Essential Metadata Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <!-- Location -->
                <div class="flex items-center gap-2 text-slate-700 min-w-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="truncate font-bold" :title="ticket.location + ' - ' + ticket.office_room">
                    {{ ticket.location }} <span class="text-slate-400">({{ ticket.office_room }})</span>
                  </span>
                </div>

                <!-- Implementation Date -->
                <div class="flex items-center gap-2 text-slate-700 min-w-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="truncate font-bold">
                    Schedule: {{ formatDate(ticket.implementation_date || ticket.target_completion_date) }}
                  </span>
                </div>
              </div>

              <!-- Dispatcher Notes Alert (if present) -->
              <div v-if="ticket.dispatcher_notes || ticket.task_notes" class="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
                <span class="text-amber-500 font-bold shrink-0">📝</span>
                <div class="min-w-0">
                  <span class="font-black text-amber-950 uppercase tracking-wider text-[10px] block">Dispatcher Note:</span>
                  <span class="font-medium leading-relaxed">{{ ticket.dispatcher_notes || ticket.task_notes }}</span>
                </div>
              </div>

              <!-- ======================================================== -->
              <!-- FEATURED REQUIREMENT: WHO ARE HIS TEAM FOR THAT JOB      -->
              <!-- ======================================================== -->
              <div class="mt-4 pt-3.5 border-t border-slate-100">
                <div class="flex items-center justify-between mb-2.5">
                  <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Assigned Team / Work Crew ({{ ticket.team_count }})
                  </span>
                  <span
                    :class="[
                      'px-2 py-0.5 rounded text-[10px] font-bold',
                      ticket.team_count > 1 ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'
                    ]"
                  >
                    {{ ticket.team_count > 1 ? 'Joint Crew' : 'Solo Responder' }}
                  </span>
                </div>

                <!-- Solo assignment notice -->
                <div v-if="ticket.team_count <= 1" class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
                    {{ workerInitials }}
                  </div>
                  <div class="min-w-0 text-xs">
                    <span class="font-bold text-slate-800 block truncate">{{ workerDisplayName }} (You)</span>
                    <span class="text-[11px] text-slate-500 truncate block">Solo Responder for this job</span>
                  </div>
                </div>

                <!-- Multi-personnel team cards list -->
                <div v-else class="space-y-1.5 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
                  <div
                    v-for="member in ticket.team"
                    :key="member.personnel_id || member.assignment_id"
                    :class="[
                      'p-2 rounded-xl border flex items-center justify-between gap-2.5 text-xs transition-colors',
                      member.is_you
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-semibold'
                        : 'bg-slate-50 border-slate-200/80 text-slate-800'
                    ]"
                  >
                    <div class="flex items-center gap-2 min-w-0">
                      <!-- Initials avatar -->
                      <div
                        :class="[
                          'w-7 h-7 rounded-lg flex items-center justify-center font-black text-[10px] shrink-0',
                          member.is_you ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                        ]"
                      >
                        {{ getMemberInitials(member.personnel_name) }}
                      </div>
                      <div class="min-w-0 leading-tight">
                        <span class="font-bold truncate block">
                          {{ member.personnel_name }}
                          <span v-if="member.is_you" class="text-emerald-700 font-black text-[10px] ml-1">(You)</span>
                        </span>
                        <span class="text-[10px] text-slate-500 truncate block">
                          {{ member.specialty || 'Responding Staff' }}
                        </span>
                      </div>
                    </div>

                    <!-- Member Status / Sub-unit Tag -->
                    <div class="shrink-0 text-right">
                      <span class="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                        {{ member.unit_code || ticket.unit_code }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card Actions Footer -->
            <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <span class="text-[11px] text-slate-400 font-semibold">
                Client: <strong class="text-slate-600">{{ ticket.requestor_name }}</strong>
              </span>

              <button
                type="button"
                @click="openTicketDetails(ticket)"
                class="px-3.5 py-2 min-h-[44px] rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0 touch-manipulation"
              >
                <span>View Job Details</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
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
        >
          <div
            class="pointer-events-auto bg-white rounded-3xl w-full max-w-2xl p-5 sm:p-7 shadow-2xl border border-slate-100 animate-scale-up my-auto max-h-[92vh] overflow-y-auto custom-scrollbar space-y-5"
          >
            <!-- Modal Header -->
            <div class="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
              <div class="min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="px-2.5 py-0.5 rounded-lg text-xs font-black font-mono bg-slate-100 text-slate-800 border border-slate-200">
                    #{{ selectedTicket.ticket_id }}
                  </span>
                  <span
                    :class="[
                      'px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border',
                      selectedTicket.completed_at
                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    ]"
                  >
                    {{ selectedTicket.completed_at ? 'Completed' : selectedTicket.status_label }}
                  </span>
                  <span v-if="selectedTicket.is_emergency" class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white">
                    🔥 Emergency
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
                Close Job Summary
              </button>
            </div>
          </div>
        </div>
      </Teleport>

    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import { usePersonnelDashboardStore } from '@/stores/personnelDashboard';
import { useAuthStore } from '@/stores/auth';

const store = usePersonnelDashboardStore();
const authStore = useAuthStore();

const searchQuery = ref('');
const activeTab = ref('active'); // 'active' | 'emergency' | 'completed' | 'all'
const sortBy = ref('newest');     // 'newest' | 'date' | 'emergency'
const selectedTicket = ref(null);

onMounted(async () => {
  await store.fetchDashboard();
});

const refreshData = async () => {
  await store.fetchDashboard();
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
  const uId = store.personnel?.unit_id || authStore.unitId;
  if (uId === 1) return 'Facilities & Grounds Management Unit (FGMU)';
  if (uId === 2) return 'Landscaping & Environmental Aesthetics Unit (LEAU)';
  if (uId === 3) return 'Security Services Unit (SSU)';
  return 'General Services Office (GSO)';
});

const workerInitials = computed(() => {
  const name = workerDisplayName.value.trim();
  if (!name) return 'GP';
  const parts = name.split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
});

const isJobCompleted = (a) => {
  if (!a || !a.completed_at) return false;
  if (typeof a.completed_at === 'string' && (a.completed_at.startsWith('0000-00-00') || !a.completed_at.trim())) {
    return false;
  }
  return true;
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
  } else if (activeTab.value === 'completed') {
    list = list.filter(a => isJobCompleted(a));
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

  // 3. Sorting
  return [...list].sort((a, b) => {
    if (sortBy.value === 'emergency') {
      if (b.is_emergency !== a.is_emergency) return (b.is_emergency || 0) - (a.is_emergency || 0);
    }
    if (sortBy.value === 'date') {
      const dateA = a.implementation_date || a.target_completion_date || '';
      const dateB = b.implementation_date || b.target_completion_date || '';
      if (dateA && dateB) return dateA.localeCompare(dateB);
    }
    // Default: newest assigned
    return (b.assignment_id || 0) - (a.assignment_id || 0);
  });
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
</script>
