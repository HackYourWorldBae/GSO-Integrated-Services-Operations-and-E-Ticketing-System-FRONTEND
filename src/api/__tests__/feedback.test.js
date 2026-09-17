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
import { submitFeedback, fetchFeedback } from '../feedback'

// Level 3 — Component tests: post-completion ratings (the end-user
// evaluation surface) must reach the backend with every score intact.
describe('feedback api module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('merges the ticket id with the full rating payload', async () => {
    const ratings = {
      completion_status: 'on-time',
      courtesy_rating: 5,
      quality_rating: 4,
      efficiency_rating: 5,
      timeliness_rating: 4,
      cleanliness_rating: 5,
      delay_reasons: [],
      remarks: 'Great work',
    }
    apiClient.post.mockResolvedValueOnce({ data: { status: true } })
    await submitFeedback('FGMU-TIC-9-2026', ratings)
    expect(apiClient.post).toHaveBeenCalledWith('/feedback', {
      ticket_id: 'FGMU-TIC-9-2026',
      ...ratings,
    })
    const sent = apiClient.post.mock.calls[0][1]
    for (const key of Object.keys(ratings)) {
      expect(sent[key]).toBe(ratings[key])
    }
  })

  it('fetches feedback by ticket id', async () => {
    apiClient.get.mockResolvedValueOnce({ data: { status: true } })
    await fetchFeedback('FGMU-TIC-9-2026')
    expect(apiClient.get).toHaveBeenCalledWith('/feedback/FGMU-TIC-9-2026')
  })

  it('returns the backend envelope untouched (no unwrapping loss)', async () => {
    const envelope = { data: { status: true, message: 'ok', data: { id: 3 } } }
    apiClient.get.mockResolvedValueOnce(envelope)
    await expect(fetchFeedback('FGMU-TIC-9-2026')).resolves.toBe(envelope)
  })

  it('propagates backend errors to the caller', async () => {
    const failure = new Error('Request failed with status code 422')
    apiClient.post.mockRejectedValueOnce(failure)
    await expect(submitFeedback('T-1', {})).rejects.toBe(failure)
  })
})
