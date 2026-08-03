import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { login as apiLogin, logout as apiLogout, getMe, updateProfile as apiUpdateProfile } from '@/api/auth';

/**
 * Auth Store — Pinia
 *
 * Manages authentication state: JWT token, user profile, and role.
 * Persisted to localStorage so users stay logged in across page refreshes.
 *
 * The token property is what the api/client.js interceptor reads to
 * inject the Bearer header on every request.
 */
export const useAuthStore = defineStore('auth', () => {
  const user  = ref(null);
  const role  = ref(null);
  const token = ref(null); // JWT access token — read by api/client.js interceptor

  // ---------------------------------------------------------------------------
  // Computed
  // ---------------------------------------------------------------------------

  const isAuthenticated = computed(() => !!token.value);

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
   * Login via API — validates credentials and stores JWT + user profile.
   *
   * @param {string} identifier  - Student ID (7 digits) or email
   * @param {string} password
   * @returns {Promise<{ success: boolean, message: string, role?: string }>}
   */
  const login = async (identifier, password) => {
    try {
      const response = await apiLogin(identifier, password);
      const { access_token, user: userData } = response.data.data;

      token.value = access_token;
      user.value  = userData;
      role.value  = userData.role;
      
      // Immediately set the token in localStorage to avoid async Pinia persistence race conditions
      // This ensures api/client.js has it instantly when routing to the dashboard.
      localStorage.setItem('token', access_token);

      return { success: true, role: userData.role };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, message };
    }
  };

  /**
   * Logout — clears local state and notifies the backend.
   */
  const logout = async () => {
    try {
      if (token.value) {
        await apiLogout();
      }
    } catch {
      // Ignore errors on logout — clear state regardless
    } finally {
      user.value  = null;
      role.value  = null;
      token.value = null;
      localStorage.removeItem('token');
    }
  };

  /**
   * Refresh the user's profile from the backend (useful after profile edits).
   */
  const refreshProfile = async () => {
    try {
      const response = await getMe();
      user.value = response.data.data.user;
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

  // Internal setter used during SSR or token refresh (not typically called directly)
  const _setAuth = (userData, userRole, authToken) => {
    user.value  = userData;
    role.value  = userRole;
    token.value = authToken;
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
    refreshProfile,
    updateProfile,
    _setAuth,
  };
}, {
  persist: true, // Persists the entire store to localStorage via pinia-plugin-persistedstate
});
