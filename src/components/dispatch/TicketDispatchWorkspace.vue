<template>
  <div class="space-y-6 pb-12 px-4 sm:px-8 py-6 max-w-[1750px] mx-auto min-h-screen">
    <!-- Top Console Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1.5">
          <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
            {{ unitCode }} Operations
          </span>
          <span class="text-xs sm:text-sm text-slate-400 font-bold tracking-tight">Interactive Dispatch Console</span>
        </div>
        <h2 class="text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
          {{ unitCode }} Ticket Dispatch
        </h2>
        <p class="text-sm sm:text-base text-slate-500 font-medium mt-1">
          Select an approved ticket on the left, pick a technician on the right, and schedule immediate deployment.
        </p>
      </div>
    </div>

    <!-- Active Selection Banner (Sticky on Mobile) -->
    <div
      v-if="selectedTicket"
      class="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white shadow-xl border border-emerald-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in"
    >
      <div class="flex items-center gap-4 min-w-0">
        <div class="h-12 px-4 min-w-[5.5rem] rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
          <span class="text-sm sm:text-base font-black text-emerald-300">#{{ selectedTicket.id }}</span>
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-2.5 flex-wrap mb-1">
            <span class="px-2.5 py-0.5 rounded-md bg-emerald-500 text-white text-xs font-black uppercase tracking-wider">
              Active Assignment Target
            </span>
            <span class="text-xs sm:text-sm text-slate-300 font-bold truncate">
              {{ selectedTicket.service || selectedTicket.type }}
            </span>
          </div>
          <h4 class="text-base sm:text-xl font-black text-white truncate">
            {{ selectedTicket.title || selectedTicket.type }}
          </h4>
          <p class="text-xs sm:text-sm text-slate-300 truncate mt-0.5">
            {{ selectedTicket.location || selectedTicket.college_building }}
            <span v-if="selectedTicket.office_room">({{ selectedTicket.office_room }})</span>
            · Requested by <strong class="text-white">{{ selectedTicket.requester }}</strong>
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
        <button
          @click="openTicketDetails(selectedTicket)"
          class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-black transition-colors border border-white/10 cursor-pointer"
        >
          View Scope &amp; Files
        </button>
        <button
          @click="clearSelectedTicket"
          class="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-white text-xs sm:text-sm font-black transition-colors border border-rose-500/30 cursor-pointer"
          title="Deselect ticket"
        >
          Clear Target
        </button>
      </div>
    </div>

    <!-- Main Dual-Column Split Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

      <!-- LEFT COLUMN: Approved Tickets Queue (col-span-5) -->
      <div class="lg:col-span-5 space-y-4">
        <div class="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6 flex flex-col h-[calc(100vh-220px)] min-h-[620px]">
          <!-- Column Header -->
          <div class="flex items-center justify-between gap-2 pb-4 border-b border-slate-100 shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg sm:text-xl font-black text-slate-900 leading-tight">Approved Tickets</h3>
                <p class="text-xs sm:text-sm text-slate-400 font-medium">Awaiting workforce assignment</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs sm:text-sm font-black tabular-nums border border-slate-200/60">
                {{ filteredTickets.length }}
              </span>
              <button
                @click="fetchTickets"
                :disabled="loadingTickets"
                class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title="Refresh approved tickets"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="{ 'animate-spin': loadingTickets }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Ticket Search & Filters -->
          <div class="pt-4 pb-3 space-y-3 shrink-0">
            <div class="relative">
              <input
                v-model="ticketSearch"
                type="text"
                placeholder="Search ticket #, service, location, requester..."
                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-slate-50/50"
              />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <!-- Urgency quick filter -->
            <div class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 text-xs sm:text-sm">
              <button
                @click="urgencyFilter = 'all'"
                :class="['px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap', urgencyFilter === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                All ({{ dispatchQueue.length }})
              </button>
              <button
                @click="urgencyFilter = 'emergency'"
                :class="['px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap', urgencyFilter === 'emergency' ? 'bg-rose-600 text-white shadow-xs' : 'bg-rose-50 text-rose-700 hover:bg-rose-100']"
              >
                Emergency / High
              </button>
              <button
                @click="urgencyFilter = 'standard'"
                :class="['px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap', urgencyFilter === 'standard' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                Standard
              </button>
            </div>
          </div>

          <!-- Tickets List (Scrollable) -->
          <div class="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar pt-1">
            <div v-if="loadingTickets" class="py-16 text-center text-slate-400 space-y-2">
              <div class="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p class="text-sm font-bold">Loading approved tickets...</p>
            </div>

            <div v-else-if="filteredTickets.length === 0" class="py-16 flex flex-col items-center justify-center text-center p-4">
              <div class="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 class="text-base font-black text-slate-700">No approved tickets pending</h4>
              <p class="text-xs sm:text-sm text-slate-400 mt-1 max-w-xs">
                All approved tickets have been assigned to technicians. New tickets will appear here once approved by the Director.
              </p>
            </div>

            <!-- Ticket Card Item -->
            <div
              v-else
              v-for="ticket in filteredTickets"
              :key="ticket.id"
              @click="handleSelectTicket(ticket)"
              :class="[
                'p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative group text-left',
                selectedTicket?.id === ticket.id
                  ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/30'
                  : 'border-slate-200/80 bg-white hover:border-emerald-300 hover:shadow-xs hover:bg-slate-50/50'
              ]"
            >
              <!-- Card Header: ID & Urgency -->
              <div class="flex items-center justify-between gap-2 mb-2">
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-black tracking-wider">
                    #{{ ticket.id }}
                  </span>
                  <span class="text-xs sm:text-sm font-black text-slate-800 truncate max-w-[190px]">
                    {{ ticket.service || ticket.type }}
                  </span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span
                    v-if="ticket.is_emergency"
                    class="px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-700 text-xs font-black uppercase tracking-wider"
                  >
                    Emergency
                  </span>
                  <span
                    v-else
                    class="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider"
                  >
                    Approved
                  </span>
                </div>
              </div>

              <!-- Ticket Title -->
              <h4 class="text-sm sm:text-base font-black text-slate-900 line-clamp-1 mb-1.5 group-hover:text-emerald-700 transition-colors">
                {{ ticket.title || ticket.type }}
              </h4>

              <!-- Location & Requester -->
              <div class="space-y-1 text-xs sm:text-sm text-slate-500 font-medium">
                <p class="flex items-center gap-1.5 truncate">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="truncate">{{ ticket.location || ticket.college_building }} <span v-if="ticket.office_room">({{ ticket.office_room }})</span></span>
                </p>
                <p class="flex items-center gap-1.5 truncate">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span class="truncate font-semibold text-slate-700">{{ ticket.requester }}</span>
                  <span v-if="ticket.submittedAt" class="text-slate-400">· {{ ticket.submittedAt }}</span>
                </p>
              </div>

              <!-- Action Bar on Card -->
              <div class="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
                <button
                  type="button"
                  @click.stop="openTicketDetails(ticket)"
                  class="text-slate-500 hover:text-slate-800 font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>Scope &amp; Details</span>
                </button>

                <span
                  v-if="selectedTicket?.id === ticket.id"
                  class="text-emerald-700 font-black flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  Target Selected
                </span>
                <span
                  v-else
                  class="text-slate-400 group-hover:text-emerald-600 font-bold transition-colors"
                >
                  Click to assign &rarr;
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: Unit Workforce & Assignment Action (col-span-7) -->
      <div class="lg:col-span-7 space-y-4">
        <div class="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6 flex flex-col h-[calc(100vh-220px)] min-h-[620px]">
          <!-- Column Header with Available Staff metric -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg sm:text-xl font-black text-slate-900 leading-tight">Unit Workforce</h3>
                <p class="text-xs sm:text-sm text-slate-400 font-medium">Select a worker to deploy to the active ticket</p>
              </div>
            </div>

            <!-- Available Staff replacing "Showing : [number] workers" -->
            <div class="flex items-center gap-2.5 px-4 py-2 bg-emerald-50 border border-emerald-200/80 rounded-2xl shadow-xs">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="text-xs sm:text-sm font-bold text-slate-600">Available Staff:</span>
              <span class="text-xs sm:text-sm font-black text-emerald-800 tabular-nums">
                {{ availableWorkersCount }} / {{ totalWorkersCount }}
              </span>
            </div>
          </div>

          <!-- Workforce Search & Filters -->
          <div class="pt-4 pb-3 space-y-3 shrink-0">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <!-- Search worker by name -->
              <div class="relative">
                <input
                  v-model="workerSearch"
                  type="text"
                  placeholder="Search worker by name or role..."
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-slate-50/50"
                />
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <!-- Status filter -->
              <select
                v-model="workerStatusFilter"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-slate-50/50 cursor-pointer"
              >
                <option value="all">All Availability Statuses</option>
                <option value="Available">Available (Ready for Dispatch)</option>
                <option value="Working">Working (Active Task)</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>

            <!-- Specialty filter pills -->
            <div class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 text-xs sm:text-sm">
              <button
                @click="selectedSpecialty = 'all'"
                :class="['px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap', selectedSpecialty === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                All Specialties
              </button>
              <button
                v-for="cat in store.categories"
                :key="cat.id"
                @click="selectedSpecialty = cat.name"
                :class="['px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap', selectedSpecialty === cat.name ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                {{ cat.name }}
              </button>
            </div>
          </div>

          <!-- Assignment Helper Prompt -->
          <div
            v-if="!selectedTicket"
            class="p-3.5 bg-amber-50/90 border border-amber-200 rounded-2xl flex items-center gap-3 text-xs sm:text-sm text-amber-900 shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span><strong>Tip:</strong> Click an approved ticket on the left column to enable one-click assignment to any available worker below.</span>
          </div>

          <!-- Workers Grid (Scrollable) -->
          <div class="flex-1 overflow-y-auto pr-1 custom-scrollbar pt-1">
            <div v-if="filteredWorkers.length === 0" class="py-16 text-center text-slate-400">
              <p class="text-sm font-bold uppercase tracking-wider">No personnel match current filters</p>
              <p class="text-xs sm:text-sm text-slate-400 mt-1">Try clearing your search or specialty filters.</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div
                v-for="worker in filteredWorkers"
                :key="worker.id"
                class="p-4 sm:p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between gap-3.5 group"
              >
                <!-- Worker Info Header -->
                <div>
                  <div class="flex items-start justify-between gap-3 mb-2.5">
                    <div class="flex items-center gap-3 min-w-0">
                      <!-- Avatar -->
                      <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800 flex items-center justify-center font-black text-sm shrink-0 border border-slate-200/80 shadow-xs">
                        {{ getInitials(worker.name) }}
                      </div>
                      <div class="min-w-0">
                        <h4 class="text-sm sm:text-base font-black text-slate-900 truncate leading-tight">
                          {{ worker.name }}
                        </h4>
                        <span class="inline-block text-xs sm:text-sm font-bold text-slate-500 truncate mt-0.5">
                          {{ worker.specialty || worker.role || 'General Staff' }}
                        </span>
                      </div>
                    </div>

                    <!-- Status Pill -->
                    <span
                      :class="[
                        'px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shrink-0 border',
                        worker.status === 'Available'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : worker.status === 'Working'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                      ]"
                    >
                      {{ worker.status }}
                    </span>
                  </div>

                  <!-- Workload info / Current Task -->
                  <div class="text-xs sm:text-sm text-slate-600 space-y-1 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                    <p class="flex items-center justify-between">
                      <span class="text-slate-400 font-bold">Contact:</span>
                      <span class="font-bold text-slate-800">{{ worker.contact_number || 'No contact provided' }}</span>
                    </p>
                    <p class="flex items-center justify-between">
                      <span class="text-slate-400 font-bold">Active Load:</span>
                      <span v-if="worker.status === 'Working' || worker.assignedTicket" class="font-black text-amber-700 truncate max-w-[170px]">
                        Job #{{ worker.assignedTicket || 'Active' }}
                      </span>
                      <span v-else class="font-bold text-emerald-700">Ready / Idle</span>
                    </p>
                  </div>
                </div>

                <!-- Assignment Action CTA -->
                <div>
                  <button
                    v-if="selectedTicket"
                    type="button"
                    :disabled="worker.status === 'On Leave'"
                    @click="openAssignmentModal(worker)"
                    :class="[
                      'w-full py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98',
                      worker.status === 'On Leave'
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        : worker.status === 'Working'
                          ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                    ]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>{{ worker.status === 'On Leave' ? 'Worker On Leave' : 'Assign to Target #' + selectedTicket.id }}</span>
                  </button>

                  <div
                    v-else
                    class="py-2.5 px-3 rounded-xl text-center text-xs sm:text-sm font-bold text-slate-400 bg-slate-50 border border-dashed border-slate-200"
                  >
                    Select ticket on left to assign
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Assignment Configuration Modal -->
    <div
      v-if="showAssignmentModal && selectedWorkerForAssign && selectedTicket"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
    >
      <div class="bg-white rounded-3xl sm:rounded-[2.5rem] w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-slate-100 animate-scale-up">
        <!-- Modal Header -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div>
            <span class="px-3 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
              Dispatch Scheduling
            </span>
            <h3 class="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">Assign Worker to Ticket</h3>
          </div>
          <button
            @click="closeAssignmentModal"
            class="w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Assignment Summary Card -->
        <div class="grid grid-cols-2 gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-5 text-xs sm:text-sm">
          <div>
            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Ticket #{{ selectedTicket.id }}</span>
            <p class="font-bold text-slate-900 truncate">{{ selectedTicket.title || selectedTicket.type }}</p>
            <p class="text-xs text-slate-500 truncate mt-0.5">{{ selectedTicket.location || selectedTicket.college_building }}</p>
          </div>
          <div>
            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Assigned Technician</span>
            <p class="font-black text-emerald-700 truncate">{{ selectedWorkerForAssign.name }}</p>
            <p class="text-xs text-slate-500 truncate mt-0.5">{{ selectedWorkerForAssign.specialty || 'General Staff' }}</p>
          </div>
        </div>

        <form @submit.prevent="submitDispatchAssignment" class="space-y-4">
          <!-- Implementation Date Picker -->
          <div>
            <label class="text-xs font-black text-slate-600 uppercase tracking-wider block mb-1.5">
              Target Implementation Date *
            </label>
            <input
              v-model="assignForm.implementationDate"
              type="date"
              required
              :min="minDate"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>

          <!-- Working Days / EODB Tier Duration -->
          <div>
            <label class="text-xs font-black text-slate-600 uppercase tracking-wider block mb-1.5">
              Service Duration / Target Working Days *
            </label>
            <div class="grid grid-cols-3 gap-2 mb-2">
              <button
                type="button"
                @click="setWorkingDays(3)"
                :class="['py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer text-center', assignForm.workingDays === 3 ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-black shadow-xs' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50']"
              >
                Simple (3 days)
              </button>
              <button
                type="button"
                @click="setWorkingDays(7)"
                :class="['py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer text-center', assignForm.workingDays === 7 ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-black shadow-xs' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50']"
              >
                Moderate (7 days)
              </button>
              <button
                type="button"
                @click="setWorkingDays(21)"
                :class="['py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer text-center', assignForm.workingDays === 21 ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-black shadow-xs' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50']"
              >
                Complex (21 days)
              </button>
            </div>
            <div class="relative">
              <input
                v-model.number="assignForm.workingDays"
                type="number"
                min="1"
                max="90"
                required
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span class="absolute right-4 top-2.5 text-xs sm:text-sm font-bold text-slate-400 pointer-events-none">working days</span>
            </div>
          </div>

          <!-- Emergency Priority Checkbox -->
          <div class="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <input
              id="emergency-dispatch-toggle"
              v-model="assignForm.isEmergency"
              type="checkbox"
              class="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300 cursor-pointer"
            />
            <label for="emergency-dispatch-toggle" class="text-xs sm:text-sm font-bold text-slate-800 cursor-pointer select-none">
              Mark as Priority / Emergency Dispatch
            </label>
          </div>

          <!-- Instructions / Dispatch Notes -->
          <div>
            <label class="text-xs font-black text-slate-600 uppercase tracking-wider block mb-1.5">
              Instructions / Work Notes for {{ selectedWorkerForAssign.name }}
            </label>
            <textarea
              v-model="assignForm.taskNotes"
              rows="3"
              placeholder="e.g. Inspect breaker panel, replace blown fuse, test voltage..."
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              @click="closeAssignmentModal"
              class="px-5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-black text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="submittingAssignment"
              class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black transition-all shadow-sm shadow-emerald-200 active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <svg v-if="submittingAssignment" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ submittingAssignment ? 'Dispatching...' : 'Confirm & Dispatch' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Ticket Review / Scope Details Modal -->
    <div
      v-if="showDetailsModal && modalTicket"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
    >
      <div class="bg-white rounded-3xl sm:rounded-[2.5rem] w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden animate-scale-up max-h-[85vh] flex flex-col">
        <!-- Modal Top -->
        <div class="bg-slate-900 p-6 text-white flex items-center justify-between border-b-4 border-emerald-500 shrink-0">
          <div>
            <span class="px-3 py-1 bg-emerald-600 text-white text-xs font-black uppercase tracking-widest rounded-full inline-block mb-1.5">
              Ticket Particulars
            </span>
            <h3 class="text-xl sm:text-2xl font-black text-white">
              #{{ modalTicket.id }} — {{ modalTicket.type || modalTicket.title }}
            </h3>
          </div>
          <button
            @click="showDetailsModal = false"
            class="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Body (Scrollable) -->
        <div class="p-6 sm:p-8 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span class="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Location / Building</span>
              <p class="text-sm sm:text-base font-bold text-slate-900">{{ modalTicket.location || modalTicket.college_building || 'Campus Facility' }}</p>
            </div>
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span class="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Office / Room</span>
              <p class="text-sm sm:text-base font-bold text-slate-900">{{ modalTicket.office_room || 'N/A' }}</p>
            </div>
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span class="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Requester Name</span>
              <p class="text-sm sm:text-base font-bold text-slate-900">{{ modalTicket.requester }}</p>
            </div>
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span class="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Contact Number</span>
              <p class="text-sm sm:text-base font-bold text-slate-900">{{ modalTicket.contact_number || 'N/A' }}</p>
            </div>
          </div>

          <div>
            <span class="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5">Scope / Particulars</span>
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs sm:text-sm font-medium text-slate-800 leading-relaxed italic">
              "{{ modalTicket.job_description || modalTicket.description || 'No detailed scope provided.' }}"
            </div>
          </div>

          <!-- Attachments -->
          <div v-if="modalTicket.attachments && modalTicket.attachments.length > 0">
            <span class="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Attached Files &amp; Proof</span>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="file in modalTicket.attachments"
                :key="file.id"
                @click="downloadAttachment(file)"
                class="px-4 py-2.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <span>{{ file.file_name || 'Download Attachment' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
          <button
            v-if="selectedTicket?.id !== modalTicket.id"
            @click="handleSelectTicket(modalTicket); showDetailsModal = false"
            class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer"
          >
            Select for Assignment
          </button>
          <div v-else class="text-xs sm:text-sm font-bold text-emerald-700">
            Currently active target
          </div>
          <button
            @click="showDetailsModal = false"
            class="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/client';
import { toast } from 'vue3-toastify';

const props = defineProps({
  unitCode: {
    type: String,
    required: true,
    validator: (v) => ['FGMU', 'LEAU'].includes(v)
  },
  unitTitle: {
    type: String,
    default: ''
  },
  store: {
    type: Object,
    required: true
  }
});

const route = useRoute();
const router = useRouter();

// ── Approved Tickets Queue ──────────────────────────────────────────────────
const dispatchQueue = ref([]);
const loadingTickets = ref(false);
const ticketSearch = ref('');
const urgencyFilter = ref('all');
const selectedTicket = ref(null);

const minDate = computed(() => {
  return new Date().toISOString().split('T')[0];
});

const fetchTickets = async () => {
  loadingTickets.value = true;
  try {
    const res = await api.get(`tickets/dispatch/${props.unitCode}`);
    if (res.data?.data?.tickets) {
      dispatchQueue.value = res.data.data.tickets.map(t => ({
        id: t.id,
        title: t.title,
        service: t.service_type,
        type: t.title || t.project_title || t.service_type || `${props.unitCode} Service Task`,
        requester: t.details?.requesting_personnel || t.requester_name || 'End User',
        location: t.location,
        college_building: t.details?.college_building || t.location,
        office_room: t.office_room || t.details?.office_room,
        job_description: t.description,
        source_of_fund: t.details?.source_of_fund || 'N/A',
        contact_number: t.details?.contact_number || 'N/A',
        is_emergency: Boolean(t.is_emergency || t.priority === 'emergency'),
        submittedAt: t.submitted_at
          ? new Date(t.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : '',
        attachments: t.attachments || []
      }));

      // If route has ?ticket=XX, pre-select it
      if (route.query.ticket) {
        const found = dispatchQueue.value.find(t => String(t.id) === String(route.query.ticket));
        if (found) {
          selectedTicket.value = found;
        }
      }
    } else {
      dispatchQueue.value = [];
    }
  } catch (error) {
    console.error(`Failed to fetch ${props.unitCode} dispatch queue:`, error);
    toast.error('Failed to load approved tickets.');
  } finally {
    loadingTickets.value = false;
  }
};

const filteredTickets = computed(() => {
  let list = dispatchQueue.value;
  if (urgencyFilter.value === 'emergency') {
    list = list.filter(t => t.is_emergency);
  } else if (urgencyFilter.value === 'standard') {
    list = list.filter(t => !t.is_emergency);
  }

  if (!ticketSearch.value.trim()) return list;
  const q = ticketSearch.value.toLowerCase().trim();
  return list.filter(t =>
    String(t.id).toLowerCase().includes(q) ||
    String(t.type || '').toLowerCase().includes(q) ||
    String(t.service || '').toLowerCase().includes(q) ||
    String(t.location || '').toLowerCase().includes(q) ||
    String(t.requester || '').toLowerCase().includes(q)
  );
});

const handleSelectTicket = (ticket) => {
  selectedTicket.value = ticket;
  router.replace({ query: { ...route.query, ticket: ticket.id } });
};

const clearSelectedTicket = () => {
  selectedTicket.value = null;
  const q = { ...route.query };
  delete q.ticket;
  router.replace({ query: q });
};

// ── Workforce Filters ───────────────────────────────────────────────────────
const workerSearch = ref('');
const workerStatusFilter = ref('all');
const selectedSpecialty = ref('all');

const totalWorkersCount = computed(() => props.store.personnel?.length || 0);
const availableWorkersCount = computed(() => {
  return props.store.personnel?.filter(w => w.status === 'Available').length || 0;
});

const filteredWorkers = computed(() => {
  let list = props.store.personnel || [];

  if (selectedSpecialty.value !== 'all') {
    list = list.filter(w => (w.specialty || w.role) === selectedSpecialty.value);
  }

  if (workerStatusFilter.value !== 'all') {
    list = list.filter(w => w.status === workerStatusFilter.value);
  }

  if (workerSearch.value.trim()) {
    const q = workerSearch.value.toLowerCase().trim();
    list = list.filter(w =>
      String(w.name || '').toLowerCase().includes(q) ||
      String(w.specialty || w.role || '').toLowerCase().includes(q)
    );
  }

  return list;
});

const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// ── Assignment Modal & Flow ─────────────────────────────────────────────────
const showAssignmentModal = ref(false);
const selectedWorkerForAssign = ref(null);
const submittingAssignment = ref(false);

const assignForm = reactive({
  implementationDate: '',
  workingDays: 7,
  isEmergency: false,
  taskNotes: ''
});

const setWorkingDays = (days) => {
  assignForm.workingDays = days;
};

const openAssignmentModal = (worker) => {
  if (!selectedTicket.value) {
    toast.warning('Please select an approved ticket on the left first.');
    return;
  }
  selectedWorkerForAssign.value = worker;
  assignForm.implementationDate = minDate.value;
  assignForm.workingDays = 7;
  assignForm.isEmergency = Boolean(selectedTicket.value.is_emergency);
  assignForm.taskNotes = selectedTicket.value.job_description || selectedTicket.value.title || '';
  showAssignmentModal.value = true;
};

const closeAssignmentModal = () => {
  showAssignmentModal.value = false;
  selectedWorkerForAssign.value = null;
};

const submitDispatchAssignment = async () => {
  if (!selectedTicket.value || !selectedWorkerForAssign.value) return;

  if (!assignForm.implementationDate) {
    toast.error('Please specify an implementation date.');
    return;
  }

  submittingAssignment.value = true;
  try {
    await api.post('dispatch/assign', {
      ticket_id: selectedTicket.value.id,
      personnel_id: selectedWorkerForAssign.value.id,
      implementation_date: assignForm.implementationDate,
      working_days: Number(assignForm.workingDays) || 7,
      task_notes: assignForm.taskNotes.trim() || selectedTicket.value.type,
      is_emergency: assignForm.isEmergency ? 1 : 0
    });

    toast.success(`${selectedWorkerForAssign.value.name} dispatched for Ticket #${selectedTicket.value.id}!`);
    closeAssignmentModal();

    // Refresh both data sources
    await Promise.all([
      fetchTickets(),
      props.store.fetchPersonnel()
    ]);

    // Check if the ticket is still in the queue (or completed)
    const stillInQueue = dispatchQueue.value.find(t => String(t.id) === String(selectedTicket.value?.id));
    if (!stillInQueue) {
      clearSelectedTicket();
    }
  } catch (error) {
    console.error('Dispatch assignment error:', error);
    const msg = error?.response?.data?.message || 'Failed to dispatch worker.';
    toast.error(msg);
  } finally {
    submittingAssignment.value = false;
  }
};

// ── Ticket Particulars Modal ────────────────────────────────────────────────
const showDetailsModal = ref(false);
const modalTicket = ref(null);

const openTicketDetails = (ticket) => {
  modalTicket.value = ticket;
  showDetailsModal.value = true;
};

const downloadAttachment = async (att) => {
  try {
    const res = await api.get(`attachments/${att.id}`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data], { type: att.file_type || 'application/octet-stream' }));
    if (att.file_type && att.file_type.startsWith('image/')) {
      window.open(url, '_blank');
    } else {
      const a = document.createElement('a');
      a.href = url;
      a.download = att.file_name || 'attachment';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  } catch (error) {
    console.error('Failed to download attachment:', error);
    toast.error('Could not download attachment.');
  }
};

onMounted(async () => {
  await Promise.all([
    fetchTickets(),
    props.store.fetchPersonnel(),
    props.store.fetchCategories()
  ]);
});
</script>
