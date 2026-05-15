/** Minimum time on page before a real user can submit (ms) */
const MIN_SUBMIT_MS = 3000;

/** Max successful submissions per browser tab in a rolling window */
const RATE_LIMIT_COUNT = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_STORAGE_KEY = 'tm_contact_submits';

function hasSuspiciousEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const local = email.split('@')[0] || '';
  const dotParts = local.split('.').filter(Boolean);
  // e.g. pe.x.e.s.e.q.4.0.3@gmail.com
  if (dotParts.length >= 5 && dotParts.every((p) => p.length <= 3)) return true;
  if (/(\.[a-z0-9]{1,2}){4,}/i.test(local)) return true;
  return false;
}

function hasSuspiciousText(text) {
  if (!text || typeof text !== 'string') return false;
  const t = text.trim();
  if (t.length < 10) return false;
  if (!/\s/.test(t) && !/[aeiouAEIOU]/i.test(t)) return true;
  if (/^[A-Za-z0-9]+$/.test(t) && t.length >= 14) {
    const upper = (t.match(/[A-Z]/g) || []).length;
    const lower = (t.match(/[a-z]/g) || []).length;
    if (upper >= 3 && lower >= 3) return true;
  }
  return false;
}

function isRateLimited() {
  try {
    const raw = sessionStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    const times = raw ? JSON.parse(raw) : [];
    const now = Date.now();
    const recent = times.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
    return recent.length >= RATE_LIMIT_COUNT;
  } catch {
    return false;
  }
}

export function recordContactSubmission() {
  try {
    const raw = sessionStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    const times = raw ? JSON.parse(raw) : [];
    const now = Date.now();
    const recent = times.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
    recent.push(now);
    sessionStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(recent));
  } catch {
    /* ignore */
  }
}

/**
 * Returns true when the submission should be dropped (bot / spam).
 * Callers should show a normal success message without hitting the API.
 */
export function shouldBlockContactSubmission({ honeypot, formReadyAt, name, email, message }) {
  if (honeypot && String(honeypot).trim() !== '') {
    return true;
  }

  if (formReadyAt && Date.now() - formReadyAt < MIN_SUBMIT_MS) {
    return true;
  }

  if (isRateLimited()) {
    return true;
  }

  if (hasSuspiciousEmail(email)) {
    return true;
  }

  if (hasSuspiciousText(name) || hasSuspiciousText(message)) {
    return true;
  }

  return false;
}
