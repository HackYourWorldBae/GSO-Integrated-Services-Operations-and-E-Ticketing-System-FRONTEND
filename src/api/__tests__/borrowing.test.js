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
  getBorrowingByTicket,
  getBorrowingQueue,
  getOverdueBorrowings,
  markOverdueBorrowings,
  directorApproveBorrowing,
  directorRejectBorrowing,
  assignInventoryToBorrowing,
  markBorrowingReadyForPickup,
  recordBorrowingPickup,
  recordBorrowingReturn,
  cancelBorrowing,
} from '../borrowing'

// Level 3 — Component tests: the LEAU borrowing workflow must reach the
// backend with the right verb, route, and payload at every stage
// (director approval -> assign inventory -> ready -> pickup -> return).
describe('borrowing api module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches borrowing details by ticket id', async () => {
    apiClient.get.mockResolvedValueOnce({ data: { status: true } })
    await getBorrowingByTicket('LEAU-TIC-1-2026')
    expect(apiClient.get).toHaveBeenCalledWith('/borrowing/LEAU-TIC-1-2026')
  })

  it('fetches the LEAU borrowing queue with pagination params intact', async () => {
    const params = { per_page: 500 }
    apiClient.get.mockResolvedValueOnce({ data: { status: true } })
    await getBorrowingQueue(params)
    expect(apiClient.get).toHaveBeenCalledWith('/borrowing/queue/leau', { params })
    expect(apiClient.get.mock.calls[0][1].params).toBe(params)
  })

  it('fetches overdue borrowings and triggers the overdue sweep', async () => {
    apiClient.get.mockResolvedValueOnce({ data: { status: true } })
    await getOverdueBorrowings()
    expect(apiClient.get).toHaveBeenCalledWith('/borrowing/overdue')

    apiClient.post.mockResolvedValueOnce({ data: { status: true } })
    await markOverdueBorrowings()
    expect(apiClient.post).toHaveBeenCalledWith('/borrowing/mark-overdue', {})
  })

  it('routes director approve/reject with notes and reason intact', async () => {
    apiClient.patch.mockResolvedValueOnce({ data: { status: true } })
    await directorApproveBorrowing('LEAU-TIC-1-2026', 'Verified request')
    expect(apiClient.patch).toHaveBeenCalledWith(
      '/borrowing/LEAU-TIC-1-2026/director-approve',
      { notes: 'Verified request' }
    )

    apiClient.patch.mockResolvedValueOnce({ data: { status: true } })
    await directorRejectBorrowing('LEAU-TIC-1-2026', 'Incomplete docs')
    expect(apiClient.patch).toHaveBeenCalledWith(
      '/borrowing/LEAU-TIC-1-2026/director-reject',
      { reason: 'Incomplete docs' }
    )
  })

  it('assigns inventory with item id and quantity intact', async () => {
    const payload = { inventory_id: 12, assigned_quantity: 2 }
    apiClient.post.mockResolvedValueOnce({ data: { status: true } })
    await assignInventoryToBorrowing('LEAU-TIC-1-2026', payload)
    expect(apiClient.post).toHaveBeenCalledWith(
      '/borrowing/LEAU-TIC-1-2026/assign-inventory',
      payload
    )
    // The module normalizes { inventory_id, assigned_quantity }, so compare
    // by value rather than reference.
    expect(apiClient.post.mock.calls[0][1]).toStrictEqual(payload)
  })

  it('advances ready-for-pickup then pickup without payload loss', async () => {
    apiClient.patch.mockResolvedValueOnce({ data: { status: true } })
    await markBorrowingReadyForPickup('LEAU-TIC-1-2026', 'Shelf A3')
    expect(apiClient.patch).toHaveBeenCalledWith(
      '/borrowing/LEAU-TIC-1-2026/ready-for-pickup',
      { notes: 'Shelf A3' }
    )

    const pickup = { picked_up_by: 'user-1', notes: 'Early pickup' }
    apiClient.patch.mockResolvedValueOnce({ data: { status: true } })
    await recordBorrowingPickup('LEAU-TIC-1-2026', pickup)
    expect(apiClient.patch).toHaveBeenCalledWith(
      '/borrowing/LEAU-TIC-1-2026/pickup',
      pickup
    )
    expect(apiClient.patch.mock.calls[1][1]).toBe(pickup)
  })

  it('records returns with condition and notes (auto-archive, no rating)', async () => {
    const payload = { return_condition: 'good', return_notes: 'Clean' }
    apiClient.patch.mockResolvedValueOnce({ data: { status: true } })
    await recordBorrowingReturn('LEAU-TIC-1-2026', payload)
    expect(apiClient.patch).toHaveBeenCalledWith(
      '/borrowing/LEAU-TIC-1-2026/return',
      payload
    )

    apiClient.patch.mockResolvedValueOnce({ data: { status: true } })
    await cancelBorrowing('LEAU-TIC-1-2026', 'Duplicate')
    expect(apiClient.patch).toHaveBeenCalledWith(
      '/borrowing/LEAU-TIC-1-2026/cancel',
      { reason: 'Duplicate' }
    )
  })

  it('returns the backend envelope untouched (no unwrapping loss)', async () => {
    const envelope = { data: { status: true, message: 'ok', data: { borrowing_id: 3 } } }
    apiClient.get.mockResolvedValueOnce(envelope)
    await expect(getBorrowingByTicket('LEAU-TIC-1-2026')).resolves.toBe(envelope)
  })

  it('propagates backend errors to the caller', async () => {
    const failure = new Error('Request failed with status code 403')
    apiClient.post.mockRejectedValueOnce(failure)
    await expect(
      assignInventoryToBorrowing('LEAU-TIC-1-2026', { inventory_id: 1, assigned_quantity: 1 })
    ).rejects.toBe(failure)
  })
});
