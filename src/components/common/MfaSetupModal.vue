<script setup>
import { ref, computed, watch, onUnmounted, nextTick } from 'vue';
import { verify2faSetupOtp, resend2faSetupOtp } from '@/api/auth';
import { toast } from 'vue3-toastify';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  maskedEmail: {
    type: String,
    default: '',
  },
  tempToken: {
    type: String,
    required: true,
  },
  expiresIn: {
    type: Number,
    default: 600,
  },
});

const emit = defineEmits(['close', 'verified', 'token-updated']);

const otpCode           = ref('');
const isVerifying       = ref(false);
const isResending       = ref(false);
const errorMessage      = ref('');
const remainingAttempts = ref(null);
const currentToken      = ref(props.tempToken);

// Timers
const mfaExpiresSeconds = ref(props.expiresIn);
const resendCooldown    = ref(45);
let mfaCountdownId      = null;
let resendCooldownId    = null;

const inputRef = ref(null);

const formattedMfaExpiry = computed(() => {
  const total = Math.max(0, mfaExpiresSeconds.value);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

const isExpired = computed(() => mfaExpiresSeconds.value <= 0);

const startMfaCountdown = (seconds = 600) => {
  stopMfaCountdown();
  mfaExpiresSeconds.value = seconds;
  mfaCountdownId = setInterval(() => {
    if (mfaExpiresSeconds.value > 1) {
      mfaExpiresSeconds.value -= 1;
    } else {
      stopMfaCountdown();
      mfaExpiresSeconds.value = 0;
      errorMessage.value = 'Verification code has expired. Please request a new code.';
    }
  }, 1000);
};

const stopMfaCountdown = () => {
  if (mfaCountdownId) {
    clearInterval(mfaCountdownId);
    mfaCountdownId = null;
  }
};

const startResendCooldown = (seconds = 45) => {
  stopResendCooldown();
  resendCooldown.value = seconds;
  resendCooldownId = setInterval(() => {
    if (resendCooldown.value > 1) {
      resendCooldown.value -= 1;
    } else {
      stopResendCooldown();
      resendCooldown.value = 0;
    }
  }, 1000);
};

const stopResendCooldown = () => {
  if (resendCooldownId) {
    clearInterval(resendCooldownId);
    resendCooldownId = null;
  }
};

const stopAllTimers = () => {
  stopMfaCountdown();
  stopResendCooldown();
};

watch(() => props.tempToken, (newVal) => {
  if (newVal) {
    currentToken.value = newVal;
  }
});

watch(() => props.isOpen, (open) => {
  if (open) {
    otpCode.value = '';
    errorMessage.value = '';
    remainingAttempts.value = null;
    currentToken.value = props.tempToken;
    startMfaCountdown(props.expiresIn || 600);
    startResendCooldown(45);
    nextTick(() => {
      inputRef.value?.focus();
    });
  } else {
    stopAllTimers();
  }
}, { immediate: true });

onUnmounted(() => {
  stopAllTimers();
});

const handleOtpInput = (e) => {
  const clean = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
  otpCode.value = clean;
  errorMessage.value = '';
};

const handleVerify = async () => {
  const code = otpCode.value.trim();
  if (code.length !== 6) {
    errorMessage.value = 'Please enter all 6 digits of the verification code.';
    return;
  }

  isVerifying.value = true;
  errorMessage.value = '';

  try {
    const res = await verify2faSetupOtp({
      temp_token: currentToken.value,
      otp_code: code,
    });

    const data = res.data?.data || {};
    emit('verified', data);
  } catch (err) {
    const resData = err.response?.data || {};
    errorMessage.value = resData.message || 'Verification failed. Please check the code and try again.';
    remainingAttempts.value = resData.errors?.remaining_attempts ?? null;
  } finally {
    isVerifying.value = false;
  }
};

const handleResend = async () => {
  if (resendCooldown.value > 0 || isResending.value) return;

  isResending.value = true;
  errorMessage.value = '';

  try {
    const res = await resend2faSetupOtp({
      temp_token: currentToken.value,
    });

    const data = res.data?.data || {};
    if (data.temp_token) {
      currentToken.value = data.temp_token;
      emit('token-updated', data.temp_token);
    }

    startMfaCountdown(data.expires_in || 600);
    startResendCooldown(45);
    otpCode.value = '';
    toast.success('A fresh 6-digit code has been sent to your email.');
  } catch (err) {
    const resData = err.response?.data || {};
    errorMessage.value = resData.message || 'Failed to resend verification code. Please try again.';
  } finally {
    isResending.value = false;
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 flex items-center justify-center p-4 pointer-events-auto overflow-y-auto z-[10000]"
      >
        <div class="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity" @click="!isVerifying && $emit('close')"></div>

        <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-6 sm:p-8 relative z-10 transform transition-all animate-modal-pop border border-slate-100 my-auto">
          <!-- Header -->
          <div class="flex items-start gap-4 mb-5">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border bg-emerald-50 text-emerald-600 border-emerald-100 shadow-xs">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <span class="text-[10px] font-black uppercase tracking-widest text-emerald-600 block mb-0.5">Account Security</span>
              <h3 class="text-xl font-black text-slate-900 leading-tight">Enable Two-Factor Authentication</h3>
            </div>
          </div>

          <!-- Description & Masked Email Pill -->
          <p class="text-slate-600 text-xs sm:text-sm font-medium mb-4 leading-relaxed">
            To ensure your account is protected, we dispatched a 6-digit confirmation code to your registered institutional email:
          </p>

          <div class="mb-5 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between gap-3 text-xs">
            <div class="flex items-center gap-2 min-w-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span class="font-bold text-emerald-900 truncate">{{ maskedEmail || 'your registered email' }}</span>
            </div>
            <span class="px-2 py-0.5 bg-emerald-200/80 text-emerald-900 text-[10px] font-black uppercase tracking-wider rounded-md shrink-0">OTP Dispatched</span>
          </div>

          <!-- Error Alert Banner -->
          <div v-if="errorMessage" class="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200/80 flex items-start gap-2.5 text-xs text-rose-700 font-semibold animate-shake">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-rose-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="flex-1">
              <span>{{ errorMessage }}</span>
              <span v-if="remainingAttempts !== null" class="block font-bold text-[11px] mt-0.5">
                {{ remainingAttempts }} attempt(s) remaining before session lockout.
              </span>
            </div>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleVerify" class="space-y-4">
            <div>
              <label class="block text-xs font-black text-slate-800 uppercase tracking-widest mb-2 text-center">
                Enter 6-Digit Verification Code
              </label>
              <input
                ref="inputRef"
                :value="otpCode"
                @input="handleOtpInput"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                maxlength="6"
                placeholder="••••••"
                autocomplete="one-time-code"
                :disabled="isVerifying || isExpired"
                class="w-full text-center font-mono text-3xl font-black tracking-[0.45em] py-3 px-4 bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all placeholder:text-slate-300 text-slate-900 disabled:opacity-50"
              />
            </div>

            <!-- Timer & Resend Controls -->
            <div class="flex items-center justify-between text-xs px-1 font-medium text-slate-500">
              <div class="flex items-center gap-1.5">
                <span>Code expires in:</span>
                <span class="font-mono font-bold" :class="isExpired ? 'text-rose-600' : 'text-slate-800'">
                  {{ formattedMfaExpiry }}
                </span>
              </div>

              <button
                type="button"
                @click="handleResend"
                :disabled="resendCooldown > 0 || isResending"
                class="font-bold text-emerald-700 hover:text-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer py-1"
              >
                <span v-if="isResending">Sending...</span>
                <span v-else-if="resendCooldown > 0">Resend in {{ resendCooldown }}s</span>
                <span v-else>Resend Code</span>
              </button>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                @click="!isVerifying && $emit('close')"
                :disabled="isVerifying"
                class="px-5 py-3 rounded-xl border border-slate-200 text-xs font-black text-slate-600 uppercase tracking-wider hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                :disabled="isVerifying || otpCode.length !== 6 || isExpired"
                class="min-h-[44px] px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <svg v-if="isVerifying" class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span v-if="!isVerifying">Verify & Enable 2FA</span>
                <span v-else>Activating...</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes modal-pop {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-modal-pop {
  animation: modal-pop 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-4px); }
  40%, 80% { transform: translateX(4px); }
}

.animate-shake {
  animation: shake 0.3s ease-in-out;
}
</style>

