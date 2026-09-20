import apiClient from './client';

// ============================================================================
// Borrowing API Module (LEAU: Borrowing of Plants / Tools & Equipment)
//
// Wraps the borrowing workflow: director approval -> inventory assignment ->
// ready for pickup -> pickup -> return (auto-archive, no rating form).
// Consumed by: BorrowingDispatchWorkspace, BorrowingWorkspace
// ============================================================================

/** Fetch borrowing details (with attachments, history, inventory) by ticket id. */
export const getBorrowingByTicket = (ticketId) =>
  apiClient.get(`/borrowing/${ticketId}`);

/** Paginated borrowing queue for the LEAU admin dashboard. */
export const getBorrowingQueue = (params = {}) =>
  apiClient.get('/borrowing/queue/leau', { params });

/** Borrowing requests past their expected return date. */
export const getOverdueBorrowings = () =>
  apiClient.get('/borrowing/overdue');

/** Refresh overdue flags for picked-up requests past their return date. */
export const markOverdueBorrowings = () =>
  apiClient.post('/borrowing/mark-overdue', {});

/** Director approves a borrowing request. */
export const directorApproveBorrowing = (ticketId, notes = '') =>
  apiClient.patch(`/borrowing/${ticketId}/director-approve`, { notes });

/** Director rejects a borrowing request. */
export const directorRejectBorrowing = (ticketId, reason = '') =>
  apiClient.patch(`/borrowing/${ticketId}/director-reject`, { reason });

/** LEAU Admin assigns inventory to a director-approved request. */
export const assignInventoryToBorrowing = (ticketId, { inventory_id, assigned_quantity }) =>
  apiClient.post(`/borrowing/${ticketId}/assign-inventory`, { inventory_id, assigned_quantity });

/** LEAU Admin marks an assigned request as ready for pickup. */
export const markBorrowingReadyForPickup = (ticketId, notes = '') =>
  apiClient.patch(`/borrowing/${ticketId}/ready-for-pickup`, { notes });

/** LEAU Admin records item pickup by the borrower. */
export const recordBorrowingPickup = (ticketId, payload = {}) =>
  apiClient.patch(`/borrowing/${ticketId}/pickup`, payload);

/** LEAU Admin records item return (auto-archives, no rating form). */
export const recordBorrowingReturn = (ticketId, { return_condition, return_notes } = {}) =>
  apiClient.patch(`/borrowing/${ticketId}/return`, { return_condition, return_notes });

/** LEAU Admin cancels a borrowing request. */
export const cancelBorrowing = (ticketId, reason = '') =>
  apiClient.patch(`/borrowing/${ticketId}/cancel`, { reason });
