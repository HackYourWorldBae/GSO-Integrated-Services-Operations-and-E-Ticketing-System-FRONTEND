<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Ambient Background Lighting -->
    <div class="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none"></div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
      <!-- Header -->
      <div class="text-center mb-8">
        <router-link to="/login" class="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-widest mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Login
        </router-link>
        <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">Set New Password</h2>
        <p class="mt-2 text-sm text-slate-400 font-medium">
          Create a strong, secure password for your institutional account.
        </p>
      </div>

      <!-- Main Container -->
      <div class="bg-white/95 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl shadow-slate-950/50 rounded-2xl sm:rounded-3xl border border-slate-700/30">
        <!-- 1. Verifying Token State -->
        <div v-if="isVerifying" class="py-8 text-center space-y-4">
          <div class="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
          <p class="text-xs text-slate-500 font-semibold">Validating security token...</p>
        </div>

        <!-- 2. Token Invalid or Expired State -->
        <div v-else-if="tokenError" class="py-6 text-center space-y-5 animate-fade-in">
          <div class="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-extrabold text-slate-900 tracking-tight">Invalid or Expired Link</h3>
            <p class="text-xs text-slate-500 font-medium mt-1 leading-relaxed max-w-xs mx-auto">
              {{ tokenError }}
            </p>
          </div>
          <div class="pt-2">
            <router-link
              to="/forgot-password"
              class="inline-block w-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 py-3 px-4 rounded-xl transition-all shadow-md"
            >
              Request a New Reset Link
            </router-link>
          </div>
        </div>

        <!-- 3. Active Reset Form Connected to Account -->
        <form v-else @submit.prevent="handleResetPassword" class="space-y-6 animate-fade-in">
          <!-- Account Identity Card -->
          <div class="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
              {{ accountData.name ? accountData.name.charAt(0).toUpperCase() : 'U' }}
            </div>
            <div class="text-left overflow-hidden">
              <p class="text-[10px] font-black uppercase tracking-wider text-emerald-700">Account Connected</p>
              <p class="text-xs font-bold text-slate-900 truncate">{{ accountData.name || 'Campus User' }}</p>
              <p class="text-[11px] text-slate-500 truncate font-mono">{{ accountData.email }}</p>
            </div>
          </div>

          <!-- New Password Input -->
          <div class="space-y-1.5 text-left">
            <label for="new_password" class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              New Password
            </label>
            <div class="relative group/input">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-emerald-600 transition-colors">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="new_password"
                v-model="newPassword"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="new-password"
                placeholder="••••••••"
                :disabled="isLoading"
                class="w-full pl-11 pr-11 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <svg v-if="!showPassword" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              </button>
            </div>
            <!-- Password Requirements Checklist -->
            <div class="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
              <span class="flex items-center gap-1.5" :class="newPassword.length >= 8 ? 'text-emerald-600 font-bold' : 'text-slate-400'">
                <span>{{ newPassword.length >= 8 ? '✓' : '•' }}</span> 8+ characters
              </span>
              <span class="flex items-center gap-1.5" :class="/[A-Z]/.test(newPassword) ? 'text-emerald-600 font-bold' : 'text-slate-400'">
                <span>{{ /[A-Z]/.test(newPassword) ? '✓' : '•' }}</span> 1 uppercase
              </span>
              <span class="flex items-center gap-1.5" :class="/[0-9]/.test(newPassword) ? 'text-emerald-600 font-bold' : 'text-slate-400'">
                <span>{{ /[0-9]/.test(newPassword) ? '✓' : '•' }}</span> 1 number
              </span>
              <span class="flex items-center gap-1.5" :class="/[^A-Za-z0-9]/.test(newPassword) ? 'text-emerald-600 font-bold' : 'text-slate-400'">
                <span>{{ /[^A-Za-z0-9]/.test(newPassword) ? '✓' : '•' }}</span> 1 special char
              </span>
            </div>
          </div>

          <!-- Confirm Password Input -->
          <div class="space-y-1.5 text-left">
            <label for="confirm_password" class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Confirm New Password
            </label>
            <div class="relative group/input">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-emerald-600 transition-colors">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <input
                id="confirm_password"
                v-model="confirmPassword"
                type="password"
                required
                autocomplete="new-password"
                placeholder="••••••••"
                :disabled="isLoading"
                class="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
            <p v-if="confirmPassword && newPassword !== confirmPassword" class="text-[11px] text-rose-600 font-semibold">
              Passwords do not match.
            </p>
            <p v-else-if="confirmPassword && newPassword === confirmPassword" class="text-[11px] text-emerald-600 font-semibold">
              Passwords match perfectly.
            </p>
          </div>

          <div v-if="formError" class="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
            <svg class="w-4 h-4 text-rose-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <span>{{ formError }}</span>
          </div>

          <button
            type="submit"
            :disabled="isLoading || !newPassword || newPassword !== confirmPassword || newPassword.length < 8"
            class="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-slate-900/20 transform hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isLoading ? 'Saving New Password...' : 'Save & Update Password' }}</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { verifyResetToken, resetPassword } from '@/api/auth';
import { toast } from 'vue3-toastify';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();

const isVerifying = ref(true);
const isLoading = ref(false);
const tokenError = ref('');
const formError = ref('');

const token = ref('');
const email = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);

const accountData = ref({
  name: '',
  email: '',
  role: '',
});

onMounted(async () => {
  token.value = (route.query.token || '').toString().trim();
  email.value = (route.query.email || '').toString().trim();

  if (!token.value || !email.value) {
    isVerifying.value = false;
    tokenError.value = 'Missing or invalid password reset link parameters. Please request a new link.';
    return;
  }

  try {
    const response = await verifyResetToken(email.value, token.value);
    const data = response.data?.data || {};
    accountData.value = {
      name: data.name || '',
      email: data.email || email.value,
      role: data.role || '',
    };
  } catch (err) {
    tokenError.value = err.response?.data?.message || 'This password reset link is invalid or has expired. Please submit a new request.';
  } finally {
    isVerifying.value = false;
  }
});

const handleResetPassword = async () => {
  if (newPassword.value.length < 8) {
    formError.value = 'Password must be at least 8 characters long.';
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    formError.value = 'Passwords do not match.';
    return;
  }

  isLoading.value = true;
  formError.value = '';

  try {
    await resetPassword({
      email: email.value,
      token: token.value,
      password: newPassword.value,
      password_confirm: confirmPassword.value,
    });

    await Swal.fire({
      icon: 'success',
      title: 'Password Updated!',
      text: 'Your account password has been successfully reset. You can now log in with your new credentials.',
      confirmButtonColor: '#059669',
      confirmButtonText: 'Proceed to Login',
    });

    router.push('/login');
  } catch (err) {
    const msg = err.response?.data?.message || 'Failed to reset password. Please try again.';
    formError.value = msg;
    toast.error(msg);
  } finally {
    isLoading.value = false;
  }
};
</script>
