<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router    = useRouter();
const authStore = useAuthStore();

// State
const identifier    = ref('');
const password      = ref('');
const isLoading     = ref(false);
const errorMessage  = ref('');

const handleLogin = async () => {
  isLoading.value    = true;
  errorMessage.value = '';

  try {
    const result = await authStore.login(identifier.value, password.value);

    if (!result.success) {
      errorMessage.value = result.message || 'Login failed. Please try again.';
      return;
    }

    const role = result.role;

    // Redirect based on role
    if (role === 'admin') {
      const unitId = authStore.user?.unit_id;
      const unitMap = { 1: 'FGMU', 2: 'LEAU', 3: 'SSU' };
      const unit = authStore.user?.unit_code || authStore.user?.unit || unitMap[unitId] || 'FGMU';

      if (unit === 'SSU') {
        router.push('/admin/ssu');
      } else if (unit === 'LEAU') {
        router.push('/admin/leau');
      } else {
        router.push('/admin/fgmu');
      }
    } else if (role === 'dispatcher') {
      const unitId = authStore.user?.unit_id;
      const unitMap = { 1: 'FGMU', 2: 'LEAU', 3: 'SSU' };
      const unit = authStore.user?.unit_code || authStore.user?.unit || unitMap[unitId] || 'FGMU';
      router.push(`/dispatcher/${unit.toLowerCase()}`);
    } else if (role === 'worker') {
      router.push('/worker/dashboard');
    } else if (role === 'director') {
      router.push('/director/dashboard');
    } else {
      router.push('/user/dashboard');
    }
  } catch {
    errorMessage.value = 'Connection failed. Please check your network.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="h-[100dvh] max-h-screen w-full relative flex items-center justify-center bg-slate-50 overflow-hidden font-sans">
    
    <!-- Background Image & Gradient -->
    <div class="absolute inset-0 z-0 overflow-hidden bg-slate-50">
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Benguet_State_University_Main_Gate.jpg" 
        alt="" 
        class="w-full h-full object-cover opacity-20 filter grayscale animate-ken-burns"
      />
      <!-- Dynamic Light Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-white/60 via-slate-50/80 to-white z-0"></div>
    </div>

    <!-- Floating UI Orbs for subtle depth -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
      <div class="absolute w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-[100px] animate-orb-1 mix-blend-multiply"></div>
      <div class="absolute w-[700px] h-[700px] bg-sky-400/5 rounded-full blur-[120px] animate-orb-3 mix-blend-multiply"></div>
    </div>

    <!-- Top Left University Branding -->
    <router-link to="/" class="absolute top-6 left-6 sm:top-8 sm:left-10 z-20 flex items-center gap-4 animate-fade-in drop-shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
      <div class="w-16 h-16 sm:w-20 sm:h-20 overflow-hidden flex-shrink-0">
        <img src="/bsu-logo.png" alt="BSU Logo" class="w-full h-full object-cover rounded-full" />
      </div>
      <div class="hidden sm:block">
        <h2 class="text-emerald-800 font-extrabold tracking-widest text-sm uppercase mb-0.5 drop-shadow-md">Benguet State University</h2>
        <p class="text-slate-700 font-bold text-xs tracking-wide drop-shadow-md">La Trinidad, Benguet</p>
      </div>
    </router-link>

    <!-- Main Login Card -->
    <div class="relative z-10 w-full max-w-md mx-4 p-6 sm:p-8 rounded-[2rem] border border-slate-200/60 bg-white/90 backdrop-blur-2xl shadow-2xl transition-all duration-700 hover:shadow-emerald-500/15 flex flex-col justify-center max-h-[95vh] overflow-hidden">
      
      <!-- Header -->
      <div class="mb-8 shrink-0 text-left">
        <h2 class="text-emerald-700 font-extrabold text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-2 ml-1">General Services Office</h2>
        <h1 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-2">
          Centralized <br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">e-Ticketing</span>
        </h1>
        <p class="text-slate-500 text-xs font-medium">Please sign in to access your dashboard.</p>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm text-center font-bold animate-fade-in shrink-0 shadow-sm">
        {{ errorMessage }}
      </div>

      <!-- Unified Form -->
      <form @submit.prevent="handleLogin" class="space-y-4 shrink-0 pb-1">
        
        <div class="relative group/input">
          <label class="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 ml-1">
            Email Address
          </label>
          <div class="absolute inset-y-0 left-0 pl-4 mt-5 flex items-center pointer-events-none z-10">
            <svg class="h-4 w-4 text-slate-400 group-focus-within/input:text-emerald-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <input 
            v-model="identifier"
            type="email" 
            required
            class="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all duration-300 shadow-sm hover:border-emerald-500/50"
            placeholder="name@bsu.edu.ph"
          />
        </div>

        <div class="relative group/input">
          <div class="flex items-center justify-between mb-1 ml-1 pr-1">
            <label class="block text-slate-500 text-[10px] font-black uppercase tracking-widest">Password</label>
            <a href="#" class="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors">Forgot?</a>
          </div>
          <div class="absolute inset-y-0 left-0 pl-4 mt-5 flex items-center pointer-events-none z-10">
            <svg class="h-4 w-4 text-slate-400 group-focus-within/input:text-emerald-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <input 
            v-model="password"
            type="password" 
            required
            class="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all duration-300 shadow-sm hover:border-emerald-500/50"
            placeholder="••••••••"
          />
        </div>

        <button 
          :disabled="isLoading"
          type="submit"
          class="w-full py-3.5 mt-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-xl shadow-slate-900/20 transform hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!isLoading">Secure Sign In</span>
          <span v-else>Authenticating...</span>
          <svg v-if="!isLoading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          <svg v-else class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        </button>

      </form>
    </div>
  </div>
</template>

<style scoped>
/* Force 100dvh on the root element of this view */
:deep(body), :deep(html) {
  overflow: hidden;
  height: 100%;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

/* Animations */
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes ken-burns {
  0% { transform: scale(1) translate(0, 0); }
  50% { transform: scale(1.05) translate(-1%, -1%); }
  100% { transform: scale(1) translate(0, 0); }
}

.animate-ken-burns {
  animation: ken-burns 30s ease-in-out infinite alternate;
}

@keyframes grid-pan {
  0% { transform: translateY(0); }
  100% { transform: translateY(32px); }
}

.animate-grid-pan {
  animation: grid-pan 3s linear infinite;
}

@keyframes orb-1 {
  0% { transform: translate(-10%, -10%) scale(1); }
  33% { transform: translate(10%, 10%) scale(1.1); }
  66% { transform: translate(5%, -15%) scale(0.9); }
  100% { transform: translate(-10%, -10%) scale(1); }
}

@keyframes orb-2 {
  0% { transform: translate(10%, 10%) scale(1); }
  33% { transform: translate(-5%, -15%) scale(0.9); }
  66% { transform: translate(-10%, 5%) scale(1.1); }
  100% { transform: translate(10%, 10%) scale(1); }
}

@keyframes orb-3 {
  0% { transform: translate(-5%, 15%) scale(0.9); }
  33% { transform: translate(10%, -5%) scale(1); }
  66% { transform: translate(-15%, -10%) scale(1.1); }
  100% { transform: translate(-5%, 15%) scale(0.9); }
}

.animate-orb-1 { animation: orb-1 25s ease-in-out infinite alternate; }
.animate-orb-2 { animation: orb-2 20s ease-in-out infinite alternate-reverse; }
.animate-orb-3 { animation: orb-3 30s ease-in-out infinite alternate; }

.animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.3; }
}

/* Shimmer effect for the card */
.shimmer-card {
  position: relative;
}
.shimmer-card::before {
  content: '';
  position: absolute;
  top: 0; left: -100%; width: 50%; height: 100%;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.05), transparent);
  transform: skewX(-20deg);
  animation: shimmer 6s infinite;
  pointer-events: none;
  z-index: 10;
}

@keyframes shimmer {
  0% { left: -100%; }
  20% { left: 200%; }
  100% { left: 200%; }
}
</style>