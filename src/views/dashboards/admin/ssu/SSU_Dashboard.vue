<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/admin/ssu" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span class="text">SSU Home</span>
      </router-link>

      <router-link to="/admin/ssu/queues/incidents" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span class="text">Incident Ticket Queues</span>
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
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">SSU Dashboard</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Security Services Unit Control</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in pb-12">
        
        <!-- Outcome & Throughput Overview (Top 3 Cards + Timeframe Filter) -->
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
            <div>
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <span class="w-2 h-4 rounded-full bg-slate-900"></span>
                Throughput &amp; Incident Volume Analytics
              </h3>
              <p class="text-[11px] text-slate-400 font-medium">Outcome metrics filtered by timeframe for {{ currentYear }}</p>
            </div>

            <!-- Filter Controls for Current Year -->
            <div class="flex flex-wrap items-center gap-2">
              <!-- Period Type Tabs -->
              <div class="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 shadow-inner">
                <button
                  v-for="p in periodOptions"
                  :key="p.key"
                  @click="changePeriod(p.key)"
                  class="px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer"
                  :class="selectedPeriod === p.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'"
                >
                  {{ p.label }}
                </button>
              </div>

              <!-- Month Selector (shown when selectedPeriod === 'month') -->
              <div v-if="selectedPeriod === 'month'" class="relative">
                <select
                  v-model="selectedMonth"
                  @change="fetchStats"
                  class="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm cursor-pointer"
                >
                  <option v-for="m in monthOptions" :key="m.value" :value="m.value">
                    {{ m.label }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              <!-- Quarter Selector (shown when selectedPeriod === 'quarter') -->
              <div v-if="selectedPeriod === 'quarter'" class="relative">
                <select
                  v-model="selectedQuarter"
                  @change="fetchStats"
                  class="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm cursor-pointer"
                >
                  <option v-for="q in quarterOptions" :key="q.value" :value="q.value">
                    {{ q.label }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Top 3 Cards Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <!-- 1. Total Requests -->
            <div 
              @click="router.push('/admin/ssu/queues/incidents')"
              class="group p-5 sm:p-6 rounded-[2rem] bg-white border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between"
            >
              <div class="flex items-center justify-between gap-2 mb-4">
                <div class="p-3 rounded-2xl bg-slate-900 text-white shrink-0 group-hover:scale-105 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span class="text-[10px] font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-tight shrink-0 whitespace-nowrap">
                  {{ stats.filter?.label || 'All Time' }}
                </span>
              </div>
              <div>
                <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.total || 0 }}</h3>
                <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Total Reports</p>
              </div>
            </div>

            <!-- 2. Resolved Reports -->
            <div 
              @click="router.push('/admin/ssu/archives')"
              class="group p-5 sm:p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between"
            >
              <div class="flex items-center justify-between gap-2 mb-4">
                <div class="p-3 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0 group-hover:scale-105 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-tight shrink-0 whitespace-nowrap">Completed</span>
              </div>
              <div>
                <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.resolved || 0 }}</h3>
                <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Resolved Reports</p>
              </div>
            </div>

            <!-- 3. Declined Reports -->
            <div 
              @click="router.push('/admin/ssu/archives')" 
              class="group p-5 sm:p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between"
            >
              <div class="flex items-center justify-between gap-2 mb-4">
                <div class="p-3 rounded-2xl bg-rose-50 text-rose-600 group-hover:scale-110 transition-transform shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                </div>
                <span class="text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full uppercase tracking-tight shrink-0 whitespace-nowrap">Declined</span>
              </div>
              <div>
                <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.declined || 0 }}</h3>
                <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Declined Reports</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Live Operations & Queue Status (Bottom 3 Cards) -->
        <div class="space-y-4">
          <div class="flex items-center justify-between px-1">
            <div>
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <span class="w-2 h-4 rounded-full bg-rose-600"></span>
                Active Operations &amp; Workload
              </h3>
              <p class="text-[11px] text-slate-400 font-medium">Real-time incident response and security pipeline</p>
            </div>
            <span class="text-[10px] font-black text-rose-700 bg-rose-50 border border-rose-200/60 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
              Live Pipeline
            </span>
          </div>

          <!-- Bottom 3 Cards Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <!-- 1. Pending Review -->
            <div 
              @click="router.push('/admin/ssu/queues/incidents')"
              class="group p-5 sm:p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between"
            >
              <div class="flex items-center justify-between gap-2 mb-4">
                <div class="p-3 rounded-2xl bg-amber-50 text-amber-600 shrink-0 group-hover:scale-105 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full uppercase tracking-tight shrink-0 whitespace-nowrap">Pending</span>
              </div>
              <div>
                <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.pending || 0 }}</h3>
                <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Awaiting Review</p>
              </div>
            </div>

            <!-- 2. Under Investigation (Processing) -->
            <div 
              @click="router.push('/admin/ssu/queues/incidents')"
              class="group p-5 sm:p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between"
            >
              <div class="flex items-center justify-between gap-2 mb-4">
                <div class="p-3 rounded-2xl bg-blue-50 text-blue-600 shrink-0 group-hover:scale-105 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-tight shrink-0 whitespace-nowrap">Processing</span>
              </div>
              <div>
                <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.processing || 0 }}</h3>
                <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Under Investigation</p>
              </div>
            </div>

            <!-- 3. Active Cases (Work In Progress) -->
            <div 
              @click="router.push('/admin/ssu/queues/incidents')"
              class="group p-5 sm:p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between"
            >
              <div class="flex items-center justify-between gap-2 mb-4">
                <div class="p-3 rounded-2xl bg-emerald-100 text-emerald-700 shrink-0 group-hover:scale-105 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <span class="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full uppercase tracking-tight shrink-0 whitespace-nowrap">Active</span>
              </div>
              <div>
                <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.active_working || stats.processing || 0 }}</h3>
                <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Active Security Response</p>
              </div>
            </div>
          </div>
        </div>


        <!-- Main Charts Grid -->
        <div class="grid grid-cols-1 gap-8">
          
          <!-- Incident Distribution -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col min-h-[350px] lg:h-[400px]">
            <h4 class="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 italic">
              <div class="w-2 h-6 bg-rose-500 rounded-full"></div>
              Incident Heatmap (By Category)
            </h4>
            <div class="flex-1 relative">
              <canvas id="incidentDoughnut"></canvas>
            </div>
          </div>

        </div>

      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { onMounted, onUnmounted, ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import Chart from 'chart.js/auto';
import api from '@/api/client';

const router = useRouter();
const stats = ref({});

const ssuActivePeriod = ref('Month');
const ssuPeriodFilters = [
  { key: 'Day',   label: 'This Day' },
  { key: 'Week',  label: 'This Week' },
  { key: 'Month', label: 'This Month' },
  { key: 'Year',  label: 'This Year' }
];


let charts = [];

function setSsuPeriod(period) {
  ssuActivePeriod.value = period;
  if (ssuServiceFreqChart && stats.value.service_freq) {
    const data = stats.value.service_freq[period] || [];
    ssuServiceFreqChart.data.labels = data.map(d => d.service_type);
    ssuServiceFreqChart.data.datasets[0].data = data.map(d => parseInt(d.count));
    
  }
}

const renderCharts = () => {
  // Destroy existing charts to prevent memory leaks if re-rendered
  charts.forEach(c => c.destroy());
  charts = [];

  const safeVal = (val) => parseFloat(val) || 0;

  const formatReason = (code) => {
    if (!code) return 'None';
    const map = {
      personnelAbsent: "Personnel Absent",
      extendedBreak: "Extended Break Period",
      additionalWork: "Additional Work",
      lackWorkingDays: "Lack of Working Days",
      lackMaterials: "Lack of Materials / Tools",
      lackSkills: "Lack of Skills"
    };
    return map[code] || code.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  // 1. Incident Heatmap Doughnut
  const incidentCtx = document.getElementById('incidentDoughnut');
  if (incidentCtx && stats.value.incident_heatmap) {
    const data = stats.value.incident_heatmap;
    charts.push(new Chart(incidentCtx, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.category),
        datasets: [{
          data: data.map(d => parseInt(d.count)),
          backgroundColor: ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'],
          hoverOffset: 15, borderRadius: 10, borderWidth: 4, borderColor: '#ffffff'
        }]
      },
      options: {
        plugins: { legend: { position: 'bottom' } },
        cutout: '65%', responsive: true, maintainAspectRatio: false
      }
    }));
  }
};

const currentYear = new Date().getFullYear();
const selectedPeriod = ref('all');
const selectedMonth = ref(new Date().getMonth() + 1);
const selectedQuarter = ref(Math.ceil((new Date().getMonth() + 1) / 3));

const periodOptions = [
  { key: 'all', label: 'All Time' },
  { key: 'year', label: `Annually (${currentYear})` },
  { key: 'quarter', label: 'Quarterly' },
  { key: 'month', label: 'Monthly' }
];

const quarterOptions = [
  { value: 1, label: 'Q1 (Jan - Mar)' },
  { value: 2, label: 'Q2 (Apr - Jun)' },
  { value: 3, label: 'Q3 (Jul - Sep)' },
  { value: 4, label: 'Q4 (Oct - Dec)' }
];

const monthOptions = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
];

const changePeriod = (key) => {
  selectedPeriod.value = key;
  fetchStats();
};

const fetchStats = async () => {
  try {
    const params = {
      period: selectedPeriod.value,
      year: currentYear
    };
    if (selectedPeriod.value === 'quarter') {
      params.quarter = selectedQuarter.value;
    } else if (selectedPeriod.value === 'month') {
      params.month = selectedMonth.value;
    }

    const response = await api.get('tickets/stats/SSU', { params });
    if (response.data?.data?.stats) {
      stats.value = response.data.data.stats;
      nextTick(() => {
        renderCharts();
      });
    }
  } catch (error) {
    console.error('Failed to fetch SSU stats:', error);
  }
};

onMounted(() => {
  fetchStats();
});

onUnmounted(() => {
  charts.forEach(c => c.destroy());
  charts = [];
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

</style>

