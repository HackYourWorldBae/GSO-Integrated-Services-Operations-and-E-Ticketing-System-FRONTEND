import apiClient from './client';

// ============================================================================
// Cross-Unit Collaboration API Module
//
// Enables joint service delivery across FGMU, LEAU, and SSU by allowing units
// to request assistance, share manpower/personnel, coordinate work scopes,
// and track shared dispatch milestones.
// ============================================================================

/**
 * Request cross-unit collaboration on a ticket.
 * @param {{ ticket_id: string, collaborating_unit_id: number, scope_of_work?: string }} data
 */
export const requestCollaboration = (data) =>
  apiClient.post('/collaborations', data);

/**
 * Get all collaboration records and assigned personnel for a specific ticket.
 * @param {string} ticketId
 */
export const getTicketCollaborations = (ticketId) =>
  apiClient.get(`/collaborations/ticket/${encodeURIComponent(ticketId)}`);

/**
 * Respond (accept/decline) to an incoming collaboration request.
 * @param {string} collaborationId
 * @param {{ response_status: 'accepted'|'declined', notes?: string }} data
 */
export const respondCollaboration = (collaborationId, data) =>
  apiClient.patch(`/collaborations/${encodeURIComponent(collaborationId)}/respond`, data);

/**
 * Assign personnel from the collaborating unit to the joint ticket.
 * @param {string} collaborationId
 * @param {{ personnel_id: string|number, implementation_date?: string, task_notes?: string }} data
 */
export const assignCollaboratingPersonnel = (collaborationId, data) =>
  apiClient.post(`/collaborations/${encodeURIComponent(collaborationId)}/assign-personnel`, data);

/**
 * Mark a collaboration assignment as completed with completion notes.
 * @param {string} collaborationId
 * @param {{ notes?: string }} data
 */
export const completeCollaboration = (collaborationId, data = {}) =>
  apiClient.patch(`/collaborations/${encodeURIComponent(collaborationId)}/complete`, data);

/**
 * Fetch all incoming and outgoing collaborations for the current user's unit.
 */
export const fetchMyUnitCollaborations = () =>
  apiClient.get('/collaborations/my-unit');
