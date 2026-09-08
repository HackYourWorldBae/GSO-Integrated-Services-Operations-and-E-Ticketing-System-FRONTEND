/**
 * workCalendar.js
 *
 * Institutional Work Calendar utility for GSO E-Ticketing.
 * Implements standard Philippine / University work schedules:
 * - 8 working hours/day (8:00 AM to 5:00 PM, excluding 12:00 PM - 1:00 PM lunch).
 * - Excludes weekends (Saturday & Sunday).
 * - Excludes official Philippine regular and special non-working holidays.
 * - Accounts for approved overtime hours.
 */

export const WORK_START_HOUR = 8;
export const WORK_END_HOUR = 17;
export const LUNCH_START_HOUR = 12;
export const LUNCH_END_HOUR = 13;
export const STANDARD_DAILY_HOURS = 8.0;

// Standard Philippine Fixed Holidays (MM-DD)
export const FIXED_PHILIPPINE_HOLIDAYS = {
  '01-01': "New Year's Day",
  '02-25': 'EDSA People Power Anniversary',
  '04-09': 'Araw ng Kagitingan (Day of Valor)',
  '05-01': 'Labor Day',
  '06-12': 'Independence Day',
  '08-21': 'Ninoy Aquino Day',
  '11-01': "All Saints' Day",
  '11-02': "All Souls' Day",
  '11-30': 'Bonifacio Day',
  '12-08': 'Feast of the Immaculate Conception',
  '12-24': 'Christmas Eve',
  '12-25': 'Christmas Day',
  '12-30': 'Rizal Day',
  '12-31': "New Year's Eve",
};

/**
 * Calculates Easter Sunday for a given year (Anonymous Gregorian algorithm)
 */
function getEasterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-indexed
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}

/**
 * Check if a date falls on a weekend (Saturday or Sunday)
 */
export function isWeekend(date) {
  const d = new Date(date);
  const day = d.getDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
}

/**
 * Check if a date is an official Philippine holiday
 */
export function isHoliday(date) {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const monthDay = `${month}-${day}`;

  if (FIXED_PHILIPPINE_HOLIDAYS[monthDay]) {
    return true;
  }

  const year = d.getFullYear();

  // Movable: National Heroes Day (Last Monday of August)
  const lastDayAug = new Date(year, 7, 31);
  const lastMondayAugDate = 31 - ((lastDayAug.getDay() + 6) % 7);
  if (d.getMonth() === 7 && d.getDate() === lastMondayAugDate) {
    return true;
  }

  // Movable: Holy Week (Maundy Thursday, Good Friday, Black Saturday)
  const easter = getEasterSunday(year);
  const maundyThu = new Date(easter);
  maundyThu.setDate(easter.getDate() - 3);
  const goodFri = new Date(easter);
  goodFri.setDate(easter.getDate() - 2);
  const blackSat = new Date(easter);
  blackSat.setDate(easter.getDate() - 1);

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  return isSameDay(d, maundyThu) || isSameDay(d, goodFri) || isSameDay(d, blackSat);
}

/**
 * Check if a date is a standard working day
 */
export function isWorkingDay(date) {
  return !isWeekend(date) && !isHoliday(date);
}

/**
 * Add a number of working days to a starting date, skipping weekends and holidays
 */
export function addWorkingDays(startDate, workingDaysToAdd) {
  const current = new Date(startDate);
  if (isNaN(current.getTime())) return new Date();

  let daysAdded = 0;
  const target = Math.max(1, Number(workingDaysToAdd) || 1);

  while (daysAdded < target) {
    current.setDate(current.getDate() + 1);
    if (isWorkingDay(current)) {
      daysAdded++;
    }
  }

  return current;
}

/**
 * Formats a Date object to YYYY-MM-DD
 */
/**
 * Safely parses date inputs without UTC midnight shift.
 * Date-only strings (YYYY-MM-DD) default to WORK_START_HOUR (8:00 AM) in local time.
 * SQL datetime strings (YYYY-MM-DD HH:mm:ss) parse using local time components.
 */
export function parseDateLocal(input) {
  if (!input) return null;
  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : new Date(input.getTime());
  }

  const str = String(input).trim();
  if (!str) return null;

  // Check if date-only format: YYYY-MM-DD
  const dateOnlyMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnlyMatch) {
    const [, y, m, d] = dateOnlyMatch;
    return new Date(Number(y), Number(m) - 1, Number(d), WORK_START_HOUR, 0, 0);
  }

  // Check if standard SQL datetime: YYYY-MM-DD HH:mm:ss or ISO format
  const sqlMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (sqlMatch) {
    const [, y, m, d, h, min, s] = sqlMatch;
    return new Date(Number(y), Number(m) - 1, Number(d), Number(h), Number(min), Number(s || 0));
  }

  // Fallback to Date constructor
  const parsed = new Date(str);
  return isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Formats a Date object to YYYY-MM-DD
 */
export function formatDateToYmd(date) {
  if (!date) return '';
  const d = parseDateLocal(date);
  if (!d || isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate net working hours between start and end timestamps.
 * Counts ONLY hours within 8:00 AM - 5:00 PM on eligible working days,
 * subtracting the 12:00 PM - 1:00 PM lunch window, and adding overtime.
 */
export function calculateWorkingHoursElapsed(startDateInput, endDateInput = new Date(), overtimeHours = 0) {
  if (!startDateInput) {
    return {
      totalHours: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      overtime: Number(overtimeHours) || 0,
      formatted: '0h',
    };
  }

  const start = parseDateLocal(startDateInput);
  if (!start || isNaN(start.getTime())) {
    return { totalHours: 0, days: 0, hours: 0, minutes: 0, overtime: 0, formatted: '—' };
  }

  const end = parseDateLocal(endDateInput) || new Date();
  if (start >= end) {
    const ot = Math.max(0, Number(overtimeHours) || 0);
    return {
      totalHours: ot,
      days: 0,
      hours: 0,
      minutes: 0,
      overtime: ot,
      formatted: ot > 0 ? `+${ot}h OT` : '0 min',
    };
  }

  let totalMinutes = 0;
  const current = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const finalDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  while (current <= finalDay) {
    if (isWorkingDay(current)) {
      const year = current.getFullYear();
      const month = current.getMonth();
      const date = current.getDate();

      const dayWorkStart = new Date(year, month, date, WORK_START_HOUR, 0, 0);
      const dayWorkEnd = new Date(year, month, date, WORK_END_HOUR, 0, 0);

      const isStartDay = current.getTime() === new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
      const isEndDay = current.getTime() === finalDay.getTime();

      const windowStart = isStartDay && start > dayWorkStart ? start : dayWorkStart;
      const windowEnd = isEndDay && end < dayWorkEnd ? end : dayWorkEnd;

      if (windowStart < windowEnd) {
        let diffMs = windowEnd.getTime() - windowStart.getTime();

        // Check lunch break overlap (12:00 PM - 1:00 PM)
        const lunchStart = new Date(year, month, date, LUNCH_START_HOUR, 0, 0);
        const lunchEnd = new Date(year, month, date, LUNCH_END_HOUR, 0, 0);

        if (windowStart < lunchEnd && windowEnd > lunchStart) {
          const overlapStart = windowStart > lunchStart ? windowStart : lunchStart;
          const overlapEnd = windowEnd < lunchEnd ? windowEnd : lunchEnd;
          const lunchMs = overlapEnd.getTime() - overlapStart.getTime();
          diffMs = Math.max(0, diffMs - lunchMs);
        }

        totalMinutes += Math.floor(diffMs / 60000);
      }
    }

    current.setDate(current.getDate() + 1);
  }

  const ot = Math.max(0, Number(overtimeHours) || 0);
  const otMinutes = Math.round(ot * 60);
  const grandTotalMinutes = totalMinutes + otMinutes;

  const totalHours = Math.round((grandTotalMinutes / 60) * 10) / 10;
  const workDays = Math.floor(grandTotalMinutes / (STANDARD_DAILY_HOURS * 60));
  const remMinutes = grandTotalMinutes % (STANDARD_DAILY_HOURS * 60);
  const remHours = Math.floor(remMinutes / 60);
  const finalMinutes = remMinutes % 60;

  // Human-friendly representation
  let formatted = '';
  if (workDays > 0) {
    formatted = remHours > 0 ? `${workDays}d ${remHours}h` : `${workDays} day${workDays !== 1 ? 's' : ''}`;
  } else if (remHours > 0) {
    formatted = finalMinutes > 0 ? `${remHours}h ${finalMinutes}m` : `${remHours} hr${remHours !== 1 ? 's' : ''}`;
  } else {
    formatted = `${finalMinutes} min${finalMinutes !== 1 ? 's' : ''}`;
  }

  if (ot > 0) {
    formatted += ` (+${ot}h OT)`;
  }

  return {
    totalHours,
    days: workDays,
    hours: remHours,
    minutes: finalMinutes,
    overtime: ot,
    formatted,
  };
}
