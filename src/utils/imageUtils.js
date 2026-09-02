/**
 * Loads an image from a URL and converts it to a PNG data URL
 * that pdfmake can embed. Required because pdfmake only supports
 * PNG and JPEG; the BSU logo is stored as WebP.
 *
 * @param {string} url - Absolute or relative URL to the image
 * @returns {Promise<string>} PNG data URL
 */
export async function loadImageAsPngDataUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d').drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}
