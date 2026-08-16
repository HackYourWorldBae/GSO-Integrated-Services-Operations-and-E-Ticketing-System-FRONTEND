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
          implementationDate: p.implementation_date || null,
          nextAssignmentId: p.next_assignment_id || null,
          nextIsProject: Boolean(p.next_is_project || (p.next_assignment_id && String(p.next_assignment_id).includes('-PRJ-'))),
          nextTicketTask: p.next_ticket_task || null
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

  const addPersonnel = async ({ firstName, middleInitial, lastName, specialty }) => {
    const nameParts = [firstName.trim()];
    if (middleInitial?.trim()) nameParts.push(middleInitial.trim().replace(/\.?$/, '.'));
    nameParts.push(lastName.trim());
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

  const assignWorker = (workerId, ticketId, implementationDate, ticketTask = 'Facilities Maintenance Work') => {
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
    fetchPersonnel, fetchCategories, addCategory, removeCategory,
    addPersonnel, removePersonnel,
    toggleWorkerStatus, setWorkerStatus, assignWorker, unassignWorker,
    updateTicketDate, startWork, getTicketInfo,
  };
});
