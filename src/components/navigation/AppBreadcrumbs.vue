<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const breadcrumbs = computed(() => {
  const path = route.path;
  const crumbs = [];

  // Determine root destination based on current route prefix
  let rootTo = '/user/dashboard';
  if (path.startsWith('/superadmin')) rootTo = '/superadmin/users';
  else if (path.startsWith('/admin/fgmu')) rootTo = '/admin/fgmu';
  else if (path.startsWith('/admin/leau')) rootTo = '/admin/leau';
  else if (path.startsWith('/admin/ssu')) rootTo = '/admin/ssu';
  else if (path.startsWith('/dispatcher/fgmu')) rootTo = '/dispatcher/fgmu';
  else if (path.startsWith('/dispatcher/leau')) rootTo = '/dispatcher/leau';
  else if (path.startsWith('/director')) rootTo = '/director';

  crumbs.push({
    label: 'GSO Portal',
    to: rootTo,
    isHome: true
  });

  // Level 1: Contextual Portal / Unit
  if (path.startsWith('/superadmin')) {
    crumbs.push({ label: 'Superadmin Portal', to: '/superadmin/users' });
  } else if (path.startsWith('/admin/fgmu')) {
    crumbs.push({ label: 'FGMU Admin', to: '/admin/fgmu' });
  } else if (path.startsWith('/admin/leau')) {
    crumbs.push({ label: 'LEAU Admin', to: '/admin/leau' });
  } else if (path.startsWith('/admin/ssu')) {
    crumbs.push({ label: 'SSU Admin', to: '/admin/ssu' });
  } else if (path.startsWith('/dispatcher/fgmu')) {
    crumbs.push({ label: 'FGMU Dispatcher', to: '/dispatcher/fgmu' });
  } else if (path.startsWith('/dispatcher/leau')) {
    crumbs.push({ label: 'LEAU Dispatcher', to: '/dispatcher/leau' });
  } else if (path.startsWith('/director')) {
    crumbs.push({ label: 'Director Portal', to: '/director' });
  } else if (path.startsWith('/user')) {
    crumbs.push({ label: 'Requestor', to: '/user/dashboard' });
  } else if (path.startsWith('/services')) {
    crumbs.push({ label: 'Service Catalog', to: '/services' });
  } else if (path.startsWith('/projects')) {
    crumbs.push({ label: 'Scheduled Projects', to: '/projects' });
  }

  // Level 2: Specific Functional View
  if (path.includes('/superadmin/users')) {
    crumbs.push({ label: 'User Account Management', to: null });
  } else if (path.includes('/superadmin/logs')) {
    crumbs.push({ label: 'Audit Trail & Operations Logs', to: null });
  } else if (path.includes('/superadmin/dashboard')) {
    crumbs.push({ label: 'System Overview', to: null });
  } else if (path.includes('/queues')) {
    crumbs.push({ label: path.includes('/ssu') ? 'Incident Queues' : 'Ticket Queues', to: null });
  } else if (path.includes('/personnel')) {
    crumbs.push({ label: 'Personnel Management', to: null });
  } else if (path.includes('/archives')) {
    crumbs.push({ label: 'Archives', to: null });
  } else if (path.includes('/workers')) {
    crumbs.push({ label: 'Assign Workers', to: null });
  } else if (path.includes('/dispatched')) {
    crumbs.push({ label: 'Dispatched Tickets', to: null });
  } else if (path.includes('/completed-tickets')) {
    crumbs.push({ label: 'Completed Tickets', to: null });
  } else if (path.includes('/tickets')) {
    crumbs.push({ label: 'My Tickets', to: null });
  } else if (path.includes('/edit-profile')) {
    crumbs.push({ label: 'Account Settings', to: null });
  } else if (path.includes('/forms')) {
    crumbs.push({ label: 'Request Intake Form', to: null });
  }

  // Level 3: Active ticket / query parameter
  const targetId = route.query.ticket || route.query.highlight;
  if (targetId) {
    crumbs.push({ label: `#${targetId}`, to: null, isCurrent: true });
  }

  // Remove consecutive duplicates (e.g. Overview landing pages)
  const uniqueCrumbs = [];
  crumbs.forEach((crumb) => {
    if (uniqueCrumbs.length === 0 || uniqueCrumbs[uniqueCrumbs.length - 1].label !== crumb.label) {
      uniqueCrumbs.push(crumb);
    }
  });

  return uniqueCrumbs;
});
</script>

<template>
  <nav aria-label="Breadcrumb" class="mb-5 flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto custom-scrollbar py-1">
    <ol class="flex items-center gap-1.5 flex-nowrap">
      <li v-for="(crumb, index) in breadcrumbs" :key="index" class="flex items-center gap-1.5 shrink-0">
        <!-- Breadcrumb separator -->
        <svg
          v-if="index > 0"
          xmlns="http://www.w3.org/2000/svg"
          class="h-3.5 w-3.5 text-slate-300 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
        </svg>

        <!-- Home Icon for first crumb -->
        <router-link
          v-if="crumb.isHome"
          :to="crumb.to"
          class="inline-flex items-center gap-1 font-semibold text-slate-400 hover:text-emerald-600 transition-colors"
          title="Go to Portal Overview"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="hover:underline">{{ crumb.label }}</span>
        </router-link>

        <!-- Navigable Intermediate Crumb -->
        <router-link
          v-else-if="crumb.to && index < breadcrumbs.length - 1"
          :to="crumb.to"
          class="font-medium text-slate-500 hover:text-emerald-700 hover:underline transition-colors truncate max-w-[160px]"
        >
          {{ crumb.label }}
        </router-link>

        <!-- Current / Terminal Crumb -->
        <span
          v-else
          class="font-bold text-slate-800 truncate max-w-[200px]"
          aria-current="page"
        >
          {{ crumb.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>
