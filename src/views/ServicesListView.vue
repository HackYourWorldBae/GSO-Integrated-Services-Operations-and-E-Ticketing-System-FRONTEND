<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import ConfirmModal from '@/components/ConfirmModal.vue';

const router = useRouter();

// --- STATE ---
const userName = ref('');
const userRole = ref('');
const isDropdownOpen = ref(false);
const selectedServices = reactive({}); // Stores selected checkboxes
const otherSpecifics = reactive({});   // Stores text for "Others" inputs
const tempCustom = reactive({});       // Stores temp title/desc for custom others
const customDescriptions = reactive({}); // Stores descriptions of confirmed custom services

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

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// --- DATA STRUCTURE WITH ICONS ---
const getServiceIcon = (service) => {
  const icons = {
    "Disinfection": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-check"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`,
    "Cleaning/ Grubbing": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shovels"><path d="M2 22v-5l5-5 5 5-5 5z"/><path d="M9.5 14.5 16 8"/><path d="m17 2 5 5-5 5-5-5z"/><path d="m8 17 5 5"/></svg>`,
    "Hauling": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-truck"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-5h-7v7Z"/><path d="M13 9h4"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>`,
    "Mowing/ Weeding": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-leaf"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
    "Planting/ Landscaping": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sprout"><path d="M7 20h10"/><path d="M10 20c5.5-2.5 8-6.4 8-10"/><path d="M21 4c-5.4.5-8.75 3-10 7"/><path d="M3 20c2.5-5.5 6.4-8 10-8"/><path d="M20 4c-5.4.5-8.75 3-10 7"/></svg>`,
    "Pruning/ Cutting": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-scissors"><circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/><path d="M8.12 15.88 12 12"/><path d="M14.8 9.2 20 4"/></svg>`,
    "Concrete Works": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
    "Masonry Works": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layers"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>`,
    "Welding & Tinsmith Works": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap"><path d="M4 14.71 13.47 3 11 10.29h9L10.53 22 13 14.71H4z"/></svg>`,
    "Carpentry & Joinery": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hammer"><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6l-.86.86c-.85.85-1.65 1.18-2.25.58l-1.25-1.25"/><path d="m2.18 16c.33.9 1.15 1.4 1.82 1.4.67 0 1.49-.5 1.82-1.4"/></svg>`,
    "Glass & Glazing Works": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-grid"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`,
    "Painting Works": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paintbrush"><path d="m14.6 12.6 .7.7"/><path d="m15.5 10.5 1 1"/><path d="M17.6 8.5c.7.7.7 1.8 0 2.5l-5.5 5.5-1.5 1.5-3.7 3.7c-.5.5-1.3.5-1.8 0s-.5-1.3 0-1.8l3.7-3.7 1.5-1.5 5.5-5.5c.7-.7 1.8-.7 2.5 0Z"/><path d="M11 2h2"/><path d="M6 3h12"/><path d="M10 6h4"/></svg>`,
    "Electrical Work": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plug-zap"><path d="M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z"/><path d="m2 22 3-3"/><path d="M7.5 13.5 10 11"/><path d="M10.5 16.5 13 14"/><path d="m18 3-4 4h6l-4 4"/></svg>`,
    "Plumbing & Sanitary Works": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-droplet"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>`,
    "Electronics & Communication Works": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cpu"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>`,
    "Mechanical Works": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
    "Vehicle Pass Sticker": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ticket"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="m9 12 2 2 4-4"/></svg>`,
    "Incident Report": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-warning"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 11v4"/><path d="M12 18h.01"/></svg>`,
    "Book A University Vehicle": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car-front"><path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.64 5H8.36a2 2 0 0 0-1.86 1.3L5 10l-2-2"/><path d="M20 10c2 0 2 1 2 2v5c0 1-1 2-2 2h-1c-1 0-1-1-1-2V10Z"/><path d="M4 10c-2 0-2 1-2 2v5c0 1 1 2 2 2h1c1 0 1-1 1-2V10Z"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="18" x2="12" y2="22"/></svg>`,
    "Borrowing of plants": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flower2"><path d="M12 2v8"/><path d="m4.93 10.93 4.24-4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="M14 8h8"/><path d="M2 8h8"/><path d="m9.17 14.83-4.24 4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="M12 22v-8"/><circle cx="12" cy="12" r="4"/></svg>`,
    "Stage & Hall Decoration": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-party-popper"><path d="M5.8 11.3 2 22l10.7-3.8Z"/><path d="M4 3h.01"/><path d="M9 2h.01"/><path d="M14 3h.01"/><path d="M15 9h.01"/><path d="M22 2h.01"/><path d="M22 9h.01"/><path d="M18 14h.01"/><path d="M11 14h.01"/><path d="M13 20h.01"/><path d="M7 15h.01"/><path d="M16 21h.01"/><path d="M2 11h.01"/><path d="M2 4h.01"/></svg>`,
    "Borrowing of tools/ equipment": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wrench"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a2 2 0 0 1-2.79-2.79L14.7 6.3Z"/><path d="m20 13 2 2"/><path d="m5 22 5-5"/><path d="M17 14.7c-.35 2.2-2.15 4-4.35 4.35L8.5 22.25c-1.12.37-2.12-.63-1.75-1.75l3.2-4.15c.35-2.2 2.15-4 4.35-4.35l4.15-3.2c1.12-.37 2.12.63 1.75 1.75l-3.2 4.15Z"/></svg>`,
    "Others": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-circle"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>`
  };
  return icons[service] || icons["Others"];
};

const serviceCategories = ref([
  {
    title: "Janitorial & Landscaping",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brush"><path d="m9.06 11.9 8.07-8.06a1.2 1.2 0 0 1 1.7 0l2.33 2.33a1.2 1.2 0 0 1 0 1.7l-8.06 8.07"/><path d="m7.07 13.89 5.04 5.05"/><path d="m3.12 17.84 4.87-4.87c.39-.39 1.03-.39 1.42 0l2.62 2.63c.39.39.39 1.03 0 1.42l-4.87 4.87a1 1 0 0 1-1.41 0l-2.63-2.62a1 1 0 0 1 0-1.43Z"/></svg>`,
    services: [
      "Disinfection", "Cleaning/ Grubbing", "Hauling", 
      "Mowing/ Weeding", "Planting/ Landscaping", "Pruning/ Cutting", 
      "Borrowing of plants", "Stage & Hall Decoration", "Borrowing of tools/ equipment", "Others"
    ]
  },
  {
    title: "Structure & Finishes",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    services: [
      "Concrete Works", "Masonry Works", "Welding & Tinsmith Works", 
      "Carpentry & Joinery", "Glass & Glazing Works", "Painting Works", "Others"
    ]
  },
  {
    title: "Utilities & Mechanical",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wrench"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a2 2 0 0 1-2.79-2.79L14.7 6.3Z"/><path d="m20 13 2 2"/><path d="m5 22 5-5"/><path d="M17 14.7c-.35 2.2-2.15 4-4.35 4.35L8.5 22.25c-1.12.37-2.12-.63-1.75-1.75l3.2-4.15c.35-2.2 2.15-4 4.35-4.35l4.15-3.2c1.12-.37 2.12.63 1.75 1.75l-3.2 4.15Z"/></svg>`,
    services: [
      "Electrical Work", "Plumbing & Sanitary Works", 
      "Electronics & Communication Works", "Mechanical Works", "Others"
    ]
  },
  {
    title: "Security Services",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-half"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="M12 22V2"/></svg>`,
    services: [
      "Vehicle Pass Sticker", "Incident Report", "Others"
    ]
  },
  {
    title: "Transportation Services",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bus-front"><path d="M4 11a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z"/><path d="M4 18V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9"/><path d="M12 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/><path d="M9 18v2"/><path d="M15 18v2"/></svg>`,
    services: [
      "Book A University Vehicle", "Others"
    ]
  }
]);

// --- AUTH & USER CHECK ON LOAD ---
onMounted(() => {
  // Close dropdown when clicking outside
  document.addEventListener('click', (event) => {
    const dropdownContainer = document.getElementById('user-profile-menu');
    if (dropdownContainer && !dropdownContainer.contains(event.target)) {
      isDropdownOpen.value = false;
    }
  });

  const storedUser = localStorage.getItem('user');
  const storedRole = localStorage.getItem('role');

  // Auth disabled for testing
  /*
  if (!storedUser || !storedRole) {
    // Not logged in? Redirect to login
    router.push('/');
    return;
  }
  */

  if (storedUser && storedRole) {
    const user = JSON.parse(storedUser);
    userName.value = `${user.first_name} ${user.last_name}`;
    userRole.value = storedRole.charAt(0).toUpperCase() + storedRole.slice(1);
  } else {
    // Provide fallback values if auth is disabled
    userName.value = 'Demo User';
    userRole.value = 'User';
  }

  // Initialize selection state
  serviceCategories.value.forEach(cat => {
    cat.services.forEach(service => {
      selectedServices[`${cat.title}-${service}`] = false;
    });
    otherSpecifics[cat.title] = '';
    tempCustom[cat.title] = { title: '', description: '' };
  });
});

// --- LOGOUT LOGIC ---
const handleLogout = () => {
  openConfirmModal({
    title: 'Sign Out',
    message: 'Are you sure you want to log out from GSO Portal?',
    confirmText: 'Sign Out',
    type: 'danger',
    onConfirm: () => {
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      router.push('/');
    }
  });
};

// --- TOGGLE SERVICE ---
const toggleService = (catTitle, service) => {
  if (service === 'Book A University Vehicle') return; // Handled separately as a link
  const key = `${catTitle}-${service}`;
  selectedServices[key] = !selectedServices[key];
};

// --- CUSTOM SERVICE CONFIRM ---
const confirmCustomService = (catTitle) => {
  const custom = tempCustom[catTitle];
  if (!custom.title.trim()) {
    alert("Please provide a title for your custom service.");
    return;
  }
  
  const category = serviceCategories.value.find(c => c.title === catTitle);
  if (category) {
    const newServiceTitle = custom.title.trim();
    const othersIndex = category.services.indexOf('Others');
    
    if (!category.services.includes(newServiceTitle)) {
      if (othersIndex !== -1) {
        category.services.splice(othersIndex, 0, newServiceTitle);
      } else {
        category.services.push(newServiceTitle);
      }
    }
    
    const serviceKey = `${catTitle}-${newServiceTitle}`;
    selectedServices[serviceKey] = true;
    customDescriptions[serviceKey] = custom.description.trim();
    
    selectedServices[`${catTitle}-Others`] = false;
    tempCustom[catTitle] = { title: '', description: '' };
  }
};

const cancelCustomService = (catTitle) => {
  selectedServices[`${catTitle}-Others`] = false;
  tempCustom[catTitle] = { title: '', description: '' };
};

const removeCustomService = (catTitle, service) => {
  openConfirmModal({
    title: 'Remove Custom Service',
    message: `Are you sure you want to remove the custom service "${service}"?`,
    confirmText: 'Remove',
    type: 'danger',
    onConfirm: () => {
      const category = serviceCategories.value.find(c => c.title === catTitle);
      if (category) {
        category.services = category.services.filter(s => s !== service);
      }
      delete selectedServices[`${catTitle}-${service}`];
      delete customDescriptions[`${catTitle}-${service}`];
    }
  });
};

// --- NAVIGATION ---
const goToVehicleAvailability = () => {
  router.push('/services/vehicle-availability');
};

// --- HANDLE FORM SUBMISSION ---
const handleSubmit = () => {
  // Check if at least one service is selected
  const hasSelection = Object.values(selectedServices).some(val => val === true);
  if (!hasSelection) {
    alert("Please select at least one service.");
    return;
  }

  // Save selection and details for the Forms page
  localStorage.setItem('selectedServices', JSON.stringify(selectedServices));
  localStorage.setItem('otherSpecifics', JSON.stringify(otherSpecifics));
  localStorage.setItem('customDescriptions', JSON.stringify(customDescriptions));
  
  // Navigate to Forms View
  router.push('/services/forms');
};
</script>

<template>
  <div class="min-h-screen w-full bg-slate-50 font-sans">
    
    <nav class="bg-white/90 backdrop-blur-lg border-b border-slate-200 px-4 sm:px-8 md:px-12 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-50">
      
      <div class="flex items-center gap-3 sm:gap-4">
        <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex shrink-0 items-center justify-center overflow-hidden">
          <img src="/bsu-logo.png" alt="BSU Logo" class="w-full h-full object-contain" />
        </div>
        <div class="flex flex-col whitespace-nowrap">
          <span class="font-black text-base sm:text-lg text-slate-900 leading-tight tracking-tight">GSO Services</span>
          <span class="text-[8px] text-emerald-600 font-black tracking-[0.1em] uppercase">Centralized Services E-Ticketing</span>
        </div>
      </div>

      <div class="flex items-center gap-3 sm:gap-6 relative" id="user-profile-menu">
        <div class="flex items-center gap-2 sm:gap-3 cursor-pointer select-none" @click="toggleDropdown">
          <div class="text-right hidden sm:block">
            <p class="text-slate-900 font-bold flex items-center gap-1.5 justify-end hover:text-emerald-600 transition-colors">
              {{ userName }}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-300" :class="isDropdownOpen ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" /></svg>
            </p>
            <span class="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-0.5 border border-emerald-100 uppercase">{{ userRole }}</span>
          </div>
          <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
            {{ userName ? userName.charAt(0).toUpperCase() : 'U' }}
          </div>
        </div>
        
        <!-- Dropdown Menu -->
        <div v-show="isDropdownOpen" class="absolute top-14 right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-dropdown-fade origin-top-right">
          <div class="p-4 border-b border-slate-50 bg-slate-50/50">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Account</p>
            <p class="text-sm font-bold text-slate-900 truncate">{{ userName }}</p>
          </div>
          <div class="p-2">
            <router-link to="/user/dashboard" class="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Dashboard Overview
            </router-link>
            <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-all mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>


    <main class="max-w-6xl mx-auto p-3 sm:p-6 md:p-10 pb-20">
      
      <div class="mb-8 sm:mb-12">
        <h2 class="text-3xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight">What do you need help with?</h2>
        <p class="text-slate-500 mt-2 text-base sm:text-lg">Select the services required for your request. You can choose multiple items.</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-16">
          
          <div v-for="(category, index) in serviceCategories" :key="index" class="space-y-6">
            
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shadow-sm" v-html="category.icon"></div>
              <div>
                <h3 class="text-xl sm:text-2xl font-bold text-slate-900">{{ category.title }}</h3>
                <div class="h-1 w-12 bg-emerald-600 rounded-full mt-1"></div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <template v-for="service in category.services" :key="service">
                <!-- SPECIAL: Check Vehicle Availability Button -->
                <div 
                  v-if="service === 'Book A University Vehicle'"
                  @click="goToVehicleAvailability"
                  class="
                    group relative cursor-pointer select-none rounded-[2rem] p-6 transition-all duration-300 border-2
                    flex flex-col items-center justify-center gap-4 text-center min-h-[160px]
                    bg-gradient-to-br from-amber-500 to-orange-600 border-amber-400 text-white shadow-lg shadow-amber-500/30 -translate-y-1 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/40
                  "
                >
                  <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/20 text-white shadow-inner" v-html="getServiceIcon(service)"></div>
                  <span class="text-sm font-black leading-tight uppercase tracking-wide">Book A University Vehicle</span>
                  <div class="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-orange-600 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                  </div>
                </div>

                <!-- REGULAR: Checkable Service Card -->
                <div 
                  v-else
                  @click="toggleService(category.title, service)"
                  class="
                    group relative cursor-pointer select-none rounded-[2rem] p-6 transition-all duration-300 border-2
                    flex flex-col items-center justify-center gap-4 text-center min-h-[160px]
                  "
                  :class="selectedServices[`${category.title}-${service}`] 
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-600/30 -translate-y-1' 
                    : 'bg-white border-slate-100 text-slate-600 shadow-sm hover:border-emerald-200 hover:bg-emerald-50/30 hover:shadow-md'
                  "
                >
                  <!-- Icon Container -->
                  <div 
                    class="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300"
                    :class="selectedServices[`${category.title}-${service}`] ? 'text-white' : 'bg-slate-50 text-slate-400 group-hover:text-emerald-600 group-hover:bg-white'"
                    v-html="getServiceIcon(service)"
                  ></div>

                  <!-- Remove button for custom services -->
                  <button 
                    type="button"
                    v-if="customDescriptions[`${category.title}-${service}`]"
                    @click.stop="removeCustomService(category.title, service)"
                    class="absolute top-4 left-4 w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white z-10 shadow-sm"
                    title="Remove custom service"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>

                  <div class="flex flex-col items-center">
                    <span class="text-sm font-bold leading-tight">{{ service }}</span>
                    <p v-if="customDescriptions[`${category.title}-${service}`]" class="text-[10px] opacity-80 mt-1.5 line-clamp-2 max-w-[90%]">{{ customDescriptions[`${category.title}-${service}`] }}</p>
                  </div>

                  <!-- Selection Indicator -->
                  <div 
                    class="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
                    :class="selectedServices[`${category.title}-${service}`] ? 'bg-white/20 scale-100' : 'bg-slate-100 scale-0 group-hover:scale-100 group-hover:bg-white'"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" :class="selectedServices[`${category.title}-${service}`] ? 'text-white' : 'text-slate-300'"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                </div>
              </template>
            </div>

            <!-- Expanded Others Input Area -->
            <div v-if="selectedServices[`${category.title}-Others`]" class="animate-fade-in pt-4 max-w-3xl">
              <div class="bg-white rounded-[2rem] border-2 border-emerald-500/20 shadow-sm p-8 space-y-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </div>
                  <div>
                    <h4 class="text-lg font-black text-slate-900 leading-tight uppercase tracking-tight">Custom Service</h4>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Create a specific service for {{ category.title }}</p>
                  </div>
                </div>
                
                <div class="space-y-4 pt-2">
                  <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Service Title</label>
                    <input 
                      v-model="tempCustom[category.title].title"
                      type="text"
                      placeholder="e.g. Deep Cleaning"
                      class="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 text-sm font-bold outline-none transition-all"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Specify Requirements</label>
                    <textarea 
                      v-model="tempCustom[category.title].description"
                      placeholder="Provide detailed instructions or descriptions for the GSO team..."
                      class="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 text-sm font-medium outline-none transition-all min-h-[100px] resize-none"
                    ></textarea>
                  </div>

                  <div class="flex justify-end pt-2 gap-3">
                    <button 
                      type="button" 
                      @click="cancelCustomService(category.title)" 
                      class="px-6 py-3 bg-white hover:bg-slate-50 text-slate-500 font-bold rounded-xl border border-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      @click="confirmCustomService(category.title)" 
                      class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors"
                    >
                      Confirm Custom Service
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div class="mt-16 sm:mt-24 bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[3rem] border-2 border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          <div class="flex items-center gap-4">
            <div class="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p class="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Ready to Proceed?</p>
              <p class="text-lg sm:text-xl font-bold text-slate-900">Review your selected services before submitting.</p>
            </div>
          </div>
          <button type="submit" class="w-full md:w-auto px-10 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg rounded-[2rem] shadow-2xl shadow-emerald-600/30 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95 group">
            <span>Continue to Review</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>
      </form>

    </main>

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
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-dropdown-fade {
  animation: dropdownFade 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes dropdownFade {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 20px;
}
::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>