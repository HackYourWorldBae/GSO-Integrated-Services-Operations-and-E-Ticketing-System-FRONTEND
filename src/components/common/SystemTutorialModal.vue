<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isTutorialModalOpen"
        class="fixed inset-0 z-[160] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto"
        @click.self="closeTutorialModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-modal-title"
      >
        <div
          class="bg-white rounded-3xl w-full max-w-4xl p-5 sm:p-7 shadow-2xl border border-slate-200/90 my-auto max-h-[92vh] flex flex-col overflow-hidden animate-scale-up"
        >
          <!-- Header -->
          <div class="flex items-center justify-between pb-4 border-b border-slate-200/80 shrink-0 gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 shadow-2xs">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 id="tutorial-modal-title" class="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Portal User Manual &amp; Guides</span>
                  <span class="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300 hidden sm:inline-block">
                    Easy Reference
                  </span>
                </h3>
                <p class="text-xs text-slate-500 font-medium mt-0.5">
                  Select your role below to view step-by-step instructions or launch an interactive walkthrough.
                </p>
              </div>
            </div>

            <!-- Close Button -->
            <button
              type="button"
              @click="closeTutorialModal"
              class="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Close Manual"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Role Selector Navigation Tabs -->
          <div class="pt-4 pb-3 border-b border-slate-100 shrink-0">
            <div class="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
              <button
                v-for="role in rolesList"
                :key="role.key"
                type="button"
                @click="selectedRoleTab = role.key"
                :class="[
                  'px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer touch-manipulation min-h-[38px]',
                  selectedRoleTab === role.key
                    ? 'bg-slate-900 text-white shadow-xs font-black'
                    : 'bg-slate-100/90 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                ]"
              >
                <span>{{ role.icon }}</span>
                <span>{{ role.label }}</span>
                <span
                  v-if="currentRole === role.key"
                  class="text-[9px] px-1.5 py-0.2 rounded-full font-black uppercase tracking-wider"
                  :class="selectedRoleTab === role.key ? 'bg-emerald-400 text-slate-950' : 'bg-emerald-100 text-emerald-800'"
                >
                  Your Role
                </span>
              </button>
            </div>
          </div>

          <!-- Tab Content (Scrollable) -->
          <div class="flex-1 overflow-y-auto custom-scrollbar py-5 space-y-6">

            <!-- Interactive Tour Hero Callout -->
            <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm border border-emerald-800">
              <div class="space-y-1">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Interactive Mode
                </span>
                <h4 class="text-base sm:text-lg font-black text-white">
                  Take the {{ activeRoleData.label }} Dashboard Walkthrough
                </h4>
                <p class="text-xs text-slate-300 max-w-xl">
                  Step-by-step highlight of key on-screen buttons, queues, and features right on your dashboard.
                </p>
              </div>

              <button
                type="button"
                @click="startGuidedTour(selectedRoleTab)"
                class="px-5 py-2.5 min-h-[44px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Start Interactive Tour</span>
              </button>
            </div>

            <!-- Role Summary Card -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                Role Purpose
              </h4>
              <p class="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {{ activeRoleData.summary }}
              </p>
            </div>

            <!-- 3-Step Core Workflow -->
            <div class="space-y-3">
              <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span>Core Workflow at a Glance</span>
                <span class="text-[10px] text-slate-400 font-normal">({{ activeRoleData.steps.length }} Easy Steps)</span>
              </h4>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div
                  v-for="(step, idx) in activeRoleData.steps"
                  :key="idx"
                  class="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 flex flex-col justify-between"
                >
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">
                        {{ idx + 1 }}
                      </span>
                      <span class="text-base">{{ step.icon }}</span>
                    </div>
                    <h5 class="text-xs font-black text-slate-900">{{ step.title }}</h5>
                    <p class="text-xs text-slate-600 leading-relaxed font-medium">
                      {{ step.desc }}
                    </p>
                  </div>
                  <div class="pt-2 border-t border-slate-100 text-[11px] font-bold text-emerald-800">
                    {{ step.actionTip }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Helpful Tips & Shortcuts Grid -->
            <div class="space-y-3">
              <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider">
                Pro-Tips &amp; Features
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  v-for="(tip, idx) in activeRoleData.tips"
                  :key="idx"
                  class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-3"
                >
                  <div class="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 text-xs shadow-2xs">
                    {{ tip.icon }}
                  </div>
                  <div class="min-w-0">
                    <h6 class="text-xs font-bold text-slate-900">{{ tip.title }}</h6>
                    <p class="text-xs text-slate-500 mt-0.5 leading-normal">{{ tip.desc }}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Modal Footer -->
          <div class="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <div class="flex items-center gap-2 text-xs text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Tip: You can press <kbd class="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px] font-mono font-bold text-slate-700">Esc</kbd> anytime to exit tutorials.</span>
            </div>

            <button
              type="button"
              @click="closeTutorialModal"
              class="px-5 py-2.5 min-h-[44px] rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
            >
              Close Manual
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue';
import { useTutorial } from '@/composables/useTutorial';

const {
  isTutorialModalOpen,
  selectedRoleTab,
  currentRole,
  closeTutorialModal,
  startGuidedTour
} = useTutorial();

const rolesList = [
  { key: 'requestor', label: 'Student / Employee', icon: '🎓' },
  { key: 'admin', label: 'Unit Admin (FGMU/LEAU/SSU)', icon: '🛠️' },
  { key: 'director', label: 'GSO Director', icon: '🏛️' },
  { key: 'worker', label: 'Responding Personnel', icon: '👷' },
  { key: 'superadmin', label: 'Superadmin', icon: '🛡️' }
];

const roleContent = {
  requestor: {
    label: 'Student / Employee (Requestor)',
    summary: 'Submit work orders, borrow tools or plants, and report campus security incidents with real-time status tracking and transparent completion reviews.',
    steps: [
      {
        icon: '📝',
        title: '1. Submit Request',
        desc: 'Select a service from Facilities (FGMU), Environment (LEAU), or Security (SSU). Fill in location and details, attaching photos if needed.',
        actionTip: 'Action: Click "New Request" from Dashboard'
      },
      {
        icon: '🔍',
        title: '2. Track & Schedule',
        desc: 'Follow your ticket in "My Service Requests". You will receive updates as the ticket is approved, assigned, and scheduled.',
        actionTip: 'Action: Monitor timeline & implementation date'
      },
      {
        icon: '⭐',
        title: '3. Inspect & Rate',
        desc: 'When personnel completes the job, verify the work and submit your satisfaction rating (1-5 stars) to finalize the ticket.',
        actionTip: 'Action: Rate ticket in "Completed Tickets"'
      }
    ],
    tips: [
      { icon: '👁️', title: 'Comfort View', desc: 'Click "Comfort View" in the navbar for high-contrast reading and clear borders.' },
      { icon: '🔔', title: 'Sound Notifications', desc: 'Turn on sound chimes to hear real-time alerts as your tickets change status.' },
      { icon: '🌱', title: 'Plant & Tool Borrowing', desc: 'Need equipment or event plants? Submit a borrowing request specifying pickup & return dates.' },
      { icon: '🛡️', title: 'Incident Reports', desc: 'Security reports are handled directly by SSU with private notations and rapid review.' }
    ]
  },
  admin: {
    label: 'Unit Administrator (FGMU, LEAU, SSU)',
    summary: 'Oversee unit operations, manage pending tickets, dispatch skilled personnel, maintain plant/tool inventory, and review completed work orders.',
    steps: [
      {
        icon: '📥',
        title: '1. Review Incoming Tickets',
        desc: 'Inspect submitted tickets in "Pending Approvals" or "Submitted Reports". Review the problem description, location, and photos.',
        actionTip: 'Action: Approve or decline with clear notation'
      },
      {
        icon: '👷',
        title: '2. Dispatch & Schedule',
        desc: 'Assign qualified personnel from your roster, designate working days, and schedule the implementation date.',
        actionTip: 'Action: Open "Dispatch Tickets" to assign workers'
      },
      {
        icon: '📦',
        title: '3. Track, Inventory & Complete',
        desc: 'Monitor active jobs, record materials or borrowed tools/plants, and mark jobs completed for requester rating.',
        actionTip: 'Action: Liquidate materials & archive records'
      }
    ],
    tips: [
      { icon: '📋', title: 'Printable Job Orders', desc: 'Generate official University Job Order PDFs directly from the ticket card.' },
      { icon: '🌿', title: 'Inventory Management', desc: 'Track plant stock (LEAU) and tools/equipment (FGMU) with availability status.' },
      { icon: '🛡️', title: 'SSU Incidents', desc: 'Record official recommendations and notations directly into the investigation log.' },
      { icon: '⏱️', title: 'Timeline Extensions', desc: 'If external delays occur, add justified extension days with an automatic requester notice.' }
    ]
  },
  director: {
    label: 'GSO Director',
    summary: 'Executive leadership oversight across all University General Services, policy approvals, high-level reporting, and operational delegation.',
    steps: [
      {
        icon: '📊',
        title: '1. Executive Overview',
        desc: 'Review campus-wide SLA metrics, ticket volumes, and pending queues across FGMU, LEAU, and SSU at a glance.',
        actionTip: 'Action: Inspect live metrics on Director Dashboard'
      },
      {
        icon: '⚖️',
        title: '2. Approvals & Materials',
        desc: 'Authorize equipment borrowings, review material requisition logs, and approve high-impact campus maintenance.',
        actionTip: 'Action: Review ticket queues and approve requests'
      },
      {
        icon: '🏛️',
        title: '3. Delegation & Analytics',
        desc: 'Temporarily assume direct management of any sub-unit if a unit head is on leave, and export PDF executive summaries.',
        actionTip: 'Action: Use Acting Head mode when needed'
      }
    ],
    tips: [
      { icon: '📑', title: 'Material Reports', desc: 'Access comprehensive cost summaries and material usage records across all units.' },
      { icon: '🔄', title: 'Acting Unit Head Mode', desc: 'Switch seamlessly to run a specific unit without logging out of your Director account.' },
      { icon: '📈', title: 'SLA Monitoring', desc: 'Track ticket turnaround times and department responsiveness against target dates.' },
      { icon: '🗂️', title: 'Universal Archives', desc: 'Search and inspect historical tickets and incident reports across all campus departments.' }
    ]
  },
  worker: {
    label: 'Responding Personnel (Field Staff)',
    summary: 'Execute field work orders, inspect problem areas, log materials and tools used, and mark tasks completed for verification.',
    steps: [
      {
        icon: '📲',
        title: '1. Check Assigned Work Orders',
        desc: 'Open your Personnel Dashboard to see tasks assigned to you, along with location, room number, and requester notes.',
        actionTip: 'Action: Review today\'s schedule and task details'
      },
      {
        icon: '🔧',
        title: '2. Perform Service & Log Supplies',
        desc: 'Conduct repairs or plant care on site. If materials or parts are consumed, record them accurately on the work order.',
        actionTip: 'Action: Log materials and request extensions if needed'
      },
      {
        icon: '✅',
        title: '3. Complete Assignment',
        desc: 'Once repairs are done and tested, mark the job as completed so the requester can inspect and rate the outcome.',
        actionTip: 'Action: Click "Complete Job" on your dashboard'
      }
    ],
    tips: [
      { icon: '📍', title: 'Location Details', desc: 'Always check the college building and room number before heading out to work.' },
      { icon: '⏱️', title: 'Target Working Days', desc: 'Complete jobs within the assigned target days to maintain high performance ratings.' },
      { icon: '📜', title: 'Job History', desc: 'Review your completed jobs and historical performance under "Completed Jobs History".' },
      { icon: '🔔', title: 'Instant Notification', desc: 'Your portal sounds an audio chime whenever a new ticket is dispatched to your roster.' }
    ]
  },
  superadmin: {
    label: 'Superadmin (System Administrator)',
    summary: 'Platform security, user credential verification, RBAC permissions, audit trail governance, and disaster recovery backups.',
    steps: [
      {
        icon: '👥',
        title: '1. Provision & Verify Users',
        desc: 'Review pending student and employee registrations, verify their ID card uploads against university records, and approve accounts.',
        actionTip: 'Action: Process pending accounts in Verification Queue'
      },
      {
        icon: '🛡️',
        title: '2. Security & RBAC Roles',
        desc: 'Assign roles (Student, Employee, Admin, Director, Worker) and ensure access boundaries are strictly observed.',
        actionTip: 'Action: Manage user permissions in User Accounts'
      },
      {
        icon: '💾',
        title: '3. Audit & Disaster Recovery',
        desc: 'Inspect full business and authentication audit trails, monitor system events, and download periodic database backups.',
        actionTip: 'Action: Check Audit Logs & trigger Backups'
      }
    ],
    tips: [
      { icon: '🗄️', title: 'Audit Trail', desc: 'Every administrative decision, ticket status transition, and role change is timestamped.' },
      { icon: '🔐', title: 'ID Verification', desc: 'Ensure student ID cards match student organization credentials before granting access.' },
      { icon: '💾', title: 'Automated Backups', desc: 'Execute database backups regularly from the Backup & Recovery console.' },
      { icon: '⚙️', title: 'Account Governance', desc: 'Suspend or reset accounts with full security compliance under RA 10173.' }
    ]
  }
};

const activeRoleData = computed(() => {
  return roleContent[selectedRoleTab.value] || roleContent.requestor;
});
</script>

<style scoped>
.animate-scale-up {
  animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.97) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
