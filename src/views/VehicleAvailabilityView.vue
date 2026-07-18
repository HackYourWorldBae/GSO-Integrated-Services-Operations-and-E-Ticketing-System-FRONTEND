<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// --- STATE ---
const selectedVehicle = ref(null);
const selectionStart = ref(null);
const selectionEnd = ref(null);
const activeBooking = ref(null); // Detailed info for a booked date
const isMultiDateEnabled = ref(false);
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());

const vehicles = [
  {
    id: 1,
    name: "Mitsubishi L300 Van (SFS 625)",
    type: "Van / Small Capacity",
    capacity: "10-12 Passengers",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Mitsubishi_L300_2.5_Diesel_2010.jpg/800px-Mitsubishi_L300_2.5_Diesel_2010.jpg",
    bookings: [
      { id: 10, start: 10, end: 12, user: "Engr. Dela Cruz", purpose: "Site Inspection at Alangilan Campus" },
      { id: 11, start: 18, end: 18, user: "Prof. Mercado", purpose: "Field Research Transportation" }
    ]
  },
  {
    id: 2,
    name: "Toyota Hilux 4X4 E (SAC 2710)",
    type: "Pickup / Utility",
    capacity: "5 Passengers",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/2019_Toyota_Hilux_Invincible_D-4d_4WD_2.4_Front.jpg/800px-2019_Toyota_Hilux_Invincible_D-4d_4WD_2.4_Front.jpg",
    bookings: [
      { id: 20, start: 15, end: 16, user: "Mr. Reyes", purpose: "Equipment Delivery" }
    ]
  },
  {
    id: 3,
    name: "Yutong Bus (SAB 5997)",
    type: "Coach / Large Capacity",
    capacity: "50-60 Passengers",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Yutong_ZK6122H9_coach_in_Changchun.jpg/800px-Yutong_ZK6122H9_coach_in_Changchun.jpg",
    bookings: [
      { id: 101, start: 5, end: 7, user: "Dr. Aris Rodriguez", purpose: "Inter-campus Faculty Conference" },
      { id: 102, start: 20, end: 21, user: "SSC President", purpose: "Student Leadership Summit" }
    ]
  },
  {
    id: 4,
    name: "Yutong Coaster (SAB 5998)",
    type: "Coaster / Medium Capacity",
    capacity: "25-30 Passengers",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Yutong_ZK6729DG_in_Guangzhou.jpg/800px-Yutong_ZK6729DG_in_Guangzhou.jpg",
    bookings: [
      { id: 201, start: 2, end: 4, user: "Ms. Elena Garcia", purpose: "University Choir Practice Tour" }
    ]
  },
  {
    id: 5,
    name: "Mitsubishi L300 FB (CS: B7 H784)",
    type: "Van / Small Capacity",
    capacity: "12-15 Passengers",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Mitsubishi_L300_2.5_Diesel_2010.jpg/800px-Mitsubishi_L300_2.5_Diesel_2010.jpg",
    bookings: [
      { id: 50, start: 22, end: 24, user: "GSO Logistics", purpose: "Campus Supplies Distribution" }
    ]
  },
  {
    id: 6,
    name: "Mitsubishi L-300 Van (SFS 814)",
    type: "Van / Small Capacity",
    capacity: "10-12 Passengers",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Mitsubishi_L300_2.5_Diesel_2010.jpg/800px-Mitsubishi_L300_2.5_Diesel_2010.jpg",
    bookings: []
  },
  {
    id: 7,
    name: "Nissan Urvan Estate (SKA 939)",
    type: "Van / Small Capacity",
    capacity: "12-15 Passengers",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/2012_Nissan_NV350_Urvan.jpg/800px-2012_Nissan_NV350_Urvan.jpg",
    bookings: [
      { id: 70, start: 8, end: 9, user: "VPAA Office", purpose: "Accreditation Visit Transport" }
    ]
  },
  {
    id: 8,
    name: "Toyota Mini Bus (SYA 2337)",
    type: "Coaster / Medium Capacity",
    capacity: "25-30 Passengers",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/2017_Toyota_Coaster.jpg/800px-2017_Toyota_Coaster.jpg",
    bookings: []
  },
  {
    id: 9,
    name: "SUV Land Cruiser (SDN 570)",
    type: "SUV / Medium Capacity",
    capacity: "7 Passengers",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/2021_Toyota_Land_Cruiser_LC300_3.5_ZX_%28VJA300W%29.jpg/800px-2021_Toyota_Land_Cruiser_LC300_3.5_ZX_%28VJA300W%29.jpg",
    bookings: [
      { id: 90, start: 14, end: 14, user: "University President", purpose: "CHED Regional Meeting" }
    ]
  },
  {
    id: 10,
    name: "Toyota HiAce GL (SYA 2338)",
    type: "Van / Small Capacity",
    capacity: "12-15 Passengers",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/2019_Toyota_HiAce_GL_Grandia_Tourer.jpg/800px-2019_Toyota_HiAce_GL_Grandia_Tourer.jpg",
    bookings: []
  },
  {
    id: 11,
    name: "Toyota HiAce Commuter (SAC 1399)",
    type: "Van / Small Capacity",
    capacity: "15 Passengers",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/2019_Toyota_HiAce_Commuter_Deluxe.jpg/800px-2019_Toyota_HiAce_Commuter_Deluxe.jpg",
    bookings: []
  },
  {
    id: 12,
    name: "Toyota HiAce Tourer (SYA 1097)",
    type: "Van / Small Capacity",
    capacity: "12-14 Passengers",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/2019_Toyota_HiAce_GL_Grandia_Tourer_2.8.jpg/800px-2019_Toyota_HiAce_GL_Grandia_Tourer_2.8.jpg",
    bookings: []
  },
  {
    id: 13,
    name: "Toyota HiAce Tourer (SYA 1098)",
    type: "Van / Small Capacity",
    capacity: "12-14 Passengers",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/2019_Toyota_HiAce_GL_Grandia_Tourer_2.8.jpg/800px-2019_Toyota_HiAce_GL_Grandia_Tourer_2.8.jpg",
    bookings: []
  },
  {
    id: 14,
    name: "Toyota HiAce Tourer (SYA 1099)",
    type: "Van / Small Capacity",
    capacity: "12-14 Passengers",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/2019_Toyota_HiAce_GL_Grandia_Tourer_2.8.jpg/800px-2019_Toyota_HiAce_GL_Grandia_Tourer_2.8.jpg",
    bookings: []
  },
  {
    id: 15,
    name: "HINO Refrigerated Van (JM 2748)",
    type: "Specialized / Refrigerated",
    capacity: "3 Passengers",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Hino_Dutro_12.jpg/800px-Hino_Dutro_12.jpg",
    bookings: [
      { id: 150, start: 20, end: 22, user: "Cafeteria Management", purpose: "Food Supply Transport" }
    ]
  },
  {
    id: 16,
    name: "Toyota LiteAce Pick Up (SAC 1400)",
    type: "Pickup / Utility",
    capacity: "2 Passengers",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Toyota_LiteAce_pickup_%281%29.jpg/800px-Toyota_LiteAce_pickup_%281%29.jpg",
    bookings: []
  },
  {
    id: 17,
    name: "HINO Refrigerated Van (JM 2503)",
    type: "Specialized / Refrigerated",
    capacity: "3 Passengers",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Hino_Dutro_12.jpg/800px-Hino_Dutro_12.jpg",
    bookings: []
  }
];

const displayedVehicles = computed(() => {
  return selectedVehicle.value ? [selectedVehicle.value] : vehicles;
});

// --- CALENDAR LOGIC ---
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
const startDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

const calendarDays = computed(() => {
  const totalDays = daysInMonth(currentMonth.value, currentYear.value);
  const startDay = startDayOfMonth(currentMonth.value, currentYear.value);
  const days = [];

  // Padding for start of month
  for (let i = 0; i < startDay; i++) {
    days.push({ day: null, booking: null, isPast: false, position: null });
  }

  const today = new Date();
  today.setHours(0,0,0,0);

  for (let d = 1; d <= totalDays; d++) {
    const booking = selectedVehicle.value?.bookings.find(b => d >= b.start && d <= b.end) || null;
    
    let position = 'single';
    if (booking) {
      if (d === booking.start && d === booking.end) position = 'single';
      else if (d === booking.start) position = 'start';
      else if (d === booking.end) position = 'end';
      else position = 'middle';
    }

    days.push({ day: d, booking, position });
  }
  return days;
});

const selectVehicle = (vehicle) => {
  selectedVehicle.value = vehicle;
  selectionStart.value = null; 
  selectionEnd.value = null;
  activeBooking.value = null; // Clear details
};

const handleDayClick = (dayObj) => {
  if (!dayObj.day) return;

  if (dayObj.booking) {
    activeBooking.value = dayObj.booking;
    return;
  }

  activeBooking.value = null;

  if (!isMultiDateEnabled.value) {
    // Single Date Selection Mode
    selectionStart.value = dayObj.day;
    selectionEnd.value = dayObj.day;
  } else {
    // Multi-Date Selection Mode
    if (!selectionStart.value) {
      // First click
      selectionStart.value = dayObj.day;
      selectionEnd.value = dayObj.day;
    } else if (selectionStart.value && selectionEnd.value === selectionStart.value) {
      // Second click
      const min = Math.min(selectionStart.value, dayObj.day);
      const max = Math.max(selectionStart.value, dayObj.day);
      
      // Check if there are any bookings between min and max
      const hasBooking = calendarDays.value.some(d => d.day >= min && d.day <= max && d.booking);
      if (hasBooking) {
        // Cannot select across booked dates, reset to single day
        selectionStart.value = dayObj.day;
        selectionEnd.value = dayObj.day;
      } else {
        selectionStart.value = min;
        selectionEnd.value = max;
      }
    } else {
      // Reset to new single click (after range was selected)
      selectionStart.value = dayObj.day;
      selectionEnd.value = dayObj.day;
    }
  }
};

const toggleMultiDate = () => {
  isMultiDateEnabled.value = !isMultiDateEnabled.value;
  if (!isMultiDateEnabled.value && selectionStart.value) {
    // Collapse selection to start date when disabling multi-date
    selectionEnd.value = selectionStart.value;
  }
};

const handleConfirm = () => {
  if (!selectedVehicle.value || !selectionStart.value) return;

  const dateString = selectionStart.value === selectionEnd.value 
    ? `${monthNames[currentMonth.value]} ${selectionStart.value}, ${currentYear.value}`
    : `${monthNames[currentMonth.value]} ${selectionStart.value} - ${selectionEnd.value}, ${currentYear.value}`;

  // Save selection info for the FormsView integration
  const bookingInfo = {
    vehicleName: selectedVehicle.value.name,
    date: dateString,
    rawYear: currentYear.value,
    rawMonth: currentMonth.value,
    rawStartDay: selectionStart.value,
    rawEndDay: selectionEnd.value
  };
  localStorage.setItem('pendingVehicleBooking', JSON.stringify(bookingInfo));

  // Reset selected services to ONLY TASU when proceeding from the vehicle calendar
  const selectedServices = {
    'Transportation Services-Book A University Vehicle': true
  };
  localStorage.setItem('selectedServices', JSON.stringify(selectedServices));

  router.push('/services/forms');
};

const goBack = () => {
  router.push('/services');
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
    <!-- Header -->
    <nav class="bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div class="flex items-center gap-4">
        <button @click="goBack" class="p-2 hover:bg-slate-100 rounded-full transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-600 group-hover:text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <h1 class="text-xl font-black tracking-tight leading-none">Vehicle Availability</h1>
          <p class="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-0.5">Transportation Services</p>
        </div>
      </div>
    </nav>

    <main class="max-w-6xl mx-auto p-6 md:p-10 space-y-12">
      <!-- Section 1: Vehicle Selection -->
      <section class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-serif font-black tracking-tight text-slate-800">1. Select a Vehicle</h2>
          <span v-if="selectedVehicle" class="text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 animate-fade-in">✓ Selection Saved</span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="vehicle in displayedVehicles" :key="vehicle.id" class="md:col-span-1">
            <div 
              @click="!selectedVehicle && selectVehicle(vehicle)"
              class="group relative bg-white rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden"
              :class="selectedVehicle?.id === vehicle.id ? 'border-emerald-500 shadow-2xl shadow-emerald-500/10 scale-[1.02]' : 'border-transparent shadow-sm hover:border-emerald-200 hover:shadow-xl cursor-pointer'"
            >
              <!-- Image Container -->
              <div class="h-48 overflow-hidden">
                <img :src="vehicle.image" :alt="vehicle.name" class="w-full h-full object-cover transition-transform duration-700" :class="!selectedVehicle ? 'group-hover:scale-110' : ''" />
                <div class="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent pointer-events-none"></div>
              </div>

              <!-- Content -->
              <div class="p-6 relative">
                <div class="absolute -top-10 right-6 w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center text-emerald-600 transition-transform" :class="!selectedVehicle ? 'group-hover:scale-110' : ''">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                </div>
                <h3 class="text-lg font-black text-slate-900 mb-1">{{ vehicle.name }}</h3>
                <p class="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">{{ vehicle.type }}</p>
                
                <div class="flex items-center gap-2 text-slate-500 text-sm font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  {{ vehicle.capacity }}
                </div>
              </div>

              <!-- Selected Ripple -->
              <div v-if="selectedVehicle?.id === vehicle.id" class="absolute inset-0 bg-emerald-500/5 pointer-events-none animate-flicker"></div>
            </div>
            
            <!-- Change Vehicle Button -->
            <button v-if="selectedVehicle?.id === vehicle.id" @click="selectVehicle(null)" class="mt-6 w-full py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Choose Another Vehicle
            </button>
          </div>
        </div>
      </section>

      <!-- Section 2: Calendar -->
      <section v-if="selectedVehicle" class="animate-slide-up space-y-6">
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h2 class="text-2xl font-serif font-black tracking-tight text-slate-800">2. Select Available Dates</h2>
            <p class="text-sm text-slate-500 font-medium mt-1" v-if="isMultiDateEnabled">Select a single date or click twice to select a range of consecutive dates.</p>
            <p class="text-sm text-slate-500 font-medium mt-1" v-else>Select a single date to book the vehicle.</p>
          </div>
          
          <div class="flex flex-col sm:flex-row items-end gap-3 shrink-0">
            <!-- Toggle Multi-date Selection -->
            <button @click="toggleMultiDate" class="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm hover:bg-slate-50 transition-colors">
              <span class="text-xs font-bold uppercase tracking-widest text-slate-600">Multi-Date</span>
              <div class="w-10 h-5 rounded-full relative transition-colors duration-300" :class="isMultiDateEnabled ? 'bg-emerald-500' : 'bg-slate-200'">
                <div class="absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-300" :class="isMultiDateEnabled ? 'translate-x-5' : 'translate-x-0'"></div>
              </div>
            </button>

            <!-- Legend -->
            <div class="flex items-center gap-4 md:gap-6 text-xs font-bold uppercase tracking-widest bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
              <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-slate-100 border border-slate-200"></span> <span class="hidden md:inline">Available</span></div>
              <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-red-100 border border-red-200"></span> <span class="hidden md:inline">Booked</span></div>
              <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-emerald-500"></span> <span class="hidden md:inline">Selected</span></div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-100 relative overflow-hidden">
          <!-- Calendar Decorative Glow -->
          <div class="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div class="flex items-center justify-between mb-10">
            <h3 class="text-3xl font-black text-slate-900">{{ monthNames[currentMonth] }}, {{ currentYear }}</h3>
            <div class="flex items-center gap-3">
              <button class="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button class="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-7 gap-y-2 md:gap-y-4">
            <!-- Headers -->
            <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day" class="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest pb-6">
              {{ day }}
            </div>

            <!-- Days -->
            <div 
              v-for="(dayObj, index) in calendarDays" :key="index"
              class="relative px-0.5 md:px-1"
            >
              <div 
                v-if="dayObj.day"
                @click="handleDayClick(dayObj)"
                class="aspect-square flex flex-col items-center justify-center border-2 text-sm md:text-lg font-black transition-all duration-300 select-none relative group"
                :class="[
                  (selectionStart && dayObj.day >= selectionStart && dayObj.day <= selectionEnd) ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-600/30 -translate-y-1 scale-105 z-10 rounded-2xl md:rounded-3xl' : 
                  dayObj.booking ? 'bg-red-50 border-red-200 text-red-600 cursor-pointer overflow-hidden rounded-2xl md:rounded-3xl' :
                  'bg-white border-slate-50 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50/50 hover:shadow-md cursor-pointer rounded-2xl md:rounded-3xl'
                , 
                  dayObj.booking?.id === activeBooking?.id ? 'ring-2 ring-red-600/50 z-10 scale-105 shadow-lg shadow-red-200' : '',
                ]"
              >
                <span :class="dayObj.booking ? 'opacity-40' : ''">{{ dayObj.day }}</span>
                
                <!-- Booked Overlay Indicator -->
                <div v-if="dayObj.booking" class="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <span class="text-[8px] md:text-[10px] font-black uppercase tracking-tighter text-red-700/60 rotate-12">Booked</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Booking Details Pop-up Modal -->
          <div v-if="activeBooking" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
              <button @click="activeBooking = null" class="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div class="mb-6">
                <span class="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-red-100 text-red-500 mb-4 inline-block">Booked Trip</span>
                <h3 class="text-2xl font-black text-slate-900 mb-1">{{ activeBooking.purpose }}</h3>
                <p class="text-sm font-bold text-slate-500 uppercase tracking-widest">{{ selectedVehicle.name }}</p>
              </div>
              <div class="space-y-4">
                <div class="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div class="p-2 bg-white rounded-xl text-red-500 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">When (Reserved Dates)</p>
                    <p class="text-sm font-bold text-slate-900">{{ monthNames[currentMonth] }} {{ activeBooking.start }} - {{ activeBooking.end }}, {{ currentYear }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div class="p-2 bg-white rounded-xl text-red-500 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <div>
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Who (Booked By)</p>
                    <p class="text-sm font-bold text-slate-900">{{ activeBooking.user }}</p>
                  </div>
                </div>
              </div>
              <div class="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                <button @click="activeBooking = null" class="px-6 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-200 transition-colors">Close</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 3: Summary & Action -->
      <section v-if="selectedVehicle && selectionStart" class="animate-slide-up">
        <div class="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden group">
          <!-- Background Decoration -->
          <div class="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-110"></div>
          
          <div class="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
            <div class="space-y-4 text-center md:text-left">
              <span class="text-xs font-black uppercase tracking-[0.3em] bg-white/20 px-4 py-2 rounded-full">Booking Summary</span>
              <h3 class="text-4xl font-serif font-black tracking-tight leading-tight">
                {{ selectedVehicle.name }} <br/>
                <span class="text-emerald-100 italic" v-if="selectionStart === selectionEnd">for {{ monthNames[currentMonth] }} {{ selectionStart }}, {{ currentYear }}</span>
                <span class="text-emerald-100 italic" v-else>for {{ monthNames[currentMonth] }} {{ selectionStart }} - {{ selectionEnd }}, {{ currentYear }}</span>
              </h3>
              <p class="text-emerald-50/80 font-medium">Please proceed to finalize your itinerary and passenger list.</p>
            </div>

            <button @click="handleConfirm" class="w-full md:w-auto px-12 py-6 bg-white text-emerald-700 font-black text-xl rounded-[2rem] shadow-2xl hover:bg-slate-50 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3">
              Proceed to Details
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-slide-up {
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-flicker {
  animation: flicker 2s linear infinite;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes flicker {
  0%, 100% { opacity: 0.05; }
  50% { opacity: 0.1; }
}

/* Calendar specifics */
.aspect-square {
  aspect-ratio: 1 / 1;
}

section {
  scroll-margin-top: 100px;
}
</style>
