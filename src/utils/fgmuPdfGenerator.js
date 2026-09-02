/**
 * fgmuPdfGenerator.js
 *
 * Generates FGMU Job Request Form PDFs using pdfmake entirely in the browser —
 * no server-side process, no third-party API, no docx-preview.
 *
 * The layout is defined as a pdfmake docDefinition object, giving us
 * pixel-accurate control over every element (logo, tables, signatures, etc.)
 * and producing a real vector PDF with selectable text.
 *
 * Usage:
 *   generateFgmuJobRequestFormBlob(ticket, feedbackData) → Promise<Blob>
 *   downloadFgmuJobRequestForm(ticket, feedbackData)     → triggers PDF download
 *   attachFgmuJobRequestForm(ticket, feedbackData)       → generates + uploads to backend
 */

import api from '@/api/client';
import { loadImageAsPngDataUrl } from '@/utils/imageUtils';

/** Lazy-loaded pdfmake instance — only fetched on first document generation. */
let _pdfMake = null;

async function getPdfMake() {
  if (!_pdfMake) {
    const [{ default: pdfMake }, { default: pdfFonts }] = await Promise.all([
      import('pdfmake/build/pdfmake'),
      import('pdfmake/build/vfs_fonts'),
    ]);
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    _pdfMake = pdfMake;
  }
  return _pdfMake;
}

// ─────────────────────────────────────────────────────────────────────────────
// Date Formatting
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format a Date object or date string into human-readable form (e.g. "Sep 15, 2026").
 * @param {string|Date|null} dateVal
 * @returns {string}
 */
export const formatDocDate = (dateVal) => {
  if (!dateVal) return '';
  const parsed = new Date(typeof dateVal === 'string' ? dateVal.replace(' ', 'T') : dateVal);
  if (isNaN(parsed.getTime())) return String(dateVal);
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Template Data Builder (reused from docx generator — same logic)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Maps ticket and feedback records into a flat template data object.
 * @param {Object} ticket
 * @param {Object|null} feedbackData
 * @returns {Object}
 */
export const buildFgmuTemplateData = (ticket = {}, feedbackData = null) => {
  const details    = ticket.details    || {};
  const assignment = ticket.assignment || {};
  const feedback   = feedbackData || ticket.feedback || {};

  const dateFiling    = formatDocDate(ticket.submitted_at || ticket.created_at || ticket.date || new Date());
  const dateStarted   = formatDocDate(
    assignment.dispatched_at ||
    assignment.implementation_date ||
    ticket.scheduled_date ||
    ticket.implementationDate ||
    assignment.assigned_at ||
    ''
  );
  const dateCompleted = formatDocDate(ticket.completed_at || ticket.updated_at || new Date());

  const building     = details.college_building || ticket.location || details.location || ticket.college_building || 'N/A';
  const room         = details.office_room       || ticket.office_room || ticket.officeRoom || 'N/A';
  const fund         = details.source_of_fund    || ticket.source_of_fund || ticket.sourceOfFund || 'N/A';
  const requestor    = details.end_user || details.requesting_personnel || ticket.requestedBy || ticket.requested_by || ticket.user_name || ticket.requester || 'N/A';
  const workingDays  = String(ticket.working_days || ticket.project_working_days || assignment.working_days || ticket.workingDays || 'N/A');
  const jobParticulars = (ticket.description || ticket.job_description || ticket.title || ticket.service_type || ticket.service || 'General maintenance and repair service.').trim();

  // Personnel extraction — supports assignments array, personnel array, or comma-separated name string
  let personnelNames = [];
  if (Array.isArray(ticket.assignments) && ticket.assignments.length > 0) {
    personnelNames = ticket.assignments.map(a => a.personnel_name || a.assigned_to_name || a.name).filter(Boolean);
  } else if (Array.isArray(ticket.personnel) && ticket.personnel.length > 0) {
    personnelNames = ticket.personnel.map(p => (typeof p === 'string' ? p : (p.name || p.personnel_name))).filter(Boolean);
  } else {
    const raw = assignment.personnel_name || ticket.assignedWorker || ticket.assignedDriver || ticket.assigned_worker || ticket.assigned_personnel || '';
    if (raw && typeof raw === 'string') {
      personnelNames = raw.split(/[,;\n]+/).map(n => n.trim()).filter(Boolean);
    }
  }

  personnelNames = Array.from(new Set(personnelNames)).filter(name => {
    const lower = String(name).toLowerCase().trim();
    return lower !== 'unassigned' && lower !== 'n/a' && lower !== 'none' && lower !== '';
  });

  const remarks = (feedback.remarks || ticket.remarks || '').trim() || 'Work completed satisfactorily.';

  return {
    ticketId:        String(ticket.ticketId || ticket.id || '0000').padStart(4, '0'),
    Date:            dateFiling,
    Building:        building,
    Room:            room,
    Fund:            fund,
    Requestor:       requestor,
    Working_days:    workingDays,
    Date_started:    dateStarted,
    Date_completed:  dateCompleted,
    Job_particulars: jobParticulars,
    Personnel_1:     personnelNames[0] || '',
    Personnel_2:     personnelNames[1] || '',
    Personnel_3:     personnelNames[2] || '',
    Personnel_4:     personnelNames[3] || '',
    Remarks:         remarks,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// pdfmake Document Definition Builder
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds the pdfmake docDefinition for the FGMU Job Request Form.
 * @param {Object} data   - Output of buildFgmuTemplateData()
 * @param {string} logoDataUrl - PNG data URL of the BSU logo
 * @returns {Object} pdfmake docDefinition
 */
const buildDocDefinition = (data, logoDataUrl) => {
  /** Helper: a labeled underlined field row */
  const fieldRow = (label, value) => [
    { text: label, bold: true, noWrap: true, border: [false, false, false, false], fontSize: 9, color: '#475569' },
    { text: value || '', border: [false, false, false, true], fontSize: 10, borderColor: ['', '', '', '#64748b'] },
  ];

  /** Helper: blank signature line */
  const signatureLine = (label, sublabel) => ({
    stack: [
      { text: ' ', fontSize: 28 }, // Signature space
      { canvas: [{ type: 'line', x1: 10, y1: 0, x2: 155, y2: 0, lineWidth: 0.8, lineColor: '#1e293b' }] },
      { text: label,    fontSize: 8,  bold: true,  alignment: 'center', margin: [0, 3, 0, 0], color: '#1e293b' },
      { text: sublabel, fontSize: 7.5, alignment: 'center', color: '#64748b' },
    ],
    margin: [0, 0, 0, 0],
  });

  return {
    pageSize:    'LETTER',
    pageMargins: [45, 130, 45, 55],

    // ── Repeating Header ──────────────────────────────────────────────────────
    header: (currentPage, pageCount) => ({
      margin: [45, 18, 45, 0],
      stack: [
        {
          columns: [
            {
              image: logoDataUrl,
              width:  56,
              height: 56,
              alignment: 'center',
              margin: [0, 0, 10, 0],
            },
            {
              stack: [
                { text: 'Republic of the Philippines',          fontSize: 8,    italics: true, color: '#64748b', alignment: 'center' },
                { text: 'BENGUET STATE UNIVERSITY',            fontSize: 13.5, bold: true,    alignment: 'center', color: '#0f172a' },
                { text: 'General Services Office',              fontSize: 10,   bold: true,    alignment: 'center', color: '#166534' },
                { text: 'Facilities & Grounds Maintenance Unit (FGMU)', fontSize: 8.5, alignment: 'center', color: '#334155' },
              ],
              alignment: 'center',
            },
          ],
          columnGap: 0,
        },
        { canvas: [{ type: 'line', x1: 0, y1: 8, x2: 522, y2: 8, lineWidth: 1.5, lineColor: '#0f172a' }] },
        {
          columns: [
            { text: 'JOB REQUEST FORM', fontSize: 11, bold: true, decoration: 'underline', alignment: 'left', margin: [0, 5, 0, 0] },
            { text: `Page ${currentPage} of ${pageCount}`, fontSize: 8, color: '#94a3b8', alignment: 'right', margin: [0, 7, 0, 0] },
          ],
        },
      ],
    }),

    // ── Footer ───────────────────────────────────────────────────────────────
    footer: () => ({
      margin: [45, 0, 45, 0],
      stack: [
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 522, y2: 0, lineWidth: 0.5, lineColor: '#cbd5e1' }] },
        { text: 'BSU General Services Office — FGMU Job Request Form  |  System-Generated Document', fontSize: 7, color: '#94a3b8', alignment: 'center', margin: [0, 4, 0, 0] },
      ],
    }),

    content: [

      // ── Request Metadata ──────────────────────────────────────────────────
      {
        columns: [
          { text: [{ text: 'Date Filed: ', bold: true, fontSize: 9, color: '#475569' }, { text: data.Date, fontSize: 10 }], width: '*' },
          { text: [{ text: 'Ticket No: ', bold: true, fontSize: 9, color: '#475569' }, { text: `TIC-FGMU-${data.ticketId}`, fontSize: 10, bold: true }], width: 'auto', alignment: 'right' },
        ],
        margin: [0, 0, 0, 6],
      },

      // ── Field Grid ────────────────────────────────────────────────────────
      {
        table: {
          widths: ['auto', '*', 'auto', '*'],
          body: [
            fieldRow('Building / Location:', data.Building, 'Office / Room:', data.Room),
            fieldRow('Office / Room:', data.Room, 'Fund Source:', data.Fund),
          ],
        },
        layout: {
          hLineWidth: () => 0,
          vLineWidth: () => 0,
          hLineColor: () => '#cbd5e1',
          paddingLeft:   () => 0,
          paddingRight:  (i) => i === 1 ? 20 : 6,
          paddingTop:    () => 3,
          paddingBottom: () => 3,
        },
        margin: [0, 0, 0, 4],
      },
      {
        table: {
          widths: ['auto', '*', 'auto', '*'],
          body: [
            fieldRow('Requested by:', data.Requestor, 'Fund Source:', data.Fund),
          ],
        },
        layout: {
          hLineWidth: () => 0,
          vLineWidth: () => 0,
          paddingLeft:   () => 0,
          paddingRight:  (i) => i === 1 ? 20 : 6,
          paddingTop:    () => 3,
          paddingBottom: () => 3,
        },
        margin: [0, 0, 0, 10],
      },

      // ── Job Particulars ───────────────────────────────────────────────────
      { text: 'Job Particulars / Description of Work:', bold: true, fontSize: 9, color: '#475569', margin: [0, 0, 0, 3] },
      {
        table: {
          widths: ['*'],
          body: [[{ text: data.Job_particulars, fontSize: 10, minHeight: 55, border: [true, true, true, true], borderColor: ['#cbd5e1', '#cbd5e1', '#cbd5e1', '#cbd5e1'] }]],
        },
        layout: { paddingLeft: () => 8, paddingRight: () => 8, paddingTop: () => 6, paddingBottom: () => 6 },
        margin: [0, 0, 0, 12],
      },

      // ── Personnel Assigned ────────────────────────────────────────────────
      { text: 'Personnel Assigned:', bold: true, fontSize: 9, color: '#475569', margin: [0, 0, 0, 4] },
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              { text: data.Personnel_1 || '________________________', border: [false, false, false, true], fontSize: 10, borderColor: ['', '', '', '#64748b'], margin: [0, 0, 20, 0] },
              { text: data.Personnel_2 || '________________________', border: [false, false, false, true], fontSize: 10, borderColor: ['', '', '', '#64748b'] },
            ],
            [
              { text: data.Personnel_3 || '________________________', border: [false, false, false, true], fontSize: 10, borderColor: ['', '', '', '#64748b'], margin: [0, 4, 20, 0] },
              { text: data.Personnel_4 || '________________________', border: [false, false, false, true], fontSize: 10, borderColor: ['', '', '', '#64748b'], margin: [0, 4, 0, 0] },
            ],
          ],
        },
        layout: { hLineWidth: () => 0, vLineWidth: () => 0, paddingLeft: () => 0, paddingRight: () => 0, paddingTop: () => 2, paddingBottom: () => 2 },
        margin: [0, 0, 0, 12],
      },

      // ── Implementation Schedule ───────────────────────────────────────────
      {
        table: {
          widths: ['auto', '*', 'auto', '*', 'auto', '*'],
          body: [
            [
              { text: 'Date Started:', bold: true, fontSize: 9, color: '#475569', border: [false, false, false, false] },
              { text: data.Date_started || 'N/A',      border: [false, false, false, true], fontSize: 10, borderColor: ['', '', '', '#64748b'] },
              { text: 'Date Completed:', bold: true, fontSize: 9, color: '#475569', border: [false, false, false, false], margin: [12, 0, 0, 0] },
              { text: data.Date_completed || 'N/A',    border: [false, false, false, true], fontSize: 10, borderColor: ['', '', '', '#64748b'] },
              { text: 'Working Days:', bold: true, fontSize: 9, color: '#475569', border: [false, false, false, false], margin: [12, 0, 0, 0] },
              { text: data.Working_days || 'N/A',      border: [false, false, false, true], fontSize: 10, borderColor: ['', '', '', '#64748b'] },
            ],
          ],
        },
        layout: { hLineWidth: () => 0, vLineWidth: () => 0, paddingLeft: () => 0, paddingRight: () => 4, paddingTop: () => 3, paddingBottom: () => 3 },
        margin: [0, 0, 0, 12],
      },

      // ── Remarks ───────────────────────────────────────────────────────────
      { text: 'Remarks / Observations:', bold: true, fontSize: 9, color: '#475569', margin: [0, 0, 0, 3] },
      {
        table: {
          widths: ['*'],
          body: [[{ text: data.Remarks, fontSize: 10, minHeight: 40, border: [true, true, true, true], borderColor: ['#cbd5e1', '#cbd5e1', '#cbd5e1', '#cbd5e1'] }]],
        },
        layout: { paddingLeft: () => 8, paddingRight: () => 8, paddingTop: () => 6, paddingBottom: () => 6 },
        margin: [0, 0, 0, 28],
      },

      // ── Signature Block ───────────────────────────────────────────────────
      {
        columns: [
          signatureLine('Requesting Party', 'End-User / Department Representative'),
          signatureLine('FGMU Dispatcher / In-Charge', 'GSO-FGMU Staff'),
          signatureLine('GSO Director / Authorized Rep.', 'Office of the GSO Director'),
        ],
        columnGap: 20,
      },
    ],

    // ── Typography & Colors ───────────────────────────────────────────────────
    defaultStyle: {
      fontSize:   10,
      lineHeight: 1.35,
      color:      '#0f172a',
    },
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/** Cache the logo PNG data URL so we only encode once per session. */
let cachedLogoDataUrl = null;

async function getLogoDataUrl() {
  if (!cachedLogoDataUrl) {
    cachedLogoDataUrl = await loadImageAsPngDataUrl('/bsu-logo.png');
  }
  return cachedLogoDataUrl;
}

/**
 * Generates the FGMU Job Request Form as a PDF Blob.
 * @param {Object} ticket
 * @param {Object|null} feedbackData
 * @returns {Promise<Blob>}
 */
export const generateFgmuJobRequestFormBlob = async (ticket, feedbackData = null) => {
  const [pdfMake, data, logoDataUrl] = await Promise.all([
    getPdfMake(),
    buildFgmuTemplateData(ticket, feedbackData),
    getLogoDataUrl(),
  ]);

  return new Promise((resolve, reject) => {
    try {
      const docDef = buildDocDefinition(data, logoDataUrl);
      pdfMake.createPdf(docDef).getBlob(blob => resolve(blob));
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Triggers a browser PDF download for the FGMU Job Request Form.
 * @param {Object} ticket
 * @param {Object|null} feedbackData
 */
export const downloadFgmuJobRequestForm = async (ticket, feedbackData = null) => {
  const ticketId = ticket.ticketId || ticket.id || 'document';
  const [pdfMake, data, logoDataUrl] = await Promise.all([
    getPdfMake(),
    buildFgmuTemplateData(ticket, feedbackData),
    getLogoDataUrl(),
  ]);
  const docDef  = buildDocDefinition(data, logoDataUrl);
  const filename = `FGMU Job Request Form - #${ticketId}.pdf`;
  pdfMake.createPdf(docDef).download(filename);
};

/**
 * Generates the PDF and uploads it to the backend as a ticket attachment.
 * @param {Object} ticket
 * @param {Object|null} feedbackData
 * @returns {Promise<Object>} API response
 */
export const attachFgmuJobRequestForm = async (ticket, feedbackData = null) => {
  const ticketId = ticket.ticketId || ticket.id;
  if (!ticketId) throw new Error('Ticket ID is required to attach document.');

  const pdfBlob = await generateFgmuJobRequestFormBlob(ticket, feedbackData);
  const fileName = `FGMU Job Request Form - #${ticketId}.pdf`;

  const formData = new FormData();
  formData.append('attachments[]', pdfBlob, fileName);

  return await api.post(`tickets/${ticketId}/attachments`, formData, {
    headers: { 'Content-Type': undefined },
  });
};
