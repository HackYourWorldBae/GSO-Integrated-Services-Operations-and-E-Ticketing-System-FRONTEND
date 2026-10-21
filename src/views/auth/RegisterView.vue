<script setup>
import { ref, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { register as apiRegister } from '@/api/auth';
import { BSU_COLLEGES } from '@/constants/colleges';
import { ADMIN_SUPPORT_BUILDINGS, RESEARCH_EXTENSION_BUILDINGS } from '@/constants/locations';
import RegisterPrivacyModal from '@/components/auth/RegisterPrivacyModal.vue';
import IdUploadDropzone from '@/components/auth/IdUploadDropzone.vue';
import {
  checkPasswordCriteria,
  calculatePasswordStrength,
  validateImageFile,
  validateRegistrationForm,
} from '@/utils/registrationValidator';

const router = useRouter();

// Form Fields
const form = ref({
  first_name: '',
  last_name: '',
  role: 'student', // 'student' or 'employee'
  student_type: 'rso', // 'rso' or 'ssg'
  organization_name: '',
  employee_type: '', // 'Teaching Staff', 'Research and Extension Staff', 'Support / Administrative Staff'
  college: '',
  student_id_number: '',
  contact_number: '',
  email: '',
  password: '',
  password_confirm: '',
});

// UI State
const isLoading = ref(false);
const errorMessage = ref('');
const fieldErrors = ref({});
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const showDisclaimerModal = ref(false);
const hasAgreedToDisclaimer = ref(false);
const isDisclaimerTouched = ref(false);

// Password criteria checks (Elder-friendly: minimum 8 chars, letters and numbers, no special symbols required)
const passwordCriteria = computed(() => checkPasswordCriteria(form.value.password));
const passwordStrengthScore = computed(() => calculatePasswordStrength(form.value.password));
const isPasswordValid = computed(() => {
  const c = passwordCriteria.value;
  return c.hasLength && c.hasLetter && c.hasNumber;
});

const isConfirmPasswordTouched = computed(() => form.value.password_confirm.length > 0);
const isPasswordMatch = computed(() => {
  return form.value.password && form.value.password_confirm && form.value.password === form.value.password_confirm;
});

// Role Switcher Handler
const handleRoleSelect = (selectedRole) => {
  if (form.value.role === selectedRole) return;
  form.value.role = selectedRole;
  
  // Clear role-specific fields
  form.value.student_id_number = '';
  form.value.college = '';
  form.value.organization_name = '';
  form.value.student_type = 'rso'; // Reset to default
  form.value.employee_type = '';
  
  // Clear related field errors
  if (fieldErrors.value.college) delete fieldErrors.value.college;
  if (fieldErrors.value.employee_type) delete fieldErrors.value.employee_type;
  if (fieldErrors.value.student_id_number) delete fieldErrors.value.student_id_number;
  if (fieldErrors.value.student_type) delete fieldErrors.value.student_type;
  if (fieldErrors.value.organization_name) delete fieldErrors.value.organization_name;
};

// Employee / Staff Type Switcher Handler
const handleEmployeeTypeSelect = (selectedType) => {
  if (form.value.employee_type === selectedType) return;
  form.value.employee_type = selectedType;
  form.value.college = '';
  if (fieldErrors.value.college) delete fieldErrors.value.college;
  if (fieldErrors.value.employee_type) delete fieldErrors.value.employee_type;
};

const handleCollegeChange = () => {
  if (fieldErrors.value.college) {
    delete fieldErrors.value.college;
  }
};

// Student Type Switcher Handler (RSO or SSG)
const handleStudentTypeSelect = (selectedType) => {
  if (form.value.student_type === selectedType) return;
  form.value.student_type = selectedType;
  if (fieldErrors.value.student_type) delete fieldErrors.value.student_type;
  if (fieldErrors.value.organization_name) delete fieldErrors.value.organization_name;
};

const handleOrganizationNameInput = (event) => {
  form.value.organization_name = event.target.value;
  if (fieldErrors.value.organization_name) {
    delete fieldErrors.value.organization_name;
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
  const trimmed = form.value.email.trim().toLowerCase();
  form.value.email = trimmed;
  if (!trimmed) {
    fieldErrors.value.email = 'Email address is required for password recovery and notifications.';
    return;
  }
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(trimmed)) {
    fieldErrors.value.email = 'Please enter a valid email format (e.g. name@bsu.edu.ph).';
  } else if (fieldErrors.value.email) {
    delete fieldErrors.value.email;
  }
};

// File Upload Handlers (Front ID + Selfie with ID - limited to 2 files)
const idCardFile = ref(null);
const idCardPreview = ref(null);
const fileInputRef = ref(null);

const idSelfieFile = ref(null);
const idSelfiePreview = ref(null);
const selfieInputRef = ref(null);

const handleFileSelect = (event, slot = 'front') => {
  const file = event.target.files?.[0];
  if (!file) return;
  processSelectedFile(file, slot);
};

const handleSectionDrop = (event) => {
  event.preventDefault();
  const rawFiles = Array.from(event.dataTransfer.files || []);
  if (rawFiles.length === 0) return;

  if (rawFiles.length > 2) {
    errorMessage.value = 'Upload limited to 2 files only: (1) Front ID and (2) Selfie holding ID.';
    return;
  }

  if (rawFiles.length === 2) {
    processSelectedFile(rawFiles[0], 'front');
    processSelectedFile(rawFiles[1], 'selfie');
  } else if (rawFiles.length === 1) {
    if (!idCardFile.value) {
      processSelectedFile(rawFiles[0], 'front');
    } else {
      processSelectedFile(rawFiles[0], 'selfie');
    }
  }
};

const processSelectedFile = (file, slot = 'front') => {
  if (!file) return;

  const label = slot === 'front' ? 'Front ID' : 'Selfie with ID';
  const validationError = validateImageFile(file, label);
  if (validationError) {
    errorMessage.value = validationError;
    return;
  }

  errorMessage.value = '';

  if (slot === 'front') {
    delete fieldErrors.value.id_card;
    if (idCardPreview.value?.startsWith('blob:')) {
      URL.revokeObjectURL(idCardPreview.value);
    }
    idCardFile.value = file;
    idCardPreview.value = URL.createObjectURL(file);
  } else {
    delete fieldErrors.value.id_selfie;
    if (idSelfiePreview.value?.startsWith('blob:')) {
      URL.revokeObjectURL(idSelfiePreview.value);
    }
    idSelfieFile.value = file;
    idSelfiePreview.value = URL.createObjectURL(file);
  }
};

const removeSelectedFile = (slot = 'front') => {
  if (slot === 'front') {
    if (idCardPreview.value?.startsWith('blob:')) {
      URL.revokeObjectURL(idCardPreview.value);
    }
    idCardFile.value = null;
    idCardPreview.value = null;
    if (fileInputRef.value) fileInputRef.value.value = '';
  } else {
    if (idSelfiePreview.value?.startsWith('blob:')) {
      URL.revokeObjectURL(idSelfiePreview.value);
    }
    idSelfieFile.value = null;
    idSelfiePreview.value = null;
    if (selfieInputRef.value) selfieInputRef.value.value = '';
  }
};

// Full validation for continuous submit
const validateClient = () => {
  fieldErrors.value = {};
  errorMessage.value = '';

  const allErrors = validateRegistrationForm(form.value, {
    idCardFile: idCardFile.value,
    idSelfieFile: idSelfieFile.value,
    hasAgreedToDisclaimer: hasAgreedToDisclaimer.value,
  });

  fieldErrors.value = allErrors;
  return Object.keys(allErrors).length === 0;
};

const handleRegister = async () => {
  if (!validateClient()) {
    errorMessage.value = 'Please correct the highlighted fields before submitting.';
    
    // Smooth scroll to first error field
    await nextTick();
    const [firstKey] = Object.keys(fieldErrors.value);
    if (firstKey) {
      const el = document.querySelector(`[data-field="${firstKey}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.querySelector('input, select, button')?.focus();
      }
    }
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const formData = new FormData();
    formData.append('first_name', form.value.first_name.trim());
    formData.append('last_name', form.value.last_name.trim());
    formData.append('role', form.value.role);
    if (form.value.role === 'student') {
      formData.append('student_type', (form.value.student_type || 'rso').toLowerCase().trim());
      formData.append('organization_name', form.value.organization_name.trim());
      formData.append('college', form.value.college);
    } else if (form.value.role === 'employee') {
      formData.append('employee_type', form.value.employee_type);
      if (form.value.college) {
        formData.append('college', form.value.college);
      }
    }
    formData.append('student_id_number', form.value.student_id_number.trim());
    formData.append('contact_number', form.value.contact_number.trim());
    
    if (form.value.email.trim()) {
      formData.append('email', form.value.email.trim().toLowerCase());
    }
    
    formData.append('password', form.value.password);
    formData.append('password_confirm', form.value.password_confirm);
    formData.append('id_card_image', idCardFile.value);
    formData.append('id_selfie_image', idSelfieFile.value);

    const response = await apiRegister(formData);

    const isSuccess = response.data?.status === true || Boolean(response.data?.data?.user);

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
    } else if (err.response?.data?.messages?.error) {
      errorMessage.value = err.response.data.messages.error;
    } else {
      errorMessage.value = 'Failed to submit registration. Please check your connection and try again.';
    }
  } finally {
    isLoading.value = false;
  }
};

// Disclaimer Modal Methods
const closeDisclaimerModal = () => {
  showDisclaimerModal.value = false;
};

const acceptDisclaimer = () => {
  hasAgreedToDisclaimer.value = true;
  showDisclaimerModal.value = false;
  isDisclaimerTouched.value = true;
  if (fieldErrors.value.disclaimer) {
    delete fieldErrors.value.disclaimer;
  }
};
</script>

<template>
  <div class="min-h-screen w-full relative flex items-center justify-center bg-slate-50 py-8 sm:py-12 px-4 sm:px-6 font-sans">
    
    <!-- Subtle Background -->
    <div class="fixed inset-0 z-0 overflow-hidden bg-slate-50 pointer-events-none">
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Benguet_State_University_Main_Gate.jpg" 
        alt="" 
        class="w-full h-full object-cover opacity-10 filter grayscale"
      />
      <div class="absolute inset-0 bg-gradient-to-br from-white/80 via-slate-50/90 to-white z-0"></div>
    </div>

    <!-- Desktop University Branding (floating top-left) -->
    <router-link to="/" class="hidden sm:flex sm:fixed sm:top-8 sm:left-10 z-20 items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity">
      <div class="w-12 h-12 overflow-hidden flex-shrink-0">
        <img src="/bsu-logo.png" alt="BSU Logo" class="w-full h-full object-cover rounded-full" />
      </div>
      <div>
        <h2 class="text-emerald-800 font-extrabold tracking-widest text-xs uppercase">Benguet State University</h2>
        <p class="text-slate-600 font-bold text-[11px]">General Services Office</p>
      </div>
    </router-link>

    <!-- Main Registration Card -->
    <div class="relative z-10 w-full max-w-xl my-4 sm:my-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-2xl transition-all duration-300 overflow-hidden">
      
      <!-- Mobile University Branding -->
      <router-link to="/" class="sm:hidden flex items-center gap-2.5 p-4 pb-0">
        <div class="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-white shadow-xs border border-emerald-200/80">
          <img src="/bsu-logo.png" alt="BSU Logo" class="w-full h-full object-cover" />
        </div>
        <div class="min-w-0">
          <h2 class="text-emerald-900 font-extrabold tracking-wider text-[11px] uppercase leading-tight truncate">Benguet State University</h2>
          <p class="text-emerald-700 font-bold text-[10px] truncate">General Services Office</p>
        </div>
      </router-link>

      <!-- Card Header -->
      <div class="px-5 sm:px-8 pt-5 sm:pt-7 pb-2 border-b border-slate-100">
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
          Create your <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">GSO Account</span>
        </h1>
        <p class="text-slate-500 text-xs sm:text-sm font-medium mt-1">
          Complete the continuous form below to register for campus service requests.
        </p>
      </div>

      <!-- Global Error Message -->
      <div v-if="errorMessage" class="mx-5 sm:mx-8 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold flex items-center gap-2">
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Continuous Registration Form -->
      <form @submit.prevent="handleRegister" class="px-5 sm:px-8 py-5 sm:py-6 space-y-6" novalidate>
        
        <!-- ==================== SECTION 1: Role & Affiliation ==================== -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 pb-1 border-b border-slate-100">
            <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center">1</span>
            <h2 class="text-xs font-black uppercase tracking-wider text-slate-800">Account Type & Affiliation</h2>
          </div>

          <!-- Role Selector -->
          <div data-field="role">
            <label class="block text-slate-700 text-xs font-bold mb-1.5">
              I am a <span class="text-rose-500">*</span>
            </label>
            <div class="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button 
                type="button" 
                @click="handleRoleSelect('student')"
                :class="form.role === 'student' ? 'bg-white text-emerald-800 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900 font-medium'"
                class="min-h-[44px] py-2.5 rounded-lg text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
                Student
              </button>
              <button 
                type="button" 
                @click="handleRoleSelect('employee')"
                :class="form.role === 'employee' ? 'bg-white text-emerald-800 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900 font-medium'"
                class="min-h-[44px] py-2.5 rounded-lg text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Faculty / Staff
              </button>
            </div>
          </div>

          <!-- Student Fields -->
          <template v-if="form.role === 'student'">
            <!-- RSO vs SSG -->
            <div data-field="student_type">
              <label class="block text-slate-700 text-xs font-bold mb-1.5">
                Affiliation <span class="text-rose-500">*</span>
              </label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  @click="handleStudentTypeSelect('rso')"
                  :class="form.student_type === 'rso' ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50 text-emerald-900' : 'border-slate-200 hover:border-slate-300 text-slate-600'"
                  class="min-h-[44px] p-3 rounded-xl border text-left transition-all active:scale-[0.98] cursor-pointer"
                >
                  <div class="text-xs font-bold">RSO</div>
                  <p class="text-[10px] text-slate-500 mt-0.5">Student Organization</p>
                </button>
                <button
                  type="button"
                  @click="handleStudentTypeSelect('ssg')"
                  :class="form.student_type === 'ssg' ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50 text-emerald-900' : 'border-slate-200 hover:border-slate-300 text-slate-600'"
                  class="min-h-[44px] p-3 rounded-xl border text-left transition-all active:scale-[0.98] cursor-pointer"
                >
                  <div class="text-xs font-bold">SSG</div>
                  <p class="text-[10px] text-slate-500 mt-0.5">Student Government</p>
                </button>
              </div>
              <p v-if="fieldErrors.student_type" class="mt-1 text-xs text-rose-500 font-medium">{{ fieldErrors.student_type }}</p>
            </div>

            <!-- Organization Name or Position -->
            <div data-field="organization_name">
              <label class="block text-slate-700 text-xs font-bold mb-1.5">
                {{ form.student_type === 'rso' ? 'Organization Name' : 'Officer Position' }} <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.organization_name"
                type="text"
                maxlength="150"
                spellcheck="false"
                required
                @input="handleOrganizationNameInput"
                :class="fieldErrors.organization_name ? 'border-rose-300 ring-1 ring-rose-500/20' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'"
                class="w-full px-4 py-3 rounded-xl border text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none transition-all bg-slate-50 focus:bg-white min-h-[44px]"
                :placeholder="form.student_type === 'rso' ? 'e.g. Body of Young Information Technologists (BYTE)' : 'e.g. President, Vice President'"
              />
              <p v-if="fieldErrors.organization_name" class="mt-1 text-xs text-rose-500 font-medium">{{ fieldErrors.organization_name }}</p>
            </div>

            <!-- College -->
            <div data-field="college">
              <label class="block text-slate-700 text-xs font-bold mb-1.5">
                College <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <select
                  v-model="form.college"
                  @change="handleCollegeChange"
                  required
                  :class="fieldErrors.college ? 'border-rose-300 ring-1 ring-rose-500/20' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'"
                  class="w-full px-4 py-3 pr-10 rounded-xl border text-sm font-medium focus:outline-none transition-all bg-slate-50 focus:bg-white min-h-[44px] appearance-none cursor-pointer text-slate-900"
                >
                  <option value="" disabled>Select college...</option>
                  <option v-for="c in BSU_COLLEGES" :key="c.code" :value="c.name">{{ c.name }}</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              <p v-if="fieldErrors.college" class="mt-1 text-xs text-rose-500 font-medium">{{ fieldErrors.college }}</p>
            </div>
          </template>

          <!-- Employee Fields -->
          <template v-if="form.role === 'employee'">
            <!-- Staff Type -->
            <div data-field="employee_type">
              <label class="block text-slate-700 text-xs font-bold mb-1.5">
                Staff Type <span class="text-rose-500">*</span>
              </label>
              <div class="space-y-2">
                <button
                  v-for="opt in [
                    { value: 'Teaching Staff', label: 'Teaching Staff', desc: 'Faculty & Instructors' },
                    { value: 'Research and Extension Staff', label: 'Research & Extension', desc: 'Research Centers & Extension' },
                    { value: 'Support / Administrative Staff', label: 'Support / Admin', desc: 'Administrative & Support' }
                  ]"
                  :key="opt.value"
                  type="button"
                  @click="handleEmployeeTypeSelect(opt.value)"
                  :class="form.employee_type === opt.value ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50 text-emerald-900' : 'border-slate-200 hover:border-slate-300 text-slate-600'"
                  class="w-full min-h-[44px] p-3 rounded-xl border text-left transition-all active:scale-[0.98] cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div class="text-xs font-bold">{{ opt.label }}</div>
                    <p class="text-[10px] text-slate-500 mt-0.5">{{ opt.desc }}</p>
                  </div>
                  <div v-if="form.employee_type === opt.value" class="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                </button>
              </div>
              <p v-if="fieldErrors.employee_type" class="mt-1 text-xs text-rose-500 font-medium">{{ fieldErrors.employee_type }}</p>
            </div>

            <!-- College / Center / Building (conditional based on staff type) -->
            <div v-if="form.employee_type === 'Teaching Staff'" data-field="college">
              <label class="block text-slate-700 text-xs font-bold mb-1.5">
                Assigned College <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <select v-model="form.college" @change="handleCollegeChange" required
                  :class="fieldErrors.college ? 'border-rose-300 ring-1 ring-rose-500/20' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'"
                  class="w-full px-4 py-3 pr-10 rounded-xl border text-sm font-medium focus:outline-none transition-all bg-slate-50 focus:bg-white min-h-[44px] appearance-none cursor-pointer text-slate-900">
                  <option value="" disabled>Select college...</option>
                  <option v-for="c in BSU_COLLEGES" :key="c.code" :value="c.name">{{ c.name }}</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              <p v-if="fieldErrors.college" class="mt-1 text-xs text-rose-500 font-medium">{{ fieldErrors.college }}</p>
            </div>

            <div v-if="form.employee_type === 'Research and Extension Staff'" data-field="college">
              <label class="block text-slate-700 text-xs font-bold mb-1.5">
                Assigned Center <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <select v-model="form.college" @change="handleCollegeChange" required
                  :class="fieldErrors.college ? 'border-rose-300 ring-1 ring-rose-500/20' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'"
                  class="w-full px-4 py-3 pr-10 rounded-xl border text-sm font-medium focus:outline-none transition-all bg-slate-50 focus:bg-white min-h-[44px] appearance-none cursor-pointer text-slate-900">
                  <option value="" disabled>Select center...</option>
                  <option v-for="c in RESEARCH_EXTENSION_BUILDINGS" :key="c" :value="c">{{ c }}</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              <p v-if="fieldErrors.college" class="mt-1 text-xs text-rose-500 font-medium">{{ fieldErrors.college }}</p>
            </div>

            <div v-if="form.employee_type === 'Support / Administrative Staff'" data-field="college">
              <label class="block text-slate-700 text-xs font-bold mb-1.5">
                Assigned Building <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <select v-model="form.college" @change="handleCollegeChange" required
                  :class="fieldErrors.college ? 'border-rose-300 ring-1 ring-rose-500/20' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'"
                  class="w-full px-4 py-3 pr-10 rounded-xl border text-sm font-medium focus:outline-none transition-all bg-slate-50 focus:bg-white min-h-[44px] appearance-none cursor-pointer text-slate-900">
                  <option value="" disabled>Select building...</option>
                  <optgroup label="Colleges">
                    <option v-for="c in BSU_COLLEGES" :key="c.code" :value="c.name">{{ c.name }}</option>
                  </optgroup>
                  <optgroup label="Administrative Buildings">
                    <option v-for="b in ADMIN_SUPPORT_BUILDINGS" :key="b" :value="b">{{ b }}</option>
                  </optgroup>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              <p v-if="fieldErrors.college" class="mt-1 text-xs text-rose-500 font-medium">{{ fieldErrors.college }}</p>
            </div>
          </template>
        </div>

        <!-- ==================== SECTION 2: Personal Information ==================== -->
        <div class="space-y-4 pt-2">
          <div class="flex items-center gap-2 pb-1 border-b border-slate-100">
            <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center">2</span>
            <h2 class="text-xs font-black uppercase tracking-wider text-slate-800">Personal Information</h2>
          </div>

          <!-- Name Fields -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div data-field="first_name">
              <label class="block text-slate-700 text-xs font-bold mb-1.5">First Name <span class="text-rose-500">*</span></label>
              <input 
                v-model="form.first_name" type="text" autocomplete="given-name" maxlength="50" spellcheck="false" required
                @input="handleFirstNameInput" @blur="handleFirstNameBlur"
                :class="fieldErrors.first_name ? 'border-rose-300 ring-1 ring-rose-500/20' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'"
                class="w-full px-4 py-3 rounded-xl border text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none transition-all bg-slate-50 focus:bg-white min-h-[44px]"
                placeholder="Juan"
              />
              <p v-if="fieldErrors.first_name" class="mt-1 text-xs text-rose-500 font-medium">{{ fieldErrors.first_name }}</p>
            </div>
            <div data-field="last_name">
              <label class="block text-slate-700 text-xs font-bold mb-1.5">Last Name <span class="text-rose-500">*</span></label>
              <input 
                v-model="form.last_name" type="text" autocomplete="family-name" maxlength="50" spellcheck="false" required
                @input="handleLastNameInput" @blur="handleLastNameBlur"
                :class="fieldErrors.last_name ? 'border-rose-300 ring-1 ring-rose-500/20' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'"
                class="w-full px-4 py-3 rounded-xl border text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none transition-all bg-slate-50 focus:bg-white min-h-[44px]"
                placeholder="Dela Cruz"
              />
              <p v-if="fieldErrors.last_name" class="mt-1 text-xs text-rose-500 font-medium">{{ fieldErrors.last_name }}</p>
            </div>
          </div>

          <!-- ID & Contact -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div data-field="student_id_number">
              <label class="block text-slate-700 text-xs font-bold mb-1.5">
                {{ form.role === 'student' ? 'Student ID' : 'Employee ID' }} <span class="text-rose-500">*</span>
              </label>
              <input 
                v-model="form.student_id_number" type="text"
                :inputmode="form.role === 'student' ? 'numeric' : 'text'"
                :maxlength="form.role === 'student' ? 7 : 15"
                required @input="handleStudentIdInput"
                :class="fieldErrors.student_id_number ? 'border-rose-300 ring-1 ring-rose-500/20' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'"
                class="w-full px-4 py-3 rounded-xl border text-slate-900 text-sm font-semibold tracking-wider placeholder-slate-400 focus:outline-none transition-all bg-slate-50 focus:bg-white min-h-[44px]"
                :placeholder="form.role === 'student' ? '2301219' : '102456'"
              />
              <p v-if="fieldErrors.student_id_number" class="mt-1 text-xs text-rose-500 font-medium">{{ fieldErrors.student_id_number }}</p>
            </div>
            <div data-field="contact_number">
              <label class="block text-slate-700 text-xs font-bold mb-1.5">Contact No. <span class="text-rose-500">*</span></label>
              <input 
                v-model="form.contact_number" type="tel" inputmode="numeric" maxlength="11" autocomplete="tel" required
                @input="handleContactNumberInput"
                :class="fieldErrors.contact_number ? 'border-rose-300 ring-1 ring-rose-500/20' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'"
                class="w-full px-4 py-3 rounded-xl border text-slate-900 text-sm font-semibold tracking-wider placeholder-slate-400 focus:outline-none transition-all bg-slate-50 focus:bg-white min-h-[44px]"
                placeholder="09171234567"
              />
              <p v-if="fieldErrors.contact_number" class="mt-1 text-xs text-rose-500 font-medium">{{ fieldErrors.contact_number }}</p>
            </div>
          </div>

          <!-- Email -->
          <div data-field="email">
            <label class="block text-slate-700 text-xs font-bold mb-1.5">Email Address <span class="text-rose-500">*</span></label>
            <input 
              v-model="form.email" type="email" autocomplete="email" spellcheck="false" maxlength="100" required
              @blur="handleEmailBlur"
              :class="fieldErrors.email ? 'border-rose-300 ring-1 ring-rose-500/20' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'"
              class="w-full px-4 py-3 rounded-xl border text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none transition-all bg-slate-50 focus:bg-white min-h-[44px]"
              placeholder="juan.delacruz@bsu.edu.ph"
            />
            <p v-if="fieldErrors.email" class="mt-1 text-xs text-rose-500 font-medium">{{ fieldErrors.email }}</p>
          </div>
        </div>

        <!-- ==================== SECTION 3: Password & Security ==================== -->
        <div class="space-y-4 pt-2">
          <div class="flex items-center gap-2 pb-1 border-b border-slate-100">
            <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center">3</span>
            <h2 class="text-xs font-black uppercase tracking-wider text-slate-800">Security Credentials</h2>
          </div>

          <!-- Password & Confirm Password Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <!-- Password -->
            <div data-field="password">
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-slate-700 text-xs font-bold">Password <span class="text-rose-500">*</span></label>
                <button type="button" @click="showPassword = !showPassword"
                  class="text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer">
                  {{ showPassword ? 'Hide' : 'Show' }}
                </button>
              </div>
              <input 
                v-model="form.password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" maxlength="64" required
                :class="fieldErrors.password ? 'border-rose-300 ring-1 ring-rose-500/20' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'"
                class="w-full px-4 py-3 rounded-xl border text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none transition-all bg-slate-50 focus:bg-white min-h-[44px]"
                placeholder="Minimum 8 characters"
              />
              <p v-if="fieldErrors.password" class="mt-1 text-xs text-rose-500 font-medium">{{ fieldErrors.password }}</p>
            </div>

            <!-- Confirm Password -->
            <div data-field="password_confirm">
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-slate-700 text-xs font-bold">Confirm Password <span class="text-rose-500">*</span></label>
                <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                  class="text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer">
                  {{ showConfirmPassword ? 'Hide' : 'Show' }}
                </button>
              </div>
              <input 
                v-model="form.password_confirm" :type="showConfirmPassword ? 'text' : 'password'" autocomplete="new-password" maxlength="64" required
                :class="fieldErrors.password_confirm ? 'border-rose-300 ring-1 ring-rose-500/20' : (isPasswordMatch ? 'border-emerald-300 ring-1 ring-emerald-500/20' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20')"
                class="w-full px-4 py-3 rounded-xl border text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none transition-all bg-slate-50 focus:bg-white min-h-[44px]"
                placeholder="Re-enter password"
              />
              <div v-if="isConfirmPasswordTouched" class="mt-1">
                <p v-if="isPasswordMatch" class="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                  Passwords match
                </p>
                <p v-else class="text-xs text-rose-500 font-medium">Passwords do not match</p>
              </div>
              <p v-else-if="fieldErrors.password_confirm" class="mt-1 text-xs text-rose-500 font-medium">{{ fieldErrors.password_confirm }}</p>
            </div>
          </div>

          <!-- Compact Password Strength Indicator -->
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div class="flex items-center gap-2">
              <span class="text-[11px] font-semibold text-slate-600">Password strength:</span>
              <div class="flex gap-1 flex-1">
                <div :class="passwordStrengthScore >= 1 ? 'bg-amber-500' : 'bg-slate-200'" class="h-1 rounded-full flex-1 transition-colors"></div>
                <div :class="passwordStrengthScore >= 2 ? 'bg-amber-500' : 'bg-slate-200'" class="h-1 rounded-full flex-1 transition-colors"></div>
                <div :class="passwordStrengthScore === 3 ? 'bg-emerald-500' : 'bg-slate-200'" class="h-1 rounded-full flex-1 transition-colors"></div>
              </div>
              <span class="text-[10px] text-slate-500 font-bold whitespace-nowrap">
                {{ passwordStrengthScore === 0 ? 'None' : passwordStrengthScore === 3 ? 'Strong' : passwordStrengthScore === 2 ? 'Medium' : 'Weak' }}
              </span>
            </div>

            <div class="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
              <span :class="passwordCriteria.hasLength ? 'text-emerald-600 font-semibold' : 'text-slate-400'" class="flex items-center gap-1 transition-colors">
                <svg v-if="passwordCriteria.hasLength" class="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                <span v-else class="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                8+ characters
              </span>
              <span :class="passwordCriteria.hasLetter ? 'text-emerald-600 font-semibold' : 'text-slate-400'" class="flex items-center gap-1 transition-colors">
                <svg v-if="passwordCriteria.hasLetter" class="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                <span v-else class="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                At least one letter
              </span>
              <span :class="passwordCriteria.hasNumber ? 'text-emerald-600 font-semibold' : 'text-slate-400'" class="flex items-center gap-1 transition-colors">
                <svg v-if="passwordCriteria.hasNumber" class="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                <span v-else class="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                At least one number
              </span>
            </div>
          </div>
        </div>

        <!-- ==================== SECTION 4: Identity Verification & Terms ==================== -->
        <div class="space-y-4 pt-2" @dragover.prevent @drop="handleSectionDrop">
          <div class="flex items-center gap-2 pb-1 border-b border-slate-100">
            <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center">4</span>
            <h2 class="text-xs font-black uppercase tracking-wider text-slate-800">Verification & Terms</h2>
          </div>

          <p class="text-xs text-slate-500 font-medium">Upload your front ID photo and a selfie holding your ID for account verification. Max 5MB each (JPG, PNG, WebP).</p>

          <!-- Hidden File Inputs -->
          <input ref="fileInputRef" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" class="hidden" @change="(e) => handleFileSelect(e, 'front')" />
          <input ref="selfieInputRef" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" class="hidden" @change="(e) => handleFileSelect(e, 'selfie')" />

          <!-- Upload Slots Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <IdUploadDropzone
              data-field="id_card"
              label="Front ID Photo"
              prompt-text="Click to Upload Front ID"
              hint="or drag and drop file here"
              :preview="idCardPreview"
              :file="idCardFile"
              :error="fieldErrors.id_card"
              @select="fileInputRef?.click()"
              @remove="removeSelectedFile('front')"
            />

            <IdUploadDropzone
              data-field="id_selfie"
              label="Selfie holding ID"
              prompt-text="Click to Upload Selfie"
              hint="holding your BSU ID"
              :preview="idSelfiePreview"
              :file="idSelfieFile"
              :error="fieldErrors.id_selfie"
              @select="selfieInputRef?.click()"
              @remove="removeSelectedFile('selfie')"
            >
              <template #icon>
                <svg class="w-8 h-8 text-slate-400 group-hover:text-emerald-500 transition-colors mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </template>
            </IdUploadDropzone>
          </div>

          <!-- Data Privacy Notice & Terms of Use Agreement -->
          <div data-field="disclaimer" class="pt-2">
            <div :class="hasAgreedToDisclaimer ? 'bg-emerald-50/80 border-emerald-200' : 'bg-slate-50 border-slate-200'" class="p-3.5 rounded-xl border transition-colors flex items-start gap-3">
              <input 
                id="terms_checkbox"
                type="checkbox"
                v-model="hasAgreedToDisclaimer"
                @change="if (hasAgreedToDisclaimer && fieldErrors.disclaimer) delete fieldErrors.disclaimer;"
                class="mt-1 w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
              />
              <div class="flex-1 text-xs text-slate-700 leading-relaxed">
                <label for="terms_checkbox" class="cursor-pointer select-none">
                  I have read, understood, and accept the
                </label>
                <button
                  type="button"
                  @click="showDisclaimerModal = true; isDisclaimerTouched = true"
                  class="font-bold text-emerald-700 hover:text-emerald-800 underline hover:no-underline ml-1 cursor-pointer"
                >
                  Data Privacy Notice & Terms of Use
                </button>
                <span class="text-slate-500 text-[11px] block mt-0.5">In compliance with Republic Act No. 10173 (Data Privacy Act of 2012).</span>
              </div>
              <button 
                type="button"
                @click="showDisclaimerModal = true"
                class="text-xs font-bold text-emerald-700 hover:text-emerald-800 px-2 py-1 rounded bg-white border border-slate-200 shadow-xs hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
              >
                {{ hasAgreedToDisclaimer ? 'View Terms' : 'Review' }}
              </button>
            </div>
            <p v-if="fieldErrors.disclaimer" class="mt-1 text-xs text-rose-500 font-medium">{{ fieldErrors.disclaimer }}</p>
          </div>
        </div>

        <!-- ==================== Submit Button ==================== -->
        <div class="pt-4 border-t border-slate-100">
          <button
            :disabled="isLoading"
            type="submit"
            class="w-full min-h-[48px] px-6 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isLoading">Create GSO Account</span>
            <span v-else>Registering your account...</span>
            <svg v-if="!isLoading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            <svg v-else class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>

          <!-- Back to Login -->
          <div class="text-center pt-3.5">
            <p class="text-xs text-slate-500 font-medium">
              Already have an account? 
              <router-link to="/login" class="text-emerald-700 hover:text-emerald-800 font-bold hover:underline transition-all">Sign In</router-link>
            </p>
          </div>
        </div>

      </form>

      <!-- Data Privacy Act Disclaimer Modal Component -->
      <RegisterPrivacyModal
        :show="showDisclaimerModal"
        @close="closeDisclaimerModal"
        @accept="acceptDisclaimer"
      />

    </div>
  </div>
</template>
