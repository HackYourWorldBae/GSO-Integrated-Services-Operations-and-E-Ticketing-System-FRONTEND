import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

import apiClient from '../client'
import { getResendConfig, updateResendConfig, testResendEmail } from '../settings'

describe('settings api module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches resend configuration via GET /settings/resend', async () => {
    const mockData = {
      status: true,
      data: {
        resend_api_key_configured: true,
        resend_api_key_masked: 're_12...99',
        resend_from_email: 'noreply@gso.test',
        resend_notifications_enabled: true,
      },
    }
    apiClient.get.mockResolvedValueOnce({ data: mockData })

    const res = await getResendConfig()
    expect(apiClient.get).toHaveBeenCalledWith('/settings/resend')
    expect(res.data).toEqual(mockData)
  })

  it('updates resend configuration via POST /settings/resend', async () => {
    const payload = {
      resend_api_key: 're_test_key_1234567890',
      resend_from_email: 'gso-notifications@bsu.edu.ph',
      resend_notifications_enabled: true,
    }
    apiClient.post.mockResolvedValueOnce({ data: { status: true, message: 'Settings saved' } })

    await updateResendConfig(payload)
    expect(apiClient.post).toHaveBeenCalledWith('/settings/resend', payload)
  })

  it('sends test email via POST /settings/resend/test', async () => {
    apiClient.post.mockResolvedValueOnce({ data: { status: true, message: 'Test email delivered' } })

    await testResendEmail('admin@bsu.edu.ph')
    expect(apiClient.post).toHaveBeenCalledWith('/settings/resend/test', {
      email: 'admin@bsu.edu.ph',
    })
  })
})
