import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useLeauPersonnelStore = defineStore('leauPersonnel', () => {
  const personnel = ref([
    { id: 1,  name: 'Ricardo Dalisay',   role: 'Head Gardener',      status: 'Available', assignedTicket: 'LEAU-TIC-30', ticketTask: 'Campus Main Lawn Mowing', implementationDate: 'Apr 29, 2026', nextAssignment: { ticketId: 'LEAU-TIC-35', task: 'Shrub Pruning along Avenue', date: 'May 03, 2026' } },
    { id: 2,  name: 'Emma Watson',        role: 'Landscaper',         status: 'Working',   assignedTicket: 'LEAU-TIC-18', ticketTask: 'Quadrangle Flower Bed Planting', implementationDate: 'Apr 16, 2026', nextAssignment: { ticketId: 'LEAU-TIC-36', task: 'Soil Hauling & Leveling', date: 'May 02, 2026' } },
    { id: 3,  name: 'Steve Rogers',       role: 'Maintenance Staff',  status: 'Available', assignedTicket: null, ticketTask: null, implementationDate: null, nextAssignment: { ticketId: 'LEAU-TIC-37', task: 'Drainage Canal Grubbing', date: 'May 04, 2026' } },
    { id: 4,  name: 'Bruce Banner',       role: 'Groundskeeper',      status: 'On Leave',  assignedTicket: null, ticketTask: null, implementationDate: null, nextAssignment: null },
    { id: 5,  name: 'Natasha Romanoff',   role: 'Gardener',           status: 'Available', assignedTicket: 'LEAU-TIC-32', ticketTask: 'Auditorium Stage Plants Setup', implementationDate: 'Apr 30, 2026', nextAssignment: { ticketId: 'LEAU-TIC-38', task: 'Potted Plants Relocation', date: 'May 05, 2026' } },
    { id: 6,  name: 'Tony Stark',         role: 'Equipment Operator', status: 'Working',   assignedTicket: 'LEAU-TIC-20', ticketTask: 'Heavy Lawn Mowing & Trimming', implementationDate: 'Apr 17, 2026', nextAssignment: { ticketId: 'LEAU-TIC-39', task: 'Chainsaw Tree Cutting', date: 'May 01, 2026' } },
    { id: 7,  name: 'Wanda Maximoff',     role: 'Gardener',           status: 'Available', assignedTicket: null, ticketTask: null, implementationDate: null, nextAssignment: { ticketId: 'LEAU-TIC-40', task: 'Weeding at Botanical Garden', date: 'May 03, 2026' } },
    { id: 8,  name: 'Vision',             role: 'Maintenance Staff',  status: 'Working',   assignedTicket: 'LEAU-TIC-19', ticketTask: 'Hallway Disinfection Spraying', implementationDate: 'Apr 16, 2026', nextAssignment: { ticketId: 'LEAU-TIC-41', task: 'Waste Hauling to Disposal', date: 'May 02, 2026' } },
    { id: 9,  name: 'Sam Wilson',         role: 'Landscaper',         status: 'Available', assignedTicket: null, ticketTask: null, implementationDate: null, nextAssignment: { ticketId: 'LEAU-TIC-42', task: 'New Sapling Planting', date: 'May 06, 2026' } },
    { id: 10, name: 'Bucky Barnes',       role: 'Groundskeeper',      status: 'Available', assignedTicket: null, ticketTask: null, implementationDate: null, nextAssignment: null },
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
    if (status === 'Available' || status === 'On Leave') {
      worker.assignedTicket = null;
      worker.ticketTask = null;
      worker.implementationDate = null;
    }
  };

  const assignWorker = (workerId, ticketId, implementationDate, ticketTask = 'Janitorial & Landscaping Work') => {
    const worker = personnel.value.find(w => w.id === workerId);
    if (!worker) return;
    worker.assignedTicket = ticketId;
    worker.ticketTask = ticketTask;
    worker.implementationDate = implementationDate;
  };

  const unassignWorker = (workerId) => {
    const worker = personnel.value.find(w => w.id === workerId);
    if (!worker) return;
    worker.assignedTicket = null;
    worker.ticketTask = null;
    worker.implementationDate = null;
  };

  const updateTicketDate = (ticketId, date) => {
    personnel.value.forEach(w => {
      if (w.assignedTicket === ticketId) {
        w.implementationDate = date;
      }
    });
  };

  const startWork = (workerId) => {
    const worker = personnel.value.find(w => w.id === workerId);
    if (!worker || !worker.assignedTicket) return;
    worker.status = 'Working';
  };

  const ticketDatabase = {
    'LEAU-TIC-18': { id: 'LEAU-TIC-18', type: 'Planting', location: 'Quadrangle', requester: 'Dr. Santos', status: 'Urgent', desc: 'Quadrangle Flower Bed Planting', date: 'Apr 15, 2026' },
    'LEAU-TIC-19': { id: 'LEAU-TIC-19', type: 'Disinfection', location: 'Main Hallway', requester: 'Prof. Reyes', status: 'Pending', desc: 'Hallway Disinfection Spraying', date: 'Apr 16, 2026' },
    'LEAU-TIC-20': { id: 'LEAU-TIC-20', type: 'Mowing', location: 'Football Field', requester: 'Coach Mike', status: 'In Progress', desc: 'Heavy Lawn Mowing & Trimming', date: 'Apr 17, 2026' },
    'LEAU-TIC-30': { id: 'LEAU-TIC-30', type: 'Mowing', location: 'Campus Main Lawn', requester: 'Admin Office', status: 'Pending', desc: 'Campus Main Lawn Mowing', date: 'Apr 28, 2026' },
    'LEAU-TIC-32': { id: 'LEAU-TIC-32', type: 'Decoration', location: 'University Auditorium', requester: 'Events Committee', status: 'Pending', desc: 'Auditorium Stage Plants Setup', date: 'Apr 29, 2026' },
    'LEAU-TIC-35': { id: 'LEAU-TIC-35', type: 'Pruning', location: 'University Avenue', requester: 'Safety Office', status: 'Pending', desc: 'Shrub Pruning along Avenue', date: 'May 01, 2026' },
    'LEAU-TIC-36': { id: 'LEAU-TIC-36', type: 'Hauling', location: 'Botanical Garden', requester: 'Bio Dept', status: 'Pending', desc: 'Soil Hauling & Leveling', date: 'May 01, 2026' },
    'LEAU-TIC-37': { id: 'LEAU-TIC-37', type: 'Cleaning', location: 'Drainage Canal', requester: 'Facilities Dept', status: 'Pending', desc: 'Drainage Canal Grubbing', date: 'May 02, 2026' },
    'LEAU-TIC-38': { id: 'LEAU-TIC-38', type: 'Planting', location: 'Admin Building Lobby', requester: 'HR Dept', status: 'Pending', desc: 'Potted Plants Relocation', date: 'May 03, 2026' },
    'LEAU-TIC-39': { id: 'LEAU-TIC-39', type: 'Pruning', location: 'Parking Lot B', requester: 'Security Dept', status: 'Pending', desc: 'Chainsaw Tree Cutting', date: 'Apr 30, 2026' },
    'LEAU-TIC-40': { id: 'LEAU-TIC-40', type: 'Weeding', location: 'Botanical Garden', requester: 'Bio Dept', status: 'Pending', desc: 'Weeding at Botanical Garden', date: 'May 02, 2026' },
    'LEAU-TIC-41': { id: 'LEAU-TIC-41', type: 'Hauling', location: 'Disposal Area', requester: 'Janitorial Supervisor', status: 'Pending', desc: 'Waste Hauling to Disposal', date: 'May 01, 2026' },
    'LEAU-TIC-42': { id: 'LEAU-TIC-42', type: 'Planting', location: 'Library Garden', requester: 'Chief Librarian', status: 'Pending', desc: 'New Sapling Planting', date: 'May 04, 2026' },
  };

  const getTicketInfo = (ticketId) => {
    return ticketDatabase[ticketId] || {
      id: ticketId,
      type: 'Landscaping Request',
      location: 'University Campus Area',
      requester: 'GSO Administration',
      status: 'Pending',
      desc: 'Scheduled Janitorial & Landscaping Maintenance Work',
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
