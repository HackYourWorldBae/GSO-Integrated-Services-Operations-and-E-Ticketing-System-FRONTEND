<template>
  <MainLayout>
    <template #header-title>
      <div class="flex items-center gap-2 min-w-0">
        <router-link
          to="/personnel/dashboard"
          class="text-slate-400 hover:text-slate-700 transition-colors p-1 -ml-1 rounded-lg hover:bg-slate-100 shrink-0"
          title="Back to Active Jobs"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </router-link>
        <h2 class="text-base sm:text-xl font-black text-slate-900 tracking-tight truncate">
          Completed Jobs History
        </h2>
      </div>
    </template>

    <template #main-content>
      <div class="max-w-7xl mx-auto space-y-5 sm:space-y-6">

        <!-- History Hero Banner -->
        <div class="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 p-5 sm:p-7 text-white shadow-xl border border-slate-800">
          <div class="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-sky-500/10 blur-2xl pointer-events-none"></div>
          <div class="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-teal-500/10 blur-2xl pointer-events-none"></div>

          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div class="flex items-start sm:items-center gap-4 min-w-0">
              <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 text-white font-black text-xl sm:text-2xl flex items-center justify-center shrink-0 shadow-lg shadow-sky-950/40 border-2 border-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2 mb-1">
                  <h3 class="text-lg sm:text-2xl font-black text-white tracking-tight truncate">
                    Job Completion Archive
                  </h3>
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-400/40 shadow-xs">
                    Verified Records
                  </span>
                </div>

                <p class="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                  Historical archive of all resolved, serviced, and completed work orders for <strong class="text-white">{{ workerDisplayName }}</strong>.
                </p>
              </div>
            </div>

            <!-- Banner CTA: Quick jump to active jobs -->
            <div class="flex items-center gap-2.5 shrink-0">
              <router-link
                to="/personnel/dashboard"
                class="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black backdrop-blur-md border border-white/15 transition-all shadow-xs cursor-pointer active:scale-95 touch-manipulation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Active Work Orders ({{ store.activeCount }})</span>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Metric Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <!-- Total Completed -->
          <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition-all">
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400">Total Completed</span>
              <div class="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="text-2xl sm:text-3xl font-black text-slate-900 leading-none">
              {{ store.completedCount }}
            </div>
            <p class="text-[11px] font-semibold text-slate-500 mt-1">All time finished jobs</p>
          </div>

          <!-- Solo Completions -->
          <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all">
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400">Solo Completed</span>
              <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div class="text-2xl sm:text-3xl font-black text-slate-900 leading-none">
              {{ soloCompletedCount }}
            </div>
            <p class="text-[11px] font-semibold text-slate-500 mt-1">Individual job dispatches</p>
          </div>

          <!-- Joint Crew Completions -->
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
              {{ jointCompletedCount }}
            </div>
            <p class="text-[11px] font-semibold text-slate-500 mt-1">Multi-personnel joint efforts</p>
          </div>

          <!-- Emergency Resolved -->
          <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-rose-300 hover:shadow-md transition-all">
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400">Emergency Resolved</span>
              <div class="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
            </div>
            <div class="text-2xl sm:text-3xl font-black text-slate-900 leading-none">
              {{ emergencyCompletedCount }}
            </div>
            <p class="text-[11px] font-semibold text-slate-500 mt-1">Urgent requests completed</p>
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
                placeholder="Search history by Ticket ID, service, location, client, or crew member..."
                class="w-full pl-10 pr-4 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/60 focus:bg-white transition-all"
              />
            </div>

            <!-- Unit Filter & Sort Dropdown -->
            <div class="flex flex-wrap items-center gap-2 shrink-0">
              <select
                v-model="unitFilter"
                class="px-3 py-2 min-h-[44px] rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
              >
                <option value="all">All Units</option>
                <option value="FGMU">FGMU</option>
                <option value="LEAU">LEAU</option>
                <option value="SSU">SSU</option>
              </select>

              <select
                v-model="sortBy"
                class="px-3 py-2 min-h-[44px] rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
              >
                <option value="completed_desc">Most Recently Completed</option>
                <option value="completed_asc">Oldest Completed</option>
                <option value="ticket_id">Ticket ID</option>
              </select>

              <button
                type="button"
                @click="refreshData"
                :disabled="store.isLoading"
                class="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer active:scale-95 disabled:opacity-50 shrink-0"
                title="Refresh history"
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
            </div>
          </div>

          <!-- Quick Filters Pills -->
          <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <button
              type="button"
              @click="crewTypeFilter = 'all'"
              :class="[
                'px-3 py-1.5 min-h-[36px] rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 touch-manipulation',
                crewTypeFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              ]"
            >
              <span>All History</span>
              <span class="px-1.5 py-0.2 rounded text-[11px] font-black" :class="crewTypeFilter === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'">
                {{ store.completedCount }}
              </span>
            </button>

            <button
              type="button"
              @click="crewTypeFilter = 'solo'"
              :class="[
                'px-3 py-1.5 min-h-[36px] rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 touch-manipulation',
                crewTypeFilter === 'solo'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              ]"
            >
              <span>Solo Dispatches</span>
              <span class="px-1.5 py-0.2 rounded text-[11px] font-black" :class="crewTypeFilter === 'solo' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'">
                {{ soloCompletedCount }}
              </span>
            </button>

            <button
              type="button"
              @click="crewTypeFilter = 'team'"
              :class="[
                'px-3 py-1.5 min-h-[36px] rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 touch-manipulation',
                crewTypeFilter === 'team'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              ]"
            >
              <span>Joint Crew Dispatches</span>
              <span class="px-1.5 py-0.2 rounded text-[11px] font-black" :class="crewTypeFilter === 'team' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'">
                {{ jointCompletedCount }}
              </span>
            </button>
          </div>
        </div>

        <!-- Loading State Skeleton -->
        <div v-if="store.isLoading" class="space-y-3.5">
          <div v-for="i in 4" :key="i" class="p-5 rounded-2xl bg-white border border-slate-200/80 animate-pulse space-y-3">
            <div class="flex items-center justify-between">
              <div class="h-4 bg-slate-200 rounded w-24"></div>
              <div class="h-4 bg-slate-200 rounded-full w-28"></div>
            </div>
            <div class="h-5 bg-slate-200 rounded w-1/2"></div>
            <div class="h-4 bg-slate-200 rounded w-3/4"></div>
            <div class="h-4 bg-slate-200 rounded w-1/3"></div>
          </div>
        </div>

        <!-- Error State Banner -->
        <div
          v-else-if="store.errorMessage"
          class="p-5 sm:p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-3xl mx-auto"
        >
          <div class="flex items-start gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h4 class="text-sm font-black text-rose-950">Unable to load completed jobs history</h4>
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
          v-else-if="filteredCompletedJobs.length === 0"
          class="py-16 px-6 text-center bg-white rounded-3xl border border-dashed border-slate-200 max-w-2xl mx-auto shadow-xs"
        >
          <div class="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 class="text-base font-black text-slate-800">No Completed Jobs Found</h4>
          <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
            {{ searchQuery ? 'No completed jobs match your current search and filters. Try adjusting your search query.' : 'You have not completed any work orders yet. Once active tasks are marked completed, their full history records will appear here.' }}
          </p>
          <div class="mt-4 flex items-center justify-center gap-3">
            <button
              v-if="searchQuery"
              type="button"
              @click="searchQuery = ''; crewTypeFilter = 'all'; unitFilter = 'all'"
              class="px-4 py-2 rounded-xl text-xs font-black text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-all cursor-pointer min-h-[44px]"
            >
              Reset Filters
            </button>
            <router-link
              to="/personnel/dashboard"
              class="px-4 py-2 rounded-xl text-xs font-black text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer min-h-[44px] inline-flex items-center gap-1.5"
            >
              View Active Tasks
            </router-link>
          </div>
        </div>

        <!-- Completed Tasks List (Clean Ticket List Layout) -->
        <div v-else class="space-y-3.5">
          <div
            v-for="ticket in filteredCompletedJobs"
            :key="ticket.assignment_id || ticket.ticket_id"
            @click="openTicketDetails(ticket)"
            @keydown.enter="openTicketDetails(ticket)"
            tabindex="0"
            role="button"
            :aria-label="'View completed ticket details for #' + ticket.ticket_id"
            class="group relative bg-white border border-slate-200/90 hover:border-sky-400 rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:shadow-md active:scale-[0.995] cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-sky-500/30 touch-manipulation"
          >
            <!-- Sky accent left bar indicating completed status -->
            <div class="absolute left-0 inset-y-0 w-1.5 rounded-l-2xl bg-sky-500"></div>

            <div class="pl-2.5 sm:pl-3 space-y-3">
              <!-- Top Row: ID, Badges, Completion Date -->
              <div class="flex items-center justify-between gap-2 flex-wrap">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="px-2.5 py-1 rounded-lg text-xs font-black font-mono bg-slate-100 text-slate-800 border border-slate-200">
                    #{{ ticket.ticket_id }}
                  </span>
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                    {{ ticket.unit_code }}
                  </span>
                  <span
                    v-if="ticket.is_emergency"
                    class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 font-bold flex items-center gap-1"
                  >
                    <span>🔥</span> Emergency Handled
                  </span>
                  <span
                    v-if="ticket.is_project && ticket.project_title"
                    class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 truncate max-w-[200px]"
                  >
                    📁 {{ ticket.project_title }}
                  </span>
                </div>

                <!-- Completed Badge + Date -->
                <div class="flex items-center gap-2 shrink-0">
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200 inline-flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    Completed
                  </span>
                  <span class="text-xs font-bold text-slate-500 hidden sm:inline">
                    {{ formatDate(ticket.completed_at || ticket.implementation_date) }}
                  </span>
                </div>
              </div>

              <!-- Main Title & Description -->
              <div class="space-y-1">
                <h4 class="text-base sm:text-lg font-black text-slate-900 group-hover:text-sky-700 transition-colors leading-snug">
                  {{ ticket.service_type }}
                </h4>
                <p class="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {{ ticket.description }}
                </p>
              </div>

              <!-- Bottom Meta Grid: Location, Client, Crew, Action Prompt -->
              <div class="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-slate-600">
                  <!-- Location -->
                  <span class="inline-flex items-center gap-1.5 font-bold text-slate-800">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-sky-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {{ ticket.location }} <span class="text-slate-400 font-normal">({{ ticket.office_room }})</span>
                  </span>

                  <!-- Client -->
                  <span class="inline-flex items-center gap-1.5 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Client: <strong class="text-slate-700">{{ ticket.requestor_name }}</strong>
                  </span>

                  <!-- Crew / Team Pill -->
                  <span
                    :class="[
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold',
                      ticket.team_count > 1 ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-100 text-slate-600'
                    ]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {{ ticket.team_count > 1 ? `Joint Crew (${ticket.team_count})` : 'Solo Responder' }}
                  </span>
                </div>

                <!-- Right Side CTA: View Info -->
                <div class="inline-flex items-center gap-1 font-black text-sky-700 group-hover:text-sky-800 shrink-0 self-end sm:self-center">
                  <span>View Full Info</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- ======================================================== -->
      <!-- COMPLETED TICKET FULL INFO MODAL                         -->
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
                <div class="flex items-center gap-2 mb-1 flex-wrap">
                  <span class="px-2.5 py-0.5 rounded-lg text-xs font-black font-mono bg-slate-100 text-slate-800 border border-slate-200">
                    #{{ selectedTicket.ticket_id }}
                  </span>
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200 inline-flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Completed Job
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

            <!-- Job Recap Breakdown -->
            <div class="space-y-4">
              <!-- Description -->
              <div class="space-y-1">
                <label class="text-[10px] font-black uppercase tracking-wider text-slate-400">Request Description</label>
                <p class="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  {{ selectedTicket.description }}
                </p>
              </div>

              <!-- Location & Completion Schedule Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
                  <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Work Location</span>
                  <span class="font-bold text-slate-800 block text-sm">{{ selectedTicket.location }}</span>
                  <span class="text-slate-500">Room / Office: <strong>{{ selectedTicket.office_room }}</strong></span>
                </div>

                <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
                  <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Completed On</span>
                  <span class="font-bold text-sky-700 block text-sm">
                    {{ formatDate(selectedTicket.completed_at || selectedTicket.implementation_date) }}
                  </span>
                  <span class="text-slate-500">Working Duration: <strong>{{ selectedTicket.working_days }} day(s)</strong></span>
                </div>
              </div>

              <!-- Requesting Client Details -->
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

              <!-- Dispatcher Notes (if any) -->
              <div v-if="selectedTicket.dispatcher_notes || selectedTicket.task_notes" class="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <span class="text-[10px] font-black uppercase tracking-wider text-amber-950 block">Dispatcher Instructions &amp; Task Notes:</span>
                <p class="font-medium leading-relaxed">{{ selectedTicket.dispatcher_notes || selectedTicket.task_notes }}</p>
              </div>

              <!-- Assigned Crew / Team section -->
              <div class="space-y-2 pt-2">
                <div class="flex items-center justify-between">
                  <h4 class="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Responding Team Crew ({{ selectedTicket.team_count }} Staff)
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
                        ? 'bg-sky-50/80 border-sky-300 ring-2 ring-sky-500/20 shadow-xs'
                        : 'bg-white border-slate-200 shadow-2xs'
                    ]"
                  >
                    <div
                      :class="[
                        'w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0',
                        member.is_you ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                      ]"
                    >
                      {{ getMemberInitials(member.personnel_name) }}
                    </div>

                    <div class="min-w-0 flex-1 leading-tight text-xs space-y-0.5">
                      <div class="flex items-center justify-between gap-1">
                        <span class="font-black text-slate-900 truncate">
                          {{ member.personnel_name }}
                        </span>
                        <span v-if="member.is_you" class="px-1.5 py-0.2 rounded bg-sky-600 text-white text-[9px] font-black uppercase">
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
                Close History Details
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
import { useRoute } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import { usePersonnelDashboardStore } from '@/stores/personnelDashboard';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const store = usePersonnelDashboardStore();
const authStore = useAuthStore();

const searchQuery = ref('');
const unitFilter = ref('all');
const crewTypeFilter = ref('all'); // 'all' | 'solo' | 'team'
const sortBy = ref('completed_desc'); // 'completed_desc' | 'completed_asc' | 'ticket_id'
const selectedTicket = ref(null);

const loadHistory = async () => {
  try {
    const qPid = route.query.personnel_id ? String(route.query.personnel_id).trim() : null;
    await store.fetchDashboard(qPid);
  } catch (_) {
    // Handled by store.errorMessage
  }
};

onMounted(async () => {
  await loadHistory();
});

const refreshData = async () => {
  await loadHistory();
};

const workerDisplayName = computed(() => {
  if (store.personnel?.name) return store.personnel.name;
  return authStore.fullName || 'Responding Personnel';
});

const soloCompletedCount = computed(() => {
  return store.completedAssignments.filter(a => (a.team_count || 1) <= 1).length;
});

const jointCompletedCount = computed(() => {
  return store.completedAssignments.filter(a => (a.team_count || 1) > 1).length;
});

const emergencyCompletedCount = computed(() => {
  return store.completedAssignments.filter(a => a.is_emergency === 1).length;
});

const filteredCompletedJobs = computed(() => {
  let list = store.completedAssignments;

  // 1. Crew type filter
  if (crewTypeFilter.value === 'solo') {
    list = list.filter(a => (a.team_count || 1) <= 1);
  } else if (crewTypeFilter.value === 'team') {
    list = list.filter(a => (a.team_count || 1) > 1);
  }

  // 2. Unit filter
  if (unitFilter.value !== 'all') {
    list = list.filter(a => String(a.unit_code || '').toUpperCase() === unitFilter.value.toUpperCase());
  }

  // 3. Search query filter
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

  // 4. Sorting
  return [...list].sort((a, b) => {
    if (sortBy.value === 'ticket_id') {
      return String(b.ticket_id || '').localeCompare(String(a.ticket_id || ''));
    }
    const dateA = a.completed_at || a.implementation_date || '';
    const dateB = b.completed_at || b.implementation_date || '';
    if (sortBy.value === 'completed_asc') {
      return dateA.localeCompare(dateB);
    }
    // Default: most recently completed
    return dateB.localeCompare(dateA);
  });
});

const getMemberInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'Completed';
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
