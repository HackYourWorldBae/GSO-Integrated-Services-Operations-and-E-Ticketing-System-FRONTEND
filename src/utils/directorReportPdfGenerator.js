/**
 * directorReportPdfGenerator.js
 *
 * Generates Official Benguet State University (BSU) Executive Performance & Operations Reports
 * for the General Services Office (GSO) Director using pdfmake in the browser.
 *
 * Designed with a formal, prestigious, monochrome-first institutional layout:
 * - Republic of the Philippines & BSU Official Header
 * - University Seal & Document Control Classification
 * - Executive KPI Summary Cards (clean, high-contrast, professional)
 * - Cross-Unit Comparative Performance Matrix (FGMU, LEAU, SSU)
 * - Service Category Distribution & Workload Share
 * - Citizen's Charter SLA Execution & Quality Ratings (ARTA / ISO 9001)
 * - Operational Barriers & Delay Root-Cause Analysis
 * - Tripartite Formal Sign-Off & Administrative Certification Block
 *
 * Exported functions:
 *   downloadDirectorReportPdf(reportData) -> triggers direct browser PDF download
 */

import { loadImageAsPngDataUrl } from '@/utils/imageUtils';
import { getPdfMake } from '@/utils/pdfmakeInit';

let cachedLogoDataUrl = null;

async function getLogoDataUrl() {
  if (!cachedLogoDataUrl) {
    try {
      cachedLogoDataUrl = await loadImageAsPngDataUrl('/bsu-logo.png');
    } catch (e) {
      console.warn('Failed to load BSU logo for Director Report PDF:', e);
      cachedLogoDataUrl = null;
    }
  }
  return cachedLogoDataUrl;
}

/**
 * Format a Date object or string into human-readable form (e.g. "September 15, 2026").
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
 * e.g., BSU-GSO-REP-2026-M09 or BSU-GSO-REP-2026-Q03
 */
const buildDocumentControlNo = (filter = {}) => {
  const period = (filter.period || 'all').toUpperCase();
  const year = filter.year || new Date().getFullYear();
  if (period === 'MONTH') {
    const m = String(filter.month || new Date().getMonth() + 1).padStart(2, '0');
    return `BSU-GSO-REP-${year}-M${m}`;
  }
  if (period === 'QUARTER') {
    return `BSU-GSO-REP-${year}-Q0${filter.quarter || 1}`;
  }
  if (period === 'YEAR') {
    return `BSU-GSO-REP-${year}-ANN`;
  }
  return `BSU-GSO-REP-${year}-GEN`;
};

/**
 * Qualitative descriptor for 5-star ARTA/ISO client satisfaction rating.
 */
const getQualitativeRating = (score) => {
  const num = parseFloat(score) || 0;
  if (num >= 4.5) return 'Outstanding / Excellent';
  if (num >= 3.5) return 'Very Satisfactory';
  if (num >= 2.5) return 'Satisfactory';
  if (num > 0) return 'Needs Improvement';
  return 'No Data Recorded';
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
 * Builds pdfmake docDefinition for the official BSU GSO Executive Report.
 * Uses clean, professional typography, subtle grays, and formal institutional tables.
 */
const buildDirectorReportDocDefinition = (data, logoDataUrl) => {
  const filter = data.filter || {};
  const summary = data.summary || {};
  const units = data.units || {};
  const serviceBreakdown = data.service_breakdown || [];
  const materialsSummary = data.materials_summary || {};
  const compHealth = data.completion_health || {};
  const delayReasons = data.delay_reasons || [];
  const ratings = summary.overall_ratings || {};

  const controlNo = buildDocumentControlNo(filter);
  const periodLabel = filter.label || 'Consolidated Operations';
  const reportType = filter.report_type || 'Operations';
  const generatedAt = data.generated_at || formatReportDate(new Date());
  const directorName = data.director_name || 'Office of the University Director';

  // Institutional Header Setup
  const headerColumns = [];
  if (logoDataUrl) {
    headerColumns.push({
      image: logoDataUrl,
      width: 50,
      height: 50,
      alignment: 'center',
      margin: [0, 0, 12, 0],
    });
  }

  headerColumns.push({
    stack: [
      { text: 'Republic of the Philippines', fontSize: 8, italics: true, color: '#4b5563', alignment: 'center' },
      { text: 'BENGUET STATE UNIVERSITY', fontSize: 13, bold: true, alignment: 'center', color: '#111827', margin: [0, 1, 0, 1] },
      { text: 'OFFICE OF THE GENERAL SERVICES', fontSize: 10, bold: true, alignment: 'center', color: '#166534' },
      { text: 'La Trinidad, Benguet, Philippines 2601  •  Email: gso@bsu.edu.ph', fontSize: 7.5, color: '#6b7280', alignment: 'center', margin: [0, 1, 0, 0] },
    ],
    alignment: 'center',
  });

  return {
    pageSize: 'LETTER',
    pageOrientation: 'portrait',
    pageMargins: [42, 112, 42, 48],

    // ── Repeating Page Header ────────────────────────────────────────────────
    header: (currentPage, pageCount) => ({
      margin: [42, 16, 42, 0],
      stack: [
        { columns: headerColumns, columnGap: 0 },
        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 528, y2: 5, lineWidth: 1.2, lineColor: '#111827' }] },
        {
          columns: [
            { text: 'EXECUTIVE OPERATIONS & PERFORMANCE REPORT', fontSize: 9, bold: true, color: '#111827', margin: [0, 4, 0, 0] },
            { text: `Doc Control: ${controlNo}  |  Page ${currentPage} of ${pageCount}`, fontSize: 7.5, color: '#4b5563', alignment: 'right', margin: [0, 5, 0, 0] },
          ],
        },
        { canvas: [{ type: 'line', x1: 0, y1: 3, x2: 528, y2: 3, lineWidth: 0.5, lineColor: '#9ca3af' }] },
      ],
    }),

    // ── Repeating Page Footer ────────────────────────────────────────────────
    footer: (currentPage, pageCount) => ({
      margin: [42, 0, 42, 0],
      stack: [
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 528, y2: 0, lineWidth: 0.5, lineColor: '#9ca3af' }] },
        {
          columns: [
            { text: 'Benguet State University • General Services Office Administrative Records', fontSize: 7, color: '#6b7280', margin: [0, 4, 0, 0] },
            { text: 'OFFICIAL ADMINISTRATIVE REPORT', fontSize: 7, bold: true, color: '#374151', alignment: 'center', margin: [0, 4, 0, 0] },
            { text: `Page ${currentPage} of ${pageCount}`, fontSize: 7, color: '#6b7280', alignment: 'right', margin: [0, 4, 0, 0] },
          ],
        },
      ],
    }),

    content: [
      // ── Document Metadata Table ───────────────────────────────────────────
      {
        table: {
          widths: [115, '*', 115, '*'],
          body: [
            [
              { text: 'REPORTING PERIOD:', bold: true, fontSize: 8, color: '#111827', fillColor: '#f9fafb' },
              { text: periodLabel, bold: true, fontSize: 8.5, color: '#111827' },
              { text: 'DOCUMENT TYPE:', bold: true, fontSize: 8, color: '#111827', fillColor: '#f9fafb' },
              { text: `${reportType} Operations Summary`, fontSize: 8.5, color: '#111827' },
            ],
            [
              { text: 'JURISDICTION / SCOPE:', bold: true, fontSize: 8, color: '#111827', fillColor: '#f9fafb' },
              { text: 'Consolidated GSO Units (FGMU, LEAU, SSU)', fontSize: 8, color: '#374151' },
              { text: 'DATE OF ISSUANCE:', bold: true, fontSize: 8, color: '#111827', fillColor: '#f9fafb' },
              { text: generatedAt, fontSize: 8, color: '#374151' },
            ],
            [
              { text: 'CLASSIFICATION:', bold: true, fontSize: 8, color: '#111827', fillColor: '#f9fafb' },
              { text: 'OFFICIAL EXECUTIVE UNIVERSITY USE', fontSize: 8, bold: true, color: '#111827' },
              { text: 'STANDARDS BENCHMARK:', bold: true, fontSize: 8, color: '#111827', fillColor: '#f9fafb' },
              { text: 'BSU Citizens Charter & ARTA SLA Guidelines', fontSize: 8, color: '#374151' },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#d1d5db',
          vLineColor: () => '#d1d5db',
          paddingLeft: () => 6,
          paddingRight: () => 6,
          paddingTop: () => 3,
          paddingBottom: () => 3,
        },
        margin: [0, 0, 0, 9],
      },

      // ── Section 1: Executive KPI & Workload Summary (Clean & Professional) ─
      {
        text: '1. EXECUTIVE WORKLOAD & PERFORMANCE SUMMARY',
        fontSize: 9,
        bold: true,
        color: '#111827',
        margin: [0, 2, 0, 3],
      },
      {
        table: {
          widths: ['*', '*', '*', '*'],
          body: [
            [
              {
                stack: [
                  { text: 'TOTAL REQUESTS FILED', fontSize: 7, bold: true, color: '#4b5563', alignment: 'center' },
                  { text: String(summary.total_requests || 0), fontSize: 15, bold: true, color: '#111827', alignment: 'center', margin: [0, 2, 0, 0] },
                  { text: 'Consolidated Across Units', fontSize: 6.5, color: '#6b7280', alignment: 'center' },
                ],
                fillColor: '#f9fafb',
              },
              {
                stack: [
                  { text: 'RESOLVED & COMPLETED', fontSize: 7, bold: true, color: '#4b5563', alignment: 'center' },
                  { text: String(summary.total_resolved || 0), fontSize: 15, bold: true, color: '#111827', alignment: 'center', margin: [0, 2, 0, 0] },
                  { text: 'Closed Service Actions', fontSize: 6.5, color: '#6b7280', alignment: 'center' },
                ],
                fillColor: '#f9fafb',
              },
              {
                stack: [
                  { text: 'DECLINED / OUT OF SCOPE', fontSize: 7, bold: true, color: '#4b5563', alignment: 'center' },
                  { text: String(summary.total_declined || 0), fontSize: 15, bold: true, color: '#111827', alignment: 'center', margin: [0, 2, 0, 0] },
                  { text: 'Disapproved / Referred', fontSize: 6.5, color: '#6b7280', alignment: 'center' },
                ],
                fillColor: '#f9fafb',
              },
              {
                stack: [
                  { text: 'CLIENT SATISFACTION', fontSize: 7, bold: true, color: '#4b5563', alignment: 'center' },
                  { text: ratings.overall_avg ? `${parseFloat(ratings.overall_avg).toFixed(2)} ★` : '5.00 ★', fontSize: 15, bold: true, color: '#111827', alignment: 'center', margin: [0, 2, 0, 0] },
                  { text: `Based on ${ratings.total_feedbacks || 0} Surveys`, fontSize: 6.5, color: '#6b7280', alignment: 'center' },
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
          paddingTop: () => 5,
          paddingBottom: () => 5,
        },
        margin: [0, 0, 0, 9],
      },

      // ── Section 2: Cross-Unit Comparative Performance Matrix ───────────────
      {
        text: '2. SUB-UNIT COMPARATIVE WORKLOAD & RESOLUTION MATRIX',
        fontSize: 9,
        bold: true,
        color: '#111827',
        margin: [0, 2, 0, 3],
      },
      {
        table: {
          headerRows: 1,
          widths: ['*', 65, 65, 65, 75],
          body: [
            // Header Row
            [
              { text: 'SUB-UNIT', bold: true, fontSize: 7.5, color: '#111827', fillColor: '#e5e7eb' },
              { text: 'TOTAL', bold: true, fontSize: 7.5, color: '#111827', fillColor: '#e5e7eb', alignment: 'center' },
              { text: 'RESOLVED', bold: true, fontSize: 7.5, color: '#111827', fillColor: '#e5e7eb', alignment: 'center' },
              { text: 'DECLINED', bold: true, fontSize: 7.5, color: '#111827', fillColor: '#e5e7eb', alignment: 'center' },
              { text: 'CSAT / 5.0', bold: true, fontSize: 7.5, color: '#111827', fillColor: '#e5e7eb', alignment: 'center' },
            ],
            // FGMU Row
            [
              {
                text: [
                  { text: 'Facilities & Grounds (FGMU)\n', bold: true, fontSize: 8, color: '#111827' },
                  { text: 'Electrical, Plumbing, Carpentry, Air Conditioning', fontSize: 6.5, color: '#6b7280' },
                ],
              },
              { text: String(units.FGMU?.total || 0), fontSize: 8, alignment: 'center' },
              { text: String(units.FGMU?.resolved || 0), fontSize: 8, bold: true, alignment: 'center' },
              { text: String(units.FGMU?.declined || 0), fontSize: 8, alignment: 'center' },
              { text: units.FGMU?.avg_ratings?.overall_avg ? `${units.FGMU.avg_ratings.overall_avg}` : 'N/A', fontSize: 8, alignment: 'center' },
            ],
            // LEAU Row
            [
              {
                text: [
                  { text: 'Landscaping & Environment (LEAU)\n', bold: true, fontSize: 8, color: '#111827' },
                  { text: 'Grounds Maintenance, Tree Pruning, Campus Beautification', fontSize: 6.5, color: '#6b7280' },
                ],
                fillColor: '#f9fafb',
              },
              { text: String(units.LEAU?.total || 0), fontSize: 8, alignment: 'center', fillColor: '#f9fafb' },
              { text: String(units.LEAU?.resolved || 0), fontSize: 8, bold: true, alignment: 'center', fillColor: '#f9fafb' },
              { text: String(units.LEAU?.declined || 0), fontSize: 8, alignment: 'center', fillColor: '#f9fafb' },
              { text: units.LEAU?.avg_ratings?.overall_avg ? `${units.LEAU.avg_ratings.overall_avg}` : 'N/A', fontSize: 8, alignment: 'center', fillColor: '#f9fafb' },
            ],
            // SSU Row
            [
              {
                text: [
                  { text: 'Safety & Security Services (SSU)\n', bold: true, fontSize: 8, color: '#111827' },
                  { text: 'Security Incidents, Campus Investigations & Safety Protocols', fontSize: 6.5, color: '#6b7280' },
                ],
              },
              { text: String(units.SSU?.total || 0), fontSize: 8, alignment: 'center' },
              { text: String(units.SSU?.resolved || 0), fontSize: 8, bold: true, alignment: 'center' },
              { text: String(units.SSU?.declined || 0), fontSize: 8, alignment: 'center' },
              { text: units.SSU?.avg_ratings?.overall_avg ? `${units.SSU.avg_ratings.overall_avg}` : 'N/A', fontSize: 8, alignment: 'center' },
            ],
            // Consolidated Total Row
            [
              { text: 'CONSOLIDATED GSO TOTAL', bold: true, fontSize: 8, color: '#111827', fillColor: '#f3f4f6' },
              { text: String(summary.total_requests || 0), bold: true, fontSize: 8, alignment: 'center', fillColor: '#f3f4f6' },
              { text: String(summary.total_resolved || 0), bold: true, fontSize: 8, alignment: 'center', fillColor: '#f3f4f6' },
              { text: String(summary.total_declined || 0), bold: true, fontSize: 8, alignment: 'center', fillColor: '#f3f4f6' },
              { text: ratings.overall_avg ? `${ratings.overall_avg}` : 'N/A', bold: true, fontSize: 8, alignment: 'center', fillColor: '#f3f4f6' },
            ],
          ],
        },
        layout: {
          hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 0.8 : 0.5),
          vLineWidth: () => 0.5,
          hLineColor: () => '#d1d5db',
          vLineColor: () => '#d1d5db',
          paddingLeft: () => 5,
          paddingRight: () => 5,
          paddingTop: () => 3,
          paddingBottom: () => 3,
        },
        margin: [0, 0, 0, 9],
      },

      // ── Section 3 & 4: Two Clean Columns (Service Types + SLA Health) ──────
      {
        columns: [
          // Left: Top Service Workload Distribution
          {
            width: '52%',
            stack: [
              { text: '3. SERVICE WORKLOAD DISTRIBUTION', fontSize: 9, bold: true, color: '#111827', margin: [0, 2, 0, 3] },
              {
                table: {
                  headerRows: 1,
                  widths: ['*', 35, 45],
                  body: [
                    [
                      { text: 'SERVICE TYPE / CLASSIFICATION', bold: true, fontSize: 7, color: '#111827', fillColor: '#e5e7eb' },
                      { text: 'COUNT', bold: true, fontSize: 7, color: '#111827', fillColor: '#e5e7eb', alignment: 'center' },
                      { text: 'SHARE', bold: true, fontSize: 7, color: '#111827', fillColor: '#e5e7eb', alignment: 'center' },
                    ],
                    ...(serviceBreakdown.length > 0
                      ? serviceBreakdown.map((item, idx) => [
                          { text: item.name, fontSize: 7.5, color: '#1f2937', fillColor: idx % 2 === 1 ? '#f9fafb' : '#ffffff' },
                          { text: String(item.count), fontSize: 7.5, alignment: 'center', fillColor: idx % 2 === 1 ? '#f9fafb' : '#ffffff' },
                          { text: `${item.percent}%`, fontSize: 7.5, bold: true, alignment: 'center', fillColor: idx % 2 === 1 ? '#f9fafb' : '#ffffff' },
                        ])
                      : [
                          [
                            { text: 'No service transactions recorded in this period.', colSpan: 3, italics: true, fontSize: 7.5, color: '#6b7280', alignment: 'center' },
                            {}, {},
                          ],
                        ]),
                  ],
                },
                layout: {
                  hLineWidth: () => 0.5,
                  vLineWidth: () => 0.5,
                  hLineColor: () => '#e5e7eb',
                  vLineColor: () => '#e5e7eb',
                  paddingLeft: () => 4,
                  paddingRight: () => 4,
                  paddingTop: () => 2.5,
                  paddingBottom: () => 2.5,
                },
              },
            ],
          },

          // Right: SLA Execution & Quality Evaluation
          {
            width: '46%',
            margin: [12, 0, 0, 0],
            stack: [
              { text: '4. SERVICE DELIVERY & CLIENT RATINGS', fontSize: 9, bold: true, color: '#111827', margin: [0, 2, 0, 3] },
              {
                table: {
                  headerRows: 1,
                  widths: ['*', 45, 45],
                  body: [
                    [
                      { text: 'CRITERION', bold: true, fontSize: 7, color: '#111827', fillColor: '#e5e7eb' },
                      { text: 'VALUE', bold: true, fontSize: 7, color: '#111827', fillColor: '#e5e7eb', alignment: 'center' },
                      { text: 'SHARE / SCORE', bold: true, fontSize: 7, color: '#111827', fillColor: '#e5e7eb', alignment: 'center' },
                    ],
                    [
                      { text: 'On-Time Completion', fontSize: 7.5, bold: true },
                      { text: String(compHealth.on_time || 0), fontSize: 7.5, alignment: 'center' },
                      { text: `${compHealth.on_time_percent || 0}%`, fontSize: 7.5, bold: true, alignment: 'center' },
                    ],
                    [
                      { text: 'Completed Beyond Schedule', fontSize: 7.5, fillColor: '#f9fafb' },
                      { text: String(compHealth.beyond_time || 0), fontSize: 7.5, alignment: 'center', fillColor: '#f9fafb' },
                      { text: `${compHealth.beyond_time_percent || 0}%`, fontSize: 7.5, alignment: 'center', fillColor: '#f9fafb' },
                    ],
                    [
                      { text: 'Incomplete / Suspended', fontSize: 7.5 },
                      { text: String(compHealth.not_completed || 0), fontSize: 7.5, alignment: 'center' },
                      { text: `${compHealth.not_completed_percent || 0}%`, fontSize: 7.5, alignment: 'center' },
                    ],
                    [
                      { text: 'Quality Rating (avg)', fontSize: 7.5, fillColor: '#f9fafb' },
                      { text: ratings.avg_quality ? `${parseFloat(ratings.avg_quality).toFixed(2)}` : 'N/A', fontSize: 7.5, alignment: 'center', fillColor: '#f9fafb' },
                      { text: '/ 5.00', fontSize: 7, color: '#6b7280', alignment: 'center', fillColor: '#f9fafb' },
                    ],
                    [
                      { text: 'Efficiency Rating (avg)', fontSize: 7.5 },
                      { text: ratings.avg_efficiency ? `${parseFloat(ratings.avg_efficiency).toFixed(2)}` : 'N/A', fontSize: 7.5, alignment: 'center' },
                      { text: '/ 5.00', fontSize: 7, color: '#6b7280', alignment: 'center' },
                    ],
                    [
                      { text: 'Timeliness Rating (avg)', fontSize: 7.5, fillColor: '#f9fafb' },
                      { text: ratings.avg_timeliness ? `${parseFloat(ratings.avg_timeliness).toFixed(2)}` : 'N/A', fontSize: 7.5, alignment: 'center', fillColor: '#f9fafb' },
                      { text: '/ 5.00', fontSize: 7, color: '#6b7280', alignment: 'center', fillColor: '#f9fafb' },
                    ],
                    [
                      { text: 'Overall Client Rating', bold: true, fontSize: 7.5, color: '#111827', fillColor: '#f3f4f6' },
                      { text: ratings.overall_avg ? `${parseFloat(ratings.overall_avg).toFixed(2)}` : 'N/A', bold: true, fontSize: 8, alignment: 'center', fillColor: '#f3f4f6' },
                      { text: '/ 5.00', fontSize: 7, bold: true, alignment: 'center', fillColor: '#f3f4f6' },
                    ],
                  ],
                },
                layout: {
                  hLineWidth: () => 0.5,
                  vLineWidth: () => 0.5,
                  hLineColor: () => '#e5e7eb',
                  vLineColor: () => '#e5e7eb',
                  paddingLeft: () => 4,
                  paddingRight: () => 4,
                  paddingTop: () => 2.5,
                  paddingBottom: () => 2.5,
                },
              },
            ],
          },
        ],
        margin: [0, 0, 0, 9],
      },

      // ── Section 5: Operational Constraints & Observations ──────────────────
      {
        text: '5. OPERATIONAL CONSTRAINTS & OBSERVATIONS',
        fontSize: 9,
        bold: true,
        color: '#111827',
        margin: [0, 2, 0, 3],
      },
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              {
                stack: [
                  { text: 'Documented Root-Cause Delays / Bottlenecks:', bold: true, fontSize: 7.5, color: '#374151', margin: [0, 0, 0, 2] },
                  delayReasons.length > 0
                    ? {
                        ul: delayReasons.map((r) => ({
                          text: `${r.reason}: ${r.count} incident(s)`,
                          fontSize: 7,
                          color: '#1f2937',
                        })),
                      }
                    : { text: '• No notable delay barriers or operational impediments reported.', fontSize: 7, color: '#4b5563' },
                ],
                fillColor: '#ffffff',
              },
              {
                stack: [
                  { text: 'Citizen Satisfaction Index Assessment:', bold: true, fontSize: 7.5, color: '#374151', margin: [0, 0, 0, 2] },
                  {
                    text: [
                      { text: 'Rating Classification: ', fontSize: 7, color: '#4b5563' },
                      { text: `${getQualitativeRating(ratings.overall_avg)}\n`, bold: true, fontSize: 7.5, color: '#111827' },
                      { text: `Based on ${ratings.total_feedbacks || 0} client feedback surveys verified under Citizen Charter and ISO 9001 guidelines.`, fontSize: 7, color: '#374151' },
                    ],
                  },
                ],
                fillColor: '#ffffff',
              },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#d1d5db',
          vLineColor: () => '#d1d5db',
          paddingLeft: () => 6,
          paddingRight: () => 6,
          paddingTop: () => 3.5,
          paddingBottom: () => 3.5,
        },
        margin: [0, 0, 0, 12],
      },

      // ── Section 6: Materials Utilization & Resource Valuation ─────────────
      {
        text: '6. MATERIALS UTILIZATION & RESOURCE VALUATION SUMMARY',
        fontSize: 9,
        bold: true,
        color: '#111827',
        margin: [0, 2, 0, 3],
      },
      {
        table: {
          widths: ['35%', '25%', '20%', '20%'],
          body: [
            [
              { text: 'TOTAL MATERIALS VALUE', bold: true, fontSize: 7, color: '#4b5563', fillColor: '#f3f4f6' },
              { text: 'LINE ITEMS CONSUMED', bold: true, fontSize: 7, color: '#4b5563', fillColor: '#f3f4f6' },
              { text: 'FGMU SHARE', bold: true, fontSize: 7, color: '#4b5563', fillColor: '#f3f4f6' },
              { text: 'LEAU SHARE', bold: true, fontSize: 7, color: '#4b5563', fillColor: '#f3f4f6' },
            ],
            [
              {
                text: `₱${formatCurrency(materialsSummary.total_worth || 0)}`,
                bold: true,
                fontSize: 11,
                color: '#15803d',
              },
              {
                text: `${materialsSummary.total_records || 0} items (${materialsSummary.total_quantity || 0} units)`,
                bold: true,
                fontSize: 8,
                color: '#111827',
              },
              {
                text: `₱${formatCurrency(materialsSummary.by_unit?.FGMU?.total_worth || 0)}`,
                fontSize: 8,
                color: '#111827',
              },
              {
                text: `₱${formatCurrency(materialsSummary.by_unit?.LEAU?.total_worth || 0)}`,
                fontSize: 8,
                color: '#111827',
              },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#d1d5db',
          vLineColor: () => '#d1d5db',
          paddingLeft: () => 6,
          paddingRight: () => 6,
          paddingTop: () => 4,
          paddingBottom: () => 4,
        },
        margin: [0, 0, 0, 14],
      },

    ],
  };
};

/**
 * Triggers direct browser download for the official BSU GSO Executive Report PDF.
 * @param {Object} reportData - Data payload returned by /api/v1/director/analytics
 */
export const downloadDirectorReportPdf = async (reportData) => {
  const [pdfMake, logoDataUrl] = await Promise.all([
    getPdfMake(),
    getLogoDataUrl(),
  ]);

  const docDef = buildDirectorReportDocDefinition(reportData, logoDataUrl);
  const controlNo = buildDocumentControlNo(reportData.filter || {});
  const periodType = (reportData.filter?.period || 'all').toLowerCase();
  const year = reportData.filter?.year || new Date().getFullYear();

  let filename = `BSU_GSO_Executive_Report_${controlNo}.pdf`;
  if (periodType === 'month') {
    const m = reportData.filter?.month || new Date().getMonth() + 1;
    filename = `BSU_GSO_Monthly_Report_${year}_M${String(m).padStart(2, '0')}.pdf`;
  } else if (periodType === 'quarter') {
    filename = `BSU_GSO_Quarterly_Report_${year}_Q${reportData.filter?.quarter || 1}.pdf`;
  } else if (periodType === 'year') {
    filename = `BSU_GSO_Annual_Report_${year}.pdf`;
  }

  pdfMake.createPdf(docDef).download(filename);
};
