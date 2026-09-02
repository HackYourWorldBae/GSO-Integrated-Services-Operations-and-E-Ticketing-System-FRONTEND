<template>
  <MainLayout>
    <template #sidebar-links>

      <router-link to="/dispatcher/tasu" class="nav-item active">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
        <span class="text">Trip Requests</span>
      </router-link>
      <router-link to="/dispatcher/tasu/dispatch" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span class="text">Dispatch</span>
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
      <div class="space-y-8 animate-fade-in max-w-[1400px] mx-auto pb-16">
        
        <!-- ① Selected Trip Header -->
        <div v-if="selectedTrip" class="p-6 sm:p-8 rounded-[2.5rem] bg-gradient-to-r from-emerald-50 via-teal-50/40 to-white border border-emerald-100/80 shadow-sm relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          
          <div class="relative z-10 flex-1 min-w-0">
            <div class="flex items-center gap-2.5 mb-3 flex-wrap">
              <span class="px-3 py-1 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-xs">Active Dispatch Request</span>
              <span class="text-sm font-black text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-lg">#{{ selectedTrip.id }}</span>
              <span v-if="selectedTrip.passengers" class="text-xs font-bold text-slate-600 bg-white/80 px-2.5 py-0.5 rounded-lg border border-emerald-100">
                👥 {{ selectedTrip.passengers }} Passenger{{ selectedTrip.passengers > 1 ? 's' : '' }}
              </span>
            </div>
            <h3 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight truncate">{{ selectedTrip.destination }}</h3>
            <p class="text-slate-600 font-medium text-xs sm:text-sm mt-1.5 flex items-center gap-2 flex-wrap">
              <span class="font-bold text-emerald-800">{{ selectedTrip.requester }}</span>
              <span class="text-slate-400">•</span>
              <span class="text-slate-500">{{ selectedTrip.office }}</span>
              <span class="text-slate-400">•</span>
              <span class="font-bold text-slate-700">Trip Date: {{ selectedTrip.date }}</span>
            </p>
          </div>

          <div class="relative z-10 flex items-center gap-3 shrink-0 flex-wrap">
            <button @click="openTicketModal(selectedTrip)" class="px-5 py-3 bg-white hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 font-black text-[11px] uppercase tracking-wider rounded-2xl transition-all border border-emerald-200/80 shadow-xs active:scale-95 cursor-pointer flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              Review Trip Ticket
            </button>
            <router-link to="/dispatcher/tasu" class="p-3 bg-white hover:bg-slate-900 hover:text-white text-slate-600 rounded-2xl transition-all shadow-xs border border-slate-200 flex items-center justify-center cursor-pointer" title="Return to trip queue">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </router-link>
          </div>
        </div>

        <div v-else class="p-12 rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-center">
           <div class="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center mb-6">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
           </div>
           <h3 class="text-2xl font-black text-slate-900 mb-3 tracking-tight">No Trip Selected</h3>
           <p class="text-slate-500 font-medium max-w-sm">Please return to the trip queue and click "Assign Driver" on a specific trip to dispatch vehicles.</p>
           <router-link to="/dispatcher/tasu" class="mt-8 px-8 py-3 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/20 active:scale-95">Return to Trip Queue</router-link>
        </div>

        <!-- ② Dispatch Pairing Station (Prominent Hub) -->
        <div v-if="selectedTrip" class="p-6 sm:p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border border-slate-700/80 relative overflow-hidden">
          <div class="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative z-10">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-700/60">
              <div>
                <span class="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Dispatch Pairing Station</span>
                <h3 class="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                  Pair Driver & Vehicle for #{{ selectedTrip.id }}
                </h3>
              </div>
              <div class="flex items-center gap-3">
                <span v-if="assignmentsToDispatch.length > 0" class="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/30">
                  {{ assignmentsToDispatch.length }} Pair{{ assignmentsToDispatch.length > 1 ? 's' : '' }} Staged
                </span>
              </div>
            </div>

            <!-- 2-Slot Grid + Action -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
              
              <!-- Slot 1: Driver -->
              <div class="lg:col-span-4 p-4 sm:p-5 rounded-2xl border transition-all"
                :class="stagedDriver ? 'bg-emerald-950/40 border-emerald-500/60 ring-1 ring-emerald-500/30' : 'bg-slate-800/60 border-dashed border-slate-700'">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full" :class="stagedDriver ? 'bg-emerald-400' : 'bg-slate-500'"></span>
                    Step 1: Driver
                  </span>
                  <button v-if="stagedDriver" @click="stagedDriver = null" class="text-[10px] font-bold text-slate-400 hover:text-rose-400 transition-colors uppercase tracking-wider cursor-pointer">
                    Change
                  </button>
                </div>
                
                <div v-if="stagedDriver" class="flex items-center gap-3">
                  <div class="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-300 font-black text-base flex items-center justify-center shrink-0 border border-emerald-500/30">
                    {{ stagedDriver.name.charAt(0) }}
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-black text-white truncate">{{ stagedDriver.name }}</p>
                    <p class="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">{{ stagedDriver.role || 'Driver' }}</p>
                  </div>
                  <span class="p-1 rounded-lg bg-emerald-500 text-white shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                  </span>
                </div>

                <div v-else class="py-2 text-center text-slate-400">
                  <p class="text-xs font-bold text-slate-300">No Driver Selected</p>
                  <p class="text-[10px] text-slate-500 mt-0.5">Click a driver card from the pool below</p>
                </div>
              </div>

              <!-- Slot 2: Vehicle -->
              <div class="lg:col-span-4 p-4 sm:p-5 rounded-2xl border transition-all"
                :class="stagedVehicle ? 'bg-blue-950/40 border-blue-500/60 ring-1 ring-blue-500/30' : 'bg-slate-800/60 border-dashed border-slate-700'">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full" :class="stagedVehicle ? 'bg-blue-400' : 'bg-slate-500'"></span>
                    Step 2: Vehicle
                  </span>
                  <button v-if="stagedVehicle" @click="stagedVehicle = null" class="text-[10px] font-bold text-slate-400 hover:text-rose-400 transition-colors uppercase tracking-wider cursor-pointer">
                    Change
                  </button>
                </div>
                
                <div v-if="stagedVehicle" class="flex items-center gap-3">
                  <div class="w-11 h-11 rounded-xl bg-blue-500/20 text-blue-300 font-black text-base flex items-center justify-center shrink-0 border border-blue-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H12a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7h4a1 1 0 01.8.4l3 4A1 1 0 0122 12v3a1 1 0 01-1 1h-.05a2.5 2.5 0 01-4.9 0H14V7z" /></svg>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-black text-white truncate">{{ stagedVehicle.name }}</p>
                    <p class="text-[10px] font-bold text-blue-300 uppercase tracking-widest">{{ stagedVehicle.plate }} • {{ stagedVehicle.category }}</p>
                  </div>
                  <span class="p-1 rounded-lg bg-blue-500 text-white shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                  </span>
                </div>

                <div v-else class="py-2 text-center text-slate-400">
                  <p class="text-xs font-bold text-slate-300">No Vehicle Selected</p>
                  <p class="text-[10px] text-slate-500 mt-0.5">Click a vehicle card from the pool below</p>
                </div>
              </div>

              <!-- Slot 3: Stage Action Button -->
              <div class="lg:col-span-4 flex flex-col justify-center gap-2">
                <button 
                  @click="stageAssignment"
                  :disabled="!stagedDriver || !stagedVehicle"
                  :class="[
                    'w-full py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg',
                    stagedDriver && stagedVehicle 
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25 active:scale-95 cursor-pointer ring-2 ring-emerald-400' 
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  ]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                  <span>{{ stagedDriver && stagedVehicle ? 'Stage This Assignment' : 'Select Driver & Vehicle' }}</span>
                </button>

                <p class="text-center text-[10px] text-slate-400 font-medium">
                  {{ stagedDriver && stagedVehicle ? 'Click to stage this pair' : 'Pick 1 driver and 1 vehicle below to stage' }}
                </p>
              </div>

            </div>
          </div>
        </div>

        <!-- ③ Staged Dispatch Queue Panel -->
        <div v-if="selectedTrip && assignmentsToDispatch.length > 0" class="p-6 sm:p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-xl overflow-hidden relative border border-slate-800 animate-fade-in">
          <div class="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10 pb-4 border-b border-slate-800">
            <div>
              <span class="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Ready for Dispatch</span>
              <h3 class="text-xl font-black text-white flex items-center gap-2.5">
                Staged Assignments for #{{ selectedTrip.id }}
              </h3>
            </div>
            <button @click="dispatchAll" class="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-emerald-500/25 active:scale-95 flex items-center gap-2 cursor-pointer self-start sm:self-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Confirm & Dispatch ({{ assignmentsToDispatch.length }})
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            <div v-for="(assign, index) in assignmentsToDispatch" :key="index"
              class="flex items-center justify-between p-4 bg-slate-800/80 border border-slate-700/80 rounded-2xl gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black shrink-0 border border-emerald-500/30">
                  {{ assign.driverName.charAt(0) }}
                </div>
                <div class="min-w-0 flex-1">
                  <span class="text-white font-black text-sm block truncate">{{ assign.driverName }}</span>
                  <span class="text-xs text-blue-300 font-bold block truncate">{{ assign.vehicleName }} ({{ assign.vehiclePlate }})</span>
                </div>
              </div>
              <button @click="assignmentsToDispatch.splice(index, 1)" class="p-2.5 rounded-xl bg-slate-700/60 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer shrink-0" title="Remove staged pair">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- ④ Selection Pools (Drivers & Vehicles Side-by-Side) -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          
          <!-- DRIVER POOL -->
          <div class="p-6 sm:p-8 rounded-[2.5rem] bg-white border border-slate-200/90 shadow-sm flex flex-col space-y-6">
            
            <!-- Driver Header & Search -->
            <div>
              <div class="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div class="flex items-center gap-2.5">
                  <span class="w-2.5 h-6 bg-emerald-500 rounded-full"></span>
                  <h3 class="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Driver Pool</h3>
                  <span class="text-[10px] font-black text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                    {{ availableDriversCount }} Available
                  </span>
                </div>
                <span class="text-xs text-slate-400 font-bold">Click card to select</span>
              </div>

              <!-- Search & Filter Controls -->
              <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div class="relative flex-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input 
                    v-model="driverSearchQuery"
                    type="text" 
                    placeholder="Search driver by name..."
                    class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  <button 
                    @click="driverStatusFilter = 'available'"
                    :class="['px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer',
                      driverStatusFilter === 'available' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800']"
                  >
                    Available
                  </button>
                  <button 
                    @click="driverStatusFilter = 'all'"
                    :class="['px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer',
                      driverStatusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800']"
                  >
                    All ({{ allDrivers.length }})
                  </button>
                  <button 
                    @click="driverStatusFilter = 'busy'"
                    :class="['px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer',
                      driverStatusFilter === 'busy' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-500 hover:text-slate-800']"
                  >
                    Busy
                  </button>
                </div>
              </div>
            </div>

            <!-- Drivers List -->
            <div class="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-1">
              <div v-if="filteredDrivers.length === 0" class="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p class="text-sm font-bold text-slate-600">No drivers match your criteria</p>
                <p class="text-xs text-slate-400 mt-1">Try adjusting your search query or filter</p>
              </div>

              <div 
                v-for="driver in filteredDrivers" 
                :key="driver.id"
                @click="selectDriver(driver)"
                :class="[
                  'p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col gap-2.5 relative group',
                  stagedDriver?.id === driver.id 
                    ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500 shadow-md' 
                    : (driver.status === 'Available' && !driver.assignedTicket
                        ? 'bg-white border-slate-200/80 hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer' 
                        : 'bg-slate-50/70 border-slate-200/60 opacity-70 cursor-not-allowed')
                ]"
              >
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3.5 min-w-0">
                    <div :class="[
                      'w-11 h-11 rounded-xl flex items-center justify-center font-black text-base shrink-0 transition-colors',
                      stagedDriver?.id === driver.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-700'
                    ]">
                      {{ driver.name.charAt(0) }}
                    </div>
                    <div class="min-w-0">
                      <h4 class="font-black text-sm text-slate-900 truncate leading-tight">{{ driver.name }}</h4>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{{ driver.role || 'Driver' }}</p>
                    </div>
                  </div>

                  <!-- Status Badge -->
                  <div class="flex items-center gap-2 shrink-0">
                    <span :class="[
                      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border',
                      stagedDriver?.id === driver.id ? 'bg-emerald-600 text-white border-emerald-600' :
                      driver.status === 'On Trip' ? 'bg-amber-50 text-amber-700 border-amber-200/80' :
                      driver.assignedTicket ? 'bg-blue-50 text-blue-700 border-blue-200/80' :
                      driver.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    ]">
                      <span :class="['w-1.5 h-1.5 rounded-full', stagedDriver?.id === driver.id ? 'bg-white' : driver.status === 'On Trip' ? 'bg-amber-500' : driver.assignedTicket ? 'bg-blue-500' : driver.status === 'Available' ? 'bg-emerald-500' : 'bg-slate-400']"></span>
                      {{ stagedDriver?.id === driver.id ? 'Selected' : driver.status === 'On Trip' ? 'On Trip' : driver.assignedTicket ? `Assigned #${driver.assignedTicket}` : driver.status }}
                    </span>
                  </div>
                </div>

                <!-- Assignment/Trip Note if busy -->
                <div v-if="driver.assignedTicket" class="text-[10px] font-bold text-blue-700 bg-blue-50/80 rounded-xl px-3 py-1.5 flex items-center justify-between">
                  <span>Currently assigned to Ticket #{{ driver.assignedTicket }}</span>
                  <span v-if="driver.implementationDate">{{ driver.implementationDate }}</span>
                </div>
              </div>
            </div>

          </div>

          <!-- VEHICLE POOL -->
          <div class="p-6 sm:p-8 rounded-[2.5rem] bg-white border border-slate-200/90 shadow-sm flex flex-col space-y-6">
            
            <!-- Vehicle Header & Search -->
            <div>
              <div class="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div class="flex items-center gap-2.5">
                  <span class="w-2.5 h-6 bg-blue-500 rounded-full"></span>
                  <h3 class="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Vehicle Fleet</h3>
                  <span class="text-[10px] font-black text-blue-800 bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-full">
                    {{ availableVehiclesCount }} Available
                  </span>
                </div>
                <span class="text-xs text-slate-400 font-bold">Click card to select</span>
              </div>

              <!-- Search & Category Filter Controls -->
              <div class="flex flex-col gap-2.5">
                <div class="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input 
                    v-model="vehicleSearchQuery"
                    type="text" 
                    placeholder="Search vehicle model, plate, or category..."
                    class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <!-- Category Pills -->
                <div class="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                  <button 
                    v-for="cat in vehicleCategories" 
                    :key="cat"
                    @click="vehicleCategoryFilter = cat"
                    :class="[
                      'px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer border',
                      vehicleCategoryFilter === cat 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    ]"
                  >
                    {{ cat === 'all' ? 'All Types' : cat }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Vehicle List -->
            <div class="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-1">
              <div v-if="filteredVehicles.length === 0" class="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p class="text-sm font-bold text-slate-600">No vehicles match your criteria</p>
                <p class="text-xs text-slate-400 mt-1">Try adjusting your search or category filter</p>
              </div>

              <div 
                v-for="vehicle in filteredVehicles" 
                :key="vehicle.id"
                @click="selectVehicle(vehicle)"
                :class="[
                  'p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col gap-2.5 relative group',
                  stagedVehicle?.id === vehicle.id 
                    ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500 shadow-md' 
                    : (vehicle.status === 'Available'
                        ? 'bg-white border-slate-200/80 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer' 
                        : 'bg-slate-50/70 border-slate-200/60 opacity-70 cursor-not-allowed')
                ]"
              >
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3.5 min-w-0">
                    <div :class="[
                      'w-11 h-11 rounded-xl flex items-center justify-center font-black text-base shrink-0 transition-colors',
                      stagedVehicle?.id === vehicle.id ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700'
                    ]">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H12a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7h4a1 1 0 01.8.4l3 4A1 1 0 0122 12v3a1 1 0 01-1 1h-.05a2.5 2.5 0 01-4.9 0H14V7z" />
                      </svg>
                    </div>
                    <div class="min-w-0">
                      <h4 class="font-black text-sm text-slate-900 truncate leading-tight">{{ vehicle.name }}</h4>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        <strong class="text-slate-700">{{ vehicle.plate }}</strong> • {{ vehicle.category }}
                      </p>
                    </div>
                  </div>

                  <!-- Status Badge -->
                  <div class="flex items-center gap-2 shrink-0">
                    <span :class="[
                      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border',
                      stagedVehicle?.id === vehicle.id ? 'bg-blue-600 text-white border-blue-600' :
                      vehicle.status === 'In Use' ? 'bg-amber-50 text-amber-700 border-amber-200/80' :
                      vehicle.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80' :
                      'bg-rose-50 text-rose-700 border-rose-200/80'
                    ]">
                      <span :class="['w-1.5 h-1.5 rounded-full', stagedVehicle?.id === vehicle.id ? 'bg-white' : vehicle.status === 'In Use' ? 'bg-amber-500' : vehicle.status === 'Available' ? 'bg-emerald-500' : 'bg-rose-500']"></span>
                      {{ stagedVehicle?.id === vehicle.id ? 'Selected' : vehicle.status }}
                    </span>
                  </div>
                </div>

                <!-- Specs Pill -->
                <div class="text-[10px] font-bold text-slate-500 bg-slate-50 rounded-xl px-3 py-1.5 flex items-center justify-between border border-slate-100">
                  <span>{{ vehicle.fuel || 'Fuel' }} • {{ vehicle.engine || 'Standard' }}</span>
                  <span class="text-slate-400">{{ vehicle.model ? `${vehicle.model} Model` : '' }}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </template>

    <template #modal-overlay>
    <!-- Ticket Detail Modal Overlay -->
      <div v-if="showTicketModal" class="fixed inset-0 z-[60] overflow-y-auto custom-scrollbar pointer-events-auto bg-slate-900/60 backdrop-blur-sm animate-fade-in">
        <div class="flex min-h-[100dvh] items-center justify-center p-4 md:p-8" @click.self="showTicketModal = false">
        
        <!-- Modal Content -->
        <div class="bg-[#F8FAFC] w-full max-w-4xl h-fit rounded-[3rem] shadow-2xl overflow-hidden relative z-10 animate-scale-up border border-slate-200">
          <div class="bg-slate-900 p-8 text-white flex justify-between items-end border-b-4 border-emerald-500">
            <div>
              <span class="px-3 py-1 bg-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-3 inline-block">Trip Request</span>
              <h3 class="text-3xl font-black tracking-tighter">{{ modalTicket?.destination }} <span class="text-emerald-500">({{ modalTicket?.id }})</span></h3>
              <p class="text-slate-400 mt-1 font-bold">Planned Date: {{ modalTicket?.date }} | Time: {{ modalTicket?.time }}</p>
            </div>
            <button @click="showTicketModal = false" class="absolute top-6 right-8 text-slate-400 hover:text-white transition-colors cursor-pointer">
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

            <div class="grid grid-cols-1 gap-8">
              <div class="space-y-3">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Purpose of Travel / Details</label>
                <div class="w-full px-6 py-5 rounded-2xl bg-white border border-slate-100 shadow-sm text-sm font-bold text-slate-700 leading-relaxed min-h-[80px]">
                  {{ modalTicket?.purpose || modalTicket?.places_to_visit || 'No details provided.' }}
                </div>
              </div>
            </div>
            <div class="grid grid-cols-1 gap-8">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date of Trip</label>
                <p class="text-sm font-bold text-slate-900 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">{{ modalTicket?.date }}</p>
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
            <button @click="showTicketModal = false" class="px-8 py-3 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-600/20 active:scale-95 cursor-pointer">
              Close Detail View
            </button>
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
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import DocumentViewerModal from '@/components/DocumentViewerModal.vue';
import { useTasuPersonnelStore } from '@/stores/tasuPersonnel';
import { useTasuVehiclesStore } from '@/stores/tasuVehicles';
import { toast } from 'vue3-toastify';
import api from '@/api/client';
import { generateDocxBlob } from '@/utils/docxGenerator';

import { isDocxFile, isPdfFile, handleAttachmentClick, downloadAttachmentDirectly } from '@/utils/attachmentHelper';

const viewerModal = reactive({
  isOpen: false,
  title: '',
  fileName: '',
  fileBlob: null
});

const downloadAttachment = async (att) => {
  if (typeof att === 'string') return;
  await handleAttachmentClick(att, (blob, att) => {
    viewerModal.title = att.file_name || 'Document Attachment';
    viewerModal.fileName = att.file_name || 'attachment.pdf';
    viewerModal.fileBlob = blob;
    viewerModal.isOpen = true;
  });
};

const route = useRoute();
const router = useRouter();
const store = useTasuPersonnelStore();
const vehicleStore = useTasuVehiclesStore();

const showTicketModal = ref(false);
const modalTicket = ref(null);

const openTicketModal = (trip) => {
  modalTicket.value = trip;
  showTicketModal.value = true;
};

// Selection State
const selectedTrip = ref(null);
const stagedDriver = ref(null);
const stagedVehicle = ref(null);
const assignmentsToDispatch = ref([]);

// Search & Filter State
const driverSearchQuery = ref('');
const driverStatusFilter = ref('available'); // 'available' | 'all' | 'busy'

const vehicleSearchQuery = ref('');
const vehicleCategoryFilter = ref('all'); // 'all' | category name

const allDrivers = computed(() => store.personnel || []);
const allVehicles = computed(() => vehicleStore.vehicles || []);

const availableDriversCount = computed(() => {
  return allDrivers.value.filter(d => d.status === 'Available' && !d.assignedTicket).length;
});

const availableVehiclesCount = computed(() => {
  return allVehicles.value.filter(v => v.status === 'Available').length;
});

const filteredDrivers = computed(() => {
  return allDrivers.value.filter(driver => {
    const q = driverSearchQuery.value.toLowerCase().trim();
    const matchesSearch = !q ||
      driver.name.toLowerCase().includes(q) ||
      (driver.role && driver.role.toLowerCase().includes(q));

    let matchesStatus = true;
    if (driverStatusFilter.value === 'available') {
      matchesStatus = driver.status === 'Available' && !driver.assignedTicket;
    } else if (driverStatusFilter.value === 'busy') {
      matchesStatus = driver.status === 'On Trip' || !!driver.assignedTicket || driver.status === 'On Leave';
    }

    return matchesSearch && matchesStatus;
  });
});

const vehicleCategories = computed(() => {
  const cats = ['all'];
  allVehicles.value.forEach(v => {
    if (v.category && !cats.includes(v.category)) {
      cats.push(v.category);
    }
  });
  return cats;
});

const filteredVehicles = computed(() => {
  return allVehicles.value.filter(vehicle => {
    const q = vehicleSearchQuery.value.toLowerCase().trim();
    const matchesSearch = !q ||
      vehicle.name.toLowerCase().includes(q) ||
      vehicle.plate.toLowerCase().includes(q) ||
      (vehicle.category && vehicle.category.toLowerCase().includes(q));

    let matchesCategory = true;
    if (vehicleCategoryFilter.value !== 'all') {
      matchesCategory = vehicle.category === vehicleCategoryFilter.value;
    }

    return matchesSearch && matchesCategory;
  });
});

const selectDriver = (driver) => {
  if (driver.status === 'On Trip' || driver.status === 'On Leave' || driver.assignedTicket) {
    if (driver.assignedTicket) {
      toast.info(`Driver ${driver.name} is currently assigned to #${driver.assignedTicket}.`);
    } else if (driver.status === 'On Trip') {
      toast.info(`Driver ${driver.name} is currently on trip.`);
    } else {
      toast.info(`Driver ${driver.name} is currently on leave.`);
    }
    return;
  }
  if (stagedDriver.value?.id === driver.id) {
    stagedDriver.value = null; // deselect
  } else {
    stagedDriver.value = driver;
  }
};

const selectVehicle = (vehicle) => {
  if (vehicle.status !== 'Available') {
    toast.info(`Vehicle ${vehicle.name} (${vehicle.plate}) is currently ${vehicle.status.toLowerCase()}.`);
    return;
  }
  if (stagedVehicle.value?.id === vehicle.id) {
    stagedVehicle.value = null; // deselect
  } else {
    stagedVehicle.value = vehicle;
  }
};

const fetchTripDetails = async (id) => {
  try {
    const response = await api.get(`tickets/${id}`);
    if (response.data?.data?.ticket) {
      const t = response.data.data.ticket;
      const details = t.details || t.tasu_details || {};
      selectedTrip.value = {
        id: t.id,
        destination: details.destination || t.location || 'Unknown',
        date: new Date(details.date_of_travel || t.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: 'N/A',
        return_time: 'N/A',
        requester: details.requesting_personnel || details.requestingPersonnel || t.user_name || 'Unknown Requester',
        office: details.office_college_department || details.agency_address || 'Unknown Office',
        passengers: details.num_passengers ?? details.number_of_passengers ?? details.numberOfPassengers ?? t.num_passengers ?? 0,
        places_to_visit: details.destination || 'N/A',
        purpose: details.purpose_of_travel || t.description || 'N/A',
        attachments: t.attachments || [],
      };
    }
  } catch (err) { 
    console.error('Failed to load trip', err);
    toast.error('Could not load trip details.');
  }
};

onMounted(() => {
  const tripId = route.query.trip;
  if (tripId) {
    fetchTripDetails(tripId);
  }
  store.fetchPersonnel();
  vehicleStore.fetchVehicles();
});

const stageAssignment = () => {
  if (!stagedDriver.value || !stagedVehicle.value) {
     toast.error('Please select both a driver and a vehicle.');
     return;
  }
  assignmentsToDispatch.value.push({
    driverId: stagedDriver.value.id,
    driverName: stagedDriver.value.name,
    vehicleId: stagedVehicle.value.id,
    vehicleName: stagedVehicle.value.name,
    vehiclePlate: stagedVehicle.value.plate,
    implementationDate: selectedTrip.value.date
  });
  stagedDriver.value = null;
  stagedVehicle.value = null;
  toast.success('Assignment staged! Click "Confirm & Dispatch" to finalize.');
};

const dispatchAll = async () => {
  if (!selectedTrip.value || assignmentsToDispatch.value.length === 0) return;
  
  try {
    for (const assign of assignmentsToDispatch.value) {
       await api.post('dispatch/assign', {
         ticket_id: selectedTrip.value.id,
         personnel_id: assign.driverId,
         vehicle_id: assign.vehicleId,
         implementation_date: assign.implementationDate
       });
       
       // Generate and attach documents
       try {
          const dateFormatted = selectedTrip.value.date ? new Date(selectedTrip.value.date).toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric'
          }) : '';
          
          const tripIdStr = String(selectedTrip.value.id || '');
          const vehicleAndPlate = [assign.vehicleName, assign.vehiclePlate].filter(Boolean).join(' - ');

          const templateData = {
            // Ticket Numbers & IDs
            ticket_id: tripIdStr,
            ticket_number: tripIdStr,
            ticket_no: tripIdStr,
            ticketNumber: tripIdStr,
            'Ticket Number': tripIdStr,
            'Ticket No': tripIdStr,
            'Ticket ID': tripIdStr,

            // Driver
            driver_name: assign.driverName || '',
            driver_full_name: assign.driverName || '',
            driverName: assign.driverName || '',
            'Driver Name': assign.driverName || '',
            'Driver Full Name': assign.driverName || '',
            'Drivers Full Name': assign.driverName || '',
            driver: assign.driverName || '',

            // Destination
            destination: selectedTrip.value.destination || '',
            'Destination': selectedTrip.value.destination || '',
            places_to_visit: selectedTrip.value.places_to_visit || selectedTrip.value.destination || '',

            // Dates & Times
            date_of_travel: selectedTrip.value.date || '',
            travel_date: selectedTrip.value.date || '',
            'travel date': dateFormatted || selectedTrip.value.date || '',
            date: dateFormatted || selectedTrip.value.date || '',
            'Date of Travel': dateFormatted || selectedTrip.value.date || '',
            'Travel Date': dateFormatted || selectedTrip.value.date || '',
            'Date': dateFormatted || selectedTrip.value.date || '',
            request_time: selectedTrip.value.time || '',
            time: selectedTrip.value.time || '',
            'Time': selectedTrip.value.time || '',
            'Request Time': selectedTrip.value.time || '',

            // Requester & Office
            requesting_personnel: selectedTrip.value.requester || '',
            requester: selectedTrip.value.requester || '',
            'Requesting Personnel': selectedTrip.value.requester || '',
            'Requester': selectedTrip.value.requester || '',
            office_college_department: selectedTrip.value.office || '',
            office: selectedTrip.value.office || '',
            department: selectedTrip.value.office || '',
            'Office': selectedTrip.value.office || '',

            // Passengers & Purpose
            num_passengers: String(selectedTrip.value.passengers ?? ''),
            passengers: String(selectedTrip.value.passengers ?? ''),
            'Number of Passengers': String(selectedTrip.value.passengers ?? ''),
            'Passengers': String(selectedTrip.value.passengers ?? ''),
            purpose_of_travel: selectedTrip.value.purpose || '',
            purpose: selectedTrip.value.purpose || '',
            'Purpose of Travel': selectedTrip.value.purpose || '',
            'Purpose': selectedTrip.value.purpose || '',

            // Vehicle & Plate
            vehicle_name: assign.vehicleName || '',
            vehicle: assign.vehicleName || '',
            'Vehicle Name': assign.vehicleName || '',
            'Vehicle': assign.vehicleName || '',
            plate_no: assign.vehiclePlate || '',
            plate_number: assign.vehiclePlate || '',
            'Plate Number': assign.vehiclePlate || '',
            'Plate No': assign.vehiclePlate || '',
            vehicle_and_plate: vehicleAndPlate,
            'BSU Vehicle & Plate Number': vehicleAndPlate,
            'Vehicle & Plate Number': vehicleAndPlate,
          };
          
          const travelOrderBlob = await generateDocxBlob('/templates/Driver Travel Order.docx', templateData);
          const tripTicketBlob = await generateDocxBlob('/templates/Trip Ticket.docx', templateData);
          
          const formData = new FormData();
          formData.append('attachments[]', travelOrderBlob, `Driver Travel Order - ${selectedTrip.value.id}.docx`);
          formData.append('attachments[]', tripTicketBlob, `Trip Ticket - ${selectedTrip.value.id}.docx`);
          
          await api.post(`tickets/${selectedTrip.value.id}/attachments`, formData, {
            headers: { 'Content-Type': undefined }
          });
       } catch (docErr) {
          console.error('Document auto-generation failed:', docErr);
          const backendErrors = docErr.response?.data?.errors;
          const backendMsg = docErr.response?.data?.message || docErr.message;
          const fullErr = Array.isArray(backendErrors) ? `${backendMsg} (${backendErrors.join(', ')})` : backendMsg;
          console.error('Backend error response:', docErr.response?.data);
          toast.warning(`Dispatch successful, but document auto-generation failed: ${fullErr}`);
       }
    }
    toast.success(`Successfully dispatched assignments!`);
    assignmentsToDispatch.value = [];
    router.push('/dispatcher/tasu');
  } catch (e) {
    console.error(e);
    toast.error('Failed to dispatch assignments.');
  }
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
