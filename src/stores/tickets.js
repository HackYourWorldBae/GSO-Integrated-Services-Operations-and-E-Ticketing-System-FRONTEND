import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { sanitizeObject } from '@/utils/security';

export const useTicketsStore = defineStore('tickets', () => {
  // Initial data placeholders (Mock seed data ready for backend API integration)
  const tickets = ref([
    // --- FGMU TICKETS ---
    {
      id: 1,
      ticketId: 'FGMU-TIC-42-2026',
      service: 'Equipment Maintenance',
      unit: 'FGMU',
      description: 'The air conditioning unit in the faculty room is leaking water and needs immediate attention.',
      status: 'pending',
      statusLabel: 'Pending Approval',
      date: 'Apr 18, 2026',
      requestedBy: 'Jane Smith (Faculty)',
      location: 'CET Faculty Room',
      office_room: 'Room 204',
      attachments: ['ac_leak_photo_1.jpg', 'room_302_ac.png'],
      isDeclining: false,
      declineReason: '',
      currentStep: 1,
      assignedWorker: null,
      implementationDate: null,
      materials: [],
      isClosed: false
    },
    {
      id: 2,
      ticketId: 'FGMU-TIC-43-2026',
      service: 'Electrical Repair',
      unit: 'FGMU',
      description: 'The fluorescent light fixture in Room 301 of the Engineering Building has stopped working. Need to replace ballast and starter.',
      status: 'approved',
      statusLabel: 'Queued for Dispatch',
      date: 'Apr 17, 2026',
      requestedBy: 'Juan Dela Cruz (Faculty)',
      location: 'College of Engineering Complex (CE)',
      office_room: 'Room 301',
      attachments: ['light_fixture.jpg'],
      currentStep: 2,
      assignedWorker: null,
      implementationDate: 'Apr 22, 2026',
      materials: ['Ballast', 'Starter', 'Electrical tape', 'Screwdriver set'],
      isClosed: false
    },
    {
      id: 3,
      ticketId: 'FGMU-TIC-44-2026',
      service: 'Plumbing Repair',
      unit: 'FGMU',
      description: 'Leaking pipe in the 2nd-floor washroom. Needs urgent attention.',
      status: 'processing',
      statusLabel: 'Job Started',
      date: 'Apr 16, 2026',
      requestedBy: 'Admin Office',
      location: 'Administration Building',
      office_room: '2nd Floor Washroom',
      attachments: [],
      currentStep: 3,
      assignedWorker: 'Wilmer T. Toribio',
      implementationDate: 'Apr 18, 2026',
      materials: ['PVC Pipe 1/2"', 'Teflon Tape', 'Solvent Cement'],
      isClosed: false
    },
    {
      id: 4,
      ticketId: 'FGMU-TIC-15-2026',
      service: 'Plumbing Repair',
      unit: 'FGMU',
      description: 'Fixed the leaking faucet in the CET Main Men\'s restroom.',
      status: 'resolved',
      statusLabel: 'Completed',
      date: 'Jan 10, 2026',
      requestedBy: 'Jane Smith (Faculty)',
      location: 'College of Engineering Complex (CE)',
      office_room: '1st Floor Restroom',
      attachments: [],
      currentStep: 4,
      assignedWorker: 'Wilmer T. Toribio',
      implementationDate: 'Jan 11, 2026',
      isClosed: true
    },

    // --- LEAU TICKETS ---
    {
      id: 5,
      ticketId: 'LEAU-TIC-18-2026',
      service: 'Janitorial & Landscaping',
      unit: 'LEAU',
      description: 'Deep cleaning and quadrangle flower bed planting preparation for foundation day.',
      status: 'pending',
      statusLabel: 'Pending Approval',
      date: 'Apr 18, 2026',
      requestedBy: 'Dr. Santos (CAS)',
      location: 'BSU Gymnasium & Quadrangle',
      office_room: 'Main Grounds',
      attachments: ['quadrangle_area.jpg'],
      isDeclining: false,
      declineReason: '',
      currentStep: 1,
      assignedWorker: null,
      implementationDate: null,
      materials: [],
      isClosed: false
    },
    {
      id: 6,
      ticketId: 'LEAU-TIC-19-2026',
      service: 'Disinfection Spraying',
      unit: 'LEAU',
      description: 'Hallway disinfection spraying across all 3 floors of the Science Building.',
      status: 'approved',
      statusLabel: 'Queued for Dispatch',
      date: 'Apr 16, 2026',
      requestedBy: 'Prof. Reyes',
      location: 'College of Natural Sciences Building (CNS)',
      office_room: 'All Floors',
      attachments: [],
      currentStep: 2,
      assignedWorker: null,
      implementationDate: 'Apr 20, 2026',
      materials: ['Disinfectant Solution', 'Mist Sprayer Machine', 'PPE Suits'],
      isClosed: false
    },
    {
      id: 7,
      ticketId: 'LEAU-TIC-20-2026',
      service: 'Heavy Lawn Mowing',
      unit: 'LEAU',
      description: 'Heavy lawn mowing & trimming at the main athletic oval and football field.',
      status: 'processing',
      statusLabel: 'Job Started',
      date: 'Apr 15, 2026',
      requestedBy: 'Coach Mike',
      location: 'BSU Athletic Oval & Grandstand',
      office_room: 'Football Field',
      attachments: [],
      currentStep: 3,
      assignedWorker: 'Ricardo Dalisay',
      implementationDate: 'Apr 17, 2026',
      materials: ['Gasoline Fuel', 'Trimmer Line', 'Lawn Mower Blade'],
      isClosed: false
    },
    {
      id: 8,
      ticketId: 'LEAU-TIC-12-2026',
      service: 'Landscaping',
      unit: 'LEAU',
      description: 'Trimming of overgrown branches near the power lines at the parking area.',
      status: 'resolved',
      statusLabel: 'Completed',
      date: 'Feb 10, 2026',
      requestedBy: 'Jane Smith (Faculty)',
      location: 'Administration Building Parking Area',
      office_room: 'Parking Lot B',
      attachments: [],
      currentStep: 4,
      assignedWorker: 'Ricardo Dalisay',
      implementationDate: 'Feb 11, 2026',
      isClosed: true
    },

    // --- SSU TICKETS ---
    {
      id: 9,
      ticketId: 'SSU-TIC-07-2026',
      service: 'Vehicle Pass Application',
      unit: 'SSU',
      description: 'Annual vehicle pass sticker application for Toyota Fortuner (ABC-1234).',
      status: 'pending',
      statusLabel: 'Pending Verification',
      date: 'Apr 18, 2026',
      requestedBy: 'Jane Smith (Faculty)',
      plate_no: 'ABC-1234',
      vehicle_type: 'SUV',
      make_series: 'Toyota Fortuner',
      color: 'White',
      address: 'Brgy. Alangilan, Batangas City',
      chargeSlip: 'CS-2026-001',
      attachments: ['or_cr_copy.pdf', 'faculty_id.pdf'],
      currentStep: 1,
      isClosed: false
    },
    {
      id: 10,
      ticketId: 'SSU-TIC-24-2026',
      service: 'Incident Report',
      unit: 'SSU',
      description: 'Minor collision at the North Parking gate involving two private vehicles.',
      status: 'pending',
      statusLabel: 'Under Review',
      date: 'Apr 18, 2026',
      requestedBy: 'Security Guard Officer',
      incident_type: 'Road Accident',
      when: 'Apr 18, 2026 @ 10:30 AM',
      where: 'North Parking Gate',
      how: 'A white sedan reversing from a slot bumped into an incoming SUV.',
      actionsTaken: 'Interviewed witnesses and reviewed CCTV footage.',
      attachments: ['collision_photo_1.jpg'],
      currentStep: 1,
      isClosed: false
    },
    {
      id: 11,
      ticketId: 'SSU-TIC-01-2026',
      service: 'Vehicle Pass Application',
      unit: 'SSU',
      description: 'Vehicle pass sticker issued for Honda Civic (XYZ-9876).',
      status: 'resolved',
      statusLabel: 'Sticker Issued',
      date: 'Mar 15, 2026',
      requestedBy: 'Juan Dela Cruz (Faculty)',
      plate_no: 'XYZ-9876',
      vehicle_type: 'Sedan',
      make_series: 'Honda Civic',
      color: 'Black',
      address: 'Poblacion, La Trinidad',
      currentStep: 4,
      isClosed: true
    },

    // --- TASU TICKETS ---
    {
      id: 12,
      ticketId: 'TASU-TIC-11-2026',
      service: 'Vehicle Request',
      unit: 'TASU',
      description: 'Requesting a van for a department field trip to the National Museum.',
      status: 'pending',
      statusLabel: 'Pending Approval',
      date: 'Apr 18, 2026',
      requestedBy: 'Jane Smith (Faculty)',
      destination: 'National Museum, Manila',
      passengers: 12,
      time: '06:00 AM',
      return_time: '08:00 PM',
      purpose: 'Educational Field Trip for Fine Arts Students',
      attachments: ['travel_order_draft.pdf'],
      isDeclining: false,
      declineReason: '',
      currentStep: 1,
      assignedVehicle: null,
      assignedWorker: null,
      isClosed: false
    },
    {
      id: 13,
      ticketId: 'TRP-2026-015',
      service: 'Vehicle Request',
      unit: 'TASU',
      description: 'Transport a group of 15 students to the experimental farm in La Trinidad for their agriculture practicals.',
      status: 'processing',
      statusLabel: 'On Route / In Progress',
      date: 'Apr 16, 2026',
      requestedBy: 'Prof. Maria Santos',
      destination: 'La Trinidad Experimental Farm',
      passengers: 15,
      time: '08:00 AM - 03:00 PM',
      purpose: 'Agriculture Practicals Field Trip',
      assignedVehicle: 'Toyota Hiace (SFS 625)',
      assignedWorker: 'Wilmer T. Toribio',
      currentStep: 3,
      materials: ['Travel Order', 'Fuel Slip', 'Vehicle Keys'],
      isClosed: false
    },
    {
      id: 14,
      ticketId: 'TASU-TIC-05-2026',
      service: 'Vehicle Request',
      unit: 'TASU',
      description: 'Transport to Regional Conference in Clark, Pampanga.',
      status: 'resolved',
      statusLabel: 'Trip Completed',
      date: 'Mar 10, 2026',
      requestedBy: 'Jane Smith (Faculty)',
      destination: 'Clark Regional Convention Center',
      passengers: 6,
      time: '05:00 AM - 09:00 PM',
      purpose: 'Regional Academic Conference',
      assignedVehicle: 'Toyota Coaster Bus',
      assignedWorker: 'Homer D. Cuilan',
      currentStep: 4,
      isClosed: true
    }
  ]);

  // --- GETTERS ---
  const allTickets = computed(() => tickets.value);

  const getTicketsByUser = (userNameOrId) => {
    if (!userNameOrId) return tickets.value.filter(t => !t.isClosed);
    return tickets.value.filter(t => 
      !t.isClosed && 
      (t.requestedBy?.toLowerCase().includes(userNameOrId.toLowerCase()) || 
       userNameOrId.toLowerCase().includes('jane') && t.requestedBy?.toLowerCase().includes('jane'))
    );
  };

  const getCompletedTicketsByUser = (userNameOrId) => {
    if (!userNameOrId) return tickets.value.filter(t => t.status === 'resolved' || t.status === 'completed' || t.isClosed);
    return tickets.value.filter(t => 
      (t.status === 'resolved' || t.status === 'completed' || t.isClosed) && 
      (t.requestedBy?.toLowerCase().includes(userNameOrId.toLowerCase()) || 
       userNameOrId.toLowerCase().includes('jane') && t.requestedBy?.toLowerCase().includes('jane'))
    );
  };

  const pendingTicketsByUnit = (unitName) => {
    return tickets.value.filter(t => t.unit === unitName && t.status === 'pending');
  };

  const dispatchedOrScheduledTickets = (unitName) => {
    return tickets.value.filter(t => 
      t.unit === unitName && 
      (t.status === 'approved' || t.status === 'scheduled')
    );
  };

  const activeTicketsByUnit = (unitName) => {
    return tickets.value.filter(t => 
      t.unit === unitName && 
      (t.status === 'processing' || t.status === 'in_progress' || t.status === 'on_route' || t.status === 'In Progress' || t.status === 'On Route')
    );
  };

  const completedTicketsByUnit = (unitName) => {
    return tickets.value.filter(t => 
      t.unit === unitName && 
      (t.status === 'resolved' || t.status === 'completed' || t.status === 'closed' || t.isClosed)
    );
  };

  const getTicketsByAssignedWorker = (workerName) => {
    if (!workerName) return tickets.value.filter(t => t.status === 'processing' || t.status === 'approved');
    return tickets.value.filter(t => 
      (t.assignedWorker?.toLowerCase() === workerName.toLowerCase() || 
       !t.assignedWorker && (t.status === 'processing' || t.status === 'approved')) &&
      !t.isClosed
    );
  };

  // --- ACTIONS ---
  const generateId = (unitPrefix) => {
    const year = new Date().getFullYear();
    const count = tickets.value.filter(t => t.unit === unitPrefix).length + 45;
    return `${unitPrefix}-TIC-${count}-${year}`;
  };

  const submitConsolidatedRequest = (rawPayload, userObj) => {
    const payload = sanitizeObject(rawPayload || {});
    const requesterName = userObj ? `${userObj.first_name || ''} ${userObj.last_name || ''}`.trim() : 'Jane Smith (Faculty)';
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    // 1. FGMU Intake
    if (payload.fgmu && payload.fgmu.services && payload.fgmu.services.length > 0) {
      const details = payload.fgmu.details || {};
      payload.fgmu.services.forEach(srv => {
        const newTicket = {
          id: Date.now() + Math.floor(Math.random() * 1000),
          ticketId: generateId('FGMU'),
          service: srv.service || 'Structure & Finishes Maintenance',
          unit: 'FGMU',
          description: srv.description || details.job_description || 'Maintenance request submitted via Service Intake.',
          status: 'pending',
          statusLabel: 'Pending Approval',
          date: dateStr,
          requestedBy: requesterName,
          location: details.college_building || 'Main Campus',
          office_room: details.office_room || 'N/A',
          attachments: payload.fgmu.files || [],
          isDeclining: false,
          declineReason: '',
          currentStep: 1,
          assignedWorker: null,
          implementationDate: null,
          materials: [],
          isClosed: false
        };
        tickets.value.unshift(newTicket);
      });
    }

    // 2. LEAU Intake
    if (payload.leau && payload.leau.services && payload.leau.services.length > 0) {
      const details = payload.leau.details || {};
      payload.leau.services.forEach(srv => {
        const newTicket = {
          id: Date.now() + Math.floor(Math.random() * 1000) + 1,
          ticketId: generateId('LEAU'),
          service: srv.service || 'Janitorial & Landscaping Work',
          unit: 'LEAU',
          description: srv.description || details.job_description || 'Grounds & Janitorial request submitted via Service Intake.',
          status: 'pending',
          statusLabel: 'Pending Approval',
          date: dateStr,
          requestedBy: requesterName,
          location: details.college_building || 'Main Campus',
          office_room: details.office_room || 'N/A',
          attachments: payload.leau.files || [],
          isDeclining: false,
          declineReason: '',
          currentStep: 1,
          assignedWorker: null,
          implementationDate: null,
          materials: [],
          isClosed: false
        };
        tickets.value.unshift(newTicket);
      });
    }

    // 3. SSU Intake
    if (payload.ssu) {
      if (payload.ssu.vehiclePass) {
        const vp = payload.ssu.vehiclePass;
        const newTicket = {
          id: Date.now() + Math.floor(Math.random() * 1000) + 2,
          ticketId: generateId('SSU'),
          service: 'Vehicle Pass Application',
          unit: 'SSU',
          description: `Vehicle pass application for ${vp.vehicleDetails?.makeSeries || 'Vehicle'} (${vp.vehicleDetails?.plateNo || 'N/A'})`,
          status: 'pending',
          statusLabel: 'Pending Verification',
          date: dateStr,
          requestedBy: requesterName,
          plate_no: vp.vehicleDetails?.plateNo || '',
          vehicle_type: vp.vehicleDetails?.typeColor || '',
          make_series: vp.vehicleDetails?.makeSeries || '',
          color: vp.vehicleDetails?.typeColor || '',
          address: vp.completeAddress || '',
          attachments: vp.files || [],
          currentStep: 1,
          isClosed: false
        };
        tickets.value.unshift(newTicket);
      }
      if (payload.ssu.incidentReport) {
        const inc = payload.ssu.incidentReport;
        const newTicket = {
          id: Date.now() + Math.floor(Math.random() * 1000) + 3,
          ticketId: generateId('SSU'),
          service: 'Incident Report',
          unit: 'SSU',
          description: inc.how || 'Incident reported to campus security.',
          status: 'pending',
          statusLabel: 'Under Review',
          date: dateStr,
          requestedBy: requesterName,
          incident_type: inc.incidents?.join(', ') || inc.otherIncident || 'General Incident',
          when: inc.when || dateStr,
          where: inc.where || 'Campus Area',
          how: inc.how || '',
          actionsTaken: 'Report logged. Pending security officer review.',
          attachments: [],
          currentStep: 1,
          isClosed: false
        };
        tickets.value.unshift(newTicket);
      }
    }

    // 4. TASU Intake
    if (payload.tasu) {
      const ts = payload.tasu;
      const newTicket = {
        id: Date.now() + Math.floor(Math.random() * 1000) + 4,
        ticketId: generateId('TASU'),
        service: 'Vehicle Request',
        unit: 'TASU',
        description: ts.purposeOfTravel || 'University vehicle booking request.',
        status: 'pending',
        statusLabel: 'Pending Approval',
        date: dateStr,
        requestedBy: requesterName,
        destination: ts.destination || 'N/A',
        passengers: ts.numberOfPassengers || 1,
        time: ts.time || '08:00 AM',
        attachments: ts.travelOrderAttachments || [],
        isDeclining: false,
        declineReason: '',
        currentStep: 1,
        assignedVehicle: null,
        assignedWorker: null,
        isClosed: false
      };
      tickets.value.unshift(newTicket);
    }

    // 5. Direct single-ticket / quick dispatch intake (e.g., from TASU_DispatchBoard or quick actions)
    if (payload.unit && !payload.fgmu && !payload.leau && !payload.ssu && !payload.tasu) {
      const unit = payload.unit;
      const newTicket = {
        ...payload,
        id: payload.id || Date.now() + Math.floor(Math.random() * 1000) + 5,
        ticketId: payload.ticketId || generateId(unit),
        service: payload.service || 'Service Request',
        unit: unit,
        description: payload.description || 'Direct request created.',
        status: payload.status || 'approved',
        statusLabel: payload.statusLabel || (unit === 'TASU' ? 'Trip Scheduled' : 'Queued for Dispatch'),
        date: payload.date || dateStr,
        requestedBy: payload.requestedBy || requesterName,
        attachments: payload.attachments || [],
        currentStep: payload.currentStep || 2,
        isClosed: payload.isClosed || false
      };
      tickets.value.unshift(newTicket);
      return newTicket;
    }

    return tickets.value[0] || null;
  };

  const approveTicket = (ticketIdOrCode) => {
    const t = tickets.value.find(item => item.id === ticketIdOrCode || item.ticketId === ticketIdOrCode);
    if (t) {
      t.status = 'approved';
      t.statusLabel = t.unit === 'TASU' ? 'Trip Scheduled' : 'Queued for Dispatch';
      t.currentStep = 2;
    }
    return t || null;
  };

  const declineTicket = (ticketIdOrCode, reason) => {
    const cleanReason = sanitizeObject(reason);
    const t = tickets.value.find(item => item.id === ticketIdOrCode || item.ticketId === ticketIdOrCode);
    if (t) {
      t.status = 'declined';
      t.statusLabel = 'Declined';
      t.declineReason = cleanReason || 'Request rejected by Administrator.';
      t.isDeclining = false;
    }
    return t || null;
  };

  const assignTicketToWorker = (ticketIdOrCode, workerName, scheduleDate, taskNotes) => {
    const cleanWorker = sanitizeObject(workerName);
    const cleanNotes = sanitizeObject(taskNotes);
    const t = tickets.value.find(item => item.id === ticketIdOrCode || item.ticketId === ticketIdOrCode);
    if (t) {
      t.assignedWorker = cleanWorker;
      t.implementationDate = scheduleDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      t.status = 'processing';
      t.statusLabel = t.unit === 'TASU' ? 'On Route / In Progress' : 'Job Started';
      t.currentStep = 3;
      if (cleanNotes) t.description = `${t.description} [Dispatcher Note: ${cleanNotes}]`;
    }
    return t || null;
  };

  const completeTicket = (ticketIdOrCode) => {
    const t = tickets.value.find(item => item.id === ticketIdOrCode || item.ticketId === ticketIdOrCode);
    if (t) {
      t.status = 'resolved';
      t.statusLabel = 'Completed';
      t.currentStep = 4;
      t.isClosed = true;
    }
    return t || null;
  };

  return {
    tickets,
    allTickets,
    getTicketsByUser,
    getCompletedTicketsByUser,
    pendingTicketsByUnit,
    dispatchedOrScheduledTickets,
    activeTicketsByUnit,
    completedTicketsByUnit,
    getTicketsByAssignedWorker,
    submitConsolidatedRequest,
    approveTicket,
    declineTicket,
    assignTicketToWorker,
    completeTicket
  };
}, {
  persist: true
});
