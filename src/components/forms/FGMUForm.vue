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
    if (!formsStore.fgmuState.attachments.some(a => a.name === safeFile.name)) {
      formsStore.fgmuState.attachments.push(safeFile); 
    }
  });
  if (e.target) e.target.value = '';
};

const removeFile = (idx) => {
  formsStore.fgmuState.attachments.splice(idx, 1);
};
</script>

<template>
  <div class="bg-white rounded-[2rem] sm:rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/40 overflow-hidden slide-up">
    <div class="bg-slate-900 p-6 sm:p-10 text-white flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b-4 border-emerald-500">
      <div>

        <h3 class="text-2xl sm:text-3xl font-black tracking-tighter">Facilities Management <span class="text-emerald-500">(FGMU)</span></h3>
        <p class="text-slate-400 mt-1 text-sm sm:text-base font-bold">Structure, Utilities, and Mechanical requests.</p>
      </div>

    </div>

    <div class="p-4 sm:p-10 space-y-8 sm:space-y-12">
      <div class="bg-emerald-50/50 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-emerald-100/50">
        <h4 class="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-4">Service(s) chosen will be handled by Facilities Management Unit</h4>
        <div class="flex flex-wrap gap-2">
          <div v-for="s in services" :key="s.service" class="px-4 py-2 bg-white border border-emerald-100 rounded-xl text-xs font-bold text-emerald-700 shadow-sm flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            {{ s.service }}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
        <div class="space-y-3 relative">
          <label class="text-[10px] font-black uppercase tracking-[0.2em] ml-1" :class="formsStore.v$.fgmuState.sectionA.college_building.$error ? 'text-red-500' : 'text-slate-400'">College / Building</label>
          <SearchableDropdown
            v-model="formsStore.fgmuState.sectionA.college_building"
            :options="locations"
            theme="emerald"
            placeholder="Type to search building..."
            :class="{'border-red-500': formsStore.v$.fgmuState.sectionA.college_building.$error}"
            @blur="formsStore.v$.fgmuState.sectionA.college_building.$touch()"
          />
          <p v-if="formsStore.v$.fgmuState.sectionA.college_building.$error" class="text-xs font-bold text-red-500 absolute -bottom-5 left-1 animate-fade-in">This field is required</p>
        </div>
        <div class="space-y-3 relative">
          <label class="text-[10px] font-black uppercase tracking-[0.2em] ml-1" :class="formsStore.v$.fgmuState.sectionA.office_room.$error ? 'text-red-500' : 'text-slate-400'">Office / Room</label>
          <input 
            v-model="formsStore.fgmuState.sectionA.office_room" 
            @blur="formsStore.v$.fgmuState.sectionA.office_room.$touch()"
            type="text" 
            placeholder="e.g. Room 402" 
            class="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 focus:bg-white text-sm font-bold outline-none transition-all"
            :class="formsStore.v$.fgmuState.sectionA.office_room.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'border-slate-50 focus:border-emerald-500'" 
          />
          <p v-if="formsStore.v$.fgmuState.sectionA.office_room.$error" class="text-xs font-bold text-red-500 absolute -bottom-5 left-1 animate-fade-in">This field is required</p>
        </div>
        <div class="space-y-3">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Source of Fund (Optional)</label>
          <input v-model="formsStore.fgmuState.sectionA.source_of_fund" type="text" placeholder="e.g. Income" class="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-emerald-500 focus:bg-white text-sm font-bold outline-none transition-all" />
        </div>
      </div>

      <div class="space-y-6">


        <div class="space-y-3 relative pb-4">
          <label class="text-[10px] font-black uppercase tracking-[0.2em] ml-1" :class="formsStore.v$.fgmuState.sectionA.job_description.$error ? 'text-red-500' : 'text-slate-400'">Job Description / Particulars</label>
          <textarea 
            v-model="formsStore.fgmuState.sectionA.job_description"
            @blur="formsStore.v$.fgmuState.sectionA.job_description.$touch()"
            placeholder="Provide a detailed description of the work to be done or specific requirements..."
            class="w-full px-6 py-5 rounded-[2rem] bg-slate-50 border-2 focus:bg-white text-sm font-bold outline-none transition-all min-h-[120px] resize-none shadow-inner"
            :class="formsStore.v$.fgmuState.sectionA.job_description.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'border-slate-50 focus:border-emerald-500'" 
          ></textarea>
          <p v-if="formsStore.v$.fgmuState.sectionA.job_description.$error" class="text-xs font-bold text-red-500 absolute bottom-0 left-1 animate-fade-in">Please provide a valid description (min 10 characters)</p>
        </div>

        <div @click="$refs.fileInput.click()" class="w-full p-8 rounded-[2rem] border-3 border-dashed border-slate-100 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all cursor-pointer text-center group">
          <input type="file" ref="fileInput" multiple @change="handleFile" class="hidden" />
          <p class="text-sm font-black text-slate-600 group-hover:text-emerald-700 transition-colors">Click to upload photos/sketches for FGMU Request</p>
          <p class="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Supports PNG, JPG, PDF</p>
        </div>
        <div v-if="formsStore.fgmuState.attachments.length > 0" class="flex flex-wrap gap-3 animate-fade-in">
          <div v-for="(f, i) in formsStore.fgmuState.attachments" :key="f.name" class="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
            <span class="text-[10px] font-black text-slate-800">{{ f.name }}</span>
            <button @click.stop="removeFile(i)" class="text-slate-300 hover:text-red-500 transition-colors">
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

@keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
</style>
