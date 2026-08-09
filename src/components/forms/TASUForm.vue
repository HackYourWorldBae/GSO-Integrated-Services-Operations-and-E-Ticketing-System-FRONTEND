<script setup>
import SearchableDropdown from '@/components/SearchableDropdown.vue';
import { useFormsStore } from '@/stores/forms';
import { validateAttachment } from '@/utils/security';
import { toast } from 'vue3-toastify';

const formsStore = useFormsStore();

const props = defineProps({
  services: {
    type: Array,
    required: true
  },
  locations: {
    type: Array,
    required: true
  }
});

const handleFile = (e) => {
  const files = Array.from(e.target.files);
  files.forEach(f => { 
    const check = validateAttachment(f);
    if (!check.isValid) {
      toast.error(check.error);
      return;
    }
    const safeFile = check.sanitizedFile;
    if (!formsStore.tasuVehicleState.travelOrderAttachments.some(a => a.name === safeFile.name)) {
      formsStore.tasuVehicleState.travelOrderAttachments.push(safeFile); 
    }
  });
  if (e.target) e.target.value = '';
};

const removeFile = (idx) => {
  formsStore.tasuVehicleState.travelOrderAttachments.splice(idx, 1);
};
</script>

<template>
  <div class="bg-white rounded-[2rem] sm:rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/40 overflow-hidden slide-up delay-300">
    <div class="bg-slate-900 p-6 sm:p-10 text-white flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b-4 border-amber-500">
      <div>

        <h3 class="text-2xl sm:text-3xl font-black tracking-tighter">Transportation & Automotive <span class="text-amber-500">(TASU)</span></h3>
        <p class="text-slate-400 mt-1 text-sm sm:text-base font-bold">Requests for the use of University Vehicles </p>
      </div>

    </div>

    <div class="p-4 sm:p-10 space-y-8 sm:space-y-12">
      <div class="bg-amber-50/50 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-amber-100/50">
        <h4 class="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-4">Service(s) chosen will be handled by Transportation & Automotive Service Unit</h4>
        <div class="flex flex-wrap gap-2">
          <div v-for="s in services" :key="s.service" class="px-4 py-2 bg-white border border-amber-100 rounded-xl text-xs font-bold text-amber-700 shadow-sm flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
            {{ s.service }}
          </div>
        </div>
      </div>

      <div class="text-center">
        <h4 class="text-2xl font-black text-slate-900 tracking-tight uppercase">Request Form for Use of Vehicle</h4>
        <div class="h-1.5 w-24 bg-amber-500 mx-auto rounded-full mt-2"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
        <div class="space-y-3">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Date of Request</label>
          <input v-model="formsStore.tasuVehicleState.date" type="text" readonly class="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-slate-50 text-slate-900 text-sm font-bold outline-none cursor-not-allowed" />
        </div>
        <div class="space-y-3 relative pb-4">
          <label class="text-[10px] font-black uppercase tracking-[0.2em] ml-1" :class="formsStore.v$.tasuVehicleState.time.$error ? 'text-red-500' : 'text-slate-400'">Time</label>
          <input 
            v-model="formsStore.tasuVehicleState.time" 
            @blur="formsStore.v$.tasuVehicleState.time.$touch()"
            type="time" 
            class="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 focus:bg-white text-sm font-bold outline-none transition-all"
            :class="formsStore.v$.tasuVehicleState.time.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'border-slate-50 focus:border-purple-500'" 
          />
          <p v-if="formsStore.v$.tasuVehicleState.time.$error" class="text-xs font-bold text-red-500 absolute bottom-0 left-1 animate-fade-in">Required</p>
        </div>
      </div>

      <div class="space-y-8">
        <div class="space-y-3 relative pb-4">
          <label class="text-[10px] font-black uppercase tracking-[0.2em] ml-1" :class="formsStore.v$.tasuVehicleState.requestingPersonnel.$error ? 'text-red-500' : 'text-slate-400'">Requesting Personnel</label>
          <input 
            v-model="formsStore.tasuVehicleState.requestingPersonnel" 
            @blur="formsStore.v$.tasuVehicleState.requestingPersonnel.$touch()"
            type="text" 
            class="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 focus:bg-white text-sm font-bold outline-none transition-all"
            :class="formsStore.v$.tasuVehicleState.requestingPersonnel.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'border-slate-50 focus:border-purple-500'" 
          />
          <p v-if="formsStore.v$.tasuVehicleState.requestingPersonnel.$error" class="text-xs font-bold text-red-500 absolute bottom-0 left-1 animate-fade-in">Required</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-3 relative pb-4">
            <label class="text-[10px] font-black uppercase tracking-[0.2em] ml-1" :class="formsStore.v$.tasuVehicleState.officeCollegeDepartment.$error ? 'text-red-500' : 'text-slate-400'">Office / College / Department</label>
            <SearchableDropdown
              v-model="formsStore.tasuVehicleState.officeCollegeDepartment"
              :options="locations"
              theme="amber"
              placeholder="Type to search office/college..."
              :class="{'border-red-500': formsStore.v$.tasuVehicleState.officeCollegeDepartment.$error}"
              @blur="formsStore.v$.tasuVehicleState.officeCollegeDepartment.$touch()"
            />
            <p v-if="formsStore.v$.tasuVehicleState.officeCollegeDepartment.$error" class="text-xs font-bold text-red-500 absolute bottom-0 left-1 animate-fade-in">Required</p>
          </div>
          <div class="space-y-3">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Agency/Address (if non-BSU)</label>
            <input v-model="formsStore.tasuVehicleState.agencyAddress" type="text" placeholder="Enter Agency/Address" class="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-amber-500 focus:bg-white text-sm font-bold outline-none transition-all shadow-sm" />
          </div>
        </div>
      </div>

      <div class="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-inner space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-3 relative pb-4">
            <label class="text-[10px] font-black uppercase tracking-[0.2em] ml-1" :class="formsStore.v$.tasuVehicleState.numberOfPassengers.$error ? 'text-red-500' : 'text-slate-400'">Number of Passengers</label>
            <input 
              v-model="formsStore.tasuVehicleState.numberOfPassengers" 
              @blur="formsStore.v$.tasuVehicleState.numberOfPassengers.$touch()"
              type="number" 
              placeholder="0" 
              class="w-full h-14 px-6 rounded-2xl bg-white border-2 text-sm font-bold outline-none shadow-sm transition-all"
              :class="formsStore.v$.tasuVehicleState.numberOfPassengers.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'border-white focus:border-amber-500'" 
            />
            <p v-if="formsStore.v$.tasuVehicleState.numberOfPassengers.$error" class="text-xs font-bold text-red-500 absolute bottom-0 left-1 animate-fade-in">Required</p>
          </div>
          <div class="space-y-3 relative pb-4">
            <label class="text-[10px] font-black uppercase tracking-[0.2em] ml-1" :class="formsStore.v$.tasuVehicleState.dateOfTravel.$error ? 'text-red-500' : 'text-slate-400'">Date of Travel</label>
            <input 
              v-model="formsStore.tasuVehicleState.dateOfTravel" 
              @blur="formsStore.v$.tasuVehicleState.dateOfTravel.$touch()"
              type="text" 
              readonly 
              class="w-full h-14 px-6 rounded-2xl border-2 text-sm font-bold outline-none cursor-not-allowed"
              :class="formsStore.v$.tasuVehicleState.dateOfTravel.$error ? 'border-red-500 bg-red-50 text-red-900' : 'border-amber-500/20 bg-amber-100/30 text-slate-900'" 
            />
            <p v-if="formsStore.v$.tasuVehicleState.dateOfTravel.$error" class="text-xs font-bold text-red-500 absolute bottom-0 left-1 animate-fade-in">Required</p>
          </div>
        </div>

        <div class="space-y-3 relative pb-4">
          <label class="text-[10px] font-black uppercase tracking-[0.2em] ml-1" :class="formsStore.v$.tasuVehicleState.destination.$error ? 'text-red-500' : 'text-slate-400'">Destination</label>
          <input 
            v-model="formsStore.tasuVehicleState.destination" 
            @blur="formsStore.v$.tasuVehicleState.destination.$touch()"
            type="text" 
            placeholder="Complete address of destination" 
            class="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 focus:bg-white text-sm font-bold outline-none transition-all"
            :class="formsStore.v$.tasuVehicleState.destination.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'border-slate-50 focus:border-purple-500'" 
          />
          <p v-if="formsStore.v$.tasuVehicleState.destination.$error" class="text-xs font-bold text-red-500 absolute bottom-0 left-1 animate-fade-in">Required</p>
        </div>

        <div class="space-y-3 relative pb-4">
          <label class="text-[10px] font-black uppercase tracking-[0.2em] ml-1" :class="formsStore.v$.tasuVehicleState.purposeOfTravel.$error ? 'text-red-500' : 'text-slate-400'">Purpose of Travel</label>
          <textarea 
            v-model="formsStore.tasuVehicleState.purposeOfTravel"
            @blur="formsStore.v$.tasuVehicleState.purposeOfTravel.$touch()"
            placeholder="Describe the purpose of your trip..."
            class="w-full px-8 py-6 rounded-[2.5rem] bg-white border-2 text-sm font-bold outline-none shadow-sm transition-all min-h-[120px] resize-none"
            :class="formsStore.v$.tasuVehicleState.purposeOfTravel.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'border-white focus:border-amber-500'" 
          ></textarea>
          <p v-if="formsStore.v$.tasuVehicleState.purposeOfTravel.$error" class="text-xs font-bold text-red-500 absolute bottom-0 left-1 animate-fade-in">Please provide a valid purpose (min 10 characters)</p>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center gap-3">
           <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
           </div>
           <h4 class="text-sm font-black text-slate-900 uppercase tracking-widest">Travel Order Document</h4>
        </div>
        <p class="text-[10px] text-slate-400 font-bold ml-11 uppercase tracking-widest leading-none">Please attach your approved Travel Order here</p>
        
        <div @click="$refs.fileInput.click()" class="w-full p-8 rounded-[2rem] border-3 border-dashed border-slate-100 hover:border-amber-500 hover:bg-amber-50/50 transition-all cursor-pointer text-center group">
          <input type="file" ref="fileInput" multiple @change="handleFile" class="hidden" />
          <p class="text-sm font-black text-slate-600 group-hover:text-amber-700 transition-colors">Click to upload Travel Order file</p>
          <p class="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Supports PNG, JPG, PDF</p>
        </div>
        <div v-if="formsStore.tasuVehicleState.travelOrderAttachments.length > 0" class="flex flex-wrap gap-3 animate-fade-in mt-4">
          <div v-for="(f, i) in formsStore.tasuVehicleState.travelOrderAttachments" :key="f.name" class="px-5 py-3 bg-white border border-slate-100 rounded-2xl flex items-center gap-4 shadow-sm">
            <div class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <span class="text-xs font-black text-slate-800">{{ f.name }}</span>
            <button @click.stop="removeFile(i)" class="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
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
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
</style>
