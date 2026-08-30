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

        <!-- Active Trip Cards Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div 
            v-for="trip in filteredTrips" 
            :key="trip.id"
            class="bg-white rounded-[2rem] border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between overflow-hidden group"
          >
            <!-- Card Header: Departure Date & Status Pill -->
            <div class="p-6 pb-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <div class="p-2 rounded-xl bg-emerald-100/80 text-emerald-800 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <span class="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Date of Departure</span>
                  <p class="text-xs font-black text-slate-900 leading-tight">{{ formatTripDate(trip.date) }}</p>
                </div>
              </div>

              <!-- Status Badge -->
              <span :class="['px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-xs', getTripStatusBadge(trip.status)]">
                {{ trip.status }}
              </span>
            </div>

            <!-- Card Body: Vehicle, Driver, & Destination Details -->
            <div class="p-6 space-y-4 flex-1">
              
              <!-- Assigned Vehicle & Driver Info -->
              <div class="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <img :src="trip.vehicleImage || '/bsu-logo.png'" :alt="trip.vehicleName" class="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0 bg-white" />
                  <div class="min-w-0">
                    <h5 class="text-xs font-black text-slate-900 truncate" :title="trip.vehicleName">{{ trip.vehicleName }}</h5>
                    <div class="flex items-center gap-1.5 mt-0.5">
                      <span class="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded uppercase tracking-wider">{{ trip.vehiclePlate }}</span>
                      <span v-if="trip.vehicleCategory" class="text-[8px] font-bold text-slate-500 uppercase">{{ trip.vehicleCategory }}</span>
                    </div>
                  </div>
                </div>

                <!-- Driver Badge -->
                <div class="text-right shrink-0">
                  <span class="text-[8px] font-black uppercase tracking-wider text-slate-400 block">Driver</span>
                  <span class="text-[10px] font-black text-slate-800 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-xs inline-block">
                    🧑 {{ trip.driver ? trip.driver.split(' ')[0] : 'Unassigned' }}
                  </span>
                </div>
              </div>

              <!-- Destination & Schedule Time -->
              <div>
                <div class="flex items-center gap-1.5 text-xs text-slate-400 font-bold mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span class="uppercase tracking-widest text-[9px]">Destination &amp; Route</span>
                </div>
                <h4 class="text-sm font-black text-slate-900 line-clamp-2 leading-snug" :title="trip.destination">
                  {{ trip.destination }}
                </h4>
              </div>

              <!-- Requester & Passenger Info -->
              <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                <div>
                  <span class="text-[8px] font-black uppercase tracking-wider text-slate-400 block">Requester / Office</span>
                  <p class="font-bold text-slate-700 truncate" :title="trip.requestor">{{ trip.requestor }}</p>
                </div>
                <div>
                  <span class="text-[8px] font-black uppercase tracking-wider text-slate-400 block">Time Schedule</span>
                  <p class="font-bold text-slate-700 truncate">{{ trip.time }}</p>
                </div>
              </div>

              <!-- Purpose Note Snippet (if available) -->
              <div v-if="trip.notes" class="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[10px] text-slate-600 font-medium line-clamp-2 leading-relaxed">
                <span class="font-black text-slate-700">Purpose:</span> {{ trip.notes }}
              </div>
            </div>

            <!-- Card Footer: View Details Action -->
            <div class="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Ticket #{{ trip.id }}</span>
              <button 
                @click="openBookingDetails(trip)" 
                class="px-4 py-2 bg-slate-900 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <span>View Full Slip</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
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
        <div class="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
          <button @click="selectedBooking = null" class="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <div class="mb-6">
            <div class="flex items-center gap-2 mb-3">
              <span :class="['px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border shadow-xs', getTripStatusBadge(selectedBooking.status)]">
                {{ selectedBooking.status }}
              </span>
              <span class="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-slate-100 text-slate-600">
                Ticket #{{ selectedBooking.id }}
              </span>
            </div>
            <h3 class="text-2xl font-black text-slate-900 leading-tight">{{ selectedBooking.destination }}</h3>
            <p class="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1">{{ selectedBooking.vehicleName }} • Plate: {{ selectedBooking.vehiclePlate }}</p>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="flex items-center gap-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div class="p-2.5 bg-white rounded-xl text-emerald-600 shadow-sm shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div class="min-w-0">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Date of Departure</p>
                  <p class="text-xs font-black text-slate-900 truncate">{{ formatTripDate(selectedBooking.date) }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div class="p-2.5 bg-white rounded-xl text-emerald-600 shadow-sm shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div class="min-w-0">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Time Schedule</p>
                  <p class="text-xs font-black text-slate-900 truncate">{{ selectedBooking.time }}</p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="flex items-center gap-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div class="p-2.5 bg-white rounded-xl text-blue-600 shadow-sm shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div class="min-w-0">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Requestor / Office</p>
                  <p class="text-xs font-black text-slate-900 truncate">{{ selectedBooking.requestor }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div class="p-2.5 bg-white rounded-xl text-amber-600 shadow-sm shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <div class="min-w-0">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Passenger Count</p>
                  <p class="text-xs font-black text-slate-900 truncate">{{ selectedBooking.passengers || 1 }} Persons</p>
                </div>
              </div>
            </div>

            <!-- Assigned Driver Status -->
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-4">
              <div>
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Assigned University Driver</p>
                <p class="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <span v-if="selectedBooking.driver && selectedBooking.driver !== 'Unassigned'">🧑 {{ selectedBooking.driver }}</span>
                  <span v-else class="text-amber-600 font-bold">⚠️ Unassigned Driver</span>
                </p>
              </div>
              <router-link 
                to="/admin/tasu/personnel" 
                class="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10px] font-black uppercase tracking-wider transition-all border border-emerald-200/60 shrink-0 flex items-center gap-1 active:scale-95"
              >
                <span>Personnel Roster</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </router-link>
            </div>

            <div v-if="selectedBooking.notes" class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Trip Particulars / Purpose</p>
              <p class="text-xs font-medium text-slate-700 leading-relaxed">{{ selectedBooking.notes }}</p>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <button @click="selectedBooking = null" class="px-6 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-200 transition-colors uppercase tracking-widest">Close</button>
            <button @click="printDispatchSlip(selectedBooking)" class="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/30 hover:bg-emerald-500 transition-all hover:-translate-y-0.5 uppercase tracking-widest flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              Print Slip
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
import { toast } from 'vue3-toastify';
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

// Computed Counts
const availableVehiclesCount = computed(() => allVehicles.value.filter(v => v.status === 'Available').length);
const availableDriversCount = computed(() => drivers.value.filter(d => d.status === 'Available').length);
const inTransitCount = computed(() => activeTrips.value.filter(t => t.status === 'On Route / In Progress' || t.status === 'In Progress').length);
const scheduledDispatchesCount = computed(() => activeTrips.value.filter(t => t.status === 'Dispatched' || t.status === 'Scheduled' || t.status === 'Approved').length);

// Filtered Trips based on active tab and search query
const filteredTrips = computed(() => {
  return activeTrips.value.filter(trip => {
    // Tab Filter
    let matchesTab = true;
    if (activeTab.value === 'in_progress') {
      matchesTab = trip.status === 'On Route / In Progress' || trip.status === 'In Progress';
    } else if (activeTab.value === 'scheduled') {
      matchesTab = trip.status === 'Dispatched' || trip.status === 'Scheduled' || trip.status === 'Approved';
    }

    // Search Query Filter
    const q = searchQuery.value.toLowerCase().trim();
    const matchesSearch = !q ||
      trip.destination.toLowerCase().includes(q) ||
      trip.vehicleName.toLowerCase().includes(q) ||
      trip.vehiclePlate.toLowerCase().includes(q) ||
      trip.requestor.toLowerCase().includes(q) ||
      trip.driver.toLowerCase().includes(q) ||
      String(trip.id).includes(q);

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
  switch (status) {
    case 'On Route / In Progress':
    case 'In Progress':
      return 'bg-amber-500 text-white border-amber-500 animate-pulse';
    case 'Dispatched':
    case 'Scheduled':
      return 'bg-blue-600 text-white border-blue-600';
    case 'Approved':
      return 'bg-emerald-600 text-white border-emerald-600';
    default:
      return 'bg-slate-700 text-white border-slate-700';
  }
};

const openBookingDetails = (trip) => {
  selectedBooking.value = trip;
};

const fetchActiveTrips = async () => {
  isLoading.value = true;
  try {
    const [dispatchRes, activeTicketsRes] = await Promise.allSettled([
      api.get('tasu/dispatch'),
      api.get('tickets/active/TASU')
    ]);

    const tripsMap = new Map();

    // 1. Process tasu/dispatch data
    if (dispatchRes.status === 'fulfilled' && dispatchRes.value.data?.data?.dispatch) {
      const raw = dispatchRes.value.data.data.dispatch;
      raw.forEach(item => {
        // Exclude closed/resolved/declined trips or unassigned placeholders without dates
        if (item.ticket_id && (item.date_of_travel || item.implementation_date)) {
          let dateStr = item.date_of_travel || item.implementation_date || '';
          if (dateStr.includes('T')) dateStr = dateStr.split('T')[0];

          const status = item.status_label || (item.booking_status === 'processing' ? 'Dispatched' : 'Approved');

          tripsMap.set(String(item.ticket_id), {
            id: item.ticket_id,
            vehicleId: item.vehicle_id,
            vehicleName: item.model_name || 'Vehicle Unit',
            vehiclePlate: item.plate_no || 'Plate N/A',
            vehicleCategory: item.category || 'Van',
            vehicleImage: item.image_url,
            date: dateStr,
            time: item.request_time ? `${item.request_time}${item.return_time ? ' - ' + item.return_time : ''}` : 'Official Travel',
            destination: item.destination || 'University Travel',
            requestor: item.requesting_personnel ? `${item.requesting_personnel}${item.office_college_department ? ' • ' + item.office_college_department : ''}` : (item.office_college_department || 'University Office'),
            driver: item.assigned_driver || 'Unassigned',
            passengers: item.num_passengers || 1,
            status: status,
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
        const assignment = t.assignments && t.assignments[0] ? t.assignments[0] : null;

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
          time: details.request_time ? `${details.request_time}${details.return_time ? ' - ' + details.return_time : ''}` : (existing.time || 'Official Trip'),
          destination: details.destination || t.location || existing.destination || 'University Trip',
          requestor: details.requesting_personnel ? `${details.requesting_personnel}${details.office_college_department ? ' • ' + details.office_college_department : ''}` : (t.user_name || existing.requestor || 'University Office'),
          driver: assignment?.personnel_name || assignment?.driver_name || existing.driver || 'Unassigned',
          passengers: details.num_passengers || existing.passengers || 1,
          status: t.status_label || (t.status === 'processing' ? 'On Route / In Progress' : 'Dispatched'),
          notes: details.purpose_of_travel || t.description || existing.notes || ''
        });
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

const printDispatchSlip = (trip) => {
  toast.success(`Printing official Trip Ticket for ${trip.destination} (${trip.vehiclePlate})...`);
  setTimeout(() => {
    window.print();
  }, 500);
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
