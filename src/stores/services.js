import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useServicesStore = defineStore('services', () => {
  const selectedServices = ref({});
  const activeTicketIds = ref({});

  const FGMU_CATEGORIES = ['Structure & Finishes', 'Utilities & Mechanical', 'Janitorial', 'Hauling', 'Hauling Services'];
  const LEAU_CATEGORIES = ['Landscaping', 'Borrowing Services', 'Janitorial & Landscaping'];
  const SSU_CATEGORIES = ['Security Services'];

  const selectedList = computed(() => {
    return Object.entries(selectedServices.value)
      .filter(([_, isSelected]) => isSelected)
      .map(([key, _]) => {
        const parts = key.split('-');
        return { category: parts[0], service: parts[1] };
      });
  });

  const fgmuServices = computed(() => selectedList.value.filter(s => FGMU_CATEGORIES.includes(s.category)));
  const leauServices = computed(() => selectedList.value.filter(s => LEAU_CATEGORIES.includes(s.category)));
  const ssuServices = computed(() => selectedList.value.filter(s => SSU_CATEGORIES.includes(s.category)));

  const hasFGMU = computed(() => fgmuServices.value.length > 0);
  const hasLEAU = computed(() => leauServices.value.length > 0);
  const hasSSU = computed(() => ssuServices.value.length > 0);
  const hasIncidentReport = computed(() => ssuServices.value.some(s => s.service === 'Incident Report'));

  const setServices = (services) => {
    selectedServices.value = services;
  };

  const clearServices = () => {
    selectedServices.value = {};
  };

  return {
    selectedServices,
    activeTicketIds,
    selectedList,
    fgmuServices,
    leauServices,
    ssuServices,
    hasFGMU,
    hasLEAU,
    hasSSU,
    hasIncidentReport,
    setServices,
    clearServices
  };
}, {
  persist: true
});
