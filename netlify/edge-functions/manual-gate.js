// Edge gate for /service-manual-* — runs before the CDN serves the file.
// If the request has a valid signed session cookie, pass through; otherwise
// redirect to the login page. Fails closed (redirects) if the secret is unset.
//
// Must use the SAME token format as netlify/functions/lib/manualAuth.js
// (HS256-style:  base64url(JSON) + "." + base64url(HMAC-SHA256(body)) ).

const COOKIE_NAME = 'wr_manual_session';

function b64url(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlToString(b64) {
  const pad = b64.replace(/-/g, '+').replace(/_/g, '/');
  return atob(pad + '==='.slice((pad.length + 3) % 4));
}

async function hmac(secret, msg) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(msg));
  return b64url(new Uint8Array(sig));
}

function getCookie(req, name) {
  const raw = req.headers.get('cookie') || '';
  for (const part of raw.split(';')) {
    const i = part.indexOf('=');
    if (i > -1 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return null;
}

// Returns the session payload (with .e = email) if valid, else null.
async function readSession(token, secret) {
  if (!token) return null;
  const dot = token.indexOf('.');
  if (dot < 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = await hmac(secret, body);
  if (sig.length !== expected.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  if (diff !== 0) return null;
  let payload;
  try { payload = JSON.parse(b64urlToString(body)); } catch { return null; }
  if (payload.t !== 's') return null;
  if (!payload.x || Math.floor(Date.now() / 1000) > payload.x) return null;
  return payload;
}

function env(name) {
  return (globalThis.Netlify && Netlify.env.get(name)) || (globalThis.Deno && Deno.env.get(name)) || '';
}

// Log a manual page-view (fire-and-forget; never blocks or breaks serving).
// Forwards the visitor's cookie so manual-log can re-verify and trust the email.
function logView(request, origin, pathname) {
  return fetch(origin + '/.netlify/functions/manual-log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie: request.headers.get('cookie') || '' },
    body: JSON.stringify({ page: pathname, ts: new Date().toISOString() }),
  }).catch(() => {});
}

export default async (request, context) => {
  const secret = env('MANUAL_AUTH_SECRET');
  const token = getCookie(request, COOKIE_NAME);
  const session = secret ? await readSession(token, secret) : null;

  if (session) {
    // Log only the manual document open (not every image/CSS asset).
    const url0 = new URL(request.url);
    const p = url0.pathname;
    if (p === '/service-manual-us/' || p === '/service-manual-us' || p.endsWith('/index.html')) {
      const task = logView(request, url0.origin, p);
      if (task && context && typeof context.waitUntil === 'function') context.waitUntil(task);
    }
    return context.next(); // authenticated — serve the requested file
  }

  const url = new URL(request.url);
  const login = new URL('/manual-login.html', url.origin);
  login.searchParams.set('next', url.pathname + url.search);
  return Response.redirect(login.toString(), 302);
};

export const config = { path: ['/service-manual-us/*', '/service-manual-us'] };
