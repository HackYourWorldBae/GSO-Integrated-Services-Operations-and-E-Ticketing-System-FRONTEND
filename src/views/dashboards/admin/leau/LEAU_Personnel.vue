<template>
  <MainLayout>
    <template #header-title>
      <div class="flex items-center gap-2">
        <span class="text-xs px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-black uppercase tracking-wider">LEAU</span>
        <h2 class="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Personnel Management</h2>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-6 animate-fade-in pb-12 px-4 sm:px-8 py-6 max-w-[1600px] mx-auto min-h-screen">

        <!-- Top Toolbar: Search, Actions & Filters -->
        <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <!-- Search bar -->
            <div class="relative flex-1 max-w-md">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search staff by name or profession..."
                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-slate-50/50"
              />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <!-- Action Buttons: Manage Categories & Add Personnel -->
            <div class="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
              <button
                v-if="isAdmin"
                @click="showCategoryModal = true"
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-black hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>Manage Categories</span>
              </button>

              <button
                v-if="isAdmin"
                @click="openAddModal"
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-xs shadow-emerald-200 active:scale-95 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Personnel</span>
              </button>
            </div>
          </div>

          <!-- Status & Specialty Filters -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <!-- Status Filter Tabs -->
            <div class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 text-xs">
              <button
                @click="statusFilter = 'all'"
                :class="['px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap', statusFilter === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                All ({{ store.personnel.length }})
              </button>
              <button
                @click="statusFilter = 'Available'"
                :class="['px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap', statusFilter === 'Available' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                Available ({{ availableCount }})
              </button>
              <button
                @click="statusFilter = 'Working'"
                :class="['px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap', statusFilter === 'Working' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                Working ({{ workingCount }})
              </button>
              <button
                @click="statusFilter = 'On Leave'"
                :class="['px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap', statusFilter === 'On Leave' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                On Leave ({{ onLeaveCount }})
              </button>
            </div>

            <!-- Specialty Category Filter Pills -->
            <div class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pt-1 sm:pt-0 text-xs">
              <button
                @click="categoryFilter = 'all'"
                :class="['px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap', categoryFilter === 'all' ? 'bg-slate-800 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                All Categories
              </button>
              <button
                v-for="cat in store.categories"
                :key="cat.id"
                @click="categoryFilter = cat.name"
                :class="['px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap', categoryFilter === cat.name ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                {{ cat.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- Personnel Cards Grid -->
        <div v-if="filteredPersonnel.length === 0" class="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-8">
          <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h4 class="text-sm font-black text-slate-700">No personnel found</h4>
          <p class="text-xs text-slate-400 mt-1">Try adjusting your search criteria or add new staff members.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <div
            v-for="worker in filteredPersonnel"
            :key="worker.id"
            class="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
          >
            <!-- Card Body: Name, Profession, Status & Assigned Tickets Dropdown -->
            <div class="space-y-3.5">
              <!-- Top Row: Avatar, Name, Profession & Status Badge -->
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800 flex items-center justify-center font-black text-sm shrink-0 border border-slate-200 shadow-xs">
                    {{ getInitials(worker.name) }}
                  </div>
                  <div class="min-w-0">
                    <h4 class="text-sm font-black text-slate-900 truncate leading-tight">
                      {{ worker.name }}
                    </h4>
                    <span class="inline-block text-xs font-bold text-slate-500 truncate mt-0.5">
                      {{ worker.specialty || worker.role || 'Staff' }}
                    </span>
                  </div>
                </div>

                <!-- Status Badge -->
                <span
                  :class="[
                    'px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0 border',
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

              <!-- Assigned Tickets Accordion Toggle -->
              <div>
                <button
                  type="button"
                  @click="toggleWorkerTickets(worker.id)"
                  class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-xs font-bold transition-all cursor-pointer group/toggle"
                >
                  <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 group-hover/toggle:text-emerald-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <span class="text-slate-700 font-black">Assigned Tickets</span>
                    <span
                      :class="[
                        'px-2 py-0.5 rounded-full text-[10px] font-black',
                        (worker.assignments?.length || 0) > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200/70 text-slate-500'
                      ]"
                    >
                      {{ worker.assignments?.length || 0 }}
                    </span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 text-slate-400 transition-transform duration-200"
                    :class="{ 'rotate-180': isWorkerExpanded(worker.id) }"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <!-- Dropdown List of All Assigned Tickets -->
                <div v-if="isWorkerExpanded(worker.id)" class="mt-2 space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar animate-fade-in">
                  <div v-if="!worker.assignments || worker.assignments.length === 0" class="p-4 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-400 font-bold">
                    No tickets currently assigned.
                  </div>
                  <div
                    v-else
                    v-for="(ticket, tIdx) in worker.assignments"
                    :key="ticket.id || tIdx"
                    class="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5 hover:border-slate-300 transition-all"
                  >
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-1.5">
                        <span class="font-black text-slate-900">#{{ ticket.ticket_id }}</span>
                        <span v-if="ticket.is_emergency" class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[9px] font-black uppercase tracking-wider">
                          Urgent
                        </span>
                        <span v-if="ticket.is_project" class="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[9px] font-black uppercase tracking-wider">
                          Project
                        </span>
                      </div>
                      <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        {{ ticket.queue_order === 1 ? 'Active Job' : `Queue #${ticket.queue_order}` }}
                      </span>
                    </div>

                    <p class="text-slate-700 font-bold leading-tight">
                      {{ ticket.task || ticket.project_title || ticket.service_type || 'Assigned Work' }}
                    </p>

                    <div class="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-1 border-t border-slate-200/50">
                      <span>Scheduled: {{ ticket.implementation_date || ticket.target_completion_date || 'TBD' }}</span>
                      <span class="font-bold capitalize" :class="ticket.ticket_status === 'in_progress' ? 'text-amber-600' : 'text-slate-500'">
                        {{ ticket.ticket_status ? ticket.ticket_status.replace('_', ' ') : 'Active' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card Bottom: Roster Action Buttons -->
            <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <!-- Edit Personnel -->
                <button
                  v-if="isAdmin"
                  @click="openEditModal(worker)"
                  class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Edit staff details"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>Edit</span>
                </button>

                <!-- Status Toggle -->
                <button
                  @click="handleWorkerStatusClick(worker)"
                  class="px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border"
                  :class="worker.status === 'On Leave'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : worker.status === 'Working'
                      ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'"
                >
                  {{ worker.status === 'On Leave' ? 'Set Available' : (worker.status === 'Working' || worker.assignedTicket) ? 'Set Leave (Active)' : 'Set Leave' }}
                </button>
              </div>

              <!-- Delete Button -->
              <button
                v-if="isAdmin && worker.status !== 'Working' && !worker.assignedTicket"
                @click="confirmDelete(worker)"
                class="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                title="Remove from roster"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

      </div>
      <!-- Add Personnel Modal -->
      <Teleport to="body">
        <div v-if="showAddModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div class="bg-white rounded-3xl sm:rounded-[2rem] w-full max-w-md p-6 sm:p-8 shadow-2xl border border-slate-100 animate-scale-up my-auto max-h-[92vh] overflow-y-auto custom-scrollbar">
            <div class="flex items-center justify-between mb-6">
              <div>
                <span class="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                  New Staff
                </span>
                <h3 class="text-xl font-black text-slate-900 mt-1">Add Personnel</h3>
              </div>
              <button @click="showAddModal = false" class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form @submit.prevent="submitAddPersonnel" class="space-y-4">
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">First Name *</label>
                <input v-model="addForm.firstName" required placeholder="e.g. Maria" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Middle Initial</label>
                  <input v-model="addForm.middleInitial" maxlength="2" placeholder="e.g. S." class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Name Extension</label>
                  <select v-model="addForm.nameExtension" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer bg-white">
                    <option value="">None</option>
                    <option v-for="ext in nameExtensionOptions" :key="ext" :value="ext">{{ ext }}</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Last Name *</label>
                <input v-model="addForm.lastName" required placeholder="e.g. Santos" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Specialty / Role *</label>
                <select v-model="addForm.specialty" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer bg-white">
                  <option value="" disabled>Select Specialty</option>
                  <option v-for="cat in store.categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
                </select>
              </div>

              <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button type="button" @click="showAddModal = false" class="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="submit" :disabled="submitting" class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-sm shadow-emerald-200 active:scale-95 disabled:opacity-50 cursor-pointer">
                  {{ submitting ? 'Saving...' : 'Add to Roster' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Teleport>

      <!-- Edit Personnel Modal -->
      <Teleport to="body">
        <div v-if="showEditModal && editingWorker" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div class="bg-white rounded-3xl sm:rounded-[2rem] w-full max-w-md p-6 sm:p-8 shadow-2xl border border-slate-100 animate-scale-up my-auto max-h-[92vh] overflow-y-auto custom-scrollbar">
            <div class="flex items-center justify-between mb-6">
              <div>
                <span class="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-wider">
                  Edit Staff
                </span>
                <h3 class="text-xl font-black text-slate-900 mt-1">Edit Personnel Details</h3>
              </div>
              <button @click="showEditModal = false" class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form @submit.prevent="submitEditPersonnel" class="space-y-4">
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Full Name *</label>
                <input v-model="editForm.name" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Specialty / Role *</label>
                <select v-model="editForm.specialty" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer bg-white">
                  <option v-for="cat in store.categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
                </select>
              </div>
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Contact Number (11 digits)</label>
                <input v-model="editForm.contactNumber" maxlength="11" placeholder="09123456789" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>

              <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button type="button" @click="showEditModal = false" class="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="submit" :disabled="submittingEdit" class="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer">
                  {{ submittingEdit ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Teleport>

      <!-- Category Management Modal -->
      <Teleport to="body">
        <div v-if="showCategoryModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div class="bg-white rounded-3xl sm:rounded-[2rem] w-full max-w-md p-6 sm:p-8 shadow-2xl border border-slate-100 animate-scale-up my-auto max-h-[92vh] overflow-y-auto custom-scrollbar">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-black text-slate-900">Manage Categories</h3>
              <button @click="showCategoryModal = false" class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form @submit.prevent="submitCategory" class="flex items-center gap-2 mb-6">
              <input v-model="newCategoryName" placeholder="New category name..." class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <button type="submit" :disabled="categorySubmitting || !newCategoryName.trim()" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer">Add</button>
            </form>

            <div class="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              <div v-if="store.categories.length === 0" class="text-xs text-slate-400 font-bold text-center py-4">No custom categories yet.</div>
              <div v-else v-for="cat in store.categories" :key="cat.id" class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div v-if="editingCategory === cat.id" class="flex items-center gap-2 flex-1 mr-2">
                  <input v-model="editingCategoryName" class="flex-1 px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-bold text-slate-800" />
                  <button @click="saveCategory(cat)" :disabled="categoryUpdating" class="text-xs font-black text-emerald-600 hover:text-emerald-700 cursor-pointer">Save</button>
                  <button @click="cancelEditingCategory" class="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer">Cancel</button>
                </div>
                <span v-else class="text-xs font-black text-slate-800">{{ cat.name }}</span>

                <div v-if="editingCategory !== cat.id" class="flex items-center gap-2">
                  <button @click="startEditingCategory(cat)" class="text-slate-400 hover:text-slate-700 p-1 cursor-pointer" title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button @click="deleteCategory(cat)" :disabled="categoryDeleting === cat.id" class="text-rose-400 hover:text-rose-600 p-1 cursor-pointer" title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Delete Confirmation Modal -->
      <Teleport to="body">
        <div v-if="workerToDelete" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div class="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-slate-100 text-center animate-scale-up my-auto">
            <div class="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h4 class="text-base font-black text-slate-900 mb-1">Remove Personnel</h4>
            <p class="text-xs text-slate-500 mb-6">Are you sure you want to remove <strong class="text-slate-800">{{ workerToDelete.name }}</strong> from the roster?</p>
            <div class="flex items-center justify-center gap-3">
              <button @click="workerToDelete = null" class="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 cursor-pointer">Cancel</button>
              <button @click="submitDelete" :disabled="deleteSubmitting" class="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-black transition-all shadow-sm shadow-rose-200 active:scale-95 disabled:opacity-50 cursor-pointer">
                {{ deleteSubmitting ? 'Removing...' : 'Yes, Remove' }}
              </button>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Staff Leave Modal -->
      <StaffLeaveModal
        :is-open="showLeaveModal"
        :worker="workerForLeaveModal"
        :available-workers="availableWorkersList"
        unit-code="LEAU"
        @close="showLeaveModal = false"
        @updated="handleLeaveUpdated"
      />

    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import StaffLeaveModal from '@/components/StaffLeaveModal.vue';
import { useLeauPersonnelStore } from '@/stores/leauPersonnel';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'vue3-toastify';

const store = useLeauPersonnelStore();
const authStore = useAuthStore();

const isAdmin = computed(() => {
  const role = authStore.role || authStore.user?.role;
  return role === 'admin' || role === 'superadmin' || role === 'director';
});

// ── Search & Filter ─────────────────────────────────────────────────────────
const searchQuery = ref('');
const statusFilter = ref('all');
const categoryFilter = ref('all');

const availableCount = computed(() => store.personnel.filter(w => w.status === 'Available').length);
const workingCount = computed(() => store.personnel.filter(w => w.status === 'Working' || w.assignedTicket).length);
const onLeaveCount = computed(() => store.personnel.filter(w => w.status === 'On Leave').length);

const filteredPersonnel = computed(() => {
  let list = store.personnel;

  if (statusFilter.value !== 'all') {
    list = list.filter(w => w.status === statusFilter.value);
  }

  if (categoryFilter.value !== 'all') {
    list = list.filter(w => (w.specialty || w.role) === categoryFilter.value);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(w =>
      String(w.name || '').toLowerCase().includes(q) ||
      String(w.specialty || w.role || '').toLowerCase().includes(q) ||
      String(w.contact_number || '').toLowerCase().includes(q)
    );
  }

  return list;
});

const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// ── Assigned Tickets Dropdown ───────────────────────────────────────────────
const expandedWorkers = reactive({});
const toggleWorkerTickets = (workerId) => {
  expandedWorkers[workerId] = !expandedWorkers[workerId];
};
const isWorkerExpanded = (workerId) => Boolean(expandedWorkers[workerId]);

// ── Add Personnel Modal ─────────────────────────────────────────────────────
const nameExtensionOptions = ['Jr.', 'Sr.', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const showAddModal = ref(false);
const submitting = ref(false);
const addForm = reactive({
  firstName: '',
  middleInitial: '',
  lastName: '',
  nameExtension: '',
  specialty: ''
});

const openAddModal = () => {
  addForm.firstName = '';
  addForm.middleInitial = '';
  addForm.lastName = '';
  addForm.nameExtension = '';
  addForm.specialty = store.categories[0]?.name || '';
  showAddModal.value = true;
};

const submitAddPersonnel = async () => {
  if (!addForm.firstName || !addForm.lastName || !addForm.specialty) {
    toast.error('Please fill in all required fields.');
    return;
  }
  submitting.value = true;
  try {
    await store.addPersonnel(addForm);
    toast.success('Personnel added successfully!');
    showAddModal.value = false;
  } catch (err) {
    const msg = err?.response?.data?.message || 'Failed to add personnel.';
    toast.error(msg);
  } finally {
    submitting.value = false;
  }
};

// ── Edit Personnel Modal ────────────────────────────────────────────────────
const showEditModal = ref(false);
const editingWorker = ref(null);
const submittingEdit = ref(false);
const editForm = reactive({
  name: '',
  specialty: '',
  contactNumber: ''
});

const openEditModal = (worker) => {
  editingWorker.value = worker;
  editForm.name = worker.name || '';
  editForm.specialty = worker.specialty || worker.role || '';
  editForm.contactNumber = worker.contact_number || '';
  showEditModal.value = true;
};

const submitEditPersonnel = async () => {
  if (!editingWorker.value || !editForm.name || !editForm.specialty) {
    toast.error('Please fill in required fields.');
    return;
  }
  submittingEdit.value = true;
  try {
    await store.updatePersonnel(editingWorker.value.id, {
      name: editForm.name,
      specialty: editForm.specialty,
      contactNumber: editForm.contactNumber
    });
    toast.success('Personnel details updated.');
    showEditModal.value = false;
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to update personnel.');
  } finally {
    submittingEdit.value = false;
  }
};

// ── Delete Personnel ───────────────────────────────────────────────────────
const workerToDelete = ref(null);
const deleteSubmitting = ref(false);

const confirmDelete = (worker) => {
  workerToDelete.value = worker;
};

const submitDelete = async () => {
  if (!workerToDelete.value) return;
  deleteSubmitting.value = true;
  try {
    await store.removePersonnel(workerToDelete.value.id);
    toast.success(`${workerToDelete.value.name} removed from roster.`);
    workerToDelete.value = null;
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to remove personnel.');
  } finally {
    deleteSubmitting.value = false;
  }
};

// ── Category Management ─────────────────────────────────────────────────────
const showCategoryModal = ref(false);
const newCategoryName  = ref('');
const categorySubmitting = ref(false);
const categoryDeleting = ref(null);
const editingCategory = ref(null);
const editingCategoryName = ref('');
const categoryUpdating = ref(false);

const startEditingCategory = (cat) => {
  editingCategory.value = cat.id;
  editingCategoryName.value = cat.name;
};

const cancelEditingCategory = () => {
  editingCategory.value = null;
  editingCategoryName.value = '';
};

const saveCategory = async (cat) => {
  if (!editingCategoryName.value.trim() || editingCategoryName.value.trim() === cat.name) {
    cancelEditingCategory();
    return;
  }
  categoryUpdating.value = true;
  try {
    await store.updateCategory(cat.id, editingCategoryName.value.trim());
    toast.success('Category updated.');
    cancelEditingCategory();
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to update category.');
  } finally {
    categoryUpdating.value = false;
  }
};

const submitCategory = async () => {
  if (!newCategoryName.value.trim()) return;
  categorySubmitting.value = true;
  try {
    await store.addCategory(newCategoryName.value.trim());
    toast.success('Category added!');
    newCategoryName.value = '';
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to add category.');
  } finally {
    categorySubmitting.value = false;
  }
};

const deleteCategory = async (cat) => {
  categoryDeleting.value = cat.id;
  try {
    await store.removeCategory(cat.id);
    toast.success(`${cat.name} category removed.`);
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to remove category.');
  } finally {
    categoryDeleting.value = null;
  }
};

// ── Status & Leave ──────────────────────────────────────────────────────────
const showLeaveModal = ref(false);
const workerForLeaveModal = ref(null);
const availableWorkersList = computed(() => store.personnel);

const handleWorkerStatusClick = (worker) => {
  if (worker.status === 'On Leave') {
    store.toggleWorkerStatus(worker.id);
  } else if (worker.status === 'Working' || worker.assignedTicket) {
    workerForLeaveModal.value = worker;
    showLeaveModal.value = true;
  } else {
    store.toggleWorkerStatus(worker.id);
  }
};

const handleLeaveUpdated = async () => {
  toast.success('Personnel leave status updated.');
  await store.fetchPersonnel();
};

onMounted(async () => {
  await Promise.all([
    store.fetchPersonnel(),
    store.fetchCategories()
  ]);
});
</script>
