<script setup>
import { ref, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'vue3-toastify';
import {
  getTicketCollaborations,
  requestCollaboration,
  respondCollaboration,
  assignCollaboratingPersonnel,
  completeCollaboration,
} from '@/api/collaborations';
import { fetchPersonnelByUnit } from '@/api/personnel';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  ticket: {
    type: Object,
    default: () => null,
  },
  // When true (requesting unit dispatching its own ticket), the
  // "Joint Units & Personnel" tab is hidden — the modal opens straight
  // into "Request Assistance" since there is nothing joint to manage yet.
  hideJointTab: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'updated']);

const authStore = useAuthStore();

// State
const isLoading = ref(false);
const isSubmitting = ref(false);
const collaborations = ref([]);
const activeTab = ref('active'); // 'active' | 'request'

// Form State: Request Collaboration
const requestForm = ref({
  collaborating_unit_ids: [],
  scope_of_work: '',
});

// Form State: Response (Accept / Decline)
const responseModal = ref({
  isOpen: false,
  collaborationId: null,
  action: 'accepted', // 'accepted' | 'declined'
  notes: '',
  isLoading: false,
});

// Form State: Assign Shared Personnel
const assignForm = ref({
  collaborationId: null,
  personnel_id: '',
  implementation_date: new Date().toISOString().split('T')[0],
  task_notes: '',
});
const myUnitPersonnel = ref([]);
const isFetchingPersonnel = ref(false);

// Unit reference
const UNIT_MAP = {
  1: { code: 'FGMU', name: 'Facilities & Grounds Management', color: 'amber' },
  2: { code: 'LEAU', name: 'Landscaping & Environmental Aesthetics', color: 'emerald' },
  3: { code: 'SSU', name: 'Security Services Unit', color: 'rose' },
};

const currentUnitId = computed(() => {
  const u = authStore.user;
  if (!u) return 1;
  if (u.unit_id) return Number(u.unit_id);
  const code = (u.unit_code || '').toUpperCase();
  if (code === 'LEAU') return 2;
  if (code === 'SSU') return 3;
  return 1;
});

const ticketPrimaryUnitId = computed(() => {
  if (!props.ticket) return 1;
  if (props.ticket.unit_id) return Number(props.ticket.unit_id);
  const idStr = String(props.ticket.id || '');
  if (idStr.startsWith('LEAU')) return 2;
  if (idStr.startsWith('SSU')) return 3;
  return 1;
});

const isPrimaryUnit = computed(() => {
  return currentUnitId.value === ticketPrimaryUnitId.value;
});

// Available target units for collaboration request (exclude ticket's primary unit)
const availableTargetUnits = computed(() => {
  const units = [
    {
      id: 1,
      code: 'FGMU',
      shortName: 'Facilities & Grounds',
      name: 'Facilities & Grounds Management (FGMU)',
      desc: 'Electrical, carpentry, plumbing, painting, masonry, and infrastructure repairs',
    },
    {
      id: 2,
      code: 'LEAU',
      shortName: 'Landscaping & Aesthetics',
      name: 'Landscaping & Aesthetics (LEAU)',
      desc: 'Tree trimming, landscaping, grounds clearing, and vegetative maintenance',
    },
    {
      id: 3,
      code: 'SSU',
      shortName: 'Security Services',
      name: 'Security Services (SSU)',
      desc: 'Perimeter safety, traffic/crowd management, security escorts, and logistics',
    },
  ];
  return units.filter(u => u.id !== ticketPrimaryUnitId.value);
});

const isUnitRequested = (unitId) => {
  return collaborations.value.some(
    (c) => Number(c.collaborating_unit_id) === Number(unitId) && ['pending', 'accepted'].includes(c.status)
  );
};

const getExistingStatusBadge = (unitId) => {
  const collab = collaborations.value.find(
    (c) => Number(c.collaborating_unit_id) === Number(unitId) && ['pending', 'accepted'].includes(c.status)
  );
  if (!collab) return { label: '', cls: '' };
  if (collab.status === 'accepted') {
    return { label: 'Active Collaboration', cls: 'bg-emerald-100 text-emerald-800 border border-emerald-300' };
  }
  return { label: 'Pending Request', cls: 'bg-amber-100 text-amber-800 border border-amber-300' };
};

// Fetch collaborations for the selected ticket
const normalizeCollaboration = (collab, assignments = []) => {
  const scope = collab.scope_of_work || collab.reason || '';
  const notes = collab.response_notes ?? collab.collaboration_notes ?? collab.notes ?? '';
  // Backend returns ticket-level assignments separately; attribute workers whose
  // home unit matches the collaborating unit (plus explicit personnel if present).
  const nested = Array.isArray(collab.personnel) ? collab.personnel : [];
  const fromAssignments = Array.isArray(assignments)
    ? assignments
        .filter((a) => Number(a.worker_unit_id) === Number(collab.collaborating_unit_id))
        .map((a) => ({
          id: a.personnel_id ?? a.id,
          name: a.worker_name || a.name || 'Shared Worker',
          specialty: a.worker_specialty || a.specialty || 'Worker',
          unit_code: a.worker_unit_code || a.unit_code || 'Shared',
        }))
    : [];
  const merged = [...nested];
  for (const p of fromAssignments) {
    if (!merged.some((m) => String(m.id) === String(p.id))) merged.push(p);
  }
  return {
    ...collab,
    scope_of_work: scope,
    reason: collab.reason || scope,
    response_notes: notes,
    collaboration_notes: notes,
    personnel: merged.length > 0 ? merged : nested,
  };
};

const loadCollaborations = async () => {
  if (!props.ticket?.id) return;
  isLoading.value = true;
  try {
    const res = await getTicketCollaborations(props.ticket.id);
    const payload = res.data?.data;
    const rawList = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.collaborations)
        ? payload.collaborations
        : Array.isArray(payload?.data)
          ? payload.data
          : [];
    const assignments = Array.isArray(payload?.assignments) ? payload.assignments : [];
    collaborations.value = rawList.map((c) => normalizeCollaboration(c, assignments));
  } catch (err) {
    console.error('Failed to load collaborations:', err);
    toast.error('Unable to fetch cross-unit collaborations.');
  } finally {
    isLoading.value = false;
  }
};

// Fetch personnel roster for the user's unit (to assign shared workers)
const loadMyUnitPersonnel = async () => {
  const unitCode = UNIT_MAP[currentUnitId.value]?.code || 'FGMU';
  isFetchingPersonnel.value = true;
  try {
    const res = await fetchPersonnelByUnit(unitCode);
    myUnitPersonnel.value = res.data?.data || [];
  } catch (err) {
    console.error('Failed to load unit personnel:', err);
  } finally {
    isFetchingPersonnel.value = false;
  }
};

watch(
  () => props.hideJointTab,
  (hidden) => {
    if (hidden && props.isOpen) activeTab.value = 'request';
  }
);

watch(
  () => props.isOpen,
  (open) => {
    if (open && props.ticket) {
      activeTab.value = props.hideJointTab ? 'request' : 'active';
      requestForm.value = {
        collaborating_unit_ids: [],
        scope_of_work: '',
      };
      assignForm.value = {
        collaborationId: null,
        personnel_id: '',
        implementation_date: new Date().toISOString().split('T')[0],
        task_notes: '',
      };
      loadCollaborations();
      loadMyUnitPersonnel();
    }
  }
);

// Submit Collaboration Request
const handleSendRequest = async () => {
  if (!requestForm.value.collaborating_unit_ids || requestForm.value.collaborating_unit_ids.length === 0) {
    toast.error('Please select at least one target GSO sub-unit.');
    return;
  }
  if (!requestForm.value.scope_of_work.trim()) {
    toast.error('Please describe the required inter-unit assistance and scope of work.');
    return;
  }

  isSubmitting.value = true;
  try {
    const scope = requestForm.value.scope_of_work.trim();
    const targetUnitIds = [...requestForm.value.collaborating_unit_ids];

    const results = await Promise.allSettled(
      targetUnitIds.map((unitId) =>
        requestCollaboration({
          ticket_id: props.ticket.id,
          collaborating_unit_id: unitId,
          reason: scope,
          scope_of_work: scope,
        })
      )
    );

    const fulfilled = results.filter((r) => r.status === 'fulfilled');
    const rejected = results.filter((r) => r.status === 'rejected');

    if (fulfilled.length > 0) {
      toast.success(
        fulfilled.length === 1
          ? 'Collaboration request dispatched successfully!'
          : `Collaboration requests dispatched to ${fulfilled.length} GSO sub-units successfully!`
      );
      requestForm.value.collaborating_unit_ids = [];
      requestForm.value.scope_of_work = '';
      await loadCollaborations();
      emit('updated');
      if (props.hideJointTab) {
        emit('close');
      } else {
        activeTab.value = 'active';
      }
    }

    if (rejected.length > 0) {
      const firstError = rejected[0].reason?.response?.data?.message || 'Failed to dispatch collaboration request.';
      toast.error(firstError);
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to submit collaboration request.');
  } finally {
    isSubmitting.value = false;
  }
};

// Open Respond Modal (Accept or Decline)
const openRespondModal = (collab, action) => {
  responseModal.value = {
    isOpen: true,
    collaborationId: collab.id,
    action,
    notes: '',
    isLoading: false,
  };
};

// Submit Respond Action
const handleRespondAction = async () => {
  responseModal.value.isLoading = true;
  try {
    await respondCollaboration(responseModal.value.collaborationId, {
      action: responseModal.value.action,
      response_status: responseModal.value.action,
      response_notes: responseModal.value.notes.trim(),
      notes: responseModal.value.notes.trim(),
    });
    toast.success(
      responseModal.value.action === 'accepted'
        ? 'Collaboration accepted! You can now assign personnel.'
        : 'Collaboration declined.'
    );
    responseModal.value.isOpen = false;
    await loadCollaborations();
    emit('updated');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to update collaboration.');
  } finally {
    responseModal.value.isLoading = false;
  }
};

// Open Shared Worker Assignment for a Collaboration
const openAssignPersonnel = (collab) => {
  assignForm.value.collaborationId = collab.id;
  assignForm.value.personnel_id = '';
  assignForm.value.task_notes = '';
};

// Submit Shared Worker Assignment
const handleAssignSharedPersonnel = async () => {
  if (!assignForm.value.personnel_id) {
    toast.error('Please select a worker from your unit roster.');
    return;
  }

  isSubmitting.value = true;
  try {
    await assignCollaboratingPersonnel(assignForm.value.collaborationId, {
      personnel_id: assignForm.value.personnel_id,
      implementation_date: assignForm.value.implementation_date,
      task_notes: assignForm.value.task_notes.trim(),
    });
    toast.success('Shared personnel dispatched successfully to joint ticket!');
    assignForm.value.collaborationId = null;
    await loadCollaborations();
    emit('updated');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to assign personnel.');
  } finally {
    isSubmitting.value = false;
  }
};

// Complete Collaboration
const handleCompleteCollaboration = async (collab) => {
  const confirmComplete = window.confirm(
    'Are you sure you want to mark your unit\'s participation in this ticket as completed?'
  );
  if (!confirmComplete) return;

  isSubmitting.value = true;
  try {
    await completeCollaboration(collab.id, {
      notes: 'Completed cross-unit scope of work.',
      completion_notes: 'Completed cross-unit scope of work.',
    });
    toast.success('Collaboration marked as completed!');
    await loadCollaborations();
    emit('updated');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to complete collaboration.');
  } finally {
    isSubmitting.value = false;
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'accepted':
      return { label: 'Active Collaboration', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 'pending':
      return { label: 'Awaiting Response', class: 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' };
    case 'declined':
      return { label: 'Declined', class: 'bg-rose-50 text-rose-700 border-rose-200' };
    case 'completed':
      return { label: 'Completed', class: 'bg-blue-50 text-blue-700 border-blue-200' };
    default:
      return { label: status, class: 'bg-slate-100 text-slate-700 border-slate-200' };
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 pointer-events-auto overflow-y-auto"
      >
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
          @click="!isSubmitting && emit('close')"
        ></div>

        <!-- Modal Card -->
        <div
          class="relative z-10 bg-white rounded-3xl sm:rounded-[2rem] shadow-2xl border border-slate-200 w-full max-w-3xl p-5 sm:p-7 my-auto text-left animate-scale-up max-h-[calc(100dvh-2rem)] sm:max-h-[88vh] flex flex-col overflow-hidden"
          @click.stop
        >
        <!-- Modal Top Bar -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-base sm:text-lg font-black text-slate-900 leading-tight truncate">
                  Cross-Unit Collaboration Center
                </h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-black font-mono bg-indigo-50 text-indigo-700 border border-indigo-200">
                  #{{ ticket?.id }}
                </span>
              </div>
              <p class="text-xs text-slate-500 font-medium truncate mt-0.5">
                {{ ticket?.title || ticket?.type || 'Service Request' }}
              </p>
            </div>
          </div>

          <button
            type="button"
            :disabled="isSubmitting"
            @click="emit('close')"
            class="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Navigation Tabs (Joint tab hidden when requesting unit is dispatching) -->
        <div v-if="!hideJointTab || isPrimaryUnit" class="flex items-center gap-2 pt-4 pb-2 border-b border-slate-100 shrink-0">
          <button
            v-if="!hideJointTab"
            type="button"
            @click="activeTab = 'active'"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            :class="activeTab === 'active' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'"
          >
            <span>Joint Units &amp; Personnel</span>
            <span v-if="collaborations.length > 0" class="px-1.5 py-0.2 rounded-full text-[10px] font-black" :class="activeTab === 'active' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'">
              {{ collaborations.length }}
            </span>
          </button>

          <button
            v-if="isPrimaryUnit || hideJointTab"
            type="button"
            @click="activeTab = 'request'"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            :class="activeTab === 'request' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Request Assistance</span>
          </button>
        </div>

        <!-- Content Area -->
        <div class="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-4">
          <!-- ─── TAB 1: COLLABORATIONS & SHARED WORKERS (hidden when requesting unit is dispatching) ─── -->
          <div v-if="activeTab === 'active' && !hideJointTab" class="space-y-4">
            <div v-if="isLoading" class="py-12 text-center text-slate-400">
              <div class="inline-flex items-center gap-2 text-xs font-semibold">
                <svg class="animate-spin h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading collaboration records...
              </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="collaborations.length === 0" class="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6 space-y-3">
              <div class="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <h4 class="text-sm font-black text-slate-800">No Cross-Unit Collaborations Yet</h4>
                <p class="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  {{ isPrimaryUnit 
                    ? 'Does this service request require participation or manpower from other campus units? Invite FGMU, LEAU, or SSU to collaborate.'
                    : 'Your unit has not participated in this ticket yet.' }}
                </p>
              </div>
              <button
                v-if="isPrimaryUnit"
                type="button"
                @click="activeTab = 'request'"
                class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Request Unit Collaboration</span>
              </button>
            </div>

            <!-- List of Collaborations -->
            <div v-else class="space-y-4">
              <div
                v-for="collab in collaborations"
                :key="collab.id"
                class="p-4 sm:p-5 rounded-2xl border transition-all space-y-3.5 bg-slate-50/50"
                :class="collab.status === 'accepted' ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200'"
              >
                <!-- Collaboration Header Card -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="px-2.5 py-0.5 rounded-lg text-xs font-black bg-white border border-slate-200 text-slate-800 shadow-2xs">
                      {{ collab.collaborating_unit_name || UNIT_MAP[collab.collaborating_unit_id]?.name || 'Collaborating Unit' }}
                    </span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-black border" :class="getStatusBadge(collab.status).class">
                      {{ getStatusBadge(collab.status).label }}
                    </span>
                  </div>

                  <span class="text-[11px] text-slate-400 font-medium">
                    Requested on {{ collab.created_at ? new Date(collab.created_at).toLocaleDateString() : 'N/A' }}
                  </span>
                </div>

                <!-- Scope of Work / Assistance Details -->
                <div class="p-3 bg-white rounded-xl border border-slate-200/80 text-xs space-y-1">
                  <p class="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Required Scope of Work:</p>
                  <p class="text-slate-800 font-medium leading-relaxed">{{ collab.scope_of_work || collab.reason || 'No scope details provided.' }}</p>
                  <p v-if="collab.response_notes || collab.collaboration_notes" class="text-slate-500 italic text-[11px] pt-1 border-t border-slate-100">
                    Response notes: "{{ collab.response_notes || collab.collaboration_notes }}"
                  </p>
                </div>

                <!-- Action Controls for Collaborating Unit Head (Accept / Decline) -->
                <div
                  v-if="collab.status === 'pending' && currentUnitId === Number(collab.collaborating_unit_id)"
                  class="flex items-center gap-2 pt-1"
                >
                  <button
                    type="button"
                    @click="openRespondModal(collab, 'accepted')"
                    class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Accept &amp; Coordinate</span>
                  </button>

                  <button
                    type="button"
                    @click="openRespondModal(collab, 'declined')"
                    class="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer"
                  >
                    <span>Decline</span>
                  </button>
                </div>

                <!-- Active Collaboration: Shared Manpower Roster -->
                <div v-if="collab.status === 'accepted'" class="space-y-3 pt-2 border-t border-slate-200">
                  <div class="flex items-center justify-between">
                    <h5 class="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <svg class="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span>Assigned Shared Personnel</span>
                    </h5>

                    <!-- Add Worker Button (if user belongs to the collaborating unit) -->
                    <button
                      v-if="currentUnitId === Number(collab.collaborating_unit_id) && assignForm.collaborationId !== collab.id"
                      type="button"
                      @click="openAssignPersonnel(collab)"
                      class="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Dispatch Shared Worker</span>
                    </button>
                  </div>

                  <!-- Personnel Form (inline) -->
                  <div
                    v-if="assignForm.collaborationId === collab.id"
                    class="p-4 rounded-xl bg-white border border-indigo-200 shadow-xs space-y-3 animate-scale-up"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-bold text-indigo-900">Dispatch Worker from {{ UNIT_MAP[currentUnitId]?.code }}</span>
                      <button
                        type="button"
                        @click="assignForm.collaborationId = null"
                        class="text-xs text-slate-400 hover:text-slate-600"
                      >
                        ✕ Cancel
                      </button>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Personnel *</label>
                        <select
                          v-model="assignForm.personnel_id"
                          class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                          <option value="" disabled>Select personnel...</option>
                          <option
                            v-for="p in myUnitPersonnel"
                            :key="p.id"
                            :value="p.id"
                          >
                            {{ p.name }} ({{ p.specialty || 'Generalist' }})
                          </option>
                        </select>
                      </div>

                      <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Implementation Date *</label>
                        <input
                          type="date"
                          v-model="assignForm.implementation_date"
                          class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Task Assignment Notes</label>
                      <input
                        type="text"
                        v-model="assignForm.task_notes"
                        placeholder="e.g. Assist in clearing debris and tree branches"
                        class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div class="flex justify-end pt-1">
                      <button
                        type="button"
                        :disabled="isSubmitting"
                        @click="handleAssignSharedPersonnel"
                        class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        {{ isSubmitting ? 'Dispatching...' : 'Confirm Dispatch' }}
                      </button>
                    </div>
                  </div>

                  <!-- Personnel List -->
                  <div v-if="!collab.personnel || collab.personnel.length === 0" class="text-xs text-slate-400 italic py-1">
                    No shared personnel assigned yet.
                  </div>
                  <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div
                      v-for="p in collab.personnel"
                      :key="p.id"
                      class="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2"
                    >
                      <div class="flex items-center gap-2 min-w-0">
                        <div class="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-100">
                          {{ p.name ? p.name.charAt(0).toUpperCase() : 'W' }}
                        </div>
                        <div class="min-w-0">
                          <p class="text-xs font-bold text-slate-900 truncate">{{ p.name }}</p>
                          <p class="text-[10px] text-slate-500 truncate">{{ p.specialty || 'Worker' }} &bull; {{ p.unit_code || 'Shared' }}</p>
                        </div>
                      </div>
                      <span class="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        Dispatched
                      </span>
                    </div>
                  </div>

                  <!-- Complete Collaboration CTA -->
                  <div
                    v-if="currentUnitId === Number(collab.collaborating_unit_id)"
                    class="pt-2 flex justify-end"
                  >
                    <button
                      type="button"
                      :disabled="isSubmitting"
                      @click="handleCompleteCollaboration(collab)"
                      class="px-3 py-1.5 rounded-lg border border-indigo-300 bg-white hover:bg-indigo-50 text-indigo-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      ✓ Mark Unit Participation as Done
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ─── TAB 2: REQUEST COLLABORATION ─── -->
          <div v-else-if="activeTab === 'request'" class="space-y-4">
            <div class="space-y-3.5">
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Target GSO Sub-Unit <span class="text-rose-500">*</span>
                  <span class="text-slate-400 font-normal lowercase tracking-normal ml-1">(select one or both)</span>
                </label>

                <!-- Checkbox Selection -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label
                    v-for="unit in availableTargetUnits"
                    :key="unit.id"
                    class="relative flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer select-none"
                    :class="[
                      isUnitRequested(unit.id)
                        ? 'bg-slate-100/80 border-slate-200 opacity-65 cursor-not-allowed'
                        : requestForm.collaborating_unit_ids.includes(unit.id)
                          ? 'bg-indigo-50/90 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80 hover:border-slate-300'
                    ]"
                  >
                    <input
                      type="checkbox"
                      :value="unit.id"
                      v-model="requestForm.collaborating_unit_ids"
                      :disabled="isUnitRequested(unit.id)"
                      class="mt-0.5 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 disabled:opacity-50 cursor-pointer"
                    />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <span class="text-xs font-black text-slate-900">{{ unit.code }}</span>
                        <span class="text-[11px] font-semibold text-slate-600 truncate">{{ unit.shortName || unit.name }}</span>
                      </div>
                      <p class="text-[10px] text-slate-500 font-medium line-clamp-2 mt-0.5 leading-snug">
                        {{ unit.desc }}
                      </p>
                      <span
                        v-if="isUnitRequested(unit.id)"
                        class="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider"
                        :class="getExistingStatusBadge(unit.id).cls"
                      >
                        {{ getExistingStatusBadge(unit.id).label }}
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Inter-Unit Assistance Details &amp; Scope of Work <span class="text-rose-500">*</span>
                </label>
                <textarea
                  v-model="requestForm.scope_of_work"
                  rows="4"
                  required
                  placeholder="Provide the collaboration message and specific tasks requested from the target sub-unit(s) (e.g., 'Requesting LEAU tree-trimming team to prune branches obstructing service lines before FGMU electrical wiring repairs can proceed safely')..."
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 placeholder:text-slate-400"
                ></textarea>
              </div>

              <div class="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  @click="hideJointTab ? emit('close') : activeTab = 'active'"
                  class="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  :disabled="isSubmitting || requestForm.collaborating_unit_ids.length === 0 || !requestForm.scope_of_work.trim()"
                  @click="handleSendRequest"
                  class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  <span>
                    {{
                      isSubmitting
                        ? 'Dispatching...'
                        : requestForm.collaborating_unit_ids.length > 1
                          ? `Dispatch (${requestForm.collaborating_unit_ids.length} Sub-Units)`
                          : 'Dispatch Request'
                    }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</Teleport>

  <!-- Respond Modal (Accept or Decline) -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="responseModal.isOpen"
        class="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto pointer-events-auto"
        @click.self="!responseModal.isLoading && (responseModal.isOpen = false)"
      >
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-scale-up my-auto" @click.stop>
          <h4 class="text-base font-black text-slate-900">
            {{ responseModal.action === 'accepted' ? 'Accept Collaboration Request' : 'Decline Collaboration Request' }}
          </h4>
          <p class="text-xs text-slate-600">
            {{ responseModal.action === 'accepted' 
              ? 'Accepting this request commits your unit to coordinating manpower for this ticket.'
              : 'Please state the reason for declining this request.' }}
          </p>

          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
              Notes / Remarks (Optional)
            </label>
            <textarea
              v-model="responseModal.notes"
              rows="3"
              placeholder="Add any instructions or remarks for the primary unit..."
              class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
            ></textarea>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              :disabled="responseModal.isLoading"
              @click="responseModal.isOpen = false"
              class="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              :disabled="responseModal.isLoading"
              @click="handleRespondAction"
              :class="[
                'px-4 py-2 rounded-xl text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50',
                responseModal.action === 'accepted' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              ]"
            >
              {{ responseModal.isLoading ? 'Processing...' : (responseModal.action === 'accepted' ? 'Confirm Acceptance' : 'Confirm Decline') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
