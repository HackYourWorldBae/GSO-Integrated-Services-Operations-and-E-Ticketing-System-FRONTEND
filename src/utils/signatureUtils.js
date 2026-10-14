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
 * Handles:
 *  - White/cream/yellowish paper backgrounds photographed in various room lightings
 *  - Mobile photos with vignette/phone shadows
 *  - Pre-existing transparent PNGs (never turns transparent pixels opaque/black)
 *  - Optional ink tint selection ('original' | 'black' | 'blue')
 *
 * @param {HTMLImageElement|ImageBitmap} img - The loaded source image
 * @param {number} [sensitivity=0.80] - Threshold sensitivity (0.50 to 0.95)
 * @param {string} [inkStyle='original'] - 'original' | 'black' | 'blue'
 * @returns {string} PNG data URL with transparent background
 */
export function removeSignatureBackground(img, sensitivity = 0.80, inkStyle = 'original') {
  if (typeof document === 'undefined' || !img) return '';

  const width = img.naturalWidth || img.width || 0;
  const height = img.naturalHeight || img.height || 0;
  if (!width || !height) return '';

  // Max dimension constraint for fast, crisp client-side processing
  const maxDim = 1600;
  let scale = 1;
  if (width > maxDim || height > maxDim) {
    scale = Math.min(maxDim / width, maxDim / height);
  }

  const renderW = Math.max(1, Math.round(width * scale));
  const renderH = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = renderW;
  canvas.height = renderH;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return '';

  try {
    ctx.drawImage(img, 0, 0, renderW, renderH);
  } catch (err) {
    return '';
  }

  let imgData;
  try {
    imgData = ctx.getImageData(0, 0, renderW, renderH);
  } catch (err) {
    return '';
  }

  const data = imgData.data;
  const len = data.length;

  // 1. Grid sample pixels across the entire image to build a luminance histogram
  // This avoids corner-shadow biases from smartphone photos.
  const sampleStep = Math.max(1, Math.floor(len / 8000));
  const nonTransparentLums = [];
  let transparentPixelCount = 0;
  let totalSampled = 0;

  for (let i = 0; i < len; i += sampleStep * 4) {
    totalSampled++;
    const a = data[i + 3];
    if (a < 30) {
      transparentPixelCount++;
      continue;
    }
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    nonTransparentLums.push(lum);
  }

  // If the image already has significant pre-existing transparency (> 30% transparent),
  // it's already a transparent PNG signature!
  const isAlreadyTransparent = totalSampled > 0 && (transparentPixelCount / totalSampled > 0.3);

  // 2. Determine paper background luminance
  let paperLum = 245;
  let inkLum = 40;

  if (nonTransparentLums.length > 50) {
    nonTransparentLums.sort((a, b) => a - b);
    // In signature photos, paper is the predominant bright cluster (85th to 92nd percentile)
    const p85Idx = Math.floor(nonTransparentLums.length * 0.88);
    const p10Idx = Math.floor(nonTransparentLums.length * 0.10);
    paperLum = Math.max(160, nonTransparentLums[p85Idx] || 240);
    inkLum   = Math.min(paperLum - 20, nonTransparentLums[p10Idx] || 40);
  }

  const dynamicRange = Math.max(30, paperLum - inkLum);

  // Sensitivity maps the darkness threshold:
  // Lower sensitivity (e.g. 0.60) = only very dark strokes kept (aggressive cleanup of heavy shadows)
  // Higher sensitivity (e.g. 0.90) = keeps light pencil/faint pen strokes
  // Default sensitivity 0.80 = balanced for ballpoint pen and mobile photos
  const contrastThreshold = (1 - sensitivity) * 0.60 * dynamicRange + (dynamicRange * 0.08);
  const transitionWidth   = Math.max(8, dynamicRange * 0.15);

  let minX = renderW, minY = renderH, maxX = 0, maxY = 0;
  let hasInk = false;

  // Helper to apply styled ink color
  const applyInkStyle = (pixelIdx, r, g, b, lum, alpha) => {
    if (inkStyle === 'black') {
      // Crisp midnight black (#0f172a)
      data[pixelIdx]     = 15;
      data[pixelIdx + 1] = 23;
      data[pixelIdx + 2] = 42;
    } else if (inkStyle === 'blue') {
      // Official royal navy blue (#1e3a8a)
      data[pixelIdx]     = 30;
      data[pixelIdx + 1] = 58;
      data[pixelIdx + 2] = 138;
    } else {
      // 'original': Enhance natural pen color while subtracting paper luminance haze
      const inkFactor = Math.min(1, Math.max(0.15, lum / paperLum));
      data[pixelIdx]     = Math.max(0, Math.min(255, Math.round(r * inkFactor)));
      data[pixelIdx + 1] = Math.max(0, Math.min(255, Math.round(g * inkFactor)));
      data[pixelIdx + 2] = Math.max(0, Math.min(255, Math.round(b * inkFactor)));
    }
  };

  // 3. Process every pixel
  for (let i = 0; i < len; i += 4) {
    const a = data[i + 3];

    // Preserve pre-existing transparent pixels
    if (a < 15) {
      data[i + 3] = 0;
      continue;
    }

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    if (isAlreadyTransparent) {
      // If already transparent, preserve transparency and apply optional restyle
      if (a >= 20) {
        applyInkStyle(i, r, g, b, lum, a);
        const px = (i / 4) % renderW;
        const py = Math.floor((i / 4) / renderW);
        if (px < minX) minX = px;
        if (px > maxX) maxX = px;
        if (py < minY) minY = py;
        if (py > maxY) maxY = py;
        hasInk = true;
      }
      continue;
    }

    // Darkness relative to paper background
    const darkness = paperLum - lum;

    if (darkness <= contrastThreshold) {
      // Paper background -> 100% transparent
      data[i + 3] = 0;
    } else {
      // Ink stroke pixel
      const diff = darkness - contrastThreshold;
      let alpha = 255;

      // Soft anti-aliased transition for stroke edges
      if (diff < transitionWidth) {
        const t = diff / transitionWidth;
        alpha = Math.round(t * t * (3 - 2 * t) * 255);
      }
      data[i + 3] = alpha;

      applyInkStyle(i, r, g, b, lum, alpha);

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

  // 4. Auto-crop extraneous empty space around the ink
  if (hasInk && maxX > minX && maxY > minY) {
    const padding = 16;
    const cropX = Math.max(0, minX - padding);
    const cropY = Math.max(0, minY - padding);
    const cropW = Math.min(renderW - cropX, (maxX - minX) + padding * 2);
    const cropH = Math.min(renderH - cropY, (maxY - minY) + padding * 2);

    if (cropW > 10 && cropH > 10) {
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = cropW;
      croppedCanvas.height = cropH;
      const cropCtx = croppedCanvas.getContext('2d');
      if (cropCtx) {
        cropCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
        return croppedCanvas.toDataURL('image/png');
      }
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
