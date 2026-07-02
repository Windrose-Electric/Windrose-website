// GET ?token=... — validates a magic-link token. On success it sets the session
// cookie and sends the browser to the manual with a CLEAN url.
//
// We return a 200 HTML page (not a 302) that sets the cookie and then does a
// client-side location.replace(next). Netlify appends the incoming query string
// (?token=...) to 3xx redirect targets, which would leak the link token into the
// address bar/history — a 200 response avoids that entirely.
//
// Netlify Functions v2 (ESM). Env: MANUAL_AUTH_SECRET
import auth from './lib/manualAuth.js';

function redirectFail(reason) {
  return new Response('', { status: 302, headers: { Location: `/manual-login.html?error=${reason}` } });
}

export default async (req) => {
  const secret = process.env.MANUAL_AUTH_SECRET;
  const token = new URL(req.url).searchParams.get('token') || '';

  if (!secret) { console.error('[manual-verify] MANUAL_AUTH_SECRET not configured'); return redirectFail('config'); }

  const payload = auth.verify(token, secret, 'l');
  if (!payload) return redirectFail('expired'); // login page has no incoming query, so 302 is fine here

  const session = auth.makeSessionToken(payload.e, secret);
  const next = auth.safeNext(payload.nx); // validated: only /service-manual-*/… paths
  const nextJson = JSON.stringify(next);

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/><meta name="robots" content="noindex,nofollow"/>
<title>Signing in…</title><style>body{font-family:-apple-system,Segoe UI,Arial,sans-serif;background:#060f1e;color:#f0f4ff;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0}a{color:#4a9eff}</style></head>
<body><p>Signing you in… <a href=${nextJson}>continue</a></p>
<script>location.replace(${nextJson});</script></body></html>`;

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Set-Cookie': auth.sessionCookie(session), 'Cache-Control': 'no-store' },
  });
};
