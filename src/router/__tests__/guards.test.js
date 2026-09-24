import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { checkRouteAccess, getCanonicalHomeRoute } from '@/router';

describe('Router Page Guards & RBAC Boundaries', () => {
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

  const setSession = (role, unitCode = '', unitId = null, extra = {}) => {
    const user = {
      id: 1,
      role,
      unit_code: unitCode,
      unit_id: unitId,
      is_verified: 1,
      permissions: [
        'tickets.create', 'tickets.dispatch', 'tickets.view_all',
        'personnel.manage', 'reports.view', 'tickets.verify_close'
      ],
      ...extra,
    };
    globalThis.sessionStorage.setItem('token', 'mock-jwt-token');
    globalThis.sessionStorage.setItem('auth', JSON.stringify({
      user,
      role,
      token: 'mock-jwt-token',
    }));
  };

  describe('getCanonicalHomeRoute', () => {
    it('returns appropriate home routes for all roles and unit associations', () => {
      expect(getCanonicalHomeRoute('superadmin')).toBe('/superadmin/dashboard');
      expect(getCanonicalHomeRoute('director')).toBe('/director/dashboard');
      expect(getCanonicalHomeRoute('admin', 'FGMU')).toBe('/admin/fgmu');
      expect(getCanonicalHomeRoute('admin', 'LEAU')).toBe('/admin/leau');
      expect(getCanonicalHomeRoute('admin', 'SSU')).toBe('/admin/ssu');
      expect(getCanonicalHomeRoute('staff', 'FGMU')).toBe('/admin/fgmu');
      expect(getCanonicalHomeRoute('student')).toBe('/user/dashboard');
      expect(getCanonicalHomeRoute('employee')).toBe('/user/dashboard');
      expect(getCanonicalHomeRoute('worker')).toBe('/user/dashboard');
    });
  });

  describe('Unauthenticated Access', () => {
    it('redirects unauthenticated users to login', () => {
      const next = vi.fn();
      checkRouteAccess({ path: '/admin/fgmu', meta: { requiresAuth: true } }, {}, next);
      expect(next).toHaveBeenCalledWith({ name: 'login', query: { redirect: undefined } });
    });

    it('redirects unauthenticated users on protected path prefixes without explicit meta', () => {
      const next = vi.fn();
      checkRouteAccess({ path: '/director/dashboard', meta: {} }, {}, next);
      expect(next).toHaveBeenCalledWith({ name: 'login', query: { redirect: undefined } });
    });
  });

  describe('Authenticated Users on Auth Pages', () => {
    it('redirects authenticated users to their home dashboard when visiting login', () => {
      setSession('admin', 'FGMU', 1);
      const next = vi.fn();
      checkRouteAccess({ name: 'login', path: '/login', meta: {} }, {}, next);
      expect(next).toHaveBeenCalledWith('/admin/fgmu');
    });

    it('redirects authenticated student to user dashboard when visiting register', () => {
      setSession('student');
      const next = vi.fn();
      checkRouteAccess({ name: 'register', path: '/register', meta: {} }, {}, next);
      expect(next).toHaveBeenCalledWith('/user/dashboard');
    });
  });

  describe('Client / End-User Boundaries', () => {
    beforeEach(() => {
      setSession('student');
    });

    it('allows student to access their own dashboard and ticket pages', () => {
      const next = vi.fn();
      checkRouteAccess({ path: '/user/dashboard', meta: { requiresAuth: true, roles: ['student', 'employee', 'worker'] } }, {}, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('blocks student from accessing administrative dashboards', () => {
      const next = vi.fn();
      checkRouteAccess({ path: '/admin/fgmu', meta: { requiresAuth: true, roles: ['admin', 'staff'], unit: 'FGMU' } }, {}, next);
      expect(next).toHaveBeenCalledWith('/user/dashboard');
    });

    it('blocks student from accessing director approval queues and director views', () => {
      const next = vi.fn();
      checkRouteAccess({ path: '/director/fgmu/queues', meta: { requiresAuth: true, roles: ['director', 'superadmin'], unit: 'FGMU' } }, {}, next);
      expect(next).toHaveBeenCalledWith('/user/dashboard');
    });

    it('blocks student from accessing superadmin portal', () => {
      const next = vi.fn();
      checkRouteAccess({ path: '/superadmin/dashboard', meta: { requiresAuth: true, roles: ['superadmin'] } }, {}, next);
      expect(next).toHaveBeenCalledWith('/user/dashboard');
    });
  });

  describe('Unit Admin Boundaries (FGMU, LEAU, SSU)', () => {
    it('allows FGMU admin to access FGMU pages', () => {
      setSession('admin', 'FGMU', 1);
      const next = vi.fn();
      checkRouteAccess({ path: '/admin/fgmu/approved-tickets', meta: { requiresAuth: true, roles: ['admin'], unit: 'FGMU' } }, {}, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('blocks FGMU admin from accessing LEAU routes (jurisdiction mismatch)', () => {
      setSession('admin', 'FGMU', 1);
      const next = vi.fn();
      checkRouteAccess({ path: '/admin/leau/approved-tickets', meta: { requiresAuth: true, roles: ['admin'], unit: 'LEAU' } }, {}, next);
      expect(next).toHaveBeenCalledWith('/admin/fgmu');
    });

    it('blocks FGMU admin from accessing SSU routes (jurisdiction mismatch)', () => {
      setSession('admin', 'FGMU', 1);
      const next = vi.fn();
      checkRouteAccess({ path: '/admin/ssu/submitted-tickets', meta: { requiresAuth: true, roles: ['admin'], unit: 'SSU' } }, {}, next);
      expect(next).toHaveBeenCalledWith('/admin/fgmu');
    });

    it('blocks LEAU admin from accessing FGMU routes (jurisdiction mismatch)', () => {
      setSession('admin', 'LEAU', 2);
      const next = vi.fn();
      checkRouteAccess({ path: '/admin/fgmu/approved-tickets', meta: { requiresAuth: true, roles: ['admin'], unit: 'FGMU' } }, {}, next);
      expect(next).toHaveBeenCalledWith('/admin/leau');
    });

    it('blocks unit admins from accessing Director approval queues and Director dashboards', () => {
      setSession('admin', 'FGMU', 1);
      const nextQueue = vi.fn();
      checkRouteAccess({ path: '/director/fgmu/queues', meta: { requiresAuth: true, roles: ['director', 'superadmin'], unit: 'FGMU' } }, {}, nextQueue);
      expect(nextQueue).toHaveBeenCalledWith('/admin/fgmu');

      const nextDash = vi.fn();
      checkRouteAccess({ path: '/director/dashboard', meta: { requiresAuth: true, roles: ['director', 'superadmin'] } }, {}, nextDash);
      expect(nextDash).toHaveBeenCalledWith('/admin/fgmu');
    });

    it('blocks unit admins from accessing Superadmin views', () => {
      setSession('admin', 'FGMU', 1);
      const next = vi.fn();
      checkRouteAccess({ path: '/superadmin/dashboard', meta: { requiresAuth: true, roles: ['superadmin'] } }, {}, next);
      expect(next).toHaveBeenCalledWith('/admin/fgmu');
    });

    it('redirects unit admins away from end-user dashboard to their work dashboard', () => {
      setSession('admin', 'FGMU', 1);
      const next = vi.fn();
      checkRouteAccess({ path: '/user/dashboard', meta: { requiresAuth: true, roles: ['student', 'employee', 'worker'] } }, {}, next);
      expect(next).toHaveBeenCalledWith('/admin/fgmu');
    });
  });

  describe('Director Boundaries', () => {
    beforeEach(() => {
      setSession('director');
    });

    it('allows Director to access Director dashboard and approval queues', () => {
      const nextDash = vi.fn();
      checkRouteAccess({ path: '/director/dashboard', meta: { requiresAuth: true, roles: ['director', 'superadmin'] } }, {}, nextDash);
      expect(nextDash).toHaveBeenCalledWith();

      const nextQueue = vi.fn();
      checkRouteAccess({ path: '/director/fgmu/queues', meta: { requiresAuth: true, roles: ['director', 'superadmin'], unit: 'FGMU' } }, {}, nextQueue);
      expect(nextQueue).toHaveBeenCalledWith();
    });

    it('allows Director to access multi-unit archives and SSU submitted tickets', () => {
      const nextFgmuArch = vi.fn();
      checkRouteAccess({ path: '/admin/fgmu/archives', meta: { requiresAuth: true, roles: ['admin', 'director', 'superadmin'], unit: 'FGMU' } }, {}, nextFgmuArch);
      expect(nextFgmuArch).toHaveBeenCalledWith();

      const nextSsu = vi.fn();
      checkRouteAccess({ path: '/admin/ssu/submitted-tickets', meta: { requiresAuth: true, roles: ['admin', 'director', 'superadmin'], unit: 'SSU' } }, {}, nextSsu);
      expect(nextSsu).toHaveBeenCalledWith();
    });

    it('blocks Director from sub-unit operational dispatch and inventory tools', () => {
      const next = vi.fn();
      checkRouteAccess({ path: '/admin/fgmu/assign-workers', meta: { requiresAuth: true, roles: ['admin'], unit: 'FGMU' } }, {}, next);
      expect(next).toHaveBeenCalledWith('/director/dashboard');
    });

    it('blocks Director from Superadmin portal', () => {
      const next = vi.fn();
      checkRouteAccess({ path: '/superadmin/dashboard', meta: { requiresAuth: true, roles: ['superadmin'] } }, {}, next);
      expect(next).toHaveBeenCalledWith('/director/dashboard');
    });

    it('redirects Director away from end-user dashboard to executive dashboard', () => {
      const next = vi.fn();
      checkRouteAccess({ path: '/user/dashboard', meta: { requiresAuth: true, roles: ['student', 'employee', 'worker'] } }, {}, next);
      expect(next).toHaveBeenCalledWith('/director/dashboard');
    });
  });

  describe('Superadmin Privileges', () => {
    beforeEach(() => {
      setSession('superadmin');
    });

    it('allows Superadmin to access Superadmin portal and other workspaces', () => {
      const next = vi.fn();
      checkRouteAccess({ path: '/superadmin/dashboard', meta: { requiresAuth: true, roles: ['superadmin'] } }, {}, next);
      expect(next).toHaveBeenCalledWith();

      const nextUsers = vi.fn();
      checkRouteAccess({ path: '/superadmin/users', meta: { requiresAuth: true, roles: ['superadmin'] } }, {}, nextUsers);
      expect(nextUsers).toHaveBeenCalledWith();
    });
  });
});
