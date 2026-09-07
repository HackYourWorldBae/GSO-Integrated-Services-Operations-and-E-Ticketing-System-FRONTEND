<template>
  <div class="space-y-6">
    <!-- Top Action / Status Bar -->
    <div class="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shadow-sm shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h3 class="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">Access Role Control Matrix</h3>
          <p class="text-xs text-slate-500 font-medium">Dynamically enable or disable operational capabilities and module privileges across system roles</p>
        </div>
      </div>

      <div class="flex items-center gap-2.5 self-end md:self-auto shrink-0">
        <button
          @click="fetchMatrix"
          :disabled="isLoading"
          class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
          title="Reload Matrix"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" :class="isLoading ? 'animate-spin' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>

        <button
          @click="saveMatrix"
          :disabled="isSaving || !hasUnsavedChanges"
          class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all disabled:opacity-40 flex items-center gap-2"
        >
          <span v-if="isSaving" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span>Save Changes</span>
        </button>
      </div>
    </div>

    <!-- Unit Head Dispatcher Highlight Notice -->
    <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 flex items-start gap-3 shadow-xs">
      <div class="p-1 rounded-lg bg-amber-200/60 text-amber-800 shrink-0 mt-0.5">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div class="text-xs">
        <strong class="font-bold">Unit Head Operational Privileges:</strong>
        By university mandate, Unit Heads (<span class="font-bold text-amber-950 underline">Admin</span> role) inherit full Dispatcher capabilities (Worker Assignment, Queue Management, Job Completion, and Verification). You can toggle specific permissions below to expand or restrict capabilities.
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="p-12 text-center bg-white rounded-3xl border border-slate-200">
      <div class="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
      <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading Capability Matrix...</p>
    </div>

    <!-- Matrix Table -->
    <div v-else class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <th class="p-4 sm:p-5 w-80 sticky left-0 bg-slate-50/95 z-20 backdrop-blur-xs">System Feature / Capability</th>
              <th v-for="role in rolesList" :key="role.key" class="p-4 text-center" :class="role.key === 'admin' ? 'bg-amber-50/50' : ''">
                <div class="flex flex-col items-center">
                  <span :class="role.badgeClass" class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border shadow-2xs mb-1">
                    {{ role.label }}
                  </span>
                  <span class="text-[9px] font-medium text-slate-400 normal-case">{{ role.desc }}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <template v-for="(groupFeatures, category) in groupedFeatures" :key="category">
              <!-- Category Header Row -->
              <tr class="bg-slate-100/60 font-black text-slate-700 text-[11px] uppercase tracking-wider">
                <td :colspan="rolesList.length + 1" class="py-2.5 px-4 sm:px-5">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-purple-600"></span>
                    <span>{{ category }}</span>
                  </div>
                </td>
              </tr>

              <!-- Feature Row -->
              <tr v-for="feat in groupFeatures" :key="feat.key" class="hover:bg-slate-50/60 transition-colors">
                <td class="p-4 sm:p-5 sticky left-0 bg-white z-10 border-r border-slate-100">
                  <div class="font-bold text-slate-900 text-xs sm:text-sm leading-tight">{{ feat.name }}</div>
                  <div class="text-[11px] text-slate-400 font-medium leading-relaxed mt-0.5">{{ feat.description }}</div>
                  <div class="text-[9px] font-mono text-purple-600 font-semibold mt-1">{{ feat.key }}</div>
                </td>

                <td
                  v-for="role in rolesList"
                  :key="role.key"
                  class="p-4 text-center align-middle"
                  :class="role.key === 'admin' ? 'bg-amber-50/20' : ''"
                >
                  <!-- Superadmin is fixed -->
                  <div v-if="role.key === 'superadmin'" class="inline-flex items-center justify-center text-purple-600" title="Superadmin permissions are permanently active">
                    <span class="px-2 py-0.5 rounded-md bg-purple-100 border border-purple-200 text-purple-700 text-[10px] font-black">ALL</span>
                  </div>

                  <!-- Toggle switch for other roles -->
                  <label v-else class="inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      :checked="matrixState[role.key]?.[feat.key] ?? false"
                      @change="togglePermission(role.key, feat.key)"
                      class="sr-only peer"
                    />
                    <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import api from '@/api/client';
import { toast } from 'vue3-toastify';

const isLoading = ref(true);
const isSaving  = ref(false);
const hasUnsavedChanges = ref(false);

const features = ref([]);
const matrixState = reactive({});
const originalState = ref('');

const rolesList = [
  { key: 'superadmin', label: 'Superadmin', desc: 'Full Authority', badgeClass: 'bg-purple-100 text-purple-700 border-purple-200' },
  { key: 'admin',      label: 'Unit Head',  desc: 'Admin + Dispatch', badgeClass: 'bg-amber-100 text-amber-800 border-amber-300' },
  { key: 'dispatcher', label: 'Dispatcher', desc: 'Scheduling & Queue', badgeClass: 'bg-blue-100 text-blue-700 border-blue-200' },
  { key: 'director',   label: 'Director',   desc: 'Campus Oversight', badgeClass: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { key: 'worker',     label: 'Worker',     desc: 'Field Service', badgeClass: 'bg-orange-100 text-orange-700 border-orange-200' },
  { key: 'employee',   label: 'Employee',   desc: 'Department Requester', badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { key: 'student',    label: 'Student',    desc: 'Campus Requester', badgeClass: 'bg-teal-100 text-teal-700 border-teal-200' },
];

const groupedFeatures = computed(() => {
  const groups = {};
  features.value.forEach(feat => {
    const cat = feat.category || 'General';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(feat);
  });
  return groups;
});

const togglePermission = (role, featureKey) => {
  if (!matrixState[role]) {
    matrixState[role] = {};
  }
  matrixState[role][featureKey] = !matrixState[role][featureKey];
  hasUnsavedChanges.value = true;
};

const fetchMatrix = async () => {
  isLoading.value = true;
  try {
    const res = await api.get('/superadmin/rbac-matrix');
    if (res.data?.data) {
      const data = res.data.data;
      features.value = data.features || [];

      // Initialize state
      const newState = {};
      rolesList.forEach(r => { newState[r.key] = {}; });

      if (data.matrix && Array.isArray(data.matrix)) {
        data.matrix.forEach(item => {
          const fKey = item.key;
          if (item.roles) {
            Object.entries(item.roles).forEach(([rKey, val]) => {
              if (!newState[rKey]) newState[rKey] = {};
              newState[rKey][fKey] = Boolean(val);
            });
          }
        });
      }

      Object.assign(matrixState, newState);
      originalState.value = JSON.stringify(matrixState);
      hasUnsavedChanges.value = false;
    }
  } catch (err) {
    console.error('Failed to load RBAC matrix:', err);
    toast.error('Failed to load RBAC capability matrix.');
  } finally {
    isLoading.value = false;
  }
};

const saveMatrix = async () => {
  isSaving.value = true;
  try {
    const payload = [];
    Object.entries(matrixState).forEach(([role, perms]) => {
      Object.entries(perms).forEach(([featureKey, isEnabled]) => {
        payload.push({
          role,
          feature_key: featureKey,
          is_enabled: isEnabled ? 1 : 0
        });
      });
    });

    const res = await api.post('/superadmin/rbac-matrix', { matrix: payload });
    if (res.data?.status) {
      toast.success('Access Role Control Matrix saved successfully!');
      originalState.value = JSON.stringify(matrixState);
      hasUnsavedChanges.value = false;
    } else {
      toast.error(res.data?.message || 'Failed to save matrix.');
    }
  } catch (err) {
    console.error('Failed to save matrix:', err);
    toast.error('Error saving matrix changes.');
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  fetchMatrix();
});
</script>
