// Shared helpers for talking to the backend and formatting its data.

const TOKEN_KEY = 'adminToken';
const USER_KEY = 'adminUser';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function getAdminName() {
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) return 'Admin';
  try {
    const parsed = JSON.parse(stored);
    return (parsed && parsed.username) || 'Admin';
  } catch {
    return stored;
  }
}

export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user || {}));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Calls the backend and returns the parsed JSON body.
 * - Sends the admin token with every request.
 * - Throws an Error with a readable message when the request fails.
 * - Sends the admin back to the login page when the session is no longer valid.
 *
 * Pass `json` for a JSON body or `body` for FormData (file uploads).
 */
export async function api(path, { method = 'GET', body, json } = {}) {
  const headers = { Accept: 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload = body;
  if (json !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(json);
  }

  let res;
  try {
    res = await fetch(path, { method, headers, body: payload });
  } catch {
    throw new Error('Cannot reach the server. Please check that the backend is running.');
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // Not a JSON response (for example the backend is offline behind the dev proxy)
  }

  if (res.status === 401 && path !== '/api/auth/login') {
    clearSession();
    window.location.replace('/login?expired=1');
    throw new Error('Your session has expired. Please sign in again.');
  }

  if (!data) {
    throw new Error(`The server did not respond correctly (status ${res.status}). Is the backend running?`);
  }
  if (!res.ok || data.success === false) {
    throw new Error(data.error || `Request failed (status ${res.status}).`);
  }
  return data;
}

/** Blog covers are stored as a bare filename; banners already carry a full path. */
export function imageUrl(image) {
  if (!image) return '';
  if (image.startsWith('http') || image.startsWith('/')) return image;
  return `/uploads/${image}`;
}

/** SQLite timestamps look like "2026-11-14 10:33:55" (UTC). */
export function parseDate(value) {
  if (!value) return null;
  const date = new Date(String(value).replace(' ', 'T') + (String(value).endsWith('Z') ? '' : 'Z'));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value) {
  const date = parseDate(value);
  if (!date) return '—';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(value) {
  const date = parseDate(value);
  if (!date) return '—';
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function initials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

/** Address of the public website (separate dev server while developing). */
export const SITE_URL = import.meta.env.DEV ? 'http://localhost:3000' : '';
