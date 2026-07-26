import apiClient from './client';

// ============================================================================
// Tickets API Module
//
// Wraps all ticket lifecycle HTTP calls.
// Consumed by: tickets.js store, User_Dashboard, Admin dashboards, Dispatcher views
// ============================================================================

// --- Requestor (Student / Employee) ---

/** Get the current user's active (non-archived) tickets. */
export const fetchMyRequests = () =>
  apiClient.get('/tickets/my-requests');

/** Get the current user's completed/archived tickets. */
export const fetchCompletedTickets = () =>
  apiClient.get('/tickets/completed');

/** Submit a consolidated multi-service intake request. */
export const submitIntake = (payload) =>
  apiClient.post('/tickets/intake', payload);

// --- Single Ticket ---

/** Get a single ticket with its unit-specific details, attachments, and logs. */
export const fetchTicket = (ticketId) =>
  apiClient.get(`/tickets/${ticketId}`);

/** Get audit logs for a specific ticket. */
export const fetchTicketLogs = (ticketId) =>
  apiClient.get(`/tickets/${ticketId}/logs`);

// --- Admin Queues ---

/** Get the pending approval queue for a unit (admin dashboard). */
export const fetchPendingQueue = (unitCode) =>
  apiClient.get(`/tickets/queue/${unitCode}`);

/** Get the approved/queued-for-dispatch tickets for a unit. */
export const fetchDispatchQueue = (unitCode) =>
  apiClient.get(`/tickets/dispatch/${unitCode}`);

/** Get in-progress/active tickets for a unit. */
export const fetchActiveTickets = (unitCode) =>
  apiClient.get(`/tickets/active/${unitCode}`);

/** Get archived/completed tickets for a unit, with optional filters. */
export const fetchArchives = (unitCode, filters = {}) =>
  apiClient.get(`/tickets/archives/${unitCode}`, { params: filters });

/** Get dashboard statistics for a unit (pending, processing, resolved counts). */
export const fetchUnitStats = (unitCode) =>
  apiClient.get(`/tickets/stats/${unitCode}`);

// --- Admin Actions ---

/** Approve a pending ticket. */
export const approveTicket = (ticketId) =>
  apiClient.patch(`/tickets/${ticketId}/approve`);

/**
 * Decline a pending ticket with a reason.
 * @param {string} ticketId
 * @param {string} declineReason
 */
export const declineTicket = (ticketId, declineReason) =>
  apiClient.patch(`/tickets/${ticketId}/decline`, { decline_reason: declineReason });

/** Mark a ticket as completed/resolved. */
export const completeTicket = (ticketId) =>
  apiClient.patch(`/tickets/${ticketId}/complete`);
