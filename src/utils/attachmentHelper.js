/**
 * attachmentHelper.js
 *
 * Centralized utility for handling ticket attachments, document downloads,
 * and preview routing across the GSO E-Ticketing System.
 *
 * Strict Rules:
 *  - DOCX / DOC: Direct download immediately (no preview modal).
 *  - PDF / Images: Preview in modal or new tab with options to download.
 */

import api from '@/api/client';
import { toast } from 'vue3-toastify';

/**
 * Checks if a filename or MIME type represents a Word (.docx / .doc) document.
 */
export const isDocxFile = (fileName = '', mimeType = '') => {
  const name = String(fileName || '').toLowerCase();
  const type = String(mimeType || '').toLowerCase();
  return (
    name.endsWith('.docx') ||
    name.endsWith('.doc') ||
    type.includes('wordprocessingml') ||
    type.includes('msword') ||
    type.includes('officedocument.word')
  );
};

/**
 * Checks if a filename or MIME type represents a PDF document.
 */
export const isPdfFile = (fileName = '', mimeType = '') => {
  const name = String(fileName || '').toLowerCase();
  const type = String(mimeType || '').toLowerCase();
  return name.endsWith('.pdf') || type === 'application/pdf' || type.includes('pdf');
};

/**
 * Checks if a filename or MIME type represents an image.
 */
export const isImageFile = (fileName = '', mimeType = '') => {
  const name = String(fileName || '').toLowerCase();
  const type = String(mimeType || '').toLowerCase();
  return (
    name.endsWith('.png') ||
    name.endsWith('.jpg') ||
    name.endsWith('.jpeg') ||
    name.endsWith('.webp') ||
    name.endsWith('.gif') ||
    type.startsWith('image/')
  );
};

/**
 * Triggers a browser download for a Blob.
 * @param {Blob} blob
 * @param {string} fileName
 */
export const downloadFileBlob = (blob, fileName = 'download') => {
  try {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 2000);
  } catch (err) {
    console.error('downloadFileBlob error:', err);
    throw err;
  }
};

/**
 * Directly downloads an attachment from the backend API.
 * Always used for DOCX files or when user clicks a download button.
 * @param {Object} att - { id, file_name, file_type }
 * @returns {Promise<void>}
 */
export const downloadAttachmentDirectly = async (att) => {
  if (!att || !att.id) {
    toast.error('Attachment not found.');
    return;
  }
  try {
    const response = await api.get(`attachments/${att.id}`, { responseType: 'blob' });
    const isWord = isDocxFile(att.file_name, att.file_type);
    const mime = isWord
      ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      : (att.file_type || 'application/octet-stream');
    
    const blob = new Blob([response.data], { type: mime });
    const fileName = att.file_name || (isWord ? 'document.docx' : 'attachment');
    
    downloadFileBlob(blob, fileName);
    toast.success(`Downloaded: ${fileName}`);
  } catch (error) {
    console.error('Failed to download attachment:', error);
    toast.error(`Failed to download: ${error.response?.data?.message || error.message || 'Network error'}`);
  }
};

/**
 * Handles an attachment interaction.
 * - If DOCX: Directly triggers download without modal preview.
 * - If PDF/Image: Invokes onOpenPreview callback with the fetched blob.
 *
 * @param {Object} att - Attachment object { id, file_name, file_type }
 * @param {Function} onOpenPreview - (blob, att) => void
 */
export const handleAttachmentClick = async (att, onOpenPreview) => {
  if (!att || !att.id) return;

  const fileName = att.file_name || '';
  const fileType = att.file_type || '';

  // Rule: DOCX files automatically download immediately (no preview)
  if (isDocxFile(fileName, fileType)) {
    await downloadAttachmentDirectly(att);
    return;
  }

  // Rule: PDF / Image files load and open in preview modal
  try {
    const response = await api.get(`attachments/${att.id}`, { responseType: 'blob' });
    const mime = isPdfFile(fileName, fileType)
      ? 'application/pdf'
      : (fileType || 'application/octet-stream');
    const blob = new Blob([response.data], { type: mime });

    if (typeof onOpenPreview === 'function') {
      onOpenPreview(blob, att);
    }
  } catch (error) {
    console.error('Failed to open attachment preview:', error);
    toast.error(`Failed to load attachment: ${error.response?.data?.message || error.message || 'Network error'}`);
  }
};
