import { ref, computed } from 'vue';
import router from '@/router';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useAuthStore } from '@/stores/auth';

const isTutorialModalOpen = ref(false);
const activePageId = ref('');

/**
 * Universal Role-Based Page Tutorials Data
 */
const tutorialCatalog = {
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
        steps: [
          { title: '1. Check Active Updates', desc: 'Scan recent status cards to see if your requests are under review or dispatched.' },
          { title: '2. Launch New Requests', desc: 'Click "New Service Request" to open the services catalog.' },
          { title: '3. Monitor Notifications', desc: 'Hear audio alerts and check the bell icon whenever status changes.' }
        ],
        features: [
          { name: 'New Service Request Button', icon: '➕', location: 'Hero Banner', desc: 'Opens the full university services catalog to file a new repair, borrowing, or incident report.' },
          { name: 'Recent Activity Feed', icon: '📋', location: 'Main Workspace', desc: 'Lists your latest active tickets with real-time status badges and direct links to details.' },
          { name: 'View All Tickets Link', icon: '🔍', location: 'Activity Header', desc: 'Jumps directly to your full list of active tickets in My Service Requests.' },
          { name: 'Verification Notice', icon: '🛡️', location: 'Top Banner', desc: 'Shows whether your institutional ID card is verified or pending Superadmin review.' },
          { name: 'Comfort View Switch', icon: '👁️', location: 'Top Navbar', desc: 'Switches high-contrast accessible mode for enhanced readability anytime.' },
          { name: 'Notifications Bell', icon: '🔔', location: 'Top Navbar', desc: 'Displays unread notification badges and instant status updates with audio chimes.' }
        ],
        tips: [
          { icon: '💡', title: 'Quick Action', desc: 'Click any recent activity card to view the complete audit timeline of that request.' },
          { icon: '🔔', title: 'Audio Chime', desc: 'Keep your browser tab open to hear instant chime notifications when workers are assigned.' }
        ],
        tourSteps: [
          { element: '#tour-sidebar-nav', title: '1. Sidebar Navigation', desc: 'Switch quickly between Dashboard, My Tickets, Completed Tickets, and Settings.' },
          { element: '#tour-main-workspace', title: '2. Dashboard Feed', desc: 'Track live ticket status transitions and recent activity in real-time.' },
          { element: '#tour-comfort-btn', title: '3. Comfort View', desc: 'Toggle high-contrast mode for enhanced readability anytime.' },
          { element: '#tour-notifications-btn', title: '4. Alerts & Notifications', desc: 'Inspect status changes, schedule alerts, and system notices.' },
          { element: '#tour-guide-btn', title: '5. In-Website Manual', desc: 'Open this interactive page-by-page guide anytime you need assistance.' }
        ]
      },
      {
        id: 'user-services',
        name: 'Services Catalog',
        route: '/services',
        icon: '📝',
        summary: 'Browse and submit requests for facilities maintenance (FGMU), environment care (LEAU), tool/plant borrowing, or campus security reports (SSU).',
        steps: [
          { title: '1. Choose Category', desc: 'Select Facilities (FGMU), Landscape (LEAU), or Security (SSU).' },
          { title: '2. Complete Details', desc: 'Specify college building, room, issue description, and attach photos if needed.' },
          { title: '3. Submit & Track', desc: 'Submit the ticket to instantly route it to the responsible unit admin.' }
        ],
        features: [
          { name: 'Category Filter Tabs', icon: '📑', location: 'Top Filter Bar', desc: 'Filter services by operational department: Facilities, Environment, or Security.' },
          { name: 'Search Services Input', icon: '🔎', location: 'Search Bar', desc: 'Instantly find a specific service (e.g. Aircon, Electrical, Plumbing, Plant Borrowing).' },
          { name: 'Service Cards Grid', icon: '🛠️', location: 'Service Grid', desc: 'Detailed cards showing estimated turnaround times, prerequisites, and submission forms.' },
          { name: 'Request Service Button', icon: '📝', location: 'On Each Service Card', desc: 'Opens the interactive submission modal with location picker and photo upload.' },
          { name: 'Urgency Flag Selector', icon: '⚡', location: 'Submission Modal', desc: 'Mark requests with emergency priority for hazardous conditions.' },
          { name: 'Photo Upload Input', icon: '📷', location: 'Submission Modal', desc: 'Attach photos of the issue to accelerate unit review and personnel dispatch.' }
        ],
        tips: [
          { icon: '📸', title: 'Attach Photos', desc: 'Clear photos of broken equipment help administrators dispatch the right technician with matching tools.' },
          { icon: '🌿', title: 'Borrowing Requests', desc: 'Specify your pickup date and return date clearly when borrowing university tools or plants.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. University Services Catalog', desc: 'Browse available campus maintenance, borrowing, and security services.' },
          { element: '#tour-sidebar-nav', title: '2. Sidebar Navigation', desc: 'Navigate between service submission and your active requests.' }
        ]
      },
      {
        id: 'user-tickets',
        name: 'My Service Requests',
        route: '/user/tickets',
        icon: '📋',
        summary: 'Track all active tickets, review assigned implementation schedules, communicate with staff, and monitor borrowing requests.',
        steps: [
          { title: '1. Filter by Status', desc: 'Use tabs to isolate Pending, Scheduled, In Progress, or Borrowing tickets.' },
          { title: '2. Expand Ticket Details', desc: 'Click any ticket card to inspect assigned personnel, target dates, and administrative notations.' },
          { title: '3. Cancel if Necessary', desc: 'Cancel a pending ticket with an optional note if the service is no longer required.' }
        ],
        features: [
          { name: 'Status Filter Tabs', icon: '🏷️', location: 'Top Toolbar', desc: 'Filter active tickets by All, Pending Approval, Scheduled, or In Progress.' },
          { name: 'Ticket Search Input', icon: '🔍', location: 'Top Toolbar', desc: 'Search requests by ticket ID, nature of work, or building location.' },
          { name: 'Ticket Card Expand/Collapse', icon: '🔽', location: 'Each Ticket Card', desc: 'Reveals full problem descriptions, uploaded photos, and live audit timeline.' },
          { name: 'Cancel Request Button', icon: '❌', location: 'Pending Ticket Cards', desc: 'Allows you to withdraw a pending request if plans change before dispatch.' },
          { name: 'Assigned Schedule Badge', icon: '📅', location: 'Scheduled Tickets', desc: 'Displays target implementation date and estimated working days.' },
          { name: 'Borrowing Status Badge', icon: '📦', location: 'Borrowing Cards', desc: 'Displays pickup readiness and expected return date for tools and plants.' }
        ],
        tips: [
          { icon: '⏱️', title: 'Target Working Days', desc: 'Target completion dates are calculated automatically using institutional business calendars.' },
          { icon: '🏷️', title: 'Recategorized Work', desc: 'If a ticket nature of work is updated by administration, you will see a Recategorized badge.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Active Requests Queue', desc: 'Review your live service requests, status timelines, and scheduled worker visits.' }
        ]
      },
      {
        id: 'user-completed',
        name: 'Completed & Ratings',
        route: '/user/completed-tickets',
        icon: '⭐',
        summary: 'Inspect finalized service work orders, download accomplishment reports, and submit client satisfaction feedback.',
        steps: [
          { title: '1. View Accomplishment', desc: 'Inspect work completion details and photos submitted by field workers.' },
          { title: '2. Rate Service (1-5 Stars)', desc: 'Submit honest satisfaction ratings to evaluate timeliness, quality, and staff courtesy.' },
          { title: '3. Download Records', desc: 'Access completed service slips for your department or organization records.' }
        ],
        features: [
          { name: 'Rate Service Button', icon: '⭐', location: 'Unrated Completed Cards', desc: 'Opens the client satisfaction survey modal with 1 to 5 star ratings and comments.' },
          { name: 'View Accomplishment Button', icon: '📄', location: 'Ticket Card Footer', desc: 'Inspects verified field accomplishment reports and before/after service photos.' },
          { name: 'Export History Button', icon: '📥', location: 'Page Header', desc: 'Downloads a summary of your past completed tickets.' },
          { name: 'Search Completed Tickets', icon: '🔍', location: 'Search Bar', desc: 'Filter completed records by ticket ID or date range.' }
        ],
        tips: [
          { icon: '⭐', title: 'Feedback Importance', desc: 'Your satisfaction ratings directly contribute to personnel performance evaluations and service improvements.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Completed Tickets & Ratings', desc: 'Review completed work orders and submit your star ratings for campus services.' }
        ]
      },
      {
        id: 'user-settings',
        name: 'Account Settings',
        route: '/user/edit-profile',
        icon: '⚙️',
        summary: 'Manage your contact information, student/employee profile, password security, and email notification preferences.',
        steps: [
          { title: '1. Update Profile', desc: 'Ensure your college/department and contact mobile number are up to date.' },
          { title: '2. Toggle Email Alerts', desc: 'Opt in or out of automated email alerts for ticket status milestones.' },
          { title: '3. Password Security', desc: 'Change your password regularly using strong alphanumeric combinations.' }
        ],
        features: [
          { name: 'Email Updates Toggle', icon: '📧', location: 'Notifications Card', desc: 'Turns automated transactional email notifications on or off.' },
          { name: 'Save Changes Button', icon: '💾', location: 'Form Bottom', desc: 'Saves updated contact and profile information to the database.' },
          { name: 'Update Password Form', icon: '🔒', location: 'Security Section', desc: 'Safely resets your login password with current password verification.' }
        ],
        tips: [
          { icon: '🔒', title: 'Security', desc: 'Never share your university credentials. Enable email alerts to monitor your ticket actions.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Account & Preferences', desc: 'Configure your profile details, contact number, and notification preferences.' }
        ]
      }
    ]
  },

  admin: {
    roleKey: 'admin',
    roleLabel: 'Unit Administrator (FGMU / LEAU / SSU)',
    roleIcon: '🛠️',
    roleBadge: 'Unit Operations',
    roleSummary: 'Oversee unit operations, manage pending tickets, dispatch skilled personnel, maintain plant/tool inventory, and review completed work orders.',
    pages: [
      {
        id: 'admin-dashboard',
        name: 'Unit Dashboard',
        route: '/admin/fgmu',
        icon: '📊',
        summary: 'Operational dashboard tracking incoming requests, dispatched work orders, technician workloads, and inventory stock.',
        steps: [
          { title: '1. Check Throughput', desc: 'Monitor active queues, pending reviews, and emergency priority jobs.' },
          { title: '2. Action Bottlenecks', desc: 'Use quick links to dispatch awaiting tickets or approve timeline extensions.' },
          { title: '3. Monitor Staff', desc: 'Check technician availability to balance field workloads.' }
        ],
        features: [
          { name: 'KPI Metric Cards', icon: '📈', location: 'Top Row', desc: 'Instant counts for Pending Approvals, Dispatched, In Progress, and Accomplished jobs.' },
          { name: 'Quick Action Toolbar', icon: '⚡', location: 'Action Bar', desc: 'Direct shortcuts to Assign Workers, Review Queues, or Manage Stock.' },
          { name: 'Operational Activity Feed', icon: '📜', location: 'Main Workspace', desc: 'Real-time audit stream of status updates, personnel assignments, and completion notices.' },
          { name: 'Comfort View Toggle', icon: '👁️', location: 'Top Navbar', desc: 'Boosts contrast to WCAG AAA standards for long operational shifts.' },
          { name: 'Audio Chime Alerts', icon: '🔔', location: 'Top Navbar', desc: 'Real-time sound alert notifying you when a new ticket is routed to your unit.' }
        ],
        tips: [
          { icon: '⚡', title: 'Priority Dispatch', desc: 'Emergency priority tickets are highlighted in red and should be dispatched immediately.' }
        ],
        tourSteps: [
          { element: '#tour-sidebar-nav', title: '1. Unit Queues Navigation', desc: 'Access Pending Approvals, Dispatch, Scheduled Work, Active Tickets, and Inventory.' },
          { element: '#tour-main-workspace', title: '2. Operations Dashboard', desc: 'Monitor daily throughput, dispatch workers, and manage live queues.' },
          { element: '#tour-notifications-btn', title: '3. Instant Queue Alerts', desc: 'Audio chime alerts sound whenever new requests arrive.' }
        ]
      },
      {
        id: 'admin-materials',
        name: 'Common Materials Library',
        route: '/admin/fgmu/materials',
        icon: '🧰',
        summary: 'Standardized supplies, consumable parts, and benchmark prices for unit operations and ticket pre-assessments.',
        steps: [
          { title: '1. Browse Catalog', desc: 'Search and inspect standardized supplies and parts used for work orders.' },
          { title: '2. Add New Items', desc: 'Register new materials with unit of measure and benchmark price.' },
          { title: '3. Manage Active Status', desc: 'Toggle items active or inactive to control their visibility during ticket pre-assessment.' }
        ],
        features: [
          { name: 'Add Material Button', icon: '➕', location: 'Page Toolbar', desc: 'Opens dialog to register a new material or supply item.' },
          { name: 'Category Filter Pills', icon: '🏷️', location: 'Toolbar', desc: 'Filter catalog by operational category (e.g. Electrical, Plumbing, Nursery).' },
          { name: 'Benchmark Price Display', icon: '₱', location: 'Materials Table', desc: 'Reference cost for estimating budget allocations on repair jobs.' },
          { name: 'Sync Baseline Button', icon: '🔄', location: 'Page Toolbar', desc: 'Restores and syncs baseline material items from server catalog.' }
        ],
        tips: [
          { icon: '💡', title: 'Pre-Assessment Linking', desc: 'Active items in this library automatically appear in ticket dispatch and worker job order dropdowns.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Common Materials Library', desc: 'Manage standardized unit supplies, benchmark prices, and material categories.' }
        ]
      },
      {
        id: 'admin-queues',
        name: 'Pending Approvals',
        route: '/admin/fgmu/queues',
        icon: '📥',
        summary: 'Inspect submitted tickets, verify problem descriptions & photos, and decide on approval, decline, delay, or escalation.',
        steps: [
          { title: '1. Inspect Details', desc: 'Examine location, problem description, and uploaded photos.' },
          { title: '2. Check Jurisdiction', desc: 'If work belongs to another unit, click Recategorize to re-route.' },
          { title: '3. Approve or Escalate', desc: 'Approve for worker dispatch, or escalate to Director for high-impact jobs.' }
        ],
        features: [
          { name: 'Approve Ticket Button', icon: '✅', location: 'Ticket Card Action Bar', desc: 'Approves request and sends it straight into the worker dispatch queue.' },
          { name: 'Decline Ticket Button', icon: '❌', location: 'Ticket Card Action Bar', desc: 'Rejects invalid or out-of-scope requests with an explanatory justification.' },
          { name: 'Delay Review Button', icon: '⏸️', location: 'Ticket Card Action Bar', desc: 'Puts ticket on hold for administrative inquiry or site inspection.' },
          { name: 'Recategorize Work Button', icon: '🔄', location: 'Ticket Card Action Bar', desc: 'Updates nature of work and automatically transfers ticket to another unit if needed.' },
          { name: 'Escalate to Director Button', icon: '🏛️', location: 'Ticket Card Action Bar', desc: 'Endorses high-budget or emergency tickets to the Director for executive approval.' }
        ],
        tips: [
          { icon: '🏛️', title: 'Executive Escalation', desc: 'Use Escalate to Director for projects requiring significant procurement or executive policy clearance.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Pending Approvals Queue', desc: 'Inspect submitted tickets and take administrative actions: Approve, Decline, Delay, or Escalate.' }
        ]
      },
      {
        id: 'admin-dispatch',
        name: 'Ticket Dispatch',
        route: '/admin/fgmu/assign-workers',
        icon: '👷',
        summary: 'Assign skilled technicians to approved tickets, designate working days, and schedule target implementation dates.',
        steps: [
          { title: '1. Select Personnel', desc: 'Pick qualified technicians based on trade and availability.' },
          { title: '2. Set Implementation Date', desc: 'Pick the scheduled calendar date when work starts on site.' },
          { title: '3. Confirm Dispatch', desc: 'Finalize assignment to generate schedule deadlines and alert workers.' }
        ],
        features: [
          { name: 'Assign Worker Modal', icon: '👥', location: 'Ticket Card', desc: 'Choose primary technician and supporting team members based on specialization.' },
          { name: 'Implementation Date Picker', icon: '📅', location: 'Dispatch Form', desc: 'Sets the scheduled date for field personnel visit.' },
          { name: 'Target Working Days Selector', icon: '⏱️', location: 'Dispatch Form', desc: 'Automatically calculates completion deadline using the university work calendar.' },
          { name: 'Confirm Dispatch Button', icon: '🚀', location: 'Dispatch Form Footer', desc: 'Dispatches work order, alerting the assigned technician and requestor.' }
        ],
        tips: [
          { icon: '📅', title: 'Work Calendar', desc: 'Working day deadlines automatically skip weekends and official university holidays.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Worker Dispatch Workspace', desc: 'Assign staff, set implementation dates, and launch work orders.' }
        ]
      },
      {
        id: 'admin-dispatched',
        name: 'Scheduled Work Orders',
        route: '/admin/fgmu/dispatched',
        icon: '📅',
        summary: 'Manage scheduled jobs, print official University Job Order slips, or reschedule implementation dates.',
        steps: [
          { title: '1. Print Slips', desc: 'Print physical Job Order slips for field workers before they head out.' },
          { title: '2. Monitor Timelines', desc: 'Ensure technicians report to work sites on the designated implementation date.' },
          { title: '3. Reschedule if Needed', desc: 'Adjust dates if weather or campus events prevent scheduled access.' }
        ],
        features: [
          { name: 'Print Job Order Button', icon: '🖨️', location: 'Card Actions', desc: 'Generates official PDF job orders with technician names, location, and approval signatures.' },
          { name: 'Reschedule Ticket Button', icon: '🔄', location: 'Card Actions', desc: 'Adjusts implementation date and recalculated completion deadline with requestor notice.' },
          { name: 'Reassign Worker Button', icon: '👤', location: 'Card Actions', desc: 'Replaces personnel if assigned technician is on leave or preempted by emergency.' },
          { name: 'Ready for Pickup Button', icon: '📦', location: 'Borrowing Cards', desc: 'Notifies borrowers that requested items are prepared at the unit office.' }
        ],
        tips: [
          { icon: '🖨️', title: 'Physical Job Orders', desc: 'Field technicians carry the printed job order for client acknowledgment upon arrival.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Scheduled Work Orders', desc: 'Print job orders, reschedule dates, and manage field execution.' }
        ]
      },
      {
        id: 'admin-active',
        name: 'Active Dispatches',
        route: '/admin/fgmu/active-tickets',
        icon: '⚡',
        summary: 'Monitor ongoing field service, approve timeline extensions, liquidate materials consumed, and mark jobs accomplished.',
        steps: [
          { title: '1. Track Progress', desc: 'Follow active jobs as technicians perform maintenance on site.' },
          { title: '2. Liquidate Materials', desc: 'Enter exact spare parts and inventory items consumed.' },
          { title: '3. Verify & Accomplish', desc: 'Upload verified accomplishment photos and mark work complete.' }
        ],
        features: [
          { name: 'Timeline Extension Button', icon: '⏱️', location: 'Card Actions', desc: 'Grants justifiable additional working days due to weather or supply constraints.' },
          { name: 'Liquidate Materials Button', icon: '🔩', location: 'Card Actions', desc: 'Records parts, supplies, and tools consumed from university inventory.' },
          { name: 'Mark as Accomplished Button', icon: '🏁', location: 'Card Actions', desc: 'Uploads verified field accomplishment report to initiate closure.' },
          { name: 'Record Item Return Button', icon: '📥', location: 'Borrowing Cards', desc: 'Inspects return condition of borrowed items and completes the loan.' }
        ],
        tips: [
          { icon: '📝', title: 'Material Tracking', desc: 'Logging materials accurately ensures automatic inventory stock deductions.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Active Jobs Management', desc: 'Approve extensions, log materials, and finalize work orders.' }
        ]
      },
      {
        id: 'admin-personnel',
        name: 'Personnel Roster',
        route: '/admin/fgmu/personnel',
        icon: '👥',
        summary: 'Manage unit technician roster, trade specializations, contact numbers, and duty availability status.',
        steps: [
          { title: '1. Review Availability', desc: 'Check who is available, on duty, or on leave.' },
          { title: '2. Manage Leave', desc: 'Setting a technician on leave provides an automatic prompt to reassign their active jobs.' },
          { title: '3. Add New Personnel', desc: 'Register new staff with contact details and skills.' }
        ],
        features: [
          { name: 'Add Worker Button', icon: '➕', location: 'Page Header', desc: 'Register new field personnel with assigned trade (e.g. Electrician, Plumber, Gardener).' },
          { name: 'Status Selector Dropdown', icon: '🔄', location: 'Worker Card', desc: 'Set staff status to Available, Working, or On Leave (auto-reassigns active tasks).' },
          { name: 'Worker Workload Badges', icon: '📊', location: 'Worker Card', desc: 'Real-time view of active tickets per technician to prevent dispatch bottlenecks.' }
        ],
        tips: [
          { icon: '🏖️', title: 'Leave Management', desc: 'Marking a technician On Leave automatically notifies requestors if dates are extended or tasks reassigned.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Personnel Management', desc: 'Manage your unit roster, staff specializations, and duty availability.' }
        ]
      },
      {
        id: 'admin-inventory',
        name: 'Inventory Management',
        route: '/admin/fgmu/inventory',
        icon: '📦',
        summary: 'Manage tool stocks & equipment (FGMU) or plant nursery species & garden supplies (LEAU).',
        steps: [
          { title: '1. Check Stock Levels', desc: 'Monitor available versus borrowed equipment and supplies.' },
          { title: '2. Add New Items', desc: 'Register incoming inventory or new botanical plants.' },
          { title: '3. Track Loans', desc: 'Verify borrower contact details and return dates.' }
        ],
        features: [
          { name: 'Add Inventory Item Button', icon: '➕', location: 'Page Header', desc: 'Register new tools, spare parts, or botanical varieties into stock.' },
          { name: 'Adjust Stock Quantity', icon: '🔢', location: 'Item Row', desc: 'Update available counts, log damaged items, and record acquisitions.' },
          { name: 'Active Borrowings Tab', icon: '📋', location: 'Top Tabs', desc: 'Track tools or plants currently on loan with borrower details and return due dates.' }
        ],
        tips: [
          { icon: '🌿', title: 'Borrowing Sync', desc: 'Approved borrowing requests automatically reserve items from available inventory.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Inventory & Supplies', desc: 'Maintain tools, equipment, plant nursery stock, and active campus loans.' }
        ]
      },
      {
        id: 'admin-archives',
        name: 'Unit Archives',
        route: '/admin/fgmu/archives',
        icon: '🗄️',
        summary: 'Historical records repository of completed and closed tickets with exportable compliance summaries.',
        steps: [
          { title: '1. Filter Records', desc: 'Search by date, requester, or nature of work.' },
          { title: '2. Review Ratings', desc: 'Inspect client satisfaction scores and accomplishment reports.' },
          { title: '3. Export Compliance PDF', desc: 'Generate printable summaries for university administration.' }
        ],
        features: [
          { name: 'Search & Year Filters', icon: '🔍', location: 'Top Filter Bar', desc: 'Filter completed records by academic term, requester, or building location.' },
          { name: 'Export Archival PDF Button', icon: '📄', location: 'Page Header', desc: 'Generates formal PDF summary reports for administrative compliance.' },
          { name: 'Satisfaction Review Viewer', icon: '⭐', location: 'Ticket Card', desc: 'Inspect requester ratings (1-5 stars) and feedback comments on archived tickets.' }
        ],
        tips: [
          { icon: '📁', title: 'Audit Ready', desc: 'All completed tickets retain full digital signatures, timestamps, and accomplishment logs.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Unit Archives', desc: 'Search past completed records, view client feedback, and export reports.' }
        ]
      }
    ]
  },

  director: {
    roleKey: 'director',
    roleLabel: 'GSO Executive Director Portal',
    roleIcon: '🏛️',
    roleBadge: 'Executive Leadership',
    roleSummary: 'Executive leadership oversight across all University General Services, policy approvals, high-level reporting, and operational delegation.',
    pages: [
      {
        id: 'director-dashboard',
        name: 'Executive Overview',
        route: '/director/dashboard',
        icon: '📊',
        summary: 'High-level campus SLA metrics, cross-unit overview, and operational throughput monitoring.',
        steps: [
          { title: '1. Monitor SLA Rates', desc: 'Track campus-wide ticket turnaround and department resolution velocity.' },
          { title: '2. Inspect Sub-Units', desc: 'Review active queues across FGMU, LEAU, and SSU.' },
          { title: '3. Delegation Actions', desc: 'Assume Acting Unit Head mode if a department head is absent.' }
        ],
        features: [
          { name: 'SLA Performance Gauge', icon: '📈', location: 'Top Analytics', desc: 'University-wide turnaround rate measured against target institutional benchmarks.' },
          { name: 'Unit Queue Summaries', icon: '🏢', location: 'Overview Grid', desc: 'Pending approvals, active jobs, and emergency priorities across FGMU, LEAU, and SSU.' },
          { name: 'Acting Unit Head Switcher', icon: '🔄', location: 'Profile Menu', desc: 'Temporarily assume direct unit administration when a unit head is on leave.' },
          { name: 'Emergency Alerts Bar', icon: '🚨', location: 'Top Banner', desc: 'Instant visibility of hazardous repairs and high-priority dispatches.' }
        ],
        tips: [
          { icon: '🔄', title: 'Acting Head Mode', desc: 'Switch seamlessly to run any specific unit without logging out of your Director account.' }
        ],
        tourSteps: [
          { element: '#tour-sidebar-nav', title: '1. Executive Navigation', desc: 'Access unit queues, material reports, operations hub, and archives.' },
          { element: '#tour-main-workspace', title: '2. Executive Analytics', desc: 'Review campus-wide SLA metrics and cross-unit operational performance.' },
          { element: '#tour-profile-menu', title: '3. Acting Head Delegation', desc: 'Assume direct management over any unit whenever a head is on leave.' }
        ]
      },
      {
        id: 'director-holidays',
        name: 'Special Non-Working Holidays',
        route: '/director/holidays',
        icon: '📅',
        summary: 'Calibrate official non-working holidays and executive suspensions that are bypassed during ticket turnaround and SLA calculations.',
        steps: [
          { title: '1. Review Holiday Calendar', desc: 'Inspect registered national, regional, and institutional non-working dates.' },
          { title: '2. Register Special Holidays', desc: 'Add one-time suspensions or annual recurring holidays with official proclamation notes.' },
          { title: '3. Verify SLA Computation', desc: 'Use the live SLA duration calculator simulator to verify that working hours discount holidays.' }
        ],
        features: [
          { name: 'Add Special Holiday Button', icon: '➕', location: 'Action Toolbar', desc: 'Register a new institutional non-working holiday or emergency suspension.' },
          { name: 'Recurrence Configuration', icon: '🔁', location: 'Holiday Modal', desc: 'Designate holidays as annual recurring or specific one-time dates.' },
          { name: 'SLA Duration Verification Tool', icon: '⏱️', location: 'Bottom Panel', desc: 'Interactive simulator proving that holiday dates are completely excluded from turnaround hours.' },
          { name: 'Classification Badges', icon: '🏷️', location: 'Table Column', desc: 'Distinguishes Special Non-Working, Regular, Local Suspension, and Institutional days.' }
        ],
        tips: [
          { icon: '⚖️', title: 'EODB 3-7-20 Compliance', desc: 'All active holidays configured here are legally deducted from ticket processing days under RA 11032.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Special Non-Working Holidays', desc: 'Configure official non-working days excluded from ticket SLA timers.' }
        ]
      },
      {
        id: 'director-fgmu',
        name: 'FGMU Facilities Queue',
        route: '/director/fgmu',
        icon: '🛠️',
        summary: 'Review high-budget, structural, or escalated facilities requests requiring executive endorsement.',
        steps: [
          { title: '1. Inspect Justification', desc: 'Review why the unit head escalated the ticket for executive approval.' },
          { title: '2. Approve or Return', desc: 'Grant executive authorization, or return to unit head with directives.' }
        ],
        features: [
          { name: 'Approve Escalation Button', icon: '✅', location: 'Ticket Card', desc: 'Executive clearance for facilities work orders, queuing them for immediate dispatch.' },
          { name: 'Return to Unit Head Button', icon: '↩️', location: 'Ticket Card', desc: 'Send ticket back with specific executive directives or budget guidelines.' }
        ],
        tips: [
          { icon: '🏛️', title: 'Executive Oversight', desc: 'Approved escalated tickets notify the unit admin immediately for priority technician dispatch.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Facilities Escalations Queue', desc: 'Review and approve structural repairs and major campus facilities projects.' }
        ]
      },
      {
        id: 'director-leau',
        name: 'LEAU Landscape Queue',
        route: '/director/leau',
        icon: '🌿',
        summary: 'Oversee campus beautification and bulk plant borrowing authorizations for major university events.',
        steps: [
          { title: '1. Review Borrowing Scope', desc: 'Check quantity of plants, event venue, and scheduled return dates.' },
          { title: '2. Authorize Request', desc: 'Approve plant allocations to enable inventory reservation.' }
        ],
        features: [
          { name: 'Authorize Borrowing Button', icon: '🌿', location: 'Borrowing Card', desc: 'Executive sign-off for large-scale university plant loans and campus events.' },
          { name: 'Landscape Projects Review', icon: '🌳', location: 'Ticket Card', desc: 'Clearance for tree trimming, grounds maintenance, and nursery projects.' }
        ],
        tips: [
          { icon: '🌱', title: 'Event Borrowings', desc: 'Borrowing authorizations immediately alert LEAU nursery staff to prepare plant pots.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Landscape & Borrowing Authorizations', desc: 'Review and clear environmental projects and plant loans.' }
        ]
      },
      {
        id: 'director-ssu',
        name: 'SSU Security Incidents',
        route: '/director/ssu',
        icon: '🛡️',
        summary: 'Confidential incident log oversight across all campus sectors and investigation monitoring.',
        steps: [
          { title: '1. Monitor Incidents', desc: 'Inspect active security reports and safety recommendations.' },
          { title: '2. Direct Actions', desc: 'Add executive notations or endorse reports for university legal review.' }
        ],
        features: [
          { name: 'Incident Log Review', icon: '📋', location: 'Incident Cards', desc: 'Confidential security reports, incident severity, and responder notations.' },
          { name: 'Executive Security Note', icon: '✍️', location: 'Incident Actions', desc: 'Add administrative instructions to active incident records.' }
        ],
        tips: [
          { icon: '🔐', title: 'Confidentiality', desc: 'Security incident reports are protected with strict access control.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Security Incident Log', desc: 'Monitor campus safety reports, ongoing investigations, and executive notations.' }
        ]
      },
      {
        id: 'director-materials',
        name: 'Material Reports & Costs',
        route: '/director/materials',
        icon: '📑',
        summary: 'Multi-unit material consumption and financial expenditures across all university operations.',
        steps: [
          { title: '1. Analyze Expenditures', desc: 'Inspect supplies and replacement parts used by each unit.' },
          { title: '2. Export Financial PDF', desc: 'Download official executive summaries for university audits.' }
        ],
        features: [
          { name: 'Material Requisition Table', icon: '📊', location: 'Main Table', desc: 'Itemized inventory consumed across all units with unit costs and totals.' },
          { name: 'Export Executive PDF', icon: '📥', location: 'Page Header', desc: 'Generates formal financial and material utilization summaries.' }
        ],
        tips: [
          { icon: '📑', title: 'Audit Proof', desc: 'All material entries trace directly to authenticated worker job orders.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Materials & Cost Tracking', desc: 'Audit supplies consumed and export official expenditure reports.' }
        ]
      },
      {
        id: 'director-operations',
        name: 'Operations Hub',
        route: '/director/operations',
        icon: '🧭',
        summary: 'Real-time live operations feed across all campus facilities and field services.',
        steps: [
          { title: '1. Real-Time Tracking', desc: 'View current work orders undergoing active field execution.' }
        ],
        features: [
          { name: 'Live Operations Feed', icon: '📡', location: 'Central Hub', desc: 'Consolidated view of active work orders, assigned personnel, and timeline progress.' }
        ],
        tips: [
          { icon: '📡', title: 'Live Updates', desc: 'Status badges update in real-time as workers mark progress.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Campus Operations Hub', desc: 'Monitor live campus maintenance activity in real-time.' }
        ]
      }
    ]
  },

  worker: {
    roleKey: 'worker',
    roleLabel: 'Responding Field Personnel',
    roleIcon: '👷',
    roleBadge: 'Field Staff',
    roleSummary: 'Execute field work orders, inspect problem areas, log materials and tools used, and mark tasks completed for verification.',
    pages: [
      {
        id: 'worker-dashboard',
        name: 'Active Work Orders',
        route: '/personnel/dashboard',
        icon: '📲',
        summary: 'Inspect daily service tasks assigned to you, access building locations, log supplies, and complete jobs.',
        steps: [
          { title: '1. Check Assigned Tasks', desc: 'Review your daily schedule, college building, and room location.' },
          { title: '2. Perform Service', desc: 'Perform repairs on site. Log materials used if spare parts were needed.' },
          { title: '3. Complete Work Order', desc: 'Mark job complete and upload verified accomplishment photos.' }
        ],
        features: [
          { name: 'Today\'s Work Orders Card', icon: '📋', location: 'Top Section', desc: 'Immediate access to today\'s active assignments and contact details.' },
          { name: 'Location & Room Details', icon: '📍', location: 'Task Card', desc: 'Exact campus building, floor, room number, and requester notes.' },
          { name: 'Log Supplies / Materials', icon: '🔩', location: 'Task Actions', desc: 'Record items and materials used during service execution.' },
          { name: 'Request Timeline Extension', icon: '⏱️', location: 'Task Actions', desc: 'Submit request for additional days if unforeseen repairs arise.' },
          { name: 'Complete Work Order Button', icon: '✅', location: 'Task Actions', desc: 'Mark work finished and upload accomplishment photos.' }
        ],
        tips: [
          { icon: '📍', title: 'Verify Location', desc: 'Always double-check room numbers and requester notes before heading out.' },
          { icon: '📷', title: 'Photos', desc: 'Take a photo of the completed repair to ensure swift verification and sign-off.' }
        ],
        tourSteps: [
          { element: '#tour-sidebar-nav', title: '1. Worker Navigation', desc: 'Access your active jobs, completed history, and settings.' },
          { element: '#tour-main-workspace', title: '2. Active Work Orders', desc: 'Review task details, log supplies, and mark work completed.' }
        ]
      },
      {
        id: 'worker-history',
        name: 'Completed Job History',
        route: '/personnel/history',
        icon: '📜',
        summary: 'Review historical accomplishments, target completion metrics, and client satisfaction star ratings.',
        steps: [
          { title: '1. Review History', desc: 'Inspect past completed jobs and client ratings.' },
          { title: '2. Monitor Scores', desc: 'Check satisfaction scores (1-5 stars) to evaluate service quality.' }
        ],
        features: [
          { name: 'Completed Job Cards', icon: '📜', location: 'Main List', desc: 'Search and inspect past tasks you have resolved.' },
          { name: 'Client Star Rating & Feedback', icon: '⭐', location: 'Job Card', desc: 'View 1 to 5 star ratings and comments submitted by clients.' },
          { name: 'Date Range Filter', icon: '📅', location: 'Filter Bar', desc: 'Filter past records by month or service category.' }
        ],
        tips: [
          { icon: '⭐', title: 'Performance', desc: 'High star ratings reflect timely completion and professional on-site courtesy.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Completed Jobs History', desc: 'Review past performance and client satisfaction ratings.' }
        ]
      }
    ]
  },

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
        steps: [
          { title: '1. Inspect ID Document', desc: 'Examine uploaded ID card photo for clarity and valid enrollment.' },
          { title: '2. Verify Credentials', desc: 'Check student/employee ID number against university registry.' },
          { title: '3. Approve or Reject', desc: 'Approve to unlock privileges, or reject with clear feedback for re-upload.' }
        ],
        features: [
          { name: 'Document Viewer Modal', icon: '🔍', location: 'Queue Row', desc: 'Enlarge uploaded institutional ID photos with zoom and rotation.' },
          { name: 'Approve Identity Button', icon: '✅', location: 'Row Actions', desc: 'Confirms identity and unlocks full service request submission privileges.' },
          { name: 'Reject Verification Button', icon: '❌', location: 'Row Actions', desc: 'Denies invalid or blurry documents with feedback requesting re-upload.' },
          { name: 'Search Queue Input', icon: '🔎', location: 'Top Toolbar', desc: 'Instantly search pending registrants by ID number or name.' }
        ],
        tips: [
          { icon: '🛡️', title: 'Identity Security', desc: 'Verification safeguards university services from fraudulent submissions.' }
        ],
        tourSteps: [
          { element: '#tour-sidebar-nav', title: '1. Superadmin Navigation', desc: 'Access Verification Queue, User Accounts, Audit Logs, and Backup.' },
          { element: '#tour-main-workspace', title: '2. Identity Verification Queue', desc: 'Review uploaded credentials and approve valid university accounts.' }
        ]
      },
      {
        id: 'superadmin-users',
        name: 'User Accounts & RBAC',
        route: '/superadmin/users',
        icon: '👥',
        summary: 'Comprehensive user management, role assignments (Student, Employee, Admin, Director, Worker), and account security.',
        steps: [
          { title: '1. Find User', desc: 'Search user by name, email, or institutional ID.' },
          { title: '2. Assign RBAC Roles', desc: 'Configure permissions and assign unit boundaries.' },
          { title: '3. Status Control', desc: 'Activate, suspend, or reset credentials safely.' }
        ],
        features: [
          { name: 'User Directory Table', icon: '📋', location: 'Main Table', desc: 'View all registered university accounts with role and status indicators.' },
          { name: 'Role Assignment Dropdown', icon: '🏷️', location: 'User Row', desc: 'Assign or update roles while enforcing strict RBAC boundaries.' },
          { name: 'Account Status Toggle', icon: '🔄', location: 'User Row', desc: 'Activate, suspend, or reactivate accounts with full audit logging.' }
        ],
        tips: [
          { icon: '👥', title: 'RBAC Boundaries', desc: 'Only assign administrative or worker roles to authorized department personnel.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. User Governance & RBAC', desc: 'Manage university accounts, assign roles, and enforce security policies.' }
        ]
      },
      {
        id: 'superadmin-audit',
        name: 'System Audit Logs',
        route: '/superadmin/audit-logs',
        icon: '📜',
        summary: 'Immutable, timestamped audit log of all system decisions, approvals, status changes, and administrative actions.',
        steps: [
          { title: '1. Filter Events', desc: 'Filter by severity (Info, Warning, Error) or search specific ticket IDs.' },
          { title: '2. Export Trail', desc: 'Download compliance audit logs for institutional records.' }
        ],
        features: [
          { name: 'Audit Timeline Table', icon: '📋', location: 'Main Table', desc: 'Detailed log entries showing actor, target entity, event type, and timestamp.' },
          { name: 'Severity Filter Tabs', icon: '🏷️', location: 'Top Toolbar', desc: 'Filter by Info, Warning, Error, and Critical security events.' },
          { name: 'Export Audit Trail Button', icon: '📥', location: 'Page Header', desc: 'Download compliance records for university audit review.' }
        ],
        tips: [
          { icon: '📜', title: 'Audit Compliance', desc: 'All audit events are permanently recorded to satisfy RA 10173 data privacy governance.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Audit Trail Explorer', desc: 'Inspect timestamped records of every operational and administrative action.' }
        ]
      },
      {
        id: 'superadmin-backup',
        name: 'Backup & Recovery',
        route: '/superadmin/backup',
        icon: '💾',
        summary: 'Automated and manual database snapshots, SQL dump downloads, and disaster restoration console.',
        steps: [
          { title: '1. Generate Backup', desc: 'Create manual database snapshots before major system changes.' },
          { title: '2. Download SQL Dump', desc: 'Store encrypted backups on secure secondary media.' }
        ],
        features: [
          { name: 'Create Database Backup Button', icon: '💾', location: 'Page Header', desc: 'Triggers an immediate full SQL snapshot of the database.' },
          { name: 'Download SQL Dump Button', icon: '⬇️', location: 'Backup Card', desc: 'Safely download backup files to secure local or offsite storage.' },
          { name: 'Restore Database Console', icon: '🔄', location: 'Recovery Card', desc: 'Emergency recovery tool to restore database state from a backup point.' }
        ],
        tips: [
          { icon: '💾', title: 'Disaster Recovery', desc: 'Always test backup integrity before executing structural database updates.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Backup & Recovery Console', desc: 'Create snapshots and manage database disaster recovery points.' }
        ]
      },
      {
        id: 'superadmin-settings',
        name: 'Platform Settings',
        route: '/superadmin/settings',
        icon: '⚙️',
        summary: 'System-wide configuration, email delivery pipeline credentials, and maintenance switches.',
        steps: [
          { title: '1. Verify Mail Delivery', desc: 'Ensure Resend API keys and sender addresses are valid.' },
          { title: '2. Configure System', desc: 'Manage global notification switches and platform parameters.' }
        ],
        features: [
          { name: 'Resend API Key Form', icon: '🔑', location: 'Email Card', desc: 'Configure transactional email delivery credentials.' },
          { name: 'Email Notification Master Switch', icon: '✉️', location: 'Email Card', desc: 'Toggle global email dispatch across the entire university platform.' }
        ],
        tips: [
          { icon: '🔑', title: 'API Key Security', desc: 'Keep mail delivery keys confidential to prevent unauthorized outbound emails.' }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Platform Configuration', desc: 'Configure university mail pipelines and global system preferences.' }
        ]
      }
    ]
  }
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
   * Unit code if admin (FGMU, LEAU, SSU)
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
   * Active role data with unit customized routes if admin
   */
  const activeRoleData = computed(() => {
    const roleKey = currentRole.value;
    const base = tutorialCatalog[roleKey] || tutorialCatalog.requestor;

    // If unit admin, tailor the routes and labels for their specific unit
    if (roleKey === 'admin') {
      const unit = currentUnitCode.value;
      const unitLabels = {
        fgmu: { label: 'FGMU Facilities Management Admin', icon: '🛠️' },
        leau: { label: 'LEAU Landscape & Environment Admin', icon: '🌿' },
        ssu: { label: 'SSU Safety & Security Admin', icon: '🛡️' }
      };
      const info = unitLabels[unit] || unitLabels.fgmu;
      
      const tailoredPages = base.pages.map(page => {
        let route = page.route;
        // Dynamically replace /fgmu/ with current unit
        if (route.includes('/admin/fgmu')) {
          route = route.replace('/admin/fgmu', `/admin/${unit}`);
        }
        return {
          ...page,
          route
        };
      });

      return {
        ...base,
        roleLabel: info.label,
        roleIcon: info.icon,
        pages: tailoredPages
      };
    }

    return base;
  });

  /**
   * Currently selected page inside the tutorial
   */
  const activePageData = computed(() => {
    const pages = activeRoleData.value.pages || [];
    if (!activePageId.value) {
      return pages[0] || null;
    }
    const found = pages.find(p => p.id === activePageId.value);
    return found || pages[0] || null;
  });

  const normalizeRoutePath = (path) => {
    if (!path) return '';
    return path.replace(/\/admin\/(leau|ssu)\b/, '/admin/fgmu');
  };

  /**
   * Determine if the user is currently looking at a specific page route
   */
  const isCurrentRoute = (pageRoute) => {
    const currentPath = router.currentRoute?.value?.path || '';
    if (!pageRoute) return false;
    const normCurrent = normalizeRoutePath(currentPath);
    const normPage = normalizeRoutePath(pageRoute);
    return normCurrent === normPage || normCurrent.startsWith(normPage + '/');
  };

  /**
   * Open tutorial confirmation modal, auto-detecting the page based on the current route
   */
  const openTutorialModal = (targetPageId = null) => {
    const pages = activeRoleData.value.pages || [];
    const currentPath = router.currentRoute?.value?.path || '';
    const normCurrent = normalizeRoutePath(currentPath);

    if (targetPageId) {
      activePageId.value = targetPageId;
    } else {
      // Find page that matches current route
      const matched = pages.find(p => {
        const normPage = normalizeRoutePath(p.route);
        return normCurrent === normPage || normCurrent.startsWith(normPage + '/');
      });
      activePageId.value = matched ? matched.id : (pages[0]?.id || '');
    }

    isTutorialModalOpen.value = true;
  };

  const closeTutorialModal = () => {
    isTutorialModalOpen.value = false;
  };

  const selectPage = (pageId) => {
    activePageId.value = pageId;
  };

  /**
   * Navigate directly to a page in the app
   */
  const navigateToPage = (routePath) => {
    closeTutorialModal();
    if (routePath && router.currentRoute?.value?.path !== routePath) {
      router.push(routePath);
    }
  };

  /**
   * Launch interactive tour with Driver.js for the active page
   */
  const startPageTour = async (pageId = null) => {
    const targetId = pageId || activePageId.value;
    const page = (activeRoleData.value.pages || []).find(p => p.id === targetId) || activePageData.value;

    closeTutorialModal();

    if (!page) return;

    // If user is not on this page, navigate first
    const currentPath = router.currentRoute?.value?.path || '';
    if (page.route && currentPath !== page.route) {
      await router.push(page.route);
      // Brief pause to allow the view to mount in the DOM
      await new Promise(resolve => setTimeout(resolve, 350));
    }

    const rawSteps = page.tourSteps || [
      { element: '#tour-main-workspace', title: page.name, desc: page.summary }
    ];

    // Filter steps whose target element exists in the DOM
    const validSteps = rawSteps.filter(s => {
      if (!s.element) return true;
      const el = document.querySelector(s.element);
      return el !== null;
    });

    const finalSteps = validSteps.length > 0 ? validSteps : [
      {
        element: '#tour-main-workspace',
        popover: {
          title: page.name,
          description: page.summary,
          side: 'bottom',
          align: 'center'
        }
      }
    ];

    const driverSteps = finalSteps.map(s => {
      if (s.popover) return s;
      return {
        element: s.element,
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
      doneBtnText: 'Finish Tour',
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
    isCurrentRoute,
    openTutorialModal,
    closeTutorialModal,
    selectPage,
    navigateToPage,
    startPageTour
  };
}
