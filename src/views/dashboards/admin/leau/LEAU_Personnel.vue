<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/admin/leau" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        <span class="text">LEAU Home</span>
      </router-link>
      <router-link to="/admin/leau/dispatched" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
        <span class="text">Dispatched Tickets</span>
      </router-link>
      <router-link to="/admin/leau/personnel" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        <span class="text">Personnel & Assignments</span>
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

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">LEAU Operations</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Landscaping Personnel & Worker Assignment</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-6 animate-fade-in pb-12 px-4 sm:px-8 py-8 max-w-[1600px] mx-auto min-h-screen">

        <!-- Page Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div>
            <h2 class="text-3xl font-black tracking-tight text-slate-900 mb-1">LEAU Personnel & Operations</h2>
            <p class="text-sm text-slate-500 font-medium">Manage landscaping staff availability, categories, and assign approved tickets to workers.</p>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <!-- Assign Approved Ticket CTA -->
            <button
              @click="openTicketSelectorModal"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-black transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Assign Approved Ticket</span>
              <span v-if="dispatchQueue.length > 0" class="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black leading-none">
                {{ dispatchQueue.length }}
              </span>
            </button>

            <!-- Manage Categories -->
            <button
              v-if="isAdmin"
              @click="showCategoryModal = true"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-black hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
              Manage Categories
            </button>

            <!-- Add Personnel -->
            <button
              v-if="isAdmin"
              @click="openAddModal"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black transition-all shadow-sm shadow-emerald-200 active:scale-95 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              Add Personnel
            </button>
          </div>
        </div>

        <!-- ① ACTIVE ASSIGNMENT TARGET BANNER (Shown when a ticket is selected for assignment) -->
        <div v-if="selectedTicket" class="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white shadow-xl relative overflow-hidden border border-emerald-500/30 animate-scale-up">
          <div class="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <div class="flex items-center gap-3 mb-2 flex-wrap">
                <span class="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                  Active Assignment Target
                </span>
                <span class="text-sm font-black text-emerald-400 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  {{ formatTicketOrProjectLabel(selectedTicket.id) }}
                </span>
                <span v-if="selectedTicket.requester" class="text-xs text-slate-300 font-medium">
                  Requested by <strong class="text-white">{{ selectedTicket.requester }}</strong>
                </span>
              </div>
              <h3 class="text-2xl font-black text-white tracking-tight">{{ selectedTicket.type || selectedTicket.title || 'Landscaping Service Request' }}</h3>
              <p class="text-slate-300 font-medium text-xs sm:text-sm mt-1 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {{ selectedTicket.location || selectedTicket.college_building || 'Campus Grounds' }}
                <span v-if="selectedTicket.office_room" class="text-slate-400">({{ selectedTicket.office_room }})</span>
              </p>
            </div>

            <div class="flex items-center gap-3 shrink-0">
              <button
                @click="openTicketReviewModal"
                class="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all border border-white/10 cursor-pointer"
              >
                Review Ticket Details
              </button>
              <button
                @click="clearSelectedTicket"
                class="px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all border border-rose-500/30 cursor-pointer"
                title="Cancel assignment and return to standard roster"
              >
                Clear Target
              </button>
            </div>
          </div>

          <!-- Implementation Schedule Controls -->
          <div class="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 items-end">
            <!-- Implementation Date -->
            <div>
              <label for="leau-impl-date" class="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-2">
                Implementation Date <span class="text-rose-400">*</span>
              </label>
              <input
                id="leau-impl-date"
                type="date"
                v-model="selectedTicket.implementationDate"
                @change="handleTicketDateChange"
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all cursor-pointer"
              />
            </div>

            <!-- Target Working Days with EODB Tier Quick Selectors -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label for="leau-working-days" class="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  Target Duration <span class="text-rose-400">*</span>
                </label>
                <div class="flex gap-1.5">
                  <button
                    type="button"
                    @click="setEodbTier('simple')"
                    :class="['px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer', eodbTier === 'simple' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20']"
                  >
                    3d Simple
                  </button>
                  <button
                    type="button"
                    @click="setEodbTier('moderate')"
                    :class="['px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer', eodbTier === 'moderate' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20']"
                  >
                    7d Mod
                  </button>
                  <button
                    type="button"
                    @click="setEodbTier('complex')"
                    :class="['px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer', eodbTier === 'complex' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20']"
                  >
                    21d Complex
                  </button>
                </div>
              </div>
              <div class="relative">
                <input
                  id="leau-working-days"
                  type="number"
                  min="1"
                  max="180"
                  v-model.number="workingDays"
                  placeholder="e.g. 7"
                  class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                />
                <span class="absolute right-4 top-3.5 text-xs font-bold text-slate-400 pointer-events-none">Working Days</span>
              </div>
            </div>

            <!-- Priority / Emergency Option -->
            <div class="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl">
              <input
                id="leau-emergency-checkbox"
                type="checkbox"
                v-model="isEmergency"
                class="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-white/20 bg-white/10 cursor-pointer"
              />
              <label for="leau-emergency-checkbox" class="text-xs font-bold text-slate-200 cursor-pointer select-none">
                Emergency Priority Dispatch
                <span class="block text-[10px] font-medium text-slate-400">Moves this task to the top of assigned workers' queues</span>
              </label>
            </div>
          </div>

          <!-- Current Assignments & Dispatch Execution Bar -->
          <div class="relative z-10 mt-6 pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-center gap-3 flex-wrap">
              <span class="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Assigned Personnel ({{ currentAssignments.length }}):
              </span>
              <div v-if="currentAssignments.length === 0" class="text-xs text-slate-400 font-medium italic">
                Click "+ Assign to Ticket" on any available personnel in the roster below.
              </div>
              <div v-else class="flex flex-wrap gap-2">
                <div
                  v-for="assign in currentAssignments"
                  :key="assign.workerId"
                  class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-bold"
                >
                  <span>{{ assign.workerName }}</span>
                  <button
                    @click="removeAssignment(assign)"
                    class="text-slate-400 hover:text-rose-400 transition-colors p-0.5 rounded cursor-pointer"
                    title="Remove assignment"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
            </div>

            <button
              @click="dispatchAll"
              :disabled="currentAssignments.length === 0 || isDispatching"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <span>{{ isDispatching ? 'Dispatching...' : 'Dispatch Assigned Workers' }}</span>
            </button>
          </div>
        </div>

        <!-- Staff Roster Panel -->
        <div class="bg-white border border-slate-200 rounded-3xl sm:rounded-[2.5rem] p-4 sm:p-8 shadow-sm">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h3 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <span class="w-2 h-6 bg-emerald-500 rounded-full"></span>
                Staff Roster &amp; Availability Control
              </h3>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                {{ selectedTicket ? 'Select personnel below to assign to ' + formatTicketOrProjectLabel(selectedTicket.id) : 'Toggle personnel availability or click Assign Approved Ticket to schedule work' }}
              </p>
            </div>
            <div class="flex flex-wrap gap-4">
              <span class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Available</span>
              <span class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><span class="w-2 h-2 rounded-full bg-blue-500"></span> Assigned</span>
              <span class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><span class="w-2 h-2 rounded-full bg-amber-500"></span> Working</span>
              <span class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><span class="w-2 h-2 rounded-full bg-slate-300"></span> On Leave</span>
            </div>
          </div>

          <div class="space-y-8">
            <div v-if="Object.keys(groupedPersonnel).length === 0" class="flex flex-col items-center justify-center py-16 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
              <span class="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">No Personnel Found</span>
              <p class="text-sm text-slate-500 font-medium">The roster is currently empty. Click "Add Personnel" to get started.</p>
            </div>

            <div v-else v-for="(workers, role) in groupedPersonnel" :key="role">
              <h4 class="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {{ role }}s
                <span class="text-[9px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{{ workers.length }}</span>
              </h4>

              <div class="flex flex-col space-y-4">
                <div
                  v-for="worker in workers"
                  :key="worker.id"
                  class="p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm bg-slate-50/40 hover:bg-white hover:shadow-xl hover:border-slate-300 transition-all duration-300 group"
                >
                  <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between xl:justify-start gap-4 sm:gap-6 w-full xl:w-auto xl:min-w-[320px]">
                      <div class="flex items-start sm:items-center gap-3 sm:gap-4 w-full min-w-0">
                        <div class="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors shrink-0 shadow-sm font-black text-xl">
                          {{ worker.name ? worker.name.charAt(0) : 'U' }}
                        </div>
                        <div class="flex-1 min-w-0">
                          <h4 class="text-base font-black text-slate-900 leading-tight mb-1">{{ worker.name }}</h4>
                          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ worker.role }}</p>

                          <div class="mt-3 flex flex-col items-start gap-2 w-full">
                            <!-- Status Badge -->
                            <span
                              @click="toggleWorkerStatus(worker)"
                              :class="[
                                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all',
                                !worker.assignedTicket && worker.status !== 'Working' ? 'cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-emerald-500 active:scale-95' : 'cursor-default',
                                worker.status === 'Working' ? 'bg-amber-50 text-amber-600 border border-amber-200/60' :
                                worker.assignedTicket ? 'bg-blue-50 text-blue-600 border border-blue-200/60' :
                                worker.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60' : 'bg-slate-200 text-slate-500 border border-slate-300'
                              ]">
                              <span :class="['w-1.5 h-1.5 rounded-full animate-pulse', worker.status === 'Working' ? 'bg-amber-500' : worker.assignedTicket ? 'bg-blue-500' : worker.status === 'Available' ? 'bg-emerald-500' : 'bg-slate-400']"></span>
                              {{ worker.status === 'Working' ? 'Working' : worker.assignedTicket ? 'Assigned' : (worker.status || 'Available') }}
                            </span>

                            <div class="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                              <!-- Worker Assignment Action (When selectedTicket is active) -->
                              <template v-if="selectedTicket">
                                <span
                                  v-if="isWorkerAssignedToSelected(worker.id)"
                                  class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-black uppercase tracking-wider"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                                  Assigned
                                </span>
                                <button
                                  v-else-if="worker.status === 'On Leave'"
                                  disabled
                                  class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider cursor-not-allowed border border-slate-200"
                                >
                                  On Leave
                                </button>
                                <button
                                  v-else
                                  @click="assignWorkerToCurrentTicket(worker)"
                                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" /></svg>
                                  {{ worker.status === 'Working' || worker.assignedTicket ? 'Queue as Next' : 'Assign to Ticket' }}
                                </button>
                              </template>

                              <!-- Status Toggle Button -->
                              <button
                                @click="handleWorkerStatusClick(worker)"
                                class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm border"
                                :class="worker.status === 'On Leave' ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600 shadow-emerald-500/20 active:scale-95 cursor-pointer' : (worker.status === 'Working' || worker.assignedTicket) ? 'bg-amber-50 hover:bg-rose-50 text-amber-700 hover:text-rose-700 border-amber-200 hover:border-rose-200 active:scale-95 cursor-pointer' : 'bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border-slate-200 hover:border-rose-200 active:scale-95 cursor-pointer'"
                              >
                                {{ worker.status === 'On Leave' ? 'Set Available' : (worker.assignedTicket || worker.status === 'Working') ? 'Leave (Active Job)' : 'Set On Leave' }}
                              </button>

                              <!-- Delete button — only if not active and admin -->
                              <button
                                v-if="worker.status !== 'Working' && !worker.assignedTicket && isAdmin"
                                @click="confirmDelete(worker)"
                                class="w-8 h-8 flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-95 shrink-0 cursor-pointer"
                                title="Remove personnel"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Workload / Task Display Columns -->
                    <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 xl:max-w-3xl items-stretch">
                      <div
                        v-if="worker.status === 'Working' || worker.assignedTicket"
                        @click="toggleTicketExtension(worker.id, worker.assignedTicket)"
                        class="h-full min-h-[140px] p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between bg-white shadow-xs hover:shadow-md"
                        :class="expandedTickets[worker.id] === worker.assignedTicket ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20' : worker.status === 'Working' ? 'border-amber-200 hover:border-amber-400' : 'border-blue-200 hover:border-blue-400'"
                      >
                        <div>
                          <div class="flex items-center justify-between gap-2 mb-2">
                            <span class="text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5" :class="worker.status === 'Working' ? 'text-amber-700' : 'text-blue-700'">
                              <span class="w-2 h-2 rounded-full animate-pulse" :class="worker.status === 'Working' ? 'bg-amber-500' : 'bg-blue-500'"></span>
                              {{ worker.status === 'Working' ? 'Currently Working On' : 'Currently Assigned To' }}
                            </span>
                            <span class="text-[10px] font-black px-2.5 py-1 rounded-lg" :class="worker.status === 'Working' ? 'bg-amber-200/80 text-amber-900' : 'bg-blue-200/80 text-blue-900'">{{ formatTicketOrProjectLabel(worker.assignedTicket) }}</span>
                          </div>
                          <p class="text-sm font-bold leading-snug text-slate-800">{{ worker.ticketTask || 'Assigned Work' }}</p>
                        </div>
                        <div class="mt-3 pt-2.5 border-t flex items-center justify-between text-[10px] font-bold text-slate-600" :class="worker.status === 'Working' ? 'border-amber-200/60' : 'border-blue-200/60'">
                          <span>Scheduled Date:</span>
                          <strong class="font-bold text-slate-800">{{ worker.implementationDate }}</strong>
                        </div>
                      </div>
                      <div v-else class="h-full min-h-[140px] p-4 rounded-2xl bg-slate-100/50 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Active Assignment</span>
                        <p class="text-[11px] text-slate-400 mt-0.5">Worker is currently {{ worker.status ? worker.status.toLowerCase() : 'available' }}.</p>
                      </div>

                      <div 
                        v-if="worker.nextAssignment" 
                        @click="toggleTicketExtension(worker.id, worker.nextAssignment.ticketId)" 
                        class="h-full min-h-[140px] p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between bg-white shadow-xs hover:shadow-md group"
                        :class="expandedTickets[worker.id] === worker.nextAssignment.ticketId ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20' : 'border-purple-200 hover:border-purple-400 text-purple-900'"
                        title="Click to expand brief ticket info"
                      >
                        <div>
                          <div class="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                            <span class="flex items-center gap-1.5 text-purple-600">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                              Next Queued Job
                            </span>
                            <span class="font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm transition-transform group-hover:scale-105" :class="expandedTickets[worker.id] === worker.nextAssignment.ticketId ? 'bg-emerald-600 text-white' : 'bg-purple-100 text-purple-800'">
                              {{ formatTicketOrProjectLabel(worker.nextAssignment.ticketId) }}
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 transition-transform" :class="expandedTickets[worker.id] === worker.nextAssignment.ticketId ? 'rotate-180 text-white' : 'opacity-60'" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                            </span>
                          </div>
                          <p class="text-sm font-bold text-slate-800">{{ worker.nextAssignment.task || 'Assigned Work' }}</p>
                        </div>
                        <div class="mt-3 pt-2.5 border-t border-purple-100 flex items-center justify-between text-[10px] font-bold text-purple-700">
                          <span>Target Date:</span>
                          <span class="text-slate-800">{{ worker.nextAssignment.date }}</span>
                        </div>
                      </div>
                      <div v-else class="h-full min-h-[140px] p-4 rounded-2xl bg-slate-100/50 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Next Job Queued</span>
                        <p class="text-[11px] text-slate-400 mt-0.5">No upcoming tickets assigned.</p>
                      </div>
                    </div>
                  </div>

                  <!-- Inline Brief Ticket Extension inside container -->
                  <div v-if="expandedTickets[worker.id]" class="mt-6 pt-6 border-t border-slate-200/80 animate-fade-in">
                    <div v-if="getTicketDetailsForExtension(expandedTickets[worker.id])" class="bg-slate-900 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
                      <div class="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800 relative z-10">
                        <div class="flex flex-wrap items-center gap-2.5">
                          <span class="text-lg font-black tracking-tight text-white">{{ formatTicketOrProjectLabel(expandedTickets[worker.id]) }}</span>
                          <span class="text-xs font-bold text-slate-400">({{ getTicketDetailsForExtension(expandedTickets[worker.id]).type }})</span>
                        </div>
                        <button @click="expandedTickets[worker.id] = null" class="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 text-slate-300 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-1.5 cursor-pointer">
                          Close Extension
                        </button>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
                        <div>
                          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Target Location</span>
                          <p class="text-sm font-bold text-slate-200">{{ getTicketDetailsForExtension(expandedTickets[worker.id]).location }}</p>
                        </div>
                        <div>
                          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Requester Info</span>
                          <p class="text-sm font-bold text-slate-200">{{ getTicketDetailsForExtension(expandedTickets[worker.id]).requester }}</p>
                        </div>
                        <div>
                          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Target Date</span>
                          <p class="text-sm font-bold text-emerald-400">{{ getTicketDetailsForExtension(expandedTickets[worker.id]).date }}</p>
                        </div>
                      </div>

                      <div class="mt-4 pt-4 border-t border-slate-800/80 relative z-10">
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Job Particulars / Scope</span>
                        <p class="text-xs text-slate-300 font-medium leading-relaxed italic">"{{ getTicketDetailsForExtension(expandedTickets[worker.id]).desc }}"</p>
                      </div>
                    </div>
                    <div v-else class="p-6 bg-slate-900 rounded-2xl text-slate-400 text-xs text-center">
                      Fetching ticket particulars...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Add Personnel Modal -->
      <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div class="bg-white rounded-3xl sm:rounded-[2rem] w-full max-w-md p-6 sm:p-8 shadow-2xl border border-slate-100 animate-scale-up">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-black text-slate-900">Add Personnel</h3>
            <button @click="closeAddModal" class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form @submit.prevent="submitAddPersonnel" class="space-y-4">
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">First Name *</label>
              <input v-model="form.firstName" required placeholder="e.g. Maria" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Middle Initial</label>
                <input v-model="form.middleInitial" maxlength="2" placeholder="e.g. S." class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Name Extension</label>
                <input v-model="form.nameExtension" placeholder="e.g. Jr., III" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Last Name *</label>
              <input v-model="form.lastName" required placeholder="e.g. Santos" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Specialty / Role *</label>
              <select v-model="form.specialty" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
                <option value="" disabled>Select Specialty</option>
                <option v-for="cat in store.categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
              </select>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
              <button type="button" @click="closeAddModal" class="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-black text-slate-600 hover:bg-slate-50 cursor-pointer">Cancel</button>
              <button type="submit" :disabled="submitting" class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black transition-all shadow-sm shadow-emerald-200 active:scale-95 disabled:opacity-50 cursor-pointer">
                {{ submitting ? 'Saving...' : 'Add Personnel' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Category Management Modal -->
      <div v-if="showCategoryModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div class="bg-white rounded-3xl sm:rounded-[2rem] w-full max-w-md p-6 sm:p-8 shadow-2xl border border-slate-100 animate-scale-up">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-black text-slate-900">Manage Categories</h3>
            <button @click="showCategoryModal = false" class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form @submit.prevent="submitCategory" class="flex items-center gap-2 mb-6">
            <input v-model="newCategoryName" placeholder="New category name..." class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <button type="submit" :disabled="categorySubmitting || !newCategoryName.trim()" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer">Add</button>
          </form>

          <div class="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            <div v-if="store.categories.length === 0" class="text-xs text-slate-400 font-bold text-center py-4">No custom categories yet.</div>
            <div v-else v-for="cat in store.categories" :key="cat.id" class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div v-if="editingCategory === cat.id" class="flex items-center gap-2 flex-1 mr-2">
                <input v-model="editingCategoryName" class="flex-1 px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-bold text-slate-800" />
                <button @click="saveCategory(cat)" :disabled="categoryUpdating" class="text-xs font-black text-emerald-600 hover:text-emerald-700 cursor-pointer">Save</button>
                <button @click="cancelEditingCategory" class="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer">Cancel</button>
              </div>
              <span v-else class="text-xs font-black text-slate-800">{{ cat.name }}</span>

              <div v-if="editingCategory !== cat.id" class="flex items-center gap-2">
                <button @click="startEditingCategory(cat)" class="text-slate-400 hover:text-slate-700 p-1 cursor-pointer" title="Edit">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
                <button @click="deleteCategory(cat)" :disabled="categoryDeleting === cat.id" class="text-rose-400 hover:text-rose-600 p-1 cursor-pointer" title="Delete">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="workerToDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div class="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-slate-100 text-center animate-scale-up">
          <div class="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h4 class="text-base font-black text-slate-900 mb-1">Remove Personnel</h4>
          <p class="text-xs text-slate-500 mb-6">Are you sure you want to remove <strong class="text-slate-800">{{ workerToDelete.name }}</strong> from the roster?</p>
          <div class="flex items-center justify-center gap-3">
            <button @click="workerToDelete = null" class="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 cursor-pointer">Cancel</button>
            <button @click="submitDelete" :disabled="deleteSubmitting" class="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-black transition-all shadow-sm shadow-rose-200 active:scale-95 disabled:opacity-50 cursor-pointer">
              {{ deleteSubmitting ? 'Removing...' : 'Yes, Remove' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Staff Leave Modal -->
      <StaffLeaveModal
        :is-open="showLeaveModal"
        :worker="workerForLeaveModal"
        :available-workers="availableWorkersList"
        unit-code="LEAU"
        @close="showLeaveModal = false"
        @updated="handleLeaveUpdated"
      />

      <!-- Assign Approved Ticket Selector Modal -->
      <div v-if="showTicketSelectorModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div class="bg-white rounded-3xl sm:rounded-[2rem] w-full max-w-2xl p-6 sm:p-8 shadow-2xl border border-slate-100 animate-scale-up flex flex-col max-h-[85vh]">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-xl font-black text-slate-900">Assign Approved Ticket</h3>
              <p class="text-xs text-slate-500 font-medium">Select a ticket approved by the Director to assign landscaping personnel.</p>
            </div>
            <button @click="showTicketSelectorModal = false" class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <!-- Search filter -->
          <div class="mb-4">
            <input
              v-model="ticketSearchQuery"
              placeholder="Search by ticket ID, service, location, or requester..."
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <!-- List of Approved Tickets -->
          <div class="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
            <div v-if="filteredDispatchQueue.length === 0" class="py-12 text-center text-slate-400">
              <p class="text-xs font-bold uppercase tracking-wider">No approved tickets awaiting assignment</p>
              <p class="text-[11px] text-slate-400 mt-1">All approved service requests have already been dispatched.</p>
            </div>

            <div
              v-for="t in filteredDispatchQueue"
              :key="t.id"
              class="p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                    #{{ t.id }}
                  </span>
                  <span class="text-xs font-bold text-slate-500">{{ t.service || t.type }}</span>
                </div>
                <h4 class="text-sm font-black text-slate-900 truncate">{{ t.title || t.type }}</h4>
                <p class="text-xs text-slate-500 font-medium mt-0.5">
                  {{ t.location || t.college_building }} <span v-if="t.office_room">({{ t.office_room }})</span> · {{ t.requester }}
                </p>
              </div>

              <button
                @click="selectTicketForAssignment(t)"
                class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
              >
                Assign Workers
              </button>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-slate-100 flex justify-end">
            <button
              @click="showTicketSelectorModal = false"
              class="px-5 py-2 rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- Ticket Review Details Modal -->
      <div v-if="showReviewModal && reviewTicket" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div class="bg-white rounded-3xl sm:rounded-[2.5rem] w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden animate-scale-up max-h-[85vh] flex flex-col">
          <div class="bg-slate-900 p-6 text-white flex items-center justify-between border-b-4 border-emerald-500">
            <div>
              <span class="px-2.5 py-0.5 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full inline-block mb-1">
                Ticket Particulars
              </span>
              <h3 class="text-xl font-black">{{ formatTicketOrProjectLabel(reviewTicket.id) }} — {{ reviewTicket.type || reviewTicket.title }}</h3>
            </div>
            <button @click="showReviewModal = false" class="text-slate-400 hover:text-white transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div class="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Location / Building</span>
                <p class="text-xs font-bold text-slate-900">{{ reviewTicket.location || reviewTicket.college_building || 'Campus Grounds' }}</p>
              </div>
              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Office / Room</span>
                <p class="text-xs font-bold text-slate-900">{{ reviewTicket.office_room || 'N/A' }}</p>
              </div>
              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Requester Name</span>
                <p class="text-xs font-bold text-slate-900">{{ reviewTicket.requester }}</p>
              </div>
              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Source of Fund</span>
                <p class="text-xs font-bold text-slate-900">{{ reviewTicket.source_of_fund || 'N/A' }}</p>
              </div>
            </div>

            <div>
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Scope / Particulars</span>
              <div class="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-medium text-slate-700 leading-relaxed italic">
                "{{ reviewTicket.job_description || reviewTicket.description || 'No detailed scope provided.' }}"
              </div>
            </div>

            <!-- Attachments -->
            <div v-if="reviewTicket.attachments && reviewTicket.attachments.length > 0">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Attachments</span>
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="file in reviewTicket.attachments"
                  :key="file.id"
                  @click="downloadAttachment(file)"
                  class="px-3.5 py-2 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                  <span>{{ file.file_name || 'Download Attachment' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
            <button
              @click="showReviewModal = false"
              class="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>

    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import StaffLeaveModal from '@/components/StaffLeaveModal.vue';
import { useLeauPersonnelStore } from '@/stores/leauPersonnel';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'vue3-toastify';
import api from '@/api/client';
import { formatTicketOrProjectLabel, isProjectIdentifier } from '@/utils/projectFormatter';

const route = useRoute();
const router = useRouter();
const store = useLeauPersonnelStore();
const authStore = useAuthStore();

const isAdmin = computed(() => {
  const role = authStore.role || authStore.user?.role;
  return role === 'admin' || role === 'superadmin' || role === 'director';
});

const groupedPersonnel = computed(() => store.groupedPersonnel);
const availableWorkersList = computed(() => store.personnel);

// ── Modals & State ──────────────────────────────────────────────────────────
const showAddModal = ref(false);
const showCategoryModal = ref(false);
const showLeaveModal = ref(false);
const workerForLeaveModal = ref(null);
const workerToDelete = ref(null);
const expandedTickets = ref({});

// ── Add Personnel Form ──────────────────────────────────────────────────────
const form = reactive({
  firstName: '',
  middleInitial: '',
  lastName: '',
  nameExtension: '',
  specialty: ''
});
const submitting = ref(false);

const openAddModal = () => {
  form.firstName = '';
  form.middleInitial = '';
  form.lastName = '';
  form.nameExtension = '';
  form.specialty = store.categories[0]?.name || '';
  showAddModal.value = true;
};

const closeAddModal = () => {
  showAddModal.value = false;
};

const submitAddPersonnel = async () => {
  if (!form.firstName || !form.lastName || !form.specialty) {
    toast.error('Please fill in all required fields.');
    return;
  }
  submitting.value = true;
  try {
    await store.addPersonnel(form);
    toast.success('Personnel added successfully!');
    closeAddModal();
  } catch (err) {
    const msg = err?.response?.data?.message || 'Failed to add personnel.';
    toast.error(msg);
  } finally {
    submitting.value = false;
  }
};

// ── Category Management ─────────────────────────────────────────────────────
const newCategoryName  = ref('');
const categorySubmitting = ref(false);
const categoryDeleting = ref(null);
const editingCategory = ref(null);
const editingCategoryName = ref('');
const categoryUpdating = ref(false);

const startEditingCategory = (cat) => {
  editingCategory.value = cat.id;
  editingCategoryName.value = cat.name;
};

const cancelEditingCategory = () => {
  editingCategory.value = null;
  editingCategoryName.value = '';
};

const saveCategory = async (cat) => {
  if (!editingCategoryName.value.trim() || editingCategoryName.value.trim() === cat.name) {
    cancelEditingCategory();
    return;
  }
  categoryUpdating.value = true;
  try {
    await store.updateCategory(cat.id, editingCategoryName.value.trim());
    toast.success('Category updated.');
    cancelEditingCategory();
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to update category.');
  } finally {
    categoryUpdating.value = false;
  }
};

const submitCategory = async () => {
  if (!newCategoryName.value.trim()) return;
  categorySubmitting.value = true;
  try {
    await store.addCategory(newCategoryName.value.trim());
    toast.success('Category added!');
    newCategoryName.value = '';
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to add category.');
  } finally {
    categorySubmitting.value = false;
  }
};

const deleteCategory = async (cat) => {
  categoryDeleting.value = cat.id;
  try {
    await store.removeCategory(cat.id);
    toast.success(`${cat.name} category removed.`);
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to remove category.');
  } finally {
    categoryDeleting.value = null;
  }
};

// ── Delete Personnel ───────────────────────────────────────────────────────
const deleteSubmitting = ref(false);

const confirmDelete = (worker) => {
  workerToDelete.value = worker;
};

const submitDelete = async () => {
  if (!workerToDelete.value) return;
  deleteSubmitting.value = true;
  try {
    await store.removePersonnel(workerToDelete.value.id);
    toast.success(`${workerToDelete.value.name} removed from roster.`);
    workerToDelete.value = null;
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to remove personnel.');
  } finally {
    deleteSubmitting.value = false;
  }
};

// ── Status Toggle ──────────────────────────────────────────────────────────
const toggleWorkerStatus = (worker) => {
  handleWorkerStatusClick(worker);
};

const handleWorkerStatusClick = (worker) => {
  if (worker.status === 'On Leave') {
    store.toggleWorkerStatus(worker.id);
  } else if (worker.status === 'Working' || worker.assignedTicket) {
    workerForLeaveModal.value = worker;
    showLeaveModal.value = true;
  } else {
    store.toggleWorkerStatus(worker.id);
  }
};

const handleLeaveUpdated = async () => {
  toast.success('Personnel leave status updated successfully.');
  await store.fetchPersonnel();
};

// ── Worker Assignment & Scheduling Integration ──────────────────────────────
const selectedTicket = ref(null);
const workingDays = ref(7);
const eodbTier = ref('moderate');
const isEmergency = ref(false);
const isDispatching = ref(false);

const dispatchQueue = ref([]);
const showTicketSelectorModal = ref(false);
const ticketSearchQuery = ref('');

const showReviewModal = ref(false);
const reviewTicket = ref(null);

const setEodbTier = (tier) => {
  eodbTier.value = tier;
  if (tier === 'simple') workingDays.value = 3;
  else if (tier === 'moderate') workingDays.value = 7;
  else if (tier === 'complex') workingDays.value = 21;
};

const fetchDispatchQueue = async () => {
  try {
    const res = await api.get('tickets/dispatch/LEAU');
    if (res.data?.data?.tickets) {
      dispatchQueue.value = res.data.data.tickets.map(t => ({
        id: t.id,
        title: t.title,
        service: t.service_type,
        type: t.title || t.project_title || t.service_type || 'Landscaping Task',
        requester: t.details?.requesting_personnel || 'End User',
        location: t.location,
        college_building: t.details?.college_building || t.location,
        office_room: t.office_room || t.details?.office_room,
        job_description: t.description,
        source_of_fund: t.details?.source_of_fund || 'N/A',
        contact_number: t.details?.contact_number || 'N/A',
        submittedAt: new Date(t.submitted_at).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        }),
        attachments: t.attachments || [],
        implementationDate: ''
      }));
    }
  } catch (error) {
    console.error('Failed to fetch dispatch queue:', error);
  }
};

const filteredDispatchQueue = computed(() => {
  if (!ticketSearchQuery.value.trim()) return dispatchQueue.value;
  const q = ticketSearchQuery.value.toLowerCase().trim();
  return dispatchQueue.value.filter(t => 
    String(t.id).toLowerCase().includes(q) ||
    String(t.type || '').toLowerCase().includes(q) ||
    String(t.requester || '').toLowerCase().includes(q) ||
    String(t.location || '').toLowerCase().includes(q)
  );
});

const openTicketSelectorModal = () => {
  ticketSearchQuery.value = '';
  fetchDispatchQueue();
  showTicketSelectorModal.value = true;
};

const selectTicketForAssignment = (ticket) => {
  selectedTicket.value = {
    ...ticket,
    implementationDate: ticket.implementationDate || new Date().toISOString().split('T')[0]
  };
  showTicketSelectorModal.value = false;
  router.replace({ query: { ...route.query, ticket: ticket.id } });
};

const clearSelectedTicket = () => {
  selectedTicket.value = null;
  const nextQuery = { ...route.query };
  delete nextQuery.ticket;
  router.replace({ query: nextQuery });
};

const currentAssignments = computed(() => {
  if (!selectedTicket.value) return [];
  return store.personnel
    .filter(w => w.assignedTicket === selectedTicket.value.id || (w.nextAssignment && w.nextAssignment.ticketId === selectedTicket.value.id))
    .map(w => ({
      workerId: w.id,
      workerName: w.name,
      ticketId: selectedTicket.value.id,
      implementationDate: w.assignedTicket === selectedTicket.value.id ? w.implementationDate : (w.nextAssignment ? w.nextAssignment.date : null)
    }));
});

const isWorkerAssignedToSelected = (workerId) => {
  return currentAssignments.value.some(a => a.workerId === workerId);
};

const assignWorkerToCurrentTicket = (worker) => {
  if (!selectedTicket.value) return;
  if (!selectedTicket.value.implementationDate) {
    toast.error('Please set an implementation date first.');
    return;
  }
  if (!workingDays.value || Number(workingDays.value) < 1) {
    toast.error('Please specify the target working days.');
    return;
  }

  const dateStr = new Date(selectedTicket.value.implementationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const taskDesc = selectedTicket.value.type || 'Janitorial & Landscaping Work';

  store.assignWorker(worker.id, selectedTicket.value.id, dateStr, taskDesc, isEmergency.value);
  toast.success(`${worker.name} assigned to ${formatTicketOrProjectLabel(selectedTicket.value.id)}`);
};

const removeAssignment = (assign) => {
  store.unassignWorker(assign.workerId, selectedTicket.value?.id);
  toast.info(`Removed assignment for ${assign.workerName}`);
};

const handleTicketDateChange = () => {
  if (selectedTicket.value && selectedTicket.value.implementationDate) {
    const dateStr = new Date(selectedTicket.value.implementationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    store.updateTicketDate(selectedTicket.value.id, dateStr);
  }
};

const dispatchAll = async () => {
  if (!selectedTicket.value) return;
  if (currentAssignments.value.length === 0) {
    toast.error('No workers assigned to dispatch.');
    return;
  }
  if (!selectedTicket.value.implementationDate) {
    toast.error('Please set an implementation date before dispatching.');
    return;
  }
  if (!workingDays.value || Number(workingDays.value) < 1) {
    toast.error('Please set the number of working days.');
    return;
  }

  isDispatching.value = true;
  try {
    for (const assign of currentAssignments.value) {
      const worker = store.personnel.find(w => w.id === assign.workerId);
      if (worker && (worker.status === 'Available' || worker.status === 'Working' || worker.assignedTicket)) {
        await api.post('dispatch/assign', {
          ticket_id: selectedTicket.value.id,
          personnel_id: assign.workerId,
          implementation_date: selectedTicket.value.implementationDate,
          working_days: Number(workingDays.value),
          task_notes: isProjectIdentifier(selectedTicket.value) ? (selectedTicket.value.type || 'Landscaping Project Work') : (selectedTicket.value.type || 'Janitorial & Landscaping Work'),
          is_emergency: isEmergency.value ? 1 : 0,
          eodb_tier: eodbTier.value || 'moderate'
        });
      }
    }
    toast.success(`Workers successfully dispatched for ${formatTicketOrProjectLabel(selectedTicket.value.id)}!`);
    await fetchDispatchQueue();
    clearSelectedTicket();
    router.push('/admin/leau/dispatched');
  } catch (error) {
    console.error('Dispatch failed:', error);
    toast.error('Failed to dispatch workers. Please verify connection.');
  } finally {
    isDispatching.value = false;
  }
};

const openTicketReviewModal = () => {
  reviewTicket.value = selectedTicket.value;
  showReviewModal.value = true;
};

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

// ── Ticket Extension Details ────────────────────────────────────────────────
const fetchedTicketDetails = ref({});

const getTicketDetailsForExtension = (ticketId) => {
  return fetchedTicketDetails.value[ticketId] || null;
};

const toggleTicketExtension = async (workerId, ticketId) => {
  if (!ticketId) return;
  if (expandedTickets.value[workerId] === ticketId) {
    expandedTickets.value[workerId] = null;
  } else {
    expandedTickets.value[workerId] = ticketId;
    if (!fetchedTicketDetails.value[ticketId]) {
      try {
        const response = await api.get(`tickets/${ticketId}`);
        const t = response.data?.data?.ticket;
        if (t) {
          fetchedTicketDetails.value[ticketId] = {
            id: t.id,
            title: t.title,
            service: t.service_type,
            type: t.title || t.service_type || t.type || 'Landscaping Task',
            location: t.location,
            requester: isProjectIdentifier(ticketId) ? t.project_target_duration || 'Ongoing' : (t.details?.requesting_personnel || 'End User'),
            date: isProjectIdentifier(ticketId) ? (t.project_target_date ? new Date(t.project_target_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'To be scheduled') : new Date(t.submitted_at || t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            desc: t.description || t.job_description || 'No description provided.'
          };
        }
      } catch (e) {
        console.error('Failed to fetch brief ticket details', e);
      }
    }
  }
};

let pollingInterval = null;

onMounted(async () => {
  await store.fetchPersonnel();
  await store.fetchCategories();
  await fetchDispatchQueue();

  const ticketParam = route.query.ticket;
  if (ticketParam) {
    try {
      const res = await api.get(`tickets/${ticketParam}`);
      const t = res.data?.data?.ticket;
      if (t) {
        selectedTicket.value = {
          id: t.id,
          title: t.title,
          service: t.service_type,
          type: t.title || t.project_title || t.service_type || t.type,
          location: t.location,
          requester: t.details?.requesting_personnel || 'End User',
          college_building: t.details?.college_building || t.location,
          office_room: t.office_room || t.details?.office_room,
          source_of_fund: t.details?.source_of_fund || 'N/A',
          contact_number: t.details?.contact_number || 'N/A',
          job_description: t.description,
          attachments: t.attachments || [],
          submittedAt: new Date(t.submitted_at).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          }),
          implementationDate: new Date().toISOString().split('T')[0]
        };
      }
    } catch (err) {
      console.error('Failed to load initial query ticket:', err);
    }
  }

  pollingInterval = setInterval(() => {
    if (document.hidden) return;
    store.fetchPersonnel();
  }, 15000);
});

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval);
});
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes scale-up { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
.animate-scale-up { animation: scale-up 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
</style>
