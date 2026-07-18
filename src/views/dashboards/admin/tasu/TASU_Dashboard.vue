<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/admin/tasu" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        <span class="text">TASU Home</span>
      </router-link>
      <router-link to="/admin/tasu/vehicles" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
        <span class="text">Vehicle Management</span>
      </router-link>
      <router-link to="/admin/tasu/queues" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span class="text">Ticket Queues</span>
      </router-link>
      <router-link to="/admin/tasu/personnel" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span class="text">Personnel Management</span>
      </router-link>
      <router-link to="/admin/tasu/dispatch" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="text">Dispatch Board</span>
      </router-link>
      <div class="mt-8 mb-4 px-4">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Archived Tickets</p>
      </div>
      <router-link to="/admin/tasu/archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span class="text">Archives</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">TASU Dashboard</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Transportation & Automotive Control</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in pb-12">
        
        <!-- Key Metrics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
              </div>
              <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-tighter">Ready Fleet</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ availableVehiclesCount }}/{{ totalVehiclesCount }}</h3>
            <div class="mt-2 flex items-center gap-1">
              <span class="text-xs font-bold text-emerald-600">{{ availabilityRate }}%</span>
              <span class="text-[10px] text-slate-400 font-medium italic">Availability rate</span>
            </div>
          </div>

          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-amber-50 text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full uppercase tracking-tighter">Pending TO</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">08</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Travel Orders Awaiting VP</p>
          </div>

          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-blue-50 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-tighter">Active Trips</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ activeTripsCount }}</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Trip Tickets Issued & Scheduled</p>
          </div>

          <div class="group p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl bg-slate-900 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span class="text-[10px] font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-full uppercase tracking-tighter">Weekly Fuel</span>
            </div>
            <h3 class="text-3xl font-black text-slate-900 tabular-nums">₱24.5k</h3>
            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Operational Cost</p>
          </div>
        </div>

        <!-- Fleet Logistics Insights -->
        <div class="p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl relative overflow-hidden">
          <div class="absolute top-0 right-0 p-8 opacity-10">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="max-w-xl">
              <h3 class="text-2xl font-black tracking-tight mb-2">Fleet Logistics Briefing</h3>
              <p class="text-slate-300 text-sm font-medium leading-relaxed italic">"Official Business" travel accounts for 75% of trips this week. "Van SAC 1399" has reached the recommended mileage for maintenance. Currently, 3 booking requests are awaiting VP approval before Travel Orders can be issued.</p>
            </div>
            <div class="flex gap-3">
              <div class="px-6 py-4 rounded-2xl bg-emerald-500/20 backdrop-blur-md border border-emerald-500/20 flex flex-col items-center">
                <span class="text-emerald-400 font-black text-xl italic">75%</span>
                <span class="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">Utilization</span>
              </div>
              <div class="px-6 py-3 rounded-2xl bg-white text-slate-900 shadow-lg flex flex-col items-center justify-center">
                <span class="text-xs font-black uppercase tracking-widest leading-none mb-1">Alert</span>
                <span class="text-[8px] font-bold opacity-80 italic uppercase text-rose-600">Maintenance</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <!-- Booking Pipeline -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col h-[400px]">
            <h4 class="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 italic">
              <div class="w-2 h-6 bg-amber-500 rounded-full"></div>
              Booking Lifecycle Pipeline
            </h4>
            <div class="flex-1 relative">
              <canvas id="bookingPipelineChart"></canvas>
            </div>
          </div>

          <!-- Travel Purpose Distribution -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col min-h-[350px] lg:h-[400px]">
            <h4 class="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 italic">
              <div class="w-2 h-6 bg-emerald-500 rounded-full"></div>
              Authorized Travel Intent
            </h4>
            <div class="flex-1 relative">
              <canvas id="travelPurposeDoughnut"></canvas>
            </div>
          </div>

          <!-- Fleet Usage Heatmap -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col h-[350px]">
            <h4 class="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 italic">
              <div class="w-2 h-6 bg-blue-500 rounded-full"></div>
              Fleet Activity (Trip Frequency)
            </h4>
            <div class="flex-1 relative">
              <canvas id="fleetActivityChart"></canvas>
            </div>
          </div>

          <!-- Fuel Consumption Trends -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col h-[350px]">
            <h4 class="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 italic">
              <div class="w-2 h-6 bg-slate-900 rounded-full"></div>
              Fuel Performance (Liters Used)
            </h4>
            <div class="flex-1 relative">
              <canvas id="fuelTrendChart"></canvas>
            </div>
          </div>

          <!-- Service Request Frequency -->
          <div class="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col lg:col-span-2">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-8">
              <h4 class="text-lg font-black text-slate-900 flex items-center gap-2 italic">
                <div class="w-2 h-6 bg-blue-500 rounded-full"></div>
                Service Request Frequency
              </h4>
              <div class="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                <button
                  v-for="filter in tasuPeriodFilters"
                  :key="filter.key"
                  @click="setTasuPeriod(filter.key)"
                  :class="[
                    'px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all',
                    tasuActivePeriod === filter.key
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  ]"
                >
                  {{ filter.label }}
                </button>
              </div>
            </div>
            <div class="relative h-64">
              <canvas id="tasuServiceFreqChart"></canvas>
            </div>
          </div>

        </div>

      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import Chart from 'chart.js/auto';
import { useTasuVehiclesStore } from '@/stores/tasuVehicles';

const vehiclesStore = useTasuVehiclesStore();
const totalVehiclesCount = computed(() => vehiclesStore.vehicles.length);
const availableVehiclesCount = computed(() => vehiclesStore.vehicles.filter(v => v.status === 'Available').length);
const availabilityRate = computed(() => totalVehiclesCount.value ? Math.round((availableVehiclesCount.value / totalVehiclesCount.value) * 100) : 0);
const activeTripsCount = computed(() => vehiclesStore.bookings.filter(b => b.status === 'In Progress' || b.status === 'Scheduled').length);

const tasuActivePeriod = ref('Month');

const tasuPeriodFilters = [
  { key: 'Day',   label: 'This Day' },
  { key: 'Week',  label: 'This Week' },
  { key: 'Month', label: 'This Month' },
  { key: 'Year',  label: 'This Year' }
];

// Total service request counts per period for TASU services
const tasuServiceFreqData = {
  Day: {
    labels: ['Vehicle Booking', 'Travel Order Request', 'Trip Ticket Issuance', 'Driver Deployment', 'Fuel Request', 'Vehicle Maintenance'],
    data:   [5, 4, 3, 3, 2, 1]
  },
  Week: {
    labels: ['Vehicle Booking', 'Travel Order Request', 'Trip Ticket Issuance', 'Driver Deployment', 'Fuel Request', 'Vehicle Maintenance'],
    data:   [31, 25, 20, 18, 12, 5]
  },
  Month: {
    labels: ['Vehicle Booking', 'Travel Order Request', 'Trip Ticket Issuance', 'Driver Deployment', 'Fuel Request', 'Vehicle Maintenance'],
    data:   [98, 72, 65, 58, 34, 12]
  },
  Year: {
    labels: ['Vehicle Booking', 'Travel Order Request', 'Trip Ticket Issuance', 'Driver Deployment', 'Fuel Request', 'Vehicle Maintenance'],
    data:   [1150, 840, 760, 680, 400, 145]
  }
};

let tasuServiceFreqChart = null;

function setTasuPeriod(period) {
  tasuActivePeriod.value = period;
  const { labels, data } = tasuServiceFreqData[period];
  tasuServiceFreqChart.data.labels = labels;
  tasuServiceFreqChart.data.datasets[0].data = data;
  tasuServiceFreqChart.update();
}

onMounted(() => {
  // 1. Booking Pipeline Chart
  const pipelineCtx = document.getElementById('bookingPipelineChart');
  new Chart(pipelineCtx, {
    type: 'bar',
    data: {
      labels: ['Requests Submitted', 'Travel Orders Issued', 'Trip Tickets Ready'],
      datasets: [{
        label: 'Current Monthly Volume',
        data: [45, 32, 28],
        backgroundColor: ['#f59e0b', '#10b981', '#3b82f6'],
        borderRadius: 8
      }]
    },
    options: {
      indexAxis: 'y',
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { weight: '700' } } },
        y: { ticks: { font: { weight: '900', size: 10 } } }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });

  // 2. Travel Purpose Doughnut
  const purposeCtx = document.getElementById('travelPurposeDoughnut');
  new Chart(purposeCtx, {
    type: 'doughnut',
    data: {
      labels: ['Official Business', 'Official Time', 'Emergency/Others'],
      datasets: [{
        data: [75, 15, 10],
        backgroundColor: ['#10b981', '#3b82f6', '#94a3b8'],
        hoverOffset: 15,
        borderRadius: 10,
        borderWidth: 4,
        borderColor: '#ffffff'
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom', labels: { font: { weight: '700', size: 10 }, padding: 15 } }
      },
      cutout: '65%',
      responsive: true,
      maintainAspectRatio: false
    }
  });

  // 3. Fleet Activity Bar
  const fleetCtx = document.getElementById('fleetActivityChart');
  new Chart(fleetCtx, {
    type: 'bar',
    data: {
      labels: ['Van SAC 1399', 'SUV BSU 202', 'Bus TRANS 01', 'Van SAC 1400', 'Pickup GSO 55'],
      datasets: [{
        label: 'Trips Completed',
        data: [15, 12, 5, 10, 8],
        backgroundColor: '#3b82f6',
        borderRadius: 6
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { weight: '700', size: 9 } } },
        y: { ticks: { font: { weight: '700' } } }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });

  // 4. Fuel Trend Line
  const fuelCtx = document.getElementById('fuelTrendChart');
  new Chart(fuelCtx, {
    type: 'line',
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{
        label: 'Gasoline (L)',
        data: [250, 310, 280, 350],
        borderColor: '#0f172a',
        backgroundColor: 'rgba(15, 23, 42, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 3
      }, {
        label: 'Diesel (L)',
        data: [420, 390, 450, 410],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 3
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom', labels: { font: { weight: '700' } } }
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { borderDash: [5, 5] }, ticks: { font: { weight: '700' } } }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });

  // 5. Service Request Frequency Chart
  const freqCtx = document.getElementById('tasuServiceFreqChart');
  const initFreq = tasuServiceFreqData[tasuActivePeriod.value];
  tasuServiceFreqChart = new Chart(freqCtx, {
    type: 'bar',
    data: {
      labels: initFreq.labels,
      datasets: [{
        label: 'Requests',
        data: initFreq.data,
        backgroundColor: [
          '#3b82f6', '#60a5fa', '#93c5fd',
          '#bfdbfe', '#2563eb', '#1d4ed8'
        ],
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { weight: '700', size: 9 } } },
        y: {
          grid: { borderDash: [4, 4], color: '#f1f5f9' },
          ticks: { font: { weight: '700' } }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });
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

