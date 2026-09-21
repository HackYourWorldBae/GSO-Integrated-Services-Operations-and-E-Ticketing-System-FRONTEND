<script setup>
import { ref, computed } from 'vue';
import { useFormsStore } from '@/stores/forms';
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

// This form binds directly to the shared intake store (same pattern as
// FGMUForm / LEAUForm) so the validation + submission in FormsView operate
// on exactly what the user typed. Date fields intentionally start empty —
// the user picks both pickup and return dates (backend requires both, and
// borrower identity falls back to the logged-in profile server-side).
const borrowingState = computed(() => formsStore.leauBorrowingState);

const isDragging = ref(false);

const formatDateForInput = (date) => {
  return date.toISOString().split('T')[0];
};

// File handling
const processFiles = (files) => {
  files.forEach(f => {
    // Validate file
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(f.type)) {
      toast.error(`Invalid file type: ${f.name}. Allowed: JPG, PNG, WebP, PDF, DOC, DOCX`);
      return;
    }

    if (f.size > maxSize) {
      toast.error(`File too large: ${f.name}. Max size: 10MB`);
      return;
    }

    if (!formsStore.leauBorrowingState.attachments.some(a => a.name === f.name && a.size === f.size)) {
      formsStore.leauBorrowingState.attachments.push(f);
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
  formsStore.leauBorrowingState.attachments.splice(idx, 1);
};

const hasBorrowingServices = computed(() => {
  return props.services.some(s =>
    s.service.toLowerCase().includes('borrowing of plants') ||
    s.service.toLowerCase().includes('borrowing of tools')
  );
});

const isBorrowingOnly = computed(() => {
  return hasBorrowingServices.value && props.services.length === 1;
});

// Item name placeholder adapts to the borrow service selected:
// plants-only -> plant examples, tools-only -> common simple tool examples,
// both -> combined.
const hasPlantsBorrowing = computed(() => {
  return props.services.some(s =>
    s.service.toLowerCase().includes('borrowing of plants')
  );
});

const hasToolsBorrowing = computed(() => {
  return props.services.some(s =>
    s.service.toLowerCase().includes('borrowing of tools')
  );
});

const itemNamePlaceholder = computed(() => {
  if (hasPlantsBorrowing.value && hasToolsBorrowing.value) {
    return 'e.g., Shovel, Rake, Ladder or Snake Plant, Pothos (specify species for plants)';
  }
  if (hasPlantsBorrowing.value) {
    return 'e.g., Snake Plant, Pothos, Palm (specify species)';
  }
  return 'e.g., Shovel, Rake, Ladder, Wheelbarrow';
});

</script>

<template>
  <div v-if="hasBorrowingServices" class="bg-white rounded-2xl sm:rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/40 overflow-hidden slide-up delay-100">
    <div class="bg-amber-900 p-5 sm:p-10 text-white flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 border-b-4 border-amber-500">
      <div>
        <h3 class="text-xl sm:text-3xl font-black tracking-tight">Landscaping & Aesthetics <span class="text-amber-500">(LEAU)</span></h3>
        <p class="text-slate-400 mt-1 text-xs sm:text-base font-medium">Borrowing of Plants / Tools & Equipment</p>
      </div>
    </div>

    <div class="p-4 sm:p-10 space-y-6 sm:space-y-12">
      <!-- Service Badge -->
      <div class="bg-amber-50/50 p-4 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-amber-100/60">
        <h4 class="text-xs font-black text-amber-800 uppercase tracking-wider mb-3">Service(s) Selected</h4>
        <div class="flex flex-wrap gap-2">
          <div v-for="s in services" :key="s.service" class="px-3.5 py-2 bg-white border border-amber-200/80 rounded-xl text-xs font-bold text-amber-800 shadow-xs flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
            {{ s.service }}
          </div>
        </div>
      </div>

      <!-- Item Details -->
      <div class="space-y-6">
        <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Item Details
        </h4>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
          <!-- Item Name -->
          <div class="space-y-2 relative pb-5 sm:col-span-2">
            <label class="text-xs font-bold uppercase tracking-wider ml-1" :class="formsStore.v$.leauBorrowingState.item_name.$error ? 'text-red-500' : 'text-slate-700'">
              Item Name <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="borrowingState.item_name"
              type="text"
              @blur="formsStore.v$.leauBorrowingState.item_name.$touch()"
              :placeholder="itemNamePlaceholder"
              class="w-full min-h-[48px] h-12 sm:h-14 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-slate-50 border-2 border-slate-100 focus:bg-white text-base sm:text-sm font-bold outline-none transition-all shadow-xs"
              :class="formsStore.v$.leauBorrowingState.item_name.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'focus:border-amber-500'"
            />
            <p v-if="formsStore.v$.leauBorrowingState.item_name.$error" class="text-xs font-bold text-red-500 absolute bottom-0 left-1 animate-fade-in">Item name is required</p>
          </div>

          <!-- Quantity Needed (Optional) -->
          <div class="space-y-2 relative pb-5">
            <label class="text-xs font-bold uppercase tracking-wider ml-1" :class="formsStore.v$.leauBorrowingState.quantity_needed.$error ? 'text-red-500' : 'text-slate-700'">
              Quantity Needed <span class="text-xs font-normal text-slate-400 normal-case">(Optional)</span>
            </label>
            <input
              v-model.number="borrowingState.quantity_needed"
              type="number"
              min="1"
              max="100"
              placeholder="e.g., 5 (leave blank if unsure)"
              @blur="formsStore.v$.leauBorrowingState.quantity_needed.$touch()"
              class="w-full min-h-[48px] h-12 sm:h-14 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-slate-50 border-2 border-slate-100 focus:bg-white text-base sm:text-sm font-bold outline-none transition-all shadow-xs text-center"
              :class="formsStore.v$.leauBorrowingState.quantity_needed.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'focus:border-amber-500'"
            />
            <p v-if="formsStore.v$.leauBorrowingState.quantity_needed.$error" class="text-xs font-bold text-red-500 absolute bottom-0 left-1 animate-fade-in">Quantity must be at least 1</p>
          </div>

          <!-- Purpose / Event or Project Name -->
          <div class="sm:col-span-2 space-y-2 relative pb-5">
            <label class="text-xs font-bold uppercase tracking-wider ml-1" :class="formsStore.v$.leauBorrowingState.purpose_project.$error ? 'text-red-500' : 'text-slate-700'">
              Purpose / Event or Project Name <span class="text-rose-500">*</span>
            </label>
            <textarea
              v-model="borrowingState.purpose_project"
              @blur="formsStore.v$.leauBorrowingState.purpose_project.$touch()"
              placeholder="Brief description of why the item is needed (e.g., Biology lab experiment, Landscaping project for environmental club, Campus beautification for Foundation Day)"
              class="w-full px-4 sm:px-6 py-4 sm:py-5 rounded-xl sm:rounded-[2rem] bg-slate-50 border-2 focus:bg-white text-base sm:text-sm font-medium outline-none transition-all min-h-[110px] sm:min-h-[120px] resize-none shadow-inner"
              :class="formsStore.v$.leauBorrowingState.purpose_project.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'border-slate-100 focus:border-amber-500'"
            ></textarea>
            <p v-if="formsStore.v$.leauBorrowingState.purpose_project.$error" class="text-xs font-bold text-red-500 absolute bottom-0 left-1 animate-fade-in">Please provide a valid purpose (min 10 characters)</p>
          </div>
        </div>
      </div>

      <!-- Schedule -->
      <div class="space-y-6 pt-4 border-t border-slate-200/60">
        <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Schedule
        </h4>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
          <!-- Date Needed (Pickup Date) -->
          <div class="space-y-2 relative pb-5">
            <label class="text-xs font-bold uppercase tracking-wider ml-1" :class="formsStore.v$.leauBorrowingState.date_needed.$error ? 'text-red-500' : 'text-slate-700'">
              Date Needed (Pickup Date) <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="borrowingState.date_needed"
              type="date"
              :min="formatDateForInput(new Date())"
              @blur="formsStore.v$.leauBorrowingState.date_needed.$touch()"
              class="w-full min-h-[48px] h-12 sm:h-14 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-slate-50 border-2 border-slate-100 focus:bg-white text-base sm:text-sm font-bold outline-none transition-all shadow-xs"
              :class="formsStore.v$.leauBorrowingState.date_needed.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'focus:border-amber-500'"
            />
            <p v-if="formsStore.v$.leauBorrowingState.date_needed.$error" class="text-xs font-bold text-red-500 absolute bottom-0 left-1 animate-fade-in">Pickup date is required</p>
          </div>

          <!-- Expected Return Date -->
          <div class="space-y-2 relative pb-5">
            <label class="text-xs font-bold uppercase tracking-wider ml-1" :class="formsStore.v$.leauBorrowingState.expected_return_date.$error ? 'text-red-500' : 'text-slate-700'">
              Expected Return Date <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="borrowingState.expected_return_date"
              type="date"
              :min="borrowingState.date_needed || formatDateForInput(new Date())"
              @blur="formsStore.v$.leauBorrowingState.expected_return_date.$touch()"
              class="w-full min-h-[48px] h-12 sm:h-14 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-slate-50 border-2 border-slate-100 focus:bg-white text-base sm:text-sm font-bold outline-none transition-all shadow-xs"
              :class="formsStore.v$.leauBorrowingState.expected_return_date.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'focus:border-amber-500'"
            />
            <p v-if="formsStore.v$.leauBorrowingState.expected_return_date.$error" class="text-xs font-bold text-red-500 absolute bottom-0 left-1 animate-fade-in">Return date is required</p>
          </div>
        </div>

        <!-- Schedule validation warning -->
        <div v-if="borrowingState.date_needed && borrowingState.expected_return_date && borrowingState.expected_return_date < borrowingState.date_needed" class="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 animate-fade-in">
          <svg class="w-5 h-5 text-rose-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span class="text-xs font-medium text-rose-700">Return date must be on or after the pickup date.</span>
        </div>
      </div>

      <!-- Acknowledgement & Agreement -->
      <div class="space-y-4 pt-4 border-t border-slate-200/60">
        <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Acknowledgement & Agreement
        </h4>

        <div class="p-4 sm:p-6 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
          <label class="flex items-start gap-3 cursor-pointer" :class="formsStore.v$.leauBorrowingState.terms_agreed.$error ? 'ring-2 ring-rose-500/50' : ''">
            <input
              v-model="borrowingState.terms_agreed"
              type="checkbox"
              @blur="formsStore.v$.leauBorrowingState.terms_agreed.$touch()"
              class="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500 mt-0.5 cursor-pointer"
            />
            <div class="text-sm text-slate-700 leading-relaxed">
              <span class="font-semibold text-slate-900">I agree to the following terms and conditions:</span>
              <ol class="list-decimal list-inside mt-2 space-y-1.5 text-slate-700">
                <li>I will return the item(s) in good condition on or before the agreed return date.</li>
                <li>I assume full responsibility for any loss, damage, or theft of the borrowed item(s) while in my possession.</li>
                <li>I will use the item(s) only for the stated purpose/project and within the LEAU premises or approved locations.</li>
                <li>I understand that failure to return the item(s) on time may result in suspension of future borrowing privileges.</li>
                <li>I will report any damage or malfunction immediately to LEAU staff.</li>
              </ol>
            </div>
          </label>
          <p v-if="formsStore.v$.leauBorrowingState.terms_agreed.$error" class="text-xs font-bold text-red-500 animate-fade-in ml-7">You must agree to the terms and conditions</p>
        </div>
      </div>

      <!-- Supporting Attachments -->
      <div class="space-y-4 pt-4 border-t border-slate-200/60">
        <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Supporting Attachments (Optional)
        </h4>

        <p class="text-xs text-slate-500 font-medium">Attach photos of where the items will be used, event documents, or project details (Max 10MB each, up to 5 files).</p>

        <div 
          @click="$refs.fileInput.click()"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          class="w-full p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] border-2 border-dashed transition-all cursor-pointer text-center group active:scale-[0.99]"
          :class="isDragging ? 'border-amber-500 bg-amber-50/80 scale-[1.005]' : 'border-slate-200 bg-slate-50/50 hover:border-amber-500 hover:bg-amber-50/40'"
        >
          <input
            ref="fileInput"
            type="file"
            multiple
            @change="handleFile"
            class="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />
          <div class="w-11 h-11 sm:w-12 sm:h-12 mx-auto mb-2.5 rounded-2xl bg-white border border-slate-200 group-hover:border-amber-300 group-hover:bg-amber-100/50 flex items-center justify-center text-slate-400 group-hover:text-amber-700 transition-all shadow-xs">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p class="text-xs sm:text-sm font-black text-slate-700 group-hover:text-amber-800 transition-colors">
            Tap or drag photos/documents <span class="text-xs font-normal text-slate-400">(Optional)</span>
          </p>
          <p class="text-[10px] sm:text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
            Supports PNG, JPG, WebP, PDF, DOCX up to 10MB each • Max 5 files
          </p>
        </div>

        <!-- Uploaded Files -->
        <div v-if="borrowingState.attachments.length > 0" class="space-y-2 animate-fade-in pt-1">
          <div class="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
            <span>Attached Files ({{ borrowingState.attachments.length }}/5)</span>
            <button type="button" @click="formsStore.leauBorrowingState.attachments = []" class="text-red-500 hover:text-red-700 hover:underline cursor-pointer py-1 px-2">
              Remove All
            </button>
          </div>
          <div class="flex flex-wrap gap-2.5">
            <div 
              v-for="(f, i) in borrowingState.attachments" 
              :key="f.name" 
              class="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-white border border-slate-200 rounded-xl flex items-center gap-2.5 sm:gap-3 shadow-xs hover:border-slate-300 transition-colors"
            >
              <div class="w-6 h-6 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </div>
              <div class="flex flex-col text-left min-w-0">
                <span class="text-xs font-bold text-slate-800 max-w-[160px] sm:max-w-[200px] truncate" :title="f.name">{{ f.name }}</span>
                <span class="text-[10px] text-slate-400 font-semibold">{{ (f.size / (1024 * 1024)).toFixed(2) }} MB</span>
              </div>
              <button 
                type="button" 
                @click.stop="removeFile(i)" 
                class="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 active:bg-red-100 transition-colors cursor-pointer ml-1"
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