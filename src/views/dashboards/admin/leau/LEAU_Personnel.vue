<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/admin/leau" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        <span class="text">LEAU Home</span>
      </router-link>
      <router-link to="/admin/leau/queues" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
        <span class="text">Ticket Queues</span>
      </router-link>
      <router-link to="/admin/leau/personnel" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        <span class="text">Personnel Management</span>
      </router-link>
      <router-link to="/admin/leau/announcements" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
        <span class="text">Announcements</span>
      </router-link>
      <div class="mt-8 mb-4 px-4">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Archived Tickets</p>
      </div>
      <router-link to="/admin/leau/archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
        <span class="text">Archives</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">LEAU Dashboard</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Landscaping &amp; Environmental Aesthetics</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-6 animate-fade-in pb-12 px-4 sm:px-8 py-8 max-w-[1600px] mx-auto min-h-screen">

        <!-- Page Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div>
            <h2 class="text-3xl font-black tracking-tight text-slate-900 mb-1">LEAU Roster</h2>
            <p class="text-sm text-slate-500 font-medium">Manage and track personnel status and current assignments.</p>
          </div>
          <div class="flex items-center gap-3" v-if="isAdmin">
            <button @click="showCategoryModal = true" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-black hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
              Manage Categories
            </button>
            <button @click="openAddModal" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-black transition-all shadow-sm shadow-emerald-200 active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              Add Personnel
            </button>
          </div>
        </div>

        <!-- Staff Roster Panel -->
        <div class="bg-white border border-slate-200 rounded-3xl sm:rounded-[2.5rem] p-4 sm:p-8 shadow-sm">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h3 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <span class="w-2 h-6 bg-emerald-500 rounded-full"></span>
                Staff Availability Control
              </h3>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Toggle personnel status between Available and On Leave</p>
            </div>
            <div class="flex gap-4">
              <span class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Available</span>
              <span class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><span class="w-2 h-2 rounded-full bg-blue-500"></span> Assigned</span>
              <span class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><span class="w-2 h-2 rounded-full bg-amber-500"></span> Working</span>
              <span class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><span class="w-2 h-2 rounded-full bg-slate-300"></span> On Leave</span>
            </div>
          </div>

          <div class="space-y-8">
            <div v-if="Object.keys(groupedPersonnel).length === 0" class="flex flex-col items-center justify-center py-16 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
              <span class="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">No Personnel Found</span>
              <p class="text-sm text-slate-500 font-medium">The roster is currently empty. Click "Add Personnel" to get started.</p>
            </div>
            <div v-else v-for="(workers, role) in groupedPersonnel" :key="role">
              <h4 class="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {{ role }}s
                <span class="text-[9px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{{ workers.length }}</span>
              </h4>
              <div class="flex flex-col space-y-4">
                <div
                  v-for="worker in workers"
                  :key="worker.id"
                  class="p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm bg-slate-50/40 hover:bg-white hover:shadow-xl hover:border-slate-300 transition-all duration-300 group"
                >
                  <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between xl:justify-start gap-4 sm:gap-6 w-full xl:w-auto xl:min-w-[300px]">
                      <div class="flex items-start sm:items-center gap-3 sm:gap-4 w-full min-w-0">
                        <div class="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors shrink-0 shadow-sm font-black text-xl">
                          {{ worker.name ? worker.name.charAt(0) : 'U' }}
                        </div>
                        <div class="flex-1 min-w-0">
                          <h4 class="text-base font-black text-slate-900 leading-tight mb-1">{{ worker.name }}</h4>
                          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ worker.role }}</p>
                          <div class="mt-3 flex flex-col items-start gap-2.5 w-full">
                            <span
                              @click="toggleWorkerStatus(worker)"
                              :class="[
                                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all',
                                !worker.assignedTicket && worker.status !== 'Working' ? 'cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-emerald-500 active:scale-95' : 'cursor-default',
                                worker.status === 'Working' ? 'bg-amber-50 text-amber-600 border border-amber-200/60' :
                                worker.assignedTicket ? 'bg-blue-50 text-blue-600 border border-blue-200/60' :
                                worker.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60' : 'bg-slate-200 text-slate-500 border border-slate-300'
                              ]">
                              <span :class="['w-1.5 h-1.5 rounded-full animate-pulse', worker.status === 'Working' ? 'bg-amber-500' : worker.assignedTicket ? 'bg-blue-500' : worker.status === 'Available' ? 'bg-emerald-500' : 'bg-slate-400']"></span>
                              {{ worker.status === 'Working' ? 'Working' : worker.assignedTicket ? 'Assigned to'  : (worker.status || 'Available') }}
                            </span>
                            <div class="flex items-center gap-2 w-full sm:w-auto">
                              <button
                                @click="toggleWorkerStatus(worker)"
                                :disabled="worker.status === 'Working' || !!worker.assignedTicket"
                                class="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm border mt-1"
                                :class="worker.status === 'Working' || worker.assignedTicket ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60' : worker.status === 'On Leave' ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600 shadow-emerald-500/20 active:scale-95 cursor-pointer' : 'bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border-slate-200 hover:border-rose-200 active:scale-95 cursor-pointer'"
                              >
                                {{ worker.assignedTicket || worker.status === 'Working' ? 'Locked (In Progress)' : worker.status === 'On Leave' ? 'Set to Available' : 'Set to On Leave' }}
                              </button>
                              <!-- Delete button — only if not active -->
                              <button
                                v-if="worker.status !== 'Working' && !worker.assignedTicket && isAdmin"
                                @click="confirmDelete(worker)"
                                class="mt-1 w-8 h-8 flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-95 shrink-0"
                                title="Remove personnel"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 xl:max-w-3xl items-stretch">
                      <div v-if="worker.status === 'Working' || worker.assignedTicket" @click="toggleTicketExtension(worker.id, worker.assignedTicket)" class="h-full min-h-[140px] p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between bg-white shadow-xs hover:shadow-md" :class="expandedTickets[worker.id] === worker.assignedTicket ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20' : worker.status === 'Working' ? 'border-amber-200 hover:border-amber-400' : 'border-blue-200 hover:border-blue-400'">
                        <div>
                          <div class="flex items-center justify-between gap-2 mb-2">
                            <span class="text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5" :class="worker.status === 'Working' ? 'text-amber-700' : 'text-blue-700'">
                              <span class="w-2 h-2 rounded-full animate-pulse" :class="worker.status === 'Working' ? 'bg-amber-500' : 'bg-blue-500'"></span>
                              {{ worker.status === 'Working' ? 'Currently Working On' : 'Currently Assigned To' }}
                            </span>
                            <span class="text-[10px] font-black px-2.5 py-1 rounded-lg" :class="worker.status === 'Working' ? 'bg-amber-200/80 text-amber-900' : 'bg-blue-200/80 text-blue-900'">{{ formatTicketOrProjectLabel(worker.assignedTicket) }}</span>
                          </div>
                          <p class="text-sm font-bold leading-snug text-slate-800">{{ worker.ticketTask || 'Facilities Maintenance Work' }}</p>
                        </div>
                        <div v-if="worker.implementationDate" class="mt-3 pt-2.5 border-t flex items-center justify-between text-[10px] font-semibold text-slate-600 border-blue-200/60">
                          <span>Target Date:</span>
                          <strong class="font-bold text-slate-800">{{ worker.implementationDate }}</strong>
                        </div>
                      </div>
                      <div v-else class="h-full min-h-[140px] p-4 rounded-2xl bg-slate-100/50 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Active Assignment</span>
                        <p class="text-[11px] text-slate-400 mt-0.5">Worker is currently {{ worker.status ? worker.status.toLowerCase() : 'unavailable' }}.</p>
                      </div>
                      <div v-if="worker.nextAssignmentId" class="h-full min-h-[140px] p-4 rounded-2xl border border-purple-200 hover:border-purple-400 transition-all flex flex-col justify-between bg-white shadow-xs hover:shadow-md">
                        <div>
                          <span class="text-[9px] font-black uppercase tracking-widest text-purple-600 flex items-center gap-1.5 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            Next Queued Job
                          </span>
                          <p class="text-sm font-bold text-slate-800">{{ worker.nextTicketTask || 'Facilities Maintenance Work' }}</p>
                        </div>
                        <div class="mt-3 pt-2.5 border-t border-purple-100 flex items-center justify-between text-[10px] font-bold text-purple-700">
                          <span>Status:</span><span class="text-slate-800">Pending</span>
                        </div>
                      </div>
                      <div v-else class="h-full min-h-[140px] p-4 rounded-2xl bg-slate-100/50 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Next Job Queued</span>
                        <p class="text-[11px] text-slate-400 mt-0.5">No upcoming tickets or projects assigned.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- Add Personnel Modal -->
      <!-- ================================================================== -->
      <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" @click.self="showAddModal = false">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-scale-up overflow-hidden">
          <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-black text-white">Add New Personnel</h3>
                <p class="text-emerald-100 text-xs font-medium mt-0.5">Add a new LEAU staff member to the roster</p>
              </div>
              <button @click="showAddModal = false" class="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-3 gap-3">
              <div class="col-span-2">
                <label class="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wider">First Name <span class="text-red-500">*</span></label>
                <input v-model="addForm.firstName" type="text" placeholder="Juan" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
              </div>
              <div>
                <label class="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wider">M.I.</label>
                <input v-model="addForm.middleInitial" type="text" maxlength="2" placeholder="C" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wider">Last Name <span class="text-red-500">*</span></label>
              <input v-model="addForm.lastName" type="text" placeholder="Dela Cruz" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
            </div>
            <div>
              <label class="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wider">Profession <span class="text-red-500">*</span></label>
              <select v-model="addForm.specialty" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all">
                <option value="" disabled>Select a profession...</option>
                <option v-for="cat in store.categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
              </select>
              <p v-if="store.categories.length === 0" class="text-xs text-amber-600 font-medium mt-1.5 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                No categories yet. Create one in "Manage Categories" first.
              </p>
            </div>
            <div class="flex gap-3 pt-2">
              <button @click="showAddModal = false" class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-black text-sm hover:bg-slate-50 transition-all">Cancel</button>
              <button @click="submitAdd" :disabled="addSubmitting" class="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm transition-all active:scale-95 disabled:opacity-60">
                {{ addSubmitting ? 'Adding...' : 'Add to Roster' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- Manage Categories Modal -->
      <!-- ================================================================== -->
      <div v-if="showCategoryModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" @click.self="showCategoryModal = false">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm animate-scale-up overflow-hidden">
          <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-black text-white">Personnel Categories</h3>
                <p class="text-slate-400 text-xs font-medium mt-0.5">Manage LEAU profession categories</p>
              </div>
              <button @click="showCategoryModal = false" class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <!-- Add new category -->
            <div class="flex gap-2">
              <input v-model="newCategoryName" @keyup.enter="submitCategory" type="text" placeholder="e.g., Welder" class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
              <button @click="submitCategory" :disabled="categorySubmitting || !newCategoryName.trim()" class="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-black transition-all active:scale-95 disabled:opacity-50">
                {{ categorySubmitting ? '...' : 'Add' }}
              </button>
            </div>

            <!-- List existing categories -->
            <div class="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
              <div v-if="store.categories.length === 0" class="text-center py-6 text-sm text-slate-400 font-medium">No categories yet. Add one above.</div>
              <div v-for="cat in store.categories" :key="cat.id" class="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100 group">
                <span class="text-sm font-bold text-slate-800">{{ cat.name }}</span>
                <button
                  v-if="!cat.is_system"
                  @click="deleteCategory(cat)"
                  :disabled="categoryDeleting === cat.id"
                  class="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                  title="Remove category"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
                <span v-else class="text-[9px] font-black text-slate-400 uppercase tracking-wider px-2 py-0.5 bg-slate-200 rounded-full">System</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirm Modal -->
      <div v-if="workerToDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" @click.self="workerToDelete = null">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm animate-scale-up p-6">
          <div class="flex items-start gap-4 mb-6">
            <div class="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div>
              <h3 class="text-base font-black text-slate-900">Remove Personnel?</h3>
              <p class="text-sm text-slate-500 mt-1">This will permanently remove <strong class="text-slate-800">{{ workerToDelete?.name }}</strong> from the roster. This action cannot be undone.</p>
            </div>
          </div>
          <div class="flex gap-3">
            <button @click="workerToDelete = null" class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-black text-sm hover:bg-slate-50 transition-all">Cancel</button>
            <button @click="submitDelete" :disabled="deleteSubmitting" class="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-sm transition-all active:scale-95 disabled:opacity-60">
              {{ deleteSubmitting ? 'Removing...' : 'Yes, Remove' }}
            </button>
          </div>
        </div>
      </div>

    </template>
  </MainLayout>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useToast } from 'vue-toastification';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import { useLeauPersonnelStore } from '@/stores/leauPersonnel';
import { useAuthStore } from '@/stores/auth';
import { formatTicketOrProjectLabel } from '@/utils/projectFormatter';

const store = useLeauPersonnelStore();
const authStore = useAuthStore();
const toast = useToast();

const isAdmin = computed(() => authStore.role === 'admin' || authStore.role === 'unit-admin');

const groupedPersonnel = computed(() => store.groupedPersonnel);
const expandedTickets  = ref({});

// ── Modals ─────────────────────────────────────────────────────────────────
const showAddModal      = ref(false);
const showCategoryModal = ref(false);
const workerToDelete    = ref(null);

// ── Add Personnel ──────────────────────────────────────────────────────────
const addForm = ref({ firstName: '', middleInitial: '', lastName: '', specialty: '' });
const addSubmitting = ref(false);

const openAddModal = () => {
  addForm.value = { firstName: '', middleInitial: '', lastName: '', specialty: '' };
  showAddModal.value = true;
};

const submitAdd = async () => {
  const { firstName, lastName, specialty } = addForm.value;
  if (!firstName.trim() || !lastName.trim() || !specialty) {
    toast.error('Please fill in all required fields.');
    return;
  }
  addSubmitting.value = true;
  try {
    await store.addPersonnel(addForm.value);
    toast.success('Personnel added to roster!');
    showAddModal.value = false;
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to add personnel.');
  } finally {
    addSubmitting.value = false;
  }
};

// ── Category Management ────────────────────────────────────────────────────
const newCategoryName  = ref('');
const categorySubmitting = ref(false);
const categoryDeleting = ref(null);

const submitCategory = async () => {
  if (!newCategoryName.value.trim()) return;
  categorySubmitting.value = true;
  try {
    await store.addCategory(newCategoryName.value.trim());
    toast.success('Category added!');
    newCategoryName.value = '';
  } catch (err) {
    const msg = err?.response?.data?.message || 'Failed to add category.';
    toast.error(msg);
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
    const msg = err?.response?.data?.message || 'Failed to remove category.';
    toast.error(msg);
  } finally {
    categoryDeleting.value = null;
  }
};

// ── Delete Personnel ───────────────────────────────────────────────────────
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

// ── Status Toggle ──────────────────────────────────────────────────────────
const toggleWorkerStatus = (worker) => {
  if (worker.status === 'Working' || worker.assignedTicket) return;
  store.toggleWorkerStatus(worker.id);
};

const toggleTicketExtension = (workerId, ticketId) => {
  if (!ticketId) return;
  expandedTickets.value[workerId] = expandedTickets.value[workerId] === ticketId ? null : ticketId;
};

// ── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(() => {
  store.fetchPersonnel();
  store.fetchCategories();
  const interval = setInterval(() => store.fetchPersonnel(), 5000);
  // Note: interval cleanup handled by Vue unmount in production
});
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes scale-up { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
.animate-scale-up { animation: scale-up 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
</style>

