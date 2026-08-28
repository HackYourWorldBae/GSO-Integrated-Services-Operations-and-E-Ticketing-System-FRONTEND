import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';

/**
 * Fetches a docx template from the public folder and returns a Blob.
 * @param {string} templatePath - Path to the template in the public folder.
 * @param {Object} data - The data object to fill the template with.
 * @returns {Promise<Blob>} The generated document as a Blob.
 */
export const generateDocxBlob = async (templatePath, data, options = {}) => {
  const response = await fetch(templatePath);
  if (!response.ok) {
    throw new Error(`Failed to fetch template from ${templatePath} (HTTP ${response.status})`);
  }
  const arrayBuffer = await response.arrayBuffer();

  const zip = new PizZip(arrayBuffer);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    delimiters: options.delimiters || { start: '{', end: '}' },
    nullGetter: () => '', // Fallback missing variables to empty string safely
  });

  try {
    // Render the document (replace placeholders with data)
    doc.render(data);
  } catch (error) {
    console.error('Docxtemplater rendering error:', error);
    if (error.properties && error.properties.errors) {
      error.properties.errors.forEach((e, idx) => {
        console.error(`Tag error #${idx + 1}:`, e.message, e.properties);
      });
    }
    throw error;
  }

  // Generate a blob
  return doc.getZip().generate({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
};

/**
 * Fetches a docx template from the public folder, fills it with data, and triggers a download.
 * @param {string} templatePath - Path to the template in the public folder
 * @param {Object} data - The data object to fill the template with.
 * @param {string} outputName - The desired name for the downloaded file.
 */
export const generateDocx = async (templatePath, data, outputName) => {
  try {
    const blob = await generateDocxBlob(templatePath, data);
    saveAs(blob, outputName);
  } catch (error) {
    console.error('Error generating document:', error);
    throw error;
  }
};
