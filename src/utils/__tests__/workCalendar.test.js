import { describe, it, expect } from 'vitest';
import { calculateWorkingHoursElapsed, parseDateLocal } from '../workCalendar';

describe('Institutional workCalendar utility', () => {
  it('parses date-only string to 8:00 AM local work start hour', () => {
    const d = parseDateLocal('2026-09-17');
    expect(d).not.toBeNull();
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(8); // 0-indexed September
    expect(d.getDate()).toBe(17);
    expect(d.getHours()).toBe(8);
    expect(d.getMinutes()).toBe(0);
  });

  it('parses SQL datetime string with exact local time components', () => {
    const d = parseDateLocal('2026-09-17 07:15:30');
    expect(d).not.toBeNull();
    expect(d.getHours()).toBe(7);
    expect(d.getMinutes()).toBe(15);
    expect(d.getSeconds()).toBe(30);
  });

  it('correctly counts duration from early start timestamp (7:00 AM) without skipping to 8:00 AM', () => {
    // Started at 7:00 AM, current time is 7:45 AM on a weekday (Thursday 2026-09-17)
    const start = '2026-09-17 07:00:00';
    const end = '2026-09-17 07:45:00';
    const result = calculateWorkingHoursElapsed(start, end);

    expect(result.totalHours).toBe(0.8);
    expect(result.formatted).toBe('45 mins');
  });

  it('correctly computes elapsed hours across early start and standard morning hours', () => {
    // Started at 7:00 AM, current time 9:00 AM (2 full hours: 7-8 early + 8-9 standard)
    const start = '2026-09-17 07:00:00';
    const end = '2026-09-17 09:00:00';
    const result = calculateWorkingHoursElapsed(start, end);

    expect(result.totalHours).toBe(2);
    expect(result.formatted).toBe('2 hrs');
  });

  it('anchors automatic implementation date tickets to 8:00 AM as expected', () => {
    // Ticket scheduled for 2026-09-17, current time is 9:00 AM
    // Date-only string defaults to 8:00 AM start, so elapsed is 1 hour
    const start = '2026-09-17';
    const end = '2026-09-17 09:00:00';
    const result = calculateWorkingHoursElapsed(start, end);

    expect(result.totalHours).toBe(1);
    expect(result.formatted).toBe('1 hr');
  });

  it('deducts 1-hour lunch break (12:00 PM - 1:00 PM) accurately', () => {
    // Started at 7:00 AM, ended at 2:00 PM (7 hours elapsed, minus 1h lunch = 6h)
    const start = '2026-09-17 07:00:00';
    const end = '2026-09-17 14:00:00';
    const result = calculateWorkingHoursElapsed(start, end);

    expect(result.totalHours).toBe(6);
    expect(result.formatted).toBe('6 hrs');
  });
});
