import { describe, it, expect } from 'vitest';
import {
  SCHEDULE_DATE_FILTER,
  getTicketImplementationDateRaw,
  normalizeLocalCalendarDate,
  getWeekBounds,
  getMonthBounds,
  getSchedulePeriodLabels,
  matchesScheduleDateFilter,
  countTicketsByScheduleDate,
  filterTicketsByScheduleDate,
} from '../scheduleDateFilter';

describe('scheduleDateFilter utility', () => {
  // Reference date: Tuesday, November 10, 2026 (week is Mon Nov 9 – Sun Nov 15, month is Nov 1 – Nov 30)
  const refTue = new Date(2026, 10, 10, 20, 30, 0);

  describe('getTicketImplementationDateRaw', () => {
    it('extracts implementation_date across assignment, top-level, and collab array shapes', () => {
      expect(
        getTicketImplementationDateRaw({
          assignment: { implementation_date: '2026-11-12' },
          implementation_date: '2026-11-14',
        })
      ).toBe('2026-11-12');

      expect(
        getTicketImplementationDateRaw({
          implementation_date: '2026-11-18 08:00:00',
        })
      ).toBe('2026-11-18 08:00:00');

      expect(
        getTicketImplementationDateRaw({
          implementationDate: '2026-11-20',
        })
      ).toBe('2026-11-20');

      expect(
        getTicketImplementationDateRaw({
          project_target_date: '2026-11-25',
        })
      ).toBe('2026-11-25');

      expect(
        getTicketImplementationDateRaw({
          assignments: [{ implementation_date: '2026-11-13' }],
        })
      ).toBe('2026-11-13');
    });

    it('returns null for missing or placeholder dates', () => {
      expect(getTicketImplementationDateRaw(null)).toBeNull();
      expect(getTicketImplementationDateRaw({})).toBeNull();
      expect(getTicketImplementationDateRaw({ implementation_date: '' })).toBeNull();
      expect(getTicketImplementationDateRaw({ implementation_date: 'N/A' })).toBeNull();
      expect(getTicketImplementationDateRaw({ implementation_date: '0000-00-00' })).toBeNull();
    });
  });

  describe('normalizeLocalCalendarDate', () => {
    it('parses YYYY-MM-DD and SQL datetime strings into local calendar midnight', () => {
      const d1 = normalizeLocalCalendarDate('2026-11-10');
      expect(d1).toEqual(new Date(2026, 10, 10, 0, 0, 0, 0));

      const d2 = normalizeLocalCalendarDate('2026-11-15 23:45:00');
      expect(d2).toEqual(new Date(2026, 10, 15, 0, 0, 0, 0));
    });

    it('rejects invalid calendar dates without rolling into adjacent months', () => {
      expect(normalizeLocalCalendarDate('2026-02-31')).toBeNull();
      expect(normalizeLocalCalendarDate('2026-13-01')).toBeNull();
      expect(normalizeLocalCalendarDate('0000-00-00')).toBeNull();
      expect(normalizeLocalCalendarDate('not-a-date')).toBeNull();
    });

    it('converts timezone-aware ISO timestamps into the corresponding local calendar date', () => {
      const isoSample = '2026-11-10T22:00:00.000Z';
      const expectedLocal = new Date(isoSample);
      expect(normalizeLocalCalendarDate(isoSample)).toEqual(
        new Date(expectedLocal.getFullYear(), expectedLocal.getMonth(), expectedLocal.getDate())
      );
    });
  });

  describe('getWeekBounds & getMonthBounds', () => {
    it('computes Monday–Sunday bounds cleanly regardless of day within the week', () => {
      const monRef = new Date(2026, 10, 9);
      const tueRef = new Date(2026, 10, 10);
      const sunRef = new Date(2026, 10, 15);

      for (const ref of [monRef, tueRef, sunRef]) {
        const { start, end } = getWeekBounds(ref);
        expect(start).toEqual(new Date(2026, 10, 9));
        expect(end).toEqual(new Date(2026, 10, 15));
      }
    });

    it('handles month and year boundary weeks accurately', () => {
      const yearEndRef = new Date(2026, 11, 30); // Wednesday Dec 30, 2026
      const { start, end } = getWeekBounds(yearEndRef);
      expect(start).toEqual(new Date(2026, 11, 28)); // Monday Dec 28, 2026
      expect(end).toEqual(new Date(2027, 0, 3)); // Sunday Jan 3, 2027

      const labels = getSchedulePeriodLabels(yearEndRef);
      expect(labels.weekRangeLabel).toBe('Dec 28, 2026 – Jan 3, 2027');
      expect(labels.monthLabel).toBe('December 2026');
    });

    it('computes calendar month bounds accurately (including leap year February)', () => {
      const feb2024 = getMonthBounds(new Date(2024, 1, 15));
      expect(feb2024.start).toEqual(new Date(2024, 1, 1));
      expect(feb2024.end).toEqual(new Date(2024, 1, 29));
    });
  });

  describe('filtering and counting scheduled tickets', () => {
    const sampleTickets = [
      { id: 1, assignment: { implementation_date: '2026-11-08' } }, // Sunday prior week, same month
      { id: 2, assignment: { implementation_date: '2026-11-09' } }, // Monday start of current week & month
      { id: 3, implementation_date: '2026-11-12 09:30:00' },        // Thursday current week & month
      { id: 4, assignments: [{ implementation_date: '2026-11-15' }] }, // Sunday end of current week & month
      { id: 5, implementation_date: '2026-11-24' },                 // Later in November (not this week)
      { id: 6, implementation_date: '2026-12-03' },                 // Next month
      { id: 7, implementation_date: null },                         // Unscheduled
    ];

    it('counts total, thisWeek, and thisMonth tickets accurately in one pass', () => {
      const counts = countTicketsByScheduleDate(sampleTickets, refTue);
      expect(counts).toEqual({
        all: 7,
        thisWeek: 3,  // #2 (Nov 9), #3 (Nov 12), #4 (Nov 15)
        thisMonth: 5, // #1, #2, #3, #4, #5
      });
    });

    it('filters tickets matching All, This Week, and This Month', () => {
      expect(filterTicketsByScheduleDate(sampleTickets, SCHEDULE_DATE_FILTER.ALL, refTue).map(t => t.id))
        .toEqual([1, 2, 3, 4, 5, 6, 7]);

      expect(filterTicketsByScheduleDate(sampleTickets, SCHEDULE_DATE_FILTER.THIS_WEEK, refTue).map(t => t.id))
        .toEqual([2, 3, 4]);

      expect(filterTicketsByScheduleDate(sampleTickets, SCHEDULE_DATE_FILTER.THIS_MONTH, refTue).map(t => t.id))
        .toEqual([1, 2, 3, 4, 5]);
    });

    it('includes a next-month day in This Week when current Mon–Sun week spans two months', () => {
      const nov30 = new Date(2026, 10, 30); // Monday Nov 30, 2026 -> week is Nov 30 – Dec 6
      const crossMonthTicket = { id: 99, implementation_date: '2026-12-04' };

      expect(matchesScheduleDateFilter(crossMonthTicket, SCHEDULE_DATE_FILTER.THIS_WEEK, nov30)).toBe(true);
      expect(matchesScheduleDateFilter(crossMonthTicket, SCHEDULE_DATE_FILTER.THIS_MONTH, nov30)).toBe(false);
    });
  });
});
