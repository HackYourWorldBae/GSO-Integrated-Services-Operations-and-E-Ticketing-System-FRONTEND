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
 * @param {{ first_name?, last_name?, contact_number? }} data
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


