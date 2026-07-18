import apiClient from './client';

// ============================================================================
// Feedback API Module
//
// Wraps post-completion performance evaluation calls.
// Consumed by: User_CompletedTickets.vue
// ============================================================================

/**
 * Submit a performance evaluation for a completed ticket.
 *
 * @param {string} ticketId
 * @param {{
 *   completion_status: 'on-time' | 'beyond-time' | 'not-completed',
 *   courtesy_rating: number,
 *   quality_rating: number,
 *   efficiency_rating: number,
 *   timeliness_rating: number,
 *   cleanliness_rating: number,
 *   delay_reasons?: string[],
 *   remarks?: string
 * }} ratingData
 */
export const submitFeedback = (ticketId, ratingData) =>
  apiClient.post('/feedback', { ticket_id: ticketId, ...ratingData });

/**
 * Get the feedback record for a specific ticket.
 * @param {string} ticketId
 */
export const fetchFeedback = (ticketId) =>
  apiClient.get(`/feedback/${ticketId}`);
