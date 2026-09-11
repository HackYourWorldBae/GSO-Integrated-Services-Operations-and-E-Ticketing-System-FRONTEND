import { createRouter, createWebHistory } from 'vue-router';
import Swal from 'sweetalert2';
import { useAuthStore } from '@/stores/auth';
const LandingView = () => import('../views/LandingView.vue');
const LoginView = () => import('../views/auth/LoginView.vue');
const RegisterView = () => import('../views/auth/RegisterView.vue');

// Lazy-loaded route components for performance optimization & code splitting
const ServicesListView = () => import('../views/ServicesListView.vue');
const User_Dashboard = () => import('../views/dashboards/user/User_Dashboard.vue');
const FGMU_Dashboard = () => import('../views/dashboards/admin/fgmu/FGMU_Dashboard.vue');
const LEAU_Dashboard = () => import('../views/dashboards/admin/leau/LEAU_Dashboard.vue');

const SSU_Dashboard = () => import('../views/dashboards/admin/ssu/SSU_Dashboard.vue');
const SSU_IncidentTicketQueues = () => import('../views/dashboards/admin/ssu/SSU_IncidentTicketQueues.vue');
const Director_Dashboard = () => import('../views/dashboards/director/Director_Dashboard.vue');
const Director_Materials = () => import('../views/dashboards/director/Director_Materials.vue');
const Director_FGMU_TicketQueues = () => import('../views/dashboards/director/Director_FGMU_TicketQueues.vue');
const Director_LEAU_TicketQueues = () => import('../views/dashboards/director/Director_LEAU_TicketQueues.vue');
const Director_FGMU = () => import('../views/dashboards/director/Director_FGMU.vue');
const Director_LEAU = () => import('../views/dashboards/director/Director_LEAU.vue');
const Director_SSU = () => import('../views/dashboards/director/Director_SSU.vue');
const FormsView = () => import('../views/FormsView.vue');

const FGMU_DispatchedTickets = () => import('../views/dashboards/admin/fgmu/FGMU_DispatchedTickets.vue');
const LEAU_DispatchedTickets = () => import('../views/dashboards/admin/leau/LEAU_DispatchedTickets.vue');
const FGMU_TicketDispatch = () => import('../views/dashboards/admin/fgmu/FGMU_TicketDispatch.vue');
const LEAU_TicketDispatch = () => import('../views/dashboards/admin/leau/LEAU_TicketDispatch.vue');
const FGMU_ApprovedTickets = () => import('../views/dashboards/admin/fgmu/FGMU_ApprovedTickets.vue');
const LEAU_ApprovedTickets = () => import('../views/dashboards/admin/leau/LEAU_ApprovedTickets.vue');
const FGMU_ActiveTickets = () => import('../views/dashboards/admin/fgmu/FGMU_ActiveTickets.vue');
const LEAU_ActiveTickets = () => import('../views/dashboards/admin/leau/LEAU_ActiveTickets.vue');
const User_Tickets = () => import('../views/dashboards/user/User_Tickets.vue');
const User_Settings = () => import('../views/dashboards/user/User_Settings.vue');
const FGMU_Personnel = () => import('../views/dashboards/admin/fgmu/FGMU_Personnel.vue');
const LEAU_Personnel = () => import('../views/dashboards/admin/leau/LEAU_Personnel.vue');
const FGMU_Archives = () => import('../views/dashboards/admin/fgmu/FGMU_Archives.vue');
const LEAU_Archives = () => import('../views/dashboards/admin/leau/LEAU_Archives.vue');
const SSU_Archives = () => import('../views/dashboards/admin/ssu/SSU_Archives.vue');
const User_CompletedTickets = () => import('../views/dashboards/user/User_CompletedTickets.vue');
const Superadmin_Dashboard = () => import('../views/dashboards/superadmin/Superadmin_Dashboard.vue');
const Superadmin_Users = () => import('../views/dashboards/superadmin/Superadmin_Users.vue');
const Superadmin_VerificationQueue = () => import('../views/dashboards/superadmin/Superadmin_VerificationQueue.vue');
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
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/projects',
      redirect: '/'
    },
    {
      path: '/projects/archives',
      redirect: '/'
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
      meta: { requiresAuth: true, roles: ['admin', 'dispatcher'], unit: 'FGMU' }
    },
    {
      path: '/admin/fgmu/approved-tickets',
      name: 'fgmu-approved-tickets',
      component: FGMU_ApprovedTickets,
      meta: { requiresAuth: true, roles: ['admin', 'dispatcher'], unit: 'FGMU', permission: 'tickets.dispatch' }
    },
    {
      path: '/admin/fgmu/assign-workers',
      alias: ['/admin/fgmu/dispatch'],
      name: 'fgmu-assign-workers',
      component: FGMU_TicketDispatch,
      meta: { requiresAuth: true, roles: ['admin', 'dispatcher'], unit: 'FGMU', permission: 'tickets.dispatch' }
    },
    {
      path: '/admin/fgmu/dispatched',
      alias: ['/admin/fgmu/scheduled', '/admin/fgmu/scheduled-tickets'],
      name: 'fgmu-admin-dispatched',
      component: FGMU_DispatchedTickets,
      meta: { requiresAuth: true, roles: ['admin', 'dispatcher'], unit: 'FGMU', permission: 'tickets.dispatch' }
    },
    {
      path: '/admin/fgmu/active-tickets',
      alias: ['/admin/fgmu/active', '/admin/fgmu/active-dispatches'],
      name: 'fgmu-admin-active-tickets',
      component: FGMU_ActiveTickets,
      meta: { requiresAuth: true, roles: ['admin', 'dispatcher'], unit: 'FGMU', permission: 'tickets.dispatch' }
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
      meta: { requiresAuth: true, roles: ['admin', 'dispatcher'], unit: 'FGMU' }
    },
    {
      path: '/admin/fgmu/announcements',
      redirect: '/admin/fgmu'
    },
    {
      path: '/admin/fgmu/project-archives',
      redirect: '/admin/fgmu/archives'
    },

    // Sub-unit Dashboards — LEAU Admin
    {
      path: '/admin/leau',
      name: 'leau-dashboard',
      component: LEAU_Dashboard,
      meta: { requiresAuth: true, roles: ['admin', 'dispatcher'], unit: 'LEAU' }
    },
    {
      path: '/admin/leau/approved-tickets',
      name: 'leau-approved-tickets',
      component: LEAU_ApprovedTickets,
      meta: { requiresAuth: true, roles: ['admin', 'dispatcher'], unit: 'LEAU', permission: 'tickets.dispatch' }
    },
    {
      path: '/admin/leau/assign-workers',
      alias: ['/admin/leau/dispatch'],
      name: 'leau-assign-workers',
      component: LEAU_TicketDispatch,
      meta: { requiresAuth: true, roles: ['admin', 'dispatcher'], unit: 'LEAU', permission: 'tickets.dispatch' }
    },
    {
      path: '/admin/leau/dispatched',
      alias: ['/admin/leau/scheduled', '/admin/leau/scheduled-tickets'],
      name: 'leau-admin-dispatched',
      component: LEAU_DispatchedTickets,
      meta: { requiresAuth: true, roles: ['admin', 'dispatcher'], unit: 'LEAU', permission: 'tickets.dispatch' }
    },
    {
      path: '/admin/leau/active-tickets',
      alias: ['/admin/leau/active', '/admin/leau/active-dispatches'],
      name: 'leau-admin-active-tickets',
      component: LEAU_ActiveTickets,
      meta: { requiresAuth: true, roles: ['admin', 'dispatcher'], unit: 'LEAU', permission: 'tickets.dispatch' }
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
      meta: { requiresAuth: true, roles: ['admin', 'dispatcher'], unit: 'LEAU' }
    },
    {
      path: '/admin/leau/announcements',
      redirect: '/admin/leau'
    },
    {
      path: '/admin/leau/project-archives',
      redirect: '/admin/leau/archives'
    },

    // Sub-unit Dashboards — SSU Admin
    {
      path: '/admin/ssu',
      name: 'ssu-dashboard',
      component: SSU_Dashboard,
      meta: { requiresAuth: true, roles: ['admin'], unit: 'SSU' }
    },
    {
      path: '/admin/ssu/queues',
      redirect: '/admin/ssu/queues/incidents'
    },
    {
      path: '/admin/ssu/queues/incidents',
      alias: ['/admin/ssu/incident-queues', '/director/ssu/queues', '/director/queues/ssu'],
      name: 'ssu-incident-queues',
      component: SSU_IncidentTicketQueues,
      meta: { requiresAuth: true, roles: ['admin', 'dispatcher', 'director', 'superadmin'], unit: 'SSU', permission: 'tickets.view_all' }
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
      redirect: '/superadmin/dashboard'
    },
    {
      path: '/superadmin/dashboard',
      name: 'superadmin-dashboard',
      component: Superadmin_Dashboard,
      meta: { requiresAuth: true, roles: ['superadmin', 'admin', 'director'] }
    },
    {
      path: '/superadmin/users',
      name: 'superadmin-users',
      component: Superadmin_Users,
      meta: { requiresAuth: true, roles: ['superadmin', 'admin', 'director'], permission: 'users.provision' }
    },
    {
      path: '/superadmin/queues',
      alias: ['/superadmin/verification', '/superadmin/verification-queue', '/superadmin/user-queues'],
      name: 'superadmin-user-queues',
      component: Superadmin_VerificationQueue,
      meta: { requiresAuth: true, roles: ['superadmin', 'admin', 'director'], permission: 'users.provision' }
    },
    {
      path: '/superadmin/logs',
      name: 'superadmin-logs',
      component: Superadmin_AuditLogs,
      meta: { requiresAuth: true, roles: ['superadmin'] }
    },

    // Director Dashboards & Ticket Queues Oversight
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
      path: '/director/materials',
      name: 'director-materials',
      component: Director_Materials,
      meta: { requiresAuth: true, roles: ['director', 'admin', 'dispatcher'], permission: 'reports.view' }
    },
    {
      path: '/director/fgmu/queues',
      alias: ['/admin/fgmu/queues', '/director/queues/fgmu'],
      name: 'director-fgmu-ticket-queues',
      component: Director_FGMU_TicketQueues,
      meta: { requiresAuth: true, roles: ['director', 'admin', 'dispatcher', 'superadmin'], unit: 'FGMU', permission: 'tickets.view_all' }
    },
    {
      path: '/director/leau/queues',
      alias: ['/admin/leau/queues', '/director/queues/leau'],
      name: 'director-leau-ticket-queues',
      component: Director_LEAU_TicketQueues,
      meta: { requiresAuth: true, roles: ['director', 'admin', 'dispatcher', 'superadmin'], unit: 'LEAU', permission: 'tickets.view_all' }
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
      path: '/director/queues',
      redirect: '/director/fgmu/queues'
    },
    {
      path: '/director/organizational-chart',
      redirect: '/director/dashboard'
    },
    {
      path: '/director/org-chart',
      redirect: '/director/dashboard'
    },

    // Dispatcher Dashboards — Redirect to unified Admin & Operations portal
    {
      path: '/dispatcher/fgmu',
      redirect: '/admin/fgmu'
    },
    {
      path: '/dispatcher/fgmu/dispatch',
      redirect: to => ({ path: '/admin/fgmu/dispatch', query: to.query })
    },
    {
      path: '/dispatcher/fgmu/workers',
      redirect: to => ({ path: '/admin/fgmu/personnel', query: to.query })
    },
    {
      path: '/dispatcher/fgmu/dispatched',
      redirect: to => ({ path: '/admin/fgmu/dispatched', query: to.query })
    },
    {
      path: '/dispatcher/fgmu/active-tickets',
      redirect: to => ({ path: '/admin/fgmu/active-tickets', query: to.query })
    },
    {
      path: '/dispatcher/fgmu/archives',
      redirect: '/admin/fgmu/archives'
    },
    {
      path: '/dispatcher/fgmu/project-archives',
      redirect: '/admin/fgmu/archives'
    },

    // Dispatcher Dashboards — LEAU Redirects
    {
      path: '/dispatcher/leau',
      redirect: '/admin/leau'
    },
    {
      path: '/dispatcher/leau/dispatch',
      redirect: to => ({ path: '/admin/leau/dispatch', query: to.query })
    },
    {
      path: '/dispatcher/leau/workers',
      redirect: to => ({ path: '/admin/leau/personnel', query: to.query })
    },
    {
      path: '/dispatcher/leau/dispatched',
      redirect: to => ({ path: '/admin/leau/dispatched', query: to.query })
    },
    {
      path: '/dispatcher/leau/active-tickets',
      redirect: to => ({ path: '/admin/leau/active-tickets', query: to.query })
    },
    {
      path: '/dispatcher/leau/archives',
      redirect: '/admin/leau/archives'
    },
    {
      path: '/dispatcher/leau/project-archives',
      redirect: '/admin/leau/archives'
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
      return ['fgmu', 'leau'].includes(u) ? `/admin/${u}` : '/admin/fgmu';
    }
    if (userRole === 'director') {
      return '/director/dashboard';
    }
    return '/user/dashboard';
  };

  // 1. Prevent already-authenticated users from re-visiting login or register
  if ((to.name === 'login' || to.name === 'register') && user && role) {
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

    // 2.1 Identity Verification Gate for Ticket Intake
    // Unverified users can browse their dashboard/settings, but cannot create tickets
    if (to.path === '/services' || to.path.startsWith('/services/forms')) {
      const isVerified = user.is_verified === 1 || user.is_verified === true || user.is_verified === '1';
      if (!isVerified) {
        Swal.fire({
          icon: 'warning',
          title: 'Account Verification Pending',
          text: 'Your uploaded ID is currently being reviewed by the Super Administrator. You will be able to submit service requests once verified.',
          confirmButtonColor: '#059669',
        });
        return next('/user/dashboard');
      }
    }

    // 3. Capability Permission Check
    if (to.meta.permission) {
      if (!authStore.hasPermission(to.meta.permission) && role !== 'superadmin') {
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

      if (!hasDirectRole && !hasDelegatedPermission && role !== 'superadmin') {
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