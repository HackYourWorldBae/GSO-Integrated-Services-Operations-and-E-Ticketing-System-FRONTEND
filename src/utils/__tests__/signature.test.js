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
});
