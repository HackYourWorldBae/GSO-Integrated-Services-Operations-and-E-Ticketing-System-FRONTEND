import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/api/client';

export const useFgmuPersonnelStore = defineStore('fgmuPersonnel', () => {
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
      const response = await api.get('personnel/FGMU');
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
      console.error('Failed to fetch FGMU personnel:', error);
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
