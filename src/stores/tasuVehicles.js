import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useTasuVehiclesStore = defineStore('tasuVehicles', () => {
  const vehicles = ref([
    {
      id: 1,
      name: 'Mitsubishi L300 Van',
      plate: 'SFS 625',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Mitsubishi_L300_2.5_Diesel_2010.jpg/800px-Mitsubishi_L300_2.5_Diesel_2010.jpg',
      fuel: 'Diesel',
      model: '2004',
      engine: '2500 cc',
      category: 'Van',
      status: 'Available'
    },
    {
      id: 2,
      name: 'Toyota Hilux 4X4 E',
      plate: 'SAC 2710',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/2019_Toyota_Hilux_Invincible_D-4d_4WD_2.4_Front.jpg/800px-2019_Toyota_Hilux_Invincible_D-4d_4WD_2.4_Front.jpg',
      fuel: 'Diesel',
      model: '2019',
      engine: '2393 cc',
      category: 'Pickup',
      status: 'Available'
    },
    {
      id: 3,
      name: 'Yutong Bus',
      plate: 'SAB 5997',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Yutong_ZK6122H9_coach_in_Changchun.jpg/800px-Yutong_ZK6122H9_coach_in_Changchun.jpg',
      fuel: 'Diesel',
      model: '2017',
      engine: 'Euro 3',
      category: 'Bus',
      status: 'Available'
    },
    {
      id: 4,
      name: 'Yutong Coaster',
      plate: 'SAB 5998',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Yutong_ZK6729DG_in_Guangzhou.jpg/800px-Yutong_ZK6729DG_in_Guangzhou.jpg',
      fuel: 'Diesel',
      model: '2017',
      engine: 'Euro 3',
      category: 'Bus',
      status: 'Available'
    },
    {
      id: 5,
      name: 'Mitsubishi L300 FB',
      plate: 'CS: B7 H784',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Mitsubishi_L300_2.5_Diesel_2010.jpg/800px-Mitsubishi_L300_2.5_Diesel_2010.jpg',
      fuel: 'Diesel',
      model: '2020',
      engine: '2268 cc',
      category: 'Van',
      status: 'Available'
    },
    {
      id: 6,
      name: 'Mitsubishi L-300 Van',
      plate: 'SFS 814',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Mitsubishi_L300_2.5_Diesel_2010.jpg/800px-Mitsubishi_L300_2.5_Diesel_2010.jpg',
      fuel: 'Diesel',
      model: '2004',
      engine: '2400 cc',
      category: 'Van',
      status: 'Available'
    },
    {
      id: 7,
      name: 'Nissan Urvan Estate',
      plate: 'SKA 939',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/2012_Nissan_NV350_Urvan.jpg/800px-2012_Nissan_NV350_Urvan.jpg',
      fuel: 'Diesel',
      model: '2011',
      engine: '2953 cc',
      category: 'Van',
      status: 'Available'
    },
    {
      id: 8,
      name: 'Toyota Mini Bus',
      plate: 'SYA 2337',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/2017_Toyota_Coaster.jpg/800px-2017_Toyota_Coaster.jpg',
      fuel: 'Diesel',
      model: '2020',
      engine: '4009 cc',
      category: 'Bus',
      status: 'Available'
    },
    {
      id: 9,
      name: 'SUV Land Cruiser',
      plate: 'SDN 570',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/2021_Toyota_Land_Cruiser_LC300_3.5_ZX_%28VJA300W%29.jpg/800px-2021_Toyota_Land_Cruiser_LC300_3.5_ZX_%28VJA300W%29.jpg',
      fuel: 'Diesel',
      model: '1992',
      engine: '4164 cc',
      category: 'SUV',
      status: 'Available'
    },
    {
      id: 10,
      name: 'Toyota HiAce GL',
      plate: 'SYA 2338',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/2019_Toyota_HiAce_GL_Grandia_Tourer.jpg/800px-2019_Toyota_HiAce_GL_Grandia_Tourer.jpg',
      fuel: 'Diesel',
      model: '2021',
      engine: '2755 cc',
      category: 'Van',
      status: 'Available'
    },
    {
      id: 11,
      name: 'Toyota HiAce Commuter',
      plate: 'SAC 1399',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/2019_Toyota_HiAce_Commuter_Deluxe.jpg/800px-2019_Toyota_HiAce_Commuter_Deluxe.jpg',
      fuel: 'Diesel',
      model: '2024',
      engine: '3000 cc',
      category: 'Van',
      status: 'Available'
    },
    {
      id: 12,
      name: 'Toyota HiAce Tourer',
      plate: 'SYA 1097',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/2019_Toyota_HiAce_GL_Grandia_Tourer_2.8.jpg/800px-2019_Toyota_HiAce_GL_Grandia_Tourer_2.8.jpg',
      fuel: 'Diesel',
      model: '2025',
      engine: '2.8L',
      category: 'Van',
      status: 'Available'
    },
    {
      id: 13,
      name: 'Toyota HiAce Tourer',
      plate: 'SYA 1098',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/2019_Toyota_HiAce_GL_Grandia_Tourer_2.8.jpg/800px-2019_Toyota_HiAce_GL_Grandia_Tourer_2.8.jpg',
      fuel: 'Diesel',
      model: '2025',
      engine: '2.8L',
      category: 'Van',
      status: 'Available'
    },
    {
      id: 14,
      name: 'Toyota HiAce Tourer',
      plate: 'SYA 1099',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/2019_Toyota_HiAce_GL_Grandia_Tourer_2.8.jpg/800px-2019_Toyota_HiAce_GL_Grandia_Tourer_2.8.jpg',
      fuel: 'Diesel',
      model: '2025',
      engine: '2.8L',
      category: 'Van',
      status: 'Available'
    },
    {
      id: 15,
      name: 'HINO Refrigerated Van',
      plate: 'JM 2748',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Hino_Dutro_12.jpg/800px-Hino_Dutro_12.jpg',
      fuel: 'Diesel',
      model: '2017',
      engine: '4500 cc',
      category: 'Logistics',
      status: 'Available'
    },
    {
      id: 16,
      name: 'Toyota LiteAce Pick Up',
      plate: 'SAC 1400',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Toyota_LiteAce_pickup_%281%29.jpg/800px-Toyota_LiteAce_pickup_%281%29.jpg',
      fuel: 'Gasoline',
      model: '2024',
      engine: '1.5L',
      category: 'Pickup',
      status: 'Available'
    },
    {
      id: 17,
      name: 'HINO Refrigerated Van',
      plate: 'JM 2503',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Hino_Dutro_12.jpg/800px-Hino_Dutro_12.jpg',
      fuel: 'Diesel',
      model: '2017',
      engine: '4500 cc',
      category: 'Logistics',
      status: 'Available'
    }
  ]);

  // Initial rich bookings spanning July 2026 (current week July 13-19, and the full month of July 2026),
  // as well as earlier dates in March/April.
  const bookings = ref([
    // July 13, 2026 (Mon)
    {
      id: 'dsp-101',
      vehicleId: 1,
      date: '2026-07-13',
      time: '08:00 AM - 11:30 AM',
      destination: 'Main Campus Round-trip Shuttle',
      requestor: 'Student Council (CAS)',
      type: 'regular',
      driver: 'Wilmer T. Toribio',
      passengers: 12,
      status: 'Completed',
      notes: 'Morning student transport round trip.'
    },
    {
      id: 'dsp-102',
      vehicleId: 3,
      date: '2026-07-13',
      time: '09:00 AM - 04:00 PM',
      destination: 'National Library & Archives, Manila',
      requestor: 'CAS Department Faculty',
      type: 'educational',
      driver: 'Homer D. Cuilan',
      passengers: 42,
      status: 'Completed',
      notes: 'Educational research trip for history majors.'
    },
    {
      id: 'dsp-103',
      vehicleId: 9,
      date: '2026-07-13',
      time: '01:30 PM - 05:00 PM',
      destination: 'CHED Regional Office',
      requestor: 'Dir. Santos (VPRD)',
      type: 'vip',
      driver: 'Sunny M. Quintos',
      passengers: 4,
      status: 'Completed',
      notes: 'Executive meeting on capstone accreditation.'
    },
    // July 14, 2026 (Tue - Today)
    {
      id: 'dsp-104',
      vehicleId: 2,
      date: '2026-07-14',
      time: '08:30 AM - 12:00 PM',
      destination: 'Regional Agricultural Station, La Trinidad',
      requestor: 'College of Agriculture',
      type: 'educational',
      driver: 'Federico A. Murphy Jr.',
      passengers: 5,
      status: 'In Progress',
      notes: 'Field sample collection and site inspection.'
    },
    {
      id: 'dsp-105',
      vehicleId: 10,
      date: '2026-07-14',
      time: '10:00 AM - 02:00 PM',
      destination: 'Airport Terminal 3 (Guest Pickup)',
      requestor: 'Office of the President',
      type: 'vip',
      driver: 'Reyner A. Berato',
      passengers: 6,
      status: 'Scheduled',
      notes: 'Pickup of international guest lecturers.'
    },
    {
      id: 'dsp-106',
      vehicleId: 15,
      date: '2026-07-14',
      time: '06:00 AM - 11:00 AM',
      destination: 'Central Cold Storage Depot',
      requestor: 'GSO Logistics & Supply',
      type: 'logistics',
      driver: 'Joel C. Pongdad',
      passengers: 2,
      status: 'Completed',
      notes: 'Transport of perishable laboratory reagents.'
    },
    {
      id: 'dsp-107',
      vehicleId: 7,
      date: '2026-07-14',
      time: '01:00 PM - 05:30 PM',
      destination: 'Provincial Capitol Conference Center',
      requestor: 'Admin & Finance Office',
      type: 'admin',
      driver: 'Freddie K. Agtulao',
      passengers: 9,
      status: 'Scheduled',
      notes: 'Inter-agency budget coordination session.'
    },
    // July 15, 2026 (Wed)
    {
      id: 'dsp-108',
      vehicleId: 4,
      date: '2026-07-15',
      time: '07:30 AM - 05:00 PM',
      destination: 'Subic Industrial Zone Field Trip',
      requestor: 'College of Engineering',
      type: 'educational',
      driver: 'Zularte M. Laking',
      passengers: 28,
      status: 'Scheduled',
      notes: 'Industrial plant tour for mechanical engineering seniors.'
    },
    {
      id: 'dsp-109',
      vehicleId: 11,
      date: '2026-07-15',
      time: '09:00 AM - 01:00 PM',
      destination: 'Civil Service Commission Regional Office',
      requestor: 'HR Management Division',
      type: 'admin',
      driver: 'Geordan L. Titiwa',
      passengers: 7,
      status: 'Scheduled',
      notes: 'Submission and verification of annual appointment rolls.'
    },
    {
      id: 'dsp-110',
      vehicleId: 16,
      date: '2026-07-15',
      time: '01:30 PM - 04:30 PM',
      destination: 'Hardware & Construction Depot',
      requestor: 'FGMU Engineering',
      type: 'logistics',
      driver: 'John C. Delmas',
      passengers: 3,
      status: 'Scheduled',
      notes: 'Procurement of structural materials for Building B.'
    },
    // July 16, 2026 (Thu)
    {
      id: 'dsp-111',
      vehicleId: 8,
      date: '2026-07-16',
      time: '08:00 AM - 03:00 PM',
      destination: 'Baguio Convention Center',
      requestor: 'University Cultural Troupe',
      type: 'regular',
      driver: 'Noliver G. Abelao',
      passengers: 22,
      status: 'Scheduled',
      notes: 'Rehearsal and performance transport for cultural festival.'
    },
    {
      id: 'dsp-112',
      vehicleId: 12,
      date: '2026-07-16',
      time: '10:00 AM - 04:00 PM',
      destination: 'DOST Research Campus, Bicutan',
      requestor: 'Research & Innovation Center',
      type: 'educational',
      driver: 'Gregory T. Sudaypan',
      passengers: 10,
      status: 'Scheduled',
      notes: 'Grant presentation and research facility benchmarking.'
    },
    // July 17, 2026 (Fri)
    {
      id: 'dsp-113',
      vehicleId: 5,
      date: '2026-07-17',
      time: '08:00 AM - 12:00 PM',
      destination: 'University Medical Center & Annex',
      requestor: 'University Health Services',
      type: 'regular',
      driver: 'Roy B. Bugnay',
      passengers: 8,
      status: 'Scheduled',
      notes: 'Medical outreach team transport and supply delivery.'
    },
    {
      id: 'dsp-114',
      vehicleId: 13,
      date: '2026-07-17',
      time: '01:00 PM - 06:00 PM',
      destination: 'Clark International Airport',
      requestor: 'Visiting Exchange Scholars',
      type: 'vip',
      driver: 'Wilmer T. Toribio',
      passengers: 7,
      status: 'Scheduled',
      notes: 'Airport send-off for academic exchange delegation.'
    },
    // July 18, 2026 (Sat)
    {
      id: 'dsp-115',
      vehicleId: 14,
      date: '2026-07-18',
      time: '06:30 AM - 05:30 PM',
      destination: 'Mt. Makiling Ecological Reserve',
      requestor: 'Forestry & Environmental Sci Dept',
      type: 'educational',
      driver: 'Homer D. Cuilan',
      passengers: 11,
      status: 'Scheduled',
      notes: 'Biodiversity survey and tree planting expedition.'
    },
    // July 22, 2026
    {
      id: 'dsp-116',
      vehicleId: 1,
      date: '2026-07-22',
      time: '08:00 AM - 12:00 PM',
      destination: 'City Sports Complex',
      requestor: 'Athletics & Sports Dept',
      type: 'regular',
      driver: 'Sunny M. Quintos',
      passengers: 14,
      status: 'Scheduled',
      notes: 'Varsity team transport for inter-collegiate games.'
    },
    // July 25, 2026
    {
      id: 'dsp-117',
      vehicleId: 17,
      date: '2026-07-25',
      time: '07:00 AM - 01:00 PM',
      destination: 'Regional Food & Dairy Plant',
      requestor: 'Food Technology Division',
      type: 'logistics',
      driver: 'Joel C. Pongdad',
      passengers: 4,
      status: 'Scheduled',
      notes: 'Cold chain transfer of experimental dairy batches.'
    },
    // July 28, 2026
    {
      id: 'dsp-118',
      vehicleId: 9,
      date: '2026-07-28',
      time: '09:00 AM - 03:30 PM',
      destination: 'Senate of the Philippines, Pasay',
      requestor: 'Board of Regents Delegation',
      type: 'vip',
      driver: 'Reyner A. Berato',
      passengers: 5,
      status: 'Scheduled',
      notes: 'Legislative budget hearing attendance.'
    }
  ]);

  const toggleVehicleStatus = (vehicleId) => {
    const v = vehicles.value.find(item => item.id === vehicleId);
    if (v) {
      v.status = v.status === 'Available' ? 'Under Maintenance' : 'Available';
    }
  };

  const updateVehicleStatus = (vehicleId, newStatus) => {
    const v = vehicles.value.find(item => item.id === vehicleId);
    if (v) {
      v.status = newStatus;
    }
  };

  const addVehicle = (vehicleData) => {
    const newId = vehicles.value.length > 0 ? Math.max(...vehicles.value.map(v => v.id)) + 1 : 1;
    vehicles.value.push({
      id: newId,
      status: 'Available',
      ...vehicleData
    });
  };

  const addBooking = (bookingData) => {
    const newId = 'dsp-' + (Date.now().toString().slice(-5));
    const newBooking = {
      id: newId,
      status: 'Scheduled',
      passengers: 1,
      notes: '',
      ...bookingData
    };
    bookings.value.push(newBooking);
    return newBooking;
  };

  const updateBooking = (id, updatedData) => {
    const idx = bookings.value.findIndex(b => b.id === id);
    if (idx !== -1) {
      bookings.value[idx] = { ...bookings.value[idx], ...updatedData };
    }
  };

  const deleteBooking = (id) => {
    bookings.value = bookings.value.filter(b => b.id !== id);
  };

  const getBookingsForVehicleAndDate = (vehicleId, dateStr) => {
    return bookings.value.filter(b => b.vehicleId === vehicleId && b.date === dateStr);
  };

  const getBookingsForDateRange = (startDateStr, endDateStr) => {
    return bookings.value.filter(b => b.date >= startDateStr && b.date <= endDateStr);
  };

  return {
    vehicles,
    bookings,
    toggleVehicleStatus,
    updateVehicleStatus,
    addVehicle,
    addBooking,
    updateBooking,
    deleteBooking,
    getBookingsForVehicleAndDate,
    getBookingsForDateRange
  };
}, {
  persist: true
});
