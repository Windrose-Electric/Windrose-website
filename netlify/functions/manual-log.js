// Records one manual page-view to Netlify Blobs. Called (fire-and-forget) by the
// edge gate, which forwards the visitor's session cookie. We re-verify the cookie
// here so the email is trusted (not taken from the client). One blob per view.
//
// Required env var: MANUAL_AUTH_SECRET

const { getStore } = require('@netlify/blobs');
const auth = require('./lib/manualAuth');

const STORE = 'manual-access-log';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: '' };

  const secret = process.env.MANUAL_AUTH_SECRET;
  const cookie = event.headers && (event.headers.cookie || event.headers.Cookie);
  const session = auth.sessionFromCookies(cookie, secret);
  if (!session || !session.e) return { statusCode: 204, body: '' }; // not authenticated → ignore silently

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch {}

  const ts = typeof body.ts === 'string' ? body.ts : new Date().toISOString();
  const entry = { ts, email: session.e, page: (body.page || '').slice(0, 200) };

  try {
    const store = getStore(STORE);
    // Key sorts chronologically; suffix keeps concurrent views from colliding.
    const key = `${ts}_${Math.random().toString(36).slice(2, 8)}`;
    await store.setJSON(key, entry);
  } catch (e) {
    console.error('[manual-log] blob write failed:', e && e.message);
    return { statusCode: 204, body: '' };
  }
  return { statusCode: 204, body: '' };
};
