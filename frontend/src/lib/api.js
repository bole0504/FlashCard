/**
 * Base URL for API requests (e.g. /api or https://yourserver.com/api)
 */
export const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Server origin for absolute URLs (uploads, etc.)
 * On mobile/Capacitor, image paths from API like /uploads/xxx need full URL
 */
export function getServerOrigin() {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
  }
  return ''; // same origin
}

/**
 * Resolve image/asset URL from API response (e.g. /uploads/xxx)
 */
export function resolveAssetUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const origin = getServerOrigin();
  return origin ? `${origin}${path.startsWith('/') ? path : '/' + path}` : path;
}
