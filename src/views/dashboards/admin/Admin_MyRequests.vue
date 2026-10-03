<template>
  <MainLayout>
    <template #header-title>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700 shadow-2xs shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div class="flex flex-col">
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">My Service Requests</h2>
          <p class="text-xs text-emerald-600 font-extrabold tracking-wider uppercase">{{ unitCode }} Admin Internal &amp; Cross-Unit Requests</p>
        </div>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-6 animate-fade-in relative pb-12">
        <!-- ===================== FILTERS & ACTIONS BAR ===================== -->
        <div class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div class="flex flex-col md:flex-row md:items-center gap-3.5">
            <!-- Search -->
            <div class="relative flex-1">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search by ID, service, or unit..."
                class="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none min-h-[44px]"
              />
            </div>

            <!-- Status Filter Tabs -->
            <div class="flex items-center gap-2 flex-wrap">
              <button
                v-for="tab in statusTabs"
                :key="tab.value"
                @click="statusFilter = tab.value"
                :class="[
                  'px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all border min-h-[44px] flex items-center cursor-pointer',
                  statusFilter === tab.value
                    ? tab.activeClass
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                ]"
              >
                {{ tab.label }}
                <span v-if="tab.count !== undefined" class="ml-1.5 px-2 py-0.5 rounded-md text-xs font-black" :class="statusFilter === tab.value ? 'bg-white/30' : 'bg-slate-200 text-slate-700'">
                  {{ tab.count }}
                </span>
              </button>
            </div>

            <!-- New Request Action Button -->
            <button
              @click="$router.push('/services')"
              class="flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-sm shadow-emerald-600/20 transition-all active:scale-95 text-sm sm:text-base whitespace-nowrap min-h-[44px] cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
              </svg>
              Request Service
            </button>
          </div>
        </div>

        <!-- ===================== NOTICE CARD IF AWAITING EVALUATION ===================== -->
        <div
          v-if="statusCounts.resolved > 0"
          class="p-4 sm:p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
        >
          <div class="flex items-start gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div>
              <h4 class="text-sm sm:text-base font-black text-amber-950">Action Needed: {{ statusCounts.resolved }} Completed Ticket(s) Awaiting Your Rating</h4>
              <p class="text-xs text-amber-800 font-medium mt-0.5">Please rate the completed services so that tickets can be formally closed and removed from active rosters.</p>
            </div>
          </div>
          <button
            type="button"
            @click="statusFilter = 'resolved'"
            class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            View Tickets to Rate
          </button>
        </div>

        <!-- ===================== EMPTY STATE ===================== -->
        <div v-if="filteredTickets.length === 0" class="bg-white border border-slate-200 rounded-2xl p-12 sm:p-16 flex flex-col items-center text-center shadow-sm">
          <div class="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p class="text-lg font-black text-slate-900 mb-1">No service requests found</p>
          <p class="text-sm text-slate-500 font-medium mb-6">
            {{ searchQuery || statusFilter !== 'all' ? 'Try adjusting your search query or status filter.' : 'You have not submitted any service requests yet.' }}
          </p>
          <button @click="$router.push('/services')" class="px-6 py-3 bg-emerald-600 text-white font-black rounded-xl text-sm sm:text-base hover:bg-emerald-700 transition-colors min-h-[44px] cursor-pointer">
            Create Service Request
          </button>
        </div>

        <!-- ===================== TICKET CARDS ===================== -->
        <div v-else class="space-y-3.5">
          <div
            v-for="ticket in paginatedTickets"
            :key="ticket.id"
            :id="ticket.ticketId"
            :class="[
              'group relative bg-white border rounded-2xl transition-all duration-300 hover:shadow-lg overflow-hidden',
              highlightedTicket === ticket.ticketId
                ? 'border-emerald-400 ring-4 ring-emerald-500/15 shadow-emerald-500/10'
                : 'border-slate-200 hover:border-slate-300 hover:shadow-slate-200/80'
            ]"
          >
            <!-- Status border accent -->
            <div class="absolute left-0 inset-y-0 w-1.5 rounded-l-2xl" :class="getStatusAccent(ticket.status)"></div>

            <div class="pl-5 pr-5 py-5 sm:py-6">
              <div class="flex flex-col md:flex-row md:items-start gap-4">
                <div class="flex-1 min-w-0">
                  <!-- Badges row -->
                  <div class="flex flex-wrap items-start justify-between gap-2 mb-2.5">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-black uppercase tracking-wider border border-slate-200">
                        {{ ticket.unit }}
                      </span>
                      <span class="font-mono font-black text-xs text-slate-500">#{{ ticket.ticketId }}</span>
                      <span v-if="ticket.service" class="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                        {{ ticket.service }}
                      </span>
                    </div>

                    <!-- Status badge -->
                    <div class="flex items-center gap-2">
                      <span
                        v-if="ticket.status === 'resolved'"
                        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide border bg-amber-100 text-amber-900 border-amber-300 shadow-2xs animate-pulse"
                      >
                        <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                        Awaiting Your Rating
                      </span>
                      <span
                        v-else
                        :class="['inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide border', getStatusBadge(ticket.status)]"
                      >
                        <span class="w-2 h-2 rounded-full" :class="getStatusDot(ticket.status)"></span>
                        {{ ticket.statusLabel || ticket.status }}
                      </span>
                    </div>
                  </div>

                  <!-- Title / Description -->
                  <h3 class="text-base sm:text-lg font-black text-slate-900 leading-snug mb-1.5">
                    {{ ticket.title || ticket.service || 'Service Request' }}
                  </h3>
                  <p class="text-xs sm:text-sm text-slate-600 font-medium line-clamp-2 mb-3">
                    {{ ticket.description || 'No detailed description provided.' }}
                  </p>

                  <!-- Location & Date metadata -->
                  <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 font-semibold pt-1 border-t border-slate-100">
                    <span class="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Submitted: {{ ticket.date }}
                    </span>
                    <span v-if="ticket.location" class="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {{ ticket.location }}{{ ticket.office_room ? ` (${ticket.office_room})` : '' }}
                    </span>
                    <span v-if="ticket.assignedWorker" class="flex items-center gap-1.5 text-slate-700 font-bold">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Assigned: {{ ticket.assignedWorker }}
                    </span>
                  </div>
                </div>

                <!-- Right Side Actions -->
                <div class="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    type="button"
                    @click="openTimeline(ticket)"
                    :class="[
                      'px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-xs',
                      ticket.status === 'resolved'
                        ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25 ring-2 ring-amber-400/50 animate-bounce'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10'
                    ]"
                  >
                    <span>{{ ticket.status === 'resolved' ? 'Rate & Close Ticket' : 'View Progress' }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button
                    v-if="ticket.status === 'pending'"
                    type="button"
                    @click="promptCancelTicket(ticket)"
                    class="text-xs font-bold text-rose-600 hover:text-rose-700 py-1 px-2 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    Cancel Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===================== PAGINATION ===================== -->
        <div v-if="totalPages > 1" class="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-xs">
          <p class="text-xs text-slate-500 font-bold">
            Showing <span class="text-slate-900">{{ (currentPage - 1) * perPage + 1 }}</span> to
            <span class="text-slate-900">{{ Math.min(currentPage * perPage, filteredTickets.length) }}</span> of
            <span class="text-slate-900">{{ filteredTickets.length }}</span> requests
          </p>
          <div class="flex items-center gap-2">
            <button
              :disabled="currentPage === 1"
              @click="currentPage--"
              class="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            <span class="text-xs font-black text-slate-800 px-2">{{ currentPage }} / {{ totalPages }}</span>
            <button
              :disabled="currentPage === totalPages"
              @click="currentPage++"
              class="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>

        <!-- ===================== TIMELINE / EVALUATION MODAL ===================== -->
        <Teleport to="body">
          <Transition name="modal">
            <div
              v-if="selectedTicket"
              class="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
              @click.self="closeTimeline"
            >
              <div class="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-scale-up">
                <!-- Modal Header -->
                <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm shrink-0 border border-emerald-200 shadow-2xs">
                      {{ selectedTicket.unit }}
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <h3 class="text-base sm:text-lg font-black text-slate-900">#{{ selectedTicket.ticketId }}</h3>
                        <span :class="['px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border', getStatusBadge(selectedTicket.status)]">
                          {{ selectedTicket.statusLabel || selectedTicket.status }}
                        </span>
                      </div>
                      <p class="text-xs text-slate-500 font-semibold">{{ selectedTicket.service }} • Submitted on {{ selectedTicket.date }}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="closeTimeline"
                    class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- Modal Body -->
                <div class="p-6 sm:p-8 overflow-y-auto custom-scrollbar space-y-6 flex-1">
                  <!-- 1. PROGRESS TIMELINE STEPPER -->
                  <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-4">
                    <h4 class="text-xs font-black uppercase tracking-wider text-slate-500">Service Progress Stepper</h4>
                    <div class="space-y-4">
                      <div
                        v-for="(step, sIdx) in getSteps(selectedTicket)"
                        :key="sIdx"
                        class="flex items-start gap-3.5 relative"
                      >
                        <!-- Vertical connector line -->
                        <div
                          v-if="sIdx < getSteps(selectedTicket).length - 1"
                          class="absolute left-[13px] top-[26px] bottom-[-16px] w-0.5"
                          :class="isStepCompleted(selectedTicket, sIdx) ? 'bg-emerald-500' : 'bg-slate-200'"
                        ></div>

                        <!-- Step Dot Icon -->
                        <div
                          class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors font-bold text-xs"
                          :class="[
                            isStepCompleted(selectedTicket, sIdx)
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : (isStepActive(selectedTicket, sIdx)
                                  ? 'bg-amber-500 text-white ring-4 ring-amber-200 shadow-xs'
                                  : 'bg-white border-2 border-slate-300 text-slate-400')
                          ]"
                        >
                          <svg v-if="isStepCompleted(selectedTicket, sIdx)" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                          </svg>
                          <span v-else>{{ sIdx + 1 }}</span>
                        </div>

                        <!-- Step Content -->
                        <div class="flex-1 min-w-0 pb-1">
                          <h5 class="text-sm font-black text-slate-900 leading-tight">
                            {{ step.label }}
                          </h5>
                          <p class="text-xs text-slate-500 font-medium mt-0.5 leading-relaxed">
                            {{ getStepDescription(selectedTicket, step, sIdx) }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 2. TICKET INFORMATION CARD -->
                  <div class="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xs">
                    <h4 class="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">Request Information</h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service</p>
                        <p class="text-xs font-bold text-slate-800">{{ selectedTicket.service }}</p>
                      </div>
                      <div>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                        <p class="text-xs font-bold text-slate-800">{{ selectedTicket.location || 'BSU Campus' }}{{ selectedTicket.office_room ? ` (${selectedTicket.office_room})` : '' }}</p>
                      </div>
                      <div class="sm:col-span-2">
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Details / Description</p>
                        <p class="text-xs font-medium text-slate-700 leading-relaxed mt-0.5 whitespace-pre-wrap">{{ selectedTicket.description }}</p>
                      </div>
                      <div v-if="selectedTicket.assignedWorker">
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Personnel</p>
                        <p class="text-xs font-bold text-slate-800">{{ selectedTicket.assignedWorker }} {{ selectedTicket.assignedProfession ? `(${selectedTicket.assignedProfession})` : '' }}</p>
                      </div>
                      <div v-if="selectedTicket.implementationDate">
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scheduled Implementation</p>
                        <p class="text-xs font-bold text-slate-800">{{ selectedTicket.implementationDate }}</p>
                      </div>
                    </div>

                    <!-- Attachments List -->
                    <div v-if="selectedTicket.attachments && selectedTicket.attachments.length > 0" class="pt-3 border-t border-slate-100">
                      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Attached Documents</p>
                      <div class="space-y-2">
                        <div
                          v-for="att in selectedTicket.attachments"
                          :key="att.id"
                          class="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                        >
                          <span class="text-xs font-bold text-slate-700 truncate mr-2">{{ att.file_name }}</span>
                          <button
                            type="button"
                            @click="downloadAttachment(att)"
                            class="px-2.5 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer shrink-0"
                          >
                            Preview / Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 3. RATING / SATISFACTION EVALUATION FORM (When ticket is resolved) -->
                  <div
                    v-if="isFeedbackEligible(selectedTicket) && !selectedTicket.isClosed"
                    class="bg-amber-50/90 border-2 border-amber-300 rounded-3xl p-6 sm:p-7 text-left space-y-6 shadow-sm"
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
                        </div>
                        <h4 class="font-black text-slate-900 text-lg sm:text-xl tracking-tight">Service Complete — Evaluation Required</h4>
                        <p class="text-xs sm:text-sm text-slate-600 mt-1">
                          The assigned team has completed the job. As the requesting admin, please rate the service quality below to close this ticket and archive it.
                        </p>
                      </div>
                    </div>

                    <!-- Embedded Rating Form -->
                    <div class="border-t border-amber-200/80 pt-6 space-y-6">
                      <!-- 1. Completion Status -->
                      <div class="bg-white p-5 sm:p-6 rounded-2xl border-2 border-slate-200/80 shadow-xs space-y-3">
                        <div class="flex items-center justify-between gap-2">
                          <label class="block text-sm sm:text-base font-black text-slate-900 uppercase tracking-wide">
                            1. Job Completion Status <span class="text-rose-500">*</span>
                          </label>
                          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Required</span>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                            <span class="text-sm sm:text-base font-bold leading-snug min-w-0 break-words">{{ option.label }}</span>
                          </label>
                        </div>
                      </div>

                      <!-- 2. Service Quality Rating -->
                      <div
                        v-if="['early', 'on-time', 'beyond-time'].includes(satisfactionForm.completionStatus)"
                        class="bg-white p-5 sm:p-7 rounded-2xl border-2 border-slate-200/80 shadow-xs space-y-5 animate-fade-in"
                      >
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                          <div>
                            <label class="block text-sm sm:text-base font-black text-slate-900 uppercase tracking-wide">
                              2. Service Quality Rating <span class="text-rose-500">*</span>
                            </label>
                            <p class="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">Select a score from 1 to 5 for each criterion</p>
                          </div>

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

                        <!-- Criteria List -->
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

                              <div v-if="satisfactionForm.ratings[key]" class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/90 border border-amber-300 text-amber-900 rounded-xl text-xs sm:text-sm font-black shadow-xs self-start sm:self-auto animate-fade-in">
                                <span class="text-amber-600 font-black">★</span>
                                <span>Score: {{ satisfactionForm.ratings[key] }} / 5</span>
                                <span class="text-amber-700 font-extrabold">({{ getRatingLabel(satisfactionForm.ratings[key]) }})</span>
                              </div>
                              <div v-else class="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-xl self-start sm:self-auto">
                                Please select 1 to 5
                              </div>
                            </div>

                            <!-- Buttons 1 to 5 -->
                            <div class="grid grid-cols-5 gap-1.5 sm:gap-3 pt-1">
                              <button
                                v-for="star in 5"
                                :key="star"
                                type="button"
                                @click="satisfactionForm.ratings[key] = star"
                                :title="`${star} - ${getRatingLabel(star)}`"
                                :class="[
                                  'min-h-[58px] sm:min-h-[68px] p-1 sm:p-2 rounded-2xl flex flex-col items-center justify-center transition-all duration-150 cursor-pointer select-none group border-2',
                                  satisfactionForm.ratings[key] === star
                                    ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white font-black border-amber-500 shadow-md shadow-amber-500/35 scale-[1.02] ring-2 ring-amber-400 ring-offset-2'
                                    : 'bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-900 font-black border-slate-300 hover:border-amber-400 shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95'
                                ]"
                              >
                                <div class="flex items-center gap-1">
                                  <span class="text-lg sm:text-2xl font-black leading-none group-hover:scale-110 transition-transform">
                                    {{ star }}
                                  </span>
                                  <span class="text-amber-400 text-sm sm:text-base leading-none" :class="satisfactionForm.ratings[key] === star ? 'text-white' : 'group-hover:text-amber-500'">★</span>
                                </div>
                                <span
                                  class="hidden sm:block text-[10px] sm:text-xs font-bold mt-1 leading-none text-center truncate max-w-full px-0.5"
                                  :class="satisfactionForm.ratings[key] === star ? 'text-amber-100 font-black' : 'text-slate-500 group-hover:text-amber-800'"
                                >
                                  {{ getRatingLabel(star, true) }}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Reasons if Beyond Time -->
                      <div v-if="satisfactionForm.completionStatus === 'beyond-time'" class="bg-white p-5 sm:p-6 rounded-2xl border-2 border-slate-200/80 space-y-3 animate-fade-in shadow-xs">
                        <label class="block text-sm sm:text-base font-black text-slate-900 uppercase tracking-wide mb-3">
                          Reasons for beyond time completion
                        </label>
                        <div class="space-y-3">
                          <label class="flex items-center gap-3 cursor-pointer select-none">
                            <input type="checkbox" v-model="satisfactionForm.beyondTimeReasons.personnelAbsent" class="rounded w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
                            <span class="text-sm font-semibold text-slate-700">Personnel absent / on-leave</span>
                          </label>
                          <label class="flex items-center gap-3 cursor-pointer select-none">
                            <input type="checkbox" v-model="satisfactionForm.beyondTimeReasons.extendedBreak" class="rounded w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
                            <span class="text-sm font-semibold text-slate-700">Extended break period</span>
                          </label>
                          <label class="flex items-center gap-3 cursor-pointer select-none">
                            <input type="checkbox" v-model="satisfactionForm.beyondTimeReasons.additionalWork" class="rounded w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
                            <span class="text-sm font-semibold text-slate-700">Additional work requested</span>
                          </label>
                        </div>
                      </div>

                      <!-- Reasons if Not Completed -->
                      <div v-if="satisfactionForm.completionStatus === 'not-completed'" class="bg-white p-5 sm:p-6 rounded-2xl border-2 border-slate-200/80 space-y-3 animate-fade-in shadow-xs">
                        <label class="block text-sm sm:text-base font-black text-slate-900 uppercase tracking-wide mb-3">
                          Reasons for not completed / performed
                        </label>
                        <div class="space-y-3">
                          <label class="flex items-center gap-3 cursor-pointer select-none">
                            <input type="checkbox" v-model="satisfactionForm.notCompletedReasons.lackWorkingDays" class="rounded w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
                            <span class="text-sm font-semibold text-slate-700">Lack of working days</span>
                          </label>
                          <label class="flex items-center gap-3 cursor-pointer select-none">
                            <input type="checkbox" v-model="satisfactionForm.notCompletedReasons.lackMaterials" class="rounded w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
                            <span class="text-sm font-semibold text-slate-700">Lack of materials / tools</span>
                          </label>
                          <label class="flex items-center gap-3 cursor-pointer select-none">
                            <input type="checkbox" v-model="satisfactionForm.notCompletedReasons.lackSkills" class="rounded w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
                            <span class="text-sm font-semibold text-slate-700">Lack of skills</span>
                          </label>
                        </div>
                      </div>

                      <!-- Remarks Textarea -->
                      <div v-if="satisfactionForm.completionStatus" class="bg-white p-5 sm:p-6 rounded-2xl border-2 border-slate-200/80 shadow-xs space-y-2 animate-fade-in">
                        <label class="block text-sm sm:text-base font-black text-slate-900 uppercase tracking-wide mb-1">
                          Remarks / Commendations (Optional)
                        </label>
                        <textarea
                          v-model="satisfactionForm.remarks"
                          rows="3"
                          class="w-full px-4 py-3 bg-slate-50/60 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white outline-none text-sm sm:text-base text-slate-800 transition-all resize-none placeholder:text-slate-400 font-medium"
                          placeholder="Share your commendations, comments, or notes regarding the service...">
                        </textarea>
                      </div>

                      <!-- Submit Button -->
                      <button
                        type="button"
                        @click="closeTicketWithFeedback(selectedTicket)"
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

                  <!-- 4. TICKET CLOSED STATE -->
                  <div
                    v-if="selectedTicket.isClosed || selectedTicket.status === 'closed' || selectedTicket.status === 'completed'"
                    class="bg-slate-50 border border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center"
                  >
                    <div class="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 class="font-black text-slate-900 text-base mb-1">Ticket Resolved &amp; Closed</h4>
                    <p class="text-sm text-slate-500">
                      Satisfaction evaluation submitted. This service request has been finalized and archived.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </Teleport>

        <!-- ===================== CANCEL MODAL ===================== -->
        <Teleport to="body">
          <Transition name="modal">
            <div
              v-if="showCancelModal"
              class="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
              @click.self="showCancelModal = false"
            >
              <div class="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
                <div class="flex items-center gap-3 text-rose-600">
                  <div class="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-black text-slate-900">Cancel Request</h3>
                </div>
                <p class="text-xs sm:text-sm text-slate-600">
                  Are you sure you want to cancel request <strong>#{{ ticketToCancel?.ticketId }}</strong>?
                </p>
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Reason for Cancellation</label>
                  <select
                    v-model="cancellationReason"
                    class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500"
                  >
                    <option value="Problem already solved">Problem already solved</option>
                    <option value="Request submitted by mistake">Request submitted by mistake</option>
                    <option value="Alternative arrangement made">Alternative arrangement made</option>
                    <option value="Other / Internal decision">Other / Internal decision</option>
                  </select>
                </div>
                <div class="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    @click="showCancelModal = false"
                    class="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Keep Request
                  </button>
                  <button
                    type="button"
                    @click="executeCancelTicket"
                    :disabled="isCancelling"
                    class="px-5 py-2 text-xs font-black text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                  >
                    {{ isCancelling ? 'Cancelling...' : 'Confirm Cancellation' }}
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </Teleport>

        <!-- Document Viewer Modal -->
        <DocumentViewerModal
          v-model="viewerModal.isOpen"
          :title="viewerModal.title"
          :fileName="viewerModal.fileName"
          :fileBlob="viewerModal.fileBlob"
          :fileUrl="viewerModal.fileUrl"
        />
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import DocumentViewerModal from '@/components/DocumentViewerModal.vue';
import { debounce } from '@/utils/debounce';
import { parseDateLocal } from '@/utils/workCalendar';
import { useAuthStore } from '@/stores/auth';
import { useNetworkStatus } from '@/utils/networkMonitor';
import api from '@/api/client';
import { toast } from 'vue3-toastify';
import {
  isBorrowingService,
  BORROWING_STEPS,
  getBorrowingCurrentStep,
  getBorrowingStepDescription,
  getBorrowingStatusLabel,
} from '@/utils/borrowing';
import { isDocxFile, isPdfFile, handleAttachmentClick } from '@/utils/attachmentHelper';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { onReconnected } = useNetworkStatus();

// Unit context
const unitCode = computed(() => {
  return (route.meta?.unit || authStore.user?.unit_code || 'FGMU').toUpperCase();
});

// Tickets data state
const tickets = ref([]);
const isFetchingTickets = ref(false);
const highlightedTicket = ref(null);
let ticketsAbort = null;
let pollingInterval = null;
let unregisterReconnected = null;

// Search & Filtering
const searchQuery = ref('');
const debouncedSearchQuery = ref('');
const statusFilter = ref('all');
const currentPage = ref(1);
const perPage = ref(8);

const updateDebouncedSearch = debounce((val) => {
  debouncedSearchQuery.value = val;
}, 200);

watch(searchQuery, (val) => {
  updateDebouncedSearch(val);
  currentPage.value = 1;
});

watch(statusFilter, () => {
  currentPage.value = 1;
});

// Format date helper
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const parsed = parseDateLocal(dateStr);
  if (!parsed || isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Map ticket payload
const mapTicketData = (t) => {
  const isBorrow = isBorrowingService(t);
  const rawWorkingDays = Number(t.working_days || t.project_working_days || t.assignment?.working_days) || null;
  const extensionDays = Number(t.extension_days) || 0;

  return {
    id: t.id,
    ticketId: t.id,
    title: t.title,
    service: t.service_type,
    unit: t.unit_code,
    description: t.description,
    status: t.status,
    statusLabel: isBorrow ? getBorrowingStatusLabel(t) : t.status_label,
    date: new Date(t.completed_at || t.submitted_at || t.updated_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    location: t.location,
    office_room: t.office_room,
    attachments: (t.attachments || []),
    currentStep: (() => {
      if (isBorrow) {
        return getBorrowingCurrentStep(t);
      }
      const rawStep = parseInt(t.current_step, 10);
      const isClosedOrResolved = ['closed', 'completed', 'resolved'].includes(t.status);
      if (isClosedOrResolved) {
        const isSsu = t.unit === 'SSU' || t.unit_code === 'SSU' || t.unit_id === 3;
        return Math.max(rawStep || 0, isSsu ? (['closed', 'completed'].includes(t.status) ? 5 : 4) : 6);
      }
      if (!rawStep || isNaN(rawStep)) {
        if (t.status === 'approved') return 3;
        if (t.status === 'processing') return 4;
        return 2;
      }
      return Math.min(rawStep, 5);
    })(),
    borrowing: t.borrowing || null,
    assignedWorker: t.assignment?.personnel_name || t.assigned_worker || (t.assignments?.[0]?.assigned_to_name) || null,
    assignedProfession: t.assignment?.specialty || t.assignment?.profession || (t.assignments?.[0]?.specialty) || null,
    implementationDate: (t.assignment?.implementation_date || t.implementation_date)
      ? formatDate(t.assignment?.implementation_date || t.implementation_date)
      : null,
    workingDays: rawWorkingDays ? (rawWorkingDays + extensionDays) : null,
    isClosed: t.status === 'completed' || t.status === 'closed',
    materials: t.materials || [],
  };
};

// Fetch tickets from API
const fetchTickets = async () => {
  if (isFetchingTickets.value) return;
  isFetchingTickets.value = true;
  try {
    ticketsAbort?.abort();
  } catch { /* noop */ }
  ticketsAbort = new AbortController();

  try {
    const res = await api.get('tickets/my-requests', { signal: ticketsAbort.signal });
    const list = res.data?.data?.tickets || [];
    tickets.value = list.map(mapTicketData);

    if (selectedTicket.value) {
      const curId = String(selectedTicket.value.ticketId || selectedTicket.value.id);
      const updated = tickets.value.find(t => String(t.ticketId || t.id) === curId);
      if (updated) {
        selectedTicket.value = updated;
      }
    }
  } catch (err) {
    if (err.name !== 'CanceledError' && err.message !== 'canceled') {
      console.warn('[Admin_MyRequests] Fetch tickets failed:', err);
    }
  } finally {
    isFetchingTickets.value = false;
  }
};

// Filtering logic
const statusCounts = computed(() => ({
  all: tickets.value.length,
  pending: tickets.value.filter(t => t.status === 'pending').length,
  processing: tickets.value.filter(t => ['processing', 'approved', 'in_progress', 'scheduled'].includes(t.status)).length,
  resolved: tickets.value.filter(t => t.status === 'resolved').length,
  completed: tickets.value.filter(t => ['completed', 'closed'].includes(t.status)).length,
}));

const statusTabs = computed(() => [
  { value: 'all', label: 'All Requests', count: statusCounts.value.all, activeClass: 'bg-slate-900 text-white border-slate-900' },
  { value: 'pending', label: 'Pending', count: statusCounts.value.pending, activeClass: 'bg-amber-50 text-amber-800 border-amber-400' },
  { value: 'processing', label: 'In Progress', count: statusCounts.value.processing, activeClass: 'bg-blue-50 text-blue-800 border-blue-400' },
  { value: 'resolved', label: 'Awaiting Rating', count: statusCounts.value.resolved, activeClass: 'bg-amber-500 text-white border-amber-500 shadow-xs' },
  { value: 'completed', label: 'Completed', count: statusCounts.value.completed, activeClass: 'bg-emerald-50 text-emerald-800 border-emerald-400' },
]);

const filteredTickets = computed(() => {
  let list = tickets.value;

  if (statusFilter.value === 'pending') {
    list = list.filter(t => t.status === 'pending');
  } else if (statusFilter.value === 'processing') {
    list = list.filter(t => ['processing', 'approved', 'in_progress', 'scheduled'].includes(t.status));
  } else if (statusFilter.value === 'resolved') {
    list = list.filter(t => t.status === 'resolved');
  } else if (statusFilter.value === 'completed') {
    list = list.filter(t => ['completed', 'closed'].includes(t.status));
  }

  const query = debouncedSearchQuery.value.trim().toLowerCase();
  if (query) {
    list = list.filter(t =>
      String(t.ticketId || '').toLowerCase().includes(query) ||
      String(t.service || '').toLowerCase().includes(query) ||
      String(t.unit || '').toLowerCase().includes(query) ||
      String(t.title || '').toLowerCase().includes(query) ||
      String(t.description || '').toLowerCase().includes(query)
    );
  }

  return list;
});

const totalPages = computed(() => Math.ceil(filteredTickets.value.length / perPage.value) || 1);
const paginatedTickets = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return filteredTickets.value.slice(start, start + perPage.value);
});

// Timeline & Stepper Definitions
const unitSteps = {
  FGMU: [
    { label: 'Digital Submission', description: 'The admin completes the required fields in the digital form.' },
    { label: 'Ticket Creation', description: 'System generated a Digital Ticket.' },
    { label: 'Admin Approval', description: 'Approved by the administration unit.' },
    { label: 'Dispatch & Schedule', description: 'Dispatcher assigned personnel and scheduled implementation.' },
    { label: 'Job Started', description: 'Personnel have started the job.' },
    { label: 'Job Finished', description: 'Personnel marked the job as complete.' },
  ],
  LEAU: [
    { label: 'Digital Submission', description: 'The admin completes the required fields in the digital form.' },
    { label: 'Ticket Creation', description: 'System generated a Digital Ticket.' },
    { label: 'Admin Approval', description: 'Approved by the administration unit.' },
    { label: 'Dispatch & Schedule', description: 'Dispatcher assigned personnel and scheduled implementation.' },
    { label: 'Job Started', description: 'Personnel have started the job.' },
    { label: 'Job Finished', description: 'Personnel marked the job as complete.' },
  ],
  SSU: {
    'Incident Report': [
      { label: 'Report Submission', description: 'The client fills out a digital Incident Report.' },
      { label: 'Staff Review', description: 'SSU staff reviews the incident details.' },
      { label: 'Action / Investigation', description: 'SSU staff takes action: logs recommendations/opens investigation.' },
      { label: 'Resolution', description: 'SSU staff marks the incident as resolved.' },
      { label: 'Archiving', description: 'Ticket moved to digital archives.' },
    ],
  },
  Borrowing: BORROWING_STEPS,
};

const getSteps = (ticket) => {
  if (!ticket) return [];
  if (isBorrowingService(ticket)) {
    return BORROWING_STEPS.map(s => ({ ...s }));
  }
  const u = ticket.unit || 'FGMU';
  if (u === 'SSU') {
    return [...(unitSteps.SSU[ticket.service] || unitSteps.FGMU)].map(s => ({ ...s }));
  }
  return [...(unitSteps[u] || unitSteps.FGMU)].map(s => ({ ...s }));
};

const getStepDescription = (ticket, step, index) => {
  if (!ticket || !step) return '';
  if (isBorrowingService(ticket)) {
    return getBorrowingStepDescription(ticket, step, index, formatDate);
  }
  return step.description;
};

const isStepCompleted = (ticket, index) => {
  if (!ticket) return false;
  const stepNum = index + 1;
  const steps = getSteps(ticket);
  if (ticket.isClosed || ['closed', 'completed'].includes(ticket.status)) {
    return stepNum <= steps.length;
  }
  if (ticket.currentStep > stepNum) return true;
  if (stepNum === steps.length || steps[index]?.label === 'Job Finished') {
    return ticket.currentStep >= steps.length && ['resolved', 'completed', 'closed'].includes(ticket.status);
  }
  return false;
};

const isStepActive = (ticket, index) => {
  if (!ticket) return false;
  if (isStepCompleted(ticket, index)) return false;
  return ticket.currentStep === (index + 1);
};

// Modal Timeline Controls
const selectedTicket = ref(null);

const openTimeline = (ticket) => {
  selectedTicket.value = ticket;
  resetForm();
  document.body.style.overflow = 'hidden';
};

const closeTimeline = () => {
  selectedTicket.value = null;
  document.body.style.overflow = '';
};

// Evaluation Form State
const isSubmittingFeedback = ref(false);

const completionOptions = [
  {
    value: 'early',
    label: 'Finished Ahead of Schedule / Early',
    activeClass: 'bg-sky-50/90 border-sky-500 text-sky-950 shadow-sm ring-1 ring-sky-500',
    indicatorClass: 'border-sky-600 bg-sky-600'
  },
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
  quality: 'Quality of Work / Service',
  efficiency: 'Efficiency / Work Discipline',
  timeliness: 'Timeliness of Completion',
};

const ratingScale = [
  { score: 1, label: 'Poor', shortLabel: 'Poor' },
  { score: 2, label: 'Fair', shortLabel: 'Fair' },
  { score: 3, label: 'Satisfactory', shortLabel: 'Satisfactory' },
  { score: 4, label: 'Very Satisfactory', shortLabel: 'Very Sat.' },
  { score: 5, label: 'Outstanding', shortLabel: 'Outstanding' },
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
  beyondTimeReasons: { personnelAbsent: false, extendedBreak: false, additionalWork: false },
  notCompletedReasons: { lackWorkingDays: false, lackMaterials: false, lackSkills: false },
  remarks: '',
});

const resetForm = () => {
  satisfactionForm.value = {
    completionStatus: '',
    ratings: { quality: 0, efficiency: 0, timeliness: 0 },
    beyondTimeReasons: { personnelAbsent: false, extendedBreak: false, additionalWork: false },
    notCompletedReasons: { lackWorkingDays: false, lackMaterials: false, lackSkills: false },
    remarks: '',
  };
};

const isFeedbackEligible = (ticket) => {
  if (!ticket || ticket.isClosed || ticket.status === 'closed' || ticket.status === 'completed') return false;
  if (isBorrowingService(ticket)) return false;
  return ticket.currentStep === 6 || ticket.status === 'resolved';
};

const isFormValid = computed(() => {
  const form = satisfactionForm.value;
  if (!form.completionStatus) return false;
  if (['early', 'on-time', 'beyond-time'].includes(form.completionStatus)) {
    const r = form.ratings;
    return r.quality > 0 && r.efficiency > 0 && r.timeliness > 0;
  }
  if (form.completionStatus === 'not-completed') {
    const nr = form.notCompletedReasons;
    return nr.lackWorkingDays || nr.lackMaterials || nr.lackSkills;
  }
  return false;
});

// Submit Satisfaction Feedback & Close Ticket
const closeTicketWithFeedback = async (ticket) => {
  if (!ticket || !isFormValid.value || isSubmittingFeedback.value) return;
  isSubmittingFeedback.value = true;
  try {
    const ticketId = ticket.ticketId || ticket.id;
    const payload = {
      ticket_id: ticketId,
      completion_status: satisfactionForm.value.completionStatus,
      quality_rating: satisfactionForm.value.ratings.quality,
      efficiency_rating: satisfactionForm.value.ratings.efficiency,
      timeliness_rating: satisfactionForm.value.ratings.timeliness,
      remarks: satisfactionForm.value.remarks,
      delay_reasons: [],
    };

    if (satisfactionForm.value.completionStatus === 'beyond-time') {
      const br = satisfactionForm.value.beyondTimeReasons;
      if (br.personnelAbsent) payload.delay_reasons.push('personnelAbsent');
      if (br.extendedBreak) payload.delay_reasons.push('extendedBreak');
      if (br.additionalWork) payload.delay_reasons.push('additionalWork');
    } else if (satisfactionForm.value.completionStatus === 'not-completed') {
      const nr = satisfactionForm.value.notCompletedReasons;
      if (nr.lackWorkingDays) payload.delay_reasons.push('lackDays');
      if (nr.lackMaterials) payload.delay_reasons.push('lackMaterials');
      if (nr.lackSkills) payload.delay_reasons.push('lackSkills');
    }

    await api.post('feedback', payload);

    ticket.isClosed = true;
    ticket.status = 'closed';
    ticket.statusLabel = 'Closed';

    if (selectedTicket.value) {
      selectedTicket.value.isClosed = true;
      selectedTicket.value.status = 'closed';
      selectedTicket.value.statusLabel = 'Closed';
    }

    // Auto-generate and attach official FGMU Job Request Form if FGMU ticket
    if (ticket.unit === 'FGMU' || ticket.unit_code === 'FGMU' || ticket.unit_id === 1) {
      try {
        const { attachFgmuJobRequestForm } = await import('@/utils/fgmuDocxGenerator');
        await attachFgmuJobRequestForm(ticket, payload);
      } catch (docErr) {
        console.error('Failed to auto-attach FGMU Job Request Form docx:', docErr);
      }
    }

    toast.success(`Evaluation submitted successfully! #${ticketId} is now closed.`);
    await fetchTickets();
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    toast.error(error.response?.data?.message || 'Failed to submit evaluation. Please try again.');
  } finally {
    isSubmittingFeedback.value = false;
  }
};

// Cancel Ticket Modal & Logic
const showCancelModal = ref(false);
const ticketToCancel = ref(null);
const cancellationReason = ref('Problem already solved');
const isCancelling = ref(false);

const promptCancelTicket = (ticket) => {
  ticketToCancel.value = ticket;
  cancellationReason.value = 'Problem already solved';
  showCancelModal.value = true;
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
    toast.error(error.response?.data?.message || 'Failed to cancel request.');
  } finally {
    isCancelling.value = false;
  }
};

// Document Viewer Modal State
const viewerModal = reactive({
  isOpen: false,
  title: '',
  fileName: '',
  fileBlob: null,
  fileUrl: '',
});

const downloadAttachment = async (att) => {
  await handleAttachmentClick(att, (blob, att) => {
    viewerModal.title = att.file_name || 'Document Attachment';
    viewerModal.fileName = att.file_name || 'attachment.pdf';
    viewerModal.fileBlob = blob;
    viewerModal.fileUrl = '';
    viewerModal.isOpen = true;
  });
};

// Style helpers
const getStatusAccent = (status) => {
  const map = {
    pending: 'bg-amber-400',
    processing: 'bg-blue-500',
    'in-progress': 'bg-blue-500',
    approved: 'bg-blue-500',
    resolved: 'bg-amber-500',
    completed: 'bg-emerald-500',
    closed: 'bg-slate-400',
    declined: 'bg-rose-500',
    cancelled: 'bg-rose-400',
  };
  return map[status] || 'bg-slate-300';
};

const getStatusBadge = (status) => {
  const map = {
    pending: 'bg-amber-50 text-amber-800 border-amber-200',
    processing: 'bg-blue-50 text-blue-800 border-blue-200',
    'in-progress': 'bg-blue-50 text-blue-800 border-blue-200',
    approved: 'bg-blue-50 text-blue-800 border-blue-200',
    resolved: 'bg-amber-50 text-amber-900 border-amber-300',
    completed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    closed: 'bg-slate-100 text-slate-700 border-slate-200',
    declined: 'bg-rose-50 text-rose-800 border-rose-200',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  return map[status] || 'bg-slate-100 text-slate-700 border-slate-200';
};

const getStatusDot = (status) => {
  const map = {
    pending: 'bg-amber-500',
    processing: 'bg-blue-500',
    'in-progress': 'bg-blue-500',
    approved: 'bg-blue-500',
    resolved: 'bg-amber-500',
    completed: 'bg-emerald-500',
    closed: 'bg-slate-400',
    declined: 'bg-rose-500',
    cancelled: 'bg-rose-400',
  };
  return map[status] || 'bg-slate-400';
};

// Route Query Handler
const handleRouteTicket = () => {
  const target = route.query.ticketId || route.query.highlight;
  if (!target) return;

  highlightedTicket.value = target;
  statusFilter.value = 'all';
  searchQuery.value = target;
  debouncedSearchQuery.value = target;

  const match = tickets.value.find(t =>
    String(t.ticketId || t.id).toLowerCase() === String(target).toLowerCase()
  );

  if (match && !selectedTicket.value) {
    openTimeline(match);
  }

  setTimeout(() => {
    const el = document.getElementById(target);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 300);
};

watch(() => [route.query.ticketId, route.query.highlight], () => {
  handleRouteTicket();
});

onMounted(() => {
  fetchTickets().then(() => {
    handleRouteTicket();
  });

  pollingInterval = setInterval(() => {
    if (document.hidden) return;
    fetchTickets();
  }, 30000);

  unregisterReconnected = onReconnected(() => {
    fetchTickets();
  });
});

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval);
  if (unregisterReconnected) unregisterReconnected();
  try {
    ticketsAbort?.abort();
  } catch { /* noop */ }
});
</script>
