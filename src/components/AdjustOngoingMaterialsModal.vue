<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-hidden"
        @click.self="emitClose"
      >
        <div class="bg-white w-full max-w-3xl max-h-[92vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-scale-up">
          
          <!-- Header -->
          <div class="px-6 sm:px-8 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
            <div class="flex items-center gap-3.5">
              <div class="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-lg font-black text-white leading-tight">Adjust Ongoing Materials</h3>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Active Job Phase
                  </span>
                </div>
                <p class="text-xs text-slate-300 font-medium mt-0.5">
                  Ticket #{{ ticket?.id || '—' }} • {{ ticket?.service_type || ticket?.service || 'Field Service' }}
                </p>
              </div>
            </div>

            <button
              @click="emitClose"
              class="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition-colors flex items-center justify-center cursor-pointer"
              title="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body Container -->
          <div class="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar">
            
            <!-- Context & Current Status Card -->
            <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="space-y-1 min-w-0">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Current Material Scope</span>
                <div class="flex items-center gap-2 flex-wrap">
                  <span
                    v-if="ticket?.is_labor_only"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 text-xs font-black border border-sky-200"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Labor Only (Initial Assessment)
                  </span>
                  <span
                    v-else-if="ticket?.materials_stage === 'ongoing'"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-black border border-amber-200"
                  >
                    Ongoing Adjusted ({{ ticket?.materials?.length || 0 }} items)
                  </span>
                  <span
                    v-else-if="ticket?.materials?.length > 0"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-black border border-emerald-200"
                  >
                    Initial Assessment Recorded ({{ ticket?.materials?.length }} items)
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200"
                  >
                    No materials recorded yet
                  </span>
                </div>
              </div>

              <div class="text-left sm:text-right">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Target Location</span>
                <span class="text-xs font-bold text-slate-700 block truncate">
                  {{ ticket?.location || ticket?.college_building || 'Campus' }}
                  <span v-if="ticket?.office_room">({{ ticket.office_room }})</span>
                </span>
              </div>
            </div>

            <!-- Labor Only Toggle Card -->
            <div class="flex items-center justify-between p-4 bg-amber-50/60 border border-amber-200/60 rounded-2xl">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center text-xs font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-sm font-black text-slate-900 leading-none">Job Material Requirements</h4>
                  <p class="text-xs text-slate-500 font-medium mt-1">Adjust supplies and spare parts needed as the field work progresses.</p>
                </div>
              </div>
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  v-model="isLaborOnly"
                  class="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500 cursor-pointer"
                />
                <span class="text-xs font-bold text-slate-700">Labor only service (No materials)</span>
              </label>
            </div>

            <!-- Material Items Form -->
            <div v-if="!isLaborOnly" class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-black text-slate-700 uppercase tracking-wider">Itemized Supplies List</span>
                  <span class="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {{ validMaterialsCount }} Item(s)
                  </span>
                </div>
                <button
                  type="button"
                  @click="addMaterialRow"
                  class="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-black rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                  </svg>
                  <span>Add Material</span>
                </button>
              </div>

              <!-- Materials Table -->
              <div class="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-slate-100/80 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <th class="py-3 px-3 w-8 text-center">#</th>
                      <th class="py-3 px-3">Material / Item Description</th>
                      <th class="py-3 px-3 w-20">Qty</th>
                      <th class="py-3 px-3 w-28">Unit</th>
                      <th class="py-3 px-3 w-28 text-right">Unit Price (₱)</th>
                      <th class="py-3 px-3 w-28 text-right">Total (₱)</th>
                      <th class="py-3 px-2 w-10 text-center"></th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr v-for="(item, idx) in materials" :key="idx" class="hover:bg-slate-50/70 transition-colors">
                      <td class="py-2.5 px-3 text-center font-bold text-slate-400">{{ idx + 1 }}</td>
                      <td class="py-2.5 px-3">
                        <input
                          v-model="item.material_name"
                          type="text"
                          list="material-suggestions"
                          placeholder="e.g., 1/2-inch PVC Pipe, LED 18W Bulb"
                          class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white transition-all"
                        />
                        <datalist id="material-suggestions">
                          <option v-for="name in ALL_MATERIAL_NAMES" :key="name" :value="name" />
                        </datalist>
                      </td>
                      <td class="py-2.5 px-3">
                        <input
                          v-model.number="item.quantity"
                          type="number"
                          min="0.1"
                          step="any"
                          class="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white transition-all"
                        />
                      </td>
                      <td class="py-2.5 px-3">
                        <select
                          v-model="item.unit_measurement"
                          class="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white transition-all cursor-pointer"
                        >
                          <option value="pcs">pcs</option>
                          <option value="meters">meters</option>
                          <option value="liters">liters</option>
                          <option value="kg">kg</option>
                          <option value="rolls">rolls</option>
                          <option value="sets">sets</option>
                          <option value="bags">bags</option>
                          <option value="cans">cans</option>
                          <option value="pairs">pairs</option>
                          <option value="boxes">boxes</option>
                          <option value="units">units</option>
                          <option value="sheets">sheets</option>
                          <option value="gallons">gallons</option>
                          <option value="lengths">lengths</option>
                        </select>
                      </td>
                      <td class="py-2.5 px-3 text-right">
                        <input
                          v-model.number="item.unit_price"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          class="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-right focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white transition-all"
                        />
                      </td>
                      <td class="py-2.5 px-3 text-right font-black text-slate-800">
                        ₱{{ formatNumber((item.quantity || 0) * (item.unit_price || 0)) }}
                      </td>
                      <td class="py-2.5 px-2 text-center">
                        <button
                          type="button"
                          @click="removeMaterialRow(idx)"
                          :disabled="materials.length === 1"
                          class="p-1 text-slate-300 hover:text-rose-500 transition-colors disabled:opacity-20 cursor-pointer"
                          title="Remove item"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="bg-amber-50/70 border-t border-amber-200/80 font-black text-slate-900">
                      <td colspan="4" class="py-3 px-4 text-right uppercase tracking-widest text-[10px] text-amber-800">
                        Total Estimated Material Cost:
                      </td>
                      <td colspan="2" class="py-3 px-3 text-right text-base text-amber-800 font-black">
                        ₱{{ formatNumber(grandTotal) }}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Labor Only Notice -->
            <div v-else class="py-6 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center">
              <p class="text-xs font-bold text-slate-600">Marked as Labor Only Service</p>
              <p class="text-[11px] text-slate-400 mt-0.5">This service does not consume university-supplied parts or billed stock materials.</p>
            </div>

            <!-- Adjustment Reason Notes -->
            <div class="space-y-1.5">
              <label class="text-[11px] font-black text-slate-500 uppercase tracking-widest block">
                Adjustment Reason / Technician Field Notes (Optional)
              </label>
              <textarea
                v-model="adjustmentNotes"
                rows="2"
                placeholder="e.g., Additional 2 conduit pipes required due to wall routing change discovered on site..."
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"
              ></textarea>
            </div>

          </div>

          <!-- Footer Actions -->
          <div class="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div class="text-xs text-slate-500 font-medium">
              <span v-if="!isLaborOnly" class="font-bold text-slate-800">{{ validMaterialsCount }} item(s)</span>
              <span v-if="!isLaborOnly"> • Total: <strong class="text-amber-700">₱{{ formatNumber(grandTotal) }}</strong></span>
              <span v-else class="font-bold text-sky-700">Pure Service / Zero Materials</span>
            </div>

            <div class="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                @click="emitClose"
                class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                @click="submitAdjustments"
                :disabled="isSubmitting"
                class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-amber-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg v-if="isSubmitting" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isSubmitting ? 'Saving Adjustments...' : 'Save Material Adjustments' }}</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import api from '@/api/client';
import { toast } from 'vue3-toastify';
import { ALL_MATERIAL_NAMES, getDefaultUnit } from '@/constants/materials';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  ticket: {
    type: Object,
    default: null,
  },
  unitCode: {
    type: String,
    default: 'FGMU',
  },
});

const emit = defineEmits(['close', 'updated']);

const isLaborOnly = ref(false);
const adjustmentNotes = ref('');
const isSubmitting = ref(false);

const materials = ref([
  { material_name: '', quantity: 1, unit_measurement: 'pcs', unit_price: 0 },
]);

// Initialize form from existing ticket materials when opened
watch(() => props.isOpen, (newVal) => {
  if (newVal && props.ticket) {
    adjustmentNotes.value = '';
    isLaborOnly.value = !!props.ticket.is_labor_only;

    if (Array.isArray(props.ticket.materials) && props.ticket.materials.length > 0) {
      materials.value = props.ticket.materials.map(m => ({
        material_name: m.material_name || m.name || '',
        quantity: parseFloat(m.quantity) || 1,
        unit_measurement: m.unit_measurement || m.unit || 'pcs',
        unit_price: parseFloat(m.unit_price || m.price) || 0,
      }));
    } else {
      materials.value = [
        { material_name: '', quantity: 1, unit_measurement: 'pcs', unit_price: 0 },
      ];
    }
  }
});

const addMaterialRow = () => {
  materials.value.push({
    material_name: '',
    quantity: 1,
    unit_measurement: 'pcs',
    unit_price: 0,
  });
};

// Auto-fill unit_measurement when material name matches common materials
const updateUnitForMaterial = (item) => {
  if (item.material_name) {
    const defaultUnit = getDefaultUnit(item.material_name);
    if (defaultUnit && item.unit_measurement === 'pcs') {
      item.unit_measurement = defaultUnit;
    }
  }
};

const removeMaterialRow = (index) => {
  if (materials.value.length > 1) {
    materials.value.splice(index, 1);
  }
};

// Watch for material name changes to auto-set unit
watch(() => materials.value, (newMaterials) => {
  newMaterials.forEach(item => {
    if (item.material_name && item.unit_measurement === 'pcs') {
      const defaultUnit = getDefaultUnit(item.material_name);
      if (defaultUnit) {
        item.unit_measurement = defaultUnit;
      }
    }
  });
}, { deep: true });

const grandTotal = computed(() => {
  if (isLaborOnly.value) return 0;
  return materials.value.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unit_price) || 0;
    return sum + (qty * price);
  }, 0);
});

const validMaterialsCount = computed(() => {
  if (isLaborOnly.value) return 0;
  return materials.value.filter(m => m.material_name.trim() !== '').length;
});

const formatNumber = (val) => {
  return Number(val || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const emitClose = () => {
  emit('close');
};

const submitAdjustments = async () => {
  if (!props.ticket?.id) {
    toast.error('Invalid ticket.');
    return;
  }

  let payloadMaterials = [];
  if (!isLaborOnly.value) {
    payloadMaterials = materials.value
      .filter(m => m.material_name.trim() !== '')
      .map(m => ({
        material_name: m.material_name.trim(),
        quantity: Math.max(0.01, parseFloat(m.quantity) || 1),
        unit_measurement: m.unit_measurement || 'pcs',
        unit_price: Math.max(0, parseFloat(m.unit_price) || 0),
        total_price: (Math.max(0.01, parseFloat(m.quantity) || 1)) * (Math.max(0, parseFloat(m.unit_price) || 0)),
      }));

    if (payloadMaterials.length === 0 && !isLaborOnly.value) {
      toast.warning('Please enter at least one material item or check "Labor only service".');
      return;
    }
  }

  isSubmitting.value = true;
  try {
    const payload = {
      is_labor_only: isLaborOnly.value ? 1 : 0,
      stage: 'ongoing',
      materials: payloadMaterials,
      notes: adjustmentNotes.value.trim(),
    };

    const res = await api.post(`/tickets/${props.ticket.id}/materials`, payload);
    toast.success(`Ongoing materials updated for #${props.ticket.id}`);
    emit('updated', res.data?.data || payload);
    emitClose();
  } catch (error) {
    console.error('Failed to adjust materials:', error);
    toast.error(error.response?.data?.message || 'Failed to save ongoing material adjustments.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f8fafc;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 9999px;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(8px);
}
</style>
