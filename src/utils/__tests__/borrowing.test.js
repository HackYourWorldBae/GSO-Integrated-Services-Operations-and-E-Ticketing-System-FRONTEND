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
  BORROWING_STEPS,
  getBorrowingCurrentStep,
  getBorrowingStepDescription,
  getBorrowingStatusLabel,
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
    expect(isBorrowingService({ service: 'Cleaning/ Grubbing', borrowing: { college_building: 'Main' } })).toBe(false);
    expect(isBorrowingService({ service: 'Hauling', borrowing: { college_building: 'Gym' } })).toBe(false);
    expect(isBorrowingService({ service: 'Disinfection', details: { college_building: 'Admin' } })).toBe(false);
    expect(isBorrowingService(null)).toBe(false);
  });

  it('does not confuse typed item names with borrowing service categories', () => {
    expect(isBorrowingService('Peace Lily')).toBe(false);
    expect(isBorrowingService('Monstera Deliciosa')).toBe(false);
    expect(isBorrowingService('Wheelbarrow')).toBe(false);
    expect(isBorrowingService('Lawn Mower')).toBe(false);
    expect(isBorrowingService('Garden Shovel')).toBe(false);
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

  it('exposes the 7-step borrowing workflow catalog', () => {
    expect(BORROWING_STEPS).toHaveLength(7);
    expect(BORROWING_STEPS.map((s) => s.label)).toEqual([
      'Digital Submission',
      'Ticket Creation',
      'Director Approval',
      'Inventory Allocation',
      'Ready for Pickup',
      'Item Picked Up',
      'Returned & Completed',
    ]);
  });

  it('maps ticket status to borrowing step numbers accurately', () => {
    expect(getBorrowingCurrentStep(null)).toBe(1);
    expect(getBorrowingCurrentStep({ status: 'pending' })).toBe(2);
    expect(getBorrowingCurrentStep({ status: 'pending', current_step: 1 })).toBe(2);
    expect(getBorrowingCurrentStep({ status: 'approved' })).toBe(3);
    expect(getBorrowingCurrentStep({ borrowing: { status: 'approved_director' } })).toBe(3);
    expect(getBorrowingCurrentStep({ borrowing: { status: 'inventory_assigned' } })).toBe(4);
    expect(getBorrowingCurrentStep({ borrowing: { status: 'ready_for_pickup' } })).toBe(5);
    expect(getBorrowingCurrentStep({ borrowing: { status: 'picked_up' } })).toBe(6);
    expect(getBorrowingCurrentStep({ borrowing: { status: 'overdue' } })).toBe(6);
    expect(getBorrowingCurrentStep({ status: 'closed', borrowing: { status: 'returned' } })).toBe(7);
    expect(getBorrowingCurrentStep({ status: 'completed' })).toBe(7);
  });

  it('generates dynamic context-aware borrowing step descriptions', () => {
    const ticket = {
      currentStep: 6,
      borrowing: {
        item_name_requested: 'Peace Lily',
        quantity_needed: 3,
        assigned_quantity: 3,
        date_needed: '2026-09-25',
        expected_return_date: '2026-09-30',
        status: 'picked_up',
      },
    };

    const desc0 = getBorrowingStepDescription(ticket, BORROWING_STEPS[0], 0);
    expect(desc0).toContain('Peace Lily');
    expect(desc0).toContain('3 unit(s)');

    const desc2 = getBorrowingStepDescription(ticket, BORROWING_STEPS[2], 2);
    expect(desc2).toContain('Approved by the Director');

    const desc3 = getBorrowingStepDescription(ticket, BORROWING_STEPS[3], 3);
    expect(desc3).toContain('LEAU allocated 3 unit(s)');

    const desc4 = getBorrowingStepDescription(ticket, BORROWING_STEPS[4], 4);
    expect(desc4).toContain('ready for pickup');

    const desc5 = getBorrowingStepDescription(ticket, BORROWING_STEPS[5], 5);
    expect(desc5).toContain('claimed by borrower');
    expect(desc5).toContain('2026-09-30');
  });

  describe('getBorrowingStatusLabel', () => {
    it('defensively overrides stale Queued for Dispatch label', () => {
      expect(getBorrowingStatusLabel({
        status: 'approved',
        status_label: 'Queued for Dispatch',
      })).toBe('Approved - Awaiting Inventory Assignment');

      expect(getBorrowingStatusLabel({
        status: 'approved',
        statusLabel: 'Queued for Dispatch',
      })).toBe('Approved - Awaiting Inventory Assignment');
    });

    it('maps approved_director to Approved - Awaiting Inventory Assignment', () => {
      expect(getBorrowingStatusLabel({
        status: 'approved',
        borrowing: { status: 'approved_director' },
      })).toBe('Approved - Awaiting Inventory Assignment');

      expect(getBorrowingStatusLabel({
        status: 'approved',
      })).toBe('Approved - Awaiting Inventory Assignment');
    });

    it('maps pending states to Pending Director Approval', () => {
      expect(getBorrowingStatusLabel(null)).toBe('Pending Director Approval');
      expect(getBorrowingStatusLabel({})).toBe('Pending Director Approval');
      expect(getBorrowingStatusLabel({ status: 'pending' })).toBe('Pending Director Approval');
      expect(getBorrowingStatusLabel({ borrowing: { status: 'pending_director' } })).toBe('Pending Director Approval');
    });

    it('maps inventory_assigned to Inventory Assigned - Awaiting Pickup Prep', () => {
      expect(getBorrowingStatusLabel({
        status: 'processing',
        borrowing: { status: 'inventory_assigned' },
      })).toBe('Inventory Assigned - Awaiting Pickup Prep');
    });

    it('maps ready_for_pickup to Ready for Pickup', () => {
      expect(getBorrowingStatusLabel({
        status: 'processing',
        borrowing: { status: 'ready_for_pickup' },
      })).toBe('Ready for Pickup');
    });

    it('maps picked_up to Item Picked Up', () => {
      expect(getBorrowingStatusLabel({
        status: 'processing',
        borrowing: { status: 'picked_up' },
      })).toBe('Item Picked Up');
    });

    it('maps overdue to Overdue for Return', () => {
      expect(getBorrowingStatusLabel({
        status: 'processing',
        borrowing: { status: 'overdue' },
      })).toBe('Overdue for Return');
    });

    it('maps closed, completed, and returned to Returned & Completed', () => {
      expect(getBorrowingStatusLabel({
        status: 'closed',
        borrowing: { status: 'returned' },
      })).toBe('Returned & Completed');

      expect(getBorrowingStatusLabel({
        status: 'completed',
      })).toBe('Returned & Completed');
    });

    it('maps declined and rejected to Declined by Director', () => {
      expect(getBorrowingStatusLabel({
        status: 'declined',
      })).toBe('Declined by Director');

      expect(getBorrowingStatusLabel({
        status: 'rejected',
      })).toBe('Declined by Director');
    });

    it('maps cancelled to Cancelled', () => {
      expect(getBorrowingStatusLabel({
        status: 'cancelled',
      })).toBe('Cancelled');
    });
  });
});

