<script setup>
import { useFormsStore } from '@/stores/forms';

const formsStore = useFormsStore();

const props = defineProps({
  services: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <div class="bg-white rounded-[2rem] sm:rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/40 overflow-hidden slide-up delay-300">
    <div class="bg-slate-900 p-6 sm:p-10 text-white flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b-4 border-red-500">
      <div>
        <h3 class="text-2xl sm:text-3xl font-black tracking-tighter">Incident <span class="text-red-500">Report</span> Form</h3>
        <p class="text-slate-400 mt-1 text-sm sm:text-base font-bold">Formal documentation of security-related events.</p>
      </div>
    </div>

    <div class="p-4 sm:p-10 space-y-8 sm:space-y-12">
      <div class="bg-red-50/50 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-red-100/50">
        <h4 class="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-4">Service(s) chosen will be handled by Security Service Unit</h4>
        <div class="flex flex-wrap gap-2">
          <div v-for="s in services" :key="s.service" class="px-4 py-2 bg-white border border-red-100 rounded-xl text-xs font-bold text-red-700 shadow-sm flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            {{ s.service }}
          </div>
        </div>
      </div>

      <!-- Incident Type -->
      <div class="space-y-4 relative pb-4" @click="formsStore.v$.ssuIncidentState.incidents.$touch()">
        <h4 class="text-sm font-black uppercase tracking-widest border-l-4 pl-4" :class="formsStore.v$.ssuIncidentState.incidents.$error ? 'text-red-500 border-red-500' : 'text-slate-900 border-red-500'">Incident Type</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <label v-for="inc in ['Theft/Burglary', 'Altercations', 'Vandalism', 'Unauthorized Entry', 'Road Accident', 'Fire Incident', 'Harassment/Bullying', 'Substance Abuse']" :key="inc" class="flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer group" :class="formsStore.ssuIncidentState.incidents.includes(inc) ? 'bg-red-50 border-red-500 text-red-700' : 'bg-slate-50 border-slate-50 hover:border-red-200 hover:bg-white'">
            <input type="checkbox" :value="inc" v-model="formsStore.ssuIncidentState.incidents" class="hidden" />
            <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all" :class="formsStore.ssuIncidentState.incidents.includes(inc) ? 'bg-red-500 border-red-500 scale-110' : 'bg-white border-slate-200 group-hover:border-red-400'">
              <svg v-if="formsStore.ssuIncidentState.incidents.includes(inc)" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <span class="text-xs font-bold">{{ inc }}</span>
          </label>
          <div class="col-span-1 sm:col-span-2 lg:col-span-4 space-y-2 mt-2">
            <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Others (Please specify)</label>
            <input v-model="formsStore.ssuIncidentState.otherIncident" type="text" class="w-full h-12 px-5 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-red-500 text-xs font-bold outline-none transition-all" />
          </div>
        </div>
        <p v-if="formsStore.v$.ssuIncidentState.incidents.$error" class="text-xs font-bold text-red-500 absolute bottom-0 left-0 animate-fade-in">Please select at least one incident type</p>
      </div>

      <!-- Incident Details (Who, Where, When, How) -->
      <div class="space-y-8 bg-slate-50 p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-slate-100 shadow-inner">
         <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
           <div class="space-y-3 relative">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] ml-1" :class="formsStore.v$.ssuIncidentState.who.$error ? 'text-red-500' : 'text-slate-400'">WHO (Person involved)</label>
              <input 
                v-model="formsStore.ssuIncidentState.who" 
                @blur="formsStore.v$.ssuIncidentState.who.$touch()"
                type="text" 
                placeholder="Full name of persons involved" 
                class="w-full h-14 px-6 rounded-2xl bg-white border-2 text-sm font-bold outline-none shadow-sm transition-all"
                :class="formsStore.v$.ssuIncidentState.who.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'border-white focus:border-red-500'" 
              />
              <p v-if="formsStore.v$.ssuIncidentState.who.$error" class="text-xs font-bold text-red-500 absolute -bottom-5 left-1 animate-fade-in">Required</p>
           </div>
           <div class="space-y-3 relative">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] ml-1" :class="formsStore.v$.ssuIncidentState.where.$error ? 'text-red-500' : 'text-slate-400'">WHERE (Location)</label>
              <input 
                v-model="formsStore.ssuIncidentState.where" 
                @blur="formsStore.v$.ssuIncidentState.where.$touch()"
                type="text" 
                placeholder="Specific building, room, or landmark" 
                class="w-full h-14 px-6 rounded-2xl bg-white border-2 text-sm font-bold outline-none shadow-sm transition-all"
                :class="formsStore.v$.ssuIncidentState.where.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'border-white focus:border-red-500'" 
              />
              <p v-if="formsStore.v$.ssuIncidentState.where.$error" class="text-xs font-bold text-red-500 absolute -bottom-5 left-1 animate-fade-in">Required</p>
           </div>
           <div class="space-y-3 relative">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] ml-1" :class="formsStore.v$.ssuIncidentState.when.$error ? 'text-red-500' : 'text-slate-400'">WHEN (Date & Time)</label>
              <input 
                v-model="formsStore.ssuIncidentState.when" 
                @blur="formsStore.v$.ssuIncidentState.when.$touch()"
                type="text" 
                placeholder="April 13, 2026 @ 10:30 PM" 
                class="w-full h-14 px-6 rounded-2xl bg-white border-2 text-sm font-bold outline-none shadow-sm transition-all"
                :class="formsStore.v$.ssuIncidentState.when.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'border-white focus:border-red-500'" 
              />
              <p v-if="formsStore.v$.ssuIncidentState.when.$error" class="text-xs font-bold text-red-500 absolute -bottom-5 left-1 animate-fade-in">Required</p>
           </div>
         </div>
         <div class="space-y-3 relative pb-4">
            <label class="text-[10px] font-black uppercase tracking-[0.2em] ml-1" :class="formsStore.v$.ssuIncidentState.how.$error ? 'text-red-500' : 'text-slate-400'">HOW (Narrate the incident)</label>
            <textarea 
              v-model="formsStore.ssuIncidentState.how"
              @blur="formsStore.v$.ssuIncidentState.how.$touch()"
              placeholder="Provide a step-by-step account of what occurred..."
              class="w-full px-8 py-6 rounded-[2.5rem] bg-white border-2 text-sm font-bold outline-none shadow-sm transition-all min-h-[160px] resize-none"
              :class="formsStore.v$.ssuIncidentState.how.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'border-white focus:border-red-500'" 
            ></textarea>
            <p v-if="formsStore.v$.ssuIncidentState.how.$error" class="text-xs font-bold text-red-500 absolute bottom-0 left-1 animate-fade-in">Please provide a narrative (min 10 characters)</p>
         </div>
      </div>

      <!-- Reporter Information -->
      <div class="space-y-6 pt-4 border-t border-slate-100">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
          <div class="space-y-3">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Reported by</label>
            <input v-model="formsStore.ssuIncidentState.reportedBy.printedName" type="text" readonly class="w-full h-14 px-6 rounded-2xl bg-slate-100 border-2 border-slate-100 text-slate-400 text-sm font-bold outline-none cursor-not-allowed" />
          </div>
          <div class="space-y-3">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Role / Designation</label>
            <div class="flex flex-wrap gap-2 relative pb-4" @click="formsStore.v$.ssuIncidentState.reportedBy.roles.$touch()">
              <label v-for="role in ['Agency Guard', 'Watchman', 'Plantilla Guard', 'Employee', 'Student', 'Visitor/Clients']" :key="role" class="px-4 py-2 rounded-full border-2 text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all" :class="formsStore.ssuIncidentState.reportedBy.roles.includes(role) ? 'bg-red-500 border-red-500 text-white' : 'bg-slate-50 border-slate-50 text-slate-400 hover:border-red-200'">
                <input type="checkbox" :value="role" v-model="formsStore.ssuIncidentState.reportedBy.roles" class="hidden" />
                {{ role }}
              </label>
              <p v-if="formsStore.v$.ssuIncidentState.reportedBy.roles.$error" class="text-[10px] font-bold text-red-500 absolute bottom-0 left-1 animate-fade-in">Role is required</p>
            </div>
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
