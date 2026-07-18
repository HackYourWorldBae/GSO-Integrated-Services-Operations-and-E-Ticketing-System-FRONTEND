import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBookingsStore = defineStore('bookings', () => {
  const pendingVehicleBooking = ref(null);

  const setPendingBooking = (bookingData) => {
    pendingVehicleBooking.value = bookingData;
  };

  const clearPendingBooking = () => {
    pendingVehicleBooking.value = null;
  };

  return {
    pendingVehicleBooking,
    setPendingBooking,
    clearPendingBooking
  };
}, {
  persist: true
});
