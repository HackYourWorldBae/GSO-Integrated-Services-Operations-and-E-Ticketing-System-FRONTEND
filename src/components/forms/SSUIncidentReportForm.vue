<script setup>
import { computed } from 'vue';
import { useFormsStore } from '@/stores/forms';
import { useAuthStore } from '@/stores/auth';

const formsStore = useFormsStore();
const authStore  = useAuthStore();

const props = defineProps({
  services: {
    type: Array,
    required: true
  }
});

/**
 * Derives a human-readable account identity line from the auth user's profile.
 * - Student (SSG / RSO): "<org_type> • <college>"
 * - Employee: "<employee_type> • <college/building>"
 * Returns { label, sublabel } so the template can style them separately.
 */
const accountIdentity = computed(() => {
  const u = authStore.user;
  if (!u) return null;

  const userRole = (u.role || '').toLowerCase();

  if (userRole === 'student') {
    // SSG / RSO students
    const orgType = u.organization_type || u.org_type || 'Student';
    const college = u.college || u.university || '';
    return {
      label: orgType,
      sublabel: college || null,
      colorClass: 'bg-sky-50 border-sky-200 text-sky-700',
      dotClass: 'bg-sky-500'
    };
  }

  if (userRole === 'employee') {
    const empType = u.employee_type || 'Employee';
    const location = u.college || u.building || '';
    return {
      label: empType,
      sublabel: location || null,
      colorClass: 'bg-violet-50 border-violet-200 text-violet-700',
      dotClass: 'bg-violet-500'
    };
  }

  // Fallback for any other role
  const label = u.role ? (u.role.charAt(0).toUpperCase() + u.role.slice(1)) : 'User';
  return {
    label,
    sublabel: u.college || null,
    colorClass: 'bg-slate-50 border-slate-200 text-slate-600',
    dotClass: 'bg-slate-400'
  };
});
</script>

<template>
  <div class="bg-white rounded-2xl sm:rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/40 overflow-hidden slide-up delay-300">
    <div class="bg-slate-900 p-5 sm:p-10 text-white flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 border-b-4 border-red-500">
      <div>
        <h3 class="text-xl sm:text-3xl font-black tracking-tight">Incident <span class="text-red-500">Report</span> Form</h3>
        <p class="text-slate-400 mt-1 text-xs sm:text-base font-medium">Formal documentation of security-related events.</p>
      </div>
    </div>

    <div class="p-4 sm:p-10 space-y-6 sm:space-y-12">
      <div class="bg-red-50/50 p-4 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-red-100/60">
        <h4 class="text-xs font-black text-red-700 uppercase tracking-wider mb-3">Service(s) chosen will be handled by Security Service Unit</h4>
        <div class="flex flex-wrap gap-2">
          <div v-for="s in services" :key="s.service" class="px-3.5 py-2 bg-white border border-red-200/80 rounded-xl text-xs font-bold text-red-700 shadow-xs flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            {{ s.service }}
          </div>
        </div>
      </div>

      <!-- Incident Type -->
      <div class="space-y-3 sm:space-y-4 relative pb-4" @click="formsStore.v$.ssuIncidentState.incidents.$touch()">
        <h4 class="text-xs sm:text-sm font-black uppercase tracking-wider border-l-4 pl-3 sm:pl-4" :class="formsStore.v$.ssuIncidentState.incidents.$error ? 'text-red-500 border-red-500' : 'text-slate-900 border-red-500'">Incident Type</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          <label v-for="inc in ['Theft/Burglary', 'Altercations', 'Vandalism', 'Unauthorized Entry', 'Road Accident', 'Fire Incident', 'Harassment/Bullying', 'Substance Abuse']" :key="inc" class="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border-2 transition-all cursor-pointer group min-h-[48px] active:scale-[0.99]" :class="formsStore.ssuIncidentState.incidents.includes(inc) ? 'bg-red-50 border-red-500 text-red-700' : 'bg-slate-50 border-slate-50 hover:border-red-200 hover:bg-white'">
            <input type="checkbox" :value="inc" v-model="formsStore.ssuIncidentState.incidents" class="hidden" />
            <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0" :class="formsStore.ssuIncidentState.incidents.includes(inc) ? 'bg-red-500 border-red-500 scale-110' : 'bg-white border-slate-300 group-hover:border-red-400'">
              <svg v-if="formsStore.ssuIncidentState.incidents.includes(inc)" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <span class="text-xs sm:text-sm font-bold">{{ inc }}</span>
          </label>
          <div class="col-span-1 sm:col-span-2 lg:col-span-4 space-y-1.5 mt-1">
            <label class="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Others (Please specify)</label>
            <input v-model="formsStore.ssuIncidentState.otherIncident" type="text" placeholder="e.g. Lost ID, noise disturbance" class="w-full min-h-[48px] h-12 px-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-red-500 focus:bg-white text-base sm:text-sm font-bold outline-none transition-all shadow-xs" />
          </div>
        </div>
        <p v-if="formsStore.v$.ssuIncidentState.incidents.$error" class="text-xs font-bold text-red-500 absolute bottom-0 left-0 animate-fade-in">Please select at least one incident type</p>
      </div>

      <!-- Incident Details (Who, Where, When, How) -->
      <div class="space-y-6 sm:space-y-8 bg-slate-50 p-4 sm:p-10 rounded-2xl sm:rounded-[3rem] border border-slate-100 shadow-inner">
         <div class="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
           <div class="space-y-2 relative">
              <label class="text-xs font-bold uppercase tracking-wider ml-1" :class="formsStore.v$.ssuIncidentState.who.$error ? 'text-red-500' : 'text-slate-700'">WHO (Person involved)</label>
              <input 
                v-model="formsStore.ssuIncidentState.who" 
                @blur="formsStore.v$.ssuIncidentState.who.$touch()"
                type="text" 
                placeholder="Full name of persons involved" 
                class="w-full min-h-[48px] h-12 sm:h-14 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-white border-2 text-base sm:text-sm font-bold outline-none shadow-xs transition-all"
                :class="formsStore.v$.ssuIncidentState.who.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'border-slate-100 focus:border-red-500'" 
              />
              <p v-if="formsStore.v$.ssuIncidentState.who.$error" class="text-xs font-bold text-red-500 absolute -bottom-5 left-1 animate-fade-in">Required</p>
           </div>
           <div class="space-y-2 relative">
              <label class="text-xs font-bold uppercase tracking-wider ml-1" :class="formsStore.v$.ssuIncidentState.where.$error ? 'text-red-500' : 'text-slate-700'">WHERE (Location)</label>
              <input 
                v-model="formsStore.ssuIncidentState.where" 
                @blur="formsStore.v$.ssuIncidentState.where.$touch()"
                type="text" 
                placeholder="Specific building, room, or landmark" 
                class="w-full min-h-[48px] h-12 sm:h-14 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-white border-2 text-base sm:text-sm font-bold outline-none shadow-xs transition-all"
                :class="formsStore.v$.ssuIncidentState.where.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'border-slate-100 focus:border-red-500'" 
              />
              <p v-if="formsStore.v$.ssuIncidentState.where.$error" class="text-xs font-bold text-red-500 absolute -bottom-5 left-1 animate-fade-in">Required</p>
           </div>
           <div class="space-y-2 relative">
              <label class="text-xs font-bold uppercase tracking-wider ml-1" :class="formsStore.v$.ssuIncidentState.when.$error ? 'text-red-500' : 'text-slate-700'">WHEN (Date & Time)</label>
              <input 
                v-model="formsStore.ssuIncidentState.when" 
                @blur="formsStore.v$.ssuIncidentState.when.$touch()"
                type="text" 
                placeholder="April 13, 2026 @ 10:30 PM" 
                class="w-full min-h-[48px] h-12 sm:h-14 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-white border-2 text-base sm:text-sm font-bold outline-none shadow-xs transition-all"
                :class="formsStore.v$.ssuIncidentState.when.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'border-slate-100 focus:border-red-500'" 
              />
              <p v-if="formsStore.v$.ssuIncidentState.when.$error" class="text-xs font-bold text-red-500 absolute -bottom-5 left-1 animate-fade-in">Required</p>
           </div>
         </div>
         <div class="space-y-2 relative pb-4">
            <label class="text-xs font-bold uppercase tracking-wider ml-1" :class="formsStore.v$.ssuIncidentState.how.$error ? 'text-red-500' : 'text-slate-700'">HOW (Narrate the incident)</label>
            <textarea 
              v-model="formsStore.ssuIncidentState.how"
              @blur="formsStore.v$.ssuIncidentState.how.$touch()"
              placeholder="Provide a step-by-step account of what occurred..."
              class="w-full px-4 sm:px-8 py-4 sm:py-6 rounded-xl sm:rounded-[2.5rem] bg-white border-2 text-base sm:text-sm font-medium outline-none shadow-xs transition-all min-h-[140px] sm:min-h-[160px] resize-none"
              :class="formsStore.v$.ssuIncidentState.how.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'border-slate-100 focus:border-red-500'" 
            ></textarea>
            <p v-if="formsStore.v$.ssuIncidentState.how.$error" class="text-xs font-bold text-red-500 absolute bottom-0 left-1 animate-fade-in">Please provide a narrative (min 10 characters)</p>
         </div>
      </div>

      <!-- Reporter Information -->
      <div class="space-y-4 pt-3 border-t border-slate-100">
        <div class="space-y-2">
          <label class="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Reported by</label>
          <input v-model="formsStore.ssuIncidentState.reportedBy.printedName" type="text" readonly class="w-full min-h-[48px] h-12 sm:h-14 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-slate-100 border-2 border-slate-100 text-slate-500 text-base sm:text-sm font-bold outline-none cursor-not-allowed" />
        </div>

        <!-- Account Identity Badge (derived from user profile, read-only) -->
        <div v-if="accountIdentity" :class="['flex items-center gap-3 px-4 py-3 rounded-xl border-2 w-full sm:w-auto sm:inline-flex', accountIdentity.colorClass]">
          <div :class="['w-2 h-2 rounded-full shrink-0', accountIdentity.dotClass]"></div>
          <div class="flex flex-col sm:flex-row sm:items-center sm:gap-2 min-w-0">
            <span class="text-xs font-black uppercase tracking-wider leading-none">{{ accountIdentity.label }}</span>
            <template v-if="accountIdentity.sublabel">
              <span class="hidden sm:inline text-xs font-bold opacity-40">•</span>
              <span class="text-xs font-semibold opacity-80 mt-0.5 sm:mt-0 truncate">{{ accountIdentity.sublabel }}</span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-up {
  opacity: 0;
  transform: translateY(30px);
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.delay-300 { animation-delay: 0.45s; }

@keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
</style>
