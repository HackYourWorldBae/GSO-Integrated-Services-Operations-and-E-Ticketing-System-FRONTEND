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
        <div class="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
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
              placeholder="Search by ticket ID, actor name, action, or details..."
              class="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all"
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
              class="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all flex items-center justify-center disabled:opacity-50"
              title="Refresh Audit Logs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{ 'animate-spin': loading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              @click="exportToCSV"
              :disabled="loading || logs.length === 0"
              class="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <!-- Logs Table Card -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
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
                  @click="selectedLog = log"
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
                    <span class="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                      {{ log.ticket_id }}
                    </span>
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
                      @click.stop="selectedLog = log"
                      class="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
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

          <!-- Pagination Footer -->
          <div class="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <span class="text-xs text-slate-500 font-medium">
                Showing <strong class="text-slate-800">{{ Math.min(pagination.total, pagination.offset + 1) }}</strong> to
                <strong class="text-slate-800">{{ Math.min(pagination.total, pagination.offset + pagination.limit) }}</strong> of
                <strong class="text-slate-800">{{ pagination.total }}</strong> logs
              </span>
              <select
                v-model="pagination.limit"
                @change="handleLimitChange"
                class="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none focus:border-purple-500"
              >
                <option :value="15">15 per page</option>
                <option :value="25">25 per page</option>
                <option :value="50">50 per page</option>
                <option :value="100">100 per page</option>
              </select>
            </div>

            <div class="flex items-center gap-1.5">
              <button
                @click="changePage(currentPage - 1)"
                :disabled="currentPage <= 1 || loading"
                class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <div class="px-3 py-1.5 text-xs font-bold text-slate-600">
                Page {{ currentPage }} of {{ totalPages }}
              </div>
              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage >= totalPages || loading"
                class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- Detail Modal -->
      <div
        v-if="selectedLog"
        class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        @click.self="selectedLog = null"
      >
        <div class="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-scale-up space-y-5">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <div class="p-2 rounded-xl bg-purple-50 text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-base font-bold text-slate-900">Audit Log Details</h3>
                <p class="text-xs text-slate-400">Entry #{{ selectedLog.id }}</p>
              </div>
            </div>
            <button
              @click="selectedLog = null"
              class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
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
                <div class="font-mono font-bold text-purple-700 mt-0.5">{{ selectedLog.ticket_id }}</div>
              </div>
              <div>
                <div class="text-[10px] font-black uppercase tracking-wider text-slate-400">Actor</div>
                <div class="font-semibold text-slate-800 mt-0.5">
                  {{ selectedLog.first_name ? `${selectedLog.first_name} ${selectedLog.last_name}` : 'System' }}
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
              <div class="p-3.5 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[11px] leading-relaxed break-words whitespace-pre-wrap max-h-48 overflow-y-auto">
                {{ selectedLog.details || 'No details recorded.' }}
              </div>
            </div>

            <div v-if="selectedLog.location || selectedLog.college_building" class="p-3 rounded-xl bg-purple-50/50 border border-purple-100 text-purple-900 text-xs">
              <span class="font-bold">Location Context:</span> {{ selectedLog.location || selectedLog.college_building }}<span v-if="selectedLog.office_room"> ({{ selectedLog.office_room }})</span>
            </div>
          </div>

          <div class="pt-2 flex justify-end">
            <button
              @click="selectedLog = null"
              class="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import api from '@/api/client';

const loading = ref(false);
const logs = ref([]);
const selectedLog = ref(null);

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

    const response = await api.get('/superadmin/audit-logs', { params });
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
  fetchLogs();
});
</script>
