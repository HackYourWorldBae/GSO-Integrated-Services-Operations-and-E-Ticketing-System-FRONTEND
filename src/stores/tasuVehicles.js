import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '@/api/client';

export const useTasuVehiclesStore = defineStore('tasuVehicles', () => {
  const vehicles = ref([]);
  const bookings = ref([]);

  const fetchVehicles = async () => {
    try {
      const response = await apiClient.get('tasu/vehicles');
      if (response.data?.data?.vehicles) {
        vehicles.value = response.data.data.vehicles.map(v => ({
          id: v.id,
          name: v.model_name,
          plate: v.plate_no,
          category: v.category,
          fuel: v.fuel_type,
          model: v.model_year,
          engine: v.engine_specs,
          image: v.image_url,
          status: v.status === 'available' ? 'Available' : (v.status === 'in_use' ? 'In Use' : (v.status === 'maintenance' ? 'Under Maintenance' : 'Reserved'))
        }));
      }
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    }
  };

  const toggleVehicleStatus = async (vehicleId) => {
    const v = vehicles.value.find(item => item.id === vehicleId);
    if (!v || v.status === 'In Use') return;
    
    // Toggle logically for the UI
    const newStatusStr = v.status === 'Available' ? 'Under Maintenance' : 'Available';
    const newBackendStatus = newStatusStr === 'Available' ? 'available' : 'maintenance';
    
    // Optimistic UI update
    const previousStatus = v.status;
    v.status = newStatusStr;
    
    try {
      await apiClient.patch(`tasu/vehicles/${vehicleId}/status`, { status: newBackendStatus });
    } catch (error) {
      console.error('Failed to update vehicle status:', error);
      v.status = previousStatus; // revert
      throw error;
    }
  };

  const updateVehicleStatus = async (vehicleId, newStatus) => {
    // This expects the UI friendly status ('Available', 'In Use', etc)
    const backendStatus = newStatus === 'Available' ? 'available' : (newStatus === 'In Use' ? 'in_use' : (newStatus === 'Under Maintenance' ? 'maintenance' : 'reserved'));
    try {
      await apiClient.patch(`tasu/vehicles/${vehicleId}/status`, { status: backendStatus });
      await fetchVehicles();
    } catch (error) {
       console.error('Failed to update status', error);
       throw error;
    }
  };

  const addVehicle = async (vehicleData) => {
    try {
      const formData = new FormData();
      formData.append('plate_no', vehicleData.plate);
      formData.append('model_name', vehicleData.name);
      formData.append('model_year', vehicleData.model);
      formData.append('fuel_type', vehicleData.fuel);
      formData.append('engine_specs', vehicleData.engine);
      formData.append('category', vehicleData.category);
      if (vehicleData.imageFile) {
        formData.append('image', vehicleData.imageFile);
      }
      
      await apiClient.post('tasu/vehicles', formData);
      await fetchVehicles();
    } catch (error) {
      console.error('Failed to add vehicle:', error);
      throw error;
    }
  };

  const updateVehicle = async (vehicleId, vehicleData) => {
    try {
      const formData = new FormData();
      formData.append('plate_no', vehicleData.plate);
      formData.append('model_name', vehicleData.name);
      formData.append('model_year', vehicleData.model);
      formData.append('fuel_type', vehicleData.fuel);
      formData.append('engine_specs', vehicleData.engine);
      formData.append('category', vehicleData.category);
      if (vehicleData.image) {
        formData.append('image_url', vehicleData.image);
      }
      if (vehicleData.imageFile) {
        formData.append('image', vehicleData.imageFile);
      }

      await apiClient.post(`tasu/vehicles/${vehicleId}`, formData);
      await fetchVehicles();
    } catch (error) {
      console.error('Failed to update vehicle:', error);
      throw error;
    }
  };

  // Mock booking implementations are retained for now as they are not part of the vehicle API changes
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
    fetchVehicles,
    toggleVehicleStatus,
    updateVehicleStatus,
    addVehicle,
    updateVehicle,
    addBooking,
    updateBooking,
    deleteBooking,
    getBookingsForVehicleAndDate,
    getBookingsForDateRange
  };
});
