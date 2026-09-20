import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import apiClient from '../client';
import {
  requestCollaboration,
  getTicketCollaborations,
  respondCollaboration,
  assignCollaboratingPersonnel,
  completeCollaboration,
  fetchMyUnitCollaborations,
  fetchCollabTickets,
} from '../collaborations';

describe('collaborations api module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits a collaboration request to the ticket-scoped endpoint', async () => {
    const payload = {
      ticket_id: 'FGMU-TIC-10-2026',
      collaborating_unit_id: 2,
      scope_of_work: 'Trimming branches obstructing overhead power lines',
    };
    apiClient.post.mockResolvedValueOnce({ data: { status: true } });
    await requestCollaboration(payload);
    expect(apiClient.post).toHaveBeenCalledWith(
      '/tickets/FGMU-TIC-10-2026/collaborations',
      expect.objectContaining({
        collaborating_unit_id: 2,
        reason: 'Trimming branches obstructing overhead power lines',
        scope_of_work: 'Trimming branches obstructing overhead power lines',
      })
    );
  });

  it('fetches collaborations for a ticket', async () => {
    apiClient.get.mockResolvedValueOnce({ data: { status: true, data: [] } });
    await getTicketCollaborations('FGMU-TIC-10-2026');
    expect(apiClient.get).toHaveBeenCalledWith('/tickets/FGMU-TIC-10-2026/collaborations');
  });

  it('responds to a collaboration request (accept/decline)', async () => {
    const payload = { response_status: 'accepted', notes: 'Will assign 2 tree cutters' };
    apiClient.patch.mockResolvedValueOnce({ data: { status: true } });
    await respondCollaboration(123, payload);
    expect(apiClient.patch).toHaveBeenCalledWith(
      '/collaborations/123/respond',
      expect.objectContaining({
        action: 'accepted',
        response_status: 'accepted',
        response_notes: 'Will assign 2 tree cutters',
        notes: 'Will assign 2 tree cutters',
      })
    );
  });

  it('assigns personnel from collaborating unit', async () => {
    const payload = {
      personnel_id: 8,
      implementation_date: '2026-09-22',
      task_notes: 'Chainsaw crew',
    };
    apiClient.post.mockResolvedValueOnce({ data: { status: true } });
    await assignCollaboratingPersonnel(123, payload);
    expect(apiClient.post).toHaveBeenCalledWith('/collaborations/123/assign-personnel', payload);
  });

  it('completes collaboration with notes', async () => {
    apiClient.patch.mockResolvedValueOnce({ data: { status: true } });
    await completeCollaboration(123, { notes: 'Finished cutting branches' });
    expect(apiClient.patch).toHaveBeenCalledWith(
      '/collaborations/123/complete',
      expect.objectContaining({
        notes: 'Finished cutting branches',
        completion_notes: 'Finished cutting branches',
      })
    );
  });

  it('fetches unit collaborations', async () => {
    apiClient.get.mockResolvedValueOnce({ data: { status: true, data: { incoming: [], outgoing: [] } } });
    await fetchMyUnitCollaborations();
    expect(apiClient.get).toHaveBeenCalledWith('/collaborations/my-unit', { params: {} });
  });

  it('fetches collab tickets filtered by direction and stage', async () => {
    apiClient.get.mockResolvedValueOnce({ data: { status: true, data: { tickets: [] } } });
    await fetchCollabTickets({ direction: 'incoming', stage: 'approved' });
    expect(apiClient.get).toHaveBeenCalledWith(
      '/collaborations/tickets',
      { params: { direction: 'incoming', stage: 'approved' } }
    );
  });
});
