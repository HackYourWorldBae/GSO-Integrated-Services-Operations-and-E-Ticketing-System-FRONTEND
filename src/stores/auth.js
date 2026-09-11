import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  login as apiLogin,
  logout as apiLogout,
  getMe,
  updateProfile as apiUpdateProfile,
  checkSessionApi,
} from '@/api/auth';

/**
 * Auth Store — Pinia
 *
 * Manages authentication state: authenticated user profile, role, and JWT token.
 * Persisted to sessionStorage so each browser tab/window maintains its own session credentials.
 * Includes proactive session heartbeat monitoring for strictly enforcing 1 session per user.
 */
export const useAuthStore = defineStore('auth', () => {
  const user        = ref(null);
  const role        = ref(null);
  const token       = ref(typeof window !== 'undefined' ? sessionStorage.getItem('token') || null : null);
  const permissions = ref(
    typeof window !== 'undefined'
      ? JSON.parse(sessionStorage.getItem('permissions') || '[]')
      : []
  );

  // ---------------------------------------------------------------------------
  // Computed
  // ---------------------------------------------------------------------------

  const isAuthenticated = computed(() => !!user.value && !!token.value);

  const fullName = computed(() => {
    if (!user.value) return 'Not Provided';
    return `${user.value.first_name || ''} ${user.value.last_name || ''}`.trim();
  });

  const contactNumber = computed(() => user.value?.contact_number || 'Not Provided');

  const capitalizedRole = computed(() => {
    if (!role.value) return 'User';
    return role.value.charAt(0).toUpperCase() + role.value.slice(1);
  });

  const unitId = computed(() => user.value?.unit_id ?? null);
  const isDeactivated = computed(() => user.value?.status === 'Deactivated');

  /**
   * Check whether current user has permission for a specific feature key.
   * Superadmin always returns true.
   * Uses real-time synchronized permissions list with role-based fallbacks.
   */
  const hasPermission = (featureKey) => {
    if (!featureKey) return true;
    if (role.value === 'superadmin') return true;

    // Deactivated user accounts can view and log in, but are barred from creating tickets
    if (user.value?.status === 'Deactivated' && featureKey === 'tickets.create') {
      return false;
    }

    const list = Array.isArray(permissions.value) && permissions.value.length > 0
      ? permissions.value
      : (user.value?.permissions || []);

    if (list.includes(featureKey)) {
      return true;
    }

    // Role default fallback if permissions list is empty / uninitialized
    if (list.length === 0) {
      if (role.value === 'admin' || role.value === 'dispatcher') {
        return [
          'tickets.create', 'tickets.approve_decline',
          'tickets.dispatch', 'tickets.assign_worker', 'tickets.complete_work',
          'tickets.verify_close', 'personnel.manage'
        ].includes(featureKey);
      }
      if (role.value === 'director') {
        return ['reports.view', 'tickets.view_all', 'tickets.verify_close'].includes(featureKey);
      }
      if (role.value === 'student' || role.value === 'employee') {
        return ['tickets.create'].includes(featureKey);
      }
      if (role.value === 'worker') {
        return ['tickets.complete_work'].includes(featureKey);
      }
    }

    return false;
  };

  // ---------------------------------------------------------------------------
  // Proactive Session Heartbeat & Verification
  // ---------------------------------------------------------------------------

  let heartbeatIntervalId = null;
  let isCheckingSession   = false;

  /**
   * Verify session status with the backend.
   * If the account was logged in elsewhere, backend JwtAuthFilter returns 401 SESSION_SUPERSEDED,
   * which triggers the signed-out modal via the apiClient response interceptor.
   * Also synchronizes latest permissions in near real-time without requiring re-login.
   */
  const verifySession = async () => {
    if (typeof window === 'undefined') return;
    if (window.__gso_session_superseded) return;

    const currentToken = token.value || sessionStorage.getItem('token');
    if (!currentToken || !user.value) {
      stopSessionHeartbeat();
      return;
    }

    if (isCheckingSession) return;
    isCheckingSession = true;

    try {
      const res = await checkSessionApi();
      const serverPermissions = res.data?.data?.permissions;
      if (Array.isArray(serverPermissions)) {
        permissions.value = serverPermissions;
        sessionStorage.setItem('permissions', JSON.stringify(serverPermissions));
        if (user.value) {
          user.value.permissions = serverPermissions;
        }
      }
    } catch (error) {
      const status = error.response?.status;
      const code   = error.response?.data?.code;

      if (status === 401 && code === 'SESSION_SUPERSEDED') {
        stopSessionHeartbeat();
      }
    } finally {
      isCheckingSession = false;
    }
  };

  const handleWindowFocusOrVisible = () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      if (!window.__gso_session_superseded && isAuthenticated.value) {
        verifySession();
      }
    }
  };

  /**
   * Start polling session validity to proactively detect logouts on other devices
   * and continuously synchronize role permissions.
   */
  const startSessionHeartbeat = () => {
    stopSessionHeartbeat();
    if (typeof window === 'undefined') return;

    // Check after a brief delay once UI is settled
    setTimeout(() => {
      verifySession();
    }, 1500);

    // Poll every 6 seconds while session is active
    heartbeatIntervalId = setInterval(() => {
      verifySession();
    }, 6000);

    window.addEventListener('focus', handleWindowFocusOrVisible);
    document.addEventListener('visibilitychange', handleWindowFocusOrVisible);
  };

  /**
   * Stop session polling when logged out or invalidated.
   */
  const stopSessionHeartbeat = () => {
    if (heartbeatIntervalId) {
      clearInterval(heartbeatIntervalId);
      heartbeatIntervalId = null;
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('focus', handleWindowFocusOrVisible);
      document.removeEventListener('visibilitychange', handleWindowFocusOrVisible);
    }
  };

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  /**
   * Login via API — validates credentials.
   * Stores user profile, role, dynamic permissions, and Bearer token.
   * Starts active session heartbeat monitoring.
   *
   * @param {string} identifier  - Student ID or email
   * @param {string} password
   * @returns {Promise<{ success: boolean, message: string, role?: string }>}
   */
  const login = async (identifier, password) => {
    try {
      const response = await apiLogin(identifier, password);
      const data     = response.data?.data || {};
      const userData = data.user;
      const jwtToken = data.access_token;
      const userPerms = userData.permissions || [];

      user.value        = userData;
      role.value        = userData.role;
      permissions.value = userPerms;
      token.value       = jwtToken;

      if (jwtToken) {
        sessionStorage.setItem('token', jwtToken);
      }
      sessionStorage.setItem('permissions', JSON.stringify(userPerms));

      window.__gso_session_superseded = false;

      // Start proactive session heartbeat
      startSessionHeartbeat();

      return { success: true, role: userData.role };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      const isSuspended = Boolean(err.response?.data?.data?.is_suspended || message.toLowerCase().includes('suspended'));
      return { success: false, message, isSuspended };
    }
  };

  /**
   * Logout — clears local user state, notifies backend, stops heartbeat.
   */
  const logout = async () => {
    stopSessionHeartbeat();
    try {
      await apiLogout();
    } catch {
      // Clean up client state regardless of network failure
    } finally {
      user.value        = null;
      role.value        = null;
      permissions.value = [];
      token.value       = null;
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('auth');
      sessionStorage.removeItem('permissions');
    }
  };

  /**
   * Verify session status against the backend using stored credentials.
   */
  const checkAuth = async () => {
    try {
      const response = await getMe();
      const userData = response.data.data.user;
      user.value        = userData;
      role.value        = userData.role;
      permissions.value = userData.permissions || [];
      sessionStorage.setItem('permissions', JSON.stringify(permissions.value));
      startSessionHeartbeat();
      return true;
    } catch {
      stopSessionHeartbeat();
      user.value        = null;
      role.value        = null;
      permissions.value = [];
      token.value       = null;
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('auth');
      sessionStorage.removeItem('permissions');
      return false;
    }
  };

  /**
   * Refresh current user's profile from the backend.
   */
  const refreshProfile = async () => {
    try {
      const response = await getMe();
      const userData = response.data.data.user;
      user.value = userData;
      role.value = userData.role;
      if (Array.isArray(userData.permissions)) {
        permissions.value = userData.permissions;
        sessionStorage.setItem('permissions', JSON.stringify(userData.permissions));
      }
    } catch {
      // Silently fail — non-critical profile sync
    }
  };

  /**
   * Update the current user's profile fields.
   * @param {{ first_name?, last_name?, contact_number? }} data
   */
  const updateProfile = async (data) => {
    try {
      const response = await apiUpdateProfile(data);
      const userData = response.data.data.user;
      user.value = userData;
      if (Array.isArray(userData.permissions)) {
        permissions.value = userData.permissions;
        sessionStorage.setItem('permissions', JSON.stringify(userData.permissions));
      }
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Profile update failed.';
      return { success: false, message };
    }
  };

  // Internal setter used during re-hydration
  const _setAuth = (userData, userRole, authToken = null, userPermissions = null) => {
    user.value        = userData;
    role.value        = userRole;
    permissions.value = userPermissions || userData?.permissions || [];
    sessionStorage.setItem('permissions', JSON.stringify(permissions.value));
    if (authToken) {
      token.value = authToken;
      sessionStorage.setItem('token', authToken);
    }
    startSessionHeartbeat();
  };

  return {
    user,
    role,
    token,
    permissions,
    isAuthenticated,
    fullName,
    contactNumber,
    capitalizedRole,
    unitId,
    isDeactivated,
    hasPermission,
    login,
    logout,
    checkAuth,
    refreshProfile,
    updateProfile,
    verifySession,
    startSessionHeartbeat,
    stopSessionHeartbeat,
    _setAuth,
  };
}, {
  persist: {
    storage: sessionStorage,
    pick: ['user', 'role', 'token', 'permissions'],
  },
});
