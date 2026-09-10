import { createRouter, createWebHistory } from 'vue-router';
import Swal from 'sweetalert2';
import { useAuthStore } from '@/stores/auth';
const LandingView = () => import('../views/LandingView.vue');
const LoginView = () => import('../views/auth/LoginView.vue');

// Lazy-loaded route components for performance optimization & code splitting
const ServicesListView = () => import('../views/ServicesListView.vue');
const User_Dashboard = () => import('../views/dashboards/user/User_Dashboard.vue');
const FGMU_Dashboard = () => import('../views/dashboards/admin/fgmu/FGMU_Dashboard.vue');
const FGMU_TicketQueues = () => import('../views/dashboards/admin/fgmu/FGMU_TicketQueues.vue');
const LEAU_Dashboard = () => import('../views/dashboards/admin/leau/LEAU_Dashboard.vue');
const LEAU_TicketQueues = () => import('../views/dashboards/admin/leau/LEAU_TicketQueues.vue');
const SSU_Dashboard = () => import('../views/dashboards/admin/ssu/SSU_Dashboard.vue');
const SSU_IncidentTicketQueues = () => import('../views/dashboards/admin/ssu/SSU_IncidentTicketQueues.vue');
const Director_Dashboard = () => import('../views/dashboards/director/Director_Dashboard.vue');
const Director_FGMU = () => import('../views/dashboards/director/Director_FGMU.vue');
const Director_LEAU = () => import('../views/dashboards/director/Director_LEAU.vue');
const Director_SSU = () => import('../views/dashboards/director/Director_SSU.vue');
const FormsView = () => import('../views/FormsView.vue');
const FGMU_Dispatcher = () => import('../views/dashboards/dispatcher/fgmu/FGMU.vue');
const FGMU_Workers = () => import('../views/dashboards/dispatcher/fgmu/FGMU_Workers.vue');
const LEAU_Dispatcher = () => import('../views/dashboards/dispatcher/leau/LEAU.vue');
const LEAU_Workers = () => import('../views/dashboards/dispatcher/leau/LEAU_Workers.vue');

const FGMU_DispatchedTickets = () => import('../views/dashboards/dispatcher/fgmu/FGMU_DispatchedTickets.vue');
const LEAU_DispatchedTickets = () => import('../views/dashboards/dispatcher/leau/LEAU_DispatchedTickets.vue');
const FGMU_DispatcherProjectArchives = () => import('../views/dashboards/dispatcher/fgmu/FGMU_DispatcherProjectArchives.vue');
const LEAU_DispatcherProjectArchives = () => import('../views/dashboards/dispatcher/leau/LEAU_DispatcherProjectArchives.vue');
const FGMU_DispatcherArchives = () => import('../views/dashboards/dispatcher/fgmu/FGMU_DispatcherArchives.vue');
const LEAU_DispatcherArchives = () => import('../views/dashboards/dispatcher/leau/LEAU_DispatcherArchives.vue');
const User_Tickets = () => import('../views/dashboards/user/User_Tickets.vue');
const User_Settings = () => import('../views/dashboards/user/User_Settings.vue');
const FGMU_Personnel = () => import('../views/dashboards/admin/fgmu/FGMU_Personnel.vue');
const LEAU_Personnel = () => import('../views/dashboards/admin/leau/LEAU_Personnel.vue');
const FGMU_Archives = () => import('../views/dashboards/admin/fgmu/FGMU_Archives.vue');
const LEAU_Archives = () => import('../views/dashboards/admin/leau/LEAU_Archives.vue');
const SSU_Archives = () => import('../views/dashboards/admin/ssu/SSU_Archives.vue');
const User_CompletedTickets = () => import('../views/dashboards/user/User_CompletedTickets.vue');
const FGMU_Announcements = () => import('../views/dashboards/admin/fgmu/FGMU_Announcements.vue');
const LEAU_Announcements = () => import('../views/dashboards/admin/leau/LEAU_Announcements.vue');
const ProjectsView = () => import('../views/ProjectsView.vue');
const ProjectsArchiveView = () => import('../views/ProjectsArchiveView.vue');
const FGMU_ProjectArchives = () => import('../views/dashboards/admin/fgmu/FGMU_ProjectArchives.vue');
const LEAU_ProjectArchives = () => import('../views/dashboards/admin/leau/LEAU_ProjectArchives.vue');
const Superadmin_Users = () => import('../views/dashboards/superadmin/Superadmin_Users.vue');
const Superadmin_AuditLogs = () => import('../views/dashboards/superadmin/Superadmin_AuditLogs.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsView
    },
    {
      path: '/projects/archives',
      name: 'projects-archives',
      component: ProjectsArchiveView
    },

    {
      path: '/services',
      name: 'services-list',
      component: ServicesListView,
      meta: { requiresAuth: true, permission: 'tickets.create', roles: ['student', 'employee', 'admin', 'dispatcher', 'director'] }
    },
    {
      path: '/user/dashboard',
      name: 'user-dashboard',
      component: User_Dashboard,
      meta: { requiresAuth: true, roles: ['student', 'employee', 'admin', 'dispatcher', 'director', 'worker'] }
    },
    {
      path: '/user/tickets',
      name: 'user-tickets',
      component: User_Tickets,
      meta: { requiresAuth: true, roles: ['student', 'employee', 'admin', 'dispatcher', 'director', 'worker'] }
    },
    {
      path: '/user/edit-profile',
      name: 'user-settings',
      component: User_Settings,
      meta: { requiresAuth: true, roles: ['student', 'employee', 'admin', 'dispatcher', 'director', 'worker'] }
    },
    {
      path: '/user/completed-tickets',
      name: 'user-completed-tickets',
      component: User_CompletedTickets,
      meta: { requiresAuth: true, roles: ['student', 'employee', 'admin', 'dispatcher', 'director', 'worker'] }
    },

    // Sub-unit Dashboards — FGMU Admin
    {
      path: '/admin/fgmu',
      name: 'fgmu-dashboard',
      component: FGMU_Dashboard,
      meta: { requiresAuth: true, roles: ['admin'], unit: 'FGMU' }
    },
    {
      path: '/admin/fgmu/queues',
      name: 'fgmu-ticket-queues',
      component: FGMU_TicketQueues,
      meta: { requiresAuth: true, roles: ['admin', 'dispatcher', 'director'], unit: 'FGMU', permission: 'tickets.view_all' }
    },
    {
      path: '/admin/fgmu/personnel',
      name: 'fgmu-admin-personnel',
      component: FGMU_Personnel,
      meta: { requiresAuth: true, roles: ['admin', 'dispatcher'], unit: 'FGMU', permission: 'personnel.manage' }
    },
    {
      path: '/admin/fgmu/archives',
      name: 'fgmu-admin-archives',
      component: FGMU_Archives,
      meta: { requiresAuth: true, roles: ['admin'], unit: 'FGMU' }
    },
    {
      path: '/admin/fgmu/announcements',
      name: 'fgmu-admin-announcements',
      component: FGMU_Announcements,
      meta: { requiresAuth: true, roles: ['admin'], unit: 'FGMU' }
    },
    {
      path: '/admin/fgmu/project-archives',
      name: 'fgmu-admin-project-archives',
      component: FGMU_ProjectArchives,
      meta: { requiresAuth: true, roles: ['admin'], unit: 'FGMU' }
    },

    // Sub-unit Dashboards — LEAU Admin
    {
      path: '/admin/leau',
      name: 'leau-dashboard',
      component: LEAU_Dashboard,
      meta: { requiresAuth: true, roles: ['admin'], unit: 'LEAU' }
    },
    {
      path: '/admin/leau/queues',
      name: 'leau-ticket-queues',
      component: LEAU_TicketQueues,
      meta: { requiresAuth: true, roles: ['admin', 'dispatcher', 'director'], unit: 'LEAU', permission: 'tickets.view_all' }
    },
    {
      path: '/admin/leau/personnel',
      name: 'leau-admin-personnel',
      component: LEAU_Personnel,
      meta: { requiresAuth: true, roles: ['admin', 'dispatcher'], unit: 'LEAU', permission: 'personnel.manage' }
    },
    {
      path: '/admin/leau/archives',
      name: 'leau-admin-archives',
      component: LEAU_Archives,
      meta: { requiresAuth: true, roles: ['admin'], unit: 'LEAU' }
    },
    {
      path: '/admin/leau/announcements',
      name: 'leau-admin-announcements',
      component: LEAU_Announcements,
      meta: { requiresAuth: true, roles: ['admin'], unit: 'LEAU' }
    },
    {
      path: '/admin/leau/project-archives',
      name: 'leau-admin-project-archives',
      component: LEAU_ProjectArchives,
      meta: { requiresAuth: true, roles: ['admin'], unit: 'LEAU' }
    },

    // Sub-unit Dashboards — SSU Admin
    {
      path: '/admin/ssu',
      name: 'ssu-dashboard',
      component: SSU_Dashboard,
      meta: { requiresAuth: true, roles: ['admin'], unit: 'SSU' }
    },
    {
      path: '/admin/ssu/queues/incidents',
      name: 'ssu-incident-queues',
      component: SSU_IncidentTicketQueues,
      meta: { requiresAuth: true, roles: ['admin', 'dispatcher', 'director'], unit: 'SSU', permission: 'tickets.view_all' }
    },
    {
      path: '/admin/ssu/archives',
      name: 'ssu-admin-archives',
      component: SSU_Archives,
      meta: { requiresAuth: true, roles: ['admin'], unit: 'SSU' }
    },

    // Superadmin Portal
    {
      path: '/superadmin',
      redirect: '/superadmin/users'
    },
    {
      path: '/superadmin/dashboard',
      redirect: '/superadmin/users'
    },
    {
      path: '/superadmin/users',
      name: 'superadmin-users',
      component: Superadmin_Users,
      meta: { requiresAuth: true, roles: ['superadmin', 'admin', 'director'], permission: 'users.provision' }
    },
    {
      path: '/superadmin/logs',
      name: 'superadmin-logs',
      component: Superadmin_AuditLogs,
      meta: { requiresAuth: true, roles: ['superadmin'] }
    },

    // Director Dashboards
    {
      path: '/director',
      redirect: '/director/dashboard'
    },
    {
      path: '/director/dashboard',
      name: 'director-dashboard',
      component: Director_Dashboard,
      meta: { requiresAuth: true, roles: ['director', 'admin', 'dispatcher'] }
    },
    {
      path: '/director/fgmu',
      name: 'director-fgmu',
      component: Director_FGMU,
      meta: { requiresAuth: true, roles: ['director', 'admin', 'dispatcher'], permission: 'reports.view' }
    },
    {
      path: '/director/leau',
      name: 'director-leau',
      component: Director_LEAU,
      meta: { requiresAuth: true, roles: ['director', 'admin', 'dispatcher'], permission: 'reports.view' }
    },
    {
      path: '/director/ssu',
      name: 'director-ssu',
      component: Director_SSU,
      meta: { requiresAuth: true, roles: ['director', 'admin', 'dispatcher'], permission: 'reports.view' }
    },
    {
      path: '/director/organizational-chart',
      redirect: '/director/dashboard'
    },
    {
      path: '/director/org-chart',
      redirect: '/director/dashboard'
    },

    // Dispatcher Dashboards — FGMU
    {
      path: '/dispatcher/fgmu',
      name: 'fgmu-dispatcher',
      component: FGMU_Dispatcher,
      meta: { requiresAuth: true, roles: ['dispatcher', 'admin'], unit: 'FGMU', permission: 'tickets.dispatch' }
    },
    {
      path: '/dispatcher/fgmu/workers',
      name: 'fgmu-workers',
      component: FGMU_Workers,
      meta: { requiresAuth: true, roles: ['dispatcher', 'admin'], unit: 'FGMU', permission: 'tickets.assign_worker' }
    },
    {
      path: '/dispatcher/fgmu/dispatched',
      name: 'fgmu-dispatched-tickets',
      component: FGMU_DispatchedTickets,
      meta: { requiresAuth: true, roles: ['dispatcher', 'admin'], unit: 'FGMU', permission: 'tickets.dispatch' }
    },
    {
      path: '/dispatcher/fgmu/archives',
      name: 'fgmu-dispatcher-archives',
      component: FGMU_DispatcherArchives,
      meta: { requiresAuth: true, roles: ['dispatcher', 'admin'], unit: 'FGMU' }
    },
    {
      path: '/dispatcher/fgmu/project-archives',
      name: 'fgmu-dispatcher-project-archives',
      component: FGMU_DispatcherProjectArchives,
      meta: { requiresAuth: true, roles: ['dispatcher', 'admin'], unit: 'FGMU' }
    },

    // Dispatcher Dashboards — LEAU
    {
      path: '/dispatcher/leau',
      name: 'leau-dispatcher',
      component: LEAU_Dispatcher,
      meta: { requiresAuth: true, roles: ['dispatcher', 'admin'], unit: 'LEAU', permission: 'tickets.dispatch' }
    },
    {
      path: '/dispatcher/leau/workers',
      name: 'leau-workers',
      component: LEAU_Workers,
      meta: { requiresAuth: true, roles: ['dispatcher', 'admin'], unit: 'LEAU', permission: 'tickets.assign_worker' }
    },
    {
      path: '/dispatcher/leau/dispatched',
      name: 'leau-dispatched-tickets',
      component: LEAU_DispatchedTickets,
      meta: { requiresAuth: true, roles: ['dispatcher', 'admin'], unit: 'LEAU', permission: 'tickets.dispatch' }
    },
    {
      path: '/dispatcher/leau/archives',
      name: 'leau-dispatcher-archives',
      component: LEAU_DispatcherArchives,
      meta: { requiresAuth: true, roles: ['dispatcher', 'admin'], unit: 'LEAU' }
    },
    {
      path: '/dispatcher/leau/project-archives',
      name: 'leau-dispatcher-project-archives',
      component: LEAU_DispatcherProjectArchives,
      meta: { requiresAuth: true, roles: ['dispatcher', 'admin'], unit: 'LEAU' }
    },

    // Service Intake Forms
    {
      path: '/services/forms',
      name: 'services-forms',
      component: FormsView,
      meta: { requiresAuth: true, permission: 'tickets.create', roles: ['student', 'employee', 'admin', 'dispatcher', 'director'] }
    }
  ]
});

// Global Navigation Guard — enforce authentication, role-based authorization, and unit scoping
router.beforeEach((to, from, next) => {
  let user = null;
  let role = null;
  let unit = '';

  try {
    const raw = sessionStorage.getItem('auth');
    if (raw) {
      const stored = JSON.parse(raw);
      user  = stored?.user  || stored?.state?.user  || null;
      role  = stored?.role  || stored?.state?.role  || user?.role || null;
      const unitMap = { 1: 'FGMU', 2: 'LEAU', 3: 'SSU' };
      unit  = String(user?.unit_code || user?.unit || unitMap[user?.unit_id] || '').toUpperCase();
    }
  } catch {
    sessionStorage.removeItem('auth');
  }

  // Helper: map a role and unit to its canonical landing view
  const getHomeRoute = (userRole, userUnit) => {
    if (userRole === 'superadmin') {
      return '/superadmin/users';
    }
    if (userRole === 'admin') {
      const u = (userUnit || 'fgmu').toLowerCase();
      return ['fgmu', 'leau', 'ssu'].includes(u) ? `/admin/${u}` : '/admin/fgmu';
    }
    if (userRole === 'dispatcher') {
      const u = (userUnit || 'fgmu').toLowerCase();
      return ['fgmu', 'leau'].includes(u) ? `/dispatcher/${u}` : '/dispatcher/fgmu';
    }
    if (userRole === 'director') {
      return '/director/dashboard';
    }
    return '/user/dashboard';
  };

  // 1. Prevent already-authenticated users from re-visiting login
  if (to.name === 'login' && user && role) {
    return next(getHomeRoute(role, unit));
  }

  // 2. Protect routes requiring authentication
  if (to.meta && to.meta.requiresAuth) {
    if (typeof window !== 'undefined' && window.__gso_session_superseded) {
      return next({ name: 'login' });
    }

    if (!user) {
      return next({ name: 'login', query: { redirect: to.fullPath } });
    }

    const authStore = useAuthStore();

    // 3. Dynamic Capability Permission Check (from RBAC Matrix)
    if (to.meta.permission) {
      // Allow access to user accounts view if user has matrix control capability
      const isMatrixControlAllowed = to.path === '/superadmin/users' && authStore.hasPermission('system.matrix_control');
      if (!authStore.hasPermission(to.meta.permission) && !isMatrixControlAllowed) {
        console.warn(`[Router Guard] Access denied to ${to.path}. Missing required capability: ${to.meta.permission}`);
        return next(getHomeRoute(role, unit));
      }
    }

    // 4. Enforce Role-Based Access Control
    if (to.meta.roles && Array.isArray(to.meta.roles)) {
      const allowedRoles = [...to.meta.roles];
      // Unit Head (admin) inherits dispatcher routes
      if (role === 'admin' && allowedRoles.includes('dispatcher')) {
        allowedRoles.push('admin');
      }

      const hasDirectRole = role && allowedRoles.includes(role);
      const hasDelegatedPermission = to.meta.permission && authStore.hasPermission(to.meta.permission);
      const isMatrixControlAllowed = to.path === '/superadmin/users' && authStore.hasPermission('system.matrix_control');

      if (!hasDirectRole && !hasDelegatedPermission && !isMatrixControlAllowed && role !== 'superadmin') {
        console.warn(`[Router Guard] Access denied to ${to.path}. Required roles: ${to.meta.roles.join(', ')}. Current role: ${role}`);
        return next(getHomeRoute(role, unit));
      }
    }

    // 5. Enforce Sub-Unit Scoping for Admin and Dispatcher (Director & Superadmin have university-wide access)
    if (to.meta.unit && role !== 'director' && role !== 'superadmin') {
      const targetUnit = String(to.meta.unit).toUpperCase();
      if (unit && unit !== targetUnit) {
        console.warn(`[Router Guard] Jurisdiction mismatch for ${to.path}. Target unit: ${targetUnit}. Current unit: ${unit}`);
        return next(getHomeRoute(role, unit));
      }
    }
  }

  next();
});

// Listen for Session Superseded (Single Session Per User Enforcement)
if (typeof window !== 'undefined') {
  let isNotifyingSuperseded = false;

  window.addEventListener('auth:session-superseded', () => {
    window.__gso_session_superseded = true;

    // Clear client-side session cache immediately
    sessionStorage.removeItem('auth');
    sessionStorage.removeItem('token');

    // Cleanly reset Pinia auth store state and stop heartbeat
    try {
      const authStore = useAuthStore();
      authStore.user  = null;
      authStore.role  = null;
      authStore.token = null;
      if (typeof authStore.stopSessionHeartbeat === 'function') {
        authStore.stopSessionHeartbeat();
      }
    } catch {
      // Pinia might not be ready in edge cases
    }

    if (!isNotifyingSuperseded) {
      isNotifyingSuperseded = true;
      Swal.fire({
        icon: 'warning',
        title: 'Session Ended',
        html: `
          <div style="text-align: center; color: #475569; font-size: 14px; line-height: 1.6; padding-top: 4px;">
            <p style="margin-bottom: 8px; font-weight: 600; color: #1e293b;">
              Your account was logged in from another device or browser.
            </p>
            <p style="margin: 0; color: #64748b; font-size: 13px;">
              Only one active session is allowed per user account. You have been signed out from this session to keep your account secure.
            </p>
          </div>
        `,
        confirmButtonColor: '#059669',
        confirmButtonText: 'Log In Again',
        allowOutsideClick: false,
        allowEscapeKey: false,
        backdrop: 'rgba(15, 23, 42, 0.75)',
        customClass: {
          popup: 'rounded-3xl shadow-2xl p-6 border border-slate-100',
          confirmButton: 'px-6 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-emerald-600/20 transition-all hover:brightness-105',
        }
      }).then(() => {
        isNotifyingSuperseded = false;
        window.__gso_session_superseded = false;
        if (router.currentRoute.value && router.currentRoute.value.name !== 'login') {
          router.push({ name: 'login' });
        }
      });
    }
  });

  // Listen for generic 401 Unauthorized API interceptor events
  window.addEventListener('auth:unauthorized', (event) => {
    // If a session-superseded notice is already active, suppress generic unauthorized redirects
    if (window.__gso_session_superseded || isNotifyingSuperseded) return;

    // Ignore 401s that originate from the login endpoint itself
    const requestUrl = event.detail?.config?.url || '';
    if (requestUrl.includes('auth/login')) return;

    // Only clear and redirect if a session state actually existed
    const hadUser = (() => {
      try {
        const raw = JSON.parse(sessionStorage.getItem('auth') || '{}');
        return !!(raw?.user || raw?.state?.user || sessionStorage.getItem('token'));
      } catch { return false; }
    })();

    if (!hadUser) return;

    // Clear session and redirect to login
    sessionStorage.removeItem('auth');
    sessionStorage.removeItem('token');

    try {
      const authStore = useAuthStore();
      authStore.user  = null;
      authStore.role  = null;
      authStore.token = null;
      if (typeof authStore.stopSessionHeartbeat === 'function') {
        authStore.stopSessionHeartbeat();
      }
    } catch {}

    if (router.currentRoute.value && router.currentRoute.value.name !== 'login') {
      router.push({ name: 'login' });
    }
  });
}

// Auto-recover from dynamic import chunk failures when a new deployment invalidates old chunk hashes
router.onError((error, to) => {
  const isDynamicImportError =
    error?.message?.includes('Failed to fetch dynamically imported module') ||
    error?.message?.includes('Importing a module script failed') ||
    error?.message?.includes('Expected a JavaScript-or-Wasm module script');

  if (isDynamicImportError) {
    console.warn('New deployment detected, reloading page to fetch latest code bundle...', error);
    if (to?.fullPath) {
      window.location.href = to.fullPath;
    } else {
      window.location.reload();
    }
  }
});

export default router;