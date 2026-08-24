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
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Submitted {{ ticket.date }}
                    </div>
                    <div v-if="ticket.implementationDate" class="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      Scheduled: {{ ticket.implementationDate }}
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

                  <!-- Rate Instruction -->
                  <div v-if="isFeedbackEligible(ticket)" class="mt-3 flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl animate-fade-in">
                    <div class="p-1.5 bg-amber-100 rounded-lg shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-0.5">Action Required</p>
                      <p class="text-xs font-semibold text-amber-800 leading-relaxed">This ticket is completed! Please click the <strong>"Rate"</strong> button to submit your rating and officially close this ticket.</p>
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
                    class="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-sm shadow-amber-500/20 transition-all text-xs active:scale-95 whitespace-nowrap"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    {{ ratingTicketId === ticket.ticketId ? 'Close Rating' : 'Rate' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Expanded Ratings Form -->
            <div v-if="ratingTicketId === ticket.ticketId" class="border-t border-slate-100 p-5 bg-emerald-50">
              <div class="flex items-start justify-between mb-5">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <div class="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <h4 class="font-black text-emerald-900 text-sm">Service Performance Evaluation</h4>
                  </div>
                  <p class="text-xs text-emerald-700/80">Complete this evaluation to close your ticket.</p>
                </div>
                <span class="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg uppercase tracking-wider border border-emerald-200">Section F</span>
              </div>

              <div class="space-y-5">
                <!-- Completion Status -->
                <div>
                  <label class="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">1. Job Completion Status <span class="text-rose-500">*</span></label>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <label v-for="option in completionOptions" :key="option.value"
                      :class="['flex items-center justify-center p-2.5 border rounded-xl cursor-pointer transition-all text-center', satisfactionForm.completionStatus === option.value ? option.activeClass : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300']">
                      <input type="radio" v-model="satisfactionForm.completionStatus" :value="option.value" class="hidden" />
                      <span class="text-xs font-bold leading-tight">{{ option.label }}</span>
                    </label>
                  </div>
                </div>

                <!-- Star Ratings -->
                <div v-if="satisfactionForm.completionStatus === 'on-time' || satisfactionForm.completionStatus === 'beyond-time'" class="bg-white p-4 rounded-xl border border-slate-200 space-y-3 animate-fade-in">
                  <div class="mb-3">
                    <label class="block text-xs font-black text-slate-700 uppercase tracking-wider mb-0.5">2. Service Quality Rating <span class="text-rose-500">*</span></label>
                    <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">(1-Poor, 2-Fair, 3-Satisfactory, 4-Very Satisfactory, 5-Outstanding)</p>
                  </div>
                  <div v-for="(label, key) in ratingCriteria" :key="key" class="flex items-center justify-between gap-3">
                    <span class="text-xs text-slate-600 font-medium flex-1">{{ label }}</span>
                    <div class="flex gap-1">
                      <button v-for="star in 5" :key="star" @click="satisfactionForm.ratings[key] = star"
                        :class="['w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all active:scale-95',
                          satisfactionForm.ratings[key] === star ? 'bg-amber-100 text-amber-600 border border-amber-200' : 'bg-slate-50 text-slate-300 border border-slate-100']">
                        {{ star }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Beyond Time Reasons -->
                <div v-if="satisfactionForm.completionStatus === 'beyond-time'" class="bg-white p-4 rounded-xl border border-slate-200 animate-fade-in">
                  <label class="block text-xs font-black text-slate-700 uppercase tracking-wider mb-3">Reasons for beyond time</label>
                  <div class="space-y-2.5">
                    <CheckboxItem v-model="satisfactionForm.beyondTimeReasons.personnelAbsent" label="Personnel absent / on-leave" />
                    <CheckboxItem v-model="satisfactionForm.beyondTimeReasons.extendedBreak" label="Extended break period" />
                    <CheckboxItem v-model="satisfactionForm.beyondTimeReasons.additionalWork" label="Additional work requested" />
                  </div>
                </div>

                <!-- Not Completed Reasons -->
                <div v-if="satisfactionForm.completionStatus === 'not-completed'" class="bg-white p-4 rounded-xl border border-slate-200 animate-fade-in">
                  <label class="block text-xs font-black text-slate-700 uppercase tracking-wider mb-3">Reasons for not completed</label>
                  <div class="space-y-2.5">
                    <CheckboxItem v-model="satisfactionForm.notCompletedReasons.lackWorkingDays" label="Lack of working days" />
                    <CheckboxItem v-model="satisfactionForm.notCompletedReasons.lackMaterials" label="Lack of materials / tools" />
                    <CheckboxItem v-model="satisfactionForm.notCompletedReasons.lackSkills" label="Lack of skills" />
                  </div>
                </div>

                <!-- Remarks -->
                <div v-if="satisfactionForm.completionStatus" class="animate-fade-in">
                  <label class="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Remarks (Optional)</label>
                  <textarea v-model="satisfactionForm.remarks" rows="2"
                    class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm transition-all resize-none"
                    placeholder="Any additional comments...">
                  </textarea>
                </div>

                <!-- Submit -->
                <button
                  @click="closeTicket(ticket)"
                  :disabled="!isFormValid"
                  :class="['w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all',
                    isFormValid ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 active:scale-[0.98]' : 'bg-slate-200 text-slate-400 cursor-not-allowed']"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Submit & Close Ticket
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
                      </div>
                    </div>
                  </div>
                  <button @click="closeTimeline" class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all active:scale-95 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- Modal Body -->
                <div class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">

                  <!-- ========== TIMELINE STEPS ========== -->
                  <div>
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Request Progress</p>
                    <div class="relative pl-8 space-y-6 before:absolute before:inset-y-2 before:left-[15px] before:w-0.5 before:bg-slate-200">
                      <div v-for="(step, index) in getSteps(selectedTicket)" :key="index" class="relative">
                        <!-- Step dot -->
                        <div :class="[
                          'absolute -left-8 w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-white text-xs font-black transition-all duration-500',
                          selectedTicket.currentStep > (index + 1)  ? 'bg-emerald-500 text-white shadow-emerald-500/30 shadow-md' :
                          selectedTicket.currentStep === (index + 1) ? getActiveDot(selectedTicket.status) + ' shadow-md' :
                          'bg-slate-200 text-slate-400'
                        ]">
                          <svg v-if="selectedTicket.currentStep > (index + 1)" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                          </svg>
                          <span v-else class="leading-none">{{ index + 1 }}</span>
                        </div>

                        <!-- Step content -->
                        <div :class="['ml-2 pb-1', selectedTicket.currentStep < (index + 1) ? 'opacity-40' : '']">
                          <div class="flex items-center gap-2 mb-0.5">
                            <h4 :class="['font-bold text-sm leading-tight', selectedTicket.currentStep >= (index + 1) ? 'text-slate-900' : 'text-slate-400']">
                              {{ step.label }}
                            </h4>
                            <span v-if="selectedTicket.currentStep === (index + 1)" :class="['px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest', getActiveStepBadge(selectedTicket.status)]">
                              Current
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

                          <!-- ---- SSU: Vehicle Pass Application (Step 1) ---- -->
                          <template v-if="selectedTicket.unit === 'SSU' && selectedTicket.service === 'Vehicle Pass Application' && index === 0">
                            <button v-if="selectedTicket.currentStep >= 1" @click="showDigitalForm = !showDigitalForm" class="mt-3 px-3.5 py-2 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-600 hover:text-blue-700 text-xs font-bold rounded-lg transition-all flex items-center gap-2 shadow-sm active:scale-95">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {{ showDigitalForm ? 'Hide Form' : 'View Application' }}
                            </button>
                            <div v-if="showDigitalForm" class="mt-3 animate-fade-in">
                              <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                                <FormRow label="Plate No." :value="selectedTicket.plate_no" />
                                <FormRow label="Vehicle Type" :value="selectedTicket.vehicle_type" />
                                <FormRow label="Make/Series" :value="selectedTicket.make_series" />
                                <FormRow label="Color" :value="selectedTicket.color" />
                                <FormRow label="Address" :value="selectedTicket.address" />
                              </div>
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

                          <!-- ---- TASU: Trip Details (Step 1) ---- -->
                          <template v-if="selectedTicket.unit === 'TASU' && index === 0">
                            <button v-if="selectedTicket.currentStep >= 1" @click="showDigitalForm = !showDigitalForm" class="mt-3 px-3.5 py-2 bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50 text-slate-600 hover:text-amber-700 text-xs font-bold rounded-lg transition-all flex items-center gap-2 shadow-sm active:scale-95">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {{ showDigitalForm ? 'Hide Details' : 'View Trip Details' }}
                            </button>
                            <div v-if="showDigitalForm" class="mt-3 animate-fade-in">
                              <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                                <FormRow label="Destination" :value="selectedTicket.destination" />
                                <FormRow label="Passengers" :value="selectedTicket.passengers" />
                                <FormRow label="Date of Travel" :value="selectedTicket.dateOfTravel" />
                                <FormRow label="Purpose of Travel" :value="selectedTicket.purpose" full />
                              </div>
                              <AttachmentList v-if="selectedTicket.attachments?.length" :attachments="selectedTicket.attachments" @download="downloadAttachment" />
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

                          <!-- ---- TASU: Assigned Driver/Vehicle (Step 3) ---- -->
                          <template v-if="selectedTicket.unit === 'TASU' && index === 2 && selectedTicket.currentStep >= (index + 1)">
                            <div v-if="selectedTicket.assignedVehicle" class="mt-3 grid grid-cols-2 gap-2">
                              <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned Vehicle</p>
                                <p class="text-xs font-bold text-slate-700">{{ selectedTicket.assignedVehicle }}</p>
                              </div>
                              <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned Driver</p>
                                <p class="text-xs font-bold text-slate-700">{{ selectedTicket.assignedDriver }}</p>
                              </div>
                            </div>
                          </template>

                        </div>
                      </div>
                    </div>
                  </div>



                  <!-- ========== TICKET CLOSED STATE ========== -->
                  <div
                    v-if="selectedTicket.isClosed || (selectedTicket.unit === 'SSU' && selectedTicket.service === 'Incident Report' && selectedTicket.currentStep >= 4)"
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

      <!-- Image Viewer Modal -->
      <Teleport to="body">
        <div v-if="showImageModal" class="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in pointer-events-auto" @click.self="closeImageModal">
          <div class="relative bg-white rounded-2xl p-2 max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
            <button @click="closeImageModal" class="absolute -top-4 -right-4 bg-white text-slate-500 hover:text-slate-700 p-2 rounded-full shadow-lg transition-colors z-10">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div class="overflow-auto rounded-xl flex items-center justify-center bg-slate-100 min-h-[200px] min-w-[200px]">
              <img :src="selectedImageUrl" alt="Attachment Preview" class="max-w-full max-h-[85vh] object-contain rounded-xl" />
            </div>
          </div>
        </div>
      </Teleport>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, defineComponent, h } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/api/client';

const authStore = useAuthStore();

const ratingTicketId = ref(null);
const showToast = ref(false);
const toastMessage = ref('');

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

/**
 * Attachment list renderer for FGMU/LEAU/TASU digital forms.
 */
const AttachmentList = defineComponent({
  props: { attachments: Array },
  emits: ['download'],
  setup(props, { emit }) {
    return () => props.attachments?.length
      ? h('div', { class: 'mt-3 pt-3 border-t border-slate-200' }, [
          h('p', { class: 'text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2' }, 'Attachments'),
          h('div', { class: 'space-y-1.5' }, props.attachments.map(att =>
            h('button', {
              key: att.id,
              class: 'w-full flex items-center gap-3 p-2.5 bg-white border border-slate-200 rounded-xl hover:border-emerald-400 transition-colors text-left group',
              onClick: () => emit('download', att),
            }, [
              h('div', { class: 'w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0 group-hover:bg-emerald-100 transition-colors' },
                h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-4 w-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
                  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13' })
                )
              ),
              h('div', { class: 'flex-1 min-w-0' }, [
                h('p', { class: 'text-xs font-bold text-slate-700 truncate group-hover:text-emerald-700 transition-colors' }, att.file_name || 'Attachment'),
                h('p', { class: 'text-[10px] text-slate-400' }, att.file_size_bytes ? `${(att.file_size_bytes / 1024).toFixed(1)} KB` : 'Unknown'),
              ]),
            ])
          )),
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
      ]),

      ...(props.ticket.attachments?.length ? [h(AttachmentList, { attachments: props.ticket.attachments, onDownload: (att) => emit('download', att) })] : []),
    ]);
  },
});

/**
 * Styled checkbox item.
 */
const CheckboxItem = defineComponent({
  props: { modelValue: Boolean, label: String },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h('label', { class: 'flex items-center gap-3 cursor-pointer group' }, [
      h('div', { class: 'relative flex-shrink-0 w-5 h-5 border-2 rounded overflow-hidden transition-colors group-hover:border-emerald-500 ' + (props.modelValue ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 bg-white') }, [
        h('input', { type: 'checkbox', checked: props.modelValue, class: 'absolute inset-0 opacity-0 cursor-pointer', onChange: (e) => emit('update:modelValue', e.target.checked) }),
        props.modelValue ? h('svg', { class: 'absolute inset-0 w-full h-full p-0.5 text-white', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '3' }, h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M5 13l4 4L19 7' })) : null,
      ]),
      h('span', { class: 'text-sm text-slate-600' }, props.label),
    ]);
  },
});

// ---- Attachment download ----
const showImageModal = ref(false);
const selectedImageUrl = ref('');

const closeImageModal = () => {
  showImageModal.value = false;
  if (selectedImageUrl.value) {
    window.URL.revokeObjectURL(selectedImageUrl.value);
    selectedImageUrl.value = '';
  }
};

const downloadAttachment = async (att) => {
  try {
    const response = await api.get(`attachments/${att.id}`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: att.file_type || 'application/octet-stream' }));
    if (att.file_type?.startsWith('image/')) {
      selectedImageUrl.value = url;
      showImageModal.value = true;
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
    alert(`Failed to download attachment: ${error.response?.data?.message || error.message}`);
  }
};

// ---- Route highlight ----
const route            = useRoute();
const highlightedTicket = ref(null);

// ---- Data ----
const userName = ref('');
const tickets  = ref([]);

const fetchTickets = async () => {
  try {
    const response = await api.get('tickets/my-requests');
    if (response.data?.data?.tickets) {
      tickets.value = response.data.data.tickets.map(t => ({
        id: t.id,
        ticketId: t.id,
        title: t.title,
        service: t.service_type,
        unit: t.unit_code,
        description: t.description,
        status: t.status,
        statusLabel: t.status_label,
        date: new Date(t.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        requestedBy: userName.value,
        location: t.location,
        office_room: t.office_room,
        make_series: t.details?.make_series || '',
        color: t.details?.type_color || '',
        address: t.details?.house_street
          ? `${t.details.house_street}, ${t.details.barangay}, ${t.details.city_municipality}, ${t.details.province}`
          : (t.details?.complete_address || ''),
        destination: t.details?.destination || 'N/A',
        passengers: t.details?.number_of_passengers || t.details?.numberOfPassengers || 'N/A',
        dateOfTravel: t.details?.date_of_travel || t.details?.dateOfTravel || 'N/A',
        purpose: t.details?.purpose_of_travel || t.details?.purposeOfTravel || t.details?.purpose || 'N/A',
        attachments: t.attachments || [],
        declineReason: t.decline_reason || '',
        currentStep: parseInt(t.current_step) || 1,
        assignedVehicle: t.assignment?.vehicle_name || null,
        assignedDriver: t.assignment?.personnel_name || null,
        implementationDate: t.assignment?.implementation_date
          ? new Date(t.assignment.implementation_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : null,
        isClosed: t.status === 'completed' || t.status === 'closed',
        // SSU Incident Report specific fields
        isUnderInvestigation: Number(t.is_under_investigation) === 1,
        hasNotation:          !!t.ssu_notation,
        notation:             t.ssu_notation || '',
        actionsTaken:         t.ssu_notation || '',
      }));
      
      const ackMap = JSON.parse(localStorage.getItem('gso_ssu_acknowledged_incidents') || '{}');
      tickets.value.forEach(t => {
        if (ackMap[t.ticketId]) {
          Object.assign(t, ackMap[t.ticketId]);
        }
      });

      // Update the timeline modal ticket if it is currently open
      if (selectedTicket.value) {
        const updated = tickets.value.find(t => t.ticketId === selectedTicket.value.ticketId);
        if (updated) {
          selectedTicket.value = updated;
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch tickets:', error);
  }
};

let pollingInterval = null;

onMounted(() => {
  if (route.query.highlight) {
    highlightedTicket.value = route.query.highlight;
    setTimeout(() => {
      const el = document.getElementById(route.query.highlight);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
  }

  userName.value = authStore.user?.first_name || authStore.fullName || 'User';

  fetchTickets();
  pollingInterval = setInterval(fetchTickets, 5000);
});

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval);
});

// ---- Filtering ----
const searchQuery  = ref('');
const statusFilter = ref('all');

const statusCounts = computed(() => ({
  all:        tickets.value.length,
  pending:    tickets.value.filter(t => t.status === 'pending').length,
  processing: tickets.value.filter(t => t.status === 'processing').length,
  resolved:   tickets.value.filter(t => t.status === 'resolved').length,
}));

const statusTabs = computed(() => [
  { value: 'all',        label: 'All',        count: statusCounts.value.all,        activeClass: 'bg-slate-900 text-white border-slate-900' },
  { value: 'pending',    label: 'Pending',    count: statusCounts.value.pending,    activeClass: 'bg-amber-50 text-amber-700 border-amber-400' },
  { value: 'processing', label: 'In Progress', count: statusCounts.value.processing, activeClass: 'bg-blue-50 text-blue-700 border-blue-400' },
  { value: 'resolved',   label: 'Resolved',   count: statusCounts.value.resolved,   activeClass: 'bg-emerald-50 text-emerald-700 border-emerald-400' },
]);

const filteredTickets = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return tickets.value.filter(ticket => {
    const matchesSearch = ticket.ticketId.toLowerCase().includes(query)
      || ticket.service.toLowerCase().includes(query)
      || ticket.unit.toLowerCase().includes(query);
    const matchesStatus = statusFilter.value === 'all' || ticket.status === statusFilter.value;
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
};

// ---- Step definitions ----
const unitSteps = {
  FGMU: [
    { label: 'Digital Submission',  description: 'The client completes the required fields in the digital form.' },
    { label: 'Ticket Creation',     description: 'System generated a Digital Ticket.' },
    { label: 'Admin Approval',      description: 'Approved by the administration unit.' },
    { label: 'Dispatch & Schedule', description: 'Dispatcher assigned workers and scheduled implementation.' },
    { label: 'Job Started',         description: 'Workers have started the job.' },
    { label: 'Job Finished',        description: 'Workers marked the job as complete.' },
  ],
  LEAU: [
    { label: 'Digital Submission',  description: 'The client completes the required fields in the digital form.' },
    { label: 'Ticket Creation',     description: 'System generated a Digital Ticket and assigned "Pending Approval" status.' },
    { label: 'Admin Approval',      description: 'Approved by the administration unit.' },
    { label: 'Dispatch & Schedule', description: 'Dispatcher assigned workers and scheduled implementation.' },
    { label: 'Job Started',         description: 'Workers have started the job.' },
    { label: 'Job Finished',        description: 'Workers marked the job as complete.' },
  ],
  SSU: {
    'Vehicle Pass Application': [
      { label: 'Application',           description: 'The client fills out the digital Vehicle Pass Application.' },
      { label: 'Document Upload',       description: "OR/CR and Driver's License digital copies uploaded." },
      { label: 'Document Verification', description: 'Staff verifies documents.' },
      { label: 'Status Update',         description: 'Ticket marked as "Approved - Ready for Pickup".' },
      { label: 'Completion',            description: 'Sticker is ready for pickup at the Security Office.' },
    ],
    'Incident Report': [
      { label: 'Report Submission',        description: 'The client fills out a digital Incident Report and submits it to SSU.' },
      { label: 'Staff Review',             description: 'SSU staff reviews the incident details.' },
      { label: 'Action / Investigation',   description: 'SSU staff takes action: logs a recommendation and/or opens an investigation.' },
      { label: 'Resolution',              description: 'SSU staff marks the incident as resolved.' },
      { label: 'Archiving',               description: 'Ticket moved to digital archives for record-keeping.' },
    ],
  },
  TASU: [
    { label: 'Request Submission', description: 'Client submits Vehicle Request and Travel Order Letter.' },
    { label: 'Approval',           description: 'Unit Head checks availability and approves request.' },
    { label: 'Assignment',         description: 'Dispatcher assigns a driver and a specific vehicle.' },
    { label: 'Close-out',          description: 'Driver marks the trip as "Accomplished".' },
  ],
};

const getSteps = (ticket) => {
  if (!ticket) return [];
  let steps = ticket.unit === 'SSU'
    ? [...(unitSteps.SSU[ticket.service] || [])]
    : [...(unitSteps[ticket.unit] || [])];

  steps = steps.map(s => ({ ...s }));

  if (ticket.implementationDate && (ticket.unit === 'FGMU' || ticket.unit === 'LEAU') && steps.length > 3) {
    steps[3].description = `Dispatcher assigned workers and scheduled implementation for ${ticket.implementationDate}.`;
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
const completionOptions = [
  { value: 'on-time',       label: 'Completed On-Time',          activeClass: 'bg-emerald-100 border-emerald-400 text-emerald-800 shadow-sm' },
  { value: 'beyond-time',   label: 'Completed Beyond Time',      activeClass: 'bg-amber-100 border-amber-400 text-amber-800 shadow-sm' },
  { value: 'not-completed', label: 'Not Completed / Performed',  activeClass: 'bg-rose-100 border-rose-400 text-rose-800 shadow-sm' },
];

const ratingCriteria = {
  quality:     'Quality of Work / Service',
  efficiency:  'Efficiency / Work Discipline',
  timeliness:  'Timeliness of Completion',
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
  if (!ticket || ticket.isClosed) return false;
  if (ticket.unit === 'FGMU' || ticket.unit === 'LEAU') return ticket.currentStep === 6;
  if (ticket.unit === 'SSU') return false;
  if (ticket.unit === 'TASU') return ticket.currentStep === 4;
  return false;
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
  if (!ticket || !isFormValid.value) return;
  try {
    const payload = {
      ticket_id: ticket.ticketId || ticket.id,
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
    
    // Show toast message
    toastMessage.value = `Thanks for the honest evaluation, #${ticket.ticketId || ticket.id} is now complete and closed!`;
    showToast.value = true;
    setTimeout(() => { showToast.value = false; }, 5000);
    
    ratingTicketId.value = null;

    await fetchTickets();
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    ticket.isClosed = true;
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
