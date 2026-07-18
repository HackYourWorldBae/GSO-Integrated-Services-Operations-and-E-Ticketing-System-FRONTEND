import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useServicesStore = defineStore('services', () => {
  const selectedServices = ref({});
  const otherSpecifics = ref({});
  const activeTicketIds = ref({});

  const FGMU_CATEGORIES = ['Structure & Finishes', 'Utilities & Mechanical'];
  const LEAU_CATEGORIES = ['Janitorial & Landscaping'];
  const SSU_CATEGORIES = ['Security Services'];
  const TASU_CATEGORIES = ['Transportation Services'];

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
  const tasuServices = computed(() => selectedList.value.filter(s => TASU_CATEGORIES.includes(s.category)));
  const otherServices = computed(() => selectedList.value.filter(s => 
    !FGMU_CATEGORIES.includes(s.category) && 
    !LEAU_CATEGORIES.includes(s.category) &&
    !SSU_CATEGORIES.includes(s.category) &&
    !TASU_CATEGORIES.includes(s.category)
  ));

  const hasFGMU = computed(() => fgmuServices.value.length > 0);
  const hasLEAU = computed(() => leauServices.value.length > 0);
  const hasSSU = computed(() => ssuServices.value.length > 0);
  const hasVehiclePass = computed(() => ssuServices.value.some(s => s.service === 'Vehicle Pass Sticker'));
  const hasIncidentReport = computed(() => ssuServices.value.some(s => s.service === 'Incident Report'));
  const hasTasuVehicle = computed(() => tasuServices.value.some(s => s.service === 'Book A University Vehicle'));
  const hasOthers = computed(() => otherServices.value.length > 0);

  const setServices = (services) => {
    selectedServices.value = services;
  };

  const setOtherSpecifics = (specifics) => {
    otherSpecifics.value = specifics;
  };

  const clearServices = () => {
    selectedServices.value = {};
    otherSpecifics.value = {};
  };

  return {
    selectedServices,
    otherSpecifics,
    activeTicketIds,
    selectedList,
    fgmuServices,
    leauServices,
    ssuServices,
    tasuServices,
    otherServices,
    hasFGMU,
    hasLEAU,
    hasSSU,
    hasVehiclePass,
    hasIncidentReport,
    hasTasuVehicle,
    hasOthers,
    setServices,
    setOtherSpecifics,
    clearServices
  };
}, {
  persist: true
});
