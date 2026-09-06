<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/admin/leau" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <span class="text">LEAU Home</span>
      </router-link>
      <router-link to="/admin/leau/queues" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span class="text">Ticket Queues</span>
      </router-link>
      <router-link to="/admin/leau/personnel" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span class="text">Personnel Management</span>
      </router-link>
      <router-link to="/admin/leau/announcements" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
        <span class="text">Announcements</span>
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
      <router-link to="/admin/leau/project-archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span class="text">Archived Projects</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none">Ticket Queues</h2>
          <span class="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider border border-amber-200">
            {{ tickets.length }} Pending
          </span>
        </div>
        <p class="text-[10px] text-amber-600 font-extrabold tracking-[0.2em] uppercase mt-1">LEAU Admin Approval Queue</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-6 animate-fade-in relative pb-12">

        <!-- Controls: Search & Filters -->
        <div class="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <!-- Search input -->
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              @input="currentPage = 1"
              type="text"
              placeholder="Search by ticket ID, requester, service, or location..."
              class="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''; currentPage = 1"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Service Filter & Refresh -->
          <div class="flex items-center gap-2 shrink-0">
            <select
              v-model="selectedServiceFilter"
              @change="currentPage = 1"
              class="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-all"
            >
              <option value="">All Services</option>
              <option v-for="service in serviceCategories" :key="service" :value="service">
                {{ service }}
              </option>
            </select>

            <button
              @click="fetchQueue"
              :disabled="isLoading"
              class="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all flex items-center justify-center disabled:opacity-50"
              title="Refresh Queue"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{ 'animate-spin': isLoading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        <!-- ======================= DESKTOP TABULAR VIEW ======================= -->
        <div class="hidden md:block bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200">
                  <th class="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500">Ticket Reference</th>
                  <th class="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500">Requester</th>
                  <th class="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500">Service & Nature of Work</th>
                  <th class="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500">Location / Area</th>
                  <th class="px-4 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500 text-center">Files</th>
                  <th class="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <!-- Loading State -->
                <tr v-if="isLoading && tickets.length === 0">
                  <td colspan="6" class="py-16 text-center">
                    <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-xs font-semibold">
                      <svg class="animate-spin h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading pending ticket queue...
                    </div>
                  </td>
                </tr>

                <!-- Empty State -->
                <tr v-else-if="paginatedTickets.length === 0">
                  <td colspan="6" class="py-16 text-center">
                    <div class="max-w-sm mx-auto flex flex-col items-center">
                      <div class="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p class="text-sm font-bold text-slate-700">No Pending Tickets in Queue</p>
                      <p class="text-xs text-slate-400 mt-1">All groundskeeping and landscaping requests have been approved or processed.</p>
                    </div>
                  </td>
                </tr>

                <!-- Data Rows -->
                <tr
                  v-for="ticket in paginatedTickets"
                  :key="ticket.id"
                  class="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                  @click="openDetailsModal(ticket)"
                >
                  <!-- Ticket Reference -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                      #{{ ticket.ticketId }}
                    </div>
                    <div class="text-[11px] font-medium text-slate-400 mt-1 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ ticket.date }}
                    </div>
                  </td>

                  <!-- Requester -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-2.5">
                      <div class="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {{ getInitials(ticket.requestedBy) }}
                      </div>
                      <div>
                        <div class="text-xs font-bold text-slate-800 leading-tight">
                          {{ ticket.requestedBy }}
                        </div>
                        <div class="text-[10px] text-slate-400 font-medium">
                          {{ ticket.email || (ticket.student_id_number ? `ID: ${ticket.student_id_number}` : 'Requester') }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Service & Scope -->
                  <td class="px-6 py-4">
                    <div class="text-xs font-bold text-slate-900 leading-snug">
                      {{ ticket.title || ticket.service }}
                    </div>
                    <div class="text-[11px] text-slate-500 line-clamp-1 max-w-xs mt-0.5 font-normal">
                      {{ ticket.description || 'No particulars specified' }}
                    </div>
                  </td>

                  <!-- Location / Area -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-xs font-bold text-slate-700">
                      {{ ticket.location || 'Main Campus' }}
                    </div>
                    <div class="text-[11px] text-slate-400 font-medium">
                      {{ ticket.office_room ? `Room/Zone: ${ticket.office_room}` : 'Campus Grounds' }}
                    </div>
                  </td>

                  <!-- Attachments -->
                  <td class="px-4 py-4 whitespace-nowrap text-center">
                    <span
                      v-if="ticket.attachments && ticket.attachments.length > 0"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                      @click.stop="openDetailsModal(ticket)"
                      title="View Attachments"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      {{ ticket.attachments.length }}
                    </span>
                    <span v-else class="text-slate-300 text-xs font-medium">—</span>
                  </td>

                  <!-- Actions -->
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <div class="inline-flex items-center gap-1.5" @click.stop>
                      <button
                        @click="openDetailsModal(ticket)"
                        class="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="View Full Details"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>

                      <button
                        @click="initiateApproval(ticket)"
                        class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1 active:scale-95"
                        title="Approve Ticket"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Approve</span>
                      </button>

                      <button
                        @click="openDeclineModal(ticket)"
                        class="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all flex items-center gap-1 active:scale-95"
                        title="Decline Ticket"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Decline</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Footer -->
          <div class="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <span class="text-xs text-slate-500 font-medium">
                Showing <strong class="text-slate-800">{{ paginationRange.start }}</strong> to
                <strong class="text-slate-800">{{ paginationRange.end }}</strong> of
                <strong class="text-slate-800">{{ filteredTickets.length }}</strong> pending tickets
              </span>
              <select
                v-model="perPage"
                @change="currentPage = 1"
                class="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none focus:border-amber-500"
              >
                <option :value="10">10 per page</option>
                <option :value="15">15 per page</option>
                <option :value="25">25 per page</option>
                <option :value="50">50 per page</option>
              </select>
            </div>

            <div class="flex items-center gap-1.5">
              <button
                @click="changePage(currentPage - 1)"
                :disabled="currentPage <= 1"
                class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <div class="px-3 py-1.5 text-xs font-bold text-slate-600">
                Page {{ currentPage }} of {{ totalPages }}
              </div>
              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage >= totalPages"
                class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <!-- ======================= MOBILE CARD VIEW (STACK) ======================= -->
        <div class="md:hidden space-y-4">
          <div
            v-for="ticket in paginatedTickets"
            :key="ticket.id"
            class="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4"
          >
            <!-- Top Row: ID & Date -->
            <div class="flex items-center justify-between">
              <span class="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                #{{ ticket.ticketId }}
              </span>
              <span class="text-[11px] font-medium text-slate-400">
                {{ ticket.date }}
              </span>
            </div>

            <!-- Title & Service -->
            <div>
              <h4 class="text-sm font-black text-slate-900 leading-snug">
                {{ ticket.title || ticket.service }}
              </h4>
              <p class="text-xs text-slate-500 line-clamp-2 mt-1">
                {{ ticket.description || 'No particulars specified' }}
              </p>
            </div>

            <!-- Requester & Location Meta -->
            <div class="grid grid-cols-2 gap-2 text-xs p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Requester</span>
                <span class="font-bold text-slate-800 truncate block">{{ ticket.requestedBy }}</span>
              </div>
              <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Location</span>
                <span class="font-bold text-slate-800 truncate block">{{ ticket.location || 'Main Campus' }}</span>
              </div>
              <div v-if="ticket.office_room" class="col-span-2 pt-1 border-t border-slate-200/60">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Room / Area</span>
                <span class="font-semibold text-slate-700">{{ ticket.office_room }}</span>
              </div>
            </div>

            <!-- Attachments Link if any -->
            <div v-if="ticket.attachments && ticket.attachments.length > 0" class="flex items-center gap-1.5 text-xs text-amber-600 font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <span>{{ ticket.attachments.length }} Attached file(s)</span>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                @click="openDetailsModal(ticket)"
                class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 text-center"
              >
                Inspect
              </button>
              <button
                @click="initiateApproval(ticket)"
                class="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider text-center shadow-xs"
              >
                Approve
              </button>
              <button
                @click="openDeclineModal(ticket)"
                class="px-3 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-100"
              >
                Decline
              </button>
            </div>
          </div>

          <!-- Mobile Pagination -->
          <div v-if="filteredTickets.length > 0" class="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span class="text-xs text-slate-500 font-medium">Page {{ currentPage }} of {{ totalPages }}</span>
            <div class="flex items-center gap-2">
              <button
                @click="changePage(currentPage - 1)"
                :disabled="currentPage <= 1"
                class="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-bold disabled:opacity-40"
              >
                Prev
              </button>
              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage >= totalPages"
                class="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-bold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- ======================= TICKET DETAILS MODAL ======================= -->
      <div
        v-if="selectedTicketForModal"
        class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        @click.self="selectedTicketForModal = null"
      >
        <div class="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 animate-scale-up space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
          <!-- Modal Header -->
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <div class="flex items-center gap-2.5">
              <div class="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <span class="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  #{{ selectedTicketForModal.ticketId }}
                </span>
                <h3 class="text-base font-black text-slate-900 mt-1">{{ selectedTicketForModal.title || selectedTicketForModal.service }}</h3>
              </div>
            </div>
            <button
              @click="selectedTicketForModal = null"
              class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="space-y-4 text-xs">
            <!-- Requester Details Card -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Requester Details</span>
              <div class="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span class="text-slate-400 text-[11px] block">Full Name:</span>
                  <span class="font-bold text-slate-800 text-sm">{{ selectedTicketForModal.requestedBy }}</span>
                </div>
                <div>
                  <span class="text-slate-400 text-[11px] block">Submitted Date:</span>
                  <span class="font-semibold text-slate-700">{{ selectedTicketForModal.date }}</span>
                </div>
                <div v-if="selectedTicketForModal.email">
                  <span class="text-slate-400 text-[11px] block">Email:</span>
                  <span class="font-semibold text-slate-700">{{ selectedTicketForModal.email }}</span>
                </div>
                <div v-if="selectedTicketForModal.contact">
                  <span class="text-slate-400 text-[11px] block">Contact Number:</span>
                  <span class="font-semibold text-slate-700">{{ selectedTicketForModal.contact }}</span>
                </div>
              </div>
            </div>

            <!-- Location Details -->
            <div class="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Location / Zone</span>
                <span class="font-bold text-slate-800">{{ selectedTicketForModal.location || 'Main Campus' }}</span>
              </div>
              <div>
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Room / Area</span>
                <span class="font-bold text-slate-800">{{ selectedTicketForModal.office_room || 'Campus Grounds' }}</span>
              </div>
            </div>

            <!-- Nature of Work & Job Particulars -->
            <div>
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Service Type</span>
              <div class="p-3 rounded-xl bg-white border border-slate-200 font-bold text-slate-800">
                {{ selectedTicketForModal.service }}
              </div>
            </div>

            <div>
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Job Particulars / Description</span>
              <div class="p-4 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs leading-relaxed whitespace-pre-wrap">
                {{ selectedTicketForModal.description || 'No description provided.' }}
              </div>
            </div>

            <!-- Attachments -->
            <div v-if="selectedTicketForModal.attachments && selectedTicketForModal.attachments.length > 0">
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">Attachments ({{ selectedTicketForModal.attachments.length }})</span>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div
                  v-for="(file, idx) in selectedTicketForModal.attachments"
                  :key="idx"
                  @click="downloadAttachment(file)"
                  class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 cursor-pointer transition-all group"
                >
                  <div class="flex items-center gap-2 truncate">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span class="text-xs font-semibold text-slate-700 group-hover:text-amber-800 truncate">
                      {{ file.file_name || 'Attachment' }}
                    </span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 group-hover:text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer Actions -->
          <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              @click="selectedTicketForModal = null"
              class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              Close
            </button>
            <div class="flex items-center gap-2">
              <button
                @click="openDeclineModal(selectedTicketForModal); selectedTicketForModal = null"
                class="px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all"
              >
                Decline Request
              </button>
              <button
                @click="initiateApproval(selectedTicketForModal); selectedTicketForModal = null"
                class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>Approve Request</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ======================= APPROVE CONFIRMATION MODAL ======================= -->
      <div v-if="showConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 animate-scale-up space-y-6">
          <div class="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div class="text-center">
            <h3 class="text-xl font-black text-slate-900">Approve Service Request?</h3>
            <p class="text-xs text-slate-500 font-medium mt-1">
              Ticket <strong class="text-slate-800">#{{ ticketToApprove?.ticketId }}</strong> will be approved and queued for groundskeeper dispatch.
            </p>
          </div>
          <div class="flex gap-3">
            <button
              @click="closeConfirmModal"
              class="w-full px-5 py-3 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              @click="confirmApproval"
              class="w-full px-5 py-3 bg-emerald-600 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all active:scale-95"
            >
              Confirm Approval
            </button>
          </div>
        </div>
      </div>

      <!-- ======================= DECLINE MODAL ======================= -->
      <div v-if="ticketToDecline" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 animate-scale-up space-y-5">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <div class="p-2 rounded-xl bg-rose-50 text-rose-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 class="text-base font-black text-slate-900">Decline Request</h3>
            </div>
            <button @click="ticketToDecline = null" class="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div>
            <p class="text-xs text-slate-600 mb-2">
              Please provide a clear reason for declining ticket <strong class="text-slate-800">#{{ ticketToDecline.ticketId }}</strong>. This will be transmitted to the requester:
            </p>
            <textarea
              v-model="declineReasonInput"
              rows="4"
              placeholder="e.g., Incomplete specifications, outside jurisdiction, or redundant request..."
              class="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none"
            ></textarea>
          </div>

          <div class="flex gap-3">
            <button
              @click="ticketToDecline = null"
              class="w-full px-5 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              :disabled="!declineReasonInput.trim()"
              @click="confirmDecline"
              class="w-full px-5 py-2.5 bg-rose-600 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-rose-600/20 hover:bg-rose-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </div>

    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import { toast } from 'vue3-toastify';
import api from '@/api/client';
import { LEAU_SERVICES } from '@/constants/services';

const route = useRoute();
const tickets = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');
const selectedServiceFilter = ref('');

// Pagination state
const currentPage = ref(1);
const perPage = ref(15);

// Modals
const showConfirmModal = ref(false);
const ticketToApprove = ref(null);
const ticketToDecline = ref(null);
const declineReasonInput = ref('');
const selectedTicketForModal = ref(null);

let pollingInterval = null;

// All official services from Services page plus any additional loaded from tickets
const serviceCategories = computed(() => {
  const set = new Set(LEAU_SERVICES);
  tickets.value.forEach(t => {
    if (t.service && t.service.trim()) set.add(t.service.trim());
  });
  return Array.from(set);
});

// Filtered tickets based on search & category
const filteredTickets = computed(() => {
  let list = tickets.value;

  if (selectedServiceFilter.value) {
    const target = selectedServiceFilter.value.trim().toLowerCase();
    list = list.filter(t => {
      const s = (t.service || t.service_type || '').trim().toLowerCase();
      return s === target;
    });
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(t => 
      (t.ticketId && String(t.ticketId).toLowerCase().includes(q)) ||
      (t.requestedBy && t.requestedBy.toLowerCase().includes(q)) ||
      (t.service && t.service.toLowerCase().includes(q)) ||
      (t.title && t.title.toLowerCase().includes(q)) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      (t.location && t.location.toLowerCase().includes(q)) ||
      (t.office_room && t.office_room.toLowerCase().includes(q))
    );
  }

  return list;
});

// Paginated subset
const totalPages = computed(() => Math.max(1, Math.ceil(filteredTickets.value.length / perPage.value)));

const paginatedTickets = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return filteredTickets.value.slice(start, start + perPage.value);
});

const paginationRange = computed(() => {
  if (filteredTickets.value.length === 0) return { start: 0, end: 0 };
  const start = (currentPage.value - 1) * perPage.value + 1;
  const end = Math.min(currentPage.value * perPage.value, filteredTickets.value.length);
  return { start, end };
});

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const fetchQueue = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('tickets/queue/LEAU');
    if (response.data?.data?.tickets) {
      tickets.value = response.data.data.tickets.map(t => {
        const requesterName = t.first_name || t.last_name 
          ? `${t.first_name || ''} ${t.last_name || ''}`.trim() 
          : 'End User';
        return {
          id: t.id,
          ticketId: t.id,
          title: t.title,
          service: t.service_type,
          description: t.description,
          date: t.submitted_at 
            ? new Date(t.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'N/A',
          requestedBy: requesterName,
          email: t.email || '',
          contact: t.requester_contact || '',
          student_id_number: t.student_id_number || '',
          location: t.location || t.college_building,
          office_room: t.office_room,
          attachments: t.attachments || [],
        };
      });
      checkRouteQueryTicket();
    }
  } catch (error) {
    console.error('Failed to fetch LEAU queue:', error);
  } finally {
    isLoading.value = false;
  }
};

const checkRouteQueryTicket = () => {
  const targetId = route.query.ticketId || route.query.highlight;
  if (!targetId) return;
  const match = tickets.value.find(t => 
    String(t.ticketId).toLowerCase() === String(targetId).toLowerCase() || 
    String(t.id).toLowerCase() === String(targetId).toLowerCase()
  );
  if (match) {
    selectedTicketForModal.value = match;
  } else {
    searchQuery.value = String(targetId);
  }
};

watch(() => [route.query.ticketId, route.query._t], () => {
  checkRouteQueryTicket();
});

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

const openDetailsModal = (ticket) => {
  selectedTicketForModal.value = ticket;
};

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
      toast.success(`Approved ticket #${ticketToApprove.value.ticketId}`);
      closeConfirmModal();
      fetchQueue();
    } catch (error) {
      toast.error('Failed to approve ticket');
    }
  }
};

const openDeclineModal = (ticket) => {
  ticketToDecline.value = ticket;
  declineReasonInput.value = '';
};

const confirmDecline = async () => {
  if (ticketToDecline.value && declineReasonInput.value.trim()) {
    try {
      await api.patch(`tickets/${ticketToDecline.value.id}/decline`, { decline_reason: declineReasonInput.value.trim() });
      toast.error(`Declined ticket #${ticketToDecline.value.ticketId}`);
      ticketToDecline.value = null;
      fetchQueue();
    } catch (error) {
      toast.error('Failed to decline ticket');
    }
  }
};

onMounted(() => {
  fetchQueue();
  pollingInterval = setInterval(() => {
    if (document.hidden) return;
    const isInteracting = !!(showConfirmModal.value || ticketToDecline.value || selectedTicketForModal.value);
    if (!isInteracting) {
      fetchQueue();
    }
  }, 10000);
});

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval);
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
</style>
