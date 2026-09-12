/**
 * Utility to extract structured list of assigned workers from ticket data.
 * Supports:
 * - Multi-worker assignment array: `ticket.assignments`
 * - Single assignment object or comma-delimited strings: `ticket.assignment`
 *
 * @param {Object} ticket
 * @returns {Array<{ id: number|string|null, name: string, profession: string, contact: string }>}
 */
export const getAssignedWorkers = (ticket) => {
  if (!ticket) return [];

  // 1. Check if ticket has explicit assignments array
  if (Array.isArray(ticket.assignments) && ticket.assignments.length > 0) {
    // If it's a single item with comma-separated names, treat it as comma-separated
    if (ticket.assignments.length === 1 && String(ticket.assignments[0]?.personnel_name || '').includes(',')) {
      const item = ticket.assignments[0];
      const names = String(item.personnel_name).split(',').map(s => s.trim()).filter(Boolean);
      const specs = String(item.specialty || item.profession || '').split(',').map(s => s.trim()).filter(Boolean);
      return names.map((name, idx) => ({
        id: item.personnel_id || item.id || null,
        name,
        profession: specs[idx] || specs[0] || 'Personnel',
        contact: String(item.personnel_contact || '').trim(),
      }));
    }

    const valid = ticket.assignments
      .filter(a => a && (a.personnel_name || a.name || a.first_name))
      .map(a => {
        const name = a.personnel_name || a.name || `${a.first_name || ''} ${a.last_name || ''}`.trim();
        return {
          id: a.personnel_id || a.id || null,
          name: String(name).trim(),
          profession: String(a.specialty || a.profession || a.role || 'Personnel').trim(),
          contact: String(a.personnel_contact || a.contact || a.contact_number || '').trim(),
        };
      })
      .filter(w => w.name !== '');

    if (valid.length > 0) {
      // Deduplicate by worker name
      const seen = new Set();
      const deduped = [];
      for (const w of valid) {
        const key = w.name.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          deduped.push(w);
        }
      }
      return deduped;
    }
  }

  // 2. Parse from ticket.assignment or ticket root
  const assignment = ticket.assignment || {};
  const rawNames = String(assignment.personnel_name || ticket.personnel_name || '').trim();
  if (!rawNames) return [];

  const rawSpecs = String(
    assignment.specialty ||
    assignment.profession ||
    ticket.specialty ||
    ticket.profession ||
    ''
  ).trim();

  const names = rawNames.split(',').map(s => s.trim()).filter(Boolean);
  const specs = rawSpecs.split(',').map(s => s.trim()).filter(Boolean);

  return names.map((name, idx) => ({
    id: assignment.personnel_id || null,
    name,
    profession: specs[idx] || specs[0] || 'Personnel',
    contact: String(assignment.personnel_contact || ticket.contact_number || '').trim(),
  }));
};

/**
 * Returns two-letter initials from a person's name.
 * @param {string} name
 * @returns {string}
 */
export const getWorkerInitials = (name) => {
  if (!name) return 'W';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

