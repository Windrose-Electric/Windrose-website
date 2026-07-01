// Shared auth helpers for the service-manual magic-link login.
// Used by manual-request-link, manual-verify, manual-logout.
// NOT a deployed function itself (lives in lib/ subdirectory).

const crypto = require('crypto');

const COOKIE_NAME = 'wr_manual_session';
const LINK_TTL_SEC = 15 * 60;        // magic link valid 15 minutes
const SESSION_TTL_SEC = 30 * 24 * 3600; // session valid 30 days

function b64url(buf) {
  return Buffer.from(buf).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// HS256-style token:  base64url(JSON payload) + "." + base64url(HMAC-SHA256(body))
function sign(payload, secret) {
  const body = b64url(Buffer.from(JSON.stringify(payload), 'utf8'));
  const mac = b64url(crypto.createHmac('sha256', secret).update(body).digest());
  return `${body}.${mac}`;
}

function verify(token, secret, expectedType) {
  if (!token || typeof token !== 'string' || !secret) return null;
  const dot = token.indexOf('.');
  if (dot < 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = b64url(crypto.createHmac('sha256', secret).update(body).digest());
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  let payload;
  try {
    payload = JSON.parse(Buffer.from(body.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
  } catch { return null; }
  if (expectedType && payload.t !== expectedType) return null;
  if (!payload.x || Math.floor(Date.now() / 1000) > payload.x) return null;
  return payload;
}

function now() { return Math.floor(Date.now() / 1000); }

function makeLinkToken(email, next, secret) {
  return sign({ t: 'l', e: email, nx: next, x: now() + LINK_TTL_SEC }, secret);
}

function makeSessionToken(email, secret) {
  return sign({ t: 's', e: email, x: now() + SESSION_TTL_SEC }, secret);
}

// Allowlist: comma/space/newline separated emails in MANUAL_ALLOWED_EMAILS.
function allowlist() {
  return (process.env.MANUAL_ALLOWED_EMAILS || '')
    .split(/[\s,;]+/).map((s) => s.trim().toLowerCase()).filter(Boolean);
}
function isAllowed(email) {
  return !!email && allowlist().includes(String(email).trim().toLowerCase());
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validEmail(email) { return typeof email === 'string' && EMAIL_RE.test(email.trim()); }

// Only allow same-site redirects into the gated manual area.
function safeNext(next) {
  if (typeof next === 'string' && /^\/service-manual-[a-z0-9-]+\//i.test(next)) return next;
  return '/service-manual-us/';
}

function sessionCookie(token) {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_TTL_SEC}`;
}
function clearCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

// Parse the session cookie from a Cookie header and return its payload (with .e = email), or null.
function sessionFromCookies(cookieHeader, secret) {
  if (!cookieHeader || !secret) return null;
  for (const part of String(cookieHeader).split(';')) {
    const i = part.indexOf('=');
    if (i > -1 && part.slice(0, i).trim() === COOKIE_NAME) {
      return verify(part.slice(i + 1).trim(), secret, 's');
    }
  }
  return null;
}

function siteBase(event) {
  if (process.env.URL) return process.env.URL.replace(/\/$/, '');
  const proto = (event && event.headers && event.headers['x-forwarded-proto']) || 'https';
  const host = event && event.headers && event.headers['host'];
  return host ? `${proto}://${host}` : 'https://windrose.ai';
}

module.exports = {
  COOKIE_NAME, LINK_TTL_SEC, SESSION_TTL_SEC,
  verify, makeLinkToken, makeSessionToken,
  isAllowed, validEmail, safeNext,
  sessionCookie, clearCookie, siteBase, sessionFromCookies,
};
