import apiClient from './client';

// ============================================================================
// Dispatch API Module
//
// Wraps admin dispatch operations: assigning workers, updating job schedules,
// and managing materials.
// Consumed by: FGMU/LEAU Admin views
// ============================================================================

/**
 * Assign a worker to an approved ticket.
 * @param {{ ticket_id, personnel_id, implementation_date?, task_notes?, dispatcher_notes? }} data
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
