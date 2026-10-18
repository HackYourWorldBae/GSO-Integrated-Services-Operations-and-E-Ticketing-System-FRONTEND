import { ref, computed } from 'vue';
import router from '@/router';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useAuthStore } from '@/stores/auth';

const isTutorialModalOpen = ref(false);
const activePageId = ref('');

/**
 * ═════════════════════════════════════════════════════════════════════════
 * REUSABLE ADMIN PAGE BUILDERS (FGMU / LEAU / SSU)
 * ═════════════════════════════════════════════════════════════════════════
 */

const createAdminDashboardPage = (unitCode = 'fgmu') => {
  const u = unitCode.toLowerCase();
  const U = unitCode.toUpperCase();
  const unitNames = {
    fgmu: 'Facilities & Grounds Management Unit',
    leau: 'Landscaping & Environmental Aesthetics Unit',
    ssu: 'Safety & Security Services Unit'
  };
  const unitName = unitNames[u] || `${U} Operations`;

  return {
    id: `admin-${u}-dashboard`,
    name: 'Home Analytics',
    route: `/admin/${u}`,
    icon: '📊',
    summary: `Central operational analytics tracking throughput, active technician workloads, and incoming service requests for ${U}.`,
    sections: [
      { title: 'Operational KPI Counters', desc: 'Real-time metrics for Pending Approvals, Dispatched Orders, In Progress jobs, and Accomplished work.' },
      { title: 'Technician Workload Balance', desc: 'Live roster availability showing active technicians on site, available staff, and personnel on leave.' },
      { title: 'Operational Stream & Live Feed', desc: 'Real-time audit log of ticket status transitions, assignments, and resolution notes.' }
    ],
    tourSteps: [
      { element: '#tour-main-workspace', title: `1. ${U} Operations Dashboard`, desc: `Welcome to the central command hub for ${unitName}. Monitor daily operations and field performance at a glance.` },
      { element: '.grid', title: '2. Operational KPI Gauges', desc: 'Track pending reviews, today\'s dispatched work orders, active repairs in progress, and accomplished jobs in real time.' },
      { element: '#tour-sidebar-nav', title: '3. Operations Navigation', desc: 'Access your ticket queues, worker dispatch workspace, personnel roster, inventory, and historical archives.' },
      { element: '#tour-notifications-btn', title: '4. Real-Time Chime Alerts', desc: 'Instant audio chimes and badge alerts notify administrators whenever a new service ticket is routed to your unit.' },
      { element: '#tour-comfort-btn', title: '5. High-Contrast Comfort View', desc: 'Switch to accessible comfort mode anytime for high-contrast viewing during extended monitoring shifts.' }
    ]
  };
};

const createAdminQueuesPage = (unitCode = 'fgmu') => {
  const u = unitCode.toLowerCase();
  const U = unitCode.toUpperCase();
  const isSsu = u === 'ssu';

  return {
    id: `admin-${u}-queues`,
    name: isSsu ? 'Submitted Incidents' : 'Pending Approvals',
    route: isSsu ? `/admin/${u}/submitted-tickets` : `/admin/${u}/queues`,
    icon: '📥',
    summary: isSsu
      ? 'Inspect incoming campus incident reports, review witness statements and photos, and initiate safety investigations.'
      : `Examine submitted service tickets, inspect problem descriptions and photos, and make administrative decisions for ${U}.`,
    sections: [
      { title: 'Filter & Search Toolbar', desc: 'Quickly find tickets by ID number, requester name, building location, or urgency flag.' },
      { title: 'Problem Scope & Attached Photos', desc: 'Inspect problem descriptions, designated campus rooms, and client-attached photos.' },
      { title: 'Administrative Decision Controls', desc: isSsu
        ? 'Approve for security response, start investigation, delay review, or escalate report to Director.'
        : 'Approve for dispatch, decline out-of-scope work, delay for inspection, recategorize, or escalate to Director.'
      }
    ],
    tourSteps: [
      { element: '#tour-main-workspace', title: isSsu ? '1. Submitted Incidents Queue' : '1. Pending Approvals Queue', desc: 'Review newly submitted tickets awaiting administrative verification and assessment.' },
      { element: 'input[type="text"]', title: '2. Search & Scope Filtering', desc: 'Filter requests by ticket ID, requester, college building, room, or issue description.' },
      { element: 'table, .space-y-4', title: '3. Problem Particulars & Photos', desc: 'Click any request to examine uploaded photos, user details, urgency markers, and complete scope notes.' },
      { element: 'button', title: '4. Decision Controls', desc: 'Take action: Approve to proceed to dispatch, Decline with justification, Delay review, Recategorize, or Escalate to Director.' }
    ]
  };
};

const createAdminDispatchPage = (unitCode = 'fgmu') => {
  const u = unitCode.toLowerCase();
  const U = unitCode.toUpperCase();
  const isLeau = u === 'leau';

  return {
    id: `admin-${u}-dispatch`,
    name: 'Ticket Dispatch',
    route: `/admin/${u}/assign-workers`,
    icon: '👷',
    summary: `Assign qualified technicians or responders to approved tickets, set calendar implementation dates, and calculate target deadlines.`,
    sections: [
      { title: 'Active Ticket Target Banner', desc: 'Highlights the ticket currently being dispatched with requester details and building room.' },
      { title: 'Implementation Calendar & Working Days', desc: 'Pick the visit date and target duration; institutional business calendars automatically bypass weekends and official holidays.' },
      { title: isLeau ? 'Inventory Allocation / Material Assessment' : 'Initial Material Pre-Assessment', desc: 'Itemize estimated supplies and benchmark prices needed before workers deploy to the field.' },
      { title: 'Personnel Allocation Roster', desc: 'View technician trade specializations, active workloads, and assign primary and secondary workers.' }
    ],
    tourSteps: [
      { element: '#tour-main-workspace', title: `1. ${U} Dispatch Workspace`, desc: 'Allocate personnel, set official implementation dates, and launch field work orders.' },
      { element: '.rounded-3xl, .rounded-2xl', title: '2. Active Target Banner', desc: 'Inspect the selected ticket number, problem scope, emergency marker, and designated campus building.' },
      { element: '.grid', title: '3. Schedule & Business Days', desc: 'Select the implementation start date and target working days. Weekends and official non-working holidays are excluded automatically.' },
      { element: 'table, .sm\\:hidden', title: '4. Material Estimation Table', desc: 'Pre-assess standard consumable materials and benchmark prices required for the job.' },
      { element: 'button', title: '5. Staff Assignment', desc: 'Select qualified technicians based on trade specialty and availability to finalize dispatch.' }
    ]
  };
};

const createAdminDispatchedPage = (unitCode = 'fgmu') => {
  const u = unitCode.toLowerCase();
  const U = unitCode.toUpperCase();

  return {
    id: `admin-${u}-dispatched`,
    name: 'Scheduled Work Orders',
    route: `/admin/${u}/dispatched`,
    icon: '📅',
    summary: `Manage dispatched jobs awaiting on-site execution, print physical Job Order slips, or reschedule visit dates if necessary.`,
    sections: [
      { title: 'Scheduled Work Orders List', desc: 'View upcoming field visits with designated technicians, implementation dates, and calculated deadlines.' },
      { title: 'Official Job Order Printing', desc: 'Generate and print formal University Job Order PDF slips containing worker names and authorized scopes.' },
      { title: 'Reschedule & Worker Swap', desc: 'Adjust implementation dates if weather prevents work, or reassign workers if staff is on leave.' }
    ],
    tourSteps: [
      { element: '#tour-main-workspace', title: `1. ${U} Scheduled Jobs Queue`, desc: 'Manage work orders scheduled for site execution by assigned technicians.' },
      { element: 'table, .space-y-4', title: '2. Scheduled Implementation Cards', desc: 'Inspect upcoming visit dates, assigned staff names, and deadline milestones.' },
      { element: 'button', title: '3. Job Order Slips & Actions', desc: 'Print physical job orders for technicians to carry, or reschedule implementation dates if site access is delayed.' }
    ]
  };
};

const createAdminActivePage = (unitCode = 'fgmu') => {
  const u = unitCode.toLowerCase();
  const U = unitCode.toUpperCase();
  const isSsu = u === 'ssu';

  return {
    id: `admin-${u}-active`,
    name: isSsu ? 'Under Investigation' : 'Active Dispatches',
    route: isSsu ? `/admin/${u}/investigating-tickets` : `/admin/${u}/active-tickets`,
    icon: '⚡',
    summary: isSsu
      ? 'Monitor ongoing security investigations, review witness accounts and incident evidence, and record findings.'
      : `Monitor jobs currently undergoing active field execution, authorize timeline extensions, and liquidate materials used.`,
    sections: [
      { title: 'Live In-Progress Workspace', desc: 'Track jobs actively being serviced by technicians on campus grounds.' },
      { title: 'Timeline Extension Authorization', desc: 'Approve justified additional working days requested by technicians due to unforeseen complications.' },
      { title: 'Material Liquidation & Completion', desc: 'Record actual spare parts consumed on site and verify accomplishment photos to complete the ticket.' }
    ],
    tourSteps: [
      { element: '#tour-main-workspace', title: isSsu ? '1. Active Investigations' : '1. Active Dispatches Queue', desc: 'Monitor ongoing operations in real-time as field staff execute maintenance on site.' },
      { element: 'table, .space-y-4', title: '2. Ongoing Work Order Cards', desc: 'Track days elapsed, implementation targets, and live technician status.' },
      { element: 'button', title: '3. Extensions & Accomplishment', desc: 'Approve timeline extension requests, liquidate actual materials used, and sign off on completed work.' }
    ]
  };
};

const createAdminPersonnelPage = (unitCode = 'fgmu') => {
  const u = unitCode.toLowerCase();
  const U = unitCode.toUpperCase();

  return {
    id: `admin-${u}-personnel`,
    name: 'Unit Personnel',
    route: `/admin/${u}/personnel`,
    icon: '👥',
    summary: `Manage the unit personnel roster, monitor technician availability and active assignments, and register new staff members.`,
    sections: [
      { title: 'Personnel Directory & Specialties', desc: 'Roster of all staff with trade specialties (Electrical, Plumbing, Landscaping, Security, etc.).' },
      { title: 'Real-Time Duty Status Badges', desc: 'Instant status tags: Available (ready for dispatch), Working on Site, or On Leave.' },
      { title: 'Workload Balance & Profile Modal', desc: 'Review active tickets per worker and update phone numbers, specialties, or duty status.' }
    ],
    tourSteps: [
      { element: '#tour-main-workspace', title: `1. ${U} Personnel Roster`, desc: 'Manage your unit technicians, duty schedules, and field specializations.' },
      { element: 'button', title: '2. Add Staff Member', desc: 'Register a new personnel account with employee ID, trade specialty, and contact details.' },
      { element: 'table, .grid', title: '3. Staff Cards & Duty Status', desc: 'View active ticket workloads and toggle personnel availability between Available, Working, and On Leave.' }
    ]
  };
};

const createAdminInventoryPage = (unitCode = 'fgmu') => {
  const u = unitCode.toLowerCase();
  const U = unitCode.toUpperCase();
  const isLeau = u === 'leau';

  return {
    id: `admin-${u}-inventory`,
    name: isLeau ? 'Plant & Tool Inventory' : 'Tools & Equipment Inventory',
    route: `/admin/${u}/inventory`,
    icon: '📦',
    summary: `Manage university stock, track tool and plant quantities, allocate items to borrowing requests, and log returns.`,
    sections: [
      { title: 'Stock Metric Summary Cards', desc: 'Total Items, Available in Stock, Borrowed / Checked Out, and In Maintenance.' },
      { title: 'Equipment & Nursery Catalog', desc: 'Itemized inventory with serial numbers, model names, categories, and available stock.' },
      { title: 'Borrowing Fulfillments & Check-in', desc: 'Allocate reserved equipment to approved student/faculty requests and verify returned conditions.' }
    ],
    tourSteps: [
      { element: '#tour-main-workspace', title: `1. ${U} Inventory Workspace`, desc: 'Oversee equipment, appliances, and materials available for university operations and borrowing.' },
      { element: '.grid', title: '2. Stock Metric Counters', desc: 'Check total inventory counts, units available on shelf, borrowed items, and units under repair.' },
      { element: 'input[type="text"]', title: '3. Inventory Search', desc: 'Search items by model name, description, or serial barcode number.' },
      { element: 'button', title: '4. Register New Inventory', desc: 'Add newly acquired tools, nursery plants, or equipment to the institutional database.' }
    ]
  };
};

const createAdminMaterialsPage = (unitCode = 'fgmu') => {
  const u = unitCode.toLowerCase();
  const U = unitCode.toUpperCase();

  return {
    id: `admin-${u}-materials`,
    name: 'Common Materials Library',
    route: `/admin/${u}/materials`,
    icon: '🧰',
    summary: `Standardized supplies, consumable parts, and benchmark prices for ${U} dispatches and ticket pre-assessments.`,
    sections: [
      { title: 'Standard Supplies Catalog', desc: 'List of standard parts and consumable materials used by technicians.' },
      { title: 'Benchmark Price Index', desc: 'Standard reference prices for accurate job costing and budget estimates.' },
      { title: 'Add Material & Baseline Sync', desc: 'Register new supplies with standard units of measure (pcs, meters, kg, etc.) or sync server baselines.' }
    ],
    tourSteps: [
      { element: '#tour-main-workspace', title: `1. ${U} Materials Library`, desc: 'Standardized supplies, parts specifications, and baseline prices for university maintenance.' },
      { element: 'input[type="text"]', title: '2. Material Description Search', desc: 'Search materials by item name or standard unit of measure.' },
      { element: 'table, .grid', title: '3. Standard Catalog Table', desc: 'Inspect item names, standard units (pcs, lengths, kg, etc.), and benchmark prices.' },
      { element: 'button', title: '4. Add Material & Sync', desc: 'Register new supply items or click Sync Baseline to restore institutional standards.' }
    ]
  };
};

const createAdminCollabPage = (unitCode = 'fgmu') => {
  const u = unitCode.toLowerCase();
  const U = unitCode.toUpperCase();

  return {
    id: `admin-${u}-collab`,
    name: 'Collaboration Tickets',
    route: `/admin/${u}/collab-tickets`,
    icon: '🤝',
    summary: `Coordinate complex multi-unit projects requiring synchronized support between FGMU, LEAU, and SSU.`,
    sections: [
      { title: 'Incoming vs. Outgoing Support Tabs', desc: 'Separate tickets where other units requested your help vs. tickets your unit requested assistance on.' },
      { title: 'Synchronized Implementation Dates', desc: 'Joint schedule coordination ensuring technicians from different trades arrive on site simultaneously.' },
      { title: 'Multi-Unit Status Tracking', desc: 'Inspect collaborative work milestones, technician notes, and cross-department accomplishments.' }
    ],
    tourSteps: [
      { element: '#tour-main-workspace', title: `1. Cross-Unit Collaboration Hub`, desc: 'Coordinate multi-department projects requiring joint manpower across campus.' },
      { element: '.flex, button', title: '2. Incoming & Outgoing Queues', desc: 'Switch between support tasks assigned to your unit and external assistance you have requested.' },
      { element: 'table, .grid', title: '3. Multi-Unit Project Cards', desc: 'View synchronized implementation dates, collaborating unit badges, and joint staff assignments.' }
    ]
  };
};

const createAdminArchivesPage = (unitCode = 'fgmu') => {
  const u = unitCode.toLowerCase();
  const U = unitCode.toUpperCase();

  return {
    id: `admin-${u}-archives`,
    name: 'Archives & Records',
    route: `/admin/${u}/archives`,
    icon: '🏛️',
    summary: `Historical repository of all closed, completed, and archived work orders with multi-format export capabilities.`,
    sections: [
      { title: 'Academic Year & Term Filtering', desc: 'Filter historical records by academic year, semester, or service nature.' },
      { title: 'Permanent Audit Trail', desc: 'Immutable records of completed work, client star ratings, and technician sign-offs.' },
      { title: 'Bulk Data Compliance Export', desc: 'Export archive records to CSV, Excel, or PDF for university audits and reporting.' }
    ],
    tourSteps: [
      { element: '#tour-main-workspace', title: `1. ${U} Historical Archives`, desc: 'Access archived records and historical work order data for past academic years.' },
      { element: 'select, input', title: '2. Period & Term Selectors', desc: 'Filter records by academic year, semester, or specific date ranges.' },
      { element: 'button', title: '3. Bulk Compliance Export', desc: 'Download official historical reports in PDF or spreadsheet formats for university audits.' }
    ]
  };
};

const createAdminSettingsPage = (unitCode = 'fgmu') => {
  const u = unitCode.toLowerCase();
  const U = unitCode.toUpperCase();

  return {
    id: `admin-${u}-settings`,
    name: 'Admin Settings',
    route: `/admin/${u}/settings`,
    icon: '⚙️',
    summary: `Configure unit office information, operating hours, and digital administrative signature for automated job orders.`,
    sections: [
      { title: 'Unit Office Information', desc: 'Manage department room, building location, telephone extension, and official email.' },
      { title: 'Digital Approval Signature', desc: 'Draw or upload the unit head signature applied automatically to generated job order PDFs.' },
      { title: 'Security & Notification Preferences', desc: 'Manage login credentials, password security, and automated email alert toggles.' }
    ],
    tourSteps: [
      { element: '#tour-main-workspace', title: `1. ${U} Settings`, desc: 'Configure your unit profile, physical office details, and operational preferences.' },
      { element: 'form, .card', title: '2. Office Information', desc: 'Keep department building, room number, and phone extension accurate for client communications.' },
      { element: 'button, canvas', title: '3. Digital Signature Setup', desc: 'Upload or sign your digital administrative signature for official work order documents.' }
    ]
  };
};

/**
 * ═════════════════════════════════════════════════════════════════════════
 * MASTER ROLE-BASED TUTORIAL CATALOG
 * ═════════════════════════════════════════════════════════════════════════
 */

const tutorialCatalog = {
  // ─── 1. REQUESTOR (Student & Employee Portal) ──────────────────────────
  requestor: {
    roleKey: 'requestor',
    roleLabel: 'Student & Employee Portal',
    roleIcon: '🎓',
    roleBadge: 'Requestor Access',
    roleSummary: 'Submit work orders, borrow university tools & plants, report campus security incidents, and evaluate completed services.',
    pages: [
      {
        id: 'user-dashboard',
        name: 'Dashboard',
        route: '/user/dashboard',
        icon: '🏠',
        summary: 'Your central hub for tracking quick request updates, system alerts, and fast navigation to university services.',
        sections: [
          { title: 'New Service Request CTA', desc: 'Immediate button to launch the university services catalog and file a new request.' },
          { title: 'Active Tickets Feed', desc: 'Real-time overview of your current submissions with live progress badges.' },
          { title: 'Institutional ID Verification', desc: 'Displays whether your uploaded ID card is verified or pending Superadmin review.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Welcome to Your Dashboard', desc: 'Track your submitted work orders, borrowing requests, and security incident reports.' },
          { element: 'button, a[href*="services"]', title: '2. New Service Request', desc: 'Click here anytime to submit a new facilities repair, plant borrowing, or security incident.' },
          { element: '#tour-sidebar-nav', title: '3. Sidebar Navigation', desc: 'Easily navigate between Dashboard, Services Catalog, Active Tickets, and Completed History.' },
          { element: '#tour-notifications-btn', title: '4. Alerts & Updates', desc: 'Hear instant chime notifications and inspect status changes as administrators dispatch workers.' },
          { element: '#tour-comfort-btn', title: '5. High-Contrast View', desc: 'Toggle high-contrast comfort mode anytime for enhanced screen readability.' }
        ]
      },
      {
        id: 'user-services',
        name: 'Services Catalog',
        route: '/services',
        icon: '📝',
        summary: 'Browse and submit requests for facilities maintenance (FGMU), environment care (LEAU), tool/plant borrowing, or campus security reports (SSU).',
        sections: [
          { title: 'Category Filter Tabs', desc: 'Switch between Facilities (FGMU), Environment (LEAU), and Security (SSU) services.' },
          { title: 'Search Services Input', desc: 'Find specific services like Air Conditioning, Plumbing, Plant Loans, or Lost & Found.' },
          { title: 'Interactive Request Modal', desc: 'Specify college building, floor, room number, urgency flag, and upload issue photos.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. University Services Catalog', desc: 'Browse available campus maintenance, borrowing, and security services.' },
          { element: 'input[type="text"]', title: '2. Search Services', desc: 'Type any keyword like "aircon", "plumbing", "plants", or "security" to find the right service.' },
          { element: '.grid, .service-card', title: '3. Service Cards', desc: 'Review turnaround time benchmarks, requirements, and click to open the submission form.' }
        ]
      },
      {
        id: 'user-tickets',
        name: 'My Service Requests',
        route: '/user/tickets',
        icon: '📋',
        summary: 'Track all active tickets, review assigned implementation schedules, communicate with staff, and monitor borrowing requests.',
        sections: [
          { title: 'Status Filter Tabs', desc: 'Isolate Pending Approvals, Scheduled Visits, In Progress, or Borrowing requests.' },
          { title: 'Implementation Schedules', desc: 'Review target dates when technicians will visit your site and estimated working days.' },
          { title: 'Cancel Pending Requests', desc: 'Safely withdraw a pending request if your service needs change before dispatch.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. My Service Requests', desc: 'Review live ticket status timelines, scheduled worker visits, and borrowing pickup readiness.' },
          { element: 'input[type="text"]', title: '2. Quick Search', desc: 'Search your tickets by ticket ID number, building name, or problem description.' },
          { element: '.space-y-4, .ticket-card', title: '3. Ticket Details & Timeline', desc: 'Expand any ticket card to inspect assigned personnel, scheduled implementation dates, and notes.' }
        ]
      },
      {
        id: 'user-completed',
        name: 'Completed & Ratings',
        route: '/user/completed-tickets',
        icon: '⭐',
        summary: 'Inspect finalized service work orders, download accomplishment reports, and submit client satisfaction feedback.',
        sections: [
          { title: 'Verified Accomplishments', desc: 'Inspect work completion details and photos submitted by field workers.' },
          { title: 'Client Satisfaction Rating', desc: 'Submit honest 1 to 5 star ratings to evaluate staff courtesy, timeliness, and quality.' },
          { title: 'Official Service Slips', desc: 'Download official accomplishment slips for your department or organization files.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Completed Tickets & Ratings', desc: 'Review accomplished work orders and submit your ratings for university services.' },
          { element: 'button', title: '2. Rate Service (1-5 Stars)', desc: 'Click to rate the completed service and provide constructive feedback for staff evaluation.' }
        ]
      },
      {
        id: 'user-settings',
        name: 'Account Settings',
        route: '/user/edit-profile',
        icon: '⚙️',
        summary: 'Manage your contact information, student/employee profile, password security, and email notification preferences.',
        sections: [
          { title: 'Profile Information', desc: 'Keep your department/college and contact mobile number up to date.' },
          { title: 'Email Notifications Toggle', desc: 'Opt in or out of automated transactional email alerts for ticket status changes.' },
          { title: 'Password Security', desc: 'Update your account password with strong alphanumeric verification.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Profile & Preferences', desc: 'Manage your university profile details, contact number, and notification settings.' },
          { element: 'form', title: '2. Update Information', desc: 'Ensure your college department and phone number are current so technicians can contact you.' }
        ]
      }
    ]
  },

  // ─── 2. UNIT ADMINISTRATOR (FGMU / LEAU / SSU) ──────────────────────────
  admin: {
    roleKey: 'admin',
    roleLabel: 'Unit Administrator (FGMU / LEAU / SSU)',
    roleIcon: '🛠️',
    roleBadge: 'Unit Operations',
    roleSummary: 'Oversee unit operations, manage pending tickets, dispatch skilled personnel, maintain plant/tool inventory, and review completed work orders.',
    pages: [] // Generated dynamically based on the current unit
  },

  // ─── 3. DIRECTOR (Executive Oversight) ──────────────────────────────────
  director: {
    roleKey: 'director',
    roleLabel: 'Executive Director Console',
    roleIcon: '🏛️',
    roleBadge: 'Executive Director',
    roleSummary: 'Institutional SLA analytics, multi-unit oversight (FGMU, LEAU, SSU), emergency escalations, holiday calendar, and financial material reports.',
    pages: [
      {
        id: 'director-dashboard',
        name: 'Executive Analytics',
        route: '/director/dashboard',
        icon: '📊',
        summary: 'High-level executive analytics measuring university-wide service level agreement (SLA) turnaround rates and unit throughput.',
        sections: [
          { title: 'SLA Performance Gauge', desc: 'Campus-wide turnaround percentage measured against institutional benchmarks.' },
          { title: 'Tri-Unit Queue Summary', desc: 'Consolidated view of pending reviews, active dispatches, and completions across FGMU, LEAU, and SSU.' },
          { title: 'Acting Head Delegation', desc: 'Directly assume acting administration over any unit when a department head is on leave.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Executive Director Dashboard', desc: 'Monitor institutional SLA performance, turnaround metrics, and cross-unit throughput.' },
          { element: '.grid', title: '2. Institutional SLA Gauges', desc: 'Real-time performance tracking for all university maintenance and security operations.' },
          { element: '#tour-profile-menu', title: '3. Acting Unit Head Delegation', desc: 'Assume direct management over any unit whenever a department head is absent.' }
        ]
      },
      {
        id: 'director-fgmu',
        name: 'Facilities Escalations (FGMU)',
        route: '/director/fgmu',
        icon: '🛠️',
        summary: 'Review and grant executive clearance for high-budget, structural, or escalated facilities work orders.',
        sections: [
          { title: 'Escalation Justifications', desc: 'Inspect reasons provided by the unit head for executive budget or structural endorsement.' },
          { title: 'Approve or Return', desc: 'Grant executive authorization for immediate worker dispatch, or return with directives.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Facilities Escalations Queue', desc: 'Review major campus facilities projects requiring executive authorization.' },
          { element: 'button', title: '2. Executive Authorization', desc: 'Authorize high-budget repairs or return tickets with specific budget directives.' }
        ]
      },
      {
        id: 'director-leau',
        name: 'Landscape & Plant Loans (LEAU)',
        route: '/director/leau',
        icon: '🌿',
        summary: 'Oversee campus environmental projects and authorize bulk plant loans for major university ceremonies.',
        sections: [
          { title: 'Borrowing Requests Scope', desc: 'Check requested plant quantities, event venue, and scheduled return dates.' },
          { title: 'Executive Approval', desc: 'Approve plant allocations to enable inventory reservation by LEAU nursery staff.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Landscape & Plant Authorizations', desc: 'Review large-scale plant loan requests and campus beautification projects.' },
          { element: 'button', title: '2. Authorize Plant Loans', desc: 'Approve plant allocations for official university events.' }
        ]
      },
      {
        id: 'director-ssu',
        name: 'Safety & Security Log (SSU)',
        route: '/director/ssu',
        icon: '🛡️',
        summary: 'Confidential campus security incident oversight, investigation tracking, and executive safety directives.',
        sections: [
          { title: 'Confidential Incident Log', desc: 'Review security incident reports across all campus zones.' },
          { title: 'Executive Safety Directives', desc: 'Endorse reports for university legal counsel or add administrative directives.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Security Incident Log', desc: 'Monitor campus safety reports, investigation findings, and incident severity.' },
          { element: 'button', title: '2. Executive Directives', desc: 'Issue executive instructions or endorse reports for university administrative action.' }
        ]
      },
      {
        id: 'director-holidays',
        name: 'Special Non-Working Holidays',
        route: '/director/holidays',
        icon: '📅',
        summary: 'Calibrate official non-working holidays and executive suspensions that are bypassed during ticket working duration calculations.',
        sections: [
          { title: 'Holiday Registry', desc: 'Inspect registered national, regional, and institutional non-working dates.' },
          { title: 'Register Special Holiday', desc: 'Add one-time suspensions or annual recurring holidays with official proclamation notes.' },
          { title: 'Working Duration Simulator', desc: 'Interactive verification proving that holiday dates are completely discounted from elapsed working hours.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Special Non-Working Holidays', desc: 'Configure official non-working dates automatically excluded from ticket working duration calculations.' },
          { element: 'button', title: '2. Add Special Holiday', desc: 'Register a national holiday, local suspension, or university non-working day.' },
          { element: 'table', title: '3. Holiday Calendar Registry', desc: 'Review registered holidays, recurrence rules, and active status.' }
        ]
      },
      {
        id: 'director-materials',
        name: 'Material Requisitions & Costs',
        route: '/director/materials',
        icon: '📑',
        summary: 'Multi-unit material consumption logs, budget expenditures, and official executive PDF report downloads.',
        sections: [
          { title: 'Consumption Analysis', desc: 'Audit supplies, tools, and replacement parts consumed across all university operations.' },
          { title: 'Export Official PDF', desc: 'Download formal financial and material utilization summaries for university audits.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Material Requisitions & Costs', desc: 'Audit materials consumed by all units and monitor departmental operational expenses.' },
          { element: 'button', title: '2. Export Materials PDF', desc: 'Generate and download official materials consumption PDF reports for institutional auditing.' }
        ]
      },
      {
        id: 'director-operations',
        name: 'Campus Operations Hub',
        route: '/director/operations',
        icon: '🧭',
        summary: 'Consolidated real-time operational feed of live campus maintenance work orders and field execution.',
        sections: [
          { title: 'Live Operations Stream', desc: 'Consolidated feed of active jobs, assigned staff, and timeline progress across campus.' },
          { title: 'Working Hours & Shifts', desc: 'Standard campus operating hours and break windows.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Operations Hub', desc: 'Monitor active campus maintenance operations and field services in real-time.' }
        ]
      },
      {
        id: 'director-settings',
        name: 'Director Settings',
        route: '/director/settings',
        icon: '⚙️',
        summary: 'Manage executive profile, institutional title, and digital signature for automated job order approvals.',
        sections: [
          { title: 'Executive Designation', desc: 'Official title and institutional office contact information.' },
          { title: 'Digital Approval Signature', desc: 'Executive signature automatically applied to approved work orders and clearance slips.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Director Settings', desc: 'Configure executive profile details and digital administrative signatures.' }
        ]
      }
    ]
  },

  // ─── 4. FIELD WORKER / TECHNICIAN (Responding Personnel) ─────────────────
  worker: {
    roleKey: 'worker',
    roleLabel: 'Responding Field Personnel',
    roleIcon: '👷',
    roleBadge: 'Field Staff',
    roleSummary: 'Execute field work orders, inspect problem areas, log materials and tools used, and mark tasks completed for verification.',
    pages: [
      {
        id: 'worker-dashboard',
        name: 'Daily Active Work Orders',
        route: '/personnel/dashboard',
        icon: '📲',
        summary: 'Inspect daily service tasks assigned to you, access building locations, log supplies, and complete jobs.',
        sections: [
          { title: 'Assigned Service Tasks', desc: 'Review your daily schedule, college building, floor, room number, and requester notes.' },
          { title: 'Log Materials Consumed', desc: 'Record exact spare parts and supplies used during field service.' },
          { title: 'Complete & Upload Photos', desc: 'Mark job complete and upload verified accomplishment photos.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Technician Field Console', desc: 'Manage today\'s assigned repair tasks, on-site locations, and job details.' },
          { element: '.card, .space-y-4', title: '2. Today\'s Work Orders', desc: 'Check room location, problem description, and client contact details before heading out.' },
          { element: 'button', title: '3. Log Materials & Complete', desc: 'Record supplies used on site and upload completion photos to finalize the work order.' }
        ]
      },
      {
        id: 'worker-history',
        name: 'Completed Job History',
        route: '/personnel/history',
        icon: '📜',
        summary: 'Review historical accomplishments, target completion metrics, and client satisfaction star ratings.',
        sections: [
          { title: 'Accomplishment Ledger', desc: 'Inspect past completed jobs with verified resolution timestamps.' },
          { title: 'Client Star Ratings', desc: 'Review 1 to 5 star ratings and comments submitted by clients.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Accomplishment History', desc: 'Review past completed work orders, turnaround metrics, and client satisfaction ratings.' }
        ]
      }
    ]
  },

  // ─── 5. SUPERADMINISTRATOR (System Governance) ───────────────────────────
  superadmin: {
    roleKey: 'superadmin',
    roleLabel: 'Super Administrator Console',
    roleIcon: '🛡️',
    roleBadge: 'System Governance',
    roleSummary: 'Platform security, user credential verification, RBAC permissions, audit trail governance, and disaster recovery backups.',
    pages: [
      {
        id: 'superadmin-queues',
        name: 'ID Verification Queue',
        route: '/superadmin/queues',
        icon: '🛡️',
        summary: 'Verify student and employee registration uploads against institutional records before unlocking request privileges.',
        sections: [
          { title: 'Inspect ID Document', desc: 'Examine uploaded ID card photos with zoom and rotation tools.' },
          { title: 'Credential Verification', desc: 'Check student/employee ID numbers against the institutional database.' },
          { title: 'Approve or Reject', desc: 'Approve to unlock full privileges, or reject with clear feedback for re-upload.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Identity Verification Queue', desc: 'Review uploaded student and employee credentials to safeguard university access.' },
          { element: 'input[type="text"]', title: '2. Search Registrants', desc: 'Search pending accounts by ID number, student name, or institutional email.' },
          { element: 'button', title: '3. Inspect & Verify', desc: 'Open the document viewer to examine credentials, then Approve or Reject with feedback.' }
        ]
      },
      {
        id: 'superadmin-users',
        name: 'User Accounts & RBAC',
        route: '/superadmin/users',
        icon: '👥',
        summary: 'Comprehensive user management, role assignments (Student, Employee, Admin, Director, Worker), and account security.',
        sections: [
          { title: 'Campus User Directory', desc: 'Filterable table of all registered accounts with role and status indicators.' },
          { title: 'Role Assignment (RBAC)', desc: 'Assign and update user roles while strictly enforcing access boundaries.' },
          { title: 'Account Status Control', desc: 'Activate, suspend, or reactivate accounts with permanent audit logging.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. User Governance & RBAC', desc: 'Manage university user accounts, role permissions, and account statuses.' },
          { element: 'table', title: '2. User Accounts Table', desc: 'Inspect user roles, unit affiliations, and verification statuses.' },
          { element: 'button', title: '3. Role Management', desc: 'Assign or update roles to enforce strict Role-Based Access Control.' }
        ]
      },
      {
        id: 'superadmin-audit',
        name: 'System Audit Logs',
        route: '/superadmin/audit-logs',
        icon: '📜',
        summary: 'Immutable, timestamped audit log of all system decisions, approvals, status changes, and administrative actions.',
        sections: [
          { title: 'Audit Trail Explorer', desc: 'Detailed log entries showing actor, target entity, event type, and timestamp.' },
          { title: 'Severity Filtering', desc: 'Filter by Info, Warning, Error, and Critical security events.' },
          { title: 'Compliance Export', desc: 'Download compliance audit logs for university privacy and regulatory governance.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. System Audit Logs', desc: 'Inspect immutable, timestamped records of all operational and administrative actions.' },
          { element: 'input, select', title: '2. Filter Events', desc: 'Filter logs by action type, severity, actor, or specific ticket number.' },
          { element: 'button', title: '3. Export Compliance Trail', desc: 'Export audit logs to spreadsheet or document formats for institutional compliance.' }
        ]
      },
      {
        id: 'superadmin-backup',
        name: 'Database Backup & Recovery',
        route: '/superadmin/backup',
        icon: '💾',
        summary: 'Automated and manual database snapshots, SQL dump downloads, and disaster restoration console.',
        sections: [
          { title: 'Immediate SQL Snapshot', desc: 'Create manual database snapshots before major system updates.' },
          { title: 'Download SQL Dump', desc: 'Store encrypted backups on secure off-site secondary media.' },
          { title: 'Disaster Restoration', desc: 'Restore database state safely from verified backup points.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Backup & Recovery Console', desc: 'Manage database snapshots and disaster recovery safeguards.' },
          { element: 'button', title: '2. Create Database Backup', desc: 'Trigger an immediate full SQL snapshot of the entire university database.' }
        ]
      },
      {
        id: 'superadmin-settings',
        name: 'Platform Settings',
        route: '/superadmin/settings',
        icon: '⚙️',
        summary: 'System-wide configuration, email delivery pipeline credentials, and maintenance switches.',
        sections: [
          { title: 'Email Pipeline Credentials', desc: 'Verify Resend API keys and transactional mail sender addresses.' },
          { title: 'System-Wide Switches', desc: 'Toggle global email notifications and platform maintenance modes.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Platform Configuration', desc: 'Manage email pipelines, API credentials, and global system parameters.' }
        ]
      }
    ]
  }
};

/**
 * ═════════════════════════════════════════════════════════════════════════
 * COMPOSABLE: useTutorial
 * ═════════════════════════════════════════════════════════════════════════
 */

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
   * Active role data with tailored routes and shared page builders
   */
  const activeRoleData = computed(() => {
    const roleKey = currentRole.value;

    if (roleKey === 'admin') {
      const unit = currentUnitCode.value;
      const unitLabels = {
        fgmu: { label: 'FGMU Facilities Management', icon: '🛠️' },
        leau: { label: 'LEAU Landscape & Environment', icon: '🌿' },
        ssu: { label: 'SSU Safety & Security Services', icon: '🛡️' }
      };
      const info = unitLabels[unit] || unitLabels.fgmu;

      // Build pages dynamically reusing shared generators!
      const pages = [
        createAdminDashboardPage(unit),
        createAdminQueuesPage(unit),
        createAdminDispatchPage(unit),
        createAdminDispatchedPage(unit),
        createAdminActivePage(unit),
        createAdminPersonnelPage(unit)
      ];

      // FGMU & LEAU have Inventory and Materials Library
      if (unit !== 'ssu') {
        pages.push(createAdminInventoryPage(unit));
        pages.push(createAdminMaterialsPage(unit));
      }

      pages.push(createAdminCollabPage(unit));
      pages.push(createAdminArchivesPage(unit));
      pages.push(createAdminSettingsPage(unit));

      return {
        roleKey: 'admin',
        roleLabel: info.label,
        roleIcon: info.icon,
        roleBadge: `${unit.toUpperCase()} Operations`,
        roleSummary: `Oversee ${unit.toUpperCase()} operations, evaluate tickets, dispatch skilled staff, manage stock, and review completed work orders.`,
        pages
      };
    }

    return tutorialCatalog[roleKey] || tutorialCatalog.requestor;
  });

  /**
   * Helper to normalize route paths for clean matching
   */
  const normalizeRoutePath = (path) => {
    if (!path) return '';
    return path.toLowerCase().replace(/\/$/, '');
  };

  /**
   * Active page data resolved from current route
   */
  const activePageData = computed(() => {
    const pages = activeRoleData.value.pages || [];
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
   * Open tutorial confirmation modal, automatically setting the current active page
   */
  const openTutorialModal = (targetPageId = null) => {
    const pages = activeRoleData.value.pages || [];
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
   * Launch interactive tour with Driver.js for the active page
   */
  const startPageTour = async (pageId = null) => {
    const targetId = pageId || activePageId.value;
    const page = (activeRoleData.value.pages || []).find(p => p.id === targetId) || activePageData.value;

    closeTutorialModal();

    if (!page) return;

    // If user is not on this page route, navigate first
    const currentPath = normalizeRoutePath(router.currentRoute?.value?.path || '');
    const targetRoute = normalizeRoutePath(page.route);
    if (targetRoute && currentPath !== targetRoute && !currentPath.startsWith(targetRoute)) {
      await router.push(page.route);
      await new Promise(resolve => setTimeout(resolve, 350));
    }

    const rawSteps = page.tourSteps || [
      { element: '#tour-main-workspace', title: page.name, desc: page.summary }
    ];

    // Mobile-friendly element resolution:
    // If element doesn't exist or is hidden (e.g. desktop sidebar on mobile screen),
    // fallback gracefully to #tour-main-workspace so the tour remains unbroken!
    const driverSteps = rawSteps.map(s => {
      let targetSelector = s.element || '#tour-main-workspace';
      const el = document.querySelector(targetSelector);
      if (!el || (el.offsetWidth === 0 && el.offsetHeight === 0)) {
        targetSelector = '#tour-main-workspace';
      }

      return {
        element: targetSelector,
        popover: {
          title: s.title,
          description: s.desc,
          side: s.side || 'bottom',
          align: s.align || 'center'
        }
      };
    });

    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      overlayColor: 'rgba(15, 23, 42, 0.72)',
      stagePadding: 6,
      stageRadius: 14,
      nextBtnText: 'Next →',
      prevBtnText: '← Back',
      doneBtnText: 'Finish Tutorial',
      steps: driverSteps,
      onDestroyStarted: () => {
        driverObj.destroy();
      }
    });

    driverObj.drive();
  };

  return {
    isTutorialModalOpen,
    activePageId,
    currentRole,
    currentUnitCode,
    activeRoleData,
    activePageData,
    openTutorialModal,
    closeTutorialModal,
    startPageTour
  };
}
