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
  fetchMyRequests,
  fetchCompletedTickets,
  submitIntake,
  fetchTicket,
  fetchTicketLogs,
  fetchPendingQueue,
  fetchDelayedApprovalQueue,
  fetchDispatchQueue,
  fetchActiveTickets,
  fetchArchives,
  fetchUnitStats,
  approveTicket,
  delayTicketApproval,
  resumeTicketApproval,
  declineTicket,
  completeTicket,
} from '../tickets'

// Level 3 — Component tests: every ticket action the UI performs must reach
// the backend verb + URI contract with its payload intact (no data loss).
describe('tickets api module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches the requestor active queue', async () => {
    apiClient.get.mockResolvedValueOnce({ data: { status: true } })
    await fetchMyRequests()
    expect(apiClient.get).toHaveBeenCalledTimes(1)
    expect(apiClient.get).toHaveBeenCalledWith('/tickets/my-requests')
  })

  it('fetches the requestor completed queue', async () => {
    apiClient.get.mockResolvedValueOnce({ data: { status: true } })
    await fetchCompletedTickets()
    expect(apiClient.get).toHaveBeenCalledWith('/tickets/completed')
  })

  it('submits intake payload by reference without loss', async () => {
    const payload = {
      fgmu: { services: ['Grass Cutting'], details: { location: 'LB Hall' } },
      leau: { services: [], details: {} },
      others: { description: 'Extra work' },
    }
    apiClient.post.mockResolvedValueOnce({ data: { status: true } })
    await submitIntake(payload)
    expect(apiClient.post).toHaveBeenCalledWith('/tickets/intake', payload)
    expect(apiClient.post.mock.calls[0][1]).toBe(payload)
  })

  it('fetches a single ticket and its audit logs', async () => {
    apiClient.get.mockResolvedValue({ data: { status: true } })
    await fetchTicket('FGMU-TIC-42-2026')
    await fetchTicketLogs('FGMU-TIC-42-2026')
    expect(apiClient.get).toHaveBeenCalledWith('/tickets/FGMU-TIC-42-2026')
    expect(apiClient.get).toHaveBeenCalledWith('/tickets/FGMU-TIC-42-2026/logs')
  })

  it('fetches every admin queue scoped by unit code', async () => {
    apiClient.get.mockResolvedValue({ data: { status: true } })
    await fetchPendingQueue('FGMU')
    await fetchDelayedApprovalQueue('LEAU')
    await fetchDispatchQueue('SSU')
    await fetchActiveTickets('FGMU')
    await fetchUnitStats('LEAU')
    expect(apiClient.get).toHaveBeenCalledWith('/tickets/queue/FGMU')
    expect(apiClient.get).toHaveBeenCalledWith('/tickets/delayed-approval/LEAU')
    expect(apiClient.get).toHaveBeenCalledWith('/tickets/dispatch/SSU')
    expect(apiClient.get).toHaveBeenCalledWith('/tickets/active/FGMU')
    expect(apiClient.get).toHaveBeenCalledWith('/tickets/stats/LEAU')
  })

  it('forwards archive filters as query params with a safe default', async () => {
    apiClient.get.mockResolvedValue({ data: { status: true } })
    const filters = { search: 'FGMU', status: 'closed' }
    await fetchArchives('FGMU', filters)
    expect(apiClient.get).toHaveBeenCalledWith('/tickets/archives/FGMU', { params: filters })
    await fetchArchives('SSU')
    expect(apiClient.get).toHaveBeenCalledWith('/tickets/archives/SSU', { params: {} })
  })

  it('approves, resumes, and completes without a body', async () => {
    apiClient.patch.mockResolvedValue({ data: { status: true } })
    await approveTicket('FGMU-TIC-1-2026')
    await resumeTicketApproval('FGMU-TIC-1-2026')
    await completeTicket('FGMU-TIC-1-2026')
    expect(apiClient.patch).toHaveBeenCalledWith('/tickets/FGMU-TIC-1-2026/approve')
    expect(apiClient.patch).toHaveBeenCalledWith('/tickets/FGMU-TIC-1-2026/resume-approval')
    expect(apiClient.patch).toHaveBeenCalledWith('/tickets/FGMU-TIC-1-2026/complete')
  })

  it('sends delay reasons under both backend-expected keys', async () => {
    apiClient.patch.mockResolvedValueOnce({ data: { status: true } })
    await delayTicketApproval('LEAU-TIC-3-2026', 'Awaiting materials')
    expect(apiClient.patch).toHaveBeenCalledWith('/tickets/LEAU-TIC-3-2026/delay-approval', {
      reason: 'Awaiting materials',
      delay_reason: 'Awaiting materials',
    })
  })

  it('sends decline reasons under the backend-expected key', async () => {
    apiClient.patch.mockResolvedValueOnce({ data: { status: true } })
    await declineTicket('SSU-TIC-2-2026', 'Duplicate request')
    expect(apiClient.patch).toHaveBeenCalledWith('/tickets/SSU-TIC-2-2026/decline', {
      decline_reason: 'Duplicate request',
    })
  })

  it('returns the backend envelope untouched (no unwrapping loss)', async () => {
    const envelope = { data: { status: true, message: 'ok', data: { tickets: [1, 2] } } }
    apiClient.get.mockResolvedValueOnce(envelope)
    await expect(fetchMyRequests()).resolves.toBe(envelope)
  })

  it('propagates backend errors to the caller', async () => {
    const failure = new Error('Request failed with status code 422')
    apiClient.post.mockRejectedValueOnce(failure)
    await expect(submitIntake({})).rejects.toBe(failure)
  })
})
