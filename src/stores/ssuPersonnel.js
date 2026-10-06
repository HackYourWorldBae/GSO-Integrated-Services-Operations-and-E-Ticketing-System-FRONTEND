import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/api/client';

export const useSsuPersonnelStore = defineStore('ssuPersonnel', () => {
  const personnel  = ref([]);
  const categories = ref([]);

  const groupedPersonnel = computed(() => {
    return personnel.value.reduce((groups, worker) => {
      const rawRole = worker.specialty || worker.role || 'Security Officer';
      const role = typeof rawRole === 'string' && rawRole.trim() ? rawRole.trim() : 'Security Officer';
      if (!groups[role]) groups[role] = [];
      groups[role].push(worker);
      return groups;
    }, {});
  });

  const fetchPersonnel = async () => {
    try {
      const response = await api.get('personnel/SSU');
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
            task: p.next_ticket_task || 'Security & Collab Dispatch',
            date: p.next_implementation_date ? new Date(p.next_implementation_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Scheduled Next'
          } : null,
          assignments: Array.isArray(p.assignments) ? p.assignments : [],
          hasAccount: Boolean(p.has_account || p.user_id),
          userEmail: p.user_email || null,
          userContact: p.user_contact || null,
        }));
      } else {
        personnel.value = [];
      }
    } catch (error) {
      console.error('Failed to fetch SSU personnel:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('personnel/categories/SSU');
      const loaded = response.data?.data?.categories || [];
      if (loaded.length > 0) {
        categories.value = loaded;
      } else if (categories.value.length === 0) {
        // Fallback default security categories if none are seeded yet
        categories.value = [
          { id: 1, unit_id: 3, name: 'Campus Security & Patrol', is_system: 1, services: ['Campus Security / Patrol', 'Incident Report'] },
          { id: 2, unit_id: 3, name: 'Traffic & Parking Control', is_system: 1, services: ['Traffic & Parking Assistance'] },
          { id: 3, unit_id: 3, name: 'Event & Crowd Control', is_system: 1, services: ['Crowd Management / Escort'] },
          { id: 4, unit_id: 3, name: 'Perimeter & Access Control', is_system: 1, services: ['Perimeter Security'] },
          { id: 5, unit_id: 3, name: 'Surveillance & CCTV Monitoring', is_system: 1, services: ['CCTV / Surveillance Check'] },
          { id: 6, unit_id: 3, name: 'Incident Response & Investigation', is_system: 1, services: ['Emergency Response', 'Incident Report'] },
        ];
      }
    } catch (error) {
      console.error('Failed to fetch SSU categories:', error);
      if (categories.value.length === 0) {
        categories.value = [
          { id: 1, unit_id: 3, name: 'Campus Security & Patrol', is_system: 1, services: ['Campus Security / Patrol', 'Incident Report'] },
          { id: 2, unit_id: 3, name: 'Traffic & Parking Control', is_system: 1, services: ['Traffic & Parking Assistance'] },
          { id: 3, unit_id: 3, name: 'Event & Crowd Control', is_system: 1, services: ['Crowd Management / Escort'] },
          { id: 4, unit_id: 3, name: 'Perimeter & Access Control', is_system: 1, services: ['Perimeter Security'] },
          { id: 5, unit_id: 3, name: 'Surveillance & CCTV Monitoring', is_system: 1, services: ['CCTV / Surveillance Check'] },
          { id: 6, unit_id: 3, name: 'Incident Response & Investigation', is_system: 1, services: ['Emergency Response', 'Incident Report'] },
        ];
      }
    }
  };

  const addCategory = async (name, services = []) => {
    const response = await api.post('personnel/categories', { unit_code: 'SSU', name, services });
    await fetchCategories();
    return response.data;
  };

  const removeCategory = async (categoryId) => {
    await api.delete(`personnel/categories/${categoryId}`);
    await fetchCategories();
  };

  const updateCategory = async (categoryId, name, services = null) => {
    const payload = {};
    if (name !== undefined && name !== null) payload.name = name;
    if (services !== undefined && services !== null) payload.services = services;
    const response = await api.patch(`personnel/categories/${categoryId}`, payload);
    await fetchCategories();
    await fetchPersonnel();
    return response.data;
  };

  const addPersonnel = async ({
    firstName,
    middleInitial,
    lastName,
    nameExtension,
    specialty,
    createAccount = false,
    email = '',
    password = '',
    contactNumber = ''
  }) => {
    const nameParts = [firstName.trim()];
    if (middleInitial?.trim()) nameParts.push(middleInitial.trim().replace(/\.?$/, '.'));
    nameParts.push(lastName.trim());
    if (nameExtension?.trim()) nameParts.push(nameExtension.trim());
    const fullName = nameParts.join(' ');
    const payload = {
      unit_id: 3,
      name: fullName,
      first_name: firstName.trim(),
      middle_initial: middleInitial?.trim() || null,
      last_name: lastName.trim(),
      name_extension: nameExtension?.trim() || null,
      specialty,
    };

    if (createAccount) {
      payload.create_account = true;
      payload.email = email.trim();
      payload.password = password;
      if (contactNumber?.trim()) {
        payload.contact_number = contactNumber.trim();
      }
    }

    const response = await api.post('personnel', payload);
    await fetchPersonnel();
    return response.data;
  };

  const createPersonnelAccount = async (personnelId, { email, password, contactNumber }) => {
    const payload = {
      email: email.trim(),
      password,
      contact_number: contactNumber?.trim() || null,
    };
    const response = await api.post(`personnel/${personnelId}/create-account`, payload);
    await fetchPersonnel();
    return response.data;
  };

  const updatePersonnel = async (personnelId, { name, specialty }) => {
    const payload = {};
    if (name) payload.name = name.trim();
    if (specialty) payload.specialty = specialty.trim();
    const response = await api.put(`personnel/${personnelId}`, payload);
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

  const assignWorker = (workerId, ticketId, implementationDate, ticketTask = 'Security & Collab Dispatch', isEmergency = false) => {
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

  return {
    personnel, categories, groupedPersonnel,
    fetchPersonnel, fetchCategories, addCategory, removeCategory, updateCategory,
    addPersonnel, createPersonnelAccount, updatePersonnel, removePersonnel,
    toggleWorkerStatus, setWorkerStatus, assignWorker, unassignWorker,
    updateTicketDate, startWork,
  };
});
