import { describe, it, expect } from 'vitest';
import {
  BORROWING_STATUSES,
  BORROWING_TERMINAL_STATUSES,
  BORROWING_TRANSITIONS,
  normalizeServiceName,
  isBorrowingService,
  borrowingStatusLabel,
  isBorrowingTerminal,
  canBorrowingTransition,
  isOverdueBorrowing,
  validateBorrowingDates,
  clampAssignQuantity,
  canAssignInventory,
  borrowingDispatchLink,
} from '../borrowing';

// Level 1 — Unit tests: pure borrowing helpers shared by the LEAU
// borrowing form, dispatch workspace, and queue workspace.
describe('borrowing utils', () => {
  it('exposes the full 8-state status catalog', () => {
    expect(BORROWING_STATUSES).toEqual([
      'pending_director',
      'approved_director',
      'inventory_assigned',
      'ready_for_pickup',
      'picked_up',
      'overdue',
      'returned',
      'cancelled',
    ]);
    expect(BORROWING_TERMINAL_STATUSES).toEqual(['returned', 'cancelled']);
    expect(Object.keys(BORROWING_TRANSITIONS)).toHaveLength(8);
  });

  it('normalizes service names case- and space-insensitively', () => {
    expect(normalizeServiceName('  Borrowing   of Plants ')).toBe('borrowing of plants');
    expect(normalizeServiceName('BORROWING OF TOOLS/EQUIPMENT')).toBe('borrowing of tools/equipment');
    expect(normalizeServiceName(null)).toBe('');
  });

  it('detects borrowing services from strings and ticket objects', () => {
    expect(isBorrowingService('Borrowing of plants')).toBe(true);
    expect(isBorrowingService('Borrowing of tools/ equipment')).toBe(true);
    expect(isBorrowingService('Cleaning/ Grubbing')).toBe(false);
    expect(isBorrowingService({ service_type: 'Borrowing of Plants' })).toBe(true);
    expect(isBorrowingService({ service: 'Borrowing of tools/equipment' })).toBe(true);
    expect(isBorrowingService({ type: 'Hauling' })).toBe(false);
    expect(isBorrowingService(null)).toBe(false);
  });

  it('formats status slugs as human labels', () => {
    expect(borrowingStatusLabel('ready_for_pickup')).toBe('Ready For Pickup');
    expect(borrowingStatusLabel('picked_up')).toBe('Picked Up');
    expect(borrowingStatusLabel('')).toBe('');
  });

  it('identifies terminal states and guards transitions', () => {
    expect(isBorrowingTerminal('returned')).toBe(true);
    expect(isBorrowingTerminal('cancelled')).toBe(true);
    expect(isBorrowingTerminal('picked_up')).toBe(false);

    expect(canBorrowingTransition('pending_director', 'approved_director')).toBe(true);
    expect(canBorrowingTransition('approved_director', 'inventory_assigned')).toBe(true);
    expect(canBorrowingTransition('inventory_assigned', 'ready_for_pickup')).toBe(true);
    expect(canBorrowingTransition('ready_for_pickup', 'picked_up')).toBe(true);
    expect(canBorrowingTransition('picked_up', 'overdue')).toBe(true);
    expect(canBorrowingTransition('picked_up', 'returned')).toBe(true);
    expect(canBorrowingTransition('overdue', 'returned')).toBe(true);
    expect(canBorrowingTransition('returned', 'picked_up')).toBe(false);
    expect(canBorrowingTransition('approved_director', 'picked_up')).toBe(false);
    expect(canBorrowingTransition('bogus', 'returned')).toBe(false);
  });

  it('flags overdue only for picked-up requests past their return date', () => {
    expect(isOverdueBorrowing({ status: 'overdue' }, '2026-09-20')).toBe(true);
    expect(
      isOverdueBorrowing({ status: 'picked_up', expected_return_date: '2026-09-19' }, '2026-09-20')
    ).toBe(true);
    expect(
      isOverdueBorrowing({ status: 'picked_up', expected_return_date: '2026-09-21' }, '2026-09-20')
    ).toBe(false);
    expect(
      isOverdueBorrowing({ status: 'ready_for_pickup', expected_return_date: '2026-09-01' }, '2026-09-20')
    ).toBe(false);
    expect(isOverdueBorrowing(null, '2026-09-20')).toBe(false);
  });

  it('validates the pickup/return date pair from the form', () => {
    expect(validateBorrowingDates('', '2026-09-25')).toEqual({
      valid: false,
      error: 'Pickup date is required.',
    });
    expect(validateBorrowingDates('2026-09-20', '')).toEqual({
      valid: false,
      error: 'Return date is required.',
    });
    expect(validateBorrowingDates('2026-09-25', '2026-09-20')).toEqual({
      valid: false,
      error: 'Return date must be on or after the pickup date.',
    });
    expect(validateBorrowingDates('2026-09-20', '2026-09-20')).toEqual({ valid: true, error: null });
    expect(validateBorrowingDates('2026-09-20', '2026-09-27')).toEqual({ valid: true, error: null });
  });

  it('clamps assignment quantities to stock and request bounds', () => {
    expect(clampAssignQuantity(2, 5, 3)).toBe(2);
    expect(clampAssignQuantity(9, 5, 3)).toBe(3);
    expect(clampAssignQuantity(0, 5, 3)).toBe(1);
    expect(clampAssignQuantity(4, 0, 3)).toBe(1);
  });

  it('gates inventory assignment on director approval', () => {
    expect(canAssignInventory('approved_director')).toBe(true);
    expect(canAssignInventory('pending_director')).toBe(false);
    expect(canAssignInventory('inventory_assigned')).toBe(false);
  });

  it('builds the borrowing dispatch deep link', () => {
    expect(borrowingDispatchLink('LEAU-TIC-1-2026')).toBe(
      '/admin/leau/assign-workers?ticket=LEAU-TIC-1-2026'
    );
  });
});
