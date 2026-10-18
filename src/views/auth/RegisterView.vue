<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { register as apiRegister } from '@/api/auth';
import { BSU_COLLEGES } from '@/constants/colleges';
import { ADMIN_SUPPORT_BUILDINGS, RESEARCH_EXTENSION_BUILDINGS } from '@/constants/locations';

const router = useRouter();

// Multi-Step Wizard State (4 steps)
const currentStep = ref(1);
const TOTAL_STEPS = 4;
const stepLabels = ['Role', 'Info', 'Security', 'Verify'];

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
  
  // Clear role-specific fields
  form.value.student_id_number = '';
  form.value.college = '';
  form.value.organization_name = '';
  form.value.student_type = 'rso'; // Reset to default
  form.value.employee_type = '';
  
  // Clear related field errors
  if (fieldErrors.value.college) {
    delete fieldErrors.value.college;
  }
  if (fieldErrors.value.employee_type) {
    delete fieldErrors.value.employee_type;
  }
  if (fieldErrors.value.student_id_number) {
    delete fieldErrors.value.student_id_number;
  }
  if (fieldErrors.value.student_type) {
    delete fieldErrors.value.student_type;
  }
  if (fieldErrors.value.organization_name) {
    delete fieldErrors.value.organization_name;
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

// Per-Step Validation (validates only the current step's fields)
const validateStep = (step) => {
  fieldErrors.value = {};
  errorMessage.value = '';

  if (step === 1) {
    // Step 1: Role & Affiliation
    if (form.value.role === 'student') {
      if (!form.value.student_type) {
        fieldErrors.value.student_type = 'Please select RSO or SSG.';
      }
      const org = form.value.organization_name.trim();
      if (!org) {
        fieldErrors.value.organization_name = form.value.student_type === 'rso'
          ? 'Organization name is required.'
          : 'Officer position is required.';
      } else if (org.length < 2) {
        fieldErrors.value.organization_name = 'Must be at least 2 characters.';
      }
      if (!form.value.college) {
        fieldErrors.value.college = 'Please select your college.';
      }
    }

    if (form.value.role === 'employee') {
      if (!form.value.employee_type) {
        fieldErrors.value.employee_type = 'Please select your staff classification.';
      } else if (form.value.employee_type === 'Teaching Staff') {
        if (!form.value.college) {
          fieldErrors.value.college = 'Please select your assigned college.';
        }
      } else if (form.value.employee_type === 'Research and Extension Staff') {
        if (!form.value.college) {
          fieldErrors.value.college = 'Please select your assigned center.';
        }
      } else if (form.value.employee_type === 'Support / Administrative Staff') {
        if (!form.value.college) {
          fieldErrors.value.college = 'Please select your assigned building.';
        }
      }
    }
  }

  if (step === 2) {
    // Step 2: Personal Info
    const fn = form.value.first_name.trim();
    if (!fn) {
      fieldErrors.value.first_name = 'First name is required.';
    } else if (fn.length < 2) {
      fieldErrors.value.first_name = 'Must be at least 2 characters.';
    } else if (!/^[a-zA-ZÀ-ÿ\s\-'.]{2,50}$/.test(fn) || !/[a-zA-ZÀ-ÿ]/.test(fn)) {
      fieldErrors.value.first_name = 'Letters, spaces, hyphens, and apostrophes only.';
    }

    const ln = form.value.last_name.trim();
    if (!ln) {
      fieldErrors.value.last_name = 'Last name is required.';
    } else if (ln.length < 2) {
      fieldErrors.value.last_name = 'Must be at least 2 characters.';
    } else if (!/^[a-zA-ZÀ-ÿ\s\-'.]{2,50}$/.test(ln) || !/[a-zA-ZÀ-ÿ]/.test(ln)) {
      fieldErrors.value.last_name = 'Letters, spaces, hyphens, and apostrophes only.';
    }

    const idNum = form.value.student_id_number.trim();
    if (!idNum) {
      fieldErrors.value.student_id_number = form.value.role === 'student' 
        ? 'Student ID is required.' 
        : 'Employee ID is required.';
    } else if (form.value.role === 'student') {
      if (!/^\d{7}$/.test(idNum)) {
        fieldErrors.value.student_id_number = 'Must be exactly 7 digits.';
      }
    } else {
      if (!/^[A-Za-z0-9\-]{4,15}$/.test(idNum)) {
        fieldErrors.value.student_id_number = '4–15 alphanumeric characters.';
      }
    }

    const contact = form.value.contact_number.trim();
    if (!contact) {
      fieldErrors.value.contact_number = 'Contact number is required.';
    } else if (!contact.startsWith('09')) {
      fieldErrors.value.contact_number = 'Must start with 09.';
    } else if (!/^09\d{9}$/.test(contact)) {
      fieldErrors.value.contact_number = 'Must be exactly 11 digits.';
    }

    const em = form.value.email.trim();
    if (!em) {
      fieldErrors.value.email = 'Email is required.';
    } else {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(em)) {
        fieldErrors.value.email = 'Please enter a valid email.';
      }
    }
  }

  if (step === 3) {
    // Step 3: Password
    const pwd = form.value.password;
    if (!pwd) {
      fieldErrors.value.password = 'Password is required.';
    } else if (pwd.length < 8) {
      fieldErrors.value.password = 'Must be at least 8 characters.';
    } else if (!/[a-zA-Z]/.test(pwd)) {
      fieldErrors.value.password = 'Must include at least one letter.';
    } else if (!/[0-9]/.test(pwd)) {
      fieldErrors.value.password = 'Must include at least one number.';
    }

    if (!form.value.password_confirm) {
      fieldErrors.value.password_confirm = 'Please confirm your password.';
    } else if (form.value.password !== form.value.password_confirm) {
      fieldErrors.value.password_confirm = 'Passwords do not match.';
    }
  }

  if (step === 4) {
    // Step 4: ID Upload & Terms
    if (!idCardFile.value) {
      fieldErrors.value.id_card = 'Front ID photo is required.';
    }
    if (!idSelfieFile.value) {
      fieldErrors.value.id_selfie = 'Selfie with ID is required.';
    }
    if (!hasAgreedToDisclaimer.value) {
      fieldErrors.value.disclaimer = 'Please accept the Data Privacy Notice & Terms.';
    }
  }

  return Object.keys(fieldErrors.value).length === 0;
};

// Full validation for final submit (runs all steps)
const validateClient = () => {
  fieldErrors.value = {};
  errorMessage.value = '';

  // Run all step validations to collect all errors
  const allErrors = {};

  // Step 1 errors
  if (form.value.role === 'student') {
    if (!form.value.student_type) allErrors.student_type = 'Please select RSO or SSG.';
    const org = form.value.organization_name.trim();
    if (!org) allErrors.organization_name = form.value.student_type === 'rso' ? 'Organization name is required.' : 'Officer position is required.';
    else if (org.length < 2) allErrors.organization_name = 'Must be at least 2 characters.';
    if (!form.value.college) allErrors.college = 'Please select your college.';
  }
  if (form.value.role === 'employee') {
    if (!form.value.employee_type) allErrors.employee_type = 'Please select your staff classification.';
    else if (!form.value.college) allErrors.college = 'Please select your assignment.';
  }

  // Step 2 errors
  const fn = form.value.first_name.trim();
  if (!fn) allErrors.first_name = 'First name is required.';
  else if (fn.length < 2 || !/^[a-zA-ZÀ-ÿ\s\-'.]{2,50}$/.test(fn)) allErrors.first_name = 'Invalid first name.';

  const ln = form.value.last_name.trim();
  if (!ln) allErrors.last_name = 'Last name is required.';
  else if (ln.length < 2 || !/^[a-zA-ZÀ-ÿ\s\-'.]{2,50}$/.test(ln)) allErrors.last_name = 'Invalid last name.';

  const idNum = form.value.student_id_number.trim();
  if (!idNum) allErrors.student_id_number = 'ID number is required.';
  else if (form.value.role === 'student' && !/^\d{7}$/.test(idNum)) allErrors.student_id_number = 'Must be exactly 7 digits.';
  else if (form.value.role === 'employee' && !/^[A-Za-z0-9\-]{4,15}$/.test(idNum)) allErrors.student_id_number = '4–15 alphanumeric characters.';

  const contact = form.value.contact_number.trim();
  if (!contact) allErrors.contact_number = 'Contact number is required.';
  else if (!/^09\d{9}$/.test(contact)) allErrors.contact_number = 'Must be 11 digits starting with 09.';

  const em = form.value.email.trim();
  if (!em) allErrors.email = 'Email is required.';
  else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(em)) allErrors.email = 'Invalid email format.';

  // Step 3 errors
  const pwd = form.value.password;
  if (!pwd) allErrors.password = 'Password is required.';
  else if (pwd.length < 8 || !/[a-zA-Z]/.test(pwd) || !/[0-9]/.test(pwd)) allErrors.password = 'Password does not meet requirements.';

  if (!form.value.password_confirm) allErrors.password_confirm = 'Please confirm your password.';
  else if (form.value.password !== form.value.password_confirm) allErrors.password_confirm = 'Passwords do not match.';

  // Step 4 errors
  if (!idCardFile.value) allErrors.id_card = 'Front ID photo is required.';
  if (!idSelfieFile.value) allErrors.id_selfie = 'Selfie with ID is required.';
  if (!hasAgreedToDisclaimer.value) allErrors.disclaimer = 'Please accept the terms.';

  fieldErrors.value = allErrors;
  return Object.keys(allErrors).length === 0;
};

// Step Navigation
const goToNextStep = () => {
  if (validateStep(currentStep.value)) {
    if (currentStep.value < TOTAL_STEPS) {
      currentStep.value++;
      errorMessage.value = '';
    }
  } else {
    errorMessage.value = 'Please fix the errors above before continuing.';
  }
};

const goToPrevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
    errorMessage.value = '';
    fieldErrors.value = {};
  }
};

const goToStep = (step) => {
  // Allow going back to any completed step, or forward if current step is valid
  if (step < currentStep.value) {
    currentStep.value = step;
    errorMessage.value = '';
    fieldErrors.value = {};
  }
};

const handleRegister = async () => {
  if (!hasAgreedToDisclaimer.value) {
    errorMessage.value = 'Please accept the Data Privacy Notice & Terms of Use before submitting.';
    return;
  }

  if (!validateClient()) {
    // Find first step with errors and navigate there
    const step1Fields = ['student_type', 'organization_name', 'college', 'employee_type'];
    const step2Fields = ['first_name', 'last_name', 'student_id_number', 'contact_number', 'email'];
    const step3Fields = ['password', 'password_confirm'];

    const errorKeys = Object.keys(fieldErrors.value);
    if (errorKeys.some(k => step1Fields.includes(k))) {
      currentStep.value = 1;
    } else if (errorKeys.some(k => step2Fields.includes(k))) {
      currentStep.value = 2;
    } else if (errorKeys.some(k => step3Fields.includes(k))) {
      currentStep.value = 3;
    } else {
      currentStep.value = 4;
    }
    errorMessage.value = 'Please correct the highlighted errors.';
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
    if (fieldErrors.value.disclaimer) {
      delete fieldErrors.value.disclaimer;
    }
  };

  // Computed: College/building options depending on employee_type
  const employeeCollegeOptions = computed(() => {
    if (form.value.employee_type === 'Teaching Staff') {
      return { label: 'Assigned College', placeholder: 'Select your college...', items: BSU_COLLEGES.map(c => ({ key: c.code, value: c.name, label: c.name })), type: 'colleges' };
    }
    if (form.value.employee_type === 'Research and Extension Staff') {
      return { label: 'Assigned Center', placeholder: 'Select your center...', items: RESEARCH_EXTENSION_BUILDINGS.map(b => ({ key: b, value: b, label: b })), type: 'buildings' };
    }
    if (form.value.employee_type === 'Support / Administrative Staff') {
      return { label: 'Assigned Building', placeholder: 'Select your building...', items: null, type: 'mixed' };
    }
    return null;
  });
</script>

<template>
  <div class="min-h-screen w-full relative flex items-center justify-center bg-slate-50 py-8 px-4 sm:px-6 font-sans">
    
    <!-- Subtle Background -->
    <div class="fixed inset-0 z-0 overflow-hidden bg-slate-50 pointer-events-none">
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Benguet_State_University_Main_Gate.jpg" 
        alt="" 
        class="w-full h-full object-cover opacity-10 filter grayscale"
      />
      <div class="absolute inset-0 bg-gradient-to-br from-white/80 via-slate-50/90 to-white z-0"></div>
    </div>

    <!-- Desktop University Branding (hidden on mobile) -->
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
      <div class="px-5 sm:px-8 pt-5 sm:pt-7">
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
          Create your <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">GSO Account</span>
        </h1>
        <p class="text-slate-500 text-xs sm:text-sm font-medium mt-1">
          Step {{ currentStep }} of {{ TOTAL_STEPS }} — {{ stepLabels[currentStep - 1] }}
        </p>
      </div>

      <!-- Step Progress Bar -->
      <div class="px-5 sm:px-8 pt-4 pb-1">
        <div class="flex items-center gap-1.5">
          <button
            v-for="step in TOTAL_STEPS"
            :key="step"
            type="button"
            @click="goToStep(step)"
            :class="[
              'h-1.5 rounded-full transition-all duration-300 flex-1',
              step <= currentStep ? 'bg-emerald-500' : 'bg-slate-200',
              step < currentStep ? 'cursor-pointer hover:bg-emerald-400' : 'cursor-default'
            ]"
            :title="`Step ${step}: ${stepLabels[step - 1]}`"
          ></button>
        </div>
      </div>

      <!-- Global Error -->
      <div v-if="errorMessage" class="mx-5 sm:mx-8 mt-3 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold flex items-center gap-2">
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>{{ errorMessage }}</span>
      </div>

      <form @submit.prevent="handleRegister" class="px-5 sm:px-8 py-5 sm:py-6" novalidate>
        
        <!-- ==================== STEP 1: Role & Affiliation ==================== -->
        <div v-show="currentStep === 1" class="space-y-4">
          
          <!-- Role Selector -->
          <div>
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
            <div>
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
            <div>
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
                :placeholder="form.student_type === 'rso' ? 'e.g. Body of Young Information Technologist (BYTE)' : 'e.g. President, Vice President'"
              />
              <p v-if="fieldErrors.organization_name" class="mt-1 text-xs text-rose-500 font-medium">{{ fieldErrors.organization_name }}</p>
            </div>

            <!-- College -->
            <div>
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
            <div>
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

            <!-- College / Building (conditional) -->
            <div v-if="form.employee_type === 'Teaching Staff'">
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

            <div v-if="form.employee_type === 'Research and Extension Staff'">
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

            <div v-if="form.employee_type === 'Support / Administrative Staff'">
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

        <!-- ==================== STEP 2: Personal Info ==================== -->
        <div v-show="currentStep === 2" class="space-y-4">
          
          <!-- Name Fields -->
          <div class="grid grid-cols-2 gap-3">
            <div>
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
            <div>
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
          <div class="grid grid-cols-2 gap-3">
            <div>
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
            <div>
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
          <div>
            <label class="block text-slate-700 text-xs font-bold mb-1.5">Email <span class="text-rose-500">*</span></label>
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

        <!-- ==================== STEP 3: Password ==================== -->
        <div v-show="currentStep === 3" class="space-y-4">
          
          <!-- Password -->
          <div>
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
          <div>
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

          <!-- Compact Password Strength -->
          <div class="flex items-center gap-2">
            <div class="flex gap-1 flex-1">
              <div :class="passwordStrengthScore >= 1 ? 'bg-amber-500' : 'bg-slate-200'" class="h-1 rounded-full flex-1 transition-colors"></div>
              <div :class="passwordStrengthScore >= 2 ? 'bg-amber-500' : 'bg-slate-200'" class="h-1 rounded-full flex-1 transition-colors"></div>
              <div :class="passwordStrengthScore === 3 ? 'bg-emerald-500' : 'bg-slate-200'" class="h-1 rounded-full flex-1 transition-colors"></div>
            </div>
            <span class="text-[10px] text-slate-400 font-medium whitespace-nowrap">
              {{ passwordStrengthScore === 0 ? '' : passwordStrengthScore === 3 ? 'Strong' : passwordStrengthScore === 2 ? 'Medium' : 'Weak' }}
            </span>
          </div>

          <div class="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
            <span :class="passwordCriteria.hasLength ? 'text-emerald-600' : 'text-slate-400'" class="flex items-center gap-1 transition-colors">
              <svg v-if="passwordCriteria.hasLength" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
              <span v-else class="w-1 h-1 rounded-full bg-slate-300 mx-1"></span>
              8+ chars
            </span>
            <span :class="passwordCriteria.hasLetter ? 'text-emerald-600' : 'text-slate-400'" class="flex items-center gap-1 transition-colors">
              <svg v-if="passwordCriteria.hasLetter" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
              <span v-else class="w-1 h-1 rounded-full bg-slate-300 mx-1"></span>
              Letters
            </span>
            <span :class="passwordCriteria.hasNumber ? 'text-emerald-600' : 'text-slate-400'" class="flex items-center gap-1 transition-colors">
              <svg v-if="passwordCriteria.hasNumber" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
              <span v-else class="w-1 h-1 rounded-full bg-slate-300 mx-1"></span>
              Numbers
            </span>
          </div>
        </div>

        <!-- ==================== STEP 4: ID Upload & Terms ==================== -->
        <div v-show="currentStep === 4" class="space-y-4" @dragover.prevent @drop="handleSectionDrop">
          
          <p class="text-xs text-slate-500 font-medium">Upload a clear front ID photo and a selfie holding your ID. Max 5MB each (JPG, PNG, WebP).</p>

          <!-- Hidden File Inputs -->
          <input ref="fileInputRef" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" class="hidden" @change="(e) => handleFileSelect(e, 'front')" />
          <input ref="selfieInputRef" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" class="hidden" @change="(e) => handleFileSelect(e, 'selfie')" />

          <!-- Upload Slots -->
          <div class="grid grid-cols-2 gap-3">
            <!-- Front ID -->
            <div>
              <label class="block text-slate-700 text-xs font-bold mb-1.5">Front ID <span class="text-rose-500">*</span></label>
              <div v-if="!idCardPreview"
                @click="$refs.fileInputRef?.click()"
                class="min-h-[120px] border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/80 hover:bg-emerald-50/30 rounded-xl p-3 text-center cursor-pointer transition-all group flex flex-col items-center justify-center active:scale-[0.99]">
                <svg class="w-8 h-8 text-slate-400 group-hover:text-emerald-500 transition-colors mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p class="text-[11px] font-bold text-slate-600 group-hover:text-emerald-700">Upload</p>
              </div>
              <div v-else class="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                <div class="h-24 bg-slate-900 relative">
                  <img :src="idCardPreview" alt="Front ID" class="w-full h-full object-cover" />
                </div>
                <div class="p-2 flex items-center justify-between">
                  <p class="text-[10px] text-slate-600 font-medium truncate flex-1 mr-2">{{ idCardFile?.name }}</p>
                  <div class="flex gap-1">
                    <button type="button" @click="$refs.fileInputRef?.click()" class="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer">Change</button>
                    <button type="button" @click="removeSelectedFile('front')" class="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer">Remove</button>
                  </div>
                </div>
              </div>
              <p v-if="fieldErrors.id_card" class="mt-1 text-xs text-rose-500 font-medium">{{ fieldErrors.id_card }}</p>
            </div>

            <!-- Selfie with ID -->
            <div>
              <label class="block text-slate-700 text-xs font-bold mb-1.5">Selfie with ID <span class="text-rose-500">*</span></label>
              <div v-if="!idSelfiePreview"
                @click="$refs.selfieInputRef?.click()"
                class="min-h-[120px] border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/80 hover:bg-emerald-50/30 rounded-xl p-3 text-center cursor-pointer transition-all group flex flex-col items-center justify-center active:scale-[0.99]">
                <svg class="w-8 h-8 text-slate-400 group-hover:text-emerald-500 transition-colors mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p class="text-[11px] font-bold text-slate-600 group-hover:text-emerald-700">Upload</p>
              </div>
              <div v-else class="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                <div class="h-24 bg-slate-900 relative">
                  <img :src="idSelfiePreview" alt="Selfie with ID" class="w-full h-full object-cover" />
                </div>
                <div class="p-2 flex items-center justify-between">
                  <p class="text-[10px] text-slate-600 font-medium truncate flex-1 mr-2">{{ idSelfieFile?.name }}</p>
                  <div class="flex gap-1">
                    <button type="button" @click="$refs.selfieInputRef?.click()" class="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer">Change</button>
                    <button type="button" @click="removeSelectedFile('selfie')" class="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer">Remove</button>
                  </div>
                </div>
              </div>
              <p v-if="fieldErrors.id_selfie" class="mt-1 text-xs text-rose-500 font-medium">{{ fieldErrors.id_selfie }}</p>
            </div>
          </div>

          <!-- Privacy Terms (compact) -->
          <div v-if="!hasAgreedToDisclaimer" class="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
            <p class="text-xs text-amber-900 font-medium">Review and accept the Data Privacy Notice & Terms of Use.</p>
            <button type="button" @click="showDisclaimerModal = true; isDisclaimerTouched = true"
              class="px-3 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap">
              Review
            </button>
          </div>
          <div v-else class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
            <div class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              <span class="text-xs font-semibold text-emerald-800">Terms accepted</span>
            </div>
            <button type="button" @click="showDisclaimerModal = true"
              class="text-xs font-bold text-emerald-700 hover:underline cursor-pointer">View</button>
          </div>
          <p v-if="fieldErrors.disclaimer" class="text-xs text-rose-500 font-medium">{{ fieldErrors.disclaimer }}</p>
        </div>

        <!-- ==================== Navigation Buttons ==================== -->
        <div class="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
          <!-- Back -->
          <button
            v-if="currentStep > 1"
            type="button"
            @click="goToPrevStep"
            class="min-h-[44px] px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer active:scale-[0.98]"
          >
            Back
          </button>

          <div class="flex-1"></div>

          <!-- Next / Submit -->
          <button
            v-if="currentStep < TOTAL_STEPS"
            type="button"
            @click="goToNextStep"
            class="min-h-[44px] px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5"
          >
            Continue
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>

          <button
            v-else
            :disabled="isLoading || !hasAgreedToDisclaimer"
            type="submit"
            class="min-h-[44px] px-6 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-lg shadow-slate-900/20 transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isLoading">Register</span>
            <span v-else>Submitting...</span>
            <svg v-if="!isLoading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
            <svg v-else class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
        </div>

        <!-- Back to Login -->
        <div class="text-center pt-3">
          <p class="text-xs text-slate-500">
            Already have an account? 
            <router-link to="/login" class="text-emerald-700 hover:text-emerald-800 font-bold hover:underline transition-all">Sign In</router-link>
          </p>
        </div>

      </form>

    <!-- Data Privacy Act Disclaimer Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDisclaimerModal" class="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto pointer-events-auto" @click.self="closeDisclaimerModal">
          <div class="my-auto bg-white w-full max-w-2xl max-h-[calc(100dvh-2rem)] sm:max-h-[88vh] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col pointer-events-auto">
            
            <!-- Modal Header -->
            <div class="px-5 py-4 bg-gradient-to-r from-slate-900 to-emerald-900 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 class="text-base font-black text-white">Data Privacy Notice & Terms</h3>
                <p class="text-[11px] text-slate-300 mt-0.5">RA 10173 Compliance — BSU GSO</p>
              </div>
              <button @click="closeDisclaimerModal" class="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 transition-colors flex items-center justify-center cursor-pointer">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <!-- Modal Body -->
            <div class="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-slate-700 leading-relaxed">
              
              <div class="border-l-3 border-emerald-500 pl-3 py-1.5 bg-emerald-50/50 rounded-r-lg">
                <h4 class="font-black text-emerald-800 uppercase tracking-wider text-[11px] mb-1">RA 10173 — Data Privacy Act of 2012</h4>
                <p>BSU, through the GSO, respects your privacy and protects personal information per the <strong>Data Privacy Act of 2012</strong> and NPC issuances.</p>
              </div>

              <div>
                <h4 class="font-black text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">Purpose of Collection</h4>
                <ul class="list-disc list-inside space-y-0.5 ml-1">
                  <li>Identity verification for system access</li>
                  <li>Processing and tracking service requests</li>
                  <li>Ticket status communication and notifications</li>
                  <li>Official reports and university compliance</li>
                </ul>
              </div>

              <div>
                <h4 class="font-black text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">Data Collected</h4>
                <ul class="list-disc list-inside space-y-0.5 ml-1">
                  <li>Name, ID number, contact number, email</li>
                  <li>College/unit affiliation and role</li>
                  <li>ID image and selfie for verification</li>
                  <li>Account credentials (hashed), activity logs</li>
                </ul>
              </div>

              <div>
                <h4 class="font-black text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">Processing, Retention & Security</h4>
                <ul class="list-disc list-inside space-y-0.5 ml-1">
                  <li>Data processed only for stated purposes with security measures</li>
                  <li>ID images used solely for verification</li>
                  <li>Data retained only as necessary or as required by law</li>
                  <li>Your rights: access, rectification, erasure, portability, objection</li>
                  <li>Contact DPO at <strong>dpo@bsu.edu.ph</strong></li>
                </ul>
              </div>

              <div>
                <h4 class="font-black text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">Data Sharing</h4>
                <p>Data will not be sold or leased. Disclosure only to authorized BSU/GSO personnel, when required by law, with your consent, or in anonymized form.</p>
              </div>

              <div class="border-l-3 border-amber-500 pl-3 py-1.5 bg-amber-50/50 rounded-r-lg">
                <h4 class="font-black text-amber-800 uppercase tracking-wider text-[11px] mb-1">Your Rights (RA 10173, Chapter IV)</h4>
                <ul class="list-disc list-inside space-y-0.5 ml-1">
                  <li><strong>Right to be Informed</strong> — Know what data is collected</li>
                  <li><strong>Right to Access</strong> — Request a copy</li>
                  <li><strong>Right to Rectification</strong> — Correct inaccurate data</li>
                  <li><strong>Right to Erasure</strong> — Request deletion</li>
                  <li><strong>Right to Portability</strong> — Obtain data in structured format</li>
                  <li><strong>Right to Object</strong> — Object to processing</li>
                  <li><strong>Right to Damages</strong> — Seek compensation for violations</li>
                </ul>
              </div>

              <div>
                <h4 class="font-black text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">Terms of Use</h4>
                <ul class="list-disc list-inside space-y-0.5 ml-1">
                  <li>Account for official BSU GSO E-Ticketing use only</li>
                  <li>Keep credentials confidential</li>
                  <li>Provide accurate information</li>
                  <li>Misuse results in account suspension</li>
                  <li>BSU may suspend/terminate accounts for violations</li>
                </ul>
              </div>

              <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <p class="font-semibold text-slate-800 mb-1">By clicking "I Agree", you acknowledge:</p>
                <ul class="list-disc list-inside space-y-0.5 ml-1">
                  <li>You've read this notice and terms</li>
                  <li>You consent to data collection and processing</li>
                  <li>All information provided is true and accurate</li>
                  <li>You understand your rights under RA 10173</li>
                </ul>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
              <button type="button" @click="closeDisclaimerModal"
                class="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer">
                Cancel
              </button>
              <button type="button" @click="acceptDisclaimer"
                class="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                I Agree
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
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
