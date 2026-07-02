// Records one manual page-view to Netlify Blobs. Called (fire-and-forget) by the
// edge gate, which forwards the visitor's session cookie. We re-verify the cookie
// here so the email is trusted (not taken from the client). One blob per view.
//
// Netlify Functions v2 (ESM) so Blobs auto-configures. Env: MANUAL_AUTH_SECRET
import { getStore } from '@netlify/blobs';
import auth from './lib/manualAuth.js';

const STORE = 'manual-access-log';

export default async (req) => {
  if (req.method !== 'POST') return new Response('', { status: 405 });

  const secret = process.env.MANUAL_AUTH_SECRET;
  const session = auth.sessionFromCookies(req.headers.get('cookie'), secret);
  if (!session || !session.e) return new Response('', { status: 204 }); // not authenticated → ignore

  let body = {};
  try { body = await req.json(); } catch {}
  const ts = typeof body.ts === 'string' ? body.ts : new Date().toISOString();
  const entry = { ts, email: session.e, page: String(body.page || '').slice(0, 200) };

  try {
    const store = getStore(STORE);
    const key = `${ts}_${Math.random().toString(36).slice(2, 8)}`; // sorts chronologically; suffix avoids collisions
    await store.setJSON(key, entry);
  } catch (e) {
    console.error('[manual-log] blob write failed:', e && e.message);
  }
  return new Response('', { status: 204 });
};
