import { generateDocxBlob, generateDocx } from '@/utils/docxGenerator';
import api from '@/api/client';

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
 * @param {Object} ticket - Enriched ticket object (or wrapped in { ticket })
 * @param {Object} [feedbackData] - Optional feedback submission object
 * @returns {Object} Template data mapping
 */
export const buildFgmuTemplateData = (ticket = {}, feedbackData = null) => {
  // Defensively unwrap if wrapped in { ticket: ... }
  const t = ticket.ticket || ticket || {};
  const details = t.details || {};
  const assignment = t.assignment || (Array.isArray(t.assignments) && t.assignments[0]) || {};
  const feedback = feedbackData || t.feedback || {};

  // 1. Filing date (when ticket intake was submitted)
  const dateFiling = formatDocDate(t.submitted_at || t.created_at || t.date || new Date());

  // 2. Implementation / Start date (when workers are scheduled/dispatched to start)
  const dateStarted = formatDocDate(
    assignment.implementation_date ||
    assignment.dispatched_at ||
    t.implementationDate ||
    t.implementation_date ||
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

  const contactNum = (
    t.contact_number ||
    t.requester_contact ||
    details.contact_number ||
    t.user?.contact_number ||
    t.user?.requester_contact ||
    ''
  ).trim();

  const requestor = contactNum && contactNum !== 'N/A' && !baseRequestor.includes(contactNum)
    ? `${baseRequestor} (Tel: ${contactNum})`
    : baseRequestor;

  // 6. Target Working Days Duration
  const workingDays = String(
    t.working_days ||
    t.project_working_days ||
    assignment.working_days ||
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

  // 8. Assigned Personnel Extraction (Personnel_1 .. Personnel_4)
  let rawWorkers = [];
  if (Array.isArray(t.assignments) && t.assignments.length > 0) {
    t.assignments.forEach(a => {
      const name = a.personnel_name || a.assigned_to_name || a.name || '';
      if (name) rawWorkers.push(...name.split(/[,;\n]+/));
    });
  }
  if (Array.isArray(t.personnel) && t.personnel.length > 0) {
    t.personnel.forEach(p => {
      const name = typeof p === 'string' ? p : (p.name || p.personnel_name || '');
      if (name) rawWorkers.push(...name.split(/[,;\n]+/));
    });
  }
  const fallbackWorkers = assignment.personnel_name || t.assignedWorker || t.assigned_worker || t.assigned_personnel || '';
  if (fallbackWorkers && typeof fallbackWorkers === 'string') {
    rawWorkers.push(...fallbackWorkers.split(/[,;\n]+/));
  }

  const personnelNames = Array.from(new Set(rawWorkers.map(n => n.trim()))).filter(name => {
    const lower = name.toLowerCase();
    return lower && lower !== 'unassigned' && lower !== 'n/a' && lower !== 'none';
  });

  const personnel1 = personnelNames[0] || '';
  const personnel2 = personnelNames[1] || '';
  const personnel3 = personnelNames[2] || '';
  const personnel4 = personnelNames[3] || '';

  // 9. Dispatcher & Task Remarks
  let remarks = (
    feedback.remarks ||
    t.remarks ||
    assignment.dispatcher_notes ||
    assignment.task_notes ||
    assignment.instructions ||
    assignment.task_briefing ||
    ''
  ).trim();

  if (!remarks) {
    remarks = isCompleted ? 'Work completed satisfactorily.' : 'Work order issued. Awaiting job execution.';
  }

  const ticketRef = String(t.ticket_number || t.reference_number || t.ticketRef || t.ticketId || t.id || '0000');
  const jrNo = details.jr_no || t.jr_no || ticketRef;

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
    JR_No: jrNo,
    'JR No.': jrNo,
    JR_no: jrNo,
    ticketId: String(t.ticketId || t.id || '0000'),
    ticketRef: ticketRef,
  };
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
  const ticketId = ticket.ticketId || ticket.id || 'document';
  const templateData = buildFgmuTemplateData(ticket, feedbackData);
  await generateDocx(
    '/templates/FGMU Job Request Form.docx',
    templateData,
    `FGMU Job Request Form - #${ticketId}.docx`
  );
};
