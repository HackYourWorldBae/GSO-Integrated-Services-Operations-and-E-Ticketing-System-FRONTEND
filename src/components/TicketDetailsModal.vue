<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { fetchTicket } from '@/api/tickets';
import { isBorrowingService } from '@/utils/borrowing';
import BorrowingDetailsSection from '@/components/dispatch/BorrowingDetailsSection.vue';
import DocumentViewerModal from '@/components/DocumentViewerModal.vue';
import { handleAttachmentClick, downloadAttachmentDirectly, isDocxFile, isPdfFile, isImageFile } from '@/utils/attachmentHelper';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: Boolean,
    default: undefined,
  },
  ticket: {
    type: Object,
    default: null,
  },
  ticketId: {
    type: [String, Number],
    default: null,
  },
  highlightWorkerId: {
    type: [String, Number],
    default: null,
  },
  unitCode: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:isOpen', 'update:modelValue', 'close']);

const modalOpen = computed({
  get: () => (props.modelValue !== undefined ? props.modelValue : props.isOpen),
  set: (val) => {
    emit('update:isOpen', val);
    emit('update:modelValue', val);
    if (!val) emit('close');
  },
});

const detailedTicket = ref(null);
const loading = ref(false);
const fetchError = ref(null);
const showLogs = ref(false);

// Document Preview Modal State
const viewerModal = ref({
  isOpen: false,
  title: 'Document Preview',
  fileName: '',
  fileBlob: null,
});

const closeModal = () => {
  modalOpen.value = false;
};

// Keydown handler for Escape key
const handleKeyDown = (e) => {
  if (e.key === 'Escape' && modalOpen.value && !viewerModal.value.isOpen) {
    closeModal();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  document.body.style.overflow = '';
});

// Manage body scroll locking
watch(modalOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
    loadTicketDetails();
  } else {
    document.body.style.overflow = '';
    detailedTicket.value = null;
    fetchError.value = null;
    showLogs.value = false;
  }
});

const activeTicketId = computed(() => {
  return props.ticketId || props.ticket?.ticket_id || props.ticket?.id || null;
});

// Fetch full ticket details from server
const loadTicketDetails = async () => {
  const id = activeTicketId.value;
  if (!id) return;

  // Set initial state from props.ticket if available
  if (props.ticket) {
    detailedTicket.value = { ...props.ticket };
  }

  loading.value = true;
  fetchError.value = null;

  try {
    const res = await fetchTicket(id);
    const serverTicket = res.data?.data?.ticket || res.data?.data;
    if (serverTicket) {
      detailedTicket.value = {
        ...(detailedTicket.value || {}),
        ...serverTicket,
      };
    }
  } catch (err) {
    console.warn(`[TicketDetailsModal] Could not fetch detailed data for ticket #${id}:`, err);
    fetchError.value = 'Loaded cached ticket data. Server details could not be refreshed.';
  } finally {
    loading.value = false;
  }
};

// Normalized Ticket computed data
const displayTicket = computed(() => {
  const t = detailedTicket.value || props.ticket || {};
  const d = t.details || {};

  const id = t.ticket_id || t.id || activeTicketId.value || '—';
  const serviceType = t.service_type || t.service || t.task || t.project_title || 'Work Order';
  const description = t.description || t.request_description || d.description || 'No description provided.';

  // Requester profile
  const requesterName = t.requester_name || t.requester || t.user_name || (t.first_name ? `${t.first_name} ${t.last_name || ''}`.trim() : null) || 'University Client';
  const requesterEmail = t.email || t.requester_email || d.email || null;
  const requesterContact = t.contact_number || t.requester_contact || d.contact_number || d.contact_no || null;
  const requesterRole = t.requester_role || t.role || d.role || null;
  const requesterOrg = t.organization_name || t.college || d.organization_name || d.college || null;
  const studentId = t.student_id_number || d.student_id_number || null;

  // Location
  const building = t.college_building || t.location || d.college_building || d.location || 'Campus Facility';
  const room = t.office_room || d.office_room || null;

  // Schedule
  const scheduledDate = t.implementation_date || t.target_completion_date || d.implementation_date || null;
  const targetDate = t.target_completion_date || d.target_completion_date || null;
  const workingDays = t.working_days || d.working_days || null;
  const overtime = t.overtime_hours || d.overtime_hours || null;
  const submittedAt = t.created_at || t.submitted_at || null;

  // Flags & status
  const isEmergency = Boolean(t.is_emergency || t.priority === 'urgent' || t.priority === 'emergency');
  const isProject = Boolean(t.is_project || t.project_title);
  const projectTitle = t.project_title || d.project_title || null;
  const status = t.status || t.ticket_status || 'active';
  const statusLabel = t.status_label || (status ? String(status).replace(/_/g, ' ') : 'Active');

  // Notes
  const dispatcherNotes = t.dispatcher_notes || t.task_notes || d.dispatcher_notes || d.task_notes || null;
  const specialInstructions = t.special_instructions || d.special_instructions || null;

  // Assignments / Team
  const assignments = Array.isArray(t.assignments) && t.assignments.length > 0
    ? t.assignments
    : (Array.isArray(t.team) ? t.team : []);

  // Attachments
  const attachments = Array.isArray(t.attachments) ? t.attachments : [];

  // Logs
  const logs = Array.isArray(t.logs) ? t.logs : [];

  // Unit
  const unit = t.unit_code || t.unit_name || props.unitCode || (typeof id === 'string' && id.includes('FGMU') ? 'FGMU' : (typeof id === 'string' && id.includes('LEAU') ? 'LEAU' : (typeof id === 'string' && id.includes('SSU') ? 'SSU' : 'GSO')));

  return {
    ...t,
    id,
    ticket_id: id,
    service_type: serviceType,
    description,
    requesterName,
    requesterEmail,
    requesterContact,
    requesterRole,
    requesterOrg,
    studentId,
    building,
    room,
    scheduledDate,
    targetDate,
    workingDays,
    overtime,
    submittedAt,
    isEmergency,
    isProject,
    projectTitle,
    status,
    statusLabel,
    dispatcherNotes,
    specialInstructions,
    assignments,
    attachments,
    logs,
    unit,
  };
});

const isBorrowing = computed(() => isBorrowingService(displayTicket.value));

// Format date helper
const formatDate = (val) => {
  if (!val || val === 'N/A' || val === 'null' || val === 'undefined') return '—';
  const str = String(val).trim();
  if (str.length >= 10 && /^\d{4}-\d{2}-\d{2}/.test(str)) {
    const d = new Date(str.slice(0, 10) + 'T00:00:00');
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? str : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Avatar initials
const getInitials = (name) => {
  if (!name) return '??';
  const parts = String(name).trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Unit theme classes
const unitTheme = computed(() => {
  const u = String(displayTicket.value.unit || '').toUpperCase();
  if (u === 'FGMU') {
    return {
      badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      mono: 'bg-emerald-50 text-emerald-900 border-emerald-300',
      accent: 'emerald',
    };
  }
  if (u === 'LEAU') {
    return {
      badge: 'bg-teal-100 text-teal-900 border-teal-300',
      mono: 'bg-teal-50 text-teal-900 border-teal-300',
      accent: 'teal',
    };
  }
  if (u === 'SSU') {
    return {
      badge: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      mono: 'bg-indigo-50 text-indigo-900 border-indigo-300',
      accent: 'indigo',
    };
  }
  return {
    badge: 'bg-slate-100 text-slate-800 border-slate-300',
    mono: 'bg-slate-50 text-slate-800 border-slate-300',
    accent: 'slate',
  };
});

// Status badge classes
const statusBadgeClass = computed(() => {
  const s = String(displayTicket.value.status || '').toLowerCase();
  if (s === 'resolved' || s === 'completed' || displayTicket.value.completed_at) {
    return 'bg-sky-50 text-sky-700 border-sky-200';
  }
  if (s === 'in_progress' || s === 'working') {
    return 'bg-amber-50 text-amber-700 border-amber-200';
  }
  if (s === 'approved' || s === 'active') {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
  if (s === 'under_investigation') {
    return 'bg-purple-50 text-purple-700 border-purple-200';
  }
  if (s === 'cancelled' || s === 'declined' || s === 'rejected') {
    return 'bg-rose-50 text-rose-700 border-rose-200';
  }
  return 'bg-slate-100 text-slate-700 border-slate-200';
});

// Worker info helpers
const getWorkerId = (w) => w.personnel_id || w.id || w.worker_id;
const getWorkerName = (w) => w.personnel_name || w.name || w.assigned_to_name || 'Staff Member';
const getWorkerSpecialty = (w) => w.specialty || w.profession || w.role || 'Personnel';

const isWorkerHighlighted = (w) => {
  if (!props.highlightWorkerId) return false;
  return String(getWorkerId(w)) === String(props.highlightWorkerId);
};

// Attachment handling
const openAttachment = async (att) => {
  await handleAttachmentClick(att, (blob, attachment) => {
    viewerModal.value.fileBlob = blob;
    viewerModal.value.fileName = attachment.file_name || 'attachment';
    viewerModal.value.title = attachment.file_name || 'Document Preview';
    viewerModal.value.isOpen = true;
  });
};

const downloadDoc = async (att) => {
  await downloadAttachmentDirectly(att);
};
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modalOpen"
        class="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto pointer-events-auto"
        @click.self="closeModal"
      >
        <div
          class="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 animate-scale-up flex flex-col max-h-[calc(100dvh-2rem)] sm:max-h-[88vh] overflow-hidden my-auto pointer-events-auto"
        >
          <!-- Fixed Modal Header -->
          <div class="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 bg-white">
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <!-- Ticket ID Badge -->
                <span
                  class="font-mono text-xs sm:text-sm font-black px-3 py-1 rounded-xl border shadow-2xs tabular-nums"
                  :class="unitTheme.mono"
                >
                  #{{ displayTicket.id }}
                </span>

                <!-- Unit Badge -->
                <span
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-2xs"
                  :class="unitTheme.badge"
                >
                  {{ displayTicket.unit }}
                </span>

                <!-- Status Badge -->
                <span
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border capitalize shadow-2xs"
                  :class="statusBadgeClass"
                >
                  {{ displayTicket.statusLabel }}
                </span>

                <!-- Urgent / Emergency Badge -->
                <span
                  v-if="displayTicket.isEmergency"
                  class="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 shadow-2xs"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Urgent
                </span>

                <!-- Project Badge -->
                <span
                  v-if="displayTicket.isProject && displayTicket.projectTitle"
                  class="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200 text-[10px] font-black uppercase tracking-wider truncate max-w-xs shadow-2xs"
                >
                  📁 {{ displayTicket.projectTitle }}
                </span>

                <!-- Loading Spinner if refreshing server data -->
                <span v-if="loading" class="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400">
                  <svg class="animate-spin h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Syncing...</span>
                </span>
              </div>

              <!-- Ticket Service / Work Title -->
              <h3 class="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
                {{ displayTicket.service_type }}
              </h3>

              <p class="text-xs text-slate-500 font-medium mt-0.5">
                <template v-if="displayTicket.scheduledDate">
                  Scheduled for execution on <strong class="text-slate-700">{{ formatDate(displayTicket.scheduledDate) }}</strong>
                </template>
                <template v-else-if="displayTicket.submittedAt">
                  Submitted on <strong class="text-slate-700">{{ formatDate(displayTicket.submittedAt) }}</strong>
                </template>
                <template v-else>
                  Comprehensive work order overview & personnel assignments
                </template>
              </p>
            </div>

            <!-- Close Modal Button -->
            <button
              type="button"
              @click="closeModal"
              class="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-slate-100 text-slate-400 hover:text-slate-800 hover:bg-slate-200 border border-slate-200 flex items-center justify-center transition-colors cursor-pointer shrink-0 touch-manipulation shadow-2xs"
              title="Close modal (Esc)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Scrollable Modal Body -->
          <div class="p-5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 custom-scrollbar text-xs flex-1">
            
            <!-- Notice if server refresh was offline -->
            <div v-if="fetchError" class="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2">
              <span class="flex items-center gap-1.5 font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ fetchError }}
              </span>
              <button
                type="button"
                @click="loadTicketDetails"
                class="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-800 text-[11px] font-bold hover:bg-amber-100 transition-colors cursor-pointer shrink-0"
              >
                Retry
              </button>
            </div>

            <!-- Requester & Location Cards Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <!-- Requester Profile -->
              <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  {{ isBorrowing ? 'Borrower Profile' : 'Requester Profile' }}
                </span>
                
                <div class="flex items-start justify-between gap-2">
                  <p class="text-base font-black text-slate-900 leading-tight">
                    {{ displayTicket.requesterName }}
                  </p>
                  <span
                    v-if="displayTicket.requesterRole"
                    class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-200 text-slate-700 border border-slate-300 shrink-0"
                  >
                    {{ displayTicket.requesterRole }}
                  </span>
                </div>

                <div v-if="displayTicket.requesterOrg" class="text-xs text-slate-600 font-semibold truncate">
                  {{ displayTicket.requesterOrg }}
                </div>

                <div v-if="displayTicket.studentId" class="text-[11px] text-slate-500 font-mono">
                  ID: <strong class="text-slate-800">{{ displayTicket.studentId }}</strong>
                </div>

                <div class="pt-1 border-t border-slate-200/60 space-y-1.5">
                  <!-- Contact Phone -->
                  <a
                    v-if="displayTicket.requesterContact && displayTicket.requesterContact !== 'N/A'"
                    :href="`tel:${displayTicket.requesterContact}`"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors text-emerald-800 text-xs font-bold group"
                  >
                    <svg class="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <span class="font-mono">{{ displayTicket.requesterContact }}</span>
                  </a>

                  <!-- Email -->
                  <p v-if="displayTicket.requesterEmail" class="text-[11px] text-slate-600 font-medium flex items-center gap-1.5 truncate">
                    <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <a :href="`mailto:${displayTicket.requesterEmail}`" class="hover:underline truncate text-slate-700 font-semibold">
                      {{ displayTicket.requesterEmail }}
                    </a>
                  </p>
                </div>
              </div>

              <!-- Designated Location -->
              <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Designated Location</span>
                <p class="text-base font-black text-slate-900 leading-tight">
                  {{ displayTicket.building }}
                </p>
                <p class="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                  <span>Campus Facility / Building</span>
                </p>

                <div v-if="displayTicket.room && displayTicket.room !== 'N/A'" class="pt-1">
                  <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-slate-800">
                    <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 20V6a2 2 0 00-2-2H8a2 2 0 00-2 2v14 M2 20h20 M14 12v.01" />
                    </svg>
                    <span class="text-xs font-bold text-slate-500">Room / Office:</span>
                    <span class="text-xs font-black text-slate-900">{{ displayTicket.room }}</span>
                  </div>
                </div>
                <p v-else class="text-[11px] text-slate-400 font-medium italic pt-1">
                  No specific room designated
                </p>
              </div>
            </div>

            <!-- Borrowing Request Particulars (if borrowing service) -->
            <BorrowingDetailsSection
              v-if="isBorrowing"
              :ticket="displayTicket"
            />

            <!-- Service & Job Particulars (for standard repair/maintenance/security work) -->
            <div v-else class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div class="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Nature of Work &amp; Description</span>
                <span class="text-[11px] font-bold text-slate-500">{{ displayTicket.service_type }}</span>
              </div>

              <!-- Full description -->
              <div>
                <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Statement of Request</label>
                <p class="text-xs text-slate-700 leading-relaxed font-medium bg-white p-3.5 rounded-xl border border-slate-200 whitespace-pre-line">
                  {{ displayTicket.description }}
                </p>
              </div>

              <!-- Dispatcher Direct Instructions / Task Notes -->
              <div v-if="displayTicket.dispatcherNotes" class="p-3.5 rounded-xl bg-amber-50/90 border border-amber-300 text-xs text-amber-950 space-y-1">
                <span class="text-[10px] font-black uppercase tracking-wider text-amber-900 block flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Dispatcher Instructions &amp; Task Notes
                </span>
                <p class="font-bold leading-relaxed whitespace-pre-line">{{ displayTicket.dispatcherNotes }}</p>
              </div>

              <!-- Special Instructions -->
              <div v-if="displayTicket.specialInstructions" class="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 space-y-1">
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Special Instructions</span>
                <p class="font-medium leading-relaxed whitespace-pre-line">{{ displayTicket.specialInstructions }}</p>
              </div>
            </div>

            <!-- Operational Schedule & Timing Grid -->
            <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Operational Schedule &amp; Timing</span>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div class="p-3 rounded-xl bg-white border border-slate-200">
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Scheduled</span>
                  <span class="font-black text-slate-900 text-xs sm:text-sm mt-0.5 block">
                    {{ formatDate(displayTicket.scheduledDate) }}
                  </span>
                </div>

                <div class="p-3 rounded-xl bg-white border border-slate-200">
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Date</span>
                  <span class="font-black text-slate-900 text-xs sm:text-sm mt-0.5 block">
                    {{ formatDate(displayTicket.targetDate) }}
                  </span>
                </div>

                <div class="p-3 rounded-xl bg-white border border-slate-200">
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration</span>
                  <span class="font-black text-slate-900 text-xs sm:text-sm mt-0.5 block">
                    {{ displayTicket.workingDays ? `${displayTicket.workingDays} working days` : 'Standard' }}
                  </span>
                </div>

                <div class="p-3 rounded-xl bg-white border border-slate-200">
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Overtime</span>
                  <span class="font-black text-slate-900 text-xs sm:text-sm mt-0.5 block" :class="displayTicket.overtime ? 'text-amber-600' : 'text-slate-700'">
                    {{ displayTicket.overtime ? `${displayTicket.overtime} hrs` : 'None' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Assigned Workforce Team Section -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Assigned Personnel Crew ({{ displayTicket.assignments.length }} Staff)
                </h4>
                <span class="text-[11px] font-bold text-slate-400">Unit: {{ displayTicket.unit }}</span>
              </div>

              <!-- List of assigned workers -->
              <div v-if="displayTicket.assignments.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div
                  v-for="(w, wIdx) in displayTicket.assignments"
                  :key="w.id || w.personnel_id || wIdx"
                  class="p-3 rounded-2xl border transition-all flex items-start gap-3 shadow-2xs"
                  :class="[
                    isWorkerHighlighted(w)
                      ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/30'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  ]"
                >
                  <!-- Worker Avatar -->
                  <div
                    class="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 border"
                    :class="[
                      isWorkerHighlighted(w)
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    ]"
                  >
                    {{ getInitials(getWorkerName(w)) }}
                  </div>

                  <!-- Worker Info -->
                  <div class="min-w-0 flex-1 leading-tight text-xs space-y-1">
                    <div class="flex items-center justify-between gap-1 flex-wrap">
                      <span class="font-black text-slate-900 truncate">
                        {{ getWorkerName(w) }}
                      </span>
                      <span
                        v-if="isWorkerHighlighted(w)"
                        class="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-600 text-white"
                      >
                        Viewing From Roster
                      </span>
                    </div>

                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 truncate">
                        {{ getWorkerSpecialty(w) }}
                      </span>
                      <span v-if="w.queue_order" class="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        {{ w.queue_order === 1 ? 'Active Job' : `Queue #${w.queue_order}` }}
                      </span>
                    </div>

                    <div v-if="w.contact_number || w.contact" class="text-[11px] text-slate-500 font-medium pt-0.5">
                      📞 {{ w.contact_number || w.contact }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400 font-bold">
                No personnel records attached to this ticket.
              </div>
            </div>

            <!-- Supporting Attachments Section (if any) -->
            <div v-if="displayTicket.attachments && displayTicket.attachments.length > 0" class="space-y-2 pt-2">
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Supporting Attachments ({{ displayTicket.attachments.length }})
              </span>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div
                  v-for="att in displayTicket.attachments"
                  :key="att.id"
                  class="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors group"
                >
                  <div
                    class="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                    @click="openAttachment(att)"
                    title="Click to preview / view document"
                  >
                    <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-700 transition-colors">
                        {{ att.file_name || 'Attached file' }}
                      </p>
                      <span class="text-[10px] text-slate-400 font-semibold uppercase">
                        {{ isDocxFile(att.file_name, att.file_type) ? 'Word Doc' : (isPdfFile(att.file_name, att.file_type) ? 'PDF' : (isImageFile(att.file_name, att.file_type) ? 'Image' : 'File')) }}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    @click.stop="downloadDoc(att)"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer shrink-0"
                    title="Download file directly"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Expandable Activity Logs / Audit Trail -->
            <div v-if="displayTicket.logs && displayTicket.logs.length > 0" class="pt-2 border-t border-slate-100">
              <button
                type="button"
                @click="showLogs = !showLogs"
                class="w-full flex items-center justify-between py-2 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <span>Activity Audit Trail ({{ displayTicket.logs.length }} events)</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 transition-transform duration-200"
                  :class="{ 'rotate-180': showLogs }"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div v-if="showLogs" class="mt-2 space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                <div
                  v-for="log in displayTicket.logs"
                  :key="log.id"
                  class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] space-y-0.5"
                >
                  <div class="flex items-center justify-between text-slate-400">
                    <span class="font-black uppercase tracking-wider text-slate-700">{{ log.action }}</span>
                    <span>{{ formatDate(log.created_at) }}</span>
                  </div>
                  <p class="text-slate-600 font-medium">{{ log.details || log.comment || 'Action recorded' }}</p>
                </div>
              </div>
            </div>

          </div>

          <!-- Fixed Modal Footer -->
          <div class="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3 shrink-0">
            <span class="text-[11px] font-bold text-slate-400">
              GSO Work Order Details View
            </span>
            <button
              type="button"
              @click="closeModal"
              class="px-5 py-2 min-h-[38px] rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-black transition-colors cursor-pointer touch-manipulation shadow-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Nested Document & Attachment Viewer Modal -->
    <DocumentViewerModal
      v-model:isOpen="viewerModal.isOpen"
      :title="viewerModal.title"
      :fileName="viewerModal.fileName"
      :fileBlob="viewerModal.fileBlob"
    />
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
