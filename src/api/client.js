import axios from 'axios';
import { sanitizeObject, getSecurityHeaders } from '@/utils/security';

// ============================================================================
// API Client — GSO Integrated Services Operations & E-Ticketing System
//
// This is the single Axios instance used by all api/* module files.
// It automatically:
//   1. Attaches the JWT Bearer token from Pinia persisted store (sessionStorage).
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
  // Automatically send and receive HttpOnly cookies for secure session authentication
  withCredentials: true,
  timeout: 12000, // 12 second request timeout to quickly detect dead sockets
});

// ----------------------------------------------------------------------------
// Request Interceptor
// ----------------------------------------------------------------------------
apiClient.interceptors.request.use(
  (config) => {
    // 1. Attach security headers
    const securityHeaders = getSecurityHeaders?.() ?? {};
    Object.assign(config.headers, securityHeaders);

    // 2. Attach Authorization header if a Bearer token is provided
    try {
      const piniaAuth = JSON.parse(sessionStorage.getItem('auth') || '{}');
      const token     = piniaAuth?.token || sessionStorage.getItem('token');
      if (token) {
        if (typeof config.headers.set === 'function') {
          config.headers.set('Authorization', `Bearer ${token}`);
        } else {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
    } catch {
      // Fail silently — the HttpOnly cookie will be automatically used by the browser
    }

    // 3. Sanitize outgoing JSON payloads (skip FormData — file uploads handled separately)
    if (config.data instanceof FormData) {
      if (config.headers && typeof config.headers.delete === 'function') {
        config.headers.delete('Content-Type');
        config.headers.delete('content-type');
      } else if (config.headers) {
        delete config.headers['Content-Type'];
        delete config.headers['content-type'];
      }
    } else if (config.data && typeof config.data === 'object') {
      config.data = sanitizeObject(config.data);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ----------------------------------------------------------------------------
// Response Interceptor with Fault Tolerance & Auto-Retry
// ----------------------------------------------------------------------------
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const config = error.config;
    const status = error.response?.status;
    const errorCode = error.response?.data?.code;

    // 1. Detect Network Disconnections / Timeouts
    const isNetworkError = !error.response || error.code === 'ECONNABORTED' || error.message?.includes('Network Error');

    if (isNetworkError && typeof window !== 'undefined') {
      // Inform the network monitor of a suspected drop
      window.dispatchEvent(new CustomEvent('network:suspected-drop', { detail: error }));

      // Fault tolerance: Auto-retry idempotent GET requests up to 2 times
      const isGet = (config?.method || 'get').toLowerCase() === 'get';
      const retryCount = config?.__retryCount || 0;
      const MAX_RETRIES = 2;

      if (isGet && config && retryCount < MAX_RETRIES) {
        config.__retryCount = retryCount + 1;
        const delayMs = config.__retryCount === 1 ? 1200 : 2500;
        
        console.warn(`[API Client] Network interruption detected for ${config.url}. Auto-retrying (attempt ${config.__retryCount}/${MAX_RETRIES}) in ${delayMs}ms...`);
        
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        return apiClient(config);
      }
    }

    // 2. Authentication & Authorization Lifecycle Handling
    if (typeof window !== 'undefined') {
      if (status === 401) {
        if (errorCode === 'SESSION_SUPERSEDED') {
          window.__gso_session_superseded = true;
          // Dispatch dedicated event when session was invalidated by another device login
          window.dispatchEvent(new CustomEvent('auth:session-superseded', { detail: error }));
        } else {
          // Dispatch generic unauthorized event only if a superseded session modal is not already active
          if (!window.__gso_session_superseded) {
            window.dispatchEvent(new CustomEvent('auth:unauthorized', { detail: error }));
          }
        }
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
