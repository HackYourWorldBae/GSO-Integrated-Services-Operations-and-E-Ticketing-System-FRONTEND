import axios from 'axios';
import { sanitizeObject, getSecurityHeaders } from '@/utils/security';

// ============================================================================
// API Client — GSO Integrated Services Operations & E-Ticketing System
//
// This is the single Axios instance used by all api/* module files.
// It automatically:
//   1. Attaches the JWT Bearer token from Pinia persisted store.
//   2. Sanitizes outgoing JSON payloads against XSS injection.
//   3. Adds security headers (X-Requested-With, X-Content-Type-Options).
//   4. Dispatches a global 'auth:unauthorized' event on 401 so the router
//      can cleanly redirect to login without circular dependencies.
// ============================================================================

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Required for CORS + credentials (must match supportsCredentials: true in CI4 Cors.php)
  withCredentials: true,
  timeout: 15000, // 15 second request timeout
});

// ----------------------------------------------------------------------------
// Request Interceptor
// ----------------------------------------------------------------------------
apiClient.interceptors.request.use(
  (config) => {
    // 1. Attach security headers
    const securityHeaders = getSecurityHeaders?.() ?? {};
    Object.assign(config.headers, securityHeaders);

    // 2. Inject Bearer token from Pinia persisted auth store
    try {
      const piniaAuth  = JSON.parse(localStorage.getItem('auth') || '{}');
      const token      = piniaAuth?.token || localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Fail silently — the JWT filter on the backend will handle the missing token
    }

    // 3. Sanitize outgoing JSON payloads (skip FormData — file uploads handled separately)
    if (config.data && !(config.data instanceof FormData) && typeof config.data === 'object') {
      config.data = sanitizeObject(config.data);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ----------------------------------------------------------------------------
// Response Interceptor
// ----------------------------------------------------------------------------
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (typeof window !== 'undefined') {
      if (status === 401) {
        // Dispatch global event for session expiration / unauthorized access
        window.dispatchEvent(new CustomEvent('auth:unauthorized', { detail: error }));
      } else if (status === 403) {
        // Dispatch global event for permission / role violations
        window.dispatchEvent(new CustomEvent('auth:forbidden', { detail: error }));
      } else if (status === 429) {
        // Dispatch global event when API throttling / rate limit is hit
        window.dispatchEvent(new CustomEvent('api:rate-limited', { detail: error }));
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
