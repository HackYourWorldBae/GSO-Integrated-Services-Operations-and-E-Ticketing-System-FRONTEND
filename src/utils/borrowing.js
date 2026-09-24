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

export const BORROWING_STEPS = [
  { label: 'Digital Submission',   description: 'The borrower completes and submits the digital borrowing form.' },
  { label: 'Ticket Creation',      description: 'System generated a Digital Ticket under Pending Director Approval.' },
  { label: 'Director Approval',    description: 'Director reviews and approves the borrowing request.' },
  { label: 'Inventory Allocation', description: 'LEAU checks and allocates requested inventory item(s).' },
  { label: 'Ready for Pickup',     description: 'Item(s) prepped and ready for pickup at the LEAU office.' },
  { label: 'Item Picked Up',       description: 'Item(s) claimed by borrower for the approved borrowing duration.' },
  { label: 'Returned & Completed', description: 'Item(s) returned to LEAU, inspected, and request finalized.' },
];

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
 * Accepts a raw string or a ticket-like object with service/service_type/type/borrowing.
 */
export function isBorrowingService(input) {
  if (!input) return false;

  let name = '';
  if (typeof input === 'string') {
    name = input;
  } else if (typeof input === 'object') {
    name = input.service || input.service_type || input.title || input.type || '';
  }
  const normalized = normalizeServiceName(name);
  if (
    normalized.includes('borrowing of plants') ||
    normalized.includes('borrowing of tools') ||
    normalized.includes('borrowing request')
  ) {
    return true;
  }

  // If a known service or title is explicitly present and does not match borrowing, it is NOT borrowing
  if (normalized.length > 0) {
    return false;
  }

  // Fallback: only if service name/title is empty, inspect borrowing property for valid borrowing fields
  if (typeof input === 'object' && input.borrowing && typeof input.borrowing === 'object') {
    const b = input.borrowing;
    return Boolean(
      b.item_name_requested ||
      b.item_name ||
      b.date_needed ||
      b.expected_return_date ||
      b.borrowing_request_id ||
      (b.status && BORROWING_STATUSES.includes(b.status))
    );
  }

  return false;
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
 * Map a borrowing ticket / request record to an accurate, user-facing status label.
 * Specifically overrides generic job-order dispatch labels like "Queued for Dispatch".
 *
 * @param {Object} ticket
 * @returns {string}
 */
export function getBorrowingStatusLabel(ticket) {
  if (!ticket) return 'Pending Director Approval';

  const b = ticket.borrowing || ticket.details || {};
  const bStatus = String(b.status || ticket.borrowing_status || '').toLowerCase().trim();
  const tStatus = String(ticket.status || '').toLowerCase().trim();
  const rawLabel = String(ticket.status_label || ticket.statusLabel || '').trim();

  // Cancelled or declined states
  if (['declined', 'rejected'].includes(tStatus) || bStatus === 'cancelled') {
    return 'Declined by Director';
  }
  if (tStatus === 'cancelled') {
    return 'Cancelled';
  }

  // Step 7: Returned & Completed
  if (['closed', 'completed'].includes(tStatus) || bStatus === 'returned') {
    return 'Returned & Completed';
  }

  // Step 6 (variant): Overdue
  if (bStatus === 'overdue' || rawLabel.toLowerCase().includes('overdue')) {
    return 'Overdue for Return';
  }

  // Step 6: Item Picked Up
  if (bStatus === 'picked_up' || rawLabel.toLowerCase().includes('picked up')) {
    return 'Item Picked Up';
  }

  // Step 5: Ready for Pickup
  if (bStatus === 'ready_for_pickup' || rawLabel.toLowerCase().includes('ready for pickup')) {
    return 'Ready for Pickup';
  }

  // Step 4: Inventory Assigned
  if (bStatus === 'inventory_assigned' || rawLabel.toLowerCase().includes('inventory assigned')) {
    return 'Inventory Assigned - Awaiting Pickup Prep';
  }

  // Step 3: Director Approved (explicitly catches and replaces stale "Queued for Dispatch")
  if (
    ['approved', 'approved_director'].includes(tStatus) ||
    bStatus === 'approved_director' ||
    rawLabel.toLowerCase().includes('dispatch') ||
    rawLabel.toLowerCase().includes('approved')
  ) {
    return 'Approved - Awaiting Inventory Assignment';
  }

  // Step 2: Pending Director Approval
  if (['pending', 'pending_director'].includes(tStatus) || bStatus === 'pending_director') {
    return 'Pending Director Approval';
  }

  return rawLabel || 'Pending Director Approval';
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

/**
 * Calculate the current step index (1-7) for a borrowing ticket.
 *
 * 1: Digital Submission (completed upon submit)
 * 2: Ticket Creation (active while pending director review)
 * 3: Director Approval (active once approved by director)
 * 4: Inventory Allocation (active once inventory is assigned)
 * 5: Ready for Pickup (active once marked ready for pickup)
 * 6: Item Picked Up (active during borrowing period / overdue)
 * 7: Returned & Completed (terminal)
 */
export function getBorrowingCurrentStep(ticket) {
  if (!ticket) return 1;
  const b = ticket.borrowing || ticket.details || {};
  const bStatus = String(b.status || ticket.borrowing_status || '').toLowerCase();
  const tStatus = String(ticket.status || '').toLowerCase();
  const rawStep = parseInt(ticket.current_step, 10);

  if (['closed', 'completed'].includes(tStatus) || bStatus === 'returned' || rawStep >= 7) {
    return 7;
  }
  if (bStatus === 'picked_up' || bStatus === 'overdue' || rawStep === 6 || tStatus === 'picked_up') {
    return 6;
  }
  if (bStatus === 'ready_for_pickup' || rawStep === 5) {
    return 5;
  }
  if (bStatus === 'inventory_assigned' || rawStep === 4) {
    return 4;
  }
  if (['approved', 'approved_director'].includes(tStatus) || bStatus === 'approved_director' || rawStep === 3) {
    return 3;
  }
  if (rawStep >= 2 || ['pending', 'pending_director'].includes(tStatus)) {
    return 2;
  }
  return Math.max(rawStep || 1, 1);
}

/**
 * Dynamic description for each step of a borrowing ticket.
 */
export function getBorrowingStepDescription(ticket, step, index, formatDateFn = null) {
  if (!ticket) return step?.description || '';
  const b = ticket.borrowing || ticket.details || {};
  const format = typeof formatDateFn === 'function' ? formatDateFn : (d) => d;
  const stepNum = ticket.currentStep || getBorrowingCurrentStep(ticket);

  switch (index) {
    case 0: { // Digital Submission
      const itemName = b.item_name_requested || '';
      const qty = b.quantity_needed || 1;
      if (itemName) {
        return `Borrower submitted request for ${qty} unit(s) of "${itemName}".`;
      }
      return step?.description || 'The borrower completes and submits the digital borrowing form.';
    }
    case 1: { // Ticket Creation
      return 'System generated a Digital Ticket under Pending Director Approval.';
    }
    case 2: { // Director Approval
      if (stepNum >= 3 || ['approved', 'approved_director'].includes(String(ticket?.status || '').toLowerCase()) || ['approved_director', 'inventory_assigned', 'ready_for_pickup', 'picked_up', 'overdue', 'returned'].includes(b.status)) {
        return 'Approved by the Director. Queued for LEAU inventory assignment.';
      }
      return step?.description || 'Director reviews and approves the borrowing request.';
    }
    case 3: { // Inventory Allocation
      if (stepNum > 4 || ['inventory_assigned', 'ready_for_pickup', 'picked_up', 'overdue', 'returned'].includes(b.status)) {
        const assignedQty = b.assigned_quantity || b.quantity_needed || 1;
        const itemName = b.item_name_requested || 'requested item(s)';
        return `LEAU allocated ${assignedQty} unit(s) of "${itemName}". Ready for preparation.`;
      }
      return step?.description || 'LEAU checks and allocates requested inventory item(s).';
    }
    case 4: { // Ready for Pickup
      if (stepNum >= 5) {
        const pickupDate = b.date_needed ? format(b.date_needed) : null;
        if (pickupDate) {
          return `Item(s) prepared and ready for pickup at the LEAU office (Pickup Date: ${pickupDate}).`;
        }
        return 'Item(s) prepared and ready for pickup at the LEAU office.';
      }
      return step?.description || 'Item(s) prepped and ready for pickup at the LEAU office.';
    }
    case 5: { // Item Picked Up
      if (b.status === 'overdue') {
        const returnDate = b.expected_return_date ? format(b.expected_return_date) : '';
        return `Item is OVERDUE for return${returnDate ? ` (Due: ${returnDate})` : ''}. Please return to the LEAU office immediately.`;
      }
      if (stepNum >= 6) {
        const returnDate = b.expected_return_date ? format(b.expected_return_date) : null;
        if (returnDate) {
          return `Item(s) claimed by borrower. Expected return date: ${returnDate}.`;
        }
        return 'Item(s) claimed by borrower for the approved borrowing duration.';
      }
      return step?.description || 'Item(s) claimed by borrower for the approved borrowing duration.';
    }
    case 6: { // Returned & Completed
      const isClosed = ticket.isClosed || ['closed', 'completed'].includes(ticket.status) || b.status === 'returned';
      if (isClosed) {
        const cond = b.return_condition ? ` (Condition: ${String(b.return_condition).toUpperCase()})` : '';
        return `Item(s) successfully returned to LEAU and inspected${cond}. Request finalized and archived.`;
      }
      return step?.description || 'Item(s) returned to LEAU, inspected, and request finalized.';
    }
    default:
      return step?.description || '';
  }
}
