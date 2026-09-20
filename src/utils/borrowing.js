/**
 * Borrowing workflow helpers (LEAU: Borrowing of Plants / Tools & Equipment).
 *
 * Pure functions only — no network, no DOM, no store access — so they are
 * cheaply unit-testable under Vitest (node environment).
 *
 * Consumed by: ApprovedTicketsWorkspace, BorrowingDispatchWorkspace,
 * BorrowingWorkspace, LEAUBorrowingForm (via FormsView).
 */

export const BORROWING_SERVICES = [
  'borrowing of plants',
  'borrowing of tools/equipment',
];

export const BORROWING_STATUSES = [
  'pending_director',
  'approved_director',
  'inventory_assigned',
  'ready_for_pickup',
  'picked_up',
  'overdue',
  'returned',
  'cancelled',
];

export const BORROWING_TERMINAL_STATUSES = ['returned', 'cancelled'];

/** Allowed status transitions for the borrowing state machine. */
export const BORROWING_TRANSITIONS = {
  pending_director: ['approved_director', 'cancelled'],
  approved_director: ['inventory_assigned', 'cancelled'],
  inventory_assigned: ['ready_for_pickup', 'cancelled'],
  ready_for_pickup: ['picked_up', 'cancelled'],
  picked_up: ['overdue', 'returned', 'cancelled'],
  overdue: ['returned', 'cancelled'],
  returned: [],
  cancelled: [],
};

/**
 * Normalize a service name for comparison (case/space/slash tolerant).
 */
export function normalizeServiceName(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * True when a service name / ticket object is a borrowing service.
 * Accepts a raw string or a ticket-like object with service/service_type/type.
 */
export function isBorrowingService(input) {
  let name = '';
  if (typeof input === 'string') {
    name = input;
  } else if (input && typeof input === 'object') {
    name = input.service || input.service_type || input.type || '';
  }
  const normalized = normalizeServiceName(name);
  return (
    normalized.includes('borrowing of plants') ||
    normalized.includes('borrowing of tools')
  );
}

/**
 * Human-readable label for a borrowing status slug.
 */
export function borrowingStatusLabel(status) {
  return String(status ?? '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * True when a status is terminal (returned / cancelled).
 */
export function isBorrowingTerminal(status) {
  return BORROWING_TERMINAL_STATUSES.includes(String(status ?? ''));
}

/**
 * True when a transition from -> to is allowed.
 */
export function canBorrowingTransition(from, to) {
  const allowed = BORROWING_TRANSITIONS[String(from ?? '')];
  if (!Array.isArray(allowed)) return false;
  return allowed.includes(String(to ?? ''));
}

/**
 * True when a picked-up request is past its expected return date.
 * `today` is injectable (YYYY-MM-DD) for deterministic tests.
 */
export function isOverdueBorrowing(request, today = null) {
  if (!request || typeof request !== 'object') return false;
  if (request.status === 'overdue') return true;
  if (request.status !== 'picked_up' || !request.expected_return_date) return false;
  const todayStr = today || new Date().toISOString().split('T')[0];
  return String(request.expected_return_date) < String(todayStr);
}

/**
 * Validate pickup/return date pair from the borrowing form.
 * Returns { valid: boolean, error: string | null }.
 */
export function validateBorrowingDates(dateNeeded, expectedReturnDate) {
  if (!dateNeeded) {
    return { valid: false, error: 'Pickup date is required.' };
  }
  if (!expectedReturnDate) {
    return { valid: false, error: 'Return date is required.' };
  }
  if (String(expectedReturnDate) < String(dateNeeded)) {
    return { valid: false, error: 'Return date must be on or after the pickup date.' };
  }
  return { valid: true, error: null };
}

/**
 * Clamp an assignment quantity to sane bounds.
 * Returns at least 1 and at most min(available, requested).
 */
export function clampAssignQuantity(quantity, available, requested) {
  const avail = Math.max(0, Number(available || 0));
  const req = Math.max(1, Number(requested || 1));
  const qty = Math.max(1, Number(quantity || 1));
  return Math.min(qty, Math.max(1, Math.min(avail, req)));
}

/**
 * True when inventory may be assigned (director-approved, nothing assigned yet).
 */
export function canAssignInventory(borrowingStatus) {
  return String(borrowingStatus ?? '') === 'approved_director';
}

/**
 * Dispatch link for a borrowing ticket.
 * Borrowing is unified into the LEAU Dispatch tickets page, which switches to
 * inventory assignment when the ticket nature is a borrowing request.
 */
export function borrowingDispatchLink(ticketId) {
  return `/admin/leau/assign-workers?ticket=${ticketId}`;
}
