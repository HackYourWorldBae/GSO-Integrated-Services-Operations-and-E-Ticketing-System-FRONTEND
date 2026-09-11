/**
 * materialsReportPdfGenerator.js
 *
 * Generates Official Benguet State University (BSU) Executive Materials Consumption &
 * Resource Valuation Reports for the General Services Office (GSO) Director using pdfmake.
 *
 * Designed with a formal, prestigious, institutional layout:
 * - Republic of the Philippines & BSU Official Header with University Seal
 * - Document Control Number & Classification
 * - Executive Valuation Summary Blocks (Total Worth ₱, Units Consumed, FGMU & LEAU Shares)
 * - Complete Itemized Materials Table with Units of Measurement and Pricing
 * - Grand Total Row
 * - Tripartite Formal Sign-Off & Administrative Certification Block
 *
 * Exported function:
 *   downloadMaterialsReportPdf(reportData) -> triggers direct browser PDF download
 */

import { loadImageAsPngDataUrl } from '@/utils/imageUtils';
import { getPdfMake } from '@/utils/pdfmakeInit';

let cachedLogoDataUrl = null;

async function getLogoDataUrl() {
  if (!cachedLogoDataUrl) {
    try {
      cachedLogoDataUrl = await loadImageAsPngDataUrl('/bsu-logo.png');
    } catch (e) {
      console.warn('Failed to load BSU logo for Materials Report PDF:', e);
      cachedLogoDataUrl = null;
    }
  }
  return cachedLogoDataUrl;
}

/**
 * Format numeric currency (₱).
 */
export const formatCurrency = (val) => {
  return Number(val || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Format a Date object or string into human-readable form.
 */
export const formatReportDate = (dateVal) => {
  if (!dateVal) return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const parsed = new Date(typeof dateVal === 'string' ? dateVal.replace(' ', 'T') : dateVal);
  if (isNaN(parsed.getTime())) return String(dateVal);
  return parsed.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Builds a standardized institutional document control code.
 * e.g., BSU-GSO-MAT-2026-M09 or BSU-GSO-MAT-2026-Q03
 */
const buildDocumentControlNo = (filter = {}) => {
  const period = (filter.period || 'all').toUpperCase();
  const year = filter.year || new Date().getFullYear();
  if (period === 'MONTH') {
    const m = String(filter.month || new Date().getMonth() + 1).padStart(2, '0');
    return `BSU-GSO-MAT-${year}-M${m}`;
  }
  if (period === 'QUARTER') {
    const q = filter.quarter || Math.ceil((new Date().getMonth() + 1) / 3);
    return `BSU-GSO-MAT-${year}-Q0${q}`;
  }
  if (period === 'YEAR') {
    return `BSU-GSO-MAT-${year}-ANNUAL`;
  }
  return `BSU-GSO-MAT-${year}-ALLTIME`;
};

/**
 * Builds the complete pdfmake document definition for the Materials Report.
 */
export const buildMaterialsReportDocDefinition = (data, logoDataUrl) => {
  const filter = data.filter || {};
  const materialsSummary = data.materials_summary || {};
  const items = Array.isArray(materialsSummary.items) ? materialsSummary.items : [];
  const byUnit = materialsSummary.by_unit || {};

  const docControlNo = buildDocumentControlNo(filter);
  const periodLabel = filter.label || 'Consolidated Period';
  const directorName = data.director_name || 'Office of the Director, General Services Office';
  const totalWorth = Number(materialsSummary.total_worth || 0);
  const totalQty = Number(materialsSummary.total_quantity || 0);
  const totalRecords = items.length;

  const fgmuWorth = Number(byUnit.FGMU?.total_worth || 0);
  const leauWorth = Number(byUnit.LEAU?.total_worth || 0);

  // Build itemized table body
  const tableBody = [
    // Table Header Row
    [
      { text: '#', bold: true, fontSize: 8, color: '#111827', fillColor: '#e5e7eb', alignment: 'center' },
      { text: 'MATERIAL / ITEM DESCRIPTION', bold: true, fontSize: 8, color: '#111827', fillColor: '#e5e7eb' },
      { text: 'UNIT', bold: true, fontSize: 8, color: '#111827', fillColor: '#e5e7eb', alignment: 'center' },
      { text: 'QTY', bold: true, fontSize: 8, color: '#111827', fillColor: '#e5e7eb', alignment: 'center' },
      { text: 'UNIT PRICE (₱)', bold: true, fontSize: 8, color: '#111827', fillColor: '#e5e7eb', alignment: 'right' },
      { text: 'TOTAL WORTH (₱)', bold: true, fontSize: 8, color: '#111827', fillColor: '#e5e7eb', alignment: 'right' },
      { text: 'SUB-UNIT', bold: true, fontSize: 8, color: '#111827', fillColor: '#e5e7eb', alignment: 'center' },
      { text: 'TICKET REF', bold: true, fontSize: 8, color: '#111827', fillColor: '#e5e7eb', alignment: 'center' },
    ],
  ];

  if (items.length === 0) {
    tableBody.push([
      {
        text: 'No materials or consumable supplies were recorded or billed for the selected report period.',
        colSpan: 8,
        alignment: 'center',
        italics: true,
        color: '#6b7280',
        fontSize: 8.5,
        margin: [0, 14, 0, 14],
      },
      {}, {}, {}, {}, {}, {}, {},
    ]);
  } else {
    items.forEach((item, idx) => {
      const isEven = idx % 2 === 1;
      const rowBg = isEven ? '#f9fafb' : undefined;
      const unitCode = item.unit_code || 'FGMU';
      const unitBg = unitCode === 'LEAU' ? '#ecfdf5' : '#f1f5f9';
      const unitColor = unitCode === 'LEAU' ? '#047857' : '#1e293b';

      tableBody.push([
        { text: String(idx + 1), alignment: 'center', fontSize: 8, color: '#6b7280', fillColor: rowBg },
        {
          stack: [
            { text: item.material_name || 'Standard Consumable Item', bold: true, fontSize: 8.5, color: '#111827' },
            { text: item.ticket_title ? `Job: ${item.ticket_title}` : '', fontSize: 7, color: '#6b7280', margin: [0, 1, 0, 0] },
          ],
          fillColor: rowBg,
        },
        { text: (item.unit_measurement || 'pcs').toLowerCase(), alignment: 'center', fontSize: 8, color: '#4b5563', fillColor: rowBg },
        { text: String(item.quantity ?? 1), alignment: 'center', bold: true, fontSize: 8.5, color: '#111827', fillColor: rowBg },
        { text: `₱${formatCurrency(item.unit_price)}`, alignment: 'right', fontSize: 8, color: '#374151', fillColor: rowBg },
        { text: `₱${formatCurrency(item.total_price)}`, alignment: 'right', bold: true, fontSize: 8.5, color: '#111827', fillColor: rowBg },
        {
          text: unitCode,
          alignment: 'center',
          bold: true,
          fontSize: 7.5,
          color: unitColor,
          fillColor: unitBg,
        },
        { text: String(item.ticket_id || '—'), alignment: 'center', fontSize: 7.5, color: '#4b5563', fillColor: rowBg },
      ]);
    });
  }

  // Grand Total Row
  tableBody.push([
    {
      text: 'CONSOLIDATED MATERIALS VALUATION TOTAL:',
      colSpan: 5,
      alignment: 'right',
      bold: true,
      fontSize: 8.5,
      color: '#064e3b',
      fillColor: '#ecfdf5',
    },
    {}, {}, {}, {},
    {
      text: `₱${formatCurrency(totalWorth)}`,
      alignment: 'right',
      bold: true,
      fontSize: 9.5,
      color: '#064e3b',
      fillColor: '#ecfdf5',
    },
    {
      text: `${totalRecords} items`,
      colSpan: 2,
      alignment: 'center',
      bold: true,
      fontSize: 7.5,
      color: '#064e3b',
      fillColor: '#ecfdf5',
    },
    {},
  ]);

  return {
    pageSize: 'A4',
    pageOrientation: 'portrait',
    pageMargins: [36, 110, 36, 45],

    // ── Repeating Page Header ────────────────────────────────────────────────
    header: (currentPage, pageCount) => ({
      margin: [36, 16, 36, 0],
      stack: [
        {
          columns: [
            logoDataUrl
              ? {
                  image: logoDataUrl,
                  width: 46,
                  height: 46,
                  alignment: 'left',
                  margin: [0, 0, 8, 0],
                }
              : { text: '', width: 46 },
            {
              width: '*',
              stack: [
                { text: 'Republic of the Philippines', fontSize: 7.5, color: '#4b5563', alignment: 'center' },
                { text: 'BENGUET STATE UNIVERSITY', fontSize: 11.5, bold: true, color: '#111827', alignment: 'center', margin: [0, 1, 0, 1] },
                { text: 'OFFICE OF THE UNIVERSITY PRESIDENT', fontSize: 7.5, bold: true, color: '#374151', alignment: 'center' },
                { text: 'GENERAL SERVICES OFFICE — EXECUTIVE REPORT', fontSize: 8, bold: true, color: '#15803d', alignment: 'center' },
                { text: 'La Trinidad, Benguet • Telefax: (074) 422-2007 • www.bsu.edu.ph', fontSize: 6.5, color: '#6b7280', alignment: 'center', margin: [0, 1, 0, 0] },
              ],
            },
            {
              width: 90,
              stack: [
                { text: 'CONTROL NO.', fontSize: 6, bold: true, color: '#6b7280', alignment: 'right' },
                { text: docControlNo, fontSize: 6.5, bold: true, color: '#111827', alignment: 'right', margin: [0, 1, 0, 3] },
                { text: 'CLASSIFICATION', fontSize: 6, bold: true, color: '#6b7280', alignment: 'right' },
                { text: 'OFFICIAL DOCUMENT', fontSize: 6.5, bold: true, color: '#15803d', alignment: 'right' },
              ],
            },
          ],
          columnGap: 4,
        },
        {
          canvas: [
            { type: 'line', x1: 0, y1: 5, x2: 523, y2: 5, lineWidth: 1.2, lineColor: '#111827' },
            { type: 'line', x1: 0, y1: 7, x2: 523, y2: 7, lineWidth: 0.4, lineColor: '#9ca3af' },
          ],
        },
      ],
    }),

    // ── Repeating Page Footer ────────────────────────────────────────────────
    footer: (currentPage, pageCount) => ({
      margin: [36, 0, 36, 12],
      columns: [
        {
          text: `Doc Code: ${docControlNo}  •  Benguet State University GSO Materials Document`,
          fontSize: 7,
          color: '#9ca3af',
          alignment: 'left',
        },
        {
          text: `Page ${currentPage} of ${pageCount}`,
          fontSize: 7,
          bold: true,
          color: '#6b7280',
          alignment: 'right',
        },
      ],
    }),

    // ── Document Body Content ────────────────────────────────────────────────
    content: [
      // Report Title & Metadata Box
      {
        table: {
          widths: ['*'],
          body: [
            [
              {
                fillColor: '#f3f4f6',
                margin: [8, 5, 8, 5],
                stack: [
                  {
                    columns: [
                      {
                        stack: [
                          { text: 'EXECUTIVE MATERIALS CONSUMPTION & RESOURCE VALUATION REPORT', fontSize: 10, bold: true, color: '#111827' },
                          { text: `Report Period: ${periodLabel}  •  Scope: Facilities (FGMU) & Grounds (LEAU)`, fontSize: 7.5, color: '#4b5563', margin: [0, 2, 0, 0] },
                        ],
                      },
                      {
                        alignment: 'right',
                        stack: [
                          { text: `Date Generated: ${formatReportDate(new Date())}`, fontSize: 7.5, bold: true, color: '#374151' },
                          { text: 'ISO 9001:2015 & COA Compliant Audit Reference', fontSize: 6.5, color: '#6b7280' },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 0.6,
          vLineWidth: () => 0.6,
          hLineColor: () => '#d1d5db',
          vLineColor: () => '#d1d5db',
        },
        margin: [0, 0, 0, 9],
      },

      // Section 1: Executive KPI Summary Cards (4 Columns)
      {
        text: '1. EXECUTIVE MATERIALS VALUATION OVERVIEW',
        fontSize: 8.5,
        bold: true,
        color: '#111827',
        margin: [0, 0, 0, 3],
      },
      {
        table: {
          widths: ['25%', '25%', '25%', '25%'],
          body: [
            [
              {
                stack: [
                  { text: 'TOTAL MATERIALS WORTH', fontSize: 6.5, bold: true, color: '#4b5563', alignment: 'center' },
                  { text: `₱${formatCurrency(totalWorth)}`, fontSize: 12.5, bold: true, color: '#15803d', alignment: 'center', margin: [0, 2, 0, 0] },
                  { text: 'Consolidated Value', fontSize: 6, color: '#6b7280', alignment: 'center' },
                ],
                fillColor: '#f9fafb',
              },
              {
                stack: [
                  { text: 'ITEMS CONSUMED', fontSize: 6.5, bold: true, color: '#4b5563', alignment: 'center' },
                  { text: String(totalRecords), fontSize: 12.5, bold: true, color: '#111827', alignment: 'center', margin: [0, 2, 0, 0] },
                  { text: `${totalQty} total units dispensed`, fontSize: 6, color: '#6b7280', alignment: 'center' },
                ],
                fillColor: '#f9fafb',
              },
              {
                stack: [
                  { text: 'FGMU SHARE', fontSize: 6.5, bold: true, color: '#4b5563', alignment: 'center' },
                  { text: `₱${formatCurrency(fgmuWorth)}`, fontSize: 12.5, bold: true, color: '#111827', alignment: 'center', margin: [0, 2, 0, 0] },
                  { text: 'Facilities & Building Works', fontSize: 6, color: '#6b7280', alignment: 'center' },
                ],
                fillColor: '#f9fafb',
              },
              {
                stack: [
                  { text: 'LEAU SHARE', fontSize: 6.5, bold: true, color: '#4b5563', alignment: 'center' },
                  { text: `₱${formatCurrency(leauWorth)}`, fontSize: 12.5, bold: true, color: '#111827', alignment: 'center', margin: [0, 2, 0, 0] },
                  { text: 'Landscaping & Ecology', fontSize: 6, color: '#6b7280', alignment: 'center' },
                ],
                fillColor: '#f9fafb',
              },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#d1d5db',
          vLineColor: () => '#d1d5db',
          paddingLeft: () => 4,
          paddingRight: () => 4,
          paddingTop: () => 4,
          paddingBottom: () => 4,
        },
        margin: [0, 0, 0, 10],
      },

      // Section 2: Complete Itemized Materials Breakdown
      {
        text: '2. ITEMIZED RECORD OF MATERIALS CONSUMED & PRICING',
        fontSize: 8.5,
        bold: true,
        color: '#111827',
        margin: [0, 2, 0, 3],
      },
      {
        table: {
          headerRows: 1,
          widths: [20, '*', 38, 32, 60, 68, 48, 62],
          body: tableBody,
        },
        layout: {
          hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 0.8 : 0.5),
          vLineWidth: () => 0.5,
          hLineColor: () => '#d1d5db',
          vLineColor: () => '#d1d5db',
          paddingLeft: () => 4,
          paddingRight: () => 4,
          paddingTop: () => 3,
          paddingBottom: () => 3,
        },
        margin: [0, 0, 0, 12],
      },

      // Section 3: Official Sign-Off & Tripartite Certification Block
      {
        unbreakable: true,
        stack: [
          {
            text: '3. ADMINISTRATIVE CERTIFICATION & SIGN-OFF',
            fontSize: 8.5,
            bold: true,
            color: '#111827',
            margin: [0, 2, 0, 4],
          },
          {
            text: 'This document certifies that the aforementioned materials and consumable inventory items were legitimately requisitioned, disbursed, and utilized in the execution of official institutional maintenance work orders across Benguet State University campuses.',
            fontSize: 7,
            italics: true,
            color: '#4b5563',
            margin: [0, 0, 0, 8],
          },
          {
            table: {
              widths: ['33.3%', '33.3%', '33.4%'],
              body: [
                [
                  {
                    stack: [
                      { text: 'PREPARED & VERIFIED BY:', fontSize: 6.5, bold: true, color: '#6b7280' },
                      { text: '\n\n', fontSize: 9 },
                      { text: 'GSO MATERIALS CUSTODIAN', fontSize: 8, bold: true, color: '#111827' },
                      { text: 'Property & Materials Custodian Unit', fontSize: 6.5, color: '#4b5563' },
                      { text: 'General Services Office', fontSize: 6.5, color: '#6b7280' },
                    ],
                    fillColor: '#f9fafb',
                    margin: [4, 4, 4, 4],
                  },
                  {
                    stack: [
                      { text: 'NOTED BY UNIT HEADS:', fontSize: 6.5, bold: true, color: '#6b7280' },
                      { text: '\n\n', fontSize: 9 },
                      { text: 'FGMU & LEAU SUPERVISORS', fontSize: 8, bold: true, color: '#111827' },
                      { text: 'Operations & Maintenance Supervision', fontSize: 6.5, color: '#4b5563' },
                      { text: 'General Services Office', fontSize: 6.5, color: '#6b7280' },
                    ],
                    fillColor: '#f9fafb',
                    margin: [4, 4, 4, 4],
                  },
                  {
                    stack: [
                      { text: 'CERTIFIED & APPROVED BY:', fontSize: 6.5, bold: true, color: '#6b7280' },
                      { text: '\n\n', fontSize: 9 },
                      { text: directorName.toUpperCase(), fontSize: 8, bold: true, color: '#111827' },
                      { text: 'Director, General Services Office', fontSize: 6.5, color: '#4b5563' },
                      { text: 'Benguet State University', fontSize: 6.5, color: '#6b7280' },
                    ],
                    fillColor: '#f9fafb',
                    margin: [4, 4, 4, 4],
                  },
                ],
              ],
            },
            layout: {
              hLineWidth: () => 0.5,
              vLineWidth: () => 0.5,
              hLineColor: () => '#d1d5db',
              vLineColor: () => '#d1d5db',
            },
          },
        ],
      },
    ],

    defaultStyle: {
      font: 'Roboto',
      fontSize: 8,
      color: '#1f2937',
    },
  };
};

/**
 * Generates and triggers browser download of the Official Materials Report PDF.
 *
 * @param {Object} reportData - Executive analytics payload with materials_summary
 */
export async function downloadMaterialsReportPdf(reportData) {
  const pdfMake = await getPdfMake();
  const logoDataUrl = await getLogoDataUrl();
  const docDef = buildMaterialsReportDocDefinition(reportData, logoDataUrl);

  const filter = reportData.filter || {};
  const period = (filter.period || 'all').toLowerCase();
  const year = filter.year || new Date().getFullYear();
  let filename = `BSU_GSO_Materials_Report_${year}_${period}`;

  if (period === 'month') {
    const m = String(filter.month || new Date().getMonth() + 1).padStart(2, '0');
    filename = `BSU_GSO_Materials_Report_${year}_M${m}`;
  } else if (period === 'quarter') {
    const q = filter.quarter || Math.ceil((new Date().getMonth() + 1) / 3);
    filename = `BSU_GSO_Materials_Report_${year}_Q${q}`;
  }

  return new Promise((resolve, reject) => {
    try {
      pdfMake.createPdf(docDef).download(`${filename}.pdf`, () => {
        resolve();
      });
    } catch (err) {
      console.error('Error generating Materials Report PDF:', err);
      reject(err);
    }
  });
}
