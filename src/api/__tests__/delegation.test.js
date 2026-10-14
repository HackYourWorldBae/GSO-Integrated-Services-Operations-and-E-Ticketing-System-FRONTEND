import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from '@/api/client';
import {
  getDelegationUnitsApi,
  assumeUnitHeadApi,
  revertUnitHeadApi,
} from '@/api/auth';

vi.mock('@/api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('Sub-Unit Head Delegation API (auth.js)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls GET /auth/delegation/units to retrieve sub-unit heads and active sessions', async () => {
    const mockData = {
      status: true,
      data: {
        units: [
          { unit_id: 1, unit_code: 'FGMU', unit_name: 'Facilities & Grounds Management Unit', is_session_active: true },
          { unit_id: 2, unit_code: 'LEAU', unit_name: 'Lighting & Electrical Appliances Unit', is_session_active: false },
          { unit_id: 3, unit_code: 'SSU', unit_name: 'Security Services Unit', is_session_active: false },
        ],
        is_acting_head: false,
      },
    };
    apiClient.get.mockResolvedValueOnce({ data: mockData });

    const res = await getDelegationUnitsApi();
    expect(apiClient.get).toHaveBeenCalledWith('/auth/delegation/units');
    expect(res.data.data.units).toHaveLength(3);
    expect(res.data.data.units[0].unit_code).toBe('FGMU');
  });

  it('calls POST /auth/assume-unit-head with target unit code', async () => {
    const mockPayload = { unit_code: 'FGMU' };
    apiClient.post.mockResolvedValueOnce({
      data: {
        status: true,
        message: 'Successfully switched to FGMU dashboard as Acting Unit Head.',
        data: {
          access_token: 'delegated-jwt-token-123',
          redirect_url: '/admin/fgmu',
          user: {
            id: 'director-uuid-1',
            role: 'admin',
            is_acting_head: true,
            acting_unit_code: 'FGMU',
          },
        },
      },
    });

    const res = await assumeUnitHeadApi('FGMU');
    expect(apiClient.post).toHaveBeenCalledWith('/auth/assume-unit-head', mockPayload);
    expect(res.data.data.user.is_acting_head).toBe(true);
    expect(res.data.data.redirect_url).toBe('/admin/fgmu');
  });

  it('calls POST /auth/revert-unit-head to return to Director dashboard', async () => {
    apiClient.post.mockResolvedValueOnce({
      data: {
        status: true,
        message: 'Successfully returned to Director Dashboard.',
        data: {
          access_token: 'restored-director-jwt-token-456',
          redirect_url: '/director/dashboard',
          user: {
            id: 'director-uuid-1',
            role: 'director',
            is_acting_head: false,
          },
        },
      },
    });

    const res = await revertUnitHeadApi();
    expect(apiClient.post).toHaveBeenCalledWith('/auth/revert-unit-head');
    expect(res.data.data.user.role).toBe('director');
    expect(res.data.data.redirect_url).toBe('/director/dashboard');
  });
});
