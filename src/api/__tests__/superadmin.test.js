import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

import apiClient from '../client'
import {
  fetchSuperadminStats,
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
  verifyUser,
  rejectVerification,
  updateUserStatus,
  unlockUser,
  fetchAuditLogs,
  fetchAccountActivityLogs,
} from '../superadmin'

describe('superadmin api module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches superadmin stats from /superadmin/stats', async () => {
    apiClient.get.mockResolvedValueOnce({ data: { status: true, data: { total_users: 10 } } })
    const res = await fetchSuperadminStats()
    expect(apiClient.get).toHaveBeenCalledWith('/superadmin/stats')
    expect(res.data.status).toBe(true)
  })

  it('fetches users with search and query params', async () => {
    apiClient.get.mockResolvedValueOnce({ data: { status: true, data: { users: [] } } })
    const params = { role: 'student', page: 1 }
    await fetchUsers(params)
    expect(apiClient.get).toHaveBeenCalledWith('/superadmin/users', { params })
  })

  it('fetches users supporting custom query parameters', async () => {
    apiClient.get.mockResolvedValueOnce({ data: { status: true } })
    await fetchUsers({ role: 'student', status: 'Active' })
    expect(apiClient.get).toHaveBeenCalledWith('/superadmin/users', { params: { role: 'student', status: 'Active' } })
  })

  it('fetches a single user by ID', async () => {
    apiClient.get.mockResolvedValueOnce({ data: { status: true, data: { id: 'usr-1' } } })
    await fetchUserById('usr-1')
    expect(apiClient.get).toHaveBeenCalledWith('/superadmin/users/usr-1')
  })

  it('provisions a new user account', async () => {
    const payload = { first_name: 'Jane', last_name: 'Doe', role: 'student' }
    apiClient.post.mockResolvedValueOnce({ data: { status: true } })
    await createUser(payload)
    expect(apiClient.post).toHaveBeenCalledWith('/superadmin/users', payload)
  })

  it('updates an existing user account', async () => {
    const payload = { first_name: 'Jane Updated' }
    apiClient.put.mockResolvedValueOnce({ data: { status: true } })
    await updateUser('usr-1', payload)
    expect(apiClient.put).toHaveBeenCalledWith('/superadmin/users/usr-1', payload)
  })

  it('deletes a user account', async () => {
    apiClient.delete.mockResolvedValueOnce({ data: { status: true } })
    await deleteUser('usr-1')
    expect(apiClient.delete).toHaveBeenCalledWith('/superadmin/users/usr-1', { data: {} })
  })

  it('verifies a user account', async () => {
    apiClient.patch.mockResolvedValueOnce({ data: { status: true } })
    await verifyUser('usr-1')
    expect(apiClient.patch).toHaveBeenCalledWith('/superadmin/users/usr-1/verify', {})
  })

  it('rejects a pending user verification with reason', async () => {
    apiClient.patch.mockResolvedValueOnce({ data: { status: true } })
    await rejectVerification('usr-1', 'Blurred ID picture')
    expect(apiClient.patch).toHaveBeenCalledWith('/superadmin/users/usr-1/reject', { reason: 'Blurred ID picture' })
  })

  it('updates user status', async () => {
    apiClient.patch.mockResolvedValueOnce({ data: { status: true } })
    await updateUserStatus('usr-1', 'Suspended')
    expect(apiClient.patch).toHaveBeenCalledWith('/superadmin/users/usr-1/status', { status: 'Suspended' })
  })

  it('unlocks a locked user account', async () => {
    apiClient.post.mockResolvedValueOnce({ data: { status: true } })
    await unlockUser('usr-1')
    expect(apiClient.post).toHaveBeenCalledWith('/superadmin/users/usr-1/unlock', {})
  })

  it('fetches audit logs with query params', async () => {
    apiClient.get.mockResolvedValueOnce({ data: { status: true } })
    await fetchAuditLogs({ limit: 6 })
    expect(apiClient.get).toHaveBeenCalledWith('/superadmin/audit-logs', { params: { limit: 6 } })
  })

  it('fetches account activity logs with query params', async () => {
    apiClient.get.mockResolvedValueOnce({ data: { status: true } })
    await fetchAccountActivityLogs({ page: 1 })
    expect(apiClient.get).toHaveBeenCalledWith('/superadmin/account-activity-logs', { params: { page: 1 } })
  })
})
