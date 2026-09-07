/**
 * BSU Campus Locations and Predefined Office / Room Catalog.
 * Provides predefined buildings and 3 predefined rooms per building,
 * with fallback support for custom entries.
 */

export const LOCATIONS = [
  {
    group: 'Colleges',
    items: [
      'College of Agriculture (CA)',
      'College of Engineering Complex (CE)',
      'College of Information Sciences Building (CIS)',
      'College of Natural Sciences Building (CNS)',
      'College of Home Economics & Technology (Strawberry Hall)',
      'College of Teacher Education Building (CTE)',
      'College of Human Kinetics Building (CHK)',
      'College of Veterinary Medicine / Animal Clinic (CVM)',
      'College of Forestry Building (CF)',
      'College of Public Administration & Governance (CPAG)',
      'College of Arts and Humanities (CAH)',
      'College of Social Sciences (CSS)'
    ]
  },
  {
    group: 'Administration & Support',
    items: [
      'General Services Office (GSO)',
      'Administration Building (Admin)',
      'Student Center / OSA',
      'University Library',
      'BSU Gymnasium',
      'BSU Clinic / Health Services',
      'BSU Security Headquarters',
      'Motorpool Depot',
      'Research & Extension Complex',
      'Northern Philippines Root Crop Center (NPRCRTC)',
      'Institute of Highland Farming Systems (IHFSA)',
      'Cordillera Organic Agriculture R&D Center (COARDC)'
    ]
  },
  {
    group: 'Auxiliary & Commercial',
    items: [
      'BSU Agri-Based Technology Incubator (ATBI)',
      'BSU Bakery',
      'BSU Marketing Center / Canteen',
      'University Dormitory / Housing',
      'BSU Strawberry Farm Compound',
      'Poultry / Livestock Project Area'
    ]
  }
];

export const DEFAULT_ROOMS = [
  "Dean's Office / Main Office",
  'Faculty / Staff Room',
  'Conference / Activity Room'
];

export const BUILDING_ROOMS = {
  // Colleges
  'College of Agriculture (CA)': [
    "Dean's Office",
    'CA Faculty Room',
    'Agri-Science Laboratory'
  ],
  'College of Engineering Complex (CE)': [
    "Dean's Office",
    'Engineering Computer Lab',
    'Faculty Room 201'
  ],
  'College of Information Sciences Building (CIS)': [
    "Dean's Office",
    'Computer Laboratory 1',
    'CIS Faculty Room'
  ],
  'College of Natural Sciences Building (CNS)': [
    "Dean's Office",
    'Science Laboratory',
    'CNS Faculty Room'
  ],
  'College of Home Economics & Technology (Strawberry Hall)': [
    "Dean's Office",
    'Food Laboratory',
    'CHET Faculty Lounge'
  ],
  'College of Teacher Education Building (CTE)': [
    "Dean's Office",
    'Audio-Visual Room (AVR)',
    'CTE Faculty Room'
  ],
  'College of Human Kinetics Building (CHK)': [
    "Dean's Office",
    'Gymnasium Office',
    'CHK Faculty Room'
  ],
  'College of Veterinary Medicine / Animal Clinic (CVM)': [
    "Dean's Office",
    'Veterinary Clinic Exam Room',
    'Animal Pathology Lab'
  ],
  'College of Forestry Building (CF)': [
    "Dean's Office",
    'Forestry Herbarium Room',
    'CF Faculty Room'
  ],
  'College of Public Administration & Governance (CPAG)': [
    "Dean's Office",
    'Conference Room',
    'CPAG Faculty Room'
  ],
  'College of Arts and Humanities (CAH)': [
    "Dean's Office",
    'Speech Laboratory',
    'CAH Faculty Room'
  ],
  'College of Social Sciences (CSS)': [
    "Dean's Office",
    'Psychology Laboratory',
    'CSS Faculty Room'
  ],

  // Administration & Support
  'General Services Office (GSO)': [
    "Director's Office",
    'Administrative Staff Office',
    'Supply & Inventory Room'
  ],
  'Administration Building (Admin)': [
    "President's Office",
    "Registrar's Office",
    'Accounting & Finance Office'
  ],
  'Student Center / OSA': [
    "OSA Director's Office",
    'Supreme Student Council Office',
    'Guidance & Counseling Office'
  ],
  'University Library': [
    "Chief Librarian's Office",
    'Reference Section',
    'Internet & Multi-Media Room'
  ],
  'BSU Gymnasium': [
    "Sports Director's Office",
    'Equipment Storage Room',
    'Stage & Backstage Area'
  ],
  'BSU Clinic / Health Services': [
    "Doctor's Consultation Room",
    'Dental Clinic',
    'Emergency Treatment Room'
  ],
  'BSU Security Headquarters': [
    'Chief of Security Office',
    'CCTV Monitoring Center',
    'Security Briefing Room'
  ],
  'Motorpool Depot': [
    'Motorpool Supervisor Office',
    'Dispatch & Drivers Lounge',
    'Parts & Tool Storage Room'
  ],
  'Research & Extension Complex': [
    "Director's Office",
    'Project Planning Room',
    'Research Library Room'
  ],
  'Northern Philippines Root Crop Center (NPRCRTC)': [
    "Center Director's Office",
    'Tissue Culture Laboratory',
    'Post-Harvest Processing Room'
  ],
  'Institute of Highland Farming Systems (IHFSA)': [
    "Director's Office",
    'Training Hall',
    'Soil & Plant Testing Lab'
  ],
  'Cordillera Organic Agriculture R&D Center (COARDC)': [
    "Director's Office",
    'Organic Certification Room',
    'Conference Room'
  ],

  // Auxiliary & Commercial
  'BSU Agri-Based Technology Incubator (ATBI)': [
    "Incubator Manager's Office",
    'Conference Room',
    'Product Display Center'
  ],
  'BSU Bakery': [
    'Production & Baking Area',
    'Sales Counter & Cashier',
    'Raw Materials Storage Room'
  ],
  'BSU Marketing Center / Canteen': [
    "Manager's Office",
    'Food Preparation Area',
    'Dining Hall Counter Area'
  ],
  'University Dormitory / Housing': [
    "Dormitory Matron's Office",
    'Common Study Lounge',
    'Lobby & Reception Area'
  ],
  'BSU Strawberry Farm Compound': [
    'Farm Administrator Office',
    'Harvest & Packaging Shed',
    'Visitors Information Booth'
  ],
  'Poultry / Livestock Project Area': [
    'Farm Supervisor Office',
    'Feed Storage Room',
    'Veterinary Inspection Shed'
  ]
};

/**
 * Get 3 predefined rooms for a given building name.
 * If building is not in list or custom, returns default rooms.
 */
export function getRoomsForBuilding(buildingName) {
  if (!buildingName || typeof buildingName !== 'string') {
    return [...DEFAULT_ROOMS];
  }

  const trimmed = buildingName.trim();
  if (BUILDING_ROOMS[trimmed]) {
    return [...BUILDING_ROOMS[trimmed]];
  }

  // Case-insensitive / partial match
  const lower = trimmed.toLowerCase();
  for (const [key, rooms] of Object.entries(BUILDING_ROOMS)) {
    if (key.toLowerCase() === lower || lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return [...rooms];
    }
  }

  return [...DEFAULT_ROOMS];
}

export default {
  LOCATIONS,
  BUILDING_ROOMS,
  DEFAULT_ROOMS,
  getRoomsForBuilding
};
