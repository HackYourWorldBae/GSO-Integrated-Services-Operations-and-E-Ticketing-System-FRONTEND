<template>
  <MainLayout>
    <template #sidebar-links>

      <router-link to="/dispatcher/tasu" class="nav-item active">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
        <span class="text">Trip Requests</span>
      </router-link>
      <router-link to="/dispatcher/tasu/drivers" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span class="text">Assign Drivers</span>
      </router-link>
      <router-link to="/dispatcher/tasu/dispatched" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <span class="text">Dispatched Trips</span>
      </router-link>
      <router-link to="/dispatcher/tasu/archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span class="text">Archives</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">Driver Assignment</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">TASU Logistics</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in">
        
        <!-- Selected Trip Header -->
        <div v-if="selectedTrip" class="p-8 rounded-[2rem] bg-emerald-50 border border-emerald-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-5xl mx-auto">
          <div class="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          
          <div class="relative z-10">
            <div class="flex items-center gap-3 mb-2">
              <span class="px-3 py-1 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Assigning To</span>
              <span class="text-sm font-black text-emerald-700">#{{ selectedTrip.id }}</span>
            </div>
            <h3 class="text-2xl font-black text-slate-900 tracking-tight">{{ selectedTrip.destination }}</h3>
            <p class="text-emerald-700 font-medium text-sm mt-1">{{ selectedTrip.date }} | {{ selectedTrip.time }}</p>
          </div>

          <div class="relative z-10 flex gap-4 md:items-center">
              <div class="flex items-center gap-2 bg-emerald-100/60 rounded-xl px-3.5 py-2 border border-emerald-200 self-center">
                <span class="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Form Trip Date:</span>
                <span class="text-xs font-black text-emerald-950">{{ selectedTrip.date }}</span>
              </div>
              <button @click="openTicketModal(selectedTrip)" class="px-5 py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-black text-[10px] uppercase tracking-widest rounded-xl transition-colors shadow-sm self-center">Review Ticket</button>
             <router-link to="/dispatcher/tasu" class="p-3 bg-white hover:bg-slate-900 hover:text-white text-slate-600 rounded-xl transition-all shadow-sm border border-emerald-100 items-center justify-center flex self-center">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
             </router-link>
          </div>
        </div>

        <div v-else class="p-12 rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-center max-w-5xl mx-auto">
           <div class="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center mb-6">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
           </div>
           <h3 class="text-2xl font-black text-slate-900 mb-3 tracking-tight">No Trip Selected</h3>
           <p class="text-slate-500 font-medium max-w-sm">Please return to the trip queue and click "Assign Driver" on a specific trip to dispatch vehicles.</p>
           <router-link to="/dispatcher/tasu" class="mt-8 px-8 py-3 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/20 active:scale-95">Return to Trip Queue</router-link>
        </div>

        <!-- ② Current Assignments Panel (between trip header and driver list) -->
        <div v-if="selectedTrip && currentAssignments.length > 0" class="p-8 rounded-[2.5rem] bg-slate-900 shadow-xl overflow-hidden relative max-w-5xl mx-auto">
          <div class="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div class="flex items-center justify-between mb-6 relative z-10">
            <h3 class="text-white font-black text-xl flex items-center gap-3">
              <span class="w-2 h-6 bg-blue-400 rounded-full"></span>
              Current Assignments for #{{ selectedTrip.id }}
            </h3>
            <span class="px-3 py-1 bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-500/30">
              {{ currentAssignments.length }} Assigned
            </span>
          </div>
          <div class="space-y-3 relative z-10">
            <div v-for="assign in currentAssignments" :key="assign.driverId"
              class="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm gap-4">
              <div class="flex items-center gap-5">
                <div class="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black shrink-0">
                  {{ assign.driverName.charAt(0) }}
                </div>
                <div>
                  <span class="text-white font-bold block">{{ assign.driverName }}</span>
                  <span class="text-[10px] font-medium text-blue-400 uppercase tracking-widest">Assigned to #{{ assign.tripId }}</span>
                </div>
              </div>
              <div class="flex items-center gap-4 flex-wrap">
                <div class="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span class="text-[10px] font-black text-slate-300 uppercase tracking-widest">{{ assign.implementationDate || 'No date set' }}</span>
                </div>
                <button @click="removeAssignment(assign)" class="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors border border-white/5 hover:border-rose-500/30">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          </div>
          <div class="mt-8 flex justify-end relative z-10 border-t border-white/10 pt-8">
            <button @click="dispatchAll" class="px-8 py-3 bg-emerald-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Dispatch Assigned Drivers
            </button>
          </div>
        </div>

        <!-- ③ Driver Pool -->
        <div class="space-y-6 max-w-5xl mx-auto">
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between mb-8 flex-wrap gap-4">
              <h3 class="text-xl font-black text-slate-900 flex items-center gap-3">
                <span class="w-2 h-6 bg-emerald-500 rounded-full"></span>
                Available Drivers
              </h3>
              <div class="flex items-center gap-6 flex-wrap">
                <div class="flex gap-3 flex-wrap">
                  <span class="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Available</span>
                  <span class="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><span class="w-2 h-2 rounded-full bg-blue-500"></span> Assigned</span>
                  <span class="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><span class="w-2 h-2 rounded-full bg-amber-500"></span> On Trip</span>
                  <span class="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><span class="w-2 h-2 rounded-full bg-slate-400"></span> On Leave</span>
                </div>
                <div class="h-6 w-[1px] bg-slate-200"></div>
                <button @click="isManagementMode = !isManagementMode"
                  :class="['px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border', isManagementMode ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300']">
                  {{ isManagementMode ? 'Exit Management' : 'Manage Status' }}
                </button>
              </div>
            </div>

            <div v-if="isManagementMode" class="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl animate-fade-in">
              <p class="text-[10px] font-bold text-emerald-700 uppercase tracking-widest flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Management Mode Active: Click on status badges to toggle between Available and On Leave.
              </p>
            </div>

            <div class="space-y-8">
              <div v-for="(driversGroup, role) in groupedPersonnel" :key="role">
                <h4 class="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {{ role }}s
                  <span class="text-[9px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{{ driversGroup.length }}</span>
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="driver in driversGroup" :key="driver.id"
                    :class="['p-6 rounded-3xl border transition-all flex flex-col gap-3 group',
                      driver.status === 'On Trip' ? 'border-amber-200 bg-amber-50/50' :
                      driver.assignedTicket ? 'border-blue-200 bg-blue-50/30' :
                      'border-slate-100 hover:border-emerald-200 hover:shadow-md']">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-4">
                        <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-colors',
                          driver.status === 'On Trip' ? 'bg-amber-100 text-amber-600' :
                          driver.assignedTicket ? 'bg-blue-100 text-blue-600' :
                          'bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500']">
                          {{ driver.name.charAt(0) }}
                        </div>
                        <div>
                          <h4 class="font-bold text-slate-900">{{ driver.name }}</h4>
                          <p class="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{{ driver.role }}</p>
                        </div>
                      </div>
                      <span @click="toggleManagementStatus(driver)"
                        :class="['flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all',
                          isManagementMode && !driver.assignedTicket && driver.status !== 'On Trip' ? 'cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-emerald-500 active:scale-95' : '',
                          driver.status === 'On Trip' ? 'bg-amber-50 text-amber-600' :
                          driver.assignedTicket ? 'bg-blue-50 text-blue-600' :
                          driver.status === 'Available' ? 'bg-emerald-50 text-emerald-600' :
                          'bg-slate-100 text-slate-500']">
                        <span :class="['w-1.5 h-1.5 rounded-full animate-pulse',
                          driver.status === 'On Trip' ? 'bg-amber-500' :
                          driver.assignedTicket ? 'bg-blue-500' :
                          driver.status === 'Available' ? 'bg-emerald-500' : 'bg-slate-400']"></span>
                        {{ driver.status === 'On Trip' ? 'On Trip' : driver.assignedTicket ? `Assigned to #${driver.assignedTicket}` : driver.status }}
                      </span>
                    </div>
                    <div v-if="driver.assignedTicket" class="flex items-center gap-2 text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      Trip Date: {{ driver.implementationDate }}
                    </div>
                    <div v-if="!isManagementMode && driver.status === 'Available' && !driver.assignedTicket && selectedTrip"
                      class="flex items-center gap-2 pt-1 border-t border-slate-100">
                      <button @click="assignDriver(driver)"
                        class="py-2.5 px-4 w-full rounded-xl bg-slate-900 text-white hover:bg-emerald-600 transition-colors shadow-lg shadow-slate-200 active:scale-95 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest" title="Assign driver">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                        Assign to Trip
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
          <div class="bg-slate-900 p-8 text-white flex justify-between items-end border-b-4 border-emerald-500">
            <div>
              <span class="px-3 py-1 bg-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-3 inline-block">Trip Request</span>
              <h3 class="text-3xl font-black tracking-tighter">{{ modalTicket?.destination }} <span class="text-emerald-500">({{ modalTicket?.id }})</span></h3>
              <p class="text-slate-400 mt-1 font-bold">Planned Date: {{ modalTicket?.date }} | Time: {{ modalTicket?.time }}</p>
            </div>
            <button @click="showTicketModal = false" class="absolute top-6 right-8 text-slate-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-10 space-y-10">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Requester Name</label>
                <p class="text-sm font-bold text-slate-900 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">{{ modalTicket?.requester }}</p>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Requesting Office</label>
                <p class="text-sm font-bold text-slate-900 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">{{ modalTicket?.office }}</p>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">No. of Passengers</label>
                <p class="text-sm font-bold text-slate-900 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">{{ modalTicket?.passengers }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-3">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Places to be visited</label>
                <div class="w-full px-6 py-5 rounded-2xl bg-white border border-slate-100 shadow-sm text-sm font-bold text-slate-700 leading-relaxed min-h-[80px]">
                  {{ modalTicket?.places_to_visit }}
                </div>
              </div>
              <div class="space-y-3">
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date of Trip</label>
                <p class="text-sm font-bold text-slate-900 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">{{ modalTicket?.date }}</p>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Time of Departure</label>
                <p class="text-sm font-bold text-slate-900 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">{{ modalTicket?.time }}</p>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Expected Time of Return</label>
                <p class="text-sm font-bold text-slate-900 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">{{ modalTicket?.return_time }}</p>
              </div>
            </div>

            <div v-if="modalTicket?.attachments && modalTicket?.attachments.length > 0" class="space-y-4">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Attached Documents</label>
              <div class="flex flex-wrap gap-3">
                <div v-for="file in modalTicket?.attachments" :key="typeof file === 'string' ? file : file.id" @click="downloadAttachment(file)" class="px-5 py-3 bg-white border border-slate-100 rounded-2xl flex items-center gap-4 shadow-sm hover:border-emerald-500 transition-colors group cursor-pointer">
                  <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <span class="text-xs font-black text-slate-800">{{ typeof file === 'string' ? file : (file.file_name || 'Attachment') }}</span>
                </div>
              </div>
            </div>
          </div>

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
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import { useTasuPersonnelStore } from '@/stores/tasuPersonnel';
import { toast } from 'vue3-toastify';
import api from '@/api/client';

const downloadAttachment = async (att) => {
  // att can be a plain filename string (mock data) or a full attachment object from the API
  if (typeof att === 'string') return;
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

const route = useRoute();
const store = useTasuPersonnelStore();

const showTicketModal = ref(false);
const modalTicket = ref(null);
const isManagementMode = ref(false);
const pendingDates = reactive({});

const openTicketModal = (trip) => {
  modalTicket.value = trip;
  showTicketModal.value = true;
};

const mockTrips = ref([
  { id: 'TASU-TIC-11', destination: 'City Campus', date: 'Oct 28, 2026', time: '08:00 AM', return_time: '12:00 PM', requester: 'OVP-Academic', office: 'Office of VP for Academics', passengers: 4, places_to_visit: 'City Campus Main Building, College of Nursing', purpose: 'Accreditation Visit Evaluation', attachments: ['Travel_Order.pdf'], implementationDate: '' },
  { id: 'TASU-TIC-12', destination: 'South Field', date: 'Oct 28, 2026', time: '10:30 AM', return_time: '04:00 PM', requester: 'COA Auditor', office: 'Commission on Audit', passengers: 2, places_to_visit: 'South Field Extension, Agronomy Dept', purpose: 'On-site facilities inventory check', attachments: ['COA_Memo.pdf'], implementationDate: '' },
  { id: 'TASU-TIC-13', destination: 'Regional Office', date: 'Oct 29, 2026', time: '07:00 AM', return_time: '06:00 PM', requester: 'University President', office: 'Office of the President', passengers: 3, places_to_visit: 'CHED Regional Office', purpose: 'Annual Planning Conference', attachments: ['Invitation_CHED.pdf'], implementationDate: '' },
]);

const groupedPersonnel = computed(() => store.groupedPersonnel);
const selectedTrip = ref(null);

const currentAssignments = computed(() => {
  if (!selectedTrip.value) return [];
  return store.personnel.filter(d => d.assignedTicket === selectedTrip.value.id).map(d => ({
    driverId: d.id, driverName: d.name, tripId: d.assignedTicket, implementationDate: d.implementationDate,
  }));
});

const toggleManagementStatus = (driver) => {
  if (!isManagementMode.value || driver.status === 'On Trip' || driver.assignedTicket) return;
  store.toggleWorkerStatus(driver.id);
};

onMounted(() => {
  const tripId = route.query.trip;
  selectedTrip.value = tripId ? mockTrips.value.find(t => t.id === tripId) ?? null : null;
  store.fetchPersonnel();
});

const assignDriver = (driver) => {
  if (!selectedTrip.value) return;
  const dateStr = selectedTrip.value.date || 'Oct 28, 2026';
  store.assignWorker(driver.id, selectedTrip.value.id, dateStr);
  toast.success(`${driver.name} assigned to ${selectedTrip.value.id}`);
};

const removeAssignment = (assign) => {
  store.unassignWorker(assign.driverId);
  toast.info(`Removed assignment for ${assign.driverName}`);
};

const dispatchAll = () => {
  if (!selectedTrip.value) return;
  currentAssignments.value.forEach(a => store.startWork(a.driverId));
  const trip = mockTrips.value.find(t => t.id === selectedTrip.value.id);
  if (trip) trip.status = 'Dispatched';
  toast.success(`All drivers dispatched for ${selectedTrip.value.id}!`);
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
