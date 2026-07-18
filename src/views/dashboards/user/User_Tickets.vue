<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/user/dashboard" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <span class="text">Dashboard</span>
      </router-link>
      <router-link to="/user/tickets" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
        <span class="text">My Tickets</span>
      </router-link>
      <div class="mt-8 mb-4 px-4">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Archived Tickets</p>
      </div>
      <router-link to="/user/completed-tickets" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span class="text">Completed Tickets</span>
      </router-link>
      
      <div class="my-4 border-t border-white/5 mx-2"></div>
      
      <router-link to="/user/edit-profile" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span class="text">Account Settings</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">My Service Tickets</h2>
        <p class="text-xs font-medium text-slate-500">Track and manage your requests</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-6 animate-fade-in relative">
        <!-- Filters & Search -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <div class="relative flex-1 max-w-md">
            <span class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input type="text" v-model="searchQuery" placeholder="Search by Ticket ID or Service..." class="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none">
          </div>
          <div class="flex items-center gap-3">
             <select v-model="statusFilter" class="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all">
               <option value="all">All Status</option>
               <option value="pending">Pending Approval</option>
               <option value="processing">In Progress</option>
               <option value="resolved">Resolved</option>
             </select>
             <button @click="$router.push('/services')" class="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95 flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
               </svg>
               New Request
             </button>
          </div>
        </div>

        <!-- Tickets List -->
        <div class="grid grid-cols-1 gap-4">
          <div v-for="ticket in filteredTickets" :key="ticket.id" :id="ticket.ticketId" :class="['group relative overflow-hidden bg-white border rounded-[2rem] p-6 transition-all shadow-sm hover:shadow-xl', highlightedTicket === ticket.ticketId ? 'border-emerald-500 ring-4 ring-emerald-500/20 shadow-emerald-500/10' : 'border-slate-200 hover:border-emerald-500 hover:shadow-emerald-500/5']">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div class="flex items-start gap-5">
                <div :class="['p-4 rounded-2xl shrink-0 transition-transform group-hover:scale-110', getStatusBg(ticket.status)]">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" :class="getStatusColor(ticket.status)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <div class="space-y-1">
                  <div class="flex items-center gap-3">
                    <h3 class="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{{ ticket.service }}</h3>
                    <span :class="['px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border', getStatusBadge(ticket.status)]">
                      {{ ticket.statusLabel }}
                    </span>
                    <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                      {{ ticket.unit }}
                    </span>
                  </div>
                  <p class="text-sm text-slate-500 font-medium max-w-xl">{{ ticket.description }}</p>
                  <div class="flex items-center gap-4 mt-4">
                    <div class="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wide">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-4m0 0l4 4m-4-4v12" />
                      </svg>
                      ID: {{ ticket.ticketId }}
                    </div>
                    <div class="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {{ ticket.date }}
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center gap-3 shrink-0">
                <button @click="openTimeline(ticket)" class="px-5 py-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 font-bold rounded-xl border border-slate-200 hover:border-emerald-200 transition-all text-sm active:scale-95">
                  View Timeline
                </button>
              </div>
            </div>
            
            <!-- Shimmer effect for hover -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </div>
        </div>

        <!-- Timeline Modal -->
        <div v-if="selectedTicket" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div class="bg-white rounded-[2rem] w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]" @click.stop>
            <!-- Header -->
            <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white relative z-10 shadow-sm">
              <div>
                <h3 class="text-xl font-black text-slate-900">Track Request</h3>
                <p class="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">{{ selectedTicket.ticketId }} &bull; {{ selectedTicket.unit }}</p>
              </div>
              <button @click="closeTimeline" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Body / Timeline -->
            <div class="p-8 overflow-y-auto flex-1 bg-slate-50/50">
              <div class="relative pl-8 space-y-8 before:absolute before:inset-y-0 before:left-[19px] before:w-0.5 before:bg-slate-200">
                
                <div v-for="(step, index) in getSteps(selectedTicket)" :key="index" class="relative z-10">
                  <!-- Step Indicator -->
                  <div :class="['absolute -left-8 w-6 h-6 rounded-full flex items-center justify-center text-white ring-4 ring-white', selectedTicket.currentStep >= (index + 1) ? 'bg-emerald-500' : 'bg-slate-300']">
                    <svg v-if="selectedTicket.currentStep > (index + 1)" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    <span v-else-if="selectedTicket.currentStep === (index + 1)" class="w-2.5 h-2.5 bg-white rounded-full"></span>
                  </div>

                  <!-- Step Content -->
                  <div>
                    <h4 :class="['font-bold text-base', selectedTicket.currentStep >= (index + 1) ? 'text-slate-900' : 'text-slate-400']">{{ step.label }}</h4>
                    <p class="text-sm text-slate-500 mt-1">{{ step.description }}</p>

                    <!-- Specific Logic for Steps -->
                    
                    <!-- FGMU/LEAU View Digital Ticket (Step 2) -->
                    <template v-if="(selectedTicket.unit === 'FGMU' || selectedTicket.unit === 'LEAU') && index === 1">
                      <button v-if="selectedTicket.currentStep >= 2" @click="showDigitalForm = !showDigitalForm" class="mt-3 px-4 py-2 bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 text-xs font-bold rounded-lg transition-all flex items-center gap-2 shadow-sm active:scale-95">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {{ showDigitalForm ? 'Hide Ticket Form' : 'View Digital Ticket' }}
                      </button>

                      <div v-if="showDigitalForm" class="mt-4 p-5 bg-white border border-slate-200 rounded-[1.25rem] shadow-sm animate-fade-in relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-20 h-20 bg-emerald-50 border-b border-l border-emerald-100 rounded-bl-3xl -mr-2 -mt-2"></div>
                        <div class="flex items-center justify-between mb-5 pb-4 border-b border-slate-100 relative z-10">
                          <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 font-black shadow-inner shadow-emerald-200/50">
                              {{ selectedTicket.unit }}
                            </div>
                            <div>
                              <h5 class="font-black text-slate-800 text-sm">Job Request Form</h5>
                              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{{ selectedTicket.ticketId }}</p>
                            </div>
                          </div>
                        </div>
                        <div class="space-y-4">
                          <div class="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
                             <div>
                               <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
                               <p class="text-xs font-bold text-slate-700">{{ selectedTicket.date }}</p>
                             </div>
                             <div>
                               <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Service</p>
                               <p class="text-xs font-bold text-slate-700">{{ selectedTicket.service }}</p>
                             </div>
                          </div>
                          <div class="grid grid-cols-2 gap-4">
                             <div>
                               <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Location</p>
                               <p class="text-xs font-bold text-slate-700">{{ selectedTicket.location || 'Main Campus' }}</p>
                             </div>
                             <div>
                               <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Office/Room</p>
                               <p class="text-xs font-bold text-slate-700">{{ selectedTicket.office_room || 'N/A' }}</p>
                             </div>
                          </div>
                          <div>
                             <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Job Particulars</p>
                             <p class="text-xs font-medium text-slate-600 leading-relaxed">{{ selectedTicket.description }}</p>
                          </div>
                        </div>
                      </div>
                    </template>

                    <!-- SSU View Vehicle Pass Application (Step 1) -->
                    <template v-if="selectedTicket.unit === 'SSU' && selectedTicket.service === 'Vehicle Pass Application' && index === 0">
                      <button v-if="selectedTicket.currentStep >= 1" @click="showDigitalForm = !showDigitalForm" class="mt-3 px-4 py-2 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-600 hover:text-blue-700 text-xs font-bold rounded-lg transition-all flex items-center gap-2 shadow-sm active:scale-95">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {{ showDigitalForm ? 'Hide Form' : 'View Application' }}
                      </button>

                      <div v-if="showDigitalForm" class="mt-4 p-5 bg-white border border-slate-200 rounded-[1.25rem] shadow-sm animate-fade-in relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-20 h-20 bg-blue-50 border-b border-l border-blue-100 rounded-bl-3xl -mr-2 -mt-2"></div>
                        <div class="flex items-center justify-between mb-5 pb-4 border-b border-slate-100 relative z-10">
                          <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700 font-black shadow-inner shadow-blue-200/50 text-[10px]">
                              SSU
                            </div>
                            <div>
                              <h5 class="font-black text-slate-800 text-sm">Vehicle Pass App</h5>
                              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{{ selectedTicket.ticketId }}</p>
                            </div>
                          </div>
                        </div>
                        <div class="space-y-4">
                          <div class="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
                             <div>
                               <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Plate No.</p>
                               <p class="text-xs font-bold text-slate-700">{{ selectedTicket.plate_no || 'N/A' }}</p>
                             </div>
                             <div>
                               <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Vehicle Type</p>
                               <p class="text-xs font-bold text-slate-700">{{ selectedTicket.vehicle_type || 'N/A' }}</p>
                             </div>
                          </div>
                          <div class="grid grid-cols-2 gap-4">
                             <div>
                               <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Make/Series</p>
                               <p class="text-xs font-bold text-slate-700">{{ selectedTicket.make_series || 'N/A' }}</p>
                             </div>
                             <div>
                               <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Color</p>
                               <p class="text-xs font-bold text-slate-700">{{ selectedTicket.color || 'N/A' }}</p>
                             </div>
                          </div>
                          <div>
                             <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Address</p>
                             <p class="text-xs font-medium text-slate-600">{{ selectedTicket.address || 'Not Provided' }}</p>
                          </div>
                        </div>
                      </div>
                    </template>

                    <!-- SSU View Incident Report (Step 1) -->
                    <template v-if="selectedTicket.unit === 'SSU' && selectedTicket.service === 'Incident Report' && index === 0">
                      <button v-if="selectedTicket.currentStep >= 1" @click="showDigitalForm = !showDigitalForm" class="mt-3 px-4 py-2 bg-white border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-600 hover:text-red-700 text-xs font-bold rounded-lg transition-all flex items-center gap-2 shadow-sm active:scale-95">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {{ showDigitalForm ? 'Hide Form' : 'View Report' }}
                      </button>

                      <div v-if="showDigitalForm" class="mt-4 p-5 bg-white border border-slate-200 rounded-[1.25rem] shadow-sm animate-fade-in relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-20 h-20 bg-red-50 border-b border-l border-red-100 rounded-bl-3xl -mr-2 -mt-2"></div>
                        <div class="flex items-center justify-between mb-5 pb-4 border-b border-slate-100 relative z-10">
                          <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-700 font-black shadow-inner shadow-red-200/50 text-[10px]">
                              SSU
                            </div>
                            <div>
                              <h5 class="font-black text-slate-800 text-sm">Incident Report</h5>
                              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{{ selectedTicket.ticketId }}</p>
                            </div>
                          </div>
                        </div>
                        <div class="space-y-4">
                          <div class="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
                             <div>
                               <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Incident Type</p>
                               <p class="text-xs font-bold text-slate-700">{{ selectedTicket.incident_type || 'N/A' }}</p>
                             </div>
                             <div>
                               <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">When</p>
                               <p class="text-xs font-bold text-slate-700">{{ selectedTicket.when || 'N/A' }}</p>
                             </div>
                          </div>
                          <div>
                             <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Where</p>
                             <p class="text-xs font-bold text-slate-700">{{ selectedTicket.where || 'N/A' }}</p>
                          </div>
                          <div>
                             <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Narrative (How)</p>
                             <p class="text-xs font-medium text-slate-600 leading-relaxed">{{ selectedTicket.how || 'N/A' }}</p>
                          </div>
                        </div>
                      </div>
                    </template>

                    <!-- TASU View Trip Details (Step 1) -->
                    <template v-if="selectedTicket.unit === 'TASU' && index === 0">
                      <button v-if="selectedTicket.currentStep >= 1" @click="showDigitalForm = !showDigitalForm" class="mt-3 px-4 py-2 bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50 text-slate-600 hover:text-amber-700 text-xs font-bold rounded-lg transition-all flex items-center gap-2 shadow-sm active:scale-95">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {{ showDigitalForm ? 'Hide Details' : 'View Trip Details' }}
                      </button>

                      <div v-if="showDigitalForm" class="mt-4 p-5 bg-white border border-slate-200 rounded-[1.25rem] shadow-sm animate-fade-in relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-20 h-20 bg-amber-50 border-b border-l border-amber-100 rounded-bl-3xl -mr-2 -mt-2"></div>
                        <div class="flex items-center justify-between mb-5 pb-4 border-b border-slate-100 relative z-10">
                          <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700 font-black shadow-inner shadow-amber-200/50 text-[10px]">
                              TASU
                            </div>
                            <div>
                              <h5 class="font-black text-slate-800 text-sm">Vehicle Request Form</h5>
                              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{{ selectedTicket.ticketId }}</p>
                            </div>
                          </div>
                        </div>
                        <div class="space-y-4">
                          <div class="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
                             <div>
                               <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Destination</p>
                               <p class="text-xs font-bold text-slate-700">{{ selectedTicket.destination || 'N/A' }}</p>
                             </div>
                             <div>
                               <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Passengers</p>
                               <p class="text-xs font-bold text-slate-700">{{ selectedTicket.passengers || 'N/A' }}</p>
                             </div>
                          </div>
                          <div class="grid grid-cols-2 gap-4">
                             <div>
                               <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Departure</p>
                               <p class="text-xs font-bold text-slate-700">{{ selectedTicket.time || 'N/A' }}</p>
                             </div>
                             <div>
                               <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Return</p>
                               <p class="text-xs font-bold text-slate-700">{{ selectedTicket.return_time || 'N/A' }}</p>
                             </div>
                          </div>
                          <div>
                             <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Purpose of Travel</p>
                             <p class="text-xs font-medium text-slate-600 leading-relaxed">{{ selectedTicket.purpose || 'N/A' }}</p>
                          </div>
                        </div>
                      </div>
                    </template>

                    <!-- SSU Charge Slip (Vehicle Pass Step 3) -->
                    <template v-if="selectedTicket.unit === 'SSU' && selectedTicket.service === 'Vehicle Pass Application' && index === 2 && selectedTicket.currentStep >= 3">
                      <div class="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-between">
                        <div class="flex items-center gap-3">
                          <div class="p-2 bg-amber-100 text-amber-700 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <p class="text-xs font-bold text-amber-900 uppercase tracking-wider">Digital Charge Slip Generated</p>
                            <p class="text-[10px] font-bold text-amber-700 mt-0.5">Slip #: {{ selectedTicket.chargeSlip }}</p>
                          </div>
                        </div>
                        <button class="px-3 py-1.5 bg-white border border-amber-200 text-amber-700 text-[10px] font-black uppercase rounded-lg shadow-sm hover:bg-amber-100 transition-colors">Print/Download</button>
                      </div>
                    </template>

                    <!-- SSU Actions Taken (Incident Report Step 3) -->
                    <template v-if="selectedTicket.unit === 'SSU' && selectedTicket.service === 'Incident Report' && index === 2 && selectedTicket.currentStep >= 3">
                      <div class="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                        <p class="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1.5">Action Logging / Recommendations</p>
                        <p class="text-xs font-semibold text-blue-800 leading-relaxed italic">"{{ selectedTicket.actionsTaken }}"</p>
                      </div>
                    </template>

                    <!-- TASU Assigned Driver/Vehicle (Step 3) -->
                    <template v-if="selectedTicket.unit === 'TASU' && index === 2 && selectedTicket.currentStep >= (index + 1)">
                      <div v-if="selectedTicket.assignedVehicle" class="mt-4 grid grid-cols-2 gap-3">
                        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                           <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Assigned Vehicle</p>
                           <p class="text-xs font-bold text-slate-700">{{ selectedTicket.assignedVehicle }}</p>
                        </div>
                        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                           <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Assigned Driver</p>
                           <p class="text-xs font-bold text-slate-700">{{ selectedTicket.assignedDriver }}</p>
                        </div>
                      </div>
                    </template>

                  </div>
                </div>

              </div>
              
              <!-- Satisfaction Form (Triggered when job is finished/sticker ready) -->
              <div v-if="isFeedbackEligible(selectedTicket) && !selectedTicket.isClosed" class="mt-8 p-6 bg-emerald-50 rounded-[1.5rem] border border-emerald-100 relative overflow-hidden">
                <div class="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-emerald-900" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                
                <div class="flex items-center justify-between mb-6 relative z-10">
                  <div>
                    <h4 class="font-black text-emerald-900 text-lg mb-1">Job / Service Performance Evaluation</h4>
                    <p class="text-xs font-medium text-emerald-700">Please provide your feedback to close the ticket.</p>
                  </div>
                  <div class="px-4 py-2 bg-white rounded-xl border border-emerald-100 shadow-sm">
                    <span class="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none block mb-1">Section F</span>
                    <span class="text-sm font-bold text-emerald-900">Satisfaction Feedback</span>
                  </div>
                </div>
                
                <div class="space-y-6 relative z-10">
                  
                  <!-- Completion Status -->
                  <div class="space-y-3">
                    <label class="block text-sm font-bold text-slate-800">1. Job Completion Status / Service Delivery <span class="text-red-500">*</span></label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <label :class="['flex items-center p-3 border rounded-xl cursor-pointer transition-all', satisfactionForm.completionStatus === 'on-time' ? 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-md scale-[1.02]' : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-600']">
                        <input type="radio" v-model="satisfactionForm.completionStatus" value="on-time" class="hidden">
                        <div class="flex-1 text-xs font-bold text-center uppercase tracking-wide">Completed On-Time</div>
                      </label>
                      <label :class="['flex items-center p-3 border rounded-xl cursor-pointer transition-all', satisfactionForm.completionStatus === 'beyond-time' ? 'bg-amber-100 border-amber-500 text-amber-900 shadow-md scale-[1.02]' : 'bg-white border-slate-200 hover:border-amber-300 text-slate-600']">
                        <input type="radio" v-model="satisfactionForm.completionStatus" value="beyond-time" class="hidden">
                        <div class="flex-1 text-xs font-bold text-center uppercase tracking-wide">Completed Beyond Time</div>
                      </label>
                      <label :class="['flex items-center p-3 border rounded-xl cursor-pointer transition-all', satisfactionForm.completionStatus === 'not-completed' ? 'bg-red-100 border-red-500 text-red-900 shadow-md scale-[1.02]' : 'bg-white border-slate-200 hover:border-red-300 text-slate-600']">
                        <input type="radio" v-model="satisfactionForm.completionStatus" value="not-completed" class="hidden">
                        <div class="flex-1 text-xs font-bold text-center uppercase tracking-wide">Not Completed / Performed</div>
                      </label>
                    </div>
                  </div>

                  <!-- Scale Rating (Section F specific details) -->
                  <div v-if="satisfactionForm.completionStatus === 'on-time' || satisfactionForm.completionStatus === 'beyond-time'" class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 animate-fade-in">
                    <label class="block text-sm font-bold text-slate-800 mb-2">2. Service Quality Rating <span class="text-red-500">*</span></label>
                    
                    <div v-for="(label, key) in { 
                      courtesy: 'Courtesy of Personnel',
                      quality: 'Quality of Work/Service', 
                      efficiency: 'Efficiency / Work Discipline', 
                      timeliness: 'Timeliness of Completion',
                      cleanliness: 'Cleanliness of Area (if applicable)'
                    }" :key="key" class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                      <span class="text-sm font-semibold text-slate-600">{{ label }}</span>
                      <div class="flex gap-1.5">
                        <button v-for="star in 5" :key="star" @click="satisfactionForm.ratings[key] = star" 
                          :class="['w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all active:scale-95', 
                          satisfactionForm.ratings[key] >= star ? 'bg-amber-100 text-amber-500 border border-amber-200' : 'bg-slate-50 text-slate-300 border border-slate-100']">
                          {{ star }}
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Reasons for Beyond Time -->
                  <div v-if="satisfactionForm.completionStatus === 'beyond-time'" class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm animate-fade-in">
                    <label class="block text-sm font-bold text-slate-800 mb-3">Reasons for beyond time (Please check)</label>
                    <div class="space-y-3">
                      <label class="flex items-center gap-3 cursor-pointer group">
                        <div class="relative flex items-center justify-center w-5 h-5 border-2 border-slate-300 rounded overflow-hidden transition-colors group-hover:border-emerald-500">
                          <input type="checkbox" v-model="satisfactionForm.beyondTimeReasons.personnelAbsent" class="absolute inset-0 opacity-0 cursor-pointer peer">
                          <div class="w-full h-full bg-emerald-500 scale-0 peer-checked:scale-100 transition-transform"></div>
                          <svg class="absolute w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span class="text-sm font-medium text-slate-600">Personnel absent/ on-leave</span>
                      </label>
                      <label class="flex items-center gap-3 cursor-pointer group">
                        <div class="relative flex items-center justify-center w-5 h-5 border-2 border-slate-300 rounded overflow-hidden transition-colors group-hover:border-emerald-500">
                          <input type="checkbox" v-model="satisfactionForm.beyondTimeReasons.extendedBreak" class="absolute inset-0 opacity-0 cursor-pointer peer">
                          <div class="w-full h-full bg-emerald-500 scale-0 peer-checked:scale-100 transition-transform"></div>
                          <svg class="absolute w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span class="text-sm font-medium text-slate-600">Extended break period</span>
                      </label>
                      <label class="flex items-center gap-3 cursor-pointer group">
                        <div class="relative flex items-center justify-center w-5 h-5 border-2 border-slate-300 rounded overflow-hidden transition-colors group-hover:border-emerald-500">
                          <input type="checkbox" v-model="satisfactionForm.beyondTimeReasons.additionalWork" class="absolute inset-0 opacity-0 cursor-pointer peer">
                          <div class="w-full h-full bg-emerald-500 scale-0 peer-checked:scale-100 transition-transform"></div>
                          <svg class="absolute w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span class="text-sm font-medium text-slate-600">Additional work requested</span>
                      </label>
                    </div>
                  </div>

                  <!-- Reasons for Not Completed -->
                  <div v-if="satisfactionForm.completionStatus === 'not-completed'" class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm animate-fade-in">
                    <label class="block text-sm font-bold text-slate-800 mb-3">Reasons for not completed (Please check)</label>
                    <div class="space-y-3">
                      <label class="flex items-center gap-3 cursor-pointer group">
                        <div class="relative flex items-center justify-center w-5 h-5 border-2 border-slate-300 rounded overflow-hidden transition-colors group-hover:border-emerald-500">
                          <input type="checkbox" v-model="satisfactionForm.notCompletedReasons.lackWorkingDays" class="absolute inset-0 opacity-0 cursor-pointer peer">
                          <div class="w-full h-full bg-emerald-500 scale-0 peer-checked:scale-100 transition-transform"></div>
                          <svg class="absolute w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span class="text-sm font-medium text-slate-600">Lack of working days</span>
                      </label>
                      <label class="flex items-center gap-3 cursor-pointer group">
                        <div class="relative flex items-center justify-center w-5 h-5 border-2 border-slate-300 rounded overflow-hidden transition-colors group-hover:border-emerald-500">
                          <input type="checkbox" v-model="satisfactionForm.notCompletedReasons.lackMaterials" class="absolute inset-0 opacity-0 cursor-pointer peer">
                          <div class="w-full h-full bg-emerald-500 scale-0 peer-checked:scale-100 transition-transform"></div>
                          <svg class="absolute w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span class="text-sm font-medium text-slate-600">Lack of materials/ tools</span>
                      </label>
                      <label class="flex items-center gap-3 cursor-pointer group">
                        <div class="relative flex items-center justify-center w-5 h-5 border-2 border-slate-300 rounded overflow-hidden transition-colors group-hover:border-emerald-500">
                          <input type="checkbox" v-model="satisfactionForm.notCompletedReasons.lackSkills" class="absolute inset-0 opacity-0 cursor-pointer peer">
                          <div class="w-full h-full bg-emerald-500 scale-0 peer-checked:scale-100 transition-transform"></div>
                          <svg class="absolute w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span class="text-sm font-medium text-slate-600">Lack of skills</span>
                      </label>
                    </div>
                  </div>

                  <!-- Remarks -->
                  <div v-if="satisfactionForm.completionStatus" class="animate-fade-in">
                    <label class="block text-sm font-bold text-slate-800 mb-2">Remarks (End-user/ Authorized Representative)</label>
                    <textarea v-model="satisfactionForm.remarks" rows="2" class="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none text-sm font-medium transition-all resize-none shadow-sm" placeholder="Any additional comments..."></textarea>
                  </div>

                  <div class="flex justify-end pt-2">
                    <button @click="closeTicket" :disabled="!isFormValid" :class="['px-6 py-3 rounded-xl font-bold transition-all shadow-lg text-sm flex items-center gap-2', isFormValid ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none']">
                      Close Ticket
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Ticket Closed State -->
              <div v-else-if="selectedTicket.isClosed || (selectedTicket.unit === 'SSU' && selectedTicket.service === 'Incident Report' && selectedTicket.currentStep === 5)" class="mt-10 p-6 bg-slate-50 rounded-[1.5rem] border border-slate-200 flex flex-col items-center text-center">
                <div class="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 class="font-black text-slate-900 text-lg mb-1">Ticket Closed</h4>
                <p v-if="selectedTicket.unit === 'SSU' && selectedTicket.service === 'Incident Report'" class="text-sm font-medium text-slate-500">This incident report has been resolved and archived by the SSU staff.</p>
                <p v-else class="text-sm font-medium text-slate-500">Thank you for your feedback! This ticket has been successfully closed.</p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import { useTicketsStore } from '@/stores/tickets';

const ticketsStore = useTicketsStore();

const route = useRoute();
const highlightedTicket = ref(null);

onMounted(() => {
  if (route.query.highlight) {
    highlightedTicket.value = route.query.highlight;
    setTimeout(() => {
      const el = document.getElementById(route.query.highlight);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }

  const ackMap = JSON.parse(localStorage.getItem('gso_ssu_acknowledged_incidents') || '{}');
  tickets.value.forEach(t => {
    if (ackMap[t.ticketId]) {
      const updated = ackMap[t.ticketId];
      t.status = updated.status;
      t.statusLabel = updated.statusLabel;
      t.currentStep = updated.currentStep;
      t.actionsTaken = updated.actionsTaken;
    }
  });
});

const searchQuery = ref('');
const statusFilter = ref('all');

// Step definitions mapping
const unitSteps = {
  'FGMU': [
    { label: 'Digital Submission', description: 'The client completes the required fields in the digital form.' },
    { label: 'Ticket Creation', description: 'System generated a Digital Ticket' },
    { label: 'Admin Approval', description: 'Status: Approved by the administration unit.' },
    { label: 'Dispatch & Schedule', description: 'Dispatcher assigned workers and scheduled implementation.' },
    { label: 'Job Started', description: 'Workers have started the job.' },
    { label: 'Job Finished', description: 'Workers marked the job as complete.' }
  ],
  'LEAU': [
    { label: 'Digital Submission', description: 'The client completes the required fields in the digital form.' },
    { label: 'Ticket Creation', description: 'System generated a Digital Ticket and assigned "Pending Approval" status.' },
    { label: 'Admin Approval', description: 'Status: Approved by the administration unit.' },
    { label: 'Dispatch & Schedule', description: 'Dispatcher assigned workers and scheduled implementation.' },
    { label: 'Job Started', description: 'Workers have started the job.' },
    { label: 'Job Finished', description: 'Workers marked the job as complete.' }
  ],
  'SSU': {
    'Vehicle Pass Application': [
      { label: 'Application', description: 'The client fills out the digital Vehicle Pass Application.' },
      { label: 'Document Upload', description: 'OR/CR and Driver\'s License digital copies uploaded.' },
      { label: 'Document Verification', description: 'Staff verifies documents and generates a charge slip.' },
      { label: 'Payment Upload', description: 'Client uploads photo of the receipt from Accounting Office.' },
      { label: 'Verification', description: 'SSU staff reviews payment and final documents.' },
      { label: 'Status Update', description: 'Ticket marked as "Approved - Ready for Pickup".' },
      { label: 'Completion', description: 'Sticker is ready for pickup at the Security Office.' }
    ],
    'Incident Report': [
      { label: 'Report Submission', description: 'The client fills out a digital Incident Report.' },
      { label: 'Staff Review', description: 'SSU staff reviews the incident details.' },
      { label: 'Action Logging', description: 'Staff enters actions taken or recommendations.' },
      { label: 'Status Tracking', description: 'Current Status: Under Investigation or Resolved.' },
      { label: 'Archiving', description: 'Ticket moved to digital archives for record-keeping.' }
    ]
  },
  'TASU': [
    { label: 'Request Submission', description: 'Client submits Vehicle Request and Travel Order Letter.' },
    { label: 'Approval', description: 'Unit Head checks availability and approves request.' },
    { label: 'Assignment', description: 'Dispatcher assigns a driver and a specific vehicle.' },
    { label: 'Close-out', description: 'Driver marks the trip as "Accomplished".' }
  ]
};

const getSteps = (ticket) => {
  if (!ticket) return [];
  if (ticket.unit === 'SSU') {
    return unitSteps.SSU[ticket.service] || [];
  }
  return unitSteps[ticket.unit] || [];
};

const tickets = computed(() => ticketsStore.getTicketsByUser('Jane Smith (Faculty)'));

const filteredTickets = computed(() => {
  return tickets.value.filter(ticket => {
    const query = searchQuery.value.toLowerCase();
    const matchesSearch = ticket.ticketId.toLowerCase().includes(query) || 
                          ticket.service.toLowerCase().includes(query) ||
                          ticket.unit.toLowerCase().includes(query);
    const matchesStatus = statusFilter.value === 'all' || ticket.status === statusFilter.value;
    return matchesSearch && matchesStatus;
  });
});

const selectedTicket = ref(null);
const showDigitalForm = ref(false);

const satisfactionForm = ref({
  completionStatus: '',
  ratings: {
    courtesy: 0,
    quality: 0,
    efficiency: 0,
    timeliness: 0,
    cleanliness: 0
  },
  beyondTimeReasons: {
    personnelAbsent: false,
    extendedBreak: false,
    additionalWork: false
  },
  notCompletedReasons: {
    lackWorkingDays: false,
    lackMaterials: false,
    lackSkills: false
  },
  remarks: ''
});

const isFeedbackEligible = (ticket) => {
  if (!ticket || ticket.isClosed) return false;
  
  const steps = getSteps(ticket);
  const totalSteps = steps.length;
  
  // Logic for different units
  if (ticket.unit === 'FGMU' || ticket.unit === 'LEAU') {
    return ticket.currentStep === 6; // Job Finished
  }
  if (ticket.unit === 'SSU') {
    if (ticket.service === 'Vehicle Pass Application') return ticket.currentStep === 6; // Approved - Ready for Pickup
    // Incident Reports do not require satisfaction forms
    if (ticket.service === 'Incident Report') return false; 
  }
  if (ticket.unit === 'TASU') {
    return ticket.currentStep === 4; // Close-out
  }
  
  return false;
};

const isFormValid = computed(() => {
  if (!satisfactionForm.value.completionStatus) return false;
  
  if (satisfactionForm.value.completionStatus === 'on-time' || satisfactionForm.value.completionStatus === 'beyond-time') {
    const r = satisfactionForm.value.ratings;
    return r.courtesy > 0 && r.quality > 0 && r.efficiency > 0 && r.timeliness > 0;
  }
  
  if (satisfactionForm.value.completionStatus === 'not-completed') {
    const nr = satisfactionForm.value.notCompletedReasons;
    return nr.lackWorkingDays || nr.lackMaterials || nr.lackSkills;
  }
  
  return false;
});

const resetForm = () => {
  satisfactionForm.value = {
    completionStatus: '',
    ratings: { courtesy: 0, quality: 0, efficiency: 0, timeliness: 0, cleanliness: 0 },
    beyondTimeReasons: { personnelAbsent: false, extendedBreak: false, additionalWork: false },
    notCompletedReasons: { lackWorkingDays: false, lackMaterials: false, lackSkills: false },
    remarks: ''
  };
};

const openTimeline = (ticket) => {
  selectedTicket.value = ticket;
  showDigitalForm.value = false;
  resetForm();
  document.body.style.overflow = 'hidden'; 
};

const closeTimeline = () => {
  selectedTicket.value = null;
  document.body.style.overflow = '';
};

const closeTicket = () => {
  if (selectedTicket.value && isFormValid.value) {
    selectedTicket.value.isClosed = true;
    selectedTicket.value.status = 'closed';
    selectedTicket.value.statusLabel = 'Closed';
  }
};

const getStatusBg = (status) => {
  switch (status) {
    case 'pending': return 'bg-amber-50';
    case 'processing': return 'bg-blue-50';
    case 'resolved': return 'bg-emerald-50';
    case 'closed': return 'bg-slate-100';
    default: return 'bg-slate-50';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'text-amber-600';
    case 'processing': return 'text-blue-600';
    case 'resolved': return 'text-emerald-600';
    case 'closed': return 'text-slate-500';
    default: return 'text-slate-600';
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'pending': return 'bg-amber-50 text-amber-600 border-amber-200';
    case 'processing': return 'bg-blue-50 text-blue-600 border-blue-200';
    case 'resolved': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    case 'closed': return 'bg-slate-100 text-slate-500 border-slate-300';
    default: return 'bg-slate-50 text-slate-600 border-slate-200';
  }
};
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
