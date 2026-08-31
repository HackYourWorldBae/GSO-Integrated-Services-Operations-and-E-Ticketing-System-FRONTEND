<template>
  <MainLayout>
    <template #sidebar-links>
      <DirectorSidebar />
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">TASU Analytics</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Transportation & Automotive Oversight</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in pb-12">
        
        <!-- Key Metrics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-slate-900 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-full uppercase tracking-tighter">Total Requests</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.total || 0 }}</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">All Time Requests</p>
          </div>

          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-amber-50 text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full uppercase tracking-tighter">Pending TO</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.pending || 0 }}</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Tickets Awaiting Approval</p>
          </div>

          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-blue-50 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-tighter">Active Trips</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.processing || 0 }}</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Vehicles Currently on Travel</p>
          </div>

          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-tighter">Completed Trips</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.resolved || 0 }}</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Resolved Vehicle Requests</p>
          </div>
        </div>

        <!-- Fleet Activity Analytics Section (Read-Only) -->
        <div class="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div class="flex items-center gap-3.5">
              <div class="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 shrink-0 shadow-xs">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-black text-slate-900 tracking-tight">Fleet Activity (Trip Frequency)</h3>
                <p class="text-xs text-slate-500 font-medium mt-0.5">Total completed &amp; active trip dispatches recorded per university vehicle unit</p>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 gap-3">
            <div class="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading fleet analytics data...</p>
          </div>

          <!-- Fleet Chart Container -->
          <div v-else class="space-y-6">
            <div class="relative w-full h-[420px] p-2">
              <canvas id="directorFleetActivityChart"></canvas>
            </div>

            <!-- Fleet Summary Footer Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <span class="text-xs font-bold text-slate-500">Tracked Fleet Units</span>
                <span class="text-sm font-black text-slate-900">{{ fleetData.length }} Units</span>
              </div>
              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <span class="text-xs font-bold text-slate-500">Total Recorded Dispatches</span>
                <span class="text-sm font-black text-emerald-600">{{ totalFleetDispatches }} Trips</span>
              </div>
              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <span class="text-xs font-bold text-slate-500">Most Utilized Vehicle</span>
                <span class="text-sm font-black text-blue-600 truncate max-w-[150px]">{{ mostUtilizedVehicleName }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed, nextTick } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import DirectorSidebar from './DirectorSidebar.vue';
import { useTasuVehiclesStore } from '@/stores/tasuVehicles';
import Chart from 'chart.js/auto';
import api from '@/api/client';

const vehiclesStore = useTasuVehiclesStore();
const stats = ref({});
const isLoading = ref(true);
let fleetChartInstance = null;

const fleetData = computed(() => {
  if (stats.value.fleet_activity && stats.value.fleet_activity.length > 0) {
    return stats.value.fleet_activity;
  }
  if (vehiclesStore.vehicles && vehiclesStore.vehicles.length > 0) {
    return vehiclesStore.vehicles.map(v => ({
      id: v.id,
      model_name: v.name,
      plate_no: v.plate,
      category: v.category || 'Vehicle',
      trip_count: 0
    }));
  }
  return [];
});

const totalFleetDispatches = computed(() => {
  return fleetData.value.reduce((acc, item) => acc + (parseInt(item.trip_count) || 0), 0);
});

const mostUtilizedVehicleName = computed(() => {
  if (fleetData.value.length === 0) return 'None';
  const top = [...fleetData.value].sort((a, b) => (parseInt(b.trip_count) || 0) - (parseInt(a.trip_count) || 0))[0];
  if (!top || (parseInt(top.trip_count) || 0) === 0) return top ? top.model_name : 'None';
  return `${top.model_name} (${top.trip_count} trips)`;
});

const renderCharts = () => {
  if (fleetChartInstance) {
    fleetChartInstance.destroy();
    fleetChartInstance = null;
  }

  const canvas = document.getElementById('directorFleetActivityChart');
  if (!canvas || fleetData.value.length === 0) return;

  const labels = fleetData.value.map(item => `${item.model_name} (${item.plate_no})`);
  const counts = fleetData.value.map(item => parseInt(item.trip_count) || 0);

  fleetChartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Trip Dispatches',
          data: counts,
          backgroundColor: '#10b981',
          hoverBackgroundColor: '#059669',
          borderRadius: 8,
          borderSkipped: false,
          maxBarThickness: 45
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#0f172a',
          titleFont: { size: 12, weight: 'bold' },
          bodyFont: { size: 11 },
          padding: 12,
          cornerRadius: 10,
          callbacks: {
            label: function(context) {
              const count = context.parsed.y;
              return ` ${count} ${count === 1 ? 'Dispatch Trip' : 'Dispatch Trips'}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: '#64748b',
            font: { size: 10, weight: 'bold' },
            maxRotation: 45,
            minRotation: 0
          }
        },
        y: {
          beginAtZero: true,
          grid: { color: '#f1f5f9' },
          ticks: {
            color: '#64748b',
            font: { size: 11, weight: 'bold' },
            stepSize: 1,
            precision: 0
          }
        }
      }
    }
  });
};

const fetchStats = async () => {
  isLoading.value = true;
  try {
    const [statsRes] = await Promise.allSettled([
      api.get('tickets/stats/TASU'),
      vehiclesStore.fetchVehicles()
    ]);

    if (statsRes.status === 'fulfilled' && statsRes.value?.data?.data?.stats) {
      stats.value = statsRes.value.data.data.stats;
    }
  } catch (error) {
    console.error('Failed to fetch TASU stats:', error);
  } finally {
    isLoading.value = false;
    await nextTick();
    renderCharts();
  }
};

onMounted(() => {
  fetchStats();
});

onUnmounted(() => {
  if (fleetChartInstance) {
    fleetChartInstance.destroy();
    fleetChartInstance = null;
  }
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
