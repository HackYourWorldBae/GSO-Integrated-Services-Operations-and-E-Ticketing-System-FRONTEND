import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/api/client';

export const useFgmuPersonnelStore = defineStore('fgmuPersonnel', () => {
  const personnel  = ref([]);
  const categories = ref([]);

  const groupedPersonnel = computed(() => {
    return personnel.value.reduce((groups, worker) => {
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
          assignedTicket: p.assigned_ticket_id || null,
          isProject: Boolean(p.is_project || (p.assigned_ticket_id && String(p.assigned_ticket_id).includes('-PRJ-'))),
          projectTitle: p.project_title || null,
          ticketTask: p.ticket_task || null,
          implementationDate: p.implementation_date ? new Date(p.implementation_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null,
          nextAssignmentId: p.next_assignment_id || null,
          nextIsProject: Boolean(p.next_is_project || (p.next_assignment_id && String(p.next_assignment_id).includes('-PRJ-'))),
          nextTicketTask: p.next_ticket_task || null,
          nextAssignment: p.next_assignment_id ? {
            ticketId: p.next_assignment_id,
            task: p.next_ticket_task || 'Facilities Maintenance Work',
            date: p.next_implementation_date ? new Date(p.next_implementation_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Scheduled Next'
          } : null,
          assignments: Array.isArray(p.assignments) ? p.assignments : []
        }));
      } else {
        personnel.value = [];
      }
    } catch (error) {
      console.error('Failed to fetch FGMU personnel:', error);
      if (personnel.value.length === 0) personnel.value = [];
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('personnel/categories/FGMU');
      categories.value = response.data?.data?.categories || [];
    } catch (error) {
      console.error('Failed to fetch FGMU categories:', error);
    }
  };

  const addCategory = async (name) => {
    const response = await api.post('personnel/categories', { unit_code: 'FGMU', name });
    await fetchCategories();
    return response.data;
  };

  const removeCategory = async (categoryId) => {
    await api.delete(`personnel/categories/${categoryId}`);
    await fetchCategories();
  };

  const updateCategory = async (categoryId, name) => {
    const response = await api.patch(`personnel/categories/${categoryId}`, { name });
    await fetchCategories();
    // After updating category, fetch personnel to sync changed specialties
    await fetchPersonnel();
    return response.data;
  };

  const addPersonnel = async ({ firstName, middleInitial, lastName, nameExtension, specialty }) => {
    const nameParts = [firstName.trim()];
    if (middleInitial?.trim()) nameParts.push(middleInitial.trim().replace(/\.?$/, '.'));
    nameParts.push(lastName.trim());
    if (nameExtension?.trim()) nameParts.push(nameExtension.trim());
    const fullName = nameParts.join(' ');
    const response = await api.post('personnel', { unit_id: 1, name: fullName, specialty });
    await fetchPersonnel();
    return response.data;
  };

  const removePersonnel = async (personnelId) => {
    await api.delete(`personnel/${personnelId}`);
    await fetchPersonnel();
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

  const assignWorker = (workerId, ticketId, implementationDate, ticketTask = 'Facilities Maintenance Work', isEmergency = false) => {
    const worker = personnel.value.find(w => w.id === workerId);
    if (!worker) return;
    if (!Array.isArray(worker.assignments)) {
      worker.assignments = [];
    }

    const newAssignment = {
      ticket_id: ticketId,
      task_notes: ticketTask,
      implementation_date: implementationDate,
      is_emergency: isEmergency ? 1 : 0,
      status: 'pending'
    };

    if (isEmergency) {
      worker.assignments.unshift(newAssignment);
    } else {
      worker.assignments.push(newAssignment);
    }

    // Sync legacy properties
    worker.assignedTicket = worker.assignments[0]?.ticket_id || null;
    worker.ticketTask = worker.assignments[0]?.task_notes || null;
    worker.implementationDate = worker.assignments[0]?.implementation_date || null;
    if (worker.assignments.length > 1) {
      worker.nextAssignmentId = worker.assignments[1].ticket_id;
      worker.nextTicketTask = worker.assignments[1].task_notes;
      worker.nextAssignment = {
        ticketId: worker.assignments[1].ticket_id,
        task: worker.assignments[1].task_notes,
        date: worker.assignments[1].implementation_date
      };
    } else {
      worker.nextAssignment = null;
      worker.nextAssignmentId = null;
      worker.nextTicketTask = null;
    }
  };

  const unassignWorker = (workerId, ticketId) => {
    const worker = personnel.value.find(w => w.id === workerId);
    if (!worker) return;

    if (Array.isArray(worker.assignments)) {
      worker.assignments = worker.assignments.filter(a => String(a.ticket_id) !== String(ticketId) && String(a.id) !== String(ticketId));
    } else {
      worker.assignments = [];
    }

    worker.assignedTicket = worker.assignments[0]?.ticket_id || null;
    worker.ticketTask = worker.assignments[0]?.task_notes || null;
    worker.implementationDate = worker.assignments[0]?.implementation_date || null;

    if (worker.assignments.length > 1) {
      worker.nextAssignmentId = worker.assignments[1].ticket_id;
      worker.nextTicketTask = worker.assignments[1].task_notes;
      worker.nextAssignment = {
        ticketId: worker.assignments[1].ticket_id,
        task: worker.assignments[1].task_notes,
        date: worker.assignments[1].implementation_date
      };
    } else {
      worker.nextAssignment = null;
      worker.nextAssignmentId = null;
      worker.nextTicketTask = null;
    }
  };

  const updateTicketDate = (ticketId, date) => {
    personnel.value.forEach(w => { if (w.assignedTicket === ticketId) w.implementationDate = date; });
  };

  const startWork = (workerId) => {
    const worker = personnel.value.find(w => w.id === workerId);
    if (!worker || !worker.assignedTicket) return;
    worker.status = 'Working';
  };

  const getTicketInfo = (ticketId) => ({
    id: ticketId, type: 'Facilities Maintenance', location: 'University Building',
    requester: 'GSO Administration', status: 'Pending',
    desc: 'Scheduled Facilities Maintenance Task', date: 'May 01, 2026'
  });

  return {
    personnel, categories, groupedPersonnel,
    fetchPersonnel, fetchCategories, addCategory, removeCategory, updateCategory,
    addPersonnel, removePersonnel,
    toggleWorkerStatus, setWorkerStatus, assignWorker, unassignWorker,
    updateTicketDate, startWork, getTicketInfo,
  };
});
