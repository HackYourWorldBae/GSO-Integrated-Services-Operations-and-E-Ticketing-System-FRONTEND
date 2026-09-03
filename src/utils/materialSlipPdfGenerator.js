/**
 * materialSlipPdfGenerator.js
 *
 * Generates Official Material Issuance Slips (Receipt of Materials Used) as PDF
 * using pdfmake in the browser — zero third-party APIs, zero server dependency.
 *
 * Supports both FGMU and LEAU units with BSU institutional branding,
 * itemized material table breakdown, pricing, notes, and 3-tier signature block.
 */

import api from '@/api/client';
import { loadImageAsPngDataUrl } from '@/utils/imageUtils';
import { getPdfMake } from '@/utils/pdfmakeInit';


let cachedLogoDataUrl = null;

async function getLogoDataUrl() {
  if (!cachedLogoDataUrl) {
    cachedLogoDataUrl = await loadImageAsPngDataUrl('/bsu-logo.png');
  }
  return cachedLogoDataUrl;
}

/**
 * Format a Date object or string.
 */
export const formatDocDate = (dateVal) => {
  if (!dateVal) return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const parsed = new Date(typeof dateVal === 'string' ? dateVal.replace(' ', 'T') : dateVal);
  if (isNaN(parsed.getTime())) return String(dateVal);
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format numeric currency (₱).
 */
const formatCurrency = (val) => {
  return Number(val || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Builds the data model for the Material Receipt PDF.
 */
export const buildMaterialSlipData = (ticket = {}) => {
  const details    = ticket.details    || {};
  const assignment = ticket.assignment || {};
  const feedback   = ticket.feedback   || {};

  const unitCode = (ticket.unit_id === 2 || ticket.unit_code === 'LEAU' || ticket.unit === 'LEAU') ? 'LEAU' : 'FGMU';
  const unitFullName = unitCode === 'LEAU'
    ? 'Landscaping & Environmental Aesthetics Unit (LEAU)'
    : 'Facilities & Grounds Maintenance Unit (FGMU)';

  const ticketId = String(ticket.ticketId || ticket.id || '0000').padStart(4, '0');
  const dateCompleted = formatDocDate(ticket.completed_at || ticket.updated_at || new Date());

  const serviceCategory = ticket.title || ticket.service_type || ticket.service || 'General Maintenance Service';
  const requester = details.end_user || details.requesting_personnel || ticket.requestedBy || ticket.requested_by || ticket.user_name || ticket.requester || 'End User';
  const location = `${details.college_building || ticket.location || details.location || ticket.college_building || 'Main Campus'}${details.office_room || ticket.office_room ? ' • ' + (details.office_room || ticket.office_room) : ''}`;

  // Personnel extraction
  let personnelNames = [];
  if (Array.isArray(ticket.assignments) && ticket.assignments.length > 0) {
    personnelNames = ticket.assignments.map(a => a.personnel_name || a.assigned_to_name || a.name).filter(Boolean);
  } else if (Array.isArray(ticket.personnel) && ticket.personnel.length > 0) {
    personnelNames = ticket.personnel.map(p => (typeof p === 'string' ? p : (p.name || p.personnel_name))).filter(Boolean);
  } else {
    const raw = assignment.personnel_name || ticket.assignedWorker || ticket.assigned_worker || ticket.assigned_personnel || '';
    if (raw && typeof raw === 'string') {
      personnelNames = raw.split(/[,;\n]+/).map(n => n.trim()).filter(Boolean);
    }
  }

  personnelNames = Array.from(new Set(personnelNames)).filter(name => {
    const lower = String(name).toLowerCase().trim();
    return lower !== 'unassigned' && lower !== 'n/a' && lower !== 'none' && lower !== '';
  });

  const personnelDisplay = personnelNames.length > 0 ? personnelNames.join(', ') : 'Assigned Technical Personnel';

  // Materials list
  const rawMaterials = Array.isArray(ticket.materials) ? ticket.materials : [];
  const materialsList = rawMaterials.map(m => {
    const qty = parseFloat(m.quantity) || 0;
    const price = parseFloat(m.unit_price) || 0;
    const total = m.total_price !== undefined ? parseFloat(m.total_price) : (qty * price);
    return {
      name: m.material_name || m.name || 'Material Item',
      quantity: qty,
      unit: m.unit_measurement || m.unit || 'pcs',
      unitPrice: price,
      totalPrice: total,
    };
  });

  const totalCost = ticket.total_material_cost !== undefined
    ? Number(ticket.total_material_cost || 0)
    : materialsList.reduce((sum, item) => sum + item.totalPrice, 0);

  const notes = (assignment.dispatcher_notes || ticket.project_remarks || feedback.remarks || '').trim();

  return {
    ticketId,
    unitCode,
    unitFullName,
    dateCompleted,
    serviceCategory,
    requester,
    location,
    personnelDisplay,
    materialsList,
    totalCost,
    notes,
  };
};

/**
 * Builds the pdfmake docDefinition for the Official Material Issuance Slip.
 */
const buildMaterialSlipDocDefinition = (data, logoDataUrl) => {
  // Build table rows for materials
  const tableBody = [
    [
      { text: '#', style: 'tableHeader', alignment: 'center', width: 25 },
      { text: 'Material / Item Description', style: 'tableHeader', alignment: 'left' },
      { text: 'Quantity', style: 'tableHeader', alignment: 'center', width: 55 },
      { text: 'Unit', style: 'tableHeader', alignment: 'center', width: 45 },
      { text: 'Unit Price (₱)', style: 'tableHeader', alignment: 'right', width: 80 },
      { text: 'Amount (₱)', style: 'tableHeader', alignment: 'right', width: 90 },
    ],
  ];

  if (data.materialsList.length === 0) {
    tableBody.push([
      {
        text: 'Labor & Maintenance Service Only — No university stock materials or supplies were consumed for this ticket.',
        colSpan: 6,
        alignment: 'center',
        italics: true,
        color: '#64748b',
        fontSize: 9,
        margin: [0, 12, 0, 12],
      },
      {}, {}, {}, {}, {},
    ]);
  } else {
    data.materialsList.forEach((item, idx) => {
      tableBody.push([
        { text: String(idx + 1), alignment: 'center', color: '#64748b', fontSize: 9 },
        { text: item.name, bold: true, fontSize: 9.5, color: '#0f172a' },
        { text: String(item.quantity), alignment: 'center', bold: true, fontSize: 9.5 },
        { text: item.unit.toLowerCase(), alignment: 'center', color: '#475569', fontSize: 9 },
        { text: `₱${formatCurrency(item.unitPrice)}`, alignment: 'right', fontSize: 9 },
        { text: `₱${formatCurrency(item.totalPrice)}`, alignment: 'right', bold: true, fontSize: 9.5, color: '#0f172a' },
      ]);
    });
  }

  // Total Row
  tableBody.push([
    { text: 'TOTAL MATERIAL COST:', colSpan: 4, alignment: 'right', bold: true, fontSize: 10, color: '#064e3b', fillColor: '#ecfdf5' },
    {}, {}, {},
    { text: `₱${formatCurrency(data.totalCost)}`, colSpan: 2, alignment: 'right', bold: true, fontSize: 11, color: '#064e3b', fillColor: '#ecfdf5' },
    {},
  ]);

  return {
    pageSize: 'LETTER',
    pageMargins: [40, 130, 40, 55],

    // ── Repeating Page Header ──────────────────────────────────────────────
    header: (currentPage, pageCount) => ({
      margin: [40, 18, 40, 0],
      stack: [
        {
          columns: [
            {
              image: logoDataUrl,
              width: 54,
              height: 54,
              alignment: 'center',
              margin: [0, 0, 8, 0],
            },
            {
              stack: [
                { text: 'Republic of the Philippines', fontSize: 8, italics: true, color: '#64748b', alignment: 'center' },
                { text: 'BENGUET STATE UNIVERSITY', fontSize: 13.5, bold: true, alignment: 'center', color: '#0f172a' },
                { text: 'General Services Office (GSO)', fontSize: 10, bold: true, alignment: 'center', color: '#166534' },
                { text: data.unitFullName, fontSize: 8.5, alignment: 'center', color: '#334155' },
              ],
              alignment: 'center',
            },
          ],
          columnGap: 0,
        },
        { canvas: [{ type: 'line', x1: 0, y1: 8, x2: 532, y2: 8, lineWidth: 1.5, lineColor: '#0f172a' }] },
        {
          columns: [
            {
              text: 'RECEIPT OF MATERIALS USED & SERVICE COMPLETION',
              fontSize: 10,
              bold: true,
              color: '#0f172a',
              margin: [0, 6, 0, 0],
            },
            {
              text: `Slip Ref: REC-#${data.ticketId}  |  Page ${currentPage} of ${pageCount}`,
              fontSize: 8.5,
              bold: true,
              color: '#166534',
              alignment: 'right',
              margin: [0, 6, 0, 0],
            },
          ],
        },
      ],
    }),

    // ── Footer ─────────────────────────────────────────────────────────────
    footer: () => ({
      margin: [40, 0, 40, 0],
      stack: [
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 532, y2: 0, lineWidth: 0.5, lineColor: '#cbd5e1' }] },
        {
          text: `BSU General Services Office — ${data.unitCode} Material Issuance Slip  |  System-Generated Document`,
          fontSize: 7.5,
          color: '#94a3b8',
          alignment: 'center',
          margin: [0, 4, 0, 0],
        },
      ],
    }),

    content: [
      // ── Ticket Metadata Summary Card ──────────────────────────────────────
      {
        table: {
          widths: ['25%', '25%', '25%', '25%'],
          body: [
            [
              { stack: [{ text: 'TICKET NUMBER', style: 'metaLabel' }, { text: `#${data.ticketId}`, style: 'metaValueBold' }] },
              { stack: [{ text: 'SERVICE CATEGORY', style: 'metaLabel' }, { text: data.serviceCategory, style: 'metaValue' }] },
              { stack: [{ text: 'REQUESTING END-USER', style: 'metaLabel' }, { text: data.requester, style: 'metaValue' }] },
              { stack: [{ text: 'DATE COMPLETED', style: 'metaLabel' }, { text: data.dateCompleted, style: 'metaValue' }] },
            ],
            [
              { stack: [{ text: 'LOCATION / OFFICE / ROOM', style: 'metaLabel' }, { text: data.location, style: 'metaValue' }], colSpan: 2 },
              {},
              { stack: [{ text: 'ASSIGNED PERSONNEL', style: 'metaLabel' }, { text: data.personnelDisplay, style: 'metaValue' }], colSpan: 2 },
              {},
            ],
          ],
        },
        layout: {
          fillColor: () => '#f8fafc',
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

      // ── Section Title ────────────────────────────────────────────────────
      {
        text: 'ISSUED & CONSUMED MATERIALS BREAKDOWN',
        fontSize: 9.5,
        bold: true,
        color: '#1e293b',
        margin: [0, 0, 0, 6],
      },

      // ── Materials Table ──────────────────────────────────────────────────
      {
        table: {
          headerRows: 1,
          widths: [25, '*', 55, 45, 80, 90],
          body: tableBody,
        },
        layout: {
          hLineWidth: (i, node) => (i === 0 || i === 1 || i === node.table.body.length - 1 || i === node.table.body.length) ? 1 : 0.5,
          vLineWidth: () => 0,
          hLineColor: (i, node) => (i === 1 || i === node.table.body.length - 1) ? '#0f172a' : '#e2e8f0',
          paddingLeft: () => 6,
          paddingRight: () => 6,
          paddingTop: () => 6,
          paddingBottom: () => 6,
        },
        margin: [0, 0, 0, 14],
      },

      // ── Notes / Observations (if any) ────────────────────────────────────
      ...(data.notes ? [
        {
          stack: [
            { text: 'DISPATCHER NOTES / FIELD OBSERVATIONS', fontSize: 8.5, bold: true, color: '#475569', margin: [0, 0, 0, 3] },
            {
              table: {
                widths: ['*'],
                body: [[{ text: `"${data.notes}"`, italics: true, fontSize: 9, color: '#334155' }]],
              },
              layout: {
                fillColor: () => '#f8fafc',
                hLineWidth: () => 0.5,
                vLineWidth: () => 0.5,
                hLineColor: () => '#e2e8f0',
                vLineColor: () => '#e2e8f0',
                paddingLeft: () => 8,
                paddingRight: () => 8,
                paddingTop: () => 6,
                paddingBottom: () => 6,
              },
            },
          ],
          margin: [0, 0, 0, 20],
        },
      ] : [{ text: ' ', margin: [0, 0, 0, 16] }]),

      // ── Signatures & Accountability Section ───────────────────────────────
      {
        columns: [
          {
            stack: [
              { text: 'Dispatched & Liquidated By:', fontSize: 8, color: '#64748b', bold: true, alignment: 'center' },
              { text: ' ', fontSize: 24 },
              { canvas: [{ type: 'line', x1: 5, y1: 0, x2: 155, y2: 0, lineWidth: 0.8, lineColor: '#1e293b' }] },
              { text: `${data.unitCode} Dispatcher`, fontSize: 8.5, bold: true, alignment: 'center', margin: [0, 3, 0, 0] },
              { text: 'GSO Dispatch In-Charge', fontSize: 7.5, color: '#64748b', alignment: 'center' },
            ],
          },
          {
            stack: [
              { text: 'Accomplished & Performed By:', fontSize: 8, color: '#64748b', bold: true, alignment: 'center' },
              { text: ' ', fontSize: 24 },
              { canvas: [{ type: 'line', x1: 5, y1: 0, x2: 155, y2: 0, lineWidth: 0.8, lineColor: '#1e293b' }] },
              { text: data.personnelDisplay, fontSize: 8.5, bold: true, alignment: 'center', margin: [0, 3, 0, 0] },
              { text: 'Technical & Maintenance Personnel', fontSize: 7.5, color: '#64748b', alignment: 'center' },
            ],
          },
          {
            stack: [
              { text: 'Received & Verified By:', fontSize: 8, color: '#64748b', bold: true, alignment: 'center' },
              { text: ' ', fontSize: 24 },
              { canvas: [{ type: 'line', x1: 5, y1: 0, x2: 155, y2: 0, lineWidth: 0.8, lineColor: '#1e293b' }] },
              { text: data.requester, fontSize: 8.5, bold: true, alignment: 'center', margin: [0, 3, 0, 0] },
              { text: 'Requesting End-User / Representative', fontSize: 7.5, color: '#64748b', alignment: 'center' },
            ],
          },
        ],
        columnGap: 18,
      },
    ],

    styles: {
      tableHeader: {
        fontSize: 8.5,
        bold: true,
        color: '#334155',
        fillColor: '#f1f5f9',
      },
      metaLabel: {
        fontSize: 7,
        bold: true,
        color: '#64748b',
        margin: [0, 0, 0, 1],
      },
      metaValue: {
        fontSize: 8.5,
        color: '#0f172a',
      },
      metaValueBold: {
        fontSize: 9.5,
        bold: true,
        color: '#0f172a',
      },
    },

    defaultStyle: {
      fontSize: 9.5,
      lineHeight: 1.3,
      color: '#0f172a',
    },
  };
};

/**
 * Generates the Official Material Issuance Slip as a PDF Blob.
 * @param {Object} ticket
 * @returns {Promise<Blob>}
 */
export const generateMaterialSlipPdfBlob = async (ticket) => {
  const [pdfMake, logoDataUrl] = await Promise.all([
    getPdfMake(),
    getLogoDataUrl(),
  ]);

  const data = buildMaterialSlipData(ticket);

  return new Promise((resolve, reject) => {
    try {
      const docDef = buildMaterialSlipDocDefinition(data, logoDataUrl);
      pdfMake.createPdf(docDef).getBlob(blob => resolve(blob));
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Triggers a browser PDF download for the Official Material Issuance Slip.
 * @param {Object} ticket
 */
export const downloadMaterialSlipPdf = async (ticket) => {
  const ticketId = ticket.ticketId || ticket.id || 'slip';
  const [pdfMake, logoDataUrl] = await Promise.all([
    getPdfMake(),
    getLogoDataUrl(),
  ]);
  const data = buildMaterialSlipData(ticket);
  const docDef = buildMaterialSlipDocDefinition(data, logoDataUrl);
  const filename = `Material Issuance Slip - #${ticketId}.pdf`;
  pdfMake.createPdf(docDef).download(filename);
};

/**
 * Opens the Material Issuance Slip PDF in a new browser tab.
 * @param {Object} ticket
 */
export const openMaterialSlipPdfInNewTab = async (ticket) => {
  const blob = await generateMaterialSlipPdfBlob(ticket);
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
