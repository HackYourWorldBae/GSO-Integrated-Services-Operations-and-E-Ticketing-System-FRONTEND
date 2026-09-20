import apiClient from './client';

// ============================================================================
// Personnel Bulletin Board API Module
//
// Read-only board for field personnel (FGMU / LEAU).
// Shared unit logins pick a name from the roster, then view assigned works
// including teammates dispatched to the same tickets.
//
// Backend routes (api/v1):
//   GET /personnel-board/roster?unit_id=
//   GET /personnel-board/works?personnel_id=
// ============================================================================

/**
 * Shared bulletin login detection — one account per field unit,
 * every worker signs in with it then picks their own name.
 * @param {{ email?: string } | null} user
 */
export const isBulletinAccount = (user) =>
  String(user?.email || '').toLowerCase().endsWith('-personnels@email.com');

/**
 * Fetch the unit roster with active work counts (name picker).
 * @param {number} [unitId] - directors/superadmins may query another unit
 */
export const fetchBoardRoster = (unitId) =>
  apiClient.get('/personnel-board/roster', { params: unitId ? { unit_id: unitId } : {} });

/**
 * Fetch active + recent works for one worker, with teammates per ticket.
 * @param {string} personnelId
 */
export const fetchPersonnelWorks = (personnelId) =>
  apiClient.get('/personnel-board/works', { params: { personnel_id: personnelId } });
