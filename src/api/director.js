import apiClient from './client';

// ============================================================================
// Director API Module
//
// Wraps executive analytics dashboard calls.
// Consumed by: Director_Dashboard.vue
// ============================================================================

/**
 * Get system-wide analytics across all sub-units.
 * Returns ticket volumes, completion rates, monthly trends, and feedback averages.
 */
export const fetchAnalytics = () =>
  apiClient.get('/director/analytics');

/**
 * Get per-unit analytics breakdown including top delay reasons.
 * @param {string} unitCode - 'FGMU' | 'LEAU' | 'SSU'
 */
export const fetchUnitAnalytics = (unitCode) =>
  apiClient.get(`/director/analytics/${unitCode}`);
