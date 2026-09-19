import apiClient from './client';

// ============================================================================
// System Settings API Module
//
// Handles system administration settings including Resend.com email delivery.
// Conforms to ISO/IEC 25010 modularity standards.
// ============================================================================

/**
 * Fetch current Resend email service configuration (status, masked key, sender).
 * Route: GET /api/v1/settings/resend
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const getResendConfig = () =>
  apiClient.get('/settings/resend');

/**
 * Update Resend email service configuration.
 * Route: POST /api/v1/settings/resend
 * @param {{ api_key?: string, from_email?: string, notifications_enabled?: boolean }} data
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const updateResendConfig = (data) =>
  apiClient.post('/settings/resend', data);

/**
 * Dispatch a live test email through Resend to verify connectivity.
 * Route: POST /api/v1/settings/resend/test
 * @param {string} [email]
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const testResendEmail = (email) =>
  apiClient.post('/settings/resend/test', { email });
