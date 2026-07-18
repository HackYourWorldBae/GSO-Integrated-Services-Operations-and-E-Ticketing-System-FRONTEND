import apiClient from './client';

// ============================================================================
// Dispatch API Module
//
// Wraps dispatcher operations: assigning workers/drivers/vehicles,
// updating job schedules, managing materials, and worker dashboard queries.
// Consumed by: FGMU/LEAU/TASU Dispatcher views, Worker_Dashboard, Driver_Dashboard
// ============================================================================

/**
 * Assign a worker/driver (and optionally a vehicle) to an approved ticket.
 * @param {{ ticket_id, personnel_id, vehicle_id?, implementation_date?, task_notes?, dispatcher_notes? }} data
 */
export const assignWorker = (data) =>
  apiClient.post('/dispatch/assign', data);

/**
 * Update an existing assignment's schedule or notes.
 * @param {number} assignmentId
 * @param {{ implementation_date?, task_notes?, dispatcher_notes? }} data
 */
export const updateAssignment = (assignmentId, data) =>
  apiClient.patch(`/dispatch/assignments/${assignmentId}`, data);

/**
 * Add a list of materials to an assignment.
 * @param {number} assignmentId
 * @param {Array<{ name: string, quantity: number, unit?: string }>} materials
 */
export const addMaterials = (assignmentId, materials) =>
  apiClient.post(`/dispatch/assignments/${assignmentId}/materials`, { materials });

/**
 * Get a worker's current active job assignment (for Worker / Driver dashboard).
 * @param {string} personnelId
 */
export const fetchWorkerDashboard = (personnelId) =>
  apiClient.get(`/dispatch/worker/${personnelId}`);

/**
 * Get a worker's completed job history.
 * @param {string} personnelId
 */
export const fetchWorkerHistory = (personnelId) =>
  apiClient.get(`/dispatch/worker/${personnelId}/history`);
