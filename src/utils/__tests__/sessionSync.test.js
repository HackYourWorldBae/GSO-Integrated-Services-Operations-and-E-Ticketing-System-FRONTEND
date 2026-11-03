import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { broadcastAuthEvent, setupCrossTabSessionSync, _resetChannelForTesting } from '@/utils/sessionSync';

describe('Cross-Tab Session Synchronization (sessionSync.js)', () => {
  let originalBroadcastChannel;
  let channelListeners = new Set();
  let storageListeners = new Set();
  let postedMessages = [];

  beforeEach(() => {
    postedMessages = [];
    channelListeners = new Set();
    storageListeners = new Set();
    _resetChannelForTesting();

    originalBroadcastChannel = globalThis.BroadcastChannel;

    globalThis.BroadcastChannel = class MockBroadcastChannel {
      constructor(name) {
        this.name = name;
      }
      postMessage(msg) {
        postedMessages.push(msg);
      }
      addEventListener(event, cb) {
        if (event === 'message') channelListeners.add(cb);
      }
      removeEventListener(event, cb) {
        if (event === 'message') channelListeners.delete(cb);
      }
      close() {}
    };

    if (typeof window !== 'undefined') {
      window.BroadcastChannel = globalThis.BroadcastChannel;
    }

    globalThis.window = globalThis.window || {};
    globalThis.window.addEventListener = (event, cb) => {
      if (event === 'storage') storageListeners.add(cb);
    };
    globalThis.window.removeEventListener = (event, cb) => {
      if (event === 'storage') storageListeners.delete(cb);
    };
  });

  afterEach(() => {
    _resetChannelForTesting();
    globalThis.BroadcastChannel = originalBroadcastChannel;
    if (typeof window !== 'undefined') {
      window.BroadcastChannel = originalBroadcastChannel;
    }
    vi.clearAllMocks();
  });

  it('broadcasts AUTH_LOGIN event with payload and timestamp', () => {
    broadcastAuthEvent('AUTH_LOGIN', { userId: 42, role: 'student' });
    expect(postedMessages.length).toBeGreaterThan(0);
    const lastMsg = postedMessages[postedMessages.length - 1];
    expect(lastMsg.type).toBe('AUTH_LOGIN');
    expect(lastMsg.userId).toBe(42);
    expect(lastMsg.role).toBe('student');
    expect(lastMsg.timestamp).toBeDefined();
  });

  it('broadcasts AUTH_LOGOUT event', () => {
    broadcastAuthEvent('AUTH_LOGOUT');
    expect(postedMessages.length).toBeGreaterThan(0);
    const lastMsg = postedMessages[postedMessages.length - 1];
    expect(lastMsg.type).toBe('AUTH_LOGOUT');
  });

  it('triggers onLogin handler when receiving incoming AUTH_LOGIN from another tab', () => {
    const onLogin = vi.fn();
    const cleanup = setupCrossTabSessionSync({ onLogin });

    // Simulate event sent from a distinct tab
    const incomingEvent = {
      type: 'AUTH_LOGIN',
      userId: 99,
      role: 'admin',
      tabId: 'other-tab-id',
      timestamp: Date.now() + 10,
    };

    channelListeners.forEach(cb => cb({ data: incomingEvent }));

    expect(onLogin).toHaveBeenCalledWith(incomingEvent);
    cleanup();
  });

  it('triggers onLogout handler when receiving incoming AUTH_LOGOUT from another tab', () => {
    const onLogout = vi.fn();
    const cleanup = setupCrossTabSessionSync({ onLogout });

    const incomingEvent = {
      type: 'AUTH_LOGOUT',
      tabId: 'other-tab-id',
      timestamp: Date.now() + 20,
    };

    channelListeners.forEach(cb => cb({ data: incomingEvent }));

    expect(onLogout).toHaveBeenCalledWith(incomingEvent);
    cleanup();
  });

  it('ignores events originating from the same tabId to prevent redundant cycles', () => {
    const onLogin = vi.fn();
    const cleanup = setupCrossTabSessionSync({ onLogin });

    const sameTabId = window.__gso_tab_id;
    const selfEvent = {
      type: 'AUTH_LOGIN',
      userId: 1,
      tabId: sameTabId,
      timestamp: Date.now() + 30,
    };

    channelListeners.forEach(cb => cb({ data: selfEvent }));

    expect(onLogin).not.toHaveBeenCalled();
    cleanup();
  });
});
