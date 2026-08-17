<template>
  <MainLayout>
    <template #sidebar-links>

      <router-link to="/dispatcher/fgmu" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
        <span class="text">Ticket Queue</span>
      </router-link>
      <router-link to="/dispatcher/fgmu/workers" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span class="text">Assign Workers</span>
      </router-link>
      <router-link to="/dispatcher/fgmu/dispatched" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <span class="text">Dispatched Tickets</span>
      </router-link>
      <router-link to="/dispatcher/fgmu/archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span class="text">Archives</span>
      </router-link>
      <router-link to="/dispatcher/fgmu/project-archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span class="text">Project Archives</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">FGMU Dispatcher</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Facilities Maintenance Control</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in relative">
        
        <!-- Dispatcher Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div class="p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <div class="p-3 rounded-xl bg-amber-50 text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <span class="text-[10px] font-black text-amber-500/40 uppercase tracking-widest">Urgent</span>
            </div>
            <h3 class="text-4xl font-black text-slate-900 tabular-nums">{{ unassignedCount }}</h3>
            <p class="text-sm text-slate-500 font-bold uppercase tracking-wider">Unassigned Tickets</p>
          </div>

          <div class="p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <div class="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <span class="text-[10px] font-black text-emerald-500/40 uppercase tracking-widest">Ongoing</span>
            </div>
            <h3 class="text-4xl font-black text-slate-900 tabular-nums">{{ ongoingCount }}</h3>
            <p class="text-sm text-slate-500 font-bold uppercase tracking-wider">Active Dispatches</p>
          </div>

          <div class="p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <div class="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span class="text-[10px] font-black text-emerald-400/40 uppercase tracking-widest">Completed Requests</span>
            </div>
            <h3 class="text-4xl font-black text-slate-900 tabular-nums">{{ resolvedCount }}</h3>
            <p class="text-sm text-slate-500 font-bold uppercase tracking-wider">Resolved Tickets</p>
          </div>
        </div>

        <!-- Service Requests Table -->
        <div class="rounded-[2.5rem] bg-white border border-slate-200 p-10 overflow-hidden shadow-sm mb-8">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-2xl font-black text-slate-900 tracking-tight text-emerald-600">Approved Service Requests</h3>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left border-separate border-spacing-y-4 min-w-[750px]">
              <thead>
                <tr class="border-b border-slate-100">
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 font-bold">Ticket ID</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 font-bold">Type</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 font-bold">Requester</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 font-bold">Building</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ticket in regularTickets" :key="ticket.id" class="group transition-all duration-200">
                  <td class="py-6 px-6 bg-slate-50/60 border-y border-l border-slate-200 rounded-l-2xl group-hover:bg-white group-hover:border-emerald-500 group-hover:shadow-md transition-all">
                    <span class="text-sm font-black text-slate-900">#{{ ticket.id }}</span>
                  </td>
                  <td class="py-6 px-4 bg-slate-50/60 border-y border-slate-200 group-hover:bg-white group-hover:border-emerald-500 transition-all">
                    <div class="flex flex-col">
                      <span class="text-sm font-bold text-slate-900">{{ ticket.type }}</span>
                      <span class="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{{ ticket.location }}</span>
                    </div>
                  </td>
                  <td class="py-6 px-4 bg-slate-50/60 border-y border-slate-200 group-hover:bg-white group-hover:border-emerald-500 transition-all">
                    <span class="text-sm font-bold text-slate-700">{{ ticket.requester }}</span>
                  </td>
                  <td class="py-6 px-4 bg-slate-50/60 border-y border-slate-200 group-hover:bg-white group-hover:border-emerald-500 transition-all">
                    <div class="flex flex-col">
                      <span class="text-sm font-bold text-slate-900">{{ ticket.college_building || ticket.location || 'N/A' }}</span>
                      <span v-if="ticket.office_room" class="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{{ ticket.office_room }}</span>
                    </div>
                  </td>
                  <td class="py-6 px-6 bg-slate-50/60 border-y border-r border-slate-200 rounded-r-2xl group-hover:bg-white group-hover:border-emerald-500 group-hover:shadow-md transition-all text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button @click="openTicketModal(ticket)" class="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-colors inline-block shadow-xs">
                        Show Ticket Info
                      </button>
                      <router-link :to="'/dispatcher/fgmu/workers?ticket=' + ticket.id" class="px-4 py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors inline-block shadow-sm">
                        Assign
                      </router-link>
                    </div>
                  </td>
                </tr>
                <tr v-if="regularTickets.length === 0">
                  <td colspan="5" class="py-12 text-center text-slate-400 font-bold text-sm">No approved service requests at this moment.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Office Projects Table -->
        <div class="rounded-[2.5rem] bg-white border border-slate-200 p-10 overflow-hidden shadow-sm">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-2xl font-black text-slate-900 tracking-tight text-emerald-600">Approved Office Projects</h3>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left border-separate border-spacing-y-4 min-w-[750px]">
              <thead>
                <tr class="border-b border-slate-100">
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 font-bold">Project ID</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 font-bold">Project Title</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 font-bold">Location</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 font-bold">Funding</th>
                  <th class="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ticket in projectTickets" :key="ticket.id" class="group transition-all duration-200">
                  <td class="py-6 px-6 bg-slate-50/60 border-y border-l border-slate-200 rounded-l-2xl group-hover:bg-white group-hover:border-emerald-500 group-hover:shadow-md transition-all">
                    <span class="text-sm font-black text-slate-900">{{ formatProjectNumber ? formatProjectNumber(ticket.id) : ticket.id }}</span>
                  </td>
                  <td class="py-6 px-4 bg-slate-50/60 border-y border-slate-200 group-hover:bg-white group-hover:border-emerald-500 transition-all">
                    <div class="flex flex-col">
                      <span class="text-sm font-bold text-slate-900">{{ ticket.type }}</span>
                    </div>
                  </td>
                  <td class="py-6 px-4 bg-slate-50/60 border-y border-slate-200 group-hover:bg-white group-hover:border-emerald-500 transition-all">
                    <span class="text-sm font-bold text-slate-700">{{ ticket.location }}</span>
                  </td>
                  <td class="py-6 px-4 bg-slate-50/60 border-y border-slate-200 group-hover:bg-white group-hover:border-emerald-500 transition-all">
                    <div class="flex flex-col">
                      <span class="text-sm font-bold text-slate-900">{{ ticket.source_of_fund || 'N/A' }}</span>
                    </div>
                  </td>
                  <td class="py-6 px-6 bg-slate-50/60 border-y border-r border-slate-200 rounded-r-2xl group-hover:bg-white group-hover:border-emerald-500 group-hover:shadow-md transition-all text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button @click="openTicketModal(ticket)" class="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-colors inline-block shadow-xs">
                        Show Project Info
                      </button>
                      <router-link :to="'/dispatcher/fgmu/workers?ticket=' + ticket.id" class="px-4 py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors inline-block shadow-sm">
                        Assign
                      </router-link>
                    </div>
                  </td>
                </tr>
                <tr v-if="projectTickets.length === 0">
                  <td colspan="5" class="py-12 text-center text-slate-400 font-bold text-sm">No approved office projects at this moment.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>

    <template #modal-overlay>
      <!-- Ticket Detail Modal Overlay -->
      <div v-if="showTicketModal" class="absolute inset-0 z-[60] overflow-y-auto custom-scrollbar pointer-events-auto bg-slate-900/60 backdrop-blur-sm animate-fade-in">
        <div class="flex min-h-[100dvh] items-center justify-center p-4 md:p-8" @click.self="showTicketModal = false">
        
        <!-- Modal Content -->
        <div class="bg-[#F8FAFC] w-full max-w-4xl h-fit rounded-[3rem] shadow-2xl overflow-hidden relative z-10 animate-scale-up border border-slate-200">
          <template v-if="isProjectIdentifier(selectedTicket)">
            <div class="bg-slate-900 p-8 text-white flex justify-between items-end border-b-4 border-emerald-500 relative">
              <div>
                <span class="px-3 py-1 bg-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-3 inline-block">Project Details</span>
                <h3 class="text-3xl font-black tracking-tighter">{{ selectedTicket.type }} <span class="text-emerald-500">({{ formatProjectNumber ? formatProjectNumber(selectedTicket.id) : selectedTicket.id }})</span></h3>
                <p class="text-slate-400 mt-1 font-bold">Published on {{ selectedTicket.submittedAt }}</p>
              </div>
              <button @click="showTicketModal = false" class="absolute top-6 right-8 text-slate-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div class="p-10 space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Project Title</label>
                  <p class="text-sm font-bold text-slate-900 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">{{ selectedTicket.type }}</p>
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Location</label>
                  <p class="text-sm font-bold text-slate-900 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">{{ selectedTicket.location }}</p>
                </div>
              </div>
              <div class="space-y-3">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Project Description</label>
                <div class="w-full px-8 py-6 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm text-sm font-bold text-slate-700 leading-relaxed min-h-[120px]">
                  {{ selectedTicket.job_description }}
                </div>
              </div>
              <div v-if="selectedTicket.attachments && selectedTicket.attachments.length > 0" class="space-y-4">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Submitted Attachments</label>
                <div class="flex flex-wrap gap-3">
                  <div v-for="file in selectedTicket.attachments" :key="file.id" @click="downloadAttachment(file)" class="px-5 py-3 bg-white border border-slate-100 rounded-2xl flex items-center gap-4 shadow-sm hover:border-emerald-500 transition-colors group cursor-pointer">
                    <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <span class="text-xs font-black text-slate-800">{{ file.file_name || 'Attachment' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
          <!-- Modal Header (Mirrors FormsView aesthetic) -->
          <div class="bg-slate-900 p-8 text-white flex justify-between items-end border-b-4 border-emerald-500 relative">
            <div>
              <span class="px-3 py-1 bg-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-3 inline-block">Ticket Details</span>
              <h3 class="text-3xl font-black tracking-tighter">Facilities Request <span class="text-emerald-500">({{ selectedTicket.id }})</span></h3>
              <p class="text-slate-400 mt-1 font-bold">Submitted on {{ selectedTicket.submittedAt }}</p>
            </div>
            <button @click="showTicketModal = false" class="absolute top-6 right-8 text-slate-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-10 space-y-10">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">College / Building</label>
                <p class="text-sm font-bold text-slate-900 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">{{ selectedTicket.college_building }}</p>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Office / Room</label>
                <p class="text-sm font-bold text-slate-900 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">{{ selectedTicket.office_room }}</p>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Source of Fund</label>
                <p class="text-sm font-bold text-slate-900 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">{{ selectedTicket.source_of_fund }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Requester Name</label>
                <p class="text-sm font-bold text-slate-900 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">{{ selectedTicket.requester }}</p>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Number</label>
                <p class="text-sm font-bold text-slate-900 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">{{ selectedTicket.contact_number }}</p>
              </div>
            </div>

            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Job Description / Particulars</label>
              <div class="w-full px-8 py-6 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm text-sm font-bold text-slate-700 leading-relaxed italic min-h-[120px]">
                "{{ selectedTicket.job_description }}"
              </div>
            </div>

            <div v-if="selectedTicket.attachments && selectedTicket.attachments.length > 0" class="space-y-4">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Submitted Attachments</label>
              <div class="flex flex-wrap gap-3">
                <div v-for="file in selectedTicket.attachments" :key="file.id" @click="downloadAttachment(file)" class="px-5 py-3 bg-white border border-slate-100 rounded-2xl flex items-center gap-4 shadow-sm hover:border-emerald-500 transition-colors group cursor-pointer">
                  <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <span class="text-xs font-black text-slate-800">{{ file.file_name || 'Attachment' }}</span>
                </div>
              </div>
            </div>
          </div>

          </template>
          <!-- Footer Actions -->
          <div class="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
            <button @click="showTicketModal = false" class="px-8 py-3 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-600/20 active:scale-95">
              Close Detail View
            </button>
          </div>
        </div>
        </div>
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import api from '@/api/client';
import { formatTicketOrProjectLabel, isProjectIdentifier, formatProjectNumber } from '@/utils/projectFormatter';

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
const stats = ref({ ongoing: 0, resolved: 0 });

const regularTickets = computed(() => tickets.value.filter(t => !isProjectIdentifier(t)));
const projectTickets = computed(() => tickets.value.filter(t => isProjectIdentifier(t)));
const unassignedCount = computed(() => tickets.value.length);
const ongoingCount = computed(() => stats.value.ongoing);
const resolvedCount = computed(() => stats.value.resolved);

const fetchStats = async () => {
  try {
    const response = await api.get('tickets/stats/FGMU');
    if (response.data?.data?.stats) {
      const data = response.data.data.stats;
      stats.value.ongoing = parseInt(data.processing || 0);
      stats.value.resolved = parseInt(data.resolved || 0);
    }
  } catch (error) {
    console.error('Failed to fetch FGMU stats:', error);
  }
};

const fetchDispatchQueue = async () => {
  try {
    const response = await api.get('tickets/dispatch/FGMU');
    if (response.data?.data?.tickets) {
      tickets.value = response.data.data.tickets.map(t => ({
        id: t.id,
        title: t.title,
        service: t.service_type,
        type: t.title || t.project_title || t.service_type,
        requester: t.details?.requesting_personnel || 'End User',
        location: t.location,
        college_building: t.details?.college_building || t.location,
        office_room: t.office_room || t.details?.office_room,
        job_description: t.description,
        source_of_fund: t.details?.source_of_fund || 'N/A',
        contact_number: t.details?.contact_number || 'N/A',
        submittedAt: new Date(t.submitted_at).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        }),
        attachments: t.attachments || [],
      }));
    }
  } catch (error) {
    console.error('Failed to fetch FGMU dispatch queue:', error);
  }
};

onMounted(() => {
  fetchDispatchQueue();
  fetchStats();
});

const showTicketModal = ref(false);
const selectedTicket = ref({});

const openTicketModal = (ticket) => {
  selectedTicket.value = ticket;
  showTicketModal.value = true;
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #CBD5E1;
}

@keyframes scale-up {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.animate-scale-up {
  animation: scale-up 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
