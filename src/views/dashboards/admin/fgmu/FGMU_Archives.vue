<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/admin/fgmu" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <span class="text">FGMU Home</span>
      </router-link>
      <router-link to="/admin/fgmu/queues" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span class="text">Ticket Queues</span>
      </router-link>
      <router-link to="/admin/fgmu/personnel" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span class="text">Personnel Management</span>
      </router-link>
      <router-link to="/admin/fgmu/announcements" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
        <span class="text">Announcements</span>
      </router-link>
      <div class="mt-8 mb-4 px-4">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Archives</p>
      </div>
      <router-link to="/admin/fgmu/archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span class="text">Archived Tickets</span>
      </router-link>
      <router-link to="/admin/fgmu/project-archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span class="text">Archived Projects</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">Completed Tickets Archives</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">FGMU Archiving</p>
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
            <input v-model="searchQuery" type="text" placeholder="Search Full Ticket Number (e.g. FGMU-TIC-42-2026)" class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
          </div>
          <div class="flex gap-3 w-full md:w-auto">
            <select v-model="serviceFilter" class="w-full md:w-48 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer">
              <option value="">All Services</option>
              <option value="Equipment Maintenance">Equipment Maintenance</option>
              <option value="Carpentry Works">Carpentry Works</option>
              <option value="Plumbing Repair">Plumbing Repair</option>
            </select>
            <button @click="applyFilter" class="px-6 py-3 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 active:scale-95 transition-all text-sm whitespace-nowrap">
              Apply Filter
            </button>
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
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Requester</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Status</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Completed</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ticket in filteredTickets" :key="ticket.id" class="group transition-all duration-200">
                  <td class="py-5 px-6 bg-slate-50/60 border-y border-l border-slate-200 rounded-l-2xl group-hover:bg-white group-hover:border-emerald-500 group-hover:shadow-md transition-all">
                    <span class="text-sm font-black text-slate-900">#{{ ticket.ticketId }}</span>
                  </td>
                  <td class="py-5 px-4 bg-slate-50/60 border-y border-slate-200 group-hover:bg-white group-hover:border-emerald-500 transition-all">
                    <div class="truncate max-w-[150px] sm:max-w-xs text-sm font-bold text-slate-900" :title="ticket.title || ticket.service">{{ ticket.title || ticket.service }}</div>
                  </td>
                  <td class="py-5 px-4 bg-slate-50/60 border-y border-slate-200 group-hover:bg-white group-hover:border-emerald-500 transition-all">
                    <span class="text-sm font-bold text-slate-700">{{ ticket.requestedBy }}</span>
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
                    <button @click="viewDetails(ticket)" class="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-sm active:scale-95 inline-flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Details
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredTickets.length === 0">
                  <td colspan="6" class="p-12 text-center bg-slate-50 border border-slate-200 rounded-[2rem]">
                    <div class="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <h3 class="text-lg font-black text-slate-900 mb-1">No Archived Tickets Found</h3>
                    <p class="text-sm text-slate-500 font-medium">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>

    <template #modal-overlay>
      <!-- Read-Only Ticket Details Modal -->
      <div v-if="showDetailsModal && selectedTicket" class="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in pointer-events-auto" @click.self="closeDetailsModal">
        <div class="bg-white rounded-[2rem] p-8 max-w-2xl w-full shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-black text-slate-900">Archived Ticket Details</h3>
            <button @click="closeDetailsModal" class="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full transition-colors active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
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
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Requested By</p>
                <p class="text-base font-semibold text-slate-900">{{ selectedTicket.requestedBy }}</p>
              </div>
              <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Service Type</p>
                <p class="text-base font-semibold text-slate-900">{{ selectedTicket.title || selectedTicket.service }}</p>
              </div>
              <div v-if="selectedTicket.workingDays">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Target Duration</p>
                <p class="text-base font-semibold text-emerald-800">{{ selectedTicket.workingDays }} Working Day(s)</p>
              </div>
              <div :class="{ 'col-span-2': !selectedTicket.workingDays }">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Location / Office</p>
                <p class="text-base font-semibold text-slate-900">{{ selectedTicket.location }} - {{ selectedTicket.office_room }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Job Particulars / Description</p>
                <div class="p-4 bg-white border border-slate-200 rounded-xl">
                  <p class="text-sm font-medium text-slate-700 leading-relaxed">{{ selectedTicket.description }}</p>
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
                  End-User Service Feedback
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
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Additional Remarks</p>
                    <p class="text-sm font-medium text-slate-600 italic">"{{ selectedTicket.feedback.remarks }}"</p>
                  </div>
                </div>
              </div>

              <!-- Dedicated Materials Used & Receipt Section -->
              <div class="col-span-2 mt-2">
                <div class="flex items-center justify-between mb-2">
                  <p class="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    Receipt of Materials Used
                  </p>
                  <button
                    type="button"
                    @click="openReceiptModal(selectedTicket)"
                    class="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    <span>View / Print Receipt Slip</span>
                  </button>
                </div>

                <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div v-if="!selectedTicket.materials || selectedTicket.materials.length === 0" class="p-4 text-center text-xs text-slate-500 italic bg-slate-50">
                    Labor & maintenance service only (No materials consumed).
                  </div>
                  <div v-else>
                    <table class="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr class="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          <th class="py-2.5 px-3">Item Description</th>
                          <th class="py-2.5 px-3 text-center">Qty</th>
                          <th class="py-2.5 px-3 text-right">Unit Price</th>
                          <th class="py-2.5 px-3 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-100">
                        <tr v-for="(mat, mIdx) in selectedTicket.materials" :key="mIdx" class="hover:bg-slate-50/50">
                          <td class="py-2 px-3 font-semibold text-slate-800">{{ mat.material_name || mat.name }}</td>
                          <td class="py-2 px-3 text-center font-medium text-slate-600">{{ mat.quantity }} {{ mat.unit_measurement || mat.unit || '' }}</td>
                          <td class="py-2 px-3 text-right font-medium text-slate-600">₱{{ formatPrice(mat.unit_price) }}</td>
                          <td class="py-2 px-3 text-right font-bold text-slate-900">₱{{ formatPrice(mat.total_price || (mat.quantity * mat.unit_price)) }}</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr class="bg-emerald-50/70 border-t border-emerald-100 font-bold">
                          <td colspan="3" class="py-2.5 px-3 text-right text-[10px] uppercase tracking-wider text-emerald-800">Total Material Cost:</td>
                          <td class="py-2.5 px-3 text-right text-xs font-black text-emerald-800">₱{{ formatPrice(selectedTicket.total_material_cost) }}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>

              <!-- Attachments / Photos -->
              <div v-if="selectedTicket.attachments && selectedTicket.attachments.length > 0" class="col-span-2 mt-2">
                 <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Attachments / Photos</p>
                 <div class="flex flex-col gap-2">
                   <a v-for="att in selectedTicket.attachments" :key="att.id" @click.prevent="downloadAttachment(att)" class="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-emerald-500 transition-colors shadow-sm cursor-pointer group">
                     <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                       </svg>
                     </div>
                     <div class="flex flex-col overflow-hidden">
                        <span class="text-xs font-bold text-slate-700 truncate group-hover:text-emerald-700 transition-colors">{{ att.file_name || 'Attachment' }}</span>
                        <span class="text-[10px] font-bold text-slate-400 uppercase">{{ att.file_size_bytes ? (att.file_size_bytes / 1024).toFixed(1) + ' KB' : 'Unknown Size' }}</span>
                     </div>
                   </a>
                 </div>
              </div>
            </div>

            <!-- Read Only Notice -->
            <div class="p-4 bg-slate-100 rounded-xl border border-slate-200 flex items-center gap-3 text-slate-500">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <p class="text-xs font-semibold">This ticket is archived and viewable in read-only mode for record-keeping purposes.</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Image Viewer Modal -->
      <div v-if="showImageModal" class="absolute inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in pointer-events-auto" @click.self="closeImageModal">
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

      <!-- Material Receipt Modal -->
      <MaterialReceiptModal
        v-model:isOpen="showReceiptModal"
        :ticket="selectedReceiptTicket"
      />
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import MaterialReceiptModal from '@/components/MaterialReceiptModal.vue';
import api from '@/api/client';

const tickets = ref([]);

const showImageModal = ref(false);
const selectedImageUrl = ref('');

const showReceiptModal = ref(false);
const selectedReceiptTicket = ref(null);

const openReceiptModal = (ticket) => {
  selectedReceiptTicket.value = ticket;
  showReceiptModal.value = true;
};

const formatPrice = (val) => {
  return Number(val || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

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
    if (att.file_type && att.file_type.startsWith('image/')) {
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

const fetchArchives = async () => {
  try {
    const response = await api.get('tickets/archives/FGMU');
    if (response.data?.data?.tickets) {
      tickets.value = response.data.data.tickets.map(t => ({
        id: t.id,
        ticketId: t.id,
        title: t.title,
        service: t.service_type,
        service_type: t.service_type,
        description: t.description,
        date: new Date(t.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        completed_at: t.completed_at || t.updated_at,
        requestedBy: t.details?.end_user || t.requested_by || 'End User',
        status: t.status,
        statusLabel: t.status_label,
        declineReason: t.decline_reason || '',
        location: t.location || t.details?.college_building || 'N/A',
        office_room: t.office_room || t.details?.office_room || 'N/A',
        attachments: t.attachments || [],
        assignedWorker: t.assignment?.personnel_name || t.assignments?.[0]?.assigned_to_name || 'Unassigned',
        assignment: t.assignment || null,
        details: t.details || null,
        materials: t.materials || [],
        total_material_cost: t.total_material_cost || 0,
        workingDays: t.working_days || t.project_working_days || t.assignment?.working_days || null,
        feedback: t.feedback || null,
        unit_code: 'FGMU',
        unit_id: 1,
      }));
    }
  } catch (error) {
    console.error('Failed to fetch FGMU archives:', error);
  }
};

onMounted(() => {
  fetchArchives();
});

const searchQuery = ref('');
const serviceFilter = ref('');
const activeSearchQuery = ref('');
const activeServiceFilter = ref('');

const showDetailsModal = ref(false);
const selectedTicket = ref(null);

const applyFilter = () => {
  activeSearchQuery.value = searchQuery.value.trim().toLowerCase();
  activeServiceFilter.value = serviceFilter.value;
};

const filteredTickets = computed(() => {
  return tickets.value.filter(ticket => {
    let match = true;
    
    if (activeSearchQuery.value) {
      match = match && ticket.ticketId.toLowerCase().includes(activeSearchQuery.value);
    }
    
    if (activeServiceFilter.value) {
      match = match && ticket.service === activeServiceFilter.value;
    }
    
    return match;
  });
});

const viewDetails = (ticket) => {
  selectedTicket.value = ticket;
  showDetailsModal.value = true;
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedTicket.value = null;
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
