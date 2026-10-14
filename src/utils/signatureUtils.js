/**
 * signatureUtils.js
 *
 * Dedicated digital signature processing and retrieval utilities.
 * Includes:
 *  1. Client-side automatic paper background removal algorithm (transparent PNG generation)
 *  2. Bounding box auto-trimming for optimal document placement
 *  3. Document official signature metadata retrieval with session caching
 */

import api from '@/api/client';

// In-memory cache for document signatures per unit
const signatureCache = new Map();

/**
 * Automatically removes paper background from an uploaded signature image
 * and returns a trimmed, transparent PNG data URL.
 *
 * @param {HTMLImageElement|ImageBitmap} img - The loaded source image
 * @param {number} [sensitivity=0.85] - Threshold sensitivity (0.60 to 0.95)
 * @returns {string} PNG data URL with transparent background
 */
export function removeSignatureBackground(img, sensitivity = 0.85) {
  if (typeof document === 'undefined') return '';

  const width = img.naturalWidth || img.width || 800;
  const height = img.naturalHeight || img.height || 400;

  // Max dimension constraint for fast, crisp client-side processing
  const maxDim = 1600;
  let scale = 1;
  if (width > maxDim || height > maxDim) {
    scale = Math.min(maxDim / width, maxDim / height);
  }

  const renderW = Math.round(width * scale);
  const renderH = Math.round(height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = renderW;
  canvas.height = renderH;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return '';

  ctx.drawImage(img, 0, 0, renderW, renderH);

  const imgData = ctx.getImageData(0, 0, renderW, renderH);
  const data = imgData.data;
  const len = data.length;

  // 1. Sample perimeter pixels to dynamically detect paper/surface color
  const sampleIndices = [
    0, // Top-Left
    Math.min((renderW - 1) * 4, len - 4), // Top-Right
    Math.min(((renderH - 1) * renderW) * 4, len - 4), // Bottom-Left
    Math.min(((renderH - 1) * renderW + (renderW - 1)) * 4, len - 4), // Bottom-Right
    Math.min(Math.floor(renderW / 2) * 4, len - 4), // Top-Center
    Math.min(((renderH - 1) * renderW + Math.floor(renderW / 2)) * 4, len - 4) // Bottom-Center
  ];

  let sumR = 0, sumG = 0, sumB = 0;
  sampleIndices.forEach(idx => {
    sumR += data[idx];
    sumG += data[idx + 1];
    sumB += data[idx + 2];
  });
  const avgR = sumR / sampleIndices.length;
  const avgG = sumG / sampleIndices.length;
  const avgB = sumB / sampleIndices.length;

  // Paper luminance estimate (default to at least 200 for standard paper)
  const bgLuminance = Math.max(190, 0.299 * avgR + 0.587 * avgG + 0.114 * avgB);
  const threshold = bgLuminance * sensitivity;

  let minX = renderW, minY = renderH, maxX = 0, maxY = 0;
  let hasInk = false;

  // 2. Iterate pixels, convert paper background to transparent alpha
  for (let i = 0; i < len; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Standard human perceptual luminance
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    if (lum >= threshold) {
      // Paper background -> 100% transparent
      data[i + 3] = 0;
    } else {
      // Ink stroke pixel
      const diff = threshold - lum;
      let alpha = 255;

      // Anti-aliased boundary blending (35px soft transition)
      if (diff < 35) {
        alpha = Math.round((diff / 35) * 255);
      }
      data[i + 3] = alpha;

      // Enhance stroke contrast so dark ink is deep and distinct
      const inkFactor = Math.min(1, Math.max(0, lum / threshold));
      data[i] = Math.round(r * inkFactor * 0.9);
      data[i + 1] = Math.round(g * inkFactor * 0.9);
      data[i + 2] = Math.round(b * inkFactor * 0.9);

      // Track bounding box for auto-crop
      const px = (i / 4) % renderW;
      const py = Math.floor((i / 4) / renderW);
      if (px < minX) minX = px;
      if (px > maxX) maxX = px;
      if (py < minY) minY = py;
      if (py > maxY) maxY = py;
      hasInk = true;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // 3. Auto-crop extraneous empty space around the ink
  if (hasInk && maxX > minX && maxY > minY) {
    const padding = 16;
    const cropX = Math.max(0, minX - padding);
    const cropY = Math.max(0, minY - padding);
    const cropW = Math.min(renderW - cropX, (maxX - minX) + padding * 2);
    const cropH = Math.min(renderH - cropY, (maxY - minY) + padding * 2);

    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = cropW;
    croppedCanvas.height = cropH;
    const cropCtx = croppedCanvas.getContext('2d');
    if (cropCtx) {
      cropCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
      return croppedCanvas.toDataURL('image/png');
    }
  }

  return canvas.toDataURL('image/png');
}

/**
 * Retrieve active official document signatures (Director & Unit Admin/Dispatcher)
 * with session-level caching to prevent repeated network overhead during bulk generation.
 *
 * @param {string} [unitCode='FGMU'] - Operational unit code (FGMU, LEAU, SSU)
 * @param {boolean} [forceRefresh=false]
 * @returns {Promise<{director: Object|null, dispatcher: Object|null}>}
 */
export async function fetchDocumentSignatures(unitCode = 'FGMU', forceRefresh = false) {
  const cacheKey = String(unitCode).toUpperCase().trim();
  if (!forceRefresh && signatureCache.has(cacheKey)) {
    return signatureCache.get(cacheKey);
  }

  try {
    const response = await api.get('/auth/document-signatures', {
      params: { unit: cacheKey },
    });

    const data = response.data?.data || { director: null, dispatcher: null };
    signatureCache.set(cacheKey, data);
    return data;
  } catch (err) {
    console.warn(`Could not fetch official document signatures for unit ${unitCode}:`, err);
    return { director: null, dispatcher: null };
  }
}

/**
 * Clear cached document signatures (e.g. after updating signature in account settings)
 */
export function clearSignatureCache() {
  signatureCache.clear();
}
