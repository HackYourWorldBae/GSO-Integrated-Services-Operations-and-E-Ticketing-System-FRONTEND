import { ref, computed } from 'vue';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useAuthStore } from '@/stores/auth';

const isTutorialModalOpen = ref(false);
const selectedRoleTab = ref('requestor');

export function useTutorial() {
  const authStore = useAuthStore();

  const currentRole = computed(() => {
    const r = (authStore.role || authStore.user?.role || '').toLowerCase();
    if (r === 'superadmin') return 'superadmin';
    if (r === 'director') return 'director';
    if (r === 'admin' || r === 'staff') return 'admin';
    if (r === 'worker') return 'worker';
    return 'requestor';
  });

  const openTutorialModal = (targetRole = null) => {
    selectedRoleTab.value = targetRole || currentRole.value;
    isTutorialModalOpen.value = true;
  };

  const closeTutorialModal = () => {
    isTutorialModalOpen.value = false;
  };

  const getTourSteps = (role) => {
    const stepsByRole = {
      requestor: [
        {
          element: '#tour-sidebar-nav',
          popover: {
            title: '1. Navigation & Services',
            description: 'Access your Dashboard, view active Service Requests, review Completed Tickets, and manage your account.',
            side: 'right',
            align: 'start'
          }
        },
        {
          element: '#tour-main-workspace',
          popover: {
            title: '2. Workspace & Live Requests',
            description: 'Browse available university services, request tool or plant borrowing, report security incidents, and track ticket progress in real-time.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '#tour-comfort-btn',
          popover: {
            title: '3. Eye-Comfort & Contrast Mode',
            description: 'Turn on Comfort View anytime for high-contrast reading, defined borders, and enlarged touch targets.',
            side: 'bottom',
            align: 'end'
          }
        },
        {
          element: '#tour-notifications-btn',
          popover: {
            title: '4. Real-Time Status Alerts',
            description: 'Get instant notifications when your request is reviewed, scheduled, completed, or ready for satisfaction rating.',
            side: 'bottom',
            align: 'end'
          }
        },
        {
          element: '#tour-guide-btn',
          popover: {
            title: '5. Manual & Guide Anytime',
            description: 'Need a refresher? Click the Guide button whenever you want to review workflows or restart this tour.',
            side: 'bottom',
            align: 'end'
          }
        }
      ],
      admin: [
        {
          element: '#tour-sidebar-nav',
          popover: {
            title: '1. Operational Unit Queues',
            description: 'Manage Pending Approvals, Approved Tickets, Dispatch Personnel, Scheduled Work Orders, Active Jobs, Inventory, and Archives.',
            side: 'right',
            align: 'start'
          }
        },
        {
          element: '#tour-main-workspace',
          popover: {
            title: '2. Unit Operations & Workload',
            description: 'Monitor daily throughput, dispatch workers, manage plant/tool inventory, and investigate incident reports.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '#tour-comfort-btn',
          popover: {
            title: '3. Comfort View Standards',
            description: 'Enhances container boundaries and boosts contrast to WCAG AAA standards for long operational shifts.',
            side: 'bottom',
            align: 'end'
          }
        },
        {
          element: '#tour-notifications-btn',
          popover: {
            title: '4. Instant Queue Notifications',
            description: 'Receive real-time alerts with sound chimes for incoming service requests, job updates, and priority dispatches.',
            side: 'bottom',
            align: 'end'
          }
        },
        {
          element: '#tour-guide-btn',
          popover: {
            title: '5. Unit Admin Manual',
            description: 'Click Guide to access full step-by-step documentation for worker assignment, inventory management, and incident resolution.',
            side: 'bottom',
            align: 'end'
          }
        }
      ],
      director: [
        {
          element: '#tour-sidebar-nav',
          popover: {
            title: '1. Executive Portal Navigation',
            description: 'Access campus-wide overview, unit ticket queues (FGMU, LEAU, SSU), material reports, and multi-unit archives.',
            side: 'right',
            align: 'start'
          }
        },
        {
          element: '#tour-main-workspace',
          popover: {
            title: '2. Executive Analytics & Approvals',
            description: 'Inspect cross-unit performance, approve borrowing and high-level requests, and export official PDF executive summaries.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '#tour-profile-menu',
          popover: {
            title: '3. Acting Unit Head Delegation',
            description: 'If a unit head is on leave, you can temporarily assume direct management over that unit from your profile menu.',
            side: 'bottom',
            align: 'end'
          }
        },
        {
          element: '#tour-guide-btn',
          popover: {
            title: '4. Director Reference Manual',
            description: 'Open the Guide anytime to review policy procedures, delegation rules, and audit trail guidelines.',
            side: 'bottom',
            align: 'end'
          }
        }
      ],
      worker: [
        {
          element: '#tour-sidebar-nav',
          popover: {
            title: '1. Personnel Portal',
            description: 'View currently assigned work orders, check service locations, and review your completed jobs history.',
            side: 'right',
            align: 'start'
          }
        },
        {
          element: '#tour-main-workspace',
          popover: {
            title: '2. Active Job Management',
            description: 'Access job order specifications, record materials used, request target timeline extensions, and complete assignments.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '#tour-notifications-btn',
          popover: {
            title: '3. Dispatch Notifications',
            description: 'Be alerted immediately when a new work order is scheduled or dispatched to your team.',
            side: 'bottom',
            align: 'end'
          }
        },
        {
          element: '#tour-guide-btn',
          popover: {
            title: '4. Worker Quick Guide',
            description: 'Click Guide anytime to check instructions for logging supplies and completing jobs.',
            side: 'bottom',
            align: 'end'
          }
        }
      ],
      superadmin: [
        {
          element: '#tour-sidebar-nav',
          popover: {
            title: '1. System Administration',
            description: 'Manage user accounts, review identity verification queues, inspect business audit trails, and schedule system backups.',
            side: 'right',
            align: 'start'
          }
        },
        {
          element: '#tour-main-workspace',
          popover: {
            title: '2. Central Control Console',
            description: 'Provision accounts, assign RBAC permissions, audit operational activities, and manage platform security settings.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '#tour-guide-btn',
          popover: {
            title: '3. System Documentation',
            description: 'Access the Superadmin operational manual for user credential verification and disaster recovery procedures.',
            side: 'bottom',
            align: 'end'
          }
        }
      ]
    };

    const targetSteps = stepsByRole[role] || stepsByRole.requestor;
    // Filter out steps whose element does not exist in the DOM to avoid broken spotlights
    return targetSteps.filter(s => {
      if (!s.element) return true;
      const el = document.querySelector(s.element);
      return el !== null;
    });
  };

  const startGuidedTour = (role = null) => {
    closeTutorialModal();

    const activeRole = role || currentRole.value;
    const steps = getTourSteps(activeRole);

    if (!steps || steps.length === 0) {
      return;
    }

    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      overlayColor: 'rgba(15, 23, 42, 0.72)',
      stagePadding: 6,
      stageRadius: 14,
      nextBtnText: 'Next →',
      prevBtnText: '← Back',
      doneBtnText: 'Finish Tour',
      steps: steps,
      onDestroyStarted: () => {
        driverObj.destroy();
      }
    });

    driverObj.drive();
  };

  return {
    isTutorialModalOpen,
    selectedRoleTab,
    currentRole,
    openTutorialModal,
    closeTutorialModal,
    startGuidedTour
  };
}
