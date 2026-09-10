/**
 * directorReportPdfGenerator.js
 *
 * Generates Official Benguet State University (BSU) Executive Performance & Operations Reports
 * for the General Services Office (GSO) Director using pdfmake entirely in the browser.
 *
 * Conforms to the official BSU institutional document format standards:
 * - Republic of the Philippines & BSU Header
 * - Office of the General Services (GSO) Letterhead & University Seal
 * - Document Control & Metadata Table
 * - Executive KPI Summary Cards
 * - Cross-Unit Comparative Workload Matrix (FGMU, LEAU, SSU)
 * - Service Category Distribution Table
 * - Operational Health & SLA Compliance Analysis
 * - Client Satisfaction & Citizens Charter Quality Evaluation
 * - Formal Tripartite Sign-off & Certification Block
 *
 * Exported functions:
 *   generateDirectorReportBlob(reportData) -> Promise<Blob>
 *   downloadDirectorReportPdf(reportData)  -> void (triggers direct browser download)
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
 * Format a Date object or string.
 */
export const formatReportDate = (dateVal) => {
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
 * Generates a unique official document control number.
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
 * Builds pdfmake docDefinition for the official BSU GSO Executive Report.
 */
const buildDirectorReportDocDefinition = (data, logoDataUrl) => {
  const filter = data.filter || {};
  const summary = data.summary || {};
  const units = data.units || {};
  const serviceBreakdown = data.service_breakdown || [];
  const compHealth = data.completion_health || {};
  const delayReasons = data.delay_reasons || [];
  const ratings = summary.overall_ratings || {};

  const controlNo = buildDocumentControlNo(filter);
  const periodLabel = filter.label || 'Consolidated Operations';
  const reportType = filter.report_type || 'Operations';
  const generatedAt = data.generated_at || formatReportDate(new Date());
  const directorName = data.director_name || 'Office of the University Director';

  // Header column setup
  const headerColumns = [];
  if (logoDataUrl) {
    headerColumns.push({
      image: logoDataUrl,
      width: 54,
      height: 54,
      alignment: 'center',
      margin: [0, 0, 10, 0],
    });
  }

  headerColumns.push({
    stack: [
      { text: 'Republic of the Philippines', fontSize: 8, italics: true, color: '#475569', alignment: 'center' },
      { text: 'BENGUET STATE UNIVERSITY', fontSize: 13, bold: true, alignment: 'center', color: '#0f172a' },
      { text: 'OFFICE OF THE GENERAL SERVICES', fontSize: 10, bold: true, alignment: 'center', color: '#166534', margin: [0, 1, 0, 1] },
      { text: 'Km. 5, La Trinidad, Benguet, Philippines 2601  •  Email: gso@bsu.edu.ph', fontSize: 7.5, color: '#475569', alignment: 'center' },
    ],
    alignment: 'center',
  });

  return {
    pageSize: 'LETTER',
    pageOrientation: 'portrait',
    pageMargins: [42, 115, 42, 50],

    // ── Repeating Page Header ────────────────────────────────────────────────
    header: (currentPage, pageCount) => ({
      margin: [42, 18, 42, 0],
      stack: [
        { columns: headerColumns, columnGap: 0 },
        { canvas: [{ type: 'line', x1: 0, y1: 6, x2: 528, y2: 6, lineWidth: 1.5, lineColor: '#0f172a' }] },
        {
          columns: [
            { text: 'EXECUTIVE OPERATIONS & PERFORMANCE REPORT', fontSize: 9.5, bold: true, color: '#0f172a', margin: [0, 5, 0, 0] },
            { text: `Doc Control: ${controlNo}  |  Page ${currentPage} of ${pageCount}`, fontSize: 7.5, color: '#64748b', alignment: 'right', margin: [0, 6, 0, 0] },
          ],
        },
        { canvas: [{ type: 'line', x1: 0, y1: 4, x2: 528, y2: 4, lineWidth: 0.5, lineColor: '#cbd5e1' }] },
      ],
    }),

    // ── Repeating Page Footer ────────────────────────────────────────────────
    footer: (currentPage, pageCount) => ({
      margin: [42, 0, 42, 0],
      stack: [
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 528, y2: 0, lineWidth: 0.5, lineColor: '#cbd5e1' }] },
        {
          columns: [
            { text: 'Benguet State University • General Services Office Executive Records', fontSize: 7, color: '#94a3b8', margin: [0, 4, 0, 0] },
            { text: 'CONFIDENTIAL & OFFICIAL ADMINISTRATIVE REPORT', fontSize: 7, bold: true, color: '#166534', alignment: 'center', margin: [0, 4, 0, 0] },
            { text: `Page ${currentPage} of ${pageCount}`, fontSize: 7, color: '#94a3b8', alignment: 'right', margin: [0, 4, 0, 0] },
          ],
        },
      ],
    }),

    content: [
      // ── Document Metadata Table (Official BSU Document Control Strip) ────────
      {
        table: {
          widths: [110, '*', 110, '*'],
          body: [
            [
              { text: 'REPORTING PERIOD:', bold: true, fontSize: 8, color: '#1e293b', fillColor: '#f1f5f9' },
              { text: periodLabel, bold: true, fontSize: 8.5, color: '#0f172a' },
              { text: 'DOCUMENT TYPE:', bold: true, fontSize: 8, color: '#1e293b', fillColor: '#f1f5f9' },
              { text: `${reportType} Operations Summary`, fontSize: 8.5, color: '#0f172a' },
            ],
            [
              { text: 'JURISDICTION / SCOPE:', bold: true, fontSize: 8, color: '#1e293b', fillColor: '#f1f5f9' },
              { text: 'All GSO Sub-Units (FGMU, LEAU, SSU)', fontSize: 8, color: '#334155' },
              { text: 'DATE OF ISSUANCE:', bold: true, fontSize: 8, color: '#1e293b', fillColor: '#f1f5f9' },
              { text: generatedAt, fontSize: 8, color: '#334155' },
            ],
            [
              { text: 'SECURITY LEVEL:', bold: true, fontSize: 8, color: '#1e293b', fillColor: '#f1f5f9' },
              { text: 'OFFICIAL UNIVERSITY EXECUTIVE USE', fontSize: 8, bold: true, color: '#166534' },
              { text: 'COMPLIANCE BENCHMARK:', bold: true, fontSize: 8, color: '#1e293b', fillColor: '#f1f5f9' },
              { text: 'BSU Citizens Charter & ARTA SLA', fontSize: 8, color: '#334155' },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#cbd5e1',
          vLineColor: () => '#cbd5e1',
          paddingLeft: () => 6,
          paddingRight: () => 6,
          paddingTop: () => 3.5,
          paddingBottom: () => 3.5,
        },
        margin: [0, 0, 0, 10],
      },

      // ── Section 1: Executive Key Performance Indicators (KPIs) ───────────────
      {
        text: '1. EXECUTIVE KPI & WORKLOAD SUMMARY',
        fontSize: 9.5,
        bold: true,
        color: '#0f172a',
        margin: [0, 4, 0, 4],
      },
      {
        table: {
          widths: ['*', '*', '*', '*', '*'],
          body: [
            [
              {
                stack: [
                  { text: 'TOTAL TICKETS FILED', fontSize: 7, bold: true, color: '#64748b', alignment: 'center' },
                  { text: String(summary.total_requests || 0), fontSize: 16, bold: true, color: '#0f172a', alignment: 'center', margin: [0, 2, 0, 0] },
                  { text: 'All Units Combined', fontSize: 6.5, color: '#94a3b8', alignment: 'center' },
                ],
                fillColor: '#f8fafc',
              },
              {
                stack: [
                  { text: 'RESOLVED & CLOSED', fontSize: 7, bold: true, color: '#166534', alignment: 'center' },
                  { text: String(summary.total_resolved || 0), fontSize: 16, bold: true, color: '#166534', alignment: 'center', margin: [0, 2, 0, 0] },
                  { text: 'Completed Actions', fontSize: 6.5, color: '#16a34a', alignment: 'center' },
                ],
                fillColor: '#f0fdf4',
              },
              {
                stack: [
                  { text: 'ACTIVE / IN PROGRESS', fontSize: 7, bold: true, color: '#1e40af', alignment: 'center' },
                  { text: String((summary.total_processing || 0) + (summary.total_pending || 0)), fontSize: 16, bold: true, color: '#1e40af', alignment: 'center', margin: [0, 2, 0, 0] },
                  { text: `${summary.total_pending || 0} Pending Approval`, fontSize: 6.5, color: '#3b82f6', alignment: 'center' },
                ],
                fillColor: '#eff6ff',
              },
              {
                stack: [
                  { text: 'DECLINED / REJECTED', fontSize: 7, bold: true, color: '#9f1239', alignment: 'center' },
                  { text: String(summary.total_declined || 0), fontSize: 16, bold: true, color: '#be123c', alignment: 'center', margin: [0, 2, 0, 0] },
                  { text: 'Not Actionable', fontSize: 6.5, color: '#e11d48', alignment: 'center' },
                ],
                fillColor: '#fff1f2',
              },
              {
                stack: [
                  { text: 'RESOLUTION RATE', fontSize: 7, bold: true, color: '#0f172a', alignment: 'center' },
                  { text: `${summary.completion_rate || 0}%`, fontSize: 16, bold: true, color: '#0f172a', alignment: 'center', margin: [0, 2, 0, 0] },
                  { text: 'Efficiency Score', fontSize: 6.5, color: '#166534', alignment: 'center' },
                ],
                fillColor: '#f8fafc',
              },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 0.6,
          vLineWidth: () => 0.6,
          hLineColor: () => '#cbd5e1',
          vLineColor: () => '#cbd5e1',
          paddingLeft: () => 4,
          paddingRight: () => 4,
          paddingTop: () => 6,
          paddingBottom: () => 6,
        },
        margin: [0, 0, 0, 10],
      },

      // ── Section 2: Cross-Unit Comparative Performance Matrix ─────────────────
      {
        text: '2. SUB-UNIT COMPARATIVE PERFORMANCE MATRIX',
        fontSize: 9.5,
        bold: true,
        color: '#0f172a',
        margin: [0, 4, 0, 4],
      },
      {
        table: {
          headerRows: 1,
          widths: ['*', 45, 45, 45, 45, 45, 60, 50],
          body: [
            // Header
            [
              { text: 'SUB-UNIT NAME', bold: true, fontSize: 7.5, color: '#ffffff', fillColor: '#0f172a' },
              { text: 'TOTAL', bold: true, fontSize: 7.5, color: '#ffffff', fillColor: '#0f172a', alignment: 'center' },
              { text: 'RESOLVED', bold: true, fontSize: 7.5, color: '#ffffff', fillColor: '#0f172a', alignment: 'center' },
              { text: 'ACTIVE', bold: true, fontSize: 7.5, color: '#ffffff', fillColor: '#0f172a', alignment: 'center' },
              { text: 'PENDING', bold: true, fontSize: 7.5, color: '#ffffff', fillColor: '#0f172a', alignment: 'center' },
              { text: 'DECLINED', bold: true, fontSize: 7.5, color: '#ffffff', fillColor: '#0f172a', alignment: 'center' },
              { text: 'RATE (%)', bold: true, fontSize: 7.5, color: '#ffffff', fillColor: '#0f172a', alignment: 'center' },
              { text: 'CSAT / 5.0', bold: true, fontSize: 7.5, color: '#ffffff', fillColor: '#0f172a', alignment: 'center' },
            ],
            // FGMU Row
            [
              {
                text: [
                  { text: 'Facilities & Grounds (FGMU)\n', bold: true, fontSize: 8, color: '#0f172a' },
                  { text: 'Electrical, Plumbing, Carpentry, Air Conditioning', fontSize: 6.5, color: '#64748b' }
                ]
              },
              { text: String(units.FGMU?.total || 0), fontSize: 8, alignment: 'center' },
              { text: String(units.FGMU?.resolved || 0), fontSize: 8, bold: true, color: '#166534', alignment: 'center' },
              { text: String((units.FGMU?.processing || 0) + (units.FGMU?.active_working || 0)), fontSize: 8, color: '#1e40af', alignment: 'center' },
              { text: String(units.FGMU?.pending || 0), fontSize: 8, color: '#b45309', alignment: 'center' },
              { text: String(units.FGMU?.declined || 0), fontSize: 8, color: '#be123c', alignment: 'center' },
              { text: `${units.FGMU?.completion_rate || 0}%`, fontSize: 8, bold: true, color: '#0f172a', alignment: 'center' },
              { text: units.FGMU?.avg_ratings?.overall_avg ? `${units.FGMU.avg_ratings.overall_avg}` : 'N/A', fontSize: 8, bold: true, color: '#166534', alignment: 'center' },
            ],
            // LEAU Row
            [
              {
                text: [
                  { text: 'Landscaping & Environment (LEAU)\n', bold: true, fontSize: 8, color: '#0f172a' },
                  { text: 'Grounds Maintenance, Tree Pruning, Beautification', fontSize: 6.5, color: '#64748b' }
                ],
                fillColor: '#f8fafc',
              },
              { text: String(units.LEAU?.total || 0), fontSize: 8, alignment: 'center', fillColor: '#f8fafc' },
              { text: String(units.LEAU?.resolved || 0), fontSize: 8, bold: true, color: '#166534', alignment: 'center', fillColor: '#f8fafc' },
              { text: String((units.LEAU?.processing || 0) + (units.LEAU?.active_working || 0)), fontSize: 8, color: '#1e40af', alignment: 'center', fillColor: '#f8fafc' },
              { text: String(units.LEAU?.pending || 0), fontSize: 8, color: '#b45309', alignment: 'center', fillColor: '#f8fafc' },
              { text: String(units.LEAU?.declined || 0), fontSize: 8, color: '#be123c', alignment: 'center', fillColor: '#f8fafc' },
              { text: `${units.LEAU?.completion_rate || 0}%`, fontSize: 8, bold: true, color: '#0f172a', alignment: 'center', fillColor: '#f8fafc' },
              { text: units.LEAU?.avg_ratings?.overall_avg ? `${units.LEAU.avg_ratings.overall_avg}` : 'N/A', fontSize: 8, bold: true, color: '#166534', alignment: 'center', fillColor: '#f8fafc' },
            ],
            // SSU Row
            [
              {
                text: [
                  { text: 'Safety & Security Services (SSU)\n', bold: true, fontSize: 8, color: '#0f172a' },
                  { text: 'Security Incidents, Campus Safety & Investigations', fontSize: 6.5, color: '#64748b' }
                ]
              },
              { text: String(units.SSU?.total || 0), fontSize: 8, alignment: 'center' },
              { text: String(units.SSU?.resolved || 0), fontSize: 8, bold: true, color: '#166534', alignment: 'center' },
              { text: String(units.SSU?.processing || 0), fontSize: 8, color: '#1e40af', alignment: 'center' },
              { text: String(units.SSU?.pending || 0), fontSize: 8, color: '#b45309', alignment: 'center' },
              { text: String(units.SSU?.declined || 0), fontSize: 8, color: '#be123c', alignment: 'center' },
              { text: `${units.SSU?.completion_rate || 0}%`, fontSize: 8, bold: true, color: '#0f172a', alignment: 'center' },
              { text: units.SSU?.avg_ratings?.overall_avg ? `${units.SSU.avg_ratings.overall_avg}` : 'N/A', fontSize: 8, bold: true, color: '#166534', alignment: 'center' },
            ],
            // Consolidated Total Row
            [
              { text: 'CONSOLIDATED TOTAL / SYSTEM AVERAGE', bold: true, fontSize: 8, color: '#166534', fillColor: '#f0fdf4' },
              { text: String(summary.total_requests || 0), bold: true, fontSize: 8.5, alignment: 'center', fillColor: '#f0fdf4' },
              { text: String(summary.total_resolved || 0), bold: true, fontSize: 8.5, color: '#166534', alignment: 'center', fillColor: '#f0fdf4' },
              { text: String(summary.total_processing || 0), bold: true, fontSize: 8.5, color: '#1e40af', alignment: 'center', fillColor: '#f0fdf4' },
              { text: String(summary.total_pending || 0), bold: true, fontSize: 8.5, color: '#b45309', alignment: 'center', fillColor: '#f0fdf4' },
              { text: String(summary.total_declined || 0), bold: true, fontSize: 8.5, color: '#be123c', alignment: 'center', fillColor: '#f0fdf4' },
              { text: `${summary.completion_rate || 0}%`, bold: true, fontSize: 8.5, color: '#0f172a', alignment: 'center', fillColor: '#f0fdf4' },
              { text: ratings.overall_avg ? `${ratings.overall_avg}` : 'N/A', bold: true, fontSize: 8.5, color: '#166534', alignment: 'center', fillColor: '#f0fdf4' },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#cbd5e1',
          vLineColor: () => '#cbd5e1',
          paddingLeft: () => 5,
          paddingRight: () => 5,
          paddingTop: () => 3.5,
          paddingBottom: () => 3.5,
        },
        margin: [0, 0, 0, 10],
      },

      // ── Section 3 & 4: Two Columns (Service Breakdown + Operational Health) ──
      {
        columns: [
          // Left: Service Categories Distribution
          {
            width: '52%',
            stack: [
              { text: '3. SERVICE FREQUENCY & WORKLOAD SHARE', fontSize: 9.5, bold: true, color: '#0f172a', margin: [0, 4, 0, 4] },
              {
                table: {
                  headerRows: 1,
                  widths: ['*', 35, 45],
                  body: [
                    [
                      { text: 'SERVICE TYPE / CATEGORY', bold: true, fontSize: 7, color: '#ffffff', fillColor: '#1e293b' },
                      { text: 'COUNT', bold: true, fontSize: 7, color: '#ffffff', fillColor: '#1e293b', alignment: 'center' },
                      { text: 'SHARE', bold: true, fontSize: 7, color: '#ffffff', fillColor: '#1e293b', alignment: 'center' },
                    ],
                    ...(serviceBreakdown.length > 0
                      ? serviceBreakdown.map((item, idx) => [
                          { text: item.name, fontSize: 7.5, color: '#1e293b', fillColor: idx % 2 === 1 ? '#f8fafc' : '#ffffff' },
                          { text: String(item.count), fontSize: 7.5, alignment: 'center', fillColor: idx % 2 === 1 ? '#f8fafc' : '#ffffff' },
                          { text: `${item.percent}%`, fontSize: 7.5, bold: true, color: '#166534', alignment: 'center', fillColor: idx % 2 === 1 ? '#f8fafc' : '#ffffff' },
                        ])
                      : [
                          [
                            { text: 'No service transactions recorded in this period.', colSpan: 3, italics: true, fontSize: 7.5, color: '#94a3b8', alignment: 'center' },
                            {}, {}
                          ]
                        ]
                    ),
                  ],
                },
                layout: {
                  hLineWidth: () => 0.5,
                  vLineWidth: () => 0.5,
                  hLineColor: () => '#e2e8f0',
                  vLineColor: () => '#e2e8f0',
                  paddingLeft: () => 4,
                  paddingRight: () => 4,
                  paddingTop: () => 2.5,
                  paddingBottom: () => 2.5,
                },
              },
            ],
          },

          // Right: SLA Health & Citizen Satisfaction Evaluation
          {
            width: '46%',
            margin: [12, 0, 0, 0],
            stack: [
              { text: '4. SLA EXECUTION & CITIZEN RATINGS', fontSize: 9.5, bold: true, color: '#0f172a', margin: [0, 4, 0, 4] },
              {
                table: {
                  headerRows: 1,
                  widths: ['*', 45, 45],
                  body: [
                    [
                      { text: 'PERFORMANCE CRITERION', bold: true, fontSize: 7, color: '#ffffff', fillColor: '#1e293b' },
                      { text: 'RESULT', bold: true, fontSize: 7, color: '#ffffff', fillColor: '#1e293b', alignment: 'center' },
                      { text: 'METRIC', bold: true, fontSize: 7, color: '#ffffff', fillColor: '#1e293b', alignment: 'center' },
                    ],
                    [
                      { text: 'On-Time SLA Completion', fontSize: 7.5, color: '#166534', bold: true },
                      { text: String(compHealth.on_time || 0), fontSize: 7.5, alignment: 'center' },
                      { text: `${compHealth.on_time_percent || 0}%`, fontSize: 7.5, bold: true, color: '#166534', alignment: 'center' },
                    ],
                    [
                      { text: 'Beyond SLA Target Time', fontSize: 7.5, color: '#b45309', fillColor: '#fffbeb' },
                      { text: String(compHealth.beyond_time || 0), fontSize: 7.5, alignment: 'center', fillColor: '#fffbeb' },
                      { text: `${compHealth.beyond_time_percent || 0}%`, fontSize: 7.5, bold: true, color: '#b45309', alignment: 'center', fillColor: '#fffbeb' },
                    ],
                    [
                      { text: 'Incomplete / Suspended Jobs', fontSize: 7.5, color: '#be123c' },
                      { text: String(compHealth.not_completed || 0), fontSize: 7.5, alignment: 'center' },
                      { text: `${compHealth.not_completed_percent || 0}%`, fontSize: 7.5, bold: true, color: '#be123c', alignment: 'center' },
                    ],
                    [
                      { text: 'Client Courtesy & Demeanor', fontSize: 7.5, color: '#334155', fillColor: '#f8fafc' },
                      { text: ratings.avg_courtesy ? `${parseFloat(ratings.avg_courtesy).toFixed(2)}` : 'N/A', fontSize: 7.5, alignment: 'center', fillColor: '#f8fafc' },
                      { text: '/ 5.00', fontSize: 7, color: '#64748b', alignment: 'center', fillColor: '#f8fafc' },
                    ],
                    [
                      { text: 'Quality of Workmanship', fontSize: 7.5, color: '#334155' },
                      { text: ratings.avg_quality ? `${parseFloat(ratings.avg_quality).toFixed(2)}` : 'N/A', fontSize: 7.5, alignment: 'center' },
                      { text: '/ 5.00', fontSize: 7, color: '#64748b', alignment: 'center' },
                    ],
                    [
                      { text: 'Service Timeliness & Speed', fontSize: 7.5, color: '#334155', fillColor: '#f8fafc' },
                      { text: ratings.avg_timeliness ? `${parseFloat(ratings.avg_timeliness).toFixed(2)}` : 'N/A', fontSize: 7.5, alignment: 'center', fillColor: '#f8fafc' },
                      { text: '/ 5.00', fontSize: 7, color: '#64748b', alignment: 'center', fillColor: '#f8fafc' },
                    ],
                    [
                      { text: 'Worksite Cleanliness', fontSize: 7.5, color: '#334155' },
                      { text: ratings.avg_cleanliness ? `${parseFloat(ratings.avg_cleanliness).toFixed(2)}` : 'N/A', fontSize: 7.5, alignment: 'center' },
                      { text: '/ 5.00', fontSize: 7, color: '#64748b', alignment: 'center' },
                    ],
                    [
                      { text: 'OVERALL CSAT COMPOSITE', bold: true, fontSize: 7.5, color: '#166534', fillColor: '#f0fdf4' },
                      { text: ratings.overall_avg ? `${parseFloat(ratings.overall_avg).toFixed(2)}` : 'N/A', bold: true, fontSize: 8, color: '#166534', alignment: 'center', fillColor: '#f0fdf4' },
                      { text: '/ 5.00', fontSize: 7, bold: true, color: '#166534', alignment: 'center', fillColor: '#f0fdf4' },
                    ],
                  ],
                },
                layout: {
                  hLineWidth: () => 0.5,
                  vLineWidth: () => 0.5,
                  hLineColor: () => '#e2e8f0',
                  vLineColor: () => '#e2e8f0',
                  paddingLeft: () => 4,
                  paddingRight: () => 4,
                  paddingTop: () => 2.5,
                  paddingBottom: () => 2.5,
                },
              },
            ],
          },
        ],
        margin: [0, 0, 0, 10],
      },

      // ── Section 5: Primary Operational Bottlenecks & Delay Barriers ──────────
      {
        text: '5. OPERATIONAL CONSTRAINTS & ROOT-CAUSE ANALYSIS',
        fontSize: 9.5,
        bold: true,
        color: '#0f172a',
        margin: [0, 2, 0, 3],
      },
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              {
                stack: [
                  { text: 'Identified Execution Barriers & Causes:', bold: true, fontSize: 7.5, color: '#475569', margin: [0, 0, 0, 2] },
                  delayReasons.length > 0
                    ? {
                        ul: delayReasons.map(r => ({
                          text: `${r.reason}: ${r.count} incident(s)`,
                          fontSize: 7,
                          color: '#334155'
                        })),
                      }
                    : { text: '• No critical delays or impediments reported for this period.', fontSize: 7, color: '#64748b' }
                ],
              },
              {
                stack: [
                  { text: 'Citizen Satisfaction Evaluation Index:', bold: true, fontSize: 7.5, color: '#475569', margin: [0, 0, 0, 2] },
                  {
                    text: [
                      { text: 'Qualitative Assessment: ', fontSize: 7, color: '#64748b' },
                      { text: `${getQualitativeRating(ratings.overall_avg)}\n`, bold: true, fontSize: 7.5, color: '#166534' },
                      { text: `Total Survey Responses: ${ratings.total_feedbacks || 0} client feedback entries verified under ISO 9001 Citizen Charter protocols.`, fontSize: 7, color: '#475569' }
                    ]
                  }
                ],
              }
            ]
          ]
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#e2e8f0',
          vLineColor: () => '#e2e8f0',
          paddingLeft: () => 6,
          paddingRight: () => 6,
          paddingTop: () => 4,
          paddingBottom: () => 4,
        },
        margin: [0, 0, 0, 14],
      },

      // ── Section 6: Official Tripartite Sign-off & Certification Block ────────
      {
        text: '6. ADMINISTRATIVE ATTESTATION & SIGN-OFF',
        fontSize: 9.5,
        bold: true,
        color: '#0f172a',
        margin: [0, 0, 0, 6],
      },
      {
        table: {
          widths: ['*', '*', '*'],
          body: [
            [
              {
                stack: [
                  { text: 'Prepared & Extracted by:', fontSize: 7.5, color: '#64748b', alignment: 'center' },
                  { text: ' ', fontSize: 24 }, // Signature line spacing
                  { canvas: [{ type: 'line', x1: 10, y1: 0, x2: 150, y2: 0, lineWidth: 0.8, lineColor: '#1e293b' }] },
                  { text: 'GSO MANAGEMENT INFO SYSTEM', fontSize: 8, bold: true, color: '#0f172a', alignment: 'center', margin: [0, 2, 0, 0] },
                  { text: 'Records & Analytics Division', fontSize: 7, color: '#64748b', alignment: 'center' },
                  { text: `Date: ${generatedAt}`, fontSize: 6.5, color: '#94a3b8', alignment: 'center', margin: [0, 1, 0, 0] },
                ],
              },
              {
                stack: [
                  { text: 'Reviewed & Verified by:', fontSize: 7.5, color: '#64748b', alignment: 'center' },
                  { text: ' ', fontSize: 24 }, // Signature line spacing
                  { canvas: [{ type: 'line', x1: 10, y1: 0, x2: 150, y2: 0, lineWidth: 0.8, lineColor: '#1e293b' }] },
                  { text: 'UNIT HEADS / CHIEF OF SSU', fontSize: 8, bold: true, color: '#0f172a', alignment: 'center', margin: [0, 2, 0, 0] },
                  { text: 'FGMU • LEAU • SSU', fontSize: 7, color: '#64748b', alignment: 'center' },
                  { text: 'Date: ________________________', fontSize: 6.5, color: '#94a3b8', alignment: 'center', margin: [0, 1, 0, 0] },
                ],
              },
              {
                stack: [
                  { text: 'Approved & Accepted by:', fontSize: 7.5, color: '#64748b', alignment: 'center' },
                  { text: ' ', fontSize: 24 }, // Signature line spacing
                  { canvas: [{ type: 'line', x1: 10, y1: 0, x2: 150, y2: 0, lineWidth: 0.8, lineColor: '#1e293b' }] },
                  { text: directorName.toUpperCase(), fontSize: 8, bold: true, color: '#166534', alignment: 'center', margin: [0, 2, 0, 0] },
                  { text: 'Director, General Services Office', fontSize: 7, bold: true, color: '#0f172a', alignment: 'center' },
                  { text: 'Benguet State University', fontSize: 6.5, color: '#64748b', alignment: 'center' },
                ],
              },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 0,
          vLineWidth: () => 0,
          paddingLeft: () => 4,
          paddingRight: () => 4,
          paddingTop: () => 2,
          paddingBottom: () => 2,
        },
      },
    ],
  };
};

/**
 * Generates the official BSU GSO Executive Report PDF as a Blob.
 * @param {Object} reportData - Data payload returned by /api/v1/director/analytics
 * @returns {Promise<Blob>}
 */
export const generateDirectorReportBlob = async (reportData) => {
  const [pdfMake, logoDataUrl] = await Promise.all([
    getPdfMake(),
    getLogoDataUrl(),
  ]);

  const docDef = buildDirectorReportDocDefinition(reportData, logoDataUrl);

  return new Promise((resolve, reject) => {
    try {
      pdfMake.createPdf(docDef).getBlob((blob) => {
        resolve(blob);
      });
    } catch (err) {
      reject(err);
    }
  });
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
