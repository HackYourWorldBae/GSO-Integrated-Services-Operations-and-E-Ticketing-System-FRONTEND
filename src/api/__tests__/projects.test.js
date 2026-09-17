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
import { getProjects, getProjectArchives, createProject, updateProject } from '../projects'

// Level 3 — Component tests: scheduled project announcements must sync
// between the public board, admin editors, and the backend intact.
describe('projects api module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches active and archived project announcements', async () => {
    apiClient.get.mockResolvedValue({ data: { status: true } })
    await getProjects()
    await getProjectArchives()
    expect(apiClient.get).toHaveBeenCalledWith('/projects')
    expect(apiClient.get).toHaveBeenCalledWith('/projects/archives')
  })

  it('creates and updates projects with payloads intact', async () => {
    const draft = { title: ' repaint', unit_id: 1 }
    const patch = { title: 'Repaint LB Hall' }
    apiClient.post.mockResolvedValueOnce({ data: { status: true } })
    apiClient.patch.mockResolvedValueOnce({ data: { status: true } })
    await createProject(draft)
    await updateProject('FGMU-PRJ-1-2026', patch)
    expect(apiClient.post).toHaveBeenCalledWith('/projects', draft)
    expect(apiClient.post.mock.calls[0][1]).toBe(draft)
    expect(apiClient.patch).toHaveBeenCalledWith('/projects/FGMU-PRJ-1-2026', patch)
  })

  it('returns the backend envelope untouched (no unwrapping loss)', async () => {
    const envelope = { data: { status: true, message: 'ok', data: [] } }
    apiClient.get.mockResolvedValueOnce(envelope)
    await expect(getProjects()).resolves.toBe(envelope)
  })

  it('propagates backend errors to the caller', async () => {
    const failure = new Error('Request failed with status code 403')
    apiClient.post.mockRejectedValueOnce(failure)
    await expect(createProject({})).rejects.toBe(failure)
  })
})
