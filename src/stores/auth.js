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
  const user  = ref(null);
  const role  = ref(null);
  const token = ref(typeof window !== 'undefined' ? sessionStorage.getItem('token') || null : null);

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

  // ---------------------------------------------------------------------------
  // Proactive Session Heartbeat & Verification
  // ---------------------------------------------------------------------------

  let heartbeatIntervalId = null;
  let isCheckingSession   = false;

  /**
   * Verify session status with the backend.
   * If the account was logged in elsewhere, backend JwtAuthFilter returns 401 SESSION_SUPERSEDED,
   * which triggers the signed-out modal via the apiClient response interceptor.
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
      await checkSessionApi();
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
   * Start polling session validity to proactively detect logouts on other devices.
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
   * Stores user profile, role, and Bearer token.
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

      user.value  = userData;
      role.value  = userData.role;
      token.value = jwtToken;

      if (jwtToken) {
        sessionStorage.setItem('token', jwtToken);
      }

      window.__gso_session_superseded = false;

      // Start proactive session heartbeat
      startSessionHeartbeat();

      return { success: true, role: userData.role };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, message };
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
      user.value  = null;
      role.value  = null;
      token.value = null;
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('auth');
    }
  };

  /**
   * Verify session status against the backend using stored credentials.
   */
  const checkAuth = async () => {
    try {
      const response = await getMe();
      user.value = response.data.data.user;
      role.value = response.data.data.user.role;
      startSessionHeartbeat();
      return true;
    } catch {
      stopSessionHeartbeat();
      user.value  = null;
      role.value  = null;
      token.value = null;
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('auth');
      return false;
    }
  };

  /**
   * Refresh current user's profile from the backend.
   */
  const refreshProfile = async () => {
    try {
      const response = await getMe();
      user.value = response.data.data.user;
      role.value = response.data.data.user.role;
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
      user.value = response.data.data.user;
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Profile update failed.';
      return { success: false, message };
    }
  };

  // Internal setter used during re-hydration
  const _setAuth = (userData, userRole, authToken = null) => {
    user.value = userData;
    role.value = userRole;
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
    isAuthenticated,
    fullName,
    contactNumber,
    capitalizedRole,
    unitId,
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
    pick: ['user', 'role', 'token'],
  },
});
