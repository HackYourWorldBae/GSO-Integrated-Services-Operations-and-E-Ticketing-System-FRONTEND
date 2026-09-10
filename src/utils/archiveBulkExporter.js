/**
 * archiveBulkExporter.js
 *
 * Dedicated bulk document export utility for yearly archives.
 * Generates separated, audit-ready ZIP packages for:
 *  1. Official Job Request Forms (+ dedicated CSV summary)
 *  2. Material Issuance Slips (+ dedicated Materials CSV summary)
 *  3. SSU Incident Reports (+ dedicated Incident CSV summary)
 *
 * Excludes raw attachment proofs per specification to ensure fast, lightweight,
 * and reliable offline record-keeping.
 */

import PizZip from 'pizzip';
import { saveAs } from 'file-saver';
import { generateFgmuJobRequestFormBlob } from '@/utils/fgmuPdfGenerator';
import { generateMaterialSlipPdfBlob } from '@/utils/materialSlipPdfGenerator';
import { generateSsuIncidentReportBlob } from '@/utils/ssuPdfGenerator';

/**
 * Extract 4-digit year from ticket dates or ticket reference.
 * @param {Object} ticket
 * @returns {string} 4-digit year e.g. "2026"
 */
export const getTicketYear = (ticket = {}) => {
  if (ticket.submitted_at) {
    const y = new Date(ticket.submitted_at).getFullYear();
    if (!isNaN(y) && y > 2000) return String(y);
  }
  if (ticket.date) {
    const y = new Date(ticket.date).getFullYear();
    if (!isNaN(y) && y > 2000) return String(y);
  }
  if (ticket.completed_at) {
    const y = new Date(ticket.completed_at).getFullYear();
    if (!isNaN(y) && y > 2000) return String(y);
  }
  const idMatch = String(ticket.ticketId || ticket.id || '').match(/-(\d{4})$/);
  if (idMatch) return idMatch[1];
  return String(new Date().getFullYear());
};

/**
 * Extract unique sorted years list from an array of tickets.
 * @param {Array} tickets
 * @returns {Array<string>}
 */
export const getAvailableYearsFromTickets = (tickets = []) => {
  const years = new Set();
  tickets.forEach(t => {
    const y = getTicketYear(t);
    if (y) years.add(y);
  });
  if (years.size === 0) {
    years.add(String(new Date().getFullYear()));
  }
  return Array.from(years).sort((a, b) => b.localeCompare(a));
};

/**
 * Filter tickets matching a selected year ("all" or "YYYY").
 */
export const filterTicketsByYear = (tickets = [], year = 'all') => {
  if (!year || year === 'all') return [...tickets];
  return tickets.filter(t => getTicketYear(t) === String(year));
};

/**
 * Escape a value for RFC-4180 standard CSV.
 */
const escapeCsv = (val) => {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
};

/**
 * Convert an array of row objects into a CSV string prefixed with UTF-8 BOM.
 */
const buildCsv = (headers, rows) => {
  const headerLine = headers.map(h => escapeCsv(h.label)).join(',');
  const rowLines = rows.map(row => {
    return headers.map(h => escapeCsv(h.getValue(row))).join(',');
  });
  // Prefix \uFEFF ensures Excel and LibreOffice recognize UTF-8 special characters & currency symbols (₱)
  return '\uFEFF' + [headerLine, ...rowLines].join('\r\n');
};

/**
 * Convert a browser Blob into an ArrayBuffer.
 */
const blobToArrayBuffer = async (blob) => {
  if (blob.arrayBuffer) {
    return await blob.arrayBuffer();
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
};

/**
 * Format currency number.
 */
const formatPrice = (val) => {
  return Number(val || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. Export Job Request Forms ZIP (FGMU & LEAU)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Exports all Job Request Forms for a given year as a ZIP package with a dedicated CSV summary.
 *
 * @param {Object} options
 * @param {Array} options.tickets - All tickets in unit archive
 * @param {string} options.unitCode - 'FGMU' | 'LEAU'
 * @param {string} options.year - '2026' | 'all'
 * @param {Function} [options.onProgress] - ({ current, total, percent, statusText })
 * @param {AbortSignal} [options.signal] - For cancellation
 * @returns {Promise<Object>}
 */
export const exportJobRequestFormsZip = async ({
  tickets = [],
  unitCode = 'FGMU',
  year = 'all',
  onProgress = null,
  signal = null,
}) => {
  const targetTickets = filterTicketsByYear(tickets, year);

  if (targetTickets.length === 0) {
    throw new Error(`No archived tickets found for ${year === 'all' ? 'any year' : 'year ' + year}.`);
  }

  const zip = new PizZip();
  const yearLabel = year === 'all' ? 'All_Years' : year;

  // 1. Generate dedicated CSV Summary for Request Forms
  const csvHeaders = [
    { label: 'Ticket ID', getValue: t => `#${t.ticketId || t.id}` },
    { label: 'Unit', getValue: () => unitCode },
    { label: 'Service Category', getValue: t => t.title || t.service || t.service_type || 'General Service' },
    { label: 'Requester', getValue: t => t.requestedBy || t.details?.end_user || 'End User' },
    { label: 'Location / Building', getValue: t => t.location || t.details?.college_building || 'N/A' },
    { label: 'Office / Room', getValue: t => t.office_room || t.details?.office_room || 'N/A' },
    { label: 'Fund Source', getValue: t => t.details?.source_of_fund || 'N/A' },
    { label: 'Date Filed', getValue: t => t.date || t.submitted_at || 'N/A' },
    { label: 'Date Completed', getValue: t => t.completed_at || t.updated_at || 'N/A' },
    { label: 'Status', getValue: t => t.statusLabel || t.status || 'Completed' },
    { label: 'Assigned Personnel', getValue: t => t.assignedWorker || 'Unassigned' },
    { label: 'Target Duration (Days)', getValue: t => t.workingDays || t.working_days || 'N/A' },
    { label: 'Quality Rating', getValue: t => t.feedback?.quality_rating ? `${t.feedback.quality_rating}/5` : 'N/A' },
    { label: 'Timeliness Rating', getValue: t => t.feedback?.timeliness_rating ? `${t.feedback.timeliness_rating}/5` : 'N/A' },
    { label: 'Efficiency Rating', getValue: t => t.feedback?.efficiency_rating ? `${t.feedback.efficiency_rating}/5` : 'N/A' },
    { label: 'Feedback Remarks', getValue: t => t.feedback?.remarks || 'None' },
    { label: 'Decline Reason', getValue: t => t.declineReason || 'N/A' },
    { label: 'Job Particulars / Description', getValue: t => t.description || 'N/A' },
  ];

  const csvContent = buildCsv(csvHeaders, targetTickets);
  const csvFilename = `00_${unitCode}_Job_Request_Forms_Summary_${yearLabel}.csv`;
  zip.file(csvFilename, csvContent);

  // 2. Generate each Job Request Form PDF and append to ZIP
  const total = targetTickets.length;
  for (let i = 0; i < total; i++) {
    if (signal?.aborted) {
      throw new Error('Export cancelled by user.');
    }

    const ticket = targetTickets[i];
    const ticketId = ticket.ticketId || ticket.id || String(i + 1);

    if (onProgress) {
      onProgress({
        current: i + 1,
        total,
        percent: Math.round(((i + 1) / total) * 90),
        statusText: `Generating Job Request Form for #${ticketId} (${i + 1}/${total})...`,
        currentTicketId: ticketId,
      });
    }

    try {
      const pdfBlob = await generateFgmuJobRequestFormBlob(ticket, ticket.feedback);
      const buffer = await blobToArrayBuffer(pdfBlob);
      const pdfName = `${unitCode}_Job_Request_Form_TIC-${unitCode}-${ticketId}.pdf`;
      zip.file(pdfName, new Uint8Array(buffer), { binary: true });
    } catch (err) {
      console.warn(`Failed to generate PDF for ticket #${ticketId}:`, err);
      // Append a fallback text note in the zip so the bundle remains complete
      zip.file(
        `${unitCode}_Job_Request_Form_TIC-${unitCode}-${ticketId}_ERROR.txt`,
        `Could not generate PDF for Ticket #${ticketId}. Reason: ${err.message || 'Unknown error'}`
      );
    }

    // Brief tick to allow browser UI thread to update progress smoothly
    await new Promise(r => setTimeout(r, 20));
  }

  if (onProgress) {
    onProgress({
      current: total,
      total,
      percent: 95,
      statusText: `Compressing ${unitCode} Job Request Forms archive...`,
      currentTicketId: '',
    });
  }

  // 3. Compress and trigger download
  const zipBytes = zip.generate({ type: 'uint8array', compression: 'DEFLATE' });
  const zipBlob = new Blob([zipBytes], { type: 'application/zip' });
  const filename = `${unitCode}_Job_Request_Forms_${yearLabel}.zip`;

  saveAs(zipBlob, filename);

  if (onProgress) {
    onProgress({
      current: total,
      total,
      percent: 100,
      statusText: `Download started!`,
      currentTicketId: '',
    });
  }

  return {
    success: true,
    count: total,
    filename,
    blob: zipBlob,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. Export Material Issuance Slips ZIP (FGMU & LEAU)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Exports all Material Issuance Slips for tickets that consumed materials in a given year,
 * packaged into a ZIP with a dedicated Materials CSV summary.
 *
 * @param {Object} options
 * @param {Array} options.tickets - All tickets in unit archive
 * @param {string} options.unitCode - 'FGMU' | 'LEAU'
 * @param {string} options.year - '2026' | 'all'
 * @param {Function} [options.onProgress] - ({ current, total, percent, statusText })
 * @param {AbortSignal} [options.signal] - For cancellation
 * @returns {Promise<Object>}
 */
export const exportMaterialSlipsZip = async ({
  tickets = [],
  unitCode = 'FGMU',
  year = 'all',
  onProgress = null,
  signal = null,
}) => {
  const targetYearTickets = filterTicketsByYear(tickets, year);

  // Filter only tickets that consumed materials
  const materialTickets = targetYearTickets.filter(t => {
    return Array.isArray(t.materials) && t.materials.length > 0;
  });

  if (materialTickets.length === 0) {
    throw new Error(
      `No tickets with consumed materials found for ${year === 'all' ? 'any year' : 'year ' + year}.`
    );
  }

  const zip = new PizZip();
  const yearLabel = year === 'all' ? 'All_Years' : year;

  // 1. Generate dedicated CSV Summary for Materials
  const csvHeaders = [
    { label: 'Ticket ID', getValue: t => `#${t.ticketId || t.id}` },
    { label: 'Unit', getValue: () => unitCode },
    { label: 'Date Completed', getValue: t => t.completed_at || t.updated_at || t.date || 'N/A' },
    { label: 'Requester', getValue: t => t.requestedBy || t.details?.end_user || 'End User' },
    { label: 'Location / Office', getValue: t => `${t.location || 'N/A'} - ${t.office_room || 'N/A'}` },
    { label: 'Service Category', getValue: t => t.title || t.service || t.service_type || 'General Service' },
    { label: 'Assigned Personnel', getValue: t => t.assignedWorker || 'Unassigned' },
    { label: 'Total Material Cost (PHP)', getValue: t => formatPrice(t.total_material_cost) },
    {
      label: 'Item Breakdown (Qty Unit - Item @ Price = Total)',
      getValue: t => {
        return (t.materials || [])
          .map(m => {
            const qty = m.quantity || 0;
            const unit = m.unit_measurement || m.unit || 'pcs';
            const name = m.material_name || m.name || 'Item';
            const price = formatPrice(m.unit_price || 0);
            const subtotal = formatPrice(m.total_price || (qty * (m.unit_price || 0)));
            return `${qty} ${unit} - ${name} @ P${price} = P${subtotal}`;
          })
          .join('; ');
      },
    },
    { label: 'Status', getValue: t => t.statusLabel || t.status || 'Completed' },
  ];

  const csvContent = buildCsv(csvHeaders, materialTickets);
  const csvFilename = `00_${unitCode}_Materials_Summary_${yearLabel}.csv`;
  zip.file(csvFilename, csvContent);

  // 2. Generate each Material Issuance Slip PDF and append to ZIP
  const total = materialTickets.length;
  for (let i = 0; i < total; i++) {
    if (signal?.aborted) {
      throw new Error('Export cancelled by user.');
    }

    const ticket = materialTickets[i];
    const ticketId = ticket.ticketId || ticket.id || String(i + 1);

    if (onProgress) {
      onProgress({
        current: i + 1,
        total,
        percent: Math.round(((i + 1) / total) * 90),
        statusText: `Generating Material Issuance Slip for #${ticketId} (${i + 1}/${total})...`,
        currentTicketId: ticketId,
      });
    }

    try {
      const pdfBlob = await generateMaterialSlipPdfBlob(ticket);
      const buffer = await blobToArrayBuffer(pdfBlob);
      const pdfName = `Material_Issuance_Slip_${unitCode}_TIC-${ticketId}.pdf`;
      zip.file(pdfName, new Uint8Array(buffer), { binary: true });
    } catch (err) {
      console.warn(`Failed to generate Material Slip PDF for #${ticketId}:`, err);
      zip.file(
        `Material_Issuance_Slip_${unitCode}_TIC-${ticketId}_ERROR.txt`,
        `Could not generate Material Slip for Ticket #${ticketId}. Reason: ${err.message || 'Unknown error'}`
      );
    }

    await new Promise(r => setTimeout(r, 20));
  }

  if (onProgress) {
    onProgress({
      current: total,
      total,
      percent: 95,
      statusText: `Compressing ${unitCode} Material Slips archive...`,
      currentTicketId: '',
    });
  }

  // 3. Compress and trigger download
  const zipBytes = zip.generate({ type: 'uint8array', compression: 'DEFLATE' });
  const zipBlob = new Blob([zipBytes], { type: 'application/zip' });
  const filename = `${unitCode}_Material_Issuance_Slips_${yearLabel}.zip`;

  saveAs(zipBlob, filename);

  if (onProgress) {
    onProgress({
      current: total,
      total,
      percent: 100,
      statusText: `Download started!`,
      currentTicketId: '',
    });
  }

  return {
    success: true,
    count: total,
    filename,
    blob: zipBlob,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. Export SSU Incident Reports ZIP
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Exports all SSU Incident Reports for a given year as a ZIP package with a dedicated CSV summary.
 *
 * @param {Object} options
 * @param {Array} options.tickets - All tickets in SSU archive
 * @param {string} options.year - '2026' | 'all'
 * @param {Function} [options.onProgress] - ({ current, total, percent, statusText })
 * @param {AbortSignal} [options.signal] - For cancellation
 * @returns {Promise<Object>}
 */
export const exportSsuIncidentReportsZip = async ({
  tickets = [],
  year = 'all',
  onProgress = null,
  signal = null,
}) => {
  const targetTickets = filterTicketsByYear(tickets, year);

  if (targetTickets.length === 0) {
    throw new Error(`No archived incident tickets found for ${year === 'all' ? 'any year' : 'year ' + year}.`);
  }

  const zip = new PizZip();
  const yearLabel = year === 'all' ? 'All_Years' : year;

  // 1. Generate dedicated CSV Summary for SSU Incident Reports
  const csvHeaders = [
    { label: 'Incident Ticket ID', getValue: t => `#${t.ticketId || t.id}` },
    { label: 'Nature of Incident', getValue: t => t.title || t.service || t.service_type || 'Incident Report' },
    { label: 'Date Reported', getValue: t => t.date || t.submitted_at || 'N/A' },
    { label: 'Date Resolved', getValue: t => t.completed_at || t.updated_at || 'N/A' },
    { label: 'Reported By', getValue: t => t.requestedBy || t.details?.reported_by || 'Confidential' },
    { label: 'Location / Vicinity', getValue: t => t.location || t.details?.location || 'BSU Campus' },
    { label: 'Office / Room', getValue: t => t.office_room || t.details?.office_room || 'N/A' },
    { label: 'Assigned Security Officer', getValue: t => t.assignedWorker || 'Unassigned' },
    { label: 'Status', getValue: t => t.statusLabel || t.status || 'Resolved' },
    { label: 'SSU Notation / Recommendation', getValue: t => t.ssu_notation || t.notation || 'None' },
    { label: 'Incident Statement / Description', getValue: t => t.description || 'N/A' },
  ];

  const csvContent = buildCsv(csvHeaders, targetTickets);
  const csvFilename = `00_SSU_Incident_Reports_Summary_${yearLabel}.csv`;
  zip.file(csvFilename, csvContent);

  // 2. Generate each SSU Incident Report PDF and append to ZIP
  const total = targetTickets.length;
  for (let i = 0; i < total; i++) {
    if (signal?.aborted) {
      throw new Error('Export cancelled by user.');
    }

    const ticket = targetTickets[i];
    const ticketId = ticket.ticketId || ticket.id || String(i + 1);

    if (onProgress) {
      onProgress({
        current: i + 1,
        total,
        percent: Math.round(((i + 1) / total) * 90),
        statusText: `Generating SSU Incident Report for #${ticketId} (${i + 1}/${total})...`,
        currentTicketId: ticketId,
      });
    }

    try {
      const pdfBlob = await generateSsuIncidentReportBlob(ticket);
      const buffer = await blobToArrayBuffer(pdfBlob);
      const pdfName = `SSU_Incident_Report_TIC-${ticketId}.pdf`;
      zip.file(pdfName, new Uint8Array(buffer), { binary: true });
    } catch (err) {
      console.warn(`Failed to generate SSU Incident Report for #${ticketId}:`, err);
      zip.file(
        `SSU_Incident_Report_TIC-${ticketId}_ERROR.txt`,
        `Could not generate PDF for Ticket #${ticketId}. Reason: ${err.message || 'Unknown error'}`
      );
    }

    await new Promise(r => setTimeout(r, 20));
  }

  if (onProgress) {
    onProgress({
      current: total,
      total,
      percent: 95,
      statusText: `Compressing SSU Incident Reports archive...`,
      currentTicketId: '',
    });
  }

  // 3. Compress and trigger download
  const zipBytes = zip.generate({ type: 'uint8array', compression: 'DEFLATE' });
  const zipBlob = new Blob([zipBytes], { type: 'application/zip' });
  const filename = `SSU_Incident_Reports_${yearLabel}.zip`;

  saveAs(zipBlob, filename);

  if (onProgress) {
    onProgress({
      current: total,
      total,
      percent: 100,
      statusText: `Download started!`,
      currentTicketId: '',
    });
  }

  return {
    success: true,
    count: total,
    filename,
    blob: zipBlob,
  };
};
