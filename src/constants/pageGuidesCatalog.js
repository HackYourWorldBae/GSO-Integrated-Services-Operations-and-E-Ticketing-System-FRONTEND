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
    summary: `Overview of ${unitName} daily operations. View total requests, completed work, live ticket numbers, and staff ratings.`,
    sections: [
      {
        title: 'Request Counts',
        desc: 'Unresolved, resolved, declined, and total requests',
        details: 'Shows how many requests are pending, completed, or declined for the selected timeframe. Filterable by All Time, Annual, Quarterly, Monthly, or Daily.'
      },
      {
        title: '7-Day Activity Tracker',
        desc: 'Daily workload for the past week',
        details: 'Shows requests received vs. work completed each day for the last seven days. The current day is marked as TODAY. Click any day to filter the dashboard to that date.'
      },
      {
        title: 'Live Workload Status',
        desc: 'Current ticket stages at a glance',
        details: isSsu
          ? 'Tracks security incident reports across two stages: Awaiting Review and Under Investigation.'
          : 'Tracks tickets in the pipeline: Pending Approval, Dispatched, and Work in Progress.'
      },
      ...(isSsu
        ? [
            {
              title: 'Incident Heatmap',
              desc: 'Campus safety reports by category',
              details: 'Donut chart showing incident types (Theft, Vandalism, Altercations, Bullying, etc.) to spot recurring security concerns.'
            }
          ]
        : [
            {
              title: 'Evaluation Averages',
              desc: 'Client satisfaction ratings',
              details: 'Shows average scores out of 5 for Quality, Efficiency, and Timeliness from requesters who rated completed work.'
            },
            {
              title: 'Job Completion Health',
              desc: 'Job completion breakdown',
              details: 'Shows percentages for four outcomes: Early, On-Time, Beyond Time (Delayed), and Not Completed (Halted).'
            },
            {
              title: 'Delay & Barrier Reasons',
              desc: 'Why work is delayed or incomplete',
              details: `Groups obstacles into three lists: Delayed Work (reasons jobs ran late), Barriers (why work wasn't finished), and Approval Delays (pre-work holds such as ${isLeau ? 'Equipment Inspection' : 'Awaiting Procurement'}).`
            }
          ])
    ],
    tabs: [
      { name: 'All Time', badge: 'Historical', desc: 'All past years combined.' },
      { name: 'Annually', badge: 'Current Year', desc: 'Metrics for the current academic year.' },
      { name: 'Quarterly', badge: 'Quarter', desc: 'Q1, Q2, Q3, or Q4 reporting.' },
      { name: 'Monthly', badge: 'Month', desc: 'Current month activity.' },
      { name: 'Daily', badge: 'Day Focus', desc: 'Today or a specific day from the tracker.' }
    ],
    buttons: [
      {
        label: '+ Request / Request Service',
        type: 'primary',
        desc: 'Open the service catalog to submit a new internal work order.',
        result: 'Opens the service selection screen.'
      },
      {
        label: 'Time Period Filter',
        type: 'secondary',
        desc: 'Change the analytics view between All Time, Annual, Quarterly, Monthly, or Daily.',
        result: 'Recalculates the KPI numbers and charts.'
      },
      {
        label: '7-Day Tracker Day Cards',
        type: 'info',
        desc: 'Click any day card in the weekly tracker to filter the dashboard to that date.',
        result: 'Applies the selected date filter.'
      }
    ],
    procedures: [
      {
        title: 'How to Check Your Unit Workload',
        steps: [
          'Log in to the GSO Portal with your unit admin account.',
          'Check the Request Counts at the top for today’s pending and completed items.',
          'Look at the Live Workload Status to see if tickets are waiting in Pending Approval or Active Dispatch.',
          'Review the Job Completion Health and Delay & Barrier Reasons cards to spot recurring problems.'
        ]
      },
      {
        title: 'How to Submit an Internal Work Order',
        steps: [
          'Click the "+ Request" button at the top.',
          'Search the service catalog for the facilities, landscaping, or security service you need.',
          'Select the service, click "Fill Out Form", enter building and room details, attach photos if needed, and click "Validate & Submit Request".'
        ]
      }
    ],
    tourSteps: [
      { element: '#tour-page-header', title: `1. ${U} Dashboard Overview`, desc: `Your ${unitName} home screen. See key metrics and take quick actions.` },
      { element: '[data-tour="admin-timeframe-tabs"]', title: '2. Time Period Filter', desc: 'Switch the analytics view: All Time, Annual, Quarterly, Monthly, or Daily.' },
      { element: '[data-tour="admin-kpi-gauges"]', title: '3. Key Numbers', desc: 'See unresolved, resolved, declined, and total request counts at a glance.' },
      { element: '[data-tour="admin-daily-tracker"]', title: '4. 7-Day Activity Tracker', desc: 'Review daily requests vs. completed work for the past week.' },
      { element: '[data-tour="admin-workload-status"]', title: '5. Live Workload Status', desc: 'Check pending approvals, dispatched, scheduled, and active jobs.' },
      { element: '[data-tour="admin-eval-averages"]', title: '6. Evaluation Averages', desc: 'View client ratings for quality, efficiency, and timeliness.' },
      { element: '[data-tour="admin-completion-health"]', title: '7. Job Completion Health', desc: 'See on-time, early, delayed, and halted job breakdown.' },
      { element: '[data-tour="admin-root-cause"]', title: '8. Delay & Barrier Reasons', desc: 'Review top factors causing delays or incomplete work.' },
      { element: '#tour-sidebar-nav', title: '9. Menu & Navigation', desc: 'Use the sidebar to switch between Dashboard, Queues, Approved, Dispatched, Active, Personnel, Inventory, Materials, Archives, and Settings.' },
      { element: '#tour-notifications-btn', title: '10. Notifications', desc: 'Click the bell to see new alerts when tickets are assigned or updated.' }
    ]
  };
};

export const createUnitAdminMyRequestsGuide = (unitCode = 'fgmu') => {
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
    id: `admin-${u}-my-requests`,
    name: `${U} My Service Requests`,
    route: `/admin/${u}/my-requests`,
    icon: '📋',
    manualSection: `Section ${U === 'FGMU' ? 'C2' : U === 'LEAU' ? 'D2' : 'E2'}: My Service Requests (Admin Self-Service)`,
    roleBadge: `${U} Administrator`,
    summary: `Track the service requests you submitted as a ${U} administrator, follow their progress, and rate completed work.`,
    sections: [
      {
        title: 'Status Filter Tabs',
        desc: 'Personal request tracker',
        details: 'Filter your submitted requests by All Requests, Pending, In Progress, Awaiting Rating, and Completed. Each tab shows a live count of matching tickets.'
      },
      {
        title: 'Request Service Button',
        desc: 'Submit a new internal work order',
        details: `Opens the service catalog so you can submit a request as a ${U} administrator, using the same flow as a regular requestor.`
      },
      {
        title: 'Ticket Cards',
        desc: 'Your submitted requests',
        details: 'Each card shows the handling unit, ticket reference number, service name, status badge, submission date, location, and assigned personnel. Use the actions to view progress, cancel a pending request, or rate completed work.'
      },
      {
        title: 'Progress Timeline & Evaluation',
        desc: 'Track and close your tickets',
        details: 'Click "View Progress" to inspect the step-by-step timeline and request details. When the job is complete, rate Quality, Efficiency, and Timeliness to close and archive the ticket.'
      }
    ],
    tabs: [
      { name: 'All Requests', badge: 'Total', desc: 'Every ticket you submitted, regardless of status.' },
      { name: 'Pending', badge: 'Under Review', desc: `Requests still waiting for ${U} action.` },
      { name: 'In Progress', badge: 'Active', desc: 'Approved, dispatched, or ongoing work.' },
      { name: 'Awaiting Rating', badge: 'Action Required', desc: 'Completed jobs waiting for your evaluation.' },
      { name: 'Completed', badge: 'Archived', desc: 'Rated and closed requests.' }
    ],
    buttons: [
      {
        label: 'Request Service',
        type: 'primary',
        desc: 'Opens the service catalog to submit a new work order.',
        result: 'Navigates to /services so you can choose a service and fill out the intake form.'
      },
      {
        label: 'View Progress',
        type: 'info',
        desc: 'Opens the progress timeline and request information modal.',
        result: 'Displays the ticket timeline, request details, and attached documents.'
      },
      {
        label: 'Rate Service & Close',
        type: 'success',
        desc: 'Expands the evaluation form for a completed ticket.',
        result: 'Submits your quality, efficiency, and timeliness ratings and closes the ticket.'
      },
      {
        label: 'Cancel Request',
        type: 'danger',
        desc: 'Cancels a request that is still pending.',
        result: 'Asks for a cancellation reason and marks the ticket as cancelled.'
      }
    ],
    procedures: [
      {
        title: 'How to Track a Request You Submitted',
        steps: [
          'Open My Service Requests from the sidebar under Service Request.',
          'Use the status tabs to filter All Requests, Pending, In Progress, Awaiting Rating, or Completed.',
          'Click "View Progress" on a ticket card to open its timeline, request details, and attachments.',
          'Once the job is completed, click "Rate Service & Close", answer the evaluation, and submit to archive the ticket.'
        ]
      },
      {
        title: 'How to Submit a New Request as an Admin',
        steps: [
          `Click "Request Service" at the top of the ${U} My Service Requests page.`,
          'Search or browse the service catalog, select one or more services, and click "Fill Out Form".',
          'Enter the college/building, office/room, and job particulars, then attach optional photos or documents.',
          'Click "Validate & Submit Request" and return to My Service Requests to track the new ticket.'
        ]
      }
    ],
    tourSteps: [
      { element: '#tour-page-header', title: `1. ${U} My Service Requests`, desc: `View and track the service requests you submitted as a ${U} administrator.` },
      { element: '[data-tour="myrequests-status-tabs"]', title: '2. Filter by Status', desc: 'Switch between All Requests, Pending, In Progress, Awaiting Rating, and Completed.' },
      { element: '[data-tour="myrequests-btn-new-request"]', title: '3. Request Service', desc: 'Submit a new service request from the services catalog.' },
      { element: '[data-tour="myrequests-ticket-card"]', title: '4. Ticket Cards', desc: 'Click "View Progress" on any ticket to see its timeline and rate completed work.' }
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
      summary: 'Review new campus incident reports from students and staff. Check details and photos, then start an investigation or take action.',
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
        { element: '[data-tour="admin-page-header"]', title: '1. Submitted Incidents Queue', desc: 'Review newly submitted campus security reports awaiting administrative assessment.' },
        { element: '[data-tour="ssu-search-input"]', title: '2. Search & Filter Reports', desc: 'Quickly locate reports by ticket ID, reporter name, contact number, or incident location.' },
        { element: '[data-tour="ssu-btn-investigate"], [data-tour="ssu-btn-notation"]', title: '3. Investigation & Notation Controls', desc: 'Launch an active investigation, record official security notations, or dismiss invalid reports.' },
        { element: '[data-tour="ssu-btn-fullinfo"]', title: '4. Full Incident Particulars & Evidence', desc: 'Examine detailed witness testimonies, campus location, and attached photographic evidence.' }
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
    summary: `Review new service requests for ${U}. Check photos and details, then approve, decline, delay, or forward them to the Director.`,
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
        label: 'Request Director Approval',
        type: 'info',
        desc: 'Submits the request to the GSO Director for executive clearance. For FGMU, all requests are reviewed by the unit admin and submitted for Director approval. For LEAU, routine requests can be approved directly while complex requests are submitted for Director approval.',
        fields: 'Select Justification Preset + Detailed Recommendation / Justification Notes.',
        result: 'Sends ticket directly to the Director\'s Approval tab.'
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
        title: 'How to Approve a Ticket for Dispatch (or Request Director Approval)',
        steps: [
          'Locate the ticket in the Pending Approval queue and click "View Details" to inspect the scope of work.',
          'Verify that campus location and problem particulars are clearly defined.',
          'For FGMU: Click "Request Director Approval" to forward the reviewed ticket to the Director.',
          'For LEAU: Click "Approve Request" for routine local approval, or "Request Director Approval" if executive clearance is required.',
          'Check "Mark as Emergency Request" if this is an urgent safety or infrastructure hazard.',
          'Confirm submission. The ticket transitions accordingly.'
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
        title: 'How to Request Director Approval',
        steps: [
          'Open the ticket\'s Full Info modal and click "Request Director Approval" (or row button).',
          'Select a Justification Preset (e.g., "Reviewed and recommended for Director approval" or "Heavy structural repairs").',
          'Enter detailed recommendation or justification notes.',
          'Click "Submit to Director". The ticket is routed to the Director Console for final executive approval.'
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
      { element: '[data-tour="admin-page-header"]', title: '1. Pending Approvals Queue', desc: `Review newly submitted ${U} service tickets awaiting administrative verification.` },
      { element: '[data-tour="director-tab-pending"]', title: '2. Pending Queue Tab', desc: 'View newly submitted requests awaiting administrative review and verification.' },
      { element: '[data-tour="director-subtab-job"], [data-tour="director-subtab-borrowing"]', title: '3. Job vs Borrowing Sub-tabs', desc: 'Switch between Job Requests and Borrowing Requests within the Pending queue.' },
      { element: '[data-tour="director-search-input"]', title: '4. Search & Scope Filtering', desc: 'Filter requests by ticket ID, requester name, building, room, or issue description.' },
      { element: '[data-tour="director-btn-fullinfo"]', title: '5. Full Scope & Photos Inspection', desc: 'Click "View Details" / "Full Info" to inspect problem particulars, client contacts, and uploaded photos before deciding.' },
      { element: '[data-tour="director-btn-approve"], [data-tour="director-btn-delay"], [data-tour="director-btn-decline"]', title: '6. Decision Controls', desc: 'Approve to proceed to dispatch, Delay with justification, or Decline invalid requests.' },
      { element: '[data-tour="director-tab-delayed"]', title: '7. Approval Delayed Tab', desc: 'View tickets on hold for procurement, budget clearance, or inspection until explicitly approved or declined.' }
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
    summary: `View approved requests waiting for staff assignment, item reservation, or assistance from other units.`,
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
        name: 'Job Requests',
        badge: 'Work Orders',
        desc: 'Approved work orders originating from university requestors for your unit.',
        criteria: 'Holds tickets with status "Awaiting Dispatch".'
      },
      {
        name: 'Borrowing',
        badge: 'Inventory Allocation',
        desc: 'Approved borrowing requests (tools, equipment, or plants) awaiting item assignment and pickup prep.',
        criteria: 'Holds approved borrowing tickets awaiting inventory assignment.'
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
          'Switch to the "Borrowing" tab on the Approved Tickets page to locate the approved borrowing ticket.',
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
      { element: '#tour-page-header', title: `1. ${U} Approved Tickets`, desc: 'View approved tickets awaiting field dispatch or inventory reservation.' },
      { element: '[data-tour="approved-tab-job"]', title: '2. Job Requests Tab', desc: 'View approved work orders awaiting worker assignment.' },
      { element: '[data-tour="approved-tab-borrowing"]', title: '3. Borrowing Requests Tab', desc: 'View approved borrowing requests (tools, equipment, plants) awaiting inventory assignment.' },
      { element: '[data-tour="approved-tab-collab"]', title: '4. Collab Requests Tab', desc: 'View incoming cross-unit collaboration requests where your unit\'s manpower is requested.' },
      { element: '[data-tour="approved-urgency-filters"]', title: '5. Filter by Urgency', desc: 'Filter tickets by All, Emergency, or Standard priority.' },
      { element: '[data-tour="approved-search-input"]', title: '6. Search Approved Tickets', desc: 'Search by ticket ID, requester, service, or campus location.' },
      { element: '[data-tour="approved-btn-fullinfo"]', title: '7. View Full Info', desc: 'Click "Full Info" on a ticket row to inspect complete details, attachments, and scope of work.' },
      { element: '[data-tour="approved-btn-assign"]', title: '8. Assign Workers or Inventory', desc: 'Click "Assign Workers" for job requests or "Assign Inventory" for borrowing requests to proceed to dispatch.' }
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
    summary: `Assign workers, set start dates and deadlines, list materials needed, and reserve tools or plants.`,
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
      { element: '#tour-page-header', title: `1. ${U} Dispatch Workspace`, desc: 'Allocate personnel, set implementation dates, and launch field work orders.' },
      { element: '[data-tour="dispatch-queue-select"]', title: '2. Select Approved Ticket', desc: 'Choose an approved ticket from the queue to begin scheduling and crew allocation.' },
      { element: '[data-tour="dispatch-schedule-controls"]', title: '3. Schedule & Working Days', desc: 'Select implementation start date and target working days. Weekends and official holidays are excluded automatically.' },
      { element: '[data-tour="dispatch-materials"]', title: '4. Material Estimation', desc: 'Pre-assess consumable materials and benchmark prices required for the job.' },
      { element: '[data-tour="dispatch-staff-roster"]', title: '5. Assign Technicians', desc: 'Select qualified personnel based on trade specialty and active availability.' },
      { element: '[data-tour="dispatch-btn-confirm"]', title: '6. Confirm & Launch Dispatch', desc: 'Click Confirm Dispatch to transition the work order into Scheduled status.' }
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
    summary: `Track scheduled jobs, print job order slips with signatures, mark when work begins, and release borrowed items.`,
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
      { element: '#tour-page-header', title: `1. ${U} Scheduled Jobs`, desc: 'Manage work orders scheduled for site execution by assigned technicians.' },
      { element: '[data-tour="scheduled-tab-jobs"]', title: '2. Job Schedules Tab', desc: 'View technician work orders waiting to start on site.' },
      { element: '[data-tour="scheduled-tab-borrowing"]', title: '3. Borrowing Requests Tab', desc: 'View approved borrowing reservations ready for item pickup.' },
      { element: '[data-tour="scheduled-tab-collab"]', title: '4. Collab Tickets Tab', desc: 'View cross-unit scheduled work orders coordinated with counterpart departments.' },
      { element: '[data-tour="scheduled-urgency-filters"]', title: '5. Filter by Urgency', desc: 'Filter tickets by All, Emergency, or Standard priority.' },
      { element: '[data-tour="scheduled-search-input"]', title: '6. Search Scheduled Tickets', desc: 'Search work orders by ticket ID, assigned technician name, or campus venue.' },
      { element: '[data-tour="scheduled-btn-joborder"]', title: '7. Job Order / Print', desc: 'Open the official Job Order slip with digital signatures for field technicians.' },
      { element: '[data-tour="scheduled-btn-reschedule"], [data-tour="scheduled-btn-start"]', title: '8. Reschedule or Start Early', desc: 'Adjust the implementation date, or mark the job as In-Progress ahead of schedule.' }
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
      summary: 'Track ongoing security cases, write case notes, send security personnel if needed, and close solved incidents.',
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
        { element: '[data-tour="admin-page-header"]', title: '1. Active Investigations Queue', desc: 'Monitor and manage ongoing campus security investigations in real time.' },
        { element: '[data-tour="ssu-search-input"]', title: '2. Search Active Cases', desc: 'Search investigation cases by ticket ID, reporter, incident summary, or room.' },
        { element: '[data-tour="ssu-btn-notation"]', title: '3. Add Investigation Findings', desc: 'Record formal security notations, evidence summaries, and administrative recommendations.' },
        { element: '[data-tour="ssu-btn-resolve"]', title: '4. Mark as Resolved', desc: 'Conclude the investigation, notify the reporter, and archive the completed safety report.' }
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
    summary: `Track ongoing repairs, extend deadlines if delayed, record materials used, and check returned borrowed items.`,
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
      { element: '#tour-page-header', title: `1. ${U} Active Dispatches`, desc: 'Monitor active operations in real time as technicians execute work on site.' },
      { element: '[data-tour="active-tab-jobs"]', title: '2. In Progress Tab', desc: 'View maintenance work orders currently being executed on campus by field technicians.' },
      { element: '[data-tour="active-tab-borrowed"]', title: '3. Borrowed Requests Tab', desc: 'View tools, equipment, and plants currently checked out by borrowers awaiting physical return.' },
      { element: '[data-tour="active-tab-collab"]', title: '4. Collab Active Tab', desc: 'View active collaborative tickets involving joint manpower across units.' },
      { element: '[data-tour="active-tab-rating"]', title: '5. Awaiting Requestor Rating Tab', desc: 'View tickets marked completed, waiting for end-user 1-5 star rating.' },
      { element: '[data-tour="active-urgency-filters"]', title: '6. Filter by Urgency', desc: 'Filter active tickets by All, Emergency, or Standard priority.' },
      { element: '[data-tour="active-search-input"]', title: '7. Search Active Work Orders', desc: 'Search active jobs by ticket number, requester, location, or assigned technician.' },
      { element: '[data-tour="active-btn-extend"]', title: '8. Timeline Extension Controls', desc: 'Grant additional working days for unforeseen repair complications.' },
      { element: '[data-tour="active-btn-materials"]', title: '9. Liquidate Consumed Materials', desc: 'Record actual consumables and materials utilized on site for institutional auditing.' },
      { element: '[data-tour="active-btn-complete"]', title: '10. Mark Completed & Sign Off', desc: 'Sign off on finished repairs to close the ticket and trigger client rating evaluation.' }
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
    summary: `View and manage your unit staff, check who is available or on leave, add new workers, and assign trade skills.`,
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
      { element: '#tour-page-header', title: `1. ${U} Personnel Roster`, desc: 'Manage your unit technicians, duty schedules, and field specializations.' },
      { element: '[data-tour="personnel-search-input"]', title: '2. Search Personnel', desc: 'Quickly find technicians by name, employee ID number, or assigned specialty.' },
      { element: '[data-tour="personnel-btn-categories"]', title: '3. Filter by Specialty', desc: 'Filter your roster by trade category: Carpentry, Electrical, Plumbing, Welding, Masonry, etc.' },
      { element: '[data-tour="personnel-btn-add"]', title: '4. Register New Technician', desc: 'Add newly hired personnel to the roster with duty role and contact information.' },
      { element: '[data-tour="personnel-cards-grid"]', title: '5. Staff Roster & Duty Status', desc: 'Inspect active workloads, assigned work orders, and toggle staff availability.' }
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
    summary: `Manage tools, equipment, and plants. Check stock quantities, add items, update conditions, and handle loans.`,
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
      { element: '[data-tour="admin-page-header"]', title: `1. ${U} Inventory Workspace`, desc: 'Oversee equipment, appliances, and materials available for university operations and borrowing.' },
      { element: '[data-tour="inventory-status-tabs"]', title: '2. Stock Status Tabs', desc: 'Filter inventory by All, Available on shelf, Currently Borrowed, or Under Repair.' },
      { element: '[data-tour="inventory-search-input"]', title: '3. Search Items', desc: 'Locate equipment or plants by item name, model code, or serial barcode.' },
      { element: '[data-tour="inventory-btn-add"]', title: '4. Register New Inventory Item', desc: 'Add newly acquired tools, nursery plants, or machinery to the institutional database.' },
      { element: '[data-tour="inventory-view-toggle"]', title: '5. View Layout Toggle', desc: 'Switch display mode between visual grid cards and compact tabular layout.' }
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
    summary: `Browse standard materials and prices used for ${U} repairs and work orders.`,
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
        title: 'Catalog Refresh',
        desc: 'Reload materials catalog',
        details: 'Refresh feature reloads standardized materials and benchmarks from the university server.'
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
        label: 'Refresh',
        type: 'info',
        desc: 'Refreshes local material prices and items from the university database.',
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
        title: 'How to Refresh Materials Catalog',
        steps: [
          'Click "Refresh" in the library toolbar.',
          'The system fetches the latest standard materials and benchmarks from the database.'
        ]
      }
    ],
    tourSteps: [
      { element: '#tour-page-header', title: `1. ${U} Materials Library`, desc: 'Standardized supplies, parts specifications, and baseline prices for university maintenance.' },
      { element: '[data-tour="materials-search-input"]', title: '2. Search Materials Catalog', desc: 'Search supplies by item name or category.' },
      { element: '[data-tour="materials-btn-add"]', title: '3. Add Standard Material', desc: 'Add a new consumable item with unit of measure and benchmark price.' },
      { element: '[data-tour="materials-btn-refresh"]', title: '4. Refresh Catalog', desc: 'Reload standard material catalog and benchmarks.' },
      { element: '[data-tour="materials-catalog-table"]', title: '5. Standard Materials Table', desc: 'Inspect material definitions, units of measurement, and benchmark prices.' }
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
    summary: `Coordinate shared jobs with other units (FGMU, LEAU, or SSU) and track joint worker assignments.`,
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
      { element: '#tour-page-header', title: '1. Cross-Unit Collaboration Hub', desc: 'Coordinate multi-department projects requiring joint manpower across campus.' },
      { element: '[data-tour="collab-tab-approved"]', title: '2. Collab Requests Tab', desc: 'View incoming collaboration requests awaiting your unit\'s dispatch.' },
      { element: '[data-tour="collab-tab-scheduled"]', title: '3. Dispatched Tab', desc: 'View collaboration tickets dispatched with assigned personnel scheduled to execute.' },
      { element: '[data-tour="collab-tab-active"]', title: '4. Active Collab Tab', desc: 'View live cross-unit execution tracking with turnaround duration monitoring.' },
      { element: '[data-tour="collab-urgency-filters"]', title: '5. Filter by Urgency', desc: 'Filter collaboration tickets by All, Emergency, or Standard priority.' },
      { element: '[data-tour="collab-search-input"]', title: '6. Search Joint Work Orders', desc: 'Filter multi-unit collaboration requests by ticket ID, project name, or partner unit.' }
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
    summary: `View past completed, resolved, and declined requests. Search by ticket number or year, view ratings, and download records.`,
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
      { element: '#tour-page-header', title: `1. ${U} Archives`, desc: 'Access archived records and historical work order data for past academic years.' },
      { element: '[data-tour="archives-search-input"]', title: '2. Search Historical Records', desc: 'Search past tickets by ticket ID, requester, or venue.' },
      { element: '[data-tour="archives-filter-year"], [data-tour="archives-filter-service"]', title: '3. Filter by Year & Service', desc: 'Isolate records by academic year or service specialization.' },
      { element: '[data-tour="archives-btn-export"]', title: '4. Bulk Audit Export', desc: 'Download historical data in PDF or CSV formats.' }
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
    summary: isSsu
      ? 'Update your profile, change password, and manage email alerts.'
      : 'Update your profile, change password, manage email alerts, and save your digital signature for job orders.',
    sections: [
      {
        title: 'Unit Operations Profile Card',
        desc: 'Administrative credentials and contact info',
        details: 'Displays official administrator badge, avatar photo upload, First Name, Last Name, Name Extension, and official university unit email address.'
      },
      ...(!isSsu ? [{
        title: 'Official Digital Signature Studio',
        desc: 'Automated job order approval signature',
        details: 'Signature rendered automatically above the Unit Head signature line on generated Job Orders (QM-GSO-01), Request Slips, and archives. Offers Draw Signature (Ink color and thickness) and Upload Image (Auto-Remove Background).'
      }] : []),
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
        details: isSsu
          ? `Explains that your account permissions govern incident reporting, security worker dispatch, and security logs strictly within the SSU operational branch.`
          : `Explains that your account permissions govern ticket dispatch, worker scheduling, job liquidation, and inventory management strictly within the ${U} operational branch.`
      }
    ],
    tabs: [
      { name: 'Profile & Credentials', badge: 'User Settings', desc: 'Administrator details, email notifications, and password security.' },
      ...(!isSsu ? [{ name: 'Digital Signature', badge: 'Document Authorization', desc: 'Draw or upload digital signature for automated job order rendering.' }] : [])
    ],
    buttons: [
      ...(!isSsu ? [{
        label: 'Change Signature / Update Signature',
        type: 'primary',
        desc: 'Opens the Official Digital Signature Studio modal with Draw and Upload tabs.',
        result: 'Displays signature studio modal.'
      }] : []),
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
      ...(!isSsu ? [{
        label: 'Remove Signature',
        type: 'danger',
        desc: 'Deletes the current digital signature from the system.',
        result: 'Clears saved signature.'
      }] : [])
    ],
    procedures: [
      ...(!isSsu ? [{
        title: 'How to Set Up or Update Your Official Digital Signature',
        steps: [
          'Navigate to Account Settings in the sidebar.',
          'Find the Official Digital Signature section and click "Change Signature" (or "Update").',
          'To draw your signature: click "Draw Signature", pick ink color (Black or Blue), choose thickness, and sign using your mouse, stylus, or touch screen.',
          'To upload a photo: click "Upload Image", sign on clean white paper, take a photo, and upload it (PNG/JPG up to 3MB; paper background is removed automatically).',
          'Click "Save Official Signature". The signature will now auto-render on all generated Job Orders.'
        ]
      }] : []),
      {
        title: 'How to Configure Email Alert Preferences',
        steps: [
          'Locate the "Email Notifications" toggle.',
          'Toggle "On" to receive immediate email notifications whenever a new ticket is submitted or an incident report is filed.',
          'Click "Save Changes" at the bottom of the profile.'
        ]
      }
    ],
    tourSteps: [
      { element: '#tour-page-header', title: `1. ${U} Settings`, desc: isSsu ? 'Set up your unit profile and email alerts.' : 'Set up your unit profile, digital signature, and email alerts.' },
      { element: '[data-tour="admin-settings-profile"]', title: '2. Operations Profile', desc: 'Update first name, last name, suffix, email address, and contact details.' },
      { element: '[data-tour="admin-settings-email"]', title: '3. Email Notifications', desc: 'Turn on to receive automated email alerts for new tickets and status changes to your registered email.' },
      { element: '[data-tour="admin-settings-mfa"]', title: '4. Two-Factor Authentication (Email OTP)', desc: 'Enable 6-digit email one-time password verification for secure admin login.' },
      { element: '[data-tour="admin-settings-password"]', title: '5. Change Password', desc: 'Set a new password (minimum 8 characters) or leave blank to keep your current password.' },
      ...(!isSsu ? [{ element: '[data-tour="admin-settings-signature"]', title: '6. Digital Signature Setup', desc: 'Draw or upload your official digital signature for automatic placement on job orders.' }] : []),
      { element: '[data-tour="admin-settings-btn-save"]', title: isSsu ? '6. Save Configuration' : '7. Save Configuration', desc: isSsu ? 'Click to save your profile changes, email preferences, and MFA setting.' : 'Click to save your profile changes, email preferences, MFA setting, and signature.' }
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
    roleBadge: 'Requestor',
    roleSummary: 'Request campus services, borrow tools or plants, report incidents, and track your requests.',
    pages: [
      {
        id: 'user-dashboard',
        name: 'Dashboard Overview',
        route: '/user/dashboard',
        icon: '🏠',
        manualSection: 'Section B1: Dashboard Overview',
        roleBadge: 'Requestor',
        summary: 'See recent updates, check your account status, and request campus services.',
        sections: [
          {
            title: 'ID Verification Notice',
            desc: 'Account approval status',
            details: 'If your student or employee ID is still being verified, a notice appears here. Requesting services is paused until your ID is approved.'
          },
          {
            title: 'New Service Request Banner',
            desc: 'Shortcut to request help',
            details: 'Click the "New Service Request" button to browse campus services. If your ID is still being checked, this button shows as locked.'
          },
          {
            title: 'Recent Ticket Updates',
            desc: 'Latest updates on your requests',
            details: 'Shows your latest tickets with their reference numbers, service names, and current status (such as Pending, Scheduled, or Finished). Click any ticket to see its details.'
          },
          {
            title: 'View All Link',
            desc: 'Open your full tickets list',
            details: 'Click "View All" to go to the My Tickets page, where you can filter, search, and track all your active requests.'
          }
        ],
        tabs: [
          { name: 'Recent Activity', badge: 'Latest Updates', desc: 'Shows your latest requests and status updates.' }
        ],
        buttons: [
          {
            label: 'New Service Request',
            type: 'primary',
            desc: 'Opens the services catalog to request maintenance, borrowing, or security help.',
            result: 'Takes you to the services list.'
          },
          {
            label: 'View All',
            type: 'secondary',
            desc: 'Opens the My Tickets page to see all your active requests.',
            result: 'Takes you to My Tickets.'
          }
        ],
        procedures: [
          {
            title: 'How to Check If Your ID Is Approved',
            steps: [
              'Log in with your university account.',
              'Look at the top of your dashboard. If you see "ID Verification in Progress", our team is still checking your ID.',
              'Once approved, the notice disappears and the "New Service Request" button turns active.'
            ]
          }
        ],
        tourSteps: [
          { element: '[data-tour="user-id-notice"]', title: '1. ID Verification Notice', desc: 'Your ID is being reviewed by our team. Service requests are paused until approval, but you can still browse the portal.' },
          { element: '[data-tour="user-hero-banner"], [data-tour="admin-page-header"]', title: '2. Welcome to Your Dashboard', desc: 'This is your home screen. You can ask for assistance, check recent requests, and see updates on your tickets.' },
          { element: '[data-tour="user-btn-new-request"]', title: '3. Request a Service', desc: 'Click here to start a new request for repairs, borrowed equipment, plants, or security assistance. Locked until your ID is approved.' },
          { element: '[data-tour="user-recent-tickets"]', title: '4. Recent Updates', desc: 'Check the latest updates on your requests here, including whether staff started the job or if it is ready for your rating.' },
          { element: '[data-tour="user-btn-view-all"]', title: '5. View All Tickets', desc: 'Click "View All" to jump straight into your complete list of active tickets.' },
          { element: '#tour-sidebar-nav, button[title="Toggle Sidebar"]', title: '6. Menu & Navigation', desc: 'Use the menu to switch between your Dashboard, Services Catalog, Active Tickets, Completed History, and Settings.' },
          { element: '#tour-notifications-btn', title: '7. Notifications', desc: 'Click the bell icon to see new notifications whenever staff update or complete your requests.' }
        ]
      },
      {
        id: 'user-services',
        name: 'Services Catalog',
        route: '/services',
        icon: '📝',
        manualSection: 'Section B2: Submitting a Service Request (Step 1)',
        roleBadge: 'Requestor',
        summary: 'Browse and choose available university services, repairs, tool borrowing, or security assistance.',
        sections: [
          {
            title: 'Student vs Faculty Services',
            desc: 'Authorized services for your role',
            details: 'Student representatives can request borrowing of tools or plants, hauling, stage decoration, and incident reports. Structural building repairs are reserved for faculty and staff.'
          },
          {
            title: 'Category Tabs',
            desc: 'Filter by unit or work type',
            details: 'Easily filter services across Facilities & Repairs (FGMU), Grounds & Landscaping (LEAU), and Security & Incidents (SSU).'
          },
          {
            title: 'Search Bar',
            desc: 'Find services quickly',
            details: 'Type any keyword like "leak", "light", "weeding", or "stolen" to find the right service.'
          },
          {
            title: 'Service Selection Cards',
            desc: 'Tap cards to select',
            details: 'Click on one or more service cards across any category to select the help you need. A green checkmark shows they are selected.'
          },
          {
            title: 'Selected Services & Next Step',
            desc: 'Selected service counter and next button',
            details: 'Bottom bar displays the number of chosen services and unlocks the "Fill Out Form" button once at least 1 service is selected.'
          }
        ],
        tabs: [
          { name: 'All Services', badge: 'Full Catalog', desc: 'Browse all university services.' },
          { name: 'Facilities & Repairs', badge: 'FGMU', desc: 'Electrical, plumbing, carpentry, welding, masonry, and painting.' },
          { name: 'Grounds & Landscaping', badge: 'LEAU', desc: 'Hauling, borrowing plants, tools and equipment, stage decoration, and lawn care.' },
          { name: 'Security & Incidents', badge: 'SSU', desc: 'Official incident report submissions for campus security concerns.' }
        ],
        buttons: [
          {
            label: 'Fill Out Form',
            type: 'primary',
            desc: 'Opens the request form with your chosen services.',
            result: 'Opens the detailed request form page.'
          },
          {
            label: 'Show all services / Authorized only',
            type: 'secondary',
            desc: 'For students: toggle between allowed services and the full campus catalog.',
            result: 'Toggles between authorized student services and full catalog.'
          },
          {
            label: 'Service Cards',
            type: 'info',
            desc: 'Click any card to select or unselect a service.',
            result: 'Updates your chosen services.'
          }
        ],
        procedures: [
          {
            title: 'How to Select and Request Services',
            steps: [
              'Click "New Service Request" from the dashboard or "Services Catalog" in the menu.',
              'Use the search bar or category tabs to find the service you need.',
              'Click on the service cards to select them. The bottom counter updates.',
              'Click "Fill Out Form" to move to Step 2.'
            ]
          }
        ],
        tourSteps: [
          { element: '[data-tour="services-header"], main', title: '1. Choose Your Services', desc: 'Browse all available campus services. You can pick one or more services before moving to the form.' },
          { element: '[data-tour="services-search-input"]', title: '2. Search Services', desc: 'Type keywords like "pipe leak", "aircon", "broken door", or "plants" to find what you need quickly.' },
          { element: '[data-tour="services-category-tabs"]', title: '3. Filter by Category', desc: 'Filter services by department: Facilities (repairs), Landscape (plants & tools), or Security (incidents).' },
          { element: '[data-tour="services-card-item"]', title: '4. Select Service Cards', desc: 'Click any service card to select it. Click it again if you want to unselect it.' },
          { element: '[data-tour="services-btn-submit"]', title: '5. Fill Out Request Form', desc: 'Once you have chosen your services, click "Fill Out Form" to specify your location and describe what you need.' }
        ]
      },
      {
        id: 'user-intake',
        name: 'Service Intake Form',
        route: '/services',
        icon: '📝',
        manualSection: 'Section B2: Submitting a Service Request (Step 2)',
        roleBadge: 'Requestor',
        summary: 'Fill out your request details, pick the building and room, attach photos, and submit your form.',
        sections: [
          {
            title: 'Selected Services Summary',
            desc: 'Overview of chosen services and handling unit',
            details: 'Confirms selected services and identifies which GSO unit will handle the ticket (Facilities, Landscaping, or Security).'
          },
          {
            title: 'Maintenance & Repair Fields',
            desc: 'Building, room, and problem description',
            details: 'Select your building, type your room or office number, explain the issue (at least 10 characters), and attach clear photos if available.'
          },
          {
            title: 'Borrowing Request Fields',
            desc: 'Item name, quantity, and dates',
            details: 'Enter the item name, quantity needed, purpose, pickup date, and expected return date, then agree to the return terms.'
          },
          {
            title: 'Security Incident Fields',
            desc: 'Confidential incident details',
            details: 'Choose the incident type, persons involved, location, date, time, and explain what happened in the statement box.'
          }
        ],
        tabs: [
          { name: 'Request Form', badge: 'Required', desc: 'Fill in the required information for your chosen services.' }
        ],
        buttons: [
          {
            label: 'Validate & Submit Request',
            type: 'primary',
            desc: 'Checks that all required fields are filled out and sends your ticket to the GSO team.',
            result: 'Creates your ticket and sends you a confirmation update.'
          },
          {
            label: 'Back to Services',
            type: 'secondary',
            desc: 'Returns to the services list so you can change your chosen services.',
            result: 'Returns to Step 1 without submitting.'
          }
        ],
        procedures: [
          {
            title: 'How to Submit a Maintenance Work Order',
            steps: [
              'Confirm your chosen services in the summary box.',
              'Select your building and type your room or office number.',
              'Describe the issue clearly (at least 10 characters).',
              'Attach clear photos of the issue if available (up to 10MB each).',
              'Click "Validate & Submit Request".'
            ]
          },
          {
            title: 'How to Submit a Tool or Plant Borrowing Request',
            steps: [
              'Enter the item name and quantity needed.',
              'Explain what you will use the items for.',
              'Pick your pickup date and return date.',
              'Check the agreement box to accept responsibility for returning the items in good shape.',
              'Click "Validate & Submit Request".'
            ]
          },
          {
            title: 'How to Submit a Security Incident Report',
            steps: [
              'Select the type of incident.',
              'Enter the persons involved (if known) and the exact campus location.',
              'Select the date and time it occurred.',
              'Write what happened in the description box.',
              'Click "Validate & Submit Request".'
            ]
          }
        ],
        tourSteps: [
          { element: '[data-tour="intake-stepper-card"], main', title: '1. Service Request Form', desc: 'Enter your building, room number, and a short description of what you need help with.' },
          { element: '[data-tour="intake-btn-back"]', title: '2. Back to Services', desc: 'Click here if you need to go back and change your selected services.' },
          { element: '[data-tour="intake-btn-submit"]', title: '3. Submit Your Request', desc: 'Review your details and click "Validate & Submit Request" to send your ticket to the GSO team.' }
        ]
      },
      {
        id: 'user-tickets',
        name: 'My Service Requests',
        route: '/user/tickets',
        icon: '📋',
        manualSection: 'Section B3: My Service Requests',
        roleBadge: 'Requestor',
        summary: 'Track the status of your requests, check worker visit dates, cancel pending tickets, and rate finished work.',
        sections: [
          {
            title: 'Search & Status Tabs',
            desc: 'Find and filter your active tickets',
            details: 'Search by ticket ID number, building, or service name. Switch between All, Pending, In Progress, and Awaiting Rating tabs.'
          },
          {
            title: 'Request Cards',
            desc: 'Summary of each active ticket',
            details: 'Shows handling unit (FGMU, LEAU, SSU) with reference number, service name, status badge, submission date, and visit schedule.'
          },
          {
            title: 'Step-by-Step Progress Timeline',
            desc: 'Visual timeline of your request',
            details: 'Click "Track Progress" on any card to see its step-by-step progress from submission, admin review, worker dispatch, job start, to completion.'
          },
          {
            title: 'Rating & Feedback Form',
            desc: 'Rate staff when work is completed',
            details: 'When a job is marked completed, a rating form appears so you can give 1 to 5 stars for Quality, Efficiency, and Timeliness, then close the ticket.'
          }
        ],
        tabs: [
          { name: 'All', badge: 'Active', desc: 'Shows all your active submitted requests.' },
          { name: 'Pending', badge: 'Under Review', desc: 'Requests waiting for review by unit administrators. You can cancel requests in this tab.' },
          { name: 'In Progress', badge: 'Active', desc: 'Requests that are approved, scheduled for a visit, or actively being worked on.' },
          { name: 'Awaiting Rating', badge: 'Action Needed', desc: 'Finished jobs waiting for your rating before they move to completed history.' }
        ],
        buttons: [
          {
            label: 'Track Progress',
            type: 'primary',
            desc: 'Opens the step-by-step progress timeline showing current status and worker schedules.',
            result: 'Displays the tracking timeline modal.'
          },
          {
            label: 'Cancel Request',
            type: 'danger',
            desc: 'Cancels a pending request if you no longer need the work done.',
            result: 'Cancels your request and closes the ticket.'
          },
          {
            label: 'Rate Service & Close',
            type: 'success',
            desc: 'Opens the rating form to score the work and close the ticket.',
            result: 'Submits your 1 to 5 star rating and moves the ticket to history.'
          },
          {
            label: 'New Request',
            type: 'secondary',
            desc: 'Quick link to the services catalog to submit another request.',
            result: 'Takes you to the services catalog.'
          }
        ],
        procedures: [
          {
            title: 'How to Track Your Request',
            steps: [
              'Click "Track Progress" on any ticket card.',
              'Review the highlighted step to see where your request is in the process.',
              'Check scheduled visit dates and assigned worker names.'
            ]
          },
          {
            title: 'How to Cancel a Pending Request',
            steps: [
              'Find the request in the "Pending" tab.',
              'Click "Cancel Request" (available only before the request is approved).',
              'Confirm the prompt to withdraw the ticket.'
            ]
          },
          {
            title: 'How to Rate a Finished Job',
            steps: [
              'When the job is finished, the ticket moves to the "Awaiting Rating" tab.',
              'Click "Rate Service & Close" on the ticket card.',
              'Choose whether the job was finished on time, early, or late.',
              'Rate Quality, Efficiency, and Timeliness from 1 to 5 stars, and leave optional comments.',
              'Click "Submit Evaluation & Close Ticket". The ticket moves to Completed Tickets.'
            ]
          }
        ],
        tourSteps: [
          { element: '[data-tour="user-filters-bar"], [data-tour="admin-page-header"]', title: '1. My Service Requests', desc: 'Track all your active requests, see who is assigned, and check scheduled visit dates.' },
          { element: '[data-tour="user-search-input"]', title: '2. Search Requests', desc: 'Search your tickets by ticket ID number, building, or service name.' },
          { element: '[data-tour="user-status-tabs"]', title: '3. Filter by Status', desc: 'Filter tickets by status: All, Pending (waiting for review), In Progress (scheduled or active), and Awaiting Rating (finished jobs ready for feedback).' },
          { element: '[data-tour="user-btn-track-progress"], [data-tour="user-ticket-card"], [data-tour="user-empty-state"]', title: '4. Track Progress', desc: 'Click "Track Progress" on any card to see its step-by-step timeline, visit dates, and assigned worker.' },
          { element: '[data-tour="user-btn-cancel-request"], [data-tour="user-ticket-card"], [data-tour="user-status-tabs"]', title: '5. Cancel Request', desc: 'If your request is still in Pending status and you no longer need the service, you can cancel it here.' },
          { element: '[data-tour="user-btn-new-ticket"]', title: '6. New Request', desc: 'Click "New Request" anytime to open the services catalog and submit another request.' }
        ]
      },
      {
        id: 'user-completed',
        name: 'Completed Tickets & History',
        route: '/user/completed-tickets',
        icon: '⭐',
        manualSection: 'Section B4: Completed Tickets',
        roleBadge: 'Requestor',
        summary: 'View your finished requests, see worker notes and ratings, and download completion slips.',
        sections: [
          {
            title: 'Completed Tickets Table',
            desc: 'Searchable list of finished requests',
            details: 'Search by ticket ID number or service name. Displays ticket number, service title, completion status, and completed date.'
          },
          {
            title: 'Completed Ticket Details',
            desc: 'Finished work summary',
            details: 'Review original request details, completion date, assigned worker notes, and uploaded photos.'
          },
          {
            title: 'Your Feedback & Rating',
            desc: 'Scores and remarks given',
            details: 'Shows the 1 to 5 star ratings and comments you gave for Quality, Efficiency, and Timeliness.'
          },
          {
            title: 'Verified Timeline',
            desc: 'Full record of all milestones',
            details: 'Shows the verified completion history confirming that all steps were completed from initial submission to final sign-off.'
          }
        ],
        tabs: [
          { name: 'Completed Archive', badge: 'History', desc: 'All past finished requests saved for your records.' }
        ],
        buttons: [
          {
            label: 'View Details',
            type: 'primary',
            desc: 'Opens full details for the completed request, including worker notes and your submitted ratings.',
            result: 'Displays the completed ticket details modal.'
          },
          {
            label: 'Track Progress',
            type: 'secondary',
            desc: 'Shows the complete history timeline confirming all milestones from start to finish.',
            result: 'Displays the completed timeline modal.'
          }
        ],
        procedures: [
          {
            title: 'How to Review Past Completed Requests',
            steps: [
              'Click "Completed Tickets" in the sidebar.',
              'Search by ticket ID number or browse through the pages.',
              'Click "View Details" to see what was done, when it was completed, and your submitted rating.',
              'Click "Track Progress" to see the full timeline from submission to completion.'
            ]
          }
        ],
        tourSteps: [
          { element: '[data-tour="completed-table-card"], [data-tour="admin-page-header"]', title: '1. Completed Tickets', desc: 'View all your finished, closed, or cancelled requests in one place.' },
          { element: '[data-tour="completed-search-input"]', title: '2. Search History', desc: 'Quickly find an older request by typing its ticket ID number or service name.' },
          { element: '[data-tour="completed-btn-track"], [data-tour="completed-ticket-row"], [data-tour="completed-table-card"]', title: '3. Full Timeline', desc: 'Click "Track Progress" to see the complete history from when you first submitted the request to when work finished.' },
          { element: '[data-tour="completed-btn-details"], [data-tour="completed-ticket-row"], [data-tour="completed-table-card"]', title: '4. View Details & Rating', desc: 'Click "View Details" to inspect the final work summary, assigned worker notes, and the rating you gave.' }
        ]
      },
      {
        id: 'user-settings',
        name: 'Account Settings',
        route: '/user/edit-profile',
        icon: '⚙️',
        manualSection: 'Section B5: Account Settings',
        roleBadge: 'Requestor',
        summary: 'Update your personal info, change password, and set email notification preferences.',
        sections: [
          {
            title: 'Profile Photo',
            desc: 'Account picture upload',
            details: 'Click the circular photo avatar to upload a profile picture for your account.'
          },
          {
            title: 'Personal Details',
            desc: 'Name and email management',
            details: 'Update your first name, last name, and email address. Your email is used to log in and receive status notices.'
          },
          {
            title: 'Email Notification Updates',
            desc: 'Email alerts for your requests',
            details: 'Turn this on to receive email notices when your requests are approved, dispatched, or completed.'
          },
          {
            title: 'Two-Factor Authentication',
            desc: 'Extra account protection',
            details: 'Turn this on to receive a 6-digit email code when logging in for extra account security.'
          },
          {
            title: 'Change Password',
            desc: 'Password update',
            details: 'Enter a new password (at least 8 characters). Leave blank if you do not want to change it.'
          }
        ],
        tabs: [
          { name: 'Profile & Security', badge: 'Settings', desc: 'Personal information, notification preferences, and password settings.' }
        ],
        buttons: [
          {
            label: 'Save Profile Changes',
            type: 'primary',
            desc: 'Saves your updated name, email, notification preferences, or new password.',
            result: 'Saves your profile changes.'
          },
          {
            label: 'Profile Photo Upload',
            type: 'secondary',
            desc: 'Click on your photo thumbnail to choose a new picture.',
            result: 'Updates your profile picture.'
          },
          {
            label: 'Email Updates Toggle',
            type: 'info',
            desc: 'Turns email notices for your requests on or off.',
            result: 'Updates notification preferences.'
          }
        ],
        procedures: [
          {
            title: 'How to Update Your Info and Email Alerts',
            steps: [
              'Click "Account Settings" in the menu.',
              'Update your name or email address.',
              'Switch "Email Updates for My Requests" to On if you want email alerts when staff work on your request.',
              'Click "Save Profile Changes".'
            ]
          },
          {
            title: 'How to Change Your Password',
            steps: [
              'Go to Account Settings.',
              'Type your new password (at least 8 characters) in New Password.',
              'Type the same password in Confirm New Password.',
              'Click "Save Profile Changes".'
            ]
          }
        ],
        tourSteps: [
          { element: '[data-tour="settings-profile-card"], [data-tour="admin-page-header"]', title: '1. Profile & Settings', desc: 'Manage your personal details, email preferences, and account security.' },
          { element: '[data-tour="settings-avatar-upload"]', title: '2. Profile Photo', desc: 'Click the photo circle to upload a picture for your account.' },
          { element: '[data-tour="settings-email-toggle"]', title: '3. Email Updates', desc: 'Turn this on to receive email notices when your requests are approved, dispatched, or completed.' },
          { element: '[data-tour="settings-password-inputs"]', title: '4. Change Password', desc: 'Enter a new password here if you want to change it. Leave blank to keep your current password.' },
          { element: '[data-tour="settings-btn-save"]', title: '5. Save Changes', desc: 'Click here to save any updates you made to your profile or password.' }
        ]
      }
    ]
  },

  // ─── 2. UNIT ADMINISTRATOR (FGMU / LEAU / SSU) ──────────────────────────
  admin: {
    roleKey: 'admin',
    roleLabel: 'Unit Administrator (FGMU / LEAU / SSU)',
    roleIcon: '🛠️',
    roleSummary: 'Oversee unit operations, manage tickets, assign workers, maintain inventory, and review past records.',
    pages: [] // Dynamically generated in useTutorial.js based on active unit
  },

  // ─── 3. SUPERADMINISTRATOR (System Governance) ───────────────────────────
  superadmin: {
    roleKey: 'superadmin',
    roleLabel: 'Super Administrator Console',
    roleIcon: '🛡️',
    roleBadge: 'System Governance',
    roleSummary: 'Manage user accounts, verify student and employee IDs, monitor system logs, create backups, and configure settings.',
    pages: [
      {
        id: 'superadmin-users',
        name: 'User Accounts & RBAC Governance',
        route: '/superadmin/users',
        icon: '👥',
        manualSection: 'Section F1: User Accounts',
        roleBadge: 'Superadmin Console',
        summary: 'Manage all user accounts, assign user roles, create staff accounts, and activate or suspend users.',
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
      { element: '[data-tour="admin-page-header"]', title: '1. User Governance & RBAC', desc: 'Manage university user accounts, role permissions, and account statuses.' },
      { element: '[data-tour="superadmin-search-input"]', title: '2. Search Accounts', desc: 'Search users by employee/student ID number, full name, or university email.' },
      { element: '[data-tour="superadmin-role-tabs"]', title: '3. Role Hierarchy Filters', desc: 'Filter accounts across Students, Employees, Unit Admins, Technicians, and Directors.' },
      { element: '[data-tour="superadmin-btn-provision"]', title: '4. Provision Administrative Users', desc: 'Create new administrative or operational staff accounts with designated roles.' },
      { element: '[data-tour="superadmin-users-table"]', title: '5. User Registry Table', desc: 'Inspect account statuses, reset credentials, or update role authorizations.' }
    ]
      },
      {
        id: 'superadmin-queues',
        name: 'Identity Verification Queue',
        route: '/superadmin/queues',
        icon: '🛡️',
        manualSection: 'Section F2: User Queues',
        roleBadge: 'Superadmin Console',
        summary: 'Check uploaded school IDs and selfies to approve or reject new user registrations.',
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
          { element: '[data-tour="admin-page-header"]', title: '1. Identity Verification Queue', desc: 'Review uploaded student and employee credentials to safeguard university access.' },
          { element: '[data-tour="verify-search-input"]', title: '2. Search Registrants', desc: 'Search pending registrations by institutional ID, student name, or BSU email.' },
          { element: '[data-tour="verify-filter-role"]', title: '3. Filter by Role', desc: 'Separate Student applicants from Faculty & Staff applicants for batch evaluation.' },
          { element: '[data-tour="verify-btn-inspect"]', title: '4. Inspect Identification & Verify', desc: 'Open the credential viewer to review uploaded ID photos, then Approve or Reject.' }
        ]
      },
      {
        id: 'superadmin-audit',
        name: 'Business Audit Trail & Operations Log',
        route: '/superadmin/logs',
        icon: '📜',
        manualSection: 'Section F3: Business Audit Trail',
        roleBadge: 'Superadmin Console',
        summary: 'View system activity logs for ticket updates, dispatches, cancellations, and status changes.',
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
      { element: '[data-tour="admin-page-header"]', title: '1. System Audit Logs', desc: 'Inspect immutable, timestamped records of all operational and administrative actions.' },
      { element: '[data-tour="audit-search-input"]', title: '2. Search & Filter Events', desc: 'Search logs by actor name, action type, IP address, or specific ticket reference.' },
      { element: '[data-tour="audit-btn-export"]', title: '3. Export Compliance Trail', desc: 'Download timestamped audit logs in CSV format for institutional compliance.' },
      { element: '[data-tour="audit-logs-table"]', title: '4. Immutable Audit Table', desc: 'Review chronological events with severity levels, actor identity, and before/after metadata.' }
    ]
      },
      {
        id: 'superadmin-account-logs',
        name: 'Account Activity Audit Trail (RA 10173)',
        route: '/superadmin/account-logs',
        icon: '🔒',
        manualSection: 'Section F4: Account Activity Audit Trail',
        roleBadge: 'Superadmin Console',
        summary: 'View security logs for user logins, logouts, password resets, and account registrations.',
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
              'Click "Account Activity" in the Superadmin sidebar.',
              'Filter by Severity dropdown to "Warning" or "Critical".',
              'Search for the user\'s masked email or ID number.',
              'Click the Eye Icon on the entry to review client browser, OS, and timestamp anomalies.'
            ]
          }
        ],
        tourSteps: [
      { element: '[data-tour="admin-page-header"]', title: '1. Privacy Telemetry Logs', desc: 'Monitor authentication, logins, and session lifecycles under Philippine RA 10173 guidelines.' },
      { element: '[data-tour="account-logs-search"]', title: '2. Search Telemetry Logs', desc: 'Search authentication attempts, IP addresses, browser agents, or specific users.' },
      { element: '[data-tour="account-logs-filter-severity"]', title: '3. Risk Severity Filter', desc: 'Filter events by Critical lockouts, Warning failed logins, or Info session activity.' },
      { element: '[data-tour="account-logs-btn-privacy"]', title: '4. RA 10173 Privacy Masking', desc: 'Toggle PII privacy masking on or off in accordance with data privacy regulations.' },
      { element: '[data-tour="account-logs-btn-export"]', title: '5. Export Activity Logs', desc: 'Export authentication activity records for ICT security reporting.' },
      { element: '[data-tour="account-logs-table"]', title: '6. Telemetry Records Table', desc: 'Inspect timestamped login, lockout, and session records with device details.' }
    ]
      },
      {
        id: 'superadmin-backup',
        name: 'Database Backup & Recovery Console',
        route: '/superadmin/backups',
        icon: '💾',
        manualSection: 'Section F5: Backup & Recovery',
        roleBadge: 'Superadmin Console',
        summary: 'Create database backups, set up Google Drive sync, and restore previous system copies when needed.',
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
      { element: '[data-tour="admin-page-header"]', title: '1. Backup & Recovery Console', desc: 'Manage database snapshots and disaster recovery safeguards.' },
      { element: '[data-tour="backup-btn-create"]', title: '2. Create Database Backup', desc: 'Trigger an immediate full SQL snapshot of the entire university database with zero downtime.' }
    ]
      },
      {
        id: 'superadmin-settings',
        name: 'Root Platform Settings & Email Pipeline',
        route: '/superadmin/settings',
        icon: '⚙️',
        manualSection: 'Section F6: Account Settings & Email Service',
        roleBadge: 'Superadmin Console',
        summary: 'Update admin profile, configure email service keys and domains, and send test emails.',
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
      { element: '[data-tour="admin-page-header"]', title: '1. Platform Configuration', desc: 'Manage email pipelines, API credentials, and global system parameters.' },
      { element: '[data-tour="superadmin-settings-profile"]', title: '2. Superadmin Account & Security', desc: 'Update root administrator profile credentials and multi-factor settings.' },
      { element: '[data-tour="superadmin-settings-resend-card"]', title: '3. Email Pipeline (Resend.com)', desc: 'Configure Resend API key and sender identity for campus notification delivery.' },
      { element: '[data-tour="superadmin-settings-btn-save"]', title: '4. Save Configuration', desc: 'Save all platform and profile updates securely.' }
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
    roleSummary: 'Oversee FGMU, LEAU, and SSU operations, approve major requests, review materials reports, and set holiday calendars.',
    pages: [
      {
        id: 'director-dashboard',
        name: 'Executive Overview & Reports',
        route: '/director/dashboard',
        icon: '📊',
        manualSection: 'Section G1: Executive Overview',
        roleBadge: 'Director Console',
        summary: 'Overview of all unit operations (FGMU, LEAU, SSU). Monitor overall progress, ratings, and export executive reports.',
        sections: [
          {
            title: 'Unit Ticket Overview Cards',
            desc: 'Quick links to each unit queue',
            details: 'Cards for FGMU Ticket Overview, LEAU Ticket Overview, and SSU Incident Reports Overview. Clicking "Open Queues" goes directly to that unit\'s live ticket list.'
          },
          {
            title: 'Performance by Sub-Unit Table',
            desc: 'Side-by-side unit performance',
            details: 'Breaks down Requests, Resolved, Declined, and Rating averages for FGMU, LEAU, and SSU, with a GSO Overall row totaling performance across all units.'
          },
          {
            title: 'Top Service Categories Breakdown',
            desc: 'Most requested services',
            details: 'Tabs for All Units, FGMU, LEAU, and SSU. Itemizes top service categories with request counts and percentage distribution (e.g., Carpentry 20%, Plant Borrowing 36.7%, Incidents 100%).'
          },
          {
            title: 'Service Completion Rate & Ratings',
            desc: 'Job completion health',
            details: 'Visualizes counts and percentages of jobs completed Early, On-Time, Overdue, or Incomplete, alongside average client scores for Quality, Efficiency, and Timeliness.'
          }
        ],
        tabs: [
          { name: 'All-Time', badge: 'Historical', desc: 'All past years combined.' },
          { name: 'Annual', badge: 'Yearly', desc: 'Metrics for the current academic year.' },
          { name: 'Quarterly', badge: 'Quarter', desc: 'Q1, Q2, Q3, or Q4 reporting.' },
          { name: 'Monthly', badge: 'Month', desc: 'Current month\'s activity.' }
        ],
        buttons: [
          {
            label: 'Generate & Download Report',
            type: 'primary',
            desc: 'Exports performance data and summaries into a downloadable executive report.',
            result: 'Downloads an executive summary report.'
          },
          {
            label: 'Open Queues / Ticket Overview',
            type: 'info',
            desc: 'Goes directly to the ticket queue for FGMU, LEAU, or SSU.',
            result: 'Opens a specific unit queue.'
          }
        ],
        procedures: [
          {
            title: 'How to Review Cross-Unit Performance',
            steps: [
              'Review the Performance by Sub-Unit table to compare throughput and ratings between FGMU, LEAU, and SSU.',
              'Inspect Service Completion Rate to identify overdue or halted jobs.',
              'Select a Year and Month from the period dropdowns to examine historical trends.',
              'Click "Generate & Download Report" to produce an official executive report for the University President and Regents.'
            ]
          }
        ],
        tourSteps: [
      { element: '[data-tour="admin-page-header"]', title: '1. Executive Director Dashboard', desc: 'Your executive home screen. See unit performance at a glance and take quick actions.' },
      { element: '[data-tour="director-btn-report"]', title: '2. Download Executive PDF Report', desc: 'Download an executive performance report as a PDF.' },
      { element: '[data-tour="director-timeframe-selector"]', title: '3. Reporting Period Selector', desc: 'Switch the reporting period: All Time, Annual, Quarterly, or Monthly.' },
      { element: '[data-tour="director-matrix-table"]', title: '4. Performance Matrix by Sub-Unit', desc: 'Compare unresolved, resolved, declined, and total requests across FGMU, LEAU, and SSU.' },
      { element: '[data-tour="director-services-breakdown"]', title: '5. Service Distribution Breakdown', desc: 'See which services are requested most across campus.' },
      { element: '#tour-profile-menu', title: '6. Profile & Account', desc: 'Open your profile menu to view account settings or sign out.' }
    ]
      },
      {
        id: 'director-my-requests',
        name: 'Director Self-Service Requests',
        route: '/director/my-requests',
        icon: '📋',
        manualSection: 'Section G2: My Service Requests',
        roleBadge: 'Director Console',
        summary: 'Submit and track requests made by the Director, check progress, and evaluate finished work.',
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
          { element: '[data-tour="admin-page-header"]', title: '1. Director Service Requests', desc: 'View and track service requests you submitted as Director.' },
          { element: '[data-tour="myrequests-status-tabs"]', title: '2. Filter by Status', desc: 'Switch between All Requests, Pending, In Progress, Awaiting Rating, and Completed.' },
          { element: '[data-tour="myrequests-btn-new-request"]', title: '3. New Request', desc: 'Submit a new service request from the services catalog.' },
          { element: '[data-tour="myrequests-ticket-card"]', title: '4. Ticket Card', desc: 'Click any ticket to view its progress timeline and rate completed work.' }
        ]
      },
      {
        id: 'director-materials',
        name: 'Material Logs and Cost Reports',
        route: '/director/materials',
        icon: '📑',
        manualSection: 'Section G3: Material Logs and Report',
        roleBadge: 'Director Console',
        summary: 'Review materials and supplies used across work orders, check costs, and download materials reports.',
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
      { element: '[data-tour="admin-page-header"]', title: '1. Material Logs & Costs', desc: 'Review materials and supplies used across work orders and check costs.' },
      { element: '[data-tour="materials-period-selector"]', title: '2. Period Selector', desc: 'Filter materials by All Time, Annual, Quarterly, or Monthly.' },
      { element: '[data-tour="materials-kpi-cards"]', title: '3. Cost Summary Cards', desc: 'See total materials cost, items used, and per-unit breakdowns.' },
      { element: '[data-tour="materials-ledger-table"]', title: '4. Materials Ledger Table', desc: 'Browse itemized material entries with quantity, unit price, and ticket reference.' },
      { element: '[data-tour="director-materials-btn-export"]', title: '5. Export Materials PDF Report', desc: 'Download a materials consumption report as a PDF.' }
    ]
      },
      {
        id: 'director-holidays',
        name: 'Special Non-Working Holidays Registry',
        route: '/director/holidays',
        icon: '📅',
        manualSection: 'Section G4: Special Non-Working Holidays',
        roleBadge: 'Director Console',
        summary: 'Set official non-working holidays and school suspensions so deadlines skip those days automatically.',
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
      { element: '[data-tour="admin-page-header"]', title: '1. Special Non-Working Holidays', desc: 'Set official non-working dates that are excluded from ticket deadlines.' },
      { element: '[data-tour="holidays-search-input"]', title: '2. Search Holiday Calendar', desc: 'Find holidays or suspensions by name or year.' },
      { element: '[data-tour="holidays-filter-type"]', title: '3. Filter by Holiday Type', desc: 'Show National Holidays, Local Suspensions, or University Non-Working Days.' },
      { element: '[data-tour="holidays-btn-add"]', title: '4. Add Special Holiday', desc: 'Register a holiday to exclude it from business day calculations.' },
      { element: '[data-tour="holidays-table"]', title: '5. Holiday Registry Table', desc: 'View active holidays and update or remove suspension dates.' }
    ]
      },
      {
        id: 'director-fgmu-analytics',
        name: 'FGMU Unit Analytics',
        route: '/director/fgmu',
        icon: '📊',
        manualSection: 'Section G5: FGMU Ticket Overview',
        roleBadge: 'Director Console',
        summary: 'Review FGMU performance metrics, incident counts, and operational health.',
        sections: [
          {
            title: 'Statistics Cards',
            desc: 'Unresolved, resolved, declined, and total request counts',
            details: 'Quick overview of FGMU ticket volumes across all statuses.'
          },
          {
            title: 'Evaluation Averages',
            desc: 'Client feedback ratings for quality, efficiency, and timeliness',
            details: 'Average star ratings from completed service evaluations.'
          },
          {
            title: 'Job Completion Health',
            desc: 'On-time vs overdue job distribution',
            details: 'Breakdown of completed jobs by timeliness performance.'
          },
          {
            title: 'Root Cause Analysis',
            desc: 'Why delays and barriers happen',
            details: 'Top reported operational factors causing timeline extensions or work stoppages.'
          }
        ],
        tourSteps: [
      { element: '[data-tour="admin-page-header"]', title: '1. FGMU Analytics Dashboard', desc: 'Monitor FGMU performance metrics and operational health.' },
      { element: '[data-tour="fgmu-stats-cards"]', title: '2. Statistics Cards', desc: 'See unresolved, resolved, declined, and total request counts at a glance.' },
      { element: '[data-tour="fgmu-eval-averages"]', title: '3. Evaluation Averages', desc: 'View client feedback ratings for quality, efficiency, and timeliness.' },
      { element: '[data-tour="fgmu-completion-health"]', title: '4. Job Completion Health', desc: 'Check on-time vs overdue job distribution.' },
      { element: '[data-tour="fgmu-root-cause"]', title: '5. Root Cause Analysis', desc: 'See top reported factors causing delays and work stoppages.' }
    ]
      },
      {
        id: 'director-fgmu',
        name: 'FGMU Ticket Overview & Escalations',
        route: '/director/fgmu/queues',
        icon: '🛠️',
        manualSection: 'Section G5: FGMU Ticket Overview',
        roleBadge: 'Director Console',
        summary: 'Review FGMU requests and approve major repairs or high-cost jobs escalated by the unit head.',
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
            desc: 'Equipment borrowing requests',
            details: 'Filter by Pending Approval, Approved, Awaiting Pickup, and Awaiting Return.'
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
          { name: 'Borrowing', badge: 'Equipment Borrowing', desc: 'Tools and equipment borrowing requests.' },
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
      { element: '[data-tour="admin-page-header"]', title: '1. FGMU Executive Overview', desc: 'Review facilities projects needing executive approval.' },
      { element: '[data-tour="director-tab-pending"]', title: '2. Pending Escalations Queue', desc: 'Review facilities repairs needing executive authorization.' },
      { element: '[data-tour="director-tab-delayed"]', title: '3. Approval Delayed', desc: 'View tickets held pending materials, budget, or inspection.' },
      { element: '[data-tour="director-tab-approved"]', title: '4. Approved (Ready)', desc: 'See approved tickets awaiting worker assignment.' },
      { element: '[data-tour="director-tab-dispatched"]', title: '5. Scheduled / Dispatched', desc: 'Check tickets with assigned workers and work dates.' },
      { element: '[data-tour="director-tab-active"]', title: '6. In Progress', desc: 'Monitor active jobs on campus.' },
      { element: '[data-tour="director-tab-borrowing"]', title: '7. Borrowing', desc: 'Review equipment and tool borrowing requests.' },
      { element: '[data-tour="director-search-input"]', title: '8. Search Escalated Tickets', desc: 'Filter escalated tickets by reference ID, requester, or building.' },
      { element: '[data-tour="director-btn-approve"], [data-tour="director-btn-delay"]', title: '9. Executive Authorization', desc: 'Approve repairs, delay with a reason, or return for scope changes.' },
      { element: '[data-tour="director-btn-fullinfo"]', title: '10. Detailed Scope Inspection', desc: 'View full repair details, requester contacts, and uploaded photos.' }
    ]
      },
      {
        id: 'director-leau-analytics',
        name: 'LEAU Unit Analytics',
        route: '/director/leau',
        icon: '📊',
        manualSection: 'Section G6: LEAU Ticket Overview',
        roleBadge: 'Director Console',
        summary: 'Review LEAU performance metrics, plant borrowing statistics, and grounds operational health.',
        sections: [
          {
            title: 'Statistics Cards',
            desc: 'Unresolved, resolved, declined, and total request counts',
            details: 'Quick overview of LEAU ticket volumes across all statuses.'
          },
          {
            title: 'Evaluation Averages',
            desc: 'Client feedback ratings for quality, efficiency, and timeliness',
            details: 'Average star ratings from completed service evaluations.'
          },
          {
            title: 'Job Completion Health',
            desc: 'On-time vs overdue job distribution',
            details: 'Breakdown of completed jobs by timeliness performance.'
          },
          {
            title: 'Root Cause Analysis',
            desc: 'Why delays and barriers happen',
            details: 'Top reported operational factors causing timeline extensions or work stoppages.'
          }
        ],
        tourSteps: [
      { element: '[data-tour="admin-page-header"]', title: '1. LEAU Analytics Dashboard', desc: 'Monitor LEAU performance metrics and grounds operational health.' },
      { element: '[data-tour="leau-stats-cards"]', title: '2. Statistics Cards', desc: 'See unresolved, resolved, declined, and total request counts at a glance.' },
      { element: '[data-tour="leau-eval-averages"]', title: '3. Evaluation Averages', desc: 'View client feedback ratings for quality, efficiency, and timeliness.' },
      { element: '[data-tour="leau-completion-health"]', title: '4. Job Completion Health', desc: 'Check on-time vs overdue job distribution.' },
      { element: '[data-tour="leau-root-cause"]', title: '5. Root Cause Analysis', desc: 'See top reported factors causing delays and work stoppages.' }
    ]
      },
      {
        id: 'director-leau',
        name: 'LEAU Ticket Overview & Plant Approvals',
        route: '/director/leau/queues',
        icon: '🌿',
        manualSection: 'Section G6: LEAU Ticket Overview',
        roleBadge: 'Director Console',
        summary: 'Review LEAU requests and approve large landscaping, tree trimming, or bulk plant borrowing projects.',
        sections: [
          {
            title: 'Stage 1 - Escalated Approval Tab',
            desc: 'Major landscaping and bulk plant borrowing escalations',
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
            details: 'Inspect approved plant borrowing, scheduled lawn mowing, and active groundskeeping dispatches.'
          }
        ],
        tabs: [
          { name: 'Escalated Approval', badge: 'Action Required', desc: 'Major landscaping and ceremonial plant requests sent to the Director.' },
          { name: 'Approval Delayed', badge: 'Held', desc: 'Tickets delayed pending inspection or materials.' },
          { name: 'Approved (Ready)', badge: 'Awaiting Staff', desc: 'Approved tickets ready for LEAU staff assignment.' },
          { name: 'Scheduled', badge: 'Upcoming', desc: 'Scheduled grounds visits.' },
          { name: 'Borrowing', badge: 'Plant Borrowing', desc: 'Nursery plant borrowing for ceremonies and exhibits.' },
          { name: 'In Progress', badge: 'Active Site Work', desc: 'Ongoing grounds and beautification work.' }
        ],
        buttons: [
          {
            label: 'Approve / Approve Request',
            type: 'success',
            desc: 'Authorizes major landscaping work or bulk plant borrowing.',
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
            title: 'How to Authorize Major Plant Borrowing for Ceremonies',
            steps: [
              'Click the "Escalated Approval" tab in the LEAU Overview.',
              'Click "View Details" to check requested plant quantities, venue, and return dates.',
              'Click "Approve Request" and confirm. The ticket moves to Approved (Ready) for nursery staff to reserve inventory.'
            ]
          }
        ],
        tourSteps: [
      { element: '[data-tour="admin-page-header"]', title: '1. Landscape & Plant Authorizations', desc: 'Review plant borrowing requests and campus beautification projects.' },
      { element: '[data-tour="director-tab-borrowing"]', title: '2. Borrowing (Plants)', desc: 'Review nursery plant borrowing for ceremonies and exhibits.' },
      { element: '[data-tour="director-tab-pending"]', title: '3. Pending Escalations', desc: 'Review landscaping requests needing executive authorization.' },
      { element: '[data-tour="director-tab-delayed"]', title: '4. Approval Delayed', desc: 'View tickets held pending materials, budget, or inspection.' },
      { element: '[data-tour="director-tab-approved"]', title: '5. Approved (Ready)', desc: 'See approved tickets awaiting staff assignment.' },
      { element: '[data-tour="director-tab-dispatched"]', title: '6. Scheduled / Dispatched', desc: 'Check tickets with assigned workers and work dates.' },
      { element: '[data-tour="director-tab-active"]', title: '7. In Progress', desc: 'Monitor active grounds and beautification work.' },
      { element: '[data-tour="director-search-input"]', title: '8. Search Landscape Requests', desc: 'Search requests by event title, organizer, or venue.' },
      { element: '[data-tour="director-btn-approve"], [data-tour="director-btn-delay"]', title: '9. Authorize Plant Borrowing', desc: 'Approve plant borrowing allocations for university ceremonies and events.' },
      { element: '[data-tour="director-btn-fullinfo"]', title: '10. Review Event Particulars', desc: 'View event details, return schedules, and handling instructions.' }
    ]
      },
      {
        id: 'director-ssu',
        name: 'SSU Reports Overview (Read-Only)',
        route: '/director/ssu/queues',
        icon: '🛡️',
        manualSection: 'Section G7: SSU Reports Overview',
        roleBadge: 'Director Console',
        summary: 'View campus security incident reports and check ongoing investigations handled by SSU.',
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
      { element: '[data-tour="admin-page-header"]', title: '1. SSU Reports Overview', desc: 'View campus security incident reports and check ongoing investigations.' },
      { element: '[data-tour="ssu-queues-tabs"]', title: '2. Stage Tabs', desc: 'Switch between Submitted Reports and Under Investigation queues.' },
      { element: '[data-tour="ssu-incident-workspace"]', title: '3. Incident Workspace', desc: 'View the full list of SSU incident tickets with details and actions.' }
    ]
      },
      {
        id: 'director-ssu-analytics',
        name: 'SSU Unit Analytics',
        route: '/director/ssu',
        icon: '📊',
        manualSection: 'Section G7: SSU Reports Overview',
        roleBadge: 'Director Console',
        summary: 'Review SSU incident statistics, resolution rates, and security operational health.',
        sections: [
          {
            title: 'Statistics Cards',
            desc: 'Unresolved, resolved, declined, and total incident counts',
            details: 'Quick overview of SSU incident volumes across all statuses.'
          },
          {
            title: 'Incident Heatmap',
            desc: 'Incident distribution by category',
            details: 'Visual breakdown of security incidents by type to spot recurring concerns.'
          }
        ],
        tourSteps: [
      { element: '[data-tour="admin-page-header"]', title: '1. SSU Analytics Dashboard', desc: 'Monitor SSU incident statistics and security operational health.' },
      { element: '[data-tour="ssu-stats-cards"]', title: '2. Incident Count Cards', desc: 'See unresolved, resolved, declined, and total incident numbers at a glance.' },
      { element: '[data-tour="ssu-incident-heatmap"]', title: '3. Incident Heatmap', desc: 'View incident distribution by category to spot recurring security concerns.' }
    ]
      },
      {
        id: 'director-settings',
        name: 'Director Settings & Acting Unit Head Coverage',
        route: '/director/settings',
        icon: '⚙️',
        manualSection: 'Section G11: Director Account Settings',
        roleBadge: 'Director Console',
        summary: 'Update your profile, upload your digital signature, manage alerts, and switch coverage for any unit.',
        sections: [
          {
            title: 'Executive Profile Card',
            desc: 'Directorate credentials',
            details: 'Executive Director badge and GSO Director Portal badge. Manage name, university director email address, and password security.'
          },
          {
            title: 'Official Executive Signature Studio',
            desc: 'Directorate approval signee on Job Orders',
            details: 'Auto-rendered above the GSO Director signature line on official Job Orders (QM-GSO-01). Features Draw Signature and Upload Transparent PNG Image.'
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
      { element: '[data-tour="admin-page-header"]', title: '1. Director Settings', desc: 'Set up your executive profile and digital signature.' },
      { element: '[data-tour="director-settings-profile"]', title: '2. Executive Profile', desc: 'Update your profile, contact email, and credentials.' },
      { element: '[data-tour="director-settings-email"]', title: '3. Email Notifications', desc: 'Turn on email alerts for urgent system alerts and delayed ticket escalations.' },
      { element: '[data-tour="director-settings-2fa"]', title: '4. Two-Factor Authentication', desc: 'Enable 6-digit email OTP verification for secure director login.' },
      { element: '[data-tour="director-settings-password"]', title: '5. Password Change', desc: 'Set a new password (minimum 8 characters) to protect your account.' },
      { element: '[data-tour="director-settings-signature"]', title: '6. Executive Signature', desc: 'Draw or upload your official digital signature for Job Orders.' },
      { element: '[data-tour="director-settings-btn-save"]', title: '7. Save Director Settings', desc: 'Save profile changes securely.' },
      { element: '[data-tour="director-settings-coverage-section"]', title: '8. Sub-Unit Coverage Console', desc: 'Temporarily take charge of FGMU, LEAU, or SSU when unit heads are away.' },
      { element: '[data-tour="director-btn-assume-unit"]', title: '9. Take Charge of Unit Operations', desc: 'Switch your session to manage ticket queues for any unit.' }
    ]
      },
      {
        id: 'director-fgmu-archives',
        name: 'FGMU Historical Archives',
        route: '/admin/fgmu/archives',
        icon: '📦',
        manualSection: 'Section G8: FGMU Archives',
        roleBadge: 'Director Console',
        summary: 'View archived Facilities & Grounds Management work orders and historical records.',
        sections: [
          {
            title: 'Archive Search & Filters',
            desc: 'Search and filter archived tickets',
            details: 'Search past completed and declined FGMU requests by ticket ID, requester, or venue. Filter by year and service type.'
          },
          {
            title: 'Bulk Audit Export',
            desc: 'Download historical data',
            details: 'Download official historical data in PDF or CSV formats for university auditing.'
          }
        ],
        tourSteps: [
      { element: '[data-tour="admin-page-header"]', title: '1. FGMU Archives', desc: 'Access archived Facilities & Grounds Management work order records.' },
      { element: '[data-tour="archives-search-input"]', title: '2. Search Historical Records', desc: 'Search past tickets by ticket ID, requester, or venue.' },
      { element: '[data-tour="archives-filter-year"], [data-tour="archives-filter-service"]', title: '3. Filter by Year & Service', desc: 'Isolate records by academic year or service specialization.' },
      { element: '[data-tour="archives-btn-export"]', title: '4. Bulk Audit Export', desc: 'Download historical data in PDF or CSV formats.' }
    ]
      },
      {
        id: 'director-leau-archives',
        name: 'LEAU Historical Archives',
        route: '/admin/leau/archives',
        icon: '📦',
        manualSection: 'Section G9: LEAU Archives',
        roleBadge: 'Director Console',
        summary: 'View archived Landscaping & Environmental Aesthetics work orders and historical records.',
        sections: [
          {
            title: 'Archive Search & Filters',
            desc: 'Search and filter archived tickets',
            details: 'Search past completed and declined LEAU requests by ticket ID, requester, or venue. Filter by year and service type.'
          },
          {
            title: 'Bulk Audit Export',
            desc: 'Download historical data',
            details: 'Download official historical data in PDF or CSV formats for university auditing.'
          }
        ],
        tourSteps: [
      { element: '[data-tour="admin-page-header"]', title: '1. LEAU Archives', desc: 'Access archived Landscaping & Environmental Aesthetics work order records.' },
      { element: '[data-tour="archives-search-input"]', title: '2. Search Historical Records', desc: 'Search past tickets by ticket ID, requester, or venue.' },
      { element: '[data-tour="archives-filter-year"], [data-tour="archives-filter-service"]', title: '3. Filter by Year & Service', desc: 'Isolate records by academic year or service specialization.' },
      { element: '[data-tour="archives-btn-export"]', title: '4. Bulk Audit Export', desc: 'Download historical data in PDF or CSV formats.' }
    ]
      },
      {
        id: 'director-ssu-archives',
        name: 'SSU Historical Archives',
        route: '/admin/ssu/archives',
        icon: '📦',
        manualSection: 'Section G10: SSU Archives',
        roleBadge: 'Director Console',
        summary: 'View archived Safety & Security Services incident reports and historical records.',
        sections: [
          {
            title: 'Archive Search & Filters',
            desc: 'Search and filter archived tickets',
            details: 'Search past completed and declined SSU incidents by ticket ID, reporter, or location. Filter by year and incident type.'
          },
          {
            title: 'Bulk Audit Export',
            desc: 'Download historical data',
            details: 'Download official historical data in PDF or CSV formats for university auditing.'
          }
        ],
        tourSteps: [
      { element: '[data-tour="admin-page-header"]', title: '1. SSU Archives', desc: 'Access archived Safety & Security Services incident report records.' },
      { element: '[data-tour="archives-search-input"]', title: '2. Search Historical Records', desc: 'Search past incidents by ticket ID, reporter, or location.' },
      { element: '[data-tour="archives-filter-year"], [data-tour="archives-filter-service"]', title: '3. Filter by Year & Service', desc: 'Isolate records by academic year or incident type.' },
      { element: '[data-tour="archives-btn-export"]', title: '4. Bulk Audit Export', desc: 'Download historical data in PDF or CSV formats.' }
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
    roleSummary: 'View assigned jobs, check campus room locations, read instructions, and view your work history.',
    pages: [
      {
        id: 'worker-dashboard',
        name: 'My Assigned Work Orders',
        route: '/personnel/dashboard',
        icon: '📲',
        manualSection: 'Section H1: Assigned Work Orders',
        roleBadge: 'Field Personnel',
        summary: 'View tasks assigned to you, check building room locations, read instructions, and see your team members.',
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
      { element: '[data-tour="admin-page-header"]', title: '1. Technician Field Console', desc: 'Manage today\'s assigned repair tasks, on-site locations, and job details.' },
      { element: '[data-tour="worker-tab-active"], [data-tour="worker-tab-emergency"]', title: '2. Active vs Emergency Jobs', desc: 'Filter today\'s tasks between standard assigned work orders and high-priority emergencies.' },
      { element: '[data-tour="worker-search-input"]', title: '3. Search Work Orders', desc: 'Search tasks by ticket reference ID, requester, or building location.' },
      { element: '[data-tour="worker-jobs-table"]', title: '4. Assigned Work Orders Table', desc: 'Inspect designated campus buildings, scheduled visit dates, and assigned crew members.' },
      { element: '[data-tour="worker-btn-fullinfo"]', title: '5. Full Task Information & Notes', desc: 'Click to open the task details modal, view dispatcher notes, and client contact information.' },
      { element: '[data-tour="worker-btn-history"]', title: '6. Accomplishment History', desc: 'Access archived records of previously fulfilled jobs and performance ratings.' }
    ]
      },
      {
        id: 'worker-history',
        name: 'Completed Jobs History',
        route: '/personnel/history',
        icon: '📜',
        manualSection: 'Section H2: Completed Jobs History',
        roleBadge: 'Field Personnel',
        summary: 'Review your past completed jobs, work duration records, and fellow crew members.',
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
      { element: '[data-tour="admin-page-header"]', title: '1. Accomplishment History', desc: 'Review past completed work orders, turnaround metrics, and client satisfaction ratings.' },
      { element: '[data-tour="history-search-input"]', title: '2. Search Accomplished Records', desc: 'Search past completed work orders by ticket reference number, requester, or location.' },
      { element: '[data-tour="history-filter-year"], [data-tour="history-filter-unit"], [data-tour="history-filter-crew"]', title: '3. Filter by Year, Unit & Crew', desc: 'Filter completed jobs by calendar year, department branch, or solo vs team assignments.' },
      { element: '[data-tour="history-records-table"]', title: '4. Archived Work Orders Registry', desc: 'Review completion timestamps, client star ratings, and recorded turnaround times.' }
    ]
      }
    ]
  }
};
