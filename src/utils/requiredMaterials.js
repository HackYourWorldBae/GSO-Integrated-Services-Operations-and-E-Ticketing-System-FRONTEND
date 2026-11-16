// ============================================================================
// Required Materials & Ocular Inspection Workflow Helpers
//
// Shared pure logic between admin queue actions (OcularMaterialsModal) and
// requestor checklists (RequestorMaterialsChecklist).
// ============================================================================

export const SHORT_STOCK_THRESHOLD = 5;

/**
 * Determine if a ticket's approval delay reason relates to ocular inspection/assessment.
 */
export function isOcularInspectionDelay(ticket) {
  if (!ticket) return false;
  const reason = String(ticket.approval_delay_reason || '').toLowerCase();
  return reason.includes('ocular') || reason.includes('inspection');
}

/**
 * Check if a text notation represents an ocular inspection result.
 */
export function isOcularNotation(text) {
  if (!text) return false;
  const lower = String(text).toLowerCase();
  return lower.includes('ocular inspection') || lower.includes('[ocular inspection') || lower.includes('ocular assessment');
}

/**
 * Check if ocular inspection requirement has been completed for a ticket.
 * An inspection is complete if an inspection result has been posted OR
 * required materials have been listed.
 */
export function hasOcularInspectionCompleted(ticket) {
  if (!ticket) return false;
  const notation = ticket.staff_notation || ticket.notation || '';
  if (isOcularNotation(notation)) return true;
  if (Array.isArray(ticket.required_materials) && ticket.required_materials.length > 0) return true;
  if (ticket.required_materials_status && ticket.required_materials_status !== 'none') return true;
  return false;
}

/**
 * Check if a ticket is allowed to proceed to approval (or Director escalation).
 * For borrowing tickets, ocular inspection is not part of the process, so it returns true.
 * For job requests, either inspection result or materials needed is required.
 */
export function canRequestApprovalOrDirectApprove(ticket) {
  if (!ticket) return false;
  if (ticket.is_borrowing) return true;
  const s = String(ticket.service || ticket.service_type || '').toLowerCase();
  if (s.includes('borrowing') || s.includes('borrow')) return true;
  return hasOcularInspectionCompleted(ticket);
}

/**
 * Determine whether a GSO catalog material item has empty or low stock.
 */
export function isCatalogMaterialShortOrEmpty(item, threshold = SHORT_STOCK_THRESHOLD) {
  const qty = Number(item?.quantity_available ?? 0);
  return qty <= threshold;
}

/**
 * Derive normalized inventory_status ('empty' | 'short') from GSO available stock count.
 */
export function deriveCatalogInventoryStatus(quantityAvailable) {
  return Number(quantityAvailable ?? 0) <= 0 ? 'empty' : 'short';
}

/**
 * Validate inspector's required materials list before submitting to backend.
 * Returns an empty string when valid, or an actionable error message otherwise.
 */
export function validateRequiredMaterialsList(materials) {
  if (!Array.isArray(materials) || materials.length === 0) {
    return 'Please add at least one needed material before saving.';
  }
  for (let i = 0; i < materials.length; i++) {
    const row = materials[i];
    if (!String(row?.material_name || '').trim()) {
      return `Material #${i + 1} is missing a name.`;
    }
    if (!(Number(row?.quantity) > 0)) {
      return `Quantity for "${row.material_name}" must be greater than 0.`;
    }
  }
  return '';
}

/**
 * Compute a deterministic server-state signature for polling preservation so
 * background refreshes do not clear unchecked/checked boxes mid-interaction.
 */
export function buildRequiredMaterialsSignature(ticket) {
  if (!ticket) return '';
  const list = Array.isArray(ticket.required_materials) ? ticket.required_materials : [];
  const ids = list.map((m) => m.id).join(',');
  const status = String(ticket.required_materials_status || 'awaiting_requestor').toLowerCase();
  return `${ticket.ticketId || ticket.id || ''}|${status}|${ticket.required_materials_requested_at || ''}|${ids}`;
}

/**
 * Verify every listed required material ID is included in the requestor's checked IDs.
 */
export function areAllMaterialsChecked(materials, checkedIds) {
  if (!Array.isArray(materials) || materials.length === 0) return false;
  const checkedSet = new Set((checkedIds || []).map((id) => Number(id)));
  return materials.every((m) => checkedSet.has(Number(m.id)));
}

/**
 * Format inventory status label for requestor/admin visibility.
 */
export function formatRequiredInventoryStatus(item) {
  const status = String(item?.inventory_status || 'empty').toLowerCase();
  if (status === 'empty') return 'Out of Stock in GSO';
  if (status === 'short') {
    const avail = item?.gso_available_qty;
    return avail !== null && avail !== undefined
      ? `Short in GSO (${avail} avail.)`
      : 'Short Stock in GSO';
  }
  if (status === 'not_in_catalog') return 'Not in GSO Inventory';
  return 'Unavailable in GSO';
}

