<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/admin/ssu" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span class="text">SSU Home</span>
      </router-link>

      <router-link to="/admin/ssu/submitted-tickets" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span class="text">Submitted Tickets</span>
      </router-link>

      <router-link to="/admin/ssu/investigating-tickets" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span class="text">Under Investigation</span>
      </router-link>

      <router-link to="/admin/ssu/collab-tickets" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span class="text">Collab Tickets</span>
      </router-link>

      <router-link to="/admin/ssu/assign-workers" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span class="text">Dispatch Personnel</span>
      </router-link>

      <router-link to="/admin/ssu/personnel" class="nav-item" exact-active-class="router-link-active" active-class="router-link-active">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span class="text">Security Personnel</span>
      </router-link>

      <div class="mt-8 mb-4 px-4">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Archived Tickets</p>
      </div>
      <router-link to="/admin/ssu/archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span class="text">Archives</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex items-center gap-2">
        <span class="text-xs px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800 font-black uppercase tracking-wider border border-rose-200">SSU</span>
        <h2 class="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Security Personnel Management</h2>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-6 animate-fade-in pb-12 px-3 sm:px-8 py-4 sm:py-6 max-w-[1600px] mx-auto min-h-screen">

        <!-- Top Toolbar: Search, Actions & Filters -->
        <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <!-- Search bar -->
            <div class="relative flex-1 max-w-md w-full">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search security personnel by name or specialization..."
                class="w-full pl-10 pr-4 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-base sm:text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/50 bg-slate-50/50"
              />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <!-- Action Buttons: Manage Categories & Add Personnel -->
            <div class="flex items-center gap-2.5 w-full sm:w-auto justify-end sm:justify-start shrink-0">
              <button
                v-if="isAdmin"
                @click="showCategoryModal = true"
                class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-black hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs cursor-pointer touch-manipulation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span class="truncate">Manage Categories</span>
              </button>

              <button
                v-if="isAdmin"
                @click="openAddModal"
                class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 min-h-[44px] rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-all shadow-xs shadow-rose-200 active:scale-95 cursor-pointer touch-manipulation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span class="truncate">Add Security Staff</span>
              </button>
            </div>
          </div>

          <!-- Status & Specialty Filters -->
          <div class="pt-3 border-t border-slate-100 space-y-3 min-w-0">
            <!-- Status Filter Tabs -->
            <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-1 shrink-0">Status:</span>
              <button
                type="button"
                @click="statusFilter = 'all'"
                :class="['px-3 py-1.5 min-h-[36px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', statusFilter === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                All ({{ store.personnel.length }})
              </button>
              <button
                type="button"
                @click="statusFilter = 'Available'"
                :class="['px-3 py-1.5 min-h-[36px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', statusFilter === 'Available' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                Available ({{ availableCount }})
              </button>
              <button
                type="button"
                @click="statusFilter = 'Working'"
                :class="['px-3 py-1.5 min-h-[36px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', statusFilter === 'Working' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                On Dispatch ({{ workingCount }})
              </button>
              <button
                type="button"
                @click="statusFilter = 'On Leave'"
                :class="['px-3 py-1.5 min-h-[36px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', statusFilter === 'On Leave' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                On Leave ({{ onLeaveCount }})
              </button>
            </div>

            <!-- Specialty Category Filter Pills -->
            <div class="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100/70 text-xs min-w-0">
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-1 shrink-0">Specialization:</span>
              <button
                type="button"
                @click="categoryFilter = 'all'"
                :class="['px-3 py-1.5 min-h-[36px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', categoryFilter === 'all' ? 'bg-slate-800 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                All Specializations
              </button>
              <button
                type="button"
                v-for="cat in store.categories"
                :key="cat.id"
                @click="categoryFilter = cat.name"
                :class="['px-3 py-1.5 min-h-[36px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', categoryFilter === cat.name ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                {{ cat.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- Personnel Cards Grid -->
        <div v-if="filteredPersonnel.length === 0" class="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-8">
          <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h4 class="text-sm font-black text-slate-700">No security personnel found</h4>
          <p class="text-xs text-slate-400 mt-1">Try adjusting your search criteria or add new security personnel for campus operations and cross-unit collab dispatches.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          <div
            v-for="worker in filteredPersonnel"
            :key="worker.id"
            class="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
          >
            <!-- Card Body: Name, Specialty, Status & Assigned Tickets Dropdown -->
            <div class="space-y-3.5">
              <!-- Top Row: Avatar, Name, Specialization & Status Badge -->
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
                      {{ worker.specialty || worker.role || 'Security Officer' }}
                    </span>
                  </div>
                </div>

                <!-- Status & Device Account Indicators -->
                <div class="flex flex-col items-end gap-1.5 shrink-0">
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

                  <span
                    v-if="worker.has_account || worker.user_id"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                    title="Officer has an active portal login account"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    📱 Portal Active
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200"
                    title="Roster only — no device login account"
                  >
                    📵 No Device
                  </span>
                </div>
              </div>

              <!-- Assigned Tickets Accordion Toggle -->
              <div>
                <button
                  type="button"
                  @click="toggleWorkerTickets(worker.id)"
                  class="w-full min-h-[40px] flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-xs font-bold transition-all cursor-pointer touch-manipulation group/toggle"
                >
                  <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 group-hover/toggle:text-rose-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <span class="text-slate-700 font-black">Assigned Tickets</span>
                    <span
                      :class="[
                        'px-2 py-0.5 rounded-full text-[10px] font-black',
                        (worker.assignments?.length || 0) > 0 ? 'bg-rose-100 text-rose-800' : 'bg-slate-200/70 text-slate-500'
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
                      {{ ticket.task || ticket.project_title || ticket.service_type || 'Security Operations' }}
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
              <div class="flex items-center gap-2 flex-wrap">
                <!-- Edit Personnel -->
                <button
                  v-if="isAdmin"
                  @click="openEditModal(worker)"
                  class="px-3 sm:px-3.5 py-2 min-h-[38px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 touch-manipulation"
                  title="Edit staff details"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>Edit</span>
                </button>

                <!-- Status Toggle -->
                <button
                  @click="handleWorkerStatusClick(worker)"
                  class="px-3 sm:px-3.5 py-2 min-h-[38px] rounded-xl text-xs font-black transition-all cursor-pointer border touch-manipulation"
                  :class="worker.status === 'On Leave'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : worker.status === 'Working'
                      ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'"
                >
                  {{ worker.status === 'On Leave' ? 'Set Available' : (worker.status === 'Working' || worker.assignedTicket) ? 'Set Leave (Active)' : 'Set Leave' }}
                </button>

                <!-- Provision Account Button (for officers who didn't have one) -->
                <button
                  v-if="isAdmin && !worker.has_account && !worker.user_id"
                  @click="openProvisionAccountModal(worker)"
                  class="px-2.5 sm:px-3 py-2 min-h-[38px] rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-800 text-[11px] font-black transition-colors cursor-pointer flex items-center gap-1 touch-manipulation"
                  title="Create device account for this officer"
                >
                  <span>📱</span>
                  <span>Create Account</span>
                </button>
              </div>

              <!-- Delete Button -->
              <button
                v-if="isAdmin && worker.status !== 'Working' && !worker.assignedTicket"
                @click="confirmDelete(worker)"
                class="w-9 h-9 min-h-[38px] min-w-[38px] rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center cursor-pointer touch-manipulation shrink-0"
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

      <!-- ── Add Security Personnel Modal ────────────────────────────────────── -->
      <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-fade-in">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 class="text-base sm:text-lg font-black text-slate-900">Add Security Personnel</h3>
              <p class="text-xs text-slate-500 mt-0.5">Register officer for SSU response and cross-unit collab dispatches</p>
            </div>
            <button @click="showAddModal = false" class="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form @submit.prevent="submitAddPersonnel" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">First Name *</label>
                <input
                  v-model="addForm.firstName"
                  type="text"
                  required
                  placeholder="e.g. Juan"
                  class="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>

              <div>
                <label class="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Middle Initial</label>
                <input
                  v-model="addForm.middleInitial"
                  type="text"
                  maxlength="4"
                  placeholder="e.g. D."
                  class="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>

              <div>
                <label class="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Last Name *</label>
                <input
                  v-model="addForm.lastName"
                  type="text"
                  required
                  placeholder="e.g. Dela Cruz"
                  class="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>

              <div>
                <label class="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Extension</label>
                <select
                  v-model="addForm.nameExtension"
                  class="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/50 bg-white"
                >
                  <option value="">None</option>
                  <option v-for="ext in nameExtensionOptions" :key="ext" :value="ext">{{ ext }}</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Specialization / Specialty *</label>
              <select
                v-model="addForm.specialty"
                required
                class="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/50 bg-white"
              >
                <option value="" disabled>Select Specialty</option>
                <template v-if="store.categories && store.categories.length > 0">
                  <option v-for="cat in store.categories" :key="cat.id" :value="cat.name">
                    {{ cat.name }}
                  </option>
                </template>
                <template v-else>
                  <option value="Campus Security & Patrol">Campus Security & Patrol</option>
                  <option value="Gate / Entry Control">Gate / Entry Control</option>
                  <option value="Surveillance / CCTV">Surveillance / CCTV</option>
                  <option value="Emergency Response">Emergency Response</option>
                </template>
              </select>
            </div>

            <!-- Account Creation Toggle (Optional - If officer has a smartphone/device) -->
            <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-start gap-2.5 min-w-0">
                  <div class="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                    📱
                  </div>
                  <div class="min-w-0">
                    <label for="ssu-toggle-account" class="text-xs font-black text-slate-800 block cursor-pointer">
                      Create Portal Account
                    </label>
                    <p class="text-[11px] text-slate-500 font-medium leading-tight">
                      Optional • Toggle ON if officer has an accessible phone/device
                    </p>
                  </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    id="ssu-toggle-account"
                    type="checkbox"
                    v-model="addForm.createAccount"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                </label>
              </div>

              <!-- Expanded Account Form Fields -->
              <div v-if="addForm.createAccount" class="pt-3 border-t border-slate-200/70 space-y-3 animate-fade-in">
                <div>
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Email / Portal Username *</label>
                  <input
                    v-model="addForm.email"
                    type="email"
                    :required="addForm.createAccount"
                    placeholder="e.g. name@bsu.edu.ph"
                    class="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                  />
                </div>

                <div>
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Mobile Contact Number (Optional)</label>
                  <input
                    v-model="addForm.contactNumber"
                    type="tel"
                    placeholder="e.g. 09123456789"
                    class="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                  />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Password * (Min 8)</label>
                    <div class="relative">
                      <input
                        v-model="addForm.password"
                        :type="showAddPassword ? 'text' : 'password'"
                        :required="addForm.createAccount"
                        minlength="8"
                        placeholder="••••••••"
                        class="w-full pl-3 pr-9 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                      />
                      <button
                        type="button"
                        @click="showAddPassword = !showAddPassword"
                        class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5 cursor-pointer touch-manipulation"
                      >
                        <svg v-if="!showAddPassword" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Confirm Password *</label>
                    <div class="relative">
                      <input
                        v-model="addForm.confirmPassword"
                        :type="showAddConfirmPassword ? 'text' : 'password'"
                        :required="addForm.createAccount"
                        minlength="8"
                        placeholder="••••••••"
                        class="w-full pl-3 pr-9 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                      />
                      <button
                        type="button"
                        @click="showAddConfirmPassword = !showAddConfirmPassword"
                        class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5 cursor-pointer touch-manipulation"
                      >
                        <svg v-if="!showAddConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                @click="showAddModal = false"
                class="px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="px-5 py-2.5 min-h-[44px] rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-xs transition-all active:scale-95 disabled:opacity-50"
              >
                {{ submitting ? 'Adding...' : 'Add Personnel' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- ── Edit Security Personnel Modal ───────────────────────────────────── -->
      <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-fade-in">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 class="text-base sm:text-lg font-black text-slate-900">Edit Security Personnel</h3>
              <p class="text-xs text-slate-500 mt-0.5">Update personnel name or assigned specialization</p>
            </div>
            <button @click="showEditModal = false" class="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form @submit.prevent="submitEditPersonnel" class="space-y-4">
            <div>
              <label class="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Full Name *</label>
              <input
                v-model="editForm.name"
                type="text"
                required
                class="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              />
            </div>

            <div>
              <label class="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Specialization *</label>
              <select
                v-model="editForm.specialty"
                required
                class="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/50 bg-white"
              >
                <option v-for="cat in store.categories" :key="cat.id" :value="cat.name">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                @click="showEditModal = false"
                class="px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="editSubmitting"
                class="px-5 py-2.5 min-h-[44px] rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-xs transition-all active:scale-95 disabled:opacity-50"
              >
                {{ editSubmitting ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- ── Delete Confirmation Modal ──────────────────────────────────────── -->
      <div v-if="workerToDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
        <div class="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-fade-in">
          <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>

          <div class="text-center">
            <h3 class="text-base font-black text-slate-900">Remove Personnel?</h3>
            <p class="text-xs text-slate-500 mt-1">
              Are you sure you want to remove <strong class="text-slate-800">{{ workerToDelete.name }}</strong> from the security roster?
            </p>
          </div>

          <div class="flex items-center justify-center gap-2.5 pt-2">
            <button
              type="button"
              @click="workerToDelete = null"
              class="px-4 py-2 min-h-[40px] rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              :disabled="deleteSubmitting"
              @click="executeDelete"
              class="px-5 py-2 min-h-[40px] rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-xs transition-all active:scale-95 disabled:opacity-50"
            >
              {{ deleteSubmitting ? 'Removing...' : 'Yes, Remove' }}
            </button>
          </div>
        </div>
      </div>

      <!-- ── Manage Categories Modal ────────────────────────────────────────── -->
      <div v-if="showCategoryModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
        <div class="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-fade-in max-h-[90vh] flex flex-col">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
            <div>
              <h3 class="text-base sm:text-lg font-black text-slate-900">Manage Specializations</h3>
              <p class="text-xs text-slate-500 mt-0.5">Define security categories and their supported services</p>
            </div>
            <button @click="showCategoryModal = false" class="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto space-y-5 pr-1">
            <!-- Add New Category Form -->
            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
              <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider">Add Specialization</h4>
              <div class="flex gap-2">
                <input
                  v-model="newCategoryName"
                  type="text"
                  placeholder="e.g. Campus Patrol"
                  class="flex-1 px-3.5 py-2 min-h-[40px] rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/50 bg-white"
                />
                <button
                  type="button"
                  :disabled="!newCategoryName.trim() || categorySubmitting"
                  @click="submitCategory"
                  class="px-4 py-2 min-h-[40px] rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-xs transition-all disabled:opacity-50"
                >
                  {{ categorySubmitting ? 'Adding...' : 'Add' }}
                </button>
              </div>

              <!-- Supported services selection for new category -->
              <div class="space-y-1.5 pt-2">
                <div class="flex items-center justify-between">
                  <span class="text-[11px] font-bold text-slate-600">Supported Services:</span>
                  <div class="flex gap-2 text-[10px]">
                    <button type="button" @click="selectAllNewServices" class="text-rose-600 font-bold hover:underline">Select All</button>
                    <span class="text-slate-300">&bull;</span>
                    <button type="button" @click="clearNewServices" class="text-slate-400 font-bold hover:underline">Clear</button>
                  </div>
                </div>
                <div class="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1">
                  <button
                    v-for="serv in SSU_SERVICES"
                    :key="serv"
                    type="button"
                    @click="toggleNewService(serv)"
                    class="px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all text-left"
                    :class="newCategoryServices.includes(serv)
                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'"
                  >
                    {{ serv }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Existing Categories List -->
            <div class="space-y-2.5">
              <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider">Active Specializations</h4>
              <div v-for="cat in store.categories" :key="cat.id" class="rounded-xl border border-slate-200 p-3 space-y-2 bg-white">
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span class="text-xs font-black text-slate-800">{{ cat.name }}</span>
                    <span v-if="cat.is_system" class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">System</span>
                  </div>

                  <div class="flex items-center gap-1">
                    <button
                      v-if="!cat.is_system"
                      type="button"
                      @click="deleteCategory(cat)"
                      :disabled="categoryDeleting === cat.id"
                      class="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                      title="Delete category"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="serv in (cat.services || cat.supported_services || [])"
                    :key="serv"
                    class="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-600"
                  >
                    {{ serv }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 flex justify-end shrink-0">
            <button
              type="button"
              @click="showCategoryModal = false"
              class="px-5 py-2 min-h-[40px] rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      <!-- ── Staff Leave Modal ──────────────────────────────────────────────── -->
      <StaffLeaveModal
        v-if="showLeaveModal"
        :isOpen="showLeaveModal"
        :worker="workerForLeaveModal"
        :availableWorkers="availableWorkersList"
        unit="SSU"
        @close="showLeaveModal = false"
        @updated="handleLeaveUpdated"
      />

      <!-- Provision Account Modal for Existing Personnel -->
      <Teleport to="body">
        <div v-if="workerForAccountModal" class="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto pointer-events-auto">
          <div class="pointer-events-auto bg-white rounded-3xl sm:rounded-[2rem] w-full max-w-md p-5 sm:p-8 shadow-2xl border border-slate-100 animate-scale-up my-auto max-h-[92vh] overflow-y-auto custom-scrollbar">
            <div class="flex items-center justify-between mb-5">
              <div>
                <span class="px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-wider">
                  Mobile Access
                </span>
                <h3 class="text-xl font-black text-slate-900 mt-1">Create Staff Account</h3>
                <p class="text-xs text-slate-500 font-medium mt-0.5">For: <strong class="text-slate-800">{{ workerForAccountModal.name }}</strong></p>
              </div>
              <button @click="workerForAccountModal = null" class="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form @submit.prevent="submitProvisionAccount" class="space-y-4">
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Email / Portal Username *</label>
                <input
                  v-model="accountForm.email"
                  type="email"
                  required
                  placeholder="e.g. name@bsu.edu.ph"
                  class="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>

              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Mobile Contact Number (Optional)</label>
                <input
                  v-model="accountForm.contactNumber"
                  type="tel"
                  placeholder="e.g. 09123456789"
                  class="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Password * (Min 8)</label>
                  <div class="relative">
                    <input
                      v-model="accountForm.password"
                      :type="showProvisionPassword ? 'text' : 'password'"
                      required
                      minlength="8"
                      placeholder="••••••••"
                      class="w-full pl-3 pr-9 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                    />
                    <button
                      type="button"
                      @click="showProvisionPassword = !showProvisionPassword"
                      class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5 cursor-pointer"
                    >
                      <svg v-if="!showProvisionPassword" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div>
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Confirm Password *</label>
                  <div class="relative">
                    <input
                      v-model="accountForm.confirmPassword"
                      :type="showProvisionConfirmPassword ? 'text' : 'password'"
                      required
                      minlength="8"
                      placeholder="••••••••"
                      class="w-full pl-3 pr-9 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                    />
                    <button
                      type="button"
                      @click="showProvisionConfirmPassword = !showProvisionConfirmPassword"
                      class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5 cursor-pointer"
                    >
                      <svg v-if="!showProvisionConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-5">
                <button type="button" @click="workerForAccountModal = null" class="px-5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 cursor-pointer touch-manipulation">Cancel</button>
                <button type="submit" :disabled="accountSubmitting" class="px-6 py-2.5 min-h-[44px] rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer touch-manipulation">
                  {{ accountSubmitting ? 'Creating...' : 'Create Account' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Teleport>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import StaffLeaveModal from '@/components/StaffLeaveModal.vue';
import { useSsuPersonnelStore } from '@/stores/ssuPersonnel';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'vue3-toastify';
import { debounce } from '@/utils/debounce';
import { SSU_SERVICES } from '@/constants/services';

const store = useSsuPersonnelStore();
const authStore = useAuthStore();

const isAdmin = computed(() => {
  const role = authStore.role || authStore.user?.role;
  return role === 'admin' || role === 'staff' || role === 'superadmin' || role === 'director';
});

// ── Search & Filter ─────────────────────────────────────────────────────────
const searchQuery = ref('');
const debouncedSearchQuery = ref('');
const onSearchInput = debounce((val) => {
  debouncedSearchQuery.value = val;
}, 200);
watch(searchQuery, (val) => onSearchInput(val));

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

  if (debouncedSearchQuery.value.trim()) {
    const q = debouncedSearchQuery.value.toLowerCase().trim();
    list = list.filter(w =>
      String(w.name || '').toLowerCase().includes(q) ||
      String(w.specialty || w.role || '').toLowerCase().includes(q)
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
// ── Password Visibility Toggles ─────────────────────────────────────────────
const showAddPassword = ref(false);
const showAddConfirmPassword = ref(false);

const submitting = ref(false);
const addSubmitting = submitting;
const addForm = reactive({
  firstName: '',
  middleInitial: '',
  lastName: '',
  nameExtension: '',
  specialty: '',
  createAccount: false,
  email: '',
  contactNumber: '',
  password: '',
  confirmPassword: ''
});

const openAddModal = () => {
  addForm.firstName = '';
  addForm.middleInitial = '';
  addForm.lastName = '';
  addForm.nameExtension = '';
  addForm.specialty = store.categories[0]?.name || 'Campus Security & Patrol';
  addForm.createAccount = false;
  addForm.email = '';
  addForm.contactNumber = '';
  addForm.password = '';
  addForm.confirmPassword = '';
  showAddPassword.value = false;
  showAddConfirmPassword.value = false;
  showAddModal.value = true;
};

const submitAddPersonnel = async () => {
  if (!addForm.firstName || !addForm.lastName || !addForm.specialty) {
    toast.error('Please fill in all required fields.');
    return;
  }
  if (addForm.createAccount) {
    if (!addForm.email?.trim() || !addForm.password) {
      toast.error('Email and password are required to create an account.');
      return;
    }
    if (addForm.password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }
    if (addForm.password !== addForm.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
  }
  submitting.value = true;
  try {
    await store.addPersonnel(addForm);
    toast.success(addForm.createAccount ? 'Security personnel & portal account created successfully!' : 'Security personnel added successfully!');
    showAddModal.value = false;
  } catch (err) {
    const msg = err?.response?.data?.message || 'Failed to add security personnel.';
    toast.error(msg);
  } finally {
    submitting.value = false;
  }
};
const submitAdd = submitAddPersonnel;

// ── Provision Account for Existing Worker Modal ──────────────────────────────
const workerForAccountModal = ref(null);
const accountSubmitting = ref(false);
const showProvisionPassword = ref(false);
const showProvisionConfirmPassword = ref(false);
const accountForm = reactive({
  email: '',
  contactNumber: '',
  password: '',
  confirmPassword: ''
});

const openProvisionAccountModal = (worker) => {
  workerForAccountModal.value = worker;
  accountForm.email = '';
  accountForm.contactNumber = '';
  accountForm.password = '';
  accountForm.confirmPassword = '';
  showProvisionPassword.value = false;
  showProvisionConfirmPassword.value = false;
};

const submitProvisionAccount = async () => {
  if (!accountForm.email?.trim() || !accountForm.password) {
    toast.error('Email and password are required.');
    return;
  }
  if (accountForm.password.length < 8) {
    toast.error('Password must be at least 8 characters long.');
    return;
  }
  if (accountForm.password !== accountForm.confirmPassword) {
    toast.error('Passwords do not match.');
    return;
  }
  accountSubmitting.value = true;
  try {
    await store.createPersonnelAccount(workerForAccountModal.value.id, {
      email: accountForm.email.trim(),
      password: accountForm.password,
      contactNumber: accountForm.contactNumber?.trim()
    });
    toast.success('Login account created for security personnel!');
    workerForAccountModal.value = null;
  } catch (err) {
    const msg = err?.response?.data?.message || 'Failed to create personnel account.';
    toast.error(msg);
  } finally {
    accountSubmitting.value = false;
  }
};

// ── Edit Personnel Modal ────────────────────────────────────────────────────
const showEditModal = ref(false);
const editingWorker = ref(null);
const editSubmitting = ref(false);
const editForm = reactive({
  name: '',
  specialty: ''
});

const openEditModal = (worker) => {
  editingWorker.value = worker;
  editForm.name = worker.name;
  editForm.specialty = worker.specialty || worker.role || (store.categories[0]?.name || 'Campus Security & Patrol');
  showEditModal.value = true;
};

const submitEditPersonnel = async () => {
  if (!editForm.name.trim() || !editForm.specialty) {
    toast.error('Name and specialization are required.');
    return;
  }
  editSubmitting.value = true;
  try {
    await store.updatePersonnel(editingWorker.value.id, editForm);
    toast.success('Personnel updated successfully!');
    showEditModal.value = false;
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to update personnel.');
  } finally {
    editSubmitting.value = false;
  }
};

// ── Delete Personnel Modal ──────────────────────────────────────────────────
const workerToDelete = ref(null);
const deleteSubmitting = ref(false);

const confirmDelete = (worker) => {
  if (worker.status === 'Working' || worker.assignedTicket) {
    toast.warning('Cannot remove personnel actively assigned to a dispatch or collaboration.');
    return;
  }
  workerToDelete.value = worker;
};

const executeDelete = async () => {
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
const newCategoryName = ref('');
const newCategoryServices = ref([]);
const categorySubmitting = ref(false);
const categoryDeleting = ref(null);

const toggleNewService = (service) => {
  const idx = newCategoryServices.value.indexOf(service);
  if (idx >= 0) {
    newCategoryServices.value.splice(idx, 1);
  } else {
    newCategoryServices.value.push(service);
  }
};

const selectAllNewServices = () => {
  newCategoryServices.value = [...SSU_SERVICES];
};

const clearNewServices = () => {
  newCategoryServices.value = [];
};

const submitCategory = async () => {
  if (!newCategoryName.value.trim()) return;
  categorySubmitting.value = true;
  try {
    await store.addCategory(newCategoryName.value.trim(), newCategoryServices.value);
    toast.success('Specialization added!');
    newCategoryName.value = '';
    newCategoryServices.value = [];
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to add specialization.');
  } finally {
    categorySubmitting.value = false;
  }
};

const deleteCategory = async (cat) => {
  categoryDeleting.value = cat.id;
  try {
    await store.removeCategory(cat.id);
    toast.success(`${cat.name} specialization removed.`);
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to remove specialization.');
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
  toast.success('Security personnel leave status updated.');
  await store.fetchPersonnel();
};

onMounted(async () => {
  await Promise.all([
    store.fetchPersonnel(),
    store.fetchCategories()
  ]);
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
