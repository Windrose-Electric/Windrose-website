// GET ?token=... — validates a magic-link token, and on success sets the
// long-lived session cookie and redirects into the manual.
// Netlify Functions v2 (ESM) — returns the redirect verbatim (no query carryover).
// Env: MANUAL_AUTH_SECRET
import auth from './lib/manualAuth.js';

export default async (req) => {
  const secret = process.env.MANUAL_AUTH_SECRET;
  const token = new URL(req.url).searchParams.get('token') || '';
  const fail = (reason) => new Response('', { status: 302, headers: { Location: `/manual-login.html?error=${reason}` } });

  if (!secret) { console.error('[manual-verify] MANUAL_AUTH_SECRET not configured'); return fail('config'); }

  const payload = auth.verify(token, secret, 'l');
  if (!payload) return fail('expired');

  const session = auth.makeSessionToken(payload.e, secret);
  const next = auth.safeNext(payload.nx);
  return new Response('', {
    status: 302,
    headers: { Location: next, 'Set-Cookie': auth.sessionCookie(session), 'Cache-Control': 'no-store' },
  });
};
