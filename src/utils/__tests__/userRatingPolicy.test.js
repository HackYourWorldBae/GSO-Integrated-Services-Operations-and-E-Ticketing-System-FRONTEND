import { describe, it, expect } from 'vitest';

/**
 * Mirror of the core rating policy rules used in User_Tickets, User_Dashboard,
 * and ServicesListView.
 */
function isBorrowingService(ticket) {
  const s = String(ticket?.service || ticket?.service_name || ticket?.service_type || '').toLowerCase();
  return s.includes('borrowing') || s.includes('borrow');
}

function isFeedbackEligible(ticket) {
  if (!ticket || ticket.isClosed || ticket.status === 'closed' || ticket.status === 'completed') return false;
  if (isBorrowingService(ticket)) return false;
  const unit = String(ticket.unit || ticket.unit_code || '').toUpperCase();
  const unitId = Number(ticket.unit_id);
  const isTargetUnit = unit === 'FGMU' || unit === 'LEAU' || unitId === 1 || unitId === 2;
  if (isTargetUnit) {
    const step = Number(ticket.currentStep ?? ticket.current_step);
    return step >= 6 || ticket.status === 'resolved';
  }
  return false;
}

function validateEvaluationForm(form) {
  if (!form || !form.completionStatus) return false;
  // Remarks are strictly mandatory under the updated policy
  if (!form.remarks || !form.remarks.trim()) return false;

  if (['early', 'on-time', 'beyond-time'].includes(form.completionStatus)) {
    const r = form.ratings || {};
    return Number(r.quality) > 0 && Number(r.efficiency) > 0 && Number(r.timeliness) > 0;
  }
  if (form.completionStatus === 'not-completed') {
    const nr = form.notCompletedReasons || {};
    return Boolean(nr.lackWorkingDays || nr.lackMaterials || nr.lackSkills);
  }
  return false;
}

function canRequestNewService(userActiveTickets) {
  const unratedCount = userActiveTickets.filter(t => isFeedbackEligible(t)).length;
  return unratedCount === 0;
}

describe('User Rating Policy & Evaluation Enforcement', () => {
  it('correctly identifies resolved FGMU/LEAU tickets requiring feedback', () => {
    const resolvedTicket = {
      ticketId: 'FGMU-TIC-1-2026',
      unit: 'FGMU',
      unit_id: 1,
      status: 'resolved',
      current_step: 6,
      service_type: 'Carpentry',
      isClosed: false,
    };
    expect(isFeedbackEligible(resolvedTicket)).toBe(true);
  });

  it('excludes borrowing tickets from service satisfaction ratings', () => {
    const borrowingTicket = {
      ticketId: 'LEAU-TIC-2-2026',
      unit: 'LEAU',
      unit_id: 2,
      status: 'resolved',
      current_step: 6,
      service_type: 'Borrowing of Plants',
      isClosed: false,
    };
    expect(isFeedbackEligible(borrowingTicket)).toBe(false);
  });

  it('excludes tickets that are already closed or completed', () => {
    const closedTicket = {
      ticketId: 'FGMU-TIC-3-2026',
      unit: 'FGMU',
      unit_id: 1,
      status: 'closed',
      current_step: 6,
      isClosed: true,
    };
    expect(isFeedbackEligible(closedTicket)).toBe(false);
  });

  it('blocks requestor from requesting a new service when previous job is unrated', () => {
    const tickets = [
      { ticketId: 'FGMU-1', unit: 'FGMU', unit_id: 1, status: 'resolved', current_step: 6, isClosed: false },
      { ticketId: 'FGMU-2', unit: 'FGMU', unit_id: 1, status: 'approved', current_step: 3, isClosed: false },
    ];
    expect(canRequestNewService(tickets)).toBe(false);
  });

  it('allows requestor to request a new service when all previous jobs are rated or non-resolved', () => {
    const tickets = [
      { ticketId: 'FGMU-1', unit: 'FGMU', unit_id: 1, status: 'closed', current_step: 6, isClosed: true },
      { ticketId: 'FGMU-2', unit: 'FGMU', unit_id: 1, status: 'processing', current_step: 4, isClosed: false },
    ];
    expect(canRequestNewService(tickets)).toBe(true);
  });

  it('rejects evaluation form when remarks are empty or whitespace only', () => {
    const formEmptyRemarks = {
      completionStatus: 'on-time',
      ratings: { quality: 5, efficiency: 5, timeliness: 5 },
      remarks: '',
    };
    const formWhitespaceRemarks = {
      completionStatus: 'on-time',
      ratings: { quality: 5, efficiency: 5, timeliness: 5 },
      remarks: '    ',
    };
    expect(validateEvaluationForm(formEmptyRemarks)).toBe(false);
    expect(validateEvaluationForm(formWhitespaceRemarks)).toBe(false);
  });

  it('accepts evaluation form when remarks and all ratings are provided', () => {
    const validForm = {
      completionStatus: 'on-time',
      ratings: { quality: 4, efficiency: 5, timeliness: 5 },
      remarks: 'Staff was very respectful and finished cleanly.',
    };
    expect(validateEvaluationForm(validForm)).toBe(true);
  });

  it('requires remarks even when completion status is not-completed', () => {
    const formNotCompletedNoRemarks = {
      completionStatus: 'not-completed',
      notCompletedReasons: { lackMaterials: true },
      remarks: '',
    };
    const formNotCompletedWithRemarks = {
      completionStatus: 'not-completed',
      notCompletedReasons: { lackMaterials: true },
      remarks: 'Materials were out of stock so the task could not proceed.',
    };
    expect(validateEvaluationForm(formNotCompletedNoRemarks)).toBe(false);
    expect(validateEvaluationForm(formNotCompletedWithRemarks)).toBe(true);
  });
});

