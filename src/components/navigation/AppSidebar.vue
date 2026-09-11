<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const authStore = useAuthStore();

// Detect active role — prioritizing authenticated user's assigned role
const activeRole = computed(() => {
  const userRole = (authStore.role || '').toLowerCase();
  if (userRole === 'superadmin') return 'superadmin';
  if (userRole === 'admin') return 'admin';
  if (userRole === 'dispatcher') return 'dispatcher';
  if (userRole === 'director') return 'director';
  if (['student', 'employee', 'worker'].includes(userRole)) return 'requestor';

  // Fallback to route path if authStore role is not yet populated
  const path = route.path.toLowerCase();
  if (path.startsWith('/superadmin')) return 'superadmin';
  if (path.startsWith('/admin')) return 'admin';
  if (path.startsWith('/dispatcher')) return 'dispatcher';
  if (path.startsWith('/director')) return 'director';
  return 'requestor';
});

// Detect active unit for Admin & Dispatcher
const activeUnit = computed(() => {
  const userRole = (authStore.role || '').toLowerCase();
  const unitId = Number(authStore.unitId ?? authStore.user?.unit_id ?? 0);

  // If user belongs to a specific unit and is an operational admin/dispatcher, lock to their unit
  if (['admin', 'dispatcher'].includes(userRole)) {
    if (unitId === 1) return 'fgmu';
    if (unitId === 2) return 'leau';
    if (unitId === 3) return 'ssu';
  }

  // Otherwise inspect current path
  const path = route.path.toLowerCase();
  if (path.includes('/fgmu')) return 'fgmu';
  if (path.includes('/leau')) return 'leau';
  if (path.includes('/ssu')) return 'ssu';

  if (unitId === 2) return 'leau';
  if (unitId === 3) return 'ssu';
  return 'fgmu';
});

const unitLabel = computed(() => activeUnit.value.toUpperCase());

// Exact and prefix active matcher
const isItemActive = (item) => {
  if (!item || !item.to) return false;

  const currentPath = route.path.toLowerCase();
  const [targetPath, targetQuery] = item.to.toLowerCase().split('?');

  // If item specifies query parameters, compare against fullPath
  if (targetQuery) {
    return currentPath === targetPath && route.fullPath.toLowerCase().includes(targetQuery);
  }

  // Superadmin distinct route matching
  if (targetPath === '/superadmin/dashboard') {
    return currentPath === '/superadmin/dashboard' || currentPath === '/superadmin';
  }
  if (targetPath === '/superadmin/users') {
    return currentPath === '/superadmin/users';
  }
  if (targetPath === '/superadmin/queues') {
    return ['/superadmin/queues', '/superadmin/verification', '/superadmin/verification-queue', '/superadmin/user-queues'].includes(currentPath);
  }
  if (targetPath === '/superadmin/logs') {
    return currentPath === '/superadmin/logs';
  }

  if (item.exact) {
    return currentPath === targetPath;
  }

  return currentPath === targetPath || (currentPath.startsWith(targetPath + '/') && targetPath !== '/');
};

// Generate base navigation menu configurations
const rawNavGroups = computed(() => {
  const role = activeRole.value;
  const unit = activeUnit.value;
  const isSSU = unit === 'ssu';
  const unitUpper = unitLabel.value;

  if (role === 'superadmin') {
    return [
      {
        title: 'Superadmin Controls',
        items: [
          {
            label: 'Dashboard Overview',
            to: '/superadmin/dashboard',
            exact: true,
            icon: 'home'
          },
          {
            label: 'User Accounts',
            to: '/superadmin/users',
            exact: true,
            icon: 'users',
            permission: 'users.provision'
          },
          {
            label: 'User Queues',
            to: '/superadmin/queues',
            exact: true,
            icon: 'shield',
            permission: 'users.provision'
          },
          {
            label: 'Audit Trail',
            to: '/superadmin/logs',
            exact: true,
            icon: 'archive'
          }
        ]
      }
    ];
  }

  if (role === 'admin' || role === 'dispatcher') {
    return [
      {
        title: `${unitUpper} Operations`,
        items: [
          {
            label: `${unitUpper} Home`,
            to: `/admin/${unit}`,
            exact: true,
            icon: 'home'
          },
          ...(isSSU ? [
            {
              label: 'Incident Queues',
              to: '/admin/ssu/queues/incidents',
              icon: 'shield'
            }
          ] : [
            {
              label: 'Approved Tickets',
              to: `/admin/${unit}/approved-tickets`,
              icon: 'queue'
            },
            {
              label: 'Assign Workers',
              to: `/admin/${unit}/assign-workers`,
              icon: 'dispatch'
            },
            {
              label: 'Scheduled Tickets',
              to: `/admin/${unit}/dispatched`,
              icon: 'calendar'
            },
            {
              label: 'Active Tickets',
              to: `/admin/${unit}/active-tickets`,
              icon: 'tools'
            },
            {
              label: 'Personnel Management',
              to: `/admin/${unit}/personnel`,
              icon: 'users'
            }
          ])
        ]
      },
      {
        title: 'Archives',
        items: [
          {
            label: isSSU ? 'Archived Incidents' : 'Archived Tickets',
            to: `/admin/${unit}/archives`,
            icon: 'archive'
          }
        ]
      }
    ];
  }

  if (role === 'director') {
    return [
      {
        title: 'Executive Portal',
        items: [
          {
            label: 'Executive Overview',
            to: '/director/dashboard',
            exact: true,
            icon: 'home'
          },
          {
            label: 'Materials Valuation',
            to: '/director/materials',
            exact: true,
            icon: 'materials'
          }
        ]
      },
      {
        title: 'Unit Ticket Queues',
        items: [
          {
            label: 'FGMU Ticket Queues',
            to: '/director/fgmu/queues',
            exact: true,
            icon: 'tools',
            permission: 'tickets.view_all'
          },
          {
            label: 'LEAU Ticket Queues',
            to: '/director/leau/queues',
            exact: true,
            icon: 'leaf',
            permission: 'tickets.view_all'
          }
        ]
      },
      {
        title: 'Unit Analytics & Reports',
        items: [
          {
            label: 'FGMU Facilities',
            to: '/director/fgmu',
            exact: true,
            icon: 'tools',
            permission: 'reports.view'
          },
          {
            label: 'LEAU Environment',
            to: '/director/leau',
            exact: true,
            icon: 'leaf',
            permission: 'reports.view'
          },
          {
            label: 'SSU Security',
            to: '/director/ssu',
            exact: true,
            icon: 'shield',
            permission: 'reports.view'
          }
        ]
      }
    ];
  }

  // Requestor / User Default (Student, Employee, Worker)
  return [
    {
      title: 'Main Menu',
      items: [
        {
          label: 'Dashboard Overview',
          to: '/user/dashboard',
          exact: true,
          icon: 'home'
        },
        {
          label: 'My Service Requests',
          to: '/user/tickets',
          icon: 'queue'
        },
        {
          label: 'Completed Tickets',
          to: '/user/completed-tickets',
          icon: 'check'
        },
        {
          label: 'Account Settings',
          to: '/user/edit-profile',
          icon: 'settings'
        }
      ]
    }
  ];
});

// Dynamic filtering based on active user capabilities from RBAC Matrix
const navGroups = computed(() => {
  return rawNavGroups.value
    .map(group => {
      const items = group.items.filter(item => {
        if (!item.permission) return true;
        return authStore.hasPermission(item.permission);
      });
      return { ...group, items };
    })
    .filter(group => group.items.length > 0);
});
</script>

<template>
  <div class="space-y-6">
    <div v-for="(group, gIdx) in navGroups" :key="gIdx">
      <p class="px-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5">
        {{ group.title }}
      </p>
      <nav class="space-y-1">
        <router-link
          v-for="item in group.items"
          :key="item.to"
          :to="item.to"
          exact-active-class="router-link-exact-active"
          :class="[
            'nav-item group',
            isItemActive(item) ? 'router-link-active' : ''
          ]"
        >
          <!-- SVG Icons -->
          <!-- Home -->
          <svg v-if="item.icon === 'home'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          
          <!-- Queue / Tickets -->
          <svg v-else-if="item.icon === 'queue'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>

          <!-- Users / Personnel -->
          <svg v-else-if="item.icon === 'users'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>


          <!-- Dispatch -->
          <svg v-else-if="item.icon === 'dispatch'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>

          <!-- Calendar / Scheduled -->
          <svg v-else-if="item.icon === 'calendar'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>

          <!-- Archive -->
          <svg v-else-if="item.icon === 'archive'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>

          <!-- Folder / Projects -->
          <svg v-else-if="item.icon === 'folder'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>

          <!-- Completed Check -->
          <svg v-else-if="item.icon === 'check'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <!-- Settings -->
          <svg v-else-if="item.icon === 'settings'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>

          <!-- Analytics Chart -->
          <svg v-else-if="item.icon === 'chart'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>

          <!-- Shield / Security (SSU) -->
          <svg v-else-if="item.icon === 'shield'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>

          <!-- Tools / Facilities & Maintenance (FGMU) -->
          <svg v-else-if="item.icon === 'tools'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>

          <!-- Leaf / Environment & Landscaping (LEAU) -->
          <svg v-else-if="item.icon === 'leaf'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>

          <!-- Materials / Inventory / Box -->
          <svg v-else-if="item.icon === 'box' || item.icon === 'materials'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 text-emerald-500 group-hover:text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>

          <!-- Org Hierarchy -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>

          <span class="text truncate">{{ item.label }}</span>
        </router-link>
      </nav>
    </div>
  </div>
</template>
