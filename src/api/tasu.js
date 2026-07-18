import apiClient from './client';

// ============================================================================
// TASU API Module
//
// Wraps TASU vehicle fleet management and dispatch board calls.
// Consumed by: TASU_VehicleManagement.vue, TASU_DispatchBoard.vue,
//              VehicleAvailabilityView.vue (public available endpoint)
// ============================================================================

/** Get all TASU fleet vehicles (admin vehicle management view). */
export const fetchFleet = () =>
  apiClient.get('/tasu/vehicles');

/** Get only available vehicles (public requestor view). */
export const fetchAvailableVehicles = () =>
  apiClient.get('/tasu/vehicles/available');

/**
 * Add a new vehicle to the fleet.
 * @param {{ plate_no, model_name, model_year, fuel_type, engine_specs, category, image_url? }} data
 */
export const createVehicle = (data) =>
  apiClient.post('/tasu/vehicles', data);

/**
 * Update an existing vehicle's details.
 * @param {number} vehicleId
 * @param {object} data
 */
export const updateVehicle = (vehicleId, data) =>
  apiClient.put(`/tasu/vehicles/${vehicleId}`, data);

/**
 * Update a vehicle's status (available, maintenance, reserved).
 * @param {number} vehicleId
 * @param {'available' | 'maintenance' | 'reserved'} status
 */
export const updateVehicleStatus = (vehicleId, status) =>
  apiClient.patch(`/tasu/vehicles/${vehicleId}/status`, { status });

/**
 * Delete a vehicle from the fleet.
 * @param {number} vehicleId
 */
export const deleteVehicle = (vehicleId) =>
  apiClient.delete(`/tasu/vehicles/${vehicleId}`);

/** Get the full dispatch board with all vehicles and their active booking data. */
export const fetchDispatchBoard = () =>
  apiClient.get('/tasu/dispatch');
