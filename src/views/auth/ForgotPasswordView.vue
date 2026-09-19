<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Ambient Background Lighting -->
    <div class="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none"></div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
      <!-- Institutional Logo & Header -->
      <div class="text-center mb-8">
        <router-link to="/login" class="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-widest mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Login
        </router-link>
        <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">Password Recovery</h2>
        <p class="mt-2 text-sm text-slate-400 font-medium">
          Enter your institutional email address to receive a secure password reset link.
        </p>
      </div>

      <!-- Main Card Container -->
      <div class="bg-white/95 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl shadow-slate-950/50 rounded-2xl sm:rounded-3xl border border-slate-700/30">
        <!-- Initial Request State -->
        <form v-if="!isSubmitted" @submit.prevent="handleSubmit" class="space-y-6">
          <div class="space-y-1.5 text-left">
            <label for="email" class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Account Email Address
            </label>
            <div class="relative group/input">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10 text-slate-400 group-focus-within/input:text-emerald-600 transition-colors">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                autocomplete="email"
                placeholder="name@bsu.edu.ph"
                :disabled="isLoading"
                class="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
            <p class="text-[11px] text-slate-500 font-medium">
              We'll check our records and dispatch a one-time reset link directly to your inbox.
            </p>
          </div>

          <div v-if="errorMessage" class="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
            <svg class="w-4 h-4 text-rose-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <span>{{ errorMessage }}</span>
          </div>

          <button
            type="submit"
            :disabled="isLoading || !email"
            class="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-slate-900/20 transform hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isLoading ? 'Dispatching Link...' : 'Send Reset Link' }}</span>
          </button>
        </form>

        <!-- Success Confirmation State -->
        <div v-else class="text-center py-4 space-y-5 animate-fade-in">
          <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <div>
            <h3 class="text-lg font-extrabold text-slate-900 tracking-tight">Check Your Inbox</h3>
            <p class="text-xs text-slate-500 font-medium mt-1 leading-relaxed max-w-sm mx-auto">
              If an active account exists for <span class="font-bold text-slate-800">{{ email }}</span>, a password reset link has been dispatched.
            </p>
          </div>

          <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs text-slate-600 space-y-1.5">
            <div class="flex items-center gap-2 font-bold text-slate-800">
              <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span>Next Steps:</span>
            </div>
            <ul class="list-disc list-inside space-y-1 text-slate-500 pl-1">
              <li>Click the reset link in the email to open the password reset page.</li>
              <li>The link expires in <strong>60 minutes</strong>.</li>
              <li>Don't see it? Check your Spam or Promotions folder.</li>
            </ul>
          </div>

          <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              @click="handleResend"
              :disabled="resendCooldown > 0 || isLoading"
              class="w-full sm:w-auto text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 py-2.5 px-4 rounded-xl border border-emerald-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="resendCooldown > 0">Resend in {{ resendCooldown }}s</span>
              <span v-else>Resend Email</span>
            </button>
            <router-link
              to="/login"
              class="w-full sm:w-auto text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 py-2.5 px-4 rounded-xl transition-colors text-center"
            >
              Return to Login
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { forgotPassword } from '@/api/auth';
import { toast } from 'vue3-toastify';

const email = ref('');
const isLoading = ref(false);
const isSubmitted = ref(false);
const errorMessage = ref('');
const resendCooldown = ref(0);
let cooldownTimer = null;

const startCooldown = (seconds = 60) => {
  resendCooldown.value = seconds;
  if (cooldownTimer) clearInterval(cooldownTimer);
  cooldownTimer = setInterval(() => {
    if (resendCooldown.value > 0) {
      resendCooldown.value--;
    } else {
      clearInterval(cooldownTimer);
    }
  }, 1000);
};

const handleSubmit = async () => {
  if (!email.value) return;
  isLoading.value = true;
  errorMessage.value = '';

  try {
    await forgotPassword(email.value.trim());
    isSubmitted.value = true;
    startCooldown(60);
    toast.success('Password reset link dispatched!');
  } catch (error) {
    const msg = error.response?.data?.message || 'Unable to process password reset request. Please try again.';
    errorMessage.value = msg;
    toast.error(msg);
  } finally {
    isLoading.value = false;
  }
};

const handleResend = async () => {
  if (resendCooldown.value > 0 || isLoading.value) return;
  await handleSubmit();
};
</script>
