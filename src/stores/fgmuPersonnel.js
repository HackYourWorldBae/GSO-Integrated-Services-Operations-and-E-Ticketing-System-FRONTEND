import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useFgmuPersonnelStore = defineStore('fgmuPersonnel', () => {
  const personnel = ref([
    { id: 1, name: 'Wilmer T. Toribio', role: 'Plumber', status: 'Available', assignedTicket: 'FGMU-TIC-50', ticketTask: 'Main Line Valve Repair', implementationDate: 'Apr 29, 2026', nextAssignment: { ticketId: 'FGMU-TIC-58', task: 'Cafeteria Sink Inspection', date: 'May 03, 2026' } },
    { id: 7, name: 'Michael Johnson', role: 'Plumber', status: 'Working', assignedTicket: 'FGMU-TIC-44', ticketTask: 'Restroom Pipe Leakage', implementationDate: 'Apr 28, 2026', nextAssignment: { ticketId: 'FGMU-TIC-51', task: 'Admin Bldg Drainage Cleanout', date: 'Apr 30, 2026' } },
    { id: 8, name: 'David Lee', role: 'Plumber', status: 'On Leave', assignedTicket: null, ticketTask: null, implementationDate: null, nextAssignment: { ticketId: 'FGMU-TIC-60', task: 'Water Pump Maintenance', date: 'May 05, 2026' } },
    { id: 2, name: 'John Doe', role: 'Electrician', status: 'Working', assignedTicket: 'FGMU-TIC-43', ticketTask: 'Library Lighting Replacement', implementationDate: 'Apr 28, 2026', nextAssignment: { ticketId: 'FGMU-TIC-52', task: 'Gym Breaker Box Inspection', date: 'May 01, 2026' } },
    { id: 9, name: 'Mark Evans', role: 'Electrician', status: 'Available', assignedTicket: 'FGMU-TIC-49', ticketTask: 'Projector Power Outlet Installation', implementationDate: 'Apr 30, 2026', nextAssignment: { ticketId: 'FGMU-TIC-62', task: 'Streetlight Bulb Replacement', date: 'May 04, 2026' } },
    { id: 3, name: 'Alex Smith', role: 'Carpenter', status: 'Working', assignedTicket: 'FGMU-TIC-45', ticketTask: 'Conference Room Table Repair', implementationDate: 'Apr 28, 2026', nextAssignment: { ticketId: 'FGMU-TIC-54', task: 'Door Lock & Hinge Fix', date: 'May 02, 2026' } },
    { id: 10, name: 'Tom Hardy', role: 'Carpenter', status: 'Available', assignedTicket: null, ticketTask: null, implementationDate: null, nextAssignment: { ticketId: 'FGMU-TIC-59', task: 'Cabinet Bookshelf Construction', date: 'May 03, 2026' } },
    { id: 4, name: 'Maria Santos', role: 'Aircon Tech', status: 'On Leave', assignedTicket: null, ticketTask: null, implementationDate: null, nextAssignment: null },
    { id: 11, name: 'Peter Parker', role: 'Aircon Tech', status: 'Working', assignedTicket: 'FGMU-TIC-42', ticketTask: 'Server Room AC Unit Servicing', implementationDate: 'Apr 28, 2026', nextAssignment: { ticketId: 'FGMU-TIC-56', task: 'Filter Cleaning & Freon Refill', date: 'May 01, 2026' } },
    { id: 5, name: 'Robert Fox', role: 'General Repair', status: 'Working', assignedTicket: 'FGMU-TIC-42', ticketTask: 'CEAT Ceiling Tile Replacement', implementationDate: 'Apr 28, 2026', nextAssignment: { ticketId: 'FGMU-TIC-57', task: 'Window Glass Sealant Application', date: 'May 02, 2026' } },
    { id: 12, name: 'Chris Pratt', role: 'General Repair', status: 'Available', assignedTicket: 'FGMU-TIC-47', ticketTask: 'Handrail Welding Fix', implementationDate: 'Apr 29, 2026', nextAssignment: { ticketId: 'FGMU-TIC-61', task: 'Floor Tile Regrouting', date: 'May 04, 2026' } },
    { id: 6, name: 'Sarah Wilson', role: 'Painter', status: 'Available', assignedTicket: null, ticketTask: null, implementationDate: null, nextAssignment: { ticketId: 'FGMU-TIC-63', task: 'Auditorium Stage Repainting', date: 'May 06, 2026' } },
    { id: 13, name: 'Emily Clark', role: 'Painter', status: 'Working', assignedTicket: 'FGMU-TIC-46', ticketTask: 'Hallway Wall Touch-up', implementationDate: 'Apr 28, 2026', nextAssignment: { ticketId: 'FGMU-TIC-64', task: 'Exterior Fence Waterproofing', date: 'May 05, 2026' } },
  ]);

  const groupedPersonnel = computed(() => {
    return personnel.value.reduce((groups, worker) => {
      if (!groups[worker.role]) groups[worker.role] = [];
      groups[worker.role].push(worker);
      return groups;
    }, {});
  });

  const toggleWorkerStatus = (workerId) => {
    const worker = personnel.value.find(w => w.id === workerId);
    if (!worker || worker.status === 'Working') return;
    worker.status = worker.status === 'Available' ? 'On Leave' : 'Available';
  };

  const setWorkerStatus = (workerId, status) => {
    const worker = personnel.value.find(w => w.id === workerId);
    if (!worker) return;
    worker.status = status;
    // Clear assignment data when reverting to Available or On Leave
    if (status === 'Available' || status === 'On Leave') {
      worker.assignedTicket = null;
      worker.ticketTask = null;
      worker.implementationDate = null;
    }
  };

  // Assign a worker to a ticket without starting work yet
  const assignWorker = (workerId, ticketId, implementationDate, ticketTask = 'Facilities Maintenance Work') => {
    const worker = personnel.value.find(w => w.id === workerId);
    if (!worker) return;
    worker.assignedTicket = ticketId;
    worker.ticketTask = ticketTask;
    worker.implementationDate = implementationDate;
    // Status stays Available — the "Assigned" state is driven by assignedTicket
  };

  // Remove an assignment without changing leave/working status
  const unassignWorker = (workerId) => {
    const worker = personnel.value.find(w => w.id === workerId);
    if (!worker) return;
    worker.assignedTicket = null;
    worker.ticketTask = null;
    worker.implementationDate = null;
  };

  // Update implementation date for all workers assigned to a specific ticket
  const updateTicketDate = (ticketId, date) => {
    personnel.value.forEach(w => {
      if (w.assignedTicket === ticketId) {
        w.implementationDate = date;
      }
    });
  };

  // Transition an assigned worker to actively Working
  const startWork = (workerId) => {
    const worker = personnel.value.find(w => w.id === workerId);
    if (!worker || !worker.assignedTicket) return;
    worker.status = 'Working';
  };

  const ticketDatabase = {
    'FGMU-TIC-42': { id: 'FGMU-TIC-42', type: 'AC Repair', location: 'CET Building R-204', requester: 'Prof. Garcia', status: 'Urgent', desc: 'Server Room AC Unit Servicing', date: 'Apr 28, 2026' },
    'FGMU-TIC-43': { id: 'FGMU-TIC-43', type: 'Electrical', location: 'Library Hall', requester: 'Ms. Santos', status: 'Pending', desc: 'Library Lighting Replacement', date: 'Apr 28, 2026' },
    'FGMU-TIC-44': { id: 'FGMU-TIC-44', type: 'Plumbing', location: 'Admin Restroom', requester: 'Engr. Reyes', status: 'Urgent', desc: 'Restroom Pipe Leakage', date: 'Apr 28, 2026' },
    'FGMU-TIC-45': { id: 'FGMU-TIC-45', type: 'Carpentry', location: 'Gymnasium Stage', requester: 'Coach Mike', status: 'Pending', desc: 'Conference Room Table Repair', date: 'Apr 28, 2026' },
    'FGMU-TIC-46': { id: 'FGMU-TIC-46', type: 'Painting Works', location: 'Admin Hallway', requester: 'Admin Office', status: 'Pending', desc: 'Hallway Wall Touch-up', date: 'Apr 28, 2026' },
    'FGMU-TIC-47': { id: 'FGMU-TIC-47', type: 'Welding', location: 'Stairwell B', requester: 'Safety Office', status: 'Pending', desc: 'Handrail Welding Fix', date: 'Apr 29, 2026' },
    'FGMU-TIC-49': { id: 'FGMU-TIC-49', type: 'Electrical', location: 'Room 302', requester: 'Prof. Cruz', status: 'Pending', desc: 'Projector Power Outlet Installation', date: 'Apr 30, 2026' },
    'FGMU-TIC-50': { id: 'FGMU-TIC-50', type: 'Plumbing', location: 'Main Building', requester: 'Facilities Dept', status: 'Pending', desc: 'Main Line Valve Repair', date: 'Apr 29, 2026' },
  };

  const getTicketInfo = (ticketId) => {
    return ticketDatabase[ticketId] || {
      id: ticketId,
      type: 'Facilities Maintenance',
      location: 'University Building',
      requester: 'GSO Administration',
      status: 'Pending',
      desc: 'Scheduled Facilities Maintenance Task',
      date: 'May 01, 2026'
    };
  };

  return {
    personnel,
    groupedPersonnel,
    toggleWorkerStatus,
    setWorkerStatus,
    assignWorker,
    unassignWorker,
    updateTicketDate,
    startWork,
    getTicketInfo,
  };
});
