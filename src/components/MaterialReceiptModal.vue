<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[130] flex items-center justify-center p-2 sm:p-6 bg-slate-950/75 backdrop-blur-md overflow-hidden"
        @click.self="emitClose"
      >
        <div class="bg-white w-full max-w-4xl max-h-[94vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-scale-up">
          
          <!-- Top Action Bar (hidden during printing) -->
          <div class="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0 gap-4 print:hidden">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-black text-white leading-tight">Official Material Issuance Receipt</h3>
                <p class="text-[11px] text-slate-400 font-bold">Ticket #{{ ticket?.id || '—' }}</p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="printReceipt"
                class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Print Official Slip</span>
              </button>

              <button
                type="button"
                @click="emitClose"
                class="w-9 h-9 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition-colors flex items-center justify-center cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Printable Receipt Canvas -->
          <div class="flex-1 overflow-y-auto p-4 sm:p-10 bg-slate-100/70 flex justify-center custom-scrollbar">
            <div id="printable-receipt" class="bg-white w-full max-w-3xl p-8 sm:p-12 rounded-3xl sm:rounded-2xl border border-slate-200 shadow-lg print:shadow-none print:border-none print:p-0 print:m-0 print:w-full space-y-6 text-slate-900">
              
              <!-- University & Office Header -->
              <div class="border-b-2 border-slate-800 pb-5 text-center relative">
                <div class="flex items-center justify-center gap-4 mb-2">
                  <div class="w-16 h-16 rounded-full bg-emerald-800 text-white flex items-center justify-center font-black text-xl shadow-xs shrink-0">
                    BSU
                  </div>
                  <div>
                    <p class="text-[10px] sm:text-xs font-semibold tracking-widest text-slate-500 uppercase">Republic of the Philippines</p>
                    <h1 class="text-base sm:text-lg font-black tracking-tight uppercase text-slate-900 leading-tight">Benguet State University</h1>
                    <h2 class="text-xs sm:text-sm font-extrabold text-emerald-800 uppercase tracking-wide">General Services Office (GSO)</h2>
                    <p class="text-[11px] font-bold text-slate-600 mt-0.5">{{ unitFullName }}</p>
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div class="inline-block px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-md">
                    RECEIPT OF MATERIALS USED
                  </div>
                  <div class="text-[11px] font-bold text-slate-600">
                    Slip No: <span class="font-mono text-emerald-800 font-black">REC-{{ ticket?.id || '000' }}</span>
                  </div>
                </div>
              </div>

              <!-- Ticket & Requester Metadata Grid -->
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ticket Reference</span>
                  <span class="font-black text-slate-900">#{{ ticket?.id || '—' }}</span>
                </div>
                <div>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Service Category</span>
                  <span class="font-bold text-slate-800">{{ ticket?.title || ticket?.service_type || 'N/A' }}</span>
                </div>
                <div>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date Completed</span>
                  <span class="font-bold text-slate-800">{{ formatDate(ticket?.completed_at || ticket?.updated_at) }}</span>
                </div>
                <div>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Requesting End-User</span>
                  <span class="font-bold text-slate-800">{{ ticket?.details?.end_user || ticket?.requestedBy || 'N/A' }}</span>
                </div>
                <div>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Location / Office</span>
                  <span class="font-bold text-slate-800 truncate block">
                    {{ ticket?.details?.college_building || ticket?.location || 'N/A' }}
                    <span v-if="ticket?.details?.office_room || ticket?.office_room"> - {{ ticket?.details?.office_room || ticket?.office_room }}</span>
                  </span>
                </div>
                <div>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Worker</span>
                  <span class="font-bold text-slate-800">{{ ticket?.assignment?.personnel_name || ticket?.assigned_worker || 'N/A' }}</span>
                </div>
              </div>

              <!-- Materials Table -->
              <div>
                <div class="text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Issued / Consumed Materials Breakdown</span>
                  <span class="text-[10px] text-slate-400 font-semibold">{{ materialsList.length }} line item(s)</span>
                </div>

                <div class="border border-slate-300 rounded-xl overflow-hidden">
                  <table class="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr class="bg-slate-100 border-b border-slate-300 text-[10px] font-black text-slate-700 uppercase tracking-wider">
                        <th class="py-2.5 px-3 w-8 text-center">#</th>
                        <th class="py-2.5 px-4">Material / Item Description</th>
                        <th class="py-2.5 px-3 w-20 text-center">Qty</th>
                        <th class="py-2.5 px-3 w-20 text-center">Unit</th>
                        <th class="py-2.5 px-4 w-28 text-right">Unit Price (₱)</th>
                        <th class="py-2.5 px-4 w-32 text-right">Amount (₱)</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200">
                      <tr v-if="materialsList.length === 0">
                        <td colspan="6" class="py-6 px-4 text-center text-slate-500 italic bg-slate-50">
                          Labor & Maintenance Service Only — No GSO Stock Materials Consumed.
                        </td>
                      </tr>
                      <tr v-for="(item, idx) in materialsList" :key="idx" class="hover:bg-slate-50/50">
                        <td class="py-2.5 px-3 text-center text-slate-400 font-bold">{{ idx + 1 }}</td>
                        <td class="py-2.5 px-4 font-bold text-slate-900">{{ item.material_name || item.name }}</td>
                        <td class="py-2.5 px-3 text-center font-bold text-slate-800">{{ item.quantity }}</td>
                        <td class="py-2.5 px-3 text-center text-slate-600 lowercase font-medium">{{ item.unit_measurement || item.unit || 'pcs' }}</td>
                        <td class="py-2.5 px-4 text-right text-slate-700 font-semibold">₱{{ formatNumber(item.unit_price) }}</td>
                        <td class="py-2.5 px-4 text-right font-black text-slate-900">₱{{ formatNumber(item.total_price || (item.quantity * item.unit_price)) }}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr class="bg-emerald-50/80 border-t-2 border-slate-300 font-black text-slate-900">
                        <td colspan="4" class="py-3 px-4 text-right uppercase tracking-widest text-[10px] text-emerald-900">
                          Total Material Amount:
                        </td>
                        <td colspan="2" class="py-3 px-4 text-right text-sm sm:text-base text-emerald-900 font-black">
                          ₱{{ formatNumber(totalMaterialCost) }}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <!-- Dispatcher Notes / Remarks (If any) -->
              <div v-if="ticket?.assignment?.dispatcher_notes || ticket?.project_remarks" class="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Dispatcher Remarks / Observations</span>
                <p class="text-slate-700 font-medium italic leading-relaxed">
                  "{{ ticket?.assignment?.dispatcher_notes || ticket?.project_remarks }}"
                </p>
              </div>

              <!-- Signatures / Accountability Section -->
              <div class="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 text-center text-xs">
                <div>
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-8">Dispatched & Liquidated By</p>
                  <div class="border-b border-slate-800 mx-2"></div>
                  <p class="text-[11px] font-black text-slate-800 mt-1 uppercase">{{ unitCode }} Dispatcher</p>
                  <p class="text-[9px] text-slate-400">GSO Staff / In-Charge</p>
                </div>
                <div>
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-8">Accomplished / Performed By</p>
                  <div class="border-b border-slate-800 mx-2"></div>
                  <p class="text-[11px] font-black text-slate-800 mt-1 uppercase">{{ ticket?.assignment?.personnel_name || 'Assigned Worker' }}</p>
                  <p class="text-[9px] text-slate-400">Technical / Maintenance Staff</p>
                </div>
                <div>
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-8">Received / Verified By</p>
                  <div class="border-b border-slate-800 mx-2"></div>
                  <p class="text-[11px] font-black text-slate-800 mt-1 uppercase">{{ ticket?.details?.end_user || ticket?.requestedBy || 'End User' }}</p>
                  <p class="text-[9px] text-slate-400">Requesting End-User</p>
                </div>
              </div>

              <!-- Official Footer Note -->
              <div class="pt-4 text-center text-[9px] text-slate-400 border-t border-dashed border-slate-200">
                This is an official system-generated material liquidation slip for GSO Integrated Services Operations & E-Ticketing System.
              </div>

            </div>
          </div>

          <!-- Bottom Actions (Modal Footer) -->
          <div class="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0 print:hidden">
            <span class="text-xs text-slate-500 font-medium">Benguet State University • General Services Office</span>
            <div class="flex items-center gap-3">
              <button
                type="button"
                @click="printReceipt"
                class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Print</span>
              </button>
              <button
                type="button"
                @click="emitClose"
                class="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  ticket: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['update:isOpen', 'close']);

const unitCode = computed(() => {
  if (props.ticket?.unit_id === 2 || props.ticket?.unit_code === 'LEAU') {
    return 'LEAU';
  }
  return 'FGMU';
});

const unitFullName = computed(() => {
  if (unitCode.value === 'LEAU') {
    return 'Landscaping & Environmental Aesthetics Unit (LEAU)';
  }
  return 'Facilities & Grounds Maintenance Unit (FGMU)';
});

const materialsList = computed(() => {
  if (!props.ticket) return [];
  if (Array.isArray(props.ticket.materials) && props.ticket.materials.length > 0) {
    return props.ticket.materials;
  }
  return [];
});

const totalMaterialCost = computed(() => {
  if (props.ticket?.total_material_cost !== undefined) {
    return Number(props.ticket.total_material_cost || 0);
  }
  return materialsList.value.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unit_price) || 0;
    return sum + (item.total_price !== undefined ? parseFloat(item.total_price) : (qty * price));
  }, 0);
});

const formatNumber = (val) => {
  return Number(val || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (dateStr) => {
  if (!dateStr) return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const parsed = new Date(dateStr.replace(' ', 'T'));
  if (isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const printReceipt = () => {
  window.print();
};

const emitClose = () => {
  emit('update:isOpen', false);
  emit('close');
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

@media print {
  body * {
    visibility: hidden;
  }
  #printable-receipt, #printable-receipt * {
    visibility: visible;
  }
  #printable-receipt {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }
}
</style>
