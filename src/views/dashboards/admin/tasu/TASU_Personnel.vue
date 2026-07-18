<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/admin/tasu" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        <span class="text">TASU Home</span>
      </router-link>
      <router-link to="/admin/tasu/vehicles" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
        <span class="text">Vehicle Management</span>
      </router-link>
      <router-link to="/admin/tasu/queues" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span class="text">Ticket Queues</span>
      </router-link>
      <router-link to="/admin/tasu/personnel" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span class="text">Personnel Management</span>
      </router-link>
      <router-link to="/admin/tasu/dispatch" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="text">Dispatch Board</span>
      </router-link>
      <div class="mt-8 mb-4 px-4">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Archived Tickets</p>
      </div>
      <router-link to="/admin/tasu/archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span class="text">Archives</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">Personnel Management & Driver Assignment</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">TASU Driver Oversight & Trip Deployment</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in pb-16">
        
        <!-- Top Stats Overview -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="p-5 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
            <div class="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total TASU Drivers</p>
              <p class="text-2xl font-black text-slate-900 tabular-nums leading-none">{{ allDrivers.length }}</p>
              <p class="text-[10px] font-bold text-emerald-600 mt-1">Professional Roster</p>
            </div>
          </div>

          <div class="p-5 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
            <div class="p-3.5 rounded-2xl bg-blue-50 text-blue-600 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Available For Duty</p>
              <p class="text-2xl font-black text-slate-900 tabular-nums leading-none">{{ availableDrivers.length }}</p>
              <p class="text-[10px] font-bold text-blue-600 mt-1">Ready for assignment</p>
            </div>
          </div>

          <div class="p-5 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
            <div class="p-3.5 rounded-2xl bg-amber-50 text-amber-600 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Deployed On Trip</p>
              <p class="text-2xl font-black text-slate-900 tabular-nums leading-none">{{ onTripDrivers.length }}</p>
              <p class="text-[10px] font-bold text-amber-600 mt-1">Active transit duty</p>
            </div>
          </div>

          <div class="p-5 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
            <div class="p-3.5 rounded-2xl bg-rose-50 text-rose-600 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Unassigned Trips</p>
              <p class="text-2xl font-black text-slate-900 tabular-nums leading-none">{{ unassignedBookings.length }}</p>
              <p class="text-[10px] font-bold text-rose-600 mt-1">Pending driver choice</p>
            </div>
          </div>
        </div>

        <!-- Navigation Tabs Container -->
        <div class="bg-white p-3 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-full sm:w-auto">
            <button 
              @click="activeTab = 'assign'"
              :class="['px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2', activeTab === 'assign' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-slate-500 hover:text-slate-900']"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              <span>Assign Drivers to Trips</span>
              <span v-if="unassignedBookings.length > 0" class="ml-1 px-2 py-0.5 rounded-full text-[10px]" :class="activeTab === 'assign' ? 'bg-white/20 text-white' : 'bg-rose-500 text-white'">{{ unassignedBookings.length }}</span>
            </button>

            <button 
              @click="activeTab = 'status'"
              :class="['px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2', activeTab === 'status' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-slate-500 hover:text-slate-900']"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Driver Availability Roster</span>
            </button>
          </div>

          <div class="px-4 py-2 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span class="text-[11px] font-bold text-emerald-800">Vehicle bookings have pre-selected units; assign drivers directly here.</span>
          </div>
        </div>

        <!-- ========================================================= -->
        <!-- TAB 1: ASSIGN DRIVERS TO TRIPS TAB -->
        <!-- ========================================================= -->
        <div v-if="activeTab === 'assign'" class="space-y-8 animate-fade-in">
          
          <div class="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
              <div>
                <span class="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-2">Central Driver Deployment</span>
                <h3 class="text-2xl font-black text-slate-900 tracking-tight">Active & Pending Trip Dispatch Queue</h3>
                <p class="text-xs text-slate-500 font-bold mt-1">Assign professional drivers from the roster to scheduled vehicle trips requested on the services page.</p>
              </div>

              <div class="flex items-center gap-3">
                <input v-model="searchTripQuery" type="text" placeholder="Search destination, requestor..." class="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                <select v-model="filterAssignedStatus" class="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-none">
                  <option value="All">All Trip Dispatches</option>
                  <option value="Unassigned">Unassigned Trips Only</option>
                  <option value="Assigned">Assigned Trips Only</option>
                </select>
              </div>
            </div>

            <!-- List of Trips Needing / Having Drivers -->
            <div v-if="filteredBookings.length === 0" class="p-12 text-center rounded-3xl bg-slate-50 border border-dashed border-slate-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h4 class="text-base font-black text-slate-800">No matching trip dispatches found</h4>
              <p class="text-xs font-bold text-slate-400 mt-1">Adjust your filters or schedule new trips from the Dispatch Board.</p>
            </div>

            <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div 
                v-for="booking in filteredBookings" 
                :key="booking.id"
                :class="['p-6 rounded-3xl border shadow-sm transition-all relative flex flex-col justify-between', !booking.driver ? 'bg-amber-50/30 border-amber-300 hover:shadow-md' : 'bg-white border-slate-200 hover:shadow-md']"
              >
                <div>
                  <div class="flex items-start justify-between gap-4 mb-4">
                    <div class="flex items-center gap-2">
                      <span :class="['px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border', !booking.driver ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-emerald-50 text-emerald-700 border-emerald-200']">
                        {{ !booking.driver ? '⚠️ Unassigned' : '🧑 Assigned' }}
                      </span>
                      <span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-widest">
                        Trip #{{ booking.id }}
                      </span>
                    </div>
                    <span :class="['px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white', getStatusStyle(booking.status)]">
                      {{ booking.status }}
                    </span>
                  </div>

                  <h4 class="text-lg font-black text-slate-900 leading-tight mb-2">{{ booking.destination }}</h4>
                  
                  <!-- Requested Vehicle info (Chosen by Requestor) -->
                  <div class="p-3.5 rounded-2xl bg-slate-100/70 border border-slate-200/80 mb-4 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-lg shadow-2xs shrink-0">🚗</div>
                      <div>
                        <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Requested Vehicle (Pre-booked)</span>
                        <p class="text-xs font-black text-slate-800">{{ getVehicleName(booking.vehicleId) }}</p>
                      </div>
                    </div>
                    <span class="px-2 py-1 rounded-md bg-white text-emerald-700 border border-slate-200 text-[10px] font-black tracking-wider">
                      {{ getVehiclePlate(booking.vehicleId) }}
                    </span>
                  </div>

                  <div class="grid grid-cols-2 gap-3 mb-5 text-xs font-bold text-slate-600">
                    <div class="flex items-center gap-2">
                      <span class="text-slate-400">📅</span>
                      <span>{{ booking.date }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-slate-400">⏰</span>
                      <span>{{ booking.time }}</span>
                    </div>
                    <div class="flex items-center gap-2 col-span-2">
                      <span class="text-slate-400">🏢</span>
                      <span class="truncate">Requestor: <strong class="text-slate-900">{{ booking.requestor }}</strong></span>
                    </div>
                  </div>
                </div>

                <!-- Driver Assignment Box -->
                <div class="pt-5 border-t border-slate-100 mt-2">
                  <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Assign / Change Professional Driver</label>
                  <div class="flex items-center gap-2">
                    <select 
                      v-model="bookingDrivers[booking.id]" 
                      class="flex-1 p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    >
                      <option value="">-- No Driver Assigned --</option>
                      <option v-for="d in availableDriversForSelection(booking.driver)" :key="d.id" :value="d.name">
                        🧑 {{ d.name }} ({{ d.status }})
                      </option>
                    </select>
                    
                    <button 
                      @click="saveDriverAssignment(booking)"
                      class="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-500/20 transition-all shrink-0 active:scale-95"
                    >
                      Save Driver
                    </button>
                  </div>

                  <div v-if="booking.driver" class="mt-2.5 flex items-center justify-between text-[10px] font-bold text-slate-500">
                    <span>Currently: <strong class="text-emerald-700 font-black">{{ booking.driver }}</strong></span>
                    <button @click="unassignDriverFromBooking(booking)" class="text-rose-500 hover:underline font-black">Remove Driver</button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <!-- ========================================================= -->
        <!-- TAB 2: DRIVER AVAILABILITY ROSTER TAB -->
        <!-- ========================================================= -->
        <div v-if="activeTab === 'status'" class="space-y-6 animate-fade-in">
          <div class="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h3 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <span class="w-2 h-6 bg-emerald-500 rounded-full"></span>
                  Driver Duty & Availability Roster
                </h3>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Manage duty status for all TASU professional drivers</p>
              </div>
              <div class="flex gap-4">
                <span class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Available
                </span>
                <span class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span class="w-2 h-2 rounded-full bg-amber-500"></span> On Trip
                </span>
                <span class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span class="w-2 h-2 rounded-full bg-slate-300"></span> On Leave
                </span>
              </div>
            </div>

            <div class="space-y-8">
              <div v-for="(driversGroup, role) in groupedPersonnel" :key="role">
                <h4 class="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {{ role }}s
                  <span class="text-[9px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{{ driversGroup.length }}</span>
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div 
                    v-for="driver in driversGroup" 
                    :key="driver.id" 
                    class="p-6 rounded-3xl border border-slate-300 shadow-sm bg-slate-50/50 group hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div class="flex items-start justify-between mb-4">
                        <div class="flex items-center gap-4">
                          <div class="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors font-black text-lg">
                            🧑
                          </div>
                          <div>
                            <h4 class="text-sm font-black text-slate-900 leading-none mb-1">{{ driver.name }}</h4>
                            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ driver.role }}</p>
                          </div>
                        </div>
                        <div class="flex flex-col items-end">
                           <span 
                            @click="toggleDriverStatus(driver)"
                            :class="[
                              'flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-emerald-500 active:scale-95',
                              driver.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 
                              driver.status === 'On Trip' ? 'bg-amber-50 text-amber-600' : 'bg-slate-200 text-slate-500'
                            ]">
                            <span :class="[
                              'w-1.5 h-1.5 rounded-full animate-pulse',
                              driver.status === 'Available' ? 'bg-emerald-500' : 
                              driver.status === 'On Trip' ? 'bg-amber-500' : 'bg-slate-400'
                            ]"></span>
                            {{ driver.status }}
                          </span>
                        </div>
                      </div>

                      <!-- Current Assigned Trip Preview if any -->
                      <div v-if="getDriverActiveTrip(driver.name)" class="mt-3 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs">
                        <p class="text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-0.5">Currently Assigned To Trip</p>
                        <p class="font-black text-slate-800 truncate">{{ getDriverActiveTrip(driver.name).destination }}</p>
                        <p class="text-[9px] font-bold text-slate-500 mt-0.5">{{ getDriverActiveTrip(driver.name).date }} • {{ getVehiclePlate(getDriverActiveTrip(driver.name).vehicleId) }}</p>
                      </div>
                    </div>
                    
                    <div class="pt-4 border-t border-slate-200 mt-4">
                      <div class="flex items-center justify-between text-[10px] font-bold">
                        <span class="text-slate-400 uppercase tracking-widest">Duty Action:</span>
                        <button 
                          @click="toggleDriverStatus(driver)"
                          class="text-emerald-600 hover:text-emerald-700 transition-colors font-black underline underline-offset-4"
                          :disabled="driver.status === 'On Trip'"
                        >
                          {{ driver.status === 'On Leave' ? 'Mark Available' : 'Set to On Leave' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import { useTasuPersonnelStore } from '@/stores/tasuPersonnel';
import { useTasuVehiclesStore } from '@/stores/tasuVehicles';
import { toast } from 'vue3-toastify';

const activeTab = ref('assign'); // 'assign' or 'status'
const searchTripQuery = ref('');
const filterAssignedStatus = ref('All');

const personnelStore = useTasuPersonnelStore();
const vehiclesStore = useTasuVehiclesStore();

const allDrivers = computed(() => personnelStore.personnel);
const groupedPersonnel = computed(() => personnelStore.groupedPersonnel);
const availableDrivers = computed(() => allDrivers.value.filter(d => d.status === 'Available'));
const onTripDrivers = computed(() => allDrivers.value.filter(d => d.status === 'On Trip'));

const allBookings = computed(() => vehiclesStore.bookings);
const allVehicles = computed(() => vehiclesStore.vehicles);

const unassignedBookings = computed(() => allBookings.value.filter(b => !b.driver || b.driver === ''));

// Local dictionary to hold selected driver for each booking
const bookingDrivers = reactive({});

// Populate initial booking drivers
const initBookingDrivers = () => {
  allBookings.value.forEach(b => {
    if (bookingDrivers[b.id] === undefined) {
      bookingDrivers[b.id] = b.driver || '';
    }
  });
};
initBookingDrivers();
watch(() => allBookings.value, () => { initBookingDrivers(); }, { deep: true });

// Filtered Bookings for the Assign Drivers tab
const filteredBookings = computed(() => {
  return allBookings.value.filter(b => {
    const matchesSearch = searchTripQuery.value === '' || 
      b.destination.toLowerCase().includes(searchTripQuery.value.toLowerCase()) ||
      b.requestor.toLowerCase().includes(searchTripQuery.value.toLowerCase());
    
    if (filterAssignedStatus.value === 'Unassigned') {
      return matchesSearch && (!b.driver || b.driver === '');
    }
    if (filterAssignedStatus.value === 'Assigned') {
      return matchesSearch && b.driver && b.driver !== '';
    }
    return matchesSearch;
  });
});

const availableDriversForSelection = (currentAssignedDriver) => {
  // Return all drivers who are Available plus the currently assigned one so it shows up
  return allDrivers.value.filter(d => d.status === 'Available' || d.name === currentAssignedDriver);
};

const saveDriverAssignment = (booking) => {
  const selectedDriverName = bookingDrivers[booking.id];
  vehiclesStore.updateBooking(booking.id, { driver: selectedDriverName });
  
  if (selectedDriverName) {
    const driverObj = allDrivers.value.find(d => d.name === selectedDriverName);
    if (driverObj) {
      personnelStore.assignWorker(driverObj.id, booking.id, booking.date);
    }
    toast.success(`Assigned driver ${selectedDriverName} to trip #${booking.id}`);
  } else {
    toast.info(`Cleared driver assignment for trip #${booking.id}`);
  }
};

const unassignDriverFromBooking = (booking) => {
  bookingDrivers[booking.id] = '';
  vehiclesStore.updateBooking(booking.id, { driver: '' });
  toast.info(`Removed driver from trip #${booking.id}`);
};

const toggleDriverStatus = (driver) => {
  if (driver.status === 'On Trip') {
    alert('Cannot change status of a driver who is currently on a trip.');
    return;
  }
  personnelStore.toggleWorkerStatus(driver.id);
  toast.success(`Updated status for ${driver.name} to ${driver.status === 'Available' ? 'On Leave' : 'Available'}`);
};

// Helpers for vehicle display
const getVehicleName = (vId) => {
  const v = allVehicles.value.find(item => item.id === vId);
  return v ? v.name : 'Shuttle Bus #1';
};

const getVehiclePlate = (vId) => {
  const v = allVehicles.value.find(item => item.id === vId);
  return v ? v.plate : 'SBA-1234';
};

const getDriverActiveTrip = (driverName) => {
  return allBookings.value.find(b => b.driver === driverName && (b.status === 'Scheduled' || b.status === 'In Progress'));
};

const getStatusStyle = (status) => {
  switch (status) {
    case 'Completed': return 'bg-emerald-600';
    case 'In Progress': return 'bg-amber-500 animate-pulse';
    case 'Scheduled': return 'bg-blue-600';
    case 'Cancelled': return 'bg-rose-500';
    default: return 'bg-slate-600';
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
