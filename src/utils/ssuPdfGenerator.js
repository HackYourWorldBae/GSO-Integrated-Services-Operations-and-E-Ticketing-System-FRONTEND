/**
 * ssuPdfGenerator.js
 *
 * Generates Official SSU Incident Report PDFs using pdfmake in the browser —
 * no server-side dependency, no third-party API.
 *
 * Provides official Benguet State University header, Incident Record metadata,
 * Statement of Incident, Security Findings, and SSU Official Notation.
 */

import { loadImageAsPngDataUrl } from '@/utils/imageUtils';
import { getPdfMake } from '@/utils/pdfmakeInit';

let cachedLogoDataUrl = null;

async function getLogoDataUrl() {
  if (!cachedLogoDataUrl) {
    try {
      cachedLogoDataUrl = await loadImageAsPngDataUrl('/bsu-logo.png');
    } catch (e) {
      console.warn('Failed to load BSU logo for SSU PDF:', e);
      cachedLogoDataUrl = null;
    }
  }
  return cachedLogoDataUrl;
}

/**
 * Format a Date object or date string (e.g. "Sep 15, 2026").
 * @param {string|Date|null} dateVal
 * @returns {string}
 */
export const formatDocDate = (dateVal) => {
  if (!dateVal) return 'N/A';
  const parsed = new Date(typeof dateVal === 'string' ? dateVal.replace(' ', 'T') : dateVal);
  if (isNaN(parsed.getTime())) return String(dateVal);
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Builds template data from an SSU ticket.
 */
export const buildSsuTemplateData = (ticket = {}) => {
  const details = ticket.details || {};
  const ticketId = String(ticket.ticketId || ticket.id || '0000');
  const dateReported = formatDocDate(ticket.submitted_at || ticket.created_at || ticket.date || new Date());
  const dateResolved = formatDocDate(ticket.completed_at || ticket.updated_at || null);
  const location = ticket.location || details.location || details.college_building || 'BSU Campus';
  const officeRoom = ticket.office_room || details.office_room || 'N/A';
  const reporter = ticket.requestedBy || details.reported_by || details.end_user || ticket.requested_by || 'Anonymous / Confidential';
  const incidentType = ticket.title || ticket.service || ticket.service_type || 'General Incident';
  const status = ticket.statusLabel || ticket.status || 'Resolved';
  const description = (ticket.description || 'No detailed incident description provided.').trim();
  const ssuNotation = (ticket.ssu_notation || ticket.notation || details.notation || 'Incident resolved and documented under SSU safety protocols.').trim();

  // Assigned personnel / officer
  let officer = 'Designated SSU Officer';
  if (Array.isArray(ticket.assignments) && ticket.assignments.length > 0) {
    officer = ticket.assignments.map(a => a.personnel_name || a.assigned_to_name).filter(Boolean).join(', ');
  } else if (ticket.assignedWorker && ticket.assignedWorker !== 'Unassigned') {
    officer = ticket.assignedWorker;
  }

  return {
    ticketId,
    dateReported,
    dateResolved,
    location,
    officeRoom,
    reporter,
    incidentType,
    status,
    description,
    ssuNotation,
    officer,
  };
};

/**
 * Builds pdfmake docDefinition for an SSU Incident Report.
 */
const buildSsuDocDefinition = (data, logoDataUrl) => {
  const headerColumns = [];
  if (logoDataUrl) {
    headerColumns.push({
      image: logoDataUrl,
      width: 50,
      height: 50,
      alignment: 'center',
      margin: [0, 0, 10, 0],
    });
  }

  headerColumns.push({
    stack: [
      { text: 'Republic of the Philippines', fontSize: 8, italics: true, color: '#64748b', alignment: 'center' },
      { text: 'BENGUET STATE UNIVERSITY', fontSize: 13, bold: true, alignment: 'center', color: '#0f172a' },
      { text: 'General Services Office', fontSize: 9.5, bold: true, alignment: 'center', color: '#166534' },
      { text: 'Safety & Security Unit (SSU)', fontSize: 8.5, bold: true, alignment: 'center', color: '#334155' },
    ],
    alignment: 'center',
  });

  return {
    pageSize: 'LETTER',
    pageOrientation: 'portrait',
    pageMargins: [45, 40, 45, 45],

    header: (currentPage, pageCount) => ({
      margin: [45, 20, 45, 0],
      stack: [
        { columns: headerColumns, columnGap: 0 },
        { canvas: [{ type: 'line', x1: 0, y1: 6, x2: 522, y2: 6, lineWidth: 1.5, lineColor: '#0f172a' }] },
        {
          columns: [
            { text: 'OFFICIAL INCIDENT REPORT & RESOLUTION', fontSize: 10, bold: true, color: '#0f172a', margin: [0, 4, 0, 0] },
            { text: `Page ${currentPage} of ${pageCount}`, fontSize: 8, color: '#94a3b8', alignment: 'right', margin: [0, 5, 0, 0] },
          ],
        },
      ],
    }),

    footer: () => ({
      margin: [45, 0, 45, 0],
      stack: [
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 522, y2: 0, lineWidth: 0.5, lineColor: '#cbd5e1' }] },
        {
          columns: [
            { text: 'BSU General Services Office — SSU Official Incident Archive', fontSize: 7, color: '#94a3b8' },
            { text: 'Confidential & Official Document', fontSize: 7, color: '#94a3b8', alignment: 'right' },
          ],
          margin: [0, 4, 0, 0],
        },
      ],
    }),

    content: [
      { text: '', margin: [0, 70, 0, 0] }, // Top margin spacing below dynamic header

      // Metadata Bar
      {
        table: {
          widths: ['*', 'auto'],
          body: [
            [
              { text: [{ text: 'Incident Ref No: ', bold: true, color: '#475569' }, { text: `SSU-${data.ticketId}`, bold: true, color: '#0f172a' }] },
              { text: [{ text: 'Status: ', bold: true, color: '#475569' }, { text: data.status.toUpperCase(), bold: true, color: '#166534' }], alignment: 'right' },
            ],
          ],
        },
        layout: 'noBorders',
        margin: [0, 0, 0, 10],
      },

      // Incident Details Grid
      {
        table: {
          widths: [110, '*', 100, '*'],
          body: [
            [
              { text: 'Date Reported:', bold: true, style: 'labelStyle' },
              { text: data.dateReported, style: 'valueStyle' },
              { text: 'Date Resolved:', bold: true, style: 'labelStyle' },
              { text: data.dateResolved, style: 'valueStyle' },
            ],
            [
              { text: 'Incident Location:', bold: true, style: 'labelStyle' },
              { text: data.location, style: 'valueStyle' },
              { text: 'Office / Area:', bold: true, style: 'labelStyle' },
              { text: data.officeRoom, style: 'valueStyle' },
            ],
            [
              { text: 'Reported By:', bold: true, style: 'labelStyle' },
              { text: data.reporter, style: 'valueStyle' },
              { text: 'Nature of Incident:', bold: true, style: 'labelStyle' },
              { text: data.incidentType, style: 'valueStyle' },
            ],
            [
              { text: 'Assigned Officer:', bold: true, style: 'labelStyle' },
              { text: data.officer, style: 'valueStyle', colSpan: 3 },
              {},
              {},
            ],
          ],
        },
        layout: {
          fillColor: (rowIndex) => (rowIndex % 2 === 0 ? '#f8fafc' : null),
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#e2e8f0',
          vLineColor: () => '#e2e8f0',
          paddingLeft: () => 8,
          paddingRight: () => 8,
          paddingTop: () => 5,
          paddingBottom: () => 5,
        },
        margin: [0, 0, 0, 14],
      },

      // Statement of Incident
      {
        text: 'STATEMENT OF INCIDENT / PARTICULARS',
        fontSize: 9,
        bold: true,
        color: '#334155',
        margin: [0, 0, 0, 4],
      },
      {
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: data.description,
                fontSize: 9,
                lineHeight: 1.4,
                color: '#1e293b',
              },
            ],
          ],
        },
        layout: {
          fillColor: '#ffffff',
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#cbd5e1',
          vLineColor: () => '#cbd5e1',
          paddingLeft: () => 10,
          paddingRight: () => 10,
          paddingTop: () => 8,
          paddingBottom: () => 8,
        },
        margin: [0, 0, 0, 14],
      },

      // Security Notation & Resolution
      {
        text: 'SAFETY & SECURITY UNIT NOTATION & ACTION TAKEN',
        fontSize: 9,
        bold: true,
        color: '#166534',
        margin: [0, 0, 0, 4],
      },
      {
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: data.ssuNotation,
                fontSize: 9,
                lineHeight: 1.4,
                color: '#1e293b',
              },
            ],
          ],
        },
        layout: {
          fillColor: '#f0fdf4',
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#86efac',
          vLineColor: () => '#86efac',
          paddingLeft: () => 10,
          paddingRight: () => 10,
          paddingTop: () => 8,
          paddingBottom: () => 8,
        },
        margin: [0, 0, 0, 20],
      },

      // Signatures Block
      {
        columns: [
          {
            width: '*',
            stack: [
              { text: 'Reported / Documented By:', fontSize: 8, bold: true, color: '#64748b' },
              { text: '', margin: [0, 25, 0, 0] },
              { text: data.reporter, fontSize: 9.5, bold: true, color: '#0f172a' },
              { canvas: [{ type: 'line', x1: 0, y1: 2, x2: 200, y2: 2, lineWidth: 0.5, lineColor: '#94a3b8' }] },
              { text: 'Reporting Party / End-User', fontSize: 7.5, color: '#64748b', margin: [0, 2, 0, 0] },
            ],
          },
          {
            width: '*',
            stack: [
              { text: 'Noted & Recorded By:', fontSize: 8, bold: true, color: '#64748b' },
              { text: '', margin: [0, 25, 0, 0] },
              { text: data.officer, fontSize: 9.5, bold: true, color: '#0f172a' },
              { canvas: [{ type: 'line', x1: 0, y1: 2, x2: 200, y2: 2, lineWidth: 0.5, lineColor: '#94a3b8' }] },
              { text: 'Safety & Security Unit Officer', fontSize: 7.5, color: '#64748b', margin: [0, 2, 0, 0] },
            ],
          },
        ],
        margin: [0, 10, 0, 0],
      },
    ],

    styles: {
      labelStyle: {
        fontSize: 8.5,
        color: '#475569',
      },
      valueStyle: {
        fontSize: 9,
        color: '#0f172a',
      },
    },

    defaultStyle: {
      fontSize: 9,
      lineHeight: 1.3,
      color: '#0f172a',
    },
  };
};

/**
 * Generates an SSU Incident Report as a PDF Blob.
 * @param {Object} ticket
 * @returns {Promise<Blob>}
 */
export const generateSsuIncidentReportBlob = async (ticket) => {
  const [pdfMake, logoDataUrl] = await Promise.all([
    getPdfMake(),
    getLogoDataUrl(),
  ]);

  const data = buildSsuTemplateData(ticket);

  return new Promise((resolve, reject) => {
    try {
      const docDef = buildSsuDocDefinition(data, logoDataUrl);
      pdfMake.createPdf(docDef).getBlob((blob) => resolve(blob));
    } catch (err) {
      reject(err);
    }
  });
};
