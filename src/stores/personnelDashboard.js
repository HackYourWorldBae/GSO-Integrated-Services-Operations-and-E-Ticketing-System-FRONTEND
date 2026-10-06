import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/api/client';

/**
 * Personnel Dashboard Store
 *
 * Dedicated store for responding field personnel to view only their assigned
 * tickets, ticket details, schedule, and team members assigned to each job.
 */
export const usePersonnelDashboardStore = defineStore('personnelDashboard', () => {
  const personnel       = ref(null);
  const assignments     = ref([]);
  const activeCount     = ref(0);
  const completedCount  = ref(0);
  const totalCount      = ref(0);
  const isLoading       = ref(false);
  const errorMessage    = ref(null);

  const activeAssignments = computed(() => {
    return assignments.value.filter(a => !a.completed_at);
  });

  const completedAssignments = computed(() => {
    return assignments.value.filter(a => !!a.completed_at);
  });

  const emergencyAssignments = computed(() => {
    return assignments.value.filter(a => !a.completed_at && a.is_emergency === 1);
  });

  const fetchDashboard = async (personnelId = null) => {
    isLoading.value = true;
    errorMessage.value = null;
    try {
      const url = personnelId 
        ? `personnel/my-dashboard?personnel_id=${encodeURIComponent(personnelId)}`
        : 'personnel/my-dashboard';
      const response = await api.get(url);
      const data = response.data?.data || {};

      personnel.value      = data.personnel || null;
      assignments.value    = Array.isArray(data.assignments) ? data.assignments : [];
      activeCount.value    = Number(data.active_count || 0);
      completedCount.value = Number(data.completed_count || 0);
      totalCount.value     = Number(data.total_count || assignments.value.length);
      return data;
    } catch (err) {
      console.error('Failed to load personnel dashboard:', err);
      errorMessage.value = err?.response?.data?.message || 'Unable to load assigned tickets. Please check your network connection.';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    personnel,
    assignments,
    activeCount,
    completedCount,
    totalCount,
    isLoading,
    errorMessage,
    activeAssignments,
    completedAssignments,
    emergencyAssignments,
    fetchDashboard,
  };
});
