import { ref, computed, nextTick } from 'vue';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import {
  pageGuidesCatalog,
  createUnitAdminDashboardGuide,
  createUnitAdminMyRequestsGuide,
  createUnitAdminQueuesGuide,
  createUnitAdminApprovedGuide,
  createUnitAdminDispatchGuide,
  createUnitAdminDispatchedGuide,
  createUnitAdminActiveGuide,
  createUnitAdminPersonnelGuide,
  createUnitAdminInventoryGuide,
  createUnitAdminMaterialsGuide,
  createUnitAdminCollabGuide,
  createUnitAdminArchivesGuide,
  createUnitAdminSettingsGuide
} from '@/constants/pageGuidesCatalog';

const isTutorialModalOpen = ref(false);
const activePageId = ref('');
const isTourActive = ref(false);
const activeTourSteps = ref([]);
const activeTourPage = ref(null);

/**
 * Global cleanup to remove any lingering pinpoint highlight classes across the DOM
 */
export const cleanupTourHighlights = () => {
  if (typeof document === 'undefined') return;
  const elements = document.querySelectorAll('.tour-pinpoint-target');
  elements.forEach((el) => {
    el.classList.remove('tour-pinpoint-target');
  });
};

export function useTutorial() {
  const authStore = useAuthStore();

  /**
   * Determine the current role strictly from the logged-in session
   */
  const currentRole = computed(() => {
    const rawRole = (authStore.role || authStore.user?.role || localStorage.getItem('user_role') || '').toLowerCase();
    if (rawRole === 'superadmin') return 'superadmin';
    if (rawRole === 'director') return 'director';
    if (rawRole === 'admin' || rawRole === 'staff') return 'admin';
    if (rawRole === 'worker' || rawRole === 'personnel') return 'worker';
    return 'requestor';
  });

  /**
   * Determine unit code for admin (FGMU, LEAU, SSU)
   */
  const currentUnitCode = computed(() => {
    const currentPath = router.currentRoute?.value?.path || '';
    if (currentPath.includes('/admin/fgmu')) return 'fgmu';
    if (currentPath.includes('/admin/leau')) return 'leau';
    if (currentPath.includes('/admin/ssu')) return 'ssu';
    const u = (authStore.user?.unit_code || localStorage.getItem('unit_code') || '').toLowerCase();
    if (u === 'fgmu' || u === 'leau' || u === 'ssu') return u;
    if (authStore.user?.unit_id === 1) return 'fgmu';
    if (authStore.user?.unit_id === 2) return 'leau';
    if (authStore.user?.unit_id === 3) return 'ssu';
    return 'fgmu';
  });

  /**
   * Active role data with comprehensive page guides from the user manual
   */
  const activeRoleData = computed(() => {
    const roleKey = currentRole.value;

    if (roleKey === 'admin') {
      const unit = currentUnitCode.value;
      const unitLabels = {
        fgmu: { label: 'Facilities & Grounds Management Unit (FGMU)', icon: '🛠️' },
        leau: { label: 'Landscaping & Environmental Aesthetics Unit (LEAU)', icon: '🌿' },
        ssu: { label: 'Safety & Security Services Unit (SSU)', icon: '🛡️' }
      };
      const info = unitLabels[unit] || unitLabels.fgmu;

      // Construct pages specifically for FGMU, LEAU, or SSU
      let pages = [];
      if (unit === 'ssu') {
        pages = [
          createUnitAdminDashboardGuide('ssu'),
          createUnitAdminMyRequestsGuide('ssu'), // My Service Requests
          createUnitAdminQueuesGuide('ssu'), // Submitted Incidents
          createUnitAdminActiveGuide('ssu'), // Under Investigation
          createUnitAdminCollabGuide('ssu'), // SSU Collab Tickets
          createUnitAdminDispatchGuide('ssu'), // Dispatch Tickets
          createUnitAdminPersonnelGuide('ssu'), // Security Personnel
          createUnitAdminArchivesGuide('ssu'), // Archived Incidents
          createUnitAdminSettingsGuide('ssu') // SSU Settings
        ];
      } else {
        // FGMU & LEAU
        pages = [
          createUnitAdminDashboardGuide(unit),
          createUnitAdminMyRequestsGuide(unit), // My Service Requests
          createUnitAdminQueuesGuide(unit),
          createUnitAdminApprovedGuide(unit),
          createUnitAdminDispatchGuide(unit),
          createUnitAdminDispatchedGuide(unit),
          createUnitAdminActiveGuide(unit),
          createUnitAdminPersonnelGuide(unit),
          createUnitAdminInventoryGuide(unit),
          createUnitAdminMaterialsGuide(unit),
          createUnitAdminCollabGuide(unit),
          createUnitAdminArchivesGuide(unit),
          createUnitAdminSettingsGuide(unit)
        ];
      }

      return {
        roleKey: 'admin',
        roleLabel: info.label,
        roleIcon: info.icon,
        roleBadge: `${unit.toUpperCase()} Operations`,
        roleSummary: `Guide for ${unit.toUpperCase()} administrators to manage tickets, staff, and unit operations.`,
        pages
      };
    }

    return pageGuidesCatalog[roleKey] || pageGuidesCatalog.requestor;
  });

  /**
   * Helper to normalize route paths for clean matching
   */
  const normalizeRoutePath = (path) => {
    if (!path) return '';
    return path.toLowerCase().replace(/\/$/, '');
  };

  /**
   * List of all available pages for the current dashboard
   */
  const availablePages = computed(() => {
    return activeRoleData.value.pages || [];
  });

  /**
   * Active page data resolved from user selection or current route
   */
  const activePageData = computed(() => {
    const pages = availablePages.value;
    const currentPath = normalizeRoutePath(router.currentRoute?.value?.path || '');

    if (activePageId.value) {
      const found = pages.find(p => p.id === activePageId.value);
      if (found) return found;
    }

    // Match by longest matching route prefix
    const matched = pages
      .filter(p => {
        const normPage = normalizeRoutePath(p.route);
        return currentPath === normPage || currentPath.startsWith(normPage + '/') || (normPage && currentPath.includes(normPage));
      })
      .sort((a, b) => b.route.length - a.route.length)[0];

    return matched || pages[0] || null;
  });

  /**
   * Explicitly set active page for the guide modal
   */
  const selectPage = (pageId) => {
    activePageId.value = pageId;
  };

  /**
   * Open tutorial confirmation modal, automatically setting the current active page
   */
  const openTutorialModal = (targetPageId = null) => {
    const pages = availablePages.value;
    const currentPath = normalizeRoutePath(router.currentRoute?.value?.path || '');

    if (targetPageId) {
      activePageId.value = targetPageId;
    } else {
      const matched = pages
        .filter(p => {
          const normPage = normalizeRoutePath(p.route);
          return currentPath === normPage || currentPath.startsWith(normPage + '/') || (normPage && currentPath.includes(normPage));
        })
        .sort((a, b) => b.route.length - a.route.length)[0];

      activePageId.value = matched ? matched.id : (pages[0]?.id || '');
    }

    isTutorialModalOpen.value = true;
  };

  const closeTutorialModal = () => {
    isTutorialModalOpen.value = false;
  };

  /**
   * End or close the active interactive tour
   */
  const endTour = () => {
    cleanupTourHighlights();
    isTourActive.value = false;
    activeTourSteps.value = [];
    activeTourPage.value = null;
  };

  /**
   * Launch interactive tour with v-onboarding for the active page
   */
  const startPageTour = async (pageId = null) => {
    cleanupTourHighlights();
    const targetId = pageId || activePageId.value;
    const page = availablePages.value.find(p => p.id === targetId) || activePageData.value;

    closeTutorialModal();

    if (!page) return;

    // If user is not on this page route, navigate first
    const currentPath = normalizeRoutePath(router.currentRoute?.value?.path || '');
    const targetRoute = normalizeRoutePath(page.route);
    if (targetRoute && currentPath !== targetRoute && !currentPath.startsWith(targetRoute)) {
      await router.push(page.route);
      await new Promise(resolve => setTimeout(resolve, 450));
    }

    const rawSteps = page.tourSteps || [
      { element: '#tour-main-workspace', title: page.name, desc: page.summary }
    ];

    // Format steps for v-onboarding with deterministic target pinpointing & fallback
    const formattedSteps = rawSteps.map(s => {
      const targetSelector = s.element || '#tour-page-header';

      return {
        attachTo: {
          element: () => {
            let el = null;
            if (targetSelector) {
              const candidates = targetSelector.split(',').map(sel => sel.trim()).filter(Boolean);
              for (const cand of candidates) {
                const found = document.querySelector(cand);
                if (found && (found.offsetWidth > 0 || found.offsetHeight > 0 || found.getClientRects().length > 0)) {
                  el = found;
                  break;
                }
              }
              if (!el) {
                el = document.querySelector(targetSelector);
              }
            }

            // If the element is #tour-main-workspace, main, body, or an excessively tall container,
            // resolve it to a compact, prominent top heading/banner so the spotlight focuses cleanly
            // and the user never has to scroll down through thousands of pixels.
            const isBroadWorkspace = !el ||
              targetSelector === '#tour-main-workspace' ||
              targetSelector === 'main' ||
              targetSelector === 'body';

            if (isBroadWorkspace || (el && el.offsetHeight > (window.innerHeight * 0.55))) {
              // Try finding the dedicated header or topmost prominent heading first
              const compactAnchor = 
                document.querySelector('#tour-page-header') ||
                (el && el.querySelector('h1, h2, h3, [data-tour-header], .page-heading, .sidebar-header')) ||
                document.querySelector('header h2, header h1, main h2, main h1');

              if (compactAnchor && (compactAnchor.offsetWidth > 0 || compactAnchor.offsetHeight > 0)) {
                return compactAnchor;
              }
            }

            if (el && (el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0)) {
              return el;
            }

            // Fallbacks: compact header first, then workspace, then body
            return (
              document.querySelector('#tour-page-header') ||
              document.querySelector('header h2') ||
              document.querySelector('main h2') ||
              document.body
            );
          },
          classList: ['tour-pinpoint-target']
        },
        content: {
          title: s.title,
          desc: s.desc || s.description || '',
          description: s.desc || s.description || ''
        },
        on: {
          afterStep: () => {
            cleanupTourHighlights();
          }
        }
      };
    });

    activeTourPage.value = page;
    activeTourSteps.value = formattedSteps;
    isTourActive.value = true;
  };

  return {
    isTutorialModalOpen,
    activePageId,
    currentRole,
    currentUnitCode,
    activeRoleData,
    availablePages,
    activePageData,
    isTourActive,
    activeTourSteps,
    activeTourPage,
    selectPage,
    openTutorialModal,
    closeTutorialModal,
    endTour,
    startPageTour,
    cleanupTourHighlights
  };
}
