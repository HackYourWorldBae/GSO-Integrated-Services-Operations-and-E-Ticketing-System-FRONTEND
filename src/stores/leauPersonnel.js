import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/api/client';

export const useLeauPersonnelStore = defineStore('leauPersonnel', () => {
  const personnel = ref([]);

  const groupedPersonnel = computed(() => {
    return personnel.value.reduce((groups, worker) => {
      // Map specialty to role for frontend backward compatibility
      const role = worker.specialty || worker.role;
      if (!groups[role]) groups[role] = [];
      groups[role].push(worker);
      return groups;
    }, {});
  });

  const fetchPersonnel = async () => {
    try {
      const response = await api.get('personnel/LEAU');
      if (response.data?.data?.personnel && response.data.data.personnel.length > 0) {
        personnel.value = response.data.data.personnel.map(p => ({
          ...p,
          status: p.status === 'available' ? 'Available' : p.status === 'working' ? 'Working' : p.status === 'on_leave' ? 'On Leave' : p.status === 'on_trip' ? 'On Trip' : p.status,
          role: p.specialty,
          // If they have an active assignment, use it
          assignedTicket: p.assigned_ticket_id || null,
          ticketTask: p.ticket_task || null,
          implementationDate: p.implementation_date || null,
          nextAssignmentId: p.next_assignment_id || null,
          nextTicketTask: p.next_ticket_task || null
        }));
      } else {
        personnel.value = [];
      }
    } catch (error) {
      console.error('Failed to fetch LEAU personnel:', error);
      if (personnel.value.length === 0) {
        personnel.value = [];
      }
    }
  };

  const toggleWorkerStatus = async (workerId) => {
    const worker = personnel.value.find(w => w.id === workerId);
    if (!worker || worker.status === 'Working') return;
    const newStatusBackend = worker.status === 'Available' ? 'on_leave' : 'available';
    try {
      await api.patch(`personnel/${workerId}/status`, { status: newStatusBackend });
      worker.status = worker.status === 'Available' ? 'On Leave' : 'Available';
    } catch (error) {
      console.error('Failed to update worker status:', error);
    }
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
    fetchPersonnel,
    toggleWorkerStatus,
    setWorkerStatus,
    assignWorker,
    unassignWorker,
    updateTicketDate,
    startWork,
    getTicketInfo,
  };
});
