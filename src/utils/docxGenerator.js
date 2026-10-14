import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';

/**
 * Creates OpenXML DrawingML inline picture XML.
 * 914400 EMUs = 1 inch.
 * Default 1.5in x 0.5in fits official signature boxes without overflowing rows.
 */
function createInlineDrawingXml(relId, widthEmu = 600000, heightEmu = 180000, docPrId = 1) {
  return `<w:drawing xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
    <wp:inline distT="0" distB="0" distL="0" distR="0">
      <wp:extent cx="${widthEmu}" cy="${heightEmu}"/>
      <wp:effectExtent l="0" t="0" r="0" b="0"/>
      <wp:docPr id="${docPrId}" name="Signature_${docPrId}"/>
      <wp:cNvGraphicFramePr>
        <a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/>
      </wp:cNvGraphicFramePr>
      <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
        <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
          <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
            <pic:nvPicPr>
              <pic:cNvPr id="0" name="signature.png"/>
              <pic:cNvPicPr/>
            </pic:nvPicPr>
            <pic:blipFill>
              <a:blip r:embed="${relId}"/>
              <a:stretch><a:fillRect/></a:stretch>
            </pic:blipFill>
            <pic:spPr>
              <a:xfrm><a:off x="0" y="0"/><a:ext cx="${widthEmu}" cy="${heightEmu}"/></a:xfrm>
              <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
            </pic:spPr>
          </pic:pic>
        </a:graphicData>
      </a:graphic>
    </wp:inline>
  </w:drawing>`;
}

/**
 * Convert dataUrl or base64 string to Uint8Array binary buffer.
 */
function toUint8Array(input) {
  if (!input) return null;
  if (input instanceof Uint8Array) return input;
  if (input instanceof ArrayBuffer) return new Uint8Array(input);
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(input)) return new Uint8Array(input);

  if (typeof input === 'string') {
    const base64 = input.includes(',') ? input.split(',')[1] : input;
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  return null;
}

/**
 * Injects digital signature images directly into Word OpenXML zip package
 * positioned slightly above the respective placeholder paragraphs.
 */
export function injectSignaturesIntoZip(zip, images = {}) {
  if (!images || (!images.approved && !images.issued)) {
    return;
  }

  let relsXml = zip.file('word/_rels/document.xml.rels')?.asText() || '';
  let docXml  = zip.file('word/document.xml')?.asText() || '';
  let newRels = '';

  // 1. Signature: Approved By (proportional compact box above name)
  if (images.approved) {
    const bytes = toUint8Array(images.approved);
    if (bytes) {
      zip.file('word/media/sig_approved.png', bytes, { binary: true });
      if (!relsXml.includes('rIdSigApproved')) {
        newRels += `<Relationship Id="rIdSigApproved" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/sig_approved.png"/>`;
      }
      const drawing = `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="0" w:after="0" w:line="120" w:lineRule="exact"/><w:rPr><w:sz w:val="2"/><w:szCs w:val="2"/></w:rPr></w:pPr><w:r>${createInlineDrawingXml('rIdSigApproved', 600000, 180000, 101)}</w:r></w:p>`;
      const match = docXml.match(/<w:p[^>]*>(?:(?!<\/w:p>).)*?Approved_by(?:(?!<\/w:p>).)*?<\/w:p>/s);
      if (match) {
        docXml = docXml.replace(match[0], drawing + match[0]);
      }
    }
  }

  // 2. Signature: Issued By (proportional compact box above name)
  if (images.issued) {
    const bytes = toUint8Array(images.issued);
    if (bytes) {
      zip.file('word/media/sig_issued.png', bytes, { binary: true });
      if (!relsXml.includes('rIdSigIssued')) {
        newRels += `<Relationship Id="rIdSigIssued" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/sig_issued.png"/>`;
      }
      const drawing = `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="0" w:after="0" w:line="120" w:lineRule="exact"/><w:rPr><w:sz w:val="2"/><w:szCs w:val="2"/></w:rPr></w:pPr><w:r>${createInlineDrawingXml('rIdSigIssued', 600000, 180000, 102)}</w:r></w:p>`;
      const match = docXml.match(/<w:p[^>]*>(?:(?!<\/w:p>).)*?Issued_by(?:(?!<\/w:p>).)*?<\/w:p>/s);
      if (match) {
        docXml = docXml.replace(match[0], drawing + match[0]);
      }
    }
  }

  if (newRels && relsXml.includes('</Relationships>')) {
    relsXml = relsXml.replace('</Relationships>', `${newRels}</Relationships>`);
    zip.file('word/_rels/document.xml.rels', relsXml);
  }

  zip.file('word/document.xml', docXml);
}

/**
 * Fetches a docx template from the public folder and returns a Blob.
 * @param {string} templatePath - Path to the template in the public folder.
 * @param {Object} data - The data object to fill the template with.
 * @param {Object} [options] - Configuration options, including optional digital signatures
 * @returns {Promise<Blob>} The generated document as a Blob.
 */
export const generateDocxBlob = async (templatePath, data, options = {}) => {
  const response = await fetch(templatePath);
  if (!response.ok) {
    throw new Error(`Failed to fetch template from ${templatePath} (HTTP ${response.status})`);
  }
  const arrayBuffer = await response.arrayBuffer();

  const zip = new PizZip(arrayBuffer);

  // Inject digital signature drawings if provided
  if (options.images) {
    try {
      injectSignaturesIntoZip(zip, options.images);
    } catch (sigErr) {
      console.warn('Could not inject signature drawings into docx:', sigErr);
    }
  }

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
 * @param {Object} [options] - Optional configurations (e.g. digital signature images)
 */
export const generateDocx = async (templatePath, data, outputName, options = {}) => {
  try {
    const blob = await generateDocxBlob(templatePath, data, options);
    saveAs(blob, outputName);
  } catch (error) {
    console.error('Error generating document:', error);
    throw error;
  }
};
