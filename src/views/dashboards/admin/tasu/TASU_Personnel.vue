<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/admin/tasu" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span class="text">TASU Home</span>
      </router-link>
      <router-link to="/admin/tasu/queues" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span class="text">Ticket Queues</span>
      </router-link>
      <router-link to="/admin/tasu/personnel" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span class="text">Personnel Management</span>
      </router-link>
      <router-link to="/admin/tasu/vehicles" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
        <span class="text">Vehicle Management</span>
      </router-link>
      <router-link to="/admin/tasu/dispatch" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="text">Dispatch Board</span>
      </router-link>
      <div class="mt-8 mb-4 px-4">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Archived Tickets</p>
      </div>
      <router-link to="/admin/tasu/archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span class="text">Archives</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">TASU Dashboard</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Transportation &amp; Automotive Services</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-6 animate-fade-in pb-12 px-4 sm:px-8 py-8 max-w-[1600px] mx-auto min-h-screen">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div>
            <h2 class="text-3xl font-black tracking-tight text-slate-900 mb-1">TASU Roster</h2>
            <p class="text-sm text-slate-500 font-medium">Manage and track Transportation & Automotive Services Unit personnel status and current assignments.</p>
          </div>
          <div class="flex items-center gap-3" v-if="isAdmin">
            <button @click="showCategoryModal = true" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-black hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
              Manage Categories
            </button>
            <button @click="openAddModal" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-black transition-all shadow-sm shadow-emerald-200 active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              Add Personnel
            </button>
          </div>
        </div>

        <div class="bg-white border border-slate-200 rounded-3xl sm:rounded-[2.5rem] p-4 sm:p-8 shadow-sm">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h3 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <span class="w-2 h-6 bg-emerald-500 rounded-full"></span>
                Staff Availability Control
              </h3>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Toggle personnel status between Available and On Leave</p>
            </div>
            <div class="flex gap-4">
              <span class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Available</span>
              <span class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><span class="w-2 h-2 rounded-full bg-blue-500"></span> Assigned</span>
              <span class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><span class="w-2 h-2 rounded-full bg-amber-500"></span> On Trip</span>
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
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between xl:justify-start gap-4 sm:gap-6 w-full xl:w-auto xl:min-w-[300px]">
                      <div class="flex items-start sm:items-center gap-3 sm:gap-4 w-full min-w-0">
                        <div class="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors shrink-0 shadow-sm font-black text-xl">
                          {{ worker.name ? worker.name.charAt(0) : 'U' }}
                        </div>
                        <div class="flex-1 min-w-0">
                          <h4 class="text-base font-black text-slate-900 leading-tight mb-1">{{ worker.name }}</h4>
                          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ worker.role }}</p>
                          <div class="mt-3 flex flex-col items-start gap-2.5 w-full">
                            <span 
                              @click="toggleWorkerStatus(worker)"
                              :class="[
                                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all',
                                !worker.assignedTicket && worker.status !== 'On Trip' ? 'cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-emerald-500 active:scale-95' : 'cursor-default',
                                worker.status === 'On Trip' ? 'bg-amber-50 text-amber-600 border border-amber-200/60' :
                                worker.assignedTicket ? 'bg-blue-50 text-blue-600 border border-blue-200/60' :
                                worker.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60' : 'bg-slate-200 text-slate-500 border border-slate-300'
                              ]">
                              <span :class="['w-1.5 h-1.5 rounded-full animate-pulse', worker.status === 'On Trip' ? 'bg-amber-500' : worker.assignedTicket ? 'bg-blue-500' : worker.status === 'Available' ? 'bg-emerald-500' : 'bg-slate-400']"></span>
                              {{ worker.status === 'On Trip' ? 'On Trip' : worker.assignedTicket ? 'Assigned to'  : (worker.status || 'Available') }}
                            </span>
                            <div class="flex items-center gap-2 w-full sm:w-auto">
                              <button 
                                @click="toggleWorkerStatus(worker)"
                                :disabled="worker.status === 'On Trip' || !!worker.assignedTicket"
                                class="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm border mt-1"
                                :class="worker.status === 'On Trip' || worker.assignedTicket ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60' : worker.status === 'On Leave' ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600 shadow-emerald-500/20 active:scale-95 cursor-pointer' : 'bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border-slate-200 hover:border-rose-200 active:scale-95 cursor-pointer'"
                              >
                                {{ worker.assignedTicket || worker.status === 'On Trip' ? 'Locked (In Progress)' : worker.status === 'On Leave' ? 'Set to Available' : 'Set to On Leave' }}
                              </button>
                              <button 
                                v-if="isAdmin"
                                @click="openEditModal(worker)"
                                class="mt-1 w-8 h-8 flex items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all active:scale-95 shrink-0"
                                title="Edit personnel"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                              </button>
                              <button 
                                v-if="worker.status !== 'On Trip' && !worker.assignedTicket && isAdmin"
                                @click="confirmDelete(worker)"
                                class="mt-1 w-8 h-8 flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-95 shrink-0"
                                title="Remove personnel"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 xl:max-w-3xl items-stretch">
                      <div v-if="worker.status === 'On Trip' || worker.assignedTicket" @click="toggleTicketExtension(worker.id, worker.assignedTicket)" class="h-full min-h-[140px] p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between bg-white shadow-xs hover:shadow-md" :class="expandedTickets[worker.id] === worker.assignedTicket ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20' : worker.status === 'On Trip' ? 'border-amber-200 hover:border-amber-400' : 'border-blue-200 hover:border-blue-400'">
                        <div>
                          <div class="flex items-center justify-between gap-2 mb-2">
                            <span class="text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5" :class="worker.status === 'On Trip' ? 'text-amber-700' : 'text-blue-700'">
                              <span class="w-2 h-2 rounded-full animate-pulse" :class="worker.status === 'On Trip' ? 'bg-amber-500' : 'bg-blue-500'"></span>
                              {{ worker.status === 'On Trip' ? 'Currently On Trip' : 'Currently Assigned To' }}
                            </span>
                            <span class="text-[10px] font-black px-2.5 py-1 rounded-lg" :class="worker.status === 'On Trip' ? 'bg-amber-200/80 text-amber-900' : 'bg-blue-200/80 text-blue-900'">{{ worker.assignedTicket }}</span>
                          </div>
                          <p class="text-sm font-bold leading-snug text-slate-800">{{ worker.ticketTask || 'Driving Work' }}</p>
                        </div>
                        <div v-if="worker.implementationDate" class="mt-3 pt-2.5 border-t flex items-center justify-between text-[10px] font-semibold text-slate-600 border-blue-200/60">
                          <span>Departure Date:</span>
                          <strong class="font-bold text-slate-800">{{ worker.implementationDate }}</strong>
                        </div>
                      </div>
                      <div v-else class="h-full min-h-[140px] p-4 rounded-2xl bg-slate-100/50 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Active Assignment</span>
                        <p class="text-[11px] text-slate-400 mt-0.5">Worker is currently {{ worker.status ? worker.status.toLowerCase() : 'unavailable' }}.</p>
                      </div>
                      <div v-if="worker.nextAssignmentId" @click="toggleTicketExtension(worker.id, worker.nextAssignmentId)" class="h-full min-h-[140px] p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between bg-white shadow-xs hover:shadow-md" :class="expandedTickets[worker.id] === worker.nextAssignmentId ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20' : 'border-purple-200 hover:border-purple-400'">
                        <div>
                          <span class="text-[9px] font-black uppercase tracking-widest text-purple-600 flex items-center gap-1.5 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            Next Queued Job
                          </span>
                          <p class="text-sm font-bold text-slate-800">{{ worker.nextTicketTask || 'Driving Work' }}</p>
                        </div>
                        <div class="mt-3 pt-2.5 border-t border-purple-100 flex items-center justify-between text-[10px] font-bold text-purple-700">
                          <span>Status:</span><span class="text-slate-800">Pending</span>
                        </div>
                      </div>
                      <div v-else class="h-full min-h-[140px] p-4 rounded-2xl bg-slate-100/50 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Next Job Queued</span>
                        <p class="text-[11px] text-slate-400 mt-0.5">No upcoming tickets or projects assigned.</p>
                      </div>
                    </div>
                  </div>

                  <!-- Inline Brief Ticket Extension inside container -->
                  <div v-if="expandedTickets[worker.id]" class="mt-6 pt-6 border-t border-slate-200/80 animate-fade-in">
                    <div v-if="getTicketDetailsForExtension(expandedTickets[worker.id])" class="bg-slate-900 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
                      <div class="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800 relative z-10">
                        <div class="flex flex-wrap items-center gap-2.5">
                          <span class="text-lg font-black tracking-tight text-white">{{ expandedTickets[worker.id] }}</span>
                          <span class="text-xs font-bold text-slate-400">({{ getTicketDetailsForExtension(expandedTickets[worker.id]).type }})</span>
                        </div>
                        <button @click="expandedTickets[worker.id] = null" class="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 text-slate-300 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-1.5 cursor-pointer">
                          Close Extension
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 relative z-10">
                        <div class="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                          <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Destination</span>
                          <span class="text-xs font-bold text-slate-100 block truncate">{{ getTicketDetailsForExtension(expandedTickets[worker.id]).destination }}</span>
                        </div>
                        <div class="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                          <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Requester / Office</span>
                          <span class="text-xs font-bold text-slate-100 block truncate">{{ getTicketDetailsForExtension(expandedTickets[worker.id]).requester }}</span>
                        </div>
                        <div class="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                          <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Departure Date</span>
                          <span class="text-xs font-bold text-emerald-400 block truncate">{{ getTicketDetailsForExtension(expandedTickets[worker.id]).date }}</span>
                        </div>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 relative z-10">
                        <div class="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                          <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Vehicle</span>
                          <span class="text-xs font-bold text-slate-100 block truncate">{{ getTicketDetailsForExtension(expandedTickets[worker.id]).vehicle }}</span>
                        </div>
                        <div class="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                          <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Passengers</span>
                          <span class="text-xs font-bold text-slate-100 block truncate">{{ getTicketDetailsForExtension(expandedTickets[worker.id]).passengers }}</span>
                        </div>
                      </div>

                      <div class="relative z-10">
                        <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Purpose of Travel</span>
                        <p class="text-xs font-medium text-slate-300 leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">{{ getTicketDetailsForExtension(expandedTickets[worker.id]).desc }}</p>
                      </div>
                    </div>
                    <div v-else class="bg-slate-900 text-white rounded-2xl p-6 shadow-lg flex items-center justify-center">
                      <div class="flex items-center gap-2 text-slate-400 text-xs">
                        <svg class="animate-spin h-4 w-4 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <span>Loading ticket details...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Personnel Modal -->
      <div v-if="showPersonnelModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" @click.self="showPersonnelModal = false">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-scale-up overflow-hidden">
          <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-black text-white">{{ isEditing ? 'Edit Personnel' : 'Add New Personnel' }}</h3>
                <p class="text-emerald-100 text-xs font-medium mt-0.5">{{ isEditing ? 'Update TASU driver info' : 'Add a new TASU driver to the roster' }}</p>
              </div>
              <button @click="showPersonnelModal = false" class="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-3 gap-3">
              <div class="col-span-2">
                <label class="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wider">First Name <span class="text-red-500">*</span></label>
                <input v-model="personnelForm.firstName" type="text" placeholder="Juan" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
              </div>
              <div>
                <label class="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wider">M.I.</label>
                <input v-model="personnelForm.middleInitial" type="text" maxlength="2" placeholder="C" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wider">Last Name <span class="text-red-500">*</span></label>
              <input v-model="personnelForm.lastName" type="text" placeholder="Dela Cruz" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
            </div>
            <div>
              <label class="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wider">Profession <span class="text-red-500">*</span></label>
              <select v-model="personnelForm.specialty" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all">
                <option value="" disabled>Select a profession...</option>
                <option v-for="cat in store.categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
              </select>
              <p v-if="store.categories.length === 0" class="text-xs text-amber-600 font-medium mt-1.5 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                No categories yet. Create one in "Manage Categories" first.
              </p>
            </div>
            <div>
              <label class="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wider">Contact Number <span class="text-slate-400 font-medium">(Optional, 11-digit)</span></label>
              <input v-model="personnelForm.contactNumber" type="text" placeholder="09xxxxxxxxx" maxlength="11" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
            </div>
            <div class="flex gap-3 pt-2">
              <button @click="showPersonnelModal = false" class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-black text-sm hover:bg-slate-50 transition-all">Cancel</button>
              <button @click="submitPersonnel" :disabled="formSubmitting" class="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm transition-all active:scale-95 disabled:opacity-60">
                {{ formSubmitting ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Save Changes' : 'Add to Roster') }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- ================================================================== -->
      <!-- Manage Categories Modal -->
      <!-- ================================================================== -->
      <div v-if="showCategoryModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" @click.self="showCategoryModal = false">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm animate-scale-up overflow-hidden">
          <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-black text-white">Personnel Categories</h3>
                <p class="text-slate-400 text-xs font-medium mt-0.5">Manage TASU profession categories</p>
              </div>
              <button @click="showCategoryModal = false" class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <!-- Add new category -->
            <div class="flex gap-2">
              <input v-model="newCategoryName" @keyup.enter="submitCategory" type="text" placeholder="e.g., Driver" class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
              <button @click="submitCategory" :disabled="categorySubmitting || !newCategoryName.trim()" class="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-black transition-all active:scale-95 disabled:opacity-50">
                {{ categorySubmitting ? '...' : 'Add' }}
              </button>
            </div>

            <!-- List existing categories -->
            <div class="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
              <div v-if="store.categories.length === 0" class="text-center py-6 text-sm text-slate-400 font-medium">No categories yet. Add one above.</div>
              <div v-for="cat in store.categories" :key="cat.id" class="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100 group">
                <template v-if="editingCategory === cat.id">
                  <div class="flex items-center gap-2 w-full">
                    <input v-model="editingCategoryName" @keyup.enter="saveCategory(cat)" @keyup.esc="cancelEditingCategory" type="text" class="flex-1 bg-white border border-slate-300 rounded-lg px-2 py-1 text-sm outline-none focus:border-emerald-500" autofocus />
                    <button @click="saveCategory(cat)" :disabled="categoryUpdating" class="w-7 h-7 flex items-center justify-center rounded-lg text-emerald-600 hover:bg-emerald-100 transition-all" title="Save">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                    </button>
                    <button @click="cancelEditingCategory" class="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 transition-all" title="Cancel">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </template>
                <template v-else>
                  <span class="text-sm font-bold text-slate-800">{{ cat.name }}</span>
                  <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      @click="startEditingCategory(cat)"
                      class="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                      title="Edit category"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button
                      @click="deleteCategory(cat)"
                      :disabled="categoryDeleting === cat.id"
                      class="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all"
                      title="Remove category"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Delete Confirm Modal -->
      <div v-if="workerToDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" @click.self="workerToDelete = null">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm animate-scale-up p-6">
          <div class="flex items-start gap-4 mb-6">
            <div class="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div>
              <h3 class="text-base font-black text-slate-900">Remove Personnel?</h3>
              <p class="text-sm text-slate-500 mt-1">This will permanently remove <strong class="text-slate-800">{{ workerToDelete?.name }}</strong> from the roster. This action cannot be undone.</p>
            </div>
          </div>
          <div class="flex gap-3">
            <button @click="workerToDelete = null" class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-black text-sm hover:bg-slate-50 transition-all">Cancel</button>
            <button @click="submitDelete" :disabled="deleteSubmitting" class="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-sm transition-all active:scale-95 disabled:opacity-60">
              {{ deleteSubmitting ? 'Removing...' : 'Yes, Remove' }}
            </button>
          </div>
        </div>
      </div>

    </template>
  </MainLayout>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { toast } from 'vue3-toastify';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import { useTasuPersonnelStore } from '@/stores/tasuPersonnel';
import { useAuthStore } from '@/stores/auth';
import api from '@/api/client';

const store = useTasuPersonnelStore();
const authStore = useAuthStore();
const isAdmin = computed(() => authStore.role === 'admin' || authStore.role === 'unit-admin');

const groupedPersonnel = computed(() => store.groupedPersonnel);
const expandedTickets  = ref({});
const fetchedTicketDetails = ref({});

const showPersonnelModal = ref(false);
const showCategoryModal = ref(false);
const workerToDelete = ref(null);
const personnelForm = ref({ firstName: '', middleInitial: '', lastName: '', specialty: '', contactNumber: '' });
const isEditing = ref(false);
const editingId = ref(null);
const formSubmitting = ref(false);
const deleteSubmitting = ref(false);

const openAddModal = () => {
  personnelForm.value = { firstName: '', middleInitial: '', lastName: '', specialty: '', contactNumber: '' };
  isEditing.value = false;
  editingId.value = null;
  showPersonnelModal.value = true;
};

const openEditModal = (worker) => {
  // Try to split name roughly, backend just stores full name
  const parts = worker.name.split(' ');
  let first = '', mi = '', last = '';
  if (parts.length > 2) {
    last = parts.pop();
    if (parts[parts.length - 1].length === 2 && parts[parts.length - 1].endsWith('.')) {
      mi = parts.pop();
    }
    first = parts.join(' ');
  } else if (parts.length === 2) {
    first = parts[0];
    last = parts[1];
  } else {
    first = worker.name;
  }
  
  personnelForm.value = {
    firstName: first,
    middleInitial: mi.replace('.', ''),
    lastName: last,
    specialty: worker.role,
    contactNumber: worker.contact_number || ''
  };
  isEditing.value = true;
  editingId.value = worker.id;
  showPersonnelModal.value = true;
};

const submitPersonnel = async () => {
  const { firstName, lastName, specialty, contactNumber } = personnelForm.value;
  if (!firstName.trim() || !lastName.trim() || !specialty) {
    toast.error('Please fill in all required fields.');
    return;
  }
  if (contactNumber && !/^[0-9]{11}$/.test(contactNumber)) {
    toast.error('Contact Number must be exactly 11 digits.');
    return;
  }

  formSubmitting.value = true;
  try {
    if (isEditing.value) {
      await store.updatePersonnel(editingId.value, personnelForm.value);
      toast.success('Personnel updated successfully!');
    } else {
      await store.addPersonnel(personnelForm.value);
      toast.success('Personnel added to roster!');
    }
    showPersonnelModal.value = false;
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to save personnel.');
  } finally {
    formSubmitting.value = false;
  }
};

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
    const msg = err?.response?.data?.message || 'Failed to update category.';
    toast.error(msg);
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
    const msg = err?.response?.data?.message || 'Failed to add category.';
    toast.error(msg);
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
    const msg = err?.response?.data?.message || 'Failed to remove category.';
    toast.error(msg);
  } finally {
    categoryDeleting.value = null;
  }
};

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

const toggleWorkerStatus = (worker) => {
  if (worker.status === 'On Trip' || worker.assignedTicket) return;
  store.toggleWorkerStatus(worker.id);
};

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
          const details = t.details || t.tasu_details || {};
          const dest = details.destination || t.location || 'N/A';
          const req = details.requesting_personnel || details.requestingPersonnel || t.user_name || 'Unknown Requester';
          const off = details.office_college_department || details.agency_address || '';
          const travelDate = details.date_of_travel || t.submitted_at || t.created_at;
          const formattedDate = travelDate ? new Date(travelDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
          
          fetchedTicketDetails.value[ticketId] = {
            id: t.id,
            type: t.service_type || 'Vehicle Request',
            destination: dest,
            requester: off ? `${req} (${off})` : req,
            date: formattedDate,
            desc: details.purpose_of_travel || t.description || 'No purpose of travel provided.',
            passengers: String(details.num_passengers ?? details.number_of_passengers ?? 'N/A'),
            vehicle: [t.assignment?.vehicle_name, t.assignment?.plate_no].filter(Boolean).join(' - ') || details.vehicle_name || 'Assigned Vehicle'
          };
        }
      } catch (e) {
        console.error('Failed to fetch brief ticket details', e);
      }
    }
  }
};

onMounted(() => {
  store.fetchPersonnel();
  store.fetchCategories();
  const interval = setInterval(() => store.fetchPersonnel(), 5000);
});
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes scale-up { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
.animate-scale-up { animation: scale-up 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
</style>
