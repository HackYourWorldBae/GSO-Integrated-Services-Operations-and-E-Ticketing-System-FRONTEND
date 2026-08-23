import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/api/client';

export const useTasuPersonnelStore = defineStore('tasuPersonnel', () => {
  const personnel = ref([]);
  const categories = ref([]);

  const fetchPersonnel = async () => {
    try {
      const response = await api.get('personnel/TASU');
      if (response.data?.data?.personnel && response.data.data.personnel.length > 0) {
        personnel.value = response.data.data.personnel.map(p => ({
          ...p,
          status: p.status === 'available' ? 'Available' : p.status === 'working' ? 'Working' : p.status === 'on_leave' ? 'On Leave' : p.status === 'on_trip' ? 'On Trip' : p.status,
          role: p.specialty,
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
      console.error('Failed to fetch TASU personnel:', error);
      if (personnel.value.length === 0) {
        personnel.value = [];
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('personnel/categories/TASU');
      categories.value = response.data?.data?.categories || [];
    } catch (error) {
      console.error('Failed to fetch TASU categories:', error);
    }
  };

  const addCategory = async (name) => {
    const response = await api.post('personnel/categories', { unit_code: 'TASU', name });
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
    await fetchPersonnel();
    return response.data;
  };

  const addPersonnel = async ({ firstName, middleInitial, lastName, specialty }) => {
    const nameParts = [firstName.trim()];
    if (middleInitial?.trim()) nameParts.push(middleInitial.trim().replace(/\.?$/, '.'));
    nameParts.push(lastName.trim());
    const fullName = nameParts.join(' ');
    const response = await api.post('personnel', { unit_id: 4, name: fullName, specialty });
    await fetchPersonnel();
    return response.data;
  };

  const removePersonnel = async (personnelId) => {
    await api.delete(`personnel/${personnelId}`);
    await fetchPersonnel();
  };

  const groupedPersonnel = computed(() => {
    return personnel.value.reduce((groups, worker) => {
      if (!groups[worker.role]) groups[worker.role] = [];
      groups[worker.role].push(worker);
      return groups;
    }, {});
  });

  const toggleWorkerStatus = async (workerId) => {
    const worker = personnel.value.find(w => w.id === workerId);
    if (!worker || worker.status === 'On Trip') return;
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
      worker.implementationDate = null;
    }
  };

  const assignWorker = (workerId, ticketId, implementationDate) => {
    const worker = personnel.value.find(w => w.id === workerId);
    if (!worker) return;
    worker.assignedTicket = ticketId;
    worker.implementationDate = implementationDate;
  };

  const unassignWorker = (workerId) => {
    const worker = personnel.value.find(w => w.id === workerId);
    if (!worker) return;
    worker.assignedTicket = null;
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
    worker.status = 'On Trip';
  };

  return {
    personnel,
    categories,
    groupedPersonnel,
    toggleWorkerStatus,
    setWorkerStatus,
    assignWorker,
    unassignWorker,
    updateTicketDate,
    startWork,
    fetchPersonnel,
    fetchCategories,
    addPersonnel,
    removePersonnel,
    addCategory,
    removeCategory,
    updateCategory,
  };
});
