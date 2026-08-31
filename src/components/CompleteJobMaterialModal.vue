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
          <div class="px-6 sm:px-8 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
            <div class="flex items-center gap-3.5">
              <div class="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-black text-white leading-tight">Complete Job & Material Liquidation</h3>
                <p class="text-xs text-emerald-400 font-bold uppercase tracking-widest mt-0.5">
                  Ticket #{{ ticket?.id || '—' }} • {{ unitLabel }}
                </p>
              </div>
            </div>

            <button
              @click="emitClose"
              class="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition-colors flex items-center justify-center cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body Container -->
          <div class="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar">
            
            <!-- Ticket Summary Info Card -->
            <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Service Requested</span>
                <span class="text-xs sm:text-sm font-bold text-slate-800 truncate block">{{ ticket?.title || ticket?.service_type || 'N/A' }}</span>
              </div>
              <div>
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Requestor</span>
                <span class="text-xs sm:text-sm font-bold text-slate-800 truncate block">{{ ticket?.details?.end_user || ticket?.requestedBy || 'N/A' }}</span>
              </div>
              <div>
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Assigned Worker</span>
                <span class="text-xs sm:text-sm font-bold text-slate-800 truncate block">{{ ticket?.assignment?.personnel_name || 'N/A' }}</span>
              </div>
              <div>
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Duration / Elapsed</span>
                <span class="text-xs sm:text-sm font-black text-emerald-700 block">{{ elapsedDuration || 'Finished' }}</span>
              </div>
            </div>

            <!-- Material Usage Toggle -->
            <div class="flex items-center justify-between p-4 bg-emerald-50/60 border border-emerald-200/60 rounded-2xl">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-sm font-black text-slate-900 leading-none">Materials Used for this Job</h4>
                  <p class="text-xs text-slate-500 font-medium mt-1">Itemize all parts, supplies, and replacement materials consumed.</p>
                </div>
              </div>
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  v-model="noMaterialsUsed"
                  class="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
                <span class="text-xs font-bold text-slate-700">No materials used (Labor only)</span>
              </label>
            </div>

            <!-- Material Items Form -->
            <div v-if="!noMaterialsUsed" class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black text-slate-700 uppercase tracking-wider">Itemized Material List</span>
                <button
                  type="button"
                  @click="addMaterialRow"
                  class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                  </svg>
                  <span>Add Material</span>
                </button>
              </div>

              <!-- Materials Table / List -->
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
                          placeholder="e.g., 1/2-inch PVC Pipe, LED 18W Bulb"
                          class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all"
                        />
                      </td>
                      <td class="py-2.5 px-3">
                        <input
                          v-model.number="item.quantity"
                          type="number"
                          min="0.1"
                          step="any"
                          class="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all"
                        />
                      </td>
                      <td class="py-2.5 px-3">
                        <select
                          v-model="item.unit_measurement"
                          class="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer"
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
                        </select>
                      </td>
                      <td class="py-2.5 px-3 text-right">
                        <input
                          v-model.number="item.unit_price"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          class="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-right focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all"
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
                    <tr class="bg-emerald-50/70 border-t border-emerald-200/80 font-black text-slate-900">
                      <td colspan="4" class="py-3 px-4 text-right uppercase tracking-widest text-[10px] text-emerald-800">
                        Grand Total Materials Cost:
                      </td>
                      <td colspan="2" class="py-3 px-3 text-right text-base text-emerald-800 font-black">
                        ₱{{ formatNumber(grandTotal) }}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Labor Only Notice when toggle checked -->
            <div v-else class="py-6 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center">
              <p class="text-xs font-bold text-slate-600">No materials will be charged or attached to this ticket.</p>
              <p class="text-[11px] text-slate-400 mt-0.5">The receipt will indicate labor / standard maintenance service only.</p>
            </div>

            <!-- Dispatcher Notes -->
            <div class="space-y-1.5">
              <label class="text-[11px] font-black text-slate-500 uppercase tracking-widest block">
                Dispatcher Notes & Completion Remarks (Optional)
              </label>
              <textarea
                v-model="dispatcherNotes"
                rows="2"
                placeholder="Add any specific accomplishment notes, parts warranty, or observations..."
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
              ></textarea>
            </div>

          </div>

          <!-- Footer Actions -->
          <div class="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div class="text-xs text-slate-500 font-medium">
              <span v-if="!noMaterialsUsed" class="font-bold text-slate-800">{{ validMaterialsCount }} item(s)</span>
              <span v-if="!noMaterialsUsed"> • Total: <strong class="text-emerald-700">₱{{ formatNumber(grandTotal) }}</strong></span>
              <span v-else class="font-bold text-slate-600">Pure Service / Zero Materials</span>
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
                @click="submitCompletion"
                :disabled="isSubmitting"
                class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-emerald-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg v-if="isSubmitting" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isSubmitting ? 'Saving & Completing...' : 'Complete Job & Save Receipt' }}</span>
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

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  ticket: {
    type: Object,
    default: null,
  },
  elapsedDuration: {
    type: String,
    default: '',
  },
  unitCode: {
    type: String,
    default: 'FGMU',
  },
});

const emit = defineEmits(['update:isOpen', 'completed', 'close']);

const noMaterialsUsed = ref(false);
const dispatcherNotes = ref('');
const isSubmitting = ref(false);

const materials = ref([
  { material_name: '', quantity: 1, unit_measurement: 'pcs', unit_price: 0 },
]);

const unitLabel = computed(() => {
  if (props.unitCode === 'LEAU' || props.ticket?.unit_id === 2) {
    return 'Landscaping & Environmental Aesthetics Unit';
  }
  return 'Facilities & Grounds Maintenance Unit';
});

// Reset form when modal opens
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    noMaterialsUsed.value = false;
    dispatcherNotes.value = props.ticket?.assignment?.dispatcher_notes || '';
    materials.value = [
      { material_name: '', quantity: 1, unit_measurement: 'pcs', unit_price: 0 },
    ];
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

const removeMaterialRow = (index) => {
  if (materials.value.length > 1) {
    materials.value.splice(index, 1);
  }
};

const grandTotal = computed(() => {
  if (noMaterialsUsed.value) return 0;
  return materials.value.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unit_price) || 0;
    return sum + (qty * price);
  }, 0);
});

const validMaterialsCount = computed(() => {
  if (noMaterialsUsed.value) return 0;
  return materials.value.filter(m => m.material_name.trim() !== '').length;
});

const formatNumber = (val) => {
  return Number(val || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const emitClose = () => {
  emit('update:isOpen', false);
  emit('close');
};

const submitCompletion = async () => {
  if (!props.ticket?.id) {
    toast.error('Invalid ticket.');
    return;
  }

  // Filter valid materials
  let payloadMaterials = [];
  if (!noMaterialsUsed.value) {
    payloadMaterials = materials.value
      .filter(m => m.material_name.trim() !== '')
      .map(m => ({
        material_name: m.material_name.trim(),
        quantity: Math.max(0.01, parseFloat(m.quantity) || 1),
        unit_measurement: m.unit_measurement || 'pcs',
        unit_price: Math.max(0, parseFloat(m.unit_price) || 0),
        total_price: (Math.max(0.01, parseFloat(m.quantity) || 1)) * (Math.max(0, parseFloat(m.unit_price) || 0)),
      }));

    if (payloadMaterials.length === 0 && materials.value.length > 0 && !noMaterialsUsed.value) {
      toast.warning('Please enter the material description or check "No materials used".');
      return;
    }
  }

  isSubmitting.value = true;
  try {
    const payload = {
      materials: payloadMaterials,
      dispatcher_notes: dispatcherNotes.value.trim(),
    };

    const res = await api.patch(`/tickets/${props.ticket.id}/complete`, payload);
    toast.success(`Ticket #${props.ticket.id} marked as completed.`);
    emit('completed', {
      ticketId: props.ticket.id,
      materials: payloadMaterials,
      totalCost: grandTotal.value,
      data: res.data?.data,
    });
    emitClose();
  } catch (error) {
    console.error('Failed to complete ticket with materials:', error);
    toast.error(error.response?.data?.message || 'Failed to complete job and save materials.');
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
