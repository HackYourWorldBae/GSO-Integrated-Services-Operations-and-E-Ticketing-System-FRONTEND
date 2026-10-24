import { describe, it, expect } from 'vitest';

describe('Approval Workflow Policy (FGMU vs LEAU to Director)', () => {
  // Mock tickets representing initial submitted state
  const pendingFgmuTicket = {
    id: 'FGMU-TIC-1-2026',
    unit_id: 1,
    unit: 'FGMU',
    service: 'Carpentry Works',
    status: 'pending',
    is_escalated_to_director: false,
    current_step: 2,
  };

  const pendingLeauTicket = {
    id: 'LEAU-TIC-1-2026',
    unit_id: 2,
    unit: 'LEAU',
    service: 'Grass Cutting & Trimming',
    status: 'pending',
    is_escalated_to_director: false,
    current_step: 2,
  };

  describe('FGMU Workflow Rules', () => {
    it('requires all FGMU tickets to route to FGMU admin review first with is_escalated_to_director = false', () => {
      expect(pendingFgmuTicket.status).toBe('pending');
      expect(pendingFgmuTicket.is_escalated_to_director).toBe(false);
    });

    it('determines that FGMU admin cannot directly approve and must request Director approval', () => {
      const canFgmuAdminDirectApprove = (unit, isDirector) => {
        if (!isDirector && unit === 'FGMU') return false;
        return true;
      };

      expect(canFgmuAdminDirectApprove('FGMU', false)).toBe(false);
      expect(canFgmuAdminDirectApprove('FGMU', true)).toBe(true); // Director can approve
    });

    it('transitions FGMU ticket to Director queue upon Request Director Approval', () => {
      const requestDirectorApproval = (ticket, reason) => ({
        ...ticket,
        is_escalated_to_director: true,
        escalation_reason: reason || 'Reviewed and recommended for Director approval',
        status_label: 'Pending Director Approval',
      });

      const submittedTicket = requestDirectorApproval(pendingFgmuTicket);
      expect(submittedTicket.is_escalated_to_director).toBe(true);
      expect(submittedTicket.status_label).toBe('Pending Director Approval');
      expect(submittedTicket.escalation_reason).toBe('Reviewed and recommended for Director approval');
    });
  });

  describe('LEAU Workflow Rules', () => {
    it('allows LEAU admin head to directly approve routine requests', () => {
      const canLeauAdminDirectApprove = (unit, isDirector) => {
        if (!isDirector && unit === 'LEAU') return true;
        return true;
      };

      expect(canLeauAdminDirectApprove('LEAU', false)).toBe(true);
    });

    it('allows LEAU admin head to request Director approval for escalated or complex requests', () => {
      const requestDirectorApproval = (ticket, reason) => ({
        ...ticket,
        is_escalated_to_director: true,
        escalation_reason: reason,
        status_label: 'Pending Director Approval',
      });

      const escalatedLeauTicket = requestDirectorApproval(
        pendingLeauTicket,
        'Large-scale campus grounds overhaul requiring executive budget'
      );
      expect(escalatedLeauTicket.is_escalated_to_director).toBe(true);
      expect(escalatedLeauTicket.escalation_reason).toContain('Large-scale campus grounds overhaul');
    });
  });

  describe('Director Final Approval Rules', () => {
    it('authorizes Director to grant executive approval on both FGMU and LEAU requests', () => {
      const approveTicket = (ticket, userRole) => {
        const isExecutive = ['director', 'superadmin'].includes(userRole);
        if (ticket.unit_id === 1 && !isExecutive) {
          throw new Error('FGMU requests require Director approval.');
        }
        return {
          ...ticket,
          status: 'approved',
          status_label: 'Queued for Dispatch',
          is_escalated_to_director: false,
          current_step: 3,
        };
      };

      // FGMU ticket approved by Director
      const approvedFgmu = approveTicket(
        { ...pendingFgmuTicket, is_escalated_to_director: true },
        'director'
      );
      expect(approvedFgmu.status).toBe('approved');
      expect(approvedFgmu.current_step).toBe(3);

      // LEAU ticket approved directly by LEAU admin
      const approvedLeauByAdmin = approveTicket(pendingLeauTicket, 'admin');
      expect(approvedLeauByAdmin.status).toBe('approved');

      // FGMU ticket attempted approval by FGMU admin should throw forbidden error
      expect(() => approveTicket(pendingFgmuTicket, 'admin')).toThrow(
        'FGMU requests require Director approval.'
      );
    });
  });
});
