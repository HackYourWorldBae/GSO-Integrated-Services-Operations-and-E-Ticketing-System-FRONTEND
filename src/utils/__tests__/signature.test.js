import { describe, it, expect, vi, beforeEach } from 'vitest';
import { removeSignatureBackground, fetchDocumentSignatures, clearSignatureCache } from '../signatureUtils';
import api from '@/api/client';

vi.mock('@/api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Signature Utilities (signatureUtils.js)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearSignatureCache();
  });

  describe('removeSignatureBackground', () => {
    it('safely handles non-image or empty inputs without throwing', () => {
      const result = removeSignatureBackground({});
      expect(typeof result).toBe('string');
    });
  });

  describe('fetchDocumentSignatures', () => {
    it('fetches document signatures for FGMU and caches result', async () => {
      const mockData = {
        director: { id: 1, name: 'Dr. Director', signature_url: '/api/v1/auth/signature/1' },
        dispatcher: { id: 2, name: 'Engr. Dispatcher', signature_url: '/api/v1/auth/signature/2' },
      };

      api.get.mockResolvedValueOnce({
        data: {
          status: 'success',
          data: mockData,
        },
      });

      const res1 = await fetchDocumentSignatures('FGMU');
      expect(api.get).toHaveBeenCalledTimes(1);
      expect(api.get).toHaveBeenCalledWith('/auth/document-signatures', {
        params: { unit: 'FGMU' },
      });
      expect(res1.director.name).toBe('Dr. Director');
      expect(res1.dispatcher.name).toBe('Engr. Dispatcher');

      // Second call should return cached without hitting API again
      const res2 = await fetchDocumentSignatures('FGMU');
      expect(api.get).toHaveBeenCalledTimes(1);
      expect(res2).toEqual(res1);
    });

    it('fetches distinct signatures when unitCode differs', async () => {
      api.get
        .mockResolvedValueOnce({
          data: { status: 'success', data: { dispatcher: { name: 'FGMU Staff' } } },
        })
        .mockResolvedValueOnce({
          data: { status: 'success', data: { dispatcher: { name: 'LEAU Staff' } } },
        });

      const fgmu = await fetchDocumentSignatures('FGMU');
      const leau = await fetchDocumentSignatures('LEAU');

      expect(api.get).toHaveBeenCalledTimes(2);
      expect(fgmu.dispatcher.name).toBe('FGMU Staff');
      expect(leau.dispatcher.name).toBe('LEAU Staff');
    });

    it('clears signature cache when clearSignatureCache is called', async () => {
      api.get.mockResolvedValue({
        data: { status: 'success', data: { dispatcher: { name: 'Staff' } } },
      });

      await fetchDocumentSignatures('FGMU');
      expect(api.get).toHaveBeenCalledTimes(1);

      clearSignatureCache();

      await fetchDocumentSignatures('FGMU');
      expect(api.get).toHaveBeenCalledTimes(2);
    });

    it('gracefully returns nulls when api call fails', async () => {
      api.get.mockRejectedValueOnce(new Error('Network error'));
      const res = await fetchDocumentSignatures('FGMU');
      expect(res).toEqual({ director: null, dispatcher: null });
    });
  });

  describe('buildFgmuTemplateData dynamic signature placeholders', () => {
    it('correctly maps Director role when approved by Director', async () => {
      const { buildFgmuTemplateData } = await import('../fgmuDocxGenerator');
      const ticket = {
        id: 101,
        status: 'processing',
        unit_code: 'FGMU',
        reviewed_at: '2026-10-14 10:30:00',
        reviewed_by_user: {
          id: 1,
          name: 'Dr. Director Executive',
          role: 'director',
        },
        dispatched_by_user: {
          id: 2,
          name: 'Engr. Unit Head',
          role: 'admin',
        },
        assignment: {
          assigned_at: '2026-10-14 11:00:00',
        },
      };

      const data = buildFgmuTemplateData(ticket);
      expect(data.Approved_by).toBe('Dr. Director Executive');
      expect(data['Unit&Role']).toBe('Director');
      expect(data['Unit&amp;Role']).toBe('Director');
      expect(data.Approval_Date).toBe('Oct 14, 2026');
      expect(data.Issued_by).toBe('Engr. Unit Head');
      expect(data.Unit).toBe('FGMU');
    });

    it('correctly maps Unit Head role when approved by Unit Head', async () => {
      const { buildFgmuTemplateData } = await import('../fgmuDocxGenerator');
      const ticket = {
        id: 102,
        status: 'approved',
        unit_code: 'FGMU',
        reviewed_at: '2026-10-14 09:00:00',
        reviewed_by_user: {
          id: 5,
          name: 'Engr. Mario Santos',
          role: 'admin',
        },
        dispatched_by_user: null,
      };

      const data = buildFgmuTemplateData(ticket);
      expect(data.Approved_by).toBe('Engr. Mario Santos');
      expect(data['Unit&Role']).toBe('FGMU Head');
      expect(data['Unit&amp;Role']).toBe('FGMU Head');
      expect(data.Approval_Date).toBe('Oct 14, 2026');
    });
  });
});

