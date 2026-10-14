import { generateDocxBlob, generateDocx } from '@/utils/docxGenerator';
import api from '@/api/client';
import { fetchDocumentSignatures } from '@/utils/signatureUtils';
import { loadImageAsPngDataUrl } from '@/utils/imageUtils';

/**
 * Format a Date object or ISO date string into standard document date format (e.g. "Sep 15, 2026").
 * @param {string|Date} dateVal 
 * @returns {string}
 */
export const formatDocDate = (dateVal) => {
  if (!dateVal) return '';
  if (typeof dateVal === 'string') {
    const ymdMatch = dateVal.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (ymdMatch) {
      const [_, y, m, d] = ymdMatch;
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIdx = parseInt(m, 10) - 1;
      if (monthIdx >= 0 && monthIdx < 12) {
        return `${monthNames[monthIdx]} ${parseInt(d, 10)}, ${y}`;
      }
    }
  }
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
 *  {contact_no}
 *  {Working_days}
 *  {Date_started}
 *  {Date Completed}
 *  {Job_particulars}
 *  {Personnel_1} .. {Personnel_10}
 *  {Approved_by}
 *  {Unit&Role} / {Unit&amp;Role}
 *  {Approval_Date}
 *  {Issued_by}
 *  {Unit}
 *  {Remarks}
 *
 * @param {Object} ticket - Enriched ticket object (or wrapped in { ticket })
 * @param {Object} [feedbackData] - Optional feedback submission object
 * @param {Object} [signaturesMeta] - Optional signatures metadata from /auth/document-signatures
 * @returns {Object} Template data mapping
 */
export const buildFgmuTemplateData = (ticket = {}, feedbackData = null, signaturesMeta = null) => {
  // Defensively unwrap if wrapped in { ticket: ... }
  const t = ticket.ticket || ticket || {};
  const details = t.details || {};
  const assignment = t.assignment || (Array.isArray(t.assignments) && t.assignments[t.assignments.length - 1]) || (Array.isArray(t.assignments) && t.assignments[0]) || {};
  const feedback = feedbackData || t.feedback || {};

  // 1. Filing date (when ticket intake was submitted)
  const dateFiling = formatDocDate(t.submitted_at || t.created_at || t.date || new Date());

  // 2. Implementation / Start date (when workers are scheduled/dispatched to start)
  const dateStarted = formatDocDate(
    assignment.implementation_date ||
    t.implementationDate ||
    t.implementation_date ||
    assignment.dispatched_at ||
    t.scheduled_date ||
    t.project_target_date ||
    assignment.assigned_at ||
    t.submitted_at ||
    t.created_at ||
    ''
  );

  // 3. Completion date
  const isCompleted = t.status === 'closed' || t.status === 'resolved' || t.status === 'completed' || !!t.completed_at;
  const dateCompleted = isCompleted ? formatDocDate(t.completed_at || t.updated_at) : '—';

  // 4. Physical Location (Building & Room)
  const building = details.college_building || t.college_building || t.location || details.location || 'Campus Facility';
  const room = details.office_room || t.office_room || t.officeRoom || details.room || 'N/A';
  const fund = details.source_of_fund || t.source_of_fund || t.sourceOfFund || details.fund || 'N/A';

  // 5. True Requestor name & contact number
  const userFullName = t.user ? `${t.user.first_name || ''} ${t.user.last_name || ''}`.trim() : '';
  const directFullName = (t.first_name || t.last_name) ? `${t.first_name || ''} ${t.last_name || ''}`.trim() : '';
  const baseRequestor = (
    t.requestedBy ||
    t.requested_by ||
    t.requester ||
    details.requesting_personnel ||
    details.end_user ||
    userFullName ||
    directFullName ||
    t.user_name ||
    'End User'
  ).trim();

  const contactNo = (
    t.contact_number ||
    t.requester_contact ||
    details.contact_number ||
    details.contact_no ||
    t.details?.contact_number ||
    t.details?.contact_no ||
    t.user?.contact_number ||
    t.user?.requester_contact ||
    ''
  ).trim();

  const requestor = baseRequestor;

  // 6. Target Working Days Duration
  const workingDays = String(
    t.working_days ||
    assignment.working_days ||
    t.project_working_days ||
    t.workingDays ||
    t.total_working_days ||
    t.eodb_days ||
    '1'
  );

  // 7. Nature of Work / Job Particulars
  let jobParticulars = (
    t.job_description ||
    t.description ||
    t.title ||
    t.project_title ||
    t.service_type ||
    t.service ||
    'General maintenance and repair service.'
  ).trim();

  const serviceCategory = t.service || t.service_type || t.type;
  if (serviceCategory && serviceCategory !== 'General' && !jobParticulars.toLowerCase().includes(serviceCategory.toLowerCase())) {
    jobParticulars = `[${serviceCategory}]\n${jobParticulars}`;
  }

  // 8. Assigned Personnel Extraction (Personnel_1 .. Personnel_10)
  let rawWorkers = [];
  if (Array.isArray(t.assignments) && t.assignments.length > 0) {
    t.assignments.forEach(a => {
      const name = a.personnel_name || a.assigned_to_name || a.worker_name || a.name || a.personnel?.name || a.worker?.name || '';
      if (name) rawWorkers.push(...name.split(/[,;\n]+/));
    });
  }
  if (Array.isArray(t.my_unit_assignments) && t.my_unit_assignments.length > 0) {
    t.my_unit_assignments.forEach(a => {
      const name = a.worker_name || a.personnel_name || a.name || '';
      if (name) rawWorkers.push(...name.split(/[,;\n]+/));
    });
  }
  if (Array.isArray(t.other_unit_assignments) && t.other_unit_assignments.length > 0) {
    t.other_unit_assignments.forEach(a => {
      const name = a.worker_name || a.personnel_name || a.name || '';
      if (name) rawWorkers.push(...name.split(/[,;\n]+/));
    });
  }
  if (Array.isArray(t.personnel) && t.personnel.length > 0) {
    t.personnel.forEach(p => {
      const name = typeof p === 'string' ? p : (p.name || p.personnel_name || '');
      if (name) rawWorkers.push(...name.split(/[,;\n]+/));
    });
  }
  const fallbackWorkers = assignment.personnel_name || assignment.worker_name || t.assignedWorker || t.assigned_worker || t.assigned_personnel || '';
  if (fallbackWorkers && typeof fallbackWorkers === 'string') {
    rawWorkers.push(...fallbackWorkers.split(/[,;\n]+/));
  }

  const personnelNames = Array.from(new Set(rawWorkers.map(n => n.trim()))).filter(name => {
    const lower = name.toLowerCase();
    return lower && lower !== 'unassigned' && lower !== 'n/a' && lower !== 'none';
  });

  const personnelData = {};
  for (let i = 1; i <= 10; i++) {
    const pName = personnelNames[i - 1] || '';
    personnelData[`Personnel_${i}`] = pName;
    personnelData[`personnel_${i}`] = pName;
    personnelData[`Personnel${i}`] = pName;
  }

  // 9. Dispatcher & Task Remarks
  const remarks = (
    feedback.remarks ||
    t.remarks ||
    details.remarks ||
    ''
  ).trim();

  const ticketRef = String(t.ticket_number || t.reference_number || t.ticketRef || t.ticketId || t.id || '0000');
  const jrNo = details.jr_no || t.jr_no || ticketRef;

  // 10. Unit Code
  const isLeau = t.unit_code === 'LEAU' || t.unit === 'LEAU' || t.unit_id === 2 || (typeof t.id === 'string' && t.id.includes('LEAU'));
  const unitCode = isLeau ? 'LEAU' : 'FGMU';

  // 11. Approver Identification (Approved By)
  // Check enriched user, or fallback to ticket fields / signatures metadata
  const revUser = t.reviewed_by_user || null;
  const isDirectorApprover = (revUser?.role === 'director')
    || (t.reviewer_role === 'director')
    || (!revUser && !t.reviewer_name && !!signaturesMeta?.director);

  const approverName = (
    revUser?.name ||
    t.reviewer_name ||
    t.approved_by ||
    (isDirectorApprover ? signaturesMeta?.director?.name : signaturesMeta?.dispatcher?.name) ||
    (signaturesMeta?.director?.name || '')
  ).trim();

  // Role placeholder {Unit&Role}
  // If the one who approved is the director -> "Director" (template renders GSO-{Unit&Role} -> GSO-Director)
  // If unit head approved -> "${unitCode} Head" (template renders GSO-{Unit&Role} -> GSO-FGMU Head)
  const unitAndRole = isDirectorApprover ? 'Director' : `${unitCode} Head`;

  // Approval Date {Approval_Date}
  const isApprovedOrLater = ['approved', 'processing', 'resolved', 'closed'].includes(t.status) || !!t.reviewed_at || !!assignment.assigned_at;
  const rawApprovalDate = t.reviewed_at || t.approved_at || assignment.assigned_at || (isApprovedOrLater ? (t.created_at || new Date()) : null);
  const approvalDate = rawApprovalDate ? formatDocDate(rawApprovalDate) : '';

  // 12. Issuer Identification (JR Issued By)
  // "same for the issued by which is mostly the unit head... (issued by happens after dispatch)"
  const dispUser = t.dispatched_by_user || null;
  const issuerName = (
    dispUser?.name ||
    t.dispatcher_name ||
    signaturesMeta?.dispatcher?.name ||
    (dispUser?.role === 'director' ? (signaturesMeta?.director?.name || '') : '') ||
    ''
  ).trim();

  return {
    Date: dateFiling,
    Building: building,
    Room: room,
    Fund: fund,
    Requestor: requestor,
    requestor: requestor,
    Requester: requestor,
    requester: requestor,
    contact_no: contactNo,
    Contact_no: contactNo,
    'contact_no': contactNo,
    contact_number: contactNo,
    Working_days: workingDays,
    'Working_days': workingDays,
    ' Working_days ': workingDays,
    Date_started: dateStarted,
    'Date_started': dateStarted,
    ' Date_started ': dateStarted,
    'Date Completed': dateCompleted,
    Date_completed: dateCompleted,
    Job_particulars: jobParticulars,
    ...personnelData,
    Remarks: remarks,
    remarks: remarks,
    JR_No: jrNo,
    'JR No.': jrNo,
    JR_no: jrNo,
    ticketId: String(t.ticketId || t.id || '0000'),
    ticketRef: ticketRef,
    unitCode: unitCode,

    // Dynamic Approval Placeholders
    Approved_by: approverName,
    approved_by: approverName,
    'Approved_by': approverName,
    'Unit&Role': unitAndRole,
    'Unit&amp;Role': unitAndRole,
    'Unit & Role': unitAndRole,
    'unit_and_role': unitAndRole,
    UnitAndRole: unitAndRole,
    Approval_Date: approvalDate,
    approval_date: approvalDate,
    'Approval_Date': approvalDate,

    // Dynamic Issuer Placeholders
    Issued_by: issuerName,
    issued_by: issuerName,
    'Issued_by': issuerName,
    Unit: unitCode,
    unit: unitCode,
    'Unit': unitCode,
  };
};

/**
 * Generates the FGMU Job Request Form Docx file as a Blob by filling public/templates/FGMU Job Request Form.docx.
 * Automatically injects digital signatures slightly above the approved by and issued by placeholders.
 *
 * @param {Object} ticket - Ticket data
 * @param {Object} [feedbackData] - User feedback data
 * @returns {Promise<Blob>}
 */
export const generateFgmuJobRequestFormDocxBlob = async (ticket, feedbackData = null) => {
  const t = ticket.ticket || ticket || {};
  const isLeau = t.unit_code === 'LEAU' || t.unit === 'LEAU' || t.unit_id === 2 || (typeof t.id === 'string' && t.id.includes('LEAU'));
  const unitCode = isLeau ? 'LEAU' : 'FGMU';

  let signaturesMeta = null;
  try {
    signaturesMeta = await fetchDocumentSignatures(unitCode);
  } catch (err) {
    console.warn('Could not fetch signatures metadata for docx generation:', err);
  }

  const templateData = buildFgmuTemplateData(t, feedbackData, signaturesMeta);

  // Load signature images if available
  const images = {};
  const revUser = t.reviewed_by_user || null;
  const dispUser = t.dispatched_by_user || null;

  // 1. Approver Signature
  const isDirectorApprover = (revUser?.role === 'director')
    || (t.reviewer_role === 'director')
    || (!revUser && !t.reviewer_name && !!signaturesMeta?.director);

  const approverSigUrl = revUser?.signature_url
    || (isDirectorApprover ? signaturesMeta?.director?.signature_url : signaturesMeta?.dispatcher?.signature_url)
    || (signaturesMeta?.director?.signature_url || null);

  if (approverSigUrl && templateData.Approved_by) {
    try {
      images.approved = await loadImageAsPngDataUrl(approverSigUrl);
    } catch (e) {
      console.warn('Could not load approver signature image for docx:', e);
    }
  }

  // 2. Issuer Signature
  const issuerSigUrl = dispUser?.signature_url
    || signaturesMeta?.dispatcher?.signature_url
    || (dispUser?.role === 'director' ? (signaturesMeta?.director?.signature_url || null) : null);

  if (issuerSigUrl && templateData.Issued_by) {
    try {
      images.issued = await loadImageAsPngDataUrl(issuerSigUrl);
    } catch (e) {
      console.warn('Could not load issuer signature image for docx:', e);
    }
  }

  return await generateDocxBlob('/templates/FGMU Job Request Form.docx', templateData, { images });
};

// Alias for backwards compatibility
export const generateFgmuJobRequestFormBlob = generateFgmuJobRequestFormDocxBlob;

/**
 * Generates and automatically uploads the filled FGMU Job Request Form docx as a permanent attachment to the ticket.
 * @param {Object} ticket - Ticket data
 * @param {Object} [feedbackData] - Feedback data
 * @returns {Promise<Object>} API Response
 */
export const attachFgmuJobRequestForm = async (ticket, feedbackData = null) => {
  const t = ticket.ticket || ticket || {};
  const ticketId = t.ticketId || t.id;
  if (!ticketId) {
    throw new Error('Ticket ID is required to attach document.');
  }

  const docxBlob = await generateFgmuJobRequestFormDocxBlob(t, feedbackData);
  const unit = t.unit_code || t.unit || 'FGMU';

  const formData = new FormData();
  formData.append('attachments[]', docxBlob, `${unit}_Job_Order_#${ticketId}.docx`);

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
  const t = ticket.ticket || ticket || {};
  const ticketId = t.ticketId || t.id || 'document';
  const blob = await generateFgmuJobRequestFormDocxBlob(t, feedbackData);
  const { saveAs } = await import('file-saver');
  saveAs(blob, `FGMU Job Request Form - #${ticketId}.docx`);
};
