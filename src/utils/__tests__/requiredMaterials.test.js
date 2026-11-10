import { describe, it, expect } from 'vitest';
import {
  SHORT_STOCK_THRESHOLD,
  isOcularInspectionDelay,
  isCatalogMaterialShortOrEmpty,
  deriveCatalogInventoryStatus,
  validateRequiredMaterialsList,
  buildRequiredMaterialsSignature,
  areAllMaterialsChecked,
  formatRequiredInventoryStatus,
} from '@/utils/requiredMaterials';

describe('requiredMaterials ocular assessment & requestor confirmation helpers', () => {
  it('identifies ocular/inspection delay reasons accurately regardless of case', () => {
    expect(isOcularInspectionDelay(null)).toBe(false);
    expect(isOcularInspectionDelay({ approval_delay_reason: 'Awaiting Procurement' })).toBe(false);
    expect(isOcularInspectionDelay({ approval_delay_reason: 'Pending Ocular Assessment' })).toBe(true);
    expect(isOcularInspectionDelay({ approval_delay_reason: 'Needs Site Inspection First' })).toBe(true);
  });

  it('flags empty and low-stock GSO consumables consistently', () => {
    expect(isCatalogMaterialShortOrEmpty({ quantity_available: 0 })).toBe(true);
    expect(isCatalogMaterialShortOrEmpty({ quantity_available: SHORT_STOCK_THRESHOLD })).toBe(true);
    expect(isCatalogMaterialShortOrEmpty({ quantity_available: SHORT_STOCK_THRESHOLD + 1 })).toBe(false);
    expect(deriveCatalogInventoryStatus(0)).toBe('empty');
    expect(deriveCatalogInventoryStatus(3)).toBe('short');
  });

  it('validates inspector materials payload before submission', () => {
    expect(validateRequiredMaterialsList([])).toContain('at least one');
    expect(validateRequiredMaterialsList([{ material_name: '   ', quantity: 2 }])).toContain('missing a name');
    expect(validateRequiredMaterialsList([{ material_name: 'LED Bulb', quantity: 0 }])).toContain('greater than 0');
    expect(validateRequiredMaterialsList([{ material_name: 'LED Bulb', quantity: 4 }])).toBe('');
  });

  it('enforces all materials checked before requestor can resume approval', () => {
    const materials = [
      { id: 10, material_name: 'PVC Pipe 1/2' },
      { id: 11, material_name: 'Solvent Cement' },
    ];
    expect(areAllMaterialsChecked(materials, [])).toBe(false);
    expect(areAllMaterialsChecked(materials, [10])).toBe(false);
    expect(areAllMaterialsChecked(materials, [10, 11])).toBe(true);
  });

  it('preserves polling signature across identical refreshes and changes on new updates', () => {
    const base = {
      ticketId: 'FGMU-TIC-12-2026',
      required_materials_status: 'awaiting_requestor',
      required_materials_requested_at: '2026-11-10 10:00:00',
      required_materials: [{ id: 1 }, { id: 2 }],
    };
    const samePoll = { ...base, required_materials: [{ id: 1 }, { id: 2 }] };
    const updatedList = {
      ...base,
      required_materials_requested_at: '2026-11-10 10:05:00',
      required_materials: [{ id: 1 }, { id: 2 }, { id: 3 }],
    };
    expect(buildRequiredMaterialsSignature(base)).toBe(buildRequiredMaterialsSignature(samePoll));
    expect(buildRequiredMaterialsSignature(base)).not.toBe(buildRequiredMaterialsSignature(updatedList));
  });

  it('formats stock shortage status badges clearly for requestors', () => {
    expect(formatRequiredInventoryStatus({ inventory_status: 'empty' })).toBe('Out of Stock in GSO');
    expect(formatRequiredInventoryStatus({ inventory_status: 'short', gso_available_qty: 2 })).toBe('Short in GSO (2 avail.)');
    expect(formatRequiredInventoryStatus({ inventory_status: 'not_in_catalog' })).toBe('Not in GSO Inventory');
  });
});

