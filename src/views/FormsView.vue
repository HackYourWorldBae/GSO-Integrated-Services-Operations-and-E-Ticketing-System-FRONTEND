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
import SSUIncidentReportForm from '@/components/forms/SSUIncidentReportForm.vue';

import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const formsStore = useFormsStore();
const authStore = useAuthStore();

import { LOCATIONS, resolveLocationForUser } from '@/constants/locations';

// --- STATE ---
const user = ref(null);
const selectedServicesRaw = ref({});
const otherSpecifics = ref({});
const customDescriptions = ref({});
const isSubmitting = ref(false);

const locations = LOCATIONS;

// State moved to src/stores/forms.js

onMounted(async () => {
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

  const storedServices = localStorage.getItem('selectedServices');
  const storedOthers = localStorage.getItem('otherSpecifics');
  const storedCustomDesc = localStorage.getItem('customDescriptions');
  
  if (storedServices) selectedServicesRaw.value = JSON.parse(storedServices);
  if (storedOthers) otherSpecifics.value = JSON.parse(storedOthers);
  if (storedCustomDesc) customDescriptions.value = JSON.parse(storedCustomDesc);
  
  if (authStore.isDeactivated) {
    toast.error('Your account is deactivated. Service request submissions are disabled.');
    router.push('/user/dashboard');
    return;
  }

  // Student Account Role Authorization Guard (RSO / SSG accounts)
  const userRole = (user.value?.role || authStore.role || '').toLowerCase();
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
        service,
        description: customDescriptions.value[key] || ''
      };
    });
});

const FGMU_CATEGORIES = ['Structure & Finishes', 'Utilities & Mechanical'];
const LEAU_CATEGORIES = ['Janitorial & Landscaping'];
const SSU_CATEGORIES = ['Security Services'];

const fgmuServices = computed(() => selectedList.value.filter(s => FGMU_CATEGORIES.includes(s.category)));
const leauServices = computed(() => selectedList.value.filter(s => LEAU_CATEGORIES.includes(s.category)));
const ssuServices = computed(() => selectedList.value.filter(s => SSU_CATEGORIES.includes(s.category)));
const otherServices = computed(() => selectedList.value.filter(s => 
  !FGMU_CATEGORIES.includes(s.category) && 
  !LEAU_CATEGORIES.includes(s.category) &&
  !SSU_CATEGORIES.includes(s.category)
));

const hasFGMU = computed(() => fgmuServices.value.length > 0);
const hasLEAU = computed(() => leauServices.value.length > 0);
const hasSSU = computed(() => ssuServices.value.length > 0);
const hasIncidentReport = computed(() => ssuServices.value.length > 0);
const hasOthers = computed(() => otherServices.value.length > 0);

// File handlers have been moved to individual form components

// --- NAVIGATION & SUBMISSION ---
const goBack = () => router.back();

const handleFinalSubmit = async () => {
  if (authStore.isDeactivated) {
    toast.error('Your account is deactivated. Service request submissions are disabled.');
    return;
  }

  formsStore.v$.$touch();
  let isValid = true;
  
  if (hasFGMU.value && formsStore.v$.fgmuState.$error) isValid = false;
  if (hasLEAU.value && formsStore.v$.leauState.$error) isValid = false;
  if (hasIncidentReport.value && formsStore.v$.ssuIncidentState.$error) isValid = false;

  if (!isValid) {
    toast.error('Please fill in all required fields correctly.');
    return;
  }

  isSubmitting.value = true;
  // Build the payload (don't send File objects in JSON)
  const fgmuDetails = hasFGMU.value ? { ...formsStore.fgmuState.sectionA, ticket_title: formsStore.fgmuState.sectionA.job_description } : null;
  const leauDetails = hasLEAU.value ? { ...formsStore.leauState.sectionA, ticket_title: formsStore.leauState.sectionA.job_description } : null;

  const finalRequest = {
    fgmu: hasFGMU.value ? { details: fgmuDetails, services: fgmuServices.value } : null,
    leau: hasLEAU.value ? { details: leauDetails, services: leauServices.value } : null,
    ssu: hasSSU.value ? { 
      incidentReport: hasIncidentReport.value ? formsStore.ssuIncidentState : null
    } : null,
    others: hasOthers.value ? otherServices.value : null,
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
      const formData = new FormData();
      filesArray.forEach(f => formData.append('attachments[]', f));
      try {
        await api.post(`tickets/${ticketId}/attachments`, formData);
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
        result = await uploadFiles(tId, formsStore.fgmuState.attachments);
      } else if (tId.startsWith('LEAU')) {
        result = await uploadFiles(tId, formsStore.leauState.attachments);
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
    localStorage.removeItem('otherSpecifics');
    localStorage.removeItem('customDescriptions');

    const role = (authStore.user?.role || authStore.role || '').toLowerCase();
    if (role === 'admin') {
      const unitMap = { 1: 'fgmu', 2: 'leau', 3: 'ssu' };
      const u = (authStore.user?.unit_code || unitMap[authStore.user?.unit_id] || 'fgmu').toLowerCase();
      router.push(`/admin/${u}`);
    } else if (role === 'director') {
      router.push('/director/dashboard');
    } else {
      router.push('/user/dashboard');
    }
  } catch (error) {
    console.error('Submission error:', error);
    toast.error(error.response?.data?.message || "An error occurred while submitting. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
    
    <!-- Navbar -->
    <nav class="bg-white/80 backdrop-blur-md border-b border-slate-200 px-3 sm:px-8 py-3 sm:py-5 flex justify-between items-center sticky top-0 z-50">
      <div class="flex items-center gap-3 sm:gap-4">
        <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex shrink-0 items-center justify-center overflow-hidden">
          <img src="/bsu-logo.png" alt="BSU Logo" class="w-full h-full object-contain" />
        </div>
        <div class="flex flex-col whitespace-nowrap">
          <span class="font-black text-base sm:text-lg text-slate-900 leading-tight tracking-tight">Service Intake</span>
          <span class="text-[8px] text-emerald-600 font-black tracking-[0.1em] uppercase">GSO Services E-Ticketing</span>
        </div>
      </div>
      <button @click="goBack" class="group flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 font-bold text-xs sm:text-sm transition-all duration-300">
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
            <button type="button" @click="goBack" class="flex flex-col items-center text-center w-24 sm:w-32 shrink-0 group cursor-pointer" title="Go back to services selection">
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
            <div class="flex flex-col items-center text-center w-24 sm:w-32 shrink-0">
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

      <!-- LEAU FORM SECTION -->
      <LEAUForm 
        v-if="hasLEAU" 
        :services="leauServices" 
        :locations="locations" 
      />

      <!-- SSU INCIDENT REPORT FORM -->
      <SSUIncidentReportForm 
        v-if="hasIncidentReport" 
        :services="ssuServices" 
      />

      <!-- OTHERS PLACEHOLDER -->
      <div v-if="hasOthers" class="p-6 sm:p-12 bg-white rounded-2xl sm:rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center slide-up delay-200 opacity-70">
        <h4 class="text-base sm:text-xl font-black text-slate-500 tracking-tight">Additional Unit Details Needed</h4>
        <p class="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Pending Additional Forms</p>
        <div class="mt-4 flex flex-wrap justify-center gap-2">
           <span v-for="item in otherServices" :key="item.service" class="px-3 py-1.5 bg-slate-50 rounded-xl text-[10px] font-black text-slate-500 border border-slate-200">{{ item.service }}</span>
        </div>
      </div>

      <!-- FINAL SUBMISSION STICKY BAR -->
      <div class="flex justify-center pt-4 sm:pt-8 sticky bottom-3 sm:bottom-6 px-1 z-30 pb-safe">
        <button 
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
