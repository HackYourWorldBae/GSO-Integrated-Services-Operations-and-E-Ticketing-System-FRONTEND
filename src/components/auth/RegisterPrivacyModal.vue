<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto pointer-events-auto"
        @click.self="emit('close')"
      >
        <div class="my-auto bg-white w-full max-w-2xl max-h-[calc(100dvh-2rem)] sm:max-h-[88vh] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col pointer-events-auto">
          <!-- Modal Header -->
          <div class="px-5 py-4 bg-gradient-to-r from-slate-900 to-emerald-900 text-white flex items-center justify-between shrink-0">
            <div>
              <h3 class="text-base font-black text-white">Data Privacy Notice & Terms</h3>
              <p class="text-[11px] text-slate-300 mt-0.5">RA 10173 Compliance — BSU GSO</p>
            </div>
            <button
              type="button"
              @click="emit('close')"
              class="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 transition-colors flex items-center justify-center cursor-pointer"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-slate-700 leading-relaxed custom-scrollbar">
            <div class="border-l-3 border-emerald-500 pl-3 py-1.5 bg-emerald-50/50 rounded-r-lg">
              <h4 class="font-black text-emerald-800 uppercase tracking-wider text-[11px] mb-1">RA 10173 — Data Privacy Act of 2012</h4>
              <p>BSU, through the GSO, respects your privacy and protects personal information per the <strong>Data Privacy Act of 2012</strong> and NPC issuances.</p>
            </div>

            <div>
              <h4 class="font-black text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">Purpose of Collection</h4>
              <ul class="list-disc list-inside space-y-0.5 ml-1">
                <li>Identity verification for system access</li>
                <li>Processing and tracking service requests</li>
                <li>Ticket status communication and notifications</li>
                <li>Official reports and university compliance</li>
              </ul>
            </div>

            <div>
              <h4 class="font-black text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">Data Collected</h4>
              <ul class="list-disc list-inside space-y-0.5 ml-1">
                <li>Name, ID number, contact number, email</li>
                <li>College/unit affiliation and role</li>
                <li>ID image and selfie for verification</li>
                <li>Account credentials (hashed), activity logs</li>
              </ul>
            </div>

            <div>
              <h4 class="font-black text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">Processing, Retention & Security</h4>
              <ul class="list-disc list-inside space-y-0.5 ml-1">
                <li>Data processed only for stated purposes with security measures</li>
                <li>ID images used solely for verification</li>
                <li>Data retained only as necessary or as required by law</li>
                <li>Your rights: access, rectification, erasure, portability, objection</li>
                <li>Contact DPO at <strong>dpo@bsu.edu.ph</strong></li>
              </ul>
            </div>

            <div>
              <h4 class="font-black text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">Data Sharing</h4>
              <p>Data will not be sold or leased. Disclosure only to authorized BSU/GSO personnel, when required by law, with your consent, or in anonymized form.</p>
            </div>

            <div class="border-l-3 border-amber-500 pl-3 py-1.5 bg-amber-50/50 rounded-r-lg">
              <h4 class="font-black text-amber-800 uppercase tracking-wider text-[11px] mb-1">Your Rights (RA 10173, Chapter IV)</h4>
              <ul class="list-disc list-inside space-y-0.5 ml-1">
                <li><strong>Right to be Informed</strong> — Know what data is collected</li>
                <li><strong>Right to Access</strong> — Request a copy</li>
                <li><strong>Right to Rectification</strong> — Correct inaccurate data</li>
                <li><strong>Right to Erasure</strong> — Request deletion</li>
                <li><strong>Right to Portability</strong> — Obtain data in structured format</li>
                <li><strong>Right to Object</strong> — Object to processing</li>
                <li><strong>Right to Damages</strong> — Seek compensation for violations</li>
              </ul>
            </div>

            <div>
              <h4 class="font-black text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">Terms of Use</h4>
              <ul class="list-disc list-inside space-y-0.5 ml-1">
                <li>Account for official BSU GSO E-Ticketing use only</li>
                <li>Keep credentials confidential</li>
                <li>Provide accurate information</li>
                <li>Misuse results in account suspension</li>
                <li>BSU may suspend/terminate accounts for violations</li>
              </ul>
            </div>

            <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <p class="font-semibold text-slate-800 mb-1">By clicking "I Agree", you acknowledge:</p>
              <ul class="list-disc list-inside space-y-0.5 ml-1">
                <li>You've read this notice and terms</li>
                <li>You consent to data collection and processing</li>
                <li>All information provided is true and accurate</li>
                <li>You understand your rights under RA 10173</li>
              </ul>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              @click="emit('close')"
              class="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="emit('accept')"
              class="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              I Agree
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'accept']);
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
