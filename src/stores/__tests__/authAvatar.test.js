import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '@/stores/auth';

vi.mock('@/api/auth', () => ({
  login: vi.fn(),
  logout: vi.fn(),
  getMe: vi.fn(),
  updateProfile: vi.fn(),
  checkSessionApi: vi.fn(),
  assumeUnitHeadApi: vi.fn(),
  revertUnitHeadApi: vi.fn(),
}));

describe('Auth Store — User Avatar Reactivity & URL Resolution', () => {
  let sessionStore = new Map();

  beforeEach(() => {
    setActivePinia(createPinia());
    sessionStore = new Map();

    globalThis.sessionStorage = {
      getItem: (key) => sessionStore.get(key) ?? null,
      setItem: (key, val) => sessionStore.set(key, String(val)),
      removeItem: (key) => sessionStore.delete(key),
      clear: () => sessionStore.clear(),
    };

    vi.clearAllMocks();
  });

  it('returns null when user has no avatar_path', () => {
    const authStore = useAuthStore();
    authStore.user = { id: 1, first_name: 'John', last_name: 'Doe' };
    expect(authStore.avatarUrl).toBeNull();
  });

  it('resolves avatarUrl with apiBase, user id, and cache-busting tokens when avatar_path is set', () => {
    const authStore = useAuthStore();
    authStore.user = {
      id: 42,
      first_name: 'Jane',
      avatar_path: 'avatars/avatar_42_123456.png',
      updated_at: '2026-10-27 10:00:00',
    };

    expect(authStore.avatarUrl).toContain('/auth/avatar/42');
    expect(authStore.avatarUrl).toContain('avatars%2Favatar_42_123456.png');
  });

  it('provides instant optimistic preview when setAvatarBlobPreview is called', () => {
    const authStore = useAuthStore();
    authStore.user = { id: 5, avatar_path: 'avatars/avatar_5_old.png' };

    const blobUrl = 'blob:http://localhost:5173/fake-uuid-1234';
    authStore.setAvatarBlobPreview(blobUrl);

    expect(authStore.avatarUrl).toBe(blobUrl);
  });

  it('clears optimistic preview and updates avatar URL upon updateAvatar confirmation', () => {
    const authStore = useAuthStore();
    authStore.user = { id: 5, avatar_path: 'avatars/avatar_5_old.png' };

    const blobUrl = 'blob:http://localhost:5173/fake-uuid-1234';
    authStore.setAvatarBlobPreview(blobUrl);
    expect(authStore.avatarUrl).toBe(blobUrl);

    authStore.updateAvatar({
      id: 5,
      avatar_path: 'avatars/avatar_5_new.png',
      updated_at: '2026-10-27 12:30:00',
    });

    expect(authStore.avatarUrl).not.toBe(blobUrl);
    expect(authStore.avatarUrl).toContain('avatars%2Favatar_5_new.png');
    expect(authStore.user.avatar_path).toBe('avatars/avatar_5_new.png');
  });

  it('retains absolute URLs if avatar_path is already a full external URL', () => {
    const authStore = useAuthStore();
    authStore.user = {
      id: 10,
      avatar_path: 'https://example.com/photos/profile.jpg',
    };

    expect(authStore.avatarUrl).toBe('https://example.com/photos/profile.jpg');
  });
});
