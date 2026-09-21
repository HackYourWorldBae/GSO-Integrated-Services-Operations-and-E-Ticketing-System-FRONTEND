<template>
  <MainLayout>
    <template #header-title>
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none">System Audit Trail & Operations Logs</h2>
          <span class="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-wider border border-purple-200">
            {{ pagination.total }} Events
          </span>
        </div>
        <p class="text-xs font-medium text-slate-500 hidden sm:block mt-0.5">Immutable chronological record of all ticket actions, dispatches, cancellations, and status changes</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-6 animate-fade-in relative pb-12">


        <!-- Controls & Search Bar -->
        <div class="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          <!-- Search input -->
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
              placeholder="Search by ticket ID, actor name, action..."
              class="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all min-h-[44px]"
            />
            <button
              v-if="filters.search"
              @click="filters.search = ''; fetchLogs()"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 shrink-0">
            <button
              @click="fetchLogs"
              :disabled="loading"
              class="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all flex items-center justify-center disabled:opacity-50 min-h-[44px] min-w-[44px] cursor-pointer touch-manipulation"
              title="Refresh Audit Logs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{ 'animate-spin': loading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              @click="exportToCSV"
              :disabled="loading || logs.length === 0"
              class="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px] cursor-pointer touch-manipulation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <!-- Logs Table Card (Desktop) & Mobile Card Stack -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <!-- Desktop Table (md and up) -->
          <div class="hidden md:block overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200">
                  <th class="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500">Timestamp</th>
                  <th class="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500">Actor / Initiator</th>
                  <th class="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500">Ticket Reference</th>
                  <th class="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500">Action Type</th>
                  <th class="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500">Activity Details</th>
                  <th class="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500 text-right">View</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <!-- Loading State -->
                <tr v-if="loading && logs.length === 0">
                  <td colspan="6" class="py-16 text-center">
                    <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-xs font-semibold">
                      <svg class="animate-spin h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading audit records...
                    </div>
                  </td>
                </tr>

                <!-- Empty State -->
                <tr v-else-if="logs.length === 0">
                  <td colspan="6" class="py-16 text-center">
                    <div class="max-w-sm mx-auto flex flex-col items-center">
                      <div class="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p class="text-sm font-bold text-slate-700">No audit events found</p>
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
                    <div class="text-xs font-bold text-slate-800">{{ formatDate(log.created_at) }}</div>
                    <div class="text-[11px] font-medium text-slate-400">{{ formatTime(log.created_at) }}</div>
                  </td>

                  <!-- Actor -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div v-if="log.first_name || log.last_name" class="flex items-center gap-2.5">
                      <div class="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                        {{ getInitials(log.first_name, log.last_name) }}
                      </div>
                      <div>
                        <div class="text-xs font-bold text-slate-800 leading-tight">
                          {{ log.first_name }} {{ log.last_name }}
                        </div>
                        <div class="text-[10px] font-medium text-slate-400">
                          {{ log.email }}
                        </div>
                      </div>
                    </div>
                    <div v-else class="text-xs font-medium text-slate-400 italic">
                      System Automation
                    </div>
                  </td>

                  <!-- Ticket Reference -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span v-if="log.ticket_id" class="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                      #{{ log.ticket_id }}
                    </span>
                    <span v-else class="text-slate-400 text-xs">—</span>
                    <div v-if="log.college_building" class="text-[10px] text-slate-400 mt-0.5 truncate max-w-[150px]">
                      {{ log.college_building }}
                    </div>
                  </td>

                  <!-- Action Type -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border"
                      :class="getActionBadgeClass(log.action)"
                    >
                      {{ formatActionName(log.action) }}
                    </span>
                  </td>

                  <!-- Activity Details -->
                  <td class="px-6 py-4">
                    <div class="text-xs text-slate-600 font-medium line-clamp-1 max-w-md">
                      {{ log.details || 'No additional details logged' }}
                    </div>
                  </td>

                  <!-- Detail Action -->
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      @click.stop="openLogDetails(log)"
                      class="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                      title="Inspect Log Entry"
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
            <!-- Mobile Loading -->
            <div v-if="loading && logs.length === 0" class="py-12 text-center">
              <div class="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-xs font-semibold">
                <svg class="animate-spin h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading audit records...</span>
              </div>
            </div>

            <!-- Mobile Empty State -->
            <div v-else-if="logs.length === 0" class="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl">
              <div class="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 mx-auto mb-3 shadow-xs">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p class="text-sm font-bold text-slate-700">No audit events found</p>
              <p class="text-xs text-slate-400 mt-1">Try modifying your search criteria or resetting filters.</p>
            </div>

            <!-- Mobile Cards -->
            <div
              v-for="log in logs"
              :key="'mob-' + log.id"
              class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 hover:border-purple-300 transition-all"
            >
              <!-- Card Top: Action & Timestamp -->
              <div class="flex items-center justify-between gap-2 flex-wrap">
                <span
                  class="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border"
                  :class="getActionBadgeClass(log.action)"
                >
                  {{ formatActionName(log.action) }}
                </span>
                <span class="text-[10px] text-slate-500 font-semibold">
                  {{ formatDate(log.created_at) }} • {{ formatTime(log.created_at) }}
                </span>
              </div>

              <!-- Card Body: Actor & Ticket -->
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-2.5 min-w-0">
                  <div class="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs">
                    {{ getInitials(log.first_name, log.last_name) }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-bold text-slate-900 truncate">
                      {{ log.first_name ? `${log.first_name} ${log.last_name}` : 'System Automation' }}
                    </p>
                    <p class="text-[10px] text-slate-400 truncate">{{ log.email || 'Automated Task' }}</p>
                  </div>
                </div>

                <span v-if="log.ticket_id" class="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 shrink-0">
                  #{{ log.ticket_id }}
                </span>
              </div>

              <!-- Activity Details Text -->
              <p v-if="log.details" class="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2 bg-white p-2.5 rounded-xl border border-slate-200/70">
                {{ log.details }}
              </p>

              <!-- Card Action: Inspect Button -->
              <button
                type="button"
                @click="openLogDetails(log)"
                class="w-full py-2 px-3 rounded-xl bg-white hover:bg-purple-50 text-purple-700 hover:text-purple-800 border border-slate-200 hover:border-purple-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 min-h-[40px] touch-manipulation cursor-pointer shadow-2xs"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>View Full Details</span>
              </button>
            </div>
          </div>

          <!-- Pagination Footer -->
          <div class="px-4 sm:px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <span class="text-xs text-slate-500 font-medium">
                Showing <strong class="text-slate-800">{{ Math.min(pagination.total, pagination.offset + 1) }}</strong> to
                <strong class="text-slate-800">{{ Math.min(pagination.total, pagination.offset + pagination.limit) }}</strong> of
                <strong class="text-slate-800">{{ pagination.total }}</strong>
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
                class="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all min-h-[40px] touch-manipulation cursor-pointer"
              >
                Previous
              </button>
              <div class="px-3 py-1.5 text-xs font-bold text-slate-600">
                {{ currentPage }} / {{ totalPages }}
              </div>
              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage >= totalPages || loading"
                class="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all min-h-[40px] touch-manipulation cursor-pointer"
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
          <div class="my-auto bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-5 sm:p-6 animate-scale-up space-y-5 max-h-[calc(100dvh-2rem)] sm:max-h-[88vh] overflow-y-auto custom-scrollbar pointer-events-auto">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100">
              <div class="flex items-center gap-2.5">
                <div class="p-2.5 rounded-xl bg-purple-50 text-purple-600 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-base font-black text-slate-900">Audit Log Details</h3>
                  <p class="text-xs text-slate-400 font-semibold">Entry #{{ selectedLog.id }}</p>
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
                  <div class="text-[10px] font-black uppercase tracking-wider text-slate-400">Ticket ID</div>
                  <div class="font-mono font-bold text-purple-700 mt-0.5">{{ selectedLog.ticket_id ? `#${selectedLog.ticket_id}` : '—' }}</div>
                </div>
                <div>
                  <div class="text-[10px] font-black uppercase tracking-wider text-slate-400">Actor</div>
                  <div class="font-semibold text-slate-800 mt-0.5 truncate">
                    {{ selectedLog.first_name ? `${selectedLog.first_name} ${selectedLog.last_name}` : 'System Automation' }}
                  </div>
                </div>
                <div>
                  <div class="text-[10px] font-black uppercase tracking-wider text-slate-400">Action</div>
                  <div class="mt-0.5">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold border" :class="getActionBadgeClass(selectedLog.action)">
                      {{ selectedLog.action }}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Details & Payload</label>
                <div class="p-3.5 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[11px] leading-relaxed break-words whitespace-pre-wrap max-h-48 overflow-y-auto custom-scrollbar">
                  {{ selectedLog.details || 'No details recorded.' }}
                </div>
              </div>

              <div v-if="selectedLog.location || selectedLog.college_building" class="p-3 rounded-xl bg-purple-50/50 border border-purple-100 text-purple-900 text-xs font-medium">
                <span class="font-bold">Location Context:</span> {{ selectedLog.location || selectedLog.college_building }}<span v-if="selectedLog.office_room"> ({{ selectedLog.office_room }})</span>
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
import { fetchAuditLogs } from '@/api/superadmin';
import { parseDateLocal } from '@/utils/workCalendar';

const loading = ref(false);
const logs = ref([]);
const selectedLog = ref(null);

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
    if (filters.value.search) {
      params.search = filters.value.search;
    }

    const response = await fetchAuditLogs(params);
    const payload = response.data?.data || response.data;
    if (payload && (payload.logs !== undefined || response.data?.status === true || response.data?.status === 'success')) {
      logs.value = payload.logs || response.data?.logs || [];
      pagination.value.total = payload.total ?? response.data?.total ?? logs.value.length;
    }
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = parseDateLocal(dateStr);
  if (!d || isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const d = parseDateLocal(dateStr);
  if (!d || isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const formatFullDateTime = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = parseDateLocal(dateStr);
  if (!d || isNaN(d.getTime())) return String(dateStr);
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

const formatActionName = (action) => {
  if (!action) return 'Action';
  return action.replace(/_/g, ' ');
};

const getActionBadgeClass = (action) => {
  if (!action) return 'bg-slate-100 text-slate-700 border-slate-200';
  const act = action.toLowerCase();
  if (act.includes('create') || act.includes('submit')) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
  if (act.includes('dispatch') || act.includes('assign')) {
    return 'bg-blue-50 text-blue-700 border-blue-200';
  }
  if (act.includes('cancel') || act.includes('reject') || act.includes('delete')) {
    return 'bg-rose-50 text-rose-700 border-rose-200';
  }
  if (act.includes('complete') || act.includes('resolve') || act.includes('finish')) {
    return 'bg-purple-50 text-purple-700 border-purple-200';
  }
  if (act.includes('status') || act.includes('update')) {
    return 'bg-amber-50 text-amber-700 border-amber-200';
  }
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

const exportToCSV = () => {
  if (!logs.value || logs.value.length === 0) return;
  const headers = ['ID', 'Timestamp', 'Actor Name', 'Actor Email', 'Ticket ID', 'Action', 'Details'];
  const rows = logs.value.map(log => [
    log.id,
    log.created_at,
    log.first_name ? `"${log.first_name} ${log.last_name}"` : '"System"',
    log.email ? `"${log.email}"` : '""',
    `"${log.ticket_id}"`,
    `"${log.action}"`,
    `"${(log.details || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `gso_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
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
