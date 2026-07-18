<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

// State
const activeTab = ref('user'); // 'user' or 'staff'
const identifier = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

// Reset fields when switching tabs
const switchTab = (tab) => {
  activeTab.value = tab;
  identifier.value = '';
  password.value = '';
  errorMessage.value = '';
};

// Configure Axios
const api = axios.create({
  baseURL: 'http://localhost:8080/', // Your CI4 backend
});

// Mock Accounts for Beta Testing
const mockAccounts = [
  { email: 'enduser@email.com', role: 'student', first_name: 'End User', last_name: '' },
  { email: 'fgmu-admin@email.com', role: 'admin', unit: 'FGMU', first_name: 'FGMU', last_name: 'Admin' },
  { email: 'ssu-admin@email.com', role: 'admin', unit: 'SSU', first_name: 'SSU', last_name: 'Admin' },
  { email: 'leau-admin@email.com', role: 'admin', unit: 'LEAU', first_name: 'LEAU', last_name: 'Admin' },
  { email: 'tasu-admin@email.com', role: 'admin', unit: 'TASU', first_name: 'TASU', last_name: 'Admin' },
  { email: 'fgmu-dispatcher@email.com', role: 'dispatcher', unit: 'FGMU', first_name: 'FGMU', last_name: 'Dispatcher' },
  { email: 'ssu-dispatcher@email.com', role: 'dispatcher', unit: 'SSU', first_name: 'SSU', last_name: 'Dispatcher' },
  { email: 'leau-dispatcher@email.com', role: 'dispatcher', unit: 'LEAU', first_name: 'LEAU', last_name: 'Dispatcher' },
  { email: 'tasu-dispatcher@email.com', role: 'dispatcher', unit: 'TASU', first_name: 'TASU', last_name: 'Dispatcher' },
  { email: 'field-worker@email.com', role: 'worker', first_name: 'Field', last_name: 'Worker' },
  { email: 'driver@email.com', role: 'driver', first_name: 'Main', last_name: 'Driver' },
  { email: 'director@email.com', role: 'director', first_name: 'GSO', last_name: 'Director' },
];

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  // Helper to check staff roles
  const checkStaffRole = (role) => ['admin', 'dispatcher', 'worker', 'driver', 'director'].includes(role);

  // Mock Login Bypass
  const mockUser = mockAccounts.find(u => u.email === identifier.value && password.value === 'access');
  if (mockUser) {
    const isStaffRole = checkStaffRole(mockUser.role);
    
    if (activeTab.value === 'user' && isStaffRole) {
      activeTab.value = 'staff';
      password.value = '';
      errorMessage.value = 'Account found, please login to the respective the gso staff tab';
      isLoading.value = false;
      return;
    }
    if (activeTab.value === 'staff' && !isStaffRole) {
      activeTab.value = 'user';
      password.value = '';
      errorMessage.value = 'Account found, please login to the User Login tab';
      isLoading.value = false;
      return;
    }

    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('role', mockUser.role);

    // Role-based Redirection
    if (mockUser.role === 'admin' || (mockUser.role === 'dispatcher' && mockUser.unit === 'SSU')) {
      router.push(`/admin/${mockUser.unit.toLowerCase()}`);
    } else if (mockUser.role === 'dispatcher') {
      router.push(`/dispatcher/${mockUser.unit.toLowerCase()}`);
    } else if (mockUser.role === 'worker') {
      router.push('/worker/dashboard');
    } else if (mockUser.role === 'driver') {
      router.push('/driver/dashboard');
    } else if (mockUser.role === 'director') {
      router.push('/director/dashboard');
    } else {
      router.push('/user/dashboard');
    }
    isLoading.value = false;
    return;
  }

  try {
    const payload = {
      identifier: identifier.value,
      password: password.value
    };

    const response = await api.post('auth/login', payload);
    
    if (response.status === 200) {
      const { role, user } = response.data;

      const isStaffRole = checkStaffRole(role);
      
      if (activeTab.value === 'user' && isStaffRole) {
        activeTab.value = 'staff';
        password.value = '';
        errorMessage.value = 'Account found, please login to the respective the gso staff tab';
        isLoading.value = false;
        return;
      }
      if (activeTab.value === 'staff' && !isStaffRole) {
        activeTab.value = 'user';
        password.value = '';
        errorMessage.value = 'Account found, please login to the User Login tab';
        isLoading.value = false;
        return;
      }

      // Save user session
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', role);

      // Redirect based on role
      if (role === 'admin' || (role === 'dispatcher' && user?.unit === 'SSU')) {
        if (user?.unit === 'SSU') {
          router.push('/admin/ssu');
        } else {
          router.push('/admin/fgmu'); // Default for now
        }
      } else if (role === 'dispatcher') {
        router.push('/dispatcher/fgmu'); // Default for now
      } else if (role === 'worker') {
        router.push('/worker/dashboard');
      } else if (role === 'driver') {
        router.push('/driver/dashboard');
      } else if (role === 'director') {
        router.push('/director/dashboard');
      } else {
        router.push('/user/dashboard');
      }
    }
  } catch (error) {
    if (error.response && error.response.data.messages) {
      errorMessage.value = error.response.data.messages.error || Object.values(error.response.data.messages).join(', ');
    } else {
      errorMessage.value = 'Connection failed. Please check your network.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen w-full relative flex items-center justify-center bg-slate-50 overflow-hidden font-sans">
    
    <div class="absolute inset-0 z-0 overflow-hidden">
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Benguet_State_University_Main_Gate.jpg" 
        alt="BSU Campus" 
        class="w-full h-full object-cover opacity-20 filter grayscale animate-ken-burns"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/80 to-white/70"></div>
    </div>

    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-float-slow"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float-slower"></div>
    </div>

    <div class="relative z-10 w-full max-w-md mx-3 sm:mx-4 p-5 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all duration-500 hover:shadow-emerald-500/10 group">
      
      <div class="flex flex-col items-center mb-8 sm:mb-10 text-center">
        <div class="relative mb-4 sm:mb-6">
          <div class="absolute inset-0 bg-amber-400 blur-xl opacity-20 rounded-full"></div>
          <div class="relative w-28 sm:w-36 h-28 sm:h-36 rounded-full bg-white p-1.5 shadow-xl flex items-center justify-center border-2 border-slate-50 overflow-hidden">
              <img src="/bsu-logo.png" alt="BSU Logo" class="w-full h-full object-cover rounded-full" />
          </div>
        </div>
            
        <h2 class="text-emerald-700 font-bold tracking-widest text-xs sm:text-sm uppercase mb-1">Benguet State University</h2>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif drop-shadow-sm">
          GSO <span class="text-emerald-600 font-light">Portal</span>
        </h1>
        <p class="text-slate-500 text-xs sm:text-sm mt-2 font-medium">Centralized E-Ticketing System for General Services Office Operations</p>
      </div>

      <div v-if="errorMessage" class="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center font-medium">
        {{ errorMessage }}
      </div>

      <!-- Tab Switcher -->
      <div class="mb-8 p-1.5 bg-slate-100/80 rounded-2xl flex relative overflow-hidden backdrop-blur-sm border border-slate-200">
        <!-- Sliding Background -->
        <div 
          class="absolute inset-y-1.5 transition-all duration-300 ease-out bg-white rounded-xl shadow-sm border border-slate-200/50"
          :style="{ 
            left: activeTab === 'user' ? '6px' : '50%', 
            width: 'calc(50% - 6px)' 
          }"
        ></div>
        
        <button 
          @click="switchTab('user')" 
          type="button"
          class="flex-1 py-2.5 text-sm font-bold transition-all relative z-10 duration-300"
          :class="activeTab === 'user' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-700'"
        >
          <div class="flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            User Login
          </div>
        </button>
        <button 
          @click="switchTab('staff')" 
          type="button"
          class="flex-1 py-2.5 text-sm font-bold transition-all relative z-10 duration-300"
          :class="activeTab === 'staff' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-700'"
        >
          <div class="flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            GSO Staff
          </div>
        </button>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        
        <div class="relative group">
          <label class="block text-slate-600 text-xs font-bold uppercase tracking-wider mb-1.5 ml-1">
            {{ activeTab === 'user' ? 'Email or Student ID' : 'Staff ID or Email' }}
          </label>
          <div class="absolute inset-y-0 left-0 pl-4 mt-6 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <input 
            v-model="identifier"
            type="text" 
            required
            class="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all duration-300"
            :placeholder="activeTab === 'user' ? 'name@bsu.edu.ph or 2301219' : 'staff-123 or email@gso.bsu.edu.ph'"
          />
        </div>

        <div class="relative group">
          <label class="block text-slate-600 text-xs font-bold uppercase tracking-wider mb-1.5 ml-1">Password</label>
          <div class="absolute inset-y-0 left-0 pl-4 mt-6 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <input 
            v-model="password"
            type="password" 
            required
            class="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all duration-300"
            placeholder="••••••••"
          />
        </div>

        <div class="flex justify-end">
          <a href="#" class="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">Forgot Password?</a>
        </div>

        <button 
          :disabled="isLoading"
          type="submit"
          class="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-emerald-500/20 transform hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!isLoading">Sign In</span>
          <span v-else>Authenticating...</span>
          <svg v-if="!isLoading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          <svg v-else class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        </button>

      </form>



    </div>
  </div>
</template>

<style scoped>
/* Ken Burns Effect: Slow Zoom & Pan */
@keyframes ken-burns {
  0% { transform: scale(1) translate(0, 0); }
  50% { transform: scale(1.1) translate(-1%, -1%); }
  100% { transform: scale(1) translate(0, 0); }
}

.animate-ken-burns {
  animation: ken-burns 40s ease-in-out infinite alternate;
}

/* Floating Orbs Animation */
@keyframes float-slow {
  0% { transform: translate(0, 0); }
  33% { transform: translate(30px, -50px); }
  66% { transform: translate(-20px, 20px); }
  100% { transform: translate(0, 0); }
}

@keyframes float-slower {
  0% { transform: translate(0, 0); }
  33% { transform: translate(-30px, 40px); }
  66% { transform: translate(20px, -30px); }
  100% { transform: translate(0, 0); }
}

.animate-float-slow {
  animation: float-slow 12s ease-in-out infinite;
}

.animate-float-slower {
  animation: float-slower 18s ease-in-out infinite;
}
</style>