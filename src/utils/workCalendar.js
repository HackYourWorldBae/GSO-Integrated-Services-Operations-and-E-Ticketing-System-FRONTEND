/**
 * workCalendar.js
 *
 * Institutional Work Calendar utility for GSO E-Ticketing.
 * Implements standard Philippine / University work schedules:
 * - Net working hours/day (dynamically configurable, default 8:00 AM to 5:00 PM, excluding 12:00 PM - 1:00 PM lunch).
 * - Excludes weekends (Saturday & Sunday).
 * - Excludes official Philippine regular and special non-working holidays, plus Director-configured special dates.
 * - Accounts for approved overtime hours.
 */

export let WORK_START_HOUR = 8;
export let WORK_END_HOUR = 17;
export let LUNCH_START_HOUR = 12;
export let LUNCH_END_HOUR = 13;
export let STANDARD_DAILY_HOURS = 8.0;

// Automatic daily job continuation settings
export let DAILY_CONTINUATION_ENABLED = true;
export let CONTINUATION_START_TIME = '08:00';
export let CONTINUATION_CUTOFF_TIME = '17:00';

// Institutional time breaks
export let LUNCH_BREAK_ENABLED = true;
export let MORNING_BREAK_ENABLED = false;
export let MORNING_BREAK_START = '10:00';
export let MORNING_BREAK_END = '10:15';
export let AFTERNOON_BREAK_ENABLED = false;
export let AFTERNOON_BREAK_START = '15:00';
export let AFTERNOON_BREAK_END = '15:15';

// Weekend work & exclusion policies
export let EXCLUDE_WEEKENDS = true;
export let EXCLUDE_SATURDAY = true;
export let EXCLUDE_SUNDAY = true;

// Internal runtime state for dynamically configured special non-working holidays
let customHolidaysRegistry = [];

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
 * Configure dynamic working hours, automatic continuation, time breaks, and special holidays from the Central Editing Hub.
 */
export function configureWorkCalendar(options = {}) {
  if (options.workStartHour !== undefined) {
    WORK_START_HOUR = Number(options.workStartHour) || 8;
  } else if (options.work_start_time) {
    const [h] = options.work_start_time.split(':');
    WORK_START_HOUR = Number(h) || 8;
  }

  if (options.workEndHour !== undefined) {
    WORK_END_HOUR = Number(options.workEndHour) || 17;
  } else if (options.work_end_time) {
    const [h] = options.work_end_time.split(':');
    WORK_END_HOUR = Number(h) || 17;
  }

  if (options.lunchStartHour !== undefined) {
    LUNCH_START_HOUR = Number(options.lunchStartHour) || 12;
  } else if (options.lunch_start_time) {
    const [h] = options.lunch_start_time.split(':');
    LUNCH_START_HOUR = Number(h) || 12;
  }

  if (options.lunchEndHour !== undefined) {
    LUNCH_END_HOUR = Number(options.lunchEndHour) || 13;
  } else if (options.lunch_end_time) {
    const [h] = options.lunch_end_time.split(':');
    LUNCH_END_HOUR = Number(h) || 13;
  }

  if (options.standardDailyHours !== undefined) {
    STANDARD_DAILY_HOURS = Number(options.standardDailyHours) || 8.0;
  } else if (options.standard_daily_hours) {
    STANDARD_DAILY_HOURS = Number(options.standard_daily_hours) || 8.0;
  }

  // Automatic daily continuation
  if (options.daily_continuation_enabled !== undefined) {
    DAILY_CONTINUATION_ENABLED = Boolean(Number(options.daily_continuation_enabled));
  }
  if (options.continuation_start_time) {
    CONTINUATION_START_TIME = options.continuation_start_time;
  }
  if (options.continuation_cutoff_time) {
    CONTINUATION_CUTOFF_TIME = options.continuation_cutoff_time;
  }

  // Time breaks
  if (options.lunch_break_enabled !== undefined) {
    LUNCH_BREAK_ENABLED = Boolean(Number(options.lunch_break_enabled));
  }
  if (options.morning_break_enabled !== undefined) {
    MORNING_BREAK_ENABLED = Boolean(Number(options.morning_break_enabled));
  }
  if (options.morning_break_start) MORNING_BREAK_START = options.morning_break_start;
  if (options.morning_break_end) MORNING_BREAK_END = options.morning_break_end;

  if (options.afternoon_break_enabled !== undefined) {
    AFTERNOON_BREAK_ENABLED = Boolean(Number(options.afternoon_break_enabled));
  }
  if (options.afternoon_break_start) AFTERNOON_BREAK_START = options.afternoon_break_start;
  if (options.afternoon_break_end) AFTERNOON_BREAK_END = options.afternoon_break_end;

  // Weekend exclusion
  if (options.exclude_weekends !== undefined) {
    EXCLUDE_WEEKENDS = Boolean(Number(options.exclude_weekends));
  }
  if (options.exclude_saturday !== undefined) {
    EXCLUDE_SATURDAY = Boolean(Number(options.exclude_saturday));
  }
  if (options.exclude_sunday !== undefined) {
    EXCLUDE_SUNDAY = Boolean(Number(options.exclude_sunday));
  }

  if (Array.isArray(options.holidays)) {
    customHolidaysRegistry = options.holidays.filter(h => h && h.is_active !== 0 && h.is_active !== false);
  }
}

/**
 * Reset working calendar settings to institutional defaults.
 */
export function resetWorkCalendarConfig() {
  WORK_START_HOUR = 8;
  WORK_END_HOUR = 17;
  LUNCH_START_HOUR = 12;
  LUNCH_END_HOUR = 13;
  STANDARD_DAILY_HOURS = 8.0;
  DAILY_CONTINUATION_ENABLED = true;
  CONTINUATION_START_TIME = '08:00';
  CONTINUATION_CUTOFF_TIME = '17:00';
  LUNCH_BREAK_ENABLED = true;
  MORNING_BREAK_ENABLED = false;
  MORNING_BREAK_START = '10:00';
  MORNING_BREAK_END = '10:15';
  AFTERNOON_BREAK_ENABLED = false;
  AFTERNOON_BREAK_START = '15:00';
  AFTERNOON_BREAK_END = '15:15';
  EXCLUDE_WEEKENDS = true;
  EXCLUDE_SATURDAY = true;
  EXCLUDE_SUNDAY = true;
  customHolidaysRegistry = [];
}

/**
 * Inspect active configuration.
 */
export function getWorkCalendarConfig() {
  return {
    workStartHour: WORK_START_HOUR,
    workEndHour: WORK_END_HOUR,
    lunchStartHour: LUNCH_START_HOUR,
    lunchEndHour: LUNCH_END_HOUR,
    standardDailyHours: STANDARD_DAILY_HOURS,
    dailyContinuationEnabled: DAILY_CONTINUATION_ENABLED,
    continuationStartTime: CONTINUATION_START_TIME,
    continuationCutoffTime: CONTINUATION_CUTOFF_TIME,
    lunchBreakEnabled: LUNCH_BREAK_ENABLED,
    morningBreakEnabled: MORNING_BREAK_ENABLED,
    morningBreakStart: MORNING_BREAK_START,
    morningBreakEnd: MORNING_BREAK_END,
    afternoonBreakEnabled: AFTERNOON_BREAK_ENABLED,
    afternoonBreakStart: AFTERNOON_BREAK_START,
    afternoonBreakEnd: AFTERNOON_BREAK_END,
    excludeWeekends: EXCLUDE_WEEKENDS,
    excludeSaturday: EXCLUDE_SATURDAY,
    excludeSunday: EXCLUDE_SUNDAY,
    holidaysCount: customHolidaysRegistry.length,
  };
}

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
 * Check if a date falls on a weekend, respecting institutional exclusion policy
 */
export function isWeekend(date) {
  if (!EXCLUDE_WEEKENDS) return false;
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday, 6 = Saturday
  if (day === 6) return EXCLUDE_SATURDAY;
  if (day === 0) return EXCLUDE_SUNDAY;
  return false;
}

/**
 * Check if a date is an official Philippine holiday or custom special non-working date
 */
export function isHoliday(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return false;

  const y = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const ymd = `${y}-${month}-${day}`;
  const monthDay = `${month}-${day}`;

  if (FIXED_PHILIPPINE_HOLIDAYS[monthDay]) {
    return true;
  }

  // Movable: National Heroes Day (Last Monday of August)
  const lastDayAug = new Date(y, 7, 31);
  const lastMondayAugDate = 31 - ((lastDayAug.getDay() + 6) % 7);
  if (d.getMonth() === 7 && d.getDate() === lastMondayAugDate) {
    return true;
  }

  // Movable: Holy Week (Maundy Thursday, Good Friday, Black Saturday)
  const easter = getEasterSunday(y);
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

  if (isSameDay(d, maundyThu) || isSameDay(d, goodFri) || isSameDay(d, blackSat)) {
    return true;
  }

  // Check dynamically registered special non-working holidays
  for (const h of customHolidaysRegistry) {
    if (!h) continue;
    if (h.holiday_date === ymd) {
      return true;
    }
    if (h.is_recurring && h.holiday_date) {
      const recMd = h.holiday_date.slice(5); // 'MM-DD'
      if (recMd === monthDay) {
        return true;
      }
    }
  }

  return false;
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
 * Safely parses date inputs without UTC midnight shift.
 * Date-only strings (YYYY-MM-DD) default to WORK_START_HOUR in local time.
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
 * Counts ONLY hours within configured operational window on eligible working days,
 * subtracting the configured lunch window, and adding overtime.
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
    const isStartDay = current.getTime() === new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
    const isEndDay = current.getTime() === finalDay.getTime();

    if (isWorkingDay(current) || isStartDay) {
      const year = current.getFullYear();
      const month = current.getMonth();
      const date = current.getDate();

      const dayWorkStart = new Date(year, month, date, WORK_START_HOUR, 0, 0);
      const dayWorkEnd = new Date(year, month, date, WORK_END_HOUR, 0, 0);

      // On start day, count from actual start timestamp so early starts (e.g. before start hour) are preserved
      const windowStart = isStartDay ? start : dayWorkStart;
      const windowEnd = isEndDay && end < dayWorkEnd ? end : dayWorkEnd;

      if (windowStart < windowEnd) {
        let diffMs = windowEnd.getTime() - windowStart.getTime();

        // Check lunch break overlap
        if (LUNCH_BREAK_ENABLED && LUNCH_START_HOUR < LUNCH_END_HOUR) {
          const lunchStart = new Date(year, month, date, LUNCH_START_HOUR, 0, 0);
          const lunchEnd = new Date(year, month, date, LUNCH_END_HOUR, 0, 0);

          if (windowStart < lunchEnd && windowEnd > lunchStart) {
            const overlapStart = windowStart > lunchStart ? windowStart : lunchStart;
            const overlapEnd = windowEnd < lunchEnd ? windowEnd : lunchEnd;
            const lunchMs = overlapEnd.getTime() - overlapStart.getTime();
            diffMs = Math.max(0, diffMs - lunchMs);
          }
        }

        // Check morning break overlap
        if (MORNING_BREAK_ENABLED && MORNING_BREAK_START && MORNING_BREAK_END) {
          const [mSh, mSm] = MORNING_BREAK_START.split(':').map(Number);
          const [mEh, mEm] = MORNING_BREAK_END.split(':').map(Number);
          const mBreakStart = new Date(year, month, date, mSh, mSm || 0, 0);
          const mBreakEnd   = new Date(year, month, date, mEh, mEm || 0, 0);

          if (windowStart < mBreakEnd && windowEnd > mBreakStart) {
            const overlapStart = windowStart > mBreakStart ? windowStart : mBreakStart;
            const overlapEnd   = windowEnd < mBreakEnd ? windowEnd : mBreakEnd;
            const mBreakMs = overlapEnd.getTime() - overlapStart.getTime();
            diffMs = Math.max(0, diffMs - mBreakMs);
          }
        }

        // Check afternoon break overlap
        if (AFTERNOON_BREAK_ENABLED && AFTERNOON_BREAK_START && AFTERNOON_BREAK_END) {
          const [aSh, aSm] = AFTERNOON_BREAK_START.split(':').map(Number);
          const [aEh, aEm] = AFTERNOON_BREAK_END.split(':').map(Number);
          const aBreakStart = new Date(year, month, date, aSh, aSm || 0, 0);
          const aBreakEnd   = new Date(year, month, date, aEh, aEm || 0, 0);

          if (windowStart < aBreakEnd && windowEnd > aBreakStart) {
            const overlapStart = windowStart > aBreakStart ? windowStart : aBreakStart;
            const overlapEnd   = windowEnd < aBreakEnd ? windowEnd : aBreakEnd;
            const aBreakMs = overlapEnd.getTime() - overlapStart.getTime();
            diffMs = Math.max(0, diffMs - aBreakMs);
          }
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
  const dailyMins = STANDARD_DAILY_HOURS * 60;
  const workDays = dailyMins > 0 ? Math.floor(grandTotalMinutes / dailyMins) : 0;
  const remMinutes = dailyMins > 0 ? grandTotalMinutes % dailyMins : 0;
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
