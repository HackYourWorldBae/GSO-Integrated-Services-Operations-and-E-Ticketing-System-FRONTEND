import { generateDocxBlob, generateDocx } from '@/utils/docxGenerator';
import api from '@/api/client';

/**
 * Format a Date object or ISO date string into standard document date format (e.g. "Sep 15, 2026").
 * @param {string|Date} dateVal 
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

/**
 * Maps ticket and feedback records into the exact template placeholder dictionary
 * expected by the "FGMU Job Request Form.docx" template.
 *
 * Available placeholders in template:
 *  {Date}
 *  {Building}
 *  {Room}
 *  {Fund}
 *  {Requestor}
 *  {Working_days}
 *  {Date_started}
 *  {Date Completed}
 *  {Job_particulars}
 *  {Personnel_1}
 *  {Personnel_2}
 *  {Personnel_3}
 *  {Personnel_4}
 *  {Remarks}
 *
 * @param {Object} ticket - Enriched ticket object
 * @param {Object} [feedbackData] - Optional feedback submission object { remarks, quality_rating, etc. }
 * @returns {Object} Template data mapping
 */
export const buildFgmuTemplateData = (ticket = {}, feedbackData = null) => {
  const details = ticket.details || {};
  const assignment = ticket.assignment || {};
  const feedback = feedbackData || ticket.feedback || {};

  // Extract date values
  const dateFiling = formatDocDate(ticket.submitted_at || ticket.created_at || ticket.date || new Date());
  const dateStarted = formatDocDate(
    assignment.dispatched_at ||
    assignment.implementation_date ||
    ticket.scheduled_date ||
    ticket.implementationDate ||
    assignment.assigned_at ||
    ''
  );
  const isCompleted = ticket.status === 'closed' || ticket.status === 'resolved' || !!ticket.completed_at;
  const dateCompleted = isCompleted ? formatDocDate(ticket.completed_at || ticket.updated_at) : '—';

  // Extract building & room
  const building = details.college_building || ticket.location || details.location || ticket.college_building || 'N/A';
  const room = details.office_room || ticket.office_room || ticket.officeRoom || 'N/A';
  const fund = details.source_of_fund || ticket.source_of_fund || ticket.sourceOfFund || 'N/A';

  // Requestor name + contact number
  const baseRequestor = details.end_user || details.requesting_personnel || ticket.requestedBy || ticket.requested_by || ticket.user_name || ticket.requester || 'N/A';
  const contactNum = ticket.contact_number || ticket.requester_contact || details.contact_number || ticket.user?.contact_number || '';
  const requestor = contactNum && contactNum !== 'N/A' && !baseRequestor.includes(contactNum)
    ? `${baseRequestor} (Tel: ${contactNum})`
    : baseRequestor;

  // Working days duration
  const workingDays = String(
    ticket.working_days ||
    ticket.project_working_days ||
    assignment.working_days ||
    ticket.workingDays ||
    '1'
  );

  // Job description / particulars
  let jobParticulars = (
    ticket.description ||
    ticket.job_description ||
    ticket.title ||
    ticket.service_type ||
    ticket.service ||
    'General maintenance and repair service.'
  ).trim();

  const serviceCategory = ticket.service || ticket.service_type || ticket.type;
  if (serviceCategory && serviceCategory !== 'General' && !jobParticulars.toLowerCase().includes(serviceCategory.toLowerCase())) {
    jobParticulars = `[${serviceCategory}]\n${jobParticulars}`;
  }

  // Robust parsing of assigned personnel into Personnel_1 .. Personnel_4
  let personnelNames = [];
  if (Array.isArray(ticket.assignments) && ticket.assignments.length > 0) {
    personnelNames = ticket.assignments
      .map(a => a.personnel_name || a.assigned_to_name || a.name)
      .filter(Boolean);
  } else if (Array.isArray(ticket.personnel) && ticket.personnel.length > 0) {
    personnelNames = ticket.personnel
      .map(p => (typeof p === 'string' ? p : (p.name || p.personnel_name)))
      .filter(Boolean);
  } else {
    const rawPersonnel = 
      assignment.personnel_name || 
      ticket.assignedWorker || 
      ticket.assigned_worker || 
      ticket.assigned_personnel || 
      '';
    if (rawPersonnel && typeof rawPersonnel === 'string') {
      personnelNames = rawPersonnel.split(/[,;\n]+/).map(n => n.trim()).filter(Boolean);
    }
  }

  // Deduplicate and filter out 'Unassigned', 'N/A', 'None', etc.
  personnelNames = Array.from(new Set(personnelNames))
    .filter(name => {
      const lower = String(name).toLowerCase().trim();
      return lower !== 'unassigned' && lower !== 'n/a' && lower !== 'none' && lower !== '';
    });

  const personnel1 = personnelNames[0] || '';
  const personnel2 = personnelNames[1] || '';
  const personnel3 = personnelNames[2] || '';
  const personnel4 = personnelNames[3] || '';

  // Performance evaluation / remarks
  let remarks = (feedback.remarks || ticket.remarks || assignment.instructions || assignment.task_briefing || '').trim();
  if (!remarks) {
    remarks = isCompleted ? 'Work completed satisfactorily.' : 'Work order issued. Awaiting job execution.';
  }

  const ticketRef = String(ticket.ticket_number || ticket.reference_number || ticket.ticketRef || ticket.ticketId || ticket.id || '0000');

  return {
    Date: dateFiling,
    Building: building,
    Room: room,
    Fund: fund,
    Requestor: requestor,
    Working_days: workingDays,
    'Working_days': workingDays,
    ' Working_days ': workingDays,
    Date_started: dateStarted,
    'Date_started': dateStarted,
    ' Date_started ': dateStarted,
    'Date Completed': dateCompleted,
    Date_completed: dateCompleted,
    Job_particulars: jobParticulars,
    Personnel_1: personnel1,
    Personnel_2: personnel2,
    Personnel_3: personnel3,
    Personnel_4: personnel4,
    Remarks: remarks,
    JR_No: ticketRef,
    'JR No.': ticketRef,
  };
};

/**
 * Converts a filled DOCX Blob into a real vector/raster PDF Blob using docx-preview and html2pdf.js.
 * Runs completely client-side in the browser.
 * @param {Blob} docxBlob 
 * @param {string} [filename]
 * @returns {Promise<Blob>}
 */
export const convertDocxBlobToPdfBlob = async (docxBlob, filename = 'FGMU_Job_Request_Form.pdf') => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('convertDocxBlobToPdfBlob requires a browser DOM environment.');
  }

  const { renderAsync } = await import('docx-preview');
  const html2pdf = (await import('html2pdf.js')).default;

  // Rendering container: Must NOT use left: -99999px because html2canvas ignores / clips
  // elements outside viewport boundaries. Instead, position it fixed at (0, 0) with opacity 0.01
  // and pointer-events: none so it is invisible to users but has positive layout coordinates for html2canvas.
  const container = document.createElement('div');
  container.className = 'docx-pdf-render-offscreen';
  container.style.position = 'fixed';
  container.style.left = '0';
  container.style.top = '0';
  container.style.width = '816px'; // 8.5in at 96 DPI
  container.style.minHeight = '1056px';
  container.style.background = '#ffffff';
  container.style.color = '#000000';
  container.style.zIndex = '-99999';
  container.style.opacity = '0.01';
  container.style.pointerEvents = 'none';
  document.body.appendChild(container);

  try {
    await renderAsync(docxBlob, container, undefined, {
      className: 'docx-preview',
      inWrapper: false,
      ignoreWidth: false,
      ignoreHeight: false,
      breakPages: true,
      renderHeaders: true,
      renderFooters: true,
      renderFootnotes: true,
      renderEndnotes: true,
    });

    // Wait for docx-preview styling, layout calculations, and embedded images to settle
    await new Promise(resolve => setTimeout(resolve, 400));

    const opt = {
      margin: [6, 6, 6, 6],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        windowWidth: 816,
        onclone: (clonedDoc) => {
          const el = clonedDoc.querySelector('.docx-pdf-render-offscreen');
          if (el) {
            el.style.opacity = '1';
            el.style.zIndex = '1';
          }
        },
      },
      jsPDF: {
        unit: 'mm',
        format: 'letter',
        orientation: 'portrait',
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };

    const pdfBlob = await html2pdf().set(opt).from(container).outputPdf('blob');
    return pdfBlob;
  } finally {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
};

/**
 * Generates the FGMU Job Request Form Docx file as a Blob by filling public/templates/FGMU Job Request Form.docx.
 * @param {Object} ticket - Ticket data
 * @param {Object} [feedbackData] - User feedback data
 * @returns {Promise<Blob>}
 */
export const generateFgmuJobRequestFormDocxBlob = async (ticket, feedbackData = null) => {
  const templateData = buildFgmuTemplateData(ticket, feedbackData);
  return await generateDocxBlob('/templates/FGMU Job Request Form.docx', templateData);
};

// Alias for backwards compatibility
export const generateFgmuJobRequestFormBlob = generateFgmuJobRequestFormDocxBlob;

/**
 * Generates the FGMU Job Request Form filled from /templates/FGMU Job Request Form.docx
 * and converts it into a genuine PDF Blob.
 * @param {Object} ticket
 * @param {Object} [feedbackData]
 * @returns {Promise<Blob>}
 */
export const generateFgmuJobRequestFormPdfBlob = async (ticket, feedbackData = null) => {
  const ticketId = ticket.ticketId || ticket.id || 'document';
  const docxBlob = await generateFgmuJobRequestFormDocxBlob(ticket, feedbackData);
  return await convertDocxBlobToPdfBlob(docxBlob, `FGMU Job Request Form - #${ticketId}.pdf`);
};

/**
 * Generates and automatically uploads the FGMU Job Request Form as a permanent attachment to the ticket.
 * @param {Object} ticket - Ticket data
 * @param {Object} [feedbackData] - Feedback data
 * @returns {Promise<Object>} API Response
 */
export const attachFgmuJobRequestForm = async (ticket, feedbackData = null) => {
  const ticketId = ticket.ticketId || ticket.id;
  if (!ticketId) {
    throw new Error('Ticket ID is required to attach document.');
  }

  const [docxBlob, pdfBlob] = await Promise.all([
    generateFgmuJobRequestFormDocxBlob(ticket, feedbackData),
    generateFgmuJobRequestFormPdfBlob(ticket, feedbackData).catch(err => {
      console.warn('PDF conversion warning during attachment:', err);
      return null;
    }),
  ]);

  const formData = new FormData();
  if (pdfBlob) {
    formData.append('attachments[]', pdfBlob, `FGMU Job Request Form - #${ticketId}.pdf`);
  }
  formData.append('attachments[]', docxBlob, `FGMU Job Request Form - #${ticketId}.docx`);

  return await api.post(`tickets/${ticketId}/attachments`, formData, {
    headers: { 'Content-Type': undefined },
  });
};

/**
 * Generates and downloads the FGMU Job Request Form Word document directly.
 * @param {Object} ticket - Ticket data
 * @param {Object} [feedbackData] - Feedback data
 */
export const downloadFgmuJobRequestForm = async (ticket, feedbackData = null) => {
  const ticketId = ticket.ticketId || ticket.id || 'document';
  const templateData = buildFgmuTemplateData(ticket, feedbackData);
  await generateDocx(
    '/templates/FGMU Job Request Form.docx',
    templateData,
    `FGMU Job Request Form - #${ticketId}.docx`
  );
};

/**
 * Generates and downloads the FGMU Job Request Form as a PDF directly.
 * @param {Object} ticket
 * @param {Object} [feedbackData]
 */
export const downloadFgmuJobRequestFormPdf = async (ticket, feedbackData = null) => {
  const ticketId = ticket.ticketId || ticket.id || 'document';
  const pdfBlob = await generateFgmuJobRequestFormPdfBlob(ticket, feedbackData);
  const url = window.URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `FGMU Job Request Form - #${ticketId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
