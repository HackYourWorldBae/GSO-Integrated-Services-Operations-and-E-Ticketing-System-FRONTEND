import { describe, it, expect } from 'vitest'

/**
 * Business Rule Verification Tests:
 * 1. Staff Leave Rule:
 *    - Solo assigned tickets: Timeline IS extended when assigned personnel goes on leave.
 *    - Team jobs: Timeline is NOT extended (other personnel can handle it), UNLESS
 *      most or all personnel assigned to the ticket are on leave (> 50%).
 *
 * 2. Emergency Ticket Dispatch Rule:
 *    - Solo assigned tickets: Timeline IS extended when worker is dispatched to an emergency ticket.
 *    - Team jobs: Timeline is NOT extended (other personnel can handle it), UNLESS
 *      all personnel assigned to that ticket are dispatched to emergency tasks.
 */

describe('Staff Leave & Emergency Preemption Rules Logic', () => {
  // Pure logic helper mirroring PersonnelController::updateStatus leave extend rule
  function evaluateLeaveExtension({ totalAssigned, onLeaveCount }) {
    if (totalAssigned <= 1) {
      return { shouldExtend: true, reasonType: 'solo' }
    }
    // Most or all assigned personnel are on leave (> 50%)
    const isMostOrAllOnLeave = onLeaveCount > totalAssigned / 2
    return {
      shouldExtend: isMostOrAllOnLeave,
      reasonType: isMostOrAllOnLeave ? 'team_shortage' : 'team_maintained',
    }
  }

  // Pure logic helper mirroring DispatchController::assign emergency preemption rule
  function evaluateEmergencyPreemptionExtension({ totalWorkersOnTicket, activeRemainingCount }) {
    if (totalWorkersOnTicket <= 1) {
      return { shouldExtend: true, reasonType: 'solo' }
    }
    // Only extend team ticket if ALL personnel are dispatched to emergency (no active workers left)
    const allDispatched = activeRemainingCount === 0
    return {
      shouldExtend: allDispatched,
      reasonType: allDispatched ? 'all_dispatched' : 'team_maintained',
    }
  }

  describe('Staff Leave Extension Rule', () => {
    it('always extends solo assigned jobs', () => {
      const result = evaluateLeaveExtension({ totalAssigned: 1, onLeaveCount: 1 })
      expect(result.shouldExtend).toBe(true)
      expect(result.reasonType).toBe('solo')
    })

    it('does NOT extend a 2-person team job when only 1 worker goes on leave', () => {
      // 1 on leave out of 2 = 50%, not "most or all" (the other worker can handle it)
      const result = evaluateLeaveExtension({ totalAssigned: 2, onLeaveCount: 1 })
      expect(result.shouldExtend).toBe(false)
      expect(result.reasonType).toBe('team_maintained')
    })

    it('extends a 2-person team job when BOTH workers are on leave (all)', () => {
      // 2 on leave out of 2 = 100% (all)
      const result = evaluateLeaveExtension({ totalAssigned: 2, onLeaveCount: 2 })
      expect(result.shouldExtend).toBe(true)
      expect(result.reasonType).toBe('team_shortage')
    })

    it('does NOT extend a 3-person team job when only 1 worker is on leave', () => {
      // 1 out of 3 = 33.3%, other 2 can handle it
      const result = evaluateLeaveExtension({ totalAssigned: 3, onLeaveCount: 1 })
      expect(result.shouldExtend).toBe(false)
      expect(result.reasonType).toBe('team_maintained')
    })

    it('extends a 3-person team job when 2 workers are on leave (most)', () => {
      // 2 out of 3 = 66.7% (strict majority / most)
      const result = evaluateLeaveExtension({ totalAssigned: 3, onLeaveCount: 2 })
      expect(result.shouldExtend).toBe(true)
      expect(result.reasonType).toBe('team_shortage')
    })

    it('extends a 3-person team job when all 3 workers are on leave (all)', () => {
      const result = evaluateLeaveExtension({ totalAssigned: 3, onLeaveCount: 3 })
      expect(result.shouldExtend).toBe(true)
      expect(result.reasonType).toBe('team_shortage')
    })

    it('handles 4-person team jobs correctly (only extends if 3 or 4 are on leave)', () => {
      expect(evaluateLeaveExtension({ totalAssigned: 4, onLeaveCount: 1 }).shouldExtend).toBe(false)
      expect(evaluateLeaveExtension({ totalAssigned: 4, onLeaveCount: 2 }).shouldExtend).toBe(false)
      expect(evaluateLeaveExtension({ totalAssigned: 4, onLeaveCount: 3 }).shouldExtend).toBe(true)
      expect(evaluateLeaveExtension({ totalAssigned: 4, onLeaveCount: 4 }).shouldExtend).toBe(true)
    })
  })

  describe('Emergency Preemption Extension Rule', () => {
    it('always extends solo job tickets when the assigned worker is pulled to emergency', () => {
      const result = evaluateEmergencyPreemptionExtension({
        totalWorkersOnTicket: 1,
        activeRemainingCount: 0,
      })
      expect(result.shouldExtend).toBe(true)
      expect(result.reasonType).toBe('solo')
    })

    it('does NOT extend a team ticket if at least one other personnel remains active', () => {
      const result = evaluateEmergencyPreemptionExtension({
        totalWorkersOnTicket: 2,
        activeRemainingCount: 1, // 1 other worker still on the job
      })
      expect(result.shouldExtend).toBe(false)
      expect(result.reasonType).toBe('team_maintained')
    })

    it('extends a team ticket if ALL personnels are dispatched to emergency', () => {
      const result = evaluateEmergencyPreemptionExtension({
        totalWorkersOnTicket: 3,
        activeRemainingCount: 0, // all 3 pulled to emergency
      })
      expect(result.shouldExtend).toBe(true)
      expect(result.reasonType).toBe('all_dispatched')
    })
  })
})
