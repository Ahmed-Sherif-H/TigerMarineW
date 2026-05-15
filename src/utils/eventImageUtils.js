import { resolveBackendPublicPath } from './backendConfig';

/** Shown when an event has no image or the URL fails (404, deleted Cloudinary, etc.) */
export const EVENT_IMAGE_FALLBACK = '/images/DJI_0154.jpg';

/**
 * Build a usable image URL for an event (full URL, protocol-relative, or API-hosted path).
 * Legacy Cloudinary URLs are returned as-is; if that account no longer serves them, use onError fallback.
 */
export function resolveEventImageUrl(raw) {
  if (raw == null || typeof raw !== 'string') return EVENT_IMAGE_FALLBACK;
  const t = raw.trim();
  if (!t) return EVENT_IMAGE_FALLBACK;
  if (t.startsWith('//')) return `https:${t}`;
  if (t.startsWith('http://') || t.startsWith('https://')) return t;
  const path = t.startsWith('/') ? t : `/${t}`;
  return resolveBackendPublicPath(path);
}

/** Avoid infinite onError loops if the fallback path is also missing */
export function handleEventImageError(e) {
  const el = e.currentTarget;
  if (el.dataset.eventImgFallback === '1') {
    el.style.display = 'none';
    return;
  }
  el.dataset.eventImgFallback = '1';
  el.src = EVENT_IMAGE_FALLBACK;
}
