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
import SSUVehiclePassForm from '@/components/forms/SSUVehiclePassForm.vue';
import SSUIncidentReportForm from '@/components/forms/SSUIncidentReportForm.vue';
import TASUForm from '@/components/forms/TASUForm.vue';

import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const formsStore = useFormsStore();
const authStore = useAuthStore();

// --- STATE ---
const user = ref(null);
const selectedServicesRaw = ref({});
const otherSpecifics = ref({});
const customDescriptions = ref({});
const isSubmitting = ref(false);

const locations = [
  {
    group: 'Colleges',
    items: [
      'College of Agriculture (CA)',
      'College of Engineering Complex (CE)',
      'College of Information Sciences Building (CIS)',
      'College of Natural Sciences Building (CNS)',
      'College of Home Economics & Technology (Strawberry Hall)',
      'College of Teacher Education Building (CTE)',
      'College of Human Kinetics Building (CHK)',
      'College of Veterinary Medicine / Animal Clinic (CVM)',
      'College of Forestry Building (CF)',
      'College of Nursing Building (CN)',
      'College of Numeracy and Applied Sciences (CNAS)',
      'College of Social Sciences Building (CSS)',
      'College of Public Administration & Governance (CPAG)'
    ]
  },
  {
    group: 'Administrative Offices',
    items: [
      'Administration Building (Office of the President / Registrar)',
      'ICT Office & Server Center',
      'Planning and Development Office',
      'Finance and Management Services',
      'Office of Student Services (OSS)',
      'Graduate School Office (GS)'
    ]
  },
  {
    group: 'Facilities & Others',
    items: [
      'University Library & Information Services',
      'University Health Services (Clinic)',
      'BSU Gymnasium',
      'BSU Athletic Oval & Grandstand',
      'University Museum',
      'University Canteen',
      'Ladies Dormitory 1',
      'Ladies Dormitory 2',
      'Men’s Dormitory',
      'Research and Extension Complex',
      'NPRCRTC (Root Crops Research Center)',
      'Food Processing Center',
      'BSU Bakery',
      'BSU Marketing Center',
      'Poultry & Livestock Research Area'
    ]
  }
];

// State moved to src/stores/forms.js

onMounted(() => {
  // Redirect to login if not authenticated
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login' });
    return;
  }

  // Auto-fill form fields from the authenticated user's profile
  const fullName = authStore.fullName;
  const contact  = authStore.user?.contact_number || '';
  const role     = authStore.capitalizedRole;

  formsStore.fgmuState.sectionA.end_user        = fullName;
  formsStore.fgmuState.sectionA.contact_number  = contact;
  formsStore.leauState.sectionA.end_user        = fullName;
  formsStore.leauState.sectionA.contact_number  = contact;

  // SSU Auto-fill
  formsStore.ssuVehicleState.applicantName = fullName;
  formsStore.ssuVehicleState.contactNo   = contact;

  formsStore.ssuIncidentState.reportedBy.printedName = fullName;
  formsStore.ssuIncidentState.reportedBy.roles       = [role];

  formsStore.tasuVehicleState.requestingPersonnel = fullName;

  const storedBooking = localStorage.getItem('pendingVehicleBooking');
  if (storedBooking) {
    const booking = JSON.parse(storedBooking);
    formsStore.tasuVehicleState.dateOfTravel = booking.date;
  }

  const storedServices = localStorage.getItem('selectedServices');
  const storedOthers = localStorage.getItem('otherSpecifics');
  const storedCustomDesc = localStorage.getItem('customDescriptions');
  
  if (storedServices) selectedServicesRaw.value = JSON.parse(storedServices);
  if (storedOthers) otherSpecifics.value = JSON.parse(storedOthers);
  if (storedCustomDesc) customDescriptions.value = JSON.parse(storedCustomDesc);
  
  if (!Object.values(selectedServicesRaw.value).some(v => v === true)) {
    router.push('/services');
  }
});

// --- COMPUTED LOGIC ---
const selectedList = computed(() => {
  return Object.entries(selectedServicesRaw.value)
    .filter(([_, isSelected]) => isSelected)
    .map(([key, _]) => {
      const parts = key.split('-');
      return { 
        category: parts[0], 
        service: parts[1],
        description: customDescriptions.value[key] || ''
      };
    });
});

const FGMU_CATEGORIES = ['Structure & Finishes', 'Utilities & Mechanical'];
const LEAU_CATEGORIES = ['Janitorial & Landscaping'];
const SSU_CATEGORIES = ['Security Services'];
const TASU_CATEGORIES = ['Transportation Services'];

const fgmuServices = computed(() => selectedList.value.filter(s => FGMU_CATEGORIES.includes(s.category)));
const leauServices = computed(() => selectedList.value.filter(s => LEAU_CATEGORIES.includes(s.category)));
const ssuServices = computed(() => selectedList.value.filter(s => SSU_CATEGORIES.includes(s.category)));
const tasuServices = computed(() => selectedList.value.filter(s => TASU_CATEGORIES.includes(s.category)));
const otherServices = computed(() => selectedList.value.filter(s => 
  !FGMU_CATEGORIES.includes(s.category) && 
  !LEAU_CATEGORIES.includes(s.category) &&
  !SSU_CATEGORIES.includes(s.category) &&
  !TASU_CATEGORIES.includes(s.category)
));

const hasFGMU = computed(() => fgmuServices.value.length > 0);
const hasLEAU = computed(() => leauServices.value.length > 0);
const hasSSU = computed(() => ssuServices.value.length > 0);
const hasVehiclePass = computed(() => ssuServices.value.some(s => s.service === 'Vehicle Pass Sticker'));
const hasIncidentReport = computed(() => ssuServices.value.some(s => s.service === 'Incident Report'));
const hasTasuVehicle = computed(() => tasuServices.value.some(s => s.service === 'Book A University Vehicle'));
const hasOthers = computed(() => otherServices.value.length > 0);

// File handlers have been moved to individual form components

// --- NAVIGATION & SUBMISSION ---
const goBack = () => router.back();

const handleFinalSubmit = async () => {
  formsStore.v$.$touch();
  let isValid = true;
  
  if (hasFGMU.value && formsStore.v$.fgmuState.$error) isValid = false;
  if (hasLEAU.value && formsStore.v$.leauState.$error) isValid = false;
  if (hasVehiclePass.value && formsStore.v$.ssuVehicleState.$error) isValid = false;
  if (hasIncidentReport.value && formsStore.v$.ssuIncidentState.$error) isValid = false;
  if (hasTasuVehicle.value && formsStore.v$.tasuVehicleState.$error) isValid = false;

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
      vehiclePass: hasVehiclePass.value ? formsStore.ssuVehicleState : null,
      incidentReport: hasIncidentReport.value ? formsStore.ssuIncidentState : null
    } : null,
    tasu: hasTasuVehicle.value ? formsStore.tasuVehicleState : null,
    others: hasOthers.value ? otherServices.value : null,
    submittedAt: new Date().toISOString()
  };
  
  try {
    const response = await api.post('tickets/intake', finalRequest);
    // Backend returns { data: { ticket_ids: [...] } }
    const createdTickets = response.data?.data?.ticket_ids ?? [];

    // Helper to upload attachments for a ticket
    const uploadFiles = async (ticketId, filesArray) => {
      if (!filesArray || filesArray.length === 0) return;
      const formData = new FormData();
      filesArray.forEach(f => formData.append('attachments[]', f));
      // Set Content-Type to undefined so the browser automatically generates the multipart boundary
      await api.post(`tickets/${ticketId}/attachments`, formData, {
        headers: { 'Content-Type': undefined }
      });
    };

    // Match attachments to the created tickets by their prefix
    for (const tId of createdTickets) {
      if (tId.startsWith('FGMU')) {
        await uploadFiles(tId, formsStore.fgmuState.attachments);
      } else if (tId.startsWith('LEAU')) {
        await uploadFiles(tId, formsStore.leauState.attachments);
      } else if (tId.startsWith('SSU')) {
        // Handle SSU vehicle pass attachments if any, or incident report attachments
        if (hasVehiclePass.value && formsStore.ssuVehicleState.attachments) {
            await uploadFiles(tId, formsStore.ssuVehicleState.attachments);
        }
      } else if (tId.startsWith('TASU')) {
        await uploadFiles(tId, formsStore.tasuVehicleState.travelOrderAttachments);
      }
    }

    toast.success("Requests submitted successfully!");
    formsStore.clearForms();
    localStorage.removeItem('selectedServices');
    localStorage.removeItem('otherSpecifics');
    localStorage.removeItem('customDescriptions');
    localStorage.removeItem('pendingVehicleBooking');
    router.push('/user/dashboard');
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
          <span class="text-[8px] text-emerald-600 font-black tracking-[0.1em] uppercase">Centralized Services E-Ticketing</span>
        </div>
      </div>
      <button @click="goBack" class="group flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 font-bold text-xs sm:text-sm transition-all duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        <span class="hidden sm:inline">Back to Selection</span><span class="sm:hidden">Back</span>
      </button>
    </nav>

    <main class="max-w-5xl mx-auto p-3 sm:p-6 md:p-12 space-y-8 sm:space-y-12">
      
      <!-- HEADER SUMMARY -->
      <div class="mb-8 sm:mb-12">
        <h2 class="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter">Complete Your <span class="bg-emerald-100 text-emerald-700 px-3 rounded-2xl">Digital</span> Forms</h2>
        <p class="text-slate-500 mt-2 sm:mt-4 font-bold text-base sm:text-lg">We've generated specialized forms based on your selected services.</p>
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

      <!-- SSU VEHICLE PASS FORM -->
      <SSUVehiclePassForm 
        v-if="hasVehiclePass" 
        :services="ssuServices" 
        :locations="locations" 
      />
      
      <!-- SSU INCIDENT REPORT FORM -->
      <SSUIncidentReportForm 
        v-if="hasIncidentReport" 
        :services="ssuServices" 
      />

      <!-- TASU VEHICLE REQUEST FORM -->
      <TASUForm 
        v-if="hasTasuVehicle" 
        :services="tasuServices" 
        :locations="locations" 
      />

      <!-- OTHERS PLACEHOLDER -->
      <div v-if="hasOthers" class="p-12 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 text-center slide-up delay-200 opacity-60">
        <h4 class="text-xl font-black text-slate-400 tracking-tight">Additional Unit Details Needed</h4>
        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Pending Forms for TASU</p>
        <div class="mt-6 flex flex-wrap justify-center gap-2">
           <span v-for="item in otherServices" :key="item.service" class="px-4 py-2 bg-slate-50 rounded-xl text-[9px] font-black text-slate-400 border border-slate-100">{{ item.service }}</span>
        </div>
      </div>

      <!-- FINAL SUBMISSION -->
      <div class="flex justify-center pt-6 sm:pt-10 sticky bottom-4 sm:bottom-8 px-2">
        <button 
          @click="handleFinalSubmit"
          :disabled="isSubmitting"
          class="w-full sm:w-auto px-6 sm:px-16 py-4 sm:py-6 bg-slate-900 hover:bg-black text-white font-black text-base sm:text-xl justify-center rounded-2xl sm:rounded-[2.5rem] shadow-2xl shadow-slate-900/40 transition-all flex items-center gap-3 sm:gap-4 active:scale-95 disabled:opacity-50"
        >
          <span v-if="!isSubmitting">Validate & Submit Request</span>
          <div v-else class="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <svg v-if="!isSubmitting" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
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
