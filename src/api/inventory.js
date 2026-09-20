import apiClient from './client';

// ============================================================================
// Inventory API Module (LEAU Inventory Management)
//
// Wraps CRUD + availability tracking for pre-defined office inventory.
// Mirrors the personnel API module conventions.
// Consumed by: LEAU_InventoryManagement, BorrowingDispatchWorkspace
// ============================================================================

/** Paginated, filterable inventory list. */
export const listInventory = (params = {}) =>
  apiClient.get('/inventory', { params });

/** Single inventory item. */
export const getInventoryItem = (id) =>
  apiClient.get(`/inventory/${id}`);

/** Create a new inventory item. */
export const createInventoryItem = (data) =>
  apiClient.post('/inventory', data);

/** Update an inventory item. */
export const updateInventoryItem = (id, data) =>
  apiClient.put(`/inventory/${id}`, data);

/** Adjust the available quantity of an inventory item. */
export const adjustInventoryQuantity = (id, newQuantity) =>
  apiClient.patch(`/inventory/${id}/adjust-quantity`, { new_quantity: newQuantity });

/** Delete (or deactivate when actively borrowed) an inventory item. */
export const deleteInventoryItem = (id) =>
  apiClient.delete(`/inventory/${id}`);

/** Category options for the filter dropdown. */
export const getInventoryCategories = () =>
  apiClient.get('/inventory/categories');

/** Inventory counts for dashboard badges. */
export const getInventoryStats = () =>
  apiClient.get('/inventory/stats');
