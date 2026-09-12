<template>
  <MainLayout>
    <template #header-title>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400 shadow-2xs shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div class="flex flex-col">
          <h2 class="text-xl font-extrabold text-slate-900 tracking-tight leading-none mb-1">Superadmin Account Settings</h2>
          <p class="text-[10px] text-emerald-700 font-bold tracking-[0.15em] uppercase">Root System Administrator &amp; Security Controls</p>
        </div>
      </div>
    </template>

    <template #main-content>
      <div class="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
        <!-- Profile Form Card -->
        <div class="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
          <div class="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
            <div class="flex items-center gap-4">
              <div class="relative group cursor-pointer shrink-0" @click="triggerAvatarUpload" title="Click to change profile picture">
                <input
                  type="file"
                  ref="avatarInputRef"
                  accept="image/png,image/jpeg,image/webp"
                  class="hidden"
                  @change="handleAvatarFileChange"
                />
                <div class="w-16 h-16 rounded-[1.25rem] overflow-hidden bg-slate-950 flex items-center justify-center text-emerald-400 shadow-lg shadow-slate-950/20 border-2 border-emerald-500/40">
                  <img v-if="avatarPreviewUrl" :src="avatarPreviewUrl" alt="Avatar" class="w-full h-full object-cover" />
                  <span v-else class="text-2xl font-black">{{ form.firstName ? form.firstName.charAt(0).toUpperCase() : 'S' }}</span>
                </div>
                <div class="absolute -bottom-1.5 -right-1.5 p-1.5 bg-white rounded-xl shadow-md border border-slate-200 text-slate-600 hover:text-emerald-600 transition-all group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="text-lg font-black text-slate-900 tracking-tight">System Administrator Profile</h3>
                  <span class="px-2.5 py-0.5 bg-slate-900 text-emerald-400 text-[10px] font-black uppercase tracking-wider rounded-md border border-slate-800">
                    Root Superadmin
                  </span>
                </div>
                <p class="text-xs text-slate-500 font-medium mt-0.5">Manage system administrator identity and root access credentials</p>
              </div>
            </div>

            <div class="flex items-center gap-2 self-start sm:self-auto">
              <span class="px-3 py-1 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-xs">
                Root Level Authority
              </span>
            </div>
          </div>

          <div class="p-6 sm:p-10 md:p-12 space-y-10">
            <!-- Account Details Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- First Name -->
              <div class="space-y-2.5">
                <label class="block text-xs font-black text-slate-800 uppercase tracking-widest ml-1">First Name</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    v-model="form.firstName"
                    type="text"
                    class="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                    placeholder="Enter first name"
                  />
                </div>
              </div>

              <!-- Last Name -->
              <div class="space-y-2.5">
                <label class="block text-xs font-black text-slate-800 uppercase tracking-widest ml-1">Last Name</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    v-model="form.lastName"
                    type="text"
                    class="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <!-- Email Address -->
              <div class="space-y-2.5 md:col-span-2">
                <label class="block text-xs font-black text-slate-800 uppercase tracking-widest ml-1">Email Address</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    v-model="form.email"
                    type="email"
                    disabled
                    class="block w-full pl-11 pr-4 py-3.5 bg-slate-100/70 border border-slate-200 rounded-2xl text-sm font-bold text-slate-500 cursor-not-allowed outline-none"
                    placeholder="superadmin@bsu.edu.ph"
                  />
                </div>
                <p class="text-[11px] text-slate-400 font-medium ml-1">Primary administrative system email address.</p>
              </div>

              <!-- New Password -->
              <div class="space-y-2.5">
                <label class="block text-xs font-black text-slate-800 uppercase tracking-widest ml-1">New Password</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    class="block w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                    placeholder="Leave blank to keep current"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 013.111-5.184M9.9 4.314A10.198 10.198 0 0112 4c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l3.59 3.59m0 0A9.956 9.956 0 016.59 2.59M9 13a3 3 0 013-3m0 3a1.5 1.5 0 011.5 1.5" />
                    </svg>
                  </button>
                </div>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-1">Minimum 8 characters if changing.</p>
              </div>

              <!-- Confirm Password -->
              <div class="space-y-2.5">
                <div class="flex items-center justify-between ml-1">
                  <label class="block text-xs font-black text-slate-800 uppercase tracking-widest">Confirm Password</label>
                  <span v-if="form.password && form.confirmPassword" class="text-xs font-bold" :class="form.password === form.confirmPassword ? 'text-emerald-600' : 'text-rose-500'">
                    {{ form.password === form.confirmPassword ? '✓ Passwords match' : '✕ Do not match' }}
                  </span>
                </div>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <input
                    v-model="form.confirmPassword"
                    :type="showPassword ? 'text' : 'password'"
                    class="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                    placeholder="Re-type new password"
                  />
                </div>
              </div>
            </div>

            <!-- Root Privileges Callout -->
            <div class="p-5 rounded-2xl bg-slate-900 text-slate-300 flex items-start gap-3.5 shadow-md">
              <div class="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div class="space-y-0.5">
                <h4 class="text-xs font-black text-white uppercase tracking-wider">Root Security Notice</h4>
                <p class="text-xs text-slate-400 leading-relaxed font-medium">
                  This account controls global system security policies, identity verification approvals, audit logs, and account provisionings. Ensure you maintain strong authentication practices.
                </p>
              </div>
            </div>
          </div>

          <!-- Bottom Action Bar -->
          <div class="p-6 sm:p-8 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end">
            <button
              type="button"
              @click="handleSave"
              :disabled="isSaving"
              class="px-8 py-3.5 bg-slate-900 hover:bg-emerald-600 disabled:bg-slate-300 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-98 flex items-center gap-2.5 cursor-pointer disabled:cursor-not-allowed"
            >
              <svg v-if="!isSaving" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isSaving ? 'Saving Changes...' : 'Save Changes' }}</span>
            </button>
          </div>
        </div>
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import api from '@/api/client';
import { toast } from 'vue3-toastify';

const authStore = useAuthStore();
const avatarInputRef = ref(null);
const avatarPreviewUrl = ref(null);

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const showPassword = ref(false);
const isSaving = ref(false);

onMounted(() => {
  const user = authStore.user;
  if (user) {
    form.value.firstName = user.first_name || '';
    form.value.lastName  = user.last_name  || '';
    form.value.email     = user.email      || '';
    if (user.avatar_path) {
      avatarPreviewUrl.value = `/api/v1/auth/avatar/${user.id}?t=${Date.now()}`;
    }
  }
});

const triggerAvatarUpload = () => {
  avatarInputRef.value?.click();
};

const handleAvatarFileChange = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    toast.error('Only JPG, PNG, and WebP images are allowed.');
    return;
  }
  if (file.size > 3 * 1024 * 1024) {
    toast.error('Image size must be less than 3MB.');
    return;
  }

  avatarPreviewUrl.value = URL.createObjectURL(file);

  try {
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await api.post('/auth/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (res.data?.data?.user) {
      authStore.user = res.data.data.user;
      toast.success('Superadmin avatar updated successfully!');
    }
  } catch (err) {
    console.error('Failed to upload avatar:', err);
    toast.error(err.response?.data?.message || 'Failed to upload avatar image.');
  }
};

const handleSave = async () => {
  if (form.value.password) {
    if (form.value.password.length < 8) {
      toast.error('New password must be at least 8 characters long.');
      return;
    }
    if (form.value.password !== form.value.confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }
  }

  isSaving.value = true;
  try {
    const result = await authStore.updateProfile({
      first_name: form.value.firstName,
      last_name:  form.value.lastName,
    });
    
    if (form.value.password) {
      await api.post('/auth/change-password', {
        new_password: form.value.password,
        new_password_confirm: form.value.confirmPassword,
      });
      form.value.password = '';
      form.value.confirmPassword = '';
    }

    if (result.success) {
      toast.success('Superadmin profile updated successfully!');
    } else {
      toast.error(result.message || 'Failed to update profile.');
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to update profile.');
  } finally {
    isSaving.value = false;
  }
};
</script>
