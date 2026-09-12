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
        <p class="text-xs font-medium text-slate-500 hidden sm:block">Track and manage your requests</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-5 animate-fade-in relative">

        <!-- ===================== FILTERS BAR ===================== -->
        <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <!-- Search -->
            <div class="relative flex-1">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search by ID, service, or unit..."
                class="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
              />
            </div>

            <!-- Status Filter -->
            <div class="flex items-center gap-2 flex-wrap">
              <button
                v-for="tab in statusTabs"
                :key="tab.value"
                @click="statusFilter = tab.value"
                :class="[
                  'px-3.5 py-2 rounded-xl text-xs font-bold transition-all border',
                  statusFilter === tab.value
                    ? tab.activeClass
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'
                ]"
              >
                {{ tab.label }}
                <span v-if="tab.count !== undefined" class="ml-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-black" :class="statusFilter === tab.value ? 'bg-white/30' : 'bg-slate-200 text-slate-600'">
                  {{ tab.count }}
                </span>
              </button>
            </div>

            <!-- New Request -->
            <button
              @click="$router.push('/services')"
              class="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm shadow-emerald-600/20 transition-all active:scale-95 text-sm whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
              </svg>
              New Request
            </button>
          </div>
        </div>

        <!-- ===================== EMPTY STATE ===================== -->
        <div v-if="filteredTickets.length === 0" class="bg-white border border-slate-200 rounded-2xl p-16 flex flex-col items-center text-center shadow-sm">
          <div class="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <p class="text-base font-black text-slate-700 mb-1">No tickets found</p>
          <p class="text-sm text-slate-400 mb-6">
            {{ searchQuery || statusFilter !== 'all' ? 'Try adjusting your search or filters.' : 'Submit your first service request to get started.' }}
          </p>
          <button @click="$router.push('/services')" class="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-sm hover:bg-emerald-700 transition-colors">
            New Service Request
          </button>
        </div>

        <!-- ===================== TICKET CARDS ===================== -->
        <div v-else class="space-y-3">
          <div
            v-for="ticket in filteredTickets"
            :key="ticket.id"
            :id="ticket.ticketId"
            :class="[
              'group relative bg-white border rounded-2xl transition-all duration-300 hover:shadow-lg overflow-hidden',
              highlightedTicket === ticket.ticketId
                ? 'border-emerald-400 ring-4 ring-emerald-500/15 shadow-emerald-500/10'
                : 'border-slate-200 hover:border-slate-300 hover:shadow-slate-200/80'
            ]"
          >
            <!-- Colored left border accent by status -->
            <div class="absolute left-0 inset-y-0 w-1 rounded-l-2xl" :class="getStatusAccent(ticket.status)"></div>

            <div class="pl-5 pr-5 py-5">
              <div class="flex flex-col md:flex-row md:items-start gap-4">

                <!-- Main info -->
                <div class="flex-1 min-w-0">
                  <!-- Meta / Badges Row -->
                  <div class="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div class="flex items-center gap-2 flex-wrap">
                      <!-- Unit badge -->
                      <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                        {{ ticket.unit }}
                      </span>
                      <span class="font-mono font-bold text-[10px] text-slate-400">#{{ ticket.ticketId }}</span>
                    </div>
                    
                    <!-- Status badge -->
                    <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border', getStatusBadge(ticket.status)]">
                      <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDot(ticket.status)"></span>
                      {{ ticket.statusLabel }}
                    </span>
                  </div>

                  <!-- Title -->
                  <h3 class="text-base sm:text-lg font-black text-slate-900 leading-tight mb-2 truncate" :title="ticket.title || ticket.service">{{ ticket.title || ticket.service }}</h3>

                  <!-- Categories / Service Type -->
                  <div class="flex flex-wrap gap-1.5 mb-2" v-if="ticket.title && ticket.title !== ticket.service">
                    <span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider border border-slate-200">{{ ticket.service }}</span>
                  </div>



                  <!-- Dates Row -->
                  <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                    <div class="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
                      </svg>
                      Submitted {{ ticket.date }}
                    </div>
                    <div v-if="ticket.implementationDate" class="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      Scheduled: {{ ticket.implementationDate }}
                    </div>
                    <div v-if="ticket.workingDays" class="flex items-center gap-1.5 text-xs text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Target: {{ ticket.workingDays }} Working Day(s)</span>
                      <span v-if="ticket.extension_days > 0" class="text-[9px] font-black text-amber-700 bg-amber-100 px-1 py-0.2 rounded border border-amber-200">
                        +{{ ticket.extension_days }}d Ext
                      </span>
                    </div>
                    <div v-if="ticket.effective_target_date || ticket.target_completion_date" class="flex items-center gap-1.5 text-xs text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
                      </svg>
                      Target Completion: {{ formatDate(ticket.effective_target_date || ticket.target_completion_date) }}
                    </div>
                  </div>

                  <!-- Official Timeline Extension Notice Card -->
                  <div v-if="ticket.is_extended && ticket.extension_days > 0" class="mt-3 flex items-start gap-3 p-3.5 bg-amber-50/90 border border-amber-200/90 rounded-2xl animate-fade-in shadow-xs">
                    <div class="p-2 bg-amber-100 rounded-xl shrink-0 mt-0.5 text-amber-700">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1 flex-wrap">
                        <span class="text-[10px] font-black text-amber-800 uppercase tracking-widest">Official Timeline Extension Notice</span>
                        <span class="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-200 text-amber-800 border border-amber-300 uppercase tracking-wider">
                          +{{ ticket.extension_days }} Working Day{{ ticket.extension_days > 1 ? 's' : '' }} Extension
                        </span>
                      </div>
                      <p class="text-xs text-amber-900 font-semibold leading-relaxed">
                        Target completion date has been adjusted to <strong>{{ formatDate(ticket.effective_target_date || ticket.target_completion_date) }}</strong> (total expected duration: {{ ticket.workingDays }} working days).
                      </p>
                      <p v-if="ticket.extension_reason" class="text-xs text-amber-800 font-medium mt-1 italic">
                        <span class="font-bold not-italic text-[10px] uppercase tracking-wider text-amber-900">Reason:</span> "{{ ticket.extension_reason }}"
                      </p>
                    </div>
                  </div>

                  <!-- Decline reason inline -->
                  <div v-if="(ticket.status === 'declined' || ticket.status === 'rejected') && ticket.declineReason" class="mt-3 flex items-start gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-rose-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p class="text-[10px] font-black text-rose-500 uppercase tracking-wider mb-0.5">Decline Reason</p>
                      <p class="text-xs font-medium text-rose-700 leading-relaxed">{{ ticket.declineReason }}</p>
                    </div>
                  </div>



                  <!-- Rate Instruction & Action Required Callout -->
                  <div v-if="isFeedbackEligible(ticket)" class="mt-3 flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl animate-fade-in">
                    <div class="p-1.5 bg-amber-100 rounded-lg shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-0.5">Action Required</p>
                      <p class="text-xs font-semibold text-amber-800 leading-relaxed">This service request has been completed! Please click the <strong>"Rate"</strong> button to submit your service evaluation and finalize this ticket.</p>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex-shrink-0 flex items-center gap-2 md:self-start">
                  <!-- Progress indicator -->
                  <div v-if="ticket.status !== 'declined' && ticket.status !== 'rejected'" class="hidden lg:flex items-center gap-1.5 mr-2">
                    <div
                      v-for="i in getSteps(ticket).length"
                      :key="i"
                      class="h-1.5 rounded-full transition-all duration-500"
                      :class="[
                        i === getSteps(ticket).length ? 'w-4' : 'w-2',
                        ticket.currentStep >= i ? getStepFill(ticket.status) : 'bg-slate-200'
                      ]"
                    ></div>
                    <span class="text-[10px] font-black text-slate-400 ml-0.5">{{ ticket.currentStep }}/{{ getSteps(ticket).length }}</span>
                  </div>

                  <!-- Cancel Request Button (Pending Only) -->
                  <button
                    v-if="ticket.status === 'pending'"
                    @click="promptCancelTicket(ticket)"
                    class="flex items-center gap-1.5 px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 font-bold rounded-xl border border-rose-200/70 transition-all text-xs active:scale-95 whitespace-nowrap"
                    title="Cancel this pending request"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel Request
                  </button>

                  <button
                    @click="openTimeline(ticket)"
                    class="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 font-bold rounded-xl border border-slate-200 hover:border-emerald-200 transition-all text-xs active:scale-95 whitespace-nowrap"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    Track Progress
                  </button>

                  <button
                    v-if="isFeedbackEligible(ticket) && !ticket.isClosed"
                    @click="toggleRatingForm(ticket)"
                    class="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl shadow-sm shadow-amber-500/25 transition-all text-xs sm:text-sm active:scale-95 whitespace-nowrap cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    {{ ratingTicketId === ticket.ticketId ? 'Close Evaluation' : 'Rate Service & Close' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Expanded Ratings Form -->
            <div v-if="ratingTicketId === ticket.ticketId" class="border-t-2 border-emerald-200/80 p-6 sm:p-8 bg-gradient-to-b from-emerald-50/80 via-emerald-50/40 to-white rounded-b-2xl space-y-6">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-200/60">
                <div class="flex items-start gap-3.5">
                  <div class="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-md shadow-emerald-600/20 text-white shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="font-black text-slate-900 text-lg sm:text-xl tracking-tight">Service Performance Evaluation</h4>
                      <span class="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-black rounded-lg uppercase tracking-wider border border-emerald-300">Section F</span>
                    </div>
                    <p class="text-xs sm:text-sm text-slate-600 font-medium mt-1">Please complete this evaluation to close and archive Ticket #{{ ticket.ticketId || ticket.id }}.</p>
                  </div>
                </div>
              </div>

              <div class="space-y-6">
                <!-- 1. Job Completion Status -->
                <div class="bg-white p-5 sm:p-6 rounded-2xl border-2 border-slate-200/80 shadow-xs space-y-3">
                  <div class="flex items-center justify-between gap-2">
                    <label class="block text-sm sm:text-base font-black text-slate-900 uppercase tracking-wide">
                      1. Job Completion Status <span class="text-rose-500">*</span>
                    </label>
                    <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Required</span>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label
                      v-for="option in completionOptions"
                      :key="option.value"
                      :class="[
                        'flex items-center gap-3.5 p-4 border-2 rounded-2xl cursor-pointer transition-all duration-150 select-none group',
                        satisfactionForm.completionStatus === option.value
                          ? option.activeClass
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs hover:shadow-xs'
                      ]"
                    >
                      <input type="radio" v-model="satisfactionForm.completionStatus" :value="option.value" class="hidden" />
                      <div
                        class="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
                        :class="satisfactionForm.completionStatus === option.value ? option.indicatorClass : 'border-slate-300 bg-white group-hover:border-slate-400'"
                      >
                        <div v-if="satisfactionForm.completionStatus === option.value" class="w-2.5 h-2.5 rounded-full bg-white"></div>
                      </div>
                      <span class="text-sm sm:text-base font-bold leading-snug">{{ option.label }}</span>
                    </label>
                  </div>
                </div>

                <!-- 2. Service Quality Rating -->
                <div
                  v-if="satisfactionForm.completionStatus === 'on-time' || satisfactionForm.completionStatus === 'beyond-time'"
                  class="bg-white p-5 sm:p-7 rounded-2xl border-2 border-slate-200/80 shadow-xs space-y-5 animate-fade-in"
                >
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                    <div>
                      <label class="block text-sm sm:text-base font-black text-slate-900 uppercase tracking-wide">
                        2. Service Quality Rating <span class="text-rose-500">*</span>
                      </label>
                      <p class="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">Click a number from 1 to 5 for each criterion</p>
                    </div>

                    <!-- Rating Scale Legend Pills -->
                    <div class="flex items-center gap-1.5 flex-wrap text-xs font-bold text-slate-600 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
                      <span class="text-rose-600 font-bold">1: Poor</span>
                      <span class="text-slate-300">•</span>
                      <span class="text-amber-600 font-bold">2: Fair</span>
                      <span class="text-slate-300">•</span>
                      <span class="text-blue-600 font-bold">3: Satisfactory</span>
                      <span class="text-slate-300">•</span>
                      <span class="text-emerald-600 font-bold">4: Very Sat.</span>
                      <span class="text-slate-300">•</span>
                      <span class="text-emerald-700 font-black">5: Outstanding</span>
                    </div>
                  </div>

                  <!-- Rating Criteria Items -->
                  <div class="space-y-4">
                    <div
                      v-for="(label, key) in ratingCriteria"
                      :key="key"
                      class="bg-slate-50/70 border-2 border-slate-200/80 hover:border-slate-300 rounded-2xl p-4 sm:p-5 transition-all shadow-2xs space-y-3"
                    >
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h5 class="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                            <span class="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                            {{ label }}
                          </h5>
                          <p class="text-xs sm:text-sm text-slate-500 font-medium pl-4 mt-0.5">{{ getCriteriaDesc(key) }}</p>
                        </div>

                        <!-- Dynamic Feedback Score Badge -->
                        <div v-if="satisfactionForm.ratings[key]" class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/90 border border-amber-300 text-amber-900 rounded-xl text-xs sm:text-sm font-black shadow-xs self-start sm:self-auto animate-fade-in">
                          <span class="text-amber-600 font-black">★</span>
                          <span>Score: {{ satisfactionForm.ratings[key] }} / 5</span>
                          <span class="text-amber-700 font-extrabold">({{ getRatingLabel(satisfactionForm.ratings[key]) }})</span>
                        </div>
                        <div v-else class="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-xl self-start sm:self-auto">
                          Please click 1 to 5 below
                        </div>
                      </div>

                      <!-- Big, tactile, unmistakably clickable buttons -->
                      <div class="grid grid-cols-5 gap-2 sm:gap-3 pt-1">
                        <button
                          v-for="star in 5"
                          :key="star"
                          type="button"
                          @click="satisfactionForm.ratings[key] = star"
                          :title="`${star} - ${getRatingLabel(star)}`"
                          :class="[
                            'min-h-[58px] sm:min-h-[68px] p-2 rounded-2xl flex flex-col items-center justify-center transition-all duration-150 cursor-pointer select-none group border-2',
                            satisfactionForm.ratings[key] === star
                              ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white font-black border-amber-500 shadow-md shadow-amber-500/35 scale-[1.02] ring-2 ring-amber-400 ring-offset-2'
                              : 'bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-900 font-black border-slate-300 hover:border-amber-400 shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95'
                          ]"
                        >
                          <div class="flex items-center gap-1">
                            <span class="text-xl sm:text-2xl font-black leading-none group-hover:scale-110 transition-transform">
                              {{ star }}
                            </span>
                            <span class="text-amber-400 text-sm sm:text-base leading-none" :class="satisfactionForm.ratings[key] === star ? 'text-white' : 'group-hover:text-amber-500'">★</span>
                          </div>
                          <span
                            class="text-[10px] sm:text-xs font-bold mt-1 leading-none text-center truncate max-w-full px-0.5"
                            :class="satisfactionForm.ratings[key] === star ? 'text-amber-100 font-black' : 'text-slate-500 group-hover:text-amber-800'"
                          >
                            {{ getRatingLabel(star, true) }}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Beyond Time Reasons -->
                <div v-if="satisfactionForm.completionStatus === 'beyond-time'" class="bg-white p-5 sm:p-6 rounded-2xl border-2 border-slate-200/80 space-y-3 animate-fade-in shadow-xs">
                  <label class="block text-sm sm:text-base font-black text-slate-900 uppercase tracking-wide mb-3">
                    Reasons for beyond time completion
                  </label>
                  <div class="space-y-3">
                    <CheckboxItem v-model="satisfactionForm.beyondTimeReasons.personnelAbsent" label="Personnel absent / on-leave" />
                    <CheckboxItem v-model="satisfactionForm.beyondTimeReasons.extendedBreak" label="Extended break period" />
                    <CheckboxItem v-model="satisfactionForm.beyondTimeReasons.additionalWork" label="Additional work requested" />
                  </div>
                </div>

                <!-- Not Completed Reasons -->
                <div v-if="satisfactionForm.completionStatus === 'not-completed'" class="bg-white p-5 sm:p-6 rounded-2xl border-2 border-slate-200/80 space-y-3 animate-fade-in shadow-xs">
                  <label class="block text-sm sm:text-base font-black text-slate-900 uppercase tracking-wide mb-3">
                    Reasons for not completed / performed
                  </label>
                  <div class="space-y-3">
                    <CheckboxItem v-model="satisfactionForm.notCompletedReasons.lackWorkingDays" label="Lack of working days" />
                    <CheckboxItem v-model="satisfactionForm.notCompletedReasons.lackMaterials" label="Lack of materials / tools" />
                    <CheckboxItem v-model="satisfactionForm.notCompletedReasons.lackSkills" label="Lack of skills" />
                  </div>
                </div>

                <!-- Remarks -->
                <div v-if="satisfactionForm.completionStatus" class="bg-white p-5 sm:p-6 rounded-2xl border-2 border-slate-200/80 shadow-xs space-y-2 animate-fade-in">
                  <label class="block text-sm sm:text-base font-black text-slate-900 uppercase tracking-wide mb-1">
                    Remarks / Commendations (Optional)
                  </label>
                  <textarea
                    v-model="satisfactionForm.remarks"
                    rows="3"
                    class="w-full px-4 py-3 bg-slate-50/60 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white outline-none text-sm sm:text-base text-slate-800 transition-all resize-none placeholder:text-slate-400 font-medium"
                    placeholder="Share your commendations, comments, or suggestions regarding the service...">
                  </textarea>
                </div>

                <!-- Submit Action Button -->
                <button
                  type="button"
                  @click="closeTicket(ticket)"
                  :disabled="!isFormValid || isSubmittingFeedback"
                  :class="[
                    'w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-3 transition-all duration-150 select-none cursor-pointer shadow-md',
                    isFormValid && !isSubmittingFeedback
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25 hover:shadow-lg active:scale-[0.99]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  ]"
                >
                  <svg v-if="isSubmittingFeedback" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{{ isSubmittingFeedback ? 'Submitting Evaluation & Closing Ticket...' : 'Submit Evaluation & Close Ticket' }}</span>
                </button>
              </div>
            </div>

            <!-- ========== SSU NOTATION EXTENSION CARD ========== -->
            <div
              v-if="ticket.unit === 'SSU' && ticket.service === 'Incident Report' && ticket.notation"
              class="border-t border-slate-100 p-5 bg-blue-50/60"
            >
              <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" style="width:18px;height:18px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1.5">
                    <p class="text-[10px] font-black text-blue-700 uppercase tracking-widest">SSU Recommendation / Notation</p>
                    <span class="px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-100 text-blue-600 border border-blue-200 uppercase tracking-widest">From SSU Staff</span>
                  </div>
                  <p class="text-sm text-blue-900 font-medium leading-relaxed italic">"{{ ticket.notation }}"</p>
                </div>
              </div>
            </div>

            <!-- Active/processing indicator bar -->
            <div v-if="ticket.status === 'processing'" class="h-0.5 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 animate-progress-bar"></div>
          </div>
        </div>

        <!-- ===================== TIMELINE MODAL ===================== -->
        <Teleport to="body">
          <Transition name="modal">
            <div
              v-if="selectedTicket"
              class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
              @click.self="closeTimeline"
            >
              <div class="bg-white rounded-3xl w-full max-w-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden" @click.stop>

                <!-- Modal Header -->
                <div class="flex items-start justify-between px-6 pt-6 pb-5 border-b border-slate-100 shrink-0">
                  <div class="flex items-start gap-4">
                    <!-- Status icon -->
                    <div class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" :class="getStatusBg(selectedTicket.status)">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="getStatusColor(selectedTicket.status)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-black text-slate-900 leading-tight">{{ selectedTicket.title || selectedTicket.service }}</h3>
                      
                      <!-- Categories / Service Type in Modal -->
                      <div class="flex flex-wrap gap-1.5 mt-2" v-if="selectedTicket.title && selectedTicket.title !== selectedTicket.service">
                        <span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider border border-slate-200">{{ selectedTicket.service }}</span>
                      </div>
                      <div class="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span class="text-xs font-mono font-bold text-slate-400">#{{ selectedTicket.ticketId }}</span>
                        <span class="text-slate-300">·</span>
                        <span class="text-xs font-bold text-slate-500">{{ selectedTicket.unit }}</span>
                        <span :class="['inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide border', getStatusBadge(selectedTicket.status)]">
                          <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDot(selectedTicket.status)"></span>
                          {{ selectedTicket.statusLabel }}
                        </span>
                        <!-- Live Tracking Pulse Indicator -->
                        <span class="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>Live Sync</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <!-- Manual Sync Button -->
                    <button
                      type="button"
                      @click="syncOpenTicket()"
                      :disabled="isSyncingTicket"
                      class="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 text-xs font-bold rounded-xl border border-slate-200 hover:border-emerald-200 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer disabled:opacity-60"
                      title="Force refresh status from server"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" :class="{ 'animate-spin text-emerald-600': isSyncingTicket }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span class="hidden sm:inline">{{ isSyncingTicket ? 'Syncing...' : 'Sync Status' }}</span>
                    </button>

                    <button
                      v-if="selectedTicket.status === 'pending'"
                      @click="promptCancelTicket(selectedTicket)"
                      class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl border border-rose-200/80 transition-all flex items-center gap-1 active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel Request
                    </button>
                    <button @click="closeTimeline" class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all active:scale-95 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Modal Body -->
                <div class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">

                  <!-- ========== TIMELINE STEPS ========== -->
                  <div>
                    <!-- Official Timeline Extension Notice Banner in Modal -->
                    <div v-if="selectedTicket.is_extended && selectedTicket.extension_days > 0" class="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 animate-fade-in">
                      <div class="p-2 bg-amber-100 rounded-xl text-amber-700 shrink-0 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-1 flex-wrap">
                          <span class="text-[10px] font-black text-amber-800 uppercase tracking-widest">Timeline Extension Notice</span>
                          <span class="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-200 text-amber-800 border border-amber-300 uppercase tracking-wider">
                            +{{ selectedTicket.extension_days }} Working Day(s)
                          </span>
                        </div>
                        <p class="text-xs text-amber-900 font-semibold leading-relaxed">
                          Target completion adjusted to <strong>{{ formatDate(selectedTicket.effective_target_date || selectedTicket.target_completion_date) }}</strong> (total duration: {{ selectedTicket.workingDays }} working days).
                        </p>
                        <p v-if="selectedTicket.extension_reason" class="text-xs text-amber-800 font-medium mt-1 italic">
                          <span class="font-bold not-italic text-[10px] uppercase tracking-wider text-amber-900">Reason:</span> "{{ selectedTicket.extension_reason }}"
                        </p>
                      </div>
                    </div>

                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Request Progress</p>
                    <div class="relative pl-8 space-y-6 before:absolute before:inset-y-2 before:left-[15px] before:w-0.5 before:bg-slate-200">
                      <div v-for="(step, index) in getSteps(selectedTicket)" :key="index" class="relative">
                        <!-- Step dot -->
                        <div :class="[
                          'absolute -left-8 w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-white text-xs font-black transition-all duration-500',
                          isStepCompleted(selectedTicket, index)
                            ? 'bg-emerald-500 text-white shadow-emerald-500/30 shadow-md'
                            : isStepActive(selectedTicket, index)
                              ? getActiveDot(selectedTicket.status) + ' shadow-md'
                              : 'bg-slate-200 text-slate-400'
                        ]">
                          <svg v-if="isStepCompleted(selectedTicket, index)" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                          </svg>
                          <span v-else class="leading-none">{{ index + 1 }}</span>
                        </div>

                        <!-- Step content -->
                        <div :class="['ml-2 pb-1', !isStepCompleted(selectedTicket, index) && selectedTicket.currentStep < (index + 1) ? 'opacity-40' : '']">
                          <div class="flex items-center gap-2 mb-0.5">
                            <h4 :class="['font-bold text-sm leading-tight', isStepCompleted(selectedTicket, index) || selectedTicket.currentStep >= (index + 1) ? 'text-slate-900' : 'text-slate-400']">
                              {{ step.label }}
                            </h4>
                            <span v-if="isStepActive(selectedTicket, index)" :class="['px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest', getActiveStepBadge(selectedTicket.status)]">
                              Current
                            </span>
                            <span v-else-if="isStepCompleted(selectedTicket, index) && (index === getSteps(selectedTicket).length - 1 || step.label === 'Job Finished')" class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700">
                              Completed
                            </span>
                          </div>
                          <p class="text-xs text-slate-500 leading-relaxed">{{ getStepDescription(selectedTicket, step, index) }}</p>

                          <!-- ---- FGMU/LEAU: View Digital Ticket (Step 2) ---- -->
                          <template v-if="(selectedTicket.unit === 'FGMU' || selectedTicket.unit === 'LEAU') && index === 1">
                            <button v-if="selectedTicket.currentStep >= 2" @click="showDigitalForm = !showDigitalForm" class="mt-3 px-3.5 py-2 bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 text-xs font-bold rounded-lg transition-all flex items-center gap-2 shadow-sm active:scale-95">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {{ showDigitalForm ? 'Hide Ticket Form' : 'View Digital Ticket' }}
                            </button>
                            <div v-if="showDigitalForm" class="mt-3 animate-fade-in">
                              <DigitalFormCard :ticket="selectedTicket" color="emerald" @download="downloadAttachment" />
                            </div>
                          </template>

                          <!-- ---- SSU: Incident Report (Step 1) ---- -->
                          <template v-if="selectedTicket.unit === 'SSU' && selectedTicket.service === 'Incident Report' && index === 0">
                            <button v-if="selectedTicket.currentStep >= 1" @click="showDigitalForm = !showDigitalForm" class="mt-3 px-3.5 py-2 bg-white border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-bold rounded-lg transition-all flex items-center gap-2 shadow-sm active:scale-95">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {{ showDigitalForm ? 'Hide Report' : 'View Report' }}
                            </button>
                            <div v-if="showDigitalForm" class="mt-3 animate-fade-in">
                              <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                                <FormRow label="Incident Type" :value="selectedTicket.incident_type" />
                                <FormRow label="When" :value="selectedTicket.when" />
                                <FormRow label="Where" :value="selectedTicket.where" />
                                <FormRow label="Narrative (How)" :value="selectedTicket.how" full />
                              </div>
                            </div>
                          </template>

                          <!-- ---- SSU: Incident Report Step 3 — Dynamic investigation/notation tags ---- -->
                          <template v-if="selectedTicket.unit === 'SSU' && selectedTicket.service === 'Incident Report' && index === 2 && selectedTicket.currentStep >= 3">
                            <div class="mt-3 flex flex-wrap gap-2">
                              <span
                                v-if="selectedTicket.isUnderInvestigation"
                                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-violet-100 text-violet-700 border border-violet-200"
                              >
                                <span class="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
                                Under Investigation
                              </span>
                              <span
                                v-if="selectedTicket.hasNotation"
                                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-700 border border-blue-200"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                                Notation Added
                              </span>
                            </div>
                          </template>

                        </div>
                      </div>
                    </div>
                  </div>



                  <!-- ========== AWAITING RATING STATE IN TIMELINE ========== -->
                  <div
                    v-if="isFeedbackEligible(selectedTicket) && !selectedTicket.isClosed"
                    class="bg-amber-50/90 border-2 border-amber-200 rounded-3xl p-6 sm:p-7 text-left space-y-6 shadow-sm"
                  >
                    <div class="flex items-start gap-4">
                      <div class="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md shadow-amber-500/30">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-1">
                          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-200/80 text-amber-900 border border-amber-300">Action Required</span>
                          <span class="text-xs font-bold text-amber-800">Section F</span>
                        </div>
                        <h4 class="font-black text-slate-900 text-lg sm:text-xl tracking-tight">Service Complete — Evaluation Required</h4>
                        <p class="text-xs sm:text-sm text-slate-600 mt-1">The service has been completed by the assigned team. Please rate the service quality below to finalize and close this ticket.</p>
                      </div>
                    </div>

                    <!-- Direct embedded rating form inside the timeline modal -->
                    <div class="border-t border-amber-200/80 pt-6 space-y-6">
                      <!-- 1. Job Completion Status -->
                      <div class="bg-white p-5 sm:p-6 rounded-2xl border-2 border-slate-200/80 shadow-xs space-y-3">
                        <div class="flex items-center justify-between gap-2">
                          <label class="block text-sm sm:text-base font-black text-slate-900 uppercase tracking-wide">
                            1. Job Completion Status <span class="text-rose-500">*</span>
                          </label>
                          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Required</span>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <label
                            v-for="option in completionOptions"
                            :key="option.value"
                            :class="[
                              'flex items-center gap-3.5 p-4 border-2 rounded-2xl cursor-pointer transition-all duration-150 select-none group',
                              satisfactionForm.completionStatus === option.value
                                ? option.activeClass
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs hover:shadow-xs'
                            ]"
                          >
                            <input type="radio" v-model="satisfactionForm.completionStatus" :value="option.value" class="hidden" />
                            <div
                              class="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
                              :class="satisfactionForm.completionStatus === option.value ? option.indicatorClass : 'border-slate-300 bg-white group-hover:border-slate-400'"
                            >
                              <div v-if="satisfactionForm.completionStatus === option.value" class="w-2.5 h-2.5 rounded-full bg-white"></div>
                            </div>
                            <span class="text-sm sm:text-base font-bold leading-snug">{{ option.label }}</span>
                          </label>
                        </div>
                      </div>

                      <!-- 2. Service Quality Rating -->
                      <div
                        v-if="satisfactionForm.completionStatus === 'on-time' || satisfactionForm.completionStatus === 'beyond-time'"
                        class="bg-white p-5 sm:p-7 rounded-2xl border-2 border-slate-200/80 shadow-xs space-y-5 animate-fade-in"
                      >
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                          <div>
                            <label class="block text-sm sm:text-base font-black text-slate-900 uppercase tracking-wide">
                              2. Service Quality Rating <span class="text-rose-500">*</span>
                            </label>
                            <p class="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">Click a number from 1 to 5 for each criterion</p>
                          </div>

                          <!-- Rating Scale Legend Pills -->
                          <div class="flex items-center gap-1.5 flex-wrap text-xs font-bold text-slate-600 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
                            <span class="text-rose-600 font-bold">1: Poor</span>
                            <span class="text-slate-300">•</span>
                            <span class="text-amber-600 font-bold">2: Fair</span>
                            <span class="text-slate-300">•</span>
                            <span class="text-blue-600 font-bold">3: Satisfactory</span>
                            <span class="text-slate-300">•</span>
                            <span class="text-emerald-600 font-bold">4: Very Sat.</span>
                            <span class="text-slate-300">•</span>
                            <span class="text-emerald-700 font-black">5: Outstanding</span>
                          </div>
                        </div>

                        <!-- Rating Criteria Items -->
                        <div class="space-y-4">
                          <div
                            v-for="(label, key) in ratingCriteria"
                            :key="key"
                            class="bg-slate-50/70 border-2 border-slate-200/80 hover:border-slate-300 rounded-2xl p-4 sm:p-5 transition-all shadow-2xs space-y-3"
                          >
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <h5 class="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                                  <span class="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                                  {{ label }}
                                </h5>
                                <p class="text-xs sm:text-sm text-slate-500 font-medium pl-4 mt-0.5">{{ getCriteriaDesc(key) }}</p>
                              </div>

                              <!-- Dynamic Feedback Score Badge -->
                              <div v-if="satisfactionForm.ratings[key]" class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/90 border border-amber-300 text-amber-900 rounded-xl text-xs sm:text-sm font-black shadow-xs self-start sm:self-auto animate-fade-in">
                                <span class="text-amber-600 font-black">★</span>
                                <span>Score: {{ satisfactionForm.ratings[key] }} / 5</span>
                                <span class="text-amber-700 font-extrabold">({{ getRatingLabel(satisfactionForm.ratings[key]) }})</span>
                              </div>
                              <div v-else class="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-xl self-start sm:self-auto">
                                Please click 1 to 5 below
                              </div>
                            </div>

                            <!-- Big, tactile, unmistakably clickable buttons -->
                            <div class="grid grid-cols-5 gap-2 sm:gap-3 pt-1">
                              <button
                                v-for="star in 5"
                                :key="star"
                                type="button"
                                @click="satisfactionForm.ratings[key] = star"
                                :title="`${star} - ${getRatingLabel(star)}`"
                                :class="[
                                  'min-h-[58px] sm:min-h-[68px] p-2 rounded-2xl flex flex-col items-center justify-center transition-all duration-150 cursor-pointer select-none group border-2',
                                  satisfactionForm.ratings[key] === star
                                    ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white font-black border-amber-500 shadow-md shadow-amber-500/35 scale-[1.02] ring-2 ring-amber-400 ring-offset-2'
                                    : 'bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-900 font-black border-slate-300 hover:border-amber-400 shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95'
                                ]"
                              >
                                <div class="flex items-center gap-1">
                                  <span class="text-xl sm:text-2xl font-black leading-none group-hover:scale-110 transition-transform">
                                    {{ star }}
                                  </span>
                                  <span class="text-amber-400 text-sm sm:text-base leading-none" :class="satisfactionForm.ratings[key] === star ? 'text-white' : 'group-hover:text-amber-500'">★</span>
                                </div>
                                <span
                                  class="text-[10px] sm:text-xs font-bold mt-1 leading-none text-center truncate max-w-full px-0.5"
                                  :class="satisfactionForm.ratings[key] === star ? 'text-amber-100 font-black' : 'text-slate-500 group-hover:text-amber-800'"
                                >
                                  {{ getRatingLabel(star, true) }}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Beyond Time Reasons -->
                      <div v-if="satisfactionForm.completionStatus === 'beyond-time'" class="bg-white p-5 sm:p-6 rounded-2xl border-2 border-slate-200/80 space-y-3 animate-fade-in shadow-xs">
                        <label class="block text-sm sm:text-base font-black text-slate-900 uppercase tracking-wide mb-3">
                          Reasons for beyond time completion
                        </label>
                        <div class="space-y-3">
                          <CheckboxItem v-model="satisfactionForm.beyondTimeReasons.personnelAbsent" label="Personnel absent / on-leave" />
                          <CheckboxItem v-model="satisfactionForm.beyondTimeReasons.extendedBreak" label="Extended break period" />
                          <CheckboxItem v-model="satisfactionForm.beyondTimeReasons.additionalWork" label="Additional work requested" />
                        </div>
                      </div>

                      <!-- Not Completed Reasons -->
                      <div v-if="satisfactionForm.completionStatus === 'not-completed'" class="bg-white p-5 sm:p-6 rounded-2xl border-2 border-slate-200/80 space-y-3 animate-fade-in shadow-xs">
                        <label class="block text-sm sm:text-base font-black text-slate-900 uppercase tracking-wide mb-3">
                          Reasons for not completed / performed
                        </label>
                        <div class="space-y-3">
                          <CheckboxItem v-model="satisfactionForm.notCompletedReasons.lackWorkingDays" label="Lack of working days" />
                          <CheckboxItem v-model="satisfactionForm.notCompletedReasons.lackMaterials" label="Lack of materials / tools" />
                          <CheckboxItem v-model="satisfactionForm.notCompletedReasons.lackSkills" label="Lack of skills" />
                        </div>
                      </div>

                      <!-- Remarks -->
                      <div v-if="satisfactionForm.completionStatus" class="bg-white p-5 sm:p-6 rounded-2xl border-2 border-slate-200/80 shadow-xs space-y-2 animate-fade-in">
                        <label class="block text-sm sm:text-base font-black text-slate-900 uppercase tracking-wide mb-1">
                          Remarks / Commendations (Optional)
                        </label>
                        <textarea
                          v-model="satisfactionForm.remarks"
                          rows="3"
                          class="w-full px-4 py-3 bg-slate-50/60 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white outline-none text-sm sm:text-base text-slate-800 transition-all resize-none placeholder:text-slate-400 font-medium"
                          placeholder="Share your commendations, comments, or suggestions regarding the service...">
                        </textarea>
                      </div>

                      <!-- Submit Action Button -->
                      <button
                        type="button"
                        @click="closeTicket(selectedTicket)"
                        :disabled="!isFormValid || isSubmittingFeedback"
                        :class="[
                          'w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-3 transition-all duration-150 select-none cursor-pointer shadow-md',
                          isFormValid && !isSubmittingFeedback
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25 hover:shadow-lg active:scale-[0.99]'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                        ]"
                      >
                        <svg v-if="isSubmittingFeedback" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{{ isSubmittingFeedback ? 'Submitting Evaluation & Closing Ticket...' : 'Submit Evaluation & Close Ticket' }}</span>
                      </button>
                    </div>
                  </div>

                  <!-- ========== TICKET CLOSED STATE ========== -->
                  <div
                    v-if="selectedTicket.isClosed || selectedTicket.status === 'closed' || selectedTicket.status === 'completed' || (selectedTicket.unit === 'SSU' && selectedTicket.service === 'Incident Report' && selectedTicket.currentStep >= 4)"
                    class="bg-slate-50 border border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center"
                  >
                    <div class="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 class="font-black text-slate-900 text-base mb-1">Ticket Resolved</h4>
                    <p v-if="selectedTicket.unit === 'SSU' && selectedTicket.service === 'Incident Report'" class="text-sm text-slate-500">
                      This incident report has been resolved and archived by the SSU staff.
                    </p>
                    <p v-else class="text-sm text-slate-500">
                      Thank you for your feedback! This ticket has been successfully closed.
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </Transition>
        </Teleport>

      </div>

      <!-- Toast Notification -->
      <Teleport to="body">
        <Transition name="modal">
          <div v-if="showToast" class="fixed bottom-6 right-6 z-[200] max-w-sm animate-fade-in">
            <div class="bg-emerald-600 text-white px-5 py-3.5 rounded-xl shadow-xl shadow-emerald-600/20 flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 mt-0.5 text-emerald-100" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <p class="text-sm font-medium leading-relaxed">{{ toastMessage }}</p>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Cancel Request Confirmation Modal -->
      <Teleport to="body">
        <Transition name="modal">
          <div
            v-if="showCancelModal"
            class="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
            @click.self="showCancelModal = false"
          >
            <div class="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 transform transition-all">
              <div class="flex items-center gap-3.5 mb-4">
                <div class="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-black text-slate-900 leading-tight">Cancel Service Request</h3>
                  <p class="text-xs text-slate-500 font-medium">Ticket <span class="font-mono font-bold text-slate-700">#{{ ticketToCancel?.ticketId }}</span></p>
                </div>
              </div>

              <p class="text-xs text-slate-600 leading-relaxed mb-4">
                Are you sure you want to cancel this request? This action cannot be undone once confirmed.
              </p>

              <!-- Quick Reasons -->
              <div class="mb-3">
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Reason for Cancellation</label>
                <div class="flex flex-wrap gap-1.5 mb-2">
                  <button
                    v-for="r in ['Problem already solved', 'Submitted by mistake', 'Duplicate request', 'Schedule conflict']"
                    :key="r"
                    type="button"
                    @click="cancellationReason = r"
                    class="px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all"
                    :class="cancellationReason === r ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'"
                  >
                    {{ r }}
                  </button>
                </div>
                <textarea
                  v-model="cancellationReason"
                  rows="2"
                  placeholder="Optional details or reason..."
                  class="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-0 transition-all placeholder:text-slate-400"
                ></textarea>
              </div>

              <!-- Action buttons -->
              <div class="flex items-center justify-end gap-2.5 mt-6">
                <button
                  type="button"
                  @click="showCancelModal = false"
                  class="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                  :disabled="isCancelling"
                >
                  Keep Request
                </button>
                <button
                  type="button"
                  @click="executeCancelTicket"
                  class="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-rose-600/20 active:scale-95 flex items-center gap-2"
                  :disabled="isCancelling"
                >
                  <svg v-if="isCancelling" class="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>{{ isCancelling ? 'Cancelling...' : 'Confirm Cancellation' }}</span>
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Document & Attachment Viewer Modal -->
      <DocumentViewerModal
        v-model:isOpen="viewerModal.isOpen"
        :title="viewerModal.title"
        :fileName="viewerModal.fileName"
        :fileBlob="viewerModal.fileBlob"
        :fileUrl="viewerModal.fileUrl"
      />
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted, defineComponent, h } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import DocumentViewerModal from '@/components/DocumentViewerModal.vue';
import { attachFgmuJobRequestForm, generateFgmuJobRequestFormBlob } from '@/utils/fgmuPdfGenerator';
import { parseDateLocal } from '@/utils/workCalendar';
import { useAuthStore } from '@/stores/auth';
import { useNetworkStatus } from '@/utils/networkMonitor';
import api from '@/api/client';
import { toast } from 'vue3-toastify';

const router = useRouter();

const { onReconnected } = useNetworkStatus();
const isSyncingTicket = ref(false);
const lastSyncedAt = ref(Date.now());
let modalSyncTimer = null;
let unregisterReconnected = null;

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const parsed = parseDateLocal(dateStr);
  if (!parsed || isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const authStore = useAuthStore();

const ratingTicketId = ref(null);
const showToast = ref(false);
const toastMessage = ref('');

const viewerModal = reactive({
  isOpen: false,
  title: '',
  fileName: '',
  fileBlob: null,
  fileUrl: '',
});

const toggleRatingForm = (ticket) => {
  if (ratingTicketId.value === ticket.ticketId) {
    ratingTicketId.value = null;
  } else {
    ratingTicketId.value = ticket.ticketId;
    resetForm();
  }
};

// ---- Sub-components defined inline to keep file self-contained ----

/**
 * Reusable label/value pair for form detail display.
 */
const FormRow = defineComponent({
  props: { label: String, value: String, full: Boolean },
  setup(props) {
    return () => h('div', { class: props.full ? 'col-span-2' : '' }, [
      h('p', { class: 'text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5' }, props.label),
      h('p', { class: 'text-xs font-bold text-slate-700 leading-relaxed' }, props.value || 'N/A'),
    ]);
  },
});

import { isDocxFile, isPdfFile, handleAttachmentClick, downloadAttachmentDirectly } from '@/utils/attachmentHelper';

/**
 * Attachment list renderer for FGMU/LEAU/SSU digital forms.
 */
const AttachmentList = defineComponent({
  props: { attachments: Array },
  emits: ['download'],
  setup(props, { emit }) {
    return () => props.attachments?.length
      ? h('div', { class: 'mt-3 pt-3 border-t border-slate-200' }, [
          h('p', { class: 'text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2' }, 'Attachments & Documents'),
          h('div', { class: 'space-y-2' }, props.attachments.map(att => {
            const isWord = isDocxFile(att.file_name, att.file_type);
            const isPdf = isPdfFile(att.file_name, att.file_type);

            return h('div', {
              key: att.id,
              class: 'w-full flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl hover:border-emerald-400 transition-all shadow-xs group',
            }, [
              h('div', { class: 'flex items-center gap-3 min-w-0 flex-1 cursor-pointer', onClick: () => emit('download', att) }, [
                h('div', {
                  class: `w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    isWord ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-100' :
                    isPdf ? 'bg-rose-50 text-rose-600 group-hover:bg-rose-100' :
                    'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100'
                  }`
                }, [
                  h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-4 w-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
                    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' })
                  )
                ]),
                h('div', { class: 'min-w-0 flex-1' }, [
                  h('p', { class: 'text-xs font-bold text-slate-700 truncate group-hover:text-emerald-700 transition-colors' }, att.file_name || 'Attachment'),
                  h('p', { class: 'text-[10px] text-slate-400 font-medium' }, [
                    att.file_size_bytes ? `${(att.file_size_bytes / 1024).toFixed(1)} KB` : 'Attached File',
                    h('span', { class: 'mx-1' }, '•'),
                    h('span', { class: isWord ? 'text-blue-600 font-bold' : isPdf ? 'text-rose-600 font-bold' : 'text-slate-500' }, isWord ? 'DOCX (Auto-download)' : isPdf ? 'PDF Document' : 'File')
                  ]),
                ]),
              ]),
              h('div', { class: 'flex items-center gap-1.5 shrink-0 ml-2' }, [
                // If PDF, show explicit View button
                isPdf ? h('button', {
                  type: 'button',
                  onClick: () => emit('download', att),
                  class: 'px-2.5 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer',
                }, 'Preview') : null,
                // Direct download button for all
                h('button', {
                  type: 'button',
                  onClick: () => downloadAttachmentDirectly(att),
                  class: 'px-2.5 py-1 text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer',
                  title: 'Download file'
                }, 'Download'),
              ]),
            ]);
          })),
        ])
      : null;
  },
});

/**
 * Digital ticket card for FGMU/LEAU.
 */
const DigitalFormCard = defineComponent({
  props: { ticket: Object, color: { type: String, default: 'emerald' } },
  emits: ['download'],
  setup(props, { emit }) {
    return () => h('div', { class: 'p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3' }, [
      h('div', { class: 'grid grid-cols-2 gap-3' }, [
        h(FormRow, { label: 'Date', value: props.ticket.date }),
        h(FormRow, { label: 'Service', value: props.ticket.service }),
        h(FormRow, { label: 'Location', value: props.ticket.location || 'Main Campus' }),
        h(FormRow, { label: 'Office / Room', value: props.ticket.office_room || 'N/A' }),
        ...(props.ticket.implementationDate ? [h(FormRow, { label: 'Implementation Date', value: props.ticket.implementationDate })] : []),
        ...(props.ticket.workingDays ? [h(FormRow, { label: 'Target Working Days', value: `${props.ticket.workingDays} Day(s)` + (props.ticket.extension_days > 0 ? ` (+${props.ticket.extension_days}d ext)` : '') })] : []),
        ...((props.ticket.effective_target_date || props.ticket.target_completion_date) ? [h(FormRow, { label: 'Target Completion Date', value: formatDate(props.ticket.effective_target_date || props.ticket.target_completion_date) })] : []),
      ]),

      ...(props.ticket.attachments?.length ? [h(AttachmentList, { attachments: props.ticket.attachments, onDownload: (att) => emit('download', att) })] : []),
    ]);
  },
});

/**
 * Styled checkbox item with enhanced touch target and clear typography.
 */
const CheckboxItem = defineComponent({
  props: { modelValue: Boolean, label: String },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h('label', { class: 'flex items-center gap-3 cursor-pointer group select-none py-1' }, [
      h('div', {
        class: `relative flex-shrink-0 w-6 h-6 border-2 rounded-lg overflow-hidden transition-all duration-150 shadow-2xs ${
          props.modelValue ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 bg-white group-hover:border-emerald-500'
        }`
      }, [
        h('input', {
          type: 'checkbox',
          checked: props.modelValue,
          class: 'absolute inset-0 opacity-0 cursor-pointer',
          onChange: (e) => emit('update:modelValue', e.target.checked)
        }),
        props.modelValue ? h('svg', {
          class: 'absolute inset-0 w-full h-full p-1 text-white',
          fill: 'none',
          viewBox: '0 0 24 24',
          stroke: 'currentColor',
          'stroke-width': '3'
        }, h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          d: 'M5 13l4 4L19 7'
        })) : null,
      ]),
      h('span', { class: 'text-sm sm:text-base font-semibold text-slate-700 group-hover:text-slate-900 transition-colors' }, props.label),
    ]);
  },
});

// ---- Document & Attachment Preview ----
const downloadAttachment = async (att) => {
  await handleAttachmentClick(att, (blob, att) => {
    viewerModal.title = att.file_name || 'Document Attachment';
    viewerModal.fileName = att.file_name || 'attachment.pdf';
    viewerModal.fileBlob = blob;
    viewerModal.fileUrl = '';
    viewerModal.isOpen = true;
  });
};

const openJobRequestFormViewer = async (ticket) => {
  try {
    const ticketId = ticket.ticketId || ticket.id;
    viewerModal.title = `FGMU Job Request Form - #${ticketId}`;
    viewerModal.fileName = `FGMU Job Request Form - #${ticketId}.pdf`;
    
    // Check if PDF attachment already exists in ticket attachments
    const existingPdfAtt = (ticket.attachments || []).find(a => 
      a.file_name && 
      (a.file_name.toLowerCase().includes('job request form') || a.file_name.toLowerCase().includes('fgmu')) &&
      a.file_name.toLowerCase().endsWith('.pdf')
    );
    
    if (existingPdfAtt) {
      const response = await api.get(`attachments/${existingPdfAtt.id}`, { responseType: 'blob' });
      viewerModal.fileBlob = new Blob([response.data], { type: 'application/pdf' });
    } else {
      const blob = await generateFgmuJobRequestFormBlob(ticket, ticket.feedback);
      viewerModal.fileBlob = blob;
    }
    
    viewerModal.fileUrl = '';
    viewerModal.isOpen = true;
  } catch (err) {
    console.error('Failed to open FGMU Job Request Form:', err);
    toast.error('Failed to load Job Request Form document preview.');
  }
};

// ---- Route highlight ----
const route            = useRoute();
const highlightedTicket = ref(null);

// ---- Data ----
const userName = ref('');
const tickets  = ref([]);

// ---- Data Mapping Helper ----
const mapTicketData = (t) => ({
  id: t.id,
  ticketId: t.id,
  title: t.title,
  service: t.service_type,
  unit: t.unit_code,
  description: t.description,
  status: t.status,
  statusLabel: t.status_label,
  date: new Date(t.completed_at || t.submitted_at || t.updated_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  requestedBy: userName.value || 'User',
  location: t.location,
  office_room: t.office_room,
  make_series: t.details?.make_series || '',
  color: t.details?.type_color || '',
  address: t.details?.house_street
    ? `${t.details.house_street}, ${t.details.barangay}, ${t.details.city_municipality}, ${t.details.province}`
    : (t.details?.complete_address || ''),
  destination: t.details?.destination || 'N/A',
  passengers: t.details?.num_passengers || t.details?.number_of_passengers || t.details?.numberOfPassengers || 'N/A',
  dateOfTravel: t.details?.date_of_travel || t.details?.dateOfTravel || 'N/A',
  purpose: t.details?.purpose_of_travel || t.details?.purposeOfTravel || t.details?.purpose || 'N/A',
  attachments: t.attachments || [],
  declineReason: t.decline_reason || '',
  currentStep: (['closed', 'completed', 'resolved'].includes(t.status) || !!t.completed_at)
    ? Math.max(parseInt(t.current_step) || 0, (t.unit === 'SSU' || t.unit_code === 'SSU' || t.unit_id === 3) ? (['closed', 'completed'].includes(t.status) ? 5 : 4) : 6)
    : (parseInt(t.current_step) || 1),
  assignment: t.assignment || null,
  assignments: t.assignments || [],
  assignedWorker: t.assignment?.personnel_name || t.assigned_worker || (t.assignments?.[0]?.assigned_to_name) || null,
  assignedProfession: t.assignment?.specialty || t.assignment?.profession || (t.assignments?.[0]?.specialty) || null,
  assignedContact: t.assignment?.personnel_contact || null,
  details: t.details || null,
  feedback: t.feedback || null,
  materials: t.materials || [],
  total_material_cost: t.total_material_cost || 0,
  submitted_at: t.submitted_at,
  completed_at: t.completed_at || t.updated_at,
  implementationDate: t.assignment?.implementation_date
    ? formatDate(t.assignment.implementation_date)
    : null,
  extension_days: Number(t.extension_days) || 0,
  extension_reason: t.extension_reason || '',
  extended_completion_date: t.extended_completion_date || null,
  is_extended: !!t.is_extended || (Number(t.extension_days) > 0) || !!t.extended_completion_date,
  target_completion_date: t.target_completion_date || t.extended_completion_date || null,
  effective_target_date: t.effective_target_date || t.target_completion_date || t.extended_completion_date || null,
  base_working_days: Number(t.working_days || t.project_working_days || t.assignment?.working_days) || null,
  total_working_days: (Number(t.working_days || t.project_working_days || t.assignment?.working_days || 0)) + (Number(t.extension_days) || 0),
  workingDays: (Number(t.working_days || t.project_working_days || t.assignment?.working_days || 0)) + (Number(t.extension_days) || 0) || (t.working_days || t.project_working_days || t.assignment?.working_days || null),
  working_days: t.working_days || t.project_working_days || t.assignment?.working_days || null,
  isClosed: t.status === 'completed' || t.status === 'closed',
  accomplishment_report_path: t.accomplishment_report_path || null,
  accomplishment_notes: t.accomplishment_notes || '',
  verification_status: t.verification_status || 'pending_report',
  verified_at: t.verified_at || null,
  eodb_tier: t.eodb_tier || null,
  eodb_days: t.eodb_days || null,
  is_emergency: !!t.is_emergency,
  is_vip: !!t.is_vip,
  // SSU Incident Report specific fields
  isUnderInvestigation: Number(t.is_under_investigation) === 1,
  hasNotation:          !!t.ssu_notation,
  notation:             t.ssu_notation || '',
  actionsTaken:         t.ssu_notation || '',
});

// Dedicated Single-Ticket Live Synchronization
const syncOpenTicket = async (targetId = null) => {
  const tId = targetId || selectedTicket.value?.ticketId || selectedTicket.value?.id;
  if (!tId) return;

  isSyncingTicket.value = true;
  try {
    const res = await api.get(`tickets/${tId}`);
    const rawTicket = res.data?.data?.ticket;
    if (rawTicket) {
      const mapped = mapTicketData(rawTicket);
      selectedTicket.value = mapped;

      const curId = String(tId);
      const idx = tickets.value.findIndex(t => String(t.ticketId || t.id) === curId);
      if (idx !== -1) {
        tickets.value[idx] = mapped;
      }
      lastSyncedAt.value = Date.now();
    }
  } catch (err) {
    console.warn(`[User_Tickets] Failed to sync ticket #${tId}:`, err?.message || err);
  } finally {
    isSyncingTicket.value = false;
  }
};

const fetchTickets = async () => {
  try {
    const activeRes = await api.get('tickets/my-requests');
    const activeList = activeRes.data?.data?.tickets || [];

    tickets.value = activeList.map(mapTicketData);

    const ackMap = JSON.parse(localStorage.getItem('gso_ssu_acknowledged_incidents') || '{}');
    tickets.value.forEach(t => {
      if (ackMap[t.ticketId]) {
        Object.assign(t, ackMap[t.ticketId]);
      }
    });

    // Update the timeline modal ticket if it is currently open (type-safe comparison)
    if (selectedTicket.value) {
      const curId = String(selectedTicket.value.ticketId || selectedTicket.value.id);
      const updated = tickets.value.find(t => String(t.ticketId || t.id) === curId);
      if (updated) {
        selectedTicket.value = updated;
      }
    }
    handleRouteTicket();
  } catch (error) {
    console.error('Failed to fetch tickets:', error);
  }
};

let pollingInterval = null;
let handledRouteQueryKey = null;

const clearRouteQueryTicket = () => {
  if (route.query.ticketId || route.query.highlight || route.query._t) {
    const nextQuery = { ...route.query };
    delete nextQuery.ticketId;
    delete nextQuery.highlight;
    delete nextQuery._t;
    router.replace({ query: nextQuery }).catch(() => {});
  }
};

const handleRouteTicket = () => {
  const target = route.query.ticketId || route.query.highlight;
  const triggerKey = target ? `${target}_${route.query._t || 'init'}` : null;

  if (!target) {
    handledRouteQueryKey = null;
    return;
  }

  // Prevent auto-reopening the same routed notification ticket once handled
  if (handledRouteQueryKey === triggerKey) {
    return;
  }

  highlightedTicket.value = target;
  statusFilter.value = 'all';
  searchQuery.value = target;

  const match = tickets.value.find(t =>
    String(t.ticketId || t.id).toLowerCase() === String(target).toLowerCase()
  );

  if (match) {
    handledRouteQueryKey = triggerKey;
    if (!selectedTicket.value) {
      openTimeline(match);
    }
  } else if (tickets.value.length > 0) {
    // If ticket is not in active requests, it's completed/closed; redirect to completed tickets
    handledRouteQueryKey = triggerKey;
    router.replace({
      path: '/user/completed-tickets',
      query: { ticketId: target, highlight: target, _t: Date.now() }
    }).catch(() => {});
    return;
  }

  setTimeout(() => {
    const el = document.getElementById(target);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 300);
};

watch(() => [route.query.ticketId, route.query.highlight, route.query._t], () => {
  handleRouteTicket();
});

const handleFocusOrVisibility = () => {
  if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
    fetchTickets();
    if (selectedTicket.value) {
      syncOpenTicket();
    }
  }
};

onMounted(() => {
  handleRouteTicket();

  userName.value = authStore.user?.first_name || authStore.fullName || 'User';

  fetchTickets();
  pollingInterval = setInterval(() => {
    if (document.hidden) return;
    fetchTickets();
  }, 15000);

  // Tab Focus & Visibility change recovery
  window.addEventListener('focus', handleFocusOrVisibility);
  document.addEventListener('visibilitychange', handleFocusOrVisibility);

  // Auto-recovery when internet / network connectivity restores
  unregisterReconnected = onReconnected(() => {
    console.info('[User_Tickets] Network restored. Syncing tickets and active timeline...');
    fetchTickets();
    if (selectedTicket.value) {
      syncOpenTicket();
    }
  });
});

onUnmounted(() => {
  window.removeEventListener('focus', handleFocusOrVisibility);
  document.removeEventListener('visibilitychange', handleFocusOrVisibility);
  if (unregisterReconnected) unregisterReconnected();
  if (pollingInterval) clearInterval(pollingInterval);
  if (modalSyncTimer) clearInterval(modalSyncTimer);
});

// ---- Filtering ----
const searchQuery  = ref('');
const statusFilter = ref('all');

const statusCounts = computed(() => ({
  all:        tickets.value.length,
  pending:    tickets.value.filter(t => t.status === 'pending').length,
  processing: tickets.value.filter(t => t.status === 'processing').length,
  resolved:   tickets.value.filter(t => t.status === 'resolved').length,
  completed:  tickets.value.filter(t => t.status === 'completed' || t.status === 'closed').length,
  cancelled:  tickets.value.filter(t => t.status === 'cancelled').length,
}));

const statusTabs = computed(() => {
  const tabs = [
    { value: 'all',        label: 'All',             count: statusCounts.value.all,        activeClass: 'bg-slate-900 text-white border-slate-900' },
    { value: 'pending',    label: 'Pending',         count: statusCounts.value.pending,    activeClass: 'bg-amber-50 text-amber-700 border-amber-400' },
    { value: 'processing', label: 'In Progress',     count: statusCounts.value.processing, activeClass: 'bg-blue-50 text-blue-700 border-blue-400' },
    { value: 'resolved',   label: 'Awaiting Rating', count: statusCounts.value.resolved,   activeClass: 'bg-emerald-50 text-emerald-700 border-emerald-400' },
  ];
  if (statusCounts.value.completed > 0) {
    tabs.push({ value: 'completed', label: 'Completed', count: statusCounts.value.completed, activeClass: 'bg-slate-800 text-white border-slate-800' });
  }
  if (statusCounts.value.cancelled > 0) {
    tabs.push({ value: 'cancelled', label: 'Cancelled', count: statusCounts.value.cancelled, activeClass: 'bg-slate-100 text-slate-700 border-slate-400' });
  }
  return tabs;
});

const filteredTickets = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return tickets.value.filter(ticket => {
    const matchesSearch = ticket.ticketId.toLowerCase().includes(query)
      || ticket.service.toLowerCase().includes(query)
      || ticket.unit.toLowerCase().includes(query);
    const matchesStatus = statusFilter.value === 'all'
      ? true
      : statusFilter.value === 'completed'
        ? (ticket.status === 'completed' || ticket.status === 'closed')
        : ticket.status === statusFilter.value;
    return matchesSearch && matchesStatus;
  });
});

// ---- Timeline Modal ----
const selectedTicket   = ref(null);
const showDigitalForm  = ref(false);

const openTimeline = (ticket) => {
  selectedTicket.value  = ticket;
  showDigitalForm.value = false;
  resetForm();
  document.body.style.overflow = 'hidden';
};

const closeTimeline = () => {
  selectedTicket.value = null;
  document.body.style.overflow = '';
  clearRouteQueryTicket();
};

// ---- Cancel Ticket Modal ----
const showCancelModal    = ref(false);
const ticketToCancel     = ref(null);
const cancellationReason = ref('Problem already solved');
const isCancelling       = ref(false);

const promptCancelTicket = (ticket) => {
  ticketToCancel.value     = ticket;
  cancellationReason.value = 'Problem already solved';
  showCancelModal.value    = true;
};

const executeCancelTicket = async () => {
  if (!ticketToCancel.value) return;
  isCancelling.value = true;
  try {
    const ticketId = ticketToCancel.value.ticketId || ticketToCancel.value.id;
    await api.patch(`tickets/${ticketId}/cancel`, {
      reason: cancellationReason.value || 'Cancelled by requestor'
    });
    toast.success('Your service request has been cancelled.');
    showCancelModal.value = false;
    if (selectedTicket.value && (selectedTicket.value.ticketId === ticketId || selectedTicket.value.id === ticketId)) {
      closeTimeline();
    }
    ticketToCancel.value = null;
    await fetchTickets();
  } catch (error) {
    console.error('Cancellation failed:', error);
    toast.error(error.response?.data?.message || 'Failed to cancel request. Please try again.');
  } finally {
    isCancelling.value = false;
  }
};

// ---- Step definitions ----
const unitSteps = {
  FGMU: [
    { label: 'Digital Submission',  description: 'The client completes the required fields in the digital form.' },
    { label: 'Ticket Creation',     description: 'System generated a Digital Ticket.' },
    { label: 'Admin Approval',      description: 'Approved by the administration unit.' },
    { label: 'Dispatch & Schedule', description: 'Dispatcher assigned personnel and scheduled implementation.' },
    { label: 'Job Started',         description: 'Personnel have started the job.' },
    { label: 'Job Finished',        description: 'Personnel marked the job as complete.' },
  ],
  LEAU: [
    { label: 'Digital Submission',  description: 'The client completes the required fields in the digital form.' },
    { label: 'Ticket Creation',     description: 'System generated a Digital Ticket and assigned "Pending Approval" status.' },
    { label: 'Admin Approval',      description: 'Approved by the administration unit.' },
    { label: 'Dispatch & Schedule', description: 'Dispatcher assigned personnel and scheduled implementation.' },
    { label: 'Job Started',         description: 'Personnel have started the job.' },
    { label: 'Job Finished',        description: 'Personnel marked the job as complete.' },
  ],
  SSU: {
    'Incident Report': [
      { label: 'Report Submission',        description: 'The client fills out a digital Incident Report and submits it to SSU.' },
      { label: 'Staff Review',             description: 'SSU staff reviews the incident details.' },
      { label: 'Action / Investigation',   description: 'SSU staff takes action: logs a recommendation and/or opens an investigation.' },
      { label: 'Resolution',              description: 'SSU staff marks the incident as resolved.' },
      { label: 'Archiving',               description: 'Ticket moved to digital archives for record-keeping.' },
    ],
  },
};

const getSteps = (ticket) => {
  if (!ticket) return [];
  let steps = ticket.unit === 'SSU'
    ? [...(unitSteps.SSU[ticket.service] || [])]
    : [...(unitSteps[ticket.unit] || [])];

  steps = steps.map(s => ({ ...s }));

  if (ticket.implementationDate && (ticket.unit === 'FGMU' || ticket.unit === 'LEAU') && steps.length > 3) {
    const durationText = ticket.workingDays ? ` (${ticket.workingDays} working days expected)` : '';
    const extText = ticket.extension_days > 0 ? ` [Extended by +${ticket.extension_days} working day(s) to ${formatDate(ticket.effective_target_date || ticket.target_completion_date)}]` : '';
    const workerText = ticket.assignedWorker ? ` Assigned Personnel: ${ticket.assignedWorker}${ticket.assignedProfession ? ` (${ticket.assignedProfession})` : ''}.` : '';
    steps[3].description = `Dispatcher assigned personnel and scheduled implementation for ${ticket.implementationDate}${durationText}.${extText}${workerText}`;
  }

  if (ticket.status === 'declined' || ticket.status === 'rejected') {
    const reason = ticket.declineReason || 'Request declined by Admin.';
    if (steps.length > 1) {
      steps[1] = { label: 'Ticket Declined', description: `Reason: ${reason}` };
      steps = steps.slice(0, 2);
    }
  }

  return steps;
};

/**
 * Returns a dynamic description for a given step.
 * For SSU Incident Reports, step 3 (index 2) reflects the live ticket state
 * so the reporter sees exactly what is happening with their case.
 */
const getStepDescription = (ticket, step, index) => {
  if (
    ticket?.unit === 'SSU' &&
    ticket?.service === 'Incident Report' &&
    index === 2 &&
    ticket.currentStep >= 3
  ) {
    const hasInvestigation = ticket.isUnderInvestigation;
    const hasNotation      = ticket.hasNotation;

    if (hasInvestigation && hasNotation) {
      return 'SSU staff has opened an investigation and has communicated a recommendation to you.';
    }
    if (hasInvestigation) {
      return 'SSU staff has flagged this incident for active investigation.';
    }
    if (hasNotation) {
      return 'SSU staff has added a recommendation/notation. See the notation card below for details.';
    }
    return step.description;
  }
  return step.description;
};

// ---- Satisfaction Form ----
const isSubmittingFeedback = ref(false);

const completionOptions = [
  {
    value: 'on-time',
    label: 'Completed On-Time',
    activeClass: 'bg-emerald-50/90 border-emerald-500 text-emerald-950 shadow-sm ring-1 ring-emerald-500',
    indicatorClass: 'border-emerald-600 bg-emerald-600'
  },
  {
    value: 'beyond-time',
    label: 'Completed Beyond Time',
    activeClass: 'bg-amber-50/90 border-amber-500 text-amber-950 shadow-sm ring-1 ring-amber-500',
    indicatorClass: 'border-amber-600 bg-amber-600'
  },
  {
    value: 'not-completed',
    label: 'Not Completed / Performed',
    activeClass: 'bg-rose-50/90 border-rose-500 text-rose-950 shadow-sm ring-1 ring-rose-500',
    indicatorClass: 'border-rose-600 bg-rose-600'
  },
];

const ratingCriteria = {
  quality:     'Quality of Work / Service',
  efficiency:  'Efficiency / Work Discipline',
  timeliness:  'Timeliness of Completion',
};

const ratingScale = [
  { score: 1, label: 'Poor', shortLabel: 'Poor', shortDesc: 'Did not meet expectations' },
  { score: 2, label: 'Fair', shortLabel: 'Fair', shortDesc: 'Needs improvement' },
  { score: 3, label: 'Satisfactory', shortLabel: 'Satisfactory', shortDesc: 'Met requirements' },
  { score: 4, label: 'Very Satisfactory', shortLabel: 'Very Sat.', shortDesc: 'Exceeded requirements' },
  { score: 5, label: 'Outstanding', shortLabel: 'Outstanding', shortDesc: 'Superior workmanship' },
];

const getRatingLabel = (score, short = false) => {
  const item = ratingScale.find(s => s.score === Number(score));
  if (!item) return '';
  return short ? item.shortLabel : item.label;
};

const getCriteriaDesc = (key) => {
  const map = {
    quality: 'Craftsmanship, thoroughness, and standard of completed work',
    efficiency: 'Staff professionalism, work discipline, and proper resource use',
    timeliness: 'Promptness and adherence to the target delivery schedule',
  };
  return map[key] || '';
};

const satisfactionForm = ref({
  completionStatus: '',
  ratings: { quality: 0, efficiency: 0, timeliness: 0 },
  beyondTimeReasons:   { personnelAbsent: false, extendedBreak: false, additionalWork: false },
  notCompletedReasons: { lackWorkingDays: false, lackMaterials: false, lackSkills: false },
  remarks: '',
});

const resetForm = () => {
  satisfactionForm.value = {
    completionStatus: '',
    ratings: { quality: 0, efficiency: 0, timeliness: 0 },
    beyondTimeReasons:   { personnelAbsent: false, extendedBreak: false, additionalWork: false },
    notCompletedReasons: { lackWorkingDays: false, lackMaterials: false, lackSkills: false },
    remarks: '',
  };
};

const isFeedbackEligible = (ticket) => {
  if (!ticket || ticket.isClosed || ticket.status === 'closed' || ticket.status === 'completed') return false;
  // Ratings supported for FGMU and LEAU at completed step 6 or resolved status
  if (ticket.unit === 'FGMU' || ticket.unit === 'LEAU') return ticket.currentStep === 6 || ticket.status === 'resolved';
  return false;
};

const isStepCompleted = (ticket, index) => {
  if (!ticket) return false;
  const stepNum = index + 1;
  const steps = getSteps(ticket);
  const totalSteps = steps.length;

  // Fully closed / completed tickets have all steps completed
  if (ticket.isClosed || ['closed', 'completed'].includes(ticket.status)) {
    return stepNum <= totalSteps;
  }

  // Previous steps before currentStep are completed
  if (ticket.currentStep > stepNum) {
    return true;
  }

  // Check if this step is "Job Finished" (or the final step of the workflow)
  const isFinalOrFinishedStep = stepNum === totalSteps || steps[index]?.label === 'Job Finished';
  if (isFinalOrFinishedStep) {
    return (
      ticket.currentStep >= stepNum ||
      ['resolved', 'completed', 'closed'].includes(ticket.status) ||
      ticket.statusLabel === 'Awaiting User Rating' ||
      ticket.statusLabel === 'Awaiting Material Liquidation' ||
      ticket.statusLabel === 'Resolved' ||
      !!ticket.completed_at ||
      isFeedbackEligible(ticket)
    );
  }

  return false;
};

const isStepActive = (ticket, index) => {
  if (!ticket) return false;
  if (isStepCompleted(ticket, index)) return false;
  return ticket.currentStep === (index + 1);
};

const isFormValid = computed(() => {
  const form = satisfactionForm.value;
  if (!form.completionStatus) return false;
  if (form.completionStatus === 'on-time' || form.completionStatus === 'beyond-time') {
    const r = form.ratings;
    return r.quality > 0 && r.efficiency > 0 && r.timeliness > 0;
  }
  if (form.completionStatus === 'not-completed') {
    const nr = form.notCompletedReasons;
    return nr.lackWorkingDays || nr.lackMaterials || nr.lackSkills;
  }
  return false;
});

const closeTicket = async (ticket) => {
  if (!ticket || !isFormValid.value || isSubmittingFeedback.value) return;
  isSubmittingFeedback.value = true;
  try {
    const ticketId = ticket.ticketId || ticket.id;
    const payload = {
      ticket_id: ticketId,
      completion_status:  satisfactionForm.value.completionStatus,
      quality_rating:     satisfactionForm.value.ratings.quality,
      efficiency_rating:  satisfactionForm.value.ratings.efficiency,
      timeliness_rating:  satisfactionForm.value.ratings.timeliness,
      remarks:            satisfactionForm.value.remarks,
      delay_reasons:      [],
    };

    if (satisfactionForm.value.completionStatus === 'beyond-time') {
      const br = satisfactionForm.value.beyondTimeReasons;
      if (br.personnelAbsent) payload.delay_reasons.push('personnelAbsent');
      if (br.extendedBreak)   payload.delay_reasons.push('extendedBreak');
      if (br.additionalWork)  payload.delay_reasons.push('additionalWork');
    } else if (satisfactionForm.value.completionStatus === 'not-completed') {
      const nr = satisfactionForm.value.notCompletedReasons;
      if (nr.lackWorkingDays) payload.delay_reasons.push('lackDays');
      if (nr.lackMaterials)   payload.delay_reasons.push('lackMaterials');
      if (nr.lackSkills)      payload.delay_reasons.push('lackSkills');
    }

    await api.post('feedback', payload);
    ticket.isClosed    = true;
    ticket.status      = 'closed';
    ticket.statusLabel = 'Closed';

    if (selectedTicket.value && String(selectedTicket.value.ticketId || selectedTicket.value.id) === String(ticketId)) {
      selectedTicket.value.isClosed = true;
      selectedTicket.value.status = 'closed';
      selectedTicket.value.statusLabel = 'Closed';
    }

    // Auto-generate and attach official FGMU Job Request Form if FGMU ticket
    if (ticket.unit === 'FGMU' || ticket.unit_code === 'FGMU' || ticket.unit_id === 1) {
      try {
        await attachFgmuJobRequestForm(ticket, payload);
      } catch (docErr) {
        console.error('Failed to auto-attach FGMU Job Request Form docx:', docErr);
      }
    }
    
    // Show toast message
    toastMessage.value = `Thanks for the honest evaluation, #${ticketId} is now complete and closed!`;
    showToast.value = true;
    setTimeout(() => { showToast.value = false; }, 5000);
    
    ratingTicketId.value = null;

    await fetchTickets();
    if (selectedTicket.value) {
      syncOpenTicket(ticketId);
    }
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    ticket.isClosed = true;
  } finally {
    isSubmittingFeedback.value = false;
  }
};

// ---- Style helpers ----
const getStatusAccent = (status) => {
  const map = {
    pending:       'bg-amber-400',
    processing:    'bg-blue-500',
    'in-progress': 'bg-blue-500',
    approved:      'bg-blue-500',
    scheduled:     'bg-blue-500',
    completed:     'bg-emerald-500',
    resolved:      'bg-emerald-500',
    closed:        'bg-slate-400',
    declined:      'bg-rose-500',
    rejected:      'bg-rose-500',
  };
  return map[status] || 'bg-slate-300';
};

const getStatusBg = (status) => {
  const map = {
    pending:       'bg-amber-50',
    processing:    'bg-blue-50',
    'in-progress': 'bg-blue-50',
    approved:      'bg-blue-50',
    scheduled:     'bg-blue-50',
    completed:     'bg-emerald-50',
    resolved:      'bg-emerald-50',
    closed:        'bg-slate-100',
    declined:      'bg-rose-50',
    rejected:      'bg-rose-50',
  };
  return map[status] || 'bg-slate-50';
};

const getStatusColor = (status) => {
  const map = {
    pending:       'text-amber-500',
    processing:    'text-blue-500',
    'in-progress': 'text-blue-500',
    approved:      'text-blue-500',
    scheduled:     'text-blue-500',
    completed:     'text-emerald-600',
    resolved:      'text-emerald-600',
    closed:        'text-slate-500',
    cancelled:     'text-slate-400',
    declined:      'text-rose-500',
    rejected:      'text-rose-500',
  };
  return map[status] || 'text-slate-500';
};

const getStatusBadge = (status) => {
  const map = {
    pending:       'bg-amber-50 text-amber-600 border-amber-200',
    processing:    'bg-blue-50 text-blue-600 border-blue-200',
    'in-progress': 'bg-blue-50 text-blue-600 border-blue-200',
    approved:      'bg-blue-50 text-blue-600 border-blue-200',
    scheduled:     'bg-blue-50 text-blue-600 border-blue-200',
    completed:     'bg-emerald-50 text-emerald-600 border-emerald-200',
    resolved:      'bg-emerald-50 text-emerald-600 border-emerald-200',
    closed:        'bg-slate-100 text-slate-500 border-slate-300',
    cancelled:     'bg-slate-100 text-slate-600 border-slate-200',
    declined:      'bg-rose-50 text-rose-600 border-rose-200',
    rejected:      'bg-rose-50 text-rose-600 border-rose-200',
  };
  return map[status] || 'bg-slate-50 text-slate-500 border-slate-200';
};

const getStatusDot = (status) => {
  const map = {
    pending:       'bg-amber-500',
    processing:    'bg-blue-500',
    'in-progress': 'bg-blue-500',
    approved:      'bg-blue-500',
    scheduled:     'bg-blue-500',
    completed:     'bg-emerald-500',
    resolved:      'bg-emerald-500',
    closed:        'bg-slate-400',
    cancelled:     'bg-slate-400',
    declined:      'bg-rose-500',
    rejected:      'bg-rose-500',
  };
  return map[status] || 'bg-slate-400';
};

const getStepFill = (status) => {
  const map = {
    pending:       'bg-amber-400',
    processing:    'bg-blue-500',
    'in-progress': 'bg-blue-500',
    approved:      'bg-blue-500',
    scheduled:     'bg-blue-500',
    completed:     'bg-emerald-500',
    resolved:      'bg-emerald-500',
    cancelled:     'bg-slate-400',
    declined:      'bg-rose-400',
    rejected:      'bg-rose-400',
  };
  return map[status] || 'bg-slate-400';
};

const getActiveDot = (status) => {
  const map = {
    pending:       'bg-amber-400 text-white',
    processing:    'bg-blue-500 text-white',
    'in-progress': 'bg-blue-500 text-white',
    approved:      'bg-blue-500 text-white',
    scheduled:     'bg-blue-500 text-white',
    completed:     'bg-emerald-500 text-white',
    resolved:      'bg-emerald-500 text-white',
    cancelled:     'bg-slate-400 text-white',
    declined:      'bg-rose-500 text-white',
    rejected:      'bg-rose-500 text-white',
  };
  return map[status] || 'bg-slate-400 text-white';
};

const getActiveStepBadge = (status) => {
  const map = {
    pending:       'bg-amber-100 text-amber-700',
    processing:    'bg-blue-100 text-blue-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    approved:      'bg-blue-100 text-blue-700',
    scheduled:     'bg-blue-100 text-blue-700',
    completed:     'bg-emerald-100 text-emerald-700',
    resolved:      'bg-emerald-100 text-emerald-700',
    cancelled:     'bg-slate-100 text-slate-600',
    declined:      'bg-rose-100 text-rose-700',
    rejected:      'bg-rose-100 text-rose-700',
  };
  return map[status] || 'bg-slate-100 text-slate-600';
};
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Processing ticket shimmer bar */
@keyframes progressBar {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.animate-progress-bar {
  background-size: 200% 100%;
  background-image: linear-gradient(90deg, #93c5fd 0%, #3b82f6 30%, #60a5fa 60%, #93c5fd 100%);
  animation: progressBar 2.5s linear infinite;
}

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from {
  opacity: 0;
}

.modal-enter-from > div {
  transform: scale(0.95) translateY(16px);
}

.modal-leave-to {
  opacity: 0;
}

.modal-leave-to > div {
  transform: scale(0.97) translateY(8px);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
