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
      'Research and Extension Building (Everlasting Hall)',
      'Northern Philippines Root Crops Research and Training Center (NPRCRTC)',
      'Institute of Highland Farming Systems and Agroforestry (IHFSA)',
      'Cordillera Organic Agriculture Research and Development Center (COARDC)'
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

export const ADMIN_SUPPORT_BUILDINGS = [
  'General Services Office (GSO)',
  'Administration Building (Admin)',
  'Student Center / OSA',
  'University Library',
  'BSU Gymnasium',
  'BSU Clinic / Health Services',
  'BSU Security Headquarters',
  'Motorpool Depot',
  'Research and Extension Building (Everlasting Hall)',
  'Northern Philippines Root Crops Research and Training Center (NPRCRTC)',
  'Institute of Highland Farming Systems and Agroforestry (IHFSA)',
  'Cordillera Organic Agriculture Research and Development Center (COARDC)'
];

/**
 * Official Research & Extension Centers of Benguet State University
 * (La Trinidad Campus), per the university's Research and Extension
 * Centers directory (bsu.edu.ph/research-centers).
 * Used for the Research and Extension Staff sign-up classification.
 */
export const RESEARCH_EXTENSION_BUILDINGS = [
  'Agri-Based Technology Business Incubator / Innovation Center (ATBI)',
  'Cordillera Center for Animal Research and Development (CCARD)',
  'Cordillera Organic Agriculture Research and Development Center (COARDC)',
  'Cordillera Regional Apiculture Center (CRAC)',
  'Climate-Smart Agriculture Center (CSAC)',
  'Food Science Research and Innovation Center (FSRIC)',
  'Center for Geoinformatics (CfG)',
  'Center for Educational Research and Innovation (CERI)',
  'Horticultural Research and Training Institute (HORTI)',
  'Institute of Social Research and Development (ISRD)',
  'Institute of Highland Farming Systems and Agroforestry (IHFSA)',
  'Northern Philippines Root Crops Research and Training Center (NPRCRTC)'
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
  'Research and Extension Building (Everlasting Hall)': [
    "Director's Office",
    'Everlasting Hall',
    'Conference Room'
  ],
  'Northern Philippines Root Crops Research and Training Center (NPRCRTC)': [
    "Center Director's Office",
    'Tissue Culture Laboratory',
    'Post-Harvest Processing Room'
  ],
  'Institute of Highland Farming Systems and Agroforestry (IHFSA)': [
    "Director's Office",
    'Training Hall',
    'Soil & Plant Testing Lab'
  ],
  'Cordillera Organic Agriculture Research and Development Center (COARDC)': [
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

/**
 * Resolves an authenticated user's associated college or administrative building
 * to its canonical matching building name in the LOCATIONS catalog.
 * Supports exact matching, acronym code matching (e.g. '(CIS)' -> 'College of Information Sciences Building (CIS)'),
 * base name matching, and graceful fallback to the raw building name.
 *
 * @param {string} userCollege - Building or College string from user account
 * @returns {string} Matched building name in LOCATIONS or raw string
 */
export function resolveLocationForUser(userCollege) {
  if (!userCollege || typeof userCollege !== 'string') return '';
  const trimmed = userCollege.trim();
  if (!trimmed) return '';

  // 1. Direct case-insensitive match in LOCATIONS
  for (const group of LOCATIONS) {
    for (const item of group.items) {
      if (item.toLowerCase() === trimmed.toLowerCase()) {
        return item;
      }
    }
  }

  // 2. Acronym Code match inside parentheses, e.g. "(CIS)", "(CE)", "(CTE)", "(CVM)"
  const codeMatch = trimmed.match(/\(([A-Za-z0-9&]+)\)/);
  if (codeMatch && codeMatch[1]) {
    const code = codeMatch[1].toLowerCase();
    for (const group of LOCATIONS) {
      for (const item of group.items) {
        const itemCodeMatch = item.match(/\(([A-Za-z0-9&]+)\)/);
        if (itemCodeMatch && itemCodeMatch[1]?.toLowerCase() === code) {
          return item;
        }
      }
    }
  }

  // 3. Base Name prefix/substring match (e.g., "College of Home Economics & Technology")
  const baseName = trimmed.replace(/\s*\([^)]*\)\s*/, '').trim().toLowerCase();
  if (baseName.length > 5) {
    for (const group of LOCATIONS) {
      for (const item of group.items) {
        const itemBaseName = item.replace(/\s*\([^)]*\)\s*/, '').trim().toLowerCase();
        if (itemBaseName === baseName || itemBaseName.includes(baseName) || baseName.includes(itemBaseName)) {
          return item;
        }
      }
    }
  }

  // 4. Fallback to raw trimmed string
  return trimmed;
}

export default {
  LOCATIONS,
  ADMIN_SUPPORT_BUILDINGS,
  RESEARCH_EXTENSION_BUILDINGS,
  BUILDING_ROOMS,
  DEFAULT_ROOMS,
  getRoomsForBuilding,
  resolveLocationForUser
};
