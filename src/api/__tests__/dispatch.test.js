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
import { assignWorker, updateAssignment, addMaterials } from '../dispatch'

// Level 3 — Component tests: admin dispatch actions (handled by Unit Heads)
// must reach the backend with scheduling notes and materials intact.
describe('dispatch api module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('assigns a worker with scheduling fields intact', async () => {
    const assignment = {
      ticket_id: 'FGMU-TIC-10-2026',
      personnel_id: 4,
      implementation_date: '2026-09-21',
      working_days: 3,
      task_notes: 'Replace faucet',
      dispatcher_notes: 'Prioritize morning',
    }
    apiClient.post.mockResolvedValueOnce({ data: { status: true } })
    await assignWorker(assignment)
    expect(apiClient.post).toHaveBeenCalledWith('/dispatch/assign', assignment)
    expect(apiClient.post.mock.calls[0][1]).toBe(assignment)
  })

  it('updates an assignment schedule by numeric id', async () => {
    const patch = { implementation_date: '2026-09-22', task_notes: 'Moved' }
    apiClient.patch.mockResolvedValueOnce({ data: { status: true } })
    await updateAssignment(7, patch)
    expect(apiClient.patch).toHaveBeenCalledWith('/dispatch/assignments/7', patch)
  })

  it('wraps material lists under the materials key without loss', async () => {
    const materials = [
      { name: 'Faucet', quantity: 2, unit: 'pcs', unit_price: 350 },
      { name: 'Teflon', quantity: 1, unit: 'roll', unit_price: 45 },
    ]
    apiClient.post.mockResolvedValueOnce({ data: { status: true } })
    await addMaterials(7, materials)
    expect(apiClient.post).toHaveBeenCalledWith('/dispatch/assignments/7/materials', { materials })
    expect(apiClient.post.mock.calls[0][1].materials).toBe(materials)
  })

  it('returns the backend envelope untouched (no unwrapping loss)', async () => {
    const envelope = { data: { status: true, message: 'ok', data: { assignment_id: 7 } } }
    apiClient.post.mockResolvedValueOnce(envelope)
    await expect(assignWorker({})).resolves.toBe(envelope)
  })

  it('propagates backend errors to the caller', async () => {
    const failure = new Error('Request failed with status code 403')
    apiClient.post.mockRejectedValueOnce(failure)
    await expect(assignWorker({})).rejects.toBe(failure)
  })
})
