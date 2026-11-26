// Address of the backend API.
// Development: empty, so /api and /uploads go through the Vite proxy.
// Production: set VITE_API_URL (see .env.production), e.g. https://api.ramsoncolourcoaters.com
export const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

/** Points backend paths (/api/..., /uploads/...) at the API server; other values pass through unchanged. */
export function apiUrl(path) {
  if (typeof path === 'string' && /^\/(api|uploads|dashboard\/uploads|sendMail\.php)(\/|$|\?)/.test(path)) {
    return API_URL + path;
  }
  return path;
}

/**
 * Sends every fetch('/api/...') call to the API server.
 * Installed once from main.jsx so the existing fetch calls keep their short paths.
 */
export function installApiFetch() {
  if (!API_URL || typeof window === 'undefined') return;
  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input, init) => nativeFetch(apiUrl(input), init);
}

/* ------------------------------------------------------------------ */
/* Cached GET requests                                                 */
/* ------------------------------------------------------------------ */
// Public content (banners, services, blogs, logo) is asked for once and shared by every page.
// The last answer is also kept in localStorage, so a returning visitor sees the page
// immediately while a fresh copy is fetched in the background.

const STORE_PREFIX = 'rcc-api:';
const FRESH_MS = 5 * 60 * 1000;

const fresh = new Map(); // path -> { data, at }: answers fetched during this page load
const saved = new Map(); // path -> data parsed from localStorage (earlier visit)
const pending = new Map(); // path -> Promise of a request in flight

function readSaved(path) {
  if (!saved.has(path)) {
    let data = null;
    try {
      const raw = localStorage.getItem(STORE_PREFIX + path);
      data = raw ? JSON.parse(raw) : null;
    } catch {
      // Storage blocked or unreadable: behave as if nothing was saved
    }
    saved.set(path, data);
  }
  return saved.get(path);
}

function forget(path) {
  fresh.delete(path);
  saved.set(path, null);
  try {
    localStorage.removeItem(STORE_PREFIX + path);
  } catch {
    // ignore
  }
}

/** Last known answer for a GET endpoint, without touching the network (null when unknown). */
export function peekJson(path) {
  const entry = fresh.get(path);
  return entry ? entry.data : readSaved(path);
}

/**
 * Fetches a GET endpoint at most once every few minutes and remembers the answer.
 * Rejects with `error.offline = true` when the server could not be reached.
 */
export function loadJson(path) {
  const entry = fresh.get(path);
  if (entry && Date.now() - entry.at < FRESH_MS) return Promise.resolve(entry.data);

  if (!pending.has(path)) {
    const request = fetch(path)
      .then((res) => res.json())
      .catch(() => {
        const error = new Error('Cannot reach the server.');
        error.offline = true;
        throw error;
      })
      .then((data) => {
        if (!data || data.success === false) {
          forget(path);
          throw new Error((data && data.error) || 'Request failed');
        }
        // Keep the same object when nothing changed, so pages do not re-render
        const previous = peekJson(path);
        const text = JSON.stringify(data);
        const result = previous && JSON.stringify(previous) === text ? previous : data;
        fresh.set(path, { data: result, at: Date.now() });
        try {
          localStorage.setItem(STORE_PREFIX + path, text);
        } catch {
          // Storage full or blocked: the in-memory copy is enough
        }
        return result;
      })
      .finally(() => pending.delete(path));
    pending.set(path, request);
  }
  return pending.get(path);
}
