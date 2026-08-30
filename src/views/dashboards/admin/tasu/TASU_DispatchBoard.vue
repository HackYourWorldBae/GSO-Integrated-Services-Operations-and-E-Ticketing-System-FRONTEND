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
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Fleet Scheduling &amp; Operations View</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in pb-16">
        
        <!-- Top Stats Overview (3 Column Metric Cards) -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          <div class="p-6 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
            <div class="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Fleet Units</p>
              <p class="text-2xl font-black text-slate-900 tabular-nums leading-none">{{ allVehicles.length }}</p>
              <p class="text-[10px] font-bold text-emerald-600 mt-1">{{ availableVehiclesCount }} Available now</p>
            </div>
          </div>

          <div class="p-6 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
            <div class="p-3.5 rounded-2xl bg-amber-50 text-amber-600 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active On Trip</p>
              <p class="text-2xl font-black text-slate-900 tabular-nums leading-none">{{ inProgressCount }}</p>
              <p class="text-[10px] font-bold text-amber-600 mt-1">Currently in transit</p>
            </div>
          </div>

          <div class="p-6 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
            <div class="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Drivers Available</p>
              <p class="text-2xl font-black text-slate-900 tabular-nums leading-none">{{ availableDriversCount }} / {{ drivers.length }}</p>
              <p class="text-[10px] font-bold text-indigo-600 mt-1">Ready for assignment</p>
            </div>
          </div>
        </div>

        <!-- Dashboard Monthly Header & Navigation Toolbar -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[2.25rem] border border-slate-200 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 block">Fleet Booking Schedule Matrix</span>
              <h3 class="text-2xl font-black text-slate-900 tracking-tight">{{ periodTitle }}</h3>
            </div>
          </div>

          <!-- Date Navigation -->
          <div class="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
            <button @click="prevMonth" title="Previous Month" class="p-2.5 bg-white border border-slate-200/80 rounded-xl text-slate-600 hover:text-emerald-600 hover:border-emerald-300 transition-all active:scale-95 shadow-xs">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button @click="resetToday" class="px-4 py-2 bg-white border border-slate-200/80 rounded-xl text-xs font-black text-slate-700 uppercase tracking-wider hover:border-emerald-400 hover:text-emerald-700 transition-all active:scale-95 shadow-xs">
              Current Month
            </button>
            <button @click="nextMonth" title="Next Month" class="p-2.5 bg-white border border-slate-200/80 rounded-xl text-slate-600 hover:text-emerald-600 hover:border-emerald-300 transition-all active:scale-95 shadow-xs">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- ========================================================= -->
        <!-- MONTHLY SHIFT BOARD VIEW (Timeline Matrix & Grid) -->
        <!-- ========================================================= -->
        <div class="space-y-4">
          
          <!-- Monthly Sub-Toolbar & Trip Category Legend -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white px-6 py-4 rounded-[2rem] shadow-xl">
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <p class="text-xs font-bold text-slate-300">Scroll horizontally across the month to inspect booked and dispatched trips per vehicle unit</p>
            </div>
            <div class="flex flex-wrap items-center gap-4 text-[11px] font-bold text-slate-300">
              <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Regular / Shuttle</div>
              <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Educational</div>
              <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> VIP / Guest</div>
              <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Admin Official</div>
              <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-slate-500"></span> Logistics</div>
            </div>
          </div>

          <!-- Horizontal Monthly Fleet Timeline -->
          <div class="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div class="overflow-x-auto max-h-[750px] custom-scrollbar">
              <div :style="{ minWidth: `${260 + monthDays.length * 75}px` }">
                
                <!-- Days of Month Header -->
                <div 
                  class="grid divide-x divide-slate-100 border-b border-slate-200 bg-slate-50/90 sticky top-0 z-30"
                  :style="{ gridTemplateColumns: `260px repeat(${monthDays.length}, minmax(72px, 1fr))` }"
                >
                  <div class="p-4 flex items-center justify-between sticky left-0 z-40 bg-slate-100/95 backdrop-blur-md border-r border-slate-200 shadow-sm">
                    <span class="text-[11px] font-black text-slate-700 uppercase tracking-widest">Fleet Unit ({{ allVehicles.length }})</span>
                    <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{{ monthDays.length }} Days</span>
                  </div>
                  <div 
                    v-for="day in monthDays" 
                    :key="day.dateStr" 
                    :class="['p-3 flex flex-col items-center justify-center text-center transition-colors', day.isToday ? 'bg-emerald-500 text-white font-bold' : day.isWeekend ? 'bg-slate-100/60 text-slate-500' : 'text-slate-800']"
                  >
                    <span :class="['text-[9px] font-black uppercase tracking-tighter', day.isToday ? 'text-emerald-100' : 'text-slate-400']">{{ day.dayName }}</span>
                    <span class="text-base font-black tabular-nums leading-tight">{{ day.dayNumber }}</span>
                  </div>
                </div>

                <!-- Vehicle x Days of Month Rows -->
                <div class="divide-y divide-slate-100">
                  <div 
                    v-for="unit in allVehicles" 
                    :key="unit.id" 
                    class="grid divide-x divide-slate-100 group hover:bg-slate-50/50 transition-colors"
                    :style="{ gridTemplateColumns: `260px repeat(${monthDays.length}, minmax(72px, 1fr))` }"
                  >
                    <!-- Sticky Left Column: Vehicle Info -->
                    <div class="p-3.5 sticky left-0 z-20 bg-white group-hover:bg-slate-50 border-r border-slate-200 flex items-center gap-3 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                      <img :src="unit.image || '/bsu-logo.png'" :alt="unit.name" class="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200 shadow-xs" />
                      <div class="min-w-0 flex-1">
                        <h4 class="text-xs font-black text-slate-900 truncate" :title="unit.name">{{ unit.name }}</h4>
                        <div class="flex items-center justify-between mt-1">
                          <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{{ unit.plate }}</span>
                          <span :class="['px-1.5 py-0.5 rounded text-[8px] font-black uppercase', unit.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600']">{{ unit.status === 'Available' ? 'Ready' : 'Maint.' }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Daily Cells across Month -->
                    <div 
                      v-for="day in monthDays" 
                      :key="day.dateStr" 
                      :class="['p-1.5 relative min-h-[80px] flex flex-col justify-center items-center transition-colors', day.isToday ? 'bg-emerald-500/5' : day.isWeekend ? 'bg-slate-50/40' : 'hover:bg-slate-100/60']"
                    >
                      <!-- If there are bookings on this specific day of the month -->
                      <div v-if="getVehicleDayBookings(unit.id, day.dateStr).length > 0" class="w-full space-y-1">
                        <div 
                          v-for="booking in getVehicleDayBookings(unit.id, day.dateStr)" 
                          :key="booking.id" 
                          @click="openBookingDetails(booking, unit, day)" 
                          :class="['p-1.5 rounded-lg text-left shadow-xs cursor-pointer transition-all hover:scale-105 border text-[9px] font-black truncate', getMonthlyPillStyle(booking.type)]"
                          :title="`${booking.time}: ${booking.destination} (${booking.requestor}) - Driver: ${booking.driver}`"
                        >
                          <div class="flex items-center justify-between">
                            <span class="truncate">{{ booking.destination }}</span>
                          </div>
                          <div class="text-[7px] opacity-80 uppercase font-bold truncate mt-0.5">🧑 {{ booking.driver ? booking.driver.split(' ')[0] : 'No Driver' }}</div>
                        </div>
                      </div>

                      <!-- Empty slot marker -->
                      <div v-else class="w-2 h-2 rounded-full bg-slate-200/50"></div>
                    </div>
                  </div>
                </div>
              </div>
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
              <span :class="['px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border', getStatusBadgeStyle(selectedBooking.booking.status)]">
                {{ selectedBooking.booking.status }}
              </span>
              <span class="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-slate-100 text-slate-600">
                ID: {{ selectedBooking.booking.id }}
              </span>
            </div>
            <h3 class="text-2xl font-black text-slate-900 leading-tight">{{ selectedBooking.booking.destination }}</h3>
            <p class="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1">{{ selectedBooking.unit.name }} • Plate: {{ selectedBooking.unit.plate }}</p>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="flex items-center gap-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div class="p-2.5 bg-white rounded-xl text-emerald-600 shadow-sm shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div class="min-w-0">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Trip Date</p>
                  <p class="text-xs font-black text-slate-900 truncate">{{ selectedBooking.booking.date }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div class="p-2.5 bg-white rounded-xl text-emerald-600 shadow-sm shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div class="min-w-0">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Time Schedule</p>
                  <p class="text-xs font-black text-slate-900 truncate">{{ selectedBooking.booking.time }}</p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="flex items-center gap-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div class="p-2.5 bg-white rounded-xl text-blue-600 shadow-sm shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div class="min-w-0">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Requestor / Dept</p>
                  <p class="text-xs font-black text-slate-900 truncate">{{ selectedBooking.booking.requestor }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div class="p-2.5 bg-white rounded-xl text-amber-600 shadow-sm shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <div class="min-w-0">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Passenger Count</p>
                  <p class="text-xs font-black text-slate-900 truncate">{{ selectedBooking.booking.passengers || 1 }} Persons</p>
                </div>
              </div>
            </div>

            <!-- Assigned Driver Status -->
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-4">
              <div>
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Assigned Professional Driver</p>
                <p class="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <span v-if="selectedBooking.booking.driver">🧑 {{ selectedBooking.booking.driver }}</span>
                  <span v-else class="text-amber-600 font-bold">⚠️ Unassigned</span>
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

            <div v-if="selectedBooking.booking.notes" class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Trip Particulars / Purpose</p>
              <p class="text-xs font-medium text-slate-700 leading-relaxed">{{ selectedBooking.booking.notes }}</p>
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
const dispatchBookings = ref([]);

// Current displayed Month (defaults to current active month)
const currentMonth = ref(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
const selectedBooking = ref(null);

// Combined Bookings from API + Store
const allBookings = computed(() => {
  if (dispatchBookings.value.length > 0) {
    return dispatchBookings.value;
  }
  return vehiclesStore.bookings || [];
});

// Computed Stats
const availableVehiclesCount = computed(() => allVehicles.value.filter(v => v.status === 'Available').length);
const availableDriversCount = computed(() => drivers.value.filter(d => d.status === 'Available').length);
const inProgressCount = computed(() => allBookings.value.filter(b => b.status === 'In Progress' || b.status === 'On Route / In Progress').length);

// Period Title
const periodTitle = computed(() => {
  return currentMonth.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
});

// Monthly Days Computed (All days in currentMonth)
const monthDays = computed(() => {
  const days = [];
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const dayNameStrings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const dayOfWeek = d.getDay();

    days.push({
      dayNumber: i,
      dayName: dayNameStrings[dayOfWeek],
      dateStr: dateStr,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      isToday: dateStr === todayStr
    });
  }
  return days;
});

// Navigation Functions
const prevMonth = () => {
  const newDate = new Date(currentMonth.value);
  newDate.setMonth(newDate.getMonth() - 1);
  currentMonth.value = newDate;
};

const nextMonth = () => {
  const newDate = new Date(currentMonth.value);
  newDate.setMonth(newDate.getMonth() + 1);
  currentMonth.value = newDate;
};

const resetToday = () => {
  currentMonth.value = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  toast.success('Reset to current month');
};

// Retrieve Bookings for exact vehicle and date
const getVehicleDayBookings = (vehicleId, dateStr) => {
  return allBookings.value.filter(b => {
    const matchesVehicle = String(b.vehicleId) === String(vehicleId);
    // Normalize date strings
    const bookingDateStr = b.date ? String(b.date).slice(0, 10) : '';
    return matchesVehicle && bookingDateStr === dateStr;
  });
};

const openBookingDetails = (booking, unit, day) => {
  selectedBooking.value = { booking, unit, day };
};

const fetchDispatchBoardData = async () => {
  try {
    const response = await api.get('tasu/dispatch');
    if (response.data?.data?.dispatch) {
      const rawData = response.data.data.dispatch;
      // Filter items that have actual assigned trips / dates
      dispatchBookings.value = rawData
        .filter(item => item.ticket_id && (item.date_of_travel || item.implementation_date))
        .map(item => {
          let dateStr = item.date_of_travel || item.implementation_date || '';
          if (dateStr && dateStr.includes('T')) dateStr = dateStr.split('T')[0];

          return {
            id: item.ticket_id,
            vehicleId: item.vehicle_id || item.id,
            date: dateStr,
            time: item.request_time ? `${item.request_time}${item.return_time ? ' - ' + item.return_time : ''}` : 'Official Travel',
            type: 'regular',
            destination: item.destination || 'University Travel',
            requestor: item.requesting_personnel ? `${item.requesting_personnel}${item.office_college_department ? ' (' + item.office_college_department + ')' : ''}` : (item.office_college_department || 'University Office'),
            driver: item.assigned_driver || 'Unassigned',
            passengers: item.num_passengers || 1,
            status: item.status_label || (item.booking_status === 'resolved' || item.booking_status === 'closed' ? 'Completed' : (item.booking_status === 'processing' ? 'In Progress' : 'Scheduled')),
            notes: item.purpose_of_travel || item.dispatcher_notes || item.task_notes || ''
          };
        });
    }
  } catch (err) {
    console.error('Failed to fetch dispatch board bookings:', err);
  }
};

const printDispatchSlip = (item) => {
  toast.success(`Printing official Trip Ticket for ${item.booking.destination} (${item.unit.plate})...`);
  setTimeout(() => {
    window.print();
  }, 500);
};

// Style Helpers
const getMonthlyPillStyle = (type) => {
  switch (type) {
    case 'regular': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'educational': return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'vip': return 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
    case 'admin': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    case 'logistics': return 'bg-slate-200 text-slate-800 border-slate-300';
    default: return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  }
};

const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'Completed': return 'bg-emerald-600 text-white border-emerald-600';
    case 'In Progress': return 'bg-amber-500 text-white border-amber-500 animate-pulse';
    case 'Scheduled': return 'bg-blue-600 text-white border-blue-600';
    case 'Cancelled': return 'bg-rose-500 text-white border-rose-500';
    default: return 'bg-slate-600 text-white border-slate-600';
  }
};

onMounted(async () => {
  await Promise.allSettled([
    vehiclesStore.fetchVehicles(),
    personnelStore.fetchPersonnel(),
    fetchDispatchBoardData()
  ]);
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Custom scrollbar styling for wide monthly matrix */
.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
