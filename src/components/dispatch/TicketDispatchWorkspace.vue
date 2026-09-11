<template>
  <div class="space-y-6 pb-12 px-4 sm:px-6 lg:px-8 py-6 max-w-[1750px] mx-auto min-h-screen">
    
    <!-- ═══ 1. Compact Header & Metric Bar ═══ -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
            {{ unitCode }} Operations
          </span>
          <span class="text-xs text-slate-400 font-bold">Dispatch &amp; Scheduling Console</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          {{ unitCode }} Ticket Dispatch
        </h2>
        <p class="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          Select an approved ticket from the queue, assign a qualified technician, and set target deployment timelines.
        </p>
      </div>

      <!-- Quick Metrics & Refresh Button -->
      <div class="flex flex-wrap items-center gap-3 shrink-0">
        <!-- Approved Tickets Count -->
        <div class="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl">
          <div class="w-2 h-2 rounded-full bg-amber-500"></div>
          <span class="text-xs text-slate-600 font-bold">Awaiting Dispatch:</span>
          <span class="text-xs font-black text-slate-900 tabular-nums">{{ dispatchQueue.length }}</span>
        </div>

        <!-- Available Staff Counter -->
        <div class="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 border border-emerald-200/80 rounded-2xl">
          <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span class="text-xs text-slate-600 font-bold">Available Staff:</span>
          <span class="text-xs font-black text-emerald-800 tabular-nums">
            {{ availableWorkersCount }} / {{ totalWorkersCount }}
          </span>
        </div>

        <!-- Refresh Button -->
        <button
          type="button"
          @click="refreshData"
          :disabled="loadingTickets"
          class="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer active:scale-95 disabled:opacity-50"
          title="Refresh ticket queue and workforce roster"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            :class="{ 'animate-spin': loadingTickets }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>

    <!-- ═══ 2. Main Dual-Panel Workspace ═══ -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

      <!-- ── LEFT COLUMN: Approved Tickets Queue (col-span-5) ── -->
      <div class="lg:col-span-5 space-y-4">
        <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 flex flex-col">
          
          <!-- Queue Header & Filter Tabs -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <h3 class="text-base font-black text-slate-900">Approved Queue</h3>
              <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-black tabular-nums border border-slate-200/60">
                {{ filteredTickets.length }}
              </span>
            </div>

            <!-- Urgency Quick Filter Pills -->
            <div class="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/60 text-xs font-bold">
              <button
                type="button"
                @click="urgencyFilter = 'all'"
                :class="['px-3 py-1 rounded-lg transition-all cursor-pointer', urgencyFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-500 hover:text-slate-800']"
              >
                All ({{ dispatchQueue.length }})
              </button>
              <button
                type="button"
                @click="urgencyFilter = 'emergency'"
                :class="['px-3 py-1 rounded-lg transition-all cursor-pointer', urgencyFilter === 'emergency' ? 'bg-rose-600 text-white shadow-xs font-black' : 'text-rose-600 hover:bg-rose-50']"
              >
                Emergency
              </button>
              <button
                type="button"
                @click="urgencyFilter = 'standard'"
                :class="['px-3 py-1 rounded-lg transition-all cursor-pointer', urgencyFilter === 'standard' ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-500 hover:text-slate-800']"
              >
                Standard
              </button>
            </div>
          </div>

          <!-- Ticket Search Input -->
          <div class="py-3">
            <div class="relative">
              <input
                v-model="ticketSearch"
                type="text"
                placeholder="Search ticket #, title, location, requester..."
                class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 bg-slate-50/60 transition-all placeholder:text-slate-400"
              />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 absolute left-3 top-3 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button
                v-if="ticketSearch"
                @click="ticketSearch = ''"
                class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded-md"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          <!-- Tickets List (Scrollable) -->
          <div class="space-y-3 max-h-[calc(100vh-290px)] min-h-[450px] overflow-y-auto pr-1.5 custom-scrollbar">
            
            <!-- Loading State -->
            <div v-if="loadingTickets" class="py-16 text-center text-slate-400 space-y-3">
              <div class="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p class="text-xs font-bold">Loading approved ticket queue...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="filteredTickets.length === 0" class="py-16 px-4 text-center">
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 class="text-sm font-bold text-slate-800">No Tickets Pending Dispatch</h4>
              <p class="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                All approved service requests have been dispatched. Newly approved tickets will appear here automatically.
              </p>
            </div>

            <!-- Ticket Card (Compact, Scannable & High Density) -->
            <div
              v-else
              v-for="ticket in filteredTickets"
              :key="ticket.id"
              @click="handleSelectTicket(ticket)"
              :class="[
                'p-4 rounded-2xl border transition-all cursor-pointer relative group text-left',
                selectedTicket?.id === ticket.id
                  ? 'border-emerald-500 bg-emerald-50/40 shadow-sm ring-1 ring-emerald-500/30 border-l-4 border-l-emerald-600'
                  : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs hover:bg-slate-50/60'
              ]"
            >
              <!-- Card Top Row: ID, Service Badge & Priority -->
              <div class="flex items-center justify-between gap-2 mb-1.5">
                <div class="flex items-center gap-1.5">
                  <span class="px-2 py-0.5 rounded-md bg-slate-900 text-white text-[11px] font-black tracking-wider">
                    #{{ ticket.id }}
                  </span>
                  <span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider border border-emerald-200/60 truncate max-w-[150px]">
                    {{ ticket.service || ticket.type }}
                  </span>
                </div>

                <div>
                  <span
                    v-if="ticket.is_emergency"
                    class="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-wider border border-rose-200"
                  >
                    Emergency
                  </span>
                  <span
                    v-else
                    class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider"
                  >
                    Approved
                  </span>
                </div>
              </div>

              <!-- Ticket Subject / Title -->
              <h4 class="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 mb-1.5 group-hover:text-emerald-700 transition-colors">
                {{ ticket.title || ticket.type }}
              </h4>

              <!-- Location & Requester Metadata -->
              <div class="space-y-0.5 text-xs text-slate-500">
                <p class="flex items-center gap-1.5 truncate">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="truncate">{{ ticket.location || ticket.college_building }} <span v-if="ticket.office_room" class="text-slate-400">({{ ticket.office_room }})</span></span>
                </p>
                <p class="flex items-center gap-1.5 truncate">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span class="truncate font-semibold text-slate-700">{{ ticket.requester }}</span>
                  <span v-if="ticket.submittedAt" class="text-slate-400">· {{ ticket.submittedAt }}</span>
                </p>
              </div>

              <!-- Card Action Bar -->
              <div class="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  @click.stop="openTicketDetails(ticket)"
                  class="text-slate-400 hover:text-slate-700 font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>Scope &amp; Files</span>
                </button>

                <div v-if="selectedTicket?.id === ticket.id" class="inline-flex items-center gap-1 text-emerald-700 font-black text-xs">
                  <svg class="h-4 w-4 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span>Selected</span>
                </div>
                <span v-else class="text-emerald-600 font-bold group-hover:translate-x-0.5 transition-transform">
                  Dispatch &rarr;
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- ── RIGHT COLUMN: Guided Dispatch Operations Console (col-span-7) ── -->
      <div class="lg:col-span-7 space-y-4">

        <!-- ═══ STATE A: A TICKET IS SELECTED (ACTIVE DISPATCH CONSOLE) ═══ -->
        <div v-if="selectedTicket" class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6 animate-fade-in">
          
          <!-- Step 1: Selected Target Ticket Header Banner -->
          <div class="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm border border-slate-700/50">
            <div class="min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider">
                  Target Ticket #{{ selectedTicket.id }}
                </span>
                <span class="text-xs text-emerald-300 font-bold truncate">
                  {{ selectedTicket.service || selectedTicket.type }}
                </span>
              </div>
              <h4 class="text-sm sm:text-base font-black text-white truncate">
                {{ selectedTicket.title || selectedTicket.type }}
              </h4>
              <p class="text-xs text-slate-300 truncate mt-0.5">
                📍 {{ selectedTicket.location || selectedTicket.college_building }} · 👤 {{ selectedTicket.requester }}
              </p>
            </div>

            <div class="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                type="button"
                @click="openTicketDetails(selectedTicket)"
                class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors border border-white/10 cursor-pointer"
              >
                View Details
              </button>
              <button
                type="button"
                @click="clearSelectedTicket"
                class="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-white text-xs font-bold transition-colors border border-rose-500/30 cursor-pointer"
              >
                Change Ticket
              </button>
            </div>
          </div>

          <!-- Step 2: Select Technician Section -->
          <div class="space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 class="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                  Select Technician for Assignment *
                </h3>
                <p class="text-xs text-slate-400 font-medium ml-7">
                  Pick a worker from the unit roster. Available staff are highlighted.
                </p>
              </div>

              <!-- Worker search -->
              <div class="relative max-w-xs w-full sm:w-60">
                <input
                  v-model="workerSearch"
                  type="text"
                  placeholder="Filter technician by name..."
                  class="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 bg-slate-50/50"
                />
                <svg class="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>

            <!-- Specialty Filter Pills -->
            <div class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 text-xs">
              <button
                type="button"
                @click="selectedSpecialty = 'all'"
                :class="['px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap', selectedSpecialty === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                All ({{ store.personnel?.length || 0 }})
              </button>
              <button
                v-for="cat in store.categories"
                :key="cat.id"
                type="button"
                @click="selectedSpecialty = cat.name"
                :class="['px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap', selectedSpecialty === cat.name ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                {{ cat.name }}
              </button>
            </div>

            <!-- Technician Cards Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1.5 custom-scrollbar pt-1">
              <div
                v-for="worker in filteredWorkers"
                :key="worker.id"
                @click="handleSelectWorker(worker)"
                :class="[
                  'p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-left',
                  worker.status === 'On Leave'
                    ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                    : selectedWorkerForAssign?.id === worker.id
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/30'
                      : 'border-slate-200/80 bg-white hover:border-emerald-300 hover:bg-slate-50/40'
                ]"
              >
                <div class="flex items-center gap-2.5 min-w-0">
                  <div class="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-black text-xs shrink-0 border border-slate-200">
                    {{ getInitials(worker.name) }}
                  </div>
                  <div class="min-w-0">
                    <h5 class="text-xs font-bold text-slate-900 truncate leading-tight">
                      {{ worker.name }}
                    </h5>
                    <p class="text-[11px] text-slate-500 truncate mt-0.5">
                      {{ worker.specialty || worker.role || 'Staff' }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                  <span
                    :class="[
                      'px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border',
                      worker.status === 'Available'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : worker.status === 'Working'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                    ]"
                  >
                    {{ worker.status }}
                  </span>

                  <!-- Radio / Check icon -->
                  <div
                    v-if="selectedWorkerForAssign?.id === worker.id"
                    class="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center"
                  >
                    <svg class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Selected Worker Reminder Banner -->
            <div v-if="selectedWorkerForAssign" class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
              <span class="text-emerald-900 font-bold flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
                Assigned to: <strong class="text-emerald-950 font-black">{{ selectedWorkerForAssign.name }}</strong> ({{ selectedWorkerForAssign.specialty || 'Staff' }})
              </span>
              <button
                type="button"
                @click="selectedWorkerForAssign = null"
                class="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
              >
                Change
              </button>
            </div>
            <p v-else class="text-xs text-amber-700 font-semibold bg-amber-50 p-2.5 rounded-xl border border-amber-200/80">
              ⚠️ Please click on a technician above to select who will perform this service.
            </p>
          </div>

          <!-- Step 3: Work Order Schedule & Details Form -->
          <form @submit.prevent="submitDispatchAssignment" class="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <h3 class="text-sm font-black text-slate-900 flex items-center gap-2 mb-1">
                <span class="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                Set Schedule &amp; Work Order Details
              </h3>
              <p class="text-xs text-slate-400 font-medium ml-7 mb-3">
                Specify deployment date, EODB estimated duration, and special instructions.
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Implementation Date -->
              <div>
                <label for="dispatch-impl-date" class="text-xs font-bold text-slate-700 block mb-1.5">
                  Target Implementation Date *
                </label>
                <input
                  id="dispatch-impl-date"
                  v-model="assignForm.implementationDate"
                  type="date"
                  required
                  :min="minDate"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-xs"
                />
              </div>

              <!-- Estimated Duration / Working Days -->
              <div>
                <label class="text-xs font-bold text-slate-700 block mb-1.5">
                  Duration (EODB Working Days) *
                </label>
                <div class="flex items-center gap-1.5 mb-2">
                  <button
                    type="button"
                    @click="setWorkingDays(3)"
                    :class="['flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer text-center', assignForm.workingDays === 3 ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-black shadow-xs' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50']"
                  >
                    Simple (3d)
                  </button>
                  <button
                    type="button"
                    @click="setWorkingDays(7)"
                    :class="['flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer text-center', assignForm.workingDays === 7 ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-black shadow-xs' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50']"
                  >
                    Moderate (7d)
                  </button>
                  <button
                    type="button"
                    @click="setWorkingDays(21)"
                    :class="['flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer text-center', assignForm.workingDays === 21 ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-black shadow-xs' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50']"
                  >
                    Complex (21d)
                  </button>
                </div>
                <div class="relative">
                  <input
                    v-model.number="assignForm.workingDays"
                    type="number"
                    min="1"
                    max="90"
                    required
                    class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span class="absolute right-3.5 top-2 text-xs font-medium text-slate-400 pointer-events-none">working days</span>
                </div>
              </div>
            </div>

            <!-- Priority Checkbox -->
            <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <input
                id="emergency-dispatch-toggle"
                v-model="assignForm.isEmergency"
                type="checkbox"
                class="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300 cursor-pointer"
              />
              <label for="emergency-dispatch-toggle" class="text-xs font-bold text-slate-800 cursor-pointer select-none">
                Mark as High Priority / Immediate Deployment
              </label>
            </div>

            <!-- Instructions / Task Notes -->
            <div>
              <label for="dispatch-task-notes" class="text-xs font-bold text-slate-700 block mb-1.5">
                Work Order Notes / Scope Instructions
              </label>
              <textarea
                id="dispatch-task-notes"
                v-model="assignForm.taskNotes"
                rows="2"
                placeholder="e.g. Inspect breaker panel, replace blown fuse, verify voltage..."
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none placeholder:text-slate-400"
              ></textarea>
            </div>

            <!-- Confirm Dispatch Action Button -->
            <div class="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div class="text-xs text-slate-500">
                <span v-if="selectedWorkerForAssign">
                  Ready to deploy <strong>{{ selectedWorkerForAssign.name }}</strong> to Ticket #{{ selectedTicket.id }}
                </span>
                <span v-else class="text-amber-600 font-medium">
                  Select a technician above to proceed.
                </span>
              </div>

              <div class="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  @click="clearSelectedTicket"
                  class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="submittingAssignment || !selectedWorkerForAssign"
                  class="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white disabled:text-slate-400 text-xs font-black transition-all shadow-xs shadow-emerald-500/20 active:scale-98 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg v-if="submittingAssignment" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ submittingAssignment ? 'Dispatching...' : 'Confirm & Dispatch Technician' }}</span>
                </button>
              </div>
            </div>
          </form>

        </div>

        <!-- ═══ STATE B: NO TICKET SELECTED (IDLE WORKFORCE OVERVIEW) ═══ -->
        <div v-else class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          
          <!-- Helpful Guide Card -->
          <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h4 class="text-base font-black text-slate-900">Select a Ticket to Begin Dispatch</h4>
              <p class="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
                Click any approved request in the queue on the left. The dispatch console will activate automatically to select a technician and configure deployment schedules.
              </p>
            </div>
          </div>

          <!-- Unit Workforce Roster Overview -->
          <div class="space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 class="text-sm font-black text-slate-900">Unit Technician Availability</h3>
                <p class="text-xs text-slate-400 font-medium">Current status and workload across unit personnel</p>
              </div>

              <!-- Quick Specialty Filter -->
              <div class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 text-xs">
                <button
                  type="button"
                  @click="selectedSpecialty = 'all'"
                  :class="['px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap', selectedSpecialty === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
                >
                  All ({{ store.personnel?.length || 0 }})
                </button>
                <button
                  v-for="cat in store.categories"
                  :key="cat.id"
                  type="button"
                  @click="selectedSpecialty = cat.name"
                  :class="['px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap', selectedSpecialty === cat.name ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
                >
                  {{ cat.name }}
                </button>
              </div>
            </div>

            <!-- Workforce Cards Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[calc(100vh-420px)] overflow-y-auto pr-1.5 custom-scrollbar">
              <div
                v-for="worker in filteredWorkers"
                :key="worker.id"
                class="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between gap-3"
              >
                <div class="flex items-start justify-between gap-2">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-black text-xs shrink-0 border border-slate-200">
                      {{ getInitials(worker.name) }}
                    </div>
                    <div class="min-w-0">
                      <h5 class="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {{ worker.name }}
                      </h5>
                      <span class="inline-block text-xs text-slate-500 font-medium truncate">
                        {{ worker.specialty || worker.role || 'Staff' }}
                      </span>
                    </div>
                  </div>

                  <span
                    :class="[
                      'px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0',
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

                <div class="bg-slate-50 rounded-xl p-2.5 text-xs text-slate-600 flex items-center justify-between">
                  <span class="text-slate-400 font-medium">Current Workload:</span>
                  <span v-if="worker.status === 'Working' || worker.assignedTicket" class="font-bold text-amber-700 truncate max-w-[150px]">
                    Task #{{ worker.assignedTicket || 'Active' }}
                  </span>
                  <span v-else-if="worker.status === 'On Leave'" class="font-bold text-rose-600">
                    On Leave
                  </span>
                  <span v-else class="font-bold text-emerald-700">
                    Ready for Deployment
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>

    <!-- ═══ 3. Scope Particulars & File Proof Modal ═══ -->
    <div
      v-if="showDetailsModal && modalTicket"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
    >
      <div class="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden animate-scale-up max-h-[85vh] flex flex-col">
        <!-- Modal Header -->
        <div class="bg-slate-900 p-5 sm:p-6 text-white flex items-center justify-between border-b-4 border-emerald-500 shrink-0">
          <div>
            <span class="px-2.5 py-0.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full inline-block mb-1">
              Ticket Particulars
            </span>
            <h3 class="text-lg sm:text-xl font-black text-white">
              #{{ modalTicket.id }} — {{ modalTicket.type || modalTicket.title }}
            </h3>
          </div>
          <button
            type="button"
            @click="showDetailsModal = false"
            class="text-slate-400 hover:text-white p-1 rounded-xl transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Body (Scrollable) -->
        <div class="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Location / Building</span>
              <p class="text-xs sm:text-sm font-bold text-slate-900">{{ modalTicket.location || modalTicket.college_building || 'Campus Facility' }}</p>
            </div>
            <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Office / Room</span>
              <p class="text-xs sm:text-sm font-bold text-slate-900">{{ modalTicket.office_room || 'N/A' }}</p>
            </div>
            <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Requester</span>
              <p class="text-xs sm:text-sm font-bold text-slate-900">{{ modalTicket.requester }}</p>
            </div>
            <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Contact Number</span>
              <p class="text-xs sm:text-sm font-bold text-slate-900">{{ modalTicket.contact_number || 'N/A' }}</p>
            </div>
          </div>

          <div>
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Scope / Job Description</span>
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs sm:text-sm font-medium text-slate-800 leading-relaxed italic">
              "{{ modalTicket.job_description || modalTicket.description || 'No detailed scope provided.' }}"
            </div>
          </div>

          <!-- Attachments -->
          <div v-if="modalTicket.attachments && modalTicket.attachments.length > 0">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Attached Files &amp; Proof</span>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="file in modalTicket.attachments"
                :key="file.id"
                @click="downloadAttachment(file)"
                class="px-3 py-2 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <span class="truncate max-w-[200px]">{{ file.file_name || 'Download Attachment' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
          <button
            v-if="selectedTicket?.id !== modalTicket.id"
            type="button"
            @click="handleSelectTicket(modalTicket); showDetailsModal = false"
            class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Select for Dispatch
          </button>
          <div v-else class="text-xs font-bold text-emerald-700">
            Currently active target
          </div>
          <button
            type="button"
            @click="showDetailsModal = false"
            class="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
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

// ── Approved Tickets Queue State ─────────────────────────────────────────────
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

      // Pre-select ticket if present in route query
      if (route.query.ticket) {
        const found = dispatchQueue.value.find(t => String(t.id) === String(route.query.ticket));
        if (found) {
          handleSelectTicket(found);
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
  assignForm.implementationDate = minDate.value;
  assignForm.isEmergency = Boolean(ticket.is_emergency);
  assignForm.taskNotes = ticket.job_description || ticket.title || '';
  router.replace({ query: { ...route.query, ticket: ticket.id } });
};

const clearSelectedTicket = () => {
  selectedTicket.value = null;
  selectedWorkerForAssign.value = null;
  const q = { ...route.query };
  delete q.ticket;
  router.replace({ query: q });
};

// ── Workforce State & Filters ───────────────────────────────────────────────
const workerSearch = ref('');
const selectedSpecialty = ref('all');
const selectedWorkerForAssign = ref(null);

const totalWorkersCount = computed(() => props.store.personnel?.length || 0);
const availableWorkersCount = computed(() => {
  return props.store.personnel?.filter(w => w.status === 'Available').length || 0;
});

const filteredWorkers = computed(() => {
  let list = props.store.personnel || [];

  if (selectedSpecialty.value !== 'all') {
    list = list.filter(w => (w.specialty || w.role) === selectedSpecialty.value);
  }

  if (workerSearch.value.trim()) {
    const q = workerSearch.value.toLowerCase().trim();
    list = list.filter(w =>
      String(w.name || '').toLowerCase().includes(q) ||
      String(w.specialty || w.role || '').toLowerCase().includes(q)
    );
  }

  // Sort available technicians to the top
  return [...list].sort((a, b) => {
    if (a.status === 'Available' && b.status !== 'Available') return -1;
    if (a.status !== 'Available' && b.status === 'Available') return 1;
    return 0;
  });
});

const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const handleSelectWorker = (worker) => {
  if (worker.status === 'On Leave') {
    toast.warning('This technician is currently on leave.');
    return;
  }
  selectedWorkerForAssign.value = worker;
};

// ── Dispatch Form & Submission ──────────────────────────────────────────────
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

const submitDispatchAssignment = async () => {
  if (!selectedTicket.value) {
    toast.warning('Please select an approved ticket first.');
    return;
  }

  if (!selectedWorkerForAssign.value) {
    toast.warning('Please select a technician for this ticket.');
    return;
  }

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

    // Reset selection and refresh data
    clearSelectedTicket();

    await Promise.all([
      fetchTickets(),
      props.store.fetchPersonnel()
    ]);
  } catch (error) {
    console.error('Dispatch assignment error:', error);
    const msg = error?.response?.data?.message || 'Failed to dispatch worker.';
    toast.error(msg);
  } finally {
    submittingAssignment.value = false;
  }
};

// ── Scope Particulars / Details Modal ───────────────────────────────────────
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

const refreshData = async () => {
  await Promise.all([
    fetchTickets(),
    props.store.fetchPersonnel(),
    props.store.fetchCategories()
  ]);
};

onMounted(async () => {
  await refreshData();
});
</script>
