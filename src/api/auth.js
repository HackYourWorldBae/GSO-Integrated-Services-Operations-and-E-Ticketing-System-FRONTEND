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
