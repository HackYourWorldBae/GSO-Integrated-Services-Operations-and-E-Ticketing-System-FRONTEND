<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { register as apiRegister } from '@/api/auth';

const router = useRouter();

// Form Fields
const form = ref({
  first_name: '',
  last_name: '',
  role: 'student', // 'student' or 'employee'
  student_id_number: '',
  contact_number: '',
  email: '',
  password: '',
  password_confirm: '',
});

const idCardFile = ref(null);
const idCardPreview = ref(null);
const fileInputRef = ref(null);

// UI State
const isLoading = ref(false);
const errorMessage = ref('');
const fieldErrors = ref({});
const isSuccess = ref(false);
const showPassword = ref(false);

const handleFileSelect = (event) => {
  const file = event.target.files?.[0];
  processSelectedFile(file);
};

const handleDrop = (event) => {
  event.preventDefault();
  const file = event.dataTransfer.files?.[0];
  processSelectedFile(file);
};

const processSelectedFile = (file) => {
  if (!file) return;

  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    errorMessage.value = 'Please select a valid image file (JPG, PNG, or WebP).';
    return;
  }

  // 5MB limit
  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = 'ID image size must not exceed 5MB.';
    return;
  }

  errorMessage.value = '';
  idCardFile.value = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    idCardPreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const removeSelectedFile = () => {
  idCardFile.value = null;
  idCardPreview.value = null;
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

const validateClient = () => {
  fieldErrors.value = {};
  errorMessage.value = '';

  if (!form.value.first_name.trim()) {
    fieldErrors.value.first_name = 'First name is required.';
  }
  if (!form.value.last_name.trim()) {
    fieldErrors.value.last_name = 'Last name is required.';
  }
  if (!form.value.student_id_number.trim()) {
    fieldErrors.value.student_id_number = form.value.role === 'student' ? 'Student ID Number is required.' : 'Employee ID Number is required.';
  }
  if (!form.value.contact_number.trim()) {
    fieldErrors.value.contact_number = 'Contact number is required.';
  }
  if (!form.value.password) {
    fieldErrors.value.password = 'Password is required.';
  } else if (form.value.password.length < 8) {
    fieldErrors.value.password = 'Password must be at least 8 characters long.';
  }
  if (form.value.password !== form.value.password_confirm) {
    fieldErrors.value.password_confirm = 'Passwords do not match.';
  }
  if (!idCardFile.value) {
    fieldErrors.value.id_card = 'Please upload a clear photo of your Student or Employee ID card for identity verification.';
  }

  return Object.keys(fieldErrors.value).length === 0;
};

const handleRegister = async () => {
  if (!validateClient()) {
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const formData = new FormData();
    formData.append('first_name', form.value.first_name.trim());
    formData.append('last_name', form.value.last_name.trim());
    formData.append('role', form.value.role);
    formData.append('student_id_number', form.value.student_id_number.trim());
    formData.append('contact_number', form.value.contact_number.trim());
    
    if (form.value.email.trim()) {
      formData.append('email', form.value.email.trim().toLowerCase());
    }
    
    formData.append('password', form.value.password);
    formData.append('password_confirm', form.value.password_confirm);
    formData.append('id_card_image', idCardFile.value);

    const response = await apiRegister(formData);

    if (response.data?.status === 'success' || response.data?.user) {
      isSuccess.value = true;
    } else {
      errorMessage.value = response.data?.message || 'Registration failed. Please review your information.';
    }
  } catch (err) {
    if (err.response?.data?.errors) {
      fieldErrors.value = err.response.data.errors;
      errorMessage.value = err.response.data.message || 'Please correct the highlighted errors.';
    } else if (err.response?.data?.message) {
      errorMessage.value = err.response.data.message;
    } else {
      errorMessage.value = 'Failed to submit registration. Please check your connection and try again.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen w-full relative flex items-center justify-center bg-slate-50 py-10 px-4 sm:px-6 font-sans">
    
    <!-- Background Image & Gradient -->
    <div class="fixed inset-0 z-0 overflow-hidden bg-slate-50 pointer-events-none">
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Benguet_State_University_Main_Gate.jpg" 
        alt="" 
        class="w-full h-full object-cover opacity-15 filter grayscale"
      />
      <div class="absolute inset-0 bg-gradient-to-br from-white/70 via-slate-50/85 to-white z-0"></div>
    </div>

    <!-- Floating UI Orbs for depth -->
    <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
      <div class="absolute w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-[100px] mix-blend-multiply"></div>
      <div class="absolute w-[700px] h-[700px] bg-sky-400/5 rounded-full blur-[120px] mix-blend-multiply"></div>
    </div>

    <!-- Top Left University Branding -->
    <router-link to="/" class="fixed top-6 left-6 sm:top-8 sm:left-10 z-20 flex items-center gap-4 drop-shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
      <div class="w-14 h-14 sm:w-16 sm:h-16 overflow-hidden flex-shrink-0">
        <img src="/bsu-logo.png" alt="BSU Logo" class="w-full h-full object-cover rounded-full" />
      </div>
      <div class="hidden sm:block">
        <h2 class="text-emerald-800 font-extrabold tracking-widest text-xs uppercase mb-0.5 drop-shadow-md">Benguet State University</h2>
        <p class="text-slate-700 font-bold text-[11px] tracking-wide drop-shadow-md">General Services Office</p>
      </div>
    </router-link>

    <!-- Main Registration Card -->
    <div class="relative z-10 w-full max-w-2xl my-8 p-6 sm:p-10 rounded-[2rem] border border-slate-200/80 bg-white/95 backdrop-blur-2xl shadow-2xl transition-all duration-300">
      
      <!-- Success Modal Overlay -->
      <div v-if="isSuccess" class="text-center py-8 animate-fade-in">
        <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Registration Submitted!</h2>
        <p class="text-slate-600 text-sm max-w-md mx-auto mb-6 leading-relaxed">
          Your account has been created. You can log in right away with your ID Number or Contact Number.
        </p>
        <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-left max-w-md mx-auto mb-8 flex gap-3">
          <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <span class="font-bold block mb-0.5">Verification Note:</span>
            Your uploaded ID is being queued for review by the Super Administrator. Once verified, you will be authorized to submit official GSO service requests.
          </div>
        </div>
        <button 
          @click="router.push('/login')" 
          class="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-xl shadow-slate-900/20 transform hover:-translate-y-0.5 active:scale-[0.98] transition-all"
        >
          Proceed to Sign In
        </button>
      </div>

      <!-- Registration Form -->
      <div v-else>
        <!-- Card Header -->
        <div class="mb-6 text-left">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[11px] font-bold uppercase tracking-wider mb-2.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            User Registration & Identity Verification
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-2">
            Create your <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">GSO Account</span>
          </h1>
          <p class="text-slate-500 text-xs sm:text-sm font-medium">
            Register as a student or employee to access services, track requests, and report campus concerns.
          </p>
        </div>

        <!-- Global Error Message -->
        <div v-if="errorMessage" class="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs sm:text-sm font-semibold flex items-start gap-3">
          <svg class="w-5 h-5 flex-shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>{{ errorMessage }}</div>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-5">
          
          <!-- Role Selector Toggle -->
          <div>
            <label class="block text-slate-600 text-[11px] font-black uppercase tracking-wider mb-1.5">
              Account Classification <span class="text-rose-500">*</span>
            </label>
            <div class="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
              <button 
                type="button" 
                @click="form.role = 'student'"
                :class="form.role === 'student' ? 'bg-white text-emerald-800 font-bold shadow-sm border border-emerald-200/50' : 'text-slate-600 hover:text-slate-900 font-medium'"
                class="py-2.5 rounded-lg text-xs transition-all flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
                BSU Student
              </button>
              <button 
                type="button" 
                @click="form.role = 'employee'"
                :class="form.role === 'employee' ? 'bg-white text-emerald-800 font-bold shadow-sm border border-emerald-200/50' : 'text-slate-600 hover:text-slate-900 font-medium'"
                class="py-2.5 rounded-lg text-xs transition-all flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                BSU Faculty / Staff
              </button>
            </div>
          </div>

          <!-- Name Fields (Two Columns) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-slate-600 text-[11px] font-black uppercase tracking-wider mb-1">
                First Name <span class="text-rose-500">*</span>
              </label>
              <input 
                v-model="form.first_name"
                type="text" 
                required
                class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
                placeholder="e.g. Juan"
              />
              <p v-if="fieldErrors.first_name" class="mt-1 text-[11px] text-rose-500 font-medium">{{ fieldErrors.first_name }}</p>
            </div>

            <div>
              <label class="block text-slate-600 text-[11px] font-black uppercase tracking-wider mb-1">
                Last Name <span class="text-rose-500">*</span>
              </label>
              <input 
                v-model="form.last_name"
                type="text" 
                required
                class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
                placeholder="e.g. Dela Cruz"
              />
              <p v-if="fieldErrors.last_name" class="mt-1 text-[11px] text-rose-500 font-medium">{{ fieldErrors.last_name }}</p>
            </div>
          </div>

          <!-- Identifier & Contact Fields -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-slate-600 text-[11px] font-black uppercase tracking-wider mb-1">
                {{ form.role === 'student' ? 'Student ID Number' : 'Employee ID Number' }} <span class="text-rose-500">*</span>
              </label>
              <input 
                v-model="form.student_id_number"
                type="text" 
                required
                class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
                :placeholder="form.role === 'student' ? 'e.g. 2024-1234' : 'e.g. EMP-9876'"
              />
              <p v-if="fieldErrors.student_id_number" class="mt-1 text-[11px] text-rose-500 font-medium">{{ fieldErrors.student_id_number }}</p>
            </div>

            <div>
              <label class="block text-slate-600 text-[11px] font-black uppercase tracking-wider mb-1">
                Contact Number <span class="text-rose-500">*</span>
              </label>
              <input 
                v-model="form.contact_number"
                type="tel" 
                required
                class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
                placeholder="e.g. 09171234567"
              />
              <p v-if="fieldErrors.contact_number" class="mt-1 text-[11px] text-rose-500 font-medium">{{ fieldErrors.contact_number }}</p>
            </div>
          </div>

          <!-- Email Address (Optional) -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-slate-600 text-[11px] font-black uppercase tracking-wider">
                Email Address
              </label>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                Optional
              </span>
            </div>
            <input 
              v-model="form.email"
              type="email" 
              class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
              placeholder="e.g. juan.delacruz@bsu.edu.ph"
            />
            <p class="mt-1 text-[11px] text-slate-500 font-normal">
              You can leave this blank if you do not have an active email address. You can log in using your ID Number or Contact Number.
            </p>
            <p v-if="fieldErrors.email" class="mt-1 text-[11px] text-rose-500 font-medium">{{ fieldErrors.email }}</p>
          </div>

          <!-- Password Fields -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-slate-600 text-[11px] font-black uppercase tracking-wider">
                  Password <span class="text-rose-500">*</span>
                </label>
                <button 
                  type="button" 
                  @click="showPassword = !showPassword"
                  class="text-[10px] font-bold uppercase text-slate-400 hover:text-emerald-700 transition-colors"
                >
                  {{ showPassword ? 'Hide' : 'Show' }}
                </button>
              </div>
              <input 
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'" 
                required
                class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
                placeholder="Min. 8 characters"
              />
              <p v-if="fieldErrors.password" class="mt-1 text-[11px] text-rose-500 font-medium">{{ fieldErrors.password }}</p>
            </div>

            <div>
              <label class="block text-slate-600 text-[11px] font-black uppercase tracking-wider mb-1">
                Confirm Password <span class="text-rose-500">*</span>
              </label>
              <input 
                v-model="form.password_confirm"
                :type="showPassword ? 'text' : 'password'" 
                required
                class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
                placeholder="Re-enter password"
              />
              <p v-if="fieldErrors.password_confirm" class="mt-1 text-[11px] text-rose-500 font-medium">{{ fieldErrors.password_confirm }}</p>
            </div>
          </div>

          <!-- Mandatory ID Card Upload Section -->
          <div class="pt-2 border-t border-slate-200/80">
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-slate-700 text-xs font-black uppercase tracking-wider">
                Identity Verification: {{ form.role === 'student' ? 'Student ID Card' : 'Employee ID Card' }} Photo <span class="text-rose-500">*</span>
              </label>
              <span class="text-[10px] text-slate-500 font-medium">Max 5MB (JPG, PNG, WebP)</span>
            </div>
            <p class="text-xs text-slate-500 mb-3">
              Please provide a clear, readable snapshot or scan of your institutional ID card. The Super Administrator will inspect this photo to verify your identity.
            </p>

            <!-- Drag and Drop Box -->
            <div 
              v-if="!idCardPreview"
              @dragover.prevent 
              @drop="handleDrop"
              @click="$refs.fileInputRef.click()"
              class="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/70 hover:bg-emerald-50/20 rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 group"
            >
              <input 
                ref="fileInputRef"
                type="file" 
                accept="image/jpeg,image/png,image/webp" 
                class="hidden" 
                @change="handleFileSelect"
              />
              <div class="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p class="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-700">
                Click to upload or drag & drop your ID picture
              </p>
              <p class="text-[11px] text-slate-500 mt-1">
                Make sure details, photo, and ID number are clearly visible
              </p>
            </div>

            <!-- Preview Card -->
            <div v-else class="relative rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-col sm:flex-row items-center gap-4">
              <div class="w-32 h-24 sm:w-40 sm:h-28 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 flex-shrink-0 shadow-sm relative group">
                <img :src="idCardPreview" alt="ID Preview" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 text-left">
                <div class="flex items-center gap-2 mb-1">
                  <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <p class="text-xs font-bold text-slate-800 truncate max-w-[200px] sm:max-w-xs">{{ idCardFile?.name }}</p>
                </div>
                <p class="text-[11px] text-slate-500 mb-3">
                  Size: {{ (idCardFile?.size / (1024 * 1024)).toFixed(2) }} MB • Ready for submission
                </p>
                <div class="flex items-center gap-2">
                  <button 
                    type="button" 
                    @click="$refs.fileInputRef.click()" 
                    class="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white border border-slate-200 hover:border-emerald-300 px-3 py-1.5 rounded-lg shadow-sm transition-all"
                  >
                    Change Picture
                  </button>
                  <button 
                    type="button" 
                    @click="removeSelectedFile" 
                    class="text-xs font-bold text-rose-600 hover:text-rose-700 bg-white border border-slate-200 hover:border-rose-300 px-3 py-1.5 rounded-lg shadow-sm transition-all"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <input 
                ref="fileInputRef"
                type="file" 
                accept="image/jpeg,image/png,image/webp" 
                class="hidden" 
                @change="handleFileSelect"
              />
            </div>
            <p v-if="fieldErrors.id_card" class="mt-1.5 text-[11px] text-rose-500 font-medium">{{ fieldErrors.id_card }}</p>
          </div>

          <!-- Informative Card Notice -->
          <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 leading-relaxed flex items-start gap-2.5">
            <svg class="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <span class="font-bold text-slate-800">Account Access:</span>
              Once registered, you can log in immediately to explore the GSO portal. Official service ticket intake will be authorized following ID verification by the Super Administrator.
            </div>
          </div>

          <!-- Submit Button -->
          <button 
            :disabled="isLoading"
            type="submit"
            class="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-xl shadow-slate-900/20 transform hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isLoading">Complete Registration & Verify ID</span>
            <span v-else>Submitting Verification...</span>
            <svg v-if="!isLoading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <svg v-else class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>

          <!-- Back to Login Link -->
          <div class="text-center pt-2">
            <p class="text-xs text-slate-500 font-medium">
              Already have an account? 
              <router-link to="/login" class="text-emerald-700 hover:text-emerald-800 font-bold hover:underline transition-all">
                Sign In here
              </router-link>
            </p>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
