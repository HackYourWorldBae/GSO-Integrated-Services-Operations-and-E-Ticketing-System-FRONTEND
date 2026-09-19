import { describe, it, expect, beforeEach, vi } from 'vitest';

// Simple in-memory localStorage polyfill for Node-based test runner
const storage = {};
globalThis.localStorage = {
  getItem: (key) => (key in storage ? storage[key] : null),
  setItem: (key, val) => { storage[key] = String(val); },
  removeItem: (key) => { delete storage[key]; },
  clear: () => { Object.keys(storage).forEach((k) => delete storage[k]); },
};

import { isSoundEnabled, setSoundEnabled, toggleSoundEnabled, playNotificationSound } from '../sound';

describe('Dashboard Notification Sound Utility', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('defaults to enabled', () => {
    expect(isSoundEnabled()).toBe(true);
  });

  it('allows enabling and disabling sound', () => {
    setSoundEnabled(false);
    expect(isSoundEnabled()).toBe(false);
    expect(localStorage.getItem('gso_sound_enabled')).toBe('false');

    setSoundEnabled(true);
    expect(isSoundEnabled()).toBe(true);
    expect(localStorage.getItem('gso_sound_enabled')).toBe('true');
  });

  it('toggles sound enabled state', () => {
    expect(isSoundEnabled()).toBe(true);
    const toggled1 = toggleSoundEnabled();
    expect(toggled1).toBe(false);
    expect(isSoundEnabled()).toBe(false);

    const toggled2 = toggleSoundEnabled();
    expect(toggled2).toBe(true);
    expect(isSoundEnabled()).toBe(true);
  });

  it('safely handles playNotificationSound without throwing in non-browser or test env', () => {
    expect(() => playNotificationSound()).not.toThrow();
  });
});
