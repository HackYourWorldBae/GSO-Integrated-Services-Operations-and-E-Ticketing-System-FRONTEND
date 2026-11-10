import { parseDateLocal } from './workCalendar';

export const SCHEDULE_DATE_FILTER = Object.freeze({
  ALL: 'all',
  THIS_WEEK: 'this_week',
  THIS_MONTH: 'this_month',
});

const ASSIGNMENT_LIST_KEYS = Object.freeze([
  'assignments',
  'collab_assignments',
  'my_unit_assignments',
  'other_unit_assignments',
]);

/**
 * Resolve the raw implementation date value from a ticket or nested assignment payload.
 * Returns null when the ticket has no meaningful implementation date assigned.
 */
export function getTicketImplementationDateRaw(ticket) {
  if (!ticket || typeof ticket !== 'object') return null;

  const directCandidates = [
    ticket.assignment?.implementation_date,
    ticket.implementation_date,
    ticket.implementationDate,
    ticket.project_target_date,
  ];

  for (const candidate of directCandidates) {
    if (candidate instanceof Date) return candidate;
    if (typeof candidate === 'string') {
      const trimmed = candidate.trim();
      if (trimmed && !['null', 'undefined', 'n/a', 'tbd', '0000-00-00'].includes(trimmed.toLowerCase())) {
        return trimmed;
      }
    }
  }

  for (const listKey of ASSIGNMENT_LIST_KEYS) {
    const list = ticket[listKey];
    if (!Array.isArray(list)) continue;
    for (const entry of list) {
      const val = entry?.implementation_date || entry?.implementationDate;
      if (val instanceof Date) return val;
      if (typeof val === 'string') {
        const trimmed = val.trim();
        if (trimmed && !['null', 'undefined', 'n/a', 'tbd', '0000-00-00'].includes(trimmed.toLowerCase())) {
          return trimmed;
        }
      }
    }
  }

  return null;
}

/**
 * Parse a date input safely into a local calendar midnight Date object (00:00:00.000).
 * Rejects invalid formats, rolled-over calendar dates (e.g. Feb 31), and zero-dates.
 */
export function normalizeLocalCalendarDate(dateInput) {
  if (!dateInput) return null;

  if (typeof dateInput === 'string') {
    const trimmed = dateInput.trim();
    if (!trimmed || trimmed.startsWith('0000')) return null;

    // Preserve local calendar day when an explicit timezone offset is present (e.g. ...Z or +08:00)
    if (/(?:Z|[+-]\d{2}:?\d{2})$/i.test(trimmed)) {
      const tzParsed = new Date(trimmed);
      if (isNaN(tzParsed.getTime()) || tzParsed.getFullYear() < 1970) return null;
      return new Date(tzParsed.getFullYear(), tzParsed.getMonth(), tzParsed.getDate());
    }

    // Validate strict YYYY-MM-DD component consistency before constructing Date
    const ymdMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|[ T])/);
    if (ymdMatch) {
      const year = Number(ymdMatch[1]);
      const month = Number(ymdMatch[2]);
      const day = Number(ymdMatch[3]);
      if (year < 1970 || month < 1 || month > 12 || day < 1 || day > 31) {
        return null;
      }
      const exactDate = new Date(year, month - 1, day);
      if (
        exactDate.getFullYear() !== year ||
        exactDate.getMonth() !== month - 1 ||
        exactDate.getDate() !== day
      ) {
        return null;
      }
      return exactDate;
    }
  }

  const parsed = parseDateLocal(dateInput);
  if (!parsed || isNaN(parsed.getTime()) || parsed.getFullYear() < 1970) {
    return null;
  }

  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
}

/**
 * Compute local Monday–Sunday week start/end boundaries for a reference date.
 */
export function getWeekBounds(referenceDate = new Date()) {
  const ref = normalizeLocalCalendarDate(referenceDate) || normalizeLocalCalendarDate(new Date());
  const dayOfWeek = ref.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const start = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() + diffToMonday);
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);

  return { start, end };
}

/**
 * Compute local calendar month start/end boundaries for a reference date.
 */
export function getMonthBounds(referenceDate = new Date()) {
  const ref = normalizeLocalCalendarDate(referenceDate) || normalizeLocalCalendarDate(new Date());
  const start = new Date(ref.getFullYear(), ref.getMonth(), 1);
  const end = new Date(ref.getFullYear(), ref.getMonth() + 1, 0);

  return { start, end };
}

/**
 * Format concise human-readable range labels for the active week and month filters.
 */
export function getSchedulePeriodLabels(referenceDate = new Date()) {
  const ref = normalizeLocalCalendarDate(referenceDate) || normalizeLocalCalendarDate(new Date());
  const { start, end } = getWeekBounds(ref);

  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  const weekRangeLabel =
    start.getFullYear() === end.getFullYear()
      ? `${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}, ${end.getFullYear()}`
      : `${startMonth} ${start.getDate()}, ${start.getFullYear()} – ${endMonth} ${end.getDate()}, ${end.getFullYear()}`;

  const monthLabel = ref.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const monthShortLabel = ref.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return {
    weekRangeLabel,
    monthLabel,
    monthShortLabel,
  };
}

/**
 * Determine if a ticket's implementation date matches the specified filter window.
 */
export function matchesScheduleDateFilter(
  ticket,
  filter = SCHEDULE_DATE_FILTER.ALL,
  referenceDate = new Date()
) {
  if (!filter || filter === SCHEDULE_DATE_FILTER.ALL) {
    return true;
  }

  const implDate = normalizeLocalCalendarDate(getTicketImplementationDateRaw(ticket));
  if (!implDate) return false;

  const ref = normalizeLocalCalendarDate(referenceDate) || normalizeLocalCalendarDate(new Date());

  if (filter === SCHEDULE_DATE_FILTER.THIS_WEEK) {
    const { start, end } = getWeekBounds(ref);
    const implTime = implDate.getTime();
    return implTime >= start.getTime() && implTime <= end.getTime();
  }

  if (filter === SCHEDULE_DATE_FILTER.THIS_MONTH) {
    return (
      implDate.getFullYear() === ref.getFullYear() &&
      implDate.getMonth() === ref.getMonth()
    );
  }

  return true;
}

/**
 * Count how many tickets fall within All, This Week, and This Month windows in a single pass.
 */
export function countTicketsByScheduleDate(tickets = [], referenceDate = new Date()) {
  if (!Array.isArray(tickets) || tickets.length === 0) {
    return { all: 0, thisWeek: 0, thisMonth: 0 };
  }

  const ref = normalizeLocalCalendarDate(referenceDate) || normalizeLocalCalendarDate(new Date());
  const { start: weekStart, end: weekEnd } = getWeekBounds(ref);
  const weekStartTime = weekStart.getTime();
  const weekEndTime = weekEnd.getTime();
  const refYear = ref.getFullYear();
  const refMonth = ref.getMonth();

  let thisWeek = 0;
  let thisMonth = 0;

  for (const ticket of tickets) {
    const implDate = normalizeLocalCalendarDate(getTicketImplementationDateRaw(ticket));
    if (!implDate) continue;

    const implTime = implDate.getTime();
    if (implTime >= weekStartTime && implTime <= weekEndTime) {
      thisWeek++;
    }
    if (implDate.getFullYear() === refYear && implDate.getMonth() === refMonth) {
      thisMonth++;
    }
  }

  return {
    all: tickets.length,
    thisWeek,
    thisMonth,
  };
}

/**
 * Return tickets matching the given schedule date filter.
 */
export function filterTicketsByScheduleDate(
  tickets = [],
  filter = SCHEDULE_DATE_FILTER.ALL,
  referenceDate = new Date()
) {
  if (!Array.isArray(tickets)) return [];
  if (!filter || filter === SCHEDULE_DATE_FILTER.ALL) {
    return tickets;
  }

  return tickets.filter((ticket) =>
    matchesScheduleDateFilter(ticket, filter, referenceDate)
  );
}
