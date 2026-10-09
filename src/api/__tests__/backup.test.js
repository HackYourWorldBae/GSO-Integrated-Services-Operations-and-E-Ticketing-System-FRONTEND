import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}))

import apiClient from '../client'
import {
  fetchBackups,
  createBackup,
  restoreBackup,
  restoreFromUpload,
  downloadBackup,
  syncBackupToGoogleDrive,
  deleteBackup,
  getGoogleDriveStatus,
  updateGoogleDriveConfig,
  getGoogleOAuthUrl
} from '../backup'

describe('Backup API Module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches backups and cloud status from /superadmin/backups', async () => {
    apiClient.get.mockResolvedValueOnce({
      data: {
        status: true,
        data: {
          backups: [{ id: 1, file_name: 'backup_test.sql' }],
          stats: { total_backups: 1 },
          google_drive: { is_configured: true, connected: true }
        }
      }
    })

    const res = await fetchBackups()
    expect(apiClient.get).toHaveBeenCalledWith('/superadmin/backups')
    expect(res.data.status).toBe(true)
    expect(res.data.data.backups).toHaveLength(1)
  })

  it('triggers on-demand database backup via POST /superadmin/backups with extended timeout', async () => {
    apiClient.post.mockResolvedValueOnce({
      data: {
        status: true,
        message: 'Database backup created successfully.',
        data: { backup: { id: 2, file_name: 'backup_test_2.sql' } }
      }
    })

    const payload = { notes: 'Pre-maintenance snapshot' }
    const res = await createBackup(payload)
    expect(apiClient.post).toHaveBeenCalledWith('/superadmin/backups', payload, {
      timeout: 300000
    })
    expect(res.data.status).toBe(true)
  })

  it('restores database snapshot with typed confirmation and storage source', async () => {
    apiClient.post.mockResolvedValueOnce({
      data: {
        status: true,
        message: 'Database restored successfully.'
      }
    })

    const res = await restoreBackup(1, 'CONFIRM RESTORE', 'google_drive')
    expect(apiClient.post).toHaveBeenCalledWith('/superadmin/backups/1/restore', {
      confirmation: 'CONFIRM RESTORE',
      source: 'google_drive'
    }, {
      timeout: 300000
    })
    expect(res.data.status).toBe(true)
  })

  it('restores from uploaded SQL file with multipart header and timeout', async () => {
    apiClient.post.mockResolvedValueOnce({
      data: {
        status: true,
        message: 'Database restored from uploaded file.'
      }
    })

    const formData = new FormData()
    formData.append('confirmation', 'CONFIRM RESTORE')

    const res = await restoreFromUpload(formData)
    expect(apiClient.post).toHaveBeenCalledWith(
      '/superadmin/backups/restore-upload',
      formData,
      expect.objectContaining({
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 300000
      })
    )
    expect(res.data.status).toBe(true)
  })

  it('requests backup download with blob responseType and extended timeout', async () => {
    apiClient.get.mockResolvedValueOnce({
      data: new Blob(['-- SQL DUMP CONTENT']),
      headers: { 'content-type': 'application/sql' }
    })

    await downloadBackup(5)
    expect(apiClient.get).toHaveBeenCalledWith('/superadmin/backups/5/download', {
      responseType: 'blob',
      timeout: 300000
    })
  })

  it('triggers manual sync to Google Drive via POST /superadmin/backups/{id}/sync-gdrive with extended timeout', async () => {
    apiClient.post.mockResolvedValueOnce({
      data: {
        status: true,
        message: 'Successfully synced backup to Google Drive.'
      }
    })

    const res = await syncBackupToGoogleDrive(3)
    expect(apiClient.post).toHaveBeenCalledWith('/superadmin/backups/3/sync-gdrive', {}, {
      timeout: 300000
    })
    expect(res.data.status).toBe(true)
  })

  it('deletes backup record and files via DELETE /superadmin/backups/{id}', async () => {
    apiClient.delete.mockResolvedValueOnce({
      data: {
        status: true,
        message: 'Backup deleted successfully.'
      }
    })

    const res = await deleteBackup(4)
    expect(apiClient.delete).toHaveBeenCalledWith('/superadmin/backups/4')
    expect(res.data.status).toBe(true)
  })

  it('checks Google Drive connection status via GET /superadmin/backups/gdrive-status', async () => {
    apiClient.get.mockResolvedValueOnce({
      data: {
        status: true,
        data: { success: true, message: 'Connected to Google Drive successfully.' }
      }
    })

    const res = await getGoogleDriveStatus()
    expect(apiClient.get).toHaveBeenCalledWith('/superadmin/backups/gdrive-status')
    expect(res.data.data.success).toBe(true)
  })

  it('updates Google Drive configuration with JSON payload', async () => {
    apiClient.post.mockResolvedValueOnce({
      data: { status: true, message: 'Configuration updated.' }
    })

    const payload = { folder_id: 'folder123', credentials_json: '{}' }
    await updateGoogleDriveConfig(payload)
    expect(apiClient.post).toHaveBeenCalledWith('/superadmin/backups/gdrive-config', payload)
  })

  it('updates Google Drive configuration with FormData payload', async () => {
    apiClient.post.mockResolvedValueOnce({
      data: { status: true, message: 'Configuration updated.' }
    })

    const formData = new FormData()
    formData.append('folder_id', 'folder123')
    await updateGoogleDriveConfig(formData)
    expect(apiClient.post).toHaveBeenCalledWith(
      '/superadmin/backups/gdrive-config',
      formData,
      expect.objectContaining({
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    )
  })

  it('requests Google OAuth authorization URL via GET /superadmin/backups/gdrive-oauth-url', async () => {
    apiClient.get.mockResolvedValueOnce({
      data: {
        status: true,
        data: { auth_url: 'https://accounts.google.com/o/oauth2/auth?test=1', redirect_uri: 'https://backend.test/callback' }
      }
    })

    const res = await getGoogleOAuthUrl({ client_id: 'abc', client_secret: 'xyz' })
    expect(apiClient.get).toHaveBeenCalledWith('/superadmin/backups/gdrive-oauth-url', {
      params: { client_id: 'abc', client_secret: 'xyz' }
    })
    expect(res.data.data.auth_url).toContain('accounts.google.com')
  })
})
