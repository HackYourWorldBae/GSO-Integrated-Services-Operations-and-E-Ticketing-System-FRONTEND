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
            Review Full Details
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
      <div class="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <!-- Implementation Date Picker with VueDatePicker -->
        <div class="flex items-center gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10 hover:border-emerald-400/50 transition-all">
          <div class="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-400/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="flex flex-col flex-1 min-w-0">
            <label class="text-[10px] font-black text-slate-300 uppercase tracking-widest cursor-pointer mb-0.5">
              Implementation Date <span class="text-rose-400">*</span>
            </label>
            <VueDatePicker
              v-model="implementationDate"
              model-type="yyyy-MM-dd"
              :min-date="new Date()"
              :format="friendlyDateFormat"
              :auto-apply="true"
              :enable-time-picker="false"
              :teleport="true"
              :dark="true"
              placeholder="Select Implementation Date"
              class="custom-datepicker"
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
            <label for="sched-days" class="text-[10px] font-black text-slate-300 uppercase tracking-widest cursor-pointer">
              Target Working Days <span class="text-rose-400">*</span>
            </label>
            <div class="flex items-center gap-2 mt-0.5">
              <input
                id="sched-days"
                type="number"
                min="1"
                max="90"
                v-model="workingDays"
                placeholder="e.g. 5"
                class="bg-transparent text-white text-sm font-black outline-none w-20 placeholder:text-slate-500"
              />
              <span class="text-xs font-bold text-slate-400">working days</span>
            </div>
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

    <!-- ═══ 5. Full Ticket Details Modal (Matching Approved Tickets Layout) ═══ -->
    <Teleport to="body">
      <div
        v-if="showScopeModal && selectedTicket"
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
        @click.self="showScopeModal = false"
      >
        <div class="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 animate-scale-up flex flex-col max-h-[calc(100dvh-4rem)] sm:max-h-[calc(100dvh-5rem)] overflow-hidden">
          
          <!-- Fixed Modal Header -->
          <div class="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 bg-white">
            <div>
              <div class="flex flex-wrap items-center gap-2.5 mb-1.5">
                <span
                  :class="[
                    'font-mono text-base sm:text-lg font-black px-3.5 py-1 rounded-xl border',
                    unitCode.toUpperCase() === 'LEAU' ? 'text-amber-800 bg-amber-50 border-amber-200' : 'text-emerald-800 bg-emerald-50 border-emerald-200'
                  ]"
                >
                  #{{ selectedTicket.id }}
                </span>
                <span
                  v-if="selectedTicket.is_emergency"
                  class="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-wider"
                >
                  Emergency
                </span>
                <span class="text-xs sm:text-sm font-bold text-slate-400">
                  Submitted on {{ selectedTicket.submittedAt || selectedTicket.date || 'N/A' }}
                </span>
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Full Ticket Information</h3>
              <p class="text-xs text-slate-500 font-medium mt-0.5">Comprehensive institutional job particulars and requester verification</p>
            </div>
            <button
              type="button"
              @click="showScopeModal = false"
              class="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              title="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Scrollable Modal Body -->
          <div class="p-5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 custom-scrollbar text-xs flex-1">
            <!-- Requester & Location Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <!-- Requester Profile -->
              <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Requester Profile</span>
                <p class="text-base sm:text-lg font-black text-slate-900 leading-tight">{{ selectedTicket.requester }}</p>
                <p class="text-xs text-slate-600 font-semibold flex items-center gap-2">
                  <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <span class="truncate">{{ selectedTicket.email || 'No institutional email' }}</span>
                </p>
                <p class="text-xs text-slate-600 font-semibold flex items-center gap-2">
                  <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <span>Contact: {{ selectedTicket.contact_number || 'N/A' }}</span>
                </p>
              </div>

              <!-- Designated Location -->
              <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Designated Location</span>
                <p class="text-base sm:text-lg font-black text-slate-900 leading-tight">{{ selectedTicket.location || selectedTicket.college_building || 'Main Campus' }}</p>
                <p class="text-xs text-slate-600 font-semibold flex items-center gap-2">
                  <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                  <span>{{ selectedTicket.office_room ? `Room / Office: ${selectedTicket.office_room}` : 'No specific room designated' }}</span>
                </p>
              </div>
            </div>

            <!-- Service & Job Particulars -->
            <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <div class="flex items-center justify-between gap-3">
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Job Particular &amp; Nature of Work</span>
                <span
                  :class="[
                    'px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border',
                    unitCode.toUpperCase() === 'LEAU' ? 'bg-amber-100 text-amber-900 border-amber-200' : 'bg-emerald-100 text-emerald-900 border-emerald-200'
                  ]"
                >
                  {{ selectedTicket.service || selectedTicket.type }}
                </span>
              </div>
              <p class="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-wrap bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/70 shadow-2xs">
                {{ selectedTicket.job_description || selectedTicket.description || 'No detailed scope notes provided by client.' }}
              </p>
            </div>

            <!-- Attachments & Proof Documents -->
            <div class="space-y-2.5">
              <span class="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <span
                  :class="[
                    'w-2 h-3 rounded-full',
                    unitCode.toUpperCase() === 'LEAU' ? 'bg-amber-600' : 'bg-emerald-600'
                  ]"
                ></span>
                Attached Documents &amp; Damage Proof ({{ (selectedTicket.attachments || []).length }})
              </span>

              <div v-if="!selectedTicket.attachments || selectedTicket.attachments.length === 0" class="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-slate-400 text-xs">
                No files or images attached to this ticket.
              </div>

              <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div
                  v-for="(file, idx) in selectedTicket.attachments"
                  :key="idx"
                  @click="downloadAttachment(file)"
                  :class="[
                    'flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200 cursor-pointer transition-all shadow-2xs group',
                    unitCode.toUpperCase() === 'LEAU' ? 'hover:border-amber-500 hover:bg-amber-50/40' : 'hover:border-emerald-500 hover:bg-emerald-50/40'
                  ]"
                >
                  <div class="flex items-center gap-2.5 truncate">
                    <div
                      :class="[
                        'w-8 h-8 rounded-xl flex items-center justify-center shrink-0',
                        unitCode.toUpperCase() === 'LEAU' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                      ]"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                      </svg>
                    </div>
                    <span class="text-xs font-bold text-slate-800 truncate group-hover:text-slate-900">{{ file.file_name || 'Attachment' }}</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 group-hover:text-slate-700 shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Fixed Modal Footer Actions -->
          <div class="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              @click="showScopeModal = false"
              class="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              Close Full Info
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
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

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
const isEmergency = ref(false);
const pauseCurrentTask = ref(false);
const taskNotes = ref('');

// User-friendly date formatter: shows weekday name, month name, day, and year
const friendlyDateFormat = (date) => {
  if (!date) return '';
  let d;
  if (date instanceof Date) {
    d = date;
  } else if (typeof date === 'string') {
    const parts = date.split('-');
    if (parts.length === 3) {
      const year = Number(parts[0]);
      const month = Number(parts[1]) - 1;
      const day = Number(parts[2]);
      d = new Date(year, month, day);
    } else {
      d = new Date(date);
    }
  } else {
    d = new Date(date);
  }

  if (isNaN(d.getTime())) return String(date);

  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

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

/* Custom Dark Theme Styles for VueDatePicker in Dispatch Workspace */
:deep(.dp__theme_dark) {
  --dp-background-color: #0f172a;
  --dp-text-color: #f8fafc;
  --dp-hover-color: #1e293b;
  --dp-hover-text-color: #ffffff;
  --dp-hover-icon-color: #ffffff;
  --dp-primary-color: #10b981;
  --dp-primary-text-color: #ffffff;
  --dp-secondary-color: #94a3b8;
  --dp-border-color: #334155;
  --dp-menu-border-color: #334155;
  --dp-border-color-hover: #10b981;
  --dp-disabled-color: #475569;
  --dp-scroll-bar-background: #1e293b;
  --dp-scroll-bar-color: #475569;
  --dp-success-color: #10b981;
  --dp-icon-color: #10b981;
  --dp-danger-color: #f43f5e;
  --dp-border-radius: 1rem;
  --dp-font-family: inherit;
}

:deep(.custom-datepicker) {
  width: 100%;
}

:deep(.custom-datepicker .dp__input_wrap) {
  width: 100%;
}

:deep(.custom-datepicker .dp__input) {
  background: transparent !important;
  border: none !important;
  color: #ffffff !important;
  font-size: 0.875rem !important;
  font-weight: 800 !important;
  padding: 0.125rem 0 !important;
  height: auto !important;
  line-height: 1.25rem !important;
  box-shadow: none !important;
  cursor: pointer !important;
  font-family: inherit !important;
}

:deep(.custom-datepicker .dp__input:hover) {
  color: #6ee7b7 !important;
}

:deep(.custom-datepicker .dp__input_icon) {
  display: none !important;
}

:deep(.custom-datepicker .dp__clear_icon) {
  display: none !important;
}

:deep(.custom-datepicker .dp__input_focus) {
  border: none !important;
  outline: none !important;
}

:deep(.dp__menu) {
  border-radius: 1.25rem !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6) !important;
  border: 1px solid #334155 !important;
  padding: 0.75rem !important;
  z-index: 99999 !important;
}

:deep(.dp__calendar_header_item) {
  font-size: 0.75rem !important;
  font-weight: 800 !important;
  color: #94a3b8 !important;
}

:deep(.dp__cell_inner) {
  border-radius: 0.75rem !important;
  font-weight: 700 !important;
  font-size: 0.8125rem !important;
}

:deep(.dp__active_date) {
  background: #059669 !important;
  color: #ffffff !important;
  font-weight: 900 !important;
}

:deep(.dp__today) {
  border: 1px solid #10b981 !important;
}
</style>
