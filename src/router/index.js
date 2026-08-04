import { createRouter, createWebHistory } from 'vue-router';
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
const SSU_StickerTicketQueues = () => import('../views/dashboards/admin/ssu/SSU_StickerTicketQueues.vue');
const TASU_Dashboard = () => import('../views/dashboards/admin/tasu/TASU_Dashboard.vue');
const TASU_TicketQueues = () => import('../views/dashboards/admin/tasu/TASU_TicketQueues.vue');
const Director_Dashboard = () => import('../views/dashboards/director/Director_Dashboard.vue');
const OrganizationalChart = () => import('../views/dashboards/director/OrganizationalChart.vue');
const FormsView = () => import('../views/FormsView.vue');
const FGMU_Dispatcher = () => import('../views/dashboards/dispatcher/fgmu/FGMU.vue');
const FGMU_Workers = () => import('../views/dashboards/dispatcher/fgmu/FGMU_Workers.vue');
const LEAU_Dispatcher = () => import('../views/dashboards/dispatcher/leau/LEAU.vue');
const LEAU_Workers = () => import('../views/dashboards/dispatcher/leau/LEAU_Workers.vue');
const TASU_Dispatcher = () => import('../views/dashboards/dispatcher/tasu/TASU.vue');
const TASU_Drivers = () => import('../views/dashboards/dispatcher/tasu/TASU_Drivers.vue');
const Worker_Dashboard = () => import('../views/dashboards/worker/Worker_Dashboard.vue');
const User_Tickets = () => import('../views/dashboards/user/User_Tickets.vue');
const User_Settings = () => import('../views/dashboards/user/User_Settings.vue');
const TASU_VehicleManagement = () => import('../views/dashboards/admin/tasu/TASU_VehicleManagement.vue');
const TASU_DispatchBoard = () => import('../views/dashboards/admin/tasu/TASU_DispatchBoard.vue');
const Worker_History = () => import('../views/dashboards/worker/Worker_History.vue');
const Driver_Dashboard = () => import('../views/dashboards/driver/Driver_Dashboard.vue');
const VehicleAvailabilityView = () => import('../views/VehicleAvailabilityView.vue');
const FGMU_Personnel = () => import('../views/dashboards/admin/fgmu/FGMU_Personnel.vue');
const LEAU_Personnel = () => import('../views/dashboards/admin/leau/LEAU_Personnel.vue');
const TASU_Personnel = () => import('../views/dashboards/admin/tasu/TASU_Personnel.vue');
const FGMU_Archives = () => import('../views/dashboards/admin/fgmu/FGMU_Archives.vue');
const LEAU_Archives = () => import('../views/dashboards/admin/leau/LEAU_Archives.vue');
const SSU_Archives = () => import('../views/dashboards/admin/ssu/SSU_Archives.vue');
const TASU_Archives = () => import('../views/dashboards/admin/tasu/TASU_Archives.vue');
const User_CompletedTickets = () => import('../views/dashboards/user/User_CompletedTickets.vue');



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
      path: '/services',
      name: 'services-list',
      component: ServicesListView,
      meta: { requiresAuth: true }
    },
    {
      path: '/user/dashboard',
      name: 'user-dashboard',
      component: User_Dashboard
    },
    {
      path: '/user/tickets',
      name: 'user-tickets',
      component: User_Tickets
    },
    {
      path: '/user/edit-profile',
      name: 'user-settings',
      component: User_Settings
    },
    {
      path: '/user/completed-tickets',
      name: 'user-completed-tickets',
      component: User_CompletedTickets
    },

    // Sub-unit Dashboards (Auth disabled for testing)
    {
      path: '/admin/fgmu',
      name: 'fgmu-dashboard',
      component: FGMU_Dashboard
    },
    {
      path: '/admin/fgmu/queues',
      name: 'fgmu-ticket-queues',
      component: FGMU_TicketQueues
    },
    {
      path: '/admin/fgmu/personnel',
      name: 'fgmu-admin-personnel',
      component: FGMU_Personnel
    },
    {
      path: '/admin/fgmu/archives',
      name: 'fgmu-admin-archives',
      component: FGMU_Archives
    },
    {
      path: '/admin/leau',
      name: 'leau-dashboard',
      component: LEAU_Dashboard
    },
    {
      path: '/admin/leau/queues',
      name: 'leau-ticket-queues',
      component: LEAU_TicketQueues
    },
    {
      path: '/admin/leau/personnel',
      name: 'leau-admin-personnel',
      component: LEAU_Personnel
    },
    {
      path: '/admin/leau/archives',
      name: 'leau-admin-archives',
      component: LEAU_Archives
    },
    {
      path: '/admin/ssu',
      name: 'ssu-dashboard',
      component: SSU_Dashboard
    },
    {
      path: '/admin/ssu/queues/incidents',
      name: 'ssu-incident-queues',
      component: SSU_IncidentTicketQueues
    },
    {
      path: '/admin/ssu/queues/stickers',
      name: 'ssu-sticker-queues',
      component: SSU_StickerTicketQueues
    },
    {
      path: '/admin/ssu/queues/stickers/verified',
      name: 'ssu-verified-sticker-queues',
      component: SSU_StickerTicketQueues
    },
    {
      path: '/admin/ssu/archives',
      name: 'ssu-admin-archives',
      component: SSU_Archives
    },
    {
      path: '/admin/tasu',
      name: 'tasu-dashboard',
      component: TASU_Dashboard
    },
    {
      path: '/admin/tasu/queues',
      name: 'tasu-ticket-queues',
      component: TASU_TicketQueues
    },
    {
      path: '/admin/tasu/personnel',
      name: 'tasu-admin-personnel',
      component: TASU_Personnel
    },
    {
      path: '/admin/tasu/vehicles',
      name: 'tasu-vehicles',
      component: TASU_VehicleManagement
    },
    {
      path: '/admin/tasu/dispatch',
      name: 'tasu-dispatch',
      component: TASU_DispatchBoard
    },
    {
      path: '/admin/tasu/archives',
      name: 'tasu-admin-archives',
      component: TASU_Archives
    },
    {
      path: '/director/dashboard',
      name: 'director-dashboard',
      component: Director_Dashboard
    },
    {
      path: '/director/organizational-chart',
      name: 'organizational-chart',
      component: OrganizationalChart
    },
    // Dispatcher Dashboards
    {
      path: '/dispatcher/fgmu',
      name: 'fgmu-dispatcher',
      component: FGMU_Dispatcher
    },
    {
      path: '/dispatcher/fgmu/workers',
      name: 'fgmu-workers',
      component: FGMU_Workers
    },
    {
      path: '/dispatcher/leau',
      name: 'leau-dispatcher',
      component: LEAU_Dispatcher
    },
    {
      path: '/dispatcher/leau/workers',
      name: 'leau-workers',
      component: LEAU_Workers
    },
    {
      path: '/dispatcher/tasu',
      name: 'tasu-dispatcher',
      component: TASU_Dispatcher
    },
    {
      path: '/dispatcher/tasu/drivers',
      name: 'tasu-drivers',
      component: TASU_Drivers
    },
    {
      path: '/worker/dashboard',
      name: 'worker-dashboard',
      component: Worker_Dashboard
    },
    {
      path: '/worker/history',
      name: 'worker-history',
      component: Worker_History
    },
    {
      path: '/driver/dashboard',
      name: 'driver-dashboard',
      component: Driver_Dashboard
    },
    {
      path: '/services/vehicle-availability',
      name: 'vehicle-availability',
      component: VehicleAvailabilityView
    },
    {
      path: '/services/forms',
      name: 'services-forms',
      component: FormsView,
      meta: { requiresAuth: true }
    }
  ]
});

// Global Navigation Guard — protect all routes with meta.requiresAuth
router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.requiresAuth) {
    try {
      // pinia-plugin-persistedstate saves the store under the store id ('auth')
      // With sessionStorage, each tab has its own isolated auth state.
      const raw = sessionStorage.getItem('auth');
      if (!raw) return next({ name: 'login' });

      const stored = JSON.parse(raw);
      // Support both flat { token } and nested { state: { token } } structures
      const token = stored?.token || stored?.state?.token || null;

      if (!token) return next({ name: 'login' });
    } catch {
      return next({ name: 'login' });
    }
  }
  next();
});

// Listen for 401 Unauthorized API interceptor events.
// IMPORTANT: Only handle 401s when the user already has a session token.
// A 401 on the /auth/login endpoint (wrong password) must NOT clear an
// existing session or trigger a redirect — that's a normal login failure.
if (typeof window !== 'undefined') {
  window.addEventListener('auth:unauthorized', (event) => {
    // Ignore 401s that originate from the login endpoint itself
    const requestUrl = event.detail?.config?.url || '';
    if (requestUrl.includes('auth/login')) return;

    // Only clear and redirect if a session token actually existed
    const hadToken = (() => {
      try {
        const raw = JSON.parse(sessionStorage.getItem('auth') || '{}');
        return !!(raw?.token || sessionStorage.getItem('token'));
      } catch { return false; }
    })();

    if (!hadToken) return;

    // Clear tokens and redirect to login
    sessionStorage.removeItem('token');
    try {
      const piniaAuth = JSON.parse(sessionStorage.getItem('auth') || '{}');
      delete piniaAuth.token;
      sessionStorage.setItem('auth', JSON.stringify(piniaAuth));
    } catch (e) {}
    if (router.currentRoute.value && router.currentRoute.value.name !== 'login') {
      router.push({ name: 'login' });
    }
  });
}

export default router;