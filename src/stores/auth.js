import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import {
  login as apiLogin,
  logout as apiLogout,
  getMe,
  updateProfile as apiUpdateProfile,
  checkSessionApi,
  assumeUnitHeadApi,
  revertUnitHeadApi,
  verifyMfa as apiVerifyMfa,
  resendMfa as apiResendMfa,
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
    const parts = [
      user.value.first_name,
      user.value.last_name,
      user.value.name_extension,
    ].filter(p => p && String(p).trim().length > 0);
    return parts.join(' ').trim() || 'Not Provided';
  });

  const nameExtension = computed(() => user.value?.name_extension || '');

  const contactNumber = computed(() => user.value?.contact_number || 'Not Provided');

  const capitalizedRole = computed(() => {
    if (!role.value) return 'User';
    const r = role.value.toLowerCase();
    if (r === 'student') {
      const type = (user.value?.student_type || '').toLowerCase().trim();
      if (type === 'ssg') return 'SSG Member';
      return 'RSO Member';
    }
    if (r === 'worker') {
      return 'Responding Personnel';
    }
    return role.value.charAt(0).toUpperCase() + role.value.slice(1);
  });

  const studentType = computed(() => (user.value?.student_type || '').toLowerCase().trim());
  const organizationName = computed(() => user.value?.organization_name || '');
  const college = computed(() => user.value?.college || '');

  const unitId = computed(() => user.value?.unit_id ?? null);
  const isActingHead = computed(() => Boolean(user.value?.is_acting_head));
  const actingUnitCode = computed(() => user.value?.acting_unit_code || null);
  const actingUnitName = computed(() => user.value?.acting_unit_name || null);
  // Legacy alias — Deactivated has been retired (migrated to Suspended). Keep for
  // backward-compat with cached payloads; always false for current data.
  const isDeactivated = computed(() => false);

  // ---------------------------------------------------------------------------
  // User Avatar & Dynamic Profile Picture Handling
  // ---------------------------------------------------------------------------
  const avatarVersion = ref(Date.now());
  const avatarBlobPreview = ref(null);

  const setAvatarBlobPreview = (blobUrl) => {
    avatarBlobPreview.value = blobUrl || null;
  };

  const updateAvatar = (updatedUser) => {
    avatarBlobPreview.value = null;
    if (updatedUser) {
      user.value = { ...(user.value || {}), ...updatedUser };
      if (updatedUser.role) {
        role.value = updatedUser.role;
      }
      if (Array.isArray(updatedUser.permissions)) {
        permissions.value = updatedUser.permissions;
      }
    }
    avatarVersion.value = Date.now();
  };

  const setUser = (updatedUser) => {
    if (updatedUser) {
      user.value = { ...(user.value || {}), ...updatedUser };
      if (updatedUser.role) {
        role.value = updatedUser.role;
      }
      if (Array.isArray(updatedUser.permissions)) {
        permissions.value = updatedUser.permissions;
      }
      avatarVersion.value = Date.now();
    }
  };

  watch(
    () => user.value?.avatar_path,
    (newPath, oldPath) => {
      if (newPath !== oldPath) {
        avatarVersion.value = Date.now();
      }
    }
  );

  const avatarUrl = computed(() => {
    if (avatarBlobPreview.value) {
      return avatarBlobPreview.value;
    }
    const u = user.value;
    if (!u || !u.avatar_path) return null;
    if (
      typeof u.avatar_path === 'string' &&
      (u.avatar_path.startsWith('http://') ||
       u.avatar_path.startsWith('https://') ||
       u.avatar_path.startsWith('data:') ||
       u.avatar_path.startsWith('blob:'))
    ) {
      return u.avatar_path;
    }
    const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1').replace(/\/+$/, '');
    const versionKey = encodeURIComponent(u.avatar_path || u.updated_at || avatarVersion.value);
    return `${apiBase}/auth/avatar/${u.id}?v=${versionKey}&t=${avatarVersion.value}`;
  });

  /**
   * Check whether current user has permission for a specific feature key.
   * Superadmin always returns true.
   * Uses real-time synchronized permissions list with role-based fallbacks.
   */
  const hasPermission = (featureKey) => {
    if (!featureKey) return true;
    if (role.value === 'superadmin') return true;

    // Pending/unverified accounts cannot create tickets until verified by Superadmin
    const isVerified = user.value?.is_verified === 1 || user.value?.is_verified === true || user.value?.is_verified === '1';
    if (!isVerified && featureKey === 'tickets.create') {
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
      if (role.value === 'admin') {
        return [
          'tickets.create', 'tickets.approve_decline',
          'tickets.dispatch', 'tickets.assign_worker', 'tickets.complete_work',
          'tickets.verify_close', 'personnel.manage'
        ].includes(featureKey);
      }
      if (role.value === 'director') {
        return ['reports.view', 'tickets.view_all', 'tickets.verify_close', 'tickets.create'].includes(featureKey);
      }
      if (role.value === 'student' || role.value === 'employee') {
        return isVerified ? ['tickets.create'].includes(featureKey) : false;
      }
      if (role.value === 'worker') {
        return ['tickets.complete_work'].includes(featureKey);
      }
    }

    return false;
  };

  // ---------------------------------------------------------------------------
  // Emergency System Maintenance & Eviction State
  // ---------------------------------------------------------------------------
  const isMaintenanceActive  = ref(false);
  const maintenanceMessage   = ref('');
  const maintenanceCountdown = ref(30);
  const showMaintenanceModal = ref(false);
  let maintenanceTickerId    = null;

  const triggerMaintenanceEviction = (details = {}) => {
    // Superadmin is exempt from eviction so they can maintain the system
    if (role.value === 'superadmin') {
      return;
    }

    isMaintenanceActive.value = true;
    maintenanceMessage.value  = details?.message || 'The system is undergoing scheduled maintenance.';

    // If modal is already ticking, don't restart ticker unless not running
    if (showMaintenanceModal.value && maintenanceTickerId) {
      return;
    }

    let initialSeconds = Number(details?.countdown_seconds) || 30;
    if (details?.activated_at) {
      const activatedMs = new Date(details.activated_at).getTime();
      if (!isNaN(activatedMs)) {
        const elapsed = Math.floor((Date.now() - activatedMs) / 1000);
        if (elapsed > 0 && elapsed < initialSeconds) {
          initialSeconds = Math.max(5, initialSeconds - elapsed);
        }
      }
    }

    maintenanceCountdown.value = Math.max(5, initialSeconds);
    showMaintenanceModal.value = true;

    if (maintenanceTickerId) {
      clearInterval(maintenanceTickerId);
    }

    maintenanceTickerId = setInterval(() => {
      if (maintenanceCountdown.value > 1) {
        maintenanceCountdown.value -= 1;
      } else {
        maintenanceCountdown.value = 0;
        executeEvictionLogout();
      }
    }, 1000);
  };

  const stopMaintenanceTicker = () => {
    if (maintenanceTickerId) {
      clearInterval(maintenanceTickerId);
      maintenanceTickerId = null;
    }
  };

  const executeEvictionLogout = async () => {
    stopMaintenanceTicker();
    showMaintenanceModal.value = false;
    await logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/login?maintenance=1';
    }
  };

  const setMaintenanceStatus = (isActive, msg = '', countdown = 30) => {
    isMaintenanceActive.value = Boolean(isActive);
    if (msg) maintenanceMessage.value = msg;
    if (countdown) maintenanceCountdown.value = Number(countdown) || 30;
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
   * Also synchronizes latest permissions, status, and verification in near real-time.
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
      if (res.data?.data?.status && user.value) {
        user.value.status = res.data.data.status;
      }
      if (typeof res.data?.data?.is_verified !== 'undefined' && user.value) {
        user.value.is_verified = res.data.data.is_verified;
      }

      // Synchronize maintenance mode state returned in check-session
      if (res.data?.data?.maintenance_mode) {
        isMaintenanceActive.value = true;
        maintenanceMessage.value = res.data.data.maintenance_details?.message || '';
        maintenanceCountdown.value = Number(res.data.data.maintenance_details?.countdown_seconds) || 30;
        if (role.value !== 'superadmin') {
          triggerMaintenanceEviction(res.data.data.maintenance_details);
        }
      } else {
        isMaintenanceActive.value = false;
        if (showMaintenanceModal.value) {
          stopMaintenanceTicker();
          showMaintenanceModal.value = false;
        }
      }
    } catch (error) {
      const status = error.response?.status;
      const code   = error.response?.data?.code;

      if (status === 401 && code === 'SESSION_SUPERSEDED') {
        stopSessionHeartbeat();
      } else if (status === 503 && (code === 'MAINTENANCE_MODE_ACTIVE' || error.response?.data?.maintenance_mode)) {
        isMaintenanceActive.value = true;
        if (role.value !== 'superadmin') {
          triggerMaintenanceEviction(error.response?.data?.maintenance);
        }
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

  const handleMaintenanceBroadcast = (e) => {
    isMaintenanceActive.value = true;
    if (role.value !== 'superadmin') {
      triggerMaintenanceEviction(e.detail?.maintenance || e.detail?.data?.maintenance);
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

    // Poll every 30 seconds while session is active (focus/visibility change sync immediately)
    heartbeatIntervalId = setInterval(() => {
      verifySession();
    }, 30000);

    window.addEventListener('focus', handleWindowFocusOrVisible);
    document.addEventListener('visibilitychange', handleWindowFocusOrVisible);
    window.addEventListener('auth:maintenance-mode', handleMaintenanceBroadcast);
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
      window.removeEventListener('auth:maintenance-mode', handleMaintenanceBroadcast);
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

      // If account has MFA enabled, return challenge details for OTP verification step
      if (data.mfa_required) {
        return {
          success: false,
          mfaRequired: true,
          mfaToken: data.mfa_token,
          maskedEmail: data.masked_email,
          expiresIn: data.expires_in || 600,
          message: response.data?.message || 'Multifactor authentication required.',
        };
      }

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
      const resData = err.response?.data || {};
      const errors = resData.errors || {};
      const extraData = resData.data || {};
      const message = resData.message || 'Login failed. Please try again.';
      const status = err.response?.status;

      const isMaintenance = Boolean(status === 503 || extraData.maintenance_mode || resData.code === 'MAINTENANCE_MODE_ACTIVE');
      const isSuspended = Boolean(extraData.is_suspended || errors.is_suspended || message.toLowerCase().includes('suspended'));
      const isLocked = Boolean(status === 429 || extraData.is_locked || errors.is_locked);
      const remainingSeconds = Number(extraData.remaining_seconds || errors.remaining_seconds || 0);
      const remainingAttempts = extraData.remaining_attempts ?? errors.remaining_attempts ?? null;
      const lockoutUntil = extraData.lockout_until || errors.lockout_until || null;

      return {
        success: false,
        message,
        isMaintenance,
        maintenance: extraData.maintenance_details || extraData.maintenance || null,
        isSuspended,
        isLocked,
        remainingSeconds,
        remainingAttempts,
        lockoutUntil,
      };
    }
  };

  /**
   * Verify MFA 6-digit OTP code to complete login.
   * @param {string} mfaToken
   * @param {string} otpCode
   * @returns {Promise<{ success: boolean, message?: string, role?: string, remainingAttempts?: number }>}
   */
  const verifyMfa = async (mfaToken, otpCode) => {
    try {
      const response = await apiVerifyMfa({ mfa_token: mfaToken, otp_code: otpCode });
      const data      = response.data?.data || {};
      const userData  = data.user;
      const jwtToken  = data.access_token;
      const userPerms = userData?.permissions || [];

      user.value        = userData;
      role.value        = userData?.role;
      permissions.value = userPerms;
      token.value       = jwtToken;

      if (jwtToken) {
        sessionStorage.setItem('token', jwtToken);
      }
      sessionStorage.setItem('permissions', JSON.stringify(userPerms));

      window.__gso_session_superseded = false;

      // Start proactive session heartbeat
      startSessionHeartbeat();

      return { success: true, role: userData?.role };
    } catch (err) {
      const resData = err.response?.data || {};
      const errors = resData.errors || {};
      return {
        success: false,
        message: resData.message || 'Verification failed. Please check the 6-digit code.',
        remainingAttempts: resData.data?.remaining_attempts ?? errors.remaining_attempts ?? null,
      };
    }
  };

  /**
   * Resend MFA OTP code.
   * @param {string} mfaToken
   * @returns {Promise<{ success: boolean, message: string, mfaToken?: string, maskedEmail?: string, expiresIn?: number }>}
   */
  const resendMfa = async (mfaToken) => {
    try {
      const response = await apiResendMfa({ mfa_token: mfaToken });
      const data = response.data?.data || {};
      return {
        success: true,
        message: response.data?.message || 'A new verification code has been dispatched to your email.',
        mfaToken: data.mfa_token || mfaToken,
        maskedEmail: data.masked_email,
        expiresIn: data.expires_in || 600,
      };
    } catch (err) {
      const resData = err.response?.data || {};
      return {
        success: false,
        message: resData.message || 'Unable to resend verification code. Please wait and try again.',
      };
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
   * @param {{ first_name?, last_name?, contact_number?, email? }} data
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

  /**
   * Assume sub-unit head dashboard coverage as Acting Unit Head.
   * Terminates active session of the unit head and registers delegated director session.
   * @param {string} unitCode - 'FGMU' | 'LEAU' | 'SSU'
   */
  const assumeUnitHead = async (unitCode) => {
    try {
      const response = await assumeUnitHeadApi(unitCode);
      const data     = response.data?.data || {};
      const userData = data.user;
      const jwtToken = data.access_token;
      const userPerms = userData?.permissions || [];

      user.value        = userData;
      role.value        = userData?.role || 'admin';
      permissions.value = userPerms;
      token.value       = jwtToken;

      if (jwtToken) {
        sessionStorage.setItem('token', jwtToken);
      }
      sessionStorage.setItem('permissions', JSON.stringify(userPerms));

      startSessionHeartbeat();

      return {
        success: true,
        message: response.data?.message || `Assumed ${unitCode} head dashboard successfully.`,
        redirectUrl: data.redirect_url || `/admin/${unitCode.toLowerCase()}`,
      };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to switch to unit head dashboard.';
      return { success: false, message };
    }
  };

  /**
   * Revert from Acting Unit Head back to Executive Director dashboard.
   */
  const revertToDirector = async () => {
    try {
      const response = await revertUnitHeadApi();
      const data     = response.data?.data || {};
      const userData = data.user;
      const jwtToken = data.access_token;
      const userPerms = userData?.permissions || [];

      user.value        = userData;
      role.value        = userData?.role || 'director';
      permissions.value = userPerms;
      token.value       = jwtToken;

      if (jwtToken) {
        sessionStorage.setItem('token', jwtToken);
      }
      sessionStorage.setItem('permissions', JSON.stringify(userPerms));

      startSessionHeartbeat();

      return {
        success: true,
        message: response.data?.message || 'Returned to Director dashboard successfully.',
        redirectUrl: data.redirect_url || '/director/dashboard',
      };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to return to Director dashboard.';
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
    nameExtension,
    contactNumber,
    capitalizedRole,
    studentType,
    organizationName,
    college,
    unitId,
    isActingHead,
    actingUnitCode,
    actingUnitName,
    isDeactivated,
    hasPermission,
    avatarUrl,
    avatarVersion,
    avatarBlobPreview,
    setAvatarBlobPreview,
    updateAvatar,
    setUser,
    login,
    verifyMfa,
    resendMfa,
    logout,
    checkAuth,
    refreshProfile,
    updateProfile,
    verifySession,
    startSessionHeartbeat,
    stopSessionHeartbeat,
    isMaintenanceActive,
    maintenanceMessage,
    maintenanceCountdown,
    showMaintenanceModal,
    triggerMaintenanceEviction,
    executeEvictionLogout,
    stopMaintenanceTicker,
    setMaintenanceStatus,
    assumeUnitHead,
    revertToDirector,
    _setAuth,
  };
}, {
  persist: {
    storage: typeof window !== 'undefined' && typeof sessionStorage !== 'undefined' ? sessionStorage : undefined,
    pick: ['user', 'role', 'token', 'permissions'],
  },
});
