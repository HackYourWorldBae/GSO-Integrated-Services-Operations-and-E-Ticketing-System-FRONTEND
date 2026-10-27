import { ref, readonly } from 'vue';
import axios from 'axios';

// ============================================================================
// Network Monitoring & Fault Tolerance System
// Tracks browser online/offline status, validates actual backend connectivity,
// and orchestrates reconnection synchronization across the application.
// ============================================================================

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const isOnline = ref(typeof navigator !== 'undefined' ? navigator.onLine : true);
const isChecking = ref(false);
const wasOffline = ref(false);
const showRestoredNotice = ref(false);
const lastOnlineTime = ref(Date.now());
const lastOfflineTime = ref(null);

const reconnectionCallbacks = new Set();
let healthProbeTimer = null;
let restoredNoticeTimer = null;
let consecutiveFailures = 0;
const FAILURE_THRESHOLD = 2;

/**
 * Record successful real API communication from anywhere in the app.
 * Resets failure counters and guarantees online state.
 */
export const recordNetworkActivity = (success = true) => {
  if (success) {
    consecutiveFailures = 0;
    lastOnlineTime.value = Date.now();
    if (!isOnline.value) {
      handleConnectionRestored();
    }
  }
};

/**
 * Perform a lightweight HTTP probe to verify true end-to-end backend reachability.
 * Distinguishes between local Wi-Fi connectivity without internet and true server access.
 */
export const checkServerHealth = async () => {
  if (typeof window === 'undefined') return true;
  // If the browser tab is hidden or backgrounded on mobile, avoid triggering false alarms
  if (typeof document !== 'undefined' && document.hidden) return isOnline.value;

  isChecking.value = true;
  try {
    const healthUrl = `${BASE_URL.replace(/\/+$/, '')}/health?_probe=${Date.now()}`;
    const response = await axios.get(healthUrl, {
      timeout: 4000, // 4s timeout for fast response
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });

    const isHealthy = response.status >= 200 && response.status < 300;
    if (isHealthy) {
      consecutiveFailures = 0;
      handleConnectionRestored();
      return true;
    }
    
    consecutiveFailures++;
    if (consecutiveFailures >= FAILURE_THRESHOLD) {
      handleConnectionLost();
    }
    return false;
  } catch (error) {
    // If the server explicitly responded with any HTTP status code (even 4xx/5xx), network socket is alive
    if (error.response) {
      consecutiveFailures = 0;
      handleConnectionRestored();
      return true;
    }
    
    consecutiveFailures++;
    if (consecutiveFailures >= FAILURE_THRESHOLD || (typeof navigator !== 'undefined' && !navigator.onLine)) {
      handleConnectionLost();
    }
    return false;
  } finally {
    isChecking.value = false;
  }
};

export const handleConnectionLost = () => {
  if (isOnline.value) {
    console.warn('[NetworkMonitor] Connection to server lost. Entering offline resilience mode.');
    isOnline.value = false;
    wasOffline.value = true;
    lastOfflineTime.value = Date.now();

    // Immediately cancel any active restored notice
    showRestoredNotice.value = false;
    if (restoredNoticeTimer) {
      clearTimeout(restoredNoticeTimer);
      restoredNoticeTimer = null;
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('network:offline'));
    }

    startPeriodicHealthProbe();
  }
};

export const handleConnectionRestored = () => {
  // If already online and not recovering from offline state, do nothing
  if (isOnline.value && !wasOffline.value) {
    return;
  }

  isOnline.value = true;
  wasOffline.value = false; // Reset immediately so concurrent API requests won't re-trigger
  lastOnlineTime.value = Date.now();
  consecutiveFailures = 0;
  stopPeriodicHealthProbe();

  console.info('[NetworkMonitor] Network connectivity restored. Triggering application sync.');

  // Display restored banner for exactly 3 seconds
  showRestoredNotice.value = true;
  if (restoredNoticeTimer) clearTimeout(restoredNoticeTimer);
  restoredNoticeTimer = setTimeout(() => {
    showRestoredNotice.value = false;
  }, 3000);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('network:online'));
    window.dispatchEvent(new CustomEvent('network:reconnected'));
  }

  // Execute registered reconnection callbacks
  reconnectionCallbacks.forEach((cb) => {
    try {
      cb();
    } catch (err) {
      console.error('[NetworkMonitor] Error in reconnection callback:', err);
    }
  });
};

const startPeriodicHealthProbe = () => {
  if (healthProbeTimer) return;
  healthProbeTimer = setInterval(async () => {
    if (typeof document !== 'undefined' && document.hidden) return;
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      await checkServerHealth();
    }
  }, 8000);
};

const stopPeriodicHealthProbe = () => {
  if (healthProbeTimer) {
    clearInterval(healthProbeTimer);
    healthProbeTimer = null;
  }
};

// Initialize event listeners
if (typeof window !== 'undefined') {
  // 1. Instant offline event from browser/OS
  window.addEventListener('offline', () => {
    console.warn('[NetworkMonitor] Browser fired "offline" event. Immediately entering offline mode.');
    handleConnectionLost();
  });

  // 2. Instant suspected drop reported by API client (timeouts, network errors)
  window.addEventListener('network:suspected-drop', () => {
    console.warn('[NetworkMonitor] API client reported network error or timeout. Entering offline mode.');
    handleConnectionLost();
  });

  // 3. Browser online event
  window.addEventListener('online', async () => {
    console.info('[NetworkMonitor] Browser fired "online" event. Restoring connection...');
    consecutiveFailures = 0;
    // Fast path: immediately switch UI to restored state
    handleConnectionRestored();
    // Confirm reachability via server health check
    await checkServerHealth();
  });
}

/**
 * Register a callback to execute whenever the connection is restored.
 * Returns an unregister function.
 */
export const onReconnected = (callback) => {
  if (typeof callback !== 'function') return () => {};
  reconnectionCallbacks.add(callback);
  return () => {
    reconnectionCallbacks.delete(callback);
  };
};

/**
 * Composable for components needing reactive network status.
 */
export const useNetworkStatus = () => {
  return {
    isOnline: readonly(isOnline),
    isChecking: readonly(isChecking),
    wasOffline: readonly(wasOffline),
    showRestoredNotice: readonly(showRestoredNotice),
    lastOnlineTime: readonly(lastOnlineTime),
    lastOfflineTime: readonly(lastOfflineTime),
    checkHealth: checkServerHealth,
    onReconnected,
    setOffline: handleConnectionLost,
    setOnline: handleConnectionRestored,
  };
};

export const networkMonitor = {
  isOnline,
  isChecking,
  wasOffline,
  showRestoredNotice,
  checkServerHealth,
  onReconnected,
  handleConnectionLost,
  handleConnectionRestored,
};

export default networkMonitor;
