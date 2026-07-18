<script setup>
import SearchableDropdown from '@/components/SearchableDropdown.vue';
import SignaturePad from '@/components/SignaturePad.vue';
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
    if (!formsStore.ssuVehicleState.attachments.some(a => a.name === safeFile.name)) {
      formsStore.ssuVehicleState.attachments.push(safeFile); 
    }
  });
  if (e.target) e.target.value = '';
};

const removeFile = (idx) => {
  formsStore.ssuVehicleState.attachments.splice(idx, 1);
};
</script>

<template>
  <div class="bg-white rounded-[2rem] sm:rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/40 overflow-hidden slide-up delay-200">
    <div class="bg-slate-900 p-6 sm:p-10 text-white flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b-4 border-blue-500">
      <div>

        <h3 class="text-2xl sm:text-3xl font-black tracking-tighter">Vehicle Pass <span class="text-blue-500">Application</span></h3>
        <p class="text-slate-400 mt-1 text-sm sm:text-base font-bold">Sticker and access request for campus entry.</p>
      </div>
      <div class="sm:text-right">
          <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Ticket ID</p>
          <p class="text-xl sm:text-2xl font-black text-blue-500 uppercase tracking-tight">SSU-TIC-07-2026</p>
      </div>
    </div>

    <div class="p-4 sm:p-10 space-y-8 sm:space-y-12">
      <div class="bg-blue-50/50 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-blue-100/50">
        <h4 class="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">Service(s) chosen will be handled by Security Service Unit</h4>
        <div class="flex flex-wrap gap-2">
          <div v-for="s in services" :key="s.service" class="px-4 py-2 bg-white border border-blue-100 rounded-xl text-xs font-bold text-blue-700 shadow-sm flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            {{ s.service }}
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <h4 class="text-sm font-black text-slate-900 uppercase tracking-widest">Digital Requirements Retrieval</h4>
        <p class="text-xs text-slate-400 font-bold mb-4 italic">Please upload clear photos of your latest OR/CR, Driver's License, and BSU ID.</p>
        <div @click="$refs.fileInput.click()" class="w-full p-8 rounded-[2rem] border-3 border-dashed border-slate-100 hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer text-center group">
          <input type="file" ref="fileInput" multiple @change="handleFile" class="hidden" />
          <p class="text-sm font-black text-slate-600 group-hover:text-blue-700 transition-colors">Upload OR/CR, License, and BSU ID</p>
          <p class="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Images or PDF allowed</p>
        </div>
        <div v-if="formsStore.ssuVehicleState.attachments.length > 0" class="flex flex-wrap gap-3 animate-fade-in">
          <div v-for="(f, i) in formsStore.ssuVehicleState.attachments" :key="f.name" class="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
            <span class="text-[10px] font-black text-slate-800">{{ f.name }}</span>
            <button @click.stop="removeFile(i)" class="text-slate-300 hover:text-red-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
        <div class="space-y-3 relative">
          <label class="text-[10px] font-black uppercase tracking-[0.2em] ml-1" :class="formsStore.v$.ssuVehicleState.accountType.$error ? 'text-red-500' : 'text-slate-400'">Account Type</label>
          <div class="flex gap-4">
            <label v-for="type in ['Employee', 'Student']" :key="type" class="flex-1 flex items-center justify-center h-14 rounded-2xl border-2 transition-all cursor-pointer font-bold text-sm" :class="[formsStore.ssuVehicleState.accountType === type ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-50 border-slate-50 text-slate-400 hover:border-blue-200', formsStore.v$.ssuVehicleState.accountType.$error && formsStore.ssuVehicleState.accountType !== type ? 'border-red-500' : '']" @click="formsStore.v$.ssuVehicleState.accountType.$touch()">
              <input type="radio" :value="type" v-model="formsStore.ssuVehicleState.accountType" class="hidden" />
              {{ type }}
            </label>
          </div>
          <p v-if="formsStore.v$.ssuVehicleState.accountType.$error" class="text-xs font-bold text-red-500 absolute -bottom-5 left-1 animate-fade-in">Please select an account type</p>
        </div>
        <div class="space-y-3">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Name of Applicant</label>
          <input v-model="formsStore.ssuVehicleState.name" type="text" readonly class="w-full h-14 px-6 rounded-2xl bg-slate-100 border-2 border-slate-100 text-slate-400 text-sm font-bold outline-none cursor-not-allowed" />
        </div>
        <div class="space-y-3">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">College / Office</label>
          <SearchableDropdown
            v-model="formsStore.ssuVehicleState.collegeOffice"
            :options="locations"
            theme="blue"
            placeholder="Type to search college/office..."
          />
        </div>
        <div class="space-y-3 relative">
          <label class="text-[10px] font-black uppercase tracking-[0.2em] ml-1" :class="formsStore.v$.ssuVehicleState.contactNo.$error ? 'text-red-500' : 'text-slate-400'">Contact Number</label>
          <input 
            v-model="formsStore.ssuVehicleState.contactNo" 
            @blur="formsStore.v$.ssuVehicleState.contactNo.$touch()"
            type="text" 
            class="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 focus:bg-white text-sm font-bold outline-none transition-all"
            :class="formsStore.v$.ssuVehicleState.contactNo.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'border-slate-50 focus:border-blue-500'" 
          />
          <p v-if="formsStore.v$.ssuVehicleState.contactNo.$error" class="text-xs font-bold text-red-500 absolute -bottom-5 left-1 animate-fade-in">This field is required</p>
        </div>
        <div class="space-y-3">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Name of Driver (Optional)</label>
          <input v-model="formsStore.ssuVehicleState.driverName" type="text" placeholder="If different from applicant" class="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-blue-500 focus:bg-white text-sm font-bold outline-none transition-all" />
        </div>
        <div class="space-y-3">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Driver Contact (Optional)</label>
          <input v-model="formsStore.ssuVehicleState.driverContact" type="text" placeholder="Driver's mobile number" class="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-blue-500 focus:bg-white text-sm font-bold outline-none transition-all" />
        </div>
      </div>

      <div class="space-y-3 relative">
        <label class="text-[10px] font-black uppercase tracking-[0.2em] ml-1" :class="formsStore.v$.ssuVehicleState.completeAddress.$error ? 'text-red-500' : 'text-slate-400'">Complete Address</label>
        <input 
          v-model="formsStore.ssuVehicleState.completeAddress" 
          @blur="formsStore.v$.ssuVehicleState.completeAddress.$touch()"
          type="text" 
          placeholder="House No., Street, Brgy., City/Municipality" 
          class="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 focus:bg-white text-sm font-bold outline-none transition-all"
          :class="formsStore.v$.ssuVehicleState.completeAddress.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'border-slate-50 focus:border-blue-500'" 
        />
        <p v-if="formsStore.v$.ssuVehicleState.completeAddress.$error" class="text-xs font-bold text-red-500 absolute -bottom-5 left-1 animate-fade-in">This field is required</p>
      </div>

      <div class="space-y-6 bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-inner">
        <h4 class="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Details of the Motor / Vehicle</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-3 relative">
            <label class="text-[10px] font-black uppercase tracking-[0.2em] ml-1" :class="formsStore.v$.ssuVehicleState.vehicleDetails.registeredOwner.$error ? 'text-red-500' : 'text-slate-400'">Registered Owner</label>
            <input 
              v-model="formsStore.ssuVehicleState.vehicleDetails.registeredOwner" 
              @blur="formsStore.v$.ssuVehicleState.vehicleDetails.registeredOwner.$touch()"
              type="text" 
              class="w-full h-14 px-6 rounded-2xl bg-white border-2 text-sm font-bold outline-none shadow-sm transition-all"
              :class="formsStore.v$.ssuVehicleState.vehicleDetails.registeredOwner.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'border-white focus:border-blue-500'" 
            />
            <p v-if="formsStore.v$.ssuVehicleState.vehicleDetails.registeredOwner.$error" class="text-xs font-bold text-red-500 absolute -bottom-5 left-1 animate-fade-in">Required</p>
          </div>
          <div class="space-y-3 relative">
            <label class="text-[10px] font-black uppercase tracking-[0.2em] ml-1" :class="formsStore.v$.ssuVehicleState.vehicleDetails.plateNo.$error ? 'text-red-500' : 'text-slate-400'">Plate No/s.</label>
            <input 
              v-model="formsStore.ssuVehicleState.vehicleDetails.plateNo" 
              @blur="formsStore.v$.ssuVehicleState.vehicleDetails.plateNo.$touch()"
              type="text" 
              class="w-full h-14 px-6 rounded-2xl bg-white border-2 text-sm font-bold outline-none shadow-sm transition-all"
              :class="formsStore.v$.ssuVehicleState.vehicleDetails.plateNo.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'border-white focus:border-blue-500'" 
            />
            <p v-if="formsStore.v$.ssuVehicleState.vehicleDetails.plateNo.$error" class="text-xs font-bold text-red-500 absolute -bottom-5 left-1 animate-fade-in">Required</p>
          </div>
          <div class="space-y-3 relative">
            <label class="text-[10px] font-black uppercase tracking-[0.2em] ml-1" :class="formsStore.v$.ssuVehicleState.vehicleDetails.makeSeries.$error ? 'text-red-500' : 'text-slate-400'">Make / Series</label>
            <input 
              v-model="formsStore.ssuVehicleState.vehicleDetails.makeSeries" 
              @blur="formsStore.v$.ssuVehicleState.vehicleDetails.makeSeries.$touch()"
              type="text" 
              placeholder="e.g. Toyota Vios" 
              class="w-full h-14 px-6 rounded-2xl bg-white border-2 text-sm font-bold outline-none shadow-sm transition-all"
              :class="formsStore.v$.ssuVehicleState.vehicleDetails.makeSeries.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'border-white focus:border-blue-500'" 
            />
            <p v-if="formsStore.v$.ssuVehicleState.vehicleDetails.makeSeries.$error" class="text-xs font-bold text-red-500 absolute -bottom-5 left-1 animate-fade-in">Required</p>
          </div>
          <div class="space-y-3 relative">
            <label class="text-[10px] font-black uppercase tracking-[0.2em] ml-1" :class="formsStore.v$.ssuVehicleState.vehicleDetails.typeColor.$error ? 'text-red-500' : 'text-slate-400'">Type & Color</label>
            <input 
              v-model="formsStore.ssuVehicleState.vehicleDetails.typeColor" 
              @blur="formsStore.v$.ssuVehicleState.vehicleDetails.typeColor.$touch()"
              type="text" 
              placeholder="e.g. Sedan, White" 
              class="w-full h-14 px-6 rounded-2xl bg-white border-2 text-sm font-bold outline-none shadow-sm transition-all"
              :class="formsStore.v$.ssuVehicleState.vehicleDetails.typeColor.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'border-white focus:border-blue-500'" 
            />
            <p v-if="formsStore.v$.ssuVehicleState.vehicleDetails.typeColor.$error" class="text-xs font-bold text-red-500 absolute -bottom-5 left-1 animate-fade-in">Required</p>
          </div>
        </div>
      </div>

      <div class="space-y-6 p-8 bg-blue-50 rounded-3xl border border-blue-100">
        <h4 class="text-sm font-black text-blue-900 uppercase">Privacy Notice & Disclosure</h4>
        <div class="text-[11px] text-blue-800 leading-relaxed font-bold space-y-4 max-h-40 overflow-y-auto pr-4 scrollbar-thin">
          <p>Personal data processed are only for processing the vehicle pass application and shall be treated with utmost confidentiality. The gate pass is a mere privilege to allow passage of the motor vehicle as described herein through the BSU main campus gate.</p>
          <p>All issued stickers/vehicle passes are non-transferable and shall be affixed on the vehicle. The BSU Security Office reserves the right to inspect the vehicle's contents before passage through any of the gates.</p>
        </div>
        <div class="space-y-4 pt-4 border-t border-blue-200/50 relative pb-2">
          <label class="flex items-start gap-4 cursor-pointer group" @click="formsStore.v$.ssuVehicleState.privacyAgreed.$touch()">
            <input type="checkbox" v-model="formsStore.ssuVehicleState.privacyAgreed" class="hidden" />
            <div class="w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all" :class="[formsStore.ssuVehicleState.privacyAgreed ? 'bg-blue-600 border-blue-600 shadow-md scale-110' : 'bg-white group-hover:border-blue-400', formsStore.v$.ssuVehicleState.privacyAgreed.$error ? 'border-red-500' : 'border-blue-200']">
              <svg v-if="formsStore.ssuVehicleState.privacyAgreed" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <span class="text-xs font-bold leading-tight" :class="formsStore.v$.ssuVehicleState.privacyAgreed.$error ? 'text-red-500' : 'text-blue-900'">I have read and understood the Privacy Notice.</span>
          </label>
          <label class="flex items-start gap-4 cursor-pointer group" @click="formsStore.v$.ssuVehicleState.disclosureAgreed.$touch()">
            <input type="checkbox" v-model="formsStore.ssuVehicleState.disclosureAgreed" class="hidden" />
            <div class="w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all" :class="[formsStore.ssuVehicleState.disclosureAgreed ? 'bg-blue-600 border-blue-600 shadow-md scale-110' : 'bg-white group-hover:border-blue-400', formsStore.v$.ssuVehicleState.disclosureAgreed.$error ? 'border-red-500' : 'border-blue-200']">
              <svg v-if="formsStore.ssuVehicleState.disclosureAgreed" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <span class="text-xs font-bold leading-tight" :class="formsStore.v$.ssuVehicleState.disclosureAgreed.$error ? 'text-red-500' : 'text-blue-900'">I hereby certify the truthfulness of the information provided above.</span>
          </label>
          <p v-if="formsStore.v$.ssuVehicleState.privacyAgreed.$error || formsStore.v$.ssuVehicleState.disclosureAgreed.$error" class="text-[10px] font-bold text-red-500 absolute -bottom-3 left-0 animate-fade-in">You must agree to the terms.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-slate-100">
        <div class="relative pb-4" @click="formsStore.v$.ssuVehicleState.signature.$touch()">
          <SignaturePad v-model="formsStore.ssuVehicleState.signature" label="Signature of Applicant" :class="formsStore.v$.ssuVehicleState.signature.$error ? 'border-red-500' : ''" />
          <p v-if="formsStore.v$.ssuVehicleState.signature.$error" class="text-xs font-bold text-red-500 absolute bottom-0 left-1 animate-fade-in">Signature is required</p>
        </div>
        <div class="space-y-6">
          <div class="space-y-3">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Valid ID Type / No.</label>
            <input v-model="formsStore.ssuVehicleState.idTypeNo" type="text" placeholder="e.g. DL / N12-34-5678" class="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-blue-500 text-sm font-bold outline-none transition-all" />
          </div>
          <div class="space-y-3">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Valid Until</label>
            <input v-model="formsStore.ssuVehicleState.validUntil" type="date" class="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-blue-500 text-sm font-bold outline-none transition-all" />
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
.delay-200 { animation-delay: 0.3s; }

@keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }

.scrollbar-thin::-webkit-scrollbar { width: 4px; }
.scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
.scrollbar-thin::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
</style>
