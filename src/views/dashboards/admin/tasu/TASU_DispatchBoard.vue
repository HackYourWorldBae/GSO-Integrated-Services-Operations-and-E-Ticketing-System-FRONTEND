<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/admin/tasu" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span class="text">TASU Home</span>
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
      <router-link to="/admin/tasu/vehicles" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
        <span class="text">Vehicle Management</span>
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
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">Dispatch Board</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Active Vehicle Departures &amp; Trip Schedule</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in pb-16">
        
        <!-- Top Stats Overview (4 Column Metric Cards) -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="p-5 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
            <div class="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Fleet Units</p>
              <p class="text-2xl font-black text-slate-900 tabular-nums leading-none">{{ allVehicles.length }}</p>
              <p class="text-[10px] font-bold text-emerald-600 mt-1">{{ availableVehiclesCount }} Available</p>
            </div>
          </div>

          <div class="p-5 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
            <div class="p-3.5 rounded-2xl bg-amber-50 text-amber-600 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active On Trip</p>
              <p class="text-2xl font-black text-slate-900 tabular-nums leading-none">{{ inTransitCount }}</p>
              <p class="text-[10px] font-bold text-amber-600 mt-1">Currently on route</p>
            </div>
          </div>

          <div class="p-5 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
            <div class="p-3.5 rounded-2xl bg-blue-50 text-blue-600 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Scheduled Trips</p>
              <p class="text-2xl font-black text-slate-900 tabular-nums leading-none">{{ scheduledDispatchesCount }}</p>
              <p class="text-[10px] font-bold text-blue-600 mt-1">Dispatched &amp; ready</p>
            </div>
          </div>

          <div class="p-5 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
            <div class="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Available Drivers</p>
              <p class="text-2xl font-black text-slate-900 tabular-nums leading-none">{{ availableDriversCount }} / {{ drivers.length }}</p>
              <p class="text-[10px] font-bold text-indigo-600 mt-1">Ready for assignment</p>
            </div>
          </div>
        </div>

        <!-- Active Trip Departures Control Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2.25rem] border border-slate-200 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 block">Fleet Departures &amp; Itineraries</span>
              <h3 class="text-xl font-black text-slate-900 tracking-tight">Active Dispatched &amp; Approved Trips</h3>
            </div>
          </div>

          <!-- Search & Filter Controls -->
          <div class="flex flex-wrap items-center gap-3">
            <!-- Filter Tabs -->
            <div class="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60">
              <button 
                @click="activeTab = 'all'" 
                :class="['px-3.5 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all', activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900']"
              >
                All ({{ activeTrips.length }})
              </button>
              <button 
                @click="activeTab = 'in_progress'" 
                :class="['px-3.5 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all', activeTab === 'in_progress' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-500 hover:text-slate-900']"
              >
                On Route ({{ inTransitCount }})
              </button>
              <button 
                @click="activeTab = 'scheduled'" 
                :class="['px-3.5 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all', activeTab === 'scheduled' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-900']"
              >
                Dispatched ({{ scheduledDispatchesCount }})
              </button>
            </div>

            <!-- Search input -->
            <div class="relative min-w-[220px]">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Search trip, plate, driver..." 
                class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- ========================================================= -->
        <!-- ACTIVE DISPATCHES & DEPARTURE CARDS GRID -->
        <!-- ========================================================= -->
        
        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm gap-3">
          <div class="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading active departures &amp; trip information...</p>
        </div>

        <!-- Empty State (No Active Trips) -->
        <div v-else-if="filteredTrips.length === 0" class="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div class="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100 shadow-xs">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 class="text-lg font-black text-slate-900 tracking-tight">No Active Trips at this time</h4>
          <p class="text-xs text-slate-500 max-w-md font-medium mt-1">All university fleet vehicles are currently parked in the motor pool or no pending departures match your search.</p>
          <div class="mt-6 flex items-center gap-3">
            <router-link to="/admin/tasu/queues" class="px-5 py-2.5 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm">
              Check Ticket Queues
            </router-link>
            <router-link to="/admin/tasu/vehicles" class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider rounded-xl transition-all">
              Fleet Units List
            </router-link>
          </div>
        </div>

        <!-- Active Trip Rows List -->
        <div v-else class="space-y-4">
          <div 
            v-for="trip in filteredTrips" 
            :key="trip.id"
            class="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all p-6 sm:p-7 flex flex-col xl:flex-row xl:items-center justify-between gap-6 group"
          >
            <!-- Left Section: Vehicle Image & Vehicle Info -->
            <div class="flex items-center gap-5 min-w-[280px] xl:max-w-[340px] shrink-0">
              <!-- Vehicle Thumbnail -->
              <div class="relative w-22 h-22 sm:w-26 sm:h-26 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-xs flex items-center justify-center">
                <img v-if="trip.vehicleImage" :src="trip.vehicleImage" :alt="trip.vehicleName" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div v-else class="flex flex-col items-center justify-center text-slate-300 p-2 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H12a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7h4a1 1 0 01.8.4l3 4A1 1 0 0122 12v3a1 1 0 01-1 1h-.05a2.5 2.5 0 01-4.9 0H14V7z" />
                  </svg>
                </div>
                <span class="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-slate-900/85 backdrop-blur-xs text-[10px] font-black text-white uppercase tracking-wider">
                  {{ trip.vehicleCategory || 'Transport' }}
                </span>
              </div>

              <!-- Vehicle Details -->
              <div class="space-y-1.5 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-lg text-xs font-black tracking-wider uppercase">
                    {{ trip.vehiclePlate }}
                  </span>
                  <span class="text-xs font-bold text-slate-400">#{{ trip.id }}</span>
                </div>
                <h4 class="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                  {{ trip.vehicleName }}
                </h4>
                <div class="flex items-center gap-1.5 text-xs">
                  <span class="font-bold text-slate-400">Driver:</span>
                  <span :class="trip.driver && trip.driver !== 'Unassigned' ? 'text-slate-800 font-black' : 'text-amber-600 font-bold'">
                    {{ trip.driver || 'Unassigned' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Middle Section: Destination, Departure Date, Requestor Name & Requesting College -->
            <div class="flex-1 space-y-4 xl:border-l xl:border-r xl:border-slate-100 xl:px-8 py-1 min-w-0">
              <!-- Destination & Status Pill -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-center gap-2.5 min-w-0">
                  <div class="p-2 rounded-xl bg-rose-50 text-rose-600 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <h3 class="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
                    {{ trip.destination }}
                  </h3>
                </div>
                
                <span :class="['px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border shadow-2xs inline-flex items-center gap-2 self-start sm:self-auto shrink-0', getTripStatusBadge(trip.status)]">
                  <span class="w-2 h-2 rounded-full" :class="isOnRoute(trip) ? 'bg-amber-500 animate-ping' : 'bg-blue-500'"></span>
                  {{ trip.status }}
                </span>
              </div>

              <!-- Information Grid: Departure Date, Requestor Name, Requesting College -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <!-- Departure Date -->
                <div class="flex items-start gap-3 p-3.5 bg-slate-50/90 rounded-2xl border border-slate-100/90">
                  <div class="p-2 rounded-xl bg-white text-emerald-600 shadow-2xs shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Departure Date</span>
                    <span class="text-sm font-black text-slate-800 block break-words">{{ formatTripDate(trip.date) }}</span>
                  </div>
                </div>

                <!-- Requestor Name -->
                <div class="flex items-start gap-3 p-3.5 bg-slate-50/90 rounded-2xl border border-slate-100/90">
                  <div class="p-2 rounded-xl bg-white text-blue-600 shadow-2xs shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Requestor Name</span>
                    <span class="text-sm font-black text-slate-800 block break-words">{{ trip.requestorName }}</span>
                  </div>
                </div>

                <!-- Requesting College / Office & Passengers -->
                <div class="flex items-start gap-3 p-3.5 bg-slate-50/90 rounded-2xl border border-slate-100/90">
                  <div class="p-2 rounded-xl bg-white text-indigo-600 shadow-2xs shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Requesting College / Office</span>
                    <span class="text-sm font-black text-slate-800 block break-words">
                      {{ trip.requestingCollege }}
                      <span class="text-xs font-bold text-slate-500 block mt-0.5">({{ trip.passengers }} passengers)</span>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Purpose Note Snippet (if available) -->
              <div v-if="trip.notes" class="text-xs sm:text-sm text-slate-600 bg-slate-50/80 px-4 py-2.5 rounded-2xl border border-slate-100/90 leading-relaxed">
                <span class="font-black text-slate-700">Purpose / Details:</span> {{ trip.notes }}
              </div>
            </div>

            <!-- Right Section: Action Button -->
            <div class="flex items-center justify-end shrink-0 pt-3 xl:pt-0 border-t xl:border-t-0 border-slate-100">
              <button 
                @click="openBookingDetails(trip)" 
                class="w-full xl:w-48 px-5 py-3.5 bg-slate-900 hover:bg-emerald-600 text-white text-xs sm:text-sm font-black uppercase tracking-wider rounded-2xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>View Trip Details</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- ========================================================= -->
        <!-- FLEET QUICK STATUS & AVAILABILITY AT MOTOR POOL -->
        <!-- ========================================================= -->
        <div class="p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div class="flex items-center gap-3">
              <div class="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h4 class="text-base font-black text-slate-900 tracking-tight">University Fleet Status Summary</h4>
                <p class="text-xs text-slate-500 font-medium">Quick motor pool inventory overview of all registered TASU vehicles</p>
              </div>
            </div>

            <router-link to="/admin/tasu/vehicles" class="text-xs font-black text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
              <span>Manage Vehicles Fleet</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
            </router-link>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            <div 
              v-for="v in allVehicles" 
              :key="v.id" 
              class="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100/60 transition-all flex flex-col justify-between"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-[9px] font-black text-slate-600 uppercase">{{ v.plate }}</span>
                <span :class="['w-2 h-2 rounded-full', v.status === 'Available' ? 'bg-emerald-500' : (v.status === 'In Use' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500')]"></span>
              </div>
              <h6 class="text-xs font-black text-slate-900 truncate" :title="v.name">{{ v.name }}</h6>
              <span class="text-[8px] font-bold text-slate-400 uppercase mt-0.5">{{ v.category }} • {{ v.status }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- ========================================================= -->
      <!-- TRIP DETAILS & VIEWING MODAL -->
      <!-- ========================================================= -->
      <div v-if="selectedBooking" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
        <div class="bg-white rounded-[2.5rem] p-8 max-w-xl w-full shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
          <button @click="selectedBooking = null" class="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <div class="mb-6">
            <div class="flex items-center gap-2 mb-3">
              <span :class="['px-3.5 py-1 text-xs font-black uppercase tracking-widest rounded-full border shadow-2xs', getTripStatusBadge(selectedBooking.status)]">
                {{ selectedBooking.status }}
              </span>
              <span class="px-3 py-1 text-xs font-black uppercase tracking-widest rounded-full bg-slate-100 text-slate-600">
                Ticket #{{ selectedBooking.id }}
              </span>
            </div>
            <h3 class="text-2xl font-black text-slate-900 leading-tight">{{ selectedBooking.destination }}</h3>
            <p class="text-sm font-bold text-emerald-600 uppercase tracking-widest mt-1">{{ selectedBooking.vehicleName }} • Plate: {{ selectedBooking.vehiclePlate }}</p>
          </div>

          <div class="space-y-4">
            <!-- Departure Date & Passengers -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex items-start gap-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div class="p-2.5 bg-white rounded-xl text-emerald-600 shadow-2xs shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div class="min-w-0">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Date of Departure</p>
                  <p class="text-base font-black text-slate-900 break-words">{{ formatTripDate(selectedBooking.date) }}</p>
                </div>
              </div>

              <div class="flex items-start gap-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div class="p-2.5 bg-white rounded-xl text-amber-600 shadow-2xs shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <div class="min-w-0">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Passenger Count</p>
                  <p class="text-base font-black text-slate-900">{{ selectedBooking.passengers || 1 }} Persons</p>
                </div>
              </div>
            </div>

            <!-- Requestor Name & Requesting College/Office -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex items-start gap-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div class="p-2.5 bg-white rounded-xl text-blue-600 shadow-2xs shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div class="min-w-0">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Requestor Name</p>
                  <p class="text-sm font-black text-slate-900 break-words">{{ selectedBooking.requestorName }}</p>
                </div>
              </div>

              <div class="flex items-start gap-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div class="p-2.5 bg-white rounded-xl text-indigo-600 shadow-2xs shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <div class="min-w-0">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Requesting College / Office</p>
                  <p class="text-sm font-black text-slate-900 break-words">{{ selectedBooking.requestingCollege }}</p>
                </div>
              </div>
            </div>

            <!-- Assigned Driver Status -->
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-4">
              <div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Assigned University Driver</p>
                <p class="text-sm font-black text-slate-900">
                  <span v-if="selectedBooking.driver && selectedBooking.driver !== 'Unassigned'">{{ selectedBooking.driver }}</span>
                  <span v-else class="text-amber-600 font-bold">Unassigned Driver</span>
                </p>
              </div>
              <router-link 
                to="/admin/tasu/personnel" 
                class="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-black uppercase tracking-wider transition-all border border-emerald-200/60 shrink-0 flex items-center gap-1 active:scale-95"
              >
                <span>Personnel Roster</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </router-link>
            </div>

            <div v-if="selectedBooking.notes" class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Trip Particulars / Purpose</p>
              <p class="text-sm font-medium text-slate-700 leading-relaxed">{{ selectedBooking.notes }}</p>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-slate-100 flex items-center justify-end">
            <button @click="selectedBooking = null" class="w-full sm:w-auto px-8 py-3 bg-slate-900 hover:bg-emerald-600 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-sm active:scale-95">
              Close Trip Details
            </button>
          </div>
        </div>
      </div>

    </template>
  </MainLayout>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import { useTasuVehiclesStore } from '@/stores/tasuVehicles';
import { useTasuPersonnelStore } from '@/stores/tasuPersonnel';
import api from '@/api/client';

const vehiclesStore = useTasuVehiclesStore();
const personnelStore = useTasuPersonnelStore();

// Fleet and Personnel data
const allVehicles = computed(() => vehiclesStore.vehicles);
const drivers = computed(() => personnelStore.personnel);
const activeTrips = ref([]);
const isLoading = ref(true);

// Selected trip modal
const selectedBooking = ref(null);

// Search & Filter State
const searchQuery = ref('');
const activeTab = ref('all'); // 'all' | 'in_progress' | 'scheduled'

// Helper status matchers
const isOnRoute = (trip) => {
  const s = (trip?.status || '').toLowerCase();
  const raw = (trip?.rawStatus || '').toLowerCase();
  return s.includes('route') || s.includes('in progress') || s.includes('started') || raw === 'in_progress' || raw === 'on_trip';
};

const isScheduled = (trip) => {
  const s = (trip?.status || '').toLowerCase();
  const raw = (trip?.rawStatus || '').toLowerCase();
  return s.includes('dispatch') || s.includes('waiting') || s.includes('schedul') || s.includes('approv') || raw === 'processing' || raw === 'approved';
};

// Computed Counts
const availableVehiclesCount = computed(() => allVehicles.value.filter(v => v.status === 'Available').length);
const availableDriversCount = computed(() => drivers.value.filter(d => d.status === 'Available').length);
const inTransitCount = computed(() => activeTrips.value.filter(t => isOnRoute(t)).length);
const scheduledDispatchesCount = computed(() => activeTrips.value.filter(t => !isOnRoute(t) && isScheduled(t)).length);

// Filtered Trips based on active tab and search query
const filteredTrips = computed(() => {
  return activeTrips.value.filter(trip => {
    // Tab Filter
    let matchesTab = true;
    if (activeTab.value === 'in_progress') {
      matchesTab = isOnRoute(trip);
    } else if (activeTab.value === 'scheduled') {
      matchesTab = !isOnRoute(trip) && isScheduled(trip);
    }

    // Search Query Filter
    const q = searchQuery.value.toLowerCase().trim();
    const matchesSearch = !q ||
      (trip.destination || '').toLowerCase().includes(q) ||
      (trip.vehicleName || '').toLowerCase().includes(q) ||
      (trip.vehiclePlate || '').toLowerCase().includes(q) ||
      (trip.requestorName || '').toLowerCase().includes(q) ||
      (trip.requestingCollege || '').toLowerCase().includes(q) ||
      (trip.driver || '').toLowerCase().includes(q) ||
      String(trip.id || '').toLowerCase().includes(q);

    return matchesTab && matchesSearch;
  });
});

const formatTripDate = (dateVal) => {
  if (!dateVal) return 'Date Pending';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return dateVal;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateVal;
  }
};

const getTripStatusBadge = (status) => {
  const s = (status || '').toLowerCase();
  if (s.includes('route') || s.includes('in progress') || s.includes('started')) {
    return 'bg-amber-50 text-amber-700 border-amber-200 font-black';
  }
  if (s.includes('dispatch') || s.includes('waiting') || s.includes('schedul')) {
    return 'bg-blue-50 text-blue-700 border-blue-200 font-black';
  }
  if (s.includes('approv')) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-black';
  }
  return 'bg-slate-100 text-slate-700 border-slate-200 font-bold';
};

const openBookingDetails = (trip) => {
  selectedBooking.value = trip;
};

const fetchActiveTrips = async () => {
  isLoading.value = true;
  try {
    const [dispatchRes, activeTicketsRes, queueRes] = await Promise.allSettled([
      api.get('tasu/dispatch'),
      api.get('tickets/active/TASU'),
      api.get('tickets/dispatch/TASU')
    ]);

    const tripsMap = new Map();

    // 1. Process tasu/dispatch data
    if (dispatchRes.status === 'fulfilled' && dispatchRes.value.data?.data?.dispatch) {
      const raw = dispatchRes.value.data.data.dispatch;
      raw.forEach(item => {
        if (item.ticket_id) {
          let dateStr = item.date_of_travel || item.implementation_date || item.submitted_at || '';
          if (dateStr.includes('T')) dateStr = dateStr.split('T')[0];

          const status = item.status_label || (item.booking_status === 'processing' ? 'Dispatched - Waiting for Departure' : 'Approved');

          tripsMap.set(String(item.ticket_id), {
            id: item.ticket_id,
            vehicleId: item.vehicle_id,
            vehicleName: item.model_name || 'Vehicle Unit',
            vehiclePlate: item.plate_no || 'Plate N/A',
            vehicleCategory: item.category || 'Van',
            vehicleImage: item.image_url,
            date: dateStr,
            destination: item.destination || 'University Travel',
            requestorName: item.requesting_personnel || 'Requestor Pending',
            requestingCollege: item.office_college_department || item.agency_address || 'University Office',
            driver: item.assigned_driver || 'Unassigned',
            passengers: item.num_passengers || 1,
            status: status,
            rawStatus: item.booking_status || 'processing',
            notes: item.purpose_of_travel || item.dispatcher_notes || item.task_notes || ''
          });
        }
      });
    }

    // 2. Process active dispatched tickets from tickets/active/TASU
    if (activeTicketsRes.status === 'fulfilled' && activeTicketsRes.value.data?.data?.tickets) {
      const tickets = activeTicketsRes.value.data.data.tickets;
      tickets.forEach(t => {
        const details = t.details || t.tasu_details || {};
        const assignment = t.assignments && t.assignments[0] ? t.assignments[0] : (t.assignment || null);

        const ticketId = String(t.id);
        const existing = tripsMap.get(ticketId) || {};

        let travelDate = details.date_of_travel || t.date_of_travel || existing.date || t.submitted_at;
        if (travelDate && String(travelDate).includes('T')) travelDate = String(travelDate).split('T')[0];

        tripsMap.set(ticketId, {
          id: t.id,
          vehicleId: assignment?.vehicle_id || existing.vehicleId,
          vehicleName: assignment?.model_name || existing.vehicleName || 'Vehicle Unit',
          vehiclePlate: assignment?.plate_no || existing.vehiclePlate || 'Assigned Unit',
          vehicleCategory: assignment?.category || existing.vehicleCategory || 'Transport',
          vehicleImage: assignment?.image_url || existing.vehicleImage,
          date: travelDate,
          destination: details.destination || t.location || existing.destination || 'University Trip',
          requestorName: details.requesting_personnel || t.user_name || existing.requestorName || 'Requestor Pending',
          requestingCollege: details.office_college_department || t.office_room || t.location || existing.requestingCollege || 'University Office',
          driver: assignment?.personnel_name || assignment?.driver_name || existing.driver || 'Unassigned',
          passengers: details.num_passengers || existing.passengers || 1,
          status: t.status_label || existing.status || (t.status === 'processing' ? 'Dispatched - Waiting for Departure' : 'Approved'),
          rawStatus: t.status || 'processing',
          notes: details.purpose_of_travel || t.description || existing.notes || ''
        });
      });
    }

    // 3. Process dispatch queue tickets from tickets/dispatch/TASU
    if (queueRes.status === 'fulfilled' && queueRes.value.data?.data?.tickets) {
      const queueTickets = queueRes.value.data.data.tickets;
      queueTickets.forEach(t => {
        const ticketId = String(t.id);
        if (!tripsMap.has(ticketId)) {
          const details = t.details || t.tasu_details || {};
          let travelDate = details.date_of_travel || t.date_of_travel || t.submitted_at;
          if (travelDate && String(travelDate).includes('T')) travelDate = String(travelDate).split('T')[0];

          tripsMap.set(ticketId, {
            id: t.id,
            vehicleId: null,
            vehicleName: 'Pending Unit Assignment',
            vehiclePlate: 'Pending',
            vehicleCategory: 'Transport',
            vehicleImage: null,
            date: travelDate,
            destination: details.destination || t.location || 'University Trip',
            requestorName: details.requesting_personnel || t.user_name || 'Requestor Pending',
            requestingCollege: details.office_college_department || t.office_room || t.location || 'University Office',
            driver: 'Unassigned',
            passengers: details.num_passengers || 1,
            status: t.status_label || 'Approved - Awaiting Dispatch',
            rawStatus: t.status || 'approved',
            notes: details.purpose_of_travel || t.description || ''
          });
        }
      });
    }

    // Convert map to sorted array (soonest departures first)
    activeTrips.value = Array.from(tripsMap.values()).sort((a, b) => {
      const dateA = new Date(a.date).getTime() || 0;
      const dateB = new Date(b.date).getTime() || 0;
      return dateA - dateB;
    });

  } catch (err) {
    console.error('Failed to fetch active trips:', err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await Promise.allSettled([
    vehiclesStore.fetchVehicles(),
    personnelStore.fetchPersonnel(),
    fetchActiveTrips()
  ]);
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
