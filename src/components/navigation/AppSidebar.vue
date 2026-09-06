<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const authStore = useAuthStore();

// Detect active role
const activeRole = computed(() => {
  const path = route.path.toLowerCase();
  if (path.startsWith('/superadmin')) return 'superadmin';
  if (path.startsWith('/admin')) return 'admin';
  if (path.startsWith('/dispatcher')) return 'dispatcher';
  if (path.startsWith('/director')) return 'director';
  if (path.startsWith('/user')) return 'requestor';
  
  // Fallback to authStore role
  const userRole = (authStore.role || '').toLowerCase();
  if (userRole === 'superadmin') return 'superadmin';
  if (userRole === 'admin') return 'admin';
  if (userRole === 'dispatcher') return 'dispatcher';
  if (userRole === 'director') return 'director';
  return 'requestor';
});

// Detect active unit for Admin & Dispatcher
const activeUnit = computed(() => {
  const path = route.path.toLowerCase();
  if (path.includes('/fgmu')) return 'fgmu';
  if (path.includes('/leau')) return 'leau';
  if (path.includes('/ssu')) return 'ssu';

  // Fallback to authStore user unit
  const unitId = Number(authStore.unit_id || authStore.user?.unit_id || 1);
  if (unitId === 2) return 'leau';
  if (unitId === 3) return 'ssu';
  return 'fgmu';
});

const unitLabel = computed(() => activeUnit.value.toUpperCase());

// Generate navigation menu configuration
const navGroups = computed(() => {
  const role = activeRole.value;
  const unit = activeUnit.value;

  if (role === 'superadmin') {
    return [
      {
        title: 'Superadmin Controls',
        items: [
          {
            label: 'System Overview',
            to: '/superadmin/dashboard',
            exact: true,
            icon: 'home'
          },
          {
            label: 'User Accounts',
            to: '/superadmin/users',
            icon: 'users'
          },
          {
            label: 'Audit Trail',
            to: '/superadmin/logs',
            icon: 'shield'
          }
        ]
      },
      {
        title: 'Operational Unit Portals',
        items: [
          {
            label: 'FGMU Management',
            to: '/admin/fgmu',
            icon: 'queue'
          },
          {
            label: 'LEAU Management',
            to: '/admin/leau',
            icon: 'queue'
          },
          {
            label: 'SSU Management',
            to: '/admin/ssu',
            icon: 'shield'
          },
          {
            label: 'Director Analytics',
            to: '/director',
            icon: 'chart'
          }
        ]
      }
    ];
  }

  if (role === 'admin') {
    const isSSU = unit === 'ssu';
    return [
      {
        title: `${unitLabel.value} Admin Menu`,
        items: [
          {
            label: `${unitLabel.value} Home`,
            to: `/admin/${unit}`,
            exact: true,
            icon: 'home'
          },
          {
            label: isSSU ? 'Incident Queues' : 'Ticket Queues',
            to: `/admin/${unit}/queues`,
            icon: 'queue'
          },
          ...(isSSU ? [] : [
            {
              label: 'Personnel Management',
              to: `/admin/${unit}/personnel`,
              icon: 'users'
            },
            {
              label: 'Project Announcements',
              to: `/admin/${unit}/announcements`,
              icon: 'announcement'
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
          },
          ...(isSSU ? [] : [
            {
              label: 'Archived Projects',
              to: `/admin/${unit}/project-archives`,
              icon: 'folder'
            }
          ])
        ]
      }
    ];
  }

  if (role === 'dispatcher') {
    return [
      {
        title: `${unitLabel.value} Dispatch Menu`,
        items: [
          {
            label: 'Queue Overview',
            to: `/dispatcher/${unit}`,
            exact: true,
            icon: 'home'
          },
          {
            label: 'Assign Workers',
            to: `/dispatcher/${unit}/workers`,
            icon: 'users'
          },
          {
            label: 'Dispatched Tickets',
            to: `/dispatcher/${unit}/dispatched`,
            icon: 'dispatch'
          }
        ]
      },
      {
        title: 'Archives',
        items: [
          {
            label: 'Ticket Archives',
            to: `/dispatcher/${unit}/archives`,
            icon: 'archive'
          },
          {
            label: 'Project Archives',
            to: `/dispatcher/${unit}/project-archives`,
            icon: 'folder'
          }
        ]
      }
    ];
  }

  if (role === 'director') {
    return [
      {
        title: 'Director Portal',
        items: [
          {
            label: 'Executive Overview',
            to: '/director',
            exact: true,
            icon: 'home'
          },
          {
            label: 'FGMU Analytics',
            to: '/director/fgmu',
            icon: 'chart'
          },
          {
            label: 'LEAU Analytics',
            to: '/director/leau',
            icon: 'chart'
          },
          {
            label: 'SSU Analytics',
            to: '/director/ssu',
            icon: 'shield'
          },
          {
            label: 'Organizational Chart',
            to: '/director/org-chart',
            icon: 'hierarchy'
          }
        ]
      }
    ];
  }

  // Requestor / User Default
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
          :exact="item.exact"
          class="nav-item group"
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

          <!-- Announcements -->
          <svg v-else-if="item.icon === 'announcement'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>

          <!-- Dispatch -->
          <svg v-else-if="item.icon === 'dispatch'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
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

          <!-- Shield / Security -->
          <svg v-else-if="item.icon === 'shield'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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
