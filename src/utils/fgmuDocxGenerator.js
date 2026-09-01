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
  const dateCompleted = formatDocDate(
    ticket.completed_at ||
    ticket.updated_at ||
    new Date()
  );

  // Extract building & room
  const building = details.college_building || ticket.location || details.location || 'N/A';
  const room = details.office_room || ticket.office_room || 'N/A';
  const fund = details.source_of_fund || 'N/A';

  // Requestor name
  const requestor = details.end_user || details.requesting_personnel || ticket.requestedBy || ticket.user_name || 'N/A';

  // Working days duration
  const workingDays = String(
    ticket.working_days ||
    ticket.project_working_days ||
    assignment.working_days ||
    'N/A'
  );

  // Job description / particulars
  const jobParticulars = (
    ticket.description ||
    ticket.job_description ||
    ticket.title ||
    ticket.service_type ||
    'General maintenance and repair service.'
  ).trim();

  // Parse assigned personnel into Personnel_1 .. Personnel_4
  const rawPersonnel = assignment.personnel_name || ticket.assignedWorker || '';
  const personnelList = rawPersonnel
    ? rawPersonnel.split(',').map(name => name.trim()).filter(Boolean)
    : [];

  const personnel1 = personnelList[0] || (typeof rawPersonnel === 'string' && rawPersonnel !== 'Unassigned' ? rawPersonnel : '');
  const personnel2 = personnelList[1] || '';
  const personnel3 = personnelList[2] || '';
  const personnel4 = personnelList[3] || '';

  // Performance evaluation / remarks
  const remarks = (feedback.remarks || '').trim() || 'Work completed satisfactorily.';

  return {
    Date: dateFiling,
    Building: building,
    Room: room,
    Fund: fund,
    Requestor: requestor,
    Working_days: workingDays,
    Date_started: dateStarted,
    'Date Completed': dateCompleted,
    Job_particulars: jobParticulars,
    Personnel_1: personnel1,
    Personnel_2: personnel2,
    Personnel_3: personnel3,
    Personnel_4: personnel4,
    Remarks: remarks,
  };
};

/**
 * Generates the FGMU Job Request Form Docx file as a Blob.
 * @param {Object} ticket - Ticket data
 * @param {Object} [feedbackData] - User feedback data
 * @returns {Promise<Blob>}
 */
export const generateFgmuJobRequestFormBlob = async (ticket, feedbackData = null) => {
  const templateData = buildFgmuTemplateData(ticket, feedbackData);
  return await generateDocxBlob('/templates/FGMU Job Request Form.docx', templateData);
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

  const docBlob = await generateFgmuJobRequestFormBlob(ticket, feedbackData);
  const fileName = `FGMU Job Request Form - #${ticketId}.docx`;

  const formData = new FormData();
  formData.append('attachments[]', docBlob, fileName);

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
