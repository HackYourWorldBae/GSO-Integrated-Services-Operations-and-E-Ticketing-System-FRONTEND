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
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  checkSessionApi,
  register,
  forgotPassword,
  verifyResetToken,
  resetPassword,
} from '../auth'

// Level 3 — Component tests: authentication flows must exchange credentials
// and session payloads with the backend exactly as the API expects.
describe('auth api module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('logs in with identifier plus password keys', async () => {
    apiClient.post.mockResolvedValueOnce({ data: { status: true } })
    await login('2021001', 's3cret!')
    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
      identifier: '2021001',
      password: 's3cret!',
    })
  })

  it('logs out and checks the session without a body', async () => {
    apiClient.post.mockResolvedValueOnce({ data: { status: true } })
    apiClient.get.mockResolvedValueOnce({ data: { status: true } })
    await logout()
    await checkSessionApi()
    expect(apiClient.post).toHaveBeenCalledWith('/auth/logout')
    expect(apiClient.get).toHaveBeenCalledWith('/auth/check-session')
  })

  it('fetches the current profile without a body', async () => {
    apiClient.get.mockResolvedValueOnce({ data: { status: true } })
    await getMe()
    expect(apiClient.get).toHaveBeenCalledTimes(1)
    expect(apiClient.get).toHaveBeenCalledWith('/auth/me')
  })

  it('updates the profile and changes passwords with payloads intact', async () => {
    const profile = { first_name: 'Maria', contact_number: '09171234567' }
    const secrets = { current_password: 'old', new_password: 'new', confirm_password: 'new' }
    apiClient.patch.mockResolvedValueOnce({ data: { status: true } })
    apiClient.post.mockResolvedValueOnce({ data: { status: true } })
    await updateProfile(profile)
    await changePassword(secrets)
    expect(apiClient.patch).toHaveBeenCalledWith('/auth/profile', profile)
    expect(apiClient.post).toHaveBeenCalledWith('/auth/change-password', secrets)
  })

  it('registers with multipart FormData untouched', async () => {
    const form = new FormData()
    form.append('email', 'student@bsu.edu.ph')
    apiClient.post.mockResolvedValueOnce({ data: { status: true } })
    await register(form)
    expect(apiClient.post).toHaveBeenCalledWith('/auth/register', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    expect(apiClient.post.mock.calls[0][1]).toBe(form)
  })

  it('returns the backend envelope untouched (no unwrapping loss)', async () => {
    const envelope = { data: { status: true, message: 'ok', data: { user: { id: 1 } } } }
    apiClient.get.mockResolvedValueOnce(envelope)
    await expect(getMe()).resolves.toBe(envelope)
  })

  it('sends forgot-password request with email', async () => {
    apiClient.post.mockResolvedValueOnce({ data: { status: true, message: 'Recovery link sent' } })
    await forgotPassword('test@bsu.edu.ph')
    expect(apiClient.post).toHaveBeenCalledWith('/auth/forgot-password', {
      email: 'test@bsu.edu.ph',
    })
  })

  it('verifies reset token with email and token', async () => {
    apiClient.post.mockResolvedValueOnce({ data: { status: true, data: { email: 'test@bsu.edu.ph' } } })
    await verifyResetToken('test@bsu.edu.ph', 'sampletoken123')
    expect(apiClient.post).toHaveBeenCalledWith('/auth/verify-reset-token', {
      email: 'test@bsu.edu.ph',
      token: 'sampletoken123',
    })
  })

  it('resets password with token, email, new password, and confirmation', async () => {
    apiClient.post.mockResolvedValueOnce({ data: { status: true, message: 'Password updated' } })
    await resetPassword({
      token: 'sampletoken123',
      email: 'test@bsu.edu.ph',
      new_password: 'NewPassword123!',
      confirm_password: 'NewPassword123!',
    })
    expect(apiClient.post).toHaveBeenCalledWith('/auth/reset-password', {
      token: 'sampletoken123',
      email: 'test@bsu.edu.ph',
      new_password: 'NewPassword123!',
      confirm_password: 'NewPassword123!',
    })
  })
})

