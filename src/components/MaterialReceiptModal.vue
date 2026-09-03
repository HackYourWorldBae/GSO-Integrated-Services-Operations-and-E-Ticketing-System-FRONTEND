<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[130] flex items-center justify-center p-2 sm:p-6 bg-slate-950/75 backdrop-blur-md overflow-hidden"
        @click.self="emitClose"
      >
        <div class="bg-white w-full max-w-4xl h-[92vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200 relative animate-scale-up">
          
          <!-- Top Action Bar (hidden during printing) -->
          <div class="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0 gap-4 print:hidden">
            <div class="flex items-center gap-3.5 min-w-0">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="min-w-0">
                <h3 class="text-sm font-black text-white truncate leading-tight">Official Material Issuance Slip</h3>
                <p class="text-[11px] text-slate-400 font-bold truncate mt-0.5">Ticket #{{ ticket?.id || ticket?.ticketId || '—' }} • {{ unitCode }}</p>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <!-- Open PDF in New Tab -->
              <button
                type="button"
                @click="openInNewTab"
                class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                title="Open official PDF slip in new browser tab"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span class="hidden sm:inline">New Tab</span>
              </button>

              <!-- Download PDF -->
              <button
                type="button"
                @click="downloadPdf"
                class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
                title="Download official material slip as PDF"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download PDF</span>
              </button>

              <!-- Print -->
              <button
                type="button"
                @click="printReceipt"
                class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 hidden sm:flex"
                title="Print official material slip"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Print</span>
              </button>

              <button
                type="button"
                @click="emitClose"
                class="w-9 h-9 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition-colors flex items-center justify-center cursor-pointer"
                title="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Printable Receipt Canvas / Scrollable Viewport -->
          <div class="flex-1 overflow-y-auto p-4 sm:p-8 md:p-10 bg-slate-100/80 flex justify-center custom-scrollbar">
            <div id="printable-receipt" class="bg-white w-full max-w-3xl p-6 sm:p-10 md:p-12 rounded-3xl border border-slate-200/90 shadow-xl print:shadow-none print:border-none print:p-0 print:m-0 print:w-full space-y-7 text-slate-900">
              
              <!-- University & Office Header with Official BSU Logo -->
              <div class="border-b-2 border-slate-900 pb-6 text-center relative">
                <div class="flex items-center justify-center gap-5 mb-3">
                  <img 
                    src="/bsu-logo.png" 
                    alt="BSU Logo" 
                    class="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-xs shrink-0" 
                  />
                  <div class="text-center sm:text-left">
                    <p class="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-slate-500 uppercase">Republic of the Philippines</p>
                    <h1 class="text-base sm:text-xl font-black tracking-tight uppercase text-slate-900 leading-tight">Benguet State University</h1>
                    <h2 class="text-xs sm:text-sm font-extrabold text-emerald-800 uppercase tracking-wider mt-0.5">General Services Office (GSO)</h2>
                    <p class="text-[11px] sm:text-xs font-semibold text-slate-600 mt-0.5">{{ unitFullName }}</p>
                  </div>
                </div>

                <div class="mt-5 pt-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div class="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-lg shadow-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                    </svg>
                    RECEIPT OF MATERIALS USED
                  </div>
                  <div class="text-xs font-bold text-slate-600">
                    Slip Reference: <span class="font-mono text-emerald-800 font-black text-sm">REC-#{{ ticket?.id || ticket?.ticketId || '000' }}</span>
                  </div>
                </div>
              </div>

              <!-- Ticket & Requester Metadata Grid (Spacious & Non-Cramped) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50/90 border border-slate-200/80">
                <div class="space-y-1">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Ticket Number</span>
                  <span class="text-sm font-black text-slate-900 block font-mono">#{{ ticket?.id || ticket?.ticketId || '—' }}</span>
                </div>
                <div class="space-y-1">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Service Category</span>
                  <span class="text-xs sm:text-sm font-bold text-slate-800 block leading-snug">{{ ticket?.title || ticket?.service_type || ticket?.service || 'N/A' }}</span>
                </div>
                <div class="space-y-1">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Requesting End-User</span>
                  <span class="text-xs sm:text-sm font-bold text-slate-800 block leading-snug">{{ ticket?.details?.end_user || ticket?.details?.requesting_personnel || ticket?.requestedBy || ticket?.requested_by || 'End User' }}</span>
                </div>
                <div class="space-y-1">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Date Completed</span>
                  <span class="text-xs sm:text-sm font-bold text-slate-800 block">{{ formatDate(ticket?.completed_at || ticket?.updated_at) }}</span>
                </div>
                
                <div class="space-y-1 sm:col-span-2">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Location / Office / Room</span>
                  <span class="text-xs sm:text-sm font-bold text-slate-800 block leading-snug">
                    {{ ticket?.details?.college_building || ticket?.location || 'Main Campus' }}
                    <span v-if="ticket?.details?.office_room || ticket?.office_room" class="text-slate-600 font-semibold"> • {{ ticket?.details?.office_room || ticket?.office_room }}</span>
                  </span>
                </div>
                <div class="space-y-1 sm:col-span-2">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Assigned Personnel</span>
                  <span class="text-xs sm:text-sm font-bold text-slate-900 block leading-snug">
                    {{ personnelDisplay }}
                  </span>
                </div>
              </div>

              <!-- Materials Table Breakdown -->
              <div class="space-y-2.5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider">Issued & Consumed Materials</h4>
                  </div>
                  <span class="text-[11px] text-slate-500 font-bold px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                    {{ materialsList.length }} Item{{ materialsList.length !== 1 ? 's' : '' }} Listed
                  </span>
                </div>

                <div class="border border-slate-300 rounded-2xl overflow-hidden shadow-xs bg-white">
                  <table class="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr class="bg-slate-100/90 border-b border-slate-300 text-[10px] font-black text-slate-700 uppercase tracking-wider">
                        <th class="py-3 px-4 w-12 text-center">#</th>
                        <th class="py-3 px-4">Material / Item Description</th>
                        <th class="py-3 px-4 w-24 text-center">Quantity</th>
                        <th class="py-3 px-4 w-24 text-center">Unit</th>
                        <th class="py-3 px-4 w-32 text-right">Unit Price (₱)</th>
                        <th class="py-3 px-4 w-36 text-right">Amount (₱)</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200">
                      <tr v-if="materialsList.length === 0">
                        <td colspan="6" class="py-8 px-6 text-center text-slate-500 italic bg-slate-50/50">
                          <div class="flex flex-col items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span class="font-semibold text-xs text-slate-600">Labor & Maintenance Service Only</span>
                            <span class="text-[11px] text-slate-400">No university stock materials or billed supplies were consumed for this ticket.</span>
                          </div>
                        </td>
                      </tr>
                      <tr v-for="(item, idx) in materialsList" :key="idx" class="hover:bg-slate-50/60 transition-colors">
                        <td class="py-3.5 px-4 text-center text-slate-400 font-bold">{{ idx + 1 }}</td>
                        <td class="py-3.5 px-4 font-bold text-slate-900 leading-snug">{{ item.material_name || item.name }}</td>
                        <td class="py-3.5 px-4 text-center font-bold text-slate-800 tabular-nums">{{ item.quantity }}</td>
                        <td class="py-3.5 px-4 text-center text-slate-600 lowercase font-medium">{{ item.unit_measurement || item.unit || 'pcs' }}</td>
                        <td class="py-3.5 px-4 text-right text-slate-700 font-semibold tabular-nums">₱{{ formatNumber(item.unit_price) }}</td>
                        <td class="py-3.5 px-4 text-right font-black text-slate-900 tabular-nums">₱{{ formatNumber(item.total_price !== undefined ? item.total_price : (item.quantity * item.unit_price)) }}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr class="bg-emerald-50/90 border-t-2 border-slate-300 font-black text-slate-900">
                        <td colspan="4" class="py-4 px-5 text-right uppercase tracking-wider text-[11px] text-emerald-950 font-black">
                          Total Material Cost:
                        </td>
                        <td colspan="2" class="py-4 px-5 text-right text-base font-black text-emerald-900 tabular-nums">
                          ₱{{ formatNumber(totalMaterialCost) }}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <!-- Dispatcher Notes / Remarks (If any) -->
              <div v-if="ticket?.assignment?.dispatcher_notes || ticket?.project_remarks" class="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 text-xs">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Dispatcher Notes / Field Observations</span>
                <p class="text-slate-700 font-medium italic leading-relaxed">
                  "{{ ticket?.assignment?.dispatcher_notes || ticket?.project_remarks }}"
                </p>
              </div>

              <!-- Signatures & Accountability Section (Generous, Well-Spaced) -->
              <div class="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs">
                <div class="flex flex-col justify-between">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-12">Dispatched & Liquidated By</p>
                  <div>
                    <div class="border-b border-slate-800 mx-4"></div>
                    <p class="text-xs font-black text-slate-900 mt-2 uppercase tracking-wide">{{ unitCode }} Dispatcher</p>
                    <p class="text-[10px] text-slate-500 font-medium">GSO Dispatch In-Charge</p>
                  </div>
                </div>
                <div class="flex flex-col justify-between">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-12">Accomplished & Performed By</p>
                  <div>
                    <div class="border-b border-slate-800 mx-4"></div>
                    <p class="text-xs font-black text-slate-900 mt-2 uppercase tracking-wide truncate px-1">{{ personnelDisplay }}</p>
                    <p class="text-[10px] text-slate-500 font-medium">Technical & Maintenance Personnel</p>
                  </div>
                </div>
                <div class="flex flex-col justify-between">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-12">Received & Verified By</p>
                  <div>
                    <div class="border-b border-slate-800 mx-4"></div>
                    <p class="text-xs font-black text-slate-900 mt-2 uppercase tracking-wide truncate px-1">{{ ticket?.details?.end_user || ticket?.details?.requesting_personnel || ticket?.requestedBy || ticket?.requested_by || 'End User' }}</p>
                    <p class="text-[10px] text-slate-500 font-medium">Requesting End-User / Representative</p>
                  </div>
                </div>
              </div>

              <!-- Official Footer Note -->
              <div class="pt-4 text-center text-[10px] text-slate-400 border-t border-dashed border-slate-200">
                This document serves as an official material issuance and service completion receipt generated by the BSU GSO E-Ticketing System.
              </div>

            </div>
          </div>

          <!-- Bottom Actions (Modal Footer) -->
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0 print:hidden">
            <span class="text-xs text-slate-500 font-medium hidden sm:inline">Benguet State University • General Services Office</span>
            <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
              <!-- Download PDF -->
              <button
                type="button"
                @click="downloadPdf"
                class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download PDF</span>
              </button>

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
                class="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
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
import { toast } from 'vue3-toastify';
import { downloadMaterialSlipPdf, openMaterialSlipPdfInNewTab } from '@/utils/materialSlipPdfGenerator';

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

const downloadPdf = async () => {
  if (!props.ticket) return;
  try {
    await downloadMaterialSlipPdf(props.ticket);
    toast.success('Material slip PDF downloaded!');
  } catch (err) {
    console.error('Failed to download material slip PDF:', err);
    toast.error('Failed to generate PDF download.');
  }
};

const openInNewTab = async () => {
  if (!props.ticket) return;
  try {
    await openMaterialSlipPdfInNewTab(props.ticket);
  } catch (err) {
    console.error('Failed to open material slip PDF in new tab:', err);
    toast.error('Failed to open PDF in new tab.');
  }
};

const unitCode = computed(() => {
  if (props.ticket?.unit_id === 2 || props.ticket?.unit_code === 'LEAU' || props.ticket?.unit === 'LEAU') {
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

const personnelDisplay = computed(() => {
  if (!props.ticket) return 'Unassigned';
  
  if (Array.isArray(props.ticket.assignments) && props.ticket.assignments.length > 0) {
    const names = props.ticket.assignments
      .map(a => a.personnel_name || a.assigned_to_name || a.name)
      .filter(Boolean);
    if (names.length > 0) return names.join(', ');
  }

  if (Array.isArray(props.ticket.personnel) && props.ticket.personnel.length > 0) {
    const names = props.ticket.personnel
      .map(p => (typeof p === 'string' ? p : (p.name || p.personnel_name)))
      .filter(Boolean);
    if (names.length > 0) return names.join(', ');
  }

  const raw = 
    props.ticket.assignment?.personnel_name || 
    props.ticket.assignedWorker || 
    props.ticket.assigned_worker || 
    props.ticket.assigned_personnel || 
    '';

  if (raw && typeof raw === 'string' && raw.trim().toLowerCase() !== 'unassigned') {
    return raw;
  }

  return 'Assigned Worker';
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
  const parsed = new Date(typeof dateStr === 'string' ? dateStr.replace(' ', 'T') : dateStr);
  if (isNaN(parsed.getTime())) return String(dateStr);
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
  #printable-receipt, 
  #printable-receipt * {
    visibility: visible;
  }
  #printable-receipt {
    position: absolute;
    left: 0;
    top: 0;
    width: 100% !important;
    max-width: 100% !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }
}
</style>
