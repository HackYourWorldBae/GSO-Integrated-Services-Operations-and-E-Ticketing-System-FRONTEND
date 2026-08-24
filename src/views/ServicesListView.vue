<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import ConfirmModal from '@/components/ConfirmModal.vue';

const router = useRouter();
const authStore = useAuthStore();

// --- STATE ---
const userName = ref('');
const userRole = ref('');
const isDropdownOpen = ref(false);
const selectedServices = reactive({});
const otherSpecifics = reactive({});
const tempCustom = reactive({});
const customDescriptions = reactive({});

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

const closeConfirmModal = () => { confirmModalState.isOpen = false; };

const executeConfirm = () => {
  if (confirmModalState.onConfirm) confirmModalState.onConfirm();
  closeConfirmModal();
};

const toggleDropdown = () => { isDropdownOpen.value = !isDropdownOpen.value; };

// --- SERVICE ICONS — each icon chosen to represent the actual function ---
const getServiceIcon = (service) => {
  const icons = {
    // FGMU – Structure & Finishes
    "Concrete Works":
      `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
    "Masonry Works":
      `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="14" width="8" height="4" rx="1"/><rect x="10" y="14" width="12" height="4" rx="1"/><rect x="2" y="6" width="12" height="4" rx="1"/><rect x="16" y="6" width="6" height="4" rx="1"/><path d="M2 20h20M2 12h20M2 4h20"/></svg>`,
    "Welding & Tinsmith Works":
      `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.71 13.47 3 11 10.29h9L10.53 22 13 14.71H4z"/></svg>`,
    "Carpentry & Joinery":
      `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6l-.86.86c-.85.85-1.65 1.18-2.25.58l-1.25-1.25"/></svg>`,
    "Glass & Glazing Works":
      `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`,
    "Painting Works":
      `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 19c0 1.1-.9 2-2 2s-2-.9-2-2"/><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" x2="6" y1="2" y2="8"/><line x1="10" x2="10" y1="2" y2="8"/><line x1="14" x2="14" y1="2" y2="8"/></svg>`,

    // FGMU – Utilities & Mechanical
    "Electrical Work":
      `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z"/><path d="m2 22 3-3"/><path d="M7.5 13.5 10 11"/><path d="M10.5 16.5 13 14"/><path d="m18 3-4 4h6l-4 4"/></svg>`,
    "Plumbing & Sanitary Works":
      `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>`,
    "Electronics & Communication Works":
      `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>`,
    "Mechanical Works":
      `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,

    // LEAU – Janitorial & Landscaping
    "Disinfection":
      `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`,
    "Cleaning/ Grubbing":
      `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9.06 11.9 8.07-8.06a1.2 1.2 0 0 1 1.7 0l2.33 2.33a1.2 1.2 0 0 1 0 1.7l-8.06 8.07"/><path d="m7.07 13.89 5.04 5.05"/><path d="m3.12 17.84 4.87-4.87c.39-.39 1.03-.39 1.42 0l2.62 2.63c.39.39.39 1.03 0 1.42l-4.87 4.87a1 1 0 0 1-1.41 0l-2.63-2.62a1 1 0 0 1 0-1.43Z"/></svg>`,
    "Hauling":
      `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-5h-7v7Z"/><path d="M13 9h4"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>`,
    "Mowing/ Weeding":
      `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
    "Planting/ Landscaping":
      `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5 8-6.4 8-10"/><path d="M21 4c-5.4.5-8.75 3-10 7"/><path d="M3 20c2.5-5.5 6.4-8 10-8"/><path d="M20 4c-5.4.5-8.75 3-10 7"/></svg>`,
    "Pruning/ Cutting":
      `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/><path d="M8.12 15.88 12 12"/><path d="M14.8 9.2 20 4"/></svg>`,
    "Borrowing of plants":
      `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v8"/><path d="m4.93 10.93 4.24-4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="M14 8h8"/><path d="M2 8h8"/><path d="m9.17 14.83-4.24 4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="M12 22v-8"/><circle cx="12" cy="12" r="4"/></svg>`,
    "Stage & Hall Decoration":
      `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.8 11.3 2 22l10.7-3.8Z"/><path d="M4 3h.01"/><path d="M9 2h.01"/><path d="M14 3h.01"/><path d="M15 9h.01"/><path d="M22 2h.01"/><path d="M22 9h.01"/><path d="M18 14h.01"/><path d="M11 14h.01"/><path d="M13 20h.01"/><path d="M7 15h.01"/><path d="M16 21h.01"/><path d="M2 11h.01"/><path d="M2 4h.01"/></svg>`,
    "Borrowing of tools/ equipment":
      `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a2 2 0 0 1-2.79-2.79L14.7 6.3Z"/><path d="m20 13 2 2"/><path d="m5 22 5-5"/><path d="M17 14.7c-.35 2.2-2.15 4-4.35 4.35L8.5 22.25c-1.12.37-2.12-.63-1.75-1.75l3.2-4.15c.35-2.2 2.15-4 4.35-4.35l4.15-3.2c1.12-.37 2.12.63 1.75 1.75l-3.2 4.15Z"/></svg>`,

    // SSU – Security Services
    "Vehicle Pass Sticker":
      `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="m9 12 2 2 4-4"/></svg>`,
    "Incident Report":
      `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 11v4"/><path d="M12 18h.01"/></svg>`,

    // TASU – Transportation Services
    "Book A University Vehicle":
      `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.64 5H8.36a2 2 0 0 0-1.86 1.3L5 10l-2-2"/><path d="M20 10c2 0 2 1 2 2v5c0 1-1 2-2 2h-1c-1 0-1-1-1-2V10Z"/><path d="M4 10c-2 0-2 1-2 2v5c0 1 1 2 2 2h1c1 0 1-1 1-2V10Z"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="18" x2="12" y2="22"/></svg>`,

    "Others":
      `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>`
  };
  return icons[service] || icons["Others"];
};

// --- SUB-UNIT DATA ---
// Colors kept muted/soft — only LEAU uses emerald, others use slate-based tones.
const subUnits = ref([
  {
    id: 'fgmu',
    name: 'FGMU',
    fullName: 'Facilities and Ground Management Unit',
    description: 'Handles all physical infrastructure and facilities maintenance across the campus, including structural, finishing, and mechanical systems repair and upkeep.',
    // Soft slate-indigo, not sharp
    headerClass: 'bg-slate-800',
    accentText: 'text-slate-300',
    accentBg: 'bg-slate-100',
    accentIcon: 'text-slate-600',
    accentBorder: 'border-slate-200',
    accentHover: 'hover:border-slate-300',
    accentBadge: 'bg-slate-100 text-slate-600 border-slate-200',
    unitInitialBg: 'bg-slate-700',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    categories: [
      {
        title: "Structure & Finishes",
        description: "Repair and renovation of building structures and surface finishes.",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
        services: ["Concrete Works", "Masonry Works", "Welding & Tinsmith Works", "Carpentry & Joinery", "Glass & Glazing Works", "Painting Works", "Others"]
      },
      {
        title: "Utilities & Mechanical",
        description: "Installation, repair, and maintenance of electrical, plumbing, and mechanical systems.",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a2 2 0 0 1-2.79-2.79L14.7 6.3Z"/><path d="m20 13 2 2"/><path d="m5 22 5-5"/><path d="M17 14.7c-.35 2.2-2.15 4-4.35 4.35L8.5 22.25c-1.12.37-2.12-.63-1.75-1.75l3.2-4.15c.35-2.2 2.15-4 4.35-4.35l4.15-3.2c1.12-.37 2.12.63 1.75 1.75l-3.2 4.15Z"/></svg>`,
        services: ["Electrical Work", "Plumbing & Sanitary Works", "Electronics & Communication Works", "Mechanical Works", "Others"]
      }
    ]
  },
  {
    id: 'leau',
    name: 'LEAU',
    fullName: 'Landscaping and Environmental Aesthetics Unit',
    description: 'Responsible for campus cleanliness, environmental services, grounds beautification, and auxiliary support including waste management, disinfection, and event staging.',
    // Emerald — kept as-is, user said this one is good
    headerClass: 'bg-emerald-700',
    accentText: 'text-emerald-300',
    accentBg: 'bg-emerald-50',
    accentIcon: 'text-emerald-600',
    accentBorder: 'border-emerald-200',
    accentHover: 'hover:border-emerald-300',
    accentBadge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    unitInitialBg: 'bg-emerald-600',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
    categories: [
      {
        title: "Janitorial & Landscaping",
        description: "Cleaning, sanitation, waste hauling, and grounds maintenance for all campus areas.",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
        services: ["Disinfection", "Cleaning/ Grubbing", "Hauling", "Mowing/ Weeding", "Planting/ Landscaping", "Pruning/ Cutting", "Borrowing of plants", "Stage & Hall Decoration", "Borrowing of tools/ equipment", "Others"]
      }
    ]
  },
  {
    id: 'ssu',
    name: 'SSU',
    fullName: 'Security Services Unit',
    description: 'Manages campus security operations including access control, vehicle pass issuance, and official incident documentation for the university community.',
    // Muted warm-stone — not sharp amber
    headerClass: 'bg-stone-700',
    accentText: 'text-stone-300',
    accentBg: 'bg-stone-50',
    accentIcon: 'text-stone-600',
    accentBorder: 'border-stone-200',
    accentHover: 'hover:border-stone-300',
    accentBadge: 'bg-stone-100 text-stone-600 border-stone-200',
    unitInitialBg: 'bg-stone-600',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="M12 22V2"/></svg>`,
    categories: [
      {
        title: "Security Services",
        description: "Vehicle pass sticker processing and official incident report documentation.",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>`,
        services: ["Vehicle Pass Sticker", "Incident Report", "Others"]
      }
    ]
  },
  {
    id: 'tasu',
    name: 'TASU',
    fullName: 'Transportation and Automotive Services Unit',
    description: 'Provides official university transportation services, managing vehicle scheduling and dispatch for academic, administrative, and official university functions.',
    // Muted slate-zinc — not sharp violet
    headerClass: 'bg-zinc-800',
    accentText: 'text-zinc-300',
    accentBg: 'bg-zinc-50',
    accentIcon: 'text-zinc-600',
    accentBorder: 'border-zinc-200',
    accentHover: 'hover:border-zinc-300',
    accentBadge: 'bg-zinc-100 text-zinc-600 border-zinc-200',
    unitInitialBg: 'bg-zinc-600',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z"/><path d="M4 18V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9"/><path d="M12 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/><path d="M9 18v2"/><path d="M15 18v2"/></svg>`,
    categories: [
      {
        title: "Transportation Services",
        description: "Book and schedule official university vehicles for approved trips and events.",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-5h-7v7Z"/><path d="M13 9h4"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>`,
        services: ["Book A University Vehicle", "Others"]
      }
    ]
  }
]);

// Flat list of all categories (used for init + toggles)
const serviceCategories = computed(() =>
  subUnits.value.flatMap(u => u.categories)
);

// Total selected count for the sticky bar
const totalSelected = computed(() =>
  Object.values(selectedServices).filter(v => v === true).length
);

// --- INIT ---
onMounted(() => {
  document.addEventListener('click', (e) => {
    const el = document.getElementById('user-profile-menu');
    if (el && !el.contains(e.target)) isDropdownOpen.value = false;
  });

  if (!authStore.isAuthenticated) {
    router.push({ name: 'login' });
    return;
  }

  userName.value = authStore.fullName || 'User';
  userRole.value = authStore.capitalizedRole;

  serviceCategories.value.forEach(cat => {
    cat.services.forEach(s => {
      selectedServices[`${cat.title}-${s}`] = false;
    });
    otherSpecifics[cat.title] = '';
    tempCustom[cat.title] = { title: '', description: '' };
  });
});

// --- LOGOUT ---
const handleLogout = () => {
  openConfirmModal({
    title: 'Sign Out',
    message: 'Are you sure you want to log out from GSO Portal?',
    confirmText: 'Sign Out',
    type: 'danger',
    onConfirm: async () => {
      await authStore.logout();
      router.push({ name: 'login' });
    }
  });
};

// --- TOGGLE ---
const toggleService = (catTitle, service) => {
  const key = `${catTitle}-${service}`;
  selectedServices[key] = !selectedServices[key];
};

// --- CUSTOM SERVICE ---
const confirmCustomService = (catTitle) => {
  const custom = tempCustom[catTitle];
  if (!custom.title.trim()) {
    alert("Please provide a title for your custom service.");
    return;
  }
  const category = serviceCategories.value.find(c => c.title === catTitle);
  if (category) {
    const title = custom.title.trim();
    const othersIdx = category.services.indexOf('Others');
    if (!category.services.includes(title)) {
      if (othersIdx !== -1) category.services.splice(othersIdx, 0, title);
      else category.services.push(title);
    }
    selectedServices[`${catTitle}-${title}`] = true;
    customDescriptions[`${catTitle}-${title}`] = custom.description.trim();
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
    message: `Remove the custom service "${service}"?`,
    confirmText: 'Remove',
    type: 'danger',
    onConfirm: () => {
      const cat = serviceCategories.value.find(c => c.title === catTitle);
      if (cat) cat.services = cat.services.filter(s => s !== service);
      delete selectedServices[`${catTitle}-${service}`];
      delete customDescriptions[`${catTitle}-${service}`];
    }
  });
};

// --- SUBMIT ---
const handleSubmit = () => {
  const hasSelection = Object.values(selectedServices).some(v => v === true);
  if (!hasSelection) {
    alert("Please select at least one service.");
    return;
  }
  localStorage.setItem('selectedServices', JSON.stringify(selectedServices));
  localStorage.setItem('otherSpecifics', JSON.stringify(otherSpecifics));
  localStorage.setItem('customDescriptions', JSON.stringify(customDescriptions));
  router.push('/services/forms');
};
</script>

<template>
  <div class="min-h-screen w-full bg-slate-50 font-sans">

    <!-- ─── NAVBAR ─── -->
    <nav class="bg-white/95 backdrop-blur-lg border-b border-slate-200 px-4 sm:px-8 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-50">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex shrink-0 items-center justify-center overflow-hidden">
          <img src="/bsu-logo.png" alt="BSU Logo" class="w-full h-full object-contain" />
        </div>
        <div class="flex flex-col">
          <span class="font-black text-sm sm:text-base text-slate-900 leading-tight tracking-tight">GSO Services</span>
          <span class="text-[8px] text-emerald-600 font-black tracking-[0.1em] uppercase hidden xs:block">Centralized Services E-Ticketing</span>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-4 relative" id="user-profile-menu">
        <div class="flex items-center gap-2 cursor-pointer select-none" @click="toggleDropdown">
          <div class="hidden sm:flex flex-col text-right">
            <p class="text-slate-900 font-bold text-sm flex items-center gap-1.5 justify-end hover:text-emerald-600 transition-colors">
              {{ userName }}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 transition-transform duration-300" :class="isDropdownOpen ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" /></svg>
            </p>
            <span class="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 uppercase">{{ userRole }}</span>
          </div>
          <div class="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
            {{ userName ? userName.charAt(0).toUpperCase() : 'U' }}
          </div>
        </div>

        <div v-show="isDropdownOpen" class="absolute top-14 right-0 mt-1 w-52 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 origin-top-right animate-dropdown-fade">
          <div class="p-3.5 border-b border-slate-100 bg-slate-50/50">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Account</p>
            <p class="text-sm font-bold text-slate-900 truncate">{{ userName }}</p>
          </div>
          <div class="p-2">
            <router-link to="/user/dashboard" class="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Dashboard Overview
            </router-link>
            <button @click="handleLogout" class="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-all mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- ─── MAIN CONTENT ─── -->
    <main class="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 pt-8 sm:pt-12 pb-44">

      <!-- Page Header -->
      <div class="mb-10 sm:mb-14">
        <span class="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-200 mb-3">Service Request</span>
        <h2 class="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          What do you need <span class="text-emerald-600">help</span> with?
        </h2>
        <p class="text-slate-500 mt-2 sm:mt-3 text-sm sm:text-base font-medium max-w-xl">
          Select services from any unit below. You can pick multiple items across different sections.
        </p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-14 sm:space-y-20">

          <!-- ── One section per Sub-Unit ── -->
          <section v-for="unit in subUnits" :key="unit.id">

            <!-- Unit Header -->
            <div :class="['rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 mb-6 sm:mb-8 text-white relative overflow-hidden', unit.headerClass]">
              <!-- Subtle glare blobs -->
              <div class="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none"></div>
              <div class="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full -ml-12 -mb-12 blur-2xl pointer-events-none"></div>

              <div class="relative z-10 flex items-start sm:items-center gap-4 sm:gap-6">

                <!-- Big unit initials -->
                <div :class="['rounded-2xl flex items-center justify-center shrink-0 border border-white/10', unit.unitInitialBg]"
                     style="width:64px;height:64px;">
                  <span class="text-2xl font-black text-white tracking-tight leading-none">{{ unit.name }}</span>
                </div>

                <div class="flex-1 min-w-0">
                  <!-- Full unit name -->
                  <h3 class="text-base sm:text-xl font-black text-white leading-tight tracking-tight">{{ unit.fullName }}</h3>
                  <p class="mt-1.5 text-white/65 text-xs sm:text-sm leading-relaxed font-medium">{{ unit.description }}</p>
                </div>

                <!-- Unit icon – visible on desktop only -->
                <div class="hidden lg:flex w-12 h-12 rounded-xl bg-white/10 items-center justify-center shrink-0 border border-white/10 text-white" v-html="unit.icon"></div>
              </div>
            </div>

            <!-- Categories within the Unit -->
            <div class="space-y-8 sm:space-y-10">
              <div v-for="(category, catIdx) in unit.categories" :key="catIdx">

                <!-- Category Sub-Header -->
                <div class="flex items-center gap-3 mb-4 sm:mb-5">
                  <div :class="['w-9 h-9 rounded-xl flex items-center justify-center shrink-0', unit.accentBg, unit.accentIcon]" v-html="category.icon"></div>
                  <div class="min-w-0 flex-1">
                    <h4 class="text-base sm:text-lg font-black text-slate-900 leading-tight">{{ category.title }}</h4>
                    <p class="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 leading-snug">{{ category.description }}</p>
                  </div>
                  <div class="flex-1 h-px bg-slate-200 ml-2 hidden sm:block"></div>
                </div>

                <!-- Service Cards Grid — 2 cols on mobile, 3 on sm, 4 on lg -->
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
                  <template v-for="service in category.services" :key="service">

                    <!-- Regular: Checkable Service Card -->
                    <div
                      @click="toggleService(category.title, service)"
                      class="group relative cursor-pointer select-none rounded-2xl sm:rounded-[1.5rem] p-4 sm:p-5 transition-all duration-300 border-2 flex flex-col items-center justify-center gap-2.5 sm:gap-3 text-center min-h-[130px] sm:min-h-[145px]"
                      :class="selectedServices[`${category.title}-${service}`]
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20 -translate-y-0.5'
                        : ['bg-white border-slate-100 text-slate-600 shadow-sm hover:-translate-y-0.5 hover:shadow-md', unit.accentHover]"
                    >
                      <!-- Icon -->
                      <div
                        class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0"
                        :class="selectedServices[`${category.title}-${service}`]
                          ? 'text-white bg-white/15'
                          : [unit.accentBg, unit.accentIcon, 'group-hover:scale-110']"
                        v-html="getServiceIcon(service)"
                      ></div>

                      <!-- Remove button (custom services only) -->
                      <button
                        type="button"
                        v-if="customDescriptions[`${category.title}-${service}`]"
                        @click.stop="removeCustomService(category.title, service)"
                        class="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white z-10"
                        title="Remove custom service"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>

                      <div class="flex flex-col items-center gap-1">
                        <span class="text-[11px] sm:text-xs font-bold leading-tight">{{ service }}</span>
                        <p v-if="customDescriptions[`${category.title}-${service}`]" class="text-[9px] sm:text-[10px] opacity-70 line-clamp-2 max-w-[90%]">{{ customDescriptions[`${category.title}-${service}`] }}</p>
                      </div>

                      <!-- Check indicator -->
                      <div
                        class="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300"
                        :class="selectedServices[`${category.title}-${service}`] ? 'bg-white/25 scale-100' : 'scale-0 group-hover:scale-100 bg-slate-100'"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" :class="selectedServices[`${category.title}-${service}`] ? 'text-white' : 'text-slate-400'"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                      </div>
                    </div>

                  </template>
                </div>

                <!-- "Others" custom input panel -->
                <div v-if="selectedServices[`${category.title}-Others`]" class="animate-fade-in pt-3 sm:pt-4">
                  <div class="bg-white rounded-2xl sm:rounded-[1.75rem] border-2 border-emerald-500/20 shadow-sm p-5 sm:p-8 space-y-4 max-w-2xl">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </div>
                      <div>
                        <h4 class="text-base font-black text-slate-900 uppercase tracking-tight">Custom Service</h4>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Create a specific service for {{ category.title }}</p>
                      </div>
                    </div>
                    <div class="space-y-3 sm:space-y-4 pt-1">
                      <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Service Title</label>
                        <input
                          v-model="tempCustom[category.title].title"
                          type="text"
                          placeholder="e.g. Deep Cleaning"
                          class="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 text-sm font-bold outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Specify Requirements</label>
                        <textarea
                          v-model="tempCustom[category.title].description"
                          placeholder="Provide detailed instructions for the GSO team..."
                          class="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 text-sm font-medium outline-none transition-all min-h-[90px] resize-none"
                        ></textarea>
                      </div>
                      <div class="flex justify-end gap-2 sm:gap-3 pt-1">
                        <button type="button" @click="cancelCustomService(category.title)" class="px-4 sm:px-6 py-2.5 sm:py-3 bg-white hover:bg-slate-50 text-slate-500 font-bold rounded-xl border border-slate-200 text-sm transition-colors">Cancel</button>
                        <button type="button" @click="confirmCustomService(category.title)" class="px-4 sm:px-6 py-2.5 sm:py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow text-sm transition-colors">Confirm Service</button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </section>
        </div>
      </form>
    </main>

    <!-- ─── STICKY BOTTOM BAR ─── -->
    <div class="fixed bottom-0 left-0 right-0 z-50 px-3 sm:px-6 pb-3 sm:pb-5">
      <div class="max-w-6xl mx-auto">
        <div class="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl sm:rounded-[2rem] shadow-2xl shadow-slate-900/10 p-3.5 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">

          <div class="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Your Selection</p>
              <p class="text-sm sm:text-base font-black text-slate-900">
                <span :class="totalSelected > 0 ? 'text-emerald-600' : 'text-slate-400'">{{ totalSelected }}</span>
                {{ totalSelected === 1 ? 'service' : 'services' }} selected
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <router-link to="/user/dashboard" class="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs sm:text-sm text-center transition-all">
              ← Dashboard
            </router-link>
            <button
              @click="handleSubmit"
              :disabled="totalSelected === 0"
              class="flex-1 sm:flex-none px-6 sm:px-8 py-2.5 sm:py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 group active:scale-95"
            >
              <span>Fill Out Form</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- Confirm Modal -->
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
  animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.animate-dropdown-fade {
  animation: dropdownFade 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0);    }
}
@keyframes dropdownFade {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1);    }
}
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 20px; }
::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
</style>