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
const lastOnlineTime = ref(Date.now());
const lastOfflineTime = ref(null);

const reconnectionCallbacks = new Set();
let healthProbeTimer = null;

let consecutiveFailures = 0;
const FAILURE_THRESHOLD = 3;
let offlineDebounceTimer = null;

/**
 * Record successful real API communication from anywhere in the app.
 * Resets failure counters and guarantees online state.
 */
export const recordNetworkActivity = (success = true) => {
  if (success) {
    consecutiveFailures = 0;
    if (offlineDebounceTimer) {
      clearTimeout(offlineDebounceTimer);
      offlineDebounceTimer = null;
    }
    if (!isOnline.value || wasOffline.value) {
      handleConnectionRestored();
    } else {
      isOnline.value = true;
      lastOnlineTime.value = Date.now();
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
      timeout: 8000, // 8s timeout to tolerate mobile cellular radio wake-ups
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });

    const isHealthy = response.status >= 200 && response.status < 300;
    if (isHealthy) {
      consecutiveFailures = 0;
      if (offlineDebounceTimer) {
        clearTimeout(offlineDebounceTimer);
        offlineDebounceTimer = null;
      }
      if (!isOnline.value || wasOffline.value) {
        handleConnectionRestored();
      } else {
        isOnline.value = true;
        lastOnlineTime.value = Date.now();
      }
      return true;
    }
    
    consecutiveFailures++;
    if (consecutiveFailures >= FAILURE_THRESHOLD) {
      handleConnectionLost();
    }
    return false;
  } catch (error) {
    // If the server explicitly responded with any HTTP status code (even 4xx/5xx), network is alive
    if (error.response) {
      consecutiveFailures = 0;
      if (!isOnline.value) handleConnectionRestored();
      return true;
    }
    
    consecutiveFailures++;
    if (consecutiveFailures >= FAILURE_THRESHOLD) {
      handleConnectionLost();
    }
    return false;
  } finally {
    isChecking.value = false;
  }
};

const handleConnectionLost = () => {
  if (isOnline.value) {
    console.warn('[NetworkMonitor] Connection to server lost. Entering offline resilience mode.');
    isOnline.value = false;
    wasOffline.value = true;
    lastOfflineTime.value = Date.now();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('network:offline'));
    }

    startPeriodicHealthProbe();
  }
};

const handleConnectionRestored = () => {
  const previouslyOffline = !isOnline.value || wasOffline.value;
  isOnline.value = true;
  lastOnlineTime.value = Date.now();
  stopPeriodicHealthProbe();

  if (previouslyOffline) {
    console.info('[NetworkMonitor] Network connectivity restored. Triggering application sync.');

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

    // Reset wasOffline flag after a short grace period for UI confirmation
    setTimeout(() => {
      wasOffline.value = false;
    }, 3000);
  }
};

const startPeriodicHealthProbe = () => {
  if (healthProbeTimer) return;
  healthProbeTimer = setInterval(async () => {
    if (typeof document !== 'undefined' && document.hidden) return;
    if (navigator.onLine) {
      await checkServerHealth();
    }
  }, 6000);
};

const stopPeriodicHealthProbe = () => {
  if (healthProbeTimer) {
    clearInterval(healthProbeTimer);
    healthProbeTimer = null;
  }
};

// Initialize event listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.info('[NetworkMonitor] Browser fired "online" event. Verifying server health...');
    consecutiveFailures = 0;
    checkServerHealth();
  });

  // Debounce offline events to prevent false alerts on mobile power-saving radio switches
  window.addEventListener('offline', () => {
    console.warn('[NetworkMonitor] Browser fired "offline" event. Verifying before entering offline mode...');
    if (offlineDebounceTimer) clearTimeout(offlineDebounceTimer);
    offlineDebounceTimer = setTimeout(async () => {
      if (!navigator.onLine) {
        await checkServerHealth();
      }
    }, 3000);
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
    lastOnlineTime: readonly(lastOnlineTime),
    lastOfflineTime: readonly(lastOfflineTime),
    checkHealth: checkServerHealth,
    onReconnected,
  };
};

export const networkMonitor = {
  isOnline,
  isChecking,
  wasOffline,
  checkServerHealth,
  onReconnected,
};

export default networkMonitor;
