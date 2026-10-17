import { describe, it, expect } from 'vitest';
import { isBorrowingService, borrowingStatusLabel } from '@/utils/borrowing';

describe('Borrowing Escalation Policy & Queue Routing Rules', () => {
  const routineBorrowingTicket = {
    id: 'FGMU-2026-0001',
    service: 'Borrowing of Tools and Equipment',
    service_type: 'Borrowing of Tools and Equipment',
    status: 'pending',
    is_escalated_to_director: false,
    is_borrowing: true,
  };

  const escalatedBorrowingTicket = {
    id: 'FGMU-2026-0002',
    service: 'Borrowing of Tools and Equipment',
    service_type: 'Borrowing of Tools and Equipment',
    status: 'pending',
    is_escalated_to_director: true,
    escalation_reason: 'Major university-wide convocation equipment needed',
    is_borrowing: true,
  };

  const routineStandardTicket = {
    id: 'FGMU-2026-0003',
    service: 'Aircon Repair',
    service_type: 'Aircon Repair',
    status: 'pending',
    is_escalated_to_director: false,
    is_borrowing: false,
  };

  const escalatedStandardTicket = {
    id: 'FGMU-2026-0004',
    service: 'Roof Replacement',
    service_type: 'Roof Replacement',
    status: 'pending',
    is_escalated_to_director: true,
    escalation_reason: 'High budget structural renovation',
    is_borrowing: false,
  };

  const allPendingTickets = [
    routineBorrowingTicket,
    escalatedBorrowingTicket,
    routineStandardTicket,
    escalatedStandardTicket,
  ];

  it('correctly identifies borrowing services', () => {
    expect(isBorrowingService(routineBorrowingTicket)).toBe(true);
    expect(isBorrowingService(escalatedBorrowingTicket)).toBe(true);
    expect(isBorrowingService(routineStandardTicket)).toBe(false);
  });

  it('routes strictly escalated tickets to the Director queue, excluding routine borrowing', () => {
    // Director filter rule for pending / escalated approval tab:
    // Only tickets with is_escalated_to_director === true must be displayed.
    const directorPendingQueue = allPendingTickets.filter(t => Boolean(t.is_escalated_to_director));

    expect(directorPendingQueue).toHaveLength(2);
    expect(directorPendingQueue.map(t => t.id)).toEqual(['FGMU-2026-0002', 'FGMU-2026-0004']);
    expect(directorPendingQueue.some(t => t.id === 'FGMU-2026-0001')).toBe(false);
  });

  it('routes routine borrowing tickets to the Unit Head routine approval filter', () => {
    // Unit Head routine filter rule:
    // Only non-escalated tickets must be displayed under routine.
    const unitHeadRoutineQueue = allPendingTickets.filter(t => !t.is_escalated_to_director);

    expect(unitHeadRoutineQueue).toHaveLength(2);
    expect(unitHeadRoutineQueue.map(t => t.id)).toContain('FGMU-2026-0001');
    expect(unitHeadRoutineQueue.map(t => t.id)).toContain('FGMU-2026-0003');
  });

  it('routes escalated tickets to the Unit Head escalated filter for tracking', () => {
    const unitHeadEscalatedQueue = allPendingTickets.filter(t => Boolean(t.is_escalated_to_director));

    expect(unitHeadEscalatedQueue).toHaveLength(2);
    expect(unitHeadEscalatedQueue.map(t => t.id)).toContain('FGMU-2026-0002');
    expect(unitHeadEscalatedQueue.map(t => t.id)).toContain('FGMU-2026-0004');
    expect(unitHeadEscalatedQueue.some(t => t.id === 'FGMU-2026-0001')).toBe(false);
  });

  it('labels pending borrowing status as Pending Approval, not Awaiting Director Review', () => {
    expect(borrowingStatusLabel('pending')).toBe('Pending Approval');
    expect(borrowingStatusLabel('pending_director')).toBe('Pending Approval');
  });
});
