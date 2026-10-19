/**
 * ═══════════════════════════════════════════════════════════════════════════════════
 * GSO E-TICKETING SYSTEM — COMPREHENSIVE OPERATIONAL PAGE GUIDES CATALOG
 * Based on GSO_E_TICKETING_USER_MANUAL.md
 * Benguet State University - General Services Office (GSO)
 * ═══════════════════════════════════════════════════════════════════════════════════
 */

// ─── HELPER BUILDERS FOR UNIT ADMIN PAGES (FGMU, LEAU, SSU) ─────────────────────────

export const createUnitAdminDashboardGuide = (unitCode = 'fgmu') => {
  const u = unitCode.toLowerCase();
  const U = unitCode.toUpperCase();
  const isSsu = u === 'ssu';
  const isLeau = u === 'leau';
  const unitName = isSsu
    ? 'Safety & Security Services Unit'
    : isLeau
    ? 'Landscaping & Environmental Aesthetics Unit'
    : 'Facilities & Grounds Management Unit';

  return {
    id: `admin-${u}-dashboard`,
    name: `${U} Operations Dashboard`,
    route: `/admin/${u}`,
    icon: '📊',
    manualSection: `Section ${U === 'FGMU' ? 'C1' : U === 'LEAU' ? 'D1' : 'E1'}: ${U} Dashboard`,
    roleBadge: `${U} Unit Head`,
    summary: `Central operational analytics command hub for ${unitName}. Provides real-time metrics on throughput, live queue workloads, daily performance over the past 7 days, technician evaluation ratings, and delay root-cause analysis.`,
    sections: [
      {
        title: 'Throughput & Volume Analytics',
        desc: 'Outcome metrics for selected timeframe',
        details: 'Displays Total Requests (all time or selected period), Resolved Tickets (completed), and Declined Requests. Includes a live Today: X Requests • Y Completed badge. Filterable by All Time, Annually, Quarterly, Monthly, or Daily.'
      },
      {
        title: 'Daily Performance & Activity Tracker (Last 7 Days)',
        desc: '7-day operational workload breakdown',
        details: 'Visualizes daily received requests vs. completed work orders for the past seven days, with the current day prominently flagged as TODAY. Clicking any specific day immediately filters the throughput analytics to that date.'
      },
      {
        title: 'Active Operations & Workload (Live Pipeline)',
        desc: 'Real-time stage counters across current tickets',
        details: isSsu
          ? 'Tracks incoming security incident reports across two active stages: Awaiting Review (Pending) and Under Investigation (Processing).'
          : 'Tracks tickets actively in the pipeline: Awaiting Approval (Pending), Scheduled Jobs (Dispatched), and Work in Progress (Active).'
      },
      ...(isSsu
        ? [
            {
              title: 'Incident Heatmap (By Category)',
              desc: 'Visual distribution of campus safety reports',
              details: 'Donut chart illustrating incident frequencies across categories (Theft/Burglary, Vandalism, Altercations, Bullying, etc.) with a color-coded legend to pinpoint high-risk campus zones.'
            }
          ]
        : [
            {
              title: 'Evaluation Averages & Star Ratings',
              desc: 'Client satisfaction scores across completed work orders',
              details: 'Displays average scores (out of 5) and star ratings for Quality, Efficiency, and Timeliness submitted by university requesters upon job closure.'
            },
            {
              title: 'Job Completion Health',
              desc: 'Turnaround distribution of evaluated jobs',
              details: 'Shows counts and percentages across 4 standardized outcomes: Early / Ahead of Schedule, On-Time Completion, Completed Beyond Time, and Not Completed / Halted.'
            },
            {
              title: 'Root Cause Analysis (Why Delays & Barriers Happen)',
              desc: 'Operational delay factors and obstacles',
              details: `Categorizes reported obstacles into 3 columns: Completed Beyond Time (Delay Factors), Not Completed / Performed (Barriers), and Approval Delay Reasons (Pre-Work holdups such as ${isLeau ? 'Equipment Inspection' : 'Awaiting Procurement'}).`
            }
          ])
    ],
    tabs: [
      { name: 'All Time', badge: 'Historical', desc: 'Aggregates all historical ticket throughput since system inception.' },
      { name: 'Annually', badge: 'Current Fiscal Year', desc: 'Filters performance metrics to the current academic calendar year.' },
      { name: 'Quarterly', badge: 'Current Quarter', desc: 'Isolates metrics for Q1, Q2, Q3, or Q4 institutional reporting.' },
      { name: 'Monthly', badge: 'Current Month', desc: 'Focuses analytics on current monthly operations.' },
      { name: 'Daily', badge: 'Single Day Focus', desc: 'Zeroes in on today or a specific day selected from the 7-day tracker.' }
    ],
    buttons: [
      {
        label: '+ Request / Request Service',
        type: 'primary',
        desc: 'Opens the Admin Self-Service Intake flow to submit an internal unit work order or incident report.',
        result: 'Routes to the Service Catalog selection screen with role set as ADMIN.'
      },
      {
        label: 'Timeframe Filter Buttons',
        type: 'secondary',
        desc: 'Switches the analytics calculation window between All Time, Annually, Quarterly, Monthly, and Daily.',
        result: 'Instantly recalculates KPI counters and throughput charts.'
      },
      {
        label: '7-Day Tracker Day Cards',
        type: 'info',
        desc: 'Clicking any individual day card in the 7-day performance widget filters the dashboard view to that specific date.',
        result: 'Applies date filter to throughput and volume statistics.'
      }
    ],
    procedures: [
      {
        title: 'How to Monitor Daily Unit Workload and Health',
        steps: [
          'Log in to the GSO Portal using your unit administrative credentials.',
          'Review the Throughput & Volume Analytics banner at the top to check today\'s incoming requests and completions.',
          'Examine the Live Pipeline to see if tickets are backed up in Pending Approvals or Active Dispatches.',
          'Inspect the Job Completion Health and Root Cause Analysis cards to identify recurring procurement or weather bottlenecks.'
        ]
      },
      {
        title: 'How to Submit an Internal Admin Work Order',
        steps: [
          'Click the "+ Request" button in the upper action header.',
          'Browse or search the Services Catalog for the required facilities, landscaping, or security service.',
          'Select the service card, click "Fill Out Form", enter building and room particulars, attach optional photos, and click "Validate & Submit Request".'
        ]
      }
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

export const createUnitAdminQueuesGuide = (unitCode = 'fgmu') => {
  const u = unitCode.toLowerCase();
  const U = unitCode.toUpperCase();
  const isSsu = u === 'ssu';
  const isLeau = u === 'leau';

  if (isSsu) {
    return {
      id: `admin-${u}-queues`,
      name: 'Submitted Incident Reports Queue',
      route: `/admin/${u}/submitted-tickets`,
      icon: '📥',
      manualSection: 'Section E3: SSU Submitted Tickets',
      roleBadge: 'SSU Administrator',
      summary: 'Review and evaluate incoming security incident reports filed by campus students, faculty, and personnel. Examine witness testimonies, attached evidence photos, and initiate safety investigations or administrative recommendations.',
      sections: [
        {
          title: 'Queue Summary & Status Banner',
          desc: 'Header counter showing total awaiting reviews',
          details: 'Displays the live count of submitted incident reports awaiting initial administrative review and safety assessment.'
        },
        {
          title: 'Search & Type Filter Bar',
          desc: 'Find incident reports quickly',
          details: 'Search by Ticket ID, reporter name, contact number, campus location, or narrative summary. Filter by All, Emergency, or Standard incident priority.'
        },
        {
          title: 'Incident Reports Table',
          desc: 'Summary list of submitted security cases',
          details: 'Displays Ticket Reference #, Reporter Information (name, email, phone), Incident Date/Time, designated Location, and actionable decision controls.'
        },
        {
          title: 'Security Incident Report Full Viewer',
          desc: 'Comprehensive confidential incident inspection modal',
          details: 'Shows Reporter Profile (name, email, phone, ID number, college/organization), Incident Classification (theft, vandalism, altercations, etc.), Incident Particulars (who, where, when), and Narrative Statement (how). Highlights whether a formal staff recommendation notation has been recorded.'
        }
      ],
      tabs: [
        { name: 'All Reports', badge: 'Complete Queue', desc: 'All incoming incident reports awaiting review.' },
        { name: 'Emergency', badge: 'High Priority', desc: 'Urgent incidents flagged for immediate campus safety response.' },
        { name: 'Standard', badge: 'Routine', desc: 'Standard incident reports queued for routine security follow-up.' }
      ],
      buttons: [
        {
          label: 'Investigate',
          type: 'primary',
          desc: 'Moves the incident report from Submitted into the Under Investigation active case queue.',
          result: 'Status updates to "Under Investigation" and unlocks officer dispatch.'
        },
        {
          label: 'Add Note / Add Notation',
          type: 'info',
          desc: 'Opens the Add/Update Recommendation modal. Recording a notation is required before an incident can be resolved.',
          fields: 'Recommendation/Action Notation (specifying security findings, actions taken, or instructions for the reporter).',
          result: 'Saved notation is displayed directly to the reporter in their live tracking timeline.'
        },
        {
          label: 'Dismiss',
          type: 'danger',
          desc: 'Closes an out-of-scope or invalid incident report without conducting an investigation.',
          result: 'Marks incident report as dismissed and archives the record.'
        },
        {
          label: 'View Details (Eye Icon)',
          type: 'secondary',
          desc: 'Opens the Full Security Incident Report modal to inspect witness statements, photos, and reporter credentials.',
          result: 'Displays complete incident dossier.'
        }
      ],
      procedures: [
        {
          title: 'How to Review and Investigate a Campus Incident',
          steps: [
            'Navigate to "Submitted Tickets" from the SSU sidebar.',
            'Locate the incident report in the queue and click the Eye Icon to review witness statements, location, and photos.',
            'Click "Add Notation" to document security findings and preliminary advice for the client.',
            'Click "Investigate" to move the ticket into the Under Investigation active case queue.'
          ]
        },
        {
          title: 'How to Dismiss an Out-of-Scope Incident',
          steps: [
            'Open the report details and verify that the submission does not warrant security intervention.',
            'Click "Dismiss" on the report row.',
            'Confirm the dismissal action. The report is recorded in historical archives without dispatching security officers.'
          ]
        }
      ],
      tourSteps: [
        { element: '#tour-main-workspace', title: '1. Submitted Incidents Queue', desc: 'Review newly submitted campus security reports awaiting administrative assessment.' },
        { element: 'input[type="text"]', title: '2. Search & Filter Reports', desc: 'Quickly locate reports by ticket ID, reporter name, contact number, or incident location.' },
        { element: 'table, .space-y-4', title: '3. Incident Particulars & Evidence', desc: 'Inspect reported incident types, witness statements, and uploaded photo attachments.' },
        { element: 'button', title: '4. Administrative Decision Controls', desc: 'Add official security notations, launch an active investigation, or dismiss invalid reports.' }
      ]
    };
  }

  // FGMU & LEAU Queues (Section C3 & D3)
  return {
    id: `admin-${u}-queues`,
    name: 'Pending Approvals Queue',
    route: `/admin/${u}/queues`,
    icon: '📥',
    manualSection: `Section ${U === 'FGMU' ? 'C3' : 'D3'}: Pending Approvals`,
    roleBadge: `${U} Administrator`,
    summary: `Examine incoming service tickets for ${U}, review problem particulars and photo attachments, and take administrative actions: Approve for dispatch, Delay for inspections or procurement, Decline out-of-scope work, Recategorize misclassified trades, or Escalate heavy projects to the GSO Director.`,
    sections: [
      {
        title: 'Filter & Search Toolbar',
        desc: 'Keyword search and service filtering',
        details: 'Search by Ticket Ref, Requester name, College/Building, or problem particulars. Filter by service category dropdown, and narrow by All, Escalated, or Routine urgency badges.'
      },
      {
        title: 'Ticket Queues Table',
        desc: 'Itemized list of pending service submissions',
        details: 'Displays Ticket Ref (with Borrowing tag where applicable), Requester Profile, Designated Location (or borrowed items, quantity, and date needed), file attachment counts, and direct action buttons.'
      },
      {
        title: 'Full Ticket Information Viewer',
        desc: 'Comprehensive ticket dossier modal',
        details: 'Shows Requester Profile (name, email, phone, ID number, college/office), Designated Location, Job Particulars & Nature of Work, and high-resolution Attached Photos and Documents with download capabilities.'
      },
      {
        title: 'Administrative Decision Modals',
        desc: 'Action dialogs for ticket processing',
        details: 'Dedicated modals for Approving (with emergency marker), Delaying (with 6 standard justification presets), Declining (with required reason), Escalating to Director (with budget/structural justification), and Recategorizing.'
      }
    ],
    tabs: [
      {
        name: 'Pending Approval',
        badge: 'Default Queue',
        desc: 'Active queue of newly filed tickets waiting for initial administrative assessment.',
        criteria: 'Tickets filed by requesters enter here immediately upon digital submission.'
      },
      {
        name: 'Approval Delayed',
        badge: 'On Hold',
        desc: 'Tickets temporarily held for material procurement, budget clearance, ocular inspection, or client specs.',
        criteria: 'Remains in this tab until explicitly approved or declined. If escalated to Director, carries a Director Review tag.'
      }
    ],
    buttons: [
      {
        label: 'Approve / Approve Request',
        type: 'success',
        desc: 'Opens the Approve Service Request modal. Check "Mark as Emergency Request" if priority dispatch and task preemption are required.',
        result: 'Ticket moves to the Approved Tickets queue awaiting personnel or inventory assignment.'
      },
      {
        label: 'Delay',
        type: 'warning',
        desc: 'Opens the Delay Ticket Approval modal when work cannot proceed immediately.',
        fields: isLeau
          ? 'Reason for Delay: Awaiting Procurement of Materials/Parts, Awaiting Budget Clearance, Pending Vehicle/Equipment Inspection, Awaiting Additional Specifications from Requester, Scheduled for Bulk Parts Cycle, or Other/Custom Reason + Optional Notes.'
          : 'Reason for Delay: Awaiting Procurement of Materials, Awaiting Budget Clearance, Pending Ocular Assessment/Inspection, Awaiting Additional Specifications, Scheduled for Bulk Procurement, or Other/Custom Reason + Optional Notes.',
        result: 'Moves ticket to the Approval Delayed tab and logs pre-work delay factors in root cause analytics.'
      },
      {
        label: 'Decline Request',
        type: 'danger',
        desc: 'Rejects an invalid or out-of-scope service request.',
        fields: 'Decline Reason (required text).',
        result: 'Marks ticket as Declined, notifies requester, and records entry in historical archives.'
      },
      {
        label: 'Escalate to Director',
        type: 'info',
        desc: 'Transfers heavy, high-budget, or structurally critical work orders to the GSO Director for executive clearance.',
        fields: 'Select Justification Preset (Heavy structural repairs, High-cost procurement, Campus disruption, VIP event, Custom) + Detailed Justification Notes.',
        result: 'Sends ticket directly to the Director\'s Escalated Approval tab.'
      },
      {
        label: 'Recategorize',
        type: 'secondary',
        desc: 'Corrects a misclassified nature of work selected by the requester.',
        fields: 'Pick the Correct Nature of Work from the unit services catalog.',
        result: 'Updates the service classification while preserving original requester notes.'
      },
      {
        label: 'View Details / Full Info',
        type: 'secondary',
        desc: 'Opens the complete ticket dossier modal showing requester profile, room location, particulars, and attachments.',
        result: 'Displays Full Ticket Information modal.'
      }
    ],
    procedures: [
      {
        title: 'How to Approve a Ticket for Dispatch',
        steps: [
          'Locate the ticket in the Pending Approval queue and click "View Details" to inspect the scope of work.',
          'Verify that campus location and problem particulars are clearly defined.',
          'Click "Approve" (or "Approve Request" inside the modal).',
          'Check "Mark as Emergency Request" if this is an urgent safety or infrastructure hazard.',
          'Click "Confirm Approval". The ticket transitions to Approved Tickets.'
        ]
      },
      {
        title: 'How to Delay a Ticket for Inspection or Materials',
        steps: [
          'Click "Delay" on the ticket row or inside Full Info.',
          'Select the standardized Reason for Delay from the dropdown (e.g., Awaiting Procurement or Ocular Inspection).',
          'Add descriptive notes for administrative tracking.',
          'Click "Confirm Delay". The ticket moves to the Approval Delayed tab.'
        ]
      },
      {
        title: 'How to Escalate Heavy Work to the GSO Director',
        steps: [
          'Open the ticket\'s Full Info modal and click "Escalate to Director".',
          'Select a Justification Preset (e.g., Heavy structural repairs requiring executive budget).',
          'Enter detailed justification notes outlining why executive clearance is necessary.',
          'Click "Submit to Director". The ticket is routed to the Director Console.'
        ]
      },
      {
        title: 'How to Recategorize Misclassified Service Requests',
        steps: [
          'Open Full Info and click "Recategorize".',
          'Compare the requester\'s reported problem against the available services.',
          'Select the correct service from the unit catalog dropdown.',
          'Click "Save Recategorization".'
        ]
      }
    ],
    tourSteps: [
      { element: '#tour-main-workspace', title: '1. Pending Approvals Queue', desc: `Review newly submitted ${U} service tickets awaiting administrative verification.` },
      { element: 'input[type="text"]', title: '2. Search & Scope Filtering', desc: 'Filter requests by ticket ID, requester name, building, room, or issue description.' },
      { element: 'table, .space-y-4', title: '3. Problem Particulars & Photos', desc: 'Click any request to examine uploaded photos, user details, urgency markers, and complete scope notes.' },
      { element: 'button', title: '4. Decision Controls', desc: 'Take action: Approve to proceed to dispatch, Delay with justification, Decline, Recategorize, or Escalate to Director.' }
    ]
  };
};

export const createUnitAdminApprovedGuide = (unitCode = 'fgmu') => {
  const u = unitCode.toLowerCase();
  const U = unitCode.toUpperCase();
  const isLeau = u === 'leau';

  return {
    id: `admin-${u}-approved`,
    name: 'Approved Tickets Queue',
    route: `/admin/${u}/approved-tickets`,
    icon: '✅',
    manualSection: `Section ${U === 'FGMU' ? 'C4' : 'D4'}: Approved Tickets`,
    roleBadge: `${U} Administrator`,
    summary: `Manage tickets that have passed administrative approval and are awaiting dispatch. For work orders, proceed to technician assignment and scheduling. For borrowing requests, proceed to equipment/plant inventory allocation. Review and respond to incoming collaboration requests from counterpart units.`,
    sections: [
      {
        title: 'Awaiting Dispatch Status Banner',
        desc: 'Active counter of approved tickets',
        details: 'Displays the number of tickets approved by the Unit Head or GSO Director that require worker scheduling or stock reservation.'
      },
      {
        title: 'Search & Urgency Filters',
        desc: 'Queue navigation controls',
        details: 'Filter tickets by All, Emergency (priority dispatch), or Standard. Search by ticket ID, requester, service, or campus room.'
      },
      {
        title: 'Approved Tickets List',
        desc: 'Work orders and borrowing tickets',
        details: 'Displays Ticket Reference, Requester Profile, Designated Location, and direct action triggers for Worker Assignment or Inventory Reservation.'
      },
      {
        title: 'Collab Requests Viewer',
        desc: 'Cross-unit joint ticket coordination',
        details: 'Shows incoming requests from counterpart units (e.g., LEAU -> FGMU), required scope of work, and side-by-side view of Your Unit\'s Dispatch vs Counterpart Dispatch.'
      }
    ],
    tabs: [
      {
        name: 'Unit Tickets',
        badge: 'Primary Queue',
        desc: 'Approved work orders and borrowing requests originating from university requestors for your unit.',
        criteria: 'Holds tickets with status "Awaiting Dispatch".'
      },
      {
        name: 'Collab Requests',
        badge: 'Joint Projects',
        desc: 'Collaboration requests where another unit (FGMU, LEAU, or SSU) has requested your unit\'s manpower.',
        criteria: 'Displays status such as "Accepted - Dispatch Now" or "Awaiting your dispatch".'
      }
    ],
    buttons: [
      {
        label: 'Proceed to Assign Workers / Assign Workers',
        type: 'primary',
        desc: 'Moves a work-order ticket to the Dispatch workspace to select technicians, set dates, and assess materials.',
        result: 'Routes to /admin/[unit]/assign-workers with the ticket set as the active target.'
      },
      {
        label: 'Proceed to Assign Inventory / Assign Inventory',
        type: 'success',
        desc: 'For borrowing tickets (tools/equipment or plants), moves to the inventory allocation workspace to reserve stock.',
        result: 'Routes to the borrowing dispatch workspace.'
      },
      {
        label: 'Dispatch Workers (Collab)',
        type: 'info',
        desc: 'Opens the collaboration worker assignment screen to allocate your unit\'s staff to joint projects.',
        result: 'Allows technician assignment to collaborative cross-unit tickets.'
      },
      {
        label: 'Full Info',
        type: 'secondary',
        desc: 'Opens full ticket review modal showing requester profile, room location, particulars, and file attachments.',
        result: 'Displays Full Ticket Information modal.'
      }
    ],
    procedures: [
      {
        title: 'How to Dispatch an Approved Work Order',
        steps: [
          'From the "Approved Tickets" page, click "Full Info" or "Assign Workers" on the approved ticket row.',
          'Review the scope of work and campus location.',
          'Click "Proceed to Assign Workers". The ticket is loaded into the Dispatch workspace.',
          'Set the implementation date, working days, material pre-assessment, and assign qualified technicians.'
        ]
      },
      {
        title: 'How to Fulfill a Borrowing Request',
        steps: [
          'Locate the approved borrowing ticket (flagged with a Borrowing tag) in the Unit Tickets list.',
          'Click "Assign Inventory" (or "Proceed to Assign Inventory" inside Full Info).',
          'Match the requested item and quantity against available on-shelf inventory, click "Assign", then click "Set Ready for Pickup".'
        ]
      },
      {
        title: 'How to Respond to an Incoming Unit Collaboration Request',
        steps: [
          'Click the "Collab Requests" tab.',
          'Click "Full Info" to review the requested assistance, location, and the counterpart unit\'s assigned staff.',
          'Click "Dispatch Workers" to assign technicians from your roster to join the counterpart team on site.'
        ]
      }
    ],
    tourSteps: [
      { element: '#tour-main-workspace', title: '1. Approved Tickets Queue', desc: `Manage tickets that have been approved and are awaiting field dispatch or inventory reservation.` },
      { element: '.flex, button', title: '2. Unit vs. Collab Tabs', desc: 'Switch between direct service requests and joint collaboration requests from counterpart units.' },
      { element: 'button', title: '3. Assign Workers & Inventory', desc: 'Click Assign Workers for maintenance jobs, or Assign Inventory for tools and plant borrowing requests.' }
    ]
  };
};

export const createUnitAdminDispatchGuide = (unitCode = 'fgmu') => {
  const u = unitCode.toLowerCase();
  const U = unitCode.toUpperCase();
  const isLeau = u === 'leau';
  const isSsu = u === 'ssu';

  return {
    id: `admin-${u}-dispatch`,
    name: 'Ticket Dispatch & Scheduling Workspace',
    route: `/admin/${u}/assign-workers`,
    icon: '👷',
    manualSection: `Section ${U === 'FGMU' ? 'C5' : U === 'LEAU' ? 'D5' : 'E6'}: Dispatch Tickets`,
    roleBadge: `${U} Dispatcher`,
    summary: `Assign qualified technicians or security responders to approved tickets, set calendar implementation start dates, compute target completion deadlines (auto-excluding weekends and official non-working holidays), pre-assess consumable materials, or reserve borrowing inventory.`,
    sections: [
      {
        title: 'Active Assignment Target Banner',
        desc: 'Summary of the ticket currently being dispatched',
        details: 'Highlights ticket reference number, requester profile, service title, and designated building room. Provides quick links to "Review Full Details", "Unit Collaboration", and a red "X" to remove as active target.'
      },
      {
        title: 'Implementation Calendar & Target Working Days',
        desc: 'Scheduling controls with institutional calendar logic',
        details: 'Click "Change" to select the calendar start date. Use – / + controls to set Target Working Days (1 to 31 days). The system automatically skips weekends and registered institutional holidays to compute the official deadline.'
      },
      {
        title: isSsu ? 'Security Equipment & Material Pre-Assessment' : isLeau ? 'Plant Care & Material Pre-Assessment' : 'Initial Material Pre-Assessment',
        desc: 'Pre-job supplies and benchmark price estimation',
        details: 'Check "Labor Only Service (No Materials)" if no supplies are required, or click "+ Add Item" to itemize needed supplies, quantities, units, and benchmark prices. The Total Estimated Cost calculates automatically.'
      },
      {
        title: 'Available Personnel Roster & Specialty Auto-Filter',
        desc: 'Technician directory with trade matching',
        details: isSsu
          ? 'Specialty auto-filter suggests officers matching the incident (Campus Security & Patrol, Traffic & Parking, Event Crowd Control, Perimeter Security, Surveillance & CCTV, Incident Response).'
          : isLeau
          ? 'Specialty auto-filter suggests staff matching the service (Janitor, Groundskeeper, Landscaper, Garbage Collector).'
          : 'Specialty auto-filter suggests matching trade specialists (Carpenter, Electrician, Mason, Painter, Plumber, Refrigeration/Aircon, Welder). Toggle between Matched Specialists and Show All Workers.'
      },
      {
        title: 'Assigned Workforce Panel',
        desc: 'Live roster of assigned staff for this ticket',
        details: 'Shows assigned technicians, primary/secondary roles, active ticket count per worker, and red "X" buttons to unassign staff prior to dispatch.'
      },
      {
        title: 'Cross-Unit Collaboration Launcher',
        desc: 'Requesting manpower from counterpart units',
        details: 'Click "Unit Collaboration" -> "+ Request Assistance". Select target units (FGMU, LEAU, or SSU) and define required scope of work to initiate joint execution.'
      },
      {
        title: 'Inventory Allocation (Borrowing Requests Mode)',
        desc: 'Dedicated inventory reservation interface',
        details: 'Active when a borrowing ticket is selected. Matches requested items against Available in-stock items, specifies quantity, and triggers "Set Ready for Pickup".'
      }
    ],
    tabs: [
      { name: 'Field Dispatch', badge: 'Work Orders', desc: 'Worker allocation, calendar scheduling, and material pre-assessment.' },
      { name: 'Inventory Allocation', badge: 'Borrowing Requests', desc: 'Equipment and plant stock allocation with Ready for Pickup notification.' }
    ],
    buttons: [
      {
        label: 'Confirm & Dispatch Work Order',
        type: 'primary',
        desc: 'Finalizes the work order dispatch, generates the official Job Order slip, and moves the ticket to the Scheduled Tickets queue.',
        result: 'Ticket moves to Scheduled Tickets (Awaiting Implementation) with assigned workers notified.'
      },
      {
        label: 'Set Ready for Pickup',
        type: 'success',
        desc: 'For borrowing tickets, reserves assigned inventory and notifies the requester that items are prepared for collection.',
        result: 'Moves borrowing ticket to Scheduled Borrowing queue.'
      },
      {
        label: 'Assign to Ticket / Assigned (Remove)',
        type: 'info',
        desc: 'Toggles staff assignment on an individual technician card. Displays "Assigned (Remove)" when allocated.',
        result: 'Adds or removes staff member from the Assigned Workforce panel.'
      },
      {
        label: 'Unit Collaboration / + Request Assistance',
        type: 'secondary',
        desc: 'Opens the Cross-Unit Collaboration modal to request joint support from other GSO sub-units.',
        fields: 'Target Sub-Unit (LEAU/SSU/FGMU) and Scope of Work & Required Assistance (required description).',
        result: 'Dispatches collaboration request to the counterpart unit\'s Collab Requests tab.'
      },
      {
        label: 'Labor Only Service (No Materials)',
        type: 'secondary',
        desc: 'Checkbox declaring that the job requires labor only, bypassing material estimation and post-job liquidation.',
        result: 'Flags ticket as Labor Only throughout its operational lifecycle.'
      },
      {
        label: '+ Add Item (Materials)',
        type: 'secondary',
        desc: 'Adds a row to the pre-assessment table to itemize materials from the Common Materials Library.',
        result: 'Calculates Total Estimated Cost automatically.'
      }
    ],
    procedures: [
      {
        title: 'How to Dispatch a Field Work Order',
        steps: [
          'Select an approved ticket from the top selector if none is currently active.',
          'Under Scheduling, click "Change" to select the Implementation Date.',
          'Set Target Working Days using the – / + buttons (weekends and official holidays are excluded automatically).',
          'In Material Assessment, check "Labor Only" or click "+ Add Item" to itemize estimated supplies.',
          'Under Available Personnel, click "Assign to Ticket" on qualified technicians matching the job trade.',
          'Review the Assigned Workforce panel, then click "Confirm & Dispatch Work Order".'
        ]
      },
      {
        title: 'How to Fulfill and Schedule Equipment/Plant Borrowing',
        steps: [
          'Select the approved borrowing ticket in the workspace.',
          'Review Requested Item, Quantity, Pickup Date, and Expected Return Date.',
          'Under Available Inventory, locate matching in-stock items, type the allocated quantity, and click "Assign".',
          'Click "Set Ready for Pickup" to notify the borrower to collect the items.'
        ]
      },
      {
        title: 'How to Request Support from Another GSO Unit',
        steps: [
          'Click "Unit Collaboration" on the active target panel.',
          'Click "+ Request Assistance".',
          'Check the target unit(s) (e.g., LEAU for tree trimming, SSU for perimeter security).',
          'Enter detailed scope notes specifying site hazards and required manpower.',
          'Click "Dispatch Request".'
        ]
      }
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

export const createUnitAdminDispatchedGuide = (unitCode = 'fgmu') => {
  const u = unitCode.toLowerCase();
  const U = unitCode.toUpperCase();
  const isLeau = u === 'leau';

  return {
    id: `admin-${u}-dispatched`,
    name: 'Scheduled Work Orders Queue',
    route: `/admin/${u}/dispatched`,
    icon: '📅',
    manualSection: `Section ${U === 'FGMU' ? 'C6' : 'D6'}: Scheduled Tickets`,
    roleBadge: `${U} Administrator`,
    summary: `Manage dispatched jobs awaiting on-site execution, print official University Job Order slips (with auto-rendered Unit Head and Director digital signatures), mark early job starts, and release reserved borrowing inventory to clients upon pickup.`,
    sections: [
      {
        title: 'Awaiting Implementation Status Badge',
        desc: 'Active scheduled ticket counter',
        details: 'Lists work orders with assigned technicians and set implementation dates awaiting scheduled arrival.'
      },
      {
        title: 'Job Schedules Table',
        desc: 'Upcoming field visits',
        details: 'Displays Ticket Reference, Requester Profile, Designated Location, Target Schedule date, and direct actions: Job Order, Regenerate, and Start Early.'
      },
      {
        title: 'Scheduled Ticket Particulars Panel',
        desc: 'Deep inspection panel for scheduled dispatches',
        details: 'Displays Designated Personnel (staff names, trade roles, status Awaiting Start), Planned Start Date, Requester Profile, Location, Job Particulars, and attached files.'
      },
      {
        title: 'Official Job Order Slip (QM-GSO-FGMU-01 / QM-GSO-LEAU-01)',
        desc: 'Physical university work order document',
        details: 'Formally numbered job request document containing Requisition Details, Scope of Work, Duration, Assigned Staff, and automated digital signature blocks for GSO Director and Unit Head. Printable or exportable to .DOCX.'
      },
      {
        title: 'Borrowing Requests Pickup Manager',
        desc: 'Equipment and plant collection handler',
        details: 'Lists approved borrowing tickets ready for collection. Clicking "Picked Up" opens the confirmation modal to log that items have left the warehouse.'
      }
    ],
    tabs: [
      { name: 'Job Schedules', badge: 'Work Orders', desc: 'Maintenance jobs with assigned workers waiting to start on site.' },
      { name: 'Borrowing Requests', badge: 'Item Pickup', desc: 'Approved borrowing tickets with inventory reserved, ready for client collection.' },
      { name: 'Collab Tickets', badge: 'Cross-Unit Jobs', desc: 'Joint multi-unit scheduled work orders coordinated with counterpart departments.' }
    ],
    buttons: [
      {
        label: 'Job Order / Print Job Order',
        type: 'primary',
        desc: 'Opens the formal Job Order document preview with official digital signatures and evaluation section F.',
        result: 'Displays official printable Job Order modal.'
      },
      {
        label: 'Start Early / Yes, Start Now',
        type: 'success',
        desc: 'Marks the job as actively started ahead of its scheduled implementation date.',
        result: 'Moves ticket immediately into the In Progress active dispatches queue.'
      },
      {
        label: 'Picked Up / Yes, Mark Picked Up',
        type: 'info',
        desc: 'Confirms that the borrower has collected the reserved tools, equipment, or plants.',
        result: 'Moves borrowing ticket to Borrowed Requests in Active Tickets.'
      },
      {
        label: 'Re-Generate',
        type: 'secondary',
        desc: 'Refreshes the official Job Order PDF data to reflect any recent changes in personnel or materials.',
        result: 'Re-renders job order preview.'
      },
      {
        label: 'Download .DOCX / Print',
        type: 'secondary',
        desc: 'Downloads or prints physical copies of the Job Order slip for field technicians to carry on site.',
        result: 'Generates document output.'
      }
    ],
    procedures: [
      {
        title: 'How to Print an Official Job Order Slip',
        steps: [
          'Locate the scheduled ticket in the Job Schedules list.',
          'Click the "Job Order" button on the row (or "Print/View Job Order" inside details).',
          'Verify that assigned technicians, problem scope, and administrative signature blocks appear correctly.',
          'Click "Print" or "Download .DOCX" to produce the official slip for technicians.'
        ]
      },
      {
        title: 'How to Start a Scheduled Job Ahead of Time',
        steps: [
          'Click "Start Early" on the scheduled ticket row.',
          'In the confirmation modal, review the assigned crew and target dates.',
          'Click "Yes, Start Now". The ticket transitions immediately to "In Progress" in Active Tickets.'
        ]
      },
      {
        title: 'How to Release Borrowed Items to a Requestor',
        steps: [
          'Click the "Borrowing Requests" tab.',
          'When the student or employee arrives at the office, verify their identity and item list.',
          'Click "Picked Up" on the ticket row.',
          'In the Confirm Item Pickup modal, click "Yes, Mark Picked Up". The ticket transitions to Borrowed Requests in Active Tickets.'
        ]
      }
    ],
    tourSteps: [
      { element: '#tour-main-workspace', title: `1. ${U} Scheduled Jobs Queue`, desc: 'Manage work orders scheduled for site execution by assigned technicians.' },
      { element: 'table, .space-y-4', title: '2. Scheduled Implementation Cards', desc: 'Inspect upcoming visit dates, assigned staff names, and deadline milestones.' },
      { element: 'button', title: '3. Job Order Slips & Actions', desc: 'Print physical job orders for technicians to carry, or mark early job starts.' }
    ]
  };
};

export const createUnitAdminActiveGuide = (unitCode = 'fgmu') => {
  const u = unitCode.toLowerCase();
  const U = unitCode.toUpperCase();
  const isSsu = u === 'ssu';
  const isLeau = u === 'leau';

  if (isSsu) {
    return {
      id: `admin-${u}-active`,
      name: 'Under Investigation Reports Queue',
      route: `/admin/${u}/investigating-tickets`,
      icon: '⚡',
      manualSection: 'Section E4: SSU Under Investigation',
      roleBadge: 'SSU Administrator',
      summary: 'Monitor active security investigations across campus. Review witness testimonies, record formal security recommendation notations, dispatch security personnel if field response is required, and resolve completed cases.',
      sections: [
        {
          title: 'Active Cases Status Banner',
          desc: 'Counter of ongoing safety investigations',
          details: 'Displays the number of incident cases actively under investigation by SSU security officers.'
        },
        {
          title: 'Search & Urgency Filters',
          desc: 'Case lookup controls',
          details: 'Search by ticket ID, reporter name, contact number, or location. Filter by All, Emergency, or Standard priority.'
        },
        {
          title: 'Under Investigation Reports Table',
          desc: 'Active case ledger',
          details: 'Displays Ticket Ref, Reporter Profile, current Staff Recommendation / Notation (warning displayed if missing), and actionable controls: Dispatch, Add Notation, Resolve, and View Details.'
        },
        {
          title: 'Staff Recommendation & Notation System',
          desc: 'Mandatory resolution prerequisite',
          details: 'Formal security notation describing actions taken, investigation findings, or student directives. Displayed directly to the reporter in their tracking timeline.'
        }
      ],
      tabs: [
        { name: 'Under Investigation Cases', badge: 'Active Investigations', desc: 'All open security cases actively being handled by SSU.' }
      ],
      buttons: [
        {
          label: 'Add Notation',
          type: 'info',
          desc: 'Opens the Add / Update Recommendation modal. Entering a notation is strictly required before an incident can be marked resolved.',
          fields: 'Recommendation / Action Notation (actions taken, findings, or directives).',
          result: 'Saves notation to the incident case and displays it to the reporter.'
        },
        {
          label: 'Dispatch',
          type: 'primary',
          desc: 'Opens Dispatch Tickets with this incident already pre-selected, allowing security personnel assignment.',
          result: 'Launches security personnel field dispatch.'
        },
        {
          label: 'Resolve',
          type: 'success',
          desc: 'Closes the investigation and finalizes the incident report. Only available after a staff notation has been recorded.',
          result: 'Marks incident report as Resolved and archives the record.'
        },
        {
          label: 'View Details (Eye Icon)',
          type: 'secondary',
          desc: 'Opens the complete incident dossier modal showing reporter details, incident classification, particulars, and narrative statement.',
          result: 'Displays Security Incident Report modal.'
        }
      ],
      procedures: [
        {
          title: 'How to Document Findings and Resolve an Incident',
          steps: [
            'Navigate to "Under Investigation" from the sidebar.',
            'Click "Add Notation" on the active incident row.',
            'Type the official security findings, actions taken, or preventive recommendations in the notation field.',
            'Click "Save Recommendation".',
            'Click "Resolve" on the incident row. The case is officially marked Resolved and moved to archives.'
          ]
        },
        {
          title: 'How to Dispatch Security Personnel to an Active Case',
          steps: [
            'Click "Dispatch" on the investigating incident row.',
            'In the Dispatch workspace, set the implementation schedule and working days.',
            'Select security officers from the personnel roster matching the incident type.',
            'Click "Confirm & Dispatch Work Order".'
          ]
        }
      ],
      tourSteps: [
        { element: '#tour-main-workspace', title: '1. Active Investigations Queue', desc: 'Monitor and manage ongoing campus security investigations in real time.' },
        { element: 'table, .space-y-4', title: '2. Case Records & Notations', desc: 'Review witness accounts, evidence, and record official security recommendations.' },
        { element: 'button', title: '3. Investigation Controls', desc: 'Dispatch security officers, record formal findings, and resolve verified cases.' }
      ]
    };
  }

  // FGMU & LEAU Active Tickets (Section C7 & D7)
  return {
    id: `admin-${u}-active`,
    name: 'Active Dispatches & Accomplishment Queue',
    route: `/admin/${u}/active-tickets`,
    icon: '⚡',
    manualSection: `Section ${U === 'FGMU' ? 'C7' : 'D7'}: Active Tickets`,
    roleBadge: `${U} Operations Head`,
    summary: `Monitor jobs actively undergoing on-site execution, authorize timeline extensions for unforeseen complications, adjust ongoing material scopes, liquidate actual spare parts consumed, inspect and return borrowed items, and review completed jobs awaiting client evaluation.`,
    sections: [
      {
        title: 'Active & Awaiting Rating Status Banner',
        desc: 'Comprehensive live operational status',
        details: 'Tracks jobs in active field progress, borrowed equipment currently in use, cross-unit collaborative jobs, and finished jobs awaiting user rating.'
      },
      {
        title: 'In Progress Live Workspace',
        desc: 'Active field maintenance monitoring',
        details: 'Displays Ticket Reference (tagged Labor Only if applicable), Requester, Location, Elapsed Working Hours (live clock), Target Duration (with badges for approved extensions), and actionable controls.'
      },
      {
        title: 'Timeline Extension Authorizer',
        desc: 'Official timeline adjustment modal',
        details: 'Select extension duration (+1, +2, +3, +5 days or custom). The system skips weekends and official holidays to compute the New Projected Date. Requires selecting an Unforeseen Circumstance (Adverse Weather, Site Obstacle, etc.) and optional Overtime Hours.'
      },
      {
        title: 'Ongoing Material Adjuster',
        desc: 'Mid-job supplies modifications',
        details: 'Update consumable material quantities or toggle between Labor Only and Material Issuance as field conditions develop on site.'
      },
      {
        title: 'Job Completion & Material Liquidation',
        desc: 'Final sign-off and parts reconciliation',
        details: 'Itemize actual spare parts and supplies consumed on site (or confirm Labor Only), add dispatcher observations, and generate the Official Material Issuance Slip.'
      },
      {
        title: 'Borrowed Requests Tracker',
        desc: 'Tracking tools/equipment and plants on loan',
        details: 'Displays items currently checked out with borrowers, pickup timestamps, and expected return dates. Clicking "Mark Returned" opens the return condition inspection modal.'
      },
      {
        title: 'Official Material Issuance Slip (Receipt Slip)',
        desc: 'Formal university liquidation document',
        details: 'Downloadable PDF detailing ticket number, requesting client, assigned workers, itemized consumed parts, and Total Material Cost.'
      }
    ],
    tabs: [
      { name: 'In Progress', badge: 'Active Repairs', desc: 'Maintenance work orders currently being executed on campus by field technicians.' },
      { name: 'Borrowed Requests', badge: 'Items on Loan', desc: 'Tools, equipment, or plants checked out by borrowers awaiting physical return.' },
      { name: 'Collab Active', badge: 'Joint Work', desc: 'Active collaborative tickets involving joint manpower across units (Incoming vs. Outgoing flows).' },
      { name: 'Awaiting Requestor Rating', badge: 'Accomplished', desc: 'Tickets marked completed by unit admins, waiting for the end-user to submit their 1-5 star rating.' }
    ],
    buttons: [
      {
        label: 'Complete / Complete Job & Save Receipt',
        type: 'success',
        desc: 'Opens the Complete Job & Material Liquidation modal. Itemizes actual consumed materials or confirms Labor Only, then transitions ticket to Awaiting Rating.',
        result: 'Generates Official Material Issuance Slip and moves ticket to Awaiting Requestor Rating.'
      },
      {
        label: 'Extend / Grant Extension',
        type: 'warning',
        desc: 'Opens the Extend Ticket / Project modal to grant justified additional working days.',
        fields: 'Working Days Extension (+1, +2, +3, +5 days or custom) and Unforeseen Circumstance Reason (required dropdown).',
        result: 'Updates target completion date, skipping weekends and holidays.'
      },
      {
        label: 'Materials / Adjust Materials',
        type: 'info',
        desc: 'Opens Adjust Ongoing Materials modal to modify parts and supplies during active field execution.',
        result: 'Saves updated material estimates and technician field notes.'
      },
      {
        label: 'Mark Returned / Confirm Return',
        type: 'success',
        desc: 'Opens the Mark Returned modal for borrowed items.',
        fields: 'Return Condition (Good, Needs Repair, Damaged, etc.) and optional Return Notes.',
        result: 'Restores inventory to on-shelf stock and archives the borrowing ticket directly.'
      },
      {
        label: 'Receipt Slip',
        type: 'secondary',
        desc: 'Opens the Official Material Issuance Slip PDF with itemized costs and downloadable format.',
        result: 'Displays formal material issuance slip modal.'
      },
      {
        label: 'Job Order',
        type: 'secondary',
        desc: 'Inspects the official generated Job Order slip for the active work order.',
        result: 'Displays Job Order preview modal.'
      }
    ],
    procedures: [
      {
        title: 'How to Grant a Timeline Extension on an Active Job',
        steps: [
          'Locate the ticket in the In Progress tab and click "Extend" (or "Grant Extension" inside details).',
          'Select the justified additional working days (+1, +2, +3, +5 days or custom).',
          'Review the New Calculated Completion Date (Philippine holidays and weekends are automatically bypassed).',
          'Select the mandatory Unforeseen Circumstance / Reason from the dropdown (e.g., Adverse Weather / Heavy Rain).',
          'Optionally log overtime hours, then click "Grant Extension".'
        ]
      },
      {
        title: 'How to Complete a Job and Liquidate Materials',
        steps: [
          'Click "Complete" on the active ticket row.',
          'Review the service summary, elapsed working duration, and assigned personnel.',
          'Under Materials Used, either keep "No materials used (Labor only)" checked, or uncheck it and itemize the exact replacement parts consumed.',
          'Add optional dispatcher completion remarks or warranty notes.',
          'Click "Complete Job & Save Receipt". The ticket transitions to Awaiting Requestor Rating.'
        ]
      },
      {
        title: 'How to Inspect and Return Borrowed Equipment or Plants',
        steps: [
          'Click the "Borrowed Requests" tab.',
          'When the borrower returns the items, click "Mark Returned".',
          'Inspect physical items and select Return Condition (e.g., Good, Needs Repair).',
          'Add return condition notes if parts are missing or damaged.',
          'Click "Confirm Return". The inventory stock is restored and the ticket is archived.'
        ]
      }
    ],
    tourSteps: [
      { element: '#tour-main-workspace', title: `1. ${U} Active Dispatches Queue`, desc: 'Monitor active operations in real time as technicians execute work on site.' },
      { element: 'table, .space-y-4', title: '2. Ongoing Work Order Cards', desc: 'Track days elapsed, implementation targets, and live technician status.' },
      { element: 'button', title: '3. Extensions & Accomplishment', desc: 'Approve timeline extension requests, liquidate actual materials used, and sign off on completed work.' }
    ]
  };
};

export const createUnitAdminPersonnelGuide = (unitCode = 'fgmu') => {
  const u = unitCode.toLowerCase();
  const U = unitCode.toUpperCase();
  const isSsu = u === 'ssu';
  const isLeau = u === 'leau';

  return {
    id: `admin-${u}-personnel`,
    name: isSsu ? 'Security Personnel Management' : 'Unit Personnel Management',
    route: `/admin/${u}/personnel`,
    icon: '👥',
    manualSection: `Section ${U === 'FGMU' ? 'C8' : U === 'LEAU' ? 'D8' : 'E7'}: Personnel Management`,
    roleBadge: `${U} Roster Administrator`,
    summary: `Manage the unit personnel roster, monitor real-time technician duty availability (Available, Working on Site, On Leave), register new staff accounts with optional mobile portal access, handle staff leave with automatic job reassignment or recovery timeline extension, and configure trade specialties.`,
    sections: [
      {
        title: 'Personnel Directory & Specialty Filter',
        desc: 'Comprehensive staff roster',
        details: isSsu
          ? 'Filter security staff by specializations: Campus Security & Patrol, Traffic & Parking, Event Crowd Control, Perimeter Security, Surveillance & CCTV, Incident Response.'
          : isLeau
          ? 'Filter landscaping staff by specialties: Groundskeeper, Landscaper, Stage & Hall Decorator, Tool & Equipment Custodian.'
          : 'Filter maintenance staff by trade specialties: Carpenter, Electrician, Hauler/Logistics, Janitor, Mason, Painter, Plumber, Aircon Technician, Welder.'
      },
      {
        title: 'Real-Time Duty Status Indicators',
        desc: 'Live availability tracking badges',
        details: 'Every worker card displays their current operational status: Available (ready for dispatch), Working on Site (assigned to an active ticket), or On Leave.'
      },
      {
        title: 'Active Workload Tracker',
        desc: 'Tickets currently assigned per worker',
        details: 'Expandable counter on each staff card showing their active work orders, scheduled dates, and turnaround progress.'
      },
      {
        title: 'Staff Leave & Active Job Handler Modal',
        desc: 'Intelligent job reassignment when staff take leave',
        details: 'When marking an active worker as on leave, the system prompts for a mandatory Reason for Leave (e.g., Sick Leave) and Action for Active Job: Reassign Job to replacement staff OR Extend Timeline with recovery days.'
      },
      {
        title: 'Add Personnel Modal',
        desc: 'Staff registration form',
        details: 'Register new personnel with First/Middle/Last Name, Suffix, and Specialty. Includes optional "Create Portal Account" toggle with username and password for field worker logins.'
      },
      {
        title: 'Manage Categories & Specialties',
        desc: 'Configuring professions and linked services',
        details: 'Define new trade roles and check which unit maintenance services each role is qualified to handle for automated dispatch filtering.'
      }
    ],
    tabs: [
      { name: 'All Personnel', badge: 'Total Roster', desc: 'All registered unit personnel.' },
      { name: 'Available', badge: 'Ready for Dispatch', desc: 'Technicians not currently assigned to active jobs, ready for immediate scheduling.' },
      { name: 'Working', badge: 'On Site', desc: 'Technicians actively executing work orders on campus.' },
      { name: 'On Leave', badge: 'Off Duty', desc: 'Staff currently on medical, vacation, or emergency leave.' }
    ],
    buttons: [
      {
        label: isSsu ? 'Add Security Staff' : 'Add Personnel',
        type: 'primary',
        desc: 'Opens the Add Personnel modal to register a new staff member with optional portal credentials.',
        result: 'Adds worker to the unit roster.'
      },
      {
        label: 'Set Leave (Active) / Set Leave',
        type: 'warning',
        desc: 'Marks staff member on leave. If worker has an active assignment, opens the Staff Leave & Active Job Handler modal.',
        result: 'Prompts to reassign active work to replacement staff or extend project timeline.'
      },
      {
        label: 'Manage Categories / Manage Specializations',
        type: 'secondary',
        desc: 'Opens the category management modal to define trade professions and link supported unit services.',
        result: 'Updates auto-filter suggestions in the Dispatch workspace.'
      },
      {
        label: 'Edit',
        type: 'secondary',
        desc: 'Opens Edit Personnel Details to update worker name or trade specialty.',
        result: 'Saves updated staff profile.'
      },
      {
        label: 'Expand Assigned Tickets',
        type: 'info',
        desc: 'Expands the list of tickets currently allocated to the selected worker.',
        result: 'Shows ticket refs, service nature, and scheduled dates.'
      }
    ],
    procedures: [
      {
        title: 'How to Register a New Staff Member',
        steps: [
          'Click "Add Personnel" (or "Add Security Staff") at the top of the roster.',
          'Fill in First Name, Middle Initial, Last Name, and Name Extension.',
          'Select the worker\'s primary Specialty / Role from the dropdown.',
          'Toggle "Create Portal Account" if the worker needs mobile portal access to view assigned jobs.',
          'If enabled, enter a Username (min 3 chars) and Password (min 8 chars).',
          'Click "Add to Roster".'
        ]
      },
      {
        title: 'How to Handle Staff Leave on Active Jobs',
        steps: [
          'Locate the staff card and click "Set Leave".',
          'If the worker has active jobs, the Staff Leave & Active Job Handler modal opens.',
          'Select the Reason for Leave (e.g., Sick Leave / Medical Recovery).',
          'Choose the Action for Current Active Job:',
          '• Reassign Job: select an available replacement worker from the dropdown to transfer the ticket immediately.',
          '• Extend Timeline: select recovery extension days (+1, +2, +3, +5 days) to push the deadline forward.',
          'Click "Confirm Leave & Update Job".'
        ]
      },
      {
        title: 'How to Manage Specialties and Supported Services',
        steps: [
          'Click "Manage Categories" in the header.',
          'To add a new role, type a Category Name (e.g., Solar Technician).',
          'Under Supported Unit Services, check the services this role covers.',
          'Click "Add Category". The new role is now available across personnel and dispatch.'
        ]
      }
    ],
    tourSteps: [
      { element: '#tour-main-workspace', title: `1. ${U} Personnel Roster`, desc: 'Manage your unit technicians, duty schedules, and field specializations.' },
      { element: 'button', title: '2. Add Staff Member', desc: 'Register a new personnel account with employee ID, trade specialty, and contact details.' },
      { element: 'table, .grid', title: '3. Staff Cards & Duty Status', desc: 'View active ticket workloads and toggle personnel availability between Available, Working, and On Leave.' }
    ]
  };
};

export const createUnitAdminInventoryGuide = (unitCode = 'fgmu') => {
  const u = unitCode.toLowerCase();
  const U = unitCode.toUpperCase();
  const isLeau = u === 'leau';

  return {
    id: `admin-${u}-inventory`,
    name: isLeau ? 'Plant & Tool Inventory Management' : 'Tools & Equipment Inventory Management',
    route: `/admin/${u}/inventory`,
    icon: '📦',
    manualSection: `Section ${U === 'FGMU' ? 'C9' : 'D9'}: Inventory Management`,
    roleBadge: `${U} Inventory Custodian`,
    summary: `Manage university tools, equipment, nursery plants, and materials. Monitor available stock levels, register new inventory items, conduct physical count quantity adjustments, update maintenance conditions, and fulfill equipment loans.`,
    sections: [
      {
        title: 'Stock Metric Summary Cards',
        desc: 'Inventory health indicators',
        details: 'Displays Total Items, Available in Stock, Borrowed / Checked Out, and In Maintenance / Under Repair with live count tallies.'
      },
      {
        title: 'Inventory Search & Display Controls',
        desc: 'Catalog navigation controls',
        details: 'Search by item name, model, serial barcode number, or storage location. Toggle between Table View and Cards View.'
      },
      {
        title: 'Stock Status & Category Filters',
        desc: 'Categorical stock sorting',
        details: isLeau
          ? 'Filter by Stock Status (All, Available, Out of Stock, Maintenance, Retired) and Category (Tools, Equipment, Plants, Materials, Others).'
          : 'Filter by Stock Status (All, Available, Out of Stock, Maintenance, Retired) and Category (Tools, Equipment, Materials, Others).'
      },
      {
        title: 'Inventory Catalog Table',
        desc: 'Itemized asset ledger',
        details: 'Displays Item Particulars, Category, Stock & Availability (e.g., 5/6 in stock with progress bar), Condition (Good, Needs Repair), Storage Location, and direct actions.'
      },
      {
        title: 'Add Inventory Item Modal',
        desc: 'Asset registration form',
        details: 'Register item with Item Name, Category, Total Quantity, Storage Location, Model/Specification, Serial Number, Initial Condition, and handling instructions.'
      },
      {
        title: 'Adjust Available Quantity Dialog',
        desc: 'Physical count adjustment tool',
        details: 'Quick modal to update the available on-shelf count (between 0 and total quantity) following audits or stock reconciliation.'
      }
    ],
    tabs: [
      { name: 'All Items', badge: 'Full Inventory', desc: 'All registered institutional assets.' },
      { name: 'Available', badge: 'On Shelf', desc: 'Items currently in stock and ready to be assigned to borrowing tickets.' },
      { name: 'Out of Stock', badge: 'Depleted', desc: 'Items with zero available on-shelf stock.' },
      { name: 'Maintenance', badge: 'Under Repair', desc: 'Equipment currently in workshop for repairs or servicing.' },
      { name: 'Retired', badge: 'Decommissioned', desc: 'Assets decommissioned from institutional service.' }
    ],
    buttons: [
      {
        label: isLeau ? '+ Add Inventory Item' : '+ Add Tool / Equipment',
        type: 'primary',
        desc: 'Opens the Add Inventory form to register a new item in the university database.',
        result: 'Adds new asset to inventory ledger.'
      },
      {
        label: 'Qty',
        type: 'info',
        desc: 'Opens the Adjust Available Quantity dialog to calibrate on-shelf stock after physical audits.',
        result: 'Updates available quantity in real time.'
      },
      {
        label: 'Edit',
        type: 'secondary',
        desc: 'Opens Edit Inventory Item to modify model, serial number, condition, location, or description.',
        result: 'Saves updated asset details.'
      },
      {
        label: 'Table / Cards Toggle',
        type: 'secondary',
        desc: 'Switches display format between compact data table and detailed visual cards.',
        result: 'Toggles UI layout mode.'
      }
    ],
    procedures: [
      {
        title: 'How to Register New Tools, Plants, or Equipment',
        steps: [
          'Click "+ Add Tool / Equipment" (or "+ Add Inventory Item") at the top right.',
          'Enter Item Name, Category, Total Quantity, and Storage Location.',
          'Optionally click "Show Additional Details" to enter Model, Serial #, Condition, and Handling Notes.',
          'Click "Add Item". The item is immediately available for dispatch and borrowing.'
        ]
      },
      {
        title: 'How to Adjust Stock After a Physical Count',
        steps: [
          'Locate the item row in the inventory table.',
          'Click "Qty" to open Adjust Available Quantity.',
          'Enter the New Available Quantity based on your physical inventory count.',
          'Click "Update Quantity".'
        ]
      },
      {
        title: 'How to Flag an Item for Repair or Maintenance',
        steps: [
          'Click "Edit" on the item row.',
          'Change the Condition dropdown from "Good" to "Needs Repair" or "Maintenance".',
          'Add maintenance notes in the description field.',
          'Click "Save Changes". The item\'s badge updates across the system.'
        ]
      }
    ],
    tourSteps: [
      { element: '#tour-main-workspace', title: `1. ${U} Inventory Workspace`, desc: 'Oversee equipment, appliances, and materials available for university operations and borrowing.' },
      { element: '.grid', title: '2. Stock Metric Counters', desc: 'Check total inventory counts, units available on shelf, borrowed items, and units under repair.' },
      { element: 'input[type="text"]', title: '3. Inventory Search', desc: 'Search items by model name, description, or serial barcode number.' },
      { element: 'button', title: '4. Register New Inventory', desc: 'Add newly acquired tools, nursery plants, or equipment to the institutional database.' }
    ]
  };
};

export const createUnitAdminMaterialsGuide = (unitCode = 'fgmu') => {
  const u = unitCode.toLowerCase();
  const U = unitCode.toUpperCase();

  return {
    id: `admin-${u}-materials`,
    name: 'Common Materials Library',
    route: `/admin/${u}/materials`,
    icon: '🧰',
    manualSection: `Section ${U === 'FGMU' ? 'C10' : 'D10'}: Common Materials Library`,
    roleBadge: `${U} Supplies Manager`,
    summary: `Standardized supplies, consumable parts, and benchmark prices for ${U} dispatches and ticket pre-assessments. Enables accurate job costing, budget estimation, and automated liquidation reconciliation upon work order completion.`,
    sections: [
      {
        title: 'Standard Supplies Catalog',
        desc: 'Consumable parts ledger',
        details: 'Comprehensive database of standardized supplies used by technicians (circuit breakers, PVC pipes, lumber, cement, fertilizer, soil, etc.).'
      },
      {
        title: 'Benchmark Price Index',
        desc: 'Institutional price reference',
        details: 'Official reference prices per unit of measure, used to compute pre-job estimates and material liquidation totals automatically.'
      },
      {
        title: 'Search & Category Filters',
        desc: 'Quick material lookup',
        details: 'Filter materials by item name or category (Electrical, Plumbing, Structural, Finishes, Landscaping, Nursery).'
      },
      {
        title: 'Baseline Synchronization Dialog',
        desc: 'Restore standardized pricing',
        details: 'Sync Baseline feature restores institutional standards from the university server if local prices become outdated.'
      }
    ],
    tabs: [
      { name: 'All Materials', badge: 'Standard Catalog', desc: 'All consumable supplies registered for this unit.' }
    ],
    buttons: [
      {
        label: '+ Add Material',
        type: 'primary',
        desc: 'Opens the Add Material modal to register a new consumable part with standard unit and benchmark price.',
        result: 'Adds supply item to the library.'
      },
      {
        label: 'Sync Baseline',
        type: 'info',
        desc: 'Synchronizes local material prices with institutional standard baselines from the university database.',
        result: 'Updates benchmark prices across all catalog items.'
      },
      {
        label: 'Edit Material',
        type: 'secondary',
        desc: 'Updates an existing material\'s benchmark price, unit of measure, or category.',
        result: 'Saves updated material pricing.'
      }
    ],
    procedures: [
      {
        title: 'How to Register a New Material and Benchmark Price',
        steps: [
          'Click "+ Add Material" in the Common Materials Library header.',
          'Enter the Material Description (e.g., LED Tube Light 18W).',
          'Select the Standard Unit of Measure (pcs, meters, kg, bags, liters, etc.).',
          'Enter the Official Benchmark Price in Philippine Pesos.',
          'Click "Save Material". The item immediately appears in Dispatch pre-assessments.'
        ]
      },
      {
        title: 'How to Sync Institutional Baseline Prices',
        steps: [
          'Click "Sync Baseline" in the library toolbar.',
          'Review the synchronization preview comparing local vs server benchmark prices.',
          'Confirm the sync to restore university standard baseline figures.'
        ]
      }
    ],
    tourSteps: [
      { element: '#tour-main-workspace', title: `1. ${U} Materials Library`, desc: 'Standardized supplies, parts specifications, and baseline prices for university maintenance.' },
      { element: 'input[type="text"]', title: '2. Material Description Search', desc: 'Search materials by item name or standard unit of measure.' },
      { element: 'table, .grid', title: '3. Standard Catalog Table', desc: 'Inspect item names, standard units (pcs, lengths, kg, etc.), and benchmark prices.' },
      { element: 'button', title: '4. Add Material & Sync', desc: 'Register new supply items or click Sync Baseline to restore institutional standards.' }
    ]
  };
};

export const createUnitAdminCollabGuide = (unitCode = 'fgmu') => {
  const u = unitCode.toLowerCase();
  const U = unitCode.toUpperCase();

  return {
    id: `admin-${u}-collab`,
    name: 'Cross-Unit Collaboration Hub',
    route: `/admin/${u}/collab-tickets`,
    icon: '🤝',
    manualSection: `Section ${U === 'FGMU' ? 'C11' : U === 'LEAU' ? 'D11' : 'E5'}: Collaboration Tickets`,
    roleBadge: `${U} Operations Coordinator`,
    summary: `Coordinate complex multi-unit projects requiring synchronized support between FGMU, LEAU, and SSU. Manage incoming assistance requests, monitor counterpart worker assignments, track joint implementation dates, and review multi-department progress.`,
    sections: [
      {
        title: 'Cross-Unit Operations Header',
        desc: 'Multi-department joint operations overview',
        details: 'Displays real-time coordination status between Facilities (FGMU), Landscaping (LEAU), and Security (SSU).'
      },
      {
        title: 'Incoming vs. Outgoing Support Indicators',
        desc: 'Collaboration flow direction badges',
        details: 'INCOMING tickets show where another unit requested your manpower. OUTGOING tickets show where your unit requested counterpart assistance.'
      },
      {
        title: 'Joint Implementation Date Synchronization',
        desc: 'Coordinated execution timelines',
        details: 'Ensures technicians from different trades and security personnel arrive on site on the same scheduled date.'
      },
      {
        title: 'Joint Collaboration Work Details Modal',
        desc: 'Multi-unit dossier viewer',
        details: 'Displays total workers across units, elapsed working hours, collaboration scope, and separate cards for each unit\'s assigned personnel.'
      }
    ],
    tabs: [
      { name: 'Incoming Support Requests', badge: 'Assisting Counterpart', desc: 'Tickets where other GSO units have requested your staff.' },
      { name: 'Outgoing Support Requests', badge: 'Requested Help', desc: 'Tickets originated by your unit where you requested LEAU, SSU, or FGMU assistance.' },
      { name: 'Active Collab', badge: 'Live Multi-Unit Work', desc: 'Joint projects actively executing on campus with live duration tracking.' }
    ],
    buttons: [
      {
        label: 'Dispatch Workers (Collab)',
        type: 'primary',
        desc: 'Assigns personnel from your unit to assist on the counterpart unit\'s collaborative ticket.',
        result: 'Allocates staff to the joint work order.'
      },
      {
        label: 'Full Info',
        type: 'secondary',
        desc: 'Opens the Joint Collaboration Work Details modal showing all participating units, scope, and personnel.',
        result: 'Displays comprehensive multi-unit dossier.'
      },
      {
        label: 'Job Order',
        type: 'secondary',
        desc: 'Inspects the official cross-unit Job Order document.',
        result: 'Opens printable Job Order slip modal.'
      }
    ],
    procedures: [
      {
        title: 'How to Fulfill an Incoming Collaboration Request',
        steps: [
          'Click the "Incoming Support Requests" tab.',
          'Click "Full Info" to review the requesting unit\'s scope of work, campus location, and scheduled date.',
          'Click "Dispatch Workers".',
          'Assign staff from your roster possessing the requested trade skills.',
          'Click "Confirm & Dispatch". The joint project updates across both dashboards.'
        ]
      },
      {
        title: 'How to Track Joint Multi-Unit Execution',
        steps: [
          'Switch to the "Active Collab" tab.',
          'Review the live elapsed working time and multi-unit dispatched personnel.',
          'Note: Joint tickets auto-start on the implementation date; only the primary requesting unit can mark the job complete.'
        ]
      }
    ],
    tourSteps: [
      { element: '#tour-main-workspace', title: '1. Cross-Unit Collaboration Hub', desc: 'Coordinate multi-department projects requiring joint manpower across campus.' },
      { element: '.flex, button', title: '2. Incoming & Outgoing Queues', desc: 'Switch between support tasks assigned to your unit and external assistance you have requested.' },
      { element: 'table, .grid', title: '3. Multi-Unit Project Cards', desc: 'View synchronized implementation dates, collaborating unit badges, and joint staff assignments.' }
    ]
  };
};

export const createUnitAdminArchivesGuide = (unitCode = 'fgmu') => {
  const u = unitCode.toLowerCase();
  const U = unitCode.toUpperCase();
  const isSsu = u === 'ssu';

  return {
    id: `admin-${u}-archives`,
    name: isSsu ? 'Archived Security Incidents' : 'Archived Tickets & Historical Records',
    route: `/admin/${u}/archives`,
    icon: '🏛️',
    manualSection: `Section ${U === 'FGMU' ? 'C12' : U === 'LEAU' ? 'D12' : 'E8'}: Archives & Records`,
    roleBadge: `${U} Records Custodian`,
    summary: `Historical repository of all closed, completed, resolved, and declined tickets. Search records by ticket reference, filter by academic calendar year and service category, inspect completed particulars with client feedback ratings, and export dedicated audit packages (.ZIP).`,
    sections: [
      {
        title: 'Completed Tickets Archives Header',
        desc: 'Permanent institutional record repository',
        details: 'Immutable, audit-ready record of all finalized service tickets, emergency repairs, borrowing loans, and security reports.'
      },
      {
        title: 'Search & Term Filtering Bar',
        desc: 'Multi-criteria archive search',
        details: 'Search by full ticket ID number (e.g., FGMU-TIC-42-2026). Filter by All Years, specific academic calendar year, and service type dropdown.'
      },
      {
        title: 'Archived Tickets Ledger Table',
        desc: 'Historical records table',
        details: 'Displays Ticket ID, Service Nature, Requester Name, Final Status (Closed, Resolved, Declined, Cancelled), Completion Date, and View Details action.'
      },
      {
        title: 'Archived Ticket Details Viewer',
        desc: 'Read-only historical dossier',
        details: 'Displays full ticket details: Requester Profile, Assigned Staff, Job Description, End-User Service Feedback (1-5 star ratings for Quality, Efficiency, Timeliness), Receipt of Materials Used, and official Job Order document.'
      },
      {
        title: 'Document Bundler (.ZIP Export) Modal',
        desc: 'Bulk compliance export package',
        details: isSsu
          ? 'Packages official SSU Incident Report PDFs with safety notations plus an Incident Summary CSV catalog.'
          : 'Packages official Job Request Form PDFs plus a CSV index, or Material Issuance Slips plus an itemized Materials CSV summary for auditing.'
      }
    ],
    tabs: [
      { name: 'All Archives', badge: 'Permanent Ledger', desc: 'All closed, completed, and resolved tickets since inception.' }
    ],
    buttons: [
      {
        label: 'Export Archives (.ZIP)',
        type: 'primary',
        desc: 'Opens the Document Bundler export modal to download official archive packages for institutional audits.',
        result: 'Displays Document Bundler modal.'
      },
      {
        label: 'View Details',
        type: 'secondary',
        desc: 'Opens the read-only Archived Ticket Details modal to inspect job history, client star ratings, and material receipts.',
        result: 'Displays archived ticket particulars.'
      },
      {
        label: 'View / Print Receipt Slip',
        type: 'info',
        desc: 'Opens a printable copy of the Official Material Issuance Slip associated with the completed ticket.',
        result: 'Displays material receipt slip.'
      },
      {
        label: 'Filter',
        type: 'secondary',
        desc: 'Applies current search keyword, calendar year, and service category filters.',
        result: 'Refreshes archive query results.'
      }
    ],
    procedures: [
      {
        title: 'How to Search and Inspect Archived Records',
        steps: [
          'Enter the full Ticket ID (e.g., FGMU-TIC-42-2026) in the search bar, or select a specific calendar year from the dropdown.',
          'Click "Filter" to retrieve matching records.',
          'Click "View Details" on the row.',
          'Review the work description, assigned personnel, client ratings (Quality, Efficiency, Timeliness), and liquidated material receipts.'
        ]
      },
      {
        title: 'How to Export Yearly Audit Packages (.ZIP)',
        steps: [
          'Click "Export Archives (.ZIP)" in the header.',
          'Select the desired Archive Year (or All Years for complete history).',
          'Review summary cards for Total Tickets and Material Value.',
          'Click "Download Forms (.ZIP)" for Job Request Forms, or "Download Slips (.ZIP)" for Material Issuance Slips (or "Download Reports (.ZIP)" for SSU incidents).',
          'The browser downloads a structured ZIP package containing official PDFs and summary CSV spreadsheets.'
        ]
      }
    ],
    tourSteps: [
      { element: '#tour-main-workspace', title: `1. ${U} Historical Archives`, desc: 'Access archived records and historical work order data for past academic years.' },
      { element: 'select, input', title: '2. Period & Term Selectors', desc: 'Filter records by academic year, semester, or specific date ranges.' },
      { element: 'button', title: '3. Bulk Compliance Export', desc: 'Download official historical reports in PDF or spreadsheet formats for university audits.' }
    ]
  };
};

export const createUnitAdminSettingsGuide = (unitCode = 'fgmu') => {
  const u = unitCode.toLowerCase();
  const U = unitCode.toUpperCase();
  const isSsu = u === 'ssu';

  return {
    id: `admin-${u}-settings`,
    name: `${U} Admin Account & Operational Settings`,
    route: `/admin/${u}/settings`,
    icon: '⚙️',
    manualSection: `Section ${U === 'FGMU' ? 'C13' : U === 'LEAU' ? 'D13' : 'E9'}: Account Settings`,
    roleBadge: `${U} Administrator`,
    summary: `Manage your operational administrator profile, official email notifications (vital for immediate high-priority alerts), password security, and official digital approval signature applied automatically to generated Job Orders and Material Slips.`,
    sections: [
      {
        title: 'Unit Operations Profile Card',
        desc: 'Administrative credentials and contact info',
        details: 'Displays official administrator badge, avatar photo upload, First Name, Last Name, Name Extension, and official university unit email address.'
      },
      {
        title: 'Official Digital Signature Studio',
        desc: 'Automated job order approval signature',
        details: 'Signature rendered automatically above the Unit Head signature line on generated Job Orders (QM-GSO-01), Request Slips, and archives. Offers Draw Signature (Ink color and thickness) and Upload Image (Auto-Remove Background).'
      },
      {
        title: 'Email Notifications Toggle',
        desc: 'Transactional alert preferences',
        details: isSsu
          ? 'Crucial for campus security: when On, new incident reports trigger an immediate high-priority email alert to your address alongside dashboard notifications.'
          : 'When On, new service tickets and status changes trigger automated transactional email notifications. When Off, system updates remain dashboard-only.'
      },
      {
        title: 'Account Security & Password Update',
        desc: 'Credential management',
        details: 'Update account password with minimum 8 characters and alphanumeric verification. Leave blank to preserve current password.'
      },
      {
        title: 'Unit Jurisdiction Notice',
        desc: 'Role authorization boundaries',
        details: `Explains that your account permissions govern ticket dispatch, worker scheduling, job liquidation, and inventory management strictly within the ${U} operational branch.`
      }
    ],
    tabs: [
      { name: 'Profile & Credentials', badge: 'User Settings', desc: 'Administrator details, email notifications, and password security.' },
      { name: 'Digital Signature', badge: 'Document Authorization', desc: 'Draw or upload digital signature for automated job order rendering.' }
    ],
    buttons: [
      {
        label: 'Change Signature / Update Signature',
        type: 'primary',
        desc: 'Opens the Official Digital Signature Studio modal with Draw and Upload tabs.',
        result: 'Displays signature studio modal.'
      },
      {
        label: 'Save Changes / Save Profile Changes',
        type: 'success',
        desc: 'Commits profile details, email notification toggles, and password updates to the database.',
        result: 'Updates administrative account settings.'
      },
      {
        label: 'Email Notifications Toggle',
        type: 'info',
        desc: 'Switches between email+dashboard alerts and dashboard-only notifications.',
        result: 'Toggles automated email dispatch for ticket events.'
      },
      {
        label: 'Remove Signature',
        type: 'danger',
        desc: 'Deletes the current digital signature from the system.',
        result: 'Clears saved signature.'
      }
    ],
    procedures: [
      {
        title: 'How to Set Up or Update Your Official Digital Signature',
        steps: [
          'Navigate to Account Settings in the sidebar.',
          'Find the Official Digital Signature section and click "Change Signature" (or "Update").',
          'To draw your signature: click "Draw Signature", pick ink color (Black or Blue), choose thickness, and sign using your mouse, stylus, or touch screen.',
          'To upload a photo: click "Upload Image", sign on clean white paper, take a photo, and upload it (PNG/JPG up to 3MB; paper background is removed automatically).',
          'Click "Save Official Signature". The signature will now auto-render on all generated Job Orders.'
        ]
      },
      {
        title: 'How to Configure Email Alert Preferences',
        steps: [
          'Locate the "Email Notifications: Request & Ticket Updates" toggle.',
          'Toggle "On" to receive immediate email notifications whenever a new ticket is submitted or an incident report is filed.',
          'Click "Save Changes" at the bottom of the profile.'
        ]
      }
    ],
    tourSteps: [
      { element: '#tour-main-workspace', title: `1. ${U} Settings`, desc: 'Configure your unit profile, physical office details, and operational preferences.' },
      { element: 'form, .card', title: '2. Office Information', desc: 'Keep department building, room number, and phone extension accurate for client communications.' },
      { element: 'button, canvas', title: '3. Digital Signature Setup', desc: 'Upload or sign your digital administrative signature for official work order documents.' }
    ]
  };
};

// ─── MASTER CATALOG OF ALL ROLE-BASED PAGE GUIDES ─────────────────────────────────────

export const pageGuidesCatalog = {
  // ─── 1. REQUESTOR (Student & Employee Portal) ──────────────────────────
  requestor: {
    roleKey: 'requestor',
    roleLabel: 'Student & Employee Portal',
    roleIcon: '🎓',
    roleBadge: 'Requestor Access',
    roleSummary: 'Submit work orders, borrow university tools & plants, report campus security incidents, track ticket progress in real-time, and evaluate completed services.',
    pages: [
      {
        id: 'user-dashboard',
        name: 'Dashboard Overview',
        route: '/user/dashboard',
        icon: '🏠',
        manualSection: 'Section B1: Dashboard Overview',
        roleBadge: 'Requestor Portal',
        summary: 'Your central hub for tracking quick request updates, system alerts, ID verification status, and rapid navigation to the university services catalog.',
        sections: [
          {
            title: 'Institutional ID Verification Notice',
            desc: 'Registration approval status banner',
            details: 'If your uploaded student/employee ID is still under review by the Super Administrator, a "Verification Under Review" notice appears with status "Pending Approval". Submitting service tickets is locked until confirmed.'
          },
          {
            title: 'Quick Action Banner',
            desc: 'Direct link to services catalog',
            details: 'Contains the "New Service Request" button to launch the university services catalog. If your ID is pending, this button displays "Submissions Locked (ID Pending)" and is temporarily disabled.'
          },
          {
            title: 'Ticket Status Updates Feed',
            desc: 'Live activity stream of recent submissions',
            details: 'Displays ticket reference numbers (#SSU-TIC-1-2026, #FGMU-TIC-10-2026), service titles, current status badges (Pending Review, Queued for Dispatch, Under Investigation, Ready for Pickup), and submission timestamps.'
          },
          {
            title: 'Navigation Shortcuts',
            desc: 'Quick links to history and catalog',
            details: 'Click "View All" to jump straight into the full ticket tracking workspace.'
          }
        ],
        tabs: [
          { name: 'Recent Activity', badge: 'Live Feed', desc: 'Chronological overview of current active tickets and status changes.' }
        ],
        buttons: [
          {
            label: 'New Service Request',
            type: 'primary',
            desc: 'Launches the University Services Catalog to file a maintenance, borrowing, or incident report ticket.',
            result: 'Navigates to /services (locked if ID is unverified).'
          },
          {
            label: 'View All',
            type: 'secondary',
            desc: 'Navigates to the My Service Requests page to inspect full tracking timelines.',
            result: 'Navigates to /user/tickets.'
          }
        ],
        procedures: [
          {
            title: 'How to Check Your Account Verification Status',
            steps: [
              'Log in to the GSO Portal using your student or employee credentials.',
              'Look at the top of your Dashboard: if you see "Institutional ID Verification Under Review", your registration is queued for Superadmin approval.',
              'Once approved, the notice disappears and the "New Service Request" button becomes fully active.'
            ]
          }
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
        manualSection: 'Section B2: Submitting a Service Request (Step 1)',
        roleBadge: 'Requestor Portal',
        summary: 'Browse and select university maintenance, borrowing, and safety services. RSO and SSG student representatives see authorized student services, while faculty and staff access structural and facilities trades.',
        sections: [
          {
            title: 'Student Representative vs Faculty Mode Banner',
            desc: 'Role-based service entitlement indicator',
            details: 'RSO and SSG student officers see what their organization is authorized to request (Borrowing, Hauling, Stage Decoration, Incidents). Structural services are reserved for Faculty/Staff. Includes a "Show all services / Authorized only" toggle.'
          },
          {
            title: 'Category Filter Tabs',
            desc: 'Service classification filters',
            details: 'Tabs: All Services, Facilities & Repairs (FGMU), Grounds & Landscaping (LEAU), and Security & Incident (SSU).'
          },
          {
            title: 'Search Services Input',
            desc: 'Keyword discovery search bar',
            details: 'Type any problem keyword like "aircon", "pipe leak", "plants", "welding", or "security" to immediately find relevant services.'
          },
          {
            title: 'Grouped Service Catalog Grid',
            desc: 'Interactive service selection cards',
            details: 'Services grouped under Structure & Finishes, Utilities & Mechanical, Janitorial & Landscaping, and Security. Click one or more cards across categories to select them.'
          },
          {
            title: 'Selection Summary & Fill Out Form Bar',
            desc: 'Selected service counter and intake trigger',
            details: 'Bottom bar displays the number of chosen services and unlocks the "Fill Out Form" button once at least 1 service is selected.'
          }
        ],
        tabs: [
          { name: 'All Services', badge: 'Full Catalog', desc: 'Browse the entire university service offering.' },
          { name: 'Facilities & Repairs', badge: 'FGMU', desc: 'Electrical, plumbing, carpentry, welding, masonry, painting, and mechanical works.' },
          { name: 'Grounds & Landscaping', badge: 'LEAU', desc: 'Hauling, borrowing of plants, tools/equipment, stage decoration, and lawn care.' },
          { name: 'Security & Incident', badge: 'SSU', desc: 'Official incident report submission for campus security events.' }
        ],
        buttons: [
          {
            label: 'Fill Out Form',
            type: 'primary',
            desc: 'Proceeds to Step 2 (Service Intake Form) with your selected services loaded.',
            result: 'Opens the detailed intake form modal or standalone intake page.'
          },
          {
            label: 'Show all services / Authorized only',
            type: 'secondary',
            desc: 'For student representatives: toggles between authorized student services and full catalog (restricted items show "Faculty Only").',
            result: 'Toggles catalog display filter.'
          },
          {
            label: 'Service Cards',
            type: 'info',
            desc: 'Clicking any card selects or deselects it. Multiple services can be chosen simultaneously.',
            result: 'Updates selection counter.'
          }
        ],
        procedures: [
          {
            title: 'How to Select and Initiate a Service Request',
            steps: [
              'Click "New Service Request" from the dashboard or "Services Catalog" in the sidebar.',
              'Use the search bar or category tabs to find the needed service (e.g., Plumbing Works, Borrowing of Plants).',
              'Click on the service card(s) to select them. The bottom counter updates.',
              'Click "Fill Out Form" to proceed to Step 2.'
            ]
          }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. University Services Catalog', desc: 'Browse available campus maintenance, borrowing, and security services.' },
          { element: 'input[type="text"]', title: '2. Search Services', desc: 'Type any keyword like "aircon", "plumbing", "plants", or "security" to find the right service.' },
          { element: '.grid, .service-card', title: '3. Service Cards', desc: 'Review turnaround time benchmarks, requirements, and click to open the submission form.' }
        ]
      },
      {
        id: 'user-intake',
        name: 'Service Intake Form',
        route: '/services',
        icon: '📝',
        manualSection: 'Section B2: Submitting a Service Request (Step 2)',
        roleBadge: 'Requestor Portal',
        summary: 'Enter problem particulars, specify campus building and room locations, upload photos, specify borrowing schedules, or narrate security incident reports.',
        sections: [
          {
            title: 'Service Summary Header',
            desc: 'Confirmation of chosen services and handling unit',
            details: 'Confirms selected services and identifies which GSO sub-unit will handle the ticket (Facilities Management, Landscaping & Aesthetics, or Security Services).'
          },
          {
            title: 'Work Order Form Fields (Facilities & Grounds)',
            desc: 'Standard maintenance request fields',
            details: 'College/Building (required dropdown or custom input), Office/Room (required), Source of Fund (optional), Job Particulars (required, minimum 10 characters), and Supporting Photos/Docs (PNG, JPG, PDF, DOCX up to 10MB).'
          },
          {
            title: 'Borrowing Request Form Fields (Tools & Plants)',
            desc: 'Equipment loan specifications',
            details: 'Item/s Name (required), Quantity Needed (optional), Detailed Purpose (required, e.g., lab experiment, ceremony), Pickup Date (required), Expected Return Date (required), Acknowledgement & Terms Checkbox (required agreement to return in good condition).'
          },
          {
            title: 'Incident Report Form Fields (Security Services)',
            desc: 'Confidential campus incident form',
            details: 'Incident Type checkboxes (Theft, Altercations, Vandalism, Unauthorized Entry, Road Accident, Fire, Harassment, Substance Abuse, or custom Other), Person Involved (Who), Location (Where), Date & Time (When), Narrative Statement (How), and Auto-filled Reporter Profile.'
          }
        ],
        tabs: [
          { name: 'Intake Specifications', badge: 'Required Data', desc: 'Enter detailed specifications corresponding to your chosen service.' }
        ],
        buttons: [
          {
            label: 'Validate & Submit Request',
            type: 'primary',
            desc: 'Validates all required fields and officially sends the ticket to the appropriate unit admin queue.',
            result: 'Creates ticket, sends confirmation email, and routes to My Service Requests.'
          },
          {
            label: 'Back to Selection / Dashboard',
            type: 'secondary',
            desc: 'Cancels form entry and returns to the catalog selection screen.',
            result: 'Returns without creating a ticket.'
          }
        ],
        procedures: [
          {
            title: 'How to Submit a Facilities Work Order',
            steps: [
              'Confirm chosen services in the summary box.',
              'Select the College/Building and enter the specific Office/Room number.',
              'Type a detailed description of the problem (minimum 10 characters).',
              'Drag or upload clear photos of the issue (up to 10MB each).',
              'Click "Validate & Submit Request".'
            ]
          },
          {
            title: 'How to Submit a Tool or Plant Borrowing Request',
            steps: [
              'Enter the Item Name and Quantity Needed.',
              'Explain the Purpose of Use in detail (e.g., student organization exhibit).',
              'Pick the Date Needed (Pickup Date) and Expected Return Date.',
              'Tick the "Acknowledgement & Agreement" box accepting responsibility for care and return.',
              'Click "Validate & Submit Request".'
            ]
          },
          {
            title: 'How to Submit an Incident Report',
            steps: [
              'Check the appropriate Incident Type(s) or specify custom details.',
              'Enter the names of persons involved (Who) and exact campus location (Where).',
              'Select the incident Date and Time (When).',
              'Provide a chronological narrative account of what happened (How).',
              'Click "Validate & Submit Request".'
            ]
          }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Service Intake Form', desc: 'Provide complete details, exact campus rooms, and photos for university staff.' },
          { element: 'form', title: '2. Fill Required Information', desc: 'Ensure building, room, and problem description meet institutional requirements.' },
          { element: 'button', title: '3. Validate & Submit', desc: 'Click to transmit your request directly to the responsible sub-unit queue.' }
        ]
      },
      {
        id: 'user-tickets',
        name: 'My Service Requests',
        route: '/user/tickets',
        icon: '📋',
        manualSection: 'Section B3: My Service Requests',
        roleBadge: 'Requestor Portal',
        summary: 'Track live status timelines across all your submitted tickets, review scheduled worker visits and borrowing pickup dates, cancel pending requests if plans change, and evaluate accomplished jobs.',
        sections: [
          {
            title: 'Search & Status Queue Tabs',
            desc: 'Filtering your active ticket portfolio',
            details: 'Search by Ticket ID, service, or handling unit. Switch between All, Pending, In Progress, and Awaiting Rating tabs (each with live count badges).'
          },
          {
            title: 'Service Request Cards',
            desc: 'Comprehensive summary card for each ticket',
            details: 'Shows handling unit (FGMU, LEAU, SSU) with reference # (e.g., #FGMU-TIC-10-2026), service title, live status badge (Pending Approval, Queued for Dispatch, Under Investigation, Ready for Pickup, Awaiting Rating), progress indicator (e.g., 3/5, 6/6), submission date, and scheduled visit date.'
          },
          {
            title: 'Tracking Progress Timeline Modal',
            desc: 'Step-by-step lifecycle visualizer',
            details: 'Facilities flow: Digital Submission -> Ticket Creation -> Admin Approval -> Dispatch & Schedule -> Job Started -> Job Finished. Incident flow: Report Submission -> Staff Review -> Action/Investigation -> Resolution -> Archiving. Completed steps are checked, current step is highlighted, upcoming steps are greyed out.'
          },
          {
            title: 'Service Performance Evaluation Modal',
            desc: 'Rating and closing accomplished jobs',
            details: 'Activated when ticket reaches "Awaiting User Rating". Rate Quality, Efficiency, and Timeliness (1 to 5 stars), select Job Completion Status (Finished Early, On-Time, Beyond Time, Not Performed), add remarks, and click "Submit Evaluation & Close Ticket".'
          }
        ],
        tabs: [
          { name: 'All', badge: 'Active Portfolio', desc: 'All active submitted tickets across all units.' },
          { name: 'Pending', badge: 'Under Review', desc: 'Tickets awaiting administrative approval or Director review. Eligible for cancellation.' },
          { name: 'In Progress', badge: 'Scheduled & Active', desc: 'Tickets approved, scheduled for visit, or actively undergoing field repairs.' },
          { name: 'Awaiting Rating', badge: 'Action Required', desc: 'Finished jobs awaiting your evaluation rating to complete and archive.' }
        ],
        buttons: [
          {
            label: 'Track Progress',
            type: 'primary',
            desc: 'Opens the step-by-step progress timeline modal with live status indicators and technician schedules.',
            result: 'Displays interactive progress timeline.'
          },
          {
            label: 'Cancel Request',
            type: 'danger',
            desc: 'Safely cancels a ticket while still in Pending status. Disappears once ticket is approved.',
            result: 'Cancels ticket and archives with cancellation reason.'
          },
          {
            label: 'Close Evaluation / Rate Service',
            type: 'success',
            desc: 'Opens the Service Performance Evaluation modal to rate staff and close accomplished tickets.',
            result: 'Submits 1-5 star ratings and archives ticket.'
          },
          {
            label: '+ New Request',
            type: 'secondary',
            desc: 'Quick link to the Services Catalog to submit another ticket.',
            result: 'Navigates to /services.'
          },
          {
            label: 'Sync Status',
            type: 'info',
            desc: 'Refreshes ticket state in real time from the server.',
            result: 'Fetches latest status timeline updates.'
          }
        ],
        procedures: [
          {
            title: 'How to Track a Ticket\'s Progress',
            steps: [
              'Click "Track Progress" on any ticket card.',
              'Review the current step highlighted in green or blue (e.g., Dispatch & Schedule).',
              'Check scheduled implementation dates and assigned technician names.',
              'Click "View Digital Ticket" to review what you originally submitted, or "Sync Status" to refresh.'
            ]
          },
          {
            title: 'How to Cancel a Pending Request',
            steps: [
              'Locate the ticket in the "Pending" tab.',
              'Click "Cancel Request" (only available before admin approval).',
              'Confirm the cancellation prompt. The ticket is withdrawn immediately.'
            ]
          },
          {
            title: 'How to Rate and Close a Completed Work Order',
            steps: [
              'When the job is finished, the card enters the "Awaiting Rating" tab with an Action Required alert.',
              'Click "Close Evaluation" on the ticket card.',
              'Select the Job Completion Status (e.g., Completed On-Time).',
              'Rate Quality, Efficiency, and Timeliness from 1 to 5 stars, and enter optional feedback remarks.',
              'Click "Submit Evaluation & Close Ticket". The ticket moves to Completed Tickets.'
            ]
          }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. My Service Requests', desc: 'Review live ticket status timelines, scheduled worker visits, and borrowing pickup readiness.' },
          { element: 'input[type="text"]', title: '2. Quick Search', desc: 'Search your tickets by ticket ID number, building name, or problem description.' },
          { element: '.space-y-4, .ticket-card', title: '3. Ticket Details & Timeline', desc: 'Expand any ticket card to inspect assigned personnel, scheduled implementation dates, and notes.' }
        ]
      },
      {
        id: 'user-completed',
        name: 'Completed Tickets & History',
        route: '/user/completed-tickets',
        icon: '⭐',
        manualSection: 'Section B4: Completed Tickets',
        roleBadge: 'Requestor Portal',
        summary: 'Inspect finalized and closed tickets for institutional reference, download official completion records, and view past star ratings and technician sign-offs.',
        sections: [
          {
            title: 'Completed Tickets Search & Table',
            desc: 'Searchable historical archive ledger',
            details: 'Search by Ticket ID (e.g., FGMU-TIC-42). Displays Ticket ID, Service Name, Status (Closed), Completed Date, and Action buttons with pagination controls.'
          },
          {
            title: 'Completed Ticket Details Viewer',
            desc: 'Read-only archival dossier',
            details: 'Shows Status, Completed Date, Ticket ID, Requested By, Contact, Unit Assigned, Target Duration, Completion Date, Job Particulars, and Submitted Attachments download links.'
          },
          {
            title: 'Your Service Feedback Card',
            desc: 'Historical evaluation audit',
            details: 'Displays the 1 to 5 star scores you submitted for Quality, Efficiency, and Timeliness along with your written feedback remarks.'
          },
          {
            title: 'Finalized Progress Timeline',
            desc: 'Complete lifecycle verification',
            details: 'All steps verified from Digital Submission through Job Finished (marked COMPLETED), confirming the ticket is permanently finalized and archived.'
          }
        ],
        tabs: [
          { name: 'Completed Archive', badge: 'Permanent Records', desc: 'All finished and rated tickets stored for your institutional reference.' }
        ],
        buttons: [
          {
            label: 'View Details',
            type: 'primary',
            desc: 'Opens the full read-only Completed Ticket Details modal showing particulars, ratings, and attachments.',
            result: 'Displays completed ticket dossier.'
          },
          {
            label: 'Track Progress',
            type: 'secondary',
            desc: 'Reopens the finalized step-by-step timeline confirming all completed milestones.',
            result: 'Displays archived timeline modal.'
          },
          {
            label: 'Download Attachment',
            type: 'info',
            desc: 'Downloads user-uploaded photos or documents attached during request submission.',
            result: 'Downloads file to local computer.'
          }
        ],
        procedures: [
          {
            title: 'How to Review Completed Job Records',
            steps: [
              'Click "Completed Tickets" in the sidebar.',
              'Search by Ticket ID or browse using the Prev/Next page controls.',
              'Click "View Details" to review original scope, target duration vs completion date, and submitted feedback.',
              'Click "Track Progress" to inspect verified completion milestones.'
            ]
          }
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
        manualSection: 'Section B5: Account Settings',
        roleBadge: 'Requestor Portal',
        summary: 'Manage your contact information, profile avatar, email notification preferences for request updates, institutional affiliation, and password security.',
        sections: [
          {
            title: 'Requestor Profile & Status Banner',
            desc: 'Identity and active account status',
            details: 'Displays avatar photo upload and status tag (Active Account). Click the avatar to upload a profile photo.'
          },
          {
            title: 'Personal & Contact Information',
            desc: 'Name and email management',
            details: 'Update First Name, Last Name, and Email Address. Your email is used for login credentials and transactional service notifications.'
          },
          {
            title: 'Email Updates for My Requests Toggle',
            desc: 'Automated email alert preferences',
            details: 'Toggle On to receive status update emails (approved, dispatched, completed, declined). Toggle Off to only view updates on the web dashboard.'
          },
          {
            title: 'Faculty / Staff Classification Box',
            desc: 'Institutional authority verification',
            details: 'For faculty/staff: confirms your classification (e.g., Teaching Staff) and Academic College / Department, establishing your service request authorizations.'
          },
          {
            title: 'Password Security Update',
            desc: 'Alphanumeric credential reset',
            details: 'Enter New Password and Confirm New Password (minimum 8 characters). Leave blank to keep existing password unchanged.'
          }
        ],
        tabs: [
          { name: 'Profile & Security', badge: 'User Settings', desc: 'Personal details, email notifications, and password security.' }
        ],
        buttons: [
          {
            label: 'Save Profile Changes',
            type: 'primary',
            desc: 'Applies profile edits, contact updates, notification preferences, and new passwords.',
            result: 'Commits updates to user account.'
          },
          {
            label: 'Upload Avatar Photo',
            type: 'secondary',
            desc: 'Click on avatar thumbnail to upload a custom profile picture.',
            result: 'Updates profile image.'
          },
          {
            label: 'Email Updates Toggle',
            type: 'info',
            desc: 'Enables or disables transactional emails for ticket status changes.',
            result: 'Updates notification preferences.'
          }
        ],
        procedures: [
          {
            title: 'How to Update Contact Info and Email Alerts',
            steps: [
              'Click "Account Settings" in the sidebar.',
              'Update your First Name, Last Name, or Email Address.',
              'Set the "Email Updates for My Requests" toggle to On if you want email alerts whenever staff dispatch or finish your ticket.',
              'Click "Save Profile Changes".'
            ]
          },
          {
            title: 'How to Change Your Password',
            steps: [
              'Navigate to Account Settings.',
              'Scroll to New Password and enter at least 8 alphanumeric characters.',
              'Retype the password in Confirm New Password.',
              'Click "Save Profile Changes".'
            ]
          }
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
    pages: [] // Dynamically generated in useTutorial.js based on active unit
  },

  // ─── 3. SUPERADMINISTRATOR (System Governance) ───────────────────────────
  superadmin: {
    roleKey: 'superadmin',
    roleLabel: 'Super Administrator Console',
    roleIcon: '🛡️',
    roleBadge: 'System Governance',
    roleSummary: 'Root-level security administration, user account governance & RBAC, ID credential verification, business audit logging, privacy-protected account telemetry, disaster backup & restoration, and transactional email service pipelines.',
    pages: [
      {
        id: 'superadmin-users',
        name: 'User Accounts & RBAC Governance',
        route: '/superadmin/users',
        icon: '👥',
        manualSection: 'Section F1: User Accounts',
        roleBadge: 'Superadmin Console',
        summary: 'Comprehensive campus user directory. Provision internal GSO staff, manage Role-Based Access Control (RBAC), suspend compromised accounts, archive inactive users (180+ days), and inspect registration credentials.',
        sections: [
          {
            title: 'Campus User Directory Table',
            desc: 'Searchable master account ledger',
            details: 'Displays User Identity (name, email, ID number, phone), Role (with sub-tag, e.g., Personnel: Plumber), Unit Affiliation (FGMU, LEAU, SSU, Global), Verification Status, Account Status (Active, Suspended, Archived), Online/Offline session status, and total requests submitted.'
          },
          {
            title: 'Search & Role Tabs Filter',
            desc: 'Targeted user segmenting',
            details: 'Search by name, email, employee ID, or student ID. Filter by role tabs: All Roles, Personnel, Admins, Staff, Directors, Employees, Students, Superadmin. Additional dropdowns for Units and Statuses.'
          },
          {
            title: 'Provision Internal Account Modal',
            desc: 'Creating staff and administrative credentials',
            details: 'Creates internal accounts (Admin, Staff, Personnel, Director, Superadmin) with assigned unit affiliation, trade specialty, email, and initial password. Students and employees self-register.'
          },
          {
            title: 'Archive Inactive Users Tool',
            desc: 'Automated account hygiene',
            details: 'Identifies accounts with no logins or ticket submissions for 180+ days (6 months). Ends active sessions and disables portal access while preserving historical work logs and accountability records permanently.'
          }
        ],
        tabs: [
          { name: 'All Roles', badge: 'Master Directory', desc: 'All registered campus accounts.' },
          { name: 'Personnel', badge: 'Field Workers', desc: 'Technicians, plumbers, electricians, landscapers, security staff.' },
          { name: 'Admins', badge: 'Unit Heads', desc: 'FGMU, LEAU, and SSU unit administrators.' },
          { name: 'Directors', badge: 'Executive', desc: 'GSO Director and executive officers.' },
          { name: 'Employees', badge: 'Faculty & Staff', desc: 'University faculty and support staff requesters.' },
          { name: 'Students', badge: 'RSO / SSG', desc: 'Accredited student organization representatives.' },
          { name: 'Superadmin', badge: 'Root Security', desc: 'System governance master accounts.' }
        ],
        buttons: [
          {
            label: 'Provision User',
            type: 'primary',
            desc: 'Opens the Provision New Account modal to create an internal GSO staff, admin, director, or worker account.',
            result: 'Creates internal account with assigned unit and role.'
          },
          {
            label: 'Archive Inactive',
            type: 'warning',
            desc: 'Opens the Inactive Accounts modal to archive users with 180+ days of inactivity.',
            result: 'Disables inactive accounts while preserving audit records.'
          },
          {
            label: 'Suspend / Reactivate',
            type: 'danger',
            desc: 'Restricts user portal access immediately, or restores suspended/archived accounts.',
            result: 'Toggles user account status.'
          },
          {
            label: 'Edit',
            type: 'secondary',
            desc: 'Modifies user profile details, assigned unit, or role permissions.',
            result: 'Updates user account record.'
          }
        ],
        procedures: [
          {
            title: 'How to Provision an Internal GSO Staff Account',
            steps: [
              'Click "Provision User" in the top action bar.',
              'Enter First Name, Last Name, and institutional email address.',
              'Select the System Role (Admin, Staff, Personnel, Director, Superadmin).',
              'Select the Assigned Sub-Unit (Facilities, Landscaping, Security, or Global).',
              'For personnel: specify their trade specialty (e.g., Plumber, Electrician).',
              'Set initial password (min 8 characters) and click "Confirm & Create".'
            ]
          },
          {
            title: 'How to Archive Inactive Accounts',
            steps: [
              'Click "Archive Inactive" in the toolbar.',
              'Review the list of accounts with no activity for 180+ days.',
              'Click "Confirm Archival". Active sessions are terminated and access is disabled permanently without deleting historical ticket logs.'
            ]
          }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. User Governance & RBAC', desc: 'Manage university user accounts, role permissions, and account statuses.' },
          { element: 'table', title: '2. User Accounts Table', desc: 'Inspect user roles, unit affiliations, and verification statuses.' },
          { element: 'button', title: '3. Role Management', desc: 'Assign or update roles to enforce strict Role-Based Access Control.' }
        ]
      },
      {
        id: 'superadmin-queues',
        name: 'Identity Verification Queue',
        route: '/superadmin/queues',
        icon: '🛡️',
        manualSection: 'Section F2: User Queues',
        roleBadge: 'Superadmin Console',
        summary: 'Review and verify uploaded student and employee registration credentials (Front ID card and Selfie with ID) before unlocking service ticket submission privileges.',
        sections: [
          {
            title: 'Queue Summary & Pending Counter',
            desc: 'Live count of unverified registrations',
            details: 'Displays the number of self-registered accounts awaiting identity credential verification. Shows "Queue Clear" when all accounts are processed.'
          },
          {
            title: 'Registrant Cards Grid',
            desc: 'Itemized verification request cards',
            details: 'Displays user role badges (Student, RSO, Faculty, Staff), status "Awaiting Verification", full name, student ID (7 digits) or employee ID, organization/affiliation, academic college, email, phone, and uploaded ID thumbnail.'
          },
          {
            title: 'Verify Account Identity Inspection Modal',
            desc: 'High-resolution document inspector',
            details: 'Allows toggling between "1. Front ID Card" and "2. Selfie with ID". Provides "Open Full Size" zoom capabilities to verify sharp text, face legibility, and institutional enrollment.'
          }
        ],
        tabs: [
          { name: 'Pending Verification', badge: 'Queue', desc: 'Accounts awaiting Superadmin identity review.' }
        ],
        buttons: [
          {
            label: 'Inspect & Verify',
            type: 'primary',
            desc: 'Opens the full document inspection modal to examine both Front ID Card and Selfie with ID photos at high resolution.',
            result: 'Displays Verify Account Identity modal.'
          },
          {
            label: 'Approve & Verify Identity (Green Checkmark)',
            type: 'success',
            desc: 'Confirms identity, marks account as Verified, and unlocks full service ticket submission privileges.',
            result: 'Sends approval email and unlocks user ticket submission.'
          },
          {
            label: 'Reject / Invalidate (Red X)',
            type: 'danger',
            desc: 'Rejects registration credentials due to blurry photos, expired ID, or mismatch.',
            fields: 'Rejection Reason (feedback sent to user explaining how to re-upload).',
            result: 'Rejects account verification and notifies user.'
          }
        ],
        procedures: [
          {
            title: 'How to Review and Approve an Identity Verification',
            steps: [
              'Click "User Queues" in the Superadmin sidebar.',
              'Click "Inspect & Verify" on a pending registrant card.',
              'Review applicant details: student 7-digit ID or employee ID, RSO affiliation, and college.',
              'Inspect Photo 1 (Front ID Card) and Photo 2 (Selfie with ID) to verify face and text legibility.',
              'Click "Approve & Verify Identity". The user is instantly unlocked for service requests.'
            ]
          },
          {
            title: 'How to Reject Invalid Credentials',
            steps: [
              'In the inspection modal, if the photo is unreadable or forged, click "Reject/Invalidate".',
              'Provide clear feedback explaining the issue (e.g., "ID photo too blurry, please re-upload clear front image").',
              'Confirm rejection. The applicant receives an email explaining how to resubmit.'
            ]
          }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Identity Verification Queue', desc: 'Review uploaded student and employee credentials to safeguard university access.' },
          { element: 'input[type="text"]', title: '2. Search Registrants', desc: 'Search pending accounts by ID number, student name, or institutional email.' },
          { element: 'button', title: '3. Inspect & Verify', desc: 'Open the document viewer to examine credentials, then Approve or Reject with feedback.' }
        ]
      },
      {
        id: 'superadmin-audit',
        name: 'Business Audit Trail & Operations Log',
        route: '/superadmin/logs',
        icon: '📜',
        manualSection: 'Section F3: Business Audit Trail',
        roleBadge: 'Superadmin Console',
        summary: 'Immutable, chronological record of all ticket actions, dispatches, cancellations, material liquidations, and status changes across all GSO sub-units.',
        sections: [
          {
            title: 'Operations Audit Trail Explorer',
            desc: 'Immutable chronological event ledger',
            details: 'Live event counter (e.g., 55 Events). Displays exact Timestamp, Actor/Initiator (with role tags: UR for Requestor, FA for FGMU Admin, GD for Director, SA for SSU), Ticket Reference with location, Action Type, and Plain-Language Activity Details.'
          },
          {
            title: 'Action Type Classification',
            desc: 'Standardized operational event tags',
            details: 'Tracks Ticket Submitted, Status Changed, Worker Assigned, Job Started, Timeline Extended, Material Liquidated, Feedback Submitted, and Ticket Cancelled.'
          },
          {
            title: 'Compliance CSV Export',
            desc: 'Official audit trail download',
            details: 'Exports the full filtered business audit log to CSV format for university oversight, COA audits, and administrative reporting.'
          }
        ],
        tabs: [
          { name: 'Business Audit Trail', badge: 'Immutable Ledger', desc: 'All operational and ticket lifecycle transactions across the system.' }
        ],
        buttons: [
          {
            label: 'Export CSV',
            type: 'primary',
            desc: 'Downloads the entire business audit trail in CSV format.',
            result: 'Downloads audit log spreadsheet.'
          },
          {
            label: 'View Details (Eye Icon)',
            type: 'secondary',
            desc: 'Opens full detailed modal of a specific audit log entry including actor IP and metadata.',
            result: 'Displays audit entry particulars.'
          },
          {
            label: 'Refresh',
            type: 'secondary',
            desc: 'Reloads the latest event stream in real time.',
            result: 'Refreshes log data.'
          }
        ],
        procedures: [
          {
            title: 'How to Search and Audit Ticket Actions',
            steps: [
              'Navigate to "Business Audit Trail" in the sidebar.',
              'Type a ticket number (e.g., #FGMU-TIC-10-2026) or actor name in the search bar.',
              'Inspect the chronological stream showing who approved, dispatched, or completed the work.',
              'Click the View icon on any row to inspect underlying technical metadata.'
            ]
          }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. System Audit Logs', desc: 'Inspect immutable, timestamped records of all operational and administrative actions.' },
          { element: 'input, select', title: '2. Filter Events', desc: 'Filter logs by action type, severity, actor, or specific ticket number.' },
          { element: 'button', title: '3. Export Compliance Trail', desc: 'Export audit logs to spreadsheet or document formats for institutional compliance.' }
        ]
      },
      {
        id: 'superadmin-account-logs',
        name: 'Account Activity Audit Trail (RA 10173)',
        route: '/superadmin/account-logs',
        icon: '🔒',
        manualSection: 'Section F4: Account Activity Audit Trail',
        roleBadge: 'Superadmin Console',
        summary: 'Privacy-protected security telemetry covering authentication and account lifecycle events (logins, logouts, password changes, registrations) with masked PII and RA 10173 compliance.',
        sections: [
          {
            title: 'Data Privacy Act (RA 10173) Compliance Notice',
            desc: 'Statutory compliance banner',
            details: 'Explains that account telemetry is processed exclusively for system security, fraud mitigation, and user account integrity under legitimate institutional authority. Personal data (emails, IPs) is partially masked throughout.'
          },
          {
            title: 'Telemetry Security Ledger Table',
            desc: 'Authentication and credential event log',
            details: 'Displays exact Timestamp, Severity (Info, Warning, Error, Critical), Event Type (ACCOUNT_REGISTERED, AUTH_LOGIN_SUCCESS, AUTH_LOGOUT), Actor and Target Account (with masked email), and Client Context (Browser/OS and masked IP).'
          },
          {
            title: 'Account Activity Log Detail Viewer',
            desc: 'Deep security event inspection modal',
            details: 'Shows Event Reference #, full Timestamp, Severity, Device, Activity Narrative, masked Network IP (tagged Immutable Record), and Sanitized Telemetry Metadata in formatted JSON.'
          }
        ],
        tabs: [
          { name: 'Security Telemetry', badge: 'RA 10173 Compliant', desc: 'Authentication and session security event ledger.' }
        ],
        buttons: [
          {
            label: 'Export CSV',
            type: 'primary',
            desc: 'Exports the sanitized, privacy-compliant account activity log to CSV format.',
            result: 'Downloads security log spreadsheet.'
          },
          {
            label: 'View Event Details (Eye Icon)',
            type: 'secondary',
            desc: 'Opens the detail modal showing full event narrative, device context, and JSON telemetry metadata.',
            result: 'Displays security event dossier.'
          }
        ],
        procedures: [
          {
            title: 'How to Investigate Suspicious Authentication Attempts',
            steps: [
              'Click "Account Activity Audit" in the Superadmin sidebar.',
              'Filter by Severity dropdown to "Warning" or "Critical".',
              'Search for the user\'s masked email or ID number.',
              'Click the Eye Icon on the entry to review client browser, OS, and timestamp anomalies.'
            ]
          }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Privacy Telemetry Logs', desc: 'Monitor authentication, logins, and session lifecycles under Philippine RA 10173 guidelines.' }
        ]
      },
      {
        id: 'superadmin-backup',
        name: 'Database Backup & Recovery Console',
        route: '/superadmin/backups',
        icon: '💾',
        manualSection: 'Section F5: Backup & Recovery',
        roleBadge: 'Superadmin Console',
        summary: 'Comprehensive disaster recovery hub. Create immediate full database snapshots, configure automated Google Drive cloud backups, activate Maintenance Mode with user eviction countdown, and restore system state.',
        sections: [
          {
            title: 'Database Snapshot Operations Panel',
            desc: 'Disaster recovery action buttons',
            details: 'Buttons: Website in Maintenance (emergency mode), Drive Settings (Google Drive cloud setup), Upload Archive / Dump (restore from local file), Restore Latest Snapshot, and Create Backup Snapshot.'
          },
          {
            title: 'Backup Repository & Snapshot History Table',
            desc: 'Stored snapshot catalog',
            details: 'Lists saved snapshots with File Name, Tags (Latest, Full System, Manual), Size, Storage Location (Onsite Local vs Google Drive), Created Date, Initiator, and direct actions (Download, Restore, Delete).'
          },
          {
            title: 'Google Drive Cloud Setup Modal',
            desc: 'Automated off-site cloud storage',
            details: 'Supports Personal Drive (OAuth 2.0 with Client ID & Secret) and Workspace Shared Drive (Service Account JSON keys). Features "Test Now" connection verification.'
          },
          {
            title: 'Website Maintenance Mode & User Eviction',
            desc: 'Safe data migration lockdown',
            details: 'Locks the system before restores. Broadcasts emergency notices to logged-in users with an eviction countdown (15s, 30s, 60s, 120s), logs them out automatically, and blocks non-superadmin logins.'
          },
          {
            title: 'System State Restoration Dialog',
            desc: 'Fail-safe state recovery',
            details: 'Restores all database tables and uploaded files from Local Server or Google Drive. Requires explicit typed safety confirmation: typing "CONFIRM RESTORE".'
          }
        ],
        tabs: [
          { name: 'Snapshot Repository', badge: 'Active Backups', desc: 'Catalog of verified database and file dump snapshots.' },
          { name: 'Recovery Activity Logs', badge: 'Audit Trail', desc: 'History of backup creations, restorations, uploads, and deletions.' }
        ],
        buttons: [
          {
            label: 'Create Backup Snapshot',
            type: 'primary',
            desc: 'Opens Create Full System Snapshot modal. Creates full MySQL dump and uploaded media archive, sending a copy to Google Drive.',
            result: 'Generates new full system snapshot.'
          },
          {
            label: 'Restore Latest Snapshot / Restore',
            type: 'danger',
            desc: 'Restores the system database and files from selected snapshot. Requires typing "CONFIRM RESTORE".',
            result: 'Restores database state to the snapshot timestamp.'
          },
          {
            label: 'Website in Maintenance',
            type: 'warning',
            desc: 'Activates Maintenance Mode with eviction countdown (15s-120s) to safely isolate the system during restores.',
            result: 'Evicts active sessions and locks login for non-superadmins.'
          },
          {
            label: 'Drive Settings',
            type: 'info',
            desc: 'Opens Google Drive Cloud Setup to configure OAuth 2.0 or Service Account credentials.',
            result: 'Connects Google Drive cloud backup storage.'
          },
          {
            label: 'Upload Archive / Dump',
            type: 'secondary',
            desc: 'Uploads a .sql or .zip backup file from your local computer to restore database and files directly.',
            result: 'Applies uploaded archive to live database.'
          }
        ],
        procedures: [
          {
            title: 'How to Create a Full System Backup Snapshot',
            steps: [
              'Click "Create Backup Snapshot" in the operations banner.',
              'Optionally enter a descriptive note (e.g., "Regular pre-demo system backup").',
              'Click "Start Full Snapshot Now". The full MySQL database and uploads directory are archived and mirrored to Google Drive.'
            ]
          },
          {
            title: 'How to Restore the System Safely',
            steps: [
              'Click "Website in Maintenance" to notify and evict active campus users.',
              'Click "Restore" on the desired snapshot row (or "Restore Latest Snapshot").',
              'Select storage source (Local Server or Google Drive).',
              'Type "CONFIRM RESTORE" into the safety text field.',
              'Click the restore button. The system restores all tables and media.'
            ]
          }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Backup & Recovery Console', desc: 'Manage database snapshots and disaster recovery safeguards.' },
          { element: 'button', title: '2. Create Database Backup', desc: 'Trigger an immediate full SQL snapshot of the entire university database.' }
        ]
      },
      {
        id: 'superadmin-settings',
        name: 'Root Platform Settings & Email Pipeline',
        route: '/superadmin/settings',
        icon: '⚙️',
        manualSection: 'Section F6: Account Settings & Email Service',
        roleBadge: 'Superadmin Console',
        summary: 'Root administrator profile management, system-wide Resend transactional email pipeline integration, API credentials, sender domain configuration, and test email verification.',
        sections: [
          {
            title: 'Root Administrator Profile Card',
            desc: 'Master security credentials',
            details: 'Role badge (Root Superadmin) and Root Level Authority tag. Update name, email address, password, and superadmin email notifications.'
          },
          {
            title: 'Email Service Integration (Resend API)',
            desc: 'System-wide transactional email delivery engine',
            details: 'Connected & Operational status indicator. Configures the delivery pipeline for password recovery, requestor ticket updates, and SSU incident alerts.'
          },
          {
            title: 'Resend Configuration Controls',
            desc: 'API keys and sender address',
            details: 'Resend API Key (partially masked, starts with re_), Sender Email Address (e.g., GSO E-Ticketing <onboarding@hywb.online> or notifications@bsu.edu.ph), and "Enable Transactional Emails" system-wide toggle.'
          },
          {
            title: 'Resend Delivery Guidelines & Domain Verification',
            desc: 'Trial mode vs production deployment rules',
            details: 'Explains that in Trial Mode, emails only send to the registered Resend account; for Production Deployment, the university campus domain (bsu.edu.ph) must be verified in the Resend Domains console.'
          }
        ],
        tabs: [
          { name: 'Root Profile', badge: 'Superadmin', desc: 'Personal credentials and security settings.' },
          { name: 'Email Pipeline', badge: 'Resend API', desc: 'Transactional mail delivery settings and API keys.' }
        ],
        buttons: [
          {
            label: 'Send Test Email',
            type: 'primary',
            desc: 'Sends an immediate test email to verify that the Resend API pipeline and credentials are functioning.',
            result: 'Dispatches test email and displays delivery outcome.'
          },
          {
            label: 'Save Resend Settings',
            type: 'success',
            desc: 'Saves updated Resend API key, sender address, and transactional email toggle state.',
            result: 'Applies new email service configuration.'
          },
          {
            label: 'Save Profile Changes',
            type: 'secondary',
            desc: 'Saves updates to the root administrator name, email, and password.',
            result: 'Updates root administrator credentials.'
          }
        ],
        procedures: [
          {
            title: 'How to Configure and Test the Email Delivery Pipeline',
            steps: [
              'Navigate to Superadmin Settings.',
              'Paste your valid Resend API key (beginning with re_) in the Resend API Key field.',
              'Set the Sender Email Address (From) using your verified campus domain.',
              'Ensure "Enable Transactional Emails" toggle is switched On.',
              'Click "Save Resend Settings".',
              'Click "Send Test Email" to confirm instantaneous delivery to your inbox.'
            ]
          }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Platform Configuration', desc: 'Manage email pipelines, API credentials, and global system parameters.' }
        ]
      }
    ]
  },

  // ─── 4. EXECUTIVE DIRECTOR (Institutional Governance) ───────────────────
  director: {
    roleKey: 'director',
    roleLabel: 'Executive Director Console',
    roleIcon: '🏛️',
    roleBadge: 'Executive Director',
    roleSummary: 'Institutional SLA analytics, multi-unit oversight (FGMU, LEAU, SSU), emergency escalations, holiday calendar, and financial material reports.',
    pages: [
      {
        id: 'director-dashboard',
        name: 'Executive Overview & Reports',
        route: '/director/dashboard',
        icon: '📊',
        manualSection: 'Section G1: Executive Overview',
        roleBadge: 'Director Console',
        summary: 'Institutional multi-unit performance console. Monitor throughput across FGMU, LEAU, and SSU, review top service categories, track SLA completion health, audit client star ratings, and export formal executive reports.',
        sections: [
          {
            title: 'Unit Ticket Overview Cards',
            desc: 'Direct jump links to unit queues',
            details: 'Cards for FGMU Ticket Overview, LEAU Ticket Overview, and SSU Incident Reports Overview. Clicking "Open Queues" navigates directly to that unit\'s live queue.'
          },
          {
            title: 'Performance by Sub-Unit Table',
            desc: 'Comparative throughput and ratings ledger',
            details: 'Breaks down Requests, Resolved, Declined, and Rating averages for FGMU, LEAU, and SSU, with a GSO Overall row totaling performance across all units.'
          },
          {
            title: 'Top Service Categories Breakdown',
            desc: 'Most requested campus trades',
            details: 'Tabs for All Units, FGMU, LEAU, and SSU. Itemizes top service categories with request counts and percentage distribution (e.g., Carpentry 20%, Plant Borrowing 36.7%, Incidents 100%).'
          },
          {
            title: 'Service Completion Rate & Ratings',
            desc: 'Turnaround health breakdown',
            details: 'Visualizes counts and percentages of jobs completed Early, On-Time, Overdue, or Incomplete, alongside average client scores for Quality, Efficiency, and Timeliness.'
          }
        ],
        tabs: [
          { name: 'All-Time', badge: 'Historical', desc: 'Consolidated performance across all past years.' },
          { name: 'Annual', badge: 'Yearly', desc: 'Metrics for the current calendar academic year.' },
          { name: 'Quarterly', badge: 'Quarter', desc: 'Q1, Q2, Q3, or Q4 institutional reporting.' },
          { name: 'Monthly', badge: 'Month', desc: 'Current month\'s operational throughput.' }
        ],
        buttons: [
          {
            label: 'Generate & Download Report',
            type: 'primary',
            desc: 'Exports executive performance analytics and throughput summaries into official downloadable reports.',
            result: 'Downloads executive summary report.'
          },
          {
            label: 'Open Queues / Ticket Overview',
            type: 'info',
            desc: 'Navigates directly to the live queue overview for FGMU, LEAU, or SSU.',
            result: 'Opens specific unit queue.'
          }
        ],
        procedures: [
          {
            title: 'How to Audit Cross-Unit SLA Performance',
            steps: [
              'Review the Performance by Sub-Unit table to compare throughput and ratings between FGMU, LEAU, and SSU.',
              'Inspect Service Completion Rate to identify overdue or halted jobs.',
              'Select a specific Year and Month from the period dropdowns to examine historical trends.',
              'Click "Generate & Download Report" to produce an official executive report for the University President and Regents.'
            ]
          }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Executive Director Dashboard', desc: 'Monitor institutional SLA performance, turnaround metrics, and cross-unit throughput.' },
          { element: '.grid', title: '2. Institutional SLA Gauges', desc: 'Real-time performance tracking for all university maintenance and security operations.' },
          { element: '#tour-profile-menu', title: '3. Acting Unit Head Delegation', desc: 'Assume direct management over any unit whenever a department head is absent.' }
        ]
      },
      {
        id: 'director-my-requests',
        name: 'Director Self-Service Requests',
        route: '/director/my-requests',
        icon: '📋',
        manualSection: 'Section G2: My Service Requests',
        roleBadge: 'Director Console',
        summary: 'Submit and track service requests initiated by the Executive Director. Follow live progress timelines, cancel pending tickets, and evaluate completed work.',
        sections: [
          {
            title: 'Director Self-Service Request Manager',
            desc: 'Personal requests submitted by the Director',
            details: 'Filter tickets by All Requests, Pending, In Progress, Awaiting Rating, and Completed. Each card displays handling unit, reference #, status badge, and dates.'
          },
          {
            title: 'Progress Timeline & Rating',
            desc: 'Step-by-step verification and rating',
            details: 'Click "View Progress" to inspect live timelines. When finished, rate Quality, Efficiency, and Timeliness to close the ticket.'
          }
        ],
        tabs: [
          { name: 'All Requests', badge: 'Total', desc: 'All tickets submitted by the Director.' },
          { name: 'Pending', badge: 'Under Review', desc: 'Newly submitted tickets.' },
          { name: 'In Progress', badge: 'Active', desc: 'Scheduled or ongoing work.' },
          { name: 'Completed', badge: 'Archived', desc: 'Rated and archived tickets.' }
        ],
        buttons: [
          {
            label: 'Request Service',
            type: 'primary',
            desc: 'Opens the Service Catalog selection screen to submit a new work order.',
            result: 'Navigates to /services with role set as DIRECTOR.'
          },
          {
            label: 'View Progress',
            type: 'info',
            desc: 'Opens the step-by-step progress timeline modal.',
            result: 'Displays ticket progress timeline.'
          },
          {
            label: 'Close Evaluation',
            type: 'success',
            desc: 'Opens the evaluation modal to rate completed services.',
            result: 'Submits 1-5 star ratings and closes ticket.'
          }
        ],
        procedures: [
          {
            title: 'How the Director Submits and Tracks a Request',
            steps: [
              'Click "Request Service" at the top right.',
              'Choose the required service from the catalog and fill in room particulars.',
              'Click "Validate & Submit Request".',
              'Track the ticket timeline via "View Progress" and submit star evaluations once finished.'
            ]
          }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Director Service Requests', desc: 'Manage service requests initiated by the Executive Director.' }
        ]
      },
      {
        id: 'director-materials',
        name: 'Material Logs and Cost Reports',
        route: '/director/materials',
        icon: '📑',
        manualSection: 'Section G3: Material Logs and Report',
        roleBadge: 'Director Console',
        summary: 'Consolidated university-wide financial and material consumption report. Audit supplies and tools consumed across FGMU and LEAU work orders, review itemized costs, and export official materials reports.',
        sections: [
          {
            title: 'Summary Metric Cards',
            desc: 'High-level financial and volume indicators',
            details: 'Total Cost of Materials (combined peso value across all units), Materials Recorded (count of entries), Total Items Used (quantities consumed), FGMU Facilities cost & item count, and LEAU Landscaping cost & item count.'
          },
          {
            title: 'Sub-Unit Filter & Search Toolbar',
            desc: 'Material ledger filters',
            details: 'Filter by All Sub-Units, Facilities (FGMU), or Environment (LEAU). Search by material name, ticket reference, or handling unit.'
          },
          {
            title: 'Itemized Materials Ledger Table',
            desc: 'Detailed parts and supplies audit table',
            details: 'Displays Material/Supply Name (with service used for), Measurement Unit (Pcs, Lengths, Kg, etc.), Qty Used, Price Per Unit, Total Cost (₱), Unit (FGMU/LEAU), Ticket Ref #, and Date Used. A Total row at the bottom sums quantity and cost.'
          }
        ],
        tabs: [
          { name: 'All Sub-Units', badge: 'University-Wide', desc: 'Combined material expenditures across all GSO operations.' },
          { name: 'Facilities (FGMU)', badge: 'Maintenance', desc: 'Materials consumed in electrical, plumbing, carpentry, and masonry jobs.' },
          { name: 'Environment (LEAU)', badge: 'Landscaping', desc: 'Materials consumed in nursery care, planting, and grounds keeping.' }
        ],
        buttons: [
          {
            label: 'Export Materials PDF',
            type: 'primary',
            desc: 'Generates and downloads an official, audit-ready PDF summary of materials consumed across the selected period.',
            result: 'Downloads official materials utilization PDF report.'
          },
          {
            label: 'Period Toggles (Monthly, Quarterly, Annual, All-Time)',
            type: 'secondary',
            desc: 'Switches reporting timeframe for material consumption calculations.',
            result: 'Recalculates expenditure figures.'
          }
        ],
        procedures: [
          {
            title: 'How to Audit Materials Consumed by Sub-Units',
            steps: [
              'Navigate to "Material Logs and Report" in the Director sidebar.',
              'Review summary cards for Total Cost of Materials and unit breakdowns.',
              'Filter by "Facilities (FGMU)" or "Environment (LEAU)" to isolate department expenditures.',
              'Click "Export Materials PDF" to download the formal report for institutional procurement and auditing.'
            ]
          }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Material Requisitions & Costs', desc: 'Audit materials consumed by all units and monitor departmental operational expenses.' },
          { element: 'button', title: '2. Export Materials PDF', desc: 'Generate and download official materials consumption PDF reports for institutional auditing.' }
        ]
      },
      {
        id: 'director-holidays',
        name: 'Special Non-Working Holidays Registry',
        route: '/director/holidays',
        icon: '📅',
        manualSection: 'Section G4: Special Non-Working Holidays',
        roleBadge: 'Director Console',
        summary: 'Calibrate official non-working holidays and executive suspensions that are automatically bypassed during ticket working duration and deadline calculations.',
        sections: [
          {
            title: 'Holiday Registry Table',
            desc: 'Registered institutional and national holidays',
            details: 'Displays holiday date, title/name, classification (National, Local, Institutional, Suspension), recurrence rule, proclamation notes, and active status.'
          },
          {
            title: 'Register Special Holiday Form',
            desc: 'Add executive suspensions or holidays',
            details: 'Add one-time suspensions (e.g., typhoon suspension) or annual recurring holidays with official proclamation reference.'
          },
          {
            title: 'Working Duration Simulator',
            desc: 'Interactive verification calculator',
            details: 'Proves that registered holiday dates and weekends are completely discounted from ticket target turnaround calculations.'
          }
        ],
        tabs: [
          { name: 'Holiday Calendar', badge: 'Exclusions', desc: 'Official non-working dates discounted from ticket SLA durations.' }
        ],
        buttons: [
          {
            label: '+ Register Special Holiday',
            type: 'primary',
            desc: 'Registers a new national holiday, local suspension, or university non-working day in the database.',
            result: 'Adds holiday to calendar calculations.'
          },
          {
            label: 'Delete / Deactivate',
            type: 'danger',
            desc: 'Deactivates a holiday entry if an official suspension is lifted.',
            result: 'Restores working day status.'
          }
        ],
        procedures: [
          {
            title: 'How to Register a Campus Suspension or Holiday',
            steps: [
              'Click "+ Register Special Holiday".',
              'Select the holiday date and enter the official Proclamation Name (e.g., Typhoon Executive Suspension).',
              'Specify whether it is a one-time event or annual recurring holiday.',
              'Click "Save Holiday". All active and scheduled ticket deadlines automatically recalculate to exclude this date.'
            ]
          }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Special Non-Working Holidays', desc: 'Configure official non-working dates automatically excluded from ticket working duration calculations.' },
          { element: 'button', title: '2. Add Special Holiday', desc: 'Register a national holiday, local suspension, or university non-working day.' }
        ]
      },
      {
        id: 'director-fgmu',
        name: 'FGMU Ticket Overview & Escalations',
        route: '/director/fgmu/queues',
        icon: '🛠️',
        manualSection: 'Section G5: FGMU Ticket Overview',
        roleBadge: 'Director Console',
        summary: 'Review and manage tickets handled by FGMU. Sub-unit admins escalate heavy requests (major structural repairs or high-cost equipment) for executive Director approval.',
        sections: [
          {
            title: 'Stage 1 - Escalated Approval Tab',
            desc: 'Heavy requests awaiting executive clearance',
            details: 'Displays tickets escalated by the FGMU Head with Director Review tags. Clicking View Details reveals the justification, who escalated it, and date.'
          },
          {
            title: 'Approval Delayed Tab',
            desc: 'Tickets held under Director review',
            details: 'Lists tickets delayed by the Director (tagged Flagged by GSO Director) with delay reasons and notes.'
          },
          {
            title: 'Stage 2 - Approved (Ready)',
            desc: 'Tickets cleared for worker assignment',
            details: 'Read-only view of tickets approved by the Director or unit, awaiting FGMU Admin worker assignment.'
          },
          {
            title: 'Stage 3 - Scheduled',
            desc: 'Dispatched jobs awaiting implementation date',
            details: 'View assigned personnel, scheduled work dates, and official Job Order document.'
          },
          {
            title: 'Stage 4 - Borrowing',
            desc: 'Equipment loan requests',
            details: 'Filter by All Active, Pending Pickups, and Awaiting Return.'
          },
          {
            title: 'Stage 5 - In Progress',
            desc: 'Active jobs with live elapsed working hours',
            details: 'Monitor active execution and grant timeline extensions if unforeseen delays occur.'
          }
        ],
        tabs: [
          { name: 'Escalated Approval', badge: 'Action Required', desc: 'Heavy requests sent by FGMU Head requiring executive budget or structural approval.' },
          { name: 'Approval Delayed', badge: 'Held by Director', desc: 'Tickets delayed by Director pending ocular inspections or budget.' },
          { name: 'Approved (Ready)', badge: 'Awaiting Workers', desc: 'Approved tickets ready for FGMU staff assignment.' },
          { name: 'Scheduled', badge: 'Upcoming', desc: 'Tickets scheduled with assigned workers.' },
          { name: 'Borrowing', badge: 'Equipment Loans', desc: 'Tools and equipment borrowing requests.' },
          { name: 'In Progress', badge: 'Active Site Work', desc: 'Jobs actively being serviced on campus.' }
        ],
        buttons: [
          {
            label: 'Approve / Approve Request',
            type: 'success',
            desc: 'Grants executive approval for escalated requests (option to check Emergency Request).',
            result: 'Clears ticket and routes it back to the FGMU Admin for worker assignment.'
          },
          {
            label: 'Return to Unit / Return Request to Unit Head',
            type: 'info',
            desc: 'Returns ticket to FGMU Head with executive instructions when the project can proceed at the unit level.',
            fields: 'Notes / Instructions for Unit Head.',
            result: 'Returns ticket to the FGMU Admin pending approvals queue.'
          },
          {
            label: 'Delay',
            type: 'warning',
            desc: 'Delays approval while awaiting materials, budget, or ocular assessment.',
            fields: 'Reason for Delay dropdown and optional notes.',
            result: 'Moves ticket to Approval Delayed tab.'
          },
          {
            label: 'Decline Request',
            type: 'danger',
            desc: 'Formally rejects an ineligible or unfeasible service request.',
            fields: 'Decline Reason.',
            result: 'Declines ticket and notifies requester.'
          },
          {
            label: 'Extend / Grant Extension (In Progress)',
            type: 'warning',
            desc: 'Grants justified timeline extension (+1, +2, +3, +5 days) for active jobs experiencing site obstacles.',
            result: 'Updates target completion date.'
          }
        ],
        procedures: [
          {
            title: 'How the Director Approves an Escalated Project',
            steps: [
              'Click the "Escalated Approval" tab in the FGMU Overview.',
              'Click "View Details" to review the FGMU Head\'s justification and attached scope photos.',
              'Click "Approve Request" (mark Emergency if priority preemption is needed).',
              'Click "Confirm Approval". The ticket transitions to Approved (Ready) for FGMU staff assignment.'
            ]
          },
          {
            title: 'How to Return a Request to the Unit Head',
            steps: [
              'Inside Full Info, click "Return to Unit".',
              'Add instructions (e.g., "Approved to proceed at unit level using current supplies").',
              'Click "Confirm Return to Unit".'
            ]
          }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. FGMU Executive Overview', desc: 'Review major campus facilities projects requiring executive authorization.' },
          { element: 'button', title: '2. Executive Authorization', desc: 'Authorize high-budget repairs or return tickets with specific budget directives.' }
        ]
      },
      {
        id: 'director-leau',
        name: 'LEAU Ticket Overview & Plant Approvals',
        route: '/director/leau/queues',
        icon: '🌿',
        manualSection: 'Section G6: LEAU Ticket Overview',
        roleBadge: 'Director Console',
        summary: 'Review and manage tickets handled by LEAU. Authorize large-scale environmental projects, major campus tree trimming, and bulk plant loans for university ceremonies.',
        sections: [
          {
            title: 'Stage 1 - Escalated Approval Tab',
            desc: 'Major landscaping and bulk plant loan escalations',
            details: 'Examine justification notes, plant quantities requested, event venues, and attached documents.'
          },
          {
            title: 'Approval Delayed Tab',
            desc: 'Delayed environmental projects',
            details: 'Delayed tickets held pending vehicle/equipment inspections or bulk procurement cycles.'
          },
          {
            title: 'Stages 2 through 5 (Ready, Scheduled, Borrowing, In Progress)',
            desc: 'Full operational visibility',
            details: 'Inspect approved plant loans, scheduled lawn mowing, and active groundskeeping dispatches.'
          }
        ],
        tabs: [
          { name: 'Escalated Approval', badge: 'Action Required', desc: 'Major landscaping and ceremonial plant requests sent to the Director.' },
          { name: 'Approval Delayed', badge: 'Held', desc: 'Tickets delayed pending inspection or materials.' },
          { name: 'Approved (Ready)', badge: 'Awaiting Staff', desc: 'Approved tickets ready for LEAU staff assignment.' },
          { name: 'Scheduled', badge: 'Upcoming', desc: 'Scheduled grounds visits.' },
          { name: 'Borrowing', badge: 'Plant Loans', desc: 'Nursery plant loans for ceremonies and exhibits.' },
          { name: 'In Progress', badge: 'Active Site Work', desc: 'Ongoing grounds and beautification work.' }
        ],
        buttons: [
          {
            label: 'Approve / Approve Request',
            type: 'success',
            desc: 'Authorizes major landscaping work or bulk plant loans.',
            result: 'Clears ticket for LEAU dispatch.'
          },
          {
            label: 'Return to Unit',
            type: 'info',
            desc: 'Returns request to LEAU Head with directives.',
            result: 'Returns ticket to LEAU queue.'
          },
          {
            label: 'Delay',
            type: 'warning',
            desc: 'Holds approval for parts or equipment inspection.',
            result: 'Moves to Approval Delayed.'
          },
          {
            label: 'Decline Request',
            type: 'danger',
            desc: 'Declines request with required reason.',
            result: 'Declines ticket.'
          }
        ],
        procedures: [
          {
            title: 'How to Authorize Major Plant Loans for Ceremonies',
            steps: [
              'Click the "Escalated Approval" tab in the LEAU Overview.',
              'Click "View Details" to check requested plant quantities, venue, and return dates.',
              'Click "Approve Request" and confirm. The ticket moves to Approved (Ready) for nursery staff to reserve inventory.'
            ]
          }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Landscape & Plant Authorizations', desc: 'Review large-scale plant loan requests and campus beautification projects.' },
          { element: 'button', title: '2. Authorize Plant Loans', desc: 'Approve plant allocations for official university events.' }
        ]
      },
      {
        id: 'director-ssu',
        name: 'SSU Reports Overview (Read-Only)',
        route: '/director/ssu/queues',
        icon: '🛡️',
        manualSection: 'Section G7: SSU Reports Overview',
        roleBadge: 'Director Console',
        summary: 'Confidential campus safety and security oversight. Review new incident reports and active investigations handled by the SSU. (Note: SSU handles incidents directly; the Director has read-only oversight).',
        sections: [
          {
            title: 'Submitted Reports Tab (Read-Only)',
            desc: 'New incident reports filed on campus',
            details: 'Displays Ticket Ref and Reporter Profile with status "Pending Review". Clicking Full Info reveals Reporter details, Incident Classification, Particulars (who, where, when), and Narrative Statement.'
          },
          {
            title: 'Under Investigation Tab (Read-Only)',
            desc: 'Cases actively being investigated by SSU',
            details: 'Displays ongoing cases with the Staff Recommendation / Notation recorded by SSU officers. Clicking Full Info reveals the full investigation dossier.'
          }
        ],
        tabs: [
          { name: 'Submitted Reports', badge: 'New Incidents', desc: 'Incident reports newly filed, awaiting SSU investigation.' },
          { name: 'Under Investigation', badge: 'Active Cases', desc: 'Cases currently being investigated by SSU security officers.' }
        ],
        buttons: [
          {
            label: 'Full Info',
            type: 'secondary',
            desc: 'Opens the Security Incident Report modal in read-only mode to examine witness statements and officer recommendations.',
            result: 'Displays incident report dossier.'
          }
        ],
        procedures: [
          {
            title: 'How the Director Reviews Campus Security Cases',
            steps: [
              'Navigate to "SSU Reports Overview" in the Director sidebar.',
              'Switch between "Submitted Reports" and "Under Investigation" tabs.',
              'Click "Full Info" on any report to inspect witness statements, photos, and staff notations.',
              'Review SSU findings for executive reporting or referral to university legal counsel.'
            ]
          }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Security Incident Log', desc: 'Monitor campus safety reports, investigation findings, and incident severity.' }
        ]
      },
      {
        id: 'director-settings',
        name: 'Director Settings & Acting Unit Head Coverage',
        route: '/director/settings',
        icon: '⚙️',
        manualSection: 'Section G11: Director Account Settings',
        roleBadge: 'Director Console',
        summary: 'Manage executive profile, official digital directorate signature, email alert toggles across all three units, and the Sub-Unit Head Coverage Switcher to temporarily take charge of FGMU, LEAU, or SSU.',
        sections: [
          {
            title: 'Executive Profile Card',
            desc: 'Directorate credentials',
            details: 'Executive Director badge and GSO Director Portal badge. Manage name, university director email address, and password security.'
          },
          {
            title: 'Official Executive Signature Studio',
            desc: 'Directorate approval signee on Job Orders',
            details: 'Auto-rendered above the GSO Director signature line on official Job Orders (QM-GSO-01). Features Draw Signature and Upload Image with background removal.'
          },
          {
            title: 'Sub-Unit Head Coverage & Switcher (Acting Head Mode)',
            desc: 'Assuming temporary unit administration',
            details: 'Displays cards for FGMU, LEAU, and SSU showing the assigned head, email, and session status (In Session or Offline/Away). Clicking "Take Charge of [Unit]" temporarily activates Acting Unit Head Mode to manage that unit\'s queues while the head is on leave.'
          },
          {
            title: 'Tri-Unit Email Alerts Toggle',
            desc: 'Directorate notifications',
            details: 'When On, receives notifications for new requests and SSU incidents across all three sub-units. When Off, alerts are muted to the dashboard.'
          }
        ],
        tabs: [
          { name: 'Executive Profile', badge: 'Directorate', desc: 'Personal details and credentials.' },
          { name: 'Executive Signature', badge: 'Official Signee', desc: 'Draw or upload official directorate approval signature.' },
          { name: 'Acting Unit Head Coverage', badge: 'Emergency Delegation', desc: 'Take charge of FGMU, LEAU, or SSU dashboards when unit heads are away.' }
        ],
        buttons: [
          {
            label: 'Take Charge of FGMU / LEAU / SSU',
            type: 'warning',
            desc: 'Activates Acting Unit Head Mode for the selected sub-unit, granting direct operational queue control.',
            result: 'Switches session to Acting Unit Head for that department.'
          },
          {
            label: 'Change Signature / Update Signature',
            type: 'primary',
            desc: 'Opens the Official Digital Signature Studio to sign or upload the directorate approval signature.',
            result: 'Displays signature studio modal.'
          },
          {
            label: 'Save Changes',
            type: 'success',
            desc: 'Saves updates to the executive profile, email alert preferences, and password.',
            result: 'Updates director profile settings.'
          }
        ],
        procedures: [
          {
            title: 'How the Director Assumes Acting Head Mode for a Sub-Unit',
            steps: [
              'Navigate to Director Settings.',
              'Scroll down to the "Sub-Unit Head Coverage & Switcher" section.',
              'Check the unit cards to see which unit head is Offline / Away.',
              'Click "Take Charge of FGMU" (or LEAU / SSU).',
              'You are switched to that unit\'s operational dashboard with full dispatch and approval authority until the head returns.'
            ]
          },
          {
            title: 'How to Set Up the Executive Approval Signature',
            steps: [
              'Click "Change Signature" in the Official Executive Signature card.',
              'Draw your signature or upload a clean photo of your signature.',
              'Click "Save Official Signature". The signature will automatically appear on all university Job Order forms.'
            ]
          }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Director Settings', desc: 'Configure executive profile details and digital administrative signatures.' },
          { element: 'button', title: '2. Sub-Unit Coverage', desc: 'Assume direct management over any unit whenever a department head is absent.' }
        ]
      }
    ]
  },

  // ─── 5. FIELD WORKER / TECHNICIAN (Responding Personnel) ─────────────────
  worker: {
    roleKey: 'worker',
    roleLabel: 'Responding Field Personnel',
    roleIcon: '👷',
    roleBadge: 'Field Staff',
    roleSummary: 'Mobile-friendly technician console to inspect assigned work orders, check campus room locations, view dispatcher instructions, and track completed job history.',
    pages: [
      {
        id: 'worker-dashboard',
        name: 'My Assigned Work Orders',
        route: '/personnel/dashboard',
        icon: '📲',
        manualSection: 'Section H1: Assigned Work Orders',
        roleBadge: 'Field Personnel',
        summary: 'Your daily field console. Inspect repair tasks assigned to you by unit admins, check exact building rooms, read dispatcher instructions, and view co-workers assigned to joint crews.',
        sections: [
          {
            title: 'Technician Banner & Workload Counters',
            desc: 'Personal duty indicators',
            details: 'Displays your name, trade role (e.g., Plumber, Electrician), unit affiliation, and counts for Assigned Jobs and Emergency Jobs.'
          },
          {
            title: 'Search & Status Queue Tabs',
            desc: 'Work order filtering',
            details: 'Search by ticket ID, service, location, or crew member. Tabs: Active Jobs, Emergency / Urgent, and All Work Orders (with live counts).'
          },
          {
            title: 'Assigned Work Orders Queue Table',
            desc: 'Daily task assignments',
            details: 'Displays Ticket Ref (tagged Urgent where applicable), Requester / Client, Location (building and room), Task / Service, Schedule & Team (date and Solo vs Crew badge), Status (Job Started, In Progress), and Full Info button.'
          },
          {
            title: 'Task Details Full Info Modal',
            desc: 'Comprehensive work order briefing',
            details: 'Shows Request Description, Work Location, Schedule & Estimated Duration (e.g., 5 days), Requesting Client contact number, Dispatcher Instructions & Task Notes, and Full Assigned Team (with a "You" tag on your own card).'
          }
        ],
        tabs: [
          { name: 'Active Jobs', badge: 'Incomplete', desc: 'Work orders currently scheduled or actively undergoing field repairs.' },
          { name: 'Emergency / Urgent', badge: 'Priority', desc: 'Urgent repairs requiring immediate site response.' },
          { name: 'All Work Orders', badge: 'Full Ledger', desc: 'Every job assigned to you, including completed records.' }
        ],
        buttons: [
          {
            label: 'Full Info',
            type: 'primary',
            desc: 'Opens the task details modal showing complete problem particulars, room location, client contact, and dispatcher notes.',
            result: 'Displays task briefing modal.'
          },
          {
            label: 'Refresh',
            type: 'secondary',
            desc: 'Reloads your assigned jobs list to reflect new dispatches.',
            result: 'Refreshes task queue.'
          }
        ],
        procedures: [
          {
            title: 'How to Inspect Today\'s Assigned Jobs',
            steps: [
              'Log in to the Personnel Portal on your phone or tablet.',
              'Review the banner to see how many total jobs and emergency jobs are assigned to you today.',
              'Click "Full Info" on a job card to check the room location and client contact number before heading out.',
              'Read the Dispatcher Instructions & Task Notes for specific precautions or required tools.'
            ]
          }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Technician Field Console', desc: 'Manage today\'s assigned repair tasks, on-site locations, and job details.' },
          { element: '.card, .space-y-4', title: '2. Today\'s Work Orders', desc: 'Check room location, problem description, and client contact details before heading out.' },
          { element: 'button', title: '3. Task Instructions', desc: 'Read dispatcher notes and coordinate with your assigned crew members.' }
        ]
      },
      {
        id: 'worker-history',
        name: 'Completed Jobs History',
        route: '/personnel/history',
        icon: '📜',
        manualSection: 'Section H2: Completed Jobs History',
        roleBadge: 'Field Personnel',
        summary: 'Review your historical accomplishments, completed work order records, actual working durations, and responding crew members.',
        sections: [
          {
            title: 'Accomplishment Ledger Banner',
            desc: 'Total completed job counter',
            details: 'Displays your Total Completed jobs count across all past university assignments.'
          },
          {
            title: 'Search & Period Filters',
            desc: 'Lookup finished work',
            details: 'Search by ticket ID, service, location, or requester. Filter by All Years, All Units, and All Crews.'
          },
          {
            title: 'Archived Work Orders Table',
            desc: 'Itemized completion ledger',
            details: 'Displays Ticket ID (with unit tag), Service, Requester, Location, Status (Completed), Completed Date, and View Details action.'
          },
          {
            title: 'Completed Job Details Modal',
            desc: 'Historical task record',
            details: 'Shows Request Description, Work Location, Completed On date, Working Duration, Client info, Dispatcher Notes, and the full Responding Team Crew.'
          }
        ],
        tabs: [
          { name: 'Completed History', badge: 'Accomplishments', desc: 'All past jobs successfully finished and signed off.' }
        ],
        buttons: [
          {
            label: 'View Details',
            type: 'primary',
            desc: 'Opens the completed job modal to review past work records and crew members.',
            result: 'Displays completed job dossier.'
          }
        ],
        procedures: [
          {
            title: 'How to Review Past Accomplished Work',
            steps: [
              'Click "Completed Jobs History" in the sidebar.',
              'Browse through your completed jobs list or search by building/service.',
              'Click "View Details" to inspect the completion date and actual working duration.'
            ]
          }
        ],
        tourSteps: [
          { element: '#tour-main-workspace', title: '1. Accomplishment History', desc: 'Review past completed work orders, turnaround metrics, and client satisfaction ratings.' }
        ]
      }
    ]
  }
};
