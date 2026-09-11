<template>
  <MainLayout>
    <template #header-title>
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none">User Account Management</h2>
          <span class="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-wider border border-purple-200">
            {{ pagination.total }} Accounts
          </span>
        </div>
        <p class="text-xs font-medium text-slate-500 hidden sm:block mt-0.5">Provision, edit roles, transfer units, and manage account statuses</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-6 animate-fade-in relative pb-12">

        <!-- Action Header Bar -->
        <div class="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <!-- Live Search Bar -->
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="filters.search"
              @input="handleSearch"
              type="text"
              placeholder="Search by name, email, or student ID..."
              class="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all"
            />
            <button
              v-if="filters.search"
              @click="filters.search = ''; fetchUsers()"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Actions & Modals Trigger -->
          <div class="flex items-center gap-2 shrink-0">
            <button
              @click="openCreateModal"
              class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>Provision User</span>
            </button>
          </div>
        </div>

        <!-- Faceted Filters Bar -->
        <div class="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <!-- Role Filter Tabs -->
          <div class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 max-w-full">
            <button
              v-for="role in roleOptions"
              :key="role.value"
              @click="setRoleFilter(role.value)"
              class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap"
              :class="filters.role === role.value ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'"
            >
              {{ role.label }}
            </button>
          </div>

          <!-- Unit & Status Dropdowns -->
          <div class="flex items-center gap-2 shrink-0">
            <select
              v-model="filters.unit_id"
              @change="fetchUsers"
              class="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Units</option>
              <option value="1">FGMU</option>
              <option value="2">LEAU</option>
              <option value="3">SSU</option>
              <option value="none">Global / No Unit</option>
            </select>

            <select
              v-model="filters.status"
              @change="fetchUsers"
              class="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <!-- User Accounts Table / Responsive Card Stack -->
        <div class="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden p-4 sm:p-6">
          <!-- Loading State -->
          <div v-if="isLoading" class="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
            <svg class="animate-spin h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-sm font-bold">Loading user accounts...</span>
          </div>

          <!-- Error State -->
          <div v-else-if="fetchError" class="py-16 flex flex-col items-center justify-center gap-3 text-rose-500">
            <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm font-bold">Failed to load users</p>
            <p class="text-xs text-slate-500">{{ fetchError }}</p>
            <button @click="fetchUsers" class="mt-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors">Retry</button>
          </div>

          <!-- Desktop Table -->
          <div v-else class="hidden md:block overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th class="pb-3 px-3">User / Identity</th>
                  <th class="pb-3 px-3">Role</th>
                  <th class="pb-3 px-3">Unit Affiliation</th>
                  <th class="pb-3 px-3">Verification</th>
                  <th class="pb-3 px-3">Status</th>
                  <th class="pb-3 px-3">Joined</th>
                  <th class="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50 text-xs">
                <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50/70 transition-colors">
                  <!-- Name & Email -->
                  <td class="py-3.5 px-3">
                    <div class="flex items-center gap-3">
                      <img
                        v-if="user.avatar_path"
                        :src="getAvatarUrl(user.id)"
                        alt="Avatar"
                        class="w-9 h-9 rounded-xl object-cover border border-purple-200 shrink-0"
                      />
                      <div v-else class="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 font-bold flex items-center justify-center shrink-0 border border-purple-100">
                        {{ user.first_name ? user.first_name.charAt(0).toUpperCase() : 'U' }}
                      </div>
                      <div class="flex flex-col min-w-0">
                        <div class="flex items-center gap-1.5">
                          <span class="font-bold text-slate-900 truncate">{{ user.first_name }} {{ user.last_name }}</span>
                          <span v-if="user.student_id_number" class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                            {{ user.student_id_number }}
                          </span>
                        </div>
                        <span class="text-[11px] text-slate-500 truncate">{{ user.email || 'No email provided' }}</span>
                        <span v-if="user.contact_number" class="text-[10px] text-slate-400 font-medium">📞 {{ user.contact_number }}</span>
                      </div>
                    </div>
                  </td>

                  <!-- Role -->
                  <td class="py-3.5 px-3">
                    <span class="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border" :class="getRoleBadgeClass(user.role)">
                      {{ user.role }}
                    </span>
                  </td>

                  <!-- Unit -->
                  <td class="py-3.5 px-3">
                    <span v-if="user.unit_code" class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                      {{ user.unit_code }}
                    </span>
                    <span v-else class="text-[11px] text-slate-400 italic">None (Global)</span>
                  </td>

                  <!-- Verification Column -->
                  <td class="py-3.5 px-3">
                    <span 
                      v-if="user.status === 'Rejected'" 
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200"
                    >
                      <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Rejected
                    </span>
                    <span 
                      v-else-if="isUserVerified(user)" 
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200"
                    >
                      <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      Verified
                    </span>
                    <button
                      v-else
                      @click="openInspectModal(user)"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 transition-colors"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      Pending ID
                    </button>
                  </td>

                  <!-- Status -->
                  <td class="py-3.5 px-3">
                    <span class="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border" :class="getStatusBadgeClass(user.status)">
                      {{ user.status || 'Active' }}
                    </span>
                  </td>

                  <!-- Joined Date -->
                  <td class="py-3.5 px-3 text-slate-500 whitespace-nowrap">
                    {{ user.created_at ? new Date(user.created_at).toLocaleDateString() : '—' }}
                  </td>

                  <!-- Action Buttons -->
                  <td class="py-3.5 px-3 text-right">
                    <div class="flex items-center justify-end gap-1.5">
                      <button
                        @click="openInspectModal(user)"
                        class="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition-colors flex items-center gap-1"
                        title="Inspect Institutional ID Card"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        ID
                      </button>
                      <button
                        @click="openEditModal(user)"
                        class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                        title="Edit User"
                      >
                        Edit
                      </button>
                      <button
                        @click="confirmDeleteUser(user)"
                        class="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-colors"
                        title="Delete / Suspend User"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="users.length === 0">
                  <td colspan="7" class="py-12 text-center text-slate-400 font-bold">
                    No user accounts found matching your filters.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Cards View -->
          <div v-if="!isLoading && !fetchError" class="md:hidden space-y-3">
            <div v-for="user in users" :key="'mob-' + user.id" class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <span class="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border" :class="getRoleBadgeClass(user.role)">
                    {{ user.role }}
                  </span>
                  <span 
                    v-if="user.status === 'Rejected'" 
                    class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200"
                  >
                    Rejected
                  </span>
                  <span 
                    v-else-if="isUserVerified(user)" 
                    class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200"
                  >
                    Verified
                  </span>
                  <span 
                    v-else 
                    class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200"
                  >
                    Pending ID
                  </span>
                </div>
                <span class="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border" :class="getStatusBadgeClass(user.status)">
                  {{ user.status || 'Active' }}
                </span>
              </div>

              <div class="flex items-center gap-3">
                <img
                  v-if="user.avatar_path"
                  :src="getAvatarUrl(user.id)"
                  alt="Avatar"
                  class="w-10 h-10 rounded-xl object-cover border border-purple-200 shrink-0"
                />
                <div v-else class="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 font-bold flex items-center justify-center shrink-0 border border-purple-100">
                  {{ user.first_name ? user.first_name.charAt(0).toUpperCase() : 'U' }}
                </div>
                <div class="min-w-0">
                  <h4 class="text-sm font-black text-slate-900 leading-snug truncate">{{ user.first_name }} {{ user.last_name }}</h4>
                  <p v-if="user.student_id_number" class="text-xs font-bold text-purple-700">ID: {{ user.student_id_number }}</p>
                  <p class="text-xs text-slate-600 font-medium truncate">{{ user.email || 'No email provided' }}</p>
                  <p v-if="user.unit_code" class="text-xs text-slate-500 font-semibold mt-0.5">Unit: <span class="font-bold text-slate-800">{{ user.unit_code }}</span></p>
                </div>
              </div>

              <div class="flex items-center gap-2 pt-2 border-t border-slate-200">
                <button @click="openInspectModal(user)" class="py-2 px-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold hover:bg-purple-100 transition-colors text-center flex items-center justify-center gap-1">
                  Inspect ID
                </button>
                <button @click="openEditModal(user)" class="flex-1 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors text-center">
                  Edit
                </button>
                <button @click="confirmDeleteUser(user)" class="py-2 px-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-colors text-center">
                  Delete
                </button>
              </div>
            </div>

            <div v-if="users.length === 0" class="py-8 text-center text-slate-400 font-bold text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              No user accounts found matching your filters.
            </div>
          </div>

          <!-- Pagination Bar -->
          <div v-if="pagination.total_pages > 1" class="flex items-center justify-between pt-5 border-t border-slate-100 text-xs text-slate-500">
            <span>Page {{ pagination.page }} of {{ pagination.total_pages }}</span>
            <div class="flex items-center gap-1.5">
              <button
                @click="changePage(pagination.page - 1)"
                :disabled="pagination.page <= 1"
                class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 font-bold"
              >
                Previous
              </button>
              <button
                @click="changePage(pagination.page + 1)"
                :disabled="pagination.page >= pagination.total_pages"
                class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 font-bold"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #modal-overlay>
      <!-- Provision User Modal -->
      <div 
        v-if="isCreateModalOpen" 
        class="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-auto"
        @click.self="isCreateModalOpen = false"
      >
        <div 
          class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-200 animate-scale-up max-h-[90vh] overflow-y-auto custom-scrollbar pointer-events-auto"
          @click.stop
        >
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 class="text-lg font-black text-slate-900 tracking-tight">Provision New Account</h3>
              <p class="text-xs text-slate-500 font-medium">Add a user with dedicated university role privileges</p>
            </div>
            <button 
              type="button"
              @click="isCreateModalOpen = false" 
              class="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitCreateUser" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">First Name *</label>
                <input v-model="createForm.first_name" type="text" required class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors" placeholder="e.g. John" />
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Last Name *</label>
                <input v-model="createForm.last_name" type="text" required class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors" placeholder="e.g. Doe" />
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Email Address *</label>
              <input v-model="createForm.email" type="email" required class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors" placeholder="name@bsu.edu.ph" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">System Role *</label>
                <select v-model="createForm.role" required class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors cursor-pointer">
                  <option value="student">Student (Requester)</option>
                  <option value="employee">Employee (Requester)</option>
                  <option value="worker">Worker (Field Technician)</option>
                  <option value="dispatcher">Dispatcher (Control)</option>
                  <option value="admin">Admin (Unit Governance)</option>
                  <option value="director">Director (Executive)</option>
                  <option value="superadmin">Superadmin (Master)</option>
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Assigned Sub-Unit</label>
                <select v-model="createForm.unit_id" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors cursor-pointer" :disabled="['student', 'employee', 'superadmin', 'director'].includes(createForm.role)">
                  <option :value="null">None (Global / Cross-Campus)</option>
                  <option :value="1">Facilities & Grounds (FGMU)</option>
                  <option :value="2">Landscaping & Aesthetics (LEAU)</option>
                  <option :value="3">Security Services (SSU)</option>
                </select>
              </div>
            </div>

            <div v-if="createForm.role === 'student'">
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Student ID Number (Optional)</label>
              <input v-model="createForm.student_id_number" type="text" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors" placeholder="e.g. 21-12345" />
            </div>

            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Contact Number</label>
              <input v-model="createForm.contact_number" type="text" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors" placeholder="09xxxxxxxxx" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Temporary Password *</label>
                <input v-model="createForm.password" type="password" required minlength="6" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors" placeholder="Minimum 6 chars" />
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Confirm Password *</label>
                <input v-model="createForm.confirm_password" type="password" required minlength="6" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors" placeholder="Re-type password" />
              </div>
            </div>

            <div v-if="modalError" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold leading-relaxed animate-fade-in">
              {{ modalError }}
            </div>

            <div class="flex items-center justify-end gap-3 pt-3">
              <button type="button" @click="isCreateModalOpen = false" class="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 transition-colors">Cancel</button>
              <button type="submit" :disabled="isSubmitting" class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-2">
                <span v-if="isSubmitting" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>{{ isSubmitting ? 'Provisioning...' : 'Confirm & Create' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Edit User Modal -->
      <div 
        v-if="isEditModalOpen" 
        class="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-auto"
        @click.self="isEditModalOpen = false"
      >
        <div 
          class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-200 animate-scale-up max-h-[90vh] overflow-y-auto custom-scrollbar pointer-events-auto"
          @click.stop
        >
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 class="text-lg font-black text-slate-900 tracking-tight">Edit Account Privileges</h3>
              <p class="text-xs text-slate-500 font-medium">{{ editForm.email }}</p>
            </div>
            <button 
              type="button"
              @click="isEditModalOpen = false" 
              class="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitEditUser" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">First Name</label>
                <input v-model="editForm.first_name" type="text" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors" />
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Last Name</label>
                <input v-model="editForm.last_name" type="text" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Role</label>
                <select v-model="editForm.role" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors cursor-pointer">
                  <option value="student">Student</option>
                  <option value="employee">Employee</option>
                  <option value="worker">Worker</option>
                  <option value="dispatcher">Dispatcher</option>
                  <option value="admin">Admin</option>
                  <option value="director">Director</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Sub-Unit</label>
                <select v-model="editForm.unit_id" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors cursor-pointer" :disabled="['student', 'employee', 'superadmin', 'director'].includes(editForm.role)">
                  <option :value="null">None (Global / Cross-Campus)</option>
                  <option :value="1">Facilities & Grounds (FGMU)</option>
                  <option :value="2">Landscaping & Aesthetics (LEAU)</option>
                  <option :value="3">Security Services (SSU)</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Account Status</label>
              <select v-model="editForm.status" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors cursor-pointer">
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Reset Password</label>
                <input v-model="editForm.password" type="password" minlength="6" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors" placeholder="Leave empty to keep" />
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Confirm Reset Password</label>
                <input v-model="editForm.confirm_password" type="password" minlength="6" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors" :disabled="!editForm.password" placeholder="Confirm new password" />
              </div>
            </div>

            <div v-if="modalError" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold leading-relaxed animate-fade-in">
              {{ modalError }}
            </div>

            <div class="flex items-center justify-end gap-3 pt-3">
              <button type="button" @click="isEditModalOpen = false" class="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 transition-colors">Cancel</button>
              <button type="submit" :disabled="isSubmitting" class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-2">
                <span v-if="isSubmitting" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>{{ isSubmitting ? 'Saving...' : 'Save Changes' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Inspect ID Card & Verification Modal -->
      <div 
        v-if="isInspectModalOpen && inspectingUser" 
        class="fixed inset-0 z-[75] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-auto"
        @click.self="isInspectModalOpen = false"
      >
        <div 
          class="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-200 animate-scale-up max-h-[92vh] overflow-y-auto custom-scrollbar pointer-events-auto"
          @click.stop
        >
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-black uppercase tracking-wider mb-1">
                Institutional ID Inspection
              </div>
              <h3 class="text-lg font-black text-slate-900 tracking-tight">Verify Account Identity</h3>
            </div>
            <button 
              type="button"
              @click="isInspectModalOpen = false" 
              class="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- User Details Summary Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs">
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</p>
              <p class="font-bold text-slate-900 mt-0.5 truncate">{{ inspectingUser.first_name }} {{ inspectingUser.last_name }}</p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role</p>
              <p class="font-bold text-slate-900 mt-0.5 capitalize">{{ inspectingUser.role }}</p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID Number</p>
              <p class="font-bold text-emerald-700 mt-0.5">{{ inspectingUser.student_id_number || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact</p>
              <p class="font-bold text-slate-900 mt-0.5">{{ inspectingUser.contact_number || 'N/A' }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
              <p class="font-medium text-slate-700 mt-0.5">{{ inspectingUser.email || 'None (Elderly / Offline User)' }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verification Status</p>
              <p 
                class="font-bold mt-0.5" 
                :class="inspectingUser.status === 'Rejected' ? 'text-rose-600' : (isUserVerified(inspectingUser) ? 'text-emerald-700' : 'text-amber-600')"
              >
                {{ inspectingUser.status === 'Rejected' ? 'Rejected' : (isUserVerified(inspectingUser) ? 'Verified' : 'Pending Verification') }}
              </p>
            </div>
          </div>

          <!-- Uploaded ID Card High-Res Image Display -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="block text-[11px] font-black text-slate-700 uppercase tracking-wider">
                Uploaded Institutional ID Card
              </label>
              <a 
                :href="getIdCardUrl(inspectingUser.id)" 
                target="_blank" 
                class="text-[11px] font-bold text-purple-700 hover:text-purple-900 hover:underline inline-flex items-center gap-1"
              >
                Open High-Res In New Tab
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-slate-900 overflow-hidden flex items-center justify-center p-2 min-h-[220px]">
              <img 
                :src="getIdCardUrl(inspectingUser.id)" 
                alt="Institutional ID Card" 
                class="max-h-[380px] w-full object-contain rounded-xl"
                @error="$event.target.style.display='none'; $event.target.nextElementSibling.style.display='block'"
              />
              <div style="display:none" class="text-slate-400 text-xs text-center py-10">
                <svg class="h-10 w-10 text-slate-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                No ID card snapshot found or image could not be loaded.
              </div>
            </div>
            <p class="text-[11px] text-slate-500 italic">
              Verification check: ensure the photo, full name, and ID number on the card match the institutional records.
            </p>
          </div>

          <!-- Actions -->
          <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button 
              type="button"
              @click="isInspectModalOpen = false" 
              class="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button 
              type="button"
              :disabled="isActionLoading || inspectingUser.status === 'Rejected'"
              @click="handleRejectVerification(inspectingUser)" 
              class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <span>{{ inspectingUser.status === 'Rejected' ? 'Already Rejected' : 'Reject / Invalidate' }}</span>
            </button>
            <button 
              type="button"
              :disabled="isActionLoading || isUserVerified(inspectingUser)"
              @click="handleApproveVerification(inspectingUser)" 
              class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <svg v-if="!isActionLoading" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ isUserVerified(inspectingUser) ? 'Already Verified' : 'Approve & Verify Identity' }}</span>
            </button>
          </div>
        </div>
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import api from '@/api/client';

const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1').replace(/\/+$/, '');

const getIdCardUrl = (userId) => {
  if (!userId) return '';
  return `${apiBase}/auth/id-card/${userId}`;
};

const getAvatarUrl = (userId) => {
  if (!userId) return '';
  return `${apiBase}/auth/avatar/${userId}`;
};

const users = ref([]);
const isLoading = ref(false);
const fetchError = ref('');
const inspectingUser = ref(null);
const isInspectModalOpen = ref(false);
const isActionLoading = ref(false);

const isUserVerified = (u) => {
  if (!u) return false;
  return Number(u.is_verified) === 1;
};

const openInspectModal = (user) => {
  inspectingUser.value = user;
  isInspectModalOpen.value = true;
};

const handleApproveVerification = async (user) => {
  if (!user) return;
  isActionLoading.value = true;
  try {
    const res = await api.patch(`/superadmin/users/${user.id}/verify`, {});
    toast.success(res.data?.message || 'User identity verified and approved!');
    isInspectModalOpen.value = false;
    await fetchUsers();
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to approve verification.');
  } finally {
    isActionLoading.value = false;
  }
};

const handleRejectVerification = async (user) => {
  if (!user) return;
  if (!confirm(`Are you sure you want to reject identity verification for ${user.first_name} ${user.last_name}?`)) {
    return;
  }
  isActionLoading.value = true;
  try {
    const res = await api.patch(`/superadmin/users/${user.id}/reject`, {
      reason: 'Identity document could not be verified.'
    });
    toast.info(res.data?.message || 'User verification has been rejected.');
    isInspectModalOpen.value = false;
    await fetchUsers();
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to reject verification.');
  } finally {
    isActionLoading.value = false;
  }
};

const pagination = reactive({
  total: 0,
  page: 1,
  per_page: 15,
  total_pages: 1
});

const filters = reactive({
  search: '',
  role: 'all',
  unit_id: 'all',
  status: 'all'
});

const roleOptions = [
  { value: 'all', label: 'All Roles' },
  { value: 'admin', label: 'Admins' },
  { value: 'dispatcher', label: 'Dispatchers' },
  { value: 'director', label: 'Directors' },
  { value: 'worker', label: 'Workers' },
  { value: 'employee', label: 'Employees' },
  { value: 'student', label: 'Students' },
  { value: 'superadmin', label: 'Superadmin' }
];

const isCreateModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isSubmitting = ref(false);
const modalError = ref('');

const createForm = reactive({
  first_name: '',
  last_name: '',
  email: '',
  role: 'admin',
  unit_id: 1,
  password: '',
  confirm_password: '',
  contact_number: '',
  student_id_number: '',
  status: 'Active'
});

const editForm = reactive({
  id: '',
  first_name: '',
  last_name: '',
  email: '',
  role: 'admin',
  unit_id: null,
  status: 'Active',
  password: '',
  confirm_password: '',
  contact_number: ''
});

// Automatically manage sub-unit selection based on selected system role
watch(() => createForm.role, (newRole) => {
  if (['student', 'employee', 'superadmin', 'director'].includes(newRole)) {
    createForm.unit_id = null;
  } else if (!createForm.unit_id) {
    createForm.unit_id = 1;
  }
});

watch(() => editForm.role, (newRole) => {
  if (['student', 'employee', 'superadmin', 'director'].includes(newRole)) {
    editForm.unit_id = null;
  } else if (!editForm.unit_id) {
    editForm.unit_id = 1;
  }
});

const getRoleBadgeClass = (role) => {
  const map = {
    superadmin: 'bg-purple-100 text-purple-700 border-purple-200',
    admin: 'bg-slate-200 text-slate-800 border-slate-300',
    dispatcher: 'bg-blue-100 text-blue-700 border-blue-200',
    director: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    worker: 'bg-amber-100 text-amber-700 border-amber-200',
    employee: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    student: 'bg-teal-100 text-teal-700 border-teal-200'
  };
  return map[role] || 'bg-slate-100 text-slate-600 border-slate-200';
};

const getStatusBadgeClass = (status) => {
  const map = {
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Suspended: 'bg-rose-50 text-rose-700 border-rose-200',
    Rejected: 'bg-rose-50 text-rose-700 border-rose-200'
  };
  return map[status] || 'bg-slate-100 text-slate-600 border-slate-200';
};

let searchTimer = null;
const handleSearch = () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    pagination.page = 1;
    fetchUsers();
  }, 300);
};

const setRoleFilter = (role) => {
  filters.role = role;
  pagination.page = 1;
  fetchUsers();
};

const changePage = (newPage) => {
  pagination.page = newPage;
  fetchUsers();
};

const fetchUsers = async () => {
  isLoading.value = true;
  fetchError.value = '';
  try {
    const params = new URLSearchParams({
      page: pagination.page,
      per_page: pagination.per_page,
      search: filters.search || '',
      role: filters.role || 'all',
      unit_id: filters.unit_id || 'all',
      status: filters.status || 'all'
    });

    const res = await api.get(`/superadmin/users?${params.toString()}`);
    const payload = res.data?.data || res.data;
    if (payload) {
      users.value = payload.users || res.data?.users || [];
      const pg = payload.pagination || res.data?.pagination;
      if (pg) {
        pagination.total = pg.total ?? 0;
        pagination.total_pages = pg.total_pages ?? 1;
      }
    }
  } catch (err) {
    console.error('Failed to fetch users:', err);
    fetchError.value = err.response?.data?.message || err.message || 'Could not load user accounts. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const openCreateModal = () => {
  modalError.value = '';
  createForm.first_name = '';
  createForm.last_name = '';
  createForm.email = '';
  createForm.role = 'admin';
  createForm.unit_id = 1;
  createForm.password = '';
  createForm.confirm_password = '';
  createForm.contact_number = '';
  createForm.student_id_number = '';
  createForm.status = 'Active';
  isCreateModalOpen.value = true;
};

const submitCreateUser = async () => {
  isSubmitting.value = true;
  modalError.value = '';

  if (createForm.password !== createForm.confirm_password) {
    modalError.value = 'Passwords do not match.';
    isSubmitting.value = false;
    return;
  }

  try {
    const isGlobal = ['student', 'employee', 'superadmin', 'director'].includes(createForm.role);
    const payload = {
      first_name: createForm.first_name.trim(),
      last_name: createForm.last_name.trim(),
      email: createForm.email.trim(),
      role: createForm.role,
      password: createForm.password,
      confirm_password: createForm.confirm_password,
      status: createForm.status,
      unit_id: isGlobal ? null : (createForm.unit_id ? Number(createForm.unit_id) : null),
      contact_number: createForm.contact_number ? createForm.contact_number.trim() : null,
      student_id_number: createForm.role === 'student' && createForm.student_id_number ? createForm.student_id_number.trim() : null,
    };

    const res = await api.post('/superadmin/users', payload);
    if (res.data?.status === true || res.data?.success || res.status === 201) {
      toast.success(res.data?.message || 'User account provisioned successfully!');
      isCreateModalOpen.value = false;
      fetchUsers();
    } else {
      modalError.value = res.data?.message || 'Failed to create user.';
    }
  } catch (err) {
    const errorData = err.response?.data;
    if (errorData?.errors && typeof errorData.errors === 'object' && Object.keys(errorData.errors).length > 0) {
      modalError.value = Object.values(errorData.errors).join(' ');
    } else {
      modalError.value = errorData?.message || 'Failed to provision account.';
    }
  } finally {
    isSubmitting.value = false;
  }
};

const openEditModal = (user) => {
  modalError.value = '';
  editForm.id = user.id;
  editForm.first_name = user.first_name || '';
  editForm.last_name = user.last_name || '';
  editForm.email = user.email || '';
  editForm.role = user.role || 'student';
  editForm.unit_id = user.unit_id || null;
  editForm.status = user.status || 'Active';
  editForm.password = '';
  editForm.confirm_password = '';
  editForm.contact_number = user.contact_number || '';
  isEditModalOpen.value = true;
};

const submitEditUser = async () => {
  isSubmitting.value = true;
  modalError.value = '';
  try {
    const isGlobal = ['student', 'employee', 'superadmin', 'director'].includes(editForm.role);
    const payload = {
      first_name: editForm.first_name ? editForm.first_name.trim() : undefined,
      last_name: editForm.last_name ? editForm.last_name.trim() : undefined,
      role: editForm.role,
      status: editForm.status,
      unit_id: isGlobal ? null : (editForm.unit_id ? Number(editForm.unit_id) : null),
      contact_number: editForm.contact_number ? editForm.contact_number.trim() : null,
    };
    if (editForm.password && editForm.password.trim()) {
      if (editForm.password !== editForm.confirm_password) {
        modalError.value = 'Passwords do not match.';
        isSubmitting.value = false;
        return;
      }
      payload.password = editForm.password.trim();
      payload.confirm_password = editForm.confirm_password.trim();
    }

    const res = await api.put(`/superadmin/users/${editForm.id}`, payload);
    if (res.data?.status === true || res.data?.success || res.status === 200) {
      toast.success(res.data?.message || 'User account updated successfully!');
      isEditModalOpen.value = false;
      fetchUsers();
    } else {
      modalError.value = res.data?.message || 'Failed to update user.';
    }
  } catch (err) {
    const errorData = err.response?.data;
    if (errorData?.errors && typeof errorData.errors === 'object' && Object.keys(errorData.errors).length > 0) {
      modalError.value = Object.values(errorData.errors).join(' ');
    } else {
      modalError.value = errorData?.message || 'Failed to update account.';
    }
  } finally {
    isSubmitting.value = false;
  }
};

const confirmDeleteUser = async (user) => {
  if (!confirm(`Are you sure you want to deactivate or suspend the account of ${user.first_name} ${user.last_name} (${user.email})?`)) {
    return;
  }

  try {
    const res = await api.delete(`/superadmin/users/${user.id}`);
    toast.success(res.data?.message || 'User account deactivated successfully.');
    fetchUsers();
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to deactivate account.');
  }
};

onMounted(() => {
  fetchUsers();
});
</script>
