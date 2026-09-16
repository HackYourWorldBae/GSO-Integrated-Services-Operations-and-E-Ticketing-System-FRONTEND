<template>
  <MainLayout>
    <template #header-title>
      <div class="flex flex-col">
        <div class="flex items-center gap-2.5 flex-wrap">
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">Account Activities Audit Trail</h2>
          <span class="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-black uppercase tracking-wider border border-purple-200">
            {{ pagination.total }} Records
          </span>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-black uppercase tracking-wider border border-emerald-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>RA 10173 Compliant</span>
          </span>
        </div>
        <p class="text-xs sm:text-sm font-medium text-slate-600 mt-1">
          Immutable, privacy-protected security record of authentication, access control, and user account lifecycle events
        </p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-6 animate-fade-in relative pb-12">


        <!-- Data Privacy & Compliance Notice Banner -->
        <div class="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-5 sm:p-6 text-white shadow-md border border-slate-800 space-y-3">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-400 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 class="text-sm sm:text-base font-black tracking-tight text-white">Data Privacy Act of 2012 (RA 10173) Compliance Notice</h3>
                <p class="text-xs text-slate-300 font-medium mt-0.5">
                  Account telemetry is processed exclusively for system security, fraud mitigation, and user account integrity under legitimate institutional authority.
                </p>
              </div>
            </div>

            <!-- Privacy Masking Toggle -->
            <button
              @click="togglePrivacyMode"
              type="button"
              class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 border cursor-pointer min-h-[44px] touch-manipulation"
              :class="privacyMasked ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'"
              :title="privacyMasked ? 'Click to reveal unmasked identifiers for incident investigation' : 'Click to mask PII data'"
            >
              <svg v-if="privacyMasked" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{{ privacyMasked ? 'Privacy Mode: Masked PII' : 'Investigative Mode: Unmasked' }}</span>
            </button>
          </div>
        </div>

        <!-- Filter & Search Controls Card -->
        <div class="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
          <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
            <!-- Search bar -->
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
                placeholder="Search by event type, user, email, IP, or device..."
                class="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all min-h-[44px]"
              />
              <button
                v-if="filters.search"
                @click="filters.search = ''; fetchLogs()"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Severity Filter -->
            <div class="flex items-center gap-2 flex-wrap">
              <select
                v-model="filters.severity"
                @change="handleFilterChange"
                class="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold focus:outline-none focus:border-purple-500 min-h-[44px] cursor-pointer"
              >
                <option value="">All Severities</option>
                <option value="critical">Critical (Lockouts / Deletions)</option>
                <option value="warning">Warning (Failed Logins / Status)</option>
                <option value="notice">Notice (Permissions / Unlocks)</option>
                <option value="info">Info (Logins / Profile / Verification)</option>
              </select>

              <!-- Category Filter -->
              <select
                v-model="filters.category"
                @change="handleFilterChange"
                class="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold focus:outline-none focus:border-purple-500 min-h-[44px] cursor-pointer"
              >
                <option value="">All Event Categories</option>
                <option value="auth">Authentication (Logins / Lockouts)</option>
                <option value="account">Account Management &amp; Updates</option>
                <option value="security">Security &amp; Privilege Escalation</option>
              </select>

              <!-- Actions -->
              <button
                @click="fetchLogs"
                :disabled="loading"
                class="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all flex items-center justify-center disabled:opacity-50 min-h-[44px] min-w-[44px] cursor-pointer touch-manipulation"
                title="Refresh Activity Logs"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{ 'animate-spin': loading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>

              <button
                @click="exportToCSV"
                :disabled="loading || logs.length === 0"
                class="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px] cursor-pointer touch-manipulation shadow-xs"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Logs Table Card (Desktop) & Mobile Card Stack -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <!-- Desktop Table (md and up) -->
          <div class="hidden md:block overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200">
                  <th class="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">Timestamp</th>
                  <th class="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">Severity</th>
                  <th class="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">Event Type</th>
                  <th class="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">Actor / Initiator</th>
                  <th class="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">Target Account</th>
                  <th class="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">Client Context</th>
                  <th class="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <!-- Loading State -->
                <tr v-if="loading && logs.length === 0">
                  <td colspan="7" class="py-16 text-center">
                    <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold">
                      <svg class="animate-spin h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading account activity records...
                    </div>
                  </td>
                </tr>

                <!-- Empty State -->
                <tr v-else-if="logs.length === 0">
                  <td colspan="7" class="py-16 text-center">
                    <div class="max-w-sm mx-auto flex flex-col items-center">
                      <div class="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <p class="text-sm font-bold text-slate-700">No account activity events found</p>
                      <p class="text-xs text-slate-400 mt-1">Try modifying your search criteria or resetting filters.</p>
                    </div>
                  </td>
                </tr>

                <!-- Data Rows -->
                <tr
                  v-for="log in logs"
                  :key="log.id"
                  class="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  @click="openLogDetails(log)"
                >
                  <!-- Timestamp -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-xs font-bold text-slate-900">{{ formatDate(log.created_at) }}</div>
                    <div class="text-xs font-medium text-slate-500">{{ formatTime(log.created_at) }}</div>
                  </td>

                  <!-- Severity -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider border"
                      :class="getSeverityBadgeClass(log.severity)"
                    >
                      {{ log.severity }}
                    </span>
                  </td>

                  <!-- Event Type -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="font-mono text-xs font-black text-slate-800">
                      {{ log.event_type }}
                    </div>
                    <div class="text-xs text-slate-500 line-clamp-1 max-w-xs mt-0.5">
                      {{ log.details }}
                    </div>
                  </td>

                  <!-- Actor -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div v-if="log.actor_first_name || log.actor_last_name" class="flex items-center gap-2">
                      <div class="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {{ getInitials(log.actor_first_name, log.actor_last_name) }}
                      </div>
                      <div>
                        <div class="text-xs font-bold text-slate-900">
                          {{ log.actor_first_name }} {{ log.actor_last_name }}
                        </div>
                        <div class="text-xs font-medium text-slate-500 font-mono">
                          {{ formatEmail(log.actor_email) }}
                        </div>
                      </div>
                    </div>
                    <div v-else class="text-xs font-medium text-slate-500 italic">
                      Public / System Initiator
                    </div>
                  </td>

                  <!-- Target Account -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div v-if="log.target_first_name || log.target_last_name" class="flex flex-col">
                      <span class="text-xs font-bold text-slate-900">
                        {{ log.target_first_name }} {{ log.target_last_name }}
                      </span>
                      <span class="text-xs text-slate-500 font-mono">
                        {{ formatEmail(log.target_email) }}
                      </span>
                    </div>
                    <span v-else class="text-xs text-slate-400">—</span>
                  </td>

                  <!-- Client Context (Device + Masked IP) -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex flex-col">
                      <span class="text-xs font-bold text-slate-800">{{ log.device_summary || 'Unknown Device' }}</span>
                      <span class="text-xs font-mono text-slate-500 font-medium">IP: {{ formatIp(log.ip_address) }}</span>
                    </div>
                  </td>

                  <!-- Action -->
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      @click.stop="openLogDetails(log)"
                      class="p-2 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                      title="Inspect Event"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Card Stack (screens < 768px) -->
          <div class="block md:hidden p-4 space-y-3">
            <div v-if="loading && logs.length === 0" class="py-12 text-center">
              <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold">
                <svg class="animate-spin h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading activity records...</span>
              </div>
            </div>

            <div v-else-if="logs.length === 0" class="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl">
              <p class="text-sm font-bold text-slate-700">No account activity events found</p>
              <p class="text-xs text-slate-400 mt-1">Try modifying your search criteria or resetting filters.</p>
            </div>

            <!-- Mobile Cards -->
            <div
              v-for="log in logs"
              :key="'mob-' + log.id"
              class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 hover:border-purple-300 transition-all"
            >
              <div class="flex items-center justify-between gap-2 flex-wrap">
                <span
                  class="px-2.5 py-0.5 rounded-md text-xs font-black uppercase tracking-wider border"
                  :class="getSeverityBadgeClass(log.severity)"
                >
                  {{ log.severity }}
                </span>
                <span class="text-xs text-slate-500 font-semibold">
                  {{ formatDate(log.created_at) }} • {{ formatTime(log.created_at) }}
                </span>
              </div>

              <div>
                <span class="font-mono text-xs font-black text-slate-900 block">{{ log.event_type }}</span>
                <p class="text-xs text-slate-600 font-medium mt-1">{{ log.details }}</p>
              </div>

              <div class="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/60">
                <div>
                  <span class="text-[10px] uppercase font-bold text-slate-400 block">Actor</span>
                  <span class="font-bold text-slate-800 truncate block">
                    {{ log.actor_first_name ? `${log.actor_first_name} ${log.actor_last_name}` : 'System' }}
                  </span>
                  <span class="text-[10px] text-slate-500 font-mono block">{{ formatEmail(log.actor_email) }}</span>
                </div>
                <div>
                  <span class="text-[10px] uppercase font-bold text-slate-400 block">Target Account</span>
                  <span class="font-bold text-slate-800 truncate block">
                    {{ log.target_first_name ? `${log.target_first_name} ${log.target_last_name}` : '—' }}
                  </span>
                  <span class="text-[10px] text-slate-500 font-mono block">{{ formatEmail(log.target_email) }}</span>
                </div>
              </div>

              <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>{{ log.device_summary || 'Unknown Device' }}</span>
                <span class="font-mono">IP: {{ formatIp(log.ip_address) }}</span>
              </div>

              <button
                type="button"
                @click="openLogDetails(log)"
                class="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-purple-50 text-purple-700 border border-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer touch-manipulation shadow-2xs"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>Inspect Event Details</span>
              </button>
            </div>
          </div>

          <!-- Pagination Footer -->
          <div class="px-4 sm:px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <span class="text-xs text-slate-600 font-medium">
                Showing <strong class="text-slate-900">{{ Math.min(pagination.total, pagination.offset + 1) }}</strong> to
                <strong class="text-slate-900">{{ Math.min(pagination.total, pagination.offset + pagination.limit) }}</strong> of
                <strong class="text-slate-900">{{ pagination.total }}</strong>
              </span>
              <select
                v-model="pagination.limit"
                @change="handleLimitChange"
                class="px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none focus:border-purple-500 cursor-pointer shadow-2xs"
              >
                <option :value="15">15 / page</option>
                <option :value="25">25 / page</option>
                <option :value="50">50 / page</option>
                <option :value="100">100 / page</option>
              </select>
            </div>

            <div class="flex items-center gap-1.5 w-full sm:w-auto justify-center">
              <button
                @click="changePage(currentPage - 1)"
                :disabled="currentPage <= 1 || loading"
                class="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all min-h-[44px] touch-manipulation cursor-pointer"
              >
                Previous
              </button>
              <div class="px-3 py-1.5 text-xs font-bold text-slate-700">
                {{ currentPage }} / {{ totalPages }}
              </div>
              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage >= totalPages || loading"
                class="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all min-h-[44px] touch-manipulation cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- Detail Modal Teleported to Body -->
      <Teleport to="body">
        <div
          v-if="selectedLog"
          class="fixed inset-0 z-[9990] overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 pointer-events-auto"
          @click.self="closeLogDetails"
        >
          <div class="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-5 sm:p-6 animate-scale-up space-y-5 max-h-[92vh] overflow-y-auto custom-scrollbar pointer-events-auto">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100">
              <div class="flex items-center gap-2.5">
                <div class="p-2.5 rounded-xl bg-purple-50 text-purple-600 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-base font-black text-slate-900">Account Activity Log</h3>
                  <p class="text-xs text-slate-400 font-semibold">Event Reference #{{ selectedLog.id }}</p>
                </div>
              </div>
              <button
                @click="closeLogDetails"
                class="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer touch-manipulation"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="space-y-3.5 text-xs">
              <div class="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <div class="text-[10px] font-black uppercase tracking-wider text-slate-400">Timestamp</div>
                  <div class="font-semibold text-slate-800 mt-0.5">{{ formatFullDateTime(selectedLog.created_at) }}</div>
                </div>
                <div>
                  <div class="text-[10px] font-black uppercase tracking-wider text-slate-400">Severity</div>
                  <div class="mt-0.5">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold border uppercase" :class="getSeverityBadgeClass(selectedLog.severity)">
                      {{ selectedLog.severity }}
                    </span>
                  </div>
                </div>
                <div>
                  <div class="text-[10px] font-black uppercase tracking-wider text-slate-400">Event Type</div>
                  <div class="font-mono font-bold text-purple-700 mt-0.5 truncate">{{ selectedLog.event_type }}</div>
                </div>
                <div>
                  <div class="text-[10px] font-black uppercase tracking-wider text-slate-400">Client Device</div>
                  <div class="font-semibold text-slate-800 mt-0.5 truncate">{{ selectedLog.device_summary || 'Unknown' }}</div>
                </div>
              </div>

              <!-- Actor and Target Account Info -->
              <div class="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <div class="text-[10px] font-black uppercase tracking-wider text-slate-400">Actor / Initiator</div>
                  <div class="font-bold text-slate-900 mt-0.5">
                    {{ selectedLog.actor_first_name ? `${selectedLog.actor_first_name} ${selectedLog.actor_last_name}` : 'System Automation' }}
                  </div>
                  <div class="text-[11px] text-slate-500 font-mono">{{ formatEmail(selectedLog.actor_email) }}</div>
                </div>
                <div>
                  <div class="text-[10px] font-black uppercase tracking-wider text-slate-400">Target User</div>
                  <div class="font-bold text-slate-900 mt-0.5">
                    {{ selectedLog.target_first_name ? `${selectedLog.target_first_name} ${selectedLog.target_last_name}` : 'Self / Global' }}
                  </div>
                  <div class="text-[11px] text-slate-500 font-mono">{{ formatEmail(selectedLog.target_email) }}</div>
                </div>
              </div>

              <!-- Event Details -->
              <div>
                <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Activity Narrative</label>
                <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs leading-relaxed font-medium">
                  {{ selectedLog.details || 'No additional narrative recorded.' }}
                </div>
              </div>

              <!-- Network Provenance & Data Privacy Tag -->
              <div class="p-3 rounded-xl bg-purple-50/60 border border-purple-100 text-purple-900 text-xs flex items-center justify-between">
                <div>
                  <span class="font-bold">Network IP:</span>
                  <span class="font-mono ml-1">{{ formatIp(selectedLog.ip_address) }}</span>
                </div>
                <span class="text-[10px] font-black text-purple-700 uppercase bg-purple-100 px-2 py-0.5 rounded">
                  Immutable Record
                </span>
              </div>

              <!-- Metadata JSON (Sanitized) -->
              <div v-if="selectedLog.metadata">
                <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Sanitized Telemetry Metadata</label>
                <pre class="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] leading-relaxed break-words whitespace-pre-wrap max-h-36 overflow-y-auto custom-scrollbar">{{ formatMetadata(selectedLog.metadata) }}</pre>
              </div>
            </div>

            <div class="pt-2 flex justify-end">
              <button
                @click="closeLogDetails"
                class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all min-h-[44px] cursor-pointer touch-manipulation"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import api from '@/api/client';

const loading = ref(false);
const logs = ref([]);
const selectedLog = ref(null);
const privacyMasked = ref(true);

const togglePrivacyMode = () => {
  privacyMasked.value = !privacyMasked.value;
};

const openLogDetails = (log) => {
  selectedLog.value = log;
  document.body.style.overflow = 'hidden';
};

const closeLogDetails = () => {
  selectedLog.value = null;
  document.body.style.overflow = '';
};

const handleKeydown = (e) => {
  if (e.key === 'Escape' && selectedLog.value) {
    closeLogDetails();
  }
};

const filters = ref({
  search: '',
  severity: '',
  category: '',
});

const pagination = ref({
  total: 0,
  limit: 25,
  offset: 0,
});

let searchTimeout = null;

const currentPage = computed(() => Math.floor(pagination.value.offset / pagination.value.limit) + 1);
const totalPages = computed(() => Math.max(1, Math.ceil(pagination.value.total / pagination.value.limit)));

const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    pagination.value.offset = 0;
    fetchLogs();
  }, 350);
};

const handleFilterChange = () => {
  pagination.value.offset = 0;
  fetchLogs();
};

const handleLimitChange = () => {
  pagination.value.offset = 0;
  fetchLogs();
};

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  pagination.value.offset = (page - 1) * pagination.value.limit;
  fetchLogs();
};

const fetchLogs = async () => {
  loading.value = true;
  try {
    const params = {
      limit: pagination.value.limit,
      offset: pagination.value.offset,
    };
    if (filters.value.search) params.search = filters.value.search;
    if (filters.value.severity) params.severity = filters.value.severity;
    if (filters.value.category) params.category = filters.value.category;

    const response = await api.get('/superadmin/account-activity-logs', { params });
    const payload = response.data?.data || response.data;
    if (payload) {
      logs.value = payload.logs || [];
      pagination.value.total = payload.total ?? logs.value.length;
    }
  } catch (error) {
    console.error('Failed to fetch account activity logs:', error);
  } finally {
    loading.value = false;
  }
};

// Data Privacy PII Masking Utilities
const formatEmail = (email) => {
  if (!email) return '—';
  if (!privacyMasked.value) return email;
  const parts = email.split('@');
  if (parts.length < 2) return '***';
  const name = parts[0];
  const domain = parts[1];
  const maskedName = name.length <= 2 ? name.charAt(0) + '***' : name.charAt(0) + '***' + name.charAt(name.length - 1);
  return `${maskedName}@${domain}`;
};

const formatIp = (ip) => {
  if (!ip) return '—';
  if (!privacyMasked.value) return ip;
  if (ip.includes('.')) {
    const segments = ip.split('.');
    if (segments.length === 4) {
      return `${segments[0]}.${segments[1]}.***.***`;
    }
  }
  return ip.substring(0, Math.min(ip.length, 6)) + '***';
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const formatFullDateTime = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

const getInitials = (first, last) => {
  const f = first ? first.charAt(0).toUpperCase() : '';
  const l = last ? last.charAt(0).toUpperCase() : '';
  return `${f}${l}` || 'U';
};

const getSeverityBadgeClass = (severity) => {
  switch (severity?.toLowerCase()) {
    case 'critical':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'warning':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'notice':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'info':
    default:
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
};

const formatMetadata = (metadata) => {
  if (!metadata) return '';
  try {
    const obj = typeof metadata === 'string' ? JSON.parse(metadata) : metadata;
    return JSON.stringify(obj, null, 2);
  } catch {
    return metadata;
  }
};

const exportToCSV = () => {
  if (!logs.value || logs.value.length === 0) return;

  const watermark = [
    '# BATANGAS STATE UNIVERSITY - GENERAL SERVICES OFFICE',
    '# ACCOUNT ACTIVITIES & AUTHENTICATION AUDIT TRAIL',
    '# COMPLIANT WITH REPUBLIC ACT NO. 10173 (DATA PRIVACY ACT OF 2012)',
    `# EXPORT GENERATED AT: ${new Date().toISOString()}`,
    `# PRIVACY MASKING: ${privacyMasked.value ? 'ACTIVE (PII Masked)' : 'DEACTIVATED (Unmasked Authorized Audit)'}`,
    ''
  ].join('\n');

  const headers = ['ID', 'Timestamp', 'Severity', 'Event Type', 'Actor Name', 'Actor Email', 'Target Name', 'Target Email', 'Device Summary', 'IP Address', 'Details'];
  const rows = logs.value.map(log => [
    log.id,
    log.created_at,
    `"${log.severity}"`,
    `"${log.event_type}"`,
    log.actor_first_name ? `"${log.actor_first_name} ${log.actor_last_name}"` : '"System"',
    `"${formatEmail(log.actor_email)}"`,
    log.target_first_name ? `"${log.target_first_name} ${log.target_last_name}"` : '""',
    `"${formatEmail(log.target_email)}"`,
    `"${log.device_summary || ''}"`,
    `"${formatIp(log.ip_address)}"`,
    `"${(log.details || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(watermark + [headers.join(','), ...rows.map(r => r.join(','))].join('\n'));
  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute('download', `gso_account_activity_logs_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  fetchLogs();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});
</script>
