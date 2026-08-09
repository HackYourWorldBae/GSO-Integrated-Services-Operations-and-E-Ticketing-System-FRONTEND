<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/admin/ssu" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span class="text">SSU Home</span>
      </router-link>

      <router-link to="/admin/ssu/queues/incidents" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span class="text">Incident Ticket Queues</span>
      </router-link>

      <router-link to="/admin/ssu/queues/stickers" :class="['nav-item', activeTab === 'pending' ? 'active' : '']" @click="switchTab('pending')">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
        <span class="text">Sticker Ticket Queues</span>
      </router-link>

      <router-link to="/admin/ssu/queues/stickers/verified" :class="['nav-item', activeTab === 'verified' ? 'active' : '']" @click="switchTab('verified')">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text">Verified Vehicle Pass Tickets</span>
      </router-link>

      <div class="mt-8 mb-4 px-4">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Archived Tickets</p>
      </div>
      <router-link to="/admin/ssu/archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span class="text">Archives</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">{{ activeTab === 'verified' ? 'Verified Vehicle Pass Tickets' : 'Vehicle Pass Sticker Ticket Queues' }}</h2>
        <p class="text-[10px] text-blue-600 font-extrabold tracking-[0.2em] uppercase">{{ activeTab === 'verified' ? 'Verified Passes Awaiting Pickup & Issuance' : 'SSU Gate Access & Pass Verification Pipeline' }}</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in relative pb-16">

        <!-- Analytics Summary: Vehicle Pass Stickers -->
        <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          <div class="p-5 rounded-[1.75rem] bg-white border border-blue-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
            <div class="p-3 rounded-2xl bg-amber-50 text-amber-500 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Pending Review</p>
              <p class="text-3xl font-black text-slate-900 tabular-nums leading-none">{{ pendingCount }}</p>
              <p class="text-[10px] font-semibold text-amber-600 mt-0.5">Awaiting verification</p>
            </div>
          </div>

          <div class="p-5 rounded-[1.75rem] bg-white border border-blue-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
            <div class="p-3 rounded-2xl bg-blue-50 text-blue-600 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Verified & Ready</p>
              <p class="text-3xl font-black text-slate-900 tabular-nums leading-none">{{ verifiedCount }}</p>
              <p class="text-[10px] font-semibold text-blue-600 mt-0.5">Set for pickup</p>
            </div>
          </div>

          <div class="p-5 rounded-[1.75rem] bg-white border border-blue-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
            <div class="p-3 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Issued Passes</p>
              <p class="text-3xl font-black text-slate-900 tabular-nums leading-none">{{ completedCount }}</p>
              <p class="text-[10px] font-semibold text-emerald-600 mt-0.5">Stickers claimed</p>
            </div>
          </div>
        </div>

        <!-- Tab Navigation Switcher -->
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div class="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
            <button @click="switchTab('pending')" :class="['px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2.5', activeTab === 'pending' ? 'bg-white text-blue-600 shadow-md shadow-blue-500/5' : 'text-slate-500 hover:text-slate-900']">
              Pending Requests
              <span :class="['px-2 py-0.5 rounded-full text-[10px]', activeTab === 'pending' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600']">{{ pendingCount }}</span>
            </button>
            <button @click="switchTab('verified')" :class="['px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2.5', activeTab === 'verified' ? 'bg-white text-emerald-600 shadow-md shadow-emerald-500/5' : 'text-slate-500 hover:text-slate-900']">
              Verified Vehicle Pass Tickets
              <span :class="['px-2 py-0.5 rounded-full text-[10px]', activeTab === 'verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600']">{{ verifiedCount }}</span>
            </button>
          </div>
        </div>

        <!-- Tickets List: Pending Vehicle Pass Stickers -->
        <div v-if="activeTab === 'pending'" class="grid grid-cols-1 gap-4">
          <div v-for="ticket in tickets" :key="ticket.id" class="group relative overflow-hidden bg-white border border-blue-100/80 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all">
            <div class="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
              <div class="flex items-start gap-5 flex-1">
                <div class="p-4 rounded-2xl shrink-0 bg-blue-50 text-blue-600 transition-transform group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <div class="space-y-3 w-full">
                  <div class="flex flex-wrap items-center justify-between gap-2 w-full">
                    <div class="flex items-center gap-3">
                      <h4 class="text-lg font-black text-slate-900">{{ ticket.service }}</h4>
                      <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-amber-50 text-amber-600 border-amber-200">
                        {{ ticket.statusLabel }}
                      </span>
                    </div>
                    <div class="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Submitted: {{ ticket.date }}
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4 bg-slate-50/80 p-4 rounded-xl border border-slate-100">
                    <div>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ticket ID</p>
                      <p class="text-sm font-black text-blue-600">{{ ticket.ticketId }}</p>
                    </div>
                    <div>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Applicant</p>
                      <p class="text-sm font-semibold text-slate-700">{{ ticket.requestedBy }}</p>
                    </div>

                    <div>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Vehicle Model & Plate</p>
                      <p class="text-xs font-bold text-slate-700">{{ ticket.vehicleModel }} ({{ ticket.plateNo }})</p>
                    </div>
                    <div>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Driver's License No</p>
                      <p class="text-xs font-bold text-slate-700">{{ ticket.licenseNo }}</p>
                    </div>

                    <div class="col-span-2">
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Particulars / Application Note</p>
                      <p class="text-sm text-slate-600 font-medium leading-relaxed">{{ ticket.description }}</p>
                    </div>
                    
                    <div class="col-span-2 mt-1" v-if="ticket.attachments && ticket.attachments.length > 0">
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Attached Documents</p>
                      <div class="flex flex-wrap gap-2">
                        <div v-for="(file, index) in ticket.attachments" :key="index" @click="downloadAttachment(file)" class="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:border-blue-400 hover:text-blue-600 cursor-pointer transition-colors shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          {{ file.file_name || 'Attachment' }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="flex flex-col items-center gap-3 shrink-0 pt-2 min-w-[200px]">
                <button @click="initiateApproval(ticket)" class="w-full px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Verify and Set for Pickup
                </button>
                
                <button @click="toggleDeclineMode(ticket)" :class="['w-full px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95', ticket.isDeclining ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-white text-rose-600 border border-rose-200 hover:bg-rose-50']">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {{ ticket.isDeclining ? 'Cancel' : 'Decline Request' }}
                </button>
              </div>
            </div>

            <!-- Decline Note Editor -->
            <div v-if="ticket.isDeclining" class="mt-6 p-6 bg-rose-50/80 border border-rose-100 rounded-[2rem] animate-fade-in">
               <div class="flex flex-col gap-4">
                 <div>
                   <label class="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2 block">Reason for Decline (Required)</label>
                   <textarea v-model="ticket.declineReason" rows="3" class="w-full p-4 rounded-2xl border border-rose-200 bg-white text-sm font-medium text-slate-700 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none resize-none" placeholder="Explain why this pass application is being declined..."></textarea>
                 </div>
                 <div class="flex justify-end gap-3">
                   <button @click="ticket.isDeclining = false" class="px-5 py-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Dismiss</button>
                   <button :disabled="!ticket.declineReason" @click="rejectTicket(ticket)" class="px-8 py-3 bg-rose-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-rose-600/20 hover:bg-rose-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">Confirm Rejection</button>
                 </div>
               </div>
            </div>
          </div>

          <div v-if="tickets.length === 0" class="p-12 text-center bg-white border border-blue-100 rounded-[2rem]">
            <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 class="text-lg font-black text-slate-900 mb-1">No Pending Sticker Requests</h4>
            <p class="text-sm text-slate-500 font-medium">All vehicle pass applications have been verified and processed.</p>
          </div>
        </div>

        <!-- Verified Vehicle Pass Tickets Tab View -->
        <div v-if="activeTab === 'verified'" class="space-y-6">
          <!-- Search Bar -->
          <div class="bg-white p-6 rounded-[2rem] border border-blue-100 shadow-sm flex items-center gap-4">
            <div class="flex-1 relative">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input v-model="verifiedSearchQuery" type="text" placeholder="Search verified ticket number (e.g. SSU-TIC-03) or applicant name..." class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
            </div>
          </div>

          <!-- Verified Tickets List -->
          <div class="grid grid-cols-1 gap-4">
            <div v-for="ticket in filteredVerifiedTickets" :key="ticket.id" class="group relative overflow-hidden bg-white border border-emerald-100/80 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div class="flex items-start gap-5 flex-1">
                  <div class="p-4 rounded-2xl shrink-0 bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="space-y-3 w-full">
                    <div class="flex flex-wrap items-center justify-between gap-2 w-full">
                      <div class="flex items-center gap-3">
                        <h4 class="text-lg font-black text-slate-900">{{ ticket.service }}</h4>
                        <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-emerald-50 text-emerald-600 border-emerald-200">
                          {{ ticket.statusLabel }}
                        </span>
                      </div>
                      <div class="text-xs font-bold text-slate-400 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Verified: {{ ticket.verifiedDate || ticket.date }}
                      </div>
                    </div>
                    
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50/80 p-4 rounded-xl border border-slate-100">
                      <div>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ticket Number</p>
                        <p class="text-sm font-black text-emerald-600">{{ ticket.ticketId }}</p>
                      </div>
                      <div>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Applicant</p>
                        <p class="text-sm font-semibold text-slate-700">{{ ticket.requestedBy }}</p>
                      </div>
                      <div>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Vehicle Info</p>
                        <p class="text-xs font-bold text-slate-700">{{ ticket.vehicleModel }} ({{ ticket.plateNo }})</p>
                      </div>
                      <div>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">License No</p>
                        <p class="text-xs font-bold text-slate-700">{{ ticket.licenseNo }}</p>
                      </div>
                    </div>

                    <div class="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs font-medium text-emerald-800">
                      {{ ticket.description }}
                    </div>
                  </div>
                </div>
                
                <div class="flex flex-col items-center justify-center shrink-0 pt-2 min-w-[180px]">
                  <button @click="initiateIssue(ticket)" class="w-full px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-[0.15em] rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Issued
                  </button>
                </div>
              </div>
            </div>

            <div v-if="filteredVerifiedTickets.length === 0" class="p-12 text-center bg-white border border-emerald-100 rounded-[2rem]">
              <div class="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 class="text-lg font-black text-slate-900 mb-1">No Verified Tickets Found</h4>
              <p class="text-sm text-slate-500 font-medium">{{ verifiedSearchQuery ? 'No tickets match your search query.' : 'No verified vehicle pass tickets waiting for pickup.' }}</p>
            </div>
          </div>
        </div>

      </div>

      <!-- Custom Verify Confirm Modal -->
      <div v-if="showConfirmModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl transform transition-all border border-slate-100">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-2xl font-black text-slate-900 text-center mb-2">Confirm Verification</h3>
          <p class="text-slate-500 text-center font-medium mb-8">Are you sure you want to verify vehicle pass request <strong class="text-slate-800">{{ ticketToApprove?.ticketId }}</strong> and set it ready for pickup?</p>
          <div class="flex gap-4">
            <button @click="closeConfirmModal" class="w-full px-6 py-4 bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-200 transition-all active:scale-95">
              Cancel
            </button>
            <button @click="confirmApproval" class="w-full px-6 py-4 bg-blue-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all active:scale-95">
              Confirm & Set Pickup
            </button>
          </div>
        </div>
      </div>

      <!-- Custom Issue Confirm Modal -->
      <div v-if="showIssueConfirmModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl transform transition-all border border-slate-100">
          <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-2xl font-black text-slate-900 text-center mb-2">Confirm Issuance</h3>
          <p class="text-slate-500 text-center font-medium mb-8">Are you sure you want to mark sticker pass <strong class="text-slate-800">{{ ticketToIssue?.ticketId }}</strong> as issued and successfully close this ticket?</p>
          <div class="flex gap-4">
            <button @click="closeIssueConfirmModal" class="w-full px-6 py-4 bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-200 transition-all active:scale-95">
              Cancel
            </button>
            <button @click="confirmIssue" class="w-full px-6 py-4 bg-emerald-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all active:scale-95">
              Confirm Issuance
            </button>
          </div>
        </div>
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import { toast } from 'vue3-toastify';
import api from '@/api/client';

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
    alert('Failed to download attachment.');
  }
};

const tickets = ref([]);

const pendingCount = ref(0);
const verifiedCount = ref(0);
const scheduledCount = ref(0);
const activeCount = ref(0);
const completedCount = ref(0);

const fetchQueue = async () => {
  try {
    const [pendingRes, verifiedRes, archiveRes] = await Promise.all([
      api.get('tickets/queue/SSU'),
      api.get('tickets/dispatch/SSU'),
      api.get('tickets/archives/SSU')
    ]);

    if (pendingRes.data?.data?.tickets) {
      const allSsu = pendingRes.data.data.tickets.filter(t => t.service_type === 'Vehicle Pass Application');
      tickets.value = allSsu.map(t => ({
        id: t.id,
        ticketId: t.id,
        service: t.service_type,
        description: t.description,
        date: new Date(t.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        requestedBy: 'End User', // Ideally fetched from user relation
        plate_no: t.details?.plate_no || 'N/A',
        vehicle_type: t.details?.type_color || 'N/A',
        location: t.location || 'N/A',
        attachments: t.attachments || [],
        isDeclining: false,
        declineReason: ''
      }));
      pendingCount.value = allSsu.length;
    }

    if (verifiedRes.data?.data?.tickets) {
      const allSsuVerified = verifiedRes.data.data.tickets.filter(t => t.service_type === 'Vehicle Pass Application');
      verifiedTickets.value = allSsuVerified.map(t => ({
        id: t.id,
        ticketId: t.id,
        service: t.service_type,
        description: t.description,
        date: new Date(t.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        requestedBy: 'End User', // Ideally fetched from user relation
        plate_no: t.details?.plate_no || 'N/A',
        vehicle_type: t.details?.type_color || 'N/A',
        location: t.location || 'N/A',
        attachments: t.attachments || []
      }));
      verifiedCount.value = allSsuVerified.length;
    }

    if (archiveRes.data?.data?.tickets) {
      const allSsuArchived = archiveRes.data.data.tickets.filter(t => t.service_type === 'Vehicle Pass Application');
      completedCount.value = allSsuArchived.length;
    }
  } catch (error) {
    console.error('Failed to fetch SSU Sticker queue:', error);
  }
};

let pollingInterval = null;

onMounted(() => {
  fetchQueue();
  pollingInterval = setInterval(() => {
    const isInteracting = tickets.value.some(t => t.isDeclining) || verifiedTickets.value.some(t => t.isDeclining);
    if (!isInteracting) {
      fetchQueue();
    }
  }, 5000);
});

onUnmounted(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
});

const route = useRoute();
const router = useRouter();

const activeTab = ref(route.path.includes('/verified') || route.query.tab === 'verified' ? 'verified' : 'pending');

watch(() => route.path, (newPath) => {
  if (newPath.includes('/verified')) {
    activeTab.value = 'verified';
  } else {
    activeTab.value = 'pending';
  }
});

const switchTab = (tab) => {
  activeTab.value = tab;
  if (tab === 'verified') {
    router.push('/admin/ssu/queues/stickers/verified');
  } else {
    router.push('/admin/ssu/queues/stickers');
  }
};

const verifiedTickets = ref([]);
const verifiedSearchQuery = ref('');

const filteredVerifiedTickets = computed(() => {
  if (!verifiedSearchQuery.value.trim()) return verifiedTickets.value;
  const q = verifiedSearchQuery.value.toLowerCase();
  return verifiedTickets.value.filter(t => 
    t.ticketId.toLowerCase().includes(q) ||
    (t.requestedBy && t.requestedBy.toLowerCase().includes(q)) ||
    (t.plate_no && t.plate_no.toLowerCase().includes(q))
  );
});

const showConfirmModal = ref(false);
const ticketToApprove = ref(null);

const initiateApproval = (ticket) => {
  ticketToApprove.value = ticket;
  showConfirmModal.value = true;
};

const closeConfirmModal = () => {
  showConfirmModal.value = false;
  ticketToApprove.value = null;
};

const confirmApproval = async () => {
  if (ticketToApprove.value) {
    try {
      await api.patch(`tickets/${ticketToApprove.value.id}/approve`);
      toast.success(`Approved vehicle pass ${ticketToApprove.value.ticketId}`);
      closeConfirmModal();
      fetchQueue();
    } catch (error) {
      toast.error('Failed to approve ticket');
    }
  }
};

const showIssueConfirmModal = ref(false);
const ticketToIssue = ref(null);

const initiateIssue = (ticket) => {
  ticketToIssue.value = ticket;
  showIssueConfirmModal.value = true;
};

const closeIssueConfirmModal = () => {
  showIssueConfirmModal.value = false;
  ticketToIssue.value = null;
};

const confirmIssue = async () => {
  if (ticketToIssue.value) {
    try {
      await api.patch(`tickets/${ticketToIssue.value.id}/complete`);
      toast.success(`Sticker pass ${ticketToIssue.value.ticketId} successfully issued and ticket closed!`);
      closeIssueConfirmModal();
      fetchQueue();
    } catch (error) {
      toast.error('Failed to issue sticker pass');
    }
  }
};

const toggleDeclineMode = (ticket) => {
  ticket.isDeclining = !ticket.isDeclining;
  if (ticket.isDeclining) {
    ticket.declineReason = '';
  }
};

const rejectTicket = async (ticket) => {
  if (ticket.declineReason) {
    try {
      await api.patch(`tickets/${ticket.id}/decline`, { decline_reason: ticket.declineReason });
      toast.error(`Rejected vehicle pass ${ticket.ticketId}`);
      fetchQueue();
    } catch (error) {
      toast.error('Failed to reject ticket');
    }
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
