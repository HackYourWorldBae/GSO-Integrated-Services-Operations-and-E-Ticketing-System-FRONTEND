<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/user/dashboard" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <span class="text">Dashboard</span>
      </router-link>
      <router-link to="/user/tickets" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
        <span class="text">My Tickets</span>
      </router-link>
      <div class="mt-8 mb-4 px-4">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Archived Tickets</p>
      </div>
      <router-link to="/user/completed-tickets" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span class="text">Completed Tickets</span>
      </router-link>
      
      <div class="my-4 border-t border-white/5 mx-2"></div>
      
      <router-link to="/user/edit-profile" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span class="text">Account Settings</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">Account & Security</h2>
        <p class="text-xs font-medium text-slate-500">Manage your profile and personal information</p>
      </div>
    </template>

    <template #main-content>
      <div class="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <!-- Profile Form Card -->
        <div class="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
          <div class="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
             <div class="flex items-center gap-4">
                <div class="relative group cursor-pointer" @click="triggerAvatarUpload" title="Click to change profile picture">
                  <input
                    type="file"
                    ref="avatarInputRef"
                    accept="image/png,image/jpeg,image/webp"
                    class="hidden"
                    @change="handleAvatarFileChange"
                  />
                  <div class="w-16 h-16 rounded-[1.25rem] overflow-hidden bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20 border-2 border-emerald-500/30">
                    <img v-if="avatarPreviewUrl" :src="avatarPreviewUrl" alt="Avatar" class="w-full h-full object-cover" />
                    <span v-else class="text-2xl font-black">{{ form.firstName ? form.firstName.charAt(0).toUpperCase() : 'U' }}</span>
                  </div>
                  <div class="absolute -bottom-1.5 -right-1.5 p-1.5 bg-white rounded-xl shadow-md border border-slate-200 text-slate-600 hover:text-emerald-600 transition-all group-hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                   <h3 class="text-lg font-black text-slate-900 tracking-tight">Personal Details</h3>
                   <p class="text-sm text-slate-500 font-medium">Click on avatar to upload photo, or update account details below</p>
                </div>
             </div>
             <div class="flex items-center gap-2">
                <span class="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-200">Active Account</span>
             </div>
          </div>

          <div class="p-8 md:p-12 space-y-10">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- First Name -->
              <div class="space-y-3">
                <label class="block text-sm font-black text-slate-900 uppercase tracking-widest ml-1">First Name</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-500 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input v-model="form.firstName" type="text" class="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none" placeholder="Enter first name">
                </div>
              </div>

              <!-- Last Name -->
              <div class="space-y-3">
                <label class="block text-sm font-black text-slate-900 uppercase tracking-widest ml-1">Last Name</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-500 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input v-model="form.lastName" type="text" class="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none" placeholder="Enter last name">
                </div>
              </div>

              <!-- Email -->
              <div class="space-y-3 md:col-span-2">
                <label class="block text-sm font-black text-slate-900 uppercase tracking-widest ml-1">Email Address</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-500 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input v-model="form.email" type="email" class="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none" placeholder="user@university.edu">
                </div>
              </div>

              <!-- Password -->
              <div class="space-y-3">
                <label class="block text-sm font-black text-slate-900 uppercase tracking-widest ml-1">New Password</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-500 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input v-model="form.password" :type="showPassword ? 'text' : 'password'" class="block w-full pl-12 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none" placeholder="Leave blank to keep current">
                  <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-emerald-600 transition-colors">
                    <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 013.111-5.184M9.9 4.314A10.198 10.198 0 0112 4c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l3.59 3.59m0 0A9.956 9.956 0 016.59 2.59M9 13a3 3 0 013-3m0 3a1.5 1.5 0 011.5 1.5" />
                    </svg>
                  </button>
                </div>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-1">Must be at least 8 characters if changing.</p>
              </div>

              <!-- Confirm Password -->
              <div class="space-y-3">
                <div class="flex items-center justify-between ml-1">
                  <label class="block text-sm font-black text-slate-900 uppercase tracking-widest">Confirm New Password</label>
                  <span v-if="form.password && form.confirmPassword" class="text-xs font-bold" :class="form.password === form.confirmPassword ? 'text-emerald-600' : 'text-rose-500'">
                    {{ form.password === form.confirmPassword ? '✓ Passwords match' : '✕ Do not match' }}
                  </span>
                </div>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-500 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <input v-model="form.confirmPassword" :type="showPassword ? 'text' : 'password'" class="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none" placeholder="Re-type new password">
                </div>
              </div>
            </div>

            <!-- Danger Zone -->
            <div class="pt-10 border-t border-slate-100">
               <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-red-50/50 rounded-[2rem] border border-red-100">
                  <div class="space-y-1">
                     <h4 class="text-base font-black text-red-600 tracking-tight">Deactivate Account</h4>
                     <p class="text-sm text-red-500/70 font-medium">Temporarily disable your account access.</p>
                  </div>
                  <button class="px-6 py-3 bg-white border border-red-200 text-red-600 font-bold rounded-[1.25rem] hover:bg-red-50 transition-all text-sm active:scale-95">
                    Deactivate
                  </button>
               </div>
            </div>
          </div>

          <div class="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-center">
            <button @click="handleSave" :disabled="isSaving" class="group relative px-12 py-5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-black rounded-3xl shadow-[0_10px_30px_rgba(5,150,105,0.2)] transition-all hover:-translate-y-1.5 active:translate-y-0 overflow-hidden w-full md:w-auto">
              <span v-if="!isSaving" class="relative z-10 flex items-center justify-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
                Save Profile Changes
              </span>
              <span v-else class="flex items-center justify-center gap-3">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving Changes...
              </span>
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
      toast.success('Profile avatar updated successfully!');
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
      toast.success('Profile updated successfully!');
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

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

input::placeholder {
  color: #94a3b8;
  font-weight: 500;
  letter-spacing: normal;
}
</style>
