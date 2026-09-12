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
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">Completed Tickets</h2>
        <p class="text-xs font-medium text-slate-500">View your past and resolved requests</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-6 animate-fade-in relative pb-12">
        <!-- Search and Filters -->
        <div class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div class="flex-1 w-full relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input v-model="searchQuery" type="text" placeholder="Search Ticket ID (e.g. FGMU-TIC-42)" class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
          </div>
        </div>

        <!-- Tickets List (Data Table) -->
        <div class="rounded-[2.5rem] bg-white border border-slate-200 p-8 overflow-hidden shadow-sm mt-6">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-separate border-spacing-y-4 min-w-[800px]">
              <thead>
                <tr class="border-b border-slate-100">
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6">Ticket ID</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Service</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Status</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Completed</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ticket in paginatedTickets" :key="ticket.id" class="group transition-all duration-200">
                  <td class="py-5 px-6 bg-slate-50/60 border-y border-l border-slate-200 rounded-l-2xl group-hover:bg-white group-hover:border-emerald-500 group-hover:shadow-md transition-all">
                    <span class="text-sm font-black text-slate-900">#{{ ticket.ticketId }}</span>
                  </td>
                  <td class="py-5 px-4 bg-slate-50/60 border-y border-slate-200 group-hover:bg-white group-hover:border-emerald-500 transition-all">
                    <div class="truncate max-w-[150px] sm:max-w-xs text-sm font-bold text-slate-900" :title="ticket.title || ticket.service">{{ ticket.title || ticket.service }}</div>
                  </td>
                  <td class="py-5 px-4 bg-slate-50/60 border-y border-slate-200 group-hover:bg-white group-hover:border-emerald-500 transition-all">
                    <span :class="['px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border whitespace-nowrap', (ticket.status === 'declined' || ticket.status === 'rejected') ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200']">
                      {{ ticket.statusLabel }}
                    </span>
                  </td>
                  <td class="py-5 px-4 bg-slate-50/60 border-y border-slate-200 group-hover:bg-white group-hover:border-emerald-500 transition-all">
                    <span class="text-xs font-bold text-slate-500">{{ ticket.date }}</span>
                  </td>
                  <td class="py-5 px-6 bg-slate-50/60 border-y border-r border-slate-200 rounded-r-2xl group-hover:bg-white group-hover:border-emerald-500 group-hover:shadow-md transition-all text-right">
                    <div class="inline-flex items-center justify-end gap-2">
                      <button @click="openTimeline(ticket)" class="px-3.5 py-2 bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 font-bold rounded-xl border border-slate-200 hover:border-emerald-200 transition-all text-[11px] active:scale-95 inline-flex items-center gap-1.5 cursor-pointer shadow-xs">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        Track Progress
                      </button>
                      <button @click="viewDetails(ticket)" class="px-3.5 py-2 bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 text-[11px] font-bold rounded-xl transition-all shadow-xs active:scale-95 inline-flex items-center gap-1.5 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredTickets.length === 0">
                  <td colspan="5" class="p-12 text-center bg-slate-50 border border-slate-200 rounded-[2rem]">
                    <div class="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <h3 class="text-lg font-black text-slate-900 mb-1">No Completed Tickets</h3>
                    <p class="text-sm text-slate-500 font-medium">You don't have any completed or archived tickets yet.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Toolbar -->
          <div v-if="filteredTickets.length > 0" class="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3 text-xs text-slate-500">
              <span>Rows per page:</span>
              <select
                v-model="perPage"
                @change="currentPage = 1"
                class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="15">15</option>
                <option :value="25">25</option>
                <option :value="50">50</option>
              </select>
              <span>
                Showing <strong class="text-slate-800">{{ ((currentPage - 1) * perPage) + 1 }}</strong> to
                <strong class="text-slate-800">{{ Math.min(currentPage * perPage, filteredTickets.length) }}</strong> of
                <strong class="text-slate-800">{{ filteredTickets.length }}</strong> tickets
              </span>
            </div>

            <!-- Page Buttons -->
            <div class="flex items-center gap-1.5">
              <button
                @click="currentPage = 1"
                :disabled="currentPage === 1"
                class="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-bold cursor-pointer"
                title="First page"
              >
                «
              </button>
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                ‹ Prev
              </button>

              <template v-for="(page, idx) in displayedPages" :key="idx">
                <span v-if="page === '...'" class="px-2 text-slate-400 font-bold text-xs">...</span>
                <button
                  v-else
                  @click="currentPage = page"
                  :class="[
                    'w-8 h-8 rounded-xl text-xs font-black transition-all cursor-pointer',
                    currentPage === page
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                  ]"
                >
                  {{ page }}
                </button>
              </template>

              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                Next ›
              </button>
              <button
                @click="currentPage = totalPages"
                :disabled="currentPage === totalPages"
                class="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-bold cursor-pointer"
                title="Last page"
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #modal-overlay>
      <!-- Read-Only Ticket Details Modal -->
      <div v-if="showDetailsModal && selectedTicket" class="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in pointer-events-auto" @click.self="closeDetailsModal">
        <div class="bg-white rounded-[2rem] p-8 max-w-2xl w-full shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-black text-slate-900">Completed Ticket Details</h3>
            <div class="flex items-center gap-2">
              <button @click="openTimeline(selectedTicket)" class="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Track Progress
              </button>
              <button @click="closeDetailsModal" class="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full transition-colors active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div class="space-y-6">
            <div class="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <div>
                <p class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Status</p>
                <p class="text-lg font-black text-emerald-700">{{ selectedTicket.statusLabel }}</p>
              </div>
              <div class="text-right">
                <p class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Completed Date</p>
                <p class="text-sm font-bold text-emerald-700">{{ selectedTicket.date }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Ticket ID</p>
                <p class="text-base font-semibold text-slate-900">{{ selectedTicket.ticketId }}</p>
              </div>
              <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Unit Assigned</p>
                <p class="text-base font-semibold text-slate-900">{{ selectedTicket.unit }}</p>
              </div>
              <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Service Type</p>
                <p class="text-base font-semibold text-slate-900">{{ selectedTicket.title || selectedTicket.service }}</p>
              </div>
              <div v-if="selectedTicket.workingDays">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Target Duration</p>
                <div class="flex items-center gap-1.5 flex-wrap">
                  <p class="text-base font-semibold text-emerald-800">{{ selectedTicket.workingDays }} Working Day(s)</p>
                  <span v-if="selectedTicket.extension_days > 0" class="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-100 text-amber-800 border border-amber-200">
                    +{{ selectedTicket.extension_days }}d Ext
                  </span>
                </div>
              </div>
              <div v-if="selectedTicket.effective_target_date || selectedTicket.target_completion_date">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Target Completion Date</p>
                <p class="text-base font-semibold text-slate-800">{{ formatDate(selectedTicket.effective_target_date || selectedTicket.target_completion_date) }}</p>
              </div>

              <!-- Dedicated Extension Notice Section (If Applicable) -->
              <div v-if="selectedTicket.is_extended && selectedTicket.extension_days > 0" class="col-span-2">
                <p class="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Timeline Extension Notice
                </p>
                <div class="p-4 bg-amber-50 border border-amber-200 rounded-xl shadow-xs">
                  <div class="flex items-center justify-between gap-2 mb-1 flex-wrap">
                    <span class="text-xs font-bold text-amber-900">
                      Approved Extension: +{{ selectedTicket.extension_days }} Working Day{{ selectedTicket.extension_days > 1 ? 's' : '' }}
                    </span>
                    <span class="text-xs font-semibold text-amber-800">
                      Adjusted Target: {{ formatDate(selectedTicket.effective_target_date || selectedTicket.target_completion_date) }}
                    </span>
                  </div>
                  <p v-if="selectedTicket.extension_reason" class="text-xs text-amber-800 font-medium italic mt-1">
                    <span class="font-bold not-italic text-[10px] uppercase tracking-wider text-amber-900">Reason:</span> "{{ selectedTicket.extension_reason }}"
                  </p>
                </div>
              </div>

              <!-- Dedicated Decline Reason Section (If Applicable) -->
              <div v-if="selectedTicket.declineReason" class="col-span-2">
                <p class="text-xs font-bold text-rose-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Reason for Decline
                </p>
                <div class="p-5 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl shadow-sm">
                  <p class="text-sm font-semibold text-rose-800 leading-relaxed">{{ selectedTicket.declineReason }}</p>
                </div>
              </div>

              <!-- Dedicated Feedback/Rating Section (If Applicable) -->
              <div v-if="selectedTicket.feedback" class="col-span-2 mt-2">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Your Service Feedback
                </p>
                <div class="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div class="flex flex-col items-center p-3 bg-slate-50 rounded-lg">
                      <span class="text-xl font-black text-slate-800">{{ selectedTicket.feedback.quality_rating }} <span class="text-xs text-slate-400">/ 5</span></span>
                      <span class="text-[9px] font-bold text-slate-500 uppercase mt-1">Quality</span>
                    </div>
                    <div class="flex flex-col items-center p-3 bg-slate-50 rounded-lg">
                      <span class="text-xl font-black text-slate-800">{{ selectedTicket.feedback.efficiency_rating }} <span class="text-xs text-slate-400">/ 5</span></span>
                      <span class="text-[9px] font-bold text-slate-500 uppercase mt-1">Efficiency</span>
                    </div>
                    <div class="flex flex-col items-center p-3 bg-slate-50 rounded-lg">
                      <span class="text-xl font-black text-slate-800">{{ selectedTicket.feedback.timeliness_rating }} <span class="text-xs text-slate-400">/ 5</span></span>
                      <span class="text-[9px] font-bold text-slate-500 uppercase mt-1">Timeliness</span>
                    </div>
                  </div>
                  <div v-if="selectedTicket.feedback.remarks" class="pt-4 border-t border-slate-100">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Your Additional Remarks</p>
                    <p class="text-sm font-medium text-slate-600 italic">"{{ selectedTicket.feedback.remarks }}"</p>
                  </div>
                </div>
              </div>

              <!-- Dedicated Submitted Attachments Section (Client's Own Uploaded Files Only) -->
              <div v-if="userAttachments && userAttachments.length > 0" class="col-span-2 mt-2">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  Submitted Attachments
                </p>
                <div class="flex flex-col gap-2">
                  <div v-for="att in userAttachments" :key="att.id" class="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-emerald-500 transition-colors shadow-xs group">
                    <div class="flex items-center gap-3 min-w-0 flex-1 cursor-pointer" @click.prevent="downloadAttachment(att)">
                      <div :class="`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        isDocxFile(att.file_name, att.file_type) ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-100' :
                        isPdfFile(att.file_name, att.file_type) ? 'bg-rose-50 text-rose-600 group-hover:bg-rose-100' :
                        'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100'
                      }`">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div class="flex flex-col overflow-hidden min-w-0 flex-1">
                        <span class="text-xs font-bold text-slate-700 truncate group-hover:text-emerald-700 transition-colors">{{ att.file_name || 'Attachment' }}</span>
                        <span class="text-[10px] font-bold text-slate-400">
                          {{ att.file_size_bytes ? (att.file_size_bytes / 1024).toFixed(1) + ' KB' : 'File' }}
                          <span class="mx-1">•</span>
                          <span :class="isDocxFile(att.file_name, att.file_type) ? 'text-blue-600' : isPdfFile(att.file_name, att.file_type) ? 'text-rose-600' : 'text-slate-500'">
                            {{ isDocxFile(att.file_name, att.file_type) ? 'DOCX (Auto-download)' : isPdfFile(att.file_name, att.file_type) ? 'PDF Document' : 'Attachment' }}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div class="flex items-center gap-1.5 shrink-0 ml-2">
                      <button
                        v-if="isPdfFile(att.file_name, att.file_type)"
                        type="button"
                        @click="downloadAttachment(att)"
                        class="px-2.5 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        @click="downloadAttachmentDirectly(att)"
                        class="px-2.5 py-1 text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                        title="Download file"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Read Only Notice -->
            <div class="p-4 bg-slate-100 rounded-xl border border-slate-200 flex items-center gap-3 text-slate-500">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <p class="text-xs font-semibold">This ticket is completed and viewable in read-only mode for your records.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Document & Attachment Viewer Modal -->
      <DocumentViewerModal
        v-model:isOpen="viewerModal.isOpen"
        :title="viewerModal.title"
        :fileName="viewerModal.fileName"
        :fileBlob="viewerModal.fileBlob"
      />


      <!-- Timeline Progress Modal -->
      <div
        v-if="selectedTimelineTicket"
        class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        @click.self="closeTimeline"
      >
        <div class="bg-white rounded-3xl w-full max-w-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden" @click.stop>
          <!-- Modal Header -->
          <div class="flex items-start justify-between px-6 pt-6 pb-5 border-b border-slate-100 shrink-0">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-emerald-50 text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-black text-slate-900 leading-tight">{{ selectedTimelineTicket.title || selectedTimelineTicket.service }}</h3>
                <div class="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span class="text-xs font-mono font-bold text-slate-400">#{{ selectedTimelineTicket.ticketId }}</span>
                  <span class="text-slate-300">·</span>
                  <span class="text-xs font-bold text-slate-500">{{ selectedTimelineTicket.unit }}</span>
                  <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide border bg-emerald-50 text-emerald-700 border-emerald-200">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {{ selectedTimelineTicket.statusLabel }}
                  </span>
                </div>
              </div>
            </div>
            <button @click="closeTimeline" class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all active:scale-95 flex-shrink-0 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
            <div>
              <!-- Official Timeline Extension Notice Banner in Modal -->
              <div v-if="selectedTimelineTicket.is_extended && selectedTimelineTicket.extension_days > 0" class="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 animate-fade-in">
                <div class="p-2 bg-amber-100 rounded-xl text-amber-700 shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1 flex-wrap">
                    <span class="text-[10px] font-black text-amber-800 uppercase tracking-widest">Timeline Extension Notice</span>
                    <span class="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-200 text-amber-800 border border-amber-300 uppercase tracking-wider">
                      +{{ selectedTimelineTicket.extension_days }} Working Day(s)
                    </span>
                  </div>
                  <p class="text-xs text-amber-900 font-semibold leading-relaxed">
                    Target completion adjusted to <strong>{{ formatDate(selectedTimelineTicket.effective_target_date || selectedTimelineTicket.target_completion_date) }}</strong> (total duration: {{ selectedTimelineTicket.workingDays }} working days).
                  </p>
                  <p v-if="selectedTimelineTicket.extension_reason" class="text-xs text-amber-800 font-medium mt-1 italic">
                    <span class="font-bold not-italic text-[10px] uppercase tracking-wider text-amber-900">Reason:</span> "{{ selectedTimelineTicket.extension_reason }}"
                  </p>
                </div>
              </div>

              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Request Progress</p>
              <div class="relative pl-8 space-y-6 before:absolute before:inset-y-2 before:left-[15px] before:w-0.5 before:bg-slate-200">
                <div v-for="(step, index) in getSteps(selectedTimelineTicket)" :key="index" class="relative">
                  <!-- Step dot -->
                  <div class="absolute -left-8 w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-white text-xs font-black transition-all duration-500 bg-emerald-500 text-white shadow-emerald-500/30 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <!-- Step Content -->
                  <div class="pt-0.5">
                    <div class="flex items-center gap-2 mb-0.5">
                      <h4 :class="['font-bold text-sm leading-tight', selectedTimelineTicket.currentStep >= (index + 1) ? 'text-slate-900' : 'text-slate-400']">
                        {{ step.label }}
                      </h4>
                      <span v-if="index === getSteps(selectedTimelineTicket).length - 1" class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700">
                        Completed
                      </span>
                    </div>
                    <p class="text-xs text-slate-500 leading-relaxed">{{ step.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Finalized Card -->
            <div class="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center">
              <div class="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-3 text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 class="font-black text-slate-900 text-sm mb-1">Ticket Finalized & Archived</h4>
              <p class="text-xs text-slate-500 leading-relaxed">Thank you for using GSO E-Ticketing. This service request has been completed and archived.</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </MainLayout>
</template>
<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import DocumentViewerModal from '@/components/DocumentViewerModal.vue';
import { parseDateLocal } from '@/utils/workCalendar';
import { useAuthStore } from '@/stores/auth';
import api from '@/api/client';

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const parsed = parseDateLocal(dateStr);
  if (!parsed || isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const route = useRoute();
const router = useRouter();

import { isDocxFile, isPdfFile, handleAttachmentClick, downloadAttachmentDirectly } from '@/utils/attachmentHelper';

const authStore = useAuthStore();

const viewerModal = reactive({
  isOpen: false,
  title: '',
  fileName: '',
  fileBlob: null
});

const downloadAttachment = async (att) => {
  await handleAttachmentClick(att, (blob, att) => {
    viewerModal.title = att.file_name || 'Document Attachment';
    viewerModal.fileName = att.file_name || 'attachment.pdf';
    viewerModal.fileBlob = blob;
    viewerModal.isOpen = true;
  });
};

const userName = ref(authStore.user?.first_name || authStore.fullName || 'User');

const tickets = ref([]);

onMounted(async () => {
  try {
    const response = await api.get('tickets/completed');
    if (response.data?.data?.tickets) {
      tickets.value = response.data.data.tickets.map(t => ({
        id: t.id,
        ticketId: t.id,
        title: t.title,
        service: t.service_type,
        service_type: t.service_type,
        unit: t.unit_code,
        unit_code: t.unit_code,
        unit_id: t.unit_id,
        description: t.description,
        status: t.status,
        statusLabel: t.status_label,
        date: new Date(t.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        submitted_at: t.submitted_at,
        completed_at: t.completed_at || t.updated_at,
        requestedBy: userName.value,
        location: t.location || t.details?.college_building || 'N/A',
        office_room: t.office_room || t.details?.office_room || 'N/A',
        attachments: t.attachments || [],
        isDeclining: false,
        declineReason: t.decline_reason || '',
        currentStep: Math.max(parseInt(t.current_step) || 0, (t.unit === 'SSU' || t.unit_code === 'SSU' || t.unit_id === 3) ? 5 : 6),
        assignedWorker: t.assignment?.personnel_name || t.assigned_worker || 'Unassigned',
        assignedProfession: t.assignment?.specialty || t.assignment?.profession || (t.assignments?.[0]?.specialty) || null,
        assignment: t.assignment || null,
        assignments: t.assignments || [],
        details: t.details || null,
        materials: t.materials || [],
        total_material_cost: t.total_material_cost || 0,
        implementationDate: t.assignment?.implementation_date
          ? formatDate(t.assignment.implementation_date)
          : (t.scheduled_date ? formatDate(t.scheduled_date) : null),
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
        feedback: t.feedback || null
      }));
      checkRouteTicket();
    }
  } catch (error) {
    console.error('Failed to fetch completed tickets:', error);
  }
});

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

const checkRouteTicket = () => {
  const target = route.query.ticketId || route.query.highlight;
  const triggerKey = target ? `${target}_${route.query._t || 'init'}` : null;
  if (!target) {
    handledRouteQueryKey = null;
    return;
  }
  if (handledRouteQueryKey === triggerKey) {
    return;
  }
  const match = tickets.value.find(t => 
    String(t.ticketId).toLowerCase() === String(target).toLowerCase() || 
    String(t.id).toLowerCase() === String(target).toLowerCase()
  );
  if (match) {
    handledRouteQueryKey = triggerKey;
    viewDetails(match);
  } else {
    searchQuery.value = String(target);
  }
};

watch(() => [route.query.ticketId, route.query.highlight, route.query._t], () => {
  checkRouteTicket();
});

const searchQuery = ref('');

// Pagination state
const currentPage = ref(1);
const perPage = ref(10);

watch(searchQuery, () => {
  currentPage.value = 1;
});

const filteredTickets = computed(() => {
  if (!searchQuery.value) return tickets.value;
  return tickets.value.filter(ticket => 
    ticket.ticketId.toLowerCase().includes(searchQuery.value.trim().toLowerCase())
  );
});

const totalPages = computed(() => Math.ceil(filteredTickets.value.length / perPage.value) || 1);

const paginatedTickets = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return filteredTickets.value.slice(start, start + perPage.value);
});

const displayedPages = computed(() => {
  const current = currentPage.value;
  const total = totalPages.value;
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = [];
  pages.push(1);
  if (current > 3) pages.push('...');
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
});

const showDetailsModal = ref(false);
const selectedTicket = ref(null);

const userAttachments = computed(() => {
  if (!selectedTicket.value?.attachments) return [];
  return selectedTicket.value.attachments.filter(att => {
    const name = (att.file_name || '').toLowerCase();
    return !name.includes('job request form') && !name.includes('receipt slip');
  });
});

const viewDetails = (ticket) => {
  selectedTicket.value = ticket;
  showDetailsModal.value = true;
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedTicket.value = null;
  clearRouteQueryTicket();
};

// ---- Step definitions for completed ticket tracking ----
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
    const workerText = ticket.assignedWorker && ticket.assignedWorker !== 'Unassigned' ? ` Assigned Personnel: ${ticket.assignedWorker}${ticket.assignedProfession ? ` (${ticket.assignedProfession})` : ''}.` : '';
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

const selectedTimelineTicket = ref(null);

const openTimeline = (ticket) => {
  selectedTimelineTicket.value = ticket;
};

const closeTimeline = () => {
  selectedTimelineTicket.value = null;
  clearRouteQueryTicket();
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.2);
  border-radius: 10px;
}
</style>
