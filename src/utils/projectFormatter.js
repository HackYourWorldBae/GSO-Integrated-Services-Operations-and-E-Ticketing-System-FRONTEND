/**
 * Utility functions for formatting Project and Ticket identifiers across the GSO System.
 */

/**
 * Formats a project ID or number to a clear, professional label like "Project #1".
 * Handles formats like:
 * - "FGMU-PRJ-1-2026" -> "Project #1"
 * - "LEAU-PRJ-24-2026" -> "Project #24"
 * - "PRJ-5" -> "Project #5"
 * - "1" -> "Project #1"
 */
export function formatProjectNumber(id) {
  if (!id && id !== 0) return 'Project';
  const str = String(id).trim();
  const match = str.match(/-PRJ-(\d+)(?:-|$)/i);
  if (match) {
    return `Project #${match[1]}`;
  }
  const prjPrefixMatch = str.match(/^PRJ-(\d+)/i);
  if (prjPrefixMatch) {
    return `Project #${prjPrefixMatch[1]}`;
  }
  if (/^\d+$/.test(str)) {
    return `Project #${str}`;
  }
  return `Project #${str}`;
}

/**
 * Detects if a ticket ID or entity is an office project announcement.
 */
export function isProjectIdentifier(idOrObj) {
  if (!idOrObj) return false;
  if (typeof idOrObj === 'object') {
    if (idOrObj.is_project || idOrObj.isProject) return true;
    if (idOrObj.id && String(idOrObj.id).includes('-PRJ-')) return true;
    return false;
  }
  return String(idOrObj).includes('-PRJ-') || String(idOrObj).startsWith('PRJ-');
}

/**
 * Returns formatted label for either a Ticket or a Project.
 * e.g. "Project #1" vs "#FGMU-TIC-1-2026"
 */
export function formatTicketOrProjectLabel(id) {
  if (!id) return '';
  if (isProjectIdentifier(id)) {
    return formatProjectNumber(id);
  }
  return `#${id}`;
}
