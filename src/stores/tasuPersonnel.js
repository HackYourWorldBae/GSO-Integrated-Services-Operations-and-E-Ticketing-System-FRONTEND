import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/api/client';

export const useTasuPersonnelStore = defineStore('tasuPersonnel', () => {
  const personnel = ref([]);

  const fetchPersonnel = async () => {
    try {
      const response = await api.get('personnel/TASU');
      if (response.data?.data?.personnel) {
        personnel.value = response.data.data.personnel.map(p => ({
          ...p,
          status: p.status === 'available' ? 'Available' : p.status === 'working' || p.status === 'on_trip' ? 'On Trip' : p.status === 'on_leave' ? 'On Leave' : p.status,
          role: p.specialty || p.role || 'Driver',
          assignedTicket: p.assigned_ticket_id || null,
          implementationDate: p.implementation_date || null
        }));
      }
    } catch (error) {
      console.error('Failed to fetch TASU personnel:', error);
    }
  };

  const groupedPersonnel = computed(() => {
    return personnel.value.reduce((groups, worker) => {
      if (!groups[worker.role]) groups[worker.role] = [];
      groups[worker.role].push(worker);
      return groups;
    }, {});
  });

  const toggleWorkerStatus = (workerId) => {
    const worker = personnel.value.find(w => w.id === workerId);
    // 'On Trip' is TASU's equivalent of 'Working'
    if (!worker || worker.status === 'On Trip') return;
    worker.status = worker.status === 'Available' ? 'On Leave' : 'Available';
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

  // Transition driver to active trip
  const startWork = (workerId) => {
    const worker = personnel.value.find(w => w.id === workerId);
    if (!worker || !worker.assignedTicket) return;
    worker.status = 'On Trip';
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
    fetchPersonnel,
  };
});
