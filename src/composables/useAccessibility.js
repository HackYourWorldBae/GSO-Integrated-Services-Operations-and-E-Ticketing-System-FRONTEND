import { ref, watch } from 'vue';

const STORAGE_KEY = 'gso_comfort_view';

// Shared singleton state
const isComfortView = ref(false);

// Initialize from localStorage safely
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      isComfortView.value = saved === 'true';
    }
  } catch {
    // LocalStorage might be disabled in private browsing
  }

  // Synchronize document class immediately on boot
  if (isComfortView.value) {
    document.documentElement.classList.add('comfort-view');
  } else {
    document.documentElement.classList.remove('comfort-view');
  }
}

// Watch changes to keep DOM and localStorage in sync
watch(isComfortView, (newValue) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, String(newValue));
    } catch {}

    if (newValue) {
      document.documentElement.classList.add('comfort-view');
    } else {
      document.documentElement.classList.remove('comfort-view');
    }
  }
});

export function useAccessibility() {
  const toggleComfortView = () => {
    isComfortView.value = !isComfortView.value;
  };

  const setComfortView = (value) => {
    isComfortView.value = Boolean(value);
  };

  return {
    isComfortView,
    toggleComfortView,
    setComfortView
  };
}
