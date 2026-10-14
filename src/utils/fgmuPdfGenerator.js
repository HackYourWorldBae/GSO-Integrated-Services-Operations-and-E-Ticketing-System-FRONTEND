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
import { getPdfMake } from '@/utils/pdfmakeInit';
import { generateDocx } from '@/utils/docxGenerator';
import {
  buildFgmuTemplateData,
  generateFgmuJobRequestFormDocxBlob,
  formatDocDate,
} from '@/utils/fgmuDocxGenerator';
import { fetchDocumentSignatures } from '@/utils/signatureUtils';

export { buildFgmuTemplateData, generateFgmuJobRequestFormDocxBlob, formatDocDate };

// ─────────────────────────────────────────────────────────────────────────────
// pdfmake Document Definition Builder
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds the pdfmake docDefinition for the Job Request Form.
 * @param {Object} data   - Output of buildFgmuTemplateData()
 * @param {string} logoDataUrl - PNG data URL of the BSU logo
 * @param {Object} [signaturesMeta={}] - Official names of signees
 * @param {Object} [signatureImages={}] - PNG data URLs of digital signatures
 * @returns {Object} pdfmake docDefinition
 */
const buildDocDefinition = (data, logoDataUrl, signaturesMeta = {}, signatureImages = {}) => {
  /** Helper: a labeled underlined 4-cell field row */
  const fieldRow = (label1, value1, label2 = '', value2 = '') => [
    { text: label1, bold: true, noWrap: true, border: [false, false, false, false], fontSize: 9, color: '#475569' },
    { text: value1 || '', border: [false, false, false, true], fontSize: 10, borderColor: ['', '', '', '#64748b'] },
    { text: label2, bold: true, noWrap: true, border: [false, false, false, false], fontSize: 9, color: '#475569', margin: [15, 0, 0, 0] },
    { text: value2 || '', border: [false, false, false, true], fontSize: 10, borderColor: ['', '', '', '#64748b'] },
  ];

  /** Helper: signature line with optional digital signature image */
  const signatureLine = (label, sublabel, signatureImage = null, signeeName = null) => {
    const items = [];
    if (signatureImage) {
      items.push({
        image: signatureImage,
        fit: [120, 36],
        alignment: 'center',
        margin: [0, -10, 0, 4],
      });
    } else {
      items.push({ text: ' ', fontSize: 28 }); // Blank space for manual signing
    }

    items.push({ canvas: [{ type: 'line', x1: 10, y1: 0, x2: 155, y2: 0, lineWidth: 0.8, lineColor: '#1e293b' }] });

    if (signeeName) {
      items.push({ text: signeeName.toUpperCase(), fontSize: 8.5, bold: true, alignment: 'center', margin: [0, 3, 0, 0], color: '#0f172a' });
      items.push({ text: label, fontSize: 7.5, bold: true, alignment: 'center', color: '#475569' });
    } else {
      items.push({ text: label, fontSize: 8, bold: true, alignment: 'center', margin: [0, 3, 0, 0], color: '#1e293b' });
    }

    items.push({ text: sublabel, fontSize: 7, alignment: 'center', color: '#64748b' });

    return {
      stack: items,
      margin: [0, 0, 0, 0],
    };
  };

  return {
    pageSize:    'LETTER',
    pageMargins: [45, 130, 45, 55],

    // ── Repeating Header ──────────────────────────────────────────────────────
    header: (currentPage, pageCount) => ({
      margin: [45, 18, 45, 0],
      stack: [
        {
          columns: [
            logoDataUrl
              ? {
                  image: logoDataUrl,
                  width:  56,
                  height: 56,
                  alignment: 'center',
                  margin: [0, 0, 10, 0],
                }
              : { text: '', width: 56, margin: [0, 0, 10, 0] },
            {
              stack: [
                { text: 'Republic of the Philippines',          fontSize: 8,    italics: true, color: '#64748b', alignment: 'center' },
                { text: 'BENGUET STATE UNIVERSITY',            fontSize: 13.5, bold: true,    alignment: 'center', color: '#0f172a' },
                { text: 'General Services Office',              fontSize: 10,   bold: true,    alignment: 'center', color: '#166534' },
                { text: data.unitFullName,                      fontSize: 8.5, alignment: 'center', color: '#334155' },
              ],
              alignment: 'center',
            },
          ],
          columnGap: 0,
        },
        { canvas: [{ type: 'line', x1: 0, y1: 8, x2: 522, y2: 8, lineWidth: 1.5, lineColor: '#0f172a' }] },
        {
          columns: [
            { text: 'JOB REQUEST / WORK ORDER', fontSize: 11, bold: true, decoration: 'underline', alignment: 'left', margin: [0, 5, 0, 0] },
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
        { text: `BSU General Services Office — ${data.unitCode} Job Order / Request Form  |  System-Generated Document`, fontSize: 7, color: '#94a3b8', alignment: 'center', margin: [0, 4, 0, 0] },
      ],
    }),

    content: [

      // ── Request Metadata ──────────────────────────────────────────────────
      {
        columns: [
          { text: [{ text: 'Date Filed: ', bold: true, fontSize: 9, color: '#475569' }, { text: data.Date, fontSize: 10 }], width: '*' },
          { text: [{ text: 'Ticket No: ', bold: true, fontSize: 9, color: '#475569' }, { text: data.ticketRef.startsWith('#') ? data.ticketRef : `#${data.ticketRef}`, fontSize: 10, bold: true }], width: 'auto', alignment: 'right' },
        ],
        margin: [0, 0, 0, 6],
      },

      // ── Field Grid ────────────────────────────────────────────────────────
      {
        table: {
          widths: ['auto', '*', 'auto', '*'],
          body: [
            fieldRow('Building / Location:', data.Building, 'Office / Room:', data.Room),
            fieldRow('Requested by:', data.Requestor, 'Fund Source:', data.Fund),
          ],
        },
        layout: {
          hLineWidth: () => 0,
          vLineWidth: () => 0,
          hLineColor: () => '#cbd5e1',
          paddingLeft:   () => 0,
          paddingRight:  (i) => (i === 1 ? 20 : 6),
          paddingTop:    () => 4,
          paddingBottom: () => 4,
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
              { text: data.Date_completed || '—',      border: [false, false, false, true], fontSize: 10, borderColor: ['', '', '', '#64748b'] },
              { text: 'Working Days:', bold: true, fontSize: 9, color: '#475569', border: [false, false, false, false], margin: [12, 0, 0, 0] },
              { text: data.Working_days || 'N/A',      border: [false, false, false, true], fontSize: 10, borderColor: ['', '', '', '#64748b'] },
            ],
          ],
        },
        layout: { hLineWidth: () => 0, vLineWidth: () => 0, paddingLeft: () => 0, paddingRight: () => 4, paddingTop: () => 3, paddingBottom: () => 3 },
        margin: [0, 0, 0, 12],
      },

      // ── Remarks ───────────────────────────────────────────────────────────
      { text: 'Remarks / Observations / Instructions:', bold: true, fontSize: 9, color: '#475569', margin: [0, 0, 0, 3] },
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
          signatureLine(
            'Requesting Party',
            'End-User / Authorized Representative',
            null,
            data.Requestor
          ),
          signatureLine(
            `GSO-${data.UnitAndRole || data['Unit&Role'] || 'Director'}`,
            data.Approval_Date ? `Approved: ${data.Approval_Date}` : 'Approved by',
            signatureImages.approver || signatureImages.director || null,
            data.Approved_by || signaturesMeta?.director?.name || null
          ),
          signatureLine(
            `GSO-${data.Unit || data.unitCode} Head`,
            'JR Issued by (Dispatch In-Charge)',
            signatureImages.issuer || signatureImages.dispatcher || null,
            data.Issued_by || signaturesMeta?.dispatcher?.name || null
          ),
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
    try {
      cachedLogoDataUrl = await loadImageAsPngDataUrl('/bsu-logo.png');
    } catch (err) {
      console.warn('Could not load logo for Job Order PDF:', err);
      cachedLogoDataUrl = null;
    }
  }
  return cachedLogoDataUrl;
}

/** Helper to resolve signature images for PDF generator */
async function resolveSignatureImages(ticket, data, signaturesMeta) {
  const t = ticket.ticket || ticket || {};
  const signatureImages = {};
  const revUser = t.reviewed_by_user || null;
  const dispUser = t.dispatched_by_user || null;

  // 1. Approver Signature
  const isDirectorApprover = (revUser?.role === 'director')
    || (t.reviewer_role === 'director')
    || (!revUser && !t.reviewer_name && !!signaturesMeta?.director);

  const approverSigUrl = revUser?.signature_url
    || (isDirectorApprover ? signaturesMeta?.director?.signature_url : signaturesMeta?.dispatcher?.signature_url)
    || (signaturesMeta?.director?.signature_url || null);

  if (approverSigUrl && data.Approved_by) {
    try {
      signatureImages.approver = await loadImageAsPngDataUrl(approverSigUrl);
    } catch (e) {
      console.warn('Could not load approver signature for PDF:', e);
    }
  }

  // 2. Issuer Signature
  const issuerSigUrl = dispUser?.signature_url
    || signaturesMeta?.dispatcher?.signature_url
    || (dispUser?.role === 'director' ? (signaturesMeta?.director?.signature_url || null) : null);

  if (issuerSigUrl && data.Issued_by) {
    try {
      signatureImages.issuer = await loadImageAsPngDataUrl(issuerSigUrl);
    } catch (e) {
      console.warn('Could not load issuer signature for PDF:', e);
    }
  }

  return signatureImages;
}

/**
 * Generates the FGMU Job Request Form as a PDF Blob.
 * @param {Object} ticket
 * @param {Object|null} feedbackData
 * @returns {Promise<Blob>}
 */
export const generateFgmuJobRequestFormBlob = async (ticket, feedbackData = null) => {
  const t = ticket.ticket || ticket || {};
  const isLeau = t.unit_code === 'LEAU' || t.unit === 'LEAU' || t.unit_id === 2 || (typeof t.id === 'string' && t.id.includes('LEAU'));
  const unitCode = isLeau ? 'LEAU' : 'FGMU';

  const [pdfMake, logoDataUrl, signaturesMeta] = await Promise.all([
    getPdfMake(),
    getLogoDataUrl().catch(() => null),
    fetchDocumentSignatures(unitCode).catch(() => ({ director: null, dispatcher: null })),
  ]);

  const data = buildFgmuTemplateData(t, feedbackData, signaturesMeta);
  const signatureImages = await resolveSignatureImages(t, data, signaturesMeta);

  const docDef = buildDocDefinition(data, logoDataUrl, signaturesMeta, signatureImages);
  const pdfDoc = pdfMake.createPdf(docDef);

  if (typeof pdfDoc.getBlob === 'function') {
    const result = pdfDoc.getBlob();
    if (result && typeof result.then === 'function') {
      return await result;
    }
  }

  return new Promise((resolve, reject) => {
    try {
      pdfDoc.getBlob(blob => resolve(blob));
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
  const t = ticket.ticket || ticket || {};
  const ticketId = t.ticketId || t.id || 'document';
  const isLeau = t.unit_code === 'LEAU' || t.unit === 'LEAU' || t.unit_id === 2 || (typeof t.id === 'string' && t.id.includes('LEAU'));
  const unitCode = isLeau ? 'LEAU' : 'FGMU';

  const [pdfMake, logoDataUrl, signaturesMeta] = await Promise.all([
    getPdfMake(),
    getLogoDataUrl().catch(() => null),
    fetchDocumentSignatures(unitCode).catch(() => ({ director: null, dispatcher: null })),
  ]);

  const data = buildFgmuTemplateData(t, feedbackData, signaturesMeta);
  const signatureImages = await resolveSignatureImages(t, data, signaturesMeta);

  const docDef  = buildDocDefinition(data, logoDataUrl, signaturesMeta, signatureImages);
  const filename = `${unitCode} Job Request Form - #${ticketId}.pdf`;
  pdfMake.createPdf(docDef).download(filename);
};

/**
 * Triggers a browser DOCX download for the FGMU Job Request Form.
 * @param {Object} ticket
 * @param {Object|null} feedbackData
 */
export const downloadFgmuJobRequestFormDocx = async (ticket, feedbackData = null) => {
  const t = ticket.ticket || ticket || {};
  const ticketId = t.ticketId || t.id || 'document';
  const blob = await generateFgmuJobRequestFormDocxBlob(t, feedbackData);
  const { saveAs } = await import('file-saver');
  saveAs(blob, `FGMU Job Request Form - #${ticketId}.docx`);
};

/**
 * Triggers browser print dialog for the FGMU/LEAU Job Request Form / Work Order.
 * @param {Object} ticket
 * @param {Object|null} feedbackData
 */
export const printFgmuJobRequestForm = async (ticket, feedbackData = null) => {
  const t = ticket.ticket || ticket || {};
  const isLeau = t.unit_code === 'LEAU' || t.unit === 'LEAU' || t.unit_id === 2 || (typeof t.id === 'string' && t.id.includes('LEAU'));
  const unitCode = isLeau ? 'LEAU' : 'FGMU';

  const [pdfMake, logoDataUrl, signaturesMeta] = await Promise.all([
    getPdfMake(),
    getLogoDataUrl().catch(() => null),
    fetchDocumentSignatures(unitCode).catch(() => ({ director: null, dispatcher: null })),
  ]);

  const data = buildFgmuTemplateData(t, feedbackData, signaturesMeta);
  const signatureImages = await resolveSignatureImages(t, data, signaturesMeta);

  const docDef = buildDocDefinition(data, logoDataUrl, signaturesMeta, signatureImages);
  pdfMake.createPdf(docDef).print();
};

/**
 * Opens the FGMU Job Request Form PDF in a new browser tab.
 * @param {Object} ticket
 * @param {Object|null} feedbackData
 */
export const openFgmuJobRequestFormInNewTab = async (ticket, feedbackData = null) => {
  const blob = await generateFgmuJobRequestFormBlob(ticket, feedbackData);
  const blobUrl = URL.createObjectURL(blob);
  const win = window.open(blobUrl, '_blank');
  if (!win) {
    const link = document.createElement('a');
    link.href = blobUrl;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};

/**
 * Generates BOTH the PDF and DOCX versions of the FGMU Job Request Form
 * and uploads both as permanent attachments to the ticket.
 * @param {Object} ticket
 * @param {Object|null} feedbackData
 * @returns {Promise<Object>} API response
 */
export const attachFgmuJobRequestForm = async (ticket, feedbackData = null) => {
  const t = ticket.ticket || ticket || {};
  const ticketId = t.ticketId || t.id;
  if (!ticketId) throw new Error('Ticket ID is required to attach document.');

  const docxBlob = await generateFgmuJobRequestFormDocxBlob(t, feedbackData);

  const formData = new FormData();
  formData.append('attachments[]', docxBlob, `FGMU Job Request Form - #${ticketId}.docx`);

  return await api.post(`tickets/${ticketId}/attachments`, formData, {
    headers: { 'Content-Type': undefined },
  });
};
