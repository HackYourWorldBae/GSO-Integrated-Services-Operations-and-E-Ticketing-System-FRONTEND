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
  listInventory,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  adjustInventoryQuantity,
  deleteInventoryItem,
  getInventoryCategories,
  getInventoryStats,
} from '../inventory'

// Level 3 — Component tests: LEAU inventory management (mirrors personnel
// management) must reach the backend with CRUD payloads intact.
describe('inventory api module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lists inventory with filter params intact', async () => {
    const params = { per_page: 500, category: 'tools' }
    apiClient.get.mockResolvedValueOnce({ data: { status: true } })
    await listInventory(params)
    expect(apiClient.get).toHaveBeenCalledWith('/inventory', { params })
    expect(apiClient.get.mock.calls[0][1].params).toBe(params)
  })

  it('fetches a single item by numeric id', async () => {
    apiClient.get.mockResolvedValueOnce({ data: { status: true } })
    await getInventoryItem(12)
    expect(apiClient.get).toHaveBeenCalledWith('/inventory/12')
  })

  it('creates items with the full payload intact', async () => {
    const payload = {
      name: 'Brush Cutter',
      model: 'STIHL FS 240',
      category: 'tools',
      quantity_total: 4,
      condition_status: 'good',
    }
    apiClient.post.mockResolvedValueOnce({ data: { status: true } })
    await createInventoryItem(payload)
    expect(apiClient.post).toHaveBeenCalledWith('/inventory', payload)
    expect(apiClient.post.mock.calls[0][1]).toBe(payload)
  })

  it('updates items by numeric id without payload loss', async () => {
    const patch = { condition_status: 'needs_repair', location: 'Repair bench' }
    apiClient.put.mockResolvedValueOnce({ data: { status: true } })
    await updateInventoryItem(12, patch)
    expect(apiClient.put).toHaveBeenCalledWith('/inventory/12', patch)
    expect(apiClient.put.mock.calls[0][1]).toBe(patch)
  })

  it('adjusts available quantity through the dedicated endpoint', async () => {
    apiClient.patch.mockResolvedValueOnce({ data: { status: true } })
    await adjustInventoryQuantity(12, 3)
    expect(apiClient.patch).toHaveBeenCalledWith('/inventory/12/adjust-quantity', {
      new_quantity: 3,
    })
  })

  it('deletes items by numeric id and reads categories/stats', async () => {
    apiClient.delete.mockResolvedValueOnce({ data: { status: true } })
    await deleteInventoryItem(12)
    expect(apiClient.delete).toHaveBeenCalledWith('/inventory/12')

    apiClient.get.mockResolvedValueOnce({ data: { status: true } })
    await getInventoryCategories()
    expect(apiClient.get).toHaveBeenCalledWith('/inventory/categories')

    apiClient.get.mockResolvedValueOnce({ data: { status: true } })
    await getInventoryStats()
    expect(apiClient.get).toHaveBeenCalledWith('/inventory/stats')
  })

  it('returns the backend envelope untouched (no unwrapping loss)', async () => {
    const envelope = { data: { status: true, message: 'ok', data: { items: [] } } }
    apiClient.get.mockResolvedValueOnce(envelope)
    await expect(listInventory()).resolves.toBe(envelope)
  })

  it('propagates backend errors to the caller', async () => {
    const failure = new Error('Request failed with status code 403')
    apiClient.post.mockRejectedValueOnce(failure)
    await expect(createInventoryItem({})).rejects.toBe(failure)
  })
});
