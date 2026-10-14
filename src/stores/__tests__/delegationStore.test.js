import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import * as authApi from '@/api/auth';

vi.mock('@/api/auth', () => ({
  login: vi.fn(),
  logout: vi.fn(),
  getMe: vi.fn(),
  updateProfile: vi.fn(),
  checkSessionApi: vi.fn(),
  assumeUnitHeadApi: vi.fn(),
  revertUnitHeadApi: vi.fn(),
}));

describe('Auth Store — Sub-Unit Head Delegation Actions', () => {
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

  it('assumeUnitHead updates user role to admin, stores delegated token, and sets acting head flags', async () => {
    authApi.assumeUnitHeadApi.mockResolvedValueOnce({
      data: {
        status: true,
        message: 'Successfully assumed FGMU head dashboard.',
        data: {
          access_token: 'mock-delegated-jwt',
          redirect_url: '/admin/fgmu',
          user: {
            id: 'director-123',
            first_name: 'Engr. Director',
            last_name: 'Official',
            role: 'admin',
            unit_id: 1,
            unit_code: 'FGMU',
            is_acting_head: true,
            original_role: 'director',
            acting_unit_code: 'FGMU',
            acting_unit_name: 'Facilities & Grounds Management Unit',
            permissions: ['tickets.dispatch', 'tickets.assign_worker', 'personnel.manage'],
          },
        },
      },
    });

    const store = useAuthStore();
    const result = await store.assumeUnitHead('FGMU');

    expect(result.success).toBe(true);
    expect(result.redirectUrl).toBe('/admin/fgmu');
    expect(store.role).toBe('admin');
    expect(store.isActingHead).toBe(true);
    expect(store.actingUnitCode).toBe('FGMU');
    expect(store.token).toBe('mock-delegated-jwt');
    expect(sessionStorage.getItem('token')).toBe('mock-delegated-jwt');
  });

  it('revertToDirector restores director role and clears acting head flags', async () => {
    authApi.revertUnitHeadApi.mockResolvedValueOnce({
      data: {
        status: true,
        message: 'Returned to Director dashboard successfully.',
        data: {
          access_token: 'mock-director-jwt',
          redirect_url: '/director/dashboard',
          user: {
            id: 'director-123',
            first_name: 'Engr. Director',
            last_name: 'Official',
            role: 'director',
            unit_id: null,
            is_acting_head: false,
            original_role: null,
            acting_unit_code: null,
            permissions: ['tickets.view_all', 'reports.view'],
          },
        },
      },
    });

    const store = useAuthStore();
    // Simulate current state is acting head
    store.user = { id: 'director-123', is_acting_head: true, role: 'admin' };
    store.role = 'admin';

    const result = await store.revertToDirector();

    expect(result.success).toBe(true);
    expect(result.redirectUrl).toBe('/director/dashboard');
    expect(store.role).toBe('director');
    expect(store.isActingHead).toBe(false);
    expect(store.token).toBe('mock-director-jwt');
  });
});
