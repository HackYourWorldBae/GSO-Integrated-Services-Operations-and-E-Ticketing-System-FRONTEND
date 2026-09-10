<script setup>
import { computed, ref } from 'vue';
import SearchableDropdown from '@/components/SearchableDropdown.vue';
import { useFormsStore } from '@/stores/forms';
import { validateAttachment } from '@/utils/security';
import { toast } from 'vue3-toastify';
import { getRoomsForBuilding } from '@/constants/locations';

const formsStore = useFormsStore();
const isDragging = ref(false);

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

const availableRooms = computed(() => {
  return getRoomsForBuilding(formsStore.leauState.sectionA.college_building);
});

const processFiles = (files) => {
  files.forEach(f => { 
    const check = validateAttachment(f);
    if (!check.isValid) {
      toast.error(check.error);
      return;
    }
    const safeFile = check.sanitizedFile;
    if (!formsStore.leauState.attachments.some(a => a.name === safeFile.name)) {
      formsStore.leauState.attachments.push(safeFile); 
    }
  });
};

const handleFile = (e) => {
  const files = Array.from(e.target.files);
  processFiles(files);
  if (e.target) e.target.value = '';
};

const handleDrop = (e) => {
  isDragging.value = false;
  if (e.dataTransfer && e.dataTransfer.files) {
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  }
};

const removeFile = (idx) => {
  formsStore.leauState.attachments.splice(idx, 1);
};
</script>

<template>
  <div class="bg-white rounded-[2rem] sm:rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/40 overflow-hidden slide-up delay-100">
    <div class="bg-slate-900 p-6 sm:p-10 text-white flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b-4 border-amber-500">
      <div>

        <h3 class="text-2xl sm:text-3xl font-black tracking-tighter">Landscaping & Aesthetics <span class="text-amber-500">(LEAU)</span></h3>
        <p class="text-slate-400 mt-1 text-sm sm:text-base font-bold">Plants, mowing, cleaning, and decoration services.</p>
      </div>

    </div>

    <div class="p-4 sm:p-10 space-y-8 sm:space-y-12">
      <div class="bg-amber-50/50 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-amber-100/50">
        <h4 class="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-4">Service(s) chosen will be handled by Landscape & Environment Aesthetics Unit</h4>
        <div class="flex flex-wrap gap-2">
          <div v-for="s in services" :key="s.service" class="px-4 py-2 bg-white border border-amber-100 rounded-xl text-xs font-bold text-amber-700 shadow-sm flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
            {{ s.service }}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
        <!-- College / Building -->
        <div class="space-y-2 relative pb-6">
          <div class="flex items-center justify-between ml-1">
            <label class="text-[10px] font-black uppercase tracking-[0.2em]" :class="formsStore.v$.leauState.sectionA.college_building.$error ? 'text-red-500' : 'text-slate-700'">
              College / Building
            </label>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pick or Type</span>
          </div>
          <SearchableDropdown
            v-model="formsStore.leauState.sectionA.college_building"
            :options="locations"
            theme="amber"
            placeholder="Select from list or type building..."
            :has-error="formsStore.v$.leauState.sectionA.college_building.$error"
            @blur="formsStore.v$.leauState.sectionA.college_building.$touch()"
          />
          <p class="text-[11px] text-slate-400 font-medium ml-1 flex items-center gap-1.5 leading-tight">
            <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Choose from the list or type the location if it does not exist in the list.
          </p>
          <p v-if="formsStore.v$.leauState.sectionA.college_building.$error" class="text-xs font-bold text-red-500 absolute bottom-0 left-1 animate-fade-in">This field is required</p>
        </div>

        <!-- Office / Room -->
        <div class="space-y-2 relative pb-6">
          <div class="flex items-center justify-between ml-1">
            <label class="text-[10px] font-black uppercase tracking-[0.2em]" :class="formsStore.v$.leauState.sectionA.office_room.$error ? 'text-red-500' : 'text-slate-700'">
              Office / Room
            </label>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pick or Type</span>
          </div>
          <SearchableDropdown
            v-model="formsStore.leauState.sectionA.office_room"
            :options="availableRooms"
            theme="amber"
            placeholder="Select from list or type room..."
            :has-error="formsStore.v$.leauState.sectionA.office_room.$error"
            @blur="formsStore.v$.leauState.sectionA.office_room.$touch()"
          />
          <p class="text-[11px] text-slate-400 font-medium ml-1 flex items-center gap-1.5 leading-tight">
            <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Choose from the list or type the room if it does not exist in the list.
          </p>
          <p v-if="formsStore.v$.leauState.sectionA.office_room.$error" class="text-xs font-bold text-red-500 absolute bottom-0 left-1 animate-fade-in">This field is required</p>
        </div>

        <!-- Source of Fund -->
        <div class="space-y-2 relative pb-6">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Source of Fund (Optional)</label>
          <input v-model="formsStore.leauState.sectionA.source_of_fund" type="text" placeholder="e.g. General Fund, Income" class="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-amber-500 focus:bg-white text-sm font-bold outline-none transition-all shadow-sm" />
          <p class="text-[11px] text-slate-400 font-medium ml-1 flex items-center gap-1.5 leading-tight">
            <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Optional: Specify department budget source if applicable.
          </p>
        </div>
      </div>

      <div class="space-y-6">


        <div class="space-y-3 relative pb-4">
          <label class="text-[10px] font-black uppercase tracking-[0.2em] ml-1" :class="formsStore.v$.leauState.sectionA.job_description.$error ? 'text-red-500' : 'text-slate-400'">Job Description / Particulars</label>
          <textarea 
            v-model="formsStore.leauState.sectionA.job_description"
            @blur="formsStore.v$.leauState.sectionA.job_description.$touch()"
            placeholder="Provide a detailed description of the work to be done or specific requirements..."
            class="w-full px-6 py-5 rounded-[2rem] bg-slate-50 border-2 focus:bg-white text-sm font-bold outline-none transition-all min-h-[120px] resize-none shadow-inner"
            :class="formsStore.v$.leauState.sectionA.job_description.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'border-slate-50 focus:border-amber-500'" 
          ></textarea>
          <p v-if="formsStore.v$.leauState.sectionA.job_description.$error" class="text-xs font-bold text-red-500 absolute bottom-0 left-1 animate-fade-in">Please provide a valid description (min 10 characters)</p>
        </div>

        <!-- Upload & Supporting Documentation Section -->
        <div class="space-y-4 pt-2">
          <!-- Section Header with Optional Badge -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div class="flex items-center gap-2.5">
                <label class="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800">
                  Supporting Photos &amp; Documents
                </label>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                  Optional
                </span>
              </div>
              <p class="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                You may attach photos or documents to help landscaping personnel inspect the area faster.
              </p>
            </div>
          </div>

          <!-- Instruction Guidance Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <!-- 1. What to repair / trim -->
            <div class="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 flex items-start gap-3 shadow-2xs">
              <div class="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <div class="text-xs font-black text-slate-900">What to Repair / Trim</div>
                <div class="text-[11px] text-slate-600 font-medium mt-0.5 leading-snug">
                  Photos of trees to prune, overgrown lawn areas, plants, or grounds needing landscaping.
                </div>
              </div>
            </div>

            <!-- 2. Proof of damages -->
            <div class="p-3.5 rounded-2xl bg-red-50/70 border border-red-200/70 flex items-start gap-3 shadow-2xs">
              <div class="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <div>
                <div class="text-xs font-black text-slate-900">Proof of Damages</div>
                <div class="text-[11px] text-slate-600 font-medium mt-0.5 leading-snug">
                  Evidence of fallen tree limbs, storm debris, broken planters, or soil hazards.
                </div>
              </div>
            </div>

            <!-- 3. Complaint documents -->
            <div class="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/70 flex items-start gap-3 shadow-2xs">
              <div class="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <div>
                <div class="text-xs font-black text-slate-900">Complaint Documents</div>
                <div class="text-[11px] text-slate-600 font-medium mt-0.5 leading-snug">
                  Official event layout sketches, endorsement memos, or formal complaint requests.
                </div>
              </div>
            </div>
          </div>

          <!-- Drag-and-Drop / Click Upload Box -->
          <div 
            @click="$refs.fileInput.click()"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            class="w-full p-6 sm:p-8 rounded-[2rem] border-2 border-dashed transition-all cursor-pointer text-center group"
            :class="isDragging ? 'border-amber-500 bg-amber-50/80 scale-[1.005]' : 'border-slate-200 bg-slate-50/50 hover:border-amber-500 hover:bg-amber-50/40'"
          >
            <input type="file" ref="fileInput" multiple @change="handleFile" class="hidden" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" />
            <div class="w-12 h-12 mx-auto mb-3 rounded-2xl bg-white border border-slate-200 group-hover:border-amber-300 group-hover:bg-amber-100/50 flex items-center justify-center text-slate-400 group-hover:text-amber-700 transition-all shadow-xs">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p class="text-sm font-black text-slate-700 group-hover:text-amber-800 transition-colors">
              Click or drag &amp; drop photos or documents <span class="text-xs font-bold text-slate-400 font-normal">(Optional)</span>
            </p>
            <p class="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
              Supports PNG, JPG, PDF, DOCX up to 10MB each
            </p>
          </div>

          <!-- Uploaded Files Chip List -->
          <div v-if="formsStore.leauState.attachments.length > 0" class="space-y-2 animate-fade-in pt-1">
            <div class="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
              <span>Attached Files ({{ formsStore.leauState.attachments.length }})</span>
              <button type="button" @click="formsStore.leauState.attachments = []" class="text-red-500 hover:text-red-700 hover:underline cursor-pointer">
                Remove All
              </button>
            </div>
            <div class="flex flex-wrap gap-2.5">
              <div 
                v-for="(f, i) in formsStore.leauState.attachments" 
                :key="f.name" 
                class="px-4 py-2.5 bg-white border border-slate-200 rounded-xl flex items-center gap-3 shadow-xs hover:border-slate-300 transition-colors"
              >
                <div class="w-6 h-6 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </div>
                <div class="flex flex-col text-left">
                  <span class="text-xs font-bold text-slate-800 max-w-[200px] truncate" :title="f.name">{{ f.name }}</span>
                  <span class="text-[10px] text-slate-400 font-semibold">{{ (f.size / 1024).toFixed(1) }} KB</span>
                </div>
                <button 
                  type="button"
                  @click.stop="removeFile(i)" 
                  class="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer ml-1"
                  title="Remove file"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
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
.delay-100 { animation-delay: 0.15s; }

@keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
</style>
