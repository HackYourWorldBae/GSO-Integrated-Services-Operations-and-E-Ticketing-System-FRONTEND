<template>
  <div class="min-h-screen w-full bg-slate-50 font-sans flex overflow-hidden text-slate-900">
    <!-- Mobile Sidebar Dark Overlay -->
    <Transition name="fade">
      <div 
        v-if="isMobileSidebarOpen" 
        @click="isMobileSidebarOpen = false" 
        class="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-sm"
      ></div>
    </Transition>

    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed md:relative flex flex-col transition-all duration-500 ease-in-out z-50 h-[100dvh] border-r border-slate-200 shadow-xl bg-white backdrop-blur-xl overflow-hidden', 
        isSidebarOpen ? 'w-72 border-r' : 'w-0 border-none',
        isMobileSidebarOpen ? 'translate-x-0 w-72 border-r' : '-translate-x-full md:translate-x-0'
      ]"
    >
      <!-- Sidebar Header -->
      <div class="h-24 px-6 flex items-center gap-4 border-b border-slate-100 shrink-0 overflow-hidden min-w-[288px]">
        <div class="w-12 h-12 rounded-xl flex shrink-0 items-center justify-center overflow-hidden">
          <img src="/bsu-logo.png" alt="BSU Logo" class="w-full h-full object-contain" />
        </div>
        <div class="flex flex-col whitespace-nowrap">
          <span class="font-black text-lg text-slate-900 leading-tight tracking-tight">GSO Portal</span>
          <span class="text-[8px] text-emerald-600 font-black tracking-[0.1em] uppercase">Centralized Services E-Ticketing</span>
        </div>
      </div>
      
      <!-- Navigation Sections -->
      <div class="flex-1 overflow-y-auto custom-scrollbar pt-6 pb-20 min-w-[288px]">
        <div class="sidebar-nav space-y-8 px-3" @click="handleNavClick">
          <!-- Main Menu Section -->
          <div>
            <p class="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Main Menu</p>
            <nav class="space-y-1">
              <slot name="sidebar-links">
                <!-- Fallback/Placeholder links -->
                <a href="#" class="nav-item">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span class="text">Overview</span>
                </a>
              </slot>
            </nav>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content wrapper -->
    <div class="flex-1 flex flex-col w-full h-screen overflow-hidden relative">
      <!-- Top Navbar -->
      <header class="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-3 sm:px-6 md:px-10 z-40 sticky top-0 shrink-0">
        <div class="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <!-- Sidebar Toggle Button (Desktop & Mobile) -->
          <button 
            @click="handleToggle" 
            class="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all focus:outline-none shadow-sm active:scale-95 shrink-0"
            title="Toggle Sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 transition-transform duration-500" :class="{ 'rotate-180': !isSidebarOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <!-- Page Title -->
          <div class="flex items-center min-w-0">
            <slot name="header-title">
              <h2 class="text-base sm:text-xl font-bold text-slate-900 tracking-tight truncate">Dashboard Overview</h2>
            </slot>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <slot name="header-actions">
            <!-- Notifications -->
            <div class="relative" id="layout-notification-menu">
              <button 
                @click="toggleNotification" 
                class="relative p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all focus:outline-none group border border-slate-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 group-hover:animate-swing" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span v-if="notifications.length > 0" class="absolute top-2.5 right-2.5 w-2 h-2 bg-amber-500 rounded-full border-2 border-white shadow-[0_0_8px_rgba(245,158,11,0.4)]"></span>
              </button>

              <!-- Notification Dropdown -->
              <Transition name="slide-up">
                <div v-if="isNotificationOpen" class="absolute top-full right-0 mt-3 w-80 bg-white border border-slate-200 rounded-[2rem] shadow-2xl overflow-hidden z-50 origin-top-right">
                  <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest">Notifications</h3>
                    <span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-md">{{ notifications.length }} New</span>
                  </div>
                  
                  <div class="max-h-[400px] overflow-y-auto custom-scrollbar">
                    <div v-for="notif in notifications" :key="notif.id" class="p-5 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div class="flex gap-4">
                        <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shrink-0', notif.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600']">
                          <svg v-if="notif.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div class="space-y-1 overflow-hidden">
                          <p class="text-sm font-bold text-slate-900 truncate group-hover:text-emerald-600 transition-colors">{{ notif.title }}</p>
                          <p class="text-xs text-slate-500 font-medium leading-relaxed">{{ notif.message }}</p>
                          <p class="text-[10px] text-slate-400 font-bold uppercase pt-1">{{ notif.time }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="p-4 bg-slate-50 border-t border-slate-100">
                    <button class="w-full py-2.5 text-xs font-black text-emerald-600 hover:text-emerald-500 uppercase tracking-widest transition-colors">View All Notifications</button>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- User Menu -->
            <div class="relative" id="layout-user-menu">
              <button 
                @click="toggleDropdown" 
                class="flex items-center gap-2 p-1.5 pr-1.5 sm:pr-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-500/30 text-slate-900 transition-all select-none"
              >
                <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                  {{ userName ? userName.charAt(0).toUpperCase() : 'U' }}
                </div>
                <span class="hidden sm:block text-sm font-semibold truncate max-w-[120px]">{{ userName || 'Profile' }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 transition-transform duration-300 hidden sm:block shrink-0" :class="isDropdownOpen ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <!-- Dropdown -->
              <Transition name="slide-up">
                <div v-if="isDropdownOpen" class="absolute top-full right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 origin-top-right">
                  <div class="px-4 py-3 border-b border-slate-100">
                    <p class="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Signed in as</p>
                    <p class="text-sm font-bold text-slate-900 truncate">{{ userName || 'User' }}</p>
                  </div>
                  <div class="p-2">
                    <button @click="handleLogout" class="w-full text-left px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Logout
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </slot>
        </div>
      </header>

      <!-- Main Scrollable Area -->
      <main class="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-6 md:p-10 relative">
        <div class="fixed top-20 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -mr-40 -mt-20"></div>
        <div class="fixed bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none -ml-20 -mb-20"></div>
         
        <div class="relative z-10 w-full max-w-7xl mx-auto">
          <slot name="main-content"></slot>
        </div>
      </main>

      <!-- Modal Overlay Slot -->
      <div class="absolute inset-0 z-[60] pointer-events-none overflow-hidden">
        <slot name="modal-overlay"></slot>
      </div>

      <!-- Custom Confirm Modal -->
      <ConfirmModal 
        :isOpen="confirmModalState.isOpen"
        :title="confirmModalState.title"
        :message="confirmModalState.message"
        :confirmText="confirmModalState.confirmText"
        :type="confirmModalState.type"
        @confirm="executeConfirm"
        @cancel="closeConfirmModal"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import ConfirmModal from '@/components/ConfirmModal.vue';
import api from '@/api/client';

const router = useRouter();
const authStore = useAuthStore();
const userName = ref('');
const userRole = ref('');
const isSidebarOpen = ref(true);
const isMobileSidebarOpen = ref(false);
const isDropdownOpen = ref(false);
const isNotificationOpen = ref(false);

const confirmModalState = reactive({
  isOpen: false,
  title: '',
  message: '',
  confirmText: 'Confirm',
  type: 'danger',
  onConfirm: null
});

const openConfirmModal = (options) => {
  confirmModalState.title = options.title;
  confirmModalState.message = options.message;
  confirmModalState.confirmText = options.confirmText || 'Confirm';
  confirmModalState.type = options.type || 'danger';
  confirmModalState.onConfirm = options.onConfirm;
  confirmModalState.isOpen = true;
};

const closeConfirmModal = () => {
  confirmModalState.isOpen = false;
};

const executeConfirm = () => {
  if (confirmModalState.onConfirm) {
    confirmModalState.onConfirm();
  }
  closeConfirmModal();
};

const notifications = ref([]);

const fetchNotifications = async () => {
  try {
    const role = authStore.role?.toLowerCase() || '';
    let url = '';
    
    if (['student', 'employee'].includes(role)) {
      url = 'tickets/my-requests';
    } else if (['admin', 'dispatcher'].includes(role)) {
      const unit = (authStore.user?.unit_id === 2 || authStore.user?.unit === 'TASU') ? 'tasu' : 'bgmo';
      url = `tickets/active/${unit}`;
    } else if (['worker', 'driver'].includes(role)) {
      url = 'dispatch/active/all';
    }

    if (!url) return;

    const response = await api.get(url);
    let items = [];
    
    if (response.data?.data?.tickets) {
      items = response.data.data.tickets;
    } else if (response.data?.data?.jobs) {
      items = response.data.data.jobs;
    } else if (Array.isArray(response.data?.data)) {
      items = response.data.data;
    }
    
    if (Array.isArray(items)) {
      items.sort((a, b) => (b.id || 0) - (a.id || 0));
      notifications.value = items.slice(0, 5).map(item => ({
        id: item.id || item.ticket_id || Math.random().toString(36),
        title: `Update on Ticket #${item.id || item.ticket_id || 'N/A'}`,
        message: item.service_type ? `Service: ${item.service_type} - Status: ${item.status_label || item.status}` : `Status updated to ${item.status}`,
        time: new Date(item.updated_at || item.submitted_at || Date.now()).toLocaleDateString(),
        type: (item.status === 'resolved' || item.status === 'completed') ? 'success' : 'warning'
      }));
    }
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
  }
};

const handleToggle = () => {
  if (window.innerWidth < 768) {
    isMobileSidebarOpen.value = !isMobileSidebarOpen.value;
  } else {
    isSidebarOpen.value = !isSidebarOpen.value;
  }
};

const handleNavClick = (event) => {
  if (window.innerWidth < 768 && event.target.closest('a, button, [to]')) {
    isMobileSidebarOpen.value = false;
  }
};

const toggleDropdown = (e) => {
  e.stopPropagation();
  isDropdownOpen.value = !isDropdownOpen.value;
  isNotificationOpen.value = false;
};

const toggleNotification = (e) => {
  e.stopPropagation();
  isNotificationOpen.value = !isNotificationOpen.value;
  isDropdownOpen.value = false;
};

const handleOutsideClick = (event) => {
  const dropdownContainer = document.getElementById('layout-user-menu');
  const notificationContainer = document.getElementById('layout-notification-menu');
  
  if (dropdownContainer && !dropdownContainer.contains(event.target)) {
    isDropdownOpen.value = false;
  }
  if (notificationContainer && !notificationContainer.contains(event.target)) {
    isNotificationOpen.value = false;
  }
};

onMounted(() => {
  // Redirect to login if not authenticated
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login' });
    return;
  }

  userName.value = authStore.fullName || 'User';
  userRole.value = authStore.capitalizedRole;

  fetchNotifications();

  document.addEventListener('click', handleOutsideClick);

  router.afterEach(() => {
    if (window.innerWidth < 768) {
      isMobileSidebarOpen.value = false;
    }
  });
});

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});

const handleLogout = () => {
  openConfirmModal({
    title: 'Sign Out',
    message: 'Sign out of GSO Portal?',
    confirmText: 'Sign Out',
    type: 'danger',
    onConfirm: async () => {
      await authStore.logout();
      router.push({ name: 'login' });
    }
  });
};
</script>

<style>
/* Aesthetics */
:root {
  scrollbar-gutter: stable;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.1);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.2);
}

/* Sidebar Nav */
.sidebar-nav .nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 16px;
  color: #64748b; 
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  font-size: 0.925rem;
  white-space: nowrap;
  text-decoration: none;
  border: 1px solid transparent;
  margin: 4px 0;
}

.sidebar-nav .nav-item svg {
  transition: all 0.3s ease;
  flex-shrink: 0;
  color: #94a3b8; 
}

.sidebar-nav .nav-item:hover {
  background-color: #f0fdf4;
  color: #059669;
  border-color: #dcfce7;
  transform: translateX(4px);
}

.sidebar-nav .nav-item:hover svg {
  transform: scale(1.15);
  color: #059669;
}

.sidebar-nav .nav-item.router-link-active {
  background: #f0fdf4;
  color: #059669;
  border-color: #dcfce7;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.sidebar-nav .nav-item.router-link-active svg {
  color: #059669;
}

/* Animations */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

@keyframes swing {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(10deg); }
  75% { transform: rotate(-10deg); }
}
.animate-swing {
  animation: swing 0.5s ease-in-out;
}
</style>