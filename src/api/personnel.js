import apiClient from './client';

// ============================================================================
// Personnel API Module
//
// Wraps all personnel roster management calls.
// Consumed by: FGMU/LEAU/TASU Personnel management views, Dispatcher dropdowns
// ============================================================================

/**
 * Get the full personnel roster for a unit (admin/dispatcher view).
 * @param {string} unitCode - 'FGMU' | 'LEAU' | 'TASU'
 */
export const fetchPersonnelByUnit = (unitCode) =>
  apiClient.get(`/personnel/${unitCode}`);

/**
 * Get only available workers for a unit (for dispatcher assignment dropdowns).
 * @param {string} unitCode
 */
export const fetchAvailablePersonnel = (unitCode) =>
  apiClient.get(`/personnel/${unitCode}/available`);

/**
 * Update a worker's availability status.
 * @param {string} personnelId
 * @param {'available' | 'on_leave'} status
 */
export const updatePersonnelStatus = (personnelId, status) =>
  apiClient.patch(`/personnel/${personnelId}/status`, { status });

/**
 * Create a new personnel record.
 * @param {{ name, specialty, unit_id, user_id? }} data
 */
export const createPersonnel = (data) =>
  apiClient.post('/personnel', data);

/**
 * Update an existing personnel record's name or specialty.
 * @param {string} personnelId
 * @param {{ name?, specialty? }} data
 */
export const updatePersonnel = (personnelId, data) =>
  apiClient.put(`/personnel/${personnelId}`, data);

/**
 * Delete a personnel record (only if not currently active on a job).
 * @param {string} personnelId
 */
export const deletePersonnel = (personnelId) =>
  apiClient.delete(`/personnel/${personnelId}`);
