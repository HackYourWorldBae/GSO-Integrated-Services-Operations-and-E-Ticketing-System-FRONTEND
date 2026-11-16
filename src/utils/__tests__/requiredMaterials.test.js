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
  isOcularNotation,
  hasOcularInspectionCompleted,
  isTicketUnderInspection,
  isNewJobRequest,
  canRequestApprovalOrDirectApprove,
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

  it('detects ocular inspection notation strings accurately', () => {
    expect(isOcularNotation(null)).toBe(false);
    expect(isOcularNotation('')).toBe(false);
    expect(isOcularNotation('Routine maintenance update')).toBe(false);
    expect(isOcularNotation('[OCULAR INSPECTION RESULT - Nov 16, 2026]')).toBe(true);
    expect(isOcularNotation('Site ocular inspection complete. Findings: Feasible.')).toBe(true);
  });

  it('evaluates whether ocular inspection requirement is satisfied for a ticket', () => {
    // Ticket with neither notation nor materials
    expect(hasOcularInspectionCompleted(null)).toBe(false);
    expect(hasOcularInspectionCompleted({ staff_notation: null, required_materials: [] })).toBe(false);

    // Ticket with ocular inspection result notation
    expect(hasOcularInspectionCompleted({
      staff_notation: '[OCULAR INSPECTION RESULT - Nov 16, 2026]\nOutcome: Ready for Approval',
    })).toBe(true);

    // Ticket with required materials listed
    expect(hasOcularInspectionCompleted({
      required_materials: [{ id: 1, material_name: 'Bulb' }],
    })).toBe(true);

    // Ticket with required_materials_status set
    expect(hasOcularInspectionCompleted({
      required_materials_status: 'awaiting_requestor',
    })).toBe(true);
  });

  it('enforces inspection requirement before approval or escalation on job requests but exempts borrowing', () => {
    const jobTicketWithoutInspection = {
      service: 'Carpentry Works',
      is_borrowing: false,
      required_materials: [],
      staff_notation: '',
    };
    expect(canRequestApprovalOrDirectApprove(jobTicketWithoutInspection)).toBe(false);

    const jobTicketWithInspection = {
      service: 'Carpentry Works',
      is_borrowing: false,
      staff_notation: '[OCULAR INSPECTION RESULT] Scope verified.',
    };
    expect(canRequestApprovalOrDirectApprove(jobTicketWithInspection)).toBe(true);

    const borrowingTicket = {
      service: 'Borrowing of tools/ equipment',
      is_borrowing: true,
      required_materials: [],
      staff_notation: '',
    };
    expect(canRequestApprovalOrDirectApprove(borrowingTicket)).toBe(true);
  });

  it('determines whether a ticket is under inspection accurately', () => {
    expect(isTicketUnderInspection(null)).toBe(false);

    // If ocular inspection is already completed, it is not "under inspection"
    expect(isTicketUnderInspection({
      staff_notation: '[OCULAR INSPECTION RESULT - Nov 16, 2026] Done',
      is_under_inspection: 1,
    })).toBe(false);

    // Via is_under_inspection flag
    expect(isTicketUnderInspection({
      is_under_inspection: 1,
    })).toBe(true);

    expect(isTicketUnderInspection({
      is_under_inspection: true,
    })).toBe(true);

    // Via status_label
    expect(isTicketUnderInspection({
      status_label: 'Under Inspection',
    })).toBe(true);

    // Via staff_notation marker
    expect(isTicketUnderInspection({
      staff_notation: '[INSPECTION_SCHEDULED: 2026-11-20] Inspector: John Doe',
    })).toBe(true);

    // Brand new ticket without inspection set
    expect(isTicketUnderInspection({
      status: 'pending',
      status_label: 'Pending Approval',
    })).toBe(false);
  });

  it('identifies new job requests distinct from under inspection and completed requests', () => {
    expect(isNewJobRequest(null)).toBe(false);

    // Borrowing requests are never job requests
    expect(isNewJobRequest({
      is_borrowing: true,
      status: 'pending',
    })).toBe(false);

    // Brand new job request
    expect(isNewJobRequest({
      service: 'Carpentry Works',
      is_borrowing: false,
      status: 'pending',
      status_label: 'Pending Approval',
    })).toBe(true);

    // Ticket that has been set for inspection
    expect(isNewJobRequest({
      service: 'Carpentry Works',
      is_borrowing: false,
      is_under_inspection: 1,
    })).toBe(false);

    // Ticket that has completed inspection
    expect(isNewJobRequest({
      service: 'Carpentry Works',
      is_borrowing: false,
      staff_notation: '[OCULAR INSPECTION RESULT] Checked',
    })).toBe(false);
  });
});

