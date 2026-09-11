<template>
  <MainLayout>
    <template #header-title>
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none">User Queues & Identity Verifications</h2>
          <span class="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider border border-amber-300">
            {{ filteredPendingUsers.length }} Pending
          </span>
        </div>
        <p class="text-xs font-medium text-slate-500 hidden sm:block mt-0.5">
          Review uploaded student and employee identification documents to verify identity and unlock requestor privileges
        </p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-6 animate-fade-in relative pb-12">
        <!-- Control Header & Filters -->
        <div class="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <!-- Search input -->
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name, email, or institutional ID..."
              class="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Role Filter & Refresh -->
          <div class="flex items-center gap-2.5 shrink-0">
            <select
              v-model="selectedRole"
              class="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors cursor-pointer"
            >
              <option value="">All Roles</option>
              <option value="student">Students</option>
              <option value="employee">Employees</option>
              <option value="worker">Workers</option>
            </select>

            <button
              @click="fetchPendingUsers"
              :disabled="loading"
              class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50"
              title="Refresh Queue"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{ 'animate-spin': loading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold">
            <svg class="animate-spin h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading pending verification queue...
          </div>
        </div>

        <!-- Pending Cards Grid -->
        <div v-else-if="filteredPendingUsers.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div 
            v-for="user in filteredPendingUsers" 
            :key="'queue-' + user.id"
            class="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-purple-200 transition-all flex flex-col justify-between"
          >
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border" :class="getRoleBadgeClass(user.role)">
                  {{ user.role }}
                </span>
                <span class="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                  Awaiting Verification
                </span>
              </div>

              <div class="flex items-start gap-3 pt-1">
                <div class="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0 border border-purple-200 text-base">
                  {{ user.first_name ? user.first_name.charAt(0).toUpperCase() : 'U' }}
                </div>
                <div class="min-w-0 flex-1">
                  <h4 class="text-sm font-black text-slate-900 truncate">{{ user.first_name }} {{ user.last_name }}</h4>
                  <p class="text-xs font-bold text-emerald-700 mt-0.5">
                    ID: {{ user.student_id_number || 'Not Stated' }}
                  </p>
                  <p class="text-[11px] text-slate-500 truncate">
                    {{ user.email || 'No email provided' }}
                  </p>
                  <p class="text-[11px] text-slate-500">
                    📞 {{ user.contact_number || 'No contact' }}
                  </p>
                </div>
              </div>

              <!-- Thumbnail Preview of ID Card -->
              <div 
                @click="openInspectModal(user)"
                class="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video relative group cursor-pointer"
              >
                <img 
                  :src="getIdCardUrl(user.id)" 
                  alt="Institutional ID Snapshot" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  @error="onImageError"
                />
                <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-1.5 backdrop-blur-xs">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Click to Inspect
                </div>
              </div>
            </div>

            <!-- Card Actions -->
            <div class="pt-4 border-t border-slate-100 mt-4 flex items-center gap-2">
              <button
                type="button"
                @click="openInspectModal(user)"
                class="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                Inspect & Verify
              </button>
              <button
                type="button"
                :disabled="isActionLoading"
                @click="openApproveModal(user)"
                class="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors border border-emerald-200 disabled:opacity-50 cursor-pointer"
                title="Quick Approve"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                type="button"
                :disabled="isActionLoading"
                @click="openRejectModal(user)"
                class="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors border border-rose-200 disabled:opacity-50 cursor-pointer"
                title="Quick Reject"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <div class="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 class="text-base font-black text-slate-900 mb-1">Queue Clear!</h4>
          <p class="text-xs text-slate-500 max-w-md mx-auto">
            There are no user accounts currently pending institutional identity verification. All accounts are up to date.
          </p>
        </div>
      </div>
    </template>

    <template #modal-overlay>
      <!-- Inspect ID Card & Verification Modal -->
      <div 
        v-if="isInspectModalOpen && inspectingUser" 
        class="fixed inset-0 z-[75] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-auto"
        @click.self="isInspectModalOpen = false"
      >
        <div 
          class="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-200 animate-scale-up max-h-[92vh] overflow-y-auto custom-scrollbar pointer-events-auto"
          @click.stop
        >
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-black uppercase tracking-wider mb-1">
                Institutional ID Inspection
              </div>
              <h3 class="text-lg font-black text-slate-900 tracking-tight">Verify Account Identity</h3>
            </div>
            <button 
              type="button"
              @click="isInspectModalOpen = false" 
              class="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- User Details Summary Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs">
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</p>
              <p class="font-bold text-slate-900 mt-0.5 truncate">{{ inspectingUser.first_name }} {{ inspectingUser.last_name }}</p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role</p>
              <p class="font-bold text-slate-900 mt-0.5 capitalize">{{ inspectingUser.role }}</p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID Number</p>
              <p class="font-bold text-emerald-700 mt-0.5">{{ inspectingUser.student_id_number || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact</p>
              <p class="font-bold text-slate-900 mt-0.5">{{ inspectingUser.contact_number || 'N/A' }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
              <p class="font-bold text-slate-900 mt-0.5 truncate">{{ inspectingUser.email || 'N/A' }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered At</p>
              <p class="font-bold text-slate-700 mt-0.5">{{ inspectingUser.created_at ? new Date(inspectingUser.created_at).toLocaleString() : 'N/A' }}</p>
            </div>
          </div>

          <!-- Uploaded Document View -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-500">Submitted Institutional ID Card</label>
              <a 
                :href="getIdCardUrl(inspectingUser.id)" 
                target="_blank" 
                class="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                <span>Open Full Size</span>
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            <div class="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-900/5 p-2 flex items-center justify-center min-h-[220px] max-h-[380px] overflow-hidden">
              <img 
                :src="getIdCardUrl(inspectingUser.id)" 
                alt="Institutional ID Preview" 
                class="max-h-[360px] w-auto max-w-full rounded-xl object-contain shadow-sm"
              />
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button 
              type="button"
              @click="isInspectModalOpen = false" 
              class="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button 
              type="button"
              :disabled="isActionLoading || inspectingUser.status === 'Rejected'"
              @click="openRejectModal(inspectingUser)" 
              class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{{ inspectingUser.status === 'Rejected' ? 'Already Rejected' : 'Reject / Invalidate' }}</span>
            </button>
            <button 
              type="button"
              :disabled="isActionLoading || isUserVerified(inspectingUser)"
              @click="openApproveModal(inspectingUser)" 
              class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg v-if="!isActionLoading" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ isUserVerified(inspectingUser) ? 'Already Verified' : 'Approve & Verify Identity' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Confirmation Modal for Approve and Reject -->
      <ConfirmModal
        :is-open="confirmModal.isOpen"
        :title="confirmModal.title"
        :message="confirmModal.message"
        :confirm-text="confirmModal.confirmText"
        :cancel-text="confirmModal.cancelText"
        :type="confirmModal.type"
        :is-loading="confirmModal.isLoading"
        @confirm="handleConfirmAction"
        @cancel="closeConfirmModal"
      >
        <div v-if="confirmModal.actionType === 'reject'" class="space-y-1.5 mt-2">
          <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Rejection Reason (Optional)
          </label>
          <textarea
            v-model="confirmModal.reason"
            rows="2"
            placeholder="Explain why verification was rejected..."
            class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
          ></textarea>
        </div>
      </ConfirmModal>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';
import api from '@/api/client';

const loading = ref(false);
const isActionLoading = ref(false);
const users = ref([]);
const searchQuery = ref('');
const selectedRole = ref('');

const inspectingUser = ref(null);
const isInspectModalOpen = ref(false);

const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1').replace(/\/+$/, '');

const getIdCardUrl = (userId) => {
  if (!userId) return '';
  return `${apiBase}/auth/id-card/${userId}`;
};

const onImageError = (e) => {
  e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200" fill="%23f1f5f9"><rect width="300" height="200" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%2394a3b8">No Document Attached</text></svg>';
};

const isUserVerified = (u) => {
  if (!u) return false;
  return Number(u.is_verified) === 1;
};

const fetchPendingUsers = async () => {
  loading.value = true;
  try {
    const res = await api.get('/superadmin/users', {
      params: { per_page: 100 }
    });
    const payload = res.data?.data || res.data;
    users.value = payload?.users || [];
  } catch (err) {
    console.error('Failed to fetch pending users queue:', err);
    toast.error('Failed to load verification queue.');
  } finally {
    loading.value = false;
  }
};

const pendingUsers = computed(() => {
  return users.value.filter(u => u.status !== 'Rejected' && !isUserVerified(u));
});

const filteredPendingUsers = computed(() => {
  return pendingUsers.value.filter(u => {
    if (selectedRole.value && u.role !== selectedRole.value) {
      return false;
    }
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      const name = `${u.first_name || ''} ${u.last_name || ''}`.toLowerCase();
      const email = (u.email || '').toLowerCase();
      const idNum = (u.student_id_number || '').toLowerCase();
      return name.includes(q) || email.includes(q) || idNum.includes(q);
    }
    return true;
  });
});

const openInspectModal = (user) => {
  inspectingUser.value = user;
  isInspectModalOpen.value = true;
};

// Confirmation modal state
const confirmModal = reactive({
  isOpen: false,
  title: '',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  type: 'danger',
  isLoading: false,
  actionType: '', // 'approve', 'reject'
  targetUser: null,
  reason: 'Identity document could not be verified.'
});

const openApproveModal = (user) => {
  if (!user) return;
  confirmModal.title = 'Approve User Sign-Up';
  confirmModal.message = `Are you sure you want to approve and verify identity for ${user.first_name} ${user.last_name} (${user.email})?\nThis will grant them active requester privileges.`;
  confirmModal.confirmText = 'Approve & Verify';
  confirmModal.cancelText = 'Cancel';
  confirmModal.type = 'success';
  confirmModal.isLoading = false;
  confirmModal.actionType = 'approve';
  confirmModal.targetUser = user;
  confirmModal.isOpen = true;
};

const openRejectModal = (user) => {
  if (!user) return;
  confirmModal.title = 'Reject User Sign-Up';
  confirmModal.message = `Are you sure you want to reject identity verification for ${user.first_name} ${user.last_name} (${user.email})?\nThe account will be marked as Rejected.`;
  confirmModal.confirmText = 'Reject Verification';
  confirmModal.cancelText = 'Cancel';
  confirmModal.type = 'danger';
  confirmModal.isLoading = false;
  confirmModal.actionType = 'reject';
  confirmModal.targetUser = user;
  confirmModal.reason = 'Identity document could not be verified.';
  confirmModal.isOpen = true;
};

const closeConfirmModal = () => {
  if (confirmModal.isLoading) return;
  confirmModal.isOpen = false;
  confirmModal.targetUser = null;
  confirmModal.actionType = '';
};

const handleConfirmAction = async () => {
  if (!confirmModal.targetUser) return;
  confirmModal.isLoading = true;
  const user = confirmModal.targetUser;
  try {
    if (confirmModal.actionType === 'approve') {
      const res = await api.patch(`/superadmin/users/${user.id}/verify`, {});
      toast.success(res.data?.message || 'User identity verified and approved!');
      isInspectModalOpen.value = false;
      closeConfirmModal();
      await fetchPendingUsers();
    } else if (confirmModal.actionType === 'reject') {
      const res = await api.patch(`/superadmin/users/${user.id}/reject`, {
        reason: confirmModal.reason || 'Identity document could not be verified.'
      });
      toast.info(res.data?.message || 'User verification has been rejected.');
      isInspectModalOpen.value = false;
      closeConfirmModal();
      await fetchPendingUsers();
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to complete action.');
  } finally {
    confirmModal.isLoading = false;
  }
};

const getRoleBadgeClass = (role) => {
  switch (role) {
    case 'superadmin':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'director':
      return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    case 'admin':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'dispatcher':
      return 'bg-sky-100 text-sky-800 border-sky-300';
    case 'worker':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'employee':
      return 'bg-teal-100 text-teal-800 border-teal-300';
    case 'student':
    default:
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  }
};

onMounted(() => {
  fetchPendingUsers();
});
</script>
