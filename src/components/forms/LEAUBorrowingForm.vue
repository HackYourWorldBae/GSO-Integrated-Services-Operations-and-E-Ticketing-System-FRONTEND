<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useFormsStore } from '@/stores/forms';
import { toast } from 'vue3-toastify';

const formsStore = useFormsStore();

const props = defineProps({
  unit: {
    type: String,
    default: 'LEAU', // 'FGMU' or 'LEAU'
  },
  services: {
    type: Array,
    required: true
  },
  locations: {
    type: Array,
    required: true
  }
});

const isFgmu = computed(() => (props.unit || '').toUpperCase() === 'FGMU');
const borrowingState = computed(() => isFgmu.value ? formsStore.fgmuBorrowingState : formsStore.leauBorrowingState);
const vuelidateBorrowing = computed(() => isFgmu.value ? formsStore.v$.fgmuBorrowingState : formsStore.v$.leauBorrowingState);

const isDragging = ref(false);
const draftItemName = ref('');

onMounted(() => {
  if (borrowingState.value && borrowingState.value.item_input_draft) {
    draftItemName.value = borrowingState.value.item_input_draft;
  }
});

watch(draftItemName, (val) => {
  if (borrowingState.value) {
    borrowingState.value.item_input_draft = val;
  }
});

const totalItemsQuantity = computed(() => {
  if (!borrowingState.value || !Array.isArray(borrowingState.value.items)) return 0;
  return borrowingState.value.items.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 1), 0);
});

const syncSummary = () => {
  formsStore.syncBorrowingItems(borrowingState.value);
};

const addItem = () => {
  const name = (draftItemName.value || '').trim();
  if (!name) {
    toast.info('Please type an item name to add.');
    return;
  }

  if (!Array.isArray(borrowingState.value.items)) {
    borrowingState.value.items = [];
  }

  const existing = borrowingState.value.items.find(
    i => i.name.toLowerCase() === name.toLowerCase()
  );

  if (existing) {
    existing.quantity = (parseInt(existing.quantity, 10) || 1) + 1;
    toast.success(`Increased quantity for "${existing.name}" to ${existing.quantity}.`);
  } else {
    borrowingState.value.items.push({
      id: Date.now() + Math.random(),
      name: name,
      quantity: 1
    });
  }

  draftItemName.value = '';
  if (borrowingState.value) borrowingState.value.item_input_draft = '';
  syncSummary();
  vuelidateBorrowing.value.item_name?.$touch();
  vuelidateBorrowing.value.quantity_needed?.$touch();
};

const removeItem = (idx) => {
  borrowingState.value.items.splice(idx, 1);
  syncSummary();
  vuelidateBorrowing.value.item_name?.$touch();
  vuelidateBorrowing.value.quantity_needed?.$touch();
};

const updateItemQuantity = (idx, delta) => {
  const item = borrowingState.value.items[idx];
  if (!item) return;
  const current = parseInt(item.quantity, 10) || 1;
  const next = current + delta;
  if (next >= 1) {
    item.quantity = next;
    syncSummary();
    vuelidateBorrowing.value.quantity_needed?.$touch();
  }
};

const handleItemQuantityChange = (idx, e) => {
  const item = borrowingState.value.items[idx];
  if (!item) return;
  let val = parseInt(e.target.value, 10);
  if (isNaN(val) || val < 1) val = 1;
  if (val > 1000) val = 1000;
  item.quantity = val;
  syncSummary();
  vuelidateBorrowing.value.quantity_needed?.$touch();
};

const formatDateForInput = (date) => {
  return date.toISOString().split('T')[0];
};

// File handling
const processFiles = (files) => {
  files.forEach(f => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(f.type)) {
      toast.error(`Invalid file type: ${f.name}. Allowed: JPG, PNG, WebP, PDF, DOC, DOCX, XLS, XLSX`);
      return;
    }

    if (f.size > maxSize) {
      toast.error(`File too large: ${f.name}. Max size: 5MB`);
      return;
    }

    if (!borrowingState.value.attachments.some(a => a.name === f.name && a.size === f.size)) {
      borrowingState.value.attachments.push(f);
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
  borrowingState.value.attachments.splice(idx, 1);
};

const hasBorrowingServices = computed(() => {
  return Array.isArray(props.services) && props.services.length > 0;
});

const itemPlaceholder = computed(() => {
  if (isFgmu.value) {
    return 'e.g., Step Ladder, Shovel, Wheelbarrow, Extension Cord';
  }
  return 'e.g., Palm, Fern, Snake Plant, Peace Lily, Bougainvillea';
});

const unitHeaderTitle = computed(() => {
  if (isFgmu.value) {
    return 'Facilities & Grounds Management (FGMU)';
  }
  return 'Landscaping & Aesthetics (LEAU)';
});

const unitHeaderSubtitle = computed(() => {
  if (isFgmu.value) {
    return 'Borrowing of Tools & Equipment';
  }
  return 'Borrowing of Ornamental & Potted Plants';
});
</script>

<template>
  <div v-if="hasBorrowingServices" class="bg-white rounded-2xl sm:rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/40 overflow-hidden slide-up delay-100">
    <div class="bg-slate-900 p-5 sm:p-10 text-white flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 border-b-4 border-amber-500">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black tracking-wider uppercase mb-2">
          <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          {{ isFgmu ? 'FGMU Service' : 'LEAU Service' }}
        </div>
        <h3 class="text-xl sm:text-3xl font-black tracking-tight">{{ unitHeaderTitle }}</h3>
        <p class="text-slate-400 mt-1 text-xs sm:text-base font-medium">{{ unitHeaderSubtitle }}</p>
      </div>
    </div>

    <div class="p-4 sm:p-10 space-y-6 sm:space-y-10">
      <!-- Service Badge -->
      <div class="bg-amber-50/50 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-amber-100/60">
        <h4 class="text-xs font-black text-amber-800 uppercase tracking-wider mb-2.5">Service(s) Selected</h4>
        <div class="flex flex-wrap gap-2">
          <div v-for="s in services" :key="s.service" class="px-3.5 py-2 bg-white border border-amber-200/80 rounded-xl text-xs font-bold text-amber-800 shadow-xs flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
            {{ s.service }}
          </div>
        </div>
      </div>

      <!-- Item Details (Multi-item entry) -->
      <div class="space-y-5">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            {{ isFgmu ? 'Tools & Equipment Selection' : 'Plants Selection' }}
          </h4>
          <span class="text-[11px] font-semibold text-slate-400">
            Add items individually to assign quantities
          </span>
        </div>

        <!-- Add Item Row -->
        <div class="space-y-2">
          <label class="text-xs font-bold uppercase tracking-wider ml-1" :class="vuelidateBorrowing.item_name.$error && (!borrowingState.items || borrowingState.items.length === 0) ? 'text-red-500' : 'text-slate-700'">
            Specify Item to Borrow <span class="text-rose-500">*</span>
          </label>
          <div class="flex flex-col sm:flex-row gap-2.5">
            <div class="relative flex-1">
              <input
                v-model="draftItemName"
                type="text"
                @keydown.enter.prevent="addItem"
                :placeholder="itemPlaceholder"
                class="w-full min-h-[48px] h-12 sm:h-14 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-slate-50 border-2 border-slate-100 focus:bg-white text-base sm:text-sm font-bold outline-none transition-all shadow-xs focus:border-amber-500"
                :class="vuelidateBorrowing.item_name.$error && (!borrowingState.items || borrowingState.items.length === 0) ? 'border-red-400 text-red-900' : ''"
              />
            </div>
            <button
              type="button"
              @click="addItem"
              class="min-h-[48px] h-12 sm:h-14 px-6 rounded-xl sm:rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-900 font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all shrink-0 cursor-pointer"
            >
              <svg class="w-5 h-5 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Item</span>
            </button>
          </div>
          <p v-if="vuelidateBorrowing.item_name.$error && (!borrowingState.items || borrowingState.items.length === 0)" class="text-xs font-bold text-red-500 animate-fade-in ml-1">
            Please add at least one item to borrow
          </p>
        </div>

        <!-- Added Items List with Individual Quantities -->
        <div v-if="borrowingState.items && borrowingState.items.length > 0" class="space-y-3 pt-1">
          <div class="flex items-center justify-between px-1">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Requested Items ({{ borrowingState.items.length }})
            </span>
            <span class="text-xs font-bold text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-200">
              Total: {{ totalItemsQuantity }} {{ totalItemsQuantity === 1 ? 'unit' : 'units' }}
            </span>
          </div>

          <div class="space-y-2.5">
            <div
              v-for="(item, index) in borrowingState.items"
              :key="item.id"
              class="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-amber-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in"
            >
              <!-- Item Name & Icon -->
              <div class="flex items-center gap-3 min-w-0 flex-1">
                <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center shrink-0">
                  <svg v-if="isFgmu" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <div class="min-w-0">
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Item #{{ index + 1 }}</span>
                  <p class="text-sm sm:text-base font-black text-slate-900 truncate" :title="item.name">
                    {{ item.name }}
                  </p>
                </div>
              </div>

              <!-- Individual Quantity Controls & Delete -->
              <div class="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-slate-500">Qty:</span>
                  <div class="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden shadow-2xs">
                    <button
                      type="button"
                      @click="updateItemQuantity(index, -1)"
                      :disabled="item.quantity <= 1"
                      class="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                      title="Decrease quantity"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4" /></svg>
                    </button>
                    <input
                      v-model.number="item.quantity"
                      @input="handleItemQuantityChange(index, $event)"
                      type="number"
                      min="1"
                      max="1000"
                      class="w-14 h-9 text-center bg-white border-x border-slate-200 text-sm font-black text-slate-900 outline-none"
                    />
                    <button
                      type="button"
                      @click="updateItemQuantity(index, 1)"
                      class="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:bg-slate-300 transition-colors cursor-pointer"
                      title="Increase quantity"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                </div>

                <!-- Remove Button -->
                <button
                  type="button"
                  @click="removeItem(index)"
                  class="w-9 h-9 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 active:bg-red-100 flex items-center justify-center transition-colors cursor-pointer"
                  title="Remove this item"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Summary pill -->
          <div class="p-3 bg-amber-50/80 rounded-xl border border-amber-200/70 text-xs text-amber-900 flex items-center gap-2">
            <svg class="w-4 h-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="truncate">
              <strong>Item Summary:</strong> {{ borrowingState.item_name }} ({{ totalItemsQuantity }} units total)
            </span>
          </div>
        </div>
        <div v-else class="p-4 rounded-xl border-2 border-dashed border-slate-200 text-center text-xs text-slate-400 font-medium">
          No items added yet. Type an item name above and click <span class="font-bold text-amber-600">+ Add Item</span> to specify items and individual quantities.
        </div>

        <!-- Purpose in Detail -->
        <div class="space-y-2 relative pb-5 pt-2">
          <label class="text-xs font-bold uppercase tracking-wider ml-1" :class="vuelidateBorrowing.purpose_project.$error ? 'text-red-500' : 'text-slate-700'">
            State the Purpose in Detail <span class="text-rose-500">*</span>
          </label>
          <textarea
            v-model="borrowingState.purpose_project"
            @blur="vuelidateBorrowing.purpose_project.$touch()"
            :placeholder="isFgmu ? 'State the purpose in detail (e.g., Campus clean-up drive, Stage setup for Graduation, College athletic meet)' : 'State the purpose in detail (e.g., Biology laboratory experiment, Landscaping exhibit, Campus beautification for Foundation Day)'"
            class="w-full px-4 sm:px-6 py-4 sm:py-5 rounded-xl sm:rounded-[2rem] bg-slate-50 border-2 focus:bg-white text-base sm:text-sm font-medium outline-none transition-all min-h-[110px] sm:min-h-[120px] resize-none shadow-inner"
            :class="vuelidateBorrowing.purpose_project.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'border-slate-100 focus:border-amber-500'"
          ></textarea>
          <p v-if="vuelidateBorrowing.purpose_project.$error" class="text-xs font-bold text-red-500 absolute bottom-0 left-1 animate-fade-in">Please provide a valid purpose (min 3 characters)</p>
        </div>
      </div>

      <!-- Schedule -->
      <div class="space-y-6 pt-4 border-t border-slate-200/60">
        <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Borrowing Schedule
        </h4>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
          <!-- Date Needed (Pickup Date) -->
          <div class="space-y-2 relative pb-5">
            <label class="text-xs font-bold uppercase tracking-wider ml-1" :class="vuelidateBorrowing.date_needed.$error ? 'text-red-500' : 'text-slate-700'">
              Date Needed (Pickup Date) <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="borrowingState.date_needed"
              type="date"
              :min="formatDateForInput(new Date())"
              @blur="vuelidateBorrowing.date_needed.$touch()"
              class="w-full min-h-[48px] h-12 sm:h-14 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-slate-50 border-2 border-slate-100 focus:bg-white text-base sm:text-sm font-bold outline-none transition-all shadow-xs"
              :class="vuelidateBorrowing.date_needed.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'focus:border-amber-500'"
            />
            <p v-if="vuelidateBorrowing.date_needed.$error" class="text-xs font-bold text-red-500 absolute bottom-0 left-1 animate-fade-in">Pickup date is required</p>
          </div>

          <!-- Expected Return Date -->
          <div class="space-y-2 relative pb-5">
            <label class="text-xs font-bold uppercase tracking-wider ml-1" :class="vuelidateBorrowing.expected_return_date.$error ? 'text-red-500' : 'text-slate-700'">
              Expected Return Date <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="borrowingState.expected_return_date"
              type="date"
              :min="borrowingState.date_needed || formatDateForInput(new Date())"
              @blur="vuelidateBorrowing.expected_return_date.$touch()"
              class="w-full min-h-[48px] h-12 sm:h-14 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-slate-50 border-2 border-slate-100 focus:bg-white text-base sm:text-sm font-bold outline-none transition-all shadow-xs"
              :class="vuelidateBorrowing.expected_return_date.$error ? 'border-red-500 focus:border-red-500 text-red-900' : 'focus:border-amber-500'"
            />
            <p v-if="vuelidateBorrowing.expected_return_date.$error" class="text-xs font-bold text-red-500 absolute bottom-0 left-1 animate-fade-in">Return date is required</p>
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
          Acknowledgement & Agreement ({{ isFgmu ? 'FGMU' : 'LEAU' }})
        </h4>

        <div class="p-4 sm:p-6 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
          <label class="flex items-start gap-3 cursor-pointer" :class="vuelidateBorrowing.terms_agreed.$error ? 'ring-2 ring-rose-500/50' : ''">
            <input
              v-model="borrowingState.terms_agreed"
              type="checkbox"
              @blur="vuelidateBorrowing.terms_agreed.$touch()"
              class="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500 mt-0.5 cursor-pointer"
            />
            <div class="text-sm text-slate-700 leading-relaxed">
              <span class="font-semibold text-slate-900">I agree to the following terms and conditions:</span>
              <ol v-if="isFgmu" class="list-decimal list-inside mt-2 space-y-1.5 text-slate-700">
                <li>I will return the borrowed tool(s)/equipment in good condition on or before the agreed return date.</li>
                <li>I assume full responsibility for any loss, damage, or theft of the borrowed equipment while in my possession.</li>
                <li>I will use the tools/equipment safely and only for the stated university purpose/project.</li>
                <li>I understand that failure to return the items on time may result in suspension of future borrowing privileges.</li>
                <li>I will report any damage or malfunction immediately to FGMU staff.</li>
              </ol>
              <ol v-else class="list-decimal list-inside mt-2 space-y-1.5 text-slate-700">
                <li>I will return the plant(s) in healthy and good condition on or before the agreed return date.</li>
                <li>I assume full responsibility for any wilting, damage, or loss of the borrowed plants/pots while in my possession.</li>
                <li>I will keep the plants properly watered and sheltered in an appropriate environment.</li>
                <li>I understand that failure to return the plant(s) on time may result in suspension of future borrowing privileges.</li>
                <li>I will report any damage or pest issues immediately to LEAU staff.</li>
              </ol>
            </div>
          </label>
          <p v-if="vuelidateBorrowing.terms_agreed.$error" class="text-xs font-bold text-red-500 animate-fade-in ml-7">You must agree to the terms and conditions</p>
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

        <p class="text-xs text-slate-500 font-medium">Attach photos of where the items will be used, event documents, or project details (Max 5MB each, up to 5 files).</p>

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
            Supports PNG, JPG, WebP, PDF, DOCX up to 5MB each • Max 5 files
          </p>
        </div>

        <!-- Uploaded Files -->
        <div v-if="borrowingState.attachments && borrowingState.attachments.length > 0" class="space-y-2 animate-fade-in pt-1">
          <div class="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
            <span>Attached Files ({{ borrowingState.attachments.length }}/5)</span>
            <button type="button" @click="borrowingState.attachments = []" class="text-red-500 hover:text-red-700 hover:underline cursor-pointer py-1 px-2">
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