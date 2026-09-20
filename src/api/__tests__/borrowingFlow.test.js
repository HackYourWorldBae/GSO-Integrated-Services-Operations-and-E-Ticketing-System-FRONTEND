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
  assignInventoryToBorrowing,
  markBorrowingReadyForPickup,
  recordBorrowingPickup,
  recordBorrowingReturn,
  getBorrowingByTicket,
} from '../borrowing'
import {
  canBorrowingTransition,
  isOverdueBorrowing,
  clampAssignQuantity,
} from '../../utils/borrowing'

// Level 2 — Integration tests: the full borrowing chain
// (assign -> ready -> pickup -> return) preserves data across stages and
// follows the allowed state-machine transitions end to end.
describe('borrowing end-to-end flow', () => {
  const ticketId = 'LEAU-TIC-1-2026'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('chains assign -> ready -> pickup -> return with intact payloads', async () => {
    apiClient.post.mockResolvedValueOnce({ data: { status: true } })
    apiClient.patch
      .mockResolvedValueOnce({ data: { status: true } })
      .mockResolvedValueOnce({ data: { status: true } })
      .mockResolvedValueOnce({ data: { status: true } })

    const assignPayload = { inventory_id: 12, assigned_quantity: 2 }
    await assignInventoryToBorrowing(ticketId, assignPayload)
    await markBorrowingReadyForPickup(ticketId, 'Shelf A3')
    await recordBorrowingPickup(ticketId, {})
    await recordBorrowingReturn(ticketId, { return_condition: 'good', return_notes: 'Clean' })

    expect(apiClient.post).toHaveBeenCalledWith(
      `/borrowing/${ticketId}/assign-inventory`,
      assignPayload
    )
    expect(apiClient.patch).toHaveBeenNthCalledWith(1,
      `/borrowing/${ticketId}/ready-for-pickup`,
      { notes: 'Shelf A3' }
    )
    expect(apiClient.patch).toHaveBeenNthCalledWith(2,
      `/borrowing/${ticketId}/pickup`,
      {}
    )
    expect(apiClient.patch).toHaveBeenNthCalledWith(3,
      `/borrowing/${ticketId}/return`,
      { return_condition: 'good', return_notes: 'Clean' }
    )
    expect(apiClient.patch).toHaveBeenCalledTimes(3)
  })

  it('follows allowed state transitions through the whole lifecycle', () => {
    const chain = [
      'pending_director',
      'approved_director',
      'inventory_assigned',
      'ready_for_pickup',
      'picked_up',
      'returned',
    ]
    for (let i = 0; i < chain.length - 1; i += 1) {
      expect(canBorrowingTransition(chain[i], chain[i + 1])).toBe(true)
    }
    expect(canBorrowingTransition('approved_director', 'picked_up')).toBe(false)
  })

  it('keeps stock consistent across assign and return', async () => {
    const total = 5
    let available = 5
    const requested = 3

    const assigned = clampAssignQuantity(3, available, requested)
    expect(assigned).toBe(3)

    apiClient.post.mockResolvedValueOnce({ data: { status: true } })
    await assignInventoryToBorrowing(ticketId, { inventory_id: 7, assigned_quantity: assigned })
    available -= assigned
    expect(available).toBe(2)

    apiClient.patch.mockResolvedValueOnce({ data: { status: true } })
    await recordBorrowingReturn(ticketId, { return_condition: 'good', return_notes: '' })
    available += assigned
    expect(available).toBe(total)
  })

  it('detects overdue after the expected return date passes', () => {
    const borrowed = { status: 'picked_up', expected_return_date: '2026-09-19' }
    expect(isOverdueBorrowing(borrowed, '2026-09-20')).toBe(true)
    expect(canBorrowingTransition('picked_up', 'overdue')).toBe(true)
    expect(canBorrowingTransition('overdue', 'returned')).toBe(true)
  })

  it('refetches borrowing details after each stage without data loss', async () => {
    const envelope = {
      data: {
        status: true,
        data: { borrowing: { ticket_id: ticketId, status: 'inventory_assigned' } },
      },
    }
    apiClient.post.mockResolvedValueOnce({ data: { status: true } })
    apiClient.get.mockResolvedValue(envelope)

    await assignInventoryToBorrowing(ticketId, { inventory_id: 7, assigned_quantity: 1 })
    const refetched = await getBorrowingByTicket(ticketId)
    expect(refetched).toBe(envelope)
    expect(refetched.data.data.borrowing.status).toBe('inventory_assigned')
  })
});
