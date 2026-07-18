import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useTasuPersonnelStore = defineStore('tasuPersonnel', () => {
  const personnel = ref([
    { id: 1,  name: 'Wilmer T. Toribio',   role: 'Professional Driver', status: 'Available', assignedTicket: null, implementationDate: null },
    { id: 2,  name: 'Homer D. Cuilan',      role: 'Professional Driver', status: 'Available', assignedTicket: null, implementationDate: null },
    { id: 3,  name: 'Sunny M. Quintos',     role: 'Professional Driver', status: 'Available', assignedTicket: null, implementationDate: null },
    { id: 4,  name: 'Federico A. Murphy Jr.', role: 'Professional Driver', status: 'Available', assignedTicket: null, implementationDate: null },
    { id: 5,  name: 'Reyner A. Berato',     role: 'Professional Driver', status: 'Available', assignedTicket: null, implementationDate: null },
    { id: 6,  name: 'Joel C. Pongdad',      role: 'Professional Driver', status: 'Available', assignedTicket: null, implementationDate: null },
    { id: 7,  name: 'Freddie K. Agtulao',   role: 'Professional Driver', status: 'Available', assignedTicket: null, implementationDate: null },
    { id: 8,  name: 'Zularte M. Laking',    role: 'Professional Driver', status: 'Available', assignedTicket: null, implementationDate: null },
    { id: 9,  name: 'Geordan L. Titiwa',    role: 'Professional Driver', status: 'Available', assignedTicket: null, implementationDate: null },
    { id: 10, name: 'John C. Delmas',        role: 'Professional Driver', status: 'Available', assignedTicket: null, implementationDate: null },
    { id: 11, name: 'Noliver G. Abelao',     role: 'Professional Driver', status: 'Available', assignedTicket: null, implementationDate: null },
    { id: 12, name: 'Gregory T. Sudaypan',   role: 'Professional Driver', status: 'Available', assignedTicket: null, implementationDate: null },
    { id: 13, name: 'Roy B. Bugnay',         role: 'Professional Driver', status: 'Available', assignedTicket: null, implementationDate: null },
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
  };
});
