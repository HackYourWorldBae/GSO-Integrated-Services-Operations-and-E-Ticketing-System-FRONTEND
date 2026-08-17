<template>
  <MainLayout>
    <template #sidebar-links>

      <router-link to="/dispatcher/leau" class="nav-item active">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
        <span class="text">Ticket Queue</span>
      </router-link>
      <router-link to="/dispatcher/leau/workers" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span class="text">Assign Workers</span>
      </router-link>
      <router-link to="/dispatcher/leau/dispatched" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <span class="text">Dispatched Tickets</span>
      </router-link>
      <router-link to="/dispatcher/leau/archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span class="text">Archives</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">Landscaping Assignment</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">LEAU Operations</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in max-w-5xl mx-auto">

        <!-- ① Selected Ticket / Project Header -->
        <div v-if="selectedTicket" class="p-4 sm:p-8 rounded-3xl sm:rounded-[2.5rem] bg-slate-900 shadow-xl overflow-hidden relative flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          <div class="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
          <div class="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
            <div class="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-sm self-start md:self-auto">
              <span class="text-2xl font-black text-emerald-400">#</span>
            </div>
            <div>
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-2xl font-black text-white tracking-tight">{{ selectedTicket.type }}</h3>
                <span class="px-2 py-1 bg-white/10 text-white rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10">{{ formatTicketOrProjectLabel(selectedTicket.id) }}</span>
              </div>
              <p class="text-slate-400 font-bold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {{ selectedTicket.location }}
              </p>
            </div>
          </div>
          <div class="relative z-10 flex flex-row gap-4">
            <button @click="openTicketModal(selectedTicket)" class="px-5 py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-black text-[10px] uppercase tracking-widest rounded-xl transition-colors shadow-sm self-center">{{ isProjectIdentifier(selectedTicket) ? 'Show Project Info' : 'Review Ticket' }}</button>
            <router-link to="/dispatcher/leau" class="p-3 bg-white hover:bg-slate-900 hover:text-white text-slate-600 rounded-xl transition-all shadow-sm border border-emerald-100 items-center justify-center flex self-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </router-link>
          </div>
        </div>

        <div v-else class="p-12 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <h3 class="text-xl font-black text-slate-900 mb-2">No Assignment Target Selected</h3>
          <p class="text-slate-500 font-bold max-w-sm">Please return to the landscaping queue or project announcements and select a specific item to assign personnel.</p>
          <router-link to="/dispatcher/leau" class="mt-8 px-8 py-3 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/20 active:scale-95">Return to Ticket Queue</router-link>
        </div>

        <!-- ② Current Assignments Panel -->
        <div v-if="selectedTicket && currentAssignments.length > 0" class="p-4 sm:p-8 rounded-3xl sm:rounded-[2.5rem] bg-slate-900 shadow-xl overflow-hidden relative">
          <div class="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div class="flex items-center justify-between mb-6 relative z-10">
            <h3 class="text-white font-black text-xl flex items-center gap-3">
              <span class="w-2 h-6 bg-blue-400 rounded-full"></span>
              Current Assignments for {{ formatTicketOrProjectLabel(selectedTicket.id) }}
            </h3>
            <span class="px-3 py-1 bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-500/30">
              {{ currentAssignments.length }} Assigned
            </span>
          </div>
          <div class="space-y-3 relative z-10">
            <div v-for="assign in currentAssignments" :key="assign.workerId"
              class="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm gap-4">
              <div class="flex items-center gap-5">
                <div class="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black shrink-0">
                  {{ assign.workerName.charAt(0) }}
                </div>
                <div>
                  <span class="text-white font-bold block">{{ assign.workerName }}</span>
                  <span class="text-[10px] font-medium text-blue-400 uppercase tracking-widest">Assigned to {{ formatTicketOrProjectLabel(assign.ticketId) }}</span>
                </div>
              </div>
              <div class="flex items-center gap-4 flex-wrap">
                <div class="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span class="text-[10px] font-black text-slate-300 uppercase tracking-widest">{{ assign.implementationDate || 'No date set' }}</span>
                </div>
                <button @click="removeAssignment(assign)" class="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors border border-white/5 hover:border-rose-500/30">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          </div>
          <div class="mt-8 flex justify-end relative z-10 border-t border-white/10 pt-8">
            <button @click="dispatchAll" class="px-8 py-3 bg-emerald-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Dispatch Assigned Workers
            </button>
          </div>
        </div>

        <!-- NEW: Implementation Schedule Section -->
        <div v-if="selectedTicket" class="p-4 sm:p-8 rounded-3xl sm:rounded-[2.5rem] bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden animate-fade-in" style="animation-delay: 0.1s;">
          <div class="absolute -right-20 -top-20 w-64 h-64 bg-emerald-50 rounded-full blur-3xl pointer-events-none"></div>
          <div class="relative z-10">
            <h3 class="text-xl font-black text-slate-900 flex items-center gap-3 mb-2">
              <span class="w-2 h-6 bg-emerald-500 rounded-full"></span>
              Implementation Schedule
            </h3>
            <p class="text-sm font-medium text-slate-500">Set the target date for when the assigned workers should execute this task.</p>
          </div>
          
          <div class="relative z-10 flex items-center gap-4 bg-slate-50 p-3 rounded-3xl border border-slate-200 shadow-inner group transition-all hover:bg-emerald-50/50 hover:border-emerald-200">
            <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100 transition-transform group-hover:scale-105 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
            </div>
            <div class="flex flex-col pr-4">
              <label for="impl-date" class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 cursor-pointer group-hover:text-emerald-700 transition-colors">Target Date</label>
              <input 
                id="impl-date" 
                type="date" 
                v-model="selectedTicket.implementationDate" 
                @change="handleTicketDateChange" 
                class="bg-transparent text-slate-900 text-base font-black outline-none cursor-pointer min-w-[150px] custom-date-input" 
              />
            </div>
          </div>
        </div>

        <!-- ③ Personnel List -->
        <div class="p-4 sm:p-8 rounded-3xl sm:rounded-[2.5rem] bg-white border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between mb-8 flex-wrap gap-4">
            <h3 class="text-lg font-black text-slate-900 flex items-center gap-2">
              <span class="w-2 h-6 bg-emerald-500 rounded-full"></span>
              Gardeners & Maintenance
            </h3>
            <div class="flex items-center gap-6 flex-wrap">
              <div class="flex gap-3 flex-wrap">
                <span class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Available</span>
                <span class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><span class="w-2 h-2 rounded-full bg-blue-500"></span> Assigned</span>
                <span class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><span class="w-2 h-2 rounded-full bg-amber-500"></span> Working</span>
                <span class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><span class="w-2 h-2 rounded-full bg-slate-400"></span> On Leave</span>
              </div>
              <div class="h-6 w-[1px] bg-slate-200"></div>
              <button @click="isManagementMode = !isManagementMode"
                :class="['px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border', isManagementMode ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300']">
                {{ isManagementMode ? 'Exit Management' : 'Manage Status' }}
              </button>
            </div>
          </div>

          <div v-if="isManagementMode" class="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl animate-fade-in">
            <p class="text-[10px] font-bold text-emerald-700 uppercase tracking-widest flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Management Mode Active: Click on status badges to toggle between Available and On Leave.
            </p>
          </div>

          <div class="space-y-4">
            <div v-for="(workers, role) in groupedPersonnel" :key="role">
              <h4 class="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {{ role }}s
                <span class="text-[9px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{{ workers.length }}</span>
              </h4>
              <div class="space-y-4">
                <div v-for="worker in workers" :key="worker.id"
                  :class="[
                    'p-4 sm:p-6 rounded-3xl border transition-all duration-300 group shadow-sm',
                    worker.status === 'Working' ? 'border-amber-200 bg-amber-50/40 hover:bg-white hover:shadow-xl' :
                    worker.assignedTicket ? 'border-blue-200 bg-blue-50/30 hover:bg-white hover:shadow-xl' :
                    'border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-slate-300 hover:shadow-xl'
                  ]">
                  <!-- Main Row Container -->
                  <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    <!-- Left column: Worker Info & Status -->
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between xl:justify-start gap-4 sm:gap-6 w-full xl:w-auto xl:min-w-[300px]">
                      <div class="flex items-start sm:items-center gap-3 sm:gap-4 w-full min-w-0">
                        <div :class="[
                          'w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-colors shrink-0 shadow-sm border border-slate-200/60 bg-white',
                          worker.status === 'Working' ? 'text-amber-600 group-hover:bg-amber-50' :
                          worker.assignedTicket ? 'text-blue-600 group-hover:bg-blue-50' :
                          'text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600'
                        ]">
                          {{ worker.name.charAt(0) }}
                        </div>
                        <div>
                          <h4 class="text-base font-black text-slate-900 leading-tight mb-1">{{ worker.name }}</h4>
                          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{{ worker.role }}</p>
                          <div class="mt-3 flex flex-col items-start gap-2.5 w-full">
                            <!-- Status Badge -->
                            <span
                              @click="toggleManagementStatus(worker)"
                              :class="[
                                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all',
                                isManagementMode && !worker.assignedTicket && worker.status !== 'Working' ? 'cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-emerald-500 active:scale-95' : 'cursor-default',
                                worker.status === 'Working' ? 'bg-amber-50 text-amber-600 border border-amber-200/60' :
                                worker.assignedTicket ? 'bg-blue-50 text-blue-600 border border-blue-200/60' :
                                worker.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60' : 'bg-slate-200 text-slate-500 border border-slate-300'
                              ]">
                              <span :class="[
                                'w-1.5 h-1.5 rounded-full animate-pulse',
                                worker.status === 'Working' ? 'bg-amber-500' :
                                worker.assignedTicket ? 'bg-blue-500' :
                                worker.status === 'Available' ? 'bg-emerald-500' : 'bg-slate-400'
                              ]"></span>
                              {{ worker.status === 'Working' ? 'Working' : worker.assignedTicket ? `Assigned to ${formatTicketOrProjectLabel(worker.assignedTicket)}` : worker.status }}
                            </span>
                            <!-- Improved Change Status Button Below Status Bar -->
                            <button 
                              @click="toggleManagementStatus(worker)"
                              class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm border w-full sm:w-auto"
                              :class="!isManagementMode || worker.status === 'Working' || worker.assignedTicket 
                                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60' 
                                : worker.status === 'On Leave'
                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600 shadow-emerald-500/20 active:scale-95 cursor-pointer'
                                : 'bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border-slate-200 hover:border-rose-200 active:scale-95 cursor-pointer'"
                            >
                              <svg v-if="worker.status === 'On Leave'" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                              <svg v-else-if="!worker.assignedTicket && worker.status !== 'Working'" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              <span>{{ !isManagementMode ? 'Management Disabled' : worker.assignedTicket || worker.status === 'Working' ? 'Locked (In Progress)' : worker.status === 'On Leave' ? 'Set to Available' : 'Set to On Leave' }}</span>
                            </button>

                            <div v-if="!isManagementMode && worker.status !== 'On Leave' && (!worker.assignedTicket || !worker.nextAssignment) && selectedTicket && worker.assignedTicket !== selectedTicket.id && (!worker.nextAssignment || worker.nextAssignment.ticketId !== selectedTicket.id)" class="w-full pt-1">
                              <button
                                @click="assignWorker(worker)"
                                class="py-2 px-3 w-full rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-md shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest"
                                title="Assign worker">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                                {{ worker.assignedTicket || worker.status === 'Working' ? 'Queue Next: ' : 'Assign to ' }} {{ formatTicketOrProjectLabel(selectedTicket.id) }}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Right column: Current Work & Next Assignment side-by-side -->
                    <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 xl:max-w-3xl items-stretch">
                      <!-- Current Work / Assignment Details -->
                      <div 
                        v-if="worker.status === 'Working' || worker.assignedTicket" 
                        @click="toggleTicketExtension(worker.id, worker.assignedTicket)"
                        class="h-full min-h-[140px] p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between bg-white shadow-xs hover:shadow-md"
                        :class="expandedTickets[worker.id] === worker.assignedTicket ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20' : worker.status === 'Working' ? 'border-amber-200 hover:border-amber-400 text-amber-900' : 'border-blue-200 hover:border-blue-400 text-blue-900'"
                        title="Click to expand brief ticket info"
                      >
                        <div>
                          <div class="flex items-center justify-between gap-2 mb-2">
                            <span class="text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5" :class="worker.status === 'Working' ? 'text-amber-700' : 'text-blue-700'">
                              <span class="w-2 h-2 rounded-full animate-pulse" :class="worker.status === 'Working' ? 'bg-amber-500' : 'bg-blue-500'"></span>
                              {{ worker.status === 'Working' ? 'Currently Working On' : 'Currently Assigned To' }}
                            </span>
                            <span class="text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm transition-transform group-hover:scale-105" :class="expandedTickets[worker.id] === worker.assignedTicket ? 'bg-emerald-600 text-white' : worker.status === 'Working' ? 'bg-amber-200/80 text-amber-900' : 'bg-blue-200/80 text-blue-900'">
                              {{ formatTicketOrProjectLabel(worker.assignedTicket) }}
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 transition-transform" :class="expandedTickets[worker.id] === worker.assignedTicket ? 'rotate-180 text-white' : 'opacity-60'" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                            </span>
                          </div>
                          <p class="text-sm font-bold leading-snug text-slate-800">{{ worker.ticketTask || 'Assigned Work' }}</p>
                        </div>
                        <div v-if="worker.implementationDate" class="mt-3 pt-2.5 border-t flex items-center justify-between text-[10px] font-semibold text-slate-600" :class="worker.status === 'Working' ? 'border-amber-200/60' : 'border-blue-200/60'">
                          <span class="flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
                            Scheduled Date:
                          </span>
                          <strong class="font-bold text-slate-800">{{ worker.implementationDate }}</strong>
                        </div>
                      </div>
                      <div v-else class="h-full min-h-[140px] p-4 rounded-2xl bg-slate-100/50 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Active Assignment</span>
                        <p class="text-[11px] text-slate-400 mt-0.5">Worker is currently {{ worker.status.toLowerCase() }}.</p>
                      </div>

                      <!-- Next Assignment Details -->
                      <div 
                        v-if="worker.nextAssignment" 
                        @click="toggleTicketExtension(worker.id, worker.nextAssignment.ticketId)"
                        class="h-full min-h-[140px] p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between bg-white shadow-xs hover:shadow-md"
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
                        <button @click="expandedTickets[worker.id] = null" class="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 text-slate-300 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-1.5">
                          Close Extension
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 relative z-10">
                        <div class="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                          <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Location</span>
                          <span class="text-xs font-bold text-slate-100 block truncate">{{ getTicketDetailsForExtension(expandedTickets[worker.id]).location }}</span>
                        </div>
                        <div class="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                          <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">{{ isProjectIdentifier(expandedTickets[worker.id]) ? 'Duration' : 'Requester' }}</span>
                          <span class="text-xs font-bold text-slate-100 block truncate">{{ getTicketDetailsForExtension(expandedTickets[worker.id]).requester }}</span>
                        </div>
                        <div class="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                          <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">{{ isProjectIdentifier(expandedTickets[worker.id]) ? 'Target Date' : 'Scheduled Date' }}</span>
                          <span class="text-xs font-bold text-emerald-400 block truncate">{{ getTicketDetailsForExtension(expandedTickets[worker.id]).date }}</span>
                        </div>
                      </div>

                      <div class="relative z-10">
                        <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">{{ isProjectIdentifier(expandedTickets[worker.id]) ? 'Project Description' : 'Job Description' }}</span>
                        <p class="text-xs font-medium text-slate-300 leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">{{ getTicketDetailsForExtension(expandedTickets[worker.id]).desc }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </template>

    <template #modal-overlay>
      <div v-if="showTicketModal" class="absolute inset-0 z-[60] overflow-y-auto custom-scrollbar pointer-events-auto bg-slate-900/60 backdrop-blur-sm animate-fade-in">
        <div class="flex min-h-[100dvh] items-center justify-center p-4 md:p-8" @click.self="showTicketModal = false">
          <div class="bg-[#F8FAFC] w-full max-w-4xl h-fit rounded-[3rem] shadow-2xl overflow-hidden relative z-10 animate-scale-up border border-slate-200">
            <template v-if="isProjectIdentifier(modalTicket)">
              <div class="bg-slate-900 p-8 text-white flex justify-between items-end border-b-4 border-emerald-500 relative">
                <div>
                  <span class="px-3 py-1 bg-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-3 inline-block">Project Details</span>
                  <h3 class="text-3xl font-black tracking-tighter">{{ modalTicket?.type }} <span class="text-emerald-500">({{ formatProjectNumber ? formatProjectNumber(modalTicket?.id) : modalTicket?.id }})</span></h3>
                  <p class="text-slate-400 mt-1 font-bold">Published on {{ modalTicket?.submittedAt }}</p>
                </div>
                <button @click="showTicketModal = false" class="absolute top-6 right-8 text-slate-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div class="p-10 space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Project Title</label>
                    <p class="text-sm font-bold text-slate-900 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">{{ modalTicket?.type }}</p>
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Location</label>
                    <p class="text-sm font-bold text-slate-900 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">{{ modalTicket?.location }}</p>
                  </div>
                </div>
                <div class="space-y-3">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Project Description</label>
                  <div class="w-full px-8 py-6 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm text-sm font-bold text-slate-700 leading-relaxed min-h-[120px]">
                    {{ modalTicket?.job_description }}
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="bg-slate-900 p-8 text-white flex justify-between items-end border-b-4 border-emerald-500 relative">
                <div>
                  <span class="px-3 py-1 bg-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-3 inline-block">Ticket Details</span>
                  <h3 class="text-3xl font-black tracking-tighter">Landscaping Request <span class="text-emerald-500">({{ modalTicket?.id }})</span></h3>
                  <p class="text-slate-400 mt-1 font-bold">Submitted on {{ modalTicket?.submittedAt }}</p>
                </div>
                <div class="text-right">
                  <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">JR NO.</p>
                  <p class="text-2xl font-black text-emerald-500">{{ modalTicket?.jr_no }}</p>
                </div>
                <button @click="showTicketModal = false" class="absolute top-6 right-8 text-slate-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div class="p-10 space-y-10">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div class="space-y-2"><label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">College / Building</label><p class="text-sm font-bold text-slate-900 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">{{ modalTicket?.college_building }}</p></div>
                  <div class="space-y-2"><label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Office / Room</label><p class="text-sm font-bold text-slate-900 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">{{ modalTicket?.office_room }}</p></div>
                  <div class="space-y-2"><label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Source of Fund</label><p class="text-sm font-bold text-slate-900 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">{{ modalTicket?.source_of_fund }}</p></div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="space-y-2"><label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Requester Name</label><p class="text-sm font-bold text-slate-900 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">{{ modalTicket?.requester }}</p></div>
                  <div class="space-y-2"><label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Number</label><p class="text-sm font-bold text-slate-900 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">{{ modalTicket?.contact_number }}</p></div>
                </div>
                <div class="space-y-3">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Job Description / Particulars</label>
                  <div class="w-full px-8 py-6 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm text-sm font-bold text-slate-700 leading-relaxed italic min-h-[120px]">"{{ modalTicket?.job_description }}"</div>
                </div>
              </div>
            </template>
            <div class="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button @click="showTicketModal = false" class="px-8 py-3 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-600/20 active:scale-95">Close Detail View</button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import { useLeauPersonnelStore } from '@/stores/leauPersonnel';
import { toast } from 'vue3-toastify';
import api from '@/api/client';
import { formatTicketOrProjectLabel, isProjectIdentifier, formatProjectNumber } from '@/utils/projectFormatter';

const route = useRoute();
const router = useRouter();
const store = useLeauPersonnelStore();

const showTicketModal = ref(false);
const modalTicket = ref(null);
const isManagementMode = ref(false);
const fetchedTicketDetails = ref({});

const openTicketModal = (ticket) => {
  modalTicket.value = ticket;
  showTicketModal.value = true;
};

const expandedTickets = ref({});

const toggleTicketExtension = async (workerId, ticketId) => {
  if (!ticketId) return;
  if (expandedTickets.value[workerId] === ticketId) {
    expandedTickets.value[workerId] = null;
  } else {
    expandedTickets.value[workerId] = ticketId;
    if (!fetchedTicketDetails.value[ticketId]) {
      try {
        const response = await api.get(`tickets/${ticketId}`);
        if (response.data?.data?.ticket) {
          const t = response.data.data.ticket;
          fetchedTicketDetails.value[ticketId] = {
            id: t.id,
            type: t.project_title || t.service_type || t.type || 'Landscaping Task',
            location: t.location,
            requester: isProjectIdentifier(ticketId) ? t.project_target_duration || 'Ongoing' : (t.details?.requesting_personnel || 'End User'),
            date: isProjectIdentifier(ticketId) ? (t.project_target_date ? new Date(t.project_target_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'To be scheduled') : new Date(t.submitted_at || t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            desc: t.description || t.job_description || 'No description provided.'
          };
        }
      } catch (err) {
        console.error('Failed to fetch ticket for extension:', err);
      }
    }
  }
};

const getTicketDetailsForExtension = (ticketId) => {
  if (!ticketId) return {};
  if (fetchedTicketDetails.value[ticketId]) return fetchedTicketDetails.value[ticketId];
  if (selectedTicket.value && selectedTicket.value.id === ticketId) {
    return {
      id: selectedTicket.value.id,
      type: selectedTicket.value.type,
      location: selectedTicket.value.location,
      requester: isProjectIdentifier(selectedTicket.value) ? (workingDays.value ? `${workingDays.value} Working Days` : 'Duration Set') : selectedTicket.value.requester,
      date: selectedTicket.value.implementationDate ? new Date(selectedTicket.value.implementationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : (selectedTicket.value.submittedAt || 'Scheduled'),
      desc: selectedTicket.value.job_description
    };
  }
  return {
    id: ticketId,
    type: 'Loading...',
    location: 'Loading...',
    requester: 'Loading...',
    date: '...',
    desc: 'Loading ticket details...'
  };
};

const groupedPersonnel = computed(() => store.groupedPersonnel);
const selectedTicket = ref(null);

const handleTicketDateChange = () => {
  if (selectedTicket.value && selectedTicket.value.implementationDate) {
    const dateStr = new Date(selectedTicket.value.implementationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    store.updateTicketDate(selectedTicket.value.id, dateStr);
  }
};

const currentAssignments = computed(() => {
  if (!selectedTicket.value) return [];
  return store.personnel.filter(w => w.assignedTicket === selectedTicket.value.id || (w.nextAssignment && w.nextAssignment.ticketId === selectedTicket.value.id)).map(w => ({
    workerId: w.id, workerName: w.name, ticketId: selectedTicket.value.id, implementationDate: w.assignedTicket === selectedTicket.value.id ? w.implementationDate : (w.nextAssignment ? w.nextAssignment.date : null),
  }));
});

const toggleManagementStatus = (worker) => {
  if (!isManagementMode.value) {
    if (worker.assignedTicket || worker.status === 'Working') {
      toast.info(`Worker is locked on assignment (#${worker.assignedTicket || 'Active Work'}).`);
    } else {
      toast.info('Enable Management Mode above to toggle availability status.');
    }
    return;
  }
  if (worker.status === 'Working' || worker.assignedTicket) {
    toast.error(worker.assignedTicket
      ? `Cannot toggle status: ${worker.name} is currently assigned to #${worker.assignedTicket}. Remove assignment first.`
      : `Cannot toggle status: ${worker.name} is actively working on a ticket.`);
    return;
  }
  store.toggleWorkerStatus(worker.id);
  toast.success(`Status updated for ${worker.name}`);
};

onMounted(async () => {
  const ticketId = route.query.ticket;
  
  if (ticketId) {
    try {
      const response = await api.get(`tickets/${ticketId}`);
      if (response.data?.data?.ticket) {
        const t = response.data.data.ticket;
        selectedTicket.value = {
          id: t.id,
          type: t.project_title || t.service_type || t.type,
          location: t.location,
          requester: t.details?.requesting_personnel || 'End User',
          status: t.status === 'approved' ? 'Pending' : t.status,
          college_building: t.details?.college_building || t.location,
          office_room: t.office_room || t.details?.office_room,
          source_of_fund: t.details?.source_of_fund || 'N/A',
          contact_number: t.details?.contact_number || 'N/A',
          job_description: t.description,
          attachments: t.attachments || [],
          submittedAt: new Date(t.submitted_at).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          }),
          implementationDate: ''
        };
      }
    } catch (error) {
      console.error('Failed to load selected ticket details:', error);
      toast.error('Failed to load ticket details.');
    }
  } else {
    selectedTicket.value = null;
  }
  
  await store.fetchPersonnel();
  
  // If we have existing workers assigned with a date, sync it back to the ticket UI
  if (selectedTicket.value && currentAssignments.value.length > 0) {
    const existingDate = currentAssignments.value[0].implementationDate;
    if (existingDate && !selectedTicket.value.implementationDate) {
      const dateObj = new Date(existingDate);
      selectedTicket.value.implementationDate = dateObj.toISOString().split('T')[0];
    }
  }
});

const assignWorker = (worker) => {
  if (!selectedTicket.value) return;
  if (!selectedTicket.value.implementationDate) {
    toast.error('Please set an implementation date for the ticket first.');
    return;
  }
  const dateStr = new Date(selectedTicket.value.implementationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  store.assignWorker(worker.id, selectedTicket.value.id, dateStr);
  toast.success(`${worker.name} assigned to ${formatTicketOrProjectLabel(selectedTicket.value.id)}`);
};

const removeAssignment = (assign) => {
  store.unassignWorker(assign.workerId);
  toast.info(`Removed assignment for ${assign.workerName}`);
};

const dispatchAll = async () => {
  if (!selectedTicket.value) return;
  if (currentAssignments.value.length === 0) {
    toast.error('No workers assigned to dispatch.');
    return;
  }
  
  try {
    for (const assign of currentAssignments.value) {
      const worker = store.personnel.find(w => w.id === assign.workerId);
      if (worker && worker.status === 'Available') {
         await api.post('dispatch/assign', {
           ticket_id: selectedTicket.value.id,
           personnel_id: assign.workerId,
           implementation_date: selectedTicket.value.implementationDate,
           working_days: Number(workingDays.value),
           task_notes: isProjectIdentifier(selectedTicket.value) ? (selectedTicket.value.type || 'Office Project Work') : (`${selectedTicket.value.type} Work` || 'Janitorial & Landscaping Work')
         });
      }
    }
    toast.success(`Workers successfully dispatched for ${formatTicketOrProjectLabel(selectedTicket.value.id)}!`);
    router.push('/dispatcher/leau');
  } catch (error) {
    console.error('Dispatch failed:', error);
    toast.error('Failed to dispatch some workers. Check your connection.');
  }
};
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
@keyframes scale-up { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
.animate-scale-up { animation: scale-up 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
</style>
