import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { login as apiLogin, logout as apiLogout, getMe, updateProfile as apiUpdateProfile } from '@/api/auth';

/**
 * Auth Store — Pinia
 *
 * Manages authentication state: authenticated user profile and role.
 * Tokens are securely stored and managed via HttpOnly cookies (inaccessible to JS).
 * Safe user metadata is persisted to sessionStorage for fast UI rendering across same-tab navigations.
 */
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const role = ref(null);

  // ---------------------------------------------------------------------------
  // Computed
  // ---------------------------------------------------------------------------

  const isAuthenticated = computed(() => !!user.value);

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
  // Actions
  // ---------------------------------------------------------------------------

  /**
   * Login via API — validates credentials.
   * HttpOnly cookie is set automatically by the backend.
   * Stores user profile and role in state.
   *
   * @param {string} identifier  - Student ID or email
   * @param {string} password
   * @returns {Promise<{ success: boolean, message: string, role?: string }>}
   */
  const login = async (identifier, password) => {
    try {
      const response = await apiLogin(identifier, password);
      const { user: userData } = response.data.data;

      user.value = userData;
      role.value = userData.role;

      // Clean up any legacy tokens from sessionStorage
      sessionStorage.removeItem('token');

      return { success: true, role: userData.role };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, message };
    }
  };

  /**
   * Logout — clears local user state, notifies the backend to invalidate
   * the active session, and deletes the HttpOnly cookie.
   */
  const logout = async () => {
    try {
      await apiLogout();
    } catch {
      // Ignore errors on logout — clear client state regardless
    } finally {
      user.value = null;
      role.value = null;
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('auth');
    }
  };

  /**
   * Verify session status against the backend using the HttpOnly cookie.
   * Useful during app initialization and route validation.
   */
  const checkAuth = async () => {
    try {
      const response = await getMe();
      user.value = response.data.data.user;
      role.value = response.data.data.user.role;
      return true;
    } catch {
      user.value = null;
      role.value = null;
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('auth');
      return false;
    }
  };

  /**
   * Refresh the user's profile from the backend (e.g. after profile edits).
   */
  const refreshProfile = async () => {
    try {
      const response = await getMe();
      user.value = response.data.data.user;
      role.value = response.data.data.user.role;
    } catch {
      // Silently fail — stale data is acceptable here
    }
  };

  /**
   * Update the current user's name or contact number.
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
  const _setAuth = (userData, userRole) => {
    user.value = userData;
    role.value = userRole;
  };

  return {
    user,
    role,
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
    _setAuth,
  };
}, {
  persist: {
    storage: sessionStorage,
    pick: ['user', 'role'],
  },
});
