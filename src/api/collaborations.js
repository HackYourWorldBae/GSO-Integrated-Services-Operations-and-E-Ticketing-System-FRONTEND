import apiClient from './client';

// ============================================================================
// Cross-Unit Collaboration API Module
//
// Enables joint service delivery across FGMU, LEAU, and SSU by allowing units
// to request assistance, share manpower/personnel, coordinate work scopes,
// and track shared dispatch milestones.
//
// Backend routes (api/v1):
//   POST  /tickets/:ticketId/collaborations
//   GET   /tickets/:ticketId/collaborations
//   PATCH /collaborations/:id/respond
//   POST  /collaborations/:id/assign-personnel
//   PATCH /collaborations/:id/complete
//   GET   /collaborations/my-unit
// ============================================================================

/**
 * Request cross-unit collaboration on a ticket.
 * @param {{ ticket_id: string, collaborating_unit_id: number, scope_of_work?: string, reason?: string }} data
 */
export const requestCollaboration = (data = {}) => {
  const { ticket_id, ticketId, collaborating_unit_id, scope_of_work, reason, ...rest } = data;
  const resolvedTicketId = ticket_id ?? ticketId;
  if (!resolvedTicketId) {
    throw new Error('requestCollaboration: ticket_id is required.');
  }
  const scope = (scope_of_work ?? reason ?? '').toString().trim();
  const objective = (reason ?? scope_of_work ?? '').toString().trim();
  return apiClient.post(`/tickets/${encodeURIComponent(resolvedTicketId)}/collaborations`, {
    collaborating_unit_id,
    reason: objective,
    scope_of_work: scope,
    ...rest,
  });
};

/**
 * Get all collaboration records and assigned personnel for a specific ticket.
 * @param {string} ticketId
 */
export const getTicketCollaborations = (ticketId) =>
  apiClient.get(`/tickets/${encodeURIComponent(ticketId)}/collaborations`);

/**
 * Respond (accept/decline) to an incoming collaboration request.
 * @param {string|number} collaborationId
 * @param {{ response_status?: 'accepted'|'declined', action?: 'accepted'|'declined', status?: 'accepted'|'declined', notes?: string, response_notes?: string }} data
 */
export const respondCollaboration = (collaborationId, data = {}) => {
  const action = data.action ?? data.response_status ?? data.status;
  const notes = data.response_notes ?? data.notes ?? '';
  return apiClient.patch(`/collaborations/${encodeURIComponent(collaborationId)}/respond`, {
    ...data,
    action,
    response_status: action,
    status: action,
    notes,
    response_notes: notes,
  });
};

/**
 * Assign personnel from the collaborating unit to the joint ticket.
 * @param {string|number} collaborationId
 * @param {{ personnel_id: string|number, implementation_date?: string, task_notes?: string }} data
 */
export const assignCollaboratingPersonnel = (collaborationId, data) =>
  apiClient.post(`/collaborations/${encodeURIComponent(collaborationId)}/assign-personnel`, data);

/**
 * Mark a collaboration assignment as completed with completion notes.
 * @param {string|number} collaborationId
 * @param {{ notes?: string, completion_notes?: string }} data
 */
export const completeCollaboration = (collaborationId, data = {}) => {
  const notes = data.completion_notes ?? data.notes ?? '';
  return apiClient.patch(`/collaborations/${encodeURIComponent(collaborationId)}/complete`, {
    ...data,
    notes,
    completion_notes: notes,
  });
};

/**
 * Fetch all incoming and outgoing collaborations for the current user's unit.
 */
export const fetchMyUnitCollaborations = (params = {}) =>
  apiClient.get('/collaborations/my-unit', { params });

/**
 * Fetch collab tickets for the current unit filtered by workflow stage.
 * @param {{ direction?: 'incoming'|'outgoing'|'all', stage?: 'approved'|'scheduled'|'active'|'all', unit_id?: number }} params
 */
export const fetchCollabTickets = (params = {}) =>
  apiClient.get('/collaborations/tickets', { params });
