<template>
  <MainLayout>
    <template #header-title>
      <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
        Account Activities Audit Trail
      </h2>
    </template>

    <template #main-content>
      <div class="space-y-6 animate-fade-in relative pb-12">




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
                data-tour="account-logs-search"
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
                data-tour="account-logs-filter-severity"
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
                data-tour="account-logs-filter-category"
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

              <!-- Audit Specifications Button -->
              <button
                @click="showSpecsModal = true"
                type="button"
                class="px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer min-h-[44px] touch-manipulation shadow-xs"
                title="View Audit Trail Architecture & ICT Security Justification"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Audit Specifications</span>
              </button>

              <!-- Privacy Masking Toggle -->
              <button
                data-tour="account-logs-btn-privacy"
                @click="togglePrivacyMode"
                type="button"
                class="px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer min-h-[44px] touch-manipulation shadow-xs"
                :class="privacyMasked ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100' : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'"
                :title="privacyMasked ? 'Click to reveal unmasked identifiers for incident investigation' : 'Click to mask PII data'"
              >
                <svg v-if="privacyMasked" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{{ privacyMasked ? 'Masked PII' : 'Unmasked' }}</span>
              </button>

              <button
                data-tour="account-logs-btn-export"
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
            <table data-tour="account-logs-table" class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-slate-700">
                  <th class="px-6 py-3.5 text-xs font-black uppercase tracking-wider">
                    <span>Timestamp</span>
                    <span class="block text-[10px] font-semibold text-slate-400 normal-case">PHT (UTC+8)</span>
                  </th>
                  <th class="px-6 py-3.5 text-xs font-black uppercase tracking-wider">
                    <span>Severity</span>
                    <span class="block text-[10px] font-semibold text-slate-400 normal-case">Risk Level</span>
                  </th>
                  <th class="px-6 py-3.5 text-xs font-black uppercase tracking-wider">
                    <span>Event Type</span>
                    <span class="block text-[10px] font-semibold text-slate-400 normal-case">Security Event Code</span>
                  </th>
                  <th class="px-6 py-3.5 text-xs font-black uppercase tracking-wider">
                    <span>Actor / Initiator</span>
                    <span class="block text-[10px] font-semibold text-slate-400 normal-case">Originating Subject</span>
                  </th>
                  <th class="px-6 py-3.5 text-xs font-black uppercase tracking-wider">
                    <span>Target Account</span>
                    <span class="block text-[10px] font-semibold text-slate-400 normal-case">Affected Subject</span>
                  </th>
                  <th class="px-6 py-3.5 text-xs font-black uppercase tracking-wider">
                    <span>Client Context</span>
                    <span class="block text-[10px] font-semibold text-slate-400 normal-case">Device &amp; IP Origin</span>
                  </th>
                  <th class="px-6 py-3.5 text-xs font-black uppercase tracking-wider text-right">
                    <span>Action</span>
                    <span class="block text-[10px] font-semibold text-slate-400 normal-case">Inspect</span>
                  </th>
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
                    <div class="text-xs font-medium text-slate-500">{{ formatTime(log.created_at) }} PHT</div>
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
                  {{ formatDate(log.created_at) }} • {{ formatTime(log.created_at) }} PHT
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
          class="fixed inset-0 z-[150] overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 pointer-events-auto"
          @click.self="closeLogDetails"
        >
          <div class="my-auto bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-5 sm:p-6 animate-scale-up space-y-5 max-h-[calc(100dvh-2rem)] sm:max-h-[88vh] overflow-y-auto custom-scrollbar pointer-events-auto">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100">
              <div class="flex items-center gap-2.5">
                <div class="p-2.5 rounded-xl bg-purple-50 text-purple-600 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-black text-slate-900">Account Activity Log</h3>
                  <p class="text-xs text-purple-700 font-bold uppercase tracking-wider">Event Reference #{{ selectedLog.id }} • Immutable Record</p>
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

            <div class="space-y-3.5 text-sm">
              <div class="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <div class="text-[11px] font-black uppercase tracking-wider text-slate-400">Timestamp (PHT)</div>
                  <div class="font-semibold text-slate-800 mt-0.5 text-sm">{{ formatFullDateTime(selectedLog.created_at) }}</div>
                </div>
                <div>
                  <div class="text-[11px] font-black uppercase tracking-wider text-slate-400">Risk Severity</div>
                  <div class="mt-0.5">
                    <span class="px-2 py-0.5 rounded text-xs font-bold border uppercase" :class="getSeverityBadgeClass(selectedLog.severity)">
                      {{ selectedLog.severity }}
                    </span>
                  </div>
                </div>
                <div>
                  <div class="text-[11px] font-black uppercase tracking-wider text-slate-400">Security Event Code</div>
                  <div class="font-mono font-bold text-purple-700 mt-0.5 truncate text-sm">{{ selectedLog.event_type }}</div>
                </div>
                <div>
                  <div class="text-[11px] font-black uppercase tracking-wider text-slate-400">Client Platform</div>
                  <div class="font-semibold text-slate-800 mt-0.5 truncate text-sm">{{ selectedLog.device_summary || 'Standard Browser' }}</div>
                </div>
              </div>

              <!-- Actor and Target Account Info -->
              <div class="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <div class="text-[11px] font-black uppercase tracking-wider text-slate-400">Originating Actor</div>
                  <div class="font-bold text-slate-900 mt-0.5 text-sm truncate">
                    {{ selectedLog.actor_first_name ? `${selectedLog.actor_first_name} ${selectedLog.actor_last_name}` : 'System Automation' }}
                  </div>
                  <div class="text-xs text-slate-500 font-mono truncate">{{ formatEmail(selectedLog.actor_email) }}</div>
                </div>
                <div>
                  <div class="text-[11px] font-black uppercase tracking-wider text-slate-400">Target Subject</div>
                  <div class="font-bold text-slate-900 mt-0.5 text-sm truncate">
                    {{ selectedLog.target_first_name ? `${selectedLog.target_first_name} ${selectedLog.target_last_name}` : 'Self / Global' }}
                  </div>
                  <div class="text-xs text-slate-500 font-mono truncate">{{ formatEmail(selectedLog.target_email) }}</div>
                </div>
              </div>

              <!-- Event Details -->
              <div>
                <label class="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">Activity Narrative</label>
                <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed font-medium">
                  {{ selectedLog.details || 'No additional narrative recorded.' }}
                </div>
              </div>

              <!-- Network Origin & Integrity Status -->
              <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div class="text-xs font-medium text-slate-700">
                  <span class="font-bold text-slate-900">Network IP Origin:</span>
                  <span class="font-mono ml-1 text-slate-800">{{ formatIp(selectedLog.ip_address) }}</span>
                  <span class="block text-[11px] text-slate-500 mt-0.5">Captured for anomaly correlation, brute-force defense, and session validation.</span>
                </div>
                <span class="text-[11px] font-black text-purple-700 uppercase bg-purple-100/80 border border-purple-200 px-2.5 py-1 rounded-lg shrink-0">
                  Append-Only Entry
                </span>
              </div>

              <!-- Security Context & Operational Parameters -->
              <div v-if="selectedLog.metadata">
                <div class="flex items-center justify-between mb-1">
                  <label class="text-[11px] font-black uppercase tracking-wider text-slate-500">Security Context &amp; Operational Parameters</label>
                  <span class="text-[10px] text-emerald-600 font-bold">✓ Credentials Excluded</span>
                </div>
                <pre class="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed break-words whitespace-pre-wrap max-h-36 overflow-y-auto custom-scrollbar">{{ formatMetadata(selectedLog.metadata) }}</pre>
                <p class="text-[11px] text-slate-400 mt-1">
                  Sanitized operational parameters (e.g. attempt counters, lockout timestamps, session identifiers) stored exclusively for automated security rules.
                </p>
              </div>
            </div>

            <div class="pt-2 flex justify-end">
              <button
                @click="closeLogDetails"
                class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-all min-h-[44px] cursor-pointer touch-manipulation"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>

        <!-- Audit Specifications & ICT Defense Guide Modal -->
        <div
          v-if="showSpecsModal"
          class="fixed inset-0 z-[150] overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 pointer-events-auto"
          @click.self="showSpecsModal = false"
        >
          <div class="my-auto bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-5 sm:p-7 animate-scale-up space-y-6 max-h-[calc(100dvh-2rem)] sm:max-h-[90vh] overflow-y-auto custom-scrollbar pointer-events-auto">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100">
              <div class="flex items-center gap-3">
                <div class="p-3 rounded-2xl bg-purple-50 text-purple-700 border border-purple-100 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Audit Trail Architecture &amp; ICT Governance</h3>
                  <p class="text-xs text-slate-500 font-medium mt-0.5">Technical &amp; security justification reference for ICT Division audit reviews.</p>
                </div>
              </div>
              <button
                @click="showSpecsModal = false"
                class="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer touch-manipulation"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Pillars -->
            <div class="space-y-4 text-xs sm:text-sm">
              <!-- Pillar 1: Purpose & Non-Repudiation -->
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div class="flex items-center gap-2 text-slate-900 font-black">
                  <span class="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 font-mono text-xs flex items-center justify-center shrink-0">1</span>
                  <span>Non-Repudiation &amp; Administrative Accountability</span>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed font-medium pl-8">
                  Every security-relevant action (logins, failed passwords, account lockouts, role updates, and deletions) produces an immutable record identifying <strong>who</strong> initiated it, <strong>whom</strong> it affected, and <strong>when</strong> it occurred in Philippine Standard Time (PHT). This ensures administrators cannot modify accounts without a verifiable audit entry.
                </p>
              </div>

              <!-- Pillar 2: Data Minimization & What "Sanitized" Means -->
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div class="flex items-center gap-2 text-slate-900 font-black">
                  <span class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 font-mono text-xs flex items-center justify-center shrink-0">2</span>
                  <span>Data Minimization &amp; Sanitized Telemetry</span>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed font-medium pl-8">
                  <strong>What is Sanitized Telemetry?</strong> "Telemetry" is the operational context captured during an HTTP transaction (client IP address, browser/device string, and event parameters). It is strictly <strong>sanitized</strong> because:
                </p>
                <ul class="text-xs text-slate-600 space-y-1 pl-12 list-disc font-medium">
                  <li><strong>Zero Password Logging:</strong> Neither plaintext nor hashed passwords are ever recorded.</li>
                  <li><strong>Zero Secret/Token Exposure:</strong> Authentication tokens (JWTs), MFA codes, and session secrets are completely excluded from logs.</li>
                  <li><strong>Safe Operational Parameters Only:</strong> Stored metadata is restricted to non-sensitive fields such as failed attempt counters and lockout timestamps.</li>
                  <li><strong>Dynamic PII Masking:</strong> Sensitive identifiers (email addresses, IP octets) are masked on the UI by default to prevent shoulder-surfing during administrative supervision.</li>
                </ul>
              </div>

              <!-- Pillar 3: Brute-Force & Abuse Mitigation -->
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div class="flex items-center gap-2 text-slate-900 font-black">
                  <span class="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 font-mono text-xs flex items-center justify-center shrink-0">3</span>
                  <span>Automated Brute-Force Defense &amp; Lockout Correlation</span>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed font-medium pl-8">
                  The audit trail directly powers institutional brute-force prevention: 5 consecutive failed login attempts automatically trigger a 15-minute account lockout (<code class="font-bold text-amber-800">AUTH_LOCKOUT</code>), mitigating automated password-guessing attacks.
                </p>
              </div>

              <!-- Pillar 4: Session Anomaly Detection -->
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div class="flex items-center gap-2 text-slate-900 font-black">
                  <span class="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-mono text-xs flex items-center justify-center shrink-0">4</span>
                  <span>Session Anomaly &amp; Device Origin Verification</span>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed font-medium pl-8">
                  Device summaries and IP addresses allow the ICT division to verify session provenance. When an anomalous IP or unfamiliar browser accesses an administrative account, security personnel can immediately identify concurrent session takeovers.
                </p>
              </div>

              <!-- Pillar 5: Tamper-Resistant Immutability -->
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div class="flex items-center gap-2 text-slate-900 font-black">
                  <span class="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 font-mono text-xs flex items-center justify-center shrink-0">5</span>
                  <span>Append-Only Immutability Guarantee</span>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed font-medium pl-8">
                  The underlying database table (<code class="font-bold text-slate-800">account_activity_logs</code>) is strictly append-only. There are no update or delete API endpoints exposed in the backend, guaranteeing audit logs cannot be retroactively manipulated or covered up.
                </p>
              </div>
            </div>

            <div class="pt-2 flex justify-end">
              <button
                @click="showSpecsModal = false"
                class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-all min-h-[44px] cursor-pointer touch-manipulation"
              >
                Close Specification
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
import { fetchAccountActivityLogs } from '@/api/superadmin';

const loading = ref(false);
const logs = ref([]);
const selectedLog = ref(null);
const privacyMasked = ref(true);
const showSpecsModal = ref(false);

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
  if (e.key === 'Escape') {
    if (selectedLog.value) closeLogDetails();
    if (showSpecsModal.value) showSpecsModal.value = false;
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

    const response = await fetchAccountActivityLogs(params);
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

/**
 * Safely parse audit log timestamp strings into Date objects.
 * Accurately handles ISO-8601 strings and standard SQL datetime strings
 * originating from the GSO system (Asia/Manila, UTC+8).
 */
const parseAuditTimestamp = (dateStr) => {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return isNaN(dateStr.getTime()) ? null : dateStr;

  const str = String(dateStr).trim();
  if (!str) return null;

  // Case 1: ISO string with explicit timezone indicator (e.g. 'Z', '+08:00', '-05:00')
  if (/[zZ]|[+-]\d{2}:?\d{2}$/.test(str)) {
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  }

  // Case 2: SQL datetime string without timezone (YYYY-MM-DD HH:mm:ss or YYYY-MM-DDTHH:mm:ss)
  // Backend database and application operate in Philippine Standard Time (Asia/Manila, UTC+8)
  const sqlMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (sqlMatch) {
    const [, y, m, d, h, min, s] = sqlMatch;
    const isoString = `${y}-${m}-${d}T${h}:${min}:${s || '00'}+08:00`;
    const parsed = new Date(isoString);
    if (!isNaN(parsed.getTime())) return parsed;
  }

  const fallback = new Date(str);
  return isNaN(fallback.getTime()) ? null : fallback;
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = parseAuditTimestamp(dateStr);
  if (!d || isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString('en-US', {
    timeZone: 'Asia/Manila',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const d = parseAuditTimestamp(dateStr);
  if (!d || isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-US', {
    timeZone: 'Asia/Manila',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const formatFullDateTime = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = parseAuditTimestamp(dateStr);
  if (!d || isNaN(d.getTime())) return String(dateStr);
  return `${d.toLocaleString('en-US', {
    timeZone: 'Asia/Manila',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })} (PHT)`;
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
