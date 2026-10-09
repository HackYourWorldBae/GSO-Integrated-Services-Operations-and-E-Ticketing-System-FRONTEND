import apiClient from './client';

// ============================================================================
// Backup & Disaster Recovery API Module (Superadmin)
//
// Maps to backend App\Controllers\API\BackupController
// ============================================================================

/**
 * Fetch backup history, statistics, and Google Drive cloud status.
 * Route: GET /api/v1/superadmin/backups
 */
export const fetchBackups = () =>
  apiClient.get('/superadmin/backups');

/**
 * Trigger an on-demand database backup and sync to Google Drive.
 * Route: POST /api/v1/superadmin/backups
 * @param {Object} [payload] - { notes: string, category?: string }
 */
export const createBackup = (payload = {}) =>
  apiClient.post('/superadmin/backups', payload, {
    timeout: 300000 // 5 minute timeout for full database dump, zip packaging, and cloud upload
  });

/**
 * Restore database from an existing backup entry from selected storage.
 * Route: POST /api/v1/superadmin/backups/{id}/restore
 * @param {number|string} backupId
 * @param {string} confirmation - Must be 'CONFIRM RESTORE'
 * @param {string} [source='auto'] - 'local' | 'google_drive' | 'auto'
 */
export const restoreBackup = (backupId, confirmation, source = 'auto') =>
  apiClient.post(`/superadmin/backups/${backupId}/restore`, { confirmation, source }, {
    timeout: 300000 // 5 minute timeout for cloud download, zip extraction, and database restoration
  });

/**
 * Restore the latest snapshot from selected storage (Local or Google Drive).
 * Route: POST /api/v1/superadmin/backups/restore-latest
 * @param {string} confirmation - Must be 'CONFIRM RESTORE'
 * @param {string} [source='auto'] - 'local' | 'google_drive' | 'auto'
 */
export const restoreLatestBackup = (confirmation, source = 'auto') =>
  apiClient.post('/superadmin/backups/restore-latest', { confirmation, source }, {
    timeout: 300000 // 5 minute timeout
  });

/**
 * Restore database from an uploaded SQL file.
 * Route: POST /api/v1/superadmin/backups/restore-upload
 * @param {FormData} formData - Contains backup_file and confirmation
 */
export const restoreFromUpload = (formData) =>
  apiClient.post('/superadmin/backups/restore-upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 300000 // 5 minute timeout for large restores
  });

/**
 * Download a local backup .sql or .zip file.
 * Route: GET /api/v1/superadmin/backups/{id}/download
 * @param {number|string} backupId
 */
export const downloadBackup = (backupId) =>
  apiClient.get(`/superadmin/backups/${backupId}/download`, {
    responseType: 'blob',
    timeout: 300000 // 5 minute timeout
  });

/**
 * Re-sync a backup to Google Drive.
 * Route: POST /api/v1/superadmin/backups/{id}/sync-gdrive
 * @param {number|string} backupId
 */
export const syncBackupToGoogleDrive = (backupId) =>
  apiClient.post(`/superadmin/backups/${backupId}/sync-gdrive`, {}, {
    timeout: 300000 // 5 minute timeout
  });

/**
 * Permanently delete a backup locally and from Google Drive.
 * Route: DELETE /api/v1/superadmin/backups/{id}
 * @param {number|string} backupId
 */
export const deleteBackup = (backupId) =>
  apiClient.delete(`/superadmin/backups/${backupId}`);

/**
 * Test Google Drive connection.
 * Route: GET /api/v1/superadmin/backups/gdrive-status
 */
export const getGoogleDriveStatus = () =>
  apiClient.get('/superadmin/backups/gdrive-status');

/**
 * Update Google Drive configuration (Folder ID, Service Account JSON file/string).
 * Route: POST /api/v1/superadmin/backups/gdrive-config
 * @param {FormData|Object} payload
 */
export const updateGoogleDriveConfig = (payload) => {
  if (payload instanceof FormData) {
    return apiClient.post('/superadmin/backups/gdrive-config', payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
  return apiClient.post('/superadmin/backups/gdrive-config', payload);
};

/**
 * Generate Google OAuth 2.0 Authorization URL for personal Google Drive backup.
 * Route: GET /api/v1/superadmin/backups/gdrive-oauth-url
 * @param {Object} [params] - { client_id, client_secret, folder_id }
 */
export const getGoogleOAuthUrl = (params = {}) =>
  apiClient.get('/superadmin/backups/gdrive-oauth-url', { params });

