import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useTasuVehiclesStore = defineStore('tasuVehicles', () => {
  const vehicles = ref([
  ]);

  // Initial rich bookings spanning July 2026 (current week July 13-19, and the full month of July 2026),
  // as well as earlier dates in March/April.
  const bookings = ref([
  ]);

  const toggleVehicleStatus = (vehicleId) => {
    const v = vehicles.value.find(item => item.id === vehicleId);
    if (v) {
      v.status = v.status === 'Available' ? 'Under Maintenance' : 'Available';
    }
  };

  const updateVehicleStatus = (vehicleId, newStatus) => {
    const v = vehicles.value.find(item => item.id === vehicleId);
    if (v) {
      v.status = newStatus;
    }
  };

  const addVehicle = (vehicleData) => {
    const newId = vehicles.value.length > 0 ? Math.max(...vehicles.value.map(v => v.id)) + 1 : 1;
    vehicles.value.push({
      id: newId,
      status: 'Available',
      ...vehicleData
    });
  };

  const addBooking = (bookingData) => {
    const newId = 'dsp-' + (Date.now().toString().slice(-5));
    const newBooking = {
      id: newId,
      status: 'Scheduled',
      passengers: 1,
      notes: '',
      ...bookingData
    };
    bookings.value.push(newBooking);
    return newBooking;
  };

  const updateBooking = (id, updatedData) => {
    const idx = bookings.value.findIndex(b => b.id === id);
    if (idx !== -1) {
      bookings.value[idx] = { ...bookings.value[idx], ...updatedData };
    }
  };

  const deleteBooking = (id) => {
    bookings.value = bookings.value.filter(b => b.id !== id);
  };

  const getBookingsForVehicleAndDate = (vehicleId, dateStr) => {
    return bookings.value.filter(b => b.vehicleId === vehicleId && b.date === dateStr);
  };

  const getBookingsForDateRange = (startDateStr, endDateStr) => {
    return bookings.value.filter(b => b.date >= startDateStr && b.date <= endDateStr);
  };

  return {
    vehicles,
    bookings,
    toggleVehicleStatus,
    updateVehicleStatus,
    addVehicle,
    addBooking,
    updateBooking,
    deleteBooking,
    getBookingsForVehicleAndDate,
    getBookingsForDateRange
  };
}, {
  persist: true
});
