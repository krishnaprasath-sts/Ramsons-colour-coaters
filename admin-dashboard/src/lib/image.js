// Shrinks photos in the browser before they are uploaded.
// A camera or design-tool export is often 5-8 MB; visitors would have to download all of it.
// Here it is scaled down to at most 1920 px and saved as WebP (typically 150-400 KB)
// with no visible difference on a website.

const MAX_SIDE = 1920;
const QUALITY = 0.82;
const SMALL_ENOUGH = 300 * 1024; // files under 300 KB that already fit are left alone

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Returns a smaller copy of `file`, or `file` itself when it cannot or need not be reduced
 * (GIF / AVIF / SVG, already small, or a browser without the needed features).
 */
export async function compressImage(file, { maxSide = MAX_SIDE } = {}) {
  if (!file || !/^image\/(jpeg|png|webp)$/.test(file.type)) return file;

  let bitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    return file;
  }

  try {
    const scale = Math.min(1, maxSide / bitmap.width, maxSide / bitmap.height);
    if (scale === 1 && file.size <= SMALL_ENOUGH) return file;

    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    // WebP keeps transparency. Browsers that cannot write WebP hand back a PNG instead;
    // then fall back to the file's own format.
    let blob = await canvasToBlob(canvas, 'image/webp', QUALITY);
    if (!blob || blob.type !== 'image/webp') {
      blob = await canvasToBlob(canvas, file.type === 'image/png' ? 'image/png' : 'image/jpeg', QUALITY);
    }
    if (!blob || blob.size >= file.size) return file;

    const extension = { 'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg' }[blob.type];
    if (!extension) return file;
    const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
    return new File([blob], `${baseName}.${extension}`, { type: blob.type, lastModified: Date.now() });
  } catch {
    return file;
  } finally {
    if (bitmap.close) bitmap.close();
  }
}

/** "6.0 MB", "310 KB" */
export function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
