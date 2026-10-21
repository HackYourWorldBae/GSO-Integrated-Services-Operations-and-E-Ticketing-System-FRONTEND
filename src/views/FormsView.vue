<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import { useFormsStore } from '@/stores/forms';
import SignaturePad from '@/components/SignaturePad.vue';
import SearchableDropdown from '@/components/SearchableDropdown.vue';
import api from '@/api/client';
import FGMUForm from '@/components/forms/FGMUForm.vue';
import LEAUForm from '@/components/forms/LEAUForm.vue';
import LEAUBorrowingForm from '@/components/forms/LEAUBorrowingForm.vue';
import SSUIncidentReportForm from '@/components/forms/SSUIncidentReportForm.vue';

import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const formsStore = useFormsStore();
const authStore = useAuthStore();

import { LOCATIONS, resolveLocationForUser } from '@/constants/locations';

// --- STATE ---
const user = ref(null);
const selectedServicesRaw = ref({});
const isSubmitting = ref(false);

const locations = LOCATIONS;

// State moved to src/stores/forms.js

onMounted(async () => {
  // Drop any corrupted attachments restored from persisted storage
  // (File objects can't survive JSON — they come back as `{}`).
  formsStore.sanitizeAttachments?.();
  // Populate default requestor info
  user.value = authStore.user;
  const fullName = user.value?.full_name || `${user.value?.first_name || ''} ${user.value?.last_name || ''}`.trim() || 'John Requestor';
  const contact  = user.value?.contact_no || user.value?.contact_number || user.value?.phone || '';

  // FGMU & LEAU Auto-fill
  formsStore.fgmuState.sectionA.end_user        = fullName;
  formsStore.fgmuState.sectionA.contact_number  = contact;
  formsStore.leauState.sectionA.end_user        = fullName;
  formsStore.leauState.sectionA.contact_number  = contact;

  // Auto-fill College / Building from user account profile
  const userCollege = user.value?.college || '';
  if (userCollege) {
    const resolvedBuilding = resolveLocationForUser(userCollege);
    if (resolvedBuilding) {
      formsStore.fgmuState.sectionA.college_building = resolvedBuilding;
      formsStore.leauState.sectionA.college_building = resolvedBuilding;
    }
  }

  // SSU Auto-fill
  formsStore.ssuIncidentState.reportedBy.printedName = fullName;

  // Borrowing Auto-fill (Both FGMU Tools and LEAU Plants)
  const userRole = (user.value?.role || authStore.role || '').toLowerCase();
  const defaultBorrowerId = user.value?.student_id_number || user.value?.employee_id || (userRole === 'admin' ? `${(user.value?.unit_code || authStore.user?.unit_code || 'GSO').toUpperCase()}-ADMIN` : (user.value?.id ? `ID-${String(user.value.id).slice(0, 8)}` : ''));
  const departmentMajor = user.value?.college || user.value?.department || user.value?.unit_code || '';

  // FGMU Tools Borrowing
  formsStore.fgmuBorrowingState.borrower_name = fullName;
  formsStore.fgmuBorrowingState.borrower_contact = contact;
  formsStore.fgmuBorrowingState.borrower_email = user.value?.email || '';
  formsStore.fgmuBorrowingState.borrower_id_number = defaultBorrowerId;
  formsStore.fgmuBorrowingState.department_major = departmentMajor;

  // LEAU Plants Borrowing
  formsStore.leauBorrowingState.borrower_name = fullName;
  formsStore.leauBorrowingState.borrower_contact = contact;
  formsStore.leauBorrowingState.borrower_email = user.value?.email || '';
  formsStore.leauBorrowingState.borrower_id_number = defaultBorrowerId;
  formsStore.leauBorrowingState.department_major = departmentMajor;

  const storedServices = localStorage.getItem('selectedServices');
  if (storedServices) selectedServicesRaw.value = JSON.parse(storedServices);
  
  // Student Account Role Authorization Guard (RSO / SSG accounts)
  if (userRole === 'student') {
    const ALLOWED_STUDENT_SERVICES = [
      'Incident Report',
      'Borrowing of tools/ equipment',
      'Borrowing of plants',
      'Hauling',
      'Stage & Hall Decoration',
    ];

    const hasUnauthorized = selectedList.value.some(s => !ALLOWED_STUDENT_SERVICES.includes(s.service));
    if (hasUnauthorized) {
      toast.error('Student accounts are only authorized for Borrowing of Tools/Equipment, Borrowing of Plants, Hauling, Stage & Hall Decoration, and Incident Reports.');
      router.push('/services');
      return;
    }
  }

  if (!Object.values(selectedServicesRaw.value).some(v => v === true)) {
    router.push('/services');
  }
});

// --- COMPUTED LOGIC ---
const selectedList = computed(() => {
  return Object.entries(selectedServicesRaw.value)
    .filter(([_, isSelected]) => isSelected)
    .map(([key, _]) => {
      const idx = key.indexOf('-');
      const category = idx !== -1 ? key.substring(0, idx) : key;
      const service = idx !== -1 ? key.substring(idx + 1) : '';
      return { 
        category, 
        service
      };
    });
});

const FGMU_CATEGORIES = ['Structure & Finishes', 'Utilities & Mechanical', 'Janitorial', 'Hauling', 'Hauling Services'];
const LEAU_CATEGORIES = ['Landscaping', 'Janitorial & Landscaping'];
const SSU_CATEGORIES = ['Security Services'];

const isToolBorrowing = (s) =>
  s.service.toLowerCase().includes('borrowing of tools') ||
  s.service.toLowerCase().includes('borrowing of equipment');

const isPlantBorrowing = (s) =>
  s.service.toLowerCase().includes('borrowing of plants');

const isBorrowing = (s) =>
  s.category === 'Borrowing Services' ||
  isToolBorrowing(s) ||
  isPlantBorrowing(s);

const fgmuServices = computed(() => selectedList.value.filter(s => FGMU_CATEGORIES.includes(s.category) && !isBorrowing(s)));
const regularLeauServices = computed(() => selectedList.value.filter(s => LEAU_CATEGORIES.includes(s.category) && !isBorrowing(s)));
const leauServices = regularLeauServices;
const ssuServices = computed(() => selectedList.value.filter(s => SSU_CATEGORIES.includes(s.category)));

// Borrowing services detection
const borrowingServices = computed(() => selectedList.value.filter(s => isBorrowing(s)));
const fgmuBorrowingServices = computed(() => borrowingServices.value.filter(s => isToolBorrowing(s)));
const leauBorrowingServices = computed(() => borrowingServices.value.filter(s => isPlantBorrowing(s) || !isToolBorrowing(s)));

const hasFGMU = computed(() => fgmuServices.value.length > 0);
const hasLEAU = computed(() => regularLeauServices.value.length > 0);
const hasRegularLEAU = computed(() => regularLeauServices.value.length > 0);
const hasFgmuBorrowing = computed(() => fgmuBorrowingServices.value.length > 0);
const hasLeauBorrowing = computed(() => leauBorrowingServices.value.length > 0);
const hasBorrowing = computed(() => hasFgmuBorrowing.value || hasLeauBorrowing.value);
const hasSSU = computed(() => ssuServices.value.length > 0);
const hasIncidentReport = computed(() => ssuServices.value.length > 0);

// File handlers have been moved to individual form components

// --- NAVIGATION & SUBMISSION ---
const goBack = () => router.back();

const handleFinalSubmit = async () => {
  // Commit any typed item drafts that haven't been added yet
  if (hasFgmuBorrowing.value && formsStore.fgmuBorrowingState.item_input_draft?.trim()) {
    formsStore.commitDraftItem?.(formsStore.fgmuBorrowingState);
  }
  if (hasLeauBorrowing.value && formsStore.leauBorrowingState.item_input_draft?.trim()) {
    formsStore.commitDraftItem?.(formsStore.leauBorrowingState);
  }

  formsStore.v$.$touch();
  let isValid = true;
  
  if (hasFGMU.value && formsStore.v$.fgmuState.$error) isValid = false;
  if (hasRegularLEAU.value && formsStore.v$.leauState.$error) isValid = false;
  if (hasFgmuBorrowing.value && formsStore.v$.fgmuBorrowingState.$error) isValid = false;
  if (hasLeauBorrowing.value && formsStore.v$.leauBorrowingState.$error) isValid = false;
  if (hasIncidentReport.value && formsStore.v$.ssuIncidentState.$error) isValid = false;

  if (!isValid) {
    toast.error('Please fill in all required fields correctly.');
    return;
  }

  // Validate schedule logic for FGMU borrowing requests
  if (hasFgmuBorrowing.value && formsStore.fgmuBorrowingState.date_needed && formsStore.fgmuBorrowingState.expected_return_date) {
    if (formsStore.fgmuBorrowingState.expected_return_date < formsStore.fgmuBorrowingState.date_needed) {
      toast.error('FGMU Borrowing: Expected return date must be on or after the pickup date.');
      return;
    }
  }

  // Validate schedule logic for LEAU borrowing requests
  if (hasLeauBorrowing.value && formsStore.leauBorrowingState.date_needed && formsStore.leauBorrowingState.expected_return_date) {
    if (formsStore.leauBorrowingState.expected_return_date < formsStore.leauBorrowingState.date_needed) {
      toast.error('LEAU Borrowing: Expected return date must be on or after the pickup date.');
      return;
    }
  }

  isSubmitting.value = true;
  // Accept a typed Others value as another incident type: merge it into the
  // incidents list so it is bridged/stored like a chosen type downstream.
  if (hasIncidentReport.value) {
    const ssu = formsStore.ssuIncidentState;
    const customType = (ssu.otherIncident || '').trim();
    if (customType && Array.isArray(ssu.incidents) && !ssu.incidents.includes(customType)) {
      ssu.incidents = [...ssu.incidents, customType];
    }
  }
  // Build the payload (don't send File objects in JSON)
  const fgmuDetails = hasFGMU.value ? { ...formsStore.fgmuState.sectionA, ticket_title: formsStore.fgmuState.sectionA.job_description } : null;
  const leauDetails = hasRegularLEAU.value ? { ...formsStore.leauState.sectionA, ticket_title: formsStore.leauState.sectionA.job_description } : null;

  const userRole = (user.value?.role || authStore.role || '').toLowerCase();
  const defaultBorrowerId = user.value?.student_id_number ||
    user.value?.employee_id ||
    (userRole === 'admin' ? `${(user.value?.unit_code || authStore.user?.unit_code || 'GSO').toUpperCase()}-ADMIN` : (user.value?.id ? `ID-${String(user.value.id).slice(0, 8)}` : 'STAFF-01'));
  const defaultContact = user.value?.contact_no || user.value?.contact_number || user.value?.phone || 'N/A';
  const fullName = user.value?.full_name || `${user.value?.first_name || ''} ${user.value?.last_name || ''}`.trim() || 'John Requestor';
  const borrowerType = (userRole === 'student') ? 'student' : (user.value?.employee_type?.toLowerCase().includes('faculty') ? 'faculty' : 'staff');

  const fgmuBorrowingDetails = hasFgmuBorrowing.value ? {
    ...formsStore.fgmuBorrowingState,
    borrower_name: formsStore.fgmuBorrowingState.borrower_name || fullName,
    borrower_id_number: formsStore.fgmuBorrowingState.borrower_id_number || defaultBorrowerId,
    borrower_email: formsStore.fgmuBorrowingState.borrower_email || user.value?.email || 'requestor@gso.local',
    borrower_contact: formsStore.fgmuBorrowingState.borrower_contact || defaultContact,
    department_major: formsStore.fgmuBorrowingState.department_major || user.value?.college || user.value?.department || user.value?.unit_code || 'General Services Office',
    borrower_type: borrowerType
  } : null;

  const leauBorrowingDetails = hasLeauBorrowing.value ? {
    ...formsStore.leauBorrowingState,
    borrower_name: formsStore.leauBorrowingState.borrower_name || fullName,
    borrower_id_number: formsStore.leauBorrowingState.borrower_id_number || defaultBorrowerId,
    borrower_email: formsStore.leauBorrowingState.borrower_email || user.value?.email || 'requestor@gso.local',
    borrower_contact: formsStore.leauBorrowingState.borrower_contact || defaultContact,
    department_major: formsStore.leauBorrowingState.department_major || user.value?.college || user.value?.department || user.value?.unit_code || 'General Services Office',
    borrower_type: borrowerType
  } : null;

  const finalRequest = {
    fgmu: hasFGMU.value ? { details: fgmuDetails, services: fgmuServices.value } : null,
    leau: hasRegularLEAU.value ? { details: leauDetails, services: regularLeauServices.value } : null,
    fgmuBorrowing: hasFgmuBorrowing.value ? { details: fgmuBorrowingDetails, services: fgmuBorrowingServices.value } : null,
    leauBorrowing: hasLeauBorrowing.value ? { details: leauBorrowingDetails, services: leauBorrowingServices.value } : null,
    ssu: hasSSU.value ? { 
      incidentReport: hasIncidentReport.value ? formsStore.ssuIncidentState : null
    } : null,
    submittedAt: new Date().toISOString()
  };
  
  try {
    const response = await api.post('tickets/intake', finalRequest);
    // Backend returns { data: { ticket_ids: [...] } }
    const createdTickets = response.data?.data?.ticket_ids ?? [];

    // Helper to upload attachments for a ticket.
    // Never throws: returns a result object so one ticket's upload failure
    // doesn't block the others (the ticket itself is already created).
    // NOTE: no explicit Content-Type — the api client strips it for FormData
    // so the browser generates the multipart boundary automatically.
    const uploadFiles = async (ticketId, filesArray) => {
      if (!filesArray || filesArray.length === 0) return { ok: true, skipped: true };
      // Guard against corrupted entries restored from persisted storage
      // (plain `{}` objects instead of real Files after a page reload).
      const validFiles = filesArray.filter((f) => f instanceof File);
      if (validFiles.length === 0) {
        console.warn(`Attachments for ${ticketId} are corrupted (not File objects) — ask user to re-attach.`);
        return {
          ok: false,
          ticketId,
          message: 'attached files were lost (page was reloaded). Please re-attach the files and try again',
          details: null
        };
      }
      if (validFiles.length !== filesArray.length) {
        console.warn(`Dropped ${filesArray.length - validFiles.length} invalid attachment(s) for ${ticketId}.`);
      }
      const formData = new FormData();
      validFiles.forEach(f => formData.append('attachments[]', f, f.name));
      try {
        // File uploads can exceed the default 12s api timeout on slow networks.
        await api.post(`tickets/${ticketId}/attachments`, formData, { timeout: 60000 });
        return { ok: true };
      } catch (uploadError) {
        const payload = uploadError.response?.data ?? {};
        const details = payload.errors ?? payload.data?.errors ?? payload.data ?? null;
        console.error(`Attachment upload failed for ${ticketId}:`, details ?? uploadError);
        return {
          ok: false,
          ticketId,
          message: payload.message || 'attachment upload failed',
          details: Array.isArray(details) ? details : null
        };
      }
    };

    // Match attachments to the created tickets by their prefix
    const uploadFailures = [];
    for (const tId of createdTickets) {
      let result = { ok: true, skipped: true };
      if (tId.startsWith('FGMU')) {
        const hasFgmuBorrow = hasFgmuBorrowing.value;
        if (hasFGMU.value && hasFgmuBorrow) {
          const allFgmuAttachments = [
            ...formsStore.fgmuState.attachments,
            ...formsStore.fgmuBorrowingState.attachments
          ];
          result = await uploadFiles(tId, allFgmuAttachments);
        } else if (hasFGMU.value) {
          result = await uploadFiles(tId, formsStore.fgmuState.attachments);
        } else if (hasFgmuBorrow) {
          result = await uploadFiles(tId, formsStore.fgmuBorrowingState.attachments);
        }
      } else if (tId.startsWith('LEAU')) {
        const hasLeauBorrow = hasLeauBorrowing.value;
        if (hasRegularLEAU.value && hasLeauBorrow) {
          const allLeauAttachments = [
            ...formsStore.leauState.attachments,
            ...formsStore.leauBorrowingState.attachments
          ];
          result = await uploadFiles(tId, allLeauAttachments);
        } else if (hasRegularLEAU.value) {
          result = await uploadFiles(tId, formsStore.leauState.attachments);
        } else if (hasLeauBorrow) {
          result = await uploadFiles(tId, formsStore.leauBorrowingState.attachments);
        }
      }
      if (!result.ok) uploadFailures.push(result);
    }

    if (uploadFailures.length === 0) {
      toast.success("Requests submitted successfully!");
    } else {
      // Tickets exist — navigate anyway so a retry doesn't create duplicates.
      const detail = uploadFailures
        .map(f => `${f.ticketId}: ${f.message}${f.details ? ` (${f.details.join('; ')})` : ''}`)
        .join(' | ');
      toast.warning(`Request(s) submitted, but some attachments failed to upload. ${detail}`);
    }
    formsStore.clearForms();
    localStorage.removeItem('selectedServices');

    const role = (authStore.user?.role || authStore.role || '').toLowerCase();
    if (role === 'admin') {
      const unitMap = { 1: 'fgmu', 2: 'leau', 3: 'ssu' };
      const u = (authStore.user?.unit_code || unitMap[authStore.user?.unit_id] || 'fgmu').toLowerCase();
      router.push(`/admin/${u}/my-requests`);
    } else if (role === 'director') {
      router.push('/director/my-requests');
    } else {
      router.push('/user/dashboard');
    }
  } catch (error) {
    console.error('Submission error:', error);
    const data = error.response?.data;
    const apiErrors = data?.errors || (typeof data?.messages === 'object' ? data.messages : null);

    if (apiErrors && typeof apiErrors === 'object' && Object.keys(apiErrors).length > 0) {
      const messages = Object.entries(apiErrors)
        .map(([k, v]) => Array.isArray(v) ? v.join(', ') : (typeof v === 'object' ? JSON.stringify(v) : `${v}`))
        .filter(Boolean)
        .join('; ');
      toast.error(messages || data?.message || "An error occurred while submitting.");
    } else {
      const errMsg = data?.message || data?.messages?.error || error.message || "An error occurred while submitting. Please try again.";
      toast.error(errMsg);
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
    
    <!-- Navbar -->
    <nav class="bg-white/80 backdrop-blur-md border-b border-slate-200 px-2.5 sm:px-8 py-2.5 sm:py-5 flex justify-between items-center sticky top-0 z-50 gap-2">
      <div class="flex items-center gap-2 sm:gap-4 min-w-0">
        <div class="w-8 h-8 sm:w-12 sm:h-12 rounded-xl flex shrink-0 items-center justify-center overflow-hidden">
          <img src="/bsu-logo.png" alt="BSU Logo" class="w-full h-full object-contain" />
        </div>
        <div class="flex items-center min-w-0">
          <span class="font-black text-sm sm:text-lg text-slate-900 tracking-tight truncate">Service Intake</span>
        </div>
      </div>
      <button @click="goBack" class="group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-5 py-1.5 sm:py-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 font-bold text-xs sm:text-sm transition-all duration-300 shrink-0 min-h-[36px] sm:min-h-[44px]">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        <span class="hidden sm:inline">Back to Selection</span><span class="sm:hidden">Back</span>
      </button>
    </nav>

    <main class="max-w-5xl mx-auto px-3 sm:px-6 md:px-12 pt-5 sm:pt-10 pb-20 space-y-6 sm:space-y-12">
      
      <!-- HEADER SUMMARY -->
      <div class="mb-5 sm:mb-10">
        <h2 class="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">Complete Your <span class="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-xl sm:rounded-2xl inline-block">Digital</span> Forms</h2>
        <p class="text-slate-500 mt-2 sm:mt-3 font-semibold text-xs sm:text-base">We've generated specialized forms based on your selected services.</p>
      </div>

      <!-- ─── INTAKE WIZARD PROGRESS STEPPER (2 STEPS) ─── -->
      <div class="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 mb-6 sm:mb-10 shadow-sm">
        <div class="max-w-md mx-auto">
          <div class="flex items-center justify-between">

            <!-- Step 1: Completed -->
            <button data-tour="intake-btn-back" type="button" @click="goBack" class="flex flex-col items-center text-center w-24 sm:w-32 shrink-0 group cursor-pointer" title="Go back to services selection">
              <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-md shadow-emerald-600/20 group-hover:bg-emerald-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span class="text-[11px] sm:text-xs font-bold text-slate-700 group-hover:text-emerald-700 mt-1.5 sm:mt-2 transition-colors">Select Services</span>
              <span class="text-[9px] sm:text-[10px] text-emerald-600 font-bold uppercase tracking-wider hidden sm:block">Step 1</span>
            </button>

            <!-- Connector line between steps (completed green line) -->
            <div class="flex-1 flex items-center px-2 sm:px-4">
              <div class="w-full h-0.5 bg-emerald-600 rounded-full"></div>
            </div>

            <!-- Step 2: Current -->
            <div data-tour="intake-step-badge" class="flex flex-col items-center text-center w-24 sm:w-32 shrink-0">
              <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-md shadow-emerald-600/30 ring-4 ring-emerald-50">
                2
              </div>
              <span class="text-[11px] sm:text-xs font-black text-slate-900 mt-1.5 sm:mt-2">Fill Out Form</span>
              <span class="text-[9px] sm:text-[10px] text-emerald-600 font-bold uppercase tracking-wider hidden sm:block">Step 2</span>
            </div>

          </div>
        </div>
      </div>

      <!-- FGMU FORM SECTION -->
      <FGMUForm 
        v-if="hasFGMU" 
        :services="fgmuServices" 
        :locations="locations" 
      />

      <!-- FGMU BORROWING FORM SECTION (Tools & Equipment) -->
      <LEAUBorrowingForm 
        v-if="hasFgmuBorrowing" 
        unit="FGMU"
        :services="fgmuBorrowingServices" 
        :locations="locations" 
      />

      <!-- LEAU BORROWING FORM SECTION (Plants) -->
      <LEAUBorrowingForm 
        v-if="hasLeauBorrowing" 
        unit="LEAU"
        :services="leauBorrowingServices" 
        :locations="locations" 
      />

      <!-- LEAU REGULAR FORM SECTION (for other LEAU services) -->
      <LEAUForm 
        v-if="hasRegularLEAU" 
        :services="regularLeauServices" 
        :locations="locations" 
      />

      <!-- SSU INCIDENT REPORT FORM -->
      <SSUIncidentReportForm 
        v-if="hasIncidentReport" 
        :services="ssuServices" 
      />

      <!-- FINAL SUBMISSION STICKY BAR -->
      <div class="flex justify-center pt-4 sm:pt-8 sticky bottom-3 sm:bottom-6 px-1 z-30 pb-safe">
        <button 
          data-tour="intake-btn-submit"
          @click="handleFinalSubmit"
          :disabled="isSubmitting"
          class="w-full sm:w-auto min-h-[48px] px-6 sm:px-14 py-3.5 sm:py-4.5 bg-slate-900 hover:bg-black text-white font-black text-sm sm:text-lg justify-center rounded-xl sm:rounded-2xl shadow-xl shadow-slate-900/30 transition-all flex items-center gap-2.5 sm:gap-3 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          <span v-if="!isSubmitting">Validate & Submit Request</span>
          <div v-else class="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
          <svg v-if="!isSubmitting" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </button>
      </div>

    </main>

  </div>
</template>

<style scoped>
.slide-up {
  opacity: 0;
  transform: translateY(30px);
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.delay-100 { animation-delay: 0.15s; }
.delay-200 { animation-delay: 0.3s; }
.delay-300 { animation-delay: 0.45s; }

@keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }

.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>
