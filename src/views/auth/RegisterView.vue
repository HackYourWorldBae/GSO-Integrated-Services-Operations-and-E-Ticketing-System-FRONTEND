<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { register as apiRegister } from '@/api/auth';
import { BSU_COLLEGES } from '@/constants/colleges';
import { ADMIN_SUPPORT_BUILDINGS } from '@/constants/locations';

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
  form.value.college = '';
  if (selectedRole === 'student') {
    form.value.employee_type = '';
  }
  if (fieldErrors.value.college) {
    delete fieldErrors.value.college;
  }
  if (fieldErrors.value.employee_type) {
    delete fieldErrors.value.employee_type;
  }
  if (fieldErrors.value.student_id_number) {
    delete fieldErrors.value.student_id_number;
  }
};

// Employee / Staff Type Switcher Handler
const handleEmployeeTypeSelect = (selectedType) => {
  if (form.value.employee_type === selectedType) return;
  form.value.employee_type = selectedType;
  form.value.college = '';
  if (fieldErrors.value.college) {
    delete fieldErrors.value.college;
  }
  if (fieldErrors.value.employee_type) {
    delete fieldErrors.value.employee_type;
  }
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
  if (fieldErrors.value.student_type) {
    delete fieldErrors.value.student_type;
  }
  if (fieldErrors.value.organization_name) {
    delete fieldErrors.value.organization_name;
  }
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

const validateImageFile = (file, label) => {
  if (!file) return null;
  const fileName = file.name || '';
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const validExts = ['jpg', 'jpeg', 'png', 'webp'];
  const validMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  const isExtValid = validExts.includes(ext);
  const isMimeValid = !file.type || validMimes.includes(file.type.toLowerCase()) || file.type.startsWith('image/');

  if (!isExtValid || !isMimeValid) {
    return `Please upload a valid image file for ${label} (JPG, JPEG, PNG, or WebP only).`;
  }

  // 5MB limit
  if (file.size > 5 * 1024 * 1024) {
    return `${label} image size must not exceed 5MB.`;
  }

  return null;
};

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
    if (fieldErrors.value) {
      delete fieldErrors.value.id_card;
    }
    if (idCardPreview.value && idCardPreview.value.startsWith('blob:')) {
      URL.revokeObjectURL(idCardPreview.value);
    }
    idCardFile.value = file;
    try {
      idCardPreview.value = URL.createObjectURL(file);
    } catch {
      const reader = new FileReader();
      reader.onload = (e) => {
        idCardPreview.value = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  } else {
    if (fieldErrors.value) {
      delete fieldErrors.value.id_selfie;
    }
    if (idSelfiePreview.value && idSelfiePreview.value.startsWith('blob:')) {
      URL.revokeObjectURL(idSelfiePreview.value);
    }
    idSelfieFile.value = file;
    try {
      idSelfiePreview.value = URL.createObjectURL(file);
    } catch {
      const reader = new FileReader();
      reader.onload = (e) => {
        idSelfiePreview.value = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
};

const removeSelectedFile = (slot = 'front') => {
  if (slot === 'front') {
    if (idCardPreview.value && idCardPreview.value.startsWith('blob:')) {
      URL.revokeObjectURL(idCardPreview.value);
    }
    idCardFile.value = null;
    idCardPreview.value = null;
    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }
  } else {
    if (idSelfiePreview.value && idSelfiePreview.value.startsWith('blob:')) {
      URL.revokeObjectURL(idSelfiePreview.value);
    }
    idSelfieFile.value = null;
    idSelfiePreview.value = null;
    if (selfieInputRef.value) {
      selfieInputRef.value.value = '';
    }
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

  // 3.1 Student Organization Representative Validation
  if (form.value.role === 'student') {
    if (!form.value.student_type) {
      fieldErrors.value.student_type = 'Please select whether you represent an RSO or the SSG.';
    }
    const org = form.value.organization_name.trim();
    if (!org) {
      fieldErrors.value.organization_name = form.value.student_type === 'rso'
        ? 'Recognized Student Organization (RSO) name is required.'
        : 'Officer position is required.';
    } else if (org.length < 2) {
      fieldErrors.value.organization_name = form.value.student_type === 'rso'
        ? 'Organization name must be at least 2 characters long.'
        : 'Officer position must be at least 2 characters long.';
    }
    if (!form.value.college) {
      fieldErrors.value.college = 'Please select your College / Academic Unit.';
    }
  }

  // 3.2 BSU Faculty / Staff Validation
  if (form.value.role === 'employee') {
    if (!form.value.employee_type) {
      fieldErrors.value.employee_type = 'Please select your faculty or staff classification.';
    } else if (form.value.employee_type === 'Teaching Staff') {
      if (!form.value.college) {
        fieldErrors.value.college = 'Please select your assigned College / Academic Unit.';
      }
    } else if (form.value.employee_type === 'Support / Administrative Staff') {
      if (!form.value.college) {
        fieldErrors.value.college = 'Please select your assigned administrative or support building.';
      }
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

  // 5. Email (Mandatory for forgot password recovery and ticket notifications)
  const em = form.value.email.trim();
  if (!em) {
    fieldErrors.value.email = 'Email address is required for password recovery and notifications.';
  } else {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(em)) {
      fieldErrors.value.email = 'Please enter a valid email address (e.g. name@bsu.edu.ph).';
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

  // 8. ID Card Photo & Selfie with ID (Both Mandatory - 2 Files Required)
  if (!idCardFile.value) {
    fieldErrors.value.id_card = 'Please upload a clear picture of the front of your ID card.';
  }
  if (!idSelfieFile.value) {
    fieldErrors.value.id_selfie = 'Please upload a clear selfie while holding your ID card.';
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
    if (form.value.role === 'student') {
      formData.append('student_type', (form.value.student_type || 'rso').toLowerCase().trim());
      formData.append('organization_name', form.value.organization_name.trim());
      formData.append('college', form.value.college);
    } else if (form.value.role === 'employee') {
      formData.append('employee_type', form.value.employee_type);
      if (form.value.employee_type === 'Teaching Staff' && form.value.college) {
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

  // Disclaimer Modal Methods
  const closeDisclaimerModal = () => {
    showDisclaimerModal.value = false;
  };

  const acceptDisclaimer = () => {
    hasAgreedToDisclaimer.value = true;
    showDisclaimerModal.value = false;
    isDisclaimerTouched.value = true;
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

    <!-- Desktop Top Left University Branding (hidden on mobile to prevent floating over form while scrolling) -->
    <router-link to="/" class="hidden sm:flex sm:fixed sm:top-8 sm:left-10 z-20 items-center gap-4 drop-shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
      <div class="w-14 h-14 sm:w-16 sm:h-16 overflow-hidden flex-shrink-0">
        <img src="/bsu-logo.png" alt="BSU Logo" class="w-full h-full object-cover rounded-full" />
      </div>
      <div>
        <h2 class="text-emerald-800 font-extrabold tracking-widest text-xs uppercase mb-0.5 drop-shadow-md">Benguet State University</h2>
        <p class="text-slate-700 font-bold text-[11px] tracking-wide drop-shadow-md">General Services Office</p>
      </div>
    </router-link>

    <!-- Main Registration Card -->
    <div class="relative z-10 w-full max-w-2xl my-6 sm:my-8 p-5 sm:p-10 rounded-3xl sm:rounded-[2rem] border border-slate-200/80 bg-white/95 backdrop-blur-2xl shadow-2xl transition-all duration-300">
      
      <!-- Mobile In-Card University Branding (displayed inline in document flow so it never floats or disrupts filling up form) -->
      <router-link to="/" class="sm:hidden flex items-center gap-3 mb-5 p-2.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 hover:bg-emerald-100/60 transition-colors shadow-xs">
        <div class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-white shadow-xs border border-emerald-200/80">
          <img src="/bsu-logo.png" alt="BSU Logo" class="w-full h-full object-cover" />
        </div>
        <div class="text-left min-w-0">
          <h2 class="text-emerald-900 font-extrabold tracking-wider text-[11px] uppercase leading-tight truncate">Benguet State University</h2>
          <p class="text-emerald-700 font-bold text-[10px] truncate">General Services Office</p>
        </div>
      </router-link>

      <!-- Card Header -->
      <div class="mb-6 text-left">
        <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[11px] font-bold uppercase tracking-wider mb-2">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          User Registration & Identity Verification
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-1.5">
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

      <form @submit.prevent="handleRegister" class="space-y-4 sm:space-y-5" novalidate>
        
        <!-- Role Selector Toggle -->
        <div>
          <label class="block text-slate-700 text-xs font-bold mb-1.5 ml-0.5">
            Account Classification <span class="text-rose-500">*</span>
          </label>
          <div class="grid grid-cols-2 gap-2.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
            <button 
              type="button" 
              @click="handleRoleSelect('student')"
              :class="form.role === 'student' ? 'bg-white text-emerald-800 font-bold shadow-sm border border-emerald-200/50' : 'text-slate-600 hover:text-slate-900 font-medium'"
              class="min-h-[44px] py-2.5 rounded-lg text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              Student (RSO / SSG)
            </button>
            <button 
              type="button" 
              @click="handleRoleSelect('employee')"
              :class="form.role === 'employee' ? 'bg-white text-emerald-800 font-bold shadow-sm border border-emerald-200/50' : 'text-slate-600 hover:text-slate-900 font-medium'"
              class="min-h-[44px] py-2.5 rounded-lg text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              BSU Faculty / Staff
            </button>
          </div>
        </div>

        <!-- Student Organization Classification (RSO / SSG only) -->
        <div v-if="form.role === 'student'" class="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3 transition-all">
          <div class="flex items-start gap-2.5">
            <div class="p-1.5 rounded-lg bg-emerald-600 text-white shrink-0 mt-0.5 shadow-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 class="text-xs font-bold text-emerald-950 leading-snug">
                Authorized Student Representative Sign-Up
              </h3>
              <p class="text-xs text-emerald-800/90 font-medium leading-relaxed mt-0.5">
                Student accounts are strictly reserved for accredited officers of Recognized Student Organizations (RSO) and Supreme Student Government (SSG).
              </p>
            </div>
          </div>

          <!-- RSO vs SSG Choice Cards -->
          <div>
            <label class="block text-slate-700 text-xs font-bold mb-1.5 ml-0.5">
              Select Student Affiliation <span class="text-rose-500">*</span>
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <!-- RSO Option -->
              <button
                type="button"
                @click="handleStudentTypeSelect('rso')"
                :class="form.student_type === 'rso' ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm text-emerald-950' : 'bg-white/80 border-slate-200 hover:border-slate-300 text-slate-700'"
                class="min-h-[56px] p-3 rounded-xl border text-left transition-all active:scale-[0.98] flex items-start gap-2.5 cursor-pointer"
              >
                <div 
                  :class="form.student_type === 'rso' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'" 
                  class="p-1.5 rounded-lg shrink-0 mt-0.5 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <div class="text-xs font-bold leading-tight flex items-center gap-1.5">
                    RSO Representative
                    <span v-if="form.student_type === 'rso'" class="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">Selected</span>
                  </div>
                  <p class="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                    Recognized Student Organization (Clubs, councils)
                  </p>
                </div>
              </button>

              <!-- SSG Option -->
              <button
                type="button"
                @click="handleStudentTypeSelect('ssg')"
                :class="form.student_type === 'ssg' ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm text-emerald-950' : 'bg-white/80 border-slate-200 hover:border-slate-300 text-slate-700'"
                class="min-h-[56px] p-3 rounded-xl border text-left transition-all active:scale-[0.98] flex items-start gap-2.5 cursor-pointer"
              >
                <div 
                  :class="form.student_type === 'ssg' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'" 
                  class="p-1.5 rounded-lg shrink-0 mt-0.5 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <div class="text-xs font-bold leading-tight flex items-center gap-1.5">
                    SSG Representative
                    <span v-if="form.student_type === 'ssg'" class="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">Selected</span>
                  </div>
                  <p class="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                    Supreme Student Government (Officers, Committees)
                  </p>
                </div>
              </button>
            </div>
            <p v-if="fieldErrors.student_type" class="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
              {{ fieldErrors.student_type }}
            </p>
          </div>

          <!-- Dynamic Name/Role Input based on RSO vs SSG -->
          <div>
            <div class="flex items-center justify-between mb-1.5 ml-0.5">
              <label class="block text-slate-700 text-xs font-bold">
                {{ form.student_type === 'rso' ? 'Recognized Student Organization (RSO) Name' : 'Officer Position' }} <span class="text-rose-500">*</span>
              </label>
            </div>

            <!-- Instruction for RSO: Put the full name of the organization -->
            <p v-if="form.student_type === 'rso'" class="text-[11px] text-slate-500 font-medium mb-1.5 ml-0.5 flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Please enter the full name of the organization followed by its acronym in parentheses.</span>
            </p>

            <input
              v-model="form.organization_name"
              type="text"
              maxlength="150"
              spellcheck="false"
              required
              @input="handleOrganizationNameInput"
              :class="fieldErrors.organization_name ? 'border-rose-300 ring-1 ring-rose-500/20 bg-rose-50/20' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white'"
              class="w-full px-4 py-3 rounded-xl border text-slate-900 text-base sm:text-sm font-medium placeholder-slate-400 focus:outline-none transition-all min-h-[48px]"
              :placeholder="form.student_type === 'rso' ? 'e.g. Body of Young Information Technologist (BYTE)' : 'President, Vice President, etc.'"
            />
            <p v-if="fieldErrors.organization_name" class="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
              {{ fieldErrors.organization_name }}
            </p>
          </div>

          <!-- College / Academic Unit Selection (BSU Main Campus) -->
          <div>
            <div class="flex items-center justify-between mb-1.5 ml-0.5">
              <label class="block text-slate-700 text-xs font-bold">
                College / Academic Unit <span class="text-rose-500">*</span>
              </label>
              <span class="text-[11px] text-slate-400 font-medium">BSU La Trinidad</span>
            </div>
            <div class="relative">
              <select
                v-model="form.college"
                @change="handleCollegeChange"
                required
                :class="fieldErrors.college ? 'border-rose-300 ring-1 ring-rose-500/20 bg-rose-50/20 text-rose-900' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white text-slate-900'"
                class="w-full px-4 py-3 pr-10 rounded-xl border text-base sm:text-sm font-medium focus:outline-none transition-all min-h-[48px] appearance-none cursor-pointer"
              >
                <option value="" disabled>Select your college or academic unit...</option>
                <option 
                  v-for="c in BSU_COLLEGES" 
                  :key="c.code" 
                  :value="c.name"
                >
                  {{ c.name }}
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p v-if="fieldErrors.college" class="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
              {{ fieldErrors.college }}
            </p>
          </div>
        </div>

        <!-- BSU Faculty / Staff Classification (Employee only) -->
        <div v-if="form.role === 'employee'" class="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3.5 transition-all">
          <div class="flex items-start gap-2.5">
            <div class="p-1.5 rounded-lg bg-emerald-600 text-white shrink-0 mt-0.5 shadow-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xs font-bold text-emerald-950 leading-snug">
                BSU Faculty &amp; Staff Classification
              </h3>
              <p class="text-xs text-emerald-800/90 font-medium leading-relaxed mt-0.5">
                Select your personnel appointment type. Teaching personnel must specify their designated college or academic unit.
              </p>
            </div>
          </div>

          <!-- 3 Faculty / Staff Options -->
          <div>
            <label class="block text-slate-700 text-xs font-bold mb-1.5 ml-0.5">
              Select Faculty / Staff Type <span class="text-rose-500">*</span>
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              
              <!-- 1. Teaching Staff -->
              <button
                type="button"
                @click="handleEmployeeTypeSelect('Teaching Staff')"
                :class="form.employee_type === 'Teaching Staff' ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm text-emerald-950' : 'bg-white/80 border-slate-200 hover:border-slate-300 text-slate-700'"
                class="min-h-[56px] p-3 rounded-xl border text-left transition-all active:scale-[0.98] flex items-start gap-2.5 cursor-pointer"
              >
                <div 
                  :class="form.employee_type === 'Teaching Staff' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'" 
                  class="p-1.5 rounded-lg shrink-0 mt-0.5 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <div>
                  <div class="text-xs font-bold leading-tight flex items-center gap-1.5">
                    Teaching Staff
                    <span v-if="form.employee_type === 'Teaching Staff'" class="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">Selected</span>
                  </div>
                  <p class="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                    Faculty, Professors &amp; Instructors
                  </p>
                </div>
              </button>

              <!-- 2. Research and Extension Staff -->
              <button
                type="button"
                @click="handleEmployeeTypeSelect('Research and Extension Staff')"
                :class="form.employee_type === 'Research and Extension Staff' ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm text-emerald-950' : 'bg-white/80 border-slate-200 hover:border-slate-300 text-slate-700'"
                class="min-h-[56px] p-3 rounded-xl border text-left transition-all active:scale-[0.98] flex items-start gap-2.5 cursor-pointer"
              >
                <div 
                  :class="form.employee_type === 'Research and Extension Staff' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'" 
                  class="p-1.5 rounded-lg shrink-0 mt-0.5 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div>
                  <div class="text-xs font-bold leading-tight flex items-center gap-1.5">
                    Research &amp; Extension
                    <span v-if="form.employee_type === 'Research and Extension Staff'" class="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">Selected</span>
                  </div>
                  <p class="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                    Research Centers &amp; Extension Units
                  </p>
                </div>
              </button>

              <!-- 3. Support / Administrative Staff -->
              <button
                type="button"
                @click="handleEmployeeTypeSelect('Support / Administrative Staff')"
                :class="form.employee_type === 'Support / Administrative Staff' ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm text-emerald-950' : 'bg-white/80 border-slate-200 hover:border-slate-300 text-slate-700'"
                class="min-h-[56px] p-3 rounded-xl border text-left transition-all active:scale-[0.98] flex items-start gap-2.5 cursor-pointer"
              >
                <div 
                  :class="form.employee_type === 'Support / Administrative Staff' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'" 
                  class="p-1.5 rounded-lg shrink-0 mt-0.5 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <div class="text-xs font-bold leading-tight flex items-center gap-1.5">
                    Support / Admin Staff
                    <span v-if="form.employee_type === 'Support / Administrative Staff'" class="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">Selected</span>
                  </div>
                  <p class="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                    Administrative &amp; Support Personnel
                  </p>
                </div>
              </button>
            </div>
            <p v-if="fieldErrors.employee_type" class="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1">
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
              {{ fieldErrors.employee_type }}
            </p>
          </div>

          <!-- College / Academic Unit Selection (Visible ONLY if Teaching Staff) -->
          <div v-if="form.employee_type === 'Teaching Staff'" class="pt-1">
            <div class="flex items-center justify-between mb-1.5 ml-0.5">
              <label class="block text-slate-700 text-xs font-bold">
                Assigned College / Academic Unit <span class="text-rose-500">*</span>
              </label>
              <span class="text-[11px] text-slate-400 font-medium">BSU Faculty Assignment</span>
            </div>
            <div class="relative">
              <select
                v-model="form.college"
                @change="handleCollegeChange"
                required
                :class="fieldErrors.college ? 'border-rose-300 ring-1 ring-rose-500/20 bg-rose-50/20 text-rose-900' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white text-slate-900'"
                class="w-full px-4 py-3 pr-10 rounded-xl border text-base sm:text-sm font-medium focus:outline-none transition-all min-h-[48px] appearance-none cursor-pointer"
              >
                <option value="" disabled>Select your assigned college or academic unit...</option>
                <option 
                  v-for="c in BSU_COLLEGES" 
                  :key="c.code" 
                  :value="c.name"
                >
                  {{ c.name }}
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p v-if="fieldErrors.college" class="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
              {{ fieldErrors.college }}
            </p>
          </div>

          <!-- Administrative & Support Buildings Selection (Visible ONLY if Support / Administrative Staff) -->
          <div v-if="form.employee_type === 'Support / Administrative Staff'" class="pt-1">
            <div class="flex items-center justify-between mb-1.5 ml-0.5">
              <label class="block text-slate-700 text-xs font-bold">
                Assigned Administrative / Support Building <span class="text-rose-500">*</span>
              </label>
              <span class="text-[11px] text-slate-400 font-medium">BSU Administrative Facility</span>
            </div>
            <div class="relative">
              <select
                v-model="form.college"
                @change="handleCollegeChange"
                required
                :class="fieldErrors.college ? 'border-rose-300 ring-1 ring-rose-500/20 bg-rose-50/20 text-rose-900' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white text-slate-900'"
                class="w-full px-4 py-3 pr-10 rounded-xl border text-base sm:text-sm font-medium focus:outline-none transition-all min-h-[48px] appearance-none cursor-pointer"
              >
                <option value="" disabled>Select your administrative or support building...</option>
                <option 
                  v-for="b in ADMIN_SUPPORT_BUILDINGS" 
                  :key="b" 
                  :value="b"
                >
                  {{ b }}
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p v-if="fieldErrors.college" class="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
              {{ fieldErrors.college }}
            </p>
          </div>
        </div>

        <!-- Name Fields (Two Columns on sm+, stacked on mobile) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          <div>
            <div class="flex items-center justify-between mb-1.5 ml-0.5">
              <label class="block text-slate-700 text-xs font-bold">
                First Name <span class="text-rose-500">*</span>
              </label>
              <span class="text-[11px] text-slate-400 font-medium">Letters only</span>
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
              class="w-full px-4 py-3 rounded-xl border text-slate-900 text-base sm:text-sm font-medium placeholder-slate-400 focus:outline-none transition-all min-h-[48px]"
              placeholder="e.g. Juan"
            />
            <p v-if="fieldErrors.first_name" class="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
              {{ fieldErrors.first_name }}
            </p>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5 ml-0.5">
              <label class="block text-slate-700 text-xs font-bold">
                Last Name <span class="text-rose-500">*</span>
              </label>
              <span class="text-[11px] text-slate-400 font-medium">Letters only</span>
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
              class="w-full px-4 py-3 rounded-xl border text-slate-900 text-base sm:text-sm font-medium placeholder-slate-400 focus:outline-none transition-all min-h-[48px]"
              placeholder="e.g. Dela Cruz"
            />
            <p v-if="fieldErrors.last_name" class="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
              {{ fieldErrors.last_name }}
            </p>
          </div>
        </div>

        <!-- Identifier & Contact Fields -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          
          <!-- ID Number (Strict 7 digits for students) -->
          <div>
            <div class="flex items-center justify-between mb-1.5 ml-0.5">
              <label class="block text-slate-700 text-xs font-bold">
                {{ form.role === 'student' ? 'Student ID Number' : 'Employee ID Number' }} <span class="text-rose-500">*</span>
              </label>
              <span 
                v-if="form.role === 'student'" 
                :class="form.student_id_number.length === 7 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-slate-500 bg-slate-100 border-slate-200'"
                class="text-[10px] font-bold px-1.5 py-0.5 rounded border transition-colors"
              >
                {{ form.student_id_number.length }}/7 digits
              </span>
              <span v-else class="text-[11px] text-slate-400 font-medium">
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
              class="w-full px-4 py-3 rounded-xl border text-slate-900 text-base sm:text-sm font-semibold tracking-wider placeholder-slate-400 focus:outline-none transition-all min-h-[48px]"
              :placeholder="form.role === 'student' ? 'e.g. 2301219' : 'e.g. EMP-9876'"
            />
            <p v-if="fieldErrors.student_id_number" class="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
              {{ fieldErrors.student_id_number }}
            </p>
            <p v-else class="mt-1 text-[11px] text-slate-400">
              {{ form.role === 'student' ? 'Strict 7-digit institutional student ID (numbers only).' : 'Institutional employee or faculty ID code.' }}
            </p>
          </div>

          <!-- Contact Number (Strict 11 digits starting with 09) -->
          <div>
            <div class="flex items-center justify-between mb-1.5 ml-0.5">
              <label class="block text-slate-700 text-xs font-bold">
                Contact Number <span class="text-rose-500">*</span>
              </label>
              <span 
                :class="form.contact_number.length === 11 && form.contact_number.startsWith('09') ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-slate-500 bg-slate-100 border-slate-200'"
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
              class="w-full px-4 py-3 rounded-xl border text-slate-900 text-base sm:text-sm font-semibold tracking-wider placeholder-slate-400 focus:outline-none transition-all min-h-[48px]"
              placeholder="e.g. 09171234567"
            />
            <p v-if="fieldErrors.contact_number" class="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
              {{ fieldErrors.contact_number }}
            </p>
            <p v-else class="mt-1 text-[11px] text-slate-400">
              Philippine mobile number starting with 09 (numbers only).
            </p>
          </div>
        </div>

        <!-- Email Address (Required) -->
        <div>
          <div class="flex items-center justify-between mb-1.5 ml-0.5">
            <label class="block text-slate-700 text-xs font-bold">
              Email Address <span class="text-rose-500">*</span>
            </label>
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Required
            </span>
          </div>
          <input 
            v-model="form.email"
            type="email" 
            autocomplete="email"
            spellcheck="false"
            maxlength="100"
            required
            @blur="handleEmailBlur"
            :class="fieldErrors.email ? 'border-rose-300 ring-1 ring-rose-500/20 bg-rose-50/20' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-slate-50 focus:bg-white'"
            class="w-full px-4 py-3 rounded-xl border text-slate-900 text-base sm:text-sm font-medium placeholder-slate-400 focus:outline-none transition-all min-h-[48px]"
            placeholder="e.g. juan.delacruz@bsu.edu.ph"
          />
          <p v-if="fieldErrors.email" class="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
            <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
            {{ fieldErrors.email }}
          </p>
          <p v-else class="mt-1 text-[11px] text-slate-500 font-normal">
            Required for password recovery and automated service ticket notifications.
          </p>
        </div>

        <!-- Password Fields -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          
          <!-- Password Input -->
          <div>
            <div class="flex items-center justify-between mb-1.5 ml-0.5">
              <label class="block text-slate-700 text-xs font-bold">
                Password <span class="text-rose-500">*</span>
              </label>
              <button 
                type="button" 
                @click="showPassword = !showPassword"
                class="text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors p-1 -m-1 cursor-pointer"
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
                class="w-full px-4 py-3 rounded-xl border text-slate-900 text-base sm:text-sm font-medium placeholder-slate-400 focus:outline-none transition-all min-h-[48px]"
                placeholder="Minimum 8 characters"
              />
            </div>
            <p v-if="fieldErrors.password" class="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
              {{ fieldErrors.password }}
            </p>
          </div>

          <!-- Confirm Password Input -->
          <div>
            <div class="flex items-center justify-between mb-1.5 ml-0.5">
              <label class="block text-slate-700 text-xs font-bold">
                Confirm Password <span class="text-rose-500">*</span>
              </label>
              <button 
                type="button" 
                @click="showConfirmPassword = !showConfirmPassword"
                class="text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors p-1 -m-1 cursor-pointer"
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
                class="w-full px-4 py-3 rounded-xl border text-slate-900 text-base sm:text-sm font-medium placeholder-slate-400 focus:outline-none transition-all min-h-[48px]"
                placeholder="Re-enter password"
              />
            </div>
            
            <!-- Real-time match indicator -->
            <div v-if="isConfirmPasswordTouched" class="mt-1">
              <p v-if="isPasswordMatch" class="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                Passwords match
              </p>
              <p v-else class="text-xs text-rose-500 font-medium flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                Passwords do not match
              </p>
            </div>
            <p v-else-if="fieldErrors.password_confirm" class="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
              {{ fieldErrors.password_confirm }}
            </p>
          </div>
        </div>

        <!-- Elder-Friendly Password Requirements Card (No special characters required) -->
        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Password Checklist
            </span>
            <span class="text-[11px] text-slate-500 font-medium">Simple & Easy</span>
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

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
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
        </div>

        <!-- Mandatory ID Card & Selfie Upload Section (2 Files Required) -->
        <div 
          class="pt-3 border-t border-slate-200/80 space-y-3"
          @dragover.prevent 
          @drop="handleSectionDrop"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 ml-0.5">
            <div class="flex items-center gap-2 flex-wrap">
              <label class="block text-slate-800 text-xs sm:text-sm font-black">
                Identity Verification Documents <span class="text-rose-500">*</span>
              </label>
              <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black tracking-wider uppercase border border-emerald-200">
                2 Files Required
              </span>
            </div>
            <span class="text-[11px] text-slate-500 font-medium">Max 5MB per file • JPG, PNG, WebP</span>
          </div>

          <!-- Instruction Callout Card -->
          <div class="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200/90 text-xs text-emerald-950 flex items-start gap-3 shadow-2xs">
            <div class="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="space-y-1">
              <p class="font-black text-emerald-950 text-xs sm:text-sm leading-tight">Verification Instructions:</p>
              <p class="text-emerald-900 font-medium text-xs leading-relaxed">
                Please upload a <strong>clear picture of the front ID</strong> and another <strong>picture for selfie while holding the ID</strong>. Make sure all ID text and your face are sharp and clearly legible.
              </p>
            </div>
          </div>

          <!-- Hidden File Inputs for Individual or Multi-Select -->
          <input 
            ref="fileInputRef"
            type="file" 
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" 
            class="hidden" 
            @change="(e) => handleFileSelect(e, 'front')"
          />
          <input 
            ref="selfieInputRef"
            type="file" 
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" 
            class="hidden" 
            @change="(e) => handleFileSelect(e, 'selfie')"
          />

          <!-- 2-Slot Grid: Front ID Card & Selfie Holding ID -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">

            <!-- Slot 1: Front ID Card -->
            <div class="flex flex-col">
              <div class="flex items-center justify-between mb-1.5 ml-0.5">
                <span class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                  </svg>
                  <span>1. Front ID Card</span> <span class="text-rose-500">*</span>
                </span>
                <span v-if="idCardFile" class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Ready
                </span>
              </div>

              <!-- Empty upload box for Front ID -->
              <div 
                v-if="!idCardPreview"
                @click="$refs.fileInputRef?.click()"
                class="min-h-[140px] border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/80 hover:bg-emerald-50/30 rounded-2xl p-4 text-center cursor-pointer transition-all duration-200 group flex flex-col items-center justify-center active:scale-[0.99]"
              >
                <div class="w-10 h-10 bg-white rounded-xl shadow-xs flex items-center justify-center mb-2 group-hover:scale-105 transition-transform border border-slate-100 text-emerald-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p class="text-xs font-bold text-slate-800 group-hover:text-emerald-700">Upload Front ID</p>
                <p class="text-[10px] text-slate-500 mt-0.5">Clear picture of front ID card</p>
              </div>

              <!-- Preview card for Front ID -->
              <div v-else class="rounded-2xl border border-slate-200 bg-slate-50 p-3 flex flex-col gap-2.5 shadow-2xs">
                <div class="w-full h-28 sm:h-32 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-2xs relative">
                  <img :src="idCardPreview" alt="Front ID Preview" class="w-full h-full object-cover" />
                </div>
                <div class="flex items-center justify-between gap-2">
                  <div class="truncate">
                    <p class="text-xs font-bold text-slate-800 truncate" :title="idCardFile?.name">{{ idCardFile?.name }}</p>
                    <p class="text-[10px] text-slate-500">{{ (idCardFile?.size / (1024 * 1024)).toFixed(2) }} MB • Front ID</p>
                  </div>
                  <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                </div>
                <div class="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                  <button 
                    type="button" 
                    @click="$refs.fileInputRef?.click()" 
                    class="flex-1 min-h-[36px] text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white border border-slate-200 hover:border-emerald-300 py-1.5 px-3 rounded-lg shadow-2xs transition-all cursor-pointer text-center"
                  >
                    Change
                  </button>
                  <button 
                    type="button" 
                    @click="removeSelectedFile('front')" 
                    class="min-h-[36px] text-xs font-bold text-rose-600 hover:text-rose-700 bg-white border border-slate-200 hover:border-rose-300 py-1.5 px-3 rounded-lg shadow-2xs transition-all cursor-pointer text-center"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <p v-if="fieldErrors.id_card" class="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                {{ fieldErrors.id_card }}
              </p>
            </div>

            <!-- Slot 2: Selfie Holding ID -->
            <div class="flex flex-col">
              <div class="flex items-center justify-between mb-1.5 ml-0.5">
                <span class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>2. Selfie with ID</span> <span class="text-rose-500">*</span>
                </span>
                <span v-if="idSelfieFile" class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Ready
                </span>
              </div>

              <!-- Empty upload box for Selfie with ID -->
              <div 
                v-if="!idSelfiePreview"
                @click="$refs.selfieInputRef?.click()"
                class="min-h-[140px] border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/80 hover:bg-emerald-50/30 rounded-2xl p-4 text-center cursor-pointer transition-all duration-200 group flex flex-col items-center justify-center active:scale-[0.99]"
              >
                <div class="w-10 h-10 bg-white rounded-xl shadow-xs flex items-center justify-center mb-2 group-hover:scale-105 transition-transform border border-slate-100 text-emerald-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p class="text-xs font-bold text-slate-800 group-hover:text-emerald-700">Upload Selfie with ID</p>
                <p class="text-[10px] text-slate-500 mt-0.5">Selfie holding your ID card</p>
              </div>

              <!-- Preview card for Selfie with ID -->
              <div v-else class="rounded-2xl border border-slate-200 bg-slate-50 p-3 flex flex-col gap-2.5 shadow-2xs">
                <div class="w-full h-28 sm:h-32 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-2xs relative">
                  <img :src="idSelfiePreview" alt="Selfie with ID Preview" class="w-full h-full object-cover" />
                </div>
                <div class="flex items-center justify-between gap-2">
                  <div class="truncate">
                    <p class="text-xs font-bold text-slate-800 truncate" :title="idSelfieFile?.name">{{ idSelfieFile?.name }}</p>
                    <p class="text-[10px] text-slate-500">{{ (idSelfieFile?.size / (1024 * 1024)).toFixed(2) }} MB • Selfie with ID</p>
                  </div>
                  <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                </div>
                <div class="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                  <button 
                    type="button" 
                    @click="$refs.selfieInputRef?.click()" 
                    class="flex-1 min-h-[36px] text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white border border-slate-200 hover:border-emerald-300 py-1.5 px-3 rounded-lg shadow-2xs transition-all cursor-pointer text-center"
                  >
                    Change
                  </button>
                  <button 
                    type="button" 
                    @click="removeSelectedFile('selfie')" 
                    class="min-h-[36px] text-xs font-bold text-rose-600 hover:text-rose-700 bg-white border border-slate-200 hover:border-rose-300 py-1.5 px-3 rounded-lg shadow-2xs transition-all cursor-pointer text-center"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <p v-if="fieldErrors.id_selfie" class="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                {{ fieldErrors.id_selfie }}
              </p>
            </div>

          </div>
        </div>

        <!-- Informative Card Notice -->
        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 leading-relaxed flex items-start gap-2.5">
          <svg class="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <span class="font-bold text-slate-800">Account Access:</span>
            Once registered, you can log in immediately to explore the GSO portal. Official service ticket intake will be authorized following ID verification by the Super Administrator.
          </div>
        </div>

        <!-- Disclaimer Checkbox (Required) -->
        <div class="pt-2">
          <div v-if="!hasAgreedToDisclaimer" class="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
            <div class="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm flex-shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-bold text-amber-900">Required: Privacy & Terms Acceptance</p>
              <p class="text-xs text-amber-800 mt-0.5 leading-relaxed">
                You must review and accept the <strong>Data Privacy Notice & Terms of Use</strong> before completing registration.
              </p>
              <button 
                type="button"
                @click="showDisclaimerModal = true; isDisclaimerTouched = true"
                class="mt-2 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Review Disclaimer & Accept
              </button>
            </div>
          </div>
          <div v-else class="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <svg class="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-xs font-semibold text-emerald-800">Disclaimer accepted — You may proceed with registration.</span>
          </div>
        </div>

        <!-- Submit Button -->
        <button 
          :disabled="isLoading || !hasAgreedToDisclaimer"
          type="submit"
          class="w-full min-h-[48px] py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-xl shadow-slate-900/20 transform hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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

    <!-- Data Privacy Act Disclaimer Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDisclaimerModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" @click.self="closeDisclaimerModal">
          <div class="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-scale-up flex flex-col">
            
            <!-- Modal Header -->
            <div class="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-black text-white leading-tight">Data Privacy Notice & Terms of Use</h3>
                  <p class="text-xs text-slate-300 font-medium mt-0.5">Republic Act No. 10173 Compliance — Benguet State University GSO</p>
                </div>
              </div>
              <button
                @click="closeDisclaimerModal"
                class="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 transition-colors flex items-center justify-center"
                title="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Modal Body -->
            <div class="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar text-sm text-slate-700 leading-relaxed">
              
              <!-- Data Privacy Act Notice -->
              <div class="space-y-3 border-l-4 border-emerald-500 pl-4 py-2 bg-emerald-50/50 rounded-r-xl">
                <h4 class="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Republic Act No. 10173 — Data Privacy Act of 2012
                </h4>
                <p class="text-xs text-slate-700">
                  Benguet State University (BSU), through the General Services Office (GSO), respects your privacy and is committed to protecting your personal information in accordance with the <strong>Data Privacy Act of 2012 (Republic Act No. 10173)</strong>, its Implementing Rules and Regulations, and other relevant issuances by the National Privacy Commission (NPC).
                </p>
              </div>

              <!-- Purpose of Collection -->
              <div class="space-y-2">
                <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                  Purpose of Data Collection
                </h4>
                <ul class="list-disc list-inside text-xs text-slate-700 space-y-1 ml-2">
                  <li>Identity verification for GSO E-Ticketing System access</li>
                  <li>Processing and tracking of service requests and work orders</li>
                  <li>Communication regarding ticket status, updates, and notifications</li>
                  <li>Generation of official reports and documentation for university operations</li>
                  <li>Compliance with university policies, audit requirements, and legal obligations</li>
                </ul>
              </div>

              <!-- Types of Data Collected -->
              <div class="space-y-2">
                <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Types of Personal Data Collected
                </h4>
                <ul class="list-disc list-inside text-xs text-slate-700 space-y-1 ml-2">
                  <li>Full name, student/employee ID number, contact number, email address</li>
                  <li>College/unit affiliation, role classification (student RSO/SSG, faculty, staff)</li>
                  <li>Government-issued ID image (front) and selfie with ID for identity verification</li>
                  <li>Account credentials (hashed password), login timestamps, and activity logs</li>
                  <li>Ticket submission history, attachments, and communication records</li>
                </ul>
              </div>

              <!-- Data Processing & Retention -->
              <div class="space-y-2">
                <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Data Processing, Retention & Security
                </h4>
                <ul class="list-disc list-inside text-xs text-slate-700 space-y-1 ml-2">
                  <li>Data is processed only for the stated purposes with appropriate technical and organizational security measures</li>
                  <li>ID images are used solely for verification and are not shared with unauthorized parties</li>
                  <li>Personal data is retained only as long as necessary for the purposes stated or as required by law</li>
                  <li>You have rights under RA 10173: access, rectification, erasure, restriction, portability, and objection</li>
                  <li>Contact the BSU Data Protection Officer at <span class="font-semibold">dpo@bsu.edu.ph</span> for privacy concerns</li>
                </ul>
              </div>

              <!-- Data Sharing -->
              <div class="space-y-2">
                <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  Data Sharing & Disclosure
                </h4>
                <p class="text-xs text-slate-700">
                  Your personal data will not be sold, rented, or leased to third parties. Disclosure may occur only:
                </p>
                <ul class="list-disc list-inside text-xs text-slate-700 space-y-1 ml-2">
                  <li>To authorized BSU/GSO personnel for official duties</li>
                  <li>When required by law, court order, or government agency with valid authority</li>
                  <li>With your explicit consent for specific purposes</li>
                  <li>In anonymized/aggregated form for statistical reporting</li>
                </ul>
              </div>

              <!-- User Rights -->
              <div class="space-y-2 border-l-4 border-amber-500 pl-4 py-2 bg-amber-50/50 rounded-r-xl">
                <h4 class="text-xs font-black text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Your Rights as a Data Subject (RA 10173, Chapter IV)
                </h4>
                <ul class="list-disc list-inside text-xs text-slate-700 space-y-1 ml-2">
                  <li><strong>Right to be Informed</strong> — Know what data is collected and why</li>
                  <li><strong>Right to Access</strong> — Request a copy of your personal data</li>
                  <li><strong>Right to Rectification</strong> — Correct inaccurate or incomplete data</li>
                  <li><strong>Right to Erasure/Blocking</strong> — Request deletion when data is no longer necessary</li>
                  <li><strong>Right to Data Portability</strong> — Obtain your data in a structured, commonly used format</li>
                  <li><strong>Right to Object</strong> — Object to processing for direct marketing or profiling</li>
                  <li><strong>Right to Damages</strong> — Seek compensation for damages due to violations</li>
                </ul>
              </div>

              <!-- Terms of Use Summary -->
              <div class="space-y-2 pt-2 border-t border-slate-200">
                <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Terms of Use — Summary
                </h4>
                <ul class="list-disc list-inside text-xs text-slate-700 space-y-1 ml-2">
                  <li>This account is for official BSU GSO E-Ticketing System use only</li>
                  <li>You are responsible for maintaining the confidentiality of your login credentials</li>
                  <li>You must provide accurate, current, and complete information</li>
                  <li>Misuse, impersonation, or unauthorized access attempts will result in account suspension</li>
                  <li>BSU reserves the right to suspend/terminate accounts violating these terms</li>
                  <li>Service availability is subject to university IT policies and maintenance schedules</li>
                </ul>
              </div>

              <!-- Consent Statement -->
              <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <p class="text-xs font-semibold text-slate-800">By clicking <strong>"I Agree"</strong>, you acknowledge that:</p>
                <ul class="list-disc list-inside text-xs text-slate-700 space-y-1 ml-2">
                  <li>You have read and understood this Data Privacy Notice and Terms of Use</li>
                  <li>You voluntarily consent to the collection, use, and processing of your personal data as described</li>
                  <li>You confirm that all information provided is true, accurate, and complete</li>
                  <li>You understand your rights under RA 10173 and how to exercise them</li>
                  <li>You agree to comply with BSU GSO E-Ticketing System policies and guidelines</li>
                </ul>
              </div>

            </div>

            <!-- Modal Footer -->
            <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                @click="closeDisclaimerModal"
                class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
              >
                Decline / Cancel
              </button>
              <button
                type="button"
                @click="acceptDisclaimer"
                class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>I Agree — Accept Terms</span>
              </button>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>
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
