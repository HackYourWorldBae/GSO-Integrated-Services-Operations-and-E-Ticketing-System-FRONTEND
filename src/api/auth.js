import apiClient from './client';

// ============================================================================
// Auth API Module
//
// Wraps all authentication-related HTTP calls.
// Consumed by: auth.js Pinia store, LoginView.vue, User_Settings.vue
// ============================================================================

/**
 * Login with a Student ID or email + password.
 * @param {string} identifier - 7-digit student ID or email address
 * @param {string} password
 * @returns {Promise<{ access_token, user, role }>}
 */
export const login = (identifier, password) =>
  apiClient.post('/auth/login', { identifier, password });

/**
 * Logout (notifies backend for audit log; token invalidation is client-side).
 */
export const logout = () =>
  apiClient.post('/auth/logout');

/**
 * Get the currently authenticated user's full profile.
 * @returns {Promise<{ user }>}
 */
export const getMe = () =>
  apiClient.get('/auth/me');

/**
 * Update the current user's profile fields.
 * @param {{ first_name?, last_name?, contact_number?, email? }} data
 */
export const updateProfile = (data) =>
  apiClient.patch('/auth/profile', data);

/**
 * Change the current user's password.
 * @param {{ current_password, new_password, confirm_password }} data
 */
export const changePassword = (data) =>
  apiClient.post('/auth/change-password', data);

/**
 * Check whether the active session is still valid (1 session per user enforcement).
 */
export const checkSessionApi = () =>
  apiClient.get('/auth/check-session');

/**
 * Register a new user account with ID card verification.
 * @param {FormData} formData
 */
export const register = (formData) =>
  apiClient.post('/auth/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

/**
 * Request a password reset link to be sent to user's registered email.
 * @param {string} email
 */
export const forgotPassword = (email) =>
  apiClient.post('/auth/forgot-password', { email });

/**
 * Verify validity of a password reset token from email link.
 * @param {string} email
 * @param {string} token
 */
export const verifyResetToken = (email, token) =>
  apiClient.post('/auth/verify-reset-token', { email, token });

/**
 * Reset account password using token link.
 * @param {{ email: string, token: string, password: string, password_confirm: string }} payload
 */
export const resetPassword = (payload) =>
  apiClient.post('/auth/reset-password', payload);

/**
 * Fetch public maintenance status.
 * Used by unauthenticated visitors on login screen.
 */
export const fetchPublicMaintenanceStatus = () =>
  apiClient.get('/auth/maintenance-status');

/**
 * Fetch sub-unit delegation status and active unit heads (Director oversight).
 */
export const getDelegationUnitsApi = () =>
  apiClient.get('/auth/delegation/units');

/**
 * Assume sub-unit head dashboard coverage as Acting Unit Head.
 * Terminates active session of the unit head to enforce single-session security.
 * @param {string} unitCode - 'FGMU' | 'LEAU' | 'SSU'
 */
export const assumeUnitHeadApi = (unitCode) =>
  apiClient.post('/auth/assume-unit-head', { unit_code: unitCode });

/**
 * Revert from Acting Unit Head back to Executive Director dashboard.
 */
export const revertUnitHeadApi = () =>
  apiClient.post('/auth/revert-unit-head');

/**
 * Verify Multi-Factor Authentication (MFA) OTP code to complete login.
 * @param {{ mfa_token: string, otp_code: string }} payload
 */
export const verifyMfa = (payload) =>
  apiClient.post('/auth/verify-mfa', payload);

/**
 * Resend Multi-Factor Authentication (MFA) OTP code.
 * @param {{ mfa_token: string }} payload
 */
export const resendMfa = (payload) =>
  apiClient.post('/auth/resend-mfa', payload);



