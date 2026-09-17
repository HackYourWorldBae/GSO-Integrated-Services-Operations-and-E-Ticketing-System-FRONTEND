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
import { fetchAnalytics, fetchUnitAnalytics } from '../director'

// Level 3 — Component tests: executive analytics must query the
// backend dashboard endpoints with unit scoping intact.
describe('director api module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches system-wide analytics without a body', async () => {
    apiClient.get.mockResolvedValueOnce({ data: { status: true } })
    await fetchAnalytics()
    expect(apiClient.get).toHaveBeenCalledTimes(1)
    expect(apiClient.get).toHaveBeenCalledWith('/director/analytics')
  })

  it('fetches per-unit analytics scoped by unit code', async () => {
    apiClient.get.mockResolvedValue({ data: { status: true } })
    await fetchUnitAnalytics('FGMU')
    await fetchUnitAnalytics('SSU')
    expect(apiClient.get).toHaveBeenCalledWith('/director/analytics/FGMU')
    expect(apiClient.get).toHaveBeenCalledWith('/director/analytics/SSU')
  })

  it('returns the backend envelope untouched (no unwrapping loss)', async () => {
    const envelope = { data: { status: true, message: 'ok', data: { totals: {} } } }
    apiClient.get.mockResolvedValueOnce(envelope)
    await expect(fetchAnalytics()).resolves.toBe(envelope)
  })

  it('propagates backend errors to the caller', async () => {
    const failure = new Error('Request failed with status code 403')
    apiClient.get.mockRejectedValueOnce(failure)
    await expect(fetchUnitAnalytics('LEAU')).rejects.toBe(failure)
  })
})
