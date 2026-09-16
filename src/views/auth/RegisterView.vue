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
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Password criteria checks (Elder-friendly: minimum 8 chars, letters and numbers, no special symbols required)
const passwordCriteria = computed(() => {
  const pwd = form.value.password || '';
  return {
    hasLength: pwd.length >= 8,
    hasLetter: /[a-zA-Z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
  };
});

const passwordStrengthScore = computed(() => {
  if (!form.value.password) return 0;
  let score = 0;
  if (passwordCriteria.value.hasLength) score++;
  if (passwordCriteria.value.hasLetter) score++;
  if (passwordCriteria.value.hasNumber) score++;
  return score;
});

const isPasswordValid = computed(() => {
  return (
    passwordCriteria.value.hasLength &&
    passwordCriteria.value.hasLetter &&
    passwordCriteria.value.hasNumber
  );
});

const isConfirmPasswordTouched = computed(() => form.value.password_confirm.length > 0);
const isPasswordMatch = computed(() => {
  return form.value.password && form.value.password_confirm && form.value.password === form.value.password_confirm;
});

// Role Switcher Handler
const handleRoleSelect = (selectedRole) => {
  if (form.value.role === selectedRole) return;
  form.value.role = selectedRole;
  form.value.student_id_number = '';
  if (fieldErrors.value.student_id_number) {
    delete fieldErrors.value.student_id_number;
  }
};

// Input Filters & Sanitizers
const handleFirstNameInput = (event) => {
  // Allow only letters (including accented letters), spaces, hyphens, periods, and apostrophes
  const cleaned = event.target.value.replace(/[^a-zA-ZÀ-ÿ\s\-'.]/g, '');
  form.value.first_name = cleaned;
  if (fieldErrors.value.first_name) {
    delete fieldErrors.value.first_name;
  }
};

const handleFirstNameBlur = () => {
  form.value.first_name = form.value.first_name.trim().replace(/\s+/g, ' ');
  const val = form.value.first_name;
  if (val && (val.length < 2 || !/[a-zA-ZÀ-ÿ]/.test(val))) {
    fieldErrors.value.first_name = 'First name must contain at least 2 letters.';
  }
};

const handleLastNameInput = (event) => {
  const cleaned = event.target.value.replace(/[^a-zA-ZÀ-ÿ\s\-'.]/g, '');
  form.value.last_name = cleaned;
  if (fieldErrors.value.last_name) {
    delete fieldErrors.value.last_name;
  }
};

const handleLastNameBlur = () => {
  form.value.last_name = form.value.last_name.trim().replace(/\s+/g, ' ');
  const val = form.value.last_name;
  if (val && (val.length < 2 || !/[a-zA-ZÀ-ÿ]/.test(val))) {
    fieldErrors.value.last_name = 'Last name must contain at least 2 letters.';
  }
};

const handleStudentIdInput = (event) => {
  if (form.value.role === 'student') {
    // Strict 7 digits only for student ID
    const digitsOnly = event.target.value.replace(/\D/g, '').slice(0, 7);
    form.value.student_id_number = digitsOnly;
  } else {
    // Employee: uppercase alphanumeric and hyphens, up to 15 chars
    const cleaned = event.target.value.replace(/[^a-zA-Z0-9\-]/g, '').toUpperCase().slice(0, 15);
    form.value.student_id_number = cleaned;
  }
  if (fieldErrors.value.student_id_number) {
    delete fieldErrors.value.student_id_number;
  }
};

const handleContactNumberInput = (event) => {
  // Philippine mobile numbers: strictly digits, max 11 digits (09XXXXXXXXX)
  const digitsOnly = event.target.value.replace(/\D/g, '').slice(0, 11);
  form.value.contact_number = digitsOnly;
  if (fieldErrors.value.contact_number) {
    delete fieldErrors.value.contact_number;
  }
};

const handleEmailBlur = () => {
  if (form.value.email.trim()) {
    form.value.email = form.value.email.trim().toLowerCase();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(form.value.email)) {
      fieldErrors.value.email = 'Please enter a valid email format (e.g. name@bsu.edu.ph).';
    } else if (fieldErrors.value.email) {
      delete fieldErrors.value.email;
    }
  } else if (fieldErrors.value.email) {
    delete fieldErrors.value.email;
  }
};

// File Upload Handlers
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

  const fileName = file.name || '';
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const validExts = ['jpg', 'jpeg', 'png', 'webp'];
  const validMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  const isExtValid = validExts.includes(ext);
  const isMimeValid = !file.type || validMimes.includes(file.type.toLowerCase()) || file.type.startsWith('image/');

  if (!isExtValid || !isMimeValid) {
    errorMessage.value = 'Please upload a valid image file (JPG, JPEG, PNG, or WebP only).';
    return;
  }

  // 5MB limit
  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = 'ID image size must not exceed 5MB.';
    return;
  }

  errorMessage.value = '';
  if (fieldErrors.value) {
    delete fieldErrors.value.id_card;
  }
  idCardFile.value = file;

  if (idCardPreview.value && idCardPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(idCardPreview.value);
  }

  try {
    idCardPreview.value = URL.createObjectURL(file);
  } catch {
    const reader = new FileReader();
    reader.onload = (e) => {
      idCardPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const removeSelectedFile = () => {
  if (idCardPreview.value && idCardPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(idCardPreview.value);
  }
  idCardFile.value = null;
  idCardPreview.value = null;
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

// Strict Client-Side Form Validation
const validateClient = () => {
  fieldErrors.value = {};
  errorMessage.value = '';

  // 1. First Name
  const fn = form.value.first_name.trim();
  if (!fn) {
    fieldErrors.value.first_name = 'First name is required.';
  } else if (fn.length < 2) {
    fieldErrors.value.first_name = 'First name must be at least 2 characters long.';
  } else if (!/^[a-zA-ZÀ-ÿ\s\-'.]{2,50}$/.test(fn) || !/[a-zA-ZÀ-ÿ]/.test(fn)) {
    fieldErrors.value.first_name = 'First name can only contain letters, spaces, hyphens, and apostrophes.';
  }

  // 2. Last Name
  const ln = form.value.last_name.trim();
  if (!ln) {
    fieldErrors.value.last_name = 'Last name is required.';
  } else if (ln.length < 2) {
    fieldErrors.value.last_name = 'Last name must be at least 2 characters long.';
  } else if (!/^[a-zA-ZÀ-ÿ\s\-'.]{2,50}$/.test(ln) || !/[a-zA-ZÀ-ÿ]/.test(ln)) {
    fieldErrors.value.last_name = 'Last name can only contain letters, spaces, hyphens, and apostrophes.';
  }

  // 3. ID Number (Strict 7 digits for students)
  const idNum = form.value.student_id_number.trim();
  if (!idNum) {
    fieldErrors.value.student_id_number = form.value.role === 'student' 
      ? 'Student ID Number is required.' 
      : 'Employee ID Number is required.';
  } else if (form.value.role === 'student') {
    if (!/^\d{7}$/.test(idNum)) {
      fieldErrors.value.student_id_number = 'Student ID Number must be exactly 7 digits (e.g. 2301219).';
    }
  } else {
    if (!/^[A-Za-z0-9\-]{4,15}$/.test(idNum)) {
      fieldErrors.value.student_id_number = 'Employee ID Number must be 4 to 15 alphanumeric characters (e.g. EMP-9876).';
    }
  }

  // 4. Contact Number (Strict 11 digits starting with 09)
  const contact = form.value.contact_number.trim();
  if (!contact) {
    fieldErrors.value.contact_number = 'Contact number is required.';
  } else if (!contact.startsWith('09')) {
    fieldErrors.value.contact_number = 'Contact number must start with 09 (e.g. 09171234567).';
  } else if (!/^09\d{9}$/.test(contact)) {
    fieldErrors.value.contact_number = 'Contact number must be exactly 11 digits (e.g. 09171234567).';
  }

  // 5. Email (Optional, but if provided, must be valid RFC format)
  const em = form.value.email.trim();
  if (em) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(em)) {
      fieldErrors.value.email = 'Please enter a valid email address (e.g. name@bsu.edu.ph) or leave blank.';
    }
  }

  // 6. Password (Elder-friendly: min 8 chars, letters and numbers, no special symbols required)
  const pwd = form.value.password;
  if (!pwd) {
    fieldErrors.value.password = 'Password is required.';
  } else if (pwd.length < 8) {
    fieldErrors.value.password = 'Password must be at least 8 characters long.';
  } else if (!/[a-zA-Z]/.test(pwd)) {
    fieldErrors.value.password = 'Password must include at least one letter.';
  } else if (!/[0-9]/.test(pwd)) {
    fieldErrors.value.password = 'Password must include at least one number.';
  }

  // 7. Confirm Password
  if (!form.value.password_confirm) {
    fieldErrors.value.password_confirm = 'Please confirm your password.';
  } else if (form.value.password !== form.value.password_confirm) {
    fieldErrors.value.password_confirm = 'Passwords do not match.';
  }

  // 8. ID Card Photo
  if (!idCardFile.value) {
    fieldErrors.value.id_card = 'Please upload a clear photo of your Student or Employee ID card for identity verification.';
  }

  return Object.keys(fieldErrors.value).length === 0;
};

const handleRegister = async () => {
  if (!validateClient()) {
    errorMessage.value = 'Please correct the highlighted form errors before continuing.';
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

    const isSuccess = response.data?.status === true || 
                      response.data?.status === 'success' || 
                      Boolean(response.data?.data?.user) || 
                      Boolean(response.data?.user);

    if (isSuccess) {
      const userIdentifier = form.value.student_id_number || form.value.contact_number || form.value.email;
      await router.push({
        path: '/login',
        query: {
          registered: '1',
          identifier: userIdentifier || undefined
        }
      });
      return;
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
          Register with your verified student or employee credentials to access campus services and track tickets.
        </p>
      </div>

      <!-- Global Error Message -->
      <div v-if="errorMessage" class="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs sm:text-sm font-semibold flex items-start gap-3">
        <svg class="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>{{ errorMessage }}</div>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-5" novalidate>
        
        <!-- Role Selector Toggle -->
        <div>
          <label class="block text-slate-600 text-[11px] font-black uppercase tracking-wider mb-1.5">
            Account Classification <span class="text-rose-500">*</span>
          </label>
          <div class="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
            <button 
              type="button" 
              @click="handleRoleSelect('student')"
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
              @click="handleRoleSelect('employee')"
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
            <div class="flex items-center justify-between mb-1">
              <label class="block text-slate-600 text-[11px] font-black uppercase tracking-wider">
                First Name <span class="text-rose-500">*</span>
              </label>
              <span class="text-[10px] text-slate-400 font-medium">Letters only</span>
            </div>
            <input 
              v-model="form.first_name"
              type="text" 
              autocomplete="given-name"
              maxlength="50"
              spellcheck="false"
              required
              @input="handleFirstNameInput"
              @blur="handleFirstNameBlur"
              :class="fieldErrors.first_name ? 'border-rose-300 ring-1 ring-rose-500/20 bg-rose-50/20' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-slate-50 focus:bg-white'"
              class="w-full px-4 py-2.5 rounded-xl border text-slate-900 text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none transition-all"
              placeholder="e.g. Juan"
            />
            <p v-if="fieldErrors.first_name" class="mt-1 text-[11px] text-rose-500 font-medium flex items-center gap-1">
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
              {{ fieldErrors.first_name }}
            </p>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-slate-600 text-[11px] font-black uppercase tracking-wider">
                Last Name <span class="text-rose-500">*</span>
              </label>
              <span class="text-[10px] text-slate-400 font-medium">Letters only</span>
            </div>
            <input 
              v-model="form.last_name"
              type="text" 
              autocomplete="family-name"
              maxlength="50"
              spellcheck="false"
              required
              @input="handleLastNameInput"
              @blur="handleLastNameBlur"
              :class="fieldErrors.last_name ? 'border-rose-300 ring-1 ring-rose-500/20 bg-rose-50/20' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-slate-50 focus:bg-white'"
              class="w-full px-4 py-2.5 rounded-xl border text-slate-900 text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none transition-all"
              placeholder="e.g. Dela Cruz"
            />
            <p v-if="fieldErrors.last_name" class="mt-1 text-[11px] text-rose-500 font-medium flex items-center gap-1">
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
              {{ fieldErrors.last_name }}
            </p>
          </div>
        </div>

        <!-- Identifier & Contact Fields -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <!-- ID Number (Strict 7 digits for students) -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-slate-600 text-[11px] font-black uppercase tracking-wider">
                {{ form.role === 'student' ? 'Student ID Number' : 'Employee ID Number' }} <span class="text-rose-500">*</span>
              </label>
              <span 
                v-if="form.role === 'student'" 
                :class="form.student_id_number.length === 7 ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-slate-500 bg-slate-100 border-slate-200'"
                class="text-[10px] font-bold px-1.5 py-0.5 rounded border transition-colors"
              >
                {{ form.student_id_number.length }}/7 digits
              </span>
              <span v-else class="text-[10px] text-slate-400 font-medium">
                Alphanumeric
              </span>
            </div>
            <input 
              v-model="form.student_id_number"
              type="text" 
              :inputmode="form.role === 'student' ? 'numeric' : 'text'"
              :maxlength="form.role === 'student' ? 7 : 15"
              required
              @input="handleStudentIdInput"
              :class="fieldErrors.student_id_number ? 'border-rose-300 ring-1 ring-rose-500/20 bg-rose-50/20' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-slate-50 focus:bg-white'"
              class="w-full px-4 py-2.5 rounded-xl border text-slate-900 text-xs sm:text-sm font-semibold tracking-wider placeholder-slate-400 focus:outline-none transition-all"
              :placeholder="form.role === 'student' ? 'e.g. 2301219' : 'e.g. EMP-9876'"
            />
            <p v-if="fieldErrors.student_id_number" class="mt-1 text-[11px] text-rose-500 font-medium flex items-center gap-1">
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
              {{ fieldErrors.student_id_number }}
            </p>
            <p v-else class="mt-1 text-[10px] text-slate-400">
              {{ form.role === 'student' ? 'Strict 7-digit institutional student ID (numbers only).' : 'Institutional employee or faculty ID code.' }}
            </p>
          </div>

          <!-- Contact Number (Strict 11 digits starting with 09) -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-slate-600 text-[11px] font-black uppercase tracking-wider">
                Contact Number <span class="text-rose-500">*</span>
              </label>
              <span 
                :class="form.contact_number.length === 11 && form.contact_number.startsWith('09') ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-slate-500 bg-slate-100 border-slate-200'"
                class="text-[10px] font-bold px-1.5 py-0.5 rounded border transition-colors"
              >
                {{ form.contact_number.length }}/11 digits
              </span>
            </div>
            <input 
              v-model="form.contact_number"
              type="tel" 
              inputmode="numeric"
              maxlength="11"
              autocomplete="tel"
              required
              @input="handleContactNumberInput"
              :class="fieldErrors.contact_number ? 'border-rose-300 ring-1 ring-rose-500/20 bg-rose-50/20' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-slate-50 focus:bg-white'"
              class="w-full px-4 py-2.5 rounded-xl border text-slate-900 text-xs sm:text-sm font-semibold tracking-wider placeholder-slate-400 focus:outline-none transition-all"
              placeholder="e.g. 09171234567"
            />
            <p v-if="fieldErrors.contact_number" class="mt-1 text-[11px] text-rose-500 font-medium flex items-center gap-1">
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
              {{ fieldErrors.contact_number }}
            </p>
            <p v-else class="mt-1 text-[10px] text-slate-400">
              Philippine mobile number starting with 09 (numbers only).
            </p>
          </div>
        </div>

        <!-- Email Address (Optional) -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block text-slate-600 text-[11px] font-black uppercase tracking-wider">
              Email Address
            </label>
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              Optional
            </span>
          </div>
          <input 
            v-model="form.email"
            type="email" 
            autocomplete="email"
            spellcheck="false"
            maxlength="100"
            @blur="handleEmailBlur"
            :class="fieldErrors.email ? 'border-rose-300 ring-1 ring-rose-500/20 bg-rose-50/20' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-slate-50 focus:bg-white'"
            class="w-full px-4 py-2.5 rounded-xl border text-slate-900 text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none transition-all"
            placeholder="e.g. juan.delacruz@bsu.edu.ph"
          />
          <p v-if="fieldErrors.email" class="mt-1 text-[11px] text-rose-500 font-medium flex items-center gap-1">
            <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
            {{ fieldErrors.email }}
          </p>
          <p v-else class="mt-1 text-[11px] text-slate-500 font-normal">
            You can leave this blank if you do not have an active email. You can log in using your ID Number or Contact Number.
          </p>
        </div>

        <!-- Password Fields -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <!-- Password Input -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-slate-600 text-[11px] font-black uppercase tracking-wider">
                Password <span class="text-rose-500">*</span>
              </label>
              <button 
                type="button" 
                @click="showPassword = !showPassword"
                class="text-[10px] font-bold uppercase text-slate-400 hover:text-emerald-700 transition-colors flex items-center gap-1"
              >
                <span>{{ showPassword ? 'Hide' : 'Show' }}</span>
              </button>
            </div>
            <div class="relative">
              <input 
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'" 
                autocomplete="new-password"
                maxlength="64"
                required
                :class="fieldErrors.password ? 'border-rose-300 ring-1 ring-rose-500/20 bg-rose-50/20' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-slate-50 focus:bg-white'"
                class="w-full px-4 py-2.5 rounded-xl border text-slate-900 text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none transition-all"
                placeholder="Minimum 8 characters"
              />
            </div>
            <p v-if="fieldErrors.password" class="mt-1 text-[11px] text-rose-500 font-medium flex items-center gap-1">
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
              {{ fieldErrors.password }}
            </p>
          </div>

          <!-- Confirm Password Input -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-slate-600 text-[11px] font-black uppercase tracking-wider">
                Confirm Password <span class="text-rose-500">*</span>
              </label>
              <button 
                type="button" 
                @click="showConfirmPassword = !showConfirmPassword"
                class="text-[10px] font-bold uppercase text-slate-400 hover:text-emerald-700 transition-colors flex items-center gap-1"
              >
                <span>{{ showConfirmPassword ? 'Hide' : 'Show' }}</span>
              </button>
            </div>
            <div class="relative">
              <input 
                v-model="form.password_confirm"
                :type="showConfirmPassword ? 'text' : 'password'" 
                autocomplete="new-password"
                maxlength="64"
                required
                :class="fieldErrors.password_confirm ? 'border-rose-300 ring-1 ring-rose-500/20 bg-rose-50/20' : (isPasswordMatch ? 'border-emerald-300 ring-1 ring-emerald-500/20' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-slate-50 focus:bg-white')"
                class="w-full px-4 py-2.5 rounded-xl border text-slate-900 text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none transition-all"
                placeholder="Re-enter password"
              />
            </div>
            
            <!-- Real-time match indicator -->
            <div v-if="isConfirmPasswordTouched" class="mt-1">
              <p v-if="isPasswordMatch" class="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                Passwords match
              </p>
              <p v-else class="text-[11px] text-rose-500 font-medium flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                Passwords do not match
              </p>
            </div>
            <p v-else-if="fieldErrors.password_confirm" class="mt-1 text-[11px] text-rose-500 font-medium flex items-center gap-1">
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
              {{ fieldErrors.password_confirm }}
            </p>
          </div>
        </div>

        <!-- Elder-Friendly Password Requirements Card (No special characters required) -->
        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Password Checklist
            </span>
            <span class="text-[10px] text-slate-500 font-medium">Simple & Easy to Remember</span>
          </div>

          <!-- Progress Bar Indicator -->
          <div class="grid grid-cols-3 gap-1.5 mb-2.5">
            <div 
              :class="passwordStrengthScore >= 1 ? 'bg-amber-500' : 'bg-slate-200'" 
              class="h-1.5 rounded-full transition-colors duration-300"
            ></div>
            <div 
              :class="passwordStrengthScore >= 2 ? 'bg-amber-500' : 'bg-slate-200'" 
              class="h-1.5 rounded-full transition-colors duration-300"
            ></div>
            <div 
              :class="passwordStrengthScore === 3 ? 'bg-emerald-500' : 'bg-slate-200'" 
              class="h-1.5 rounded-full transition-colors duration-300"
            ></div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div 
              :class="passwordCriteria.hasLength ? 'text-emerald-700 font-semibold' : 'text-slate-500'" 
              class="flex items-center gap-1.5 transition-colors"
            >
              <svg v-if="passwordCriteria.hasLength" class="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
              <span v-else class="w-1.5 h-1.5 rounded-full bg-slate-300 mx-1 flex-shrink-0"></span>
              At least 8 characters
            </div>

            <div 
              :class="passwordCriteria.hasLetter ? 'text-emerald-700 font-semibold' : 'text-slate-500'" 
              class="flex items-center gap-1.5 transition-colors"
            >
              <svg v-if="passwordCriteria.hasLetter" class="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
              <span v-else class="w-1.5 h-1.5 rounded-full bg-slate-300 mx-1 flex-shrink-0"></span>
              Contains letters (A-Z)
            </div>

            <div 
              :class="passwordCriteria.hasNumber ? 'text-emerald-700 font-semibold' : 'text-slate-500'" 
              class="flex items-center gap-1.5 transition-colors"
            >
              <svg v-if="passwordCriteria.hasNumber" class="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
              <span v-else class="w-1.5 h-1.5 rounded-full bg-slate-300 mx-1 flex-shrink-0"></span>
              Contains numbers (0-9)
            </div>
          </div>
          <p class="mt-2 text-[10px] text-slate-400 italic">
            Note: Special symbols (like @, #, $) are optional so elderly and non-technical users can log in easily.
          </p>
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

          <!-- Single Hidden File Input -->
          <input 
            ref="fileInputRef"
            type="file" 
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" 
            class="hidden" 
            @change="handleFileSelect"
          />

          <!-- Drag and Drop Box -->
          <div 
            v-if="!idCardPreview"
            @dragover.prevent 
            @drop="handleDrop"
            @click="$refs.fileInputRef?.click()"
            class="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/70 hover:bg-emerald-50/20 rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 group"
          >
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
                  @click="$refs.fileInputRef?.click()" 
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
          </div>
          <p v-if="fieldErrors.id_card" class="mt-1.5 text-[11px] text-rose-500 font-medium flex items-center gap-1">
            <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
            {{ fieldErrors.id_card }}
          </p>
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
