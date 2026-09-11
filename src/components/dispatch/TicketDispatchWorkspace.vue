<template>
  <div class="space-y-6 pb-12 px-4 sm:px-6 lg:px-8 py-6 max-w-[1750px] mx-auto min-h-screen">
    
    <!-- ═══ Selected Ticket Target Banner ═══ -->
    <div
      v-if="selectedTicket"
      class="p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white shadow-xl relative overflow-hidden border border-emerald-500/30 animate-scale-up space-y-6"
    >
      <div class="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <!-- Top Row: Ticket Overview & Action Buttons -->
      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div class="flex items-center gap-3 mb-2 flex-wrap">
            <span class="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-xs">
              Active Assignment Target
            </span>
            <span class="text-sm font-black text-emerald-400 bg-white/10 px-3 py-1 rounded-full border border-white/10">
              #{{ selectedTicket.id }}
            </span>
            <span
              v-if="selectedTicket.is_emergency"
              class="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider animate-pulse"
            >
              Emergency
            </span>
            <span v-if="selectedTicket.requester" class="text-xs text-slate-300 font-medium">
              Requested by <strong class="text-white">{{ selectedTicket.requester }}</strong>
            </span>
          </div>
          <h3 class="text-2xl font-black text-white tracking-tight">
            {{ selectedTicket.type || selectedTicket.title || 'Facilities Service Request' }}
          </h3>
          <p class="text-slate-300 font-medium text-xs sm:text-sm mt-1 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {{ selectedTicket.location || selectedTicket.college_building || 'Campus Facility' }}
            <span v-if="selectedTicket.office_room">({{ selectedTicket.office_room }})</span>
          </p>
        </div>

        <div class="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            @click="openTicketScopeModal"
            class="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-black rounded-xl transition-all border border-white/10 cursor-pointer"
          >
            Review Scope &amp; Files
          </button>
          <button
            type="button"
            @click="clearSelectedTicket"
            class="p-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-white rounded-xl transition-colors border border-rose-500/30 cursor-pointer"
            title="Deselect ticket"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      <!-- Bottom Row: Scheduling & Turnaround Configuration Controls -->
      <div class="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 pt-2">
        <!-- Implementation Date Picker -->
        <div class="flex items-center gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10 hover:border-emerald-400/50 transition-all">
          <div class="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-400/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="flex flex-col flex-1 min-w-0">
            <label for="sched-date" class="text-[10px] font-black text-slate-300 uppercase tracking-widest cursor-pointer">
              Implementation Date <span class="text-rose-400">*</span>
            </label>
            <input
              id="sched-date"
              type="date"
              :min="todayIsoDate"
              v-model="implementationDate"
              class="bg-transparent text-white text-sm font-black outline-none cursor-pointer mt-0.5"
            />
          </div>
        </div>

        <!-- Target Working Days -->
        <div class="flex items-center gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10 hover:border-emerald-400/50 transition-all">
          <div class="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-400/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="flex flex-col flex-1 min-w-0">
            <label for="sched-days" class="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              Working Days <span class="text-rose-400">*</span>
            </label>
            <input
              id="sched-days"
              type="number"
              min="1"
              max="90"
              v-model="workingDays"
              placeholder="e.g. 5"
              class="bg-transparent text-white text-sm font-black outline-none w-full mt-0.5 placeholder:text-slate-500"
            />
          </div>
        </div>

        <!-- EODB SLA Basis Preset Chips -->
        <div class="flex flex-col justify-center gap-1.5 bg-white/5 p-3.5 rounded-2xl border border-white/10">
          <span class="text-[10px] font-black text-slate-300 uppercase tracking-widest">EODB SLA Basis (RA 11032)</span>
          <div class="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              @click="setEodbTier('simple')"
              :class="eodbTier === 'simple' ? 'bg-emerald-500 text-white font-black shadow-xs' : 'bg-white/10 text-slate-300 hover:bg-white/20'"
              class="px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
            >
              Simple (3d)
            </button>
            <button
              type="button"
              @click="setEodbTier('moderate')"
              :class="eodbTier === 'moderate' ? 'bg-amber-500 text-white font-black shadow-xs' : 'bg-white/10 text-slate-300 hover:bg-white/20'"
              class="px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
            >
              Moderate (7d)
            </button>
            <button
              type="button"
              @click="setEodbTier('complex')"
              :class="eodbTier === 'complex' ? 'bg-purple-500 text-white font-black shadow-xs' : 'bg-white/10 text-slate-300 hover:bg-white/20'"
              class="px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
            >
              Complex (21d)
            </button>
          </div>
        </div>

        <!-- Emergency / Priority Preemption -->
        <div class="flex flex-col justify-center gap-1.5 bg-rose-950/40 p-3.5 rounded-2xl border border-rose-500/30">
          <label class="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              v-model="isEmergency"
              class="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-rose-400 bg-white/10"
            />
            <span class="text-[10px] font-black uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              Emergency Preemption
            </span>
          </label>
          <div v-if="isEmergency" class="flex items-center gap-2 pt-1 border-t border-rose-500/20">
            <input
              id="pause-current-check"
              type="checkbox"
              v-model="pauseCurrentTask"
              class="w-3.5 h-3.5 rounded text-rose-600 focus:ring-rose-500 border-rose-400 bg-white/10"
            />
            <label for="pause-current-check" class="text-[9px] font-bold text-rose-200 cursor-pointer">
              Pause active jobs on technician
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ 2B. Empty Target State (When No Ticket Selected) ═══ -->
    <div
      v-else
      class="p-8 sm:p-12 rounded-3xl border-2 border-dashed border-slate-200 bg-white text-center flex flex-col items-center justify-center space-y-4 shadow-xs"
    >
      <div
        :class="[
          'w-16 h-16 rounded-2xl flex items-center justify-center border shadow-xs',
          unitCode.toUpperCase() === 'LEAU' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
        ]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>

      <div class="max-w-md">
        <h3 class="text-xl font-black text-slate-900 tracking-tight">No Assignment Target Selected</h3>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          Pick an approved service request from the queue to start scheduling technicians, setting implementation dates, and dispatching work orders.
        </p>
      </div>

      <div class="flex items-center gap-3 pt-2">
        <router-link
          :to="`/admin/${unitCode.toLowerCase()}/approved-tickets`"
          :class="[
            'px-5 py-2.5 rounded-xl text-white text-xs font-black transition-all shadow-xs active:scale-95 cursor-pointer inline-flex items-center gap-2',
            unitCode.toUpperCase() === 'LEAU' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
          ]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span>Select from Approved Ticket Queue ({{ dispatchQueue.length }})</span>
        </router-link>
      </div>
    </div>

    <!-- ═══ 3. Current Assignments Panel (Shown when technicians are assigned to the target) ═══ -->
    <div
      v-if="selectedTicket && currentAssignments.length > 0"
      class="p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-lg border border-slate-800 space-y-4 animate-scale-up"
    >
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div class="flex items-center gap-2.5">
          <span class="w-2.5 h-6 bg-emerald-500 rounded-full"></span>
          <div>
            <h3 class="text-base sm:text-lg font-black text-white leading-tight">
              Assigned Workforce for #{{ selectedTicket.id }}
            </h3>
            <p class="text-xs text-slate-400">
              Review assigned staff below before finalizing order dispatch.
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black">
            {{ currentAssignments.length }} Assigned
          </span>

          <!-- Confirm & Dispatch All Button -->
          <button
            type="button"
            @click="dispatchAll"
            :disabled="isDispatching"
            class="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <svg
              v-if="isDispatching"
              class="animate-spin h-4 w-4 text-slate-950"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span>{{ isDispatching ? 'Dispatching...' : 'Confirm & Dispatch Work Order' }}</span>
          </button>
        </div>
      </div>

      <!-- Assigned Workers Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        <div
          v-for="assign in currentAssignments"
          :key="assign.workerId"
          class="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center font-black text-xs shrink-0">
              {{ getInitials(assign.workerName) }}
            </div>
            <div class="min-w-0">
              <h5 class="text-xs font-black text-white truncate">{{ assign.workerName }}</h5>
              <span class="text-[10px] text-slate-400 block truncate">{{ assign.specialty || 'General Technician' }}</span>
            </div>
          </div>

          <button
            type="button"
            @click="removeAssignment(assign)"
            class="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Remove from assignment"
          >
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- ═══ 4. Available Personnel Section ═══ -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-6">
      
      <!-- Section Header & Legend -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 class="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2.5">
            <span class="w-2.5 h-6 bg-emerald-500 rounded-full"></span>
            Available Personnel
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">
            Select technicians below to assign them to the active target request.
          </p>
        </div>

        <!-- Status Legend & Refresh -->
        <div class="flex items-center gap-3 sm:gap-4 flex-wrap text-[10px] font-bold uppercase tracking-wider text-slate-500">
          <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Available ({{ availableCount }})
          </span>
          <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-blue-500"></span> Assigned ({{ currentAssignments.length }})
          </span>
          <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span> Working ({{ workingCount }})
          </span>
          <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-rose-400"></span> On Leave ({{ onLeaveCount }})
          </span>
          <button
            type="button"
            @click="refreshData"
            :disabled="loadingTickets"
            class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer active:scale-95 disabled:opacity-50"
            title="Refresh workforce roster and queue"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3.5 w-3.5"
              :class="{ 'animate-spin': loadingTickets }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Search & Specialty Category Filter Bar -->
      <div class="space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="relative flex-1 max-w-md">
            <input
              v-model="personnelSearch"
              type="text"
              placeholder="Search technician by name, specialty, or phone..."
              class="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 bg-slate-50/60 transition-all placeholder:text-slate-400"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- Status Quick Filter Pills -->
          <div class="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/60 text-xs font-bold">
            <button
              type="button"
              @click="personnelStatusFilter = 'all'"
              :class="['px-3 py-1 rounded-lg transition-all cursor-pointer', personnelStatusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-500 hover:text-slate-800']"
            >
              All ({{ store.personnel.length }})
            </button>
            <button
              type="button"
              @click="personnelStatusFilter = 'Available'"
              :class="['px-3 py-1 rounded-lg transition-all cursor-pointer', personnelStatusFilter === 'Available' ? 'bg-emerald-600 text-white shadow-xs font-black' : 'text-emerald-700 hover:bg-emerald-50']"
            >
              Available
            </button>
            <button
              type="button"
              @click="personnelStatusFilter = 'Working'"
              :class="['px-3 py-1 rounded-lg transition-all cursor-pointer', personnelStatusFilter === 'Working' ? 'bg-amber-600 text-white shadow-xs font-black' : 'text-amber-700 hover:bg-amber-50']"
            >
              Working
            </button>
            <button
              type="button"
              @click="personnelStatusFilter = 'On Leave'"
              :class="['px-3 py-1 rounded-lg transition-all cursor-pointer', personnelStatusFilter === 'On Leave' ? 'bg-rose-600 text-white shadow-xs font-black' : 'text-rose-700 hover:bg-rose-50']"
            >
              On Leave
            </button>
          </div>
        </div>

        <!-- Specialty Category Chips -->
        <div v-if="store.categories && store.categories.length > 0" class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pt-1 text-xs">
          <button
            type="button"
            @click="personnelCategoryFilter = 'all'"
            :class="['px-3 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap', personnelCategoryFilter === 'all' ? 'bg-slate-800 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
          >
            All Specialties
          </button>
          <button
            v-for="cat in store.categories"
            :key="cat.id"
            type="button"
            @click="personnelCategoryFilter = cat.name"
            :class="['px-3 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap', personnelCategoryFilter === cat.name ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
          >
            {{ cat.name }}
          </button>
        </div>
      </div>

      <!-- Personnel Cards Grid -->
      <div v-if="filteredPersonnel.length === 0" class="py-16 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        No personnel found matching the specified filters.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div
          v-for="worker in filteredPersonnel"
          :key="worker.id"
          class="p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3.5 bg-white shadow-xs"
          :class="[
            isWorkerAssigned(worker.id)
              ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10'
              : 'border-slate-200/90 hover:border-slate-300'
          ]"
        >
          <!-- Worker Top Info -->
          <div>
            <div class="flex items-start justify-between gap-2.5 mb-2.5">
              <div class="flex items-center gap-2.5 min-w-0">
                <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-black text-xs shrink-0 border border-slate-200">
                  {{ getInitials(worker.name) }}
                </div>
                <div class="min-w-0">
                  <h4 class="text-xs font-black text-slate-900 truncate leading-tight">{{ worker.name }}</h4>
                  <span class="text-[11px] font-bold text-slate-500 truncate block mt-0.5">
                    {{ worker.specialty || worker.role || 'General Staff' }}
                  </span>
                </div>
              </div>

              <!-- Status Badge -->
              <span
                :class="[
                  'px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0 border',
                  worker.status === 'Available'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : worker.status === 'Working'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                ]"
              >
                {{ worker.status }}
              </span>
            </div>

            <!-- Current Work Info Box -->
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
              <div class="flex items-center justify-between text-slate-600">
                <span class="text-slate-400 font-bold text-[10px]">Contact:</span>
                <span class="font-bold text-slate-800">{{ worker.contact_number || 'N/A' }}</span>
              </div>
              <div class="flex items-center justify-between text-slate-600">
                <span class="text-slate-400 font-bold text-[10px]">Active Work:</span>
                <span v-if="worker.status === 'Working' || worker.assignedTicket" class="font-black text-amber-700 truncate max-w-[130px]">
                  #{{ worker.assignedTicket }} {{ worker.ticketTask ? '· ' + worker.ticketTask : '' }}
                </span>
                <span v-else class="font-bold text-emerald-700">None (Idle)</span>
              </div>
            </div>
          </div>

          <!-- Worker Card Actions -->
          <div class="pt-2 border-t border-slate-100 flex items-center gap-2">
            <!-- Assignment CTA -->
            <button
              v-if="selectedTicket && !isWorkerAssigned(worker.id) && worker.status !== 'On Leave'"
              type="button"
              @click="assignWorkerToTicket(worker)"
              :class="[
                'flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all shadow-xs active:scale-95 cursor-pointer flex items-center justify-center gap-1.5',
                isEmergency
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              ]"
            >
              <svg v-if="isEmergency" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>{{ isEmergency ? '⚡ Preempt & Assign' : '+ Assign to Ticket' }}</span>
            </button>

            <!-- Already Assigned Indicator -->
            <button
              v-else-if="selectedTicket && isWorkerAssigned(worker.id)"
              type="button"
              @click="removeAssignment({ workerId: worker.id, workerName: worker.name })"
              class="flex-1 py-2 px-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-300 hover:bg-rose-100 hover:text-rose-800 hover:border-rose-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              title="Click to remove from assignment"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>Assigned (Remove)</span>
            </button>

            <!-- Disabled if On Leave -->
            <div
              v-else-if="worker.status === 'On Leave'"
              class="flex-1 py-2 px-3 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold text-center border border-slate-200 cursor-not-allowed"
            >
              On Leave (Unavailable)
            </div>

            <!-- Prompt to select ticket first if none is active -->
            <router-link
              v-else
              :to="`/admin/${unitCode.toLowerCase()}/approved-tickets`"
              class="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold text-center transition-colors cursor-pointer block"
            >
              Select Ticket to Assign
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ 5. Scope & Attachments Modal ═══ -->
    <Teleport to="body">
      <div
        v-if="showScopeModal && selectedTicket"
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
        @click.self="showScopeModal = false"
      >
        <div class="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[calc(100dvh-4rem)] sm:max-h-[calc(100dvh-5rem)] flex flex-col overflow-hidden animate-scale-up">
          <div class="p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
            <div class="flex items-center gap-2.5">
              <span
                :class="[
                  'px-2.5 py-1 text-xs font-black rounded-lg',
                  unitCode.toUpperCase() === 'LEAU' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                ]"
              >
                #{{ selectedTicket.id }}
              </span>
              <h3 class="text-base font-black text-slate-900">{{ selectedTicket.service || selectedTicket.type }}</h3>
            </div>
            <button
              @click="showScopeModal = false"
              class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div class="p-5 overflow-y-auto space-y-4 text-xs custom-scrollbar flex-1">
            <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div class="flex justify-between"><span class="text-slate-400 font-bold">Requester:</span><span class="font-black text-slate-900">{{ selectedTicket.requester }}</span></div>
              <div class="flex justify-between"><span class="text-slate-400 font-bold">Contact:</span><span class="font-bold text-slate-800">{{ selectedTicket.contact_number || 'N/A' }}</span></div>
              <div class="flex justify-between"><span class="text-slate-400 font-bold">Location:</span><span class="font-bold text-slate-800">{{ selectedTicket.location || selectedTicket.college_building }}</span></div>
              <div class="flex justify-between"><span class="text-slate-400 font-bold">Room:</span><span class="font-bold text-slate-800">{{ selectedTicket.office_room || 'N/A' }}</span></div>
            </div>

            <div>
              <h4 class="text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Job Description &amp; Scope</h4>
              <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 whitespace-pre-wrap leading-relaxed">
                {{ selectedTicket.job_description || 'No detailed scope provided.' }}
              </div>
            </div>

            <div>
              <h4 class="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Attached Files ({{ (selectedTicket.attachments || []).length }})</h4>
              <div v-if="!selectedTicket.attachments || selectedTicket.attachments.length === 0" class="p-3.5 rounded-xl bg-slate-50 text-slate-400 text-center">
                No files attached.
              </div>
              <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div
                  v-for="att in selectedTicket.attachments"
                  :key="att.id"
                  class="p-2.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2"
                >
                  <span class="font-bold text-slate-800 truncate text-xs">{{ att.file_name || 'Attachment' }}</span>
                  <button
                    type="button"
                    @click="downloadAttachment(att)"
                    class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold shrink-0 cursor-pointer"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
            <button
              @click="showScopeModal = false"
              class="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/client';
import { toast } from 'vue3-toastify';

const props = defineProps({
  unitCode: {
    type: String,
    required: true
  },
  unitTitle: {
    type: String,
    default: ''
  },
  store: {
    type: Object,
    required: true
  }
});

const route = useRoute();
const router = useRouter();

const loadingTickets = ref(false);
const isDispatching = ref(false);
const dispatchQueue = ref([]);
const selectedTicket = ref(null);
const currentAssignments = ref([]);

// Schedule form state
const todayIsoDate = new Date().toISOString().split('T')[0];
const implementationDate = ref(todayIsoDate);
const workingDays = ref(5);
const eodbTier = ref('moderate');
const isEmergency = ref(false);
const pauseCurrentTask = ref(false);
const taskNotes = ref('');

// Personnel filter state
const personnelSearch = ref('');
const personnelStatusFilter = ref('all');
const personnelCategoryFilter = ref('all');

// Modals
const showScopeModal = ref(false);

const availableCount = computed(() => {
  return (props.store?.personnel || []).filter(w => w.status === 'Available').length;
});

const workingCount = computed(() => {
  return (props.store?.personnel || []).filter(w => w.status === 'Working').length;
});

const onLeaveCount = computed(() => {
  return (props.store?.personnel || []).filter(w => w.status === 'On Leave').length;
});

const setEodbTier = (tier) => {
  eodbTier.value = tier;
  if (tier === 'simple') workingDays.value = 3;
  else if (tier === 'moderate') workingDays.value = 7;
  else if (tier === 'complex') workingDays.value = 21;
};

const getInitials = (name) => {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const isWorkerAssigned = (workerId) => {
  return currentAssignments.value.some(a => a.workerId === workerId);
};

const filteredPersonnel = computed(() => {
  let list = props.store?.personnel || [];

  if (personnelStatusFilter.value !== 'all') {
    list = list.filter(w => w.status === personnelStatusFilter.value);
  }

  if (personnelCategoryFilter.value !== 'all') {
    list = list.filter(w => w.specialty === personnelCategoryFilter.value);
  }

  if (personnelSearch.value.trim()) {
    const q = personnelSearch.value.toLowerCase().trim();
    list = list.filter(w =>
      w.name.toLowerCase().includes(q) ||
      (w.specialty && w.specialty.toLowerCase().includes(q)) ||
      (w.contact_number && w.contact_number.includes(q))
    );
  }

  return list;
});

const selectTicket = (ticket) => {
  selectedTicket.value = ticket;
  currentAssignments.value = [];
  isEmergency.value = !!ticket.is_emergency;
  if (ticket.implementationDate) {
    implementationDate.value = ticket.implementationDate;
  }
};

const clearSelectedTicket = () => {
  selectedTicket.value = null;
  currentAssignments.value = [];
  router.replace({ query: {} });
};

const assignWorkerToTicket = (worker) => {
  if (!selectedTicket.value) {
    toast.error('Please select an approved ticket first.');
    return;
  }
  if (!implementationDate.value) {
    toast.error('Please select an implementation date.');
    return;
  }
  if (!workingDays.value || Number(workingDays.value) < 1) {
    toast.error('Please specify target working days.');
    return;
  }

  if (isWorkerAssigned(worker.id)) {
    toast.info(`${worker.name} is already assigned to this ticket.`);
    return;
  }

  currentAssignments.value.push({
    workerId: worker.id,
    workerName: worker.name,
    specialty: worker.specialty || worker.role
  });

  toast.success(`${worker.name} assigned to #${selectedTicket.value.id}`);
};

const removeAssignment = (assign) => {
  currentAssignments.value = currentAssignments.value.filter(a => a.workerId !== assign.workerId);
  toast.info(`Removed ${assign.workerName} from ticket assignment.`);
};

const dispatchAll = async () => {
  if (!selectedTicket.value) return;
  if (currentAssignments.value.length === 0) {
    toast.error('Please assign at least one worker before dispatching.');
    return;
  }
  if (!implementationDate.value) {
    toast.error('Please specify an implementation date.');
    return;
  }
  if (!workingDays.value || Number(workingDays.value) < 1) {
    toast.error('Please specify valid working days.');
    return;
  }

  isDispatching.value = true;
  try {
    for (const assign of currentAssignments.value) {
      await api.post('dispatch/assign', {
        ticket_id: selectedTicket.value.id,
        personnel_id: assign.workerId,
        implementation_date: implementationDate.value,
        working_days: Number(workingDays.value),
        task_notes: taskNotes.value.trim() || selectedTicket.value.service || selectedTicket.value.type || 'Maintenance Task',
        is_emergency: isEmergency.value ? 1 : 0,
        pause_current: pauseCurrentTask.value ? 1 : 0
      });
    }

    toast.success(`Workers successfully dispatched for #${selectedTicket.value.id}!`);
    await fetchDispatchQueue();
    clearSelectedTicket();
    router.push(`/admin/${props.unitCode.toLowerCase()}/dispatched`);
  } catch (error) {
    console.error('Dispatch assignment failed:', error);
    toast.error('Failed to dispatch workers. Please verify network connection.');
  } finally {
    isDispatching.value = false;
  }
};

const openTicketScopeModal = () => {
  showScopeModal.value = true;
};

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
    toast.error('Failed to download attachment.');
  }
};

const fetchDispatchQueue = async () => {
  loadingTickets.value = true;
  try {
    const res = await api.get(`tickets/dispatch/${props.unitCode}`);
    const rawData = res.data?.data?.tickets || res.data?.data || [];
    if (Array.isArray(rawData)) {
      dispatchQueue.value = rawData.map(t => ({
        id: t.id,
        title: t.title,
        service: t.service_type,
        type: t.title || t.project_title || t.service_type || t.type || 'Service Request',
        location: t.location || t.college_building || 'Campus Facility',
        college_building: t.details?.college_building || t.college_building || t.location,
        office_room: t.details?.office_room || t.office_room,
        source_of_fund: t.details?.source_of_fund || 'N/A',
        contact_number: t.details?.contact_number || 'N/A',
        requester: t.details?.requesting_personnel || t.requester || (t.user ? `${t.user.first_name} ${t.user.last_name}` : 'End User'),
        status: t.status,
        is_emergency: !!(t.is_emergency || t.urgency === 'High' || t.urgency === 'Emergency'),
        job_description: t.description || t.job_description || '',
        attachments: t.attachments || [],
        submitted_at: t.submitted_at || t.created_at,
        submittedAt: new Date(t.submitted_at || t.created_at).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        }),
        implementationDate: new Date().toISOString().split('T')[0]
      }));

      // If route query ticket is provided, auto-select it
      checkRouteQueryTicket();
    }
  } catch (err) {
    console.error(`Failed to fetch ${props.unitCode} dispatch queue:`, err);
  } finally {
    loadingTickets.value = false;
  }
};

const checkRouteQueryTicket = async () => {
  const ticketParam = route.query.ticket;
  if (!ticketParam) return;

  const found = dispatchQueue.value.find(t => String(t.id) === String(ticketParam));
  if (found) {
    selectTicket(found);
  } else {
    // If not found in queue, fetch individual ticket directly
    try {
      const res = await api.get(`tickets/${ticketParam}`);
      const t = res.data?.data?.ticket;
      if (t) {
        selectTicket({
          id: t.id,
          title: t.title,
          service: t.service_type,
          type: t.title || t.project_title || t.service_type || t.type,
          location: t.location,
          college_building: t.details?.college_building || t.location,
          office_room: t.office_room || t.details?.office_room,
          source_of_fund: t.details?.source_of_fund || 'N/A',
          contact_number: t.details?.contact_number || 'N/A',
          requester: t.details?.requesting_personnel || (t.user ? `${t.user.first_name} ${t.user.last_name}` : 'End User'),
          job_description: t.description,
          attachments: t.attachments || [],
          is_emergency: !!(t.is_emergency || t.urgency === 'High' || t.urgency === 'Emergency'),
          submittedAt: new Date(t.submitted_at || t.created_at).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          }),
          implementationDate: new Date().toISOString().split('T')[0]
        });
      }
    } catch (err) {
      console.error('Failed to load query ticket:', err);
    }
  }
};

watch(() => route.query.ticket, () => {
  checkRouteQueryTicket();
});

const refreshData = async () => {
  if (props.store?.fetchPersonnel) {
    await props.store.fetchPersonnel();
  }
  await fetchDispatchQueue();
  toast.info('Workforce roster and ticket queue refreshed.');
};

onMounted(async () => {
  if (props.store?.fetchPersonnel) {
    await props.store.fetchPersonnel();
  }
  if (props.store?.fetchCategories) {
    await props.store.fetchCategories();
  }
  await fetchDispatchQueue();
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
@keyframes scale-up { from { opacity: 0; transform: scale(0.97) translateY(6px); } to { opacity: 1; transform: scale(1) translateY(0); } }
.animate-scale-up { animation: scale-up 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
