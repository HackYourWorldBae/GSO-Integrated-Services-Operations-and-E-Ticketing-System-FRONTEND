import apiClient from './client';

// ============================================================================
// Superadmin API Module — Master Administration & User Lifecycle
//
// Conforms to ISO/IEC 25010:2011 Modularity & Traceability standards.
// Directly maps 1-to-1 with backend App\Controllers\API\SuperadminController.
// ============================================================================

/**
 * Fetch high-level system user statistics and metrics.
 * Route: GET /api/v1/superadmin/stats
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const fetchSuperadminStats = () =>
  apiClient.get('/superadmin/stats');

/**
 * Fetch paginated list of user accounts with optional query filters.
 * Route: GET /api/v1/superadmin/users
 * @param {Object|string|URLSearchParams} [params] - Query parameters (search, role, unit_id, status, page, per_page)
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const fetchUsers = (params = {}) =>
  apiClient.get('/superadmin/users', { params });

/**
 * Fetch a single user account's complete profile by UUID.
 * Route: GET /api/v1/superadmin/users/{id}
 * @param {string} userId - UUID of the user
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const fetchUserById = (userId) =>
  apiClient.get(`/superadmin/users/${userId}`);

/**
 * Provision a new user account.
 * Route: POST /api/v1/superadmin/users
 * @param {Object} userData - Account attributes (first_name, last_name, email, password, role, etc.)
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const createUser = (userData) =>
  apiClient.post('/superadmin/users', userData);

/**
 * Update existing user account details.
 * Route: PUT /api/v1/superadmin/users/{id}
 * @param {string} userId - UUID of the user
 * @param {Object} userData - Editable fields (name, email, contact, role, status, etc.)
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const updateUser = (userId, userData) =>
  apiClient.put(`/superadmin/users/${userId}`, userData);

/**
 * Permanently delete a user account and associated credentials.
 * Route: DELETE /api/v1/superadmin/users/{id}
 * @param {string} userId - UUID of the user
 * @param {Object} [data] - Optional payload (e.g. deletion confirmation reasons)
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const deleteUser = (userId, data = {}) =>
  apiClient.delete(`/superadmin/users/${userId}`, { data });

/**
 * Verify and activate a newly registered user account (granting full requestor permissions).
 * Route: PATCH /api/v1/superadmin/users/{id}/verify
 * @param {string} userId - UUID of the user
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const verifyUser = (userId) =>
  apiClient.patch(`/superadmin/users/${userId}/verify`, {});

/**
 * Reject a pending user registration with a recorded justification.
 * Route: PATCH /api/v1/superadmin/users/{id}/reject
 * @param {string} userId - UUID of the user
 * @param {string} [reason=''] - Rejection reason note for audit trail
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const rejectVerification = (userId, reason = '') =>
  apiClient.patch(`/superadmin/users/${userId}/reject`, { reason });

/**
 * Change a user's operational status (Active, Suspended, Rejected).
 * Route: PATCH /api/v1/superadmin/users/{id}/status
 * @param {string} userId - UUID of the user
 * @param {'Active'|'Suspended'|'Rejected'} status
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const updateUserStatus = (userId, status) =>
  apiClient.patch(`/superadmin/users/${userId}/status`, { status });

/**
 * Manually unlock an account locked due to excessive failed login attempts.
 * Route: POST /api/v1/superadmin/users/{id}/unlock
 * @param {string} userId - UUID of the user
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const unlockUser = (userId) =>
  apiClient.post(`/superadmin/users/${userId}/unlock`, {});

/**
 * Fetch business transactional audit logs.
 * Route: GET /api/v1/superadmin/audit-logs
 * @param {Object|string|URLSearchParams} [params] - Query filters (action, actor, date range, page, limit)
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const fetchAuditLogs = (params = {}) =>
  apiClient.get('/superadmin/audit-logs', { params });

/**
 * Fetch security and account activity audit logs.
 * Route: GET /api/v1/superadmin/account-activity-logs
 * @param {Object|string|URLSearchParams} [params] - Query filters (event_type, severity, target, page, limit)
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const fetchAccountActivityLogs = (params = {}) =>
  apiClient.get('/superadmin/account-activity-logs', { params });
