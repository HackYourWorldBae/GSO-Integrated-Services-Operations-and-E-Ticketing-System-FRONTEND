import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const STORAGE_KEY = 'gso_last_active_time';
const IDLE_LIMIT_MS = 14 * 60 * 1000; // 14 minutes
const WARNING_DURATION_SEC = 60;       // 60 seconds countdown (Total: 15 minutes)
const THROTTLE_MS = 2000;              // Throttle activity event updates

export function useIdleTimeout() {
  const router = useRouter();
  const authStore = useAuthStore();

  const isWarningVisible = ref(false);
  const remainingSeconds = ref(WARNING_DURATION_SEC);

  let checkIntervalId = null;
  let lastRecordedEventTime = 0;
  let isListening = false;

  const getStoredLastActive = () => {
    if (typeof window === 'undefined') return Date.now();
    const val = localStorage.getItem(STORAGE_KEY);
    const parsed = val ? parseInt(val, 10) : NaN;
    return isNaN(parsed) ? Date.now() : parsed;
  };

  const updateActivityTimestamp = (force = false) => {
    const now = Date.now();
    if (!force && now - lastRecordedEventTime < THROTTLE_MS) {
      return;
    }
    lastRecordedEventTime = now;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, String(now));
    }
  };

  const handleUserActivity = () => {
    // Only register activity updates if warning is not currently blocking
    if (!isWarningVisible.value) {
      updateActivityTimestamp(false);
    }
  };

  const handleStorageChange = (event) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      const remoteTime = parseInt(event.newValue, 10);
      if (!isNaN(remoteTime)) {
        const elapsed = Date.now() - remoteTime;
        if (elapsed < IDLE_LIMIT_MS && isWarningVisible.value) {
          // Activity detected in another tab — dismiss warning
          isWarningVisible.value = false;
        }
      }
    }
  };

  const stayLoggedIn = () => {
    updateActivityTimestamp(true);
    isWarningVisible.value = false;
    remainingSeconds.value = WARNING_DURATION_SEC;
    // Ping session verification
    if (typeof authStore.verifySession === 'function') {
      authStore.verifySession();
    }
  };

  const logoutNow = async (reason = 'inactivity') => {
    stopIdleTracking();
    isWarningVisible.value = false;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    await authStore.logout();
    router.push({
      name: 'login',
      query: { timeout: reason === 'inactivity' ? '1' : undefined }
    });
  };

  const checkIdleStatus = () => {
    if (!authStore.isAuthenticated) {
      stopIdleTracking();
      return;
    }

    const lastActive = getStoredLastActive();
    const elapsed = Date.now() - lastActive;
    const totalLimitMs = IDLE_LIMIT_MS + WARNING_DURATION_SEC * 1000;

    if (elapsed >= totalLimitMs) {
      // 15 minutes expired
      logoutNow('inactivity');
    } else if (elapsed >= IDLE_LIMIT_MS) {
      // In 60-second warning phase
      isWarningVisible.value = true;
      const leftMs = totalLimitMs - elapsed;
      remainingSeconds.value = Math.max(0, Math.ceil(leftMs / 1000));
    } else {
      // Still active
      if (isWarningVisible.value) {
        isWarningVisible.value = false;
      }
    }
  };

  const startIdleTracking = () => {
    if (isListening || typeof window === 'undefined') return;
    isListening = true;

    updateActivityTimestamp(true);

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(evt => window.addEventListener(evt, handleUserActivity, { passive: true }));
    window.addEventListener('storage', handleStorageChange);

    checkIntervalId = setInterval(checkIdleStatus, 1000);
  };

  const stopIdleTracking = () => {
    if (!isListening || typeof window === 'undefined') return;
    isListening = false;

    if (checkIntervalId) {
      clearInterval(checkIntervalId);
      checkIntervalId = null;
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(evt => window.removeEventListener(evt, handleUserActivity));
    window.removeEventListener('storage', handleStorageChange);
  };

  // Automatically start or stop based on auth state
  watch(
    () => authStore.isAuthenticated,
    (isAuth) => {
      if (isAuth) {
        startIdleTracking();
      } else {
        stopIdleTracking();
        isWarningVisible.value = false;
      }
    },
    { immediate: true }
  );

  onMounted(() => {
    if (authStore.isAuthenticated) {
      startIdleTracking();
    }
  });

  onUnmounted(() => {
    stopIdleTracking();
  });

  return {
    isWarningVisible,
    remainingSeconds,
    stayLoggedIn,
    logoutNow,
    startIdleTracking,
    stopIdleTracking,
  };
}
