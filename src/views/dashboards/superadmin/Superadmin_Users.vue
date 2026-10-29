<template>
  <MainLayout>
    <template #header-title>
      <h2 class="text-sm sm:text-xl font-bold text-slate-900 tracking-tight truncate">
        User Accounts
      </h2>
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
              data-tour="superadmin-search-input"
              type="text"
              placeholder="Search by name, email, employee or student ID number"
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
          <div class="flex items-center gap-2 w-full sm:w-auto shrink-0 flex-wrap sm:flex-nowrap">
            <!-- Action Button: Archive Inactive Users (6+ months without requests or logins) -->
            <button
              @click="openArchiveInactiveModal"
              class="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-black uppercase tracking-wider shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95 min-h-[44px] touch-manipulation cursor-pointer"
              title="Archive users who have not requested or logged in for 6 months"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span>Archive Inactive</span>
              <span
                v-if="inactiveCount > 0"
                class="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-200 text-amber-900 border border-amber-300 ml-0.5"
                :title="`${inactiveCount} account(s) inactive for 6+ months`"
              >
                {{ inactiveCount }}
              </span>
            </button>

            <!-- Provision User Button -->
            <button
              data-tour="superadmin-btn-provision"
              @click="openCreateModal"
              class="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95 min-h-[44px] touch-manipulation shrink-0 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>Provision User</span>
            </button>
          </div>
        </div>

        <!-- Faceted Filters Bar -->
        <div class="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
          <!-- Role Filter Tabs -->
          <div data-tour="superadmin-role-tabs" class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1.5 w-full sm:w-auto max-w-full flex-nowrap">
            <button
              v-for="role in roleOptions"
              :key="role.value"
              @click="setRoleFilter(role.value)"
              class="px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap min-h-[36px] touch-manipulation cursor-pointer shrink-0"
              :class="filters.role === role.value ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'"
            >
              {{ role.label }}
            </button>
          </div>

          <!-- Role, Unit, Status Dropdowns & Option to Show Delete Button -->
          <div class="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end shrink-0 flex-wrap sm:flex-nowrap">
            <select
              v-model="filters.role"
              @change="handleFilterChange"
              class="flex-1 sm:flex-initial px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none focus:border-purple-500 cursor-pointer min-h-[40px] touch-manipulation"
              title="Filter by Role"
            >
              <option value="all">All Roles</option>
              <option value="worker">Personnel</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="director">Director</option>
              <option value="employee">Employee</option>
              <option value="student">Student</option>
              <option value="superadmin">Superadmin</option>
            </select>

            <select
              v-model="filters.unit_id"
              @change="handleFilterChange"
              class="flex-1 sm:flex-initial px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none focus:border-purple-500 cursor-pointer min-h-[40px] touch-manipulation"
              title="Filter by Sub-Unit"
            >
              <option value="all">All Units</option>
              <option value="1">FGMU</option>
              <option value="2">LEAU</option>
              <option value="3">SSU</option>
              <option value="none">Global / No Unit</option>
            </select>

            <select
              v-model="filters.status"
              @change="handleFilterChange"
              class="flex-1 sm:flex-initial px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none focus:border-purple-500 cursor-pointer min-h-[40px] touch-manipulation"
              title="Filter by Account Status"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
              <option value="Archived">Archived</option>
              <option value="Rejected">Rejected</option>
            </select>

            <!-- Option to Show / Hide Delete Buttons -->
            <button
              type="button"
              @click="showDeleteActions = !showDeleteActions"
              class="px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 min-h-[40px] touch-manipulation cursor-pointer border shrink-0"
              :class="showDeleteActions 
                ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'"
              :title="showDeleteActions ? 'Hide permanent deletion buttons' : 'Show permanent deletion buttons'"
            >
              <svg v-if="!showDeleteActions" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-rose-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{{ showDeleteActions ? 'Hide Delete' : 'Show Delete' }}</span>
            </button>
          </div>
        </div>

        <!-- Deletion Mode Active Banner -->
        <div v-if="showDeleteActions" class="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-rose-800 shadow-2xs animate-fade-in">
          <div class="flex items-center gap-2">
            <svg class="h-4 w-4 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span class="font-medium"><strong>Deletion mode enabled:</strong> Delete buttons are unlocked on user accounts. Exercise caution as deletions are permanent.</span>
          </div>
          <button
            type="button"
            @click="showDeleteActions = false"
            class="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold text-[11px] transition-colors shrink-0 cursor-pointer"
          >
            Lock & Hide
          </button>
        </div>

        <!-- User Accounts Table / Responsive Card Stack -->
        <div data-tour="superadmin-users-table" class="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden p-4 sm:p-6">
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
                  <th class="pb-3 px-3">Unit</th>
                  <th class="pb-3 px-3">Verification</th>
                  <th class="pb-3 px-3">Status</th>
                  <th class="pb-3 px-3">Session</th>
                  <th class="pb-3 px-3 text-center">Requests</th>
                  <th class="pb-3 px-3">Joined</th>
                  <th class="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50 text-xs">
                <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50/70 transition-colors">
                  <!-- Name & Email -->
                  <td class="py-3 px-3">
                    <div class="flex items-center gap-3">
                      <img
                        v-if="user.avatar_path"
                        :src="getAvatarUrl(user.id)"
                        alt="Avatar"
                        class="w-8 h-8 rounded-xl object-cover border border-purple-200 shrink-0"
                      />
                      <div v-else class="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 font-bold flex items-center justify-center shrink-0 border border-purple-100 text-xs">
                        {{ user.first_name ? user.first_name.charAt(0).toUpperCase() : 'U' }}
                      </div>
                      <div class="flex flex-col min-w-0">
                        <span class="font-bold text-slate-900 truncate">{{ user.first_name }} {{ user.last_name }}</span>
                        <span class="text-[11px] text-slate-500 truncate">{{ user.role === 'worker' ? (user.username || user.email ? '@' + (user.username || user.email) : 'No username') : (user.email || 'No email provided') }}</span>
                      </div>
                    </div>
                  </td>

                  <!-- Role -->
                  <td class="py-3 px-3 whitespace-nowrap">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span class="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border" :class="getRoleBadgeClass(user.role)">
                        {{ formatRole(user.role) }}
                      </span>
                      <span v-if="user.specialty" class="text-[10px] font-bold text-slate-500">
                        ({{ user.specialty }})
                      </span>
                    </div>
                  </td>

                  <!-- Unit -->
                  <td class="py-3 px-3 whitespace-nowrap">
                    <span v-if="user.unit_code" class="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                      {{ user.unit_code }}
                    </span>
                    <span v-else class="text-xs text-slate-400">Global</span>
                  </td>

                  <!-- Verification Column -->
                  <td class="py-3 px-3 whitespace-nowrap">
                    <span 
                      v-if="user.status === 'Rejected'" 
                      class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200"
                    >
                      <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Rejected
                    </span>
                    <span 
                      v-else-if="isUserVerified(user)" 
                      class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200"
                    >
                      <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      Verified
                    </span>
                    <button
                      v-else-if="canViewId(user)"
                      @click="openInspectModal(user, 'documents')"
                      class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 transition-colors cursor-pointer"
                      title="Inspect ID & verify credentials"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      Pending ID
                    </button>
                    <span
                      v-else
                      class="text-slate-400 text-xs px-2"
                    >
                      —
                    </span>
                  </td>

                  <!-- Status -->
                  <td class="py-3 px-3 whitespace-nowrap">
                    <div class="flex items-center gap-1.5">
                      <span class="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border" :class="getStatusBadgeClass(user.status)">
                        {{ user.status || 'Active' }}
                      </span>
                      <span
                        v-if="user.is_inactive_candidate"
                        class="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300"
                        title="Inactive: No service requests or login activity recorded for 6+ months"
                      >
                        Inactive
                      </span>
                      <span
                        v-if="isUserLocked(user)"
                        class="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-0.5"
                        title="Account temporarily locked due to failed login attempts"
                      >
                        <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Locked
                      </span>
                    </div>
                  </td>

                  <!-- Live Session Tracking Column -->
                  <td class="py-3 px-3 whitespace-nowrap">
                    <!-- Active Now / Online -->
                    <span 
                      v-if="user.session_status === 'online'" 
                      class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200"
                      title="User is currently authenticated and active in the system"
                    >
                      <span class="relative flex h-2 w-2">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span>Active</span>
                    </span>

                    <!-- Idle -->
                    <span 
                      v-else-if="user.session_status === 'idle'" 
                      class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-amber-50 text-amber-700 border border-amber-200"
                      :title="`Session idle: ${user.session_label}`"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      <span>Idle</span>
                    </span>

                    <!-- Recent Session -->
                    <span 
                      v-else-if="user.session_status === 'recent'" 
                      class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-slate-100 text-slate-600 border border-slate-200"
                      :title="`Recent session: ${user.session_label}`"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      <span>Recent</span>
                    </span>

                    <!-- Offline -->
                    <span 
                      v-else 
                      class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-400 border border-slate-200/60"
                      :title="user.resolved_last_login_at ? `Last login: ${new Date(user.resolved_last_login_at).toLocaleString()}` : 'Never logged in'"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      <span>Offline</span>
                    </span>
                  </td>

                  <!-- Request Tracking Count -->
                  <td class="py-3 px-3 text-center">
                    <span 
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold transition-all"
                      :class="(user.request_count || 0) > 0 ? 'bg-purple-50 text-purple-700 border border-purple-200/60' : 'bg-slate-50 text-slate-400 border border-slate-200/40'"
                      :title="`${user.first_name || 'User'} has filed ${user.request_count || 0} service requests`"
                    >
                      {{ user.request_count || 0 }}
                    </span>
                  </td>

                  <!-- Joined Date -->
                  <td class="py-3 px-3 text-slate-500 whitespace-nowrap">
                    {{ user.created_at ? new Date(user.created_at).toLocaleDateString() : '—' }}
                  </td>

                  <!-- Action Buttons -->
                  <td class="py-3 px-3 text-right whitespace-nowrap">
                    <div class="flex items-center justify-end gap-1.5">
                      <!-- Unlock Button if Account is Locked -->
                      <button
                        v-if="isUserLocked(user) && !isCurrentUser(user)"
                        @click="openUnlockModal(user)"
                        class="px-2 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition-colors cursor-pointer border border-emerald-300 flex items-center gap-1 shadow-2xs"
                        title="Unlock User Account"
                      >
                        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                        <span>Unlock</span>
                      </button>

                      <!-- Full Info Button (changed from ID, available for all accounts) -->
                      <button
                        @click="openInspectModal(user, 'overview')"
                        class="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-purple-200/60 shadow-2xs"
                        title="View complete user profile, institutional credentials, and activity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>Full Info</span>
                      </button>

                      <!-- Edit Button (for non-student/employee editable accounts) -->
                      <button
                        v-if="!isRegisteredUser(user)"
                        @click="openEditModal(user)"
                        class="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer border border-slate-200"
                        title="Edit Administrative Privileges"
                      >
                        Edit
                      </button>

                      <!-- Quick Account Status Toggle (Active <-> Suspended / Reactivate Archived) -->
                      <template v-if="!isCurrentUser(user)">
                        <button
                          v-if="user.status === 'Active'"
                          @click="openStatusModal(user, 'Suspended')"
                          class="px-2 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors cursor-pointer border border-rose-200/60"
                          title="Suspend Account"
                        >
                          Suspend
                        </button>
                        <button
                          v-else-if="user.status === 'Suspended' || user.status === 'Archived'"
                          @click="openStatusModal(user, 'Active')"
                          class="px-2 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors cursor-pointer border border-emerald-200/60"
                          title="Reactivate Account"
                        >
                          Reactivate
                        </button>
                        <button
                          v-else
                          @click="openStatusModal(user, 'Suspended')"
                          class="px-2 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors cursor-pointer border border-rose-200/60"
                          title="Suspend Account"
                        >
                          Suspend
                        </button>

                        <!-- Strict Multistep Delete (Hidden by default, shown when option is enabled) -->
                        <button
                          v-if="showDeleteActions"
                          @click="openStrictDeleteModal(user)"
                          class="px-2 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors cursor-pointer border border-rose-200"
                          title="Strict Multistep Permanent Deletion"
                        >
                          Delete
                        </button>
                      </template>
                      <span v-else class="px-2 py-1 text-[11px] font-bold text-slate-400 italic">
                        Current User
                      </span>
                    </div>
                  </td>
                </tr>

                <tr v-if="users.length === 0">
                  <td colspan="9" class="py-12 text-center text-slate-400 font-bold">
                    No user accounts found matching your filters.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Cards View -->
          <div v-if="!isLoading && !fetchError" class="md:hidden space-y-3">
            <div v-for="user in users" :key="'mob-' + user.id" class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-2xs">
              <!-- Top Row: Role and Status Badges -->
              <div class="flex items-center justify-between gap-2 flex-wrap">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border" :class="getRoleBadgeClass(user.role)">
                    {{ formatRole(user.role) }}
                  </span>
                  <span v-if="user.specialty" class="text-[10px] font-bold text-slate-500">
                    ({{ user.specialty }})
                  </span>
                </div>
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span
                    v-if="user.session_status === 'online'"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Online</span>
                  </span>
                  <span
                    v-if="user.is_inactive_candidate"
                    class="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300"
                  >
                    Inactive
                  </span>
                  <span
                    v-if="isUserLocked(user)"
                    class="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-rose-100 text-rose-800 border border-rose-300"
                  >
                    Locked
                  </span>
                  <span class="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border" :class="getStatusBadgeClass(user.status)">
                    {{ user.status || 'Active' }}
                  </span>
                </div>
              </div>

              <!-- Middle: User Avatar & Info -->
              <div class="flex items-center gap-3">
                <img
                  v-if="user.avatar_path"
                  :src="getAvatarUrl(user.id)"
                  alt="Avatar"
                  class="w-10 h-10 rounded-xl object-cover border border-purple-200 shrink-0"
                />
                <div v-else class="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 font-bold flex items-center justify-center shrink-0 border border-purple-100 text-xs">
                  {{ user.first_name ? user.first_name.charAt(0).toUpperCase() : 'U' }}
                </div>
                <div class="min-w-0 flex-1">
                  <h4 class="text-sm font-bold text-slate-900 leading-snug truncate">{{ user.first_name }} {{ user.last_name }}</h4>
                  <p class="text-xs text-slate-500 truncate mt-0.5">{{ user.role === 'worker' ? (user.username || user.email ? '@' + (user.username || user.email) : 'No username') : (user.email || 'No email provided') }}</p>
                  <p class="text-[11px] text-slate-400 mt-0.5">
                    Unit: <span class="font-semibold text-slate-700">{{ user.unit_code || 'Global' }}</span> • {{ user.request_count || 0 }} reqs
                  </p>
                </div>
              </div>

              <!-- Mobile Actions Area -->
              <div class="pt-2 border-t border-slate-200/80 flex items-center gap-2 flex-wrap">
                <!-- Full Info Button -->
                <button
                  type="button"
                  @click="openInspectModal(user, 'overview')"
                  class="flex-1 py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px] touch-manipulation"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>Full Info</span>
                </button>

                <button
                  v-if="!isRegisteredUser(user)"
                  type="button"
                  @click="openEditModal(user)"
                  class="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors cursor-pointer min-h-[38px] touch-manipulation"
                >
                  Edit
                </button>

                <button
                  v-if="isUserLocked(user) && !isCurrentUser(user)"
                  type="button"
                  @click="openUnlockModal(user)"
                  class="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer min-h-[38px] touch-manipulation"
                >
                  Unlock
                </button>

                <template v-if="!isCurrentUser(user)">
                  <button
                    v-if="user.status === 'Active'"
                    type="button"
                    @click="openStatusModal(user, 'Suspended')"
                    class="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors min-h-[38px] touch-manipulation cursor-pointer"
                  >
                    Suspend
                  </button>
                  <button
                    v-else-if="user.status === 'Suspended' || user.status === 'Archived'"
                    type="button"
                    @click="openStatusModal(user, 'Active')"
                    class="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors min-h-[38px] touch-manipulation cursor-pointer"
                  >
                    Reactivate
                  </button>

                  <button
                    v-if="showDeleteActions"
                    type="button"
                    @click="openStrictDeleteModal(user)"
                    class="py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-colors ml-auto min-h-[38px] touch-manipulation cursor-pointer"
                  >
                    Delete
                  </button>
                </template>
                <span v-else class="text-[11px] font-bold text-slate-400 italic ml-auto py-2">
                  Current User
                </span>
              </div>
            </div>

            <div v-if="users.length === 0" class="py-8 text-center text-slate-400 font-bold text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              No user accounts found matching your filters.
            </div>
          </div>

          <!-- Full Pagination Controls -->
          <div class="px-5 py-4 bg-slate-50/70 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 mt-4 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 rounded-b-3xl">
            <div class="flex flex-wrap items-center gap-3">
              <span class="text-xs text-slate-500 font-medium">
                Showing <strong class="text-slate-800">{{ paginationRange.start }}</strong> to
                <strong class="text-slate-800">{{ paginationRange.end }}</strong> of
                <strong class="text-slate-800">{{ pagination.total }}</strong> accounts
              </span>
              <div class="flex items-center gap-1.5 text-xs text-slate-500">
                <span class="font-medium">Per page:</span>
                <select
                  v-model.number="pagination.per_page"
                  @change="handlePerPageChange"
                  class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none focus:border-purple-500 cursor-pointer shadow-xs"
                >
                  <option :value="10">10</option>
                  <option :value="15">15</option>
                  <option :value="25">25</option>
                  <option :value="50">50</option>
                  <option :value="100">100</option>
                </select>
              </div>
            </div>

            <!-- Page Navigation Buttons -->
            <div class="flex items-center gap-1 flex-wrap justify-center">
              <button
                @click="changePage(1)"
                :disabled="pagination.page <= 1 || isLoading"
                class="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-bold cursor-pointer"
                title="First page"
              >
                «
              </button>
              <button
                @click="changePage(pagination.page - 1)"
                :disabled="pagination.page <= 1 || isLoading"
                class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                ‹ Prev
              </button>

              <template v-for="(p, idx) in displayedPages" :key="'page-' + idx">
                <span v-if="p === '...'" class="px-2 text-slate-400 font-bold text-xs">...</span>
                <button
                  v-else
                  @click="changePage(p)"
                  :disabled="isLoading"
                  :class="[
                    'w-8 h-8 rounded-xl text-xs font-black transition-all cursor-pointer',
                    pagination.page === p
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                  ]"
                >
                  {{ p }}
                </button>
              </template>

              <button
                @click="changePage(pagination.page + 1)"
                :disabled="pagination.page >= pagination.total_pages || isLoading"
                class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                Next ›
              </button>
              <button
                @click="changePage(pagination.total_pages)"
                :disabled="pagination.page >= pagination.total_pages || isLoading"
                class="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-bold cursor-pointer"
                title="Last page"
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #modal-overlay>
      <Teleport to="body">
        <!-- Provision User Modal -->
        <div 
          v-if="isCreateModalOpen" 
          class="fixed inset-0 z-[150] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto overflow-y-auto"
          @click.self="isCreateModalOpen = false"
        >
        <div 
          class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-200 animate-scale-up max-h-[calc(100dvh-2rem)] sm:max-h-[88vh] overflow-y-auto custom-scrollbar pointer-events-auto my-auto"
          @click.stop
        >
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 class="text-lg font-black text-slate-900 tracking-tight">Provision New Account</h3>
              <p class="text-xs text-slate-500 font-medium">Provision an internal GSO account — admins and staff only. Students and employees sign up on their own.</p>
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
                <input 
                  v-model="createForm.first_name" 
                  type="text" 
                  maxlength="50"
                  required 
                  @input="createForm.first_name = createForm.first_name.replace(/[^a-zA-ZÀ-ÿ\s\-'.]/g, '')"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors" 
                  placeholder="e.g. John" 
                />
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Last Name *</label>
                <input 
                  v-model="createForm.last_name" 
                  type="text" 
                  maxlength="50"
                  required 
                  @input="createForm.last_name = createForm.last_name.replace(/[^a-zA-ZÀ-ÿ\s\-'.]/g, '')"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors" 
                  placeholder="e.g. Doe" 
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">System Role *</label>
                <select v-model="createForm.role" required class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors cursor-pointer">
                  <option value="admin">Admin (Unit Governance)</option>
                  <option value="staff">Staff (Sub-Unit Personnel)</option>
                  <option value="worker">Personnel (Field Worker)</option>
                  <option value="director">Director (Executive)</option>
                  <option value="superadmin">Superadmin (Master)</option>
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Assigned Sub-Unit *</label>
                <select v-model="createForm.unit_id" required class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors cursor-pointer" :disabled="['superadmin', 'director'].includes(createForm.role)">
                  <option v-if="!['admin', 'staff', 'worker'].includes(createForm.role)" :value="null">None (Global / Cross-Campus)</option>
                  <option :value="1">Facilities & Grounds (FGMU)</option>
                  <option :value="2">Landscaping & Aesthetics (LEAU)</option>
                  <option :value="3">Security Services (SSU)</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                {{ createForm.role === 'worker' ? 'Username *' : 'Email Address *' }}
              </label>
              <input 
                v-model="createForm.email" 
                :type="createForm.role === 'worker' ? 'text' : 'email'" 
                required 
                :placeholder="createForm.role === 'worker' ? 'e.g. juandelacruz' : 'name@bsu.edu.ph'"
                :autocomplete="createForm.role === 'worker' ? 'username' : 'email'"
                @input="createForm.role === 'worker' ? (createForm.email = createForm.email.toLowerCase().replace(/[^a-zA-Z0-9._-]/g, '')) : null"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors" 
              />
              <p v-if="createForm.role === 'worker'" class="text-[10px] text-slate-400 font-medium mt-1">
                Field personnel authenticate using their assigned username.
              </p>
            </div>

            <div v-if="createForm.role === 'worker'">
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Trade / Specialty *</label>
              <select 
                v-model="createForm.specialty" 
                required 
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white transition-colors cursor-pointer"
              >
                <option value="" disabled>Select Pre-Defined Specialty</option>
                <option 
                  v-for="spec in getSpecialtiesForUnit(createForm.unit_id)" 
                  :key="spec" 
                  :value="spec"
                >
                  {{ spec }}
                </option>
              </select>
              <p class="text-[10px] text-slate-400 font-medium mt-1">
                Pre-defined specialty categories for {{ getUnitName(createForm.unit_id) }}.
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Temporary Password *</label>
                <div class="relative">
                  <input
                    v-model="createForm.password"
                    :type="showCreatePassword ? 'text' : 'password'"
                    required
                    minlength="8"
                    class="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
                    placeholder="Minimum 8 chars"
                    autocomplete="new-password"
                  />
                  <button
                    type="button"
                    @click="showCreatePassword = !showCreatePassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-purple-600 transition-colors cursor-pointer"
                    aria-label="Toggle temporary password visibility"
                  >
                    <svg v-if="!showCreatePassword" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 013.111-5.184M9.9 4.314A10.198 10.198 0 0112 4c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l3.59 3.59m0 0A9.956 9.956 0 016.59 2.59M9 13a3 3 0 013-3m0 3a1.5 1.5 0 011.5 1.5" />
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Confirm Password *</label>
                <div class="relative">
                  <input
                    v-model="createForm.confirm_password"
                    :type="showCreateConfirmPassword ? 'text' : 'password'"
                    required
                    minlength="8"
                    class="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
                    placeholder="Re-type password"
                    autocomplete="new-password"
                  />
                  <button
                    type="button"
                    @click="showCreateConfirmPassword = !showCreateConfirmPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-purple-600 transition-colors cursor-pointer"
                    aria-label="Toggle confirm password visibility"
                  >
                    <svg v-if="!showCreateConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 013.111-5.184M9.9 4.314A10.198 10.198 0 0112 4c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l3.59 3.59m0 0A9.956 9.956 0 016.59 2.59M9 13a3 3 0 013-3m0 3a1.5 1.5 0 011.5 1.5" />
                    </svg>
                  </button>
                </div>
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
        class="fixed inset-0 z-[150] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto overflow-y-auto"
        @click.self="isEditModalOpen = false"
      >
        <div 
          class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-200 animate-scale-up max-h-[calc(100dvh-2rem)] sm:max-h-[88vh] overflow-y-auto custom-scrollbar pointer-events-auto my-auto"
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
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="worker">Personnel (Field Worker)</option>
                  <option value="director">Director</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Sub-Unit *</label>
                <select v-model="editForm.unit_id" required class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors cursor-pointer" :disabled="['student', 'employee', 'superadmin', 'director'].includes(editForm.role)">
                  <option v-if="!['admin', 'staff', 'worker'].includes(editForm.role)" :value="null">None (Global / Cross-Campus)</option>
                  <option :value="1">Facilities & Grounds (FGMU)</option>
                  <option :value="2">Landscaping & Aesthetics (LEAU)</option>
                  <option :value="3">Security Services (SSU)</option>
                </select>
              </div>
            </div>

            <div v-if="editForm.role === 'worker'">
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Username</label>
              <input 
                v-model="editForm.email" 
                type="text" 
                placeholder="e.g. juandelacruz" 
                @input="editForm.email = editForm.email.toLowerCase().replace(/[^a-zA-Z0-9._-]/g, '')"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors" 
              />
              <p class="text-[10px] text-slate-400 font-medium mt-1">Field personnel authenticate using their assigned username.</p>
            </div>

            <div v-if="editForm.role === 'worker'">
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Trade / Specialty *</label>
              <select 
                v-model="editForm.specialty" 
                required 
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white transition-colors cursor-pointer"
              >
                <option value="" disabled>Select Pre-Defined Specialty</option>
                <option 
                  v-for="spec in getSpecialtiesForUnit(editForm.unit_id)" 
                  :key="spec" 
                  :value="spec"
                >
                  {{ spec }}
                </option>
                <option 
                  v-if="editForm.specialty && !getSpecialtiesForUnit(editForm.unit_id).includes(editForm.specialty)" 
                  :value="editForm.specialty"
                >
                  {{ editForm.specialty }} (Current)
                </option>
              </select>
              <p class="text-[10px] text-slate-400 font-medium mt-1">
                Pre-defined specialty categories for {{ getUnitName(editForm.unit_id) }}.
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Reset Password</label>
                <div class="relative">
                  <input
                    v-model="editForm.password"
                    :type="showEditPassword ? 'text' : 'password'"
                    minlength="8"
                    class="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
                    placeholder="Leave empty to keep"
                    autocomplete="new-password"
                  />
                  <button
                    type="button"
                    @click="showEditPassword = !showEditPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-purple-600 transition-colors cursor-pointer"
                    aria-label="Toggle reset password visibility"
                  >
                    <svg v-if="!showEditPassword" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 013.111-5.184M9.9 4.314A10.198 10.198 0 0112 4c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l3.59 3.59m0 0A9.956 9.956 0 016.59 2.59M9 13a3 3 0 013-3m0 3a1.5 1.5 0 011.5 1.5" />
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Confirm Reset Password</label>
                <div class="relative">
                  <input
                    v-model="editForm.confirm_password"
                    :type="showEditConfirmPassword ? 'text' : 'password'"
                    minlength="8"
                    class="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
                    :disabled="!editForm.password"
                    placeholder="Confirm new password"
                    autocomplete="new-password"
                  />
                  <button
                    v-if="editForm.password"
                    type="button"
                    @click="showEditConfirmPassword = !showEditConfirmPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-purple-600 transition-colors cursor-pointer"
                    aria-label="Toggle confirm reset password visibility"
                  >
                    <svg v-if="!showEditConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 013.111-5.184M9.9 4.314A10.198 10.198 0 0112 4c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l3.59 3.59m0 0A9.956 9.956 0 016.59 2.59M9 13a3 3 0 013-3m0 3a1.5 1.5 0 011.5 1.5" />
                    </svg>
                  </button>
                </div>
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

      <!-- User Profile & Full Info Modal -->
      <div 
        v-if="isInspectModalOpen && inspectingUser" 
        class="fixed inset-0 z-[160] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto overflow-y-auto"
        @click.self="isInspectModalOpen = false"
      >
        <div 
          class="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-4 border border-slate-200 animate-scale-up max-h-[calc(100dvh-2rem)] sm:max-h-[90vh] overflow-y-auto custom-scrollbar pointer-events-auto my-auto"
          @click.stop
        >
          <!-- Modal Header: User Identity & Close -->
          <div class="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
            <div class="flex items-center gap-3 min-w-0">
              <div class="relative shrink-0">
                <img
                  v-if="inspectingUser.avatar_path"
                  :src="getAvatarUrl(inspectingUser.id)"
                  alt="Avatar"
                  class="w-12 h-12 rounded-2xl object-cover border border-purple-200 shadow-2xs"
                />
                <div v-else class="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 font-extrabold flex items-center justify-center border border-purple-100 text-lg shadow-2xs">
                  {{ inspectingUser.first_name ? inspectingUser.first_name.charAt(0).toUpperCase() : 'U' }}
                </div>
                <span 
                  class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white"
                  :class="inspectingUser.session_status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'"
                  :title="inspectingUser.session_status === 'online' ? 'Online' : 'Offline'"
                ></span>
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
                    {{ [inspectingUser.first_name, inspectingUser.middle_name, inspectingUser.last_name, inspectingUser.name_extension].filter(Boolean).join(' ') || (inspectingUser.first_name + ' ' + inspectingUser.last_name) }}
                  </h3>
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border" :class="getRoleBadgeClass(inspectingUser.role)">
                    {{ formatRole(inspectingUser.role) }}
                  </span>
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border" :class="getStatusBadgeClass(inspectingUser.status)">
                    {{ inspectingUser.status || 'Active' }}
                  </span>
                  <span 
                    v-if="isUserLocked(inspectingUser)"
                    class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300"
                  >
                    Locked
                  </span>
                </div>
                <p class="text-xs text-slate-500 truncate mt-0.5 font-medium">
                  {{ inspectingUser.email || (inspectingUser.username ? '@' + inspectingUser.username : 'No email provided') }}
                </p>
              </div>
            </div>
            <button 
              type="button"
              @click="isInspectModalOpen = false" 
              class="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              title="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Segmented Navigation Tabs (if account has institutional ID documents) -->
          <div v-if="canViewId(inspectingUser)" class="flex items-center gap-2 border-b border-slate-100 pb-3">
            <button
              type="button"
              @click="activeInspectMainTab = 'overview'"
              class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              :class="activeInspectMainTab === 'overview' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profile & Account</span>
            </button>

            <button
              type="button"
              @click="activeInspectMainTab = 'documents'"
              class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer relative"
              :class="activeInspectMainTab === 'documents' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>ID Documents</span>
              <span 
                v-if="!isUserVerified(inspectingUser) && inspectingUser.status !== 'Rejected'"
                class="px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider"
                :class="activeInspectMainTab === 'documents' ? 'bg-amber-300 text-amber-950' : 'bg-amber-100 text-amber-800'"
              >
                Pending
              </span>
            </button>
          </div>

          <!-- TAB 1: Profile & Account Overview -->
          <div v-if="activeInspectMainTab === 'overview'" class="space-y-3.5">
            <!-- Account Locked Banner (with direct unlock action) -->
            <div v-if="isUserLocked(inspectingUser)" class="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3 text-xs">
              <div class="flex items-center gap-2.5 text-rose-800">
                <span class="text-base">🔒</span>
                <div>
                  <p class="font-bold">Account Temporarily Locked</p>
                  <p class="text-[11px] text-rose-600">Locked due to 5 consecutive failed login attempts.</p>
                </div>
              </div>
              <button
                type="button"
                @click="openUnlockModal(inspectingUser)"
                class="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
              >
                Unlock Now
              </button>
            </div>

            <!-- Pending Verification Alert Banner (prompting to review documents) -->
            <div 
              v-if="canViewId(inspectingUser) && !isUserVerified(inspectingUser) && inspectingUser.status !== 'Rejected'" 
              class="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-xs"
            >
              <div class="flex items-center gap-2 text-amber-800 min-w-0">
                <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
                <span class="font-bold">Verification Pending:</span>
                <span class="text-amber-700 truncate">Identity credentials await approval.</span>
              </div>
              <button
                type="button"
                @click="activeInspectMainTab = 'documents'"
                class="text-xs font-bold text-amber-900 underline hover:no-underline shrink-0 cursor-pointer"
              >
                Review Documents →
              </button>
            </div>

            <!-- Card 1: Institutional & Academic Identity -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5 text-slate-800 font-bold text-xs uppercase tracking-wider">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>Institutional Affiliation</span>
                </div>
                <span v-if="!canViewId(inspectingUser)" class="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                  Provisioned Account
                </span>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ID / Student No.</span>
                  <span class="font-bold font-mono text-emerald-700 mt-0.5 block truncate">
                    {{ inspectingUser.student_id_number || 'N/A' }}
                  </span>
                </div>
                <div>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Classification</span>
                  <span class="font-bold text-slate-800 mt-0.5 block truncate">
                    {{ getStudentTypeLabel(inspectingUser.student_type) || inspectingUser.employee_type || 'General Account' }}
                  </span>
                </div>
                <div>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">College / Department</span>
                  <span class="font-bold text-slate-800 mt-0.5 block truncate" :title="inspectingUser.college || inspectingUser.department || inspectingUser.organization_name">
                    {{ inspectingUser.college || inspectingUser.department || inspectingUser.organization_name || 'N/A' }}
                  </span>
                </div>
                <div>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Unit</span>
                  <span class="font-bold text-slate-800 mt-0.5 block truncate">
                    {{ inspectingUser.unit_name || inspectingUser.unit_code || 'Global (Campus-Wide)' }}
                  </span>
                </div>
                <div v-if="inspectingUser.specialty">
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Trade / Specialty</span>
                  <span class="font-bold text-amber-700 mt-0.5 block truncate">
                    {{ inspectingUser.specialty }}
                  </span>
                </div>
                <div>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Verification</span>
                  <span 
                    class="font-bold mt-0.5 block" 
                    :class="inspectingUser.status === 'Rejected' ? 'text-rose-600' : (isUserVerified(inspectingUser) ? 'text-emerald-700' : 'text-amber-600')"
                  >
                    {{ inspectingUser.status === 'Rejected' ? 'Rejected' : (isUserVerified(inspectingUser) ? 'Verified' : 'Pending ID') }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Card 2: Contact, Activity & Account Health -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div class="flex items-center gap-1.5 text-slate-800 font-bold text-xs uppercase tracking-wider">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Contact & Account Health</span>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div class="col-span-2 sm:col-span-1">
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                  <a 
                    v-if="inspectingUser.email"
                    :href="`mailto:${inspectingUser.email}`"
                    class="font-medium text-purple-700 hover:text-purple-900 hover:underline mt-0.5 block truncate"
                    :title="inspectingUser.email"
                  >
                    {{ inspectingUser.email }}
                  </a>
                  <span v-else class="text-slate-400 mt-0.5 block">None</span>
                </div>
                <div>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contact Phone</span>
                  <a
                    v-if="inspectingUser.contact_number && inspectingUser.contact_number !== 'N/A'"
                    :href="`tel:${inspectingUser.contact_number}`"
                    class="inline-flex items-center gap-1 mt-0.5 font-bold font-mono text-emerald-700 hover:text-emerald-800 hover:underline"
                  >
                    <span>📞</span>
                    <span>{{ inspectingUser.contact_number }}</span>
                  </a>
                  <span v-else class="text-slate-400 mt-0.5 block">N/A</span>
                </div>
                <div>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Service Requests</span>
                  <span class="font-bold text-indigo-700 mt-0.5 block">
                    {{ inspectingUser.request_count || 0 }} filed
                  </span>
                </div>
                <div>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Member Since</span>
                  <span class="font-medium text-slate-700 mt-0.5 block">
                    {{ inspectingUser.created_at ? new Date(inspectingUser.created_at).toLocaleDateString() : '—' }}
                  </span>
                </div>
                <div class="col-span-2">
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Session Activity</span>
                  <span class="font-medium text-slate-700 mt-0.5 block">
                    {{ inspectingUser.session_status === 'online' ? 'Active Now (Online)' : (inspectingUser.resolved_last_login_at ? formatRelativeDate(inspectingUser.resolved_last_login_at) : 'Never logged in') }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Card 3 (for provisioned accounts): System Status Notice -->
            <div v-if="!canViewId(inspectingUser)" class="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/80 flex items-center gap-3 text-xs text-purple-950">
              <div class="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p class="text-[11px] text-purple-900/90 leading-relaxed">
                Directly provisioned internal account. Institutional ID verification is exempt.
              </p>
            </div>
          </div>

          <!-- TAB 2: Identity Documents & Verification Inspection -->
          <div v-else-if="activeInspectMainTab === 'documents' && canViewId(inspectingUser)" class="space-y-3.5">
            <!-- Document Switcher Bar -->
            <div class="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div class="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200">
                <button
                  type="button"
                  @click="activeInspectDocTab = 'front'"
                  class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  :class="activeInspectDocTab === 'front' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                >
                  <span>1. Front ID Card</span>
                </button>
                <button
                  type="button"
                  @click="activeInspectDocTab = 'selfie'"
                  class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  :class="activeInspectDocTab === 'selfie' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                >
                  <span>2. Selfie with ID</span>
                </button>
              </div>

              <a 
                :href="getIdCardUrl(inspectingUser.id, activeInspectDocTab)" 
                target="_blank" 
                class="text-xs font-bold text-purple-700 hover:text-purple-900 hover:underline inline-flex items-center gap-1 px-2 py-1"
              >
                <span>Open Full Resolution</span>
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <!-- Document Image Box -->
            <div class="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden flex items-center justify-center p-2 min-h-[200px] max-h-[300px]">
              <img 
                :key="inspectingUser.id + '-' + activeInspectDocTab"
                :src="getIdCardUrl(inspectingUser.id, activeInspectDocTab)" 
                :alt="activeInspectDocTab === 'selfie' ? 'Selfie Holding ID' : 'Institutional ID Card'" 
                class="max-h-[285px] w-full object-contain rounded-xl"
                @error="$event.target.style.display='none'; $event.target.nextElementSibling.style.display='block'"
              />
              <div style="display:none" class="text-slate-400 text-xs text-center py-8">
                <svg class="h-8 w-8 text-slate-500 mx-auto mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Document image not found or failed to load.
              </div>
            </div>

            <!-- Checklist & Details Match Banner -->
            <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div class="flex items-center gap-2 text-slate-700 flex-wrap">
                <span class="font-bold text-slate-900">Registered ID:</span>
                <span class="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {{ inspectingUser.student_id_number || 'N/A' }}
                </span>
                <span class="text-slate-400">•</span>
                <span class="font-bold text-slate-900">Name:</span>
                <span class="text-slate-700">{{ inspectingUser.first_name }} {{ inspectingUser.last_name }}</span>
              </div>
              <span class="text-[11px] text-slate-500 italic">
                Confirm ID photo and name match before approval.
              </span>
            </div>
          </div>

          <!-- Modal Footer: Contextual Actions & Verification Controls -->
          <div class="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <!-- Left Side: Contextual Edit Button -->
            <div class="w-full sm:w-auto flex items-center gap-2">
              <button
                v-if="!isRegisteredUser(inspectingUser)"
                type="button"
                @click="isInspectModalOpen = false; openEditModal(inspectingUser)"
                class="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-colors cursor-pointer"
              >
                Edit Account
              </button>
            </div>

            <!-- Right Side: Close and Verification Actions -->
            <div class="w-full sm:w-auto flex items-center justify-end gap-2.5">
              <button 
                type="button"
                @click="isInspectModalOpen = false" 
                class="w-full sm:w-auto px-5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>

              <!-- Quick Link from Overview to ID Documents (if unverified) -->
              <button
                v-if="canViewId(inspectingUser) && activeInspectMainTab === 'overview' && !isUserVerified(inspectingUser) && inspectingUser.status !== 'Rejected'"
                type="button"
                @click="activeInspectMainTab = 'documents'"
                class="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Review ID Documents ›</span>
              </button>

              <!-- Verification Approval / Rejection Controls (when viewing documents) -->
              <template v-if="canViewId(inspectingUser) && activeInspectMainTab === 'documents'">
                <button 
                  type="button"
                  :disabled="isActionLoading || inspectingUser.status === 'Rejected'"
                  @click="openRejectModal(inspectingUser)" 
                  class="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{{ inspectingUser.status === 'Rejected' ? 'Already Rejected' : 'Reject Sign-Up' }}</span>
                </button>
                <button 
                  type="button"
                  :disabled="isActionLoading || isUserVerified(inspectingUser)"
                  @click="openApproveModal(inspectingUser)" 
                  class="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <svg v-if="!isActionLoading" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{{ isUserVerified(inspectingUser) ? 'Verified' : 'Approve & Verify' }}</span>
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Custom Confirmation Modal for Approve, Reject, and Status Transitions -->
      <ConfirmModal
        :is-open="confirmModal.isOpen"
        :title="confirmModal.title"
        :message="confirmModal.message"
        :confirm-text="confirmModal.confirmText"
        :cancel-text="confirmModal.cancelText"
        :type="confirmModal.type"
        :is-loading="confirmModal.isLoading"
        @confirm="handleConfirmAction"
        @cancel="closeConfirmModal"
      >
        <div v-if="confirmModal.actionType === 'reject'" class="space-y-1.5 mt-2">
          <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Rejection Reason (Optional)
          </label>
          <textarea
            v-model="confirmModal.reason"
            rows="2"
            placeholder="Specify reason why identity verification was rejected..."
            class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
          ></textarea>
        </div>
      </ConfirmModal>

      <!-- Strict Multistep Account Deletion Modal -->
      <StrictDeleteModal
        :is-open="strictDeleteModal.isOpen"
        :user="strictDeleteModal.user"
        :is-loading="strictDeleteModal.isLoading"
        :error-message="strictDeleteModal.errorMessage"
        @close="closeStrictDeleteModal"
        @suspend-instead="handleSuspendFromDeleteModal"
        @deactivate-instead="handleSuspendFromDeleteModal"
        @confirm-delete="handleStrictDeleteConfirm"
      />

      <!-- Archive Inactive Users Modal -->
      <div
        v-if="isArchiveModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
        @click.self="closeArchiveInactiveModal"
      >
        <div class="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
          <!-- Modal Header -->
          <div class="px-6 py-5 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 flex items-start justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div>
                <h3 class="text-base font-black text-slate-900 tracking-tight">Archive Inactive Users</h3>
                <p class="text-xs text-slate-500 font-medium mt-0.5">Accounts with no logins or service ticket requests for 6+ months</p>
              </div>
            </div>
            <button
              type="button"
              @click="closeArchiveInactiveModal"
              :disabled="isArchivingLoading"
              class="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white/80 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 space-y-4">
            <!-- Informational Policy Banner -->
            <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1.5">
              <div class="flex items-center gap-2 font-bold text-amber-950">
                <svg class="w-4 h-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Inactivity Archive Policy (180+ Days)</span>
              </div>
              <p class="leading-relaxed text-slate-700">
                Users who have not requested a service ticket or logged in for 6 months will have their active sessions revoked and portal access disabled. All historical tickets, work logs, and accountability records remain permanently intact. Accounts can be reactivated at any time.
              </p>
            </div>

            <!-- Scanning / Loading State -->
            <div v-if="isFetchingCandidates" class="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
              <svg class="animate-spin h-7 w-7 text-amber-500" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-xs font-bold text-slate-500">Scanning for accounts inactive for 6+ months...</span>
            </div>

            <!-- Empty State -->
            <div v-else-if="inactiveCandidates.length === 0" class="py-10 text-center space-y-2">
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 class="text-sm font-bold text-slate-900">All Accounts Are Active</h4>
              <p class="text-xs text-slate-500 max-w-sm mx-auto">
                No user accounts meet the 6-month inactivity criteria. All non-archived users have active logins or recent ticket submissions.
              </p>
            </div>

            <!-- Candidate Accounts List -->
            <div v-else class="space-y-3">
              <div class="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Accounts to be Archived ({{ inactiveCandidates.length }})</span>
                <span class="text-[11px] text-amber-800 font-bold bg-amber-100/70 px-2 py-0.5 rounded-md border border-amber-200">
                  6+ Months Inactive
                </span>
              </div>

              <div class="max-h-60 overflow-y-auto custom-scrollbar border border-slate-200 rounded-2xl divide-y divide-slate-100 bg-slate-50/50">
                <div
                  v-for="cand in inactiveCandidates"
                  :key="cand.id"
                  class="p-3 flex items-center justify-between gap-3 hover:bg-white transition-colors"
                >
                  <div class="flex items-center gap-2.5 min-w-0">
                    <div class="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs shrink-0 border border-amber-200">
                      {{ cand.first_name ? cand.first_name.charAt(0).toUpperCase() : 'U' }}
                    </div>
                    <div class="min-w-0">
                      <div class="flex items-center gap-1.5">
                        <span class="text-xs font-bold text-slate-900 truncate">{{ cand.first_name }} {{ cand.last_name }}</span>
                        <span class="text-[9px] font-black uppercase px-1.5 py-0.2 rounded border bg-slate-100 text-slate-600">
                          {{ cand.role }}
                        </span>
                      </div>
                      <div class="text-[11px] text-slate-500 truncate">{{ cand.email || 'No email' }}</div>
                    </div>
                  </div>
                  <div class="text-right shrink-0">
                    <span class="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200 whitespace-nowrap">
                      ~{{ cand.inactive_months }} mo inactive
                    </span>
                    <div class="text-[9px] text-slate-400 mt-0.5">
                      {{ cand.resolved_last_login_at ? 'Last login: ' + new Date(cand.resolved_last_login_at).toLocaleDateString() : 'Never logged in' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              @click="closeArchiveInactiveModal"
              :disabled="isArchivingLoading"
              class="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              v-if="inactiveCandidates.length > 0"
              @click="handleArchiveInactiveConfirm"
              :disabled="isArchivingLoading"
              class="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <svg v-if="isArchivingLoading" class="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isArchivingLoading ? 'Archiving Accounts...' : `Archive ${inactiveCandidates.length} Inactive User(s)` }}</span>
            </button>
          </div>
        </div>
      </div>
      </Teleport>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';
import StrictDeleteModal from '@/components/StrictDeleteModal.vue';
import { useAuthStore } from '@/stores/auth';
import {
  fetchUsers as apiFetchUsers,
  createUser as apiCreateUser,
  updateUser as apiUpdateUser,
  deleteUser as apiDeleteUser,
  verifyUser as apiVerifyUser,
  rejectVerification as apiRejectVerification,
  updateUserStatus as apiUpdateUserStatus,
  unlockUser as apiUnlockUser,
  archiveInactiveUsers as apiArchiveInactiveUsers,
  fetchInactiveSummary as apiFetchInactiveSummary,
  fetchPersonnelCategories as apiFetchPersonnelCategories
} from '@/api/superadmin';

const authStore = useAuthStore();
const isCurrentUser = (u) => Boolean(u && authStore.user?.id && authStore.user.id === u.id);
const isRegisteredUser = (u) => Boolean(u && ['student', 'employee'].includes(u.role));
const isInternalRole = (role) => ['admin', 'staff', 'director', 'superadmin', 'worker', 'personnel'].includes(role);
const isGlobalRole = (role) => ['student', 'employee', 'superadmin', 'director'].includes(role);
const canViewId = (u) => {
  if (!u) return false;
  // Administrator accounts and newly provisioned accounts (internal roles) do not have institutional ID cards
  if (isInternalRole(u.role)) return false;
  // Only registered user accounts (student, employee) undergo institutional ID verification
  return isRegisteredUser(u);
};

const extractErrorMessage = (err, fallback) => {
  const errorData = err?.response?.data;
  if (errorData?.errors && typeof errorData.errors === 'object' && Object.keys(errorData.errors).length > 0) {
    return Object.values(errorData.errors).join(' ');
  }
  return errorData?.message || fallback;
};

const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1').replace(/\/+$/, '');

const activeInspectDocTab = ref('front'); // 'front' | 'selfie'
const activeInspectMainTab = ref('overview'); // 'overview' | 'documents'

const getIdCardUrl = (userId, type = 'front') => {
  if (!userId) return '';
  return `${apiBase}/auth/id-card/${userId}${type === 'selfie' ? '?type=selfie' : ''}`;
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

// Option to show/hide permanent delete action buttons (hidden by default for safety)
const showDeleteActions = ref(false);

// Inactive user management states (6+ months threshold)
const inactiveCount = ref(0);
const inactiveCandidates = ref([]);
const isArchiveModalOpen = ref(false);
const isFetchingCandidates = ref(false);
const isArchivingLoading = ref(false);

const formatRelativeDate = (dateStr) => {
  if (!dateStr) return 'Never';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Never';
  const now = new Date();
  const diffSec = Math.floor((now - d) / 1000);
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  const days = Math.floor(diffSec / 86400);
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
};

const openArchiveInactiveModal = async () => {
  isArchiveModalOpen.value = true;
  isFetchingCandidates.value = true;
  try {
    const res = await apiFetchInactiveSummary();
    const payload = res.data?.data || res.data || {};
    inactiveCandidates.value = payload.candidates || [];
    inactiveCount.value = Number(payload.count ?? inactiveCandidates.value.length);
  } catch (err) {
    toast.error('Failed to load inactive user account candidates.');
  } finally {
    isFetchingCandidates.value = false;
  }
};

const closeArchiveInactiveModal = () => {
  if (isArchivingLoading.value) return;
  isArchiveModalOpen.value = false;
};

const handleArchiveInactiveConfirm = async () => {
  if (isArchivingLoading.value) return;
  isArchivingLoading.value = true;
  try {
    const res = await apiArchiveInactiveUsers();
    toast.success(res.data?.message || 'Inactive user accounts have been successfully archived.');
    isArchiveModalOpen.value = false;
    await fetchUsers();
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to archive inactive users.');
  } finally {
    isArchivingLoading.value = false;
  }
};

const isUserVerified = (u) => {
  if (!u) return false;
  return Number(u.is_verified) === 1;
};

const isUserLocked = (u) => {
  if (!u) return false;
  if (u.is_locked) return true;
  if (u.lockout_until) {
    return new Date(u.lockout_until) > new Date();
  }
  return false;
};

const openUnlockModal = (user) => {
  if (!user) return;
  confirmModal.targetUser = user;
  confirmModal.actionType = 'unlock';
  confirmModal.isLoading = false;

  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'User';
  confirmModal.title = 'Unlock User Account';
  confirmModal.message = `Are you sure you want to unlock ${fullName} (${user.email || user.student_id_number})?\n\n• The 15-minute security lockout will be removed immediately.\n• Failed login attempts counter will be reset to 0.\n• The user will be able to log in with their correct password immediately.`;
  confirmModal.confirmText = 'Unlock Account';
  confirmModal.cancelText = 'Cancel';
  confirmModal.type = 'success';
  confirmModal.isOpen = true;
};

const openInspectModal = (user, initialTab = 'overview') => {
  if (!user) return;
  inspectingUser.value = user;
  activeInspectDocTab.value = 'front';
  activeInspectMainTab.value = (initialTab === 'documents' && canViewId(user)) ? 'documents' : 'overview';
  isInspectModalOpen.value = true;
};

// Confirmation modal state for Approve, Reject, and direct Status transitions
const confirmModal = reactive({
  isOpen: false,
  title: '',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  type: 'danger',
  isLoading: false,
  actionType: '', // 'approve', 'reject', 'status_change'
  targetUser: null,
  newStatus: '',
  reason: 'Identity document could not be verified.'
});

const openApproveModal = (user) => {
  if (!user) return;
  confirmModal.title = 'Approve User Sign-Up';
  confirmModal.message = `Are you sure you want to approve and verify identity for ${user.first_name} ${user.last_name} (${user.email || user.student_id_number})?\nThis will grant them active requester privileges.`;
  confirmModal.confirmText = 'Approve & Verify';
  confirmModal.cancelText = 'Cancel';
  confirmModal.type = 'success';
  confirmModal.isLoading = false;
  confirmModal.actionType = 'approve';
  confirmModal.targetUser = user;
  confirmModal.isOpen = true;
};

const openRejectModal = (user) => {
  if (!user) return;
  confirmModal.title = 'Reject User Sign-Up';
  confirmModal.message = `Are you sure you want to reject identity verification for ${user.first_name} ${user.last_name} (${user.email || user.student_id_number})?\nThe account will be flagged as Rejected.`;
  confirmModal.confirmText = 'Reject Verification';
  confirmModal.cancelText = 'Cancel';
  confirmModal.type = 'danger';
  confirmModal.isLoading = false;
  confirmModal.actionType = 'reject';
  confirmModal.targetUser = user;
  confirmModal.reason = 'Identity document could not be verified.';
  confirmModal.isOpen = true;
};

const openStatusModal = (user, newStatus) => {
  if (!user) return;
  if (isCurrentUser(user)) {
    toast.error('Cannot modify the status of your own active Superadmin account.');
    return;
  }

  confirmModal.targetUser = user;
  confirmModal.newStatus = newStatus;
  confirmModal.actionType = 'status_change';
  confirmModal.isLoading = false;

  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'User';
  const roleName = (user.role || 'user').toUpperCase();

  if (newStatus === 'Suspended') {
    confirmModal.title = 'Suspend User Account';
    confirmModal.message = `Are you sure you want to suspend ${fullName} (${roleName})?\n\n• All active sessions will be terminated immediately.\n• The user will be BLOCKED from logging into the portal.\n• An "Account Suspended" notice will be displayed upon login attempt.`;
    confirmModal.confirmText = 'Suspend Account';
    confirmModal.cancelText = 'Cancel';
    confirmModal.type = 'danger';
  } else if (newStatus === 'Archived') {
    confirmModal.title = 'Archive User Account';
    confirmModal.message = `Are you sure you want to archive ${fullName} (${roleName})?\n\n• All active sessions will be terminated immediately.\n• The user will be BLOCKED from logging into the portal.\n• Historical service tickets, equipment borrowing logs, and audit records will remain safely preserved for institutional compliance.`;
    confirmModal.confirmText = 'Archive Account';
    confirmModal.cancelText = 'Cancel';
    confirmModal.type = 'danger';
  } else if (newStatus === 'Active') {
    confirmModal.title = 'Reactivate User Account';
    confirmModal.message = `Are you sure you want to reactivate ${fullName} (${roleName})?\n\n• Full portal login and request submission privileges will be restored.\n• Account verification status will be confirmed.`;
    confirmModal.confirmText = 'Reactivate Account';
    confirmModal.cancelText = 'Cancel';
    confirmModal.type = 'success';
  }

  confirmModal.isOpen = true;
};

const closeConfirmModal = (force = false) => {
  if (!force && confirmModal.isLoading) return;
  confirmModal.isOpen = false;
  confirmModal.isLoading = false;
  confirmModal.targetUser = null;
  confirmModal.actionType = '';
  confirmModal.newStatus = '';
};

const handleConfirmAction = async () => {
  if (!confirmModal.targetUser) return;
  confirmModal.isLoading = true;
  const user = confirmModal.targetUser;
  try {
    if (confirmModal.actionType === 'approve') {
      const res = await apiVerifyUser(user.id);
      toast.success(res.data?.message || 'User identity verified and approved!');
      isInspectModalOpen.value = false;
      closeConfirmModal(true);
      await fetchUsers();
    } else if (confirmModal.actionType === 'reject') {
      const res = await apiRejectVerification(
        user.id,
        confirmModal.reason || 'Identity document could not be verified.'
      );
      toast.info(res.data?.message || 'User verification has been rejected.');
      isInspectModalOpen.value = false;
      closeConfirmModal(true);
      await fetchUsers();
    } else if (confirmModal.actionType === 'status_change') {
      const res = await apiUpdateUserStatus(user.id, confirmModal.newStatus);
      toast.success(res.data?.message || `Account status updated to ${confirmModal.newStatus}.`);
      closeConfirmModal(true);
      await fetchUsers();
    } else if (confirmModal.actionType === 'unlock') {
      const res = await apiUnlockUser(user.id);
      toast.success(res.data?.message || 'User account unlocked successfully!');
      if (inspectingUser.value && inspectingUser.value.id === user.id) {
        inspectingUser.value.is_locked = false;
        inspectingUser.value.lockout_until = null;
        inspectingUser.value.failed_login_attempts = 0;
      }
      closeConfirmModal(true);
      await fetchUsers();
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to complete action.');
  } finally {
    confirmModal.isLoading = false;
  }
};

// Strict Multistep Deletion Modal state & handlers
const strictDeleteModal = reactive({
  isOpen: false,
  user: null,
  isLoading: false,
  errorMessage: ''
});

const openStrictDeleteModal = (user) => {
  if (!user) return;
  if (isCurrentUser(user)) {
    toast.error('Cannot delete your own active Superadmin account.');
    return;
  }
  strictDeleteModal.user = user;
  strictDeleteModal.isLoading = false;
  strictDeleteModal.errorMessage = '';
  strictDeleteModal.isOpen = true;
};

const closeStrictDeleteModal = (force = false) => {
  if (!force && strictDeleteModal.isLoading) return;
  strictDeleteModal.isOpen = false;
  strictDeleteModal.isLoading = false;
  strictDeleteModal.user = null;
  strictDeleteModal.errorMessage = '';
};

const handleStrictDeleteConfirm = async ({ user, reason }) => {
  strictDeleteModal.isLoading = true;
  strictDeleteModal.errorMessage = '';
  try {
    const res = await apiDeleteUser(user.id, reason);
    toast.success(res.data?.message || 'User account permanently deleted.');
    closeStrictDeleteModal(true);
    await fetchUsers();
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to permanently delete account.';
    strictDeleteModal.errorMessage = message;
    toast.error(message);
  } finally {
    strictDeleteModal.isLoading = false;
  }
};

const handleSuspendFromDeleteModal = (user) => {
  closeStrictDeleteModal();
  openStatusModal(user, 'Suspended');
};
const handleDeactivateFromDeleteModal = handleSuspendFromDeleteModal;

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

const formatRole = (role) => {
  const map = {
    worker: 'Personnel',
    personnel: 'Personnel',
    admin: 'Admin',
    staff: 'Staff',
    director: 'Director',
    employee: 'Employee',
    student: 'Student',
    superadmin: 'Superadmin'
  };
  return map[role] || (role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Unknown');
};

const roleOptions = [
  { value: 'all', label: 'All Roles' },
  { value: 'worker', label: 'Personnel' },
  { value: 'admin', label: 'Admins' },
  { value: 'staff', label: 'Staff' },
  { value: 'director', label: 'Directors' },
  { value: 'employee', label: 'Employees' },
  { value: 'student', label: 'Students' },
  { value: 'superadmin', label: 'Superadmin' }
];

const isCreateModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isSubmitting = ref(false);
const modalError = ref('');

const showCreatePassword = ref(false);
const showCreateConfirmPassword = ref(false);
const showEditPassword = ref(false);
const showEditConfirmPassword = ref(false);

const createForm = reactive({
  first_name: '',
  last_name: '',
  email: '',
  role: 'admin',
  unit_id: 1,
  specialty: '',
  password: '',
  confirm_password: '',
  status: 'Active'
});

const editForm = reactive({
  id: '',
  first_name: '',
  last_name: '',
  email: '',
  role: 'admin',
  unit_id: null,
  specialty: '',
  password: '',
  confirm_password: ''
});

const UNIT_CODE_MAP = {
  1: 'FGMU',
  2: 'LEAU',
  3: 'SSU'
};

const PREDEFINED_SPECIALTIES = {
  1: [ // FGMU - Facilities & Grounds
    'General Maintenance',
    'Carpentry',
    'Electrical',
    'Plumbing',
    'Aircon / Refrigeration',
    'Painting / Masonry',
    'Welding',
    'Janitorial',
    'Disinfection / Sanitation',
    'Hauler / Logistics'
  ],
  2: [ // LEAU - Landscaping & Aesthetics
    'Groundskeeper',
    'Landscaper',
    'Stage & Hall Decorator',
    'Tool & Equipment Custodian',
    'Landscaping & Gardening',
    'Grass Cutting / Groundskeeping'
  ],
  3: [ // SSU - Security Services
    'Campus Security & Patrol',
    'Gate / Entry Control',
    'Surveillance / CCTV',
    'Emergency Response',
    'Traffic & Parking Control',
    'Event & Crowd Control'
  ]
};

const unitCategories = ref({
  1: [],
  2: [],
  3: []
});

const getUnitName = (unitId) => {
  const id = Number(unitId);
  if (id === 1) return 'Facilities & Grounds (FGMU)';
  if (id === 2) return 'Landscaping & Aesthetics (LEAU)';
  if (id === 3) return 'Security Services (SSU)';
  return 'Operational Unit';
};

const fetchCategoriesForUnit = async (unitId) => {
  const code = UNIT_CODE_MAP[Number(unitId)];
  if (!code) return;
  try {
    const res = await apiFetchPersonnelCategories(code);
    const cats = res.data?.data?.categories || [];
    if (Array.isArray(cats)) {
      unitCategories.value[Number(unitId)] = cats.map(c => typeof c === 'string' ? c : c.name).filter(Boolean);
    }
  } catch (err) {
    // Non-blocking fallback to PREDEFINED_SPECIALTIES
  }
};

const getSpecialtiesForUnit = (unitId) => {
  const id = Number(unitId) || 1;
  const dynamic = unitCategories.value[id] || [];
  const predefined = PREDEFINED_SPECIALTIES[id] || [];
  return Array.from(new Set([...dynamic, ...predefined]));
};

// Automatically manage sub-unit selection & specialties based on selected system role
watch(() => createForm.role, (newRole) => {
  if (isGlobalRole(newRole)) {
    createForm.unit_id = null;
    createForm.specialty = '';
  } else if (!createForm.unit_id) {
    createForm.unit_id = 1;
  }
  if (newRole === 'worker') {
    const unitId = createForm.unit_id || 1;
    fetchCategoriesForUnit(unitId);
    const available = getSpecialtiesForUnit(unitId);
    if (!createForm.specialty || !available.includes(createForm.specialty)) {
      createForm.specialty = available[0] || '';
    }
  }
});

watch(() => createForm.unit_id, (newUnitId) => {
  if (newUnitId) {
    fetchCategoriesForUnit(newUnitId);
    if (createForm.role === 'worker') {
      const available = getSpecialtiesForUnit(newUnitId);
      if (!available.includes(createForm.specialty)) {
        createForm.specialty = available[0] || '';
      }
    }
  }
});

watch(() => editForm.role, (newRole) => {
  if (isGlobalRole(newRole)) {
    editForm.unit_id = null;
    editForm.specialty = '';
  } else if (!editForm.unit_id) {
    editForm.unit_id = 1;
  }
  if (newRole === 'worker') {
    const unitId = editForm.unit_id || 1;
    fetchCategoriesForUnit(unitId);
    const available = getSpecialtiesForUnit(unitId);
    if (!editForm.specialty || !available.includes(editForm.specialty)) {
      editForm.specialty = available[0] || '';
    }
  }
});

watch(() => editForm.unit_id, (newUnitId) => {
  if (newUnitId) {
    fetchCategoriesForUnit(newUnitId);
    if (editForm.role === 'worker') {
      const available = getSpecialtiesForUnit(newUnitId);
      if (!editForm.specialty) {
        editForm.specialty = available[0] || '';
      }
    }
  }
});

const getRoleBadgeClass = (role) => {
  const map = {
    superadmin: 'bg-purple-100 text-purple-700 border-purple-200',
    admin: 'bg-slate-200 text-slate-800 border-slate-300',
    staff: 'bg-sky-100 text-sky-700 border-sky-200',
    director: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    worker: 'bg-amber-100 text-amber-700 border-amber-200',
    personnel: 'bg-amber-100 text-amber-700 border-amber-200',
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
    Archived: 'bg-slate-100 text-slate-700 border-slate-300',
    Rejected: 'bg-rose-50 text-rose-700 border-rose-200'
  };
  // Legacy 'Deactivated' rows (migrated to Suspended) render as Suspended
  if (status === 'Deactivated') return map.Suspended;
  return map[status] || 'bg-slate-100 text-slate-600 border-slate-200';
};

const getStudentTypeLabel = (studentType) => {
  const clean = (studentType || '').toLowerCase().trim();
  if (clean === 'rso') return 'RSO';
  if (clean === 'ssg') return 'SSG';
  return '';
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

const paginationRange = computed(() => {
  if (pagination.total === 0) return { start: 0, end: 0 };
  const start = (pagination.page - 1) * pagination.per_page + 1;
  const end = Math.min(pagination.page * pagination.per_page, pagination.total);
  return { start, end };
});

const displayedPages = computed(() => {
  const current = pagination.page;
  const total = pagination.total_pages;
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = [];
  pages.push(1);
  if (current > 3) pages.push('...');
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
});

const handlePerPageChange = () => {
  pagination.page = 1;
  fetchUsers();
};

const handleFilterChange = () => {
  pagination.page = 1;
  fetchUsers();
};

const changePage = (newPage) => {
  if (newPage < 1 || newPage > pagination.total_pages || newPage === pagination.page) return;
  pagination.page = newPage;
  fetchUsers();
};

const fetchUsers = async () => {
  isLoading.value = true;
  fetchError.value = '';
  try {
    const params = {
      page: pagination.page,
      per_page: pagination.per_page,
      search: filters.search || '',
      role: filters.role || 'all',
      unit_id: filters.unit_id || 'all',
      status: filters.status || 'all'
    };

    const res = await apiFetchUsers(params);
    const payload = res.data?.data || res.data;
    if (payload) {
      users.value = payload.users || res.data?.users || [];
      if (typeof payload.inactive_count !== 'undefined') {
        inactiveCount.value = Number(payload.inactive_count);
      }
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
  showCreatePassword.value = false;
  showCreateConfirmPassword.value = false;
  createForm.first_name = '';
  createForm.last_name = '';
  createForm.email = '';
  createForm.role = 'admin';
  createForm.unit_id = 1;
  createForm.specialty = '';
  createForm.password = '';
  createForm.confirm_password = '';
  createForm.status = 'Active';
  isCreateModalOpen.value = true;
  fetchCategoriesForUnit(1);
  fetchCategoriesForUnit(2);
  fetchCategoriesForUnit(3);
};

const submitCreateUser = async () => {
  isSubmitting.value = true;
  modalError.value = '';

  if (createForm.first_name.trim().length < 2) {
    modalError.value = 'First name must be at least 2 characters.';
    isSubmitting.value = false;
    return;
  }
  if (createForm.last_name.trim().length < 2) {
    modalError.value = 'Last name must be at least 2 characters.';
    isSubmitting.value = false;
    return;
  }
  if (['admin', 'staff', 'worker'].includes(createForm.role) && !createForm.unit_id) {
    modalError.value = 'Admin, Staff, and Personnel accounts must be assigned to a sub-unit (FGMU, LEAU, or SSU).';
    isSubmitting.value = false;
    return;
  }

  if (createForm.role === 'worker') {
    const username = createForm.email.trim();
    if (!username) {
      modalError.value = 'Username is required for personnel accounts.';
      isSubmitting.value = false;
      return;
    }
    if (username.length < 3) {
      modalError.value = 'Username must be at least 3 characters long.';
      isSubmitting.value = false;
      return;
    }
    if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
      modalError.value = 'Username can only contain letters, numbers, dots, hyphens, and underscores.';
      isSubmitting.value = false;
      return;
    }
    if (!createForm.specialty || !createForm.specialty.trim()) {
      modalError.value = 'Please select a trade / specialty category for the personnel.';
      isSubmitting.value = false;
      return;
    }
  } else {
    const email = createForm.email.trim();
    if (!email) {
      modalError.value = 'Email address is required.';
      isSubmitting.value = false;
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      modalError.value = 'Please enter a valid email address.';
      isSubmitting.value = false;
      return;
    }
  }

  if (createForm.password.length < 8) {
    modalError.value = 'Password must be at least 8 characters long.';
    isSubmitting.value = false;
    return;
  }
  if (createForm.password !== createForm.confirm_password) {
    modalError.value = 'Passwords do not match.';
    isSubmitting.value = false;
    return;
  }

  try {
    const payload = {
      first_name: createForm.first_name.trim(),
      last_name: createForm.last_name.trim(),
      email: createForm.email.trim(),
      username: createForm.role === 'worker' ? createForm.email.trim() : undefined,
      role: createForm.role,
      password: createForm.password,
      confirm_password: createForm.confirm_password,
      status: createForm.status,
      unit_id: isGlobalRole(createForm.role) ? null : (createForm.unit_id ? Number(createForm.unit_id) : null),
      specialty: createForm.role === 'worker' ? (createForm.specialty?.trim() || null) : undefined,
    };

    const res = await apiCreateUser(payload);
    if (res.data?.status === true || res.data?.success || res.status === 201) {
      toast.success(res.data?.message || 'User account provisioned successfully!');
      isCreateModalOpen.value = false;
      fetchUsers();
    } else {
      modalError.value = res.data?.message || 'Failed to create user.';
    }
  } catch (err) {
    modalError.value = extractErrorMessage(err, 'Failed to provision account.');
  } finally {
    isSubmitting.value = false;
  }
};

const openEditModal = (user) => {
  if (isRegisteredUser(user)) {
    toast.warning('Registered user accounts (Student / Employee) are self-managed and cannot be edited by Superadmin. You can Suspend their access instead.');
    return;
  }
  modalError.value = '';
  showEditPassword.value = false;
  showEditConfirmPassword.value = false;
  editForm.id = user.id;
  editForm.first_name = user.first_name || '';
  editForm.last_name = user.last_name || '';
  editForm.email = user.role === 'worker' ? (user.username || user.email || '') : (user.email || '');
  editForm.role = user.role || 'admin';
  editForm.unit_id = user.unit_id || null;
  editForm.specialty = user.specialty || '';
  editForm.password = '';
  editForm.confirm_password = '';
  if (editForm.unit_id) {
    fetchCategoriesForUnit(editForm.unit_id);
  }
  isEditModalOpen.value = true;
};

const submitEditUser = async () => {
  if (isRegisteredUser(editForm)) {
    toast.error('Registered user accounts cannot have their profile details modified by Superadmin.');
    return;
  }

  isSubmitting.value = true;
  modalError.value = '';
  try {
    const finalRole = editForm.role;
    const finalUnitId = editForm.unit_id ? Number(editForm.unit_id) : null;
    if (['admin', 'staff', 'worker'].includes(finalRole) && !finalUnitId) {
      modalError.value = 'Admin, Staff, and Personnel accounts must be assigned to a sub-unit (FGMU, LEAU, or SSU).';
      isSubmitting.value = false;
      return;
    }

    if (finalRole === 'worker') {
      const username = (editForm.email || '').trim();
      if (!username) {
        modalError.value = 'Username is required for personnel accounts.';
        isSubmitting.value = false;
        return;
      }
      if (username.length < 3) {
        modalError.value = 'Username must be at least 3 characters long.';
        isSubmitting.value = false;
        return;
      }
      if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
        modalError.value = 'Username can only contain letters, numbers, dots, hyphens, and underscores.';
        isSubmitting.value = false;
        return;
      }
      if (!editForm.specialty || !editForm.specialty.trim()) {
        modalError.value = 'Please select a trade / specialty category for the personnel.';
        isSubmitting.value = false;
        return;
      }
    }

    const payload = {
      first_name: editForm.first_name ? editForm.first_name.trim() : undefined,
      last_name: editForm.last_name ? editForm.last_name.trim() : undefined,
      role: editForm.role,
      unit_id: isGlobalRole(editForm.role) ? null : (editForm.unit_id ? Number(editForm.unit_id) : null),
      specialty: editForm.role === 'worker' ? (editForm.specialty?.trim() || null) : undefined,
      email: (editForm.role === 'worker' && editForm.email) ? editForm.email.trim() : undefined,
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

    const res = await apiUpdateUser(editForm.id, payload);
    if (res.data?.status === true || res.data?.success || res.status === 200) {
      toast.success(res.data?.message || 'User account updated successfully!');
      isEditModalOpen.value = false;
      fetchUsers();
    } else {
      modalError.value = res.data?.message || 'Failed to update user.';
    }
  } catch (err) {
    modalError.value = extractErrorMessage(err, 'Failed to update account.');
  } finally {
    isSubmitting.value = false;
  }
};

const confirmDeleteUser = (user) => {
  openStrictDeleteModal(user);
};

onMounted(() => {
  fetchUsers();
});
</script>
