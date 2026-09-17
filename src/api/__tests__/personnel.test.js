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
  fetchPersonnelByUnit,
  fetchAvailablePersonnel,
  updatePersonnelStatus,
  createPersonnel,
  updatePersonnel,
  deletePersonnel,
} from '../personnel'

// Level 3 — Component tests: personnel roster management must hit the
// backend roster endpoints with unit scoping and payloads intact.
describe('personnel api module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches the full roster and available workers per unit', async () => {
    apiClient.get.mockResolvedValue({ data: { status: true } })
    await fetchPersonnelByUnit('FGMU')
    await fetchAvailablePersonnel('LEAU')
    expect(apiClient.get).toHaveBeenCalledWith('/personnel/FGMU')
    expect(apiClient.get).toHaveBeenCalledWith('/personnel/LEAU/available')
  })

  it('updates worker availability with the status key', async () => {
    apiClient.patch.mockResolvedValueOnce({ data: { status: true } })
    await updatePersonnelStatus('worker-uuid-1', 'on_leave')
    expect(apiClient.patch).toHaveBeenCalledWith('/personnel/worker-uuid-1/status', {
      status: 'on_leave',
    })
  })

  it('creates and updates personnel records without loss', async () => {
    const record = { name: 'Juan Cruz', specialty: 'Plumbing', unit_id: 1 }
    const update = { specialty: 'Electrical' }
    apiClient.post.mockResolvedValueOnce({ data: { status: true } })
    apiClient.put.mockResolvedValueOnce({ data: { status: true } })
    await createPersonnel(record)
    await updatePersonnel('worker-uuid-1', update)
    expect(apiClient.post).toHaveBeenCalledWith('/personnel', record)
    expect(apiClient.post.mock.calls[0][1]).toBe(record)
    expect(apiClient.put).toHaveBeenCalledWith('/personnel/worker-uuid-1', update)
  })

  it('deletes personnel by id only', async () => {
    apiClient.delete.mockResolvedValueOnce({ data: { status: true } })
    await deletePersonnel('worker-uuid-1')
    expect(apiClient.delete).toHaveBeenCalledTimes(1)
    expect(apiClient.delete).toHaveBeenCalledWith('/personnel/worker-uuid-1')
  })

  it('returns the backend envelope untouched (no unwrapping loss)', async () => {
    const envelope = { data: { status: true, message: 'ok', data: { personnel: [] } } }
    apiClient.get.mockResolvedValueOnce(envelope)
    await expect(fetchPersonnelByUnit('SSU')).resolves.toBe(envelope)
  })

  it('propagates backend errors to the caller', async () => {
    const failure = new Error('Request failed with status code 404')
    apiClient.get.mockRejectedValueOnce(failure)
    await expect(fetchPersonnelByUnit('FGMU')).rejects.toBe(failure)
  })
})
